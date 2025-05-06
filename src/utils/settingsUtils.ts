export type Theme = 'DEFAULT' | 'LIGHT' | 'DARK';

export type WeekStartDay = 'DEFAULT' | 'SUN' | 'MON';

export interface AppSettings {
	theme?: Theme;
	weekStartDay?: WeekStartDay;
	hasSeenInstallationPrompt?: boolean;
	enableHolidayDisplay?: boolean;
	holidayCountry?: string;
}

export const DefaultSettings: AppSettings = {
	theme: 'DEFAULT',
	weekStartDay: 'DEFAULT',
	hasSeenInstallationPrompt: false,
	enableHolidayDisplay: true,
	holidayCountry: 'JP',
};
