import React, { ChangeEvent, useEffect } from 'react';
import { useRef, useState } from 'react';
import { debounce } from 'lodash';
import { cogOutline } from 'ionicons/icons';
import { Storage } from '@ionic/storage';

import {
	IonButton,
	IonHeader,
	IonIcon,
	IonPage,
	IonModal,
	IonBadge,
	IonContent,
} from '@ionic/react';

import './Home.css';

import {
	getDateWithMonthOffset,
	getNumericDayString,
	getNumericYearMonthString,
} from '../utils/dateUtils';
import { MonthView } from '../components/MonthView';
import { DayView } from '../components/DayView';
import { SettingsPage } from '../components/SettingsPage';
import { getMonthData, writeMultiMonthlyData } from '../utils/storageUtils';
import { MultiMonthlyData, TagEntry } from '../utils/customTypes';
import { Value } from 'react-calendar/dist/cjs/shared/types';

interface HomeProps {
	storage?: Storage;
	startWithSettingsModalOpen?: boolean;
}

const Home: React.FC<HomeProps> = ({ storage }) => {
	const DEFAULT_DATE = new Date();

	const [settingsModalOpen, setSettingsModalOpen] = useState(false);

	const [selectedDate, setSelectedDate] = useState(DEFAULT_DATE);
	const [activeStartDate, setActiveStartDate] = useState(DEFAULT_DATE);

	const [multiMonthlyData, setMultiMonthlyData] = useState<MultiMonthlyData>(
		{},
	);
	const [currentNote, setCurrentNote] = useState('');
	const [currentTags, setCurrentTags] = useState<TagEntry>([]); // Store current day's tags

	const page = useRef(null);

	const [presentingElement, setPresentingElement] =
		useState<HTMLElement | null>(null);

	useEffect(() => {
		setPresentingElement(page.current);
	}, []);

	const dismissSettingsModal = () => {
		setSettingsModalOpen(false);
	};

	// Fetch initial data on component mount
	useEffect(() => {
		const fetchInitialData = async () => {
			if (!storage) return;
			const monthsToFetch = [
				getNumericYearMonthString(
					getDateWithMonthOffset(activeStartDate, -1),
				),
				getNumericYearMonthString(activeStartDate),
				getNumericYearMonthString(
					getDateWithMonthOffset(activeStartDate, 1),
				),
			];
			const dataByMonth = await Promise.all(
				monthsToFetch.map((month) =>
					getMonthData(month, storage).then((data) => ({
						month,
						data,
					})),
				),
			);

			setMultiMonthlyData(
				dataByMonth.reduce(
					(acc, { month, data }) => ({ ...acc, [month]: data }),
					{},
				),
			);
		};

		fetchInitialData();
	}, [storage, activeStartDate]);

	// Sync changes to storage periodically
	const syncToStorage = async () => {
		if (!storage) return;

		writeMultiMonthlyData(multiMonthlyData, storage);
	};

	const debouncedSyncToStorage = debounce(syncToStorage, 1000);

	useEffect(() => {
		debouncedSyncToStorage();
	}, [multiMonthlyData]);

	const onDateChange = (value: Value) => {
		setSelectedDate(value as Date);
	};

	// Update note and tags when the selected date changes
	useEffect(() => {
		const targetDate = selectedDate;
		const monthKey = getNumericYearMonthString(targetDate);
		const dayKey = getNumericDayString(targetDate);
		const dayData = multiMonthlyData[monthKey]?.[dayKey];
		setCurrentNote(dayData?.note || '');
		setCurrentTags(dayData?.tags || []); // Set current tags
	}, [selectedDate, multiMonthlyData]);

	// Handle note edits
	const onDayEdit = (e: ChangeEvent<HTMLTextAreaElement>) => {
		const note = e.target.value;
		setCurrentNote(note);

		const date = selectedDate;
		const monthKey = getNumericYearMonthString(date);
		const dayKey = getNumericDayString(date);

		setMultiMonthlyData((prevData) => ({
			...prevData,
			[monthKey]: {
				...prevData[monthKey],
				[dayKey]: { ...prevData[monthKey]?.[dayKey], note },
			},
		}));
	};

	const onTagsChange = (newTags: TagEntry) => {
		setCurrentTags(newTags);

		const date = selectedDate;
		const monthKey = getNumericYearMonthString(date);
		const dayKey = getNumericDayString(date);

		setMultiMonthlyData((prevData) => ({
			...prevData,
			[monthKey]: {
				...prevData[monthKey],
				[dayKey]: { ...prevData[monthKey]?.[dayKey], tags: newTags },
			},
		}));
	};

	const showBadge = true;

	return (
		<IonPage id="home-page" ref={page}>
			<IonContent>
				<IonHeader className="home-view-header">
					<MonthView
						activeStartDate={activeStartDate}
						selectedDate={selectedDate}
						multiMonthlyData={multiMonthlyData}
						onSelectedDateChanged={onDateChange}
						onActiveStartDateChanged={(newDate) =>
							setActiveStartDate(newDate)
						}
						toolbarExtras={
							<IonButton
								size="large"
								fill="clear"
								shape="round"
								onClick={() => setSettingsModalOpen(true)}
							>
								<IonIcon
									slot="icon-only"
									size="large"
									icon={cogOutline}
								></IonIcon>
								{showBadge && (
									<div className="home-settingsButton-badge">
										1
									</div>
								)}
							</IonButton>
						}
					/>
				</IonHeader>
				<DayView
					date={selectedDate}
					onTextAreaChange={onDayEdit}
					note={currentNote}
					tags={currentTags}
					onTagsChange={onTagsChange}
				/>
				<IonModal
					isOpen={settingsModalOpen}
					presentingElement={presentingElement!}
					onDidDismiss={dismissSettingsModal}
				>
					<SettingsPage
						onCancelButtonClick={dismissSettingsModal}
						storage={storage}
					/>
				</IonModal>
			</IonContent>
		</IonPage>
	);
};

export default Home;
