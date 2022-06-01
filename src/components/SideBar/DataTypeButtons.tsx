import ButtonGroup from '@mui/material/ButtonGroup';
import { useAppDispatch, useAppSelector } from 'redux/hooks';
import { setDataType, DataType } from 'redux/App/slice';
import { selectDataType } from 'redux/App/selectors';

import { DataTypeButton } from './styled';

export const DataTypeButtons = () => {
    const dispatch = useAppDispatch();

    const dataType = useAppSelector(selectDataType);

    return (
        <ButtonGroup size="small" disableElevation sx={{ marginTop: '2rem' }}>
            <DataTypeButton
                variant={
                    dataType === DataType.Confirmed ? 'contained' : 'outlined'
                }
                $selected={dataType === DataType.Confirmed}
                onClick={() => dispatch(setDataType(DataType.Confirmed))}
            >
                Confirmed
            </DataTypeButton>
            <DataTypeButton
                variant={
                    dataType === DataType.Suspected ? 'contained' : 'outlined'
                }
                $selected={dataType === DataType.Suspected}
                onClick={() => dispatch(setDataType(DataType.Suspected))}
            >
                Suspected
            </DataTypeButton>
        </ButtonGroup>
    );
};
