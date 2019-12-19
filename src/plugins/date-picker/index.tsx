// Changelog:
// - Moment.js lib is removed. We spare 30% of the bunde size (260K);
// - We do NOT preselect any date for the user;

import * as React from "react";
import "./style.css";

// Flatpickr Datepicker
import Flatpickr from "react-flatpickr";
import "./flatpickr.css";

// languages
import l10n from "./langHelper";

import {
  MessageComponentProps,
  MessagePlugin,
  MessagePluginFactory
} from "../../common/interfaces/message-plugin";
import { createMessagePlugin, registerMessagePlugin } from "../helper";
import { IMessage, IBotMessage } from "../../common/interfaces/message";

const datePickerDaySelector =
  ".flatpickr-day.selected, .flatpickr-day.startRange, .flatpickr-day.endRange, .flatpickr-day.selected.inRange, .flatpickr-day.startRange.inRange, .flatpickr-day.endRange.inRange, .flatpickr-day.selected:focus, .flatpickr-day.startRange:focus, .flatpickr-day.endRange:focus, .flatpickr-day.selected:hover, .flatpickr-day.startRange:hover, .flatpickr-day.endRange:hover, .flatpickr-day.selected.prevMonthDay, .flatpickr-day.startRange.prevMonthDay, .flatpickr-day.endRange.prevMonthDay, .flatpickr-day.selected.nextMonthDay, .flatpickr-day.startRange.nextMonthDay, .flatpickr-day.endRange.nextMonthDay";

interface IState {
  msg: string;
}

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

/**
 * Transforms regional locales to flatpicks internal locale key
 */
const getMomemtLocaleId = (locale: string) => {
  switch (locale) {
    case "au":
      return "en-au";
    case "ca":
      return "en-ca";
    case "gb":
      return "en-gb";
    case "us":
      return "en";
  }

  return locale;
};

