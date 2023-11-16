import React from "react";
import { getRegisteredMessagePlugins, prepareMessagePlugins } from "../plugins/helper";
import regularMessagePlugin from "../webchat-ui/components/plugins/message/regular";
import styled from '@emotion/styled';

/**
 * returns a list of ready-to-use message plugins for the message renderer
 */
export const getMessageRendererPlugins = () =>
	prepareMessagePlugins([...getRegisteredMessagePlugins(), regularMessagePlugin], {
		React,
		styled,
	});
