export interface RouteAccessMeta {
  permission?: string
  clientType?: string
}

export function canAccessRoute(
  permissions: string[],
  clientScopes: string[],
  meta: RouteAccessMeta,
): boolean {
  if (meta.clientType && !clientScopes.includes(meta.clientType)) {
    return false
  }
  if (meta.permission && !permissions.includes(meta.permission)) {
    return false
  }
  return true
}

