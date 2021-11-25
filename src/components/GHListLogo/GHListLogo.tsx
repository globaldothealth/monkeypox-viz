import React from 'react';
import logo from '../../assets/images/gh_logo.svg';
import { LogoStyles } from './gHListLogoStyles';
import { LogoImage } from './gHListLogoStyles';

export default function GHListLogo(): JSX.Element {

    return (
        <>
            <LogoStyles id="logo">
                <a href="https://global.health/">
                    <div id="logo-container">
                        <LogoImage src={logo} />
                        <span className="logoText">Map</span>
                    </div>
                </a>
            </LogoStyles>
        </>
    );
}

