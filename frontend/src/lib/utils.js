import * as validator from 'validator';
const isBrowser = () => typeof window !== 'undefined';

const checkHumanNames = (name) => {
  console.log(!name || name.trim().length < 3 || /\d/.test(name));

  return !name || name.trim().length < 3 || /\d/.test(name);
};

export function generateRandomChars(length) {
  const chars =
    'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export function encodeString(str) {
  return str.toString('16');
}

export function decodeExamLinkId(encodedUrl) {
  return parseInt(encodedUrl, 16) || null;
}
