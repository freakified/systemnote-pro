import MessageListItem from '../components/MessageListItem';
import { useState } from 'react';
import { Message, getMessages } from '../data/messages';
import Calendar from 'react-calendar';
import { Value, OnArgs } from 'react-calendar/dist/cjs/shared/types';
import './Calendar.css';
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

  const [messages, setMessages] = useState<Message[]>([]);
  const [value, setValue] = useState<Value>(new Date());
  const [activeStartDate, setActiveStartDate] = useState<Date | undefined>(new Date());

  useIonViewWillEnter(() => {
    const msgs = getMessages();
    setMessages(msgs);
  });

  const onDateChange = (value: Value) => {
    setValue(value);
  };

  const onActiveStartDateChange = (args: OnArgs) => {
    setActiveStartDate(args.activeStartDate || undefined);
    console.log(args.activeStartDate);
  };

  const resetCalendarView = () => {
    setValue(new Date());
    setActiveStartDate(new Date());
  }

  const refresh = (e: CustomEvent) => {
    setTimeout(() => {
      e.detail.complete();
    }, 3000);
  };

  return (
    <IonPage id="home-page">
        <IonContent className="ion-padding" scrollY={false}>
          <Calendar
            onChange={onDateChange}
            value={value}
            selectRange={false}

            // Hide the "quick skip" buttons because no one wants to jump 10 years
            // at a time for this app
            prev2Label=""
            next2Label=""

            // Hide the year/century/decade view, no one needs that much POWER
            minDetail="month"
            activeStartDate={activeStartDate}
            onActiveStartDateChange={onActiveStartDateChange}
          />
          <IonButton onClick={resetCalendarView}>Back to today</IonButton>
        </IonContent>
    </IonPage>
  );
};

export default Home;
