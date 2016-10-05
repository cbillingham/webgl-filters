/*
 * This demo script uses the NanoshopNeighborhood module to apply a
 * "pixel neighborhood" filter on a canvas drawing.
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
    $("#apply-edge-filter-button").click(function () {
        // Filter time.
        renderingContext.putImageData(
            NanoshopNeighborhood.applyFilter(
                renderingContext,
                renderingContext.getImageData(0, 0, canvas.width, canvas.height),
                NanoshopNeighborhood.edgeFinder
            ),
            0, 0
        );
    });

    $("#apply-sharpen-filter-button").click(function () {
        // Filter time.
        renderingContext.putImageData(
            NanoshopNeighborhood.applyFilter(
                renderingContext,
                renderingContext.getImageData(0, 0, canvas.width, canvas.height),
                NanoshopNeighborhood.sharpener
            ),
            0, 0
        );
    });
}());
