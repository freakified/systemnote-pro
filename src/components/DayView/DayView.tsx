import React, { useRef } from 'react';
import { IonButton, IonContent, IonIcon, IonModal } from '@ionic/react';
import './DayView.css';
import {
	getNumericDayString,
	getWeekdayNameShort,
} from '../../utils/dateUtils';
import TextareaAutosize from 'react-textarea-autosize';
import EmojiPicker, { Emoji, EmojiStyle, Theme } from 'emoji-picker-react';

import { TagEntry } from '../../utils/customTypes';
import { add } from 'ionicons/icons';

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
	const modal = useRef<HTMLIonModalElement>(null);

	// Handle emoji selection
	const handleEmojiSelect = (emoji: string, index: number) => {
		const updatedTags = [...tags];
		if (index < tags.length) {
			updatedTags[index] = emoji; // Update existing tag
		} else {
			updatedTags.unshift(emoji); // Add new tag
		}
		onTagsChange?.(updatedTags);
		modal.current?.dismiss();
	};

	// Open the emoji picker for a specific tag
	const openEmojiPicker = (index: number) => {
		modal.current?.setAttribute('data-index', String(index));
		modal.current?.present();
	};

	return (
		<IonContent className="dayView-root">
			<div className="dayView-toolbar">
				<div className="dayView-dateContainer">
					<div className="dayView-dayNumber">
						{getNumericDayString(date)}
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
							className="emojiSelectorButton withEmoji"
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
				ref={modal}
				initialBreakpoint={0.5}
				breakpoints={[0, 0.5, 1]}
			>
				<IonContent className="ion-padding">
					<EmojiPicker
						autoFocusSearch={false}
						skinTonesDisabled={true}
						emojiStyle={EmojiStyle.NATIVE}
						lazyLoadEmojis={true}
						previewConfig={{ showPreview: false }}
						theme={Theme.AUTO}
						onEmojiClick={(emojiObject) => {
							const index = Number(
								modal.current?.getAttribute('data-index'),
							);
							handleEmojiSelect(emojiObject.emoji, index);
						}}
						width="100%"
						height="auto"
					/>
				</IonContent>
			</IonModal>
		</IonContent>
	);
};
