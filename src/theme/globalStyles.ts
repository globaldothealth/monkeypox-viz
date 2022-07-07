import styled, { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  html {
    font-size: 62.5%;
  }
  
  body {
    margin: 0;    
    font-family: "Inter", Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    font-size: 1.6rem;
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  .mapboxgl-popup {
    z-index: 999;    
    max-width: 50rem !important;
  }

  .mapboxgl-popup-close-button {
    font-size: 2.4rem;
    color: #8796A5;
    top: 1rem;
    right: 1rem;
  }
`;

interface MapContainerProps {
    isLoading: boolean;
}

export const MapContainer = styled.div<MapContainerProps>`
    position: absolute;
    top: 6.4rem;
    left: 0;
    width: 100vw;
    height: calc(100vh - 6.4rem);
    transition: opacity 0.5s ease-in-out;

    opacity: ${(props) => (props.isLoading ? '0' : '1')};
`;
