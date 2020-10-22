import React from 'react';
import ReactDOM from 'react-dom';
import ChatIcon from '@material-ui/icons/Chat';
import { IconButton } from "@material-ui/core";
import styled, { keyframes } from 'styled-components'


const Button = ({ options, onClick }) => {

	const { text, colorScheme } = options;

	const fadeIn = keyframes`
		0% { opacity: 0; }
		20% { opacity: 0; }
		40% { opacity: 0.3; }
		60% { opacity: 0.5; }
		80% { opacity: 0.9; }
		100% { opacity: 1; }
	`

	const Teaser = styled.div`
		display: none;
		max-width: 200px;
		line-height:
		background-color: white;
		padding: 16px 24px;
		position: fixed;
		border-radius: 16px 16px 0px;
		right: 60px;
		bottom: 100px;
		box-shadow: rgba(151, 124, 156, 0.1) 0px 5px 9px 0px, rgba(203, 195, 212, 0.1) 0px 5px 16px 0px, rgba(216, 212, 221, 0.1) 0px 8px 20px 0px;
		color: #45454;
		font-size: 14px;
		font-family: Verdana,-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue","Noto Sans","Noto Sans SC","Noto Sans TC","MS Gothic","Hiragino Kaku Gothic ProN",SimHei,SimSong,"Yu Gothic",Meiryo,Arial,sans-serif;
		animation: ${fadeIn} 0.5s ease-in;
	`

	return (
		<div id="webchat-teaser">
			<Teaser
				id="teaser"
			>
				{text}
			</Teaser>
			<IconButton
				style={{
					backgroundColor: colorScheme,
					position: "fixed",
					right: "32px",
					bottom: "32px",
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
					width: 56,
					height: 56,
					borderRadius: '50%',
					overflow: 'visible'
				}}
				onClick={onClick}
				data-cognigy-webchat-toggle
				type='button'
				className="webchat-toggle-button"
			>
				<ChatIcon
					style={{
						color: "white",
					}}
				/>
			</IconButton>
		</div>
	)
}

const initTeaser = (options, onClick) => {

	// extract the options
	const { time } = options;

	// show the tooltip after time
	setTimeout(() => {
		window.document.getElementById('teaser').style.display = "inherit"
	}, time);

	const anchor = window.document.createElement('div');
	window.document.body.appendChild(anchor);

	ReactDOM.render(
		<Button 
			onClick={() => {
				// remove the webchat teaser div
				window.document.getElementById('webchat-teaser').style.display = "none";
				
				// execute the callback function
				onClick();
			}} 
			options={options} 
		/>,
		anchor
	);
}

window.initTeaser = initTeaser;