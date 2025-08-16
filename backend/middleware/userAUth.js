import jwt from 'jsonwebtoken'


export const userAuth = async (req, res, next) => {
    try {
        const { token } = req.headers
        if (!token) {
            return res.json({
                success: false,
                message: "something went wrong"
            })
        }
        const match = jwt.verify(token, process.env.JWT_SECRET)
        if (!match) {
            return res.json({
                success: false,
                message: "token must be matched"
            })
        }
        req.body.userId = match.id
        next()

    } catch (error) {
        return res.json({
            success: false,
            message: error.message
        })
    }
}