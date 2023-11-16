import React from 'react';
import Button from "./Button";

const PrimaryButton = props => {
	return (
		<Button
			{...props}
			color='primary'
		/>
	)
}

export default PrimaryButton;