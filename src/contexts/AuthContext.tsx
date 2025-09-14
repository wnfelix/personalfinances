import React, {
	createContext,
	useContext,
	useState,
	useEffect,
	ReactNode,
} from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../services/api';

interface User {
	id: number;
	firstName: string;
	middleName?: string;
	lastName: string;
	email: string;
	lastLogin: string;
	createdAt: string;
	active: boolean;
}

interface AuthContextData {
	user: User | null;
	isAuthenticated: boolean;
	isLoading: boolean;
	logout: () => void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

interface AuthProviderProps {
	children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
	const [user, setUser] = useState<User | null>(null);
	const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

	// Check if user is authenticated on app start
	useEffect(() => {
		const token = localStorage.getItem('token');
		const storedUser = localStorage.getItem('user');

		if (token && storedUser) {
			setUser(JSON.parse(storedUser));
			setIsAuthenticated(true);
		}
	}, []);

	// Query to fetch current user data from /auth/me
	const { isLoading } = useQuery(
		['currentUser'],
		async (): Promise<User> => {
			const response = await api.get('/auth/me');
			return response.data;
		},
		{
			enabled: isAuthenticated && !!localStorage.getItem('token'),
			onSuccess: (userData: User) => {
				setUser(userData);
				localStorage.setItem('user', JSON.stringify(userData));
			},
			onError: () => {
				// If fetching user fails, clear auth state
				logout();
			},
			retry: false,
			staleTime: 5 * 60 * 1000, // 5 minutes
		}
	);

	const logout = () => {
		localStorage.removeItem('token');
		localStorage.removeItem('user');
		setUser(null);
		setIsAuthenticated(false);
		delete api.defaults.headers.common['Authorization'];
	};

	return (
		<AuthContext.Provider
			value={{
				user,
				isAuthenticated,
				isLoading,
				logout,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error('useAuth must be used within an AuthProvider');
	}
	return context;
};
