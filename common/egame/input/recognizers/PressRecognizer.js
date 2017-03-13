egame.define(Press,["Recognizer","Input","InputUtils"], function(Recognizer,Input,InputUtils) {
/**
 * Press
 * Recognized when the pointer is down for x ms without any movement.
 * @constructor
 * @extends Recognizer
 */
function Press() {
    Recognizer.apply(this, arguments);

    this._timer = null;
    this._input = null;
}

InputUtils.inherit(Press, Recognizer, {
    /**
     * @namespace
     * @memberof Press
     */
    defaults: {
        event: 'press',
        pointers: 1,
        time: 251, // minimal time of the pointer to be pressed
        threshold: 9 // a minimal movement is ok, but keep it low
    },

    getTouchAction: function() {
        return [TOUCH_ACTION_AUTO];
    },

    process: function(input) {
        var options = this.options;
        var validPointers = input.pointers.length === options.pointers;
        var validMovement = input.distance < options.threshold;
        var validTime = input.deltaTime > options.time;

        this._input = input;

        // we only allow little movement
        // and we've reached an end event, so a tap is possible
        if (!validMovement || !validPointers || (input.eventType & (Input.INPUT_END | Input.INPUT_CANCEL) && !validTime)) {
            this.reset();
        } else if (input.eventType & Input.INPUT_START) {
            this.reset();
            this._timer = InputUtils.setTimeoutContext(function() {
                this.state = Recognizer.STATE_RECOGNIZED;
                this.tryEmit();
            }, options.time, this);
        } else if (input.eventType & Input.INPUT_END) {
            return Recognizer.STATE_RECOGNIZED;
        }
        return Recognizer.STATE_FAILED;
    },

    reset: function() {
        clearTimeout(this._timer);
    },

    emit: function(input) {
        if (this.state !== Recognizer.STATE_RECOGNIZED) {
            return;
        }

        if (input && (input.eventType & Input.INPUT_END)) {
            this.manager.emit(this.options.event + 'up', input);
        } else {
            this._input.timeStamp = now();
            this.manager.emit(this.options.event, this._input);
        }
    }
});
    egame.Press = Press;
    return Press;
});
