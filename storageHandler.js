

var storageHandler;

(storageHandler = function () {
  
  var _ls = window.localStorage;
  var prefix = "rbwt_";
  
  function prefixer(value){
    
    return (prefix + value).trim();
  }
  
  var localStorageHandler = {
    
    /**
     * @property length
     * @type Number
     */
    length: _ls.length,

    /**
     * @method get
     * @param key {String} Item key
     * @return {String|Object|Null}
     */
    get: function (key) {
      
      key = prefixer(key);
      
      try {
        return JSON.parse(_ls.getItem(key));
      } catch (e) {
        return _ls.getItem(key);
      }
    },

    /**
     * @method set
     * @param key {String} Item key
     * @param val {String|Object} Item value
     * @return {String|Object} The value of the item just set
     */
    set: function (key, val) {
      
      key = prefixer(key);
      
      _ls.setItem(key, JSON.stringify(val));
      
      return this.get(key);
    },
    
    /**
     * @method key
     * @param index {Number} Item index
     * @return {String|Null} The item key if found, null if not
     */
    key: function (index) {
      
      if (typeof index === 'number') {
        return _ls.key(index);
      }
    },

    /**
     * @method data
     * @return {Array|Null} An array containing all items in localStorage through key{string}-value{String|Object} pairs
     */
    data: function () {
      var i = 0;
      var data = [];

      while (_ls.key(i)) {
        let key = _ls.key(i).replace(prefix,"").trim();
        data[i] = [key, this.get(key)];
        i++;
      }

      return data.length ? data : null;
    },

    /**
     * @method remove
     * @param keyOrIndex {String} Item key or index (which will be converted to key anyway)
     * @return {Boolean} True if the key was found before deletion, false if not
     */
    remove: function (keyOrIndex) {
      
      var result = false;
      
      if (keyOrIndex in _ls) {
        result = true;
        _ls.removeItem(keyOrIndex);
      }

      return result;
    },

    /**
     * @method clear
     * @return {Number} The total of items removed
     */
    clear: function () {
      var len = _ls.length;
      _ls.clear();
      return len;
    }
  }
  
  var cookieHandler = {
    
    /**
     * @method set
     * @param name {String} Item key
     * @param value {String|Object} Item value
     * @param days {Int} Expire time
     * @return {String|Object} The value of the item just set
     */
    set: function(name, value, days) {
      
      if (days) {
        var date = new Date();
        date.setTime(date.getTime()+(days*24*60*60*1000));
        var expires = "; expires="+date.toGMTString();
      }
      else { var expires = ""; }
      
      document.cookie = (prefixer(name).trim() + "="+JSON.stringify(value)+expires+"; path=/").trim();
    },

    /**
     * @method get
     * @param key {String} Item key
     * @return {String|Object|Null}
     */
    get: function(name) {
      
      name = prefixer(name);
      var nameEQ  = name + "=";
      var ca      = document.cookie.split(';');

      for(var i=0;i < ca.length; i++) {

        var c = ca[i]
        while (c.charAt(0)==' ') {

          c = c.substring(1,c.length);
        }

        if (c.indexOf(nameEQ) == 0) {
          
          var ret = c.substring(nameEQ.length,c.length);
          
          try {
            return JSON.parse(ret);
          } 
          catch (e) {
            return ret;
          }
        }
      }

      return null;
    },

    /*
    * @method data
    * get all cookies from the document and
    * @returns {array}
    */
    data: function() {
      
      var r = new Array()
      var u = document.cookie.split(";")
      for(var i=0;i<u.length;i++)
          r.push({
              name: u[i].split("=")[0],
              value: u[i].split("=")[1]
          })
      return r;
    },

    /**
     * @method remove
     * expires the cookie to remove
     * @param name {String|Number} 
     */
    remove:  function(name) {
      
      this.set(name.trim(),"",-1);
    },

    /**
     * @method clear
     * removes all cookies in document
     */
    clear: function(){
      
      var u = document.cookie.split(";");

      for(var i=0;i<u.length;i++){
        
        let name = u[i].split("=")[0];

        if(name.indexOf(prefix) > -1){
          
          this.remove(name.replace(prefix, ""));
        }
      }    
    }
    
  };
  
  return (typeof Storage !== "undefined") ? localStorageHandler : cookieHandler;
 
})();