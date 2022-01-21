import { fetch } from "whatwg-fetch";
import { IWebchatConfig } from "../../common/interfaces/webchat-config";

export const getEndpointBaseUrl = (webchatConfigUrl: string) => {
  const partials = webchatConfigUrl.split("/");
  partials.splice(partials.length - 1, 1);

  return partials.join("/");
};

export const getEndpointUrlToken = (webchatConfigUrl: string) => {
  return webchatConfigUrl.split("/").pop() as string;
};

export const fetchWebchatConfig = async (webchatConfigUrl: string) => {
  const response = await fetch(webchatConfigUrl);
  return response.json() as IWebchatConfig;
};
