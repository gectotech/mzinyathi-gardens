import {
  pgTable,
  text,
  timestamp,
  integer,
  boolean,
  jsonb,
  pgEnum,
  uuid,
} from 'drizzle-orm/pg-core';

export const userRoleEnum = pgEnum('user_role', [
  'super_admin',
  'admin',
  'property_admin',
  'school_admin',
  'content_editor',
  'viewer',
]);
export const contactStatusEnum = pgEnum('contact_status', [
  'new',
  'read',
  'replied',
  'archived',
]);
export const contactPreferenceEnum = pgEnum('contact_preference', [
  'call',
  'email',
  'whatsapp',
]);
export const applicationStatusEnum = pgEnum('application_status', [
  'submitted',
  'under_review',
  'shortlisted',
  'interview',
  'rejected',
  'hired',
]);
export const schoolAdmissionStatusEnum = pgEnum('school_admission_status', [
  'submitted',
  'under_review',
  'interview',
  'accepted',
  'waitlisted',
  'rejected',
]);
export const phaseStatusEnum = pgEnum('phase_status', [
  'active',
  'under_construction',
]);
export const publishStatusEnum = pgEnum('publish_status', ['draft', 'published']);
export const mediaTypeEnum = pgEnum('media_type', [
  'image',
  'video',
  'pdf',
  'raw',
]);
export const schoolPostCategoryEnum = pgEnum('school_post_category', [
  'news',
  'activity',
  'event',
]);
export const studentStatusEnum = pgEnum('student_status', [
  'active',
  'graduated',
  'transferred',
  'withdrawn',
]);
export const portalRoleEnum = pgEnum('portal_role', ['student', 'teacher', 'parent']);
export const feeInvoiceStatusEnum = pgEnum('fee_invoice_status', [
  'paid',
  'partial',
  'outstanding',
  'overdue',
]);
export const assignmentSubmissionStatusEnum = pgEnum('assignment_submission_status', [
  'pending',
  'draft',
  'submitted',
  'graded',
]);
export const attendanceStatusEnum = pgEnum('attendance_status', [
  'present',
  'absent',
  'late',
  'excused',
]);
export const timetableSlotTypeEnum = pgEnum('timetable_slot_type', ['lesson', 'exam']);
export const termMilestoneStatusEnum = pgEnum('term_milestone_status', [
  'completed',
  'in_progress',
  'pending',
]);

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  name: text('name').notNull(),
  role: userRoleEnum('role').notNull().default('admin'),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const contactSubmissions = pgTable('contact_submissions', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  phone: text('phone').notNull(),
  message: text('message').notNull(),
  propertyInterest: text('property_interest'),
  preferredContact: contactPreferenceEnum('preferred_contact').notNull().default('email'),
  status: contactStatusEnum('status').notNull().default('new'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const jobs = pgTable('jobs', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: text('title').notNull(),
  department: text('department').notNull(),
  location: text('location').notNull().default('Mzinyathi Gardens'),
  tagline: text('tagline').notNull(),
  jobType: text('job_type').notNull().default('Full-time'),
  requirements: jsonb('requirements').$type<string[]>().default([]),
  responsibilities: jsonb('responsibilities').$type<string[]>().default([]),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type SchoolAdmissionDocuments = {
  studentPhoto?: string;
  birthCertificate?: string;
  previousReport?: string;
  passportPhoto?: string;
  parentId?: string;
  proofOfResidence?: string;
  transferLetter?: string;
  recentResults?: string;
};

export const schoolApplications = pgTable('school_applications', {
  id: uuid('id').defaultRandom().primaryKey(),
  trackingId: text('tracking_id').notNull().unique(),
  source: text('source').notNull().default('admissions_page'),
  firstName: text('first_name').notNull(),
  surname: text('surname').notNull(),
  dateOfBirth: text('date_of_birth').notNull(),
  gender: text('gender').notNull(),
  nationality: text('nationality').notNull(),
  birthCertNumber: text('birth_cert_number').notNull(),
  gradeApplying: text('grade_applying').notNull(),
  applicantType: text('applicant_type'),
  learnerPreviousSchool: text('learner_previous_school'),
  parentName: text('parent_name').notNull(),
  parentRelationship: text('parent_relationship').notNull(),
  parentNationalId: text('parent_national_id'),
  parentPhone: text('parent_phone').notNull(),
  parentAltPhone: text('parent_alt_phone'),
  parentEmail: text('parent_email'),
  parentOccupation: text('parent_occupation'),
  homeAddress: text('home_address').notNull(),
  city: text('city').notNull(),
  province: text('province').notNull(),
  suburb: text('suburb').notNull(),
  postalAddress: text('postal_address'),
  emergencyName: text('emergency_name').notNull(),
  emergencyRelationship: text('emergency_relationship').notNull(),
  emergencyPhone: text('emergency_phone').notNull(),
  emergencyAltPhone: text('emergency_alt_phone'),
  medicalConditions: text('medical_conditions'),
  allergies: text('allergies'),
  disabilities: text('disabilities'),
  medications: text('medications'),
  doctorInfo: text('doctor_info'),
  currentSchool: text('current_school'),
  lastGradeCompleted: text('last_grade_completed').notNull(),
  languagesSpoken: text('languages_spoken'),
  talentsInterests: text('talents_interests'),
  documents: jsonb('documents').$type<SchoolAdmissionDocuments>().default({}),
  requiresTransport: text('requires_transport'),
  pickupArea: text('pickup_area'),
  informationConfirmed: boolean('information_confirmed').notNull().default(false),
  parentSignature: text('parent_signature').notNull(),
  status: schoolAdmissionStatusEnum('status').notNull().default('submitted'),
  interviewScheduledAt: timestamp('interview_scheduled_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// ── Job application document upload type ────────────────────────────────────
export type JobApplicationDocument = {
  label: string; // e.g. "National ID", "Degree Certificate", "Resume / CV"
  url: string;   // Cloudinary secureUrl
};

export const jobApplications = pgTable('job_applications', {
  id: uuid('id').defaultRandom().primaryKey(),
  trackingId: text('tracking_id').notNull().unique(),
  jobId: uuid('job_id')
    .notNull()
    .references(() => jobs.id),
  fullName: text('full_name').notNull(),
  nationalId: text('national_id').notNull(),
  dob: text('dob').notNull(),
  gender: text('gender'),                                          // ← NEW
  phone: text('phone').notNull(),
  email: text('email').notNull(),
  address: text('address').notNull(),
  education: text('education').notNull(),
  institution: text('institution').notNull(),
  fieldOfStudy: text('field_of_study').notNull(),
  previousEmployer: text('previous_employer'),
  skills: text('skills').notNull(),
  experience: text('experience').notNull(),
  interestMessage: text('interest_message'),
  resumeUrl: text('resume_url'),
  documents: jsonb('documents')                                    // ← NEW
    .$type<JobApplicationDocument[]>()
    .default([]),
  status: applicationStatusEnum('status').notNull().default('submitted'),
  interviewScheduledAt: timestamp('interview_scheduled_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const phases = pgTable('phases', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description').notNull(),
  image: text('image').notNull(),
  features: jsonb('features').$type<string[]>().default([]),
  status: phaseStatusEnum('status').notNull().default('active'),
  sortOrder: integer('sort_order').notNull().default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const houses = pgTable('houses', {
  id: text('id').primaryKey(),
  phaseId: text('phase_id')
    .notNull()
    .references(() => phases.id),
  title: text('title').notNull(),
  description: text('description').notNull(),
  fullDescription: text('full_description').notNull(),
  image: text('image').notNull(),
  images: jsonb('images').$type<string[]>().default([]),
  beds: integer('beds').notNull(),
  baths: integer('baths').notNull(),
  size: integer('size').notNull(),
  price: text('price').notNull(),
  features: jsonb('features').$type<string[]>().default([]),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const mediaFiles = pgTable('media_files', {
  id: uuid('id').defaultRandom().primaryKey(),
  publicId: text('public_id').notNull(),
  url: text('url').notNull(),
  secureUrl: text('secure_url').notNull(),
  resourceType: mediaTypeEnum('resource_type').notNull(),
  format: text('format'),
  bytes: integer('bytes'),
  originalName: text('original_name').notNull(),
  folder: text('folder').notNull().default('mzinyathi'),
  caption: text('caption'),
  showInGallery: boolean('show_in_gallery').notNull().default(false),
  uploadedBy: uuid('uploaded_by').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const schoolPosts = pgTable('school_posts', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: text('title').notNull(),
  excerpt: text('excerpt').notNull(),
  content: text('content').notNull().default(''),
  imageUrl: text('image_url').notNull(),
  category: schoolPostCategoryEnum('category').notNull().default('news'),
  status: publishStatusEnum('status').notNull().default('draft'),
  publishedAt: timestamp('published_at'),
  sortOrder: integer('sort_order').notNull().default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  updatedBy: uuid('updated_by').references(() => users.id),
});

export const siteSettings = pgTable('site_settings', {
  key: text('key').primaryKey(),
  value: jsonb('value').notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  updatedBy: uuid('updated_by').references(() => users.id),
});

export const sitePages = pgTable('site_pages', {
  id: uuid('id').defaultRandom().primaryKey(),
  slug: text('slug').notNull().unique(),
  title: text('title').notNull(),
  metaDescription: text('meta_description'),
  sections: jsonb('sections').$type<Record<string, unknown>>().default({}),
  customCss: text('custom_css').default(''),
  customJs: text('custom_js').default(''),
  htmlContent: text('html_content').default(''),
  status: publishStatusEnum('status').notNull().default('draft'),
  version: integer('version').notNull().default(1),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  updatedBy: uuid('updated_by').references(() => users.id),
});

export const codeAssets = pgTable('code_assets', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  assetType: text('asset_type').notNull(),
  content: text('content').notNull().default(''),
  status: publishStatusEnum('status').notNull().default('draft'),
  version: integer('version').notNull().default(1),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  updatedBy: uuid('updated_by').references(() => users.id),
});

export const auditLogs = pgTable('audit_logs', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id),
  action: text('action').notNull(),
  entity: text('entity').notNull(),
  entityId: text('entity_id'),
  details: jsonb('details').$type<Record<string, unknown>>(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const students = pgTable('students', {
  id: uuid('id').defaultRandom().primaryKey(),
  studentNumber: text('student_number').notNull().unique(),
  applicationId: uuid('application_id').references(() => schoolApplications.id),
  firstName: text('first_name').notNull(),
  surname: text('surname').notNull(),
  gender: text('gender').notNull(),
  grade: text('grade').notNull(),
  status: studentStatusEnum('status').notNull().default('active'),
  graduatedYear: integer('graduated_year'),
  parentEmail: text('parent_email'),
  parentPhone: text('parent_phone'),
  parentNationalId: text('parent_national_id'),
  tempPassword: text('temp_password'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type PortalProfileData = {
  department?: string;
  studentId?: string;
  children?: { studentId: string; name: string; grade: string; studentNumber: string }[];
};

export const portalAccounts = pgTable('portal_accounts', {
  id: uuid('id').defaultRandom().primaryKey(),
  role: portalRoleEnum('role').notNull(),
  email: text('email').notNull(),
  identifier: text('identifier').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  studentId: uuid('student_id').references(() => students.id),
  profileData: jsonb('profile_data').$type<PortalProfileData>().default({}),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const feeInvoices = pgTable('fee_invoices', {
  id: uuid('id').defaultRandom().primaryKey(),
  studentId: uuid('student_id')
    .notNull()
    .references(() => students.id),
  reference: text('reference').notNull().unique(),
  description: text('description').notNull(),
  amountCents: integer('amount_cents').notNull(),
  currency: text('currency').notNull().default('USD'),
  status: feeInvoiceStatusEnum('status').notNull().default('outstanding'),
  dueDate: timestamp('due_date'),
  paidAt: timestamp('paid_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const portalMessages = pgTable('portal_messages', {
  id: uuid('id').defaultRandom().primaryKey(),
  recipientAccountId: uuid('recipient_account_id')
    .notNull()
    .references(() => portalAccounts.id),
  senderAccountId: uuid('sender_account_id').references(() => portalAccounts.id),
  senderName: text('sender_name').notNull(),
  senderRole: portalRoleEnum('sender_role').notNull(),
  subject: text('subject').notNull(),
  body: text('body').notNull(),
  studentId: uuid('student_id').references(() => students.id),
  isRead: boolean('is_read').notNull().default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const portalClasses = pgTable('portal_classes', {
  id: uuid('id').defaultRandom().primaryKey(),
  teacherAccountId: uuid('teacher_account_id')
    .notNull()
    .references(() => portalAccounts.id),
  name: text('name').notNull(),
  grade: text('grade').notNull(),
  subject: text('subject').notNull(),
  scheduleNote: text('schedule_note'),
  academicYear: integer('academic_year').notNull().default(2026),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const portalClassEnrollments = pgTable('portal_class_enrollments', {
  id: uuid('id').defaultRandom().primaryKey(),
  classId: uuid('class_id')
    .notNull()
    .references(() => portalClasses.id),
  studentId: uuid('student_id')
    .notNull()
    .references(() => students.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const portalTimetableSlots = pgTable('portal_timetable_slots', {
  id: uuid('id').defaultRandom().primaryKey(),
  classId: uuid('class_id')
    .notNull()
    .references(() => portalClasses.id),
  dayOfWeek: integer('day_of_week').notNull(),
  startTime: text('start_time').notNull(),
  endTime: text('end_time').notNull(),
  subject: text('subject').notNull(),
  room: text('room').notNull(),
  slotType: timetableSlotTypeEnum('slot_type').notNull().default('lesson'),
  examDate: timestamp('exam_date'),
  examPaper: text('exam_paper'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const portalAssignments = pgTable('portal_assignments', {
  id: uuid('id').defaultRandom().primaryKey(),
  classId: uuid('class_id')
    .notNull()
    .references(() => portalClasses.id),
  title: text('title').notNull(),
  description: text('description'),
  dueDate: timestamp('due_date').notNull(),
  maxScore: integer('max_score').notNull().default(20),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const portalAssignmentSubmissions = pgTable('portal_assignment_submissions', {
  id: uuid('id').defaultRandom().primaryKey(),
  assignmentId: uuid('assignment_id')
    .notNull()
    .references(() => portalAssignments.id),
  studentId: uuid('student_id')
    .notNull()
    .references(() => students.id),
  status: assignmentSubmissionStatusEnum('status').notNull().default('pending'),
  score: integer('score'),
  feedback: text('feedback'),
  submittedAt: timestamp('submitted_at'),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const portalResultEntries = pgTable('portal_result_entries', {
  id: uuid('id').defaultRandom().primaryKey(),
  studentId: uuid('student_id')
    .notNull()
    .references(() => students.id),
  subject: text('subject').notNull(),
  term: text('term').notNull(),
  academicYear: integer('academic_year').notNull().default(2026),
  scorePercent: integer('score_percent').notNull(),
  classPosition: integer('class_position'),
  classSize: integer('class_size'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const portalAttendance = pgTable('portal_attendance', {
  id: uuid('id').defaultRandom().primaryKey(),
  classId: uuid('class_id')
    .notNull()
    .references(() => portalClasses.id),
  studentId: uuid('student_id')
    .notNull()
    .references(() => students.id),
  attendanceDate: timestamp('attendance_date').notNull(),
  status: attendanceStatusEnum('status').notNull().default('present'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const portalResources = pgTable('portal_resources', {
  id: uuid('id').defaultRandom().primaryKey(),
  teacherAccountId: uuid('teacher_account_id')
    .notNull()
    .references(() => portalAccounts.id),
  classId: uuid('class_id').references(() => portalClasses.id),
  title: text('title').notNull(),
  description: text('description'),
  resourceType: text('resource_type').notNull().default('document'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const portalTermMilestones = pgTable('portal_term_milestones', {
  id: uuid('id').defaultRandom().primaryKey(),
  grade: text('grade').notNull(),
  term: text('term').notNull().default('Term 2'),
  academicYear: integer('academic_year').notNull().default(2026),
  label: text('label').notNull(),
  status: termMilestoneStatusEnum('status').notNull().default('pending'),
  sortOrder: integer('sort_order').notNull().default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// ─── Inferred types ───────────────────────────────────────────────────────────

export type User = typeof users.$inferSelect;
export type ContactSubmission = typeof contactSubmissions.$inferSelect;
export type Job = typeof jobs.$inferSelect;
export type JobApplication = typeof jobApplications.$inferSelect;
export type SchoolApplication = typeof schoolApplications.$inferSelect;
export type Student = typeof students.$inferSelect;
export type PortalAccount = typeof portalAccounts.$inferSelect;
export type FeeInvoice = typeof feeInvoices.$inferSelect;
export type PortalMessage = typeof portalMessages.$inferSelect;
export type PortalClass = typeof portalClasses.$inferSelect;
export type PortalAssignment = typeof portalAssignments.$inferSelect;
export type PortalResultEntry = typeof portalResultEntries.$inferSelect;
export type Phase = typeof phases.$inferSelect;
export type House = typeof houses.$inferSelect;
export type MediaFile = typeof mediaFiles.$inferSelect;
export type SchoolPost = typeof schoolPosts.$inferSelect;
export type SitePage = typeof sitePages.$inferSelect;
export type CodeAsset = typeof codeAssets.$inferSelect;