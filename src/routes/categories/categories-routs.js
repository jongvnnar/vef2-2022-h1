import express from 'express';
import { requireAdmin, requireAuthentication } from '../../auth/passport.js';
import { catchErrors } from '../../lib/catch-errors.js';
import { validationCheck } from '../../lib/validation-helpers.js';
import {
  categoryDoesNotExistValidator,
  categoryValidator,
  idValidator,
  validateResourceExists
} from '../../lib/validation.js';
import {
  deleteCategoryRoute,
  getCategory,
  listCategories,
  patchCategoryRoute,
  postCategoryRoute
} from './categories.js';

export const router = express.Router();

router.get('/', catchErrors(listCategories));

router.post(
  '/',
  requireAuthentication,
  requireAdmin,
  categoryValidator,
  categoryDoesNotExistValidator,
  validationCheck,
  catchErrors(postCategoryRoute)
);

router.patch(
  '/:id',
  requireAuthentication,
  requireAdmin,
  idValidator('id'),
  validateResourceExists(getCategory),
  categoryValidator,
  categoryDoesNotExistValidator,
  validationCheck,
  catchErrors(patchCategoryRoute)
);

router.delete(
  '/:id',
  requireAuthentication,
  requireAdmin,
  idValidator('id'),
  validateResourceExists(getCategory),
  validationCheck,
  catchErrors(deleteCategoryRoute)
);
