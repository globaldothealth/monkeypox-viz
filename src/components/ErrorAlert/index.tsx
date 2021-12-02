import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';

interface ErrorAlertProps {
    errorMessage: string;
}

const ErrorAlert: React.FC<ErrorAlertProps> = ({
    errorMessage,
}: ErrorAlertProps) => {
    return (
        <Alert severity="error">
            <AlertTitle>Error</AlertTitle>
            {errorMessage}
        </Alert>
    );
};

export default ErrorAlert;
