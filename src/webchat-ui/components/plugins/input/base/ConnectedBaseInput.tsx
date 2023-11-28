import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { BaseInput } from "./BaseInput";
import { StoreState } from "../../../../../webchat/store/store";
import { InputComponentProps } from "../../../../../common/interfaces/input-plugin";
import { setSTTActive } from "../../../../../webchat/store/input/input-reducer";


export const ConnectedBaseInput = (props: InputComponentProps) => {
	const sttActive = useSelector((state: StoreState) => state.input.sttActive);
	const dispatch = useDispatch();

	return (
		<BaseInput
			{...props}
			sttActive={sttActive}
			onSetSTTActive={(active: boolean) => dispatch(setSTTActive(active))}
		/>
	);
};