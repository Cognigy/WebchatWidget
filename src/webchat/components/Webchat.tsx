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
import { isDisabledDueToMaintenance } from '../helper/maintenance';
import { isDisabledOutOfBusinessHours } from '../helper/businessHours';
import { isDisabledDueToConnectivity } from '../helper/connectivity';
import { createNotification } from '../../webchat-ui/components/presentational/Notifications';
import { syncStorage } from '../store/previous-conversations/previous-conversations-middleware';

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
        const store = createWebchatStore(this, url, settings);
        this.store = store;

        this._handleOutput = createOutputHandler(this.store);
    }

    // TODO: activate this listener only if needed by specs
    // It requires changes on options-middleware in order to avoid infinite loop
    // componentDidMount() {
    //     window.addEventListener('storage', this.syncStorage);
    // }

    componentWillMount() {
        this.store.dispatch(loadConfig());    
    }

    componentWillUnmount() {
        this.client.disconnect();
        // window.removeEventListener('storage', this.syncStorage);
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

    syncStorage = (e: StorageEvent) => {
        this.store.dispatch(syncStorage(e?.key));
    }

    // component API (for usage via ref)
    connect = async () => {
        this.store.dispatch(connect());
    }

    sendMessage: MessageSender = (text, data, options) => {
        this.store.dispatch(sendMessage({ text, data }, options));
    }

    open = async () => {
        if(this.store.getState().config.settings.awaitEndpointConfig){
            const timeout = this.store.getState().config.settings.connectivity?.enabled && this.store.getState().config.settings.connectivity?.timeout|| 1000;
            let timeoutReached = false;
            let timeoutCounter = 0;
            while (!this.store.getState().config.isConfigLoaded && !timeoutReached) {
                await new Promise(f => setTimeout(f, 50));
                timeoutCounter += 50;
                if(timeoutCounter >= timeout){
                    timeoutReached = true;
                }
            }
            if(this.store.getState().config.settings.connectivity?.enabled && !isDisabledDueToMaintenance(this.store.getState().config.settings) && !isDisabledOutOfBusinessHours(this.store.getState().config.settings.businessHours) && !isDisabledDueToConnectivity(this.store.getState().config.settings, timeoutReached)){
                this.store.dispatch(setOpen(true));
            }else if(!this.store.getState().config.settings.connectivity?.enabled && !isDisabledDueToMaintenance(this.store.getState().config.settings) && !isDisabledOutOfBusinessHours(this.store.getState().config.settings.businessHours)){
                this.store.dispatch(setOpen(true));
            }
            
        }else{
            this.store.dispatch(setOpen(true));
        }
    }

    close = () => {
        this.store.dispatch(setOpen(false));
    }

    toggle = () => {
        this.store.dispatch(toggleOpen());
    }

    showNotification = (message: string) => {
        createNotification(message,);
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