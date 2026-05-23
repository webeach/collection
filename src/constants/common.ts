/** `true` when running outside of a production environment. Used to gate dev-only warnings. */
export const __DEVELOPMENT__ = process.env.NODE_ENV !== 'production';
