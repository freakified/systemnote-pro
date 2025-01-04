// Given a Date, returns a string of the year alone

import {
	NumericDateString,
	NumericDayString,
	NumericMonthString,
	NumericYearMonthString,
	NumericYearString,
} from './customTypes';

/**** Convenient stringification Functions ****/

// Example output: "2024"
export const getNumericYearString = (
	date: Date,
	locale: string = 'en-US',
): NumericYearString => {
	const options = { year: 'numeric' } as Intl.DateTimeFormatOptions;
	const year = new Intl.DateTimeFormat(locale, options).format(date);

	if (/^\d{4}$/.test(year)) {
		return year as NumericYearString;
	} else {
		throw new Error(`Invalid year returned: ${year}`);
	}
};

// Given a Date, returns a string of the month number alone
// Example output: "11"
export const getNumericMonthString = (date: Date): NumericMonthString => {
	const month = (date.getMonth() + 1)
		.toString()
		.padStart(2, '0') as NumericMonthString;
	return month;
};

// Given a Date, returns a string of the day alone
// Example output: "23"
export const getNumericDayString = (date: Date): NumericDayString => {
	const dayNumber = date
		.getDate()
		.toString()
		.padStart(2, '0') as NumericDayString;
	return dayNumber;
};

export const getShortMonthNumberString = (date: Date): string => {
	const month = (date.getMonth() + 1).toString();
	return month;
};

export const getShortDayNumberString = (date: Date): string => {
	const dayNumber = date.getDate().toString();

	return dayNumber;
};

// Given a date, returns a string of the year and month
// Example output: 202401 (for January 2024)
export const getNumericYearMonthString = (
	date: Date,
): NumericYearMonthString => {
	return `${getNumericYearString(date)}${getNumericMonthString(date)}`;
};

export const getNumericDateString = (date: Date): NumericDateString => {
	return `${getNumericYearString(date)}${getNumericMonthString(date)}${getNumericDayString(date)}`;
};

/**** Localization Functions ****/

// Given a Date, returns a string of the month alone
// Example output: "September"
export const getFullMonthName = (
	date: Date,
	locale: string = 'en-US',
): string => {
	const options = { month: 'long' } as Intl.DateTimeFormatOptions;
	return new Intl.DateTimeFormat(locale, options).format(date);
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

/**** Date Math ****/

// Given a Date, adds or subtract N months from that date
export const getDateWithMonthOffset = (
	date: Date,
	monthOffset: number,
): Date => {
	const newDate = new Date(date);
	newDate.setMonth(newDate.getMonth() + monthOffset);
	return newDate;
};

// Given two Dates, returns true if it's today
export const isToday = (date: Date) => {
	const dateOnly = date.setHours(0, 0, 0, 0);
	const todayDateOnly = new Date().setHours(0, 0, 0, 0);

	return dateOnly === todayDateOnly;
};
