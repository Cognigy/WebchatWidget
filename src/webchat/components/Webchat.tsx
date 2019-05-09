import * as React from 'react';
import { Options, WebchatClient } from '@cognigy/webchat-client';
import { Store } from 'redux';
import { StoreState, createWebchatStore } from '../store/store';
import { Provider } from 'react-redux';
import { ConnectedWebchatUI } from './ConnectedWebchatUI';
import { setOptions } from '../store/options/options-reducer';
import { MessagePlugin } from '../../common/interfaces/message-plugin';
import { InputPlugin } from '../../common/interfaces/input-plugin';
import { sendMessage } from '../store/messages/message-middleware';
import { setConfig } from '../store/config/config-reducer';
import { MessageSender } from '../../webchat-ui/interfaces';
import { setOpen, toggleOpen } from '../store/ui/ui-reducer';
import { IMessage } from '../../common/interfaces/message';

export interface WebchatProps {
    url: string;
    options?: Partial<Options>;
    messagePlugins?: MessagePlugin[];
    inputPlugins?: InputPlugin[];
}

export class Webchat extends React.PureComponent<WebchatProps> {
    public store: Store<StoreState>;
    public client: WebchatClient;


    // component lifecycle methods
    constructor(props: WebchatProps) {
        super(props);

        const { url, options } = props;

        const client = new WebchatClient(url, options);
        const store = createWebchatStore(client);

        this.client = client;
        this.store = store;
    }

    componentDidMount() {
        this.connect();
    }

    componentWillUnmount() {
        this.client.disconnect();
    }


    // component API (for usage via ref)
    connect = async () => {
        const { client, store } = this;

        await client.connect()

        store.dispatch(setOptions(client.socketOptions));
        store.dispatch(setConfig(client.webchatConfig));
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
                />
            </Provider>
        )
    }
}