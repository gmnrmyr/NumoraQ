
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Wallet, Trash2, RefreshCw, Coins, Image } from 'lucide-react';

interface WalletCardProps {
  wallet: {
    id: string;
    address: string;
    label: string;
    totalValue: number;
    tokens: Array<{
      symbol: string;
      name: string;
      balance: number;
      usdValue: number;
    }>;
    defiPositions?: Array<{
      protocol: string;
      usdValue: number;
    }>;
    nfts: Array<{
      contractAddress: string;
      name: string;
      count: number;
      totalValue: number;
    }>;
    lastUpdated: string;
  };
  onRefresh: (id: string) => void;
  onRemove: (id: string) => void;
  isLoading: boolean;
}

export const WalletCard = ({ wallet, onRefresh, onRemove, isLoading }: WalletCardProps) => {
  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const defiValue = wallet.defiPositions?.reduce((sum, pos) => sum + pos.usdValue, 0) || 0;
  const tokenValue = wallet.tokens.reduce((sum, token) => sum + token.usdValue, 0);
  const nftValue = wallet.nfts.reduce((sum, nft) => sum + nft.totalValue, 0);

  return (
    <Card className="bg-muted/20">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Wallet size={20} className="text-accent" />
            <div>
              <div className="font-mono font-semibold">{wallet.label}</div>
              <div className="font-mono text-xs text-muted-foreground">
                {formatAddress(wallet.address)}
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="font-mono font-bold text-lg">
              ${wallet.totalValue.toLocaleString()}
            </div>
            <div className="font-mono text-xs text-muted-foreground">
              Updated: {new Date(wallet.lastUpdated).toLocaleTimeString()}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onRefresh(wallet.id)}
              disabled={isLoading}
            >
              <RefreshCw size={14} />
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onRemove(wallet.id)}
            >
              <Trash2 size={14} />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Value Breakdown */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="text-center p-2 bg-background/50 rounded">
            <div className="font-mono text-sm font-semibold">${tokenValue.toLocaleString()}</div>
            <div className="font-mono text-xs text-muted-foreground">Tokens</div>
          </div>
          {defiValue > 0 && (
            <div className="text-center p-2 bg-background/50 rounded">
              <div className="font-mono text-sm font-semibold">${defiValue.toLocaleString()}</div>
              <div className="font-mono text-xs text-muted-foreground">DeFi</div>
            </div>
          )}
          {nftValue > 0 && (
            <div className="text-center p-2 bg-background/50 rounded">
              <div className="font-mono text-sm font-semibold">${nftValue.toLocaleString()}</div>
              <div className="font-mono text-xs text-muted-foreground">NFTs</div>
            </div>
          )}
        </div>

        <Tabs defaultValue="tokens" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="tokens" className="flex items-center gap-2">
              <Coins size={14} />
              Tokens ({wallet.tokens.length})
            </TabsTrigger>
            <TabsTrigger value="defi" className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">DeFi</Badge>
              ({wallet.defiPositions?.length || 0})
            </TabsTrigger>
            <TabsTrigger value="nfts" className="flex items-center gap-2">
              <Image size={14} />
              NFTs ({wallet.nfts.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="tokens" className="space-y-2 mt-4">
            {wallet.tokens.length > 0 ? (
              <div className="space-y-2">
                {wallet.tokens.map((token, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-background/50 rounded border">
                    <div>
                      <div className="font-mono font-semibold text-sm">{token.symbol}</div>
                      <div className="font-mono text-xs text-muted-foreground">{token.name}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono text-sm">
                        {token.balance.toFixed(4)}
                      </div>
                      <div className="font-mono text-xs text-muted-foreground">
                        ${token.usdValue.toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-muted-foreground font-mono text-sm">
                No tokens found
              </div>
            )}
          </TabsContent>

          <TabsContent value="defi" className="space-y-2 mt-4">
            {wallet.defiPositions && wallet.defiPositions.length > 0 ? (
              <div className="space-y-2">
                {wallet.defiPositions.map((position, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-background/50 rounded border">
                    <div>
                      <div className="font-mono font-semibold text-sm">{position.protocol}</div>
                      <div className="font-mono text-xs text-muted-foreground">DeFi Position</div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono text-sm">
                        ${position.usdValue.toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-muted-foreground font-mono text-sm">
                No DeFi positions found
              </div>
            )}
          </TabsContent>

          <TabsContent value="nfts" className="space-y-2 mt-4">
            {wallet.nfts.length > 0 ? (
              <div className="space-y-2">
                {wallet.nfts.map((nft, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-background/50 rounded border">
                    <div>
                      <div className="font-mono font-semibold text-sm">{nft.name}</div>
                      <div className="font-mono text-xs text-muted-foreground">
                        {nft.count} item{nft.count !== 1 ? 's' : ''}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono text-sm">
                        ${nft.totalValue.toLocaleString()}
                      </div>
                      <div className="font-mono text-xs text-muted-foreground">
                        Est. Value
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-muted-foreground font-mono text-sm">
                No NFTs found
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
