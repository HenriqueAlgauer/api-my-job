import 'dotenv/config';
import { getEnv } from './utils';

export const AMQP_DNS = getEnv('AMQP_DNS');

export const DB_HOST = getEnv('DB_HOST');
export const DB_PORT = getEnv('DB_PORT');
export const DB_NAME = getEnv('DB_DATABASE');
export const DB_USER = getEnv('DB_USER');
export const DB_PASSWORD = getEnv('DB_PASSWORD');

export const PORT = getEnv('PORT');

export const JWT_SECRET = getEnv('JWT_SECRET');

export const CDN_KEY = getEnv('CDN_KEY');
export const CDN_SECRET = getEnv('CDN_SECRET');
export const CDN_URL = getEnv('CDN_URL');
export const RESEND_API_KEY = getEnv('RESEND_API_KEY');
export const RESEND_FROM_EMAIL = getEnv('RESEND_FROM_EMAIL');
