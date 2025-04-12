
export interface UserPreferences {
  dashboardWidgets: string[];
  notificationsEnabled: boolean;
  autoSyncGithub: boolean;
  theme: string;
}

export const defaultUserPreferences: UserPreferences = {
  dashboardWidgets: [
    "active-sprint", 
    "tasks-completed", 
    "blockers", 
    "daily-streak", 
    "github-activity", 
    "productivity-score", 
    "time-tracking"
  ],
  notificationsEnabled: true,
  autoSyncGithub: true,
  theme: "system"
};

export const getUserPreferences = (): UserPreferences => {
  const storedPrefs = localStorage.getItem('devsprint_user_preferences');
  if (storedPrefs) {
    return JSON.parse(storedPrefs);
  }
  return defaultUserPreferences;
};

export const saveUserPreferences = (preferences: UserPreferences): void => {
  localStorage.setItem('devsprint_user_preferences', JSON.stringify(preferences));
};
