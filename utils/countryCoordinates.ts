// Country coordinates (capital cities or geographic centers)
export const COUNTRY_COORDINATES: Record<string, { lat: number; lng: number; name: string }> = {
    // Asia
    'TH': { lat: 13.7563, lng: 100.5018, name: 'Thailand' },
    'JP': { lat: 35.6762, lng: 139.6503, name: 'Japan' },
    'CN': { lat: 39.9042, lng: 116.4074, name: 'China' },
    'IN': { lat: 28.6139, lng: 77.2090, name: 'India' },
    'KR': { lat: 37.5665, lng: 126.9780, name: 'South Korea' },
    'SG': { lat: 1.3521, lng: 103.8198, name: 'Singapore' },
    'MY': { lat: 3.1390, lng: 101.6869, name: 'Malaysia' },
    'ID': { lat: -6.2088, lng: 106.8456, name: 'Indonesia' },
    'PH': { lat: 14.5995, lng: 120.9842, name: 'Philippines' },
    'VN': { lat: 21.0285, lng: 105.8542, name: 'Vietnam' },
    'PK': { lat: 33.6844, lng: 73.0479, name: 'Pakistan' },
    'BD': { lat: 23.8103, lng: 90.4125, name: 'Bangladesh' },
    'IR': { lat: 35.6892, lng: 51.3890, name: 'Iran' },
    'TR': { lat: 39.9334, lng: 32.8597, name: 'Turkey' },
    'SA': { lat: 24.7136, lng: 46.6753, name: 'Saudi Arabia' },
    'AE': { lat: 24.4539, lng: 54.3773, name: 'UAE' },
    'IL': { lat: 31.7683, lng: 35.2137, name: 'Israel' },

    // Europe
    'GB': { lat: 51.5074, lng: -0.1278, name: 'United Kingdom' },
    'FR': { lat: 48.8566, lng: 2.3522, name: 'France' },
    'DE': { lat: 52.5200, lng: 13.4050, name: 'Germany' },
    'IT': { lat: 41.9028, lng: 12.4964, name: 'Italy' },
    'ES': { lat: 40.4168, lng: -3.7038, name: 'Spain' },
    'NL': { lat: 52.3676, lng: 4.9041, name: 'Netherlands' },
    'BE': { lat: 50.8503, lng: 4.3517, name: 'Belgium' },
    'CH': { lat: 46.9480, lng: 7.4474, name: 'Switzerland' },
    'AT': { lat: 48.2082, lng: 16.3738, name: 'Austria' },
    'SE': { lat: 59.3293, lng: 18.0686, name: 'Sweden' },
    'NO': { lat: 59.9139, lng: 10.7522, name: 'Norway' },
    'DK': { lat: 55.6761, lng: 12.5683, name: 'Denmark' },
    'FI': { lat: 60.1695, lng: 24.9354, name: 'Finland' },
    'PL': { lat: 52.2297, lng: 21.0122, name: 'Poland' },
    'CZ': { lat: 50.0755, lng: 14.4378, name: 'Czech Republic' },
    'PT': { lat: 38.7223, lng: -9.1393, name: 'Portugal' },
    'GR': { lat: 37.9838, lng: 23.7275, name: 'Greece' },
    'RU': { lat: 55.7558, lng: 37.6173, name: 'Russia' },
    'UA': { lat: 50.4501, lng: 30.5234, name: 'Ukraine' },
    'RO': { lat: 44.4268, lng: 26.1025, name: 'Romania' },
    'HU': { lat: 47.4979, lng: 19.0402, name: 'Hungary' },
    'IE': { lat: 53.3498, lng: -6.2603, name: 'Ireland' },

    // North America
    'US': { lat: 38.9072, lng: -77.0369, name: 'United States' },
    'CA': { lat: 45.4215, lng: -75.6972, name: 'Canada' },
    'MX': { lat: 19.4326, lng: -99.1332, name: 'Mexico' },

    // South America
    'BR': { lat: -15.8267, lng: -47.9218, name: 'Brazil' },
    'AR': { lat: -34.6037, lng: -58.3816, name: 'Argentina' },
    'CL': { lat: -33.4489, lng: -70.6693, name: 'Chile' },
    'CO': { lat: 4.7110, lng: -74.0721, name: 'Colombia' },
    'PE': { lat: -12.0464, lng: -77.0428, name: 'Peru' },
    'VE': { lat: 10.4806, lng: -66.9036, name: 'Venezuela' },

    // Africa
    'ZA': { lat: -25.7479, lng: 28.2293, name: 'South Africa' },
    'EG': { lat: 30.0444, lng: 31.2357, name: 'Egypt' },
    'NG': { lat: 9.0765, lng: 7.3986, name: 'Nigeria' },
    'KE': { lat: -1.2864, lng: 36.8172, name: 'Kenya' },
    'MA': { lat: 33.9716, lng: -6.8498, name: 'Morocco' },

    // Oceania
    'AU': { lat: -35.2809, lng: 149.1300, name: 'Australia' },
    'NZ': { lat: -41.2865, lng: 174.7762, name: 'New Zealand' },

    // Additional countries
    'KW': { lat: 29.3759, lng: 47.9774, name: 'Kuwait' },
    'QA': { lat: 25.2854, lng: 51.5310, name: 'Qatar' },
    'OM': { lat: 23.5880, lng: 58.3829, name: 'Oman' },
    'BH': { lat: 26.0667, lng: 50.5577, name: 'Bahrain' },
    'JO': { lat: 31.9454, lng: 35.9284, name: 'Jordan' },
    'LB': { lat: 33.8886, lng: 35.4955, name: 'Lebanon' },
    'SY': { lat: 33.5138, lng: 36.2765, name: 'Syria' },
    'IQ': { lat: 33.3152, lng: 44.3661, name: 'Iraq' },
    'AF': { lat: 34.5553, lng: 69.2075, name: 'Afghanistan' },
    'LK': { lat: 6.9271, lng: 79.8612, name: 'Sri Lanka' },
    'MM': { lat: 16.8661, lng: 96.1951, name: 'Myanmar' },
    'KH': { lat: 11.5564, lng: 104.9282, name: 'Cambodia' },
    'LA': { lat: 17.9757, lng: 102.6331, name: 'Laos' },
    'NP': { lat: 27.7172, lng: 85.3240, name: 'Nepal' },
    'BT': { lat: 27.4728, lng: 89.6393, name: 'Bhutan' },
    'MN': { lat: 47.8864, lng: 106.9057, name: 'Mongolia' },
    'KZ': { lat: 51.1694, lng: 71.4491, name: 'Kazakhstan' },
    'UZ': { lat: 41.2995, lng: 69.2401, name: 'Uzbekistan' },
    'TM': { lat: 37.9601, lng: 58.3261, name: 'Turkmenistan' },
    'KG': { lat: 42.8746, lng: 74.5698, name: 'Kyrgyzstan' },
    'TJ': { lat: 38.5598, lng: 68.7738, name: 'Tajikistan' },
    'AZ': { lat: 40.4093, lng: 49.8671, name: 'Azerbaijan' },
    'AM': { lat: 40.1792, lng: 44.4991, name: 'Armenia' },
    'GE': { lat: 41.7151, lng: 44.8271, name: 'Georgia' },
    'BY': { lat: 53.9045, lng: 27.5615, name: 'Belarus' },
    'MD': { lat: 47.0105, lng: 28.8638, name: 'Moldova' },
    'LT': { lat: 54.6872, lng: 25.2797, name: 'Lithuania' },
    'LV': { lat: 56.9496, lng: 24.1052, name: 'Latvia' },
    'EE': { lat: 59.4370, lng: 24.7536, name: 'Estonia' },
    'SK': { lat: 48.1486, lng: 17.1077, name: 'Slovakia' },
    'SI': { lat: 46.0569, lng: 14.5058, name: 'Slovenia' },
    'HR': { lat: 45.8150, lng: 15.9819, name: 'Croatia' },
    'BA': { lat: 43.8564, lng: 18.4131, name: 'Bosnia and Herzegovina' },
    'RS': { lat: 44.7866, lng: 20.4489, name: 'Serbia' },
    'ME': { lat: 42.4304, lng: 19.2594, name: 'Montenegro' },
    'MK': { lat: 41.9973, lng: 21.4280, name: 'North Macedonia' },
    'AL': { lat: 41.3275, lng: 19.8187, name: 'Albania' },
    'BG': { lat: 42.6977, lng: 23.3219, name: 'Bulgaria' },
    'IS': { lat: 64.1466, lng: -21.9426, name: 'Iceland' },
    'LU': { lat: 49.6116, lng: 6.1319, name: 'Luxembourg' },
    'MT': { lat: 35.8989, lng: 14.5146, name: 'Malta' },
    'CY': { lat: 35.1264, lng: 33.4299, name: 'Cyprus' },
};

export function getCountryCoordinates(countryCode: string): { lat: number; lng: number } | null {
    const coords = COUNTRY_COORDINATES[countryCode.toUpperCase()];
    return coords ? { lat: coords.lat, lng: coords.lng } : null;
}

export function getCountryName(countryCode: string): string | null {
    const coords = COUNTRY_COORDINATES[countryCode.toUpperCase()];
    return coords ? coords.name : null;
}
