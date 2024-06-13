import FileUpload from '@/components/shared/fileupload';
import Heading from '@/components/shared/heading';
import { Button } from '@/components/ui/button';
import { Label } from "@/components/ui/label"
import { register } from '../../../../../../services/auth/authSlice'
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '@/redux/store';
import { toast } from 'react-toastify';
import { useState } from 'react';
import { Dispatch } from '@reduxjs/toolkit';
import { unwrapResult } from '@reduxjs/toolkit';

const StudentCreateForm = ({ modalClose }: { modalClose: () => void }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password2: '',
    role: '',
  });
  const dispatch: Dispatch<unknown> = useDispatch();
  const { name, email, password, password2, role } = formData;

  const navigate = useNavigate();

  const { isLoading } = useSelector((state: RootState) => state.auth);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    if (password !== password2) {
      toast.error('Passwords do not match');
    } else {
      const userData = {
        name,
        email,
        password,
        role,
      };
  
      try {
        const action: AnyAction = await dispatch(register(userData)); 
        const resultAction = unwrapResult(action); 
        const user = resultAction.payload; 
  
        if (user) {
          toast.success(`Registered new user - ${user.name}`);
          navigate('/Admin-compte');
        } else {
          toast.success('New compte created');
          modalClose();
        }
      } catch (error) {
        toast.error('An error occurred while registering the user');
      }
    }
  };
  

  return (
    <div className="px-2">
      <div className="flex items-center justify-center text-2xl font-bold">
        {'<Logo/>'}
      </div>

      <Heading
        title={'Create New Compte'}
        description={
          ""
        }
        className="space-y-2 py-4 text-center"
      />
      
        <form onSubmit={onSubmit} className="space-y-4">
          
          <div className="grid grid-cols-1 gap-x-8 gap-y-4">
          <input
              type='text'
              className=" px-4 py-6 shadow-inner drop-shadow-xl"
              id='name'
              name='name'
              value={name}
              onChange={onChange}
              placeholder='Enter your name'
              required
            />    
            <input
              type='email'
              className=" px-4 py-6 shadow-inner drop-shadow-xl"
              id='email'
              name='email'
              value={email}
              onChange={onChange}
              placeholder='Enter your email'
              required
            />
                      
                  
          </div>
          <div className="grid grid-cols-1 gap-x-8 gap-y-4">
            <input
              type='password'
              className=" px-4 py-6 shadow-inner drop-shadow-xl"
              id='password'
              name='password'
              value={password}
              onChange={onChange}
              placeholder='Enter password'
              required
             /> 
                      
              <input
              type='password'
              className=" px-4 py-6 shadow-inner drop-shadow-xl"
              id='password2'
              name='password2'
              value={password2}
              onChange={onChange}
              placeholder='Confirm password'
              required
            />
          </div>
<h3>choisir le Role:</h3>
          <div className="flex flex-auto gap-x-8 gap-y-4">
          <label>Admin</label>
            <input
              type='radio'
              className='form-control'
              id='role'
              name='role'
              value='Admin'
              onChange={onChange}
              required
            />
            <label>Agents</label>
            <input
              type='radio'
              className='form-control'
              id='role'
              name='role'
              value='Agent'
              onChange={onChange}
              required
            />
            <label>Employe</label>
            <input
              type='radio'
              className='form-control'
              id='role'
              name='role'
              value='Employe'
              onChange={onChange}
              required
            />
          </div>

          <div className="flex items-center justify-center gap-4">
            <Button
              type="button"
              variant="secondary"
              className="rounded-full "
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
