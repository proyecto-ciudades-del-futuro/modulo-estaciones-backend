

// This is our "database" of blacklisted tokens
export let tokenBlacklist: Record<string, boolean> = {};

export const addToBlacklist = async (token: string): Promise<void> => {
  // Add the token to the blacklist
  tokenBlacklist[token] = true;
};

export const isTokenBlacklisted = (token: string): boolean => {
  // Check if the token is in the blacklist
  return tokenBlacklist.hasOwnProperty(token);
};