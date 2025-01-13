import React from 'react';
import {
	IonHeader,
	IonToolbar,
	IonTitle,
	IonContent,
	IonButtons,
	IonBackButton,
} from '@ionic/react';

const InstallationDirections: React.FC = () => {
	return (
		<>
			<IonHeader translucent={true}>
				<IonToolbar>
					<IonButtons slot="start">
						<IonBackButton></IonBackButton>
					</IonButtons>
					<IonTitle>Install App</IonTitle>
				</IonToolbar>
			</IonHeader>
			<IonContent color="light">
				<img src="/systemnote-pro/favicon.png" width="64" height="64" />
				Systemnote Pro Version 1.0
			</IonContent>
		</>
	);
};

export default InstallationDirections;
