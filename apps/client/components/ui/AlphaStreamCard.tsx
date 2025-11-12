import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useWallet } from '@/contexts/WalletContext';
import { useAlphaToast } from '@/components/ui/AlphaToastProvider';

type SectionTableRow = {
  label: string;
  value: string | number;
  change?: string;
};

type Section = {
  title: string;
  description?: string;
  bullets?: string[];
  table?: SectionTableRow[];
  raw?: any;
  footnote?: string;
};

export interface AlphaStreamCardProps {
  title: string;
  subtitle?: string;
  variant?: 'wallet' | 'smartMoney' | 'token' | 'general';
  estimatedCost?: number;
  metadata?: Record<string, string>;
  sections: Section[];
  disclaimer?: string;
}

const VARIANT_COLORS: Record<string, string> = {
  wallet: '#712C00',
  smartMoney: '#00473E',
  token: '#2F0F46',
  general: '#663000',
};

export const AlphaStreamCard: React.FC<AlphaStreamCardProps> = ({
  title,
  subtitle,
  variant = 'general',
  estimatedCost,
  metadata,
  sections,
  disclaimer,
}) => {
  const accentColor = VARIANT_COLORS[variant] || VARIANT_COLORS.general;
  const { refreshWalletData } = useWallet();
  const hasRefreshed = useRef(false);
  const { showToast } = useAlphaToast();

  useEffect(() => {
    if (!hasRefreshed.current && estimatedCost && estimatedCost > 0) {
      hasRefreshed.current = true;
      showToast(`Spent ${estimatedCost.toFixed(3)} USDC via x402`);
      refreshWalletData().catch(error => {
        console.error('⚠️ [AlphaStreamCard] Failed to refresh wallet data after x402 deduction:', error);
      });
    }
  }, [estimatedCost, refreshWalletData, showToast]);

  return (
    <View style={[styles.container, { borderColor: accentColor }]}>
      <View style={styles.header}>
        <View style={styles.headerText}>
          <Text style={styles.title}>{title}</Text>
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        </View>
        {estimatedCost !== undefined ? (
          <View style={[styles.costPill, { backgroundColor: accentColor }]}>
            <Text style={styles.costText}>~{estimatedCost.toFixed(3)} USDC</Text>
          </View>
        ) : null}
      </View>

      {metadata && Object.keys(metadata).length > 0 && (
        <View style={styles.metadataRow}>
          {Object.entries(metadata).map(([key, value]) => (
            <View key={key} style={styles.metadataItem}>
              <Text style={styles.metadataLabel}>{formatLabel(key)}</Text>
              <Text style={styles.metadataValue}>{value}</Text>
            </View>
          ))}
        </View>
      )}

      <View style={styles.sectionsContainer}>
        {sections.map((section, index) => (
          <View key={index} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            {section.description ? (
              <Text style={styles.sectionDescription}>{section.description}</Text>
            ) : null}

            {section.bullets && section.bullets.length > 0 && (
              <View style={styles.bulletList}>
                {section.bullets.map((bullet, bulletIndex) => (
                  <View key={bulletIndex} style={styles.bulletItem}>
                    <Text style={styles.bulletMarker}>{'\u2022'}</Text>
                    <Text style={styles.bulletText}>{bullet}</Text>
                  </View>
                ))}
              </View>
            )}

            {section.table && section.table.length > 0 && (
              <View style={styles.table}>
                {section.table.map((row, rowIndex) => (
                  <View key={rowIndex} style={styles.tableRow}>
                    <Text style={styles.tableLabel}>{row.label}</Text>
                    <View style={styles.tableValueWrapper}>
                      <Text style={styles.tableValue}>{row.value}</Text>
                      {row.change ? <Text style={styles.tableChange}>{row.change}</Text> : null}
                    </View>
                  </View>
                ))}
              </View>
            )}

            {section.raw && (
              <View style={styles.rawContainer}>
                <Text style={styles.rawLabel}>Raw data</Text>
                <Text style={styles.rawText}>{formatRaw(section.raw)}</Text>
              </View>
            )}

            {section.footnote ? (
              <Text style={styles.sectionFootnote}>{section.footnote}</Text>
            ) : null}
          </View>
        ))}
      </View>

      {disclaimer ? <Text style={styles.disclaimer}>{disclaimer}</Text> : null}
    </View>
  );
};

function formatLabel(label: string): string {
  return label
    .replace(/_/g, ' ')
    .replace(/\b\w/g, char => char.toUpperCase());
}

function formatRaw(data: unknown): string {
  try {
    return JSON.stringify(data, null, 2);
  } catch (error) {
    return String(data);
  }
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderRadius: 20,
    padding: 20,
    backgroundColor: '#FFF9F2',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
    marginVertical: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
    gap: 12,
  },
  headerText: {
    flex: 1,
    gap: 4,
  },
  title: {
    fontFamily: 'Satoshi-Bold',
    fontSize: 18,
    color: '#3C2200',
  },
  subtitle: {
    fontFamily: 'Satoshi',
    fontSize: 14,
    color: '#6F4F2F',
  },
  costPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  costText: {
    fontFamily: 'Satoshi-Bold',
    fontSize: 12,
    color: '#FFEAD6',
  },
  metadataRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 12,
  },
  metadataItem: {
    backgroundColor: '#F3E3D5',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  metadataLabel: {
    fontFamily: 'Satoshi-Bold',
    fontSize: 11,
    color: '#6F4F2F',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  metadataValue: {
    fontFamily: 'Satoshi',
    fontSize: 14,
    color: '#432200',
  },
  sectionsContainer: {
    gap: 18,
  },
  section: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
    paddingTop: 16,
  },
  sectionTitle: {
    fontFamily: 'Satoshi-Bold',
    fontSize: 16,
    color: '#3C2200',
    marginBottom: 8,
  },
  sectionDescription: {
    fontFamily: 'Satoshi',
    fontSize: 14,
    color: '#6F4F2F',
    marginBottom: 10,
  },
  bulletList: {
    gap: 6,
    marginBottom: 10,
  },
  bulletItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  bulletMarker: {
    marginRight: 8,
    color: '#6F4F2F',
  },
  bulletText: {
    flex: 1,
    fontFamily: 'Satoshi',
    fontSize: 14,
    color: '#3C2200',
  },
  table: {
    gap: 8,
    marginBottom: 10,
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.07)',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
  },
  tableLabel: {
    fontFamily: 'Satoshi-Bold',
    fontSize: 14,
    color: '#3C2200',
    flex: 1,
    marginRight: 12,
  },
  tableValueWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  tableValue: {
    fontFamily: 'Satoshi',
    fontSize: 14,
    color: '#1C160F',
  },
  tableChange: {
    fontFamily: 'Satoshi-Bold',
    fontSize: 12,
    color: '#0B814A',
  },
  rawContainer: {
    backgroundColor: '#1F170E',
    borderRadius: 12,
    padding: 12,
    marginTop: 8,
  },
  rawLabel: {
    fontFamily: 'Satoshi-Bold',
    fontSize: 12,
    color: '#FBAA69',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  rawText: {
    fontFamily: 'Menlo',
    fontSize: 12,
    color: '#FFEAD6',
  },
  sectionFootnote: {
    fontFamily: 'Satoshi',
    fontSize: 12,
    color: '#6F4F2F',
    marginTop: 6,
  },
  disclaimer: {
    marginTop: 16,
    fontFamily: 'Satoshi',
    fontSize: 12,
    color: '#7A5936',
  },
});

export default AlphaStreamCard;

