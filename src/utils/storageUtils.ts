import { Storage } from '@ionic/storage';

import {
	NumericYearMonthString,
	MonthlyData,
	MultiMonthlyData,
} from './customTypes';
import { AppSettings, DefaultSettings } from './settingsUtils';

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

export const getSettings = async (storage: Storage): Promise<AppSettings> => {
	const storedSettings: Partial<AppSettings> = await storage.get(
		`${DB_PREFIX}_settings`,
	);
	return {
		...DefaultSettings,
		...(storedSettings || {}),
	} as AppSettings;
};

export const setSettings = async (settings: AppSettings, storage: Storage) => {
	await storage.set(`${DB_PREFIX}_settings`, settings);
};
