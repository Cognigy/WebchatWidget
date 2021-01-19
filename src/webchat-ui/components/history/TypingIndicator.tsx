import React, { FC, useEffect, useState } from 'react';
import { useIsMounted } from '../../utils/is-mounted';
import MessageRow from '../presentational/MessageRow';
import TypingIndicatorBubble from '../presentational/TypingIndicatorBubble';

interface ITypingIndicatorProps {
    active: boolean;
}

const TypingIndicator: FC<ITypingIndicatorProps> = (props) => {
    const { active } = props;
    
    const isMounted = useIsMounted();

    /**
     * "isVisible" is a debounced copy of "active", 
     * which will switch to "true" immediately, but only
     * switch to "false" after a certain "debounce time"
     * 
     * Example Timeline: (- is false, + is true)
     * -----+++--++++++---++++------------++++-----
     * would become
     * -----++++++++++++++++++++++--------++++++++-
     */
    const [isVisible, setIsVisible] = useState(() => active);
    useEffect(() => {
        let timeout;

        if (active) {
            setIsVisible(active);
        } else {
            timeout = setTimeout(() => {
                if (isMounted.current) 
                    setIsVisible(false);
            }, 500);
        }

        return () => {
            if (timeout)
                clearTimeout(timeout);
        }
    }, [active]);

    if (!isVisible)
        return null;

    return (
        <MessageRow align='left'>
            <TypingIndicatorBubble />
        </MessageRow>
    );
}

export default TypingIndicator;