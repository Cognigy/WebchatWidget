import { InputComponentProps, InputPluginFactoryProps } from '../../../common/interfaces/input-plugin';
import Toolbar from '../../../webchat-ui/components/presentational/Toolbar';
// import Input from '../../../webchat-ui/components/presentational/Input';
import Button from '../../../webchat-ui/components/presentational/Button';





interface ISpeechInputState {
    speechRecognition: SpeechRecognition;
    active: boolean;

    result: string;
    isFinalResult: boolean;
}

const getSpeechRecognition = (): SpeechRecognition | null => {
    try {
        return new SpeechRecognition();
    } catch (e) { }

    try {
        // @ts-ignore
        return new webkitSpeechRecognition() as SpeechRecognition;
    } catch (e) { }

    return null;
}

export const getSpeechInput = ({ React, styled }: InputPluginFactoryProps) => {
    const MicIcon = require('./baseline-mic-24px.svg');
    const MicOffIcon = require('./baseline-mic_off-24px.svg');
    const MicNoneIcon = require('./baseline-mic_none-24px.svg');

    const Wrapper = styled.form(({ theme }) => ({
        display: 'block',
        position: 'relative',
        margin: 0,

        backgroundColor: 'white',

        borderBottomLeftRadius: theme.unitSize * 2,
        borderBottomRightRadius: theme.unitSize * 2,

        borderBottomColor: 'transparent',
        borderBottomStyle: 'solid',
        borderBottomWidth: 2,

        transition: 'border-bottom .2s ease-out',

        '&.active': {
            borderBottomColor: theme.primaryColor
        }
    }));

    const Input = styled.input(({ theme }) => ({

        display: 'block',
        height: theme.blockSize * 1.5,
        border: 'none',
        width: '100%',
        boxSizing: 'border-box',
        paddingLeft: theme.unitSize * 3,
        paddingRight: theme.unitSize * 9,
        outline: 'none',
        backgroundColor: 'transparent',

        '&.interim': {
            fontStyle: 'italic'
        }
    }));

    const Button = styled.button(({ theme }) => ({
        display: 'block',
        width: theme.unitSize * 5,
        height: theme.unitSize * 5,

        position: 'absolute',
        right: '50%',
        top: '50%',
        marginTop: - theme.unitSize * 5 / 2,
        marginRight: - theme.unitSize * 5 / 2,
        backgroundColor: 'transparent',
        border: 'none',
        fill: 'hsla(0, 0%, 0%, .54)',
        cursor: 'pointer',
        transition: 'right .2s ease-out',

        '&.right': {
            right: theme.unitSize * (3 + 5 / 2),
        },

        '&[disabled]': {
            fill: 'hsla(0, 0%, 0%, .2)',
            cursor: 'default'
        }
    }))



    return class SpeechInput extends React.Component<InputComponentProps, ISpeechInputState> {
        constructor(props: InputComponentProps) {
            super(props);

            const speechRecognition = getSpeechRecognition();

            if (speechRecognition) {
                speechRecognition.continuous = true;
                speechRecognition.interimResults = true;
                speechRecognition.onresult = this.handleResult;

                if (props.config.settings.STTLanguage) {
                    speechRecognition.lang = props.config.settings.STTLanguage
                }
            }

            this.state = {
                // @ts-ignore
                speechRecognition,
                active: false,
                result: '',
                isFinalResult: false
            } as ISpeechInputState;
        }

        componentDidUpdate() {
            if (this.state.speechRecognition && this.props.config.settings.STTLanguage) {
                this.state.speechRecognition.lang = this.props.config.settings.STTLanguage
            }
        }

        handleResult = (e: SpeechRecognitionEvent) => {
            const result = e.results[e.resultIndex];
            const { isFinal } = result;
            const { transcript } = result[0];

            this.setState({
                result: transcript,
                isFinalResult: isFinal
            })

            // only send messages that are not 'interim'
            if (isFinal) {
                this.props.onSendMessage(transcript + JSON.stringify(result[0], null, 2));
            }
        }

        isSupported() {
            return !!this.state.speechRecognition;
        }

        toggle = () => {
            const { active, speechRecognition } = this.state;

            if (active) {
                speechRecognition.stop();
            } else {
                speechRecognition.start();
            }

            const newState: Partial<ISpeechInputState> = {
                active: !active,
            }

            if (active) {
                newState.result = '',
                newState.isFinalResult = false;
            }

            this.setState(newState as ISpeechInputState);
        }

        renderMicIcon() {
            if (!this.isSupported())
                return <MicNoneIcon />;

            if (this.state.active)
                return <MicOffIcon />;

            return <MicIcon />
        }

        render() {
            const { result, isFinalResult, active } = this.state;

            const buttonClasses = [
                active && 'right'
            ]
                .filter(name => typeof name === 'string')
                .join(' ');

            const inputClasses = [
                !isFinalResult && 'interim'
            ]
                .filter(name => typeof name === 'string')
                .join(' ');

            const wrapperClasses = [
                active && 'active'
            ]
                .filter(name => typeof name === 'string')
                .join(' ');

            return (
                <Wrapper className={wrapperClasses}>
                    <Input
                        className={inputClasses}
                        disabled
                        value={result}
                    />
                    <Button
                        disabled={!this.isSupported()}
                        onClick={this.toggle}
                        className={buttonClasses}
                    >
                        {this.renderMicIcon()}
                    </Button>
                </Wrapper>
            )
        }
    }
}