// Shared TypeScript types mirroring the backend Prisma schema / DTOs.

export type Gender = 'MALE' | 'FEMALE' | 'OTHER';

export type LeadStage =
  | 'NEW_LEAD'
  | 'CONTACTED'
  | 'INTERESTED'
  | 'FOLLOW_UP'
  | 'TRIAL_BOOKED'
  | 'TRIAL_COMPLETED'
  | 'ADMISSION_PENDING'
  | 'ENROLLED'
  | 'LOST'
  | 'DUPLICATE'
  | 'JUNK';

export const LEAD_STAGES: LeadStage[] = [
  'NEW_LEAD',
  'CONTACTED',
  'INTERESTED',
  'FOLLOW_UP',
  'TRIAL_BOOKED',
  'TRIAL_COMPLETED',
  'ADMISSION_PENDING',
  'ENROLLED',
  'LOST',
  'DUPLICATE',
  'JUNK',
];

export const LEAD_STAGE_LABELS: Record<LeadStage, string> = {
  NEW_LEAD: 'New Lead',
  CONTACTED: 'Contacted',
  INTERESTED: 'Interested',
  FOLLOW_UP: 'Follow Up',
  TRIAL_BOOKED: 'Trial Booked',
  TRIAL_COMPLETED: 'Trial Completed',
  ADMISSION_PENDING: 'Admission Pending',
  ENROLLED: 'Enrolled',
  LOST: 'Lost',
  DUPLICATE: 'Duplicate',
  JUNK: 'Junk',
};

export type LeadPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
export type LeadSource =
  | 'WEBSITE'
  | 'REFERRAL'
  | 'WALK_IN'
  | 'SOCIAL_MEDIA'
  | 'PHONE_INQUIRY'
  | 'EVENT'
  | 'CAMPAIGN'
  | 'OTHER';

