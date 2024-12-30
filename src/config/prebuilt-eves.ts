import { PrebuiltEVE } from '../types/prebuilt-eves';

export const PREBUILT_EVES: PrebuiltEVE[] = [
  {
    id: 'atlas',
    name: 'Atlas',
    role: 'Chief EVE™ Orchestrator',
    category: 'strategy',
    description: 'Orchestrates all EVE™ operations and ensures alignment with company goals',
    capabilities: [
      'EVE™ Creation & Management',
      'Resource Optimization',
      'Strategic Planning',
      'Performance Monitoring',
      'Task Orchestration',
      'Cross-EVE™ Coordination',
      'Company Alignment',
      'Risk Assessment'
    ],
    required_integrations: [
      {
        type: 'slack',
        name: 'Team Communication',
        description: 'Connect team communication platform',
        required: false,
        config_schema: {
          workspace_id: 'string',
          bot_token: 'string'
        }
      }
    ],
    models: [
      {
        provider: 'openai',
        model: 'gpt-4-turbo',
        purpose: 'Strategic decision making'
      },
      {
        provider: 'anthropic',
        model: 'claude-3-opus',
        purpose: 'Complex analysis and planning'
      }
    ],
    min_subscription_tier: 'starter'
  },
  {
    id: 'echo',
    name: 'Echo',
    role: 'Communication Director EVE™',
    category: 'communication',
    description: 'Automates customer service across multiple channels while maintaining consistent brand voice',
    capabilities: [
      'Multi-channel customer support',
      'Automated ticket management',
      'Brand voice consistency',
      'Response templating',
      'Sentiment analysis',
      'Escalation management'
    ],
    required_integrations: [
      {
        type: 'email',
        name: 'Email Integration',
        description: 'Connect your support email accounts',
        required: true,
        config_schema: {
          smtp_server: 'string',
          email_address: 'string',
          password: 'string'
        }
      },
      {
        type: 'whatsapp',
        name: 'WhatsApp Business',
        description: 'Connect WhatsApp Business account',
        required: false,
        config_schema: {
          api_key: 'string',
          phone_number: 'string'
        }
      }
    ],
    models: [
      {
        provider: 'openai',
        model: 'gpt-4-turbo',
        purpose: 'Customer interaction'
      },
      {
        provider: 'anthropic',
        model: 'claude-3-opus',
        purpose: 'Complex issue resolution'
      }
    ],
    min_subscription_tier: 'starter'
  },
  {
    id: 'nova-procurement',
    name: 'Nova',
    role: 'Strategic Director EVE™',
    category: 'strategy',
    description: 'Manages strategic initiatives and procurement processes',
    capabilities: [
      'Procurement request management',
      'Policy compliance checking',
      'Vendor evaluation',
      'Budget alignment',
      'Incentive program management',
      'Performance tracking'
    ],
    required_integrations: [
      {
        type: 'slack',
        name: 'Slack',
        description: 'Team communication integration',
        required: false,
        config_schema: {
          workspace_id: 'string',
          bot_token: 'string'
        }
      }
    ],
    models: [
      {
        provider: 'openai',
        model: 'gpt-4-turbo',
        purpose: 'Strategic analysis'
      }
    ],
    min_subscription_tier: 'growth'
  },
  {
    id: 'sentinel-social',
    name: 'Sentinel',
    role: 'Social Media Director EVE™',
    category: 'social',
    description: 'Monitors and analyzes social media presence and market intelligence',
    capabilities: [
      'Social media monitoring',
      'Sentiment analysis',
      'Competitor tracking',
      'Trend analysis',
      'Campaign performance tracking',
      'Crisis detection'
    ],
    required_integrations: [
      {
        type: 'social_media',
        name: 'Social Media APIs',
        description: 'Connect social media accounts',
        required: true,
        config_schema: {
          platforms: 'array',
          api_keys: 'object'
        }
      },
      {
        type: 'analytics',
        name: 'Analytics Platform',
        description: 'Connect analytics tools',
        required: false,
        config_schema: {
          platform: 'string',
          api_key: 'string'
        }
      }
    ],
    models: [
      {
        provider: 'anthropic',
        model: 'claude-3-opus',
        purpose: 'Sentiment analysis'
      }
    ],
    min_subscription_tier: 'growth'
  },
  {
    id: 'orion-finance',
    name: 'Orion',
    role: 'Finance Guardian EVE™',
    category: 'finance',
    description: 'Manages financial operations and compliance',
    capabilities: [
      'Budget tracking',
      'Invoice automation',
      'Financial reporting',
      'Compliance checking',
      'Data reconciliation',
      'Expense management'
    ],
    required_integrations: [
      {
        type: 'accounting',
        name: 'Accounting Software',
        description: 'Connect accounting system',
        required: true,
        config_schema: {
          software_type: 'string',
          api_key: 'string',
          organization_id: 'string'
        }
      }
    ],
    models: [
      {
        provider: 'openai',
        model: 'gpt-4-turbo',
        purpose: 'Financial analysis'
      },
      {
        provider: 'anthropic',
        model: 'claude-3-opus',
        purpose: 'Compliance checking'
      }
    ],
    min_subscription_tier: 'enterprise'
  }
];