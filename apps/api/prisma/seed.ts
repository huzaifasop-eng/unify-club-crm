import { PrismaClient, LeadStage, LeadSource, LeadPriority, Gender, AdmissionStatus, InvoiceStatus, PaymentMethod, AttendanceStatus, AttendeeType, EmploymentStatus } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { ALL_ROLES, CROSS_BRANCH_ROLES } from '../src/common/utils/roles.constants';

const prisma = new PrismaClient();

const RESOURCES = [
  'branches', 'roles', 'users', 'leads', 'admissions', 'children', 'fees',
  'attendance', 'hr', 'dashboard', 'reports', 'calls', 'trials', 'sports',
  'therapy', 'payroll', 'finance', 'expenses', 'inventory', 'marketing',
  'events', 'documents', 'calendar',
];
const ACTIONS = ['create', 'read', 'update', 'delete', 'manage'];

async function seedPermissions() {
  const permissions: { resource: string; action: string }[] = [];
  for (const resource of RESOURCES) {
    for (const action of ACTIONS) {
      permissions.push({ resource, action });
    }
  }
  await prisma.permission.createMany({ data: permissions, skipDuplicates: true });
  return prisma.permission.findMany();
}

async function seedRoles(allPermissions: { id: string; resource: string; action: string }[]) {
  const roleMap = new Map<string, string>();

  for (const roleName of ALL_ROLES) {
    const role = await prisma.role.upsert({
      where: { name: roleName },
      update: {},
      create: { name: roleName, isSystem: true, description: `${roleName} role` },
    });
    roleMap.set(roleName, role.id);
  }

  const findPerms = (resources: string[], actions: string[]) =>
    allPermissions.filter((p) => resources.includes(p.resource) && actions.includes(p.action));

  const grant = async (roleName: string, perms: typeof allPermissions) => {
    const roleId = roleMap.get(roleName)!;
    await prisma.rolePermission.createMany({
      data: perms.map((p) => ({ roleId, permissionId: p.id })),
      skipDuplicates: true,
    });
  };

  // Super Admin / CEO / Director: everything
  for (const r of CROSS_BRANCH_ROLES) {
    await grant(r, allPermissions);
  }

  await grant('Operations Manager', findPerms(RESOURCES, ['create', 'read', 'update']));
  await grant('Branch Manager', findPerms(RESOURCES.filter((r) => r !== 'roles'), ['create', 'read', 'update']));
  await grant('Admissions Manager', findPerms(['admissions', 'children', 'documents', 'leads'], ACTIONS));
  await grant('Sales Manager', findPerms(['leads', 'calls', 'trials', 'reports'], ACTIONS));
  await grant('Sales Executive', findPerms(['leads', 'calls', 'trials'], ['create', 'read', 'update']));
  await grant('Call Center Executive', findPerms(['leads', 'calls'], ['create', 'read', 'update']));
  await grant('Marketing Manager', findPerms(['marketing', 'events', 'leads'], ACTIONS));
  await grant('Finance Manager', findPerms(['fees', 'finance', 'expenses', 'payroll', 'reports'], ACTIONS));
  await grant('HR Manager', findPerms(['hr', 'users'], ACTIONS));
  await grant('Sports Coordinator', findPerms(['sports', 'children', 'attendance'], ['create', 'read', 'update']));
  await grant('Therapist', findPerms(['therapy', 'children', 'attendance'], ['create', 'read', 'update']));
  await grant('Coach', findPerms(['sports', 'attendance', 'children'], ['read', 'update']));
  await grant('Teacher', findPerms(['children', 'attendance'], ['read', 'update']));
  await grant('Receptionist', findPerms(['leads', 'admissions', 'calendar'], ['create', 'read']));
  await grant('Volunteer', findPerms(['events', 'children'], ['read']));
  await grant('Parent', findPerms(['children', 'fees', 'documents', 'calendar'], ['read']));
  await grant('Accountant', findPerms(['fees', 'finance', 'expenses'], ACTIONS));
  await grant('Support Staff', findPerms(['inventory', 'documents'], ['read', 'update']));
  await grant('Medical Staff', findPerms(['children', 'attendance'], ['read', 'update']));

  return roleMap;
}

