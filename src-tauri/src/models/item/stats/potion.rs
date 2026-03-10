use serde::{Deserialize, Serialize};
use crate::models::dice::DiceRoll;

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct PotionStats {
    pub potion_type: PotionType,
    pub effect_description: String,
    pub dice_roll: Option<DiceRoll>,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub enum PotionType {
    Healing,
    Buff,
    Poison,
    Utility,
}