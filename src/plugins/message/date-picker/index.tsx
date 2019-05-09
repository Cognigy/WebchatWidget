import * as React from "react";
import "./style.css";

// Flatpickr Datepicker
import Flatpickr from './components/react-flatpickr';
import './flatpickr.css';

// languages
import l10n from './langHelper';
import moment from 'moment';

import { MessageComponentProps, MessagePlugin, MessagePluginFactory } from "../../../common/interfaces/message-plugin";
import { createMessagePlugin, registerMessagePlugin } from "../../helper";
import { IMessage } from "../../../common/interfaces/message";

const datePickerDaySelector = ".flatpickr-day.selected, .flatpickr-day.startRange, .flatpickr-day.endRange, .flatpickr-day.selected.inRange, .flatpickr-day.startRange.inRange, .flatpickr-day.endRange.inRange, .flatpickr-day.selected:focus, .flatpickr-day.startRange:focus, .flatpickr-day.endRange:focus, .flatpickr-day.selected:hover, .flatpickr-day.startRange:hover, .flatpickr-day.endRange:hover, .flatpickr-day.selected.prevMonthDay, .flatpickr-day.startRange.prevMonthDay, .flatpickr-day.endRange.prevMonthDay, .flatpickr-day.selected.nextMonthDay, .flatpickr-day.startRange.nextMonthDay, .flatpickr-day.endRange.nextMonthDay";

interface IState {
  msg: string,
}

const datePickerPlugin: MessagePluginFactory = ({ styled }) => {


  const DatePickerRoot = styled.div(({ theme }) => ({
    [datePickerDaySelector]: {
      background: theme.primaryGradient,
      color: theme.primaryContrastColor,
    }
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
    backgroundColor: 'transparent',
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
    '&[disabled]': {
      borderColor: theme.greyColor,
      color: theme.greyColor,
      cursor: 'default'
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
    display: 'flex',
    alignItems: 'center',
    fontWeight: 'bolder',
    boxShadow: theme.shadow,
    zIndex: 2
  }));

  const Content = styled(Padding)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'center',
  }))

  const Footer = styled(Padding)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    boxShadow: theme.shadow,
  }));

  const processedMessages: Set<string> = new Set();

  class DatePicker extends React.Component<MessageComponentProps, IState> {
    constructor(props) {
      super(props);
      this.state = {
        msg: "",
      };
    }

    handleSubmit = () => {
      const { message } = this.props

      // close plugin if user didn't choose a date
      if (this.state.msg.length > 0) {
        if (message.source === 'bot')
          processedMessages.add(message.traceId);

        setTimeout(() => {
          this.props.onSendMessage(this.state.msg), {
            _plugin: "date-picker",
            date: this.state.msg,
          }
        }, 300);
      } else {
        this.props.onDismissFullscreen();
      }

    };

    handleAbort = () => {
      const { message } = this.props;

      this.props.onDismissFullscreen();
    }

    static isWeekendDate(date: string) {
      // 1 is monday
      // 7 is sunday
      return [1, 7].includes(moment(date).isoWeekday());
    }

    static transformNamedDate(namedDate: string) {
      switch (namedDate) {
        case "today":
          return moment().format('YYYY-MM-DD');

        case "tomorrow":
          return moment().add(1, 'days').format('YYYY-MM-DD');

        case "yesterday":
          return moment().add(-1, 'days').format('YYYY-MM-DD');
      }

      return namedDate
    }

    static getOptionsFromMessage(message: IMessage) {
      const { data } = message.data._plugin;

      const options = {
        dateFormat: data.dateFormat || 'YYYY-MM-DD',
        defaultDate: DatePicker.transformNamedDate(data.defaultDate)
          || DatePicker.transformNamedDate(data.minDate)
          || moment().format('YYYY-MM-DD'),
        disable: [] as string[],
        enable: [] as string[],
        enableTime: data.enableTime || true,
        event: data.eventName || 'Pick a date',
        inline: true,
        locale: data.locale || l10n['en'],
        maxDate: DatePicker.transformNamedDate(data.maxDate) || '',
        minDate: DatePicker.transformNamedDate(data.minDate) || '',
        mode: data.mode || 'single',
        static: true,
        time_24hr: data.time_24hr || false,
        parseDate: dateString => moment(dateString).toDate(),
        formatDate: date => moment(date).format('YYYY/MM/DD')
      };

      if (options.enableTime) {
        options.formatDate = date => moment(date).format('YYYY/MM/DD HH:mm')
      }

      const mask: string[] = [...(data.enable_disable || [])]
        // add special rule for weekends
        .map(dateString => {
          if (dateString === 'weekends')
            return DatePicker.isWeekendDate

          return dateString;
        })
        // resolve relative date names like today, tomorrow or yesterday
        .map(DatePicker.transformNamedDate);

      if (!!data.wantDisable) {
        // add date mask as blacklist
        options.disable = mask;
      } else if (mask.length > 0) {

        // add date mask as whitelist
        options.enable = mask;
      }

      return options;
    }

    render() {
      const { onSendMessage, message, config, attributes, isFullscreen, onSetFullscreen } = this.props;


      let dateButtonText = message.data._plugin.data.openPickerButtonText || 'pick date';
      let cancelButtonText = message.data._plugin.data.cancelButtonText || 'cancel';
      let submitButtonText = message.data._plugin.data.submitButtonText || 'submit';

      const options = DatePicker.getOptionsFromMessage(message);

      let datepickerWasOpen = false;
      if (message.source === 'bot') {
        datepickerWasOpen = processedMessages.has(message.traceId);
      }

      if (!isFullscreen) {
        if (datepickerWasOpen) {
          return <OpenDatepickerButton disabled>{dateButtonText}</OpenDatepickerButton>
        }

        return <OpenDatepickerButton onClick={onSetFullscreen}>{dateButtonText}</OpenDatepickerButton>
      }

      return (
        <DatePickerRoot {...attributes} style={{ display: "flex", flexDirection: "column" }}>
          <Header className="info">
            <h2>{options.event}</h2>
          </Header>
          <Content>
            <Flatpickr
              onChange={(dates, msg) => { this.setState({ msg }) }}
              options={
                options
              }
            />
          </Content>
          <Footer>
            <CancelButton onClick={this.handleAbort} className="cancelButton">{cancelButtonText}</CancelButton>
            <SubmitButton onClick={this.handleSubmit} className="submitButton">{submitButtonText}</SubmitButton>
          </Footer>
        </DatePickerRoot>
      );
    }
  }

  const plugin = {
    match: "date-picker",
    component: DatePicker
  }

  return plugin;
}

registerMessagePlugin(datePickerPlugin);

export default datePickerPlugin;
