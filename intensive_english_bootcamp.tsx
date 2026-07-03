import React, { useState, useEffect, useRef } from 'react';

// 90-Days Learning Journey Map & Curriculum Data
const MAP_STAGES = [
  { id: 'island-1', name: 'Island 1: Foundation', icon: '🌱', desc: 'Membangun dasar bahasa Inggris dari nol', status: 'unlocked', progress: 60, color: 'bg-emerald-500' },
  { id: 'school-town', name: 'School Town', icon: '🏫', desc: 'Kosakata sekolah, harian, & tata bahasa dasar', status: 'locked', progress: 0, color: 'bg-blue-500' },
  { id: 'family-village', name: 'Family Village', icon: '🏡', desc: 'Memperkenalkan keluarga & kepemilikan', status: 'locked', progress: 0, color: 'bg-amber-500' },
  { id: 'food-city', name: 'Food City', icon: '🍔', desc: 'Pemesanan makanan, belanja, & aktivitas harian', status: 'locked', progress: 0, color: 'bg-orange-500' },
  { id: 'travel-world', name: 'Travel World', icon: '✈', desc: 'Arah jalan, cuaca, & percakapan perjalanan', status: 'locked', progress: 0, color: 'bg-indigo-500' },
  { id: 'english-kingdom', name: 'English Kingdom', icon: '👑', desc: 'Komunikasi tingkat lanjut & presentasi publik', status: 'locked', progress: 0, color: 'bg-purple-500' }
];

const CURRICULUM_OUTLINE = {
  month1: {
    title: "BULAN 1: FOUNDATION",
    weeks: [
      {
        num: 1,
        title: "Week 1: Welcome Explorer & Alphabet",
        days: [
          { id: 'm1w1d1', num: 1, title: 'Welcome Explorer!', desc: 'Mengenal English & Mind Map', active: true },
          { id: 'm1w1d2', num: 2, title: 'Alphabet & Spelling', desc: 'Mengeja nama & huruf A-Z' },
          { id: 'm1w1d3', num: 3, title: 'Pronunciation Lab', desc: 'Vokal, konsonan & intonasi dasar' },
          { id: 'm1w1d4', num: 4, title: 'School Vocabulary', desc: 'Nama benda di kelas & sekolah' },
          { id: 'm1w1d5', num: 5, title: 'Greetings & Intros', desc: 'Sapaan formal & informal' },
          { id: 'm1w1d6', num: 6, title: 'Weekly Boss Challenge', desc: 'Ujian komprehensif minggu ke-1' }
        ]
      },
      {
        num: 2,
        title: "Week 2: School Life",
        details: "Mempelajari Part of Speech (Noun, Pronoun, Verb, Adjective, Adverb) dengan proyek kelas 'My Classroom Poster'."
      },
      {
        num: 3,
        title: "Week 3: Family Connection",
        details: "Mempelajari anggota keluarga besar, demonstrative pronouns (this, that, these, those), serta proyek silsilah keluarga (Family Tree)."
      },
      {
        num: 4,
        title: "Week 4: Daily Activity & Routine",
        details: "Mempelajari Simple Present Tense untuk menceritakan kegiatan sehari-hari (My Daily Routine)."
      }
    ]
  },
  month2: {
    title: "BULAN 2: REAL WORLD ENGLISH",
    weeks: [
      { num: 5, title: "Week 5: Food & Restaurants", details: "Pemesanan makanan di restoran, kosakata alat makan, dan percakapan fungsional." },
      { num: 6, title: "Week 6: Shopping & Bargaining", details: "Berbelanja, tawar-menawar harga, dan menghitung uang dalam bahasa Inggris." },
      { num: 7, title: "Week 7: Health & Hospital", details: "Menjelaskan gejala penyakit, bagian tubuh, dan meminta pertolongan pertama." },
      { num: 8, title: "Week 8: Transportation & Direction", details: "Membaca rute perjalanan, transportasi umum, dan menanyakan arah jalan." }
    ]
  },
  month3: {
    title: "BULAN 3: CONFIDENT SPEAKING",
    weeks: [
      { num: 9, title: "Week 9: Past Experiences", details: "Menggunakan Simple Past Tense untuk menceritakan masa lalu (Recount Text)." },
      { num: 10, title: "Week 10: Future Dreams", details: "Membahas cita-cita, rencana masa depan, dan penggunaan Simple Future (Will/Be going to)." },
      { num: 11, title: "Week 11: Comparisons", details: "Menggunakan Comparative & Superlative adjectives untuk membandingkan benda/tempat." },
      { num: 12, title: "Week 12: Graduation Showcase", details: "Proyek akhir membuat video presentasi bahasa Inggris 'My Dream School' & Public Speaking Challenge." }
    ]
  }
};

const VOCAB_DATABASE = [
  { word: "Bag", meaning: "Tas", emoji: "🎒", phonics: "/bæɡ/" },
  { word: "Book", meaning: "Buku", emoji: "📖", phonics: "/bʊk/" },
  { word: "Chair", meaning: "Kursi", emoji: "🪑", phonics: "/tʃeər/" },
  { word: "Teacher", meaning: "Guru", emoji: "👩‍🏫", phonics: "/ˈtiː.tʃər/" },
  { word: "Student", meaning: "Siswa", emoji: "🧑‍🎓", phonics: "/ˈstjuː.dənt/" },
  { word: "Pen", meaning: "Pena", emoji: "🖊", phonics: "/pen/" },
  { word: "Pencil", meaning: "Pensil", emoji: "✏", phonics: "/ˈpen.səl/" },
  { word: "Classroom", meaning: "Ruang Kelas", emoji: "🏫", phonics: "/ˈklɑːs.ruːm/" }
];

// Custom Sound Synthesizers for Duolingo-style rewards
const playSoundFX = (type) => {
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    
    osc.connect(gain);
    gain.connect(audioCtx.destination);

    if (type === 'success') {
      // Arpeggio up for correct answers
      const now = audioCtx.currentTime;
      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.setValueAtTime(659.25, now + 0.1, now + 0.1); // E5
      osc.frequency.setValueAtTime(783.99, now + 0.2, now + 0.2); // G5
      osc.frequency.setValueAtTime(1046.50, now + 0.3, now + 0.3); // C6
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
      osc.start(now);
      osc.stop(now + 0.5);
    } else if (type === 'error') {
      // Downbeat buzz for wrong answers
      const now = audioCtx.currentTime;
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(150, now);
      osc.frequency.exponentialRampToValueAtTime(90, now + 0.3);
      gain.gain.setValueAtTime(0.4, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);
      osc.start(now);
      osc.stop(now + 0.35);
    } else if (type === 'level-up') {
      // Magical power-up sound
      const now = audioCtx.currentTime;
      osc.type = 'square';
      osc.frequency.setValueAtTime(300, now);
      osc.frequency.exponentialRampToValueAtTime(1200, now + 0.6);
      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.6);
      osc.start(now);
      osc.stop(now + 0.6);
    } else if (type === 'click') {
      // Quiet pop for ui interaction
      const now = audioCtx.currentTime;
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.exponentialRampToValueAtTime(300, now + 0.08);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
      osc.start(now);
      osc.stop(now + 0.08);
    }
  } catch (e) {
    console.log("Audio FX error", e);
  }
};

const speakText = (text, rate = 0.9) => {
  playSoundFX('click');
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = rate;
    
    // Attempt to pick a premium English voice
    const voices = window.speechSynthesis.getVoices();
    const premiumVoice = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Samantha')));
    if (premiumVoice) utterance.voice = premiumVoice;

    window.speechSynthesis.speak(utterance);
  } else {
    alert("Audio TTS tidak didukung di peramban Anda.");
  }
};

