import TopBar from 'components/TopBar';
import { Routes, Route, Navigate } from 'react-router-dom';
import CountryView from 'components/CountryView';
import { RegionalView } from 'components/RegionalView';
import { CoverageView } from 'components/CoverageView';
import SideBar from 'components/SideBar';

const App = () => {
    return (
        <div className="App">
            <TopBar />
            <SideBar />
            <Routes>
                <Route path="/" element={<Navigate replace to="/country" />} />
                <Route path="/country" element={<CountryView />} />
                <Route path="/region" element={<RegionalView />} />
                <Route path="/coverage" element={<CoverageView />} />
            </Routes>
        </div>
    );
};

export default App;
