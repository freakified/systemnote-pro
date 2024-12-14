import { Storage } from '@ionic/storage';

import {
	NumericDayString,
	NumericYearMonthString,
	TagEntry,
	CombinedMonthData,
} from './customTypes';

export const getMonthData = async (
	month: NumericYearMonthString,
	storage: Storage,
): Promise<CombinedMonthData> => {
	const monthKey = `data_${month}`; // e.g., "data_202401"
	const monthData: CombinedMonthData = (await storage.get(monthKey)) || {};
	return monthData;
};

export const setDayData = async (
	month: NumericYearMonthString,
	day: NumericDayString,
	note: string,
	tags: TagEntry,
	storage: Storage,
): Promise<void> => {
	const monthKey = `data_${month}`;
	const monthData: CombinedMonthData = await getMonthData(month, storage);

	// Update or add data for the specified day
	monthData[day] = { note, tags };

	// Save the updated month data
	await storage.set(monthKey, monthData);
};
