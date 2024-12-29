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
	IonButton,
	IonButtons,
	IonListHeader,
	IonNote,
	IonIcon,
	IonActionSheet,
	IonAlert,
	AlertInput,
} from '@ionic/react';
import { Storage } from '@ionic/storage';
import {
	APP_VERSION,
	AppSettings,
	DELETE_PHRASE,
} from '../../utils/settingsUtils';
import { exportData } from '../../utils/storageUtils';
import {
	downloadOutline,
	folderOpenOutline,
	trashOutline,
} from 'ionicons/icons';
import './SettingsPage.css';

const handleExportData = async (storage?: Storage) => {
	if (storage) {
		try {
			const jsonData = await exportData(storage);
			const blob = new Blob([jsonData], { type: 'application/json' });
			const url = URL.createObjectURL(blob);

			const link = document.createElement('a');
			link.href = url;
			link.download = 'systemnote_notes.json';
			link.click();

			// Clean up URL object
			URL.revokeObjectURL(url);
		} catch (error) {
			console.error('Failed to export data:', error);
		}
	}
};

const handleDeleteNotes = async (storage?: Storage) => {
	if (storage) {
		try {
			const jsonData = await exportData(storage);
			const blob = new Blob([jsonData], { type: 'application/json' });
			const url = URL.createObjectURL(blob);

			const link = document.createElement('a');
			link.href = url;
			link.download = 'systemnote_data.json'; // File name
			link.click();

			// Clean up URL object
			URL.revokeObjectURL(url);
		} catch (error) {
			console.error('Failed to export data:', error);
		}
	}
};

interface SettingsPageProps {
	onCancelButtonClick: () => void;
	storage?: Storage;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({
	onCancelButtonClick,
	storage,
}) => {
	const [currentSettings, setCurrentSettings] = useState<AppSettings>({
		theme: 'DEFAULT',
		weekStartDay: 'DEFAULT',
		defaultNoteTag: '',
	});

	const [deleteButtonEnabled, setDeleteButtonEnabled] = useState(false);

	return (
		<IonPage className="settingsPage">
			<IonHeader translucent={true}>
				<IonToolbar>
					<IonButtons slot="primary">
						<IonButton onClick={onCancelButtonClick}>
							Done
						</IonButton>
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
								handleExportData(storage);
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
								handleExportData(storage);
							},
						},
						{
							text: 'Cancel',
							role: 'cancel',
						},
					]}
				></IonActionSheet>

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
							text: 'Yes, delete them all!',
							role: 'destructive',
							cssClass: 'settingsPage-deleteButton',
							handler: handleDeleteNotes,
						},
						{
							text: 'Actually, never mind',
							role: 'cancel',
						},
					]}
				></IonAlert>
			</IonContent>
		</IonPage>
	);
};
