import React from 'react';
import styled from '@emotion/styled';
import classnames from 'classnames';
import { InputComponentProps } from '../../../../../common/interfaces/input-plugin';
import SendIcon from './send-icon-16px.svg';
import SpeechIconSVG from './speech-icon-16px.svg';
import AttachFileIcon from './attachment-icon-16px.svg';
import TextareaAutosize from 'react-textarea-autosize';
import DropZone from '../file/DropZone';
import PreviewUploadedFiles, { IFile } from '../file/PreviewUploadedFiles';
import { fetchFileUploadToken, uploadFile } from '../../../../../webchat/helper/endpoint';
import { IUploadFileMetaData } from '../../../../../common/interfaces/file-upload';

const InputForm = styled.form(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    marginBottom: 0,
}));

const TextArea = styled(TextareaAutosize)(({ theme }) => ({
    display: 'block',
    flexGrow: 1,
    alignSelf: 'stretch',

    border: 'none',
    boxSizing: 'border-box',
    outline: 'none',
    resize: 'none',
    backgroundColor: 'transparent',

    fontSize: 14,
    fontStyle: 'normal',
    fontWeight: 400,
    lineHeight: '140%',


    "::-webkit-scrollbar": {
        width: 2,
        height: 2,
    },
    "::-webkit-scrollbar-track": {
        backgroundColor: theme.black95,
    },
    "::-webkit-scrollbar-thumb": {
        backgroundColor: theme.black60,
    },
}));

const Button = styled.button(({ theme }) => ({
    margin: 0,
    padding: 0,
    backgroundColor: 'transparent',
    border: 'none',
    fill: theme.textDark,
    cursor: 'pointer',
    outline: 'none',

    '&[disabled]': {
        fill: theme.black60,
        cursor: 'default'
    },

    "&:focus": {
        fill: theme.primaryColor,
    },
}));

const AttachFileButton = styled(Button)(({ theme }) => ({

}));

const SpeechButton = styled(Button)(({ theme }) => ({
    position: 'relative',

    "&.webchat-input-button-speech-active": {
        fill: theme.textLight,
    },
}));

const SpeechIcon = styled(SpeechIconSVG)(({ theme }) => ({
    position: 'relative',
}));

const SpeechButtonBackground = styled.div(({ theme }) => ({
    position: 'absolute',
    top: '-6px',
    left: '-6px',
    backgroundColor: theme.primaryColor,
    height: 28,
    width: 28,
    borderRadius: 16,
}));

const SpeechButtonAnimatedBackground = styled.div(({ theme }) => ({
    position: 'absolute',
    top: '-6px',
    left: '-6px',
    backgroundColor: theme.primaryColor,
    opacity: 0.2,
    height: 28,
    width: 28,
    borderRadius: 16,
    animation: `expanding 2s ease-in-out infinite`,

    "@keyframes expanding": {
        "from, to": {
            transform: "scale(1)"

        },
        "50%": {
            transform: "scale(1.3)"
        }
    }
}));

const HiddenFileInput = styled.input(() => ({
    display: 'none',
}));

const SubmitButton = styled(Button)(({ theme }) => ({

}));


export interface TextInputState {
    text: string;
    textActive: boolean;
    isDropZoneVisible: boolean;
    fileList: IFile[];
    fileUploadError: boolean;
}

interface ISpeechInputState {
    speechRecognition: SpeechRecognition;
    speechResult: string;
    isFinalResult: boolean;
}

interface IBaseInputState extends TextInputState, ISpeechInputState { }

interface IBaseInputProps extends InputComponentProps {
    sttActive: boolean;
    onSetSTTActive: (active: boolean) => void;
    webchatSpeechTimeoutRef: React.RefObject<NodeJS.Timeout>;
}

declare global {
    interface Window {
        WebChatInputTextCallback: (text: string) => void;
    }
}

const getSpeechRecognition = (): SpeechRecognition | null => {
    try {
        return new SpeechRecognition();
    } catch (e) { }

    try {
        return new webkitSpeechRecognition() as SpeechRecognition;
    } catch (e) { }

    return null;
}

