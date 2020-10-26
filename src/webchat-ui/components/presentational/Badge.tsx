import React from 'react';

interface IBadgeProps {
    content: number;
    backgroundColor: string;
    fontColor: string;
}

const Badge = (props: IBadgeProps) => {

    const { content, backgroundColor, fontColor } = props;

    const size = 24;

    if (content === 0)
        return null;

    return (
            <span style={{
                display: 'flex',
                flexDirection: 'row',
                flexWrap: 'wrap',
                justifyContent: 'center',
                alignContent: 'center',
                alignItems: 'center',
                position: 'absolute',
                top: '-10%',
                right: '-5%',
                fontSize: size / 2,
                width: size,
                height: size,
                borderRadius: '50%',
                backgroundColor: backgroundColor,
                color: fontColor,
                fontFamily: 'sans-serif'
            }}>
                {content}
            </span>
    );
}

export default Badge;