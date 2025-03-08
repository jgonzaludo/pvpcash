import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';

const AccountPage: React.FC = () => {
    const { user } = useAuth();

    if (!user) {
        return <Navigate to="/login" />;
    }

    return (
        <div className="page-content">
            <div className="account-container">
                <h1>Account Settings</h1>
                <div className="account-info">
                    <p>
                        <strong>Username:</strong> {user?.name}
                    </p>
                    <p>
                        <strong>Email:</strong> {user?.email}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AccountPage; 