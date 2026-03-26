# open-dnd

An offline-first D&D 5e character manager for the desktop. No account required — your characters live on your machine.

Built with [Tauri 2](https://tauri.app), React 19, TypeScript, and SQLite.

---

## Features

- **Character creation** — choose race, class, background, and ability scores with the step-by-step builder
- **Character sheet** — track HP, temp HP, conditions, death saves, hit dice, and inspiration; all changes auto-save
- **Spellbook** — browse 100+ spells by level and school, learn/forget spells, and mark prepared spells
- **Inventory** — add items manually or browse the built-in PHB catalog; track weight and carrying capacity
- **Edit & delete** — edit name, level, XP, subclass, and alignment, or delete a character (with confirmation)
- **Import / export** — export your inventory to JSON and import it back on any machine
- **Offline-first** — everything is stored locally in SQLite; no server, no account needed
- **Optional sync** *(coming soon)* — opt-in account sync to share characters across devices

---

## Download

Go to the [Releases](https://github.com/C0MaE/open-dnd-app/releases) page and grab the installer for your OS:

| Platform | File |
|----------|------|
| Windows | `.msi` or `.exe` (NSIS installer) |
| macOS | `.dmg` |
| Linux (Debian/Ubuntu) | `.deb` |
| Linux (any distro) | `.AppImage` |

### Linux AppImage

```bash
chmod +x open-dnd_*.AppImage
./open-dnd_*.AppImage
```

---

## Build from source

### Prerequisites

| Tool | Version |
|------|---------|
| [Node.js](https://nodejs.org) | 20+ |
| [Rust](https://rustup.rs) | stable |
| [Tauri CLI prerequisites](https://tauri.app/start/prerequisites/) | see link |

On Debian/Ubuntu, install the system libraries Tauri needs:

```bash
sudo apt-get install -y \
  libwebkit2gtk-4.1-dev \
  libappindicator3-dev \
  librsvg2-dev \
  patchelf
```

### Run in development

```bash
git clone https://github.com/C0MaE/open-dnd-app.git
cd open-dnd-app
npm install
npm run tauri -- dev
```

### Build a release binary

```bash
# All bundles for your platform
npm run tauri:build

# Linux AppImage only
npm run tauri:build:appimage

# Linux .deb only
npm run tauri:build:deb
```

The compiled artifacts land in `src-tauri/target/release/bundle/`.

---

## Releasing a new version

1. Bump the version in `package.json` and `src-tauri/tauri.conf.json` (both must match).
2. Commit and push.
3. Tag the commit:
   ```bash
   git tag v0.2.0
   git push origin v0.2.0
   ```
4. GitHub Actions builds Windows, macOS, and Linux binaries automatically and creates a draft release.
5. Review the draft on the [Releases](https://github.com/C0MaE/open-dnd-app/releases) page, add release notes, and publish.

---

## Tech stack

| Layer | Technology |
|-------|-----------|
| Desktop shell | Tauri 2 (Rust) |
| Frontend | React 19 + TypeScript + Vite |
| Styling | Tailwind CSS 4 |
| Storage | SQLite via Tauri plugin |
| CI/CD | GitHub Actions |

---

## Contributing

Bug reports and pull requests are welcome. For major changes, open an issue first to discuss what you'd like to change.

---

## License

[MIT](LICENSE)
