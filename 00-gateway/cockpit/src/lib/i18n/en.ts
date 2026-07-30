const en = {
  // Nav
  nav: {
    overview:  'Overview',
    alex:      'ALEX Chat',
    agents:    'Agent Monitor',
    terminal:  'Terminal',
    whatsapp:  'WhatsApp',
    vault:     'Secrets Vault',
    clients:   'Clients',
    settings:  'Settings',
  },
  // Overview
  overview: {
    title:        'Command Center',
    subtitle:     'All systems operational',
    agentsOnline: 'Agents Online',
    messages:     'Messages Today',
    tasks:        'Tasks Running',
    clients:      'Active Clients',
  },
  // ALEX
  alex: {
    title:        'ALEX — Your AI Agent',
    placeholder:  'Ask ALEX anything...',
    thinking:     'ALEX is thinking...',
    online:       'Online & Ready',
    sendBtn:      'Send',
    clearBtn:     'Clear Chat',
    systemPrompt: 'You are ALEX, a world-class AI business agent for Pauli ecosystem. You are bilingual (English & Mexican Spanish), highly capable, direct, and professional. You help manage workflows, code, clients, and communications.',
  },
  // Agents
  agents: {
    title:        'Agent Activity Monitor',
    liveView:     'Live View',
    currentTask:  'Current Task',
    browserUrl:   'Browser',
    filesOpen:    'Open Files',
    tokensUsed:   'Tokens Used',
    noActivity:   'No active agents',
    startAgent:   'Start Agent',
  },
  // Terminal
  terminal: {
    title:        'Terminal',
    connected:    'Connected',
    disconnected: 'Disconnected',
    placeholder:  'Type a command...',
    clear:        'Clear',
    ghosttyNote:  'Powered by Ghostty shell integration',
  },
  // WhatsApp
  whatsapp: {
    title:        'WhatsApp Business',
    search:       'Search contacts...',
    typeMessage:  'Type a message...',
    send:         'Send',
    noChats:      'No conversations yet',
    newChat:      'New Chat',
    connected:    'WhatsApp Connected',
    disconnected: 'Scan QR to connect',
  },
  // Vault
  vault: {
    title:        'Secrets Vault',
    locked:       'Vault Locked',
    unlockBtn:    'Unlock Vault',
    password:     'Master Password',
    addSecret:    'Add Secret',
    copyBtn:      'Copy',
    showBtn:      'Show',
    hideBtn:      'Hide',
    noSecrets:    'No secrets stored',
    categories:   { api: 'API Keys', ssh: 'SSH Keys', db: 'Databases', env: 'Environment', other: 'Other' },
  },
  // Clients
  clients: {
    title:        'Client Management',
    addClient:    'Add Client',
    search:       'Search clients...',
    plan:         'Plan',
    status:       'Status',
    agents:       'Agents',
    noClients:    'No clients yet',
  },
  // Settings
  settings: {
    title:      'Settings',
    language:   'Language',
    theme:      'Theme',
    cloudflare: 'Cloudflare Tunnel',
    github:     'GitHub Integration',
    whatsapp:   'WhatsApp API',
    alex:       'ALEX Configuration',
    save:       'Save Changes',
  },
  // Common
  common: {
    loading: 'Loading...',
    error:   'An error occurred',
    retry:   'Retry',
    cancel:  'Cancel',
    confirm: 'Confirm',
    copy:    'Copy',
    copied:  'Copied!',
    online:  'Online',
    offline: 'Offline',
    busy:    'Busy',
  },
}

export default en
export type TranslationKeys = typeof en
