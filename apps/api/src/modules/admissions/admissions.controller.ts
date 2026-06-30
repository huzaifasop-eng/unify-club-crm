import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AdmissionStatus } from '@prisma/client';
import { AdmissionsService } from './admissions.service';
import {
  ChangeAdmissionStatusDto,
  CreateAdmissionDto,
  UpdateAdmissionDto,
} from './dto/admission.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { RequirePermissions } from '../../common/decorators/permissions.decorator';
import { CurrentUser, AuthUser } from '../../common/decorators/current-user.decorator';
import { PaginationQueryDto } from '../../common/dto/pagination.dto';

@ApiTags('admissions')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('admissions')
export class AdmissionsController {
  constructor(private admissionsService: AdmissionsService) {}

  @Post()
  @RequirePermissions('admissions:create')
  create(@CurrentUser() user: AuthUser, @Body() dto: CreateAdmissionDto) {
    return this.admissionsService.create(user, dto);
  }

  @Get()
  @RequirePermissions('admissions:read')
  findAll(
    @CurrentUser() user: AuthUser,
    @Query() query: PaginationQueryDto & { status?: AdmissionStatus },
  ) {
    return this.admissionsService.findAll(user, query);
  }

  @Get(':id')
  @RequirePermissions('admissions:read')
  findOne(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.admissionsService.findOne(user, id);
  }

  @Patch(':id')
  @RequirePermissions('admissions:update')
  update(@CurrentUser() user: AuthUser, @Param('id') id: string, @Body() dto: UpdateAdmissionDto) {
    return this.admissionsService.update(user, id, dto);
  }

  @Patch(':id/status')
  @RequirePermissions('admissions:update')
  changeStatus(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
    @Body() dto: ChangeAdmissionStatusDto,
  ) {
    return this.admissionsService.changeStatus(user, id, dto);
  }

  @Delete(':id')
  @RequirePermissions('admissions:delete')
  remove(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.admissionsService.remove(user, id);
  }
}
