'use client';

import { useState } from 'react';
import { m } from 'framer-motion';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Container from '@mui/material/Container';
import Accordion from '@mui/material/Accordion';
import Typography from '@mui/material/Typography';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

const FAQ_CATEGORIES = [
  {
    id: 'products',
    label: 'Products',
    icon: 'solar:box-bold-duotone',
    faqs: [
      {
        question: 'What types of solar panels do you sell?',
        answer: 'We offer a wide range of solar panels including monocrystalline, polycrystalline, and thin-film panels from top brands like JA Solar, LONGi, and Jinko Solar. Our panels range from 100W to 550W for various applications.',
      },
      {
        question: 'Do your products come with warranty?',
        answer: 'Yes, all our products come with manufacturer warranties. Solar panels typically have 25-year performance warranties, inverters 5-10 years, and batteries 2-5 years depending on the brand and type.',
      },
      {
        question: 'Can you help me choose the right products for my needs?',
        answer: 'Absolutely! Our technical team is available to help you design the perfect system for your needs. Just contact us with your requirements and we\'ll provide a customized recommendation.',
      },
      {
        question: 'Are your products genuine and certified?',
        answer: 'All our products are 100% genuine, sourced directly from authorized distributors. They come with proper certifications including IEC, CE, and relevant local certifications.',
      },
    ],
  },
  {
    id: 'orders',
    label: 'Orders & Shipping',
    icon: 'solar:delivery-bold-duotone',
    faqs: [
      {
        question: 'What are your delivery options?',
        answer: 'We offer same-day delivery within Kampala for orders placed before 2 PM. For upcountry deliveries, we use trusted courier services with delivery times of 24-72 hours depending on location.',
      },
      {
        question: 'How much does shipping cost?',
        answer: 'Shipping is FREE for orders above UGX 500,000 within Kampala. For other areas, shipping costs are calculated based on weight and destination. You can see the exact cost at checkout.',
      },
      {
        question: 'Can I track my order?',
        answer: 'Yes! Once your order is shipped, you\'ll receive a tracking number via SMS and email. You can also track your order status in your account dashboard.',
      },
      {
        question: 'Do you offer bulk order discounts?',
        answer: 'Yes, we offer competitive discounts on bulk orders. Contact our sales team for a custom quote on quantities above standard retail amounts.',
      },
    ],
  },
  {
    id: 'payments',
    label: 'Payments',
    icon: 'solar:card-bold-duotone',
    faqs: [
      {
        question: 'What payment methods do you accept?',
        answer: 'We accept Mobile Money (MTN, Airtel), Visa/Mastercard, bank transfers, and cash on delivery (for Kampala orders only). All online payments are processed securely through Flutterwave.',
      },
      {
        question: 'Is it safe to pay online?',
        answer: 'Yes, all online transactions are secured with SSL encryption and processed through Flutterwave, a PCI-DSS certified payment processor. Your card details are never stored on our servers.',
      },
      {
        question: 'Can I pay in installments?',
        answer: 'Yes, we offer installment payment options for orders above UGX 2,000,000. Contact our sales team to discuss available installment plans.',
      },
      {
        question: 'Do you offer credit terms for businesses?',
        answer: 'Yes, we offer credit facilities to registered businesses with a good track record. Please contact our B2B team to apply for a business account.',
      },
    ],
  },
  {
    id: 'returns',
    label: 'Returns & Refunds',
    icon: 'solar:refresh-bold-duotone',
    faqs: [
      {
        question: 'What is your return policy?',
        answer: 'We offer a 7-day return policy for unused products in original packaging. Some items like cables cut to length are non-returnable. Defective products can be returned within the warranty period.',
      },
      {
        question: 'How do I return a product?',
        answer: 'Contact our customer service team to initiate a return. We\'ll provide a return authorization and arrange pickup or provide drop-off instructions. Refunds are processed within 3-5 business days.',
      },
      {
        question: 'Who pays for return shipping?',
        answer: 'For defective products or our error, we cover return shipping. For change-of-mind returns, the customer is responsible for return shipping costs.',
      },
      {
        question: 'Can I exchange a product?',
        answer: 'Yes, exchanges are possible within 7 days of delivery. If the replacement item costs more, you\'ll pay the difference. If it costs less, we\'ll refund the difference.',
      },
    ],
  },
  {
    id: 'support',
    label: 'Technical Support',
    icon: 'solar:settings-bold-duotone',
    faqs: [
      {
        question: 'Do you offer installation services?',
        answer: 'While we don\'t directly provide installation services, we work with a network of certified installers across Uganda. We can recommend trusted professionals in your area.',
      },
      {
        question: 'Can you help with system design?',
        answer: 'Yes! Our technical team can help design solar systems for homes, businesses, or special applications. Share your requirements and we\'ll provide a complete system recommendation.',
      },
      {
        question: 'Do you provide after-sales support?',
        answer: 'Absolutely! We provide comprehensive after-sales support including troubleshooting, warranty claims, and technical advice. Our support team is available via phone, WhatsApp, and email.',
      },
      {
        question: 'Where can I find product manuals and specifications?',
        answer: 'Product specifications are available on each product page. Detailed manuals can be downloaded from the product page or requested from our support team.',
      },
    ],
  },
];

export function FaqsList() {
  const [currentCategory, setCurrentCategory] = useState('products');
  const [expanded, setExpanded] = useState<string | false>(false);

  const handleCategoryChange = (_: React.SyntheticEvent, newValue: string) => {
    setCurrentCategory(newValue);
    setExpanded(false);
  };

  const handleAccordionChange = (panel: string) => (_: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };

  const currentFaqs = FAQ_CATEGORIES.find((cat) => cat.id === currentCategory)?.faqs || [];

  return (
    <Box sx={{ py: { xs: 8, md: 12 } }}>
      <Container maxWidth="lg">
        <m.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Tabs
            value={currentCategory}
            onChange={handleCategoryChange}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              mb: 5,
              '& .MuiTab-root': {
                minHeight: 48,
                minWidth: 'auto',
                px: 2,
              },
            }}
          >
            {FAQ_CATEGORIES.map((category) => (
              <Tab
                key={category.id}
                value={category.id}
                label={category.label}
                icon={<Iconify icon={category.icon} width={20} />}
                iconPosition="start"
              />
            ))}
          </Tabs>
        </m.div>

        <Box>
          {currentFaqs.map((faq, index) => (
            <m.div
              key={faq.question}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <Accordion
                expanded={expanded === `panel-${index}`}
                onChange={handleAccordionChange(`panel-${index}`)}
                sx={{
                  mb: 2,
                  '&:before': { display: 'none' },
                  '&.Mui-expanded': {
                    boxShadow: (theme) => theme.shadows[8],
                  },
                }}
              >
                <AccordionSummary
                  expandIcon={<Iconify icon="solar:alt-arrow-down-bold" />}
                  sx={{
                    '& .MuiAccordionSummary-content': {
                      my: 2,
                    },
                  }}
                >
                  <Typography variant="subtitle1">{faq.question}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {faq.answer}
                  </Typography>
                </AccordionDetails>
              </Accordion>
            </m.div>
          ))}
        </Box>
      </Container>
    </Box>
  );
}
