#[starknet::contract]
// Contract deployed on Sepolia Starknet, 0x004bb1c38e8eceb339b96a46c1de40620cc99f458b480a3a91dd3609ef09d0a8
mod SimpleAMMPool {
    // ───────── imports ─────────
    use starknet::{ContractAddress, get_caller_address, get_contract_address};
    use starknet::storage::{StoragePointerReadAccess, StoragePointerWriteAccess};
    use openzeppelin::token::erc20::interface::{IERC20Dispatcher, IERC20DispatcherTrait};
    use core::integer::u256;
    use core::panics::panic;

    // ───────── constants ─────────
    const THOUSAND:   u256 = 1000_u256;
    const FEE_PERMIL: u256 = 3_u256;            // 0.3 %

    // ───────── storage ─────────
    #[storage]
    struct Storage {
        token0_address: ContractAddress,
        token1_address: ContractAddress,
        reserve0: u256,
        reserve1: u256,
    }

    // ───────── events ─────────
    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        LiquidityAdded: LiquidityAdded,
        Swapped:        Swapped,
    }

    #[derive(Drop, starknet::Event)]
    struct LiquidityAdded {
        caller:  ContractAddress,
        amount0: u256,
        amount1: u256,
    }

    #[derive(Drop, starknet::Event)]
    struct Swapped {
        caller:            ContractAddress,
        token_in_address:  ContractAddress,
        amount_in:         u256,
        token_out_address: ContractAddress,
        amount_out:        u256,
    }

    // ───────── constructor ─────────
    #[constructor]
    fn constructor(
        ref self: ContractState,
        initial_token0_address: ContractAddress,
        initial_token1_address: ContractAddress,
    ) {
        assert(initial_token0_address != initial_token1_address, 'TOKENS_SAME');
        self.token0_address.write(initial_token0_address);
        self.token1_address.write(initial_token1_address);
        self.reserve0.write(0_u256);
        self.reserve1.write(0_u256);
    }

    // ═════ add_liquidity ═════
    #[external(v0)]
    fn add_liquidity(
        ref self: ContractState,
        amount0_desired: u256,
        amount1_desired: u256,
    ) -> (u256, u256) {
        assert(amount0_desired > 0_u256 && amount1_desired > 0_u256, 'AMOUNTS_ZERO');

        let caller    = get_caller_address();
        let pool_addr = get_contract_address();
        let token0    = self.token0_address.read();
        let token1    = self.token1_address.read();

        IERC20Dispatcher { contract_address: token0 }
            .transfer_from(caller, pool_addr, amount0_desired);
        IERC20Dispatcher { contract_address: token1 }
            .transfer_from(caller, pool_addr, amount1_desired);

        self.reserve0.write(self.reserve0.read() + amount0_desired);
        self.reserve1.write(self.reserve1.read() + amount1_desired);

        self.emit(LiquidityAdded { caller, amount0: amount0_desired, amount1: amount1_desired });
        (amount0_desired, amount1_desired)
    }

    // ═════ swap ═════
    #[external(v0)]
    fn swap(
        ref self: ContractState,
        token_in_address: ContractAddress,
        amount_in: u256,
        min_amount_out: u256,
    ) -> u256 {
        assert(amount_in > 0_u256,      'AMOUNT_IN_ZERO');
        assert(min_amount_out > 0_u256, 'MIN_AMOUNT_OUT_ZERO');

        let caller    = get_caller_address();
        let pool_addr = get_contract_address();
        let token0    = self.token0_address.read();
        let token1    = self.token1_address.read();

        let (reserve_in, reserve_out, token_out_address) = if token_in_address == token0 {
            (self.reserve0.read(), self.reserve1.read(), token1)
        } else if token_in_address == token1 {
            (self.reserve1.read(), self.reserve0.read(), token0)
        } else {
            panic(array!['INVALID_TOKEN_IN'])
        };

        assert(reserve_in > 0_u256 && reserve_out > 0_u256, 'INSUF_LIQUIDITY');

        IERC20Dispatcher { contract_address: token_in_address }
            .transfer_from(caller, pool_addr, amount_in);

        // x·y = k con 0.3 % fee
        let fee_factor          = THOUSAND - FEE_PERMIL;            // 997
        let amount_in_with_fee  = amount_in * fee_factor;
        let numerator           = reserve_out * amount_in_with_fee;
        let denominator         = reserve_in * THOUSAND + amount_in_with_fee;

        assert(denominator != 0_u256, 'ZERO_DENOMINATOR');
        let amount_out = numerator / denominator;                   // división normal

        assert(amount_out > 0_u256,          'AMOUNT_OUT_ZERO');
        assert(amount_out >= min_amount_out, 'SLIPPAGE');

        // actualiza reservas
        if token_in_address == token0 {
            self.reserve0.write(reserve_in + amount_in);
            self.reserve1.write(reserve_out - amount_out);
        } else {
            self.reserve1.write(reserve_in + amount_in);
            self.reserve0.write(reserve_out - amount_out);
        }

        IERC20Dispatcher { contract_address: token_out_address }
            .transfer(caller, amount_out);

        self.emit(Swapped {
            caller,
            token_in_address,
            amount_in,
            token_out_address,
            amount_out,
        });

        amount_out
    }

    // ═════ views ═════
    #[external(v0)]
    fn get_reserves(self: @ContractState) -> (u256, u256) {
        (self.reserve0.read(), self.reserve1.read())
    }

    #[external(v0)]
    fn get_token_addresses(self: @ContractState) -> (ContractAddress, ContractAddress) {
        (self.token0_address.read(), self.token1_address.read())
    }

    #[external(v0)]
    fn get_amount_out(
        self: @ContractState,
        token_in_address_query: ContractAddress,
        amount_in_query: u256,
    ) -> u256 {
        assert(amount_in_query > 0_u256, 'QUERY_AMOUNT_ZERO');

        let token0 = self.token0_address.read();
        let token1 = self.token1_address.read();

        let (reserve_in, reserve_out) = if token_in_address_query == token0 {
            (self.reserve0.read(), self.reserve1.read())
        } else if token_in_address_query == token1 {
            (self.reserve1.read(), self.reserve0.read())
        } else {
            panic(array!['INVALID_QUERY_TOKEN'])
        };

        assert(reserve_in > 0_u256 && reserve_out > 0_u256, 'QUERY_INSUF_LIQ');

        let fee_factor  = THOUSAND - FEE_PERMIL;
        let numerator   = reserve_out * (amount_in_query * fee_factor);
        let denominator = reserve_in * THOUSAND + amount_in_query * fee_factor;

        if denominator == 0_u256 {
            return 0_u256;
        }

        numerator / denominator
    }
}
