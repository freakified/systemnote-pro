import MessageListItem from '../components/MessageListItem';
import { useState } from 'react';
import { Message, getMessages } from '../data/messages';
import {
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

  useIonViewWillEnter(() => {
    const msgs = getMessages();
    setMessages(msgs);
  });

  const refresh = (e: CustomEvent) => {
    setTimeout(() => {
      e.detail.complete();
    }, 3000);
  };

  return (
    <IonPage id="home-page">
        <IonContent className="ion-padding" scrollY={false}>
          <IonDatetime
            locale="ja-JP"
            presentation="date"
            // TODO make these programmatic (maybe to current year plus/minus 10?)
            yearValues="2022,2023,2024,2025,2026"
            highlightedDates={[
              {
                date: '2024-09-05',
                textColor: '#800080',
                backgroundColor: '#ffc0cb',
              },
              {
                date: '2024-09-10',
                textColor: '#09721b',
                backgroundColor: '#c8e5d0',
              },
              {
                date: '2024-09-20',
                textColor: 'var(--ion-color-secondary-contrast)',
                backgroundColor: 'var(--ion-color-secondary)',
              },
              {
                date: '2024-09-23',
                textColor: 'rgb(68, 10, 184)',
                backgroundColor: 'rgb(211, 200, 229)',
              },
            ]}
            >
            </IonDatetime>
        </IonContent>
    </IonPage>
  );
};

export default Home;
