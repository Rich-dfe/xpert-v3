"use client";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { useEffect, useState } from "react";
import { useApplicationContext } from "@/context/ApplicationContext";

const loggerIcon = L.icon({
  iconUrl: "/marker-icon.png",
  iconRetinaUrl: "/marker-icon-2x.png",
  shadowUrl: "/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

function MapUpdater({
  latitude,
  longitude,
}: {
  latitude: number;
  longitude: number;
}) {
  const map = useMap();

  useEffect(() => {
    map.setView([latitude, longitude], map.getZoom());
    map.invalidateSize();
  }, [latitude, longitude, map]);

  useEffect(() => {
    const container = map.getContainer();

    const observer = new ResizeObserver(() => {
      map.invalidateSize({ pan: false });
    });

    observer.observe(container);

    return () => observer.disconnect();
  }, [map]);

  return null;
}

export default function LoggerMap() {
  const {
    latitude,
    longitude,
    selectedLoggerId,
    selectedLoggerName,
    selectedLoggerUid,
    selectedLoggerUidHex,
  } = useApplicationContext();

  const [mapType, setMapType] = useState<"street" | "satellite">("street");

  if (
    latitude === null ||
    longitude === null ||
    !Number.isFinite(latitude) ||
    !Number.isFinite(longitude) ||
    Math.abs(latitude) > 90 ||
    Math.abs(longitude) > 180
  ) {
    return <p>No valid coordinates available for this logger.</p>;
  }

  const position: [number, number] = [latitude, longitude];

  return (
    <>
      <div className="mb-2 flex gap-2">
        <button
          onClick={() => setMapType("street")}
          className="rounded border px-3 py-1"
        >
          Street
        </button>

        <button
          onClick={() => setMapType("satellite")}
          className="rounded border px-3 py-1"
        >
          Satellite
        </button>
      </div>
      <MapContainer
        center={position}
        zoom={14}
        style={{ height: "500px", width: "100%" }}
      >

        <TileLayer
          attribution={
            mapType === "satellite"
              ? "Tiles &copy; Esri"
              : '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          }
          url={
            mapType === "satellite"
              ? "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
              : "https://tile.openstreetmap.org/{z}/{x}/{y}.png"
          }
        />
        <MapUpdater latitude={latitude} longitude={longitude} />

        <Marker position={position} icon={loggerIcon}>
          <Popup>
            Logger: {selectedLoggerName}
            <br />
            Serial No: {selectedLoggerUidHex}
          </Popup>
        </Marker>
      </MapContainer>
      {latitude} - {longitude}
    </>
  );
}
