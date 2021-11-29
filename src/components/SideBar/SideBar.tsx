import { useState } from 'react';
import {
    StyledSideBar,
    SideBarHeader,
    LatestGlobal,
    SearchBar,
} from './SideBarStyle';
import TextField from '@mui/material/TextField';

const SideBar = () => {
    const [openSidebar, setOpenSidebar] = useState(true);

    type ClickHandler = () => (e: React.MouseEvent) => void;

    const handleOnClick: ClickHandler = () => () => {
        setOpenSidebar((value) => !value);

        console.log(openSidebar);
    };

    return (
        <StyledSideBar $sidebaropen={openSidebar}>
            <SideBarHeader id="sidebar-header">
                <h1 id="total" className="sidebar-title total">
                    COVID-19 LINE LIST CASES
                </h1>
                <br />
                <div id="disease-selector"></div>
            </SideBarHeader>
            <LatestGlobal id="latest-global">
                <span id="total-cases" className="active">
                    61,078,740
                </span>
                <span id="p1-cases">NaN</span>
                <span id="b1351-cases">NaN</span>
                <span className="reported-cases-label"> cases</span>
                <div className="last-updated-date">
                    Updated: <span id="last-updated-date">Thu Nov 25 2021</span>
                </div>
            </LatestGlobal>
            <SearchBar className="searchbar">
                <TextField id="outlined-required" label="Search" />
            </SearchBar>
            <div id="sidebar-tab">
                <span onClick={handleOnClick()} id="sidebar-tab-icon">
                    ◀
                </span>
            </div>
        </StyledSideBar>
    );
};

export default SideBar;
