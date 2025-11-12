import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface EmptyStateProps {
  currentConversationId: string | null;
  conversationParam?: string;
  styles: any;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  currentConversationId,
  conversationParam,
  styles,
}) => {
  const quickActions = [
    {
      id: 'wallet',
      title: 'Wallet Deep Dive',
      subtitle: 'Balance trends + counterparties',
      icon: 'analytics-outline' as const,
      prompt: 'Run the Mallory Alpha Streams wallet deep dive. Ask me for the wallet address if I have not provided one yet, then show the full AlphaStreamCard.',
    },
    {
      id: 'smart-money',
      title: 'Smart Money Radar',
      subtitle: 'Netflows + holdings rotation',
      icon: 'compass-outline' as const,
      prompt: 'Use the Mallory Alpha Streams smart money radar to surface the strongest rotations across Solana and Ethereum.',
    },
    {
      id: 'token',
      title: 'Token Pulse Check',
      subtitle: 'Flows + screener metrics',
      icon: 'pulse-outline' as const,
      prompt: 'Trigger the Mallory Alpha Streams token pulse check for the token I mention next. Summarize with the AlphaStreamCard component.',
    },
  ];

  const handleActionPress = (prompt: string) => {
    if (!currentConversationId) return;
    const event = new CustomEvent('chat:sendMessage', {
      detail: {
        conversationId: currentConversationId,
        message: prompt,
      },
    });
    window.dispatchEvent(event);
  };

  return (
    <View style={styles.emptyState}>
      <View style={{ alignItems: 'center', marginBottom: 24 }}>
        <Text style={styles.emptyStateTitle}>Mallory Alpha Streams</Text>
        <Text style={[styles.emptyStateSubtitle, { maxWidth: 420 }]}>
          Unlock premium Nansen intelligence without subscriptions. Pick a stream below or ask anything to start the conversation.
        </Text>
      </View>

      <View style={{ width: '100%', maxWidth: 520, gap: 12 }}>
        {quickActions.map(action => (
          <TouchableOpacity
            key={action.id}
            style={{
              backgroundColor: '#FFF4E8',
              borderRadius: 18,
              paddingVertical: 16,
              paddingHorizontal: 18,
              flexDirection: 'row',
              alignItems: 'center',
              borderWidth: 1,
              borderColor: 'rgba(201, 89, 0, 0.2)',
            }}
            onPress={() => handleActionPress(action.prompt)}
            activeOpacity={0.85}
          >
            <View
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: '#FBAA69',
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: 16,
              }}
            >
              <Ionicons name={action.icon} size={20} color="#3C2200" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontFamily: 'Satoshi-Bold', fontSize: 16, color: '#3C2200' }}>
                {action.title}
              </Text>
              <Text style={{ fontFamily: 'Satoshi', fontSize: 14, color: '#6F4F2F', marginTop: 2 }}>
                {action.subtitle}
              </Text>
            </View>
            <Ionicons name="arrow-forward" size={18} color="#C95900" />
          </TouchableOpacity>
        ))}
      </View>

      <Text style={[styles.conversationInfo, { marginTop: 24 }]}>
        Each Alpha stream costs ~0.002 USDC via x402. Make sure your Grid wallet has SOL for fees and a few USDC to spend.
      </Text>
    </View>
  );
};
