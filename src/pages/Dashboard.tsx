import React, { useState, useEffect } from 'react';
import { Calendar } from "lucide-react";

import { Overview } from '@/components/Overview';
import { RecentSales } from '@/components/RecentSales';
import { Shell } from '@/components/Shell';
import { Card, CardContent } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { useFinancialData } from '@/contexts/FinancialDataContext';
import { Expenses } from '@/components/expenses/Expenses';
import { AddIncomeDialog } from '@/components/income/AddIncomeDialog';
import { Income } from '@/components/income/Income';
import { useTranslation } from '@/contexts/TranslationContext';
import { DatePicker } from '@/components/ui/date-picker';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { buttonVariants } from "@/components/ui/button"
import { Link } from 'react-router-dom';
import { AvatarSelector } from '@/components/profile/AvatarSelector';
import { PortfolioOverview } from '@/components/PortfolioOverview';
import { BlackHoleAnimation } from '@/components/animations/BlackHoleAnimation';
import { useUserTitle } from '@/hooks/useUserTitle';

export default function Dashboard() {
  const { toast } = useToast()
  const { data, addIncome, updateIncome, removeIncome, setDateRange } = useFinancialData();
  const { t } = useTranslation();
  const [isAddingIncome, setIsAddingIncome] = useState(false);
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(new Date());
  
  const { title } = useUserTitle();
  const isChampionOrHigher = title && ['CHAMPION', 'LEGEND', 'TITAN', 'OVERLORD'].includes(title.title);

  const handleDateChange = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date) {
      setDateRange({
        from: format(date, 'yyyy-MM-dd'),
        to: format(date, 'yyyy-MM-dd')
      });
    }
  };

  useEffect(() => {
    if (selectedDate) {
      setDateRange({
        from: format(selectedDate, 'yyyy-MM-dd'),
        to: format(selectedDate, 'yyyy-MM-dd')
      });
    }
  }, [selectedDate, setDateRange]);

  return (
    <div className="min-h-screen bg-background relative">
      {/* Black hole animation for Champion+ users */}
      <BlackHoleAnimation isVisible={!!isChampionOrHigher} />
      
      <div className="relative z-10">
        <Shell>
          <div className="md:grid md:grid-cols-3 md:gap-6">
            <div className="md:col-span-1">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">{t.profile}</h3>
                <Link to="/settings" className={cn(buttonVariants({ variant: "ghost" }), "pl-0")}>
                  {t.edit}
                </Link>
              </div>
              <p className="text-sm text-muted-foreground">
                {t.profileDescription}
              </p>
            </div>
            <div className="mt-5 md:col-span-2 md:mt-0">
              <Card>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col items-center justify-center">
                      <AvatarSelector nickname={data.userProfile.nickname} />
                      <div className="text-sm font-medium">{data.userProfile.nickname}</div>
                      <div className="text-xs text-muted-foreground">{title?.title}</div>
                    </div>
                    <div className="space-y-2">
                      <div className="grid gap-2">
                        <label
                          htmlFor="email"
                          className="text-sm font-medium leading-none"
                        >
                          {t.email}
                        </label>
                        <input
                          type="email"
                          id="email"
                          value={data.userProfile.email}
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          readOnly
                        />
                      </div>
                      <div className="grid gap-2">
                        <label
                          htmlFor="username"
                          className="text-sm font-medium leading-none"
                        >
                          {t.username}
                        </label>
                        <input
                          type="text"
                          id="username"
                          value={data.userProfile.username}
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          readOnly
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          <div className="py-12">
            <div className="md:grid md:grid-cols-3 md:items-center md:gap-6">
              <div className="md:col-span-1">
                <h3 className="text-lg font-medium">{t.financialOverview}</h3>
                <p className="text-sm text-muted-foreground">
                  {t.financialOverviewDescription}
                </p>
              </div>
              <div className="mt-5 md:col-span-2 md:mt-0">
                <PortfolioOverview />
              </div>
            </div>
          </div>
          <div className="grid gap-10">
            <Card>
              <CardContent>
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">{t.income}</h3>
                    <AddIncomeDialog
                      isOpen={isAddingIncome}
                      onOpenChange={setIsAddingIncome}
                      onAddIncome={(income) => {
                        addIncome(income);
                        toast({
                          title: "Success",
                          description: "Income added successfully.",
                        })
                      }}
                    />
                </div>
                <Income
                  income={data.income}
                  onUpdateIncome={(id, updates) => {
                    updateIncome(id, updates);
                    toast({
                      title: "Success",
                      description: "Income updated successfully.",
                    })
                  }}
                  onRemoveIncome={(id) => {
                    removeIncome(id);
                    toast({
                      title: "Success",
                      description: "Income removed successfully.",
                    })
                  }}
                />
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">{t.expenses}</h3>
                </div>
                <Expenses />
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-10">
            <Card>
              <CardContent>
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">{t.sales}</h3>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4" />
                    <DatePicker
                      date={selectedDate}
                      onDateChange={handleDateChange}
                    />
                  </div>
                </div>
                <RecentSales />
              </CardContent>
            </Card>
          </div>
        </Shell>
      </div>
    </div>
  );
}