async function seedBranches() {
  const branchData = [
    { name: 'PECHS', code: 'PECHS', city: 'Karachi', address: 'Block 6, PECHS, Karachi', phone: '021-1110001', email: 'pechs@unifyclub.org' },
    { name: 'Gulshan', code: 'GLSH', city: 'Karachi', address: 'Gulshan-e-Iqbal, Karachi', phone: '021-1110002', email: 'gulshan@unifyclub.org' },
    { name: 'Clifton', code: 'CLFT', city: 'Karachi', address: 'Clifton Block 5, Karachi', phone: '021-1110003', email: 'clifton@unifyclub.org' },
    { name: 'DHA', code: 'DHA', city: 'Karachi', address: 'DHA Phase 6, Karachi', phone: '021-1110004', email: 'dha@unifyclub.org' },
    { name: 'North Nazimabad', code: 'NNAZ', city: 'Karachi', address: 'Block H, North Nazimabad, Karachi', phone: '021-1110005', email: 'nnazimabad@unifyclub.org' },
  ];
  const branches: Awaited<ReturnType<typeof prisma.branch.upsert>>[] = [];
  for (const b of branchData) {
    const branch = await prisma.branch.upsert({ where: { code: b.code }, update: {}, create: b });
    branches.push(branch);
  }
  return branches;
}

async function seedUsers(roleMap: Map<string, string>, branches: { id: string }[]) {
  const passwordHash = await bcrypt.hash('Password123!', 10);

  const makeUser = async (
    email: string,
    firstName: string,
    lastName: string,
    roleNames: string[],
    branchIds: string[],
  ) => {
    const user = await prisma.user.upsert({
      where: { email },
      update: {},
      create: { email, passwordHash, firstName, lastName, isActive: true },
    });
    await prisma.userRole.createMany({
      data: roleNames.map((r) => ({ userId: user.id, roleId: roleMap.get(r)! })),
      skipDuplicates: true,
    });
    await prisma.userBranch.createMany({
      data: branchIds.map((branchId) => ({ userId: user.id, branchId })),
      skipDuplicates: true,
    });
    return user;
  };

  const superAdmin = await makeUser('superadmin@unifyclub.org', 'Ayesha', 'Khan', ['Super Admin'], branches.map((b) => b.id));
  const branchManager = await makeUser('manager.pechs@unifyclub.org', 'Bilal', 'Ahmed', ['Branch Manager'], [branches[0].id]);
  const salesExec = await makeUser('sales.pechs@unifyclub.org', 'Sana', 'Malik', ['Sales Executive'], [branches[0].id]);
  const coach = await makeUser('coach.gulshan@unifyclub.org', 'Usman', 'Tariq', ['Coach'], [branches[1].id]);
  const therapist = await makeUser('therapist.clifton@unifyclub.org', 'Hina', 'Raza', ['Therapist'], [branches[2].id]);
  const parent = await makeUser('parent.demo@unifyclub.org', 'Fatima', 'Sheikh', ['Parent'], [branches[0].id]);

  return { superAdmin, branchManager, salesExec, coach, therapist, parent };
}

function randomFrom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}
function daysAgo(n: number) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d;
}

const DIAGNOSES = ['Autism Spectrum Disorder', 'Down Syndrome', 'ADHD', 'Cerebral Palsy', 'Intellectual Disability', 'Speech Delay'];
const FIRST_NAMES = ['Ali', 'Zara', 'Hamza', 'Mahnoor', 'Bilal', 'Ayesha', 'Omar', 'Sara', 'Hassan', 'Iqra', 'Danish', 'Hira'];
const LAST_NAMES = ['Khan', 'Ahmed', 'Malik', 'Sheikh', 'Raza', 'Tariq', 'Hussain', 'Iqbal'];

