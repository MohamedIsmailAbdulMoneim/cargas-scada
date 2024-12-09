const multer = require('multer')
const path = require('path')
const { uploadFiles } = require('../assets/upload.assets')
const { generateRandomChars, encodeRedirectUrl } = require('./system.utils');
const { UPLOADS_DIR } = require('../config');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {

        cb(null, UPLOADS_DIR);  // Save files outside the webroot
    },
    filename: function (req, file, cb) {

        const filesArray = Object.keys(req.files)
        const uniqueName = req.body.random_chars + filesArray[filesArray.length - 1] + generateRandomChars(4) + encodeRedirectUrl(req.body.guest_id) + path.extname(file.originalname).toLowerCase();
        cb(null, uniqueName);
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: process.env.MAX_FILE_SIZE,  // Maximum file size from .env (e.g., 10MB)
    },
    fileFilter: function (req, file, cb) {

        // Validate file types (only allow specific file types)
        const filetypes = /jpeg|jpg|png|pdf|docx/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Invalid file type!'));
        }
    }
})

const uploadMiddleware = upload.fields(uploadFiles);

// async function scanFileWithVirusTotal(filePath) {

//     const fileStream = fs.createReadStream(filePath);
//     const formData = new FormData();
//     formData.append('file', fileStream);

//     try {
//         // Upload the file to VirusTotal for scanning
//         const uploadResponse = await axios.post('https://www.virustotal.com/vtapi/v2/file/scan', formData, {
//             headers: {
//                 'x-apikey': process.env.VIRUSTOTAL_API_KEY,  // Your VirusTotal API Key
//                 'Content-Type': 'application/octet-stream',
//             }
//         });



//         return uploadResponse.data;  // Return the response data
//     } catch (error) {
//         console.error('Error uploading to VirusTotal:', error);
//         throw new Error('VirusTotal scan failed.');
//     }
// }


module.exports = { uploadMiddleware }