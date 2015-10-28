/*
 * @Author: fhc
 * @Date:   2015-10-28 13:27:14
 * @Last Modified by:   fhc
 * @Last Modified time: 2015-10-28 16:23:16
 */

'use strict';

// 定义 Zepto的构造函数
var Zepto = (function() {

    var undefined, key, $, classList, emptyArray = [],
        slice = emptyArray.slice,
        filter = emptyArray.filter,
        document = window.document,
        elementDisplay = {},
        classCache = {},
        cssNumber = {
            'column-count': 1,
            'columns': 1,
            'font-weight': 1,
            'line-height': 1,
            'opacity': 1,
            'z-index': 1,
            'zoom': 1
        },
        fragmentRE = /^\s*<(\w+|!)[^>]*>/;
    // ...

    // 以上是一堆常用的变量或者常量

    zepto.matches = function(element, selector) {

    }

    // 一下是常用的判断函数

    // 判断对象的类型，是null就返回字符串 null，不是就用 class2type这个方法去判断
    function type(obj) {
        return obj == null ? String(obj) : class2type[toString.call(obj)] || 'object'
    }

    // 这几个都差不多，调用了最基本的 type 方法
    function isFunction(value) {
        return type(value) == 'function'
    }

    function isWindow(obj) {
        return obj != null && obj == obj.window
    }

    function isDocument(obj) {
        return obj != null && obj.nodeType == obj.DOCUMENT_NODE
    }

    function isObject(obj) {
        return type(obj) == 'object'
    }

    /*
     判断是否为空的对象，即对象下面没有任何东西, 且该对象不从任何对象中 new 得来，说白了就是 var a = {} 类似这样的对象
    */
    function isPlainObj(obj) {
        return isObject(obj) && !isWindow(obj) && Object.getPrototypeOf(obj) == Object.prototype
    }

    // 这里判断有的简单了吧
    function likeArray(obj) {
        return typeof obj.length == 'number'
    }

    function compact(array) {
        return filter.call(array, function(item) {
            return item != null
        })
    }

    // 这里有个 parseJSON 的，就比较简单了, 把字符串转成 json
    if (window.JSON) {
        $.parseJSON = JSON.parse
    }


    // 加工完了就返回 $，配合下面两句写法
    return $;
});

window.Zepto = Zepto;
window.$ === undefined && (window.$ = Zepto);

// DOM 操作和事件等

(function($) {



    // shortcut methods for '.bind(event, fn)' for each event type
    // 各种鼠标键盘DOM事件，怎么都喜欢字符串 split 为数组，可能是比较容易阅读吧
    ('focusin focusout focus blur load resize scroll unload click dblclick ' + 'mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave' + 'change select keydown keypress keyup error').split(' ').forEach(function(event) {
        $.fn[event] = function(callback) {
            return (0 in arguments) ?
                this.bind(event, callback) :
                this.trigger(event)
        }
    })

    $.Event = function(type, props) {
        if (!isString(type)) {
            props = type;
            type = props.type
        }

        var event = document.createEvent(specialEvents[type] || 'Events'),
            bubbles = true;

        if (props) {
            for (var name in props) {
                name == 'bubbles' ?
                    // 这种写法把字符串形式的 boolean改成 boolean 形式
                    (bubbles = !!props[name]) :
                    (event[name] = props[name])
            }
        }

        event.initEvent(type, bubbles, true)
        return compatible(event)
    }
})(Zepto);


// ajax 这一大块

(function($) {
    var jsonpID = 0,
        document = window.document,
        key,
        name,
        // \b 匹配单词开始或结束，\s 匹配空白符， \d 匹配数字
        rscript = //gi,
        scriptTypeRE = /^(?:text|application)\/xml/i,
        xmlTypeRE = /^(?:text|application)\/xml/i,
        jsonType = 'application/json',
        htmlType = 'text/html',

        /* 从开头到结尾匹配空白符，重复0次或者多次

         ^ 开头
         $ 结尾
         \s 空白符
         * 匹配0次或多次

        */
        blankRE = /^\s*$/;

    var originAnchor = document.createElement('a');
    originAnchor.href = window.location.href;


    // handle optional data/success arguments
    // 在使用简写的 ajax时把参数转换一下？？
    function parseArguments(url, data, success, dataType) {
        // 这段奇葩
        if ($.isFunction(data)) {
            dataType = success;
            success = data;
            data = undefined;
        }

        if (!$.isFunction(success)) {
            dataType = success;
            success = undefined;
            return {
                url: url,
                data: data,
                success: success,
                dataType: dataType
            }
        }
    }

    // 这边的 ajax 简写，本质上都是调用了 $.ajax 而已

    // get 说明了$.ajax 默认的 type 就是 'GET'
    $.get = function( /*url, data, success, dataType*/ ) {
        return $.ajax(parseArguments.apply(null, arguments))
    }

    $.post = function() {
        var options = parseArguments.apply(null, arguments)
        options.type = 'POST'
        return $.ajax(options)
    }

})(Zepto);


// 表单序列化

(function($) {
    // 使用方法 $("form").serializeArray()...

    $.fn.serializeArray = function() {
        var name, type, result = [],
            // 这里是个迭代的方法？？
            add = function(value) {
                if (value.forEach) {
                    return value.forEach(add)
                }
                result.push({
                    name: name,
                    value: value
                })
            };

        if (this[0]) {
            // 用元素js的 .elements来循环获取value值
            $.each(this[0].elements, function(_, field) {
                type = field.type, name = field.name;

                // 如果没有 name属性就不会去取那个值了的
                if (name && field.name.toLowerCase() != 'fieldset' && type != 'submit' && type != 'reset' && type != 'button' && type != 'file' && ((type != 'radio' && type != 'checkbox') || field.checked)) {
                    add($(field).val())
                }
            });
        }

        return result;
    }

    // 返回一个 query string 咯大概，还给参数 encodeURIComponent 一下
    $.fn.serialize = function() {
        var result = []
        this.serializeArray().forEach(function(ele) {
            result.push(encodeURIComponent(ele.name) + '=' + encodeURIComponent(ele.value))
        })

        return result.join('&')
    }

    $.fn.submit = function(callback) {
        if (0 in arguments) {
            this.bind('submit', callback)
        } else if (this.length) {
            var event = $.Event('submit')
            this.eq(0).trigger(event)

            if (!event.isDefaultPrevented()) {
                this.get(0).submit()
            }
        }

        return this
    }
})(Zepto);


(function($) {
    if (!('__proto__' in {})) {
        $.extend($.zepto, {
            Z: function(dom, selector) {
                dom = dom || []
                $.extend(dom, $.fn)
                dom.selector = selector || ''
                dom.__Z = true
                return dom
            },

            // this is a kludge but works
            isZ: function(object) {
                return $.type(object) === 'array' && '__Z' in object
            }
        })
    }

    // getComputedStyle shouldn't freak out when called
    // without a valid element as argument
    try {
        getComputedStyle(undefined)
    } catch (e) {
        var nativeGetComputedStyle = getComputedStyle;
        window.getComputedStyle = function(element) {
            try {
                return nativeGetComputedStyle(element)
            } catch (e) {
                return null
            }
        }
    }
})(Zepto);
