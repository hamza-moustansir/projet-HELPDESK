import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getChatMessages, sendChatMessage } from '../../../../../services/tickets/ticketSlice';
import { RootState } from '@/redux/store';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface ChatComponentProps {
  ticketId: string;
}

const ChatComponent: React.FC<ChatComponentProps> = ({ ticketId }) => {
  const dispatch = useDispatch();
  const chatMessages = useSelector((state: RootState) => state.tickets.chatMessages);
  const [message, setMessage] = useState('');
  const userId = useSelector((state: RootState) => state.auth.user?._id); // Assuming you have a user ID in the auth state

  useEffect(() => {
    dispatch(getChatMessages(ticketId));
  }, [dispatch, ticketId]);

  const handleSendMessage = () => {
    if (message.trim()) {
      dispatch(sendChatMessage({ ticketId, message }));
      setMessage('');
    }
  };

  if (!chatMessages) {
    return <div>Loading...</div>; // Afficher un indicateur de chargement si les messages de chat sont null
  }

  return (
    <>
        <div className="max-h-96 overflow-y-auto p-4 bg-white rounded shadow-inner space-y-2">
          {chatMessages.map((msg) => (
            <div
              key={msg._id}
              className={`p-2 border-b border-gray-200 ${msg.sender._id === userId ? 'text-right' : 'text-left'}`}
            >
              <div className={`inline-block p-2 rounded ${msg.sender._id === userId ? 'bg-blue-100' : 'bg-gray-100'}`}>
                <span>{msg.message}</span><strong className="text-black">:{msg.sender.name}   </strong> 
              </div>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2 p-3">
          <Input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="flex-1"
            placeholder="Type your message..."
          />
          <Button onClick={handleSendMessage} >Envoyer</Button>
        </div>
        </>
  );
};

export default ChatComponent;

