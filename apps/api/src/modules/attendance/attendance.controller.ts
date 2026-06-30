import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AttendeeType } from '@prisma/client';
import { AttendanceService } from './attendance.service';
import { BulkMarkAttendanceDto, MarkAttendanceDto } from './dto/attendance.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { RequirePermissions } from '../../common/decorators/permissions.decorator';
import { CurrentUser, AuthUser } from '../../common/decorators/current-user.decorator';

@ApiTags('attendance')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('attendance')
export class AttendanceController {
  constructor(private attendanceService: AttendanceService) {}

  @Post()
  @RequirePermissions('attendance:create')
  markAttendance(@CurrentUser() user: AuthUser, @Body() dto: MarkAttendanceDto) {
    return this.attendanceService.markAttendance(user, dto);
  }

  @Post('bulk')
  @RequirePermissions('attendance:create')
  bulkMark(@CurrentUser() user: AuthUser, @Body() dto: BulkMarkAttendanceDto) {
    return this.attendanceService.bulkMark(user, dto);
  }

  @Get('by-date')
  @RequirePermissions('attendance:read')
  findByDate(
    @CurrentUser() user: AuthUser,
    @Query('branchId') branchId: string | undefined,
    @Query('date') date: string,
    @Query('attendeeType') attendeeType?: AttendeeType,
  ) {
    return this.attendanceService.findByDate(user, branchId, date, attendeeType);
  }

  @Get('monthly')
  @RequirePermissions('attendance:read')
  findMonthly(
    @CurrentUser() user: AuthUser,
    @Query('branchId') branchId: string | undefined,
    @Query('year') year: string,
    @Query('month') month: string,
    @Query('attendeeType') attendeeType?: AttendeeType,
    @Query('childId') childId?: string,
    @Query('staffId') staffId?: string,
  ) {
    return this.attendanceService.findMonthly(
      user,
      branchId,
      parseInt(year, 10),
      parseInt(month, 10),
      attendeeType,
      childId,
      staffId,
    );
  }

  @Get('stats')
  @RequirePermissions('attendance:read')
  getStats(
    @CurrentUser() user: AuthUser,
    @Query('branchId') branchId?: string,
    @Query('date') date?: string,
  ) {
    return this.attendanceService.getAttendanceStats(user, branchId, date);
  }
}
