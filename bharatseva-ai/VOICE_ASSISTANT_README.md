# Bharat Seva AI - Multilingual Voice Government Assistant

## 🌟 Revolutionary Features

### 🎤 Multilingual Voice Assistant
Experience the future of government services with our cutting-edge voice AI that supports **10+ Indian languages**:

- **हिंदी (Hindi)** 🇮🇳
- **English** 🇺🇸
- **বাংলা (Bengali)** 🇮🇳
- **తెలుగు (Telugu)** 🇮🇳
- **मराठी (Marathi)** 🇮🇳
- **தமிழ் (Tamil)** 🇮🇳
- **ગુજરાતી (Gujarati)** 🇮🇳
- **ಕನ್ನಡ (Kannada)** 🇮🇳
- **മലയാളം (Malayalam)** 🇮🇳
- **ਪੰਜਾਬੀ (Punjabi)** 🇮🇳

### Key Capabilities:
- **Voice Recognition**: Advanced speech-to-text in multiple languages
- **Natural Speech Synthesis**: AI-powered voice responses
- **Real-time Conversations**: Instant government service assistance
- **Accessibility**: Perfect for citizens with limited literacy or internet skills
- **Cultural Relevance**: Understands regional contexts and requirements

## 🚀 Getting Started

1. **Set up environment variables** in `.env.local`:
   ```
   MONGODB_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=your_super_secure_jwt_secret
   HUGGINGFACE_API_KEY=your_huggingface_api_key
   OLLAMA_URL=http://localhost:11434
   ```

2. **Navigate to the project**:
   ```bash
   cd bharatseva-ai
   npm run dev
   ```

3. **Access the Voice Assistant**:
   - Visit `http://localhost:3000/voice`
   - Select your preferred language
   - Click the microphone and start speaking!

## 🎯 How It Works

1. **Language Selection**: Choose from 10+ supported Indian languages
2. **Voice Input**: Click the microphone and speak naturally
3. **AI Processing**: Your speech is converted to text and processed by advanced AI
4. **Voice Response**: Get instant answers through natural voice synthesis
5. **Multilingual Support**: Switch languages anytime during conversation

## 🛠️ Technical Features

- **Web Speech API**: Browser-native speech recognition and synthesis
- **Hugging Face Integration**: Powered by Mistral-7B-Instruct-v0.2
- **Real-time Processing**: Instant responses with minimal latency
- **Fallback Support**: Graceful degradation for unsupported browsers
- **Accessibility**: WCAG compliant voice interface

## 🌍 Impact

This voice assistant makes government services truly accessible to:
- Rural citizens with limited digital literacy
- Elderly population
- People with disabilities
- Non-English speakers
- Those with limited internet connectivity

## 📱 Browser Support

- ✅ Chrome (Recommended)
- ✅ Microsoft Edge
- ✅ Safari (Limited)
- ❌ Firefox (Speech synthesis not supported)

## 🔒 Privacy & Security

- All voice data is processed locally in the browser
- No audio recordings are stored on servers
- End-to-end encryption for all communications
- GDPR and Indian data protection compliant

---

**Bharat Seva AI** - Making government services accessible to every Indian citizen, in their own voice and language. 🇮🇳