import { create } from 'zustand';

export type Role = 'agent' | 'manager' | 'hr' | 'admin';

interface AuthState {
  role: Role;
  setRole: (role: Role) => void;
  user: {
    id: number;
    fullName: string;
    department: string;
    leaveBalance: number;
    usedLeaves: number;
  };
}

// Simulated auth store to drive the UI based on different roles
export const useAuth = create<AuthState>((set) => ({
  role: 'agent', // Default role
  setRole: (role) => set((state) => ({ 
    role,
    user: {
      ...state.user,
      fullName: role === 'agent' ? 'Ahmed Benali' 
               : role === 'manager' ? 'Karim Safir' 
               : role === 'hr' ? 'Samira Djeffal' 
               : 'Admin System',
      department: role === 'hr' ? 'Ressources Humaines' : 'Département IT',
      leaveBalance: 22,
      usedLeaves: 8,
    }
  })),
  user: {
    id: 1,
    fullName: 'Ahmed Benali',
    department: 'Département IT',
    leaveBalance: 22,
    usedLeaves: 8,
  },
}));
