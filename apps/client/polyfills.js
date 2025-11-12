import { Platform } from 'react-native';

// Ensure crypto.getRandomValues is available for UUID generation on native
if (Platform.OS !== 'web') {
  try {
    // eslint-disable-next-line global-require
    require('react-native-get-random-values');
  } catch (error) {
    console.warn('[polyfills] Failed to load react-native-get-random-values:', error);
  }

  if (typeof global.crypto === 'undefined') {
    try {
      const { getRandomValues } = require('expo-random');
      global.crypto = { getRandomValues };
    } catch (error) {
      console.warn('[polyfills] Failed to polyfill global.crypto:', error);
    }
  }
}
import structuredClone from '@ungap/structured-clone';
import { Buffer } from 'buffer';

// Polyfill Buffer globally for Solana libraries
if (typeof global.Buffer === 'undefined') {
  global.Buffer = Buffer;
}

if (Platform.OS !== 'web') {
  const setupPolyfills = async () => {
    const { polyfillGlobal } = await import(
      'react-native/Libraries/Utilities/PolyfillFunctions'
    );

    const { TextEncoderStream, TextDecoderStream } = await import(
      '@stardazed/streams-text-encoding'
    );

    if (!('structuredClone' in global)) {
      polyfillGlobal('structuredClone', () => structuredClone);
    }

    polyfillGlobal('TextEncoderStream', () => TextEncoderStream);
    polyfillGlobal('TextDecoderStream', () => TextDecoderStream);
  };

  setupPolyfills();

  // Basic CustomEvent + window eventEmitter polyfill for React Native
  if (typeof global.CustomEvent === 'undefined') {
    global.CustomEvent = class CustomEvent {
      constructor(type, params = {}) {
        this.type = type;
        this.detail = params.detail ?? null;
      }
    };
  }

  if (typeof global.window === 'undefined') {
    global.window = global;
  }

  if (typeof global.window.addEventListener !== 'function') {
    const listeners = new Map();

    global.window.addEventListener = (type, listener) => {
      if (!listeners.has(type)) {
        listeners.set(type, new Set());
      }
      listeners.get(type).add(listener);
    };

    global.window.removeEventListener = (type, listener) => {
      const typeListeners = listeners.get(type);
      if (typeListeners) {
        typeListeners.delete(listener);
      }
    };

    global.window.dispatchEvent = (event) => {
      const typeListeners = listeners.get(event.type);
      if (typeListeners) {
        typeListeners.forEach((listener) => {
          try {
            listener(event);
          } catch (error) {
            console.error(`Error in ${event.type} listener:`, error);
          }
        });
      }
      return true;
    };
  }
}

export {};
