import React from 'react';
import { TagEntry } from '../..//utils/customTypes';
import cx from 'classnames';

import './DayTags.css';

interface DayTagsProps {
	tags?: TagEntry;
	visible?: boolean;
}

export const DayTags: React.FC<DayTagsProps> = ({ tags, visible = true }) => {
	// hiding and showing daytags this way is needed to prevent an emoji display
	// bug on Safari where they don't *fully* disappear
	const classnames = cx('dayTags__container', {
		'dayTags__container--hidden': !visible,
	});

	return (
		<div className={classnames}>
			{tags?.map((tag, idx) => (
				<span className="dayTags__tag" key={idx}>
					{tag}
				</span>
			))}
		</div>
	);
};
