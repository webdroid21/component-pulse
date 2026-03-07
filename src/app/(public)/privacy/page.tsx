import type { Metadata } from 'next';

import { CONFIG } from 'src/global-config';

import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { Markdown } from 'src/components/markdown';

// ----------------------------------------------------------------------

export const metadata: Metadata = { title: `Privacy Policy | ${CONFIG.appName}` };

const content = `
# Privacy Policy

Effective Date: [Insert Date]

At **ComponentPulse**, we respect your privacy and are committed to protecting it. This Privacy Policy explains what information we collect, how we use it, and how we protect it.

### 1. Information We Collect
We collect information you provide directly to us (e.g., when you create an account, make a purchase, or contact us for support). This includes:
* **Contact details**: Name, email address, phone number.
* **Account information**: Password, order history.
* **Billing & Shipping data**: Addresses and payment methods (handled securely via third-party gateways).

### 2. How We Use Your Information
We use the information we collect to:
* Process and fulfill your orders.
* Communicate with you about your orders, support requests, and updates.
* Improve our products, services, and website functionality.

### 3. Data Sharing
We do not sell your personal information. We may share your data with trusted third parties solely for the purpose of fulfilling your orders (e.g., shipping partners) or securely processing payments.

### 4. Data Security
We implement strict security measures to protect your personal data against unauthorized access, alteration, or destruction.

### 5. Contact Us
If you have any questions about this Privacy Policy, please contact our support team.
`;

export default function Page() {
  return (
    <Container sx={{ pt: 5, pb: 10 }}>
      <Typography variant="h3" sx={{ mb: 5 }}>Privacy Policy</Typography>
      <Markdown children={content} />
    </Container>
  );
}
