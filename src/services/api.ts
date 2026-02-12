const API_BASE = "http://localhost:8080";

export interface Category {
  id: number;
  name: string;
  type: string | number;
}

export interface CreateCategoryPayload {
  name: string;
  categoryType: number;
}

export interface Transaction {
  id: number;
  description: string;
  amount: number;
  categoryId: number;
  date: string;
  category?: Category;
}

export interface CreateTransactionPayload {
  description: string;
  amount: number;
  categoryId: number;
  date: string;
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorText = await response.text().catch(() => "Erro desconhecido");
    throw new Error(`Erro ${response.status}: ${errorText}`);
  }
  return response.json();
}

export const api = {
  categories: {
    list: (): Promise<Category[]> =>
      fetch(`${API_BASE}/categories`).then((r) => handleResponse<Category[]>(r)),

    create: (payload: CreateCategoryPayload): Promise<Category> =>
      fetch(`${API_BASE}/categories`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }).then((r) => handleResponse<Category>(r)),
  },

  revenues: {
    list: (): Promise<Transaction[]> =>
      fetch(`${API_BASE}/revenues`).then((r) => handleResponse<Transaction[]>(r)),

    create: (payload: CreateTransactionPayload): Promise<Transaction> =>
      fetch(`${API_BASE}/revenues`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }).then((r) => handleResponse<Transaction>(r)),
  },

  expenses: {
    list: (): Promise<Transaction[]> =>
      fetch(`${API_BASE}/expenses`).then((r) => handleResponse<Transaction[]>(r)),

    create: (payload: CreateTransactionPayload): Promise<Transaction> =>
      fetch(`${API_BASE}/expenses`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }).then((r) => handleResponse<Transaction>(r)),
  },
};
