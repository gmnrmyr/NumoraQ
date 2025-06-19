import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Home, Plus, Trash2, Building, MapPin, Info, Wallet, RefreshCw, Coins, Image } from "lucide-react";
import { useFinancialData } from "@/contexts/FinancialDataContext";
import { useTranslation } from "@/contexts/TranslationContext";
import { useWalletFetch } from "@/hooks/useWalletFetch";
import { toast } from "@/hooks/use-toast";

export const AssetManagementEditable = () => {
  const { data, addProperty, updateProperty, removeProperty } = useFinancialData();
  const { fetchWalletBalance, fetchNFTCollection, calculateCryptoValue, isLoading } = useWalletFetch();
  const { t } = useTranslation();
  
  const [newProperty, setNewProperty] = useState({
    name: '',
    value: 0,
    status: 'rented' as 'rented' | 'renovating' | 'planned',
    currentRent: 0,
    expectedRent: 0,
    statusIcon: '🏠',
    statusText: 'Rented',
    prediction: 'Current',
    rentRange: 'N/A'
  });
  
  const [isAddingProperty, setIsAddingProperty] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [cryptoAmount, setCryptoAmount] = useState(0);
  const [cryptoSymbol, setCryptoSymbol] = useState('eth');
  const [walletName, setWalletName] = useState('');
  const [assetType, setAssetType] = useState<'wallet' | 'crypto' | 'nft'>('wallet');

  // Calculate totals
  const totalRealEstateValue = data.properties.reduce((sum, property) => sum + property.value, 0);
  const totalCurrentRent = data.properties.reduce((sum, property) => sum + property.currentRent, 0);
  const totalProjectedRent = data.properties.reduce((sum, property) => sum + property.expectedRent, 0);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'rented': return 'bg-green-100 text-green-800 border-green-200 hover:bg-green-200 cursor-pointer';
      case 'renovating': return 'bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200 cursor-pointer';
      case 'planned': return 'bg-purple-100 text-purple-800 border-purple-200 hover:bg-purple-200 cursor-pointer';
      default: return 'bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200 cursor-pointer';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'rented': return '🏠';
      case 'renovating': return '🔧';
      case 'planned': return '📋';
      default: return '🏠';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'rented': return 'Rented';
      case 'renovating': return 'Under Renovation';
      case 'planned': return 'Planned Purchase';
      default: return 'Rented';
    }
  };

  const togglePropertyStatus = (propertyId: string, currentStatus: string) => {
    const statuses = ['rented', 'renovating', 'planned'];
    const currentIndex = statuses.indexOf(currentStatus);
    const nextStatus = statuses[(currentIndex + 1) % statuses.length] as 'rented' | 'renovating' | 'planned';
    
    const statusIcon = getStatusIcon(nextStatus);
    const statusText = getStatusText(nextStatus);
    const prediction = nextStatus === 'rented' ? 'Current' : nextStatus === 'renovating' ? 'Spring 2025' : '2026';
    const rentRange = nextStatus === 'rented' ? 'N/A' : nextStatus === 'renovating' ? '$2,000-2,400' : '$180-220/night';
    
    updateProperty(propertyId, { 
      status: nextStatus, 
      statusIcon, 
      statusText, 
      prediction, 
      rentRange 
    });
  };

  const handleAddProperty = () => {
    if (newProperty.name.trim()) {
      addProperty(newProperty);
      setNewProperty({
        name: '',
        value: 0,
        status: 'rented',
        currentRent: 0,
        expectedRent: 0,
        statusIcon: '🏠',
        statusText: 'Rented',
        prediction: 'Current',
        rentRange: 'N/A'
      });
      setIsAddingProperty(false);
    }
  };

  const handleFetchWalletValue = async () => {
    if (!walletAddress.trim()) {
      toast({
        title: "Wallet Address Required",
        description: "Please enter a wallet address to fetch balance.",
        variant: "destructive"
      });
      return;
    }

    try {
      const balance = await fetchWalletBalance(walletAddress);
      
      // Add as a property with wallet info
      const walletProperty = {
        name: walletName || `Wallet ${walletAddress.substring(0, 8)}...`,
        value: balance.totalUsd,
        status: 'rented' as const,
        currentRent: 0,
        expectedRent: 0,
        statusIcon: '💼',
        statusText: 'Wallet',
        prediction: 'Live',
        rentRange: `ETH: ${balance.eth?.toFixed(4) || '0'} | BTC: ${balance.btc?.toFixed(6) || '0'}`,
        walletAddress: walletAddress,
        lastFetched: new Date().toISOString()
      };

      addProperty(walletProperty);
      
      toast({
        title: "Wallet Added Successfully!",
        description: `Fetched $${balance.totalUsd.toFixed(2)} from wallet`,
      });

      // Reset form
      setWalletAddress('');
      setWalletName('');
      setIsAddingProperty(false);
    } catch (error) {
      toast({
        title: "Fetch Failed",
        description: "Could not fetch wallet balance. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleAddCryptoHolding = async () => {
    if (!cryptoAmount || !walletName.trim()) {
      toast({
        title: "Missing Information",
        description: "Please enter amount and wallet/exchange name.",
        variant: "destructive"
      });
      return;
    }

    try {
      const value = await calculateCryptoValue(cryptoSymbol, cryptoAmount);
      
      const cryptoProperty = {
        name: `${walletName} (${cryptoSymbol.toUpperCase()})`,
        value: value,
        status: 'rented' as const,
        currentRent: 0,
        expectedRent: 0,
        statusIcon: cryptoSymbol === 'eth' ? '⟠' : '₿',
        statusText: 'Crypto',
        prediction: 'Live',
        rentRange: `${cryptoAmount} ${cryptoSymbol.toUpperCase()}`,
        cryptoSymbol: cryptoSymbol,
        cryptoAmount: cryptoAmount,
        lastFetched: new Date().toISOString()
      };

      addProperty(cryptoProperty);
      
      toast({
        title: "Crypto Holding Added!",
        description: `Added ${cryptoAmount} ${cryptoSymbol.toUpperCase()} worth $${value.toFixed(2)}`,
      });

      // Reset form
      setCryptoAmount(0);
      setWalletName('');
      setIsAddingProperty(false);
    } catch (error) {
      toast({
        title: "Failed to Add Crypto",
        description: "Could not calculate crypto value. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleFetchNFTs = async () => {
    if (!walletAddress.trim()) {
      toast({
        title: "Wallet Address Required",
        description: "Please enter a wallet address to fetch NFTs.",
        variant: "destructive"
      });
      return;
    }

    try {
      const nfts = await fetchNFTCollection(walletAddress);
      
      if (nfts && nfts.length > 0) {
        const totalNFTValue = nfts.reduce((sum, nft) => sum + (nft.estimatedValue || 0), 0);
        
        const nftProperty = {
          name: `NFT Collection ${walletAddress.substring(0, 8)}...`,
          value: totalNFTValue,
          status: 'rented' as const,
          currentRent: 0,
          expectedRent: 0,
          statusIcon: '🖼️',
          statusText: 'NFTs',
          prediction: 'Collection',
          rentRange: `${nfts.length} NFTs`,
          walletAddress: walletAddress,
          nftCount: nfts.length,
          lastFetched: new Date().toISOString()
        };

        addProperty(nftProperty);
        
        toast({
          title: "NFT Collection Added!",
          description: `Found ${nfts.length} NFTs worth $${totalNFTValue.toFixed(2)}`,
        });

        setWalletAddress('');
        setIsAddingProperty(false);
      } else {
        toast({
          title: "No NFTs Found",
          description: "This wallet doesn't appear to have any NFTs.",
        });
      }
    } catch (error) {
      toast({
        title: "NFT Fetch Failed",
        description: "Could not fetch NFT collection. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Real Estate Summary */}
      <Card className="bg-card/95 backdrop-blur-md border-3 border-blue-600 brutalist-card">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <CardTitle className="text-blue-400 text-sm sm:text-base font-mono uppercase flex items-center gap-2 brutalist-heading">
                <Building size={20} />
                ASSET PORTFOLIO
              </CardTitle>
              <div className="text-lg sm:text-2xl font-bold text-blue-400 font-mono">
                {data.userProfile.defaultCurrency === 'BRL' ? 'R$' : '$'} {totalRealEstateValue.toLocaleString()}
              </div>
              <div className="text-xs text-blue-400/70 font-mono">
                {data.properties.length} assets • Rent income: {data.userProfile.defaultCurrency === 'BRL' ? 'R$' : '$'}{totalCurrentRent}/mo
              </div>
            </div>
            
            <Dialog open={isAddingProperty} onOpenChange={setIsAddingProperty}>
              <DialogTrigger asChild>
                <Button size="sm" className="brutalist-button">
                  <Plus size={16} className="mr-1" />
                  Add Asset
                </Button>
              </DialogTrigger>
              <DialogContent className="w-[95vw] max-w-md bg-card border-3 border-border z-50">
                <DialogHeader>
                  <DialogTitle className="font-mono uppercase brutalist-heading">Add Asset</DialogTitle>
                </DialogHeader>
                
                <Tabs value={assetType} onValueChange={(value: any) => setAssetType(value)} className="space-y-4">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="wallet" className="text-xs">Wallet</TabsTrigger>
                    <TabsTrigger value="crypto" className="text-xs">Crypto</TabsTrigger>
                    <TabsTrigger value="nft" className="text-xs">NFTs</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="wallet" className="space-y-4">
                    <div className="text-xs text-muted-foreground font-mono">
                      Paste wallet address to auto-fetch balance
                    </div>
                    <Input
                      placeholder="Wallet address (0x... or bc1...)"
                      value={walletAddress}
                      onChange={(e) => setWalletAddress(e.target.value)}
                      className="brutalist-input font-mono text-xs"
                    />
                    <Input
                      placeholder="Wallet name (optional)"
                      value={walletName}
                      onChange={(e) => setWalletName(e.target.value)}
                      className="brutalist-input font-mono"
                    />
                    <Button 
                      onClick={handleFetchWalletValue} 
                      disabled={isLoading}
                      className="w-full brutalist-button"
                    >
                      {isLoading ? (
                        <RefreshCw size={16} className="mr-2 animate-spin" />
                      ) : (
                        <Wallet size={16} className="mr-2" />
                      )}
                      Fetch Wallet Value
                    </Button>
                  </TabsContent>
                  
                  <TabsContent value="crypto" className="space-y-4">
                    <div className="text-xs text-muted-foreground font-mono">
                      Manual crypto holding entry
                    </div>
                    <Input
                      placeholder="Exchange/Wallet name (e.g., Binance)"
                      value={walletName}
                      onChange={(e) => setWalletName(e.target.value)}
                      className="brutalist-input font-mono"
                    />
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        step="0.00000001"
                        placeholder="Amount"
                        value={cryptoAmount}
                        onChange={(e) => setCryptoAmount(parseFloat(e.target.value) || 0)}
                        className="brutalist-input font-mono flex-1"
                      />
                      <Select value={cryptoSymbol} onValueChange={setCryptoSymbol}>
                        <SelectTrigger className="w-20 brutalist-input">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-card border-3 border-border z-50">
                          <SelectItem value="eth">ETH</SelectItem>
                          <SelectItem value="btc">BTC</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button 
                      onClick={handleAddCryptoHolding} 
                      disabled={isLoading}
                      className="w-full brutalist-button"
                    >
                      <Coins size={16} className="mr-2" />
                      Add Crypto Holding
                    </Button>
                  </TabsContent>
                  
                  <TabsContent value="nft" className="space-y-4">
                    <div className="text-xs text-muted-foreground font-mono">
                      Fetch NFT collection from wallet
                    </div>
                    <Input
                      placeholder="Wallet address with NFTs"
                      value={walletAddress}
                      onChange={(e) => setWalletAddress(e.target.value)}
                      className="brutalist-input font-mono text-xs"
                    />
                    <Button 
                      onClick={handleFetchNFTs} 
                      disabled={isLoading}
                      className="w-full brutalist-button"
                    >
                      {isLoading ? (
                        <RefreshCw size={16} className="mr-2 animate-spin" />
                      ) : (
                        <Image size={16} className="mr-2" />
                      )}
                      Fetch NFT Collection
                    </Button>
                  </TabsContent>
                </Tabs>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Info Banner */}
          <div className="flex items-start gap-2 p-3 bg-blue-50/10 border-2 border-blue-200/30 brutalist-card">
            <Info size={16} className="text-blue-400 mt-0.5 flex-shrink-0" />
            <div className="text-xs text-blue-400 font-mono">
              <strong>Asset Tracking:</strong> Add manual real estate, fetch live wallet values, or track crypto holdings. 
              Rental income should be added to the Income tab separately.
            </div>
          </div>

          {/* Asset Properties */}
          <div className="space-y-3">
            {data.properties.map((property) => (
              <div key={property.id} className="p-4 bg-background/50 border-3 border-border brutalist-card">
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{getStatusIcon(property.status)}</span>
                      <div className="flex-1">
                        <Input
                          value={property.name}
                          onChange={(e) => updateProperty(property.id, { name: e.target.value })}
                          className="font-medium text-sm font-mono bg-transparent border-none p-0 text-foreground brutalist-input"
                        />
                        <div className="text-xs text-muted-foreground font-mono flex items-center gap-1 mt-1">
                          <MapPin size={12} />
                          {property.walletAddress ? `Wallet: ${property.walletAddress.substring(0, 10)}...` : 'Asset Details'}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-lg text-blue-400 font-mono">
                        <Input
                          type="number"
                          value={property.value}
                          onChange={(e) => updateProperty(property.id, { value: parseFloat(e.target.value) || 0 })}
                          className="text-right font-bold text-lg text-blue-400 font-mono bg-transparent border-none p-0 w-32 brutalist-input"
                        />
                      </div>
                      <div className="text-xs text-muted-foreground font-mono">
                        {property.lastFetched ? 'Live Value' : 'Market Value'}
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div className="space-y-1">
                      <div className="text-muted-foreground font-mono">Type</div>
                      <Badge 
                        className={getStatusColor(property.status)}
                        onClick={() => togglePropertyStatus(property.id, property.status)}
                      >
                        {getStatusText(property.status)}
                      </Badge>
                    </div>
                    <div className="space-y-1">
                      <div className="text-muted-foreground font-mono">Details</div>
                      <div className="font-mono text-xs text-accent">
                        {property.rentRange}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-muted-foreground font-mono">Status</div>
                      <div className="font-mono text-xs text-green-400">
                        {property.lastFetched ? 'Auto-Synced' : 'Manual'}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-border">
                    <div className="text-xs text-muted-foreground font-mono">
                      {property.lastFetched ? `Last updated: ${new Date(property.lastFetched).toLocaleDateString()}` : 'Click type to change status'}
                    </div>
                    <Button
                      onClick={() => removeProperty(property.id)}
                      variant="outline"
                      size="sm"
                      className="text-red-400 hover:text-red-300 p-1 h-6 w-6 border-3 border-border brutalist-button"
                    >
                      <Trash2 size={12} />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            
            {data.properties.length === 0 && (
              <div className="text-center py-8 text-muted-foreground font-mono">
                <Building size={48} className="mx-auto mb-4 opacity-50" />
                <p className="brutalist-heading">No assets added yet</p>
                <p className="text-xs mt-2">Add your first asset to start tracking your portfolio</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
