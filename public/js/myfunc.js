String.prototype.string = function(len){
  var s = '', i = 0;
  while (i++ < len) { s += this; }
  return s;
};

String.prototype.zf = function(len){
  return "0".string(len - this.length) + this;
};
Number.prototype.zf = function(len){
  return this.toString().zf(len);
};
