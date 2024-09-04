import MessageListItem from '../components/MessageListItem';
import { useRef, useState } from 'react';
import { Message, getMessages } from '../data/messages';
import Calendar, { CalendarProps } from 'react-calendar';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, { Swiper as SwiperInstance } from 'swiper';;
import { Value, OnArgs } from 'react-calendar/dist/cjs/shared/types';
import './Calendar.css';
import 'swiper/css';

import {
	IonButton,
	IonContent,
	IonDatetime,
	IonHeader,
	IonList,
	IonPage,
	IonRefresher,
	IonRefresherContent,
	IonTitle,
	IonToolbar,
	useIonViewWillEnter
} from '@ionic/react';
import './Home.css';

const Home: React.FC = () => {
	const [value, setValue] = useState<Value>(new Date());
	const [activeStartDate, setActiveStartDate] = useState<Date>(new Date());
	const swiperRef = useRef<SwiperInstance | null>(null);
	
	const onDateChange = (value: Value) => {
		setValue(value);
	};
	
	const resetCalendarView = () => {
		setValue(new Date());
		setActiveStartDate(new Date());
	}
	
	const getMonthName = (date: Date, locale: string = 'en-US'): string => {
		const options = { month: 'long' } as Intl.DateTimeFormatOptions;
		return new Intl.DateTimeFormat(locale, options).format(date);
	};
	
	// Add or subtract a month from a date
	const getDateWithMonthOffset = (date: Date, monthOffset: number) => {
		const newDate = new Date(date);
		newDate.setMonth(newDate.getMonth() + monthOffset);
		return newDate;
	};

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

		// Hide the navigation, since we're using a custom swipe-based nav system
		showNavigation: false,
		// Hide the year/century/decade view, no one needs that much POWER
		minDetail: 'month',
	}
	
	return (
		<IonPage id="home-page">
			<IonContent className="ion-padding" scrollY={false}>
				<Swiper
					initialSlide={1}
					slidesPerView={1}
					onSlideChangeTransitionEnd={onSlideChangeEnd}
					onSwiper={(swiper) => (swiperRef.current = swiper)}
				>
					<SwiperSlide>
						<h2>{ getMonthName(getDateWithMonthOffset(activeStartDate, -1)) }</h2>
						<Calendar
							activeStartDate={getDateWithMonthOffset(activeStartDate, -1)}
							{...calendarCommonProps}
						/>
					</SwiperSlide>
					<SwiperSlide>
						<h2>{ getMonthName(activeStartDate) }</h2>
						<Calendar
							activeStartDate={activeStartDate}
							{...calendarCommonProps}
						/>
					</SwiperSlide>
					<SwiperSlide>
						<h2>{ getMonthName(getDateWithMonthOffset(activeStartDate, 1)) }</h2>
						<Calendar
							activeStartDate={getDateWithMonthOffset(activeStartDate, 1)}
							{...calendarCommonProps}
						/>
					</SwiperSlide>
				</Swiper>
				<IonButton onClick={resetCalendarView}>Back to today</IonButton>
			</IonContent>
		</IonPage>
	);
};

export default Home;
