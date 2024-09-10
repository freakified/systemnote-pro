// Given a Date, returns a string of the year alone
// Example output: "2024"
export const getFullYear = (date: Date, locale: string = 'en-US'): string => {
	const options = { year: 'numeric' } as Intl.DateTimeFormatOptions;
	return new Intl.DateTimeFormat(locale, options).format(date);
};

// Given a Date, returns a string of the month alone
// Example output: "September"
export const getFullMonthName = (
	date: Date,
	locale: string = 'en-US',
): string => {
	const options = { month: 'long' } as Intl.DateTimeFormatOptions;
	return new Intl.DateTimeFormat(locale, options).format(date);
};

// Given a Date, returns a string of the month number alone
// Example output: "11"
export const getMonthNumber = (date: Date): string => {
	return (date.getMonth() + 1).toString();
};

// Given a Date, returns a string of the day alone
// Example output: "23"
export const getDayNumber = (date: Date): string => {
	return date.getDate().toString();
};

// Given a Date, returns a string of the short day
// Example output: "Mon"
export const getWeekdayNameShort = (
	date: Date,
	locale: string = 'en-US',
): string => {
	const options = { weekday: 'short' } as Intl.DateTimeFormatOptions;
	return new Intl.DateTimeFormat(locale, options).format(date);
};

// Given a Date, adds or subtract N months from that date
export const getDateWithMonthOffset = (date: Date, monthOffset: number) => {
	const newDate = new Date(date);
	newDate.setMonth(newDate.getMonth() + monthOffset);
	return newDate;
};
