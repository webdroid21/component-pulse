import type { StackProps } from '@mui/material/Stack';
import type { Theme, SxProps } from '@mui/material/styles';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';

import { useCountdownDate } from 'src/hooks/use-countdown';

// ----------------------------------------------------------------------

const timeUnits = ['days', 'hours', 'minutes', 'seconds'] as const;

type Props = StackProps & {
    expired: Date;
    hideDays?: boolean;
    hideHours?: boolean;
    hideMinutes?: boolean;
    hideSeconds?: boolean;
    labelPlacement?: 'inline' | 'bottom' | 'none';
    width?: number;
    height?: number;
    slotProps?: {
        label?: SxProps<Theme>;
        value?: SxProps<Theme>;
    };
};

export function ProductCountdownBlock({
    sx,
    expired,
    slotProps,
    hideDays,
    hideHours,
    hideMinutes,
    hideSeconds,
    width = 56,
    height = 44,
    labelPlacement = 'bottom',
    ...other
}: Props) {
    const countdown = useCountdownDate(expired);

    const shouldHideUnit = (unit: (typeof timeUnits)[number]) => {
        switch (unit) {
            case 'days':
                return hideDays;
            case 'hours':
                return hideHours;
            case 'minutes':
                return hideMinutes;
            case 'seconds':
                return hideSeconds;
            default:
                return false;
        }
    };

    const renderLabel = (unit: string) => {
        if (labelPlacement === 'inline') {
            return (
                <Box component="span" sx={{ opacity: 0.48, typography: 'subtitle2', ...slotProps?.label }}>
                    {unit.charAt(0)}
                </Box>
            );
        }
        if (labelPlacement === 'bottom') {
            return (
                <Box
                    component="span"
                    sx={{
                        textAlign: 'center',
                        typography: 'caption',
                        color: 'text.secondary',
                        ...slotProps?.label,
                    }}
                >
                    {unit}
                </Box>
            );
        }
        return null;
    };

    return (
        <Stack
            gap={1}
            direction="row"
            justifyContent="center"
            divider={
                <Box component="strong" sx={{ lineHeight: `${height}px` }}>
                    :
                </Box>
            }
            sx={{ typography: 'subtitle1', ...sx }}
            {...other}
        >
            {timeUnits.map((unit) => {
                if (shouldHideUnit(unit)) return null;

                return (
                    <Box key={unit} gap={1} display="flex" flexDirection="column">
                        <Box
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            sx={{
                                width,
                                height,
                                gap: 0.25,
                                borderRadius: 1,
                                bgcolor: 'grey.800',
                                color: 'common.white',
                                ...slotProps?.value,
                            }}
                        >
                            {countdown[unit]}
                            {labelPlacement === 'inline' && renderLabel(unit)}
                        </Box>

                        {labelPlacement === 'bottom' && renderLabel(unit)}
                    </Box>
                );
            })}
        </Stack>
    );
}
