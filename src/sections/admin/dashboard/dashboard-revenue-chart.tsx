import type { CardProps } from '@mui/material/Card';
import type { ChartOptions } from 'src/components/chart';

import { useState, useCallback } from 'react';

import Card from '@mui/material/Card';
import { useTheme } from '@mui/material/styles';
import CardHeader from '@mui/material/CardHeader';

import { fCurrency } from 'src/utils/format-number';

import { Chart, useChart, ChartSelect, ChartLegends } from 'src/components/chart';

// ----------------------------------------------------------------------

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

type YearData = {
    year: string;
    revenue: number[];
    orders: number[];
};

type Props = CardProps & {
    title?: string;
    subheader?: string;
    data: YearData[];
    options?: ChartOptions;
};

export function DashboardRevenueChart({ title, subheader, data, sx, ...other }: Props) {
    const theme = useTheme();
    const [selectedYear, setSelectedYear] = useState(data[0]?.year ?? '');

    const handleChange = useCallback((val: string) => {
        setSelectedYear(val);
    }, []);

    const currentYear = data.find((d) => d.year === selectedYear) ?? data[0];

    const series = [
        { name: 'Revenue', data: currentYear?.revenue ?? [] },
        { name: 'Orders', data: currentYear?.orders ?? [] },
    ];

    const chartColors = [theme.palette.primary.main, theme.palette.warning.main];

    const chartOptions = useChart({
        colors: chartColors,
        xaxis: { categories: MONTHS },
        yaxis: [
            {
                title: { text: 'Revenue (GHS)' },
                labels: { formatter: (v: number) => fCurrency(v) },
            },
            {
                opposite: true,
                title: { text: 'Orders' },
            },
        ],
        tooltip: {
            y: {
                formatter: (val: number, { seriesIndex }: any) =>
                    seriesIndex === 0 ? fCurrency(val) : String(val),
            },
        },
        stroke: { width: [3, 2], curve: 'smooth', dashArray: [0, 4] },
        legend: { show: false },
        ...other,
    });

    return (
        <Card sx={sx} {...other}>
            <CardHeader
                title={title ?? 'Revenue & Orders Trend'}
                subheader={subheader}
                action={
                    <ChartSelect
                        options={data.map((d) => d.year)}
                        value={selectedYear}
                        onChange={handleChange}
                    />
                }
                sx={{ mb: 3 }}
            />

            <ChartLegends
                colors={chartColors}
                labels={['Revenue', 'Orders']}
                sx={{ px: 3, gap: 3 }}
            />

            <Chart
                type="line"
                series={series}
                options={chartOptions}
                slotProps={{ loading: { p: 2.5 } }}
                sx={{ pl: 1, py: 2.5, pr: 2.5, height: 320 }}
            />
        </Card>
    );
}
