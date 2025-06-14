
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, AlertCircle, User, FileText, Wrench, Car, Home } from "lucide-react";

export const TaskManagement = () => {
  const tasks = [
    { item: "Exames", date: "Domingo", priority: 1, icon: User },
    { item: "Consulta Psiquiatra", date: "Julho", priority: 5, icon: User },
    { item: "Encontrar carteira de trabalho", date: "Segunda", priority: 2, icon: FileText },
    { item: "Confirmar cobertura assistência médica", date: "", priority: 6, icon: User },
    { item: "Pagar contas pendentes (R$ 12.000)", date: "", priority: 7, icon: AlertCircle },
    { item: "Fotografar e anunciar móveis/scooter", date: "", priority: 8, icon: FileText },
    { item: "IR DETRAN", date: "", priority: 9, icon: Car },
    { item: "Exames pós-urologista", date: "", priority: 10, icon: User },
    { item: "Resolver scooter/bicicleta (Guincho R$ 850)", date: "", priority: 11, icon: Wrench },
    { item: "Encontrar carteira de trabalho (Taubaté)", date: "", priority: 12, icon: FileText },
    { item: "Cortar cabelo", date: "", priority: 13, icon: User },
    { item: "Pagar locação Taubaté", date: "", priority: 14, icon: Home },
    { item: "Consultar URO sobre atendimento online", date: "", priority: 16, icon: User },
    { item: "Acompanhar reforma Macuco (meta: outubro)", date: "", priority: 17, icon: Wrench },
    { item: "Planejar reforma Ataliba (para 2026)", date: "", priority: 18, icon: Wrench },
    { item: "Voltar a dirigir (carro da mãe)", date: "", priority: 19, icon: Car },
    { item: "Encerrar guarda-volumes", date: "", priority: 20, icon: Home },
    { item: "Descalcificar Gaggia", date: "", priority: 21, icon: Wrench },
    { item: "Resolver cheiro cozinha", date: "", priority: 22, icon: Home },
    { item: "Evitar studio adicional (+R$ 1.200/mês)", date: "", priority: 23, icon: AlertCircle },
    { item: "Aprender a cozinhar", date: "", priority: 24, icon: User },
    { item: "Consultar advogado (aposentadoria pai)", date: "", priority: 25, icon: FileText },
    { item: "Avaliar cancelamento convênio Gui", date: "", priority: 26, icon: AlertCircle },
    { item: "Refazer planilha financeira", date: "", priority: 27, icon: FileText },
    { item: "Deixar Modem Macuco (bem catalogado)", date: "", priority: 28, icon: Wrench },
    { item: "Plataformas: Workana, Upwork, 99Freelas Meta 3k Mes", date: "", priority: 29, icon: FileText },
    { item: "Academia e Estudar para Concurso", date: "", priority: 30, icon: User }
  ];

  const getPriorityColor = (priority: number) => {
    if (priority <= 5) return 'bg-red-100 text-red-800 border-red-200';
    if (priority <= 15) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    return 'bg-green-100 text-green-800 border-green-200';
  };

  const getPriorityLabel = (priority: number) => {
    if (priority <= 5) return 'High';
    if (priority <= 15) return 'Medium';
    return 'Low';
  };

  const sortedTasks = [...tasks].sort((a, b) => a.priority - b.priority);
  const highPriorityTasks = sortedTasks.filter(task => task.priority <= 5);
  const mediumPriorityTasks = sortedTasks.filter(task => task.priority > 5 && task.priority <= 15);
  const lowPriorityTasks = sortedTasks.filter(task => task.priority > 15);

  const TaskSection = ({ title, tasks, bgColor, borderColor }: any) => (
    <Card className={`${bgColor} ${borderColor}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar size={20} />
          {title}
          <Badge variant="outline">{tasks.length} tasks</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {tasks.map((task: any, index: number) => {
          const Icon = task.icon;
          return (
            <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm">
              <div className="flex items-center gap-3">
                <Icon size={16} className="text-slate-600" />
                <div>
                  <span className="font-medium">{task.item}</span>
                  {task.date && (
                    <div className="text-xs text-slate-500 mt-1">{task.date}</div>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge className={getPriorityColor(task.priority)}>
                  {getPriorityLabel(task.priority)}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  #{task.priority}
                </Badge>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Task Overview */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-800">Task Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-white rounded-lg shadow-sm">
              <div className="text-sm text-slate-600">High Priority</div>
              <div className="text-2xl font-bold text-red-600">{highPriorityTasks.length}</div>
              <div className="text-xs text-slate-500">Urgent tasks</div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg shadow-sm">
              <div className="text-sm text-slate-600">Medium Priority</div>
              <div className="text-2xl font-bold text-yellow-600">{mediumPriorityTasks.length}</div>
              <div className="text-xs text-slate-500">Important tasks</div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg shadow-sm">
              <div className="text-sm text-slate-600">Low Priority</div>
              <div className="text-2xl font-bold text-green-600">{lowPriorityTasks.length}</div>
              <div className="text-xs text-slate-500">Future tasks</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Task Sections */}
      <div className="space-y-6">
        <TaskSection 
          title="High Priority Tasks" 
          tasks={highPriorityTasks} 
          bgColor="bg-red-50" 
          borderColor="border-red-200"
        />
        <TaskSection 
          title="Medium Priority Tasks" 
          tasks={mediumPriorityTasks} 
          bgColor="bg-yellow-50" 
          borderColor="border-yellow-200"
        />
        <TaskSection 
          title="Low Priority Tasks" 
          tasks={lowPriorityTasks} 
          bgColor="bg-green-50" 
          borderColor="border-green-200"
        />
      </div>

      {/* Financial Impact Tasks */}
      <Card className="bg-amber-50 border-amber-200">
        <CardHeader>
          <CardTitle className="text-amber-800 flex items-center gap-2">
            <AlertCircle size={20} />
            Financial Impact Tasks
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="p-3 bg-white rounded-lg shadow-sm border-l-4 border-red-500">
            <div className="font-medium text-red-700">Pagar contas pendentes</div>
            <div className="text-sm text-red-600">R$ 12.000 impact</div>
          </div>
          <div className="p-3 bg-white rounded-lg shadow-sm border-l-4 border-yellow-500">
            <div className="font-medium text-yellow-700">Evitar studio adicional</div>
            <div className="text-sm text-yellow-600">+R$ 1.200/mês savings</div>
          </div>
          <div className="p-3 bg-white rounded-lg shadow-sm border-l-4 border-green-500">
            <div className="font-medium text-green-700">Plataformas freelance</div>
            <div className="text-sm text-green-600">Meta: R$ 3.000/mês income</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
