import type { CardProps } from '@mui/material/Card';
import type { ChartOptions } from 'src/components/chart';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Divider from '@mui/material/Divider';
import CardHeader from '@mui/material/CardHeader';
import { useTheme, alpha as hexAlpha } from '@mui/material/styles';

import { fNumber } from 'src/utils/format-number';

import { Chart, useChart, ChartLegends } from 'src/components/chart';

// ----------------------------------------------------------------------

type SeriesItem = {
    label: string;
    value: number;
    color?: string;
};

type Props = CardProps & {
    title?: string;
    subheader?: string;
    total: number;
    series: SeriesItem[];
    options?: ChartOptions;
};

export function DashboardDonutChart({ title, subheader, total, series, sx, options, ...other }: Props) {
    const theme = useTheme();

    const defaultColors = [
        theme.palette.primary.main,
        theme.palette.warning.main,
        theme.palette.error.main,
        theme.palette.success.main,
        theme.palette.info.main,
        hexAlpha(theme.palette.primary.main, 0.6),
    ];

    const chartColors = series.map((s, i) => s.color ?? defaultColors[i % defaultColors.length]);

    const chartOptions = useChart({
        chart: { sparkline: { enabled: true } },
        colors: chartColors,
        labels: series.map((s) => s.label),
        stroke: { width: 2, colors: ['transparent'] },
        plotOptions: {
            pie: {
                donut: {
                    size: '64%',
                    labels: {
                        show: true,
                        total: {
                            show: true,
                            label: 'Total',
                            formatter: () => fNumber(total),
                        },
                    },
                },
            },
        },
        grid: { padding: { top: -40, bottom: -40 } },
        legend: { show: false },
        ...options,
    });

    return (
        <Card sx={sx} {...other}>
            <CardHeader title={title} subheader={subheader} />

            <Chart
                type="donut"
                series={series.map((s) => s.value)}
                options={chartOptions}
                slotProps={{ loading: { p: 4 } }}
                sx={{ my: 1.5, mx: 'auto', width: { xs: 260, xl: 300 }, height: { xs: 260, xl: 300 } }}
            />

            <Divider sx={{ borderStyle: 'dashed' }} />

            <Box sx={{ p: 2.5 }}>
                <ChartLegends
                    labels={chartOptions?.labels}
                    colors={chartOptions?.colors}
                    sx={{ gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}
                />
            </Box>
        </Card>
    );
}
