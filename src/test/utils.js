import crypto from 'crypto';
import dotenv from 'dotenv';
import FormData from 'form-data';
import fs from 'fs';
import fetch from 'node-fetch';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { stat } from '../lib/fs-helpers.js';

// Nær allt fengið úr sýnilausn hópverkefni 1.

const basePath = dirname(fileURLToPath(import.meta.url));

dotenv.config();

const {
  PORT: port = '5000',
  ADMIN_USER: adminUser = '',
  ADMIN_PASS: adminPass = '',
  TEST_USER: testUser = '',
  TEST_PASS: testPass = '',
} = process.env;

const baseUrl = `http://localhost:${port}`;

export function randomValue() {
  return crypto.randomBytes(16).toString('hex');
}

export function getRandomInt(min, max) {
  const ceilMin = Math.ceil(min);
  const floorMax = Math.floor(max);
  return Math.floor(Math.random() * (floorMax - ceilMin) + ceilMin);
}

export async function methodAndParse(
  method,
  path,
  data = null,
  token = null,
  imagePath = null
) {
  const url = new URL(path, baseUrl);

  const options = { headers: {} };

  if (method !== 'GET') {
    options.method = method;
  }

  if (imagePath) {
    const resolvedImagePath = join(basePath, imagePath);
    const form = new FormData();
    const stats = stat(resolvedImagePath);
    const fileSizeInBytes = stats.size;
    const fileStream = fs.createReadStream(resolvedImagePath);
    form.append('image', fileStream, { knownLength: fileSizeInBytes });

    if (data) {
      for (const [key, value] of Object.entries(data)) {
        form.append(key, value);
      }
    }
    options.body = form;
  } else if (data) {
    options.headers['content-type'] = 'application/json';
    options.body = JSON.stringify(data);
  }

  if (token) {
    options.headers.Authorization = `Bearer ${token}`;
  }

  const result = await fetch(url, options);

  let response;
  try {
    response = await result.json();
  } catch (e) {
    response = {};
  }

  return {
    result: response,
    status: result.status,
  };
}

export async function fetchAndParse(path, token = null) {
  return methodAndParse('GET', path, null, token);
}

export async function postAndParse(path, data, token = null, imagePath = null) {
  return methodAndParse('POST', path, data, token, imagePath);
}

export async function patchAndParse(path, data, token = null) {
  return methodAndParse('PATCH', path, data, token);
}

export async function deleteAndParse(path, data, token = null) {
  return methodAndParse('DELETE', path, data, token);
}

export async function loginAndReturnToken(data) {
  const { result } = await postAndParse('/users/login', data);
  if (result && result.token) {
    return result.token;
  }

  return null;
}

export async function createRandomUserAndReturnWithToken() {
  const rnd = randomValue();
  const username = `user${rnd}`;
  const name = `user-${rnd}`;
  const email = `${rnd}@user.is`;
  const password = '1234567890';

  const data = { username, password, name, email };
  const { result } = await postAndParse('/users/register', data);
  const token = await loginAndReturnToken({ username, password });

  return {
    user: result,
    token,
  };
}

export async function loginAsHardcodedAdminAndReturnToken() {
  const result = await loginAndReturnToken({
    username: adminUser,
    password: adminPass,
  });
  return result;
}

export async function loginAsHardcodedTestUserAndReturnToken() {
  const result = await loginAndReturnToken({
    username: testUser,
    password: testPass,
  });
  return result;
}
