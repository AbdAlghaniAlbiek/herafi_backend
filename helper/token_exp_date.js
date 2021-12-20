const dateObj = new Date();
let timeExpiredToken;
const currentDate = dateObj.getHours();
if (currentDate >= 11) {
    timeExpiredToken = currentDate - 10;
} else {
    timeExpiredToken = currentDate + 2;
}

module.exports = timeExpiredToken