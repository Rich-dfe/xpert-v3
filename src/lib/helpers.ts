// ---- Check the user group for authorization tasks ---- 

export function isSuper(user: { groups?: string[] }) {
  return user.groups?.includes("super-user") ?? false;
}

export function isAdmin(user: { groups?: string[] }) {
  return user.groups?.includes("admin") ?? false;
}

export function isUser(user: { groups?: string[] }) {
  return user.groups?.includes("user") ?? false;
}

export function isSuperOrAdmin(user?: { groups?: string[] }) {
  return user?.groups?.includes("super-user") || user?.groups?.includes("admin");
}

// -------------------------------------------------------