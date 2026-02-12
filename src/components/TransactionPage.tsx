import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, type CreateTransactionPayload, type Transaction } from "@/services/api";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Loader2, TrendingUp, TrendingDown, AlertCircle } from "lucide-react";

interface TransactionPageProps {
  type: "revenue" | "expense";
}

const config = {
  revenue: {
    title: "Receitas",
    subtitle: "Gerencie suas receitas",
    formTitle: "Nova Receita",
    listTitle: "Receitas Cadastradas",
    emptyMessage: "Nenhuma receita cadastrada",
    successMessage: "Receita criada com sucesso!",
    errorMessage: "Erro ao criar receita",
    categoryType: 1,
    icon: TrendingUp,
    badgeClass: "badge-revenue",
    queryKey: "revenues" as const,
  },
  expense: {
    title: "Despesas",
    subtitle: "Gerencie suas despesas",
    formTitle: "Nova Despesa",
    listTitle: "Despesas Cadastradas",
    emptyMessage: "Nenhuma despesa cadastrada",
    successMessage: "Despesa criada com sucesso!",
    errorMessage: "Erro ao criar despesa",
    categoryType: 2,
    icon: TrendingDown,
    badgeClass: "badge-expense",
    queryKey: "expenses" as const,
  },
};

export default function TransactionPage({ type }: TransactionPageProps) {
  const cfg = config[type];
  const Icon = cfg.icon;
  const queryClient = useQueryClient();

  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [date, setDate] = useState("");

  const { data: transactions, isLoading, isError } = useQuery({
    queryKey: [cfg.queryKey],
    queryFn: api[cfg.queryKey].list,
  });

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: api.categories.list,
  });

  const filteredCategories = categories?.filter(
    (cat) => cat.type === cfg.categoryType || cat.type === (cfg.categoryType === 1 ? "REVENUE" : "EXPENSE")
  );

  const createMutation = useMutation({
    mutationFn: (payload: CreateTransactionPayload) =>
      api[cfg.queryKey].create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [cfg.queryKey] });
      setDescription("");
      setAmount("");
      setCategoryId("");
      setDate("");
      toast.success(cfg.successMessage);
    },
    onError: (error: Error) => {
      toast.error(cfg.errorMessage, {
        description: error.message,
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = description.trim();
    if (!trimmed || !amount || !categoryId || !date) {
      toast.warning("Campos obrigatórios", {
        description: "Preencha todos os campos antes de salvar.",
      });
      return;
    }
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      toast.warning("Valor inválido", {
        description: "Informe um valor numérico maior que zero.",
      });
      return;
    }
    createMutation.mutate({
      description: trimmed,
      amount: parsedAmount,
      categoryId: Number(categoryId),
      date,
    });
  };

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);

  const formatDate = (value: string) => {
    try {
      return new Intl.DateTimeFormat("pt-BR").format(new Date(value));
    } catch {
      return value;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{cfg.title}</h1>
        <p className="text-muted-foreground">{cfg.subtitle}</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Plus className="h-4 w-4" /> {cfg.formTitle}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Input
                  id="description"
                  placeholder="Ex: Salário mensal"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  maxLength={150}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="amount">Valor (R$)</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  min="0.01"
                  placeholder="0,00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Categoria</Label>
                <Select value={categoryId} onValueChange={setCategoryId}>
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Selecione a categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredCategories?.map((cat) => (
                      <SelectItem key={cat.id} value={String(cat.id)}>
                        {cat.name}
                      </SelectItem>
                    ))}
                    {(!filteredCategories || filteredCategories.length === 0) && (
                      <div className="px-2 py-3 text-sm text-muted-foreground text-center">
                        Nenhuma categoria disponível
                      </div>
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="date">Data</Label>
                <Input
                  id="date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>
              <Button type="submit" className="w-full" disabled={createMutation.isPending}>
                {createMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Salvar
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Icon className="h-4 w-4" /> {cfg.listTitle}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading && (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            )}
            {isError && (
              <div className="flex flex-col items-center justify-center py-8 text-destructive gap-2">
                <AlertCircle className="h-8 w-8 opacity-60" />
                <p className="font-medium">Não foi possível carregar os dados</p>
                <p className="text-sm text-muted-foreground">
                  Verifique sua conexão e tente novamente.
                </p>
              </div>
            )}
            {!isLoading && !isError && transactions && transactions.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Icon className="h-10 w-10 mx-auto mb-2 opacity-40" />
                <p>{cfg.emptyMessage}</p>
              </div>
            )}
            {!isLoading && !isError && transactions && transactions.length > 0 && (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Descrição</TableHead>
                      <TableHead>Valor</TableHead>
                      <TableHead>Data</TableHead>
                      <TableHead>Categoria</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions.map((t) => (
                      <TableRow key={t.id}>
                        <TableCell className="font-medium">{t.description}</TableCell>
                        <TableCell>
                          <Badge variant="secondary" className={cfg.badgeClass}>
                            {formatCurrency(t.amount)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {formatDate(t.date)}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {t.category?.name ?? `#${t.categoryId}`}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
