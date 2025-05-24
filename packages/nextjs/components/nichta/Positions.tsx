import React from "react";

export default function Positions() {
  return (
    <div className="overflow-x-auto">
      <table className="table">
        {/* head */}
        <thead>
          <tr>
            <th></th>
            <th>Pool</th>
            <th>Date</th>
            <th>Total liquidity provided</th>
            <th>Shares</th>
            <th>Trade value</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colSpan={6}>No positions found</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
