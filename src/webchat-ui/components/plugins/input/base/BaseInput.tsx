import React from "react";
import styled from "@emotion/styled";
import classnames from "classnames";
import { InputComponentProps } from "../../../../../common/interfaces/input-plugin";
import SendIcon from "./send-icon-16px.svg";
import SpeechIconSVG from "./speech-icon-16px.svg";
import AttachFileIcon from "./attachment-icon-16px.svg";
import TextareaAutosize from "react-textarea-autosize";
import PreviewUploadedFiles from "../file/PreviewUploadedFiles";
import { IUploadFileMetaData } from "../../../../../common/interfaces/file-upload";
import { IFile } from "../../../../../webchat/store/input/input-reducer";
import MediaQuery from "react-responsive";

const InputWrapper = styled.div(() => ({
	display: "flex",
	flexDirection: "column",
	gap: 12,
}));

const InputForm = styled.form(() => ({
	display: "flex",
	alignItems: "center",
	gap: 12,
	marginBottom: 0,
}));

const TextArea = styled(TextareaAutosize)(({ theme }) => ({
	display: "block",
	flexGrow: 1,
	alignSelf: "stretch",

	border: "none",
	boxSizing: "border-box",
	outline: "none",
	resize: "none",
	backgroundColor: "transparent",

	fontSize: 14,
	fontStyle: "normal",
	fontWeight: 400,
	lineHeight: "140%",

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
	backgroundColor: "transparent",
	border: "none",
	fill: theme.textDark,
	cursor: "pointer",
	outline: "none",

	"&[disabled]": {
		fill: theme.black60,
		cursor: "default",
	},

	"&:focus": {
		fill: theme.primaryColor,
	},
}));

const AttachFileButton = styled(Button)(({ theme }) => ({}));

const SpeechButton = styled(Button)(({ theme }) => ({
	position: "relative",

	"&.webchat-input-button-speech-active": {
		fill: theme.textLight,
	},
}));

const SpeechIcon = styled(SpeechIconSVG)(() => ({
	position: "relative",
}));

const SpeechButtonBackground = styled.div(({ theme }) => ({
	position: "absolute",
	top: "-6px",
	left: "-6px",
	backgroundColor: theme.primaryColor,
	height: 28,
	width: 28,
	borderRadius: 16,
}));

const SpeechButtonAnimatedBackground = styled.div(({ theme }) => ({
	position: "absolute",
	top: "-6px",
	left: "-6px",
	backgroundColor: theme.primaryColor,
	opacity: 0.2,
	height: 28,
	width: 28,
	borderRadius: 16,
	animation: `expanding 2s ease-in-out infinite`,

	"@keyframes expanding": {
		"from, to": {
			transform: "scale(1)",
		},
		"50%": {
			transform: "scale(1.3)",
		},
	},
}));

const HiddenFileInput = styled.input(() => ({
	display: "none",
}));

const SubmitButton = styled(Button)(({ theme }) => ({}));

export interface TextInputState {
	text: string;
}

interface ISpeechInputState {
	speechRecognition: SpeechRecognition;
	speechResult: string;
	isFinalResult: boolean;
}

interface IBaseInputState extends TextInputState, ISpeechInputState {}

interface IBaseInputProps extends InputComponentProps {
	sttActive: boolean;
	onSetSTTActive: (active: boolean) => void;
	textActive: boolean;
	onSetTextActive: (active: boolean) => void;
	fileUploadError: boolean;
	fileList: IFile[];
	onSetFileList: (fileList: IFile[]) => void;
	onAddFilesToList: (fileList: File[]) => void;
	webchatSpeechTimeoutRef?: React.RefObject<NodeJS.Timeout>;
}

declare global {
	interface Window {
		WebChatInputTextCallback: (text: string) => void;
	}
}

const getSpeechRecognition = (): SpeechRecognition | null => {
	try {
		return new SpeechRecognition();
	} catch (e) {}

	try {
		return new webkitSpeechRecognition() as SpeechRecognition;
	} catch (e) {}

	return null;
};

