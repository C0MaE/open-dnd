import { useState } from 'react'
import type { Character, AbilityName } from '../types'

interface Props {
  character: Character
  onBack: () => void
  onSpellbook: () => void
}

const ABILITY_LABELS: Record<AbilityName, string> = {
  strength:     'STR',
  dexterity:    'DEX',
  constitution: 'CON',
  intelligence: 'INT',
  wisdom:       'WIS',
  charisma:     'CHA',
}

const ABILITY_ORDER: AbilityName[] = [
  'strength', 'dexterity', 'constitution',
  'intelligence', 'wisdom', 'charisma',
]

const SKILL_LABELS: Record<string, string> = {
  acrobatics:     'Acrobatics',
  animalHandling: 'Animal Handling',
  arcana:         'Arcana',
  athletics:      'Athletics',
  deception:      'Deception',
  history:        'History',
  insight:        'Insight',
  intimidation:   'Intimidation',
  investigation:  'Investigation',
  medicine:       'Medicine',
  nature:         'Nature',
  perception:     'Perception',
  performance:    'Performance',
  persuasion:     'Persuasion',
  religion:       'Religion',
  sleightOfHand:  'Sleight of Hand',
  stealth:        'Stealth',
  survival:       'Survival',
}

function mod(score: number) {
  const m = Math.floor((score - 10) / 2)
  return (m >= 0 ? '+' : '') + m
}

function profDot(level: string) {
  if (level === 'expertise')  return '◆'
  if (level === 'proficient') return '◉'
  if (level === 'half')       return '◑'
  return '○'
}

function profDotClass(level: string) {
  if (level === 'expertise')  return 'dot-expertise'
  if (level === 'proficient') return 'dot-proficient'
  if (level === 'half')       return 'dot-half'
  return 'dot-none'
}

