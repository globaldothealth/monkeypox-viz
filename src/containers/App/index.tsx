import { useEffect } from 'react';
import TopBar from 'components/TopBar';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import CountryView from 'containers/CountryView';
import { RegionalView } from 'containers/RegionalView';
import CoverageView from 'containers/CoverageView';
import SideBar from 'components/SideBar';
import { useAppDispatch, useAppSelector } from 'redux/hooks';
import {
    fetchCountriesData,
    fetchTotalCases,
    fetchFreshnessData,
} from 'redux/App/thunks';
import { selectIsLoading, selectError } from 'redux/App/selectors';
import { selectIsLoading as selectVariantsViewLoading } from 'redux/VariantsView/selectors';
import { selectIsRegionalViewLoading } from 'redux/RegionalView/selectors';
import Loader from 'components/Loader';
import ErrorAlert from 'components/ErrorAlert';
import VariantsView from 'containers/VariantsView';
import ReactGA from 'react-ga';

import { ErrorContainer } from './styled';

const App = () => {
    const env = process.env.NODE_ENV;
    const gaTrackingId = process.env.REACT_APP_GA_TRACKING_ID || '';

    if (env === 'production') {
        ReactGA.initialize(gaTrackingId);
    }

    const location = useLocation();
    const dispatch = useAppDispatch();

    const isLoading = useAppSelector(selectIsLoading);
    const isVariantsViewLoading = useAppSelector(selectVariantsViewLoading);
    const isRegionalViewLoading = useAppSelector(selectIsRegionalViewLoading);
    const error = useAppSelector(selectError);

    useEffect(() => {
        dispatch(fetchCountriesData());
        dispatch(fetchTotalCases());
        dispatch(fetchFreshnessData());
    }, []);

    // Track page views
    useEffect(() => {
        if (env !== 'production') return;

        ReactGA.set({ page: location.pathname });
        ReactGA.pageview(location.pathname);
    }, [env, location]);

    return (
        <div className="App">
            {(isLoading || isVariantsViewLoading || isRegionalViewLoading) && (
                <Loader />
            )}

            <TopBar />
            <SideBar />

            <Routes>
                <Route path="/" element={<Navigate replace to="/country" />} />
                <Route path="/country" element={<CountryView />} />
                <Route path="/region" element={<RegionalView />} />
                <Route path="/coverage" element={<CoverageView />} />
                <Route
                    path="/variant-reporting"
                    element={
                        env === 'development' ? (
                            <VariantsView />
                        ) : (
                            <Navigate replace to="/country" />
                        )
                    }
                />
            </Routes>

            {error && (
                <ErrorContainer>
                    <ErrorAlert errorMessage={error} />
                </ErrorContainer>
            )}
        </div>
    );
};

export default App;
