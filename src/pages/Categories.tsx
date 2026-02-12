import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, type CreateCategoryPayload } from "@/services/api";
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
import { Plus, Loader2, Tags, AlertCircle } from "lucide-react";

export default function Categories() {
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [type, setType] = useState<string>("");

  const { data: categories, isLoading, isError } = useQuery({
    queryKey: ["categories"],
    queryFn: api.categories.list,
  });

  const createMutation = useMutation({
    mutationFn: (payload: CreateCategoryPayload) =>
      api.categories.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      setName("");
      setType("");
      toast.success("Categoria criada com sucesso!");
    },
    onError: () => {
      toast.error("Não é possível criar com o mesmo nome.");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();
    if (!trimmedName || !type) {
      toast.warning("Campos obrigatórios", {
        description: "Preencha o nome e selecione o tipo.",
      });
      return;
    }
    if (trimmedName.length > 100) {
      toast.warning("Nome muito longo", {
        description: "O nome deve ter no máximo 100 caracteres.",
      });
      return;
    }
    createMutation.mutate({ name: trimmedName, categoryType: Number(type) });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Categorias</h1>
        <p className="text-muted-foreground">
          Gerencie as categorias de receitas e despesas
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Form */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Plus className="h-4 w-4" /> Nova Categoria
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome</Label>
                <Input
                  id="name"
                  placeholder="Ex: Alimentação"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  maxLength={100}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Tipo</Label>
                <Select
                  value={type}
                  onValueChange={(v) => setType(v)}
                >
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Receita</SelectItem>
                    <SelectItem value="2">Despesa</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button
                type="submit"
                className="w-full"
                disabled={createMutation.isPending}
              >
                {createMutation.isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                Salvar
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* List */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Tags className="h-4 w-4" /> Categorias Cadastradas
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
                <p className="font-medium">Não foi possível carregar as categorias</p>
                <p className="text-sm text-muted-foreground">
                  Verifique sua conexão e tente novamente.
                </p>
              </div>
            )}
            {!isLoading && !isError && categories && categories.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Tags className="h-10 w-10 mx-auto mb-2 opacity-40" />
                <p>Nenhuma categoria cadastrada</p>
              </div>
            )}
            {!isLoading && !isError && categories && categories.length > 0 && (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Tipo</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {categories.map((cat) => (
                      <TableRow key={cat.id}>
                        <TableCell className="font-medium">{cat.name}</TableCell>
                        <TableCell>
                          <Badge
                            variant="secondary"
                            className={
                              cat.type === "REVENUE" || cat.type === 1 || (cat as any).categoryType === 1
                                ? "badge-revenue"
                                : "badge-expense"
                            }
                          >
                            {cat.type === "REVENUE" || cat.type === 1 || (cat as any).categoryType === 1 ? "Receita" : "Despesa"}
                          </Badge>
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
