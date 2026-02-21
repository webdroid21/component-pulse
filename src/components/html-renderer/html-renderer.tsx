'use client';

import Box, { BoxProps } from '@mui/material/Box';
import { styled } from '@mui/material/styles';

// ----------------------------------------------------------------------

const StyledHtmlContainer = styled(Box)(({ theme }) => ({
    // Headings
    '& h1, & h2, & h3, & h4, & h5, & h6': {
        marginTop: theme.spacing(3),
        marginBottom: theme.spacing(2),
        fontWeight: theme.typography.fontWeightBold,
    },
    '& h1': { ...theme.typography.h3 },
    '& h2': { ...theme.typography.h4 },
    '& h3': { ...theme.typography.h5 },
    '& h4': { ...theme.typography.h6 },
    '& h5': { ...theme.typography.subtitle1 },
    '& h6': { ...theme.typography.subtitle2 },

    // Paragraphs
    '& p': {
        ...theme.typography.body1,
        marginBottom: theme.spacing(2),
    },

    // Lists
    '& ul, & ol': {
        paddingLeft: theme.spacing(3),
        marginBottom: theme.spacing(2),
    },
    '& li': {
        ...theme.typography.body1,
        marginBottom: theme.spacing(0.5),
    },

    // Links
    '& a': {
        color: theme.palette.primary.main,
        textDecoration: 'none',
        '&:hover': {
            textDecoration: 'underline',
        },
    },

    // Blockquotes
    '& blockquote': {
        margin: 0,
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(2),
        paddingLeft: theme.spacing(2),
        borderLeft: `4px solid ${theme.palette.divider}`,
        color: theme.palette.text.secondary,
        fontStyle: 'italic',
    },

    // Images
    '& img': {
        maxWidth: '100%',
        height: 'auto',
        borderRadius: theme.shape.borderRadius,
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(2),
    },

    // Code
    '& pre': {
        padding: theme.spacing(2),
        borderRadius: theme.shape.borderRadius,
        backgroundColor: theme.vars.palette.grey[900],
        color: theme.vars.palette.common.white,
        overflowX: 'auto',
    },
    '& code': {
        fontFamily: theme.typography.fontFamily,
        backgroundColor: theme.vars.palette.grey[200],
        padding: '2px 4px',
        borderRadius: 4,
    },
}));

type Props = BoxProps & {
    html: string;
};

export function HtmlRenderer({ html, ...other }: Props) {
    return (
        <StyledHtmlContainer
            {...other}
            dangerouslySetInnerHTML={{ __html: html }}
        />
    );
}
