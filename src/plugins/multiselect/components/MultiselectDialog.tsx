import React, { FC, useState, useMemo, useRef } from 'react';
import { MessageComponentProps } from '../../../common/interfaces/message-plugin';
import Header from '../../../webchat-ui/components/presentational/Header';
import ToolbarPrimaryButton from '../../../webchat-ui/components/presentational/ToolbarPrimaryButton';
import ToolbarSecondaryButton from '../../../webchat-ui/components/presentational/ToolbarSecondaryButton';
import { IBotMessage } from '../../../common/interfaces/message';
import Select, { Option, SelectProps } from 'rc-select';
import { styled, IWebchatTheme } from '../../../webchat-ui/style';
import { getMessengerQuickReply } from '../../messenger/MessengerPreview/components/MessengerQuickReply';
import { Global } from '@emotion/core';
import CloseIcon from '../../../webchat-ui/assets/baseline-close-24px.svg';



interface IMultiselectMessage extends IBotMessage {
    data: {
        _plugin: {
            type: 'multiselect',
            options: string[];
        }
    }
}

interface IMultiselectProps extends MessageComponentProps {
    message: IMultiselectMessage;
}

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

const DialogRoot = styled.div(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    flexGrow: 1
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

const SubmitButton = styled(ToolbarPrimaryButton)(({ theme }) => ({
    flexGrow: 1,
    marginLeft: theme.unitSize
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

    // borderColor: theme.primaryColor,
    // borderStyle: 'solid',
    // borderWidth: 1,
}));

const MessengerQuickReply = getMessengerQuickReply({ React, styled });

const MultiselectDialog: FC<IMultiselectProps> = props => {
    const { text } = props.message;
    const { options } = props.message.data._plugin;

    const renderDropdown: SelectProps['dropdownRender'] = menu => (
        <Dropdown>{menu}</Dropdown>
    );

    const getPopupContainer: SelectProps['getPopupContainer'] = () => document.querySelector('[data-cognigy-webchat-root]') as HTMLElement;

    const renderTag: SelectProps['tagRender'] = props => {
        const { closable, disabled, label, onClose, value } = props;

        return (
            <Tag key={value} onClick={onClose}>
                <span>{label}</span>
                <CloseIcon style={{ height: '1em' }} />
            </Tag>
        )
    }

    const styles = useMemo(() => {
        return <Global styles={(theme: IWebchatTheme) => ({
            '.rc-select': {
                color: 'red !important'
            }
        })} />
    }, []);

    return (
        <DialogRoot {...props.attributes}>
            {styles}
            <Header title={text || ''} />
            <Content>


            </Content>
            <Footer>
                <div style={{ lineHeight: 1.5 }}>

                    <Select
                        autoFocus
                        dropdownClassName='multiselect-dropdown'
                        dropdownRender={renderDropdown}
                        getPopupContainer={getPopupContainer}
                        mode='tags'
                        tagRender={renderTag}
                        tags
                    >
                        {options.map(option => <Option value={option}>{option}</Option>)}
                    </Select>
                </div>
                <FooterButtons>
                    <ToolbarSecondaryButton>CANCEL</ToolbarSecondaryButton>
                    <SubmitButton>SUBMIT</SubmitButton>
                </FooterButtons>
            </Footer>
        </DialogRoot>
    )
}

export default MultiselectDialog;