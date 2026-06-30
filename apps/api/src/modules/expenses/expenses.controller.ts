import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { ExpensesService } from './expenses.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

/**
 * Placeholder controller for the Expenses module.
 * Full CRUD + business logic is out of scope for this pass; this module
 * exists so the schema, nav entry, and API surface are consistent and
 * ready to be expanded later without breaking links.
 */
@ApiTags('expenses')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('expenses')
export class ExpensesController {
  constructor(private expensesService: ExpensesService) {}

  @Get()
  findAll() {
    return this.expensesService.findAll();
  }
}
