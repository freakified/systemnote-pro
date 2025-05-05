import React, { useMemo, useState } from 'react';
import {
	IonContent,
	IonHeader,
	IonPage,
	IonTitle,
	IonToolbar,
	IonList,
	IonItem,
	IonLabel,
	IonButtons,
	IonListHeader,
	IonNote,
	IonIcon,
	IonActionSheet,
	IonAlert,
	IonBadge,
	IonBackButton,
} from '@ionic/react';

import { APP_VERSION } from '../../utils/constants';
import { Storage } from '@ionic/storage';

import { deleteAllData, writeMultiMonthlyData } from '../../utils/storageUtils';

import {
	appsOutline,
	downloadOutline,
	folderOpenOutline,
	trashOutline,
} from 'ionicons/icons';
import './SettingsPage.css';
import { MultiMonthlyData } from '../../utils/customTypes';
import { countNotesInImport, exportDataAsJSON } from '../../utils/backupUtils';

import {
	isAppInstalled,
	isInstallablePlatform,
} from '../../utils/installationUtils';

interface SettingsPageProps {
	storage?: Storage;
}
import { useSettings } from '../SettingsProvider/SettingsProvider';
import { BASE_URL } from '../../utils/constants';

export const SettingsPage: React.FC<SettingsPageProps> = ({ storage }) => {
	const InstallationStatus: React.FC<{
		showHighlight?: boolean;
	}> = ({ showHighlight = false }) => (
		<>
			<IonListHeader>Installation</IonListHeader>
			<IonList inset={true}>
				<IonItem
					button
					routerLink="settings/installation"
					routerDirection="forward"
				>
					<IonIcon
						aria-hidden="true"
						icon={appsOutline}
						slot="start"
						color="primary"
					></IonIcon>
					<IonLabel>Install app</IonLabel>
					{showHighlight && <IonBadge color="danger">1</IonBadge>}
				</IonItem>
			</IonList>
		</>
	);

	const fileInputRef = React.useRef<HTMLInputElement | null>(null);
	const [showInvalidFileAlert, setShowInvalidFileAlert] = useState(false);
	const [importCompleteAlert, setImportCompleteAlert] = useState(false);
	const [importedNotesCount, setImportedNotesCount] = useState(0);

	const { settings } = useSettings();

	const highlightInstallationStatus =
		isInstallablePlatform() &&
		!isAppInstalled() &&
		settings.hasSeenInstallationPrompt === false;

	const showInstallationStatus = useMemo(() => {
		return isInstallablePlatform();
	}, []);

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
		<IonPage className="settingsPage">
			<IonHeader>
				<IonToolbar color="light">
					<IonTitle>Settings</IonTitle>
					<IonButtons slot="start">
						<IonBackButton
							text="Home"
							defaultHref={`${BASE_URL}`}
							color="primary"
						></IonBackButton>
					</IonButtons>
				</IonToolbar>
			</IonHeader>
			<IonContent color="light">
				{/* <IonHeader collapse="condense">
					<IonToolbar color="light">
						<IonTitle size="large">Settings</IonTitle>
					</IonToolbar>
				</IonHeader> */}
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

						<IonLabel color="primary">Export all notes</IonLabel>
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
						<IonLabel color="primary">Import from backup</IonLabel>
					</IonItem>
					<IonItem button detail={false} id="open-delete-alert">
						<IonIcon
							aria-hidden="true"
							icon={trashOutline}
							slot="start"
							color="danger"
						></IonIcon>
						<IonLabel color="danger">Delete all notes</IonLabel>
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

					<IonItem
						button
						routerLink="settings/changelog"
						routerDirection="forward"
					>
						<IonLabel>App Version</IonLabel>
						<IonNote>{APP_VERSION}</IonNote>
					</IonItem>
				</IonList>

				{showInstallationStatus && (
					<InstallationStatus
						showHighlight={highlightInstallationStatus}
					/>
				)}

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
							handler: () => setShowInvalidFileAlert(false),
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
	);
};
