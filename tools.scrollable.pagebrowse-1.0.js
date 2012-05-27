/**
 * @license 
 * jQuery Tools 1.2.5 - 1.2.6 / Scrollable pagebrowse plugin v.1.0 dev
 * 
 * @author F.S.Encinas
 * NO COPYRIGHTS OR LICENSES. DO WHAT YOU LIKE.
 * 
 * http://
 *
 * Date: @DATE 
 */
(function($) {

	var t = $.tools.scrollable;

	t.pagebrowse = {

		conf: {
			size: 5,
			opt: null
		}
	};

	// jQuery plugin implementation
	jQuery.fn.pagebrowse = function(conf) {

		var conf = jQuery.extend({}, t.pagebrowse.conf, conf),
			ret;

		this.each(function() {

			var api = jQuery(this).data("scrollable"),
				root = api.getRoot();

			// no longer needed?
			if (api) {
				ret = api;
			}

			var index = 0,
				forward;

			// Methods (alive 1.1 scrollable features)
			jQuery.extend(api, {

				getVisibleItems: function() {
					index = this.getIndex();
					return this.getItems().slice(index, index + conf.size);
				},

				getPageAmount: function() {
					return Math.ceil(this.getSize() / conf.size);
				},

				getPageIndex: function() {
					return Math.ceil(this.getIndex() / conf.size);
				},

				movePage: function(offset, time) {
					forward = offset > 0;

					if (forward) {
						var offset = this.getSize() - (this.getIndex() + conf.size);

						if (this.getIndex() + conf.size >= this.getSize() - conf.size) {
							return this.move(offset, time);
						} else {
							return this.move(conf.size, time);
						}
					} else {
						var offset = this.getSize() - (this.getSize() - this.getIndex());

						if (this.getSize() - this.getIndex() >= this.getSize() - conf.size) {
							return this.move(-offset, time);
						} else {
							return this.move(-conf.size, time);
						}
					}
				},

				setPage: function(page, time, fn) {
					return this.seekTo(page * conf.size, time, fn);
				},

				prevPage: function(time) {
					return this.movePage(-1, time);
				},

				nextPage: function(time) {
					return this.movePage(1, time);
				}
			});

			// @TODO
			// bulletproofing (default): if not size is defined, automatic based on real visible items instead ...
			// conf.size = (!conf.size ? api.getVisibleItems() : conf.size);
			// console.log( api.getVisibleItems().length );
			

			// source navigational elements
			var prevClass = api.getConf().prev,
				nextClass = api.getConf().next,
				disabled  = api.getConf().disabledClass;

			var buttons    = api.getNaviButtons(),
				prevButton = jQuery(buttons).filter(prevClass),
				nextButton = jQuery(buttons).filter(nextClass);

			// unbind original buttons event behaviour
			prevButton.unbind('click', api.prev);
			nextButton.unbind('click', api.next);


			// previous page button
			prevButton.click(function() {
				api.prevPage();
			});

			// next page button
			nextButton.click(function() {
				api.nextPage();
			});

			// initial check
			if (api.getSize() <= conf.size) {
				jQuery(buttons).addClass(disabled);
			}

			// onBeforeSeek callback actions
			api.onBeforeSeek(function(e, i){
				var size = this.getSize();
				setTimeout(function() {
					if (!e.isDefaultPrevented()) {
						prevButton.toggleClass(disabled, i <= 0);
						nextButton.toggleClass(disabled, i >= size - conf.size);
					}
				}, 1);
			});

		});
		
		return conf.api ? ret : this;

	};

})(jQuery);
