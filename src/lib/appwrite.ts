import { Client, Account, ID, Databases, Query } from 'appwrite';

const client = new Client();

// Your Appwrite endpoint will be http://localhost:80/v1 if running locally
client
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject('67c62c36001079a4bcf8');

export const account = new Account(client);
const databases = new Databases(client);

const DATABASE_ID = '67ccaa890023ce89f186';
const WALLETS_COLLECTION_ID = 'wallets';

// Authentication helper functions
export const appwriteService = {
    // Create a new account
    createAccount: async (email: string, password: string, name: string) => {
        try {
            const user = await account.create(ID.unique(), email, password, name);
            console.log('User created:', user);
            
            const session = await account.createEmailPasswordSession(email, password);
            console.log('Session created:', session);
            
            console.log('Creating wallet for new user:', user.$id);
            // Create a wallet for the new user
            const wallet = await appwriteService.createWallet(user.$id);
            console.log('Wallet created for new user:', wallet);
            
            return { session, user };
        } catch (error) {
            console.error('Error in createAccount:', error);
            throw error;
        }
    },

    // Login
    login: async (email: string, password: string) => {
        try {
            const session = await account.createEmailPasswordSession(email, password);
            console.log('Session created:', session);
            
            const user = await account.get();
            console.log('Current user:', user);
            
            // Ensure wallet exists after login
            try {
                await appwriteService.getWalletBalance(user.$id);
            } catch (error) {
                console.log('Creating missing wallet during login');
                await appwriteService.createWallet(user.$id);
            }
            
            return { session, user };
        } catch (error) {
            console.error('Error in login:', error);
            throw error;
        }
    },

    // Get currently logged in user
    getCurrentUser: async () => {
        try {
            const user = await account.get();
            console.log('getCurrentUser result:', user);
            return user;
        } catch (error) {
            console.error('Error in getCurrentUser:', error);
            return null;
        }
    },

    // Logout
    logout: async () => {
        try {
            await account.deleteSession('current');
        } catch (error) {
            console.error('Error in logout:', error);
            throw error;
        }
    },

    // Create a new wallet for a user
    createWallet: async (userId: string) => {
        try {
            console.log('Creating wallet with params:', {
                databaseId: DATABASE_ID,
                collectionId: WALLETS_COLLECTION_ID,
                user_id: userId
            });

            // First check if wallet already exists
            try {
                const existingWallet = await databases.listDocuments(
                    DATABASE_ID,
                    WALLETS_COLLECTION_ID,
                    [Query.equal('user_id', userId)]
                );

                if (existingWallet.documents.length > 0) {
                    console.log('Wallet already exists:', existingWallet.documents[0]);
                    return existingWallet.documents[0];
                }
            } catch (error) {
                console.log('Error checking existing wallet:', error);
                // Continue to create new wallet
            }

            const wallet = await databases.createDocument(
                DATABASE_ID,
                WALLETS_COLLECTION_ID,
                ID.unique(),
                {
                    user_id: userId,
                    balance: 0,
                    lastUpdated: new Date().toISOString()
                }
            );
            console.log('Wallet created successfully:', wallet);
            return wallet;
        } catch (error) {
            console.error('Error creating wallet:', error);
            throw error;
        }
    },

    // Get wallet balance for a user
    getWalletBalance: async (userId: string) => {
        try {
            console.log('Getting wallet for user:', userId);
            console.log('Using database:', DATABASE_ID);
            console.log('Using collection:', WALLETS_COLLECTION_ID);
            
            let wallet;
            try {
                wallet = await databases.listDocuments(
                    DATABASE_ID,
                    WALLETS_COLLECTION_ID,
                    [Query.equal('user_id', userId)]
                );
            } catch (error) {
                console.log('Error fetching wallet, attempting to create new one:', error);
                return await appwriteService.createWallet(userId);
            }
            
            console.log('Wallet query result:', wallet);
            
            if (wallet.documents.length > 0) {
                console.log('Existing wallet found:', wallet.documents[0]);
                return wallet.documents[0];
            }
            
            console.log('No wallet found, creating new one for legacy user');
            // If no wallet exists, create one
            return await appwriteService.createWallet(userId);
        } catch (error) {
            console.error('Detailed error in getWalletBalance:', {
                error,
                userId,
                databaseId: DATABASE_ID,
                collectionId: WALLETS_COLLECTION_ID
            });
            throw error;
        }
    },

    // Update wallet balance
    updateBalance: async (walletId: string, newBalance: number) => {
        try {
            console.log('Updating wallet:', {
                walletId,
                newBalance,
                databaseId: DATABASE_ID,
                collectionId: WALLETS_COLLECTION_ID
            });
            const wallet = await databases.updateDocument(
                DATABASE_ID,
                WALLETS_COLLECTION_ID,
                walletId,
                {
                    balance: newBalance,
                    lastUpdated: new Date().toISOString()
                }
            );
            console.log('Wallet updated successfully:', wallet);
            return wallet;
        } catch (error) {
            console.error('Error updating wallet:', error);
            throw error;
        }
    }
}; 