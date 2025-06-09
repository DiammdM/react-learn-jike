import { getToken } from '@/utils';
import React from 'react';
import { Navigate } from 'react-router-dom';

const ignorePaths = ['/login', '/register'];

const AuthRoute = ({ children }) => {
  // 如果是忽略的路径，直接返回 children
  if (ignorePaths.includes(window.location.pathname)) {
    return <>{children}</>;
  }

  if (getToken()) {
    return <>{children}</>;
  } else {
    return <Navigate to={'/login'} replace />;
  }
};

export default AuthRoute;
