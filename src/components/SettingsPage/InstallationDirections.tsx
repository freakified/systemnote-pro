import React, { useEffect, useMemo } from 'react';
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
	IonIcon,
	IonNote,
	IonListHeader,
	IonPage,
} from '@ionic/react';
import { ellipsisVertical, shareOutline } from 'ionicons/icons';
import { isAppInstalled, getPlatformType } from '../../utils/installationUtils';

import appLogo from '../../appLogo.png';
import { APP_VERSION } from '../../utils/settingsUtils';

import { useSettings } from '../SettingsProvider/SettingsProvider';

const InstallationDirections: React.FC = () => {
	// On load, save that the user has seen the installation prompt,
	// so that we don't annoy users with the badge later
	const { settings, updateSettings } = useSettings();

	useEffect(() => {
		if (settings.hasSeenInstallationPrompt === false) {
			updateSettings({
				hasSeenInstallationPrompt: true,
			});
		}
	}, []);

	// TODO: Re-enable "true" android app installation, one day
	// useEffect(() => {
	// 	// const handler = (e: Event) => {
	// 	// 	e.preventDefault();
	// 	// 	setInstallPromptEvent(e as BeforeInstallPromptEvent);
	// 	// };

	// 	window.addEventListener('beforeinstallprompt', () => {
	// 		alert('Install prompt available');
	// 	});

	// 	// window.addEventListener('beforeinstallprompt', handler);
	// 	// return () => window.removeEventListener('beforeinstallprompt', handler);
	// }, []);

	const platform = useMemo(() => {
		return getPlatformType();
	}, []);

	const isInstalled = useMemo(() => {
		return isAppInstalled();
	}, []);

	const showIosDirections = platform === 'ios' && !isInstalled;
	const showAndroidDirections = platform === 'android' && !isInstalled;

	return (
		<IonPage>
			<IonHeader translucent={true}>
				<IonToolbar>
					<IonButtons slot="start">
						<IonBackButton text="Settings"></IonBackButton>
					</IonButtons>
					<IonTitle>Install App</IonTitle>
				</IonToolbar>
			</IonHeader>
			<IonContent color="light">
				<div className="settingsPage-installation-appLogoContainer">
					<img
						className="settingsPage-appLogoImg"
						src={appLogo}
						width="72"
						height="72"
					/>
					<h2 className="settingsPage-installation-appName">
						SystemNote Pro
					</h2>
					<div className="settingsPage-installation-appVersion">
						version {APP_VERSION}
					</div>
				</div>

				<IonList inset={true}>
					<IonItem>
						<IonLabel>App status</IonLabel>
						<IonNote>
							{isAppInstalled() ? 'Installed' : 'Not installed'}
						</IonNote>
					</IonItem>
				</IonList>

				{showIosDirections && (
					<>
						<IonListHeader>How to install (iOS)</IonListHeader>
						<IonList
							inset={true}
							className="settingsPage-installation-iosDirections"
						>
							<IonItem>
								<IonLabel>
									1. Tap{' '}
									<IonIcon
										icon={shareOutline}
										color="primary"
										aria-label="Share"
									/>{' '}
									at the bottom of the screen
								</IonLabel>
							</IonItem>
							<IonItem>
								<IonLabel>
									2. Find and tap{' '}
									<strong>
										&ldquo;Add to home screen&rdquo;
									</strong>{' '}
									on the menu that appears
								</IonLabel>
							</IonItem>
							<IonItem>
								<IonLabel>
									3. Tap <strong>Add</strong> on the top-right
									of the screen
								</IonLabel>
							</IonItem>
						</IonList>
					</>
				)}

				{showAndroidDirections && (
					<>
						<IonListHeader>How to install (Android)</IonListHeader>
						<IonList
							inset={true}
							className="settingsPage-installation-iosDirections"
						>
							<IonItem>
								<IonLabel>
									1. Tap{' '}
									<IonIcon
										icon={ellipsisVertical}
										aria-label="Menu"
									/>{' '}
									at the top of the screen
								</IonLabel>
							</IonItem>
							<IonItem>
								<IonLabel>
									2. Find and tap{' '}
									<strong>
										&ldquo;Add to home screen&rdquo;
									</strong>{' '}
									on the menu that appears
								</IonLabel>
							</IonItem>
							<IonItem>
								<IonLabel>
									3. Tap <strong>Add</strong> on both dialogs
									that appear
								</IonLabel>
							</IonItem>
						</IonList>
					</>
				)}
			</IonContent>
		</IonPage>
	);
};

export default InstallationDirections;
