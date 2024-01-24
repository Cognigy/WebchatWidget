import { Middleware } from "redux";
import { StoreState } from "../store";
import { IFile, setFileList, setFileUploadError } from "./input-reducer";
import { fetchFileUploadToken, uploadFile } from "../../helper/endpoint";

const ADD_FILES_TO_LIST = "ADD_FILES_TO_LIST";
export const addFilesToList = (newFiles: File[]) => ({
	type: ADD_FILES_TO_LIST as "ADD_FILES_TO_LIST",
	newFiles,
});
type TAddFilesToListAction = ReturnType<typeof addFilesToList>;

type Actions = TAddFilesToListAction;

export const createFileInputMiddleware =
	(): Middleware<object, StoreState> => store => next => async (action: Actions) => {
		switch (action.type) {
			case "ADD_FILES_TO_LIST": {
				const { fileAttachmentMaxSize, _endpointTokenUrl } =
					store.getState().config.settings;

				const existingFileList = store.getState().input.fileList;
				let newFileList: IFile[] = [];
				const fileAttachmentMaxSizeInMb =
					fileAttachmentMaxSize > 0 ? fileAttachmentMaxSize / (1024 * 1024) : 0;
				action.newFiles?.forEach(file => {
					if (file.size > fileAttachmentMaxSize) {
						newFileList.push({
							file: file,
							progressPercentage: 10,
							hasUploadError: true,
							uploadErrorReason: `File size > ${fileAttachmentMaxSizeInMb}MB`,
						});
					} else {
						newFileList.push({
							file: file,
							progressPercentage: 30,
						});
					}
				});

				store.dispatch(setFileList(existingFileList.concat(newFileList)));

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
						fileItem.uploadErrorReason = hasError
							? "Upload Failed"
							: fileItem.uploadErrorReason;
					}
					return fileItem;
				});
				setTimeout(() => {
					store.dispatch(setFileList(existingFileList.concat(newFileList)));
				}, 100);

				newFileList = await Promise.all(
					newFileList.map(async fileItem => {
						try {
							if (!fileItem.hasUploadError) {
								fileItem.uploadFileMeta = await uploadFile(
									fileItem.file,
									response.fileUploadUrl,
									response.token,
								);
								if (fileItem.uploadFileMeta.status === "infected") {
									fileItem.hasUploadError = true;
									fileItem.uploadErrorReason = "Infected File";
									store.dispatch(setFileUploadError(true));
								}
								fileItem.uploadFileMeta.fileName = fileItem.file.name;
								fileItem.progressPercentage = 100;
							} else {
								store.dispatch(setFileUploadError(true));
							}
						} catch (err) {
							fileItem.hasUploadError = true;
							fileItem.uploadErrorReason = "Failed Upload!";
							store.dispatch(setFileUploadError(true));
						}
						return fileItem;
					}),
				);
				store.dispatch(setFileList(existingFileList.concat(newFileList)));
				break;
			}
		}

		return next(action);
	};
