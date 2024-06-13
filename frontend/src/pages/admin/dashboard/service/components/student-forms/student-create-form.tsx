import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createService, getServices } from '@/services/service/serviceSlice';
import { RootState, AppDispatch } from '@/redux/store';
import { toast } from 'react-toastify';
import Heading from '@/components/shared/heading';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getUsers } from '@/services/auth/authSlice';

const ServiceCreateForm = ({ modalClose }: { modalClose: () => void }) => {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const { users = [] } = useSelector((state: RootState) => state.auth);
  const { services = [] } = useSelector((state: RootState) => state.service);
  const [name, setName] = useState('');
  const [responsibleAgent, setResponsibleAgent] = useState<string>('');

  useEffect(() => {
    dispatch(getUsers());
    dispatch(getServices());
  }, [dispatch]);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(createService({ name, responsibleAgent }))
      .unwrap()
      .then(() => {
        navigate('/admin-service');
        toast.success('New service created!');
        modalClose();
      })
      .catch((error) => {
        toast.error(error.message || 'Failed to create service');
      });
  };

  const handleAgentSelect = (value: string) => {
    setResponsibleAgent(value);
  };

  // Filtrer les utilisateurs qui ont le rôle d'agent et ne sont pas responsables d'un service
  const agentUsers = Array.isArray(users) ? users.filter(user => {
    return user.role === 'Agent' && !services.some(service => service.responsibleAgent._id === user._id);
  }) : [];

  return (
    <div className="px-2">
      <div className="flex items-center justify-center text-2xl font-bold">
        {'<Logo/>'}
      </div>

      <Heading
        title={'Create New Service'}
        description={''}
        className="space-y-2 py-4 text-center"
      />

      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid grid-cols-1 gap-x-8 gap-y-4">
          <input
            type="text"
            className="px-4 py-6 shadow-inner drop-shadow-xl"
            id="name"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter the service name"
            required
          />
        </div>

        <div className="grid grid-cols-1 gap-x-8 gap-y-4">
          <label htmlFor="responsibleAgent">Choose the Responsible Agent</label>
          <Select
            value={responsibleAgent}
            onValueChange={handleAgentSelect}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select agent" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Agents</SelectLabel>
                {agentUsers.map((user) => (
                  <SelectItem key={user._id} value={user._id}>
                    {user.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center justify-center gap-4">
          <Button
            type="button"
            variant="secondary"
            className="rounded-full"
            size="lg"
            onClick={modalClose}
          >
            Cancel
          </Button>
          <Button type="submit" className="rounded-full" size="lg">
            Create
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ServiceCreateForm;
