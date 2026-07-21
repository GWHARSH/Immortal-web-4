/**
 * Forces a URL to use HTTPS if it starts with HTTP.
 * Useful for URLs fetched from external APIs or user-provided settings.
 */
export function forceHttps(url) {
  if (!url || typeof url !== 'string') return url;
  if (url.startsWith('http://')) {
    return url.replace('http://', 'https://');
  }
  // If it's a protocol-relative URL (e.g. //example.com), force https
  if (url.startsWith('//')) {
    return `https:${url}`;
  }
  return url;
}

/**
 * Sanitizes a string to prevent basic XSS when used in dangerouslySetInnerHTML
 */
export function sanitizeHTML(str) {
  if (!str) return '';
  return str
    .replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gim, '')
    .replace(/on\w+="[^"]*"/gim, '')
    .replace(/on\w+='[^']*'/gim, '');
}
