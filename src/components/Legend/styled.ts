import { styled } from '@mui/system';

export const LegendContainer = styled('div')`
    position: absolute;
    top: 10rem;
    right: 1rem;

    padding: 0.8rem 0.4rem;
    border-radius: 0.3rem;

    background-color: rgba(255, 255, 255, 0.8);
    border: 1px solid #ececec;
    color: #333;
`;

export const Title = styled('p')`
    font-size: 1.4rem;
    font-weight: bold;
    margin-bottom: 1rem;
`;

export const Row = styled('div')`
    display: flex;
    flex-direction: column;
    align-items: center;

    &:not(:last-of-type) {
        margin-bottom: 0.8rem;
    }
`;

interface ColorSampleProps {
    color: string;
}

export const ColorSample = styled('div')<ColorSampleProps>`
    width: 1.4rem;
    height: 1.4rem;
    border: 1px solid #ccc;
    border-radius: 50%;
    background-color: ${(props) => props.color};
    margin-bottom: 0.3rem;
`;

export const Label = styled('p')`
    font-size: 1.4rem;
`;
