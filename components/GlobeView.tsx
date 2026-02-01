import React, { useEffect, useRef, useState, useMemo } from 'react';
import Globe from 'react-globe.gl';
import { Station } from '../types';
import { spreadOverlappingPoints, getOverlapStats } from '../utils/spreadPoints';
import { clusterStationsByCity, filterClustersByZoom, getClusterSize, spreadClusterStations, CityCluster } from '../utils/cityCluster';

interface GlobeViewProps {
  stations: Station[];
  onSelectStation: (station: Station) => void;
  activeStation: Station | null;
  selectedStation?: Station | null; // สถานีที่เลือกจาก Settings/Browse
  userCountryCoords: { lat: number; lng: number } | null;
  showStartOverlay: boolean;
  theme: 'dark' | 'light';
  onGlobeRotate?: (coords: { lat: number; lng: number }) => void; // Callback เมื่อหมุนโลก
}

const GlobeView: React.FC<GlobeViewProps> = ({
  stations,
  onSelectStation,
  activeStation,
  selectedStation,
  userCountryCoords,
  showStartOverlay,
  theme,
  onGlobeRotate
}) => {
  const globeEl = useRef<any>(null);
  const [dimensions, setDimensions] = useState({ width: window.innerWidth, height: window.innerHeight });
  const [hoveredPoint, setHoveredPoint] = useState<any>(null);
  const [hasInitialFocus, setHasInitialFocus] = useState(false);
  const [currentAltitude, setCurrentAltitude] = useState(2.5);
  const [useClustering, setUseClustering] = useState(false); // Show all stations individually (Radio Garden style)
  const [isClickProcessing, setIsClickProcessing] = useState(false); // Prevent double-clicks
  const clickTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleResize = () => setDimensions({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Trust the parent component (App.tsx) to have filtered/mapped stations correctly.
  // We just ensure we don't crash on completely null coordinates.
  const validStations = useMemo(() => {
    return stations.filter(s =>
      (s.geo_lat !== undefined && s.geo_lat !== null) &&
      (s.geo_long !== undefined && s.geo_long !== null)
    );
  }, [stations]);

  // City Clustering (Radio Garden style)
  // Group stations by city instead of showing individual dots
  const cityClusters = useMemo(() => {
    if (!useClustering) {
      // Fallback to old spreading algorithm
      const result = spreadOverlappingPoints(validStations);
      return null;
    }
    console.log(`🏙️ Starting clustering for ${validStations.length} stations...`);
    const clusters = clusterStationsByCity(validStations);
    console.log(`✅ Created ${clusters.length} city clusters`);
    if (clusters.length > 0) {
      console.log(`   Sample cluster:`, clusters[0].name, `(${clusters[0].stationCount} stations)`);
    }
    console.log('🏙️ City Clustering Stats:', {
      totalStations: validStations.length,
      totalCities: clusters.length,
      avgStationsPerCity: (validStations.length / clusters.length).toFixed(1),
      largestCity: clusters.reduce((max, c) => c.stationCount > max ? c.stationCount : max, 0)
    });
    return clusters;
  }, [validStations, useClustering]);

  // Filter clusters based on zoom level (Progressive disclosure)
  const visibleClusters = useMemo(() => {
    if (!cityClusters) return null;
    const filtered = filterClustersByZoom(cityClusters, currentAltitude);
    console.log(`🔍 Zoom ${currentAltitude.toFixed(2)}: Showing ${filtered.length}/${cityClusters.length} cities`);
    return filtered;
  }, [cityClusters, currentAltitude]);

  // Fallback: Use old spreading algorithm if clustering is disabled
  const spreadPoints = useMemo(() => {
    if (useClustering) return [];
    return spreadOverlappingPoints(validStations);
  }, [validStations, useClustering]);

  // Prepare data for WebGL Points (High Performance)
  const markerData = useMemo(() => {
    // CLUSTERING MODE: Show individual stations with micro-spreading
    if (useClustering && visibleClusters) {
      console.log(`🎯 Processing ${visibleClusters.length} clusters for display`);
      const data: any[] = [];
      
      visibleClusters.forEach((cluster, clusterIndex) => {
        // Spread stations within each cluster to prevent overlap
        const spreadStations = spreadClusterStations(cluster);
        
        if (clusterIndex === 0) {
          console.log(`📍 First cluster:`, cluster.name, `Stations:`, spreadStations.length);
          if (spreadStations.length > 0) {
            console.log(`   First station display coords:`, spreadStations[0].displayLat, spreadStations[0].displayLng);
          }
        }
        
        spreadStations.forEach((station) => {
          const isSelected = activeStation?.stationuuid === station.stationuuid;
          const isHovered = hoveredPoint?.stationuuid === station.stationuuid;

          // Size based on popularity (Radio Garden style)
          // Most stations are tiny, popular ones are bigger
          const votes = station.votes || 0;
          const clickcount = station.clickcount || 0;
          
          // Popularity score (votes + clicks)
          const popularity = votes + (clickcount / 100);
          
          // Logarithmic scaling for natural size distribution
          const popularityScore = Math.log(popularity + 1);
          const maxPopularity = Math.log(10000); // Assume max ~10k votes
          const normalizedPopularity = Math.min(popularityScore / maxPopularity, 1);
          
          // Visible base size (Enhanced for first-time users - 50% larger)
          const minSize = 0.03;  // ~3.3km (clearly visible when zoomed out)
          const maxSize = 0.12;  // ~13km (popular stations stand out)
          const baseSize = minSize + (normalizedPopularity * (maxSize - minSize));
          
          // Selected/hovered states
          const size = isSelected ? 0.25 : (isHovered ? baseSize * 1.4 : baseSize); // เพิ่มขนาด active

          let color;
          if (isSelected) color = theme === 'dark' ? '#ff0000' : '#ff0000'; // สีแดงสดเด่นชัด
          else if (isHovered) color = '#00ff41';
          else color = theme === 'dark' ? '#00ff41' : '#3b82f6';

          data.push({
            lat: station.displayLat,
            lng: station.displayLng,
            size: size,
            color: color,
            stationuuid: station.stationuuid,
            station: station,
            clusterId: cluster.id,
            isCluster: false
          });
        });
      });
      
      console.log(`📊 Marker Data (Micro-Spreading): ${data.length} stations from ${visibleClusters.length} clusters`);
      if (data.length > 0) {
        console.log(`✅ Sample marker:`, {
          lat: data[0].lat,
          lng: data[0].lng,
          size: data[0].size,
          color: data[0].color
        });
      } else {
        console.error(`❌ No marker data generated!`);
      }
      return data;
    }

    // SPREAD MODE: Show individual stations (Radio Garden style)
    return spreadPoints.map((sp) => {
      const isSelected = activeStation?.stationuuid === sp.station.stationuuid;
      const isHovered = hoveredPoint?.stationuuid === sp.station.stationuuid;

      // Size based on popularity (same as clustering mode)
      const votes = sp.station.votes || 0;
      const clickcount = sp.station.clickcount || 0;
      const popularity = votes + (clickcount / 100);
      
      const popularityScore = Math.log(popularity + 1);
      const maxPopularity = Math.log(10000);
      const normalizedPopularity = Math.min(popularityScore / maxPopularity, 1);
      
      // Same size range as clustering mode (Enhanced for visibility)
      const minSize = 0.03;  // ~3.3km (clearly visible)
      const maxSize = 0.12;  // ~13km (popular stations)
      const baseSize = minSize + (normalizedPopularity * (maxSize - minSize));
      
      const size = isSelected ? 0.25 : (isHovered ? baseSize * 1.4 : baseSize); // เพิ่มขนาด active

      let color;
      if (isSelected) color = theme === 'dark' ? '#ff0000' : '#ff0000'; // สีแดงสดเด่นชัด
      else if (isHovered) color = '#00ff41';
      else color = theme === 'dark' ? '#00ff41' : '#3b82f6';

      return {
        ...sp.station,
        lat: sp.lat,
        lng: sp.lng,
        size: size,
        color: color,
        originalStation: sp.station,
        isCluster: false
      };
    });
  }, [spreadPoints, visibleClusters, useClustering, activeStation, hoveredPoint, theme]);

  // Focus Logic
  useEffect(() => {
    if (!globeEl.current || !userCountryCoords || showStartOverlay || hasInitialFocus) return;
    try {
      globeEl.current.pointOfView({
        lat: userCountryCoords.lat,
        lng: userCountryCoords.lng,
        altitude: 1.8
      }, 2000);
      setHasInitialFocus(true);
    } catch (e) { }
  }, [showStartOverlay, userCountryCoords, hasInitialFocus]);

  useEffect(() => {
    if (!globeEl.current || !activeStation?.geo_lat || !hasInitialFocus) return;
    try {
      const currentAlt = globeEl.current.pointOfView().altitude;
      globeEl.current.pointOfView({
        lat: activeStation.geo_lat,
        lng: activeStation.geo_long,
        altitude: Math.min(currentAlt, 1.2)
      }, 1500);
    } catch (e) { }
  }, [activeStation, hasInitialFocus]);

  // หมุน Globe เมื่อเลือกสถานีจาก Settings/Browse
  useEffect(() => {
    if (!globeEl.current || !selectedStation?.geo_lat || !hasInitialFocus) return;
    try {
      globeEl.current.pointOfView({
        lat: selectedStation.geo_lat,
        lng: selectedStation.geo_long,
        altitude: 1.5 // ซูมเข้าไปหน่อย
      }, 2000); // animation 2 วินาที
    } catch (e) { }
  }, [selectedStation, hasInitialFocus]);

  // Track zoom level for progressive disclosure
  const handleZoom = React.useCallback(() => {
    if (globeEl.current) {
      const pov = globeEl.current.pointOfView();
      setCurrentAltitude(pov.altitude || 2.5);
      
      // ส่งพิกัดตรงกลางกลับไปยัง App.tsx (สำหรับ Center Selection Mode)
      if (onGlobeRotate && pov.lat !== undefined && pov.lng !== undefined) {
        onGlobeRotate({ lat: pov.lat, lng: pov.lng });
      }
    }
  }, [onGlobeRotate]);

  // Controls configuration + Zoom tracking
  useEffect(() => {
    if (!globeEl.current) return;
    const controls = globeEl.current.controls();
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.rotateSpeed = 0.8;
    controls.zoomSpeed = 1.0;
    controls.autoRotate = false;

    controls.addEventListener('change', handleZoom);
    return () => controls.removeEventListener('change', handleZoom);
  }, [handleZoom]);

  const bgColor = theme === 'dark' ? '#020617' : '#f0f4f8';
  const atmosphereColor = theme === 'dark' ? '#00ff41' : '#3b82f6';

  const ringData = useMemo(() => {
    if (!activeStation?.geo_lat) return [];
    return [{
      lat: activeStation.geo_lat,
      lng: activeStation.geo_long,
      maxR: 8,
      propagationSpeed: 4,
      repeatPeriod: 1000,
      color: theme === 'dark' ? '#ffffff' : '#3b82f6'
    }];
  }, [activeStation, theme]);

  return (
    <div className={`w-full h-full fixed inset-0 z-0 cursor-default transition-colors duration-500`} style={{ backgroundColor: bgColor }}>
      <Globe
        ref={globeEl}
        width={dimensions.width}
        height={dimensions.height}
        backgroundColor={bgColor}
        globeImageUrl={theme === 'dark' ? "//unpkg.com/three-globe/example/img/earth-night.jpg" : "//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"}
        bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"

        // WebGL Points Layer (High Performance for 30k+ dots)
        pointsData={markerData}
        pointLat="lat"
        pointLng="lng"
        pointColor="color"
        pointRadius="size"
        pointAltitude={0.001} // Minimal elevation for flat appearance (prevents z-fighting)
        pointsMerge={false}  // DISABLED: Merging breaks click interaction - each point needs individual geometry

        // Native WebGL Interaction (Raycasting) with debounce
        onPointClick={(point: any) => {
          // Prevent double-clicks (Radio Garden pattern)
          if (isClickProcessing) {
            console.log('⏳ Click ignored - processing previous click');
            return;
          }
          
          console.log('🖱️ Point clicked:', point);
          
          if (!point) {
            console.warn('No point data received');
            return;
          }
          
          // Set processing state
          setIsClickProcessing(true);
          
          // Clear any existing timeout
          if (clickTimeoutRef.current) {
            clearTimeout(clickTimeoutRef.current);
          }
          
          // Reset processing state after 500ms
          clickTimeoutRef.current = setTimeout(() => {
            setIsClickProcessing(false);
          }, 500);
          
          // New micro-spreading mode: direct station object
          if (point.station && point.stationuuid) {
            console.log('✅ Station clicked (micro-spread):', point.station.name);
            onSelectStation(point.station);
          }
          // Cluster mode: select the top station from the cluster
          else if (point.isCluster && point.cluster) {
            console.log('✅ Cluster clicked:', point.cluster.name, 'Stations:', point.cluster.stationCount);
            onSelectStation(point.cluster.topStation);
          }
          // Spread mode: select the individual station
          else if (point.originalStation) {
            console.log('✅ Station clicked (spread):', point.originalStation.name);
            onSelectStation(point.originalStation);
          }
          else {
            console.error('❌ No valid station data in point:', Object.keys(point));
            setIsClickProcessing(false); // Reset on error
          }
        }}
        onPointHover={(point: any) => {
          setHoveredPoint(point || null);
          document.body.style.cursor = point ? 'pointer' : 'default';
        }}

        ringsData={ringData}
        ringColor={(d: any) => d.color}
        ringMaxRadius="maxR"
        ringPropagationSpeed="propagationSpeed"
        ringRepeatPeriod="repeatPeriod"

        showAtmosphere={true}
        atmosphereColor={atmosphereColor}
        atmosphereAltitude={0.15}
      />
    </div>
  );
};

export default GlobeView;