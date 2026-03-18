/*
 * Google Map component showing user locations and geographic distribution
 */
import { useEffect, useRef, useState } from "react";
import { MapPin, Users, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { User } from "@/lib/userData";

interface UserLocationMapProps {
  users: User[];
}

interface MarkerData {
  position: { lat: number; lng: number };
  title: string;
  count: number;
  revenue: number;
  users: User[];
}

export default function UserLocationMap({ users }: UserLocationMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const infoWindowsRef = useRef<google.maps.InfoWindow[]>([]);
  const [selectedMarker, setSelectedMarker] = useState<MarkerData | null>(null);

  useEffect(() => {
    if (!mapRef.current || !window.google) return;

    // Initialize map
    const map = new google.maps.Map(mapRef.current, {
      zoom: 4,
      center: { lat: 39.8283, lng: -98.5795 }, // Center of US
      styles: [
        {
          featureType: "all",
          elementType: "labels.text.fill",
          stylers: [{ color: "#616161" }],
        },
        {
          featureType: "water",
          elementType: "geometry",
          stylers: [{ color: "#e9e9e9" }, { lightness: 17 }],
        },
        {
          featureType: "administrative",
          elementType: "geometry.fill",
          stylers: [{ color: "#f1f1f1" }],
        },
      ],
    });

    mapInstanceRef.current = map;

    // Group users by location
    const locationMap = new Map<string, MarkerData>();
    users.forEach(user => {
      const loc = user.primaryLocation;
      const key = `${loc.latitude},${loc.longitude}`;

      if (!locationMap.has(key)) {
        locationMap.set(key, {
          position: { lat: loc.latitude, lng: loc.longitude },
          title: `${loc.city}, ${loc.country}`,
          count: 0,
          revenue: 0,
          users: [],
        });
      }

      const marker = locationMap.get(key)!;
      marker.count += 1;
      marker.revenue += user.totalSpent;
      marker.users.push(user);
    });

    // Clear existing markers
    markersRef.current.forEach(m => m.setMap(null));
    infoWindowsRef.current.forEach(w => w.close());
    markersRef.current = [];
    infoWindowsRef.current = [];

    // Create markers
    locationMap.forEach((markerData) => {
      const marker = new google.maps.Marker({
        position: markerData.position,
        map: map,
        title: markerData.title,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: Math.min(8 + markerData.count * 1.5, 25),
          fillColor: "#3b82f6",
          fillOpacity: 0.7,
          strokeColor: "#1e40af",
          strokeWeight: 2,
        },
      });

      const infoWindow = new google.maps.InfoWindow({
        content: `
          <div style="padding: 12px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; font-size: 12px; color: #333;">
            <div style="font-weight: 600; font-size: 14px; margin-bottom: 8px;">${markerData.title}</div>
            <div style="margin-bottom: 6px;"><strong>Users:</strong> ${markerData.count}</div>
            <div style="margin-bottom: 6px;"><strong>Revenue:</strong> $${markerData.revenue.toFixed(2)}</div>
            <div style="margin-bottom: 6px;"><strong>Avg LTV:</strong> $${(markerData.revenue / markerData.count).toFixed(2)}</div>
            <div style="font-size: 11px; color: #666; margin-top: 8px; border-top: 1px solid #eee; padding-top: 8px;">
              Click to see user details
            </div>
          </div>
        `,
      });

      marker.addListener("click", () => {
        infoWindowsRef.current.forEach(w => w.close());
        infoWindow.open(map, marker);
        setSelectedMarker(markerData);
      });

      markersRef.current.push(marker);
      infoWindowsRef.current.push(infoWindow);
    });
  }, [users]);

  return (
    <div className="space-y-4">
      {/* Map */}
      <div className="rounded-lg border border-gray-200 overflow-hidden bg-white">
        <div className="flex items-center gap-2.5 px-5 py-4 border-b border-gray-200">
          <MapPin className="w-4 h-4 text-blue-600" />
          <span className="text-sm font-semibold text-gray-900" style={{ fontFamily: 'Syne, sans-serif' }}>
            User Geographic Distribution
          </span>
        </div>
        <div
          ref={mapRef}
          className="w-full"
          style={{ height: "400px" }}
        />
      </div>

      {/* Location Statistics */}
      <div className="rounded-lg border border-gray-200 p-5 bg-white">
        <div className="flex items-center gap-2.5 mb-4">
          <TrendingUp className="w-4 h-4 text-blue-600" />
          <span className="text-sm font-semibold text-gray-900" style={{ fontFamily: 'Syne, sans-serif' }}>
            Location Insights
          </span>
        </div>

        {selectedMarker ? (
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
              <div className="text-lg font-bold text-gray-900 mb-3">{selectedMarker.title}</div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <div className="text-[10px] text-gray-600 uppercase tracking-wider mb-1 font-medium">Users</div>
                  <div className="text-2xl font-bold text-blue-600">{selectedMarker.count}</div>
                </div>
                <div>
                  <div className="text-[10px] text-gray-600 uppercase tracking-wider mb-1 font-medium">Total Revenue</div>
                  <div className="text-2xl font-bold text-green-600">${selectedMarker.revenue.toFixed(0)}</div>
                </div>
                <div>
                  <div className="text-[10px] text-gray-600 uppercase tracking-wider mb-1 font-medium">Avg LTV</div>
                  <div className="text-2xl font-bold text-purple-600">${(selectedMarker.revenue / selectedMarker.count).toFixed(2)}</div>
                </div>
              </div>
            </div>

            {/* Users in this location */}
            <div>
              <h4 className="text-xs font-semibold text-gray-900 uppercase tracking-wider mb-2">Users in {selectedMarker.title}</h4>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {selectedMarker.users.map(user => (
                  <div key={user.userId} className="flex items-center justify-between p-2 rounded-lg bg-gray-50 border border-gray-200">
                    <div>
                      <div className="text-xs font-mono font-bold text-gray-900">{user.userId}</div>
                      <div className="text-[10px] text-gray-600">{user.name}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-mono text-green-600 font-semibold">${user.totalSpent.toFixed(2)}</div>
                      <div className="text-[10px] text-gray-600">{user.totalTransactions} txn</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <MapPin className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Click on a marker on the map to see location details</p>
          </div>
        )}
      </div>

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-lg border border-gray-200 p-4 bg-white">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-4 h-4 text-blue-600" />
            <span className="text-[10px] text-gray-600 uppercase tracking-wider font-medium">Total Users</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">{users.length}</div>
          <div className="text-[10px] text-gray-500 mt-1">Across {new Set(users.map(u => u.primaryLocation.city)).size} cities</div>
        </div>

        <div className="rounded-lg border border-gray-200 p-4 bg-white">
          <div className="flex items-center gap-2 mb-2">
            <MapPin className="w-4 h-4 text-green-600" />
            <span className="text-[10px] text-gray-600 uppercase tracking-wider font-medium">Total Revenue</span>
          </div>
          <div className="text-2xl font-bold text-green-600">${users.reduce((sum, u) => sum + u.totalSpent, 0).toFixed(0)}</div>
          <div className="text-[10px] text-gray-500 mt-1">From all locations</div>
        </div>

        <div className="rounded-lg border border-gray-200 p-4 bg-white">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-purple-600" />
            <span className="text-[10px] text-gray-600 uppercase tracking-wider font-medium">Avg LTV</span>
          </div>
          <div className="text-2xl font-bold text-purple-600">${(users.reduce((sum, u) => sum + u.totalSpent, 0) / users.length).toFixed(2)}</div>
          <div className="text-[10px] text-gray-500 mt-1">Per user</div>
        </div>
      </div>
    </div>
  );
}
