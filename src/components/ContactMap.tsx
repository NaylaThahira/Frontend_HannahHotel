'use client'

import 'maplibre-gl/dist/maplibre-gl.css'
import { Map, MapMarker, MapControls, MarkerPopup, MarkerContent } from '@/components/ui/map'

export default function ContactMap({
  location,
  longitude,
  latitude,
  hotelName,
  address,
  mapUrl,
  mapLabel,
}: {
  location: string
  longitude: number
  latitude: number
  hotelName: string
  address: string
  mapUrl: string
  mapLabel: string
}) {
  return (
    <Map
      key={location}
      center={[longitude, latitude]}
      zoom={15.5}
      className="absolute inset-0 h-full w-full"
    >
      <MapMarker longitude={longitude} latitude={latitude}>
        <MarkerContent>
          <div className="-translate-y-1/2 drop-shadow-lg">
            <svg
              viewBox="0 0 24 24"
              className="size-11 text-primary"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
            </svg>
          </div>
        </MarkerContent>
        <MarkerPopup closeButton>
          <div className="p-3">
            <h3 className="font-display font-semibold text-primary">{hotelName}</h3>
            <p className="mt-1 whitespace-pre-line text-sm text-secondary">{address}</p>
            <a
              href={mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-block text-xs font-bold text-primary hover:underline"
            >
              {mapLabel} &rarr;
            </a>
          </div>
        </MarkerPopup>
      </MapMarker>
      <MapControls position="top-right" />
    </Map>
  )
}