const combineStrings = (str1: string, str2: string) => {
    if (!str1) return str2;
    if (!str2) return str1;
    return str1 + " " + str2;
}

let webchatSpeechTimeoutRef: NodeJS.Timeout | null = null

export class BaseInput extends React.PureComponent<IBaseInputProps, IBaseInputState> {
    constructor(props: IBaseInputProps) {
        super(props);

        const speechRecognition = getSpeechRecognition();

        if (speechRecognition) {
            speechRecognition.continuous = true;
            speechRecognition.interimResults = true;
            speechRecognition.onresult = this.handleSpeechResult;

            if (props.config.settings.STTLanguage) {
                speechRecognition.lang = props.config.settings.STTLanguage
            }
        }

        this.state = {
            text: '',
            textActive: false,
            isDropZoneVisible: false,
            fileList: [],
            fileUploadError: false,

            speechRecognition,
            speechResult: '',
            isFinalResult: false
        } as IBaseInputState;

    }

    inputRef = React.createRef<HTMLTextAreaElement | HTMLInputElement>();
    menuRef = React.createRef<HTMLDivElement>();
    fileInputRef = React.createRef<HTMLInputElement>();

    componentDidMount(): void {
        // Global handler to modify the input text
        window.WebChatInputTextCallback = (text: string) => {
            this.setState({ text });
        }
    }

    componentDidUpdate() {
        if (this.state.speechRecognition && this.props.config.settings.STTLanguage && this.state.speechRecognition.lang !== this.props.config.settings.STTLanguage) {
            this.setState({
                speechRecognition: {
                    ...this.state.speechRecognition,
                    lang: this.props.config.settings.STTLanguage
                }
            })
        }
    }

    componentWillUnmount(): void {
        if (webchatSpeechTimeoutRef) {
            clearTimeout(webchatSpeechTimeoutRef);
        }
    }

    handleSpeechResult = (e: SpeechRecognitionEvent) => {
        const result = e.results[e.resultIndex];
        const { isFinal } = result;
        const { transcript } = result[0];

        // Reset the 3s timeout for active speech recognition
        if (webchatSpeechTimeoutRef) {
            clearTimeout(webchatSpeechTimeoutRef);
        }
        webchatSpeechTimeoutRef = setTimeout(() => {
            this.handleCancelSpeech();
        }, 3000);

        this.setState({
            speechResult: transcript,
            isFinalResult: isFinal
        })

        // only send messages that are not 'interim'
        if (isFinal) {
            this.setState({
                speechResult: "",
                text: combineStrings(this.state.text, transcript),
            })
        }
    }

    handleCancelSpeech = () => {
        const { speechRecognition } = this.state;
        speechRecognition.stop();

        if (webchatSpeechTimeoutRef) {
            clearTimeout(webchatSpeechTimeoutRef);
        }

        this.props.onSetSTTActive(false);

        this.setState({
            speechResult: '',
            isFinalResult: false
        })

        if (this.inputRef.current) {
            this.inputRef.current.focus();
        }
    }

    isSTTSupported() {
        return !!this.state.speechRecognition;
    }

    toggleSTT = (e) => {
        e.preventDefault();
        const { speechRecognition } = this.state;
        const { sttActive, onSetSTTActive } = this.props;

        if (sttActive) {
            this.handleCancelSpeech();
        } else {
            speechRecognition.start();

            if (webchatSpeechTimeoutRef) {
                clearTimeout(webchatSpeechTimeoutRef);
            }

            webchatSpeechTimeoutRef = setTimeout(() => {
                this.handleCancelSpeech();
            }, 3000);
        }

        onSetSTTActive(!sttActive);

    }

