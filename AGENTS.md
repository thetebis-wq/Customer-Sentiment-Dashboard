# AGENTS.md — Engineering Standards & Governance (Customer Sentiment Dashboard)

> **Repositorio:** Customer Sentiment & Competitor PMF Teardown Engine  
> **Ubicación Canónica:** `C:\Proyectos\customer-sentiment-dashboard`  
> **Framework Madre:** Marketing Strategy AI Solutions (`C:\Proyectos\Marketing Strategy AI Solutions`)  
> **Arquitectura:** Repositorio Satélite Desacoplado ([ADR-007](file:///C:/Proyectos/Marketing%20Strategy%20AI%20Solutions/Main%20Strategy%20Optimization%20Framework/decisions/ADR-007-decoupled-multi-repo-architecture.md))  
> **Prevalecencia:** Tier 0 (Máxima autoridad de gobernanza técnica y procedimental).

---

## 🏛️ 1. GOBERNANZA TIER 0 Y PRINCIPIOS INMUTABLES

Todo agente de IA (Google Antigravity, Gemini CLI, Claude Code) o desarrollador humano que opere en este repositorio DEBE respetar obligatoriamente las siguientes reglas:

### 🟢 1. Ciclo de Vida de 6 Etapas
1. **`/spec` (DEFINE):** Especificación atómica del requerimiento en `docs/ideas/` antes de codificar.
2. **`/plan` (PLAN):** Desglose estructurado de cambios con plan de verificación y mitigación de riesgos.
3. **`/build` (BUILD):** Implementación modular, código limpio y mantenible (< 500 líneas por archivo).
4. **`/test` (VERIFY):** *Prove-It Pattern* — 100% pruebas pasando en Vitest (`npm run test`) antes de dar por completado.
5. **`/review` (REVIEW):** Auditoría de tipos estricta (`npm run lint`), cero advertencias de compilación (`npm run build`).
6. **`/ship` (SHIP):** Documentación actualizada (`README.md`, `walkthrough.md`) y commits atómicos con formato convencional.

### 🔒 2. Ciberseguridad & Privacidad Zero-PII
- **Sanitización Obligatoria en el Cliente:** Todo texto o archivo CSV cargado por el usuario debe pasar por el módulo de sanitización ([`zeroPiiSanitizer.ts`](src/utils/zeroPiiSanitizer.ts)) antes de enviarse a la API de Gemini.
- **Patrones Sanitizados:** Correos electrónicos, teléfonos internacionales y locales, números de tarjetas de crédito e identificadores personales (RFC/CURP/DNI/SSN).
- **Aislamiento Categórico de Credenciales:** `GEMINI_API_KEY` nunca debe quemarse en el código ni cometerse al control de versiones Git. Se lee estrictamente desde variables de entorno (`process.env.GEMINI_API_KEY`).

### 📏 3. Límite Modular de 500 Líneas por Archivo
- Ningún archivo de código fuente (`.ts`, `.tsx`) puede exceder las 500 líneas de código.
- Si un componente o módulo crece más allá de este umbral, DEBE refactorizarse extrayendo submódulos (ejemplo canónico: extracción de `src/server/heuristicGenerator.ts` desde `server.ts`).

### 📱 4. Mobile-First y Accesibilidad (a11y)
- Elementos interactivos (botones, selectores, pestañas) con tamaño de impacto táctil mínimo de 48px (`min-h-[48px]`, `min-w-[48px]`).
- Contraste WCAG AA, compatibilidad con lectores de pantalla y soporte `@media print` para exportación de reportes ejecutivos en PDF.

---

## 🧪 2. PROTOCOLO DE VERIFICACIÓN AUTOMATIZADA (*PROVE-IT*)

Antes de declarar cualquier tarea terminada, el agente debe ejecutar y validar los siguientes comandos:

```bash
# 1. Pruebas unitarias de regresión (Vitest)
npm run test

# 2. Comprobación estricta de tipos TypeScript (tsc --noEmit)
npm run lint

# 3. Compilación de producción (Vite + esbuild)
npm run build
```

**Regla de Tolerancia Cero:** Si una prueba falla o hay un error de TypeScript, el cambio NO puede ser entregado.

---

## 📂 3. ESTRUCTURA DEL PROYECTO

```
C:\Proyectos\customer-sentiment-dashboard\
├── AGENTS.md                  # Este documento de gobernanza
├── CONSTRAINTS.md             # Umbrales numéricos de calidad
├── README.md                  # Manual del proyecto y guía de inicio rápido
├── .env.example               # Plantilla de variables de entorno
├── docs/                      # Especificaciones de producto y negocio
│   └── ideas/                 # Fichas de especificación funcional (/spec)
├── src/
│   ├── components/            # Componentes React interactivos (<= 500 líneas)
│   ├── data/                  # Conjuntos de reseñas de muestra (SaaS, E-comm, etc.)
│   ├── server/                # Módulos del servidor (generador heurístico fallback)
│   ├── utils/                 # Sanitizador Zero-PII, parser CSV y pruebas unitarias
│   ├── types.ts               # Definiciones de tipos TypeScript
│   ├── App.tsx                # Orquestador visual de la aplicación
│   └── index.css              # Estilos Tailwind CSS v4 y reglas @media print
├── server.ts                  # Servidor Express, endpoints API y cliente Google GenAI
├── package.json               # Dependencias y scripts de ejecución
├── tsconfig.json              # Configuración TypeScript estricta
├── vite.config.ts             # Configuración Vite
└── vitest.config.ts           # Configuración de pruebas unitarias Vitest
```
