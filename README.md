
# ApplyWise AI 🚀

ApplyWise is a next-gen, decentralized AI career assistant browser extension designed to help candidates navigate job applications with contextual intelligence, automated semantic mapping, and local-first data security.

## ✨ Key Features

- **Semantic Form Mapping**: Automatically detects job application fields and maps them to your career profile with high accuracy.
- **Neural Resume Parsing**: Upload a resume (PDF/DOCX) and let Gemini 3 Flash extract structured data into your profile.
- **AI Essay Architect**: Refine your application essays with professional tone adjustments and achievement-focused rewriting.
- **Veo Studio**: Generate high-quality professional video introductions using Google's Veo video generation model.
- **Local-First Vault**: Your personal data is encrypted and stored strictly in your browser. No cloud syncing of PII.
- **Audio Coaching**: Conduct real-time mock interviews with Zephyr, our low-latency AI career coach.

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS, Lucide Icons.
- **AI Core**: Google Gemini API (@google/genai).
- **Extension**: Chrome Manifest V3, SidePanel API, Content Scripts.
- **Security**: Crypto-JS (AES Encryption), DOMPurify (XSS Sanitization).
- **Testing**: Vitest, React Testing Library.

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+)
- npm or yarn
- A Google Gemini API Key from [AI Studio](https://aistudio.google.com/)

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   ```bash
   cp .env.local.example .env.local
   # Add your API_KEY to .env.local
   ```
4. Start development server:
   ```bash
   npm run dev
   ```

### Building the Extension

```bash
npm run build
```
The production bundle will be in the `dist/` directory. You can load this into Chrome via `chrome://extensions` by enabling "Developer mode" and selecting "Load unpacked".

## 🧪 Testing

Run unit and component tests with Vitest:
```bash
npm test
```
Generate coverage reports:
```bash
npm run test:coverage
```

## 🔒 Security

ApplyWise follows strict security protocols:
- **AES-256 Encryption**: All local storage data is encrypted at rest.
- **Content Sanitization**: All user inputs and AI outputs are sanitized to prevent XSS.
- **Rate Limiting**: Intelligent client-side rate limiting prevents API abuse.
- **Zero-PII Cloud**: Personal identifiable information never leaves your machine.

## 📄 License

MIT © 2024 ApplyWise AI
