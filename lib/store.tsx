'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useCallback,
} from 'react';
import { useRouter } from 'next/navigation';
import {
  Project,
  User,
  FormSection,
  ScenarioResults,
  AppContextType,
  ProjectInputs,
} from './types';
import { generateScenarios } from './scenarios';
import { getSampleData } from './sampleData';

const STORAGE_KEYS = {
  USER: 'clarion_user',
  PROJECTS: 'clarion_projects',
  AUTH: 'clarion_auth',
};

interface AppState {
  user: User | null;
  projects: Project[];
  currentProject: Project | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const initialState: AppState = {
  user: null,
  projects: [],
  currentProject: null,
  isAuthenticated: false,
  isLoading: true,
};

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(initialState);
  const router = useRouter();

  // Load state from localStorage on mount
  useEffect(() => {
    const loadState = () => {
      try {
        const authData = localStorage.getItem(STORAGE_KEYS.AUTH);
        const projectsData = localStorage.getItem(STORAGE_KEYS.PROJECTS);
        const userData = localStorage.getItem(STORAGE_KEYS.USER);

        const isAuthenticated = authData === 'true';
        const projects: Project[] = projectsData ? JSON.parse(projectsData) : getSampleData();
        const user: User | null = userData ? JSON.parse(userData) : null;

        // Save sample data if no projects exist
        if (!projectsData) {
          localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
        }

        setState({
          isAuthenticated,
          projects,
          user,
          currentProject: null,
          isLoading: false,
        });
      } catch (error) {
        console.error('Failed to load state:', error);
        setState((prev) => ({ ...prev, isLoading: false }));
      }
    };

    loadState();
  }, []);

  // Save projects to localStorage whenever they change
  useEffect(() => {
    if (!state.isLoading && state.projects.length >= 0) {
      localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(state.projects));
    }
  }, [state.projects, state.isLoading]);

  const login = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async (email: string, _password: string): Promise<boolean> => {
      // Mock authentication - accept any email/password
      const user: User = {
        id: '1',
        email,
        name: email.split('@')[0],
      };

      localStorage.setItem(STORAGE_KEYS.AUTH, 'true');
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));

      setState((prev) => ({
        ...prev,
        isAuthenticated: true,
        user,
      }));

      return true;
    },
    []
  );

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEYS.AUTH);
    localStorage.removeItem(STORAGE_KEYS.USER);

    setState((prev) => ({
      ...prev,
      isAuthenticated: false,
      user: null,
      currentProject: null,
    }));

    router.push('/');
  }, [router]);

  const createProject = useCallback(
    (
      projectData: Omit<
        Project,
        'id' | 'createdAt' | 'updatedAt' | 'status' | 'inputs' | 'results'
      >
    ): Project => {
      const now = new Date().toISOString();
      const newProject: Project = {
        ...projectData,
        id: `project_${Date.now()}`,
        inputs: {},
        status: 'In Progress',
        createdAt: now,
        updatedAt: now,
      };

      setState((prev) => ({
        ...prev,
        projects: [newProject, ...prev.projects],
      }));

      return newProject;
    },
    []
  );

  const updateProject = useCallback((id: string, updates: Partial<Project>) => {
    setState((prev) => ({
      ...prev,
      projects: prev.projects.map((project) =>
        project.id === id
          ? { ...project, ...updates, updatedAt: new Date().toISOString() }
          : project
      ),
      currentProject:
        prev.currentProject?.id === id
          ? { ...prev.currentProject, ...updates, updatedAt: new Date().toISOString() }
          : prev.currentProject,
    }));
  }, []);

  const deleteProject = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      projects: prev.projects.filter((project) => project.id !== id),
      currentProject: prev.currentProject?.id === id ? null : prev.currentProject,
    }));
  }, []);

  const setCurrentProject = useCallback((project: Project | null) => {
    setState((prev) => ({
      ...prev,
      currentProject: project,
    }));
  }, []);

  const updateProjectInputs = useCallback(
    (projectId: string, section: FormSection, data: unknown) => {
      setState((prev) => {
        const updatedProjects = prev.projects.map((project) => {
          if (project.id !== projectId) return project;

          const updatedInputs: ProjectInputs = {
            ...project.inputs,
            [section]: data,
          };

          // Check if all sections are complete
          const allSectionsComplete =
            updatedInputs.condition &&
            updatedInputs.planning &&
            updatedInputs.mep &&
            updatedInputs.costs &&
            updatedInputs.esg;

          return {
            ...project,
            inputs: updatedInputs,
            status: allSectionsComplete ? ('Complete' as const) : ('In Progress' as const),
            updatedAt: new Date().toISOString(),
          };
        });

        const updatedCurrentProject = prev.currentProject?.id === projectId
          ? updatedProjects.find((p) => p.id === projectId) || null
          : prev.currentProject;

        return {
          ...prev,
          projects: updatedProjects,
          currentProject: updatedCurrentProject,
        };
      });
    },
    []
  );

  const generateResults = useCallback(
    (projectId: string): ScenarioResults => {
      const project = state.projects.find((p) => p.id === projectId);
      if (!project) {
        throw new Error('Project not found');
      }

      const results = generateScenarios(project);

      setState((prev) => ({
        ...prev,
        projects: prev.projects.map((p) =>
          p.id === projectId
            ? { ...p, results, updatedAt: new Date().toISOString() }
            : p
        ),
        currentProject:
          prev.currentProject?.id === projectId
            ? { ...prev.currentProject, results, updatedAt: new Date().toISOString() }
            : prev.currentProject,
      }));

      return results;
    },
    [state.projects]
  );

  const setProjectResults = useCallback(
    (projectId: string, results: ScenarioResults) => {
      setState((prev) => ({
        ...prev,
        projects: prev.projects.map((p) =>
          p.id === projectId
            ? { ...p, results, updatedAt: new Date().toISOString() }
            : p
        ),
        currentProject:
          prev.currentProject?.id === projectId
            ? { ...prev.currentProject, results, updatedAt: new Date().toISOString() }
            : prev.currentProject,
      }));
    },
    []
  );

  const contextValue: AppContextType = {
    ...state,
    login,
    logout,
    createProject,
    updateProject,
    deleteProject,
    setCurrentProject,
    updateProjectInputs,
    generateResults,
    setProjectResults,
  };

  return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}

// Hook to get a single project by ID
export function useProject(id: string) {
  const { projects, setCurrentProject } = useApp();
  const project = projects.find((p) => p.id === id);

  useEffect(() => {
    if (project) {
      setCurrentProject(project);
    }
    return () => setCurrentProject(null);
  }, [project, setCurrentProject]);

  return project;
}

// Hook to check form section completion
export function useFormCompletion(project: Project | null) {
  if (!project) {
    return {
      condition: false,
      planning: false,
      mep: false,
      costs: false,
      esg: false,
      completedCount: 0,
      totalCount: 5,
      isComplete: false,
    };
  }

  const condition = !!project.inputs.condition;
  const planning = !!project.inputs.planning;
  const mep = !!project.inputs.mep;
  const costs = !!project.inputs.costs;
  const esg = !!project.inputs.esg;

  const completedCount = [condition, planning, mep, costs, esg].filter(Boolean).length;

  return {
    condition,
    planning,
    mep,
    costs,
    esg,
    completedCount,
    totalCount: 5,
    isComplete: completedCount === 5,
  };
}

export default AppProvider;
