import Fab from '@mui/material/Fab';
import { useEffect, useState } from 'react';
import DoneIcon from '@mui/icons-material/Done';
import LinkIcon from '@mui/icons-material/Link';
import { useAppDispatch, useAppSelector } from 'redux/hooks';
import { selectChartDatePeriod } from 'redux/ChartView/selectors';
import { selectSelectedCountryInSideBar } from 'redux/App/selectors';
import { URLToFilters } from 'utils/helperFunctions';
import { setPopup, setSelectedCountryInSidebar } from 'redux/App/slice';
import { selectCountriesData } from '../../redux/App/selectors';

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

    useEffect(() => {
        const newChartValues = URLToFilters(location.search);

        if (
            !newChartValues.name ||
            // !selectedCountry ||
            // selectedCountry.name === 'worldwide' ||
            // selectedCountry === undefined ||
            countriesData.length === 0
        )
            return;

        console.log(location);
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
    }, [location.search, countriesData]);

    const [copyHandler, setCopyHandler] = useState({
        message: `Copy link to ${onWhichContainer}`,
        isCopying: false,
    });

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
                `${window.location.href}?name=${countryName}&currDate=`,
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
    );
};

export default CopyStateLinkButton;
