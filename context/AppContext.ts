
import { createContext, Dispatch, SetStateAction } from 'react';
import { UserRole, Theme } from '../types';

interface IAppContext {
    userRole: UserRole;
    setUserRole: Dispatch<SetStateAction<UserRole>>;
    theme: Theme;
    setTheme: Dispatch<SetStateAction<Theme>>;
    churchName: string;
    setChurchName: Dispatch<SetStateAction<string>>;
}

export const AppContext = createContext<IAppContext>({
    userRole: UserRole.Viewer,
    setUserRole: () => {},
    theme: Theme.System,
    setTheme: () => {},
    churchName: 'Faith Church',
    setChurchName: () => {},
});