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
	useIonViewWillEnter
} from '@ionic/react';
import './Home.css';

import { getDateWithMonthOffset, getFullMonthName, getFullYear } from '../utils/dateUtils';
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
	}
	
	// Converts the react-calendar specific "value" type to a vanilla date
	// (Value can be a range, but we don't use range functionality here)
	const valueToDate = (value: Value) => {
		if (Array.isArray(value)) {
			return value[0] ?? DEFAULT_DATE;
		} else {
			return value ?? DEFAULT_DATE;
		}
	}

	const onSlideChangeEnd = (swiper: SwiperInstance) => {
		const { activeIndex } = swiper;
		
		if (activeIndex === 0) {
		  // Swiped to previous month
		  setActiveStartDate((prevDate) => getDateWithMonthOffset(prevDate, -1));
		} else if (activeIndex === 2) {
		  // Swiped to next month
		  setActiveStartDate((prevDate) => getDateWithMonthOffset(prevDate, 1));
		}
	
		// After adjusting the date, reset the swiper back to the middle slide
		setTimeout(() => {
		  swiper.slideTo(1, 0); // No transition
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
	}; 

	interface CalendarTitleProps {
		date: Date;
	}

	const CalendarTitle : React.FC<CalendarTitleProps> = ( { date } ) => (
		<h2>
			{getFullMonthName(date)}
			<span className="calendarheading-year"> {getFullYear(date)}</span>
		</h2>
	);
		
	return (
		<IonPage id="home-page">
			<IonHeader>
				<div className="sneakyFloatingToolbar">
					<IonButton
						size="default"
						fill="solid"
						color="primary"
						onClick={resetCalendarView}>
							Today
					</IonButton>
					<IonButton size="large" fill="clear" shape="round"><IonIcon slot="icon-only" size="large" icon={cogOutline}></IonIcon></IonButton>
				</div>
				<Swiper
					initialSlide={1}
					slidesPerView={1}
					onSlideChangeTransitionEnd={onSlideChangeEnd}
					onSwiper={(swiper) => (swiperRef.current = swiper)}
				>
					<SwiperSlide>
						<CalendarTitle date={getDateWithMonthOffset(activeStartDate, -1)} />
						<Calendar
							activeStartDate={getDateWithMonthOffset(activeStartDate, -1)}
							{...calendarCommonProps}
						/>
					</SwiperSlide>
					<SwiperSlide>
						<CalendarTitle date={activeStartDate} />
						<Calendar
							activeStartDate={activeStartDate}
							{...calendarCommonProps}
						/>
					</SwiperSlide>
					<SwiperSlide>
						<CalendarTitle date={getDateWithMonthOffset(activeStartDate, 1)} />
						<Calendar
							activeStartDate={getDateWithMonthOffset(activeStartDate, 1)}
							{...calendarCommonProps}
						/>
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
