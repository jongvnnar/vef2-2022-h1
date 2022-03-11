import express from 'express';
import { requireAdmin, requireAuthentication } from '../../auth/passport.js';
import {
  emailDoesNotExistValidator,
  passwordValidator,
  usernameAndPaswordValidValidator,
  usernameDoesNotExistValidator,
  usernameValidator,
} from '../../auth/validation.js';
import { catchErrors } from '../../lib/catch-errors.js';
import { returnResource } from '../../lib/utils/returnResource.js';
import { validationCheck } from '../../lib/validation-helpers.js';
import {
  idValidator,
  sanitizationMiddleware,
  validateResourceExists,
  xssSanitizationMiddleware,
} from '../../lib/validation.js';
import {
  currentUserRoute,
  listUser,
  listUsersRoute,
  loginRoute,
  registerRoute,
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
  usernameValidator,
  passwordValidator,
  usernameAndPaswordValidValidator,
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
