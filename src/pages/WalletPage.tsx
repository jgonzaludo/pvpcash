import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { appwriteService } from '../lib/appwrite';
import { useNavigate } from 'react-router-dom';
import { Models } from 'appwrite';

interface Wallet extends Models.Document {
    userId: string;
    balance: number;
    lastUpdated: string;
}

const WalletPage: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [wallet, setWallet] = useState<Wallet | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        if (!user) {
            return;
        }
        loadWallet();
    }, [user]);

    const loadWallet = async () => {
        try {
            setLoading(true);
            setError(null);
            const walletData = await appwriteService.getWalletBalance(user.$id);
            setWallet(walletData as Wallet);
        } catch (err: any) {
            console.error('Detailed wallet loading error:', err);
            setError(err?.message || 'Failed to load wallet data. Please try again.');
            if (err?.code === 404) {
                setError('Wallet not found. Please try logging out and back in.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleTransaction = async (amount: number) => {
        if (!wallet || processing) return;
        
        try {
            setProcessing(true);
            setError(null);
            const newBalance = wallet.balance + amount;
            if (newBalance < 0) {
                setError('Insufficient funds');
                return;
            }
            
            const updatedWallet = await appwriteService.updateBalance(wallet.$id, newBalance);
            setWallet(updatedWallet as Wallet);
        } catch (err: any) {
            console.error('Transaction error:', err);
            setError(err?.message || 'Transaction failed. Please try again.');
        } finally {
            setProcessing(false);
        }
    };

    return (
        <div className="page-content">
            <div className="wallet-section">
                <h1>Your Wallet</h1>
                
                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}

                <div className="wallet-container">
                    <div className="balance-section">
                        <h2>Current Balance</h2>
                        <div className="balance-amount" style={{ minHeight: '60px' }}>
                            <span className="currency">$</span>
                            <span className="amount" style={{ minWidth: '80px', display: 'inline-block' }}>
                                {loading ? '...' : (wallet?.balance || 0).toFixed(2)}
                            </span>
                        </div>

                        <div className="test-buttons">
                            <button 
                                className="test-button"
                                onClick={() => handleTransaction(10)}
                                disabled={loading || processing}
                            >
                                {processing ? 'Processing...' : 'Add $10'}
                            </button>
                            <button 
                                className="test-button"
                                onClick={() => handleTransaction(-10)}
                                disabled={loading || processing || (wallet?.balance || 0) < 10}
                            >
                                {processing ? 'Processing...' : 'Withdraw $10'}
                            </button>
                        </div>
                    </div>

                    <div className="history-section">
                        <h2>Transaction History</h2>
                        <p>Coming soon...</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WalletPage; 