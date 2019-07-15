import memoize from 'memoize-one';

import { getStyles } from './styles';
import { upload } from './helpers/upload'
import { useDropzone } from 'react-dropzone';

// only re-calculate if theme changed
const getStylesMemo = memoize(getStyles);

const createFileUpload = React => {
    const FileUpload = props => {
        const onDrop = React.useCallback(async files => {
            const file: File = files[0];

            try {
                const downloadUrl = await upload(props.message.data._plugin.payload, file);
                props.onSendMessage('', {
                    file: downloadUrl
                });
            } catch (e) {
                console.error('uploading file failed', e)
            }
        }, []);
        const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

        const {
            isFullscreen,
            onSetFullscreen,
            theme,
            message
        } = props;

        const {
            openButtonLabel
        } = message.data._plugin;

        if (!isFullscreen) {
            const { openDialogButtonStyles } = getStylesMemo(theme);

            return (
                <button
                    type='button'
                    onClick={onSetFullscreen}
                    style={openDialogButtonStyles}
                >
                    {openButtonLabel || 'upload file'}
                </button>
            )
        }

        const {
            attributes,
            onDismissFullscreen,
        } = props;

        const {
            payload,
            titleText,
            dragClickLabel,
            dropLabel,
            cancelButtonLabel
        } = message.data._plugin;

        const {
            dialogStyles,
            headerStyles,
            contentStyles,
            footerStyles,
            cancelButtonStyles
        } = getStylesMemo(theme);

        return (
            <div
                {...attributes}
                style={{
                    ...attributes.styles,
                    ...dialogStyles
                }}
            >
                {payload.service === 'aws-s3' && (
                    <>
                        <header style={headerStyles}>
                            {titleText || 'File Upload'}
                        </header>
                        <main style={contentStyles} {...getRootProps()}>
                            <input {...getInputProps()} />
                            {isDragActive
                                ? <p>{dragClickLabel || 'Drop the file here'}</p>
                                : <p>{dropLabel || 'Drag a file here, or click to select one'}</p>

                            }
                        </main>
                        <footer style={footerStyles}>
                            <button
                                type='button'
                                onClick={onDismissFullscreen}
                                style={cancelButtonStyles}
                            >
                                {cancelButtonLabel || 'cancel'}
                            </button>
                        </footer>
                    </>
                )}
            </div>
        )
    }

    return FileUpload;
}

const fileUploadPlugin = ({ React }) => ({
    match: 'file-upload',
    component: createFileUpload(React)
})

if (!window.cognigyWebchatMessagePlugins) {
    window.cognigyWebchatMessagePlugins = []
}

window.cognigyWebchatMessagePlugins.push(fileUploadPlugin);