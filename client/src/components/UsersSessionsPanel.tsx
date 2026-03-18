/*
 * Users & Sessions panel combining user drill-down table and location map
 */
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UserDrilldownTable from "./UserDrilldownTable";
import UserLocationMap from "./UserLocationMap";
import { usersData } from "@/lib/userData";
import { Users, MapPin } from "lucide-react";

export default function UsersSessionsPanel() {
  const [activeTab, setActiveTab] = useState("table");

  return (
    <div className="space-y-4">
      {/* Hero banner */}
      <div className="relative rounded-lg overflow-hidden border border-gray-200 bg-gradient-to-r from-blue-50 to-blue-100 p-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Users className="w-5 h-5 text-blue-600" />
            <span className="text-xs font-mono text-blue-600 uppercase tracking-widest">User Analytics</span>
          </div>
          <h2 className="text-2xl font-extrabold text-gray-900 leading-tight" style={{ fontFamily: 'Syne, sans-serif' }}>
            Users & Sessions
          </h2>
          <p className="text-sm text-gray-700 mt-1 max-w-lg">
            Track individual users across all devices and sessions. View complete user journeys from acquisition through conversion, including device fingerprints, session history, transaction records, and geographic distribution.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 rounded-lg border border-gray-200 bg-gray-50 p-1">
          <TabsTrigger
            value="table"
            className="rounded-md data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm"
          >
            <Users className="w-4 h-4 mr-2" />
            User Details
          </TabsTrigger>
          <TabsTrigger
            value="map"
            className="rounded-md data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm"
          >
            <MapPin className="w-4 h-4 mr-2" />
            Geographic Map
          </TabsTrigger>
        </TabsList>

        <TabsContent value="table" className="mt-4">
          <UserDrilldownTable users={usersData} />
        </TabsContent>

        <TabsContent value="map" className="mt-4">
          <UserLocationMap users={usersData} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
