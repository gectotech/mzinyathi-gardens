export type ContactPreference = 'call' | 'email' | 'whatsapp';

export type ContactReplyInput = {
  name: string;
  email: string;
  phone: string;
  message: string;
  propertyInterest?: string | null;
};

export function normalizePhoneForWhatsApp(phone: string): string {
  return phone.replace(/\D/g, '');
}

export function normalizePhoneForTel(phone: string): string {
  const digits = phone.replace(/[^\d+]/g, '');
  return digits.startsWith('+') ? digits : `+${digits.replace(/^\+/, '')}`;
}

export function buildEmailReplyLink(
  contact: ContactReplyInput,
  siteName = 'Mzinyathi Gardens'
): string {
  const subject = encodeURIComponent(`Regarding Your ${siteName} Inquiry`);
  const propertyLine = contact.propertyInterest
    ? `\r\n\r\nProperty interest: ${contact.propertyInterest}`
    : '';
  const body = encodeURIComponent(
    `Hi ${contact.name},\r\n\r\nIn response to your message:\r\n"${contact.message}"${propertyLine}\r\n\r\n`
  );
  return `mailto:${contact.email}?subject=${subject}&body=${body}`;
}

export function buildWhatsAppReplyLink(contact: ContactReplyInput): string {
  const phone = normalizePhoneForWhatsApp(contact.phone);
  const text = encodeURIComponent(
    `Hi ${contact.name}, this is Mzinyathi Gardens replying to your website inquiry.`
  );
  return `https://wa.me/${phone}?text=${text}`;
}

export function buildCallLink(phone: string): string {
  return `tel:${normalizePhoneForTel(phone)}`;
}

export const contactPreferenceLabels: Record<ContactPreference, string> = {
  call: 'Phone Call',
  email: 'Email',
  whatsapp: 'WhatsApp',
};
