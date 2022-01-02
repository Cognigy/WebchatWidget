/* Node modules */
import React, { FC, useState } from "react";
import Flatpickr from "react-flatpickr";

/* Custom modules */
import l10n from "./langHelper";
import { registerMessagePlugin } from "../helper";
import { IMessage } from "../../common/interfaces/message";
import {
	MessageComponentProps,
	MessagePluginFactory,
} from "../../common/interfaces/message-plugin";

/* CSS */
import "./style.css";
import "./flatpickr.css";

const datePickerDaySelector =
	".flatpickr-day.selected, .flatpickr-day.startRange, .flatpickr-day.endRange, .flatpickr-day.selected.inRange, .flatpickr-day.startRange.inRange, .flatpickr-day.endRange.inRange, .flatpickr-day.selected:focus, .flatpickr-day.startRange:focus, .flatpickr-day.endRange:focus, .flatpickr-day.selected:hover, .flatpickr-day.startRange:hover, .flatpickr-day.endRange:hover, .flatpickr-day.selected.prevMonthDay, .flatpickr-day.startRange.prevMonthDay, .flatpickr-day.endRange.prevMonthDay, .flatpickr-day.selected.nextMonthDay, .flatpickr-day.startRange.nextMonthDay, .flatpickr-day.endRange.nextMonthDay";

/**
 * Transforms regional locales to flatpicks internal locale key
 */
const getFlatpickrLocaleId = (locale: string) => {
	switch (locale) {
		case "us":
		case "gb":
		case "au":
		case "ca":
			return "en";
	}

	return locale;
};

