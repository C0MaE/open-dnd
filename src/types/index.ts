export type SpellSchool =
  | 'Abjuration'
  | 'Conjuration'
  | 'Divination'
  | 'Enchantment'
  | 'Evocation'
  | 'Illusion'
  | 'Necromancy'
  | 'Transmutation'

export interface SpellComponents {
  verbal: boolean
  somatic: boolean
  material: string | null
}

export interface Spell {
  id: string
  name: string
  level: number        // 0 = cantrip, 1–9 = leveled
  school: SpellSchool
  castingTime: string
  range: string
  components: SpellComponents
  duration: string
  concentration: boolean
  ritual: boolean
  description: string
  higherLevels: string | null
}

export interface Character {
  id: string
  name: string
  race: string
  className: string
  level: number
  subclass: string | null
  alignment: string
  hp: { current: number; max: number }
  ac: number
  spellcastingAbility: string | null
  knownSpells: string[]    // spell IDs
  preparedSpells: string[] // spell IDs
}
