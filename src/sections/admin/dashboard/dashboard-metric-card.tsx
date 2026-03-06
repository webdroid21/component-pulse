import type { CardProps } from '@mui/material/Card';
import type { ChartOptions } from 'src/components/chart';

import { varAlpha } from 'minimal-shared/utils';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import { useTheme } from '@mui/material/styles';

import { fNumber, fPercent } from 'src/utils/format-number';

import { Iconify } from 'src/components/iconify';
import { Chart, useChart } from 'src/components/chart';

// ----------------------------------------------------------------------

type Props = CardProps & {
    title: string;
    total: number;
    percent: number;
    onClick?: () => void;
    chart: {
        colors?: string[];
        categories: string[];
        series: number[];
        options?: ChartOptions;
    };
};

export function DashboardMetricCard({ title, percent, total, onClick, chart, sx, ...other }: Props) {
    const theme = useTheme();

    const chartColors = chart.colors ?? [theme.palette.primary.light, theme.palette.primary.main];

    const chartOptions = useChart({
        chart: { sparkline: { enabled: true } },
        colors: [chartColors[1]],
        xaxis: { categories: chart.categories },
        grid: {
            padding: { top: 6, left: 6, right: 6, bottom: 6 },
        },
        fill: {
            type: 'gradient',
            gradient: {
                colorStops: [
                    { offset: 0, color: chartColors[0], opacity: 1 },
                    { offset: 100, color: chartColors[1], opacity: 1 },
                ],
            },
        },
        tooltip: {
            y: { formatter: (value: number) => fNumber(value), title: { formatter: () => '' } },
        },
        ...chart.options,
    });

    const renderTrending = () => (
        <Box sx={{ gap: 0.5, display: 'flex', alignItems: 'center' }}>
            <Box
                component="span"
                sx={{
                    width: 24,
                    height: 24,
                    display: 'flex',
                    borderRadius: '50%',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: varAlpha(theme.vars.palette.success.mainChannel, 0.16),
                    color: 'success.dark',
                    ...theme.applyStyles('dark', { color: 'success.light' }),
                    ...(percent < 0 && {
                        bgcolor: varAlpha(theme.vars.palette.error.mainChannel, 0.16),
                        color: 'error.dark',
                        ...theme.applyStyles('dark', { color: 'error.light' }),
                    }),
                }}
            >
                <Iconify width={16} icon={percent < 0 ? 'eva:trending-down-fill' : 'eva:trending-up-fill'} />
            </Box>

            <Box component="span" sx={{ typography: 'subtitle2' }}>
                {percent > 0 && '+'}
                {fPercent(percent)}
            </Box>

            <Box component="span" sx={{ color: 'text.secondary', typography: 'body2' }}>
                last week
            </Box>
        </Box>
    );

    return (
        <Card
            onClick={onClick}
            sx={[
                {
                    p: 3,
                    display: 'flex',
                    alignItems: 'center',
                    position: 'relative',
                    ...(onClick && {
                        cursor: 'pointer',
                        transition: 'box-shadow 0.2s, transform 0.15s',
                        '&:hover': {
                            boxShadow: theme.shadows[8],
                            transform: 'translateY(-2px)',
                        },
                    }),
                },
                ...(Array.isArray(sx) ? sx : [sx]),
            ]}
            {...other}
        >
            <Box sx={{ flexGrow: 1 }}>
                <Box sx={{ typography: 'subtitle2', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    {title}
                    {onClick && (
                        <Iconify icon="eva:external-link-outline" width={13} sx={{ color: 'text.disabled' }} />
                    )}
                </Box>

                <Box sx={{ my: 1.5, typography: 'h3' }}>{fNumber(total)}</Box>

                {renderTrending()}
            </Box>

            <Chart
                type="line"
                series={[{ data: chart.series }]}
                options={chartOptions}
                sx={{ width: 100, height: 66 }}
            />
        </Card>
    );
}
