export interface BusinessHourData {
  dayOfWeek: number;
  dayName: string;
  morningOpenTime: string; // "10:30"
  morningCloseTime: string; // "13:30"
  hasEveningSession: boolean;
  eveningOpenTime: string; // "18:00"
  eveningCloseTime: string; // "20:30"
  isClosed: boolean;
  slotDurationMinutes: number;
}

export interface LiveStatusResult {
  isOpen: boolean;
  badgeText: string;
  badgeType: 'open' | 'closed' | 'closing-soon';
  nextChangeText: string;
  todayHoursText: string;
  currentDayIndex: number;
}

export function timeToMinutes(timeStr: string): number {
  const [h, m] = timeStr.split(':').map(Number);
  return h * 60 + (m || 0);
}

export function formatTime12(timeStr: string): string {
  const [h, m] = timeStr.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  const minStr = m > 0 ? `:${m.toString().padStart(2, '0')}` : ':00';
  return `${hour12}${minStr} ${period}`;
}

export function computeLiveStatus(
  hours: BusinessHourData[],
  testDate?: Date
): LiveStatusResult {
  const now = testDate || new Date();
  const istFormatter = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Kolkata',
    hour: 'numeric',
    minute: 'numeric',
    weekday: 'short',
    hour12: false,
  });

  const parts = istFormatter.formatToParts(now);
  let hour = 0;
  let minute = 0;
  let weekdayStr = '';

  for (const p of parts) {
    if (p.type === 'hour') hour = parseInt(p.value, 10);
    if (p.type === 'minute') minute = parseInt(p.value, 10);
    if (p.type === 'weekday') weekdayStr = p.value;
  }

  const daysMap: Record<string, number> = {
    Sun: 0,
    Mon: 1,
    Tue: 2,
    Wed: 3,
    Thu: 4,
    Fri: 5,
    Sat: 6,
  };
  const currentDayIndex = daysMap[weekdayStr] ?? now.getDay();
  const currentMinutes = hour * 60 + minute;

  const todayHour = hours.find((h) => h.dayOfWeek === currentDayIndex);

  if (!todayHour || todayHour.isClosed) {
    return {
      isOpen: false,
      badgeText: 'Closed Today',
      badgeType: 'closed',
      nextChangeText: 'Closed',
      todayHoursText: 'Closed Today',
      currentDayIndex,
    };
  }

  const mOpenMins = timeToMinutes(todayHour.morningOpenTime);
  const mCloseMins = timeToMinutes(todayHour.morningCloseTime);
  const eOpenMins = todayHour.hasEveningSession ? timeToMinutes(todayHour.eveningOpenTime) : 0;
  const eCloseMins = todayHour.hasEveningSession ? timeToMinutes(todayHour.eveningCloseTime) : 0;

  const formattedMorning = `${formatTime12(todayHour.morningOpenTime)} – ${formatTime12(todayHour.morningCloseTime)}`;
  const formattedEvening = todayHour.hasEveningSession
    ? `${formatTime12(todayHour.eveningOpenTime)} – ${formatTime12(todayHour.eveningCloseTime)}`
    : 'No Evening Session';
  const todayHoursText = todayHour.hasEveningSession
    ? `${formattedMorning} & ${formattedEvening}`
    : `${formattedMorning} (Sunday Session)`;

  // Case 1: Early morning before morning opening
  if (currentMinutes < mOpenMins) {
    return {
      isOpen: false,
      badgeText: `Closed · Opens ${formatTime12(todayHour.morningOpenTime)}`,
      badgeType: 'closed',
      nextChangeText: `Opens today at ${formatTime12(todayHour.morningOpenTime)}`,
      todayHoursText,
      currentDayIndex,
    };
  }

  // Case 2: During morning session
  if (currentMinutes >= mOpenMins && currentMinutes < mCloseMins) {
    const minsLeft = mCloseMins - currentMinutes;
    const isClosingSoon = minsLeft <= 30;
    return {
      isOpen: true,
      badgeText: isClosingSoon
        ? `Closing Soon · Closes ${formatTime12(todayHour.morningCloseTime)}`
        : `Open · Closes ${formatTime12(todayHour.morningCloseTime)}`,
      badgeType: isClosingSoon ? 'closing-soon' : 'open',
      nextChangeText: `Closes at ${formatTime12(todayHour.morningCloseTime)}`,
      todayHoursText,
      currentDayIndex,
    };
  }

  // Case 3: During afternoon gap (between morning and evening)
  if (todayHour.hasEveningSession && currentMinutes >= mCloseMins && currentMinutes < eOpenMins) {
    return {
      isOpen: false,
      badgeText: `Closed · Opens ${formatTime12(todayHour.eveningOpenTime)}`,
      badgeType: 'closed',
      nextChangeText: `Evening session opens at ${formatTime12(todayHour.eveningOpenTime)}`,
      todayHoursText,
      currentDayIndex,
    };
  }

  // Case 4: During evening session
  if (todayHour.hasEveningSession && currentMinutes >= eOpenMins && currentMinutes < eCloseMins) {
    const minsLeft = eCloseMins - currentMinutes;
    const isClosingSoon = minsLeft <= 30;
    return {
      isOpen: true,
      badgeText: isClosingSoon
        ? `Closing Soon · Closes ${formatTime12(todayHour.eveningCloseTime)}`
        : `Open · Closes ${formatTime12(todayHour.eveningCloseTime)}`,
      badgeType: isClosingSoon ? 'closing-soon' : 'open',
      nextChangeText: `Closes at ${formatTime12(todayHour.eveningCloseTime)}`,
      todayHoursText,
      currentDayIndex,
    };
  }

  // Case 5: After closing for the day (or after Sunday morning) -> Find next day
  let nextDay: BusinessHourData | undefined;
  let daysAhead = 1;
  for (let i = 1; i <= 7; i++) {
    const checkDay = (currentDayIndex + i) % 7;
    const found = hours.find((h) => h.dayOfWeek === checkDay);
    if (found && !found.isClosed) {
      nextDay = found;
      daysAhead = i;
      break;
    }
  }

  const nextText = nextDay
    ? daysAhead === 1
      ? `Opens tomorrow at ${formatTime12(nextDay.morningOpenTime)}`
      : `Opens ${nextDay.dayName} at ${formatTime12(nextDay.morningOpenTime)}`
    : 'Closed';

  return {
    isOpen: false,
    badgeText: `Closed · ${nextText}`,
    badgeType: 'closed',
    nextChangeText: nextText,
    todayHoursText,
    currentDayIndex,
  };
}

export function generateTimeSlots(hourConfig: BusinessHourData): string[] {
  if (hourConfig.isClosed) return [];

  const slots: string[] = [];
  const interval = hourConfig.slotDurationMinutes || 20;

  // Morning Slots
  const mStart = timeToMinutes(hourConfig.morningOpenTime);
  const mEnd = timeToMinutes(hourConfig.morningCloseTime);
  for (let m = mStart; m + interval <= mEnd; m += interval) {
    const hh = Math.floor(m / 60).toString().padStart(2, '0');
    const mm = (m % 60).toString().padStart(2, '0');
    slots.push(`${hh}:${mm}`);
  }

  // Evening Slots (if applicable)
  if (hourConfig.hasEveningSession) {
    const eStart = timeToMinutes(hourConfig.eveningOpenTime);
    const eEnd = timeToMinutes(hourConfig.eveningCloseTime);
    for (let m = eStart; m + interval <= eEnd; m += interval) {
      const hh = Math.floor(m / 60).toString().padStart(2, '0');
      const mm = (m % 60).toString().padStart(2, '0');
      slots.push(`${hh}:${mm}`);
    }
  }

  return slots;
}