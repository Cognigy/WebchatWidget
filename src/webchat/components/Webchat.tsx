import * as React from 'react';
import { Options, WebchatClient } from '@cognigy/webchat-client';
import { Store } from 'redux';
import { StoreState, createWebchatStore } from '../store/store';
import { Provider } from 'react-redux';
import { ConnectedWebchatUI, FromProps } from './ConnectedWebchatUI';
import { MessagePlugin } from '../../common/interfaces/message-plugin';
import { sendMessage } from '../store/messages/message-middleware';
import { MessageSender } from '../../webchat-ui/interfaces';
import { setOpen, toggleOpen } from '../store/ui/ui-reducer';
import { IWebchatSettings } from '@cognigy/webchat-client/lib/interfaces/webchat-config';
import { loadConfig } from '../store/config/config-middleware';
import { connect } from '../store/connection/connection-middleware';

export interface WebchatProps extends FromProps {
    url: string;
    options?: Partial<Options>;
    settings?: IWebchatSettings;
    messagePlugins?: MessagePlugin[];
}

export class Webchat extends React.PureComponent<WebchatProps> {
    public store: Store<StoreState>;
    public client: WebchatClient;


    // component lifecycle methods
    constructor(props: WebchatProps) {
        super(props);

        const { url, options, settings } = props;

        const client = new WebchatClient(url, options);
        const store = createWebchatStore(client, settings);

        this.client = client;
        this.store = store;
    }

    componentDidMount() {
        this.store.dispatch(loadConfig());
    }

    componentWillUnmount() {
        this.client.disconnect();
    }

    get registerAnalyticsService() {
        return this.client.registerAnalyticsService.bind(this.client);
    }

    // component API (for usage via ref)
    connect = async () => {
        this.store.dispatch(connect());
    }

    sendMessage: MessageSender = (text, data, options) => {
        this.store.dispatch(sendMessage({ text, data }, options));
    }

    open = () => {
        this.store.dispatch(setOpen(true));
    }

    close = () => {
        this.store.dispatch(setOpen(false));
    }

    toggle = () => {
        this.store.dispatch(toggleOpen());
    }

    on = (event, handler) => {
        this.client.on(event, handler);
    }

    onMessage = (handler: (message) => void) => {
        this.client.on('output', handler);
    }

    render() {
        const { url, options, messagePlugins = [], inputPlugins = [], ...props } = this.props;

        return (
            <Provider store={this.store}>
                <ConnectedWebchatUI
                    {...props}
                    messagePlugins={messagePlugins}
                    inputPlugins={inputPlugins}
                    onEmitAnalytics={this.client.emitAnalytics.bind(this.client)}
                />
            </Provider>
        )
    }
}