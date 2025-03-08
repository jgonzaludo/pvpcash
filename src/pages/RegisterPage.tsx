import React, { useState } from 'react';
import { useNavigate, Link, Navigate } from 'react-router-dom';
import { appwriteService } from '../lib/appwrite';
import { useAuth } from '../contexts/AuthContext';

const RegisterPage: React.FC = () => {
    const navigate = useNavigate();
    const { user, refreshUser } = useAuth();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    // Redirect if user is already logged in
    if (user) {
        return <Navigate to="/" />;
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            await appwriteService.createAccount(email, password, name);
            await refreshUser();
            navigate('/');
        } catch (err: any) {
            console.error('Registration error:', err);
            setError(err.message || 'Failed to register. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page-content">
            <div className="login-container">
                <h1>Register</h1>
                {error && <div className="error-message">{error}</div>}
                <form onSubmit={handleSubmit} className="login-form">
                    <div className="form-group">
                        <label htmlFor="name">Username</label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
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
                                minLength={8}
                            />
                            <button
                                type="button"
                                className="password-toggle"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? "Hide" : "Show"}
                            </button>
                        </div>
                    </div>
                    <button type="submit" disabled={loading}>
                        {loading ? 'Creating Account...' : 'Register'}
                    </button>
                </form>
                <p className="register-text">
                    Already have an account? <Link to="/login" className="register-link">Login</Link>
                </p>
            </div>
        </div>
    );
};

export default RegisterPage; 