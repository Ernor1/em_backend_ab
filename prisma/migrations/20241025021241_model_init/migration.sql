/*
  Warnings:

  - Added the required column `attendanceSettingId` to the `Department` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Attendance" ALTER COLUMN "entryTime" SET DATA TYPE TEXT,
ALTER COLUMN "exitTime" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "AttendanceSetting" ALTER COLUMN "startTime" SET DATA TYPE TEXT,
ALTER COLUMN "endTime" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Department" ADD COLUMN     "attendanceSettingId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Department" ADD CONSTRAINT "Department_attendanceSettingId_fkey" FOREIGN KEY ("attendanceSettingId") REFERENCES "AttendanceSetting"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
