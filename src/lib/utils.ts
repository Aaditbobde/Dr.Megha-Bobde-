import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateWhatsAppLink(
  phone: string = '919270113112',
  message: string = 'Hello Dr. Megha, I would like to inquire about an appointment at your Bavdhan clinic.'
): string {
  const cleaned = phone.replace(/[^0-9]/g, '');
  const number = cleaned.startsWith('91') ? cleaned : `91${cleaned.replace(/^0/, '')}`;
  return `https://api.whatsapp.com/send/?phone=${number}&text=${encodeURIComponent(message)}`;
}