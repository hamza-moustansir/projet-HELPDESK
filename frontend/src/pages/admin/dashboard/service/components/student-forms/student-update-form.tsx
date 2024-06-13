import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { updateService, getServices } from '@/services/service/serviceSlice';
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

interface ServiceUpdateFormProps {
  isOpen: boolean;
  onClose: () => void;
  service: {
    _id: string;
    name: string;
    responsibleAgent: {
      _id: string;
      name: string;
    };
  } | undefined;
}

const ServiceUpdateForm: React.FC<ServiceUpdateFormProps> = ({ isOpen, onClose, service }) => {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const { users = [] } = useSelector((state: RootState) => state.auth);
  const { services = [] } = useSelector((state: RootState) => state.service);
  const [name, setName] = useState(service?.name || '');
  const [responsibleAgent, setResponsibleAgent] = useState<string>(service?.responsibleAgent?._id || '');

  useEffect(() => {
    dispatch(getUsers());
    dispatch(getServices());
  }, [dispatch]);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!service) return;
    dispatch(updateService({ id: service._id, serviceData: { name, responsibleAgent } }))
      .unwrap()
      .then(() => {
        navigate('/admin-service');
        toast.success('Service mis à jour avec succès !');
        onClose();
      })
      .catch((error) => {
        toast.error(error.message || 'Échec de la mise à jour du service');
      });
  };

  const handleAgentSelect = (value: string) => {
    setResponsibleAgent(value);
  };

  // Filtrer les utilisateurs qui ont le rôle d'agent et ne sont pas responsables d'un service
  const agentUsers = Array.isArray(users) ? users.filter(user => {
    return user.role === 'Agent' && !services.some(srv => srv.responsibleAgent._id === user._id);
  }) : [];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <div className="flex items-center justify-between text-2xl font-bold">
          <Heading title={'Update Service'} description={''} />
        </div>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-x-8 gap-y-4">
            <input
              type="text"
              className="px-4 py-6 shadow-inner drop-shadow-xl"
              id="name"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Entrez le nom du service"
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
                <SelectValue placeholder="Sélectionnez un agent" />
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
              onClick={onClose}
            >
              Annuler
            </Button>
            <Button type="submit" className="rounded-full" size="lg">
              Update
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ServiceUpdateForm;
