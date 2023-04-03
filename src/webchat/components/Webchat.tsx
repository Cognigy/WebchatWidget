import * as React from 'react';
import { Store } from 'redux';
import { StoreState, createWebchatStore } from '../store/store';
import { Provider } from 'react-redux';
import { ConnectedWebchatUI, FromProps } from './ConnectedWebchatUI';
import { MessagePlugin } from '../../common/interfaces/message-plugin';
import { sendMessage } from '../store/messages/message-middleware';
import { MessageSender } from '../../webchat-ui/interfaces';
import { setOpen, toggleOpen } from '../store/ui/ui-reducer';
import { loadConfig } from '../store/config/config-middleware';
import { connect } from '../store/connection/connection-middleware';
import { EventEmitter } from 'events';
import { SocketClient } from '@cognigy/socket-client';
import { getEndpointBaseUrl, getEndpointUrlToken } from '../helper/endpoint';
import { IWebchatSettings } from '../../common/interfaces/webchat-config';
import { Options } from '@cognigy/socket-client/lib/interfaces/options';
import { updateSettings } from '../store/config/config-reducer';
import { createOutputHandler } from '../store/messages/message-handler';

export interface WebchatProps extends FromProps {
    url: string;
    options?: Partial<Options>;
    settings?: IWebchatSettings;
    messagePlugins?: MessagePlugin[];
}

export class Webchat extends React.PureComponent<WebchatProps> {
    public store: Store<StoreState>;
    public client: SocketClient;
    public analytics: EventEmitter = new EventEmitter();
    public _handleOutput: (output: unknown) => void;


    // component lifecycle methods
    constructor(props: WebchatProps) {
        super(props);

        const { url, options, settings } = props;

        const baseUrl = getEndpointBaseUrl(url);
        const token = getEndpointUrlToken(url);
        const socketOptions = {
            channel: 'webchat-client',
            ...options
        }

        const client = new SocketClient(baseUrl, token, socketOptions);
        this.client = client;
        console.log('constructor');
        const store = createWebchatStore(this, url, settings);
        this.store = store;

        this._handleOutput = createOutputHandler(this.store);
    }

    componentDidMount() {
        console.log('mount');
        this.store.dispatch(loadConfig());
        console.log(this.store.getState().config.settings.businessHours.enabled)
    }

    componentWillUnmount() {
        this.client.disconnect();
    }

    registerAnalyticsService(handler: (event: { type: string; payload?: any; }) => void) {
        this.analytics.on('analytics-event', handler);
    }

    emitAnalytics = (type: string, payload?: any) => {
        this.analytics.emit('analytics-event', {
            type,
            payload
        });
    }

    // component API (for usage via ref)
    connect = async () => {
        this.store.dispatch(connect());
    }

    sendMessage: MessageSender = (text, data, options) => {
        this.store.dispatch(sendMessage({ text, data }, options));
    }

    open = () => {
        console.log('open');
        console.log(this.store.getState().config.settings)
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

    updateSettings = (settings: IWebchatSettings) => {
        this.store.dispatch(updateSettings(settings));
    }

    render() {
        const { url, options, messagePlugins = [], inputPlugins = [], ...props } = this.props;

        return (
            <Provider store={this.store}>
                <ConnectedWebchatUI
                    {...props}
                    messagePlugins={messagePlugins}
                    inputPlugins={inputPlugins}
                    onEmitAnalytics={this.emitAnalytics}
                />
            </Provider>
        )
    }
}