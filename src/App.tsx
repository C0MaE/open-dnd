import { useState } from 'react'
import './App.css'
import type { Character } from './types'
import { CharacterSelect } from './components/CharacterSelect'
import { SpellBook } from './components/SpellBook'

export default function App() {
  const [character, setCharacter] = useState<Character | null>(null)

  if (character) {
    return <SpellBook character={character} onBack={() => setCharacter(null)} />
  }

  return <CharacterSelect onSelect={setCharacter} />
}
