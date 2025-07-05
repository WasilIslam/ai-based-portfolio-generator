export const ensureHttps = (url: string): string => {
  if (!url) return url;
  
  // Remove whitespace
  const trimmedUrl = url.trim();
  
  // If already has protocol, return as is
  if (trimmedUrl.startsWith('http://') || trimmedUrl.startsWith('https://')) {
    return trimmedUrl;
  }
  
  // If it's an email link, don't add https
  if (trimmedUrl.startsWith('mailto:')) {
    return trimmedUrl;
  }
  
  // If it's a phone link, don't add https
  if (trimmedUrl.startsWith('tel:')) {
    return trimmedUrl;
  }
  
  // Add https:// to URLs that don't have a protocol
  return `https://${trimmedUrl}`;
};

export const isValidUrl = (url: string): boolean => {
  if (!url) return false;
  
  try {
    // Handle special protocols
    if (url.startsWith('mailto:') || url.startsWith('tel:')) {
      return true;
    }
    
    new URL(ensureHttps(url));
    return true;
  } catch {
    return false;
  }
}; 