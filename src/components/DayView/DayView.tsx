import React, { useState } from 'react';
import { IonButton, IonContent, IonIcon, IonModal } from '@ionic/react';
import './DayView.css';
import {
	getNumericDayString,
	getShortDayNumberString,
	getWeekdayNameShort,
} from '../../utils/dateUtils';
import TextareaAutosize from 'react-textarea-autosize';
import EmojiPicker, { EmojiStyle, Theme } from 'emoji-picker-react';

import { TagEntry } from '../../utils/customTypes';
import { add, trashOutline } from 'ionicons/icons';

interface DayViewProps {
	date: Date;
	note?: string;
	tags?: TagEntry;
	onTextAreaChange?: React.ChangeEventHandler<HTMLTextAreaElement>;
	onTagsChange?: (newTags: TagEntry) => void;
}

export const DayView: React.FC<DayViewProps> = ({
	date,
	note = '',
	tags = [],
	onTextAreaChange,
	onTagsChange,
}) => {
	const [currentIndex, setCurrentIndex] = useState<number | null>(null);

	// Determine if the delete button should be shown
	const hasDeleteButton = currentIndex !== null && currentIndex < tags.length;

	// Handle emoji selection
	const handleEmojiSelect = (emoji: string) => {
		if (currentIndex === null) return;
		const updatedTags = [...tags];
		if (currentIndex < tags.length) {
			updatedTags[currentIndex] = emoji; // Update existing tag
		} else {
			updatedTags.unshift(emoji); // Add new tag
		}
		onTagsChange?.(updatedTags);
		setCurrentIndex(null);
	};

	// Handle tag deletion
	const handleDeleteTag = (index: number) => {
		const updatedTags = tags.filter((_, i) => i !== index);
		onTagsChange?.(updatedTags);
		setCurrentIndex(null);
	};

	// Open the emoji picker for a specific tag
	const openEmojiPicker = (index: number) => {
		setCurrentIndex(index);
	};

	return (
		<IonContent className="dayView-root">
			<div className="dayView-toolbar">
				<div className="dayView-dateContainer">
					<div className="dayView-dayNumber">
						{getShortDayNumberString(date)}
					</div>
					<div className="dayView-weekday">
						{getWeekdayNameShort(date, 'ja-JP')}{' '}
						{getWeekdayNameShort(date)}
					</div>
				</div>
				<div className="dayView-emojiToolbar">
					{tags.length < 2 && (
						<IonButton
							className="emojiSelectorButton"
							size="default"
							fill="outline"
							onClick={() => openEmojiPicker(tags.length)}
						>
							<IonIcon
								slot="icon-only"
								size="medium"
								icon={add}
							></IonIcon>
						</IonButton>
					)}
					{tags.map((tag, index) => (
						<IonButton
							key={index}
							className="emojiSelectorButton"
							size="default"
							fill="outline"
							onClick={() => openEmojiPicker(index)}
						>
							{tag}
						</IonButton>
					))}
				</div>
			</div>
			<TextareaAutosize
				onChange={(e) => {
					if (onTextAreaChange) onTextAreaChange(e);
				}}
				className="dayView-note-textarea"
				value={note}
			/>
			<IonModal
				isOpen={currentIndex !== null}
				onDidDismiss={() => setCurrentIndex(null)}
				initialBreakpoint={0.5}
				breakpoints={[0, 0.5, 1]}
			>
				<IonContent className="ion-padding">
					{hasDeleteButton && (
						<IonButton
							size="default"
							color="danger"
							fill="outline"
							className="dayView-emojiPicker-deleteButton"
							onClick={() => handleDeleteTag(currentIndex!)}
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
							handleEmojiSelect(emojiObject.emoji);
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
