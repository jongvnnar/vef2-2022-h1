import express from 'express';
import { requireAdmin, requireAuthentication } from '../../auth/passport.js';
import { catchErrors } from '../../lib/catch-errors.js';
import { validationCheck } from '../../lib/validation-helpers.js';
import {
  createOrderValidator,
  sanitizationMiddleware,
  xssSanitizationMiddleware,
} from '../../lib/validation.js';
import { listAllOrdersRoute, postOrderRoute } from './orders.js';

export const router = express.Router();

router.get(
  '/',
  requireAuthentication,
  requireAdmin,
  catchErrors(listAllOrdersRoute)
);

router.post(
  '/',
  createOrderValidator,
  xssSanitizationMiddleware(['cart', 'name']),
  validationCheck,
  sanitizationMiddleware(['cart', 'name']),
  catchErrors(postOrderRoute)
);
