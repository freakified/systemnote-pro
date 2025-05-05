import React, { useState } from 'react';
import { IonButton, IonContent, IonIcon, IonModal } from '@ionic/react';
import './DayView.css';
import {
	getShortDayNumberString,
	getWeekdayNameShort,
} from '../../utils/dateUtils';
import TextareaAutosize from 'react-textarea-autosize';
import EmojiPicker, { EmojiStyle, Theme } from 'emoji-picker-react';
import { TagEntry } from '../../utils/customTypes';
import { happyOutline, trashOutline } from 'ionicons/icons';
import { HolidaysTypes } from 'date-holidays';

interface DayViewProps {
	date: Date;
	note?: string;
	tags?: TagEntry;
	annualHolidays?: HolidaysTypes.Holiday[];
	onTextAreaChange?: React.ChangeEventHandler<HTMLTextAreaElement>;
	onTagsChange?: (newTags: TagEntry) => void;
}

export const DayView: React.FC<DayViewProps> = ({
	date,
	note = '',
	tags = [],
	annualHolidays,
	onTextAreaChange,
	onTagsChange,
}) => {
	// Tracks which, if any, tag is currently being edited
	// Used to control when the emoji picker is shown, and what it is editing
	const [activeTagSelectionIdx, setActiveTagSelectionIdx] = useState<
		number | null
	>(null);

	// Determine if the delete button should be shown
	const hasDeleteButton =
		activeTagSelectionIdx !== null && tags[activeTagSelectionIdx] !== '';

	const handleUpdateTag = (emoji: string) => {
		if (activeTagSelectionIdx !== null) {
			const updatedTags = [...tags];
			updatedTags[activeTagSelectionIdx] = emoji;

			onTagsChange?.(updatedTags);
			setActiveTagSelectionIdx(null);
		}
	};

	return (
		<IonContent className="dayView-root">
			<div className="dayView-toolbar">
				<div className="dayView-dateContainer">
					<div className="dayView-dayNumber">
						{getShortDayNumberString(date)}
					</div>
					<div className="dayView-dayInfoContainer">
						<div className="dayView-holiday">
							{
								// In theory, we could modify this in a future update to allow for
								// multiple holidays on a day (which the library supports),
								// but for now we limit to one per day
								annualHolidays?.find(
									(h) =>
										new Date(h.date).toDateString() ===
										date.toDateString(),
								)?.name
							}
						</div>
						<div className="dayView-weekday">
							{getWeekdayNameShort(date, 'ja-JP')}{' '}
							{getWeekdayNameShort(date)}
						</div>
					</div>
					<div className="dayView-emojiToolbar">
						{[0, 1].map((index) => (
							<IonButton
								key={index}
								className="emojiSelectorButton"
								size="default"
								fill="outline"
								onClick={() => setActiveTagSelectionIdx(index)}
							>
								{tags[index] || (
									<IonIcon
										slot="icon-only"
										size="medium"
										icon={happyOutline}
									></IonIcon>
								)}
							</IonButton>
						))}
					</div>
				</div>
			</div>
			<TextareaAutosize
				onChange={(e) => onTextAreaChange?.(e)}
				className="dayView-note-textarea"
				value={note}
			/>
			<IonModal
				isOpen={activeTagSelectionIdx !== null}
				onDidDismiss={() => setActiveTagSelectionIdx(null)}
				initialBreakpoint={0.5}
				breakpoints={[0, 0.5, 0.9]}
			>
				<IonContent className="ion-padding">
					{hasDeleteButton && (
						<IonButton
							size="default"
							color="danger"
							fill="outline"
							className="dayView-emojiPicker-deleteButton"
							onClick={() => handleUpdateTag('')}
						>
							<IonIcon
								slot="icon-only"
								size="medium"
								icon={trashOutline}
							></IonIcon>
						</IonButton>
					)}

					<EmojiPicker
						autoFocusSearch={false}
						skinTonesDisabled={true}
						emojiStyle={EmojiStyle.NATIVE}
						lazyLoadEmojis={true}
						previewConfig={{ showPreview: false }}
						theme={Theme.AUTO}
						onEmojiClick={(emojiObject) => {
							handleUpdateTag(emojiObject.emoji);
						}}
						width="100%"
						height="auto"
						className={
							hasDeleteButton
								? 'dayView-emojiPicker--withDelete'
								: ''
						}
					/>
				</IonContent>
			</IonModal>
		</IonContent>
	);
};
