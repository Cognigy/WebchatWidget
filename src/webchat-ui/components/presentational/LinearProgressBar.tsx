import React from 'react';
import { styled } from '../../style';

const ProgressBarContainer = styled.div(() => ({
    height: 2,
    width: '100%',
    backgroundColor: "#e0e0de",
    borderRadius: 50,
}));

const ProgressBar = styled.div(({ theme }) => ({
    height: '100%',
    width: `${20}%`,
    backgroundColor: theme.primaryColor,
    borderRadius: 'inherit',
    textAlign: 'right'
}));

const ProgressText = styled.span(() => ({
    padding: 5,
    color: 'white',
    fontWeight: 'bold'
}));

interface ILinearProgressBarProps {
    progressPercentage: number,
}

class LinearProgressBar extends React.PureComponent<React.HTMLProps<HTMLDivElement> & ILinearProgressBarProps> {
    render() {
        const { progressPercentage } = this.props;

        return (
            <ProgressBarContainer>
                <ProgressBar>
                    <ProgressText>{`${progressPercentage}%`}</ProgressText>
                </ProgressBar>
            </ProgressBarContainer>
        );
    }
}

export default LinearProgressBar;