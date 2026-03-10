# Estructura de API y Queries

Esta carpeta contiene la configuración y clientes para las llamadas HTTP.

## Archivos

- **`query-client.ts`**: Configuración del QueryClient de React Query
- **`supabase.ts`**: Cliente de Supabase para consultas a la base de datos
- **`api.ts`**: Cliente HTTP para llamadas a la API de Nest.js
- **`query-keys.ts`**: Query keys organizados y tipados para React Query

## Configuración

### Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto con:

```env
EXPO_PUBLIC_SUPABASE_URL=tu_url_de_supabase
EXPO_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key
EXPO_PUBLIC_API_URL=http://localhost:3000
```

### Uso

#### Supabase (Queries)

```typescript
import { supabase } from "@/lib/supabase";

const { data, error } = await supabase.from("meal_plans").select("*");
```

#### API de Nest.js (Mutations)

```typescript
import { apiClient } from "@/lib/api";

const response = await apiClient.post("/ai/generate-plan", {
  userId: "123",
  startDate: "2024-01-01",
  endDate: "2024-01-07",
});
```

#### React Query Hooks

```typescript
import { useMealPlans } from "@/hooks/queries";
import { useGeneratePlan } from "@/hooks/mutations";

// Query
const { data, isLoading, error } = useMealPlans(userId);

// Mutation
const generatePlan = useGeneratePlan();
generatePlan.mutate({ userId, startDate, endDate });
```
