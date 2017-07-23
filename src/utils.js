function toArray(val) {
    if (val === undefined) {
        return [];
    }
    return Array.isArray(val) ? val : [val];
};


function isString(val) {
    return (Object.prototype.toString.call(val) === '[object String]');
}


function enforceString(val, msg) {
    if (!isString(val)) {
        throw new Error(msg);
    }
}


module.exports = {
    toArray,
    isString,
    enforceString,
};