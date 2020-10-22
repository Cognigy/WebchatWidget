import React from 'react';

interface IBadgeProps {
    content: number;
    backgroundColor: string;
    fontColor: string;
}

const Badge = (props: IBadgeProps) => {

    const { content, backgroundColor, fontColor } = props;

    const radius = 12;
    const radius2x = Math.floor(2 * radius);

    if (content !== 0) {
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
                    fontSize: radius,
                    width: radius2x,
                    height: radius2x,
                    borderRadius: '50%',
                    backgroundColor: backgroundColor,
                    color: fontColor,
                    fontFamily: 'sans-serif'
                }}>
                    {content}
                </span>
        );
    } else return null;
    
}

export default Badge;