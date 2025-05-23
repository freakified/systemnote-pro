/* eslint-disable no-unused-vars */
import React, { ReactNode, useEffect } from 'react';
import { useRef, useState } from 'react';
import Calendar, { CalendarProps } from 'react-calendar';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Swiper as SwiperInstance } from 'swiper';
import cx from 'classnames';

import './MonthView.css';
import 'swiper/css';

import { IonButton, IonIcon } from '@ionic/react';

import {
	getDateWithMonthOffset,
	getNumericDayString,
	getNumericYearMonthString,
	getWeekdayNameShort,
	isToday,
} from '../..//utils/dateUtils';

import { MultiMonthlyData } from '../../utils/customTypes';

import { CalendarTitle } from './CalendarTitle';
import { DayTags } from '../../components/DayTags';
import { Value } from 'react-calendar/dist/cjs/shared/types';
import { arrowUndo } from 'ionicons/icons';
import { HolidaysTypes } from 'date-holidays';

interface MonthViewProps {
	selectedDate: Date;
	activeStartDate: Date;
	multiMonthlyData: MultiMonthlyData;
	holidays?: HolidaysTypes.Holiday[];
	onSelectedDateChanged: (newDate: Date) => void;
	onActiveStartDateChanged: (newDate: Date) => void;
	toolbarExtras?: ReactNode;
}

export const MonthView: React.FC<MonthViewProps> = ({
	selectedDate,
	activeStartDate,
	multiMonthlyData,
	holidays,
	onSelectedDateChanged,
	onActiveStartDateChanged,
	toolbarExtras,
}) => {
	const DEFAULT_DATE = new Date();
	const ANIMATION_DURATION = 300;
	const DEFAULT_HEIGHT = 320;

	const [resetAnimationActive, setResetAnimationActive] =
		useState<boolean>(false);

	const presentCalendarRef = useRef<HTMLDivElement | null>(null);
	const [wrapperHeight, setWrapperHeight] = useState(DEFAULT_HEIGHT);

	const pastCalendarStartDate =
		resetAnimationActive === true
			? DEFAULT_DATE
			: getDateWithMonthOffset(activeStartDate, -1);
	const futureCalendarStartDate =
		resetAnimationActive === true
			? DEFAULT_DATE
			: getDateWithMonthOffset(activeStartDate, 1);

	const swiperRef = useRef<SwiperInstance | null>(null);

	const resetCalendarView = () => {
		const defaultMonth =
			DEFAULT_DATE.getMonth() + DEFAULT_DATE.getFullYear() * 100;
		const activeMonth =
			activeStartDate.getMonth() + activeStartDate.getFullYear() * 100;

		if (activeMonth === defaultMonth) {
			onSelectedDateChanged(DEFAULT_DATE);
			onActiveStartDateChanged(DEFAULT_DATE);
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
				onSelectedDateChanged(DEFAULT_DATE);
				onActiveStartDateChanged(DEFAULT_DATE);
			}, ANIMATION_DURATION / 10);

			// After the animation completes, reset everything back to default
			setTimeout(() => {
				swiperRef.current?.slideTo(1, 0, false); // Ensure swiper is back in the middle
				setResetAnimationActive(false);
			}, ANIMATION_DURATION);
		}
	};

	const updateWrapperHeight = () => {
		const newWrapperHeight =
			presentCalendarRef?.current &&
			presentCalendarRef?.current?.offsetHeight > 0
				? presentCalendarRef.current.offsetHeight
				: DEFAULT_HEIGHT;

		setWrapperHeight(newWrapperHeight);
	};

	// wait a bit before trying to recalculate the wrapper height on load
	useEffect(() => {
		setTimeout(() => {
			updateWrapperHeight();
		}, ANIMATION_DURATION);
	}, []);

	// recalculate the wrapper height every time active start date changes
	useEffect(() => {
		setTimeout(() => {
			updateWrapperHeight();
		}, 10);
	}, [activeStartDate]);

	const onSlideChangeEnd = (swiper: SwiperInstance) => {
		const { activeIndex } = swiper;

		if (activeIndex === 0) {
			// Swiped to previous month
			onActiveStartDateChanged(
				getDateWithMonthOffset(activeStartDate, -1),
			);
		} else if (activeIndex === 2) {
			// Swiped to next month
			onActiveStartDateChanged(
				getDateWithMonthOffset(activeStartDate, 1),
			);
		}

		// After adjusting the date, reset the swiper back to the middle slide
		setTimeout(() => {
			swiper?.slideTo(1, 0, false);
		}, 0);
	};

	const onDateChange = (value: Value) => {
		onSelectedDateChanged(value as Date);
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
		tileClassName: ({ date }) => {
			const dayNumber = date.getDay();
			const classes = [];

			// Ensures that saturdays and sundays can have distinct styling
			if (dayNumber === 0) {
				classes.push('react-calendar__month-view__days__day--sunday');
			} else if (dayNumber === 6) {
				classes.push('react-calendar__month-view__days__day--saturday');
			}

			// Styling for public holidays
			if (
				holidays?.some(
					(holiday) =>
						holiday.start.toDateString() === date.toDateString(),
				)
			) {
				classes.push('react-calendar__month-view__days__day--holiday');
			}

			return classes.join(' ') || null;
		},
		tileContent: ({ date }) => {
			const monthKey = getNumericYearMonthString(date);
			const dayKey = getNumericDayString(date);
			const dayData = multiMonthlyData[monthKey]?.[dayKey];
			const dayHasTags =
				(dayData?.tags || []).filter((el) => el !== '').length > 0;
			const dayHasNote = (dayData?.note || '').length > 0;

			if (dayHasTags) {
				return <DayTags tags={dayData?.tags} visible={true} />;
			} else if (dayHasNote) {
				return <div className="monthView-day-hasNoteIndicator" />;
			}
		},
	};

	const showTodayResetButton =
		!isToday(selectedDate) ||
		activeStartDate.getMonth() !== DEFAULT_DATE.getMonth();

	return (
		<>
			<div className="sneakyFloatingToolbar">
				<IonButton
					size="small"
					onClick={resetCalendarView}
					className={cx({
						resetButton: true,
						'resetButton--hidden': !showTodayResetButton,
					})}
				>
					<IonIcon slot="start" icon={arrowUndo}></IonIcon>
					Today
				</IonButton>
				{toolbarExtras}
			</div>
			<div className="swiperWrapper" style={{ height: wrapperHeight }}>
				<Swiper
					initialSlide={1}
					slidesPerView={1}
					spaceBetween={32}
					autoHeight={false}
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
						<div
							className="calendarContainer"
							ref={presentCalendarRef}
						>
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
			</div>
		</>
	);
};
