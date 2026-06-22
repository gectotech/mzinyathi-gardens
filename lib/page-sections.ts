export type PageTextBlock = {
  title: string;
  body: string;
};

export type PageTextContent = {
  heroTitle?: string;
  heroSubtitle?: string;
  intro?: string;
  blocks?: PageTextBlock[];
  cta?: {
    heading?: string;
    text?: string;
    buttonLabel?: string;
    buttonLink?: string;
  };
};

export type AnnouncementSection = {
  enabled?: boolean;
  text?: string;
  link?: string;
  linkLabel?: string;
  style?: 'info' | 'success' | 'warning';
};

export type GalleryImage = {
  url: string;
  caption?: string;
};

export type PageSections = {
  announcement?: AnnouncementSection;
  pageText?: PageTextContent;
  gallery?: {
    enabled?: boolean;
    heading?: string;
    images?: GalleryImage[];
  };
  [key: string]: unknown;
};

export const emptyPageText: PageTextContent = {
  heroTitle: '',
  heroSubtitle: '',
  intro: '',
  blocks: [],
  cta: { heading: '', text: '', buttonLabel: '', buttonLink: '' },
};

export const emptyAnnouncement: AnnouncementSection = {
  enabled: false,
  text: '',
  link: '',
  linkLabel: 'Learn more',
  style: 'info',
};

export function parsePageSections(raw: string | Record<string, unknown>): PageSections {
  try {
    const obj = typeof raw === 'string' ? JSON.parse(raw || '{}') : raw;
    return (obj || {}) as PageSections;
  } catch {
    return {};
  }
}

export function pageTextToHtml(pageText?: PageTextContent): string {
  if (!pageText) return '';
  const parts: string[] = [];

  if (pageText.heroTitle || pageText.heroSubtitle) {
    parts.push('<section class="cms-hero-text py-10 md:py-14 bg-gradient-to-br from-blue-50 to-white">');
    parts.push('<div class="container mx-auto px-4 max-w-4xl text-center">');
    if (pageText.heroTitle) {
      parts.push(`<h2 class="text-3xl md:text-4xl font-bold text-[#4169E1] mb-3">${escapeHtml(pageText.heroTitle)}</h2>`);
    }
    if (pageText.heroSubtitle) {
      parts.push(`<p class="text-lg text-gray-600">${escapeHtml(pageText.heroSubtitle)}</p>`);
    }
    parts.push('</div></section>');
  }

  if (pageText.intro) {
    parts.push('<section class="cms-intro py-8">');
    parts.push('<div class="container mx-auto px-4 max-w-3xl">');
    parts.push(`<p class="text-gray-700 text-lg leading-relaxed">${escapeHtml(pageText.intro).replace(/\n/g, '<br/>')}</p>`);
    parts.push('</div></section>');
  }

  (pageText.blocks || []).forEach((block) => {
    if (!block.title && !block.body) return;
    parts.push('<section class="cms-block py-6">');
    parts.push('<div class="container mx-auto px-4 max-w-3xl">');
    if (block.title) {
      parts.push(`<h3 class="text-xl font-bold text-gray-900 mb-2">${escapeHtml(block.title)}</h3>`);
    }
    if (block.body) {
      parts.push(`<p class="text-gray-700 leading-relaxed">${escapeHtml(block.body).replace(/\n/g, '<br/>')}</p>`);
    }
    parts.push('</div></section>');
  });

  if (pageText.cta?.heading || pageText.cta?.text) {
    parts.push('<section class="cms-cta py-12 bg-[#4169E1] text-white text-center">');
    parts.push('<div class="container mx-auto px-4 max-w-2xl">');
    if (pageText.cta.heading) {
      parts.push(`<h3 class="text-2xl font-bold mb-3">${escapeHtml(pageText.cta.heading)}</h3>`);
    }
    if (pageText.cta.text) {
      parts.push(`<p class="mb-6 opacity-90">${escapeHtml(pageText.cta.text)}</p>`);
    }
    if (pageText.cta.buttonLabel && pageText.cta.buttonLink) {
      parts.push(
        `<a href="${escapeHtml(pageText.cta.buttonLink)}" class="inline-block bg-white text-[#4169E1] px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transition">${escapeHtml(pageText.cta.buttonLabel)}</a>`
      );
    }
    parts.push('</div></section>');
  }

  return parts.join('\n');
}

export function galleryToHtml(gallery?: PageSections['gallery']): string {
  if (!gallery?.enabled || !gallery.images?.length) return '';
  const heading = gallery.heading || 'Gallery';
  const items = gallery.images
    .filter((img) => img.url)
    .map(
      (img) =>
        `<figure class="rounded-xl overflow-hidden shadow-md bg-white"><img src="${escapeHtml(img.url)}" alt="${escapeHtml(img.caption || '')}" class="w-full h-48 object-cover" /><figcaption class="p-3 text-sm text-gray-600">${escapeHtml(img.caption || '')}</figcaption></figure>`
    )
    .join('');

  return `<section class="cms-gallery py-12 bg-gray-50"><div class="container mx-auto px-4"><h2 class="text-2xl font-bold text-center text-[#4169E1] mb-8">${escapeHtml(heading)}</h2><div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">${items}</div></div></section>`;
}

export function buildHtmlFromSections(sections: PageSections, extraHtml = ''): string {
  const generated = [pageTextToHtml(sections.pageText), galleryToHtml(sections.gallery)].filter(Boolean).join('\n');
  return [generated, extraHtml].filter(Boolean).join('\n');
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
