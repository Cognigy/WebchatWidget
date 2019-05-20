import * as React from 'react';
import { styled } from '../../style';
import { interactionCss } from '../../utils/css';

interface ILogoProps {
    src: string;
}

export default styled.div<ILogoProps>(({ src }) => ({
    ...interactionCss,
    backgroundImage: `url('${src}')`,
    backgroundSize: 'contain',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center center'
}));