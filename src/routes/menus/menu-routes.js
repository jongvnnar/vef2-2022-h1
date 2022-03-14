import express from 'express';
import { requireAdmin, requireAuthentication } from '../../auth/passport.js';
import { catchErrors } from '../../lib/catch-errors.js';
import { returnResource } from '../../lib/utils/returnResource.js';
import { validationCheck } from '../../lib/validation-helpers.js';
import { idValidator, validateResourceExists } from '../../lib/validation.js';
import {
  deleteMenuItemRoute,
  getMenuItem,
  listMenuItems,
  patchMenuItemRoute,
  postMenuItemRoute
} from './menus.js';


export const router = express.Router();

// Add params category and search
router.get(
  '/',
  catchErrors(listMenuItems)
);

router.post('/',
  requireAuthentication,
  requireAdmin,
  catchErrors(postMenuItemRoute));

router.get(
  '/:id',
  idValidator('id'),
  validationCheck,
  validateResourceExists(getMenuItem),
  validationCheck,
  returnResource
);

router.patch(
  '/:id',
  requireAuthentication,
  requireAdmin,
  idValidator('id'),
  validationCheck,
  validateResourceExists(patchMenuItemRoute),
  validationCheck,
  catchErrors(patchMenuItemRoute)
);

router.delete(
  '/:id',
  requireAuthentication,
  requireAdmin,
  idValidator('id'),
  validateResourceExists(deleteMenuItemRoute),
  validationCheck,
  catchErrors(deleteMenuItemRoute)
);
