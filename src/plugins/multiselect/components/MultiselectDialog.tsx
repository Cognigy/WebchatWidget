import React, {
    FC,
    useState,
    useEffect,
    useRef,
    MutableRefObject,
    ButtonHTMLAttributes
} from 'react';
import tinycolor from 'tinycolor2';

import { Input } from '../../../webchat-ui/components/plugins/input/text/TextInput';
import Background from '../../../webchat-ui/components/presentational/Background';
import { styled, IWebchatTheme } from '../../../webchat-ui/style';

import CloseIcon from '../../../webchat-ui/assets/baseline-close-24px.svg';
import SendIcon from '../../../webchat-ui/assets/baseline-send-24px.svg';

import { IMultiselectProps } from '../Multiselect';

function mod(n, m) {
    return ((n % m) + m) % m;
}

const Header = styled(Background)(({ theme }) => ({
    boxShadow:
        '0 5px 18px 0 rgba(0, 0, 0, 0.08), 0 5px 32px 0 rgba(0, 0, 0, 0.08), 0 8px 58px 0 rgba(0, 0, 0, 0.08)',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    fontSize: 16,
    fontWeight: 700,
    maxHeight: '50%',
    width: '100%',
    zIndex: 2
}));

const HeaderRow = styled.div(({ theme }) => ({
    display: 'flex',
    justifyContent: 'space-between',
    margin: theme.unitSize,
    padding: theme.unitSize
}));

const OptionsList = styled.div(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    marginTop: 'auto'
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
    marginTop: -theme.unitSize
}));

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

const Content = styled('div')(({ theme }) => ({
    display: 'flex',
    flexGrow: 1,
    flexDirection: 'column',
    overflowY: 'auto',
    overflowX: 'hidden',
    paddingBottom: theme.unitSize,
    paddingTop: theme.unitSize
}));

const Footer = styled.div(({ theme }) => ({
    backgroundColor: 'white',
    boxShadow: theme.shadow,
    borderBottom: '2px solid #0000'
}));

const Option = styled.button(({ theme }) => ({
    backgroundColor: 'transparent',
    border: 'none',
    color: theme.greyContrastColor,
    cursor: 'pointer',
    paddingTop: theme.unitSize,
    paddingBottom: theme.unitSize,
    paddingLeft: theme.unitSize * 2,
    paddingRight: theme.unitSize * 2,
    textAlign: 'left',
    userSelect: 'none',

    '&:hover, &:focus': {
        backgroundColor: theme.greyWeakColor,
        outline: 'none'
    }
}));

const ChosenOptions = styled('div')(({ theme }) => ({
    display: 'flex',
    flexGrow: 1,
    flexDirection: 'column',
    flexWrap: 'wrap',
    overflowX: 'auto',
    paddingLeft: theme.unitSize * 2,
    paddingRight: theme.unitSize * 2,
    scrollbarWidth: 'thin',
    '&::-webkit-scrollbar': {
        backgroundColor: tinycolor(theme.primaryColor)
            .lighten(20)
            .toHex8String(),
        height: '8px'
    },
    '&::-webkit-scrollbar-thumb': {
        backgroundColor: tinycolor(theme.primaryColor)
            .darken(5)
            .toHex8String()
    }
}));

const ChosenOption = styled(Option)(({ theme }) => ({
    alignItems: 'center',
    color: 'inherit',
    display: 'flex',
    fontSize: theme.unitSize * 1.75,
    // marginBottom: theme.unitSize * 0.5,
    // marginRight: theme.unitSize * 1.5,
    padding: 0,
    width: '50%',

    '&:focus': {
        backgroundColor: tinycolor(theme.primaryColor)
        .darken(20)
        .toHex8String(),
        
    },

    '&:hover': {
        backgroundColor: 'transparent'
    }
}));

const SelectedOptionCloseIcon = styled(CloseIcon)(({ theme }) => ({
    borderRadius: 100,
    fill: tinycolor(theme.greyColor)
        .setAlpha(0.25)
        .toHex8String(),
    marginRight: theme.unitSize * 0.5,
    paddingLeft: theme.unitSize * 0.5,
    paddingRight: theme.unitSize * 0.5,
    width: theme.unitSize * 2,
    '&:hover': {
        backgroundColor: tinycolor(theme.greyWeakColor)
            .darken(25)
            .setAlpha(0.75)
            .toHex8String()
    }
}));

