import { Storage } from '@ionic/storage';

import { exportData } from './storageUtils';
import { MultiMonthlyData } from './customTypes';

export const countNotesInImport = (data: MultiMonthlyData): number => {
	let count = 0;

	Object.entries(data).forEach(([yearMonthKey, monthData]) => {
		// Validate the top-level key
		if (!/^notes_\d{6}$/.test(yearMonthKey)) return;

		// Ensure monthData is an object
		if (typeof monthData !== 'object' || monthData === null) return;

		Object.entries(monthData).forEach(([dayKey, dayData]) => {
			// Validate the day key
			if (!/^\d{2}$/.test(dayKey)) return;

			// Ensure dayData is an object
			if (typeof dayData !== 'object' || dayData === null) return;

			// Validate the structure of dayData
			const { note, tags, ...extraProps } = dayData;

			// Check for unexpected properties
			if (Object.keys(extraProps).length > 0) return;

			// Count valid notes
			if (note !== undefined || tags !== undefined) {
				count += 1;
			}
		});
	});

	return count;
};

export const exportDataAsJSON = async (storage?: Storage) => {
	if (storage) {
		const jsonData = await exportData(storage);
		const blob = new Blob([jsonData], { type: 'application/json' });
		const url = URL.createObjectURL(blob);

		const link = document.createElement('a');
		link.href = url;
		link.download = 'systemnote_notes.json';
		link.click();

		URL.revokeObjectURL(url);
	}
};
