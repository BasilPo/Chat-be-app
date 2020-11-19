module.exports = {
  isValidStr(value, { minLength = 2 } = {}) {
    return (
      typeof value === "string" &&
      value.trim().length > 0 &&
      value.length >= minLength
    );
  },
  isValidEmail(value) {
    return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value);
  },
};
