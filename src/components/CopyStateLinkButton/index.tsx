import Fab from '@mui/material/Fab';
import { useEffect, useState } from 'react';
import DoneIcon from '@mui/icons-material/Done';
import LinkIcon from '@mui/icons-material/Link';
import { useAppDispatch, useAppSelector } from 'redux/hooks';
import { selectChartDatePeriod } from 'redux/ChartView/selectors';
import {
    selectCurrentDate,
    selectSelectedCountryInSideBar,
    selectTimeseriesDates,
} from 'redux/App/selectors';
import { URLToFilters } from 'utils/helperFunctions';
import { setPopup, setSelectedCountryInSidebar } from 'redux/App/slice';
import { selectCountriesData } from '../../redux/App/selectors';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

interface CopyStateLinkButtonProps {
    onWhichContainer: 'view' | 'chart';
    adjustMarginBottomRem?: number;
    adjustMarginRightRem?: number;
}

const CopyStateLinkButton = ({
    onWhichContainer,
    adjustMarginBottomRem = 0,
    adjustMarginRightRem = 0,
}: CopyStateLinkButtonProps) => {
    const dispatch = useAppDispatch();

    const chartDatePeriod = useAppSelector(selectChartDatePeriod);
    const selectedCountry = useAppSelector(selectSelectedCountryInSideBar);
    const countriesData = useAppSelector(selectCountriesData);
    const timeseriesDates = useAppSelector(selectTimeseriesDates);
    const currentDate = useAppSelector(selectCurrentDate);

    useEffect(() => {
        const newChartValues = URLToFilters(location.search);

        if (!newChartValues.name || countriesData.length === 0) return;

        for (const country of countriesData) {
            if (country.name === newChartValues.name) {
                dispatch(
                    setSelectedCountryInSidebar({ name: newChartValues.name }),
                );
                dispatch(setPopup({ isOpen: true, countryName: country.name }));

                return;
            }
        }

        dispatch(setPopup({ isOpen: false, countryName: '' }));
        dispatch(setSelectedCountryInSidebar({ name: 'worldwide' }));
        setSnackbarAlertOpen(true);
    }, [location.search, countriesData]);

    const [copyHandler, setCopyHandler] = useState({
        message: `Copy link to ${onWhichContainer}`,
        isCopying: false,
    });

    const [snackbarAlertOpen, setSnackbarAlertOpen] = useState(false);

    const handleCopyLinkButton = () => {
        if (copyHandler.isCopying) return;

        const countryName = selectedCountry
            ? selectedCountry.name
            : 'worldwide';

        if (onWhichContainer === 'chart') {
            navigator.clipboard.writeText(
                `${window.location.href}?name=${countryName}&startDate=${chartDatePeriod[0]}&endDate=${chartDatePeriod[1]}`,
            );
        } else {
            navigator.clipboard.writeText(
                `${
                    window.location.href
                }?name=${countryName}&currDate=${timeseriesDates.indexOf(
                    currentDate || timeseriesDates[timeseriesDates.length - 1],
                )}`,
            );
        }
        setCopyHandler({ message: 'Copied!', isCopying: true });

        setTimeout(() => {
            setCopyHandler({
                message: `Copy link to ${onWhichContainer}`,
                isCopying: false,
            });
        }, 2000);
    };

    return (
        <>
            <Fab
                color="primary"
                variant="extended"
                sx={{
                    position: 'absolute',
                    bottom: '0',
                    right: '0',
                    marginBottom: `${3.75 + adjustMarginBottomRem}rem`,
                    marginRight: `${3.75 + adjustMarginRightRem}rem`,
                    minWidth: `${onWhichContainer.length + 20}ch`,
                }}
                onClick={handleCopyLinkButton}
            >
                {' '}
                {copyHandler.isCopying ? <DoneIcon /> : <LinkIcon />}
                {copyHandler.message}
            </Fab>
            <Snackbar
                open={snackbarAlertOpen}
                onClose={() => setSnackbarAlertOpen(false)}
                autoHideDuration={3000}
                anchorOrigin={{ horizontal: 'center', vertical: 'top' }}
                sx={{ height: '100%' }}
            >
                <Alert severity="error" elevation={6} variant="filled">
                    Unfortunately, there is no data from the country that u
                    selected.
                </Alert>
            </Snackbar>
        </>
    );
};

export default CopyStateLinkButton;
