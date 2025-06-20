
// XSS Protection - with fallback if DOMPurify is not available
let DOMPurify: any = null;

try {
  // Dynamically import DOMPurify for better compatibility
  if (typeof window !== 'undefined') {
    import('dompurify').then(module => {
      DOMPurify = module.default;
    });
  }
} catch (error) {
  console.warn('DOMPurify not available, using basic sanitization');
}

export const sanitizeInput = (input: string): string => {
  if (DOMPurify) {
    return DOMPurify.sanitize(input, { 
      ALLOWED_TAGS: [],
      ALLOWED_ATTR: []
    });
  }
  
  // Basic fallback sanitization
  return input
    .replace(/[<>]/g, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+=/gi, '');
};

export const sanitizeHtml = (html: string): string => {
  if (DOMPurify) {
    return DOMPurify.sanitize(html, {
      ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'p', 'br'],
      ALLOWED_ATTR: []
    });
  }
  
  // Basic fallback
  return html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
};

// Input validation
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateWalletAddress = (address: string): boolean => {
  // Basic validation for common wallet formats
  const ethRegex = /^0x[a-fA-F0-9]{40}$/;
  const btcRegex = /^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$/;
  const solanaRegex = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;
  
  return ethRegex.test(address) || btcRegex.test(address) || solanaRegex.test(address);
};

export const validatePositiveNumber = (value: number): boolean => {
  return !isNaN(value) && value > 0 && isFinite(value);
};

// Rate limiting store
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

export const checkRateLimit = (key: string, maxRequests: number = 10, windowMs: number = 60000): boolean => {
  const now = Date.now();
  const record = rateLimitStore.get(key);
  
  if (!record || now > record.resetTime) {
    rateLimitStore.set(key, { count: 1, resetTime: now + windowMs });
    return true;
  }
  
  if (record.count >= maxRequests) {
    return false;
  }
  
  record.count++;
  return true;
};

// Secure logging (remove sensitive data)
export const secureLog = (message: string, data?: any) => {
  if (process.env.NODE_ENV === 'development') {
    const sanitizedData = data ? sanitizeLogData(data) : undefined;
    console.log(`[SECURE] ${message}`, sanitizedData);
  }
};

const sanitizeLogData = (data: any): any => {
  if (typeof data !== 'object' || data === null) return data;
  
  const sensitiveKeys = ['password', 'email', 'token', 'key', 'secret', 'private'];
  const sanitized = { ...data };
  
  Object.keys(sanitized).forEach(key => {
    if (sensitiveKeys.some(sensitive => key.toLowerCase().includes(sensitive))) {
      sanitized[key] = '[REDACTED]';
    }
  });
  
  return sanitized;
};
