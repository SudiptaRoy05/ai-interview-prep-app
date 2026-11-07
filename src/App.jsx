import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import LanguageSelector from './components/LanguageSelector';
import InterviewQuestions from './components/InterviewQuestions';
import ExamView from './components/ExamView';
import ExamResults from './components/ExamResults';
import ApiKeyModal from './components/ApiKeyModal';
import Footer from './components/Footer';
import { 
  generate50InterviewQuestions, 
  generateExamFrom50Questions, 
  getStoredApiKey 
} from './services/aiGenerator';
import { Sparkles, Loader2 } from 'lucide-react';

export default function App() {
  // Navigation Steps: 'languages' | 'questions' | 'exam' | 'results'
  const [currentStep, setCurrentStep] = useState('languages');
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  
  // 50 Interview Questions State
  const [questions50, setQuestions50] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStatus, setGenerationStatus] = useState('');

  // 20-Question Exam State
  const [examQuestions, setExamQuestions] = useState([]);
  const [examResultsData, setExamResultsData] = useState(null);

  // API Modal State
  const [isApiModalOpen, setIsApiModalOpen] = useState(false);
  const [apiKeySet, setApiKeySet] = useState(false);

  // Check API key presence
  useEffect(() => {
    setApiKeySet(Boolean(getStoredApiKey()));
  }, []);

  // Handler: When user selects a programming language
  const handleSelectLanguage = async (language) => {
    setSelectedLanguage(language);
    setIsGenerating(true);
    setGenerationStatus(`Connecting to AI Engine for ${language.name}...`);

    try {
      const generated = await generate50InterviewQuestions(
        language.id, 
        language.name, 
        (status) => setGenerationStatus(status)
      );

      setQuestions50(generated);
      setCurrentStep('questions');
    } catch (err) {
      console.error('Error generating questions:', err);
      alert('Could not synthesize questions. Please try again.');
    } finally {
      setIsGenerating(false);
      setGenerationStatus('');
    }
  };

  // Handler: When user clicks "Done" on the 50 questions page
  const handleProceedToExam = (currentQuestions) => {
    // Generate 20 questions derived from the 50 questions
    const qList = currentQuestions && currentQuestions.length > 0 ? currentQuestions : questions50;
    const exam20 = generateExamFrom50Questions(qList, 20);
    setExamQuestions(exam20);
    setCurrentStep('exam');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handler: When user submits the 20-question exam
  const handleSubmitExam = (resultsPayload) => {
    setExamResultsData(resultsPayload);
    setCurrentStep('results');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handler: Retake exam (draws another 20 questions from the 50)
  const handleRetakeExam = () => {
    const exam20 = generateExamFrom50Questions(questions50, 20);
    setExamQuestions(exam20);
    setCurrentStep('exam');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handler: Return to 50 questions review
  const handleReview50Questions = () => {
    setCurrentStep('questions');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handler: Switch language / Return to home
  const handleSwitchLanguage = () => {
    setCurrentStep('languages');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      
      {/* Top Navigation */}
      <Navbar
        currentStep={currentStep}
        setStep={(step) => {
          if (step === 'languages') handleSwitchLanguage();
          else if (step === 'questions' && selectedLanguage) handleReview50Questions();
          else if (step === 'exam' && examQuestions.length > 0) setCurrentStep('exam');
          else if (step === 'results' && examResultsData) setCurrentStep('results');
        }}
        selectedLanguage={selectedLanguage}
        onOpenApiModal={() => setIsApiModalOpen(true)}
        apiKeySet={apiKeySet}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {currentStep === 'languages' && (
          <LanguageSelector
            onSelectLanguage={handleSelectLanguage}
            isGenerating={isGenerating}
          />
        )}

        {currentStep === 'questions' && selectedLanguage && (
          <InterviewQuestions
            language={selectedLanguage}
            questions={questions50}
            onBack={handleSwitchLanguage}
            onProceedToExam={handleProceedToExam}
            isGenerating={isGenerating}
          />
        )}

        {currentStep === 'exam' && selectedLanguage && (
          <ExamView
            language={selectedLanguage}
            examQuestions={examQuestions}
            onSubmitExam={handleSubmitExam}
            onCancelExam={handleReview50Questions}
          />
        )}

        {currentStep === 'results' && selectedLanguage && examResultsData && (
          <ExamResults
            language={selectedLanguage}
            examData={examResultsData}
            onRetakeExam={handleRetakeExam}
            onReview50Questions={handleReview50Questions}
            onSwitchLanguage={handleSwitchLanguage}
          />
        )}
      </main>

      {/* AI Generation Loading Overlay */}
      {isGenerating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl max-w-sm w-full text-center shadow-2xl space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mx-auto">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>
            <div>
              <h3 className="font-extrabold text-white text-lg">AI Generating Interview Set</h3>
              <p className="text-xs text-indigo-300 font-mono mt-1">{generationStatus}</p>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-indigo-500 to-pink-500 w-3/4 animate-pulse rounded-full" />
            </div>
            <p className="text-[11px] text-slate-500">Creating 50 technical questions, code scenarios & exam items...</p>
          </div>
        </div>
      )}

      {/* API Key Modal */}
      <ApiKeyModal
        isOpen={isApiModalOpen}
        onClose={() => setIsApiModalOpen(false)}
        onKeySaved={(k) => setApiKeySet(Boolean(k))}
      />

      {/* Footer */}
      <Footer />

    </div>
  );
}
