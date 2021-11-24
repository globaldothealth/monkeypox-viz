import React from 'react';
import logo from '../assets/images/gh_logo.svg';
import styled from 'styled-components';

export default function GHListLogo(): JSX.Element {

    const LogoImage = styled.img`
        border-right: 1px solid #555;
        margin-right: 0.6ex;
        padding-right: 0.6ex;
        object-fit: contain;
        vertical-align: middle;
        width: 5ex;
    `

    const logoStyles = {
        height: '6ex',
        left: '1ex',
        top: '1ex',
        zIndex: 999,
        display: 'flex',
        alignItems: 'center',
        marginRight: '30px'
    };
    return (
        <>
            <div id="logo" style={logoStyles as React.CSSProperties}>
                <a href="https://global.health/">
                    <div id="logo-container">
                        <LogoImage src={logo} />
                        <span>Map</span>{' '}
                    </div>
                </a>
            </div>
        </>
    );
}

{
    /* <svg
version="1.1"
id="ghdata_logo"
width="140"
height="40"
xmlns="http://www.w3.org/2000/svg"
xmlnsXlink="http://www.w3.org/1999/xlink"
x="0px"
y="0px"
viewBox="0 0 4324.1 1211"
style={enableBackground as React.CSSProperties}
xmlSpace="preserve"
>
<style>
    {`.st0 {fill:#221F1F; pointer-events: bounding-box;}
     .st1{fill:#0E766A; pointer-events: bounding-box;}
    .st2{fill:none;stroke:#010101;stroke-width:6;stroke-miterlimit:10;}
    .rect{pointer-events:all}
`}
</style>
<a
    href="https://global.health/"
    data-testid="home-button-gh"
    rel="noopener noreferrer"
>
    <rect
        className="rect"
        fill="none"
        x="0"
        y="0"
        width="1500"
        height="1211"
    />
    <g>
        <path
            className="st0"
            d="M425.4,111.6c91.6,0,156.3,17.2,194.2,51.6c5.9-6.7,11.8-19.9,17.7-42.3h71.4l-34.2,166.3H634
c-12.8-47.7-35.3-83.3-71-106.7c-35.8-23.7-78.8-35.6-129.2-35.6c-93.5,0-155.8,47.9-186.7,143.5c-18.7,57.6-23.2,125-13.6,202.3
c13.6,107.7,57.8,177.2,134.3,203.9c31.3,10.7,107.5,15.1,158.3-30.4c7.2-7.2,11.1-13.6,12-19.2l26-153.9H459.8v-31.2H648
l-37.5,186.6c-5.8,29.2-2.4,50.7-49.6,67.7c-47.2,16.8-96,25.2-146.4,25.2c-50,0-76.9-5-117.8-21.2c-40.8-16.5-71.4-42.2-99.7-70.7
c-58.1-58.7-87.1-131.8-87.1-219.5c0-88,29.2-161.9,87.5-221.9c38.6-40,86.9-67.6,144.8-82.8C371.5,115.4,399.1,111.6,425.4,111.6z
"
        />
        <circle
            className="st1"
            cx="417.1"
            cy="941.2"
            r="110.4"
        />
        <path
            className="st0"
            d="M686.8,1038.2l-77.8,12.2l196-929.7h99.3C842.6,303.3,760,642.3,712.1,827h9.8l19.7-54
c44.1-123.6,92.1-203.9,143.7-240.7c24.6-16.4,44.7-27,60.1-31.9c16.4-4.9,36.5-7.4,60.3-7.4c24.6,0,45.4,9.8,62.6,29.5
c17.3,19.7,25.8,47.1,25.8,82.3c0,35.2-20.1,99.9-60.3,194.1C994.6,892.9,975,953.1,975,979.3s10.2,39.3,30.7,39.3
c15.5,0,32.2-10.2,50.3-30.7c18-21.3,33.7-51.2,46.7-89.7l19.7,4.9c-35.3,99.9-81.1,149.8-137.7,149.8c-50.7,0-76.1-27.8-76.1-83.5
c0-23.8,18.4-82.7,55.3-176.9c37.7-94.2,56.5-154.8,56.5-181.8c0-51.6-18.8-77.4-56.5-77.4c-40.9,0-85.1,33.2-132.7,99.5
C776.5,712.4,729.4,847.5,686.8,1038.2z"
        />
    </g>
</a>
<line
    className="st2"
    x1="1279.9"
    y1="121.5"
    x2="1279.9"
    y2="1051.7"
/>
<Link
    to="/"
    data-testid="home-button-data"
    rel="noopener noreferrer"
>
    <rect
        className="rect"
        fill="none"
        x="1500"
        y="0"
        width="3000"
        height="1211"
    />
    <g>
        <g>
            <path
                className="st1"
                d="M1516.5,118.4H1858c96.3,0,178.6,19.7,246.9,59.1c68.3,39.4,120,94.1,155,164.2s52.6,150.2,52.6,240.4
c0,87.6-17.7,165.8-53.2,234.5c-35.5,68.8-87.4,122.8-155.7,162.2c-68.3,39.4-150.2,59.1-245.6,59.1h-341.5L1516.5,118.4
L1516.5,118.4z M1637.3,927.6H1858c70.9,0,131.3-14.9,181.3-44.7c49.9-29.8,87.8-70.7,113.6-122.8c25.8-52.1,38.8-111.4,38.8-178
c0-107.7-28.9-193.5-86.7-257.5c-57.8-63.9-140.1-95.9-246.9-95.9h-220.7V927.6z"
            />
            <path
                className="st1"
                d="M2486.5,999.2c-39.8-34.6-59.8-80.8-59.8-138.6c0-63.9,21.7-112.1,65-144.5c43.3-32.4,98.7-48.6,166.2-48.6
c46.4,0,90.6,6.6,132.7,19.7l56.5,15.8v-64.4c0-45.5-14.5-80.3-43.4-104.4c-28.9-24.1-66.6-36.1-113-36.1
c-44.7,0-81.4,11.4-110.3,34.2c-28.9,22.8-47.3,54.3-55.2,94.6l-102.4-28.9c12.3-59.5,41.8-107,88.6-142.5
c46.8-35.5,106.6-53.2,179.3-53.2c84.9,0,150.4,21.7,196.4,65c46,43.4,69,103.6,69,180.6v390.1h-109v-98.5
c-15.8,33.3-42.9,60.2-81.4,80.8c-38.6,20.6-82.8,30.9-132.7,30.9C2575.2,1051.1,2526.4,1033.8,2486.5,999.2z M2797.9,912.5
c32.9-25.8,49.3-61.5,49.3-107.1v-13.1l-57.8-17.1c-43.8-13.1-82.3-19.7-115.6-19.7c-40.3,0-72,8.3-95.2,25
c-23.2,16.6-34.8,41.2-34.8,73.6c0,28.9,10.9,52.3,32.9,70.3c21.9,18,53.4,26.9,94.6,26.9C2722.8,951.2,2765,938.3,2797.9,912.5z"
            />
            <path
                className="st1"
                d="M3217.5,998.5c-35-35-52.6-83.6-52.6-145.8V511.2h-123.5v-95.9H3165V222.2h114.3v193.1h223.3v95.9h-223.3V858
c0,29.8,8.1,52.8,24.3,69c16.2,16.2,36.6,24.3,61.1,24.3c26.3,0,47.1-7.7,62.4-23s25.6-40.1,30.9-74.2l105.1,23.6
c-8.8,56-30,99-63.7,128.7s-77.3,44.7-130.7,44.7C3302.9,1051.1,3252.6,1033.6,3217.5,998.5z"
            />
            <path
                className="st1"
                d="M3718.7,999.2c-39.8-34.6-59.8-80.8-59.8-138.6c0-63.9,21.7-112.1,65-144.5c43.3-32.4,98.7-48.6,166.2-48.6
c46.4,0,90.6,6.6,132.7,19.7l56.5,15.8v-64.4c0-45.5-14.5-80.3-43.4-104.4c-28.9-24.1-66.6-36.1-113-36.1
c-44.7,0-81.4,11.4-110.3,34.2c-28.9,22.8-47.3,54.3-55.2,94.6L3655,597.9c12.3-59.5,41.8-107,88.6-142.5
c46.8-35.5,106.6-53.2,179.3-53.2c84.9,0,150.4,21.7,196.4,65c46,43.4,69,103.6,69,180.6v390.1h-109v-98.5
c-15.8,33.3-42.9,60.2-81.4,80.8c-38.6,20.6-82.8,30.9-132.7,30.9C3807.3,1051.1,3758.5,1033.8,3718.7,999.2z M4030,912.5
c32.9-25.8,49.3-61.5,49.3-107.1v-13.1l-57.8-17.1c-43.8-13.1-82.3-19.7-115.6-19.7c-40.3,0-72,8.3-95.2,25
c-23.2,16.6-34.8,41.2-34.8,73.6c0,28.9,10.9,52.3,32.9,70.3c21.9,18,53.4,26.9,94.6,26.9C3954.9,951.2,3997.1,938.3,4030,912.5z"
            />
        </g>
    </g>
</Link>
</svg> */
}
