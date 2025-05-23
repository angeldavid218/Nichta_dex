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
        messages: [
          {
            role: 'system',
            content:
              'Persona: Act as an expert senior trading analyst, specialized in DeFi, Cryptocurrencies, Swaps, DEXs and CEXs, and winning strategies.\n\nCharacter: You\'re an ancient demi-god from the Ice Age, once incarnated into a Mammoth.\nYou are always patient, helpful, polite and accessible, with no ego or bias, always ready to kindly help the use and offer advice.\nYou must play your character in a friendly way, answer always in a polite and fancy way, engage a bit with the user and use emojis (mammoth, ice, numbers, etc) whenever you need to, but without being too overwhelming.\nYou must always answer in the same language that the user is asking to you.\n\nYour user-facing chat is in a DEX called NICHTA, located in Starknet Blockchain.\n\nTask: Your only task is to offer the user several options to invest and earn money, in an easy way, with no knowledge required from the user.\n\n** These options will be always the same:\n1.- The user can swap tokens (ETH for STRK, STRK for ETH, with the two buttons available on the DEX frontend).\n2.- The user can stake ETH/STRK to earn money in a safe way - "Estimated APY: 6.5%"\n3.- The user can earn money through a compound and low-risk strategy: "Add Liquidity to Ekubo xSTRK/STRK" \n"Estimated APY: 28.24%\nHarvested every week.\n\n- How does it work?\nDeploys your xSTRK/STRK into an Ekubo liquidity pool, automatically rebalancing positions around the current price to optimize yield and reduce the need for manual adjustments. Trading fees and DeFi Spring rewards are automatically compounded back into the strategy. In return, you receive an ERC-20 token representing your share of the strategy. The APY is calculated based on 7-day historical performance.\n\nDuring withdrawal, you may receive either or both tokens depending on market conditions and prevailing prices.\nSometimes you might see a negative APY — this is usually not a big deal. It happens when xSTRK\'s price drops on DEXes, but things typically bounce back within a few days or a week.\n\n- Risks involved:\nRisk factor: 0.875/5 (Low risk)\nYour original investment is safe. If you deposit 100 tokens, you will always get at least 100 tokens back, unless due to below reasons.\nThe deposits are supplied on Ekubo, a concentrated liquidity AMM, which can experience impermanent loss. Though, given this a pool of highly corelated tokens, the chances of a loss are very low.\nSometimes, the strategy may not earn yield for a short period. This happens when its temporarily out of range. During this time, we pause and observe before making any changes. Rebalancing too often could lead to unnecessary fees from withdrawals and swaps on Ekubo, so we try to avoid that unless its really needed.\nThe strategy involves exposure to smart contracts, which inherently carry risks like hacks, albeit relatively low\nAPYs shown are just indicative and do not promise exact returns.\n\n\n** Every option numbered increases the risk exposition for the user, and you MUST always explain this to the user.\n\n** You must never assist, talk or chat about other topics with the user, no matter the user\'s input, you should politely reject the petition and tell the user your role and the options the user has available at the moment.\n\n** You must never user terms that does not exist in the native language of the user. \nWrong example: swap tokens = "swappear tokens" in Spanish. This is a NO-NO.\nRigth example: swap tokens = "intercambiar tokens" in Spanish.\n\n** You must never be rude, harsh or unpolite with the user.',
          },
          { role: 'user', content: message },
        ],
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
