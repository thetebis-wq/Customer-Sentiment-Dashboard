/**
 * Zero-PII Sanitizer Utility
 * 
 * Complies with Agency Tier 0 Governance (CONSTRAINTS.md & AGENTS.md):
 * Sanitizes customer reviews on the client side before dispatching payloads
 * to LLMs, ensuring compliance with GDPR, CCPA, and LFPDPPP.
 */

export interface SanitizationResult {
  sanitizedText: string;
  scrubbedCount: number;
  details: {
    emails: number;
    phones: number;
    creditCards: number;
    signatures: number;
  };
}

export function sanitizeReviewsPii(rawText: string): SanitizationResult {
  if (!rawText || typeof rawText !== 'string') {
    return {
      sanitizedText: '',
      scrubbedCount: 0,
      details: { emails: 0, phones: 0, creditCards: 0, signatures: 0 },
    };
  }

  let text = rawText;
  let emails = 0;
  let phones = 0;
  let creditCards = 0;
  let signatures = 0;

  // 1. Sanitize Email Addresses
  const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g;
  text = text.replace(emailRegex, () => {
    emails++;
    return '[EMAIL_REDACTED]';
  });

  // 2. Sanitize Credit Card / Account Numbers (13 to 19 digits, optionally spaced or hyphenated)
  const ccRegex = /\b(?:\d[ -]*?){13,19}\b/g;
  text = text.replace(ccRegex, (match) => {
    // Only treat as card if it has at least 13 digits and looks like payment/account
    const digitsOnly = match.replace(/\D/g, '');
    if (digitsOnly.length >= 13 && digitsOnly.length <= 19) {
      creditCards++;
      return '[CARD_REDACTED]';
    }
    return match;
  });

  // 3. Sanitize Phone Numbers (International and local formats)
  // Matches e.g.: +1-555-123-4567, (555) 123-4567, +52 55 1234 5678, 555-123-4567
  const phoneRegex = /(?:\+?\d{1,3}[-.\s]?)?(?:\(?\d{2,4}\)?[-.\s]?)?\d{3,4}[-.\s]?\d{4}\b/g;
  text = text.replace(phoneRegex, (match) => {
    // Check if it has between 7 and 15 digits
    const digitsOnly = match.replace(/\D/g, '');
    if (digitsOnly.length >= 7 && digitsOnly.length <= 15) {
      phones++;
      return '[PHONE_REDACTED]';
    }
    return match;
  });

  // 4. Sanitize Specific Signatures / Identifiers (e.g. "Signed by: John Doe", "Customer: Alex Smith")
  const signatureRegex = /\b(Signed by|Customer|Reviewer|User|Author|Client):\s*([A-Z][a-z]+(?:\s+[A-Z][a-z]+){1,2})\b/gi;
  text = text.replace(signatureRegex, (match, prefix) => {
    signatures++;
    return `${prefix}: [NAME_REDACTED]`;
  });

  const scrubbedCount = emails + phones + creditCards + signatures;

  return {
    sanitizedText: text,
    scrubbedCount,
    details: {
      emails,
      phones,
      creditCards,
      signatures,
    },
  };
}
