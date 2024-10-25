import React from 'react';
import { IonContent } from '@ionic/react';
import './DayView.css';
import { getNumericDayString, getWeekdayNameShort } from '../utils/dateUtils';
import TextareaAutosize from 'react-textarea-autosize';
import { TagEntry } from '../utils/customTypes';

interface DayViewProps {
	date: Date;
	note?: string;
	tags?: TagEntry;
	onTextAreaChange?: React.ChangeEventHandler<HTMLTextAreaElement>;
}

const DayView: React.FC<DayViewProps> = ({
	date,
	note,
	tags,
	onTextAreaChange,
}) => {
	return (
		<IonContent className="dayView-root">
			<div className="dayView-toolbar">
				<div className="dayView-dayNumber">
					{getNumericDayString(date)}
				</div>
				<div className="dayView-weekday">
					{getWeekdayNameShort(date, 'ja-JP')}{' '}
					{getWeekdayNameShort(date)}
				</div>
			</div>
			<TextareaAutosize
				onChange={onTextAreaChange}
				className="dayView-note-textarea"
				value={note}
			/>
		</IonContent>
	);
};

export default DayView;
