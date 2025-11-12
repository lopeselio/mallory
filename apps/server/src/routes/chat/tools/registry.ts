import { searchWeb } from './searchWeb.js';
// Supermemory removed - now using infinite-memory instead
import { createNansenTool, createNansenSmartMoneyNetflowsTool, createNansenSmartMoneyHoldingsTool, createNansenSmartMoneyDexTradesTool, createNansenSmartMoneyJupiterDcasTool, createNansenCurrentBalanceTool, createNansenTransactionsTool, createNansenCounterpartiesTool, createNansenRelatedWalletsTool, createNansenPnlSummaryTool, createNansenPnlTool, createNansenLabelsTool, createNansenTokenScreenerTool, createNansenFlowIntelligenceTool, createNansenHoldersTool, createNansenFlowsTool, createNansenWhoBoughtSoldTool, createNansenTokenDexTradesTool, createNansenTokenTransfersTool, createNansenTokenJupiterDcasTool, createNansenPnlLeaderboardTool, createNansenPortfolioTool } from './nansen.js';
import { createAlphaSmartMoneyRadarTool, createAlphaTokenPulseTool, createAlphaWalletDeepDiveTool } from './alpha.js';

/**
 * Tool registry for Mallory AI assistant
 * All available tools that the AI can use during conversations
 */

export const toolRegistry = {
  searchWeb,
  createNansenTool,
  createNansenSmartMoneyNetflowsTool,
  createNansenSmartMoneyHoldingsTool,
  createNansenSmartMoneyDexTradesTool,
  createNansenSmartMoneyJupiterDcasTool,
  createNansenCurrentBalanceTool,
  createNansenTransactionsTool,
  createNansenCounterpartiesTool,
  createNansenRelatedWalletsTool,
  createNansenPnlSummaryTool,
  createNansenPnlTool,
  createNansenLabelsTool,
  createNansenTokenScreenerTool,
  createNansenFlowIntelligenceTool,
  createNansenHoldersTool,
  createNansenFlowsTool,
  createNansenWhoBoughtSoldTool,
  createNansenTokenDexTradesTool,
  createNansenTokenTransfersTool,
  createNansenTokenJupiterDcasTool,
  createNansenPnlLeaderboardTool,
  createNansenPortfolioTool,
  createAlphaWalletDeepDiveTool,
  createAlphaSmartMoneyRadarTool,
  createAlphaTokenPulseTool
};

// Export individual tools for easier imports
export { searchWeb, createNansenTool, createNansenSmartMoneyNetflowsTool, createNansenSmartMoneyHoldingsTool, createNansenSmartMoneyDexTradesTool, createNansenSmartMoneyJupiterDcasTool, createNansenCurrentBalanceTool, createNansenTransactionsTool, createNansenCounterpartiesTool, createNansenRelatedWalletsTool, createNansenPnlSummaryTool, createNansenPnlTool, createNansenLabelsTool, createNansenTokenScreenerTool, createNansenFlowIntelligenceTool, createNansenHoldersTool, createNansenFlowsTool, createNansenWhoBoughtSoldTool, createNansenTokenDexTradesTool, createNansenTokenTransfersTool, createNansenTokenJupiterDcasTool, createNansenPnlLeaderboardTool, createNansenPortfolioTool, createAlphaWalletDeepDiveTool, createAlphaSmartMoneyRadarTool, createAlphaTokenPulseTool };

