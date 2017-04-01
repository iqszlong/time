var changeBg = {
    showLog : false,
	bgLayer:$('.bg-layer'),
    output :$('#output'),
    readFile: function(e) {
    	var _self =this;
        var obj = e.target;
        var output = $(obj).prev('label');
        //console.info(e.target);
        var _file = obj.files[0];

        var _imgRex = /image\/\w+/;

        if (!_imgRex.test(_file.type)) {
            _self.output.text('请上传图片文件');
            return false;
        }

        var reader = new FileReader();
        reader.readAsDataURL(_file);
        reader.onload = function(e) {
            // $('#output').text(this.result);
            _self.setBg(this.result);
            localStorage.setItem('bg',this.result);
        }
    },
    chageName: function(e) {
        var _self = this;
        var obj = e.target;
        var _name = '';
        if ('files' in obj) {
            _name = obj.files[0].name;
        } else {
            var _val = obj.value;
            _name = _val.substring(_val.lastIndexOf("\\") + 1);
        }

        // console.info(_name);
        _self.output.text(_name);
    },
    setEvent: function() {
        var _self = this;
        $('.file-upload').each(function() {
            var label = $(this).children('label');
            var fileInput = $(this).children('input[type=file]');
            if (!window.FileReader) {
                _self.output.text('浏览器不支持 FileReader').addClass('disabled');
                fileInput.attr('disabled', 'disabled');
            }
            $(this).on('focus', function() {
                fileInput.focus();
            }).on('blur', function() {
            	fileInput.blur();
            });
            fileInput.on('change', function(e) {
            	// _self.bgLayer.addClass('changing');
                _self.chageName(e);
                if (typeof FileReader != 'undefined') {
                    _self.readFile(e);
                }
                e.stopPropagation();
            }).on('focus', function() {
                label.addClass('focus');
            }).on('blur', function() {
                label.removeClass('focus');
            });
        });
    },
    setBg:function(code){
        var _self = this;
        var _anTime = 1300;
        var _cssCode = 'url({BGIMG})';
            _cssCode = _cssCode.replace(/{BGIMG}/,code);
        var _t = setTimeout(function(){
            clearTimeout(_t);
            _self.bgLayer.removeClass('changing').css('background-image',_cssCode);
        },_anTime);
    },
    getBg:function(){
        var _self = this;
        var _bgCode = localStorage.getItem('bg');
        if(_bgCode){
            _self.setBg(_bgCode);
        }
    },
    init: function() {
        this.setEvent();
        this.getBg();
        // var style = this.bgLayer.attr('style');
        // this.bgLayer.attr('style',style.replace(/{BGIMG}/,''));
    }
}
changeBg.init();