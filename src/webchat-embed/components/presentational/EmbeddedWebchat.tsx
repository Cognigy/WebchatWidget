import * as React from 'react';
import styled from '@emotion/styled';
import { Webchat } from '../../../webchat';

const mqLargerThanPhone = '@media (min-width: 576px)'

const EmbeddedWebchat = styled(Webchat)({
    // position: 'fixed',
    // zIndex: 9999,

    // left: 0,
    // top: 0,

    // width: '100%',
    // height: '100%',

    // overflow: 'hidden',

    // '[data-cognigy-webchat-toggle]': {
    //     display: 'none'
    // },

    // [mqLargerThanPhone]: {
    //     left: 'auto',
    //     top: 'auto',
    //     bottom: 64,
    //     right: 64,

    //     overflow: 'initial',
    //     width: 'initial',
    //     height: 'initial',

    //     '[data-cognigy-webchat]': {
    //         width: 380,
    //         height: 580,
    //         borderRadius: 16,
    //         boxShadow: '0 5px 18px 0 rgba(151, 124, 156, 0.2), 0 5px 32px 0 rgba(203, 195, 212, 0.2), 0 8px 58px 0 rgba(216, 212, 221, 0.1)',
    //     },



    //     '[data-header-close-button]': {
    //         display: 'none'
    //     }
    //     // boxShadow: '0px 2px 5px hsla(0, 0%, 0%, .35)',
    // }
});

export default EmbeddedWebchat;