import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { LeadStage } from '@prisma/client';
import { LeadsService } from './leads.service';
import { ChangeLeadStageDto, CreateLeadDto, UpdateLeadDto } from './dto/lead.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { RequirePermissions } from '../../common/decorators/permissions.decorator';
import { CurrentUser, AuthUser } from '../../common/decorators/current-user.decorator';
import { PaginationQueryDto } from '../../common/dto/pagination.dto';

@ApiTags('leads')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('leads')
export class LeadsController {
  constructor(private leadsService: LeadsService) {}

  @Post()
  @RequirePermissions('leads:create')
  create(@CurrentUser() user: AuthUser, @Body() dto: CreateLeadDto) {
    return this.leadsService.create(user, dto);
  }

  @Get()
  @RequirePermissions('leads:read')
  findAll(@CurrentUser() user: AuthUser, @Query() query: PaginationQueryDto & { stage?: LeadStage }) {
    return this.leadsService.findAll(user, query);
  }

  @Get('kanban')
  @RequirePermissions('leads:read')
  findKanban(@CurrentUser() user: AuthUser, @Query('branchId') branchId?: string) {
    return this.leadsService.findKanban(user, branchId);
  }

  @Get('funnel')
  @RequirePermissions('leads:read')
  funnel(@CurrentUser() user: AuthUser, @Query('branchId') branchId?: string) {
    return this.leadsService.pipelineFunnel(user, branchId);
  }

  @Get(':id')
  @RequirePermissions('leads:read')
  findOne(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.leadsService.findOne(user, id);
  }

  @Patch(':id')
  @RequirePermissions('leads:update')
  update(@CurrentUser() user: AuthUser, @Param('id') id: string, @Body() dto: UpdateLeadDto) {
    return this.leadsService.update(user, id, dto);
  }

  @Patch(':id/stage')
  @RequirePermissions('leads:update')
  changeStage(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
    @Body() dto: ChangeLeadStageDto,
  ) {
    return this.leadsService.changeStage(user, id, dto);
  }

  @Delete(':id')
  @RequirePermissions('leads:delete')
  remove(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.leadsService.remove(user, id);
  }
}
