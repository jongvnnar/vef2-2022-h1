import { dirname, extname, join } from 'path';
import { fileURLToPath } from 'url';
import { createSchema, dropSchema, end, insertData, query } from './lib/db.js';
import { readDir, stat } from './lib/fs-helpers.js';
import { listImages, uploadImage } from './lib/utils/cloudinary.js';
const IMG_DIR = './../data/img';

const path = dirname(fileURLToPath(import.meta.url));
/**
 * Möppun á milli skráarnafns myndar og slóðar á Cloudinary
 * <skráarnafn> => <url>
 */
const imageCloudinaryUrl = new Map();

async function images() {
  const imagesOnDisk = await readDir(join(path, IMG_DIR));
  const filteredImages = imagesOnDisk.filter(
    (i) =>
      extname(i).toLowerCase() === '.jpg' || extname(i).toLowerCase() === '.png'
  );

  if (filteredImages.length === 0) {
    console.warn('No images to upload');
    return;
  }

  const cloudinaryImages = await listImages();
  console.info(`${cloudinaryImages.length} images in Cloudinary`);
  console.log(cloudinaryImages);
  for (const image of filteredImages) {
    let cloudinaryUrl = '';
    const imgPath = join(path, IMG_DIR, image);
    const imgSize = (await stat(imgPath)).size;
    const uploaded = cloudinaryImages.find((i) => i.bytes === imgSize);

    if (uploaded) {
      cloudinaryUrl = uploaded.secure_url;
      console.info(`${imgPath} already uploaded to Cloudinary`);
    } else {
      const upload = await uploadImage(imgPath);
      cloudinaryUrl = upload.secure_url;
      console.info(`${imgPath} uploaded to Cloudinary`);
    }

    imageCloudinaryUrl.set(image, cloudinaryUrl);
  }
}

async function updateProductUrls() {
  const q = `
    UPDATE menu.products
    SET image = $1
    WHERE image = $2
    RETURNING image
  `;
  for (const [key, value] of imageCloudinaryUrl.entries()) {
    const newImg = await query(q, [value, key]);

    if (newImg.rowCount !== 0 && newImg.rows[0].image !== value) {
      throw new Error(
        `update failed for image ${key}, cloudinary url: ${value}`
      );
    }
  }
}

async function create() {
  try {
    await images();
    console.info('images uploaded');
  } catch (e) {
    console.error(e);
    console.info('images not uploaded');
  }

  const drop = await dropSchema();

  if (drop) {
    console.info('schema dropped');
  } else {
    console.info('schema not dropped, exiting');
    process.exit(-1);
  }

  const result = await createSchema();

  if (result) {
    console.info('schema created');
  } else {
    console.info('schema not created');
  }

  const insert = await insertData();

  if (insert) {
    console.info('data inserted');
  } else {
    console.info('data not inserted');
  }

  try {
    await updateProductUrls();
    console.info('product image urls updated');
  } catch (e) {
    console.error(e);
    console.info('product image urls not updated');
  }

  await end();
}

create().catch((err) => {
  console.error('Error creating running setup', err);
});
