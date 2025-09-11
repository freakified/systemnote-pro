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

import changelog from '../../utils/changelog.json';

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
				{changelog.map((log) => (
					<React.Fragment key={log.version}>
						<IonListHeader>
							<IonLabel>Version {log.version}</IonLabel>
						</IonListHeader>
						<IonList inset={true}>
							{log.entries.map((entry, idx) => (
								<IonItem key={idx}>
									<IonText slot="start" color="medium">
										&bull;
									</IonText>
									<IonLabel>{entry}</IonLabel>
								</IonItem>
							))}
						</IonList>
					</React.Fragment>
				))}
			</IonContent>
		</IonPage>
	);
};

export default ChangeLog;
