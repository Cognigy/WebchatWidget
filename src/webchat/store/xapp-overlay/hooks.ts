import { useMemo } from "react";
import { useSelector } from "../../helper/useSelector";

export function useOverlaySettingsByUrl(url: string) {
	const settings = useSelector(state => state.xAppOverlay.settingsByUrl?.[url] ?? {});

	return useMemo(() => settings, [settings, url]);
}
