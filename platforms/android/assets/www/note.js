/*! indexeddbshim - v1.0.6 - 2015-04-16 */

var idbModules={util:{cleanInterface:!1}};!function(){"use strict";var a={test:!0};if(Object.defineProperty)try{Object.defineProperty(a,"test",{enumerable:!1}),a.test&&(idbModules.util.cleanInterface=!0)}catch(b){}}(),function(a){"use strict";function b(a,b,c){c.target=b,"function"==typeof b[a]&&b[a].apply(b,[c])}var c=function(){this.length=0,this._items=[],a.util.cleanInterface&&Object.defineProperty(this,"_items",{enumerable:!1})};if(c.prototype={contains:function(a){return-1!==this._items.indexOf(a)},item:function(a){return this._items[a]},indexOf:function(a){return this._items.indexOf(a)},push:function(a){this._items.push(a),this.length+=1;for(var b=0;b<this._items.length;b++)this[b]=this._items[b]},splice:function(){this._items.splice.apply(this._items,arguments),this.length=this._items.length;for(var a in this)a===String(parseInt(a,10))&&delete this[a];for(a=0;a<this._items.length;a++)this[a]=this._items[a]}},a.util.cleanInterface)for(var d in{indexOf:!1,push:!1,splice:!1})Object.defineProperty(c.prototype,d,{enumerable:!1});a.util.callback=b,a.util.StringList=c,a.util.quote=function(a){return'"'+a+'"'}}(idbModules),function(idbModules){"use strict";var Sca=function(){return{decycle:function(object,callback){function checkForCompletion(){0===queuedObjects.length&&returnCallback(derezObj)}function readBlobAsDataURL(a,b){var c=new FileReader;c.onloadend=function(c){var d=c.target.result,e="Blob";a instanceof File,updateEncodedBlob(d,b,e)},c.readAsDataURL(a)}function updateEncodedBlob(dataURL,path,blobtype){var encoded=queuedObjects.indexOf(path);path=path.replace("$","derezObj"),eval(path+'.$enc="'+dataURL+'"'),eval(path+'.$type="'+blobtype+'"'),queuedObjects.splice(encoded,1),checkForCompletion()}function derez(a,b){var c,d,e;if(!("object"!=typeof a||null===a||a instanceof Boolean||a instanceof Date||a instanceof Number||a instanceof RegExp||a instanceof Blob||a instanceof String)){for(c=0;c<objects.length;c+=1)if(objects[c]===a)return{$ref:paths[c]};if(objects.push(a),paths.push(b),"[object Array]"===Object.prototype.toString.apply(a))for(e=[],c=0;c<a.length;c+=1)e[c]=derez(a[c],b+"["+c+"]");else{e={};for(d in a)Object.prototype.hasOwnProperty.call(a,d)&&(e[d]=derez(a[d],b+"["+JSON.stringify(d)+"]"))}return e}return a instanceof Blob?(queuedObjects.push(b),readBlobAsDataURL(a,b)):a instanceof Boolean?a={$type:"Boolean",$enc:a.toString()}:a instanceof Date?a={$type:"Date",$enc:a.getTime()}:a instanceof Number?a={$type:"Number",$enc:a.toString()}:a instanceof RegExp?a={$type:"RegExp",$enc:a.toString()}:"number"==typeof a?a={$type:"number",$enc:a+""}:void 0===a&&(a={$type:"undefined"}),a}var objects=[],paths=[],queuedObjects=[],returnCallback=callback,derezObj=derez(object,"$");checkForCompletion()},retrocycle:function retrocycle($){function dataURLToBlob(a){var b,c,d,e=";base64,";if(-1===a.indexOf(e))return c=a.split(","),b=c[0].split(":")[1],d=c[1],new Blob([d],{type:b});c=a.split(e),b=c[0].split(":")[1],d=window.atob(c[1]);for(var f=d.length,g=new Uint8Array(f),h=0;f>h;++h)g[h]=d.charCodeAt(h);return new Blob([g.buffer],{type:b})}function rez(value){var i,item,name,path;if(value&&"object"==typeof value)if("[object Array]"===Object.prototype.toString.apply(value))for(i=0;i<value.length;i+=1)item=value[i],item&&"object"==typeof item&&(path=item.$ref,"string"==typeof path&&px.test(path)?value[i]=eval(path):value[i]=rez(item));else if(void 0!==value.$type)switch(value.$type){case"Blob":case"File":value=dataURLToBlob(value.$enc);break;case"Boolean":value=Boolean("true"===value.$enc);break;case"Date":value=new Date(value.$enc);break;case"Number":value=Number(value.$enc);break;case"RegExp":value=eval(value.$enc);break;case"number":value=parseFloat(value.$enc);break;case"undefined":value=void 0}else for(name in value)"object"==typeof value[name]&&(item=value[name],item&&(path=item.$ref,"string"==typeof path&&px.test(path)?value[name]=eval(path):value[name]=rez(item)));return value}var px=/^\$(?:\[(?:\d+|\"(?:[^\\\"\u0000-\u001f]|\\([\\\"\/bfnrt]|u[0-9a-zA-Z]{4}))*\")\])*$/;return rez($)},encode:function(a,b){function c(a){b(JSON.stringify(a))}this.decycle(a,c)},decode:function(a){return this.retrocycle(JSON.parse(a))}}}();idbModules.Sca=Sca}(idbModules),function(idbModules){"use strict";function flipBase36(a,b){if("0"===a){for(var c="",d=0;d<b.length;d++)c+=(35-parseInt(b[d],36)).toString(36);return c}return b}function getType(a){return a instanceof Date?"date":a instanceof Array?"array":typeof a}function validate(a){var b=getType(a);if("array"===b)for(var c=0;c<a.length;c++)validate(a[c]);else if(!types[b]||"string"!==b&&isNaN(a))throw idbModules.util.createDOMException("DataError","Not a valid key")}function getValue(source,keyPath){try{if(keyPath instanceof Array){for(var arrayValue=[],i=0;i<keyPath.length;i++)arrayValue.push(eval("source."+keyPath[i]));return arrayValue}return eval("source."+keyPath)}catch(e){return void 0}}function setValue(a,b,c){for(var d=b.split("."),e=0;e<d.length-1;e++){var f=d[e];a=a[f]=a[f]||{}}a[d[d.length-1]]=c}function isMultiEntryMatch(a,b){var c=collations[b.substring(0,1)];return"array"===c?b.indexOf(a)>1:b===a}var collations=["undefined","number","date","string","array"],types={undefined:{encode:function(a){return collations.indexOf("undefined")+"-"},decode:function(a){return void 0}},date:{encode:function(a){return collations.indexOf("date")+"-"+a.toJSON()},decode:function(a){return new Date(a.substring(2))}},number:{encode:function(a){var b,c,d;if(b=0>a?"0":"z",c=new Array(200).join(b),d="",isFinite(a)){var e=Math.abs(a).toString(36);e=e.split("."),c=flipBase36(b,e[0]);var f=new Array(200-c.length);f=f.join("0"===b?"z":"0"),c=f+c,e.length>1&&(d="."+flipBase36(b,e[1]||""))}return collations.indexOf("number")+"-"+b+c+d},decode:function(a){var b=a.substr(2,1),c=flipBase36(b,a.substr(3,199)),d=flipBase36(b,a.substr(203));if(b="0"===b?-1:1,c=parseInt(c,36),d){var e=d.length;return d=parseInt(d,36),b*(c+d/Math.pow(36,e))}return b*c}},string:{encode:function(a,b){return b&&(a=a.replace(/(.)/g,"-$1")+" "),collations.indexOf("string")+"-"+a},decode:function(a,b){return a=a.substring(2),b&&(a=a.substr(0,a.length-1).replace(/-(.)/g,"$1")),a}},array:{encode:function(a){for(var b=[],c=0;c<a.length;c++){var d=a[c],e=idbModules.Key.encode(d,!0);b[c]=e}return b.push(collations.indexOf("undefined")+"-"),collations.indexOf("array")+"-"+JSON.stringify(b)},decode:function(a){var b=JSON.parse(a.substring(2));b.pop();for(var c=0;c<b.length;c++){var d=b[c],e=idbModules.Key.decode(d,!0);b[c]=e}return b}}};idbModules.Key={encode:function(a,b){return void 0===a?null:types[getType(a)].encode(a,b)},decode:function(a,b){return"string"!=typeof a?void 0:types[collations[a.substring(0,1)]].decode(a,b)},validate:validate,getValue:getValue,setValue:setValue,isMultiEntryMatch:isMultiEntryMatch}}(idbModules),function(a){"use strict";function b(a,b){var c=new Event(a);return c.debug=b,Object.defineProperty(c,"target",{writable:!0}),c}function c(a,b){this.type=a,this.debug=b,this.bubbles=!1,this.cancelable=!1,this.eventPhase=0,this.timeStamp=(new Date).valueOf()}var d=!1;try{var e=b("test type","test debug"),f={test:"test target"};e.target=f,e instanceof Event&&"test type"===e.type&&"test debug"===e.debug&&e.target===f&&(d=!0)}catch(g){}d?(a.Event=Event,a.IDBVersionChangeEvent=Event,a.util.createEvent=b):(a.Event=c,a.IDBVersionChangeEvent=c,a.util.createEvent=function(a,b){return new c(a,b)})}(idbModules),function(a){"use strict";function b(a,b){var c=new DOMException.prototype.constructor(0,b);return c.name=a||"DOMException",c.message=b,c}function c(a,b){a=a||"DOMError";var c=new DOMError(a,b);return c.name===a||(c.name=a),c.message===b||(c.message=b),c}function d(a,b){var c=new Error(b);return c.name=a||"DOMException",c.message=b,c}function e(b,c,d){if(a.DEBUG){d&&d.message&&(d=d.message);var e="function"==typeof console.error?"error":"log";console[e](b+": "+c+". "+(d||"")),console.trace&&console.trace()}}var f,g=!1,h=!1;try{f=b("test name","test message"),f instanceof DOMException&&"test name"===f.name&&"test message"===f.message&&(g=!0)}catch(i){}try{f=c("test name","test message"),f instanceof DOMError&&"test name"===f.name&&"test message"===f.message&&(h=!0)}catch(i){}a.util.logError=e,g?(a.DOMException=DOMException,a.util.createDOMException=function(a,c,d){return e(a,c,d),b(a,c)}):(a.DOMException=Error,a.util.createDOMException=function(a,b,c){return e(a,b,c),d(a,b)}),h?(a.DOMError=DOMError,a.util.createDOMError=function(a,b,d){return e(a,b,d),c(a,b)}):(a.DOMError=Error,a.util.createDOMError=function(a,b,c){return e(a,b,c),d(a,b)})}(idbModules),function(a){"use strict";function b(){this.onsuccess=this.onerror=this.result=this.error=this.source=this.transaction=null,this.readyState="pending"}function c(){this.onblocked=this.onupgradeneeded=null}c.prototype=new b,c.prototype.constructor=c,a.IDBRequest=b,a.IDBOpenDBRequest=c}(idbModules),function(a,b){"use strict";function c(c,d,e,f){c!==b&&(a.Key.validate(c),this.__lower=a.Key.encode(c)),d!==b&&(a.Key.validate(d),this.__upper=a.Key.encode(d)),this.lower=c,this.upper=d,this.lowerOpen=!!e,this.upperOpen=!!f}c.only=function(a){return new c(a,a,!1,!1)},c.lowerBound=function(a,d){return new c(a,b,d,b)},c.upperBound=function(a,d){return new c(b,a,b,d)},c.bound=function(a,b,d,e){return new c(a,b,d,e)},a.IDBKeyRange=c}(idbModules),function(a,b){"use strict";function c(c,d,e,f,g,h){if(c===b||c instanceof a.IDBKeyRange||(c=new a.IDBKeyRange(c,c,!1,!1)),e.transaction.__assertActive(),d!==b&&-1===["next","prev","nextunique","prevunique"].indexOf(d))throw new TypeError(d+"is not a valid cursor direction");this.source=f,this.direction=d||"next",this.key=b,this.primaryKey=b,this.__store=e,this.__range=c,this.__req=new a.IDBRequest,this.__keyColumnName=g,this.__valueColumnName=h,this.__valueDecoder="value"===h?a.Sca:a.Key,this.__offset=-1,this.__lastKeyContinued=b,this["continue"]()}c.prototype.__find=function(c,d,e,f,g){g=g||1;var h=this,i=a.util.quote(h.__keyColumnName),j=["SELECT * FROM",a.util.quote(h.__store.name)],k=[];j.push("WHERE",i,"NOT NULL"),!h.__range||h.__range.lower===b&&h.__range.upper===b||(j.push("AND"),h.__range.lower!==b&&(j.push(i,h.__range.lowerOpen?">":">=","?"),k.push(h.__range.__lower)),h.__range.lower!==b&&h.__range.upper!==b&&j.push("AND"),h.__range.upper!==b&&(j.push(i,h.__range.upperOpen?"<":"<=","?"),k.push(h.__range.__upper))),"undefined"!=typeof c&&(h.__lastKeyContinued=c,h.__offset=0),h.__lastKeyContinued!==b&&(j.push("AND",i,">= ?"),a.Key.validate(h.__lastKeyContinued),k.push(a.Key.encode(h.__lastKeyContinued)));var l="prev"===h.direction||"prevunique"===h.direction?"DESC":"ASC";j.push("ORDER BY",i,l),j.push("LIMIT",g,"OFFSET",h.__offset),j=j.join(" "),a.DEBUG&&console.log(j,k),h.__prefetchedData=null,h.__prefetchedIndex=0,d.executeSql(j,k,function(c,d){d.rows.length>1?(h.__prefetchedData=d.rows,h.__prefetchedIndex=0,a.DEBUG&&console.log("Preloaded "+h.__prefetchedData.length+" records for cursor"),h.__decode(d.rows.item(0),e)):1===d.rows.length?h.__decode(d.rows.item(0),e):(a.DEBUG&&console.log("Reached end of cursors"),e(b,b,b))},function(b,c){a.DEBUG&&console.log("Could not execute Cursor.continue",j,k),f(c)})},c.prototype.__onsuccess=function(a){var c=this;return function(d,e,f){c.key=d===b?null:d,c.value=e===b?null:e,c.primaryKey=f===b?null:f,a(d===b?null:c,c.__req)}},c.prototype.__decode=function(b,c){var d=a.Key.decode(b[this.__keyColumnName]),e=this.__valueDecoder.decode(b[this.__valueColumnName]),f=a.Key.decode(b.key);c(d,e,f)},c.prototype["continue"]=function(b){var c=a.cursorPreloadPackSize||100,d=this;this.__store.transaction.__pushToQueue(d.__req,function(a,e,f,g){return d.__offset++,d.__prefetchedData&&(d.__prefetchedIndex++,d.__prefetchedIndex<d.__prefetchedData.length)?void d.__decode(d.__prefetchedData.item(d.__prefetchedIndex),d.__onsuccess(f)):void d.__find(b,a,d.__onsuccess(f),g,c)})},c.prototype.advance=function(c){if(0>=c)throw a.util.createDOMException("Type Error","Count is invalid - 0 or negative",c);var d=this;this.__store.transaction.__pushToQueue(d.__req,function(a,e,f,g){d.__offset+=c,d.__find(b,a,d.__onsuccess(f),g)})},c.prototype.update=function(c){var d=this;return d.__store.transaction.__assertWritable(),d.__store.transaction.__addToTransactionQueue(function(e,f,g,h){a.Sca.encode(c,function(f){d.__find(b,e,function(b,i,j){var k=d.__store,l=[f],m=["UPDATE",a.util.quote(k.name),"SET value = ?"];a.Key.validate(j);for(var n=0;n<k.indexNames.length;n++){var o=k.__indexes[k.indexNames[n]],p=a.Key.getValue(c,o.keyPath);m.push(",",a.util.quote(o.name),"= ?"),l.push(a.Key.encode(p,o.multiEntry))}m.push("WHERE key = ?"),l.push(a.Key.encode(j)),a.DEBUG&&console.log(m.join(" "),f,b,j),e.executeSql(m.join(" "),l,function(a,c){d.__prefetchedData=null,d.__prefetchedIndex=0,1===c.rowsAffected?g(b):h("No rows with key found"+b)},function(a,b){h(b)})},h)})})},c.prototype["delete"]=function(){var c=this;return c.__store.transaction.__assertWritable(),this.__store.transaction.__addToTransactionQueue(function(d,e,f,g){c.__find(b,d,function(e,h,i){var j="DELETE FROM  "+a.util.quote(c.__store.name)+" WHERE key = ?";a.DEBUG&&console.log(j,e,i),a.Key.validate(i),d.executeSql(j,[a.Key.encode(i)],function(a,d){c.__prefetchedData=null,c.__prefetchedIndex=0,1===d.rowsAffected?(c.__offset--,f(b)):g("No rows with key found"+e)},function(a,b){g(b)})},g)})},a.IDBCursor=c}(idbModules),function(a,b){"use strict";function c(a,b){this.objectStore=a,this.name=b.columnName,this.keyPath=b.keyPath,this.multiEntry=b.optionalParams&&b.optionalParams.multiEntry,this.unique=b.optionalParams&&b.optionalParams.unique,this.__deleted=!!b.__deleted}c.__clone=function(a,b){return new c(b,{columnName:a.name,keyPath:a.keyPath,optionalParams:{multiEntry:a.multiEntry,unique:a.unique}})},c.__createIndex=function(b,d){var e=!!b.__indexes[d.name]&&b.__indexes[d.name].__deleted;b.__indexes[d.name]=d,b.indexNames.push(d.name);var f=b.transaction;f.__addToTransactionQueue(function(f,g,h,i){function j(b,c){i(a.util.createDOMException(0,'Could not create index "'+d.name+'"',c))}function k(e){c.__updateIndexList(b,e,function(){e.executeSql("SELECT * FROM "+a.util.quote(b.name),[],function(c,e){function f(g){if(g<e.rows.length)try{var i=a.Sca.decode(e.rows.item(g).value),k=a.Key.getValue(i,d.keyPath);k=a.Key.encode(k,d.multiEntry),c.executeSql("UPDATE "+a.util.quote(b.name)+" set "+a.util.quote(d.name)+" = ? where key = ?",[k,e.rows.item(g).key],function(a,b){f(g+1)},j)}catch(l){f(g+1)}else h(b)}a.DEBUG&&console.log("Adding existing "+b.name+" records to the "+d.name+" index"),f(0)},j)},j)}if(e)k(f);else{var l=["ALTER TABLE",a.util.quote(b.name),"ADD",a.util.quote(d.name),"BLOB"].join(" ");a.DEBUG&&console.log(l),f.executeSql(l,[],k,j)}})},c.__deleteIndex=function(b,d){b.__indexes[d.name].__deleted=!0,b.indexNames.splice(b.indexNames.indexOf(d.name),1);var e=b.transaction;e.__addToTransactionQueue(function(e,f,g,h){function i(b,c){h(a.util.createDOMException(0,'Could not delete index "'+d.name+'"',c))}c.__updateIndexList(b,e,g,i)})},c.__updateIndexList=function(b,c,d,e){for(var f={},g=0;g<b.indexNames.length;g++){var h=b.__indexes[b.indexNames[g]];f[h.name]={columnName:h.name,keyPath:h.keyPath,optionalParams:{unique:h.unique,multiEntry:h.multiEntry},deleted:!!h.deleted}}a.DEBUG&&console.log("Updating the index list for "+b.name,f),c.executeSql("UPDATE __sys__ set indexList = ? where name = ?",[JSON.stringify(f),b.name],function(){d(b)},e)},c.prototype.__fetchIndexData=function(c,d){var e,f,g=this;return 1===arguments.length?(d=c,e=!1):(a.Key.validate(c),f=a.Key.encode(c,g.multiEntry),e=!0),g.objectStore.transaction.__addToTransactionQueue(function(c,h,i,j){var k=["SELECT * FROM",a.util.quote(g.objectStore.name),"WHERE",a.util.quote(g.name),"NOT NULL"],l=[];e&&(g.multiEntry?(k.push("AND",a.util.quote(g.name),"LIKE ?"),l.push("%"+f+"%")):(k.push("AND",a.util.quote(g.name),"= ?"),l.push(f))),a.DEBUG&&console.log("Trying to fetch data for Index",k.join(" "),l),c.executeSql(k.join(" "),l,function(c,h){var j=0,k=null;if(g.multiEntry)for(var l=0;l<h.rows.length;l++){var m=h.rows.item(l),n=a.Key.decode(m[g.name]);e&&a.Key.isMultiEntryMatch(f,m[g.name])?(j++,k=k||m):e||n===b||(j+=n instanceof Array?n.length:1,k=k||m)}else j=h.rows.length,k=j&&h.rows.item(0);i("count"===d?j:0===j?b:"key"===d?a.Key.decode(k.key):a.Sca.decode(k.value))},j)})},c.prototype.openCursor=function(b,c){return new a.IDBCursor(b,c,this.objectStore,this,this.name,"value").__req},c.prototype.openKeyCursor=function(b,c){return new a.IDBCursor(b,c,this.objectStore,this,this.name,"key").__req},c.prototype.get=function(a){if(0===arguments.length)throw new TypeError("No key was specified");return this.__fetchIndexData(a,"value")},c.prototype.getKey=function(a){if(0===arguments.length)throw new TypeError("No key was specified");return this.__fetchIndexData(a,"key")},c.prototype.count=function(a){return 0===arguments.length?this.__fetchIndexData("count"):this.__fetchIndexData(a,"count")},a.IDBIndex=c}(idbModules),function(a){"use strict";function b(b,c){this.name=b.name,this.keyPath=JSON.parse(b.keyPath),this.transaction=c,this.autoIncrement="string"==typeof b.autoInc?"true"===b.autoInc:!!b.autoInc,this.__indexes={},this.indexNames=new a.util.StringList;var d=JSON.parse(b.indexList);for(var e in d)if(d.hasOwnProperty(e)){var f=new a.IDBIndex(this,d[e]);this.__indexes[f.name]=f,f.__deleted||this.indexNames.push(f.name)}}b.__clone=function(a,c){var d=new b({name:a.name,keyPath:JSON.stringify(a.keyPath),autoInc:JSON.stringify(a.autoIncrement),indexList:"{}"},c);return d.__indexes=a.__indexes,d.indexNames=a.indexNames,d},b.__createObjectStore=function(b,c){b.__objectStores[c.name]=c,b.objectStoreNames.push(c.name);var d=b.__versionTransaction;a.IDBTransaction.__assertVersionChange(d),d.__addToTransactionQueue(function(b,d,e,f){function g(b,d){throw a.util.createDOMException(0,'Could not create object store "'+c.name+'"',d)}var h=["CREATE TABLE",a.util.quote(c.name),"(key BLOB",c.autoIncrement?"UNIQUE, inc INTEGER PRIMARY KEY AUTOINCREMENT":"PRIMARY KEY",", value BLOB)"].join(" ");a.DEBUG&&console.log(h),b.executeSql(h,[],function(a,b){a.executeSql("INSERT INTO __sys__ VALUES (?,?,?,?)",[c.name,JSON.stringify(c.keyPath),c.autoIncrement,"{}"],function(){e(c)},g)},g)})},b.__deleteObjectStore=function(b,c){b.__objectStores[c.name]=void 0,b.objectStoreNames.splice(b.objectStoreNames.indexOf(c.name),1);var d=b.__versionTransaction;a.IDBTransaction.__assertVersionChange(d),d.__addToTransactionQueue(function(b,d,e,f){function g(b,c){f(a.util.createDOMException(0,"Could not delete ObjectStore",c))}b.executeSql("SELECT * FROM __sys__ where name = ?",[c.name],function(b,d){d.rows.length>0&&b.executeSql("DROP TABLE "+a.util.quote(c.name),[],function(){b.executeSql("DELETE FROM __sys__ WHERE name = ?",[c.name],function(){e()},g)},g)})})},b.prototype.__validateKey=function(b,c){if(this.keyPath){if("undefined"!=typeof c)throw a.util.createDOMException("DataError","The object store uses in-line keys and the key parameter was provided",this);if(!b||"object"!=typeof b)throw a.util.createDOMException("DataError","KeyPath was specified, but value was not an object");if(c=a.Key.getValue(b,this.keyPath),void 0===c){if(this.autoIncrement)return;throw a.util.createDOMException("DataError","Could not eval key from keyPath")}}else if("undefined"==typeof c){if(this.autoIncrement)return;throw a.util.createDOMException("DataError","The object store uses out-of-line keys and has no key generator and the key parameter was not provided. ",this)}a.Key.validate(c)},b.prototype.__deriveKey=function(b,c,d,e,f){function g(c){b.executeSql("SELECT * FROM sqlite_sequence where name like ?",[h.name],function(a,b){c(1!==b.rows.length?1:b.rows.item(0).seq+1)},function(b,c){f(a.util.createDOMException("DataError","Could not get the auto increment value for key",c))})}var h=this;if(h.keyPath){var i=a.Key.getValue(c,h.keyPath);void 0===i&&h.autoIncrement?g(function(b){try{a.Key.setValue(c,h.keyPath,b),e(b)}catch(d){f(a.util.createDOMException("DataError","Could not assign a generated value to the keyPath",d))}}):e(i)}else"undefined"==typeof d&&h.autoIncrement?g(e):e(d)},b.prototype.__insertData=function(b,c,d,e,f,g){try{var h={};"undefined"!=typeof e&&(a.Key.validate(e),h.key=a.Key.encode(e));for(var i=0;i<this.indexNames.length;i++){var j=this.__indexes[this.indexNames[i]];h[j.name]=a.Key.encode(a.Key.getValue(d,j.keyPath),j.multiEntry)}var k=["INSERT INTO ",a.util.quote(this.name),"("],l=[" VALUES ("],m=[];for(var n in h)k.push(a.util.quote(n)+","),l.push("?,"),m.push(h[n]);k.push("value )"),l.push("?)"),m.push(c);var o=k.join(" ")+l.join(" ");a.DEBUG&&console.log("SQL for adding",o,m),b.executeSql(o,m,function(b,c){a.Sca.encode(e,function(b){b=a.Sca.decode(b),f(b)})},function(b,c){g(a.util.createDOMError("ConstraintError",c.message,c))})}catch(p){g(p)}},b.prototype.add=function(b,c){var d=this;if(0===arguments.length)throw new TypeError("No value was specified");this.__validateKey(b,c),d.transaction.__assertWritable();var e=d.transaction.__createRequest();return d.transaction.__pushToQueue(e,function(e,f,g,h){d.__deriveKey(e,b,c,function(c){a.Sca.encode(b,function(a){d.__insertData(e,a,b,c,g,h)})},h)}),e},b.prototype.put=function(b,c){var d=this;if(0===arguments.length)throw new TypeError("No value was specified");this.__validateKey(b,c),d.transaction.__assertWritable();var e=d.transaction.__createRequest();return d.transaction.__pushToQueue(e,function(e,f,g,h){d.__deriveKey(e,b,c,function(c){a.Sca.encode(b,function(f){a.Key.validate(c);var i="DELETE FROM "+a.util.quote(d.name)+" where key = ?";e.executeSql(i,[a.Key.encode(c)],function(e,i){a.DEBUG&&console.log("Did the row with the",c,"exist? ",i.rowsAffected),d.__insertData(e,f,b,c,g,h)},function(a,b){h(b)})})},h)}),e},b.prototype.get=function(b){var c=this;if(0===arguments.length)throw new TypeError("No key was specified");a.Key.validate(b);var d=a.Key.encode(b);return c.transaction.__addToTransactionQueue(function(b,e,f,g){a.DEBUG&&console.log("Fetching",c.name,d),b.executeSql("SELECT * FROM "+a.util.quote(c.name)+" where key = ?",[d],function(b,c){a.DEBUG&&console.log("Fetched data",c);var d;try{if(0===c.rows.length)return f();d=a.Sca.decode(c.rows.item(0).value)}catch(e){a.DEBUG&&console.log(e)}f(d)},function(a,b){g(b)})})},b.prototype["delete"]=function(b){var c=this;if(0===arguments.length)throw new TypeError("No key was specified");c.transaction.__assertWritable(),a.Key.validate(b);var d=a.Key.encode(b);return c.transaction.__addToTransactionQueue(function(b,e,f,g){a.DEBUG&&console.log("Fetching",c.name,d),b.executeSql("DELETE FROM "+a.util.quote(c.name)+" where key = ?",[d],function(b,c){a.DEBUG&&console.log("Deleted from database",c.rowsAffected),f()},function(a,b){g(b)})})},b.prototype.clear=function(){var b=this;return b.transaction.__assertWritable(),b.transaction.__addToTransactionQueue(function(c,d,e,f){c.executeSql("DELETE FROM "+a.util.quote(b.name),[],function(b,c){a.DEBUG&&console.log("Cleared all records from database",c.rowsAffected),e()},function(a,b){f(b)})})},b.prototype.count=function(b){var c=this,d=!1;return arguments.length>0&&(d=!0,a.Key.validate(b)),c.transaction.__addToTransactionQueue(function(e,f,g,h){var i="SELECT * FROM "+a.util.quote(c.name)+(d?" WHERE key = ?":""),j=[];d&&j.push(a.Key.encode(b)),e.executeSql(i,j,function(a,b){g(b.rows.length)},function(a,b){h(b)})})},b.prototype.openCursor=function(b,c){return new a.IDBCursor(b,c,this,this,"key","value").__req},b.prototype.index=function(b){if(0===arguments.length)throw new TypeError("No index name was specified");var c=this.__indexes[b];if(!c)throw a.util.createDOMException("NotFoundError",'Index "'+b+'" does not exist on '+this.name);return a.IDBIndex.__clone(c,this)},b.prototype.createIndex=function(b,c,d){if(0===arguments.length)throw new TypeError("No index name was specified");if(1===arguments.length)throw new TypeError("No key path was specified");if(this.__indexes[b]&&!this.__indexes[b].__deleted)throw a.util.createDOMException("ConstraintError",'Index "'+b+'" already exists on '+this.name);this.transaction.__assertVersionChange(),d=d||{};var e={columnName:b,keyPath:c,optionalParams:{unique:!!d.unique,multiEntry:!!d.multiEntry}},f=new a.IDBIndex(this,e);return a.IDBIndex.__createIndex(this,f),f},b.prototype.deleteIndex=function(b){if(0===arguments.length)throw new TypeError("No index name was specified");var c=this.__indexes[b];if(!c)throw a.util.createDOMException("NotFoundError",'Index "'+b+'" does not exist on '+this.name);this.transaction.__assertVersionChange(),a.IDBIndex.__deleteIndex(this,c)},a.IDBObjectStore=b}(idbModules),function(a){"use strict";function b(a,b,d){this.__id=++c,this.__active=!0,this.__running=!1,this.__requests=[],this.__storeNames=b,this.mode=d,this.db=a,this.error=null,this.onabort=this.onerror=this.oncomplete=null;var e=this;setTimeout(function(){e.__executeRequests()},0)}var c=0;b.prototype.__executeRequests=function(){function b(b){if(!d.__active)throw b;try{a.util.logError("Error","An error occurred in a transaction",b),d.error=b;var c=a.util.createEvent("error");a.util.callback("onerror",d,c)}finally{d.abort()}}function c(){a.DEBUG&&console.log("Transaction completed");var b=a.util.createEvent("complete");a.util.callback("oncomplete",d,b),a.util.callback("__oncomplete",d,b)}if(this.__running)return void(a.DEBUG&&console.log("Looks like the request set is already running",this.mode));this.__running=!0;var d=this;d.db.__db.transaction(function(e){function f(b,c){c&&(i.req=c),i.req.readyState="done",i.req.result=b,delete i.req.error;var d=a.util.createEvent("success");a.util.callback("onsuccess",i.req,d),j++,h()}function g(c,d){1===arguments.length&&(d=c);try{i.req.readyState="done",i.req.error=d||"DOMError",i.req.result=void 0;var e=a.util.createEvent("error",d);a.util.callback("onerror",i.req,e)}finally{b(d)}}function h(){if(j>=d.__requests.length)d.__requests=[],d.__active&&(d.__active=!1,c());else try{i=d.__requests[j],i.op(e,i.args,f,g)}catch(a){g(a)}}d.__tx=e;var i=null,j=0;h()},b)},b.prototype.__createRequest=function(){var b=new a.IDBRequest;return b.source=this.db,b.transaction=this,b},b.prototype.__addToTransactionQueue=function(a,b){var c=this.__createRequest();return this.__pushToQueue(c,a,b),c},b.prototype.__pushToQueue=function(a,b,c){this.__assertActive(),this.__requests.push({op:b,args:c,req:a})},b.prototype.__assertActive=function(){if(!this.__active)throw a.util.createDOMException("TransactionInactiveError","A request was placed against a transaction which is currently not active, or which is finished")},b.prototype.__assertWritable=function(){if(this.mode===b.READ_ONLY)throw a.util.createDOMException("ReadOnlyError","The transaction is read only")},b.prototype.__assertVersionChange=function(){b.__assertVersionChange(this)},b.__assertVersionChange=function(c){if(!c||c.mode!==b.VERSION_CHANGE)throw a.util.createDOMException("InvalidStateError","Not a version transaction")},b.prototype.objectStore=function(c){if(0===arguments.length)throw new TypeError("No object store name was specified");if(!this.__active)throw a.util.createDOMException("InvalidStateError","A request was placed against a transaction which is currently not active, or which is finished");if(-1===this.__storeNames.indexOf(c)&&this.mode!==b.VERSION_CHANGE)throw a.util.createDOMException("NotFoundError",c+" is not participating in this transaction");var d=this.db.__objectStores[c];if(!d)throw a.util.createDOMException("NotFoundError",c+" does not exist in "+this.db.name);return a.IDBObjectStore.__clone(d,this)},b.prototype.abort=function(){var b=this;a.DEBUG&&console.log("The transaction was aborted",b),b.__active=!1;var c=a.util.createEvent("abort");setTimeout(function(){a.util.callback("onabort",b,c)},0)},b.READ_ONLY="readonly",b.READ_WRITE="readwrite",b.VERSION_CHANGE="versionchange",a.IDBTransaction=b}(idbModules),function(a){"use strict";function b(b,c,d,e){this.__db=b,this.__closed=!1,this.version=d,this.name=c,this.onabort=this.onerror=this.onversionchange=null,this.__objectStores={},this.objectStoreNames=new a.util.StringList;for(var f=0;f<e.rows.length;f++){var g=new a.IDBObjectStore(e.rows.item(f));this.__objectStores[g.name]=g,this.objectStoreNames.push(g.name)}}b.prototype.createObjectStore=function(b,c){if(0===arguments.length)throw new TypeError("No object store name was specified");if(this.__objectStores[b])throw a.util.createDOMException("ConstraintError",'Object store "'+b+'" already exists in '+this.name);this.__versionTransaction.__assertVersionChange(),c=c||{};var d={name:b,keyPath:JSON.stringify(c.keyPath||null),autoInc:JSON.stringify(c.autoIncrement),indexList:"{}"},e=new a.IDBObjectStore(d,this.__versionTransaction);return a.IDBObjectStore.__createObjectStore(this,e),e},b.prototype.deleteObjectStore=function(b){if(0===arguments.length)throw new TypeError("No object store name was specified");var c=this.__objectStores[b];if(!c)throw a.util.createDOMException("NotFoundError",'Object store "'+b+'" does not exist in '+this.name);this.__versionTransaction.__assertVersionChange(),a.IDBObjectStore.__deleteObjectStore(this,c)},b.prototype.close=function(){this.__closed=!0},b.prototype.transaction=function(b,c){if(this.__closed)throw a.util.createDOMException("InvalidStateError","An attempt was made to start a new transaction on a database connection that is not open");if("number"==typeof c?(c=1===c?IDBTransaction.READ_WRITE:IDBTransaction.READ_ONLY,a.DEBUG&&console.log("Mode should be a string, but was specified as ",c)):c=c||IDBTransaction.READ_ONLY,c!==IDBTransaction.READ_ONLY&&c!==IDBTransaction.READ_WRITE)throw new TypeError("Invalid transaction mode: "+c);if(b="string"==typeof b?[b]:b,0===b.length)throw a.util.createDOMException("InvalidAccessError","No object store names were specified");for(var d=0;d<b.length;d++)if(!this.objectStoreNames.contains(b[d]))throw a.util.createDOMException("NotFoundError",'The "'+b[d]+'" object store does not exist');var e=new a.IDBTransaction(this,b,c);return e},a.IDBDatabase=b}(idbModules),function(a){"use strict";function b(){this.modules=a}var c=4194304;if(window.openDatabase){var d=window.openDatabase("__sysdb__",1,"System Database",c);d.transaction(function(a){a.executeSql("CREATE TABLE IF NOT EXISTS dbVersions (name VARCHAR(255), version INT);",[])},function(){a.DEBUG&&console.log("Error in sysdb transaction - when creating dbVersions",arguments)}),b.prototype.open=function(b,e){function f(b){if(!i){i=!0;var c=a.util.createEvent("error",arguments);h.readyState="done",h.error=b||"DOMError",a.util.callback("onerror",h,c)}}function g(g){var i=window.openDatabase(b,1,b,c);if(h.readyState="done","undefined"==typeof e&&(e=g||1),0>=e||g>e){var j=a.util.createDOMError("VersionError","An attempt was made to open a database using a lower version than the existing version.",e);return void f(j)}i.transaction(function(c){c.executeSql("CREATE TABLE IF NOT EXISTS __sys__ (name VARCHAR(255), keyPath VARCHAR(255), autoInc BOOLEAN, indexList BLOB)",[],function(){c.executeSql("SELECT * FROM __sys__",[],function(c,j){var k=a.util.createEvent("success");h.source=h.result=new a.IDBDatabase(i,b,e,j),e>g?d.transaction(function(c){c.executeSql("UPDATE dbVersions set version = ? where name = ?",[e,b],function(){var b=a.util.createEvent("upgradeneeded");b.oldVersion=g,b.newVersion=e,h.transaction=h.result.__versionTransaction=new a.IDBTransaction(h.source,[],a.IDBTransaction.VERSION_CHANGE),h.transaction.__addToTransactionQueue(function(c,d,e){a.util.callback("onupgradeneeded",h,b),e()}),h.transaction.__oncomplete=function(){h.transaction=null;var b=a.util.createEvent("success");a.util.callback("onsuccess",h,b)}},f)},f):a.util.callback("onsuccess",h,k)},f)},f)},f)}var h=new a.IDBOpenDBRequest,i=!1;if(0===arguments.length)throw new TypeError("Database name is required");if(2===arguments.length&&(e=parseFloat(e),isNaN(e)||!isFinite(e)||0>=e))throw new TypeError("Invalid database version: "+e);

return b+="",d.transaction(function(a){a.executeSql("SELECT * FROM dbVersions where name = ?",[b],function(a,c){0===c.rows.length?a.executeSql("INSERT INTO dbVersions VALUES (?,?)",[b,e||1],function(){g(0)},f):g(c.rows.item(0).version)},f)},f),h},b.prototype.deleteDatabase=function(b){function e(b,c){if(!h){1===arguments.length&&(c=b),g.readyState="done",g.error=c||"DOMError";var d=a.util.createEvent("error");d.debug=arguments,a.util.callback("onerror",g,d),h=!0}}function f(){d.transaction(function(c){c.executeSql("DELETE FROM dbVersions where name = ? ",[b],function(){g.result=void 0;var b=a.util.createEvent("success");b.newVersion=null,b.oldVersion=i,a.util.callback("onsuccess",g,b)},e)},e)}var g=new a.IDBOpenDBRequest,h=!1,i=null;if(0===arguments.length)throw new TypeError("Database name is required");return b+="",d.transaction(function(d){d.executeSql("SELECT * FROM dbVersions where name = ?",[b],function(d,h){if(0===h.rows.length){g.result=void 0;var j=a.util.createEvent("success");return j.newVersion=null,j.oldVersion=i,void a.util.callback("onsuccess",g,j)}i=h.rows.item(0).version;var k=window.openDatabase(b,1,b,c);k.transaction(function(b){b.executeSql("SELECT * FROM __sys__",[],function(b,c){var d=c.rows;!function g(c){c>=d.length?b.executeSql("DROP TABLE __sys__",[],function(){f()},e):b.executeSql("DROP TABLE "+a.util.quote(d.item(c).name),[],function(){g(c+1)},function(){g(c+1)})}(0)},function(a){f()})},e)})},e),g},b.prototype.cmp=function(b,c){if(arguments.length<2)throw new TypeError("You must provide two keys to be compared");a.Key.validate(b),a.Key.validate(c);var d=a.Key.encode(b),e=a.Key.encode(c),f=d>e?1:d===e?0:-1;if(a.DEBUG){var g=a.Key.decode(d),h=a.Key.decode(e);"object"==typeof b&&(b=JSON.stringify(b),g=JSON.stringify(g)),"object"==typeof c&&(c=JSON.stringify(c),h=JSON.stringify(h)),g!==b&&console.warn(b+" was incorrectly encoded as "+g),h!==c&&console.warn(c+" was incorrectly encoded as "+h)}return f},a.shimIndexedDB=new b,a.IDBFactory=b}}(idbModules),function(a,b){"use strict";function c(b,c){try{a[b]=c}catch(d){}if(a[b]!==c&&Object.defineProperty){try{Object.defineProperty(a,b,{value:c})}catch(d){}a[b]!==c&&a.console&&console.warn&&console.warn("Unable to shim "+b)}}"undefined"!=typeof a.openDatabase&&(c("shimIndexedDB",b.shimIndexedDB),a.shimIndexedDB&&(a.shimIndexedDB.__useShim=function(){c("indexedDB",b.shimIndexedDB),c("IDBFactory",b.IDBFactory),c("IDBDatabase",b.IDBDatabase),c("IDBObjectStore",b.IDBObjectStore),c("IDBIndex",b.IDBIndex),c("IDBTransaction",b.IDBTransaction),c("IDBCursor",b.IDBCursor),c("IDBKeyRange",b.IDBKeyRange),c("IDBRequest",b.IDBRequest),c("IDBOpenDBRequest",b.IDBOpenDBRequest),c("IDBVersionChangeEvent",b.IDBVersionChangeEvent)},a.shimIndexedDB.__debug=function(a){b.DEBUG=a})),"indexedDB"in a||(a.indexedDB=a.indexedDB||a.webkitIndexedDB||a.mozIndexedDB||a.oIndexedDB||a.msIndexedDB);var d=!1;if((navigator.userAgent.match(/Android 2/)||navigator.userAgent.match(/Android 3/)||navigator.userAgent.match(/Android 4\.[0-3]/))&&(navigator.userAgent.match(/Chrome/)||(d=!0)),"undefined"!=typeof a.indexedDB&&a.indexedDB&&!d||"undefined"==typeof a.openDatabase){a.IDBDatabase=a.IDBDatabase||a.webkitIDBDatabase,a.IDBTransaction=a.IDBTransaction||a.webkitIDBTransaction,a.IDBCursor=a.IDBCursor||a.webkitIDBCursor,a.IDBKeyRange=a.IDBKeyRange||a.webkitIDBKeyRange,a.IDBTransaction||(a.IDBTransaction={});try{a.IDBTransaction.READ_ONLY=a.IDBTransaction.READ_ONLY||"readonly",a.IDBTransaction.READ_WRITE=a.IDBTransaction.READ_WRITE||"readwrite"}catch(e){}}else a.shimIndexedDB.__useShim()}(window,idbModules);
//# sourceMappingURL=indexeddbshim.min.js.map


window.onload = init;

function init() {
    inicioBD();

    var posicion = "par";

    leerBD();


    var button = document.getElementById("add_boton");
    button.addEventListener("click", crearNota, false);

    /* Manejador para que no haga enter en el input */
    var texto = document.getElementById("nota_text");
    texto.value = "";
    texto.addEventListener("keydown", function (event) {
        if (event.keyCode === 13) {
            event.preventDefault();
            crearNota();
        }
    }, false);

    var borrar = document.getElementById("borrar");
    borrar.addEventListener("click", borrarBD, false);

    var borrarV = document.getElementById("borrarValores");
    borrarV.addEventListener("click", borrarValores, false);

    //Evento para ver todo
    var verTodo = document.getElementById("buscarTodos");
    var ul = document.getElementById("notas");

    verTodo.addEventListener("click", function (event) {
        ul.innerHTML = "";
        posicion = "par";
        leerBD();
    }, false);

    //Evento para buscar por color
    var verColor = document.getElementById("buscarColorB");

    verColor.addEventListener("click", function (event) {
        var opcion = document.getElementById("buscarColor").selectedIndex;
        var opciones = document.getElementById("buscarColor");
        var color = opciones.options[opcion].value;

        ul.innerHTML = "";
        posicion = "par";
        leerColor(color);
    }, false);

    //Evento para buscar por texto
    var verTexto = document.getElementById("buscarTextoB");

    verTexto.addEventListener("click", function (event) {
        var texto = document.getElementById("buscarTexto").value;

        ul.innerHTML = "";
        posicion = "par";
        leerNota(texto);
    }, false);

    //Evento para buscar por texto multiple
    var verTextoM = document.getElementById("buscarTextoMulB");

    verTextoM.addEventListener("click", function (event) {
        var texto = document.getElementById("buscarTextoMul").value;

        ul.innerHTML = "";
        posicion = "par";
        leerNotaMultiple(texto);
    }, false);

    //Evento para buscar por clave
    var verClave = document.getElementById("buscarClaveB");

    verClave.addEventListener("click", function (event) {
        var clave = document.getElementById("buscarClave").value;

        ul.innerHTML = "";
        posicion = "par";
        leerClave(clave);
    }, false);

    function inicioBD() {
        window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
        window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
        window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;
        if (!window.indexedDB) {
			//var indexedDB = window.shimIndexedDB;
			window.indexedDB = window.shimIndexedDB;

            window.alert("Tu navegador no soporta IndexedDB.");
        }

        var openRequest = indexedDB.open("notas", 1);
        openRequest.onupgradeneeded = function (e) { // cuando es necesario crear el almacen de objetos
            thisDB = e.target.result;
            var almacen = thisDB.createObjectStore("lista", {
                keyPath: "clave"
            }); // crear almacen
            almacen.createIndex('texto', 'texto', {
                unique: false
            });
            almacen.createIndex('color', 'color', {
                unique: false
            });
        }

        openRequest.onsuccess = function (e) {
            console.log("se ha creado con exito");
        }

        openRequest.onerror = function (e) {
            console.log("ha ocurrido algún error al crear");
        }
    }

    function borrarBD() {
        if (confirm("¿Borrar base de datos?")) {
            window.indexedDB.deleteDatabase('notas');
            location.reload();
        }
    }

    function borrarValores() {
        var open = indexedDB.open("notas", 1);
        open.onsuccess = function (event) {
            thisDB = event.target.result;
            var transaction = thisDB.transaction(["lista"], "readwrite");
            var store = transaction.objectStore("lista");

            store.openCursor().onsuccess = function (event) {
                var cursor = event.target.result;
                if (cursor) {
                    var request = store.delete(cursor.value.clave);
                    cursor.continue();
                }
                location.reload();
            }
        }
    }

    function leerBD() {
        var open = indexedDB.open("notas", 1);
        open.onsuccess = function (event) {
            thisDB = event.target.result;
            var transaction = thisDB.transaction(["lista"], "readonly");
            var store = transaction.objectStore("lista");

            store.openCursor().onsuccess = function (event) {
                var cursor = event.target.result;
                if (cursor) {
                    escribir(cursor.value);
                    cursor.continue();
                }
            }
        }
    }

    function leerNotaMultiple(texto) {
        var open = indexedDB.open("notas", 1);
        open.onsuccess = function (event) {
            thisDB = event.target.result;
            var transaction = thisDB.transaction(["lista"], "readonly");
            var store = transaction.objectStore("lista");

            store.openCursor().onsuccess = function (event) {
                var cursor = event.target.result;
                if (cursor) {
                    if (cursor.value.texto === texto) {
                        escribir(cursor.value);
                    }
                    cursor.continue();
                }
            }
        }
    }

    function leerNota(texto) {
        var open = indexedDB.open("notas", 1);
        open.onsuccess = function (event) {
            thisDB = event.target.result;
            var transaction = thisDB.transaction(["lista"], "readonly");
            var store = transaction.objectStore("lista");

            var index = store.index("texto");
            var request = index.get(texto);

            request.onsuccess = function (event) {
                escribir(request.result);
                console.log("se ha leido con exito");
            }
            request.onerror = function (event) {
                console.log("No se ha leido con exito");
            }
        }
    }

    function leerClave(clave) {
        var open = indexedDB.open("notas", 1);
        open.onsuccess = function (event) {
            thisDB = event.target.result;
            var transaction = thisDB.transaction(["lista"], "readonly");
            var store = transaction.objectStore("lista");

            var request = store.get(clave);

            request.onsuccess = function (event) {
                console.log(request.result);
                escribir(request.result);
                console.log("se ha leido con exito");
            }
            request.onerror = function (event) {
                console.log(event);
                console.log("No se ha leido con exito");
            }

        }
    }

    function leerColor(color) {
        var open = indexedDB.open("notas", 1);
        open.onsuccess = function (event) {
            thisDB = event.target.result;
            var transaction = thisDB.transaction(["lista"], "readonly");
            var store = transaction.objectStore("lista");

            store.openCursor().onsuccess = function (event) {
                var cursor = event.target.result;
                if (cursor) {
                    if (cursor.value.color === color) {
                        escribir(cursor.value);
                    }
                    cursor.continue();
                }
            }
        }
    }

    function crearNota() {
        var valor = document.getElementById("nota_text").value;
        var aviso = document.getElementById("aviso");
        if (valor !== "" && valor !== null) {
            var fecha = new Date();
            var clave = "notas_" + fecha.getTime();

            var opcion = document.getElementById("color").selectedIndex;
            var opciones = document.getElementById("color");
            var color = opciones.options[opcion].value;

            var objetoNota = {
                clave: clave,
                texto: valor,
                color: color
            }

            addBD(objetoNota);
            escribir(objetoNota);
            document.getElementById("nota_text").value = "";
            if (!aviso.getAttribute("hidden")) {
                aviso.setAttribute("hidden", "");
            }
        } else if (valor === "") {
            aviso.removeAttribute("hidden");
        }
    }

    function addBD(objetoNota) {
        var open = indexedDB.open("notas", 1);
        open.onsuccess = function (event) {
            thisDB = event.target.result;
            var transaction = thisDB.transaction(["lista"], "readwrite");
            var store = transaction.objectStore("lista");

            var request = store.add(objetoNota);

            request.onerror = function (e) {
                console.log("No se ha guardado con exito");
            }

            request.onsuccess = function (e) {
                console.log("Se ha guardado con exito");
            }
        }
    }


    function borrarNota(e) {
        var valor = e.textContent;
        if (confirm('¿Está Seguro de eliminar la nota ' + valor + '?')) {
            var indice = e.getAttribute("id");

            var open = indexedDB.open("notas", 1);
            open.onsuccess = function (event) {
                thisDB = event.target.result;
                var transaction = thisDB.transaction(["lista"], "readwrite");
                var store = transaction.objectStore("lista");

                var request = store.delete(indice);
                e.parentNode.removeChild(e);

                request.onerror = function (e) {
                    console.log("No se ha borrado con exito");
                }

                request.onsuccess = function (e) {
                    console.log("Se ha borrado con exito");
                }
            }
        }
    }

    function escribir(objetoNota) {
        var notas = document.getElementById("notas");
        var nota = document.createElement("li");
        if (posicion === "par") {
            posicion = "impar";
        } else {
            posicion = "par";
        }
        nota.setAttribute("class", objetoNota.color + " " + posicion);
        nota.setAttribute("id", objetoNota.clave);

        var span = document.createElement("span");
        span.setAttribute("class", "nota");
        span.textContent = objetoNota.texto;
        nota.appendChild(span);
        nota.addEventListener("click", function (event) {
            borrarNota(event.currentTarget);
        }, false);
        notas.appendChild(nota);
    }
}
