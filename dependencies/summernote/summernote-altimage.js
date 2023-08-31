(function (factory) {
	if (typeof define === 'function' && define.amd) {
		define(['jquery'], factory);
	} else if (typeof module === 'object' && module.exports) {
		module.exports = factory(require('jquery'));
	} else {
		factory(window.jQuery);
	}
}(function ($) {
	$.extend(true, $.summernote.lang, {
		'en-US': {
			imageTitle: {
				edit: 'Edit',
				title: 'Edit Alternative Text',
				titleLabel: 'Title',
				altLabel: 'Alternative Text',

			}
		}
	});

	$.extend($.summernote.plugins, {
		'imageTitle': function (context) {
			var self = this;

			var ui = $.summernote.ui;
			var $note = context.layoutInfo.note;
			var $editor = context.layoutInfo.editor;
			var $editable = context.layoutInfo.editable;

			if (typeof context.options.imageTitle === 'undefined') {
				context.options.imageTitle = {};
			}

			if (typeof context.options.imageTitle.OpttitleField === 'undefined') {
				context.options.imageTitle.OpttitleField = false;
			}

			var options = context.options;
			var lang = options.langInfo;

			context.memo('button.imageTitle', function () {
				/* https://github.com/summernote/summernote/issues/2700 */
				var button = ui.button({
					contents: ui.icon(options.icons.pencil),
					tooltip: lang.imageTitle.edit,
					container: '.note-editor.note-frame',
					click: function (e) {
						context.invoke('imageTitle.show');
					}
				});

				return button.render();
			});

			this.initialize = function () {

				var $container = options.dialogsInBody ? $(document.body) : $editor;

				var body = '';

				if (options.imageTitle.OpttitleField) {
					body += '<div class="form-group">' +
					'<label>' + lang.imageTitle.titleLabel + '</label>' +
					'<input class="note-image-title-text form-control" type="text" />' +
					'</div>';
				}

				body += '<div class="form-group">' +
				'<label>' + lang.imageTitle.altLabel + '</label>' +
				'<input class="note-image-alt-text form-control" type="text" />' +
				'</div>';

				var footer = '<button class="btn btn-primary note-image-title-btn">' + lang.imageTitle.edit + '</button>';

				this.$dialog = ui.dialog({
					title: lang.imageTitle.title,
					body: body,
					footer: footer
				}).render().appendTo($container);
			};

			this.destroy = function () {
				ui.hideDialog(this.$dialog);
				this.$dialog.remove();
			};

			this.bindEnterKey = function ($input, $btn) {
				$input.on('keypress', function (event) {
					if (event.keyCode === 13) {
						$btn.trigger('click');
					}
				});
			};

			this.show = function () {
				var $img = $($editable.data('target'));
				var imgInfo = {
					imgDom: $img,
					title: $img.attr('title'),
					alt: $img.attr('alt'),
				};
				// console.info($editable.data('target'));
				this.showLinkDialog(imgInfo).then(function (imgInfo) {
					ui.hideDialog(self.$dialog);
					var $img = imgInfo.imgDom;

					if (imgInfo.alt) {
						$img.attr('alt', imgInfo.alt);
					}
					else {
						$img.removeAttr('alt');
					}

					if (imgInfo.title) {
						$img.attr('title', imgInfo.title);
					}
					else {
						$img.removeAttr('title');
					}

					$note.val(context.invoke('code'));
					$note.change();
				});
			};

			this.showLinkDialog = function (imgInfo) {

				console.info(imgInfo);
				
				return $.Deferred(function (deferred) {
					var $imageTitle = (options.imageTitle.OpttitleField) ? self.$dialog.find('.note-image-title-text') : null,
					$imageAlt = self.$dialog.find('.note-image-alt-text'),
					$editBtn = self.$dialog.find('.note-image-title-btn');

					ui.onDialogShown(self.$dialog, function () {
						context.triggerEvent('dialog.shown');

						$editBtn.click(function (event) {
							event.preventDefault();
							deferred.resolve({
								imgDom: imgInfo.imgDom,
								title: (options.imageTitle.OpttitleField) ? $imageTitle.val() : $imageAlt.val(),
								alt: $imageAlt.val(),
							});
						});

						if (options.imageTitle.OpttitleField) {
							$imageTitle.val(imgInfo.title).trigger('focus');
							self.bindEnterKey($imageTitle, $editBtn);
						}

						$imageAlt.val(imgInfo.alt).trigger('focus');
						self.bindEnterKey($imageAlt, $editBtn);
					});

					ui.onDialogHidden(self.$dialog, function () {
						$editBtn.off('click');

						if (deferred.state() === 'pending') {
							deferred.reject();
						}
					});

					ui.showDialog(self.$dialog);
				});
			};
		}
	});
}));