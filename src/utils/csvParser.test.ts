import { describe, it, expect } from 'vitest';
import { parseReviewCsv, tokenizeCsv } from './csvParser';

describe('CSV Parser Suite (Prove-It Pattern)', () => {
  it('should correctly tokenize comma-delimited rows with quotes containing commas', () => {
    const csv = `Date,Rating,Review\n2026-08-01,5,"Great product, fast and clean!"\n2026-08-02,1,"Broken, useless interface."`;
    const tokens = tokenizeCsv(csv);
    expect(tokens.length).toBe(3);
    expect(tokens[1][2]).toBe('Great product, fast and clean!');
  });

  it('should auto-detect Text and Date columns in standard Trustpilot/G2 format', () => {
    const csv = `Review ID,Submitted Date,Review Title,Review Body,Star Rating
101,2026-07-15,Smooth Setup,Onboarding was lightning fast and support helped within 2 minutes.,5
102,2026-07-20,Terrible billing,Hidden fees upon renewal and no response from accounts team.,1`;

    const result = parseReviewCsv(csv);
    expect(result.success).toBe(true);
    expect(result.totalRows).toBe(2);
    expect(result.detectedTextColumn).toBe('Review Body');
    expect(result.detectedDateColumn).toBe('Submitted Date');
    expect(result.detectedRatingColumn).toBe('Star Rating');
    expect(result.rows[0].text).toContain('Onboarding was lightning fast');
    expect(result.rows[0].date).toBe('2026-07-15');
    expect(result.rows[0].rating).toBe(5);
    expect(result.formattedPayload).toContain('[2026-07-15] (5/5 stars) Onboarding was lightning fast');
  });

  it('should handle semicolon-delimited CSVs commonly exported in European Excel', () => {
    const csv = `Fecha;Calificacion;Comentario\n2026-06-01;4;Excelente servicio al cliente\n2026-06-05;2;La app se traba en movil`;
    const result = parseReviewCsv(csv);
    expect(result.success).toBe(true);
    expect(result.totalRows).toBe(2);
    expect(result.detectedTextColumn).toBe('Comentario');
    expect(result.detectedDateColumn).toBe('Fecha');
    expect(result.detectedRatingColumn).toBe('Calificacion');
  });

  it('should auto-detect text column by length when headers are generic', () => {
    const csv = `ColA,ColB,ColC\nID-1,2026-05-10,This is a comprehensive review detailing the latency issues and API throttle limits.\nID-2,2026-05-11,Another feedback item explaining how much the team loves the new Slack integration.`;
    const result = parseReviewCsv(csv);
    expect(result.success).toBe(true);
    expect(result.detectedTextColumn).toBe('ColC');
  });

  it('should fail gracefully on invalid or single-line CSV', () => {
    const csv = `OnlyHeadersWithoutData`;
    const result = parseReviewCsv(csv);
    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();
  });
});
