'use client';

import type { TimelineItem } from 'src/types/training-module';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Timeline, TimelineDot, TimelineItem as MuiTimelineItem, TimelineContent, TimelineSeparator, TimelineConnector } from '@mui/lab';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

type Props = {
    timeline: TimelineItem[];
};

export function TrainingModuleCurriculum({ timeline }: Props) {
    if (!timeline || timeline.length === 0) return null;

    return (
        <Card sx={{ p: 4 }}>
            <Typography variant="h5" sx={{ mb: 3 }}>
                Curriculum & Timeline
            </Typography>

            <Timeline position="alternate">
                {timeline.map((item, index) => {
                    const isLast = index === timeline.length - 1;
                    const isEven = index % 2 === 0;

                    return (
                        <MuiTimelineItem key={item.id || index}>
                            <TimelineSeparator>
                                <TimelineDot color="primary" />
                                {!isLast && <TimelineConnector />}
                            </TimelineSeparator>
                            <TimelineContent sx={{ pb: 3, ...(isEven && { textAlign: 'right' }) }}>
                                <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                                    {item.title}
                                </Typography>

                                {item.duration && (
                                    <Stack
                                        direction="row"
                                        alignItems="center"
                                        justifyContent={isEven ? 'flex-end' : 'flex-start'}
                                        spacing={0.5}
                                        sx={{ color: 'text.secondary', typography: 'caption', mb: 1 }}
                                    >
                                        <Iconify icon="solar:clock-circle-linear" width={14} />
                                        {item.duration}
                                    </Stack>
                                )}

                                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                    {item.description}
                                </Typography>
                            </TimelineContent>
                        </MuiTimelineItem>
                    );
                })}
            </Timeline>
        </Card>
    );
}
