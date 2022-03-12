import express from 'express';
import { body } from 'express-validator';
import { requireAdmin, requireAuthentication } from '../../auth/passport.js';
import {
  emailDoesNotExistValidator,
  emailValidator,
  nameValidator,
  passwordValidator,
  usernameDoesNotExistValidator,
  usernameOrEmailAndPaswordValidValidator,
  usernameValidator,
} from '../../auth/validation.js';
import { catchErrors } from '../../lib/catch-errors.js';
import { returnResource } from '../../lib/utils/returnResource.js';
import { validationCheck } from '../../lib/validation-helpers.js';
import {
  atLeastOneBodyValueValidator,
  idValidator,
  sanitizationMiddleware,
  uuidValidator,
  validateResourceExists,
  xssSanitizationMiddleware,
} from '../../lib/validation.js';
import {
  currentUserRoute,
  listUser,
  listUsersRoute,
  loginRoute,
  registerRoute,
  updateCurrentUserRoute,
  updateUserRoute,
} from './users.js';

/**
 * Skilgreinir API fyrir nýskráningu, innskráningu notanda, ásamt því að skila
 * upplýsingum um notanda og uppfæra þær.
 */

export const router = express.Router();

const registrationFields = ['username', 'email', 'password', 'name'];
router.post(
  '/register',
  usernameValidator,
  passwordValidator,
  emailValidator,
  usernameDoesNotExistValidator,
  emailDoesNotExistValidator,
  validationCheck,
  xssSanitizationMiddleware(registrationFields),
  sanitizationMiddleware(registrationFields),
  catchErrors(registerRoute)
);

const loginFields = ['username', 'password'];
router.post(
  '/login',
  atLeastOneBodyValueValidator(['username', 'email']),
  usernameValidator,
  passwordValidator,
  emailValidator,
  usernameOrEmailAndPaswordValidValidator,
  validationCheck,
  xssSanitizationMiddleware(loginFields),
  sanitizationMiddleware(loginFields),
  catchErrors(loginRoute)
);

router.get(
  '',
  requireAuthentication,
  requireAdmin,
  catchErrors(listUsersRoute)
);

router.get('/me', requireAuthentication, catchErrors(currentUserRoute));

router.get(
  '/:userId',
  requireAuthentication,
  requireAdmin,
  idValidator('userId'),
  validateResourceExists(listUser),
  validationCheck,
  returnResource
);

const patchUserFields = ['name', 'username', 'email', 'password'];
router.patch(
  '/me',
  requireAuthentication,
  usernameValidator,
  emailValidator,
  nameValidator,
  passwordValidator,
  atLeastOneBodyValueValidator(patchUserFields),
  xssSanitizationMiddleware(patchUserFields),
  sanitizationMiddleware(patchUserFields),
  validationCheck,
  catchErrors(updateCurrentUserRoute)
);

export const patchUserValidator = body('admin')
  .exists()
  .withMessage('admin is required')
  .isBoolean()
  .withMessage('admin must be a boolean')
  .bail()
  .custom(async (_, { req: { user, params } = {} }) => {
    const userToChange = params.userId;
    const currentUser = user.id;
    if (userToChange === currentUser) {
      return Promise.reject(new Error('admin cannot change self'));
    }
    return Promise.resolve();
  });

router.patch(
  '/:userId',
  requireAuthentication,
  requireAdmin,
  uuidValidator('userId'),
  patchUserValidator,
  catchErrors(updateUserRoute)
);
