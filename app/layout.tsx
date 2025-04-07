import type React from "react"
import { ClerkProvider } from "@clerk/nextjs"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils"
import "@/styles/globals.css"
import { getTranslations } from 'next-intl/server';
import config from '../next-intl.config';
import { NextIntlClientProvider as IntlProvider } from 'next-intl';
import { translateFn } from './translation-utils'

function removeUndefinedValues(obj: any): any {
  if (obj === undefined) {
    return null;
  }

  if (typeof obj !== 'object' || obj === null) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(removeUndefinedValues);
  }

  return Object.keys(obj).reduce((acc: any, key: string) => {
    const value = removeUndefinedValues(obj[key]);
    if (value !== undefined && value !== null) {
      acc[key] = value;
    }
    return acc;
  }, {});
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <ClerkProvider>
          <IntlProvider
            formats={{
              // your formats
            }}
            locale="en"
            messages={translateFn}
            // ...other props
          >
            {children}
          </IntlProvider>
        </ClerkProvider>
      </body>
    </html>
  )
}
