import React from 'react';
import { useAuth } from '../contexts/useAuth';

const AuthStatus: React.FC = () => {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) {
    return (
      <div className="p-4 bg-yellow-100 border border-yellow-400 rounded-md">
        <p className="text-yellow-800">🔄 Checking authentication status...</p>
      </div>
    );
  }

  return (
    <div className={`p-4 rounded-md ${
      isAuthenticated 
        ? 'bg-green-100 border border-green-400' 
        : 'bg-red-100 border border-red-400'
    }`}>
      {isAuthenticated ? (
        <div className="text-green-800">
          <p className="font-semibold">✅ Authenticated</p>
          <p>Welcome back, {user?.name}!</p>
          <p className="text-sm opacity-75">
            Try refreshing the page - you should stay logged in!
          </p>
        </div>
      ) : (
        <div className="text-red-800">
          <p className="font-semibold">❌ Not Authenticated</p>
          <p>Please log in to access protected content.</p>
        </div>
      )}
    </div>
  );
};

export default AuthStatus;
