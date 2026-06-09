/**
 * Safari/iOS Polyfills
 * Ensures compatibility with Safari on iPhone/iPad
 */

// Polyfill for localStorage in Safari Private Browsing
if (typeof window !== 'undefined') {
  try {
    const testKey = '__localStorage_test__';
    window.localStorage.setItem(testKey, 'test');
    window.localStorage.removeItem(testKey);
  } catch (_e) {
    console.warn('localStorage not available, using memory fallback');

    // In-memory fallback for Safari Private Browsing
    const memoryStorage: Record<string, string> = {};

    Storage.prototype.setItem = function(key: string, value: string) {
      memoryStorage[key] = value;
    };

    Storage.prototype.getItem = function(key: string) {
      return memoryStorage[key] || null;
    };

    Storage.prototype.removeItem = function(key: string) {
      delete memoryStorage[key];
    };

    Storage.prototype.clear = function() {
      for (const key in memoryStorage) {
        delete memoryStorage[key];
      }
    };
  }
}

// Ensure atob is available for JWT decoding
if (typeof atob === 'undefined' && typeof window !== 'undefined') {
  console.warn('atob not available, adding polyfill');

  (window as unknown as Record<string, unknown>)['atob'] = function(str: string): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvuvwxyz0123456789+/=';
    let output = '';

    str = String(str).replace(/=+$/, '');

    if (str.length % 4 === 1) {
      throw new Error("'atob' failed: The string to be decoded is not correctly encoded.");
    }

    for (
      let bc = 0, bs = 0, buffer: string | number, idx = 0;
      (buffer = str.charAt(idx++));
      ~buffer && ((bs = bc % 4 ? bs * 64 + buffer : buffer), bc++ % 4)
        ? (output += String.fromCharCode(255 & (bs >> ((-2 * bc) & 6))))
        : 0
    ) {
      buffer = chars.indexOf(buffer);
    }

    return output;
  };
}

// Ensure btoa is available
if (typeof btoa === 'undefined' && typeof window !== 'undefined') {
  console.warn('btoa not available, adding polyfill');

  (window as unknown as Record<string, unknown>)['btoa'] = function(str: string): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
    let output = '';

    for (
      let block = 0, charCode, idx = 0, map = chars;
      str.charAt(idx | 0) || ((map = '='), idx % 1);
      output += map.charAt(63 & (block >> (8 - (idx % 1) * 8)))
    ) {
      charCode = str.charCodeAt((idx += 3 / 4));

      if (charCode > 0xff) {
        throw new Error("'btoa' failed: The string to be encoded contains characters outside of the Latin1 range.");
      }

      block = (block << 8) | charCode;
    }

    return output;
  };
}

// Fix for Safari's Date parsing issues
if (typeof window !== 'undefined') {
  const originalParse = Date.parse;
  Date.parse = function(dateString: string) {
    // Safari has issues with ISO 8601 dates without timezone
    if (typeof dateString === 'string' && dateString.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/)) {
      dateString += 'Z';
    }
    return originalParse(dateString);
  };
}

console.log('✅ Safari/iOS polyfills loaded');
