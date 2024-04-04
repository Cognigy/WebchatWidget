import { Reducer } from "redux";
import { IUploadFileMetaData } from "../../../common/interfaces/file-upload";

export interface IFile {
	file: File;
	progressPercentage?: number;
	uploadFileMeta?: IUploadFileMetaData;
	hasUploadError?: boolean;
	uploadErrorReason?: string;
}
export interface IInputState {
	sttActive: boolean;
	textActive: boolean;
	isDropZoneVisible: boolean;
	fileList: IFile[];
	fileUploadError: boolean;
}

const SET_STT_ACTIVE = "SET_STT_ACTIVE";
export const setSTTActive = (active: boolean) => ({
	type: SET_STT_ACTIVE as "SET_STT_ACTIVE",
	active,
});
type TSetSTTActiveAction = ReturnType<typeof setSTTActive>;

const SET_TEXT_ACTIVE = "SET_TEXT_ACTIVE";
export const setTextActive = (active: boolean) => ({
	type: SET_TEXT_ACTIVE as "SET_TEXT_ACTIVE",
	active,
});
type TSetTextActiveAction = ReturnType<typeof setTextActive>;

const SET_DROP_ZONE_VISIBLE = "SET_DROP_ZONE_VISIBLE";
export const setDropZoneVisible = (visible: boolean) => ({
	type: SET_DROP_ZONE_VISIBLE as "SET_DROP_ZONE_VISIBLE",
	visible,
});
type TSetDropZoneVisibleAction = ReturnType<typeof setDropZoneVisible>;

const SET_FILE_LIST = "SET_FILE_LIST";
export const setFileList = (fileList: IFile[]) => ({
	type: SET_FILE_LIST as "SET_FILE_LIST",
	fileList,
});
type TSetFileListAction = ReturnType<typeof setFileList>;

const SET_FILE_UPLOAD_ERROR = "SET_FILE_UPLOAD_ERROR";
export const setFileUploadError = (error: boolean) => ({
	type: SET_FILE_UPLOAD_ERROR as "SET_FILE_UPLOAD_ERROR",
	error,
});
type TSetFileUploadErrorAction = ReturnType<typeof setFileUploadError>;

const REMOVE_FILE_FROM_LIST = "REMOVE_FILE_FROM_LIST";
export const removeFileFromList = (index: number) => ({
	type: REMOVE_FILE_FROM_LIST as "REMOVE_FILE_FROM_LIST",
	index,
});
type TRemoveFileFromListAction = ReturnType<typeof removeFileFromList>;

const getInitialState = (): IInputState => ({
	sttActive: false,
	textActive: false,
	isDropZoneVisible: false,
	fileList: [],
	fileUploadError: false,
});

type InputAction =
	| TSetSTTActiveAction
	| TSetTextActiveAction
	| TSetDropZoneVisibleAction
	| TSetFileListAction
	| TSetFileUploadErrorAction
	| TRemoveFileFromListAction;

export const input: Reducer<IInputState, InputAction> = (state = getInitialState(), action) => {
	switch (action.type) {
		case SET_STT_ACTIVE: {
			return {
				...state,
				sttActive: action.active,
			};
		}

		case SET_TEXT_ACTIVE: {
			return {
				...state,
				textActive: action.active,
			};
		}

		case SET_DROP_ZONE_VISIBLE: {
			return {
				...state,
				isDropZoneVisible: action.visible,
			};
		}

		case SET_FILE_LIST: {
			return {
				...state,
				fileList: action.fileList,
			};
		}

		case SET_FILE_UPLOAD_ERROR: {
			return {
				...state,
				fileUploadError: action.error,
			};
		}

		case REMOVE_FILE_FROM_LIST: {
			const nextFileList = state.fileList.filter((_, i) => i !== action.index);
			let fileUploadError = false;
			// When files with upload error is removed, we want to enable the send button
			nextFileList.forEach(fileItem => {
				fileUploadError = fileItem.hasUploadError || fileUploadError;
			});

			return {
				...state,
				fileList: nextFileList,
				fileUploadError,
			};
		}

		default: {
			return state;
		}
	}
};
