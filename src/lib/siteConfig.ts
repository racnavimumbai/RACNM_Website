/**
 * Site Configuration & Feature Flags
 * 
 * Edit these settings directly to toggle features on or off across the website.
 */

export const siteConfig = {
  /**
   * TOGGLE: Hide "About Us" page
   * 
   * - Set to `true` (ON): Hides the About Us button from Header & Footer,
   *   excludes it from sitemap/404 suggestions, and redirects/disables direct access to `/about`.
   * - Set to `false` (OFF): Displays the About Us page in Header & Footer
   *   and restores normal access.
   * 
   * Default: true (Hidden)
   * (Can also be overridden via NEXT_PUBLIC_HIDE_ABOUT_US environment variable)
   */
  hideAboutUs: process.env.NEXT_PUBLIC_HIDE_ABOUT_US !== undefined
    ? process.env.NEXT_PUBLIC_HIDE_ABOUT_US === 'true'
    : true,
};
