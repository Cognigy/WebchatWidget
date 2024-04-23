import { TypedUseSelectorHook, useSelector as untypedUseSelector } from "react-redux";
import type { StoreState } from "../store/store";

export const useSelector: TypedUseSelectorHook<StoreState> = untypedUseSelector;
