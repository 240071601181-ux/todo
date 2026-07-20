import { Task, Project, UserProfile, CalendarEvent, AppSettings } from './types';

export const INITIAL_USER: UserProfile = {
  name: "Alex Carter",
  email: "alex.carter@nexus.io",
  role: "Lead Systems Architect",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120&h=120",
  streakDays: 14,
  productivityScore: 840,
  weeklyTaskCount: [5, 8, 12, 7, 14, 9, 4], // Mon-Sun
  productivityTrend: 0,
  level: 12,
  xp: 3450,
  nextLevelXp: 5000
};

export const INITIAL_SETTINGS: AppSettings = {
  theme: 'obsidian',
  accentColor: 'blue',
  glassmorphism: true,
  density: 'standard',
  soundEffects: true,
  smartTransitions: true
};

export const INITIAL_PROJECTS: Project[] = [
  {
    id: "proj-1",
    name: "Alpha Nexus Core",
    description: "Multi-modal neural core pipeline orchestration engine for microservice scheduling.",
    color: "#3b82f6", // Blue
    progress: 74,
    status: 'active',
    dueDate: "2026-08-15",
    category: "AI & Infrastructure",
    stakeholders: [
      { name: "Elena Rostova", role: "Product Manager", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=80&h=80" },
      { name: "Marcus Chen", role: "SRE Lead", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=80&h=80" },
      { name: "Sarah Jenkins", role: "QA Engineer", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=80&h=80" }
    ],
    pulseFeed: [
      { id: "feed-1", user: "Marcus Chen", action: "pushed a commit to", target: "main: core-scheduler-v2", time: "10m ago" },
      { id: "feed-2", user: "Elena Rostova", action: "approved milestone", target: "Phase 3 API Specs", time: "2h ago" },
      { id: "feed-3", user: "Sarah Jenkins", action: "reported a bug on", target: "gRPC payload limit", time: "5h ago" }
    ]
  },
  {
    id: "proj-2",
    name: "Velocity UI Kit",
    description: "High-performance GPU-accelerated design tokens and component kit for fast dark mode web apps.",
    color: "#a855f7", // Purple
    progress: 42,
    status: 'active',
    dueDate: "2026-09-01",
    category: "Design System",
    stakeholders: [
      { name: "David Kim", role: "UI Designer", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=80&h=80" },
      { name: "Alex Carter", role: "Architect", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120&h=120" }
    ],
    pulseFeed: [
      { id: "feed-4", user: "David Kim", action: "uploaded mockups for", target: "Focus State v2", time: "Yesterday" },
      { id: "feed-5", user: "Alex Carter", action: "merged branch", target: "feature/framer-motion-react-19", time: "2 days ago" }
    ]
  },
  {
    id: "proj-3",
    name: "Quantum Ops",
    description: "Zero-trust Kubernetes pipeline with real-time anomaly isolation.",
    color: "#10b981", // Emerald
    progress: 92,
    status: 'review',
    dueDate: "2026-07-28",
    category: "DevOps",
    stakeholders: [
      { name: "Marcus Chen", role: "SRE Lead", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=80&h=80" },
      { name: "Sarah Jenkins", role: "QA Engineer", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=80&h=80" }
    ],
    pulseFeed: [
      { id: "feed-6", user: "Sarah Jenkins", action: "started final validation of", target: "Vault integration", time: "3h ago" }
    ]
  },
  {
    id: "proj-4",
    name: "Solaris Redact Engine",
    description: "Real-time AI-powered PII detection and military-grade redaction on streams.",
    color: "#f59e0b", // Amber
    progress: 15,
    status: 'planning',
    dueDate: "2026-11-30",
    category: "Security",
    stakeholders: [
      { name: "Elena Rostova", role: "Product Manager", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=80&h=80" },
      { name: "David Kim", role: "UI Designer", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=80&h=80" }
    ],
    pulseFeed: [
      { id: "feed-7", user: "Elena Rostova", action: "created security requirements for", target: "HIPAA conformity", time: "1 day ago" }
    ]
  }
];

export const INITIAL_TASKS: Task[] = [
  {
    id: "task-1",
    title: "Configure multi-region Redis cluster fallback",
    description: "Write custom Failover scripts for high availability clusters in us-east-1 and eu-west-1. Guarantee no state loss for in-flight tasks.",
    status: "in_progress",
    priority: "urgent",
    dueDate: "2026-07-24",
    assignee: {
      name: "Marcus Chen",
      role: "SRE Lead",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=80&h=80"
    },
    projectId: "proj-1",
    projectName: "Alpha Nexus Core",
    storyPoints: 8,
    tags: ["Infra", "Redis", "Highly-Available"],
    milestones: [
      { id: "m1-1", title: "Write replication scripts", completed: true },
      { id: "m1-2", title: "Simulate master node loss", completed: false },
      { id: "m1-3", title: "Validate cluster quorum", completed: false }
    ],
    comments: [
      {
        id: "c1-1",
        author: { name: "Elena Rostova", role: "Product Manager", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=80&h=80" },
        content: "Please ensure we coordinate downtime simulations outside peak client usage hours.",
        createdAt: "3 hours ago"
      }
    ]
  },
  {
    id: "task-2",
    title: "Implement AI PII obfuscation pipeline",
    description: "Develop server-side tokenization and transformer-driven regex sanitization stream. Needs to support 15,000 JSON payloads per second at sub-20ms latencies.",
    status: "todo",
    priority: "high",
    dueDate: "2026-07-30",
    assignee: {
      name: "Alex Carter",
      role: "Lead Architect",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120&h=120"
    },
    projectId: "proj-4",
    projectName: "Solaris Redact Engine",
    storyPoints: 13,
    tags: ["AI Model", "PII", "High-Throughput"],
    milestones: [
      { id: "m2-1", title: "Select lightweight transformer model", completed: true },
      { id: "m2-2", title: "Assemble fallback pattern regex", completed: true },
      { id: "m2-3", title: "Implement fast token bypass logic", completed: false },
      { id: "m2-4", title: "Run high-concurrency memory profile", completed: false }
    ],
    comments: [
      {
        id: "c2-1",
        author: { name: "Elena Rostova", role: "Product Manager", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=80&h=80" },
        content: "This is critical for our upcoming HIPAA compliance audit next month. Sub-20ms latency is non-negotiable for real-time telemetry filters.",
        createdAt: "Yesterday"
      },
      {
        id: "c2-2",
        author: { name: "Alex Carter", role: "Lead Architect", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120&h=120" },
        content: "Agreed. I'm leveraging local WebAssembly bindings for the model runtime to completely avoid any network hops. Initial local bench tests are around 12ms.",
        createdAt: "10 hours ago"
      }
    ]
  },
  {
    id: "task-3",
    title: "Rewrite Glassmorphism Backdrop Filter Engine",
    description: "Refactor standard backdrop-filter blur classes with custom WebGL fallback layers to prevent performance stutters on Chromium mobile devices.",
    status: "in_progress",
    priority: "medium",
    dueDate: "2026-07-26",
    assignee: {
      name: "David Kim",
      role: "UI Designer",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=80&h=80"
    },
    projectId: "proj-2",
    projectName: "Velocity UI Kit",
    storyPoints: 5,
    tags: ["UI/UX", "WebGL", "Performance"],
    milestones: [
      { id: "m3-1", title: "Audit rendering lag triggers", completed: true },
      { id: "m3-2", title: "Write WebGL custom shader template", completed: false }
    ],
    comments: []
  },
  {
    id: "task-4",
    title: "Perform zero-trust pen test on Kubernetes pods",
    description: "Execute lateral network movement tests and validate vault secrets segregation. Ensure pods have strict namespace policies enforced.",
    status: "done",
    priority: "high",
    dueDate: "2026-07-18",
    assignee: {
      name: "Marcus Chen",
      role: "SRE Lead",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=80&h=80"
    },
    projectId: "proj-3",
    projectName: "Quantum Ops",
    storyPoints: 5,
    tags: ["Security", "Kubernetes", "Auditing"],
    milestones: [
      { id: "m4-1", title: "Map out inter-pod pathways", completed: true },
      { id: "m4-2", title: "Run vulnerability port scanner", completed: true },
      { id: "m4-3", title: "Apply NetworkPolicy restriction manifests", completed: true }
    ],
    comments: [
      {
        id: "c4-1",
        author: { name: "Sarah Jenkins", role: "QA Engineer", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=80&h=80" },
        content: "Passed all automated pipeline checks cleanly. Ready for production release.",
        createdAt: "2 days ago"
      }
    ]
  },
  {
    id: "task-5",
    title: "Draft Phase 4 GraphQL Endpoint schemas",
    description: "Write detailed schema files for federated Graph nodes. Define custom resolvers and data loader configurations to avoid N+1 DB query issues.",
    status: "todo",
    priority: "medium",
    dueDate: "2026-08-05",
    assignee: {
      name: "Alex Carter",
      role: "Lead Architect",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120&h=120"
    },
    projectId: "proj-1",
    projectName: "Alpha Nexus Core",
    storyPoints: 3,
    tags: ["GraphQL", "Schema Design", "Database"],
    milestones: [
      { id: "m5-1", title: "Draft entity relationship mappings", completed: false },
      { id: "m5-2", title: "Write batch resolvers", completed: false }
    ],
    comments: []
  },
  {
    id: "task-6",
    title: "Optimize SVG path draw times inside dashboard",
    description: "Reduce SVG DOM clutter by combining nested vector groups and utilizing canvas rendering for heavy data series visualizations.",
    status: "done",
    priority: "low",
    dueDate: "2026-07-15",
    assignee: {
      name: "David Kim",
      role: "UI Designer",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=80&h=80"
    },
    projectId: "proj-2",
    projectName: "Velocity UI Kit",
    storyPoints: 2,
    tags: ["Design Optimization", "SVG", "Vector Graphics"],
    milestones: [
      { id: "m6-1", title: "Benchmark SVG vs HTML5 Canvas draw metrics", completed: true },
      { id: "m6-2", title: "Refactor main charts to Canvas engine", completed: true }
    ],
    comments: []
  },
  {
    id: "task-7",
    title: "Audit KMS key rotations for AWS Secrets manager",
    description: "Verify automated 90-day rotation compliance across staging, testing and production regions. Update access IAM policies.",
    status: "in_progress",
    priority: "high",
    dueDate: "2026-07-25",
    assignee: {
      name: "Marcus Chen",
      role: "SRE Lead",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=80&h=80"
    },
    projectId: "proj-3",
    projectName: "Quantum Ops",
    storyPoints: 5,
    tags: ["Security", "AWS", "Compliance"],
    milestones: [
      { id: "m7-1", title: "Audit logs analysis", completed: true },
      { id: "m7-2", title: "Update KMS IAM profiles", completed: false }
    ],
    comments: []
  }
];

export const INITIAL_CALENDAR_EVENTS: CalendarEvent[] = [
  {
    id: "evt-1",
    title: "Daily Sync & Core Standup",
    date: "2026-07-20",
    time: "09:30",
    duration: "30m",
    type: "meeting",
    color: "#3b82f6"
  },
  {
    id: "evt-2",
    title: "Solaris Design Sprint Sync",
    date: "2026-07-20",
    time: "14:00",
    duration: "1h",
    type: "meeting",
    color: "#f59e0b"
  },
  {
    id: "evt-3",
    title: "Deep Focus: PII Model Setup",
    date: "2026-07-20",
    time: "15:30",
    duration: "2h",
    type: "focus",
    color: "#a855f7"
  },
  {
    id: "evt-4",
    title: "Alpha Nexus Architecture Review",
    date: "2026-07-21",
    time: "11:00",
    duration: "1h 30m",
    type: "meeting",
    color: "#3b82f6"
  },
  {
    id: "evt-5",
    title: "Milestone: AWS Secret Audit Deadline",
    date: "2026-07-25",
    time: "17:00",
    type: "milestone",
    color: "#10b981"
  },
  {
    id: "evt-6",
    title: "Sprint Planning Session",
    date: "2026-07-24",
    time: "10:00",
    duration: "1h",
    type: "meeting",
    color: "#a855f7"
  }
];
