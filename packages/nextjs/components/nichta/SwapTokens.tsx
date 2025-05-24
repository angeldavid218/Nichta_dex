"use client";
import React, { useEffect, useMemo, useState } from "react";
import { useAccount } from "~~/hooks/useAccount";

import { Provider, Contract, uint256 } from "starknet";

export default function SwapTokens() {
  const [amountIn, setAmountIn] = useState(""); // STRK que pone el user
  const [amountOut, setAmountOut] = useState<number>(); // ETH resultante
  const [txHash, setTxHash] = useState<string>();
  const [loading, setLoading] = useState(false);

  /* ---------- Constantes de red ---------- */
  const RPC_URL = "https://starknet-sepolia.public.blastapi.io/rpc/v0_7";
  const provider = new Provider({ nodeUrl: RPC_URL });

  const ORACLE =
    "0x36031daa264c24520b11d93af622c848b2499b66b41d611bac95e13cfca131a";
  const ETH_USD = "19514442401534788";
  const STRK_USD = "6004514686061859652";

  const POOL =
    "0x004bb1c38e8eceb339b96a46c1de40620cc99f458b480a3a91dd3609ef09d0a8";
  const ETH_TOKEN =
    "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7";
  const STRK_TOKEN =
    "0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d";

  /* Contratos */
  const POOL_ADDR =
    "0x004bb1c38e8eceb339b96a46c1de40620cc99f458b480a3a91dd3609ef09d0a8";
  const STRK_ADDR =
    "0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d";
  const ETH_ADDR =
    "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7";

  /* ABIs mínimos — solo las funciones que usamos */
  const poolAbi = [
    {
      name: "get_amount_out",
      type: "function",
      inputs: [
        { name: "token_in_address_query", type: "felt" },
        { name: "amount_in_query_low", type: "felt" },
        { name: "amount_in_query_high", type: "felt" },
      ],
      outputs: [{ name: "amount_out", type: "u256" }],
      stateMutability: "view",
    },
    {
      name: "swap",
      type: "function",
      inputs: [
        { name: "token_in_address", type: "felt" },
        { name: "amount_in_low", type: "felt" },
        { name: "amount_in_high", type: "felt" },
        { name: "min_amount_out_low", type: "felt" },
        { name: "min_amount_out_high", type: "felt" },
      ],
      outputs: [{ name: "amount_out", type: "u256" }],
      stateMutability: "external",
    },
  ];

  const erc20Abi = [
    {
      name: "approve",
      type: "function",
      inputs: [
        { name: "spender", type: "felt" },
        { name: "amount_low", type: "felt" },
        { name: "amount_high", type: "felt" },
      ],
      outputs: [],
      stateMutability: "external",
    },
    {
      name: "decimals",
      type: "function",
      inputs: [],
      outputs: [{ name: "dec", type: "felt" }],
      stateMutability: "view",
    },
  ];

  /* ───── helpers ───── */
  const pool = new Contract(poolAbi, POOL_ADDR, provider);
  const erc20 = new Contract(erc20Abi, STRK_ADDR, provider);

  /* convierte ether-style string ("1.23") → u256 (18 dec.) */
  const toUint256 = (amount: string) =>
    uint256.bnToUint256(BigInt(Math.round(parseFloat(amount) * 1e18)));

  /* u256 -> JS number (18 dec.)  (ojo overflow si > 1e18 ETH) */
  const fromUint256 = (u: { low: string; high: string }) =>
    Number(uint256.uint256ToBN(u)) / 1e18;

  /* ───── UI ───── */
  const { address: accountAddress, account } = useAccount();
  const address = useMemo(() => accountAddress, [accountAddress]);

  useEffect(() => {
    if (!amountIn || Number(amountIn) <= 0) return setAmountOut(0);
    const run = async () => {
      try {
        const pool = new Contract(poolAbi, POOL_ADDR, provider);
        console.log(amountIn);
        const amountInU256 = toUint256(amountIn);
        const res = await pool.get_amount_out(
          STRK_ADDR,
          amountInU256.low,
          amountInU256.high,
        );
        setAmountOut(fromUint256(res.amount_out));
      } catch (e) {
        console.error(e);
        setAmountOut(0);
      }
    };
    run();
  }, [amountIn]);

  const handleSwap = async () => {
    setLoading(true);
    if (!address || !amountIn || !amountOut) return alert("Cantidad inválida");

    const strk = new Contract(erc20Abi, STRK_ADDR, account);
    const pool = new Contract(poolAbi, POOL_ADDR, account);

    const amountInU256 = toUint256(amountIn);
    const minAmountOutU256 = toUint256((amountOut * 0.99).toString()); // 1 % slippage

    try {
      /* 1) approve STRK */
      const { transaction_hash: h1 } = await strk.approve(
        POOL_ADDR,
        amountInU256.low,
        amountInU256.high,
      );
      console.log("approve tx:", h1);
      await account?.waitForTransaction(h1);
      /* 2) swap */
      const { transaction_hash: h2 } = await pool.swap(
        STRK_ADDR,
        amountInU256.low,
        amountInU256.high,
        minAmountOutU256.low,
        minAmountOutU256.high,
      );
      console.log("swap tx:", h2);
      setTxHash(h2);
      await account?.waitForTransaction(h2);
      alert("Swap completed");
    } catch (e) {
      console.error(e);
      alert("Tx Error");
    } finally {
      setLoading(false);
    }
  };

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
            <input
              type="number"
              value={amountIn}
              onChange={(e) => setAmountIn(e.target.value)}
              className="input"
              placeholder="0.0"
            />
            <select className="select">
              {/*     <option>ETH</option> */}
              <option>STRK</option>
            </select>
          </div>
        </fieldset>
        <div className="flex justify-center">
          <button
            disabled={!address || loading}
            onClick={handleSwap}
            className="btn btn-primary"
          >
            {loading ? "Swapping..." : "Swap"}
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
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m16 10 3-3m0 0-3-3m3 3H5v3m3 4-3 3m0 0 3 3m-3-3h14v-3"
              />
            </svg>
          </button>
        </div>
        <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4">
          <legend className="fieldset-legend">You Received</legend>
          <div className="flex gap-2">
            <input
              type="number"
              className="input"
              value={amountOut?.toFixed(6)}
              placeholder="0.0"
              disabled
            />
            <select className="select" disabled>
              {/*     <option>STRK</option> */}
              <option>ETH</option>
            </select>
          </div>
        </fieldset>

        {txHash && (
          <div className="text-xs mt-3 break-all">Tx hash: {txHash}</div>
        )}
      </div>
    </div>
  );
}
