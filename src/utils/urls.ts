export function withBase(path: string): string {
  if (!path.startsWith('/')) throw new Error(`Internal path must begin with /: ${path}`);
  const base = import.meta.env.BASE_URL;
  return `${base.replace(/\/$/, '')}${path}`.replace(/\/\/{2,}/g, '/');
}
