import React, { useState, useEffect } from 'react';
import { storage } from '../utils/storage';
import { Lock, Unlock, KeyRound, ShieldAlert, CheckCircle2, RefreshCw, Settings, Eye, EyeOff } from 'lucide-react';

interface AdminPinLockProps {
  lang: 'hi' | 'en';
  moduleTitle: string;
  moduleSubtitle?: string;
  children: React.ReactNode;
}

export const AdminPinLock: React.FC<AdminPinLockProps> = ({
  lang,
  moduleTitle,
  moduleSubtitle,
  children
}) => {
  const [isPinEnabled, setIsPinEnabled] = useState<boolean>(() => storage.isAdminPinEnabled());
  const [storedPin, setStoredPin] = useState<string>(() => storage.getAdminPin() || '1234');
  const [isUnlocked, setIsUnlocked] = useState<boolean>(!storage.isAdminPinEnabled());
  
  // Keypad & Form state
  const [inputPin, setInputPin] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSettingModalOpen, setIsSettingModalOpen] = useState<boolean>(false);
  const [showPinText, setShowPinText] = useState<boolean>(false);

  // New PIN configuration form state
  const [oldPinInput, setOldPinInput] = useState<string>('');
  const [newPinInput, setNewPinInput] = useState<string>('');
  const [confirmPinInput, setConfirmPinInput] = useState<string>('');
  const [configSuccessMsg, setConfigSuccessMsg] = useState<string | null>(null);
  const [configErrorMsg, setConfigErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    // If PIN lock disabled, default to unlocked
    if (!isPinEnabled) {
      setIsUnlocked(true);
    }
  }, [isPinEnabled]);

  // Keyboard navigation listener for PIN input
  useEffect(() => {
    if (isUnlocked) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key >= '0' && e.key <= '9') {
        if (inputPin.length < 4) {
          handleKeyPress(e.key);
        }
      } else if (e.key === 'Backspace') {
        handleBackspace();
      } else if (e.key === 'Enter') {
        if (inputPin.length === 4) {
          verifyPin(inputPin);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [inputPin, isUnlocked, storedPin]);

  const handleKeyPress = (numStr: string) => {
    if (inputPin.length >= 4) return;
    const updated = inputPin + numStr;
    setInputPin(updated);
    setErrorMsg(null);

    // Auto verify when 4 digits typed
    if (updated.length === 4) {
      verifyPin(updated);
    }
  };

  const handleBackspace = () => {
    setInputPin((prev) => prev.slice(0, -1));
    setErrorMsg(null);
  };

  const handleClear = () => {
    setInputPin('');
    setErrorMsg(null);
  };

  const verifyPin = (pinToTest: string) => {
    if (pinToTest === storedPin) {
      setIsUnlocked(true);
      setErrorMsg(null);
    } else {
      setErrorMsg(
        lang === 'hi' 
          ? 'गलत पिन! डिफ़ॉल्ट पिन 1234 है।' 
          : 'Incorrect PIN! Default PIN is 1234.'
      );
      setInputPin('');
    }
  };

  const handleTogglePinProtection = () => {
    const nextState = !isPinEnabled;
    setIsPinEnabled(nextState);
    storage.setAdminPinEnabled(nextState);
    if (!nextState) {
      setIsUnlocked(true);
    }
    setConfigSuccessMsg(
      nextState
        ? lang === 'hi' ? 'प्रशासनिक पिन-लॉक चालू किया गया।' : 'Admin PIN Lock enabled.'
        : lang === 'hi' ? 'प्रशासनिक पिन-लॉक बंद किया गया।' : 'Admin PIN Lock disabled.'
    );
  };

  const handleSaveNewPin = (e: React.FormEvent) => {
    e.preventDefault();
    setConfigErrorMsg(null);
    setConfigSuccessMsg(null);

    if (isPinEnabled && oldPinInput !== storedPin) {
      setConfigErrorMsg(
        lang === 'hi' ? 'पुराना पिन गलत है।' : 'Old PIN is incorrect.'
      );
      return;
    }

    if (newPinInput.length !== 4 || !/^\d{4}$/.test(newPinInput)) {
      setConfigErrorMsg(
        lang === 'hi' ? 'नया पिन केवल 4 अंकों का होना चाहिए।' : 'New PIN must be exactly 4 digits.'
      );
      return;
    }

    if (newPinInput !== confirmPinInput) {
      setConfigErrorMsg(
        lang === 'hi' ? 'नया पिन और पुष्टि पिन मेल नहीं खाते।' : 'New PIN and Confirm PIN do not match.'
      );
      return;
    }

    storage.setAdminPin(newPinInput);
    setStoredPin(newPinInput);
    setOldPinInput('');
    setNewPinInput('');
    setConfirmPinInput('');
    setConfigSuccessMsg(
      lang === 'hi' ? 'पिन सफलतापूर्वक बदल दिया गया है!' : 'PIN changed successfully!'
    );
  };

  const handleLockAgain = () => {
    setIsUnlocked(false);
    setInputPin('');
  };

  // IF UNLOCKED: Render header lock-bar + Children
  if (isUnlocked) {
    return (
      <div className="space-y-3">
        {/* Unlocked Admin Bar Header */}
        <div className="bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 p-2.5 px-4 rounded-2xl flex items-center justify-between shadow-xs no-print">
          <div className="flex items-center gap-2">
            {isPinEnabled ? (
              <span className="p-1.5 rounded-xl bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              </span>
            ) : (
              <span className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                <Unlock className="w-4 h-4" />
              </span>
            )}
            <div>
              <p className="text-xs font-black text-emerald-900 dark:text-emerald-200 flex items-center gap-1.5">
                <span>{moduleTitle}</span>
                {isPinEnabled && (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-200 dark:bg-emerald-900 text-[10px] text-emerald-900 dark:text-emerald-100 font-extrabold">
                    {lang === 'hi' ? 'पिन सुरक्षित (सत्र अनलॉक)' : 'PIN Protected (Unlocked)'}
                  </span>
                )}
              </p>
              <p className="text-[10px] text-emerald-800/80 dark:text-emerald-300/80">
                {isPinEnabled
                  ? lang === 'hi' ? 'प्रशासनिक डेटा सुरक्षित है। काम पूरा होने पर पुनः लॉक करें।' : 'Administrative data is secure. Re-lock when done.'
                  : lang === 'hi' ? 'पिन सुरक्षा बंद है। सुरक्षा के लिए सेटिंग्स में चालू करें।' : 'PIN lock is disabled. Enable in settings for safety.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsSettingModalOpen(true)}
              className="px-2.5 py-1.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold border border-slate-200 dark:border-slate-700 shadow-2xs flex items-center gap-1.5 transition-all cursor-pointer"
              title="PIN Settings"
            >
              <Settings className="w-3.5 h-3.5 text-slate-600 dark:text-slate-400" />
              <span className="hidden sm:inline">{lang === 'hi' ? 'पिन सेटिंग्स' : 'PIN Settings'}</span>
            </button>

            {isPinEnabled && (
              <button
                onClick={handleLockAgain}
                className="px-3 py-1.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5 text-amber-300" />
                <span>{lang === 'hi' ? 'पुनः लॉक करें' : 'Lock Now'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Protected Administrative Tool Content */}
        <div>{children}</div>

        {/* PIN Settings Modal */}
        {isSettingModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn no-print">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-5 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-200">
                    <KeyRound className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm text-slate-900 dark:text-slate-100">
                      {lang === 'hi' ? 'प्रशासनिक पिन सुरक्षा सेटिंग्स' : 'Admin PIN Security Settings'}
                    </h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      {lang === 'hi' ? 'वेतन व गोपनीय टूल की सुरक्षा प्रबंधित करें' : 'Manage access to salary & confidential tools'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsSettingModalOpen(false)}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  ✕
                </button>
              </div>

              {/* Enable / Disable Toggle Switch */}
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <div>
                  <p className="font-bold text-xs text-slate-800 dark:text-slate-200">
                    {lang === 'hi' ? 'प्रशासनिक पिन-सुरक्षा सक्रिय करें' : 'Enable Administrative PIN Protection'}
                  </p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">
                    {lang === 'hi' ? 'वेतन, एसीपी व गोपनीय रिपोर्ट के लिए 4-अंक पिन मांगेगा' : 'Requires 4-digit PIN for sensitive salary & admin tools'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleTogglePinProtection}
                  className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300 ${
                    isPinEnabled ? 'bg-emerald-600 justify-end' : 'bg-slate-300 dark:bg-slate-700 justify-start'
                  }`}
                >
                  <span className="w-4 h-4 rounded-full bg-white shadow-md transform transition-transform" />
                </button>
              </div>

              {/* Success / Error Messages */}
              {configSuccessMsg && (
                <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 text-emerald-800 dark:text-emerald-200 text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{configSuccessMsg}</span>
                </div>
              )}
              {configErrorMsg && (
                <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 text-rose-800 dark:text-rose-200 text-xs font-bold flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-rose-600" />
                  <span>{configErrorMsg}</span>
                </div>
              )}

              {/* Change PIN Form */}
              <form onSubmit={handleSaveNewPin} className="space-y-3 pt-2">
                <h4 className="font-extrabold text-xs text-slate-700 dark:text-slate-300">
                  {lang === 'hi' ? 'पिन बदलें (Change 4-Digit PIN)' : 'Change 4-Digit Security PIN'}
                </h4>

                {isPinEnabled && (
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                      {lang === 'hi' ? 'वर्तमान पिन (Current PIN)' : 'Current PIN'}
                    </label>
                    <input
                      type="password"
                      maxLength={4}
                      value={oldPinInput}
                      onChange={(e) => setOldPinInput(e.target.value)}
                      placeholder="****"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs font-mono font-bold tracking-widest text-center"
                    />
                  </div>
                )}

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                      {lang === 'hi' ? 'नया पिन (New PIN)' : 'New PIN'}
                    </label>
                    <input
                      type="password"
                      maxLength={4}
                      value={newPinInput}
                      onChange={(e) => setNewPinInput(e.target.value)}
                      placeholder="****"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs font-mono font-bold tracking-widest text-center"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                      {lang === 'hi' ? 'पुष्टि करें (Confirm PIN)' : 'Confirm PIN'}
                    </label>
                    <input
                      type="password"
                      maxLength={4}
                      value={confirmPinInput}
                      onChange={(e) => setConfirmPinInput(e.target.value)}
                      placeholder="****"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs font-mono font-bold tracking-widest text-center"
                    />
                  </div>
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsSettingModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300"
                  >
                    {lang === 'hi' ? 'बंद करें' : 'Close'}
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl text-xs font-extrabold bg-emerald-700 hover:bg-emerald-800 text-white shadow-xs"
                  >
                    {lang === 'hi' ? 'पिन सहेजें' : 'Save PIN'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }

  // IF LOCKED: Render PIN Lock Screen Keypad Overlay
  return (
    <div className="my-4 max-w-md mx-auto p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xl space-y-6 text-center animate-fadeIn no-print">
      {/* Top Shield Icon & Module Title */}
      <div className="space-y-2">
        <div className="w-16 h-16 mx-auto rounded-3xl bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-800/80 flex items-center justify-center text-emerald-800 dark:text-emerald-300 shadow-inner">
          <Lock className="w-8 h-8 text-emerald-700 dark:text-emerald-400" />
        </div>
        <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-slate-100">
          {moduleTitle}
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
          {moduleSubtitle || (lang === 'hi'
            ? 'यह एक सुरक्षित प्रशासनिक मॉड्यूल है। जारी रखने के लिए 4-अंकों का पिन दर्ज करें।'
            : 'This is a protected administrative module. Enter 4-digit PIN to proceed.')}
        </p>
      </div>

      {/* PIN Dots Display */}
      <div className="py-3 flex justify-center items-center gap-3">
        {[0, 1, 2, 3].map((idx) => {
          const isFilled = inputPin.length > idx;
          return (
            <div
              key={idx}
              className={`w-11 h-11 rounded-2xl border-2 flex items-center justify-center transition-all duration-200 ${
                isFilled
                  ? 'border-emerald-600 dark:border-emerald-400 bg-emerald-500 text-white shadow-md scale-105'
                  : 'border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50'
              }`}
            >
              {isFilled ? (
                showPinText ? (
                  <span className="font-mono text-lg font-black text-white">{inputPin[idx]}</span>
                ) : (
                  <div className="w-3 h-3 rounded-full bg-white" />
                )
              ) : (
                <div className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-600" />
              )}
            </div>
          );
        })}
      </div>

      {/* Error Message Alert */}
      {errorMsg && (
        <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/80 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200 text-xs font-bold flex items-center justify-center gap-2 animate-shake">
          <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* On-Screen Keypad Buttons (3x4 Grid) */}
      <div className="max-w-xs mx-auto grid grid-cols-3 gap-2.5 pt-1">
        {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
          <button
            key={digit}
            onClick={() => handleKeyPress(digit)}
            className="py-3 rounded-2xl bg-slate-100 dark:bg-slate-800/80 hover:bg-emerald-700 hover:text-white dark:hover:bg-emerald-600 text-slate-800 dark:text-slate-100 font-mono font-bold text-lg border border-slate-200 dark:border-slate-700/80 shadow-xs transition-all active:scale-95 cursor-pointer"
          >
            {digit}
          </button>
        ))}

        {/* Clear Button */}
        <button
          onClick={handleClear}
          className="py-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 text-rose-700 dark:text-rose-300 font-bold text-xs border border-rose-200 dark:border-rose-800/60 shadow-xs transition-all active:scale-95 cursor-pointer flex items-center justify-center"
        >
          {lang === 'hi' ? 'साफ़' : 'Clear'}
        </button>

        {/* '0' Digit Button */}
        <button
          onClick={() => handleKeyPress('0')}
          className="py-3 rounded-2xl bg-slate-100 dark:bg-slate-800/80 hover:bg-emerald-700 hover:text-white dark:hover:bg-emerald-600 text-slate-800 dark:text-slate-100 font-mono font-bold text-lg border border-slate-200 dark:border-slate-700/80 shadow-xs transition-all active:scale-95 cursor-pointer"
        >
          0
        </button>

        {/* Backspace Button */}
        <button
          onClick={handleBackspace}
          className="py-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 text-amber-800 dark:text-amber-300 font-bold text-xs border border-amber-200 dark:border-amber-800/60 shadow-xs transition-all active:scale-95 cursor-pointer flex items-center justify-center"
        >
          {lang === 'hi' ? 'हटाएं' : 'Back'}
        </button>
      </div>

      {/* Show PIN Toggle & Default PIN Hint */}
      <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
        <button
          onClick={() => setShowPinText(!showPinText)}
          className="flex items-center gap-1 hover:text-slate-800 dark:hover:text-slate-200 font-semibold cursor-pointer"
        >
          {showPinText ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
          <span>{showPinText ? (lang === 'hi' ? 'पिन छुपाएं' : 'Hide PIN') : (lang === 'hi' ? 'पिन दिखाएं' : 'Show PIN')}</span>
        </button>

        <span className="text-[10px] text-slate-400">
          {lang === 'hi' ? 'डिफ़ॉल्ट पिन: 1234' : 'Default PIN: 1234'}
        </span>
      </div>
    </div>
  );
};
