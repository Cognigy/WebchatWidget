import * as React from 'react';
import Toolbar from '../../../presentational/Toolbar';
import { styled } from '../../../../style';
import { InputComponentProps } from '../../../../../common/interfaces/input-plugin';
import SendIcon from './baseline-send-24px.svg';
import MenuIcon from './baseline-menu-24px.svg';
import { IPersistentMenuItem } from '../../../../../common/interfaces/webchat-config';


const InputForm = styled.form(({ theme }) => ({
    display: 'flex',
    position: 'relative',
    marginBottom: 0,

    borderBottom: '2px solid transparent',
    borderBottomLeftRadius: theme.unitSize * 2,
    borderBottomRightRadius: theme.unitSize * 2,
    transition: 'border-bottom .2s ease-out',

    '&[data-active=true]': {
        borderBottomColor: theme.primaryColor
    },
}));

const Input = styled.input(({ theme }) => ({
    display: 'block',
    flexGrow: 1,
    alignSelf: 'stretch',
    height: 48,

    border: 'none',
    boxSizing: 'border-box',
    paddingLeft: theme.unitSize * 2,
    paddingRight: theme.unitSize * 2,
    outline: 'none',
    backgroundColor: 'transparent'
}));

const Button = styled.button(({ theme }) => ({
    display: 'block',
    width: theme.unitSize * 5,
    height: theme.unitSize * 5,
    padding: theme.unitSize,
    margin: theme.unitSize / 2,

    backgroundColor: 'transparent',
    border: 'none',
    fill: 'hsla(0, 0%, 0%, .54)',
    cursor: 'pointer',
    outline: 'none',

    '&[disabled]': {
        fill: 'hsla(0, 0%, 0%, .2)',
        cursor: 'default'
    }
}));

const MenuButton = styled(Button)(({ theme }) => ({
    marginLeft: theme.unitSize,
    marginRight: 0,
    alignSelf: 'flex-end',
    borderRadius: '50%',

    '&:hover': {
        fill: theme.primaryColor
    },
    '&:focus': {
        fill: theme.greyContrastColor,
        backgroundColor: theme.greyWeakColor,
        outline: 'none  '
    },
    '&:active': {
        fill: theme.primaryStrongColor,
    }
}));

const SubmitButton = styled(Button)(({ theme }) => ({
    marginRight: theme.unitSize,
    marginLeft: 0,

	"&:focus":{		
		fill: theme.primaryColor,		
	}
}));

const PersistentMenu = styled.div(({ theme }) => ({
    minHeight: 0,
    flexGrow: 1,
    maxHeight: theme.blockSize * 3,
    overflowY: 'auto',
    paddingBottom: theme.unitSize,
    "&:focus": {
        outline: "none",
    }
}));

const PersistentMenuTitle = styled.h5(({ theme }) => ({
    color: 'hsla(0, 0%, 0%, .3)',
    padding: `${theme.unitSize * 2}px ${theme.unitSize * 4}px`,
    margin: 0
}));

const PersistentMenuItem = styled.button(({ theme }) => ({
    display: 'block',
    position: 'relative',
    // width: '100%',
    // border: 'none',
    backgroundColor: 'transparent',
    outline: 'none',
    // margin: 0,
    cursor: 'pointer',
    textAlign: 'left',
    color: 'hsla(0, 0%, 0%, .87)',

    padding: `${theme.unitSize}px ${theme.unitSize * 3}px`,
    margin: theme.unitSize,
    // borderTopLeftRadius: theme.unitSize * 2,
    // borderBottomLeftRadius: theme.unitSize * 2,
    borderRadius: theme.unitSize * 2,
    borderStyle: 'solid',
    borderColor: 'hsla(0, 0%, 0%, .12)',
    borderWidth: 1,

    '&:hover': {
        backgroundColor: 'hsla(0, 0%, 0%, .08)'
    },

    '&:active': {
        backgroundColor: 'hsla(0, 0%, 0%, .12)'
    },
		
    '&:focus': {
        outline: 'none',
        boxShadow: `0 0 3px 1px ${theme.primaryWeakColor}`,
    }
}));

export interface TextInputState {   
    text: string;
    mode: 'text' | 'menu';
    active: boolean;
}

export class TextInput extends React.PureComponent<InputComponentProps, TextInputState> {
    state = {
        text: '',
        mode: 'text',
        active: false
    } as TextInputState;

