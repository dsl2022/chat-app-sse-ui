import {useState } from 'react';
import { Chat } from './components/Chat';

function App() {
  const [lightMode, setLightMode] = useState<'dark' | 'light'>('dark');
  
  return (
    <div>
      <main
          className={`flex h-screen w-screen flex-col text-sm text-white dark:text-white ${lightMode}`}
        >
         <div className="flex h-full w-full pt-[48px] sm:pt-0">
      <div className="flex flex-1">
      <Chat loading={true} setLightMode={setLightMode} apiKey={"test"}/>
      </div>
      </div>
      </main>
    </div>
  );
}

export default App;
