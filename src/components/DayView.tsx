import React from 'react';
import { IonItem, IonLabel, IonNote, IonTextarea } from '@ionic/react';
import './DayView.css';
import { getDayNumber, getWeekdayNameShort } from '../utils/dateUtils';

interface DayViewProps {
	date: Date;
}

const DayView: React.FC<DayViewProps> = ({ date }) => {
	return (
		<div className="dayView-root">
			<div className="dayView-toolbar">
				<div className="dayView-dayNumber">{getDayNumber(date)}</div>
				<div className="dayView-weekday">
					{getWeekdayNameShort(date, 'ja-JP')}{' '}
					{getWeekdayNameShort(date)}
				</div>
			</div>
			<div className="dayView-note" contentEditable="plaintext-only">
				{/* <textarea className="dayView-note-textarea"></textarea> */}
				{/* <IonTextarea
					className="dayView-note-textarea"
					autoGrow={true}
					
				></IonTextarea> */}
			</div>
		</div>
	);
};

export default DayView;
