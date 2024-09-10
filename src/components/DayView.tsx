import React from 'react';
import { IonItem, IonLabel, IonNote } from '@ionic/react';
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
					{getWeekdayNameShort(date, 'ja-JP')} {getWeekdayNameShort(date)}
				</div>
			</div>
			<div className="dayView-note">
				✅ Ride the train <br />
				✅ Ride the train <br />
				✅ Ride the train <br />
				✅ Ride the train <br />
				🔴 Ride the train even more <br />
				✅ Ride the train <br />
				🔴 Ride the train even more <br />
				✅ Ride the train <br />
				🔴 Ride the train even more <br />
				✅ Ride the train <br />
				🔴 Ride the train even more <br />
				✅ Ride the train <br />
				🔴 Ride the train even more <br />
				� Ride the train even more <br />
				�🔴 Ride the train even more <br />
				✅ Ride the train <br />
				🔴 Ride the train even more <br />
				✅ Ride the train <br />
				🔴 Ride the train even more <br />
				✅ Ride the train <br />
				� Ride the train even more <br />
				✅ Ride the train <br />
				🔴 Ride the train even more <br />
				✅ Ride the train <br />
				🔴 Ride the train even more <br />
				�🔴 Ride the train even more <br />
			</div>
		</div>
	);
};

export default DayView;
