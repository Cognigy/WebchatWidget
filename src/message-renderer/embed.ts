import React from "react";
import { MessageRenderer } from ".";
import "../plugins/messenger";
import "../plugins/adaptivecards";
import "../plugins/files";
// @ts-ignore
window.MessageRenderer = MessageRenderer;

// @ts-ignore
window.__COGNIGY_WEBCHAT = {
  React,
};
