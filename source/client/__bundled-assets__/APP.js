var __moduleIifeResult = (() => {
  var __defProp = Object.defineProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };

  // shared/deps/preact/mod.ts
  var mod_exports = {};
  __export(mod_exports, {
    Component: () => W,
    Fragment: () => I,
    cloneElement: () => he,
    createContext: () => ve,
    createElement: () => le,
    createRef: () => de,
    h: () => le,
    hydrate: () => ae,
    isValidElement: () => oe,
    options: () => h2,
    render: () => pe,
    toChildArray: () => ie
  });

  // https://esm.sh/stable/preact@10.17.1/denonext/preact.mjs
  var M;
  var h2;
  var J;
  var oe;
  var S;
  var z;
  var K;
  var $;
  var Q;
  var T = {};
  var X = [];
  var re = /acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|itera/i;
  var F = Array.isArray;
  function C(t, e) {
    for (var n in e)
      t[n] = e[n];
    return t;
  }
  function Y(t) {
    var e = t.parentNode;
    e && e.removeChild(t);
  }
  function le(t, e, n) {
    var r, l2, o2, i = {};
    for (o2 in e)
      o2 == "key" ? r = e[o2] : o2 == "ref" ? l2 = e[o2] : i[o2] = e[o2];
    if (arguments.length > 2 && (i.children = arguments.length > 3 ? M.call(arguments, 2) : n), typeof t == "function" && t.defaultProps != null)
      for (o2 in t.defaultProps)
        i[o2] === void 0 && (i[o2] = t.defaultProps[o2]);
    return D(t, i, r, l2, null);
  }
  function D(t, e, n, r, l2) {
    var o2 = { type: t, props: e, key: n, ref: r, __k: null, __: null, __b: 0, __e: null, __d: void 0, __c: null, __h: null, constructor: void 0, __v: l2 ?? ++J };
    return l2 == null && h2.vnode != null && h2.vnode(o2), o2;
  }
  function de() {
    return { current: null };
  }
  function I(t) {
    return t.children;
  }
  function W(t, e) {
    this.props = t, this.context = e;
  }
  function L(t, e) {
    if (e == null)
      return t.__ ? L(t.__, t.__.__k.indexOf(t) + 1) : null;
    for (var n; e < t.__k.length; e++)
      if ((n = t.__k[e]) != null && n.__e != null)
        return n.__e;
    return typeof t.type == "function" ? L(t) : null;
  }
  function Z(t) {
    var e, n;
    if ((t = t.__) != null && t.__c != null) {
      for (t.__e = t.__c.base = null, e = 0; e < t.__k.length; e++)
        if ((n = t.__k[e]) != null && n.__e != null) {
          t.__e = t.__c.base = n.__e;
          break;
        }
      return Z(t);
    }
  }
  function B(t) {
    (!t.__d && (t.__d = true) && S.push(t) && !H.__r++ || z !== h2.debounceRendering) && ((z = h2.debounceRendering) || K)(H);
  }
  function H() {
    var t, e, n, r, l2, o2, i, c2, u;
    for (S.sort($); t = S.shift(); )
      t.__d && (e = S.length, r = void 0, l2 = void 0, o2 = void 0, c2 = (i = (n = t).__v).__e, (u = n.__P) && (r = [], l2 = [], (o2 = C({}, i)).__v = i.__v + 1, R(u, i, o2, n.__n, u.ownerSVGElement !== void 0, i.__h != null ? [c2] : null, r, c2 ?? L(i), i.__h, l2), _e(r, i, l2), i.__e != c2 && Z(i)), S.length > e && S.sort($));
    H.__r = 0;
  }
  function ee(t, e, n, r, l2, o2, i, c2, u, x2, d2) {
    var _, m, f, s, p2, w2, a, v2, b2, g2 = 0, y2 = r && r.__k || X, U2 = y2.length, P = U2, E2 = e.length;
    for (n.__k = [], _ = 0; _ < E2; _++)
      (s = n.__k[_] = (s = e[_]) == null || typeof s == "boolean" || typeof s == "function" ? null : typeof s == "string" || typeof s == "number" || typeof s == "bigint" ? D(null, s, null, null, s) : F(s) ? D(I, { children: s }, null, null, null) : s.__b > 0 ? D(s.type, s.props, s.key, s.ref ? s.ref : null, s.__v) : s) != null ? (s.__ = n, s.__b = n.__b + 1, (v2 = se(s, y2, a = _ + g2, P)) === -1 ? f = T : (f = y2[v2] || T, y2[v2] = void 0, P--), R(t, s, f, l2, o2, i, c2, u, x2, d2), p2 = s.__e, (m = s.ref) && f.ref != m && (f.ref && j(f.ref, null, s), d2.push(m, s.__c || p2, s)), p2 != null && (w2 == null && (w2 = p2), (b2 = f === T || f.__v === null) ? v2 == -1 && g2-- : v2 !== a && (v2 === a + 1 ? g2++ : v2 > a ? P > E2 - a ? g2 += v2 - a : g2-- : g2 = v2 < a && v2 == a - 1 ? v2 - a : 0), a = _ + g2, typeof s.type != "function" || v2 === a && f.__k !== s.__k ? typeof s.type == "function" || v2 === a && !b2 ? s.__d !== void 0 ? (u = s.__d, s.__d = void 0) : u = p2.nextSibling : u = ne(t, p2, u) : u = te(s, u, t), typeof n.type == "function" && (n.__d = u))) : (f = y2[_]) && f.key == null && f.__e && (f.__e == u && (u = L(f)), O(f, f, false), y2[_] = null);
    for (n.__e = w2, _ = U2; _--; )
      y2[_] != null && (typeof n.type == "function" && y2[_].__e != null && y2[_].__e == n.__d && (n.__d = y2[_].__e.nextSibling), O(y2[_], y2[_]));
  }
  function te(t, e, n) {
    for (var r, l2 = t.__k, o2 = 0; l2 && o2 < l2.length; o2++)
      (r = l2[o2]) && (r.__ = t, e = typeof r.type == "function" ? te(r, e, n) : ne(n, r.__e, e));
    return e;
  }
  function ie(t, e) {
    return e = e || [], t == null || typeof t == "boolean" || (F(t) ? t.some(function(n) {
      ie(n, e);
    }) : e.push(t)), e;
  }
  function ne(t, e, n) {
    return n == null || n.parentNode !== t ? t.insertBefore(e, null) : e == n && e.parentNode != null || t.insertBefore(e, n), e.nextSibling;
  }
  function se(t, e, n, r) {
    var l2 = t.key, o2 = t.type, i = n - 1, c2 = n + 1, u = e[n];
    if (u === null || u && l2 == u.key && o2 === u.type)
      return n;
    if (r > (u != null ? 1 : 0))
      for (; i >= 0 || c2 < e.length; ) {
        if (i >= 0) {
          if ((u = e[i]) && l2 == u.key && o2 === u.type)
            return i;
          i--;
        }
        if (c2 < e.length) {
          if ((u = e[c2]) && l2 == u.key && o2 === u.type)
            return c2;
          c2++;
        }
      }
    return -1;
  }
  function ce(t, e, n, r, l2) {
    var o2;
    for (o2 in n)
      o2 === "children" || o2 === "key" || o2 in e || A(t, o2, null, n[o2], r);
    for (o2 in e)
      l2 && typeof e[o2] != "function" || o2 === "children" || o2 === "key" || o2 === "value" || o2 === "checked" || n[o2] === e[o2] || A(t, o2, e[o2], n[o2], r);
  }
  function G(t, e, n) {
    e[0] === "-" ? t.setProperty(e, n ?? "") : t[e] = n == null ? "" : typeof n != "number" || re.test(e) ? n : n + "px";
  }
  function A(t, e, n, r, l2) {
    var o2;
    e:
      if (e === "style")
        if (typeof n == "string")
          t.style.cssText = n;
        else {
          if (typeof r == "string" && (t.style.cssText = r = ""), r)
            for (e in r)
              n && e in n || G(t.style, e, "");
          if (n)
            for (e in n)
              r && n[e] === r[e] || G(t.style, e, n[e]);
        }
      else if (e[0] === "o" && e[1] === "n")
        o2 = e !== (e = e.replace(/(PointerCapture)$|Capture$/, "$1")), e = e.toLowerCase() in t ? e.toLowerCase().slice(2) : e.slice(2), t.l || (t.l = {}), t.l[e + o2] = n, n ? r || t.addEventListener(e, o2 ? q : V, o2) : t.removeEventListener(e, o2 ? q : V, o2);
      else if (e !== "dangerouslySetInnerHTML") {
        if (l2)
          e = e.replace(/xlink(H|:h)/, "h").replace(/sName$/, "s");
        else if (e !== "width" && e !== "height" && e !== "href" && e !== "list" && e !== "form" && e !== "tabIndex" && e !== "download" && e !== "rowSpan" && e !== "colSpan" && e in t)
          try {
            t[e] = n ?? "";
            break e;
          } catch {
          }
        typeof n == "function" || (n == null || n === false && e[4] !== "-" ? t.removeAttribute(e) : t.setAttribute(e, n));
      }
  }
  function V(t) {
    return this.l[t.type + false](h2.event ? h2.event(t) : t);
  }
  function q(t) {
    return this.l[t.type + true](h2.event ? h2.event(t) : t);
  }
  function R(t, e, n, r, l2, o2, i, c2, u, x2) {
    var d2, _, m, f, s, p2, w2, a, v2, b2, g2, y2, U2, P, E2, k2 = e.type;
    if (e.constructor !== void 0)
      return null;
    n.__h != null && (u = n.__h, c2 = e.__e = n.__e, e.__h = null, o2 = [c2]), (d2 = h2.__b) && d2(e);
    e:
      if (typeof k2 == "function")
        try {
          if (a = e.props, v2 = (d2 = k2.contextType) && r[d2.__c], b2 = d2 ? v2 ? v2.props.value : d2.__ : r, n.__c ? w2 = (_ = e.__c = n.__c).__ = _.__E : ("prototype" in k2 && k2.prototype.render ? e.__c = _ = new k2(a, b2) : (e.__c = _ = new W(a, b2), _.constructor = k2, _.render = fe), v2 && v2.sub(_), _.props = a, _.state || (_.state = {}), _.context = b2, _.__n = r, m = _.__d = true, _.__h = [], _._sb = []), _.__s == null && (_.__s = _.state), k2.getDerivedStateFromProps != null && (_.__s == _.state && (_.__s = C({}, _.__s)), C(_.__s, k2.getDerivedStateFromProps(a, _.__s))), f = _.props, s = _.state, _.__v = e, m)
            k2.getDerivedStateFromProps == null && _.componentWillMount != null && _.componentWillMount(), _.componentDidMount != null && _.__h.push(_.componentDidMount);
          else {
            if (k2.getDerivedStateFromProps == null && a !== f && _.componentWillReceiveProps != null && _.componentWillReceiveProps(a, b2), !_.__e && (_.shouldComponentUpdate != null && _.shouldComponentUpdate(a, _.__s, b2) === false || e.__v === n.__v)) {
              for (e.__v !== n.__v && (_.props = a, _.state = _.__s, _.__d = false), e.__e = n.__e, e.__k = n.__k, e.__k.forEach(function(N) {
                N && (N.__ = e);
              }), g2 = 0; g2 < _._sb.length; g2++)
                _.__h.push(_._sb[g2]);
              _._sb = [], _.__h.length && i.push(_);
              break e;
            }
            _.componentWillUpdate != null && _.componentWillUpdate(a, _.__s, b2), _.componentDidUpdate != null && _.__h.push(function() {
              _.componentDidUpdate(f, s, p2);
            });
          }
          if (_.context = b2, _.props = a, _.__P = t, _.__e = false, y2 = h2.__r, U2 = 0, "prototype" in k2 && k2.prototype.render) {
            for (_.state = _.__s, _.__d = false, y2 && y2(e), d2 = _.render(_.props, _.state, _.context), P = 0; P < _._sb.length; P++)
              _.__h.push(_._sb[P]);
            _._sb = [];
          } else
            do
              _.__d = false, y2 && y2(e), d2 = _.render(_.props, _.state, _.context), _.state = _.__s;
            while (_.__d && ++U2 < 25);
          _.state = _.__s, _.getChildContext != null && (r = C(C({}, r), _.getChildContext())), m || _.getSnapshotBeforeUpdate == null || (p2 = _.getSnapshotBeforeUpdate(f, s)), ee(t, F(E2 = d2 != null && d2.type === I && d2.key == null ? d2.props.children : d2) ? E2 : [E2], e, n, r, l2, o2, i, c2, u, x2), _.base = e.__e, e.__h = null, _.__h.length && i.push(_), w2 && (_.__E = _.__ = null);
        } catch (N) {
          e.__v = null, (u || o2 != null) && (e.__e = c2, e.__h = !!u, o2[o2.indexOf(c2)] = null), h2.__e(N, e, n);
        }
      else
        o2 == null && e.__v === n.__v ? (e.__k = n.__k, e.__e = n.__e) : e.__e = ue(n.__e, e, n, r, l2, o2, i, u, x2);
    (d2 = h2.diffed) && d2(e);
  }
  function _e(t, e, n) {
    for (var r = 0; r < n.length; r++)
      j(n[r], n[++r], n[++r]);
    h2.__c && h2.__c(e, t), t.some(function(l2) {
      try {
        t = l2.__h, l2.__h = [], t.some(function(o2) {
          o2.call(l2);
        });
      } catch (o2) {
        h2.__e(o2, l2.__v);
      }
    });
  }
  function ue(t, e, n, r, l2, o2, i, c2, u) {
    var x2, d2, _, m = n.props, f = e.props, s = e.type, p2 = 0;
    if (s === "svg" && (l2 = true), o2 != null) {
      for (; p2 < o2.length; p2++)
        if ((x2 = o2[p2]) && "setAttribute" in x2 == !!s && (s ? x2.localName === s : x2.nodeType === 3)) {
          t = x2, o2[p2] = null;
          break;
        }
    }
    if (t == null) {
      if (s === null)
        return document.createTextNode(f);
      t = l2 ? document.createElementNS("http://www.w3.org/2000/svg", s) : document.createElement(s, f.is && f), o2 = null, c2 = false;
    }
    if (s === null)
      m === f || c2 && t.data === f || (t.data = f);
    else {
      if (o2 = o2 && M.call(t.childNodes), d2 = (m = n.props || T).dangerouslySetInnerHTML, _ = f.dangerouslySetInnerHTML, !c2) {
        if (o2 != null)
          for (m = {}, p2 = 0; p2 < t.attributes.length; p2++)
            m[t.attributes[p2].name] = t.attributes[p2].value;
        (_ || d2) && (_ && (d2 && _.__html == d2.__html || _.__html === t.innerHTML) || (t.innerHTML = _ && _.__html || ""));
      }
      if (ce(t, f, m, l2, c2), _)
        e.__k = [];
      else if (ee(t, F(p2 = e.props.children) ? p2 : [p2], e, n, r, l2 && s !== "foreignObject", o2, i, o2 ? o2[0] : n.__k && L(n, 0), c2, u), o2 != null)
        for (p2 = o2.length; p2--; )
          o2[p2] != null && Y(o2[p2]);
      c2 || ("value" in f && (p2 = f.value) !== void 0 && (p2 !== t.value || s === "progress" && !p2 || s === "option" && p2 !== m.value) && A(t, "value", p2, m.value, false), "checked" in f && (p2 = f.checked) !== void 0 && p2 !== t.checked && A(t, "checked", p2, m.checked, false));
    }
    return t;
  }
  function j(t, e, n) {
    try {
      typeof t == "function" ? t(e) : t.current = e;
    } catch (r) {
      h2.__e(r, n);
    }
  }
  function O(t, e, n) {
    var r, l2;
    if (h2.unmount && h2.unmount(t), (r = t.ref) && (r.current && r.current !== t.__e || j(r, null, e)), (r = t.__c) != null) {
      if (r.componentWillUnmount)
        try {
          r.componentWillUnmount();
        } catch (o2) {
          h2.__e(o2, e);
        }
      r.base = r.__P = null, t.__c = void 0;
    }
    if (r = t.__k)
      for (l2 = 0; l2 < r.length; l2++)
        r[l2] && O(r[l2], e, n || typeof t.type != "function");
    n || t.__e == null || Y(t.__e), t.__ = t.__e = t.__d = void 0;
  }
  function fe(t, e, n) {
    return this.constructor(t, n);
  }
  function pe(t, e, n) {
    var r, l2, o2, i;
    h2.__ && h2.__(t, e), l2 = (r = typeof n == "function") ? null : n && n.__k || e.__k, o2 = [], i = [], R(e, t = (!r && n || e).__k = le(I, null, [t]), l2 || T, T, e.ownerSVGElement !== void 0, !r && n ? [n] : l2 ? null : e.firstChild ? M.call(e.childNodes) : null, o2, !r && n ? n : l2 ? l2.__e : e.firstChild, r, i), _e(o2, t, i);
  }
  function ae(t, e) {
    pe(t, e, ae);
  }
  function he(t, e, n) {
    var r, l2, o2, i, c2 = C({}, t.props);
    for (o2 in t.type && t.type.defaultProps && (i = t.type.defaultProps), e)
      o2 == "key" ? r = e[o2] : o2 == "ref" ? l2 = e[o2] : c2[o2] = e[o2] === void 0 && i !== void 0 ? i[o2] : e[o2];
    return arguments.length > 2 && (c2.children = arguments.length > 3 ? M.call(arguments, 2) : n), D(t.type, c2, r || t.key, l2 || t.ref, null);
  }
  function ve(t, e) {
    var n = { __c: e = "__cC" + Q++, __: t, Consumer: function(r, l2) {
      return r.children(l2);
    }, Provider: function(r) {
      var l2, o2;
      return this.getChildContext || (l2 = [], (o2 = {})[e] = this, this.getChildContext = function() {
        return o2;
      }, this.shouldComponentUpdate = function(i) {
        this.props.value !== i.value && l2.some(function(c2) {
          c2.__e = true, B(c2);
        });
      }, this.sub = function(i) {
        l2.push(i);
        var c2 = i.componentWillUnmount;
        i.componentWillUnmount = function() {
          l2.splice(l2.indexOf(i), 1), c2 && c2.call(i);
        };
      }), r.children;
    } };
    return n.Provider.__ = n.Consumer.contextType = n;
  }
  M = X.slice, h2 = { __e: function(t, e, n, r) {
    for (var l2, o2, i; e = e.__; )
      if ((l2 = e.__c) && !l2.__)
        try {
          if ((o2 = l2.constructor) && o2.getDerivedStateFromError != null && (l2.setState(o2.getDerivedStateFromError(t)), i = l2.__d), l2.componentDidCatch != null && (l2.componentDidCatch(t, r || {}), i = l2.__d), i)
            return l2.__E = l2;
        } catch (c2) {
          t = c2;
        }
    throw t;
  } }, J = 0, oe = function(t) {
    return t != null && t.constructor === void 0;
  }, W.prototype.setState = function(t, e) {
    var n;
    n = this.__s != null && this.__s !== this.state ? this.__s : this.__s = C({}, this.state), typeof t == "function" && (t = t(C({}, n), this.props)), t && C(n, t), t != null && this.__v && (e && this._sb.push(e), B(this));
  }, W.prototype.forceUpdate = function(t) {
    this.__v && (this.__e = true, t && this.__h.push(t), B(this));
  }, W.prototype.render = I, S = [], K = typeof Promise == "function" ? Promise.prototype.then.bind(Promise.resolve()) : setTimeout, $ = function(t, e) {
    return t.__v.__b - e.__v.__b;
  }, H.__r = 0, Q = 0;

  // shared/deps/preact/hooks.ts
  var hooks_exports = {};
  __export(hooks_exports, {
    useCallback: () => L2,
    useContext: () => M2,
    useDebugValue: () => G2,
    useEffect: () => j2,
    useErrorBoundary: () => J2,
    useId: () => K2,
    useImperativeHandle: () => z2,
    useLayoutEffect: () => I2,
    useMemo: () => T2,
    useReducer: () => B2,
    useRef: () => w,
    useState: () => k
  });

  // https://esm.sh/stable/preact@10.17.1/denonext/hooks.js
  var c;
  var o;
  var H2;
  var b;
  var v = 0;
  var x = [];
  var p = [];
  var g = h2.__b;
  var A2 = h2.__r;
  var C2 = h2.diffed;
  var F2 = h2.__c;
  var q2 = h2.unmount;
  function l(_, n) {
    h2.__h && h2.__h(o, _, v || n), v = 0;
    var u = o.__H || (o.__H = { __: [], __h: [] });
    return _ >= u.__.length && u.__.push({ __V: p }), u.__[_];
  }
  function k(_) {
    return v = 1, B2(U, _);
  }
  function B2(_, n, u) {
    var t = l(c++, 2);
    if (t.t = _, !t.__c && (t.__ = [u ? u(n) : U(void 0, n), function(a) {
      var f = t.__N ? t.__N[0] : t.__[0], s = t.t(f, a);
      f !== s && (t.__N = [s, t.__[1]], t.__c.setState({}));
    }], t.__c = o, !o.u)) {
      var i = function(a, f, s) {
        if (!t.__c.__H)
          return true;
        var m = t.__c.__H.__.filter(function(e) {
          return e.__c;
        });
        if (m.every(function(e) {
          return !e.__N;
        }))
          return !h3 || h3.call(this, a, f, s);
        var V2 = false;
        return m.forEach(function(e) {
          if (e.__N) {
            var P = e.__[0];
            e.__ = e.__N, e.__N = void 0, P !== e.__[0] && (V2 = true);
          }
        }), !(!V2 && t.__c.props === a) && (!h3 || h3.call(this, a, f, s));
      };
      o.u = true;
      var h3 = o.shouldComponentUpdate, N = o.componentWillUpdate;
      o.componentWillUpdate = function(a, f, s) {
        if (this.__e) {
          var m = h3;
          h3 = void 0, i(a, f, s), h3 = m;
        }
        N && N.call(this, a, f, s);
      }, o.shouldComponentUpdate = i;
    }
    return t.__N || t.__;
  }
  function j2(_, n) {
    var u = l(c++, 3);
    !h2.__s && y(u.__H, n) && (u.__ = _, u.i = n, o.__H.__h.push(u));
  }
  function I2(_, n) {
    var u = l(c++, 4);
    !h2.__s && y(u.__H, n) && (u.__ = _, u.i = n, o.__h.push(u));
  }
  function w(_) {
    return v = 5, T2(function() {
      return { current: _ };
    }, []);
  }
  function z2(_, n, u) {
    v = 6, I2(function() {
      return typeof _ == "function" ? (_(n()), function() {
        return _(null);
      }) : _ ? (_.current = n(), function() {
        return _.current = null;
      }) : void 0;
    }, u == null ? u : u.concat(_));
  }
  function T2(_, n) {
    var u = l(c++, 7);
    return y(u.__H, n) ? (u.__V = _(), u.i = n, u.__h = _, u.__V) : u.__;
  }
  function L2(_, n) {
    return v = 8, T2(function() {
      return _;
    }, n);
  }
  function M2(_) {
    var n = o.context[_.__c], u = l(c++, 9);
    return u.c = _, n ? (u.__ == null && (u.__ = true, n.sub(o)), n.props.value) : _.__;
  }
  function G2(_, n) {
    h2.useDebugValue && h2.useDebugValue(n ? n(_) : _);
  }
  function J2(_) {
    var n = l(c++, 10), u = k();
    return n.__ = _, o.componentDidCatch || (o.componentDidCatch = function(t, i) {
      n.__ && n.__(t, i), u[1](t);
    }), [u[0], function() {
      u[1](void 0);
    }];
  }
  function K2() {
    var _ = l(c++, 11);
    if (!_.__) {
      for (var n = o.__v; n !== null && !n.__m && n.__ !== null; )
        n = n.__;
      var u = n.__m || (n.__m = [0, 0]);
      _.__ = "P" + u[0] + "-" + u[1]++;
    }
    return _.__;
  }
  function R2() {
    for (var _; _ = x.shift(); )
      if (_.__P && _.__H)
        try {
          _.__H.__h.forEach(d), _.__H.__h.forEach(E), _.__H.__h = [];
        } catch (n) {
          _.__H.__h = [], h2.__e(n, _.__v);
        }
  }
  h2.__b = function(_) {
    o = null, g && g(_);
  }, h2.__r = function(_) {
    A2 && A2(_), c = 0;
    var n = (o = _.__c).__H;
    n && (H2 === o ? (n.__h = [], o.__h = [], n.__.forEach(function(u) {
      u.__N && (u.__ = u.__N), u.__V = p, u.__N = u.i = void 0;
    })) : (n.__h.forEach(d), n.__h.forEach(E), n.__h = [], c = 0)), H2 = o;
  }, h2.diffed = function(_) {
    C2 && C2(_);
    var n = _.__c;
    n && n.__H && (n.__H.__h.length && (x.push(n) !== 1 && b === h2.requestAnimationFrame || ((b = h2.requestAnimationFrame) || S2)(R2)), n.__H.__.forEach(function(u) {
      u.i && (u.__H = u.i), u.__V !== p && (u.__ = u.__V), u.i = void 0, u.__V = p;
    })), H2 = o = null;
  }, h2.__c = function(_, n) {
    n.some(function(u) {
      try {
        u.__h.forEach(d), u.__h = u.__h.filter(function(t) {
          return !t.__ || E(t);
        });
      } catch (t) {
        n.some(function(i) {
          i.__h && (i.__h = []);
        }), n = [], h2.__e(t, u.__v);
      }
    }), F2 && F2(_, n);
  }, h2.unmount = function(_) {
    q2 && q2(_);
    var n, u = _.__c;
    u && u.__H && (u.__H.__.forEach(function(t) {
      try {
        d(t);
      } catch (i) {
        n = i;
      }
    }), u.__H = void 0, n && h2.__e(n, u.__v));
  };
  var D2 = typeof requestAnimationFrame == "function";
  function S2(_) {
    var n, u = function() {
      clearTimeout(t), D2 && cancelAnimationFrame(n), setTimeout(_);
    }, t = setTimeout(u, 100);
    D2 && (n = requestAnimationFrame(u));
  }
  function d(_) {
    var n = o, u = _.__c;
    typeof u == "function" && (_.__c = void 0, u()), o = n;
  }
  function E(_) {
    var n = o;
    _.__c = _.__(), o = n;
  }
  function y(_, n) {
    return !_ || _.length !== n.length || n.some(function(u, t) {
      return u !== _[t];
    });
  }
  function U(_, n) {
    return typeof n == "function" ? n(_) : n;
  }

  // shared/general/throwInvalidPathError.ts
  function throwInvalidPathError(pathIdentifier) {
    throw new Error(`invalid path: ${pathIdentifier}`);
  }

  // source/shared/general/getStewResourceMap.ts
  function getStewResourceMap(api) {
    const { stewBuildId } = api;
    const stewResourcesDirectoryPath = `/stew_${stewBuildId}`;
    const stewAssetsDirectoryPath = "/assets";
    return {
      stewResourcesDirectoryPath,
      stewAssetsDirectoryPath,
      indexHtml: "/index.html",
      faviconIco: "/favicon.ico",
      faviconSvg: "/favicon.svg",
      manifestJson: "/manifest.json",
      robotsTxt: "/robots.txt",
      normalFontWoff: "/assets/RedHatMonoVF.woff2",
      italicFontWoff: "/assets/RedHatMonoVF-Italic.woff2",
      smallIconPng: "/assets/icon-192x192.png",
      mediumIconPng: "/assets/icon-384x384.png",
      largeIconPng: "/assets/icon-512x512.png",
      extraLargeIconPng: "/assets/icon-2048x2048.png",
      appScript: `/app.${stewBuildId}.js`,
      appCss: `/app.${stewBuildId}.css`,
      configPath: `${stewResourcesDirectoryPath}/stew.config.json`,
      modulesDirectoryPath: `${stewResourcesDirectoryPath}/modules`,
      datasetsDirectoryPath: `${stewResourcesDirectoryPath}/datasets`,
      stylesDirectoryPath: `${stewResourcesDirectoryPath}/styles`,
      viewsDirectoryPath: `${stewResourcesDirectoryPath}/views`
    };
  }

  // source/client/shared/styles/globalReset.scss
  var css = `@import "./normalize.css";
.flexContainer, .defaultLayout, input, div, .columnContainer, .rowContainer, .itemContainer {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: flex-start;
  align-items: stretch;
}

.flexChild, .defaultLayout, input, div {
  flex-grow: 0;
  flex-shrink: 1;
  flex-basis: auto;
}

.itemContainer {
  justify-content: center;
  align-items: center;
}

.rowContainer {
  flex-direction: row;
}

.columnContainer {
  flex-direction: column;
}

.textEllipsis {
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.defaultBoxModel, input, div, body {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  border: none;
}

.defaultFont, input, div, body {
  font-family: "Red Hat Mono", monospace;
  line-height: 1.4;
  color: black;
  -webkit-text-size-adjust: 100%;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.themeBorder {
  border: 1.5px solid black;
  border-radius: 4px;
}

.themeFocusOutline {
  outline: solid 3px transparent;
  outline-offset: 0;
  box-shadow: 0 0 0 3px #2196f3;
  border-radius: 4px;
}

.themeFocusWithoutOutline, * {
  outline: none;
  box-shadow: none;
  border-radius: 0;
}

input {
  border: none;
}`;
  document.head.appendChild(document.createElement("style")).appendChild(document.createTextNode(css));

  // source/client/app/components/Page/Page.module.scss
  var css2 = `._flexContainer_ww2p8_1, ._defaultLayout_ww2p8_1, ._columnContainer_ww2p8_1, ._pageContentContainer_ww2p8_1, ._rowContainer_ww2p8_1, ._itemContainer_ww2p8_1, ._pageContainer_ww2p8_1 {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: flex-start;
  align-items: stretch;
}

._flexChild_ww2p8_9, ._defaultLayout_ww2p8_1 {
  flex-grow: 0;
  flex-shrink: 1;
  flex-basis: auto;
}

._itemContainer_ww2p8_1, ._pageContainer_ww2p8_1 {
  justify-content: center;
  align-items: center;
}

._rowContainer_ww2p8_1 {
  flex-direction: row;
}

._columnContainer_ww2p8_1, ._pageContentContainer_ww2p8_1 {
  flex-direction: column;
}

._textEllipsis_ww2p8_28 {
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

._defaultBoxModel_ww2p8_35 {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  border: none;
}

._defaultFont_ww2p8_42 {
  font-family: "Red Hat Mono", monospace;
  line-height: 1.4;
  color: black;
  -webkit-text-size-adjust: 100%;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

._themeBorder_ww2p8_51 {
  border: 1.5px solid black;
  border-radius: 4px;
}

._themeFocusOutline_ww2p8_56 {
  outline: solid 3px transparent;
  outline-offset: 0;
  box-shadow: 0 0 0 3px #2196f3;
  border-radius: 4px;
}

._themeFocusWithoutOutline_ww2p8_63 {
  outline: none;
  box-shadow: none;
  border-radius: 0;
}

._pageContainer_ww2p8_1 {
  width: 100%;
}

._pageContentContainer_ww2p8_1 {
  max-width: 512px;
  flex-basis: 100%;
}

._pageAccessibilityHeader_ww2p8_78 {
  display: none;
}`;
  document.head.appendChild(document.createElement("style")).appendChild(document.createTextNode(css2));
  var Page_module_default = {
    "flexContainer": "_flexContainer_ww2p8_1",
    "defaultLayout": "_defaultLayout_ww2p8_1",
    "columnContainer": "_columnContainer_ww2p8_1",
    "pageContentContainer": "_pageContentContainer_ww2p8_1",
    "rowContainer": "_rowContainer_ww2p8_1",
    "itemContainer": "_itemContainer_ww2p8_1",
    "pageContainer": "_pageContainer_ww2p8_1",
    "flexChild": "_flexChild_ww2p8_9",
    "textEllipsis": "_textEllipsis_ww2p8_28",
    "defaultBoxModel": "_defaultBoxModel_ww2p8_35",
    "defaultFont": "_defaultFont_ww2p8_42",
    "themeBorder": "_themeBorder_ww2p8_51",
    "themeFocusOutline": "_themeFocusOutline_ww2p8_56",
    "themeFocusWithoutOutline": "_themeFocusWithoutOutline_ww2p8_63",
    "pageAccessibilityHeader": "_pageAccessibilityHeader_ww2p8_78"
  };

  // source/client/app/components/Page/Page.tsx
  function Page(props) {
    const { pageAriaHeader, children } = props;
    return /* @__PURE__ */ h("div", { className: Page_module_default.pageContainer }, /* @__PURE__ */ h("h1", { style: { display: "none" } }, pageAriaHeader), /* @__PURE__ */ h(
      "div",
      {
        id: "pageContentContainer",
        role: "main",
        className: Page_module_default.pageContentContainer
      },
      children
    ));
  }

  // global-preact-hooks:global-preact-hooks.js
  var useEffect = (...args) => globalThis.PreactHooks.useEffect(...args);
  var useLayoutEffect = (...args) => globalThis.PreactHooks.useLayoutEffect(...args);
  var useMemo = (...args) => globalThis.PreactHooks.useMemo(...args);
  var useRef = (...args) => globalThis.PreactHooks.useRef(...args);
  var useState = (...args) => globalThis.PreactHooks.useState(...args);

  // source/client/app/StewSegment/hooks/useStickyPageHeaderWorkaround.ts
  function useStickyPageHeaderWorkaround(api) {
    const { stickyPageHeaderWorkaroundClassname } = api;
    const pageHeaderContainerRef = useRef(null);
    useLayoutEffect(() => {
      const pageHeaderContainerElement = pageHeaderContainerRef.current ?? throwInvalidPathError(
        "useStickyPageHeaderWorkaround.pageHeaderContainerElement"
      );
      const pageHeaderContainerObserver = new ResizeObserver(
        (observedElementEntries) => {
          const pageHeaderContainerEntry = observedElementEntries.at(0);
          if (pageHeaderContainerEntry instanceof ResizeObserverEntry) {
            pageHeaderContainerElement.style.setProperty(
              "--page-header-width",
              `${pageHeaderContainerEntry.contentRect.width}px`
            );
            pageHeaderContainerElement.classList.add(
              stickyPageHeaderWorkaroundClassname ?? throwInvalidPathError(
                "useStickyPageHeaderWorkaround.cssModule.stickyPageHeaderWorkaround"
              )
            );
          } else {
            throwInvalidPathError(
              "useStickyPageHeaderWorkaround.pageHeaderContainerEntry"
            );
          }
        }
      );
      pageHeaderContainerObserver.observe(pageHeaderContainerElement);
    }, []);
    return { pageHeaderContainerRef };
  }

  // source/client/app/components/Popover/Popover.module.scss
  var css3 = `._flexContainer_tsgmv_1, ._defaultLayout_tsgmv_1, ._columnContainer_tsgmv_1, ._rowContainer_tsgmv_1, ._itemContainer_tsgmv_1 {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: flex-start;
  align-items: stretch;
}

._flexChild_tsgmv_9, ._defaultLayout_tsgmv_1 {
  flex-grow: 0;
  flex-shrink: 1;
  flex-basis: auto;
}

._itemContainer_tsgmv_1 {
  justify-content: center;
  align-items: center;
}

._rowContainer_tsgmv_1 {
  flex-direction: row;
}

._columnContainer_tsgmv_1 {
  flex-direction: column;
}

._textEllipsis_tsgmv_28 {
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

._defaultBoxModel_tsgmv_35 {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  border: none;
}

._defaultFont_tsgmv_42 {
  font-family: "Red Hat Mono", monospace;
  line-height: 1.4;
  color: black;
  -webkit-text-size-adjust: 100%;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

._themeBorder_tsgmv_51, ._popoverContainer_tsgmv_51 {
  border: 1.5px solid black;
  border-radius: 4px;
}

._themeFocusOutline_tsgmv_56 {
  outline: solid 3px transparent;
  outline-offset: 0;
  box-shadow: 0 0 0 3px #2196f3;
  border-radius: 4px;
}

._themeFocusWithoutOutline_tsgmv_63 {
  outline: none;
  box-shadow: none;
  border-radius: 0;
}

._popoverContainer_tsgmv_51 {
  z-index: 1;
  overflow: hidden;
  touch-action: none;
  background-color: #ffffff;
}

._preventUnderscroll_tsgmv_76 {
  -webkit-overflow-scrolling: none;
  overflow: hidden;
}`;
  document.head.appendChild(document.createElement("style")).appendChild(document.createTextNode(css3));
  var Popover_module_default = {
    "flexContainer": "_flexContainer_tsgmv_1",
    "defaultLayout": "_defaultLayout_tsgmv_1",
    "columnContainer": "_columnContainer_tsgmv_1",
    "rowContainer": "_rowContainer_tsgmv_1",
    "itemContainer": "_itemContainer_tsgmv_1",
    "flexChild": "_flexChild_tsgmv_9",
    "textEllipsis": "_textEllipsis_tsgmv_28",
    "defaultBoxModel": "_defaultBoxModel_tsgmv_35",
    "defaultFont": "_defaultFont_tsgmv_42",
    "themeBorder": "_themeBorder_tsgmv_51",
    "popoverContainer": "_popoverContainer_tsgmv_51",
    "themeFocusOutline": "_themeFocusOutline_tsgmv_56",
    "themeFocusWithoutOutline": "_themeFocusWithoutOutline_tsgmv_63",
    "preventUnderscroll": "_preventUnderscroll_tsgmv_76"
  };

  // source/client/app/components/Popover/Popover.tsx
  function Popover(props) {
    const {
      setPopoverOpen,
      anchorElementRef,
      popoverOpen,
      popoverAriaRole,
      getPopoverLayoutTop,
      PopoverContent,
      customPopoverContentProps
    } = props;
    const popoverRef = useRef(null);
    const { closePopover, windowScrollHandler, windowPointerDownHandler } = useMemo(() => {
      const closePopover2 = () => {
        setPopoverOpen(false);
      };
      return {
        closePopover: closePopover2,
        // needed for when the footer is collapsed on ios
        // css is unable to block the underscroll in that case
        windowScrollHandler: (someScrollEvent) => {
          if (someScrollEvent.target === document && // handle ios bug where footer is collapsed and scrollbar is at the bottom
          window.innerHeight + window.scrollY !== document.body.offsetHeight) {
            closePopover2();
          }
        },
        windowPointerDownHandler: (somePointerEvent) => {
          const popoverElement = popoverRef.current;
          if (popoverElement instanceof HTMLDivElement) {
            const popoverClientRect = popoverElement.getBoundingClientRect();
            const pointerWithinPopover = popoverClientRect && somePointerEvent.clientX >= popoverClientRect.left && somePointerEvent.clientX <= popoverClientRect.right && somePointerEvent.clientY >= popoverClientRect.top && somePointerEvent.clientY <= popoverClientRect.bottom;
            if (!pointerWithinPopover) {
              closePopover2();
            }
          }
        }
      };
    }, []);
    const initialFocusElementRef = useMemo(() => de(), []);
    useEffect(() => {
      const initialFocusElement = initialFocusElementRef.current;
      const anchorDataPointerFocus = anchorElementRef.current?.getAttribute("data-pointer-focus");
      if (popoverOpen && initialFocusElement instanceof HTMLDivElement && typeof anchorDataPointerFocus === "string") {
        handlePopoverOpenWithPointer({
          initialFocusElement,
          windowScrollHandler,
          windowPointerDownHandler,
          anchorDataPointerFocus
        });
      } else if (popoverOpen && initialFocusElement instanceof HTMLDivElement) {
        handlePopoverOpen({
          initialFocusElement,
          windowScrollHandler,
          windowPointerDownHandler
        });
      } else if (popoverOpen === false) {
        handlePopoverClose({
          windowScrollHandler,
          windowPointerDownHandler
        });
      } else {
        throwInvalidPathError("Popover.useEffect[popoverOpen]");
      }
    }, [popoverOpen]);
    const popoverNavigationItemBlurHandler = useMemo(
      () => (someBlurEvent) => {
        const windowBlurOrClickAway = someBlurEvent.relatedTarget === null;
        const tabPreviousEscapeOrEnterSelect = someBlurEvent.relatedTarget === anchorElementRef.current;
        const tabNextEscape = popoverRef.current instanceof HTMLDivElement && someBlurEvent.relatedTarget instanceof HTMLElement ? !popoverRef.current.contains(someBlurEvent.relatedTarget) : true;
        if (windowBlurOrClickAway || tabPreviousEscapeOrEnterSelect) {
          closePopover();
        } else if (tabNextEscape) {
          closePopover();
          anchorElementRef.current instanceof HTMLDivElement ? anchorElementRef.current.focus() : throwInvalidPathError("getPopoverItemBlurHandler.tabNextEscape");
        }
      },
      [anchorElementRef, setPopoverOpen, popoverRef]
    );
    return popoverOpen ? /* @__PURE__ */ h(
      "div",
      {
        tabIndex: -1,
        className: Popover_module_default.popoverContainer,
        role: popoverAriaRole,
        ref: popoverRef,
        onBlur: popoverNavigationItemBlurHandler,
        style: getPopoverLayoutStyle({
          anchorElementRef,
          popoverOpen,
          getPopoverLayoutTop
        }),
        onKeyDown: (someKeyDownEvent) => {
          if (someKeyDownEvent.key === "Escape") {
            anchorElementRef.current instanceof HTMLDivElement ? anchorElementRef.current.focus() : throwInvalidPathError("popoverContainer.onKeyDown.Escape");
          }
        }
      },
      /* @__PURE__ */ h(
        PopoverContent,
        {
          anchorElementRef,
          initialFocusElementRef,
          popoverNavigationItemBlurHandler,
          ...customPopoverContentProps
        }
      )
    ) : null;
  }
  function getPopoverLayoutStyle(api) {
    const { anchorElementRef, popoverOpen, getPopoverLayoutTop } = api;
    const pageContentClientRect = document.getElementById("pageContentContainer")?.getBoundingClientRect();
    const anchorElement = anchorElementRef.current;
    const anchorClientRect = anchorElementRef.current?.getBoundingClientRect();
    if (pageContentClientRect && anchorElement && anchorClientRect && popoverOpen) {
      const maxPopoverPadding = 40;
      const horizontalShift = 2;
      const pageMiddleX = pageContentClientRect.left + pageContentClientRect.width / 2;
      const anchorMiddleX = anchorClientRect.left + anchorClientRect.width / 2;
      const popoverDirection = anchorMiddleX > pageMiddleX ? "left" : "right";
      return {
        position: "absolute",
        top: getPopoverLayoutTop({
          anchorElement
        }),
        maxHeight: window.innerHeight - maxPopoverPadding,
        maxWidth: pageContentClientRect.width - maxPopoverPadding,
        ...popoverDirection === "right" ? {
          right: void 0,
          left: anchorElement.offsetLeft - horizontalShift
        } : {
          left: void 0,
          right: anchorElement.offsetLeft - anchorClientRect.left + pageContentClientRect.left + (pageContentClientRect.right - anchorClientRect.right) - horizontalShift
        }
      };
    } else {
      throwInvalidPathError("getPopoverLayoutStyle");
    }
  }
  function handlePopoverOpenWithPointer(api) {
    const {
      initialFocusElement,
      windowPointerDownHandler,
      windowScrollHandler,
      anchorDataPointerFocus
    } = api;
    handlePopoverOpen({
      initialFocusElement,
      windowPointerDownHandler,
      windowScrollHandler
    });
    initialFocusElement.setAttribute(
      "data-pointer-focus",
      anchorDataPointerFocus
    );
  }
  function handlePopoverOpen(api) {
    const { initialFocusElement, windowPointerDownHandler, windowScrollHandler } = api;
    initialFocusElement.focus();
    document.documentElement.classList.add(Popover_module_default.preventUnderscroll);
    document.body.classList.add(Popover_module_default.preventUnderscroll);
    window.addEventListener("pointerdown", windowPointerDownHandler);
    window.addEventListener("scroll", windowScrollHandler, {
      capture: true
    });
  }
  function handlePopoverClose(api) {
    const { windowPointerDownHandler, windowScrollHandler } = api;
    document.documentElement.classList.remove(Popover_module_default.preventUnderscroll);
    document.body.classList.remove(Popover_module_default.preventUnderscroll);
    window.removeEventListener("pointerdown", windowPointerDownHandler);
    window.removeEventListener("scroll", windowScrollHandler, {
      capture: true
    });
  }

  // source/client/app/components/Bopper/Bopper.tsx
  function Bopper(props) {
    const {
      SomeAnchorButton,
      anchorAriaLabel,
      anchorAriaDescription,
      popoverAriaRole,
      customSomeAnchorButtonProps,
      PopoverContent,
      getPopoverLayoutTop,
      customPopoverContentProps
    } = props;
    const anchorElementRef = useRef(null);
    const [popoverOpen, setPopoverOpen] = useState(false);
    return /* @__PURE__ */ h(I, null, /* @__PURE__ */ h(
      Popover,
      {
        popoverAriaRole,
        PopoverContent,
        getPopoverLayoutTop,
        anchorElementRef,
        popoverOpen,
        setPopoverOpen,
        customPopoverContentProps
      }
    ), /* @__PURE__ */ h(
      SomeAnchorButton,
      {
        ariaLabel: anchorAriaLabel,
        ariaDescription: anchorAriaDescription,
        popoverAriaRole,
        anchorElementRef,
        popoverOpen,
        setPopoverOpen,
        ...customSomeAnchorButtonProps
      }
    ));
  }

  // source/client/app/general/getCssClass.ts
  function getCssClass(baseClass, ...extensionClasses) {
    return `${baseClass}${extensionClasses.reduce(
      (result, someExtensionClass) => `${result}${someExtensionClass[1] ? ` ${someExtensionClass[0]}` : ""}`,
      ""
    )}`;
  }

  // source/client/app/hooks/useInteractiveAria.ts
  function useInteractiveAria(api) {
    const { ariaOrnaments, setCustomAriaAttributes } = api;
    const { ariaElementRef, ariaDescriptionElementRef } = useMemo(() => {
      return {
        ariaElementRef: de(),
        ariaDescriptionElementRef: de()
      };
    }, []);
    useLayoutEffect(() => {
      const ariaElement = ariaElementRef.current ?? throwInvalidPathError("useAria.useLayoutEffect[]");
      const ariaDescriptionElement = document.createElement("div");
      ariaDescriptionElement.id = `${Math.random()}`;
      ariaDescriptionElement.style.display = "none";
      ariaElement.insertAdjacentElement("afterend", ariaDescriptionElement);
      ariaElement.setAttribute("aria-describedby", ariaDescriptionElement.id);
      ariaDescriptionElementRef.current = ariaDescriptionElement;
      return () => {
        ariaDescriptionElement.remove();
      };
    }, []);
    useLayoutEffect(() => {
      const ariaElement = ariaElementRef.current;
      const ariaDescriptionElement = ariaDescriptionElementRef.current;
      if (ariaElement instanceof HTMLDivElement && ariaDescriptionElement instanceof HTMLDivElement) {
        ariaElement.setAttribute("role", ariaOrnaments.ariaRole);
        ariaElement.setAttribute("aria-label", ariaOrnaments.ariaLabel);
        ariaDescriptionElement.innerText = ariaOrnaments.ariaDescription;
        setCustomAriaAttributes(ariaElement, ariaOrnaments);
      } else {
        throwInvalidPathError("useAria.useLayoutEffect[ariaOrnaments]");
      }
    }, [ariaOrnaments]);
    return { ariaElementRef };
  }

  // source/client/app/components/Button/ButtonBase.module.scss
  var css4 = `._flexContainer_18fxr_1, ._defaultLayout_18fxr_1, ._columnContainer_18fxr_1, ._rowContainer_18fxr_1, ._itemContainer_18fxr_1, ._buttonBase_18fxr_1 {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: flex-start;
  align-items: stretch;
}

._flexChild_18fxr_9, ._defaultLayout_18fxr_1 {
  flex-grow: 0;
  flex-shrink: 1;
  flex-basis: auto;
}

._itemContainer_18fxr_1, ._buttonBase_18fxr_1 {
  justify-content: center;
  align-items: center;
}

._rowContainer_18fxr_1 {
  flex-direction: row;
}

._columnContainer_18fxr_1 {
  flex-direction: column;
}

._textEllipsis_18fxr_28 {
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

._defaultBoxModel_18fxr_35 {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  border: none;
}

._defaultFont_18fxr_42 {
  font-family: "Red Hat Mono", monospace;
  line-height: 1.4;
  color: black;
  -webkit-text-size-adjust: 100%;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

._themeBorder_18fxr_51 {
  border: 1.5px solid black;
  border-radius: 4px;
}

._themeFocusOutline_18fxr_56, ._buttonBase_18fxr_1:focus {
  outline: solid 3px transparent;
  outline-offset: 0;
  box-shadow: 0 0 0 3px #2196f3;
  border-radius: 4px;
}

._themeFocusWithoutOutline_18fxr_63, ._buttonBase_18fxr_1:focus[data-pointer-focus] {
  outline: none;
  box-shadow: none;
  border-radius: 0;
}

._buttonBase_18fxr_1 {
  cursor: pointer;
  user-select: none;
  -webkit-user-select: none;
  -webkit-tap-highlight-color: transparent;
}`;
  document.head.appendChild(document.createElement("style")).appendChild(document.createTextNode(css4));
  var ButtonBase_module_default = {
    "flexContainer": "_flexContainer_18fxr_1",
    "defaultLayout": "_defaultLayout_18fxr_1",
    "columnContainer": "_columnContainer_18fxr_1",
    "rowContainer": "_rowContainer_18fxr_1",
    "itemContainer": "_itemContainer_18fxr_1",
    "buttonBase": "_buttonBase_18fxr_1",
    "flexChild": "_flexChild_18fxr_9",
    "textEllipsis": "_textEllipsis_18fxr_28",
    "defaultBoxModel": "_defaultBoxModel_18fxr_35",
    "defaultFont": "_defaultFont_18fxr_42",
    "themeBorder": "_themeBorder_18fxr_51",
    "themeFocusOutline": "_themeFocusOutline_18fxr_56",
    "themeFocusWithoutOutline": "_themeFocusWithoutOutline_18fxr_63"
  };

  // source/client/app/components/Button/ButtonBase.tsx
  function ButtonBase(props) {
    const {
      setCustomAriaAttributes,
      ariaOrnaments,
      disabled,
      elementRef,
      tabIndex,
      className,
      onSelect,
      onClick,
      onKeyDown,
      onPointerDown,
      onBlur,
      ...unadjustedProps
    } = props;
    const { ariaElementRef } = useInteractiveAria({
      ariaOrnaments: {
        ...ariaOrnaments,
        ariaDisabled: `${disabled ?? false}`
      },
      setCustomAriaAttributes: (ariaElement, ariaOrnaments2) => {
        ariaElement.setAttribute("aria-disabled", ariaOrnaments2.ariaDisabled);
        setCustomAriaAttributes(ariaElement, ariaOrnaments2);
      }
    });
    return /* @__PURE__ */ h(
      "div",
      {
        ref: (elementNode) => {
          ariaElementRef.current = elementNode;
          if (elementRef && typeof elementRef === "object") {
            elementRef.current = elementNode;
          } else if (typeof elementRef === "function") {
            elementRef(elementNode);
          }
        },
        tabIndex: disabled ? void 0 : tabIndex ?? 0,
        className: getCssClass(ButtonBase_module_default.buttonBase, [
          className,
          Boolean(className)
        ]),
        onClick: disabled ? void 0 : (someClickEvent) => {
          const touchHitTestPointerDownEventBypassed = !someClickEvent.currentTarget.hasAttribute(
            "data-pointer-focus"
          );
          if (someClickEvent.currentTarget instanceof HTMLDivElement && touchHitTestPointerDownEventBypassed) {
            someClickEvent.currentTarget.setAttribute(
              "data-pointer-focus",
              "touch"
            );
          }
          if (onClick) {
            onClick(someClickEvent);
          }
          onSelect();
        },
        onKeyDown: disabled ? void 0 : (someKeyDownEvent) => {
          if (onKeyDown) {
            onKeyDown(someKeyDownEvent);
          }
          if (someKeyDownEvent.key === "Enter") {
            onSelect();
          }
        },
        onPointerDown: disabled ? void 0 : (somePointerDownEvent) => {
          if (somePointerDownEvent.currentTarget instanceof HTMLDivElement) {
            somePointerDownEvent.currentTarget.setAttribute(
              "data-pointer-focus",
              somePointerDownEvent.pointerType
            );
          }
          if (onPointerDown) {
            onPointerDown(somePointerDownEvent);
          }
        },
        onBlur: (someBlurEvent) => {
          if (someBlurEvent.target instanceof HTMLDivElement) {
            someBlurEvent.target.removeAttribute("data-pointer-focus");
          }
          if (onBlur) {
            onBlur(someBlurEvent);
          }
        },
        ...unadjustedProps
      }
    );
  }

  // source/client/app/components/Button/AnchorButton.tsx
  function AnchorButton(props) {
    const {
      anchorElementRef,
      popoverOpen,
      ariaLabel,
      ariaDescription,
      popoverAriaRole,
      setPopoverOpen,
      ...unadjustedProps
    } = props;
    return /* @__PURE__ */ h(
      ButtonBase,
      {
        elementRef: anchorElementRef,
        ariaOrnaments: {
          ariaRole: "button",
          ariaLabel,
          ariaDescription,
          ariaHasPopup: popoverAriaRole
        },
        setCustomAriaAttributes: (ariaElement, ariaOrnaments) => {
          ariaElement.setAttribute("aria-haspopup", ariaOrnaments.ariaHasPopup);
        },
        onPointerDown: () => {
          if (popoverOpen && anchorElementRef.current instanceof HTMLDivElement) {
            anchorElementRef.current.setAttribute("data-popoveropen", "true");
          }
        },
        onSelect: () => {
          if (anchorElementRef.current instanceof HTMLDivElement && anchorElementRef.current.hasAttribute("data-popoveropen")) {
            anchorElementRef.current.removeAttribute("data-popoveropen");
          } else {
            setPopoverOpen(true);
          }
        },
        ...unadjustedProps
      }
    );
  }

  // source/client/app/components/Select/components/SelectOptionLabel.tsx
  function SelectOptionLabel(props) {
    const { someSelectOption, optionLabelKey } = props;
    const optionLabel = someSelectOption[optionLabelKey];
    return typeof optionLabel === "string" ? /* @__PURE__ */ h(I, null, optionLabel) : throwInvalidPathError("SelectMenuOptionLabel");
  }

  // source/client/app/components/Select/components/SelectButton.module.scss
  var css5 = `._flexContainer_fkfrh_1, ._defaultLayout_fkfrh_1, ._columnContainer_fkfrh_1, ._buttonContainer_fkfrh_1, ._rowContainer_fkfrh_1, ._selectButton_fkfrh_1, ._itemContainer_fkfrh_1, ._iconContainer_fkfrh_1 {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: flex-start;
  align-items: stretch;
}

._flexChild_fkfrh_9, ._defaultLayout_fkfrh_1 {
  flex-grow: 0;
  flex-shrink: 1;
  flex-basis: auto;
}

._itemContainer_fkfrh_1, ._iconContainer_fkfrh_1 {
  justify-content: center;
  align-items: center;
}

._rowContainer_fkfrh_1, ._selectButton_fkfrh_1 {
  flex-direction: row;
}

._columnContainer_fkfrh_1, ._buttonContainer_fkfrh_1 {
  flex-direction: column;
}

._textEllipsis_fkfrh_28, ._buttonLabel_fkfrh_28 {
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

._defaultBoxModel_fkfrh_35 {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  border: none;
}

._defaultFont_fkfrh_42 {
  font-family: "Red Hat Mono", monospace;
  line-height: 1.4;
  color: black;
  -webkit-text-size-adjust: 100%;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

._themeBorder_fkfrh_51 {
  border: 1.5px solid black;
  border-radius: 4px;
}

._themeFocusOutline_fkfrh_56 {
  outline: solid 3px transparent;
  outline-offset: 0;
  box-shadow: 0 0 0 3px #2196f3;
  border-radius: 4px;
}

._themeFocusWithoutOutline_fkfrh_63 {
  outline: none;
  box-shadow: none;
  border-radius: 0;
}

._buttonContainer_fkfrh_1 {
  width: 0;
  flex-grow: 1;
  max-width: fit-content;
  align-items: stretch;
}

._selectButton_fkfrh_1 {
  align-items: center;
  padding-inline: 4px;
}

._buttonLabel_fkfrh_28 {
  padding-inline-end: 10px;
  font-weight: 700;
  font-style: italic;
}

._iconContainer_fkfrh_1 {
  padding-top: 0.01em;
}

._selectIcon_fkfrh_91 {
  width: 0.675em;
  height: 0.675em;
}

._dropdownPolygon_fkfrh_96 {
  stroke: black;
  stroke-width: 0.09;
  stroke-linejoin: round;
  fill: transparent;
}`;
  document.head.appendChild(document.createElement("style")).appendChild(document.createTextNode(css5));
  var SelectButton_module_default = {
    "flexContainer": "_flexContainer_fkfrh_1",
    "defaultLayout": "_defaultLayout_fkfrh_1",
    "columnContainer": "_columnContainer_fkfrh_1",
    "buttonContainer": "_buttonContainer_fkfrh_1",
    "rowContainer": "_rowContainer_fkfrh_1",
    "selectButton": "_selectButton_fkfrh_1",
    "itemContainer": "_itemContainer_fkfrh_1",
    "iconContainer": "_iconContainer_fkfrh_1",
    "flexChild": "_flexChild_fkfrh_9",
    "textEllipsis": "_textEllipsis_fkfrh_28",
    "buttonLabel": "_buttonLabel_fkfrh_28",
    "defaultBoxModel": "_defaultBoxModel_fkfrh_35",
    "defaultFont": "_defaultFont_fkfrh_42",
    "themeBorder": "_themeBorder_fkfrh_51",
    "themeFocusOutline": "_themeFocusOutline_fkfrh_56",
    "themeFocusWithoutOutline": "_themeFocusWithoutOutline_fkfrh_63",
    "selectIcon": "_selectIcon_fkfrh_91",
    "dropdownPolygon": "_dropdownPolygon_fkfrh_96"
  };

  // source/client/app/components/Select/components/SelectButton.tsx
  function SelectButton(props) {
    const {
      anchorBorderClassName,
      fontSizeClassName,
      ariaLabel,
      ariaDescription,
      popoverAriaRole,
      anchorElementRef,
      setPopoverOpen,
      popoverOpen,
      customSelectAnchorButtonProps,
      selectedOption,
      optionLabelKey,
      selectIconClassName
    } = props;
    return /* @__PURE__ */ h(
      "div",
      {
        className: getCssClass(
          SelectButton_module_default.buttonContainer,
          [anchorBorderClassName, Boolean(anchorBorderClassName)],
          [fontSizeClassName, Boolean(fontSizeClassName)]
        )
      },
      /* @__PURE__ */ h(
        AnchorButton,
        {
          ariaLabel,
          ariaDescription,
          popoverAriaRole,
          anchorElementRef,
          setPopoverOpen,
          popoverOpen,
          className: getCssClass(SelectButton_module_default.selectButton, [
            customSelectAnchorButtonProps.className,
            Boolean(customSelectAnchorButtonProps.className)
          ]),
          ...customSelectAnchorButtonProps
        },
        /* @__PURE__ */ h("div", { className: SelectButton_module_default.buttonLabel }, /* @__PURE__ */ h(
          SelectOptionLabel,
          {
            optionLabelKey,
            someSelectOption: selectedOption
          }
        )),
        /* @__PURE__ */ h("div", { className: SelectButton_module_default.iconContainer }, /* @__PURE__ */ h(
          "svg",
          {
            viewBox: "0 0 1 1",
            className: getCssClass(SelectButton_module_default.selectIcon, [
              selectIconClassName,
              Boolean(selectIconClassName)
            ])
          },
          /* @__PURE__ */ h(
            "polygon",
            {
              className: SelectButton_module_default.dropdownPolygon,
              points: "0.2,0.375 0.8,0.375 0.5,0.775"
            }
          )
        ))
      )
    );
  }

  // source/client/app/components/Select/SelectBase.tsx
  function SelectBase(props) {
    const {
      SelectMenu,
      popoverAriaRole,
      anchorAriaLabel,
      anchorAriaDescription,
      customSelectAnchorButtonProps,
      anchorBorderClassName,
      fontSizeClassName,
      selectIconClassName,
      selectedOption,
      optionLabelKey,
      optionTypeLabel,
      selectOption,
      optionList,
      customOptionActionItemProps,
      customMenuFooterProps
    } = props;
    return /* @__PURE__ */ h(
      Bopper,
      {
        SomeAnchorButton: SelectButton,
        PopoverContent: SelectMenu,
        getPopoverLayoutTop: ({ anchorElement }) => anchorElement.offsetTop + anchorElement.offsetHeight + 4,
        popoverAriaRole,
        anchorAriaLabel,
        anchorAriaDescription,
        customSomeAnchorButtonProps: {
          customSelectAnchorButtonProps,
          anchorBorderClassName,
          fontSizeClassName,
          selectIconClassName,
          selectedOption,
          optionLabelKey
        },
        customPopoverContentProps: {
          fontSizeClassName,
          selectedOption,
          optionLabelKey,
          optionTypeLabel,
          selectOption,
          optionList,
          customOptionActionItemProps,
          customMenuFooterProps
        }
      }
    );
  }

  // source/client/app/components/Button/Button.tsx
  function Button(props) {
    const { ariaLabel, ariaDescription, ...unadjustedProps } = props;
    return /* @__PURE__ */ h(
      ButtonBase,
      {
        setCustomAriaAttributes: () => {
        },
        ariaOrnaments: {
          ariaRole: "button",
          ariaLabel,
          ariaDescription
        },
        ...unadjustedProps
      }
    );
  }

  // source/client/app/components/Select/hooks/useSelectMenuNavigation.ts
  function useSelectMenuNavigation(api) {
    const {
      popoverNavigationItemBlurHandler,
      initialFocusElementRef,
      anchorElementRef
    } = api;
    const listItemsRef = useRef([]);
    const [latestFocusedOptionIndex, setFocusedOptionIndex] = useState(null);
    const pointerClientCoordinatesRef = useRef(null);
    return {
      latestFocusedOptionIndex,
      menuNavigationMenuContainerProps: {
        onKeyDown: (someKeyDownEvent) => {
          const listItemsLength = listItemsRef.current.length;
          const currentFocusedOptionIndex = typeof latestFocusedOptionIndex === "number" ? latestFocusedOptionIndex : throwInvalidPathError(
            "menuNavigationMenuContainerProps.onKeyDown"
          );
          if (someKeyDownEvent.key === "ArrowDown") {
            handleArrowKeyListNavigation({
              listItemsRef,
              someKeyDownEvent,
              targetViewIndex: (currentFocusedOptionIndex + 1) % listItemsLength
            });
          } else if (someKeyDownEvent.key === "ArrowUp") {
            handleArrowKeyListNavigation({
              listItemsRef,
              someKeyDownEvent,
              targetViewIndex: ((currentFocusedOptionIndex - 1) % listItemsLength + listItemsLength) % listItemsLength
            });
          }
        }
      },
      menuNavigationFooterActionButtonProps: {
        onBlur: popoverNavigationItemBlurHandler
      },
      getMenuNavigationMenuOptionProps: (optionIndex) => {
        return {
          onBlur: popoverNavigationItemBlurHandler,
          tabIndex: latestFocusedOptionIndex === optionIndex ? 0 : -1,
          elementRef: (listItemElement) => {
            listItemsRef.current[optionIndex] = listItemElement;
            if (optionIndex === 0) {
              initialFocusElementRef.current = listItemElement;
            }
          },
          onPointerMove: (somePointerMoveEvent) => {
            if (somePointerMoveEvent.pointerType === "mouse" && latestFocusedOptionIndex !== optionIndex && getPointerClientCoordinatesChanged({
              pointerClientCoordinatesRef,
              somePointerMoveEvent
            })) {
              const targetListItemElement = listItemsRef.current[optionIndex];
              if (targetListItemElement instanceof HTMLDivElement) {
                targetListItemElement.focus({ preventScroll: true });
                targetListItemElement.setAttribute(
                  "data-pointer-focus",
                  somePointerMoveEvent.pointerType
                );
              } else {
                throwInvalidPathError(
                  "getMenuNavigationMenuOptionProps.onPointerMove"
                );
              }
            }
            pointerClientCoordinatesRef.current = {
              clientX: somePointerMoveEvent.clientX,
              clientY: somePointerMoveEvent.clientY
            };
          },
          onFocus: () => {
            setFocusedOptionIndex(optionIndex);
          },
          onKeyDown: (someKeyDownEvent) => {
            if (someKeyDownEvent.key === "Enter") {
              anchorElementRef.current instanceof HTMLDivElement ? anchorElementRef.current.focus() : throwInvalidPathError(
                "getMenuNavigationMenuOptionProps.onKeyDown.Enter"
              );
            }
          },
          onPointerDown: (somePointerEvent) => {
            if (somePointerEvent.currentTarget instanceof HTMLDivElement) {
              somePointerEvent.currentTarget.setAttribute(
                "data-pointer-focus",
                somePointerEvent.pointerType
              );
            }
          },
          onClick: (someClickEvent) => {
            if (anchorElementRef.current instanceof HTMLDivElement) {
              anchorElementRef.current.setAttribute(
                "data-pointer-focus",
                someClickEvent.currentTarget.getAttribute("data-pointer-focus") || "touch"
              );
              anchorElementRef.current.focus();
            }
          }
        };
      },
      getMenuNavigationOptionActionButtonProps: (musicViewIndex) => {
        return {
          onBlur: popoverNavigationItemBlurHandler,
          tabIndex: latestFocusedOptionIndex === musicViewIndex ? 0 : -1,
          onClick: (someClickEvent) => {
            someClickEvent.stopPropagation();
          },
          onKeyDown: (someKeyDownEvent) => {
            if (someKeyDownEvent.key === "Enter") {
              someKeyDownEvent.stopPropagation();
            }
          }
        };
      }
    };
  }
  function handleArrowKeyListNavigation(api) {
    const { someKeyDownEvent, listItemsRef, targetViewIndex } = api;
    someKeyDownEvent.preventDefault();
    setTimeout(() => {
      const targetListItemElement = listItemsRef.current[targetViewIndex];
      targetListItemElement instanceof HTMLDivElement ? targetListItemElement.focus() : throwInvalidPathError("handleArrowKeyListNavigation");
    });
  }
  function getPointerClientCoordinatesChanged(api) {
    const { pointerClientCoordinatesRef, somePointerMoveEvent } = api;
    return pointerClientCoordinatesRef.current?.clientX !== somePointerMoveEvent.clientX || pointerClientCoordinatesRef.current?.clientY !== somePointerMoveEvent.clientY;
  }

  // source/client/app/components/Select/components/SelectMenuBase.module.scss
  var css6 = `._flexContainer_jcoab_1, ._defaultLayout_jcoab_1, ._columnContainer_jcoab_1, ._optionList_jcoab_1, ._menuContainer_jcoab_1, ._rowContainer_jcoab_1, ._optionLabelContainer_jcoab_1, ._optionItem_jcoab_1, ._itemContainer_jcoab_1 {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: flex-start;
  align-items: stretch;
}

._flexChild_jcoab_9, ._defaultLayout_jcoab_1 {
  flex-grow: 0;
  flex-shrink: 1;
  flex-basis: auto;
}

._itemContainer_jcoab_1 {
  justify-content: center;
  align-items: center;
}

._rowContainer_jcoab_1, ._optionLabelContainer_jcoab_1, ._optionItem_jcoab_1 {
  flex-direction: row;
}

._columnContainer_jcoab_1, ._optionList_jcoab_1, ._menuContainer_jcoab_1 {
  flex-direction: column;
}

._textEllipsis_jcoab_28, ._optionLabel_jcoab_1 {
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

._defaultBoxModel_jcoab_35 {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  border: none;
}

._defaultFont_jcoab_42 {
  font-family: "Red Hat Mono", monospace;
  line-height: 1.4;
  color: black;
  -webkit-text-size-adjust: 100%;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

._themeBorder_jcoab_51 {
  border: 1.5px solid black;
  border-radius: 4px;
}

._themeFocusOutline_jcoab_56, ._optionItem_jcoab_1:focus:not([data-pointer-focus]) ._optionLabel_jcoab_1 {
  outline: solid 3px transparent;
  outline-offset: 0;
  box-shadow: 0 0 0 3px #2196f3;
  border-radius: 4px;
}

._themeFocusWithoutOutline_jcoab_63, ._optionItem_jcoab_1:focus {
  outline: none;
  box-shadow: none;
  border-radius: 0;
}

._menuContainer_jcoab_1 {
  padding-block-start: 8px;
  padding-block-end: 10px;
  min-width: 128px;
}

._optionList_jcoab_1 {
  max-height: 248px;
  overflow-y: scroll;
}

._optionItem_jcoab_1 {
  align-items: center;
  padding-inline: 8px;
  cursor: pointer;
}
._optionItem_jcoab_1:not(:first-child) {
  margin-top: 6px;
}
._optionItem_jcoab_1._latestFocusedOption_jcoab_88:not([data-pointer-focus=touch]) {
  background-color: #eeeeee;
}
._optionItem_jcoab_1._selectedOption_jcoab_91 ._optionSelectedIcon_jcoab_91 {
  visibility: visible;
}
._optionItem_jcoab_1._selectedOption_jcoab_91 ._optionLabel_jcoab_1 {
  font-style: italic;
}

._optionSelectedIcon_jcoab_91 {
  flex-shrink: 0;
  width: 0.85em;
  height: 0.85em;
  padding-inline-end: calc(5px - 0.2em);
  visibility: hidden;
  stroke: black;
  stroke-width: 0.75;
}

._optionLabelContainer_jcoab_1 {
  padding: 3px;
  overflow: hidden;
  flex-grow: 1;
  flex-shrink: 1;
}

._optionLabel_jcoab_1 {
  font-weight: 700;
  padding-inline: 0.2em;
}

._optionActionItemContainer_jcoab_120 {
  padding-inline-start: 21px;
}`;
  document.head.appendChild(document.createElement("style")).appendChild(document.createTextNode(css6));
  var SelectMenuBase_module_default = {
    "flexContainer": "_flexContainer_jcoab_1",
    "defaultLayout": "_defaultLayout_jcoab_1",
    "columnContainer": "_columnContainer_jcoab_1",
    "optionList": "_optionList_jcoab_1",
    "menuContainer": "_menuContainer_jcoab_1",
    "rowContainer": "_rowContainer_jcoab_1",
    "optionLabelContainer": "_optionLabelContainer_jcoab_1",
    "optionItem": "_optionItem_jcoab_1",
    "itemContainer": "_itemContainer_jcoab_1",
    "flexChild": "_flexChild_jcoab_9",
    "textEllipsis": "_textEllipsis_jcoab_28",
    "optionLabel": "_optionLabel_jcoab_1",
    "defaultBoxModel": "_defaultBoxModel_jcoab_35",
    "defaultFont": "_defaultFont_jcoab_42",
    "themeBorder": "_themeBorder_jcoab_51",
    "themeFocusOutline": "_themeFocusOutline_jcoab_56",
    "themeFocusWithoutOutline": "_themeFocusWithoutOutline_jcoab_63",
    "latestFocusedOption": "_latestFocusedOption_jcoab_88",
    "selectedOption": "_selectedOption_jcoab_91",
    "optionSelectedIcon": "_optionSelectedIcon_jcoab_91",
    "optionActionItemContainer": "_optionActionItemContainer_jcoab_120"
  };

  // source/client/app/components/Select/components/SelectMenuBase.tsx
  function SelectMenuBase(props) {
    const {
      fontSizeClassName,
      anchorElementRef,
      initialFocusElementRef,
      popoverNavigationItemBlurHandler,
      optionList,
      selectedOption,
      selectOption,
      optionLabelKey,
      optionTypeLabel,
      OptionActionItem,
      customOptionActionItemProps,
      MenuFooter,
      customMenuFooterProps
    } = props;
    const {
      latestFocusedOptionIndex,
      menuNavigationMenuContainerProps,
      getMenuNavigationMenuOptionProps,
      getMenuNavigationOptionActionButtonProps,
      menuNavigationFooterActionButtonProps
    } = useSelectMenuNavigation({
      anchorElementRef,
      initialFocusElementRef,
      popoverNavigationItemBlurHandler
    });
    return /* @__PURE__ */ h(
      "div",
      {
        ...menuNavigationMenuContainerProps,
        className: getCssClass(SelectMenuBase_module_default.menuContainer, [
          fontSizeClassName,
          Boolean(fontSizeClassName)
        ])
      },
      /* @__PURE__ */ h("div", { className: SelectMenuBase_module_default.optionList }, optionList.map((someOption, optionIndex) => /* @__PURE__ */ h(
        Button,
        {
          ariaLabel: `select "${someOption[optionLabelKey]}" ${optionTypeLabel}`,
          ariaDescription: `a button that updates the current ${optionTypeLabel} to "${someOption[optionLabelKey]}"`,
          key: optionIndex,
          className: getCssClass(
            SelectMenuBase_module_default.optionItem,
            [SelectMenuBase_module_default.selectedOption, selectedOption === someOption],
            [
              SelectMenuBase_module_default.latestFocusedOption,
              latestFocusedOptionIndex === optionIndex
            ]
          ),
          onSelect: () => {
            selectOption(someOption);
          },
          ...getMenuNavigationMenuOptionProps(optionIndex)
        },
        /* @__PURE__ */ h("svg", { className: SelectMenuBase_module_default.optionSelectedIcon, viewBox: "0 0 24 24" }, /* @__PURE__ */ h(
          "path",
          {
            d: "M9 16.17L5.53 12.7c-.39-.39-1.02-.39-1.41 0-.39.39-.39 1.02 0 1.41l4.18 4.18c.39.39 1.02.39 1.41 0L20.29 7.71c.39-.39.39-1.02 0-1.41-.39-.39-1.02-.39-1.41 0L9 16.17z"
          }
        )),
        /* @__PURE__ */ h("div", { className: SelectMenuBase_module_default.optionLabelContainer }, /* @__PURE__ */ h("div", { className: SelectMenuBase_module_default.optionLabel }, /* @__PURE__ */ h(
          SelectOptionLabel,
          {
            optionLabelKey,
            someSelectOption: someOption
          }
        ))),
        /* @__PURE__ */ h("div", { className: SelectMenuBase_module_default.optionActionItemContainer }, /* @__PURE__ */ h(
          OptionActionItem,
          {
            latestFocusedOptionIndex,
            getMenuNavigationOptionActionButtonProps,
            someOption,
            optionIndex,
            ...customOptionActionItemProps
          }
        ))
      ))),
      /* @__PURE__ */ h(
        MenuFooter,
        {
          menuNavigationFooterActionButtonProps,
          ...customMenuFooterProps
        }
      )
    );
  }

  // source/client/app/StewSegment/components/SegmentViewSelect.module.scss
  var css7 = `._flexContainer_1our5_1, ._defaultLayout_1our5_1, ._columnContainer_1our5_1, ._rowContainer_1our5_1, ._itemContainer_1our5_1 {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: flex-start;
  align-items: stretch;
}

._flexChild_1our5_9, ._defaultLayout_1our5_1 {
  flex-grow: 0;
  flex-shrink: 1;
  flex-basis: auto;
}

._itemContainer_1our5_1 {
  justify-content: center;
  align-items: center;
}

._rowContainer_1our5_1 {
  flex-direction: row;
}

._columnContainer_1our5_1 {
  flex-direction: column;
}

._textEllipsis_1our5_28 {
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

._defaultBoxModel_1our5_35 {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  border: none;
}

._defaultFont_1our5_42 {
  font-family: "Red Hat Mono", monospace;
  line-height: 1.4;
  color: black;
  -webkit-text-size-adjust: 100%;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

._themeBorder_1our5_51 {
  border: 1.5px solid black;
  border-radius: 4px;
}

._themeFocusOutline_1our5_56 {
  outline: solid 3px transparent;
  outline-offset: 0;
  box-shadow: 0 0 0 3px #2196f3;
  border-radius: 4px;
}

._themeFocusWithoutOutline_1our5_63 {
  outline: none;
  box-shadow: none;
  border-radius: 0;
}

._viewSelectAnchorBorder_1our5_69 {
  border-bottom: 1.5px solid black;
}

._viewSelectFontSize_1our5_73 {
  font-size: 24px;
}

._viewAccessibilityHeader_1our5_77 {
  display: none;
}`;
  document.head.appendChild(document.createElement("style")).appendChild(document.createTextNode(css7));
  var SegmentViewSelect_module_default = {
    "flexContainer": "_flexContainer_1our5_1",
    "defaultLayout": "_defaultLayout_1our5_1",
    "columnContainer": "_columnContainer_1our5_1",
    "rowContainer": "_rowContainer_1our5_1",
    "itemContainer": "_itemContainer_1our5_1",
    "flexChild": "_flexChild_1our5_9",
    "textEllipsis": "_textEllipsis_1our5_28",
    "defaultBoxModel": "_defaultBoxModel_1our5_35",
    "defaultFont": "_defaultFont_1our5_42",
    "themeBorder": "_themeBorder_1our5_51",
    "themeFocusOutline": "_themeFocusOutline_1our5_56",
    "themeFocusWithoutOutline": "_themeFocusWithoutOutline_1our5_63",
    "viewSelectAnchorBorder": "_viewSelectAnchorBorder_1our5_69",
    "viewSelectFontSize": "_viewSelectFontSize_1our5_73",
    "viewAccessibilityHeader": "_viewAccessibilityHeader_1our5_77"
  };

  // source/client/app/StewSegment/components/SegmentViewSelect.tsx
  function SegmentViewSelect(props) {
    const { stewConfig, stewSegmentState, selectSegmentView } = props;
    const __staticObjectProp = useMemo(() => ({}), []);
    const { activeSegmentConfig, selectedViewOption, activeSegmentViewOptions } = useMemo(() => {
      const activeSegmentConfigResult = stewConfig.stewSegments[stewSegmentState.segmentKey];
      return {
        activeSegmentConfig: activeSegmentConfigResult,
        selectedViewOption: activeSegmentConfigResult.segmentViews[stewSegmentState.segmentViewKey],
        activeSegmentViewOptions: Object.values(
          activeSegmentConfigResult.segmentViews
        ).sort((optionA, optionB) => optionA.viewIndex - optionB.viewIndex)
      };
    }, [stewConfig, stewSegmentState]);
    return /* @__PURE__ */ h(I, null, /* @__PURE__ */ h(
      "h2",
      {
        style: { display: "none" }
      },
      `${activeSegmentConfig.segmentLabel} view: ${selectedViewOption.viewLabel}`
    ), /* @__PURE__ */ h(
      SelectBase,
      {
        anchorBorderClassName: SegmentViewSelect_module_default.viewSelectAnchorBorder,
        fontSizeClassName: SegmentViewSelect_module_default.viewSelectFontSize,
        optionTypeLabel: "view",
        optionLabelKey: "viewLabel",
        popoverAriaRole: "listbox",
        anchorAriaLabel: `select ${activeSegmentConfig.segmentLabel} view`,
        anchorAriaDescription: `${activeSegmentConfig.segmentLabel} view`,
        SelectMenu: SegmentViewSelectMenu,
        customOptionActionItemProps: __staticObjectProp,
        customMenuFooterProps: __staticObjectProp,
        customSelectAnchorButtonProps: __staticObjectProp,
        optionList: activeSegmentViewOptions,
        selectedOption: selectedViewOption,
        selectOption: (nextSegmentViewOption) => {
          selectSegmentView(nextSegmentViewOption.viewKey);
        }
      }
    ));
  }
  function SegmentViewSelectMenu(props) {
    return /* @__PURE__ */ h(
      SelectMenuBase,
      {
        OptionActionItem: EmptyOptionActionItem,
        MenuFooter: EmptyMenuFooter,
        ...props
      }
    );
  }
  function EmptyOptionActionItem() {
    return null;
  }
  function EmptyMenuFooter() {
    return null;
  }

  // source/client/app/components/Button/LinkButton.tsx
  function LinkButton(props) {
    const { ariaLabel, ariaDescription, href, target, ...unadjustedProps } = props;
    return /* @__PURE__ */ h(
      ButtonBase,
      {
        setCustomAriaAttributes: () => {
        },
        ariaOrnaments: {
          ariaRole: "link",
          ariaLabel,
          ariaDescription
        },
        onSelect: () => {
          const targetAnchorElement = document.createElement("a");
          targetAnchorElement.href = href;
          targetAnchorElement.setAttribute("target", target);
          targetAnchorElement.click();
        },
        ...unadjustedProps
      }
    );
  }

  // source/client/app/StewSegment/components/StewInfoBopper.module.scss
  var css8 = `._flexContainer_14pom_1, ._defaultLayout_14pom_1, ._columnContainer_14pom_1, ._contentContainer_14pom_1, ._rowContainer_14pom_1, ._contentNavigationFooter_14pom_1, ._segmentLinks_14pom_1, ._contentHeader_14pom_1, ._itemContainer_14pom_1, ._externalLinkContainer_14pom_1, ._segmentLinkContainer_14pom_1, ._closeButton_14pom_1, ._closeButtonContainer_14pom_1 {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: flex-start;
  align-items: stretch;
}

._flexChild_14pom_9, ._defaultLayout_14pom_1 {
  flex-grow: 0;
  flex-shrink: 1;
  flex-basis: auto;
}

._itemContainer_14pom_1, ._externalLinkContainer_14pom_1, ._segmentLinkContainer_14pom_1, ._closeButton_14pom_1, ._closeButtonContainer_14pom_1 {
  justify-content: center;
  align-items: center;
}

._rowContainer_14pom_1, ._contentNavigationFooter_14pom_1, ._segmentLinks_14pom_1, ._contentHeader_14pom_1 {
  flex-direction: row;
}

._columnContainer_14pom_1, ._contentContainer_14pom_1 {
  flex-direction: column;
}

._textEllipsis_14pom_28, ._stewTaglineText_14pom_28, ._stewNameText_14pom_28 {
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

._defaultBoxModel_14pom_35 {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  border: none;
}

._defaultFont_14pom_42 {
  font-family: "Red Hat Mono", monospace;
  line-height: 1.4;
  color: black;
  -webkit-text-size-adjust: 100%;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

._themeBorder_14pom_51 {
  border: 1.5px solid black;
  border-radius: 4px;
}

._themeFocusOutline_14pom_56 {
  outline: solid 3px transparent;
  outline-offset: 0;
  box-shadow: 0 0 0 3px #2196f3;
  border-radius: 4px;
}

._themeFocusWithoutOutline_14pom_63 {
  outline: none;
  box-shadow: none;
  border-radius: 0;
}

._stewInfoIcon_14pom_69 {
  width: 33px;
  height: 33px;
}

._iconOutlineCircle_14pom_74 {
  fill: transparent;
  stroke: black;
  stroke-width: 1.75;
}

._contentContainer_14pom_1 {
  overflow: hidden;
  padding-inline-start: 8px;
  padding-inline-end: 6px;
  padding-block-start: 3px;
  padding-block-end: 9px;
}

._contentHeader_14pom_1 {
  align-items: center;
}

._stewNameText_14pom_28 {
  flex-grow: 1;
  padding-inline-end: 24px;
  font-weight: 700;
  font-size: 23px;
}

._closeButtonContainer_14pom_1 {
  align-items: center;
  justify-content: center;
}

._closeButton_14pom_1 {
  padding: 0rem;
}

._closeIcon_14pom_108 {
  width: 22.5px;
  height: 22.5px;
}

._closeIconOutlineCircle_14pom_113 {
  fill: transparent;
  stroke: black;
  stroke-width: 1.5;
}

._stewTaglineText_14pom_28 {
  padding-block-start: 1px;
  padding-inline-end: 48px;
  font-size: 14px;
}

._stewMessageText_14pom_125 {
  padding-block-start: 6px;
  padding-block-end: 2px;
  padding-inline-end: 48px;
  font-size: 14px;
  font-weight: 700;
  font-style: italic;
  hyphens: auto;
}

._segmentLinks_14pom_1 {
  flex-wrap: wrap;
}

._segmentLinkContainer_14pom_1 {
  padding-inline-end: 16px;
  padding-block: 4px;
}

._segmentLinkButton_14pom_144 {
  color: #5e35b1;
  font-weight: 700;
}
._segmentLinkButton_14pom_144._activeSegment_14pom_148 {
  font-style: italic;
  text-decoration: underline;
  text-decoration-style: wavy;
  text-decoration-skip-ink: none;
  text-decoration-thickness: 1.5px;
  text-underline-offset: 1.5px;
}

._externalLinkContainer_14pom_1 {
  padding-inline-end: 12px;
  padding-block-start: 12px;
}

._externalLinkButton_14pom_162 {
  padding: 0.5px;
}

._curatorLinkIcon_14pom_166 {
  width: 20px;
  height: 20px;
}`;
  document.head.appendChild(document.createElement("style")).appendChild(document.createTextNode(css8));
  var StewInfoBopper_module_default = {
    "flexContainer": "_flexContainer_14pom_1",
    "defaultLayout": "_defaultLayout_14pom_1",
    "columnContainer": "_columnContainer_14pom_1",
    "contentContainer": "_contentContainer_14pom_1",
    "rowContainer": "_rowContainer_14pom_1",
    "contentNavigationFooter": "_contentNavigationFooter_14pom_1",
    "segmentLinks": "_segmentLinks_14pom_1",
    "contentHeader": "_contentHeader_14pom_1",
    "itemContainer": "_itemContainer_14pom_1",
    "externalLinkContainer": "_externalLinkContainer_14pom_1",
    "segmentLinkContainer": "_segmentLinkContainer_14pom_1",
    "closeButton": "_closeButton_14pom_1",
    "closeButtonContainer": "_closeButtonContainer_14pom_1",
    "flexChild": "_flexChild_14pom_9",
    "textEllipsis": "_textEllipsis_14pom_28",
    "stewTaglineText": "_stewTaglineText_14pom_28",
    "stewNameText": "_stewNameText_14pom_28",
    "defaultBoxModel": "_defaultBoxModel_14pom_35",
    "defaultFont": "_defaultFont_14pom_42",
    "themeBorder": "_themeBorder_14pom_51",
    "themeFocusOutline": "_themeFocusOutline_14pom_56",
    "themeFocusWithoutOutline": "_themeFocusWithoutOutline_14pom_63",
    "stewInfoIcon": "_stewInfoIcon_14pom_69",
    "iconOutlineCircle": "_iconOutlineCircle_14pom_74",
    "closeIcon": "_closeIcon_14pom_108",
    "closeIconOutlineCircle": "_closeIconOutlineCircle_14pom_113",
    "stewMessageText": "_stewMessageText_14pom_125",
    "segmentLinkButton": "_segmentLinkButton_14pom_144",
    "activeSegment": "_activeSegment_14pom_148",
    "externalLinkButton": "_externalLinkButton_14pom_162",
    "curatorLinkIcon": "_curatorLinkIcon_14pom_166"
  };

  // source/client/app/StewSegment/components/StewInfoBopper.tsx
  function StewInfoBopper(props) {
    const { stewConfig, stewSegmentState, selectStewSegment } = props;
    return /* @__PURE__ */ h(
      Bopper,
      {
        popoverAriaRole: "dialog",
        anchorAriaLabel: "show info and segment navigation controls for this stew",
        anchorAriaDescription: "a button that displays a popover with info and segment navigation controls for this stew",
        SomeAnchorButton: StewInfoAnchorButton,
        PopoverContent: StewInfoPopoverContent,
        customSomeAnchorButtonProps: null,
        getPopoverLayoutTop: ({ anchorElement }) => anchorElement.offsetTop - 2,
        customPopoverContentProps: {
          stewConfig,
          stewSegmentState,
          selectStewSegment
        }
      }
    );
  }
  function StewInfoAnchorButton(props) {
    const {
      ariaLabel,
      ariaDescription,
      popoverAriaRole,
      anchorElementRef,
      setPopoverOpen,
      popoverOpen
    } = props;
    return /* @__PURE__ */ h(
      AnchorButton,
      {
        ariaLabel,
        ariaDescription,
        popoverAriaRole,
        anchorElementRef,
        setPopoverOpen,
        popoverOpen
      },
      /* @__PURE__ */ h("svg", { className: StewInfoBopper_module_default.stewInfoIcon, viewBox: "-5 -5 34 34" }, /* @__PURE__ */ h(
        "circle",
        {
          className: StewInfoBopper_module_default.iconOutlineCircle,
          cx: 12,
          cy: 12,
          r: 14
        }
      ), /* @__PURE__ */ h("g", { transform: "scale(0.95) translate(0.5,1.5)" }, /* @__PURE__ */ h("circle", { cx: "12", cy: "3.75", r: "2" }), /* @__PURE__ */ h(
        "path",
        {
          d: "M15.89,8.11C15.5,7.72,14.83,7,13.53,7c-0.21,0-1.42,0-2.54,0C8.53,6.99,6.48,5.2,6.07,2.85C5.99,2.36,5.58,2,5.09,2h0 c-0.61,0-1.09,0.54-1,1.14C4.53,5.8,6.47,7.95,9,8.71V21c0,0.55,0.45,1,1,1h0c0.55,0,1-0.45,1-1v-5h2v5c0,0.55,0.45,1,1,1h0 c0.55,0,1-0.45,1-1V10.05l3.24,3.24c0.39,0.39,1.02,0.39,1.41,0v0c0.39-0.39,0.39-1.02,0-1.41L15.89,8.11z"
        }
      )))
    );
  }
  function StewInfoPopoverContent(props) {
    const {
      stewConfig,
      stewSegmentState,
      selectStewSegment,
      anchorElementRef,
      initialFocusElementRef,
      popoverNavigationItemBlurHandler
    } = props;
    const { sortedSegmentOptions } = useMemo(() => {
      return {
        sortedSegmentOptions: Object.values(stewConfig.stewSegments).sort(
          (configA, configB) => configA.segmentIndex - configB.segmentIndex
        )
      };
    }, [stewConfig]);
    return /* @__PURE__ */ h("div", { className: StewInfoBopper_module_default.contentContainer }, /* @__PURE__ */ h("div", { className: StewInfoBopper_module_default.contentHeader }, /* @__PURE__ */ h("div", { className: StewInfoBopper_module_default.stewNameText }, stewConfig.stewInfo.stewName), /* @__PURE__ */ h("div", { className: StewInfoBopper_module_default.closeButtonContainer }, /* @__PURE__ */ h(
      Button,
      {
        className: StewInfoBopper_module_default.closeButton,
        ariaLabel: "close popover",
        ariaDescription: "a button that closes the stew info popover",
        elementRef: initialFocusElementRef,
        onBlur: popoverNavigationItemBlurHandler,
        onSelect: () => {
          anchorElementRef.current instanceof HTMLDivElement ? anchorElementRef.current.focus() : throwInvalidPathError(
            "StewInfoPopoverContent.CloseButton.onSelect"
          );
        },
        onClick: () => {
          anchorElementRef.current instanceof HTMLDivElement ? anchorElementRef.current.setAttribute(
            "data-pointer-focus",
            "true"
          ) : throwInvalidPathError(
            "StewInfoPopoverContent.CloseButton.onClick"
          );
        }
      },
      /* @__PURE__ */ h("svg", { className: StewInfoBopper_module_default.closeIcon, viewBox: "0 0 24 24" }, /* @__PURE__ */ h(
        "path",
        {
          className: StewInfoBopper_module_default.closeIconOutlineCircle,
          d: "M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10 S17.53 2 12 2z"
        }
      ), /* @__PURE__ */ h(
        "path",
        {
          d: "M12 2m4.3 14.3c-.39.39-1.02.39-1.41 0L12 13.41 9.11 16.3c-.39.39-1.02.39-1.41 0-.39-.39-.39-1.02 0-1.41L10.59 12 7.7 9.11c-.39-.39-.39-1.02 0-1.41.39-.39 1.02-.39 1.41 0L12 10.59l2.89-2.89c.39-.39 1.02-.39 1.41 0 .39.39.39 1.02 0 1.41L13.41 12l2.89 2.89c.38.38.38 1.02 0 1.41z"
        }
      ))
    ))), /* @__PURE__ */ h("div", { className: StewInfoBopper_module_default.stewTaglineText }, stewConfig.stewInfo.stewTagline), /* @__PURE__ */ h("div", { className: StewInfoBopper_module_default.stewMessageText }, stewConfig.stewInfo.stewMessage), /* @__PURE__ */ h("div", { className: StewInfoBopper_module_default.segmentLinks }, sortedSegmentOptions.map((someSegmentConfig) => /* @__PURE__ */ h(
      "div",
      {
        key: someSegmentConfig.segmentKey,
        className: StewInfoBopper_module_default.segmentLinkContainer
      },
      /* @__PURE__ */ h(
        Button,
        {
          ariaLabel: `view ${someSegmentConfig.segmentLabel} segment`,
          ariaDescription: `a button that navigates to the ${someSegmentConfig.segmentLabel} segment`,
          className: getCssClass(StewInfoBopper_module_default.segmentLinkButton, [
            StewInfoBopper_module_default.activeSegment,
            someSegmentConfig.segmentKey === stewSegmentState.segmentKey
          ]),
          onBlur: popoverNavigationItemBlurHandler,
          onSelect: () => {
            selectStewSegment(someSegmentConfig.segmentKey);
            anchorElementRef.current instanceof HTMLDivElement ? anchorElementRef.current.focus() : throwInvalidPathError(
              "StewInfoPopoverContent.CloseButton.onSelect"
            );
          },
          onClick: () => {
            anchorElementRef.current instanceof HTMLDivElement ? anchorElementRef.current.setAttribute(
              "data-pointer-focus",
              "true"
            ) : throwInvalidPathError(
              "StewInfoPopoverContent.CloseButton.onClick"
            );
          }
        },
        someSegmentConfig.segmentLabel
      )
    ))), /* @__PURE__ */ h("div", { className: StewInfoBopper_module_default.contentNavigationFooter }, stewConfig.stewInfo.stewExternalLinks.map(
      (someExternalLink, linkIndex) => /* @__PURE__ */ h("div", { key: linkIndex, className: StewInfoBopper_module_default.externalLinkContainer }, /* @__PURE__ */ h(
        LinkButton,
        {
          target: "_blank",
          ariaLabel: `go to ${stewConfig.stewInfo.stewName}'s ${someExternalLink.linkLabel}`,
          ariaDescription: `a button that opens a new tab and navigates to ${stewConfig.stewInfo.stewName}'s ${someExternalLink.linkLabel}`,
          className: StewInfoBopper_module_default.externalLinkButton,
          onBlur: popoverNavigationItemBlurHandler,
          href: someExternalLink.linkHref
        },
        /* @__PURE__ */ h(ExternalLinkIcon, { someExternalLink })
      ))
    )));
  }
  function ExternalLinkIcon(props) {
    const { someExternalLink } = props;
    const externalLinkUrl = new URL(someExternalLink.linkHref);
    if (externalLinkUrl.host === "github") {
      return /* @__PURE__ */ h("svg", { className: StewInfoBopper_module_default.curatorLinkIcon, viewBox: "8 8 496 496" }, /* @__PURE__ */ h(
        "path",
        {
          d: "M255.969,21.733c-131.739,0-238.572,107.541-238.572,240.206 c0,106.107,68.362,196.121,163.205,227.91c11.929,2.22,16.285-5.196,16.285-11.567c0-5.713-0.205-20.817-0.33-40.856 c-66.36,14.507-80.375-32.208-80.375-32.208c-10.828-27.756-26.489-35.139-26.489-35.139 c-21.684-14.893,1.613-14.591,1.613-14.591c23.948,1.701,36.534,24.759,36.534,24.759 c21.295,36.694,55.866,26.105,69.465,19.947c2.146-15.521,8.318-26.105,15.154-32.116 c-52.974-6.073-108.69-26.681-108.69-118.699c0-26.229,9.31-47.668,24.576-64.478c-2.475-6.071-10.646-30.507,2.329-63.554 c0,0,20.045-6.455,65.613,24.614c19.031-5.325,39.432-7.982,59.742-8.072c20.25,0.123,40.676,2.747,59.738,8.105      c45.547-31.074,65.559-24.614,65.559-24.614c13.002,33.077,4.832,57.482,2.387,63.549c15.297,16.81,24.516,38.25,24.516,64.482 c0,92.258-55.773,112.563-108.92,118.512c8.559,7.422,16.191,22.069,16.191,44.471c0,32.124-0.297,58.019-0.297,65.888 c0,6.427,4.293,13.903,16.402,11.54c94.697-31.824,162.998-121.805,162.998-227.883 C494.604,129.273,387.771,21.733,255.969,21.733L255.969,21.733z M255.969,21.733"
        }
      ));
    } else if (externalLinkUrl.host === "twitter") {
      return /* @__PURE__ */ h("svg", { className: StewInfoBopper_module_default.curatorLinkIcon, viewBox: "-4 -8 532 532" }, /* @__PURE__ */ h(
        "path",
        {
          d: "M256,0c141.29,0 256,114.71 256,256c0,141.29 -114.71,256 -256,256c-141.29,0 -256,-114.71 -256,-256c0,-141.29 114.71,-256 256,-256Zm-45.091,392.158c113.283,0 175.224,-93.87 175.224,-175.223c0,-2.682 0,-5.364 -0.128,-7.919c12.005,-8.684 22.478,-19.54 30.779,-31.928c-10.983,4.853 -22.861,8.174 -35.377,9.706c12.772,-7.663 22.478,-19.668 27.076,-34.099c-11.878,7.024 -25.032,12.132 -39.081,14.942c-11.239,-12.005 -27.203,-19.412 -44.955,-19.412c-33.972,0 -61.558,27.586 -61.558,61.558c0,4.853 0.511,9.578 1.66,14.048c-51.213,-2.554 -96.552,-27.075 -126.947,-64.368c-5.237,9.068 -8.302,19.668 -8.302,30.907c0,21.328 10.856,40.23 27.459,51.213c-10.09,-0.255 -19.541,-3.065 -27.842,-7.662l0,0.766c0,29.885 21.2,54.661 49.425,60.409c-5.108,1.404 -10.6,2.171 -16.219,2.171c-3.96,0 -7.791,-0.383 -11.622,-1.15c7.79,24.521 30.523,42.274 57.471,42.784c-21.073,16.476 -47.637,26.31 -76.501,26.31c-4.981,0 -9.834,-0.256 -14.687,-0.894c26.948,17.624 59.387,27.841 94.125,27.841Z"
        }
      ));
    } else if (externalLinkUrl.host === "instagram") {
      return /* @__PURE__ */ h("svg", { className: StewInfoBopper_module_default.curatorLinkIcon, viewBox: "0 0 512 512" }, /* @__PURE__ */ h(
        "path",
        {
          d: "M256,0c141.29,0 256,114.71 256,256c0,141.29 -114.71,256 -256,256c-141.29,0 -256,-114.71 -256,-256c0,-141.29 114.71,-256 256,-256Zm0,96c-43.453,0 -48.902,0.184 -65.968,0.963c-17.03,0.777 -28.661,3.482 -38.839,7.437c-10.521,4.089 -19.444,9.56 -28.339,18.455c-8.895,8.895 -14.366,17.818 -18.455,28.339c-3.955,10.177 -6.659,21.808 -7.437,38.838c-0.778,17.066 -0.962,22.515 -0.962,65.968c0,43.453 0.184,48.902 0.962,65.968c0.778,17.03 3.482,28.661 7.437,38.838c4.089,10.521 9.56,19.444 18.455,28.34c8.895,8.895 17.818,14.366 28.339,18.455c10.178,3.954 21.809,6.659 38.839,7.436c17.066,0.779 22.515,0.963 65.968,0.963c43.453,0 48.902,-0.184 65.968,-0.963c17.03,-0.777 28.661,-3.482 38.838,-7.436c10.521,-4.089 19.444,-9.56 28.34,-18.455c8.895,-8.896 14.366,-17.819 18.455,-28.34c3.954,-10.177 6.659,-21.808 7.436,-38.838c0.779,-17.066 0.963,-22.515 0.963,-65.968c0,-43.453 -0.184,-48.902 -0.963,-65.968c-0.777,-17.03 -3.482,-28.661 -7.436,-38.838c-4.089,-10.521 -9.56,-19.444 -18.455,-28.339c-8.896,-8.895 -17.819,-14.366 -28.34,-18.455c-10.177,-3.955 -21.808,-6.66 -38.838,-7.437c-17.066,-0.779 -22.515,-0.963 -65.968,-0.963Zm0,28.829c42.722,0 47.782,0.163 64.654,0.933c15.6,0.712 24.071,3.318 29.709,5.509c7.469,2.902 12.799,6.37 18.397,11.969c5.6,5.598 9.067,10.929 11.969,18.397c2.191,5.638 4.798,14.109 5.509,29.709c0.77,16.872 0.933,21.932 0.933,64.654c0,42.722 -0.163,47.782 -0.933,64.654c-0.711,15.6 -3.318,24.071 -5.509,29.709c-2.902,7.469 -6.369,12.799 -11.969,18.397c-5.598,5.6 -10.928,9.067 -18.397,11.969c-5.638,2.191 -14.109,4.798 -29.709,5.509c-16.869,0.77 -21.929,0.933 -64.654,0.933c-42.725,0 -47.784,-0.163 -64.654,-0.933c-15.6,-0.711 -24.071,-3.318 -29.709,-5.509c-7.469,-2.902 -12.799,-6.369 -18.398,-11.969c-5.599,-5.598 -9.066,-10.928 -11.968,-18.397c-2.191,-5.638 -4.798,-14.109 -5.51,-29.709c-0.77,-16.872 -0.932,-21.932 -0.932,-64.654c0,-42.722 0.162,-47.782 0.932,-64.654c0.712,-15.6 3.319,-24.071 5.51,-29.709c2.902,-7.468 6.369,-12.799 11.968,-18.397c5.599,-5.599 10.929,-9.067 18.398,-11.969c5.638,-2.191 14.109,-4.797 29.709,-5.509c16.872,-0.77 21.932,-0.933 64.654,-0.933Zm0,49.009c-45.377,0 -82.162,36.785 -82.162,82.162c0,45.377 36.785,82.162 82.162,82.162c45.377,0 82.162,-36.785 82.162,-82.162c0,-45.377 -36.785,-82.162 -82.162,-82.162Zm0,135.495c-29.455,0 -53.333,-23.878 -53.333,-53.333c0,-29.455 23.878,-53.333 53.333,-53.333c29.455,0 53.333,23.878 53.333,53.333c0,29.455 -23.878,53.333 -53.333,53.333Zm104.609,-138.741c0,10.604 -8.597,19.199 -19.201,19.199c-10.603,0 -19.199,-8.595 -19.199,-19.199c0,-10.604 8.596,-19.2 19.199,-19.2c10.604,0 19.201,8.596 19.201,19.2Z"
        }
      ));
    } else if (someExternalLink.linkHref.startsWith("mailto:")) {
      return /* @__PURE__ */ h("svg", { className: StewInfoBopper_module_default.curatorLinkIcon, viewBox: "-4 -4 32 32" }, /* @__PURE__ */ h("circle", { fill: "black", cx: 12, cy: 12, r: 16 }), /* @__PURE__ */ h(
        "path",
        {
          fill: "white",
          d: "M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm-1 14H5c-.55 0-1-.45-1-1V8l6.94 4.34c.65.41 1.47.41 2.12 0L20 8v9c0 .55-.45 1-1 1zm-7-7L4 6h16l-8 5z"
        }
      ));
    } else {
      return /* @__PURE__ */ h("svg", { className: StewInfoBopper_module_default.curatorLinkIcon, viewBox: "-4 -4 512 512" }, /* @__PURE__ */ h(
        "path",
        {
          d: "M248 8C111.03 8 0 119.03 0 256s111.03 248 248 248 248-111.03 248-248S384.97 8 248 8zm82.29 357.6c-3.9 3.88-7.99 7.95-11.31 11.28-2.99 3-5.1 6.7-6.17 10.71-1.51 5.66-2.73 11.38-4.77 16.87l-17.39 46.85c-13.76 3-28 4.69-42.65 4.69v-27.38c1.69-12.62-7.64-36.26-22.63-51.25-6-6-9.37-14.14-9.37-22.63v-32.01c0-11.64-6.27-22.34-16.46-27.97-14.37-7.95-34.81-19.06-48.81-26.11-11.48-5.78-22.1-13.14-31.65-21.75l-.8-.72a114.792 114.792 0 0 1-18.06-20.74c-9.38-13.77-24.66-36.42-34.59-51.14 20.47-45.5 57.36-82.04 103.2-101.89l24.01 12.01C203.48 89.74 216 82.01 216 70.11v-11.3c7.99-1.29 16.12-2.11 24.39-2.42l28.3 28.3c6.25 6.25 6.25 16.38 0 22.63L264 112l-10.34 10.34c-3.12 3.12-3.12 8.19 0 11.31l4.69 4.69c3.12 3.12 3.12 8.19 0 11.31l-8 8a8.008 8.008 0 0 1-5.66 2.34h-8.99c-2.08 0-4.08.81-5.58 2.27l-9.92 9.65a8.008 8.008 0 0 0-1.58 9.31l15.59 31.19c2.66 5.32-1.21 11.58-7.15 11.58h-5.64c-1.93 0-3.79-.7-5.24-1.96l-9.28-8.06a16.017 16.017 0 0 0-15.55-3.1l-31.17 10.39a11.95 11.95 0 0 0-8.17 11.34c0 4.53 2.56 8.66 6.61 10.69l11.08 5.54c9.41 4.71 19.79 7.16 30.31 7.16s22.59 27.29 32 32h66.75c8.49 0 16.62 3.37 22.63 9.37l13.69 13.69a30.503 30.503 0 0 1 8.93 21.57 46.536 46.536 0 0 1-13.72 32.98zM417 274.25c-5.79-1.45-10.84-5-14.15-9.97l-17.98-26.97a23.97 23.97 0 0 1 0-26.62l19.59-29.38c2.32-3.47 5.5-6.29 9.24-8.15l12.98-6.49C440.2 193.59 448 223.87 448 256c0 8.67-.74 17.16-1.82 25.54L417 274.25z"
        }
      ));
    }
  }

  // source/client/app/StewSegment/components/ViewSearchInput.module.scss
  var css9 = `._flexContainer_1dgzt_1, ._defaultLayout_1dgzt_1, ._columnContainer_1dgzt_1, ._rowContainer_1dgzt_1, ._inputContainer_1dgzt_1, ._itemContainer_1dgzt_1 {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: flex-start;
  align-items: stretch;
}

._flexChild_1dgzt_9, ._defaultLayout_1dgzt_1 {
  flex-grow: 0;
  flex-shrink: 1;
  flex-basis: auto;
}

._itemContainer_1dgzt_1 {
  justify-content: center;
  align-items: center;
}

._rowContainer_1dgzt_1, ._inputContainer_1dgzt_1 {
  flex-direction: row;
}

._columnContainer_1dgzt_1 {
  flex-direction: column;
}

._textEllipsis_1dgzt_28 {
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

._defaultBoxModel_1dgzt_35 {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  border: none;
}

._defaultFont_1dgzt_42, ._searchInput_1dgzt_42 {
  font-family: "Red Hat Mono", monospace;
  line-height: 1.4;
  color: black;
  -webkit-text-size-adjust: 100%;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

._themeBorder_1dgzt_51, ._inputContainer_1dgzt_1 {
  border: 1.5px solid black;
  border-radius: 4px;
}

._themeFocusOutline_1dgzt_56, ._inputContainer_1dgzt_1:has(._searchInput_1dgzt_42:focus) {
  outline: solid 3px transparent;
  outline-offset: 0;
  box-shadow: 0 0 0 3px #2196f3;
  border-radius: 4px;
}

._themeFocusWithoutOutline_1dgzt_63 {
  outline: none;
  box-shadow: none;
  border-radius: 0;
}

._inputContainer_1dgzt_1 {
  flex-grow: 1;
  overflow: hidden;
  align-items: center;
  padding-inline: 4px;
  font-size: 18px;
}
._searchInput_1dgzt_42 {
  font-size: inherit;
  font-weight: 700;
  font-style: italic;
  width: 0;
  flex-grow: 1;
  padding-inline-end: 10px;
}

._clearIcon_1dgzt_85 {
  width: 0.9em;
  height: 0.9em;
}

._closeIconOutlineCircle_1dgzt_90 {
  fill: transparent;
  stroke: black;
  stroke-width: 1.75;
}`;
  document.head.appendChild(document.createElement("style")).appendChild(document.createTextNode(css9));
  var ViewSearchInput_module_default = {
    "flexContainer": "_flexContainer_1dgzt_1",
    "defaultLayout": "_defaultLayout_1dgzt_1",
    "columnContainer": "_columnContainer_1dgzt_1",
    "rowContainer": "_rowContainer_1dgzt_1",
    "inputContainer": "_inputContainer_1dgzt_1",
    "itemContainer": "_itemContainer_1dgzt_1",
    "flexChild": "_flexChild_1dgzt_9",
    "textEllipsis": "_textEllipsis_1dgzt_28",
    "defaultBoxModel": "_defaultBoxModel_1dgzt_35",
    "defaultFont": "_defaultFont_1dgzt_42",
    "searchInput": "_searchInput_1dgzt_42",
    "themeBorder": "_themeBorder_1dgzt_51",
    "themeFocusOutline": "_themeFocusOutline_1dgzt_56",
    "themeFocusWithoutOutline": "_themeFocusWithoutOutline_1dgzt_63",
    "clearIcon": "_clearIcon_1dgzt_85",
    "closeIconOutlineCircle": "_closeIconOutlineCircle_1dgzt_90"
  };

  // source/client/app/StewSegment/components/ViewSearchInput.tsx
  function ViewSearchInput(props) {
    const {
      stewConfig,
      stewSegmentState,
      updateSegmentViewSearch,
      clearSegmentViewSearch
    } = props;
    const searchInputRef = useRef(null);
    const scrollInputIntoFocus = useMemo(
      () => () => {
        const approximateViewSearchDocumentTop = 64;
        const searchInputElement = searchInputRef.current ?? throwInvalidPathError("ViewSearchInput.searchInputRef");
        if (searchInputElement.getBoundingClientRect().top < approximateViewSearchDocumentTop) {
          window.scrollTo({
            behavior: "smooth",
            top: 0
          });
        }
      },
      []
    );
    return /* @__PURE__ */ h("div", { className: ViewSearchInput_module_default.inputContainer }, /* @__PURE__ */ h(
      "input",
      {
        type: "text",
        autocomplete: "off",
        autocorrect: "off",
        autocapitalize: "off",
        spellcheck: false,
        className: ViewSearchInput_module_default.searchInput,
        placeholder: `search ${stewConfig.stewSegments[stewSegmentState.segmentKey].segmentLabel}`,
        ref: searchInputRef,
        value: stewSegmentState.viewSearchQuery,
        onInput: (someInputEvent) => {
          updateSegmentViewSearch(someInputEvent.currentTarget.value);
        },
        onFocus: scrollInputIntoFocus
      }
    ), /* @__PURE__ */ h(
      Button,
      {
        ariaLabel: "clear search",
        ariaDescription: "a button that clears the current segment view search query",
        onFocus: scrollInputIntoFocus,
        onSelect: () => {
          clearSegmentViewSearch();
        }
      },
      /* @__PURE__ */ h("svg", { className: ViewSearchInput_module_default.clearIcon, viewBox: "0 0.5 23 23" }, /* @__PURE__ */ h(
        "path",
        {
          className: ViewSearchInput_module_default.closeIconOutlineCircle,
          d: "M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10 S17.53 2 12 2z"
        }
      ), /* @__PURE__ */ h(
        "path",
        {
          d: "M12 2m4.3 14.3c-.39.39-1.02.39-1.41 0L12 13.41 9.11 16.3c-.39.39-1.02.39-1.41 0-.39-.39-.39-1.02 0-1.41L10.59 12 7.7 9.11c-.39-.39-.39-1.02 0-1.41.39-.39 1.02-.39 1.41 0L12 10.59l2.89-2.89c.39-.39 1.02-.39 1.41 0 .39.39.39 1.02 0 1.41L13.41 12l2.89 2.89c.38.38.38 1.02 0 1.41z"
        }
      ))
    ));
  }

  // source/client/app/StewSegment/components/ViewSortSelect.module.scss
  var css10 = `._flexContainer_1mrye_1, ._defaultLayout_1mrye_1, ._columnContainer_1mrye_1, ._rowContainer_1mrye_1, ._itemContainer_1mrye_1 {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: flex-start;
  align-items: stretch;
}

._flexChild_1mrye_9, ._defaultLayout_1mrye_1 {
  flex-grow: 0;
  flex-shrink: 1;
  flex-basis: auto;
}

._itemContainer_1mrye_1 {
  justify-content: center;
  align-items: center;
}

._rowContainer_1mrye_1 {
  flex-direction: row;
}

._columnContainer_1mrye_1 {
  flex-direction: column;
}

._textEllipsis_1mrye_28 {
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

._defaultBoxModel_1mrye_35 {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  border: none;
}

._defaultFont_1mrye_42 {
  font-family: "Red Hat Mono", monospace;
  line-height: 1.4;
  color: black;
  -webkit-text-size-adjust: 100%;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

._themeBorder_1mrye_51, ._viewSortSelectAnchorBorder_1mrye_51 {
  border: 1.5px solid black;
  border-radius: 4px;
}

._themeFocusOutline_1mrye_56 {
  outline: solid 3px transparent;
  outline-offset: 0;
  box-shadow: 0 0 0 3px #2196f3;
  border-radius: 4px;
}

._themeFocusWithoutOutline_1mrye_63 {
  outline: none;
  box-shadow: none;
  border-radius: 0;
}

._viewSortSelectFontSize_1mrye_69 {
  font-size: 18px;
}

._viewSortSelectIcon_1mrye_73 {
  width: 0.725em;
  height: 0.725em;
  padding-inline-start: 2px;
  padding-inline-end: 1.3333333333px;
}`;
  document.head.appendChild(document.createElement("style")).appendChild(document.createTextNode(css10));
  var ViewSortSelect_module_default = {
    "flexContainer": "_flexContainer_1mrye_1",
    "defaultLayout": "_defaultLayout_1mrye_1",
    "columnContainer": "_columnContainer_1mrye_1",
    "rowContainer": "_rowContainer_1mrye_1",
    "itemContainer": "_itemContainer_1mrye_1",
    "flexChild": "_flexChild_1mrye_9",
    "textEllipsis": "_textEllipsis_1mrye_28",
    "defaultBoxModel": "_defaultBoxModel_1mrye_35",
    "defaultFont": "_defaultFont_1mrye_42",
    "themeBorder": "_themeBorder_1mrye_51",
    "viewSortSelectAnchorBorder": "_viewSortSelectAnchorBorder_1mrye_51",
    "themeFocusOutline": "_themeFocusOutline_1mrye_56",
    "themeFocusWithoutOutline": "_themeFocusWithoutOutline_1mrye_63",
    "viewSortSelectFontSize": "_viewSortSelectFontSize_1mrye_69",
    "viewSortSelectIcon": "_viewSortSelectIcon_1mrye_73"
  };

  // source/client/app/StewSegment/components/ViewSortSelect.tsx
  function ViewSortSelect(props) {
    const { stewConfig, stewSegmentState, selectSegmentSortOption } = props;
    const { sortedSegmentSortOptions } = useMemo(() => {
      return {
        sortedSegmentSortOptions: Object.values(
          stewConfig.stewSegments[stewSegmentState.segmentKey].segmentSortOptions
        ).sort(
          (configA, configB) => configA.sortOptionIndex - configB.sortOptionIndex
        )
      };
    }, [stewConfig, stewSegmentState]);
    return /* @__PURE__ */ h(
      SelectBase,
      {
        popoverAriaRole: "listbox",
        anchorAriaLabel: "select view sort order",
        anchorAriaDescription: `a button that displays a popover with the view sort order options`,
        optionTypeLabel: "view sort order",
        optionLabelKey: "sortOptionLabel",
        SelectMenu: ViewSortSelectMenu,
        anchorBorderClassName: ViewSortSelect_module_default.viewSortSelectAnchorBorder,
        fontSizeClassName: ViewSortSelect_module_default.viewSortSelectFontSize,
        selectIconClassName: ViewSortSelect_module_default.viewSortSelectIcon,
        optionList: sortedSegmentSortOptions,
        selectedOption: stewConfig.stewSegments[stewSegmentState.segmentKey].segmentSortOptions[stewSegmentState.segmentSortOptionKey],
        selectOption: (nextSortOptionConfig) => {
          selectSegmentSortOption(nextSortOptionConfig.sortOptionKey);
        },
        customOptionActionItemProps: {},
        customMenuFooterProps: {},
        customSelectAnchorButtonProps: {
          onFocus: (someFocusEvent) => {
            const approximateViewSortSelectDocumentTop = 59;
            if (!someFocusEvent.currentTarget.hasAttribute("data-pointer-focus") && someFocusEvent.currentTarget.getBoundingClientRect().top < approximateViewSortSelectDocumentTop) {
              window.scrollTo({
                behavior: "smooth",
                top: 0
              });
            }
          }
        }
      }
    );
  }
  function ViewSortSelectMenu(props) {
    return /* @__PURE__ */ h(
      SelectMenuBase,
      {
        OptionActionItem: () => null,
        MenuFooter: () => null,
        ...props
      }
    );
  }

  // source/client/app/StewSegment/components/SegmentPage.module.scss
  var css11 = `._flexContainer_olol0_1, ._defaultLayout_olol0_1, ._columnContainer_olol0_1, ._viewHeaderContainer_olol0_1, ._rowContainer_olol0_1, ._viewSearchInputContainer_olol0_1, ._viewSortSelectContainer_olol0_1, ._infoBopperContainer_olol0_1, ._pageHeader_olol0_1, ._itemContainer_olol0_1, ._viewSelectContainer_olol0_1, ._pageHeaderContainer_olol0_1 {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: flex-start;
  align-items: stretch;
}

._flexChild_olol0_9, ._defaultLayout_olol0_1 {
  flex-grow: 0;
  flex-shrink: 1;
  flex-basis: auto;
}

._itemContainer_olol0_1, ._viewSelectContainer_olol0_1, ._pageHeaderContainer_olol0_1 {
  justify-content: center;
  align-items: center;
}

._rowContainer_olol0_1, ._viewSearchInputContainer_olol0_1, ._viewSortSelectContainer_olol0_1, ._infoBopperContainer_olol0_1, ._pageHeader_olol0_1 {
  flex-direction: row;
}

._columnContainer_olol0_1, ._viewHeaderContainer_olol0_1 {
  flex-direction: column;
}

._textEllipsis_olol0_28 {
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

._defaultBoxModel_olol0_35 {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  border: none;
}

._defaultFont_olol0_42 {
  font-family: "Red Hat Mono", monospace;
  line-height: 1.4;
  color: black;
  -webkit-text-size-adjust: 100%;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

._themeBorder_olol0_51 {
  border: 1.5px solid black;
  border-radius: 4px;
}

._themeFocusOutline_olol0_56 {
  outline: solid 3px transparent;
  outline-offset: 0;
  box-shadow: 0 0 0 3px #2196f3;
  border-radius: 4px;
}

._themeFocusWithoutOutline_olol0_63 {
  outline: none;
  box-shadow: none;
  border-radius: 0;
}

._pageHeader_olol0_1 {
  flex-grow: 1;
  padding: 12px;
  padding-block-start: 12px;
  background-color: #ffffff;
}

._stickyPageHeaderWorkaround_olol0_76 {
  margin-bottom: 57px;
}
._stickyPageHeaderWorkaround_olol0_76 ._pageHeader_olol0_1 {
  position: fixed;
  top: 0;
  width: var(--page-header-width);
}

._viewSelectContainer_olol0_1 {
  justify-content: flex-start;
  flex-shrink: 1;
  flex-grow: 1;
}

._infoBopperContainer_olol0_1 {
  align-items: center;
  padding-inline-start: 32px;
}

._viewHeaderContainer_olol0_1 {
  padding-inline: 12px;
  padding-block-start: 4px;
  padding-block-end: 12px;
}

._viewSortSelectContainer_olol0_1 {
  flex-direction: row-reverse;
  margin-bottom: 4px;
}

._viewSearchInputContainer_olol0_1 {
  padding-top: 8px;
}`;
  document.head.appendChild(document.createElement("style")).appendChild(document.createTextNode(css11));
  var SegmentPage_module_default = {
    "flexContainer": "_flexContainer_olol0_1",
    "defaultLayout": "_defaultLayout_olol0_1",
    "columnContainer": "_columnContainer_olol0_1",
    "viewHeaderContainer": "_viewHeaderContainer_olol0_1",
    "rowContainer": "_rowContainer_olol0_1",
    "viewSearchInputContainer": "_viewSearchInputContainer_olol0_1",
    "viewSortSelectContainer": "_viewSortSelectContainer_olol0_1",
    "infoBopperContainer": "_infoBopperContainer_olol0_1",
    "pageHeader": "_pageHeader_olol0_1",
    "itemContainer": "_itemContainer_olol0_1",
    "viewSelectContainer": "_viewSelectContainer_olol0_1",
    "pageHeaderContainer": "_pageHeaderContainer_olol0_1",
    "flexChild": "_flexChild_olol0_9",
    "textEllipsis": "_textEllipsis_olol0_28",
    "defaultBoxModel": "_defaultBoxModel_olol0_35",
    "defaultFont": "_defaultFont_olol0_42",
    "themeBorder": "_themeBorder_olol0_51",
    "themeFocusOutline": "_themeFocusOutline_olol0_56",
    "themeFocusWithoutOutline": "_themeFocusWithoutOutline_olol0_63",
    "stickyPageHeaderWorkaround": "_stickyPageHeaderWorkaround_olol0_76"
  };

  // source/client/app/StewSegment/components/SegmentPage.tsx
  function SegmentPage(props) {
    const {
      stewConfig,
      stewSegmentState,
      selectSegmentView,
      selectStewSegment,
      selectSegmentSortOption,
      updateSegmentViewSearch,
      clearSegmentViewSearch,
      stewSegmentData
    } = props;
    const { pageHeaderContainerRef } = useStickyPageHeaderWorkaround({
      stickyPageHeaderWorkaroundClassname: SegmentPage_module_default.stickyPageHeaderWorkaround
    });
    return /* @__PURE__ */ h(
      Page,
      {
        pageAriaHeader: `${stewConfig.stewInfo.stewName}: ${stewConfig.stewSegments[stewSegmentState.segmentKey].segmentLabel} segment`
      },
      /* @__PURE__ */ h(
        "div",
        {
          ref: pageHeaderContainerRef,
          className: SegmentPage_module_default.pageHeaderContainer
        },
        /* @__PURE__ */ h("div", { className: SegmentPage_module_default.pageHeader }, /* @__PURE__ */ h("div", { className: SegmentPage_module_default.viewSelectContainer }, /* @__PURE__ */ h(
          SegmentViewSelect,
          {
            stewConfig,
            stewSegmentState,
            selectSegmentView
          }
        )), /* @__PURE__ */ h("div", { className: SegmentPage_module_default.infoBopperContainer }, /* @__PURE__ */ h(
          StewInfoBopper,
          {
            stewConfig,
            stewSegmentState,
            selectStewSegment
          }
        )))
      ),
      /* @__PURE__ */ h("div", { className: SegmentPage_module_default.viewHeaderContainer }, /* @__PURE__ */ h("div", { className: SegmentPage_module_default.viewSortSelectContainer }, /* @__PURE__ */ h(
        ViewSortSelect,
        {
          stewConfig,
          stewSegmentState,
          selectSegmentSortOption
        }
      )), /* @__PURE__ */ h("div", { className: SegmentPage_module_default.viewSearchInputContainer }, /* @__PURE__ */ h(
        ViewSearchInput,
        {
          stewConfig,
          stewSegmentState,
          updateSegmentViewSearch,
          clearSegmentViewSearch
        }
      ))),
      /* @__PURE__ */ h(
        stewSegmentData.SegmentContent,
        {
          ...stewSegmentData.segmentContentProps
        }
      )
    );
  }

  // source/client/app/general/findMapItem.ts
  function findMapItem(api) {
    const { someMap, itemSearchKey, itemTargetValue } = api;
    return Object.values(someMap).find(
      (someMapItem) => someMapItem[itemSearchKey] === itemTargetValue
    );
  }

  // source/client/app/StewSegment/components/ViewPageNavigation.module.scss
  var css12 = `._flexContainer_1vo4i_1, ._defaultLayout_1vo4i_1, ._columnContainer_1vo4i_1, ._rowContainer_1vo4i_1, ._navigationContainer_1vo4i_1, ._itemContainer_1vo4i_1, ._navigationMeterContainer_1vo4i_1 {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: flex-start;
  align-items: stretch;
}

._flexChild_1vo4i_9, ._defaultLayout_1vo4i_1 {
  flex-grow: 0;
  flex-shrink: 1;
  flex-basis: auto;
}

._itemContainer_1vo4i_1, ._navigationMeterContainer_1vo4i_1 {
  justify-content: center;
  align-items: center;
}

._rowContainer_1vo4i_1, ._navigationContainer_1vo4i_1 {
  flex-direction: row;
}

._columnContainer_1vo4i_1 {
  flex-direction: column;
}

._textEllipsis_1vo4i_28 {
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

._defaultBoxModel_1vo4i_35 {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  border: none;
}

._defaultFont_1vo4i_42 {
  font-family: "Red Hat Mono", monospace;
  line-height: 1.4;
  color: black;
  -webkit-text-size-adjust: 100%;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

._themeBorder_1vo4i_51 {
  border: 1.5px solid black;
  border-radius: 4px;
}

._themeFocusOutline_1vo4i_56 {
  outline: solid 3px transparent;
  outline-offset: 0;
  box-shadow: 0 0 0 3px #2196f3;
  border-radius: 4px;
}

._themeFocusWithoutOutline_1vo4i_63 {
  outline: none;
  box-shadow: none;
  border-radius: 0;
}

._navigationContainer_1vo4i_1 {
  align-items: baseline;
  padding-inline: 12px;
  padding-block-start: 24px;
  padding-block-end: 26px;
}

._navigationMeterContainer_1vo4i_1 {
  flex-grow: 1;
}

._viewPageButton_1vo4i_80 {
  color: #5e35b1;
}

._disabledViewPageButtonOverride_1vo4i_84 {
  color: #aaaaaa;
  cursor: default;
}

._navigationText_1vo4i_89, ._navigationMeter_1vo4i_1, ._viewPageButton_1vo4i_80 {
  font-size: 18px;
  font-weight: 700;
}

._navigationMeterAccessibilityDescription_1vo4i_94 {
  display: none;
}

._pageButtonAccessibilityDescription_1vo4i_98 {
  display: none;
}`;
  document.head.appendChild(document.createElement("style")).appendChild(document.createTextNode(css12));
  var ViewPageNavigation_module_default = {
    "flexContainer": "_flexContainer_1vo4i_1",
    "defaultLayout": "_defaultLayout_1vo4i_1",
    "columnContainer": "_columnContainer_1vo4i_1",
    "rowContainer": "_rowContainer_1vo4i_1",
    "navigationContainer": "_navigationContainer_1vo4i_1",
    "itemContainer": "_itemContainer_1vo4i_1",
    "navigationMeterContainer": "_navigationMeterContainer_1vo4i_1",
    "flexChild": "_flexChild_1vo4i_9",
    "textEllipsis": "_textEllipsis_1vo4i_28",
    "defaultBoxModel": "_defaultBoxModel_1vo4i_35",
    "defaultFont": "_defaultFont_1vo4i_42",
    "themeBorder": "_themeBorder_1vo4i_51",
    "themeFocusOutline": "_themeFocusOutline_1vo4i_56",
    "themeFocusWithoutOutline": "_themeFocusWithoutOutline_1vo4i_63",
    "viewPageButton": "_viewPageButton_1vo4i_80",
    "disabledViewPageButtonOverride": "_disabledViewPageButtonOverride_1vo4i_84",
    "navigationText": "_navigationText_1vo4i_89",
    "navigationMeter": "_navigationMeter_1vo4i_1",
    "navigationMeterAccessibilityDescription": "_navigationMeterAccessibilityDescription_1vo4i_94",
    "pageButtonAccessibilityDescription": "_pageButtonAccessibilityDescription_1vo4i_98"
  };

  // source/client/app/StewSegment/components/ViewPageNavigation.tsx
  function ViewPageNavigation(props) {
    const {
      displayViewPageIndex,
      displayViewPagesCount,
      previousViewPageButtonEnabled,
      onSelectPreviousViewPage,
      nextViewPageButtonEnabled,
      onSelectNextViewPage
    } = props;
    const { ariaElementRef } = useInteractiveAria({
      ariaOrnaments: {
        ariaRole: "meter",
        ariaLabel: "view pagination meter",
        ariaDescription: "pagination meter for filtered and sorted view items",
        ariaValueMin: `${1}`,
        ariaValueNow: `${displayViewPageIndex}`,
        ariaValueMax: `${displayViewPagesCount}`
      },
      setCustomAriaAttributes: (ariaElement, ariaOrnaments) => {
        ariaElement.setAttribute("aria-valuemin", ariaOrnaments.ariaValueMin);
        ariaElement.setAttribute("aria-valuenow", ariaOrnaments.ariaValueNow);
        ariaElement.setAttribute("aria-valuemax", ariaOrnaments.ariaValueMax);
      }
    });
    return /* @__PURE__ */ h("div", { className: ViewPageNavigation_module_default.navigationContainer }, /* @__PURE__ */ h(
      ViewPageButton,
      {
        buttonLabel: "prev",
        ariaLabel: "previous page",
        ariaDescription: "a button that displays the previous page of filtered and sorted view items",
        buttonEnabled: previousViewPageButtonEnabled,
        onSelect: onSelectPreviousViewPage
      }
    ), /* @__PURE__ */ h("div", { className: ViewPageNavigation_module_default.navigationMeterContainer, ref: ariaElementRef }, /* @__PURE__ */ h("div", { className: ViewPageNavigation_module_default.navigationMeter }, `${displayViewPageIndex} / ${displayViewPagesCount}`)), /* @__PURE__ */ h(
      ViewPageButton,
      {
        buttonLabel: "next",
        ariaLabel: "next page",
        ariaDescription: "a button that displays the next page of filtered and sorted view items",
        buttonEnabled: nextViewPageButtonEnabled,
        onSelect: onSelectNextViewPage
      }
    ));
  }
  function ViewPageButton(props) {
    const { ariaLabel, ariaDescription, buttonEnabled, onSelect, buttonLabel } = props;
    const buttonDisabled = !buttonEnabled;
    return /* @__PURE__ */ h(
      Button,
      {
        ariaLabel,
        ariaDescription,
        tabIndex: buttonEnabled ? 0 : -1,
        disabled: buttonDisabled,
        className: getCssClass(ViewPageNavigation_module_default.viewPageButton, [
          ViewPageNavigation_module_default.disabledViewPageButtonOverride,
          buttonDisabled
        ]),
        onSelect
      },
      buttonLabel
    );
  }

  // source/client/app/StewSegment/components/SegmentContent.module.scss
  var css13 = `._flexContainer_nzfwy_1, ._defaultLayout_nzfwy_1, ._columnContainer_nzfwy_1, ._viewPageItemsContainer_nzfwy_1, ._rowContainer_nzfwy_1, ._contentFooter_nzfwy_1, ._itemContainer_nzfwy_1, ._contentFooterContainer_nzfwy_1, ._messageContainer_nzfwy_1 {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: flex-start;
  align-items: stretch;
}

._flexChild_nzfwy_9, ._defaultLayout_nzfwy_1 {
  flex-grow: 0;
  flex-shrink: 1;
  flex-basis: auto;
}

._itemContainer_nzfwy_1, ._contentFooterContainer_nzfwy_1, ._messageContainer_nzfwy_1 {
  justify-content: center;
  align-items: center;
}

._rowContainer_nzfwy_1, ._contentFooter_nzfwy_1 {
  flex-direction: row;
}

._columnContainer_nzfwy_1, ._viewPageItemsContainer_nzfwy_1 {
  flex-direction: column;
}

._textEllipsis_nzfwy_28 {
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

._defaultBoxModel_nzfwy_35 {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  border: none;
}

._defaultFont_nzfwy_42 {
  font-family: "Red Hat Mono", monospace;
  line-height: 1.4;
  color: black;
  -webkit-text-size-adjust: 100%;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

._themeBorder_nzfwy_51 {
  border: 1.5px solid black;
  border-radius: 4px;
}

._themeFocusOutline_nzfwy_56 {
  outline: solid 3px transparent;
  outline-offset: 0;
  box-shadow: 0 0 0 3px #2196f3;
  border-radius: 4px;
}

._themeFocusWithoutOutline_nzfwy_63 {
  outline: none;
  box-shadow: none;
  border-radius: 0;
}

._viewPageItemsContainer_nzfwy_1 {
  padding: 12px;
  padding-block-end: 0;
}

._messageContainer_nzfwy_1 {
  padding: 32px;
}

._messageText_nzfwy_78 {
  font-size: 18px;
  font-weight: 700;
  font-style: italic;
  color: #aaaaaa;
}

._contentFooterContainer_nzfwy_1 {
  justify-content: flex-start;
  padding-inline: 8px;
  padding-block-end: 20px;
}

._contentFooter_nzfwy_1 {
  flex-grow: 1;
  align-items: baseline;
  border-top: solid 0.5px #eeeeee;
  border-radius: 4px;
  padding-inline: 4px;
  padding-block-start: 16px;
}

._footerLinkButtonContainer_nzfwy_100 {
  padding-inline-end: 24px;
}

._footerLinkButton_nzfwy_100 {
  color: #5e35b1;
  font-weight: 600;
  font-style: italic;
  font-size: 0.9166666667rem;
}`;
  document.head.appendChild(document.createElement("style")).appendChild(document.createTextNode(css13));
  var SegmentContent_module_default = {
    "flexContainer": "_flexContainer_nzfwy_1",
    "defaultLayout": "_defaultLayout_nzfwy_1",
    "columnContainer": "_columnContainer_nzfwy_1",
    "viewPageItemsContainer": "_viewPageItemsContainer_nzfwy_1",
    "rowContainer": "_rowContainer_nzfwy_1",
    "contentFooter": "_contentFooter_nzfwy_1",
    "itemContainer": "_itemContainer_nzfwy_1",
    "contentFooterContainer": "_contentFooterContainer_nzfwy_1",
    "messageContainer": "_messageContainer_nzfwy_1",
    "flexChild": "_flexChild_nzfwy_9",
    "textEllipsis": "_textEllipsis_nzfwy_28",
    "defaultBoxModel": "_defaultBoxModel_nzfwy_35",
    "defaultFont": "_defaultFont_nzfwy_42",
    "themeBorder": "_themeBorder_nzfwy_51",
    "themeFocusOutline": "_themeFocusOutline_nzfwy_56",
    "themeFocusWithoutOutline": "_themeFocusWithoutOutline_nzfwy_63",
    "messageText": "_messageText_nzfwy_78",
    "footerLinkButtonContainer": "_footerLinkButtonContainer_nzfwy_100",
    "footerLinkButton": "_footerLinkButton_nzfwy_100"
  };

  // source/client/app/StewSegment/components/SegmentContent.tsx
  function ViewPageSegmentContent(props) {
    const {
      stewSegmentState,
      viewPageItems,
      viewPagesCount,
      gotoPreviousViewPage,
      gotoNextViewPage
    } = props;
    const pageTopElementRef = useRef(null);
    useLayoutEffect(() => {
      const pageContentContainerElement = document.getElementById(
        "pageContentContainer"
      );
      const pageTopElement = pageTopElementRef.current;
      if (document.activeElement instanceof HTMLInputElement) {
      } else if (stewSegmentState.viewPageIndex === 0 && pageContentContainerElement instanceof HTMLDivElement) {
        pageContentContainerElement.setAttribute("tabIndex", "-1");
        pageContentContainerElement.focus({
          preventScroll: true
        });
        pageContentContainerElement.removeAttribute("tabIndex");
        window.scrollTo({
          behavior: "auto",
          top: 0
        });
      } else if (stewSegmentState.viewPageIndex > 0 && pageTopElement instanceof HTMLDivElement) {
        pageTopElement.setAttribute("tabIndex", "-1");
        pageTopElement.focus({
          preventScroll: true
        });
        pageTopElement.removeAttribute("tabIndex");
        const approximateViewHeaderDocumentBottomPlusSome = 88;
        window.scrollTo({
          behavior: "auto",
          top: approximateViewHeaderDocumentBottomPlusSome
        });
      } else {
        throwInvalidPathError("ViewPageSegmentContent");
      }
    }, [stewSegmentState.segmentViewKey, stewSegmentState.viewPageIndex]);
    return /* @__PURE__ */ h(I, null, /* @__PURE__ */ h("style", { key: stewSegmentState.segmentKey }, stewSegmentState.segmentCss), /* @__PURE__ */ h("div", { className: SegmentContent_module_default.viewPageItemsContainer }, /* @__PURE__ */ h("div", { ref: pageTopElementRef }), viewPageItems.map((someSegmentItem) => /* @__PURE__ */ h(
      stewSegmentState.segmentModule.SegmentItemDisplay,
      {
        key: someSegmentItem.itemId,
        someSegmentItem
      }
    ))), /* @__PURE__ */ h(
      ViewPageNavigation,
      {
        displayViewPageIndex: stewSegmentState.viewPageIndex + 1,
        displayViewPagesCount: viewPagesCount,
        previousViewPageButtonEnabled: stewSegmentState.viewPageIndex > 0,
        onSelectPreviousViewPage: () => {
          gotoPreviousViewPage();
        },
        nextViewPageButtonEnabled: stewSegmentState.viewPageIndex < viewPagesCount - 1,
        onSelectNextViewPage: () => {
          gotoNextViewPage();
        }
      }
    ), /* @__PURE__ */ h(SegmentContentFooter, null));
  }
  function EmptyViewSegmentContent(props) {
    return /* @__PURE__ */ h(I, null, /* @__PURE__ */ h(SegmentMessage, { segmentMessage: "no items match" }), /* @__PURE__ */ h(
      ViewPageNavigation,
      {
        displayViewPageIndex: 1,
        displayViewPagesCount: 1,
        previousViewPageButtonEnabled: false,
        nextViewPageButtonEnabled: false,
        onSelectPreviousViewPage: () => {
          throwInvalidPathError(
            "EmptyViewSegmentContent.onSelectPreviousViewPage"
          );
        },
        onSelectNextViewPage: () => {
          throwInvalidPathError("EmptyViewSegmentContent.onSelectNextViewPage");
        }
      }
    ), /* @__PURE__ */ h(SegmentContentFooter, null));
  }
  function LoadingSegmentContent(props) {
    return /* @__PURE__ */ h(SegmentMessage, { segmentMessage: "loading..." });
  }
  function ErrorLoadingSegmentContent(props) {
    return /* @__PURE__ */ h(I, null, /* @__PURE__ */ h(SegmentMessage, { segmentMessage: "oops, something happened!!!" }), /* @__PURE__ */ h(SegmentContentFooter, null));
  }
  function SegmentMessage(props) {
    const { segmentMessage } = props;
    return /* @__PURE__ */ h("div", { className: SegmentContent_module_default.messageContainer }, /* @__PURE__ */ h("div", { className: SegmentContent_module_default.messageText }, segmentMessage));
  }
  function SegmentContentFooter(props) {
    const {} = props;
    return /* @__PURE__ */ h("div", { className: SegmentContent_module_default.contentFooterContainer }, /* @__PURE__ */ h("div", { className: SegmentContent_module_default.contentFooter }, /* @__PURE__ */ h(
      LinkButton,
      {
        className: SegmentContent_module_default.footerLinkButton,
        ariaLabel: "go to the stews.io landing page",
        ariaDescription: "a button that opens a new tab and navigates to stews.io",
        href: "https://stews.io",
        target: "_blank"
      },
      "stews.io"
    )));
  }

  // source/client/app/StewSegment/general/fetchSegmentComponents.ts
  function fetchSegmentComponents(api) {
    const { stewResourceMap, someSegmentKey } = api;
    return Promise.all([
      fetch(
        `${stewResourceMap.datasetsDirectoryPath}/${someSegmentKey}.json`
      ).then((getSegmentDataset) => getSegmentDataset.json()),
      fetch(`${stewResourceMap.modulesDirectoryPath}/${someSegmentKey}.js`).then((getSegmentModuleScript) => getSegmentModuleScript.text()).then(
        (nextSegmentModuleScript) => new Function(
          `${nextSegmentModuleScript}return __moduleIifeResult.default`
        )()
      ),
      fetch(`${stewResourceMap.viewsDirectoryPath}/${someSegmentKey}.json`).then(
        (getSegmentViews) => getSegmentViews.json()
      ),
      fetch(`${stewResourceMap.stylesDirectoryPath}/${someSegmentKey}.css`).then(
        (getSegmentCss) => getSegmentCss.text()
      )
    ]);
  }

  // source/client/app/StewSegment/hooks/useStewSegment.ts
  function useStewSegment(api) {
    const {
      initialSegmentViewState,
      stewConfig,
      stewResourceMap,
      routeGotoViewPageMutations,
      routeUpdateSegmentComponentsMutation
    } = api;
    const [stewSegmentState, setSegmentViewState] = useState(
      initialSegmentViewState
    );
    const { stewSegmentMutations } = useStewSegmentMutations({
      stewConfig,
      setSegmentViewState
    });
    const { stewSegmentData } = useStewSegmentData({
      stewConfig,
      stewSegmentState,
      viewPageItemSize: 6,
      ...routeGotoViewPageMutations({
        stewSegmentMutations
      })
    });
    useStewSegmentComponents({
      stewResourceMap,
      stewSegmentState,
      updateSegmentComponents: routeUpdateSegmentComponentsMutation({
        stewSegmentMutations
      })
    });
    useStewSegmentUrl({
      stewSegmentState
    });
    return {
      stewSegmentState,
      stewSegmentMutations,
      stewSegmentData
    };
  }
  function useStewSegmentMutations(api) {
    const { stewConfig, setSegmentViewState } = api;
    const stewSegmentMutations = useMemo(
      () => ({
        selectStewSegment: (nextSegmentKey) => {
          const defaultSegmentViewConfig = findMapItem({
            itemTargetValue: 0,
            itemSearchKey: "viewIndex",
            someMap: stewConfig.stewSegments[nextSegmentKey].segmentViews
          }) ?? throwInvalidPathError("defaultSegmentViewConfig");
          const defaultSegmentSortOptionConfig = findMapItem({
            itemTargetValue: 0,
            itemSearchKey: "sortOptionIndex",
            someMap: stewConfig.stewSegments[nextSegmentKey].segmentSortOptions
          }) ?? throwInvalidPathError("defaultSegmentSortOptionConfig");
          setSegmentViewState({
            viewPageIndex: 0,
            viewSearchQuery: "",
            segmentStatus: "loadingSegment",
            segmentViewKey: defaultSegmentViewConfig.viewKey,
            segmentSortOptionKey: defaultSegmentSortOptionConfig.sortOptionKey,
            segmentKey: nextSegmentKey
          });
        },
        updateSegmentComponents: ([
          nextSegmentDataset,
          nextSegmentModule,
          nextSegmentViewsMap,
          nextSegmentCss
        ]) => {
          setSegmentViewState((currentSegmentViewState) => ({
            ...currentSegmentViewState,
            segmentStatus: "segmentLoaded",
            segmentDataset: nextSegmentDataset,
            segmentModule: nextSegmentModule,
            segmentViewsMap: nextSegmentViewsMap,
            segmentCss: nextSegmentCss
          }));
        },
        selectSegmentView: (nextSegmentViewKey) => {
          setSegmentViewState((currentSegmentViewState) => ({
            ...currentSegmentViewState,
            viewPageIndex: 0,
            segmentViewKey: nextSegmentViewKey
          }));
        },
        selectSegmentSortOption: (nextSegmentSortOptionKey) => {
          setSegmentViewState((currentSegmentViewState) => ({
            ...currentSegmentViewState,
            viewPageIndex: 0,
            segmentSortOptionKey: nextSegmentSortOptionKey
          }));
        },
        updateSegmentViewSearch: (nextViewSearchQuery) => {
          setSegmentViewState((currentSegmentViewState) => ({
            ...currentSegmentViewState,
            viewPageIndex: 0,
            viewSearchQuery: nextViewSearchQuery
          }));
        },
        clearSegmentViewSearch: () => {
          setSegmentViewState((currentSegmentViewState) => ({
            ...currentSegmentViewState,
            viewPageIndex: 0,
            viewSearchQuery: ""
          }));
        },
        gotoPreviousViewPage: () => {
          setSegmentViewState((currentSegmentViewState) => ({
            ...currentSegmentViewState,
            viewPageIndex: currentSegmentViewState.viewPageIndex - 1
          }));
        },
        gotoNextViewPage: () => {
          setSegmentViewState((currentSegmentViewState) => ({
            ...currentSegmentViewState,
            viewPageIndex: currentSegmentViewState.viewPageIndex + 1
          }));
        }
      }),
      [stewConfig, setSegmentViewState]
    );
    return {
      stewSegmentMutations
    };
  }
  function useStewSegmentComponents(api) {
    const { stewSegmentState, stewResourceMap, updateSegmentComponents } = api;
    const segmentSwitchCountRef = useRef(0);
    useEffect(() => {
      if (stewSegmentState.segmentStatus === "loadingSegment") {
        segmentSwitchCountRef.current += 1;
        const correspondingSwitchCount = segmentSwitchCountRef.current;
        Promise.all([
          fetchSegmentComponents({
            stewResourceMap,
            someSegmentKey: stewSegmentState.segmentKey
          }),
          new Promise((resolveMinimumLoadingDisplayPromise) => {
            setTimeout(() => {
              resolveMinimumLoadingDisplayPromise();
            }, 350);
          })
        ]).then(([nextSegmentComponents]) => {
          if (correspondingSwitchCount === segmentSwitchCountRef.current) {
            updateSegmentComponents(nextSegmentComponents);
          }
        });
      }
    }, [stewSegmentState.segmentKey]);
  }
  function useStewSegmentData(api) {
    const {
      stewSegmentState,
      stewConfig,
      viewPageItemSize,
      gotoPreviousViewPage,
      gotoNextViewPage
    } = api;
    const { searchedAndSortedViewItems } = useMemo(
      () => ({
        searchedAndSortedViewItems: stewSegmentState.segmentStatus === "segmentLoaded" ? stewSegmentState.segmentViewsMap[stewSegmentState.segmentViewKey].reduce(
          (searchedAndSortedViewItemsResult, someSegmentItemIndex) => {
            const currentSegmentViewItem = stewSegmentState.segmentDataset[someSegmentItemIndex];
            if (currentSegmentViewItem.__segment_item_search_space.includes(
              stewSegmentState.viewSearchQuery
            )) {
              searchedAndSortedViewItemsResult.push(
                currentSegmentViewItem
              );
            }
            return searchedAndSortedViewItemsResult;
          },
          []
        ).sort(
          stewSegmentState.segmentModule.segmentSortOptions[stewConfig.stewSegments[stewSegmentState.segmentKey].segmentSortOptions[stewSegmentState.segmentSortOptionKey].sortOptionIndex].getSortOrder
        ) : []
      }),
      [
        stewSegmentState.segmentKey,
        stewSegmentState.segmentStatus,
        stewSegmentState.segmentViewKey,
        stewSegmentState.viewSearchQuery,
        stewSegmentState.segmentSortOptionKey
      ]
    );
    const { viewPageItems, viewPagesCount } = useMemo(() => {
      const viewPagesCountResult = Math.ceil(searchedAndSortedViewItems.length / viewPageItemSize) || 1;
      const pageIndexStart = viewPageItemSize * stewSegmentState.viewPageIndex;
      const viewPageItemsResult = searchedAndSortedViewItems.slice(
        pageIndexStart,
        pageIndexStart + viewPageItemSize
      );
      return {
        viewPagesCount: viewPagesCountResult,
        viewPageItems: viewPageItemsResult
      };
    }, [searchedAndSortedViewItems, stewSegmentState.viewPageIndex]);
    const { stewSegmentData } = useMemo(() => {
      const stewSegmentDataResult = stewSegmentState.segmentStatus === "segmentLoaded" && viewPageItems.length === 0 ? {
        SegmentContent: EmptyViewSegmentContent,
        segmentContentProps: {}
      } : stewSegmentState.segmentStatus === "segmentLoaded" ? {
        SegmentContent: ViewPageSegmentContent,
        segmentContentProps: {
          stewSegmentState,
          gotoPreviousViewPage,
          gotoNextViewPage,
          viewPageItems,
          viewPagesCount
        }
      } : stewSegmentState.segmentStatus === "loadingSegment" ? {
        SegmentContent: LoadingSegmentContent,
        segmentContentProps: {}
      } : stewSegmentState.segmentStatus === "errorLoadingSegment" ? {
        SegmentContent: ErrorLoadingSegmentContent,
        segmentContentProps: {}
      } : throwInvalidPathError("useStewSegmentData.stewSegmentData");
      return {
        stewSegmentData: stewSegmentDataResult
      };
    }, [stewSegmentState, viewPageItems, viewPagesCount]);
    return {
      stewSegmentData
    };
  }
  function useStewSegmentUrl(api) {
    const { stewSegmentState } = api;
    useEffect(() => {
      const nextUrlSearchParams = new URLSearchParams();
      nextUrlSearchParams.set("view", `${stewSegmentState.segmentViewKey}`);
      nextUrlSearchParams.set("sort", `${stewSegmentState.segmentSortOptionKey}`);
      if (stewSegmentState.viewSearchQuery.length > 0) {
        nextUrlSearchParams.set("search", stewSegmentState.viewSearchQuery);
      }
      window.history.replaceState(
        null,
        "noop",
        `/${stewSegmentState.segmentKey}?${nextUrlSearchParams.toString()}`
      );
    }, [
      stewSegmentState.segmentKey,
      stewSegmentState.segmentViewKey,
      stewSegmentState.segmentSortOptionKey,
      stewSegmentState.viewSearchQuery
    ]);
  }

  // source/client/app/StewSegment/StewSegment.tsx
  function StewSegment(props) {
    const { stewConfig, stewResourceMap, initialSegmentViewState } = props;
    const { stewSegmentState, stewSegmentData, stewSegmentMutations } = useStewSegment({
      stewConfig,
      stewResourceMap,
      initialSegmentViewState,
      routeUpdateSegmentComponentsMutation: ({ stewSegmentMutations: stewSegmentMutations2 }) => stewSegmentMutations2.updateSegmentComponents,
      routeGotoViewPageMutations: ({ stewSegmentMutations: stewSegmentMutations2 }) => ({
        gotoPreviousViewPage: stewSegmentMutations2.gotoPreviousViewPage,
        gotoNextViewPage: stewSegmentMutations2.gotoNextViewPage
      })
    });
    return /* @__PURE__ */ h(
      SegmentPage,
      {
        stewConfig,
        stewSegmentState,
        stewSegmentData,
        selectStewSegment: stewSegmentMutations.selectStewSegment,
        selectSegmentView: stewSegmentMutations.selectSegmentView,
        selectSegmentSortOption: stewSegmentMutations.selectSegmentSortOption,
        updateSegmentViewSearch: stewSegmentMutations.updateSegmentViewSearch,
        clearSegmentViewSearch: stewSegmentMutations.clearSegmentViewSearch
      }
    );
  }

  // source/client/app/StewApp.tsx
  function StewApp(props) {
    const { stewAppCss, stewConfig, stewResourceMap, initialSegmentViewState } = props;
    return /* @__PURE__ */ h(I, null, /* @__PURE__ */ h("style", null, stewAppCss), /* @__PURE__ */ h(
      StewSegment,
      {
        stewConfig,
        stewResourceMap,
        initialSegmentViewState
      }
    ));
  }

  // source/client/app/main.tsx
  Object.assign(globalThis, {
    Preact: mod_exports,
    PreactHooks: hooks_exports,
    h: le
  });
  loadStewApp();
  async function loadStewApp() {
    const { stewConfig, stewResourceMap, stewAppCss, initialSegmentViewState } = await loadStewResources();
    pe(
      /* @__PURE__ */ h(
        StewApp,
        {
          stewConfig,
          stewResourceMap,
          stewAppCss,
          initialSegmentViewState
        }
      ),
      document.getElementById("appContainer") ?? throwInvalidPathError("hydrate.appContainer")
    );
    document.getElementById("splashPageStyle")?.remove();
    console.info(stewConfig);
  }
  async function loadStewResources() {
    const minimumSplashDisplayPromise = new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, 700);
    });
    const stewBuildId = document.getElementById("appScript")?.dataset["stew_build_id"] ?? throwInvalidPathError("loadStewResources.stewBuildId");
    const stewResourceMap = getStewResourceMap({
      stewBuildId
    });
    const stewConfig = await fetch(stewResourceMap.configPath).then(
      (getConfigResponse) => getConfigResponse.json()
    );
    const [_, urlSegmentKey] = window.location.pathname.split("/");
    const initialSearchParams = new URLSearchParams(window.location.search);
    const initialSegmentConfig = stewConfig.stewSegments[urlSegmentKey] ?? findMapItem({
      itemTargetValue: 0,
      itemSearchKey: "segmentIndex",
      someMap: stewConfig.stewSegments
    }) ?? throwInvalidPathError("initialSegmentConfig");
    const fetchInitialSegmentComponentsResult = fetchSegmentComponents({
      stewResourceMap,
      someSegmentKey: initialSegmentConfig.segmentKey
    });
    const initialSegmentViewConfig = initialSegmentConfig.segmentViews[initialSearchParams.get("view") ?? "__EMPTY_VIEW_KEY__"] ?? findMapItem({
      itemTargetValue: 0,
      itemSearchKey: "viewIndex",
      someMap: initialSegmentConfig.segmentViews
    }) ?? throwInvalidPathError("initialSegmentViewConfig");
    const initialSegmentSortOptionConfig = initialSegmentConfig.segmentSortOptions[initialSearchParams.get("sort") ?? "__EMPTY_SORT_KEY__"] ?? findMapItem({
      itemTargetValue: 0,
      itemSearchKey: "sortOptionIndex",
      someMap: initialSegmentConfig.segmentSortOptions
    }) ?? throwInvalidPathError("initialSegmentSortOptionConfig");
    const fetchStewAppCss = fetch(`/app.${stewConfig.stewBuildId}.css`).then(
      (getStewAppCssResponse) => getStewAppCssResponse.text()
    );
    const regularRedHatMonoFontFace = new FontFace(
      "Red Hat Mono",
      "url(/assets/RedHatMonoVF.woff2)",
      {
        weight: "200 900"
      }
    );
    const italicRedHatMonoFontFace = new FontFace(
      "Red Hat Mono",
      "url(/assets/RedHatMonoVF-Italic.woff2)",
      {
        style: "italic",
        weight: "200 900"
      }
    );
    document.fonts.add(regularRedHatMonoFontFace);
    document.fonts.add(italicRedHatMonoFontFace);
    regularRedHatMonoFontFace.load();
    italicRedHatMonoFontFace.load();
    const [
      [
        initialSegmentDataset,
        initialSegmentModule,
        initialSegmentViewsMap,
        initialSegmentCss
      ],
      stewAppCss
    ] = await Promise.all([
      fetchInitialSegmentComponentsResult,
      fetchStewAppCss,
      document.fonts.ready,
      minimumSplashDisplayPromise
    ]);
    return {
      stewResourceMap,
      stewConfig,
      stewAppCss,
      // what if errorLoadingSegment => currently splash page just hangs without notifying user
      initialSegmentViewState: {
        viewPageIndex: 0,
        segmentStatus: "segmentLoaded",
        segmentDataset: initialSegmentDataset,
        segmentModule: initialSegmentModule,
        segmentViewsMap: initialSegmentViewsMap,
        segmentCss: initialSegmentCss,
        segmentKey: initialSegmentConfig.segmentKey,
        segmentViewKey: initialSegmentViewConfig.viewKey,
        segmentSortOptionKey: initialSegmentSortOptionConfig.sortOptionKey,
        viewSearchQuery: initialSearchParams.get("search") ?? ""
      }
    };
  }
})();
