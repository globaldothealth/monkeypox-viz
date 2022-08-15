import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { useLocation } from 'react-router-dom';
import { useState, SyntheticEvent, useEffect } from 'react';
import {
    selectCountriesData,
    selectLastUpdateDate,
    selectTotalCasesNumber,
    selectAppVersion,
    selectDataType,
    selectCurrentDate,
    selectTimeseriesCaseCounts,
    selectIsCaseCountsLoading,
} from 'redux/App/selectors';
import { useAppDispatch, useAppSelector } from 'redux/hooks';
import {
    FlagIcon,
    LatestGlobal,
    LocationList,
    LocationListItem,
    CountryLabel,
    CountryCaseCount,
    CaseCountsBar,
    SearchBar,
    SideBarHeader,
    StyledSideBar,
    SideBarTitlesSkeleton,
    CountriesListSkeleton,
    VersionNumber,
    EmptyFlag,
} from './styled';
import {
    setSelectedCountryInSidebar,
    setPopup,
    DataType,
    setCountriesData,
} from 'redux/App/slice';
import { selectSelectedCountryInSideBar } from 'redux/App/selectors';
import { SelectedCountry } from 'models/CountryData';
import {
    getTwoLetterCountryCode,
    getTotalCasesByDate,
    getCountryName,
} from 'utils/helperFunctions';
import { DataTypeButtons } from './DataTypeButtons';

