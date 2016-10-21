/*
 * This file is part of DCinside Lite.
 * DCinside Lite is free software: Anyone is free to copy, modify, publish, use, compile, sell, or distribute this software, either in source code form or as a compiled binary, for any purpose, commercial or non-commercial, and by any means.
 * DCinside Lite is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 */

var $ = function(id) {return document.querySelector(id);}
var cElement = function(tag,insert,property,func) {
	var _DIRECT = ["className", "innerHTML", "textContent"];
	var element;
	if(!tag)
		element= document.createTextNode(property);
	else
		element= document.createElement(tag);
	if(insert) {
		var parent;
		var before = null;
		var target = null;
		if(insert.constructor === Array) {
			var target = insert[1];
			if(typeof target === "number") {
				parent = insert[0];
				before = parent.childNodes[target];
			} else {
				before = insert[0];
				parent = before.parentNode;
				if(target === "next") {
					before = before.nextSibling;
				}
			}
		} else {
			parent = insert;
		}
		if(target == 'replace')
			parent.replaceChild(element,before);
		else
			parent.insertBefore(element,before);
	}
	if(!tag)
		return element;
	if(property) {
		if(typeof property === "object") {
			for(var i in property) {
				if(property.hasOwnProperty(i)) {
					if(_DIRECT.contains(i))
						element[i] = property[i];
					else
						element.setAttribute(i, property[i]);
				}
			}
		} else {
			element.textContent = property;
		}
	}
	if(func) {
		element.addEventListener("click",func,false);
	}
	return element;
};

Array.prototype.contains = function(needle) {
	for(var i=0; i < this.length; i++) if(this[i] === needle) return true;
	return false;
};

var parseQuery = function(str) {
	str = str.substr(str.indexOf("?")+1);
	str = str.split("&");
	var query = {};
	var split;
	for(var i=0,l=str.length ; i<l ; i+=1) {
		split = str[i].split("=");
		query[split[0]] = split[1];
	}
	return query;
};

var ePrevent = function(e) {
	e.stopPropagation();
	e.preventDefault();
};

var simpleRequest = function(url,callback,method,headers,data) {
	var details = {method:method?method:'GET',url:url,timeout:3000};
	if(method) {
		if(method.indexOf('-b')!==-1) {
			details.responseType = 'arraybuffer';
			details.method=method.substr(0,method.length-2);
		}
	}
	if(callback) {
		if(typeof callback === 'object') {
			details.onload = function(response){callback['onload'](response);};
			details.onerror = function(response){callback['onerror'](response);};
		}
		else
			details.onload = function(response){callback(response);};
	}
	if(headers) {
		details.headers = headers;
	}
	if(data) {
		details.data = data;
	}
	xmlhttpRequest(details);
};

var xmlhttpRequest = function(details) {
		var xmlhttp = new XMLHttpRequest();
		if(details.responseType)
			xmlhttp.responseType = details.responseType;
		xmlhttp.onreadystatechange = function() {
			var responseState = {
				response:(xmlhttp.readyState===4 ? xmlhttp.response : ""),
				responseXML:(xmlhttp.readyState===4 && (xmlhttp.responseType=='' || xmlhttp.responseType=='document') ? xmlhttp.responseXML : ""),
				responseText:(xmlhttp.readyState===4 && (xmlhttp.responseType=='' || xmlhttp.responseType=='document') ? xmlhttp.responseText : ""),
				readyState:xmlhttp.readyState,
				responseHeaders:(xmlhttp.readyState===4 ? xmlhttp.getAllResponseHeaders() : ""),
				status:(xmlhttp.readyState===4 ? xmlhttp.status : 0),
				statusText:(xmlhttp.readyState===4 ? xmlhttp.statusText : "")
			};
			if(details.onreadystatechange) {
				details.onreadystatechange(responseState);
			}
			if(xmlhttp.readyState===4) {
				if(details.onload && xmlhttp.status>=200 && xmlhttp.status<300) {
					details.onload(responseState);
				}
				if(details.onerror && (xmlhttp.status<200 || xmlhttp.status>=300)) {
					details.onerror(responseState);
				}
			}
		};
		try { //cannot do cross domain
			xmlhttp.open(details.method, details.url);
		} catch(e) {
			if( details.onerror ) { //simulate a real error
				details.onerror({responseXML:"",responseText:"",readyState:4,responseHeaders:"",status:403,statusText:"Forbidden"});
			}
			return;
		}
		if(details.headers) {
			for(var prop in details.headers) {
				if(details.headers.hasOwnProperty(prop)) {
					xmlhttp.setRequestHeader(prop, details.headers[prop]);
				}
			}
		}
		xmlhttp.send( (typeof(details.data)!=="undefined")?details.data:null );
};

var htos = function(hex) {
	return atos(htoa(hex));
};

var htoa = function (hex) {
	var hex = hex.toString();
	var arr = [];
	var c=0;
	for (var i = 0; i < hex.length; i += 2)
		arr[c++] = parseInt(hex.substr(i, 2), 16);
	return arr;
};

var atos = function(arr) {
    for (var i=0, l=arr.length, s='', c; c = arr[i++];)
        s += String.fromCharCode(
            c > 0xdf && c < 0xf0 && i < l-1
                ? (c & 0xf) << 12 | (arr[i++] & 0x3f) << 6 | arr[i++] & 0x3f
            : c > 0x7f && i < l
                ? (c & 0x1f) << 6 | arr[i++] & 0x3f
            : c
        );
    return s;
};

var removeElement = function(e) {
	return e.parentNode.removeChild(e);
};

var removeEventListenerAll = function(_this){
	var clone=_this.cloneNode();
	while(_this.firstChild){
		clone.appendChild(_this.lastChild);
	}
	_this.parentNode.replaceChild(clone, _this);
	return clone;
};

var time = function() { return parseInt((new Date()).getTime()/1000); };
var number_format = function(number, decimals, dec_point, thousands_sep) {
  number = (number + '')
    .replace(/[^0-9+\-Ee.]/g, '');
  var n = !isFinite(+number) ? 0 : +number,
    prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
    sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
    dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
    s = '',
    toFixedFix = function(n, prec) {
      var k = Math.pow(10, prec);
      return '' + (Math.round(n * k) / k)
        .toFixed(prec);
    };
  s = (prec ? toFixedFix(n, prec) : '' + Math.round(n))
    .split('.');
  if (s[0].length > 3) {
    s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
  }
  if ((s[1] || '')
    .length < prec) {
    s[1] = s[1] || '';
    s[1] += new Array(prec - s[1].length + 1)
      .join('0');
  }
  return s.join(dec);
}
