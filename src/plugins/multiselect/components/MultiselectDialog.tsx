import React, { FC, useState, useEffect } from 'react';
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
    boxShadow: '0 5px 18px 0 rgba(0, 0, 0, 0.08), 0 5px 32px 0 rgba(0, 0, 0, 0.08), 0 8px 58px 0 rgba(0, 0, 0, 0.08)',
    boxSizing: 'border-box',
    fontSize: 16,
    fontWeight: 700,
    paddingLeft: theme.unitSize,
    paddingRight: theme.unitSize,
    paddingTop: theme.unitSize,
    // paddingBottom: theme.unitSize,
    width: '100%',
    zIndex: 2,

    '&>*': {
        margin: theme.unitSize
    }
}));

const HeaderRow = styled.div(() => ({
    display: 'flex',
    justifyContent: 'space-between',
    // marginBottom: 0,
}));

const ContentRow = styled.div(() => ({
    display: 'flex',
    flexDirection: 'column',
    marginTop: 'auto',
}));

const HeaderAction = styled.button(({ theme }) => ({
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
    width: '100%'
});

const DialogRoot = styled.form(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    margin: 0,
    overflow: 'hidden'
}));

const Padding = styled.div(({ theme }) => ({
    paddingTop: theme.unitSize,
    paddingBottom: theme.unitSize,
    paddingLeft: theme.unitSize * 2,
    paddingRight: theme.unitSize * 2
}));

const Content = styled('div')(({ theme }) => ({
    display: 'flex',
    flexGrow: 1,
    flexDirection: 'column',
    overflowY: 'auto',
    paddingBottom: theme.unitSize,
    paddingLeft: theme.unitSize * 2,
    paddingRight: theme.unitSize * 2,
}));

const Footer = styled.div(({ theme }) => ({
    backgroundColor: 'white',
    boxShadow: theme.shadow,
    borderBottom: '2px solid #0000'
}));

const FooterButtons = styled.div(({ theme }) => ({
    display: 'flex',
    marginTop: theme.unitSize
}));

const Tag = styled.button(({ theme }) => ({
    alignItems: 'center',
    backgroundColor: 'transparent',
    border: 'none',
    color: theme.greyContrastColor,
    cursor: 'pointer',
    display: 'inline-flex',
    paddingTop: theme.unitSize,
    paddingBottom: theme.unitSize,
    paddingLeft: theme.unitSize * 2,
    paddingRight: theme.unitSize * 2,
    marginLeft: -theme.unitSize * 2,
    marginRight: -theme.unitSize * 2,

    '&:hover, &:focus': {
        backgroundColor: theme.greyWeakColor
    },
}));

const SelectedOptionsContainer = styled('div')(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
}));

const SelectedTag = styled(Tag)(({ theme }) => ({
    color: 'inherit',

    '&:hover, &:focus': {
        backgroundColor: theme.greyWeakColor,
        color: theme.greyContrastColor
    },
}));

const MultiselectDialog: FC<IMultiselectProps> = props => {
    const { text } = props.message;
    const {
        options,
        submitButtonLabel,
        cancelButtonLabel
    } = props.message.data._plugin;

    const [inputValue, setInputValue] = useState<string>('');

    const [selected, setSelected] = useState<string[]>([]);

    useEffect(() => {
        console.log(selected);
    }, [selected]);

    const handleOptionClick = event => {
        event.preventDefault();
        const value = event.target.textContent;

        if (selected.includes(value)) {
            setSelected(selected => [
                ...selected.filter(option => option !== value)
            ]);
            return;
        }

        setSelected(selected => [...selected, value]);
    };

    const handleSubmit = e => {
        e.preventDefault();
        e.stopPropagation();

        props.onSendMessage('', {
            multiselect: selected
        });
    };

    const SelectedOptions = () => (
        <SelectedOptionsContainer>
            {selected.map(selectedOption => (
                <SelectedTag
                    onClick={handleOptionClick}
                    key={options.indexOf(selectedOption)}
                >
                    {selectedOption}
                </SelectedTag>
            ))}
        </SelectedOptionsContainer>
    );

    const FilteredOptions = () => (
        <ContentRow>
            {options
                .filter(option => {
                    if (selected.includes(option)) return false;
                    if (!inputValue) return true;
                    return option
                        .toLocaleLowerCase()
                        .includes(inputValue.toLocaleLowerCase());
                })
                .map(option => (
                    <Tag
                        onClick={handleOptionClick}
                        key={options.indexOf(option)}
                        tabIndex={0}
                    >
                        {option}
                    </Tag>
                ))}
        </ContentRow>
    );

    return (
        <DialogRoot {...props.attributes} onSubmit={handleSubmit}>
            <Header>
                <HeaderRow>
                    <HeaderAction
                        type="button"
                        onClick={props.onDismissFullscreen}
                    >
                        {cancelButtonLabel}
                    </HeaderAction>
                    <HeaderAction type="submit">
                        {submitButtonLabel}
                        <SubmitButtonIcon />
                    </HeaderAction>
                </HeaderRow>
                <HeaderRow>
                    <Title>{text}</Title>
                </HeaderRow>
                <HeaderRow>
                    <SelectedOptions />
                </HeaderRow>
            </Header>
            <Content>
                <FilteredOptions />
            </Content>
            <Footer>
                <TextInput
                    autoFocus={true}
                    onChange={event => setInputValue(event.target.value)}
                    placeholder="Select an option or enter your own"
                    className="webchat-multiselect-input"
                    tabIndex={-1}
                />
            </Footer>
        </DialogRoot>
    );
};

export default MultiselectDialog;
