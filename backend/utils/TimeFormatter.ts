import moment from 'moment-timezone';

export function formatToUserTimezone(date: Date, timezone: string): string {
  return moment(date).tz(timezone).format('YYYY-MM-DD hh:mm A z');
}
