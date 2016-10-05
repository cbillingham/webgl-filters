/*
 * This demo script uses the Nanoshop module to apply a simple
 * filter on a canvas drawing.
 */

(function () {
    var canvas = $("#picture")[0],
        renderingContext = canvas.getContext("2d")
        stark = new Image();

    stark.src = "../tonystarkpixar.jpg";

    $(window).load(function() {
        renderingContext.drawImage(stark, 0, 0);
    });

    // Set a little event handler to apply the filter.

    $(window).load(function() {

        //filter inverses every pixel's color
        $("#apply-inverse-filter-button").click(function () {
            // Filter time.
            renderingContext.putImageData(
                Nanoshop.applyFilter(
                    renderingContext.getImageData(0, 0, canvas.width, canvas.height),
                    // This is a basic "darkener." // JD: 1
                    function (r, g, b, a) { // JD: 2

                        return [255-r, 255-g, 255-b, a]; // JD: 3
                    }
                ),
                0, 0
            );
        });

        //filter creates a purely black and white image
        $("#apply-bw-filter-button").click(function () {
            // Filter time.
            renderingContext.putImageData(
                Nanoshop.applyFilter(
                    renderingContext.getImageData(0, 0, canvas.width, canvas.height),
                    // This is a basic "darkener."
                    function (r, g, b, a) {
                        var average = (r + g + b) / 3;
                        if (average < 128) {
                            return [0, 0, 0, a];
                        }
                        return [255, 255, 255, a];
                    }
                ),
                0, 0
            );
        });

    });

}());