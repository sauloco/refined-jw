String.prototype.slugify = function (separator = "-") {
    return this
        .toString()
        .normalize('NFKD')                   // split an accented letter in the base letter and the acent
        .replace(/[\u0300-\u036f]/g, '')   // remove all previously split accents
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9 -]/g, '')   // remove all chars not letters, numbers and spaces (to be replaced)
        .trim()
        .replace(/\s+/g, separator);
};