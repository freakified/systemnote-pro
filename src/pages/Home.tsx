import React, { ChangeEvent, useEffect } from 'react';
import { useRef, useState } from 'react';
import Calendar, { CalendarProps } from 'react-calendar';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Swiper as SwiperInstance } from 'swiper';
import {
	arrowUndo,
	arrowUndoCircle,
	arrowUndoOutline,
	cogOutline,
} from 'ionicons/icons';
import { Value } from 'react-calendar/dist/cjs/shared/types';
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
import {
	getDayNote,
	getDaysWithNotes,
	setDayNote,
} from '../utils/storageUtils';
import { NumericDayString, TagEntry } from '../utils/customTypes';
import DayTags from '../components/DayTags';

interface HomeProps {
	storage?: Storage;
}

const Home: React.FC<HomeProps> = ({ storage }) => {
	const DEFAULT_DATE = new Date();
	const ANIMATION_DURATION = 300;

	// TODO: this should be a setting?
	const DEFAULT_NOTE_EMOJI = '📝';

	// Note that this is a "value" type and not a "date" type due to peculiarities
	// about react-calendar. Specifically, "value" can be a range, though we never
	// actually use that functionality.
	const [selectedDate, setSelectedDate] = useState<Value>(DEFAULT_DATE);

	// ActiveStartDate represents the currently in-view month
	const [activeStartDate, setActiveStartDate] = useState<Date>(DEFAULT_DATE);

	// Note related states
	const [currentNote, setCurrentNote] = useState('');
	const [currentMonthDaysWithNotes, setCurrentMonthDaysWithNotes] =
		useState<NumericDayString[]>();
	const [pastMonthDaysWithNotes, setPastMonthDaysWithNotes] =
		useState<NumericDayString[]>();
	const [futureMonthDaysWithNotes, setFutureMonthDaysWithNotes] =
		useState<NumericDayString[]>();

	const getDefaultTagsForDay = (date: Date, notes?: NumericDayString[]) => {
		const numericDayString = getNumericDayString(date);

		return (
			notes &&
			([
				notes.indexOf(numericDayString) !== -1 && DEFAULT_NOTE_EMOJI,
			] as TagEntry)
		);
	};

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

	const onDateChange = (value: Value) => {
		setSelectedDate(value);
	};

	// Ensure displayed months have visible note annotations
	useEffect(() => {
		if (storage) {
			// Get current month days with notes
			getDaysWithNotes(
				getNumericYearMonthString(activeStartDate),
				storage,
			).then((daysWithNotes) => {
				setCurrentMonthDaysWithNotes(daysWithNotes);
			});
			// Get past month
			getDaysWithNotes(
				getNumericYearMonthString(pastCalendarStartDate),
				storage,
			).then((daysWithNotes) => {
				setPastMonthDaysWithNotes(daysWithNotes);
			});
			// Get future month
			getDaysWithNotes(
				getNumericYearMonthString(futureCalendarStartDate),
				storage,
			).then((daysWithNotes) => {
				setFutureMonthDaysWithNotes(daysWithNotes);
			});
		}
	}, [storage, selectedDate, activeStartDate]);

	// Update the displayed note from storage when the date "value" changes
	useEffect(() => {
		if (storage) {
			getDayNote(
				getNumericDateString(valueToDate(selectedDate)),
				storage,
			).then((note) => {
				setCurrentNote(note);
			});
		}
	}, [storage, selectedDate]);

	// Update day note in storage when notes area modified
	const onDayEdit = (e: ChangeEvent<HTMLTextAreaElement>) => {
		const note = e.target.value;
		setCurrentNote(note);
		if (storage !== undefined) {
			setDayNote(
				getNumericDateString(valueToDate(selectedDate)),
				note,
				storage,
			);
		}
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

	// Converts the react-calendar specific "value" type to a vanilla date
	// (Value can be a range, but we don't use range functionality here)
	const valueToDate = (value: Value) => {
		if (Array.isArray(value)) {
			return value[0] ?? DEFAULT_DATE;
		} else {
			return value ?? DEFAULT_DATE;
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
		!isToday(valueToDate(selectedDate)) ||
		activeStartDate.getMonth() !== DEFAULT_DATE.getMonth();

	return (
		<IonPage id="home-page" ref={page}>
			<IonHeader className="home-view-header">
				<div className="sneakyFloatingToolbar">
					<IonButton
						size="default"
						fill="solid"
						shape="round"
						onClick={resetCalendarView}
						className={cx({
							resetButton: true,
							'resetButton--hidden': !showTodayResetButton,
						})}
					>
						<IonIcon
							slot="icon-only"
							size="medium"
							icon={arrowUndo}
						></IonIcon>
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
								tileContent={({ date }) => (
									<DayTags
										tags={getDefaultTagsForDay(
											date,
											pastMonthDaysWithNotes,
										)}
									/>
								)}
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
								tileContent={({ date }) => (
									<DayTags
										tags={getDefaultTagsForDay(
											date,
											currentMonthDaysWithNotes,
										)}
									/>
								)}
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
								tileContent={({ date }) => (
									<DayTags
										tags={getDefaultTagsForDay(
											date,
											futureMonthDaysWithNotes,
										)}
									/>
								)}
								{...calendarCommonProps}
							/>
						</div>
					</SwiperSlide>
				</Swiper>
			</IonHeader>
			<DayView
				date={valueToDate(selectedDate)}
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
