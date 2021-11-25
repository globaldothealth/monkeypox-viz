import { StrictMode } from 'react';
import ReactDOM from 'react-dom';
import App from './components/App/App';
import reportWebVitals from './reportWebVitals';
import { GlobalStyle } from './theme/globalStyles';
import { BrowserRouter } from 'react-router-dom';
import { Reset } from 'styled-reset';
import { Normalize } from 'styled-normalize'

ReactDOM.render(
    <StrictMode>
        <BrowserRouter>
            <Reset />
            <Normalize />
            <GlobalStyle />
            <App />
        </BrowserRouter>
    </StrictMode>,
    document.getElementById('root'),
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
