import { useState } from 'react';
import { StyledSideBar } from './SideBarStyle';

const SideBar = () => {
    const [openSidebar, setOpenSidebar] = useState(true);

    type ClickHandler = () => (e: React.MouseEvent) => void;

    const handleOnClick: ClickHandler = () => () => {
        setOpenSidebar((value) => !value);

        console.log(openSidebar);
    };

    return (
        <StyledSideBar sidebaropen={openSidebar}>
            <div id="sidebar-tab">
                <span onClick={handleOnClick()} id="sidebar-tab-icon">
                    ◀
                </span>
            </div>
        </StyledSideBar>
    );
};

export default SideBar;
