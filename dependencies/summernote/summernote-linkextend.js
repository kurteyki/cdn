/* https://github.com/RichardSquires/summernote-link-editor
 * Version: 1.0.0
 */
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
            linkEditor: {
                email: "Email",
                address: "Email address",
                subject: "Subject line",
                body: "Body text"
            }
        }
    });

    $.extend($.summernote.options, {
        linkEditor: {
            tabsEnabled: ['link', 'extra']
        }
    });

    $.extend($.summernote.plugins, {
        'linkEditor': function (context) {

            var self = this,
            ui = $.summernote.ui,
            $note = context.layoutInfo.note,
            $editor = context.layoutInfo.editor,
            $editable = context.layoutInfo.editable,
            options = context.options,
            lang = options.langInfo;

            /*override keyboard mapping for links*/
            if(shouldInitialize()) {
                options.keyMap.pc['CTRL+K'] = 'linkEditor.show';
                options.keyMap.mac['CMD+K'] = 'linkEditor.show';
            }

            context.memo('button.advLink', function () {
                var button = ui.button({
                    contents: ui.icon(options.icons.link),
                    container: context.layoutInfo.editor[0],
                    tooltip: lang.link.link,
                    click: function () {
                        context.invoke('linkEditor.show');
                    }
                });
                return button.render();
            });

            context.memo('button.editAdvLink', function () {
                var button = ui.button({
                    contents: ui.icon(options.icons.link),
                    container: context.layoutInfo.editor[0],
                    tooltip: lang.link.edit,
                    click: function () {
                        context.invoke('linkEditor.show');
                    }
                });
                return button.render();
            });

            this.initialize = function () {

                /*create dialog*/
                var $container = options.dialogsInBody ? $(document.body) : $editor;

                var body = '';

                body += /*link tab*/
                '<div class="tab-content note-tab-content note-tab-link">' +
                /*link title attribute*/
                '<div class="note-form-group form-group note-group-link-title">' +
                '<div class="input-group note-input-group col-xs-12 col-sm-9">' +
                '<label class="control-label note-form-label col-sm-3">' + lang.link.textToDisplay + '</label>' +
                '<input class="note-link-title form-control note-form-control note-input" type="text">' +
                '</div>' +
                '</div>' +

                /*link href*/
                '<div class="note-form-group form-group note-group-link-href">' +
                '<div class="input-group note-input-group col-xs-12 col-sm-9">' +
                '<label class="control-label note-form-label col-xs-3">' + lang.link.url + '</label>' +
                '<input class="note-link-href form-control note-form-control note-input" type="text">' +
                '</div>' +
                '</div>' +
                /*link target open in new window checkbox*/
                '<div class="note-form-group form-group note-group-link-target-protocol" >' +
                '<div class="input-group note-input-group checkbox col-xs-12 col-sm-9">' +
                '<label>' +
                '<input class="note-link-target" role="checkbox" type="checkbox" />' +
                lang.link.openInNewWindow +
                '</label>' +
                '</div>' +
                /*protocol checkbox*/
                '<div class="input-group note-input-group checkbox col-xs-12 col-sm-9">' +
                '<label>' +
                '<input class="note-link-protocol" role="checkbox" type="checkbox" checked="" aria-checked="true" />' +
                lang.link.useProtocol +
                '</label>' +
                '</div>' +
                '</div>' +
                /* closing div for tab content*/
                '</div>';

                /*footer button*/
                var footerButton = '<button class="btn btn-primary note-btn note-btn-primary note-advLink-btn" disabled>' + lang.link.insert + '</button>';

                /*dialog*/
                this.$dialog = ui.dialog({
                    className: 'adv-link-dialog',
                    title: lang.link.insert,
                    body: body,
                    footer: footerButton,
                    callback: function($dialog) {

                        /*generate email link on the fly */
                        var $title = $dialog.find('.note-link-title');
                        var $url = $dialog.find('.note-link-href');
                        
                        /*bind url to title inputs and enable/disable save button*/
                        var checkFormValid = function() {
                            var isDisabled = $title.val().length === 0 || $url.val().length === 0
                            $dialog.find('.note-btn.note-advLink-btn').prop('disabled', isDisabled)
                        }

                        $url.on('input paste propertychange',function() {
                            var newText = $url.val()
                            var oldText = $title.val();
                            if(!$title.val() || $title.val() === newText.substring(0,newText.length - 1)|| oldText.substring(0, oldText.length - 1) === newText) {
                                $title.val(newText);
                            }
                            checkFormValid();
                        });

                        $url.on('input paste propertychange',function() {
                            var newText = $url.val()
                            var oldText = $title.val();
                            if(!oldText || oldText === newText.substring(0,newText.length - 1)|| oldText.substring(0, oldText.length - 1) === newText) {
                                $title.val(newText);
                            }
                            checkFormValid();
                        });

                        $title.on('input paste propertychange', checkFormValid);
                    }
                }).render().appendTo($container);

            };

            this.destroy = function () {
                ui.hideDialog(this.$dialog);
                this.$dialog.remove();
            };

            this.bindEnterKey = function ($input, $btn) {
                $input.on('keypress', function (e) {
                    if (e.keyCode === 13) $btn.trigger('click');
                });
            };

            this.show = function () {
                // ui.showDialog(self.$dialog);
                var linkInfo = context.invoke('editor.getLinkInfo');
                this.showLinkDialog(linkInfo).then(function (linkInfo) {
                    ui.hideDialog(self.$dialog);

                    /*validate url (mirrors standard linking for consistency - v0.8.18)*/
                    if (linkInfo.url && typeof linkInfo.url === 'string') {
                        linkInfo.url = linkInfo.url.trim();

                        if (options.onCreateLink) {
                            linkUrl = options.onCreateLink(linkUrl);
                        } else if(linkInfo.checkProtocol) {
                            /*if url doesn't have any protocol and not even a relative or a label, use http:// as default*/
                            linkInfo.url = /^([A-Za-z][A-Za-z0-9+-.]*\:|#|\/)/.test(linkInfo.url) ? linkInfo.url : options.defaultProtocol.concat(linkInfo.url);
                        }
                    }

                    // link = `<a href="${linkInfo.url}">${linkInfo.text}</a>`;
                    // $note.summernote('editor.getLastRange').select();
                    // $note.summernote('pasteHTML', link);

                    $note.summernote('createLink', linkInfo);                                      

                });
            };

            this.showLinkDialog = function (linkInfo) {
                return $.Deferred(function (deferred) {
                    var $title = self.$dialog.find('.note-link-title'),
                    $url = self.$dialog.find('.note-link-href'),
                    $newWindow = self.$dialog.find('.note-link-target'),
                    $defaultProtocol = self.$dialog.find('.note-link-protocol'),
                    $editBtn = self.$dialog.find('.note-advLink-btn');


                    /*dialog ui functions*/
                    ui.onDialogShown(self.$dialog, function () {
                        context.triggerEvent('dialog.shown');
                        $editBtn.off();
                        $editBtn.one('click', function (e) {
                            // alert($url.val());
                            e.preventDefault();
                            deferred.resolve({
                                range: linkInfo.range,
                                text: $title.val(),
                                url: $url.val(),
                                isNewWindow: $newWindow.prop('checked'),
                                checkProtocol: $defaultProtocol.prop('checked')
                            })
                        });

                        /*setup form data from html*/
                        $title.val(linkInfo.text);
                        if(linkInfo.url) {
                            $url.val(linkInfo.url);
                            $newWindow.prop('checked', linkInfo.isNewWindow);                            
                        } else {
                            /*if there is no link then reset form*/
                            $url.val("");
                            $newWindow.prop('checked', false);
                        }
                        
                        /*Validate link editor form on load */
                        $title.trigger('input');

                        self.bindEnterKey($editBtn);
                    });


                    ui.onDialogHidden(self.$dialog, function () {
                        $editBtn.off('click');
                        if (deferred.state() === 'pending') deferred.reject();
                    });


                    ui.showDialog(self.$dialog);
                    
                });
            };

            /*check we have enough tabs to be useful*/
            function shouldInitialize() {
                return options.linkEditor;
            }

            this.shouldInitialize = shouldInitialize;
        }
    });
}));