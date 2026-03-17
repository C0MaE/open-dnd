import { useState } from 'react'
import './App.css'
import type { Character } from './types'
import { CharacterSelect } from './components/CharacterSelect'
import { CharacterSheet } from './components/CharacterSheet'
import { SpellBook } from './components/SpellBook'

type View = 'select' | 'sheet' | 'spellbook'

export default function App() {
  const [character, setCharacter] = useState<Character | null>(null)
  const [view, setView] = useState<View>('select')

  if (!character || view === 'select') {
    return (
      <CharacterSelect
        onSelect={c => { setCharacter(c); setView('sheet') }}
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