export default function PremiumEnglishApp() {
  const [activeTab, setActiveTab] = useState('map'); // map | lessons | chat-ai | dictionary | profile
  const [currentDay, setCurrentDay] = useState(1); // Days 1 to 6
  const [sessionPhase, setSessionPhase] = useState('warmup'); // warmup | learn | practice | challenge | review
  
  // Gamification states
  const [xp, setXp] = useState(240);
  const [level, setLevel] = useState(1);
  const [unlockedBadges, setUnlockedBadges] = useState(['Bronze Explorer']);
  const [streak, setStreak] = useState(4);
  const [dailyGoalPercent, setDailyGoalPercent] = useState(60);

  // Gemini API states
  const [apiKey, setApiKey] = useState('');
  const [showApiModal, setShowApiModal] = useState(false);
  const [chatLog, setChatLog] = useState([
    { role: 'assistant', text: 'Hello Explorer! 👋 I am Engie, your AI English Companion. Ask me anything, or let\'s practice simple introduction!' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);

  // Day 2 spelling state
  const [day2Word, setDay2Word] = useState('WELCOME');
  const [day2Jumbled, setDay2Jumbled] = useState(['E', 'M', 'O', 'C', 'L', 'E', 'W']);
  const [day2Selected, setDay2Selected] = useState([]);
  
  // Day 4 memory state
  const [memoryCards, setMemoryCards] = useState([]);
  const [selectedCards, setSelectedCards] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState([]);

  // Day 6 Boss battle state
  const [bossHp, setBossHp] = useState(100);
  const [bossCurrentQuestion, setBossCurrentQuestion] = useState(0);
  const [bossLogs, setBossLogs] = useState(["Quest dimulai! Kalahkan Dragon Grammar-claws!"]);
  const [bossComplete, setBossComplete] = useState(false);

  // General Quiz State for Day 1
  const [quizScore, setQuizScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);

  const [toastMsg, setToastMsg] = useState(null);
  const triggerToast = (msg, type = 'info') => {
    setToastMsg({ text: msg, type });
    setTimeout(() => {
      setToastMsg(null);
    }, 3000);
  };

  const addXP = (amount) => {
    const nextXp = xp + amount;
    setXp(nextXp);
    triggerToast(`+${amount} XP Berhasil Diraih!`, 'success');
    
    // Auto level calculation
    const currentRequired = level * 500;
    if (nextXp >= currentRequired) {
      setLevel(prev => prev + 1);
      setXp(nextXp - currentRequired);
      playSoundFX('level-up');
      triggerToast(`🎉 SELAMAT! Kamu naik ke Level ${level + 1}!`, 'success');
    }
  };

  // Day 2 Game Initializer
  const initDay2Game = (word) => {
    setDay2Word(word);
    setDay2Selected([]);
    const jumbled = word.split('').sort(() => Math.random() - 0.5);
    setDay2Jumbled(jumbled);
  };

  // Day 4 Card Match Initializer
  const initMemoryGame = () => {
    const items = VOCAB_DATABASE.slice(0, 4);
    const pairs = [
      ...items.map((item, idx) => ({ id: `w-${idx}`, val: item.word, type: 'word', emoji: item.emoji })),
      ...items.map((item, idx) => ({ id: `m-${idx}`, val: item.meaning, type: 'meaning', emoji: item.emoji }))
    ].sort(() => Math.random() - 0.5);
    setMemoryCards(pairs);
    setSelectedCards([]);
    setMatchedPairs([]);
  };

  useEffect(() => {
    initMemoryGame();
  }, []);

  const handleDay2TileClick = (letter, idx) => {
    playSoundFX('click');
    const newSelected = [...day2Selected, { letter, originalIdx: idx }];
    setDay2Selected(newSelected);
    
    // Check spelling
    const currentAttempt = newSelected.map(item => item.letter).join('');
    if (currentAttempt === day2Word) {
      playSoundFX('success');
      addXP(50);
      triggerToast("Hebat! Ejaan kamu 100% Benar!", "success");
      // Pick next word
      setTimeout(() => {
        const words = ["ENGLISH", "ACADEMY", "STUDENT", "TEACHER", "CLASSROOM"];
        const next = words[Math.floor(Math.random() * words.length)];
        initDay2Game(next);
      }, 1500);
    } else if (currentAttempt.length === day2Word.length) {
      playSoundFX('error');
      triggerToast("Oops! Ejaan masih keliru. Coba lagi!", "error");
      setDay2Selected([]);
    }
  };

  // Memory card handler
  const handleMemoryCardClick = (card) => {
    if (selectedCards.length >= 2 || matchedPairs.includes(card.id)) return;
    playSoundFX('click');

    const newSelection = [...selectedCards, card];
    setSelectedCards(newSelection);

    if (newSelection.length === 2) {
      const [first, second] = newSelection;
      // Extract original IDs
      const firstIdx = first.id.split('-')[1];
      const secondIdx = second.id.split('-')[1];

      if (firstIdx === secondIdx && first.type !== second.type) {
        // Match!
        setMatchedPairs(prev => [...prev, first.id, second.id]);
        setSelectedCards([]);
        playSoundFX('success');
        addXP(20);
        if (matchedPairs.length + 2 === memoryCards.length) {
          triggerToast("🎉 Selamat! Kamu menyelesaikan Memory Card Game!", "success");
          addXP(100);
        }
      } else {
        // No match
        setTimeout(() => {
          setSelectedCards([]);
          playSoundFX('error');
        }, 1000);
      }
    }
  };

  const callGeminiAI = async (userPrompt) => {
    setChatLoading(true);
    const systemPrompt = "Act as 'Engie', an extremely friendly, responsive, and encouraging English Learning AI companion for Grade 7 SMP students in Indonesia. Keep responses very short, simple, grammatically clear, and easy to read (A1-A2 CEFR level). Support translation for tricky words by writing Indonesian in parentheses. Do not write lengthy code, speak direct simple dialogue, and correct their mistakes gently.";
    
    const payload = {
      contents: [{
        parts: [{ text: `User says: ${userPrompt}` }]
      }],
      systemInstruction: {
        parts: [{ text: systemPrompt }]
      }
    };

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${apiKey}`;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      const assistantText = data?.candidates?.[0]?.content?.parts?.[0]?.text || "Oops, I had a small connection error. Let's try again! (Oops, koneksi error. Coba lagi yuk!)";
      
      setChatLog(prev => [...prev, { role: 'assistant', text: assistantText }]);
    } catch (err) {
      console.error(err);
      setChatLog(prev => [...prev, { role: 'assistant', text: "Hmm, connection issues. Make sure your internet and Gemini API Key are active! (Ada kendala koneksi. Cek API Key ya!)" }]);
    } finally {
      setChatLoading(false);
    }
  };

  const handleSendChat = () => {
    if (!chatInput.trim()) return;
    playSoundFX('click');
    const userMsg = chatInput;
    setChatLog(prev => [...prev, { role: 'user', text: userMsg }]);
    setChatInput('');
    callGeminiAI(userMsg);
  };

  const BOSS_QUESTIONS = [
    { q: "Apa terjemahan bahasa Inggris dari 'Tas Sekolah'?", options: ["School Bag", "School Pencil", "School Classroom", "Teacher"], ans: 0 },
    { q: "Mengeja kata 'STUDENT' dengan ejaan yang benar adalah...", options: ["Es - Te - Yu - Di - I - En - Ti", "S - T - U - D - E - N - T", "S - T - O - D - E - N - T", "Es - Te - U - De - E - En - Te"], ans: 1 },
    { q: "Vokal di dalam bahasa Inggris terdiri dari...", options: ["B, C, D, F, G", "A, E, I, O, U", "X, Y, Z", "S, T, U, V, W"], ans: 1 },
    { q: "Sapaan yang diucapkan pada jam 8 pagi hari...", options: ["Good Afternoon", "Good Evening", "Good Night", "Good Morning"], ans: 3 },
    { q: "Lengkapi: 'My name ... Explorer Ali.'", options: ["are", "am", "is", "were"], ans: 2 }
  ];

  const handleBossAnswer = (optIndex) => {
    const currentQ = BOSS_QUESTIONS[bossCurrentQuestion];
    if (optIndex === currentQ.ans) {
      playSoundFX('success');
      const dmg = 20;
      setBossHp(prev => Math.max(0, prev - dmg));
      setBossLogs(prev => [`⚔ Kamu menyerang Dragon dengan kebenaran! Dmg: -${dmg} HP`, ...prev]);
      addXP(40);
    } else {
      playSoundFX('error');
      setBossLogs(prev => [`🔥 Dragon menyemburkan api! Jawabanmu masih keliru.`, ...prev]);
    }

    if (bossCurrentQuestion + 1 < BOSS_QUESTIONS.length) {
      setBossCurrentQuestion(prev => prev + 1);
    } else {
      setBossComplete(true);
      if (bossHp <= 20) {
        playSoundFX('level-up');
        if (!unlockedBadges.includes('Bronze Explorer')) {
          setUnlockedBadges(prev => [...prev, 'Bronze Explorer']);
        }
        setBossLogs(prev => ["🎉 DRAGON DIKALAHKAN! Kamu mendapatkan Badge 'Bronze Explorer'!", ...prev]);
      } else {
        setBossLogs(prev => ["Pertarungan selesai! Namun naga belum sepenuhnya dikalahkan. Coba lagi!", ...prev]);
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      
      {}
      <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-600 p-2 rounded-xl text-2xl shadow-lg shadow-indigo-500/20 animate-pulse">
            🚀
          </div>
          <div>
            <h1 className="text-lg font-extrabold tracking-tight bg-gradient-to-r from-indigo-400 to-sky-400 bg-clip-text text-transparent">
              90-DAY ENGLISH QUEST
            </h1>
            <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
              Grade VII SMP • Kurikulum Merdeka
            </p>
          </div>
        </div>

        {/* Gamified Stat Badges */}
        <div className="flex items-center gap-3">
          {/* Level Tracker */}
          <div className="flex items-center gap-1.5 bg-slate-800/80 border border-slate-700/50 px-2.5 py-1 rounded-full text-xs">
            <span className="text-yellow-400">⚡</span>
            <span className="font-bold">Lv.{level}</span>
          </div>

          {/* XP Tracker */}
          <div className="hidden sm:flex items-center gap-1.5 bg-slate-800/80 border border-slate-700/50 px-2.5 py-1 rounded-full text-xs">
            <span className="text-emerald-400">💎</span>
            <span className="font-bold">{xp}/{level * 500} XP</span>
          </div>

          {/* Streak Tracker */}
          <div className="flex items-center gap-1.5 bg-slate-800/80 border border-slate-700/50 px-2.5 py-1 rounded-full text-xs">
            <span className="text-orange-500">🔥</span>
            <span className="font-bold">{streak} Days</span>
          </div>

          {/* AI Settings Config */}
          <button 
            onClick={() => setShowApiModal(true)}
            className="p-2 bg-slate-800 hover:bg-indigo-600 hover:text-white rounded-lg border border-slate-700 hover:border-indigo-500 transition-all text-xs flex items-center gap-1"
          >
            <span>🤖</span>
            <span className="hidden md:inline font-semibold">Tutor AI</span>
          </button>
        </div>
      </header>

      {}
      {toastMsg && (
        <div className="fixed top-20 right-4 z-50 animate-bounce">
          <div className={`px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 border font-bold text-sm ${
            toastMsg.type === 'success' ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300' :
            toastMsg.type === 'error' ? 'bg-rose-500/20 border-rose-500/50 text-rose-300' :
            'bg-slate-800 border-slate-700 text-indigo-300'
          }`}>
            <span>✨</span> {toastMsg.text}
          </div>
        </div>
      )}

      {}
      <main className="flex-1 flex flex-col md:flex-row overflow-hidden">
        
        {/* Left Side Quick Nav Panel (Duolingo Style) */}
        <aside className="md:w-64 bg-slate-900/60 border-r border-slate-800 p-4 flex md:flex-col gap-2 justify-around md:justify-start">
          <button 
            onClick={() => { setActiveTab('map'); playSoundFX('click'); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${
              activeTab === 'map' ? 'bg-indigo-600/20 border border-indigo-500/50 text-indigo-400' : 'hover:bg-slate-800 text-slate-400'
            }`}
          >
            <span className="text-lg">🗺</span>
            <span className="hidden md:inline">Quest Map</span>
          </button>

          <button 
            onClick={() => { setActiveTab('lessons'); playSoundFX('click'); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${
              activeTab === 'lessons' ? 'bg-indigo-600/20 border border-indigo-500/50 text-indigo-400' : 'hover:bg-slate-800 text-slate-400'
            }`}
          >
            <span className="text-lg">📖</span>
            <span className="hidden md:inline">Interactive Days</span>
          </button>

          <button 
            onClick={() => { setActiveTab('chat-ai'); playSoundFX('click'); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${
              activeTab === 'chat-ai' ? 'bg-indigo-600/20 border border-indigo-500/50 text-indigo-400' : 'hover:bg-slate-800 text-slate-400'
            }`}
          >
            <span className="text-lg">🤖</span>
            <span className="hidden md:inline">AI Companion</span>
          </button>

          <button 
            onClick={() => { setActiveTab('dictionary'); playSoundFX('click'); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${
              activeTab === 'dictionary' ? 'bg-indigo-600/20 border border-indigo-500/50 text-indigo-400' : 'hover:bg-slate-800 text-slate-400'
            }`}
          >
            <span className="text-lg">🎴</span>
            <span className="hidden md:inline">Vocab Desk</span>
          </button>

          <button 
            onClick={() => { setActiveTab('profile'); playSoundFX('click'); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${
              activeTab === 'profile' ? 'bg-indigo-600/20 border border-indigo-500/50 text-indigo-400' : 'hover:bg-slate-800 text-slate-400'
            }`}
          >
            <span className="text-lg">🏅</span>
            <span className="hidden md:inline">My Achievements</span>
          </button>
        </aside>

        {/* Workspace Display Area */}
        <section className="flex-1 overflow-y-auto p-4 md:p-6">
          
          {/* TAB 1: INTERACTIVE QUEST MAP (ROBLOX GAMIFIED PATH) */}
          {activeTab === 'map' && (
            <div className="space-y-6">
              <div className="bg-slate-800/40 border border-slate-700/30 p-5 rounded-2xl">
                <span className="bg-indigo-500/10 text-indigo-400 text-xs font-bold px-3 py-1 rounded-full">🧭 EXPLORER CAMP</span>
                <h2 className="text-2xl font-extrabold mt-2 text-white">English Knowledge Archipelago</h2>
                <p className="text-slate-400 text-sm mt-1">Selesaikan misi harian dari pulau ke pulau selama 90 hari untuk menaklukkan Level CEFR A2.</p>
              </div>

              {/* Graphical Path Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {MAP_STAGES.map((stage, idx) => (
                  <div 
                    key={stage.id}
                    className={`relative p-5 rounded-2xl border transition-all ${
                      idx === 0 ? 'bg-slate-800/80 border-indigo-500/50 shadow-indigo-500/10 shadow-lg' : 'bg-slate-800/30 border-slate-700/40 opacity-75'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="text-4xl">{stage.icon}</div>
                      {idx === 0 ? (
                        <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase">Active Island</span>
                      ) : (
                        <span className="bg-slate-700/50 text-slate-400 border border-slate-600/40 text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase">Locked</span>
                      )}
                    </div>

                    <h3 className="text-lg font-bold text-white mt-4">{stage.name}</h3>
                    <p className="text-slate-400 text-xs mt-1 min-h-[32px]">{stage.desc}</p>

                    {/* Progress slider bar */}
                    <div className="mt-4">
                      <div className="flex justify-between text-[10px] text-slate-400 font-bold mb-1">
                        <span>Completion</span>
                        <span>{idx === 0 ? '60%' : '0%'}</span>
                      </div>
                      <div className="w-full bg-slate-700 rounded-full h-1.5 overflow-hidden">
                        <div 
                          className="bg-gradient-to-r from-indigo-500 to-sky-400 h-full transition-all duration-500"
                          style={{ width: idx === 0 ? '60%' : '0%' }}
                        ></div>
                      </div>
                    </div>

                    <button 
                      onClick={() => {
                        if (idx === 0) {
                          setActiveTab('lessons');
                          playSoundFX('click');
                        } else {
                          triggerToast("Selesaikan Island 1: Foundation terlebih dahulu!", "error");
                        }
                      }}
                      className={`w-full mt-4 py-2 rounded-xl text-xs font-bold transition-all ${
                        idx === 0 ? 'bg-indigo-600 hover:bg-indigo-500 text-white' : 'bg-slate-700/50 text-slate-500 cursor-not-allowed'
                      }`}
                    >
                      {idx === 0 ? '👉 Jelajahi Misi' : '🔒 Terkunci'}
                    </button>
                  </div>
                ))}
              </div>

              {/* 90 Days Timeline Curriculum Road */}
              <div className="bg-slate-800/30 border border-slate-700/30 rounded-2xl p-6">
                <h3 className="text-xl font-extrabold text-white mb-4">90-Day Bootcamp Syllabus Route</h3>
                <div className="space-y-4">
                  {/* Month 1 Roadmap Section */}
                  <div className="border-l-2 border-indigo-500 pl-4 space-y-2">
                    <h4 className="font-bold text-indigo-400 text-sm">📅 {CURRICULUM_OUTLINE.month1.title}</h4>
                    <p className="text-slate-400 text-xs">Fokus pada fondasi bahasa dasar, tata bahasa, dan sapaan praktis di sekolah.</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 pt-2">
                      <button onClick={() => { setCurrentDay(1); setActiveTab('lessons'); }} className="p-2 bg-indigo-600/10 border border-indigo-500/30 rounded-lg text-xs font-semibold text-center text-indigo-300">Week 1 (Hari 1-6)</button>
                      <div className="p-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-center text-slate-500">Week 2: School Life</div>
                      <div className="p-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-center text-slate-500">Week 3: Family</div>
                      <div className="p-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-center text-slate-500">Week 4: Routine</div>
                    </div>
                  </div>

                  {/* Month 2 Roadmap Section */}
                  <div className="border-l-2 border-amber-500 pl-4 space-y-2">
                    <h4 className="font-bold text-amber-400 text-sm">📅 {CURRICULUM_OUTLINE.month2.title}</h4>
                    <p className="text-slate-400 text-xs">Kosakata fungsional kehidupan nyata seperti memesan makanan, belanja, transportasi, dan cuaca.</p>
                  </div>

                  {/* Month 3 Roadmap Section */}
                  <div className="border-l-2 border-purple-500 pl-4 space-y-2">
                    <h4 className="font-bold text-purple-400 text-sm">📅 {CURRICULUM_OUTLINE.month3.title}</h4>
                    <p className="text-slate-400 text-xs">Percakapan tingkat lanjut, presentasi lisan, dan persiapan penuh untuk CEFR A2.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: INTERACTIVE DAYS (LEARNING CENTER) */}
          {activeTab === 'lessons' && (
            <div className="space-y-6">
              
              {/* Day selection slider */}
              <div className="flex gap-2 overflow-x-auto pb-2 snap-x scrollbar-thin">
                {[1, 2, 3, 4, 5, 6].map((dayNum) => (
                  <button
                    key={dayNum}
                    onClick={() => { setCurrentDay(dayNum); setSessionPhase('warmup'); playSoundFX('click'); }}
                    className={`px-4 py-2.5 rounded-xl text-xs font-extrabold whitespace-nowrap snap-center transition-all ${
                      currentDay === dayNum ? 'bg-indigo-600 border border-indigo-400 text-white shadow-lg' : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700/50'
                    }`}
                  >
                    🚀 Day {dayNum}: {
                      dayNum === 1 ? 'Intro' :
                      dayNum === 2 ? 'Alphabet' :
                      dayNum === 3 ? 'Pronounce' :
                      dayNum === 4 ? 'Vocab' :
                      dayNum === 5 ? 'Greetings' : 'Boss Battle 🐉'
                    }
                  </button>
                ))}
              </div>

              {/* Daily Phase Tracker Tabs (Warm Up, Learn, Practice, Challenge, Review) */}
              <div className="grid grid-cols-5 bg-slate-850 bg-slate-800 p-1.5 rounded-2xl border border-slate-700/40">
                {['warmup', 'learn', 'practice', 'challenge', 'review'].map((phase) => (
                  <button
                    key={phase}
                    onClick={() => { setSessionPhase(phase); playSoundFX('click'); }}
                    className={`py-2 rounded-xl text-[10px] md:text-xs font-extrabold uppercase transition-all text-center ${
                      sessionPhase === phase ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {phase}
                  </button>
                ))}
              </div>

              {}
              {currentDay === 1 && (
                <div className="space-y-4">
                  {sessionPhase === 'warmup' && (
                    <div className="bg-slate-800/40 p-6 rounded-2xl border border-slate-700/30 space-y-4">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">👋</span>
                        <div>
                          <h3 className="text-xl font-bold text-white">Warm Up: Welcome to English Academy</h3>
                          <p className="text-xs text-slate-400">Mulailah petualangan belajarmu hari ini.</p>
                        </div>
                      </div>
                      <p className="text-slate-300 text-sm leading-relaxed">
                        Selamat datang, Explorer! Kamu sekarang telah resmi bergabung sebagai pembelajar bahasa Inggris tangguh. Mari kita latih dasar yang paling penting: rasa percaya diri! Klik tombol suara di bawah untuk mendengar sapaan resmi pertamamu.
                      </p>
                      <button 
                        onClick={() => speakText("Welcome young explorer! We are proud to have you on our English journey.")}
                        className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all"
                      >
                        🔊 DENGARKAN AUDIO NATIVE
                      </button>
                    </div>
                  )}

                  {sessionPhase === 'learn' && (
                    <div className="space-y-4">
                      <div className="bg-slate-800/40 p-6 rounded-2xl border border-slate-700/30">
                        <h3 className="text-lg font-bold text-white mb-2">Kenapa Harus Belajar Bahasa Inggris?</h3>
                        <p className="text-slate-300 text-sm leading-relaxed mb-4">
                          Bahasa Inggris adalah kunci global. Dengan menguasai bahasa Inggris, kamu bisa bercakap-cakap dengan teman dari seluruh belahan dunia, membaca ensiklopedia hebat, serta bersiap untuk masa depanmu yang cemerlang!
                        </p>
                        
                        {/* Interactive Mind Map Visual */}
                        <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-3">
                          <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-wider">🧠 Mind Map: Complete English</h4>
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div className="p-3 bg-slate-800 rounded-lg border border-slate-700 text-center hover:border-indigo-500 transition-all cursor-pointer" onClick={() => speakText("Speaking: Talking to other people.")}>
                              🗣 Speaking (Berbicara)
                            </div>
                            <div className="p-3 bg-slate-800 rounded-lg border border-slate-700 text-center hover:border-indigo-500 transition-all cursor-pointer" onClick={() => speakText("Listening: Understanding native speakers.")}>
                              🎧 Listening (Mendengar)
                            </div>
                            <div className="p-3 bg-slate-800 rounded-lg border border-slate-700 text-center hover:border-indigo-500 transition-all cursor-pointer" onClick={() => speakText("Reading: Reading books and stories.")}>
                              📖 Reading (Membaca)
                            </div>
                            <div className="p-3 bg-slate-800 rounded-lg border border-slate-700 text-center hover:border-indigo-500 transition-all cursor-pointer" onClick={() => speakText("Writing: Typing letters and essays.")}>
                              ✍ Writing (Menulis)
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {sessionPhase === 'practice' && (
                    <div className="bg-slate-800/40 p-6 rounded-2xl border border-slate-700/30 space-y-4">
                      <h3 className="text-lg font-bold text-white">Interactive Shadowing Practice</h3>
                      <p className="text-slate-300 text-sm">
                        Tekan tombol audio, lalu tirukan dengan keras (shadowing) kalimat perkenalan di bawah ini:
                      </p>

                      <div className="space-y-2">
                        <div className="flex items-center gap-3 p-3 bg-slate-900 rounded-xl border border-slate-800">
                          <button onClick={() => speakText("Hello, my name is John. I am a student.")} className="p-2.5 bg-indigo-600/20 text-indigo-400 hover:bg-indigo-600 hover:text-white rounded-lg transition-all">🔊</button>
                          <div>
                            <p className="font-bold text-xs text-indigo-300">Phrase 1</p>
                            <p className="text-sm font-semibold">"Hello, my name is John. I am a student."</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 p-3 bg-slate-900 rounded-xl border border-slate-800">
                          <button onClick={() => speakText("Nice to meet you explorer.")} className="p-2.5 bg-indigo-600/20 text-indigo-400 hover:bg-indigo-600 hover:text-white rounded-lg transition-all">🔊</button>
                          <div>
                            <p className="font-bold text-xs text-indigo-300">Phrase 2</p>
                            <p className="text-sm font-semibold">"Nice to meet you, explorer!"</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {sessionPhase === 'challenge' && (
                    <div className="bg-slate-800/40 p-6 rounded-2xl border border-slate-700/30 space-y-4">
                      <h3 className="text-lg font-bold text-white">Daily Quiz Challenge</h3>
                      <p className="text-xs text-slate-400">Selesaikan kuis interaktif di bawah untuk membuktikan pemahamanmu.</p>

                      {!quizCompleted ? (
                        <div className="space-y-3">
                          <p className="font-bold text-sm">Pertanyaan: "My name is John" memiliki arti apa dalam bahasa Indonesia?</p>
                          <div className="grid grid-cols-1 gap-2">
                            <button onClick={() => { setSelectedAnswer(0); playSoundFX('success'); setQuizCompleted(true); addXP(50); }} className="p-3 bg-slate-900 hover:bg-slate-800 rounded-xl border border-slate-700 text-left text-xs font-semibold">
                              👉 Nama saya adalah John
                            </button>
                            <button onClick={() => { setSelectedAnswer(1); playSoundFX('error'); triggerToast("Jawaban kurang tepat!", "error"); }} className="p-3 bg-slate-900 hover:bg-slate-800 rounded-xl border border-slate-700 text-left text-xs font-semibold">
                              👉 Saya tinggal di John
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl space-y-2">
                          <p className="font-bold text-emerald-400">🎉 Sempurna! Kamu menjawab dengan benar!</p>
                          <p className="text-xs text-slate-300">Kamu mendapatkan +50 XP!</p>
                          <button onClick={() => { setQuizCompleted(false); }} className="text-xs font-bold text-indigo-400 underline">Ulangi Kuis</button>
                        </div>
                      )}
                    </div>
                  )}

                  {sessionPhase === 'review' && (
                    <div className="bg-slate-800/40 p-6 rounded-2xl border border-slate-700/30 space-y-3">
                      <h3 className="text-lg font-bold text-white">Smart Note & Common Mistakes</h3>
                      <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl">
                        <p className="text-xs font-bold text-amber-400">💡 SMART NOTE</p>
                        <p className="text-xs text-slate-300 mt-1">Jangan malu melafalkan bahasa Inggris dengan keras. Keberanian mengucapkan kalimat jauh lebih penting daripada tata bahasa di tahap awal!</p>
                      </div>

                      <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl">
                        <p className="text-xs font-bold text-rose-400">⚠ COMMON MISTAKE</p>
                        <p className="text-xs text-slate-300 mt-1">Siswa sering melupakan kata hubung "is/am/are" seperti mengucapkan "I student" yang seharusnya "I am a student."</p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {}
              {currentDay === 2 && (
                <div className="space-y-4">
                  {sessionPhase === 'warmup' && (
                    <div className="bg-slate-800/40 p-6 rounded-2xl border border-slate-700/30 space-y-4">
                      <h3 className="text-lg font-bold text-white">Warm Up: Alphabet Audio Phonics</h3>
                      <p className="text-slate-300 text-sm">Klik tombol huruf di bawah untuk melatih pelafalan alphabet native bahasa Inggris.</p>
                      <div className="grid grid-cols-6 sm:grid-cols-9 gap-2">
                        {['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'].map(char => (
                          <button 
                            key={char} 
                            onClick={() => speakText(char, 0.75)} 
                            className="p-2 bg-slate-900 hover:bg-indigo-600 rounded-lg text-xs font-extrabold border border-slate-800 transition-all text-indigo-400 hover:text-white"
                          >
                            {char}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {sessionPhase === 'learn' && (
                    <div className="bg-slate-800/40 p-6 rounded-2xl border border-slate-700/30 space-y-3">
                      <h3 className="text-lg font-bold text-white">How We Spell Names</h3>
                      <p className="text-slate-300 text-sm">
                        Ketika berkenalan, native speaker sering meminta pengejaan nama.
                        Contoh mengeja kata "J-O-H-N":
                      </p>
                      <div className="p-4 bg-slate-900 rounded-xl flex items-center justify-between">
                        <span className="font-extrabold tracking-widest text-lg text-indigo-400">J - O - H - N</span>
                        <button onClick={() => speakText("J, O, H, N")} className="px-3 py-1.5 bg-indigo-600 text-xs font-bold rounded-lg">🔊 Dengar Ejaan</button>
                      </div>
                    </div>
                  )}

                  {sessionPhase === 'practice' && (
                    <div className="bg-slate-800/40 p-6 rounded-2xl border border-slate-700/30 space-y-4">
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-bold text-white">Alphabet Drag spelling Bee</h3>
                        <button onClick={() => initDay2Game('WELCOME')} className="text-xs text-indigo-400 font-bold underline">Reset Word</button>
                      </div>
                      <p className="text-xs text-slate-400">Susunlah kata "{day2Word}" dengan menekan huruf-huruf di bawah secara berurutan:</p>
                      
                      {/* Jumbled tiles */}
                      <div className="flex flex-wrap gap-2 justify-center py-4">
                        {day2Jumbled.map((letter, idx) => {
                          const isSelected = day2Selected.some(item => item.originalIdx === idx);
                          return (
                            <button
                              key={idx}
                              disabled={isSelected}
                              onClick={() => handleDay2TileClick(letter, idx)}
                              className={`w-12 h-12 rounded-xl text-lg font-bold transition-all ${
                                isSelected ? 'bg-slate-800 text-slate-600 border border-slate-750 cursor-not-allowed' : 'bg-slate-900 border border-slate-700 hover:border-indigo-500 text-indigo-300'
                              }`}
                            >
                              {letter}
                            </button>
                          );
                        })}
                      </div>

                      {/* Display progress spelled */}
                      <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 flex justify-between items-center">
                        <div>
                          <span className="text-xs font-bold text-slate-500 block">KATA YANG SEDANG DIASUMSIKAN:</span>
                          <span className="text-xl font-black text-emerald-400 tracking-widest uppercase">{day2Selected.map(item => item.letter).join('')}</span>
                        </div>
                        {day2Selected.length > 0 && (
                          <button onClick={() => setDay2Selected([])} className="text-xs text-rose-400 font-bold">Hapus</button>
                        )}
                      </div>
                    </div>
                  )}

                  {sessionPhase === 'challenge' && (
                    <div className="bg-slate-800/40 p-6 rounded-2xl border border-slate-700/30 space-y-3">
                      <h3 className="text-lg font-bold text-white">Daily Challenge: Spell Your Name</h3>
                      <p className="text-slate-300 text-sm">Gunakan kotak di bawah untuk melatih pengejaan namamu sendiri:</p>
                      <div className="flex gap-2">
                        <input 
                          type="text" 
                          placeholder="Ketik namamu..." 
                          id="spellingInput"
                          className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                        />
                        <button 
                          onClick={() => {
                            const val = document.getElementById('spellingInput').value;
                            if (val) {
                              speakText(val.split('').join(', '));
                              addXP(30);
                            } else {
                              triggerToast("Isi namamu terlebih dahulu!", "error");
                            }
                          }}
                          className="px-4 py-2 bg-indigo-600 rounded-xl text-xs font-bold"
                        >
                          🔊 Eja Sekarang
                        </button>
                      </div>
                    </div>
                  )}

                  {sessionPhase === 'review' && (
                    <div className="bg-slate-800/40 p-6 rounded-2xl border border-slate-700/30 space-y-3">
                      <h3 className="text-lg font-bold text-white">Day 2 Recap & Notes</h3>
                      <div className="p-4 bg-indigo-500/10 border border-indigo-500/30 rounded-xl">
                        <p className="text-xs font-bold text-indigo-400">💡 ALPHABET TIP</p>
                        <p className="text-xs text-slate-300 mt-1">Ingat perbedaan pelafalan antara "G" (/dʒiː/) dan "J" (/dʒeɪ/). Kesalahan ini yang paling sering terjadi bagi pembelajar pemula!</p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {}
              {currentDay === 3 && (
                <div className="space-y-4">
                  {sessionPhase === 'warmup' && (
                    <div className="bg-slate-800/40 p-6 rounded-2xl border border-slate-700/30 space-y-3">
                      <h3 className="text-lg font-bold text-white">Pronunciation: English Phonics Lab</h3>
                      <p className="text-slate-300 text-sm">Mari kita pelajari perbedaan vokal panjang dan pendek. Klik tombol suara di bawah ini:</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div onClick={() => speakText("Sheep")} className="p-3 bg-slate-900 border border-slate-700 rounded-xl flex justify-between items-center cursor-pointer hover:border-indigo-500">
                          <div>
                            <span className="font-bold text-indigo-400 block">Sheep (Domba)</span>
                            <span className="text-[10px] text-slate-500">Long Vowel /ʃiːp/</span>
                          </div>
                          <span>🔊</span>
                        </div>
                        <div onClick={() => speakText("Ship")} className="p-3 bg-slate-900 border border-slate-700 rounded-xl flex justify-between items-center cursor-pointer hover:border-indigo-500">
                          <div>
                            <span className="font-bold text-indigo-400 block">Ship (Kapal)</span>
                            <span className="text-[10px] text-slate-500">Short Vowel /ʃɪp/</span>
                          </div>
                          <span>🔊</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {sessionPhase === 'learn' && (
                    <div className="bg-slate-800/40 p-6 rounded-2xl border border-slate-700/30 space-y-3">
                      <h3 className="text-lg font-bold text-white">Silent Letters & Intonations</h3>
                      <p className="text-slate-300 text-sm">Beberapa huruf tidak diucapkan sama sekali saat dibaca (silent letters). Simak contoh berikut:</p>
                      <div className="p-4 bg-slate-900 rounded-xl space-y-2">
                        <div className="flex justify-between items-center" onClick={() => speakText("Knee")}>
                          <span className="text-sm font-bold">Knee (Lutut) <span className="text-slate-500 font-normal">-- "K" tidak dibaca</span></span>
                          <span className="text-indigo-400 text-xs">🔊 Play /niː/</span>
                        </div>
                        <div className="flex justify-between items-center" onClick={() => speakText("Hour")}>
                          <span className="text-sm font-bold">Hour (Jam) <span className="text-slate-500 font-normal">-- "H" tidak dibaca</span></span>
                          <span className="text-indigo-400 text-xs">🔊 Play /aʊər/</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {sessionPhase === 'practice' && (
                    <div className="bg-slate-800/40 p-6 rounded-2xl border border-slate-700/30 space-y-3">
                      <h3 className="text-lg font-bold text-white">Interactive Shadowing Compare</h3>
                      <p className="text-xs text-slate-400 font-semibold uppercase">Ucapkan kalimat ini berulang-ulang:</p>
                      <div className="p-4 bg-slate-900 border border-slate-700 rounded-xl space-y-3">
                        <p className="text-base font-extrabold italic text-center">"I eat rice in my clean classroom."</p>
                        <button onClick={() => speakText("I eat rice in my clean classroom.")} className="w-full py-2 bg-indigo-600 rounded-xl text-xs font-bold">🔊 Dengar Contoh Native</button>
                      </div>
                    </div>
                  )}

                  {sessionPhase === 'challenge' && (
                    <div className="bg-slate-800/40 p-6 rounded-2xl border border-slate-700/30 space-y-4">
                      <h3 className="text-lg font-bold text-white">Pronunciation Battle (Self-Evaluate)</h3>
                      <p className="text-slate-300 text-sm">Gunakan slider untuk mengevaluasi seberapa mirip pelafalanmu dengan native speaker setelah kamu mempraktikkannya!</p>
                      
                      <div className="space-y-3">
                        <div className="p-3 bg-slate-900 rounded-xl">
                          <p className="text-xs font-bold text-slate-500">Ucapkan kalimat:</p>
                          <p className="font-bold text-sm">"Sit down on your seat!"</p>
                        </div>
                        
                        <div>
                          <label className="text-xs font-bold text-slate-400 block mb-1">Seberapa yakin kamu dengan pelafalanmu?</label>
                          <input type="range" min="1" max="100" defaultValue="75" className="w-full accent-indigo-500 h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer" />
                        </div>

                        <button onClick={() => { addXP(40); triggerToast("Luar biasa! Skor pelafalanmu sangat mirip!", "success"); }} className="w-full py-2 bg-indigo-600 rounded-xl text-xs font-bold">Kirim Evaluasi Diri</button>
                      </div>
                    </div>
                  )}

                  {sessionPhase === 'review' && (
                    <div className="bg-slate-800/40 p-6 rounded-2xl border border-slate-700/30 space-y-2">
                      <h3 className="text-lg font-bold text-white">Smart Tip</h3>
                      <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl text-xs text-slate-300 leading-relaxed">
                        Latih intonasimu dengan menyandarkan penekanan kata (word stress) pada kata kerja (verb) atau kata benda (noun) yang memegang makna penting di dalam kalimat.
                      </div>
                    </div>
                  )}
                </div>
              )}

              {}
              {currentDay === 4 && (
                <div className="space-y-4">
                  {sessionPhase === 'warmup' && (
                    <div className="bg-slate-800/40 p-6 rounded-2xl border border-slate-700/30 space-y-4">
                      <h3 className="text-lg font-bold text-white">Warm Up: School Flashcards</h3>
                      <p className="text-slate-300 text-sm">Klik kartu untuk mendengar pelafalan kosakata alat sekolah bahasa Inggris:</p>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {VOCAB_DATABASE.map((item, idx) => (
                          <div 
                            key={idx}
                            onClick={() => speakText(item.word)}
                            className="bg-slate-900 hover:bg-slate-800 p-4 rounded-xl border border-slate-800 hover:border-indigo-500/50 transition-all text-center cursor-pointer space-y-2"
                          >
                            <span className="text-3xl block">{item.emoji}</span>
                            <span className="font-bold text-xs block text-white">{item.word}</span>
                            <span className="text-[10px] text-slate-400 block italic">{item.phonics}</span>
                            <span className="text-[10px] text-slate-500 block">{item.meaning}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {sessionPhase === 'learn' && (
                    <div className="bg-slate-800/40 p-6 rounded-2xl border border-slate-700/30 space-y-3">
                      <h3 className="text-lg font-bold text-white">School Objects Classroom Vocabulary</h3>
                      <p className="text-slate-300 text-sm">Untuk menyebutkan benda di dalam ruang kelas, kita menggunakan artikel 'A' (sebuah) untuk benda berawalan konsonan, dan 'An' untuk vokal.</p>
                      <div className="p-4 bg-slate-900 rounded-xl space-y-2">
                        <div className="flex justify-between" onClick={() => speakText("A bag")}>
                          <span className="text-xs font-bold text-indigo-300">A Bag</span>
                          <span className="text-xs text-slate-400">Sebuah tas</span>
                        </div>
                        <div className="flex justify-between" onClick={() => speakText("An eraser")}>
                          <span className="text-xs font-bold text-indigo-300">An Eraser</span>
                          <span className="text-xs text-slate-400">Sebuah penghapus</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {sessionPhase === 'practice' && (
                    <div className="bg-slate-800/40 p-6 rounded-2xl border border-slate-700/30 space-y-4">
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-bold text-white">Vocabulary Memory Match</h3>
                        <button onClick={initMemoryGame} className="text-xs text-indigo-400 font-bold underline">Ulangi Game</button>
                      </div>
                      <p className="text-xs text-slate-400">Pasangkan kartu Bahasa Inggris dengan arti Bahasa Indonesia yang sesuai.</p>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3">
                        {memoryCards.map((card) => {
                          const isSelected = selectedCards.some(c => c.id === card.id);
                          const isMatched = matchedPairs.includes(card.id);
                          
                          return (
                            <div
                              key={card.id}
                              onClick={() => handleMemoryCardClick(card)}
                              className={`h-24 rounded-xl flex flex-col justify-center items-center p-2 text-center transition-all cursor-pointer border ${
                                isMatched ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300 cursor-not-allowed opacity-60' :
                                isSelected ? 'bg-indigo-600 border-indigo-400 text-white' : 'bg-slate-900 border-slate-850 border-slate-800 hover:border-slate-700 text-slate-300'
                              }`}
                            >
                              {isMatched || isSelected ? (
                                <>
                                  <span className="text-2xl mb-1">{card.emoji}</span>
                                  <span className="font-extrabold text-xs">{card.val}</span>
                                </>
                              ) : (
                                <span className="text-2xl">❓</span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {sessionPhase === 'challenge' && (
                    <div className="bg-slate-800/40 p-6 rounded-2xl border border-slate-700/30 space-y-3">
                      <h3 className="text-lg font-bold text-white">Daily Vocabulary Challenge</h3>
                      <p className="text-slate-300 text-sm">Apakah arti dari kata "Whiteboard"?</p>
                      <div className="grid grid-cols-2 gap-2">
                        <button onClick={() => { playSoundFX('success'); addXP(30); }} className="p-3 bg-slate-900 border border-slate-700 rounded-xl text-xs font-bold hover:bg-slate-800 text-center">Papan Tulis Putih</button>
                        <button onClick={() => { playSoundFX('error'); }} className="p-3 bg-slate-900 border border-slate-700 rounded-xl text-xs font-bold hover:bg-slate-800 text-center">Meja Guru</button>
                      </div>
                    </div>
                  )}

                  {sessionPhase === 'review' && (
                    <div className="bg-slate-800/40 p-6 rounded-2xl border border-slate-700/30">
                      <h3 className="text-lg font-bold text-white">Vocabulary Smart Note</h3>
                      <p className="text-xs text-slate-400 mt-1">
                        Biasakan mencatat setidaknya 5 kosakata ruang kelas baru setiap harinya dan tempelkan catatan lengket di benda-benda rumahmu untuk mempercepat hafalan.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {}
              {currentDay === 5 && (
                <div className="space-y-4">
                  {sessionPhase === 'warmup' && (
                    <div className="bg-slate-800/40 p-6 rounded-2xl border border-slate-700/30 space-y-3">
                      <h3 className="text-lg font-bold text-white">Greetings & Intros Introduction</h3>
                      <p className="text-slate-300 text-sm">Mari kita pelajari percakapan sapaan yang umum saat pertama kali bertemu seseorang.</p>
                      <div className="p-4 bg-slate-900 rounded-xl space-y-2">
                        <div onClick={() => speakText("Good Morning")} className="flex justify-between items-center cursor-pointer">
                          <span className="text-xs font-bold text-indigo-300">"Good Morning!"</span>
                          <span className="text-xs text-slate-500">Selamat pagi</span>
                        </div>
                        <div onClick={() => speakText("Nice to meet you")} className="flex justify-between items-center cursor-pointer">
                          <span className="text-xs font-bold text-indigo-300">"Nice to meet you!"</span>
                          <span className="text-xs text-slate-500">Senang bertemu denganmu</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {sessionPhase === 'learn' && (
                    <div className="bg-slate-800/40 p-6 rounded-2xl border border-slate-700/30 space-y-3">
                      <h3 className="text-lg font-bold text-white">Formal vs Informal Greeting</h3>
                      <p className="text-slate-300 text-sm">Gunakan "Hello" untuk situasi formal dan "Hi" atau "How is it going?" untuk situasi santai/informal sesama teman sebaya.</p>
                    </div>
                  )}

                  {sessionPhase === 'practice' && (
                    <div className="bg-slate-800/40 p-6 rounded-2xl border border-slate-700/30 space-y-4">
                      <h3 className="text-lg font-bold text-white">Interactive Roleplay Conversation</h3>
                      <p className="text-xs text-slate-400">Klik balon dialog bergantian untuk berlatih percakapan sapaan interaktif:</p>

                      <div className="space-y-3">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-sm font-bold">A</div>
                          <div 
                            onClick={() => speakText("Hello, good morning! My name is Sarah.")}
                            className="bg-slate-900 hover:bg-slate-850 p-3 rounded-r-xl rounded-bl-xl border border-slate-800 cursor-pointer flex-1"
                          >
                            <p className="text-xs font-bold text-indigo-400">Sarah (🔊 Click to Hear):</p>
                            <p className="text-sm">"Hello, good morning! My name is Sarah."</p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3 justify-end text-right">
                          <div 
                            onClick={() => speakText("Hi Sarah! Good morning. I am David. Nice to meet you.")}
                            className="bg-indigo-950 hover:bg-indigo-900 p-3 rounded-l-xl rounded-br-xl border border-indigo-900 cursor-pointer flex-1 text-left"
                          >
                            <p className="text-xs font-bold text-emerald-400 text-right">David (🔊 Click to Hear):</p>
                            <p className="text-sm">"Hi Sarah! Good morning. I am David. Nice to meet you."</p>
                          </div>
                          <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center text-sm font-bold">B</div>
                        </div>
                      </div>
                    </div>
                  )}

                  {sessionPhase === 'challenge' && (
                    <div className="bg-slate-800/40 p-6 rounded-2xl border border-slate-700/30 space-y-3">
                      <h3 className="text-lg font-bold text-white">Self-Introduction Challenge</h3>
                      <p className="text-slate-300 text-sm">Ucapkan kalimat perkenalan di bawah ini sekencang mungkin di depan cermin!</p>
                      <div className="p-4 bg-slate-900 rounded-xl space-y-1 text-center font-bold text-sm">
                        <p className="text-indigo-400">"Good morning my friends! My name is Explorer. I am from Indonesia."</p>
                        <button onClick={() => speakText("Good morning my friends! My name is Explorer. I am from Indonesia.")} className="mt-3 px-4 py-1.5 bg-indigo-600 text-xs rounded-xl">🔊 Dengar Contoh</button>
                      </div>
                    </div>
                  )}

                  {sessionPhase === 'review' && (
                    <div className="bg-slate-800/40 p-6 rounded-2xl border border-slate-700/30">
                      <h3 className="text-lg font-bold text-white">Greetings Common Error</h3>
                      <p className="text-xs text-rose-300 mt-1">Siswa Indonesia sering menjawab "I am fine, thank you" secara berulang. Native speaker juga sering mengucapkan "Great!", "Good!", atau "Not too bad!" saat menjawab kabar.</p>
                    </div>
                  )}
                </div>
              )}

              {}
              {currentDay === 6 && (
                <div className="space-y-4">
                  {/* Boss Arena Layout */}
                  <div className="bg-gradient-to-b from-slate-900 to-slate-850 p-6 rounded-2xl border border-indigo-500/30 shadow-2xl relative overflow-hidden">
                    
                    {/* Dragon Illustration Head */}
                    <div className="flex justify-between items-center mb-6">
                      <div className="flex items-center gap-3">
                        <span className="text-5xl animate-bounce">🐲</span>
                        <div>
                          <h3 className="text-xl font-extrabold text-rose-400">Dragon Grammar-claws</h3>
                          <p className="text-xs text-slate-400">Ujian Mingguan Penjaga Gerbang Island 1</p>
                        </div>
                      </div>
                      
                      {/* Boss HP Bar */}
                      <div className="w-1/2 text-right">
                        <span className="text-xs font-bold text-rose-500">Boss HP: {bossHp}%</span>
                        <div className="w-full bg-slate-800 h-2.5 rounded-full mt-1 overflow-hidden">
                          <div 
                            className="bg-rose-600 h-full transition-all duration-300"
                            style={{ width: `${bossHp}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>

                    {!bossComplete ? (
                      <div className="space-y-4">
                        <div className="p-4 bg-slate-900/80 rounded-xl border border-slate-800">
                          <span className="text-xs font-bold text-indigo-400">Pertanyaan {bossCurrentQuestion + 1} dari {BOSS_QUESTIONS.length}:</span>
                          <p className="font-extrabold text-sm mt-1 text-white">{BOSS_QUESTIONS[bossCurrentQuestion].q}</p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          {BOSS_QUESTIONS[bossCurrentQuestion].options.map((opt, idx) => (
                            <button
                              key={idx}
                              onClick={() => handleBossAnswer(idx)}
                              className="p-3 bg-slate-900 hover:bg-slate-800 hover:border-indigo-500 border border-slate-750 rounded-xl text-left text-xs font-bold transition-all text-slate-300 hover:text-white"
                            >
                              👉 {opt}
                            </button>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="p-6 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-center space-y-4">
                        <span className="text-5xl block">🏆</span>
                        <h4 className="text-xl font-bold text-emerald-400">MISSION COMPLETED!</h4>
                        <p className="text-sm text-slate-300 leading-relaxed">
                          Kamu berhasil menyelesaikan Weekly Boss Challenge dan membuka lencana berharga "Bronze Explorer"! Kamu telah siap berpindah ke School Town.
                        </p>
                        <div className="flex gap-2 justify-center">
                          <button 
                            onClick={() => {
                              setBossHp(100);
                              setBossCurrentQuestion(0);
                              setBossComplete(false);
                            }}
                            className="px-4 py-2 bg-slate-800 hover:bg-slate-750 text-xs font-bold rounded-xl"
                          >
                            Ulangi Battle
                          </button>
                          <button 
                            onClick={() => setActiveTab('profile')}
                            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-xs font-bold rounded-xl text-white"
                          >
                            Lihat Pencapaian
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Battle Logs Drawer */}
                    <div className="mt-6 border-t border-slate-800 pt-4">
                      <span className="text-xs font-bold text-slate-400 block mb-2">Battle Logs:</span>
                      <div className="h-24 overflow-y-auto space-y-1 text-left">
                        {bossLogs.map((log, idx) => (
                          <p key={idx} className="text-[11px] text-slate-400 font-semibold">{log}</p>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </div>
          )}

          {/* TAB 3: AI LEARNING COMPANION CHATBOT (POWERED BY GEMINI) */}
          {activeTab === 'chat-ai' && (
            <div className="space-y-6">
              
              {/* API Alert/Configuration Notice */}
              {!apiKey && (
                <div className="bg-amber-500/10 border border-amber-500/30 p-5 rounded-2xl space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">💡</span>
                    <h3 className="font-extrabold text-amber-400 text-sm">Aktifkan Tutor AI Companion (Tutor Engie)</h3>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Untuk dapat mengobrol secara real-time dengan asisten bahasa Inggris interaktif Anda, harap masukkan **Gemini API Key** Anda dengan mengeklik tombol di bawah ini. Anda dapat memperoleh kunci gratis dari Google AI Studio.
                  </p>
                  <button 
                    onClick={() => setShowApiModal(true)}
                    className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-900 font-black text-xs rounded-xl transition-all"
                  >
                    🔑 Konfigurasi API Key
                  </button>
                </div>
              )}

              {/* Chat Interface Container */}
              <div className="bg-slate-800/30 border border-slate-700/30 rounded-2xl overflow-hidden flex flex-col h-[500px]">
                
                {/* Chat Header Info */}
                <div className="bg-slate-800/80 p-4 border-b border-slate-700/50 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🤖</span>
                    <div>
                      <h4 className="font-extrabold text-white text-sm">Engie - AI Companion</h4>
                      <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></span> Active Tutor
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={() => {
                      setChatLog([{ role: 'assistant', text: "Hello Explorer! Let's practice introducing ourselves! 👋" }]);
                      playSoundFX('click');
                    }}
                    className="text-xs text-slate-400 hover:text-white font-bold"
                  >
                    Reset Obrolan
                  </button>
                </div>

                {/* Messages Log Panel */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
                  {chatLog.map((chat, idx) => (
                    <div 
                      key={idx}
                      className={`flex gap-3 max-w-[85%] ${chat.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
                    >
                      {/* Avatar Bubble */}
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                        chat.role === 'user' ? 'bg-indigo-600' : 'bg-slate-700'
                      }`}>
                        {chat.role === 'user' ? 'ME' : '🤖'}
                      </div>

                      {/* Text Bubble */}
                      <div className={`p-3 rounded-2xl relative ${
                        chat.role === 'user' ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-slate-800 text-slate-100 rounded-tl-none'
                      }`}>
                        <p className="text-xs md:text-sm font-semibold whitespace-pre-line">{chat.text}</p>
                        
                        {/* Interactive Voice synthesis for assistant answers */}
                        {chat.role === 'assistant' && (
                          <button 
                            onClick={() => speakText(chat.text)}
                            className="mt-2 text-[10px] bg-slate-900/60 hover:bg-slate-950 px-2 py-1 rounded font-bold text-indigo-300 block w-fit"
                          >
                            🔊 Dengarkan Audio
                          </button>
                        )}
                      </div>
                    </div>
                  ))}

                  {/* Loading placeholder */}
                  {chatLoading && (
                    <div className="flex gap-3 max-w-[85%]">
                      <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-sm font-bold">🤖</div>
                      <div className="p-3 bg-slate-800 text-slate-100 rounded-2xl rounded-tl-none flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce"></span>
                        <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                        <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Send Messages Bar Form */}
                <div className="p-4 bg-slate-800/50 border-t border-slate-700/50 flex gap-2">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') handleSendChat(); }}
                    placeholder="Tulis pesan perkenalan atau pertanyaanmu..."
                    className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                  />
                  <button
                    onClick={handleSendChat}
                    className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm rounded-xl transition-all shadow-lg"
                  >
                    Kirim
                  </button>
                </div>

              </div>
            </div>
          )}

          {/* TAB 4: VOCABULARY DESK (FLASH CARDS DICTIONARY) */}
          {activeTab === 'dictionary' && (
            <div className="space-y-6">
              <div className="bg-slate-800/40 p-5 rounded-2xl border border-slate-700/30">
                <h3 className="text-lg font-bold text-white mb-1">Vocabulary Desk & Interactive Phonics</h3>
                <p className="text-xs text-slate-400">Tekan salah satu kata penting di bawah ini untuk berlatih cara pengucapan asli (Phonetics) dan terjemahannya.</p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {VOCAB_DATABASE.map((v, idx) => (
                  <div 
                    key={idx}
                    onClick={() => speakText(v.word)}
                    className="p-4 bg-slate-800/30 hover:bg-slate-800/80 rounded-2xl border border-slate-700/40 hover:border-indigo-500 transition-all cursor-pointer text-center space-y-2 group"
                  >
                    <span className="text-4xl block group-hover:scale-110 transition-transform">{v.emoji}</span>
                    <h4 className="font-extrabold text-base text-white">{v.word}</h4>
                    <p className="text-xs text-indigo-400 font-mono">{v.phonics}</p>
                    <div className="pt-2 border-t border-slate-800">
                      <span className="bg-slate-900 text-slate-300 text-[10px] font-bold px-2 py-1 rounded-full uppercase">{v.meaning}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: STUDENT ACHIEVEMENTS AND STATS */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              
              {/* Profile Card Header */}
              <div className="bg-slate-800/40 p-6 rounded-2xl border border-slate-700/30 flex flex-col sm:flex-row items-center gap-5">
                <div className="w-16 h-16 bg-gradient-to-tr from-indigo-500 to-sky-400 rounded-2xl flex items-center justify-center text-3xl shadow-xl">
                  🎓
                </div>
                <div className="flex-1 text-center sm:text-left space-y-1">
                  <h3 className="text-xl font-extrabold text-white">Elite English Explorer VII</h3>
                  <p className="text-xs text-slate-400">Booster Target: "From Zero to Confident English Speaker in 90 Days"</p>
                  
                  {/* XP Slider in profile */}
                  <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden mt-3 max-w-md">
                    <div 
                      className="bg-indigo-500 h-full transition-all"
                      style={{ width: `${(xp / (level * 500)) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 block">{xp} / {level * 500} XP menuju Level {level + 1}</span>
                </div>
              </div>

              {/* Badges Drawer Grid */}
              <div className="space-y-3">
                <h4 className="text-lg font-bold text-white">🏆 Unlocked Badge Badges</h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { name: "Bronze Explorer", icon: "🥉", desc: "Selesaikan ujian mingguan pertama", unlocked: unlockedBadges.includes("Bronze Explorer") },
                    { name: "Vocabulary Hunter", icon: "🎒", desc: "Kumpulkan 10+ kata baru", unlocked: true },
                    { name: "Grammar Hero", icon: "⚔", desc: "Kalahkan bos naga pertama", unlocked: unlockedBadges.includes("Bronze Explorer") },
                    { name: "English Legend", icon: "👑", desc: "Selesaikan tantangan penuh 90 hari", unlocked: false }
                  ].map((badge, idx) => (
                    <div 
                      key={idx}
                      className={`p-4 rounded-2xl border text-center space-y-2 ${
                        badge.unlocked ? 'bg-slate-800/70 border-amber-500/30 text-slate-100 shadow-lg' : 'bg-slate-900 border-slate-800/40 text-slate-600 opacity-50'
                      }`}
                    >
                      <span className="text-4xl block">{badge.unlocked ? badge.icon : "🔒"}</span>
                      <h5 className="font-extrabold text-xs">{badge.name}</h5>
                      <p className="text-[10px] text-slate-400">{badge.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </section>
      </main>

      {}
      {showApiModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2">
                <span className="text-xl">🔑</span>
                <h4 className="font-extrabold text-white text-base">Atur Gemini API Key</h4>
              </div>
              <button 
                onClick={() => { setShowApiModal(false); playSoundFX('click'); }}
                className="text-slate-400 hover:text-white font-extrabold text-sm"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Dapatkan API Key dari konsol Google AI Studio secara gratis untuk menghidupkan 'Engie' asisten AI Anda yang tangguh. Kunci disimpan dengan aman secara lokal dalam memori sesi Anda.
            </p>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 block">Kunci API Gemini</label>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full bg-slate-800 border border-slate-750 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
              />
            </div>

            <button
              onClick={() => {
                setShowApiModal(false);
                playSoundFX('success');
                triggerToast("Gemini API Key Berhasil Dikonfigurasi!", "success");
              }}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl"
            >
              Simpan & Aktifkan Tutor AI
            </button>
          </div>
        </div>
      )}

      {}
      <footer className="bg-slate-950 px-4 py-3 border-t border-slate-800 text-center text-[10px] text-slate-500 font-semibold uppercase tracking-widest">
        © 2026 Global English Academy • Kurikulum Merdeka SMP Kelas VII • CEFR A1 → A2
      </footer>

    </div>
  );
}