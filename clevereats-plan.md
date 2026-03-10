# CleverEats - Plan de Desarrollo

## 📋 Resumen Ejecutivo

**CleverEats** es una aplicación móvil de planificación de comidas potenciada por IA que genera planes semanales personalizados basados en las preferencias, restricciones y objetivos del usuario.

### Stack Tecnológico
| Capa | Tecnología |
|------|------------|
| Frontend | React Native + Expo (managed workflow) |
| Base de datos | Supabase (PostgreSQL) |
| Autenticación | Supabase Auth |
| Backend/Lógica | Supabase Edge Functions (Deno) |
| IA | Groq API (modelo a definir) |
| Estado local | Zustand o React Query |

---

## 🏗️ Arquitectura General

```
┌─────────────────────────────────────────────────────────────────┐
│                      CLIENTE (React Native/Expo)                 │
├─────────────────────────────────────────────────────────────────┤
│  UI Components │ Navigation │ State Management │ Offline Cache  │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                         SUPABASE                                 │
├──────────────────┬──────────────────┬───────────────────────────┤
│   Supabase Auth  │  Supabase DB     │   Edge Functions (Deno)   │
│   - Email/Pass   │  - PostgreSQL    │   - generate-meal-plan    │
│   - OAuth        │  - RLS Policies  │   - generate-recipe       │
│   - Session      │  - Real-time     │   - generate-shopping-list│
│                  │                  │   - chat-nutritionist     │
└──────────────────┴──────────────────┴───────────────────────────┘
                                              │
                                              ▼
                                    ┌─────────────────┐
                                    │    GROQ API     │
                                    │  (IA gratuita)  │
                                    └─────────────────┘
```

---

## 🔧 Backend: ¿Edge Functions o Backend Propio?

### ✅ Recomendación: Supabase Edge Functions

**Razones:**
1. **Integración nativa** con Supabase Auth y DB
2. **Gratuitas** en el free tier (500K invocaciones/mes)
3. **Deno runtime** - moderno, seguro, TypeScript nativo
4. **Despliegue simple** con `supabase functions deploy`
5. **Secrets management** integrado para API keys (Groq)

### Cuándo considerar Backend propio:
- Si necesitas WebSockets complejos (para chat en tiempo real avanzado)
- Si excedes los límites del free tier
- Si necesitas procesamiento pesado de imágenes

### Alternativas gratuitas (si necesitas escalar):
| Plataforma | Free Tier | Uso recomendado |
|------------|-----------|-----------------|
| **Supabase Edge Functions** | 500K inv/mes | ✅ Principal |
| **Cloudflare Workers** | 100K req/día | Alternativa si escalas |
| **Vercel Edge Functions** | 100K inv/mes | Si usas Vercel para web |
| **Deno Deploy** | 1M req/mes | Compatible con código Supabase |

---

## 📊 Estructura de Base de Datos (Supabase)

### Diagrama ER Simplificado

```
┌──────────────┐       ┌───────────────────┐       ┌─────────────────┐
│   profiles   │──────<│   user_preferences │       │   meal_plans    │
└──────────────┘       └───────────────────┘       └────────┬────────┘
       │                                                     │
       │               ┌───────────────────┐                │
       └──────────────>│   meal_reactions  │<───────────────┘
                       └───────────────────┘
                                │
                       ┌────────┴────────┐
                       ▼                 ▼
              ┌─────────────┐    ┌──────────────┐
              │    meals    │    │   recipes    │
              └─────────────┘    └──────────────┘
```

### Tablas Detalladas

