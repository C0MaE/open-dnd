import { useState } from 'react'
import type { Character, AbilityName } from '../types'

interface Props {
  character: Character
  onBack: () => void
  onSpellbook: () => void
}

const ABILITY_LABELS: Record<AbilityName, string> = {
  strength: 'STR', dexterity: 'DEX', constitution: 'CON',
  intelligence: 'INT', wisdom: 'WIS', charisma: 'CHA',
}

const ABILITY_ORDER: AbilityName[] = [
  'strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma',
]

const SKILL_LABELS: Record<string, string> = {
  acrobatics: 'Acrobatics', animalHandling: 'Animal Handling', arcana: 'Arcana',
  athletics: 'Athletics', deception: 'Deception', history: 'History',
  insight: 'Insight', intimidation: 'Intimidation', investigation: 'Investigation',
  medicine: 'Medicine', nature: 'Nature', perception: 'Perception',
  performance: 'Performance', persuasion: 'Persuasion', religion: 'Religion',
  sleightOfHand: 'Sleight of Hand', stealth: 'Stealth', survival: 'Survival',
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

const DOT_COLOR: Record<string, string> = {
  expertise:  'text-[#2a408a]',
  proficient: 'text-[#2a5a28]',
  half:       'text-[#7a6020]',
  none:       'text-[rgba(100,70,20,0.3)]',
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

  /* Shared section label */
  const SectionLabel = ({ children }: { children: React.ReactNode }) => (
    <div className="font-cinzel text-deco text-red-ink tracking-[0.28em] uppercase mb-[clamp(5px,0.7vh,10px)]">
      {children}
    </div>
  )

  /* Gradient divider */
  const Rule = () => (
    <div className="deco-rule-subtle my-[clamp(6px,0.9vh,13px)]" />
  )

  return (
    <div className="w-screen h-screen flex flex-col bg-dungeon animate-fade-up-fast overflow-hidden">

      {/* ── Top bar ── */}
      <div className="flex items-center justify-between bg-topbar border-b border-[#1e1608] shrink-0 px-[clamp(14px,1.8vw,28px)] py-[clamp(8px,1.2vh,16px)]">
        <button
          onClick={onBack}
          className="font-cinzel text-caption tracking-[0.12em] text-[#8a7040] bg-transparent border border-[#2e2010] px-[clamp(12px,1.4vw,22px)] py-[clamp(5px,0.6vh,9px)] cursor-pointer rounded-sm transition-colors hover:text-gold hover:border-[#5a4020] whitespace-nowrap"
        >
          ← Back
        </button>

        <div className="text-center">
          <span className="block font-cinzel-deco text-heading text-gold tracking-[0.06em] leading-[1.2]">
            {character.name}
          </span>
          <span className="block font-fell-sc text-badge text-[#5a4a28] tracking-[0.12em] mt-0.5">
            {character.race} {character.className} · Level {character.level}
            {character.subclass ? ` · ${character.subclass}` : ''}
          </span>
        </div>

        {isCaster ? (
          <button
            onClick={onSpellbook}
            className="font-cinzel text-caption tracking-[0.1em] text-gold-dim border border-[#5a3e14] px-[clamp(12px,1.4vw,22px)] py-[clamp(5px,0.6vh,9px)] cursor-pointer rounded-sm whitespace-nowrap transition-[color,border-color,box-shadow] hover:text-gold hover:border-gold-dim"
            style={{
              background: 'linear-gradient(160deg, #2a1a06 0%, #1a1004 100%)',
              boxShadow: '0 2px 8px rgba(0,0,0,0.5)',
            }}
          >
            ✦ Spellbook
          </button>
        ) : (
          <div className="w-[clamp(100px,10vw,160px)]" />
        )}
      </div>

      {/* ── 3-column body ── */}
      <div className="flex-1 flex bg-parchment-sheet shadow-sheet rounded-sm overflow-hidden min-h-0 mx-[clamp(10px,1.2vw,20px)] mt-[clamp(8px,1.2vh,16px)] mb-[clamp(6px,0.8vh,12px)]">

        {/* ── Left column: Ability Scores + Spell Info ── */}
        <div className="flex flex-col overflow-y-auto parchment-scroll px-[clamp(10px,1.2vw,20px)] py-[clamp(10px,1.4vh,20px)] shrink-0 border-r border-[rgba(100,70,20,0.2)] w-[clamp(185px,17vw,310px)]"
             style={{ background: 'linear-gradient(to right, rgba(90,60,10,0.04), transparent)' }}>

          <SectionLabel>Ability Scores</SectionLabel>
          <div className="grid grid-cols-2 gap-[clamp(5px,0.7vh,10px)_clamp(6px,0.8vw,12px)] mb-[clamp(4px,0.5vh,8px)]">
            {ABILITY_ORDER.map(ab => (
              <div key={ab} className="flex flex-col items-center px-[clamp(4px,0.5vw,8px)] py-[clamp(5px,0.8vh,12px)] rounded-sm border border-[rgba(100,70,20,0.2)] bg-[rgba(90,60,10,0.07)]">
                <span className="font-cinzel text-deco text-red-ink tracking-[0.15em] uppercase mb-0.5">
                  {ABILITY_LABELS[ab]}
                </span>
                <span className="font-cinzel-deco text-display text-ink leading-none">
                  {mod(character.scores[ab])}
                </span>
                <span className="font-fell-sc text-badge text-[#7a5820] mt-0.5">
                  {character.scores[ab]}
                </span>
              </div>
            ))}
          </div>

          <Rule />

          <div className="flex items-center justify-between py-[clamp(3px,0.4vh,6px)]">
            <span className="font-fell-sc text-caption text-[#5a3a18]">Proficiency Bonus</span>
            <span className="font-cinzel text-body text-ink">+{character.proficiencyBonus}</span>
          </div>

          {isCaster && (
            <>
              <Rule />
              <SectionLabel>Spellcasting</SectionLabel>
              <div className="flex flex-col gap-[clamp(2px,0.4vh,5px)]">
                {[
                  { k: 'Ability',       v: character.spellcastingAbility
                      ? (ABILITY_LABELS[character.spellcastingAbility as AbilityName] ?? character.spellcastingAbility)
                      : '—' },
                  { k: 'Save DC',       v: String(character.spellSaveDC ?? '—') },
                  { k: 'Attack Bonus',  v: character.spellAttackBonus !== null
                      ? (character.spellAttackBonus >= 0 ? '+' : '') + character.spellAttackBonus
                      : '—' },
                  { k: 'Prepared',      v: String(character.preparedSpells.length) },
                  { k: 'Known',         v: String(character.knownSpells.length) },
                ].map(({ k, v }) => (
                  <div key={k} className="flex justify-between items-center">
                    <span className="font-fell-sc text-caption text-[#7a5030]">{k}</span>
                    <span className="font-cinzel text-caption text-ink">{v}</span>
                  </div>
                ))}
              </div>
            </>
          )}

          {character.inspiration && (
            <>
              <Rule />
              <div className="font-cinzel text-badge tracking-[0.18em] text-[#4a7028] text-center py-[clamp(3px,0.4vh,7px)] border border-[rgba(74,112,40,0.3)] rounded-sm bg-[rgba(74,112,40,0.06)]">
                ✦ Inspiration
              </div>
            </>
          )}
        </div>

        {/* ── Center column: HP, Combat, Hit Dice, Death Saves ── */}
        <div className="flex flex-col flex-1 overflow-y-auto parchment-scroll px-[clamp(10px,1.2vw,20px)] py-[clamp(10px,1.4vh,20px)] border-r border-[rgba(100,70,20,0.2)]">

          {/* HP */}
          <SectionLabel>Hit Points</SectionLabel>
          <div className="h-[clamp(8px,1.2vh,16px)] rounded-md border border-[rgba(100,70,20,0.2)] overflow-hidden my-[clamp(4px,0.7vh,10px)]"
               style={{ background: 'rgba(0,0,0,0.12)' }}>
            <div className="h-full rounded-md transition-[width,background] duration-300"
                 style={{ width: `${hpPercent}%`, background: hpColor }} />
          </div>

          <div className="flex items-center justify-center gap-[clamp(8px,1.2vw,20px)] mt-[clamp(4px,0.6vh,8px)]">
            <button
              onClick={() => applyHpDelta(-1)}
              className="flex items-center justify-center w-[clamp(24px,2.2vw,34px)] h-[clamp(24px,2.2vw,34px)] border border-[rgba(100,70,20,0.3)] rounded-sm cursor-pointer text-subhead text-ink-light transition-colors hover:bg-[rgba(90,60,10,0.22)]"
              style={{ background: 'rgba(90,60,10,0.1)' }}
            >−</button>

            {editingHp ? (
              <input
                className="w-[clamp(60px,6vw,90px)] text-center font-cinzel-deco text-display bg-[rgba(255,240,180,0.5)] border border-[rgba(100,70,20,0.4)] rounded-sm text-ink p-1"
                type="number"
                value={hpInput}
                autoFocus
                onChange={e => setHpInput(e.target.value)}
                onBlur={commitHpEdit}
                onKeyDown={e => { if (e.key === 'Enter') commitHpEdit() }}
              />
            ) : (
              <span className="cursor-text" onClick={() => { setHpInput(String(hp)); setEditingHp(true) }} title="Click to edit">
                <span className="font-cinzel-deco text-giant leading-none" style={{ color: hpColor }}>{hp}</span>
                <span className="font-fell text-heading text-[#8a7040]"> / </span>
                <span className="font-cinzel text-heading text-[#5a4020]">{character.hp.max}</span>
              </span>
            )}

            <button
              onClick={() => applyHpDelta(+1)}
              className="flex items-center justify-center w-[clamp(24px,2.2vw,34px)] h-[clamp(24px,2.2vw,34px)] border border-[rgba(100,70,20,0.3)] rounded-sm cursor-pointer text-subhead text-ink-light transition-colors hover:bg-[rgba(90,60,10,0.22)]"
              style={{ background: 'rgba(90,60,10,0.1)' }}
            >+</button>
          </div>

          {character.hp.temp > 0 && (
            <div className="font-fell-sc text-badge text-[#3a6a8a] text-center mt-0.5">
              +{character.hp.temp} temp
            </div>
          )}

          <Rule />

          {/* Combat row */}
          <div className="flex items-center justify-center">
            {[
              { val: String(character.ac), key: 'AC' },
              { val: (character.initiativeBonus >= 0 ? '+' : '') + character.initiativeBonus, key: 'Initiative' },
              { val: String(character.speed), key: 'Speed' },
            ].map(({ val, key }, i) => (
              <>
                {i > 0 && (
                  <div key={`sep-${i}`} className="deco-vline h-[clamp(30px,4vh,50px)] mx-2" />
                )}
                <div key={key} className="flex flex-col items-center flex-1">
                  <span className="font-cinzel-deco text-display text-ink leading-none">{val}</span>
                  <span className="font-cinzel text-deco text-red-ink tracking-[0.18em] uppercase mt-0.5">{key}</span>
                </div>
              </>
            ))}
          </div>

          <Rule />

          {/* Hit Dice */}
          <div className="flex justify-between items-center">
            <span className="font-fell-sc text-caption text-[#5a3a18]">Hit Dice</span>
            <span className="font-cinzel text-caption text-ink">
              {character.hitDice.total - character.hitDice.used}/{character.hitDice.total}&nbsp;{character.hitDice.die}
            </span>
          </div>

          <Rule />

          {/* Death Saves */}
          <SectionLabel>Death Saves</SectionLabel>
          {[
            { label: 'Successes', count: character.deathSaves.successes, cls: 'text-[#3a6a28]', pip: 'ch-pip-success' },
            { label: 'Failures',  count: character.deathSaves.failures,  cls: 'text-red-ink',   pip: 'ch-pip-failure' },
          ].map(({ label, count, cls }) => (
            <div key={label} className="flex items-center justify-between mb-[clamp(3px,0.4vh,6px)]">
              <span className={`font-fell-sc text-caption ${cls}`}>{label}</span>
              <div className="flex gap-[clamp(5px,0.8vw,10px)]">
                {[0,1,2].map(i => (
                  <span key={i} className={`text-body ${i < count ? cls : 'text-[rgba(100,70,20,0.3)]'}`}>○</span>
                ))}
              </div>
            </div>
          ))}

          {/* Conditions */}
          {character.conditions.length > 0 && (
            <>
              <Rule />
              <SectionLabel>Conditions</SectionLabel>
              <div className="flex flex-wrap gap-1.5">
                {character.conditions.map((c, i) => (
                  <span key={i} className="font-cinzel text-deco tracking-[0.1em] text-red-ink bg-[rgba(139,26,26,0.08)] border border-[rgba(139,26,26,0.2)] px-2 py-0.5 rounded-sm">
                    {c}
                  </span>
                ))}
              </div>
            </>
          )}
        </div>

        {/* ── Right column: Saving Throws + Skills ── */}
        <div className="flex flex-col overflow-hidden px-[clamp(10px,1.2vw,20px)] py-[clamp(10px,1.4vh,20px)] shrink-0 w-[clamp(220px,22vw,400px)]">

          <SectionLabel>Saving Throws</SectionLabel>
          <div className="flex flex-col gap-[clamp(2px,0.4vh,6px)] mb-1">
            {ABILITY_ORDER.map(ab => {
              const isProficient = character.savingThrowProficiencies.includes(ab)
              const bonus = Math.floor((character.scores[ab] - 10) / 2) + (isProficient ? character.proficiencyBonus : 0)
              return (
                <div key={ab} className="flex items-center gap-[clamp(5px,0.7vw,10px)]">
                  <span className={`text-caption ${isProficient ? 'text-[#2a5a28]' : 'text-[rgba(100,70,20,0.3)]'}`}>
                    {isProficient ? '◉' : '○'}
                  </span>
                  <span className="font-fell-sc text-caption text-ink w-[clamp(28px,2.6vw,44px)] shrink-0">
                    {ABILITY_LABELS[ab]}
                  </span>
                  <span className="font-cinzel text-caption text-[#2a2a1a] ml-auto">
                    {bonus >= 0 ? '+' : ''}{bonus}
                  </span>
                </div>
              )
            })}
          </div>

          <Rule />

          <SectionLabel>Skills</SectionLabel>
          <div className="flex flex-col gap-[clamp(1px,0.3vh,4px)] overflow-y-auto flex-1 min-h-0 pr-0.5 parchment-scroll">
            {character.skills.map(skill => {
              const base = Math.floor((character.scores[skill.ability] - 10) / 2)
              const pb = character.proficiencyBonus
              const bonus =
                skill.proficiency === 'expertise'  ? base + pb * 2 :
                skill.proficiency === 'proficient' ? base + pb :
                skill.proficiency === 'half'       ? base + Math.floor(pb / 2) :
                base
              return (
                <div key={skill.name} className="flex items-center gap-[clamp(4px,0.5vw,8px)] px-0.5 py-[clamp(1px,0.3vh,4px)] rounded-sm hover:bg-[rgba(90,60,10,0.08)] transition-colors">
                  <span className={`text-caption shrink-0 ${DOT_COLOR[skill.proficiency]}`}>
                    {profDot(skill.proficiency)}
                  </span>
                  <span className="font-fell-sc text-caption text-ink flex-1 whitespace-nowrap">
                    {SKILL_LABELS[skill.name] ?? skill.name}
                  </span>
                  <span className="font-cinzel text-deco text-[#9a7850] shrink-0">
                    ({ABILITY_LABELS[skill.ability]})
                  </span>
                  <span className="font-cinzel text-caption text-[#2a2a1a] w-[clamp(22px,2.2vw,34px)] text-right shrink-0">
                    {bonus >= 0 ? '+' : ''}{bonus}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* ── Footer strip ── */}
      <div className="flex items-center flex-wrap bg-parchment-footer shadow-footer rounded-sm shrink-0 px-[clamp(12px,1.4vw,22px)] py-[clamp(6px,0.9vh,12px)] mx-[clamp(10px,1.2vw,20px)] mb-[clamp(8px,1.1vh,14px)]">
        <div className="flex flex-col flex-1 min-w-0">
          <span className="font-cinzel text-deco text-red-ink tracking-[0.2em] uppercase mb-0.5">Languages</span>
          <span className="font-fell-sc text-caption text-ink leading-[1.35] whitespace-nowrap overflow-hidden text-ellipsis">
            {character.languages.join(', ')}
          </span>
        </div>

        <div className="deco-vline h-[clamp(24px,3.5vh,40px)] mx-[clamp(10px,1.2vw,18px)]" />

        <div className="flex flex-col flex-1 min-w-0">
          <span className="font-cinzel text-deco text-red-ink tracking-[0.2em] uppercase mb-0.5">Currency</span>
          <span className="font-fell-sc text-caption text-ink leading-[1.35] whitespace-nowrap overflow-hidden text-ellipsis">
            {[
              character.currency.pp > 0 ? `${character.currency.pp}pp` : '',
              character.currency.gp > 0 ? `${character.currency.gp}gp` : '',
              character.currency.ep > 0 ? `${character.currency.ep}ep` : '',
              character.currency.sp > 0 ? `${character.currency.sp}sp` : '',
              character.currency.cp > 0 ? `${character.currency.cp}cp` : '',
            ].filter(Boolean).join(' ')}
          </span>
        </div>

        {character.features.length > 0 && (
          <>
            <div className="deco-vline h-[clamp(24px,3.5vh,40px)] mx-[clamp(10px,1.2vw,18px)]" />
            <div className="flex flex-col flex-[2] min-w-0">
              <span className="font-cinzel text-deco text-red-ink tracking-[0.2em] uppercase mb-0.5">Features</span>
              <span className="font-fell-sc text-caption text-ink leading-[1.35] whitespace-nowrap overflow-hidden text-ellipsis">
                {character.features.map(f => f.name).join(' · ')}
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
