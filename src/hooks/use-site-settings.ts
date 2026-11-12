import { useEffect, useState } from 'react';
import { defaultSiteSettings, subscribeToSiteSettings, type SiteSettings } from '@/lib/siteContentStore';

/** Live site settings (contact details etc.), starting from the confirmed defaults. */
export function useSiteSettings(): SiteSettings {
  const [settings, setSettings] = useState<SiteSettings>(defaultSiteSettings);
  useEffect(() => subscribeToSiteSettings(setSettings), []);
  return settings;
}
