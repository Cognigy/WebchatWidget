import { Store } from "redux";
import { onVisibilityChange } from "../../helper/page-visibility";
import { setPageVisible } from "./ui-reducer";

export const registerUiHandler = (store: Store) => {
  onVisibilityChange((visible) => {
    store.dispatch(setPageVisible(visible));
  });
};
