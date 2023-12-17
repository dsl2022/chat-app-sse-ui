import React, { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState("");
  // State for the user's input
  const [userInput, setUserInput] = useState('');

  // Handle input change
  const handleInputChange = (e) => {
      setUserInput(e.target.value);
  };

  // Handle sending message
  const handleSendMessage = () => {
      sendMessageToServer(userInput);
      setUserInput(''); // Clear the input field
  };
  const sendMessageToServer = async (message) => {
    try {
        setMessages(prevMessages => [...prevMessages, { user: 'You', text: message }]);
        const response = await fetch('http://chat-app-load-balancer-381258406.us-east-1.elb.amazonaws.com/send-message', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message })
        });
        const data = await response.json();
        // Add AI's response to messages
        // setMessages(prevMessages => [...prevMessages, { user: 'AI', text: data.reply }]);
    } catch (error) {
        console.error('Error sending message:', error);
    }
};


  useEffect(() => {
    const eventSource = new EventSource('http://chat-app-load-balancer-381258406.us-east-1.elb.amazonaws.com/chat');
    eventSource.onmessage = function(event) {
        const newMessage = JSON.parse(event.data);
        
        if (newMessage.text) {
        // Split the message into words
        const words = newMessage.text.split(' ');
        let displayedMessage = "";

        // Function to render message word by word
        const renderMessage = () => {
            if (words.length) {
                displayedMessage += (displayedMessage ? ' ' : '') + words.shift();
                setCurrentMessage(displayedMessage);

                // Schedule the next word
                setTimeout(renderMessage, 200); // Adjust time as needed
            } else {
                // Message fully displayed, add it to the messages list
                console.log({newMessage})
                setMessages(prevMessages => [...prevMessages, newMessage]);
                setCurrentMessage("");
            }
        };

        renderMessage();
      }
    };
// console.log(messages)
// console.log({currentMessage})
    return () => {
        eventSource.close();
    };
}, []);

  // useEffect(() => {
  //   const eventSource = new EventSource('http://localhost:3000/chat');
  //   eventSource.onmessage = function(event) {
  //     const newMessage = JSON.parse(event.data);
  //     console.log({newMessage})
  //     setMessages(prevMessages => [...prevMessages, newMessage]);
  //   };

  //   return () => {
  //     eventSource.close();
  //   };
  // }, []);
console.log({messages})
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
