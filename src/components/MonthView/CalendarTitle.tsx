import React from 'react';
import {
  getFullMonthName,
  getNumericYearString,
  getShortMonthNumberString,
} from '../../utils/dateUtils';
import { TagEntry } from '../../utils/customTypes';
import { NoteIcon } from '../NoteIcon/NoteIcon';
import './CalendarTitle.css';

interface CalendarTitleProps {
  date: Date;
  tags?: TagEntry;
  hasNote?: boolean;
  onTap?: () => void;
}

export const CalendarTitle: React.FC<CalendarTitleProps> = ({
  date,
  tags,
  hasNote,
  onTap,
}) => {
  const activeTags = (tags || []).filter((t) => t !== '');
  const showEmoji = activeTags.length > 0;
  const showNoteIcon = !showEmoji && hasNote;

  return (
    <h2
      className={onTap ? 'calendarHeading-root calendarHeading-root--tappable' : 'calendarHeading-root'}
      onClick={onTap}
      role={onTap ? 'button' : undefined}
      tabIndex={onTap ? 0 : undefined}
      onKeyDown={onTap ? (e) => e.key === 'Enter' && onTap() : undefined}
    >
      <div className="calendarHeading-monthNumber">
        {getShortMonthNumberString(date)}
      </div>
      <div className="calendarHeading-monthAndYear">
        <div>{getNumericYearString(date)}</div>
        <div className="calendarHeading-monthName">
          {getFullMonthName(date)}
          {showEmoji && (
            <span className="calendarHeading-monthIndicator">
              {activeTags.join(' ')}
            </span>
          )}
          {showNoteIcon && (
            <NoteIcon className="calendarHeading-monthIndicator calendarHeading-monthNoteIcon" />
          )}
        </div>
      </div>
    </h2>
  );
};