const combineStrings = (str1: string, str2: string) => {
	if (!str1) return str2;
	if (!str2) return str1;
	return str1 + " " + str2;
};

let webchatSpeechTimeoutRef: NodeJS.Timeout | null = null;

export class BaseInput extends React.PureComponent<IBaseInputProps, IBaseInputState> {
	constructor(props: IBaseInputProps) {
		super(props);

		const speechRecognition = getSpeechRecognition();

		if (speechRecognition) {
			speechRecognition.continuous = true;
			speechRecognition.interimResults = true;
			speechRecognition.onresult = this.handleSpeechResult;

			if (props.config.settings.widgetSettings.STTLanguage) {
				speechRecognition.lang = props.config.settings.widgetSettings.STTLanguage;
			}
		}

		this.state = {
			text: "",

			speechRecognition,
			speechResult: "",
			isFinalResult: false,
		} as IBaseInputState;
	}

	inputRef = React.createRef<HTMLTextAreaElement | HTMLInputElement>();
	menuRef = React.createRef<HTMLDivElement>();
	fileInputRef = React.createRef<HTMLInputElement>();

	componentDidMount(): void {
		// Global handler to modify the input text
		window.WebChatInputTextCallback = (text: string) => {
			this.setState({ text });
		};
		setTimeout(() => {
			if (!this.props.config.settings.widgetSettings.disableInputAutofocus) {
				this.inputRef.current?.focus?.();
			}
		}, 200);
	}

	componentDidUpdate() {
		const sttLanguage = this.props.config.settings.widgetSettings.STTLanguage;

		if (
			this.state.speechRecognition &&
			sttLanguage &&
			this.state.speechRecognition.lang !== sttLanguage
		) {
			this.setState({
				speechRecognition: {
					...this.state.speechRecognition,
					lang: sttLanguage,
				},
			});
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
			isFinalResult: isFinal,
		});

