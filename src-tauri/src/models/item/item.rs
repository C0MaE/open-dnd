use serde::{Serialize, Deserialize};
use crate::models::item::stats::weapon::WeaponStats;

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct Item {
    pub id: String,
    pub name: String,
    pub description: String,
    pub value: u32,
    pub quantity: u32,
    pub weight_per_unit: f32,
    pub details: ItemDetails,
    pub magic_data: Option<MagicData>
}

#[derive(Serialize, Deserialize, Debug, Clone)]
#[serde(tag = "type", content = "data")]
pub enum ItemDetails {
    Weapon(WeaponStats),
    Armor(ArmorStats),
    Tool(ToolStats),
    AdventuringGear(AdventuringGearStats),
    Potion(PotionStats),
    Container(ContainerStats),
    Scroll(ScrollsStats),
    Valuable,
    Ammunition,
    Gear,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct MagicData {
    pub rarity: Rarity,
    pub requires_attunement: bool,
    pub is_attuned: bool,
    pub charges: Option<ChargeData>,
    pub properties: Vec<MagicProperty>,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub enum Rarity {
    Common,
    Uncommon,
    Rare,
    VeryRare,
    Legendary,
    Artifact,
}
