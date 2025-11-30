import { QueryClient, QueryFunction } from "@tanstack/react-query";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<any> {
  const fullUrl = url.startsWith("http") ? url : `${API_BASE_URL}${url}`;
  const res = await fetch(fullUrl, {
    method,
    headers: data ? { "Content-Type": "application/json" } : {},
    body: data ? JSON.stringify(data) : undefined,
  });

  await throwIfResNotOk(res);
  
  // Return empty object for 204 No Content responses
  if (res.status === 204) {
    return {};
  }
  
  return res.json();
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    // Handle both formats: ["/api/products"] and ["/api/products", { params }]
    let url: string;
    if (typeof queryKey[0] === 'string' && queryKey[0].startsWith('/')) {
      url = queryKey[0];
      // Add query parameters if provided
      if (queryKey[1] && typeof queryKey[1] === 'object') {
        const params = new URLSearchParams();
        Object.entries(queryKey[1] as Record<string, unknown>).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            params.append(key, String(value));
          }
        });
        const queryString = params.toString();
        if (queryString) {
          url = `${url}?${queryString}`;
        }
      }
    } else {
      // Fallback to original behavior for path segments
      url = queryKey.join("/") as string;
    }

    const fullUrl = url.startsWith("http") ? url : `${API_BASE_URL}${url}`;
    const res = await fetch(fullUrl, {
      credentials: "include",
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
