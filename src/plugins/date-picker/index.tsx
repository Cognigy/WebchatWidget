import * as React from "react";
import "./style.css";

import Flatpickr from "react-flatpickr";
import "./flatpickr.css";

import { makeFlatpickrConfig } from "./flatpickrAdapter";

import {
  MessageComponentProps,
  MessagePluginFactory
} from "../../common/interfaces/message-plugin";

import { registerMessagePlugin } from "../helper";
import { formatISO } from "date-fns";

const datePickerDaySelector =
  ".flatpickr-day.selected, .flatpickr-day.startRange, .flatpickr-day.endRange, .flatpickr-day.selected.inRange, .flatpickr-day.startRange.inRange, .flatpickr-day.endRange.inRange, .flatpickr-day.selected:focus, .flatpickr-day.startRange:focus, .flatpickr-day.endRange:focus, .flatpickr-day.selected:hover, .flatpickr-day.startRange:hover, .flatpickr-day.endRange:hover, .flatpickr-day.selected.prevMonthDay, .flatpickr-day.startRange.prevMonthDay, .flatpickr-day.endRange.prevMonthDay, .flatpickr-day.selected.nextMonthDay, .flatpickr-day.startRange.nextMonthDay, .flatpickr-day.endRange.nextMonthDay";

interface State {
  valid: boolean;
}

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
    color: theme.primaryContrastColor,
    "&[disabled]": {
      background: theme.greyColor,
      color: theme.greyContrastColor
    }
  }));

  const OutlinedButton = styled(Button)(({ theme }) => ({
    backgroundColor: "transparent",
    border: `1px solid ${theme.primaryColor}`,
    color: theme.primaryColor,
    "&[disabled]": {
      borderColor: theme.greyColor,
      color: theme.greyColor,
      cursor: "default"
    }
  }));

  const SubmitButton = styled(PrimaryButton)(({ theme }) => ({
    flexGrow: 2,
    marginLeft: theme.unitSize * 2
  }));

  const CancelButton = styled(Button)(({ theme }) => ({
    flexGrow: 1
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

  class DatePicker extends React.PureComponent<MessageComponentProps, State> {
    pluginConfig = this.props.message.data._plugin.data;

    data = {
      msg: "",
      dates: [],
      isRange: this.pluginConfig.mode === "range",
      offset: new Date().getTimezoneOffset()
    };

    constructor(props) {
      super(props);
      this.state = {
        valid: false
      };
    }

    static validate(mode: string, dates: any): boolean {
      if (mode === "single") return dates.length === 1;
      if (mode === "range") return dates.length === 2;
      if (mode === "multiple") return dates.length > 0;

      return false;
    }

    handleSubmit = (): void => {
      const { message } = this.props;
      if (message.source === "bot") {
        processedMessages.add(message.traceId);
      }

      this.props.onSendMessage(this.data.msg, {
        _plugin: "date-picker",
        isRange: this.data.isRange,
        dates: this.data.dates.map(date => formatISO(date)),
        userTimeZoneOffset: this.data.offset
      });
    };

    handleAbort = () => {
      this.props.onDismissFullscreen && this.props.onDismissFullscreen();
    };

    render() {
      const {
        onSendMessage,
        message,
        config,
        attributes,
        isFullscreen,
        onSetFullscreen
      } = this.props;

      const dateButtonText =
        this.pluginConfig.openPickerButtonText || "pick date";
      const cancelButtonText = this.pluginConfig.cancelButtonText || "cancel";
      const submitButtonText = this.pluginConfig.submitButtonText || "submit";

      const options = makeFlatpickrConfig(this.pluginConfig);

      const handleChoiceChange = (dates, msg) => {
        this.data = {
          ...this.data,
          msg,
          dates
        };
        this.setState({
          valid: DatePicker.validate(this.pluginConfig.mode, this.data.dates)
        });
      };

      let datepickerWasOpen = false;
      if (message.source === "bot") {
        datepickerWasOpen = processedMessages.has(message.traceId);
      }

      if (!isFullscreen) {
        return (
          <OutlinedButton
            onClick={onSetFullscreen}
            disabled={datepickerWasOpen}
          >
            {dateButtonText}
          </OutlinedButton>
        );
      }

      return (
        <DatePickerRoot
          {...attributes}
          style={{ display: "flex", flexDirection: "column" }}
        >
          <Header>
            <h2>{options.event}</h2>
          </Header>

          <Content>
            <Flatpickr onChange={handleChoiceChange} options={options} />
          </Content>

          <Footer>
            <CancelButton onClick={this.handleAbort}>
              {cancelButtonText}
            </CancelButton>

            <SubmitButton
              onClick={this.handleSubmit}
              disabled={!this.state.valid}
            >
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
