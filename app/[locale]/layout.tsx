import { NextIntlClientProvider } from 'next-intl';
import { notFound } from 'next/navigation';
import config from '../../next-intl.config';
import { getTranslations } from 'next-intl/server';

export async function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'it' }];
}

// Funzione per generare i metadati della pagina
export async function generateMetadata({ params }: { params: { locale: string } }) {
  // Accediamo al locale in modo asincrono
  const locale = params.locale || config.defaultLocale;
  return {
    locale
  };
}

export default async function LocaleLayout({ 
  children, 
  params 
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  // Accediamo al locale direttamente dai params con fallback
  const locale = params.locale || config.defaultLocale;
  
  // Verifica del locale supportato
  if (!config.locales.includes(locale)) {
    notFound();
  }
  
  // Caricamento messaggi con gestione errori semplificata
  const messages = await import(`../../messages/${locale}.json`)
    .then(mod => mod.default)
    .catch(() => notFound());

  return (
    <NextIntlClientProvider 
      locale={locale}
      messages={messages}
      timeZone="Europe/Rome"
    >
      {children}
    </NextIntlClientProvider>
  );
}
