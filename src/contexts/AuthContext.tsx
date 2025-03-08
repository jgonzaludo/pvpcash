import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { appwriteService } from '../lib/appwrite';

interface AuthContextType {
    user: any;
    loading: boolean;
    logout: () => Promise<void>;
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();

    const refreshUser = async () => {
        try {
            const currentUser = await appwriteService.getCurrentUser();
            setUser(currentUser);
        } catch (error) {
            console.error('Error refreshing user:', error);
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    // Initial auth check when the app loads
    useEffect(() => {
        refreshUser();
    }, []);

    // Handle protected routes and redirects
    useEffect(() => {
        const publicRoutes = ['/login', '/register', '/']; // Add any other public routes here
        const isPublicRoute = publicRoutes.some(route => location.pathname.startsWith(route));

        if (!loading) { // Only handle redirects after initial load
            if (!user && !isPublicRoute) {
                // Save the current location and redirect to login
                navigate('/login', { state: { from: location.pathname } });
            }
        }
    }, [user, loading, location.pathname]);

    const logout = async () => {
        try {
            setLoading(true);
            await appwriteService.logout();
            setUser(null);
            navigate('/');
        } catch (error) {
            console.error('Error logging out:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, logout, refreshUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}; 