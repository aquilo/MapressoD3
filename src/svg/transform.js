/* globals mapressod3 */

// SVG Translation
mapressod3.svg.translate = function(dx, dy) {
    return 'translate(' + [dx, dy] + ')';
};

// SVG Scale
mapressod3.svg.scale = function(sx, sy) {
    if (arguments.length < 2) { sy = sx; }
    return 'scale(' + [sx, sy] + ')';
};