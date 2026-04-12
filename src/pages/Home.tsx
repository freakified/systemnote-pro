import React, { ChangeEvent, useCallback, useEffect } from 'react';
import { useRef, useState } from 'react';
import { debounce } from 'lodash';
import { cogOutline } from 'ionicons/icons';
import { Storage } from '@ionic/storage';

import {
	IonButton,
	IonHeader,
	IonIcon,
	IonModal,
	IonPage,
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
import { MonthNoteView } from '../components/MonthNoteView';
import { getMonthData, getMonthNoteData, writeMultiMonthlyData, writeMultiMonthNoteData } from '../utils/storageUtils';
import { MonthlyData, MonthNoteData, MultiMonthlyData, MultiMonthNoteData, NumericYearMonthString, TagEntry } from '../utils/customTypes';
import { Value } from 'react-calendar/dist/cjs/shared/types';
import {
	isAppInstalled,
	isInstallablePlatform,
} from '../utils/installationUtils';

import Holidays, { HolidaysTypes } from 'date-holidays';

import { useSettings } from '../components/SettingsProvider/SettingsProvider';
import { useIsWideScreen } from '../hooks/useIsWideScreen';

interface HomeProps {
	storage?: Storage;
}

const Home: React.FC<HomeProps> = ({ storage }) => {
	const DEFAULT_DATE = new Date();

	const [selectedDate, setSelectedDate] = useState(DEFAULT_DATE);
	const [activeStartDate, setActiveStartDate] = useState(DEFAULT_DATE);

	const [multiMonthlyData, setMultiMonthlyData] = useState<MultiMonthlyData>(
		{},
	);
	const [currentNote, setCurrentNote] = useState('');
	const [currentTags, setCurrentTags] = useState<TagEntry>([]);

	const [annualHolidays, setAnnualHolidays] = useState<
		HolidaysTypes.Holiday[]
	>([]);

	const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
	const [isMonthNoteModalOpen, setIsMonthNoteModalOpen] = useState(false);
	const [activeMonthNoteDate, setActiveMonthNoteDate] = useState(DEFAULT_DATE);

	const [multiMonthNoteData, setMultiMonthNoteData] = useState<MultiMonthNoteData>({});
	const monthNoteDataCache = useRef<Map<string, MonthNoteData>>(new Map());

	// Derived current month note data
	const currentMonthNoteKey = getNumericYearMonthString(activeMonthNoteDate);
	const currentMonthNote = multiMonthNoteData[currentMonthNoteKey]?.note || '';
	const currentMonthTags = multiMonthNoteData[currentMonthNoteKey]?.tags || [];

	const page = useRef(null);

	// Data cache: tracks which months we've already loaded from storage
	const dataCache = useRef<Map<string, MonthlyData>>(new Map());

	const { settings } = useSettings();
	const isWide = useIsWideScreen();

	if (!settings) {
		return null;
	}

	const showInstallationBadge =
		isInstallablePlatform() &&
		!isAppInstalled() &&
		settings &&
		settings.hasSeenInstallationPrompt === false;

	// Load months into cache if not already present
	const loadMonthsIfNeeded = useCallback(
		async (monthKeys: NumericYearMonthString[]) => {
			if (!storage) return;

			const uncachedMonths = monthKeys.filter(
				(key) => !dataCache.current.has(key),
			);

			if (uncachedMonths.length === 0) return;

			const fetchedData = await Promise.all(
				uncachedMonths.map((month) =>
					getMonthData(month, storage).then((data) => ({
						month,
						data,
					})),
				),
			);

			// Update cache
			const newEntries: Partial<MultiMonthlyData> = {};
			for (const { month, data } of fetchedData) {
				dataCache.current.set(month as string, data);
				newEntries[month] = data;
			}

			// Merge into React state
			setMultiMonthlyData((prev) => ({ ...prev, ...newEntries } as MultiMonthlyData));
		},
		[storage],
	);

	const loadMonthNotesIfNeeded = useCallback(
		async (monthKeys: NumericYearMonthString[]) => {
			if (!storage) return;

			const uncached = monthKeys.filter(
				(key) => !monthNoteDataCache.current.has(key),
			);
			if (uncached.length === 0) return;

			const fetched = await Promise.all(
				uncached.map((month) =>
					getMonthNoteData(month, storage).then((data) => ({ month, data })),
				),
			);

			const newEntries: Partial<MultiMonthNoteData> = {};
			for (const { month, data } of fetched) {
				monthNoteDataCache.current.set(month as string, data);
				newEntries[month] = data;
			}

			setMultiMonthNoteData((prev) => ({ ...prev, ...newEntries } as MultiMonthNoteData));
		},
		[storage],
	);

	// Load initial data (current month ± 2)
	useEffect(() => {
		if (!storage || !settings) return;

		const monthsToFetch = [-2, -1, 0, 1, 2].map((offset) =>
			getNumericYearMonthString(
				getDateWithMonthOffset(activeStartDate, offset),
			),
		);

		loadMonthsIfNeeded(monthsToFetch);
		loadMonthNotesIfNeeded(monthsToFetch);
	}, [storage, settings]); // Only on mount — not on activeStartDate changes

	// When the visible month changes, load nearby months lazily
	const onVisibleMonthChanged = useCallback(
		(monthDate: Date) => {
			const monthsToFetch = [-2, -1, 0, 1, 2].map((offset) =>
				getNumericYearMonthString(
					getDateWithMonthOffset(monthDate, offset),
				),
			);
			loadMonthsIfNeeded(monthsToFetch);
			loadMonthNotesIfNeeded(monthsToFetch);
		},
		[loadMonthsIfNeeded, loadMonthNotesIfNeeded],
	);

	// Get those holidays
	useEffect(() => {
		if (!settings) return;

		if (settings.enableHolidayDisplay) {
			const hd = new Holidays(settings.holidayCountry as string);

			setAnnualHolidays(
				hd.getHolidays(
					activeStartDate.getFullYear(),
					settings.appLanguage || 'en',
				),
			);
		} else {
			setAnnualHolidays([]);
		}
	}, [activeStartDate, settings]);

	// Sync changes to storage periodically
	const syncToStorage = async () => {
		if (!storage) return;

		writeMultiMonthlyData(multiMonthlyData, storage);
	};

	const debouncedSyncToStorage = debounce(syncToStorage, 1000);

	useEffect(() => {
		debouncedSyncToStorage();
	}, [multiMonthlyData]);

	const syncMonthNotesToStorage = async () => {
		if (!storage) return;
		writeMultiMonthNoteData(multiMonthNoteData, storage);
	};

	const debouncedSyncMonthNotesToStorage = debounce(syncMonthNotesToStorage, 1000);

	useEffect(() => {
		debouncedSyncMonthNotesToStorage();
	}, [multiMonthNoteData]);

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

		const updatedMonth: MonthlyData = {
			...multiMonthlyData[monthKey],
			[dayKey]: { ...multiMonthlyData[monthKey]?.[dayKey], note },
		};

		// Update cache too
		dataCache.current.set(monthKey as string, updatedMonth);
		setMultiMonthlyData((prev) => ({ ...prev, [monthKey]: updatedMonth } as MultiMonthlyData));
	};

	const onTagsChange = (newTags: TagEntry) => {
		setCurrentTags(newTags);

		const date = selectedDate;
		const monthKey = getNumericYearMonthString(date);
		const dayKey = getNumericDayString(date);

		const updatedMonth: MonthlyData = {
			...multiMonthlyData[monthKey],
			[dayKey]: { ...multiMonthlyData[monthKey]?.[dayKey], tags: newTags },
		};

		// Update cache too
		dataCache.current.set(monthKey as string, updatedMonth);
		setMultiMonthlyData((prev) => ({ ...prev, [monthKey]: updatedMonth }));
	};

	const onMonthNoteEdit = (e: ChangeEvent<HTMLTextAreaElement>) => {
		const note = e.target.value;
		const monthKey = getNumericYearMonthString(activeMonthNoteDate);
		const updated = { ...multiMonthNoteData[monthKey], note };
		monthNoteDataCache.current.set(monthKey, updated);
		setMultiMonthNoteData((prev) => ({ ...prev, [monthKey]: updated }));
	};

	const onMonthTagsChange = (newTags: TagEntry) => {
		const monthKey = getNumericYearMonthString(activeMonthNoteDate);
		const updated = { ...multiMonthNoteData[monthKey], tags: newTags };
		monthNoteDataCache.current.set(monthKey, updated);
		setMultiMonthNoteData((prev) => ({ ...prev, [monthKey]: updated }));
	};

	const onMonthTitleTap = (monthDate: Date) => {
		setActiveMonthNoteDate(monthDate);
		setIsMonthNoteModalOpen(true);
	};

	const settingsButton = (
		<IonButton
			size="large"
			fill="clear"
			shape="round"
			routerLink="/settings"
			routerDirection="forward"
		>
			<IonIcon
				slot="icon-only"
				size="large"
				icon={cogOutline}
			></IonIcon>
			{showInstallationBadge && (
				<div className="home-settingsButton-badge">
					1
				</div>
			)}
		</IonButton>
	);

	const monthNoteModal = (
		<IonModal
			isOpen={isMonthNoteModalOpen}
			onDidDismiss={() => setIsMonthNoteModalOpen(false)}
			breakpoints={[0, 1]}
			initialBreakpoint={1}
		>
			<MonthNoteView
				date={activeMonthNoteDate}
				note={currentMonthNote}
				tags={currentMonthTags}
				onTextAreaChange={onMonthNoteEdit}
				onTagsChange={onMonthTagsChange}
			/>
		</IonModal>
	);

	const monthView = (
		<MonthView
			activeStartDate={activeStartDate}
			selectedDate={selectedDate}
			multiMonthlyData={multiMonthlyData}
			multiMonthNoteData={multiMonthNoteData}
			onSelectedDateChanged={onDateChange}
			onActiveStartDateChanged={(newDate) =>
				setActiveStartDate(newDate)
			}
			onVisibleMonthChanged={onVisibleMonthChanged}
			onMonthTitleTap={onMonthTitleTap}
			holidays={annualHolidays}
			toolbarExtras={settingsButton}
		/>
	);

	if (isWide) {
		// Tablet/desktop: side-by-side layout
		return (
			<IonPage id="home-page" className="home-page" ref={page}>
				<IonContent scrollY={false}>
					<div className="home-splitLayout">
						<div className="home-splitLayout-calendar">
							{monthView}
						</div>
						<div className="home-splitLayout-detail">
							<DayView
								date={selectedDate}
								onTextAreaChange={onDayEdit}
								note={currentNote}
								tags={currentTags}
								annualHolidays={annualHolidays}
								onTagsChange={onTagsChange}
							/>
						</div>
					</div>
				</IonContent>
				{monthNoteModal}
			</IonPage>
		);
	}

	// Phone: original stacked layout — DayView inline with tappable note area
	return (
		<IonPage id="home-page" className="home-page" ref={page}>
			<IonHeader className="home-view-header">
				{monthView}
			</IonHeader>
			<DayView
				date={selectedDate}
				onTextAreaChange={onDayEdit}
				note={currentNote}
				tags={currentTags}
				annualHolidays={annualHolidays}
				onTagsChange={onTagsChange}
				onNoteTap={() => setIsNoteModalOpen(true)}
			/>
			<IonModal
				isOpen={isNoteModalOpen}
				onDidDismiss={() => setIsNoteModalOpen(false)}
				breakpoints={[0, 1]}
				initialBreakpoint={1}
			>
				<DayView
					date={selectedDate}
					onTextAreaChange={onDayEdit}
					note={currentNote}
					tags={currentTags}
					annualHolidays={annualHolidays}
					onTagsChange={onTagsChange}
				/>
			</IonModal>
			{monthNoteModal}
		</IonPage>
	);
};

export default Home;
