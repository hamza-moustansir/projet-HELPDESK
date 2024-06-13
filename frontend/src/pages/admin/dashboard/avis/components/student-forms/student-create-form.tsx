import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createNote } from '@/services/note/noteSlice';
import { RootState, AppDispatch } from '@/redux/store';
import { toast } from 'react-toastify';
import Heading from '@/components/shared/heading';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { getServices } from '@/services/service/serviceSlice';

const ServiceCreateForm = () => {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const [content, setContent] = useState('');
  const [email, setEmail] = useState('');
  const [service, setService] = useState('');
  const services = useSelector((state: RootState) => state.service.services);

  useEffect(() => {
    dispatch(getServices());
  }, [dispatch]);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(createNote({ email, service, content }))
      .unwrap()
      .then(() => {
        navigate('/employe-note');
        toast.success('Votre contenu a été envoyé avec succès!');
      })
      .catch((error) => {
        toast.error(error.message || 'Échec de la création de la note');
      });
  };

  return (
    <section className="bg-white dark:bg-gray-900">
      <div className="py-8 lg:py-16 px-4 mx-auto max-w-screen-md">
        <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-center text-gray-900 dark:text-white">Your Opinion</h2>
        <p className="mb-8 lg:mb-16 font-light text-center text-gray-500 dark:text-gray-400 sm:text-xl">
          
        </p>
        <form onSubmit={onSubmit} className="space-y-8">
          <div>
            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">Your email</label>
            <input type="email" id="email" value={email}
              onChange={(e) => setEmail(e.target.value)} className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 dark:shadow-sm-light" placeholder="name@gmail.com" required />
          </div>
          <div>
            <label htmlFor="service" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">Service</label>
            <select
              name="service"
              id="service"
              value={service}
              onChange={(e) => setService(e.target.value)}
              required
              className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 dark:shadow-sm-light"
            >
              <option value="" disabled>Choisir un service</option>
              {services && services.map((service) => (
                <option key={service._id} value={service._id}>{service.name}</option>
              ))}
            </select>
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="content" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-400">Your content</label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows="6"
              className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg shadow-sm border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
              placeholder="Leave a comment..."
              required
            />
          </div>
          <Button type="submit" className="">
            Envoyer
          </Button>
        </form>
      </div>
    </section>
  );
};

export default ServiceCreateForm;
