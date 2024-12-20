import React, { ChangeEvent, useEffect } from 'react';
import { useRef, useState } from 'react';
import { debounce } from 'lodash';
import { Swiper as SwiperInstance } from 'swiper';
import { cogOutline } from 'ionicons/icons';
import cx from 'classnames';
import { Storage } from '@ionic/storage';

import {
	IonButton,
	IonContent,
	IonHeader,
	IonIcon,
	IonPage,
	IonModal,
	TextareaCustomEvent,
} from '@ionic/react';

import './Home.css';

import {
	getDateWithMonthOffset,
	getFullMonthName,
	getFullYear,
	getNumericDateString,
	getNumericDayString,
	getNumericMonthString,
	getNumericYearMonthString,
	getNumericYearString,
	getWeekdayNameShort,
	isToday,
} from '../utils/dateUtils';
import { MonthView } from '../components/MonthView';
import { DayView } from '../components/DayView';
import { SettingsPage } from '../components/SettingsPage';
import { getMonthData, writeMultiMonthlyData } from '../utils/storageUtils';
import {
	MonthlyData,
	MultiMonthlyData,
	NumericDayString,
	TagEntry,
} from '../utils/customTypes';
import { DayTags } from '../components/DayTags';
import { Value } from 'react-calendar/dist/cjs/shared/types';

interface HomeProps {
	storage?: Storage;
}

const Home: React.FC<HomeProps> = ({ storage }) => {
	const DEFAULT_DATE = new Date();
	const ANIMATION_DURATION = 300;

	// TODO: this should be a setting?
	const DEFAULT_NOTE_EMOJI = '📝';

	const [selectedDate, setSelectedDate] = useState(DEFAULT_DATE);
	const [activeStartDate, setActiveStartDate] = useState(DEFAULT_DATE);

	// Note related states
	const [multiMonthlyData, setMultiMonthlyData] = useState<MultiMonthlyData>(
		{},
	);
	const [currentNote, setCurrentNote] = useState('');

	// Set up sheet modal used by Settings
	const modal = useRef<HTMLIonModalElement>(null);
	const page = useRef(null);

	const [presentingElement, setPresentingElement] =
		useState<HTMLElement | null>(null);

	useEffect(() => {
		setPresentingElement(page.current);
	}, []);

	const dismissSettingsModal = () => {
		modal.current?.dismiss();
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
	// TODO: probably refactor these into StorageUtils also
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

	useEffect(() => {
		const targetDate = selectedDate;
		const monthKey = getNumericYearMonthString(targetDate);
		const dayKey = getNumericDayString(targetDate);
		const dayData = multiMonthlyData[monthKey]?.[dayKey];
		setCurrentNote(dayData?.note || '');
	}, [selectedDate, multiMonthlyData]);

	const [resetAnimationActive, setResetAnimationActive] =
		useState<boolean>(false);

	const pastCalendarStartDate =
		resetAnimationActive === true
			? DEFAULT_DATE
			: getDateWithMonthOffset(activeStartDate, -1);
	const futureCalendarStartDate =
		resetAnimationActive === true
			? DEFAULT_DATE
			: getDateWithMonthOffset(activeStartDate, 1);

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
				[dayKey]: { note, tags: [] }, // todo: add tag inputs
			},
		}));
	};

	const showTodayResetButton =
		!isToday(selectedDate) ||
		activeStartDate.getMonth() !== DEFAULT_DATE.getMonth();

	return (
		<IonPage id="home-page" ref={page}>
			<IonHeader className="home-view-header">
				<div className="sneakyFloatingToolbar">
					<IonButton
						size="default"
						// onClick={resetCalendarView}
						className={cx({
							resetButton: true,
							'resetButton--hidden': !showTodayResetButton,
						})}
					>
						{/* <IonIcon
							slot="start"
							size="medium"
							icon={arrowUndo}
						></IonIcon> */}
						Today
					</IonButton>
					<IonButton
						size="large"
						fill="clear"
						shape="round"
						id="open-settings-modal"
					>
						<IonIcon
							slot="icon-only"
							size="large"
							icon={cogOutline}
						></IonIcon>
					</IonButton>
				</div>
				<MonthView
					activeStartDate={activeStartDate}
					selectedDate={selectedDate}
					multiMonthlyData={multiMonthlyData}
					onSelectedDateChanged={onDateChange}
					onActiveStartDateChanged={(newDate) =>
						setActiveStartDate(newDate)
					}
				/>
			</IonHeader>
			<DayView
				date={selectedDate}
				onTextAreaChange={onDayEdit}
				note={currentNote}
			/>
			<IonModal
				ref={modal}
				trigger="open-settings-modal"
				presentingElement={presentingElement!}
			>
				<SettingsPage onCancelButtonClick={dismissSettingsModal} />
			</IonModal>
		</IonPage>
	);
};

export default Home;
