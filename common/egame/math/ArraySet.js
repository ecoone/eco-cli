egame.define("ArraySet", function() {
    /**
     * ArraySet is a Set data structure (items must be unique within the set) that also maintains order.
     * This allows specific items to be easily added or removed from the Set.
     *
     * Item equality (and uniqueness) is determined by the behavior of `Array.indexOf`.
     *
     * This used primarily by the Input subsystem.
     *
     * @class egame.ArraySet
     * @constructor
     * @param {any[]} [list=(new array)] - The backing array: if specified the items in the list _must_ be unique, per `Array.indexOf`, and the ownership of the array _should_ be relinquished to the ArraySet.
     */
    egame.ArraySet = function(list) {

        /**
         * Current cursor position as established by `first` and `next`.
         * @property {integer} position
         * @default
         */
        this.position = 0;

        /**
         * The backing array.
         * @property {any[]} list
         */
        this.list = list || [];

    };

    egame.ArraySet.prototype = {

        /**
         * Adds a new element to the end of the list.
         * If the item already exists in the list it is not moved.
         *
         * @method egame.ArraySet#add
         * @param {any} item - The element to add to this list.
         * @return {any} The item that was added.
         */
        add: function(item) {

            if (!this.exists(item)) {
                this.list.push(item);
            }

            return item;

        },

        /**
         * Gets the index of the item in the list, or -1 if it isn't in the list.
         *
         * @method egame.ArraySet#getIndex
         * @param {any} item - The element to get the list index for.
         * @return {integer} The index of the item or -1 if not found.
         */
        getIndex: function(item) {

            return this.list.indexOf(item);

        },

        /**
         * Gets an item from the set based on the property strictly equaling the value given.
         * Returns null if not found.
         *
         * @method egame.ArraySet#getByKey
         * @param {string} property - The property to check against the value.
         * @param {any} value - The value to check if the property strictly equals.
         * @return {any} The item that was found, or null if nothing matched.
         */
        getByKey: function(property, value) {

            var i = this.list.length;

            while (i--) {
                if (this.list[i][property] === value) {
                    return this.list[i];
                }
            }

            return null;

        },

        /**
         * Checks for the item within this list.
         *
         * @method egame.ArraySet#exists
         * @param {any} item - The element to get the list index for.
         * @return {boolean} True if the item is found in the list, otherwise false.
         */
        exists: function(item) {

            return (this.list.indexOf(item) > -1);

        },

        /**
         * Removes all the items.
         *
         * @method egame.ArraySet#reset
         */
        reset: function() {

            this.list.length = 0;

        },

        /**
         * Removes the given element from this list if it exists.
         *
         * @method egame.ArraySet#remove
         * @param {any} item - The item to be removed from the list.
         * @return {any} item - The item that was removed.
         */
        remove: function(item) {

            var idx = this.list.indexOf(item);

            if (idx > -1) {
                this.list.splice(idx, 1);
                return item;
            }

        },

        /**
         * Sets the property `key` to the given value on all members of this list.
         *
         * @method egame.ArraySet#setAll
         * @param {any} key - The property of the item to set.
         * @param {any} value - The value to set the property to.
         */
        setAll: function(key, value) {

            var i = this.list.length;

            while (i--) {
                if (this.list[i]) {
                    this.list[i][key] = value;
                }
            }

        },

        /**
         * Calls a function on all members of this list, using the member as the context for the callback.
         *
         * If the `key` property is present it must be a function.
         * The function is invoked using the item as the context.
         *
         * @method egame.ArraySet#callAll
         * @param {string} key - The name of the property with the function to call.
         * @param {...*} parameter - Additional parameters that will be passed to the callback.
         */
        callAll: function(key) {

            var args = Array.prototype.slice.call(arguments, 1);

            var i = this.list.length;

            while (i--) {
                if (this.list[i] && this.list[i][key]) {
                    this.list[i][key].apply(this.list[i], args);
                }
            }

        },

        /**
         * Removes every member from this ArraySet and optionally destroys it.
         *
         * @method egame.ArraySet#removeAll
         * @param {boolean} [destroy=false] - Call `destroy` on each member as it's removed from this set.
         */
        removeAll: function(destroy) {

            if (destroy === undefined) {
                destroy = false;
            }

            var i = this.list.length;

            while (i--) {
                if (this.list[i]) {
                    var item = this.remove(this.list[i]);

                    if (destroy) {
                        item.destroy();
                    }
                }
            }

            this.position = 0;
            this.list = [];

        }

    };

    /**
     * Number of items in the ArraySet. Same as `list.length`.
     *
     * @name egame.ArraySet#total
     * @property {integer} total
     */
    Object.defineProperty(egame.ArraySet.prototype, "total", {

        get: function() {
            return this.list.length;
        }

    });

    /**
     * Returns the first item and resets the cursor to the start.
     *
     * @name egame.ArraySet#first
     * @property {any} first
     */
    Object.defineProperty(egame.ArraySet.prototype, "first", {

        get: function() {

            this.position = 0;

            if (this.list.length > 0) {
                return this.list[0];
            } else {
                return null;
            }

        }

    });

    /**
     * Returns the the next item (based on the cursor) and advances the cursor.
     *
     * @name egame.ArraySet#next
     * @property {any} next
     */
    Object.defineProperty(egame.ArraySet.prototype, "next", {

        get: function() {

            if (this.position < this.list.length) {
                this.position++;

                return this.list[this.position];
            } else {
                return null;
            }

        }

    });

    egame.ArraySet.prototype.constructor = egame.ArraySet;
    return egame.ArraySet;

});