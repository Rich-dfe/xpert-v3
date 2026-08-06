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
  return (user?.groups?.includes("super-user") === true || user?.groups?.includes("admin") === true);
}

export function calculateStopDate(startDate: Date, interval: number): Date | undefined{
  const durationDays = loggerDurationDays[interval];

  if(!durationDays){
    return;
  }

  const stopDate = new Date(startDate);

  stopDate.setDate(stopDate.getDate() + durationDays);

  return stopDate;
}

const loggerDurationDays: Record<number,number> = {
    10: 6,
    30: 18
  }

// -------------------------------------------------------