    inputRef = React.createRef<HTMLInputElement>();
    menuRef = React.createRef<HTMLDivElement>();

    handleChangeState = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({
            text: (e.target as any).value
		});
    }

    handleSubmit: React.FormEventHandler = e => {
        e.preventDefault();
        e.stopPropagation();

        const { text, mode } = this.state;

        if (mode !== 'text')
            return;

        if (!text)
            return;

        this.setState({
            text: ''
        }, () => {
            this.props.onSendMessage(text, null);

            if (this.inputRef.current)
                this.inputRef.current.focus();
        })
	}
	
    handleMenuButton = () => {
        const mode = this.state.mode === 'menu'
            ? 'text'
            : 'menu';

        this.setState({
            mode
        }, () => {
            this.props.onEmitAnalytics(mode === 'menu' ? 'open-persistent-menu' : 'close-persistent-menu');
        });
    }

    handleMenuItem = (item: IPersistentMenuItem) => {

        this.props.onEmitAnalytics('click-persistent-menu-item', {
            text: item.payload,
            label: item.title
        });

        this.props.onSendMessage(item.payload, null, { label: item.title });

        this.setState({
            mode: 'text'
        });
    }
    
    handleKeyDown = event => {
        const { key, target } = event;
        let newFocusTarget = null;

        switch (key) {
            case "ArrowUp":
                newFocusTarget = target.previousElementSibling || this.menuRef.current?.lastChild;
                break;
            case "ArrowDown":
                newFocusTarget = target.nextElementSibling || this.menuRef.current?.firstChild;
                break;
            case "Home":
                newFocusTarget = this.menuRef.current?.firstChild;
                break;
            case "End":
                newFocusTarget = this.menuRef.current?.lastChild;
                break;
            default:
                break;
        }

        if (newFocusTarget !== null) {
            newFocusTarget.focus();
            event.preventDefault();
        }
    };

    render() {
        const { props, state } = this;
        const { text, active, mode } = state;
        const {
            disableInputAutofocus,
            enablePersistentMenu,
            persistentMenu,
        } = props.config.settings;
        const {
            title,
            menuItems
        } = persistentMenu;

        return (
            <InputForm
                data-active={active}
                onSubmit={this.handleSubmit}
                className="webchat-input-menu-form"
            >
                {enablePersistentMenu && (
                    <MenuButton type='button'
                        onClick={this.handleMenuButton}
                        className="webchat-input-button-menu" 
                        aria-label="Toggle persistent menu"
                        aria-expanded={mode==="menu" ? true : false}
                        id="webchatInputButtonMenu"
                    >
                        <MenuIcon />
                    </MenuButton>
                )}
                {mode === 'text' && (
                    <>
                        <Input
                            ref={this.inputRef}
                            autoFocus={!disableInputAutofocus}
                            value={text}
                            onChange={this.handleChangeState}
                            onFocus={() => this.setState({ active: true })}
                            onBlur={() => this.setState({ active: false })}
                            placeholder={props.config.settings.inputPlaceholder}
                            className="webchat-input-message-input"
                            aria-label="Message to send"
                            id="webchatInputMessageInputInTextMode"
                        />
                        <SubmitButton disabled={this.state.text === ''} className="webchat-input-button-send" aria-label="Send Message">
                            <SendIcon />
                        </SubmitButton>
                    </>
                )}
                {mode === 'menu' && (
                    <PersistentMenu className="webchat-input-persistent-menu" tabIndex={-1}>
                        {title && (
                            <PersistentMenuTitle className="webchat-input-persistent-menu-title" id="persistentMenuTitle">
                                {title}
                            </PersistentMenuTitle>
                        )}
                       <div aria-labelledby="persistentMenuTitle" role="menu" ref={this.menuRef} onKeyDown={e => this.handleKeyDown(e)}>
                            {menuItems.map((item, index) => (
                                <PersistentMenuItem
                                    key={`${item.title}${item.payload}`}
                                    onClick={() => this.handleMenuItem(item)}
                                    className="webchat-input-persistent-menu-item"
                                    role="menuitem"
                                    tabIndex={index === 0 ? 0 : -1}
                                >
                                    {item.title}
                                </PersistentMenuItem>
                            ))}
                        </div>
                    </PersistentMenu>
                )}
            </InputForm>
        )
    }
}