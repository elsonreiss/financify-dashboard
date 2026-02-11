import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, type CreateCategoryPayload } from "@/services/api";
import { toast } from "@/hooks/use-toast";
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
import { Plus, Loader2, Tags } from "lucide-react";

export default function Categories() {
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [type, setType] = useState<"REVENUE" | "EXPENSE" | "">("");

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
      toast({
        title: "Categoria criada!",
        description: "A categoria foi salva com sucesso.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao criar categoria",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();
    if (!trimmedName || !type) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha o nome e selecione o tipo.",
        variant: "destructive",
      });
      return;
    }
    if (trimmedName.length > 100) {
      toast({
        title: "Nome muito longo",
        description: "O nome deve ter no máximo 100 caracteres.",
        variant: "destructive",
      });
      return;
    }
    createMutation.mutate({ name: trimmedName, type });
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
                  onValueChange={(v) => setType(v as "REVENUE" | "EXPENSE")}
                >
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="REVENUE">Receita</SelectItem>
                    <SelectItem value="EXPENSE">Despesa</SelectItem>
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
              <div className="text-center py-8 text-destructive">
                <p className="font-medium">Erro ao carregar categorias</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Verifique se a API está disponível em http://localhost:8080
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
                      <TableHead>ID</TableHead>
                      <TableHead>Nome</TableHead>
                      <TableHead>Tipo</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {categories.map((cat) => (
                      <TableRow key={cat.id}>
                        <TableCell className="font-mono text-muted-foreground">
                          {cat.id}
                        </TableCell>
                        <TableCell className="font-medium">{cat.name}</TableCell>
                        <TableCell>
                          <Badge
                            variant="secondary"
                            className={
                              cat.type === "REVENUE"
                                ? "badge-revenue"
                                : "badge-expense"
                            }
                          >
                            {cat.type === "REVENUE" ? "Receita" : "Despesa"}
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
