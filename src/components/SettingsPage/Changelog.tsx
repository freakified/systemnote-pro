import React from 'react';
import {
	IonHeader,
	IonToolbar,
	IonTitle,
	IonContent,
	IonButtons,
	IonBackButton,
	IonList,
	IonItem,
	IonLabel,
	IonListHeader,
	IonPage,
	IonText,
} from '@ionic/react';

import './SettingsPage.css';

const ChangeLog: React.FC = () => {
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
					<IonTitle>Version History</IonTitle>
				</IonToolbar>
			</IonHeader>
			<IonContent fullscreen class="changelog_">
				<IonListHeader>
					<IonLabel>Version 1.2</IonLabel>
				</IonListHeader>
				<IonList inset={true}>
					<IonItem>
						<IonText slot="start" color="medium">
							&#9642;
						</IonText>{' '}
						<IonLabel>
							Option to show public holidays on calendar
						</IonLabel>
					</IonItem>
					<IonItem>
						<IonText slot="start" color="medium">
							&#9642;
						</IonText>
						<IonLabel>New icon for emoji selector</IonLabel>
					</IonItem>
				</IonList>
				<IonListHeader>
					<IonLabel>Version 1.1</IonLabel>
				</IonListHeader>
				<IonList inset={true}>
					<IonItem>
						<IonText slot="start" color="medium">
							&#9642;
						</IonText>
						<IonLabel>Dark mode improvements</IonLabel>
					</IonItem>
					<IonItem>
						<IonText slot="start" color="medium">
							&#9642;
						</IonText>
						<IonLabel>Interactive app onboarding function</IonLabel>
					</IonItem>
					<IonItem>
						<IonText slot="start" color="medium">
							&#9642;
						</IonText>
						<IonLabel>
							Improved settings page functionality
						</IonLabel>
					</IonItem>
				</IonList>
				<IonListHeader>
					<IonLabel>Version 1.0</IonLabel>
				</IonListHeader>
				<IonList inset={true}>
					<IonItem>
						<IonText slot="start" color="medium">
							&#9642;
						</IonText>
						<IonLabel>Initial release</IonLabel>
					</IonItem>
				</IonList>
			</IonContent>
		</IonPage>
	);
};

export default ChangeLog;
