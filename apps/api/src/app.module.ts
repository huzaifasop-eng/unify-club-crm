import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './modules/prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { BranchesModule } from './modules/branches/branches.module';
import { RolesModule } from './modules/roles/roles.module';
import { LeadsModule } from './modules/leads/leads.module';
import { AdmissionsModule } from './modules/admissions/admissions.module';
import { ChildrenModule } from './modules/children/children.module';
import { CallsModule } from './modules/calls/calls.module';
import { TrialsModule } from './modules/trials/trials.module';
import { SportsModule } from './modules/sports/sports.module';
import { TherapyModule } from './modules/therapy/therapy.module';
import { PayrollModule } from './modules/payroll/payroll.module';
import { FinanceModule } from './modules/finance/finance.module';
import { ExpensesModule } from './modules/expenses/expenses.module';
import { InventoryModule } from './modules/inventory/inventory.module';
import { MarketingModule } from './modules/marketing/marketing.module';
import { EventsModule } from './modules/events/events.module';
import { DocumentsModule } from './modules/documents/documents.module';
import { CalendarModule } from './modules/calendar/calendar.module';
import { FeesModule } from './modules/fees/fees.module';
import { AttendanceModule } from './modules/attendance/attendance.module';
import { HrModule } from './modules/hr/hr.module';
import { NotificationModule } from './modules/notifications/notification.module';
import { StorageModule } from './modules/storage/storage.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    UsersModule,
    BranchesModule,
    RolesModule,
    LeadsModule,
    AdmissionsModule,
    ChildrenModule,
    CallsModule,
    TrialsModule,
    SportsModule,
    TherapyModule,
    PayrollModule,
    FinanceModule,
    ExpensesModule,
    InventoryModule,
    MarketingModule,
    EventsModule,
    DocumentsModule,
    CalendarModule,
    FeesModule,
    AttendanceModule,
    HrModule,
    NotificationModule,
    StorageModule,
  ],
})
export class AppModule {}
