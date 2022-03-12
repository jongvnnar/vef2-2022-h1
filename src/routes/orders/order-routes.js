import express from 'express';
import { body } from 'express-validator';
import { requireAdmin, requireAuthentication } from '../../auth/passport.js';
import { catchErrors } from '../../lib/catch-errors.js';
import { returnResource } from '../../lib/utils/returnResource.js';
import { validationCheck } from '../../lib/validation-helpers.js';
import {
  sanitizationMiddleware,
  uuidValidator,
  validateResourceExists,
  validateState,
  xssSanitizationMiddleware,
} from '../../lib/validation.js';
import {
  listAllOrdersRoute,
  listOrderRoute,
  listOrderStateRoute,
  postOrderRoute,
  postOrderStateRoute,
} from './orders.js';

export const router = express.Router();

router.get(
  '/',
  requireAuthentication,
  requireAdmin,
  catchErrors(listAllOrdersRoute)
);

const createOrderValidator = [
  body('name')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Nafn má ekki vera tómt'),
  body('name')
    .isLength({ max: 128 })
    .withMessage('Nafn má að hámarki vera 128 stafir'),
  body('cart')
    .isUUID(4)
    .withMessage('Cart verður að vera viðurkennt UUID')
    .bail()
    .custom(async (cart) => {
      const cartExists = await listCart(cart);

      if (!cartExists) {
        return Promise.reject(new Error('Cart does not exist'));
      }
      return Promise.resolve();
    }),
];

// TODO athuga hvort createOrderValidator ætti að vera skipt í tvennt
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
  uuidValidator('orderId'),
  validationCheck,
  validateResourceExists(listOrderRoute),
  validationCheck,
  returnResource
);

router.get(
  '/:orderId/status',
  uuidValidator('orderId'),
  validationCheck,
  validateResourceExists(listOrderStateRoute),
  validationCheck,
  returnResource
);

router.post(
  '/:orderId/status',
  requireAuthentication,
  requireAdmin,
  validateState,
  uuidValidator('orderId'),
  validateResourceExists(listOrderRoute),
  validationCheck,
  catchErrors(postOrderStateRoute)
);
