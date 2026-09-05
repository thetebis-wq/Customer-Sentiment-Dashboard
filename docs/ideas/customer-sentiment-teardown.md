# Customer Sentiment & Competitor PMF Teardown Engine

> **Proyecto:** Customer Sentiment Dashboard  
> **Framework Madre:** Marketing Strategy AI Solutions  
> **Gobernanza:** Tier 0 ([AGENTS.md](file:///C:/Proyectos/Marketing%20Strategy%20AI%20Solutions/AGENTS.md) & [CONSTRAINTS.md](file:///C:/Proyectos/Marketing%20Strategy%20AI%20Solutions/CONSTRAINTS.md))  
> **Fase del Ciclo de Vida:** Etapa 1: DEFINE (`/spec`) — Cierre de Ideación

---

## 🎯 Problem Statement
¿Cómo podríamos transformar lotes desordenados de 50 a 500 reseñas de competidores o productos en una autopsia visual de Product-Market Fit que revele oportunidades comerciales desatendidas, picos de fricción y un informe ejecutivo listo para clientes o inversores en menos de 60 segundos?

---

## 🧭 Recommended Direction: Dirección A ("The Competitor & PMF Teardown Engine")
Aprovechar como cimiento arquitectónico el repositorio base verificado [`thetebis-wq/Customer-Sentiment-Dashboard`](https://github.com/thetebis-wq/Customer-Sentiment-Dashboard) (React 19, TypeScript, Vite, Tailwind CSS v4, Recharts, Express y Google GenAI SDK con cascada resiliente) e incorporar quirúrgicamente las capacidades de alto valor requeridas para consultores y solopreneurs:

1. **Ingesta Flexible y Autónoma (CSV / Excel / Texto con Fechas):**
   - Soporte drag-and-drop para archivos `.csv` exportados de plataformas líderes (Trustpilot, G2, Amazon, App Store).
   - Mapeo y autodetección de columnas clave: fecha de reseña y contenido textual.
   - Sanitización Zero-PII en el cliente antes del envío al LLM.

2. **Modo Dual de Diagnóstico (Self-Audit vs. Competitor Teardown):**
   - Switch selector en la interfaz para alternar la lente estratégica del análisis de Gemini:
     - **Auditoría Interna:** "¿Cómo corregimos nuestro producto?" (Top 3 áreas de mejora interna).
     - **Competitor Teardown:** "¿Cómo conquistamos a sus clientes insatisfechos?" (El 'Wedge' o ángulo de ataque, los detonantes de cancelación y las características no negociables / table stakes).

3. **Exportación Ejecutiva a PDF / Slide-Ready:**
   - Hoja de estilos de impresión profesional (`@media print`) y botón de un clic para exportar un informe ejecutivo maquetado impecablemente (sin menús, con formato de reporte formal para clientes, inversores o directiva).

4. **Nube Semántica de Aspectos con Drill-Down a Citas Textuales:**
   - Preservar y potenciar la matriz de frases clave (Friction Drivers en rojo vs. Delight Drivers en verde) que al hacer clic abren el modal interactivo con citas textuales y fechas exactas.

---

## 🧪 Key Assumptions to Validate
- [ ] **Estructura de fechas en CSVs:** Los usuarios pueden cargar CSVs con fechas en formatos variados (ISO, DD/MM/YYYY, etc.). Se debe implementar un parser de fechas robusto y tolerante a fallos.
- [ ] **Consumo de tokens en Gemini:** Lotes de hasta 500 reseñas se procesan en una sola llamada estructurada utilizando `gemini-3.5-flash` o `gemini-3.8-flash` con latencia inferior a 15 segundos.
- [ ] **Claridad del Modo Competidor:** El prompt del modo Teardown genera recomendaciones de ataque comercial tangibles y diferenciadas de un reporte de soporte estándar.

---

## 📦 MVP Scope (Rebanadas Delgadas de Desarrollo)
- **Slice 1 (Zero-PII CSV Ingestion):** Componente de carga de archivos CSV con parser local en el navegador, previsualización de filas, mapeo de columna de fecha + texto y eliminación de correos/nombres de usuario antes del envío.
- **Slice 2 (Strategic Prompt Evolution & Dual Mode):** Actualización de `server.ts` con selector `analysisMode: 'self_audit' | 'competitor_teardown'`, enriqueciendo el schema de salida estructurada con el "Ángulo de Ataque Comercial" y "Detonantes de Cancelación".
- **Slice 3 (Executive Print-to-PDF Deliverable):** Optimización visual con media print limpia, tipografía ejecutiva y botón "Exportar Reporte Ejecutivo (PDF)".
- **Slice 4 (Test Suite / Prove-It):** Pruebas unitarias automatizadas con Vitest para el parser CSV, sanitizador Zero-PII y validación de tipos del schema.

---

## 🚫 Not Doing (and Why)
- **Scrapers automáticos en vivo (G2/Amazon/Trustpilot):** Evitar fragilidad de proxies, bloqueos por Cloudflare y complejidad de mantenimiento. El usuario suministra el archivo o texto.
- **Bases de datos persistentes / Autenticación de usuarios:** Mantener la experiencia Zero-Friction y costo de infraestructura $0 (privacidad por diseño: los datos no se guardan en el servidor).
- **Nubes de palabras de frecuencia cruda:** No usar bolsas de palabras sin sentido semántico (ej. "el", "muy", "app"). Se utilizan clusters semánticos contextualizados (Friction vs. Delight).
- **Procesamiento de más de 1,000 reseñas por lote en v1:** Acotado estrictamente a lotes de 50 a 500 reseñas para garantizar respuesta instantánea y no requerir colas de procesamiento en background.

---

## ❓ Open Questions
1. ¿Deseas que el parser de CSV admita preconfiguraciones directas de columnas para plataformas específicas (ej. plantilla Trustpilot o plantilla G2)?
2. ¿Confirmas que procedamos a la **Etapa 2: PLAN (`/plan`)** para generar el plan de implementación técnico atómico?
