const checker = require('license-checker');
const fs = require('fs');

checker.init({
    start: "./",
    customFormat: {
        "path": false,
        "licenseText": false
    },
    development: false,
    production: true,
    relativeLicensePath: true,
}, function (err, packages) {
    if (err) {
        console.log(err);
    } else {
        const updatedLicenseText = `${getDateString()}\n\n${JSON.stringify(packages, null, 2)}`;
        fs.writeFileSync("./OSS_LICENSES.txt", updatedLicenseText);
    }
});

function getDateString() {
    const date = new Date();
    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.padStart(2, '0');
    const day =`${date.getDate()}`.padStart(2, '0');
    const hours = `${date.getHours()}`.padStart(2, '0');
    const minutes = `${date.getMinutes()}`.padStart(2, '0');
    const seconds = `${date.getSeconds()}`.padStart(2, '0');
    return `Created on ${day}-${month}-${year} at ${hours}:${minutes}:${seconds}`;
}