export interface BasicUserRef {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface Branch {
  id: string;
  name: string;
  code: string;
  address?: string | null;
  city?: string | null;
  phone?: string | null;
  email?: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Lead {
  id: string;
  branchId: string;
  branch?: Branch;
  parentName: string;
  parentPhone: string;
  parentEmail?: string | null;
  parentAddress?: string | null;
  childName: string;
  childDob?: string | null;
  childGender?: Gender | null;
  diagnosis?: string | null;
  diagnosisNotes?: string | null;
  source: LeadSource;
  stage: LeadStage;
  priority: LeadPriority;
  assignedToId?: string | null;
  assignedTo?: BasicUserRef | null;
  createdById?: string | null;
  createdBy?: BasicUserRef | null;
  followUpDate?: string | null;
  notes?: string | null;
  lostReason?: string | null;
  isDuplicate: boolean;
  createdAt: string;
  updatedAt: string;
}

export type AdmissionStatus =
  | 'DRAFT'
  | 'SUBMITTED'
  | 'UNDER_REVIEW'
  | 'APPROVED'
  | 'REJECTED'
  | 'ENROLLED'
  | 'WITHDRAWN';

export const ADMISSION_STATUSES: AdmissionStatus[] = [
  'DRAFT',
  'SUBMITTED',
  'UNDER_REVIEW',
  'APPROVED',
  'REJECTED',
  'ENROLLED',
  'WITHDRAWN',
];

export interface Admission {
  id: string;
  admissionNumber: string;
  branchId: string;
  branch?: Branch;
  leadId?: string | null;
  childId?: string | null;
  childName: string;
  childDob: string;
  childGender: Gender;
  guardianName: string;
  guardianRelation?: string | null;
  guardianPhone: string;
  guardianEmail?: string | null;
  guardianCnic?: string | null;
  emergencyContactName?: string | null;
  emergencyContactPhone?: string | null;
  emergencyRelation?: string | null;
  medicalHistory?: string | null;
  diagnosis?: string | null;
  allergies?: string | null;
  medications?: string | null;
  status: AdmissionStatus;
  submittedAt?: string | null;
  approvedAt?: string | null;
  rejectedReason?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Child {
  id: string;
  branchId: string;
  branch?: Branch;
  firstName: string;
  lastName: string;
  dob: string;
  gender: Gender;
  diagnosis?: string | null;
  diagnosisDate?: string | null;
  strengths?: string | null;
  goals?: string | null;
  medicalConditions?: string | null;
  allergies?: string | null;
  medications?: string | null;
  guardianName: string;
  guardianPhone: string;
  guardianEmail?: string | null;
  guardianAddress?: string | null;
  photoUrl?: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProgressNote {
  id: string;
  childId: string;
  authorId?: string | null;
  note: string;
  category?: string | null;
  createdAt: string;
}

export type InvoiceStatus = 'DRAFT' | 'ISSUED' | 'PARTIALLY_PAID' | 'PAID' | 'OVERDUE' | 'CANCELLED';
export type PaymentMethod = 'CASH' | 'BANK_TRANSFER' | 'CARD' | 'CHEQUE' | 'ONLINE' | 'OTHER';

export interface FeeStructure {
  id: string;
  branchId: string;
  name: string;
  description?: string | null;
  amount: string | number;
  frequency: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface InvoiceItem {
  id: string;
  invoiceId: string;
  feeStructureId?: string | null;
  description: string;
  amount: string | number;
}

export interface Payment {
  id: string;
  invoiceId: string;
  amount: string | number;
  method: PaymentMethod;
  reference?: string | null;
  paidAt: string;
  recordedById?: string | null;
  notes?: string | null;
  createdAt: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  branchId: string;
  branch?: Branch;
  childId: string;
  child?: Child;
  issueDate: string;
  dueDate: string;
  subtotal: string | number;
  discount: string | number;
  total: string | number;
  amountPaid: string | number;
  status: InvoiceStatus;
  notes?: string | null;
  items?: InvoiceItem[];
  payments?: Payment[];
  createdAt: string;
  updatedAt: string;
}

export type AttendanceStatus = 'PRESENT' | 'ABSENT' | 'LATE' | 'HALF_DAY' | 'EXCUSED' | 'HOLIDAY';
export type AttendeeType = 'CHILD' | 'STAFF';

export const ATTENDANCE_STATUSES: AttendanceStatus[] = [
  'PRESENT',
  'ABSENT',
  'LATE',
  'HALF_DAY',
  'EXCUSED',
  'HOLIDAY',
];

export interface Attendance {
  id: string;
  branchId: string;
  attendeeType: AttendeeType;
  childId?: string | null;
  child?: Child;
  staffId?: string | null;
  staff?: Staff;
  date: string;
  status: AttendanceStatus;
  checkInTime?: string | null;
  checkOutTime?: string | null;
  notes?: string | null;
  markedById?: string | null;
  createdAt: string;
}

export type EmploymentStatus = 'ACTIVE' | 'ON_LEAVE' | 'SUSPENDED' | 'TERMINATED' | 'RESIGNED';
export type LeaveStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED';
export type LeaveType = 'CASUAL' | 'SICK' | 'ANNUAL' | 'UNPAID' | 'MATERNITY' | 'PATERNITY' | 'OTHER';

export interface Staff {
  id: string;
  userId: string;
  user?: BasicUserRef;
  branchId: string;
  branch?: Branch;
  employeeCode: string;
  designation?: string | null;
  department?: string | null;
  joinDate?: string | null;
  status: EmploymentStatus;
  salary?: string | number | null;
  cnic?: string | null;
  address?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface LeaveRequest {
  id: string;
  staffId: string;
  staff?: Staff;
  type: LeaveType;
  startDate: string;
  endDate: string;
  reason?: string | null;
  status: LeaveStatus;
  approvedById?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Permission {
  id: string;
  resource: string;
  action: string;
  createdAt: string;
}

export interface Role {
  id: string;
  name: string;
  description?: string | null;
  isSystem: boolean;
  permissions: { permission: Permission }[];
  _count?: { users: number };
  createdAt: string;
  updatedAt: string;
}

export interface AuthUserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatarUrl?: string | null;
  roles: string[];
  permissions: string[];
  branches: Branch[];
  isCrossBranch: boolean;
}

export interface PaginatedResult<T> {
  data: T[];
  meta: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}
