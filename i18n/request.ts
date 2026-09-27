import { getRequestConfig } from "next-intl/server";

export const locales = ["en", "fil"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

// Phase 1 ships English only and stays fully static. When Filipino copy is
// reviewed, switch to next-intl's locale-prefixed routing (app/[locale]/…) so
// pages remain statically generated per locale.
export default getRequestConfig(async () => {
  const locale: Locale = defaultLocale;
  return {
    locale,
    timeZone: "Asia/Manila",
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
