import React, { useRef, useState } from 'react';
import {
	IonButton,
	IonContent,
	IonIcon,
	IonModal,
	IonToolbar,
	IonHeader,
	IonTitle,
	IonButtons,
} from '@ionic/react';
import './DayView.css';
import {
	getNumericDayString,
	getWeekdayNameShort,
} from '../../utils/dateUtils';
import TextareaAutosize from 'react-textarea-autosize';
import EmojiPicker, { EmojiStyle, Theme } from 'emoji-picker-react';

import { TagEntry } from '../../utils/customTypes';
import { add, happyOutline } from 'ionicons/icons';

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
						size="small"
						fill="outline"
					>
						Emoji
						<IonIcon
							slot="start"
							size="medium"
							icon={add}
						></IonIcon>
					</IonButton>
					{/* <IonButton
						id="open-emoji-modal"
						size="default"
						// fill="outline"
					>
						<IonIcon
							slot="start"
							size="medium"
							icon={happyOutline}
						></IonIcon>
					</IonButton> */}
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
				breakpoints={[0, 0.5, 0.9]}
			>
				{/* <IonHeader>
					<IonHeader translucent={true}>
						<IonToolbar>
							<IonButtons slot="secondary">
								<IonButton
									onClick={() => modal.current?.dismiss()}
								>
									Cancel
								</IonButton>
							</IonButtons>
							<IonTitle>Select Emoji</IonTitle>
						</IonToolbar>
					</IonHeader>
				</IonHeader> */}
				<IonContent className="dayView-emojiModal">
					<EmojiPicker
						autoFocusSearch={false}
						skinTonesDisabled={true}
						emojiStyle={EmojiStyle.NATIVE}
						lazyLoadEmojis={false}
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
