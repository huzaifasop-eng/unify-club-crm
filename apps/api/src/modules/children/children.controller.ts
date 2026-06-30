import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { ChildrenService } from './children.service';
import { CreateChildDto, CreateProgressNoteDto, UpdateChildDto } from './dto/child.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { RequirePermissions } from '../../common/decorators/permissions.decorator';
import { CurrentUser, AuthUser } from '../../common/decorators/current-user.decorator';
import { PaginationQueryDto } from '../../common/dto/pagination.dto';

@ApiTags('children')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('children')
export class ChildrenController {
  constructor(private childrenService: ChildrenService) {}

  @Post()
  @RequirePermissions('children:create')
  create(@CurrentUser() user: AuthUser, @Body() dto: CreateChildDto) {
    return this.childrenService.create(user, dto);
  }

  @Get()
  @RequirePermissions('children:read')
  findAll(@CurrentUser() user: AuthUser, @Query() query: PaginationQueryDto) {
    return this.childrenService.findAll(user, query);
  }

  @Get(':id')
  @RequirePermissions('children:read')
  findOne(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.childrenService.findOne(user, id);
  }

  @Patch(':id')
  @RequirePermissions('children:update')
  update(@CurrentUser() user: AuthUser, @Param('id') id: string, @Body() dto: UpdateChildDto) {
    return this.childrenService.update(user, id, dto);
  }

  @Delete(':id')
  @RequirePermissions('children:delete')
  remove(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.childrenService.remove(user, id);
  }

  @Post(':id/progress-notes')
  @RequirePermissions('children:update')
  addProgressNote(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
    @Body() dto: CreateProgressNoteDto,
  ) {
    return this.childrenService.addProgressNote(user, id, dto);
  }

  @Get(':id/progress-notes')
  @RequirePermissions('children:read')
  getProgressNotes(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.childrenService.getProgressNotes(user, id);
  }
}