    handleChangeTextValue = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        this.setState({
            text: (e.target as any).value
        });
    }

    handleSubmit: React.FormEventHandler = e => {
        e.preventDefault();
        e.stopPropagation();

        const {
            text,
            fileList,
            speechResult
        } = this.state;
        const { sttActive } = this.props;


        let messageText = text;

        if (sttActive) {

            if (text && speechResult) {
                messageText = text + " " + speechResult;
            }

            this.handleCancelSpeech();
        }

        if (!text && !fileList)
            return;

        const attachments: IUploadFileMetaData[] = [];
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
            this.props.onSendMessage(messageText, data, {
                collate: true
            });

            if (this.inputRef.current)
                this.inputRef.current.focus();
        })
    }

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

    handleSelectFile = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        const newFilesArray = Array.prototype.slice.call(files);
        this.onAddFilesToList(newFilesArray);
    }

    handleUploadFile = (event) => {
        event.preventDefault();
        this.fileInputRef.current?.click();
    }

    handleDragEnter = (e) => {
        e.preventDefault();
        e.stopPropagation();

        this.setState({ isDropZoneVisible: true });
    };

    handleDropZoneVisibility = (isDropZoneVisible: boolean) => {
        this.setState({ isDropZoneVisible })
    }

    render() {
        const { props, state } = this;

        const { sttActive } = props;

        const {
            text,
            textActive,
            fileList,
            isDropZoneVisible,
            speechResult: speechInterim,
        } = state;

        const {
            disableInputAutocomplete,
            disableInputAutofocus,
            enableFileAttachment,
            inputAutogrowMaxRows,
        } = props.config.settings;

        const isFileListEmpty = fileList?.length === 0;

        return (
            <>
                <div onDragEnter={this.handleDragEnter}>
                    <InputForm
                        data-active={textActive && isFileListEmpty}
                        onSubmit={this.handleSubmit}
                        className={classnames("webchat-input-menu-form")}
                    >
                        {enableFileAttachment &&
                        <>
                            <HiddenFileInput
                                ref={this.fileInputRef}
                                type="file"
                                multiple
                                onChange={this.handleSelectFile}
                            />
                            <AttachFileButton
                                className="webchat-input-button-add-attachments"
                                onClick={this.handleUploadFile}
                                aria-label="Add Attachments"
                                id="webchatInputMessageAttachFileButton"
                            >
                                <AttachFileIcon />
                            </AttachFileButton>
                        </>
                        }

                        <TextArea
                            ref={(this.inputRef) as React.Ref<HTMLTextAreaElement>}
                            autoFocus={!disableInputAutofocus}
                            value={combineStrings(text, speechInterim)}
                            onChange={this.handleChangeTextValue}
                            onFocus={() => this.setState({ textActive: true })}
                            onBlur={() => this.setState({ textActive: false })}
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

                        <SpeechButton
                            className={classnames("webchat-input-button-speech", sttActive && "webchat-input-button-speech-active")}
                            aria-label="Speech to text"
                            id="webchatInputMessageSpeechButton"
                            onClick={this.toggleSTT}
                            disabled={!this.isSTTSupported()}
                        >
                            {
                                sttActive &&
                                <>
                                    <SpeechButtonAnimatedBackground
                                        className={classnames("webchat-input-button-speech-background")}
                                        aria-hidden="true"
                                    />
                                    <SpeechButtonBackground
                                        className={classnames("webchat-input-button-speech-background")}
                                        aria-hidden="true"
                                    />
                                </>
                            }
                            <SpeechIcon />
                        </SpeechButton>

                        <SubmitButton
                            disabled={(this.state.text === '' && isFileListEmpty) || this.state.fileUploadError}
                            className="webchat-input-button-send"
                            aria-label="Send Message"
                            id="webchatInputMessageSendMessageButton"
                        >
                            <SendIcon />
                        </SubmitButton>
                    </InputForm>
                    {!isFileListEmpty &&
                        <PreviewUploadedFiles
                            fileList={fileList}
                            onRemoveFileFromList={this.onRemoveFileFromList}
                        />
                    }
                </div>
                {isDropZoneVisible &&
                    <DropZone
                        onAddFilesToList={this.onAddFilesToList}
                        setIsDropZoneVisible={this.handleDropZoneVisibility}
                    />
                }
            </>
        )
    }
}