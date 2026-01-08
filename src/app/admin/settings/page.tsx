import type { Metadata } from 'next';

import { CONFIG } from 'src/global-config';

import { SettingsView } from 'src/sections/admin/settings/view';

// ----------------------------------------------------------------------

export const metadata: Metadata = { title: `Settings - ${CONFIG.appName}` };

export default function Page() {
  return <SettingsView />;
}
