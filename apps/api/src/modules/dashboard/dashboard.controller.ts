import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser, AuthUser } from '../../common/decorators/current-user.decorator';

@ApiTags('dashboard')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('dashboard')
export class DashboardController {
  constructor(private dashboardService: DashboardService) {}

  @Get('kpis')
  getKpis(@CurrentUser() user: AuthUser, @Query('branchId') branchId?: string) {
    return this.dashboardService.getKpis(user, branchId);
  }

  @Get('lead-trend')
  getLeadTrend(
    @CurrentUser() user: AuthUser,
    @Query('branchId') branchId?: string,
    @Query('days') days?: string,
  ) {
    return this.dashboardService.getLeadTrend(user, branchId, days ? parseInt(days, 10) : undefined);
  }

  @Get('revenue-trend')
  getRevenueTrend(
    @CurrentUser() user: AuthUser,
    @Query('branchId') branchId?: string,
    @Query('months') months?: string,
  ) {
    return this.dashboardService.getRevenueTrend(
      user,
      branchId,
      months ? parseInt(months, 10) : undefined,
    );
  }

  @Get('recent-activity')
  getRecentActivity(@CurrentUser() user: AuthUser, @Query('branchId') branchId?: string) {
    return this.dashboardService.getRecentActivity(user, branchId);
  }
}
