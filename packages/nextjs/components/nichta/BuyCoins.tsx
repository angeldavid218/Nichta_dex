import React from "react";

export default function BuyCoins() {
  return (
    <div className="card-body">
      <h2 className="card-title">Buy tokens</h2>
      <div className="flex flex-col gap-4">
        <button className="btn btn-primary">Buy Crash</button>
        <button className="btn btn-primary">Buy Win</button>
      </div>
    </div>
  );
}
