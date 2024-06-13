import React, { useState, useEffect } from 'react';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import ticketService from '../../../../services/tickets/ticketService';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

export default function Overview() {
  const [monthlyTicketStats, setMonthlyTicketStats] = useState([]);
  const user = useSelector((state: RootState) => state.auth.user);
  const [serviceId, setServiceId] = useState(""); 

  // Fetch the serviceId for the agent
  useEffect(() => {
    const fetchServiceId = async () => {
      try {
        if (user) {
          const response = await ticketService.getServiceByAgent(user.token || "");
          const serviceId = response.serviceId; 
          setServiceId(serviceId);
        }
      } catch (error) {
        console.error('Failed to fetch service ID', error);
      }
    };
    fetchServiceId();
  }, [user]);

  useEffect(() => {
    const fetchMonthlyTicketStats = async () => {
      try {
        if (serviceId && user) {
          const agentId = user._id;
          const stats = await ticketService.getMonthlyTicketStatsByAgent(agentId, serviceId, user?.token || "");
          setMonthlyTicketStats(stats);
        }
      } catch (error) {
        console.error('Error fetching ticket stats:', error);
      }
    };

    fetchMonthlyTicketStats();
  }, [serviceId, user]);

  // Créer un tableau avec les noms de tous les mois de l'année
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  // Fusionner les données de statistiques des tickets avec les mois de l'année
  const mergedData = months.map(month => {
    const foundStat = monthlyTicketStats.find(stat => stat.name === month);
    return {
      name: month,
      total: foundStat ? foundStat.totalClosed : 0 
    };
  });

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={mergedData}>
        <XAxis
          dataKey="name"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={14}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${value}`}
        />
        <Bar dataKey="total" fill="#adfa1d" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
