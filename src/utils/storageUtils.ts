import { Storage } from '@ionic/storage';

import {
	NumericYearString,
	NumericDayString,
	NumericMonthString,
	NumericDateString,
	NumericYearMonthString,
	MonthTags,
} from './customTypes';



// 1. Retrieve all tags for a specific month
export const getMonthTags = async (
	month: NumericYearMonthString,
	storage: Storage,
): Promise<MonthTags> => {
	const monthKey = `tags_${month}`; // e.g., "tags_202401"
	const tags: MonthTags = (await storage.get(monthKey)) || {}; // Typecasting result to MonthTags
	return tags;
};

// 2. Set tags for a specific day in a month
export const setDayTags = async (
	month: `${NumericYearString}${NumericMonthString}`,
	day: NumericDayString,
	tags: string[],
	storage: Storage,
): Promise<void> => {
	const monthKey = `tags_${month}`;
	const monthTags: MonthTags = await getMonthTags(month, storage); // Retrieve existing tags for the month
	monthTags[day] = { tags }; // Update tags for the specified day as per TagEntry

	await storage.set(monthKey, monthTags); // Save updated tags back to storage
};

// 3. Retrieve a note for a specific day
export const getDayNote = async (
	day: NumericDateString,
	storage: Storage,
): Promise<string> => {
	const dayKey = `note_${day}`; // e.g., "note_20240101"
	const note: string = (await storage.get(dayKey)) || ''; // Default to empty string if no note found
	return note;
};

// 4. Set a note for a specific day
export const setDayNote = async (
	day: NumericDateString,
	note: string,
	storage: Storage,
): Promise<void> => {
	const dayKey = `note_${day}`;
	await storage.set(dayKey, note); // Save the note to storage
};
