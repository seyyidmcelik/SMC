import Photo from '../model/photoModel.js';

const createPhoto = async (req, res) => {
    try {
        const photo = await Photo.create({
            name: req.body.name,
            description: req.body.description,
        })
        res.status(201).json(photo)
    } catch (error) {
        res.status(500).json({ error: error })
    }
}

const getAllPhotos = async (req, res) => {
    try {
        const allPhotos = await Photo.find({})
        res.status(200).json({ allPhotos })
    } catch (error) {
        res.status(500).json({ error: error })
    }
}

export { createPhoto, getAllPhotos }