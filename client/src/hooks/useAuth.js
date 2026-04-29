import { useSelector } from 'react-redux';

export const useAuth = () => {
  const auth = useSelector((state) => state.auth);
  return {
    user: auth.user,
    company: auth.company,
    token: auth.token,
    isAuthenticated: !!auth.token,
    isAdmin: auth.user?.role === 'admin',
    isHR: auth.user?.role === 'hr',
    isEmployee: auth.user?.role === 'employee',
  };
};
