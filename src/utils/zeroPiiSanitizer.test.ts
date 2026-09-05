import { describe, it, expect } from 'vitest';
import { sanitizeReviewsPii } from './zeroPiiSanitizer';

describe('Zero-PII Sanitizer Suite (Prove-It Pattern)', () => {
  it('should return empty string and 0 scrubbed count for empty input', () => {
    const res = sanitizeReviewsPii('');
    expect(res.sanitizedText).toBe('');
    expect(res.scrubbedCount).toBe(0);
  });

  it('should scrub email addresses correctly', () => {
    const raw = 'Please contact me at customer.service@example.com or direct to ceo@startup.io for a refund!';
    const res = sanitizeReviewsPii(raw);
    expect(res.sanitizedText).toContain('[EMAIL_REDACTED]');
    expect(res.sanitizedText).not.toContain('customer.service@example.com');
    expect(res.sanitizedText).not.toContain('ceo@startup.io');
    expect(res.scrubbedCount).toBe(2);
    expect(res.details.emails).toBe(2);
  });

  it('should scrub phone numbers in multiple international formats', () => {
    const raw = 'Call our support at +1 555-123-4567 or local (555) 987-6543 immediately.';
    const res = sanitizeReviewsPii(raw);
    expect(res.sanitizedText).toContain('[PHONE_REDACTED]');
    expect(res.sanitizedText).not.toContain('555-123-4567');
    expect(res.sanitizedText).not.toContain('987-6543');
    expect(res.scrubbedCount).toBeGreaterThanOrEqual(2);
    expect(res.details.phones).toBeGreaterThanOrEqual(2);
  });

  it('should scrub reviewer identities with signature prefixes', () => {
    const raw = 'Terrible onboarding experience. Signed by: Alexander Hamilton and Customer: Jane Doe.';
    const res = sanitizeReviewsPii(raw);
    expect(res.sanitizedText).toContain('[NAME_REDACTED]');
    expect(res.sanitizedText).not.toContain('Alexander Hamilton');
    expect(res.sanitizedText).not.toContain('Jane Doe');
    expect(res.details.signatures).toBe(2);
  });

  it('should scrub sensitive payment card numbers', () => {
    const raw = 'I was double charged on card 4111 2222 3333 4444 for the enterprise plan.';
    const res = sanitizeReviewsPii(raw);
    expect(res.sanitizedText).toContain('[CARD_REDACTED]');
    expect(res.sanitizedText).not.toContain('4111 2222 3333 4444');
    expect(res.details.creditCards).toBe(1);
  });

  it('should preserve standard review feedback that does not contain PII', () => {
    const raw = 'The UI is blazing fast and the Slack integration saves our engineering team hours each week.';
    const res = sanitizeReviewsPii(raw);
    expect(res.sanitizedText).toBe(raw);
    expect(res.scrubbedCount).toBe(0);
  });
});
