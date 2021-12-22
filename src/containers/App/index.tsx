import { useEffect } from 'react';
import TopBar from 'components/TopBar';
import { Routes, Route, Navigate } from 'react-router-dom';
import CountryView from 'containers/CountryView';
import { RegionalView } from 'containers/RegionalView';
import CoverageView from 'containers/CoverageView';
import SideBar from 'components/SideBar';
import { useAppDispatch, useAppSelector } from 'redux/hooks';
import { fetchCountriesData, fetchTotalCases } from 'redux/App/thunks';
import { selectIsLoading, selectError } from 'redux/App/selectors';
import { selectIsLoading as selectVariantsViewLoading } from 'redux/VariantsView/selectors';
import { selectIsRegionalViewLoading } from 'redux/RegionalView/selectors';
import Loader from 'components/Loader';
import ErrorAlert from 'components/ErrorAlert';
import VariantsView from 'containers/VariantsView';

import { ErrorContainer } from './styled';

const App = () => {
    const dispatch = useAppDispatch();

    const isLoading = useAppSelector(selectIsLoading);
    const isVariantsViewLoading = useAppSelector(selectVariantsViewLoading);
    const isRegionalViewLoading = useAppSelector(selectIsRegionalViewLoading);
    const error = useAppSelector(selectError);

    useEffect(() => {
        dispatch(fetchCountriesData());
        dispatch(fetchTotalCases());
    }, []);

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
                <Route path="/variant-reporting" element={<VariantsView />} />
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
