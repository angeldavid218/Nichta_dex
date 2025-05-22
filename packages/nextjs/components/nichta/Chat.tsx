'use client';
import React, { useState } from 'react';

interface Strategy {
  id: number;
  name: string;
  description: string;
}

export default function Chat() {
  const [strategies, setStrategies] = useState<Strategy[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const getCompletions = async (message: string) => {
    setIsLoading(true);
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'o4-mini',
        messages: [{ role: 'user', content: message }],
      }),
    });
    const data = await response.json();
    const strategy = data.choices[0].message.content;
    const strategySet: Strategy = {
      id: strategies.length + 1,
      name: `Strategy ${strategies.length + 1}`,
      description: strategy,
    };
    setStrategies((prev) => [...prev, strategySet].reverse());
    setIsLoading(false);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const message = formData.get('message') as string;
    getCompletions(message);
    e.currentTarget.reset();
  };

  return (
    <div className="p-3">
      <h2 className="text-xl font-semibold mb-4">Chat</h2>
      <form onSubmit={handleSubmit}>
        <input
          disabled={isLoading}
          className="input input-info"
          type="text"
          name="message"
          placeholder="Send message"
          required
        />
        <button className="btn btn-neutral" type="submit" disabled={isLoading}>
          {isLoading ? 'Loading...' : 'Send'}
        </button>
      </form>
      <div className="flex flex-col gap-2 mt-4 overflow-y-auto h-[300px]">
        {isLoading && (
          <div className="flex flex-col gap-2">
            <div className="skeleton h-32 w-full"></div>
            <div className="skeleton h-32 w-full"></div>
            <div className="skeleton h-32 w-full"></div>
            <div className="skeleton h-32 w-full"></div>
          </div>
        )}
        {!isLoading && strategies.length === 0 && <p>No strategies yet</p>}
        {!isLoading &&
          strategies.length > 0 &&
          strategies.map((strategy, index) => (
            <fieldset
              key={index}
              className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-5"
            >
              <legend className="fieldset-legend text-sm">
                {strategy.name}
              </legend>
              <span className="text-sm">{strategy.description}</span>
            </fieldset>
          ))}
      </div>
    </div>
  );
}
