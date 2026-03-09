use bevy::prelude::*;

#[derive(Component)]
pub struct Name(pub String);

#[derive(Component)]
pub struct Weight(pub f32);

#[derive(Component)]
pub struct Weapon {
    pub damage: String,
}

#[derive(Component)]
pub struct Magical {
    pub bonus: i32,
}

#[derive(Component)]
pub struct Consumable {
    pub healing: i32,
}