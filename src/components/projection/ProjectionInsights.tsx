
import React from 'react';

interface ProjectionInsightsProps {
  isPositiveProjection: boolean;
  projectionMonths: number;
  currencySymbol: string;
  projectionData: any[];
  totalGrowth: number;
  fiRatio: number;
}

export const ProjectionInsights: React.FC<ProjectionInsightsProps> = ({
  isPositiveProjection,
  projectionMonths,
  currencySymbol,
  projectionData,
  totalGrowth,
  fiRatio
}) => {
  return (
    <div className="p-4 bg-muted/20 border-l-4 border-accent">
      <div className="text-xs font-mono text-muted-foreground">
        💡 <strong>AI Insights:</strong>
        <br />
        • {isPositiveProjection ? 'Positive' : 'Negative'} growth trajectory over {projectionMonths} months
        <br />
        • Monthly net flow: {currencySymbol}{Math.round(projectionData[1]?.netChange || 0).toLocaleString()}
        <br />
        • Total projected change: {currencySymbol}{totalGrowth.toLocaleString()}
        <br />
        • {fiRatio >= 100 ? 'Congratulations! You\'ve achieved financial independence!' :
           fiRatio >= 75 ? 'You\'re very close to financial independence!' :
           fiRatio >= 50 ? 'You\'re making good progress towards financial independence.' :
           fiRatio >= 25 ? 'Consider increasing passive income or reducing expenses.' :
           'Focus on building passive income streams for long-term stability.'}
      </div>
    </div>
  );
};
