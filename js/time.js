var time = {
    tipWait: '',
    editWait: '',
    keys: [],
    output: $('#output'),
    editClass: 'edit',
    editWaitTime: 300,
    showFormClass: 'get-form',
    showTipClass: 'show-tip',
    tipWaitTime:2000,
    postBox: $('.form').find('input'),
    searchTip: $('.form').find('.search-by'),
    sIndex: 0,
    reg: /((https|http|ftp|rtsp|mms):\/\/)?(([0-9a-z_!~*'().&=+$%-]+:)?[0-9a-z_!~*'().&=+$%-]+@)?(([0-9]{1,3}\.){3}[0-9]{1,3}|([0-9a-z_!~*'()-]+\.)*([0-9a-z][0-9a-z-]{0,61})?[0-9a-z]\.[a-z]{2,6})(:[0-9]{1,4})?((\/?)|(\/[0-9a-z_!~*'().;?:@&=+$,%#-]+)+\/?)/g,
    searchBy: [{
        "name": "baidu",
        "surl": "https://www.baidu.com/s?word="
    }, {
        "name": "google",
        "surl": "https://www.google.com/search?q="
    }, {
        "name": "bing",
        "surl": "https://www.bing.com/search?q="
    }],

    _timeUix: function(d) {
        var unixTimestamp = new Date(d * 1000);
        var commonTime = unixTimestamp.toLocaleString();
        return commonTime;
    },

    settime: function() {
        var _self = this;
        var time = Math.round(new Date().getTime() / 1000),
            h = Math.round(new Date().getHours()).toString(),
            m = Math.round(new Date().getMinutes()).toString(),
            y = Math.round(new Date().getFullYear()),
            mo = Math.round(new Date().getMonth()),
            d = Math.round(new Date().getDate()),
            md = Math.round(new Date().getDay()),
            s = Math.round(new Date().getSeconds()),
            ms = Math.round(new Date().getMilliseconds());

        var leaveSeconds = (60 - s) * 1000;
        //console.log(m.length);


        h.length == 1 ? h = '0' + h : '';
        m.length == 1 ? m = '0' + m : '';


        switch (md) {
            case 1:
                md = '一';
                break;
            case 2:
                md = '二';
                break;
            case 3:
                md = '三';
                break;
            case 4:
                md = '四';
                break;
            case 4:
                md = '四';
                break;
            case 5:
                md = '五';
                break;
            case 6:
                md = '六';
                break;
            default:
                md = '日';
        }


        $('.y-time>label').text(y + '年' + mo + '月' + d + '日 周' + md);

        $('.num').text(h + ':' + m);
        $('.unix').text(time);

        var t = setTimeout(function() {
            _self.settime();
        }, leaveSeconds);

    },
    reUrlcode: function(url, type, i) {
        var _self = this;
        var _by = _self.searchBy[i].surl;
        switch (type) {
            case 'key':
                url = _by + url;
                return url;
                break;
            default:
                return url;
        }
    },
    // IsURL:function(str_url){
    //     var strRegex = "^((https|http|ftp|rtsp|mms)?://)"
    //     + "?(([0-9a-z_!~*'().&=+$%-]+: )?[0-9a-z_!~*'().&=+$%-]+@)?" //ftp的user@
    //     + "(([0-9]{1,3}\.){3}[0-9]{1,3}" // IP形式的URL- 199.194.52.184
    //     + "|" // 允许IP和DOMAIN（域名）
    //     + "([0-9a-z_!~*'()-]+\.)*" // 域名- www.
    //     + "([0-9a-z][0-9a-z-]{0,61})?[0-9a-z]\." // 二级域名
    //     + "[a-z]{2,6})" // first level domain- .com or .museum
    //     + "(:[0-9]{1,4})?" // 端口- :80
    //     + "((/?)|" // a slash isn't required if there is no file name
    //     + "(/[0-9a-z_!~*'().;?:@&=+$,%#-]+)+/?)$";
    //     var re=new RegExp(strRegex);
    //     //re.test()
    //     if (re.test(str_url)){
    //         return (true);
    //     }else{
    //         return (false);
    //     }
    // },
    saveKey: function(key) {
        localStorage.setItem('keys', key);

        // console.log(localStorage.keys);
    },
    uniqueArray: function(arr) {
        var result = [];
        var hash = {};
        for (var i = 0; i < arr.length; i++) {
            var item = arr[i];
            var key = typeof(item) + item;
            if (hash[key] !== 1) {
                result.push(item);
                hash[key] = 1;
            }
        }
        return result;
        //return Array.form(new Set(arr));
    },
    formSet: function() {
        var _self = this;
        $('.form').on('click', function(e) {
            _self.postBox.focus();
            e.stopPropagation();
            //e.preventDefault();
        }).submit(function() {
            var target = $(this).find('input');
            var toUrl = $.trim(target.val()).toLowerCase();
            var httpStr = 'http://';
            var fileStr = 'file://';
            var _searchKey = localStorage.getItem('keys');
            // var frist = toUrl.indexOf('/');
            // var last = toUrl.lastIndexOf('.');
            var type = '';


            if (toUrl == '') return false;

            //alert(_searchKey === null);
            if(!_searchKey === null) _self.keys = JSON.parse(_searchKey);
            
            _self.keys.push(toUrl);
            _self.keys = _self.uniqueArray(_self.keys);
            //alert(_self.keys);

            if (_self.reg.test(toUrl)) {
                type = 'web';
                if (toUrl.indexOf(fileStr) == -1) {
                    toUrl = toUrl.replace(_self.reg, function(a, b) {
                        return (b ? "" : httpStr) + a;
                    });
                }
            } else {
                type = 'key';
            }



            //console.log(_self.keys);



            toUrl = _self.reUrlcode(toUrl, type, _self.sIndex);

            //console.log(type+'-----'+toUrl);
            //console.log(_self.keys);
            window.location.href = toUrl;
            target.val('');
            _self.saveKey(JSON.stringify(_self.keys));
            return false;
        }).swipe({
            swipe: function(event, direction, distance, duration, fingerCount, fingerData) {
                if (direction == 'left') {
                    if (_self.sIndex < _self.searchBy.length - 1) {
                        _self.sIndex++;
                    } else {
                        _self.sIndex = 0;
                    }
                }
                if (direction == 'right') {
                    if (_self.sIndex <= 0) {
                        _self.sIndex = _self.searchBy.length - 1;
                    } else {
                        _self.sIndex--;
                    }
                }

                if (direction == 'left' || direction == 'right') {

                    // console.log(_self.searchBy[_self.sIndex].name);
                    var _name = _self.searchBy[_self.sIndex].name;
                    _self.searchTip.text(_name).removeClass().addClass('search-by ' + _name);

                    if (_self.tipWait != '') {
                        clearTimeout(_self.tipWait);
                    }

                    if (!$("html").hasClass(_self.showTipClass)) {
                        $("html").addClass(_self.showTipClass);
                    }

                    _self.tipWait = setTimeout(function() {
                        $("html").removeClass(_self.showTipClass);
                        clearTimeout(_self.tipWait);
                    }, _self.tipWaitTime);
                }
            }
        });
    },
    bodySet: function() {
        var _self = this;

        window.onload = function() {
            $("body").removeAttr('unresolved');
        }
        $("body").swipe({
                swipeStatus: function(event, phase, direction, distance, duration, fingers, fingerData, currentDirectio) {
                    if (direction == 'up') {
                        $(this).removeClass(_self.showFormClass);
                        _self.postBox.blur();
                    }
                    if (direction == 'down') {
                        $(this).addClass(_self.showFormClass);
                        _self.postBox.focus();
                        _self.addKeylist();
                    }

                    if(phase == 'start'){
                        _self.editMode($(this))
                    }

                    if(phase == 'move' || phase == 'cancel'){
                        clearTimeout(_self.editWait);
                    }

                    //console.log(event.target.className);
                    if(event.target.className == 'unix' || event.target.className == 'num'){
                        clearTimeout(_self.editWait);
                    }
                }

            })
            // .on({
            //     mousedown:function(){
            //         _self.editMode($(this));
            //     },
            //     mouseup:function(){
            //         clearTimeout(_self.editWait);
            //     }
            // })

    },
    addKeylist: function() {
        var _self = this;
        var _searchKey = JSON.parse(localStorage.getItem('keys'));
        var _keyItemhtml = '<option></option>';
        var _keyItem = '';
        //console.log(_searchKey);
        if(_searchKey !== null){
            for (var i = 0; i < _searchKey.length; i++) {
                // console.log(_searchKey[i]);
                _keyItem += $(_keyItemhtml).val(_searchKey[i]).prop('outerHTML');
            }
            $('#key').html(_keyItem);
        }
        
        // if ($('#key').children().size() <= 0) $('#key').html(_keyItem);
    },
    postBoxinput: function() {
        var _self = this;
        _self.postBox.on('keyup', function() {
            _self.addKeylist();
        });
    },
    editMode:function(obj){
        var _self = this;
        _self.editWait = setTimeout(function() {
            if (obj.hasClass(_self.editClass)) {
                obj.removeClass(_self.editClass);
            } else {
                if(changeBg.bgCode != null) changeBg.bgLayer.removeClass(changeBg.loadClass);
                obj.addClass(_self.editClass);
            }
            clearTimeout(_self.editWait);
        }, _self.editWaitTime);
    },
    speech:function(){
        if (document.createElement('input').webkitSpeech === undefined) {
          notice.sendNotification("你的浏览器不支持 x-webkit-speech", {icon: notice.icon});
        }
    },
    init: function() {
        this.settime();
        this.formSet();
        this.bodySet();
        this.postBoxinput();
        //this.speech();
    }


}

time.init();
