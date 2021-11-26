// import { useState } from 'react';
import { styled } from '@mui/system';

export const StyledSideBar = styled('aside')<{ sidebaropen: boolean }>`
    backdrop-filter: blur(0.5rem);
    /* background-color: white; */
    background-color: ${({ sidebaropen }) =>
    sidebaropen === true ? 'red' : 'blue'};
    border-radius: 1ex;
    bottom: 25%;
    box-shadow: 0 10px 30px 1px rgb(0 0 0 / 10%);
    color: #aaa;
    display: flex;
    flex-direction: column;
    height: 70%;
    left: 2ex;
    padding: 2ex;
    position: fixed;
    margin-top: 0;
    top: 15%;
    transition: left 0.2s;
    width: 18rem;
    z-index: 3;

    #sidebar-tab {
        background-color: white;
        border: 1px solid #f0f0f0;
        border-left: 0;
        align-items: center;
        border-top-right-radius: 7px;
        border-bottom-right-radius: 7px;
        cursor: pointer;
        display: flex;
        justify-content: center;
        height: 5ex;
        left: 100%;
        position: absolute;
        top: 5ex;
        width: 2.5ex;
        #sidebar-tab-icon {
            font-size: 80%;
        }
    }
`;
