import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { EmploymentStatus, LeaveStatus } from '@prisma/client';
import { HrService } from './hr.service';
import {
  CreateLeaveRequestDto,
  CreateStaffDto,
  UpdateLeaveStatusDto,
  UpdateStaffDto,
} from './dto/hr.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { RequirePermissions } from '../../common/decorators/permissions.decorator';
import { CurrentUser, AuthUser } from '../../common/decorators/current-user.decorator';
import { PaginationQueryDto } from '../../common/dto/pagination.dto';

@ApiTags('hr')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('hr')
export class HrController {
  constructor(private hrService: HrService) {}

  @Post('staff')
  @RequirePermissions('hr:create')
  createStaff(@Body() dto: CreateStaffDto) {
    return this.hrService.createStaff(dto);
  }

  @Get('staff')
  @RequirePermissions('hr:read')
  findAllStaff(
    @CurrentUser() user: AuthUser,
    @Query() query: PaginationQueryDto & { department?: string; status?: EmploymentStatus },
  ) {
    return this.hrService.findAllStaff(user, query);
  }

  @Get('staff/:id')
  @RequirePermissions('hr:read')
  findOneStaff(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.hrService.findOneStaff(user, id);
  }

  @Patch('staff/:id')
  @RequirePermissions('hr:update')
  updateStaff(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
    @Body() dto: UpdateStaffDto,
  ) {
    return this.hrService.updateStaff(user, id, dto);
  }

  @Delete('staff/:id')
  @RequirePermissions('hr:delete')
  removeStaff(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.hrService.removeStaff(user, id);
  }

  @Post('leave-requests')
  @RequirePermissions('hr:create')
  createLeaveRequest(@CurrentUser() user: AuthUser, @Body() dto: CreateLeaveRequestDto) {
    return this.hrService.createLeaveRequest(user, dto);
  }

  @Get('leave-requests')
  @RequirePermissions('hr:read')
  findLeaveRequests(
    @CurrentUser() user: AuthUser,
    @Query() query: PaginationQueryDto & { staffId?: string; status?: LeaveStatus },
  ) {
    return this.hrService.findLeaveRequests(user, query);
  }

  @Patch('leave-requests/:id/status')
  @RequirePermissions('hr:update')
  updateLeaveStatus(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
    @Body() dto: UpdateLeaveStatusDto,
  ) {
    return this.hrService.updateLeaveStatus(user, id, dto);
  }
}
