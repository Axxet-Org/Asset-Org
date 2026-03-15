#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, Address, Env, String, Vec};

#[contracttype]
#[derive(Clone)]
pub enum AssetStatus {
    Active,
    Assigned,
    Retired,
}

#[contracttype]
#[derive(Clone)]
pub struct Asset {
    pub id: u64,
    pub name: String,
    pub owner: Address,
    pub status: AssetStatus,
}

#[contracttype]
pub enum DataKey {
    Asset(u64),
    AssetCount,
}

#[contract]
pub struct AssetsOrgContract;

#[contractimpl]
impl AssetsOrgContract {
    /// Register a new asset on-chain
    pub fn register_asset(env: Env, name: String, owner: Address) -> u64 {
        owner.require_auth();
        let id: u64 = env.storage().instance().get(&DataKey::AssetCount).unwrap_or(0) + 1;
        let asset = Asset {
            id,
            name,
            owner,
            status: AssetStatus::Active,
        };
        env.storage().instance().set(&DataKey::Asset(id), &asset);
        env.storage().instance().set(&DataKey::AssetCount, &id);
        id
    }

    /// Transfer asset ownership
    pub fn transfer_asset(env: Env, id: u64, new_owner: Address) {
        let mut asset: Asset = env.storage().instance().get(&DataKey::Asset(id)).unwrap();
        asset.owner.require_auth();
        asset.owner = new_owner;
        asset.status = AssetStatus::Assigned;
        env.storage().instance().set(&DataKey::Asset(id), &asset);
    }

    /// Retire an asset
    pub fn retire_asset(env: Env, id: u64) {
        let mut asset: Asset = env.storage().instance().get(&DataKey::Asset(id)).unwrap();
        asset.owner.require_auth();
        asset.status = AssetStatus::Retired;
        env.storage().instance().set(&DataKey::Asset(id), &asset);
    }

    /// Get asset by id
    pub fn get_asset(env: Env, id: u64) -> Asset {
        env.storage().instance().get(&DataKey::Asset(id)).unwrap()
    }
}
