import Photo from '../models/photoModel.js';
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs'

const createPhoto = async (req, res) => {
    const result = await cloudinary.uploader.upload(
        req.files.image.tempFilePath,
        {
            use_filename: true,
            folder: 'smc'
        }
    )
    try {
        const { description, tag } = req.body
        await Photo.create({
            description: description.trim(),
            tags: tag.split(' '),
            owner: res.locals.user._id,
            url: result.secure_url,
            image_id: result.public_id,
            isProfilePhoto: false
        })
        fs.unlinkSync(req.files.image.tempFilePath)
        res.status(201).redirect('/users/dashboard')
    } catch (error) {
        res.status(500).json({ error: error })
    }
}

const createProfilePhoto = async (req, res) => {
    const result = await cloudinary.uploader.upload(
        req.files.image.tempFilePath,
        {
            use_filename: true,
            folder: 'smc'
        }
    )
    try {
        await Photo.create({
            owner: res.locals.user._id,
            url: result.secure_url,
            image_id: result.public_id,
            isProfilePhoto: true
        })
        fs.unlinkSync(req.files.image.tempFilePath)
        res.status(201).redirect('/users/dashboard')
    } catch (error) {
        res.status(500).json({ error: error })
    }
}

const getAllPhotos = async (req, res) => {
    try {
        const allPhotos = await Photo.find({ isProfilePhoto: false }).sort({ createdAt: -1 }).populate('owner', 'username')
        const tags = await Photo.aggregate([
            {
                $unwind: '$tags'
            },
            {
                $group: {
                    _id: '$tags',
                    count: { $sum: 1 }
                }
            }
        ]).sort({ count: -1 }).limit(5).exec()
        res.status(200).render('gallery', {
            link: 'gallery',
            allPhotos,
            tags
        })
    } catch (error) {
        res.status(500).json({ error: error })
    }
}

const getPhotosByTag = async (req, res) => {
    const photos = await Photo.find({ tags: '#' + req.query.tag }).sort({ createdAt: -1 }).populate('owner', 'username')
    const tags = await Photo.aggregate([
        {
            $unwind: '$tags'
        },
        {
            $group: {
                _id: '$tags',
                count: { $sum: 1 }
            }
        }
    ]).sort({ count: -1 }).limit(5).exec()
    res.status(200).render('tag', {
        photos,
        tags,
        selectedTag: req.query.tag,
        link: 'gallery'
    })
}

const getAPhoto = async (req, res) => {
    const params = req.params.id
    try {
        const photo = await Photo.findById({ _id: params }).populate('user', 'username')
        res.status(200).json(photo)
    } catch (error) {
        res.status(404).json({ error: error })
    }
}

const deletePhoto = async (req, res) => {
    try {
        const photo = await Photo.findById({ _id: req.params.id })
        const photoId = photo.image_id
        await cloudinary.uploader.destroy(photoId)
        await Photo.findByIdAndRemove({ _id: req.params.id })
        res.status(200).redirect('/users/dashboard')
    } catch (error) {
        res.status(500).json({ error: error })
    }
}

const updatePhoto = async (req, res) => {
    try {
        const photo = await Photo.findById({ _id: req.body._id })
        photo.description = req.body.description
        photo.tags = req.body.tags
        await photo.save()
        res.status(200).json({
            success: true,
            message: 'Photo has updated'
        })
    } catch (error) {
        res.status(500).json({ error })
    }
}

export { createPhoto, createProfilePhoto, getAllPhotos, getAPhoto, getPhotosByTag, deletePhoto, updatePhoto }