
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useCMSSettings } from '@/hooks/useCMSSettings';

export const ProductStateSection = () => {
  const { settings } = useCMSSettings();

  return (
    <Card className="border-2 border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-mono text-accent">
          📈 STATE OF THE PRODUCT
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Product Description */}
        <div className="space-y-2">
          <p className="text-sm font-mono text-muted-foreground">
            {settings.website_name || 'Numoraq'} is currently in active beta — stable, usable, and already helping early contributors track their personal finances.
            Core features are functional and updated regularly.
          </p>
        </div>

        {/* Core Features */}
        <div className="space-y-3">
          <h3 className="text-lg font-bold font-mono text-foreground">✔️ CORE FUNCTIONALITIES</h3>
          <ul className="space-y-1 text-sm font-mono text-muted-foreground">
            <li className="flex items-center gap-2">
              <span className="text-accent">•</span>
              Portfolio tracking
            </li>
            <li className="flex items-center gap-2">
              <span className="text-accent">•</span>
              Income and expense logging
            </li>
            <li className="flex items-center gap-2">
              <span className="text-accent">•</span>
              Assets and debts overview
            </li>
            <li className="flex items-center gap-2">
              <span className="text-accent">•</span>
              User-defined projections
            </li>
          </ul>
          <p className="text-xs font-mono text-muted-foreground">
            Manual input is fully supported. Live pricing is available for BTC and ETH. Wallet/NFT contract fetching is under development.
          </p>
        </div>

        {/* Current Status */}
        <div className="space-y-3">
          <h3 className="text-lg font-bold font-mono text-foreground">🛠️ CURRENT STATUS</h3>
          <ul className="space-y-1 text-sm font-mono text-muted-foreground">
            <li className="flex items-center gap-2">
              <span className="text-accent">•</span>
              Stable manual entry
            </li>
            <li className="flex items-center gap-2">
              <span className="text-accent">•</span>
              Live pricing for BTC & ETH
            </li>
            <li className="flex items-center gap-2">
              <span className="text-accent">•</span>
              Projection tools (basic logic)
            </li>
            <li className="flex items-center gap-2">
              <span className="text-accent">•</span>
              Artistic Dashboard Animations <span className="italic text-xs">(badge tags enabled, visual rollout in progress)</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-accent">•</span>
              Ad display enabled for non-premium users
            </li>
          </ul>
          <div className="p-2 bg-muted border border-border rounded">
            <p className="text-xs font-mono text-muted-foreground">
              Champion+ donors already have early access flags enabled — animations will appear in an upcoming visual layer update. 
              May be rolled out to lower tiers as well.
            </p>
          </div>
        </div>

        {/* Upcoming Features */}
        <div className="space-y-3">
          <h3 className="text-lg font-bold font-mono text-foreground">🔮 UPCOMING FEATURES</h3>
          <div className="space-y-2">
            {[
              { icon: '🎨', title: 'Artistic Dashboard Animations', desc: 'Themed, immersive animations that change the feel of your financial dashboard.' },
              { icon: '💹', title: 'Auto-compound projections', desc: 'Simulate investment growth with recurring inputs and interest rates.' },
              { icon: '🧠', title: 'AI-powered forecasting', desc: 'Predict your financial future using AI-generated models (including a degen mode).' },
              { icon: '🤖', title: 'AI Chatbot Assistant', desc: 'Ask financial questions, navigate your dashboard, or log data via chat.' },
              { icon: '🧾', title: 'Wallet + NFT fetching', desc: 'Sync Ethereum wallets and NFT contracts into your dashboard automatically.' },
              { icon: '🌊', title: 'OpenSea integration', desc: 'See real-time offer values for NFTs in your collection.' },
              { icon: '🎁', title: 'NFT airdrops for donors', desc: 'Receive limited collectibles shown under your avatar (UI ready, backend coming).' },
              { icon: '🏆', title: 'Leaderboard opt-in', desc: 'Rank among top contributors — completely optional and privacy-respecting.' },
              { icon: '📱', title: 'Improved mobile layout', desc: 'Responsive redesign with better animation handling on small screens.' }
            ].map((feature, index) => (
              <div key={index} className="flex gap-3 p-2 bg-card/30 border border-border rounded">
                <span className="text-lg">{feature.icon}</span>
                <div className="space-y-1">
                  <h4 className="text-sm font-bold font-mono text-foreground">{feature.title}</h4>
                  <p className="text-xs font-mono text-muted-foreground">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="border-t border-border pt-4">
          <p className="text-xs font-mono text-muted-foreground">
            🎁 Want early access to premium features? <strong>Follow us on social media</strong> for exclusive degen codes and giveaways!
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
