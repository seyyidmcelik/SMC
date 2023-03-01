import express from 'express';
import * as photoController from '../controllers/photoController.js';

const router = express.Router();

router.route('/').post(photoController.createPhoto)
router.route('/pp').post(photoController.createProfilePhoto)
router.route('/tags').get(photoController.getPhotosByTag)
router.route('/').get(photoController.getAllPhotos)
router.route('/edit').post(photoController.updatePhoto)
/* router.route('/:id').get(photoController.getAPhoto)*/
router.route('/:id').delete(photoController.deletePhoto)

export default router