const datePickerPlugin: MessagePluginFactory = ({ styled }) => {
  const DatePickerRoot = styled.div(({ theme }) => ({
    [datePickerDaySelector]: {
      background: theme.primaryGradient,
      color: theme.primaryContrastColor
    }
  }));

  const Button = styled.button(({ theme }) => ({
    backgroundColor: theme.greyColor,
    color: theme.greyContrastColor,

    cursor: "pointer",
    border: "none",

    height: 40,

    padding: `${theme.unitSize}px ${theme.unitSize * 2}px`,
    borderRadius: theme.unitSize * 2
  }));

  const PrimaryButton = styled(Button)(({ theme }) => ({
    background: theme.primaryGradient,
    color: theme.primaryContrastColor
  }));

  const OutlinedButton = styled(Button)(({ theme }) => ({
    backgroundColor: "transparent",
    border: `1px solid ${theme.primaryColor}`,
    color: theme.primaryColor
  }));

  const SubmitButton = styled(PrimaryButton)(({ theme }) => ({
    flexGrow: 2,
    marginLeft: theme.unitSize * 2
  }));

  const CancelButton = styled(Button)(({ theme }) => ({
    flexGrow: 1
  }));

  const OpenDatepickerButton = styled(OutlinedButton)(({ theme }) => ({
    "&[disabled]": {
      borderColor: theme.greyColor,
      color: theme.greyColor,
      cursor: "default"
    }
  }));

  const Padding = styled.div(({ theme }) => ({
    paddingTop: theme.unitSize,
    paddingBottom: theme.unitSize,
    paddingLeft: theme.unitSize * 2,
    paddingRight: theme.unitSize * 2
  }));

  const Header = styled(Padding)(({ theme }) => ({
    background: theme.primaryGradient,
    color: theme.primaryContrastColor,
    flexGrow: 1,
    display: "flex",
    alignItems: "center",
    fontWeight: "bolder",
    boxShadow: theme.shadow,
    zIndex: 2
  }));

  const Content = styled(Padding)(({ theme }) => ({
    display: "flex",
    justifyContent: "center"
  }));

  const Footer = styled(Padding)(({ theme }) => ({
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "white",
    boxShadow: theme.shadow
  }));

  const processedMessages: Set<string> = new Set();

  class DatePicker extends React.Component<MessageComponentProps, IState> {
    constructor(props) {
      super(props);
      this.state = {
        msg: ""
      };
    }

    handleSubmit = () => {
      const { message } = this.props;

      if (this.state.msg.length > 0) {
        if (message.source === "bot") processedMessages.add(message.traceId);

        this.props.onSendMessage(this.state.msg, {
          _plugin: "date-picker",
          date: this.state.msg,
          unixDate: parseInt(
            (new Date(this.state.msg).getTime() / 1000).toFixed(0)
          )
        });
      } else {
        this.handleAbort();
      }
    };

    handleAbort = () => {
      this.props.onDismissFullscreen && this.props.onDismissFullscreen();
    };

    static isWeekend(date: string): boolean {
      const weekDay = new Date(date).getDay();
      return weekDay === 0 || weekDay === 6;
    }

    static transformDateString(dateStr: string): Date {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const tomorrow = new Date(today.setDate(today.getDate() + 1));
      const yesterday = new Date(today.setDate(today.getDate() - 1));

      if (dateStr === "today") return today;
      if (dateStr === "tomorrow") return tomorrow;
      if (dateStr === "yesterday") return yesterday;

      return new Date(dateStr);
    }

    static getOptionsFromMessage(message: IMessage) {
      const { data } = message.data._plugin;

      const localeId = data.locale || "us";
      const momentLocaleId = getMomemtLocaleId(localeId);
      const flatpickrLocaleId = getFlatpickrLocaleId(localeId);
      const locale = l10n[flatpickrLocaleId];
      const enableTime = data.enableTime;
      const filterDates = data.enable_disable || [];

      type DateOutputFormatCofig = {
        year: string;
        month: string;
        day: string;
        hour?: string;
        minute?: string;
      };

      let outputFormat: DateOutputFormatCofig = {
        year: "numeric",
        month: "2-digit",
        day: "2-digit"
      };

      if (enableTime)
        outputFormat = {
          ...outputFormat,
          hour: "2-digit",
          minute: "2-digit"
        };

      const options = {
        dateFormat: "YYYY-MM-DD",
        disable: [] as Array<Date | ((date: string) => boolean)>,
        enable: [] as Array<Date | ((date: string) => boolean)>,
        enableTime,
        event: data.eventName || "Pick a date",
        inline: true,
        locale,
        maxDate: DatePicker.transformDateString(data.maxDate) || "",
        minDate: DatePicker.transformDateString(data.minDate) || "",
        mode: data.mode || "single",
        static: true,
        time_24hr: data.time_24hr || false,
        formatDate: date =>
          new Date(date).toLocaleString(momentLocaleId, outputFormat)
      };

      const mask: Array<Date | ((date: string) => boolean)> = [
        ...filterDates
      ].map(date => {
        if (date === "weekends") return DatePicker.isWeekend;
        return DatePicker.transformDateString(date);
      });

      if (data.wantDisable) options.disable = mask;
      else options.enable = mask;

      return options;
    }

    render() {
      const {
        onSendMessage,
        message,
        config,
        attributes,
        isFullscreen,
        onSetFullscreen
      } = this.props;

      let dateButtonText =
        message.data._plugin.data.openPickerButtonText || "pick date";
      let cancelButtonText =
        message.data._plugin.data.cancelButtonText || "cancel";
      let submitButtonText =
        message.data._plugin.data.submitButtonText || "submit";

      const options = DatePicker.getOptionsFromMessage(message);

      let datepickerWasOpen = false;
      if (message.source === "bot") {
        datepickerWasOpen = processedMessages.has(message.traceId);
      }

      if (!isFullscreen) {
        if (datepickerWasOpen) {
          return (
            <OpenDatepickerButton disabled>
              {dateButtonText}
            </OpenDatepickerButton>
          );
        }

        return (
          <OpenDatepickerButton onClick={onSetFullscreen}>
            {dateButtonText}
          </OpenDatepickerButton>
        );
      }

      return (
        <DatePickerRoot
          {...attributes}
          style={{ display: "flex", flexDirection: "column" }}
        >
          <Header className="info">
            <h2>{options.event}</h2>
          </Header>
          <Content>
            <Flatpickr
              onChange={(dates, msg) => {
                console.log(dates);
                console.log(msg);
                this.setState({ msg });
              }}
              options={options}
            />
          </Content>
          <Footer>
            <CancelButton onClick={this.handleAbort} className="cancelButton">
              {cancelButtonText}
            </CancelButton>
            <SubmitButton onClick={this.handleSubmit} className="submitButton">
              {submitButtonText}
            </SubmitButton>
          </Footer>
        </DatePickerRoot>
      );
    }
  }

  const plugin = {
    match: "date-picker",
    component: DatePicker
  };

  return plugin;
};

registerMessagePlugin(datePickerPlugin);

export default datePickerPlugin;
