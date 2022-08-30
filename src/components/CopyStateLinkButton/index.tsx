import { RefObject, useEffect, useState } from 'react';
import DoneIcon from '@mui/icons-material/Done';
import LinkIcon from '@mui/icons-material/Link';
import { useAppDispatch, useAppSelector } from 'redux/hooks';
import { selectChartDatePeriod } from 'redux/ChartView/selectors';
import {
    selectCurrentDate,
    selectDataType,
    selectSelectedCountryInSideBar,
    selectTimeseriesDates,
} from 'redux/App/selectors';
import { URLToFilters } from 'utils/helperFunctions';
import {
    setPopup,
    setSelectedCountryInSidebar,
    setDataType,
    DataType,
} from 'redux/App/slice';
import { selectCountriesData } from '../../redux/App/selectors';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { CopyStateLinkButtonContainer } from './styled';
import { ChartTypeNames } from 'containers/ChartView/index';

interface CopyStateLinkButtonProps {
    onWhichContainer: 'view' | 'chart';
    map?: RefObject<mapboxgl.Map | null>;
    chartType?: ChartTypeNames;
}

const CopyStateLinkButton = ({
    onWhichContainer,
    map,
    chartType,
}: CopyStateLinkButtonProps) => {
    const dispatch = useAppDispatch();

    const chartDatePeriod = useAppSelector(selectChartDatePeriod);
    const selectedCountry = useAppSelector(selectSelectedCountryInSideBar);
    const countriesData = useAppSelector(selectCountriesData);
    const timeseriesDates = useAppSelector(selectTimeseriesDates);
    const currentDate = useAppSelector(selectCurrentDate);
    const dataType = useAppSelector(selectDataType);

    useEffect(() => {
        const newViewValues = URLToFilters(location.search);

        if (!newViewValues.name || countriesData.length === 0) return;

        if (map && map.current) {
            const mapRef = map.current;
            mapRef.setCenter([newViewValues.lng || 40, newViewValues.lat || 0]);
            mapRef.setZoom(newViewValues.zoom || 2.5);
        }

        dispatch(setDataType(handleDataTypeNumber(newViewValues.dataType)));

        if (
            countriesData.find((country) => country.name === newViewValues.name)
        ) {
            dispatch(setSelectedCountryInSidebar({ name: newViewValues.name }));
            dispatch(
                setPopup({ isOpen: true, countryName: newViewValues.name }),
            );
            return;
        }

        dispatch(setPopup({ isOpen: false, countryName: '' }));
        dispatch(setSelectedCountryInSidebar(null));
        setSnackbarAlertOpen(newViewValues.name !== 'worldwide');
    }, [location.search, countriesData]);

    const [copyHandler, setCopyHandler] = useState({
        message: `Copy link to ${onWhichContainer}`,
        isCopying: false,
    });

    const [snackbarAlertOpen, setSnackbarAlertOpen] = useState(false);

    useEffect(() => {
        if (!snackbarAlertOpen) return;
        setTimeout(() => {
            setSnackbarAlertOpen(false);
        }, 3000);
    }, [snackbarAlertOpen]);

    const handleDataTypeNumber = (dataType: DataType | undefined) => {
        const handledNumber = Number(dataType);
        if (!handledNumber || handledNumber > 1 || handledNumber < 0)
            return DataType.Confirmed;
        return DataType.Combined;
    };

    const handleCopyLinkButton = () => {
        const mapRef = map?.current;

        if (copyHandler.isCopying) return;

        const countryName = selectedCountry
            ? selectedCountry.name
            : 'worldwide';

        if (onWhichContainer === 'chart') {
            navigator.clipboard.writeText(
                `${window.location.href}?name=${countryName}&startDate=${
                    chartDatePeriod[0]
                }&endDate=${chartDatePeriod[1]}&chartType=${
                    chartType || ChartTypeNames.Cumulative
                }`,
            );
        } else if (!mapRef) return;
        else {
            const center = mapRef.getCenter().toArray();
            const zoom = mapRef.getZoom();
            const currDate =
                dataType || !currentDate
                    ? timeseriesDates.length - 1
                    : timeseriesDates.indexOf(currentDate);

            navigator.clipboard.writeText(
                `${
                    window.location.href
                }?name=${countryName}&currDate=${currDate}${
                    '&lng=' + center[0] + '&lat=' + center[1] + '&zoom=' + zoom
                }&dataType=${dataType}`,
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
            <CopyStateLinkButtonContainer
                color="primary"
                variant="extended"
                onClick={handleCopyLinkButton}
            >
                {' '}
                {copyHandler.isCopying ? <DoneIcon /> : <LinkIcon />}
                {copyHandler.message}
            </CopyStateLinkButtonContainer>
            <Snackbar
                open={snackbarAlertOpen}
                onClose={() => setSnackbarAlertOpen(false)}
                anchorOrigin={{ horizontal: 'center', vertical: 'top' }}
                sx={{ height: '100%' }}
            >
                <Alert severity="error" variant="filled">
                    Unfortunately, there is no data from the country that you
                    have selected.
                </Alert>
            </Snackbar>
        </>
    );
};

export default CopyStateLinkButton;
