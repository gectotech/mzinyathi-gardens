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

export const userRoleEnum = pgEnum('user_role', ['admin', 'super_admin']);
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
  'rejected',
  'hired',
]);
export const schoolAdmissionStatusEnum = pgEnum('school_admission_status', [
  'submitted',
  'under_review',
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
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const jobApplications = pgTable('job_applications', {
  id: uuid('id').defaultRandom().primaryKey(),
  trackingId: text('tracking_id').notNull().unique(),
  jobId: uuid('job_id')
    .notNull()
    .references(() => jobs.id),
  fullName: text('full_name').notNull(),
  nationalId: text('national_id').notNull(),
  dob: text('dob').notNull(),
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
  status: applicationStatusEnum('status').notNull().default('submitted'),
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
  uploadedBy: uuid('uploaded_by').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
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

export type User = typeof users.$inferSelect;
export type ContactSubmission = typeof contactSubmissions.$inferSelect;
export type Job = typeof jobs.$inferSelect;
export type JobApplication = typeof jobApplications.$inferSelect;
export type SchoolApplication = typeof schoolApplications.$inferSelect;
export type Phase = typeof phases.$inferSelect;
export type House = typeof houses.$inferSelect;
export type MediaFile = typeof mediaFiles.$inferSelect;
export type SitePage = typeof sitePages.$inferSelect;
export type CodeAsset = typeof codeAssets.$inferSelect;
