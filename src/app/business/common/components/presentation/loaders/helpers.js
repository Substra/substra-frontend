export default (color, opacity) => {
    let newColor = color;

    if (newColor[0] === '#') {
        newColor = newColor.slice(1);
    }

    if (newColor.length === 3) {
        let res = '';
        newColor.split('').forEach((c) => {
            res += c;
            res += c;
        });
        newColor = res;
    }

    const rgbValues = newColor.match(/.{2}/g).map(hex => parseInt(hex, 16)).join(', ');
    return `rgba(${rgbValues}, ${opacity})`;
};
