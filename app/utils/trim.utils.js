module.exports.strip = function(str) {
      return (str || "").replace(/^\s+|\s+$/g, '');; 
}