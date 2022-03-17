import { body, param } from 'express-validator';
import xss from 'xss';
import { listCartLines } from '../routes/carts/carts.js';
import { findCategoryByTitle } from '../routes/categories/categories.js';
import { resourceExists } from './validation-helpers.js';
// Endurnýtum mjög líka validation

export function idValidator(idName) {
  return [
    param(idName)
      .isInt({ min: 1 })
      .withMessage(`${idName} must be an integer larger than 0`),
  ];
}

export function positiveIntValidator(fieldName) {
  return [
    body(fieldName)
      .isInt({ min: 1 })
      .withMessage(`${fieldName} must be an integer larger than 0`),
  ];
}

export const lineInCartValidator = param('cartId').custom(
  async (cartId, { req: { params } = {} }) => {
    const { id } = params;

    const lines = await listCartLines(cartId);
    const line = lines.find((l) => l.id === Number(id));

    if (!line) {
      return Promise.reject(new Error('line not in specified cart'));
    }
    return Promise.resolve();
  }
);

export const categoryDoesNotExistValidator = body('title').custom(
  async (title) => {
    const category = await findCategoryByTitle(title);

    if (category) {
      return Promise.reject(new Error('category already exists'));
    }
    return Promise.resolve();
  }
);

export function uuidValidator(idName) {
  return [
    param(idName).isUUID(4).withMessage(`${idName} must be a valid UUID`),
  ];
}

export const categoryValidator = [
  body('title')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Titill má ekki vera tómur'),
  body('title')
    .isLength({ max: 128 })
    .withMessage('Titill má að hámarki vera 128 stafir'),
];
export const menuItemValidator = [
  body('title')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Titill má ekki vera tómur'),
  body('title')
    .isLength({ max: 128 })
    .withMessage('Titill má að hámarki vera 128 stafir'),
  body('price')
    .isInt({ min: 1 })
    .withMessage('price must be an integer larger than 0'),
  body('description')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Titill má ekki vera tómur'),
  body('title')
    .isLength({ max: 255 })
    .withMessage('sloð á mynd má að hámarki vera 255 stafir'),
  body('category')
    .isInt({ min: 1 })
    .withMessage('category must be an integer larger than 0'),
];

// Viljum keyra sér og með validation, ver gegn „self XSS“
export function xssSanitizationMiddleware(fields) {
  return fields.map((field) => body(field).customSanitizer((v) => xss(v)));
}

export function sanitizationMiddleware(fields) {
  return fields.map((field) => body(field).trim().escape());
}

export function atLeastOneBodyValueValidator(fields) {
  return body().custom(async (value, { req }) => {
    const { body: reqBody } = req;

    let valid = false;

    for (let i = 0; i < fields.length; i += 1) {
      const field = fields[i];

      if (field in reqBody && reqBody[field] != null) {
        valid = true;
        break;
      }
    }

    if (!valid) {
      return Promise.reject(
        new Error(`require at least one value of: ${fields.join(', ')}`)
      );
    }
    return Promise.resolve();
  });
}

export function validateResourceExists(fetchResource) {
  return [
    param('id').custom(resourceExists(fetchResource)).withMessage('not found'),
  ];
}

export function validateResourceNotExists(fetchResource) {
  return [
    param('id')
      .not()
      .custom(resourceExists(fetchResource))
      .withMessage('already exists'),
  ];
}

export const validateState = body('status')
  .isIn(['NEW', 'PREPARE', 'COOKING', 'READY', 'FINISHED'])
  .withMessage(
    "Status must be one of 'NEW', 'PREPARE','COOKING', 'READY', 'FINISHED'"
  );

const MIMETYPES = ['image/jpeg', 'image/png', 'image/gif'];

function validateImageMimetype(mimetype) {
  return MIMETYPES.indexOf(mimetype.toLowerCase()) >= 0;
}

export const imageValidator = body('image').custom(
  async (image, { req = {} }) => {
    const { file: { path, mimetype } = {} } = req;

    if (!path && !mimetype && req.method === 'PATCH') {
      return Promise.resolve();
    }

    if (!path && !mimetype) {
      return Promise.reject(new Error('image is required'));
    }

    if (!validateImageMimetype(mimetype)) {
      const error =
        `Mimetype ${mimetype} is not legal. ` +
        `Only ${MIMETYPES.join(', ')} are accepted`;
      return Promise.reject(new Error(error));
    }

    return Promise.resolve();
  }
);
