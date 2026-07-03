// ---- Check the user group for authorization tasks ---- 

export function isSuper(user: { groups?: string[] }) {
  return user.groups?.includes("super-user");
}

export function isAdmin(user: { groups?: string[] }) {
  return user.groups?.includes("admin");
}

export function isUser(user: { groups?: string[] }) {
  return user.groups?.includes("user");
}

export function isSuperOrAdmin(user?: { groups?: string[] }) {
  return user?.groups?.includes("super-user") || user?.groups?.includes("admin");
}

// -------------------------------------------------------