import React, { useState } from 'react';
import { IonButton, IonContent, IonIcon, IonModal } from '@ionic/react';
import './MonthNoteView.css';
import { getFullMonthName, getNumericYearString, getShortMonthNumberString } from '../../utils/dateUtils';
import EmojiPicker, { EmojiStyle, Theme } from 'emoji-picker-react';
import { useSettings } from '../SettingsProvider/SettingsProvider';
import { TagEntry } from '../../utils/customTypes';
import { happyOutline, trashOutline } from 'ionicons/icons';
import enEmojiData from 'emoji-picker-react/dist/data/emojis-en';
import jaEmojiData from 'emoji-picker-react/dist/data/emojis-ja';

interface MonthNoteViewProps {
	date: Date;
	note?: string;
	tags?: TagEntry;
	onTextAreaChange?: React.ChangeEventHandler<HTMLTextAreaElement>;
	onTagsChange?: (newTags: TagEntry) => void;
}

export const MonthNoteView: React.FC<MonthNoteViewProps> = ({
	date,
	note = '',
	tags = [],
	onTextAreaChange,
	onTagsChange,
}) => {
	const [activeTagSelectionIdx, setActiveTagSelectionIdx] = useState<number | null>(null);

	const { settings } = useSettings();
	const emojiData = settings?.appLanguage === 'ja' ? jaEmojiData : enEmojiData;

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
		<div className="monthNoteView-root">
			<div className="monthNoteView-toolbar">
				<div className="monthNoteView-monthNumber">
					{getShortMonthNumberString(date)}
				</div>
				<div className="monthNoteView-monthAndYear">
					<div>{getNumericYearString(date)}</div>
					<div>{getFullMonthName(date)}</div>
				</div>
				<div className="monthNoteView-emojiToolbar">
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
			<IonContent class="monthNoteView-note">
				<textarea
					onChange={(e) => onTextAreaChange?.(e)}
					className="monthNoteView-note-textarea"
					value={note}
				/>
			</IonContent>
			<IonModal
				isOpen={activeTagSelectionIdx !== null}
				onDidDismiss={() => setActiveTagSelectionIdx(null)}
				initialBreakpoint={0.5}
				breakpoints={[0, 0.5, 1]}
			>
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
					emojiData={emojiData}
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
							: 'dayView-emojiPicker'
					}
				/>
			</IonModal>
		</div>
	);
};
