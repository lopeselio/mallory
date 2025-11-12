import { ComponentDefinition } from './ComponentRegistry';

// Import dynamic components (LLM-controlled only)
// Only components from the ui/ directory should be in the registry
import { InlineCitationWrapper } from '../ui/InlineCitationWrapper';
import { AlphaStreamCard } from '../ui/AlphaStreamCard';

/**
 * Dynamic component definitions
 * These components are rendered based on LLM responses
 * 
 * IMPORTANT: Only components from the ui/ directory should be defined here.
 * These are dynamic components that the LLM can choose to render when necessary.
 * 
 * Components from other directories (like chat/) should be imported and used
 * directly in their respective contexts, not through the registry system.
 */
export const dynamicComponents: ComponentDefinition[] = [
  {
    name: 'InlineCitation',
    component: InlineCitationWrapper,
    category: 'dynamic',
    description: 'Displays inline citations for AI-generated content with sources. Shows a citation badge that opens a modal with source details.',
    propsSchema: {
      type: 'object',
      properties: {
        text: { 
          type: 'string', 
          description: 'The text content that has citations' 
        },
        sources: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              title: { 
                type: 'string', 
                description: 'Source title' 
              },
              url: { 
                type: 'string', 
                description: 'Source URL (required)' 
              },
              description: { 
                type: 'string', 
                description: 'Brief description of the source' 
              },
              quote: { 
                type: 'string', 
                description: 'Relevant excerpt or quote from the source' 
              }
            },
            required: ['url']
          },
          description: 'Array of source citations. At least one source with a URL is required.'
        }
      },
      required: ['text', 'sources']
    },
    examples: [
      {
        text: 'According to recent studies, artificial intelligence has shown remarkable progress in natural language processing.',
        sources: [
          {
            title: 'AI Advances 2024',
            url: 'https://example.com/ai-advances',
            description: 'A comprehensive study on recent AI breakthroughs',
            quote: 'Machine learning models have achieved unprecedented accuracy in natural language processing tasks.'
          }
        ]
      },
      {
        text: 'The technology continues to evolve rapidly, with new breakthroughs announced regularly.',
        sources: [
          {
            title: 'Tech Evolution Report',
            url: 'https://example.com/tech-report',
            description: 'Analysis of technological trends and future predictions'
          },
          {
            title: 'Future of AI - MIT Technology Review',
            url: 'https://example.com/future-ai',
            description: 'Predictions and emerging patterns in artificial intelligence',
            quote: 'The next decade will see AI systems becoming increasingly sophisticated.'
          }
        ]
      },
      {
        text: 'Recent findings suggest a 45% increase in AI adoption across enterprises.',
        sources: [
          {
            title: 'Enterprise AI Survey 2024',
            url: 'https://example.com/enterprise-ai-survey'
          }
        ]
      }
    ]
  },
  {
    name: 'AlphaStreamCard',
    component: AlphaStreamCard,
    category: 'dynamic',
    description: 'Rich visualization card for Mallory Alpha Streams results. Displays premium analytics with sections, bullet points, tables, and raw data.',
    propsSchema: {
      type: 'object',
      properties: {
        title: { type: 'string', description: 'Headline for the alpha insight' },
        subtitle: { type: 'string', description: 'Optional supporting subtitle' },
        variant: { type: 'string', description: 'Visual styling variant: wallet, smartMoney, token, or general' },
        estimatedCost: { type: 'number', description: 'Approximate x402 spend in USDC' },
        metadata: { type: 'object', description: 'Key/value chips displayed under the header' },
        sections: {
          type: 'array',
          description: 'Insight sections to render in stacked layout',
          items: {
            type: 'object',
            properties: {
              title: { type: 'string', description: 'Section heading' },
              description: { type: 'string', description: 'Supporting narrative copy' },
              bullets: {
                type: 'array',
                items: { type: 'string' },
                description: 'Key bullet points'
              },
              table: {
                type: 'array',
                description: 'Structured rows with label/value pairs',
                items: {
                  type: 'object',
                  properties: {
                    label: { type: 'string', description: 'Row label' },
                    value: { type: 'string', description: 'Primary metric value' },
                    change: { type: 'string', description: 'Optional change indicator' }
                  },
                  required: ['label', 'value']
                }
              },
              raw: { type: 'object', description: 'Optional raw JSON payload (will be stringified)' },
              footnote: { type: 'string', description: 'Small-print annotation' }
            },
            required: ['title']
          }
        },
        disclaimer: { type: 'string', description: 'Footer disclaimer text' }
      },
      required: ['title', 'sections']
    },
    examples: [
      {
        title: 'Smart Money Rotation Watch',
        variant: 'smartMoney',
        estimatedCost: 0.002,
        metadata: {
          window: '7d',
          focus: 'Solana & Ethereum'
        },
        sections: [
          {
            title: 'Netflow Highlights',
            bullets: [
              'SOL saw +$4.2M smart money net inflow over the last 24h',
              'JTO rotation accelerated with +$1.1M net buys from top wallets'
            ],
            table: [
              { label: 'Top Inflow Token', value: 'SOL', change: '+$4.2M' },
              { label: 'Top Outflow Token', value: 'USDC', change: '-$3.6M' }
            ]
          },
          {
            title: 'Holdings Shifts',
            description: 'Largest week-over-week portfolio changes across tracked addresses.',
            table: [
              { label: 'mSOL', value: '+32%', change: '+$2.9M' },
              { label: 'JTO', value: '+19%', change: '+$1.1M' }
            ],
            footnote: 'Holdings based on 180 top-performing addresses.'
          }
        ],
        disclaimer: 'Data sourced from Nansen x402 endpoints. Values rounded to nearest $100K.'
      }
    ]
  }
];

/**
 * All dynamic components (this is now the same as dynamicComponents)
 * Static components are not part of the registry system
 */
export const allComponents: ComponentDefinition[] = dynamicComponents;
