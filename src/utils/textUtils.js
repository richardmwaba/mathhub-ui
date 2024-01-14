function sentenceCase(text) {
    return text.replace(/\w\S*/g, (txt) => {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
}

const TextUtils = {
    sentenceCase,
};

export default TextUtils;
