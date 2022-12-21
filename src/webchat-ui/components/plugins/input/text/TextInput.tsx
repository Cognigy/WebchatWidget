import * as React from 'react';
import { styled } from '../../../../style';
import { InputComponentProps } from '../../../../../common/interfaces/input-plugin';
import SendIcon from './baseline-send-24px.svg';
import MenuIcon from './baseline-menu-24px.svg';
import AttachFileIcon from './attach-file-24px.svg';
import { IPersistentMenuItem } from '../../../../../common/interfaces/webchat-config';
import TextareaAutosize from 'react-textarea-autosize';
import FileAttachmentSection from '../file/FileAttachmentSection';
import PreviewUploadedFiles, { IFile } from '../file/PreviewUploadedFiles';
import { fetchFileUploadToken, uploadFile } from '../../../../../webchat/helper/endpoint';
import { IUploadFileMetaData } from '../../../../../common/interfaces/file-upload';


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

const TextArea = styled(TextareaAutosize)(({ theme }) => ({
    display: 'block',
    flexGrow: 1,
    alignSelf: 'stretch',

    border: 'none',
    boxSizing: 'border-box',
    paddingLeft: theme.unitSize * 2,
    paddingRight: theme.unitSize * 2,
    marginTop: theme.unitSize,
    marginBottom: theme.unitSize,
    lineHeight: '1.5em',
    outline: 'none',
    resize: 'none',
    backgroundColor: 'transparent'
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
    alignSelf: 'flex-end',

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

const AttachFileButton = styled(Button)(({ theme }) => ({
    marginRight: 0,
    paddingRight: 0,

    "&:focus": {
        fill: theme.primaryColor,
    }
}));

const SubmitButton = styled(Button)(({ theme }) => ({
    marginRight: theme.unitSize,
    marginLeft: 0,

    "&:focus": {
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
    isAttachFileSectionOpen: boolean;
    fileList: IFile[];
    fileUploadError: boolean;
}

export class TextInput extends React.PureComponent<InputComponentProps, TextInputState> {
    state = {
        text: '',
        mode: 'text',
        active: false,
        isAttachFileSectionOpen: false,
        fileList: [],
        fileUploadError: false
    } as TextInputState;

    inputRef = React.createRef<HTMLTextAreaElement | HTMLInputElement>();
    menuRef = React.createRef<HTMLDivElement>();

    handleChangeState = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        this.setState({
            text: (e.target as any).value
        });
    }

    handleSubmit: React.FormEventHandler = e => {
        e.preventDefault();
        e.stopPropagation();

        const { text, mode, fileList } = this.state;

        if (mode !== 'text')
            return;

        if (!text && !fileList)
            return;

        let attachments: IUploadFileMetaData[] = [];
        fileList.forEach(fileItem => {
            if (fileItem.uploadFileMeta) {
                if (!fileItem.hasUploadError) {
                    attachments.push(fileItem.uploadFileMeta)
                }
            }
        });

        let data: any = null;
        if (attachments.length > 0) {
            data = { attachments };
        }

        this.setState({
            text: '',
            fileList: []
        }, () => {
            this.props.onSendMessage(text, data, {
                collate: true
            });

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

    handleMenuKeyDown = event => {
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

    /**
     * overrides the default textarea "return" key behavior.
     * 
     * Return should "submit"
     * Shift+Return should insert a "newline" (default)
     */
    handleInputKeyDown: React.KeyboardEventHandler<HTMLTextAreaElement> = event => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            event.stopPropagation();

            // submit
            this.handleSubmit(event);
        }
    }

    onOpenFileAttachmentSection = (event) => {
        event.preventDefault();
        this.setState({ isAttachFileSectionOpen: true })
    }

    onCloseFileAttachmentSection = () => {
        this.setState({ isAttachFileSectionOpen: false })
    }

    onAddFilesToList = async (newFiles: File[]) => {
        const {
            fileAttachmentMaxSize,
            _endpointTokenUrl
        } = this.props.config.settings;

        const existingFileList = this.state.fileList;
        let newFileList: IFile[] = [];
        const fileAttachmentMaxSizeInMb = fileAttachmentMaxSize > 0 ? fileAttachmentMaxSize / (1024 * 1024) : 0;
        newFiles.forEach(file => {
            if (file.size > fileAttachmentMaxSize) {
                newFileList.push({
                    file: file,
                    progressPercentage: 10,
                    hasUploadError: true,
                    uploadErrorReason: `File size > ${fileAttachmentMaxSizeInMb}MB`
                });
            } else {
                newFileList.push({
                    file: file,
                    progressPercentage: 30
                });
            }
        });

        this.setState({ fileList: existingFileList.concat(newFileList) });

        const fileUploadTokenApiUrl = `${_endpointTokenUrl}/fileuploadtoken`;
        let response;
        let hasError = false;
        try {
            response = await fetchFileUploadToken(fileUploadTokenApiUrl);
        } catch (err) {
            hasError = true;
        }

        newFileList = newFileList.map(fileItem => {
            if (!fileItem.hasUploadError) {
                fileItem.progressPercentage = 50;
                fileItem.hasUploadError = hasError;
                fileItem.uploadErrorReason = hasError ? "Upload Failed" : fileItem.uploadErrorReason;
            }
            return fileItem;
        });
        setTimeout(() => {
            this.setState({ fileList: existingFileList.concat(newFileList) });
        }, 100);

        newFileList = await Promise.all(newFileList.map(async fileItem => {
            try {
                if (!fileItem.hasUploadError) {
                    fileItem.uploadFileMeta = await uploadFile(fileItem.file, response.fileUploadUrl, response.token);
                    if (fileItem.uploadFileMeta.status === "infected") {
                        fileItem.hasUploadError = true;
                        fileItem.uploadErrorReason = "Infected File"
                        this.setState({ fileUploadError: true });
                    }
                    fileItem.uploadFileMeta.fileName = fileItem.file.name;
                    fileItem.progressPercentage = 100;
                } else {
                    this.setState({ fileUploadError: true });
                }
            } catch (err) {
                fileItem.hasUploadError = true;
                fileItem.uploadErrorReason = "Failed Upload!"
                this.setState({ fileUploadError: true });
            }
            return fileItem;
        }));
        this.setState({ fileList: existingFileList.concat(newFileList) });
    };

    onRemoveFileFromList = (index: number) => {
        const nextFileList = this.state.fileList.filter((_, i) => i !== index)
        let fileUploadError = false;
        // When files with upload error is removed, we want to enable the send button
        nextFileList.forEach(fileItem => {
            fileUploadError = fileItem.hasUploadError || fileUploadError;
        });
        this.setState({ fileList: nextFileList, fileUploadError });
    };

    render() {
        const { props, state } = this;
        const { text, active, mode, isAttachFileSectionOpen, fileList } = state;
        const {
            disableInputAutocomplete,
            disableInputAutofocus,
            disableInputAutogrow,
            enablePersistentMenu,
            enableFileAttachment,
            inputAutogrowMaxRows,
            persistentMenu,
        } = props.config.settings;
        const {
            title,
            menuItems
        } = persistentMenu;
        const isFileListEmpty = fileList?.length === 0;

        return (
            <>
                {!isAttachFileSectionOpen ? (
                    <>
                        <InputForm
                            data-active={active && isFileListEmpty}
                            onSubmit={this.handleSubmit}
                            className="webchat-input-menu-form"
                        >
                            {enablePersistentMenu && (
                                <MenuButton type='button'
                                    onClick={this.handleMenuButton}
                                    className="webchat-input-button-menu"
                                    aria-label="Toggle persistent menu"
                                    aria-expanded={mode === "menu" ? true : false}
                                    id="webchatInputButtonMenu"
                                >
                                    <MenuIcon />
                                </MenuButton>
                            )}
                            {mode === 'text' && (
                                <>
                                    {!disableInputAutogrow ? (
                                        <TextArea
                                            ref={this.inputRef}
                                            autoFocus={!disableInputAutofocus}
                                            value={text}
                                            onChange={this.handleChangeState}
                                            onFocus={() => this.setState({ active: true })}
                                            onBlur={() => this.setState({ active: false })}
                                            onKeyDown={this.handleInputKeyDown}
                                            placeholder={props.config.settings.inputPlaceholder}
                                            className="webchat-input-message-input"
                                            aria-label="Message to send"
                                            minRows={1}
                                            maxRows={inputAutogrowMaxRows}
                                            autoComplete={disableInputAutocomplete ? 'off' : undefined}
                                            spellCheck={false}
                                            id="webchatInputMessageInputInTextMode"
                                        />
                                    ) : (
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
                                            autoComplete={disableInputAutocomplete ? 'off' : undefined}
                                            spellCheck={false}
                                            id="webchatInputMessageInputInTextMode"
                                        />
                                    )}

                                    {enableFileAttachment &&
                                        <AttachFileButton
                                            className="webchat-input-button-add-attachments"
                                            onClick={this.onOpenFileAttachmentSection}
                                            aria-label="Add Attachments"
                                            id="webchatInputMessageAttachFileButton"
                                        >
                                            <AttachFileIcon />
                                        </AttachFileButton>
                                    }

                                    <SubmitButton
                                        disabled={(this.state.text === '' && isFileListEmpty) || this.state.fileUploadError}
                                        className="webchat-input-button-send"
                                        aria-label="Send Message"
                                        id="webchatInputMessageSendMessageButton"
                                    >
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
                                    <div aria-labelledby="persistentMenuTitle" role="menu" ref={this.menuRef} onKeyDown={e => this.handleMenuKeyDown(e)}>
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
                        {!isFileListEmpty &&
                            <PreviewUploadedFiles
                                fileList={fileList}
                                onRemoveFileFromList={this.onRemoveFileFromList}
                            />
                        }
                    </>
                ) : (
                    <FileAttachmentSection
                        fileList={fileList}
                        onAddFilesToList={this.onAddFilesToList}
                        onRemoveFileFromList={this.onRemoveFileFromList}
                        onClose={this.onCloseFileAttachmentSection}
                    />
                )}
            </>
        )
    }
}