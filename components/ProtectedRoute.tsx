"use client"

import { useEffect, ReactNode } from 'react';
import { useAuth } from '@/hooks/useAuth';

interface ProtectedRouteProps {
    children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
    const { isAuthenticated, loading, requireAuth } = useAuth();

    useEffect(() => {
        if (!loading) {
            requireAuth();
        }
    }, [loading, requireAuth]);

    // Show loading spinner while checking authentication
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
            </div>
        );
    }

    // Show nothing while redirecting to login
    if (!isAuthenticated) {
        return null;
    }

    // Render children if authenticated
    return <>{children}</>;
}