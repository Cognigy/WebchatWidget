import * as React from "react";
import "./style.css";

// Flatpickr Datepicker
import Flatpickr from './components/react-flatpickr';
import './flatpickr.css';

// languages
import l10n from './langHelper';
import moment from 'moment';

import { MessageComponentProps, MessagePlugin, MessagePluginFactory } from "../../common/interfaces/message-plugin";
import { createMessagePlugin, registerMessagePlugin } from "../helper";
import { IMessage } from "../../common/interfaces/message";
import uuid from "uuid"

const datePickerDaySelector = ".flatpickr-day.selected, .flatpickr-day.startRange, .flatpickr-day.endRange, .flatpickr-day.selected.inRange, .flatpickr-day.startRange.inRange, .flatpickr-day.endRange.inRange, .flatpickr-day.selected:focus, .flatpickr-day.startRange:focus, .flatpickr-day.endRange:focus, .flatpickr-day.selected:hover, .flatpickr-day.startRange:hover, .flatpickr-day.endRange:hover, .flatpickr-day.selected.prevMonthDay, .flatpickr-day.startRange.prevMonthDay, .flatpickr-day.endRange.prevMonthDay, .flatpickr-day.selected.nextMonthDay, .flatpickr-day.startRange.nextMonthDay, .flatpickr-day.endRange.nextMonthDay";

interface IState {
  msg: string,
}


/**
 * Transforms regional locales to flatpicks internal locale key
 */
const getFlatpickrLocaleId = (locale: string) => {
  switch (locale) {
    case 'us':
    case 'gb':
    case 'au':
    case 'ca':
      return 'en';
  }

  return locale;
}

/**
 * Transforms regional locales to flatpicks internal locale key
 */
const getMomemtLocaleId = (locale: string) => {
  switch (locale) {
    case 'au':
      return 'en-au';
    case 'ca':
      return 'en-ca';
    case 'gb':
      return 'en-gb';
    case 'us':
      return 'en';
  }

  return locale;
}

