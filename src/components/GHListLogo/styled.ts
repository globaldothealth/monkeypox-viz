import styled from 'styled-components';

export const LogoStyles = styled.div`
    height: 6ex;
    left: 1ex;
    top: 1ex;
    z-index: 999;
    display: flex;
    align-items: center;
    margin-right: 3rem;
`;

export const LogoImage = styled.img`
    border-right: 1px solid #555;
    margin-right: 0.6ex;
    padding-right: 0.6ex;
    object-fit: contain;
    vertical-align: middle;
    width: 5ex;
    ~ .logoText {
        color: #0094e2;
        font-size: 5ex;
        vertical-align: middle;
        font-family: 'Mabry Pro';
    }
`;
