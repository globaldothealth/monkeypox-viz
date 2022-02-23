import { useEffect, useState } from 'react';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { useAppDispatch, useAppSelector } from 'redux/hooks';
import {
    selectChosenVariantType,
    selectChosenVariant,
} from 'redux/VariantsView/selectors';
import {
    setChosenVariant,
    setChosenVariantType,
} from 'redux/VariantsView/slice';
import { VariantType, VariantsLabels } from 'models/VariantsData';
import useGoogleSheets from 'use-google-sheets';
import { parseVariantData } from 'utils/helperFunctions';

import {
    SelectTitle,
    StyledFormLabel,
    SelectContainer,
    SelectTitleSkeleton,
    SelectSkeleton,
} from './styled';

const VariantsContent: React.FC = () => {
    const dispatch = useAppDispatch();

    const chosenVariantType = useAppSelector(selectChosenVariantType);
    const chosenVariant = useAppSelector(selectChosenVariant);

    const [vocArray, setVocArray] = useState<
        { pango: string; whoLabel: string }[]
    >([]);
    const [voiArray, setVoiArray] = useState<
        { pango: string; whoLabel: string }[]
    >([]);

    // Get data from Google sheets
    const { data, loading, error } = useGoogleSheets({
        apiKey: process.env.REACT_APP_GOOGLE_API_KEY || '',
        sheetId: process.env.REACT_APP_SHEETS_ID || '',
        sheetsNames: [process.env.REACT_APP_SHEET_NAME || ''],
    });

    // Parse VoC and VoI from spreadsheet
    useEffect(() => {
        if (error) {
            alert(error);
            return;
        }
        if (!data || loading) return;

        const { vocList, voiList } = parseVariantData(
            data[0].data as VariantsLabels[],
        );

        setVocArray(vocList);
        setVoiArray(voiList);
        handleVariantChange(
            chosenVariantType === VariantType.Voc
                ? vocList[0].pango
                : voiList[0].pango,
        );
    }, [loading, data, error]);

    const handleVariantTypeChange = (event: any) => {
        const variantType = event.target.value as VariantType;

        dispatch(setChosenVariantType(variantType));
        handleVariantChange(
            variantType === VariantType.Voc
                ? vocArray[0].pango
                : voiArray[0].pango,
        );
    };

    const handleVariantChange = (event: SelectChangeEvent | string) => {
        dispatch(
            setChosenVariant(
                typeof event === 'string' ? event : event.target.value,
            ),
        );
    };

    const renderedVocs = () =>
        vocArray.map((voc) => (
            <MenuItem key={voc.pango} value={voc.pango}>
                {voc.pango.replace('total_', '')} ({voc.whoLabel})
            </MenuItem>
        ));

    const renderedVois = () =>
        voiArray.map((voi) => (
            <MenuItem key={voi.pango} value={voi.pango}>
                {voi.pango.replace('total_', '')} ({voi.whoLabel})
            </MenuItem>
        ));

    return (
        <>
            <FormControl component="fieldset">
                <StyledFormLabel component="legend">
                    Choose variants type
                </StyledFormLabel>
                <RadioGroup
                    value={chosenVariantType}
                    onChange={handleVariantTypeChange}
                    aria-label="variant-type"
                    name="row-radio-buttons-group"
                >
                    <FormControlLabel
                        disabled={loading}
                        value="voc"
                        control={<Radio size="small" />}
                        label="Variants of Concern"
                    />
                    <FormControlLabel
                        disabled={loading}
                        value="voi"
                        control={<Radio size="small" />}
                        label="Variants of Interest"
                    />
                </RadioGroup>
            </FormControl>

            <SelectContainer>
                <SelectTitle>
                    {loading ? (
                        <SelectTitleSkeleton
                            variant="text"
                            animation="pulse"
                            data-cy="loading-skeleton"
                        />
                    ) : (
                        `Choose
                    ${
                        chosenVariantType === VariantType.Voc
                            ? 'Variant of Concern'
                            : 'Variant of Interest'
                    }`
                    )}
                </SelectTitle>
                {loading ? (
                    <SelectSkeleton
                        animation="pulse"
                        variant="rectangular"
                        data-cy="loading-skeleton"
                    />
                ) : (
                    <FormControl fullWidth>
                        <InputLabel id="variant-select-label">
                            Variant
                        </InputLabel>
                        <Select
                            labelId="variant-select-label"
                            id="variant-select"
                            value={vocArray.length === 0 ? '' : chosenVariant}
                            label="Variant"
                            onChange={handleVariantChange}
                        >
                            {chosenVariantType === VariantType.Voc
                                ? renderedVocs()
                                : renderedVois()}
                        </Select>
                    </FormControl>
                )}
            </SelectContainer>
        </>
    );
};

export default VariantsContent;