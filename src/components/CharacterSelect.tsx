import type { Character } from '../types'
import { mockCharacters } from '../data/mockData'

interface Props {
  onSelect: (character: Character) => void
}

const CLASS_SYMBOL: Record<string, string> = {
  Wizard:    '✦',
  Fighter:   '⚔',
  Cleric:    '☩',
  Rogue:     '◈',
  Ranger:    '◎',
  Bard:      '♪',
  Paladin:   '✠',
  Barbarian: '⚡',
  Druid:     '✿',
  Monk:      '◯',
  Sorcerer:  '✧',
  Warlock:   '◆',
}

const ALIGNMENT_SHORT: Record<string, string> = {
  'Lawful Good':    'LG',
  'Neutral Good':   'NG',
  'Chaotic Good':   'CG',
  'Lawful Neutral': 'LN',
  'True Neutral':   'TN',
  'Chaotic Neutral':'CN',
  'Lawful Evil':    'LE',
  'Neutral Evil':   'NE',
  'Chaotic Evil':   'CE',
}

export function CharacterSelect({ onSelect }: Props) {
  return (
    <div className="cs-screen">
      <header className="cs-header">
        <div className="cs-deco">✦ · ⚔ · ✦</div>
        <h1 className="cs-title">Open D&amp;D</h1>
        <p className="cs-subtitle">Choose your adventurer</p>
      </header>

      <div className="cs-cards">
        {mockCharacters.map(char => (
          <button
            key={char.id}
            className="cs-card"
            onClick={() => onSelect(char)}
          >
            {/* Corner ornaments */}
            <span className="cs-corner cs-corner--tl">✦</span>
            <span className="cs-corner cs-corner--tr">✦</span>
            <span className="cs-corner cs-corner--bl">✦</span>
            <span className="cs-corner cs-corner--br">✦</span>

            <div className="cs-card-symbol">
              {CLASS_SYMBOL[char.className] ?? '◈'}
            </div>

            <div className="cs-card-name">{char.name}</div>
            <div className="cs-card-race">{char.race}</div>

            <div className="cs-card-divider" />

            <div className="cs-card-class">
              {char.className}
              {char.subclass ? ` · ${char.subclass}` : ''}
            </div>
            <div className="cs-card-level">Level {char.level}</div>

            <div className="cs-card-divider" />

            <div className="cs-card-stats">
              <div className="cs-stat">
                <span className="cs-stat-label">HP</span>
                <span className="cs-stat-value cs-stat-hp">
                  {char.hp.current}/{char.hp.max}
                </span>
              </div>
              <div className="cs-stat-sep">·</div>
              <div className="cs-stat">
                <span className="cs-stat-label">AC</span>
                <span className="cs-stat-value cs-stat-ac">{char.ac}</span>
              </div>
              <div className="cs-stat-sep">·</div>
              <div className="cs-stat">
                <span className="cs-stat-label">Align</span>
                <span className="cs-stat-value">
                  {ALIGNMENT_SHORT[char.alignment] ?? '—'}
                </span>
              </div>
            </div>

            {char.spellcastingAbility && (
              <div className="cs-card-caster">
                ✦ {char.spellcastingAbility} caster
              </div>
            )}
          </button>
        ))}
      </div>

      <footer className="cs-footer">
        <span>✦</span>
        <span className="cs-footer-line" />
        <span>✦</span>
        <span className="cs-footer-line" />
        <span>✦</span>
      </footer>
    </div>
  )
}
