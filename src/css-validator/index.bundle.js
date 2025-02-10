var o = Object.defineProperty;

var h = Object.getOwnPropertyDescriptor;
var p = Object.getOwnPropertyNames;
var v = Object.prototype.hasOwnProperty;
var x = (r, e) => { for (var s in e) o(r, s, { get: e[s], enumerable: !0 }) }, R = (r, e, s, t) => {
  if (e && typeof e == "object" || typeof e == "function") for (let a of p(e)) !v.call(r, a) && a !== s && o(r, a, { get: () => e[a], enumerable: !(t = h(e, a)) || t.enumerable });
  return r
};
var E = r => R(o({}, "__esModule", { value: !0 }), r);
var w = {};
x(w, { createValidRules: () => c, isClassValid: () => l, reportErrors: () => f });
module.exports = E(w);
var n = require("@master/css"), u = require("csstree-validator");

function l(r, e) {
  let s;
  e?.css ? s = e?.css : s = new n.MasterCSS(e?.config);
  let t = s.create(r);
  if (t.length) {
    for (let a of t) if ((0, u.validate)(a.text, r).length) return !1;
    return !0
  } else return !1
} var S = require("csstree-validator"), g = require("@master/css");

function f(r, e) {
  let s;
  e?.css ? s = e?.css : s = new g.MasterCSS(e?.config);
  let t = s.create(r);
  if (t.length) {
    let a = [];
    for (let d of t) {
      let M = (0, S.validate)(d.text, r);
      for (let i of M) i.class = r, a.push(i)
    } return a
  } else return [{ class: r, message: `Invalid Master CSS class "${r}"`, rawMessage: "Mismatch" }]
} var C = require("@master/css"), m = require("csstree-validator");

function c(r, e) {
  let s;
  e?.css ? s = e?.css : s = new C.MasterCSS(e?.config);
  let t = s.create(r);
  if (t.length) {
    for (let a of t) if ((0, m.validate)(a.text, r).length) return [];
    return t
  } else return []
} 0 && (module.exports = { createValidRules, isClassValid, reportErrors });
