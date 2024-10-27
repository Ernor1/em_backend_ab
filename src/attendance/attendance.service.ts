import { Injectable } from '@nestjs/common';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';
import { DatabaseService } from 'src/database/database.service';
import { AttendanceStatus } from '@prisma/client';
import { MailService } from 'src/mail/mail.service';
import { OpenAiService } from 'src/openai/openai.service';

@Injectable()
export class AttendanceService {
  constructor(private readonly databaseService: DatabaseService, private readonly mailService: MailService, private readonly aiService: OpenAiService) {

  }
  async generateAttendanceEmailContent(status: AttendanceStatus, employeeName: string): Promise<string> {
    let prompt = '';

    switch (status) {
      case AttendanceStatus.PRESENT:
        prompt = `Generate a positive, encouraging email message for ${employeeName} who arrived at work on time today. 
                 Congratulate them on their punctuality and express how it contributes to the team's success. 
                 Keep the tone professional but warm. Maximum 3 paragraphs.`;
        break;
      case AttendanceStatus.LATE:
        prompt = `Generate a constructive and supportive email message for ${employeeName} who arrived late to work today. 
                 Remind them about the importance of punctuality while maintaining a positive and encouraging tone. 
                 Offer support if they're facing any challenges and remind them they're a valued team member. 
                 Keep the message empathetic and solution-oriented. Maximum 3 paragraphs.`;
        break;
      case AttendanceStatus.HALF_DAY:
        prompt = `Generate a gentle reminder email for ${employeeName} regarding their half-day attendance. 
                 Express understanding while highlighting the importance of complete workdays for team collaboration. 
                 Keep the tone supportive and professional. Maximum 2 paragraphs.`;
        break;
      case AttendanceStatus.WORK_FROM_HOME:
        prompt = `Generate an encouraging email message for ${employeeName} who is working from home today. 
                 Include reminders about staying connected with the team and maintaining productivity. 
                 Keep the tone positive and supportive. Maximum 2 paragraphs.`;
        break;
      default:
        prompt = `Generate a professional email message for ${employeeName} regarding their attendance today. 
                 Keep the tone neutral and informative. Maximum 2 paragraphs.`;
    }

    return await this.aiService.generateText(prompt);
  }

  async sendAttendanceEmail(email: string, status: AttendanceStatus, emailContent: string) {
    const subject = this.getEmailSubject(status);

    await this.mailService.sendEmployeeAttendanceEmail(
      email,
      subject,
      emailContent
    );
  }

