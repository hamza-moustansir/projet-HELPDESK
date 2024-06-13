import NotFound from '@/pages/not-found';
import { Suspense, lazy } from 'react';
import { Navigate, Outlet, useRoutes } from 'react-router-dom';

const DashboardLayout = lazy(
  () => import('@/components/layout/dashboard-layout')
);
const SignInPage = lazy(() => import('@/pages/auth/signin'));
const PrivateRoute = lazy(() => import('@/components/shared/PrivateRoute'));
const DashboardPage = lazy(() => import('@/pages/dashboard'));
const StudentPage = lazy(() => import('@/pages/students'));
const AdminCompte = lazy(() => import('@/pages/admin/dashboard/students'));
const AdminService = lazy(() => import('@/pages/admin/dashboard/service'));
const AdminNote = lazy(() => import('@/pages/admin/dashboard/avis'));
const EmployeNote = lazy(() => import('@/pages/admin/dashboard/avis/components/student-forms'));
const EmployeTicket = lazy(() => import('@/pages/employe/dashboard/students'));
const ViewTicket = lazy(() => import('@/pages/employe/dashboard/view'));
const AgentTicket = lazy(() => import('@/pages/agent/dashboard/students'));
const AgentArticle = lazy(() => import('@/pages/agent/dashboard/article'));
const ViewTicketAgent = lazy(() => import('@/pages/agent/dashboard/view'));
const ViewArticle = lazy(() => import('@/pages/agent/dashboard/article/view'));
const StudentDetailPage = lazy(
() => import('@/pages/students/StudentDetailPage')
);
// ----------------------------------------------------------------------
const AdminDashboardPage = lazy(() => import('@/pages/admin/dashboard'));
const AgentDashboardPage = lazy(() => import('@/pages/agent/dashboard'));
const EmployeDashboardPage = lazy(() => import('@/pages/employe/dashboard'));

// ----------------------------------------------------------------------

export default function AppRouter() {
  const dashboardRoutes = [
    
      {
        element: <EmployeNote />,
        path: 'employe-note',
      },
    
    {
      path: '/',
      element: (
        <DashboardLayout>
          <Suspense>
            <Outlet />
          </Suspense>
        </DashboardLayout>
      ),
      children: [
        {
          element: <PrivateRoute>
                  <EmployeDashboardPage />
                </PrivateRoute>,
          path: 'employe-dashboard',
        },
        {
          element: <PrivateRoute>
          <AgentDashboardPage />
        </PrivateRoute>,
          path: 'agent-dashboard',
        },
        {
          element: <PrivateRoute><AdminDashboardPage /></PrivateRoute>,
          path: 'admin-dashboard',
        },
        {
          element: <PrivateRoute><AdminCompte /></PrivateRoute>,
          path: 'admin-compte',
        },
        {
          element: <PrivateRoute><AdminService /></PrivateRoute>,
          path: 'admin-service',
        },
        {
          element: <PrivateRoute><AdminNote /></PrivateRoute>,
          path: 'admin-note',
        },
        {
          element: <PrivateRoute><EmployeTicket /></PrivateRoute>,
          path: 'employe-ticket',
        },
        {
          element: <PrivateRoute><ViewTicket /></PrivateRoute>,
          path: '/employe-ticket/ticket/:ticketId',
        },
        {
          element: <PrivateRoute><AgentTicket /></PrivateRoute>,
          path: 'agent-ticket',
        },
        {
          element: <PrivateRoute><AgentArticle /></PrivateRoute>,
          path: 'agent-article',
        },
        {
          element: <PrivateRoute><ViewArticle /></PrivateRoute>,
          path: '/agent-article/article/:articleId',
        },
        {
          element: <PrivateRoute><ViewTicketAgent /></PrivateRoute>,
          path: '/agent-ticket/ticket/:ticketId',
        },
        {
          path: 'student',
          element: <StudentPage />
        },
        {
          path: 'student/details',
          element: <StudentDetailPage />
        }
      ]
    }
  ];

  const publicRoutes = [
    {
      path: '/login',
      element: <SignInPage />,
      index: true
    },
    {
      path: '/404',
      element: <NotFound />
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />
    }
  ];

  const routes = useRoutes([...dashboardRoutes, ...publicRoutes]);

  return routes;
}
