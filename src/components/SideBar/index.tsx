import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import VariantsContent from './VariantsContent';
import { useState, useEffect, SyntheticEvent } from 'react';
import { useLocation } from 'react-router-dom';
import {
    selectCountriesData,
    selectLastUpdateDate,
    selectTotalCases,
    selectTotalCasesIsLoading,
} from 'redux/App/selectors';
import { useAppDispatch, useAppSelector } from 'redux/hooks';
import ghListLogo from 'assets/images/gh_list_logo.svg';
import {
    FlagIcon,
    LatestGlobal,
    LocationList,
    LocationListItem,
    SearchBar,
    SideBarHeader,
    StyledSideBar,
    SideBarTitlesSkeleton,
    CountriesListSkeleton,
    GhListButtonBar,
} from './styled';
import { setSelectedCountryInSidebar } from 'redux/App/slice';
import { CountryDataRow } from 'models/CountryData';

const SideBar = () => {
    const [openSidebar, setOpenSidebar] = useState(true);
    const [isVariantsView, setIsVariantsView] = useState(false);

    const location = useLocation();
    const dispatch = useAppDispatch();

    const totalCasesCount = useAppSelector(selectTotalCases);
    const totalCasesCountIsLoading = useAppSelector(selectTotalCasesIsLoading);
    const lastUpdateDate = useAppSelector(selectLastUpdateDate);
    const convertedDate = new Date(lastUpdateDate).toDateString();

    // Sidebar has other content in VariantsView
    useEffect(() => {
        setIsVariantsView(location.pathname === '/variant-reporting');
    }, [location]);

    const countriesData = useAppSelector(selectCountriesData)
        .filter((item) => item._id != null && item.code !== 'ZZ')
        .sort((a, b) => (a.casecount < b.casecount ? 1 : -1));

    const handleOnClick = () => {
        setOpenSidebar((value) => !value);
    };

    const handleOnCountryClick = (e: React.MouseEvent<HTMLElement>) => {
        const buttonValue = e.target as HTMLButtonElement;
        dispatch(setSelectedCountryInSidebar(buttonValue.value));
    };

    const handleAutocompleteCountrySelect = (
        event: SyntheticEvent<Element, Event>,
        value: CountryDataRow | null,
    ) => {
        value !== null && dispatch(setSelectedCountryInSidebar(value.code));
    };

    const Countries = () => (
        <>
            {countriesData.map((row) => {
                const { code, _id, casecount } = row;
                const countryCasesCountPercentage =
                    (casecount / totalCasesCount) * 100;
                return (
                    <LocationListItem
                        key={code}
                        $barWidth={countryCasesCountPercentage}
                        onClick={(e: React.MouseEvent<HTMLElement>) =>
                            handleOnCountryClick(e)
                        }
                    >
                        <button value={code}>
                            <span className="label">{_id}</span>
                            <span className="num">
                                {casecount.toLocaleString()}
                            </span>
                        </button>
                        <div className="country-cases-bar"></div>
                    </LocationListItem>
                );
            })}
        </>
    );

    return (
        <StyledSideBar
            $sidebaropen={openSidebar}
            $isVariantsView={isVariantsView}
            data-cy="sidebar"
        >
            {!isVariantsView ? (
                <>
                    <SideBarHeader id="sidebar-header">
                        <h1 id="total" className="sidebar-title total">
                            COVID-19 LINE LIST CASES
                        </h1>
                        <br />
                        <div id="disease-selector"></div>
                    </SideBarHeader>
                    <LatestGlobal id="latest-global">
                        {totalCasesCountIsLoading ? (
                            <SideBarTitlesSkeleton
                                animation="pulse"
                                variant="rectangular"
                                data-cy="loading-skeleton"
                            />
                        ) : (
                            <>
                                <span id="total-cases" className="active">
                                    {totalCasesCount.toLocaleString()}
                                </span>
                                <span id="p1-cases">NaN</span>
                                <span id="b1351-cases">NaN</span>
                                <span className="reported-cases-label">
                                    {' '}
                                    cases
                                </span>
                            </>
                        )}
                        <div className="last-updated-date">
                            Updated:{' '}
                            {totalCasesCountIsLoading ? (
                                <SideBarTitlesSkeleton
                                    animation="pulse"
                                    variant="rectangular"
                                    data-cy="loading-skeleton"
                                />
                            ) : (
                                <span id="last-updated-date">
                                    {convertedDate}
                                </span>
                            )}
                        </div>
                    </LatestGlobal>
                    <SearchBar className="searchbar">
                        <Autocomplete
                            id="country-select"
                            options={countriesData}
                            autoHighlight
                            disabled={totalCasesCountIsLoading}
                            getOptionLabel={(option) => option._id}
                            onChange={(event, value: CountryDataRow | null) =>
                                handleAutocompleteCountrySelect(event, value)
                            }
                            renderOption={(props, option) => (
                                <Box
                                    component="li"
                                    className="autocompleteBox"
                                    {...props}
                                >
                                    <FlagIcon
                                        loading="lazy"
                                        width="20"
                                        src={`https://flagcdn.com/w20/${option.code.toLowerCase()}.png`}
                                        srcSet={`https://flagcdn.com/w40/${option.code.toLowerCase()}.png 2x`}
                                        alt=""
                                    />
                                    {option._id} ({option.code})
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
                        {totalCasesCountIsLoading ? (
                            <CountriesListSkeleton
                                animation="pulse"
                                variant="rectangular"
                                data-cy="loading-skeleton"
                            />
                        ) : (
                            <Countries />
                        )}
                    </LocationList>
                </>
            ) : (
                <VariantsContent />
            )}
            <div id="sidebar-tab" onClick={handleOnClick}>
                <span id="sidebar-tab-icon">{openSidebar ? '◀' : '▶'}</span>
            </div>
            <GhListButtonBar
                id="ghlist"
                as="a"
                href={process.env.REACT_APP_DATA_PORTAL_URL || ''}
            >
                See all cases <img src={ghListLogo} />
                <span>Data</span>
            </GhListButtonBar>
        </StyledSideBar>
    );
};

export default SideBar;
