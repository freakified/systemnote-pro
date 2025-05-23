import React, {
	createContext,
	useContext,
	useEffect,
	useState,
	ReactNode,
} from 'react';
import { AppSettings, DefaultSettings } from '../../utils/settingsUtils';
import { getSettings, setSettings } from '../../utils/storageUtils';
import { Storage } from '@ionic/storage';

const SettingsContext = createContext<{
	settings: AppSettings;
	updateSettings: (newSettings: Partial<AppSettings>) => Promise<void>;
}>({
	settings: DefaultSettings,
	updateSettings: async () => {},
});

export const useSettings = () => useContext(SettingsContext);

const storage = new Storage();

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
	const [settings, setSettingsState] = useState<AppSettings>();

	useEffect(() => {
		const init = async () => {
			await storage.create();
			const storedSettings = await getSettings(storage);
			setSettingsState(storedSettings);
		};
		init();
	}, []);

	const updateSettings = async (newSettings: Partial<AppSettings>) => {
		const updated = { ...settings, ...newSettings };
		await setSettings(updated, storage);
		setSettingsState(updated);
	};

	if (!settings) return null;

	return (
		<SettingsContext.Provider value={{ settings, updateSettings }}>
			{children}
		</SettingsContext.Provider>
	);
};
