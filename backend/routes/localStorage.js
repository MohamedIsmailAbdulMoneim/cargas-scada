/**
 * endpoint - type: post,
 * log messages: every 10 seconds get all json from browser and log them with type debug
 */

const express = require('express')
const { logMessage } = require('../utils/system.utils')
const router = express.Router()


router.post('/examform', (req, res) => {
    const { studentAnswers, studentId } = req.body
    try {
        logMessage(`logging ${studentId} student answers`, '', 'Debug', {
            studentAnswers
        })
        res.json({ msg: "exam answers logged successfuly" })
    } catch (error) {
        logMessage(`Internal error while logging ${studentId} student answers`, `Error: ${error}`, 'Error')
    }

})



module.exports = router