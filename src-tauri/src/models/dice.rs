use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug, Clone)]
pub enum DiceType {
    D4,
    D6,
    D8,
    D10,
    D12,
}