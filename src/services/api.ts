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
};
