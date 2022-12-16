export const getFileName = (fileNameWithExtension) => {
	return `${fileNameWithExtension.split('.').slice(0, -1).join('.')}.`;
}

export const getFileExtension = (fileNameWithExtension) => {
    return fileNameWithExtension.split('.').pop();
}