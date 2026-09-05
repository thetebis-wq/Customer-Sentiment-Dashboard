# 📊 Customer Sentiment & Competitor PMF Teardown Engine

> **Motor de Autopsia de Sentimiento y Product-Market Fit para Consultores y Emprendedores**  
> **Ubicación Canónica del Proyecto:** `C:\Proyectos\customer-sentiment-dashboard`  
> **Framework Madre:** Marketing Strategy AI Solutions (`C:\Proyectos\Marketing Strategy AI Solutions`)  
> **Arquitectura:** Repositorio Satélite Desacoplado ([ADR-007](file:///C:/Proyectos/Marketing%20Strategy%20AI%20Solutions/Main%20Strategy%20Optimization%20Framework/decisions/ADR-007-decoupled-multi-repo-architecture.md))  
> **Gobernanza:** Tier 0 ([AGENTS.md](AGENTS.md) & [CONSTRAINTS.md](CONSTRAINTS.md))

---

## 🎯 Visión General

**Customer Sentiment & Competitor PMF Teardown Engine** transforma lotes desordenados de 50 a 500 reseñas de clientes (propias o de competidores) en un diagnóstico estratégico de Product-Market Fit en menos de 60 segundos. 

Integra visualización de tendencias temporales, nubes semánticas de fricción y deleite, desglose interactivo de citas textuales y un informe ejecutivo generado por Inteligencia Artificial estructurada con Google Gemini.

---

## 🚀 Capacidades Principales

### 1. Ingesta Universal de CSV / TSV / Texto Crudo
- **Drag & Drop Inteligente:** Sube archivos CSV o TSV exportados directamente de Trustpilot, G2, Amazon, Google Reviews o App Store.
- **Detección Automática:** Identificación algorítmica de columnas de texto de reseña y fechas (formatos ISO, DD/MM/YYYY, etc.).

### 2. Ciberseguridad & Privacidad Zero-PII en el Cliente
- **Sanitización Previa al LLM:** Todo el contenido es depurado en el navegador antes de cualquier transmisión a la red.
- **Redacción Criptográfica:** Correos electrónicos, teléfonos, números de tarjeta de crédito y números de identificación personal son transformados automáticamente en tokens seguros como `[EMAIL_PROTECTED]`, `[TEL_PROTECTED]`, etc.

### 3. Modo Dual de Diagnóstico Estratégico
- 🏢 **Modo Auditoría Interna (Self-Audit):** Centrado en corregir el propio producto. Genera el Top 3 de áreas de mejora interna con impacto comercial medible.
- ⚔️ **Modo Competitor Teardown:** Centrado en ganar cuota de mercado. Disecciona a la competencia identificando:
  - **Ángulo de Ataque Comercial (*The Commercial Wedge*):** El punto débil exacto para posicionar tu oferta.
  - **Detonantes de Cancelación (*Switching Triggers*):** Los dolores críticos que hacen que sus clientes busquen alternativas.
  - **Características No Negociables (*Table Stakes*):** Funcionalidades imprescindibles que los clientes esperan.
  - **Ganchos Publicitarios Copiables (*Ad Copy Hooks*):** Textos persuasivos listos para usar en anuncios de adquisición.

### 4. Nube Semántica de Aspectos con Drill-Down
- **Matriz de Fricción vs. Deleite:** Separa automáticamente los aspectos negativos (puntos de fricción) de los positivos (factores de deleite).
- **Citas Verbatim al Clic:** Al hacer clic en cualquier etiqueta, se abre un modal interactivo con las reseñas originales completas y su fecha exacta.

### 5. Exportación Ejecutiva en PDF (Print-Ready)
- Formato limpio optimizado mediante reglas `@media print`.
- Oculta controles de edición y menús para entregar un informe formal y profesional a clientes, comités directivos o inversores con un solo clic en **"Exportar Reporte (PDF)"**.

### 6. Cascada Resiliente de Inferencia
- **Primario:** Modelos Gemini de última generación (`gemini-2.5-flash` / `gemini-2.8-flash`) vía `@google/genai` con salida JSON estructurada garantizada.
- **Fallback Heurístico Local:** Si no se suministra API key o la conexión falla, el motor activa un generador estadístico local ultra-rápido (< 200 ms) sin interrumpir el flujo del usuario.

---

## 🛠️ Stack Tecnológico

- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS v4, Motion (Framer Motion), Lucide Icons, Recharts.
- **Backend:** Node.js, Express, TSX, esbuild.
- **Inteligencia Artificial:** Google GenAI SDK (`@google/genai`).
- **Pruebas Automatizadas:** Vitest (100% pruebas pasando, *Prove-It Pattern*).
- **Gobernanza:** Marco de la agencia Marketing Strategy AI Solutions.

---

## 🔑 Configuración de la API Key de Gemini

Para habilitar el análisis cognitivo con modelos Gemini, necesitas una clave gratuita de Google AI Studio:

1. Visita [Google AI Studio](https://aistudio.google.com/app/apikey) e inicia sesión con tu cuenta de Google.
2. Haz clic en el botón azul **"Create API key"** (o *"Obtener clave de API"*).
3. Selecciona tu proyecto de Google Cloud o crea uno nuevo de cortesía.
4. Copia la clave generada (`AIzaSy...`).
5. En la raíz de este proyecto (`C:\Proyectos\customer-sentiment-dashboard`), crea un archivo llamado `.env` copiando la plantilla `.env.example`:
   ```bash
   cp .env.example .env
   ```
6. Abre `.env` y pega tu clave:
   ```env
   GEMINI_API_KEY="AIzaSyTuClaveAqui..."
   ```

> [!NOTE]
> Si no configuras `GEMINI_API_KEY`, el dashboard funcionará normalmente utilizando el motor heurístico local offline de contingencia.

---

## 💻 Guía de Inicio Rápido

### 1. Instalación de Dependencias
```bash
# Desde la carpeta C:\Proyectos\customer-sentiment-dashboard
npm install
```

### 2. Iniciar el Servidor de Desarrollo
```bash
npm run dev
```
Abre tu navegador en [http://localhost:3000](http://localhost:3000). El servidor iniciará concurrentemente el backend de Express y el frontend de Vite.

### 3. Ejecutar la Suite de Pruebas (*Prove-It*)
```bash
npm run test
```

### 4. Auditoría de Tipos TypeScript
```bash
npm run lint
```

### 5. Compilación y Ejecución en Producción
```bash
# Genera el bundle optimizado en dist/
npm run build

# Inicia el servidor compilado de producción
npm start
```

---

## 📁 Estructura del Repositorio

```
C:\Proyectos\customer-sentiment-dashboard\
├── AGENTS.md                          # Reglas de disciplina técnica para agentes IA
├── CONSTRAINTS.md                     # Umbrales numéricos de calidad
├── README.md                          # Este manual
├── .env.example                       # Plantilla de variables de entorno
├── docs/
│   └── ideas/
│       └── customer-sentiment-teardown.md # Ficha de especificación funcional (/spec)
├── src/
│   ├── components/
│   │   ├── Header.tsx                 # Barra superior y botón de exportación PDF
│   │   ├── ReviewInputSection.tsx     # Ingesta CSV drag & drop, texto y selector de modo
│   │   ├── MetricsOverview.tsx        # KPIs (NPS estimado, % Positivo/Negativo)
│   │   ├── SentimentTrendChart.tsx    # Gráfico de tendencia temporal con Recharts
│   │   ├── WordCloud.tsx              # Nube semántica (Friction vs. Delight)
│   │   ├── WordDetailModal.tsx        # Modal con citas textuales y fechas
│   │   ├── ExecutiveSummarySection.tsx# Resumen ejecutivo, Wedge y ganchos de copia
│   │   ├── ReviewFeed.tsx             # Explorador paginado de reseñas analizadas
│   │   └── ChatAssistant.tsx          # Asistente conversacional contextual
│   ├── data/
│   │   └── sampleReviews.ts           # Datasets de prueba (SaaS, eCommerce, Fintech)
│   ├── server/
│   │   └── heuristicGenerator.ts      # Motor heurístico local offline (< 500 líneas)
│   ├── utils/
│   │   ├── zeroPiiSanitizer.ts        # Sanitizador de privacidad Zero-PII en cliente
│   │   ├── zeroPiiSanitizer.test.ts   # Pruebas unitarias del sanitizador
│   │   ├── csvParser.ts               # Parser inteligente de CSV/TSV con fechas
│   │   └── csvParser.test.ts          # Pruebas unitarias del parser
│   ├── types.ts                       # Modelos de datos TypeScript y tipos de análisis
│   ├── App.tsx                        # Componente raíz
│   └── index.css                      # Tailwind CSS v4 y reglas @media print
├── server.ts                          # Endpoints Express (/api/analyze-sentiment)
├── package.json                       # Scripts y dependencias
├── tsconfig.json                      # Configuración de compilación TS
├── vite.config.ts                     # Configuración de Vite
└── vitest.config.ts                   # Configuración de Vitest
```

---

## 🏛️ Gobernanza y Estándares de la Agencia

Este repositorio se adhiere a los estándares de ingeniería de **Marketing Strategy AI Solutions**:
- **Prove-It Pattern:** Ningún cambio se aprueba sin pruebas unitarias automatizadas que lo respalden.
- **Regla de 500 Líneas:** Ningún archivo de código supera las 500 líneas; los monolitos se descomponen en submódulos especializados.
- **Privacidad por Diseño (Zero-PII):** Cumplimiento preventivo con normativas de privacidad (LFPDPPP, RGPD).
- **Mobile-First Real:** Interfaces diseñadas para pantallas táctiles con objetivos de pulsación iguales o superiores a 48px.
