import styled from 'styled-components';

export const Popup = styled.div`
    padding: 0.5rem 1rem;
`;

export const Title = styled.h2`
    font-size: 2.4rem;
    font-weight: 400;
`;

export const Button = styled.button`
    padding: 1rem 2rem;
    border-radius: 0.8rem;
    font-size: 1.2rem;
    font-weight: bold;
    outline: none;
    border: none;
    color: #666666;
    background-color: #ecf3f0;
    cursor: pointer;
    transition: all 0.3s ease-in-out;

    &:hover {
        background-color: #0e7569;
        color: #ffffff;
    }
`;

export const ContentContainer = styled.div`
    font-size: 1.6rem;
    font-weight: bold;
    margin: 1.2rem 0;
`;
