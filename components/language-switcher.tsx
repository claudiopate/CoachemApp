"use client";

import { useLocale, useTranslations } from 'next-intl';
import { useRouter } from 'next/router';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Globe } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations('common');
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const switchLocale = async (newLocale: string) => {
    try {
      const currentLocale = locale;
      if (currentLocale === newLocale) return;

      setIsLoading(true);
      await router.push(pathname, { query: { locale: newLocale } });
    } catch (error) {
      console.error('Error switching locale:', error);
      const errorMessage = error instanceof Error ? error.message : 'Si è verificato un errore durante il cambio della lingua';
      toast({
        title: t('errors.internalError'),
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Switch language" disabled={isLoading}>
          {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Globe className="h-5 w-5" />}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem 
          onClick={() => switchLocale('it')} 
          className={locale === 'it' ? 'bg-accent' : ''}
          aria-current={locale === 'it' ? 'true' : 'false'}
        >
          {t('language.italian')}
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => switchLocale('en')} 
          className={locale === 'en' ? 'bg-accent' : ''}
          aria-current={locale === 'en' ? 'true' : 'false'}
        >
          {t('language.english')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}