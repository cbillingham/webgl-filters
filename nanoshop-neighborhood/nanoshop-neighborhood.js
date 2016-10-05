/*
 * This is a very simple module that demonstrates rudimentary,
 * pixel-level image processing using a pixel's "neighborhood."
 */
var NanoshopNeighborhood = {

    edgeFinder: function (rgbaNeighborhood) {
        var rTotal = 0,
            gTotal = 0,
            bTotal = 0,
            i;

        for (i = 0; i < 9; i += 1) {
            if (i == 4) { // JD: 4
                rTotal += rgbaNeighborhood[i].r * (8);
                gTotal += rgbaNeighborhood[i].g * (8);
                bTotal += rgbaNeighborhood[i].b * (8);
            }
            else { // JD: 5
                rTotal += rgbaNeighborhood[i].r * (-1);
                gTotal += rgbaNeighborhood[i].g * (-1);
                bTotal += rgbaNeighborhood[i].b * (-1);
            }
        }

        return [ rTotal, gTotal, bTotal, rgbaNeighborhood[4].a ];
    },

    sharpener: function (rgbaNeighborhood) {
        var edge = NanoshopNeighborhood.edgeFinder(rgbaNeighborhood); // JD: 5

        return [ edge[0] * (0.05) + rgbaNeighborhood[4].r,
                 edge[1] * (0.05) + rgbaNeighborhood[4].g,
                 edge[2] * (0.05) + rgbaNeighborhood[4].b,
                 rgbaNeighborhood[4].a ];
    },

    /*
     * Applies the given filter to the given ImageData object,
     * then modifies its pixels according to the given filter.
     *
     * A filter is a function ({r, g, b, a}[9]) that returns another
     * color as a 4-element array representing the new RGBA value
     * that should go in the center pixel.
     */
    applyFilter: function (renderingContext, imageData, filter) {
        // For every pixel, replace with something determined by the filter.
        var result = renderingContext.createImageData(imageData.width, imageData.height),
            i,
            j,
            max,
            iAbove,
            iBelow,
            pixel,
            pixelColumn,
            firstRow,
            lastRow,
            rowWidth = imageData.width * 4,
            sourceArray = imageData.data,
            destinationArray = result.data,

            // A convenience function for creating an rgba object.
            rgba = function (startIndex) {
                return {
                    r: sourceArray[startIndex],
                    g: sourceArray[startIndex + 1],
                    b: sourceArray[startIndex + 2],
                    a: sourceArray[startIndex + 3]
                };
            };

        for (i = 0, max = imageData.width * imageData.height * 4; i < max; i += 4) {
            // The 9-color array that we build must factor in image boundaries.
            // If a particular location is out of range, the color supplied is that
            // of the extant pixel that is adjacent to it.
            iAbove = i - rowWidth;
            iBelow = i + rowWidth;
            pixelColumn = i % rowWidth;
            firstRow = sourceArray[iAbove] === undefined;
            lastRow = sourceArray[iBelow] === undefined;

            pixel = filter([
                // The row of pixels above the current one.
                firstRow ?
                    (pixelColumn ? rgba(i - 4) : rgba(i)) :
                    (pixelColumn ? rgba(iAbove - 4) : rgba(iAbove)),

                firstRow ? rgba(i) : rgba(iAbove),

                firstRow ?
                    ((pixelColumn < rowWidth - 4) ? rgba(i + 4) : rgba(i)) :
                    ((pixelColumn < rowWidth - 4) ? rgba(iAbove + 4) : rgba(iAbove)),

                // The current row of pixels.
                pixelColumn ? rgba(i - 4) : rgba(i),

                // The center pixel: the filter's returned color goes here
                // (based on the loop, we are at least sure to have this).
                rgba(i),

                (pixelColumn < rowWidth - 4) ? rgba(i + 4) : rgba(i),

                // The row of pixels below the current one.
                lastRow ?
                    (pixelColumn ? rgba(i - 4) : rgba(i)) :
                    (pixelColumn ? rgba(iBelow - 4) : rgba(iBelow)),

                lastRow ? rgba(i) : rgba(iBelow),

                lastRow ?
                    ((pixelColumn < rowWidth - 4) ? rgba(i + 4) : rgba(i)) :
                    ((pixelColumn < rowWidth - 4) ? rgba(iBelow + 4) : rgba(iBelow))
            ]);

            // Apply the color that is returned by the filter.
            for (j = 0; j < 4; j += 1) {
                destinationArray[i + j] = pixel[j];
            }
        }

        return result;
    }
};
