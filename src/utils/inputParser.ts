/**
 * Enhanced Input Parser
 * Extracts numbers from natural language input
 * 
 * Examples:
 * - "I almost save $20 per month" → 20
 * - "around 50000" → 50000
 * - "maybe 100 dollars" → 100
 * - "I think it's about 30" → 30
 */

/**
 * Extract numeric value from natural language input
 * Handles various formats and common phrases
 */
export function extractNumber(input: string): number | null {
  if (!input || typeof input !== 'string') {
    return null;
  }

  // Remove common words/phrases that might confuse parsing
  const cleaned = input
    .toLowerCase()
    .replace(/almost|around|about|maybe|probably|approximately|roughly|close to|near/gi, '')
    .replace(/i (think|believe|guess|estimate|save|invest|have)/gi, '')
    .replace(/per (month|year|annum)/gi, '')
    .replace(/dollars?|usd|\$/gi, '')
    .trim();

  // Try to find numbers in various formats
  // CRITICAL: Check K/M/B suffixes FIRST to avoid "150K" being parsed as just "150"
  // Pattern 1: Number with K/M/B suffixes (e.g., "50k", "1.5m", "150K")
  const suffixMatch = cleaned.match(/(\d+\.?\d*)\s*([kmb])/i);
  if (suffixMatch) {
    const num = parseFloat(suffixMatch[1]);
    const suffix = suffixMatch[2].toLowerCase();
    if (!isNaN(num)) {
      if (suffix === 'k') return num * 1000;
      if (suffix === 'm') return num * 1000000;
      if (suffix === 'b') return num * 1000000000;
    }
  }

  // Pattern 2: Direct number (e.g., "20", "50000", "1,000")
  const directNumber = cleaned.match(/(\d{1,3}(?:,\d{3})*(?:\.\d+)?|\d+\.?\d*)/);
  if (directNumber) {
    const num = parseFloat(directNumber[1].replace(/,/g, ''));
    if (!isNaN(num) && num >= 0) {
      return num;
    }
  }

  // Pattern 3: Written numbers (basic support)
  const writtenNumbers: Record<string, number> = {
    'zero': 0, 'one': 1, 'two': 2, 'three': 3, 'four': 4, 'five': 5,
    'six': 6, 'seven': 7, 'eight': 8, 'nine': 9, 'ten': 10,
    'twenty': 20, 'thirty': 30, 'forty': 40, 'fifty': 50,
    'sixty': 60, 'seventy': 70, 'eighty': 80, 'ninety': 90,
    'hundred': 100, 'thousand': 1000, 'million': 1000000
  };

  for (const [word, value] of Object.entries(writtenNumbers)) {
    if (cleaned.includes(word)) {
      // Try to find a multiplier before the word
      const multiplierMatch = cleaned.match(/(\d+)\s*' + word + '/i);
      if (multiplierMatch) {
        return parseFloat(multiplierMatch[1]) * value;
      }
      return value;
    }
  }

  // Fallback: Try parseFloat on the entire cleaned string
  const fallback = parseFloat(cleaned.replace(/[^0-9.]/g, ''));
  if (!isNaN(fallback) && fallback >= 0) {
    return fallback;
  }

  return null;
}

/**
 * Validate and extract number with context
 * Returns the number and whether it seems valid for the context
 */
export function parseInputWithContext(
  input: string,
  context: 'age' | 'income' | 'savings' | 'investment' | 'percentage'
): { value: number | null; isValid: boolean; error?: string } {
  const number = extractNumber(input);

  if (number === null) {
    return {
      value: null,
      isValid: false,
      error: `I couldn't find a number in your response. Please enter a number.`
    };
  }

  // Context-specific validation
  switch (context) {
    case 'age':
      if (number < 18 || number > 100) {
        return {
          value: number,
          isValid: false,
          error: 'Please enter a valid age between 18 and 100.'
        };
      }
      break;

    case 'income':
      if (number < 0 || number > 100000000) {
        return {
          value: number,
          isValid: false,
          error: 'Please enter a reasonable income amount.'
        };
      }
      break;

    case 'savings':
    case 'investment':
      if (number < 0) {
        return {
          value: number,
          isValid: false,
          error: 'Please enter a positive amount (or 0).'
        };
      }
      break;

    case 'percentage':
      if (number < 0 || number > 500) {
        return {
          value: number,
          isValid: false,
          error: 'Please enter a percentage between 0 and 500.'
        };
      }
      break;
  }

  return { value: number, isValid: true };
}
