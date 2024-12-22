import React, { useState } from 'react';
import {
	IonContent,
	IonHeader,
	IonPage,
	IonTitle,
	IonToolbar,
	IonList,
	IonItem,
	IonLabel,
	IonSelect,
	IonSelectOption,
	IonToggle,
	IonButton,
	IonButtons,
	IonListHeader,
	IonInput,
	IonText,
} from '@ionic/react';
import { AppSettings } from '../../utils/settingsUtils';

interface SettingsPageProps {
	onCancelButtonClick: () => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({
	onCancelButtonClick,
}) => {
	// States for the settings
	const [currentSettings, setCurrentSettings] = useState<AppSettings>({
		theme: 'DEFAULT',
		weekStartDay: 'DEFAULT',
		defaultNoteTag: '',
	});

	return (
		<IonPage>
			<IonHeader translucent={true}>
				<IonToolbar>
					<IonButtons slot="secondary">
						<IonButton onClick={onCancelButtonClick}>
							Cancel
						</IonButton>
					</IonButtons>
					<IonButtons slot="primary">
						<IonButton>Done</IonButton>
					</IonButtons>
					<IonTitle>Settings</IonTitle>
				</IonToolbar>
			</IonHeader>
			<IonContent color="light">
				<IonListHeader>General</IonListHeader>
				<IonList inset={true}>
					{/* Dark Mode Selection */}
					<IonItem>
						<IonLabel>Appearance</IonLabel>
						<IonSelect
							value={currentSettings.theme}
							onIonChange={(e) =>
								setCurrentSettings({
									...currentSettings,
									theme: e.detail
										.value as AppSettings['theme'],
								})
							}
							interface="popover"
						>
							<IonSelectOption value="DEFAULT">
								System Default
							</IonSelectOption>
							<IonSelectOption value="LIGHT">
								Light
							</IonSelectOption>
							<IonSelectOption value="DARK">Dark</IonSelectOption>
						</IonSelect>
					</IonItem>
				</IonList>
				<IonListHeader>Data and Backups</IonListHeader>
				<IonList inset={true}>
					<IonItem>
						<IonLabel color="primary">
							Export calendar data
						</IonLabel>
					</IonItem>
					<IonItem>
						<IonLabel color="primary">
							Import calendar data
						</IonLabel>
					</IonItem>
					<IonItem>
						<IonLabel color="danger">
							Delete all calendar data
						</IonLabel>
					</IonItem>
				</IonList>
				<IonList inset={true}>
					<IonItem>
						<IonText color="medium">SystemNote Pro</IonText>
						<IonText color="medium">Version 0.01</IonText>
					</IonItem>
				</IonList>
			</IonContent>
		</IonPage>
	);
};
