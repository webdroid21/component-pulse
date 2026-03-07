import type { Metadata } from 'next';

import { CONFIG } from 'src/global-config';

import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { Markdown } from 'src/components/markdown';

// ----------------------------------------------------------------------

export const metadata: Metadata = { title: `Terms of Service | ${CONFIG.appName}` };

const content = `
# Terms of Service

Effective Date: [Insert Date]

Welcome to **ComponentPulse**. By accessing or using our website, products, and services, you agree to comply with and be bound by the following Terms of Service.

### 1. Acceptance of Terms
By using ComponentPulse, you acknowledge that you have read, understood, and agree to these Terms. If you do not agree, please do not use our services.

### 2. Product and Service Descriptions
We strive to provide accurate descriptions of our electronics and components. However, we do not warrant that product descriptions, pricing, or other content on this site are perfectly accurate, complete, or error-free.

### 3. Orders and Pricing
* All orders are subject to acceptance and availability.
* Prices are subject to change without notice.
* We reserve the right to refuse or cancel any order for any reason, including suspected fraud or pricing errors.

### 4. Returns and Refunds
We accept returns for defective items within a specified period (e.g., 30 days) from the delivery date, subject to inspection. For detailed instructions, please see our Return Policy page.

### 5. Intellectual Property
All content on this website, including text, graphics, logos, and software, is the property of ComponentPulse or its content suppliers and is protected by intellectual property laws.

### 6. Limitation of Liability
ComponentPulse shall not be liable for any indirect, incidental, or consequential damages arising from the use or inability to use our products or services.

### 7. Changes to Terms
We reserve the right to update or modify these Terms at any time. Your continued use of the website following any changes constitutes acceptance of those changes.
`;

export default function Page() {
  return (
    <Container sx={{ pt: 5, pb: 10 }}>
      <Typography variant="h3" sx={{ mb: 5 }}>Terms of Service</Typography>
      <Markdown children={content} />
    </Container>
  );
}
