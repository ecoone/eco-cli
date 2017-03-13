/**
 * jQuery Unveil
 * A very lightweight jQuery plugin to lazy load images
 * http://luis-almeida.github.com/unveil
 *
 * Licensed under the MIT license.
 * Copyright 2013 Luís Almeida
 * https://github.com/luis-almeida
 * 图片懒加载
 * @example
 * $("img").unveil(); 
 * $(window).trigger("scroll");  //除了最开始首个屏幕的图片默认替换成真实图片，其他的展示都需要scroll，有些地方需要手动scroll一下
 */
eco.define("unveil", ['zepto','zSelector'], function(Zepto) {

    (function($) {

        $.fn.unveil = function(threshold, callback) {

            var $w = $(window),
                th = threshold || 0,
                retina = window.devicePixelRatio > 1,
                attrib = retina? "data-src-retina" : "data-src",
                images = this,
                loaded;

            this.one("unveil", function() {
                var source = this.getAttribute(attrib);
                source = source || this.getAttribute("data-src");
                var srcImg = this.getAttribute('src');
                if(srcImg == source) return;
                if (source) {
                    this.setAttribute("src", source);
                    if (typeof callback === "function") callback.call(this);
                }
            });

            function unveil() {
                var inview = images.filter(function() {
                    var $e = $(this);
                    if ($e.is(":hidden")) return;

                    var wt = $w.scrollTop(),
                        wb = wt + $w.height(),
                        et = $e.offset().top,
                        eb = et + $e.height();

                    return eb >= wt - th && et <= wb + th;
                });
                loaded = inview.trigger("unveil");
                images = images.not(loaded);
            }

            $w.on("scroll.unveil resize.unveil lookup.unveil", unveil);

            unveil();

            return this;
        };

    })(Zepto);

    return Zepto;
});


