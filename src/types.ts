export interface Vulnerability {
  id: string;
  title: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low' | 'Info';
  status: 'Open' | 'In Progress' | 'Resolved' | 'Closed';
  description: string;
  affectedSystems: string[];
  affectedProducts: Product[];
  discoveryDate: string;
  remediation?: string;
  assignedTo?: string;
  assignedTeam?: Team;
  lastUpdated: string;
  timeline: TimelineEvent[];
  cvss?: number;
  references?: string[];
  externalIds?: ExternalReference[];
  tasks: Task[];
}

export interface Product {
  id: string;
  name: string;
  version: string;
  category: string;
  description: string;
  team: Team;
  vulnerabilities: string[]; // IDs of vulnerabilities
}

export interface Team {
  id: string;
  name: string;
  type: 'Security' | 'Development' | 'QA' | 'Operations';
  members: User[];
  products: string[]; // IDs of products
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'Engineer' | 'Analyst' | 'Manager' | 'Admin';
  team: string; // Team ID
  assignedTasks: string[]; // Task IDs
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'Todo' | 'In Progress' | 'Review' | 'Done';
  priority: 'High' | 'Medium' | 'Low';
  assignedTo: string; // User ID
  dueDate: string;
  createdAt: string;
  updatedAt: string;
  comments: Comment[];
}

export interface Comment {
  id: string;
  content: string;
  userId: string;
  createdAt: string;
  attachments?: string[];
}

export interface TimelineEvent {
  id: string;
  date: string;
  type: 'status_change' | 'comment' | 'assignment' | 'update' | 'task_created' | 'task_updated';
  description: string;
  user: string;
  metadata?: Record<string, any>;
}

export interface FilterState {
  severity: string[];
  status: string[];
  searchQuery: string;
  dateRange?: DateRange;
  assignee?: string;
  product?: string;
  team?: string;
}

export interface DateRange {
  start: string;
  end: string;
}

export interface Statistics {
  total: number;
  bySeverity: Record<string, number>;
  byStatus: Record<string, number>;
  byProduct: Record<string, number>;
  byTeam: Record<string, number>;
  openCritical: number;
  resolvedLast30Days: number;
}

export interface ExternalReference {
  source: 'CVE' | 'NVD' | 'MITRE' | 'OWASP';
  id: string;
  url: string;
  description?: string;
}