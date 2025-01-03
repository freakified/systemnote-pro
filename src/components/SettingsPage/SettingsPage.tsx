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
import { APP_VERSION, AppSettings } from '../../utils/settingsUtils';
import {
	deleteAllData,
	exportData,
	writeMultiMonthlyData,
} from '../../utils/storageUtils';
import {
	downloadOutline,
	folderOpenOutline,
	trashOutline,
} from 'ionicons/icons';
import './SettingsPage.css';
import { MultiMonthlyData } from '../../utils/customTypes';

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

			URL.revokeObjectURL(url);
		} catch {
			// fail silently because I am a bad person
		}
	}
};

const handleDeleteNotes = async (storage?: Storage) => {
	if (storage) {
		deleteAllData(storage);
		location.reload();
	}
};

interface SettingsPageProps {
	onCancelButtonClick: () => void;
	storage?: Storage;
}

const countNotesInImport = (data: MultiMonthlyData): number => {
	let count = 0;
	Object.values(data).forEach((monthData) => {
		Object.values(monthData).forEach((dayData) => {
			if (dayData.note) {
				count += 1;
			}
		});
	});
	return count;
};

export const SettingsPage: React.FC<SettingsPageProps> = ({
	onCancelButtonClick,
	storage,
}) => {
	const fileInputRef = React.useRef<HTMLInputElement | null>(null);
	const [showInvalidFileAlert, setShowInvalidFileAlert] = useState(false);
	const [showImportPolicyAlert, setShowImportPolicyAlert] = useState(false);
	const [importedData, setImportedData] = useState<MultiMonthlyData | null>(
		null,
	);
	const [importedNotesCount, setImportedNotesCount] = useState(0);

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

				setImportedNotesCount(countNotesInImport(jsonData));

				setImportedData(jsonData);
				setShowImportPolicyAlert(true); // Show policy alert if format is valid
			} catch {
				setShowInvalidFileAlert(true); // Show error alert for invalid file
			}
		};

		reader.readAsText(file);
	};

	const handleImportPolicySelection = async (
		overwritePolicy: 'prioritize-existing' | 'prioritize-incoming',
	) => {
		if (storage && importedData) {
			await writeMultiMonthlyData(
				importedData,
				storage,
				overwritePolicy,
				false,
			);
			setImportedData(null);
		}
	};

	const [currentSettings, setCurrentSettings] = useState<AppSettings>({
		theme: 'DEFAULT',
		weekStartDay: 'DEFAULT',
		defaultNoteTag: '',
	});

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
					header="Invalid File"
					message="The selected file is not a valid backup format."
					buttons={[
						{
							text: 'OK',
							handler: () => setShowInvalidFileAlert(false),
						},
					]}
				/>

				<IonAlert
					isOpen={showImportPolicyAlert}
					header={`${importedNotesCount} notes to import`}
					message="If overlapping notes exist, how should it be handled?"
					buttons={[
						{
							text: 'Preserve existing notes',
							handler: () => {
								handleImportPolicySelection(
									'prioritize-existing',
								);
								setShowImportPolicyAlert(false);
							},
						},
						{
							text: 'Replace with imported notes',
							role: 'destructive',
							handler: () => {
								handleImportPolicySelection(
									'prioritize-incoming',
								);
								setShowImportPolicyAlert(false);
							},
						},
						{
							text: 'Cancel',
							role: 'cancel',
							handler: () => {
								setShowImportPolicyAlert(false);
								setImportedData(null); // Reset imported data on cancel
							},
						},
					]}
				/>

				<IonAlert
					isOpen={showInvalidFileAlert}
					header="Notes imported"
					message="The selected file is not a valid backup format."
					buttons={[
						{
							text: 'OK',
							handler: () => setShowInvalidFileAlert(false),
						},
					]}
				/>

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
							text: 'Delete all notes, for real',
							role: 'destructive',
							cssClass: 'settingsPage-deleteButton',
							handler: () => {
								handleDeleteNotes(storage);
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
