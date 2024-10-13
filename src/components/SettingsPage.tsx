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
	IonNote,
	IonListHeader,
} from '@ionic/react';

interface SettingsPageProps {
	onCancelButtonClick: () => void;
}

const SettingsPage: React.FC<SettingsPageProps> = ({ onCancelButtonClick }) => {
	// States for the settings
	const [darkMode, setDarkMode] = useState<'system' | 'light' | 'dark'>('system');
	const [notificationsEnabled, setNotificationsEnabled] = useState(true);
	const [weekStartDay, setWeekStartDay] = useState<'sunday' | 'monday'>('sunday');

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
							value={darkMode}
							onIonChange={(e) => setDarkMode(e.detail.value)}
							interface="action-sheet"
						>
							<IonSelectOption value="system">System Default</IonSelectOption>
							<IonSelectOption value="light">Light</IonSelectOption>
							<IonSelectOption value="dark">Dark</IonSelectOption>
						</IonSelect>
					</IonItem>

					{/* Notifications Toggle */}
					<IonItem>
						<IonLabel>Start week on Monday</IonLabel>
						<IonToggle
							checked={notificationsEnabled}
							onIonChange={(e) =>
								setNotificationsEnabled(e.detail.checked)
							}
						/>
					</IonItem>

					{/* Week Start Day Selection */}
					<IonItem>
						<IonLabel>Start Week On</IonLabel>
						<IonSelect
							value={weekStartDay}
							onIonChange={(e) => setWeekStartDay(e.detail.value)}
							interface="popover"
						>
							<IonSelectOption value="sunday">Sunday</IonSelectOption>
							<IonSelectOption value="monday">Monday</IonSelectOption>
						</IonSelect>
					</IonItem>
				</IonList>
			</IonContent>
		</IonPage>
	);
};

export default SettingsPage;