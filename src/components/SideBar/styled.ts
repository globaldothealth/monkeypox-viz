import { styled } from '@mui/material/styles';

interface StyledSideBarProps {
    $sidebaropen: boolean;
    $isVariantsView?: boolean;
}

export const StyledSideBar = styled('aside')<StyledSideBarProps>`
    backdrop-filter: blur(0.5rem);
    background-color: white;
    border-radius: 1ex;
    box-shadow: 0 10px 30px 1px rgb(0 0 0 / 10%);
    color: #aaa;
    display: flex;
    flex-direction: column;
    bottom: ${(props) => (props.$isVariantsView ? 'unset' : '25%')};
    height: ${(props) => (props.$isVariantsView ? 'unset' : '70%')};
    left: ${({ $sidebaropen }) => ($sidebaropen === true ? '2ex' : '-28rem')};
    padding: 2ex;
    position: fixed;
    margin-top: 0;
    top: 15%;
    transition: left 0.2s;
    width: 28rem;
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
            height: 100%;
            display: flex;
            align-items: center;
        }
    }
    //
`;

export const FlagIcon = styled('img')(() => ({
    marginRight: '2rem',
    flexShrink: 0,
}));

export const SideBarHeader = styled('div')(({ theme }) => ({
    cursor: 'pointer',
    height: 'auto',
    position: 'relative',
    h1: {
        borderRadius: '.4rem',
        display: 'inline-block',
        fontSize: '1.2rem',
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
        font-size: 2.7rem;
        font-weight: 500;
        margin-right: 0.35ex;
    }
    #total-cases {
        display: inline;
    }
    .last-updated-date {
        font-size: 1.2rem;
        color: #999;
        margin-top: 2rem;
    }
`;

export const SearchBar = styled('div')`
    margin-top: 0;
    div:first-of-type {
        width: 100%;
    }
    .MuiAutocomplete-endAdornment {
        display: flex;
        flex-flow: row-reverse;
    }
    .MuiAutocomplete-popper {
        button {
            background-color: #fff;
        }
    }
`;

export const LocationList = styled('div')`
    flex: 1;
    overflow: auto;
    margin-top: 2rem;
`;

export const LocationListItem = styled('div')<{ $barWidth: number }>(
    ({ theme, $barWidth }) => ({
        width: '100%',
        margin: '.1rem auto',
        button: {
            color: '#454545',
            backgroundColor: '#fff',
            boxShadow: 'none',
            display: 'flex',
            justifyContent: 'space-between',
            padding: '0.5rem 0 0.2rem 0',
            width: '100%',
            fontSize: '1.4rem',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '0.2rem',
            transition: 'all 0.3s ease',
            cursor: 'pointer',
            '&:hover': {
                backgroundColor: '#f3f3f3',
            },
            '& .label': {
                marginRight: '1rem',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
            },
            '& .num': {
                display: 'flex',
                alignItems: 'center',
                fontWeight: 'normal',
                color: '#999',
            },
        },
        '& .country-cases-bar': {
            background: theme.primary.main,
            height: '.3rem',
            width: $barWidth + '%',
        },
    }),
);
