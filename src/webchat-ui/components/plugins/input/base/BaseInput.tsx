import React from 'react';
import styled from '@emotion/styled';
import { InputComponentProps } from '../../../../../common/interfaces/input-plugin';
import SendIcon from './send-icon-16px.svg';
import SpeechIcon from './speech-icon-16px.svg';
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

}));

const HiddenFileInput = styled.input(() => ({
	display: 'none',
}));

const SubmitButton = styled(Button)(({ theme }) => ({

}));


export interface TextInputState {
	text: string;
	active: boolean;
	isDropZoneVisible: boolean;
	fileList: IFile[];
	fileUploadError: boolean;
}

declare global {
	interface Window {
		WebChatInputTextCallback: (text: string) => void;
	}
}

export class BaseInput extends React.PureComponent<InputComponentProps, TextInputState> {
	state = {
		text: '',
		active: false,
		isDropZoneVisible: false,
		fileList: [],
		fileUploadError: false,
	} as TextInputState;

	inputRef = React.createRef<HTMLTextAreaElement | HTMLInputElement>();
	menuRef = React.createRef<HTMLDivElement>();
	fileInputRef = React.createRef<HTMLInputElement>();

	componentDidMount(): void {
		// Global handler to modify the input text
		window.WebChatInputTextCallback = (text: string) => {
			this.setState({ text });
		}
	}

	handleChangeState = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
		this.setState({
			text: (e.target as any).value
		});
	}

	handleSubmit: React.FormEventHandler = e => {
		e.preventDefault();
		e.stopPropagation();

		const {
			text,
			fileList
		} = this.state;

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

		const {
			text,
			active,
			fileList,
			isDropZoneVisible
		} = state;

		const {
			disableInputAutocomplete,
			disableInputAutofocus,
			enableFileAttachment,
			inputAutogrowMaxRows,
		} = props.config.settings;

		console.log({ inputAutogrowMaxRows })

		const isFileListEmpty = fileList?.length === 0;

		return (
			<>
				<div onDragEnter={this.handleDragEnter}>
					<InputForm
						data-active={active && isFileListEmpty}
						onSubmit={this.handleSubmit}
						className="webchat-input-menu-form"
					>
						{/* {enableFileAttachment && */}
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
						{/* } */}

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

						<SpeechButton
							className="webchat-input-button-speech"
							aria-label="Speech to text"
							id="webchatInputMessageSpeechButton"
						>
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