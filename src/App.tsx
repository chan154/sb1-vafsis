import React, { useState, useMemo } from 'react';
import { Shield } from 'lucide-react';
import { VulnerabilityCard } from './components/VulnerabilityCard';
import { VulnerabilityModal } from './components/VulnerabilityModal';
import { FilterBar } from './components/FilterBar';
import { Statistics } from './components/Statistics';
import type { Vulnerability, FilterState, Statistics as StatsType } from './types';

// Sample data - in a real app, this would come from an API
const initialVulnerabilities: Vulnerability[] = [
  {
    id: '1',
    title: 'Critical SQL Injection in Authentication Endpoint',
    severity: 'Critical',
    status: 'Open',
    description: 'A SQL injection vulnerability was discovered in the main authentication endpoint that could allow unauthorized access to user credentials and sensitive data.',
    affectedSystems: ['auth-service', 'user-api'],
    discoveryDate: '2024-03-10',
    remediation: '1. Implement prepared statements\n2. Add input validation\n3. Update ORM layer\n4. Deploy WAF rules',
    assignedTo: 'Sarah Chen',
    lastUpdated: '2024-03-12',
    cvss: 9.8,
    references: [
      'https://owasp.org/www-community/attacks/SQL_Injection',
      'https://cwe.mitre.org/data/definitions/89.html'
    ],
    timeline: [
      {
        id: '1',
        date: '2024-03-10',
        type: 'status_change',
        description: 'Vulnerability reported and opened',
        user: 'Security Scanner'
      },
      {
        id: '2',
        date: '2024-03-11',
        type: 'assignment',
        description: 'Assigned to Sarah Chen',
        user: 'John Manager'
      }
    ]
  },
  // ... (previous vulnerabilities with added timeline, cvss, and references)
];

function App() {
  const [vulnerabilities, setVulnerabilities] = useState<Vulnerability[]>(initialVulnerabilities);
  const [selectedVulnerability, setSelectedVulnerability] = useState<Vulnerability | null>(null);
  const [filters, setFilters] = useState<FilterState>({
    severity: [],
    status: [],
    searchQuery: '',
  });

  const filteredVulnerabilities = vulnerabilities.filter(vuln => {
    const matchesSeverity = filters.severity.length === 0 || filters.severity.includes(vuln.severity);
    const matchesStatus = filters.status.length === 0 || filters.status.includes(vuln.status);
    const matchesSearch = vuln.title.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
                         vuln.description.toLowerCase().includes(filters.searchQuery.toLowerCase());
    
    return matchesSeverity && matchesStatus && matchesSearch;
  });

  const statistics: StatsType = useMemo(() => {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.setDate(now.getDate() - 30));

    return {
      total: vulnerabilities.length,
      bySeverity: vulnerabilities.reduce((acc, vuln) => {
        acc[vuln.severity] = (acc[vuln.severity] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      byStatus: vulnerabilities.reduce((acc, vuln) => {
        acc[vuln.status] = (acc[vuln.status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      openCritical: vulnerabilities.filter(v => v.severity === 'Critical' && v.status === 'Open').length,
      resolvedLast30Days: vulnerabilities.filter(v => 
        v.status === 'Resolved' && new Date(v.lastUpdated) >= thirtyDaysAgo
      ).length,
    };
  }, [vulnerabilities]);

  const handleStatusChange = (id: string, newStatus: Vulnerability['status']) => {
    setVulnerabilities(vulns => vulns.map(vuln => {
      if (vuln.id === id) {
        const now = new Date().toISOString();
        return {
          ...vuln,
          status: newStatus,
          lastUpdated: now,
          timeline: [
            ...vuln.timeline,
            {
              id: Date.now().toString(),
              date: now,
              type: 'status_change',
              description: `Status changed to ${newStatus}`,
              user: 'Current User'
            }
          ]
        };
      }
      return vuln;
    }));
  };

  const handleAddComment = (id: string, comment: string) => {
    setVulnerabilities(vulns => vulns.map(vuln => {
      if (vuln.id === id) {
        const now = new Date().toISOString();
        return {
          ...vuln,
          lastUpdated: now,
          timeline: [
            ...vuln.timeline,
            {
              id: Date.now().toString(),
              date: now,
              type: 'comment',
              description: comment,
              user: 'Current User'
            }
          ]
        };
      }
      return vuln;
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-3">
            <Shield size={32} className="text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">Vulnerability Manager</h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Statistics stats={statistics} />
        <FilterBar filters={filters} onFilterChange={setFilters} />
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredVulnerabilities.map(vulnerability => (
            <VulnerabilityCard
              key={vulnerability.id}
              vulnerability={vulnerability}
              onClick={setSelectedVulnerability}
            />
          ))}
        </div>

        {filteredVulnerabilities.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No vulnerabilities match your filters</p>
          </div>
        )}
      </main>

      {selectedVulnerability && (
        <VulnerabilityModal
          vulnerability={selectedVulnerability}
          onClose={() => setSelectedVulnerability(null)}
          onStatusChange={handleStatusChange}
          onAddComment={handleAddComment}
        />
      )}
    </div>
  );
}

export default App;