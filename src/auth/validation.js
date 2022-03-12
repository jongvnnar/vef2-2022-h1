import { body } from 'express-validator';
import { LoginError } from './login-error.js';
import { comparePasswords, findByEmail, findByUsername } from './users.js';

const isLoginAllowAsOptional = (value, { req }) => {
  if (
    !value &&
    typeof value !== 'string' &&
    req.method === 'POST' &&
    req.path === '/login'
  ) {
    return false;
  }
  return true;
};

const isUpdateAllowAsOptional = (value, { req }) => {
  if (
    !value &&
    typeof value !== 'string' &&
    req.method === 'PATCH' &&
    req.path === '/me'
  ) {
    return false;
  }
  return true;
};

export const usernameValidator = body('username')
  .if(isUpdateAllowAsOptional)
  .if(isLoginAllowAsOptional)
  .trim()
  .isLength({ min: 1, max: 64 })
  .withMessage('username must be at least 1 character, max 64 characters');

export const nameValidator = body('name')
  .if(isUpdateAllowAsOptional)
  .trim()
  .isLength({ min: 1, max: 64 })
  .withMessage('name must be at least 1 character, max 64 characters');

export const passwordValidator = body('password')
  .if(isUpdateAllowAsOptional)
  .trim()
  .isLength({ min: 1, max: 256 })
  .withMessage('password must be at least 1 character, max 256 characters');

export const emailValidator = body('email')
  .if(isUpdateAllowAsOptional)
  .if(isLoginAllowAsOptional)
  .trim()
  .isLength({ min: 1, max: 256 })
  .isEmail()
  .withMessage(
    'Email must be valid email and must be at least 1 character, max 256 characters'
  );

export const usernameDoesNotExistValidator = body('username').custom(
  async (username) => {
    const user = await findByUsername(username);

    if (user) {
      return Promise.reject(new Error('username already exists'));
    }
    return Promise.resolve();
  }
);

export const emailDoesNotExistValidator = body('email').custom(
  async (email) => {
    const user = await findByEmail(email);

    if (user) {
      return Promise.reject(new Error('email already exists'));
    }
    return Promise.resolve();
  }
);

export const usernameOrEmailAndPaswordValidValidator = body('password').custom(
  async (password, { req: { body: reqBody } = {} }) => {
    const { username, email } = reqBody;

    if ((!username && !email) || !password) {
      return Promise.reject(new Error('skip'));
    }
    let valid = false;
    try {
      const user = username
        ? await findByUsername(username)
        : await findByEmail(email);
      valid = await comparePasswords(password, user.password);
    } catch (e) {
      console.info(`invalid login attempt for ${username || email}`);
    }

    if (!valid) {
      return Promise.reject(
        new LoginError('username, email or password incorrect')
      );
    }
    return Promise.resolve();
  }
);

export const adminValidator = body('admin')
  .exists()
  .withMessage('admin is required')
  .isBoolean()
  .withMessage('admin must be a boolean')
  .bail();
