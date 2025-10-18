"use client"

import { DefaultChatTransport } from 'ai';
import React, { type FC, useEffect, useRef, useState } from 'react';
import { useChat } from '@ai-sdk/react';

interface IChatUIProps {
  api: string
  placeholder?: string
}

const ChatUI: FC<IChatUIProps> = ({
  api,
  placeholder = 'Ask me anything...'
}) => {
  const [ inputChat, setInputChat ] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const { messages, sendMessage, status, error, stop } = useChat({
    transport: new DefaultChatTransport({ api }),
  });
  
  const busy = status === 'submitted' || status === 'streaming';
  
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    if (busy) {
      void stop();
      return;
    }
    
    if (!inputChat.trim().length) return;
    
    void sendMessage({ text: inputChat })
    setInputChat("")
    inputRef.current?.focus()
  }
  
  useEffect( () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      })
    }
  }, [messages] );
  
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-start bg-white dark:bg-zinc-950">
      <div className="w-full max-w-4xl flex flex-col h-full border-x border-zinc-100 shadow-lg">
        
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto px-8 pt-16 pb-32"
        >
          { error && <div className="text-red-500 mb-4">{ error.message }</div> }
        
          { messages.map((message) => {
            const isUser = message.role === "user";
            
            return (
              <div
                key={message.id}
                className={`flex w-full mb-4 if ${
                  isUser ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[75%] rounded-xl px-4 py-2 shadow-md ${
                    isUser
                      ? "bg-blue-500 text-white rounded-br-none"
                      : "bg-gray-200 dark:bg-zinc-800 dark:text-gray-100 rounded-bl-none"
                  }`}
                >
                  {
                    message.parts.map((part, index) => {
                      switch(part.type) {
                        case "text":
                          return (
                            <div key={`${message.id}-${index}`} className="whitespace-pre-wrap">
                              {part.text}
                            </div>
                          )
                        default:
                          return null;
                      }
                    })
                  }
                </div>
              </div>
            )})
          }
          
          { busy && (
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-bule-400" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-300 via-gray-400 to-gray-300 animate-shimmer font-bold">
                Thinking...
              </span>
            </div>
          ) }
        </div>
        
        <form
          className="fixed bottom-0 w-full max-w-4xl left-0 right-0 p-4 mx-auto bg-zinc-50 dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-800 shadow-lg"
          onSubmit={ handleSubmit }
        >
          <div className="flex gap-2">
            <input
              className="flex-1 dark:bg-zinc-800 p-2 border border-zinc-300 dark:border-zinc-700 rounded shadow-xl"
              ref={inputRef}
              value={ inputChat }
              onChange={ (e: React.ChangeEvent<HTMLInputElement>) => setInputChat(e.target.value) }
              placeholder={ placeholder }
            />
            <button
              type="submit"
              className={ `px-4 py-2 rounded transition-colors shadow-xl text-white
                ${ busy
                  ? "bg-red-500 hover:bg-red-600"
                  : inputChat.trim().length
                    ? "bg-blue-500 hover:bg-blue-600"
                    : "bg-gray-400 cursor-not-allowed"
                }`}
              disabled={busy ? false : !inputChat.trim().length}
            >
              {busy ? <span>&#9725;</span> : <span>&#9654;</span>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatUI;
