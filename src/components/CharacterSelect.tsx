import { useEffect, useState } from 'react'
import type { Character } from '../types'
import { getCharacters, deleteCharacter } from '../services/api'

interface Props {
  onSelect: (character: Character) => void
  onCreateNew: () => void
}

const CLASS_SYMBOL: Record<string, string> = {
  Wizard: '✦', Fighter: '⚔', Cleric: '☩', Rogue: '◈',
  Ranger: '◎', Bard: '♪', Paladin: '✠', Barbarian: '⚡',
  Druid: '✿', Monk: '◯', Sorcerer: '✧', Warlock: '◆',
  Artificer: '⚙',
}

const ALIGNMENT_SHORT: Record<string, string> = {
  'Lawful Good': 'LG', 'Neutral Good': 'NG', 'Chaotic Good': 'CG',
  'Lawful Neutral': 'LN', 'True Neutral': 'TN', 'Chaotic Neutral': 'CN',
  'Lawful Evil': 'LE', 'Neutral Evil': 'NE', 'Chaotic Evil': 'CE',
}

export function CharacterSelect({ onSelect, onCreateNew }: Props) {
  const [savedChars, setSavedChars] = useState<Character[]>([])
  const [loading, setLoading]       = useState(true)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => {
    getCharacters()
      .then(setSavedChars)
      .catch(() => setSavedChars([]))
      .finally(() => setLoading(false))
  }, [])

  async function handleDelete(e: React.MouseEvent, id: string) {
    e.stopPropagation()
    setDeletingId(id)
    try {
      await deleteCharacter(id)
      setSavedChars(prev => prev.filter(c => c.id !== id))
    } catch {
      // silently ignore
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center gap-[clamp(20px,3vh,48px)] bg-dungeon animate-fade-up">

      {/* ── Header ── */}
      <header className="text-center">
        <div className="font-cinzel text-[#4a3818] text-deco tracking-[0.9em] mb-[clamp(8px,1vh,16px)]">
          ✦ · ⚔ · ✦
        </div>
        <h1 className="font-cinzel-deco text-hero text-gold tracking-[0.1em] leading-[1.1]"
            style={{ textShadow: '0 0 40px rgba(200,168,75,0.35), 0 2px 6px rgba(0,0,0,0.8)' }}>
          Open D&amp;D
        </h1>
        <p className="font-fell-sc text-[#7a6035] text-caption tracking-[0.35em] uppercase mt-[clamp(6px,1vh,14px)]">
          Choose your adventurer
        </p>
      </header>

      {/* ── Cards ── */}
      <div className="flex gap-[clamp(14px,1.8vw,36px)] flex-wrap justify-center max-w-[90vw]">
        {loading ? (
          <div className="font-fell text-[#4a3818] text-body animate-pulse">Loading characters…</div>
        ) : (
          <>
            {savedChars.map(char => (
              <CharacterCard
                key={char.id}
                char={char}
                deleting={deletingId === char.id}
                onSelect={onSelect}
                onDelete={handleDelete}
              />
            ))}

            {/* New character button */}
            <button
              onClick={onCreateNew}
              className="group relative w-[clamp(160px,14vw,240px)] px-[clamp(12px,1.2vw,20px)] py-[clamp(16px,2vh,28px)] border-2 border-dashed border-[rgba(100,70,20,0.3)] rounded-sm cursor-pointer text-center transition-all duration-200 hover:border-[rgba(200,168,75,0.5)] hover:bg-[rgba(100,70,20,0.06)] hover:-translate-y-1">
              <div className="text-[clamp(1.6rem,2.4vw,3rem)] text-[#4a3818] group-hover:text-gold transition-colors mb-2 leading-none">+</div>
              <div className="font-cinzel text-caption tracking-widest text-[#5a3818] group-hover:text-gold transition-colors uppercase">
                New Character
              </div>
            </button>
          </>
        )}
      </div>

      {/* ── Footer ── */}
      <footer className="flex items-center gap-3 text-[#3a2810] font-fell-sc text-caption">
        <span>✦</span>
        <span className="w-[72px] h-px"
              style={{ background: 'linear-gradient(to right, transparent, #4a3018, transparent)' }} />
        <span>✦</span>
        <span className="w-[72px] h-px"
              style={{ background: 'linear-gradient(to right, transparent, #4a3018, transparent)' }} />
        <span>✦</span>
      </footer>
    </div>
  )
}

// ── Character card sub-component ─────────────────────────────────────────────

