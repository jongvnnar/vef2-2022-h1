import express from 'express';
import { catchErrors } from '../../lib/catch-errors.js';
import { returnResource } from '../../lib/utils/returnResource.js';
import { validationCheck } from '../../lib/validation-helpers.js';
import {
  positiveIntValidator,
  validateResourceExists,
} from '../../lib/validation.js';
import {
  deleteCartRoute,
  getCartRoute,
  postCartRoute,
  postLineRoute,
} from './carts.js';

export const router = express.Router();

router.post('/', catchErrors(postCartRoute));

router.get(
  '/:cartId',
  // uuid validator
  validateResourceExists(getCartRoute),
  validationCheck,
  returnResource
);

router.post(
  '/:cartId',
  // uuid validator
  validateResourceExists(getCartRoute),
  positiveIntValidator('productId'),
  // validate product exists - þegar komin db köll fyrir products
  positiveIntValidator('quantity'),
  validationCheck,
  catchErrors(postLineRoute)
);

router.delete(
  '/:cartId',
  // uuid validator
  validateResourceExists(getCartRoute),
  validationCheck,
  catchErrors(deleteCartRoute)
);
