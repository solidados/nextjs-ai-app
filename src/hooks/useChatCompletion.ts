import React, { useCallback } from 'react';
import { useCompletion } from '@ai-sdk/react';

export const useChatCompletion = (api: string) => {
  const {
    input,
    handleInputChange,
    handleSubmit,
    completion,
    isLoading,
    error,
    setInput,
    stop
  } = useCompletion({ api })
  
  const submitHandler = useCallback((e: React.FormEvent) => {
    e.preventDefault()
    
    if (isLoading) {
      stop()
      return
    }
    
    if(!input.trim().length) return
    
    handleSubmit(e)
    setInput('')
  }, [handleSubmit, input, isLoading, setInput, stop])
  
  return {
    input,
    completion,
    isLoading,
    error,
    handleInputChange,
    submitHandler,
  }
};
