import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { initAuth } from '../slices/authSlice';
import Loader from './Loader';

export const AuthInitializer = ({ children }) => {
  const dispatch = useDispatch();
  const { token, initialized, loading } = useSelector((state) => state.auth);

  useEffect(() => {
    // Only init if token exists and not already initialized
    if (token && !initialized) {
      dispatch(initAuth());
    }
  }, [dispatch, token, initialized]);

  // Show loading spinner while checking auth
  if (loading && !initialized) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader />
      </div>
    );
  }

  return children;
};
