/*
 * @Author: fhc
 * @Date:   2015-10-28 13:27:14
 * @Last Modified by:   fhc
 * @Last Modified time: 2015-10-28 14:51:33
 */

'use strict';

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
        fragmentRE = /^\s*<(\w+|!)[^>]*>/,

});

window.Zepto = Zepto;
window.$ === undefined && (window.$ = Zepto);


(function($) {

})(Zepto);


(function($) {

})(Zepto);


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
            Z: function(don, selector) {
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
