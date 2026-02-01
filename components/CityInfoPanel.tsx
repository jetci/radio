import React, { useState, useEffect } from 'react';
import { MapPin, Clock, Radio, Sparkles, X } from 'lucide-react';
import { Station } from '../types';
import { geminiService } from '../services/geminiService';

interface CityInfoPanelProps {
    station: Station | null;
    allStations: Station[];
    theme: 'dark' | 'light';
    onClose?: () => void;
}

const CityInfoPanel: React.FC<CityInfoPanelProps> = ({
    station,
    allStations,
    theme,
    onClose
}) => {
    const [localTime, setLocalTime] = useState<string>('');
    const [cityFact, setCityFact] = useState<string>('');
    const [isLoadingFact, setIsLoadingFact] = useState(false);
    const [stationCount, setStationCount] = useState(0);

    // Update local time every second
    useEffect(() => {
        if (!station) return;

        const updateTime = () => {
            try {
                // Get timezone from coordinates (approximate)
                const timezone = getTimezoneFromCoords(station.geo_lat, station.geo_long);
                const now = new Date();
                const timeString = now.toLocaleTimeString('en-US', {
                    timeZone: timezone,
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: false
                });
                setLocalTime(timeString);
            } catch (error) {
                setLocalTime('--:--:--');
            }
        };

        updateTime();
        const interval = setInterval(updateTime, 1000);
        return () => clearInterval(interval);
    }, [station]);

    // Count stations in the same city/state
    useEffect(() => {
        if (!station) return;

        const count = allStations.filter(s =>
            s.state === station.state &&
            s.country === station.country
        ).length;

        setStationCount(count);
    }, [station, allStations]);

    // Fetch city fact from Gemini AI
    useEffect(() => {
        if (!station || !station.state || !station.country) return;

        // ปิด Gemini API ชั่วคราว (ไม่มี backend)
        setIsLoadingFact(false);
        setCityFact('Discover the local culture through radio waves...');

        // const fetchCityFact = async () => {
        //     setIsLoadingFact(true);
        //     try {
        //         const fact = await geminiService.getCityFact(
        //             station.state || station.country,
        //             station.country
        //         );
        //         setCityFact(fact);
        //     } catch (error) {
        //         console.error('Failed to fetch city fact:', error);
        //         setCityFact('Discover the local culture through radio waves...');
        //     } finally {
        //         setIsLoadingFact(false);
        //     }
        // };
        // fetchCityFact();
    }, [station?.stationuuid]);

    if (!station) return null;

    const cityName = station.state || station.country || 'Unknown Location';
    const countryName = station.country || 'Unknown Country';

    // Theme-aware styles
    const bgColor = theme === 'dark'
        ? 'bg-black/90 border-white/10'
        : 'bg-white/90 border-gray-200';
    const textPrimary = theme === 'dark' ? 'text-white' : 'text-gray-900';
    const textSecondary = theme === 'dark' ? 'text-white/60' : 'text-gray-600';
    const accentColor = theme === 'dark' ? 'text-[#00ff41]' : 'text-blue-600';
    const accentBg = theme === 'dark' ? 'bg-[#00ff41]/10' : 'bg-blue-50';

    // ตรวจสอบว่ามีพิกัดหรือไม่
    const hasCoordinates = station.geo_lat && station.geo_long &&
        !(station.geo_lat === 0 && station.geo_long === 0);

    return (
        <div
            className={`fixed z-40 backdrop-blur-xl shadow-2xl transition-all duration-500 ${bgColor}
                /* Mobile: Compact Floating Card */
                top-4 left-4 w-auto max-w-[calc(63%-20px)] rounded-2xl p-2 md:p-3 border
                /* Desktop: Top Left Card */
                md:top-6 md:left-6 md:max-w-sm md:rounded-3xl md:p-5
            `}
        >
            {/* Compact Header (Radio Garden Style) */}
            <div className="flex items-center gap-2 md:gap-3">
                <div className={`p-1.5 md:p-2 rounded-full ${accentBg} flex-shrink-0`}>
                    <MapPin className={`w-3.5 h-3.5 md:w-[18px] md:h-[18px] ${accentColor}`} />
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-1.5 md:gap-2">
                        <h3 className={`text-sm md:text-base font-bold ${textPrimary} truncate`}>
                            {cityName}
                        </h3>
                        <span className={`text-[10px] md:text-xs ${textSecondary} font-mono whitespace-nowrap`}>
                            {localTime}
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <p className={`text-[10px] md:text-xs ${textSecondary} truncate`}>
                            {countryName}
                        </p>
                        {!hasCoordinates && (
                            <span className={`text-[10px] px-2 py-0.5 rounded-full ${theme === 'dark'
                                ? 'bg-orange-500/20 text-orange-400'
                                : 'bg-orange-100 text-orange-600'
                                }`}>
                                ไม่แสดงบน Globe
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

// Helper function to get approximate timezone from coordinates
function getTimezoneFromCoords(lat: number | null, lng: number | null): string {
    if (!lat || !lng) return 'UTC';

    // Approximate timezone based on longitude
    // This is a simplified approach; for production, use a proper timezone API
    const offset = Math.round(lng / 15);

    // Map to IANA timezone (simplified)
    const timezoneMap: { [key: number]: string } = {
        '-12': 'Pacific/Wake',
        '-11': 'Pacific/Midway',
        '-10': 'Pacific/Honolulu',
        '-9': 'America/Anchorage',
        '-8': 'America/Los_Angeles',
        '-7': 'America/Denver',
        '-6': 'America/Chicago',
        '-5': 'America/New_York',
        '-4': 'America/Halifax',
        '-3': 'America/Sao_Paulo',
        '-2': 'Atlantic/South_Georgia',
        '-1': 'Atlantic/Azores',
        '0': 'Europe/London',
        '1': 'Europe/Paris',
        '2': 'Europe/Athens',
        '3': 'Europe/Moscow',
        '4': 'Asia/Dubai',
        '5': 'Asia/Karachi',
        '6': 'Asia/Dhaka',
        '7': 'Asia/Bangkok',
        '8': 'Asia/Singapore',
        '9': 'Asia/Tokyo',
        '10': 'Australia/Sydney',
        '11': 'Pacific/Noumea',
        '12': 'Pacific/Fiji'
    };

    return timezoneMap[offset] || 'UTC';
}

export default CityInfoPanel;
