(function(a) {
    var b = a.telerik
      , f = [8, 9, 37, 38, 39, 40, 46, 35, 36, 44]
      , g = ["font-family", "font-size", "font-stretch", "font-style", "font-weight", "line-height", "color", "text-align", "text-decoration", "text-transform"];
    b.scripts.push("telerik.textbox.js");
    function e(j) {
        var l = {};
        for (var h = 0, k = g.length; h < k; h++) {
            var m = g[h]
              , n = j.css(m);
            if (n) {
                if (g[h] != "font-style" && n != "normal") {
                    l[m] = n
                }
            }
        }
        return l
    }
    b.textbox = function(k, m) {
        if (k.nodeName.toLowerCase() !== "input" && k.type.toLowerCase() !== "text") {
            throw "Target element is not a INPUT"
        }
        var n = this;
        a.extend(n, m);
        n.element = k;
        var h = n.$element = a(k).bind({
            keydown: a.proxy(n._keydown, n),
            keypress: a.proxy(n._keypress, n)
        }).bind("paste", a.proxy(n._paste, n));
        h.closest("form").bind("reset", a.proxy(n._onParentFormReset, n));
        var i = new b.stringBuilder();
        if (k.parentNode.nodeName.toLowerCase() !== "div") {
            h.addClass("t-input").wrap(a('<div class="t-widget t-numerictextbox"></div>'));
            if (n.showIncreaseButton) {
                i.cat('<a class="t-link t-icon t-arrow-up" href="#" tabindex="-1" title="').cat(n.increaseButtonTitle).cat('">Increment</a>')
            }
            if (n.showDecreaseButton) {
                i.cat('<a class="t-link t-icon t-arrow-down" href="#" tabindex="-1" title="').cat(n.decreaseButtonTitle).cat('">Decrement</a>')
            }
            if (i.buffer.length > 0) {
                a(i.string()).insertAfter(h)
            }
        }
        n.$wrapper = h.closest(".t-numerictextbox").find(".t-arrow-up, .t-arrow-down").bind({
            click: b.preventDefault,
            dragstart: b.preventDefault
        }).end().bind({
            focusin: a.proxy(n._focus, n),
            focusout: a.proxy(n._blur, n)
        });
        n.enabled = !h.is("[disabled]");
        i.buffer = [];
        i.cat("[ |").cat(n.groupSeparator).catIf("|" + n.symbol, n.symbol).cat("]");
        n.replaceRegExp = new RegExp(i.string(),"g");
        var l = h.attr("value")
          , j = h.attr("class").replace("t-input", "").replace("input-validation-error", "");
        i.buffer = [];
        i.cat('<div class="t-formatted-value').catIf(" t-state-empty", l == "" && n.enabled).catIf(j, j).cat('">').cat(l || (n.enabled ? n.text : "")).cat("</div>");
        n.$text = a(i.string()).insertBefore(h).css(e(h)).click(function(o) {
            if (n.enabled) {
                k.focus()
            }
        });
        n._blur();
        n[n.enabled ? "enable" : "disable"]();
        n.numFormat = n.numFormat === undefined ? n.type.charAt(0) : n.numFormat;
        n.step = n.parse(n.step);
        n.val = n.parse(n.val);
        n.minValue = n.parse(n.minValue);
        n.maxValue = n.parse(n.maxValue);
        n.decimals = {
            "190": ".",
            "188": ","
        };
        n.specialDecimals = {
            "110": n.separator
        };
        n.value(l || n.val);
        b.bind(n, {
            load: n.onLoad,
            valueChange: n.onChange
        })
    }
    ;
    b.textbox.prototype = {
        _paste: function(h) {
            setTimeout(a.proxy(function() {
                var j = h.target.value;
                if (j == "-") {
                    return true
                }
                var i = this.parse(j);
                if (i || i == 0) {
                    this._update(i)
                }
            }, this))
        },
        _keydown: function(m) {
            setTimeout(a.proxy(function() {
                h.toggleClass("t-state-error", !this.inRange(this.parse(h.val()), this.minValue, this.maxValue))
            }, this));
            var q = m.keyCode
              , h = this.$element
              , n = h[0]
              , y = h.val()
              , u = this.separator
              , t = d(n)
              , x = t.start
              , o = t.end
              , v = y ? y.indexOf(u) : -1
              , i = v === -1;
            if (!i && x !== -1) {
                if (v >= x && v < o) {
                    i = true
                }
            }
            var w = this.specialDecimals[q];
            if (w) {
                if (i) {
                    var p, s;
                    if (x != -1) {
                        p = x;
                        s = o
                    } else {
                        var j = b.caretPos(n);
                        p = j;
                        s = j
                    }
                    h.val(y.slice(0, p) + w + y.slice(s, y.length));
                    if (a.browser.msie) {
                        if (n.createTextRange) {
                            var r = n.createTextRange();
                            r.moveStart("textedit", 1);
                            r.select()
                        }
                    }
                }
                return false
            }
            var k = this.decimals[q];
            if (k) {
                if (k === u && this.digits > 0 && i) {
                    return true
                } else {
                    m.preventDefault()
                }
            }
            if (q == 13 || q == 9) {
                this._update(this.parse(h.val()));
                return true
            }
            if (q == 38 || q == 40) {
                var l = q == 38 ? 1 : -1;
                this._modify(l * this.step);
                return true
            }
            if (q == 222) {
                m.preventDefault()
            }
        },
        _keypress: function(h) {
            var i = h.target
              , k = h.keyCode || h.which;
            if (k == 0 || a.inArray(k, f) != -1 || h.ctrlKey || (h.shiftKey && k == 45)) {
                return true
            }
            var j;
            if (this.minValue === null || this.minValue < 0) {
                if (d(i).start === 0 || (b.caretPos(i) === 0 && i.value.indexOf("-") === -1)) {
                    j = true
                }
            }
            if ((j && String.fromCharCode(k) == "-") || this.inRange(k, 48, 57)) {
                return true
            }
            h.preventDefault()
        },
        _focus: function() {
            if (this.enabled) {
                this._showTextBoxValue();
                this.$text.hide();
                var h = this.$element[0];
                this._focusing = setTimeout(function() {
                    h.focus();
                    if (a.browser.msie) {
                        h.select()
                    } else {
                        h.selectionStart = 0;
                        h.selectionEnd = h.value.length
                    }
                }, 0)
            }
        },
        _blur: function() {
            clearTimeout(this._focusing);
            this.$element.removeClass("t-state-error");
            if (this.enabled) {
                this.$text.show();
                this._hideTextBoxValue()
            }
            var i = this.minValue
              , h = this.maxValue
              , j = this.parse(this.$element.val());
            if (j != null) {
                if (i != null && j < i) {
                    j = i
                } else {
                    if (h != null && j > h) {
                        j = h
                    }
                }
                j = parseFloat(j.toFixed(this.digits))
            }
            this._update(j)
        },
        _clearTimer: function(h) {
            clearTimeout(this.timeout);
            clearInterval(this.timer);
            clearInterval(this.acceleration)
        },
        _stepper: function(h, j) {
            if (h.which == 1) {
                var i = this.step;
                this._modify(j * i);
                this.timeout = setTimeout(a.proxy(function() {
                    this.timer = setInterval(a.proxy(function() {
                        this._modify(j * i)
                    }, this), 80);
                    this.acceleration = setInterval(function() {
                        i += 1
                    }, 1000)
                }, this), 200)
            }
        },
        _modify: function(j) {
            var k = this.parse(this.element.value)
              , i = this.minValue
              , h = this.maxValue;
            k = k ? k + j : j;
            if (i !== null && k < i) {
                k = i
            } else {
                if (h !== null && k > h) {
                    k = h
                }
            }
            this._update(parseFloat(k.toFixed(this.digits)))
        },
        _update: function(i) {
            var h = this.val;
            this._value(i);
            if (h != i) {
                if (b.trigger(this.element, "valueChange", {
                    oldValue: h,
                    newValue: i
                })) {
                    this._value(h)
                }
            }
        },
        _value: function(k) {
            var i = (typeof k === "number") ? k : this.parse(k)
              , j = this.enabled ? this.text : ""
              , h = i === null;
            if (i != null) {
                i = parseFloat(i.toFixed(this.digits))
            }
            this.val = i;
            this.$element.val(h ? "" : this.formatEdit(i));
            this.$text.html(h ? j : this.format(i));
            this.$text.toggleClass("t-state-empty", h)
        },
        _hideTextBoxValue: function() {
            var h = this.$element;
            if (this.enabled) {
                setTimeout(function() {
                    h.css("color", h.css("background-color"))
                });
                if (a.browser.opera) {
                    h.css({
                        color: h.css("background-color"),
                        "text-indent": "-4444px"
                    })
                }
            } else {
                if (!a.browser.msie) {
                    h.css({
                        color: h.css("background-color"),
                        "text-indent": "-4444px"
                    })
                } else {
                    h.css({
                        color: h.css("background-color"),
                        "letter-spacing": "1000px"
                    })
                }
            }
        },
        _showTextBoxValue: function() {
            var h = this.$element
              , i = this.$text;
            if (this.enabled) {
                setTimeout(function() {
                    h.css({
                        color: i.css("color"),
                        "text-indent": "",
                        "letter-spacing": ""
                    })
                })
            } else {
                if (!a.browser.msie) {
                    h.css({
                        color: i.css("background-color"),
                        "text-indent": "0px"
                    })
                } else {
                    h.css({
                        color: i.css("background-color"),
                        "letter-spacing": "0px"
                    })
                }
            }
        },
        _onParentFormReset: function() {
            var h = this;
            window.setTimeout(function() {
                h._value(h.$element.val())
            }, 1)
        },
        enable: function() {
            var h = this.$wrapper.find(".t-arrow-up, .t-arrow-down")
              , i = a.proxy(this._clearTimer, this);
            this.enabled = true;
            this.$element.removeAttr("disabled");
            if (!this.val && this.val != 0) {
                this.$text.addClass("t-state-empty").html(this.text)
            } else {
                this._hideTextBoxValue()
            }
            this.$wrapper.removeClass("t-state-disabled");
            h.unbind("mouseup").unbind("mouseout").unbind("dblclick").bind({
                mouseup: i,
                mouseout: i,
                dblclick: i
            });
            var j = "mousedown";
            h.eq(0).unbind(j).bind(j, a.proxy(function(k) {
                this._stepper(k, 1)
            }, this));
            h.eq(1).unbind(j).bind(j, a.proxy(function(k) {
                this._stepper(k, -1)
            }, this))
        },
        disable: function() {
            var h = this;
            h.enabled = false;
            h.$wrapper.addClass("t-state-disabled").find(".t-icon").unbind("mousedown").bind("mousedown", b.preventDefault);
            h.$element.attr("disabled", "disabled");
            h.$text.css("color", "");
            if (!h.val && h.val != 0) {
                h.$text.html("")
            } else {
                h._hideTextBoxValue()
            }
        },
        value: function(i) {
            if (i === undefined) {
                return this.parse(this.element.value)
            }
            var h = (typeof i === "number") ? i : this.parse(i);
            if (!this.inRange(h, this.minValue, this.maxValue)) {
                h = null
            }
            this._value(h)
        },
        formatEdit: function(i) {
            var h = this.separator;
            if (i.toString().toLowerCase().indexOf("e") > -1) {
                i = i.toFixed(this.digits)
            }
            if (i && h != ".") {
                i = i.toString().replace(".", h)
            }
            return i
        },
        format: function(h) {
            return b.formatNumber(h, this.numFormat, this.digits, this.separator, this.groupSeparator, this.groupSize, this.positive, this.negative, this.symbol, true)
        },
        inRange: function(h, j, i) {
            return h === null || ((j !== null ? h >= j : true) && (i !== null ? h <= i : true))
        },
        parse: function(l) {
            var j = null
              , k = this.separator;
            if (l || l == "0") {
                if (typeof l == typeof 1) {
                    return l
                }
                if (l.toLowerCase().indexOf("e") > -1 && !isNaN(Number(l))) {
                    l = Number(l);
                    l = l.toFixed(this.digits).replace(".", k)
                }
                l = l.replace(this.replaceRegExp, "");
                if (k && k != ".") {
                    l = l.replace(k, ".")
                }
                var h = b.patterns[this.type].negative[this.negative].replace(/(\(|\))/g, "\\$1").replace("*", "").replace("n", "([\\d|\\.]*)")
                  , i = new RegExp(h);
                if (i.test(l)) {
                    j = -parseFloat(i.exec(l)[1])
                } else {
                    j = parseFloat(l)
                }
            }
            return isNaN(j) ? null : j
        }
    };
    a.fn.tTextBox = function(i) {
        var j = "numeric";
        if (i && i.type) {
            j = i.type
        }
        var h = a.fn.tTextBox.defaults[j];
        h.digits = b.cultureInfo[j + "decimaldigits"];
        h.separator = b.cultureInfo[j + "decimalseparator"];
        h.groupSeparator = b.cultureInfo[j + "groupseparator"];
        h.groupSize = b.cultureInfo[j + "groupsize"];
        h.positive = b.cultureInfo[j + "positive"];
        h.negative = b.cultureInfo[j + "negative"];
        h.symbol = b.cultureInfo[j + "symbol"];
        i = a.extend({}, h, i);
        i.type = j;
        return this.each(function() {
            var k = a(this);
            i = a.meta ? a.extend({}, i, k.data()) : i;
            if (!k.data("tTextBox")) {
                k.data("tTextBox", new b.textbox(this,i));
                b.trigger(this, "load")
            }
        })
    }
    ;
    var c = {
        val: null,
        text: "",
        step: 1,
        inputAttributes: "",
        increaseButtonTitle: "Increase value",
        decreaseButtonTitle: "Decrease value",
        showIncreaseButton: true,
        showDecreaseButton: true
    };
    a.fn.tTextBox.defaults = {
        numeric: a.extend(c, {
            minValue: -100,
            maxValue: 100
        }),
        currency: a.extend(c, {
            minValue: 0,
            maxValue: 1000
        }),
        percent: a.extend(c, {
            minValue: 0,
            maxValue: 100
        })
    };
    function d(h) {
        var l = -1
          , k = -1;
        if (document.selection) {
            var j = h.document.selection.createRange().text
              , i = j.length;
            if (i > 0) {
                l = h.value.indexOf(j);
                k = i
            }
        } else {
            if (h.selectionStart !== undefined) {
                var n = h.selectionStart
                  , m = h.selectionEnd;
                if (n != m) {
                    l = n;
                    k = m
                }
            }
        }
        return {
            start: l,
            end: k
        }
    }
}
)(jQuery);
