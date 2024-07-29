const fs = require('fs');

export const deleteFile = (filePath: string) => {
    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
    }
};

export const fileExists = (filePath: string) => {
    return fs.existsSync(filePath);
};