const datePickerPlugin: MessagePluginFactory = ({ styled }) => {
	const DatePickerRoot = styled.div(({ theme }) => ({
		display: "flex",
		flexDirection: "column",
		flexGrow: 1,
		[datePickerDaySelector]: {
			background: theme.primaryGradient,
			color: theme.primaryContrastColor,
		},
	}));

	const Button = styled.button(({ theme }) => ({
		backgroundColor: theme.greyColor,
		color: theme.greyContrastColor,

		cursor: "pointer",
		border: "none",

		height: 40,

		padding: `${theme.unitSize}px ${theme.unitSize * 2}px`,
		borderRadius: theme.unitSize * 2,
	}));

	const PrimaryButton = styled(Button)(({ theme }) => ({
		background: theme.primaryGradient,
		color: theme.primaryContrastColor,
	}));

	const OutlinedButton = styled(Button)(({ theme }) => ({
		backgroundColor: "transparent",
		border: `1px solid ${theme.primaryColor}`,
		color: theme.primaryColor,
	}));

	const SubmitButton = styled(PrimaryButton)(({ theme }) => ({
		flexGrow: 2,
		marginLeft: theme.unitSize * 2,
	}));

	const CancelButton = styled(Button)(({ theme }) => ({
		flexGrow: 1,
	}));

	const OpenDatepickerButton = styled(OutlinedButton)(({ theme }) => ({
		"&[disabled]": {
			borderColor: theme.greyColor,
			color: theme.greyColor,
			cursor: "default",
		},
		"&:focus": {
			outline: "none",
			boxShadow: `0 0 3px 1px ${theme.primaryWeakColor}`,
		},
	}));

	const Padding = styled.div(({ theme }) => ({
		paddingTop: theme.unitSize,
		paddingBottom: theme.unitSize,
		paddingLeft: theme.unitSize * 2,
		paddingRight: theme.unitSize * 2,
	}));

	const Header = styled(Padding)(({ theme }) => ({
		background: theme.primaryGradient,
		color: theme.primaryContrastColor,
		flexGrow: 1,
		display: "flex",
		alignItems: "center",
		fontWeight: "bolder",
		boxShadow: theme.shadow,
		zIndex: 2,
	}));

	const Content = styled(Padding)(({ theme }) => ({
		display: "flex",
		justifyContent: "center",
	}));

	const Footer = styled(Padding)(({ theme }) => ({
		display: "flex",
		justifyContent: "space-between",
		alignItems: "center",
		backgroundColor: "white",
		boxShadow: theme.shadow,
	}));

	const processedMessages: Set<string> = new Set();

	const DatePicker: FC<MessageComponentProps> = (props) => {
		const {
			onSendMessage,
			message,
			config,
			attributes,
			isFullscreen,
			onSetFullscreen,
			onDismissFullscreen,
		} = props;

		const [msg, setMsg] = useState("");

		const handleSubmit = () => {
			// close plugin if user didn't choose a date
			if (msg.length > 0) {
				if (message.source === "bot") processedMessages.add(message.traceId);

				setTimeout(() => {
					onSendMessage(msg),
						{
							_plugin: "date-picker",
							date: msg,
						};
				}, 300);
			} else {
				onDismissFullscreen && onDismissFullscreen();
			}
		};

		const handleAbort = () => {
			onDismissFullscreen && onDismissFullscreen();
		};

		const isWeekendDate = (date: string) => {
			const isoWeekday = ((new Date(date).getDay() + 6) % 7) + 1;

			switch (isoWeekday) {
				// 6 is saturday
				case 6:
				// 7 is sunday
				case 7:
					return true;
			}

			return false;
		};

		const transformNamedDate = (namedDate: string) => {
			switch (namedDate) {
				case "today":
					// fr-CA is one of the few locales with a day format of YYYY-MM-DD
					return new Intl.DateTimeFormat("fr-CA").format(new Date(namedDate));

				case "tomorrow":
					return new Intl.DateTimeFormat("fr-CA").format(
						new Date().setDate(new Date(namedDate).getDate() + 1)
					);

				case "yesterday":
					return new Intl.DateTimeFormat("fr-CA").format(
						new Date().setDate(new Date(namedDate).getDate() - 1)
					);
			}

			return namedDate;
		};

		const getOptionsFromMessage = (message: IMessage) => {
			const { data } = message.data._plugin;
			console.log("data:", data);
			const dateFormat = data.dateFormat || "YYYY-MM-DD";
			const defaultDate =
				transformNamedDate(data.defaultDate) ||
				transformNamedDate(data.minDate) ||
				"";

			const localeId = data.locale || "us";
			const flatpickrLocaleId = getFlatpickrLocaleId(localeId);
			let locale = l10n[flatpickrLocaleId];
			const enableTime = !!data.enableTime;
			const timeTemp = data.time_24hr ? "H:i" : "h:i"; //12-hour format without AM/PM
			const timeWithSeconds = data.enableSeconds ? `${timeTemp}:S` : timeTemp;
			const timeFormat = data.time_24hr
				? timeWithSeconds
				: `${timeWithSeconds} K`; //12-hour format with AM/PM

			if (localeId === "gb") locale = { ...locale, firstDayOfWeek: 1 };
			const options = {
				defaultHour: data.defaultHour || 12,
				defaultMinute: data.defaultMinute || 0,
				enableSeconds: data.enableSeconds || false,
				hourIncrement: data.hourIncrement || 1,
				minuteIncrement: data.minuteIncrement || 5,
				noCalendar: data.noCalendar || false,
				weekNumbers: data.weekNumbers || false,
				dateFormat: enableTime ? `${dateFormat} ${timeFormat}` : dateFormat,
				defaultDate,
				disable: [] as string[],
				enable: [] as string[],
				enableTime,
				event: data.eventName,
				inline: true,
				locale,
				maxDate: transformNamedDate(data.maxDate) || "",
				minDate: transformNamedDate(data.minDate) || "",
				mode: data.mode || "single",
				static: true,
				time_24hr: data.time_24hr || false,
				parseDate: (dateString) => new Date(dateString),
				// if no custom formatting is defined, apply default formatting. es-PA is MM/dd/yyyy
				formatDate: !data.dateFormat
					? (date) =>
							new Intl.DateTimeFormat(
								"es-PA",
								enableTime
									? {
											hour: "numeric",
											minute: "2-digit",
											year: "numeric",
											month: "2-digit",
											day: "2-digit",
									  }
									: {}
							).format(date)
					: undefined,
			};

			const mask: string[] = [...(data.enable_disable || [])]
				// add special rule for weekends
				.map((dateString) => {
					if (dateString === "weekends") return isWeekendDate;

					return dateString;
				})
				// resolve relative date names like today, tomorrow or yesterday
				.map(transformNamedDate);

			if (!!data.wantDisable) {
				// add date mask as blacklist
				options.disable = mask;
			} else if (mask.length > 0) {
				// add date mask as whitelist
				options.enable = mask;
			}

			return options;
		};

		const dateButtonText =
			message.data._plugin.data.openPickerButtonText || "pick date";
		const cancelButtonText =
			message.data._plugin.data.cancelButtonText || "cancel";
		const submitButtonText =
			message.data._plugin.data.submitButtonText || "submit";

		const options = getOptionsFromMessage(message);

		let datepickerWasOpen = false;
		if (message.source === "bot") {
			datepickerWasOpen = processedMessages.has(message.traceId);
		}
		console.log("options:", options);
		if (!isFullscreen) {
			if (datepickerWasOpen) {
				return (
					<OpenDatepickerButton type="button" disabled>
						{dateButtonText}
					</OpenDatepickerButton>
				);
			}

			return (
				<OpenDatepickerButton type="button" onClick={onSetFullscreen}>
					{dateButtonText}
				</OpenDatepickerButton>
			);
		}

		return (
			<DatePickerRoot {...attributes} className="webchat-plugin-date-picker">
				<Header className="info webchat-plugin-date-picker-header">
					<h2>{options.event}</h2>
				</Header>
				<Content className="webchat-plugin-date-picker-content">
					<Flatpickr
						onChange={(dates, msg) => {
							console.log("msg:", msg, "dates:", dates);
							setMsg(msg);
						}}
						options={options}
					/>
				</Content>
				<Footer className="webchat-plugin-date-picker-footer">
					<CancelButton
						type="button"
						onClick={handleAbort}
						className="cancelButton"
					>
						{cancelButtonText}
					</CancelButton>
					<SubmitButton
						type="button"
						onClick={handleSubmit}
						className="submitButton"
					>
						{submitButtonText}
					</SubmitButton>
				</Footer>
				<p>{JSON.stringify(options)}</p>
			</DatePickerRoot>
		);
	};

	const plugin = {
		match: "date-picker",
		component: DatePicker,
	};

	return plugin;
};

registerMessagePlugin(datePickerPlugin);

export default datePickerPlugin;
