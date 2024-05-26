import React from 'react';
import { styled } from "../../style";
import IconButton from "./IconButton";


const FABDisabled = styled(IconButton)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: 56,
    height: 56,
    backgroundColor: theme.greyColor,
    color: theme.greyContrastColor,
    fill: theme.greyContrastColor,
    overflow: 'visible',
    boxShadow: theme.shadow,
    borderRadius: '50%',
    marginTop: theme.unitSize * 2,
    '& img': {
        width: '100%',
        height: '100%',
        borderRadius: '50%',
    },
}));


export default FABDisabled;