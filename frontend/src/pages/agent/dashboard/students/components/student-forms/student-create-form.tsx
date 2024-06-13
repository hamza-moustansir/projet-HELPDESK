import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createTicket } from '../../../../../../services/tickets/ticketSlice';
import { RootState } from '@/redux/store';
import { toast } from 'react-toastify';
import { Dispatch } from '@reduxjs/toolkit';
import Heading from '@/components/shared/heading';
import { Button } from '@/components/ui/button';

const StudentCreateForm = ({ modalClose }: { modalClose: () => void }) => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [titre, setTitre] = useState('');
  const [description, setDescription] = useState('');
  const [service, setService] = useState('');
  const dispatch: Dispatch<unknown> = useDispatch();
  const navigate = useNavigate();

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(createTicket({ service, titre, description }))
      .unwrap()
      .then(() => {
        navigate('/employe-ticket');
        toast.success('New ticket created!');
        modalClose();
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };

  return (
    <div className="px-2">
      <div className="flex items-center justify-center text-2xl font-bold">
        {'<Logo/>'}
      </div>

      <Heading
        title={'Create New Ticket'}
        description={''}
        className="space-y-2 py-4 text-center"
      />

      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid grid-cols-1 gap-x-8 gap-y-4">
          <input
            type="text"
            className=" px-4 py-6 shadow-inner drop-shadow-xl"
            id="titre"
            name="titre"
            value={titre}
            onChange={(e) => setTitre(e.target.value)}
            placeholder="Enter your titre"
            required
          />
          <input
            type="description"
            className=" px-4 py-6 shadow-inner drop-shadow-xl"
            id="description"
            name="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter your description"
            required
          />
        </div>

        <div className="grid grid-cols-1 gap-x-8 gap-y-4">
          <label htmlFor="service">Choose the service</label>
          <select
            name="service"
            id="service"
            value={service}
            onChange={(e) => setService(e.target.value)}
          >
            <option value="hardware">Hardware</option>
            <option value="software">Software</option>
            <option value="network">Network</option>
          </select>
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

export default StudentCreateForm;
