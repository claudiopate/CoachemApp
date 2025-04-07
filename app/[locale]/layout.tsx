import type React from "react"
import { ClerkProvider } from "@clerk/nextjs"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils"
import "@/styles/globals.css"
import { getTranslations } from 'next-intl/server';
import config from '../../next-intl.config';
import { NextIntlClientProvider as IntlProvider } from 'next-intl';
import { translateFn } from '../translation-utils'
import { notFound } from 'next/navigation'

export async function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'it' }];
}

// Funzione per generare i metadati della pagina
export async function generateMetadata(props: { params: { locale: string } }) {
  const params = await props.params; // Ensure params is awaited
  const locale = params.locale || config.defaultLocale;
  return {
    locale
  };
}

async function getMessages(locale: string) {
  try {
    if (!config.locales.includes(locale)) {
      notFound();
    }
    return (await import(`../../messages/${locale}.json`)).default;
  } catch (error) {
    notFound();
  }
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode,
  params: { locale: string }
}) {
  const locale = params.locale;
  const messages = await getMessages(locale);

  return (
    <html lang={locale} suppressHydrationWarning>
      <body>
        <IntlProvider
          messages={messages}
          locale={locale}
        >
          {children}
        </IntlProvider>
      </body>
    </html>
  );
}
