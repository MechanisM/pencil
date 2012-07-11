(function($){

    $.fn.pencil = function (options) {
        var editor = new Pencil(this, options);
        editor.visualMode();
        return editor;
    };

    function Pencil(textarea, options){
		this.$textarea = $(textarea);
		$(textarea).css('color', '#999')


		$(textarea).after('<div class="pencil_div" style="overflow-y: scroll;"></div>');
		this.$div = $('.pencil_div');
		this.$div.attr('contenteditable','true');
		this.$div.html(this.$textarea.html());
        this.$div.width(this.$textarea.width());
        this.$div.height(this.$textarea.height());

		$(textarea).before('<ul><a class="pencil_toolbar_bold" href="#">bold</a></ul>')
		$('.pencil_toolbar_bold').click(function(){
			alert('ds');
		})

	}
	Pencil.prototype = {
		loadTemplate: function(){

		},
		visualMode: function(){
            if (this.mode == 'visual'){
                return
            }
            this.$div.html(this.$textarea.val());
            this.$textarea.hide();
            this.$div.show();
            this.mode = 'visual';
		},
		htmlMode: function(){
            if (this.mode == 'html'){
                return
            }
            this.$textarea.val(this.$div.html());
            this.$textarea.show();
            this.$div.hide();

            this.mode = 'html';
		},
		showModal: function(){

		},
		closeModal: function(){

		},
		insertImage: function(){

		},
		insertLink: function(){

		},
		insertVideo: function(){

		}
	}


})(jQuery)
