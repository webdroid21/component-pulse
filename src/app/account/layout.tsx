import { CONFIG } from 'src/global-config';
import { AccountLayout } from 'src/layouts/account';

import { AuthGuard } from 'src/auth/guard';

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export default function Layout({ children }: Props) {
  if (CONFIG.auth.skip) {
    return <AccountLayout>{children}</AccountLayout>;
  }

  return (
    <AuthGuard>
      <AccountLayout>{children}</AccountLayout>
    </AuthGuard>
  );
}
