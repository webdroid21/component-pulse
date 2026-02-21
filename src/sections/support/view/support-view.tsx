'use client';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import CircularProgress from '@mui/material/CircularProgress';

import { useSettings } from 'src/hooks/firebase';
import { Iconify } from 'src/components/iconify';

import { SupportContactForm } from '../support-contact-form';

// ----------------------------------------------------------------------

const faqs = [
    {
        question: "What payment methods do you accept?",
        answer: "We accept MTN Mobile Money, Airtel Money, and Pay on Dellivery. All payments are processed securely through our encrypted payment gateway.",
    },
    {
        question: "What is your shipping policy?",
        answer: "We offer free shipping within Kampala for orders above UGX 500,000. Standard delivery takes 2-3 business days within Kampala and 3-5 days to other parts of Uganda. Express delivery is available for urgent orders.",
    },
    {
        question: "Do you provide technical support for products?",
        answer: "Yes! We provide comprehensive technical support including setup guides, troubleshooting, code examples, and direct support from our engineering team. Support is available via email, phone, and live chat.",
    },
    {
        question: "What is your return policy?",
        answer: "We offer a 30-day return policy for unused items in original packaging. Defective items can be returned within 1 year of purchase. Please contact our support team to initiate a return.",
    },
    {
        question: "Do you offer bulk discounts?",
        answer: "Yes, we offer competitive pricing for bulk orders. Discounts start at 5% for orders above UGX 500,000 and can go up to 20% for large institutional orders. Contact our sales team for a custom quote.",
    },
    {
        question: "How can I track my order?",
        answer: "Once your order ships, you'll receive a tracking number via email and SMS. You can track your package on our website or through our delivery partner's tracking system.",
    },
    {
        question: "Do you provide custom solutions?",
        answer: "Our engineering team can design custom PCBs, develop firmware, and create complete embedded solutions for your specific requirements. Contact us to discuss your project.",
    },
    {
        question: "What warranty do you offer on products?",
        answer: "Most products come with manufacturer warranties ranging from 6 months to 2 years. We also provide our own warranty for products we manufacture. Check individual product pages for specific warranty information.",
    },
];

export function SupportView() {
    return (
        <Box sx={{ pb: 10 }}>
            <SupportHero />
            <Container>
                <SupportContactInfo />
                <SupportContactForm />
                <SupportFaqs />
            </Container>
        </Box>
    );
}

// ----------------------------------------------------------------------

function SupportHero() {
    const theme = useTheme();

    return (
        <Box
            sx={{
                ...theme.mixins.bgGradient({
                    images: [
                        `linear-gradient(to bottom, ${theme.vars.palette.primary.main}, ${theme.vars.palette.primary.dark})`,
                    ],
                }),
                py: { xs: 8, md: 10 },
                mb: { xs: 8, md: 10 },
                color: 'common.white',
                textAlign: 'center',
            }}
        >
            <Container>
                <Typography variant="h2" sx={{ mb: 2 }}>
                    Support Center
                </Typography>
                <Typography variant="body1" sx={{ mx: 'auto', maxWidth: 640, opacity: 0.8 }}>
                    Get the help you need to succeed with your embedded systems projects. Our comprehensive support includes technical assistance, documentation, and community resources.
                </Typography>
            </Container>
        </Box>
    );
}

// ----------------------------------------------------------------------

