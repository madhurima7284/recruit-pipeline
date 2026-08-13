import React, { useState, useEffect } from 'react';
import { api } from './services/api';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { DashboardPage } from './pages/DashboardPage';
import { JobsPage } from './pages/JobsPage';
import { CandidatesPage } from './pages/CandidatesPage';
import { CandidateUploadPage } from './pages/CandidateUploadPage';
import { CandidateDetailPage } from './pages/CandidateDetailPage';
import { PipelinePage } from './pages/PipelinePage';
import { AgentHistoryPage } from './pages/AgentHistoryPage';
import { SandboxPage } from './pages/SandboxPage';
import { RepositoryViewPage } from './pages/RepositoryViewPage';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedCandidateId, setSelectedCandidateId] = useState(null);

  // Global Data State
  const [jobs, setJobs] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [applications, setApplications] = useState([]);
  const [agentRuns, setAgentRuns] = useState([]);
  const [emails, setEmails] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      const [jobsData, candidatesData, appsData, runsData, emailsData] = await Promise.all([
        api.getJobs(),
        api.getCandidates(),
        api.getApplications(),
        api.getAgentRuns(),
        api.getEmails()
      ]);

      setJobs(jobsData);
      setCandidates(candidatesData);
      setApplications(appsData);
      setAgentRuns(runsData);
      setEmails(emailsData);
    } catch (err) {
      console.error('Failed to load initial application data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectCandidate = (candId) => {
    setSelectedCandidateId(candId);
    setActiveTab('candidates');
  };

  const handleResetData = async () => {
    setIsLoading(true);
    try {
      await api.seedDatabase();
      await loadAllData();
    } catch (err) {
      console.error('Failed to reset database:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const shortlistedCount = applications.filter(a => a.status === 'SHORTLIST').length;

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex flex-col">
      {/* Top Navbar */}
      <Navbar
        onQuickUploadClick={() => {
          setSelectedCandidateId(null);
          setActiveTab('upload');
        }}
        onViewCodeClick={() => {
          setSelectedCandidateId(null);
          setActiveTab('repo');
        }}
        onResetData={handleResetData}
      />

      {/* Main Layout Body */}
      <div className="flex flex-1">
        {/* Navigation Sidebar */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={tab => {
            setSelectedCandidateId(null);
            setActiveTab(tab);
          }}
          shortlistCount={shortlistedCount}
        />

        {/* Dynamic Page Workspace View */}
        <main className="flex-1 p-6 overflow-y-auto max-w-7xl mx-auto w-full">
          {isLoading ? (
            <div className="flex items-center justify-center h-64 text-xs text-slate-500 font-medium">
              Loading recruitment platform...
            </div>
          ) : selectedCandidateId ? (
            <CandidateDetailPage
              candidateId={selectedCandidateId}
              onBack={() => setSelectedCandidateId(null)}
            />
          ) : (
            <>
              {activeTab === 'dashboard' && (
                <DashboardPage
                  jobs={jobs}
                  applications={applications}
                  agentRuns={agentRuns}
                  onSelectCandidate={handleSelectCandidate}
                  onNavigate={tab => setActiveTab(tab)}
                />
              )}

              {activeTab === 'jobs' && (
                <JobsPage
                  jobs={jobs}
                  onRefreshJobs={loadAllData}
                  onSelectJobForScreening={() => setActiveTab('upload')}
                />
              )}

              {activeTab === 'candidates' && (
                <CandidatesPage
                  candidates={candidates}
                  onSelectCandidate={handleSelectCandidate}
                  onNavigateToUpload={() => setActiveTab('upload')}
                />
              )}

              {activeTab === 'upload' && (
                <CandidateUploadPage
                  jobs={jobs}
                  onUploadSuccess={candId => {
                    loadAllData();
                    handleSelectCandidate(candId);
                  }}
                />
              )}

              {activeTab === 'pipeline' && (
                <PipelinePage
                  applications={applications}
                  onRefreshApplications={loadAllData}
                  onSelectCandidate={handleSelectCandidate}
                />
              )}

              {activeTab === 'agent' && (
                <AgentHistoryPage
                  agentRuns={agentRuns}
                  emails={emails}
                />
              )}

              {activeTab === 'sandbox' && (
                <SandboxPage
                  jobs={jobs}
                  candidates={candidates}
                />
              )}

              {activeTab === 'repo' && <RepositoryViewPage />}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
