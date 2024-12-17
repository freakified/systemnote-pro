import React, { ChangeEvent, useEffect } from 'react';
import { useRef, useState } from 'react';
import { debounce } from 'lodash';
import Calendar, { CalendarProps } from 'react-calendar';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Swiper as SwiperInstance } from 'swiper';
import { arrowUndo, cogOutline } from 'ionicons/icons';
import cx from 'classnames';
import { Storage } from '@ionic/storage';

import './Calendar.css';
import 'swiper/css';

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
import DayView from '../components/DayView';
import SettingsPage from '../components/SettingsPage';
import { getMonthData, writeMultiMonthlyData } from '../utils/storageUtils';
import {
	MonthlyData,
	MultiMonthlyData,
	NumericDayString,
	TagEntry,
} from '../utils/customTypes';
import DayTags from '../components/DayTags';
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

	const swiperRef = useRef<SwiperInstance | null>(null);

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

	const resetCalendarView = () => {
		const defaultMonth =
			DEFAULT_DATE.getMonth() + DEFAULT_DATE.getFullYear() * 100;
		const activeMonth =
			activeStartDate.getMonth() + activeStartDate.getFullYear() * 100;

		if (activeMonth === defaultMonth) {
			setSelectedDate(DEFAULT_DATE);
			setActiveStartDate(DEFAULT_DATE);
		} else {
			// this will cause non-active dates to show they're the default
			setResetAnimationActive(true);

			// Handle the case when we're in a future month
			if (activeMonth > defaultMonth) {
				// Animate left after updating the previous slide
				setTimeout(() => {
					swiperRef.current?.slidePrev(ANIMATION_DURATION, true); // Swipe left (previous slide)
				}, 0);
			}

			// Handle the case when we're in a past month
			else if (activeMonth < defaultMonth) {
				// Animate right after updating the next slide
				setTimeout(() => {
					swiperRef.current?.slideNext(ANIMATION_DURATION, true); // Swipe right (next slide)
				}, 0);
			}

			// Just before the animation completes, reset the state
			// Adding this timing ensures that the state is in time
			setTimeout(() => {
				setSelectedDate(DEFAULT_DATE);
				setActiveStartDate(DEFAULT_DATE);
			}, ANIMATION_DURATION / 10);

			// After the animation completes, reset everything back to default
			setTimeout(() => {
				swiperRef.current?.slideTo(1, 0, false); // Ensure swiper is back in the middle
				setResetAnimationActive(false);
				swiperRef.current?.updateAutoHeight(ANIMATION_DURATION); // Update height for new content
			}, ANIMATION_DURATION);
		}
	};

	const onSlideChangeEnd = (swiper: SwiperInstance) => {
		const { activeIndex } = swiper;

		if (activeIndex === 0) {
			// Swiped to previous month
			setActiveStartDate((prevDate) =>
				getDateWithMonthOffset(prevDate, -1),
			);
		} else if (activeIndex === 2) {
			// Swiped to next month
			setActiveStartDate((prevDate) =>
				getDateWithMonthOffset(prevDate, 1),
			);
		}

		// After adjusting the date, reset the swiper back to the middle slide
		setTimeout(() => {
			swiper.slideTo(1, 0, false);
			swiper.updateAutoHeight();
		}, 0);
	};

	const calendarCommonProps: CalendarProps = {
		onChange: onDateChange,
		// If the reset animation is active, temporarily hide the "today" ring
		value: resetAnimationActive ? null : selectedDate,
		selectRange: false,
		// This sets the start date to Sunday; we'll add an option to control this later
		locale: 'en-US',
		// Hide the navigation, since we're using a custom swipe-based nav system
		showNavigation: false,
		// Hide the year/century/decade view, no one needs that much POWER
		minDetail: 'month',
		formatShortWeekday: (locale: string | undefined, date: Date) => {
			return `${getWeekdayNameShort(date, 'ja-JP')} ${getWeekdayNameShort(date, 'en-US')}`;
		},
		// Ensures that saturdays and sundays can have distinct styling
		tileClassName: ({ date }) => {
			const dayNumber = date.getDay();

			if (dayNumber === 0) {
				return 'react-calendar__month-view__days__day--sunday';
			} else if (dayNumber === 6) {
				return 'react-calendar__month-view__days__day--saturday';
			} else {
				return null;
			}
		},
		tileContent: ({ date }) => {
			const monthKey = getNumericYearMonthString(date);
			const dayKey = getNumericDayString(date);
			const dayData = multiMonthlyData[monthKey]?.[dayKey];
			const dayHasTags = (dayData?.tags || []).length > 0;
			const dayHasNote = (dayData?.note || '').length > 0;

			if (dayHasTags) {
				return <DayTags tags={dayData?.tags} />;
			} else if (dayHasNote) {
				return <DayTags tags={[DEFAULT_NOTE_EMOJI]} />;
			} else {
				return undefined;
			}
		},
	};

	interface CalendarTitleProps {
		date: Date;
	}

	const CalendarTitle: React.FC<CalendarTitleProps> = ({ date }) => (
		<h2 className="calendarHeading-root">
			<div className="calendarHeading-monthNumber">
				{getNumericMonthString(date)}
			</div>
			<div className="calendarHeading-monthAndYear">
				<div>{getNumericYearString(date)}</div>
				<div>{getFullMonthName(date)}</div>
			</div>
		</h2>
	);

	const showTodayResetButton =
		!isToday(selectedDate) ||
		activeStartDate.getMonth() !== DEFAULT_DATE.getMonth();

	return (
		<IonPage id="home-page" ref={page}>
			<IonHeader className="home-view-header">
				<div className="sneakyFloatingToolbar">
					<IonButton
						size="default"
						onClick={resetCalendarView}
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
				<Swiper
					initialSlide={1}
					slidesPerView={1}
					spaceBetween={32}
					autoHeight={true}
					onSlideChangeTransitionEnd={onSlideChangeEnd}
					onSwiper={(swiper) => (swiperRef.current = swiper)}
				>
					{/* Past */}
					<SwiperSlide>
						<div className="calendarContainer">
							<CalendarTitle date={pastCalendarStartDate} />
							<Calendar
								activeStartDate={pastCalendarStartDate}
								{...calendarCommonProps}
							/>
						</div>
					</SwiperSlide>
					{/* Present */}
					<SwiperSlide>
						<div className="calendarContainer">
							<CalendarTitle date={activeStartDate} />
							<Calendar
								activeStartDate={activeStartDate}
								{...calendarCommonProps}
							/>
						</div>
					</SwiperSlide>
					{/* Future */}
					<SwiperSlide>
						<div className="calendarContainer">
							<CalendarTitle date={futureCalendarStartDate} />
							<Calendar
								activeStartDate={futureCalendarStartDate}
								{...calendarCommonProps}
							/>
						</div>
					</SwiperSlide>
				</Swiper>
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