const datePickerPlugin: MessagePluginFactory = ({ styled }) => {


  const DatePickerRoot = styled.div(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    flexGrow: 1,
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
    "&:focus": {
        outline: "none",
        boxShadow: `0 0 4px 3px ${theme.primaryWeakColor}` 
    }
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
	},
	'&:focus':{
		outline: 'none',
		boxShadow: `0 0 3px 1px ${theme.primaryWeakColor}`
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

  const Content = styled.div(({ theme }) => ({
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
    submitButtonRef: React.RefObject<HTMLButtonElement>;
    cancelButtonRef: React.RefObject<HTMLButtonElement>;

    constructor(props) {
      super(props);
      this.state = {
        msg: "",
      };
      this.submitButtonRef = React.createRef();
      this.cancelButtonRef = React.createRef();
    }

    componentDidMount() {
      const webchatWindow = document.getElementById("webchatWindow");
      const calenderElement = webchatWindow?.getElementsByClassName("flatpickr-calendar")?.[0] as HTMLElement;
      // Auto-focus the calender item on mount
      calenderElement?.focus();
      // Include the calender item to tab order
      calenderElement?.setAttribute("tabIndex", "0");
      calenderElement?.setAttribute("aria-labelledby", "webchatDatePickerHeaderLabel");

      // Add tabIndex 0 to time input fields to include them in the tab order
      const hourField = webchatWindow?.getElementsByClassName("flatpickr-hour")?.[0] as HTMLElement;
      hourField?.setAttribute("tabIndex", "0");
      const minutesField = webchatWindow?.getElementsByClassName("flatpickr-minute")?.[0] as HTMLElement;
      minutesField?.setAttribute("tabIndex", "0");
      const secondsField = webchatWindow?.getElementsByClassName("flatpickr-second")?.[0] as HTMLElement;
      secondsField?.setAttribute("tabIndex", "0");
      const amPmField = webchatWindow?.getElementsByClassName("flatpickr-am-pm")?.[0] as HTMLElement;
      amPmField?.setAttribute("tabIndex", "0");
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

    onKeyDown = (event) => {
      const webchatWindow = document.getElementById("webchatWindow");
      const calenderElements = webchatWindow?.getElementsByClassName("flatpickr-calendar");
      const calender = calenderElements?.[0] as HTMLElement;
      const datePickerSubmitButton = this.submitButtonRef?.current;
      const datePickerCancelButton = this.cancelButtonRef?.current;

      const tabKeyPress = !event.shiftKey && event.key === "Tab";
      const shiftTabKeyPress = event.shiftKey && event.key === "Tab";

      // Find last input field of time picker
      const { data } = this.props.message.data._plugin;
      const secondsAsLastTimeInput = !!data.enableTime && data.time_24hr && data.enableSeconds;
      const minutesAsLastTimeInput = !!data.enableTime && data.time_24hr && !data.enableSeconds;
      const amPmAsLastTimeInput = !!data.enableTime && !data.time_24hr;

      // Time input fields
      const hourField = webchatWindow?.getElementsByClassName("flatpickr-hour")?.[0] as HTMLElement;
      const minutesField = webchatWindow?.getElementsByClassName("flatpickr-minute")?.[0] as HTMLElement;
      const secondsField = webchatWindow?.getElementsByClassName("flatpickr-second")?.[0] as HTMLElement;
      const amPmField = webchatWindow?.getElementsByClassName("flatpickr-am-pm")?.[0] as HTMLElement;

      // Check if last time input field is focused
      const isLastTimeInputFieldFocused = 
        (minutesAsLastTimeInput && event.target === minutesField) ||
        (secondsAsLastTimeInput && event.target === secondsField) ||
        (amPmAsLastTimeInput && event.target === amPmField)

      // Close Date picker on pressing Escape
      if(event.key === "Esc" || event.key === "Escape") {
        this.handleAbort();
      }
      
      // Focus should be trapped within date-picker
      // Handle Tab Navigation
      if (tabKeyPress) {
        if(event.target === datePickerSubmitButton) {
            event.preventDefault();
            calender?.focus(); // Move focus to calender from submit button
        } else if(isLastTimeInputFieldFocused) {
            event.preventDefault();
            datePickerCancelButton?.focus(); // Move focus to cancel button from last time input field
        }        
      }
      // Handle Reverse Tab Navigation
      if (shiftTabKeyPress) {
          if(event.target === calender) {
            event.preventDefault();
            datePickerSubmitButton?.focus(); // Move focus to Submit button from calender
          } else if(event.target === hourField) {
            event.preventDefault();
            calender?.focus(); // Move focus to calender from hour input field
          }
        
      }
    }

    static isWeekendDate(date: string) {
      const isoWeekday = moment(date).isoWeekday();

      switch (isoWeekday) {
        // 6 is saturday
        case 6:
        // 7 is sunday
        case 7:
          return true;
      }

      return false;
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

      const dateFormat = data.dateFormat || 'YYYY-MM-DD';
      const defaultDate = DatePicker.transformNamedDate(data.defaultDate)
        || DatePicker.transformNamedDate(data.minDate)
        || undefined;

      const localeId = data.locale || 'us';
      const momentLocaleId = getMomemtLocaleId(localeId);
      const flatpickrLocaleId = getFlatpickrLocaleId(localeId);
      let locale = l10n[flatpickrLocaleId];
      const enableTime = !!data.enableTime;
      const timeTemp = data.time_24hr ? 'H:i' : 'h:i'; //12-hour format without AM/PM
      const timeWithSeconds = data.enableSeconds ? `${timeTemp}:S` : timeTemp;
      const timeFormat = data.time_24hr ? timeWithSeconds :`${timeWithSeconds} K` //12-hour format with AM/PM
      
      if ( localeId === 'gb' ) locale = { ...locale, firstDayOfWeek: 1 };
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
        disable: [] as any[],
        enable: [] as any[],
        enableTime,
        event: data.eventName,
        inline: true,
        locale,
        maxDate: DatePicker.transformNamedDate(data.maxDate) || '',
        minDate: DatePicker.transformNamedDate(data.minDate) || '',
        mode: data.mode || 'single',
        static: true,
        time_24hr: data.time_24hr || false,
        parseDate: dateString => moment(dateString).toDate(),
        // if no custom formatting is defined, apply default formatting
        formatDate: !data.dateFormat
          ? date => moment(date).locale(momentLocaleId).format(enableTime ? 'L LT' : 'L')
          : undefined
      };

      const mask: any[] = [...(data.enable_disable || [])]
        // add special rule for weekends
        .map(dateString => {
          if (dateString === 'weekends')
            return DatePicker.isWeekendDate

          return dateString;
        })
        // resolve relative date names like today, tomorrow or yesterday
        .map(DatePicker.transformNamedDate);
        
	  // the code in function_enable_disable was executed in a vm to check that its return value is from type boolean
      if (data?.function_enable_disable?.length > 0) {
        try {
          const flatpickrFn = new Function(`"use strict"; return  ${data.function_enable_disable}`)();        
          /* The Flatpickr function takes in a Date object */
          if (typeof flatpickrFn(new Date()) === "boolean") {            
            mask.push(flatpickrFn);                  
          }
        } catch (e) { }     
       }

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

      const datePickerHeading = `webchatDatePickerHeading-${uuid.v4()}`;
      const datePickerDescription = `webchatDatePickerContentDescription-${uuid.v4()}`;

      const a11yProps = {role:"dialog", "aria-modal":"true", "aria-labelledby": datePickerHeading, "aria-describedby": datePickerDescription};

      const options = DatePicker.getOptionsFromMessage(message);

      let datepickerWasOpen = false;
      if (message.source === 'bot') {
        datepickerWasOpen = processedMessages.has(message.traceId);
      }

      if (!isFullscreen) {
        if (datepickerWasOpen) {
          return <OpenDatepickerButton type="button" disabled>{dateButtonText}</OpenDatepickerButton>
        }

        return <OpenDatepickerButton type="button" onClick={onSetFullscreen}>{dateButtonText}</OpenDatepickerButton>
      }

      return (
        <DatePickerRoot {...attributes} className="webchat-plugin-date-picker" onKeyDown={this.onKeyDown} {...a11yProps}>
          <Header className="info webchat-plugin-date-picker-header">
            <h2 id={datePickerHeading}>{options.event}</h2>
            <span className="sr-only" id={datePickerDescription}>
                Please use Left/ Right arrows to move focus to previous/ next day.
                Please use Up/ Down arrows to move focus to the same day of previous/ next week.
                Please use Control + Left/ Right arrows to change the grid of dates to previous/ next month.
                Please use Control + Up/ Down arrows to change the grid of dates to previous/ next year.
            </span>
          </Header>
          <Content className="webchat-plugin-date-picker-content">
            <Flatpickr
              onChange={(dates, msg) => { this.setState({ msg }) }}
              options={
                options
              }
            />
          </Content>
          <Footer className="webchat-plugin-date-picker-footer">
            <CancelButton type="button" onClick={this.handleAbort} className="cancelButton" ref={this.cancelButtonRef}>
              {cancelButtonText}
            </CancelButton>
            <SubmitButton type="button" onClick={this.handleSubmit} className="submitButton" ref={this.submitButtonRef}>
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
  }

  return plugin;
}

registerMessagePlugin(datePickerPlugin);

export default datePickerPlugin;
