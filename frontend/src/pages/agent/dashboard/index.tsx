import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Overview from './components/overview';
import RecentSales from './components/recent-sales';
import ticketService from '@/services/tickets/ticketService';
import { RootState } from '@/redux/store';
import { useSelector } from 'react-redux';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import PageHead from '@/components/shared/page-head';

export default function DashboardPage() {
  const user = useSelector((state: RootState) => state.auth.user);
  const [serviceId, setServiceId] = useState(""); 
  
  const [stats, setStats] = useState({
    totalTickets: 0,
    ticketNew: 0, 
    ticketClosed: 0,
    totalClosedCurrentMonth: 0,
  });

  // Fetch the serviceId for the agent
  useEffect(() => {
    const fetchServiceId = async () => {
      try {
        if (user) {
          const response = await ticketService.getServiceByAgent(user.token || "");
          const serviceId = response.serviceId; // Assurez-vous que c'est bien l'objet retourné par votre API
          setServiceId(serviceId);
        }
      } catch (error) {
        console.error('Failed to fetch service ID', error);
      }
    };
    fetchServiceId();
  }, [user]);

  // Fetch ticket stats once serviceId is available
  useEffect(() => {
    const fetchStats = async () => {
      try {
        if (serviceId && user) {
          const agentId = user._id;
          const data = await ticketService.getTicketStatsByAgentAndService(agentId, serviceId, user.token || "");
          setStats({
            totalTickets: data.totalTickets,
            ticketNew: data.ticketNew,
            ticketClosed: data.ticketClosed,
            totalClosedCurrentMonth: data.totalClosedCurrentMonth,
          });
        }
      } catch (error) {
        console.error('Failed to fetch ticket stats', error);
      }
    };

    fetchStats();
  }, [serviceId, user]);

  const [userName, setUserName] = useState('');
  useEffect(() => {
    if (user) {
      setUserName(user.name);
    }
  }, [user]);

  return (
    <>
      <PageHead title="Dashboard | App" />
      <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">
            Hi, Welcome back {userName} 👋
          </h2>
        </div>
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Tickets</CardTitle>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="h-4 w-4 text-muted-foreground"
                  >
                    <rect width="20" height="14" x="2" y="5" rx="2" />
                    <path d="M2 10h20" />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalTickets}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Ticket Open</CardTitle>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="h-4 w-4 text-muted-foreground"
                  >
                    <rect width="20" height="14" x="2" y="5" rx="2" />
                    <path d="M2 10h20" />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.ticketNew}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Ticket Closed</CardTitle>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="h-4 w-4 text-muted-foreground"
                  >
                    <rect width="20" height="14" x="2" y="5" rx="2" />
                    <path d="M2 10h20" />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.ticketClosed}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Ticket/Mois</CardTitle>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="h-4 w-4 text-muted-foreground"
                  >
                    <rect width="20" height="14" x="2" y="5" rx="2" />
                    <path d="M2 10h20" />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalClosedCurrentMonth}</div>
                  <p className="text-xs text-muted-foreground">
                    Ticket traiter par ce mois
                  </p>
                </CardContent>
              </Card>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-7 ">
              <Card className="col-span-4 ">
                <CardHeader>
                  <CardTitle>Totale Tickets traité par Mois</CardTitle>
                </CardHeader>
                <CardContent className="pl-2">
                  <Overview />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
