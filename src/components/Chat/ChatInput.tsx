import { FC,MutableRefObject,useState,KeyboardEvent } from 'react';
import {  IconSend } from '@tabler/icons-react';

interface Props {
  handleSendMessage : () => void;
  userInput: string;
  handleInputChange : (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  textareaRef: MutableRefObject<HTMLTextAreaElement | null>;
}

export const ChatInput: FC<Props> = ({textareaRef,userInput,handleSendMessage,handleInputChange }) => {
    const [isTyping, setIsTyping] = useState<boolean>(false);
     
  return (
    <div className="absolute bottom-0 left-0 w-full border-transparent bg-gradient-to-b from-transparent via-white to-white pt-6 dark:border-white/20 dark:via-[#343541] dark:to-[#343541] md:pt-2">
      <div className="stretch mx-2 mt-4 flex flex-row gap-3 last:mb-2 md:mx-4 md:mt-[52px] md:last:mb-6 lg:mx-auto lg:max-w-3xl">
      <div className="relative mx-2 flex w-full flex-grow flex-col rounded-md border border-black/10 bg-white shadow-[0_0_10px_rgba(0,0,0,0.10)] dark:border-gray-900/50 dark:bg-[#40414F] dark:text-white dark:shadow-[0_0_15px_rgba(0,0,0,0.10)] sm:mx-4">
      <textarea
            ref={textareaRef}
            className="m-0 w-full resize-none border-0 bg-transparent p-0 py-2 pr-8 pl-2 text-black dark:bg-transparent dark:text-white md:py-3 md:pl-4"
            style={{
              resize: 'none',
              bottom: `${textareaRef?.current?.scrollHeight}px`,
              maxHeight: '400px',
              overflow: `${textareaRef.current && textareaRef.current.scrollHeight > 400
                ? 'auto' : 'hidden'
                }`,
            }}
            placeholder={
              ('Type a message or type "/" to select a prompt...') || ''
            }
            value={userInput}
            rows={1}
            onCompositionStart={() => setIsTyping(true)}
            onCompositionEnd={() => setIsTyping(false)}
            onChange={handleInputChange}
          />
          <button
            className="absolute right-2 top-2 rounded-sm p-1 text-neutral-800 opacity-60 hover:bg-neutral-200 hover:text-neutral-900 dark:bg-opacity-50 dark:text-neutral-100 dark:hover:text-neutral-200"
            onClick={handleSendMessage}
          >
            {/* {messageIsStreaming ? (
              <div className="h-4 w-4 animate-spin rounded-full border-t-2 border-neutral-800 opacity-60 dark:border-neutral-100"></div>
            ) : ( */}
              <IconSend size={18} />
            {/* )} */}
          </button>
      </div>
    </div>
    </div>
  );
};
