import { StrictMode } from 'react';
import ReactDOM from 'react-dom';
import App from 'containers/App';
import reportWebVitals from 'reportWebVitals';
import { GlobalStyle } from 'theme/globalStyles';
import { store } from 'redux/store';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import ThemeProvider from '@mui/material/styles/ThemeProvider';
import { theme } from 'theme/theme';
import 'mapbox-gl/dist/mapbox-gl.css';

ReactDOM.render(
    <StrictMode>
        <Provider store={store}>
            <ThemeProvider theme={theme}>
                <Router>
                    <GlobalStyle />
                    <App />
                </Router>
            </ThemeProvider>
        </Provider>
    </StrictMode>,
    document.getElementById('root'),
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
