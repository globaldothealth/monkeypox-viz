import Alert from '@mui/material/Alert';
import { FallbackProps } from 'react-error-boundary';

import { ErrorContainer, RefreshButton } from './styled';

export default function ErrorFallback({ resetErrorBoundary }: FallbackProps) {
    return (
        <ErrorContainer>
            <Alert severity="error">
                Something went wrong, please try again.
            </Alert>

            <RefreshButton
                variant="contained"
                color="primary"
                onClick={resetErrorBoundary}
            >
                Refresh
            </RefreshButton>
        </ErrorContainer>
    );
}
