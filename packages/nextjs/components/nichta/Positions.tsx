import React from 'react';

export default function Positions() {
  const dummyPositions = [
    {
      id: 1,
      pool: 'STRK/ETH',
      date: '2025-05-24',
      liquidity: '1,250.50 STRK',
      shares: '1,200.75',
      value: '$2,450.25',
    },
    {
      id: 2,
      pool: 'ETH/USDC',
      date: '2025-05-20',
      liquidity: '2.5 ETH',
      shares: '1,850.50',
      value: '$8,750.75',
    },
    {
      id: 3,
      pool: 'STRK/USDT',
      date: '2025-05-15',
      liquidity: '5,000.75 STRK',
      shares: '4,500.25',
      value: '$4,250.50',
    },
    {
      id: 4,
      pool: 'BTC/ETH',
      date: '2025-05-10',
      liquidity: '0.05 BTC',
      shares: '850.75',
      value: '$3,250.25',
    },
  ];
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
          {dummyPositions.map((position, index) => (
            <tr key={position.id} className="hover:bg-base-200">
              <td>{index + 1}</td>
              <td className="font-medium">{position.pool}</td>
              <td>{position.date}</td>
              <td>{position.liquidity}</td>
              <td>{position.shares}</td>
              <td>{position.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
