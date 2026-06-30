import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { RolesService } from './roles.service';
import { CreatePermissionDto, CreateRoleDto, UpdateRoleDto } from './dto/role.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { RequirePermissions } from '../../common/decorators/permissions.decorator';

@ApiTags('roles')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('roles')
export class RolesController {
  constructor(private rolesService: RolesService) {}

  @Post()
  @RequirePermissions('roles:create')
  createRole(@Body() dto: CreateRoleDto) {
    return this.rolesService.createRole(dto);
  }

  @Get()
  @RequirePermissions('roles:read')
  findAllRoles() {
    return this.rolesService.findAllRoles();
  }

  @Get('permissions')
  @RequirePermissions('roles:read')
  findAllPermissions() {
    return this.rolesService.findAllPermissions();
  }

  @Post('permissions')
  @RequirePermissions('roles:manage')
  createPermission(@Body() dto: CreatePermissionDto) {
    return this.rolesService.createPermission(dto);
  }

  @Get(':id')
  @RequirePermissions('roles:read')
  findOneRole(@Param('id') id: string) {
    return this.rolesService.findOneRole(id);
  }

  @Patch(':id')
  @RequirePermissions('roles:update')
  updateRole(@Param('id') id: string, @Body() dto: UpdateRoleDto) {
    return this.rolesService.updateRole(id, dto);
  }

  @Delete(':id')
  @RequirePermissions('roles:delete')
  removeRole(@Param('id') id: string) {
    return this.rolesService.removeRole(id);
  }
}
