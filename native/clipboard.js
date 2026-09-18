import { Alert } from 'react-native';

/**
 * Copies text to the clipboard reliably across Web, Mobile Web, React Native, and iFrames.
 * @param {string} text - The string to copy
 * @returns {Promise<boolean>} - True if successfully copied
 */
export async function copyTextToClipboard(text) {
  if (!text) return false;

  // 1. Try modern navigator.clipboard
  try {
    if (typeof navigator !== 'undefined' && navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch (err) {
    // Fallback to legacy textarea
  }

  // 2. Fallback using invisible textarea for Web & iframe contexts
  try {
    if (typeof document !== 'undefined') {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.opacity = '0';
      textArea.style.left = '-9999px';
      textArea.style.top = '-9999px';
      textArea.setAttribute('readonly', '');
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      textArea.setSelectionRange(0, 99999);
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      if (successful) return true;
    }
  } catch (e) {
    // Ignore
  }

  return false;
}