#### 1. `profiles` (Extensión de auth.users)
```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  
  -- Datos físicos (para futuro nutricionista IA)
  birth_date DATE,
  gender TEXT CHECK (gender IN ('male', 'female', 'other', 'prefer_not_say')),
  height_cm NUMERIC(5,2),
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### 2. `user_weight_history` (Para tracking futuro)
```sql
CREATE TABLE user_weight_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  weight_kg NUMERIC(5,2) NOT NULL,
  recorded_at TIMESTAMPTZ DEFAULT NOW(),
  notes TEXT
);
```

#### 3. `user_preferences` (Onboarding + Configuración)
```sql
CREATE TABLE user_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,
  
  -- Dieta y restricciones
  diet_type TEXT CHECK (diet_type IN (
    'omnivore', 'vegetarian', 'vegan', 'pescatarian', 
    'keto', 'paleo', 'mediterranean', 'other'
  )) DEFAULT 'omnivore',
  
  allergies TEXT[] DEFAULT '{}',  -- ['gluten', 'lactose', 'nuts', 'shellfish', 'eggs', 'soy']
  disliked_ingredients TEXT[] DEFAULT '{}',
  favorite_cuisines TEXT[] DEFAULT '{}',  -- ['mediterranean', 'asian', 'mexican', 'italian', ...]
  
  -- Objetivos (para IA nutricionista futuro)
  health_goal TEXT CHECK (health_goal IN (
    'lose_weight', 'maintain', 'gain_muscle', 
    'eat_healthier', 'save_money', 'save_time'
  )),
  target_weight_kg NUMERIC(5,2),
  
  -- Preferencias de cocina
  cooking_skill TEXT CHECK (cooking_skill IN ('beginner', 'intermediate', 'advanced')) DEFAULT 'intermediate',
  max_cooking_time_minutes INTEGER DEFAULT 60,
  servings_default INTEGER DEFAULT 2,
  
  -- Presupuesto
  budget_level TEXT CHECK (budget_level IN ('low', 'medium', 'high')) DEFAULT 'medium',
  
  -- Equipamiento disponible
  available_equipment TEXT[] DEFAULT '{}',  -- ['oven', 'air_fryer', 'slow_cooker', 'blender', ...]
  
  -- Tracking nutricional
  daily_calorie_target INTEGER,
  macro_protein_pct INTEGER,  -- Porcentaje objetivo
  macro_carbs_pct INTEGER,
  macro_fat_pct INTEGER,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### 4. `meal_plans` (Planes semanales guardados)
```sql
CREATE TABLE meal_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  
  name TEXT NOT NULL,  -- "Semana del 10 Feb" o nombre custom
  description TEXT,
  
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  
  -- Metadata de generación
  generation_prompt JSONB,  -- Parámetros usados para generar
  
  -- Estado
  is_favorite BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT FALSE,  -- Plan actualmente en uso
  
  -- Nutrición agregada (calculado)
  total_calories INTEGER,
  avg_daily_calories INTEGER,
  
  -- Compartir
  is_shared BOOLEAN DEFAULT FALSE,
  share_code TEXT UNIQUE,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### 5. `meals` (Comidas individuales dentro de un plan)
```sql
CREATE TABLE meals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  meal_plan_id UUID REFERENCES meal_plans(id) ON DELETE CASCADE,
  
  day_number INTEGER NOT NULL CHECK (day_number BETWEEN 1 AND 7),
  meal_type TEXT NOT NULL CHECK (meal_type IN ('breakfast', 'lunch', 'dinner')),
  
  -- Receta asociada
  recipe_id UUID REFERENCES recipes(id) ON DELETE SET NULL,
  
  -- Override de porciones para esta instancia
  servings INTEGER,
  
  -- Orden de display
  sort_order INTEGER DEFAULT 0,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### 6. `recipes` (Recetas generadas por IA)
