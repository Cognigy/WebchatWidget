import * as React from 'react';
import Toolbar from './Toolbar';
import Logo from './Logo';
import { styled } from '../../style';
import IconButton from './IconButton';
import CloseIcon from '../../assets/baseline-close-24px.svg';
import MenuIcon from '../../assets/Hamburger_icon.svg';
import { MenuItem, Menu } from '@material-ui/core';


// icon source: https://de.wikipedia.org/wiki/Datei:Hamburger_icon.svg

const HeaderBar = styled(Toolbar)(({ theme }) => ({
    boxShadow: '0 5px 18px 0 rgba(0, 0, 0, 0.08), 0 5px 32px 0 rgba(0, 0, 0, 0.08), 0 8px 58px 0 rgba(0, 0, 0, 0.08)',
    zIndex: 2,
    minHeight: 'auto',
    height: theme.unitSize * 7,
    flexBasis: theme.unitSize * 7,
    fontSize: 16,
    fontWeight: 700
}))

const HeaderIconButton = styled(IconButton)(({ theme }) => ({
    color: theme.primaryContrastColor,
    fill: theme.primaryContrastColor,
    // stroke: theme.primaryContrastColor
}));

interface HeaderProps {
    title: string;
    connected: boolean;
    logoUrl?: string;
    onClose: () => void;
}

export default ({ logoUrl, connected, title, onClose, ...props }: HeaderProps) => {
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClickMenu = (event) => {
        if (anchorEl === null) {
            setAnchorEl(event.currentTarget)
        } else {
            setAnchorEl(null)
        }
      };

    const handleOpenLink = (url: string, event) => {
        window.open('https://www.cognigy.com/legal-notice', "_blank");
        handleClickMenu(event);
    }
    
    return (
    <HeaderBar color='primary' {...props} className="webchat-header-bar">
        {logoUrl && <Logo src={logoUrl} className="webchat-header-logo" />}
        <span style={{ flexGrow: 1 }} className="webchat-header-title">{title}</span>

        <HeaderIconButton
            data-header-close-button
            onClick={handleClickMenu}
            className="webchat-header-close-button"
        >
            <MenuIcon />
        </HeaderIconButton>
        <Menu
        style={{
            zIndex: 9999
        }}
        id="long-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClickMenu}
      >
        <MenuItem onClick={e => handleOpenLink('https://www.cognigy.com/legal-notice', e)}>GDPR</MenuItem>
        <MenuItem onClick={e => handleOpenLink('https://www.cognigy.com/', e)}>Home Page</MenuItem>
      </Menu>

      <HeaderIconButton
            data-header-close-button
            onClick={onClose}
            className="webchat-header-close-button"
        >
            <CloseIcon />
        </HeaderIconButton>
    </HeaderBar>
)};