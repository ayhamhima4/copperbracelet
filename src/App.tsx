import { useState } from 'react';
import LanguageSelector from './components/LanguageSelector';
import LandingPage from './components/LandingPage';
import SuccessScreen from './components/SuccessScreen';
import AdminDashboard from './components/AdminDashboard';
import { Order } from './types';

export default function App() {
  const [lang, setLang] = useState<'ar' | 'fr' | null>(null);
  const [activeView, setActiveView] = useState<'store' | 'admin'>('store');
  const [submittedOrder, setSubmittedOrder] = useState<Order | null>(null);

  // Choose language
  const handleSelectLanguage = (selectedLang: 'ar' | 'fr') => {
    setLang(selectedLang);
  };

  // Return to store landing
  const handleBackToStore = () => {
    setSubmittedOrder(null);
    setActiveView('store');
  };

  // If language hasn't been chosen yet, present the gorgeous introductory selection overlay
  if (!lang) {
    return <LanguageSelector onSelectLanguage={handleSelectLanguage} />;
  }

  // If in seller admin panel
  if (activeView === 'admin') {
    return (
      <AdminDashboard 
        lang={lang} 
        onBackToStore={handleBackToStore} 
      />
    );
  }

  // If checkout has completed successfully
  if (submittedOrder) {
    return (
      <SuccessScreen 
        lang={lang} 
        order={submittedOrder} 
        onBackToStore={handleBackToStore} 
      />
    );
  }

  // Default product page view
  return (
    <LandingPage
      lang={lang}
      setLang={setLang}
      onOrderSuccess={(order) => setSubmittedOrder(order)}
      onGoToAdmin={() => setActiveView('admin')}
    />
  );
}
