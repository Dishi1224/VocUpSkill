import { useState, useEffect } from 'react';
import { 
  Phone, 
  Lock, 
  CheckCircle, 
  Upload, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  Scissors, 
  Utensils, 
  Search, 
  Mic, 
  Plus, 
  FileText, 
  Award, 
  Briefcase, 
  LogOut, 
  Globe, 
  Eye, 
  ArrowRight,
  TrendingUp,
  MapPin,
  PhoneCall,
  Loader2,
  Trash2
} from 'lucide-react';
import { translations } from './data/translations';
import { tradesData, schemesData, jobsData } from './data/tradesData';
import { SupabaseMock } from './utils/SupabaseMock';
import type { UserProfile } from './utils/SupabaseMock';
import { SpeechHelper } from './utils/SpeechHelper';
import { BottomNav } from './components/BottomNav';
import { CertificateCard } from './components/CertificateCard';

function App() {
  // Global Accessibility & Settings
  const [lang, setLang] = useState<'en' | 'hi'>('en');
  const [audioEnabled, setAudioEnabled] = useState<boolean>(true);
  const [highContrast, setHighContrast] = useState<boolean>(false);

  // Auth / Navigation State
  const [user, setUser] = useState<UserProfile | null>(null);
  const [authStep, setAuthStep] = useState<'phone' | 'otp' | 'setup' | 'app'>('phone');
  const [phone, setPhone] = useState<string>('');
  const [otp, setOtp] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'home' | 'skills' | 'schemes' | 'profile'>('home');

  // Profile Setup State
  const [setupName, setSetupName] = useState<string>('Suman Devi');
  const [setupTrade, setSetupTrade] = useState<string>('tailoring');
  const [setupExp, setSetupExp] = useState<string>('3');

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedTradeFilter, setSelectedTradeFilter] = useState<string>('all');
  const [isListening, setIsListening] = useState<boolean>(false);
  const [voiceErrorText, setVoiceErrorText] = useState<string>('');

  // Assessment & Quiz State
  const [assessmentStep, setAssessmentStep] = useState<'intro' | 'portfolio' | 'quiz' | 'grading' | 'result'>('intro');
  const [portfolioPhotos, setPortfolioPhotos] = useState<string[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [quizAnswers, setQuizAnswers] = useState<number[]>([]);
  const [aiLoadingStage, setAiLoadingStage] = useState<number>(0);
  const [appliedJobs, setAppliedJobs] = useState<string[]>([]);

  // Labels helper shorthand
  const labels = translations[lang];

  // Load user profile on mount
  useEffect(() => {
    async function loadProfile() {
      const profile = await SupabaseMock.getProfile();
      if (profile) {
        setUser(profile);
        setAuthStep('app');
      }
    }
    loadProfile();
  }, []);

  // Sync state variables for high contrast
  useEffect(() => {
    if (highContrast) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }
  }, [highContrast]);

  // Audio instruction readouts when tabs or steps change
  const speakGuide = (text: string) => {
    SpeechHelper.speak(text, lang, audioEnabled);
  };

  useEffect(() => {
    if (authStep === 'phone') {
      speakGuide(labels.loginSubtitle + ". " + labels.phoneLabel);
    } else if (authStep === 'otp') {
      speakGuide(labels.enterOtp);
    } else if (authStep === 'setup') {
      speakGuide(labels.selectTrade);
    }
  }, [authStep, lang]);

  useEffect(() => {
    if (authStep === 'app') {
      if (activeTab === 'home') {
        const statusMsg = user?.assessmentStatus === 'verified' 
          ? labels.verifiedStatus 
          : user?.assessmentStatus === 'pending' 
          ? labels.pendingStatus 
          : labels.unverifiedStatus;
        speakGuide(`${labels.welcome} ${user?.name || ''}. ${statusMsg}`);
      } else if (activeTab === 'skills') {
        speakGuide(labels.portfolioTitle + ". " + labels.portfolioSub);
      } else if (activeTab === 'schemes') {
        speakGuide(labels.schemesTitle + ". " + labels.schemesSub);
      } else if (activeTab === 'profile') {
        speakGuide(labels.profileTitle);
      }
    }
  }, [activeTab, authStep, lang]);

  // Auth Handlers
  const handleSendOtp = async () => {
    if (!phone || phone.length < 10) {
      alert("Please enter a valid 10-digit mobile number");
      return;
    }
    setAuthStep('otp');
    speakGuide(labels.enterOtp + " 1 2 3 4");
  };

  const handleVerifyOtp = async () => {
    if (otp !== '1234' && otp.trim() !== '') {
      alert("Incorrect OTP. Enter 1234 to proceed.");
      return;
    }
    const profile = await SupabaseMock.login(phone);
    setUser(profile);
    // If name is already customized (e.g. from previous run), go directly to app
    if (profile.name && profile.certifiedAt) {
      setAuthStep('app');
    } else {
      setAuthStep('setup');
    }
  };

  const handleSaveSetup = async () => {
    if (!setupName.trim()) {
      alert("Please enter your name");
      return;
    }
    const updated = await SupabaseMock.updateProfile({
      name: setupName,
      trade: setupTrade,
      experience: setupExp
    });
    setUser(updated);
    setAuthStep('app');
    setActiveTab('home');
  };

  const handleLogout = async () => {
    await SupabaseMock.logout();
    setUser(null);
    setPhone('');
    setOtp('');
    setPortfolioPhotos([]);
    setAssessmentStep('intro');
    setCurrentQuestionIndex(0);
    setQuizAnswers([]);
    setAuthStep('phone');
    setActiveTab('home');
  };

  // Image Upload Handler
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      try {
        const base64Url = await SupabaseMock.uploadFile(file);
        const updatedPhotos = [...portfolioPhotos, base64Url];
        setPortfolioPhotos(updatedPhotos);
        speakGuide(labels.photoUploaded);
      } catch (err) {
        console.error("Upload error", err);
      }
    }
  };

  const removePhoto = (index: number) => {
    const updated = portfolioPhotos.filter((_, i) => i !== index);
    setPortfolioPhotos(updated);
  };

  // Quiz Navigation
  const activeTradeData = tradesData.find(t => t.id === (user?.trade || 'tailoring')) || tradesData[0];

  const handleAnswerSelect = (optionIndex: number) => {
    const nextAnswers = [...quizAnswers];
    nextAnswers[currentQuestionIndex] = optionIndex;
    setQuizAnswers(nextAnswers);
    speakGuide(lang === 'en' ? `Option ${optionIndex + 1} selected` : `विकल्प ${optionIndex + 1} चुना गया`);
  };

  const handleNextQuestion = () => {
    if (quizAnswers[currentQuestionIndex] === undefined) {
      alert("Please select an answer to proceed");
      return;
    }

    if (currentQuestionIndex < activeTradeData.questions.length - 1) {
      const nextIndex = currentQuestionIndex + 1;
      setCurrentQuestionIndex(nextIndex);
      // Read new question aloud
      const q = activeTradeData.questions[nextIndex];
      speakGuide(lang === 'en' ? q.audioEn : q.audioHi);
    } else {
      // Last question completed, start AI assessment
      setAssessmentStep('grading');
      startAiGradingSimulation();
    }
  };

  const startAiGradingSimulation = () => {
    setAiLoadingStage(0);
    speakGuide(labels.validatingPortfolio);
    
    // Animate stage messages
    const interval = setInterval(() => {
      setAiLoadingStage(prev => {
        if (prev >= 2) {
          clearInterval(interval);
          finalizeAssessment();
          return 3;
        }
        return prev + 1;
      });
    }, 2000);
  };

  const finalizeAssessment = async () => {
    // Calculate score
    let score = 0;
    activeTradeData.questions.forEach((q, idx) => {
      if (quizAnswers[idx] === q.correctIndex) {
        score += 1;
      }
    });

    // Determine skill level
    let skillLevel: 'Beginner' | 'Intermediate' | 'Expert' = 'Beginner';
    if (score === activeTradeData.questions.length) {
      skillLevel = 'Expert';
    } else if (score >= 2) {
      skillLevel = 'Intermediate';
    }

    const updated = await SupabaseMock.updateProfile({
      assessmentStatus: 'verified',
      quizScore: score,
      skillLevel,
      portfolioUrls: portfolioPhotos,
      certifiedAt: new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
    });

    setUser(updated);
    setAssessmentStep('result');
    speakGuide(`${labels.validationSuccess}. ${labels.skillLevelTitle} ${skillLevel === 'Expert' ? labels.levelExpert : skillLevel === 'Intermediate' ? labels.levelIntermediate : labels.levelBeginner}`);
  };

  // Voice Search Handler
  const startVoiceSearch = () => {
    setIsListening(true);
    setVoiceErrorText('');
    SpeechHelper.startListening(
      lang,
      (text) => {
        setSearchQuery(text);
        setIsListening(false);
        speakGuide(lang === 'en' ? `Searching for ${text}` : `खोज रहे हैं: ${text}`);
      },
      (err) => {
        setIsListening(false);
        setVoiceErrorText(labels.voiceError);
        console.error(err);
      },
      () => {
        setIsListening(false);
      }
    );
  };

  // Filter schemes and jobs
  const filteredSchemes = schemesData.filter(scheme => {
    const matchesSearch = searchQuery.trim() === '' || 
      scheme.titleEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      scheme.titleHi.toLowerCase().includes(searchQuery.toLowerCase()) ||
      scheme.descriptionEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      scheme.descriptionHi.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Filter tags if trade filter selected
    const matchesTrade = selectedTradeFilter === 'all' || 
      (selectedTradeFilter === 'tailoring' && (scheme.id === 'pmv' || scheme.id === 'mudra')) ||
      (selectedTradeFilter === 'beauty' && (scheme.id === 'mudra')) ||
      (selectedTradeFilter === 'foodprep' && (scheme.id === 'svanidhi' || scheme.id === 'mudra'));

    return matchesSearch && matchesTrade;
  });

  const filteredJobs = jobsData.filter(job => {
    const matchesSearch = searchQuery.trim() === '' || 
      job.titleEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.titleHi.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.employer.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesTrade = selectedTradeFilter === 'all' || job.tradeId === selectedTradeFilter;

    return matchesSearch && matchesTrade;
  });

  const handleApplyJob = (jobId: string) => {
    if (appliedJobs.includes(jobId)) return;
    setAppliedJobs([...appliedJobs, jobId]);
    speakGuide(labels.applied);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-0 sm:p-4">
      <div className="mobile-shell relative w-full shadow-2xl border-0 sm:border-8 sm:border-slate-800 sm:rounded-[36px] overflow-hidden flex flex-col min-h-screen sm:min-h-[820px] bg-white">
        
        {/* TOP ACCESSIBILITY PANEL */}
        <header className="sticky top-0 bg-teal-600 text-white z-40 px-4 py-3 flex justify-between items-center shadow-md">
          <div className="flex items-center gap-1">
            <Sparkles className="text-gold-400 fill-gold-400/20" size={20} />
            <h1 className="text-base font-extrabold tracking-tight m-0 text-white leading-none">
              {labels.appName}
            </h1>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Language Toggle */}
            <button
              onClick={() => {
                const nextLang = lang === 'en' ? 'hi' : 'en';
                setLang(nextLang);
              }}
              className="bg-teal-700 hover:bg-teal-800 text-white rounded-full p-1.5 font-bold text-xs flex items-center gap-1 transition-colors border border-teal-500/30"
              title="Toggle Language"
            >
              <Globe size={14} />
              <span>{lang === 'en' ? 'हिं' : 'EN'}</span>
            </button>

            {/* Audio Guidance Toggle */}
            <button
              onClick={() => {
                const next = !audioEnabled;
                setAudioEnabled(next);
                if (next) {
                  SpeechHelper.speak(lang === 'en' ? "Voice guide active" : "आवाज सहायता चालू है", lang, true);
                } else {
                  SpeechHelper.stop();
                }
              }}
              className={`rounded-full p-1.5 transition-colors border ${
                audioEnabled 
                  ? 'bg-amber-400 text-teal-950 border-amber-300' 
                  : 'bg-teal-700 text-teal-200 border-teal-500/30'
              }`}
              title={audioEnabled ? labels.audioGuideOn : labels.audioGuideOff}
            >
              {audioEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
            </button>

            {/* High Contrast Toggle */}
            <button
              onClick={() => setHighContrast(!highContrast)}
              className={`rounded-full p-1.5 transition-colors border ${
                highContrast 
                  ? 'bg-black text-yellow-300 border-yellow-300' 
                  : 'bg-teal-700 text-teal-200 border-teal-500/30'
              }`}
              title={labels.contrastToggle}
            >
              <Eye size={16} />
            </button>
          </div>
        </header>

        {/* ONBOARDING: PHONE NUMBER */}
        {authStep === 'phone' && (
          <div className="flex-1 p-6 flex flex-col justify-center items-center text-center">
            <div className="bg-teal-50 p-5 rounded-full mb-6">
              <Award className="text-teal-600 w-16 h-16 stroke-[1.5]" />
            </div>
            
            <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight leading-tight">
              {labels.loginTitle}
            </h2>
            <p className="text-slate-500 text-sm mt-2 max-w-xs leading-relaxed">
              {labels.loginSubtitle}
            </p>

            <div className="w-full mt-8 text-left">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                {labels.phoneLabel}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Phone size={18} />
                </div>
                <input
                  type="tel"
                  maxLength={10}
                  placeholder={labels.phonePlaceholder}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                  className="w-full pl-10 pr-4 py-3.5 bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-teal-600 focus:bg-white outline-none font-semibold text-lg text-slate-800 tracking-widest placeholder:text-slate-400 placeholder:tracking-normal transition-all"
                />
              </div>

              <button
                onClick={handleSendOtp}
                className="w-full mt-6 bg-teal-600 hover:bg-teal-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-teal-600/20 flex items-center justify-center gap-2 text-base transition-all active:scale-[0.98]"
              >
                <span>{labels.sendOtp}</span>
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        )}

        {/* ONBOARDING: OTP CODE */}
        {authStep === 'otp' && (
          <div className="flex-1 p-6 flex flex-col justify-center items-center text-center">
            <div className="bg-amber-50 p-5 rounded-full mb-6">
              <Lock className="text-amber-600 w-16 h-16 stroke-[1.5]" />
            </div>
            
            <h2 className="text-xl font-extrabold text-slate-800 tracking-tight">
              {labels.enterOtp}
            </h2>
            <p className="text-slate-500 text-xs mt-1">
              Enter test code <strong className="text-teal-600 font-bold">1234</strong> or leave blank
            </p>

            <div className="w-full mt-8 text-left">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock size={18} />
                </div>
                <input
                  type="text"
                  pattern="\d*"
                  maxLength={4}
                  placeholder={labels.otpPlaceholder}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  className="w-full pl-10 pr-4 py-3.5 bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-teal-600 focus:bg-white outline-none font-bold text-center text-xl text-slate-800 tracking-[1.5em] placeholder:text-slate-400 placeholder:tracking-normal transition-all"
                />
              </div>

              <button
                onClick={handleVerifyOtp}
                className="w-full mt-6 bg-teal-600 hover:bg-teal-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-teal-600/20 flex items-center justify-center gap-2 text-base transition-all"
              >
                <CheckCircle size={18} />
                <span>{labels.verifyOtp}</span>
              </button>

              <div className="flex justify-between items-center mt-6">
                <button 
                  onClick={() => setAuthStep('phone')}
                  className="text-slate-500 hover:text-slate-800 text-xs font-semibold"
                >
                  {labels.back}
                </button>
                <button 
                  onClick={() => alert("Verification code resent! Enter 1234")}
                  className="text-teal-600 hover:text-teal-800 text-xs font-bold"
                >
                  {labels.resendOtp}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ONBOARDING: PROFILE INITIAL SETUP */}
        {authStep === 'setup' && (
          <div className="flex-1 p-6 flex flex-col justify-start overflow-y-auto">
            <div className="text-center my-4">
              <h2 className="text-xl font-extrabold text-slate-800 tracking-tight">
                {labels.selectTrade}
              </h2>
              <p className="text-slate-500 text-xs mt-1">
                {labels.chooseTradeSubtitle}
              </p>
            </div>

            <div className="space-y-4 mt-4 text-left">
              {/* Name field */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  {labels.nameLabel}
                </label>
                <input
                  type="text"
                  value={setupName}
                  onChange={(e) => setSetupName(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-teal-600 outline-none font-semibold text-slate-800"
                />
              </div>

              {/* Trade Selection (Big Cards) */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  {labels.tradeLabel}
                </label>
                <div className="grid grid-cols-1 gap-3">
                  {[
                    { id: 'tailoring', name: labels.sewingTrade, desc: 'Silai & Designing', icon: Scissors },
                    { id: 'beauty', name: labels.beautyTrade, desc: 'Makeup, Threading & Care', icon: Sparkles },
                    { id: 'foodprep', name: labels.foodTrade, desc: 'Cooking, Catering & Tiffin', icon: Utensils }
                  ].map((t) => {
                    const Icon = t.icon;
                    const isSelected = setupTrade === t.id;
                    return (
                      <button
                        key={t.id}
                        onClick={() => {
                          setSetupTrade(t.id);
                          speakGuide(t.name);
                        }}
                        className={`flex items-center gap-4 p-4 rounded-2xl border-2 text-left transition-all ${
                          isSelected 
                            ? 'border-teal-600 bg-teal-50/75 shadow-md shadow-teal-600/5' 
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className={`p-3 rounded-xl ${
                          isSelected ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-500'
                        }`}>
                          <Icon size={24} />
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-800 text-sm leading-none">{t.name}</h4>
                          <p className="text-[11px] text-slate-400 mt-1">{t.desc}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Years of Experience Slider */}
              <div>
                <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  <span>{labels.experienceLabel}</span>
                  <span className="text-teal-600 font-extrabold text-sm">{setupExp} Years</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="15"
                  value={setupExp}
                  onChange={(e) => setSetupExp(e.target.value)}
                  className="w-full accent-teal-600 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <button
                onClick={handleSaveSetup}
                className="w-full mt-6 bg-teal-600 hover:bg-teal-700 text-white font-bold py-4 rounded-xl shadow-lg flex items-center justify-center gap-2"
              >
                <CheckCircle size={18} />
                <span>Save and Continue</span>
              </button>
            </div>
          </div>
        )}

        {/* LOGGED IN APPLICATION VIEWS */}
        {authStep === 'app' && user && (
          <div className="flex-1 flex flex-col overflow-y-auto">
            
            {/* TAB 1: HOME */}
            {activeTab === 'home' && (
              <div className="p-5 space-y-5">
                {/* Sister Welcome Banner */}
                <div className="bg-gradient-to-br from-teal-700 to-teal-850 text-white rounded-3xl p-5 shadow-xl shadow-teal-900/10 relative overflow-hidden text-left">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-amber-400/10 rounded-full blur-2xl pointer-events-none"></div>
                  
                  <p className="text-[11px] text-teal-200 font-bold uppercase tracking-widest leading-none">
                    {labels.welcome}
                  </p>
                  <h2 className="text-xl font-extrabold tracking-tight mt-1 text-white">
                    {user.name}
                  </h2>
                  <p className="text-xs text-teal-100/80 mt-1">
                    {user.trade === 'tailoring' ? labels.sewingTrade : user.trade === 'beauty' ? labels.beautyTrade : labels.foodTrade} • {user.experience} Years Exp
                  </p>
                  
                  <div className="mt-4 flex items-center justify-between border-t border-teal-600/40 pt-4">
                    <span className="text-[11px] font-medium text-teal-200">
                      Status:
                    </span>
                    <span className={`text-[11px] font-extrabold px-3 py-1 rounded-full ${
                      user.assessmentStatus === 'verified'
                        ? 'bg-emerald-400/20 text-emerald-300'
                        : user.assessmentStatus === 'pending'
                        ? 'bg-amber-400/20 text-amber-300'
                        : 'bg-rose-400/20 text-rose-300'
                    }`}>
                      {user.assessmentStatus === 'verified' 
                        ? labels.verifiedStatus 
                        : user.assessmentStatus === 'pending' 
                        ? labels.pendingStatus 
                        : labels.unverifiedStatus}
                    </span>
                  </div>
                </div>

                {/* Verification Action Box */}
                {user.assessmentStatus === 'unverified' && (
                  <div className="bg-amber-50/60 border border-amber-200 rounded-3xl p-5 text-left flex flex-col gap-4">
                    <div className="flex gap-4">
                      <div className="bg-amber-100 text-amber-800 p-3 rounded-2xl h-fit">
                        <Award size={28} />
                      </div>
                      <div>
                        <h4 className="font-extrabold text-slate-800 text-base">Get Certified Today</h4>
                        <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                          Document your work and pass a simple visual test to unlock government grants & local job postings!
                        </p>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => setActiveTab('skills')}
                      className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all w-full shadow-md text-sm"
                    >
                      <Plus size={18} strokeWidth={3} />
                      <span>{labels.startAssessment}</span>
                    </button>
                  </div>
                )}

                {/* Quick Link Cards */}
                <div className="grid grid-cols-2 gap-4">
                  {user.assessmentStatus === 'verified' ? (
                    <button
                      onClick={() => setActiveTab('profile')}
                      className="bg-teal-50/70 border border-teal-100 hover:border-teal-200 rounded-2xl p-4 flex flex-col items-center justify-center text-center gap-2 group transition-all"
                    >
                      <div className="bg-teal-600 text-white p-3 rounded-full transition-transform group-hover:scale-105">
                        <FileText size={20} />
                      </div>
                      <span className="text-xs font-bold text-slate-700 leading-tight">
                        {labels.checkCertificate}
                      </span>
                    </button>
                  ) : (
                    <button
                      onClick={() => setActiveTab('skills')}
                      className="bg-slate-50 border border-slate-100 hover:border-slate-200 rounded-2xl p-4 flex flex-col items-center justify-center text-center gap-2 group transition-all"
                    >
                      <div className="bg-slate-600 text-white p-3 rounded-full">
                        <Award size={20} />
                      </div>
                      <span className="text-xs font-bold text-slate-700 leading-tight">
                        {labels.startAssessment}
                      </span>
                    </button>
                  )}

                  <button
                    onClick={() => setActiveTab('schemes')}
                    className="bg-slate-50 border border-slate-100 hover:border-slate-200 rounded-2xl p-4 flex flex-col items-center justify-center text-center gap-2 group transition-all"
                  >
                    <div className="bg-indigo-600 text-white p-3 rounded-full transition-transform group-hover:scale-105">
                      <Briefcase size={20} />
                    </div>
                    <span className="text-xs font-bold text-slate-700 leading-tight">
                      {labels.exploreSchemes}
                    </span>
                  </button>
                </div>

                {/* Helpful tips readouts */}
                <div className="border border-slate-100 rounded-2xl p-4 text-left bg-slate-50 flex items-start gap-3">
                  <Volume2 className="text-teal-600 shrink-0 mt-0.5" size={20} />
                  <div>
                    <h5 className="font-bold text-slate-700 text-xs">Audio Guide Tip</h5>
                    <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                      {lang === 'en' 
                        ? 'Tap the audio speaker icon on any screen to hear information read aloud in your language!'
                        : 'अपनी भाषा में जानकारी सुनने के लिए किसी भी स्क्रीन पर बने स्पीकर आइकन को दबाएं!'}
                    </p>
                  </div>
                </div>

                {/* App Showcase Stats */}
                <div className="bg-slate-50 rounded-2xl p-4 text-left border border-slate-100">
                  <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-3">Our Platform Impact</h4>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="bg-white p-2.5 rounded-xl border border-slate-100 shadow-sm">
                      <p className="text-base font-extrabold text-teal-600">12,000+</p>
                      <p className="text-[9px] text-slate-400 mt-0.5">Women Certified</p>
                    </div>
                    <div className="bg-white p-2.5 rounded-xl border border-slate-100 shadow-sm">
                      <p className="text-base font-extrabold text-teal-600">₹4.2 Cr</p>
                      <p className="text-[9px] text-slate-400 mt-0.5">Grants Disbursed</p>
                    </div>
                    <div className="bg-white p-2.5 rounded-xl border border-slate-100 shadow-sm">
                      <p className="text-base font-extrabold text-teal-600">92%</p>
                      <p className="text-[9px] text-slate-400 mt-0.5">Hiring Rate</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: SKILL ASSESSMENT & PORTFOLIO */}
            {activeTab === 'skills' && (
              <div className="p-5 flex-1 flex flex-col">
                
                {/* STEP 1: INTRO */}
                {assessmentStep === 'intro' && (
                  <div className="flex-1 flex flex-col justify-between py-4 text-left">
                    <div className="space-y-4">
                      <h3 className="text-xl font-extrabold text-slate-800">
                        {labels.assessmentTitle}
                      </h3>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        To earn your verified certificate, please complete these two simple steps:
                      </p>

                      <div className="space-y-3 mt-4">
                        <div className="flex gap-3 p-4 rounded-xl border border-slate-200 bg-slate-50">
                          <span className="h-6 w-6 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold text-xs shrink-0">1</span>
                          <div>
                            <h4 className="font-bold text-slate-700 text-sm">{labels.portfolioTitle}</h4>
                            <p className="text-[11px] text-slate-500 mt-0.5">Upload 3 photos showing your creations, stitches, or work items.</p>
                          </div>
                        </div>

                        <div className="flex gap-3 p-4 rounded-xl border border-slate-200 bg-slate-50">
                          <span className="h-6 w-6 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold text-xs shrink-0">2</span>
                          <div>
                            <h4 className="font-bold text-slate-700 text-sm">{labels.quizTitle}</h4>
                            <p className="text-[11px] text-slate-500 mt-0.5">Answer simple picture/image-based questions about tools and techniques.</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => setAssessmentStep('portfolio')}
                      className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-4 rounded-xl shadow-lg w-full flex items-center justify-center gap-2 mt-6 text-sm"
                    >
                      <span>Get Started</span>
                      <ArrowRight size={18} />
                    </button>
                  </div>
                )}

                {/* STEP 2: PORTFOLIO PHOTO UPLOAD */}
                {assessmentStep === 'portfolio' && (
                  <div className="flex-1 flex flex-col justify-between py-2 text-left">
                    <div>
                      <h3 className="text-lg font-extrabold text-slate-800">
                        {labels.portfolioTitle}
                      </h3>
                      <p className="text-xs text-slate-500 mt-1">
                        {labels.portfolioSub} (Uploaded: {portfolioPhotos.length}/3)
                      </p>

                      {/* Photo upload grid */}
                      <div className="grid grid-cols-3 gap-3 my-6">
                        {[0, 1, 2].map((idx) => {
                          const hasPhoto = portfolioPhotos[idx];
                          return (
                            <div 
                              key={idx} 
                              className="aspect-square rounded-2xl border-2 border-dashed border-slate-300 relative flex flex-col items-center justify-center bg-slate-50 overflow-hidden"
                            >
                              {hasPhoto ? (
                                <>
                                  <img 
                                    src={hasPhoto} 
                                    alt="work item" 
                                    className="w-full h-full object-cover" 
                                  />
                                  <button
                                    onClick={() => removePhoto(idx)}
                                    className="absolute top-1.5 right-1.5 bg-red-600 text-white rounded-full p-1 shadow hover:bg-red-700"
                                  >
                                    <Trash2 size={12} />
                                  </button>
                                </>
                              ) : (
                                <label className="cursor-pointer w-full h-full flex flex-col items-center justify-center p-2 text-slate-400 hover:text-slate-600">
                                  <Upload size={20} />
                                  <span className="text-[9px] font-bold text-center mt-1.5">{labels.uploadPhoto}</span>
                                  <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handlePhotoUpload}
                                  />
                                </label>
                              )}
                            </div>
                          );
                        })}
                      </div>

                      {portfolioPhotos.length >= 3 && (
                        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl p-3 text-xs font-semibold flex items-center gap-2">
                          <CheckCircle size={16} />
                          <span>{labels.photoUploaded}</span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-3 mt-6">
                      <button
                        onClick={() => {
                          if (portfolioPhotos.length < 3) {
                            // Add mock pictures automatically to help demo the quiz easily
                            const mockPhotos = [
                              "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'><rect width='100' height='100' fill='%23eef8fa'/><path d='M10 80 Q 50 10 90 80' stroke='%230D5C75' stroke-width='4' fill='none'/></svg>",
                              "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'><rect width='100' height='100' fill='%23fef3c7'/><circle cx='50' cy='50' r='30' fill='%23D4AF37'/></svg>",
                              "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'><rect width='100' height='100' fill='%23f3e8ff'/><rect x='25' y='25' width='50' height='50' rx='5' fill='%23c084fc'/></svg>"
                            ];
                            setPortfolioPhotos(mockPhotos);
                            speakGuide(labels.photoUploaded);
                            return;
                          }
                          // Proceed to quiz
                          setAssessmentStep('quiz');
                          setCurrentQuestionIndex(0);
                          setQuizAnswers([]);
                          // Speak first question
                          const q = activeTradeData.questions[0];
                          speakGuide(lang === 'en' ? q.audioEn : q.audioHi);
                        }}
                        className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-4 rounded-xl shadow-lg flex items-center justify-center gap-2 text-sm"
                      >
                        {portfolioPhotos.length >= 3 ? (
                          <>
                            <span>Continue to Quiz</span>
                            <ArrowRight size={18} />
                          </>
                        ) : (
                          <span>Demo: Autofill Work Portfolio</span>
                        )}
                      </button>

                      <button
                        onClick={() => setAssessmentStep('intro')}
                        className="w-full border border-slate-200 text-slate-500 py-3 rounded-xl text-center text-xs font-semibold"
                      >
                        {labels.back}
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 3: VISUAL MULTIPLE CHOICE QUIZ */}
                {assessmentStep === 'quiz' && (
                  <div className="flex-1 flex flex-col justify-between py-2 text-left">
                    <div>
                      {/* Progress Header */}
                      <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                        <span className="text-xs font-bold text-teal-600 uppercase tracking-wider">
                          {labels.quizTitle}
                        </span>
                        <span className="text-xs font-extrabold text-slate-500">
                          {labels.questionText} {currentQuestionIndex + 1} / {activeTradeData.questions.length}
                        </span>
                      </div>

                      {/* Question Container */}
                      <div className="mt-4 space-y-4">
                        {/* Audio guidance button */}
                        <div className="flex items-start gap-3 bg-teal-50/50 p-3.5 rounded-2xl border border-teal-100/30">
                          <button
                            onClick={() => {
                              const q = activeTradeData.questions[currentQuestionIndex];
                              speakGuide(lang === 'en' ? q.audioEn : q.audioHi);
                            }}
                            className="bg-teal-600 hover:bg-teal-700 text-white rounded-full p-2.5 transition-transform shrink-0"
                            title="Hear Question"
                          >
                            <Volume2 size={18} />
                          </button>
                          
                          <h4 className="text-sm sm:text-base font-bold text-slate-800 leading-snug">
                            {lang === 'en' 
                              ? activeTradeData.questions[currentQuestionIndex].questionEn 
                              : activeTradeData.questions[currentQuestionIndex].questionHi}
                          </h4>
                        </div>

                        {/* Interactive SVG Diagram representing the visual question */}
                        <div className="w-full flex justify-center py-2" dangerouslySetInnerHTML={{
                          __html: activeTradeData.questions[currentQuestionIndex].imageSvg
                        }}>
                        </div>

                        {/* Multiple Choice Options */}
                        <div className="space-y-3 mt-4">
                          {activeTradeData.questions[currentQuestionIndex].optionsEn.map((optEn, optIdx) => {
                            const optHi = activeTradeData.questions[currentQuestionIndex].optionsHi[optIdx];
                            const isSelected = quizAnswers[currentQuestionIndex] === optIdx;
                            return (
                              <button
                                key={optIdx}
                                onClick={() => handleAnswerSelect(optIdx)}
                                className={`w-full flex items-center justify-between p-4 rounded-xl border-2 text-left transition-all ${
                                  isSelected
                                    ? 'border-teal-600 bg-teal-50 text-slate-900 font-bold'
                                    : 'border-slate-200 hover:border-slate-300 text-slate-700'
                                }`}
                              >
                                <span className="text-xs sm:text-sm">
                                  {lang === 'en' ? optEn : optHi}
                                </span>
                                <span className={`h-5 w-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                                  isSelected ? 'border-teal-600 bg-teal-600 text-white' : 'border-slate-300'
                                }`}>
                                  {isSelected && <span className="h-2.5 w-2.5 rounded-full bg-white"></span>}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={handleNextQuestion}
                      className="w-full mt-6 bg-teal-600 hover:bg-teal-700 text-white font-bold py-4 rounded-xl shadow-lg flex items-center justify-center gap-2 text-sm"
                    >
                      <span>
                        {currentQuestionIndex === activeTradeData.questions.length - 1 ? labels.submit : labels.next}
                      </span>
                      <ArrowRight size={18} />
                    </button>
                  </div>
                )}

                {/* STEP 4: AI VALIDATION SIMULATOR GRADING */}
                {assessmentStep === 'grading' && (
                  <div className="flex-1 flex flex-col justify-center items-center text-center p-6">
                    <Loader2 className="text-teal-600 h-16 w-16 animate-spin stroke-[2]" />
                    
                    <h3 className="text-lg font-extrabold text-slate-800 mt-6">
                      {labels.validatingPortfolio}
                    </h3>
                    <p className="text-xs text-slate-400 mt-2 max-w-xs leading-relaxed">
                      Our system is checking your portfolio photos for stitch count, alignment, and quiz accuracy.
                    </p>

                    {/* Progress Bar steps */}
                    <div className="w-full max-w-xs mt-8 space-y-3 text-left">
                      <div className="flex justify-between text-[11px] font-bold text-slate-400 uppercase">
                        <span>Verification Phase</span>
                        <span>{aiLoadingStage === 0 ? "33%" : aiLoadingStage === 1 ? "66%" : "100%"}</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                        <div 
                          className="bg-teal-600 h-full transition-all duration-700"
                          style={{ width: `${(aiLoadingStage + 1) * 33}%` }}
                        ></div>
                      </div>
                      
                      <ul className="text-xs space-y-2 mt-4">
                        <li className={`flex items-center gap-2 ${aiLoadingStage >= 0 ? "text-slate-700 font-medium" : "text-slate-300"}`}>
                          <span className={`h-2 w-2 rounded-full ${aiLoadingStage >= 0 ? "bg-teal-600" : "bg-slate-200"}`}></span>
                          Analyzing stitch symmetry & pattern...
                        </li>
                        <li className={`flex items-center gap-2 ${aiLoadingStage >= 1 ? "text-slate-700 font-medium" : "text-slate-300"}`}>
                          <span className={`h-2 w-2 rounded-full ${aiLoadingStage >= 1 ? "bg-teal-600" : "bg-slate-200"}`}></span>
                          Validating trade knowledge answers...
                        </li>
                        <li className={`flex items-center gap-2 ${aiLoadingStage >= 2 ? "text-slate-700 font-medium" : "text-slate-300"}`}>
                          <span className={`h-2 w-2 rounded-full ${aiLoadingStage >= 2 ? "bg-teal-600" : "bg-slate-200"}`}></span>
                          Generating secure verified certificate...
                        </li>
                      </ul>
                    </div>
                  </div>
                )}

                {/* STEP 5: ASSESSMENT RESULTS */}
                {assessmentStep === 'result' && (
                  <div className="flex-1 flex flex-col justify-between py-4 text-center">
                    <div className="space-y-4">
                      <div className="mx-auto bg-emerald-50 text-emerald-600 p-4 rounded-full w-fit">
                        <CheckCircle size={48} className="fill-current text-white" />
                      </div>
                      
                      <h3 className="text-xl font-extrabold text-slate-800">
                        {labels.validationSuccess}
                      </h3>
                      <p className="text-xs text-slate-500">
                        {labels.scoreText} <strong className="text-slate-800 text-sm font-bold">{user.quizScore} / {activeTradeData.questions.length}</strong>
                      </p>

                      <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 my-6 text-left">
                        <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                          {labels.skillLevelTitle}
                        </span>
                        
                        <div className="flex items-center gap-3 mt-2">
                          <Award className="text-amber-500 stroke-[2]" size={36} />
                          <div>
                            <h4 className="text-base font-extrabold text-slate-800">
                              {user.skillLevel === 'Expert' ? labels.levelExpert : user.skillLevel === 'Intermediate' ? labels.levelIntermediate : labels.levelBeginner}
                            </h4>
                            <p className="text-[11px] text-slate-500 mt-0.5">
                              {user.skillLevel === 'Expert' 
                                ? 'Master level. Eligible for senior jobs & maximum PM tool aid.' 
                                : user.skillLevel === 'Intermediate'
                                ? 'Skilled level. Eligible for local business expansions.' 
                                : 'Qualified practitioner.'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <button
                        onClick={() => {
                          setActiveTab('profile');
                          setAssessmentStep('intro');
                        }}
                        className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-4 rounded-xl shadow-lg flex items-center justify-center gap-2 text-sm"
                      >
                        <FileText size={18} />
                        <span>{labels.checkCertificate}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: OPPORTUNITIES BRIDGE (SCHEMES & JOBS BAZAAR) */}
            {activeTab === 'schemes' && (
              <div className="p-5 text-left flex-1 flex flex-col">
                
                {/* Visual filter navigation toggle */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <h3 className="text-base font-extrabold text-slate-800">
                    {labels.exploreSchemes} & Jobs
                  </h3>
                  
                  <select 
                    value={selectedTradeFilter}
                    onChange={(e) => setSelectedTradeFilter(e.target.value)}
                    className="text-xs font-bold text-teal-600 bg-teal-50 border border-teal-100 py-1.5 px-3 rounded-full outline-none"
                  >
                    <option value="all">All Skills (सभी)</option>
                    <option value="tailoring">{labels.sewingTrade}</option>
                    <option value="beauty">{labels.beautyTrade}</option>
                    <option value="foodprep">{labels.foodTrade}</option>
                  </select>
                </div>

                {/* Multilingual Voice Search input */}
                <div className="mt-4 relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={labels.searchPlaceholder}
                    className="w-full pl-10 pr-12 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-teal-600 focus:bg-white outline-none text-xs font-medium text-slate-800"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Search size={16} />
                  </div>
                  
                  {/* Microphone helper */}
                  <button
                    onClick={startVoiceSearch}
                    className={`absolute inset-y-1.5 right-1.5 px-2 rounded-lg flex items-center justify-center transition-colors ${
                      isListening 
                        ? 'bg-red-500 text-white animate-pulse' 
                        : 'bg-teal-50 text-teal-600 hover:bg-teal-100'
                    }`}
                    title={labels.searchVoice}
                  >
                    <Mic size={16} />
                  </button>
                </div>

                {/* Listening Alert message */}
                {isListening && (
                  <div className="mt-2 text-xs text-red-500 font-semibold flex items-center gap-1.5 animate-pulse bg-red-50 p-2 rounded-lg">
                    <span className="h-2 w-2 rounded-full bg-red-500"></span>
                    {labels.voiceListening}
                  </div>
                )}
                {voiceErrorText && (
                  <div className="mt-2 text-xs text-rose-500 bg-rose-50 p-2 rounded-lg">
                    {voiceErrorText}
                  </div>
                )}

                {/* Feed listings (Schemes and Jobs Bazar) */}
                <div className="space-y-6 mt-6">
                  
                  {/* Section 1: Gov Schemes */}
                  <div>
                    <div className="flex items-center gap-1.5 mb-3">
                      <TrendingUp size={16} className="text-teal-600" />
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                        {labels.schemesTitle} ({filteredSchemes.length})
                      </h4>
                    </div>

                    <div className="space-y-4">
                      {filteredSchemes.map((scheme) => (
                        <div 
                          key={scheme.id}
                          className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm text-left flex flex-col justify-between hover:border-slate-200 transition-all"
                        >
                          <div>
                            <div className="flex justify-between items-start">
                              <h5 className="font-extrabold text-sm text-slate-800 leading-tight">
                                {lang === 'en' ? scheme.titleEn : scheme.titleHi}
                              </h5>
                              <span className="bg-teal-50 text-teal-700 text-[9px] font-extrabold px-2 py-0.5 rounded">
                                Gov Aid
                              </span>
                            </div>
                            
                            <p className="text-[11px] text-slate-500 mt-2 leading-relaxed">
                              {lang === 'en' ? scheme.descriptionEn : scheme.descriptionHi}
                            </p>

                            <div className="mt-3 bg-teal-50/50 p-2.5 rounded-xl border border-teal-100/30">
                              <span className="text-[8px] uppercase tracking-wider text-teal-700 font-bold block">Benefit (लाभ):</span>
                              <p className="text-[10px] text-slate-700 font-bold mt-0.5">
                                {lang === 'en' ? scheme.benefitsEn : scheme.benefitsHi}
                              </p>
                            </div>
                          </div>

                          <div className="mt-4 flex gap-2 flex-wrap">
                            {(lang === 'en' ? scheme.tagsEn : scheme.tagsHi).map((t, i) => (
                              <span key={i} className="text-[9px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full font-medium">
                                {t}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Section 2: Jobs Board (Bazaar) */}
                  <div>
                    <div className="flex items-center gap-1.5 mb-3">
                      <Briefcase size={16} className="text-teal-600" />
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                        {labels.jobsTitle} ({filteredJobs.length})
                      </h4>
                    </div>

                    <div className="space-y-4">
                      {filteredJobs.map((job) => {
                        const isApplied = appliedJobs.includes(job.id);
                        return (
                          <div 
                            key={job.id}
                            className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm text-left flex flex-col justify-between hover:border-slate-200 transition-all"
                          >
                            <div>
                              <div className="flex justify-between items-start">
                                <h5 className="font-extrabold text-sm text-slate-800 leading-tight">
                                  {lang === 'en' ? job.titleEn : job.titleHi}
                                </h5>
                                <span className="bg-amber-50 text-amber-700 text-[9px] font-extrabold px-2 py-0.5 rounded">
                                  Job Bazaar
                                </span>
                              </div>
                              
                              <p className="text-[10px] font-bold text-teal-600 mt-1">
                                {job.employer}
                              </p>

                              <div className="flex gap-4 items-center mt-3 text-[11px] text-slate-400">
                                <span className="flex items-center gap-1">
                                  <MapPin size={12} className="text-slate-400" />
                                  {lang === 'en' ? job.locationEn : job.locationHi}
                                </span>
                                <span className="font-extrabold text-slate-700">
                                  {lang === 'en' ? job.salaryEn : job.salaryHi}
                                </span>
                              </div>
                            </div>

                            <button
                              onClick={() => handleApplyJob(job.id)}
                              className={`mt-4 w-full py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border-2 transition-all ${
                                isApplied
                                  ? 'bg-emerald-500 border-emerald-500 text-white'
                                  : 'border-teal-600 text-teal-600 hover:bg-teal-50'
                              }`}
                            >
                              {isApplied ? (
                                <>
                                  <CheckCircle size={14} />
                                  <span>{labels.applied}</span>
                                </>
                              ) : (
                                <>
                                  <PhoneCall size={14} />
                                  <span>{labels.applyNow}</span>
                                </>
                              )}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                </div>
              </div>
            )}

            {/* TAB 4: PROFILE & DIGITAL CERTIFICATE */}
            {activeTab === 'profile' && (
              <div className="p-5 space-y-6">
                
                {/* Profile card metadata details */}
                <div className="bg-slate-50 border border-slate-100 rounded-3xl p-5 text-left flex items-start gap-4 shadow-sm">
                  {user.photoUrl ? (
                    <img 
                      src={user.photoUrl} 
                      alt={user.name} 
                      className="w-16 h-16 rounded-full object-cover border-2 border-teal-600"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-teal-600 text-white font-extrabold text-xl flex items-center justify-center border-2 border-teal-500">
                      {user.name.charAt(0)}
                    </div>
                  )}

                  <div className="flex-1">
                    <h3 className="text-base font-extrabold text-slate-800 leading-tight">
                      {user.name}
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Phone: +91 {user.phone}
                    </p>
                    <p className="text-[11px] text-slate-500 font-semibold mt-1">
                      {user.trade === 'tailoring' ? labels.sewingTrade : user.trade === 'beauty' ? labels.beautyTrade : labels.foodTrade}
                    </p>
                    <p className="text-[10px] text-slate-400">
                      Experience: {user.experience} Years
                    </p>
                  </div>
                </div>

                {/* Digital Certificate Section */}
                <div className="text-left">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
                    <Award size={16} className="text-teal-600" />
                    My Digital ID & Certificate
                  </h4>

                  {user.assessmentStatus === 'verified' ? (
                    <CertificateCard profile={user} labels={labels} />
                  ) : (
                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-center">
                      <Award size={36} className="text-slate-300 mx-auto" />
                      <h5 className="font-extrabold text-slate-700 text-sm mt-3">No Certificate Yet</h5>
                      <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                        Please upload your portfolio and take the assessment to receive your blockchain digital certificate.
                      </p>
                      <button
                        onClick={() => setActiveTab('skills')}
                        className="mt-4 bg-teal-600 hover:bg-teal-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs"
                      >
                        Start Test
                      </button>
                    </div>
                  )}
                </div>

                {/* Self Gallery of works */}
                {portfolioPhotos.length > 0 && (
                  <div className="text-left">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                      {labels.myGallery}
                    </h4>
                    <div className="grid grid-cols-3 gap-2">
                      {portfolioPhotos.map((photo, i) => (
                        <div key={i} className="aspect-square rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
                          <img src={photo} alt="creation" className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Sign Out Button */}
                <button
                  onClick={handleLogout}
                  className="w-full mt-6 bg-slate-50 hover:bg-slate-100 text-rose-600 font-bold py-3.5 rounded-xl border border-rose-200 flex items-center justify-center gap-2 text-xs"
                >
                  <LogOut size={16} />
                  <span>{labels.logout}</span>
                </button>

              </div>
            )}

            {/* Bottom Nav Bar */}
            <BottomNav 
              activeTab={activeTab} 
              setActiveTab={(tab) => {
                setActiveTab(tab);
                setSearchQuery('');
              }} 
              labels={labels} 
            />

          </div>
        )}

      </div>
    </div>
  );
}

export default App;
