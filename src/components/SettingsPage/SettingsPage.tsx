import React, { useEffect, useRef, useState } from 'react';
import {
	IonContent,
	IonHeader,
	IonPage,
	IonTitle,
	IonToolbar,
	IonList,
	IonItem,
	IonLabel,
	IonButton,
	IonButtons,
	IonListHeader,
	IonNote,
	IonIcon,
	IonActionSheet,
	IonAlert,
	IonBadge,
	IonNav,
	IonNavLink,
} from '@ionic/react';

import { Storage } from '@ionic/storage';
import {
	APP_VERSION,
	AppSettings,
	DefaultSettings,
} from '../../utils/settingsUtils';
import {
	deleteAllData,
	getSettings,
	setSettings,
	writeMultiMonthlyData,
} from '../../utils/storageUtils';
import {
	appsOutline,
	downloadOutline,
	folderOpenOutline,
	trashOutline,
} from 'ionicons/icons';
import './SettingsPage.css';
import { MultiMonthlyData } from '../../utils/customTypes';
import { countNotesInImport, exportDataAsJSON } from '../../utils/backupUtils';
import InstallationDirections from './InstallationDirections';

interface SettingsPageProps {
	onCancelButtonClick: () => void;
	storage?: Storage;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({
	onCancelButtonClick,
	storage,
}) => {
	const fileInputRef = React.useRef<HTMLInputElement | null>(null);
	const [showInvalidFileAlert, setShowInvalidFileAlert] = useState(false);
	const [importCompleteAlert, setImportCompleteAlert] = useState(false);
	const [importedNotesCount, setImportedNotesCount] = useState(0);
	const [currentSettings, setCurrentSettings] =
		useState<AppSettings>(DefaultSettings);

	useEffect(() => {
		if (storage) {
			(async () => {
				const settings = await getSettings(storage);
				setCurrentSettings(settings);
			})();
		}
	}, [storage]);

	useEffect(() => {
		if (storage) {
			setSettings(currentSettings, storage);
		}
	}, [currentSettings, storage]);

	const handleDeleteNotes = async () => {
		if (storage) {
			deleteAllData(storage);
			location.reload();
		}
	};

	const writeImportedData = async (importedData: MultiMonthlyData) => {
		if (storage && importedData) {
			await writeMultiMonthlyData(
				importedData,
				storage,
				'prioritize-existing',
				false,
			);
			setImportCompleteAlert(true);
		}
	};

	const handleImportData = async (
		event: React.ChangeEvent<HTMLInputElement>,
	) => {
		if (
			!storage ||
			!event.target.files ||
			event.target.files.length === 0
		) {
			return;
		}

		const file = event.target.files[0];
		const reader = new FileReader();

		reader.onload = () => {
			try {
				const jsonData = JSON.parse(reader.result as string);

				if (typeof jsonData !== 'object' || jsonData === null) {
					throw new Error('Invalid format');
				}

				const numImportedNotes = countNotesInImport(jsonData);
				setImportedNotesCount(numImportedNotes);

				if (numImportedNotes === 0) {
					throw new Error('No notes');
				}

				writeImportedData(jsonData);
			} catch {
				if (fileInputRef?.current) {
					fileInputRef.current.value = '';
				}
				setShowInvalidFileAlert(true);
			}
		};

		reader.readAsText(file);
	};

	return (
		<IonNav
			root={() => (
				<IonPage className="settingsPage">
					<IonHeader translucent={true}>
						<IonToolbar>
							<IonTitle>Settings</IonTitle>
							<IonButtons slot="primary">
								<IonButton onClick={onCancelButtonClick}>
									Done
								</IonButton>
							</IonButtons>
						</IonToolbar>
					</IonHeader>
					<IonContent color="light">
						{/* <IonListHeader>General</IonListHeader>
		<IonList inset={true}>
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
		</IonList> */}
						<IonListHeader>App Installation</IonListHeader>
						<IonList inset={true}>
							<IonNavLink
								routerDirection="forward"
								component={() => <InstallationDirections />}
							>
								<IonItem button>
									<IonIcon
										aria-hidden="true"
										icon={appsOutline}
										slot="start"
										color="primary"
									></IonIcon>
									<IonLabel>Install app</IonLabel>
									<IonBadge color="danger">1</IonBadge>
								</IonItem>
							</IonNavLink>
						</IonList>
						<IonListHeader>Import and Export</IonListHeader>
						<IonList inset={true}>
							<IonItem
								button
								detail={false}
								id="open-export-action-sheet"
							>
								<IonIcon
									aria-hidden="true"
									icon={downloadOutline}
									slot="start"
									color="primary"
								></IonIcon>

								<IonLabel color="primary">
									Export all notes
								</IonLabel>
							</IonItem>
							<IonItem
								button
								detail={false}
								id="open-import-action-sheet"
							>
								<IonIcon
									aria-hidden="true"
									icon={folderOpenOutline}
									slot="start"
									color="primary"
								></IonIcon>
								<IonLabel color="primary">
									Import from backup
								</IonLabel>
							</IonItem>
							<IonItem
								button
								detail={false}
								id="open-delete-alert"
							>
								<IonIcon
									aria-hidden="true"
									icon={trashOutline}
									slot="start"
									color="danger"
								></IonIcon>
								<IonLabel color="danger">
									Delete all notes
								</IonLabel>
							</IonItem>
						</IonList>

						<IonListHeader>About</IonListHeader>
						<IonList inset={true}>
							<IonItem>
								<IonLabel>
									<h2>SystemNote Pro</h2>
									<p>Scheduling without limits</p>
								</IonLabel>
							</IonItem>
							<IonItem>
								<IonLabel>App Version</IonLabel>
								<IonNote>{APP_VERSION}</IonNote>
							</IonItem>
						</IonList>

						<IonActionSheet
							header="Export backup of all notes"
							trigger="open-export-action-sheet"
							buttons={[
								{
									text: 'Download as JSON',
									handler: () => {
										exportDataAsJSON(storage);
									},
								},
								{
									text: 'Cancel',
									role: 'cancel',
								},
							]}
						></IonActionSheet>

						<IonActionSheet
							header="Import from backup file"
							trigger="open-import-action-sheet"
							buttons={[
								{
									text: 'Select a notes backup file',
									handler: () => {
										fileInputRef.current?.click();
									},
								},
								{
									text: 'Cancel',
									role: 'cancel',
								},
							]}
						></IonActionSheet>

						<input
							ref={fileInputRef}
							type="file"
							accept="application/json"
							style={{ display: 'none' }}
							onChange={(e) => handleImportData(e)}
						/>

						<IonAlert
							isOpen={showInvalidFileAlert}
							header="Invalid file format"
							message="The selected file does not seem to contain SystemNote backup data."
							buttons={[
								{
									text: 'OK',
									handler: () =>
										setShowInvalidFileAlert(false),
								},
							]}
						/>

						<IonAlert
							isOpen={importCompleteAlert}
							header={`${importedNotesCount} notes imported`}
							message="Your notes have been successfully imported."
							buttons={[
								{
									text: 'Return to calendar',
									handler: () => {
										location.reload();
									},
								},
							]}
						></IonAlert>

						<IonActionSheet
							trigger="open-delete-alert"
							header="Are you sure you want to delete all your notes?"
							buttons={[
								{
									text: 'Delete all notes',
									id: 'delete-alert-secondary',
									role: 'destructive',
									cssClass: 'settingsPage-deleteButton',
								},
								{
									text: 'Cancel',
									role: 'cancel',
								},
							]}
						></IonActionSheet>

						<IonAlert
							trigger="delete-alert-secondary"
							header="Are you REALLY sure you want to delete all your notes?"
							message="This cannot be undone!"
							buttons={[
								{
									text: 'Delete all notes',
									role: 'destructive',
									cssClass: 'settingsPage-deleteButton',
									handler: () => {
										handleDeleteNotes();
									},
								},
								{
									text: 'Cancel',
									role: 'cancel',
								},
							]}
						></IonAlert>
					</IonContent>
				</IonPage>
			)}
		/>
	);
};
