// InstallationDirections.tsx
import React from 'react';
import {
	IonPage,
	IonHeader,
	IonToolbar,
	IonTitle,
	IonContent,
	IonButton,
	IonButtons,
} from '@ionic/react';

const InstallationDirections: React.FC<{ onBack: () => void }> = ({
	onBack,
}) => {
	return (
		<IonPage>
			<IonHeader>
				<IonToolbar>
					<IonButtons slot="start">
						<IonButton onClick={onBack}>Back</IonButton>
					</IonButtons>
					<IonTitle>Install App</IonTitle>
				</IonToolbar>
			</IonHeader>
			<IonContent color="light">
				<img src="/systemnote-pro/favicon.png" width="64" height="64" />
				Systemnote Pro Version 1.0
			</IonContent>
		</IonPage>
	);
};

export default InstallationDirections;
