import React, { useState } from 'react';
import { X, Send, MessageSquare, CheckCircle } from 'lucide-react';
import { Language } from '../types';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({ isOpen, onClose, lang }) => {
  const [feedback, setFeedback] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFeedback('');
      onClose();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-2 sm:p-4 overflow-y-auto bg-black/60 backdrop-blur-sm animate-fadeIn pt-10 sm:pt-16">
      <div className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 rounded-2xl max-w-md w-full p-4 shadow-2xl border border-emerald-500/20 space-y-3 my-4">
        
        <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center space-x-2">
            <MessageSquare className="w-5 h-5 text-emerald-600" />
            <h3 className="font-bold text-sm">
              {lang === 'hi' ? 'प्रतिक्रिया व सुझाव (Feedback)' : 'Share Feedback'}
            </h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="py-6 text-center space-y-2">
            <CheckCircle className="w-10 h-10 text-emerald-600 mx-auto" />
            <h4 className="font-bold text-sm text-emerald-800 dark:text-emerald-300">
              {lang === 'hi' ? 'धन्यवाद! आपकी प्रतिक्रिया दर्ज कर ली गई है।' : 'Thank you for your valuable feedback!'}
            </h4>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3 text-xs">
            <p className="text-slate-600 dark:text-slate-400">
              {lang === 'hi'
                ? 'राजस्थान शिक्षा विभाग के साथियों हेतु शाला सहायक को बेहतर बनाने में मदद करें।'
                : 'Help us improve Shala Sahayak for Rajasthan Education Department personnel.'}
            </p>

            <textarea
              required
              rows={4}
              value={feedback}
              onChange={e => setFeedback(e.target.value)}
              placeholder={lang === 'hi' ? 'अपनी राय या नई आवश्यकता यहाँ लिखें...' : 'Write your suggestion or tool request here...'}
              className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-emerald-500 outline-none"
            />

            <div className="flex justify-end space-x-2 pt-1">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-800 font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold flex items-center space-x-1"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit</span>
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
