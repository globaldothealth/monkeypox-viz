import logo from 'assets/images/ukraine_logo.svg';
import { LogoStyles, LogoImage, LogoText } from './styled';
import { Link } from 'react-router-dom';
import MapGuide from 'components/MapGuide';

export default function GHListLogo(): JSX.Element {
    const env = process.env.NODE_ENV;

    return (
        <LogoStyles id="logo">
            <div id="logo-container">
                <a
                    href={
                        env === 'production'
                            ? 'https://global.health/'
                            : 'http://dev-globalhealth.pantheonsite.io/'
                    }
                >
                    <LogoImage src={logo} />
                </a>

                <Link to="/country">
                    <LogoText className="logoText">Map</LogoText>
                </Link>
            </div>

            <MapGuide />
        </LogoStyles>
    );
}
