import { useState } from 'react';
import { StyledSideBar } from './styled';

const SideBar = () => {
    const [openSidebar, setOpenSidebar] = useState(true);

    const handleOnClick = () => {
        setOpenSidebar((value) => !value);
    };

    return (
        <StyledSideBar $sidebarOpen={openSidebar}>
            <div id="sidebar-tab">
                <span onClick={handleOnClick} id="sidebar-tab-icon">
                    ◀
                </span>
            </div>
        </StyledSideBar>
    );
};

export default SideBar;
