
import React, { createContext, useState, useContext, ReactNode } from 'react';

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
  reflections: string;
}

interface SprintContextType {
  sprints: Sprint[];
  currentSprint: Sprint | null;
  dailyLogs: DailyLog[];
  addSprint: (sprint: Omit<Sprint, "id">) => void;
  setSprints: (sprints: Sprint[]) => void;
  setCurrentSprint: (sprint: Sprint | null) => void;
  addDailyLog: (log: Omit<DailyLog, "id">) => void;
  setDailyLogs: (logs: DailyLog[]) => void;
}

const SprintContext = createContext<SprintContextType | undefined>(undefined);

export const SprintProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [sprints, setSprints] = useState<Sprint[]>([]);
  const [currentSprint, setCurrentSprint] = useState<Sprint | null>(null);
  const [dailyLogs, setDailyLogs] = useState<DailyLog[]>([]);

  const addSprint = (sprint: Omit<Sprint, "id">) => {
    const newSprint = {
      ...sprint,
      id: Date.now().toString(),
    };
    setSprints([...sprints, newSprint]);
    setCurrentSprint(newSprint);
  };

  const addDailyLog = (log: Omit<DailyLog, "id">) => {
    const newLog = {
      ...log,
      id: Date.now().toString(),
    };
    setDailyLogs([...dailyLogs, newLog]);
  };

  return (
    <SprintContext.Provider
      value={{
        sprints,
        currentSprint,
        dailyLogs,
        addSprint,
        setSprints,
        setCurrentSprint,
        addDailyLog,
        setDailyLogs,
      }}
    >
      {children}
    </SprintContext.Provider>
  );
};

export const useSprint = () => {
  const context = useContext(SprintContext);
  if (context === undefined) {
    throw new Error('useSprint must be used within a SprintProvider');
  }
  return context;
};