		// only send messages that are not 'interim'
		if (isFinal) {
			this.setState({
				speechResult: "",
				text: combineStrings(this.state.text, transcript),
			});
		}
	};

	handleCancelSpeech = () => {
		const { speechRecognition } = this.state;
		speechRecognition.stop();

		if (webchatSpeechTimeoutRef) {
			clearTimeout(webchatSpeechTimeoutRef);
		}

		this.props.onSetSTTActive(false);

		this.setState({
			speechResult: "",
			isFinalResult: false,
		});

		if (this.inputRef.current) {
			this.inputRef.current.focus();
		}
	};

	isSTTSupported() {
		return !!this.state.speechRecognition;
	}

	toggleSTT = e => {
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
	};

	handleChangeTextValue = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
		this.setState({
			text: e.target.value,
		});
	};

	handleSubmit: React.FormEventHandler = e => {
		e.preventDefault();
		e.stopPropagation();

		const { text, speechResult } = this.state;
		const { sttActive, fileList } = this.props;

		let messageText = text;

		if (sttActive) {
			if (text && speechResult) {
				messageText = text + " " + speechResult;
			}

			this.handleCancelSpeech();
		}

		if (!text && !fileList) return;

		const attachments: IUploadFileMetaData[] = [];
		fileList.forEach(fileItem => {
			if (fileItem.uploadFileMeta) {
				if (!fileItem.hasUploadError) {
					attachments.push(fileItem.uploadFileMeta);
				}
			}
		});

		let data: any = null;
		if (attachments.length > 0) {
			data = { attachments };
		}

		this.props.onSetFileList([]);
		this.setState(
			{
				text: "",
			},
			() => {
				this.props.onSendMessage(messageText, data, {
					collate: true,
				});

				if (this.inputRef.current) this.inputRef.current.focus();
			},
		);
	};

	/**
	 * overrides the default textarea "return" key behavior.
	 *
	 * Return should "submit"
	 * Shift+Return should insert a "newline" (default)
	 */
	handleInputKeyDown: React.KeyboardEventHandler<HTMLTextAreaElement> = event => {
		if (event.key === "Enter" && !event.shiftKey && !event?.nativeEvent?.isComposing) {
			event.preventDefault();
			event.stopPropagation();

			// submit
			this.handleSubmit(event);
		}
	};

	handleSelectFile = (event: React.ChangeEvent<HTMLInputElement>) => {
		const files = event.target.files;
		const newFilesArray = Array.prototype.slice.call(files);
		this.props.onAddFilesToList(newFilesArray);
		event.target.value = "";
	};

	handleUploadFile = event => {
		event.preventDefault();
		this.fileInputRef.current?.click();
	};

	handleFocus = () => {
		setTimeout(() => {
			this.props.onSetTextActive(true);
		}, 200);
	};

	handleBlur = () => {
		setTimeout(() => {
			this.props.onSetTextActive(false);
		}, 200);
	};

	render() {
		const { props, state } = this;

		const { sttActive, fileUploadError, fileList, textActive } = props;

		const { text, speechResult: speechInterim } = state;

		const { layout, fileStorageSettings, widgetSettings } = props.config.settings;

		const { disableInputAutocomplete, inputAutogrowMaxRows } = layout;

		const { disableInputAutofocus } = widgetSettings;

		const isFileAttachmentEnabled = fileStorageSettings?.enabled;

		const isFileListEmpty = fileList?.length === 0;

		return (
			<>
				<InputWrapper data-active={textActive && isFileListEmpty}>
					<InputForm
						onSubmit={this.handleSubmit}
						className={classnames("webchat-input-menu-form")}
					>
						{isFileAttachmentEnabled && (
							<>
								<HiddenFileInput
									ref={this.fileInputRef}
									type="file"
									multiple
									onChange={this.handleSelectFile}
									aria-hidden="true"
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
						)}

						<MediaQuery maxWidth={575}>
							{matches => (
								<TextArea
									ref={this.inputRef as React.Ref<HTMLTextAreaElement>}
									autoFocus={!disableInputAutofocus}
									value={combineStrings(text, speechInterim)}
									onChange={this.handleChangeTextValue}
									onFocus={this.handleFocus}
									onBlur={this.handleBlur}
									onKeyDown={this.handleInputKeyDown}
									placeholder={props.config.settings.behavior.inputPlaceholder}
									className="webchat-input-message-input"
									aria-label="Message to send"
									minRows={1}
									maxRows={inputAutogrowMaxRows}
									autoComplete={disableInputAutocomplete ? "off" : undefined}
									spellCheck={false}
									id="webchatInputMessageInputInTextMode"
									style={matches ? { fontSize: "16px" } : undefined}
								/>
							)}
						</MediaQuery>

						{props.config.settings.behavior.enableSTT && (
							<SpeechButton
								className={classnames(
									"webchat-input-button-speech",
									sttActive && "webchat-input-button-speech-active",
								)}
								aria-label="Speech to text"
								id="webchatInputMessageSpeechButton"
								onClick={this.toggleSTT}
								disabled={!this.isSTTSupported()}
							>
								{sttActive && (
									<>
										<SpeechButtonAnimatedBackground
											className={classnames(
												"webchat-input-button-speech-background",
											)}
											aria-hidden="true"
										/>
										<SpeechButtonBackground
											className={classnames(
												"webchat-input-button-speech-background",
											)}
											aria-hidden="true"
										/>
									</>
								)}
								<SpeechIcon />
							</SpeechButton>
						)}

						<SubmitButton
							disabled={
								(this.state.text === "" && isFileListEmpty) || fileUploadError
							}
							className="webchat-input-button-send cc-rtl-flip"
							aria-label="Send Message"
							id="webchatInputMessageSendMessageButton"
						>
							<SendIcon />
						</SubmitButton>
					</InputForm>
					{!isFileListEmpty && <PreviewUploadedFiles />}
				</InputWrapper>
			</>
		);
	}
}
