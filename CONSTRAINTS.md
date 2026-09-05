# CONSTRAINTS.md — Quality Gates & Technical Thresholds

> **Proyecto:** Customer Sentiment & Competitor PMF Teardown Engine  
> **Ubicación Canónica:** `C:\Proyectos\customer-sentiment-dashboard`  
> **Framework Madre:** Marketing Strategy AI Solutions  
> **Prevalecencia:** Tier 0 (Contrato Vinculante de Calidad e Inmutabilidad Técnica)

---

## 📊 1. MATRIZ DE UMBRALES NUMÉRICOS INMUTABLES

| Dimensión | Métrica | Umbral Mínimo | Umbral Crítico (Fallo Inmediato) | Comando de Verificación |
| :--- | :--- | :--- | :--- | :--- |
| **Pruebas Automatizadas** | Tasa de Aprobación (*Pass Rate*) | **100%** | < 100% o pruebas omitidas (`.skip`) | `npm run test` |
| **Integridad de Tipos** | Errores TypeScript (`tsc --noEmit`) | **0 errores** | > 0 errores o `@ts-ignore` nuevos | `npm run lint` |
| **Compilación Producción** | Fallos de build (`vite` + `esbuild`) | **0 errores** | Exit code != 0 | `npm run build` |
| **Modularidad de Código** | Líneas máximas por archivo | **<= 500 líneas** | > 500 líneas en cualquier `.ts`/`.tsx` | Inspección de archivos |
| **Accesibilidad Táctil** | Tamaño de Tap Targets | **>= 48px** | < 44px en elementos interactivos | CSS (`min-h-[48px]`) |
| **Sanitización Zero-PII** | Detección de correos / teléfonos / tarjetas | **100%** | Filtración de PII a endpoints LLM | `src/utils/zeroPiiSanitizer.test.ts` |
| **Rendimiento Latencia** | Tiempo de inferencia (fallback local) | **< 250ms** | > 500ms en modo heurístico | Servidor Express |

---

## 🚫 2. ANTI-PATRONES PROHIBIDOS

1. **Silenciamiento de Pruebas:** Queda estrictamente prohibido usar `test.skip()`, comentar asserts o eliminar pruebas existentes para conseguir pasar el build.
2. **Supresiones TypeScript:** Prohibido el uso de `@ts-ignore` o `any` arbitrario sin tipado explícito.
3. **Credenciales en Repositorio:** El archivo `.env` está expresamente excluido de Git por `.gitignore`. Ninguna `GEMINI_API_KEY` o token puede ser hardcodeado en el código fuente.
4. **Monolitos sin Modularizar:** Archivos con más de 500 líneas deben ser particionados inmediatamente en submódulos lógicos (`src/server/`, `src/utils/`, `src/components/`).
