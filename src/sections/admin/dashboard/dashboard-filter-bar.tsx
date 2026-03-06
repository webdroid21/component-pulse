'use client';

import type { Dayjs } from 'dayjs';

import dayjs from 'dayjs';
import { useState } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

// ----------------------------------------------------------------------

export type DateRange = {
    from: Date | null;
    to: Date | null;
};

export type DatePreset = 'today' | '7d' | '30d' | 'month' | 'year' | 'custom';

const PRESETS: { value: DatePreset; label: string }[] = [
    { value: 'today', label: 'Today' },
    { value: '7d', label: 'Last 7 Days' },
    { value: '30d', label: 'Last 30 Days' },
    { value: 'month', label: 'This Month' },
    { value: 'year', label: 'This Year' },
    { value: 'custom', label: 'Custom' },
];

function presetToRange(preset: DatePreset): DateRange {
    const now = dayjs();
    switch (preset) {
        case 'today':
            return { from: now.startOf('day').toDate(), to: now.endOf('day').toDate() };
        case '7d':
            return { from: now.subtract(6, 'day').startOf('day').toDate(), to: now.endOf('day').toDate() };
        case '30d':
            return { from: now.subtract(29, 'day').startOf('day').toDate(), to: now.endOf('day').toDate() };
        case 'month':
            return { from: now.startOf('month').toDate(), to: now.endOf('month').toDate() };
        case 'year':
            return { from: now.startOf('year').toDate(), to: now.endOf('year').toDate() };
        default:
            return { from: null, to: null };
    }
}

const CURRENT_YEAR = dayjs().year();
const YEAR_OPTIONS = Array.from({ length: 6 }, (_, i) => CURRENT_YEAR - i);

// ----------------------------------------------------------------------

type Props = {
    range: DateRange;
    selectedYear: number;
    onRangeChange: (range: DateRange) => void;
    onYearChange: (year: number) => void;
};

export function DashboardFilterBar({ range, selectedYear, onRangeChange, onYearChange }: Props) {
    const [preset, setPreset] = useState<DatePreset>('month');
    const [customFrom, setCustomFrom] = useState<Dayjs | null>(null);
    const [customTo, setCustomTo] = useState<Dayjs | null>(null);

    const handlePreset = (value: DatePreset) => {
        setPreset(value);
        if (value !== 'custom') {
            onRangeChange(presetToRange(value));
        }
    };

    const handleCustomFrom = (val: Dayjs | null) => {
        setCustomFrom(val);
        if (val && customTo) {
            onRangeChange({ from: val.startOf('day').toDate(), to: customTo.endOf('day').toDate() });
        }
    };

    const handleCustomTo = (val: Dayjs | null) => {
        setCustomTo(val);
        if (customFrom && val) {
            onRangeChange({ from: customFrom.startOf('day').toDate(), to: val.endOf('day').toDate() });
        }
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Card sx={{ p: 2, mb: 3 }}>
                <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    spacing={2}
                    alignItems={{ sm: 'center' }}
                    flexWrap="wrap"
                >
                    {/* Preset Chips */}
                    <Box>
                        <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.5 }}>
                            Date Range
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
                            {PRESETS.map((p) => (
                                <Chip
                                    key={p.value}
                                    label={p.label}
                                    size="small"
                                    variant={preset === p.value ? 'filled' : 'outlined'}
                                    color={preset === p.value ? 'primary' : 'default'}
                                    onClick={() => handlePreset(p.value)}
                                    sx={{ cursor: 'pointer' }}
                                />
                            ))}
                        </Box>
                    </Box>

                    {/* Custom Date Pickers */}
                    {preset === 'custom' && (
                        <Stack direction="row" spacing={1.5} alignItems="center">
                            <DatePicker
                                label="From"
                                value={customFrom}
                                onChange={handleCustomFrom}
                                slotProps={{ textField: { size: 'small', sx: { width: 150 } } }}
                            />
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>–</Typography>
                            <DatePicker
                                label="To"
                                value={customTo}
                                minDate={customFrom ?? undefined}
                                onChange={handleCustomTo}
                                slotProps={{ textField: { size: 'small', sx: { width: 150 } } }}
                            />
                        </Stack>
                    )}

                    {/* Year Selector */}
                    <Box sx={{ ml: { sm: 'auto' } }}>
                        <TextField
                            select
                            size="small"
                            label="Year"
                            value={selectedYear}
                            onChange={(e) => onYearChange(Number(e.target.value))}
                            sx={{ width: 110 }}
                        >
                            {YEAR_OPTIONS.map((y) => (
                                <MenuItem key={y} value={y}>
                                    {y}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Box>
                </Stack>
            </Card>
        </LocalizationProvider>
    );
}
