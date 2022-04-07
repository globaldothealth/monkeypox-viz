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
import { setSelectedCountryInSidebar, setPopup } from 'redux/App/slice';
import { selectSelectedCountryInSideBar } from 'redux/App/selectors';
import { CountryDataRow, SelectedCountry } from 'models/CountryData';
import { CompletenessDropdown } from './CompletenessDropdown';
import {
    selectCompletenessData,
    selectChosenCompletenessField,
    selectIsLoading,
} from 'redux/CoverageView/selectors';
import {
    convertStringDateToDate,
    getCountryName,
    getCoveragePercentage,
} from 'utils/helperFunctions';

const SideBar = () => {
    const [openSidebar, setOpenSidebar] = useState(true);
    const [isVariantsView, setIsVariantsView] = useState(false);
    const [isCoverageView, setIsCoverageView] = useState(false);

    const location = useLocation();
    const dispatch = useAppDispatch();

    const totalCasesCount = useAppSelector(selectTotalCases);
    const totalCasesCountIsLoading = useAppSelector(selectTotalCasesIsLoading);
    const lastUpdateDate = useAppSelector(selectLastUpdateDate);
    const completenessData = useAppSelector(selectCompletenessData);
    const chosenCompletenessField = useAppSelector(
        selectChosenCompletenessField,
    );
    const completenessDataLoading = useAppSelector(selectIsLoading);
    const selectedCountry = useAppSelector(selectSelectedCountryInSideBar);

    // Sidebar has other content in VariantsView and CoverageView
    useEffect(() => {
        setIsVariantsView(location.pathname === '/variant-reporting');
        setIsCoverageView(location.pathname === '/coverage');
    }, [location]);

    const countriesData = useAppSelector(selectCountriesData);
    const [autocompleteData, setAutocompleteData] = useState<SelectedCountry[]>(
        [],
    );

    const handleOnClick = () => {
        setOpenSidebar((value) => !value);
    };

    const handleOnCountryClick = (country: SelectedCountry) => {
        dispatch(setSelectedCountryInSidebar(country));
        dispatch(setPopup({ isOpen: true, countryCode: country.code }));
    };

    const handleAutocompleteCountrySelect = (
        event: SyntheticEvent<Element, Event>,
        value: CountryDataRow | SelectedCountry | null,
    ) => {
        if (value === null) return; 

        dispatch(setSelectedCountryInSidebar(value));
        dispatch(setPopup({ isOpen: true, countryCode: value.code }));
    };

    // Parse completeness data in coverage view
    useEffect(() => {
        if (
            isCoverageView &&
            chosenCompletenessField &&
            chosenCompletenessField !== 'cases'
        ) {
            const sortedCompletenessData = [
                ...Object.keys(completenessData),
            ].sort((a, b) =>
                Number(completenessData[a][chosenCompletenessField]) <
                Number(completenessData[b][chosenCompletenessField])
                    ? 1
                    : -1,
            );

            const mappedData: SelectedCountry[] = [];

            // Filter out second Congo result with iso code CDs
            const filteredCompletenessData = sortedCompletenessData.filter(
                (el) => el !== 'CD',
            );

            for (const countryCode of filteredCompletenessData) {
                let countryName = getCountryName(countryCode);
                if (countryName === 'Taiwan, Province of China') {
                    countryName = 'Taiwan';
                }

                mappedData.push({
                    _id: countryName,
                    code: countryCode,
                });
            }

            setAutocompleteData(mappedData);
        } else {
            const mappedData = countriesData.map((el) => {
                let countryName = getCountryName(el.code);
                if (countryName === 'Taiwan, Province of China') {
                    countryName = 'Taiwan';
                }

                return {
                    _id: countryName,
                    code: el.code,
                };
            });

            setAutocompleteData(mappedData);
        }
    }, [isCoverageView, chosenCompletenessField, countriesData]);

    const Countries = () => {
        if (
            isCoverageView &&
            chosenCompletenessField &&
            chosenCompletenessField !== 'cases'
        ) {
            const sortedCompletenessData = [
                ...Object.keys(completenessData),
            ].sort((a, b) => {
                const numberA = Number(
                    completenessData[a][chosenCompletenessField],
                );
                const numberB = Number(
                    completenessData[b][chosenCompletenessField],
                );

                return numberB - numberA;
            });

            // Filter out second Congo result with iso code CDs
            const filteredCompletenessData = sortedCompletenessData.filter(
                (el) => el !== 'CD',
            );

            return (
                <>
                    {filteredCompletenessData.map((countryCode) => {
                        let countryName = getCountryName(countryCode);
                        if (countryName === 'Taiwan, Province of China') {
                            countryName = 'Taiwan';
                        }

                        const percentage = Math.round(
                            completenessData[countryCode][
                                chosenCompletenessField
                            ] as number,
                        );

                        return (
                            <LocationListItem
                                key={countryCode}
                                $barWidth={percentage ? percentage : 0}
                                onClick={() =>
                                    handleOnCountryClick({
                                        _id: countryName,
                                        code: countryCode,
                                    })
                                }
                            >
                                <button>
                                    <span className="label">{countryName}</span>
                                    <span className="num">
                                        {percentage ? percentage : 0}%
                                    </span>
                                </button>
                                <div className="country-cases-bar"></div>
                            </LocationListItem>
                        );
                    })}
                </>
            );
        } else if (isCoverageView && chosenCompletenessField === 'cases') {
            const sortedCountriesData = [...countriesData].sort((a, b) => {
                const coverageA = getCoveragePercentage(a);
                const coverageB = getCoveragePercentage(b);

                return coverageB - coverageA;
            });

            return (
                <>
                    {sortedCountriesData.map((row) => {
                        const coverage = getCoveragePercentage(row);
                        const { code } = row;

                        let countryName = getCountryName(code);
                        if (countryName === 'Taiwan, Province of China') {
                            countryName = 'Taiwan';
                        }
                        return (
                            <LocationListItem
                                key={code}
                                $barWidth={coverage}
                                onClick={() =>
                                    handleOnCountryClick({
                                        _id: countryName,
                                        code,
                                    })
                                }
                                data-cy="listed-country"
                            >
                                <button>
                                    <span className="label">{countryName}</span>
                                    <span className="num">{coverage}%</span>
                                </button>
                                <div className="country-cases-bar"></div>
                            </LocationListItem>
                        );
                    })}
                </>
            );
        }

        return (
            <>
                {countriesData.map((row) => {
                    const { code, casecount } = row;
                    const countryCasesCountPercentage =
                        (casecount / totalCasesCount) * 100;

                    let countryName = getCountryName(code);
                    if (countryName === 'Taiwan, Province of China') {
                        countryName = 'Taiwan';
                    }
                    return (
                        <LocationListItem
                            key={code}
                            $barWidth={countryCasesCountPercentage}
                            onClick={() =>
                                handleOnCountryClick({
                                    _id: countryName,
                                    code,
                                })
                            }
                            data-cy="listed-country"
                        >
                            <button>
                                <span className="label">{countryName}</span>
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
    };

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
                                    {convertStringDateToDate(lastUpdateDate)}
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
                            getOptionLabel={(option) => option._id}
                            onChange={(event, value: SelectedCountry | null) =>
                                handleAutocompleteCountrySelect(event, value)
                            }
                            isOptionEqualToValue={(option, value) =>
                                option.code === value.code
                            }
                            value={selectedCountry || { _id: '', code: '' }}
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
                                        alt={`${option._id} flag`}
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
                                        'data-cy': 'autocomplete-input',
                                    }}
                                />
                            )}
                        />
                    </SearchBar>
                    {isCoverageView && <CompletenessDropdown />}
                    <LocationList>
                        {totalCasesCountIsLoading || completenessDataLoading ? (
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
