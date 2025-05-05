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
} from '@ionic/react';

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
			<IonContent fullscreen>
				<IonListHeader>
					<IonLabel>Version 1.1</IonLabel>
				</IonListHeader>
				<IonList inset={true}>
					<IonItem>
						<IonLabel>&bull; Dark mode improvements</IonLabel>
					</IonItem>
					<IonItem>
						<IonLabel>
							&bull; Interactive app onboarding function
						</IonLabel>
					</IonItem>
					<IonItem>
						<IonLabel>
							&bull; Improved settings page functionality
						</IonLabel>
					</IonItem>
				</IonList>
				<IonListHeader>
					<IonLabel>Version 1.0</IonLabel>
				</IonListHeader>
				<IonList inset={true}>
					<IonItem>
						<IonLabel>&bull; Initial release</IonLabel>
					</IonItem>
				</IonList>
			</IonContent>
		</IonPage>
	);
};

export default ChangeLog;