function SupportContactInfo() {
    const { settings, loading } = useSettings();

    // Fallbacks
    const defaultWhatsApp = '+256 790 270 840';
    const defaultPhone = '+256 790 270 840';
    const defaultEmail = 'componentpulse@gmail.com';

    // Resolved Values
    const whatsappStr = settings?.socialLinks?.whatsapp || defaultWhatsApp;
    const phoneStr = settings?.storePhone || defaultPhone;
    const emailStr = settings?.storeEmail || defaultEmail;

    return (
        <Box sx={{ mb: { xs: 10, md: 15 } }}>
            <Box sx={{ textAlign: 'center', mb: 8 }}>
                <Typography variant="h3" sx={{ mb: 2 }}>
                    How Can We Help You?
                </Typography>
                <Typography sx={{ color: 'text.secondary', maxWidth: 480, mx: 'auto' }}>
                    Choose the support option that best fits your needs. Our team is here to help you every step of the way.
                </Typography>
            </Box>

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <CircularProgress />
                </Box>
            ) : (
                <Box
                    sx={{
                        display: 'grid',
                        gap: 4,
                        gridTemplateColumns: {
                            xs: 'repeat(1, 1fr)',
                            sm: 'repeat(2, 1fr)',
                            md: 'repeat(4, 1fr)',
                        },
                    }}
                >
                    <ContactCard
                        icon="logos:whatsapp-icon"
                        title="WhatsApp Chat"
                        subtitle={whatsappStr}
                        actionText="Chat on WhatsApp"
                        actionHref={`https://wa.me/${whatsappStr.replace(/\s+/g, '')}`}
                        info="Mon–Fri: 8AM–6PM"
                    />

                    <ContactCard
                        icon="solar:phone-bold-duotone"
                        iconColor="primary"
                        title="Phone Support"
                        subtitle="Call us for immediate technical assistance"
                        actionText={phoneStr}
                        actionHref={`tel:${phoneStr}`}
                        info="Mon–Fri: 8AM–6PM"
                    />

                    <ContactCard
                        icon="solar:letter-bold-duotone"
                        iconColor="info"
                        title="Email Support"
                        subtitle={emailStr}
                        actionText="Email Us for Support"
                        actionHref={`mailto:${emailStr}`}
                        info="Mon–Fri: 8AM–6PM"
                    />

                    <ContactCard
                        icon="solar:users-group-rounded-bold-duotone"
                        iconColor="warning"
                        title="Community Forum"
                        subtitle="Connect with other developers and experts"
                        actionText="Join Arduino Forum"
                        actionHref="https://forum.arduino.cc/"
                        info="Anytime"
                        target="_blank"
                    />
                </Box>
            )}
        </Box>
    );
}

// ----------------------------------------------------------------------

type ContactCardProps = {
    icon: string;
    iconColor?: string;
    title: string;
    subtitle: string;
    actionText: string;
    actionHref: string;
    info: string;
    target?: string;
};

function ContactCard({ icon, iconColor, title, subtitle, actionText, actionHref, info, target }: ContactCardProps) {
    return (
        <Card
            sx={{
                p: 4,
                textAlign: 'center',
                boxShadow: (theme) => theme.customShadows.z8,
                display: 'flex',
                alignItems: 'center',
                flexDirection: 'column',
            }}
        >
            <Box
                sx={{
                    mb: 3,
                    width: 64,
                    height: 64,
                    display: 'flex',
                    borderRadius: '50%',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: iconColor ? `${iconColor}.main` : 'inherit',
                    bgcolor: (theme) => iconColor ? theme.vars.palette[iconColor as 'primary' | 'info' | 'warning'].lighter : 'background.neutral',
                }}
            >
                <Iconify icon={icon} width={32} />
            </Box>

            <Typography variant="h6" sx={{ mb: 1 }}>
                {title}
            </Typography>

            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3, flexGrow: 1 }}>
                {subtitle}
            </Typography>

            <Typography
                component="a"
                href={actionHref}
                target={target}
                variant="subtitle2"
                rel={target === '_blank' ? 'noopener noreferrer' : undefined}
                sx={{
                    mb: 1,
                    color: 'primary.main',
                    textDecoration: 'none',
                    '&:hover': { textDecoration: 'underline' },
                }}
            >
                {actionText}
            </Typography>

            <Typography variant="caption" sx={{ color: 'text.disabled' }}>
                {info}
            </Typography>
        </Card>
    );
}

// ----------------------------------------------------------------------

import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';

function SupportFaqs() {
    return (
        <Box>
            <Box sx={{ textAlign: 'center', mb: 8 }}>
                <Typography variant="h3" sx={{ mb: 2 }}>
                    Frequently Asked Questions
                </Typography>
                <Typography sx={{ color: 'text.secondary', maxWidth: 480, mx: 'auto' }}>
                    Find quick answers to common questions about our products and services.
                </Typography>
            </Box>

            <Box sx={{ maxWidth: 800, mx: 'auto' }}>
                {faqs.map((faq, index) => (
                    <Accordion key={faq.question} sx={{ mb: 2, '&:before': { display: 'none' }, borderRadius: 1 }}>
                        <AccordionSummary
                            expandIcon={<Iconify icon="eva:arrow-ios-downward-fill" />}
                            sx={{
                                px: 3,
                                '& .MuiAccordionSummary-content': { my: 2 },
                                '&.Mui-expanded': { minHeight: 48 },
                            }}
                        >
                            <Typography variant="subtitle1">{faq.question}</Typography>
                        </AccordionSummary>
                        <AccordionDetails sx={{ px: 3, pb: 3 }}>
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                {faq.answer}
                            </Typography>
                        </AccordionDetails>
                    </Accordion>
                ))}
            </Box>
        </Box>
    );
}
