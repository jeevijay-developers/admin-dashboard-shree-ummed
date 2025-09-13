"use client"

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

// Static credentials
const STATIC_CREDENTIALS = {
    email: "admin@example.com",
    password: "password"
};

export const useAuth = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const router = useRouter();

    // Check authentication status on mount
    useEffect(() => {
        checkAuthStatus();
    }, []);

    const checkAuthStatus = () => {
        setLoading(true);
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');
        
        if (token && userData) {
            setIsAuthenticated(true);
            setUser(JSON.parse(userData));
        } else {
            setIsAuthenticated(false);
            setUser(null);
        }
        setLoading(false);
    };

    const login = async (credentials) => {
        try {
            setLoading(true);
            
            // Static authentication check
            if (credentials.email === STATIC_CREDENTIALS.email && 
                credentials.password === STATIC_CREDENTIALS.password) {
                
                // Create static token and user data
                const token = 'static-jwt-token-' + Date.now();
                const userData = {
                    id: 1,
                    email: credentials.email,
                    name: "Admin User",
                    role: "admin"
                };
                
                // Store in localStorage
                localStorage.setItem('token', token);
                localStorage.setItem('user', JSON.stringify(userData));
                
                setUser(userData);
                setIsAuthenticated(true);
                
                // Redirect to admin dashboard
                router.push('/admin');
                return { success: true };
            } else {
                return { 
                    success: false, 
                    error: 'Invalid email or password' 
                };
            }
        } catch (error) {
            console.error('Login failed:', error);
            return { 
                success: false, 
                error: 'Login failed. Please try again.' 
            };
        } finally {
            setLoading(false);
        }
    };

    const logout = useCallback(() => {
        // Clear localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        
        // Reset state
        setUser(null);
        setIsAuthenticated(false);
        
        // Redirect to login
        router.push('/');
    }, [router]);

    const requireAuth = useCallback(() => {
        if (!loading && !isAuthenticated) {
            router.push('/');
            return false;
        }
        return true;
    }, [loading, isAuthenticated, router]);

    return {
        user,
        loading,
        isAuthenticated,
        login,
        logout,
        requireAuth,
        checkAuthStatus
    };
};