async function seedLeads(branches: { id: string }[], salesExecId: string) {
  const stages = Object.values(LeadStage);
  const leads: Awaited<ReturnType<typeof prisma.lead.create>>[] = [];
  for (let i = 0; i < 60; i++) {
    const branch = randomFrom(branches);
    const childFirst = randomFrom(FIRST_NAMES);
    const childLast = randomFrom(LAST_NAMES);
    const lead = await prisma.lead.create({
      data: {
        branchId: branch.id,
        parentName: `${randomFrom(FIRST_NAMES)} ${childLast}`,
        parentPhone: `0300${String(1000000 + i).padStart(7, '0')}`,
        parentEmail: `parent${i}@example.com`,
        childName: `${childFirst} ${childLast}`,
        childDob: daysAgo(365 * (3 + Math.floor(Math.random() * 10))),
        childGender: randomFrom([Gender.MALE, Gender.FEMALE]),
        diagnosis: randomFrom(DIAGNOSES),
        source: randomFrom(Object.values(LeadSource)),
        stage: randomFrom(stages),
        priority: randomFrom(Object.values(LeadPriority)),
        assignedToId: salesExecId,
        followUpDate: daysAgo(-Math.floor(Math.random() * 14)),
        createdAt: daysAgo(Math.floor(Math.random() * 90)),
      },
    });
    leads.push(lead);
  }
  return leads;
}

async function seedAdmissionsAndChildren(branches: { id: string; code: string }[]) {
  const children: Awaited<ReturnType<typeof prisma.child.create>>[] = [];
  for (let i = 0; i < 25; i++) {
    const branch = randomFrom(branches);
    const firstName = randomFrom(FIRST_NAMES);
    const lastName = randomFrom(LAST_NAMES);
    const dob = daysAgo(365 * (3 + Math.floor(Math.random() * 10)));
    const guardianPhone = `0301${String(2000000 + i).padStart(7, '0')}`;

    const child = await prisma.child.create({
      data: {
        branchId: branch.id,
        firstName,
        lastName,
        dob,
        gender: randomFrom([Gender.MALE, Gender.FEMALE]),
        diagnosis: randomFrom(DIAGNOSES),
        guardianName: `${randomFrom(FIRST_NAMES)} ${lastName}`,
        guardianPhone,
        guardianEmail: `guardian${i}@example.com`,
        isActive: true,
      },
    });

    const admissionNumber = `ADM-${branch.code}-${new Date().getFullYear()}-${String(i + 1).padStart(4, '0')}`;
    await prisma.admission.create({
      data: {
        admissionNumber,
        branchId: branch.id,
        childId: child.id,
        childName: `${firstName} ${lastName}`,
        childDob: dob,
        childGender: child.gender,
        guardianName: child.guardianName,
        guardianPhone,
        guardianEmail: child.guardianEmail,
        emergencyContactName: `${randomFrom(FIRST_NAMES)} ${lastName}`,
        emergencyContactPhone: guardianPhone,
        diagnosis: child.diagnosis,
        status: AdmissionStatus.ENROLLED,
        submittedAt: daysAgo(60),
        approvedAt: daysAgo(55),
        createdAt: daysAgo(60),
      },
    });

    await prisma.progressNote.create({
      data: {
        childId: child.id,
        note: 'Initial assessment completed. Showing good progress in motor skills.',
        category: 'therapy',
      },
    });

    children.push(child);
  }
  return children;
}

async function seedFees(children: { id: string; branchId: string }[]) {
  const feeStructuresByBranch = new Map<string, string>();
  for (const child of children) {
    if (!feeStructuresByBranch.has(child.branchId)) {
      const fs = await prisma.feeStructure.create({
        data: {
          branchId: child.branchId,
          name: 'Monthly Program Fee',
          description: 'Standard monthly therapy & education program fee',
          amount: 15000,
          frequency: 'monthly',
        },
      });
      feeStructuresByBranch.set(child.branchId, fs.id);
    }
  }

  let invoiceSeq = 1;
  for (const child of children) {
    const feeStructureId = feeStructuresByBranch.get(child.branchId)!;
    for (let m = 0; m < 3; m++) {
      const dueDate = daysAgo(30 * (2 - m));
      const total = 15000;
      const isPaid = Math.random() > 0.3;
      const amountPaid = isPaid ? total : Math.random() > 0.5 ? total / 2 : 0;
      const invoice = await prisma.invoice.create({
        data: {
          invoiceNumber: `INV-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(invoiceSeq++).padStart(5, '0')}`,
          branchId: child.branchId,
          childId: child.id,
          dueDate,
          subtotal: total,
          total,
          amountPaid,
          status: amountPaid >= total ? InvoiceStatus.PAID : amountPaid > 0 ? InvoiceStatus.PARTIALLY_PAID : InvoiceStatus.ISSUED,
          items: { create: [{ description: 'Monthly Program Fee', amount: total, feeStructureId }] },
        },
      });
      if (amountPaid > 0) {
        await prisma.payment.create({
          data: {
            invoiceId: invoice.id,
            amount: amountPaid,
            method: randomFrom(Object.values(PaymentMethod)),
            paidAt: dueDate,
          },
        });
      }
    }
  }
}

