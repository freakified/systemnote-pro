import { Storage } from '@ionic/storage';

import {
	NumericYearMonthString,
	MonthlyData,
	MultiMonthlyData,
} from './customTypes';

const DB_PREFIX = 'systemnote';

export const getMonthData = async (
	month: NumericYearMonthString,
	storage: Storage,
): Promise<MonthlyData> => {
	const monthKey = `${DB_PREFIX}_${month}`;
	const monthData: MonthlyData = (await storage.get(monthKey)) || {};
	return monthData;
};

export const writeMultiMonthlyData = async (
	monthlyData: MultiMonthlyData,
	storage: Storage,
) => {
	for (const [yearMonthStr, data] of Object.entries(monthlyData)) {
		if (Object.keys(data).length > 0) {
			await storage.set(`${DB_PREFIX}_${yearMonthStr}`, data);
		}
	}
};
