module.exports = {

    genRandomValue: () => {
        const firstValue = String(Math.floor(Math.random() * 9) + 1);
        const secondValue = String(Math.floor(Math.random() * 9) + 1);
        const thirdValue = String(Math.floor(Math.random() * 9) + 1);
        const fourthValue = String(Math.floor(Math.random() * 9) + 1);
        const fifthValue = String(Math.floor(Math.random() * 9) + 1);
        const sixthValue = String(Math.floor(Math.random() * 9) + 1);

        return parseInt(firstValue + secondValue + thirdValue + fourthValue + fifthValue + sixthValue) ;
    }
}