async function seedAttendance(children: { id: string; branchId: string }[]) {
  for (const child of children) {
    for (let d = 0; d < 14; d++) {
      const date = daysAgo(d);
      if (date.getDay() === 0) continue; // skip Sundays
      await prisma.attendance.create({
        data: {
          branchId: child.branchId,
          attendeeType: AttendeeType.CHILD,
          childId: child.id,
          date,
          status: randomFrom([
            AttendanceStatus.PRESENT,
            AttendanceStatus.PRESENT,
            AttendanceStatus.PRESENT,
            AttendanceStatus.LATE,
            AttendanceStatus.ABSENT,
          ]),
        },
      });
    }
  }
}

async function seedStaffAndAttendance(branches: { id: string }[], coachUserId: string, therapistUserId: string) {
  const coachStaff = await prisma.staff.upsert({
    where: { userId: coachUserId },
    update: {},
    create: {
      userId: coachUserId,
      branchId: branches[1].id,
      employeeCode: 'EMP-0001',
      designation: 'Sports Coach',
      department: 'Sports',
      joinDate: daysAgo(400),
      status: EmploymentStatus.ACTIVE,
      salary: 60000,
    },
  });
  const therapistStaff = await prisma.staff.upsert({
    where: { userId: therapistUserId },
    update: {},
    create: {
      userId: therapistUserId,
      branchId: branches[2].id,
      employeeCode: 'EMP-0002',
      designation: 'Occupational Therapist',
      department: 'Therapy',
      joinDate: daysAgo(300),
      status: EmploymentStatus.ACTIVE,
      salary: 85000,
    },
  });

  for (const staff of [coachStaff, therapistStaff]) {
    for (let d = 0; d < 14; d++) {
      const date = daysAgo(d);
      if (date.getDay() === 0) continue;
      await prisma.attendance.create({
        data: {
          branchId: staff.branchId,
          attendeeType: AttendeeType.STAFF,
          staffId: staff.id,
          date,
          status: AttendanceStatus.PRESENT,
        },
      });
    }
  }

  await prisma.leaveRequest.create({
    data: {
      staffId: coachStaff.id,
      type: 'CASUAL',
      startDate: daysAgo(-5),
      endDate: daysAgo(-4),
      reason: 'Family event',
    },
  });
}

async function main() {
  console.log('Seeding permissions...');
  const permissions = await seedPermissions();

  console.log('Seeding roles...');
  const roleMap = await seedRoles(permissions);

  console.log('Seeding branches...');
  const branches = await seedBranches();

  console.log('Seeding users...');
  const users = await seedUsers(roleMap, branches);

  console.log('Seeding leads...');
  await seedLeads(branches, users.salesExec.id);

  console.log('Seeding admissions & children...');
  const children = await seedAdmissionsAndChildren(branches as any);

  console.log('Seeding fees & invoices...');
  await seedFees(children);

  console.log('Seeding child attendance...');
  await seedAttendance(children);

  console.log('Seeding staff & staff attendance...');
  await seedStaffAndAttendance(branches, users.coach.id, users.therapist.id);

  console.log('Seed complete.');
  console.log('---');
  console.log('Demo login: superadmin@unifyclub.org / Password123!');
  console.log('Demo login: manager.pechs@unifyclub.org / Password123!');
  console.log('Demo login: sales.pechs@unifyclub.org / Password123!');
  console.log('Demo login: coach.gulshan@unifyclub.org / Password123!');
  console.log('Demo login: therapist.clifton@unifyclub.org / Password123!');
  console.log('Demo login: parent.demo@unifyclub.org / Password123!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
