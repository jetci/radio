import { Station } from '../types';

export const shareStation = async (station: Station): Promise<boolean> => {
    const shareText = `🎵 ${station.name}\n📍 ${station.country || 'Unknown'}\n🔗 Listen on J Radio`;
    const shareUrl = `${window.location.origin}?station=${encodeURIComponent(station.stationuuid)}`;

    // Try native share API first (mobile)
    if (navigator.share) {
        try {
            await navigator.share({
                title: `J Radio - ${station.name}`,
                text: shareText,
                url: shareUrl
            });
            return true;
        } catch (err) {
            // User cancelled or error occurred
            if ((err as Error).name !== 'AbortError') {
                console.error('Share failed:', err);
            }
        }
    }

    // Fallback to clipboard
    try {
        await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
        return true;
    } catch (err) {
        console.error('Clipboard write failed:', err);
        return false;
    }
};

export const getStationFromUrl = (): string | null => {
    const params = new URLSearchParams(window.location.search);
    return params.get('station');
};
