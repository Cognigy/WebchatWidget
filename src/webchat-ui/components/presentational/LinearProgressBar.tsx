import React from 'react';
import { styled } from '../../style';

const ProgressBarContainer = styled.div(() => ({
    height: 2,
    width: '100%',
    backgroundColor: "#e0e0de",
    borderRadius: 50,
}));

const ProgressBar = styled.div(({ theme, progressPercentage }) => ({
    height: '100%',
    width: `${progressPercentage}%`,
    backgroundColor: theme.primaryColor,
    borderRadius: 'inherit',
    textAlign: 'right'
}));

interface ILinearProgressBarProps {
    progressPercentage: number,
}

class LinearProgressBar extends React.PureComponent<React.HTMLProps<HTMLDivElement> & ILinearProgressBarProps> {
    render() {
        const { progressPercentage } = this.props;

        return (
            <ProgressBarContainer>
                <ProgressBar progressPercentage={progressPercentage} />
            </ProgressBarContainer>
        );
    }
}

export default LinearProgressBar;