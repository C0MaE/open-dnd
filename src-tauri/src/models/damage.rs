use serde::{Deserialize, Serialize};
use crate::models::dice::DiceRoll;

#[derive(Serialize, Deserialize, Debug, Clone, Copy, PartialEq, Eq)]
pub enum DamageType {
    Acid,
    Bludgeoning,
    Cold,
    Fire,
    Force,
    Lightning,
    Necrotic,
    Piercing,
    Poison,
    Psychic,
    Radiant,
    Slashing,
    Thunder,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct DamageRoll {
    pub dice: DiceRoll,
    pub damage_type: DamageType,
}