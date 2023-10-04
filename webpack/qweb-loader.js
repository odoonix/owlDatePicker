"use strict";

exports.default = loader;

var _loaderUtils = require("loader-utils");
var _schemaUtils = require("schema-utils");

function loader(source) {
  const str = JSON.stringify(source).replace(/\u2028/g, '\\u2028').replace(/\u2029/g, '\\u2029');
  var res= `
import { assets } from "@web/core/assets"; 
assets.loadXML(${str});
`;
  return res;
}