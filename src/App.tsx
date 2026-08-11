import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { ChatAdvisor } from './components/ChatAdvisor';
import { DiagnosticWizard } from './components/DiagnosticWizard';
import { ProductCatalog } from './components/ProductCatalog';
import { DosageCalculator } from './components/DosageCalculator';
import { DailyChatHistory } from './components/DailyChatHistory';
import { SpecialistValidationModal } from './components/SpecialistValidationModal';
import { AdminProductModal } from './components/AdminProductModal';
import { Footer } from './components/Footer';
import { getActiveSpecialist, getDailyChatLogs } from './data/specialistAndHistoryStore';
import { AuthorizedSpecialist, DailyChatLog } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<'chat' | 'diagnostic' | 'catalog' | 'calculator' | 'history'>('chat');
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [isSpecialistModalOpen, setIsSpecialistModalOpen] = useState(false);

  const [activeSpecialist, setActiveSpecialist] = useState<AuthorizedSpecialist>(() => getActiveSpecialist());
  const [chatLogs, setChatLogs] = useState<DailyChatLog[]>(() => getDailyChatLogs());

  // Refresh specialist and chat logs when modal closes or tabs change
  const handleSpecialistValidated = (specialist: AuthorizedSpecialist) => {
    setActiveSpecialist(specialist);
  };

  const refreshHistory = () => {
    setChatLogs(getDailyChatLogs());
  };

  useEffect(() => {
    refreshHistory();
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-900 flex flex-col justify-between">
      {/* Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAdminModal={() => setIsAdminModalOpen(true)}
        onOpenSpecialistModal={() => setIsSpecialistModalOpen(true)}
        activeSpecialist={activeSpecialist}
      />

      {/* Main Tab Views */}
      <main className="flex-1">
        {activeTab === 'chat' && (
          <ChatAdvisor initialMode="agricola" />
        )}

        {activeTab === 'diagnostic' && (
          <DiagnosticWizard />
        )}

        {activeTab === 'catalog' && (
          <ProductCatalog
            onOpenAdminModal={() => setIsAdminModalOpen(true)}
          />
        )}

        {activeTab === 'calculator' && (
          <DosageCalculator />
        )}

        {activeTab === 'history' && (
          <DailyChatHistory
            logs={chatLogs}
            onSelectLog={(log) => {
              setActiveTab('chat');
            }}
          />
        )}
      </main>

      {/* Specialist Validation Modal */}
      <SpecialistValidationModal
        isOpen={isSpecialistModalOpen}
        onClose={() => {
          setIsSpecialistModalOpen(false);
          setActiveSpecialist(getActiveSpecialist());
        }}
        onSpecialistValidated={handleSpecialistValidated}
      />

      {/* Admin Management Modal */}
      <AdminProductModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
      />

      {/* Footer */}
      <Footer />
    </div>
  );
}
