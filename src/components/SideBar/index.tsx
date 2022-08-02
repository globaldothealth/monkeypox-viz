import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
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
import {
    getTwoLetterCountryCode,
    getTotalCasesByDate,
    getCountryName,
} from 'utils/helperFunctions';
import { DataTypeButtons } from './DataTypeButtons';

const SideBar = () => {
    const dispatch = useAppDispatch();

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
        const mappedData = countriesData.map((country) => {
            return { name: country.name };
        });

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
        dispatch(setSelectedCountryInSidebar({ name: countryName }));
        dispatch(setPopup({ isOpen: true, countryName }));
    };

    const handleAutocompleteCountrySelect = (
        event: SyntheticEvent<Element, Event>,
        value: string | null,
    ) => {
        if (value === null || value === '') {
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
                    if (totalCasesCountIsLoading || !timeseriesTotalCases)
                        return;

                    const { name, confirmed, combined } = row;

                    const value =
                        dataType === DataType.Confirmed ? confirmed : combined;
                    const totalValue = DataType.Confirmed
                        ? timeseriesTotalCases
                        : totalCasesNumber.total;

                    const countryCasesCountPercentage =
                        (value / totalValue) * 100;

                    return (
                        <LocationListItem
                            key={name}
                            $barWidth={countryCasesCountPercentage}
                            onClick={() => handleOnCountryClick(name)}
                            data-cy="listed-country"
                        >
                            <button>
                                <span className="label">
                                    {getCountryName(name)}
                                </span>
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
                    {totalCasesCountIsLoading || !timeseriesTotalCases ? (
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
                        {totalCasesCountIsLoading || !timeseriesTotalCases ? (
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
                        disabled={totalCasesCountIsLoading}
                        getOptionLabel={(option) => getCountryName(option.name)}
                        onChange={(event, value: SelectedCountry | null) =>
                            handleAutocompleteCountrySelect(
                                event,
                                value ? value.name : null,
                            )
                        }
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
                    {totalCasesCountIsLoading || !timeseriesTotalCases ? (
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
