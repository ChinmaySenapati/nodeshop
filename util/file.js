const fs = require('fs');

const deleteFile = (filePath) => {
    fs.unlink(filePath, (err) => {
        if (err) {
            console.error(`Error deleting file: ${filePath}`);
            throw err;
        }
        console.log(`Deleted file: ${filePath}`);
    });
}

module.exports = deleteFile;