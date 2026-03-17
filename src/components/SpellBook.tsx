import { useState, useMemo } from 'react'
import type { Character, Spell } from '../types'
import { mockSpells } from '../data/mockData'

interface Props {
  character: Character
  onBack: () => void
}

const SCHOOL_COLOR: Record<string, string> = {
  Abjuration:   '#4a6fa5',
  Conjuration:  '#7a5c8a',
  Divination:   '#3a7a5a',
  Enchantment:  '#8a4a6a',
  Evocation:    '#8a3020',
  Illusion:     '#4a6a8a',
  Necromancy:   '#4a5a38',
  Transmutation:'#7a6a1a',
}

const SCHOOL_SYMBOL: Record<string, string> = {
  Abjuration:   '◎',
  Conjuration:  '◈',
  Divination:   '◉',
  Enchantment:  '◐',
  Evocation:    '◆',
  Illusion:     '◌',
  Necromancy:   '◑',
  Transmutation:'◒',
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
    <div className="sb-screen">
      {/* ── Top bar ── */}
      <div className="sb-topbar">
        <button className="sb-back" onClick={onBack}>
          ← Return
        </button>
        <div className="sb-topbar-center">
          <span className="sb-topbar-title">
            Spellbook of <em>{character.name}</em>
          </span>
          <span className="sb-topbar-sub">
            {character.race} {character.className} · Level {character.level}
          </span>
        </div>
        <div className="sb-topbar-right" />
      </div>

      {/* ── Book ── */}
      <div className="sb-wrap">
        <div className="sb-book">

          {/* ── Left page — spell index ── */}
          <div className="sb-page sb-page--left">
            <div className="sb-page-header">
              <span className="sb-page-orn">✦</span>
              <span className="sb-page-heading">Tome of Spells</span>
              <span className="sb-page-orn">✦</span>
            </div>
            <div className="sb-rule" />

            <div className="sb-list">
              {Object.entries(grouped)
                .sort(([a], [b]) => Number(a) - Number(b))
                .map(([lvl, spells]) => (
                  <div key={lvl} className="sb-group">
                    <div className="sb-group-label">
                      {Number(lvl) === 0 ? 'Cantrips' : `${lvl}${ordinalSuffix(Number(lvl))} Level`}
                    </div>
                    {spells.map(spell => (
                      <button
                        key={spell.id}
                        className={[
                          'sb-entry',
                          selected?.id === spell.id ? 'sb-entry--active' : '',
                          isPrepared(spell.id)      ? 'sb-entry--prepared' : '',
                        ].join(' ')}
                        onClick={() => setSelected(spell)}
                      >
                        <span
                          className="sb-entry-dot"
                          style={{ color: SCHOOL_COLOR[spell.school] }}
                        >
                          {SCHOOL_SYMBOL[spell.school]}
                        </span>
                        <span className="sb-entry-name">{spell.name}</span>
                        {spell.concentration && <span className="sb-badge">C</span>}
                        {spell.ritual        && <span className="sb-badge">R</span>}
                      </button>
                    ))}
                  </div>
                ))}
            </div>

            <div className="sb-page-number">I</div>
          </div>

          {/* ── Spine ── */}
          <div className="sb-spine">
            <div className="sb-spine-mark" />
            <div className="sb-spine-mark" />
            <div className="sb-spine-mark" />
          </div>

          {/* ── Right page — spell detail ── */}
          <div className="sb-page sb-page--right">
            {selected ? (
              <>
                <div className="sb-detail-top">
                  <div
                    className="sb-detail-school"
                    style={{ color: SCHOOL_COLOR[selected.school] }}
                  >
                    {SCHOOL_SYMBOL[selected.school]}&nbsp;{selected.school}
                  </div>
                  <h2 className="sb-detail-name">{selected.name}</h2>
                  <div className="sb-detail-level">
                    {selected.level === 0
                      ? 'Cantrip'
                      : `${selected.level}${ordinalSuffix(selected.level)}-Level Spell`}
                    {selected.ritual ? ' · Ritual' : ''}
                    {selected.concentration ? ' · Concentration' : ''}
                  </div>
                </div>

                <div className="sb-rule" />

                <div className="sb-stats-grid">
                  <div className="sb-stat">
                    <span className="sb-stat-label">Casting Time</span>
                    <span className="sb-stat-val">{selected.castingTime}</span>
                  </div>
                  <div className="sb-stat">
                    <span className="sb-stat-label">Range</span>
                    <span className="sb-stat-val">{selected.range}</span>
                  </div>
                  <div className="sb-stat">
                    <span className="sb-stat-label">Components</span>
                    <span className="sb-stat-val">
                      {componentString(selected)}
                      {selected.components.material && (
                        <span className="sb-material">
                          &nbsp;({selected.components.material})
                        </span>
                      )}
                    </span>
                  </div>
                  <div className="sb-stat">
                    <span className="sb-stat-label">Duration</span>
                    <span className="sb-stat-val">{selected.duration}</span>
                  </div>
                </div>

                <div className="sb-rule" />

                <div className="sb-desc">
                  <p>{selected.description}</p>
                  {selected.higherLevels && (
                    <div className="sb-higher">
                      <span className="sb-higher-label">At Higher Levels. </span>
                      {selected.higherLevels}
                    </div>
                  )}
                </div>

                {isPrepared(selected.id) && (
                  <div className="sb-prepared-badge">✦ Prepared</div>
                )}
              </>
            ) : (
              <div className="sb-empty">
                <div className="sb-empty-orn">✦</div>
                <p>Select a spell to read its incantation.</p>
              </div>
            )}

            <div className="sb-page-number">II</div>
          </div>

        </div>
      </div>
    </div>
  )
}