  private getEmailSubject(status: AttendanceStatus): string {
    switch (status) {
      case AttendanceStatus.PRESENT:
        return "🌟 Great Start to Your Day!";
      case AttendanceStatus.LATE:
        return "📝 Today's Attendance Update";
      case AttendanceStatus.HALF_DAY:
        return "💼 Half-Day Attendance Notice";
      case AttendanceStatus.WORK_FROM_HOME:
        return "🏠 Work From Home Attendance Confirmation";
      default:
        return "📊 Daily Attendance Update";
    }
  }
  async create(createAttendanceDto: any) {
    try {
      if (!createAttendanceDto.employeeEmail) {
        throw new Error('Employee email is required');
      }

      const employee = await this.databaseService.employee.findFirstOrThrow({
        where: {
          user: {
            email: createAttendanceDto.employeeEmail
          }
        },
        include: {
          department: {
            include: {
              attendanceSettings: true
            }
          },
          user: {
            select: {
              firstName: true,
              lastName: true,
              email: true
            }
          }
        }
      });

      // Get today's date without time to use in our attendance lookup
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Check if attendance exists for the employee today
      const existingAttendance = await this.databaseService.attendance.findFirst({
        where: {
          employeeId: employee.id,
          createdAt: {
            gte: today,           // Ensure the attendance record is created today
            lt: new Date(today.getTime() + 24 * 60 * 60 * 1000) // Ensure it's within the day range
          }
        }
      });

      // Verify entryTime if attendance exists for today
      if (existingAttendance) {
        const entryTimeExists = existingAttendance.entryTime;

        if (entryTimeExists && createAttendanceDto.checkIn) {
          throw new Error('Check-in already recorded for today');
        }
      }

      console.log(existingAttendance);

      const settings = employee.department.attendanceSettings;

      // Parse time ranges from settings for entry and exit limits
      const [entryStart, entryEnd] = settings.startTime.split('-');
      const entryStartTime = new Date(today);
      const entryEndTime = new Date(today);
      entryStartTime.setHours(parseInt(entryStart.split(':')[0]), parseInt(entryStart.split(':')[1]), 0, 0);
      entryEndTime.setHours(parseInt(entryEnd.split(':')[0]), parseInt(entryEnd.split(':')[1]), 0, 0);

      const [exitStart, exitEnd] = settings.endTime.split('-');
      const exitStartTime = new Date(today);
      const exitEndTime = new Date(today);
      exitStartTime.setHours(parseInt(exitStart.split(':')[0]), parseInt(exitStart.split(':')[1]), 0, 0);
      exitEndTime.setHours(parseInt(exitEnd.split(':')[0]), parseInt(exitEnd.split(':')[1]), 0, 0);

      if (existingAttendance) {
        if (createAttendanceDto.checkIn) {
          throw new Error('Check-in already recorded for today');
        }

        if (createAttendanceDto.checkOut) {
          const checkOutTime = new Date(`${today.toDateString()} ${createAttendanceDto.checkOut}`);

          // Determine attendance status based on checkout time range
          const status = checkOutTime >= exitStartTime && checkOutTime <= exitEndTime
            ? AttendanceStatus.PRESENT
            : AttendanceStatus.HALF_DAY;

          const result = await this.databaseService.attendance.update({
            where: { id: existingAttendance.id },
            data: {
              exitTime: createAttendanceDto.checkOut,
              status
            }
          });

          const emailContent = await this.generateAttendanceEmailContent(status, employee.user.firstName);
          await this.sendAttendanceEmail(employee.user.email, status, emailContent);
          return result;
        }
      } else {
        if (!createAttendanceDto.checkIn) {
          throw new Error('Check-in time is required');
        }

        const checkInTime = new Date(`${today.toDateString()} ${createAttendanceDto.checkIn}`);

        let status;
        if (checkInTime >= entryStartTime && checkInTime <= entryEndTime) {
          status = createAttendanceDto.workFromHome
            ? AttendanceStatus.WORK_FROM_HOME
            : AttendanceStatus.PRESENT;
        } else {
          status = AttendanceStatus.LATE;
        }

        const result = await this.databaseService.attendance.create({
          data: {
            entryTime: createAttendanceDto.checkIn,
            exitTime: createAttendanceDto.checkOut || null,
            employeeId: employee.id,
            attendanceSettingId: employee.department.attendanceSettingId,
            status
          }
        });

        const emailContent = await this.generateAttendanceEmailContent(status, employee.user.firstName);
        await this.sendAttendanceEmail(employee.user.email, status, emailContent);
        return result;
      }
    } catch (error) {
      throw error;
    }
  }