```sql
CREATE TABLE recipes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Puede ser NULL si la receta es compartida/pública
  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  
  -- Info básica
  name TEXT NOT NULL,
  description TEXT,
  cuisine_type TEXT,
  
  -- Tiempo y dificultad
  prep_time_minutes INTEGER,
  cook_time_minutes INTEGER,
  total_time_minutes INTEGER GENERATED ALWAYS AS (prep_time_minutes + cook_time_minutes) STORED,
  difficulty TEXT CHECK (difficulty IN ('easy', 'medium', 'hard')),
  servings INTEGER DEFAULT 2,
  
  -- Contenido de la receta
  ingredients JSONB NOT NULL,  -- [{name, quantity, unit, notes}]
  instructions JSONB NOT NULL,  -- [{step_number, instruction, time_minutes?, tip?}]
  tips TEXT[],
  
  -- Categorización
  tags TEXT[] DEFAULT '{}',  -- ['quick', 'budget-friendly', 'high-protein', ...]
  diet_types TEXT[] DEFAULT '{}',  -- Compatible con qué dietas
  
  -- Nutrición por porción
  calories INTEGER,
  protein_g NUMERIC(6,2),
  carbs_g NUMERIC(6,2),
  fat_g NUMERIC(6,2),
  fiber_g NUMERIC(6,2),
  
  -- Imagen (URL de storage o generada)
  image_url TEXT,
  
  -- Source tracking
  source TEXT CHECK (source IN ('ai_generated', 'user_created', 'imported')) DEFAULT 'ai_generated',
  ai_model_used TEXT,  -- 'llama-3.1-70b', etc.
  
  -- Estadísticas
  times_used INTEGER DEFAULT 0,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### 7. `meal_reactions` (Likes/Dislikes para entrenar IA)
```sql
CREATE TABLE meal_reactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  recipe_id UUID REFERENCES recipes(id) ON DELETE CASCADE,
  
  reaction TEXT NOT NULL CHECK (reaction IN ('like', 'dislike', 'love')),
  
  -- Feedback adicional opcional
  feedback_text TEXT,
  feedback_tags TEXT[],  -- ['too_spicy', 'took_too_long', 'loved_flavor', ...]
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(user_id, recipe_id)
);
```

#### 8. `shopping_lists` (Listas de compras generadas)
```sql
CREATE TABLE shopping_lists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  meal_plan_id UUID REFERENCES meal_plans(id) ON DELETE SET NULL,
  
  name TEXT NOT NULL,
  
  -- Items consolidados
  items JSONB NOT NULL,  -- [{ingredient, quantity, unit, category, checked, recipe_ids}]
  
  -- Estado
  is_completed BOOLEAN DEFAULT FALSE,
  
  -- Para futuro: integración supermercados
  supermarket_provider TEXT,
  external_order_id TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### 9. `ai_chat_history` (Para nutricionista IA futuro)
```sql
CREATE TABLE ai_chat_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  
  session_id UUID NOT NULL,  -- Agrupa mensajes de una conversación
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  
  -- Metadata
  tokens_used INTEGER,
  model_used TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### 10. `shared_plans` (Para compartir planes)
```sql
CREATE TABLE shared_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  meal_plan_id UUID REFERENCES meal_plans(id) ON DELETE CASCADE,
  shared_by UUID REFERENCES profiles(id) ON DELETE CASCADE,
  shared_with UUID REFERENCES profiles(id) ON DELETE CASCADE,
  
  -- Permisos
  can_edit BOOLEAN DEFAULT FALSE,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(meal_plan_id, shared_with)
);
```

---

## 📝 Inputs para Onboarding

El onboarding capturará estos datos para personalizar la experiencia desde el principio:

### Pantalla 1: Perfil Básico
- Nombre
- Fecha de nacimiento (opcional, para futuras recomendaciones nutricionales)

### Pantalla 2: Tipo de Dieta
- Omnívoro 🍖
- Vegetariano 🥕
- Vegano 🌱
- Pescetariano 🐟
- Keto 🥑
- Paleo 🦴
- Mediterránea 🫒
- Otro

### Pantalla 3: Alergias e Intolerancias
Multi-select de:
- Gluten
- Lactosa
- Frutos secos
- Mariscos
- Huevos
- Soja
- Otro (texto libre)

### Pantalla 4: Objetivos
Single select:
- Perder peso
- Mantener peso
- Ganar masa muscular
- Comer más saludable
- Ahorrar dinero
- Ahorrar tiempo

### Pantalla 5: Habilidad y Tiempo
- Nivel de cocina: Principiante / Intermedio / Avanzado
- Tiempo máximo para cocinar: 15min / 30min / 45min / 60min / Sin límite

### Pantalla 6: Preferencias de Cocina
Multi-select de cocinas favoritas:
- Mediterránea
- Asiática
- Mexicana
- Italiana
- Americana
- India
- Medio Oriente
- Fusion

### Pantalla 7: Para cuántas personas
- Selector numérico (1-8)

---

## 🔌 Edge Functions Necesarias

### 1. `generate-meal-plan`
```typescript
// Input
{
  user_id: string,
  days: number,
  preferences_override?: Partial<UserPreferences>
}

