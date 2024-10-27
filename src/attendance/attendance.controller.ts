import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, Res } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/guards/auth.guard';
import { ApiResponse } from 'src/responses/api.response';
import { Response } from 'express';
import * as ExcelJS from 'exceljs';
import { format } from 'date-fns';
import { CheckInAttendanceDto } from './dto/checkin.dto';
import { checkOutAttendanceDto } from './dto/checkout.dto';
@ApiTags('Attendance')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) { }

  @Post()
  async create(@Body() createAttendanceDto: CreateAttendanceDto) {
    try {
      return new ApiResponse(true, 'Attendance created successfully', await this.attendanceService.create(createAttendanceDto));
    } catch (e) {
      return new ApiResponse(false, e.message, null);
    }
  }
  @Post('/checkin')
  async checkIn(@Body() createAttendanceDto: CheckInAttendanceDto) {
    try {
      return new ApiResponse(true, 'Attendance checked in successfully', await this.attendanceService.create(createAttendanceDto));
    } catch (e) {
      return new ApiResponse(false, e.message, null);
    }
  }
  @Post('/checkout')
  async checkOut(@Body() createAttendanceDto: checkOutAttendanceDto) {
    try {
      return new ApiResponse(true, 'Attendance checked out successfully', await this.attendanceService.create(createAttendanceDto));
    } catch (e) {
      return new ApiResponse(false, e.message, null);
    }
  }

  @Get()
  async findAll() {
    try {
      return new ApiResponse(true, 'Attendance fetched successfully', await this.attendanceService.findAll());
    } catch (e) {
      return new ApiResponse(false, e.message, null);
    }
  }
  @Get('department/:id')
  async findByDepartment(@Param('id') id: string) {
    try {
      return new ApiResponse(true, 'Attendance fetched successfully', await this.attendanceService.findAllByDepartment(id));
    } catch (e) {
      return new ApiResponse(false, e.message, null);
    }
  }


  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      return new ApiResponse(true, 'Attendance fetched successfully', await this.attendanceService.findOne(id));
    } catch (e) {
      return new ApiResponse(false, e.message, null);
    }
  }
  @Get('department/:departmentId/download')
  @ApiOperation({ summary: 'Download department attendance report as Excel' })
  async downloadDepartmentReport(
    @Param('departmentId') departmentId: string,
    @Res() res: Response
  ) {
    try {
      // Get report data
      const reportData = await this.attendanceService.makeReportByDepartment(departmentId);

      // Create a new workbook
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Attendance Report');

      // Style for headers
      const headerStyle: Partial<ExcelJS.Style> = {
        font: {
          bold: true,
          color: { argb: 'FFFFFF' }
        },
        fill: {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: '4472C4' }
        } as ExcelJS.FillPattern,
        alignment: {
          horizontal: 'center' as const
        }
      };

      // Add headers
      worksheet.addRow(['Date', 'Employee Name', 'Email', 'Status', 'Entry Time', 'Exit Time']);
      worksheet.getRow(1).eachCell((cell) => {
        cell.style = headerStyle;
      });

      // Add data
      Object.entries(reportData.dateWiseAttendance).forEach(([date, employees]: any) => {
        employees.forEach((employee) => {
          const attendance = employee.attendance;
          worksheet.addRow([
            date,
            employee.employeeName,
            employee.employeeEmail,
            attendance.status,
            attendance.entryTime ?? '-',
            attendance.exitTime ?? '-'
          ]);
        });
      });

      // Style and formatting
      worksheet.columns.forEach((column) => {
        column.width = 20;
      });

      // Add summary sheet
      const summarySheet = workbook.addWorksheet('Summary');

      // Add summary headers
      summarySheet.addRow(['Metric', 'Value']);
      summarySheet.getRow(1).eachCell((cell) => {
        cell.style = headerStyle;
      });

      // Calculate summary statistics
      const stats = this.calculateSummaryStatistics(reportData);

      Object.entries(stats).forEach(([metric, value]) => {
        summarySheet.addRow([metric, value]);
      });

      // Set response headers
      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      );
      res.setHeader(
        'Content-Disposition',
        `attachment; filename=attendance-report-${format(new Date(), 'yyyy-MM-dd')}.xlsx`,
      );

      // Write to response
      await workbook.xlsx.write(res);
      res.end();
    } catch (error) {
      console.error('Error generating Excel report:', error);
      throw error;
    }
  }

  private calculateSummaryStatistics(reportData: any) {
    const stats = {
      'Total Employees': 0,
      'Present Count': 0,
      'Late Count': 0,
      'Absent Count': 0,
      'Half Day Count': 0,
      'Work From Home Count': 0,
      'Average Attendance Rate': '0%',
    };

    let totalRecords = 0;
    Object.values(reportData.dateWiseAttendance).forEach((dayAttendance: any[]) => {
      stats['Total Employees'] = dayAttendance.length;
      totalRecords += dayAttendance.length;

      dayAttendance.forEach((record) => {
        switch (record.attendance.status) {
          case 'PRESENT':
            stats['Present Count']++;
            break;
          case 'LATE':
            stats['Late Count']++;
            break;
          case 'ABSENT':
            stats['Absent Count']++;
            break;
          case 'HALF_DAY':
            stats['Half Day Count']++;
            break;
          case 'WORK_FROM_HOME':
            stats['Work From Home Count']++;
            break;
        }
      });
    });

    const presentEquivalent =
      stats['Present Count'] +
      stats['Work From Home Count'] +
      (stats['Late Count'] * 0.8) +
      (stats['Half Day Count'] * 0.5);

    stats['Average Attendance Rate'] =
      `${((presentEquivalent / totalRecords) * 100).toFixed(2)}%`;

    return stats;
  }

  @Get('department/:departmentId/preview')
  @ApiOperation({ summary: 'Preview department attendance report data' })
  async previewDepartmentReport(
    @Param('departmentId') departmentId: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.attendanceService.makeReportByDepartment(departmentId);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateAttendanceDto: UpdateAttendanceDto) {
    try {
      return new ApiResponse(true, 'Attendance updated successfully', await this.attendanceService.update(id, updateAttendanceDto));
    }
    catch (e) {
      return new ApiResponse(false, e.message, null);
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      return new ApiResponse(true, 'Attendance deleted successfully', await this.attendanceService.remove(id));
    } catch (e) {
      return new ApiResponse(false, e.message, null);
    }
  }
}
