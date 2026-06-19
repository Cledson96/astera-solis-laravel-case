export function canManageContent(role?: string | null): boolean {
  return role === "admin" || role === "editor";
}
