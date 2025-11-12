import { tool } from 'ai';
import { z } from 'zod';
import { X402_CONSTANTS } from '@darkresearch/mallory-shared';
import { supabase } from '../../../lib/supabase.js';
import {
  createNansenTool,
  createNansenCounterpartiesTool,
  createNansenSmartMoneyNetflowsTool,
  createNansenSmartMoneyHoldingsTool,
  createNansenTokenScreenerTool,
  createNansenFlowIntelligenceTool,
} from './nansen.js';

interface AlphaToolOptions {
  x402Context?: any;
  userId: string;
}

type NansenResult = Record<string, unknown> & {
  needsPayment?: boolean;
};

function truncateMiddle(value: string, visible = 6): string {
  if (!value) return '';
  if (value.length <= visible * 2 + 3) return value;
  return `${value.slice(0, visible)}…${value.slice(-visible)}`;
}

async function recordUsage(
  userId: string,
  toolName: string,
  costEstimate: number,
  input: Record<string, unknown>
) {
  try {
    const { error } = await supabase
      .from('alpha_usage')
      .insert({
        user_id: userId,
        tool_name: toolName,
        cost_estimate: costEstimate,
        input,
      });

    if (error) {
      console.error('⚠️ [AlphaUsage] Failed to record usage:', error);
    }
  } catch (err) {
    console.error('⚠️ [AlphaUsage] Unexpected error recording usage:', err);
  }
}

function isPaymentRequirement(result: NansenResult): boolean {
  return Boolean(result && result.needsPayment);
}

export function createAlphaWalletDeepDiveTool(options: AlphaToolOptions) {
  const historicalTool = createNansenTool(options.x402Context);
  const counterpartiesTool = createNansenCounterpartiesTool(options.x402Context);

  return tool({
    description: `Premium wallet deep dive combining historical balances and top counterparties. 
Costs two Nansen calls (~0.002 USDC) via x402.

AFTER calling this tool you MUST render an AlphaStreamCard with:
- title "Wallet Deep Dive" (or similar) and variant "wallet"
- metadata chips for address, chain, and date window
- sections summarising balance trends, allocation changes, and counterparties
- estimatedCost set to the total USDC spent`,
    inputSchema: z.object({
      address: z.string().describe('Wallet address to analyse'),
      chain: z.string().default('solana').describe('Blockchain network (solana, ethereum, etc.)'),
      startDate: z.string().optional().describe('ISO 8601 start date'),
      endDate: z.string().optional().describe('ISO 8601 end date'),
    }),
    execute: async ({ address, chain, startDate, endDate }) => {
      const balances = await historicalTool.execute({ address, chain, startDate, endDate }) as NansenResult;
      if (isPaymentRequirement(balances)) {
        return balances;
      }

      const counterparties = await counterpartiesTool.execute({ address, chain }) as NansenResult;
      if (isPaymentRequirement(counterparties)) {
        return counterparties;
      }

      const costEstimate = X402_CONSTANTS.NANSEN_ESTIMATED_COST * 2;

      await recordUsage(options.userId, 'wallet_deep_dive', costEstimate, {
        address,
        chain,
        startDate,
        endDate,
      });

      return {
        type: 'alpha_wallet_deep_dive',
        variant: 'wallet',
        title: 'Wallet Deep Dive',
        subtitle: `Address ${truncateMiddle(address)} on ${chain}`,
        metadata: {
          address,
          chain,
          window: startDate && endDate ? `${startDate} → ${endDate}` : startDate ? `${startDate} → now` : 'Last 24h',
        },
        estimatedCost: costEstimate,
        sections: [
          {
            title: 'Historical Balances',
            raw: balances,
          },
          {
            title: 'Top Counterparties',
            raw: counterparties,
          },
        ],
      };
    },
  });
}

export function createAlphaSmartMoneyRadarTool(options: AlphaToolOptions) {
  const netflowsTool = createNansenSmartMoneyNetflowsTool(options.x402Context);
  const holdingsTool = createNansenSmartMoneyHoldingsTool(options.x402Context);

  return tool({
    description: `Aggregated smart money radar combining netflows and holdings data across chains. 
Costs two Nansen calls (~0.002 USDC) via x402.

AFTER calling this tool you MUST render an AlphaStreamCard with:
- title highlighting the smart money trend and variant "smartMoney"
- metadata chips for chains and windows you analysed
- sections for netflow highlights and holdings shifts
- estimatedCost set to the total USDC spent`,
    inputSchema: z.object({
      chains: z.array(z.string()).default(['solana', 'ethereum']).describe('Chains to include'),
    }),
    execute: async ({ chains }) => {
      const netflows = await netflowsTool.execute({ chains }) as NansenResult;
      if (isPaymentRequirement(netflows)) {
        return netflows;
      }

      const holdings = await holdingsTool.execute({ chains }) as NansenResult;
      if (isPaymentRequirement(holdings)) {
        return holdings;
      }

      const costEstimate = X402_CONSTANTS.NANSEN_ESTIMATED_COST * 2;

      await recordUsage(options.userId, 'smart_money_radar', costEstimate, { chains });

      return {
        type: 'alpha_smart_money_radar',
        variant: 'smartMoney',
        title: 'Smart Money Radar',
        subtitle: `Rotation across ${chains.join(', ')}`,
        metadata: {
          chains: chains.join(', '),
        },
        estimatedCost: costEstimate,
        sections: [
          {
            title: 'Netflows',
            raw: netflows,
          },
          {
            title: 'Holdings',
            raw: holdings,
          },
        ],
      };
    },
  });
}

export function createAlphaTokenPulseTool(options: AlphaToolOptions) {
  const screenerTool = createNansenTokenScreenerTool(options.x402Context);
  const flowTool = createNansenFlowIntelligenceTool(options.x402Context);

  return tool({
    description: `Token pulse check mixing screener metrics with wallet flow intelligence. 
Costs two Nansen calls (~0.002 USDC) via x402.

AFTER calling this tool you MUST render an AlphaStreamCard with:
- title referencing the token pulse and variant "token"
- metadata for token symbol, chain, and timeframe
- sections covering screener metrics and wallet flow signals
- estimatedCost set to the total USDC spent`,
    inputSchema: z.object({
      token: z.string().describe('Token identifier or symbol'),
      chain: z.string().default('solana').describe('Blockchain network'),
    }),
    execute: async ({ token, chain }) => {
      const screener = await screenerTool.execute({ token, chain }) as NansenResult;
      if (isPaymentRequirement(screener)) {
        return screener;
      }

      const flows = await flowTool.execute({ token, chain }) as NansenResult;
      if (isPaymentRequirement(flows)) {
        return flows;
      }

      const costEstimate = X402_CONSTANTS.NANSEN_ESTIMATED_COST * 2;

      await recordUsage(options.userId, 'token_pulse', costEstimate, { token, chain });

      return {
        type: 'alpha_token_pulse',
        variant: 'token',
        title: 'Token Pulse Check',
        subtitle: `${token} on ${chain}`,
        metadata: {
          token,
          chain,
        },
        estimatedCost: costEstimate,
        sections: [
          {
            title: 'Token Screener',
            raw: screener,
          },
          {
            title: 'Flow Intelligence',
            raw: flows,
          },
        ],
      };
    },
  });
}

