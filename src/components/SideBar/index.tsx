import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { useState, SyntheticEvent, useEffect } from 'react';
import {
    selectCountriesData,
    selectLastUpdateDate,
    selectTotalCases,
    selectTotalCasesIsLoading,
    selectAppVersion,
    selectDataType,
} from 'redux/App/selectors';
import { useAppDispatch, useAppSelector } from 'redux/hooks';
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
    VersionNumber,
} from './styled';
import {
    setSelectedCountryInSidebar,
    setPopup,
    DataType,
    setCountriesData,
} from 'redux/App/slice';
import { selectSelectedCountryInSideBar } from 'redux/App/selectors';
import { SelectedCountry } from 'models/CountryData';
import { getCountryCode } from 'utils/helperFunctions';
import { DataTypeButtons } from './DataTypeButtons';

const SideBar = () => {
    const dispatch = useAppDispatch();

    const [openSidebar, setOpenSidebar] = useState(true);

    const totalCasesCount = useAppSelector(selectTotalCases);
    const totalCasesCountIsLoading = useAppSelector(selectTotalCasesIsLoading);
    const lastUpdateDate = useAppSelector(selectLastUpdateDate);
    const selectedCountry = useAppSelector(selectSelectedCountryInSideBar);
    const appVersion = useAppSelector(selectAppVersion);
    const dataType = useAppSelector(selectDataType);

    const countriesData = useAppSelector(selectCountriesData);
    const [autocompleteData, setAutocompleteData] = useState<SelectedCountry[]>(
        [],
    );

    // Map countries data to autocomplete data
    useEffect(() => {
        const mappedData = countriesData.map((country) => {
            return { name: country.name };
        });

        setAutocompleteData(mappedData);
    }, [countriesData]);

    // Sort countries based on number of cases
    useEffect(() => {
        if (!countriesData || countriesData.length === 0) return;

        const sortBy =
            dataType === DataType.Confirmed ? 'confirmed' : 'suspected';

        const sortedCountries = [...countriesData].sort((a, b) =>
            a[sortBy] < b[sortBy] ? 1 : -1,
        );
        dispatch(setCountriesData(sortedCountries));
        // eslint-disable-next-line
    }, [dataType]);

    const handleOnClick = () => {
        setOpenSidebar((value) => !value);
    };

    const handleOnCountryClick = (countryName: string) => {
        dispatch(setSelectedCountryInSidebar({ name: countryName }));
        dispatch(setPopup({ isOpen: true, countryName }));
    };

    const handleAutocompleteCountrySelect = (
        event: SyntheticEvent<Element, Event>,
        value: string | null,
    ) => {
        if (value === null) {
            dispatch(setSelectedCountryInSidebar(null));
        } else {
            dispatch(setSelectedCountryInSidebar({ name: value }));
            dispatch(setPopup({ isOpen: true, countryName: value }));
        }
    };

    const Countries = () => {
        return (
            <>
                {countriesData.map((row) => {
                    const { name, confirmed, suspected } = row;

                    const value =
                        dataType === DataType.Confirmed ? confirmed : suspected;
                    const countryCasesCountPercentage =
                        (value / totalCasesCount) * 100;

                    return (
                        <LocationListItem
                            key={name}
                            $barWidth={countryCasesCountPercentage}
                            onClick={() => handleOnCountryClick(name)}
                            data-cy="listed-country"
                        >
                            <button>
                                <span className="label">{name}</span>
                                <span className="num">
                                    {value.toLocaleString()}
                                </span>
                            </button>
                            <div className="country-cases-bar"></div>
                        </LocationListItem>
                    );
                })}
            </>
        );
    };

    return (
        <StyledSideBar $sidebaropen={openSidebar} data-cy="sidebar">
            <>
                <SideBarHeader id="sidebar-header">
                    <h1 id="total">MONKEYPOX LINE LIST CASES</h1>
                </SideBarHeader>

                <DataTypeButtons />

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
                            <span className="reported-cases-label">
                                total cases
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
                            <span id="last-updated-date">{lastUpdateDate}</span>
                        )}
                    </div>
                </LatestGlobal>

                <SearchBar className="searchbar">
                    <Autocomplete
                        id="country-select"
                        options={autocompleteData}
                        autoHighlight
                        disabled={totalCasesCountIsLoading}
                        getOptionLabel={(option) => option.name}
                        onChange={(event, value: SelectedCountry | null) =>
                            handleAutocompleteCountrySelect(
                                event,
                                value ? value.name : null,
                            )
                        }
                        isOptionEqualToValue={(option, value) =>
                            option.name === value.name
                        }
                        value={selectedCountry || { name: '' }}
                        renderOption={(props, option) => (
                            <Box
                                component="li"
                                className="autocompleteBox"
                                {...props}
                            >
                                <FlagIcon
                                    loading="lazy"
                                    width="20"
                                    src={`https://flagcdn.com/w20/${getCountryCode(
                                        option.name,
                                    ).toLowerCase()}.png`}
                                    srcSet={`https://flagcdn.com/w40/${getCountryCode(
                                        option.name,
                                    ).toLowerCase()}.png 2x`}
                                    alt={`${option.name} flag`}
                                />
                                {option.name}
                            </Box>
                        )}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Choose a country"
                                inputProps={{
                                    ...params.inputProps,
                                    'data-cy': 'autocomplete-input',
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

            <div id="sidebar-tab" onClick={handleOnClick}>
                <span id="sidebar-tab-icon">{openSidebar ? '◀' : '▶'}</span>
            </div>

            {appVersion && (
                <VersionNumber
                    href={`https://github.com/globaldothealth/list/releases/tag/${appVersion}`}
                    target="_blank"
                    rel="noreferrer"
                >
                    Version: {appVersion}
                </VersionNumber>
            )}
        </StyledSideBar>
    );
};

export default SideBar;
