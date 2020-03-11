import React, { FC, useState, useMemo } from 'react';
import tinycolor from 'tinycolor2';

import { MessageComponentProps } from '../../../common/interfaces/message-plugin';

import { Input } from '../../../webchat-ui/components/plugins/input/text/TextInput';

import Background from '../../../webchat-ui/components/presentational/Background';

import { IBotMessage } from '../../../common/interfaces/message';
import Select, { Option, SelectProps } from 'rc-select';
import { styled, IWebchatTheme } from '../../../webchat-ui/style';
import { getMessengerQuickReply } from '../../messenger/MessengerPreview/components/MessengerQuickReply';
import CloseIcon from '../../../webchat-ui/assets/baseline-close-24px.svg';
import SendIcon from '../../../webchat-ui/assets/baseline-send-24px.svg';

import { IMultiselectProps } from '../Multiselect';

const ActionableHeaderBar = styled(Background)(({ theme }) => ({
    boxShadow:
        '0 5px 18px 0 rgba(0, 0, 0, 0.08), 0 5px 32px 0 rgba(0, 0, 0, 0.08), 0 8px 58px 0 rgba(0, 0, 0, 0.08)',
    boxSizing: 'border-box',
    fontSize: 16,
    fontWeight: 700,
    paddingLeft: theme.unitSize,
    paddingRight: theme.unitSize,
    paddingTop: theme.unitSize,
    paddingBottom: theme.unitSize,
    width: '100%',
    zIndex: 2,

    '&>*': {
        margin: theme.unitSize
    }
}));

const Row = styled.div(() => ({
    display: 'flex',
    justifyContent: 'space-between'
}));

const HeaderButton = styled.button(({ theme }) => ({
    alignItems: 'center',
    background: 'transparent',
    border: 'none',
    color: theme.primaryContrastColor,
    cursor: 'pointer',
    display: 'flex',
    fontWeight: 'normal',
    justifyContent: 'space-between',
    paddingLeft: 0,
    paddingRight: 0,
    '&:hover': {
        color: tinycolor(theme.primaryContrastColor)
            .setAlpha(1)
            .toHex8String()
    }
}));

const SubmitButtonIcon = styled(SendIcon)(({ theme }) => ({
    fill: theme.primaryContrastColor,
    height: '19px',
    marginLeft: theme.unitSize * 1.5,
    width: '19px'
}));

const Title = styled.div(({ theme }) => ({
    color: theme.primaryContrastColor,
    fontSize: theme.unitSize * 2.5,
    marginTop: theme.unitSize * 6
}));

const Header = ({ children }) => (
    <ActionableHeaderBar color="primary" className="webchat-header-bar">
        {children}
    </ActionableHeaderBar>
);

const TextInput = styled(Input)({
    width: '100%',
})

const Dropdown = styled.div(({ theme }) => ({
    boxShadow: theme.shadow,
    borderRadius: theme.unitSize,
    backgroundColor: 'white',
    overflow: 'hidden',

    '& .rc-select-item': {
        padding: theme.unitSize
    },
    '& .rc-select-item-option': {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    '& .rc-select-item-option-active': {
        backgroundColor: 'hsla(0, 0%, 0%, .12)'
    }
}));

const DialogRoot = styled.form(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    margin: 0
}));

const Padding = styled.div(({ theme }) => ({
    paddingTop: theme.unitSize,
    paddingBottom: theme.unitSize,
    paddingLeft: theme.unitSize * 2,
    paddingRight: theme.unitSize * 2
}));

const Content = styled(Padding)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'center',
    flexGrow: 1
}));

const Footer = styled.div(({ theme }) => ({
    backgroundColor: 'white',
    boxShadow: theme.shadow,
    borderBottom: '2px solid #0000',
}));

const FooterButtons = styled.div(({ theme }) => ({
    display: 'flex',
    marginTop: theme.unitSize
}));

const Tag = styled.button(({ theme }) => ({
    display: 'inline-flex',
    alignItems: 'center',

    padding: '.2em .5em',

    backgroundColor: theme.greyColor,
    color: theme.greyContrastColor,

    border: 'none',
    borderRadius: theme.unitSize,

    cursor: 'pointer',

    '&:hover': {
        backgroundColor: theme.greyWeakColor
    }
}));

const MessengerQuickReply = getMessengerQuickReply({ React, styled });

const MultiselectDialog: FC<IMultiselectProps> = props => {
    const { text } = props.message;
    const { options, submitButtonLabel, cancelButtonLabel } = props.message.data._plugin;
    const [value, setValue] = useState([]);

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const renderDropdown: SelectProps['dropdownRender'] = menu => {
        if (!isDropdownOpen) return null;

        return <Dropdown>{menu}</Dropdown>;
    };

    const getPopupContainer: SelectProps['getPopupContainer'] = () =>
        document.querySelector('[data-cognigy-webchat-root]') as HTMLElement;

    const renderTag: SelectProps['tagRender'] = props => {
        const { closable, disabled, label, onClose, value } = props;

        return (
            <Tag key={value} type="button" onClick={onClose}>
                <span>{label}</span>
                <CloseIcon style={{ height: '1em' }} />
            </Tag>
        );
    };

    const handleSubmit = e => {
        e.preventDefault();
        e.stopPropagation();

        props.onSendMessage('', {
            multiselect: value
        });
    };

    return (
        <DialogRoot {...props.attributes} onSubmit={handleSubmit}>
            <Header>
                <Row>
                    <HeaderButton type="button" onClick={props.onDismissFullscreen}>
                        {cancelButtonLabel}
                    </HeaderButton>
                    <HeaderButton type="submit">
                        {submitButtonLabel}
                        <SubmitButtonIcon />
                    </HeaderButton>
                </Row>
                <Row>
                    <Title>{text}</Title>
                </Row>
            </Header>
            <Content></Content>
            <Footer>
                <TextInput
                    autoFocus={true}
                    // onChange={this.handleChangeState}
                    // onFocus={() => this.setState({ active: true })}
                    // onBlur={() => this.setState({ active: false })}
                    placeholder="Select an option or enter your own"
                    className="webchat-input-message-input"
                />
            </Footer>
        </DialogRoot>
    );
};

export default MultiselectDialog;
