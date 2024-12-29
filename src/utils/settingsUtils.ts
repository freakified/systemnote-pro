export type Theme = 'DEFAULT' | 'LIGHT' | 'DARK';

export type WeekStartDay = 'DEFAULT' | 'SUN' | 'MON';

export interface AppSettings {
	theme: Theme;
	weekStartDay: WeekStartDay;
	defaultNoteTag: string;
}

export const DefaultSettings: AppSettings = {
	theme: 'DEFAULT',
	weekStartDay: 'DEFAULT',
	defaultNoteTag: '📝',
};

export const APP_VERSION = '1.0';
