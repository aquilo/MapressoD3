    // Expose the package components
    if (typeof module === 'object' && module.exports) {
        // The package is loaded as a node module
        this.d3 = require('d3');
        module.exports = mapressod3;
    } else {
        // The file is loaded in the browser.
        window.mapressod3 = mapressod3;
    }
}();