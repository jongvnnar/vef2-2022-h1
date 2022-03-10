import express from 'express';
import { requireAdmin, requireAuthentication } from '../../auth/passport.js';
import { catchErrors } from '../../lib/catch-errors.js';
import { returnResource } from '../../lib/utils/returnResource.js';
import { validationCheck } from '../../lib/validation-helpers.js';
import {
  createOrderValidator,
  sanitizationMiddleware,
  uuidValidator,
  validateResourceExists,
  xssSanitizationMiddleware,
} from '../../lib/validation.js';
import {
  listAllOrdersRoute,
  listOrderRoute,
  postOrderRoute,
} from './orders.js';

export const router = express.Router();

router.get(
  '/',
  requireAuthentication,
  requireAdmin,
  catchErrors(listAllOrdersRoute)
);

// TODO athuga hvort createOrderValidator ætti að vera skipt í tvennt og hvort ég ætti að færa hann
// inn hingað.
router.post(
  '/',
  createOrderValidator,
  xssSanitizationMiddleware(['cart', 'name']),
  validationCheck,
  sanitizationMiddleware(['cart', 'name']),
  catchErrors(postOrderRoute)
);

router.get(
  '/:orderId',
  requireAuthentication,
  requireAdmin,
  uuidValidator('orderId'),
  validationCheck,
  validateResourceExists(listOrderRoute),
  validationCheck,
  returnResource
);
