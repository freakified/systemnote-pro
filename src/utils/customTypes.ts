export type NumericYearString = `${number}`;

// there are only 12 months
export type NumericMonthString =
	| '01'
	| '02'
	| '03'
	| '04'
	| '05'
	| '06'
	| '07'
	| '08'
	| '09'
	| '10'
	| '11'
	| '12';

// there are 31 possible days
export type NumericDayString =
	| '01'
	| '02'
	| '03'
	| '04'
	| '05'
	| '06'
	| '07'
	| '08'
	| '09'
	| '10'
	| '11'
	| '12'
	| '13'
	| '14'
	| '15'
	| '16'
	| '17'
	| '18'
	| '19'
	| '20'
	| '21'
	| '22'
	| '23'
	| '24'
	| '25'
	| '26'
	| '27'
	| '28'
	| '29'
	| '30'
	| '31';

// at last, we can define a date string
export type NumericDateString =
	`${NumericYearString}${NumericMonthString}${NumericDayString}`;
export type NumericYearMonthString =
	`${NumericYearString}${NumericMonthString}`;

// Each day can have 0 or more "tags", which are emojis
// In v1, you get 2 emoji per day. In the future, we
// could increase this for ABSOLUTE CHAOS
export type TagEntry = string[];

// Every day in a month can have
export type MonthTags = Partial<Record<NumericDayString, TagEntry>>;

export type MonthlyData = Partial<
	Record<NumericDayString, { note?: string; tags?: TagEntry }>
>;

export type MultiMonthlyData = Record<NumericYearMonthString, MonthlyData>;
