import { useState, useMemo } from 'react'
import type { Character, Spell } from '../types'
import { mockSpells } from '../data/mockData'

interface Props {
  character: Character
  onBack: () => void
}

const SCHOOL_COLOR: Record<string, string> = {
  Abjuration: '#4a6fa5', Conjuration: '#7a5c8a', Divination: '#3a7a5a',
  Enchantment: '#8a4a6a', Evocation: '#8a3020', Illusion: '#4a6a8a',
  Necromancy: '#4a5a38', Transmutation: '#7a6a1a',
}

const SCHOOL_SYMBOL: Record<string, string> = {
  Abjuration: '◎', Conjuration: '◈', Divination: '◉', Enchantment: '◐',
  Evocation: '◆', Illusion: '◌', Necromancy: '◑', Transmutation: '◒',
}

function ordinalSuffix(n: number) {
  if (n === 1) return 'st'
  if (n === 2) return 'nd'
  if (n === 3) return 'rd'
  return 'th'
}

function componentString(spell: Spell) {
  const parts: string[] = []
  if (spell.components.verbal)   parts.push('V')
  if (spell.components.somatic)  parts.push('S')
  if (spell.components.material) parts.push('M')
  return parts.join(', ')
}

export function SpellBook({ character, onBack }: Props) {
  const characterSpells = useMemo(() => {
    const ids = new Set([...character.knownSpells, ...character.preparedSpells])
    return mockSpells.filter(s => ids.has(s.id))
  }, [character])

  const [selected, setSelected] = useState<Spell | null>(characterSpells[0] ?? null)

  const grouped = useMemo(() => {
    const g: Record<number, Spell[]> = {}
    for (const spell of characterSpells) {
      ;(g[spell.level] ??= []).push(spell)
    }
    return g
  }, [characterSpells])

  const isPrepared = (id: string) => character.preparedSpells.includes(id)

  return (
    <div className="w-screen h-screen flex flex-col bg-dungeon-dark animate-fade-in">

      {/* ── Top bar ── */}
      <div className="flex items-center justify-between px-[clamp(16px,2vw,32px)] py-[clamp(8px,1.2vh,16px)] border-b border-[#1e1608] shrink-0">
        <button
          onClick={onBack}
          className="font-cinzel text-caption tracking-[0.12em] text-[#8a7040] bg-transparent border border-[#2e2010] px-[clamp(12px,1.4vw,22px)] py-[clamp(5px,0.6vh,10px)] cursor-pointer rounded-sm transition-colors hover:text-gold hover:border-[#5a4020]"
        >
          ← Return
        </button>

        <div className="text-center">
          <span className="block font-cinzel text-heading text-gold tracking-[0.05em]">
            Spellbook of <em className="not-italic text-[#e8ca60]">{character.name}</em>
          </span>
          <span className="block font-fell-sc text-badge text-[#5a4a28] tracking-[0.12em] mt-0.5">
            {character.race} {character.className} · Level {character.level}
          </span>
        </div>

        <div className="w-[clamp(100px,10vw,160px)]" /> {/* spacer */}
      </div>

      {/* ── Book ── */}
      <div className="flex-1 flex items-center justify-center px-[clamp(20px,3vw,48px)] py-[clamp(12px,2vh,28px)] min-h-0">
        <div className="flex h-full max-h-[min(88vh,820px)] rounded-[2px_6px_6px_2px] shadow-book">

          {/* ── Left page — spell index ── */}
          <div className="bg-parchment-page-left flex flex-col w-[clamp(340px,32vw,620px)] h-full px-[clamp(16px,1.8vw,28px)] py-[clamp(16px,2.2vh,30px)] overflow-hidden">
            <div className="flex items-center justify-center gap-2.5 mb-[clamp(4px,0.8vh,10px)]">
              <span className="text-gold-dim text-deco">✦</span>
              <span className="font-cinzel text-caption text-[#3e2208] tracking-[0.22em] uppercase">Tome of Spells</span>
              <span className="text-gold-dim text-deco">✦</span>
            </div>

            <div className="deco-rule my-[clamp(4px,0.7vh,9px)]" />

            {/* Spell list */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden pr-0.5 parchment-scroll min-h-0">
              {Object.entries(grouped)
                .sort(([a], [b]) => Number(a) - Number(b))
                .map(([lvl, spells]) => (
                  <div key={lvl} className="mb-[clamp(8px,1.2vh,16px)]">
                    <div className="font-cinzel text-badge text-red-ink uppercase tracking-[0.28em] pb-1 mb-0.5 border-b border-[rgba(139,26,26,0.25)]">
                      {Number(lvl) === 0 ? 'Cantrips' : `${lvl}${ordinalSuffix(Number(lvl))} Level`}
                    </div>
                    {spells.map(spell => (
                      <button
                        key={spell.id}
                        onClick={() => setSelected(spell)}
                        className={[
                          'flex items-center gap-[clamp(5px,0.6vw,10px)] w-full bg-transparent border-none',
                          'px-[clamp(5px,0.6vw,10px)] py-[clamp(3px,0.5vh,8px)]',
                          'cursor-pointer rounded-sm transition-colors text-left',
                          selected?.id === spell.id
                            ? 'bg-[rgba(90,60,10,0.18)]'
                            : 'hover:bg-[rgba(90,60,10,0.10)]',
                        ].join(' ')}
                      >
                        <span className="text-caption w-[clamp(14px,1.2vw,20px)] text-center shrink-0"
                              style={{ color: SCHOOL_COLOR[spell.school] }}>
                          {SCHOOL_SYMBOL[spell.school]}
                        </span>
                        <span className={`font-fell-sc text-body text-ink flex-1 leading-[1.3] ${isPrepared(spell.id) ? 'font-bold' : ''}`}>
                          {spell.name}
                        </span>
                        {spell.concentration && (
                          <span className="font-cinzel text-deco text-gold-dim bg-[rgba(100,70,20,0.14)] px-1 py-0.5 rounded-sm">C</span>
                        )}
                        {spell.ritual && (
                          <span className="font-cinzel text-deco text-gold-dim bg-[rgba(100,70,20,0.14)] px-1 py-0.5 rounded-sm">R</span>
                        )}
                      </button>
                    ))}
                  </div>
                ))}
            </div>

            <div className="font-cinzel text-deco text-[#9a8050] text-center mt-[clamp(6px,1vh,14px)] tracking-[0.2em] shrink-0">I</div>
          </div>

          {/* ── Spine ── */}
          <div className="bg-leather-spine flex flex-col items-center justify-evenly w-[clamp(24px,2.2vw,40px)] h-full shrink-0 py-[clamp(20px,3vh,40px)]">
            {[0,1,2].map(i => (
              <div key={i} className="w-[55%] h-px"
                   style={{ background: 'linear-gradient(to right, transparent, rgba(140,90,40,0.6), transparent)' }} />
            ))}
          </div>

          {/* ── Right page — spell detail ── */}
          <div className="bg-parchment-page-right flex flex-col w-[clamp(340px,32vw,620px)] h-full px-[clamp(16px,1.8vw,28px)] py-[clamp(16px,2.2vh,30px)] overflow-hidden">
            {selected ? (
              <>
                <div className="mb-[clamp(4px,0.7vh,8px)]">
                  <div className="font-cinzel text-badge tracking-[0.22em] uppercase mb-1"
                       style={{ color: SCHOOL_COLOR[selected.school] }}>
                    {SCHOOL_SYMBOL[selected.school]}&nbsp;{selected.school}
                  </div>
                  <h2 className="font-cinzel-deco text-display text-ink leading-[1.2] mb-1"
                      style={{ textShadow: '1px 1px 0 rgba(255,255,255,0.2)' }}>
                    {selected.name}
                  </h2>
                  <div className="font-fell-sc text-caption text-[#6b4020] italic">
                    {selected.level === 0
                      ? 'Cantrip'
                      : `${selected.level}${ordinalSuffix(selected.level)}-Level Spell`}
                    {selected.ritual ? ' · Ritual' : ''}
                    {selected.concentration ? ' · Concentration' : ''}
                  </div>
                </div>

                <div className="deco-rule my-[clamp(4px,0.7vh,9px)]" />

                <div className="grid grid-cols-2 gap-[clamp(4px,0.6vh,10px)_clamp(10px,1.4vw,22px)] my-[clamp(5px,0.8vh,10px)]">
                  {[
                    { label: 'Casting Time', val: selected.castingTime },
                    { label: 'Range',        val: selected.range },
                    { label: 'Components',   val: null },
                    { label: 'Duration',     val: selected.duration },
                  ].map(({ label, val }) => (
                    <div key={label} className="flex flex-col gap-0.5">
                      <span className="font-cinzel text-deco text-red-ink uppercase tracking-[0.15em]">{label}</span>
                      <span className="font-fell-sc text-body text-ink leading-[1.3]">
                        {val ?? (
                          <>
                            {componentString(selected)}
                            {selected.components.material && (
                              <span className="text-badge text-[#6a4820] italic">
                                &nbsp;({selected.components.material})
                              </span>
                            )}
                          </>
                        )}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="deco-rule my-[clamp(4px,0.7vh,9px)]" />

                <div className="flex-1 overflow-y-auto pr-1 min-h-0 parchment-scroll">
                  <p className="font-fell text-body text-ink leading-[1.7] text-justify mb-[clamp(6px,1vh,12px)]">
                    {selected.description}
                  </p>
                  {selected.higherLevels && (
                    <div className="font-fell text-caption text-ink-light leading-[1.6] p-[clamp(6px,1vh,12px)_clamp(8px,1vw,14px)] border border-[rgba(100,70,20,0.22)] rounded-sm bg-[rgba(100,70,20,0.05)] mt-2">
                      <span className="font-bold text-red-ink">At Higher Levels. </span>
                      {selected.higherLevels}
                    </div>
                  )}
                </div>

                {isPrepared(selected.id) && (
                  <div className="shrink-0 mt-[clamp(6px,1vh,12px)] inline-block font-cinzel text-badge tracking-[0.2em] text-[#4a7028] border border-[rgba(74,112,40,0.35)] px-[clamp(8px,1vw,14px)] py-[clamp(3px,0.4vh,6px)] rounded-sm bg-[rgba(74,112,40,0.07)]">
                    ✦ Prepared
                  </div>
                )}
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center gap-4 text-[#9a8050]">
                <div className="text-[clamp(2rem,3vw,3.5rem)] text-gold opacity-30">✦</div>
                <p className="font-fell italic text-body text-center leading-[1.5]">
                  Select a spell to read its incantation.
                </p>
              </div>
            )}

            <div className="font-cinzel text-deco text-[#9a8050] text-center mt-[clamp(6px,1vh,14px)] tracking-[0.2em] shrink-0">II</div>
          </div>

        </div>
      </div>
    </div>
  )
}
