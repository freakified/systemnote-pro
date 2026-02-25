/* eslint-disable no-unused-vars */
import React, { ReactNode, useCallback, useEffect } from 'react';
import { useRef, useState } from 'react';
import Calendar, { CalendarProps } from 'react-calendar';
import cx from 'classnames';

import './MonthView.css';

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

// +/- 5 years of months from today
const MONTH_RANGE = 60;
const TOTAL_SLIDES = MONTH_RANGE * 2 + 1;
const CENTER_INDEX = MONTH_RANGE;

// Only render Calendar components within this many slots of the visible one
const RENDER_BUFFER = 2;

interface MonthViewProps {
	selectedDate: Date;
	activeStartDate: Date;
	multiMonthlyData: MultiMonthlyData;
	holidays?: HolidaysTypes.Holiday[];
	onSelectedDateChanged: (newDate: Date) => void;
	onActiveStartDateChanged: (newDate: Date) => void;
	onVisibleMonthChanged?: (monthDate: Date) => void;
	toolbarExtras?: ReactNode;
}

export const MonthView: React.FC<MonthViewProps> = ({
	selectedDate,
	activeStartDate,
	multiMonthlyData,
	holidays,
	onSelectedDateChanged,
	onActiveStartDateChanged,
	onVisibleMonthChanged,
	toolbarExtras,
}) => {
	const TODAY = useRef(new Date()).current;
	const DEFAULT_HEIGHT = 320;
	const ANIMATION_DURATION = 300;

	const [resetAnimationActive, setResetAnimationActive] =
		useState<boolean>(false);

	const scrollContainerRef = useRef<HTMLDivElement | null>(null);
	const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
	const visibleIndexRef = useRef<number>(CENTER_INDEX);
	const [visibleIndex, setVisibleIndex] = useState<number>(CENTER_INDEX);
	const hasInitialScrolled = useRef(false);

	// Height management
	const [wrapperHeight, setWrapperHeight] = useState(DEFAULT_HEIGHT);

	// Compute the date for a given slide index
	const getDateForIndex = useCallback(
		(index: number): Date => {
			const offset = index - CENTER_INDEX;
			return getDateWithMonthOffset(TODAY, offset);
		},
		[TODAY],
	);

	// Set up slide refs array
	useEffect(() => {
		slideRefs.current = new Array(TOTAL_SLIDES).fill(null);
	}, []);

	// Initial scroll to center (no animation)
	useEffect(() => {
		if (hasInitialScrolled.current) return;
		const container = scrollContainerRef.current;
		if (!container) return;

		// Wait for layout
		requestAnimationFrame(() => {
			const slideWidth = container.offsetWidth;
			container.scrollLeft = CENTER_INDEX * slideWidth;
			hasInitialScrolled.current = true;
		});
	}, []);

	// IntersectionObserver to track which month is visible
	useEffect(() => {
		const container = scrollContainerRef.current;
		if (!container) return;

		const observer = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
						const index = Number(
							(entry.target as HTMLElement).dataset.index,
						);
						if (!isNaN(index) && index !== visibleIndexRef.current) {
							visibleIndexRef.current = index;
							setVisibleIndex(index);

							const monthDate = getDateForIndex(index);
							onActiveStartDateChanged(monthDate);
							onVisibleMonthChanged?.(monthDate);
						}
					}
				}
			},
			{
				root: container,
				threshold: 0.5,
			},
		);

		// Observe all slides
		const slides = container.querySelectorAll('.scrollSnapSlide');
		slides.forEach((slide) => observer.observe(slide));

		return () => observer.disconnect();
	}, [
		getDateForIndex,
		onActiveStartDateChanged,
		onVisibleMonthChanged,
	]);

	// Update wrapper height when the visible month changes
	// useEffect(() => {
	// 	const timeout = setTimeout(() => {
	// 		const visibleSlide = slideRefs.current[visibleIndex];
	// 		if (visibleSlide) {
	// 			const calContainer = visibleSlide.querySelector(
	// 				'.calendarContainer',
	// 			) as HTMLElement | null;
	// 			if (calContainer && calContainer.offsetHeight > 0) {
	// 				setWrapperHeight(calContainer.offsetHeight);
	// 			}
	// 		}
	// 	}, 10);
	// 	return () => clearTimeout(timeout);
	// }, [visibleIndex, activeStartDate]);

	const resetCalendarView = () => {
		const container = scrollContainerRef.current;
		if (!container) return;

		const currentMonth =
			activeStartDate.getMonth() + activeStartDate.getFullYear() * 100;
		const todayMonth = TODAY.getMonth() + TODAY.getFullYear() * 100;

		if (currentMonth === todayMonth) {
			// Already on today's month, just select today
			onSelectedDateChanged(TODAY);
			return;
		}

		setResetAnimationActive(true);

		const centerSlide = slideRefs.current[CENTER_INDEX];
		if (centerSlide) {
			centerSlide.scrollIntoView({
				behavior: 'smooth',
				block: 'nearest',
				inline: 'start',
			});
		}

		// After animation, select today and clear the animation flag
		setTimeout(() => {
			onSelectedDateChanged(TODAY);
			setResetAnimationActive(false);
		}, ANIMATION_DURATION);
	};

	const onDateChange = (value: Value) => {
		onSelectedDateChanged(value as Date);
	};

	const calendarCommonProps: CalendarProps = {
		onChange: onDateChange,
		value: resetAnimationActive ? null : selectedDate,
		selectRange: false,
		locale: 'en-US',
		showNavigation: false,
		minDetail: 'month',
		formatShortWeekday: (locale: string | undefined, date: Date) => {
			return `${getWeekdayNameShort(date, 'ja-JP')} ${getWeekdayNameShort(date, 'en-US')}`;
		},
		tileClassName: ({ date }) => {
			const dayNumber = date.getDay();
			const classes = [];

			if (dayNumber === 0) {
				classes.push('react-calendar__month-view__days__day--sunday');
			} else if (dayNumber === 6) {
				classes.push(
					'react-calendar__month-view__days__day--saturday',
				);
			}

			if (
				holidays?.some(
					(holiday) =>
						holiday.start.toDateString() === date.toDateString(),
				)
			) {
				classes.push(
					'react-calendar__month-view__days__day--holiday',
				);
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
		activeStartDate.getMonth() !== TODAY.getMonth();

	// Determine which indices should render full Calendar components
	const shouldRenderCalendar = (index: number) => {
		return Math.abs(index - visibleIndex) <= RENDER_BUFFER;
	};

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
			<div
				className="scrollSnapContainer"
				ref={scrollContainerRef}
				style={{ height: wrapperHeight }}
			>
				{Array.from({ length: TOTAL_SLIDES }, (_, i) => {
					const monthDate = getDateForIndex(i);
					const render = shouldRenderCalendar(i);

					return (
						<div
							key={i}
							className="scrollSnapSlide"
							data-index={i}
							ref={(el) => {
								slideRefs.current[i] = el;
							}}
						>
							{render ? (
								<div className="calendarContainer">
									<CalendarTitle date={monthDate} />
									<Calendar
										activeStartDate={monthDate}
										{...calendarCommonProps}
									/>
								</div>
							) : (
								<div
									className="calendarContainer"
									style={{
										height: wrapperHeight,
									}}
								/>
							)}
						</div>
					);
				})}
			</div>
		</>
	);
};
