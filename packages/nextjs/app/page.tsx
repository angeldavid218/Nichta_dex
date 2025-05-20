import Link from 'next/link';
import { ConnectedAddress } from '~~/components/ConnectedAddress';

const Home = () => {
  return (
    <div>
      <div className="pt-10 grid grid-cols-4 gap-4">
        {/* <div className="bg-container flex-grow w-full mt-16 px-8 py-12"></div> */}
        <div className="col-span-1 card bg-base-100">
          <div className="card-body">
            <h2 className="card-title">NichtaDex</h2>
            <p>Decentralized Exchange</p>
          </div>
        </div>
        <div className="col-span-2 card bg-base-100">
          <p>Connect your wallet to interact with the dApp</p>
        </div>
        <div className="col-span-1 card bg-base-100">
          <p>open api chat</p>
        </div>
      </div>
      <div className="mt-5 grid grid-cols-3 gap-4">
        <div className="col-span-1 card bg-base-100">
          <p>Token swapper</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
