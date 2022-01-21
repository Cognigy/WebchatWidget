import React, { memo, useCallback, useMemo, useState } from "react";

import { FC, useEffect, useRef } from "react";
import {
  Action,
  AdaptiveCard as MSAdaptiveCard,
  CardElement,
  HostConfig,
  OpenUrlAction,
  ShowCardAction,
  SubmitAction,
} from "adaptivecards";

interface IAdaptiveCardProps {
  hostConfig?: Partial<HostConfig>;
  onExecuteAction?: (actionJson: any) => void;
  payload?: boolean;
}

/**
 * Inspired by Microsoft's (not publically released) adaptivecards-react package
 * https://github.com/microsoft/AdaptiveCards/blob/5b66a52e0e0cee5074a42dcbe688d608e0327ae4/source/nodejs/adaptivecards-react/src/adaptive-card.tsx
 */
const AdaptiveCard: FC<IAdaptiveCardProps> = (props) => {
  const { payload, hostConfig, onExecuteAction } = props;

  const targetRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<MSAdaptiveCard>(new MSAdaptiveCard());
  const executeAction = useCallback(
    (a: Action) => {
      onExecuteAction?.(a.toJSON());
    },
    [onExecuteAction]
  );

  useEffect(() => {
    cardRef.current.onExecuteAction = executeAction;
  }, [executeAction]);

  useEffect(() => {
    cardRef.current.hostConfig = new HostConfig(hostConfig);
  }, [hostConfig]);

  useEffect(() => {
    if (!targetRef.current) {
      return;
    }
    const card = cardRef.current;

    try {
      card.parse(payload);
      const result = card.render() as HTMLElement;
      targetRef.current.innerHTML = "";
      targetRef.current.appendChild(result);
    } catch (cardRenderError) {
      console.error("Unable to render Card", cardRenderError);
    }
  }, [hostConfig, payload]);

  return <div ref={targetRef} />;
};

export default memo(AdaptiveCard);
