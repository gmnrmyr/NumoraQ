
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Home, Heart, Stethoscope, Wifi, Car, ShoppingCart, CreditCard } from "lucide-react";

export const ExpenseTracking = () => {
  const recurringExpenses = [
    { item: "Condomínio Macuco", amount: 1117, category: "Vacância", icon: Home, date: 5 },
    { item: "Locação Taubaté (3P)", amount: 2800, category: "Moradia", icon: Home, date: 15 },
    { item: "Convênio GUI - Sulamerica", amount: 1163, category: "Saúde", icon: Stethoscope, date: 20 },
    { item: "Convênio Mãe - Preventsenior", amount: 1295, category: "Saúde", icon: Stethoscope, date: 25 },
    { item: "Cannabis - GUI", amount: 1000, category: "Vícios", icon: Heart, date: 28 },
    { item: "Internet Vivo", amount: 90, category: "Serviços", icon: Wifi },
    { item: "Goró Pai", amount: 100, category: "Vícios", icon: Heart },
    { item: "IPVAs (2)", amount: 100, category: "Imposto", icon: Car },
    { item: "Mercado - Limpeza", amount: 200, category: "Higiene", icon: ShoppingCart },
    { item: "IPTUs (3)", amount: 200, category: "Imposto", icon: Home },
    { item: "Planos de Celulares (3)", amount: 270, category: "Serviços", icon: Wifi },
    { item: "Farmácia - Remédios", amount: 300, category: "Saúde", icon: Stethoscope },
    { item: "Goodstorage - Pai", amount: 350, category: "Storage", icon: Home },
    { item: "Cigarro", amount: 500, category: "Vícios", icon: Heart },
    { item: "Imposto sob Locação (3)", amount: 1000, category: "Imposto", icon: Home },
    { item: "Mercado - Comida", amount: 1100, category: "Alimentação", icon: ShoppingCart },
    { item: "Locação Studio GUI", amount: 1100, category: "Moradia", icon: Home },
    { item: "Locação Studio Pai", amount: 1100, category: "Moradia", icon: Home }
  ];

  const variableExpenses = [
    { item: "Cartão Inter GUI - Mensal (JUL)", amount: 1800, date: 10 },
    { item: "Cartão Inter GUI - Quitar", amount: 4600 },
    { item: "Reforma Macuco - Roberval + Materiais", amount: 7100 },
    { item: "Concerto Voltz EV1 (Bateria Nova)", amount: 5000 },
    { item: "Parcelamento Cartão Telhanorte", amount: 2200 },
    { item: "Geladeira", amount: 1200 },
    { item: "Cooktop", amount: 400 },
    { item: "Forno", amount: 300 },
    { item: "Armários", amount: 450 },
    { item: "Tactics", amount: 800 },
    { item: "Reforma Ataliba", amount: 1100 },
    { item: "Extras (Sempre tem!)", amount: 1000 },
    { item: "Déficit - 3 meses sem alugar Macuco", amount: 21600 },
    { item: "Guincho - Scooter + Bike", amount: 850 },
    { item: "Gasolina (Idas SP)", amount: 350 },
    { item: "Clube Tiro", amount: 850 },
    { item: "Concerto Vidro Carro", amount: 900 },
    { item: "Churras em Taubaté", amount: 500 },
    { item: "Paraty com Fe", amount: 2500 },
    { item: "Ventiladores", amount: 250 }
  ];

  const totalRecurring = recurringExpenses.reduce((sum, expense) => sum + expense.amount,  0);
  const totalVariable = variableExpenses.reduce((sum, expense) => sum + expense.amount, 0);

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      "Moradia": "bg-blue-100 text-blue-800 border-blue-200",
      "Saúde": "bg-green-100 text-green-800 border-green-200",
      "Vícios": "bg-red-100 text-red-800 border-red-200",
      "Serviços": "bg-purple-100 text-purple-800 border-purple-200",
      "Imposto": "bg-orange-100 text-orange-800 border-orange-200",
      "Alimentação": "bg-yellow-100 text-yellow-800 border-yellow-200",
      "Higiene": "bg-teal-100 text-teal-800 border-teal-200",
      "Storage": "bg-gray-100 text-gray-800 border-gray-200",
      "Vacância": "bg-amber-100 text-amber-800 border-amber-200"
    };
    return colors[category] || "bg-slate-100 text-slate-800 border-slate-200";
  };

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, any> = {
      "Moradia": Home,
      "Saúde": Stethoscope,
      "Vícios": Heart,
      "Serviços": Wifi,
      "Alimentação": ShoppingCart,
      "Higiene": ShoppingCart,
      "Storage": Home,
      "Imposto": Car,
      "Vacância": Home
    };
    return icons[category] || Home;
  };

  // Group expenses by category for better visualization
  const expensesByCategory = recurringExpenses.reduce((acc, expense) => {
    if (!acc[expense.category]) {
      acc[expense.category] = [];
    }
    acc[expense.category].push(expense);
    return acc;
  }, {} as Record<string, typeof recurringExpenses>);

  return (
    <div className="space-y-6">
      <Tabs defaultValue="recurring" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="recurring">Recurring Expenses</TabsTrigger>
          <TabsTrigger value="variable">Variable Expenses</TabsTrigger>
        </TabsList>

        <TabsContent value="recurring" className="space-y-4">
          <Card className="bg-red-50 border-red-200">
            <CardHeader>
              <CardTitle className="text-red-800">Monthly Recurring Expenses</CardTitle>
              <div className="text-2xl font-bold text-red-700">
                R$ {totalRecurring.toLocaleString()}/month
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                {Object.entries(expensesByCategory).map(([category, expenses]) => {
                  const categoryTotal = expenses.reduce((sum, exp) => sum + exp.amount, 0);
                  const CategoryIcon = getCategoryIcon(category);
                  
                  return (
                    <Card key={category} className="bg-white shadow-sm">
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <CategoryIcon size={16} />
                            <span className="font-medium">{category}</span>
                          </div>
                          <Badge className={getCategoryColor(category)}>
                            R$ {categoryTotal.toLocaleString()}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        {expenses.map((expense, index) => {
                          const Icon = expense.icon;
                          return (
                            <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                              <div className="flex items-center gap-2">
                                <Icon size={14} className="text-gray-600" />
                                <span className="text-sm">{expense.item}</span>
                                {expense.date && (
                                  <Badge variant="outline" className="text-xs">
                                    Day {expense.date}
                                  </Badge>
                                )}
                              </div>
                              <span className="font-medium">R$ {expense.amount.toLocaleString()}</span>
                            </div>
                          );
                        })}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="variable" className="space-y-4">
          <Card className="bg-orange-50 border-orange-200">
            <CardHeader>
              <CardTitle className="text-orange-800">Variable Expenses</CardTitle>
              <div className="text-2xl font-bold text-orange-700">
                R$ {totalVariable.toLocaleString()} total
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {variableExpenses.map((expense, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm">
                  <div className="flex items-center gap-2">
                    <CreditCard size={16} className="text-orange-600" />
                    <span className="font-medium">{expense.item}</span>
                    {expense.date && (
                      <Badge variant="outline" className="text-xs">
                        Day {expense.date}
                      </Badge>
                    )}
                  </div>
                  <span className="font-bold text-orange-700">
                    R$ {expense.amount.toLocaleString()}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Expense Summary */}
      <Card className="bg-gradient-to-r from-red-50 to-orange-50 border-red-200">
        <CardHeader>
          <CardTitle className="text-slate-800">Expense Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-white rounded-lg shadow-sm">
              <div className="text-sm text-slate-600">Monthly Recurring</div>
              <div className="text-xl font-bold text-red-600">
                R$ {totalRecurring.toLocaleString()}
              </div>
              <div className="text-xs text-slate-500">
                R$ {(totalRecurring * 12).toLocaleString()}/year
              </div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg shadow-sm">
              <div className="text-sm text-slate-600">Variable Expenses</div>
              <div className="text-xl font-bold text-orange-600">
                R$ {totalVariable.toLocaleString()}
              </div>
              <div className="text-xs text-slate-500">One-time expenses</div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg shadow-sm border-2 border-red-200">
              <div className="text-sm text-slate-600">Total Impact</div>
              <div className="text-2xl font-bold text-red-600">
                R$ {(totalRecurring + totalVariable).toLocaleString()}
              </div>
              <div className="text-xs text-slate-500">Combined expenses</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
