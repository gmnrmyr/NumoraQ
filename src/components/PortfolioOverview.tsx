
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Bitcoin, Coins, Building, Banknote } from "lucide-react";
import { useFinancialData } from "@/contexts/FinancialDataContext";
import { EditableValue } from "@/components/ui/editable-value";

const iconMap: { [key: string]: any } = {
  Bitcoin,
  Coins,
  Building,
  Banknote
};

export const PortfolioOverview = () => {
  const { data, updateLiquidAsset, updateIlliquidAsset } = useFinancialData();

  const totalLiquid = data.liquidAssets.reduce((sum, asset) => sum + asset.value, 0);
  const totalIlliquid = data.illiquidAssets.reduce((sum, asset) => sum + asset.value, 0);
  const totalPortfolio = totalLiquid + totalIlliquid;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Liquid Assets */}
      <Card className="bg-green-50 border-green-200">
        <CardHeader>
          <CardTitle className="text-green-800 flex items-center gap-2">
            <Coins size={20} />
            Liquid Assets
          </CardTitle>
          <div className="text-2xl font-bold text-green-700">
            R$ {totalLiquid.toLocaleString()}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {data.liquidAssets.map((asset) => {
            const Icon = iconMap[asset.icon] || Coins;
            const percentage = totalLiquid > 0 ? (asset.value / totalLiquid) * 100 : 0;
            
            return (
              <div key={asset.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon size={16} className={asset.color} />
                    <span className="font-medium">{asset.name}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">
                      R$ <EditableValue
                        value={asset.value}
                        onSave={(value) => updateLiquidAsset(asset.id, { value })}
                        className="inline"
                      />
                    </div>
                    <div className="text-xs text-slate-600">{percentage.toFixed(1)}%</div>
                  </div>
                </div>
                <Progress value={percentage} className="h-2" />
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Illiquid Assets */}
      <Card className="bg-slate-50 border-slate-200">
        <CardHeader>
          <CardTitle className="text-slate-800 flex items-center gap-2">
            <Building size={20} />
            Illiquid Assets
          </CardTitle>
          <div className="text-2xl font-bold text-slate-700">
            R$ {totalIlliquid.toLocaleString()}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {data.illiquidAssets.map((asset) => {
            const Icon = iconMap[asset.icon] || Building;
            const percentage = totalIlliquid > 0 ? (asset.value / totalIlliquid) * 100 : 0;
            
            return (
              <div key={asset.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon size={16} className={asset.color} />
                    <span className="font-medium">{asset.name}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">
                      R$ <EditableValue
                        value={asset.value}
                        onSave={(value) => updateIlliquidAsset(asset.id, { value })}
                        className="inline"
                      />
                    </div>
                    <div className="text-xs text-slate-600">{percentage.toFixed(1)}%</div>
                  </div>
                </div>
                <Progress value={percentage} className="h-2" />
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Portfolio Summary */}
      <Card className="lg:col-span-2 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-800">Portfolio Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-white rounded-lg shadow-sm">
              <div className="text-sm text-slate-600">Total Liquid</div>
              <div className="text-xl font-bold text-green-600">
                R$ {totalLiquid.toLocaleString()}
              </div>
              <div className="text-xs text-slate-500">
                {totalPortfolio > 0 ? ((totalLiquid / totalPortfolio) * 100).toFixed(1) : 0}% of portfolio
              </div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg shadow-sm">
              <div className="text-sm text-slate-600">Total Illiquid</div>
              <div className="text-xl font-bold text-slate-600">
                R$ {totalIlliquid.toLocaleString()}
              </div>
              <div className="text-xs text-slate-500">
                {totalPortfolio > 0 ? ((totalIlliquid / totalPortfolio) * 100).toFixed(1) : 0}% of portfolio
              </div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg shadow-sm border-2 border-blue-200">
              <div className="text-sm text-slate-600">Total Portfolio</div>
              <div className="text-2xl font-bold text-blue-600">
                R$ {totalPortfolio.toLocaleString()}
              </div>
              <Badge variant="outline" className="mt-1">Complete Assets</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