// Output
{
  meal_plan: MealPlan,
  meals: Meal[],
  recipes: Recipe[]
}
```

**Lógica:**
1. Obtener preferencias del usuario de DB
2. Obtener historial de reactions (likes/dislikes)
3. Construir prompt para Groq
4. Generar plan con IA
5. Guardar en DB
6. Retornar resultado

### 2. `generate-single-recipe`
```typescript
// Input
{
  user_id: string,
  meal_type: 'breakfast' | 'lunch' | 'dinner',
  specific_request?: string  // "algo con pollo y arroz"
}

// Output
{
  recipe: Recipe
}
```

### 3. `regenerate-meal`
```typescript
// Input
{
  meal_id: string,
  reason?: string  // "no me gusta el pescado"
}

// Output
{
  new_meal: Meal,
  new_recipe: Recipe
}
```

### 4. `generate-shopping-list`
```typescript
// Input
{
  meal_plan_id: string,
  consolidate: boolean  // Agrupa ingredientes similares
}

// Output
{
  shopping_list: ShoppingList
}
```

### 5. `chat-nutritionist` (Futuro)
```typescript
// Input
{
  user_id: string,
  session_id: string,
  message: string
}

// Output
{
  response: string,
  suggested_actions?: Action[]
}
```

---

## 📱 Estructura de Navegación (Expo Router)

```
app/
├── (auth)/
│   ├── login.tsx
│   ├── register.tsx
│   └── forgot-password.tsx
├── (onboarding)/
│   ├── welcome.tsx
│   ├── diet.tsx
│   ├── allergies.tsx
│   ├── goals.tsx
│   ├── cooking-level.tsx
│   ├── cuisines.tsx
│   └── servings.tsx
├── (tabs)/
│   ├── _layout.tsx
│   ├── index.tsx              # Home - Plan actual
│   ├── generate.tsx           # Generar nuevo plan
│   ├── favorites.tsx          # Recetas y planes favoritos
│   ├── shopping.tsx           # Lista de compras
│   └── profile.tsx            # Perfil y configuración
├── plan/
│   ├── [id].tsx               # Detalle de plan
│   └── share/[code].tsx       # Ver plan compartido
├── recipe/
│   └── [id].tsx               # Detalle de receta
├── nutritionist/              # Futuro
│   └── chat.tsx
└── _layout.tsx
```

---

## 🎨 Componentes Principales

```
components/
├── ui/                        # Componentes base (buttons, inputs, cards)
├── onboarding/
│   ├── ProgressBar.tsx
│   ├── OptionCard.tsx
│   └── MultiSelect.tsx
├── meals/
│   ├── MealCard.tsx
│   ├── DayColumn.tsx
│   ├── WeekView.tsx
│   └── MealTypeHeader.tsx
├── recipes/
│   ├── RecipeCard.tsx
│   ├── RecipeDetail.tsx
│   ├── IngredientList.tsx
│   ├── InstructionStep.tsx
│   └── NutritionBadge.tsx
├── reactions/
│   ├── LikeButton.tsx
│   ├── DislikeButton.tsx
│   └── FeedbackModal.tsx
├── shopping/
│   ├── ShoppingItem.tsx
│   ├── CategorySection.tsx
│   └── ShoppingListView.tsx
├── profile/
│   ├── PreferenceEditor.tsx
│   ├── WeightTracker.tsx
│   └── StatsCard.tsx
└── shared/
    ├── LoadingState.tsx
    ├── ErrorState.tsx
    ├── EmptyState.tsx
    └── AIGeneratingAnimation.tsx
```

---

## 🔐 Row Level Security (RLS) Policies

```sql
-- Profiles: usuarios solo ven su perfil
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Meal Plans: usuarios ven los suyos + compartidos
ALTER TABLE meal_plans ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can CRUD own plans" ON meal_plans
  FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can view shared plans" ON meal_plans
  FOR SELECT USING (
    is_shared = true OR
    id IN (SELECT meal_plan_id FROM shared_plans WHERE shared_with = auth.uid())
  );

-- Recipes: públicas para lectura, solo creador puede editar
ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view recipes" ON recipes
  FOR SELECT USING (true);
CREATE POLICY "Creators can update recipes" ON recipes
  FOR UPDATE USING (auth.uid() = created_by);

