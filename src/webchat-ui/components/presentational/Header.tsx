import * as React from 'react';
import Toolbar from './Toolbar';
import Logo from './Logo';
import { styled } from '../../style';
import IconButton from './IconButton';
import CloseIcon from '../../assets/baseline-close-24px.svg';

const HeaderBar = styled(Toolbar)(({ theme }) => ({
    boxShadow: '0 5px 18px 0 rgba(0, 0, 0, 0.08), 0 5px 32px 0 rgba(0, 0, 0, 0.08), 0 8px 58px 0 rgba(0, 0, 0, 0.08)',
    zIndex: 2,
    minHeight: 'auto',
    height: theme.unitSize * 7,
    flexBasis: theme.unitSize * 7,
    fontSize: 16,
    fontWeight: 700
}))

interface HeaderProps {
    title: string;
    connected: boolean;
    logoUrl?: string;
    onClose: () => void;
}

export default ({ logoUrl, connected, title, onClose, ...props }: HeaderProps) => (
    <HeaderBar color='primary' {...props}>
        {logoUrl && <Logo src={logoUrl} />}
        <span style={{ flexGrow: 1 }}>{title}</span>
        <IconButton
            data-cognigy-webchat-header-close-button
            onClick={onClose}
        >
            <CloseIcon />
        </IconButton>
    </HeaderBar>
);