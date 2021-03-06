/*
Pencil - simple HTML5 WISIWYG.

Author: Ilya Shalyapin, ishalyapin@gmail.com

Browser compatibility: Firefox, Opera, Chome.

Requirements:
    - jQuery (http://jquery.com/)
    - JQuery Form Plugin (http://malsup.com/jquery/form/)
*/


(function($){

    $.fn.pencil = function (options) {
        var editor = new Pencil(this, options);
        editor.visualMode();
        return editor;
    };

    function Pencil(textarea, options){
        var _this = this;
        this.$textarea = $(textarea);

        if (options==undefined){
            this.options = {};
        }else{
            this.options = options;
        }
        this.options.uploaderUrl = this.options.uploaderUrl || '/upload/';

        this.$textarea.wrap('<div class="pencil_wrapper"></div>')
        this.$wrapper = this.$textarea.parent('.pencil_wrapper');
        this.$wrapper.width(this.$textarea.width());

        $(textarea).after('<div class="pencil_div" style="overflow-y: scroll;"></div>');
        this.$div = this.$textarea.siblings('.pencil_div');
        this.$div.attr('contenteditable','true');
        this.$div.html(this.$textarea.html());
        this.$div.width(this.$textarea.width());
        this.$div.height(this.$textarea.height());
        this.$div.blur(function(){
            if (_this.mode == 'visual'){
                _this.$textarea.val(_this.$div.html());
            }
        });

        this.$div.bind('keyup click', function(e) {
            var $node = $(_this.getSelectionStartNode());
            if ($node.is('a')) {

                _this.showModal('link-form');
                $('.pencil_modal [name=name]').val($node.text());
                $('.pencil_modal [name=url]').val($node.attr('href'));

                $('.pencil_modal_submit').click(function(){
                    var name = $('.pencil_modal [name=name]').val();
                    var url = $('.pencil_modal [name=url]').val();
                    $node.text(name);
                    $node.attr('href', url);
                    _this.closeModal();    
                });            
            }
        });

        this.$textarea.before(this.getTemplate('toolbar'));
        this.$div.after(this.getTemplate('switch'));

        this.templates['image-form'] = this.templates['image-form'].replace('{{UPLOADER_URL}}', this.options.uploaderUrl)

        // AJAX image uploading
        $('.pencil_modal input[name=file]').live('change', function(){
           var $form = $('.pencil_modal form');

            $('input[name=url]', $form).val('');
            $('.pencil_modal_throbber', $form).remove();
            $('.pencil_modal_thumb', $form).remove();

            var throbber = '<div class="pencil_modal_throbber"></div>';
            $(throbber).insertAfter($('input[name=file]'), $form);

            $form.ajaxSubmit(function(data){
                //Opera hack
                data = data.replace(/^<pre>/, '').replace(/<\/pre>$/, '');
                //IE hack
                data = data.replace(/^<PRE>/, '').replace(/<\/PRE>$/, '');
                try{
                    data = JSON.parse(data);
                }catch(err){
                    alert('Не удалось обработать ответ от сервера.')
                }

                if (data.error){
                    alert(data.error);
                    return;
                }

                var url = $('.pencil_modal [name=url]').val();
                _this.closeModal();            
                _this.restoreSelection();
                document.execCommand('InsertHtml', false, '<img src="'+data.url+'" />');
            }); 
        });

        this.button('bold').click(function(){
            document.execCommand('Bold', false, true);
            _this.$div.focus();
        });
        this.button('italic').click(function(){
            document.execCommand('Italic', false, true);
            _this.$div.focus();
        });
        this.button('strike').click(function(){
            document.execCommand('StrikeThrough', false, true);
            _this.$div.focus();
        });
        this.button('underline').click(function(){
            document.execCommand('Underline', false, true);
            _this.$div.focus();
        });
        this.button('left').click(function(){
            document.execCommand('JustifyLeft', false, true);
            _this.$div.focus();
        });
        this.button('center').click(function(){
            document.execCommand('JustifyCenter', false, true);
            _this.$div.focus();
        });
        this.button('right').click(function(){
            document.execCommand('JustifyRight', false, true);
            _this.$div.focus();
        });
        this.button('ol').click(function(){
            document.execCommand('InsertOrderedList', false, true);
            _this.$div.focus();
        });
        this.button('ul').click(function(){
            document.execCommand('InsertUnorderedList', false, true);
            _this.$div.focus();
        });

        this.button('h1').click(function(){
            document.execCommand('RemoveFormat', false, true);
            document.execCommand('FormatBlock', false, 'h1');
            _this.$div.focus();
        });
        this.button('h2').click(function(){
            document.execCommand('RemoveFormat', false, true);
            document.execCommand('FormatBlock', false, 'h2');
            _this.$div.focus();
        });
        this.button('h3').click(function(){
            document.execCommand('RemoveFormat', false, true);
            document.execCommand('FormatBlock', false, 'h3');
            _this.$div.focus();
        });
        this.button('removeformat').click(function(){
            document.execCommand('RemoveFormat', false, true);
            document.execCommand('FormatBlock', false, 'p');
            _this.$div.focus();
        });
        this.button('undo').click(function(){
            document.execCommand('Undo', false, true);
            _this.$div.focus();
        });
        this.button('redo').click(function(){
            document.execCommand('Redo', false, true);
            _this.$div.focus();
        });

        this.$div.blur(function(){
            _this.saveSelection();
        });

        this.button('image').click(function(){
            _this.showModal('image-form');

            $('.pencil_modal_submit').click(function(){
                var url = $('.pencil_modal [name=url]').val();
                _this.closeModal();
                
                _this.restoreSelection();
                document.execCommand('InsertHtml', false, '<img src="'+url+'" />');

            });
        });
        this.button('link').click(function(){
            _this.showModal('link-form');
            var text = _this.getSelectedText();
            if (text){
                $('.pencil_modal [name=name]').val(text);
            }

            $('.pencil_modal_submit').click(function(){
                var name = $('.pencil_modal [name=name]').val();
                var url = $('.pencil_modal [name=url]').val();
                _this.closeModal();
                
                _this.restoreSelection();
                document.execCommand('InsertHtml', false, '<a href="'+url+'">'+name+'</a>');
            });
        });
        this.button('video').click(function(){
            _this.showModal('video-form');

            $('.pencil_modal_submit').click(function(){
                var html = $('.pencil_modal [name=html_code]').val();
                _this.closeModal();
                
                _this.restoreSelection();
                document.execCommand('InsertHtml', false, html);

            });
        });

        $('.pencil_switch_html', this.$wrapper).click(function(){
            _this.htmlMode();
            return false;
        });
        $('.pencil_switch_visual', this.$wrapper).click(function(){
            _this.visualMode();
            return false;
        });

    }
    Pencil.prototype = {
        button: function(name){
            return $('.pencil_toolbar_' + name, this.$wrapper);
        },
        getTemplate: function(name){
            return this.templates[name]
        },
        visualMode: function(){
            if (this.mode == 'visual'){
                return
            }
            this.$div.html(this.$textarea.val());
            this.$textarea.hide();
            this.$div.show();
            $('.pencil_switch_visual', this.$wrapper).hide();
            $('.pencil_switch_html', this.$wrapper).show();
            $('.pencil_toolbar', this.$wrapper).show();

            this.mode = 'visual';
        },
        htmlMode: function(){
            if (this.mode == 'html'){
                return
            }
            this.$textarea.val(this.$div.html());
            this.$textarea.show();
            this.$div.hide();
            $('.pencil_switch_html', this.$wrapper).hide();
            $('.pencil_switch_visual', this.$wrapper).show();
            $('.pencil_toolbar', this.$wrapper).hide();

            this.mode = 'html';
        },
        showModal: function(templateName){
            var bg = $(this.getTemplate('modal-background'));
            var modal = $(this.getTemplate('modal'));

            $('body').append(bg);
            $('body').append(modal);
            var content = this.getTemplate(templateName);
            modal.append(content);

            var left = $(window).width()/2 - modal.width()/2;
            var top = $(window).height()/2 - modal.height()/2;
            modal.css('left', left);
            modal.css('top', top);

            var _this = this;
            $('.pencil_modal_close,.pencil_modal_cancel').click(function(){
                _this.closeModal();
            });
            $(document).keyup(function(e) { 
                if (e.keyCode == 27){
                     _this.closeModal();
                } 
            });
        },
        closeModal: function(){
            $('.pencil_modal').remove();
            $('.pencil_modal_background').remove();
        },
        getSelectionStartNode: function(){
            //http://stackoverflow.com/questions/2459180/how-to-edit-a-link-within-a-contenteditable-div
            var node,selection;
            if (window.getSelection) { // FF3.6, Safari4, Chrome5 (DOM Standards)
                selection = getSelection();
                node = selection.anchorNode;
            }
            if (!node && document.selection) { // IE
                selection = document.selection
                var range = selection.getRangeAt ? selection.getRangeAt(0) : selection.createRange();
                node = range.commonAncestorContainer ? range.commonAncestorContainer :
                range.parentElement ? range.parentElement() : range.item(0);
            }
            if (node) {
                return (node.nodeName == "#text" ? node.parentNode : node);
            }
        },
        getSelectedText: function(){
            // http://stackoverflow.com/questions/5669448/get-selected-texts-html-in-div
            if (typeof window.getSelection != "undefined") {
                // IE 9 and other non-IE browsers
                return window.getSelection().toString();
            } else if (document.selection && document.selection.type != "Control") {
                // IE 8 and below
                return document.selection;
            }
        },
        saveSelection: function (){
            //http://stackoverflow.com/questions/1181700/set-cursor-position-on-contenteditable-div
            if(window.getSelection)//non IE Browsers
            {
                this.savedRange = window.getSelection().getRangeAt(0);
            }
            else if(document.selection)//IE
            { 
                this.savedRange = document.selection.createRange();  
            } 
        },
        restoreSelection: function (){
            //http://stackoverflow.com/questions/1181700/set-cursor-position-on-contenteditable-div
            isInFocus = true;
            this.$div.focus();
            if (this.savedRange != null) {
                if (window.getSelection)//non IE and there is already a selection
                {
                    var s = window.getSelection();
                    if (s.rangeCount > 0) 
                        s.removeAllRanges();
                    s.addRange(this.savedRange);
                }
                else 
                    if (document.createRange)//non IE and no selection
                    {
                        window.getSelection().addRange(this.savedRange);
                    }
                    else 
                        if (document.selection)//IE
                        {
                            this.savedRange.select();
                        }
            }
        },
        templates: {
            'toolbar': '<ul class="pencil_toolbar">\
                    <li><a class="pencil_toolbar_bold" href="#" title="Жирный"></a></li>\
                    <li><a class="pencil_toolbar_italic" href="#" title="Курсив"></a></li>\
                    <li><a class="pencil_toolbar_strike" href="#" title="Зачеркнутый"></a></li>\
                    <li><a class="pencil_toolbar_underline" href="#" title="Подчеркивание"></a></li>\
                    <li><a class="pencil_toolbar_left" href="#" title="Лево"></a></li>\
                    <li><a class="pencil_toolbar_center" href="#" title="Центр"></a></li>\
                    <li><a class="pencil_toolbar_right" href="#" title="Право"></a></li>\
                    <li><a class="pencil_toolbar_ol" href="#" title="Нумерованый список"></a></li>\
                    <li><a class="pencil_toolbar_ul" href="#" title="Ненумерованный список"></a></li>\
                    <li><a class="pencil_toolbar_h1" href="#" title="Заголовок 1"></a></li>\
                    <li><a class="pencil_toolbar_h2" href="#" title="Заголовок 2"></a></li>\
                    <li><a class="pencil_toolbar_h3" href="#" title="Заголовок 3"></a></li>\
                    <li><a class="pencil_toolbar_image" href="#" title="Изображение"></a></li>\
                    <li><a class="pencil_toolbar_link" href="#" title="Ссылка"></a></li>\
                    <li><a class="pencil_toolbar_video" href="#" title="Видео"></a></li>\
                    <li><a class="pencil_toolbar_undo" href="#" title="Отмена"></a></li>\
                    <li><a class="pencil_toolbar_redo" href="#" title="Повтор"></a></li>\
                    <li><a class="pencil_toolbar_removeformat" href="#" title="Очистить форматирование"></a></li>\
                </ul>\
                <div style="clear: left;"></div>',

            'switch': '<div class="pencil_switch">\
                    <a class="pencil_switch_html" href="#">Перейти в режим HTML</a>\
                    <a class="pencil_switch_visual" href="#">Перейти в визуальный режим</a>\
                </div>',

            'modal': '<div class="pencil_modal"><div class="pencil_modal_close"></div></div>',

            'modal-background': '<div class="pencil_modal_background"></div>',

            'image-form': '<h1>Вставка изображения</h1>\
                <form class="pancil_modal_img_form" action="{{UPLOADER_URL}}" method="POST" enctype="multipart/form-data" >\
                    <table>\
                        <tr>\
                            <td>Изображение:</td>\
                            <td>\
                                <input type="file" name="file" /><br />\
                            </td>\
                        </tr>\
                        <tr>\
                            <td><small>или</small></td>\
                            <td></td>\
                        </tr>\
                        <tr>\
                            <td>Ссылка:</td>\
                            <td><input type="text" name="url" size="40" value="" /></td>\
                        </tr>\
                        <tr colspan="2">\
                            <td>\
                                <input type="button" value="Вставить" class="pencil_modal_submit" />\
                                <input type="button" value="Отменить" class="pencil_modal_cancel" />\
                            </td>\
                        </tr>\
                    </table>\
                </form> ',

            'link-form': '<h1>Вставка ссылки</h1>\
                <table>\
                    <tr>\
                        <td>Название:</td>\
                        <td><input type="text" name="name" size="40" /></td>\
                    </tr>\
                    <tr>\
                        <td>Ссылка:</td>\
                        <td><input type="text" name="url" size="40" value="http://" /></td>\
                    </tr>\
                    <tr colspan="2">\
                        <td>\
                            <input type="button" value="Вставить" class="pencil_modal_submit" />\
                            <input type="button" value="Отменить" class="pencil_modal_cancel" />\
                        </td>\
                    </tr>\
                </table>',

            'video-form': '<h1>Вставка видео</h1>\
                <table>\
                    <tr>\
                        <td colspan="2">\
                            HTML код:<br>\
                            <textarea name="html_code" cols="70" rows="7" />\
                        </td>\
                    </tr>\
                    <tr colspan="2">\
                        <td>\
                            <input type="button" value="Вставить" class="pencil_modal_submit" />\
                            <input type="button" value="Отменить" class="pencil_modal_cancel" />\
                        </td>\
                    </tr>\
                </table>'
        }

    }

})(jQuery)
