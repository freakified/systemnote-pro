import React from 'react';
import { TagEntry } from '../utils/customTypes';

import './DayTags.css';

interface DayTagsProps {
	tags?: TagEntry;
}

const DayTags: React.FC<DayTagsProps> = ({ tags }) => {
	return (
		<div className="dayTags__container">
			{tags?.map((tag, idx) => (
				<span className="dayTags__tag" key={idx}>
					{tag}
				</span>
			))}
		</div>
	);
};

export default DayTags;
