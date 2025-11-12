/**
 * Dynamic Components system prompt
 * Teaches the AI about available UI components it can render
 * 
 * Note: This is manually maintained but should match the component registry.
 * When you add a new component to the registry, update this file.
 */

interface ComponentSchema {
  name: string;
  description: string;
  props: {
    [key: string]: {
      type: string;
      required: boolean;
      description: string;
    };
  };
  example: string;
}

/**
 * Available dynamic components
 * Keep this in sync with apps/client/components/registry/ComponentDefinitions.ts
 * 
 * NOTE: Mallory only has InlineCitation implemented.
 * TokenCard is available in Researcher/Scout but not here yet.
 */
const AVAILABLE_COMPONENTS: ComponentSchema[] = [
  {
    name: 'InlineCitation',
    description: 'Displays inline citations for AI-generated content with sources. Shows a citation badge that opens a modal with source details.',
    props: {
      text: { type: 'string', required: true, description: 'The text content that has citations (can be empty for inline placement)' },
      sources: { 
        type: 'array', 
        required: true, 
        description: 'Array of source objects, each with: url (required), title (optional), description (optional), quote (optional)' 
      },
    },
    example: `{{component: "InlineCitation", props: {
  "text": "",
  "sources": [{
    "title": "AI Research 2024",
    "url": "https://example.com/research",
    "description": "Latest findings in AI development",
    "quote": "AI has made significant progress in recent years"
  }]
}}}`
  },
  {
    name: 'AlphaStreamCard',
    description: 'Premium analytics card for Mallory Alpha Streams. Use to present paywalled insights with structured sections, tables, bullets, and raw data.',
    props: {
      title: { type: 'string', required: true, description: 'Headline describing the alpha insight' },
      subtitle: { type: 'string', required: false, description: 'Optional supporting subtitle' },
      variant: { type: 'string', required: false, description: 'Styling variant: "wallet", "smartMoney", "token", or "general"' },
      estimatedCost: { type: 'number', required: false, description: 'Approximate x402 spend in USDC (e.g., 0.002)' },
      metadata: { type: 'object', required: false, description: 'Key/value chips for context (address, chain, timeframe, etc.)' },
      sections: { type: 'array', required: true, description: 'Stacked insight sections with descriptions, bullets, and tables' },
      disclaimer: { type: 'string', required: false, description: 'Footer disclaimer text (e.g., data sources, timeframes)' },
    },
    example: `{{component: "AlphaStreamCard", props: {
  "title": "Wallet Deep Dive — 7d",
  "subtitle": "0x1234 rotated into SOL ecosystem plays",
  "variant": "wallet",
  "estimatedCost": 0.002,
  "metadata": {
    "Address": "0x1234...ABCD",
    "Chain": "Solana",
    "Window": "7d"
  },
  "sections": [{
    "title": "Balance Trends",
    "bullets": [
      "Total net worth up 18% week-over-week (+$42.3K)",
      "USDC position trimmed by 22%, redeployed into SOL and mSOL"
    ],
    "table": [
      { "label": "Top Position", "value": "SOL ($96.2K)", "change": "+14%" },
      { "label": "New Allocation", "value": "JTO ($18.4K)", "change": "NEW" }
    ]
  }, {
    "title": "Top Counterparties",
    "description": "Largest counterparties over the selected window.",
    "table": [
      { "label": "Jupiter DCA", "value": "$22.1K", "change": "+3.2K" },
      { "label": "Orca Solana", "value": "$18.6K", "change": "+1.9K" }
    ],
    "footnote": "Counterparties measured by total transfer volume."
  }],
  "disclaimer": "Data sourced from Nansen x402 endpoints. Costs debited automatically from user wallet."
}}}`
  }
];

/**
 * Build dynamic components guidelines for system prompt
 */
export function buildComponentsGuidelines(): string {
  // Build component documentation
  const componentDocs = AVAILABLE_COMPONENTS.map(comp => {
    // Format props list
    const propsList = Object.entries(comp.props).map(([key, prop]) => {
      const requiredLabel = prop.required ? '(required)' : '(optional)';
      return `  - \`${key}\` ${requiredLabel}: ${prop.description}`;
    }).join('\n');

    return `
### ${comp.name}
${comp.description}

**Props:**
${propsList}

**Example:**
\`\`\`
${comp.example}
\`\`\`
`;
  }).join('\n');

  return `

## Dynamic UI Components

You can render interactive UI components inline with your responses using this syntax:

\`\`\`
{{component: "ComponentName", props: {
  "propName": "value",
  "anotherProp": 123
}}}
\`\`\`

**IMPORTANT RULES:**
1. Component syntax must be on its own line (not inline with text)
2. Use double quotes for all JSON keys and string values
3. Props are validated - include all required props
4. Components render where you place them in your response

### Available Components

${componentDocs}

### When to Use Components

**InlineCitation:**
- **CRITICAL: ALWAYS cite sources when using web search results**
- Place citation immediately after the claim it supports
- Set \`text\` to empty string ("") for inline placement
- Include all available metadata: title, url, description, quote
- Multiple sources can be included in the sources array

**Citation Best Practices:**
1. When you use the searchWeb tool, ALWAYS cite your sources with InlineCitation
2. Place {{component: "InlineCitation", ...}} right after the sentence it supports
3. Use empty text ("") so it appears inline: "Some fact{{component: "InlineCitation", ...}}."
4. Include title, URL, and description from search results
5. Add quote if you're directly referencing specific information
6. Be enthusiastic about citing sources - it builds trust and shows you did your research!

**AlphaStreamCard:**
- Use when summarizing Mallory Alpha Streams tool results
- ALWAYS include at least two sections with descriptive titles
- Each section can have narrative \`description\`, \`bullets\`, and/or \`table\` rows
- Provide \`metadata\` chips for address, chain, timeframe, or focus tokens
- Mention cost by setting \`estimatedCost\` so the user sees how much USDC was spent
- Keep raw JSON tucked under \`raw\` when additional context is helpful

**Example with Web Search Citation:**
\`\`\`markdown
Recent developments in brain-inspired artificial intelligence are showing promising results{{component: "InlineCitation", props: {
  "text": "",
  "sources": [{
    "title": "Brain-Inspired AI Breakthrough",
    "url": "https://www.gatech.edu/news/2025/06/26/brain-inspired-ai-breakthrough",
    "description": "Georgia Tech researchers developed TopoNets with 20% improvement"
  }]
}}}. The approach addresses fundamental limitations in current AI systems.
\`\`\`

### Component Rendering

- Components are extracted from your markdown by StreamdownRN
- Props are validated against JSON schemas
- Invalid components fail gracefully (show error, don't break UI)
- Components appear inline exactly where you place them

**Remember:** Use components to ENHANCE responses with interactive UI, not replace clear explanations!
`;
}
