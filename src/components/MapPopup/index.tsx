import {
    Popup,
    Title,
    Button,
    ContentContainer,
    UploadDateContainer,
    UploadDateLabel,
    UploadDate,
} from './styled';

interface MapPopupProps {
    title: string;
    content: JSX.Element;
    lastUploadDate?: string;
    buttonText?: string;
    buttonUrl?: string;
}

const MapPopup: React.FC<MapPopupProps> = ({
    title,
    content,
    lastUploadDate,
    buttonText,
    buttonUrl,
}: MapPopupProps) => {
    const handleButtonClick = () => {
        if (!buttonUrl) return;

        window.open(buttonUrl, '_blank');
    };

    return (
        <Popup>
            <Title>{title}</Title>

            <ContentContainer>
                {content}

                {lastUploadDate && lastUploadDate !== 'unknown' && (
                    <UploadDateContainer>
                        <UploadDateLabel>
                            Last updated:{' '}
                            <UploadDate>{lastUploadDate}</UploadDate>
                        </UploadDateLabel>
                    </UploadDateContainer>
                )}
            </ContentContainer>

            {buttonText && buttonUrl && (
                <Button type="button" onClick={handleButtonClick}>
                    {buttonText}
                </Button>
            )}
        </Popup>
    );
};

export default MapPopup;
