import logo from 'assets/images/gh_logo.svg';
import { LogoStyles, LogoImage } from './styled';

export default function GHListLogo(): JSX.Element {
    return (
        <LogoStyles id="logo">
            <a href="https://global.health/">
                <div id="logo-container">
                    <LogoImage src={logo} />
                    <span className="logoText">Map</span>
                </div>
            </a>
        </LogoStyles>
    );
}
