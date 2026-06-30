import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { ReportsService } from './reports.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser, AuthUser } from '../../common/decorators/current-user.decorator';

@ApiTags('reports')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('reports')
export class ReportsController {
  constructor(private reportsService: ReportsService) {}

  @Get('revenue')
  revenue(@CurrentUser() user: AuthUser, @Query('branchId') branchId?: string, @Query('months') months?: string) {
    return this.reportsService.revenueReport(user, branchId, months ? parseInt(months, 10) : undefined);
  }

  @Get('fee-collection')
  feeCollection(@CurrentUser() user: AuthUser, @Query('branchId') branchId?: string) {
    return this.reportsService.feeCollectionReport(user, branchId);
  }

  @Get('admissions-trend')
  admissionsTrend(
    @CurrentUser() user: AuthUser,
    @Query('branchId') branchId?: string,
    @Query('months') months?: string,
  ) {
    return this.reportsService.admissionsTrendReport(user, branchId, months ? parseInt(months, 10) : undefined);
  }

  @Get('lead-conversion-funnel')
  leadConversionFunnel(@CurrentUser() user: AuthUser, @Query('branchId') branchId?: string) {
    return this.reportsService.leadConversionFunnel(user, branchId);
  }
}
