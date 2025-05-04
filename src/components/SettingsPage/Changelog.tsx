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
			<IonHeader translucent={true}>
				<IonToolbar>
					<IonButtons slot="start">
						<IonBackButton text="Settings"></IonBackButton>
					</IonButtons>
					<IonTitle>Version History</IonTitle>
				</IonToolbar>
			</IonHeader>
			<IonContent color="light">
				<IonListHeader>
					<IonLabel>Version 1.1</IonLabel>
				</IonListHeader>
				<IonList inset={true}>
					<IonItem>
						<IonLabel>Interactive app onboarding function</IonLabel>
					</IonItem>
					<IonItem>
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
						<IonLabel>Initial release</IonLabel>
					</IonItem>
				</IonList>
			</IonContent>
		</IonPage>
	);
};

export default ChangeLog;
