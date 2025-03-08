import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { appwriteService } from '../lib/appwrite';
import { useAuth } from '../contexts/AuthContext';

interface LocationState {
    from?: string;
}

const LoginPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const { user, refreshUser } = useAuth();

    // If user is already logged in, redirect them
    if (user) {
        const state = location.state as LocationState;
        const from = state?.from || '/';
        return <Navigate to={from} replace />;
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setError(null);
            setLoading(true);
            await appwriteService.login(email, password);
            await refreshUser();
            // Get the path to redirect to, default to home if none specified
            const state = location.state as LocationState;
            const from = state?.from || '/';
            navigate(from);
        } catch (err: any) {
            console.error('Login error:', err);
            setError(err?.message || 'Failed to login');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            <div className="login-form-container">
                <h1>Login</h1>
                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}
                <form onSubmit={handleSubmit} className="login-form">
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <div className="password-input-container">
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <button
                                type="button"
                                className="password-toggle"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? 'Hide' : 'Show'}
                            </button>
                        </div>
                    </div>
                    <button type="submit" disabled={loading}>
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>
                <div className="register-text">
                    Don't have an account?
                    <Link to="/register" className="register-link">Register</Link>
                </div>
            </div>
        </div>
    );
};

export default LoginPage; 