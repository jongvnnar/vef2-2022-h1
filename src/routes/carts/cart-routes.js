import express from 'express';
import { catchErrors } from '../../lib/catch-errors.js';
import { returnResource } from '../../lib/utils/returnResource.js';
import { validationCheck } from '../../lib/validation-helpers.js';
import { idValidator, lineInCartValidator, positiveIntValidator, validateResourceExists } from '../../lib/validation.js';
import { deleteCartRoute, deleteLineRoute, getCartRoute, getLineRoute, patchLineRoute, postCartRoute, postLineRoute } from './carts.js';

export const router = express.Router();

router.post('/',
  catchErrors(postCartRoute)
);

router.get('/:cartId',
  // uuid validator
  validationCheck,
  validateResourceExists(getCartRoute),
  validationCheck,
  returnResource
);

router.post('/:cartId',
  // uuid validator
  positiveIntValidator('product'),
  positiveIntValidator('quantity'),
  validationCheck,
  validateResourceExists(getCartRoute),
  // validate product exists - þegar komin db köll fyrir products
  validationCheck,
  catchErrors(postLineRoute)
);

router.delete('/:cartId',
  // uuid validator
  validationCheck,
  validateResourceExists(getCartRoute),
  validationCheck,
  catchErrors(deleteCartRoute)
);

router.get('/:cartId/line/:id',
  // uuid validator
  idValidator('id'),
  validationCheck,
  validateResourceExists(getCartRoute),
  validateResourceExists(getLineRoute),
  lineInCartValidator,
  validationCheck,
  returnResource
);

router.patch('/:cartId/line/:id',
  // uuid validator
  idValidator('id'),
  positiveIntValidator('quantity'),
  validationCheck,
  validateResourceExists(getCartRoute),
  validateResourceExists(getLineRoute),
  lineInCartValidator,
  validationCheck,
  catchErrors(patchLineRoute)
);

router.delete('/:cartId/line/:id',
  // uuid validator
  idValidator('id'),
  validationCheck,
  validateResourceExists(getCartRoute),
  validateResourceExists(getLineRoute),
  lineInCartValidator,
  validationCheck,
  catchErrors(deleteLineRoute)
);
