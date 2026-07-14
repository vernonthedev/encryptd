import crypto from 'crypto';
import { EncryptedPayload } from './interfaces';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;
const SALT = '4f8d2e8b23c94d0e91f07b1a2c5e6f8a7c3b9d0e1f2a3b4c5d6e7f8a9b0c1d2e'; 
const KEY_LENGTH = 32;
const ITERATIONS = 100000;