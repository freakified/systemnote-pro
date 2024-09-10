import React from 'react';
import MessageListItem from '../components/MessageListItem';
import { useRef, useState } from 'react';
import { Message, getMessages } from '../data/messages';
import Calendar, { CalendarProps } from 'react-calendar';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, { Swiper as SwiperInstance } from 'swiper';
import { cogOutline, arrowUndo } from 'ionicons/icons';
import { Value, OnArgs } from 'react-calendar/dist/cjs/shared/types';

import './Calendar.css';
import 'swiper/css';

import {
	IonButton,
	IonContent,
	IonDatetime,
	IonHeader,
	IonIcon,
	IonList,
	IonPage,
	IonRefresher,
	IonRefresherContent,
	IonTitle,
	IonToolbar,
	useIonViewWillEnter,
} from '@ionic/react';
import './Home.css';

import {
	getDateWithMonthOffset,
	getDayNumber,
	getFullMonthName,
	getFullYear,
	getMonthNumber,
	getWeekdayNameShort,
	isToday,
} from '../utils/dateUtils';
import DayView from '../components/DayView';

const Home: React.FC = () => {
	const DEFAULT_DATE = new Date();

	const [value, setValue] = useState<Value>(DEFAULT_DATE);
	const [activeStartDate, setActiveStartDate] = useState<Date>(DEFAULT_DATE);
	const swiperRef = useRef<SwiperInstance | null>(null);

	const onDateChange = (value: Value) => {
		setValue(value);
	};

	const resetCalendarView = () => {
		setValue(DEFAULT_DATE);
		setActiveStartDate(DEFAULT_DATE);
		setTimeout(() => {
			swiperRef.current?.updateAutoHeight(300);
		}, 0);
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
			swiper.slideTo(1, 0);
		}, 0);
	};

	const calendarCommonProps: CalendarProps = {
		onChange: onDateChange,
		value: value,
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
				{getMonthNumber(date)}
			</div>
			<div className="calendarHeading-monthAndYear">
				<div>{getFullYear(date)}</div>
				<div>{getFullMonthName(date)}</div>
			</div>
		</h2>
	);

	const showTodayResetButton =
		!isToday(valueToDate(value)) ||
		activeStartDate.getMonth() !== DEFAULT_DATE.getMonth();

	return (
		<IonPage id="home-page">
			<IonHeader>
				<div className="sneakyFloatingToolbar">
					{showTodayResetButton && (
						<IonButton
							size="default"
							fill="solid"
							color="light"
							onClick={resetCalendarView}
						>
							Today
						</IonButton>
					)}
					<IonButton size="large" fill="clear" shape="round">
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
					<SwiperSlide>
						<div className="calendarContainer">
							<CalendarTitle
								date={getDateWithMonthOffset(
									activeStartDate,
									-1,
								)}
							/>
							<Calendar
								activeStartDate={getDateWithMonthOffset(
									activeStartDate,
									-1,
								)}
								{...calendarCommonProps}
							/>
						</div>
					</SwiperSlide>
					<SwiperSlide>
						<div className="calendarContainer">
							<CalendarTitle date={activeStartDate} />
							<Calendar
								activeStartDate={activeStartDate}
								{...calendarCommonProps}
							/>
						</div>
					</SwiperSlide>
					<SwiperSlide>
						<div className="calendarContainer">
							<CalendarTitle
								date={getDateWithMonthOffset(
									activeStartDate,
									1,
								)}
							/>
							<Calendar
								activeStartDate={getDateWithMonthOffset(
									activeStartDate,
									1,
								)}
								{...calendarCommonProps}
							/>
						</div>
					</SwiperSlide>
				</Swiper>
			</IonHeader>
			<IonContent>
				<DayView date={valueToDate(value)} />
			</IonContent>
		</IonPage>
	);
};

export default Home;
