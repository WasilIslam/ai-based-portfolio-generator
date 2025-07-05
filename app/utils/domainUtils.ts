export const getBaseDomain = (): string => {
  // Try to get from environment variable first
  const envDomain = process.env.NEXT_PUBLIC_BASE_DOMAIN;
  if (envDomain) {
    return envDomain;
  }
  
  // Try to get from window location (client-side)
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    // Extract base domain from current hostname
    const parts = hostname.split('.');
    if (parts.length >= 2) {
      // Remove subdomain and return base domain
      return parts.slice(-2).join('.');
    }
  }
  
  // Fallback to cuthours.com
  return 'cuthours.com';
};

export const getPortfolioUrl = (portfolioId: string): string => {
  const baseDomain = getBaseDomain();
  return `${portfolioId}.${baseDomain}`;
}; 