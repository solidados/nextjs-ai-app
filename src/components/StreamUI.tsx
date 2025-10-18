"use client"

import { FC } from 'react';
import { useChatCompletion } from '@/hooks/useChatCompletion';

interface IStreamUIProps {
  api: string
  placeholder?: string
}

const StreamUI: FC<IStreamUIProps> = ({
  api,
  placeholder = 'Ask me anything...'
}) => {
  const {
    input,
    completion,
    isLoading,
    error,
    handleInputChange,
    submitHandler,
  } = useChatCompletion(api)
  
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-start bg-white dark:bg-zinc-950">
      <div className="w-full max-w-4xl flex flex-col h-full border-x border-zinc-100 shadow-lg">
        <div className="flex-1 overflow-y-auto px-8 pt-16 pb-32">
          { error && <div className="text-red-500 mb-4">{ error.message }</div> }
          { isLoading && !completion && (
            <div
              className="text-transparent bg-clip-text bg-gradient-to-r from-gray-300 via-gray-400 to-gray-300 animate-shimmer font-bold"
            >
              Thinking...
            </div>
          ) }
          { completion && (
            <div className="whitespace-pre-wrap">{ completion }</div>
          ) }
        </div>
        <form
          className="fixed bottom-0 w-full max-w-4xl left-0 right-0 p-4 mx-auto bg-zinc-50 dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-800 shadow-lg"
          onSubmit={ submitHandler }
        >
          <div className="flex gap-2">
            <input
              className="flex-1 dark:bg-zinc-800 p-2 border border-zinc-300 dark:border-zinc-700 rounded shadow-xl"
              value={ input }
              onChange={ handleInputChange }
              placeholder={ placeholder }
            />
            <button
              type="submit"
              className={
                `px-4 py-2 rounded transition-colors shadow-xl
              ${ isLoading
                  ? "bg-red-500 hover:bg-red-600"
                  : input.trim().length
                    ? "bg-blue-500 hover:bg-blue-600"
                    : "bg-gray-400 cursor-not-allowed"
                }
              text-white
              ` }
              disabled={ !isLoading && !input.trim().length }
            >
              { isLoading ? "Stop" : "Send" }
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StreamUI;
