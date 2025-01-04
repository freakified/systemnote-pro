import React from 'react';
import {
	getFullMonthName,
	getNumericYearString,
	getShortMonthNumberString,
} from '../../utils/dateUtils';

interface CalendarTitleProps {
	date: Date;
}

export const CalendarTitle: React.FC<CalendarTitleProps> = ({ date }) => (
	<h2 className="calendarHeading-root">
		<div className="calendarHeading-monthNumber">
			{getShortMonthNumberString(date)}
		</div>
		<div className="calendarHeading-monthAndYear">
			<div>{getNumericYearString(date)}</div>
			<div>{getFullMonthName(date)}</div>
		</div>
	</h2>
);
