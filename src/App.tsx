import { useState } from 'react'
import './App.css'
import type { Character } from './types'
import { CharacterSelect } from './components/CharacterSelect'
import { CharacterSheet } from './components/CharacterSheet'
import { CharacterBuilder } from './components/CharacterBuilder'
import { SpellBook } from './components/SpellBook'

type View = 'select' | 'builder' | 'sheet' | 'spellbook'

export default function App() {
  const [character, setCharacter] = useState<Character | null>(null)
  const [view, setView] = useState<View>('select')

  if (view === 'builder') {
    return (
      <CharacterBuilder
        onCreated={c => { setCharacter(c); setView('sheet') }}
        onCancel={() => setView('select')}
      />
    )
  }

  if (view === 'select' || !character) {
    return (
      <CharacterSelect
        onSelect={c => { setCharacter(c); setView('sheet') }}
        onCreateNew={() => setView('builder')}
      />
    )
  }

  if (view === 'spellbook') {
    return (
      <SpellBook
        character={character}
        onBack={() => setView('sheet')}
      />
    )
  }

  return (
    <CharacterSheet
      character={character}
      onBack={() => { setCharacter(null); setView('select') }}
      onSpellbook={() => setView('spellbook')}
    />
  )
}
