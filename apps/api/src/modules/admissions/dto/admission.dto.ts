import {
  IsDateString,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { AdmissionStatus, Gender } from '@prisma/client';

export class CreateAdmissionDto {
  @IsString()
  @IsNotEmpty()
  branchId: string;

  @IsOptional()
  @IsString()
  leadId?: string;

  @IsString()
  @IsNotEmpty()
  childName: string;

  @IsDateString()
  childDob: string;

  @IsEnum(Gender)
  childGender: Gender;

  @IsString()
  @IsNotEmpty()
  guardianName: string;

  @IsOptional()
  @IsString()
  guardianRelation?: string;

  @IsString()
  @IsNotEmpty()
  guardianPhone: string;

  @IsOptional()
  @IsEmail()
  guardianEmail?: string;

  @IsOptional()
  @IsString()
  guardianCnic?: string;

  @IsOptional()
  @IsString()
  emergencyContactName?: string;

  @IsOptional()
  @IsString()
  emergencyContactPhone?: string;

  @IsOptional()
  @IsString()
  emergencyRelation?: string;

  @IsOptional()
  @IsString()
  medicalHistory?: string;

  @IsOptional()
  @IsString()
  diagnosis?: string;

  @IsOptional()
  @IsString()
  allergies?: string;

  @IsOptional()
  @IsString()
  medications?: string;
}

export class UpdateAdmissionDto {
  @IsOptional()
  @IsString()
  childName?: string;

  @IsOptional()
  @IsDateString()
  childDob?: string;

  @IsOptional()
  @IsEnum(Gender)
  childGender?: Gender;

  @IsOptional()
  @IsString()
  guardianName?: string;

  @IsOptional()
  @IsString()
  guardianRelation?: string;

  @IsOptional()
  @IsString()
  guardianPhone?: string;

  @IsOptional()
  @IsEmail()
  guardianEmail?: string;

  @IsOptional()
  @IsString()
  guardianCnic?: string;

  @IsOptional()
  @IsString()
  emergencyContactName?: string;

  @IsOptional()
  @IsString()
  emergencyContactPhone?: string;

  @IsOptional()
  @IsString()
  emergencyRelation?: string;

  @IsOptional()
  @IsString()
  medicalHistory?: string;

  @IsOptional()
  @IsString()
  diagnosis?: string;

  @IsOptional()
  @IsString()
  allergies?: string;

  @IsOptional()
  @IsString()
  medications?: string;
}

export class ChangeAdmissionStatusDto {
  @IsEnum(AdmissionStatus)
  status: AdmissionStatus;

  @IsOptional()
  @IsString()
  rejectedReason?: string;
}
