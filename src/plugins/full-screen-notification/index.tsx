import "idempotent-babel-polyfill";
import React from "react";
import { registerMessagePlugin } from "../helper";
import Header from "../../webchat-ui/components/presentational/Header";
import styled from '@emotion/styled';
import { sanitizeHTML } from "../../webchat/helper/sanitize";


const FullScreenNotification = props => {
    const { message } = props;

    const { text, data } = message.data._plugin;

    const __html = data.disableHtmlContentSanitization ? text : sanitizeHTML(text)

    const Dialog = styled.div(({ theme }) => ({
        paddingLeft: theme.unitSize * 2,
        paddingRight: theme.unitSize * 2,
        backgroundColor: '#fafafa',
        color: theme.greyContrastColor,
        textAlign: "center",
        height: data.title ? `calc(100% - ${theme.unitSize * 7}px)`: "100%",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        justifyContent: "center"
    }));

	return (
        <div style={{height: "100%"}}>
            {data.title && 
                <Header title={data.title} connected={false} showRatingButton={false} showCloseButton={false}/>
            }
            <Dialog>
                <span dangerouslySetInnerHTML={{__html}}/>
            </Dialog>
        </div>
	);
};

const fullScreenNotificationPlugin = {
    match: 'full-screen-notification',
    component: FullScreenNotification,
    options: {
        fullwidth: true
    }
};

registerMessagePlugin(fullScreenNotificationPlugin);

export default fullScreenNotificationPlugin;