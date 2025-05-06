import React, { useEffect, useState } from 'react';
import {
	IonHeader,
	IonToolbar,
	IonTitle,
	IonContent,
	IonButtons,
	IonBackButton,
	IonList,
	IonItem,
	IonPage,
	IonRadioGroup,
	IonRadio,
	IonToggle,
	IonListHeader,
} from '@ionic/react';

import Holidays from 'date-holidays';
import { useSettings } from '../SettingsProvider/SettingsProvider';

import './SettingsPage.css';

import { DISPLAYED_HOLIDAY_COUNTRY_OPTIONS } from '../../utils/constants';

const HolidaySelectorPage: React.FC = () => {
	const { settings, updateSettings } = useSettings();
	if (!settings) return;
	const [countries, setCountries] = useState<{ [key: string]: string }>({});

	const [enableHolidayDisplay, setEnableHolidayDisplay] = useState(
		settings.enableHolidayDisplay,
	);
	const [selectedCountry, setSelectedCountry] = useState(
		settings.holidayCountry,
	);

	useEffect(() => {
		const hd = new Holidays();
		const supportedCountries = hd.getCountries('en');
		const filteredCountries = DISPLAYED_HOLIDAY_COUNTRY_OPTIONS.reduce(
			(obj, code) => {
				if (supportedCountries[code]) {
					obj[code] = supportedCountries[code];
				}
				return obj;
			},
			{} as { [key: string]: string },
		);
		setCountries(filteredCountries);
	}, []);

	const handleCountryChange = (value: string) => {
		setSelectedCountry(value);
		updateSettings({ holidayCountry: value });
	};

	const handleHolidayDisplayChange = (value: boolean) => {
		setEnableHolidayDisplay(value);
		updateSettings({ enableHolidayDisplay: value });
	};

	return (
		<IonPage>
			<IonHeader class="ion-no-border" translucent={true}>
				<IonToolbar>
					<IonButtons slot="start">
						<IonBackButton
							defaultHref="/settings"
							text="Settings"
						></IonBackButton>
					</IonButtons>
					<IonTitle>Holidays</IonTitle>
				</IonToolbar>
			</IonHeader>
			<IonContent>
				<IonList inset={true}>
					<IonItem>
						<IonToggle
							checked={enableHolidayDisplay}
							onIonChange={(e) =>
								handleHolidayDisplayChange(e.detail.checked)
							}
						>
							Show holidays on calendar
						</IonToggle>
					</IonItem>
				</IonList>
				{enableHolidayDisplay && (
					<>
						<IonListHeader>Show holidays for</IonListHeader>
						<IonList inset={true}>
							<IonRadioGroup
								value={selectedCountry}
								onIonChange={(e) =>
									handleCountryChange(e.detail.value)
								}
							>
								{Object.entries(countries).map(
									([code, name]) => (
										<IonRadio
											key={code}
											slot="start"
											value={code}
											justify="space-between"
											className="settingsPage-radio"
										>
											<IonItem lines="full">
												{name}
											</IonItem>
										</IonRadio>
									),
								)}
							</IonRadioGroup>
						</IonList>
					</>
				)}
			</IonContent>
		</IonPage>
	);
};

export default HolidaySelectorPage;
