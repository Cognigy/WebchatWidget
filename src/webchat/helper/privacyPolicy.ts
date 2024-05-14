const STORAGE_KEY = "hasAcceptedTerms";

function getHasAcceptedTermsIds(browserStorage: Storage): string[] {
	let userIds: string[] = [];

	if (browserStorage) {
		const stored = browserStorage.getItem(STORAGE_KEY);

		if (stored) {
			try {
				const parsed = JSON.parse(stored);
				if (Array.isArray(parsed)) {
					userIds = parsed;
				}
			} catch (e) {
				return userIds;
			}
		}
	}

	return userIds;
}

export function hasAcceptedTermsInStorage(browserStorage: Storage | null, userId: string) {
	// We assume that the user has accepted the terms if there is no browser storage
	// available to store the information.
	if (!browserStorage) {
		console.warn("No browser storage available to store accepted terms.");
		return true;
	}

	const hasAcceptedTermsIds = getHasAcceptedTermsIds(browserStorage);

	return hasAcceptedTermsIds.includes(userId);
}

export function setHasAcceptedTermsInStorage(browserStorage: Storage, userId: string) {
	const hasAcceptedTermsIds = getHasAcceptedTermsIds(browserStorage);

	hasAcceptedTermsIds.push(userId);

	const uniqueUserIds = JSON.stringify([...new Set(hasAcceptedTermsIds.filter(Boolean))]);

	browserStorage?.setItem?.(STORAGE_KEY, uniqueUserIds);
}