interface CardProps {
  char: Character
  deleting: boolean
  onSelect: (c: Character) => void
  onDelete: (e: React.MouseEvent, id: string) => void
}

function CharacterCard({ char, deleting, onSelect, onDelete }: CardProps) {
  return (
    <button
      key={char.id}
      onClick={() => onSelect(char)}
      className="group relative w-[clamp(160px,14vw,240px)] px-[clamp(12px,1.2vw,20px)] py-[clamp(14px,1.8vh,24px)] bg-parchment-card shadow-card hover:shadow-card-hover rounded-sm cursor-pointer text-center font-fell-sc transition-[transform,box-shadow] duration-200 hover:-translate-y-2 hover:scale-[1.02] active:-translate-y-1 active:scale-[1.01]"
    >
      {/* Corner ornaments */}
      {(['tl','tr','bl','br'] as const).map(pos => (
        <span key={pos} className={[
          'absolute text-gold-dim text-deco opacity-60 leading-none',
          pos === 'tl' ? 'top-1.5 left-2' :
          pos === 'tr' ? 'top-1.5 right-2' :
          pos === 'bl' ? 'bottom-1.5 left-2' :
                         'bottom-1.5 right-2',
        ].join(' ')}>✦</span>
      ))}

      {/* Delete button */}
      <span
        role="button"
        tabIndex={0}
        onClick={e => onDelete(e, char.id)}
        onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') onDelete(e as unknown as React.MouseEvent, char.id) }}
        className="absolute top-1.5 right-2 text-[#8b1a1a] text-deco hover:text-red-ink leading-none px-0.5 transition-colors"
        title="Delete character"
      >
        {deleting ? '…' : '✕'}
      </span>

      <div className="text-[clamp(1.6rem,2.4vw,3.2rem)] mb-[clamp(5px,0.8vh,12px)] leading-none text-[#5a3010]"
           style={{ textShadow: '0 1px 2px rgba(0,0,0,0.15)' }}>
        {CLASS_SYMBOL[char.className] ?? '◈'}
      </div>

      <div className="font-fell-sc text-subhead font-semibold text-ink leading-[1.2] mb-1">
        {char.name}
      </div>
      <div className="font-fell-sc text-caption text-[#6b4a20] tracking-[0.06em]">
        {char.race}
      </div>

      <div className="h-px my-[clamp(5px,0.8vh,12px)] mx-1"
           style={{ background: 'linear-gradient(to right, transparent, rgba(100,70,20,0.4), transparent)' }} />

      <div className="font-fell-sc text-caption text-red-ink italic leading-[1.3]">
        {char.className}{char.subclass ? ` · ${char.subclass}` : ''}
      </div>
      <div className="font-cinzel text-badge text-[#7a5820] tracking-[0.15em] uppercase mt-1">
        Level {char.level}
      </div>

      <div className="h-px my-[clamp(5px,0.8vh,12px)] mx-1"
           style={{ background: 'linear-gradient(to right, transparent, rgba(100,70,20,0.4), transparent)' }} />

      <div className="flex items-center justify-center gap-2">
        <div className="flex flex-col items-center gap-0.5">
          <span className="font-cinzel text-deco tracking-[0.1em] text-[#8a6838] uppercase">HP</span>
          <span className="font-fell-sc text-caption text-red-ink">
            {char.hp.current}/{char.hp.max}
          </span>
        </div>
        <span className="font-fell-sc text-caption text-[#9a8050] mt-1.5">·</span>
        <div className="flex flex-col items-center gap-0.5">
          <span className="font-cinzel text-deco tracking-[0.1em] text-[#8a6838] uppercase">AC</span>
          <span className="font-fell-sc text-caption text-[#2a4a28]">{char.ac}</span>
        </div>
        <span className="font-fell-sc text-caption text-[#9a8050] mt-1.5">·</span>
        <div className="flex flex-col items-center gap-0.5">
          <span className="font-cinzel text-deco tracking-[0.1em] text-[#8a6838] uppercase">Align</span>
          <span className="font-fell-sc text-caption text-ink-light">
            {ALIGNMENT_SHORT[char.alignment] ?? '—'}
          </span>
        </div>
      </div>

      {char.spellcastingAbility && (
        <div className="mt-[clamp(5px,0.8vh,10px)] font-cinzel text-deco tracking-[0.1em] text-gold-dim uppercase">
          ✦ {char.spellcastingAbility} caster
        </div>
      )}
    </button>
  )
}
