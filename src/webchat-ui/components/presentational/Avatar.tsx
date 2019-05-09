import React from 'react';
import { styled } from '../../style';
import { CSSProperties } from 'react';

interface IAvatarProps {
	src: string;
}

export default styled.div<IAvatarProps>(({ theme, src }) => ({
	borderRadius: 20,
    height: theme.unitSize * 3,
    width: theme.unitSize * 3,
	border: `1px solid ${theme.greyWeakColor}`,
	backgroundImage: `url('${src}')`,
	backgroundSize: "contain",
	backgroundPosition: "center center",
	backgroundRepeat: "no-repeat"
}));