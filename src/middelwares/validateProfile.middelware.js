const validateProfile = (req, res, next) => {
    const imageQuery = req.originalUrl.split('/').pop()

    if (imageQuery !== req.user.image_small && imageQuery !== req.user.image_big) {
        return res.status(404).json({
            error: true,
            message: 'Imagen no encontrada'
        })
    }

    next()
}

export default validateProfile