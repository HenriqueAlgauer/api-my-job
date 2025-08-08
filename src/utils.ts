import { pbkdf2Sync, randomBytes, createHmac } from 'crypto';
import { In } from 'typeorm';

import { addMinutes, format } from 'date-fns';

let SECRETS: { [key: string]: any } = {};

export const getEnv = (envName: string) => {
  if (process.env.SECRETS && !Object.keys(SECRETS).length) {
    SECRETS = JSON.parse(process.env.SECRETS);
  }

  if (SECRETS[envName]) {
    return SECRETS[envName] ?? null;
  }

  return process.env[envName] ?? null;
};

export const randFloor = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;
export const rand = (min: number, max: number) =>
  Math.random() * (max - min + 1) + min;
export const delay = (time: number) =>
  new Promise((res) => setTimeout(res, time));

export const calcHashedPassword = (plainPassword: string) => {
  const salt = randomBytes(16).toString('hex');
  const password = pbkdf2Sync(plainPassword, salt, 1000, 64, 'sha512').toString(
    'hex',
  );

  return {
    salt,
    password,
  };
};

export const generatePassword = (length: number = 8) => {
  const charset =
    'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+~`|}{[]:;?><,./-=';
  let password = '';

  while (length--) {
    password += charset[(Math.random() * charset.length) | 0];
  }

  return password;
};

export function generateOTP(
  secret: string,
  digits: number = 6,
  timeStep: number = 30,
): string {
  const currentTime = Math.floor(Date.now() / 1000);
  const timeWindow = Math.floor(currentTime / timeStep);

  // Create a buffer from the time window
  const timeBuffer = Buffer.alloc(8);
  timeBuffer.writeBigInt64BE(BigInt(timeWindow), 0);

  // Create an HMAC-SHA1 hash of the time buffer using the secret
  const hmac = createHmac('sha1', Buffer.from(secret, 'base64'));
  hmac.update(timeBuffer);
  const hash = hmac.digest();

  // Extract the dynamic OTP value
  const offset = hash[hash.length - 1] & 0x0f;
  const binary =
    ((hash[offset] & 0x7f) << 24) |
    ((hash[offset + 1] & 0xff) << 16) |
    ((hash[offset + 2] & 0xff) << 8) |
    (hash[offset + 3] & 0xff);

  const otp = (binary % Math.pow(10, digits)).toString().padStart(digits, '0');
  return otp;
}

export function filterObject(query: any, filter?: any) {
  const field: any = {};
  const limit = query?.limit ?? 10;
  let offset = 1;

  if (query.offset) {
    offset = query.offset;
  }

  offset = (offset - 1) * limit;

  for (const key in query) {
    if (query.hasOwnProperty(key)) {
      if (['limit', 'offset', 'includes'].includes(key)) {
        continue;
      }

      field[key] = query[key];

      if (!!Object.keys(filter).length) {
        Object.keys(filter).forEach((key) => {
          field[key] = filter[key];
        });
      }

      if (Array.isArray(field[key])) {
        delete field[key];
        field[key] = In(field[key]);
      }
    }
  }

  field.active = filter?.active ?? true;
  field.deleted = filter?.deleted ?? false;

  return { field, limit, offset };
}

export function toBoolean(value: any) {
  if (typeof value === 'string') {
    return value === 'true';
  }

  return !!value;
}

export async function resolvePromise<T, K = any>(
  promise: Promise<T>,
): Promise<[T | null, K | null]> {
  try {
    const data = await promise;
    return [data, null];
  } catch (error) {
    return [null, error as K];
  }
}

export function sanitizeStringForFileName(str: string) {
  if (!str) return '';

  let sanitized = str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  sanitized = sanitized.replace(/ç/g, 'c').replace(/Ç/g, 'C');

  sanitized = sanitized.replace(/\s+/g, '_');

  sanitized = sanitized.replace(/[^\w-]/g, ''); // \w é para [a-zA-Z0-9_]

  sanitized = sanitized.replace(/__+/g, '_');

  sanitized = sanitized.replace(/^_+|_+$/g, '');
  sanitized = sanitized.replace(/^-+|-+$/g, '');

  return sanitized || 'santzd_name'; // Retorna um placeholder se a string ficar vazia
}

export async function* waitGroupGenerator<T>(size: number, arr: T[]) {
  for (let i = 0; i < arr.length; i += size) {
    yield arr.slice(i, i + size);
  }
}

export function convertToUTC(date: string): string {
  const dateObj = new Date(date);
  // Considera a diferença do fuso horário para exibir como UTC
  const offset = dateObj.getTimezoneOffset();
  const dateInUTC = addMinutes(dateObj, offset);
  return format(dateInUTC, "yyyy-MM-dd'T'HH:mm'Z'");
}

export function formatDate(date: string): string {
  const dateObj = new Date(date);
  return format(dateObj, "yyyy-MM-dd'T'HH:mm'Z'");
}

export function generateProtocol(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const randomDigits = Math.floor(100000 + Math.random() * 900000);

  return `${year}${month}${day}${randomDigits}`;
}
