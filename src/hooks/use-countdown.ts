import { useState, useEffect, useCallback } from 'react';

// ----------------------------------------------------------------------

export type UseCountdownDateReturn = {
    days: string;
    hours: string;
    minutes: string;
    seconds: string;
};

function formatTime(value: number) {
    return String(value).length === 1 ? `0${value}` : `${value}`;
}

function calculateTimeDifference(futureDate: Date, currentDate: Date) {
    const distance = futureDate.getTime() - currentDate.getTime();

    return {
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
    };
}

export function useCountdownDate(targetDate: Date, placeholder = '- -'): UseCountdownDateReturn {
    const [value, setValue] = useState({
        days: placeholder,
        hours: placeholder,
        minutes: placeholder,
        seconds: placeholder,
    });

    const handleUpdate = useCallback(() => {
        const now = new Date();
        const { days, hours, minutes, seconds } = calculateTimeDifference(targetDate, now);

        setValue({
            days: formatTime(days),
            hours: formatTime(hours),
            minutes: formatTime(minutes),
            seconds: formatTime(seconds),
        });
    }, [targetDate]);

    useEffect(() => {
        handleUpdate();
        const interval = setInterval(handleUpdate, 1000);
        return () => clearInterval(interval);
    }, [handleUpdate]);

    return value;
}