const MultiselectDialog: FC<IMultiselectProps> = props => {
    const { text } = props.message;
    const {
        options,
        submitButtonLabel,
        cancelButtonLabel,
        allowUserOptions
    } = props.message.data._plugin;

    const [inputValue, setInputValue] = useState<string>('');

    const [filteredOptions, setFilteredOptions] = useState<string[]>([]);

    const [chosenOptions, setChosenOptions] = useState<string[]>([]);

    const [selectedIndex, setSelectedIndex] = useState(filteredOptions.length);

    /*
     ** Filter the options
     */
    useEffect(() => {
        let filtered = options.filter(option => {
            /*
             ** Hide already selected options
             */
            if (chosenOptions.includes(option)) return false;

            /*
             ** If no filter include option
             */
            if (!inputValue) return true;

            /*
             ** Otherwise test if option includes filter
             */
            return option.toLocaleLowerCase().includes(inputValue.toLocaleLowerCase());
        });

        /*
         ** Add input filter value to the list of options
         */
        if (inputValue && allowUserOptions) filtered.push(inputValue);

        setFilteredOptions(filtered);
    }, [inputValue, chosenOptions]);

    /*
     ** Keyboard navigation on options list
     */
    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown);
        setSelectedIndex(filteredOptions.length);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [filteredOptions]);

    useEffect(() => {
        console.log(selectedIndex);
        optionInFocus.current?.focus();
    }, [selectedIndex]);

    const optionInFocus = useRef<HTMLButtonElement>(null);

    const textInput = useRef<HTMLInputElement>(null);

    const handleKeyDown = event => {
        const { keyCode } = event;
        if ([38, 40, 27].includes(keyCode)) event.preventDefault();
        if (keyCode === 38) setSelectedIndex(index => mod(index - 1, filteredOptions.length)); // Arrow UP
        if (keyCode === 40) setSelectedIndex(index => mod(index + 1, filteredOptions.length)); // Arrow Down
        if (keyCode === 27) setSelectedIndex(filteredOptions.length); // Escape
    };

    const handleOptionClick = (event, value) => {
        event.preventDefault();

        if (chosenOptions.includes(value)) {
            setChosenOptions(selected => [...selected.filter(option => option !== value)]);
            return;
        }

        setChosenOptions(selected => [...selected, value]);
        if (textInput.current) textInput.current.focus();
    };

    const handleSubmit = e => {
        e.preventDefault();
        e.stopPropagation();

        props.onSendMessage('', {
            multiselect: chosenOptions
        });
    };

    return (
        <DialogRoot {...props.attributes} onSubmit={handleSubmit}>
            <Header color="primary" className="webchat-header-bar">
                <HeaderRow>
                    <HeaderAction type="button" onClick={props.onDismissFullscreen}>
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
                <ChosenOptions>
                    {chosenOptions.map(option => (
                        <ChosenOption
                            key={option}
                            onClick={event => handleOptionClick(event, option)}
                            tabIndex={1}
                        >
                            <SelectedOptionCloseIcon />
                            {option}
                        </ChosenOption>
                    ))}
                </ChosenOptions>
            </Header>
            <Content>
                <OptionsList>
                    {filteredOptions.map((option, index) => (
                        <Option
                            ref={index === selectedIndex ? optionInFocus : null}
                            onClick={event => handleOptionClick(event, option)}
                            key={option}
                            tabIndex={0}
                        >
                            {option}
                        </Option>
                    ))}
                </OptionsList>
            </Content>
            <Footer>
                <TextInput
                    autoFocus={true}
                    className="webchat-multiselect-input"
                    onChange={event => setInputValue(event.target.value)}
                    onKeyDown={event =>
                        event.keyCode === 13 ? handleOptionClick(event, inputValue) : null
                    }
                    placeholder="Select an option or enter your own"
                    ref={textInput}
                    tabIndex={2}
                />
            </Footer>
        </DialogRoot>
    );
};

export default MultiselectDialog;
