export const getFileName = (fileNameWithExtension) => {
	const splitName = fileNameWithExtension.split('.');
	if (splitName.length > 1) {
		return `${splitName.slice(0, -1).join('.')}.`;
	} else {
		// return full name here if it didn't have a file ending
		return fileNameWithExtension;
	}
};

export const getFileExtension = (fileNameWithExtension) => {
	const splitName = fileNameWithExtension.split('.');
	if (splitName.length > 1) {
		return splitName.pop();
	} else {
		return null;
	}
};