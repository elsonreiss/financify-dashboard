import { useQuery } from "@tanstack/react-query";
import { api } from "@/services/api";
import { Tags, TrendingUp, TrendingDown, BarChart3 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

const summaryCards = [
  {
    title: "Categorias",
    icon: Tags,
    path: "/categories",
    color: "text-primary",
    bgColor: "bg-accent",
  },
  {
    title: "Receitas",
    icon: TrendingUp,
    path: "/revenues",
    color: "text-revenue",
    bgColor: "bg-revenue/10",
  },
  {
    title: "Despesas",
    icon: TrendingDown,
    path: "/expenses",
    color: "text-expense",
    bgColor: "bg-expense/10",
  },
  {
    title: "Relatórios",
    icon: BarChart3,
    path: "/reports",
    color: "text-primary",
    bgColor: "bg-accent",
  },
];

export default function Dashboard() {
  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: api.categories.list,
  });

  const revenueCount = categories?.filter((c) => c.type === "REVENUE").length ?? 0;
  const expenseCount = categories?.filter((c) => c.type === "EXPENSE").length ?? 0;
  const navigate = useNavigate();

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Gestão Financeira</h1>
        <p className="text-muted-foreground">
          Visão geral do seu sistema financeiro
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {summaryCards.map((card) => (
          <Card
            key={card.title}
            className="cursor-pointer transition-all hover:shadow-md hover:-translate-y-0.5"
            onClick={() => navigate(card.path)}
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {card.title}
              </CardTitle>
              <div className={`rounded-lg p-2 ${card.bgColor}`}>
                <card.icon className={`h-4 w-4 ${card.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {card.title === "Categorias" && (categories?.length ?? "—")}
                {card.title === "Receitas" && revenueCount}
                {card.title === "Despesas" && expenseCount}
                {card.title === "Relatórios" && "—"}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {card.title === "Categorias" && "cadastradas"}
                {card.title === "Receitas" && "categorias de receita"}
                {card.title === "Despesas" && "categorias de despesa"}
                {card.title === "Relatórios" && "em breve"}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
