import { MainLayout } from 'src/layouts/main';

import { CheckoutProvider } from 'src/sections/checkout/context';

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export default function Layout({ children }: Props) {
  return (
    <CheckoutProvider>
      <MainLayout>{children}</MainLayout>
    </CheckoutProvider>
  );
}
