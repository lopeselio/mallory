import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';

interface AlphaToastContextValue {
  showToast: (message: string) => void;
}

const AlphaToastContext = createContext<AlphaToastContextValue>({
  showToast: () => undefined,
});

export function useAlphaToast() {
  return useContext(AlphaToastContext);
}

interface AlphaToastProviderProps {
  children: React.ReactNode;
}

const ANIMATION_DURATION = 200;
const TOAST_VISIBLE_MS = 2500;

export function AlphaToastProvider({ children }: AlphaToastProviderProps) {
  const [toast, setToast] = useState<{ message: string; id: number } | null>(null);
  const opacity = useRef(new Animated.Value(0)).current;
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const hideToast = useCallback(() => {
    Animated.timing(opacity, {
      toValue: 0,
      duration: ANIMATION_DURATION,
      useNativeDriver: true,
    }).start(() => setToast(null));
  }, [opacity]);

  useEffect(() => {
    if (toast) {
      Animated.timing(opacity, {
        toValue: 1,
        duration: ANIMATION_DURATION,
        useNativeDriver: true,
      }).start();

      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      timerRef.current = setTimeout(() => {
        hideToast();
      }, TOAST_VISIBLE_MS);
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [toast, hideToast, opacity]);

  const showToast = useCallback((message: string) => {
    setToast({ message, id: Date.now() });
  }, []);

  return (
    <AlphaToastContext.Provider value={{ showToast }}>
      {children}
      {toast ? (
        <Animated.View
          pointerEvents="none"
          style={[
            styles.toastContainer,
            {
              opacity,
              transform: [
                {
                  translateY: opacity.interpolate({
                    inputRange: [0, 1],
                    outputRange: [20, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <View style={styles.toast}>
            <Text style={styles.toastText}>{toast.message}</Text>
          </View>
        </Animated.View>
      ) : null}
    </AlphaToastContext.Provider>
  );
}

const styles = StyleSheet.create({
  toastContainer: {
    position: 'absolute',
    bottom: 32,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  toast: {
    backgroundColor: '#3C2200',
    borderRadius: 18,
    paddingHorizontal: 18,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  toastText: {
    fontFamily: 'Satoshi-Bold',
    fontSize: 14,
    color: '#FFF2E8',
  },
});

