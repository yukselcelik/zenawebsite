'use client';

import { useEffect, useRef } from 'react';

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

export default function GoogleMap({
  center,
  zoom = 15,
  className = '',
  pinTitle = '',
}) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);

  useEffect(() => {
    // Google Maps script'i yükle
    const loadGoogleMaps = () => {
      if (window.google && window.google.maps) {
        initializeMap();
        return;
      }

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}`;
      script.async = true;
      script.defer = true;
      script.onload = () => initializeMap();
      document.head.appendChild(script);
    };

    const initializeMap = () => {
      if (!mapRef.current) return;

      // Haritayı oluştur
      const map = new window.google.maps.Map(mapRef.current, {
        center: center,
        zoom: zoom,
        mapTypeControl: true,
        streetViewControl: true,
        fullscreenControl: true,
        zoomControl: true,
      });

      mapInstanceRef.current = map;

      const marker = new window.google.maps.Marker({
        position: center,
        map: map,
        title: pinTitle,
      });

      markerRef.current = marker;
    };

    loadGoogleMaps();

    return () => {
      if (markerRef.current) {
        markerRef.current.setMap(null);
      }
    };
  }, []);

  useEffect(() => {
    if (mapInstanceRef.current && markerRef.current && window.google) {
      mapInstanceRef.current.setCenter(center);
      mapInstanceRef.current.setZoom(zoom);
      
      markerRef.current.setPosition(center);
      markerRef.current.setTitle(pinTitle);
      
      setTimeout(() => {
        if (markerRef.current) {
          markerRef.current.setAnimation(null);
        }
      }, 750);
    }
  }, [center, zoom, pinTitle]);

  return (
    <div 
      ref={mapRef} 
      className={className || 'w-full h-[400px]'}
      style={{ minHeight: '300px' }}
    />
  );
}