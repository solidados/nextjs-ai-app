"use client"

import React, { useState } from 'react';

const CompletionPage = () => {
  const [ prompt, setPrompt ] = useState<string>(""); // user input
  const [ completion, setCompletion ] = useState<string>(""); // AI response
  const [ isLoading, setIsLoading ] = useState<boolean>(false);
  const [ error, setError ] = useState<string | null>(null);
  
  const complete = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setPrompt("");
    setError(null);
    
    try {
      const response = await fetch("/api/completion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Something went wrong");
      }
      
      setCompletion(data.text);
    } catch (error) {
      console.error("Error:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setIsLoading(false)
    }
  };
  
  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPrompt(e.target.value);
  }
  return (
    <div className="fixed top-10 mx-auto left-0 right-0 max-w-4xl mx-auto border rounded border-zinc-100 h-[100vh] px-8 shadow-lg">
    <div className="flex flex-col w-full max-w-4xl pt-16 pb-24 mx-auto stretch">
      {error && <div className="text-red-500 mb-4">{error}</div>}
      {isLoading ? (
        <div className="text-transparent bg-clip-text bg-gradient-to-r from-gray-300 via-gray-400 to-gray-300 animate-shimmer">Loading...</div>
      ) : completion ? (
        <div className="whitespace-pre-wrap">{completion}</div>
      ) : null}
      <form
        className="fixed bottom-0 w-full max-w-4xl mx-auto left-0 right-0 p-4 bg-zinc-50 dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-800 shadow-lg"
        onSubmit={complete}
      >
        <div className="flex gap-2">
          <input
            className="flex-1 dark:bg-zinc-800 p-2 border border-zinc-300 dark:border-zinc-700 rounded shadow-xl"
            type="text"
            value={prompt}
            onChange={handleOnChange}
            placeholder="What can I help you with?" />
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            type="submit"
            disabled={isLoading}
          >
            Send
          </button>
        </div>
      </form>
    </div>
    </div>
  );
};

export default CompletionPage;