export function CharacterSheet({ character, onBack, onSpellbook }: Props) {
  const [hp, setHp] = useState(character.hp.current)
  const [hpInput, setHpInput] = useState('')
  const [editingHp, setEditingHp] = useState(false)

  const isCaster = character.spellcastingAbility !== null

  const hpPercent = Math.max(0, Math.min(100, (hp / character.hp.max) * 100))
  const hpColor = hpPercent > 60 ? '#3a7a3a' : hpPercent > 30 ? '#8a7020' : '#8b1a1a'

  function applyHpDelta(delta: number) {
    setHp(prev => Math.max(0, Math.min(character.hp.max, prev + delta)))
  }

  function commitHpEdit() {
    const v = parseInt(hpInput)
    if (!isNaN(v)) setHp(Math.max(0, Math.min(character.hp.max, v)))
    setEditingHp(false)
    setHpInput('')
  }

  return (
    <div className="ch-screen">
      {/* ── Top bar ── */}
      <div className="ch-topbar">
        <button className="ch-btn-nav" onClick={onBack}>← Back</button>
        <div className="ch-topbar-center">
          <span className="ch-topbar-name">{character.name}</span>
          <span className="ch-topbar-sub">
            {character.race} {character.className} · Level {character.level}
            {character.subclass ? ` · ${character.subclass}` : ''}
          </span>
        </div>
        {isCaster ? (
          <button className="ch-btn-spellbook" onClick={onSpellbook}>
            ✦ Spellbook
          </button>
        ) : (
          <div style={{ width: 96 }} />
        )}
      </div>

      {/* ── Main content ── */}
      <div className="ch-body">

        {/* ── Left column: Ability Scores + Spell Info ── */}
        <div className="ch-col ch-col--left">
          <div className="ch-section-label">Ability Scores</div>
          <div className="ch-abilities">
            {ABILITY_ORDER.map(ab => (
              <div key={ab} className="ch-ability">
                <div className="ch-ability-label">{ABILITY_LABELS[ab]}</div>
                <div className="ch-ability-mod">{mod(character.scores[ab])}</div>
                <div className="ch-ability-score">{character.scores[ab]}</div>
              </div>
            ))}
          </div>

          <div className="ch-rule" />

          <div className="ch-prof-row">
            <span className="ch-prof-label">Proficiency Bonus</span>
            <span className="ch-prof-val">+{character.proficiencyBonus}</span>
          </div>

          {isCaster && (
            <>
              <div className="ch-rule" />
              <div className="ch-section-label">Spellcasting</div>
              <div className="ch-spell-info">
                <div className="ch-spell-row">
                  <span className="ch-spell-key">Ability</span>
                  <span className="ch-spell-val">
                    {character.spellcastingAbility
                      ? ABILITY_LABELS[character.spellcastingAbility as AbilityName] ?? character.spellcastingAbility
                      : '—'}
                  </span>
                </div>
                <div className="ch-spell-row">
                  <span className="ch-spell-key">Save DC</span>
                  <span className="ch-spell-val">{character.spellSaveDC ?? '—'}</span>
                </div>
                <div className="ch-spell-row">
                  <span className="ch-spell-key">Attack Bonus</span>
                  <span className="ch-spell-val">
                    {character.spellAttackBonus !== null
                      ? (character.spellAttackBonus >= 0 ? '+' : '') + character.spellAttackBonus
                      : '—'}
                  </span>
                </div>
                <div className="ch-spell-row">
                  <span className="ch-spell-key">Prepared</span>
                  <span className="ch-spell-val">{character.preparedSpells.length}</span>
                </div>
                <div className="ch-spell-row">
                  <span className="ch-spell-key">Known</span>
                  <span className="ch-spell-val">{character.knownSpells.length}</span>
                </div>
              </div>
            </>
          )}

          {character.inspiration && (
            <>
              <div className="ch-rule" />
              <div className="ch-inspiration">✦ Inspiration</div>
            </>
          )}
        </div>

        {/* ── Center column: HP, Combat Stats, Hit Dice, Death Saves, Conditions ── */}
        <div className="ch-col ch-col--center">

          {/* HP */}
          <div className="ch-hp-block">
            <div className="ch-section-label">Hit Points</div>
            <div className="ch-hp-bar-wrap">
              <div className="ch-hp-bar-track">
                <div
                  className="ch-hp-bar-fill"
                  style={{ width: `${hpPercent}%`, background: hpColor }}
                />
              </div>
            </div>
            <div className="ch-hp-row">
              <button className="ch-hp-btn" onClick={() => applyHpDelta(-1)}>−</button>
              {editingHp ? (
                <input
                  className="ch-hp-input"
                  type="number"
                  value={hpInput}
                  autoFocus
                  onChange={e => setHpInput(e.target.value)}
                  onBlur={commitHpEdit}
                  onKeyDown={e => { if (e.key === 'Enter') commitHpEdit() }}
                />
              ) : (
                <span
                  className="ch-hp-display"
                  onClick={() => { setHpInput(String(hp)); setEditingHp(true) }}
                  title="Click to edit"
                >
                  <span className="ch-hp-current" style={{ color: hpColor }}>{hp}</span>
                  <span className="ch-hp-sep"> / </span>
                  <span className="ch-hp-max">{character.hp.max}</span>
                </span>
              )}
              <button className="ch-hp-btn" onClick={() => applyHpDelta(+1)}>+</button>
            </div>
            {character.hp.temp > 0 && (
              <div className="ch-hp-temp">+{character.hp.temp} temp</div>
            )}
          </div>

          <div className="ch-rule" />

          {/* Combat row */}
          <div className="ch-combat-row">
            <div className="ch-combat-stat">
              <span className="ch-combat-val">{character.ac}</span>
              <span className="ch-combat-key">AC</span>
            </div>
            <div className="ch-combat-sep" />
            <div className="ch-combat-stat">
              <span className="ch-combat-val">
                {character.initiativeBonus >= 0 ? '+' : ''}{character.initiativeBonus}
              </span>
              <span className="ch-combat-key">Initiative</span>
            </div>
            <div className="ch-combat-sep" />
            <div className="ch-combat-stat">
              <span className="ch-combat-val">{character.speed}</span>
              <span className="ch-combat-key">Speed</span>
            </div>
          </div>

          <div className="ch-rule" />

          {/* Hit Dice */}
          <div className="ch-hitdice-row">
            <span className="ch-hitdice-label">Hit Dice</span>
            <span className="ch-hitdice-val">
              {character.hitDice.total - character.hitDice.used}/{character.hitDice.total}
              &nbsp;{character.hitDice.die}
            </span>
          </div>

          <div className="ch-rule" />

          {/* Death Saves */}
          <div className="ch-section-label">Death Saves</div>
          <div className="ch-saves-row">
            <span className="ch-saves-key saves-success">Successes</span>
            <div className="ch-saves-pips">
              {[0,1,2].map(i => (
                <span key={i} className={`ch-pip ${i < character.deathSaves.successes ? 'ch-pip--success' : ''}`}>○</span>
              ))}
            </div>
          </div>
          <div className="ch-saves-row">
            <span className="ch-saves-key saves-failure">Failures</span>
            <div className="ch-saves-pips">
              {[0,1,2].map(i => (
                <span key={i} className={`ch-pip ${i < character.deathSaves.failures ? 'ch-pip--failure' : ''}`}>○</span>
              ))}
            </div>
          </div>

          {/* Conditions */}
          {character.conditions.length > 0 && (
            <>
              <div className="ch-rule" />
              <div className="ch-section-label">Conditions</div>
              <div className="ch-conditions">
                {character.conditions.map((c, i) => (
                  <span key={i} className="ch-condition">{c}</span>
                ))}
              </div>
            </>
          )}
        </div>

        {/* ── Right column: Saving Throws + Skills ── */}
        <div className="ch-col ch-col--right">
          <div className="ch-section-label">Saving Throws</div>
          <div className="ch-throws">
            {ABILITY_ORDER.map(ab => {
              const isProficient = character.savingThrowProficiencies.includes(ab)
              const score = character.scores[ab]
              const bonus = Math.floor((score - 10) / 2) + (isProficient ? character.proficiencyBonus : 0)
              return (
                <div key={ab} className="ch-throw-row">
                  <span className={`ch-throw-dot ${isProficient ? 'dot-proficient' : 'dot-none'}`}>
                    {isProficient ? '◉' : '○'}
                  </span>
                  <span className="ch-throw-name">{ABILITY_LABELS[ab]}</span>
                  <span className="ch-throw-val">{bonus >= 0 ? '+' : ''}{bonus}</span>
                </div>
              )
            })}
          </div>

          <div className="ch-rule" />

          <div className="ch-section-label">Skills</div>
          <div className="ch-skills">
            {character.skills.map(skill => {
              const score = character.scores[skill.ability]
              const base = Math.floor((score - 10) / 2)
              const pb = character.proficiencyBonus
              const bonus =
                skill.proficiency === 'expertise'  ? base + pb * 2 :
                skill.proficiency === 'proficient' ? base + pb :
                skill.proficiency === 'half'       ? base + Math.floor(pb / 2) :
                base
              return (
                <div key={skill.name} className="ch-skill-row">
                  <span className={`ch-skill-dot ${profDotClass(skill.proficiency)}`}>
                    {profDot(skill.proficiency)}
                  </span>
                  <span className="ch-skill-name">{SKILL_LABELS[skill.name] ?? skill.name}</span>
                  <span className="ch-skill-ability">({ABILITY_LABELS[skill.ability]})</span>
                  <span className="ch-skill-val">{bonus >= 0 ? '+' : ''}{bonus}</span>
                </div>
              )
            })}
          </div>
        </div>

      </div>

      {/* ── Footer strip ── */}
      <div className="ch-footer">
        <div className="ch-footer-block">
          <span className="ch-footer-label">Languages</span>
          <span className="ch-footer-val">{character.languages.join(', ')}</span>
        </div>
        <div className="ch-footer-sep" />
        <div className="ch-footer-block">
          <span className="ch-footer-label">Currency</span>
          <span className="ch-footer-val">
            {character.currency.pp > 0 ? `${character.currency.pp}pp ` : ''}
            {character.currency.gp > 0 ? `${character.currency.gp}gp ` : ''}
            {character.currency.ep > 0 ? `${character.currency.ep}ep ` : ''}
            {character.currency.sp > 0 ? `${character.currency.sp}sp ` : ''}
            {character.currency.cp > 0 ? `${character.currency.cp}cp` : ''}
          </span>
        </div>
        {character.features.length > 0 && (
          <>
            <div className="ch-footer-sep" />
            <div className="ch-footer-block ch-footer-features">
              <span className="ch-footer-label">Features</span>
              <span className="ch-footer-val">
                {character.features.map(f => f.name).join(' · ')}
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
