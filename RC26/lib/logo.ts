/**
 * Resolves a team logo URL.
 * Handles:
 *  - Full URLs (from Supabase storage or external)
 *  - Local paths like /assets/teams/1.jpg
 *  - Empty/null values with a fallback
 */
export function getLogoUrl(url: string | null | undefined): string {
  if (!url) return "/assets/teams/1.jpg"
  if (url.startsWith("http")) return url
  // Ensure it starts with a slash for local paths
  return url.startsWith("/") ? url : `/${url}`
}
