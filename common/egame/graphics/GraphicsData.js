egame.define("GraphicsData", function() {
    /**
     * A GraphicsData object.
     *
     * @class
     * @memberof egame
     * @param lineWidth {number} the width of the line to draw
     * @param lineColor {number} the color of the line to draw
     * @param lineAlpha {number} the alpha of the line to draw
     * @param fillColor {number} the color of the fill
     * @param fillAlpha {number} the alpha of the fill
     * @param fill      {boolean} whether or not the shape is filled with a colour
     * @param shape     {Circle|Rectangle|Ellipse|Line|Polygon} The shape object to draw.
     */
    function GraphicsData(lineWidth, lineColor, lineAlpha, fillColor, fillAlpha, fill, shape) {
        /*
         * @member {number} the width of the line to draw
         */
        this.lineWidth = lineWidth;

        /*
         * @member {number} the color of the line to draw
         */
        this.lineColor = lineColor;
        /*
         * @member {number} the alpha of the line to draw
         */
        this.lineAlpha = lineAlpha;
        /*
         * @member {number} cached tint of the line to draw
         */
        this._lineTint = lineColor;

        /*
         * @member {number} the color of the fill
         */
        this.fillColor = fillColor;

        /*
         * @member {number} the alpha of the fill
         */
        this.fillAlpha = fillAlpha;

        /*
         * @member {number} cached tint of the fill
         */
        this._fillTint = fillColor;

        /*
         * @member {boolean} whether or not the shape is filled with a colour
         */
        this.fill = fill;

        /*
         * @member {egame.Circle|egame.Rectangle|egame.Ellipse|egame.Line|egame.Polygon} The shape object to draw.
         */
        this.shape = shape;

        /*
         * @member {number} The type of the shape, see the Const.Shapes file for all the existing types,
         */
        this.type = shape.type;
    }

    GraphicsData.prototype.constructor = GraphicsData;

    /**
     * Creates a new GraphicsData object with the same values as this one.
     *
     * @return {egame.GraphicsData}
     */
    GraphicsData.prototype.clone = function() {
        return new GraphicsData(
            this.lineWidth,
            this.lineColor,
            this.lineAlpha,
            this.fillColor,
            this.fillAlpha,
            this.fill,
            this.shape
        );
    };

    /**
     * Destroys the Graphics data.
     */
    GraphicsData.prototype.destroy = function() {
        this.shape = null;
    };

    egame.GraphicsData = GraphicsData;
    return GraphicsData;

});