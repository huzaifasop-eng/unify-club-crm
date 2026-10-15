import { IsEmail, IsIn, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

/**
 * Submission shape accepted from the public marketing website (website/).
 * Deliberately looser than CreateLeadDto: a public visitor has no branchId,
 * no assignedToId, and the three website forms (Book a Trial, Contact,
 * Volunteer) each collect a slightly different, overlapping set of fields.
 * Form-specific extras are folded into `notes` by the service rather than
 * requiring a schema change — see website/docs/DATABASE.md §4.
 */
export class CreatePublicLeadDto {
  @IsIn(['trial', 'contact', 'volunteer'])
  formType: 'trial' | 'contact' | 'volunteer';

  @IsString()
  @MinLength(1)
  @MaxLength(200)
  parentName: string;

  // Optional because the Contact form doesn't collect a phone number —
  // the service falls back to a placeholder since Lead.parentPhone is
  // required in the schema. Trial/Volunteer forms still collect it.
  @IsOptional()
  @IsString()
  @MaxLength(40)
  phone?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  childName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  childAge?: string;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  program?: string;

  @IsOptional()
  @IsString()
  @MaxLength(40)
  preferredDay?: string;

  @IsOptional()
  @IsString()
  @MaxLength(40)
  preferredTime?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  subject?: string;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  interestArea?: string;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  availability?: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  message?: string;

  /**
   * Honeypot field. Real visitors never see or fill this (hidden via CSS on
   * the website); a non-empty value here means a bot filled every field.
   * Not persisted — checked and discarded in the controller.
   */
  @IsOptional()
  @IsString()
  website?: string;
}
