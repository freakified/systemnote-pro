import { Storage } from '@ionic/storage';

import {
	NumericYearMonthString,
	MonthlyData,
	MultiMonthlyData,
} from './customTypes';
import { AppSettings, DefaultSettings } from './settingsUtils';

const NOTES_PREFIX = 'notes';

export const getMonthData = async (
	month: NumericYearMonthString,
	storage: Storage,
): Promise<MonthlyData> => {
	const monthKey = `${NOTES_PREFIX}_${month}`;
	const monthData: MonthlyData = (await storage.get(monthKey)) || {};
	return monthData;
};

export const writeMultiMonthlyData = async (
	monthlyData: MultiMonthlyData,
	storage: Storage,
) => {
	for (const [yearMonthStr, data] of Object.entries(monthlyData)) {
		if (Object.keys(data).length > 0) {
			await storage.set(`${NOTES_PREFIX}_${yearMonthStr}`, data);
		}
	}
};

export const getSettings = async (storage: Storage): Promise<AppSettings> => {
	const storedSettings: Partial<AppSettings> = await storage.get(`settings`);
	return {
		...DefaultSettings,
		...(storedSettings || {}),
	} as AppSettings;
};

export const setSettings = async (settings: AppSettings, storage: Storage) => {
	await storage.set(`settings`, settings);
};

export const exportData = async (storage: Storage): Promise<string> => {
	const allKeys = await storage.keys();
	const allData: Record<string, unknown> = {};

	for (const key of allKeys) {
		allData[key] = await storage.get(key);
	}

	return JSON.stringify(allData, null, 2);
};