-- Similar para otras tablas...
```

---

## 📅 Fases de Desarrollo

### Fase 1: MVP (4-6 semanas)
- [ ] Setup proyecto Expo + Supabase
- [ ] Autenticación (email/password)
- [ ] Onboarding completo
- [ ] Generación de plan semanal con IA
- [ ] Vista de plan semanal
- [ ] Detalle de receta
- [ ] Like/Dislike de comidas
- [ ] Guardar planes como favoritos

### Fase 2: Core Features (3-4 semanas)
- [ ] Regenerar comida individual
- [ ] Lista de compras automática
- [ ] Tracking nutricional básico (calorías)
- [ ] Compartir planes (link)
- [ ] Historial de planes

### Fase 3: Social & Polish (2-3 semanas)
- [ ] Login con Google/Apple
- [ ] Compartir planes con usuarios específicos
- [ ] Notificaciones push (recordatorios de comida)
- [ ] Mejoras de UX/UI

### Fase 4: Nutricionista IA (Futuro)
- [ ] Chat con nutricionista IA
- [ ] Tracking de peso
- [ ] Planes basados en objetivos de peso
- [ ] Análisis de progreso
- [ ] Recomendaciones personalizadas

### Fase 5: Integraciones (Futuro)
- [ ] Integración con supermercados
- [ ] Sincronización con apps de salud
- [ ] Recetas por foto de ingredientes
- [ ] Voz para añadir ingredientes

---

## 💡 Prompts de IA Sugeridos

### Prompt para Generar Plan Semanal
```
Genera un plan de comidas para 7 días con desayuno, almuerzo y cena.

PERFIL DEL USUARIO:
- Dieta: {diet_type}
- Alergias: {allergies}
- Ingredientes que no le gustan: {disliked_ingredients}
- Cocinas favoritas: {favorite_cuisines}
- Nivel de cocina: {cooking_skill}
- Tiempo máximo de cocina: {max_cooking_time} minutos
- Porciones: {servings}
- Objetivo calórico diario: {daily_calorie_target}

RECETAS QUE LE HAN GUSTADO:
{liked_recipes}

RECETAS QUE NO LE HAN GUSTADO:
{disliked_recipes}

REQUISITOS:
1. Variedad de ingredientes a lo largo de la semana
2. Respetar restricciones dietéticas
3. Incluir información nutricional por porción
4. Instrucciones claras y concisas
5. Tiempo de preparación realista

Responde en formato JSON con la siguiente estructura:
{schema}
```

---

## 🔧 Variables de Entorno

```bash
# .env.local (desarrollo)
EXPO_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJxxxxx

# Supabase Edge Functions secrets
GROQ_API_KEY=gsk_xxxxx
```

---

## 📦 Dependencias Principales

```json
{
  "dependencies": {
    "expo": "~50.x",
    "expo-router": "~3.x",
    "react-native": "0.73.x",
    
    "@supabase/supabase-js": "^2.x",
    "expo-secure-store": "~12.x",
    
    "@tanstack/react-query": "^5.x",
    "zustand": "^4.x",
    
    "react-native-reanimated": "~3.x",
    "react-native-gesture-handler": "~2.x",
    
    "expo-haptics": "~12.x",
    "expo-notifications": "~0.27.x"
  }
}
```

---

## ⚠️ Consideraciones Importantes

### Limitaciones del Free Tier de Groq
- Rate limits en la API gratuita
- Implementar caching de recetas generadas
- Considerar regeneración como operación "premium" si es necesario

### Optimizaciones Recomendadas
1. **Caché agresivo**: Guardar todas las recetas generadas para reusar
2. **Batch generation**: Generar el plan completo en una sola llamada
3. **Lazy loading**: Cargar detalles de receta solo cuando se necesiten
4. **Offline first**: Guardar planes localmente con Expo SQLite

### Monetización Futura (Opcional)
- **Free**: 2 planes/mes, recetas básicas
- **Premium**: Ilimitado, nutricionista IA, tracking avanzado, sin anuncios

---

## 📎 Referencias

- [Expo Documentation](https://docs.expo.dev/)
- [Supabase Docs](https://supabase.com/docs)
- [Supabase Edge Functions](https://supabase.com/docs/guides/functions)
- [Groq API](https://console.groq.com/docs/quickstart)
- [React Query](https://tanstack.com/query/latest)

---

*Documento generado el 6 de febrero de 2026*
*Versión: 1.0*
