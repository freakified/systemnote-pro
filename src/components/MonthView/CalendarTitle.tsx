import React from 'react';
import {
	getFullMonthName,
	getNumericMonthString,
	getNumericYearString,
} from '../../utils/dateUtils';

interface CalendarTitleProps {
	date: Date;
}

export const CalendarTitle: React.FC<CalendarTitleProps> = ({ date }) => (
	<h2 className="calendarHeading-root">
		<div className="calendarHeading-monthNumber">
			{getNumericMonthString(date)}
		</div>
		<div className="calendarHeading-monthAndYear">
			<div>{getNumericYearString(date)}</div>
			<div>{getFullMonthName(date)}</div>
		</div>
	</h2>
);
