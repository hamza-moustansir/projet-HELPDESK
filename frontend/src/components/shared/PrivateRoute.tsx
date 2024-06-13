import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { RootState } from '../../redux/store'; // Assurez-vous que le chemin est correct selon votre structure de dossier
import { useSelector } from 'react-redux';

const PrivateRoute = ({ children }: { children: ReactNode }) => {
  const { user } = useSelector((state: RootState) => state.auth);

  if (user) return children;

  return <Navigate to='/login' />;
};

export default PrivateRoute;
