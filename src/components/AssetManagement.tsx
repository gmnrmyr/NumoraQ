import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Home, Calendar, DollarSign } from "lucide-react";
import { WalletTracker } from './portfolio/WalletTracker';

export const AssetManagement = () => {
  const properties = [
    {
      name: "Laurindo",
      value: 230400,
      status: "rented",
      currentRent: 1600,
      statusIcon: "✅",
      statusText: "Alugado",
      prediction: "Atual",
      rentRange: "R$ 1.600"
    },
    {
      name: "Macuco (Moema)",
      value: 1050000,
      status: "renovating",
      currentRent: 0,
      expectedRent: 6000,
      statusIcon: "🔄",
      statusText: "Reformando",
      prediction: "outubro/2025",
      rentRange: "R$ 6.000"
    },
    {
      name: "Ataliba (comercial)",
      value: 206220, // Average of 172440-240000
      minValue: 172440,
      maxValue: 240000,
      status: "planned",
      currentRent: 0,
      expectedRent: 1750, // Average of 1500-2000
      statusIcon: "📋",
      statusText: "Planejado",
      prediction: "2027",
      rentRange: "R$ 1.500-2.000"
    }
  ];

  const totalPropertyValue = properties.reduce((sum, prop) => sum + prop.value, 0);
  const currentMonthlyRent = properties.reduce((sum, prop) => sum + (prop.currentRent || 0), 0);
  const projectedMonthlyRent = properties.reduce((sum, prop) => 
    sum + (prop.currentRent || prop.expectedRent || 0), 0
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'rented': return 'bg-green-100 text-green-800 border-green-200';
      case 'renovating': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'planned': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  return (
    <div className="space-y-8">
      {/* Property Portfolio */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {properties.map((property, index) => (
          <Card key={index} className="bg-white shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Home size={20} className="text-blue-600" />
                  <span>{property.name}</span>
                </div>
                <span className="text-2xl">{property.statusIcon}</span>
              </CardTitle>
              <Badge className={getStatusColor(property.status)}>
                {property.statusText}
              </Badge>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Property Value</span>
                  <span className="font-bold">
                    R$ {property.value.toLocaleString()}
                  </span>
                </div>
                {property.minValue && property.maxValue && (
                  <div className="text-xs text-slate-500">
                    Range: R$ {property.minValue.toLocaleString()} - R$ {property.maxValue.toLocaleString()}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Current Rent</span>
                  <span className="font-bold text-green-600">
                    {property.currentRent > 0 
                      ? `R$ ${property.currentRent.toLocaleString()}/month`
                      : "Not rented"
                    }
                  </span>
                </div>
                {property.expectedRent && property.currentRent === 0 && (
                  <div className="text-xs text-blue-600">
                    Expected: R$ {property.expectedRent.toLocaleString()}/month
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar size={14} className="text-slate-600" />
                  <span className="text-slate-600">Timeline: {property.prediction}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <DollarSign size={14} className="text-slate-600" />
                  <span className="text-slate-600">Rent Range: {property.rentRange}</span>
                </div>
              </div>

              {/* Yield calculation */}
              <div className="pt-2 border-t">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-600">Annual Yield</span>
                  <span className="font-medium">
                    {property.currentRent > 0 
                      ? `${((property.currentRent * 12 / property.value) * 100).toFixed(2)}%`
                      : property.expectedRent 
                        ? `${((property.expectedRent * 12 / property.value) * 100).toFixed(2)}% (proj.)`
                        : "N/A"
                    }
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Portfolio Summary */}
      <Card className="bg-gradient-to-r from-blue-50 to-green-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-800">Real Estate Portfolio Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-white rounded-lg shadow-sm">
              <div className="text-sm text-slate-600">Total Property Value</div>
              <div className="text-xl font-bold text-blue-600">
                R$ {totalPropertyValue.toLocaleString()}
              </div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg shadow-sm">
              <div className="text-sm text-slate-600">Current Monthly Rent</div>
              <div className="text-xl font-bold text-green-600">
                R$ {currentMonthlyRent.toLocaleString()}
              </div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg shadow-sm">
              <div className="text-sm text-slate-600">Projected Monthly Rent</div>
              <div className="text-xl font-bold text-purple-600">
                R$ {projectedMonthlyRent.toLocaleString()}
              </div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg shadow-sm border-2 border-green-200">
              <div className="text-sm text-slate-600">Portfolio Yield</div>
              <div className="text-xl font-bold text-green-600">
                {((projectedMonthlyRent * 12 / totalPropertyValue) * 100).toFixed(2)}%
              </div>
              <div className="text-xs text-slate-500">Projected annual</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Rental Income Progression */}
      <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
        <CardHeader>
          <CardTitle className="text-green-800">Rental Income Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-white rounded-lg">
              <span className="font-medium">Current (2024)</span>
              <span className="text-lg font-bold text-green-600">
                R$ {currentMonthlyRent.toLocaleString()}/month
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-200">
              <span className="font-medium">With Macuco (Oct 2025)</span>
              <span className="text-lg font-bold text-yellow-600">
                R$ {(currentMonthlyRent + 6000).toLocaleString()}/month
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
              <span className="font-medium">Full Portfolio (2027)</span>
              <span className="text-lg font-bold text-blue-600">
                R$ {projectedMonthlyRent.toLocaleString()}/month
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add Wallet Tracker Section */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold font-mono uppercase text-accent border-b-2 border-accent pb-2">
          Blockchain Wallets
        </h2>
        <WalletTracker />
      </div>
    </div>
  );
};
