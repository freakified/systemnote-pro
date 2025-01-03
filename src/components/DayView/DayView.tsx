import React, { useRef, useState } from 'react';
import { IonButton, IonContent, IonIcon, IonModal } from '@ionic/react';
import './DayView.css';
import {
	getNumericDayString,
	getWeekdayNameShort,
} from '../../utils/dateUtils';
import TextareaAutosize from 'react-textarea-autosize';
import EmojiPicker, { EmojiStyle, Theme } from 'emoji-picker-react';

import { TagEntry } from '../../utils/customTypes';
import { add } from 'ionicons/icons';

interface DayViewProps {
	date: Date;
	note?: string;
	tags?: TagEntry;
	onTextAreaChange?: React.ChangeEventHandler<HTMLTextAreaElement>;
}

export const DayView: React.FC<DayViewProps> = ({
	date,
	note,
	tags,
	onTextAreaChange,
}) => {
	const modal = useRef<HTMLIonModalElement>(null);
	const [currentNote, setCurrentNote] = useState(note || '');
	const pageRef = useRef<HTMLElement | null>(null);

	const handleEmojiSelect = (emoji: string) => {
		setCurrentNote((prev) => prev + emoji);
		modal.current?.dismiss();
	};

	return (
		<IonContent className="dayView-root" ref={pageRef}>
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
					<IonButton
						id="open-emoji-modal"
						className="emojiSelectorButton"
						size="default"
						fill="outline"
					>
						{/* Emoji */}
						<IonIcon
							slot="icon-only"
							size="medium"
							icon={add}
						></IonIcon>
					</IonButton>
				</div>
			</div>
			<TextareaAutosize
				onChange={(e) => {
					setCurrentNote(e.target.value);
					if (onTextAreaChange) onTextAreaChange(e);
				}}
				className="dayView-note-textarea"
				value={currentNote}
			/>
			<IonModal
				ref={modal}
				trigger="open-emoji-modal"
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
						onEmojiClick={(emojiObject) =>
							handleEmojiSelect(emojiObject.emoji)
						}
						width="100%"
						height="auto"
					/>
				</IonContent>
			</IonModal>
		</IonContent>
	);
};
