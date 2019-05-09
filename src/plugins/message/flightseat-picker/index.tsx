import * as React from "react";
import Seatmap from './components/Seatmap.jsx';
import './style/style.css';
import { MessageComponentProps, MessagePlugin, MessagePluginFactory } from "../../../common/interfaces/message-plugin";
import { createMessagePlugin, registerMessagePlugin } from "../../helper";

interface State {
  selectedSeats: any[];
}

const flightSeatPickerPlugin: MessagePluginFactory = ({ styled }) => {

  const Root = styled.div(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',

    '.Seat': {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',

      width: theme.unitSize * 5,
      height: theme.unitSize * 5,
      color: theme.greyContrastColor,

      margin: theme.unitSize / 2,

      borderWidth: 1,
      borderColor: theme.greyColor,
      borderStyle: 'solid',
      borderRadius: theme.unitSize,

      userSelect: 'none',
    },

    '.Seat--enabled': {
      backgroundColor: theme.greyColor,
      color: theme.greyContrastColor,
      cursor: 'pointer',

      '&:hover': {
        borderColor: theme.primaryColor,
        color: theme.primaryColor,
        backgroundColor: 'transparent'
      },
    },

    '.Seat--selected': {
      background: theme.primaryGradient,
      color: theme.primaryContrastColor,
      cursor: 'pointer',

      '&:hover': {
        backgroundColor: theme.primaryStrongColor
      }
    },

    '.Seat--reserved': {
      color: theme.greyContrastColor,

      cursor: 'not-allowed',

      opacity: .5
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
    flexDirection: 'column',
    justifyContent: 'center',
    boxShadow: theme.shadow,
    zIndex: 2
  }));

  const NotFullscreen = styled.button(({ theme }) => ({
    backgroundColor: theme.primaryColor,
    color: theme.primaryContrastColor,
    border: "none",
    fontSize: "100%",
    fontFamily: "Helvetica",
    borderRadius: "10px",
    boxShadow: "0 8px 16px 0 rgba(0,0,0,0.2), 0 6px 20px 0 rgba(0,0,0,0.19)",
    height: "40px"

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

  const OutlinedButton = styled(Button)(({ theme }) => ({
    backgroundColor: 'transparent',
    border: `1px solid ${theme.primaryColor}`,
    color: theme.primaryColor
  }));

  const OpenFlightseatPickerButton = styled(OutlinedButton)(({ theme }) => ({
    '&[disabled]': {
      borderColor: theme.greyColor,
      color: theme.greyColor,
      cursor: 'default'
    }
  }));

  const PrimaryButton = styled(Button)(({ theme }) => ({
    background: theme.primaryGradient,
    color: theme.primaryContrastColor,
  }));

  const SubmitButton = styled(PrimaryButton)(({ theme }) => ({
    flexGrow: 2,
    marginLeft: theme.unitSize * 2
  }));

  const CancelButton = styled(Button)(({ theme }) => ({
    flexGrow: 1
  }));

  const Footer = styled(Padding)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    boxShadow: theme.shadow,
  }));

  const Content = styled(Padding)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'center',
    flexGrow: 1,
    flexShrink: 0
  }))

  const HeaderTitle = styled.h1(({ theme }) => ({
    fontSize: '2em'
  }));

  const Table = styled.table(({ theme }) => ({}));

  const TableRow = styled.tr(({ theme }) => ({}));

  const TableHead = styled.td(({ theme }) => ({
    width: '33.3%',
    color: theme.primaryContrastColor,
    opacity: .8,
  }));

  const TableColumn = styled.td(({ theme }) => ({
    width: '66.6%',
    color: theme.primaryContrastColor,
  }));

  class FlightseatPicker extends React.Component<MessageComponentProps, State> {
    constructor(props) {
      super(props);
      this.state = {
        selectedSeats: []
      };
    }

    handleAddSeat = (row, number) => {
      const selectedSeats = [...this.state.selectedSeats, [row, number]];

      this.setState({
        selectedSeats
      });
    }

    handleRemoveSeat = (row, number) => {
      /* 
       TODO: You cannot chose two or more seats in the same row or column. Only diagonal is possible yet.
      */
      this.setState({
        selectedSeats: this.state.selectedSeats.filter((currentSeat) => {
          return currentSeat[0] !== row && currentSeat[1] !== number
        })
      });
    }

    handleSubmit = () => {
      this.props.onSendMessage(`Row ${this.state.selectedSeats[0][0]}, Seat ${this.state.selectedSeats[0][1]}`, {
        _plugin: "flightseat-picker",
        selectedSeats: this.state.selectedSeats,
        abort: false
      });
    }

    handleAbort = () => {
      this.props.onDismissFullscreen();
    }

    render() {
      const { onSendMessage, message, config, attributes, isFullscreen, onSetFullscreen } = this.props;

      let rows = []
      let numbermaxReservableSeats = 1
      let airplane = "A420"
      let fromCity = "Düsseldorf"
      let toCity = "San Francisco"

      try {
        rows = message.data._plugin.data.rows;
        numbermaxReservableSeats = message.data._plugin.data.numbermaxReservableSeats;
        airplane = message.data._plugin.data.airplane;
        fromCity = message.data._plugin.data.from;
        toCity = message.data._plugin.data.to;
      } catch (e) {

      }

      if (!isFullscreen) {
        return (
          <OpenFlightseatPickerButton
            onClick={() => this.props.onSetFullscreen()}
          >
            Pick a Seat
          </OpenFlightseatPickerButton>
        );
      }

      return (
        <Root {...this.props.attributes}>
          <Header>
            <HeaderTitle>{fromCity} ✈️ {toCity}</HeaderTitle>
            <Table>
              <TableRow>
                <TableHead>Plane model</TableHead>
                <TableColumn>{airplane}</TableColumn>
              </TableRow>
              <TableRow>
                <TableHead>Seat count</TableHead>
                <TableColumn>{numbermaxReservableSeats}</TableColumn>
              </TableRow>
            </Table>
          </Header>
          <Content>
            <Seatmap addSeatCallback={this.handleAddSeat} removeSeatCallback={this.handleRemoveSeat} rows={rows} maxReservableSeats={numbermaxReservableSeats} />
          </Content>
          <Footer>
            <CancelButton onClick={this.handleAbort}>cancel</CancelButton>
            <SubmitButton onClick={this.handleSubmit} disabled={this.state.selectedSeats.length === 0}>submit</SubmitButton>
          </Footer>
        </Root>
      );
    }

  }
  const plugin = {
    match: "flightseat-picker",
    component: FlightseatPicker,
    options: {}
  }
  return plugin

}

registerMessagePlugin(flightSeatPickerPlugin);

export default flightSeatPickerPlugin;