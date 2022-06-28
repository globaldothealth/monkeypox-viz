import { useEffect } from 'react';
import TopBar from 'components/TopBar';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import CountryView from 'containers/CountryView';
import SideBar from 'components/SideBar';
import { useAppDispatch, useAppSelector } from 'redux/hooks';
import {
    fetchCountriesData,
    fetchTotalCases,
    fetchAppVersion,
    fetchTimeseriesData,
    fetchTimeseriesCountData,
} from 'redux/App/thunks';
import { DataType, setCountriesData } from 'redux/App/slice';
import {
    selectIsLoading,
    selectError,
    selectDataType,
    selectInitialCountriesData,
} from 'redux/App/selectors';
import Loader from 'components/Loader';
import ErrorAlert from 'components/ErrorAlert';
import ReactGA from 'react-ga4';
import { useCookieBanner } from 'hooks/useCookieBanner';
import { ErrorBoundary } from 'react-error-boundary';
import ErrorFallback from 'components/ErrorFallback';
import Timeseries from 'components/Timeseries';

import { ErrorContainer } from './styled';
import PopupSmallScreens from 'components/PopupSmallScreens';

const App = () => {
    const env = process.env.NODE_ENV;
    const gaTrackingId = process.env.REACT_APP_GA_TRACKING_ID || '';

    useEffect(() => {
        if (env !== 'production' || gaTrackingId === '') return;

        ReactGA.initialize(gaTrackingId);
    }, [env, gaTrackingId]);

    // Init IUBENDA cookie banner
    const { initCookieBanner } = useCookieBanner();

    useEffect(() => {
        initCookieBanner();
    }, []);

    const location = useLocation();
    const dispatch = useAppDispatch();

    const isLoading = useAppSelector(selectIsLoading);
    const error = useAppSelector(selectError);
    const dataType = useAppSelector(selectDataType);
    const initialCountriesData = useAppSelector(selectInitialCountriesData);

    // Fetch data from AWS S3
    useEffect(() => {
        dispatch(fetchCountriesData());
        dispatch(fetchTotalCases());
        dispatch(fetchAppVersion());
        dispatch(fetchTimeseriesData());
        dispatch(fetchTimeseriesCountData());
    }, [dispatch]);

    // When a user switches to "combined" view reset initial countries data
    useEffect(() => {
        if (dataType !== DataType.Combined) return;

        dispatch(setCountriesData(initialCountriesData));
    }, [dataType]);

    // Track page views
    useEffect(() => {
        if (env !== 'production') return;

        ReactGA.send({ hitType: 'pageview', page: location.pathname });
    }, [env, location]);

    return (
        <div className="App">
            {isLoading && <Loader />}

            <TopBar />
            <PopupSmallScreens />

            <ErrorBoundary
                FallbackComponent={ErrorFallback}
                onReset={() => window.location.reload()}
            >
                <SideBar />

                <Routes>
                    <Route
                        path="/"
                        element={<Navigate replace to="/country" />}
                    />
                    <Route path="/country" element={<CountryView />} />
                </Routes>

                {dataType === DataType.Confirmed && <Timeseries />}

                {error && (
                    <ErrorContainer>
                        <ErrorAlert errorMessage={error} />
                    </ErrorContainer>
                )}
            </ErrorBoundary>
        </div>
    );
};

export default App;
