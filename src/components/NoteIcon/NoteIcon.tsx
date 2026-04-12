import React from 'react';

interface NoteIconProps {
	className?: string;
	width?: number;
	height?: number;
}

export const NoteIcon: React.FC<NoteIconProps> = ({
	className,
	width = 10,
	height = 12,
}) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width={width}
		height={height}
		fill="none"
		className={className}
		aria-hidden="true"
	>
		<path stroke="currentColor" d="M.5.5h9v8.293L6.793 11.5H.5V.5Z" />
		<path stroke="currentColor" d="M6.5 8.5h3v.766L6.819 11.5H6.5v-3ZM3 3.5h4M3 5.5h4" />
	</svg>
);
