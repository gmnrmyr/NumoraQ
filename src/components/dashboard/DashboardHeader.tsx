
import React from 'react';
import { useAuth } from "@/contexts/AuthContext";
import { useFinancialData } from "@/contexts/FinancialDataContext";
import { UserTitleBadge } from "./UserTitleBadge";

export const DashboardHeader = () => {
  const { user } = useAuth();
  const { data } = useFinancialData();

  return (
    <div className="text-center space-y-2">
      <h1 className="text-3xl sm:text-4xl font-bold font-mono text-accent uppercase tracking-wider">
        FINANCIAL DASHBOARD
      </h1>
      {user && (
        <div className="flex items-center justify-center gap-2 flex-wrap">
          <span className="text-lg font-mono text-muted-foreground">
            Welcome back, {data.userProfile?.name || user.email?.split('@')[0]}
          </span>
          <UserTitleBadge userName={data.userProfile?.name || user.email?.split('@')[0] || 'User'} />
        </div>
      )}
      <div className="h-1 bg-accent w-32 mx-auto"></div>
    </div>
  );
};
