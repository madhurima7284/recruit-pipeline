export const api = {
  // Health
  async checkHealth() {
    const res = await fetch('/api/health');
    return res.json();
  },

  // Jobs
  async getJobs() {
    const res = await fetch('/api/jobs');
    if (!res.ok) throw new Error('Failed to fetch jobs');
    return res.json();
  },

  async getJob(id) {
    const res = await fetch(`/api/jobs/${id}`);
    if (!res.ok) throw new Error('Failed to fetch job');
    return res.json();
  },

  async createJob(jobData) {
    const res = await fetch('/api/jobs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(jobData)
    });
    if (!res.ok) throw new Error('Failed to create job');
    return res.json();
  },

  async autoParseJobText(rawText) {
    const res = await fetch('/api/jobs/parse-text', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rawText })
    });
    if (!res.ok) throw new Error('Failed to parse job description');
    return res.json();
  },

  // Candidates
  async getCandidates() {
    const res = await fetch('/api/candidates');
    if (!res.ok) throw new Error('Failed to fetch candidates');
    return res.json();
  },

  async getCandidate(id) {
    const res = await fetch(`/api/candidates/${id}`);
    if (!res.ok) throw new Error('Failed to fetch candidate');
    return res.json();
  },

  async uploadCandidate(formData) {
    const res = await fetch('/api/candidates/upload', {
      method: 'POST',
      body: formData
    });
    if (!res.ok) throw new Error('Failed to upload candidate');
    return res.json();
  },

  // Applications & Screening
  async getApplications() {
    const res = await fetch('/api/applications');
    if (!res.ok) throw new Error('Failed to fetch applications');
    return res.json();
  },

  async updateApplicationStatus(id, status, note) {
    const res = await fetch(`/api/applications/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, note })
    });
    if (!res.ok) throw new Error('Failed to update application status');
    return res.json();
  },

  async runScreening(candidateId, jobId) {
    const res = await fetch('/api/screening/run', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ candidateId, jobId })
    });
    if (!res.ok) throw new Error('Failed to run screening');
    return res.json();
  },

  // Agent Runs & Logs
  async getAgentRuns() {
    const res = await fetch('/api/agent/runs');
    if (!res.ok) throw new Error('Failed to fetch agent runs');
    return res.json();
  },

  async getEmails() {
    const res = await fetch('/api/emails');
    if (!res.ok) throw new Error('Failed to fetch emails');
    return res.json();
  },

  async getInterviews() {
    const res = await fetch('/api/interviews');
    if (!res.ok) throw new Error('Failed to fetch interviews');
    return res.json();
  },

  async createInterview(interviewData) {
    const res = await fetch('/api/interviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(interviewData)
    });
    if (!res.ok) throw new Error('Failed to create interview');
    return res.json();
  },

  async updateInterview(id, updateData) {
    const res = await fetch(`/api/interviews/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updateData)
    });
    if (!res.ok) throw new Error('Failed to update interview');
    return res.json();
  },

  async sendEmail(emailData) {
    const res = await fetch('/api/emails/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(emailData)
    });
    if (!res.ok) throw new Error('Failed to send email');
    return res.json();
  },

  // Database Management
  async clearDatabase() {
    const res = await fetch('/api/admin/clear', { method: 'POST' });
    if (!res.ok) throw new Error('Failed to clear database');
  },

  async seedDatabase() {
    const res = await fetch('/api/admin/seed', { method: 'POST' });
    if (!res.ok) throw new Error('Failed to seed database');
  }
};
