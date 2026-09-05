/**
 * Universal CSV / TSV Review Parser
 * 
 * Auto-detects delimiters (comma, semicolon, tab), handles quotes with embedded delimiters,
 * auto-detects Text, Date, and Rating columns from platforms like Trustpilot, G2, Amazon, App Store,
 * and converts to normalized review structures.
 */

export interface ParsedReviewRow {
  text: string;
  date?: string;
  rating?: number;
  originalRow: Record<string, string>;
}

export interface CsvParseResult {
  success: boolean;
  totalRows: number;
  columns: string[];
  detectedTextColumn: string;
  detectedDateColumn?: string;
  detectedRatingColumn?: string;
  rows: ParsedReviewRow[];
  formattedPayload: string;
  previewRows: Array<Record<string, string>>;
  error?: string;
}

// Low-level CSV line tokenizer that respects quotes and multiline quoted strings
export function tokenizeCsv(csvContent: string, delimiter?: string): string[][] {
  if (!csvContent || !csvContent.trim()) return [];

  // Determine delimiter if not specified
  if (!delimiter) {
    const firstFewLines = csvContent.slice(0, 1000).split('\n')[0] || '';
    const commas = (firstFewLines.match(/,/g) || []).length;
    const semicolons = (firstFewLines.match(/;/g) || []).length;
    const tabs = (firstFewLines.match(/\t/g) || []).length;

    if (tabs > commas && tabs > semicolons) delimiter = '\t';
    else if (semicolons > commas) delimiter = ';';
    else delimiter = ',';
  }

  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentCell = '';
  let inQuotes = false;

  for (let i = 0; i < csvContent.length; i++) {
    const char = csvContent[i];
    const nextChar = csvContent[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        // Escaped quote: ""
        currentCell += '"';
        i++;
      } else {
        // Toggle quote state
        inQuotes = !inQuotes;
      }
    } else if (char === delimiter && !inQuotes) {
      currentRow.push(currentCell.trim());
      currentCell = '';
    } else if ((char === '\r' || char === '\n') && !inQuotes) {
      if (char === '\r' && nextChar === '\n') {
        i++; // skip \n in CRLF
      }
      currentRow.push(currentCell.trim());
      currentCell = '';
      if (currentRow.some((c) => c.length > 0)) {
        rows.push(currentRow);
      }
      currentRow = [];
    } else {
      currentCell += char;
    }
  }

  // Push final cell/row if any
  if (currentCell.length > 0 || currentRow.length > 0) {
    currentRow.push(currentCell.trim());
    if (currentRow.some((c) => c.length > 0)) {
      rows.push(currentRow);
    }
  }

  return rows;
}

export function parseReviewCsv(csvContent: string): CsvParseResult {
  try {
    const matrix = tokenizeCsv(csvContent);
    if (matrix.length < 2) {
      return {
        success: false,
        totalRows: 0,
        columns: [],
        detectedTextColumn: '',
        rows: [],
        formattedPayload: '',
        previewRows: [],
        error: 'El archivo CSV debe contener al menos una fila de encabezados y una de datos.',
      };
    }

    const headers = matrix[0].map((h) => h.replace(/^["']|["']$/g, '').trim());
    const dataRows = matrix.slice(1);

    // Auto-detect columns
    const normalizedHeaders = headers.map((h) => h.toLowerCase());

    // 1. Text Column Candidate
    // Exclude headers that represent IDs, numbers, ratings, or dates
    const isExcludedFromText = (h: string) =>
      /\b(id|number|num|date|rating|score|stars|email|phone|url|link)\b/i.test(h);

    const highPriorityKeywords = [
      'review body', 'review text', 'review_body', 'review_text', 'review_content',
      'body', 'comment', 'comentario', 'text', 'content', 'feedback', 'opinion', 'reseña', 'description'
    ];
    let textColIdx = normalizedHeaders.findIndex(
      (h) => !isExcludedFromText(h) && highPriorityKeywords.some((kw) => h.includes(kw))
    );

    // Fallback: look for 'review' if not excluded
    if (textColIdx === -1) {
      textColIdx = normalizedHeaders.findIndex(
        (h) => !isExcludedFromText(h) && h.includes('review')
      );
    }

    // If not found by keyword, find column with highest average character length
    if (textColIdx === -1) {
      let maxAvgLen = 0;
      for (let col = 0; col < headers.length; col++) {
        const avgLen =
          dataRows.reduce((acc, row) => acc + (row[col]?.length || 0), 0) /
          Math.max(1, dataRows.length);
        if (avgLen > maxAvgLen) {
          maxAvgLen = avgLen;
          textColIdx = col;
        }
      }
    }

    if (textColIdx === -1) {
      textColIdx = 0;
    }

    // 2. Date Column Candidate
    const dateKeywords = [
      'date', 'created_at', 'timestamp', 'time', 'fecha', 'submitted_at', 
      'posted', 'published'
    ];
    const dateColIdx = normalizedHeaders.findIndex((h) =>
      dateKeywords.some((kw) => h.includes(kw))
    );

    // 3. Rating Column Candidate
    const ratingKeywords = [
      'rating', 'score', 'stars', 'calificacion', 'puntuacion', 'stars_rating'
    ];
    const ratingColIdx = normalizedHeaders.findIndex((h) =>
      ratingKeywords.some((kw) => h.includes(kw))
    );

    const parsedRows: ParsedReviewRow[] = [];
    const previewRows: Array<Record<string, string>> = [];
    const formattedPayloadLines: string[] = [];

    dataRows.forEach((row, idx) => {
      const rowObj: Record<string, string> = {};
      headers.forEach((h, hIdx) => {
        rowObj[h] = row[hIdx] || '';
      });

      if (idx < 5) {
        previewRows.push(rowObj);
      }

      const reviewText = row[textColIdx]?.trim() || '';
      if (!reviewText) return; // Skip empty review rows

      const dateVal = dateColIdx !== -1 ? row[dateColIdx]?.trim() : undefined;
      const ratingRaw = ratingColIdx !== -1 ? Number(row[ratingColIdx]) : undefined;
      const ratingVal = !isNaN(ratingRaw as number) ? ratingRaw : undefined;

      parsedRows.push({
        text: reviewText,
        date: dateVal,
        rating: ratingVal,
        originalRow: rowObj,
      });

      // Format line for LLM ingestion
      let formattedLine = '';
      if (dateVal) {
        formattedLine += `[${dateVal}] `;
      }
      if (ratingVal) {
        formattedLine += `(${ratingVal}/5 stars) `;
      }
      formattedLine += reviewText;
      formattedPayloadLines.push(formattedLine);
    });

    return {
      success: true,
      totalRows: parsedRows.length,
      columns: headers,
      detectedTextColumn: headers[textColIdx] || 'Columna 1',
      detectedDateColumn: dateColIdx !== -1 ? headers[dateColIdx] : undefined,
      detectedRatingColumn: ratingColIdx !== -1 ? headers[ratingColIdx] : undefined,
      rows: parsedRows,
      formattedPayload: formattedPayloadLines.join('\n'),
      previewRows,
    };
  } catch (err: any) {
    return {
      success: false,
      totalRows: 0,
      columns: [],
      detectedTextColumn: '',
      rows: [],
      formattedPayload: '',
      previewRows: [],
      error: `Error al procesar el archivo CSV: ${err?.message || err}`,
    };
  }
}
