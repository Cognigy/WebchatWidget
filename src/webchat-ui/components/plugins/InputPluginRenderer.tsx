import * as React from "react";
import {
  InputComponentProps,
  InputPlugin,
  RuleInputPlugin,
  SelectInputPlugin,
} from "../../../common/interfaces/input-plugin";
import { IMessage } from "../../../common/interfaces/message";
import Toolbar from "../presentational/Toolbar";
import { styled, IWebchatTheme } from "../../style";
import IconButton from "../presentational/IconButton";

export interface InputProps
  extends InputComponentProps,
    React.HTMLProps<HTMLDivElement> {
  plugins: InputPlugin[];
  messages: IMessage[];
  onSetInputMode: (inputMode: string) => void;
  inputMode: string;
  webchatTheme: IWebchatTheme;
}

const SmallToolbar = styled(Toolbar)({
  // position: 'absolute',
  // bottom: '100%',
  // height: 0,
  minHeight: "auto",
  height: 40,
  "&>*": {
    flexShrink: 0,
  },
});

const InputRoot = styled.div(({ theme }) => ({
  position: "relative",
  boxShadow: theme.shadow,
  backgroundColor: "white",
}));

export default ({
  messages,
  config,
  onSendMessage,
  plugins,
  inputMode,
  onSetInputMode,
  webchatTheme,
  onEmitAnalytics,
  ...props
}: InputProps): JSX.Element => {
  const results: any[] = [];

  const attributes = Object.keys(props).length > 0 ? props : undefined;

  const rulePlugin = plugins
    .filter((plugin) => plugin.type === "rule")
    .find((plugin) => (plugin as RuleInputPlugin).rule({ messages, config }));

  if (rulePlugin) {
    const emitAnalytics = (event: string, payload?: any) =>
      onEmitAnalytics(
        `plugin/${rulePlugin.name || "unknown"}/${event}`,
        payload
      );

    return (
      <rulePlugin.component
        config={config}
        onSendMessage={onSendMessage}
        attributes={attributes}
        theme={webchatTheme}
        onEmitAnalytics={emitAnalytics}
      />
    );
  }

  const selectInputs = plugins.filter(
    (plugin) => plugin.type === "select"
  ) as SelectInputPlugin[];

  const matchedSelectInput = selectInputs.find(
    (plugin) => plugin.id === inputMode
  );

  const tabs = selectInputs.length > 1 && (
    <SmallToolbar>
      {selectInputs.map((input) => (
        <IconButton
          key={input.id}
          className={input === matchedSelectInput ? "active" : ""}
          onClick={() => onSetInputMode(input.id)}
        >
          <input.icon />
        </IconButton>
      ))}
    </SmallToolbar>
  );

  const emitAnalytics = (event: string, payload?: any) =>
    onEmitAnalytics(
      `plugin/${
        (matchedSelectInput && matchedSelectInput.name) || "unknown"
      }/${event}`,
      payload
    );

  return (
    <InputRoot className="webchat-input">
      {tabs}
      {matchedSelectInput && (
        <matchedSelectInput.component
          config={config}
          onSendMessage={onSendMessage}
          attributes={attributes}
          theme={webchatTheme}
          onEmitAnalytics={emitAnalytics}
        />
      )}
    </InputRoot>
  );
};
