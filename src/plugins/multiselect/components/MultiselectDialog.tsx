import React, { FC, useState, useMemo } from 'react';
import { MessageComponentProps } from '../../../common/interfaces/message-plugin';
import Header from '../../../webchat-ui/components/presentational/Header';
import ToolbarPrimaryButton from '../../../webchat-ui/components/presentational/ToolbarPrimaryButton';
import ToolbarSecondaryButton from '../../../webchat-ui/components/presentational/ToolbarSecondaryButton';
import { IBotMessage } from '../../../common/interfaces/message';
import Select, { Option, SelectProps } from 'rc-select';
import { styled, IWebchatTheme } from '../../../webchat-ui/style';
import { getMessengerQuickReply } from '../../messenger/MessengerPreview/components/MessengerQuickReply';
import CloseIcon from '../../../webchat-ui/assets/baseline-close-24px.svg';
import SendIcon from '../../../webchat-ui/assets/baseline-send-24px.svg';

import { IMultiselectProps } from '../Multiselect';




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
        alignItems: 'center',
    },
    '& .rc-select-item-option-active': {
        backgroundColor: 'hsla(0, 0%, 0%, .12)'
    }
}));

const DialogRoot = styled.form(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
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
}))

const Footer = styled(Padding)(({ theme }) => ({
    backgroundColor: 'white',
    boxShadow: theme.shadow,
}));

const FooterButtons = styled.div(({ theme }) => ({
    display: 'flex',
    marginTop: theme.unitSize
}));

const Row = styled.div(({ theme }) => ({
    display: 'block',
}));
const HeaderButton = styled.button(({ theme }) => ({
    alignItems: 'center',
    background: 'transparent',
    border: 'none',
    color: theme.primaryContrastColor,
    cursor: 'pointer',
    display: 'flex',
    fontWeight: 'bolder',
    justifyContent: 'space-between',
}));

const SubmitButton = styled(HeaderButton)(({ theme }) => ({
    flexGrow: 1,
    justifyContent: 'flex-end',
}))

const SubmitButtonIcon = styled(SendIcon)(({ theme }) => ({
    fill: theme.primaryContrastColor,
    marginLeft: theme.unitSize * 1.5,
}))

const Title = styled.div(({ theme }) => ({
    color: theme.primaryContrastColor,
    flexGrow: 1,
    marginTop: theme.unitSize * 2,
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
        if (!isDropdownOpen)
            return null;

        return (
            <Dropdown>
                {menu}
            </Dropdown>
        );
    };

    const getPopupContainer: SelectProps['getPopupContainer'] = () => document.querySelector('[data-cognigy-webchat-root]') as HTMLElement;

    const renderTag: SelectProps['tagRender'] = props => {
        const { closable, disabled, label, onClose, value } = props;

        return (
            <Tag key={value} type='button' onClick={onClose}>
                <span>{label}</span>
                <CloseIcon style={{ height: '1em' }} />
            </Tag>
        )
    }

    const handleSubmit = e => {
        e.preventDefault();
        e.stopPropagation();

        props.onSendMessage('', {
            multiselect: value
        });
    }

    return (
        <DialogRoot {...props.attributes} onSubmit={handleSubmit}>
            <Header>
                <Row>
                <HeaderButton type='button' onClick={props.onDismissFullscreen}>
                        {cancelButtonLabel}
                </HeaderButton>
                    <SubmitButton type='submit'>
                        {submitButtonLabel}
                        <SubmitButtonIcon />
                    </SubmitButton>
                    </Row>
                    <Row>
                    </Row>

                <Title>text</Title>

            </Header>
            <Content>
            </Content>
            <Footer>
                <div>
                    <Select
                        autoFocus
                        dropdownClassName='multiselect-dropdown'
                        dropdownRender={renderDropdown}
                        getPopupContainer={getPopupContainer}
                        mode='tags'
                        tagRender={renderTag}
                        tags
                        onDropdownVisibleChange={setIsDropdownOpen}
                        value={value}
                        onChange={setValue}
                    >
                        {options.map(option => (
                            <Option value={option}>
                                {option}
                            </Option>
                        ))}
                    </Select>
                </div>
                <FooterButtons>
                </FooterButtons>
            </Footer>
        </DialogRoot>
    )
}

export default MultiselectDialog;