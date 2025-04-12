
import React, { createContext, useState, useEffect, useContext } from "react";

interface Sprint {
  id: string;
  name: string;
  goal: string;
  startDate: string;
  endDate: string;
}

interface DailyLog {
  id: string;
  sprintId: string;
  date: string;
  tasksCompleted: string[];
  blockers: string[];
  notes: string;
  reflections: string;
}

import { UserPreferences, defaultUserPreferences, getUserPreferences, saveUserPreferences } from "./UserPreferences";

interface SprintContextType {
  sprints: Sprint[];
  dailyLogs: DailyLog[];
  addSprint: (sprint: Omit<Sprint, "id">) => void;
  addDailyLog: (log: Omit<DailyLog, "id">) => void;
  currentSprint: Sprint | null;
  userPreferences: UserPreferences;
  updateUserPreferences: (preferences: Partial<UserPreferences>) => void;
}

const SprintContext = createContext<SprintContextType | undefined>(undefined);

export const useSprint = () => {
  const context = useContext(SprintContext);
  if (!context) {
    throw new Error("useSprint must be used within a SprintProvider");
  }
  return context;
};

export const SprintProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [sprints, setSprints] = useState<Sprint[]>([]);
  const [dailyLogs, setDailyLogs] = useState<DailyLog[]>([]);
  const [userPreferences, setUserPreferences] = useState<UserPreferences>(getUserPreferences());

  useEffect(() => {
    // Load sprints from local storage on component mount
    const storedSprints = localStorage.getItem('sprints');
    if (storedSprints) {
      setSprints(JSON.parse(storedSprints));
    }

    // Load daily logs from local storage on component mount
    const storedDailyLogs = localStorage.getItem('dailyLogs');
    if (storedDailyLogs) {
      setDailyLogs(JSON.parse(storedDailyLogs));
    }
  }, []);

  useEffect(() => {
    // Save sprints to local storage whenever sprints change
    localStorage.setItem('sprints', JSON.stringify(sprints));
  }, [sprints]);

  useEffect(() => {
    // Save daily logs to local storage whenever dailyLogs change
    localStorage.setItem('dailyLogs', JSON.stringify(dailyLogs));
  }, [dailyLogs]);

  const addSprint = (sprintData: Omit<Sprint, "id">) => {
    const newSprint: Sprint = {
      ...sprintData,
      id: `sprint-${Date.now()}`
    };
    setSprints([...sprints, newSprint]);
  };

  const addDailyLog = (logData: Omit<DailyLog, "id">) => {
    const newLog: DailyLog = {
      ...logData,
      id: `log-${Date.now()}`
    };
    setDailyLogs([...dailyLogs, newLog]);
  };

  // Calculate current sprint based on date
  const currentDate = new Date();
  const currentSprint = sprints.find(sprint => {
    const startDate = new Date(sprint.startDate);
    const endDate = new Date(sprint.endDate);
    return startDate <= currentDate && endDate >= currentDate;
  }) || null;

  const updateUserPreferences = (preferences: Partial<UserPreferences>) => {
    const updatedPreferences = { ...userPreferences, ...preferences };
    setUserPreferences(updatedPreferences);
    saveUserPreferences(updatedPreferences);
  };

  return (
    <SprintContext.Provider value={{
      sprints,
      dailyLogs,
      addSprint,
      addDailyLog,
      currentSprint,
      userPreferences,
      updateUserPreferences
    }}>
      {children}
    </SprintContext.Provider>
  );
};
