import { Message } from '@/types/chat';
import {
    FC,
    memo,
    useEffect,
    useRef,
    useState,
    ChangeEvent,
    SetStateAction,
    Dispatch
  } from 'react';
import { ChatInput } from './ChatInput';
import { ChatMessage } from './ChatMessage';
  interface Props {
    loading: boolean;
    apiKey: string;
    setLightMode:Dispatch<SetStateAction<"dark" | "light">>;
  }
  export const Chat: FC<Props> = memo(({apiKey})=>{
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [currentMessage, setCurrentMessage] = useState<string>("");
    const [userInput, setUserInput] = useState<string>('');

  const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setUserInput(e.target.value);
  };

  const handleSendMessage = () => {
    sendMessageToServer(userInput);
    setUserInput(''); // Clear the input field
  };

  const sendMessageToServer = async (message: string) => {
    try {
      setMessages(prevMessages => [...prevMessages, { user: 'You', text: message }]);
      await fetch('http://chat-app-load-balancer-381258406.us-east-1.elb.amazonaws.com/send-message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message })
      });
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  useEffect(() => {
    const eventSource = new EventSource('http://chat-app-load-balancer-381258406.us-east-1.elb.amazonaws.com/chat');
    eventSource.onmessage = function(event) {
      const newMessage: Message = JSON.parse(event.data);

      if (newMessage.text) {
        const words = newMessage.text.split(' ');
        let displayedMessage = "";

        const renderMessage = () => {
          if (words.length) {
            displayedMessage += (displayedMessage ? ' ' : '') + words.shift();
            setCurrentMessage(displayedMessage);
            setTimeout(renderMessage, 150); // Adjust time as needed
          } else {
            setMessages(prevMessages => [...prevMessages, newMessage]);
            setCurrentMessage("");
          }
        };
        renderMessage();
      }
    };

    return () => {
      eventSource.close();
    };
  }, []);

  return (
    <>       
        <div className="relative flex-1 overflow-hidden bg-white dark:bg-[#343541]">
          {messages.map((message, index) => (            
            <ChatMessage
                      key={index}
                      message={message}
                      messageIndex={index}                    
                    />
          ))}
          <ChatMessage                      
                      message={{user:"AI",text:currentMessage}}
                      messageIndex={messages.length}                    
                    />          
        </div>
      <ChatInput textareaRef={textareaRef} handleInputChange={handleInputChange} userInput={userInput} handleSendMessage={handleSendMessage}/>
    </>
  );
  })

  Chat.displayName = 'Chat';