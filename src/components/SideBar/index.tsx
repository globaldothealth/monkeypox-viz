import React, { useState } from 'react';
import {
    StyledSideBar,
    SideBarHeader,
    LatestGlobal,
    SearchBar,
    LocationList,
    LocationListItem,
    FlagIcon,
} from './styled';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';

const SideBar = () => {
    const [openSidebar, setOpenSidebar] = useState(true);

    const handleOnClick = () => {
        setOpenSidebar((value) => !value);
    };

    interface ICountries {
        widthBar: number;
        countryCode: string;
        countryName: string;
        number: number;
    }

    const countriesList: ICountries[] = [
        {
            countryCode: 'US',
            countryName: 'United States',
            widthBar: 49,
            number: 30261846,
        },
        {
            countryCode: 'DE',
            countryName: 'Germany',
            widthBar: 60,
            number: 5077124,
        },
        {
            countryCode: 'IT',
            countryName: 'Italy',
            widthBar: 36,
            number: 5077124,
        },
        {
            countryCode: 'ES',
            countryName: 'Spain',
            widthBar: 3,
            number: 5077124,
        },
    ];

    const handleOnCountryClick = (row: React.MouseEvent<HTMLElement>) => {
        console.log(row);
    };

    const Countries = () => (
        <>
            {countriesList.map((row) => {
                const { widthBar, countryCode, countryName, number } = row;
                return (
                    <LocationListItem key={countryCode} $barWidth={widthBar}>
                        <button
                            country={countryCode}
                            onClick={(row) => handleOnCountryClick(row)}
                        >
                            <span className="label">{countryName}</span>
                            <span className="num">
                                {number.toLocaleString()}
                            </span>
                        </button>
                        <div className="country-cases-bar"></div>
                    </LocationListItem>
                );
            })}
        </>
    );

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
                <Autocomplete
                    id="country-select"
                    options={countriesList}
                    autoHighlight
                    getOptionLabel={(option) => option.countryName}
                    renderOption={(props, option) => (
                        <Box
                            component="li"
                            // sx={{ '& > img': { mr: 2, flexShrink: 0 } }}
                            className="autocompleteBox"
                            {...props}
                        >
                            <FlagIcon
                                loading="lazy"
                                width="20"
                                src={`https://flagcdn.com/w20/${option.countryCode.toLowerCase()}.png`}
                                srcSet={`https://flagcdn.com/w40/${option.countryCode.toLowerCase()}.png 2x`}
                                alt=""
                            />
                            {option.countryName} ({option.countryCode})
                        </Box>
                    )}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Choose a country"
                            inputProps={{
                                ...params.inputProps,
                            }}
                        />
                    )}
                />
            </SearchBar>
            <LocationList>
                <Countries />
            </LocationList>
            <div id="sidebar-tab">
                <span onClick={handleOnClick} id="sidebar-tab-icon">
                    {openSidebar ? '◀' : '▶'}
                </span>
            </div>
        </StyledSideBar>
    );
};

export default SideBar;
