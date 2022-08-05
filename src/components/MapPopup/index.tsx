import { Popup, Title, ContentContainer } from './styled';

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
}: MapPopupProps) => {
    return (
        <Popup>
            <Title>{title}</Title>

            <ContentContainer>{content}</ContentContainer>
        </Popup>
    );
};

export default MapPopup;
