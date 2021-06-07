"use strict";

(function ($, window, document, undefined) {

  var pluginName = "emailautocomplete";
  var defaults = {
    suggClass: "eac-sugg",
    domains: ["yahoo.com" ,"google.com" ,"hotmail.com" ,"gmail.com" ,"me.com" ,"aol.com" ,"mac.com" ,"live.com" ,"comcast.net" ,"googlemail.com" ,"msn.com" ,"hotmail.co.uk" ,"yahoo.co.uk" ,"facebook.com" ,"verizon.net" ,"sbcglobal.net" ,"att.net" ,"gmx.com" ,"mail.com" ,"outlook.com" ,"icloud.com"]
  };

  function Plugin(elem, options) {
    this.$field = $(elem);
    this.options = $.extend(true, {}, defaults, options);
    this._defaults = defaults;
    this._domains = this.options.domains;
    this.init();
  }

  Plugin.prototype = {
    init: function () {

      if (!Array.prototype.indexOf) {
        this.doIndexOf();
      }

      
      this.$field.on("keyup.eac", $.proxy(this.displaySuggestion, this));

      this.$field.on("blur.eac", $.proxy(this.autocomplete, this));

      
      this.fieldLeftOffset = (this.$field.outerWidth(true) - this.$field.width()) / 2;

      
      var $wrap = $("<div class='eac-input-wrap' />").css({
        display: this.$field.css("display"),
        position: "relative",
        fontSize: this.$field.css("fontSize")
      });
      this.$field.wrap($wrap);

      
      this.$cval = $("<span class='eac-cval' />").css({
        visibility: "hidden",
        position: "absolute",
        display: "inline-block",
        fontFamily: this.$field.css("fontFamily"),
        fontWeight: this.$field.css("fontWeight"),
        letterSpacing: this.$field.css("letterSpacing")
      }).insertAfter(this.$field);

      
      var heightPad = (this.$field.outerHeight(true) - this.$field.height()) / 2; 
      this.$suggOverlay = $("<span class='"+this.options.suggClass+"' />").css({
        display: "block",
        "box-sizing": "content-box", 
        lineHeight: this.$field.css('lineHeight'),
        paddingTop: heightPad + "px",
        paddingBottom: heightPad + "px",
        fontFamily: this.$field.css("fontFamily"),
        fontWeight: this.$field.css("fontWeight"),
        letterSpacing: this.$field.css("letterSpacing"),
        position: "absolute",
        top: 0,
        left: 0
      }).insertAfter(this.$field).on("mousedown.eac touchstart.eac", $.proxy(this.autocomplete, this));

    },

    suggest: function (str) {
      var str_arr = str.split("@");
      if (str_arr.length > 1) {
        str = str_arr.pop();
        if (!str.length) {
          return "";
        }
      } else {
        return "";
      }

      var match = this._domains.filter(function (domain) {
        return 0 === domain.indexOf(str);
      }).shift() || "";

      return match.replace(str, "");
    },

    autocomplete: function () {
      if(typeof this.suggestion === "undefined"){
        return false;
      }
      this.$field.val(this.val + this.suggestion);
      this.$suggOverlay.html("");
      this.$cval.html("");
    },

    
    displaySuggestion: function (e) {
      this.val = this.$field.val();
      this.suggestion = this.suggest(this.val);

      if (!this.suggestion.length) {
        this.$suggOverlay.html("");
      } else {
        e.preventDefault();
      }

      
      this.$suggOverlay.html(this.suggestion);
      this.$cval.html(this.val);

      
      var cvalWidth = this.$cval.width();

      if(this.$field.outerWidth() > cvalWidth){
        
        this.$suggOverlay.css('left', this.fieldLeftOffset + cvalWidth + "px");
      }
    },

    
    doIndexOf: function(){

        Array.prototype.indexOf = function (searchElement, fromIndex) {
          if ( this === undefined || this === null ) {
            throw new TypeError( '"this" is null or not defined' );
          }

          var length = this.length >>> 0;

          fromIndex = +fromIndex || 0;

          if (Math.abs(fromIndex) === Infinity) {
            fromIndex = 0;
          }

          if (fromIndex < 0) {
            fromIndex += length;
            if (fromIndex < 0) {
              fromIndex = 0;
            }
          }

          for (;fromIndex < length; fromIndex++) {
            if (this[fromIndex] === searchElement) {
              return fromIndex;
            }
          }

          return -1;
        };
      }
  };

  $.fn[pluginName] = function (options) {
    return this.each(function () {
      if (!$.data(this, "yz_" + pluginName)) {
        $.data(this, "yz_" + pluginName, new Plugin(this, options));
      }
    });
  };

})(jQuery, window, document);