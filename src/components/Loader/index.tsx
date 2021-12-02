import CircularProgress from '@mui/material/CircularProgress';

import { LoaderContainer } from './styled';

const Loader: React.FC = () => {
    return (
        <LoaderContainer>
            <CircularProgress />
        </LoaderContainer>
    );
};

export default Loader;
