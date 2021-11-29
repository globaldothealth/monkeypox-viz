import { Popup, Title, Button, ContentContainer } from './styled';

interface MapPopupProps {
    title: string;
    content: JSX.Element;
    buttonText?: string;
    buttonUrl?: string;
}

const MapPopup: React.FC<MapPopupProps> = ({
    title,
    content,
    buttonText,
    buttonUrl,
}: MapPopupProps) => {
    const handleButtonClick = () => {
        if (!buttonUrl) return;

        window.location.href = buttonUrl;
    };

    return (
        <Popup>
            <Title>{title}</Title>

            <ContentContainer>{content}</ContentContainer>

            {buttonText && buttonUrl && (
                <Button type="button" onClick={handleButtonClick}>
                    {buttonText}
                </Button>
            )}
        </Popup>
    );
};

export default MapPopup;
