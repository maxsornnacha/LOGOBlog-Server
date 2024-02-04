
function isBase64(value) {
    // Regular expression to match the base64 pattern
    const base64Regex = /^[A-Za-z0-9+/=]+$/;
  
    // Check if the value is a string and matches the base64 pattern
    return base64Regex.test(value);
  }
 
module.exports = {isBase64}