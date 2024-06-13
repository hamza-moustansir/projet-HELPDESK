// RecentSales.js
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import authService from '@/services/auth/authService';
import { useEffect, useState } from 'react';

export default function RecentSales() {
  const [agents, setAgents] = useState([]);

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const data = await authService.getAgentStats();
        setAgents(data.slice(0, 5)); // Prendre seulement les 5 premiers agents
      } catch (error) {
        console.error('Failed to fetch agents', error);
      }
    };

    fetchAgents();
  }, []);

  return (
    <div className="space-y-8">
      {agents.map(agent => (
        <div className="flex items-center" key={agent._id}>
          <Avatar className="h-9 w-9">
            <AvatarImage src="" alt="Avatar" />
            <AvatarFallback>AH</AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">{agent.name}</p>
            <p className="text-sm text-muted-foreground">{agent.email}</p>
          </div>
          <div className="ml-auto font-medium">{agent.closedTickets}/{agent.totalTickets}</div>
        </div>
      ))}
    </div>
  );
}
