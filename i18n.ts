import { getRequestConfig } from 'next-intl/server';
import enMessages from './messages/en.json';
import itMessages from './messages/it.json';

// Definizione delle traduzioni statiche
const messagesMap: Record<string, any> = {
  en: enMessages,
  it: itMessages
};

export default getRequestConfig(({ locale = 'en' }) => ({
  locale, // Ora locale è sempre una stringa
  messages: messagesMap[locale] || {}, // Se la lingua non esiste, fallback a {}
  timeZone: 'Europe/Rome',
  formats: {
    dateTime: {
      short: {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      },
      long: {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        weekday: 'long',
        hour: 'numeric',
        minute: 'numeric',
        hour12: false
      }
    },
    number: {
      decimal: {
        style: 'decimal',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      },
      percent: {
        style: 'percent',
        minimumFractionDigits: 2
      },
      currency: {
        style: 'currency',
        currency: 'EUR'
      }
    },
    list: {
      enumeration: {
        style: 'long',
        type: 'conjunction'
      }
    }
  }
}));
