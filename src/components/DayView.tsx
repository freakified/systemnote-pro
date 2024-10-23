import React from 'react';
import { IonContent, IonItem, IonLabel, IonNote, IonTextarea } from '@ionic/react';
import './DayView.css';
import { getDayNumber, getWeekdayNameShort } from '../utils/dateUtils';
import TextareaAutosize from "react-textarea-autosize"

interface DayViewProps {
	date: Date;
}

const DayView: React.FC<DayViewProps> = ({ date }) => {
	return (
		<IonContent className="dayView-root">
			<div className="dayView-toolbar">
				<div className="dayView-dayNumber">{getDayNumber(date)}</div>
				<div className="dayView-weekday">
					{getWeekdayNameShort(date, 'ja-JP')}{' '}
					{getWeekdayNameShort(date)}
				</div>
			</div>
			<TextareaAutosize className="dayView-note-textarea"></TextareaAutosize>
		</IonContent>
	);
};

export default DayView;
