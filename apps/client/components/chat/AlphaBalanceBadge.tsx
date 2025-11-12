import React, { useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useWallet } from '@/contexts/WalletContext';
import { useAlphaToast } from '@/components/ui/AlphaToastProvider';

const DELTA_DISPLAY_MS = 4000;
const EPSILON = 0.0000005;

function formatTokenAmount(value: number | undefined, decimals = 3) {
  if (value === undefined || Number.isNaN(value)) {
    return '0';
  }
  if (value >= 1) {
    return value.toFixed(decimals);
  }
  return value.toFixed(Math.min(decimals + 2, 6));
}

function formatDelta(value: number) {
  const sign = value > 0 ? '+' : '';
  return `${sign}${value.toFixed(3)}`;
}

export const AlphaBalanceBadge: React.FC = () => {
  const { walletData, isRefreshing, isLoading } = useWallet();
  const { showToast } = useAlphaToast();
  const [delta, setDelta] = useState<{ sol: number | null; usdc: number | null }>({
    sol: null,
    usdc: null,
  });
  const [showDelta, setShowDelta] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const previousBalancesRef = useRef<{ sol: number; usdc: number } | null>(null);

  const { solBalance, usdcBalance } = useMemo(() => {
    const sol = walletData?.holdings?.find((token) => token.tokenSymbol === 'SOL');
    const usdc = walletData?.holdings?.find((token) => token.tokenSymbol === 'USDC');
    return {
      solBalance: sol?.holdings ?? 0,
      usdcBalance: usdc?.holdings ?? 0,
    };
  }, [walletData?.holdings]);

  useEffect(() => {
    const previous = previousBalancesRef.current;
    if (previous) {
      const solDiff = solBalance - previous.sol;
      const usdcDiff = usdcBalance - previous.usdc;

      const hasMeaningfulChange =
        Math.abs(solDiff) > EPSILON || Math.abs(usdcDiff) > EPSILON;

      if (hasMeaningfulChange) {
        if (Math.abs(usdcDiff) > EPSILON) {
          const usdcMessage =
            usdcDiff < 0
              ? `x402 payment: ${formatDelta(usdcDiff)} USDC`
              : `USDC balance: ${formatDelta(usdcDiff)} received`;
          showToast(usdcMessage);
        }
        if (Math.abs(solDiff) > EPSILON) {
          const solMessage =
            solDiff < 0
              ? `SOL spent: ${formatDelta(solDiff)}`
              : `SOL received: ${formatDelta(solDiff)}`;
          showToast(solMessage);
        }
        setDelta({
          sol: Math.abs(solDiff) > EPSILON ? solDiff : null,
          usdc: Math.abs(usdcDiff) > EPSILON ? usdcDiff : null,
        });
        setShowDelta(true);

        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = setTimeout(() => {
          setShowDelta(false);
        }, DELTA_DISPLAY_MS);
      }
    }

    previousBalancesRef.current = { sol: solBalance, usdc: usdcBalance };

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [solBalance, usdcBalance]);

  const isBusy = isRefreshing || (isLoading && !walletData);

  return (
    <View style={styles.wrapper}>
      <Text style={styles.heading}>x402 Balance</Text>
      <View style={styles.container}>
        <View style={styles.row}>
          <Text style={styles.label}>SOL</Text>
          <View style={styles.valueGroup}>
            {isBusy ? (
              <ActivityIndicator size="small" color="#FFF2E8" />
            ) : (
              <Text style={styles.value}>{formatTokenAmount(solBalance)}</Text>
            )}
            {showDelta && delta.sol !== null ? (
              <Text
                style={[
                  styles.delta,
                  { color: delta.sol < 0 ? '#ef4444' : '#0B814A' },
                ]}
              >
                {formatDelta(delta.sol)}
              </Text>
            ) : null}
          </View>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>USDC</Text>
          <View style={styles.valueGroup}>
            {isBusy ? (
              <ActivityIndicator size="small" color="#FFF2E8" />
            ) : (
              <Text style={styles.value}>{formatTokenAmount(usdcBalance, 2)}</Text>
            )}
            {showDelta && delta.usdc !== null ? (
              <Text
                style={[
                  styles.delta,
                  { color: delta.usdc < 0 ? '#ef4444' : '#0B814A' },
                ]}
              >
                {formatDelta(delta.usdc)}
              </Text>
            ) : null}
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    alignSelf: 'flex-end',
    marginBottom: 12,
  },
  heading: {
    fontFamily: 'Satoshi-Bold',
    fontSize: 12,
    color: '#6F4F2F',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: 6,
    textAlign: 'right',
  },
  container: {
    backgroundColor: '#3C2200',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 10,
    flexDirection: 'row',
    gap: 24,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  label: {
    fontFamily: 'Satoshi-Bold',
    fontSize: 13,
    color: '#FBAA69',
    letterSpacing: 0.5,
  },
  valueGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  value: {
    fontFamily: 'Satoshi-Bold',
    fontSize: 16,
    color: '#FFF2E8',
  },
  delta: {
    fontFamily: 'Satoshi-Bold',
    fontSize: 13,
  },
});

export default AlphaBalanceBadge;

