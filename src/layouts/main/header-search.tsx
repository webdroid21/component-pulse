'use client';

import { useState } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import InputBase from '@mui/material/InputBase';
import InputAdornment from '@mui/material/InputAdornment';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { Iconify } from 'src/components/iconify';

export function HeaderSearch() {
    const router = useRouter();
    const [query, setQuery] = useState('');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            router.push(`${paths.products}?q=${encodeURIComponent(query.trim())}`);
        } else {
            router.push(paths.products);
        }
    };

    return (
        <Box
            component="form"
            onSubmit={handleSearch}
            sx={{
                display: 'flex',
                alignItems: 'center',
                width: '100%',
                mx: 'auto',
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 1,
                overflow: 'hidden',
                bgcolor: 'background.paper',
            }}
        >
            <InputBase
                fullWidth
                placeholder="Search for components, boards, sensors..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                startAdornment={
                    <InputAdornment position="start" sx={{ pl: 1.5, pr: 0.5 }}>
                        <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
                    </InputAdornment>
                }
                sx={{ height: 44 }}
            />
            <Button
                type="submit"
                variant="contained"
                color="primary"
                sx={{
                    height: 44,
                    borderRadius: 0,
                    boxShadow: 'none',
                    px: 3,
                }}
            >
                Search
            </Button>
        </Box>
    );
}
