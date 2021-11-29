import { styled } from '@mui/material/styles';

export const StyledSideBar = styled('aside')<{ $sidebaropen: boolean }>`
    backdrop-filter: blur(0.5rem);
    background-color: white;
    border-radius: 1ex;
    bottom: 25%;
    box-shadow: 0 10px 30px 1px rgb(0 0 0 / 10%);
    color: #aaa;
    display: flex;
    flex-direction: column;
    height: 70%;
    left: ${({ $sidebaropen }) => ($sidebaropen === true ? '2ex' : '-19rem')};
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

export const SideBarHeader = styled('div')(({ theme }) => ({
    cursor: 'pointer',
    height: 'auto',
    position: 'relative',
    h1: {
        borderRadius: '4px',
        display: 'inline-block',
        fontSize: '12px',
        margin: 0,
        padding: '0.7ex 2ex',
        background: theme.primary.main,
        color: theme.primary.contrastText,
    },
}));

export const LatestGlobal = styled('aside')<{ $sidebaropen: boolean }>`
    margin: 2ex 0;
    #total-cases,
    #total-deaths,
    #p1-cases,
    #b1351-cases {
        display: none;
        color: black;
        font-size: 1.7rem;
        font-weight: 500;
        margin-right: 0.35ex;
    }
    #total-cases {
        display: inline;
    }
    .last-updated-date {
        font-size: 0.7rem;
        color: #999;
        margin-top: 15px;
    }
`;

export const SearchBar = styled('div')`
    margin-top: 10px;
    div:first-of-type {
        width: 100%;
    }
    label {
        line-height: 0.9;
    }
    input {
        background: #edf3f1;
        height: 12px;
        border-radius: 10px;
    }
    fieldset {
        border-color: rgb(0 0 0 / 5%);
        border-radius: 10px;
    }
`;
