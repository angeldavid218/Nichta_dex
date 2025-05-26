import Link from "next/link";
import { ConnectedAddress } from "~~/components/ConnectedAddress";
import BuyCoins from "~~/components/nichta/BuyCoins";
import SwapPoolChart from "~~/components/nichta/SwapPoolChart";
import Chat from "~~/components/nichta/Chat";
import SwapTokens from "~~/components/nichta/SwapTokens";
import Positions from "~~/components/nichta/Positions";
const Home = () => {
  return (
    <div>
      <div className="pt-10 grid grid-cols-4 gap-4">
        {/* <div className="bg-container flex-grow w-full mt-16 px-8 py-12"></div> */}
        <div className="col-span-1 card bg-base-100">
          <BuyCoins />
        </div>
        <div className="col-span-2 card bg-base-100">
          <SwapPoolChart />
        </div>
        <div className="col-span-1 card bg-base-100">
          <Chat />
        </div>
      </div>
      <div className="grid grid-cols-4 gap-4">
        <div className="mt-4 col-span-1 card bg-base-100">
          <SwapTokens />
        </div>
        <div className="mt-4 col-span-3 card bg-base-100">
          <Positions />
        </div>
      </div>
    </div>
  );
};

export default Home;
