import { useMemo } from 'react';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { SelectChangeEvent } from '@mui/material';

import { useAppSelector, useAppDispatch } from 'redux/hooks';
import {
    selectIsLoading,
    selectChosenCompletenessField,
    selectCompletenessData,
} from 'redux/CoverageView/selectors';
import { setChosenCompletenessField } from 'redux/CoverageView/slice';
import { StyledFormControl } from './styled';

const excludedCompletenessFields = ['SGTF', '_id'];

export const CompletenessDropdown: React.FC = () => {
    const dispatch = useAppDispatch();

    const isLoading = useAppSelector(selectIsLoading);
    const completenessData = useAppSelector(selectCompletenessData);
    const chosenCompletenessField = useAppSelector(
        selectChosenCompletenessField,
    );

    const completenessFields = useMemo(() => {
        if (!completenessData || Object.keys(completenessData).length === 0)
            return [];

        const firstKey = Object.keys(completenessData)[0];
        const fields = Object.keys(completenessData[firstKey]);

        // Filer out chosen fields
        const allowedFields = fields.filter(
            (field) => !excludedCompletenessFields.includes(field),
        );

        // Filter out fields without any data in any country
        const filteredFields = [] as string[];
        for (const key of allowedFields) {
            for (const el of Object.keys(completenessData)) {
                if (completenessData[el] && completenessData[el][key] !== 0) {
                    filteredFields.push(key);
                    break;
                }
            }
        }

        return filteredFields;
    }, [completenessData]);

    const handleChange = (e: SelectChangeEvent<string>) => {
        dispatch(setChosenCompletenessField(e.target.value));
    };

    return (
        <StyledFormControl fullWidth>
            <InputLabel id="completeness-field-label">
                Choose a field
            </InputLabel>
            <Select
                disabled={isLoading}
                labelId="completeness-field-label"
                id="completeness-field-select"
                value={chosenCompletenessField}
                label="Choose a field"
                onChange={handleChange}
            >
                <MenuItem value="cases">Cases</MenuItem>
                {completenessFields.map((field) => (
                    <MenuItem value={field} key={field}>
                        {field}
                    </MenuItem>
                ))}
            </Select>
        </StyledFormControl>
    );
};
