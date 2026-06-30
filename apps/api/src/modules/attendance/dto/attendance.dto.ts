import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { AttendanceStatus, AttendeeType } from '@prisma/client';

// NOTE: exactly one of childId/staffId must be provided, matching attendeeType
// (CHILD -> childId, STAFF -> staffId). This is enforced in the service layer
// rather than via a class-validator decorator.
export class MarkAttendanceDto {
  @IsString()
  @IsNotEmpty()
  branchId: string;

  @IsEnum(AttendeeType)
  attendeeType: AttendeeType;

  @IsOptional()
  @IsString()
  childId?: string;

  @IsOptional()
  @IsString()
  staffId?: string;

  @IsDateString()
  date: string;

  @IsEnum(AttendanceStatus)
  status: AttendanceStatus;

  @IsOptional()
  @IsDateString()
  checkInTime?: string;

  @IsOptional()
  @IsDateString()
  checkOutTime?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class BulkAttendanceRecordDto {
  @IsOptional()
  @IsString()
  childId?: string;

  @IsOptional()
  @IsString()
  staffId?: string;

  @IsEnum(AttendanceStatus)
  status: AttendanceStatus;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class BulkMarkAttendanceDto {
  @IsString()
  @IsNotEmpty()
  branchId: string;

  @IsDateString()
  date: string;

  @IsEnum(AttendeeType)
  attendeeType: AttendeeType;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => BulkAttendanceRecordDto)
  records: BulkAttendanceRecordDto[];
}