  async findAll() {
    try {
      return await this.databaseService.attendance.findMany();
    } catch (e) {
      throw e;
    }
  }
  async findAllByDepartment(departmentId: string) {
    try {
      return await this.databaseService.attendance.findMany({
        where: {
          employee: {
            departmentId
          }
        }
      });
    } catch (e) {
      throw e;
    }
  } async makeReportByDepartment(departmentId: string) {
    try {
      // Get all employees in the department with necessary relations
      const employees = await this.databaseService.employee.findMany({
        where: { departmentId },
        include: {
          user: true,
          department: { include: { attendanceSettings: true } },
        },
      });

      // Set up date range (last 30 days, including today)
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + 1); // Move endDate to tomorrow to include today's records
      endDate.setHours(23, 59, 59, 999); // Set time to the end of the day
      const startDate = new Date();
      startDate.setDate(endDate.getDate() - 29); // 30 days including today
      startDate.setHours(0, 0, 0, 0); // Start at midnight on the first day of the range

      // Retrieve attendance records for employees in the date range
      const attendanceRecords = await this.databaseService.attendance.findMany({
        where: {
          employeeId: { in: employees.map(emp => emp.id) },
          createdAt: {
            gte: startDate,  // Greater than or equal to startDate
            lte: endDate     // Less than or equal to endDate
          }
        },
        orderBy: { entryTime: 'asc' },
      });

      // Create a map for attendance records by employeeId and date for quicker access
      const attendanceMap = {};
      attendanceRecords.forEach(record => {
        const recordDate = new Date(record.createdAt).toISOString().split('T')[0];
        if (!attendanceMap[record.employeeId]) {
          attendanceMap[record.employeeId] = {};
        }
        attendanceMap[record.employeeId][recordDate] = record;
      });

      // Generate an array of dates in the range (inclusive of today)
      const dateArray = Array.from({ length: 30 }, (_, i) => {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + i);
        return date;
      });

      // Create the report structure
      const report = {
        departmentId,
        dateRange: { start: startDate.toISOString(), end: endDate.toISOString() },
        employeeAttendance: [],
      };

      for (const employee of employees) {
        const employeeReport = {
          employeeId: employee.id,
          employeeName: `${employee.user.firstName} ${employee.user.lastName}`,
          employeeEmail: employee.user.email,
          attendance: [],
        };

        for (const date of dateArray) {
          const dateStr = date.toISOString().split('T')[0];
          const isWeekend = date.getDay() === 0 || date.getDay() === 6;

          // Check if attendance exists for this employee on this date
          const attendance = attendanceMap[employee.id]?.[dateStr];

          if (attendance) {
            // Add existing attendance to the report
            employeeReport.attendance.push({
              date: dateStr,
              status: attendance?.status || AttendanceStatus.ABSENT, // Ensure status exists or fallback to ABSENT
              entryTime: attendance?.entryTime || undefined, // Fallback to null if no entry time
              exitTime: attendance?.exitTime || undefined,   // Fallback to null if no exit time
            });
          } else if (isWeekend) {
            // If there's no attendance and it's a weekend, mark as ABSENT for that day
            employeeReport.attendance.push({
              date: dateStr,
              status: AttendanceStatus.ABSENT,
              entryTime: null,
              exitTime: null,
            });
          } else {
            // Mark as absent for weekdays (no attendance found)
            employeeReport.attendance.push({
              date: dateStr,
              status: AttendanceStatus.ABSENT,
              entryTime: null,
              exitTime: null,
            });
          }
        }

        report.employeeAttendance.push(employeeReport);
      }

      // Create a grouped report by date
      const groupedReport = {
        departmentId,
        dateRange: report.dateRange,
        dateWiseAttendance: {},
      };

      dateArray.forEach(date => {
        console.log(date);
        const dateStr = date.toISOString().split('T')[0];
        groupedReport.dateWiseAttendance[dateStr] = report.employeeAttendance.map(emp => ({
          employeeId: emp.employeeId,
          employeeName: emp.employeeName,
          employeeEmail: emp.employeeEmail,
          attendance: emp.attendance.find(a => a.date === dateStr),
        }));
      });

      return groupedReport;
    } catch (error) {
      console.error("Error generating report:", error);
      throw error;
    }
  }





  async findOne(id: string) {
    try {
      return await this.databaseService.attendance.findUnique({
        where: { id }
      });
    } catch (e) {
      throw e;
    }
  }

  async update(id: string, updateAttendanceDto: UpdateAttendanceDto) {
    try {
      return await this.databaseService.attendance.update({
        where: { id },
        data: {
          entryTime: updateAttendanceDto.checkIn,
          exitTime: updateAttendanceDto.checkOut
        }
      });
    } catch (e) {
      throw e;
    }
  }

  async remove(id: string) {
    try {
      return await this.databaseService.attendance.delete({
        where: { id }
      });
    } catch (e) {
      throw e;
    }
  }
}
