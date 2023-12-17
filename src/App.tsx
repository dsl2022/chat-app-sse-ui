import React, { useEffect, useState, ChangeEvent } from 'react';
import './App.css';

// Define the structure of a message
interface Message {
  user: string;
  text: string;
}

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentMessage, setCurrentMessage] = useState<string>("");
  const [userInput, setUserInput] = useState<string>('');

  // Handle input change with proper event type
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUserInput(e.target.value);
  };

  const handleSendMessage = () => {
    sendMessageToServer(userInput);
    setUserInput(''); // Clear the input field
  };

  const sendMessageToServer = async (message: string) => {
    try {
      setMessages(prevMessages => [...prevMessages, { user: 'You', text: message }]);
      const response = await fetch('http://chat-app-load-balancer-381258406.us-east-1.elb.amazonaws.com/send-message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message })
      });
      // const data = await response.json();
      // Code to handle AI's response (currently commented out)
      // setMessages(prevMessages => [...prevMessages, { user: 'AI', text: data.reply }]);
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
            setTimeout(renderMessage, 200); // Adjust time as needed
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
    <div className="App">
      <header className="App-header">
        <h1>Chat Messages</h1>
        <div className="message-container">
          {messages.map((message, index) => (
            <div key={index}>{message.user}: {message.text}</div>
          ))}
          <div>{currentMessage}</div>
        </div>
      </header>
      <div>
        <input type="text" value={userInput} onChange={handleInputChange} />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
}

export default App;
