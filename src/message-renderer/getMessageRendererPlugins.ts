import { getRegisteredMessagePlugins, prepareMessagePlugins } from "../plugins/helper";
import regularMessagePlugin from "../webchat-ui/components/plugins/message/regular";
import { styled } from "../webchat-ui/style";
import * as React from "react";

/**
 * returns a list of ready-to-use message plugins for the message renderer
 */
export const getMessageRendererPlugins = () =>
	prepareMessagePlugins([...getRegisteredMessagePlugins(), regularMessagePlugin], {
		React,
		styled,
	});