const SideBar = () => {
    const dispatch = useAppDispatch();
    const location = useLocation();

    const [openSidebar, setOpenSidebar] = useState(true);
    const [timeseriesTotalCases, setTimeseriesTotalCases] = useState<number>();

    const totalCasesNumber = useAppSelector(selectTotalCasesNumber);
    const totalCasesCountIsLoading = useAppSelector(selectIsCaseCountsLoading);
    const lastUpdateDate = useAppSelector(selectLastUpdateDate);
    const selectedCountry = useAppSelector(selectSelectedCountryInSideBar);
    const appVersion = useAppSelector(selectAppVersion);
    const dataType = useAppSelector(selectDataType);
    const currentDate = useAppSelector(selectCurrentDate);
    const timeseriesCaseCounts = useAppSelector(selectTimeseriesCaseCounts);

    const countriesData = useAppSelector(selectCountriesData);
    const [autocompleteData, setAutocompleteData] = useState<SelectedCountry[]>(
        [],
    );

    // Map countries data to autocomplete data
    useEffect(() => {
        let mappedData = countriesData.map((country) => {
            return { name: country.name };
        });

        // Add worldwide option
        mappedData = [{ name: 'worldwide' }, ...mappedData];

        setAutocompleteData(mappedData);
    }, [countriesData]);

    // Sort countries based on number of cases
    useEffect(() => {
        if (!countriesData || countriesData.length === 0) return;

        const sortBy =
            dataType === DataType.Confirmed ? 'confirmed' : 'combined';

        const sortedCountries = [...countriesData].sort((a, b) =>
            a[sortBy] < b[sortBy] ? 1 : -1,
        );
        dispatch(setCountriesData(sortedCountries));
        // eslint-disable-next-line
    }, [dataType]);

    // Update total cases count whenever current date in timeseries changes
    useEffect(() => {
        if (!currentDate || !timeseriesCaseCounts) return;

        setTimeseriesTotalCases(
            getTotalCasesByDate(timeseriesCaseCounts, currentDate),
        );
    }, [currentDate, timeseriesCaseCounts]);

    const handleOnClick = () => {
        setOpenSidebar((value) => !value);
    };

    const handleOnCountryClick = (countryName: string) => {
        if (selectedCountry && countryName === selectedCountry.name) {
            dispatch(setSelectedCountryInSidebar({ name: 'worldwide' }));
            dispatch(setPopup({ isOpen: false, countryName: 'worldwide' }));
        } else {
            dispatch(setSelectedCountryInSidebar({ name: countryName }));
            dispatch(setPopup({ isOpen: true, countryName }));
        }
    };

    const handleAutocompleteCountrySelect = (
        event: SyntheticEvent<Element, Event>,
        value: SelectedCountry | string | null,
    ) => {
        if (value === null || value === '') {
            dispatch(setSelectedCountryInSidebar(null));
        } else if (typeof value === 'string') {
            dispatch(setSelectedCountryInSidebar({ name: value }));
            dispatch(setPopup({ isOpen: true, countryName: value }));
        } else {
            dispatch(setSelectedCountryInSidebar({ name: value.name }));
            dispatch(setPopup({ isOpen: true, countryName: value.name }));
        }
    };

    const Countries = () => {
        return (
            <>
                <LocationListItem
                    onClick={() => handleOnCountryClick('worldwide')}
                    data-cy="listed-country"
                    isActive={
                        selectedCountry
                            ? selectedCountry.name === 'worldwide'
                            : true
                    }
                >
                    <>
                        <EmptyFlag>-</EmptyFlag>
                        <CountryLabel
                            isActive={
                                selectedCountry
                                    ? selectedCountry.name === 'worldwide'
                                    : true
                            }
                            variant="body2"
                        >
                            {getCountryName('worldwide')}
                        </CountryLabel>
                    </>
                    <CountryCaseCount
                        isActive={
                            selectedCountry
                                ? selectedCountry.name === 'worldwide'
                                : true
                        }
                        variant="body2"
                    >
                        {dataType === DataType.Confirmed
                            ? totalCasesNumber.confirmed.toLocaleString()
                            : totalCasesNumber.total.toLocaleString()}
                    </CountryCaseCount>
                </LocationListItem>

                {countriesData.map((row) => {
                    if (
                        totalCasesCountIsLoading ||
                        timeseriesTotalCases === undefined
                    )
                        return;

                    const { name, confirmed, combined } = row;

                    const value =
                        dataType === DataType.Confirmed ? confirmed : combined;
                    const totalValue = DataType.Confirmed
                        ? timeseriesTotalCases
                        : totalCasesNumber.total;

                    const countryCasesCountPercentage =
                        (value / totalValue) * 100;

                    const isActive = selectedCountry
                        ? selectedCountry.name === name
                        : false;

                    return (
                        <LocationListItem
                            key={name}
                            onClick={() => handleOnCountryClick(name)}
                            data-cy="listed-country"
                            isActive={isActive}
                        >
                            <>
                                <FlagIcon
                                    loading="lazy"
                                    src={`https://flagcdn.com/w20/${getTwoLetterCountryCode(
                                        name,
                                    ).toLowerCase()}.png`}
                                    srcSet={`https://flagcdn.com/w40/${getTwoLetterCountryCode(
                                        name,
                                    ).toLowerCase()}.png 2x`}
                                    alt={`${name} flag`}
                                />
                                <CountryLabel
                                    isActive={isActive}
                                    variant="body2"
                                >
                                    {getCountryName(name)}
                                </CountryLabel>
                            </>
                            <CountryCaseCount
                                isActive={isActive}
                                variant="body2"
                            >
                                {value.toLocaleString()}
                            </CountryCaseCount>
                            <CaseCountsBar
                                barWidth={countryCasesCountPercentage}
                            />
                        </LocationListItem>
                    );
                })}
            </>
        );
    };

    return (
        <StyledSideBar sidebaropen={openSidebar} data-cy="sidebar">
            <>
                <SideBarHeader id="sidebar-header">
                    <h1 id="total">MONKEYPOX LINE LIST CASES</h1>
                </SideBarHeader>

                {location.pathname !== '/chart' && <DataTypeButtons />}

                <LatestGlobal id="latest-global">
                    {totalCasesCountIsLoading ||
                    timeseriesTotalCases === undefined ? (
                        <SideBarTitlesSkeleton
                            animation="pulse"
                            variant="rectangular"
                            data-cy="loading-skeleton"
                        />
                    ) : (
                        <>
                            <span id="total-cases" className="active">
                                {dataType === DataType.Confirmed
                                    ? timeseriesTotalCases.toLocaleString()
                                    : totalCasesNumber.total.toLocaleString()}
                            </span>
                            <span className="reported-cases-label">
                                {dataType === DataType.Confirmed
                                    ? 'confirmed cases'
                                    : 'confirmed and suspected cases'}
                            </span>
                        </>
                    )}
                    <div className="last-updated-date">
                        {totalCasesCountIsLoading ||
                        timeseriesTotalCases === undefined ? (
                            <SideBarTitlesSkeleton
                                animation="pulse"
                                variant="rectangular"
                                data-cy="loading-skeleton"
                            />
                        ) : (
                            <span id="last-updated-date">
                                Updated: {lastUpdateDate}
                            </span>
                        )}
                    </div>
                </LatestGlobal>

                <SearchBar className="searchbar">
                    <Autocomplete
                        id="country-select"
                        options={autocompleteData}
                        autoHighlight
                        popupIcon={<></>}
                        disabled={totalCasesCountIsLoading}
                        getOptionLabel={(option) =>
                            getCountryName(
                                typeof option === 'string'
                                    ? option
                                    : option.name,
                            )
                        }
                        onChange={(
                            event,
                            value: SelectedCountry | string | null,
                        ) => handleAutocompleteCountrySelect(event, value)}
                        isOptionEqualToValue={(option, value) =>
                            option.name === value.name
                        }
                        value={selectedCountry}
                        renderOption={(props, option) => (
                            <Box
                                component="li"
                                className="autocompleteBox"
                                {...props}
                            >
                                {option.name === 'worldwide' ? (
                                    <EmptyFlag>-</EmptyFlag>
                                ) : (
                                    <FlagIcon
                                        loading="lazy"
                                        width="20"
                                        src={`https://flagcdn.com/w20/${getTwoLetterCountryCode(
                                            option.name,
                                        ).toLowerCase()}.png`}
                                        srcSet={`https://flagcdn.com/w40/${getTwoLetterCountryCode(
                                            option.name,
                                        ).toLowerCase()}.png 2x`}
                                        alt={`${option.name} flag`}
                                    />
                                )}

                                {getCountryName(option.name)}
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
                    {totalCasesCountIsLoading ||
                    timeseriesTotalCases === undefined ? (
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
