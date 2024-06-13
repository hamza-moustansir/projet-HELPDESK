// Sidebar.tsx

import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { navItems } from '@/constants/data';
import { Link } from 'react-router-dom';
import DashboardNav from './dashboard-nav';

export default function Sidebar() {
  // Récupérer le rôle de l'utilisateur depuis le state Redux
  const userRole = useSelector((state: RootState) => state.auth.user?.role);

  // Sélectionner les éléments de navigation en fonction du rôle de l'utilisateur
  const sidebarItems = userRole ? navItems[userRole.toLowerCase()] : [];

  return (
    <aside className="hidden h-screen w-64 flex-col overflow-y-auto overflow-x-hidden rounded-tr-[90px] border-r bg-primary py-8 pl-5 dark:bg-background lg:flex">
      <Link to="#" className="text-3xl font-bold text-white">
        OCP
      </Link>
      <div className="mt-6 flex flex-1 flex-col justify-between">
        <DashboardNav items={sidebarItems} />
      </div>
    </aside>
  );
}
