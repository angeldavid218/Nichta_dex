'use client';
import React, { useMemo } from 'react';
import { useAccount } from '~~/hooks/useAccount';

export default function SwapTokens() {
  const { address: accountAddress } = useAccount();
  const address = useMemo(() => accountAddress, [accountAddress]);
  return (
    <div className="p-3">
      <h2 className="text-xl font-semibold mb-4">Swap Tokens</h2>
      {!address && (
        <p className="text-red-500 text-sm">Please connect your wallet</p>
      )}
      <div className="flex flex-col gap-4">
        <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4">
          <legend className="fieldset-legend">You Paid</legend>
          <div className="flex gap-2">
            <input type="number" className="input" placeholder="0.0" />
            <select className="select">
              <option>ETH</option>
              <option>STRK</option>
            </select>
          </div>
        </fieldset>
        <div className="flex justify-center">
          <button disabled={!address} className="btn btn-primary">
            <svg
              className="w-6 h-6 text-gray-800 dark:text-white"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="m16 10 3-3m0 0-3-3m3 3H5v3m3 4-3 3m0 0 3 3m-3-3h14v-3"
              />
            </svg>
          </button>
        </div>
        <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4">
          <legend className="fieldset-legend">You Received</legend>
          <div className="flex gap-2">
            <input type="number" className="input" placeholder="0.0" disabled />
            <select className="select" disabled>
              <option>STRK</option>
              <option>ETH</option>
            </select>
          </div>
        </fieldset>
        <button disabled={!address} className="btn btn-primary w-full">
          Swap
        </button>
      </div>
    </div>
  );
}
