import express from 'express';
import { returnResource } from '../../lib/utils/returnResource.js';
import { validationCheck } from '../../lib/validation-helpers.js';

export const router = express.Router();

// Add params category and search
router.get(
  '/',
  validationCheck,
  validateResourceExists(getMenuRoute),
  validationCheck,
  returnResource
);

router.post('/',
  requireAuthentication,
  requireAdmin,
  catchErrors(postMenuRoute));

router.get(
  '/:id',
  uuidValidator('menuId'),
  validationCheck,
  validateResourceExists(getMenuRoute),
  validationCheck,
  returnResource
);

router.patch(
  '/:id',
  requireAuthentication,
  requireAdmin,
  uuidValidator('cartId'),
  idValidator('id'),
  validationCheck,
  validateResourceExists(getMenuRoute),
  validationCheck,
  catchErrors(patchMenuRoute)
);

router.delete(
  '/:id',
  requireAuthentication,
  requireAdmin,
  idValidator('id'),
  validateResourceExists(getMenuRoute),
  validationCheck,
  catchErrors(deleteMenuRoute)
);
