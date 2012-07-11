(function($){

    $.fn.pencil = function (options) {
        var editor = new Pencil(this, options);
        editor.visualMode();
        return editor;
    };

    function Pencil(textarea, options){
		this.$textarea = $(textarea);

		this.$textarea.wrap('<div class="pencil_wrapper"></div>')
		this.$wrapper = $('.pencil_wrapper');
		this.$wrapper.width(this.$textarea.width());

		$(textarea).after('<div class="pencil_div" style="overflow-y: scroll;"></div>');
		this.$div = $('.pencil_div');
		this.$div.attr('contenteditable','true');
		this.$div.html(this.$textarea.html());
        this.$div.width(this.$textarea.width());
        this.$div.height(this.$textarea.height());

		this.$textarea.before(
			'<ul class="pencil_toolbar">\
				<li><a class="pencil_toolbar_bold" href="#"></a></li>\
				<li><a class="pencil_toolbar_italic" href="#"></a></li>\
				<li><a class="pencil_toolbar_strike" href="#"></a></li>\
				<li><a class="pencil_toolbar_underline" href="#"></a></li>\
				<li><a class="pencil_toolbar_left" href="#"></a></li>\
				<li><a class="pencil_toolbar_center" href="#"></a></li>\
				<li><a class="pencil_toolbar_right" href="#"></a></li>\
				<li><a class="pencil_toolbar_ol" href="#"></a></li>\
				<li><a class="pencil_toolbar_ul" href="#"></a></li>\
				<li><a class="pencil_toolbar_h1" href="#"></a></li>\
				<li><a class="pencil_toolbar_h2" href="#"></a></li>\
				<li><a class="pencil_toolbar_h3" href="#"></a></li>\
				<li><a class="pencil_toolbar_image" href="#"></a></li>\
				<li><a class="pencil_toolbar_link" href="#"></a></li>\
				<li><a class="pencil_toolbar_video" href="#"></a></li>\
			</ul>\
			<div style="clear: left;"></div>'
		)
		this.$div.after(
			'<ul class="pencil_switch">\
				<li class="pencil_switch_html"><a href="#">Switch to HTMLMode</a></li>\
				<li class="pencil_switch_visual"><a href="#">Switch to Visual Mode</a></li>\
			</ul>'
		)
		$('.pencil_toolbar_bold').click(function(){
			document.execCommand('Bold', false, true);
		});
		$('.pencil_toolbar_italic').click(function(){
			document.execCommand('Italic', false, true);
		});
		$('.pencil_toolbar_strike').click(function(){
			document.execCommand('StrikeThrough', false, true)
		});
		$('.pencil_toolbar_underline').click(function(){
			document.execCommand('Underline', false, true)
		});
		$('.pencil_toolbar_left').click(function(){
			document.execCommand('JustifyLeft', false, true)
		});
		$('.pencil_toolbar_center').click(function(){
			document.execCommand('JustifyCenter', false, true)
		});
		$('.pencil_toolbar_right').click(function(){
			document.execCommand('JustifyRight', false, true)
		});
		$('.pencil_toolbar_ol').click(function(){
			document.execCommand('InsertOrderedList', false, true)
		});
		$('.pencil_toolbar_ul').click(function(){
			document.execCommand('InsertUnorderedList', false, true)
		});

		_this = this;

		$('.pencil_toolbar_image').click(function(){
			_this.showModal('image-form');
		});
		$('.pencil_toolbar_link').click(function(){
			_this.showModal('link-form');
		});
		$('.pencil_toolbar_video').click(function(){
			_this.showModal('video-form');
		});

		$('.pencil_switch_html a').click(function(){
			_this.htmlMode();
			return false;
		});
		$('.pencil_switch_visual a').click(function(){
			_this.visualMode();
			return false;
		});

	}
	Pencil.prototype = {
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
			$('.pencil_switch_visual').hide();
			$('.pencil_switch_html').show();
			$('.pencil_toolbar').show();

            this.mode = 'visual';
		},
		htmlMode: function(){
            if (this.mode == 'html'){
                return
            }
            this.$textarea.val(this.$div.html());
            this.$textarea.show();
            this.$div.hide();
			$('.pencil_switch_html').hide();
			$('.pencil_switch_visual').show();
			$('.pencil_toolbar').hide();

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
		templates: {
			'modal': '<div class="pencil_modal"><div class="pencil_modal_close"></div></div>',

			'modal-background': '<div class="pencil_modal_background"></div>',

			'image-form': '<h1>Вставка изображения</h1>\
				<form class="pancil_modal_img_form" action="{{SIMPLE_UPLOADER_URL}}" method="POST" enctype="multipart/form-data" >\
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
							<td><input type="text" name="src" size="40" value="" /></td>\
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
