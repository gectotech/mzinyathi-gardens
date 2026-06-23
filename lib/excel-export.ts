import ExcelJS from 'exceljs';
import type { SchoolAdmissionDocuments } from '@/lib/db/schema';

const IMAGE_EXT = /\.(jpe?g|png|gif|webp)(\?|$)/i;

async function fetchImageBuffer(url: string): Promise<Buffer | null> {
  if (!url) return null;
  const absolute =
    url.startsWith('http') ? url : `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}${url}`;
  if (!IMAGE_EXT.test(absolute) && !IMAGE_EXT.test(url)) return null;
  try {
    const res = await fetch(absolute);
    if (!res.ok) return null;
    const arrayBuffer = await res.arrayBuffer();
    return Buffer.from(arrayBuffer);
  } catch {
    return null;
  }
}

function imageExtension(url: string): 'jpeg' | 'png' | 'gif' {
  const lower = url.toLowerCase();
  if (lower.includes('.png')) return 'png';
  if (lower.includes('.gif')) return 'gif';
  return 'jpeg';
}

type SchoolExportRow = {
  tracking_id: string;
  status: string;
  submitted_at: string;
  first_name: string;
  surname: string;
  grade_applying: string;
  parent_name: string;
  parent_phone: string;
  documents: SchoolAdmissionDocuments | null;
};

type JobExportRow = {
  tracking_id: string;
  status: string;
  submitted_at: string;
  job_title: string;
  full_name: string;
  email: string;
  phone: string;
  resume_url: string | null;
};

export async function buildSchoolApplicationsWorkbook(rows: SchoolExportRow[]) {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('School Admissions');

  const headers = [
    'Tracking ID',
    'Status',
    'Submitted',
    'First Name',
    'Surname',
    'Grade',
    'Parent',
    'Phone',
    'Student Photo',
    'Birth Certificate',
    'Previous Report',
    'Passport Photo',
    'Parent ID',
    'Proof of Residence',
    'Transfer Letter',
    'Recent Results',
  ];
  sheet.addRow(headers);
  sheet.getRow(1).font = { bold: true };

  const docKeys: (keyof SchoolAdmissionDocuments)[] = [
    'studentPhoto',
    'birthCertificate',
    'previousReport',
    'passportPhoto',
    'parentId',
    'proofOfResidence',
    'transferLetter',
    'recentResults',
  ];

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const docs = row.documents || {};
    const rowIndex = i + 2;
    sheet.addRow([
      row.tracking_id,
      row.status,
      row.submitted_at,
      row.first_name,
      row.surname,
      row.grade_applying,
      row.parent_name,
      row.parent_phone,
      docs.studentPhoto || '',
      docs.birthCertificate || '',
      docs.previousReport || '',
      docs.passportPhoto || '',
      docs.parentId || '',
      docs.proofOfResidence || '',
      docs.transferLetter || '',
      docs.recentResults || '',
    ]);
    sheet.getRow(rowIndex).height = 72;

    for (let col = 0; col < docKeys.length; col++) {
      const url = docs[docKeys[col]];
      if (!url) continue;
      const buffer = await fetchImageBuffer(url);
      if (!buffer) continue;
      const imageId = workbook.addImage({
        buffer: buffer as unknown as ExcelJS.Buffer,
        extension: imageExtension(url),
      });
      sheet.addImage(imageId, {
        tl: { col: 8 + col, row: rowIndex - 1 },
        ext: { width: 80, height: 60 },
      });
    }
  }

  sheet.columns.forEach((col) => {
    col.width = 18;
  });

  return workbook;
}

export async function buildJobApplicationsWorkbook(rows: JobExportRow[]) {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('Job Applications');

  sheet.addRow(['Tracking ID', 'Status', 'Submitted', 'Job', 'Name', 'Email', 'Phone', 'Resume']);
  sheet.getRow(1).font = { bold: true };

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const rowIndex = i + 2;
    sheet.addRow([
      row.tracking_id,
      row.status,
      row.submitted_at,
      row.job_title,
      row.full_name,
      row.email,
      row.phone,
      row.resume_url || '',
    ]);
    sheet.getRow(rowIndex).height = 72;

    if (row.resume_url && IMAGE_EXT.test(row.resume_url)) {
      const buffer = await fetchImageBuffer(row.resume_url);
      if (buffer) {
        const imageId = workbook.addImage({
          buffer: buffer as unknown as ExcelJS.Buffer,
          extension: imageExtension(row.resume_url),
        });
        sheet.addImage(imageId, {
          tl: { col: 7, row: rowIndex - 1 },
          ext: { width: 80, height: 60 },
        });
      }
    }
  }

  sheet.columns.forEach((col) => {
    col.width = 20;
  });

  return workbook;
}

export async function workbookToResponse(workbook: ExcelJS.Workbook, filename: string) {
  const buffer = await workbook.xlsx.writeBuffer();
  return new Response(buffer, {
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
  });
}
