// src/pages/TestPage.jsx
import React from 'react';
import useAuthStore from '../store/authStore';

const TestPage = () => {
  const { user, logout } = useAuthStore();

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center text-black">
      <h1 className="text-2xl font-semibold mb-4">Test Page</h1>
      {user ? (
        <>
          <p className="mb-2">Logged in as: <span className="font-medium">{user.email}</span></p>
          <button
            onClick={logout}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Logout
          </button>
        </>
      ) : (
        <p>No user found</p>
      )}
    </div>
  );
};

export default TestPage;
