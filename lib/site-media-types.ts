export type MediaUsage = {
  type: string;
  label: string;
  href?: string;
};

export type SiteMediaItem = {
  id: string;
  url: string;
  name: string;
  source: 'upload' | 'static' | 'property' | 'school' | 'cms' | 'application';
  sourceLabel: string;
  resourceType: 'image' | 'video' | 'pdf' | 'raw';
  folder: string;
  caption: string | null;
  showInGallery: boolean;
  editable: boolean;
  deletable: boolean;
  publicId?: string;
  bytes?: number | null;
  format?: string | null;
  createdAt?: string;
  usages: MediaUsage[];
};

export const MEDIA_FOLDERS = [
  'mzinyathi',
  'website',
  'images',
  'school',
  'properties',
  'cms',
  'admissions',
  'applications',
  'heroes',
  'logos',
];

export const SOURCE_LABELS: Record<SiteMediaItem['source'], string> = {
  upload: 'Library uploads',
  static: 'Static website files',
  property: 'Properties',
  school: 'School content',
  cms: 'Page CMS',
  application: 'Applications',
};
