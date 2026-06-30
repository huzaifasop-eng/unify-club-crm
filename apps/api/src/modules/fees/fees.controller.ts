import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { InvoiceStatus } from '@prisma/client';
import { FeesService } from './fees.service';
import {
  CreateFeeStructureDto,
  CreateInvoiceDto,
  RecordPaymentDto,
  UpdateFeeStructureDto,
} from './dto/fee.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { RequirePermissions } from '../../common/decorators/permissions.decorator';
import { CurrentUser, AuthUser } from '../../common/decorators/current-user.decorator';
import { PaginationQueryDto } from '../../common/dto/pagination.dto';

@ApiTags('fees')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('fees')
export class FeesController {
  constructor(private feesService: FeesService) {}

  // -- Fee Structures -----------------------------------------------------

  @Post('fee-structures')
  @RequirePermissions('fees:create')
  createFeeStructure(@CurrentUser() user: AuthUser, @Body() dto: CreateFeeStructureDto) {
    return this.feesService.createFeeStructure(user, dto);
  }

  @Get('fee-structures')
  @RequirePermissions('fees:read')
  findAllFeeStructures(@CurrentUser() user: AuthUser, @Query('branchId') branchId?: string) {
    return this.feesService.findAllFeeStructures(user, branchId);
  }

  @Patch('fee-structures/:id')
  @RequirePermissions('fees:update')
  updateFeeStructure(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
    @Body() dto: UpdateFeeStructureDto,
  ) {
    return this.feesService.updateFeeStructure(user, id, dto);
  }

  @Delete('fee-structures/:id')
  @RequirePermissions('fees:delete')
  removeFeeStructure(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.feesService.removeFeeStructure(user, id);
  }

  // -- Invoices -------------------------------------------------------------
  // NOTE: more specific routes must be declared before ':id' to avoid collision.

  @Get('invoices/reports/outstanding')
  @RequirePermissions('fees:read')
  outstandingReport(@CurrentUser() user: AuthUser, @Query('branchId') branchId?: string) {
    return this.feesService.outstandingReport(user, branchId);
  }

  @Post('invoices')
  @RequirePermissions('fees:create')
  createInvoice(@CurrentUser() user: AuthUser, @Body() dto: CreateInvoiceDto) {
    return this.feesService.createInvoice(user, dto);
  }

  @Get('invoices')
  @RequirePermissions('fees:read')
  findAllInvoices(
    @CurrentUser() user: AuthUser,
    @Query() query: PaginationQueryDto & { status?: InvoiceStatus; childId?: string },
  ) {
    return this.feesService.findAllInvoices(user, query);
  }

  @Get('invoices/:id')
  @RequirePermissions('fees:read')
  findOneInvoice(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.feesService.findOneInvoice(user, id);
  }

  @Post('invoices/:id/payments')
  @RequirePermissions('fees:create')
  recordPayment(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
    @Body() dto: RecordPaymentDto,
  ) {
    return this.feesService.recordPayment(user, id, dto);
  }
}
