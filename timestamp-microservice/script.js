( () => {
  "use strict";
  function e(e, t) {
      if (!e)
          throw new Error(t)
  }
  const t = 34028234663852886e22
    , n = -34028234663852886e22
    , r = 4294967295
    , a = 2147483647
    , i = -2147483648;
  function s(e) {
      if ("number" != typeof e)
          throw new Error("invalid int 32: " + typeof e);
      if (!Number.isInteger(e) || e > a || e < i)
          throw new Error("invalid int 32: " + e)
  }
  function o(e) {
      if ("number" != typeof e)
          throw new Error("invalid uint 32: " + typeof e);
      if (!Number.isInteger(e) || e > r || e < 0)
          throw new Error("invalid uint 32: " + e)
  }
  function m(e) {
      if ("number" != typeof e)
          throw new Error("invalid float 32: " + typeof e);
      if (Number.isFinite(e) && (e > t || e < n))
          throw new Error("invalid float 32: " + e)
  }
  const c = Symbol("@bufbuild/protobuf/enum-type");
  function u(e, t, n, r) {
      e[c] = l(t, n.map((t => ({
          no: t.no,
          name: t.name,
          localName: e[t.no]
      }))))
  }
  function l(e, t, n) {
      const r = Object.create(null)
        , a = Object.create(null)
        , i = [];
      for (const e of t) {
          const t = _(e);
          i.push(t),
          r[e.name] = t,
          a[e.no] = t
      }
      return {
          typeName: e,
          values: i,
          findName: e => r[e],
          findNumber: e => a[e]
      }
  }
  function _(e) {
      return "localName"in e ? e : Object.assign(Object.assign({}, e), {
          localName: e.name
      })
  }
  class d {
      equals(e) {
          return this.getType().runtime.util.equals(this.getType(), this, e)
      }
      clone() {
          return this.getType().runtime.util.clone(this)
      }
      fromBinary(e, t) {
          const n = this.getType().runtime.bin
            , r = n.makeReadOptions(t);
          return n.readMessage(this, r.readerFactory(e), e.byteLength, r),
          this
      }
      fromJson(e, t) {
          const n = this.getType()
            , r = n.runtime.json
            , a = r.makeReadOptions(t);
          return r.readMessage(n, e, a, this),
          this
      }
      fromJsonString(e, t) {
          let n;
          try {
              n = JSON.parse(e)
          } catch (e) {
              throw new Error(`cannot decode ${this.getType().typeName} from JSON: ${einstanceof Error ? e.message : String(e)}`)
          }
          return this.fromJson(n, t)
      }
      toBinary(e) {
          const t = this.getType().runtime.bin
            , n = t.makeWriteOptions(e)
            , r = n.writerFactory();
          return t.writeMessage(this, r, n),
          r.finish()
      }
      toJson(e) {
          const t = this.getType().runtime.json
            , n = t.makeWriteOptions(e);
          return t.writeMessage(this, n)
      }
      toJsonString(e) {
          var t;
          const n = this.toJson(e);
          return JSON.stringify(n, null, null !== (t = null == e ? void 0 : e.prettySpaces) && void 0 !== t ? t : 0)
      }
      toJSON() {
          return this.toJson({
              emitDefaultValues: !0
          })
      }
      getType() {
          return Object.getPrototypeOf(this).constructor
      }
  }
  function E() {
      let e = 0
        , t = 0;
      for (let n = 0; n < 28; n += 7) {
          let r = this.buf[this.pos++];
          if (e |= (127 & r) << n,
          0 == (128 & r))
              return this.assertBounds(),
              [e, t]
      }
      let n = this.buf[this.pos++];
      if (e |= (15 & n) << 28,
      t = (112 & n) >> 4,
      0 == (128 & n))
          return this.assertBounds(),
          [e, t];
      for (let n = 3; n <= 31; n += 7) {
          let r = this.buf[this.pos++];
          if (t |= (127 & r) << n,
          0 == (128 & r))
              return this.assertBounds(),
              [e, t]
      }
      throw new Error("invalid varint")
  }
  function T(e, t, n) {
      for (let r = 0; r < 28; r += 7) {
          const a = e >>> r
            , i = !(a >>> 7 == 0 && 0 == t)
            , s = 255 & (i ? 128 | a : a);
          if (n.push(s),
          !i)
              return
      }
      const r = e >>> 28 & 15 | (7 & t) << 4
        , a = !(t >> 3 == 0);
      if (n.push(255 & (a ? 128 | r : r)),
      a) {
          for (let e = 3; e < 31; e += 7) {
              const r = t >>> e
                , a = !(r >>> 7 == 0)
                , i = 255 & (a ? 128 | r : r);
              if (n.push(i),
              !a)
                  return
          }
          n.push(t >>> 31 & 1)
      }
  }
  const f = 4294967296;
  function p(e) {
      const t = "-" === e[0];
      t && (e = e.slice(1));
      const n = 1e6;
      let r = 0
        , a = 0;
      function i(t, i) {
          const s = Number(e.slice(t, i));
          a *= n,
          r = r * n + s,
          r >= f && (a += r / f | 0,
          r %= f)
      }
      return i(-24, -18),
      i(-18, -12),
      i(-12, -6),
      i(-6),
      t ? g(r, a) : N(r, a)
  }
  function S(e, t) {
      if (({lo: e, hi: t} = function(e, t) {
          return {
              lo: e >>> 0,
              hi: t >>> 0
          }
      }(e, t)),
      t <= 2097151)
          return String(f * t + e);
      const n = 16777215 & (e >>> 24 | t << 8)
        , r = t >> 16 & 65535;
      let a = (16777215 & e) + 6777216 * n + 6710656 * r
        , i = n + 8147497 * r
        , s = 2 * r;
      const o = 1e7;
      return a >= o && (i += Math.floor(a / o),
      a %= o),
      i >= o && (s += Math.floor(i / o),
      i %= o),
      s.toString() + I(i) + I(a)
  }
  function N(e, t) {
      return {
          lo: 0 | e,
          hi: 0 | t
      }
  }
  function g(e, t) {
      return t = ~t,
      e ? e = 1 + ~e : t += 1,
      N(e, t)
  }
  const I = e => {
      const t = String(e);
      return "0000000".slice(t.length) + t
  }
  ;
  function C(e, t) {
      if (e >= 0) {
          for (; e > 127; )
              t.push(127 & e | 128),
              e >>>= 7;
          t.push(e)
      } else {
          for (let n = 0; n < 9; n++)
              t.push(127 & e | 128),
              e >>= 7;
          t.push(1)
      }
  }
  function O() {
      let e = this.buf[this.pos++]
        , t = 127 & e;
      if (0 == (128 & e))
          return this.assertBounds(),
          t;
      if (e = this.buf[this.pos++],
      t |= (127 & e) << 7,
      0 == (128 & e))
          return this.assertBounds(),
          t;
      if (e = this.buf[this.pos++],
      t |= (127 & e) << 14,
      0 == (128 & e))
          return this.assertBounds(),
          t;
      if (e = this.buf[this.pos++],
      t |= (127 & e) << 21,
      0 == (128 & e))
          return this.assertBounds(),
          t;
      e = this.buf[this.pos++],
      t |= (15 & e) << 28;
      for (let t = 5; 0 != (128 & e) && t < 10; t++)
          e = this.buf[this.pos++];
      if (0 != (128 & e))
          throw new Error("invalid varint");
      return this.assertBounds(),
      t >>> 0
  }
  const y = function() {
      const t = new DataView(new ArrayBuffer(8));
      if ("function" == typeof BigInt && "function" == typeof t.getBigInt64 && "function" == typeof t.getBigUint64 && "function" == typeof t.setBigInt64 && "function" == typeof t.setBigUint64) {
          const e = BigInt("-9223372036854775808")
            , n = BigInt("9223372036854775807")
            , r = BigInt("0")
            , a = BigInt("18446744073709551615");
          return {
              zero: BigInt(0),
              supported: !0,
              parse(t) {
                  const r = "bigint" == typeof t ? t : BigInt(t);
                  if (r > n || r < e)
                      throw new Error(`int64 invalid: ${t}`);
                  return r
              },
              uParse(e) {
                  const t = "bigint" == typeof e ? e : BigInt(e);
                  if (t > a || t < r)
                      throw new Error(`uint64 invalid: ${e}`);
                  return t
              },
              enc(e) {
                  return t.setBigInt64(0, this.parse(e), !0),
                  {
                      lo: t.getInt32(0, !0),
                      hi: t.getInt32(4, !0)
                  }
              },
              uEnc(e) {
                  return t.setBigInt64(0, this.uParse(e), !0),
                  {
                      lo: t.getInt32(0, !0),
                      hi: t.getInt32(4, !0)
                  }
              },
              dec: (e, n) => (t.setInt32(0, e, !0),
              t.setInt32(4, n, !0),
              t.getBigInt64(0, !0)),
              uDec: (e, n) => (t.setInt32(0, e, !0),
              t.setInt32(4, n, !0),
              t.getBigUint64(0, !0))
          }
      }
      const n = t => e(/^-?[0-9]+$/.test(t), `int64 invalid: ${t}`)
        , r = t => e(/^[0-9]+$/.test(t), `uint64 invalid: ${t}`);
      return {
          zero: "0",
          supported: !1,
          parse: e => ("string" != typeof e && (e = e.toString()),
          n(e),
          e),
          uParse: e => ("string" != typeof e && (e = e.toString()),
          r(e),
          e),
          enc: e => ("string" != typeof e && (e = e.toString()),
          n(e),
          p(e)),
          uEnc: e => ("string" != typeof e && (e = e.toString()),
          r(e),
          p(e)),
          dec: (e, t) => function(e, t) {
              let n = N(e, t);
              const r = 2147483648 & n.hi;
              r && (n = g(n.lo, n.hi));
              const a = S(n.lo, n.hi);
              return r ? "-" + a : a
          }(e, t),
          uDec: (e, t) => S(e, t)
      }
  }();
  var w, A;
  function P(e, t, n) {
      if (t === n)
          return !0;
      if (e == w.BYTES) {
          if (!(t instanceof Uint8Array && n instanceof Uint8Array))
              return !1;
          if (t.length !== n.length)
              return !1;
          for (let e = 0; e < t.length; e++)
              if (t[e] !== n[e])
                  return !1;
          return !0
      }
      switch (e) {
      case w.UINT64:
      case w.FIXED64:
      case w.INT64:
      case w.SFIXED64:
      case w.SINT64:
          return t == n
      }
      return !1
  }
  function L(e, t) {
      switch (e) {
      case w.BOOL:
          return !1;
      case w.UINT64:
      case w.FIXED64:
      case w.INT64:
      case w.SFIXED64:
      case w.SINT64:
          return 0 == t ? y.zero : "0";
      case w.DOUBLE:
      case w.FLOAT:
          return 0;
      case w.BYTES:
          return new Uint8Array(0);
      case w.STRING:
          return "";
      default:
          return 0
      }
  }
  function R(e, t) {
      switch (e) {
      case w.BOOL:
          return !1 === t;
      case w.STRING:
          return "" === t;
      case w.BYTES:
          return t instanceof Uint8Array && !t.byteLength;
      default:
          return 0 == t
      }
  }
  function k(e) {
      const t = e.field.localName
        , n = Object.create(null);
      return n[t] = function(e) {
          const t = e.field;
          if (t.repeated)
              return [];
          if (void 0 !== t.default)
              return t.default;
          switch (t.kind) {
          case "enum":
              return t.T.values[0].no;
          case "scalar":
              return L(t.T, t.L);
          case "message":
              const e = t.T
                , n = new e;
              return e.fieldWrapper ? e.fieldWrapper.unwrapField(n) : n;
          case "map":
              throw "map fields are not allowed to be extensions"
          }
      }(e),
      [n, () => n[t]]
  }
  !function(e) {
      e[e.DOUBLE = 1] = "DOUBLE",
      e[e.FLOAT = 2] = "FLOAT",
      e[e.INT64 = 3] = "INT64",
      e[e.UINT64 = 4] = "UINT64",
      e[e.INT32 = 5] = "INT32",
      e[e.FIXED64 = 6] = "FIXED64",
      e[e.FIXED32 = 7] = "FIXED32",
      e[e.BOOL = 8] = "BOOL",
      e[e.STRING = 9] = "STRING",
      e[e.BYTES = 12] = "BYTES",
      e[e.UINT32 = 13] = "UINT32",
      e[e.SFIXED32 = 15] = "SFIXED32",
      e[e.SFIXED64 = 16] = "SFIXED64",
      e[e.SINT32 = 17] = "SINT32",
      e[e.SINT64 = 18] = "SINT64"
  }(w || (w = {})),
  function(e) {
      e[e.BIGINT = 0] = "BIGINT",
      e[e.STRING = 1] = "STRING"
  }(A || (A = {}));
  let J = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".split("")
    , D = [];
  for (let e = 0; e < J.length; e++)
      D[J[e].charCodeAt(0)] = e;
  D["-".charCodeAt(0)] = J.indexOf("+"),
  D["_".charCodeAt(0)] = J.indexOf("/");
  const h = {
      dec(e) {
          let t = 3 * e.length / 4;
          "=" == e[e.length - 2] ? t -= 2 : "=" == e[e.length - 1] && (t -= 1);
          let n, r = new Uint8Array(t), a = 0, i = 0, s = 0;
          for (let t = 0; t < e.length; t++) {
              if (n = D[e.charCodeAt(t)],
              void 0 === n)
                  switch (e[t]) {
                  case "=":
                      i = 0;
                  case "\n":
                  case "\r":
                  case "\t":
                  case " ":
                      continue;
                  default:
                      throw Error("invalid base64 string.")
                  }
              switch (i) {
              case 0:
                  s = n,
                  i = 1;
                  break;
              case 1:
                  r[a++] = s << 2 | (48 & n) >> 4,
                  s = n,
                  i = 2;
                  break;
              case 2:
                  r[a++] = (15 & s) << 4 | (60 & n) >> 2,
                  s = n,
                  i = 3;
                  break;
              case 3:
                  r[a++] = (3 & s) << 6 | n,
                  i = 0
              }
          }
          if (1 == i)
              throw Error("invalid base64 string.");
          return r.subarray(0, a)
      },
      enc(e) {
          let t, n = "", r = 0, a = 0;
          for (let i = 0; i < e.length; i++)
              switch (t = e[i],
              r) {
              case 0:
                  n += J[t >> 2],
                  a = (3 & t) << 4,
                  r = 1;
                  break;
              case 1:
                  n += J[a | t >> 4],
                  a = (15 & t) << 2,
                  r = 2;
                  break;
              case 2:
                  n += J[a | t >> 6],
                  n += J[63 & t],
                  r = 0
              }
          return r && (n += J[a],
          n += "=",
          1 == r && (n += "=")),
          n
      }
  };
  function x(e, t, n) {
      B(t, e);
      const r = t.runtime.bin.makeReadOptions(n)
        , a = function(e, t) {
          if (!t.repeated && ("enum" == t.kind || "scalar" == t.kind)) {
              for (let n = e.length - 1; n >= 0; --n)
                  if (e[n].no == t.no)
                      return [e[n]];
              return []
          }
          return e.filter((e => e.no === t.no))
      }(e.getType().runtime.bin.listUnknownFields(e), t.field)
        , [i,s] = k(t);
      for (const e of a)
          t.runtime.bin.readField(i, r.readerFactory(e.data), t.field, e.wireType, r);
      return s()
  }
  function U(e, t, n, r) {
      B(t, e);
      const a = t.runtime.bin.makeReadOptions(r)
        , i = t.runtime.bin.makeWriteOptions(r);
      if (M(e, t)) {
          const n = e.getType().runtime.bin.listUnknownFields(e).filter((e => e.no != t.field.no));
          e.getType().runtime.bin.discardUnknownFields(e);
          for (const t of n)
              e.getType().runtime.bin.onUnknownField(e, t.no, t.wireType, t.data)
      }
      const s = i.writerFactory();
      let o = t.field;
      o.opt || o.repeated || "enum" != o.kind && "scalar" != o.kind || (o = Object.assign(Object.assign({}, t.field), {
          opt: !0
      })),
      t.runtime.bin.writeField(o, n, s, i);
      const m = a.readerFactory(s.finish());
      for (; m.pos < m.len; ) {
          const [t,n] = m.tag()
            , r = m.skip(n);
          e.getType().runtime.bin.onUnknownField(e, t, n, r)
      }
  }
  function M(e, t) {
      const n = e.getType();
      return t.extendee.typeName === n.typeName && !!n.runtime.bin.listUnknownFields(e).find((e => e.no == t.field.no))
  }
  function B(t, n) {
      e(t.extendee.typeName == n.getType().typeName, `extension ${t.typeName} can only be applied to message ${t.extendee.typeName}`)
  }
  function F(e, t) {
      const n = e.localName;
      if (e.repeated)
          return t[n].length > 0;
      if (e.oneof)
          return t[e.oneof.localName].case === n;
      switch (e.kind) {
      case "enum":
      case "scalar":
          return e.opt || e.req ? void 0 !== t[n] : "enum" == e.kind ? t[n] !== e.T.values[0].no : !R(e.T, t[n]);
      case "message":
          return void 0 !== t[n];
      case "map":
          return Object.keys(t[n]).length > 0
      }
  }
  function b(e, t) {
      const n = e.localName
        , r = !e.opt && !e.req;
      if (e.repeated)
          t[n] = [];
      else if (e.oneof)
          t[e.oneof.localName] = {
              case: void 0
          };
      else
          switch (e.kind) {
          case "map":
              t[n] = {};
              break;
          case "enum":
              t[n] = r ? e.T.values[0].no : void 0;
              break;
          case "scalar":
              t[n] = r ? L(e.T, e.L) : void 0;
              break;
          case "message":
              t[n] = void 0
          }
  }
  function q(e, t) {
      if (null === e || "object" != typeof e)
          return !1;
      if (!Object.getOwnPropertyNames(d.prototype).every((t => t in e && "function" == typeof e[t])))
          return !1;
      const n = e.getType();
      return null !== n && "function" == typeof n && "typeName"in n && "string" == typeof n.typeName && (void 0 === t || n.typeName == t.typeName)
  }
  function G(e, t) {
      return q(t) || !e.fieldWrapper ? t : e.fieldWrapper.wrapField(t)
  }
  w.DOUBLE,
  w.FLOAT,
  w.INT64,
  w.UINT64,
  w.INT32,
  w.UINT32,
  w.BOOL,
  w.STRING,
  w.BYTES;
  const v = {
      ignoreUnknownFields: !1
  }
    , H = {
      emitDefaultValues: !1,
      enumAsInteger: !1,
      useProtoFieldName: !1,
      prettySpaces: 0
  };
  const V = Symbol()
    , X = Symbol();
  function Y(e) {
      if (null === e)
          return "null";
      switch (typeof e) {
      case "object":
          return Array.isArray(e) ? "array" : "object";
      case "string":
          return e.length > 100 ? "string" : `"${e.split('"').join('\\"')}"`;
      default:
          return String(e)
      }
  }
  function K(t, n, r, a, i) {
      let s = r.localName;
      if (r.repeated) {
          if (e("map" != r.kind),
          null === n)
              return;
          if (!Array.isArray(n))
              throw new Error(`cannot decode field ${i.typeName}.${r.name} from JSON: ${Y(n)}`);
          const o = t[s];
          for (const e of n) {
              if (null === e)
                  throw new Error(`cannot decode field ${i.typeName}.${r.name} from JSON: ${Y(e)}`);
              switch (r.kind) {
              case "message":
                  o.push(r.T.fromJson(e, a));
                  break;
              case "enum":
                  const t = j(r.T, e, a.ignoreUnknownFields, !0);
                  t !== X && o.push(t);
                  break;
              case "scalar":
                  try {
                      o.push(z(r.T, e, r.L, !0))
                  } catch (t) {
                      let n = `cannot decode field ${i.typeName}.${r.name} from JSON: ${Y(e)}`;
                      throw t instanceof Error && t.message.length > 0 && (n += `: ${t.message}`),
                      new Error(n)
                  }
              }
          }
      } else if ("map" == r.kind) {
          if (null === n)
              return;
          if ("object" != typeof n || Array.isArray(n))
              throw new Error(`cannot decode field ${i.typeName}.${r.name} from JSON: ${Y(n)}`);
          const e = t[s];
          for (const [t,s] of Object.entries(n)) {
              if (null === s)
                  throw new Error(`cannot decode field ${i.typeName}.${r.name} from JSON: map value null`);
              let o;
              try {
                  o = W(r.K, t)
              } catch (e) {
                  let t = `cannot decode map key for field ${i.typeName}.${r.name} from JSON: ${Y(n)}`;
                  throw e instanceof Error && e.message.length > 0 && (t += `: ${e.message}`),
                  new Error(t)
              }
              switch (r.V.kind) {
              case "message":
                  e[o] = r.V.T.fromJson(s, a);
                  break;
              case "enum":
                  const t = j(r.V.T, s, a.ignoreUnknownFields, !0);
                  t !== X && (e[o] = t);
                  break;
              case "scalar":
                  try {
                      e[o] = z(r.V.T, s, A.BIGINT, !0)
                  } catch (e) {
                      let t = `cannot decode map value for field ${i.typeName}.${r.name} from JSON: ${Y(n)}`;
                      throw e instanceof Error && e.message.length > 0 && (t += `: ${e.message}`),
                      new Error(t)
                  }
              }
          }
      } else
          switch (r.oneof && (t = t[r.oneof.localName] = {
              case: s
          },
          s = "value"),
          r.kind) {
          case "message":
              const e = r.T;
              if (null === n && "google.protobuf.Value" != e.typeName)
                  return;
              let o = t[s];
              q(o) ? o.fromJson(n, a) : (t[s] = o = e.fromJson(n, a),
              e.fieldWrapper && !r.oneof && (t[s] = e.fieldWrapper.unwrapField(o)));
              break;
          case "enum":
              const m = j(r.T, n, a.ignoreUnknownFields, !1);
              switch (m) {
              case V:
                  b(r, t);
                  break;
              case X:
                  break;
              default:
                  t[s] = m
              }
              break;
          case "scalar":
              try {
                  const e = z(r.T, n, r.L, !1);
                  e === V ? b(r, t) : t[s] = e
              } catch (e) {
                  let t = `cannot decode field ${i.typeName}.${r.name} from JSON: ${Y(n)}`;
                  throw e instanceof Error && e.message.length > 0 && (t += `: ${e.message}`),
                  new Error(t)
              }
          }
  }
  function W(e, t) {
      if (e === w.BOOL)
          switch (t) {
          case "true":
              t = !0;
              break;
          case "false":
              t = !1
          }
      return z(e, t, A.BIGINT, !0).toString()
  }
  function z(e, t, n, r) {
      if (null === t)
          return r ? L(e, n) : V;
      switch (e) {
      case w.DOUBLE:
      case w.FLOAT:
          if ("NaN" === t)
              return Number.NaN;
          if ("Infinity" === t)
              return Number.POSITIVE_INFINITY;
          if ("-Infinity" === t)
              return Number.NEGATIVE_INFINITY;
          if ("" === t)
              break;
          if ("string" == typeof t && t.trim().length !== t.length)
              break;
          if ("string" != typeof t && "number" != typeof t)
              break;
          const r = Number(t);
          if (Number.isNaN(r))
              break;
          if (!Number.isFinite(r))
              break;
          return e == w.FLOAT && m(r),
          r;
      case w.INT32:
      case w.FIXED32:
      case w.SFIXED32:
      case w.SINT32:
      case w.UINT32:
          let a;
          if ("number" == typeof t ? a = t : "string" == typeof t && t.length > 0 && t.trim().length === t.length && (a = Number(t)),
          void 0 === a)
              break;
          return e == w.UINT32 || e == w.FIXED32 ? o(a) : s(a),
          a;
      case w.INT64:
      case w.SFIXED64:
      case w.SINT64:
          if ("number" != typeof t && "string" != typeof t)
              break;
          const i = y.parse(t);
          return n ? i.toString() : i;
      case w.FIXED64:
      case w.UINT64:
          if ("number" != typeof t && "string" != typeof t)
              break;
          const c = y.uParse(t);
          return n ? c.toString() : c;
      case w.BOOL:
          if ("boolean" != typeof t)
              break;
          return t;
      case w.STRING:
          if ("string" != typeof t)
              break;
          try {
              encodeURIComponent(t)
          } catch (e) {
              throw new Error("invalid UTF8")
          }
          return t;
      case w.BYTES:
          if ("" === t)
              return new Uint8Array(0);
          if ("string" != typeof t)
              break;
          return h.dec(t)
      }
      throw new Error
  }
  function j(e, t, n, r) {
      if (null === t)
          return "google.protobuf.NullValue" == e.typeName ? 0 : r ? e.values[0].no : V;
      switch (typeof t) {
      case "number":
          if (Number.isInteger(t))
              return t;
          break;
      case "string":
          const r = e.findName(t);
          if (void 0 !== r)
              return r.no;
          if (n)
              return X
      }
      throw new Error(`cannot decode enum ${e.typeName} from JSON: ${Y(t)}`)
  }
  function $(e) {
      return !(!e.repeated && "map" != e.kind && (e.oneof || "message" == e.kind || e.opt || e.req))
  }
  function Q(t, n, r) {
      if ("map" == t.kind) {
          e("object" == typeof n && null != n);
          const a = {}
            , i = Object.entries(n);
          switch (t.V.kind) {
          case "scalar":
              for (const [e,n] of i)
                  a[e.toString()] = ee(t.V.T, n);
              break;
          case "message":
              for (const [e,t] of i)
                  a[e.toString()] = t.toJson(r);
              break;
          case "enum":
              const e = t.V.T;
              for (const [t,n] of i)
                  a[t.toString()] = Z(e, n, r.enumAsInteger)
          }
          return r.emitDefaultValues || i.length > 0 ? a : void 0
      }
      if (t.repeated) {
          e(Array.isArray(n));
          const a = [];
          switch (t.kind) {
          case "scalar":
              for (let e = 0; e < n.length; e++)
                  a.push(ee(t.T, n[e]));
              break;
          case "enum":
              for (let e = 0; e < n.length; e++)
                  a.push(Z(t.T, n[e], r.enumAsInteger));
              break;
          case "message":
              for (let e = 0; e < n.length; e++)
                  a.push(n[e].toJson(r))
          }
          return r.emitDefaultValues || a.length > 0 ? a : void 0
      }
      switch (t.kind) {
      case "scalar":
          return ee(t.T, n);
      case "enum":
          return Z(t.T, n, r.enumAsInteger);
      case "message":
          return G(t.T, n).toJson(r)
      }
  }
  function Z(t, n, r) {
      var a;
      if (e("number" == typeof n),
      "google.protobuf.NullValue" == t.typeName)
          return null;
      if (r)
          return n;
      const i = t.findNumber(n);
      return null !== (a = null == i ? void 0 : i.name) && void 0 !== a ? a : n
  }
  function ee(t, n) {
      switch (t) {
      case w.INT32:
      case w.SFIXED32:
      case w.SINT32:
      case w.FIXED32:
      case w.UINT32:
          return e("number" == typeof n),
          n;
      case w.FLOAT:
      case w.DOUBLE:
          return e("number" == typeof n),
          Number.isNaN(n) ? "NaN" : n === Number.POSITIVE_INFINITY ? "Infinity" : n === Number.NEGATIVE_INFINITY ? "-Infinity" : n;
      case w.STRING:
          return e("string" == typeof n),
          n;
      case w.BOOL:
          return e("boolean" == typeof n),
          n;
      case w.UINT64:
      case w.FIXED64:
      case w.INT64:
      case w.SFIXED64:
      case w.SINT64:
          return e("bigint" == typeof n || "string" == typeof n || "number" == typeof n),
          n.toString();
      case w.BYTES:
          return e(n instanceof Uint8Array),
          h.enc(n)
      }
  }
  var te;
  !function(e) {
      e[e.Varint = 0] = "Varint",
      e[e.Bit64 = 1] = "Bit64",
      e[e.LengthDelimited = 2] = "LengthDelimited",
      e[e.StartGroup = 3] = "StartGroup",
      e[e.EndGroup = 4] = "EndGroup",
      e[e.Bit32 = 5] = "Bit32"
  }(te || (te = {}));
  class ne {
      constructor(e) {
          this.stack = [],
          this.textEncoder = null != e ? e : new TextEncoder,
          this.chunks = [],
          this.buf = []
      }
      finish() {
          this.chunks.push(new Uint8Array(this.buf));
          let e = 0;
          for (let t = 0; t < this.chunks.length; t++)
              e += this.chunks[t].length;
          let t = new Uint8Array(e)
            , n = 0;
          for (let e = 0; e < this.chunks.length; e++)
              t.set(this.chunks[e], n),
              n += this.chunks[e].length;
          return this.chunks = [],
          t
      }
      fork() {
          return this.stack.push({
              chunks: this.chunks,
              buf: this.buf
          }),
          this.chunks = [],
          this.buf = [],
          this
      }
      join() {
          let e = this.finish()
            , t = this.stack.pop();
          if (!t)
              throw new Error("invalid state, fork stack empty");
          return this.chunks = t.chunks,
          this.buf = t.buf,
          this.uint32(e.byteLength),
          this.raw(e)
      }
      tag(e, t) {
          return this.uint32((e << 3 | t) >>> 0)
      }
      raw(e) {
          return this.buf.length && (this.chunks.push(new Uint8Array(this.buf)),
          this.buf = []),
          this.chunks.push(e),
          this
      }
      uint32(e) {
          for (o(e); e > 127; )
              this.buf.push(127 & e | 128),
              e >>>= 7;
          return this.buf.push(e),
          this
      }
      int32(e) {
          return s(e),
          C(e, this.buf),
          this
      }
      bool(e) {
          return this.buf.push(e ? 1 : 0),
          this
      }
      bytes(e) {
          return this.uint32(e.byteLength),
          this.raw(e)
      }
      string(e) {
          let t = this.textEncoder.encode(e);
          return this.uint32(t.byteLength),
          this.raw(t)
      }
      float(e) {
          m(e);
          let t = new Uint8Array(4);
          return new DataView(t.buffer).setFloat32(0, e, !0),
          this.raw(t)
      }
      double(e) {
          let t = new Uint8Array(8);
          return new DataView(t.buffer).setFloat64(0, e, !0),
          this.raw(t)
      }
      fixed32(e) {
          o(e);
          let t = new Uint8Array(4);
          return new DataView(t.buffer).setUint32(0, e, !0),
          this.raw(t)
      }
      sfixed32(e) {
          s(e);
          let t = new Uint8Array(4);
          return new DataView(t.buffer).setInt32(0, e, !0),
          this.raw(t)
      }
      sint32(e) {
          return s(e),
          C(e = (e << 1 ^ e >> 31) >>> 0, this.buf),
          this
      }
      sfixed64(e) {
          let t = new Uint8Array(8)
            , n = new DataView(t.buffer)
            , r = y.enc(e);
          return n.setInt32(0, r.lo, !0),
          n.setInt32(4, r.hi, !0),
          this.raw(t)
      }
      fixed64(e) {
          let t = new Uint8Array(8)
            , n = new DataView(t.buffer)
            , r = y.uEnc(e);
          return n.setInt32(0, r.lo, !0),
          n.setInt32(4, r.hi, !0),
          this.raw(t)
      }
      int64(e) {
          let t = y.enc(e);
          return T(t.lo, t.hi, this.buf),
          this
      }
      sint64(e) {
          let t = y.enc(e)
            , n = t.hi >> 31;
          return T(t.lo << 1 ^ n, (t.hi << 1 | t.lo >>> 31) ^ n, this.buf),
          this
      }
      uint64(e) {
          let t = y.uEnc(e);
          return T(t.lo, t.hi, this.buf),
          this
      }
  }
  class re {
      constructor(e, t) {
          this.varint64 = E,
          this.uint32 = O,
          this.buf = e,
          this.len = e.length,
          this.pos = 0,
          this.view = new DataView(e.buffer,e.byteOffset,e.byteLength),
          this.textDecoder = null != t ? t : new TextDecoder
      }
      tag() {
          let e = this.uint32()
            , t = e >>> 3
            , n = 7 & e;
          if (t <= 0 || n < 0 || n > 5)
              throw new Error("illegal tag: field no " + t + " wire type " + n);
          return [t, n]
      }
      skip(e) {
          let t = this.pos;
          switch (e) {
          case te.Varint:
              for (; 128 & this.buf[this.pos++]; )
                  ;
              break;
          case te.Bit64:
              this.pos += 4;
          case te.Bit32:
              this.pos += 4;
              break;
          case te.LengthDelimited:
              let t = this.uint32();
              this.pos += t;
              break;
          case te.StartGroup:
              let n;
              for (; (n = this.tag()[1]) !== te.EndGroup; )
                  this.skip(n);
              break;
          default:
              throw new Error("cant skip wire type " + e)
          }
          return this.assertBounds(),
          this.buf.subarray(t, this.pos)
      }
      assertBounds() {
          if (this.pos > this.len)
              throw new RangeError("premature EOF")
      }
      int32() {
          return 0 | this.uint32()
      }
      sint32() {
          let e = this.uint32();
          return e >>> 1 ^ -(1 & e)
      }
      int64() {
          return y.dec(...this.varint64())
      }
      uint64() {
          return y.uDec(...this.varint64())
      }
      sint64() {
          let[e,t] = this.varint64()
            , n = -(1 & e);
          return e = (e >>> 1 | (1 & t) << 31) ^ n,
          t = t >>> 1 ^ n,
          y.dec(e, t)
      }
      bool() {
          let[e,t] = this.varint64();
          return 0 !== e || 0 !== t
      }
      fixed32() {
          return this.view.getUint32((this.pos += 4) - 4, !0)
      }
      sfixed32() {
          return this.view.getInt32((this.pos += 4) - 4, !0)
      }
      fixed64() {
          return y.uDec(this.sfixed32(), this.sfixed32())
      }
      sfixed64() {
          return y.dec(this.sfixed32(), this.sfixed32())
      }
      float() {
          return this.view.getFloat32((this.pos += 4) - 4, !0)
      }
      double() {
          return this.view.getFloat64((this.pos += 8) - 8, !0)
      }
      bytes() {
          let e = this.uint32()
            , t = this.pos;
          return this.pos += e,
          this.assertBounds(),
          this.buf.subarray(t, t + e)
      }
      string() {
          return this.textDecoder.decode(this.bytes())
      }
  }
  const ae = Symbol("@bufbuild/protobuf/unknown-fields")
    , ie = {
      readUnknownFields: !0,
      readerFactory: e => new re(e)
  }
    , se = {
      writeUnknownFields: !0,
      writerFactory: () => new ne
  };
  function oe(e, t, n, r, a) {
      let {repeated: i, localName: s} = n;
      switch (n.oneof && ((e = e[n.oneof.localName]).case != s && delete e.value,
      e.case = s,
      s = "value"),
      n.kind) {
      case "scalar":
      case "enum":
          const o = "enum" == n.kind ? w.INT32 : n.T;
          let m = ue;
          if ("scalar" == n.kind && n.L > 0 && (m = ce),
          i) {
              let n = e[s];
              if (r == te.LengthDelimited && o != w.STRING && o != w.BYTES) {
                  let e = t.uint32() + t.pos;
                  for (; t.pos < e; )
                      n.push(m(t, o))
              } else
                  n.push(m(t, o))
          } else
              e[s] = m(t, o);
          break;
      case "message":
          const c = n.T;
          i ? e[s].push(me(t, new c, a, n)) : q(e[s]) ? me(t, e[s], a, n) : (e[s] = me(t, new c, a, n),
          !c.fieldWrapper || n.oneof || n.repeated || (e[s] = c.fieldWrapper.unwrapField(e[s])));
          break;
      case "map":
          let[u,l] = function(e, t, n) {
              const r = t.uint32()
                , a = t.pos + r;
              let i, s;
              for (; t.pos < a; ) {
                  const [r] = t.tag();
                  switch (r) {
                  case 1:
                      i = ue(t, e.K);
                      break;
                  case 2:
                      switch (e.V.kind) {
                      case "scalar":
                          s = ue(t, e.V.T);
                          break;
                      case "enum":
                          s = t.int32();
                          break;
                      case "message":
                          s = me(t, new e.V.T, n, void 0)
                      }
                  }
              }
              if (void 0 === i && (i = L(e.K, A.BIGINT)),
              "string" != typeof i && "number" != typeof i && (i = i.toString()),
              void 0 === s)
                  switch (e.V.kind) {
                  case "scalar":
                      s = L(e.V.T, A.BIGINT);
                      break;
                  case "enum":
                      s = e.V.T.values[0].no;
                      break;
                  case "message":
                      s = new e.V.T
                  }
              return [i, s]
          }(n, t, a);
          e[s][u] = l
      }
  }
  function me(e, t, n, r) {
      const a = t.getType().runtime.bin
        , i = null == r ? void 0 : r.delimited;
      return a.readMessage(t, e, i ? r.no : e.uint32(), n, i),
      t
  }
  function ce(e, t) {
      const n = ue(e, t);
      return "bigint" == typeof n ? n.toString() : n
  }
  function ue(e, t) {
      switch (t) {
      case w.STRING:
          return e.string();
      case w.BOOL:
          return e.bool();
      case w.DOUBLE:
          return e.double();
      case w.FLOAT:
          return e.float();
      case w.INT32:
          return e.int32();
      case w.INT64:
          return e.int64();
      case w.UINT64:
          return e.uint64();
      case w.FIXED64:
          return e.fixed64();
      case w.BYTES:
          return e.bytes();
      case w.FIXED32:
          return e.fixed32();
      case w.SFIXED32:
          return e.sfixed32();
      case w.SFIXED64:
          return e.sfixed64();
      case w.SINT64:
          return e.sint64();
      case w.UINT32:
          return e.uint32();
      case w.SINT32:
          return e.sint32()
      }
  }
  function le(t, n, r, a) {
      e(void 0 !== n);
      const i = t.repeated;
      switch (t.kind) {
      case "scalar":
      case "enum":
          let s = "enum" == t.kind ? w.INT32 : t.T;
          if (i)
              if (e(Array.isArray(n)),
              t.packed)
                  !function(e, t, n, r) {
                      if (!r.length)
                          return;
                      e.tag(n, te.LengthDelimited).fork();
                      let[,a] = Te(t);
                      for (let t = 0; t < r.length; t++)
                          e[a](r[t]);
                      e.join()
                  }(r, s, t.no, n);
              else
                  for (const e of n)
                      Ee(r, s, t.no, e);
          else
              Ee(r, s, t.no, n);
          break;
      case "message":
          if (i) {
              e(Array.isArray(n));
              for (const e of n)
                  de(r, a, t, e)
          } else
              de(r, a, t, n);
          break;
      case "map":
          e("object" == typeof n && null != n);
          for (const [e,i] of Object.entries(n))
              _e(r, a, t, e, i)
      }
  }
  function _e(t, n, r, a, i) {
      t.tag(r.no, te.LengthDelimited),
      t.fork();
      let s = a;
      switch (r.K) {
      case w.INT32:
      case w.FIXED32:
      case w.UINT32:
      case w.SFIXED32:
      case w.SINT32:
          s = Number.parseInt(a);
          break;
      case w.BOOL:
          e("true" == a || "false" == a),
          s = "true" == a
      }
      switch (Ee(t, r.K, 1, s),
      r.V.kind) {
      case "scalar":
          Ee(t, r.V.T, 2, i);
          break;
      case "enum":
          Ee(t, w.INT32, 2, i);
          break;
      case "message":
          e(void 0 !== i),
          t.tag(2, te.LengthDelimited).bytes(i.toBinary(n))
      }
      t.join()
  }
  function de(e, t, n, r) {
      const a = G(n.T, r);
      n.delimited ? e.tag(n.no, te.StartGroup).raw(a.toBinary(t)).tag(n.no, te.EndGroup) : e.tag(n.no, te.LengthDelimited).bytes(a.toBinary(t))
  }
  function Ee(t, n, r, a) {
      e(void 0 !== a);
      let[i,s] = Te(n);
      t.tag(r, i)[s](a)
  }
  function Te(e) {
      let t = te.Varint;
      switch (e) {
      case w.BYTES:
      case w.STRING:
          t = te.LengthDelimited;
          break;
      case w.DOUBLE:
      case w.FIXED64:
      case w.SFIXED64:
          t = te.Bit64;
          break;
      case w.FIXED32:
      case w.SFIXED32:
      case w.FLOAT:
          t = te.Bit32
      }
      return [t, w[e].toLowerCase()]
  }
  function fe(e) {
      if (void 0 === e)
          return e;
      if (q(e))
          return e.clone();
      if (e instanceof Uint8Array) {
          const t = new Uint8Array(e.byteLength);
          return t.set(e),
          t
      }
      return e
  }
  function pe(e) {
      return e instanceof Uint8Array ? e : new Uint8Array(e)
  }
  class Se {
      constructor(e, t) {
          this._fields = e,
          this._normalizer = t
      }
      findJsonName(e) {
          if (!this.jsonNames) {
              const e = {};
              for (const t of this.list())
                  e[t.jsonName] = e[t.name] = t;
              this.jsonNames = e
          }
          return this.jsonNames[e]
      }
      find(e) {
          if (!this.numbers) {
              const e = {};
              for (const t of this.list())
                  e[t.no] = t;
              this.numbers = e
          }
          return this.numbers[e]
      }
      list() {
          return this.all || (this.all = this._normalizer(this._fields)),
          this.all
      }
      byNumber() {
          return this.numbersAsc || (this.numbersAsc = this.list().concat().sort(( (e, t) => e.no - t.no))),
          this.numbersAsc
      }
      byMember() {
          if (!this.members) {
              this.members = [];
              const e = this.members;
              let t;
              for (const n of this.list())
                  n.oneof ? n.oneof !== t && (t = n.oneof,
                  e.push(t)) : e.push(n)
          }
          return this.members
      }
  }
  function Ne(e, t) {
      const n = Ie(e);
      return t ? n : Ae(we(n))
  }
  const ge = Ie;
  function Ie(e) {
      let t = !1;
      const n = [];
      for (let r = 0; r < e.length; r++) {
          let a = e.charAt(r);
          switch (a) {
          case "_":
              t = !0;
              break;
          case "0":
          case "1":
          case "2":
          case "3":
          case "4":
          case "5":
          case "6":
          case "7":
          case "8":
          case "9":
              n.push(a),
              t = !1;
              break;
          default:
              t && (t = !1,
              a = a.toUpperCase()),
              n.push(a)
          }
      }
      return n.join("")
  }
  new Set(["break", "case", "catch", "class", "const", "continue", "debugger", "default", "delete", "do", "else", "export", "extends", "false", "finally", "for", "function", "if", "import", "in", "instanceof", "new", "null", "return", "super", "switch", "this", "throw", "true", "try", "typeof", "var", "void", "while", "with", "yield", "enum", "implements", "interface", "let", "package", "private", "protected", "public", "static", "Object", "bigint", "number", "boolean", "string", "object", "globalThis", "Uint8Array", "Partial"]);
  const Ce = new Set(["constructor", "toString", "toJSON", "valueOf"])
    , Oe = new Set(["getType", "clone", "equals", "fromBinary", "fromJson", "fromJsonString", "toBinary", "toJson", "toJsonString", "toObject"])
    , ye = e => `${e}$`
    , we = e => Oe.has(e) ? ye(e) : e
    , Ae = e => Ce.has(e) ? ye(e) : e;
  class Pe {
      constructor(e) {
          this.kind = "oneof",
          this.repeated = !1,
          this.packed = !1,
          this.opt = !1,
          this.req = !1,
          this.default = void 0,
          this.fields = [],
          this.name = e,
          this.localName = Ne(e, !1)
      }
      addField(t) {
          e(t.oneof === this, `field ${t.name} not one of ${this.name}`),
          this.fields.push(t)
      }
      findField(e) {
          if (!this._lookup) {
              this._lookup = Object.create(null);
              for (let e = 0; e < this.fields.length; e++)
                  this._lookup[this.fields[e].localName] = this.fields[e]
          }
          return this._lookup[e]
      }
  }
  const Le = (Re = e => new Se(e,(e => function(e, t) {
      var n, r, a, i, s, o;
      const m = [];
      let c;
      for (const t of "function" == typeof e ? e() : e) {
          const e = t;
          if (e.localName = Ne(t.name, void 0 !== t.oneof),
          e.jsonName = null !== (n = t.jsonName) && void 0 !== n ? n : ge(t.name),
          e.repeated = null !== (r = t.repeated) && void 0 !== r && r,
          "scalar" == t.kind && (e.L = null !== (a = t.L) && void 0 !== a ? a : A.BIGINT),
          e.delimited = null !== (i = t.delimited) && void 0 !== i && i,
          e.req = null !== (s = t.req) && void 0 !== s && s,
          e.opt = null !== (o = t.opt) && void 0 !== o && o,
          void 0 === t.packed && (e.packed = "enum" == t.kind || "scalar" == t.kind && t.T != w.BYTES && t.T != w.STRING),
          void 0 !== t.oneof) {
              const n = "string" == typeof t.oneof ? t.oneof : t.oneof.name;
              c && c.name == n || (c = new Pe(n)),
              e.oneof = c,
              c.addField(e)
          }
          m.push(e)
      }
      return m
  }(e))),
  ke = e => {
      for (const t of e.getType().fields.byMember()) {
          if (t.opt)
              continue;
          const n = t.localName
            , r = e;
          if (t.repeated)
              r[n] = [];
          else
              switch (t.kind) {
              case "oneof":
                  r[n] = {
                      case: void 0
                  };
                  break;
              case "enum":
                  r[n] = 0;
                  break;
              case "map":
                  r[n] = {};
                  break;
              case "scalar":
                  r[n] = L(t.T, t.L)
              }
      }
  }
  ,
  {
      syntax: "proto3",
      json: {
          makeReadOptions: function(e) {
              return e ? Object.assign(Object.assign({}, v), e) : v
          },
          makeWriteOptions: function(e) {
              return e ? Object.assign(Object.assign({}, H), e) : H
          },
          readMessage(e, t, n, r) {
              if (null == t || Array.isArray(t) || "object" != typeof t)
                  throw new Error(`cannot decode message ${e.typeName} from JSON: ${Y(t)}`);
              r = null != r ? r : new e;
              const a = new Map
                , i = n.typeRegistry;
              for (const [s,o] of Object.entries(t)) {
                  const t = e.fields.findJsonName(s);
                  if (t) {
                      if (t.oneof) {
                          if (null === o && "scalar" == t.kind)
                              continue;
                          const n = a.get(t.oneof);
                          if (void 0 !== n)
                              throw new Error(`cannot decode message ${e.typeName} from JSON: multiple keys for oneof "${t.oneof.name}" present: "${n}", "${s}"`);
                          a.set(t.oneof, s)
                      }
                      K(r, o, t, n, e)
                  } else {
                      let t = !1;
                      if ((null == i ? void 0 : i.findExtension) && s.startsWith("[") && s.endsWith("]")) {
                          const a = i.findExtension(s.substring(1, s.length - 1));
                          if (a && a.extendee.typeName == e.typeName) {
                              t = !0;
                              const [e,i] = k(a);
                              K(e, o, a.field, n, a),
                              U(r, a, i(), n)
                          }
                      }
                      if (!t && !n.ignoreUnknownFields)
                          throw new Error(`cannot decode message ${e.typeName} from JSON: key "${s}" is unknown`)
                  }
              }
              return r
          },
          writeMessage(e, t) {
              const n = e.getType()
                , r = {};
              let a;
              try {
                  for (a of n.fields.byNumber()) {
                      if (!F(a, e)) {
                          if (a.req)
                              throw "required field not set";
                          if (!t.emitDefaultValues)
                              continue;
                          if (!$(a))
                              continue
                      }
                      const n = Q(a, a.oneof ? e[a.oneof.localName].value : e[a.localName], t);
                      void 0 !== n && (r[t.useProtoFieldName ? a.name : a.jsonName] = n)
                  }
                  const i = t.typeRegistry;
                  if (null == i ? void 0 : i.findExtensionFor)
                      for (const a of n.runtime.bin.listUnknownFields(e)) {
                          const s = i.findExtensionFor(n.typeName, a.no);
                          if (s && M(e, s)) {
                              const n = x(e, s, t)
                                , a = Q(s.field, n, t);
                              void 0 !== a && (r[s.field.jsonName] = a)
                          }
                      }
              } catch (e) {
                  const t = a ? `cannot encode field ${n.typeName}.${a.name} to JSON` : `cannot encode message ${n.typeName} to JSON`
                    , r = e instanceof Error ? e.message : String(e);
                  throw new Error(t + (r.length > 0 ? `: ${r}` : ""))
              }
              return r
          },
          readScalar: (e, t, n) => z(e, t, null != n ? n : A.BIGINT, !0),
          writeScalar(e, t, n) {
              if (void 0 !== t)
                  return n || R(e, t) ? ee(e, t) : void 0
          },
          debug: Y
      },
      bin: {
          makeReadOptions: function(e) {
              return e ? Object.assign(Object.assign({}, ie), e) : ie
          },
          makeWriteOptions: function(e) {
              return e ? Object.assign(Object.assign({}, se), e) : se
          },
          listUnknownFields(e) {
              var t;
              return null !== (t = e[ae]) && void 0 !== t ? t : []
          },
          discardUnknownFields(e) {
              delete e[ae]
          },
          writeUnknownFields(e, t) {
              const n = e[ae];
              if (n)
                  for (const e of n)
                      t.tag(e.no, e.wireType).raw(e.data)
          },
          onUnknownField(e, t, n, r) {
              const a = e;
              Array.isArray(a[ae]) || (a[ae] = []),
              a[ae].push({
                  no: t,
                  wireType: n,
                  data: r
              })
          },
          readMessage(e, t, n, r, a) {
              const i = e.getType()
                , s = a ? t.len : t.pos + n;
              let o, m;
              for (; t.pos < s && ([o,m] = t.tag(),
              m != te.EndGroup); ) {
                  const n = i.fields.find(o);
                  if (n)
                      oe(e, t, n, m, r);
                  else {
                      const n = t.skip(m);
                      r.readUnknownFields && this.onUnknownField(e, o, m, n)
                  }
              }
              if (a && (m != te.EndGroup || o !== n))
                  throw new Error("invalid end group tag")
          },
          readField: oe,
          writeMessage(e, t, n) {
              const r = e.getType();
              for (const a of r.fields.byNumber())
                  if (F(a, e))
                      le(a, a.oneof ? e[a.oneof.localName].value : e[a.localName], t, n);
                  else if (a.req)
                      throw new Error(`cannot encode field ${r.typeName}.${a.name} to binary: required field not set`);
              return n.writeUnknownFields && this.writeUnknownFields(e, t),
              t
          },
          writeField(e, t, n, r) {
              void 0 !== t && le(e, t, n, r)
          }
      },
      util: Object.assign(Object.assign({}, {
          setEnumType: u,
          initPartial(e, t) {
              if (void 0 === e)
                  return;
              const n = t.getType();
              for (const r of n.fields.byMember()) {
                  const n = r.localName
                    , a = t
                    , i = e;
                  if (void 0 !== i[n])
                      switch (r.kind) {
                      case "oneof":
                          const e = i[n].case;
                          if (void 0 === e)
                              continue;
                          const t = r.findField(e);
                          let s = i[n].value;
                          t && "message" == t.kind && !q(s, t.T) ? s = new t.T(s) : t && "scalar" === t.kind && t.T === w.BYTES && (s = pe(s)),
                          a[n] = {
                              case: e,
                              value: s
                          };
                          break;
                      case "scalar":
                      case "enum":
                          let o = i[n];
                          r.T === w.BYTES && (o = r.repeated ? o.map(pe) : pe(o)),
                          a[n] = o;
                          break;
                      case "map":
                          switch (r.V.kind) {
                          case "scalar":
                          case "enum":
                              if (r.V.T === w.BYTES)
                                  for (const [e,t] of Object.entries(i[n]))
                                      a[n][e] = pe(t);
                              else
                                  Object.assign(a[n], i[n]);
                              break;
                          case "message":
                              const e = r.V.T;
                              for (const t of Object.keys(i[n])) {
                                  let r = i[n][t];
                                  e.fieldWrapper || (r = new e(r)),
                                  a[n][t] = r
                              }
                          }
                          break;
                      case "message":
                          const m = r.T;
                          if (r.repeated)
                              a[n] = i[n].map((e => q(e, m) ? e : new m(e)));
                          else {
                              const e = i[n];
                              m.fieldWrapper ? "google.protobuf.BytesValue" === m.typeName ? a[n] = pe(e) : a[n] = e : a[n] = q(e, m) ? e : new m(e)
                          }
                      }
              }
          },
          equals: (e, t, n) => t === n || !(!t || !n) && e.fields.byMember().every((e => {
              const r = t[e.localName]
                , a = n[e.localName];
              if (e.repeated) {
                  if (r.length !== a.length)
                      return !1;
                  switch (e.kind) {
                  case "message":
                      return r.every(( (t, n) => e.T.equals(t, a[n])));
                  case "scalar":
                      return r.every(( (t, n) => P(e.T, t, a[n])));
                  case "enum":
                      return r.every(( (e, t) => P(w.INT32, e, a[t])))
                  }
                  throw new Error(`repeated cannot contain ${e.kind}`)
              }
              switch (e.kind) {
              case "message":
                  return e.T.equals(r, a);
              case "enum":
                  return P(w.INT32, r, a);
              case "scalar":
                  return P(e.T, r, a);
              case "oneof":
                  if (r.case !== a.case)
                      return !1;
                  const t = e.findField(r.case);
                  if (void 0 === t)
                      return !0;
                  switch (t.kind) {
                  case "message":
                      return t.T.equals(r.value, a.value);
                  case "enum":
                      return P(w.INT32, r.value, a.value);
                  case "scalar":
                      return P(t.T, r.value, a.value)
                  }
                  throw new Error(`oneof cannot contain ${t.kind}`);
              case "map":
                  const n = Object.keys(r).concat(Object.keys(a));
                  switch (e.V.kind) {
                  case "message":
                      const t = e.V.T;
                      return n.every((e => t.equals(r[e], a[e])));
                  case "enum":
                      return n.every((e => P(w.INT32, r[e], a[e])));
                  case "scalar":
                      const i = e.V.T;
                      return n.every((e => P(i, r[e], a[e])))
                  }
              }
          }
          )),
          clone(e) {
              const t = e.getType()
                , n = new t
                , r = n;
              for (const n of t.fields.byMember()) {
                  const t = e[n.localName];
                  let a;
                  if (n.repeated)
                      a = t.map(fe);
                  else if ("map" == n.kind) {
                      a = r[n.localName];
                      for (const [e,n] of Object.entries(t))
                          a[e] = fe(n)
                  } else
                      a = "oneof" == n.kind ? n.findField(t.case) ? {
                          case: t.case,
                          value: fe(t.value)
                      } : {
                          case: void 0
                      } : fe(t);
                  r[n.localName] = a
              }
              for (const n of t.runtime.bin.listUnknownFields(e))
                  t.runtime.bin.onUnknownField(r, n.no, n.wireType, n.data);
              return n
          }
      }), {
          newFieldList: Re,
          initFields: ke
      }),
      makeMessageType(e, t, n) {
          return function(e, t, n, r) {
              var a;
              const i = null !== (a = null == r ? void 0 : r.localName) && void 0 !== a ? a : t.substring(t.lastIndexOf(".") + 1)
                , s = {
                  [i]: function(t) {
                      e.util.initFields(this),
                      e.util.initPartial(t, this)
                  }
              }[i];
              return Object.setPrototypeOf(s.prototype, new d),
              Object.assign(s, {
                  runtime: e,
                  typeName: t,
                  fields: e.util.newFieldList(n),
                  fromBinary: (e, t) => (new s).fromBinary(e, t),
                  fromJson: (e, t) => (new s).fromJson(e, t),
                  fromJsonString: (e, t) => (new s).fromJsonString(e, t),
                  equals: (t, n) => e.util.equals(s, t, n)
              }),
              s
          }(this, e, t, n)
      },
      makeEnum: function(e, t, n) {
          const r = {};
          for (const e of t) {
              const t = _(e);
              r[t.localName] = t.no,
              r[t.no] = t.localName
          }
          return u(r, e, t),
          r
      },
      makeEnumType: l,
      getEnumType: function(t) {
          const n = t[c];
          return e(n, "missing enum type on enum object"),
          n
      },
      makeExtension(e, t, n) {
          return function(e, t, n, r) {
              let a;
              return {
                  typeName: t,
                  extendee: n,
                  get field() {
                      if (!a) {
                          const n = "function" == typeof r ? r() : r;
                          n.name = t.split(".").pop(),
                          n.jsonName = `[${t}]`,
                          a = e.util.newFieldList([n]).list()[0]
                      }
                      return a
                  },
                  runtime: e
              }
          }(this, e, t, n)
      }
  });
  var Re, ke;
  class Je extends d {
      constructor(e) {
          super(),
          this.seconds = y.zero,
          this.nanos = 0,
          Le.util.initPartial(e, this)
      }
      fromJson(e, t) {
          if ("string" != typeof e)
              throw new Error(`cannot decode google.protobuf.Timestamp from JSON: ${Le.json.debug(e)}`);
          const n = e.match(/^([0-9]{4})-([0-9]{2})-([0-9]{2})T([0-9]{2}):([0-9]{2}):([0-9]{2})(?:Z|\.([0-9]{3,9})Z|([+-][0-9][0-9]:[0-9][0-9]))$/);
          if (!n)
              throw new Error("cannot decode google.protobuf.Timestamp from JSON: invalid RFC 3339 string");
          const r = Date.parse(n[1] + "-" + n[2] + "-" + n[3] + "T" + n[4] + ":" + n[5] + ":" + n[6] + (n[8] ? n[8] : "Z"));
          if (Number.isNaN(r))
              throw new Error("cannot decode google.protobuf.Timestamp from JSON: invalid RFC 3339 string");
          if (r < Date.parse("0001-01-01T00:00:00Z") || r > Date.parse("9999-12-31T23:59:59Z"))
              throw new Error("cannot decode message google.protobuf.Timestamp from JSON: must be from 0001-01-01T00:00:00Z to 9999-12-31T23:59:59Z inclusive");
          return this.seconds = y.parse(r / 1e3),
          this.nanos = 0,
          n[7] && (this.nanos = parseInt("1" + n[7] + "0".repeat(9 - n[7].length)) - 1e9),
          this
      }
      toJson(e) {
          const t = 1e3 * Number(this.seconds);
          if (t < Date.parse("0001-01-01T00:00:00Z") || t > Date.parse("9999-12-31T23:59:59Z"))
              throw new Error("cannot encode google.protobuf.Timestamp to JSON: must be from 0001-01-01T00:00:00Z to 9999-12-31T23:59:59Z inclusive");
          if (this.nanos < 0)
              throw new Error("cannot encode google.protobuf.Timestamp to JSON: nanos must not be negative");
          let n = "Z";
          if (this.nanos > 0) {
              const e = (this.nanos + 1e9).toString().substring(1);
              n = "000000" === e.substring(3) ? "." + e.substring(0, 3) + "Z" : "000" === e.substring(6) ? "." + e.substring(0, 6) + "Z" : "." + e + "Z"
          }
          return new Date(t).toISOString().replace(".000Z", n)
      }
      toDate() {
          return new Date(1e3 * Number(this.seconds) + Math.ceil(this.nanos / 1e6))
      }
      static now() {
          return Je.fromDate(new Date)
      }
      static fromDate(e) {
          const t = e.getTime();
          return new Je({
              seconds: y.parse(Math.floor(t / 1e3)),
              nanos: t % 1e3 * 1e6
          })
      }
      static fromBinary(e, t) {
          return (new Je).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new Je).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new Je).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(Je, e, t)
      }
  }
  Je.runtime = Le,
  Je.typeName = "google.protobuf.Timestamp",
  Je.fields = Le.util.newFieldList(( () => [{
      no: 1,
      name: "seconds",
      kind: "scalar",
      T: 3
  }, {
      no: 2,
      name: "nanos",
      kind: "scalar",
      T: 5
  }]));
  class De extends d {
      constructor(e) {
          super(),
          this.seconds = y.zero,
          this.nanos = 0,
          Le.util.initPartial(e, this)
      }
      fromJson(e, t) {
          if ("string" != typeof e)
              throw new Error(`cannot decode google.protobuf.Duration from JSON: ${Le.json.debug(e)}`);
          const n = e.match(/^(-?[0-9]+)(?:\.([0-9]+))?s/);
          if (null === n)
              throw new Error(`cannot decode google.protobuf.Duration from JSON: ${Le.json.debug(e)}`);
          const r = Number(n[1]);
          if (r > 315576e6 || r < -315576e6)
              throw new Error(`cannot decode google.protobuf.Duration from JSON: ${Le.json.debug(e)}`);
          if (this.seconds = y.parse(r),
          "string" == typeof n[2]) {
              const e = n[2] + "0".repeat(9 - n[2].length);
              this.nanos = parseInt(e),
              (r < 0 || Object.is(r, -0)) && (this.nanos = -this.nanos)
          }
          return this
      }
      toJson(e) {
          if (Number(this.seconds) > 315576e6 || Number(this.seconds) < -315576e6)
              throw new Error("cannot encode google.protobuf.Duration to JSON: value out of range");
          let t = this.seconds.toString();
          if (0 !== this.nanos) {
              let e = Math.abs(this.nanos).toString();
              e = "0".repeat(9 - e.length) + e,
              "000000" === e.substring(3) ? e = e.substring(0, 3) : "000" === e.substring(6) && (e = e.substring(0, 6)),
              t += "." + e,
              this.nanos < 0 && 0 == Number(this.seconds) && (t = "-" + t)
          }
          return t + "s"
      }
      static fromBinary(e, t) {
          return (new De).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new De).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new De).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(De, e, t)
      }
  }
  let he, xe, Ue, Me, Be, Fe, be, qe, Ge, ve, He, Ve, Xe, Ye, Ke, We, ze, je, $e, Qe, Ze, et, tt, nt, rt, at, it, st, ot, mt, ct, ut, lt, _t, dt, Et, Tt, ft, pt, St, Nt, gt, It, Ct, Ot, yt, wt, At, Pt, Lt, Rt;
  De.runtime = Le,
  De.typeName = "google.protobuf.Duration",
  De.fields = Le.util.newFieldList(( () => [{
      no: 1,
      name: "seconds",
      kind: "scalar",
      T: 3
  }, {
      no: 2,
      name: "nanos",
      kind: "scalar",
      T: 5
  }])),
  function(e) {
      e[e.UNSPECIFIED = 0] = "UNSPECIFIED",
      e[e.AUTOCOMPLETE = 1] = "AUTOCOMPLETE",
      e[e.CHAT = 2] = "CHAT",
      e[e.COMMAND_GENERATE = 4] = "COMMAND_GENERATE",
      e[e.COMMAND_EDIT = 5] = "COMMAND_EDIT",
      e[e.SUPERCOMPLETE = 6] = "SUPERCOMPLETE",
      e[e.COMMAND_PLAN = 7] = "COMMAND_PLAN",
      e[e.QUERY = 8] = "QUERY",
      e[e.FAST_APPLY = 9] = "FAST_APPLY",
      e[e.COMMAND_TERMINAL = 10] = "COMMAND_TERMINAL",
      e[e.TAB_TO_JUMP = 11] = "TAB_TO_JUMP"
  }(he || (he = {})),
  Le.util.setEnumType(he, "exa.codeium_common_pb.ProviderSource", [{
      no: 0,
      name: "PROVIDER_SOURCE_UNSPECIFIED"
  }, {
      no: 1,
      name: "PROVIDER_SOURCE_AUTOCOMPLETE"
  }, {
      no: 2,
      name: "PROVIDER_SOURCE_CHAT"
  }, {
      no: 4,
      name: "PROVIDER_SOURCE_COMMAND_GENERATE"
  }, {
      no: 5,
      name: "PROVIDER_SOURCE_COMMAND_EDIT"
  }, {
      no: 6,
      name: "PROVIDER_SOURCE_SUPERCOMPLETE"
  }, {
      no: 7,
      name: "PROVIDER_SOURCE_COMMAND_PLAN"
  }, {
      no: 8,
      name: "PROVIDER_SOURCE_QUERY"
  }, {
      no: 9,
      name: "PROVIDER_SOURCE_FAST_APPLY"
  }, {
      no: 10,
      name: "PROVIDER_SOURCE_COMMAND_TERMINAL"
  }, {
      no: 11,
      name: "PROVIDER_SOURCE_TAB_TO_JUMP"
  }]),
  function(e) {
      e[e.UNSPECIFIED = 0] = "UNSPECIFIED",
      e[e.FILE_MARKER = 2] = "FILE_MARKER",
      e[e.OTHER_DOCUMENT = 4] = "OTHER_DOCUMENT",
      e[e.BEFORE_CURSOR = 5] = "BEFORE_CURSOR",
      e[e.AFTER_CURSOR = 7] = "AFTER_CURSOR",
      e[e.FIM = 8] = "FIM",
      e[e.SOT = 9] = "SOT",
      e[e.EOT = 10] = "EOT",
      e[e.CODE_CONTEXT_ITEM = 13] = "CODE_CONTEXT_ITEM",
      e[e.INSTRUCTION = 14] = "INSTRUCTION",
      e[e.SELECTION = 15] = "SELECTION"
  }(xe || (xe = {})),
  Le.util.setEnumType(xe, "exa.codeium_common_pb.PromptElementKind", [{
      no: 0,
      name: "PROMPT_ELEMENT_KIND_UNSPECIFIED"
  }, {
      no: 2,
      name: "PROMPT_ELEMENT_KIND_FILE_MARKER"
  }, {
      no: 4,
      name: "PROMPT_ELEMENT_KIND_OTHER_DOCUMENT"
  }, {
      no: 5,
      name: "PROMPT_ELEMENT_KIND_BEFORE_CURSOR"
  }, {
      no: 7,
      name: "PROMPT_ELEMENT_KIND_AFTER_CURSOR"
  }, {
      no: 8,
      name: "PROMPT_ELEMENT_KIND_FIM"
  }, {
      no: 9,
      name: "PROMPT_ELEMENT_KIND_SOT"
  }, {
      no: 10,
      name: "PROMPT_ELEMENT_KIND_EOT"
  }, {
      no: 13,
      name: "PROMPT_ELEMENT_KIND_CODE_CONTEXT_ITEM"
  }, {
      no: 14,
      name: "PROMPT_ELEMENT_KIND_INSTRUCTION"
  }, {
      no: 15,
      name: "PROMPT_ELEMENT_KIND_SELECTION"
  }]),
  function(e) {
      e[e.UNSPECIFIED = 0] = "UNSPECIFIED",
      e[e.COPY = 1] = "COPY"
  }(Ue || (Ue = {})),
  Le.util.setEnumType(Ue, "exa.codeium_common_pb.PromptAnnotationKind", [{
      no: 0,
      name: "PROMPT_ANNOTATION_KIND_UNSPECIFIED"
  }, {
      no: 1,
      name: "PROMPT_ANNOTATION_KIND_COPY"
  }]),
  function(e) {
      e[e.UNSPECIFIED = 0] = "UNSPECIFIED",
      e[e.OTHER_DOCUMENTS = 3] = "OTHER_DOCUMENTS",
      e[e.ONLY_STOP_EOT = 13] = "ONLY_STOP_EOT",
      e[e.INCREASE_MAX_NUM_TOKENS = 27] = "INCREASE_MAX_NUM_TOKENS",
      e[e.BLOCKING_REFRESH = 35] = "BLOCKING_REFRESH",
      e[e.USE_INTERNAL_CHAT_MODEL = 36] = "USE_INTERNAL_CHAT_MODEL",
      e[e.INCREASE_MAX_NUM_TOKENS_MORE = 39] = "INCREASE_MAX_NUM_TOKENS_MORE",
      e[e.USE_CONTEXT_TOKEN = 44] = "USE_CONTEXT_TOKEN",
      e[e.RECORD_FILES = 47] = "RECORD_FILES",
      e[e.NO_SAMPLER_EARLY_STOP = 48] = "NO_SAMPLER_EARLY_STOP",
      e[e.CM_MEMORY_TELEMETRY = 53] = "CM_MEMORY_TELEMETRY",
      e[e.ACTIVITY_CONTEXT_WEIGHT = 54] = "ACTIVITY_CONTEXT_WEIGHT",
      e[e.LANGUAGE_SERVER_VERSION = 55] = "LANGUAGE_SERVER_VERSION",
      e[e.LANGUAGE_SERVER_AUTO_RELOAD = 56] = "LANGUAGE_SERVER_AUTO_RELOAD",
      e[e.ONLY_MULTILINE = 60] = "ONLY_MULTILINE",
      e[e.USE_CHAT_MODEL_7984 = 61] = "USE_CHAT_MODEL_7984",
      e[e.CONTEXT_FOR_NONGENERIC_CHAT = 62] = "CONTEXT_FOR_NONGENERIC_CHAT",
      e[e.USE_AUTOCOMPLETE_MODEL = 64] = "USE_AUTOCOMPLETE_MODEL",
      e[e.USE_ATTRIBUTION_FOR_INDIVIDUAL_TIER = 68] = "USE_ATTRIBUTION_FOR_INDIVIDUAL_TIER",
      e[e.USE_GPT_4_TURBO = 73] = "USE_GPT_4_TURBO",
      e[e.CHAT_MODEL_CONFIG = 78] = "CHAT_MODEL_CONFIG",
      e[e.COMMAND_MODEL_CONFIG = 79] = "COMMAND_MODEL_CONFIG",
      e[e.MIDDLE_MODE_TOKEN_VARIANT = 80] = "MIDDLE_MODE_TOKEN_VARIANT",
      e[e.MIN_IDE_VERSION = 81] = "MIN_IDE_VERSION",
      e[e.API_SERVER_VERBOSE_ERRORS = 84] = "API_SERVER_VERBOSE_ERRORS",
      e[e.DEFAULT_ENABLE_SEARCH = 86] = "DEFAULT_ENABLE_SEARCH",
      e[e.COLLECT_ONBOARDING_EVENTS = 87] = "COLLECT_ONBOARDING_EVENTS",
      e[e.COLLECT_EXAMPLE_COMPLETIONS = 88] = "COLLECT_EXAMPLE_COMPLETIONS",
      e[e.USE_MULTILINE_MODEL = 89] = "USE_MULTILINE_MODEL",
      e[e.OPEN_UNIVERSITY_ON_STARTUP = 91] = "OPEN_UNIVERSITY_ON_STARTUP",
      e[e.ATTRIBUTION_KILL_SWITCH = 92] = "ATTRIBUTION_KILL_SWITCH",
      e[e.FAST_MULTILINE = 94] = "FAST_MULTILINE",
      e[e.SINGLE_COMPLETION = 95] = "SINGLE_COMPLETION",
      e[e.STOP_FIRST_NON_WHITESPACE_LINE = 96] = "STOP_FIRST_NON_WHITESPACE_LINE",
      e[e.TEAMS_UPGRADE_FOR_NONGENERIC_CHAT = 98] = "TEAMS_UPGRADE_FOR_NONGENERIC_CHAT",
      e[e.MODEL_8341_VARIANTS = 99] = "MODEL_8341_VARIANTS",
      e[e.CORTEX_CONFIG = 102] = "CORTEX_CONFIG",
      e[e.MODEL_CHAT_11121_VARIANTS = 103] = "MODEL_CHAT_11121_VARIANTS",
      e[e.INCLUDE_PROMPT_COMPONENTS = 105] = "INCLUDE_PROMPT_COMPONENTS",
      e[e.NON_TEAMS_KILL_SWITCH = 106] = "NON_TEAMS_KILL_SWITCH",
      e[e.PERSIST_CODE_TRACKER = 108] = "PERSIST_CODE_TRACKER",
      e[e.RUN_RESEARCH_STATE_PROVIDER = 110] = "RUN_RESEARCH_STATE_PROVIDER",
      e[e.API_SERVER_LIVENESS_PROBE = 112] = "API_SERVER_LIVENESS_PROBE",
      e[e.IMPLICIT_PLAN = 113] = "IMPLICIT_PLAN",
      e[e.CHAT_COMPLETION_TOKENS_SOFT_LIMIT = 114] = "CHAT_COMPLETION_TOKENS_SOFT_LIMIT",
      e[e.CHAT_TOKENS_SOFT_LIMIT = 115] = "CHAT_TOKENS_SOFT_LIMIT",
      e[e.MQUERY_SCORER_WITH_FALLBACK = 117] = "MQUERY_SCORER_WITH_FALLBACK",
      e[e.DISABLE_COMPLETIONS_CACHE = 118] = "DISABLE_COMPLETIONS_CACHE",
      e[e.LLAMA3_405B_KILL_SWITCH = 119] = "LLAMA3_405B_KILL_SWITCH",
      e[e.USE_IMPLICIT_TRAJECTORY = 120] = "USE_IMPLICIT_TRAJECTORY",
      e[e.USE_COMMAND_DOCSTRING_GENERATION = 121] = "USE_COMMAND_DOCSTRING_GENERATION",
      e[e.JETBRAINS_USE_COMMAND_DOCSTRING_GENERATION = 122] = "JETBRAINS_USE_COMMAND_DOCSTRING_GENERATION",
      e[e.ENABLE_SUPERCOMPLETE = 123] = "ENABLE_SUPERCOMPLETE",
      e[e.JETBRAINS_ENABLE_AUTOUPDATE = 124] = "JETBRAINS_ENABLE_AUTOUPDATE",
      e[e.SENTRY = 136] = "SENTRY",
      e[e.DISABLE_INFERENCE_API_SERVER = 139] = "DISABLE_INFERENCE_API_SERVER",
      e[e.MODEL_14602_TOKENS = 142] = "MODEL_14602_TOKENS",
      e[e.FAST_SINGLELINE = 144] = "FAST_SINGLELINE",
      e[e.R2_LANGUAGE_SERVER_DOWNLOAD = 147] = "R2_LANGUAGE_SERVER_DOWNLOAD",
      e[e.SPLIT_MODEL = 152] = "SPLIT_MODEL",
      e[e.PIN_RECENT_FILES = 153] = "PIN_RECENT_FILES",
      e[e.COMMIT_GRAPH = 164] = "COMMIT_GRAPH",
      e[e.MODEL_CHAT_15305_TOKENS = 167] = "MODEL_CHAT_15305_TOKENS",
      e[e.MODEL_15133_TOKENS = 173] = "MODEL_15133_TOKENS",
      e[e.MODEL_15302_TOKENS = 174] = "MODEL_15302_TOKENS",
      e[e.MODEL_15335_TOKENS = 175] = "MODEL_15335_TOKENS",
      e[e.MODEL_15931_TOKENS = 180] = "MODEL_15931_TOKENS",
      e[e.MODEL_CHAT_15729_TOKENS = 186] = "MODEL_CHAT_15729_TOKENS",
      e[e.API_SERVER_CUTOFF = 158] = "API_SERVER_CUTOFF",
      e[e.FAST_SPEED_KILL_SWITCH = 159] = "FAST_SPEED_KILL_SWITCH",
      e[e.PREDICTIVE_MULTILINE = 160] = "PREDICTIVE_MULTILINE",
      e[e.SUPERCOMPLETE_FILTER_REVERT = 125] = "SUPERCOMPLETE_FILTER_REVERT",
      e[e.SUPERCOMPLETE_FILTER_PREFIX_MATCH = 126] = "SUPERCOMPLETE_FILTER_PREFIX_MATCH",
      e[e.SUPERCOMPLETE_FILTER_SCORE_THRESHOLD = 127] = "SUPERCOMPLETE_FILTER_SCORE_THRESHOLD",
      e[e.SUPERCOMPLETE_FILTER_INSERTION_CAP = 128] = "SUPERCOMPLETE_FILTER_INSERTION_CAP",
      e[e.SUPERCOMPLETE_FILTER_DELETION_CAP = 133] = "SUPERCOMPLETE_FILTER_DELETION_CAP",
      e[e.SUPERCOMPLETE_FILTER_WHITESPACE_ONLY = 156] = "SUPERCOMPLETE_FILTER_WHITESPACE_ONLY",
      e[e.SUPERCOMPLETE_FILTER_NO_OP = 170] = "SUPERCOMPLETE_FILTER_NO_OP",
      e[e.SUPERCOMPLETE_FILTER_SUFFIX_MATCH = 176] = "SUPERCOMPLETE_FILTER_SUFFIX_MATCH",
      e[e.SUPERCOMPLETE_FILTER_PREVIOUSLY_SHOWN = 182] = "SUPERCOMPLETE_FILTER_PREVIOUSLY_SHOWN",
      e[e.SUPERCOMPLETE_MIN_SCORE = 129] = "SUPERCOMPLETE_MIN_SCORE",
      e[e.SUPERCOMPLETE_MAX_INSERTIONS = 130] = "SUPERCOMPLETE_MAX_INSERTIONS",
      e[e.SUPERCOMPLETE_LINE_RADIUS = 131] = "SUPERCOMPLETE_LINE_RADIUS",
      e[e.SUPERCOMPLETE_MAX_DELETIONS = 132] = "SUPERCOMPLETE_MAX_DELETIONS",
      e[e.SUPERCOMPLETE_USE_CURRENT_LINE = 135] = "SUPERCOMPLETE_USE_CURRENT_LINE",
      e[e.SUPERCOMPLETE_RECENT_STEPS_DURATION = 138] = "SUPERCOMPLETE_RECENT_STEPS_DURATION",
      e[e.SUPERCOMPLETE_USE_CODE_DIAGNOSTICS = 143] = "SUPERCOMPLETE_USE_CODE_DIAGNOSTICS",
      e[e.SUPERCOMPLETE_MAX_TRAJECTORY_STEPS = 154] = "SUPERCOMPLETE_MAX_TRAJECTORY_STEPS",
      e[e.SUPERCOMPLETE_ON_ACCEPT_ONLY = 157] = "SUPERCOMPLETE_ON_ACCEPT_ONLY",
      e[e.SUPERCOMPLETE_TEMPERATURE = 183] = "SUPERCOMPLETE_TEMPERATURE",
      e[e.SUPERCOMPLETE_PRUNE_RESPONSE = 140] = "SUPERCOMPLETE_PRUNE_RESPONSE",
      e[e.SUPERCOMPLETE_PRUNE_MAX_INSERT_DELETE_LINE_DELTA = 141] = "SUPERCOMPLETE_PRUNE_MAX_INSERT_DELETE_LINE_DELTA",
      e[e.SUPERCOMPLETE_MODEL_CONFIG = 145] = "SUPERCOMPLETE_MODEL_CONFIG",
      e[e.SUPERCOMPLETE_ON_TAB = 151] = "SUPERCOMPLETE_ON_TAB",
      e[e.SUPERCOMPLETE_INLINE_PURE_DELETE = 171] = "SUPERCOMPLETE_INLINE_PURE_DELETE",
      e[e.JETBRAINS_USE_LEXICAL_EDITOR = 134] = "JETBRAINS_USE_LEXICAL_EDITOR",
      e[e.JETBRAINS_ENABLE_ONBOARDING = 137] = "JETBRAINS_ENABLE_ONBOARDING",
      e[e.ENABLE_AUTOCOMPLETE_DURING_INTELLISENSE = 146] = "ENABLE_AUTOCOMPLETE_DURING_INTELLISENSE",
      e[e.COMMAND_BOX_ON_TOP = 155] = "COMMAND_BOX_ON_TOP",
      e[e.CONTEXT_DOCUMENT_OUTLINE = 148] = "CONTEXT_DOCUMENT_OUTLINE",
      e[e.CONTEXT_ACTIVE_DOCUMENT_FRACTION = 149] = "CONTEXT_ACTIVE_DOCUMENT_FRACTION",
      e[e.CONTEXT_COMMAND_TRAJECTORY_PROMPT_CONFIG = 150] = "CONTEXT_COMMAND_TRAJECTORY_PROMPT_CONFIG",
      e[e.CONTEXT_FORCE_LOCAL_CONTEXT = 178] = "CONTEXT_FORCE_LOCAL_CONTEXT",
      e[e.USE_GCP_API_SERVER_FOR_PREMIUM_CHAT = 161] = "USE_GCP_API_SERVER_FOR_PREMIUM_CHAT",
      e[e.KNOWLEDGE_BASE_PROMPT_FRACTION = 162] = "KNOWLEDGE_BASE_PROMPT_FRACTION",
      e[e.USE_AUTOCOMPLETE_MODEL_SERVER_SIDE = 163] = "USE_AUTOCOMPLETE_MODEL_SERVER_SIDE",
      e[e.SUPERCOMPLETE_NO_CONTEXT = 165] = "SUPERCOMPLETE_NO_CONTEXT",
      e[e.SUPERCOMPLETE_NO_ACTIVE_NODE = 166] = "SUPERCOMPLETE_NO_ACTIVE_NODE",
      e[e.TAB_JUMP_ENABLED = 168] = "TAB_JUMP_ENABLED",
      e[e.TAB_JUMP_ACCEPT_ENABLED = 169] = "TAB_JUMP_ACCEPT_ENABLED",
      e[e.STREAMING_EXTERNAL_COMMAND = 172] = "STREAMING_EXTERNAL_COMMAND",
      e[e.TAB_JUMP_LINE_RADIUS = 177] = "TAB_JUMP_LINE_RADIUS",
      e[e.USE_SPECIAL_EDIT_CODE_BLOCK = 179] = "USE_SPECIAL_EDIT_CODE_BLOCK",
      e[e.ENABLE_BACKGROUND_RESEARCH = 184] = "ENABLE_BACKGROUND_RESEARCH",
      e[e.ENABLE_SUGGESTED_RESPONSES = 187] = "ENABLE_SUGGESTED_RESPONSES",
      e[e.ENABLE_RUN_COMMAND = 188] = "ENABLE_RUN_COMMAND",
      e[e.ENABLE_SHELL_COMMAND_TRAJECTORY = 189] = "ENABLE_SHELL_COMMAND_TRAJECTORY",
      e[e.CASCADE_BASE_MODEL_ID = 190] = "CASCADE_BASE_MODEL_ID",
      e[e.CASCADE_FREE_CONFIG_OVERRIDE = 191] = "CASCADE_FREE_CONFIG_OVERRIDE",
      e[e.CASCADE_PREMIUM_CONFIG_OVERRIDE = 192] = "CASCADE_PREMIUM_CONFIG_OVERRIDE",
      e[e.CASCADE_BACKGROUND_RESEARCH_CONFIG_OVERRIDE = 193] = "CASCADE_BACKGROUND_RESEARCH_CONFIG_OVERRIDE",
      e[e.ENABLE_SMART_COPY = 181] = "ENABLE_SMART_COPY",
      e[e.ENABLE_COMMIT_MESSAGE_GENERATION = 185] = "ENABLE_COMMIT_MESSAGE_GENERATION"
  }(Me || (Me = {})),
  Le.util.setEnumType(Me, "exa.codeium_common_pb.ExperimentKey", [{
      no: 0,
      name: "UNSPECIFIED"
  }, {
      no: 3,
      name: "OTHER_DOCUMENTS"
  }, {
      no: 13,
      name: "ONLY_STOP_EOT"
  }, {
      no: 27,
      name: "INCREASE_MAX_NUM_TOKENS"
  }, {
      no: 35,
      name: "BLOCKING_REFRESH"
  }, {
      no: 36,
      name: "USE_INTERNAL_CHAT_MODEL"
  }, {
      no: 39,
      name: "INCREASE_MAX_NUM_TOKENS_MORE"
  }, {
      no: 44,
      name: "USE_CONTEXT_TOKEN"
  }, {
      no: 47,
      name: "RECORD_FILES"
  }, {
      no: 48,
      name: "NO_SAMPLER_EARLY_STOP"
  }, {
      no: 53,
      name: "CM_MEMORY_TELEMETRY"
  }, {
      no: 54,
      name: "ACTIVITY_CONTEXT_WEIGHT"
  }, {
      no: 55,
      name: "LANGUAGE_SERVER_VERSION"
  }, {
      no: 56,
      name: "LANGUAGE_SERVER_AUTO_RELOAD"
  }, {
      no: 60,
      name: "ONLY_MULTILINE"
  }, {
      no: 61,
      name: "USE_CHAT_MODEL_7984"
  }, {
      no: 62,
      name: "CONTEXT_FOR_NONGENERIC_CHAT"
  }, {
      no: 64,
      name: "USE_AUTOCOMPLETE_MODEL"
  }, {
      no: 68,
      name: "USE_ATTRIBUTION_FOR_INDIVIDUAL_TIER"
  }, {
      no: 73,
      name: "USE_GPT_4_TURBO"
  }, {
      no: 78,
      name: "CHAT_MODEL_CONFIG"
  }, {
      no: 79,
      name: "COMMAND_MODEL_CONFIG"
  }, {
      no: 80,
      name: "MIDDLE_MODE_TOKEN_VARIANT"
  }, {
      no: 81,
      name: "MIN_IDE_VERSION"
  }, {
      no: 84,
      name: "API_SERVER_VERBOSE_ERRORS"
  }, {
      no: 86,
      name: "DEFAULT_ENABLE_SEARCH"
  }, {
      no: 87,
      name: "COLLECT_ONBOARDING_EVENTS"
  }, {
      no: 88,
      name: "COLLECT_EXAMPLE_COMPLETIONS"
  }, {
      no: 89,
      name: "USE_MULTILINE_MODEL"
  }, {
      no: 91,
      name: "OPEN_UNIVERSITY_ON_STARTUP"
  }, {
      no: 92,
      name: "ATTRIBUTION_KILL_SWITCH"
  }, {
      no: 94,
      name: "FAST_MULTILINE"
  }, {
      no: 95,
      name: "SINGLE_COMPLETION"
  }, {
      no: 96,
      name: "STOP_FIRST_NON_WHITESPACE_LINE"
  }, {
      no: 98,
      name: "TEAMS_UPGRADE_FOR_NONGENERIC_CHAT"
  }, {
      no: 99,
      name: "MODEL_8341_VARIANTS"
  }, {
      no: 102,
      name: "CORTEX_CONFIG"
  }, {
      no: 103,
      name: "MODEL_CHAT_11121_VARIANTS"
  }, {
      no: 105,
      name: "INCLUDE_PROMPT_COMPONENTS"
  }, {
      no: 106,
      name: "NON_TEAMS_KILL_SWITCH"
  }, {
      no: 108,
      name: "PERSIST_CODE_TRACKER"
  }, {
      no: 110,
      name: "RUN_RESEARCH_STATE_PROVIDER"
  }, {
      no: 112,
      name: "API_SERVER_LIVENESS_PROBE"
  }, {
      no: 113,
      name: "IMPLICIT_PLAN"
  }, {
      no: 114,
      name: "CHAT_COMPLETION_TOKENS_SOFT_LIMIT"
  }, {
      no: 115,
      name: "CHAT_TOKENS_SOFT_LIMIT"
  }, {
      no: 117,
      name: "MQUERY_SCORER_WITH_FALLBACK"
  }, {
      no: 118,
      name: "DISABLE_COMPLETIONS_CACHE"
  }, {
      no: 119,
      name: "LLAMA3_405B_KILL_SWITCH"
  }, {
      no: 120,
      name: "USE_IMPLICIT_TRAJECTORY"
  }, {
      no: 121,
      name: "USE_COMMAND_DOCSTRING_GENERATION"
  }, {
      no: 122,
      name: "JETBRAINS_USE_COMMAND_DOCSTRING_GENERATION"
  }, {
      no: 123,
      name: "ENABLE_SUPERCOMPLETE"
  }, {
      no: 124,
      name: "JETBRAINS_ENABLE_AUTOUPDATE"
  }, {
      no: 136,
      name: "SENTRY"
  }, {
      no: 139,
      name: "DISABLE_INFERENCE_API_SERVER"
  }, {
      no: 142,
      name: "MODEL_14602_TOKENS"
  }, {
      no: 144,
      name: "FAST_SINGLELINE"
  }, {
      no: 147,
      name: "R2_LANGUAGE_SERVER_DOWNLOAD"
  }, {
      no: 152,
      name: "SPLIT_MODEL"
  }, {
      no: 153,
      name: "PIN_RECENT_FILES"
  }, {
      no: 164,
      name: "COMMIT_GRAPH"
  }, {
      no: 167,
      name: "MODEL_CHAT_15305_TOKENS"
  }, {
      no: 173,
      name: "MODEL_15133_TOKENS"
  }, {
      no: 174,
      name: "MODEL_15302_TOKENS"
  }, {
      no: 175,
      name: "MODEL_15335_TOKENS"
  }, {
      no: 180,
      name: "MODEL_15931_TOKENS"
  }, {
      no: 186,
      name: "MODEL_CHAT_15729_TOKENS"
  }, {
      no: 158,
      name: "API_SERVER_CUTOFF"
  }, {
      no: 159,
      name: "FAST_SPEED_KILL_SWITCH"
  }, {
      no: 160,
      name: "PREDICTIVE_MULTILINE"
  }, {
      no: 125,
      name: "SUPERCOMPLETE_FILTER_REVERT"
  }, {
      no: 126,
      name: "SUPERCOMPLETE_FILTER_PREFIX_MATCH"
  }, {
      no: 127,
      name: "SUPERCOMPLETE_FILTER_SCORE_THRESHOLD"
  }, {
      no: 128,
      name: "SUPERCOMPLETE_FILTER_INSERTION_CAP"
  }, {
      no: 133,
      name: "SUPERCOMPLETE_FILTER_DELETION_CAP"
  }, {
      no: 156,
      name: "SUPERCOMPLETE_FILTER_WHITESPACE_ONLY"
  }, {
      no: 170,
      name: "SUPERCOMPLETE_FILTER_NO_OP"
  }, {
      no: 176,
      name: "SUPERCOMPLETE_FILTER_SUFFIX_MATCH"
  }, {
      no: 182,
      name: "SUPERCOMPLETE_FILTER_PREVIOUSLY_SHOWN"
  }, {
      no: 129,
      name: "SUPERCOMPLETE_MIN_SCORE"
  }, {
      no: 130,
      name: "SUPERCOMPLETE_MAX_INSERTIONS"
  }, {
      no: 131,
      name: "SUPERCOMPLETE_LINE_RADIUS"
  }, {
      no: 132,
      name: "SUPERCOMPLETE_MAX_DELETIONS"
  }, {
      no: 135,
      name: "SUPERCOMPLETE_USE_CURRENT_LINE"
  }, {
      no: 138,
      name: "SUPERCOMPLETE_RECENT_STEPS_DURATION"
  }, {
      no: 143,
      name: "SUPERCOMPLETE_USE_CODE_DIAGNOSTICS"
  }, {
      no: 154,
      name: "SUPERCOMPLETE_MAX_TRAJECTORY_STEPS"
  }, {
      no: 157,
      name: "SUPERCOMPLETE_ON_ACCEPT_ONLY"
  }, {
      no: 183,
      name: "SUPERCOMPLETE_TEMPERATURE"
  }, {
      no: 140,
      name: "SUPERCOMPLETE_PRUNE_RESPONSE"
  }, {
      no: 141,
      name: "SUPERCOMPLETE_PRUNE_MAX_INSERT_DELETE_LINE_DELTA"
  }, {
      no: 145,
      name: "SUPERCOMPLETE_MODEL_CONFIG"
  }, {
      no: 151,
      name: "SUPERCOMPLETE_ON_TAB"
  }, {
      no: 171,
      name: "SUPERCOMPLETE_INLINE_PURE_DELETE"
  }, {
      no: 134,
      name: "JETBRAINS_USE_LEXICAL_EDITOR"
  }, {
      no: 137,
      name: "JETBRAINS_ENABLE_ONBOARDING"
  }, {
      no: 146,
      name: "ENABLE_AUTOCOMPLETE_DURING_INTELLISENSE"
  }, {
      no: 155,
      name: "COMMAND_BOX_ON_TOP"
  }, {
      no: 148,
      name: "CONTEXT_DOCUMENT_OUTLINE"
  }, {
      no: 149,
      name: "CONTEXT_ACTIVE_DOCUMENT_FRACTION"
  }, {
      no: 150,
      name: "CONTEXT_COMMAND_TRAJECTORY_PROMPT_CONFIG"
  }, {
      no: 178,
      name: "CONTEXT_FORCE_LOCAL_CONTEXT"
  }, {
      no: 161,
      name: "USE_GCP_API_SERVER_FOR_PREMIUM_CHAT"
  }, {
      no: 162,
      name: "KNOWLEDGE_BASE_PROMPT_FRACTION"
  }, {
      no: 163,
      name: "USE_AUTOCOMPLETE_MODEL_SERVER_SIDE"
  }, {
      no: 165,
      name: "SUPERCOMPLETE_NO_CONTEXT"
  }, {
      no: 166,
      name: "SUPERCOMPLETE_NO_ACTIVE_NODE"
  }, {
      no: 168,
      name: "TAB_JUMP_ENABLED"
  }, {
      no: 169,
      name: "TAB_JUMP_ACCEPT_ENABLED"
  }, {
      no: 172,
      name: "STREAMING_EXTERNAL_COMMAND"
  }, {
      no: 177,
      name: "TAB_JUMP_LINE_RADIUS"
  }, {
      no: 179,
      name: "USE_SPECIAL_EDIT_CODE_BLOCK"
  }, {
      no: 184,
      name: "ENABLE_BACKGROUND_RESEARCH"
  }, {
      no: 187,
      name: "ENABLE_SUGGESTED_RESPONSES"
  }, {
      no: 188,
      name: "ENABLE_RUN_COMMAND"
  }, {
      no: 189,
      name: "ENABLE_SHELL_COMMAND_TRAJECTORY"
  }, {
      no: 190,
      name: "CASCADE_BASE_MODEL_ID"
  }, {
      no: 191,
      name: "CASCADE_FREE_CONFIG_OVERRIDE"
  }, {
      no: 192,
      name: "CASCADE_PREMIUM_CONFIG_OVERRIDE"
  }, {
      no: 193,
      name: "CASCADE_BACKGROUND_RESEARCH_CONFIG_OVERRIDE"
  }, {
      no: 181,
      name: "ENABLE_SMART_COPY"
  }, {
      no: 185,
      name: "ENABLE_COMMIT_MESSAGE_GENERATION"
  }]),
  function(e) {
      e[e.UNSPECIFIED = 0] = "UNSPECIFIED",
      e[e.EXTENSION = 1] = "EXTENSION",
      e[e.LANGUAGE_SERVER = 2] = "LANGUAGE_SERVER",
      e[e.API_SERVER = 3] = "API_SERVER"
  }(Be || (Be = {})),
  Le.util.setEnumType(Be, "exa.codeium_common_pb.ExperimentSource", [{
      no: 0,
      name: "EXPERIMENT_SOURCE_UNSPECIFIED"
  }, {
      no: 1,
      name: "EXPERIMENT_SOURCE_EXTENSION"
  }, {
      no: 2,
      name: "EXPERIMENT_SOURCE_LANGUAGE_SERVER"
  }, {
      no: 3,
      name: "EXPERIMENT_SOURCE_API_SERVER"
  }]),
  function(e) {
      e[e.MODEL_UNSPECIFIED = 0] = "MODEL_UNSPECIFIED",
      e[e.MODEL_EMBED_6591 = 20] = "MODEL_EMBED_6591",
      e[e.MODEL_8341 = 33] = "MODEL_8341",
      e[e.MODEL_8528 = 42] = "MODEL_8528",
      e[e.MODEL_9024 = 41] = "MODEL_9024",
      e[e.MODEL_14602 = 112] = "MODEL_14602",
      e[e.MODEL_15133 = 115] = "MODEL_15133",
      e[e.MODEL_15302 = 119] = "MODEL_15302",
      e[e.MODEL_15335 = 121] = "MODEL_15335",
      e[e.MODEL_15336 = 122] = "MODEL_15336",
      e[e.MODEL_15931 = 167] = "MODEL_15931",
      e[e.MODEL_QUERY_9905 = 48] = "MODEL_QUERY_9905",
      e[e.MODEL_QUERY_11791 = 66] = "MODEL_QUERY_11791",
      e[e.MODEL_CHAT_11120 = 57] = "MODEL_CHAT_11120",
      e[e.MODEL_CHAT_11121 = 58] = "MODEL_CHAT_11121",
      e[e.MODEL_CHAT_12119 = 70] = "MODEL_CHAT_12119",
      e[e.MODEL_CHAT_12121 = 69] = "MODEL_CHAT_12121",
      e[e.MODEL_CHAT_12437 = 74] = "MODEL_CHAT_12437",
      e[e.MODEL_CHAT_12491 = 76] = "MODEL_CHAT_12491",
      e[e.MODEL_CHAT_12623 = 78] = "MODEL_CHAT_12623",
      e[e.MODEL_CHAT_12950 = 79] = "MODEL_CHAT_12950",
      e[e.MODEL_CHAT_12968 = 101] = "MODEL_CHAT_12968",
      e[e.MODEL_CHAT_13404 = 102] = "MODEL_CHAT_13404",
      e[e.MODEL_CHAT_13566 = 103] = "MODEL_CHAT_13566",
      e[e.MODEL_CHAT_13930 = 108] = "MODEL_CHAT_13930",
      e[e.MODEL_CHAT_14255 = 110] = "MODEL_CHAT_14255",
      e[e.MODEL_CHAT_14256 = 111] = "MODEL_CHAT_14256",
      e[e.MODEL_CHAT_14942 = 114] = "MODEL_CHAT_14942",
      e[e.MODEL_CHAT_15305 = 120] = "MODEL_CHAT_15305",
      e[e.MODEL_CHAT_15600 = 123] = "MODEL_CHAT_15600",
      e[e.MODEL_CHAT_15729 = 168] = "MODEL_CHAT_15729",
      e[e.MODEL_DRAFT_11408 = 65] = "MODEL_DRAFT_11408",
      e[e.MODEL_DRAFT_CHAT_11883 = 67] = "MODEL_DRAFT_CHAT_11883",
      e[e.MODEL_DRAFT_CHAT_12196 = 72] = "MODEL_DRAFT_CHAT_12196",
      e[e.MODEL_DRAFT_CHAT_12413 = 73] = "MODEL_DRAFT_CHAT_12413",
      e[e.MODEL_DRAFT_CHAT_13175 = 104] = "MODEL_DRAFT_CHAT_13175",
      e[e.MODEL_CHAT_3_5_TURBO = 28] = "MODEL_CHAT_3_5_TURBO",
      e[e.MODEL_CHAT_GPT_4 = 30] = "MODEL_CHAT_GPT_4",
      e[e.MODEL_CHAT_GPT_4_1106_PREVIEW = 37] = "MODEL_CHAT_GPT_4_1106_PREVIEW",
      e[e.MODEL_TEXT_EMBEDDING_OPENAI_ADA = 91] = "MODEL_TEXT_EMBEDDING_OPENAI_ADA",
      e[e.MODEL_TEXT_EMBEDDING_OPENAI_3_SMALL = 163] = "MODEL_TEXT_EMBEDDING_OPENAI_3_SMALL",
      e[e.MODEL_TEXT_EMBEDDING_OPENAI_3_LARGE = 164] = "MODEL_TEXT_EMBEDDING_OPENAI_3_LARGE",
      e[e.MODEL_CHAT_GPT_4O_2024_05_13 = 71] = "MODEL_CHAT_GPT_4O_2024_05_13",
      e[e.MODEL_CHAT_GPT_4O_2024_08_06 = 109] = "MODEL_CHAT_GPT_4O_2024_08_06",
      e[e.MODEL_CHAT_GPT_4O_MINI_2024_07_18 = 113] = "MODEL_CHAT_GPT_4O_MINI_2024_07_18",
      e[e.MODEL_CHAT_O1_PREVIEW = 117] = "MODEL_CHAT_O1_PREVIEW",
      e[e.MODEL_CHAT_O1_MINI = 118] = "MODEL_CHAT_O1_MINI",
      e[e.MODEL_CHAT_O1 = 170] = "MODEL_CHAT_O1",
      e[e.MODEL_GOOGLE_GEMINI_1_0_PRO = 61] = "MODEL_GOOGLE_GEMINI_1_0_PRO",
      e[e.MODEL_GOOGLE_GEMINI_1_5_PRO = 62] = "MODEL_GOOGLE_GEMINI_1_5_PRO",
      e[e.MODEL_CLAUDE_3_OPUS_20240229 = 63] = "MODEL_CLAUDE_3_OPUS_20240229",
      e[e.MODEL_CLAUDE_3_SONNET_20240229 = 64] = "MODEL_CLAUDE_3_SONNET_20240229",
      e[e.MODEL_CLAUDE_3_5_SONNET_20240620 = 80] = "MODEL_CLAUDE_3_5_SONNET_20240620",
      e[e.MODEL_CLAUDE_3_5_SONNET_20241022 = 166] = "MODEL_CLAUDE_3_5_SONNET_20241022",
      e[e.MODEL_CLAUDE_3_5_HAIKU_20241022 = 171] = "MODEL_CLAUDE_3_5_HAIKU_20241022",
      e[e.MODEL_CLAUDE_3_HAIKU_20240307 = 172] = "MODEL_CLAUDE_3_HAIKU_20240307",
      e[e.MODEL_TOGETHERAI_TEXT_EMBEDDING_M2_BERT = 81] = "MODEL_TOGETHERAI_TEXT_EMBEDDING_M2_BERT",
      e[e.MODEL_TOGETHERAI_LLAMA_3_1_8B_INSTRUCT = 165] = "MODEL_TOGETHERAI_LLAMA_3_1_8B_INSTRUCT",
      e[e.MODEL_HUGGING_FACE_TEXT_EMBEDDING_M2_BERT = 82] = "MODEL_HUGGING_FACE_TEXT_EMBEDDING_M2_BERT",
      e[e.MODEL_HUGGING_FACE_TEXT_EMBEDDING_UAE_CODE = 83] = "MODEL_HUGGING_FACE_TEXT_EMBEDDING_UAE_CODE",
      e[e.MODEL_HUGGING_FACE_TEXT_EMBEDDING_BGE = 84] = "MODEL_HUGGING_FACE_TEXT_EMBEDDING_BGE",
      e[e.MODEL_HUGGING_FACE_TEXT_EMBEDDING_BLADE = 85] = "MODEL_HUGGING_FACE_TEXT_EMBEDDING_BLADE",
      e[e.MODEL_HUGGING_FACE_TEXT_EMBEDDING_ARCTIC_LARGE = 86] = "MODEL_HUGGING_FACE_TEXT_EMBEDDING_ARCTIC_LARGE",
      e[e.MODEL_HUGGING_FACE_TEXT_EMBEDDING_E5_BASE = 87] = "MODEL_HUGGING_FACE_TEXT_EMBEDDING_E5_BASE",
      e[e.MODEL_HUGGING_FACE_TEXT_EMBEDDING_MXBAI = 88] = "MODEL_HUGGING_FACE_TEXT_EMBEDDING_MXBAI",
      e[e.MODEL_LLAMA_3_1_8B_INSTRUCT = 106] = "MODEL_LLAMA_3_1_8B_INSTRUCT",
      e[e.MODEL_LLAMA_3_1_70B_INSTRUCT = 107] = "MODEL_LLAMA_3_1_70B_INSTRUCT",
      e[e.MODEL_LLAMA_3_1_405B_INSTRUCT = 105] = "MODEL_LLAMA_3_1_405B_INSTRUCT",
      e[e.MODEL_LLAMA_3_1_70B_INSTRUCT_LONG_CONTEXT = 116] = "MODEL_LLAMA_3_1_70B_INSTRUCT_LONG_CONTEXT",
      e[e.MODEL_NOMIC_TEXT_EMBEDDING_V1 = 89] = "MODEL_NOMIC_TEXT_EMBEDDING_V1",
      e[e.MODEL_NOMIC_TEXT_EMBEDDING_V1_5 = 90] = "MODEL_NOMIC_TEXT_EMBEDDING_V1_5",
      e[e.MODEL_MISTRAL_7B = 77] = "MODEL_MISTRAL_7B",
      e[e.MODEL_SALESFORCE_EMBEDDING_2R = 99] = "MODEL_SALESFORCE_EMBEDDING_2R",
      e[e.MODEL_TEI_BGE_M3 = 92] = "MODEL_TEI_BGE_M3",
      e[e.MODEL_TEI_NOMIC_EMBED_TEXT_V1 = 93] = "MODEL_TEI_NOMIC_EMBED_TEXT_V1",
      e[e.MODEL_TEI_INTFLOAT_E5_LARGE_INSTRUCT = 94] = "MODEL_TEI_INTFLOAT_E5_LARGE_INSTRUCT",
      e[e.MODEL_TEI_SNOWFLAKE_ARCTIC_EMBED_L = 95] = "MODEL_TEI_SNOWFLAKE_ARCTIC_EMBED_L",
      e[e.MODEL_TEI_UAE_CODE_LARGE_V1 = 96] = "MODEL_TEI_UAE_CODE_LARGE_V1",
      e[e.MODEL_TEI_B1ADE = 97] = "MODEL_TEI_B1ADE",
      e[e.MODEL_TEI_WHEREISAI_UAE_LARGE_V1 = 98] = "MODEL_TEI_WHEREISAI_UAE_LARGE_V1",
      e[e.MODEL_TEI_WHEREISAI_UAE_CODE_LARGE_V1 = 100] = "MODEL_TEI_WHEREISAI_UAE_CODE_LARGE_V1",
      e[e.MODEL_OPENAI_COMPATIBLE = 200] = "MODEL_OPENAI_COMPATIBLE",
      e[e.MODEL_ANTHROPIC_COMPATIBLE = 201] = "MODEL_ANTHROPIC_COMPATIBLE",
      e[e.MODEL_VERTEX_COMPATIBLE = 202] = "MODEL_VERTEX_COMPATIBLE",
      e[e.MODEL_BEDROCK_COMPATIBLE = 203] = "MODEL_BEDROCK_COMPATIBLE",
      e[e.MODEL_AZURE_COMPATIBLE = 204] = "MODEL_AZURE_COMPATIBLE"
  }(Fe || (Fe = {})),
  Le.util.setEnumType(Fe, "exa.codeium_common_pb.Model", [{
      no: 0,
      name: "MODEL_UNSPECIFIED"
  }, {
      no: 20,
      name: "MODEL_EMBED_6591"
  }, {
      no: 33,
      name: "MODEL_8341"
  }, {
      no: 42,
      name: "MODEL_8528"
  }, {
      no: 41,
      name: "MODEL_9024"
  }, {
      no: 112,
      name: "MODEL_14602"
  }, {
      no: 115,
      name: "MODEL_15133"
  }, {
      no: 119,
      name: "MODEL_15302"
  }, {
      no: 121,
      name: "MODEL_15335"
  }, {
      no: 122,
      name: "MODEL_15336"
  }, {
      no: 167,
      name: "MODEL_15931"
  }, {
      no: 48,
      name: "MODEL_QUERY_9905"
  }, {
      no: 66,
      name: "MODEL_QUERY_11791"
  }, {
      no: 57,
      name: "MODEL_CHAT_11120"
  }, {
      no: 58,
      name: "MODEL_CHAT_11121"
  }, {
      no: 70,
      name: "MODEL_CHAT_12119"
  }, {
      no: 69,
      name: "MODEL_CHAT_12121"
  }, {
      no: 74,
      name: "MODEL_CHAT_12437"
  }, {
      no: 76,
      name: "MODEL_CHAT_12491"
  }, {
      no: 78,
      name: "MODEL_CHAT_12623"
  }, {
      no: 79,
      name: "MODEL_CHAT_12950"
  }, {
      no: 101,
      name: "MODEL_CHAT_12968"
  }, {
      no: 102,
      name: "MODEL_CHAT_13404"
  }, {
      no: 103,
      name: "MODEL_CHAT_13566"
  }, {
      no: 108,
      name: "MODEL_CHAT_13930"
  }, {
      no: 110,
      name: "MODEL_CHAT_14255"
  }, {
      no: 111,
      name: "MODEL_CHAT_14256"
  }, {
      no: 114,
      name: "MODEL_CHAT_14942"
  }, {
      no: 120,
      name: "MODEL_CHAT_15305"
  }, {
      no: 123,
      name: "MODEL_CHAT_15600"
  }, {
      no: 168,
      name: "MODEL_CHAT_15729"
  }, {
      no: 65,
      name: "MODEL_DRAFT_11408"
  }, {
      no: 67,
      name: "MODEL_DRAFT_CHAT_11883"
  }, {
      no: 72,
      name: "MODEL_DRAFT_CHAT_12196"
  }, {
      no: 73,
      name: "MODEL_DRAFT_CHAT_12413"
  }, {
      no: 104,
      name: "MODEL_DRAFT_CHAT_13175"
  }, {
      no: 28,
      name: "MODEL_CHAT_3_5_TURBO"
  }, {
      no: 30,
      name: "MODEL_CHAT_GPT_4"
  }, {
      no: 37,
      name: "MODEL_CHAT_GPT_4_1106_PREVIEW"
  }, {
      no: 91,
      name: "MODEL_TEXT_EMBEDDING_OPENAI_ADA"
  }, {
      no: 163,
      name: "MODEL_TEXT_EMBEDDING_OPENAI_3_SMALL"
  }, {
      no: 164,
      name: "MODEL_TEXT_EMBEDDING_OPENAI_3_LARGE"
  }, {
      no: 71,
      name: "MODEL_CHAT_GPT_4O_2024_05_13"
  }, {
      no: 109,
      name: "MODEL_CHAT_GPT_4O_2024_08_06"
  }, {
      no: 113,
      name: "MODEL_CHAT_GPT_4O_MINI_2024_07_18"
  }, {
      no: 117,
      name: "MODEL_CHAT_O1_PREVIEW"
  }, {
      no: 118,
      name: "MODEL_CHAT_O1_MINI"
  }, {
      no: 170,
      name: "MODEL_CHAT_O1"
  }, {
      no: 61,
      name: "MODEL_GOOGLE_GEMINI_1_0_PRO"
  }, {
      no: 62,
      name: "MODEL_GOOGLE_GEMINI_1_5_PRO"
  }, {
      no: 63,
      name: "MODEL_CLAUDE_3_OPUS_20240229"
  }, {
      no: 64,
      name: "MODEL_CLAUDE_3_SONNET_20240229"
  }, {
      no: 80,
      name: "MODEL_CLAUDE_3_5_SONNET_20240620"
  }, {
      no: 166,
      name: "MODEL_CLAUDE_3_5_SONNET_20241022"
  }, {
      no: 171,
      name: "MODEL_CLAUDE_3_5_HAIKU_20241022"
  }, {
      no: 172,
      name: "MODEL_CLAUDE_3_HAIKU_20240307"
  }, {
      no: 81,
      name: "MODEL_TOGETHERAI_TEXT_EMBEDDING_M2_BERT"
  }, {
      no: 165,
      name: "MODEL_TOGETHERAI_LLAMA_3_1_8B_INSTRUCT"
  }, {
      no: 82,
      name: "MODEL_HUGGING_FACE_TEXT_EMBEDDING_M2_BERT"
  }, {
      no: 83,
      name: "MODEL_HUGGING_FACE_TEXT_EMBEDDING_UAE_CODE"
  }, {
      no: 84,
      name: "MODEL_HUGGING_FACE_TEXT_EMBEDDING_BGE"
  }, {
      no: 85,
      name: "MODEL_HUGGING_FACE_TEXT_EMBEDDING_BLADE"
  }, {
      no: 86,
      name: "MODEL_HUGGING_FACE_TEXT_EMBEDDING_ARCTIC_LARGE"
  }, {
      no: 87,
      name: "MODEL_HUGGING_FACE_TEXT_EMBEDDING_E5_BASE"
  }, {
      no: 88,
      name: "MODEL_HUGGING_FACE_TEXT_EMBEDDING_MXBAI"
  }, {
      no: 106,
      name: "MODEL_LLAMA_3_1_8B_INSTRUCT"
  }, {
      no: 107,
      name: "MODEL_LLAMA_3_1_70B_INSTRUCT"
  }, {
      no: 105,
      name: "MODEL_LLAMA_3_1_405B_INSTRUCT"
  }, {
      no: 116,
      name: "MODEL_LLAMA_3_1_70B_INSTRUCT_LONG_CONTEXT"
  }, {
      no: 89,
      name: "MODEL_NOMIC_TEXT_EMBEDDING_V1"
  }, {
      no: 90,
      name: "MODEL_NOMIC_TEXT_EMBEDDING_V1_5"
  }, {
      no: 77,
      name: "MODEL_MISTRAL_7B"
  }, {
      no: 99,
      name: "MODEL_SALESFORCE_EMBEDDING_2R"
  }, {
      no: 92,
      name: "MODEL_TEI_BGE_M3"
  }, {
      no: 93,
      name: "MODEL_TEI_NOMIC_EMBED_TEXT_V1"
  }, {
      no: 94,
      name: "MODEL_TEI_INTFLOAT_E5_LARGE_INSTRUCT"
  }, {
      no: 95,
      name: "MODEL_TEI_SNOWFLAKE_ARCTIC_EMBED_L"
  }, {
      no: 96,
      name: "MODEL_TEI_UAE_CODE_LARGE_V1"
  }, {
      no: 97,
      name: "MODEL_TEI_B1ADE"
  }, {
      no: 98,
      name: "MODEL_TEI_WHEREISAI_UAE_LARGE_V1"
  }, {
      no: 100,
      name: "MODEL_TEI_WHEREISAI_UAE_CODE_LARGE_V1"
  }, {
      no: 200,
      name: "MODEL_OPENAI_COMPATIBLE"
  }, {
      no: 201,
      name: "MODEL_ANTHROPIC_COMPATIBLE"
  }, {
      no: 202,
      name: "MODEL_VERTEX_COMPATIBLE"
  }, {
      no: 203,
      name: "MODEL_BEDROCK_COMPATIBLE"
  }, {
      no: 204,
      name: "MODEL_AZURE_COMPATIBLE"
  }]),
  function(e) {
      e[e.EXCLUSION_UNSPECIFIED = 0] = "EXCLUSION_UNSPECIFIED",
      e[e.EXCLUSION_ELEMENT_KIND_DISABLED = 1] = "EXCLUSION_ELEMENT_KIND_DISABLED",
      e[e.EXCLUSION_ELEMENT_MISSING_DEPENDENCY = 2] = "EXCLUSION_ELEMENT_MISSING_DEPENDENCY",
      e[e.EXCLUSION_TOKEN_BUDGET = 3] = "EXCLUSION_TOKEN_BUDGET",
      e[e.EXCLUSION_ACTIVE_SOURCE_OVERLAP = 4] = "EXCLUSION_ACTIVE_SOURCE_OVERLAP"
  }(be || (be = {})),
  Le.util.setEnumType(be, "exa.codeium_common_pb.PromptElementExclusionReason", [{
      no: 0,
      name: "EXCLUSION_UNSPECIFIED"
  }, {
      no: 1,
      name: "EXCLUSION_ELEMENT_KIND_DISABLED"
  }, {
      no: 2,
      name: "EXCLUSION_ELEMENT_MISSING_DEPENDENCY"
  }, {
      no: 3,
      name: "EXCLUSION_TOKEN_BUDGET"
  }, {
      no: 4,
      name: "EXCLUSION_ACTIVE_SOURCE_OVERLAP"
  }]),
  function(e) {
      e[e.UNSPECIFIED = 0] = "UNSPECIFIED",
      e[e.INCOMPLETE = 1] = "INCOMPLETE",
      e[e.STOP_PATTERN = 2] = "STOP_PATTERN",
      e[e.MAX_TOKENS = 3] = "MAX_TOKENS",
      e[e.MIN_LOG_PROB = 4] = "MIN_LOG_PROB",
      e[e.MAX_NEWLINES = 5] = "MAX_NEWLINES",
      e[e.EXIT_SCOPE = 6] = "EXIT_SCOPE",
      e[e.NONFINITE_LOGIT_OR_PROB = 7] = "NONFINITE_LOGIT_OR_PROB",
      e[e.FIRST_NON_WHITESPACE_LINE = 8] = "FIRST_NON_WHITESPACE_LINE",
      e[e.PARTIAL = 9] = "PARTIAL",
      e[e.FUNCTION_CALL = 10] = "FUNCTION_CALL",
      e[e.CONTENT_FILTER = 11] = "CONTENT_FILTER",
      e[e.NON_INSERTION = 12] = "NON_INSERTION"
  }(qe || (qe = {})),
  Le.util.setEnumType(qe, "exa.codeium_common_pb.StopReason", [{
      no: 0,
      name: "STOP_REASON_UNSPECIFIED"
  }, {
      no: 1,
      name: "STOP_REASON_INCOMPLETE"
  }, {
      no: 2,
      name: "STOP_REASON_STOP_PATTERN"
  }, {
      no: 3,
      name: "STOP_REASON_MAX_TOKENS"
  }, {
      no: 4,
      name: "STOP_REASON_MIN_LOG_PROB"
  }, {
      no: 5,
      name: "STOP_REASON_MAX_NEWLINES"
  }, {
      no: 6,
      name: "STOP_REASON_EXIT_SCOPE"
  }, {
      no: 7,
      name: "STOP_REASON_NONFINITE_LOGIT_OR_PROB"
  }, {
      no: 8,
      name: "STOP_REASON_FIRST_NON_WHITESPACE_LINE"
  }, {
      no: 9,
      name: "STOP_REASON_PARTIAL"
  }, {
      no: 10,
      name: "STOP_REASON_FUNCTION_CALL"
  }, {
      no: 11,
      name: "STOP_REASON_CONTENT_FILTER"
  }, {
      no: 12,
      name: "STOP_REASON_NON_INSERTION"
  }]),
  function(e) {
      e[e.NONE = 0] = "NONE",
      e[e.INCOMPLETE = 1] = "INCOMPLETE",
      e[e.EMPTY = 2] = "EMPTY",
      e[e.REPETITIVE = 3] = "REPETITIVE",
      e[e.DUPLICATE = 4] = "DUPLICATE",
      e[e.LONG_LINE = 5] = "LONG_LINE",
      e[e.COMPLETIONS_CUTOFF = 6] = "COMPLETIONS_CUTOFF",
      e[e.ATTRIBUTION = 7] = "ATTRIBUTION",
      e[e.NON_MATCHING = 8] = "NON_MATCHING",
      e[e.NON_INSERTION = 9] = "NON_INSERTION"
  }(Ge || (Ge = {})),
  Le.util.setEnumType(Ge, "exa.codeium_common_pb.FilterReason", [{
      no: 0,
      name: "FILTER_REASON_NONE"
  }, {
      no: 1,
      name: "FILTER_REASON_INCOMPLETE"
  }, {
      no: 2,
      name: "FILTER_REASON_EMPTY"
  }, {
      no: 3,
      name: "FILTER_REASON_REPETITIVE"
  }, {
      no: 4,
      name: "FILTER_REASON_DUPLICATE"
  }, {
      no: 5,
      name: "FILTER_REASON_LONG_LINE"
  }, {
      no: 6,
      name: "FILTER_REASON_COMPLETIONS_CUTOFF"
  }, {
      no: 7,
      name: "FILTER_REASON_ATTRIBUTION"
  }, {
      no: 8,
      name: "FILTER_REASON_NON_MATCHING"
  }, {
      no: 9,
      name: "FILTER_REASON_NON_INSERTION"
  }]),
  function(e) {
      e[e.UNSPECIFIED = 0] = "UNSPECIFIED",
      e[e.NEW_CODE = 1] = "NEW_CODE",
      e[e.NO_LICENSE = 2] = "NO_LICENSE",
      e[e.NONPERMISSIVE = 3] = "NONPERMISSIVE",
      e[e.PERMISSIVE = 4] = "PERMISSIVE",
      e[e.PERMISSIVE_BLOCKED = 5] = "PERMISSIVE_BLOCKED"
  }(ve || (ve = {})),
  Le.util.setEnumType(ve, "exa.codeium_common_pb.AttributionStatus", [{
      no: 0,
      name: "ATTRIBUTION_STATUS_UNSPECIFIED"
  }, {
      no: 1,
      name: "ATTRIBUTION_STATUS_NEW_CODE"
  }, {
      no: 2,
      name: "ATTRIBUTION_STATUS_NO_LICENSE"
  }, {
      no: 3,
      name: "ATTRIBUTION_STATUS_NONPERMISSIVE"
  }, {
      no: 4,
      name: "ATTRIBUTION_STATUS_PERMISSIVE"
  }, {
      no: 5,
      name: "ATTRIBUTION_STATUS_PERMISSIVE_BLOCKED"
  }]),
  function(e) {
      e[e.UNSPECIFIED = 0] = "UNSPECIFIED",
      e[e.HIGH = 1] = "HIGH",
      e[e.LOW = 2] = "LOW"
  }(He || (He = {})),
  Le.util.setEnumType(He, "exa.codeium_common_pb.EmbeddingPriority", [{
      no: 0,
      name: "EMBEDDING_PRIORITY_UNSPECIFIED"
  }, {
      no: 1,
      name: "EMBEDDING_PRIORITY_HIGH"
  }, {
      no: 2,
      name: "EMBEDDING_PRIORITY_LOW"
  }]),
  function(e) {
      e[e.UNSPECIFIED = 0] = "UNSPECIFIED",
      e[e.NOMIC_DOCUMENT = 1] = "NOMIC_DOCUMENT",
      e[e.NOMIC_SEARCH = 2] = "NOMIC_SEARCH",
      e[e.NOMIC_CLASSIFICATION = 3] = "NOMIC_CLASSIFICATION",
      e[e.NOMIC_CLUSTERING = 4] = "NOMIC_CLUSTERING"
  }(Ve || (Ve = {})),
  Le.util.setEnumType(Ve, "exa.codeium_common_pb.EmbeddingPrefix", [{
      no: 0,
      name: "EMBEDDING_PREFIX_UNSPECIFIED"
  }, {
      no: 1,
      name: "EMBEDDING_PREFIX_NOMIC_DOCUMENT"
  }, {
      no: 2,
      name: "EMBEDDING_PREFIX_NOMIC_SEARCH"
  }, {
      no: 3,
      name: "EMBEDDING_PREFIX_NOMIC_CLASSIFICATION"
  }, {
      no: 4,
      name: "EMBEDDING_PREFIX_NOMIC_CLUSTERING"
  }]),
  function(e) {
      e[e.UNSPECIFIED = 0] = "UNSPECIFIED",
      e[e.CODE_CONTEXT_ITEM = 1] = "CODE_CONTEXT_ITEM",
      e[e.COMMIT_INTENT = 2] = "COMMIT_INTENT"
  }(Xe || (Xe = {})),
  Le.util.setEnumType(Xe, "exa.codeium_common_pb.EmbeddingSource", [{
      no: 0,
      name: "EMBEDDING_SOURCE_UNSPECIFIED"
  }, {
      no: 1,
      name: "EMBEDDING_SOURCE_CODE_CONTEXT_ITEM"
  }, {
      no: 2,
      name: "EMBEDDING_SOURCE_COMMIT_INTENT"
  }]),
  function(e) {
      e[e.CODEIUM = 0] = "CODEIUM",
      e[e.DEEPNOTE = 1] = "DEEPNOTE",
      e[e.CODESANDBOX = 2] = "CODESANDBOX",
      e[e.STACKBLITZ = 3] = "STACKBLITZ",
      e[e.VALTOWN = 4] = "VALTOWN",
      e[e.HEX = 5] = "HEX",
      e[e.ZAPIER = 6] = "ZAPIER",
      e[e.SUPERBLOCKS = 7] = "SUPERBLOCKS",
      e[e.EMBARCADERO = 8] = "EMBARCADERO"
  }(Ye || (Ye = {})),
  Le.util.setEnumType(Ye, "exa.codeium_common_pb.AuthSource", [{
      no: 0,
      name: "AUTH_SOURCE_CODEIUM"
  }, {
      no: 1,
      name: "AUTH_SOURCE_DEEPNOTE"
  }, {
      no: 2,
      name: "AUTH_SOURCE_CODESANDBOX"
  }, {
      no: 3,
      name: "AUTH_SOURCE_STACKBLITZ"
  }, {
      no: 4,
      name: "AUTH_SOURCE_VALTOWN"
  }, {
      no: 5,
      name: "AUTH_SOURCE_HEX"
  }, {
      no: 6,
      name: "AUTH_SOURCE_ZAPIER"
  }, {
      no: 7,
      name: "AUTH_SOURCE_SUPERBLOCKS"
  }, {
      no: 8,
      name: "AUTH_SOURCE_EMBARCADERO"
  }]),
  function(e) {
      e[e.UNSPECIFIED = 0] = "UNSPECIFIED",
      e[e.ENABLE_CODEIUM = 1] = "ENABLE_CODEIUM",
      e[e.DISABLE_CODEIUM = 2] = "DISABLE_CODEIUM",
      e[e.SHOW_PREVIOUS_COMPLETION = 3] = "SHOW_PREVIOUS_COMPLETION",
      e[e.SHOW_NEXT_COMPLETION = 4] = "SHOW_NEXT_COMPLETION",
      e[e.COPILOT_STATUS = 5] = "COPILOT_STATUS",
      e[e.COMPLETION_SUPPRESSED = 6] = "COMPLETION_SUPPRESSED",
      e[e.MEMORY_STATS = 8] = "MEMORY_STATS",
      e[e.LOCAL_CONTEXT_RELEVANCE_CHECK = 9] = "LOCAL_CONTEXT_RELEVANCE_CHECK",
      e[e.ACTIVE_EDITOR_CHANGED = 10] = "ACTIVE_EDITOR_CHANGED",
      e[e.SHOW_PREVIOUS_CORTEX_STEP = 11] = "SHOW_PREVIOUS_CORTEX_STEP",
      e[e.SHOW_NEXT_CORTEX_STEP = 12] = "SHOW_NEXT_CORTEX_STEP",
      e[e.INDEXER_STATS = 13] = "INDEXER_STATS"
  }(Ke || (Ke = {})),
  Le.util.setEnumType(Ke, "exa.codeium_common_pb.EventType", [{
      no: 0,
      name: "EVENT_TYPE_UNSPECIFIED"
  }, {
      no: 1,
      name: "EVENT_TYPE_ENABLE_CODEIUM"
  }, {
      no: 2,
      name: "EVENT_TYPE_DISABLE_CODEIUM"
  }, {
      no: 3,
      name: "EVENT_TYPE_SHOW_PREVIOUS_COMPLETION"
  }, {
      no: 4,
      name: "EVENT_TYPE_SHOW_NEXT_COMPLETION"
  }, {
      no: 5,
      name: "EVENT_TYPE_COPILOT_STATUS"
  }, {
      no: 6,
      name: "EVENT_TYPE_COMPLETION_SUPPRESSED"
  }, {
      no: 8,
      name: "EVENT_TYPE_MEMORY_STATS"
  }, {
      no: 9,
      name: "EVENT_TYPE_LOCAL_CONTEXT_RELEVANCE_CHECK"
  }, {
      no: 10,
      name: "EVENT_TYPE_ACTIVE_EDITOR_CHANGED"
  }, {
      no: 11,
      name: "EVENT_TYPE_SHOW_PREVIOUS_CORTEX_STEP"
  }, {
      no: 12,
      name: "EVENT_TYPE_SHOW_NEXT_CORTEX_STEP"
  }, {
      no: 13,
      name: "EVENT_TYPE_INDEXER_STATS"
  }]),
  function(e) {
      e[e.UNSPECIFIED = 0] = "UNSPECIFIED",
      e[e.CLUSTER = 1] = "CLUSTER",
      e[e.EXACT = 2] = "EXACT"
  }(We || (We = {})),
  Le.util.setEnumType(We, "exa.codeium_common_pb.SearchResultType", [{
      no: 0,
      name: "SEARCH_RESULT_TYPE_UNSPECIFIED"
  }, {
      no: 1,
      name: "SEARCH_RESULT_TYPE_CLUSTER"
  }, {
      no: 2,
      name: "SEARCH_RESULT_TYPE_EXACT"
  }]),
  function(e) {
      e[e.UNSPECIFIED = 0] = "UNSPECIFIED",
      e[e.RAW_SOURCE = 1] = "RAW_SOURCE",
      e[e.DOCSTRING = 2] = "DOCSTRING",
      e[e.FUNCTION = 3] = "FUNCTION",
      e[e.NODEPATH = 4] = "NODEPATH",
      e[e.DECLARATION = 5] = "DECLARATION",
      e[e.NAIVE_CHUNK = 6] = "NAIVE_CHUNK",
      e[e.SIGNATURE = 7] = "SIGNATURE"
  }(ze || (ze = {})),
  Le.util.setEnumType(ze, "exa.codeium_common_pb.EmbedType", [{
      no: 0,
      name: "EMBED_TYPE_UNSPECIFIED"
  }, {
      no: 1,
      name: "EMBED_TYPE_RAW_SOURCE"
  }, {
      no: 2,
      name: "EMBED_TYPE_DOCSTRING"
  }, {
      no: 3,
      name: "EMBED_TYPE_FUNCTION"
  }, {
      no: 4,
      name: "EMBED_TYPE_NODEPATH"
  }, {
      no: 5,
      name: "EMBED_TYPE_DECLARATION"
  }, {
      no: 6,
      name: "EMBED_TYPE_NAIVE_CHUNK"
  }, {
      no: 7,
      name: "EMBED_TYPE_SIGNATURE"
  }]),
  function(e) {
      e[e.UNSPECIFIED = 0] = "UNSPECIFIED",
      e[e.TYPING_AS_SUGGESTED = 1] = "TYPING_AS_SUGGESTED",
      e[e.CACHE = 2] = "CACHE",
      e[e.NETWORK = 3] = "NETWORK"
  }(je || (je = {})),
  Le.util.setEnumType(je, "exa.codeium_common_pb.CompletionSource", [{
      no: 0,
      name: "COMPLETION_SOURCE_UNSPECIFIED"
  }, {
      no: 1,
      name: "COMPLETION_SOURCE_TYPING_AS_SUGGESTED"
  }, {
      no: 2,
      name: "COMPLETION_SOURCE_CACHE"
  }, {
      no: 3,
      name: "COMPLETION_SOURCE_NETWORK"
  }]),
  function(e) {
      e[e.UNSPECIFIED = 0] = "UNSPECIFIED",
      e[e.SINGLE = 1] = "SINGLE",
      e[e.MULTI = 2] = "MULTI",
      e[e.INLINE_FIM = 3] = "INLINE_FIM"
  }($e || ($e = {})),
  Le.util.setEnumType($e, "exa.codeium_common_pb.CompletionType", [{
      no: 0,
      name: "COMPLETION_TYPE_UNSPECIFIED"
  }, {
      no: 1,
      name: "COMPLETION_TYPE_SINGLE"
  }, {
      no: 2,
      name: "COMPLETION_TYPE_MULTI"
  }, {
      no: 3,
      name: "COMPLETION_TYPE_INLINE_FIM"
  }]),
  function(e) {
      e[e.UNSPECIFIED = 0] = "UNSPECIFIED",
      e[e.C = 1] = "C",
      e[e.CLOJURE = 2] = "CLOJURE",
      e[e.COFFEESCRIPT = 3] = "COFFEESCRIPT",
      e[e.CPP = 4] = "CPP",
      e[e.CSHARP = 5] = "CSHARP",
      e[e.CSS = 6] = "CSS",
      e[e.CUDACPP = 7] = "CUDACPP",
      e[e.DOCKERFILE = 8] = "DOCKERFILE",
      e[e.GO = 9] = "GO",
      e[e.GROOVY = 10] = "GROOVY",
      e[e.HANDLEBARS = 11] = "HANDLEBARS",
      e[e.HASKELL = 12] = "HASKELL",
      e[e.HCL = 13] = "HCL",
      e[e.HTML = 14] = "HTML",
      e[e.INI = 15] = "INI",
      e[e.JAVA = 16] = "JAVA",
      e[e.JAVASCRIPT = 17] = "JAVASCRIPT",
      e[e.JSON = 18] = "JSON",
      e[e.JULIA = 19] = "JULIA",
      e[e.KOTLIN = 20] = "KOTLIN",
      e[e.LATEX = 21] = "LATEX",
      e[e.LESS = 22] = "LESS",
      e[e.LUA = 23] = "LUA",
      e[e.MAKEFILE = 24] = "MAKEFILE",
      e[e.MARKDOWN = 25] = "MARKDOWN",
      e[e.OBJECTIVEC = 26] = "OBJECTIVEC",
      e[e.OBJECTIVECPP = 27] = "OBJECTIVECPP",
      e[e.PERL = 28] = "PERL",
      e[e.PHP = 29] = "PHP",
      e[e.PLAINTEXT = 30] = "PLAINTEXT",
      e[e.PROTOBUF = 31] = "PROTOBUF",
      e[e.PBTXT = 32] = "PBTXT",
      e[e.PYTHON = 33] = "PYTHON",
      e[e.R = 34] = "R",
      e[e.RUBY = 35] = "RUBY",
      e[e.RUST = 36] = "RUST",
      e[e.SASS = 37] = "SASS",
      e[e.SCALA = 38] = "SCALA",
      e[e.SCSS = 39] = "SCSS",
      e[e.SHELL = 40] = "SHELL",
      e[e.SQL = 41] = "SQL",
      e[e.STARLARK = 42] = "STARLARK",
      e[e.SWIFT = 43] = "SWIFT",
      e[e.TSX = 44] = "TSX",
      e[e.TYPESCRIPT = 45] = "TYPESCRIPT",
      e[e.VISUALBASIC = 46] = "VISUALBASIC",
      e[e.VUE = 47] = "VUE",
      e[e.XML = 48] = "XML",
      e[e.XSL = 49] = "XSL",
      e[e.YAML = 50] = "YAML",
      e[e.SVELTE = 51] = "SVELTE",
      e[e.TOML = 52] = "TOML",
      e[e.DART = 53] = "DART",
      e[e.RST = 54] = "RST",
      e[e.OCAML = 55] = "OCAML",
      e[e.CMAKE = 56] = "CMAKE",
      e[e.PASCAL = 57] = "PASCAL",
      e[e.ELIXIR = 58] = "ELIXIR",
      e[e.FSHARP = 59] = "FSHARP",
      e[e.LISP = 60] = "LISP",
      e[e.MATLAB = 61] = "MATLAB",
      e[e.POWERSHELL = 62] = "POWERSHELL",
      e[e.SOLIDITY = 63] = "SOLIDITY",
      e[e.ADA = 64] = "ADA",
      e[e.OCAML_INTERFACE = 65] = "OCAML_INTERFACE",
      e[e.TREE_SITTER_QUERY = 66] = "TREE_SITTER_QUERY",
      e[e.APL = 67] = "APL",
      e[e.ASSEMBLY = 68] = "ASSEMBLY",
      e[e.COBOL = 69] = "COBOL",
      e[e.CRYSTAL = 70] = "CRYSTAL",
      e[e.EMACS_LISP = 71] = "EMACS_LISP",
      e[e.ERLANG = 72] = "ERLANG",
      e[e.FORTRAN = 73] = "FORTRAN",
      e[e.FREEFORM = 74] = "FREEFORM",
      e[e.GRADLE = 75] = "GRADLE",
      e[e.HACK = 76] = "HACK",
      e[e.MAVEN = 77] = "MAVEN",
      e[e.M68KASSEMBLY = 78] = "M68KASSEMBLY",
      e[e.SAS = 79] = "SAS",
      e[e.UNIXASSEMBLY = 80] = "UNIXASSEMBLY",
      e[e.VBA = 81] = "VBA",
      e[e.VIMSCRIPT = 82] = "VIMSCRIPT",
      e[e.WEBASSEMBLY = 83] = "WEBASSEMBLY",
      e[e.BLADE = 84] = "BLADE",
      e[e.ASTRO = 85] = "ASTRO",
      e[e.MUMPS = 86] = "MUMPS",
      e[e.GDSCRIPT = 87] = "GDSCRIPT",
      e[e.NIM = 88] = "NIM",
      e[e.PROLOG = 89] = "PROLOG",
      e[e.MARKDOWN_INLINE = 90] = "MARKDOWN_INLINE",
      e[e.APEX = 91] = "APEX"
  }(Qe || (Qe = {})),
  Le.util.setEnumType(Qe, "exa.codeium_common_pb.Language", [{
      no: 0,
      name: "LANGUAGE_UNSPECIFIED"
  }, {
      no: 1,
      name: "LANGUAGE_C"
  }, {
      no: 2,
      name: "LANGUAGE_CLOJURE"
  }, {
      no: 3,
      name: "LANGUAGE_COFFEESCRIPT"
  }, {
      no: 4,
      name: "LANGUAGE_CPP"
  }, {
      no: 5,
      name: "LANGUAGE_CSHARP"
  }, {
      no: 6,
      name: "LANGUAGE_CSS"
  }, {
      no: 7,
      name: "LANGUAGE_CUDACPP"
  }, {
      no: 8,
      name: "LANGUAGE_DOCKERFILE"
  }, {
      no: 9,
      name: "LANGUAGE_GO"
  }, {
      no: 10,
      name: "LANGUAGE_GROOVY"
  }, {
      no: 11,
      name: "LANGUAGE_HANDLEBARS"
  }, {
      no: 12,
      name: "LANGUAGE_HASKELL"
  }, {
      no: 13,
      name: "LANGUAGE_HCL"
  }, {
      no: 14,
      name: "LANGUAGE_HTML"
  }, {
      no: 15,
      name: "LANGUAGE_INI"
  }, {
      no: 16,
      name: "LANGUAGE_JAVA"
  }, {
      no: 17,
      name: "LANGUAGE_JAVASCRIPT"
  }, {
      no: 18,
      name: "LANGUAGE_JSON"
  }, {
      no: 19,
      name: "LANGUAGE_JULIA"
  }, {
      no: 20,
      name: "LANGUAGE_KOTLIN"
  }, {
      no: 21,
      name: "LANGUAGE_LATEX"
  }, {
      no: 22,
      name: "LANGUAGE_LESS"
  }, {
      no: 23,
      name: "LANGUAGE_LUA"
  }, {
      no: 24,
      name: "LANGUAGE_MAKEFILE"
  }, {
      no: 25,
      name: "LANGUAGE_MARKDOWN"
  }, {
      no: 26,
      name: "LANGUAGE_OBJECTIVEC"
  }, {
      no: 27,
      name: "LANGUAGE_OBJECTIVECPP"
  }, {
      no: 28,
      name: "LANGUAGE_PERL"
  }, {
      no: 29,
      name: "LANGUAGE_PHP"
  }, {
      no: 30,
      name: "LANGUAGE_PLAINTEXT"
  }, {
      no: 31,
      name: "LANGUAGE_PROTOBUF"
  }, {
      no: 32,
      name: "LANGUAGE_PBTXT"
  }, {
      no: 33,
      name: "LANGUAGE_PYTHON"
  }, {
      no: 34,
      name: "LANGUAGE_R"
  }, {
      no: 35,
      name: "LANGUAGE_RUBY"
  }, {
      no: 36,
      name: "LANGUAGE_RUST"
  }, {
      no: 37,
      name: "LANGUAGE_SASS"
  }, {
      no: 38,
      name: "LANGUAGE_SCALA"
  }, {
      no: 39,
      name: "LANGUAGE_SCSS"
  }, {
      no: 40,
      name: "LANGUAGE_SHELL"
  }, {
      no: 41,
      name: "LANGUAGE_SQL"
  }, {
      no: 42,
      name: "LANGUAGE_STARLARK"
  }, {
      no: 43,
      name: "LANGUAGE_SWIFT"
  }, {
      no: 44,
      name: "LANGUAGE_TSX"
  }, {
      no: 45,
      name: "LANGUAGE_TYPESCRIPT"
  }, {
      no: 46,
      name: "LANGUAGE_VISUALBASIC"
  }, {
      no: 47,
      name: "LANGUAGE_VUE"
  }, {
      no: 48,
      name: "LANGUAGE_XML"
  }, {
      no: 49,
      name: "LANGUAGE_XSL"
  }, {
      no: 50,
      name: "LANGUAGE_YAML"
  }, {
      no: 51,
      name: "LANGUAGE_SVELTE"
  }, {
      no: 52,
      name: "LANGUAGE_TOML"
  }, {
      no: 53,
      name: "LANGUAGE_DART"
  }, {
      no: 54,
      name: "LANGUAGE_RST"
  }, {
      no: 55,
      name: "LANGUAGE_OCAML"
  }, {
      no: 56,
      name: "LANGUAGE_CMAKE"
  }, {
      no: 57,
      name: "LANGUAGE_PASCAL"
  }, {
      no: 58,
      name: "LANGUAGE_ELIXIR"
  }, {
      no: 59,
      name: "LANGUAGE_FSHARP"
  }, {
      no: 60,
      name: "LANGUAGE_LISP"
  }, {
      no: 61,
      name: "LANGUAGE_MATLAB"
  }, {
      no: 62,
      name: "LANGUAGE_POWERSHELL"
  }, {
      no: 63,
      name: "LANGUAGE_SOLIDITY"
  }, {
      no: 64,
      name: "LANGUAGE_ADA"
  }, {
      no: 65,
      name: "LANGUAGE_OCAML_INTERFACE"
  }, {
      no: 66,
      name: "LANGUAGE_TREE_SITTER_QUERY"
  }, {
      no: 67,
      name: "LANGUAGE_APL"
  }, {
      no: 68,
      name: "LANGUAGE_ASSEMBLY"
  }, {
      no: 69,
      name: "LANGUAGE_COBOL"
  }, {
      no: 70,
      name: "LANGUAGE_CRYSTAL"
  }, {
      no: 71,
      name: "LANGUAGE_EMACS_LISP"
  }, {
      no: 72,
      name: "LANGUAGE_ERLANG"
  }, {
      no: 73,
      name: "LANGUAGE_FORTRAN"
  }, {
      no: 74,
      name: "LANGUAGE_FREEFORM"
  }, {
      no: 75,
      name: "LANGUAGE_GRADLE"
  }, {
      no: 76,
      name: "LANGUAGE_HACK"
  }, {
      no: 77,
      name: "LANGUAGE_MAVEN"
  }, {
      no: 78,
      name: "LANGUAGE_M68KASSEMBLY"
  }, {
      no: 79,
      name: "LANGUAGE_SAS"
  }, {
      no: 80,
      name: "LANGUAGE_UNIXASSEMBLY"
  }, {
      no: 81,
      name: "LANGUAGE_VBA"
  }, {
      no: 82,
      name: "LANGUAGE_VIMSCRIPT"
  }, {
      no: 83,
      name: "LANGUAGE_WEBASSEMBLY"
  }, {
      no: 84,
      name: "LANGUAGE_BLADE"
  }, {
      no: 85,
      name: "LANGUAGE_ASTRO"
  }, {
      no: 86,
      name: "LANGUAGE_MUMPS"
  }, {
      no: 87,
      name: "LANGUAGE_GDSCRIPT"
  }, {
      no: 88,
      name: "LANGUAGE_NIM"
  }, {
      no: 89,
      name: "LANGUAGE_PROLOG"
  }, {
      no: 90,
      name: "LANGUAGE_MARKDOWN_INLINE"
  }, {
      no: 91,
      name: "LANGUAGE_APEX"
  }]),
  function(e) {
      e[e.UNSPECIFIED = 0] = "UNSPECIFIED",
      e[e.USER = 1] = "USER",
      e[e.SYSTEM = 2] = "SYSTEM",
      e[e.UNKNOWN = 3] = "UNKNOWN",
      e[e.TOOL = 4] = "TOOL",
      e[e.SYSTEM_PROMPT = 5] = "SYSTEM_PROMPT"
  }(Ze || (Ze = {})),
  Le.util.setEnumType(Ze, "exa.codeium_common_pb.ChatMessageSource", [{
      no: 0,
      name: "CHAT_MESSAGE_SOURCE_UNSPECIFIED"
  }, {
      no: 1,
      name: "CHAT_MESSAGE_SOURCE_USER"
  }, {
      no: 2,
      name: "CHAT_MESSAGE_SOURCE_SYSTEM"
  }, {
      no: 3,
      name: "CHAT_MESSAGE_SOURCE_UNKNOWN"
  }, {
      no: 4,
      name: "CHAT_MESSAGE_SOURCE_TOOL"
  }, {
      no: 5,
      name: "CHAT_MESSAGE_SOURCE_SYSTEM_PROMPT"
  }]),
  function(e) {
      e[e.UNSPECIFIED = 0] = "UNSPECIFIED",
      e[e.PENDING = 1] = "PENDING",
      e[e.APPROVED = 2] = "APPROVED",
      e[e.REJECTED = 3] = "REJECTED"
  }(et || (et = {})),
  Le.util.setEnumType(et, "exa.codeium_common_pb.UserTeamStatus", [{
      no: 0,
      name: "USER_TEAM_STATUS_UNSPECIFIED"
  }, {
      no: 1,
      name: "USER_TEAM_STATUS_PENDING"
  }, {
      no: 2,
      name: "USER_TEAM_STATUS_APPROVED"
  }, {
      no: 3,
      name: "USER_TEAM_STATUS_REJECTED"
  }]),
  function(e) {
      e[e.UNSPECIFIED = 0] = "UNSPECIFIED",
      e[e.SSO = 1] = "SSO",
      e[e.ATTRIBUTION = 2] = "ATTRIBUTION",
      e[e.PHI = 3] = "PHI",
      e[e.CORTEX = 4] = "CORTEX",
      e[e.OPENAI_DISABLED = 5] = "OPENAI_DISABLED",
      e[e.REMOTE_INDEXING_DISABLED = 6] = "REMOTE_INDEXING_DISABLED",
      e[e.API_KEY_ENABLED = 7] = "API_KEY_ENABLED"
  }(tt || (tt = {})),
  Le.util.setEnumType(tt, "exa.codeium_common_pb.TeamsFeatures", [{
      no: 0,
      name: "TEAMS_FEATURES_UNSPECIFIED"
  }, {
      no: 1,
      name: "TEAMS_FEATURES_SSO"
  }, {
      no: 2,
      name: "TEAMS_FEATURES_ATTRIBUTION"
  }, {
      no: 3,
      name: "TEAMS_FEATURES_PHI"
  }, {
      no: 4,
      name: "TEAMS_FEATURES_CORTEX"
  }, {
      no: 5,
      name: "TEAMS_FEATURES_OPENAI_DISABLED"
  }, {
      no: 6,
      name: "TEAMS_FEATURES_REMOTE_INDEXING_DISABLED"
  }, {
      no: 7,
      name: "TEAMS_FEATURES_API_KEY_ENABLED"
  }]),
  function(e) {
      e[e.UNSPECIFIED = 0] = "UNSPECIFIED",
      e[e.CORTEX = 1] = "CORTEX",
      e[e.CORTEX_TEST = 2] = "CORTEX_TEST"
  }(nt || (nt = {})),
  Le.util.setEnumType(nt, "exa.codeium_common_pb.UserFeatures", [{
      no: 0,
      name: "USER_FEATURES_UNSPECIFIED"
  }, {
      no: 1,
      name: "USER_FEATURES_CORTEX"
  }, {
      no: 2,
      name: "USER_FEATURES_CORTEX_TEST"
  }]),
  function(e) {
      e[e.UNSPECIFIED = 0] = "UNSPECIFIED",
      e[e.ATTRIBUTION_READ = 1] = "ATTRIBUTION_READ",
      e[e.ANALYTICS_READ = 2] = "ANALYTICS_READ",
      e[e.LICENSE_READ = 3] = "LICENSE_READ",
      e[e.TEAM_USER_READ = 4] = "TEAM_USER_READ",
      e[e.TEAM_USER_UPDATE = 5] = "TEAM_USER_UPDATE",
      e[e.TEAM_USER_DELETE = 6] = "TEAM_USER_DELETE",
      e[e.TEAM_USER_INVITE = 17] = "TEAM_USER_INVITE",
      e[e.INDEXING_READ = 7] = "INDEXING_READ",
      e[e.INDEXING_CREATE = 8] = "INDEXING_CREATE",
      e[e.INDEXING_UPDATE = 9] = "INDEXING_UPDATE",
      e[e.INDEXING_DELETE = 10] = "INDEXING_DELETE",
      e[e.INDEXING_MANAGEMENT = 27] = "INDEXING_MANAGEMENT",
      e[e.FINETUNING_READ = 19] = "FINETUNING_READ",
      e[e.FINETUNING_CREATE = 20] = "FINETUNING_CREATE",
      e[e.FINETUNING_UPDATE = 21] = "FINETUNING_UPDATE",
      e[e.FINETUNING_DELETE = 22] = "FINETUNING_DELETE",
      e[e.SSO_READ = 11] = "SSO_READ",
      e[e.SSO_WRITE = 12] = "SSO_WRITE",
      e[e.SERVICE_KEY_READ = 13] = "SERVICE_KEY_READ",
      e[e.SERVICE_KEY_CREATE = 14] = "SERVICE_KEY_CREATE",
      e[e.SERVICE_KEY_UPDATE = 28] = "SERVICE_KEY_UPDATE",
      e[e.SERVICE_KEY_DELETE = 15] = "SERVICE_KEY_DELETE",
      e[e.ROLE_READ = 23] = "ROLE_READ",
      e[e.ROLE_CREATE = 24] = "ROLE_CREATE",
      e[e.ROLE_UPDATE = 25] = "ROLE_UPDATE",
      e[e.ROLE_DELETE = 26] = "ROLE_DELETE",
      e[e.BILLING_READ = 16] = "BILLING_READ",
      e[e.BILLING_WRITE = 18] = "BILLING_WRITE",
      e[e.EXTERNAL_CHAT_UPDATE = 29] = "EXTERNAL_CHAT_UPDATE"
  }(rt || (rt = {})),
  Le.util.setEnumType(rt, "exa.codeium_common_pb.Permission", [{
      no: 0,
      name: "PERMISSION_UNSPECIFIED"
  }, {
      no: 1,
      name: "PERMISSION_ATTRIBUTION_READ"
  }, {
      no: 2,
      name: "PERMISSION_ANALYTICS_READ"
  }, {
      no: 3,
      name: "PERMISSION_LICENSE_READ"
  }, {
      no: 4,
      name: "PERMISSION_TEAM_USER_READ"
  }, {
      no: 5,
      name: "PERMISSION_TEAM_USER_UPDATE"
  }, {
      no: 6,
      name: "PERMISSION_TEAM_USER_DELETE"
  }, {
      no: 17,
      name: "PERMISSION_TEAM_USER_INVITE"
  }, {
      no: 7,
      name: "PERMISSION_INDEXING_READ"
  }, {
      no: 8,
      name: "PERMISSION_INDEXING_CREATE"
  }, {
      no: 9,
      name: "PERMISSION_INDEXING_UPDATE"
  }, {
      no: 10,
      name: "PERMISSION_INDEXING_DELETE"
  }, {
      no: 27,
      name: "PERMISSION_INDEXING_MANAGEMENT"
  }, {
      no: 19,
      name: "PERMISSION_FINETUNING_READ"
  }, {
      no: 20,
      name: "PERMISSION_FINETUNING_CREATE"
  }, {
      no: 21,
      name: "PERMISSION_FINETUNING_UPDATE"
  }, {
      no: 22,
      name: "PERMISSION_FINETUNING_DELETE"
  }, {
      no: 11,
      name: "PERMISSION_SSO_READ"
  }, {
      no: 12,
      name: "PERMISSION_SSO_WRITE"
  }, {
      no: 13,
      name: "PERMISSION_SERVICE_KEY_READ"
  }, {
      no: 14,
      name: "PERMISSION_SERVICE_KEY_CREATE"
  }, {
      no: 28,
      name: "PERMISSION_SERVICE_KEY_UPDATE"
  }, {
      no: 15,
      name: "PERMISSION_SERVICE_KEY_DELETE"
  }, {
      no: 23,
      name: "PERMISSION_ROLE_READ"
  }, {
      no: 24,
      name: "PERMISSION_ROLE_CREATE"
  }, {
      no: 25,
      name: "PERMISSION_ROLE_UPDATE"
  }, {
      no: 26,
      name: "PERMISSION_ROLE_DELETE"
  }, {
      no: 16,
      name: "PERMISSION_BILLING_READ"
  }, {
      no: 18,
      name: "PERMISSION_BILLING_WRITE"
  }, {
      no: 29,
      name: "PERMISSION_EXTERNAL_CHAT_UPDATE"
  }]),
  function(e) {
      e[e.UNSPECIFIED = 0] = "UNSPECIFIED",
      e[e.TEAMS = 1] = "TEAMS",
      e[e.PRO = 2] = "PRO",
      e[e.ENTERPRISE_SAAS = 3] = "ENTERPRISE_SAAS",
      e[e.HYBRID = 4] = "HYBRID",
      e[e.ENTERPRISE_SELF_HOSTED = 5] = "ENTERPRISE_SELF_HOSTED",
      e[e.WAITLIST_PRO = 6] = "WAITLIST_PRO"
  }(at || (at = {})),
  Le.util.setEnumType(at, "exa.codeium_common_pb.TeamsTier", [{
      no: 0,
      name: "TEAMS_TIER_UNSPECIFIED"
  }, {
      no: 1,
      name: "TEAMS_TIER_TEAMS"
  }, {
      no: 2,
      name: "TEAMS_TIER_PRO"
  }, {
      no: 3,
      name: "TEAMS_TIER_ENTERPRISE_SAAS"
  }, {
      no: 4,
      name: "TEAMS_TIER_HYBRID"
  }, {
      no: 5,
      name: "TEAMS_TIER_ENTERPRISE_SELF_HOSTED"
  }, {
      no: 6,
      name: "TEAMS_TIER_WAITLIST_PRO"
  }]),
  function(e) {
      e[e.UNSPECIFIED = 0] = "UNSPECIFIED",
      e[e.GITHUB = 1] = "GITHUB",
      e[e.GITLAB = 2] = "GITLAB",
      e[e.BITBUCKET = 3] = "BITBUCKET",
      e[e.AZURE_DEVOPS = 4] = "AZURE_DEVOPS"
  }(it || (it = {})),
  Le.util.setEnumType(it, "exa.codeium_common_pb.ScmProvider", [{
      no: 0,
      name: "SCM_PROVIDER_UNSPECIFIED"
  }, {
      no: 1,
      name: "SCM_PROVIDER_GITHUB"
  }, {
      no: 2,
      name: "SCM_PROVIDER_GITLAB"
  }, {
      no: 3,
      name: "SCM_PROVIDER_BITBUCKET"
  }, {
      no: 4,
      name: "SCM_PROVIDER_AZURE_DEVOPS"
  }]),
  function(e) {
      e[e.UNSPECIFIED = 0] = "UNSPECIFIED",
      e[e.FUNCTION = 1] = "FUNCTION",
      e[e.CLASS = 2] = "CLASS",
      e[e.IMPORT = 3] = "IMPORT",
      e[e.NAIVE_LINECHUNK = 4] = "NAIVE_LINECHUNK",
      e[e.REFERENCE_FUNCTION = 5] = "REFERENCE_FUNCTION",
      e[e.REFERENCE_CLASS = 6] = "REFERENCE_CLASS",
      e[e.FILE = 7] = "FILE",
      e[e.TERMINAL = 8] = "TERMINAL"
  }(st || (st = {})),
  Le.util.setEnumType(st, "exa.codeium_common_pb.CodeContextType", [{
      no: 0,
      name: "CODE_CONTEXT_TYPE_UNSPECIFIED"
  }, {
      no: 1,
      name: "CODE_CONTEXT_TYPE_FUNCTION"
  }, {
      no: 2,
      name: "CODE_CONTEXT_TYPE_CLASS"
  }, {
      no: 3,
      name: "CODE_CONTEXT_TYPE_IMPORT"
  }, {
      no: 4,
      name: "CODE_CONTEXT_TYPE_NAIVE_LINECHUNK"
  }, {
      no: 5,
      name: "CODE_CONTEXT_TYPE_REFERENCE_FUNCTION"
  }, {
      no: 6,
      name: "CODE_CONTEXT_TYPE_REFERENCE_CLASS"
  }, {
      no: 7,
      name: "CODE_CONTEXT_TYPE_FILE"
  }, {
      no: 8,
      name: "CODE_CONTEXT_TYPE_TERMINAL"
  }]),
  function(e) {
      e[e.UNSPECIFIED = 0] = "UNSPECIFIED",
      e[e.OPEN_DOCS = 1] = "OPEN_DOCS",
      e[e.SEARCH_RESULT = 2] = "SEARCH_RESULT",
      e[e.IMPORT = 3] = "IMPORT",
      e[e.LOCAL_DIRECTORY = 4] = "LOCAL_DIRECTORY",
      e[e.LAST_ACTIVE_DOC = 5] = "LAST_ACTIVE_DOC",
      e[e.ORACLE_ITEMS = 6] = "ORACLE_ITEMS",
      e[e.PINNED_CONTEXT = 7] = "PINNED_CONTEXT",
      e[e.RESEARCH_STATE = 8] = "RESEARCH_STATE",
      e[e.GROUND_TRUTH_PLAN_EDIT = 9] = "GROUND_TRUTH_PLAN_EDIT",
      e[e.COMMIT_GRAPH = 10] = "COMMIT_GRAPH"
  }(ot || (ot = {})),
  Le.util.setEnumType(ot, "exa.codeium_common_pb.CodeContextSource", [{
      no: 0,
      name: "CODE_CONTEXT_SOURCE_UNSPECIFIED"
  }, {
      no: 1,
      name: "CODE_CONTEXT_SOURCE_OPEN_DOCS"
  }, {
      no: 2,
      name: "CODE_CONTEXT_SOURCE_SEARCH_RESULT"
  }, {
      no: 3,
      name: "CODE_CONTEXT_SOURCE_IMPORT"
  }, {
      no: 4,
      name: "CODE_CONTEXT_SOURCE_LOCAL_DIRECTORY"
  }, {
      no: 5,
      name: "CODE_CONTEXT_SOURCE_LAST_ACTIVE_DOC"
  }, {
      no: 6,
      name: "CODE_CONTEXT_SOURCE_ORACLE_ITEMS"
  }, {
      no: 7,
      name: "CODE_CONTEXT_SOURCE_PINNED_CONTEXT"
  }, {
      no: 8,
      name: "CODE_CONTEXT_SOURCE_RESEARCH_STATE"
  }, {
      no: 9,
      name: "CODE_CONTEXT_SOURCE_GROUND_TRUTH_PLAN_EDIT"
  }, {
      no: 10,
      name: "CODE_CONTEXT_SOURCE_COMMIT_GRAPH"
  }]),
  function(e) {
      e[e.UNSPECIFIED = 0] = "UNSPECIFIED",
      e[e.RAW_SOURCE = 1] = "RAW_SOURCE",
      e[e.SIGNATURE = 2] = "SIGNATURE",
      e[e.NODEPATH = 3] = "NODEPATH"
  }(mt || (mt = {})),
  Le.util.setEnumType(mt, "exa.codeium_common_pb.ContextSnippetType", [{
      no: 0,
      name: "CONTEXT_SNIPPET_TYPE_UNSPECIFIED"
  }, {
      no: 1,
      name: "CONTEXT_SNIPPET_TYPE_RAW_SOURCE"
  }, {
      no: 2,
      name: "CONTEXT_SNIPPET_TYPE_SIGNATURE"
  }, {
      no: 3,
      name: "CONTEXT_SNIPPET_TYPE_NODEPATH"
  }]),
  function(e) {
      e[e.UNSPECIFIED = 0] = "UNSPECIFIED",
      e[e.COMMIT_MESSAGE = 1] = "COMMIT_MESSAGE"
  }(ct || (ct = {})),
  Le.util.setEnumType(ct, "exa.codeium_common_pb.CommitIntentType", [{
      no: 0,
      name: "COMMIT_INTENT_TYPE_UNSPECIFIED"
  }, {
      no: 1,
      name: "COMMIT_INTENT_TYPE_COMMIT_MESSAGE"
  }]),
  function(e) {
      e[e.UNSPECIFIED = 0] = "UNSPECIFIED",
      e[e.L4 = 1] = "L4",
      e[e.T4 = 2] = "T4",
      e[e.A10 = 3] = "A10",
      e[e.A100 = 4] = "A100",
      e[e.V100 = 5] = "V100",
      e[e.A5000 = 6] = "A5000"
  }(ut || (ut = {})),
  Le.util.setEnumType(ut, "exa.codeium_common_pb.GpuType", [{
      no: 0,
      name: "GPU_TYPE_UNSPECIFIED"
  }, {
      no: 1,
      name: "GPU_TYPE_L4"
  }, {
      no: 2,
      name: "GPU_TYPE_T4"
  }, {
      no: 3,
      name: "GPU_TYPE_A10"
  }, {
      no: 4,
      name: "GPU_TYPE_A100"
  }, {
      no: 5,
      name: "GPU_TYPE_V100"
  }, {
      no: 6,
      name: "GPU_TYPE_A5000"
  }]),
  function(e) {
      e[e.UNSPECIFIED = 0] = "UNSPECIFIED",
      e[e.INCLUDE = 1] = "INCLUDE",
      e[e.EXCLUDE = 2] = "EXCLUDE"
  }(lt || (lt = {})),
  Le.util.setEnumType(lt, "exa.codeium_common_pb.ContextInclusionType", [{
      no: 0,
      name: "CONTEXT_INCLUSION_TYPE_UNSPECIFIED"
  }, {
      no: 1,
      name: "CONTEXT_INCLUSION_TYPE_INCLUDE"
  }, {
      no: 2,
      name: "CONTEXT_INCLUSION_TYPE_EXCLUDE"
  }]),
  function(e) {
      e[e.UNSPECIFIED = 0] = "UNSPECIFIED",
      e[e.AUTO = 1] = "AUTO",
      e[e.LIGHT = 2] = "LIGHT",
      e[e.DARK = 3] = "DARK"
  }(_t || (_t = {})),
  Le.util.setEnumType(_t, "exa.codeium_common_pb.ThemePreference", [{
      no: 0,
      name: "THEME_PREFERENCE_UNSPECIFIED"
  }, {
      no: 1,
      name: "THEME_PREFERENCE_AUTO"
  }, {
      no: 2,
      name: "THEME_PREFERENCE_LIGHT"
  }, {
      no: 3,
      name: "THEME_PREFERENCE_DARK"
  }]),
  function(e) {
      e[e.UNSPECIFIED = 0] = "UNSPECIFIED",
      e[e.SMALL = 1] = "SMALL",
      e[e.DEFAULT = 2] = "DEFAULT",
      e[e.LARGE = 3] = "LARGE"
  }(dt || (dt = {})),
  Le.util.setEnumType(dt, "exa.codeium_common_pb.FontSize", [{
      no: 0,
      name: "FONT_SIZE_UNSPECIFIED"
  }, {
      no: 1,
      name: "FONT_SIZE_SMALL"
  }, {
      no: 2,
      name: "FONT_SIZE_DEFAULT"
  }, {
      no: 3,
      name: "FONT_SIZE_LARGE"
  }]),
  function(e) {
      e[e.UNSPECIFIED = 0] = "UNSPECIFIED",
      e[e.SLOW = 1] = "SLOW",
      e[e.DEFAULT = 2] = "DEFAULT",
      e[e.FAST = 3] = "FAST"
  }(Et || (Et = {})),
  Le.util.setEnumType(Et, "exa.codeium_common_pb.AutocompleteSpeed", [{
      no: 0,
      name: "AUTOCOMPLETE_SPEED_UNSPECIFIED"
  }, {
      no: 1,
      name: "AUTOCOMPLETE_SPEED_SLOW"
  }, {
      no: 2,
      name: "AUTOCOMPLETE_SPEED_DEFAULT"
  }, {
      no: 3,
      name: "AUTOCOMPLETE_SPEED_FAST"
  }]),
  function(e) {
      e[e.UNSPECIFIED = 0] = "UNSPECIFIED",
      e[e.CHAT = 1] = "CHAT",
      e[e.PROFILE = 2] = "PROFILE",
      e[e.BRAIN = 4] = "BRAIN",
      e[e.COMMAND = 5] = "COMMAND",
      e[e.CORTEX = 6] = "CORTEX",
      e[e.DEBUG = 7] = "DEBUG"
  }(Tt || (Tt = {})),
  Le.util.setEnumType(Tt, "exa.codeium_common_pb.ExtensionPanelTab", [{
      no: 0,
      name: "EXTENSION_PANEL_TAB_UNSPECIFIED"
  }, {
      no: 1,
      name: "EXTENSION_PANEL_TAB_CHAT"
  }, {
      no: 2,
      name: "EXTENSION_PANEL_TAB_PROFILE"
  }, {
      no: 4,
      name: "EXTENSION_PANEL_TAB_BRAIN"
  }, {
      no: 5,
      name: "EXTENSION_PANEL_TAB_COMMAND"
  }, {
      no: 6,
      name: "EXTENSION_PANEL_TAB_CORTEX"
  }, {
      no: 7,
      name: "EXTENSION_PANEL_TAB_DEBUG"
  }]),
  function(e) {
      e[e.UNSPECIFIED = 0] = "UNSPECIFIED",
      e[e.ENABLED = 1] = "ENABLED",
      e[e.DISABLED = 2] = "DISABLED"
  }(ft || (ft = {})),
  Le.util.setEnumType(ft, "exa.codeium_common_pb.RememberLastModelSelection", [{
      no: 0,
      name: "REMEMBER_LAST_MODEL_SELECTION_UNSPECIFIED"
  }, {
      no: 1,
      name: "REMEMBER_LAST_MODEL_SELECTION_ENABLED"
  }, {
      no: 2,
      name: "REMEMBER_LAST_MODEL_SELECTION_DISABLED"
  }]),
  function(e) {
      e[e.CASCADE_NUX_EVENT_UNSPECIFIED = 0] = "CASCADE_NUX_EVENT_UNSPECIFIED",
      e[e.CASCADE_NUX_EVENT_DIFF_OVERVIEW = 1] = "CASCADE_NUX_EVENT_DIFF_OVERVIEW"
  }(pt || (pt = {})),
  Le.util.setEnumType(pt, "exa.codeium_common_pb.CascadeNUXEvent", [{
      no: 0,
      name: "CASCADE_NUX_EVENT_UNSPECIFIED"
  }, {
      no: 1,
      name: "CASCADE_NUX_EVENT_DIFF_OVERVIEW"
  }]),
  function(e) {
      e[e.UNSPECIFIED = 0] = "UNSPECIFIED",
      e[e.COMPLETION = 1] = "COMPLETION",
      e[e.CHAT = 2] = "CHAT",
      e[e.EMBED = 3] = "EMBED",
      e[e.QUERY = 4] = "QUERY"
  }(St || (St = {})),
  Le.util.setEnumType(St, "exa.codeium_common_pb.ModelType", [{
      no: 0,
      name: "MODEL_TYPE_UNSPECIFIED"
  }, {
      no: 1,
      name: "MODEL_TYPE_COMPLETION"
  }, {
      no: 2,
      name: "MODEL_TYPE_CHAT"
  }, {
      no: 3,
      name: "MODEL_TYPE_EMBED"
  }, {
      no: 4,
      name: "MODEL_TYPE_QUERY"
  }]),
  function(e) {
      e[e.API_PROVIDER_UNSPECIFIED = 0] = "API_PROVIDER_UNSPECIFIED",
      e[e.API_PROVIDER_INTERNAL = 1] = "API_PROVIDER_INTERNAL",
      e[e.API_PROVIDER_OPENAI = 2] = "API_PROVIDER_OPENAI",
      e[e.API_PROVIDER_GOOGLE_VERTEX = 3] = "API_PROVIDER_GOOGLE_VERTEX",
      e[e.API_PROVIDER_ANTHROPIC = 4] = "API_PROVIDER_ANTHROPIC",
      e[e.API_PROVIDER_VLLM = 5] = "API_PROVIDER_VLLM",
      e[e.API_PROVIDER_TOGETHER_AI = 6] = "API_PROVIDER_TOGETHER_AI",
      e[e.API_PROVIDER_HUGGING_FACE = 7] = "API_PROVIDER_HUGGING_FACE",
      e[e.API_PROVIDER_NOMIC = 8] = "API_PROVIDER_NOMIC",
      e[e.API_PROVIDER_TEI = 9] = "API_PROVIDER_TEI",
      e[e.API_PROVIDER_OPENAI_COMPATIBLE_EXTERNAL = 10] = "API_PROVIDER_OPENAI_COMPATIBLE_EXTERNAL",
      e[e.API_PROVIDER_ANTHROPIC_COMPATIBLE_EXTERNAL = 11] = "API_PROVIDER_ANTHROPIC_COMPATIBLE_EXTERNAL",
      e[e.API_PROVIDER_VERTEX_COMPATIBLE_EXTERNAL = 12] = "API_PROVIDER_VERTEX_COMPATIBLE_EXTERNAL",
      e[e.API_PROVIDER_BEDROCK_COMPATIBLE_EXTERNAL = 13] = "API_PROVIDER_BEDROCK_COMPATIBLE_EXTERNAL",
      e[e.API_PROVIDER_AZURE_COMPATIBLE_EXTERNAL = 14] = "API_PROVIDER_AZURE_COMPATIBLE_EXTERNAL"
  }(Nt || (Nt = {})),
  Le.util.setEnumType(Nt, "exa.codeium_common_pb.APIProvider", [{
      no: 0,
      name: "API_PROVIDER_UNSPECIFIED"
  }, {
      no: 1,
      name: "API_PROVIDER_INTERNAL"
  }, {
      no: 2,
      name: "API_PROVIDER_OPENAI"
  }, {
      no: 3,
      name: "API_PROVIDER_GOOGLE_VERTEX"
  }, {
      no: 4,
      name: "API_PROVIDER_ANTHROPIC"
  }, {
      no: 5,
      name: "API_PROVIDER_VLLM"
  }, {
      no: 6,
      name: "API_PROVIDER_TOGETHER_AI"
  }, {
      no: 7,
      name: "API_PROVIDER_HUGGING_FACE"
  }, {
      no: 8,
      name: "API_PROVIDER_NOMIC"
  }, {
      no: 9,
      name: "API_PROVIDER_TEI"
  }, {
      no: 10,
      name: "API_PROVIDER_OPENAI_COMPATIBLE_EXTERNAL"
  }, {
      no: 11,
      name: "API_PROVIDER_ANTHROPIC_COMPATIBLE_EXTERNAL"
  }, {
      no: 12,
      name: "API_PROVIDER_VERTEX_COMPATIBLE_EXTERNAL"
  }, {
      no: 13,
      name: "API_PROVIDER_BEDROCK_COMPATIBLE_EXTERNAL"
  }, {
      no: 14,
      name: "API_PROVIDER_AZURE_COMPATIBLE_EXTERNAL"
  }]),
  function(e) {
      e[e.UNSPECIFIED = 0] = "UNSPECIFIED",
      e[e.BASE = 1] = "BASE",
      e[e.CODEIUM = 2] = "CODEIUM",
      e[e.USER = 3] = "USER",
      e[e.USER_LARGE = 4] = "USER_LARGE",
      e[e.UNKNOWN = 5] = "UNKNOWN"
  }(gt || (gt = {})),
  Le.util.setEnumType(gt, "exa.codeium_common_pb.CodeSource", [{
      no: 0,
      name: "CODE_SOURCE_UNSPECIFIED"
  }, {
      no: 1,
      name: "CODE_SOURCE_BASE"
  }, {
      no: 2,
      name: "CODE_SOURCE_CODEIUM"
  }, {
      no: 3,
      name: "CODE_SOURCE_USER"
  }, {
      no: 4,
      name: "CODE_SOURCE_USER_LARGE"
  }, {
      no: 5,
      name: "CODE_SOURCE_UNKNOWN"
  }]),
  function(e) {
      e[e.UNSPECIFIED = 0] = "UNSPECIFIED",
      e[e.FILE = 1] = "FILE",
      e[e.DIRECTORY = 2] = "DIRECTORY",
      e[e.REPOSITORY = 3] = "REPOSITORY",
      e[e.CODE_CONTEXT = 4] = "CODE_CONTEXT",
      e[e.CCI_WITH_SUBRANGE = 5] = "CCI_WITH_SUBRANGE",
      e[e.REPOSITORY_PATH = 6] = "REPOSITORY_PATH",
      e[e.SLACK = 7] = "SLACK",
      e[e.GITHUB = 8] = "GITHUB",
      e[e.FILE_LINE_RANGE = 9] = "FILE_LINE_RANGE",
      e[e.TEXT_BLOCK = 10] = "TEXT_BLOCK"
  }(It || (It = {})),
  Le.util.setEnumType(It, "exa.codeium_common_pb.ContextScopeType", [{
      no: 0,
      name: "CONTEXT_SCOPE_TYPE_UNSPECIFIED"
  }, {
      no: 1,
      name: "CONTEXT_SCOPE_TYPE_FILE"
  }, {
      no: 2,
      name: "CONTEXT_SCOPE_TYPE_DIRECTORY"
  }, {
      no: 3,
      name: "CONTEXT_SCOPE_TYPE_REPOSITORY"
  }, {
      no: 4,
      name: "CONTEXT_SCOPE_TYPE_CODE_CONTEXT"
  }, {
      no: 5,
      name: "CONTEXT_SCOPE_TYPE_CCI_WITH_SUBRANGE"
  }, {
      no: 6,
      name: "CONTEXT_SCOPE_TYPE_REPOSITORY_PATH"
  }, {
      no: 7,
      name: "CONTEXT_SCOPE_TYPE_SLACK"
  }, {
      no: 8,
      name: "CONTEXT_SCOPE_TYPE_GITHUB"
  }, {
      no: 9,
      name: "CONTEXT_SCOPE_TYPE_FILE_LINE_RANGE"
  }, {
      no: 10,
      name: "CONTEXT_SCOPE_TYPE_TEXT_BLOCK"
  }]),
  function(e) {
      e[e.UNSPECIFIED = 0] = "UNSPECIFIED",
      e[e.DEFAULT = 1] = "DEFAULT",
      e[e.FUNCTION_CODE_LENS = 2] = "FUNCTION_CODE_LENS",
      e[e.CLASS_CODE_LENS = 3] = "CLASS_CODE_LENS",
      e[e.RIGHT_CLICK_REFACTOR = 4] = "RIGHT_CLICK_REFACTOR",
      e[e.SELECTION_HINT_CODE_LENS = 5] = "SELECTION_HINT_CODE_LENS",
      e[e.LINE_HINT_CODE_LENS = 6] = "LINE_HINT_CODE_LENS",
      e[e.PLAN = 7] = "PLAN",
      e[e.FOLLOWUP = 8] = "FOLLOWUP",
      e[e.PASTE_AND_TRANSLATE = 9] = "PASTE_AND_TRANSLATE",
      e[e.SUPERCOMPLETE = 10] = "SUPERCOMPLETE",
      e[e.FUNCTION_DOCSTRING = 11] = "FUNCTION_DOCSTRING",
      e[e.FAST_APPLY = 12] = "FAST_APPLY",
      e[e.TERMINAL = 13] = "TERMINAL",
      e[e.TAB_JUMP = 14] = "TAB_JUMP"
  }(Ct || (Ct = {})),
  Le.util.setEnumType(Ct, "exa.codeium_common_pb.CommandRequestSource", [{
      no: 0,
      name: "COMMAND_REQUEST_SOURCE_UNSPECIFIED"
  }, {
      no: 1,
      name: "COMMAND_REQUEST_SOURCE_DEFAULT"
  }, {
      no: 2,
      name: "COMMAND_REQUEST_SOURCE_FUNCTION_CODE_LENS"
  }, {
      no: 3,
      name: "COMMAND_REQUEST_SOURCE_CLASS_CODE_LENS"
  }, {
      no: 4,
      name: "COMMAND_REQUEST_SOURCE_RIGHT_CLICK_REFACTOR"
  }, {
      no: 5,
      name: "COMMAND_REQUEST_SOURCE_SELECTION_HINT_CODE_LENS"
  }, {
      no: 6,
      name: "COMMAND_REQUEST_SOURCE_LINE_HINT_CODE_LENS"
  }, {
      no: 7,
      name: "COMMAND_REQUEST_SOURCE_PLAN"
  }, {
      no: 8,
      name: "COMMAND_REQUEST_SOURCE_FOLLOWUP"
  }, {
      no: 9,
      name: "COMMAND_REQUEST_SOURCE_PASTE_AND_TRANSLATE"
  }, {
      no: 10,
      name: "COMMAND_REQUEST_SOURCE_SUPERCOMPLETE"
  }, {
      no: 11,
      name: "COMMAND_REQUEST_SOURCE_FUNCTION_DOCSTRING"
  }, {
      no: 12,
      name: "COMMAND_REQUEST_SOURCE_FAST_APPLY"
  }, {
      no: 13,
      name: "COMMAND_REQUEST_SOURCE_TERMINAL"
  }, {
      no: 14,
      name: "COMMAND_REQUEST_SOURCE_TAB_JUMP"
  }]),
  function(e) {
      e[e.UNSPECIFIED = 0] = "UNSPECIFIED",
      e[e.ERROR = 1] = "ERROR",
      e[e.WARNING = 2] = "WARNING",
      e[e.INFO = 3] = "INFO",
      e[e.DEBUG = 4] = "DEBUG"
  }(Ot || (Ot = {})),
  Le.util.setEnumType(Ot, "exa.codeium_common_pb.StatusLevel", [{
      no: 0,
      name: "STATUS_LEVEL_UNSPECIFIED"
  }, {
      no: 1,
      name: "STATUS_LEVEL_ERROR"
  }, {
      no: 2,
      name: "STATUS_LEVEL_WARNING"
  }, {
      no: 3,
      name: "STATUS_LEVEL_INFO"
  }, {
      no: 4,
      name: "STATUS_LEVEL_DEBUG"
  }]),
  function(e) {
      e[e.UNSPECIFIED = 0] = "UNSPECIFIED",
      e[e.OVERALL = 1] = "OVERALL",
      e[e.ACTION_PREPARE = 2] = "ACTION_PREPARE",
      e[e.ACTION_APPLY = 3] = "ACTION_APPLY"
  }(yt || (yt = {})),
  Le.util.setEnumType(yt, "exa.codeium_common_pb.CortexErrorCategory", [{
      no: 0,
      name: "CORTEX_ERROR_CATEGORY_UNSPECIFIED"
  }, {
      no: 1,
      name: "CORTEX_ERROR_CATEGORY_OVERALL"
  }, {
      no: 2,
      name: "CORTEX_ERROR_CATEGORY_ACTION_PREPARE"
  }, {
      no: 3,
      name: "CORTEX_ERROR_CATEGORY_ACTION_APPLY"
  }]),
  function(e) {
      e[e.UNSPECIFIED = 0] = "UNSPECIFIED",
      e[e.OVERALL = 1] = "OVERALL",
      e[e.LAST_AUTOCOMPLETE_USAGE_TIME = 2] = "LAST_AUTOCOMPLETE_USAGE_TIME",
      e[e.LAST_CHAT_USAGE_TIME = 3] = "LAST_CHAT_USAGE_TIME",
      e[e.LAST_COMMAND_USAGE_TIME = 4] = "LAST_COMMAND_USAGE_TIME"
  }(wt || (wt = {})),
  Le.util.setEnumType(wt, "exa.codeium_common_pb.LastUpdateType", [{
      no: 0,
      name: "LAST_UPDATE_TYPE_UNSPECIFIED"
  }, {
      no: 1,
      name: "LAST_UPDATE_TYPE_OVERALL"
  }, {
      no: 2,
      name: "LAST_UPDATE_TYPE_LAST_AUTOCOMPLETE_USAGE_TIME"
  }, {
      no: 3,
      name: "LAST_UPDATE_TYPE_LAST_CHAT_USAGE_TIME"
  }, {
      no: 4,
      name: "LAST_UPDATE_TYPE_LAST_COMMAND_USAGE_TIME"
  }]),
  function(e) {
      e[e.UNSPECIFIED = 0] = "UNSPECIFIED",
      e[e.AUTOCOMPLETE = 1] = "AUTOCOMPLETE",
      e[e.COMMAND = 2] = "COMMAND",
      e[e.CHAT = 3] = "CHAT"
  }(At || (At = {})),
  Le.util.setEnumType(At, "exa.codeium_common_pb.OnboardingActionType", [{
      no: 0,
      name: "ONBOARDING_ACTION_TYPE_UNSPECIFIED"
  }, {
      no: 1,
      name: "ONBOARDING_ACTION_TYPE_AUTOCOMPLETE"
  }, {
      no: 2,
      name: "ONBOARDING_ACTION_TYPE_COMMAND"
  }, {
      no: 3,
      name: "ONBOARDING_ACTION_TYPE_CHAT"
  }]),
  function(e) {
      e[e.UNSPECIFIED = 0] = "UNSPECIFIED",
      e[e.AUTOCOMPLETE_ACCEPT = 1] = "AUTOCOMPLETE_ACCEPT",
      e[e.CURSOR_LINE_NAVIGATION = 2] = "CURSOR_LINE_NAVIGATION",
      e[e.TYPING = 3] = "TYPING",
      e[e.FORCED = 4] = "FORCED"
  }(Pt || (Pt = {})),
  Le.util.setEnumType(Pt, "exa.codeium_common_pb.SupercompleteTriggerCondition", [{
      no: 0,
      name: "SUPERCOMPLETE_TRIGGER_CONDITION_UNSPECIFIED"
  }, {
      no: 1,
      name: "SUPERCOMPLETE_TRIGGER_CONDITION_AUTOCOMPLETE_ACCEPT"
  }, {
      no: 2,
      name: "SUPERCOMPLETE_TRIGGER_CONDITION_CURSOR_LINE_NAVIGATION"
  }, {
      no: 3,
      name: "SUPERCOMPLETE_TRIGGER_CONDITION_TYPING"
  }, {
      no: 4,
      name: "SUPERCOMPLETE_TRIGGER_CONDITION_FORCED"
  }]),
  function(e) {
      e[e.EVENT_UNSPECIFIED = 0] = "EVENT_UNSPECIFIED",
      e[e.WINDSURF_EXTENSION_ACTIVATED = 32] = "WINDSURF_EXTENSION_ACTIVATED",
      e[e.LS_DOWNLOAD_START = 1] = "LS_DOWNLOAD_START",
      e[e.LS_DOWNLOAD_COMPLETE = 2] = "LS_DOWNLOAD_COMPLETE",
      e[e.LS_DOWNLOAD_FAILURE = 5] = "LS_DOWNLOAD_FAILURE",
      e[e.LS_STARTUP = 3] = "LS_STARTUP",
      e[e.LS_FAILURE = 4] = "LS_FAILURE",
      e[e.AUTOCOMPLETE_ACCEPTED = 6] = "AUTOCOMPLETE_ACCEPTED",
      e[e.AUTOCOMPLETE_ONE_WORD_ACCEPTED = 7] = "AUTOCOMPLETE_ONE_WORD_ACCEPTED",
      e[e.CHAT_MESSAGE_SENT = 8] = "CHAT_MESSAGE_SENT",
      e[e.CHAT_MENTION_INSERT = 13] = "CHAT_MENTION_INSERT",
      e[e.CHAT_MENTION_MENU_OPEN = 19] = "CHAT_MENTION_MENU_OPEN",
      e[e.CHAT_OPEN_SETTINGS = 14] = "CHAT_OPEN_SETTINGS",
      e[e.CHAT_OPEN_CONTEXT_SETTINGS = 15] = "CHAT_OPEN_CONTEXT_SETTINGS",
      e[e.CHAT_WITH_CODEBASE = 16] = "CHAT_WITH_CODEBASE",
      e[e.CHAT_NEW_CONVERSATION = 17] = "CHAT_NEW_CONVERSATION",
      e[e.CHAT_CHANGE_MODEL = 18] = "CHAT_CHANGE_MODEL",
      e[e.CHAT_TOGGLE_FOCUS_INSERT_TEXT = 34] = "CHAT_TOGGLE_FOCUS_INSERT_TEXT",
      e[e.FUNCTION_REFACTOR = 28] = "FUNCTION_REFACTOR",
      e[e.EXPLAIN_CODE_BLOCK = 29] = "EXPLAIN_CODE_BLOCK",
      e[e.FUNCTION_ADD_DOCSTRING = 30] = "FUNCTION_ADD_DOCSTRING",
      e[e.EXPLAIN_PROBLEM = 31] = "EXPLAIN_PROBLEM",
      e[e.COMMAND_BOX_OPENED = 9] = "COMMAND_BOX_OPENED",
      e[e.COMMAND_SUBMITTED = 10] = "COMMAND_SUBMITTED",
      e[e.COMMAND_ACCEPTED = 11] = "COMMAND_ACCEPTED",
      e[e.COMMAND_REJECTED = 12] = "COMMAND_REJECTED",
      e[e.WS_ONBOARDING_LANDING_PAGE_OPENED = 20] = "WS_ONBOARDING_LANDING_PAGE_OPENED",
      e[e.WS_ONBOARDING_SETUP_PAGE_OPENED = 21] = "WS_ONBOARDING_SETUP_PAGE_OPENED",
      e[e.WS_ONBOARDING_KEYBINDINGS_PAGE_OPENED = 22] = "WS_ONBOARDING_KEYBINDINGS_PAGE_OPENED",
      e[e.WS_ONBOARDING_MIGRATION_SCOPE_PAGE_OPENED = 23] = "WS_ONBOARDING_MIGRATION_SCOPE_PAGE_OPENED",
      e[e.WS_ONBOARDING_IMPORT_PAGE_OPENED = 24] = "WS_ONBOARDING_IMPORT_PAGE_OPENED",
      e[e.WS_ONBOARDING_AUTH_PAGE_OPENED = 25] = "WS_ONBOARDING_AUTH_PAGE_OPENED",
      e[e.WS_ONBOARDING_AUTH_MANUAL_PAGE_OPENED = 26] = "WS_ONBOARDING_AUTH_MANUAL_PAGE_OPENED",
      e[e.WS_ONBOARDING_CHOOSE_THEME_PAGE_OPENED = 35] = "WS_ONBOARDING_CHOOSE_THEME_PAGE_OPENED",
      e[e.WS_ONBOARDING_COMPLETED = 27] = "WS_ONBOARDING_COMPLETED",
      e[e.PROVIDE_FEEDBACK = 33] = "PROVIDE_FEEDBACK",
      e[e.CASCADE_MESSAGE_SENT = 36] = "CASCADE_MESSAGE_SENT"
  }(Lt || (Lt = {})),
  Le.util.setEnumType(Lt, "exa.codeium_common_pb.ProductEventType", [{
      no: 0,
      name: "EVENT_UNSPECIFIED"
  }, {
      no: 32,
      name: "WINDSURF_EXTENSION_ACTIVATED"
  }, {
      no: 1,
      name: "LS_DOWNLOAD_START"
  }, {
      no: 2,
      name: "LS_DOWNLOAD_COMPLETE"
  }, {
      no: 5,
      name: "LS_DOWNLOAD_FAILURE"
  }, {
      no: 3,
      name: "LS_STARTUP"
  }, {
      no: 4,
      name: "LS_FAILURE"
  }, {
      no: 6,
      name: "AUTOCOMPLETE_ACCEPTED"
  }, {
      no: 7,
      name: "AUTOCOMPLETE_ONE_WORD_ACCEPTED"
  }, {
      no: 8,
      name: "CHAT_MESSAGE_SENT"
  }, {
      no: 13,
      name: "CHAT_MENTION_INSERT"
  }, {
      no: 19,
      name: "CHAT_MENTION_MENU_OPEN"
  }, {
      no: 14,
      name: "CHAT_OPEN_SETTINGS"
  }, {
      no: 15,
      name: "CHAT_OPEN_CONTEXT_SETTINGS"
  }, {
      no: 16,
      name: "CHAT_WITH_CODEBASE"
  }, {
      no: 17,
      name: "CHAT_NEW_CONVERSATION"
  }, {
      no: 18,
      name: "CHAT_CHANGE_MODEL"
  }, {
      no: 34,
      name: "CHAT_TOGGLE_FOCUS_INSERT_TEXT"
  }, {
      no: 28,
      name: "FUNCTION_REFACTOR"
  }, {
      no: 29,
      name: "EXPLAIN_CODE_BLOCK"
  }, {
      no: 30,
      name: "FUNCTION_ADD_DOCSTRING"
  }, {
      no: 31,
      name: "EXPLAIN_PROBLEM"
  }, {
      no: 9,
      name: "COMMAND_BOX_OPENED"
  }, {
      no: 10,
      name: "COMMAND_SUBMITTED"
  }, {
      no: 11,
      name: "COMMAND_ACCEPTED"
  }, {
      no: 12,
      name: "COMMAND_REJECTED"
  }, {
      no: 20,
      name: "WS_ONBOARDING_LANDING_PAGE_OPENED"
  }, {
      no: 21,
      name: "WS_ONBOARDING_SETUP_PAGE_OPENED"
  }, {
      no: 22,
      name: "WS_ONBOARDING_KEYBINDINGS_PAGE_OPENED"
  }, {
      no: 23,
      name: "WS_ONBOARDING_MIGRATION_SCOPE_PAGE_OPENED"
  }, {
      no: 24,
      name: "WS_ONBOARDING_IMPORT_PAGE_OPENED"
  }, {
      no: 25,
      name: "WS_ONBOARDING_AUTH_PAGE_OPENED"
  }, {
      no: 26,
      name: "WS_ONBOARDING_AUTH_MANUAL_PAGE_OPENED"
  }, {
      no: 35,
      name: "WS_ONBOARDING_CHOOSE_THEME_PAGE_OPENED"
  }, {
      no: 27,
      name: "WS_ONBOARDING_COMPLETED"
  }, {
      no: 33,
      name: "PROVIDE_FEEDBACK"
  }, {
      no: 36,
      name: "CASCADE_MESSAGE_SENT"
  }]),
  function(e) {
      e[e.UNSPECIFIED = 0] = "UNSPECIFIED",
      e[e.GITHUB_BASE = 1] = "GITHUB_BASE",
      e[e.SLACK_BASE = 2] = "SLACK_BASE",
      e[e.SLACK_AGGREGATE = 3] = "SLACK_AGGREGATE",
      e[e.GOOGLE_DRIVE_BASE = 4] = "GOOGLE_DRIVE_BASE",
      e[e.JIRA_BASE = 5] = "JIRA_BASE"
  }(Rt || (Rt = {})),
  Le.util.setEnumType(Rt, "exa.codeium_common_pb.IndexChoice", [{
      no: 0,
      name: "INDEX_CHOICE_UNSPECIFIED"
  }, {
      no: 1,
      name: "INDEX_CHOICE_GITHUB_BASE"
  }, {
      no: 2,
      name: "INDEX_CHOICE_SLACK_BASE"
  }, {
      no: 3,
      name: "INDEX_CHOICE_SLACK_AGGREGATE"
  }, {
      no: 4,
      name: "INDEX_CHOICE_GOOGLE_DRIVE_BASE"
  }, {
      no: 5,
      name: "INDEX_CHOICE_JIRA_BASE"
  }]);
  class kt extends d {
      prompt = "";
      contextPrompt = "";
      promptElementRanges = [];
      promptElementKindInfos = [];
      promptLatencyMs = y.zero;
      promptStageLatencies = [];
      numTokenizedBytes = y.zero;
      editorLanguage = "";
      language = Qe.UNSPECIFIED;
      absolutePathUriForTelemetry = "";
      relativePathForTelemetry = "";
      workspaceUriForTelemetry = "";
      experimentFeaturesJson = "";
      experimentVariantJson = "";
      model = Fe.MODEL_UNSPECIFIED;
      hasLineSuffix = !1;
      shouldInlineFim = !1;
      modelTag = "";
      experimentTags = [];
      evalSuffix = "";
      promptAnnotationRanges = [];
      supportsPackedStreamingCompletionMaps = !1;
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.codeium_common_pb.CompletionsRequest";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "configuration",
          kind: "message",
          T: Jt
      }, {
          no: 2,
          name: "prompt",
          kind: "scalar",
          T: 9
      }, {
          no: 21,
          name: "context_prompt",
          kind: "scalar",
          T: 9
      }, {
          no: 8,
          name: "prompt_element_ranges",
          kind: "message",
          T: Dt,
          repeated: !0
      }, {
          no: 9,
          name: "prompt_element_kind_infos",
          kind: "message",
          T: vt,
          repeated: !0
      }, {
          no: 11,
          name: "prompt_latency_ms",
          kind: "scalar",
          T: 4
      }, {
          no: 12,
          name: "prompt_stage_latencies",
          kind: "message",
          T: Vt,
          repeated: !0
      }, {
          no: 20,
          name: "num_tokenized_bytes",
          kind: "scalar",
          T: 4
      }, {
          no: 3,
          name: "editor_language",
          kind: "scalar",
          T: 9
      }, {
          no: 4,
          name: "language",
          kind: "enum",
          T: Le.getEnumType(Qe)
      }, {
          no: 5,
          name: "absolute_path_uri_for_telemetry",
          kind: "scalar",
          T: 9
      }, {
          no: 6,
          name: "relative_path_for_telemetry",
          kind: "scalar",
          T: 9
      }, {
          no: 13,
          name: "workspace_uri_for_telemetry",
          kind: "scalar",
          T: 9
      }, {
          no: 7,
          name: "experiment_features_json",
          kind: "scalar",
          T: 9
      }, {
          no: 19,
          name: "experiment_variant_json",
          kind: "scalar",
          T: 9
      }, {
          no: 10,
          name: "model",
          kind: "enum",
          T: Le.getEnumType(Fe)
      }, {
          no: 14,
          name: "has_line_suffix",
          kind: "scalar",
          T: 8
      }, {
          no: 15,
          name: "should_inline_fim",
          kind: "scalar",
          T: 8
      }, {
          no: 16,
          name: "repository",
          kind: "message",
          T: An
      }, {
          no: 17,
          name: "model_tag",
          kind: "scalar",
          T: 9
      }, {
          no: 18,
          name: "experiment_tags",
          kind: "scalar",
          T: 9,
          repeated: !0
      }, {
          no: 22,
          name: "eval_suffix",
          kind: "scalar",
          T: 9
      }, {
          no: 23,
          name: "prompt_annotation_ranges",
          kind: "message",
          T: xt,
          repeated: !0
      }, {
          no: 24,
          name: "supports_packed_streaming_completion_maps",
          kind: "scalar",
          T: 8
      }]));
      static fromBinary(e, t) {
          return (new kt).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new kt).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new kt).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(kt, e, t)
      }
  }
  class Jt extends d {
      numCompletions = y.zero;
      maxTokens = y.zero;
      maxNewlines = y.zero;
      minLogProbability = 0;
      temperature = 0;
      firstTemperature = 0;
      topK = y.zero;
      topP = 0;
      stopPatterns = [];
      seed = y.zero;
      fimEotProbThreshold = 0;
      useFimEotThreshold = !1;
      doNotScoreStopTokens = !1;
      sqrtLenNormalizedLogProbScore = !1;
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.codeium_common_pb.CompletionConfiguration";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "num_completions",
          kind: "scalar",
          T: 4
      }, {
          no: 2,
          name: "max_tokens",
          kind: "scalar",
          T: 4
      }, {
          no: 3,
          name: "max_newlines",
          kind: "scalar",
          T: 4
      }, {
          no: 4,
          name: "min_log_probability",
          kind: "scalar",
          T: 1
      }, {
          no: 5,
          name: "temperature",
          kind: "scalar",
          T: 1
      }, {
          no: 6,
          name: "first_temperature",
          kind: "scalar",
          T: 1
      }, {
          no: 7,
          name: "top_k",
          kind: "scalar",
          T: 4
      }, {
          no: 8,
          name: "top_p",
          kind: "scalar",
          T: 1
      }, {
          no: 9,
          name: "stop_patterns",
          kind: "scalar",
          T: 9,
          repeated: !0
      }, {
          no: 10,
          name: "seed",
          kind: "scalar",
          T: 4
      }, {
          no: 11,
          name: "fim_eot_prob_threshold",
          kind: "scalar",
          T: 1
      }, {
          no: 12,
          name: "use_fim_eot_threshold",
          kind: "scalar",
          T: 8
      }, {
          no: 13,
          name: "do_not_score_stop_tokens",
          kind: "scalar",
          T: 8
      }, {
          no: 14,
          name: "sqrt_len_normalized_log_prob_score",
          kind: "scalar",
          T: 8
      }]));
      static fromBinary(e, t) {
          return (new Jt).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new Jt).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new Jt).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(Jt, e, t)
      }
  }
  class Dt extends d {
      kind = xe.UNSPECIFIED;
      byteOffsetStart = y.zero;
      byteOffsetEnd = y.zero;
      tokenOffsetStart = y.zero;
      tokenOffsetEnd = y.zero;
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.codeium_common_pb.PromptElementRange";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "kind",
          kind: "enum",
          T: Le.getEnumType(xe)
      }, {
          no: 2,
          name: "byte_offset_start",
          kind: "scalar",
          T: 4
      }, {
          no: 3,
          name: "byte_offset_end",
          kind: "scalar",
          T: 4
      }, {
          no: 4,
          name: "token_offset_start",
          kind: "scalar",
          T: 4
      }, {
          no: 5,
          name: "token_offset_end",
          kind: "scalar",
          T: 4
      }]));
      static fromBinary(e, t) {
          return (new Dt).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new Dt).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new Dt).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(Dt, e, t)
      }
  }
  class ht extends d {
      cortexPlanId = "";
      codePlanId = "";
      actionIndex = 0;
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.codeium_common_pb.ActionPointer";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "cortex_plan_id",
          kind: "scalar",
          T: 9
      }, {
          no: 2,
          name: "code_plan_id",
          kind: "scalar",
          T: 9
      }, {
          no: 3,
          name: "action_index",
          kind: "scalar",
          T: 5
      }]));
      static fromBinary(e, t) {
          return (new ht).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new ht).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new ht).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(ht, e, t)
      }
  }
  class xt extends d {
      kind = Ue.UNSPECIFIED;
      byteOffsetStart = y.zero;
      byteOffsetEnd = y.zero;
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.codeium_common_pb.PromptAnnotationRange";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "kind",
          kind: "enum",
          T: Le.getEnumType(Ue)
      }, {
          no: 2,
          name: "byte_offset_start",
          kind: "scalar",
          T: 4
      }, {
          no: 3,
          name: "byte_offset_end",
          kind: "scalar",
          T: 4
      }]));
      static fromBinary(e, t) {
          return (new xt).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new xt).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new xt).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(xt, e, t)
      }
  }
  class Ut extends d {
      key = Me.UNSPECIFIED;
      keyString = "";
      disabled = !1;
      payload = {
          case: void 0
      };
      source = Be.UNSPECIFIED;
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.codeium_common_pb.ExperimentWithVariant";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "key",
          kind: "enum",
          T: Le.getEnumType(Me)
      }, {
          no: 5,
          name: "key_string",
          kind: "scalar",
          T: 9
      }, {
          no: 6,
          name: "disabled",
          kind: "scalar",
          T: 8
      }, {
          no: 2,
          name: "string",
          kind: "scalar",
          T: 9,
          oneof: "payload"
      }, {
          no: 3,
          name: "json",
          kind: "scalar",
          T: 9,
          oneof: "payload"
      }, {
          no: 4,
          name: "csv",
          kind: "scalar",
          T: 9,
          oneof: "payload"
      }, {
          no: 7,
          name: "source",
          kind: "enum",
          T: Le.getEnumType(Be)
      }]));
      static fromBinary(e, t) {
          return (new Ut).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new Ut).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new Ut).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(Ut, e, t)
      }
  }
  class Mt extends d {
      experiments = [];
      forceEnableExperiments = [];
      forceDisableExperiments = [];
      forceEnableExperimentsWithVariants = [];
      forceEnableExperimentStrings = [];
      forceDisableExperimentStrings = [];
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.codeium_common_pb.ExperimentConfig";
      static fields = Le.util.newFieldList(( () => [{
          no: 6,
          name: "experiments",
          kind: "message",
          T: Ut,
          repeated: !0
      }, {
          no: 1,
          name: "force_enable_experiments",
          kind: "enum",
          T: Le.getEnumType(Me),
          repeated: !0
      }, {
          no: 2,
          name: "force_disable_experiments",
          kind: "enum",
          T: Le.getEnumType(Me),
          repeated: !0
      }, {
          no: 3,
          name: "force_enable_experiments_with_variants",
          kind: "message",
          T: Ut,
          repeated: !0
      }, {
          no: 4,
          name: "force_enable_experiment_strings",
          kind: "scalar",
          T: 9,
          repeated: !0
      }, {
          no: 5,
          name: "force_disable_experiment_strings",
          kind: "scalar",
          T: 9,
          repeated: !0
      }]));
      static fromBinary(e, t) {
          return (new Mt).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new Mt).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new Mt).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(Mt, e, t)
      }
  }
  class Bt extends (null) {
      sha = "";
      crc32cLinuxX64 = "";
      crc32cLinuxArm = "";
      crc32cMacosX64 = "";
      crc32cMacosArm = "";
      crc32cWindowsX64 = "";
      constructor(e) {
          super(),
          proto3.util.initPartial(e, this)
      }
      static runtime = null;
      static typeName = null;
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "sha",
          kind: "scalar",
          T: 9
      }, {
          no: 2,
          name: "crc32c_linux_x64",
          kind: "scalar",
          T: 9
      }, {
          no: 3,
          name: "crc32c_linux_arm",
          kind: "scalar",
          T: 9
      }, {
          no: 4,
          name: "crc32c_macos_x64",
          kind: "scalar",
          T: 9
      }, {
          no: 5,
          name: "crc32c_macos_arm",
          kind: "scalar",
          T: 9
      }, {
          no: 6,
          name: "crc32c_windows_x64",
          kind: "scalar",
          T: 9
      }]));
      static fromBinary(e, t) {
          return (new Bt).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new Bt).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new Bt).fromJsonString(e, t)
      }
      static equals(e, t) {
          return proto3.util.equals(Bt, e, t)
      }
  }
  class Ft extends (null) {
      modelName = "";
      contextCheckModelName = "";
      constructor(e) {
          super(),
          proto3.util.initPartial(e, this)
      }
      static runtime = null;
      static typeName = null;
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "model_name",
          kind: "scalar",
          T: 9
      }, {
          no: 2,
          name: "context_check_model_name",
          kind: "scalar",
          T: 9
      }]));
      static fromBinary(e, t) {
          return (new Ft).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new Ft).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new Ft).fromJsonString(e, t)
      }
      static equals(e, t) {
          return proto3.util.equals(Ft, e, t)
      }
  }
  class bt extends (null) {
      modeToken = "";
      constructor(e) {
          super(),
          proto3.util.initPartial(e, this)
      }
      static runtime = null;
      static typeName = null;
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "mode_token",
          kind: "scalar",
          T: 9
      }]));
      static fromBinary(e, t) {
          return (new bt).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new bt).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new bt).fromJsonString(e, t)
      }
      static equals(e, t) {
          return proto3.util.equals(bt, e, t)
      }
  }
  class qt extends (null) {
      threshold = 0;
      constructor(e) {
          super(),
          proto3.util.initPartial(e, this)
      }
      static runtime = null;
      static typeName = null;
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "threshold",
          kind: "scalar",
          T: 2
      }]));
      static fromBinary(e, t) {
          return (new qt).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new qt).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new qt).fromJsonString(e, t)
      }
      static equals(e, t) {
          return proto3.util.equals(qt, e, t)
      }
  }
  class Gt extends (null) {
      dsnToSampleRate = {};
      constructor(e) {
          super(),
          proto3.util.initPartial(e, this)
      }
      static runtime = null;
      static typeName = null;
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "dsn_to_sample_rate",
          kind: "map",
          K: 9,
          V: {
              kind: "scalar",
              T: 1
          }
      }]));
      static fromBinary(e, t) {
          return (new Gt).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new Gt).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new Gt).fromJsonString(e, t)
      }
      static equals(e, t) {
          return proto3.util.equals(Gt, e, t)
      }
  }
  class vt extends d {
      kind = xe.UNSPECIFIED;
      experimentKey = Me.UNSPECIFIED;
      enabled = !1;
      numConsidered = y.zero;
      numIncluded = y.zero;
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.codeium_common_pb.PromptElementKindInfo";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "kind",
          kind: "enum",
          T: Le.getEnumType(xe)
      }, {
          no: 2,
          name: "experiment_key",
          kind: "enum",
          T: Le.getEnumType(Me)
      }, {
          no: 3,
          name: "enabled",
          kind: "scalar",
          T: 8
      }, {
          no: 4,
          name: "num_considered",
          kind: "scalar",
          T: 4
      }, {
          no: 5,
          name: "num_included",
          kind: "scalar",
          T: 4
      }]));
      static fromBinary(e, t) {
          return (new vt).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new vt).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new vt).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(vt, e, t)
      }
  }
  class Ht extends (null) {
      included = !1;
      exclusionReason = be.EXCLUSION_UNSPECIFIED;
      constructor(e) {
          super(),
          proto3.util.initPartial(e, this)
      }
      static runtime = null;
      static typeName = null;
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "included",
          kind: "scalar",
          T: 8
      }, {
          no: 2,
          name: "exclusion_reason",
          kind: "enum",
          T: Le.getEnumType(be)
      }]));
      static fromBinary(e, t) {
          return (new Ht).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new Ht).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new Ht).fromJsonString(e, t)
      }
      static equals(e, t) {
          return proto3.util.equals(Ht, e, t)
      }
  }
  class Vt extends d {
      name = "";
      latencyMs = y.zero;
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.codeium_common_pb.PromptStageLatency";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "name",
          kind: "scalar",
          T: 9
      }, {
          no: 2,
          name: "latency_ms",
          kind: "scalar",
          T: 4
      }]));
      static fromBinary(e, t) {
          return (new Vt).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new Vt).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new Vt).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(Vt, e, t)
      }
  }
  class Xt extends (null) {
      completions = [];
      maxTokens = protoInt64.zero;
      temperature = 0;
      topK = protoInt64.zero;
      topP = 0;
      stopPatterns = [];
      promptLength = protoInt64.zero;
      promptId = "";
      modelTag = "";
      constructor(e) {
          super(),
          proto3.util.initPartial(e, this)
      }
      static runtime = null;
      static typeName = null;
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "completions",
          kind: "message",
          T: Yt,
          repeated: !0
      }, {
          no: 2,
          name: "max_tokens",
          kind: "scalar",
          T: 4
      }, {
          no: 3,
          name: "temperature",
          kind: "scalar",
          T: 1
      }, {
          no: 4,
          name: "top_k",
          kind: "scalar",
          T: 4
      }, {
          no: 5,
          name: "top_p",
          kind: "scalar",
          T: 1
      }, {
          no: 6,
          name: "stop_patterns",
          kind: "scalar",
          T: 9,
          repeated: !0
      }, {
          no: 7,
          name: "prompt_length",
          kind: "scalar",
          T: 4
      }, {
          no: 8,
          name: "prompt_id",
          kind: "scalar",
          T: 9
      }, {
          no: 10,
          name: "model_tag",
          kind: "scalar",
          T: 9
      }]));
      static fromBinary(e, t) {
          return (new Xt).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new Xt).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new Xt).fromJsonString(e, t)
      }
      static equals(e, t) {
          return proto3.util.equals(Xt, e, t)
      }
  }
  class Yt extends d {
      completionId = "";
      text = "";
      stop = "";
      score = 0;
      tokens = [];
      decodedTokens = [];
      probabilities = [];
      adjustedProbabilities = [];
      generatedLength = y.zero;
      stopReason = qe.UNSPECIFIED;
      filterReasons = [];
      originalText = "";
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.codeium_common_pb.Completion";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "completion_id",
          kind: "scalar",
          T: 9
      }, {
          no: 2,
          name: "text",
          kind: "scalar",
          T: 9
      }, {
          no: 4,
          name: "stop",
          kind: "scalar",
          T: 9
      }, {
          no: 5,
          name: "score",
          kind: "scalar",
          T: 1
      }, {
          no: 6,
          name: "tokens",
          kind: "scalar",
          T: 4,
          repeated: !0
      }, {
          no: 7,
          name: "decoded_tokens",
          kind: "scalar",
          T: 9,
          repeated: !0
      }, {
          no: 8,
          name: "probabilities",
          kind: "scalar",
          T: 1,
          repeated: !0
      }, {
          no: 9,
          name: "adjusted_probabilities",
          kind: "scalar",
          T: 1,
          repeated: !0
      }, {
          no: 10,
          name: "generated_length",
          kind: "scalar",
          T: 4
      }, {
          no: 12,
          name: "stop_reason",
          kind: "enum",
          T: Le.getEnumType(qe)
      }, {
          no: 13,
          name: "filter_reasons",
          kind: "enum",
          T: Le.getEnumType(Ge),
          repeated: !0
      }, {
          no: 14,
          name: "original_text",
          kind: "scalar",
          T: 9
      }]));
      static fromBinary(e, t) {
          return (new Yt).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new Yt).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new Yt).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(Yt, e, t)
      }
  }
  class Kt extends d {
      completionIds = [];
      maxTokens = y.zero;
      temperature = 0;
      topK = y.zero;
      topP = 0;
      stopPatterns = [];
      promptLength = y.zero;
      promptId = "";
      modelTag = "";
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.codeium_common_pb.StreamingCompletionInfo";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "completion_ids",
          kind: "scalar",
          T: 9,
          repeated: !0
      }, {
          no: 2,
          name: "max_tokens",
          kind: "scalar",
          T: 4
      }, {
          no: 3,
          name: "temperature",
          kind: "scalar",
          T: 1
      }, {
          no: 4,
          name: "top_k",
          kind: "scalar",
          T: 4
      }, {
          no: 5,
          name: "top_p",
          kind: "scalar",
          T: 1
      }, {
          no: 6,
          name: "stop_patterns",
          kind: "scalar",
          T: 9,
          repeated: !0
      }, {
          no: 7,
          name: "prompt_length",
          kind: "scalar",
          T: 4
      }, {
          no: 9,
          name: "prompt_id",
          kind: "scalar",
          T: 9
      }, {
          no: 8,
          name: "model_tag",
          kind: "scalar",
          T: 9
      }, {
          no: 10,
          name: "completions_request",
          kind: "message",
          T: kt
      }, {
          no: 11,
          name: "eval_suffix_info",
          kind: "message",
          T: $t
      }]));
      static fromBinary(e, t) {
          return (new Kt).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new Kt).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new Kt).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(Kt, e, t)
      }
  }
  class Wt extends d {
      decodedToken = new Uint8Array(0);
      token = y.zero;
      probability = 0;
      adjustedProbability = 0;
      completionFinished = !1;
      stop = "";
      stopReason = qe.UNSPECIFIED;
      attributionStatuses = {};
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.codeium_common_pb.StreamingCompletion";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "decoded_token",
          kind: "scalar",
          T: 12
      }, {
          no: 2,
          name: "token",
          kind: "scalar",
          T: 4
      }, {
          no: 3,
          name: "probability",
          kind: "scalar",
          T: 1
      }, {
          no: 4,
          name: "adjusted_probability",
          kind: "scalar",
          T: 1
      }, {
          no: 5,
          name: "completion_finished",
          kind: "scalar",
          T: 8
      }, {
          no: 6,
          name: "stop",
          kind: "scalar",
          T: 9
      }, {
          no: 7,
          name: "stop_reason",
          kind: "enum",
          T: Le.getEnumType(qe)
      }, {
          no: 8,
          name: "attribution_statuses",
          kind: "map",
          K: 13,
          V: {
              kind: "enum",
              T: Le.getEnumType(ve)
          }
      }]));
      static fromBinary(e, t) {
          return (new Wt).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new Wt).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new Wt).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(Wt, e, t)
      }
  }
  class zt extends d {
      completions = {};
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.codeium_common_pb.StreamingCompletionMap";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "completions",
          kind: "map",
          K: 5,
          V: {
              kind: "message",
              T: Wt
          }
      }]));
      static fromBinary(e, t) {
          return (new zt).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new zt).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new zt).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(zt, e, t)
      }
  }
  class jt extends d {
      completionMaps = [];
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.codeium_common_pb.PackedStreamingCompletionMaps";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "completion_maps",
          kind: "message",
          T: zt,
          repeated: !0
      }]));
      static fromBinary(e, t) {
          return (new jt).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new jt).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new jt).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(jt, e, t)
      }
  }
  class $t extends d {
      perTokenLogLikelihoods = [];
      isGreedy = !1;
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.codeium_common_pb.StreamingEvalSuffixInfo";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "per_token_log_likelihoods",
          kind: "scalar",
          T: 2,
          repeated: !0
      }, {
          no: 2,
          name: "is_greedy",
          kind: "scalar",
          T: 8
      }]));
      static fromBinary(e, t) {
          return (new $t).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new $t).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new $t).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals($t, e, t)
      }
  }
  class Qt extends (null) {
      payload = {
          case: void 0
      };
      constructor(e) {
          super(),
          proto3.util.initPartial(e, this)
      }
      static runtime = null;
      static typeName = null;
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "completion_info",
          kind: "message",
          T: Kt,
          oneof: "payload"
      }, {
          no: 2,
          name: "completion_map",
          kind: "message",
          T: zt,
          oneof: "payload"
      }, {
          no: 4,
          name: "packed_completion_maps",
          kind: "message",
          T: jt,
          oneof: "payload"
      }]));
      static fromBinary(e, t) {
          return (new Qt).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new Qt).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new Qt).fromJsonString(e, t)
      }
      static equals(e, t) {
          return proto3.util.equals(Qt, e, t)
      }
  }
  class Zt extends d {
      apiServerLatencyMs = y.zero;
      languageServerLatencyMs = y.zero;
      networkLatencyMs = y.zero;
      apiServerFirstByteLatencyMs = y.zero;
      languageServerFirstByteLatencyMs = y.zero;
      networkFirstByteLatencyMs = y.zero;
      apiServerFirstLineLatencyMs = y.zero;
      languageServerFirstLineLatencyMs = y.zero;
      networkFirstLineLatencyMs = y.zero;
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.codeium_common_pb.CompletionLatencyInfo";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "api_server_latency_ms",
          kind: "scalar",
          T: 4
      }, {
          no: 2,
          name: "language_server_latency_ms",
          kind: "scalar",
          T: 4
      }, {
          no: 3,
          name: "network_latency_ms",
          kind: "scalar",
          T: 4
      }, {
          no: 4,
          name: "api_server_first_byte_latency_ms",
          kind: "scalar",
          T: 4
      }, {
          no: 5,
          name: "language_server_first_byte_latency_ms",
          kind: "scalar",
          T: 4
      }, {
          no: 6,
          name: "network_first_byte_latency_ms",
          kind: "scalar",
          T: 4
      }, {
          no: 7,
          name: "api_server_first_line_latency_ms",
          kind: "scalar",
          T: 4
      }, {
          no: 8,
          name: "language_server_first_line_latency_ms",
          kind: "scalar",
          T: 4
      }, {
          no: 9,
          name: "network_first_line_latency_ms",
          kind: "scalar",
          T: 4
      }]));
      static fromBinary(e, t) {
          return (new Zt).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new Zt).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new Zt).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(Zt, e, t)
      }
  }
  class en extends (null) {
      constructor(e) {
          super(),
          proto3.util.initPartial(e, this)
      }
      static runtime = null;
      static typeName = null;
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "completion",
          kind: "message",
          T: Yt
      }, {
          no: 2,
          name: "latency_info",
          kind: "message",
          T: Zt
      }]));
      static fromBinary(e, t) {
          return (new en).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new en).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new en).fromJsonString(e, t)
      }
      static equals(e, t) {
          return proto3.util.equals(en, e, t)
      }
  }
  class tn extends (null) {
      prompts = [];
      priority = He.UNSPECIFIED;
      prefix = Ve.UNSPECIFIED;
      model = Fe.MODEL_UNSPECIFIED;
      constructor(e) {
          super(),
          proto3.util.initPartial(e, this)
      }
      static runtime = null;
      static typeName = null;
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "prompts",
          kind: "scalar",
          T: 9,
          repeated: !0
      }, {
          no: 2,
          name: "priority",
          kind: "enum",
          T: Le.getEnumType(He)
      }, {
          no: 3,
          name: "prefix",
          kind: "enum",
          T: Le.getEnumType(Ve)
      }, {
          no: 4,
          name: "model",
          kind: "enum",
          T: Le.getEnumType(Fe)
      }]));
      static fromBinary(e, t) {
          return (new tn).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new tn).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new tn).fromJsonString(e, t)
      }
      static equals(e, t) {
          return proto3.util.equals(tn, e, t)
      }
  }
  class nn extends d {
      values = [];
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.codeium_common_pb.Embedding";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "values",
          kind: "scalar",
          T: 2,
          repeated: !0
      }]));
      static fromBinary(e, t) {
          return (new nn).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new nn).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new nn).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(nn, e, t)
      }
  }
  class rn extends (null) {
      embeddings = [];
      promptsExceededContextLength = !1;
      constructor(e) {
          super(),
          proto3.util.initPartial(e, this)
      }
      static runtime = null;
      static typeName = null;
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "embeddings",
          kind: "message",
          T: nn,
          repeated: !0
      }, {
          no: 2,
          name: "prompts_exceeded_context_length",
          kind: "scalar",
          T: 8
      }]));
      static fromBinary(e, t) {
          return (new rn).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new rn).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new rn).fromJsonString(e, t)
      }
      static equals(e, t) {
          return proto3.util.equals(rn, e, t)
      }
  }
  class an extends (null) {
      prefix = "";
      items = [];
      hasInstructTokens = !1;
      constructor(e) {
          super(),
          proto3.util.initPartial(e, this)
      }
      static runtime = null;
      static typeName = null;
      static fields = Le.util.newFieldList(( () => [{
          no: 2,
          name: "prefix",
          kind: "scalar",
          T: 9
      }, {
          no: 3,
          name: "items",
          kind: "scalar",
          T: 9,
          repeated: !0
      }, {
          no: 4,
          name: "has_instruct_tokens",
          kind: "scalar",
          T: 8
      }]));
      static fromBinary(e, t) {
          return (new an).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new an).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new an).fromJsonString(e, t)
      }
      static equals(e, t) {
          return proto3.util.equals(an, e, t)
      }
  }
  class sn extends (null) {
      values = [];
      promptsExceededContextLength = !1;
      constructor(e) {
          super(),
          proto3.util.initPartial(e, this)
      }
      static runtime = null;
      static typeName = null;
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "values",
          kind: "scalar",
          T: 2,
          repeated: !0
      }, {
          no: 2,
          name: "prompts_exceeded_context_length",
          kind: "scalar",
          T: 8
      }]));
      static fromBinary(e, t) {
          return (new sn).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new sn).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new sn).fromJsonString(e, t)
      }
      static equals(e, t) {
          return proto3.util.equals(sn, e, t)
      }
  }
  class on extends d {
      ideName = "";
      ideVersion = "";
      extensionName = "";
      extensionVersion = "";
      apiKey = "";
      locale = "";
      os = "";
      hardware = "";
      disableTelemetry = !1;
      sessionId = "";
      requestId = y.zero;
      sourceAddress = "";
      userAgent = "";
      url = "";
      authSource = Ye.CODEIUM;
      extensionPath = "";
      userId = "";
      userJwt = "";
      forceTeamId = "";
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.codeium_common_pb.Metadata";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "ide_name",
          kind: "scalar",
          T: 9
      }, {
          no: 7,
          name: "ide_version",
          kind: "scalar",
          T: 9
      }, {
          no: 12,
          name: "extension_name",
          kind: "scalar",
          T: 9
      }, {
          no: 2,
          name: "extension_version",
          kind: "scalar",
          T: 9
      }, {
          no: 3,
          name: "api_key",
          kind: "scalar",
          T: 9
      }, {
          no: 4,
          name: "locale",
          kind: "scalar",
          T: 9
      }, {
          no: 5,
          name: "os",
          kind: "scalar",
          T: 9
      }, {
          no: 8,
          name: "hardware",
          kind: "scalar",
          T: 9
      }, {
          no: 6,
          name: "disable_telemetry",
          kind: "scalar",
          T: 8
      }, {
          no: 10,
          name: "session_id",
          kind: "scalar",
          T: 9
      }, {
          no: 16,
          name: "ls_timestamp",
          kind: "message",
          T: Je
      }, {
          no: 9,
          name: "request_id",
          kind: "scalar",
          T: 4
      }, {
          no: 11,
          name: "source_address",
          kind: "scalar",
          T: 9
      }, {
          no: 13,
          name: "user_agent",
          kind: "scalar",
          T: 9
      }, {
          no: 14,
          name: "url",
          kind: "scalar",
          T: 9
      }, {
          no: 15,
          name: "auth_source",
          kind: "enum",
          T: Le.getEnumType(Ye)
      }, {
          no: 17,
          name: "extension_path",
          kind: "scalar",
          T: 9
      }, {
          no: 20,
          name: "user_id",
          kind: "scalar",
          T: 9
      }, {
          no: 21,
          name: "user_jwt",
          kind: "scalar",
          T: 9
      }, {
          no: 22,
          name: "force_team_id",
          kind: "scalar",
          T: 9
      }]));
      static fromBinary(e, t) {
          return (new on).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new on).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new on).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(on, e, t)
      }
  }
  class mn extends d {
      tabSize = y.zero;
      insertSpaces = !1;
      disableAutocompleteInComments = !1;
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.codeium_common_pb.EditorOptions";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "tab_size",
          kind: "scalar",
          T: 4
      }, {
          no: 2,
          name: "insert_spaces",
          kind: "scalar",
          T: 8
      }, {
          no: 3,
          name: "disable_autocomplete_in_comments",
          kind: "scalar",
          T: 8
      }]));
      static fromBinary(e, t) {
          return (new mn).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new mn).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new mn).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(mn, e, t)
      }
  }
  class cn extends d {
      errorId = "";
      timestampUnixMs = y.zero;
      stacktrace = "";
      recovered = !1;
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.codeium_common_pb.ErrorTrace";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "error_id",
          kind: "scalar",
          T: 9
      }, {
          no: 2,
          name: "timestamp_unix_ms",
          kind: "scalar",
          T: 3
      }, {
          no: 3,
          name: "stacktrace",
          kind: "scalar",
          T: 9
      }, {
          no: 4,
          name: "recovered",
          kind: "scalar",
          T: 8
      }]));
      static fromBinary(e, t) {
          return (new cn).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new cn).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new cn).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(cn, e, t)
      }
  }
  class un extends d {
      eventType = Ke.UNSPECIFIED;
      eventJson = "";
      timestampUnixMs = y.zero;
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.codeium_common_pb.Event";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "event_type",
          kind: "enum",
          T: Le.getEnumType(Ke)
      }, {
          no: 2,
          name: "event_json",
          kind: "scalar",
          T: 9
      }, {
          no: 3,
          name: "timestamp_unix_ms",
          kind: "scalar",
          T: 3
      }]));
      static fromBinary(e, t) {
          return (new un).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new un).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new un).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(un, e, t)
      }
  }
  class ln extends (null) {
      searchId = "";
      resultId = "";
      absolutePath = "";
      workspacePaths = [];
      text = "";
      similarityScore = 0;
      numResultsInCluster = protoInt64.zero;
      representativePath = "";
      meanSimilarityScore = 0;
      searchResultType = We.UNSPECIFIED;
      constructor(e) {
          super(),
          proto3.util.initPartial(e, this)
      }
      static runtime = null;
      static typeName = null;
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "search_id",
          kind: "scalar",
          T: 9
      }, {
          no: 2,
          name: "result_id",
          kind: "scalar",
          T: 9
      }, {
          no: 3,
          name: "absolute_path",
          kind: "scalar",
          T: 9
      }, {
          no: 4,
          name: "workspace_paths",
          kind: "message",
          T: _n,
          repeated: !0
      }, {
          no: 5,
          name: "text",
          kind: "scalar",
          T: 9
      }, {
          no: 6,
          name: "embedding_metadata",
          kind: "message",
          T: dn
      }, {
          no: 7,
          name: "similarity_score",
          kind: "scalar",
          T: 2
      }, {
          no: 8,
          name: "num_results_in_cluster",
          kind: "scalar",
          T: 3
      }, {
          no: 9,
          name: "representative_path",
          kind: "scalar",
          T: 9
      }, {
          no: 10,
          name: "mean_similarity_score",
          kind: "scalar",
          T: 2
      }, {
          no: 11,
          name: "search_result_type",
          kind: "enum",
          T: Le.getEnumType(We)
      }]));
      static fromBinary(e, t) {
          return (new ln).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new ln).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new ln).fromJsonString(e, t)
      }
      static equals(e, t) {
          return proto3.util.equals(ln, e, t)
      }
  }
  class _n extends d {
      workspaceMigrateMeToUri = "";
      workspaceUri = "";
      relativePath = "";
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.codeium_common_pb.WorkspacePath";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "workspace_migrate_me_to_uri",
          kind: "scalar",
          T: 9
      }, {
          no: 3,
          name: "workspace_uri",
          kind: "scalar",
          T: 9
      }, {
          no: 2,
          name: "relative_path",
          kind: "scalar",
          T: 9
      }]));
      static fromBinary(e, t) {
          return (new _n).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new _n).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new _n).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(_n, e, t)
      }
  }
  class dn extends d {
      nodeName = "";
      startLine = 0;
      endLine = 0;
      embedType = ze.UNSPECIFIED;
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.codeium_common_pb.EmbeddingMetadata";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "node_name",
          kind: "scalar",
          T: 9
      }, {
          no: 2,
          name: "start_line",
          kind: "scalar",
          T: 13
      }, {
          no: 3,
          name: "end_line",
          kind: "scalar",
          T: 13
      }, {
          no: 4,
          name: "embed_type",
          kind: "enum",
          T: Le.getEnumType(ze)
      }]));
      static fromBinary(e, t) {
          return (new dn).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new dn).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new dn).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(dn, e, t)
      }
  }
  class En extends d {
      completions = [];
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.codeium_common_pb.MockResponseData";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "completions",
          kind: "message",
          T: Yt,
          repeated: !0
      }]));
      static fromBinary(e, t) {
          return (new En).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new En).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new En).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(En, e, t)
      }
  }
  class Tn extends (null) {
      workspaceUriForTelemetry = "";
      numFilesTotal = protoInt64.zero;
      numFilesToEmbed = protoInt64.zero;
      numNodesTotal = protoInt64.zero;
      numNodesToEmbed = protoInt64.zero;
      numTokens = protoInt64.zero;
      numHighPriorityNodesToEmbed = protoInt64.zero;
      error = "";
      constructor(e) {
          super(),
          proto3.util.initPartial(e, this)
      }
      static runtime = null;
      static typeName = null;
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "workspace_uri_for_telemetry",
          kind: "scalar",
          T: 9
      }, {
          no: 2,
          name: "indexing_start",
          kind: "message",
          T: Je
      }, {
          no: 3,
          name: "indexing_end",
          kind: "message",
          T: Je
      }, {
          no: 4,
          name: "embedding_duration",
          kind: "message",
          T: De
      }, {
          no: 5,
          name: "num_files_total",
          kind: "scalar",
          T: 3
      }, {
          no: 6,
          name: "num_files_to_embed",
          kind: "scalar",
          T: 3
      }, {
          no: 7,
          name: "num_nodes_total",
          kind: "scalar",
          T: 3
      }, {
          no: 8,
          name: "num_nodes_to_embed",
          kind: "scalar",
          T: 3
      }, {
          no: 9,
          name: "num_tokens",
          kind: "scalar",
          T: 3
      }, {
          no: 10,
          name: "num_high_priority_nodes_to_embed",
          kind: "scalar",
          T: 3
      }, {
          no: 11,
          name: "error",
          kind: "scalar",
          T: 9
      }]));
      static fromBinary(e, t) {
          return (new Tn).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new Tn).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new Tn).fromJsonString(e, t)
      }
      static equals(e, t) {
          return proto3.util.equals(Tn, e, t)
      }
  }
  class fn extends d {
      workspace = "";
      numFiles = {};
      numBytes = {};
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.codeium_common_pb.WorkspaceStats";
      static fields = Le.util.newFieldList(( () => [{
          no: 3,
          name: "workspace",
          kind: "scalar",
          T: 9
      }, {
          no: 1,
          name: "num_files",
          kind: "map",
          K: 5,
          V: {
              kind: "scalar",
              T: 3
          }
      }, {
          no: 2,
          name: "num_bytes",
          kind: "map",
          K: 5,
          V: {
              kind: "scalar",
              T: 3
          }
      }]));
      static fromBinary(e, t) {
          return (new fn).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new fn).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new fn).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(fn, e, t)
      }
  }
  class pn extends d {
      numTotalFiles = 0;
      numIndexedFiles = 0;
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.codeium_common_pb.PartialIndexMetadata";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "num_total_files",
          kind: "scalar",
          T: 13
      }, {
          no: 2,
          name: "num_indexed_files",
          kind: "scalar",
          T: 13
      }, {
          no: 3,
          name: "cutoff_timestamp",
          kind: "message",
          T: Je
      }]));
      static fromBinary(e, t) {
          return (new pn).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new pn).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new pn).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(pn, e, t)
      }
  }
  class Sn extends d {
      rawSource = "";
      cleanFunction = "";
      docstring = "";
      nodeName = "";
      params = "";
      definitionLine = 0;
      startLine = 0;
      endLine = 0;
      startCol = 0;
      endCol = 0;
      leadingWhitespace = "";
      language = Qe.UNSPECIFIED;
      bodyStartLine = 0;
      bodyStartCol = 0;
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.codeium_common_pb.FunctionInfo";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "raw_source",
          kind: "scalar",
          T: 9
      }, {
          no: 2,
          name: "clean_function",
          kind: "scalar",
          T: 9
      }, {
          no: 3,
          name: "docstring",
          kind: "scalar",
          T: 9
      }, {
          no: 4,
          name: "node_name",
          kind: "scalar",
          T: 9
      }, {
          no: 5,
          name: "params",
          kind: "scalar",
          T: 9
      }, {
          no: 6,
          name: "definition_line",
          kind: "scalar",
          T: 5
      }, {
          no: 7,
          name: "start_line",
          kind: "scalar",
          T: 5
      }, {
          no: 8,
          name: "end_line",
          kind: "scalar",
          T: 5
      }, {
          no: 9,
          name: "start_col",
          kind: "scalar",
          T: 5
      }, {
          no: 10,
          name: "end_col",
          kind: "scalar",
          T: 5
      }, {
          no: 11,
          name: "leading_whitespace",
          kind: "scalar",
          T: 9
      }, {
          no: 12,
          name: "language",
          kind: "enum",
          T: Le.getEnumType(Qe)
      }, {
          no: 13,
          name: "body_start_line",
          kind: "scalar",
          T: 5
      }, {
          no: 14,
          name: "body_start_col",
          kind: "scalar",
          T: 5
      }]));
      static fromBinary(e, t) {
          return (new Sn).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new Sn).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new Sn).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(Sn, e, t)
      }
  }
  class Nn extends d {
      rawSource = "";
      startLine = 0;
      endLine = 0;
      startCol = 0;
      endCol = 0;
      leadingWhitespace = "";
      fieldsAndConstructors = [];
      docstring = "";
      nodeName = "";
      methods = [];
      nodeLineage = [];
      isExported = !1;
      language = Qe.UNSPECIFIED;
      definitionLine = 0;
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.codeium_common_pb.ClassInfo";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "raw_source",
          kind: "scalar",
          T: 9
      }, {
          no: 2,
          name: "start_line",
          kind: "scalar",
          T: 5
      }, {
          no: 3,
          name: "end_line",
          kind: "scalar",
          T: 5
      }, {
          no: 4,
          name: "start_col",
          kind: "scalar",
          T: 5
      }, {
          no: 5,
          name: "end_col",
          kind: "scalar",
          T: 5
      }, {
          no: 6,
          name: "leading_whitespace",
          kind: "scalar",
          T: 9
      }, {
          no: 7,
          name: "fields_and_constructors",
          kind: "scalar",
          T: 9,
          repeated: !0
      }, {
          no: 8,
          name: "docstring",
          kind: "scalar",
          T: 9
      }, {
          no: 9,
          name: "node_name",
          kind: "scalar",
          T: 9
      }, {
          no: 10,
          name: "methods",
          kind: "message",
          T: Sn,
          repeated: !0
      }, {
          no: 11,
          name: "node_lineage",
          kind: "scalar",
          T: 9,
          repeated: !0
      }, {
          no: 12,
          name: "is_exported",
          kind: "scalar",
          T: 8
      }, {
          no: 13,
          name: "language",
          kind: "enum",
          T: Le.getEnumType(Qe)
      }, {
          no: 14,
          name: "definition_line",
          kind: "scalar",
          T: 5
      }]));
      static fromBinary(e, t) {
          return (new Nn).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new Nn).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new Nn).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(Nn, e, t)
      }
  }
  class gn extends d {
      teamsTier = at.UNSPECIFIED;
      planName = "";
      hasAutocompleteFastMode = !1;
      allowStickyPremiumModels = !1;
      hasForgeAccess = !1;
      disableCodeSnippetTelemetry = !1;
      maxNumPremiumChatMessages = y.zero;
      maxNumChatInputTokens = y.zero;
      maxCustomChatInstructionCharacters = y.zero;
      maxNumPinnedContextItems = y.zero;
      maxLocalIndexSize = y.zero;
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.codeium_common_pb.PlanInfo";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "teams_tier",
          kind: "enum",
          T: Le.getEnumType(at)
      }, {
          no: 2,
          name: "plan_name",
          kind: "scalar",
          T: 9
      }, {
          no: 3,
          name: "has_autocomplete_fast_mode",
          kind: "scalar",
          T: 8
      }, {
          no: 4,
          name: "allow_sticky_premium_models",
          kind: "scalar",
          T: 8
      }, {
          no: 5,
          name: "has_forge_access",
          kind: "scalar",
          T: 8
      }, {
          no: 11,
          name: "disable_code_snippet_telemetry",
          kind: "scalar",
          T: 8
      }, {
          no: 6,
          name: "max_num_premium_chat_messages",
          kind: "scalar",
          T: 3
      }, {
          no: 7,
          name: "max_num_chat_input_tokens",
          kind: "scalar",
          T: 3
      }, {
          no: 8,
          name: "max_custom_chat_instruction_characters",
          kind: "scalar",
          T: 3
      }, {
          no: 9,
          name: "max_num_pinned_context_items",
          kind: "scalar",
          T: 3
      }, {
          no: 10,
          name: "max_local_index_size",
          kind: "scalar",
          T: 3
      }]));
      static fromBinary(e, t) {
          return (new gn).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new gn).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new gn).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(gn, e, t)
      }
  }
  class In extends d {
      pro = !1;
      disableTelemetry = !1;
      name = "";
      ignoreChatTelemetrySetting = !1;
      teamId = "";
      teamStatus = et.UNSPECIFIED;
      email = "";
      userFeatures = [];
      teamsFeatures = [];
      permissions = [];
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.codeium_common_pb.UserStatus";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "pro",
          kind: "scalar",
          T: 8
      }, {
          no: 2,
          name: "disable_telemetry",
          kind: "scalar",
          T: 8
      }, {
          no: 3,
          name: "name",
          kind: "scalar",
          T: 9
      }, {
          no: 4,
          name: "ignore_chat_telemetry_setting",
          kind: "scalar",
          T: 8
      }, {
          no: 5,
          name: "team_id",
          kind: "scalar",
          T: 9
      }, {
          no: 6,
          name: "team_status",
          kind: "enum",
          T: Le.getEnumType(et)
      }, {
          no: 7,
          name: "email",
          kind: "scalar",
          T: 9
      }, {
          no: 9,
          name: "user_features",
          kind: "enum",
          T: Le.getEnumType(nt),
          repeated: !0
      }, {
          no: 8,
          name: "teams_features",
          kind: "enum",
          T: Le.getEnumType(tt),
          repeated: !0
      }, {
          no: 11,
          name: "permissions",
          kind: "enum",
          T: Le.getEnumType(rt),
          repeated: !0
      }, {
          no: 12,
          name: "plan_info",
          kind: "message",
          T: gn
      }]));
      static fromBinary(e, t) {
          return (new In).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new In).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new In).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(In, e, t)
      }
  }
  class Cn extends d {
      name = "";
      owner = "";
      repoName = "";
      commit = "";
      versionAlias = "";
      scmProvider = it.UNSPECIFIED;
      baseGitUrl = "";
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.codeium_common_pb.GitRepoInfo";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "name",
          kind: "scalar",
          T: 9
      }, {
          no: 2,
          name: "owner",
          kind: "scalar",
          T: 9
      }, {
          no: 5,
          name: "repo_name",
          kind: "scalar",
          T: 9
      }, {
          no: 3,
          name: "commit",
          kind: "scalar",
          T: 9
      }, {
          no: 4,
          name: "version_alias",
          kind: "scalar",
          T: 9
      }, {
          no: 6,
          name: "scm_provider",
          kind: "enum",
          T: Le.getEnumType(it)
      }, {
          no: 7,
          name: "base_git_url",
          kind: "scalar",
          T: 9
      }]));
      static fromBinary(e, t) {
          return (new Cn).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new Cn).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new Cn).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(Cn, e, t)
      }
  }
  class On extends d {
      absolutePathMigrateMeToUri = "";
      absoluteUri = "";
      workspacePaths = [];
      nodeName = "";
      nodeLineage = [];
      startLine = 0;
      startCol = 0;
      endLine = 0;
      endCol = 0;
      contextType = st.UNSPECIFIED;
      language = Qe.UNSPECIFIED;
      snippetByType = {};
      fileContentHash = new Uint8Array(0);
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.codeium_common_pb.CodeContextItem";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "absolute_path_migrate_me_to_uri",
          kind: "scalar",
          T: 9
      }, {
          no: 16,
          name: "absolute_uri",
          kind: "scalar",
          T: 9
      }, {
          no: 2,
          name: "workspace_paths",
          kind: "message",
          T: _n,
          repeated: !0
      }, {
          no: 3,
          name: "node_name",
          kind: "scalar",
          T: 9
      }, {
          no: 4,
          name: "node_lineage",
          kind: "scalar",
          T: 9,
          repeated: !0
      }, {
          no: 5,
          name: "start_line",
          kind: "scalar",
          T: 13
      }, {
          no: 12,
          name: "start_col",
          kind: "scalar",
          T: 13
      }, {
          no: 6,
          name: "end_line",
          kind: "scalar",
          T: 13
      }, {
          no: 13,
          name: "end_col",
          kind: "scalar",
          T: 13
      }, {
          no: 7,
          name: "context_type",
          kind: "enum",
          T: Le.getEnumType(st)
      }, {
          no: 10,
          name: "language",
          kind: "enum",
          T: Le.getEnumType(Qe)
      }, {
          no: 11,
          name: "snippet_by_type",
          kind: "map",
          K: 9,
          V: {
              kind: "message",
              T: yn
          }
      }, {
          no: 14,
          name: "repo_info",
          kind: "message",
          T: Cn
      }, {
          no: 15,
          name: "file_content_hash",
          kind: "scalar",
          T: 12
      }]));
      static fromBinary(e, t) {
          return (new On).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new On).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new On).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(On, e, t)
      }
  }
  class yn extends d {
      snippet = "";
      wordCountBySplitter = {};
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.codeium_common_pb.SnippetWithWordCount";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "snippet",
          kind: "scalar",
          T: 9
      }, {
          no: 2,
          name: "word_count_by_splitter",
          kind: "map",
          K: 9,
          V: {
              kind: "message",
              T: wn
          }
      }]));
      static fromBinary(e, t) {
          return (new yn).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new yn).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new yn).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(yn, e, t)
      }
  }
  class wn extends d {
      wordCountMap = {};
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.codeium_common_pb.WordCount";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "word_count_map",
          kind: "map",
          K: 9,
          V: {
              kind: "scalar",
              T: 3
          }
      }]));
      static fromBinary(e, t) {
          return (new wn).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new wn).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new wn).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(wn, e, t)
      }
  }
  class An extends d {
      computedName = "";
      gitOriginUrl = "";
      gitUpstreamUrl = "";
      reportedName = "";
      modelName = "";
      submoduleUrl = "";
      submodulePath = "";
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.codeium_common_pb.Repository";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "computed_name",
          kind: "scalar",
          T: 9
      }, {
          no: 2,
          name: "git_origin_url",
          kind: "scalar",
          T: 9
      }, {
          no: 3,
          name: "git_upstream_url",
          kind: "scalar",
          T: 9
      }, {
          no: 4,
          name: "reported_name",
          kind: "scalar",
          T: 9
      }, {
          no: 5,
          name: "model_name",
          kind: "scalar",
          T: 9
      }, {
          no: 6,
          name: "submodule_url",
          kind: "scalar",
          T: 9
      }, {
          no: 7,
          name: "submodule_path",
          kind: "scalar",
          T: 9
      }]));
      static fromBinary(e, t) {
          return (new An).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new An).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new An).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(An, e, t)
      }
  }
  class Pn extends d {
      promptId = "";
      filePath = "";
      originalFileContent = "";
      completionText = "";
      startOffset = y.zero;
      endOffset = y.zero;
      cursorLine = y.zero;
      cursorColumn = y.zero;
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.codeium_common_pb.CaptureFileRequestData";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "metadata",
          kind: "message",
          T: on
      }, {
          no: 2,
          name: "prompt_id",
          kind: "scalar",
          T: 9
      }, {
          no: 3,
          name: "file_path",
          kind: "scalar",
          T: 9
      }, {
          no: 4,
          name: "original_file_content",
          kind: "scalar",
          T: 9
      }, {
          no: 5,
          name: "completion_text",
          kind: "scalar",
          T: 9
      }, {
          no: 6,
          name: "start_offset",
          kind: "scalar",
          T: 4
      }, {
          no: 7,
          name: "end_offset",
          kind: "scalar",
          T: 4
      }, {
          no: 8,
          name: "cursor_line",
          kind: "scalar",
          T: 4
      }, {
          no: 9,
          name: "cursor_column",
          kind: "scalar",
          T: 4
      }]));
      static fromBinary(e, t) {
          return (new Pn).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new Pn).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new Pn).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(Pn, e, t)
      }
  }
  class Ln extends d {
      numAcceptances = 0;
      numRejections = 0;
      numLinesAccepted = 0;
      numBytesAccepted = 0;
      numUsers = 0;
      activeDeveloperDays = 0;
      activeDeveloperHours = 0;
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.codeium_common_pb.CompletionStatistics";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "num_acceptances",
          kind: "scalar",
          T: 13
      }, {
          no: 2,
          name: "num_rejections",
          kind: "scalar",
          T: 13
      }, {
          no: 3,
          name: "num_lines_accepted",
          kind: "scalar",
          T: 13
      }, {
          no: 4,
          name: "num_bytes_accepted",
          kind: "scalar",
          T: 13
      }, {
          no: 5,
          name: "num_users",
          kind: "scalar",
          T: 13
      }, {
          no: 6,
          name: "active_developer_days",
          kind: "scalar",
          T: 13
      }, {
          no: 7,
          name: "active_developer_hours",
          kind: "scalar",
          T: 13
      }]));
      static fromBinary(e, t) {
          return (new Ln).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new Ln).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new Ln).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(Ln, e, t)
      }
  }
  class Rn extends d {
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.codeium_common_pb.CompletionByDateEntry";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "timestamp",
          kind: "message",
          T: Je
      }, {
          no: 2,
          name: "completion_statistics",
          kind: "message",
          T: Ln
      }]));
      static fromBinary(e, t) {
          return (new Rn).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new Rn).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new Rn).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(Rn, e, t)
      }
  }
  class kn extends d {
      language = Qe.UNSPECIFIED;
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.codeium_common_pb.CompletionByLanguageEntry";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "language",
          kind: "enum",
          T: Le.getEnumType(Qe)
      }, {
          no: 2,
          name: "completion_statistics",
          kind: "message",
          T: Ln
      }]));
      static fromBinary(e, t) {
          return (new kn).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new kn).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new kn).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(kn, e, t)
      }
  }
  class Jn extends d {
      chatsSent = y.zero;
      chatsReceived = y.zero;
      chatsAccepted = y.zero;
      chatsInsertedAtCursor = y.zero;
      chatsApplied = y.zero;
      chatLocUsed = y.zero;
      chatCodeBlocksUsed = y.zero;
      functionExplainCount = y.zero;
      functionDocstringCount = y.zero;
      functionRefactorCount = y.zero;
      codeBlockExplainCount = y.zero;
      codeBlockRefactorCount = y.zero;
      problemExplainCount = y.zero;
      functionUnitTestsCount = y.zero;
      activeDeveloperDays = 0;
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.codeium_common_pb.ChatStats";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "chats_sent",
          kind: "scalar",
          T: 4
      }, {
          no: 2,
          name: "chats_received",
          kind: "scalar",
          T: 4
      }, {
          no: 3,
          name: "chats_accepted",
          kind: "scalar",
          T: 4
      }, {
          no: 4,
          name: "chats_inserted_at_cursor",
          kind: "scalar",
          T: 4
      }, {
          no: 5,
          name: "chats_applied",
          kind: "scalar",
          T: 4
      }, {
          no: 6,
          name: "chat_loc_used",
          kind: "scalar",
          T: 4
      }, {
          no: 7,
          name: "chat_code_blocks_used",
          kind: "scalar",
          T: 4
      }, {
          no: 8,
          name: "function_explain_count",
          kind: "scalar",
          T: 4
      }, {
          no: 9,
          name: "function_docstring_count",
          kind: "scalar",
          T: 4
      }, {
          no: 10,
          name: "function_refactor_count",
          kind: "scalar",
          T: 4
      }, {
          no: 11,
          name: "code_block_explain_count",
          kind: "scalar",
          T: 4
      }, {
          no: 12,
          name: "code_block_refactor_count",
          kind: "scalar",
          T: 4
      }, {
          no: 13,
          name: "problem_explain_count",
          kind: "scalar",
          T: 4
      }, {
          no: 14,
          name: "function_unit_tests_count",
          kind: "scalar",
          T: 4
      }, {
          no: 15,
          name: "active_developer_days",
          kind: "scalar",
          T: 13
      }]));
      static fromBinary(e, t) {
          return (new Jn).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new Jn).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new Jn).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(Jn, e, t)
      }
  }
  class Dn extends (null) {
      constructor(e) {
          super(),
          proto3.util.initPartial(e, this)
      }
      static runtime = null;
      static typeName = null;
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "timestamp",
          kind: "message",
          T: Je
      }, {
          no: 2,
          name: "chat_stats",
          kind: "message",
          T: Jn
      }]));
      static fromBinary(e, t) {
          return (new Dn).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new Dn).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new Dn).fromJsonString(e, t)
      }
      static equals(e, t) {
          return proto3.util.equals(Dn, e, t)
      }
  }
  class hn extends d {
      modelId = Fe.MODEL_UNSPECIFIED;
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.codeium_common_pb.ChatStatsByModelEntry";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "model_id",
          kind: "enum",
          T: Le.getEnumType(Fe)
      }, {
          no: 2,
          name: "chat_stats",
          kind: "message",
          T: Jn
      }]));
      static fromBinary(e, t) {
          return (new hn).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new hn).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new hn).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(hn, e, t)
      }
  }
  class xn extends d {
      numCommands = y.zero;
      numCommandsAccepted = y.zero;
      numCommandsRejected = y.zero;
      numEdits = y.zero;
      numGenerations = y.zero;
      locAdded = y.zero;
      locRemoved = y.zero;
      bytesAdded = y.zero;
      bytesRemoved = y.zero;
      locSelected = y.zero;
      bytesSelected = y.zero;
      numCommandsBySource = {};
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.codeium_common_pb.CommandStats";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "num_commands",
          kind: "scalar",
          T: 4
      }, {
          no: 2,
          name: "num_commands_accepted",
          kind: "scalar",
          T: 4
      }, {
          no: 3,
          name: "num_commands_rejected",
          kind: "scalar",
          T: 4
      }, {
          no: 4,
          name: "num_edits",
          kind: "scalar",
          T: 4
      }, {
          no: 5,
          name: "num_generations",
          kind: "scalar",
          T: 4
      }, {
          no: 6,
          name: "loc_added",
          kind: "scalar",
          T: 4
      }, {
          no: 7,
          name: "loc_removed",
          kind: "scalar",
          T: 4
      }, {
          no: 8,
          name: "bytes_added",
          kind: "scalar",
          T: 4
      }, {
          no: 9,
          name: "bytes_removed",
          kind: "scalar",
          T: 4
      }, {
          no: 10,
          name: "loc_selected",
          kind: "scalar",
          T: 4
      }, {
          no: 11,
          name: "bytes_selected",
          kind: "scalar",
          T: 4
      }, {
          no: 12,
          name: "num_commands_by_source",
          kind: "map",
          K: 9,
          V: {
              kind: "scalar",
              T: 4
          }
      }]));
      static fromBinary(e, t) {
          return (new xn).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new xn).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new xn).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(xn, e, t)
      }
  }
  class Un extends (null) {
      constructor(e) {
          super(),
          proto3.util.initPartial(e, this)
      }
      static runtime = null;
      static typeName = null;
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "timestamp",
          kind: "message",
          T: Je
      }, {
          no: 2,
          name: "command_stats",
          kind: "message",
          T: xn
      }]));
      static fromBinary(e, t) {
          return (new Un).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new Un).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new Un).fromJsonString(e, t)
      }
      static equals(e, t) {
          return proto3.util.equals(Un, e, t)
      }
  }
  class Mn extends (null) {
      name = "";
      email = "";
      apiKey = "";
      disableCodeium = !1;
      activeDays = 0;
      role = "";
      constructor(e) {
          super(),
          proto3.util.initPartial(e, this)
      }
      static runtime = null;
      static typeName = null;
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "name",
          kind: "scalar",
          T: 9
      }, {
          no: 2,
          name: "email",
          kind: "scalar",
          T: 9
      }, {
          no: 3,
          name: "last_update_time",
          kind: "message",
          T: Je
      }, {
          no: 4,
          name: "api_key",
          kind: "scalar",
          T: 9
      }, {
          no: 5,
          name: "disable_codeium",
          kind: "scalar",
          T: 8
      }, {
          no: 6,
          name: "active_days",
          kind: "scalar",
          T: 13
      }, {
          no: 7,
          name: "role",
          kind: "scalar",
          T: 9
      }]));
      static fromBinary(e, t) {
          return (new Mn).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new Mn).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new Mn).fromJsonString(e, t)
      }
      static equals(e, t) {
          return proto3.util.equals(Mn, e, t)
      }
  }
  class Bn extends d {
      event = pt.CASCADE_NUX_EVENT_UNSPECIFIED;
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.codeium_common_pb.CascadeNUXState";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "event",
          kind: "enum",
          T: Le.getEnumType(pt)
      }, {
          no: 2,
          name: "timestamp",
          kind: "message",
          T: Je
      }]));
      static fromBinary(e, t) {
          return (new Bn).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new Bn).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new Bn).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(Bn, e, t)
      }
  }
  class Fn extends d {
      openMostRecentChatConversation = !1;
      lastSelectedModel = Fe.MODEL_UNSPECIFIED;
      themePreference = _t.UNSPECIFIED;
      extensionPanelTab = Tt.UNSPECIFIED;
      fontSize = dt.UNSPECIFIED;
      rememberLastModelSelection = ft.UNSPECIFIED;
      autocompleteSpeed = Et.UNSPECIFIED;
      lastSelectedModelName = "";
      cascadeReadOnlyMode = !1;
      cascadeNuxStates = [];
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.codeium_common_pb.UserSettings";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "open_most_recent_chat_conversation",
          kind: "scalar",
          T: 8
      }, {
          no: 2,
          name: "last_selected_model",
          kind: "enum",
          T: Le.getEnumType(Fe)
      }, {
          no: 9,
          name: "last_selected_cascade_model",
          kind: "enum",
          T: Le.getEnumType(Fe),
          opt: !0
      }, {
          no: 3,
          name: "theme_preference",
          kind: "enum",
          T: Le.getEnumType(_t)
      }, {
          no: 4,
          name: "extension_panel_tab",
          kind: "enum",
          T: Le.getEnumType(Tt)
      }, {
          no: 5,
          name: "font_size",
          kind: "enum",
          T: Le.getEnumType(dt)
      }, {
          no: 7,
          name: "remember_last_model_selection",
          kind: "enum",
          T: Le.getEnumType(ft)
      }, {
          no: 6,
          name: "autocomplete_speed",
          kind: "enum",
          T: Le.getEnumType(Et)
      }, {
          no: 8,
          name: "last_selected_model_name",
          kind: "scalar",
          T: 9
      }, {
          no: 10,
          name: "cascade_read_only_mode",
          kind: "scalar",
          T: 8
      }, {
          no: 11,
          name: "cascade_nux_states",
          kind: "message",
          T: Bn,
          repeated: !0
      }]));
      static fromBinary(e, t) {
          return (new Fn).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new Fn).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new Fn).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(Fn, e, t)
      }
  }
  class bn extends d {
      supportsContextTokens = !1;
      requiresInstructTags = !1;
      requiresFimContext = !1;
      requiresContextSnippetPrefix = !1;
      requiresContextRelevanceTags = !1;
      requiresLlama3Tokens = !1;
      zeroShotCapable = !1;
      requiresAutocompleteAsCommand = !1;
      supportsCursorAwareSupercomplete = !1;
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.codeium_common_pb.ModelFeatures";
      static fields = Le.util.newFieldList(( () => [{
          no: 2,
          name: "supports_context_tokens",
          kind: "scalar",
          T: 8
      }, {
          no: 3,
          name: "requires_instruct_tags",
          kind: "scalar",
          T: 8
      }, {
          no: 4,
          name: "requires_fim_context",
          kind: "scalar",
          T: 8
      }, {
          no: 5,
          name: "requires_context_snippet_prefix",
          kind: "scalar",
          T: 8
      }, {
          no: 6,
          name: "requires_context_relevance_tags",
          kind: "scalar",
          T: 8
      }, {
          no: 7,
          name: "requires_llama3_tokens",
          kind: "scalar",
          T: 8
      }, {
          no: 8,
          name: "zero_shot_capable",
          kind: "scalar",
          T: 8
      }, {
          no: 9,
          name: "requires_autocomplete_as_command",
          kind: "scalar",
          T: 8
      }, {
          no: 10,
          name: "supports_cursor_aware_supercomplete",
          kind: "scalar",
          T: 8
      }]));
      static fromBinary(e, t) {
          return (new bn).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new bn).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new bn).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(bn, e, t)
      }
  }
  class qn extends d {
      isInternal = !1;
      modelId = Fe.MODEL_UNSPECIFIED;
      modelName = "";
      baseUrl = "";
      apiKey = "";
      accessKey = "";
      secretAccessKey = "";
      region = "";
      projectId = "";
      id = 0;
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.codeium_common_pb.ExternalModel";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "is_internal",
          kind: "scalar",
          T: 8
      }, {
          no: 2,
          name: "model_id",
          kind: "enum",
          T: Le.getEnumType(Fe)
      }, {
          no: 3,
          name: "model_name",
          kind: "scalar",
          T: 9
      }, {
          no: 4,
          name: "base_url",
          kind: "scalar",
          T: 9
      }, {
          no: 5,
          name: "api_key",
          kind: "scalar",
          T: 9
      }, {
          no: 6,
          name: "access_key",
          kind: "scalar",
          T: 9
      }, {
          no: 7,
          name: "secret_access_key",
          kind: "scalar",
          T: 9
      }, {
          no: 8,
          name: "region",
          kind: "scalar",
          T: 9
      }, {
          no: 9,
          name: "project_id",
          kind: "scalar",
          T: 9
      }, {
          no: 10,
          name: "id",
          kind: "scalar",
          T: 13
      }]));
      static fromBinary(e, t) {
          return (new qn).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new qn).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new qn).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(qn, e, t)
      }
  }
  class Gn extends d {
      modelId = Fe.MODEL_UNSPECIFIED;
      isInternal = !1;
      modelType = St.UNSPECIFIED;
      maxTokens = 0;
      tokenizerType = "";
      apiProvider = Nt.API_PROVIDER_UNSPECIFIED;
      modelName = "";
      supportsContext = !1;
      embedDim = 0;
      baseUrl = "";
      chatModelName = "";
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.codeium_common_pb.ModelInfo";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "model_id",
          kind: "enum",
          T: Le.getEnumType(Fe)
      }, {
          no: 2,
          name: "is_internal",
          kind: "scalar",
          T: 8
      }, {
          no: 3,
          name: "model_type",
          kind: "enum",
          T: Le.getEnumType(St)
      }, {
          no: 4,
          name: "max_tokens",
          kind: "scalar",
          T: 5
      }, {
          no: 5,
          name: "tokenizer_type",
          kind: "scalar",
          T: 9
      }, {
          no: 6,
          name: "model_features",
          kind: "message",
          T: bn
      }, {
          no: 7,
          name: "api_provider",
          kind: "enum",
          T: Le.getEnumType(Nt)
      }, {
          no: 8,
          name: "model_name",
          kind: "scalar",
          T: 9
      }, {
          no: 9,
          name: "supports_context",
          kind: "scalar",
          T: 8
      }, {
          no: 10,
          name: "embed_dim",
          kind: "scalar",
          T: 5
      }, {
          no: 11,
          name: "base_url",
          kind: "scalar",
          T: 9
      }, {
          no: 12,
          name: "chat_model_name",
          kind: "scalar",
          T: 9
      }]));
      static fromBinary(e, t) {
          return (new Gn).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new Gn).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new Gn).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(Gn, e, t)
      }
  }
  class vn extends (null) {
      constructor(e) {
          super(),
          proto3.util.initPartial(e, this)
      }
      static runtime = null;
      static typeName = null;
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "generation_model",
          kind: "message",
          T: Gn
      }, {
          no: 2,
          name: "context_check_model",
          kind: "message",
          T: Gn
      }]));
      static fromBinary(e, t) {
          return (new vn).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new vn).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new vn).fromJsonString(e, t)
      }
      static equals(e, t) {
          return proto3.util.equals(vn, e, t)
      }
  }
  class Hn extends d {
      uid = "";
      completionId = "";
      filePath = "";
      shortPrefix = "";
      completionText = "";
      shortSuffix = "";
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.codeium_common_pb.CompletionExample";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "uid",
          kind: "scalar",
          T: 9
      }, {
          no: 2,
          name: "completion_id",
          kind: "scalar",
          T: 9
      }, {
          no: 3,
          name: "file_path",
          kind: "scalar",
          T: 9
      }, {
          no: 4,
          name: "short_prefix",
          kind: "scalar",
          T: 9
      }, {
          no: 5,
          name: "completion_text",
          kind: "scalar",
          T: 9
      }, {
          no: 6,
          name: "short_suffix",
          kind: "scalar",
          T: 9
      }]));
      static fromBinary(e, t) {
          return (new Hn).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new Hn).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new Hn).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(Hn, e, t)
      }
  }
  class Vn extends (null) {
      name = "";
      constructor(e) {
          super(),
          proto3.util.initPartial(e, this)
      }
      static runtime = null;
      static typeName = null;
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "example",
          kind: "message",
          T: Hn
      }, {
          no: 2,
          name: "name",
          kind: "scalar",
          T: 9
      }, {
          no: 4,
          name: "time",
          kind: "message",
          T: Je
      }]));
      static fromBinary(e, t) {
          return (new Vn).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new Vn).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new Vn).fromJsonString(e, t)
      }
      static equals(e, t) {
          return proto3.util.equals(Vn, e, t)
      }
  }
  class Xn extends d {
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.codeium_common_pb.CciWithSubrange";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "cci",
          kind: "message",
          T: On
      }, {
          no: 2,
          name: "subrange",
          kind: "message",
          T: Yn
      }]));
      static fromBinary(e, t) {
          return (new Xn).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new Xn).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new Xn).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(Xn, e, t)
      }
  }
  class Yn extends d {
      snippetType = mt.UNSPECIFIED;
      startOffset = y.zero;
      endOffset = y.zero;
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.codeium_common_pb.ContextSubrange";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "snippet_type",
          kind: "enum",
          T: Le.getEnumType(mt)
      }, {
          no: 2,
          name: "start_offset",
          kind: "scalar",
          T: 3
      }, {
          no: 3,
          name: "end_offset",
          kind: "scalar",
          T: 3
      }]));
      static fromBinary(e, t) {
          return (new Yn).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new Yn).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new Yn).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(Yn, e, t)
      }
  }
  class Kn extends d {
      absolutePathMigrateMeToUri = "";
      absoluteUri = "";
      workspaceRelativePathsMigrateMeToWorkspaceUris = {};
      workspaceUrisToRelativePaths = {};
      numFiles = 0;
      numBytes = y.zero;
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.codeium_common_pb.PathScopeItem";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "absolute_path_migrate_me_to_uri",
          kind: "scalar",
          T: 9
      }, {
          no: 5,
          name: "absolute_uri",
          kind: "scalar",
          T: 9
      }, {
          no: 2,
          name: "workspace_relative_paths_migrate_me_to_workspace_uris",
          kind: "map",
          K: 9,
          V: {
              kind: "scalar",
              T: 9
          }
      }, {
          no: 6,
          name: "workspace_uris_to_relative_paths",
          kind: "map",
          K: 9,
          V: {
              kind: "scalar",
              T: 9
          }
      }, {
          no: 3,
          name: "num_files",
          kind: "scalar",
          T: 13
      }, {
          no: 4,
          name: "num_bytes",
          kind: "scalar",
          T: 4
      }]));
      static fromBinary(e, t) {
          return (new Kn).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new Kn).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new Kn).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(Kn, e, t)
      }
  }
  class Wn extends d {
      absoluteUri = "";
      startLine = 0;
      endLine = 0;
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.codeium_common_pb.FileLineRange";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "absolute_uri",
          kind: "scalar",
          T: 9
      }, {
          no: 2,
          name: "start_line",
          kind: "scalar",
          T: 13
      }, {
          no: 3,
          name: "end_line",
          kind: "scalar",
          T: 13
      }]));
      static fromBinary(e, t) {
          return (new Wn).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new Wn).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new Wn).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(Wn, e, t)
      }
  }
  class zn extends d {
      content = "";
      identifier = {
          case: void 0
      };
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.codeium_common_pb.TextBlock";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "content",
          kind: "scalar",
          T: 9
      }, {
          no: 2,
          name: "file_line_range",
          kind: "message",
          T: Wn,
          oneof: "identifier"
      }, {
          no: 3,
          name: "label",
          kind: "scalar",
          T: 9,
          oneof: "identifier"
      }]));
      static fromBinary(e, t) {
          return (new zn).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new zn).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new zn).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(zn, e, t)
      }
  }
  class jn extends d {
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.codeium_common_pb.RepositoryScopeItem";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "repo_info",
          kind: "message",
          T: Cn
      }]));
      static fromBinary(e, t) {
          return (new jn).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new jn).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new jn).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(jn, e, t)
      }
  }
  class $n extends d {
      relativePath = "";
      isDir = !1;
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.codeium_common_pb.RepositoryPathScopeItem";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "repo_info",
          kind: "message",
          T: Cn
      }, {
          no: 2,
          name: "relative_path",
          kind: "scalar",
          T: 9
      }, {
          no: 3,
          name: "is_dir",
          kind: "scalar",
          T: 8
      }]));
      static fromBinary(e, t) {
          return (new $n).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new $n).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new $n).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals($n, e, t)
      }
  }
  class Qn extends d {
      documentId = "";
      index = Rt.UNSPECIFIED;
      displayName = "";
      description = "";
      displaySource = "";
      url = "";
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.codeium_common_pb.KnowledgeBaseScopeItem";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "document_id",
          kind: "scalar",
          T: 9
      }, {
          no: 7,
          name: "index",
          kind: "enum",
          T: Le.getEnumType(Rt)
      }, {
          no: 3,
          name: "display_name",
          kind: "scalar",
          T: 9
      }, {
          no: 4,
          name: "description",
          kind: "scalar",
          T: 9
      }, {
          no: 5,
          name: "display_source",
          kind: "scalar",
          T: 9
      }, {
          no: 6,
          name: "url",
          kind: "scalar",
          T: 9
      }]));
      static fromBinary(e, t) {
          return (new Qn).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new Qn).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new Qn).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(Qn, e, t)
      }
  }
  class Zn extends d {
      scopeItem = {
          case: void 0
      };
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.codeium_common_pb.ContextScopeItem";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "file",
          kind: "message",
          T: Kn,
          oneof: "scope_item"
      }, {
          no: 2,
          name: "directory",
          kind: "message",
          T: Kn,
          oneof: "scope_item"
      }, {
          no: 3,
          name: "repository",
          kind: "message",
          T: jn,
          oneof: "scope_item"
      }, {
          no: 4,
          name: "code_context",
          kind: "message",
          T: On,
          oneof: "scope_item"
      }, {
          no: 6,
          name: "cci_with_subrange",
          kind: "message",
          T: Xn,
          oneof: "scope_item"
      }, {
          no: 7,
          name: "repository_path",
          kind: "message",
          T: $n,
          oneof: "scope_item"
      }, {
          no: 8,
          name: "slack",
          kind: "message",
          T: Qn,
          oneof: "scope_item"
      }, {
          no: 9,
          name: "github",
          kind: "message",
          T: Qn,
          oneof: "scope_item"
      }, {
          no: 10,
          name: "file_line_range",
          kind: "message",
          T: Wn,
          oneof: "scope_item"
      }, {
          no: 11,
          name: "text_block",
          kind: "message",
          T: zn,
          oneof: "scope_item"
      }]));
      static fromBinary(e, t) {
          return (new Zn).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new Zn).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new Zn).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(Zn, e, t)
      }
  }
  class er extends d {
      items = [];
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.codeium_common_pb.ContextScope";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "items",
          kind: "message",
          T: Zn,
          repeated: !0
      }]));
      static fromBinary(e, t) {
          return (new er).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new er).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new er).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(er, e, t)
      }
  }
  class tr extends d {
      nodeName = "";
      graphStateJson = new Uint8Array(0);
      graphStateJsonNumBytes = y.zero;
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.codeium_common_pb.NodeExecutionRecord";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "node_name",
          kind: "scalar",
          T: 9
      }, {
          no: 2,
          name: "start_time",
          kind: "message",
          T: Je
      }, {
          no: 3,
          name: "end_time",
          kind: "message",
          T: Je
      }, {
          no: 5,
          name: "graph_state_json",
          kind: "scalar",
          T: 12
      }, {
          no: 6,
          name: "graph_state_json_num_bytes",
          kind: "scalar",
          T: 4
      }, {
          no: 4,
          name: "subgraph_execution",
          kind: "message",
          T: nr
      }]));
      static fromBinary(e, t) {
          return (new tr).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new tr).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new tr).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(tr, e, t)
      }
  }
  class nr extends d {
      history = [];
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.codeium_common_pb.GraphExecutionState";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "current",
          kind: "message",
          T: tr
      }, {
          no: 2,
          name: "history",
          kind: "message",
          T: tr,
          repeated: !0
      }]));
      static fromBinary(e, t) {
          return (new nr).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new nr).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new nr).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(nr, e, t)
      }
  }
  class rr extends d {
      items = [];
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.codeium_common_pb.Guideline";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "items",
          kind: "message",
          T: ar,
          repeated: !0
      }]));
      static fromBinary(e, t) {
          return (new rr).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new rr).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new rr).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(rr, e, t)
      }
  }
  class ar extends d {
      guideline = "";
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.codeium_common_pb.GuidelineItem";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "guideline",
          kind: "scalar",
          T: 9
      }]));
      static fromBinary(e, t) {
          return (new ar).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new ar).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new ar).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(ar, e, t)
      }
  }
  class ir extends d {
      model = Fe.MODEL_UNSPECIFIED;
      maxInputTokens = 0;
      temperature = 0;
      maxOutputTokens = 0;
      orderSnippetsByFile = !1;
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.codeium_common_pb.ChatNodeConfig";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "model",
          kind: "enum",
          T: Le.getEnumType(Fe)
      }, {
          no: 2,
          name: "max_input_tokens",
          kind: "scalar",
          T: 13
      }, {
          no: 3,
          name: "temperature",
          kind: "scalar",
          T: 2
      }, {
          no: 4,
          name: "max_output_tokens",
          kind: "scalar",
          T: 13
      }, {
          no: 5,
          name: "order_snippets_by_file",
          kind: "scalar",
          T: 8
      }]));
      static fromBinary(e, t) {
          return (new ir).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new ir).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new ir).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(ir, e, t)
      }
  }
  class sr extends d {
      shouldBatchCcis = !1;
      maxTokensPerSubrange = y.zero;
      numParserWorkers = y.zero;
      numWorkersPerDistributedScorer = y.zero;
      verbose = !1;
      ignoreExtensions = [];
      ignoreDirectoryStubs = [];
      minTokenSpaceForContext = 0;
      maxTargetFiles = 0;
      topCciCount = 0;
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.codeium_common_pb.MQueryConfig";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "should_batch_ccis",
          kind: "scalar",
          T: 8
      }, {
          no: 2,
          name: "max_tokens_per_subrange",
          kind: "scalar",
          T: 3
      }, {
          no: 3,
          name: "num_parser_workers",
          kind: "scalar",
          T: 3
      }, {
          no: 4,
          name: "num_workers_per_distributed_scorer",
          kind: "scalar",
          T: 3
      }, {
          no: 5,
          name: "verbose",
          kind: "scalar",
          T: 8
      }, {
          no: 6,
          name: "ignore_extensions",
          kind: "scalar",
          T: 9,
          repeated: !0
      }, {
          no: 7,
          name: "ignore_directory_stubs",
          kind: "scalar",
          T: 9,
          repeated: !0
      }, {
          no: 8,
          name: "min_token_space_for_context",
          kind: "scalar",
          T: 13
      }, {
          no: 9,
          name: "max_target_files",
          kind: "scalar",
          T: 13
      }, {
          no: 10,
          name: "top_cci_count",
          kind: "scalar",
          T: 13
      }]));
      static fromBinary(e, t) {
          return (new sr).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new sr).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new sr).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(sr, e, t)
      }
  }
  class or extends d {
      deltaText = "";
      deltaTokens = 0;
      stopReason = qe.UNSPECIFIED;
      deltaToolCalls = [];
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.codeium_common_pb.CompletionDelta";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "delta_text",
          kind: "scalar",
          T: 9
      }, {
          no: 2,
          name: "delta_tokens",
          kind: "scalar",
          T: 13
      }, {
          no: 3,
          name: "stop_reason",
          kind: "enum",
          T: Le.getEnumType(qe)
      }, {
          no: 4,
          name: "usage",
          kind: "message",
          T: Rr
      }, {
          no: 5,
          name: "delta_tool_calls",
          kind: "message",
          T: cr,
          repeated: !0
      }]));
      static fromBinary(e, t) {
          return (new or).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new or).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new or).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(or, e, t)
      }
  }
  class mr extends (null) {
      deltas = {};
      prompt = "";
      constructor(e) {
          super(),
          proto3.util.initPartial(e, this)
      }
      static runtime = null;
      static typeName = null;
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "deltas",
          kind: "map",
          K: 5,
          V: {
              kind: "message",
              T: or
          }
      }, {
          no: 2,
          name: "prompt",
          kind: "scalar",
          T: 9
      }]));
      static fromBinary(e, t) {
          return (new mr).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new mr).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new mr).fromJsonString(e, t)
      }
      static equals(e, t) {
          return proto3.util.equals(mr, e, t)
      }
  }
  class cr extends d {
      id = "";
      name = "";
      argumentsJson = "";
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.codeium_common_pb.ChatToolCall";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "id",
          kind: "scalar",
          T: 9
      }, {
          no: 2,
          name: "name",
          kind: "scalar",
          T: 9
      }, {
          no: 3,
          name: "arguments_json",
          kind: "scalar",
          T: 9
      }]));
      static fromBinary(e, t) {
          return (new cr).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new cr).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new cr).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(cr, e, t)
      }
  }
  class ur extends d {
      level = Ot.UNSPECIFIED;
      message = "";
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.codeium_common_pb.Status";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "level",
          kind: "enum",
          T: Le.getEnumType(Ot)
      }, {
          no: 2,
          name: "message",
          kind: "scalar",
          T: 9
      }]));
      static fromBinary(e, t) {
          return (new ur).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new ur).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new ur).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(ur, e, t)
      }
  }
  class lr extends d {
      row = y.zero;
      col = y.zero;
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.codeium_common_pb.DocumentPosition";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "row",
          kind: "scalar",
          T: 4
      }, {
          no: 2,
          name: "col",
          kind: "scalar",
          T: 4
      }]));
      static fromBinary(e, t) {
          return (new lr).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new lr).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new lr).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(lr, e, t)
      }
  }
  class _r extends d {
      startOffset = y.zero;
      endOffset = y.zero;
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.codeium_common_pb.Range";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "start_offset",
          kind: "scalar",
          T: 4
      }, {
          no: 2,
          name: "end_offset",
          kind: "scalar",
          T: 4
      }, {
          no: 3,
          name: "start_position",
          kind: "message",
          T: lr
      }, {
          no: 4,
          name: "end_position",
          kind: "message",
          T: lr
      }]));
      static fromBinary(e, t) {
          return (new _r).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new _r).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new _r).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(_r, e, t)
      }
  }
  class dr extends d {
      absolutePathMigrateMeToUri = "";
      absoluteUri = "";
      relativePathMigrateMeToWorkspaceUri = "";
      workspaceUri = "";
      text = "";
      editorLanguage = "";
      language = Qe.UNSPECIFIED;
      cursorOffset = y.zero;
      lineEnding = "";
      isCutoffStart = !1;
      isCutoffEnd = !1;
      linesCutoffStart = 0;
      linesCutoffEnd = 0;
      isDirty = !1;
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.codeium_common_pb.Document";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "absolute_path_migrate_me_to_uri",
          kind: "scalar",
          T: 9
      }, {
          no: 12,
          name: "absolute_uri",
          kind: "scalar",
          T: 9
      }, {
          no: 2,
          name: "relative_path_migrate_me_to_workspace_uri",
          kind: "scalar",
          T: 9
      }, {
          no: 13,
          name: "workspace_uri",
          kind: "scalar",
          T: 9
      }, {
          no: 3,
          name: "text",
          kind: "scalar",
          T: 9
      }, {
          no: 4,
          name: "editor_language",
          kind: "scalar",
          T: 9
      }, {
          no: 5,
          name: "language",
          kind: "enum",
          T: Le.getEnumType(Qe)
      }, {
          no: 6,
          name: "cursor_offset",
          kind: "scalar",
          T: 4
      }, {
          no: 8,
          name: "cursor_position",
          kind: "message",
          T: lr
      }, {
          no: 7,
          name: "line_ending",
          kind: "scalar",
          T: 9
      }, {
          no: 9,
          name: "visible_range",
          kind: "message",
          T: _r
      }, {
          no: 10,
          name: "is_cutoff_start",
          kind: "scalar",
          T: 8
      }, {
          no: 11,
          name: "is_cutoff_end",
          kind: "scalar",
          T: 8
      }, {
          no: 14,
          name: "lines_cutoff_start",
          kind: "scalar",
          T: 5
      }, {
          no: 15,
          name: "lines_cutoff_end",
          kind: "scalar",
          T: 5
      }, {
          no: 16,
          name: "timestamp",
          kind: "message",
          T: Je
      }, {
          no: 17,
          name: "is_dirty",
          kind: "scalar",
          T: 8
      }]));
      static fromBinary(e, t) {
          return (new dr).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new dr).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new dr).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(dr, e, t)
      }
  }
  class Er extends (null) {
      otherDocuments = [];
      codeContextItems = [];
      constructor(e) {
          super(),
          proto3.util.initPartial(e, this)
      }
      static runtime = null;
      static typeName = null;
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "document",
          kind: "message",
          T: dr
      }, {
          no: 2,
          name: "other_documents",
          kind: "message",
          T: dr,
          repeated: !0
      }, {
          no: 3,
          name: "code_context_items",
          kind: "message",
          T: On,
          repeated: !0
      }]));
      static fromBinary(e, t) {
          return (new Er).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new Er).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new Er).fromJsonString(e, t)
      }
      static equals(e, t) {
          return proto3.util.equals(Er, e, t)
      }
  }
  class Tr extends d {
      chunk = {
          case: void 0
      };
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.codeium_common_pb.TextOrScopeItem";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "text",
          kind: "scalar",
          T: 9,
          oneof: "chunk"
      }, {
          no: 2,
          name: "item",
          kind: "message",
          T: Zn,
          oneof: "chunk"
      }]));
      static fromBinary(e, t) {
          return (new Tr).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new Tr).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new Tr).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(Tr, e, t)
      }
  }
  class fr extends d {
      matchRepoName = "";
      matchPath = "";
      pinnedContexts = [];
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.codeium_common_pb.PinnedContextConfig";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "match_repo_name",
          kind: "scalar",
          T: 9
      }, {
          no: 2,
          name: "match_path",
          kind: "scalar",
          T: 9
      }, {
          no: 3,
          name: "pinned_contexts",
          kind: "message",
          T: pr,
          repeated: !0
      }]));
      static fromBinary(e, t) {
          return (new fr).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new fr).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new fr).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(fr, e, t)
      }
  }
  class pr extends d {
      contextItem = {
          case: void 0
      };
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.codeium_common_pb.PinnedContext";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "repository_path",
          kind: "message",
          T: Sr,
          oneof: "context_item"
      }]));
      static fromBinary(e, t) {
          return (new pr).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new pr).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new pr).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(pr, e, t)
      }
  }
  class Sr extends d {
      remoteRepoName = "";
      version = "";
      relativePath = "";
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.codeium_common_pb.RepositoryPath";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "remote_repo_name",
          kind: "scalar",
          T: 9
      }, {
          no: 2,
          name: "version",
          kind: "scalar",
          T: 9
      }, {
          no: 3,
          name: "relative_path",
          kind: "scalar",
          T: 9
      }]));
      static fromBinary(e, t) {
          return (new Sr).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new Sr).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new Sr).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(Sr, e, t)
      }
  }
  class Nr extends (null) {
      pinnedContextConfigs = [];
      constructor(e) {
          super(),
          proto3.util.initPartial(e, this)
      }
      static runtime = null;
      static typeName = null;
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "pinned_context_configs",
          kind: "message",
          T: fr,
          repeated: !0
      }]));
      static fromBinary(e, t) {
          return (new Nr).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new Nr).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new Nr).fromJsonString(e, t)
      }
      static equals(e, t) {
          return proto3.util.equals(Nr, e, t)
      }
  }
  class gr extends d {
      id = "";
      prompt = "";
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.codeium_common_pb.Rule";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "id",
          kind: "scalar",
          T: 9
      }, {
          no: 2,
          name: "prompt",
          kind: "scalar",
          T: 9
      }]));
      static fromBinary(e, t) {
          return (new gr).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new gr).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new gr).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(gr, e, t)
      }
  }
  class Ir extends (null) {
      id = "";
      startLine = 0;
      endLine = 0;
      constructor(e) {
          super(),
          proto3.util.initPartial(e, this)
      }
      static runtime = null;
      static typeName = null;
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "id",
          kind: "scalar",
          T: 9
      }, {
          no: 2,
          name: "rule",
          kind: "message",
          T: gr
      }, {
          no: 3,
          name: "start_line",
          kind: "scalar",
          T: 5
      }, {
          no: 4,
          name: "end_line",
          kind: "scalar",
          T: 5
      }]));
      static fromBinary(e, t) {
          return (new Ir).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new Ir).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new Ir).fromJsonString(e, t)
      }
      static equals(e, t) {
          return proto3.util.equals(Ir, e, t)
      }
  }
  class Cr extends d {
      logs = [];
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.codeium_common_pb.LanguageServerDiagnostics";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "logs",
          kind: "scalar",
          T: 9,
          repeated: !0
      }]));
      static fromBinary(e, t) {
          return (new Cr).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new Cr).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new Cr).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(Cr, e, t)
      }
  }
  class Or extends (null) {
      constructor(e) {
          super(),
          proto3.util.initPartial(e, this)
      }
      static runtime = null;
      static typeName = null;
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "database",
          kind: "message",
          T: yr
      }]));
      static fromBinary(e, t) {
          return (new Or).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new Or).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new Or).fromJsonString(e, t)
      }
      static equals(e, t) {
          return proto3.util.equals(Or, e, t)
      }
  }
  class yr extends d {
      backend = {
          case: void 0
      };
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.codeium_common_pb.IndexerDbStats";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "local_sqlite_faiss",
          kind: "message",
          T: wr,
          oneof: "backend"
      }, {
          no: 2,
          name: "postgres",
          kind: "message",
          T: Pr,
          oneof: "backend"
      }]));
      static fromBinary(e, t) {
          return (new yr).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new yr).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new yr).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(yr, e, t)
      }
  }
  class wr extends d {
      faissStateStats = [];
      totalItemCount = y.zero;
      quantized = !1;
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.codeium_common_pb.LocalSqliteFaissDbStats";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "faiss_state_stats",
          kind: "message",
          T: Ar,
          repeated: !0
      }, {
          no: 2,
          name: "total_item_count",
          kind: "scalar",
          T: 3
      }, {
          no: 3,
          name: "quantized",
          kind: "scalar",
          T: 8
      }]));
      static fromBinary(e, t) {
          return (new wr).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new wr).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new wr).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(wr, e, t)
      }
  }
  class Ar extends d {
      embeddingSource = Xe.UNSPECIFIED;
      workspace = "";
      itemCount = y.zero;
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.codeium_common_pb.FaissStateStats";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "embedding_source",
          kind: "enum",
          T: Le.getEnumType(Xe)
      }, {
          no: 2,
          name: "workspace",
          kind: "scalar",
          T: 9
      }, {
          no: 3,
          name: "item_count",
          kind: "scalar",
          T: 3
      }]));
      static fromBinary(e, t) {
          return (new Ar).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new Ar).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new Ar).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(Ar, e, t)
      }
  }
  class Pr extends d {
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.codeium_common_pb.PostgresDbStats";
      static fields = Le.util.newFieldList(( () => []));
      static fromBinary(e, t) {
          return (new Pr).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new Pr).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new Pr).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(Pr, e, t)
      }
  }
  class Lr extends (null) {
      type = wt.UNSPECIFIED;
      constructor(e) {
          super(),
          proto3.util.initPartial(e, this)
      }
      static runtime = null;
      static typeName = null;
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "time",
          kind: "message",
          T: Je
      }, {
          no: 2,
          name: "type",
          kind: "enum",
          T: Le.getEnumType(wt)
      }]));
      static fromBinary(e, t) {
          return (new Lr).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new Lr).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new Lr).fromJsonString(e, t)
      }
      static equals(e, t) {
          return proto3.util.equals(Lr, e, t)
      }
  }
  class Rr extends d {
      model = Fe.MODEL_UNSPECIFIED;
      inputTokens = y.zero;
      outputTokens = y.zero;
      cacheWriteTokens = y.zero;
      cacheReadTokens = y.zero;
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.codeium_common_pb.ModelUsageStats";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "model",
          kind: "enum",
          T: Le.getEnumType(Fe)
      }, {
          no: 2,
          name: "input_tokens",
          kind: "scalar",
          T: 4
      }, {
          no: 3,
          name: "output_tokens",
          kind: "scalar",
          T: 4
      }, {
          no: 4,
          name: "cache_write_tokens",
          kind: "scalar",
          T: 4
      }, {
          no: 5,
          name: "cache_read_tokens",
          kind: "scalar",
          T: 4
      }]));
      static fromBinary(e, t) {
          return (new Rr).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new Rr).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new Rr).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(Rr, e, t)
      }
  }
  class kr extends d {
      reason = "";
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.codeium_common_pb.SuperCompleteFilterReason";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "reason",
          kind: "scalar",
          T: 9
      }]));
      static fromBinary(e, t) {
          return (new kr).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new kr).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new kr).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(kr, e, t)
      }
  }
  class Jr extends d {
      message = "";
      severity = "";
      source = "";
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.codeium_common_pb.CodeDiagnostic";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "range",
          kind: "message",
          T: _r
      }, {
          no: 2,
          name: "message",
          kind: "scalar",
          T: 9
      }, {
          no: 3,
          name: "severity",
          kind: "scalar",
          T: 9
      }, {
          no: 4,
          name: "source",
          kind: "scalar",
          T: 9
      }]));
      static fromBinary(e, t) {
          return (new Jr).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new Jr).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new Jr).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(Jr, e, t)
      }
  }
  class Dr extends d {
      overlappedCodeContextItems = [];
      firstElementSuffixOverlap = 0;
      lastElementPrefixOverlap = 0;
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.codeium_common_pb.DocumentLinesElement";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "document_query",
          kind: "message",
          T: hr
      }, {
          no: 2,
          name: "overlapped_code_context_items",
          kind: "message",
          T: On,
          repeated: !0
      }, {
          no: 3,
          name: "first_element_suffix_overlap",
          kind: "scalar",
          T: 13
      }, {
          no: 4,
          name: "last_element_prefix_overlap",
          kind: "scalar",
          T: 13
      }]));
      static fromBinary(e, t) {
          return (new Dr).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new Dr).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new Dr).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(Dr, e, t)
      }
  }
  class hr extends d {
      text = "";
      cursorOffset = 0;
      startLine = 0;
      endLine = 0;
      useCharacterPosition = !1;
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.codeium_common_pb.DocumentQuery";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "text",
          kind: "scalar",
          T: 9
      }, {
          no: 2,
          name: "cursor_offset",
          kind: "scalar",
          T: 5
      }, {
          no: 3,
          name: "start_line",
          kind: "scalar",
          T: 13
      }, {
          no: 4,
          name: "end_line",
          kind: "scalar",
          T: 13
      }, {
          no: 5,
          name: "use_character_position",
          kind: "scalar",
          T: 8
      }]));
      static fromBinary(e, t) {
          return (new hr).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new hr).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new hr).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(hr, e, t)
      }
  }
  class xr extends d {
      element = {
          case: void 0
      };
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.codeium_common_pb.DocumentOutlineElement";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "code_context_item",
          kind: "message",
          T: On,
          oneof: "element"
      }, {
          no: 2,
          name: "document_lines_element",
          kind: "message",
          T: Dr,
          oneof: "element"
      }, {
          no: 3,
          name: "text",
          kind: "scalar",
          T: 9,
          oneof: "element"
      }]));
      static fromBinary(e, t) {
          return (new xr).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new xr).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new xr).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(xr, e, t)
      }
  }
  class Ur extends d {
      elements = [];
      startIndex = y.zero;
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.codeium_common_pb.DocumentOutline";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "elements",
          kind: "message",
          T: xr,
          repeated: !0
      }, {
          no: 2,
          name: "start_index",
          kind: "scalar",
          T: 3
      }]));
      static fromBinary(e, t) {
          return (new Ur).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new Ur).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new Ur).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(Ur, e, t)
      }
  }
  class Mr extends (null) {
      eventName = "";
      apiKey = "";
      installationId = "";
      ideName = "";
      os = "";
      codeiumVersion = "";
      ideVersion = "";
      durationMs = protoInt64.zero;
      extra = {};
      constructor(e) {
          super(),
          proto3.util.initPartial(e, this)
      }
      static runtime = null;
      static typeName = null;
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "event_name",
          kind: "scalar",
          T: 9
      }, {
          no: 2,
          name: "api_key",
          kind: "scalar",
          T: 9
      }, {
          no: 3,
          name: "installation_id",
          kind: "scalar",
          T: 9
      }, {
          no: 4,
          name: "ide_name",
          kind: "scalar",
          T: 9
      }, {
          no: 5,
          name: "os",
          kind: "scalar",
          T: 9
      }, {
          no: 6,
          name: "codeium_version",
          kind: "scalar",
          T: 9
      }, {
          no: 7,
          name: "ide_version",
          kind: "scalar",
          T: 9
      }, {
          no: 8,
          name: "duration_ms",
          kind: "scalar",
          T: 4
      }, {
          no: 9,
          name: "extra",
          kind: "map",
          K: 9,
          V: {
              kind: "scalar",
              T: 9
          }
      }]));
      static fromBinary(e, t) {
          return (new Mr).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new Mr).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new Mr).fromJsonString(e, t)
      }
      static equals(e, t) {
          return proto3.util.equals(Mr, e, t)
      }
  }
  class Br extends d {
      id = "";
      name = "";
      description = "";
      codebaseRootUri = "";
      fileNames = [];
      commitMessages = [];
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.codeium_common_pb.CodebaseCluster";
      static fields = Le.util.newFieldList(( () => [{
          no: 5,
          name: "id",
          kind: "scalar",
          T: 9
      }, {
          no: 1,
          name: "name",
          kind: "scalar",
          T: 9
      }, {
          no: 2,
          name: "description",
          kind: "scalar",
          T: 9
      }, {
          no: 6,
          name: "codebase_root_uri",
          kind: "scalar",
          T: 9
      }, {
          no: 3,
          name: "file_names",
          kind: "scalar",
          T: 9,
          repeated: !0
      }, {
          no: 4,
          name: "commit_messages",
          kind: "scalar",
          T: 9,
          repeated: !0
      }]));
      static fromBinary(e, t) {
          return (new Br).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new Br).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new Br).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(Br, e, t)
      }
  }
  class Fr extends (null) {
      clusters = [];
      constructor(e) {
          super(),
          proto3.util.initPartial(e, this)
      }
      static runtime = null;
      static typeName = null;
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "clusters",
          kind: "message",
          T: Br,
          repeated: !0
      }]));
      static fromBinary(e, t) {
          return (new Fr).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new Fr).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new Fr).fromJsonString(e, t)
      }
      static equals(e, t) {
          return proto3.util.equals(Fr, e, t)
      }
  }
  class br extends d {
      text = "";
      position = 0;
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.codeium_common_pb.KnowledgeBaseChunk";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "text",
          kind: "scalar",
          T: 9
      }, {
          no: 2,
          name: "position",
          kind: "scalar",
          T: 5
      }]));
      static fromBinary(e, t) {
          return (new br).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new br).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new br).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(br, e, t)
      }
  }
  class qr extends d {
      documentId = "";
      url = "";
      title = "";
      chunks = [];
      text = "";
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.codeium_common_pb.KnowledgeBaseItem";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "document_id",
          kind: "scalar",
          T: 9
      }, {
          no: 3,
          name: "url",
          kind: "scalar",
          T: 9
      }, {
          no: 4,
          name: "title",
          kind: "scalar",
          T: 9
      }, {
          no: 5,
          name: "timestamp",
          kind: "message",
          T: Je
      }, {
          no: 6,
          name: "chunks",
          kind: "message",
          T: br,
          repeated: !0
      }, {
          no: 2,
          name: "text",
          kind: "scalar",
          T: 9
      }]));
      static fromBinary(e, t) {
          return (new qr).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new qr).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new qr).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(qr, e, t)
      }
  }
  class Gr extends d {
      score = 0;
      indexName = "";
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.codeium_common_pb.KnowledgeBaseItemWithMetadata";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "knowledge_base_item",
          kind: "message",
          T: qr
      }, {
          no: 2,
          name: "score",
          kind: "scalar",
          T: 2
      }, {
          no: 3,
          name: "index_name",
          kind: "scalar",
          T: 9
      }]));
      static fromBinary(e, t) {
          return (new Gr).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new Gr).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new Gr).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(Gr, e, t)
      }
  }
  class vr extends d {
      description = "";
      children = [];
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.codeium_common_pb.KnowledgeBaseGroup";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "description",
          kind: "scalar",
          T: 9
      }, {
          no: 2,
          name: "item",
          kind: "message",
          T: Gr
      }, {
          no: 3,
          name: "children",
          kind: "message",
          T: vr,
          repeated: !0
      }]));
      static fromBinary(e, t) {
          return (new vr).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new vr).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new vr).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(vr, e, t)
      }
  }
  class Hr extends d {
      command = "";
      cwd = "";
      shellPid = 0;
      output = "";
      exitCode = 0;
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.codeium_common_pb.TerminalShellCommand";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "command",
          kind: "scalar",
          T: 9
      }, {
          no: 2,
          name: "cwd",
          kind: "scalar",
          T: 9
      }, {
          no: 3,
          name: "shell_pid",
          kind: "scalar",
          T: 13
      }, {
          no: 4,
          name: "output",
          kind: "scalar",
          T: 9
      }, {
          no: 5,
          name: "exit_code",
          kind: "scalar",
          T: 13
      }, {
          no: 6,
          name: "start_time",
          kind: "message",
          T: Je
      }, {
          no: 7,
          name: "end_time",
          kind: "message",
          T: Je
      }]));
      static fromBinary(e, t) {
          return (new Hr).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new Hr).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new Hr).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(Hr, e, t)
      }
  }
  const Vr = new Map([["text/x-csrc", Qe.C], ["text/x-c++src", Qe.CPP], ["text/x-csharp", Qe.CSHARP], ["text/x-java", Qe.JAVA], ["text/x-kotlin", Qe.KOTLIN], ["text/x-objectivec", Qe.OBJECTIVEC], ["text/x-objectivec++", Qe.OBJECTIVECPP], ["text/x-scala", Qe.SCALA], ["text/css", Qe.CSS], ["text/x-less", Qe.LESS], ["text/x-sass", Qe.SASS], ["text/x-scss", Qe.SCSS], ["application/json", Qe.JSON], ["application/x-json", Qe.JSON], ["application/ld+json", Qe.JSON], ["application/typescript", Qe.TYPESCRIPT], ["text/jsx", Qe.JAVASCRIPT], ["text/typescript-jsx", Qe.TSX], ["text/x-ocaml", Qe.OCAML], ["text/x-ipython", Qe.PYTHON]])
    , Xr = new Map([["clojure", Qe.CLOJURE], ["coffeescript", Qe.COFFEESCRIPT], ["python", Qe.PYTHON], ["sql", Qe.SQL], ["dart", Qe.DART], ["gfm", Qe.MARKDOWN], ["go", Qe.GO], ["groovy", Qe.GROOVY], ["haskell", Qe.HASKELL], ["haskell-literate", Qe.HASKELL], ["htmlmixed", Qe.HTML], ["javascript", Qe.JAVASCRIPT], ["julia", Qe.JULIA], ["lua", Qe.LUA], ["markdown", Qe.MARKDOWN], ["perl", Qe.PERL], ["php", Qe.PHP], ["null", Qe.PLAINTEXT], ["protobuf", Qe.PROTOBUF], ["r", Qe.R], ["rst", Qe.RST], ["ruby", Qe.RUBY], ["rust", Qe.RUST], ["shell", Qe.SHELL], ["swift", Qe.SWIFT], ["stex", Qe.LATEX], ["toml", Qe.TOML], ["vue", Qe.VUE], ["xml", Qe.XML], ["yaml", Qe.YAML], ["ipython", Qe.PYTHON], ["ipythongfm", Qe.MARKDOWN]])
    , Yr = new Map([[/^BUILD$/, Qe.STARLARK], [/^.+\.bzl$/, Qe.STARLARK]]);
  function Kr(e) {
      return void 0 !== e.getMode() ? e.getMode() : e.modeOption
  }
  function Wr(e, t) {
      if (void 0 !== t) {
          const e = t.split("/").pop() ?? "";
          for (const [t,n] of Yr)
              if (t.test(e))
                  return n
      }
      const n = e.getEditor()?.getOption("mode") ?? e.modeOption;
      if ("string" == typeof n) {
          const e = Vr.get(n);
          if (void 0 !== e)
              return e
      }
      return Xr.get(Kr(e).name) ?? Qe.UNSPECIFIED
  }
  const zr = {
      randomUUID: "undefined" != typeof crypto && crypto.randomUUID && crypto.randomUUID.bind(crypto)
  };
  let jr;
  const $r = new Uint8Array(16);
  function Qr() {
      if (!jr && (jr = "undefined" != typeof crypto && crypto.getRandomValues && crypto.getRandomValues.bind(crypto),
      !jr))
          throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");
      return jr($r)
  }
  const Zr = [];
  for (let e = 0; e < 256; ++e)
      Zr.push((e + 256).toString(16).slice(1));
  const ea = function(e, t, n) {
      if (zr.randomUUID && !t && !e)
          return zr.randomUUID();
      const r = (e = e || {}).random || (e.rng || Qr)();
      if (r[6] = 15 & r[6] | 64,
      r[8] = 63 & r[8] | 128,
      t) {
          n = n || 0;
          for (let e = 0; e < 16; ++e)
              t[n + e] = r[e];
          return t
      }
      return function(e, t=0) {
          return (Zr[e[t + 0]] + Zr[e[t + 1]] + Zr[e[t + 2]] + Zr[e[t + 3]] + "-" + Zr[e[t + 4]] + Zr[e[t + 5]] + "-" + Zr[e[t + 6]] + Zr[e[t + 7]] + "-" + Zr[e[t + 8]] + Zr[e[t + 9]] + "-" + Zr[e[t + 10]] + Zr[e[t + 11]] + Zr[e[t + 12]] + Zr[e[t + 13]] + Zr[e[t + 14]] + Zr[e[t + 15]]).toLowerCase()
      }(r)
  };
  let ta, na, ra, aa, ia, sa, oa, ma, ca, ua, la, _a, da, Ea, Ta, fa, pa, Sa, Na, ga, Ia, Ca, Oa, ya, wa, Aa, Pa, La, Ra, ka, Ja, Da, ha, xa, Ua, Ma, Ba, Fa;
  [/https:\/\/colab.research\.google\.com\/.*/, /https:\/\/(.*\.)?stackblitz\.com\/.*/, /https:\/\/(.*\.)?deepnote\.com\/.*/, /https:\/\/(.*\.)?(databricks\.com|azuredatabricks\.net)\/.*/, /https:\/\/(.*\.)?quadratichq\.com\/.*/, /https?:\/\/(.*\.)?jsfiddle\.net(\/.*)?/, /https:\/\/(.*\.)?codepen\.io(\/.*)?/, /https:\/\/(.*\.)?codeshare\.io(\/.*)?/, /https:\/\/console\.paperspace\.com\/.*\/notebook\/.*/, /https?:\/\/www\.codewars\.com(\/.*)?/, /https:\/\/(.*\.)?github\.com(\/.*)?/, /http:\/\/(localhost|127\.0\.0\.1):[0-9]+\/.*\.ipynb/, /https:\/\/(.*\.)?script.google.com(\/.*)?/].map((e => e.source)),
  function(e) {
      e[e.UNSPECIFIED = 0] = "UNSPECIFIED",
      e[e.INSERT = 1] = "INSERT",
      e[e.DELETE = 2] = "DELETE",
      e[e.UNCHANGED = 3] = "UNCHANGED"
  }(ta || (ta = {})),
  Le.util.setEnumType(ta, "exa.diff_action_pb.UnifiedDiffLineType", [{
      no: 0,
      name: "UNIFIED_DIFF_LINE_TYPE_UNSPECIFIED"
  }, {
      no: 1,
      name: "UNIFIED_DIFF_LINE_TYPE_INSERT"
  }, {
      no: 2,
      name: "UNIFIED_DIFF_LINE_TYPE_DELETE"
  }, {
      no: 3,
      name: "UNIFIED_DIFF_LINE_TYPE_UNCHANGED"
  }]),
  function(e) {
      e[e.UNSPECIFIED = 0] = "UNSPECIFIED",
      e[e.INSERT = 1] = "INSERT",
      e[e.DELETE = 2] = "DELETE",
      e[e.UNCHANGED = 3] = "UNCHANGED"
  }(na || (na = {})),
  Le.util.setEnumType(na, "exa.diff_action_pb.DiffChangeType", [{
      no: 0,
      name: "DIFF_CHANGE_TYPE_UNSPECIFIED"
  }, {
      no: 1,
      name: "DIFF_CHANGE_TYPE_INSERT"
  }, {
      no: 2,
      name: "DIFF_CHANGE_TYPE_DELETE"
  }, {
      no: 3,
      name: "DIFF_CHANGE_TYPE_UNCHANGED"
  }]),
  function(e) {
      e[e.UNSPECIFIED = 0] = "UNSPECIFIED",
      e[e.UNIFIED = 1] = "UNIFIED",
      e[e.CHARACTER = 2] = "CHARACTER",
      e[e.COMBO = 3] = "COMBO",
      e[e.TMP_SUPERCOMPLETE = 4] = "TMP_SUPERCOMPLETE"
  }(ra || (ra = {})),
  Le.util.setEnumType(ra, "exa.diff_action_pb.DiffType", [{
      no: 0,
      name: "DIFF_TYPE_UNSPECIFIED"
  }, {
      no: 1,
      name: "DIFF_TYPE_UNIFIED"
  }, {
      no: 2,
      name: "DIFF_TYPE_CHARACTER"
  }, {
      no: 3,
      name: "DIFF_TYPE_COMBO"
  }, {
      no: 4,
      name: "DIFF_TYPE_TMP_SUPERCOMPLETE"
  }]);
  class ba extends d {
      lines = [];
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.diff_action_pb.UnifiedDiff";
      static fields = Le.util.newFieldList(( () => [{
          no: 3,
          name: "lines",
          kind: "message",
          T: qa,
          repeated: !0
      }]));
      static fromBinary(e, t) {
          return (new ba).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new ba).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new ba).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(ba, e, t)
      }
  }
  class qa extends d {
      text = "";
      type = ta.UNSPECIFIED;
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.diff_action_pb.UnifiedDiff.UnifiedDiffLine";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "text",
          kind: "scalar",
          T: 9
      }, {
          no: 2,
          name: "type",
          kind: "enum",
          T: Le.getEnumType(ta)
      }]));
      static fromBinary(e, t) {
          return (new qa).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new qa).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new qa).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(qa, e, t)
      }
  }
  class Ga extends d {
      startLine = 0;
      endLine = 0;
      fromLanguage = Qe.UNSPECIFIED;
      toLanguage = Qe.UNSPECIFIED;
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.diff_action_pb.DiffBlock";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "start_line",
          kind: "scalar",
          T: 5
      }, {
          no: 2,
          name: "end_line",
          kind: "scalar",
          T: 5
      }, {
          no: 3,
          name: "unified_diff",
          kind: "message",
          T: ba
      }, {
          no: 4,
          name: "from_language",
          kind: "enum",
          T: Le.getEnumType(Qe)
      }, {
          no: 5,
          name: "to_language",
          kind: "enum",
          T: Le.getEnumType(Qe)
      }]));
      static fromBinary(e, t) {
          return (new Ga).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new Ga).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new Ga).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(Ga, e, t)
      }
  }
  class va extends d {
      text = "";
      type = na.UNSPECIFIED;
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.diff_action_pb.CharacterDiffChange";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "text",
          kind: "scalar",
          T: 9
      }, {
          no: 2,
          name: "type",
          kind: "enum",
          T: Le.getEnumType(na)
      }]));
      static fromBinary(e, t) {
          return (new va).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new va).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new va).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(va, e, t)
      }
  }
  class Ha extends d {
      changes = [];
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.diff_action_pb.CharacterDiff";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "changes",
          kind: "message",
          T: va,
          repeated: !0
      }]));
      static fromBinary(e, t) {
          return (new Ha).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new Ha).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new Ha).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(Ha, e, t)
      }
  }
  class Va extends d {
      text = "";
      type = na.UNSPECIFIED;
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.diff_action_pb.ComboDiffLine";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "text",
          kind: "scalar",
          T: 9
      }, {
          no: 2,
          name: "type",
          kind: "enum",
          T: Le.getEnumType(na)
      }, {
          no: 3,
          name: "character_diff",
          kind: "message",
          T: Ha
      }]));
      static fromBinary(e, t) {
          return (new Va).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new Va).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new Va).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(Va, e, t)
      }
  }
  class Xa extends d {
      lines = [];
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.diff_action_pb.ComboDiff";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "lines",
          kind: "message",
          T: Va,
          repeated: !0
      }]));
      static fromBinary(e, t) {
          return (new Xa).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new Xa).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new Xa).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(Xa, e, t)
      }
  }
  class Ya extends (null) {
      constructor(e) {
          super(),
          proto3.util.initPartial(e, this)
      }
      static runtime = null;
      static typeName = null;
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "unified_diff",
          kind: "message",
          T: ba
      }, {
          no: 2,
          name: "character_diff",
          kind: "message",
          T: Ha
      }, {
          no: 3,
          name: "combo_diff",
          kind: "message",
          T: Xa
      }]));
      static fromBinary(e, t) {
          return (new Ya).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new Ya).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new Ya).fromJsonString(e, t)
      }
      static equals(e, t) {
          return proto3.util.equals(Ya, e, t)
      }
  }
  class Ka extends d {
      diffs = [];
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.diff_action_pb.DiffList";
      static fields = Le.util.newFieldList(( () => [{
          no: 2,
          name: "diffs",
          kind: "message",
          T: Ga,
          repeated: !0
      }]));
      static fromBinary(e, t) {
          return (new Ka).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new Ka).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new Ka).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(Ka, e, t)
      }
  }
  !function(e) {
      e[e.FEEDBACK_TYPE_UNSPECIFIED = 0] = "FEEDBACK_TYPE_UNSPECIFIED",
      e[e.FEEDBACK_TYPE_ACCEPT = 1] = "FEEDBACK_TYPE_ACCEPT",
      e[e.FEEDBACK_TYPE_REJECT = 2] = "FEEDBACK_TYPE_REJECT",
      e[e.FEEDBACK_TYPE_COPIED = 3] = "FEEDBACK_TYPE_COPIED",
      e[e.FEEDBACK_TYPE_ACCEPT_DIFF = 4] = "FEEDBACK_TYPE_ACCEPT_DIFF",
      e[e.FEEDBACK_TYPE_REJECT_DIFF = 5] = "FEEDBACK_TYPE_REJECT_DIFF",
      e[e.FEEDBACK_TYPE_APPLY_DIFF = 6] = "FEEDBACK_TYPE_APPLY_DIFF",
      e[e.FEEDBACK_TYPE_INSERT_AT_CURSOR = 7] = "FEEDBACK_TYPE_INSERT_AT_CURSOR"
  }(aa || (aa = {})),
  Le.util.setEnumType(aa, "exa.chat_pb.ChatFeedbackType", [{
      no: 0,
      name: "FEEDBACK_TYPE_UNSPECIFIED"
  }, {
      no: 1,
      name: "FEEDBACK_TYPE_ACCEPT"
  }, {
      no: 2,
      name: "FEEDBACK_TYPE_REJECT"
  }, {
      no: 3,
      name: "FEEDBACK_TYPE_COPIED"
  }, {
      no: 4,
      name: "FEEDBACK_TYPE_ACCEPT_DIFF"
  }, {
      no: 5,
      name: "FEEDBACK_TYPE_REJECT_DIFF"
  }, {
      no: 6,
      name: "FEEDBACK_TYPE_APPLY_DIFF"
  }, {
      no: 7,
      name: "FEEDBACK_TYPE_INSERT_AT_CURSOR"
  }]),
  function(e) {
      e[e.CHAT_INTENT_UNSPECIFIED = 0] = "CHAT_INTENT_UNSPECIFIED",
      e[e.CHAT_INTENT_GENERIC = 1] = "CHAT_INTENT_GENERIC",
      e[e.CHAT_INTENT_FUNCTION_EXPLAIN = 2] = "CHAT_INTENT_FUNCTION_EXPLAIN",
      e[e.CHAT_INTENT_FUNCTION_DOCSTRING = 3] = "CHAT_INTENT_FUNCTION_DOCSTRING",
      e[e.CHAT_INTENT_FUNCTION_REFACTOR = 4] = "CHAT_INTENT_FUNCTION_REFACTOR",
      e[e.CHAT_INTENT_CODE_BLOCK_EXPLAIN = 5] = "CHAT_INTENT_CODE_BLOCK_EXPLAIN",
      e[e.CHAT_INTENT_CODE_BLOCK_REFACTOR = 6] = "CHAT_INTENT_CODE_BLOCK_REFACTOR",
      e[e.CHAT_INTENT_FUNCTION_UNIT_TESTS = 7] = "CHAT_INTENT_FUNCTION_UNIT_TESTS",
      e[e.CHAT_INTENT_PROBLEM_EXPLAIN = 8] = "CHAT_INTENT_PROBLEM_EXPLAIN",
      e[e.CHAT_INTENT_GENERATE_CODE = 9] = "CHAT_INTENT_GENERATE_CODE",
      e[e.CHAT_INTENT_CLASS_EXPLAIN = 10] = "CHAT_INTENT_CLASS_EXPLAIN",
      e[e.CHAT_INTENT_SEARCH = 11] = "CHAT_INTENT_SEARCH",
      e[e.CHAT_INTENT_FAST_APPLY = 12] = "CHAT_INTENT_FAST_APPLY"
  }(ia || (ia = {})),
  Le.util.setEnumType(ia, "exa.chat_pb.ChatIntentType", [{
      no: 0,
      name: "CHAT_INTENT_UNSPECIFIED"
  }, {
      no: 1,
      name: "CHAT_INTENT_GENERIC"
  }, {
      no: 2,
      name: "CHAT_INTENT_FUNCTION_EXPLAIN"
  }, {
      no: 3,
      name: "CHAT_INTENT_FUNCTION_DOCSTRING"
  }, {
      no: 4,
      name: "CHAT_INTENT_FUNCTION_REFACTOR"
  }, {
      no: 5,
      name: "CHAT_INTENT_CODE_BLOCK_EXPLAIN"
  }, {
      no: 6,
      name: "CHAT_INTENT_CODE_BLOCK_REFACTOR"
  }, {
      no: 7,
      name: "CHAT_INTENT_FUNCTION_UNIT_TESTS"
  }, {
      no: 8,
      name: "CHAT_INTENT_PROBLEM_EXPLAIN"
  }, {
      no: 9,
      name: "CHAT_INTENT_GENERATE_CODE"
  }, {
      no: 10,
      name: "CHAT_INTENT_CLASS_EXPLAIN"
  }, {
      no: 11,
      name: "CHAT_INTENT_SEARCH"
  }, {
      no: 12,
      name: "CHAT_INTENT_FAST_APPLY"
  }]),
  function(e) {
      e[e.UNSPECIFIED = 0] = "UNSPECIFIED",
      e[e.EPHEMERAL = 1] = "EPHEMERAL"
  }(sa || (sa = {})),
  Le.util.setEnumType(sa, "exa.chat_pb.CacheControlType", [{
      no: 0,
      name: "CACHE_CONTROL_TYPE_UNSPECIFIED"
  }, {
      no: 1,
      name: "CACHE_CONTROL_TYPE_EPHEMERAL"
  }]);
  class Wa extends d {
      rawSource = "";
      startLine = 0;
      startCol = 0;
      endLine = 0;
      endCol = 0;
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.chat_pb.CodeBlockInfo";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "raw_source",
          kind: "scalar",
          T: 9
      }, {
          no: 2,
          name: "start_line",
          kind: "scalar",
          T: 5
      }, {
          no: 3,
          name: "start_col",
          kind: "scalar",
          T: 5
      }, {
          no: 4,
          name: "end_line",
          kind: "scalar",
          T: 5
      }, {
          no: 5,
          name: "end_col",
          kind: "scalar",
          T: 5
      }]));
      static fromBinary(e, t) {
          return (new Wa).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new Wa).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new Wa).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(Wa, e, t)
      }
  }
  class za extends d {
      responseStreamLatencyMs = y.zero;
      refreshContextLatencyMs = y.zero;
      shouldGetLocalContextForChatLatencyMs = y.zero;
      shouldGetLocalContextForChat = !1;
      computeChangeEventsLatencyMs = y.zero;
      contextToChatPromptLatencyMs = y.zero;
      numPromptTokens = 0;
      numSystemPromptTokens = 0;
      numInputTokens = y.zero;
      activeDocumentAbsolutePath = "";
      numIndexedFiles = y.zero;
      numIndexedCodeContextItems = y.zero;
      model = Fe.MODEL_UNSPECIFIED;
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.chat_pb.ChatMetrics";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "response_stream_latency_ms",
          kind: "scalar",
          T: 4
      }, {
          no: 2,
          name: "refresh_context_latency_ms",
          kind: "scalar",
          T: 4
      }, {
          no: 3,
          name: "should_get_local_context_for_chat_latency_ms",
          kind: "scalar",
          T: 4
      }, {
          no: 4,
          name: "should_get_local_context_for_chat",
          kind: "scalar",
          T: 8
      }, {
          no: 5,
          name: "compute_change_events_latency_ms",
          kind: "scalar",
          T: 4
      }, {
          no: 6,
          name: "context_to_chat_prompt_latency_ms",
          kind: "scalar",
          T: 4
      }, {
          no: 7,
          name: "num_prompt_tokens",
          kind: "scalar",
          T: 5
      }, {
          no: 8,
          name: "num_system_prompt_tokens",
          kind: "scalar",
          T: 5
      }, {
          no: 16,
          name: "num_input_tokens",
          kind: "scalar",
          T: 4
      }, {
          no: 9,
          name: "start_timestamp",
          kind: "message",
          T: Je
      }, {
          no: 10,
          name: "end_timestamp",
          kind: "message",
          T: Je
      }, {
          no: 11,
          name: "active_document_absolute_path",
          kind: "scalar",
          T: 9
      }, {
          no: 12,
          name: "last_active_code_context_item",
          kind: "message",
          T: On
      }, {
          no: 13,
          name: "num_indexed_files",
          kind: "scalar",
          T: 4
      }, {
          no: 14,
          name: "num_indexed_code_context_items",
          kind: "scalar",
          T: 4
      }, {
          no: 15,
          name: "model",
          kind: "enum",
          T: Le.getEnumType(Fe)
      }]));
      static fromBinary(e, t) {
          return (new za).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new za).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new za).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(za, e, t)
      }
  }
  class ja extends d {
      text = "";
      items = [];
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.chat_pb.IntentGeneric";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "text",
          kind: "scalar",
          T: 9
      }, {
          no: 2,
          name: "items",
          kind: "message",
          T: Tr,
          repeated: !0
      }]));
      static fromBinary(e, t) {
          return (new ja).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new ja).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new ja).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(ja, e, t)
      }
  }
  class $a extends d {
      language = Qe.UNSPECIFIED;
      filePathMigrateMeToUri = "";
      uri = "";
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.chat_pb.IntentFunctionExplain";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "function_info",
          kind: "message",
          T: Sn
      }, {
          no: 2,
          name: "language",
          kind: "enum",
          T: Le.getEnumType(Qe)
      }, {
          no: 3,
          name: "file_path_migrate_me_to_uri",
          kind: "scalar",
          T: 9
      }, {
          no: 4,
          name: "uri",
          kind: "scalar",
          T: 9
      }]));
      static fromBinary(e, t) {
          return (new $a).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new $a).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new $a).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals($a, e, t)
      }
  }
  class Qa extends d {
      language = Qe.UNSPECIFIED;
      filePathMigrateMeToUri = "";
      refactorDescription = "";
      uri = "";
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.chat_pb.IntentFunctionRefactor";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "function_info",
          kind: "message",
          T: Sn
      }, {
          no: 2,
          name: "language",
          kind: "enum",
          T: Le.getEnumType(Qe)
      }, {
          no: 3,
          name: "file_path_migrate_me_to_uri",
          kind: "scalar",
          T: 9
      }, {
          no: 4,
          name: "refactor_description",
          kind: "scalar",
          T: 9
      }, {
          no: 5,
          name: "uri",
          kind: "scalar",
          T: 9
      }]));
      static fromBinary(e, t) {
          return (new Qa).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new Qa).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new Qa).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(Qa, e, t)
      }
  }
  class Za extends d {
      language = Qe.UNSPECIFIED;
      filePathMigrateMeToUri = "";
      uri = "";
      instructions = "";
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.chat_pb.IntentFunctionUnitTests";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "function_info",
          kind: "message",
          T: Sn
      }, {
          no: 2,
          name: "language",
          kind: "enum",
          T: Le.getEnumType(Qe)
      }, {
          no: 3,
          name: "file_path_migrate_me_to_uri",
          kind: "scalar",
          T: 9
      }, {
          no: 5,
          name: "uri",
          kind: "scalar",
          T: 9
      }, {
          no: 4,
          name: "instructions",
          kind: "scalar",
          T: 9
      }]));
      static fromBinary(e, t) {
          return (new Za).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new Za).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new Za).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(Za, e, t)
      }
  }
  class ei extends d {
      language = Qe.UNSPECIFIED;
      filePathMigrateMeToUri = "";
      uri = "";
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.chat_pb.IntentFunctionDocstring";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "function_info",
          kind: "message",
          T: Sn
      }, {
          no: 2,
          name: "language",
          kind: "enum",
          T: Le.getEnumType(Qe)
      }, {
          no: 3,
          name: "file_path_migrate_me_to_uri",
          kind: "scalar",
          T: 9
      }, {
          no: 4,
          name: "uri",
          kind: "scalar",
          T: 9
      }]));
      static fromBinary(e, t) {
          return (new ei).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new ei).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new ei).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(ei, e, t)
      }
  }
  class ti extends d {
      language = Qe.UNSPECIFIED;
      filePathMigrateMeToUri = "";
      uri = "";
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.chat_pb.IntentClassExplain";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "class_info",
          kind: "message",
          T: Nn
      }, {
          no: 2,
          name: "language",
          kind: "enum",
          T: Le.getEnumType(Qe)
      }, {
          no: 3,
          name: "file_path_migrate_me_to_uri",
          kind: "scalar",
          T: 9
      }, {
          no: 4,
          name: "uri",
          kind: "scalar",
          T: 9
      }]));
      static fromBinary(e, t) {
          return (new ti).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new ti).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new ti).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(ti, e, t)
      }
  }
  class ni extends d {
      language = Qe.UNSPECIFIED;
      filePathMigrateMeToUri = "";
      uri = "";
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.chat_pb.IntentCodeBlockExplain";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "code_block_info",
          kind: "message",
          T: Wa
      }, {
          no: 2,
          name: "language",
          kind: "enum",
          T: Le.getEnumType(Qe)
      }, {
          no: 3,
          name: "file_path_migrate_me_to_uri",
          kind: "scalar",
          T: 9
      }, {
          no: 4,
          name: "uri",
          kind: "scalar",
          T: 9
      }]));
      static fromBinary(e, t) {
          return (new ni).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new ni).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new ni).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(ni, e, t)
      }
  }
  class ri extends d {
      language = Qe.UNSPECIFIED;
      filePathMigrateMeToUri = "";
      uri = "";
      refactorDescription = "";
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.chat_pb.IntentCodeBlockRefactor";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "code_block_info",
          kind: "message",
          T: Wa
      }, {
          no: 2,
          name: "language",
          kind: "enum",
          T: Le.getEnumType(Qe)
      }, {
          no: 3,
          name: "file_path_migrate_me_to_uri",
          kind: "scalar",
          T: 9
      }, {
          no: 5,
          name: "uri",
          kind: "scalar",
          T: 9
      }, {
          no: 4,
          name: "refactor_description",
          kind: "scalar",
          T: 9
      }]));
      static fromBinary(e, t) {
          return (new ri).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new ri).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new ri).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(ri, e, t)
      }
  }
  class ai extends d {
      diagnosticMessage = "";
      surroundingCodeSnippet = "";
      language = Qe.UNSPECIFIED;
      filePathMigrateMeToUri = "";
      uri = "";
      lineNumber = 0;
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.chat_pb.IntentProblemExplain";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "diagnostic_message",
          kind: "scalar",
          T: 9
      }, {
          no: 2,
          name: "problematic_code",
          kind: "message",
          T: Wa
      }, {
          no: 3,
          name: "surrounding_code_snippet",
          kind: "scalar",
          T: 9
      }, {
          no: 4,
          name: "language",
          kind: "enum",
          T: Le.getEnumType(Qe)
      }, {
          no: 5,
          name: "file_path_migrate_me_to_uri",
          kind: "scalar",
          T: 9
      }, {
          no: 7,
          name: "uri",
          kind: "scalar",
          T: 9
      }, {
          no: 6,
          name: "line_number",
          kind: "scalar",
          T: 5
      }]));
      static fromBinary(e, t) {
          return (new ai).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new ai).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new ai).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(ai, e, t)
      }
  }
  class ii extends d {
      instruction = "";
      language = Qe.UNSPECIFIED;
      filePathMigrateMeToUri = "";
      uri = "";
      lineNumber = 0;
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.chat_pb.IntentGenerateCode";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "instruction",
          kind: "scalar",
          T: 9
      }, {
          no: 2,
          name: "language",
          kind: "enum",
          T: Le.getEnumType(Qe)
      }, {
          no: 3,
          name: "file_path_migrate_me_to_uri",
          kind: "scalar",
          T: 9
      }, {
          no: 5,
          name: "uri",
          kind: "scalar",
          T: 9
      }, {
          no: 4,
          name: "line_number",
          kind: "scalar",
          T: 5
      }]));
      static fromBinary(e, t) {
          return (new ii).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new ii).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new ii).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(ii, e, t)
      }
  }
  class si extends d {
      query = "";
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.chat_pb.IntentSearch";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "query",
          kind: "scalar",
          T: 9
      }]));
      static fromBinary(e, t) {
          return (new si).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new si).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new si).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(si, e, t)
      }
  }
  class oi extends d {
      diffOutline = "";
      language = Qe.UNSPECIFIED;
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.chat_pb.IntentFastApply";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "diff_outline",
          kind: "scalar",
          T: 9
      }, {
          no: 2,
          name: "language",
          kind: "enum",
          T: Le.getEnumType(Qe)
      }, {
          no: 3,
          name: "old_code",
          kind: "message",
          T: Wa
      }]));
      static fromBinary(e, t) {
          return (new oi).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new oi).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new oi).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(oi, e, t)
      }
  }
  class mi extends d {
      intent = {
          case: void 0
      };
      numTokens = 0;
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.chat_pb.ChatMessageIntent";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "generic",
          kind: "message",
          T: ja,
          oneof: "intent"
      }, {
          no: 2,
          name: "explain_function",
          kind: "message",
          T: $a,
          oneof: "intent"
      }, {
          no: 3,
          name: "function_docstring",
          kind: "message",
          T: ei,
          oneof: "intent"
      }, {
          no: 4,
          name: "function_refactor",
          kind: "message",
          T: Qa,
          oneof: "intent"
      }, {
          no: 5,
          name: "explain_code_block",
          kind: "message",
          T: ni,
          oneof: "intent"
      }, {
          no: 6,
          name: "code_block_refactor",
          kind: "message",
          T: ri,
          oneof: "intent"
      }, {
          no: 7,
          name: "function_unit_tests",
          kind: "message",
          T: Za,
          oneof: "intent"
      }, {
          no: 8,
          name: "problem_explain",
          kind: "message",
          T: ai,
          oneof: "intent"
      }, {
          no: 9,
          name: "generate_code",
          kind: "message",
          T: ii,
          oneof: "intent"
      }, {
          no: 10,
          name: "explain_class",
          kind: "message",
          T: ti,
          oneof: "intent"
      }, {
          no: 11,
          name: "search",
          kind: "message",
          T: si,
          oneof: "intent"
      }, {
          no: 13,
          name: "fast_apply",
          kind: "message",
          T: oi,
          oneof: "intent"
      }, {
          no: 12,
          name: "num_tokens",
          kind: "scalar",
          T: 13
      }]));
      static fromBinary(e, t) {
          return (new mi).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new mi).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new mi).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(mi, e, t)
      }
  }
  class ci extends d {
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.chat_pb.ChatMessageActionSearch";
      static fields = Le.util.newFieldList(( () => []));
      static fromBinary(e, t) {
          return (new ci).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new ci).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new ci).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(ci, e, t)
      }
  }
  class ui extends d {
      filePathMigrateMeToUri = "";
      uri = "";
      language = Qe.UNSPECIFIED;
      textPre = "";
      textPost = "";
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.chat_pb.ChatMessageActionEdit";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "file_path_migrate_me_to_uri",
          kind: "scalar",
          T: 9
      }, {
          no: 6,
          name: "uri",
          kind: "scalar",
          T: 9
      }, {
          no: 2,
          name: "diff",
          kind: "message",
          T: Ga
      }, {
          no: 3,
          name: "language",
          kind: "enum",
          T: Le.getEnumType(Qe)
      }, {
          no: 4,
          name: "text_pre",
          kind: "scalar",
          T: 9
      }, {
          no: 5,
          name: "text_post",
          kind: "scalar",
          T: 9
      }]));
      static fromBinary(e, t) {
          return (new ui).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new ui).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new ui).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(ui, e, t)
      }
  }
  class li extends d {
      text = "";
      displayText = "";
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.chat_pb.ChatMessageActionGeneric";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "text",
          kind: "scalar",
          T: 9
      }, {
          no: 2,
          name: "display_text",
          kind: "scalar",
          T: 9
      }]));
      static fromBinary(e, t) {
          return (new li).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new li).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new li).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(li, e, t)
      }
  }
  class _i extends d {
      isLoading = !1;
      isRelevant = !1;
      querySuggestions = [];
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.chat_pb.ChatMessageStatusContextRelevancy";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "is_loading",
          kind: "scalar",
          T: 8
      }, {
          no: 2,
          name: "is_relevant",
          kind: "scalar",
          T: 8
      }, {
          no: 3,
          name: "query_suggestions",
          kind: "scalar",
          T: 9,
          repeated: !0
      }]));
      static fromBinary(e, t) {
          return (new _i).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new _i).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new _i).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(_i, e, t)
      }
  }
  class di extends d {
      status = {
          case: void 0
      };
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.chat_pb.ChatMessageStatus";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "context_relevancy",
          kind: "message",
          T: _i,
          oneof: "status"
      }]));
      static fromBinary(e, t) {
          return (new di).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new di).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new di).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(di, e, t)
      }
  }
  class Ei extends d {
      text = "";
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.chat_pb.ChatMessageError";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "text",
          kind: "scalar",
          T: 9
      }]));
      static fromBinary(e, t) {
          return (new Ei).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new Ei).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new Ei).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(Ei, e, t)
      }
  }
  class Ti extends d {
      action = {
          case: void 0
      };
      numTokens = 0;
      contextItems = [];
      latestIntent = ia.CHAT_INTENT_UNSPECIFIED;
      knowledgeBaseItems = [];
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.chat_pb.ChatMessageAction";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "generic",
          kind: "message",
          T: li,
          oneof: "action"
      }, {
          no: 3,
          name: "edit",
          kind: "message",
          T: ui,
          oneof: "action"
      }, {
          no: 5,
          name: "search",
          kind: "message",
          T: ci,
          oneof: "action"
      }, {
          no: 2,
          name: "num_tokens",
          kind: "scalar",
          T: 13
      }, {
          no: 4,
          name: "context_items",
          kind: "message",
          T: On,
          repeated: !0
      }, {
          no: 6,
          name: "latest_intent",
          kind: "enum",
          T: Le.getEnumType(ia)
      }, {
          no: 7,
          name: "generation_stats",
          kind: "message",
          T: za
      }, {
          no: 8,
          name: "knowledge_base_items",
          kind: "message",
          T: Gr,
          repeated: !0
      }]));
      static fromBinary(e, t) {
          return (new Ti).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new Ti).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new Ti).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(Ti, e, t)
      }
  }
  class fi extends d {
      messageId = "";
      source = Ze.UNSPECIFIED;
      conversationId = "";
      content = {
          case: void 0
      };
      inProgress = !1;
      redact = !1;
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.chat_pb.ChatMessage";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "message_id",
          kind: "scalar",
          T: 9
      }, {
          no: 2,
          name: "source",
          kind: "enum",
          T: Le.getEnumType(Ze)
      }, {
          no: 3,
          name: "timestamp",
          kind: "message",
          T: Je
      }, {
          no: 4,
          name: "conversation_id",
          kind: "scalar",
          T: 9
      }, {
          no: 5,
          name: "intent",
          kind: "message",
          T: mi,
          oneof: "content"
      }, {
          no: 6,
          name: "action",
          kind: "message",
          T: Ti,
          oneof: "content"
      }, {
          no: 7,
          name: "error",
          kind: "message",
          T: Ei,
          oneof: "content"
      }, {
          no: 8,
          name: "status",
          kind: "message",
          T: di,
          oneof: "content"
      }, {
          no: 9,
          name: "in_progress",
          kind: "scalar",
          T: 8
      }, {
          no: 10,
          name: "request",
          kind: "message",
          T: yi
      }, {
          no: 11,
          name: "redact",
          kind: "scalar",
          T: 8
      }]));
      static fromBinary(e, t) {
          return (new fi).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new fi).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new fi).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(fi, e, t)
      }
  }
  class pi extends (null) {
      messages = [];
      constructor(e) {
          super(),
          proto3.util.initPartial(e, this)
      }
      static runtime = null;
      static typeName = null;
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "messages",
          kind: "message",
          T: fi,
          repeated: !0
      }]));
      static fromBinary(e, t) {
          return (new pi).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new pi).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new pi).fromJsonString(e, t)
      }
      static equals(e, t) {
          return proto3.util.equals(pi, e, t)
      }
  }
  class Si extends d {
      messageId = "";
      source = Ze.UNSPECIFIED;
      prompt = "";
      numTokens = 0;
      safeForCodeTelemetry = !1;
      toolCalls = [];
      toolCallId = "";
      toolResultIsError = !1;
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.chat_pb.ChatMessagePrompt";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "message_id",
          kind: "scalar",
          T: 9
      }, {
          no: 2,
          name: "source",
          kind: "enum",
          T: Le.getEnumType(Ze)
      }, {
          no: 3,
          name: "prompt",
          kind: "scalar",
          T: 9
      }, {
          no: 4,
          name: "num_tokens",
          kind: "scalar",
          T: 13
      }, {
          no: 5,
          name: "safe_for_code_telemetry",
          kind: "scalar",
          T: 8
      }, {
          no: 6,
          name: "tool_calls",
          kind: "message",
          T: cr,
          repeated: !0
      }, {
          no: 7,
          name: "tool_call_id",
          kind: "scalar",
          T: 9
      }, {
          no: 8,
          name: "prompt_cache_options",
          kind: "message",
          T: Ni
      }, {
          no: 9,
          name: "tool_result_is_error",
          kind: "scalar",
          T: 8
      }]));
      static fromBinary(e, t) {
          return (new Si).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new Si).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new Si).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(Si, e, t)
      }
  }
  class Ni extends d {
      type = sa.UNSPECIFIED;
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.chat_pb.PromptCacheOptions";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "type",
          kind: "enum",
          T: Le.getEnumType(sa)
      }]));
      static fromBinary(e, t) {
          return (new Ni).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new Ni).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new Ni).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(Ni, e, t)
      }
  }
  class gi extends d {
      name = "";
      description = "";
      jsonSchemaString = "";
      strict = !1;
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.chat_pb.ChatToolDefinition";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "name",
          kind: "scalar",
          T: 9
      }, {
          no: 2,
          name: "description",
          kind: "scalar",
          T: 9
      }, {
          no: 3,
          name: "json_schema_string",
          kind: "scalar",
          T: 9
      }, {
          no: 4,
          name: "strict",
          kind: "scalar",
          T: 8
      }]));
      static fromBinary(e, t) {
          return (new gi).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new gi).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new gi).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(gi, e, t)
      }
  }
  class Ii extends d {
      choice = {
          case: void 0
      };
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.chat_pb.ChatToolChoice";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "option_name",
          kind: "scalar",
          T: 9,
          oneof: "choice"
      }, {
          no: 2,
          name: "tool_name",
          kind: "scalar",
          T: 9,
          oneof: "choice"
      }]));
      static fromBinary(e, t) {
          return (new Ii).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new Ii).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new Ii).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(Ii, e, t)
      }
  }
  class Ci extends (null) {
      query = "";
      allowedTypes = [];
      includeRepoInfo = !1;
      constructor(e) {
          super(),
          proto3.util.initPartial(e, this)
      }
      static runtime = null;
      static typeName = null;
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "query",
          kind: "scalar",
          T: 9
      }, {
          no: 2,
          name: "allowed_types",
          kind: "enum",
          T: Le.getEnumType(st),
          repeated: !0
      }, {
          no: 3,
          name: "include_repo_info",
          kind: "scalar",
          T: 8
      }]));
      static fromBinary(e, t) {
          return (new Ci).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new Ci).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new Ci).fromJsonString(e, t)
      }
      static equals(e, t) {
          return proto3.util.equals(Ci, e, t)
      }
  }
  class Oi extends (null) {
      cciItems = [];
      repoInfos = [];
      constructor(e) {
          super(),
          proto3.util.initPartial(e, this)
      }
      static runtime = null;
      static typeName = null;
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "cci_items",
          kind: "message",
          T: On,
          repeated: !0
      }, {
          no: 2,
          name: "repo_infos",
          kind: "message",
          T: Cn,
          repeated: !0
      }]));
      static fromBinary(e, t) {
          return (new Oi).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new Oi).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new Oi).fromJsonString(e, t)
      }
      static equals(e, t) {
          return proto3.util.equals(Oi, e, t)
      }
  }
  class yi extends d {
      chatMessages = [];
      openDocumentPathsMigrateMeToUris = [];
      openDocumentUris = [];
      workspacePathsMigrateMeToUris = [];
      workspaceUris = [];
      activeSelection = "";
      contextInclusionType = lt.UNSPECIFIED;
      chatModel = Fe.MODEL_UNSPECIFIED;
      systemPromptOverride = "";
      chatModelName = "";
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.chat_pb.GetChatMessageRequest";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "metadata",
          kind: "message",
          T: on
      }, {
          no: 3,
          name: "chat_messages",
          kind: "message",
          T: fi,
          repeated: !0
      }, {
          no: 4,
          name: "experiment_config",
          kind: "message",
          T: Mt
      }, {
          no: 5,
          name: "active_document",
          kind: "message",
          T: dr
      }, {
          no: 6,
          name: "open_document_paths_migrate_me_to_uris",
          kind: "scalar",
          T: 9,
          repeated: !0
      }, {
          no: 12,
          name: "open_document_uris",
          kind: "scalar",
          T: 9,
          repeated: !0
      }, {
          no: 7,
          name: "workspace_paths_migrate_me_to_uris",
          kind: "scalar",
          T: 9,
          repeated: !0
      }, {
          no: 13,
          name: "workspace_uris",
          kind: "scalar",
          T: 9,
          repeated: !0
      }, {
          no: 11,
          name: "active_selection",
          kind: "scalar",
          T: 9
      }, {
          no: 8,
          name: "context_inclusion_type",
          kind: "enum",
          T: Le.getEnumType(lt)
      }, {
          no: 9,
          name: "chat_model",
          kind: "enum",
          T: Le.getEnumType(Fe)
      }, {
          no: 10,
          name: "system_prompt_override",
          kind: "scalar",
          T: 9
      }, {
          no: 14,
          name: "chat_model_name",
          kind: "scalar",
          T: 9
      }]));
      static fromBinary(e, t) {
          return (new yi).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new yi).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new yi).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(yi, e, t)
      }
  }
  class wi extends d {
      experimentKey = Me.UNSPECIFIED;
      enabled = !1;
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.chat_pb.ChatExperimentStatus";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "experiment_key",
          kind: "enum",
          T: Le.getEnumType(Me)
      }, {
          no: 2,
          name: "enabled",
          kind: "scalar",
          T: 8
      }]));
      static fromBinary(e, t) {
          return (new wi).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new wi).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new wi).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(wi, e, t)
      }
  }
  !function(e) {
      e[e.UNSPECIFIED = 0] = "UNSPECIFIED",
      e[e.ACTIVE_DOCUMENT = 1] = "ACTIVE_DOCUMENT",
      e[e.CURSOR_POSITION = 2] = "CURSOR_POSITION",
      e[e.CHAT_MESSAGE_RECEIVED = 3] = "CHAT_MESSAGE_RECEIVED",
      e[e.OPEN_DOCUMENTS = 4] = "OPEN_DOCUMENTS",
      e[e.ORACLE_ITEMS = 5] = "ORACLE_ITEMS",
      e[e.PINNED_CONTEXT = 6] = "PINNED_CONTEXT",
      e[e.PINNED_GUIDELINE = 7] = "PINNED_GUIDELINE",
      e[e.ACTIVE_NODE = 9] = "ACTIVE_NODE"
  }(oa || (oa = {})),
  Le.util.setEnumType(oa, "exa.context_module_pb.ContextChangeType", [{
      no: 0,
      name: "CONTEXT_CHANGE_TYPE_UNSPECIFIED"
  }, {
      no: 1,
      name: "CONTEXT_CHANGE_TYPE_ACTIVE_DOCUMENT"
  }, {
      no: 2,
      name: "CONTEXT_CHANGE_TYPE_CURSOR_POSITION"
  }, {
      no: 3,
      name: "CONTEXT_CHANGE_TYPE_CHAT_MESSAGE_RECEIVED"
  }, {
      no: 4,
      name: "CONTEXT_CHANGE_TYPE_OPEN_DOCUMENTS"
  }, {
      no: 5,
      name: "CONTEXT_CHANGE_TYPE_ORACLE_ITEMS"
  }, {
      no: 6,
      name: "CONTEXT_CHANGE_TYPE_PINNED_CONTEXT"
  }, {
      no: 7,
      name: "CONTEXT_CHANGE_TYPE_PINNED_GUIDELINE"
  }, {
      no: 9,
      name: "CONTEXT_CHANGE_TYPE_ACTIVE_NODE"
  }]),
  function(e) {
      e[e.UNSPECIFIED = 0] = "UNSPECIFIED",
      e[e.AUTOCOMPLETE = 1] = "AUTOCOMPLETE",
      e[e.CHAT = 2] = "CHAT",
      e[e.CHAT_COMPLETION = 3] = "CHAT_COMPLETION",
      e[e.CORTEX_RESEARCH = 4] = "CORTEX_RESEARCH",
      e[e.EVAL = 5] = "EVAL",
      e[e.CHAT_COMPLETION_GENERATE = 6] = "CHAT_COMPLETION_GENERATE",
      e[e.SUPERCOMPLETE = 7] = "SUPERCOMPLETE",
      e[e.FAST_APPLY = 8] = "FAST_APPLY",
      e[e.COMMAND_TERMINAL = 9] = "COMMAND_TERMINAL"
  }(ma || (ma = {})),
  Le.util.setEnumType(ma, "exa.context_module_pb.ContextUseCase", [{
      no: 0,
      name: "CONTEXT_USE_CASE_UNSPECIFIED"
  }, {
      no: 1,
      name: "CONTEXT_USE_CASE_AUTOCOMPLETE"
  }, {
      no: 2,
      name: "CONTEXT_USE_CASE_CHAT"
  }, {
      no: 3,
      name: "CONTEXT_USE_CASE_CHAT_COMPLETION"
  }, {
      no: 4,
      name: "CONTEXT_USE_CASE_CORTEX_RESEARCH"
  }, {
      no: 5,
      name: "CONTEXT_USE_CASE_EVAL"
  }, {
      no: 6,
      name: "CONTEXT_USE_CASE_CHAT_COMPLETION_GENERATE"
  }, {
      no: 7,
      name: "CONTEXT_USE_CASE_SUPERCOMPLETE"
  }, {
      no: 8,
      name: "CONTEXT_USE_CASE_FAST_APPLY"
  }, {
      no: 9,
      name: "CONTEXT_USE_CASE_COMMAND_TERMINAL"
  }]),
  function(e) {
      e[e.UNSPECIFIED = 0] = "UNSPECIFIED",
      e[e.AUTOCOMPLETE = 1] = "AUTOCOMPLETE",
      e[e.CHAT = 2] = "CHAT",
      e[e.IDE_ACTION = 4] = "IDE_ACTION",
      e[e.CHAT_COMPLETION = 5] = "CHAT_COMPLETION"
  }(ca || (ca = {})),
  Le.util.setEnumType(ca, "exa.context_module_pb.ContextRefreshReason", [{
      no: 0,
      name: "CONTEXT_REFRESH_REASON_UNSPECIFIED"
  }, {
      no: 1,
      name: "CONTEXT_REFRESH_REASON_AUTOCOMPLETE"
  }, {
      no: 2,
      name: "CONTEXT_REFRESH_REASON_CHAT"
  }, {
      no: 4,
      name: "CONTEXT_REFRESH_REASON_IDE_ACTION"
  }, {
      no: 5,
      name: "CONTEXT_REFRESH_REASON_CHAT_COMPLETION"
  }]);
  class Ai extends (null) {
      contextChangeEvent = {
          case: void 0
      };
      contextRefreshReason = ca.UNSPECIFIED;
      constructor(e) {
          super(),
          proto3.util.initPartial(e, this)
      }
      static runtime = null;
      static typeName = null;
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "context_change_active_document",
          kind: "message",
          T: Pi,
          oneof: "context_change_event"
      }, {
          no: 2,
          name: "context_change_cursor_position",
          kind: "message",
          T: Li,
          oneof: "context_change_event"
      }, {
          no: 3,
          name: "context_change_chat_message_received",
          kind: "message",
          T: Ri,
          oneof: "context_change_event"
      }, {
          no: 4,
          name: "context_change_open_documents",
          kind: "message",
          T: ki,
          oneof: "context_change_event"
      }, {
          no: 5,
          name: "context_change_oracle_items",
          kind: "message",
          T: Ji,
          oneof: "context_change_event"
      }, {
          no: 7,
          name: "context_change_pinned_context",
          kind: "message",
          T: Di,
          oneof: "context_change_event"
      }, {
          no: 8,
          name: "context_change_pinned_guideline",
          kind: "message",
          T: hi,
          oneof: "context_change_event"
      }, {
          no: 10,
          name: "context_change_active_node",
          kind: "message",
          T: xi,
          oneof: "context_change_event"
      }, {
          no: 6,
          name: "context_refresh_reason",
          kind: "enum",
          T: Le.getEnumType(ca)
      }]));
      static fromBinary(e, t) {
          return (new Ai).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new Ai).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new Ai).fromJsonString(e, t)
      }
      static equals(e, t) {
          return proto3.util.equals(Ai, e, t)
      }
  }
  class Pi extends d {
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.context_module_pb.ContextChangeActiveDocument";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "document",
          kind: "message",
          T: dr
      }]));
      static fromBinary(e, t) {
          return (new Pi).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new Pi).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new Pi).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(Pi, e, t)
      }
  }
  class Li extends d {
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.context_module_pb.ContextChangeCursorPosition";
      static fields = Le.util.newFieldList(( () => [{
          no: 2,
          name: "document",
          kind: "message",
          T: dr
      }]));
      static fromBinary(e, t) {
          return (new Li).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new Li).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new Li).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(Li, e, t)
      }
  }
  class Ri extends d {
      chatMessages = [];
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.context_module_pb.ContextChangeChatMessageReceived";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "chat_messages",
          kind: "message",
          T: fi,
          repeated: !0
      }]));
      static fromBinary(e, t) {
          return (new Ri).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new Ri).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new Ri).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(Ri, e, t)
      }
  }
  class ki extends d {
      otherOpenDocuments = [];
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.context_module_pb.ContextChangeOpenDocuments";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "other_open_documents",
          kind: "message",
          T: dr,
          repeated: !0
      }]));
      static fromBinary(e, t) {
          return (new ki).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new ki).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new ki).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(ki, e, t)
      }
  }
  class Ji extends d {
      oracleItems = [];
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.context_module_pb.ContextChangeOracleItems";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "oracle_items",
          kind: "message",
          T: On,
          repeated: !0
      }]));
      static fromBinary(e, t) {
          return (new Ji).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new Ji).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new Ji).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(Ji, e, t)
      }
  }
  class Di extends d {
      scope = {
          case: void 0
      };
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.context_module_pb.ContextChangePinnedContext";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "pinned_scope",
          kind: "message",
          T: er,
          oneof: "scope"
      }, {
          no: 2,
          name: "mentioned_scope",
          kind: "message",
          T: er,
          oneof: "scope"
      }]));
      static fromBinary(e, t) {
          return (new Di).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new Di).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new Di).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(Di, e, t)
      }
  }
  class hi extends d {
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.context_module_pb.ContextChangePinnedGuideline";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "guideline",
          kind: "message",
          T: rr
      }]));
      static fromBinary(e, t) {
          return (new hi).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new hi).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new hi).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(hi, e, t)
      }
  }
  class xi extends d {
      actualNodeChange = !1;
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.context_module_pb.ContextChangeActiveNode";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "active_node",
          kind: "message",
          T: On
      }, {
          no: 2,
          name: "document",
          kind: "message",
          T: dr
      }, {
          no: 3,
          name: "actual_node_change",
          kind: "scalar",
          T: 8
      }]));
      static fromBinary(e, t) {
          return (new xi).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new xi).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new xi).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(xi, e, t)
      }
  }
  class Ui extends d {
      contextSources = [];
      contextType = st.UNSPECIFIED;
      scorer = "";
      score = 0;
      providerMetadata = {};
      isInPinnedScope = !1;
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.context_module_pb.RetrievedCodeContextItemMetadata";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "context_sources",
          kind: "enum",
          T: Le.getEnumType(ot),
          repeated: !0
      }, {
          no: 2,
          name: "context_type",
          kind: "enum",
          T: Le.getEnumType(st)
      }, {
          no: 3,
          name: "scorer",
          kind: "scalar",
          T: 9
      }, {
          no: 4,
          name: "score",
          kind: "scalar",
          T: 2
      }, {
          no: 5,
          name: "provider_metadata",
          kind: "map",
          K: 9,
          V: {
              kind: "message",
              T: bi
          }
      }, {
          no: 6,
          name: "is_in_pinned_scope",
          kind: "scalar",
          T: 8
      }]));
      static fromBinary(e, t) {
          return (new Ui).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new Ui).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new Ui).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(Ui, e, t)
      }
  }
  class Mi extends d {
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.context_module_pb.CciWithSubrangeWithRetrievalMetadata";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "cci_with_subrange",
          kind: "message",
          T: Xn
      }, {
          no: 2,
          name: "metadata",
          kind: "message",
          T: Ui
      }]));
      static fromBinary(e, t) {
          return (new Mi).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new Mi).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new Mi).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(Mi, e, t)
      }
  }
  class Bi extends d {
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.context_module_pb.CodeContextItemWithRetrievalMetadata";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "code_context_item",
          kind: "message",
          T: On
      }, {
          no: 2,
          name: "metadata",
          kind: "message",
          T: Ui
      }]));
      static fromBinary(e, t) {
          return (new Bi).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new Bi).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new Bi).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(Bi, e, t)
      }
  }
  class Fi extends (null) {
      absoluteUri = "";
      constructor(e) {
          super(),
          proto3.util.initPartial(e, this)
      }
      static runtime = null;
      static typeName = null;
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "absolute_uri",
          kind: "scalar",
          T: 9
      }, {
          no: 2,
          name: "metadata",
          kind: "message",
          T: Ui
      }]));
      static fromBinary(e, t) {
          return (new Fi).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new Fi).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new Fi).fromJsonString(e, t)
      }
      static equals(e, t) {
          return proto3.util.equals(Fi, e, t)
      }
  }
  class bi extends d {
      relativeWeight = 0;
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.context_module_pb.CodeContextProviderMetadata";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "relative_weight",
          kind: "scalar",
          T: 2
      }]));
      static fromBinary(e, t) {
          return (new bi).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new bi).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new bi).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(bi, e, t)
      }
  }
  class qi extends (null) {
      getStatsLatencyMs = protoInt64.zero;
      contextModuleAgeS = protoInt64.zero;
      constructor(e) {
          super(),
          proto3.util.initPartial(e, this)
      }
      static runtime = null;
      static typeName = null;
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "context_module_state_stats",
          kind: "message",
          T: Gi
      }, {
          no: 2,
          name: "code_context_item_index_stats",
          kind: "message",
          T: vi
      }, {
          no: 3,
          name: "get_stats_latency_ms",
          kind: "scalar",
          T: 3
      }, {
          no: 4,
          name: "context_module_age_s",
          kind: "scalar",
          T: 3
      }]));
      static fromBinary(e, t) {
          return (new qi).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new qi).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new qi).fromJsonString(e, t)
      }
      static equals(e, t) {
          return proto3.util.equals(qi, e, t)
      }
  }
  class Gi extends d {
      cciPerSourceBytes = y.zero;
      activeDocumentBytes = y.zero;
      otherOpenDocumentsBytes = y.zero;
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.context_module_pb.ContextModuleStateStats";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "cci_per_source_bytes",
          kind: "scalar",
          T: 3
      }, {
          no: 2,
          name: "active_document_bytes",
          kind: "scalar",
          T: 3
      }, {
          no: 3,
          name: "other_open_documents_bytes",
          kind: "scalar",
          T: 3
      }]));
      static fromBinary(e, t) {
          return (new Gi).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new Gi).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new Gi).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(Gi, e, t)
      }
  }
  class vi extends d {
      allCcisBytes = y.zero;
      numCcisTracked = y.zero;
      termFrequencyMapBytes = y.zero;
      numTermsTracked = y.zero;
      fileToCciMapBytes = y.zero;
      numFilesTracked = y.zero;
      lastModifiedBytes = y.zero;
      hashMapBytes = y.zero;
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.context_module_pb.CodeContextItemIndexStats";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "all_ccis_bytes",
          kind: "scalar",
          T: 3
      }, {
          no: 2,
          name: "num_ccis_tracked",
          kind: "scalar",
          T: 3
      }, {
          no: 3,
          name: "term_frequency_map_bytes",
          kind: "scalar",
          T: 3
      }, {
          no: 4,
          name: "num_terms_tracked",
          kind: "scalar",
          T: 3
      }, {
          no: 5,
          name: "file_to_cci_map_bytes",
          kind: "scalar",
          T: 3
      }, {
          no: 6,
          name: "num_files_tracked",
          kind: "scalar",
          T: 3
      }, {
          no: 7,
          name: "last_modified_bytes",
          kind: "scalar",
          T: 3
      }, {
          no: 8,
          name: "hash_map_bytes",
          kind: "scalar",
          T: 3
      }]));
      static fromBinary(e, t) {
          return (new vi).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new vi).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new vi).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(vi, e, t)
      }
  }
  class Hi extends (null) {
      constructor(e) {
          super(),
          proto3.util.initPartial(e, this)
      }
      static runtime = null;
      static typeName = null;
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "pinned_guideline",
          kind: "message",
          T: rr
      }, {
          no: 2,
          name: "pinned_context_scope",
          kind: "message",
          T: er
      }]));
      static fromBinary(e, t) {
          return (new Hi).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new Hi).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new Hi).fromJsonString(e, t)
      }
      static equals(e, t) {
          return proto3.util.equals(Hi, e, t)
      }
  }
  class Vi extends d {
      retrievedCciWithSubranges = [];
      openDocuments = [];
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.context_module_pb.ContextModuleResult";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "retrieved_cci_with_subranges",
          kind: "message",
          T: Mi,
          repeated: !0
      }, {
          no: 2,
          name: "active_document",
          kind: "message",
          T: dr
      }, {
          no: 5,
          name: "active_document_outline",
          kind: "message",
          T: Ur
      }, {
          no: 3,
          name: "local_node_state",
          kind: "message",
          T: Xi
      }, {
          no: 4,
          name: "guideline",
          kind: "message",
          T: rr
      }, {
          no: 6,
          name: "open_documents",
          kind: "message",
          T: dr,
          repeated: !0
      }]));
      static fromBinary(e, t) {
          return (new Vi).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new Vi).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new Vi).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(Vi, e, t)
      }
  }
  class Xi extends d {
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.context_module_pb.LocalNodeState";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "current_node",
          kind: "message",
          T: On
      }, {
          no: 2,
          name: "closest_above_node",
          kind: "message",
          T: On
      }, {
          no: 3,
          name: "closest_below_node",
          kind: "message",
          T: On
      }]));
      static fromBinary(e, t) {
          return (new Xi).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new Xi).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new Xi).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(Xi, e, t)
      }
  }
  !function(e) {
      e[e.UNSPECIFIED = 0] = "UNSPECIFIED",
      e[e.HALFVEC = 1] = "HALFVEC",
      e[e.BINARY = 2] = "BINARY",
      e[e.BINARY_WITH_RERANK = 3] = "BINARY_WITH_RERANK",
      e[e.BRUTE_FORCE = 4] = "BRUTE_FORCE",
      e[e.RANDOM_SEARCH = 5] = "RANDOM_SEARCH"
  }(ua || (ua = {})),
  Le.util.setEnumType(ua, "exa.index_pb.IndexMode", [{
      no: 0,
      name: "INDEX_MODE_UNSPECIFIED"
  }, {
      no: 1,
      name: "INDEX_MODE_HALFVEC"
  }, {
      no: 2,
      name: "INDEX_MODE_BINARY"
  }, {
      no: 3,
      name: "INDEX_MODE_BINARY_WITH_RERANK"
  }, {
      no: 4,
      name: "INDEX_MODE_BRUTE_FORCE"
  }, {
      no: 5,
      name: "INDEX_MODE_RANDOM_SEARCH"
  }]),
  function(e) {
      e[e.UNSPECIFIED = 0] = "UNSPECIFIED",
      e[e.ERROR = 1] = "ERROR",
      e[e.QUEUED = 2] = "QUEUED",
      e[e.CLONING_REPO = 3] = "CLONING_REPO",
      e[e.SCANNING_REPO = 4] = "SCANNING_REPO",
      e[e.GENERATING_EMBEDDINGS = 5] = "GENERATING_EMBEDDINGS",
      e[e.VECTOR_INDEXING = 6] = "VECTOR_INDEXING",
      e[e.DONE = 7] = "DONE",
      e[e.CANCELING = 8] = "CANCELING",
      e[e.CANCELED = 9] = "CANCELED"
  }(la || (la = {})),
  Le.util.setEnumType(la, "exa.index_pb.IndexingStatus", [{
      no: 0,
      name: "INDEXING_STATUS_UNSPECIFIED"
  }, {
      no: 1,
      name: "INDEXING_STATUS_ERROR"
  }, {
      no: 2,
      name: "INDEXING_STATUS_QUEUED"
  }, {
      no: 3,
      name: "INDEXING_STATUS_CLONING_REPO"
  }, {
      no: 4,
      name: "INDEXING_STATUS_SCANNING_REPO"
  }, {
      no: 5,
      name: "INDEXING_STATUS_GENERATING_EMBEDDINGS"
  }, {
      no: 6,
      name: "INDEXING_STATUS_VECTOR_INDEXING"
  }, {
      no: 7,
      name: "INDEXING_STATUS_DONE"
  }, {
      no: 8,
      name: "INDEXING_STATUS_CANCELING"
  }, {
      no: 9,
      name: "INDEXING_STATUS_CANCELED"
  }]);
  class Yi extends d {
      version = 0;
      enterpriseVersion = 0;
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.index_pb.IndexDbVersion";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "version",
          kind: "scalar",
          T: 5
      }, {
          no: 2,
          name: "enterprise_version",
          kind: "scalar",
          T: 5
      }]));
      static fromBinary(e, t) {
          return (new Yi).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new Yi).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new Yi).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(Yi, e, t)
      }
  }
  class Ki extends d {
      cciTimeoutSecs = 0;
      indexMode = ua.UNSPECIFIED;
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.index_pb.IndexBuildConfig";
      static fields = Le.util.newFieldList(( () => [{
          no: 2,
          name: "db_version",
          kind: "message",
          T: Yi
      }, {
          no: 3,
          name: "cci_timeout_secs",
          kind: "scalar",
          T: 5
      }, {
          no: 4,
          name: "index_mode",
          kind: "enum",
          T: Le.getEnumType(ua)
      }]));
      static fromBinary(e, t) {
          return (new Ki).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new Ki).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new Ki).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(Ki, e, t)
      }
  }
  class Wi extends d {
      gitUrl = "";
      scmProvider = it.UNSPECIFIED;
      storeSnippets = !1;
      whitelistedGroups = [];
      useGithubApp = !1;
      authUid = "";
      serviceKeyId = "";
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.index_pb.RepositoryConfig";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "git_url",
          kind: "scalar",
          T: 9
      }, {
          no: 2,
          name: "scm_provider",
          kind: "enum",
          T: Le.getEnumType(it)
      }, {
          no: 3,
          name: "auto_index_config",
          kind: "message",
          T: zi
      }, {
          no: 4,
          name: "store_snippets",
          kind: "scalar",
          T: 8
      }, {
          no: 5,
          name: "whitelisted_groups",
          kind: "scalar",
          T: 9,
          repeated: !0
      }, {
          no: 6,
          name: "use_github_app",
          kind: "scalar",
          T: 8
      }, {
          no: 7,
          name: "auth_uid",
          kind: "scalar",
          T: 9
      }, {
          no: 8,
          name: "service_key_id",
          kind: "scalar",
          T: 9
      }]));
      static fromBinary(e, t) {
          return (new Wi).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new Wi).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new Wi).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(Wi, e, t)
      }
  }
  class zi extends d {
      branchName = "";
      maxNumAutoIndexes = 0;
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.index_pb.RepositoryConfig.AutoIndexConfig";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "branch_name",
          kind: "scalar",
          T: 9
      }, {
          no: 2,
          name: "interval",
          kind: "message",
          T: De
      }, {
          no: 3,
          name: "max_num_auto_indexes",
          kind: "scalar",
          T: 5
      }]));
      static fromBinary(e, t) {
          return (new zi).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new zi).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new zi).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(zi, e, t)
      }
  }
  class ji extends d {
      enablePrune = !1;
      enableSmallestRepoFirst = !1;
      enableRoundRobin = !1;
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.index_pb.IndexConfig";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "prune_time",
          kind: "message",
          T: Je
      }, {
          no: 2,
          name: "prune_interval",
          kind: "message",
          T: De
      }, {
          no: 3,
          name: "enable_prune",
          kind: "scalar",
          T: 8
      }, {
          no: 4,
          name: "enable_smallest_repo_first",
          kind: "scalar",
          T: 8
      }, {
          no: 5,
          name: "enable_round_robin",
          kind: "scalar",
          T: 8
      }]));
      static fromBinary(e, t) {
          return (new ji).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new ji).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new ji).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(ji, e, t)
      }
  }
  class $i extends d {
      numEmbeddings = y.zero;
      indexBytesCount = y.zero;
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.index_pb.VectorIndexStats";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "num_embeddings",
          kind: "scalar",
          T: 3
      }, {
          no: 2,
          name: "index_bytes_count",
          kind: "scalar",
          T: 3
      }]));
      static fromBinary(e, t) {
          return (new $i).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new $i).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new $i).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals($i, e, t)
      }
  }
  class Qi extends d {
      progress = 0;
      text = "";
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.index_pb.ProgressBar";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "progress",
          kind: "scalar",
          T: 2
      }, {
          no: 2,
          name: "text",
          kind: "scalar",
          T: 9
      }, {
          no: 3,
          name: "remaining_time",
          kind: "message",
          T: De
      }]));
      static fromBinary(e, t) {
          return (new Qi).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new Qi).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new Qi).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(Qi, e, t)
      }
  }
  class Zi extends d {
      id = "";
      repoName = "";
      workspace = "";
      status = la.UNSPECIFIED;
      statusDetail = "";
      autoIndexed = !1;
      hasSnippets = !1;
      authUid = "";
      indexingProgress = {};
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.index_pb.Index";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "id",
          kind: "scalar",
          T: 9
      }, {
          no: 2,
          name: "repo_name",
          kind: "scalar",
          T: 9
      }, {
          no: 3,
          name: "workspace",
          kind: "scalar",
          T: 9
      }, {
          no: 4,
          name: "repo_info",
          kind: "message",
          T: Cn
      }, {
          no: 5,
          name: "created_at",
          kind: "message",
          T: Je
      }, {
          no: 6,
          name: "updated_at",
          kind: "message",
          T: Je
      }, {
          no: 13,
          name: "scheduled_at",
          kind: "message",
          T: Je
      }, {
          no: 7,
          name: "status",
          kind: "enum",
          T: Le.getEnumType(la)
      }, {
          no: 8,
          name: "status_detail",
          kind: "scalar",
          T: 9
      }, {
          no: 9,
          name: "auto_indexed",
          kind: "scalar",
          T: 8
      }, {
          no: 12,
          name: "has_snippets",
          kind: "scalar",
          T: 8
      }, {
          no: 15,
          name: "auth_uid",
          kind: "scalar",
          T: 9
      }, {
          no: 14,
          name: "repo_stats",
          kind: "message",
          T: es
      }, {
          no: 10,
          name: "indexing_progress",
          kind: "map",
          K: 9,
          V: {
              kind: "message",
              T: Qi
          }
      }, {
          no: 11,
          name: "index_stats",
          kind: "message",
          T: $i
      }]));
      static fromBinary(e, t) {
          return (new Zi).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new Zi).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new Zi).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(Zi, e, t)
      }
  }
  class es extends d {
      size = y.zero;
      fileCount = y.zero;
      sizeNoIgnore = y.zero;
      fileCountNoIgnore = y.zero;
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.index_pb.Index.RepoStats";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "size",
          kind: "scalar",
          T: 3
      }, {
          no: 2,
          name: "file_count",
          kind: "scalar",
          T: 3
      }, {
          no: 3,
          name: "size_no_ignore",
          kind: "scalar",
          T: 3
      }, {
          no: 4,
          name: "file_count_no_ignore",
          kind: "scalar",
          T: 3
      }]));
      static fromBinary(e, t) {
          return (new es).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new es).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new es).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(es, e, t)
      }
  }
  class ts extends d {
      repoName = "";
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.index_pb.Repository";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "repo_name",
          kind: "scalar",
          T: 9
      }, {
          no: 2,
          name: "config",
          kind: "message",
          T: Wi
      }, {
          no: 4,
          name: "created_at",
          kind: "message",
          T: Je
      }, {
          no: 5,
          name: "updated_at",
          kind: "message",
          T: Je
      }, {
          no: 3,
          name: "latest_index",
          kind: "message",
          T: Zi
      }]));
      static fromBinary(e, t) {
          return (new ts).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new ts).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new ts).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(ts, e, t)
      }
  }
  class ns extends d {
      version = {
          case: void 0
      };
      versionAlias = "";
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.index_pb.RequestIndexVersion";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "commit",
          kind: "scalar",
          T: 9,
          oneof: "version"
      }, {
          no: 2,
          name: "branch",
          kind: "scalar",
          T: 9,
          oneof: "version"
      }, {
          no: 3,
          name: "version_alias",
          kind: "scalar",
          T: 9
      }]));
      static fromBinary(e, t) {
          return (new ns).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new ns).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new ns).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(ns, e, t)
      }
  }
  class rs extends d {
      authToken = "";
      authUid = "";
      serviceKey = "";
      forceTargetPublicIndex = !1;
      forceTeamId = "";
      serviceKeyId = "";
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.index_pb.ManagementMetadata";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "auth_token",
          kind: "scalar",
          T: 9
      }, {
          no: 2,
          name: "auth_uid",
          kind: "scalar",
          T: 9
      }, {
          no: 3,
          name: "service_key",
          kind: "scalar",
          T: 9
      }, {
          no: 4,
          name: "force_target_public_index",
          kind: "scalar",
          T: 8
      }, {
          no: 5,
          name: "force_team_id",
          kind: "scalar",
          T: 9
      }, {
          no: 6,
          name: "service_key_id",
          kind: "scalar",
          T: 9
      }]));
      static fromBinary(e, t) {
          return (new rs).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new rs).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new rs).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(rs, e, t)
      }
  }
  class as extends (null) {
      constructor(e) {
          super(),
          proto3.util.initPartial(e, this)
      }
      static runtime = null;
      static typeName = null;
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "metadata",
          kind: "message",
          T: rs
      }, {
          no: 2,
          name: "config",
          kind: "message",
          T: Wi
      }, {
          no: 3,
          name: "initial_index",
          kind: "message",
          T: ns
      }]));
      static fromBinary(e, t) {
          return (new as).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new as).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new as).fromJsonString(e, t)
      }
      static equals(e, t) {
          return proto3.util.equals(as, e, t)
      }
  }
  class is extends (null) {
      repoName = "";
      indexId = "";
      constructor(e) {
          super(),
          proto3.util.initPartial(e, this)
      }
      static runtime = null;
      static typeName = null;
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "repo_name",
          kind: "scalar",
          T: 9
      }, {
          no: 2,
          name: "index_id",
          kind: "scalar",
          T: 9
      }]));
      static fromBinary(e, t) {
          return (new is).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new is).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new is).fromJsonString(e, t)
      }
      static equals(e, t) {
          return proto3.util.equals(is, e, t)
      }
  }
  class ss extends (null) {
      constructor(e) {
          super(),
          proto3.util.initPartial(e, this)
      }
      static runtime = null;
      static typeName = null;
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "metadata",
          kind: "message",
          T: rs
      }, {
          no: 2,
          name: "config",
          kind: "message",
          T: Ki
      }]));
      static fromBinary(e, t) {
          return (new ss).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new ss).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new ss).fromJsonString(e, t)
      }
      static equals(e, t) {
          return proto3.util.equals(ss, e, t)
      }
  }
  class os extends (null) {
      constructor(e) {
          super(),
          proto3.util.initPartial(e, this)
      }
      static runtime = null;
      static typeName = null;
      static fields = Le.util.newFieldList(( () => []));
      static fromBinary(e, t) {
          return (new os).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new os).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new os).fromJsonString(e, t)
      }
      static equals(e, t) {
          return proto3.util.equals(os, e, t)
      }
  }
  class ms extends (null) {
      constructor(e) {
          super(),
          proto3.util.initPartial(e, this)
      }
      static runtime = null;
      static typeName = null;
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "metadata",
          kind: "message",
          T: rs
      }]));
      static fromBinary(e, t) {
          return (new ms).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new ms).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new ms).fromJsonString(e, t)
      }
      static equals(e, t) {
          return proto3.util.equals(ms, e, t)
      }
  }
  class cs extends (null) {
      constructor(e) {
          super(),
          proto3.util.initPartial(e, this)
      }
      static runtime = null;
      static typeName = null;
      static fields = Le.util.newFieldList(( () => []));
      static fromBinary(e, t) {
          return (new cs).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new cs).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new cs).fromJsonString(e, t)
      }
      static equals(e, t) {
          return proto3.util.equals(cs, e, t)
      }
  }
  class us extends (null) {
      repoName = "";
      constructor(e) {
          super(),
          proto3.util.initPartial(e, this)
      }
      static runtime = null;
      static typeName = null;
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "metadata",
          kind: "message",
          T: rs
      }, {
          no: 2,
          name: "repo_name",
          kind: "scalar",
          T: 9
      }, {
          no: 3,
          name: "config",
          kind: "message",
          T: Wi
      }]));
      static fromBinary(e, t) {
          return (new us).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new us).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new us).fromJsonString(e, t)
      }
      static equals(e, t) {
          return proto3.util.equals(us, e, t)
      }
  }
  class ls extends (null) {
      constructor(e) {
          super(),
          proto3.util.initPartial(e, this)
      }
      static runtime = null;
      static typeName = null;
      static fields = Le.util.newFieldList(( () => []));
      static fromBinary(e, t) {
          return (new ls).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new ls).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new ls).fromJsonString(e, t)
      }
      static equals(e, t) {
          return proto3.util.equals(ls, e, t)
      }
  }
  class _s extends (null) {
      repoName = "";
      repoNames = [];
      constructor(e) {
          super(),
          proto3.util.initPartial(e, this)
      }
      static runtime = null;
      static typeName = null;
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "metadata",
          kind: "message",
          T: rs
      }, {
          no: 2,
          name: "repo_name",
          kind: "scalar",
          T: 9
      }, {
          no: 3,
          name: "repo_names",
          kind: "scalar",
          T: 9,
          repeated: !0
      }]));
      static fromBinary(e, t) {
          return (new _s).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new _s).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new _s).fromJsonString(e, t)
      }
      static equals(e, t) {
          return proto3.util.equals(_s, e, t)
      }
  }
  class ds extends (null) {
      constructor(e) {
          super(),
          proto3.util.initPartial(e, this)
      }
      static runtime = null;
      static typeName = null;
      static fields = Le.util.newFieldList(( () => []));
      static fromBinary(e, t) {
          return (new ds).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new ds).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new ds).fromJsonString(e, t)
      }
      static equals(e, t) {
          return proto3.util.equals(ds, e, t)
      }
  }
  class Es extends d {
      repoName = "";
      groupId = "";
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.index_pb.GetRepositoriesFilter";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "repo_name",
          kind: "scalar",
          T: 9
      }, {
          no: 2,
          name: "group_id",
          kind: "scalar",
          T: 9
      }]));
      static fromBinary(e, t) {
          return (new Es).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new Es).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new Es).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(Es, e, t)
      }
  }
  class Ts extends (null) {
      constructor(e) {
          super(),
          proto3.util.initPartial(e, this)
      }
      static runtime = null;
      static typeName = null;
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "metadata",
          kind: "message",
          T: rs
      }, {
          no: 2,
          name: "filter",
          kind: "message",
          T: Es
      }]));
      static fromBinary(e, t) {
          return (new Ts).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new Ts).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new Ts).fromJsonString(e, t)
      }
      static equals(e, t) {
          return proto3.util.equals(Ts, e, t)
      }
  }
  class fs extends (null) {
      repositories = [];
      constructor(e) {
          super(),
          proto3.util.initPartial(e, this)
      }
      static runtime = null;
      static typeName = null;
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "repositories",
          kind: "message",
          T: ts,
          repeated: !0
      }]));
      static fromBinary(e, t) {
          return (new fs).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new fs).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new fs).fromJsonString(e, t)
      }
      static equals(e, t) {
          return proto3.util.equals(fs, e, t)
      }
  }
  class ps extends (null) {
      repoName = "";
      constructor(e) {
          super(),
          proto3.util.initPartial(e, this)
      }
      static runtime = null;
      static typeName = null;
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "metadata",
          kind: "message",
          T: rs
      }, {
          no: 2,
          name: "repo_name",
          kind: "scalar",
          T: 9
      }]));
      static fromBinary(e, t) {
          return (new ps).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new ps).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new ps).fromJsonString(e, t)
      }
      static equals(e, t) {
          return proto3.util.equals(ps, e, t)
      }
  }
  class Ss extends (null) {
      indexes = [];
      constructor(e) {
          super(),
          proto3.util.initPartial(e, this)
      }
      static runtime = null;
      static typeName = null;
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "indexes",
          kind: "message",
          T: Zi,
          repeated: !0
      }]));
      static fromBinary(e, t) {
          return (new Ss).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new Ss).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new Ss).fromJsonString(e, t)
      }
      static equals(e, t) {
          return proto3.util.equals(Ss, e, t)
      }
  }
  class Ns extends (null) {
      indexId = "";
      constructor(e) {
          super(),
          proto3.util.initPartial(e, this)
      }
      static runtime = null;
      static typeName = null;
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "metadata",
          kind: "message",
          T: rs
      }, {
          no: 2,
          name: "index_id",
          kind: "scalar",
          T: 9
      }]));
      static fromBinary(e, t) {
          return (new Ns).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new Ns).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new Ns).fromJsonString(e, t)
      }
      static equals(e, t) {
          return proto3.util.equals(Ns, e, t)
      }
  }
  class gs extends (null) {
      constructor(e) {
          super(),
          proto3.util.initPartial(e, this)
      }
      static runtime = null;
      static typeName = null;
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "index",
          kind: "message",
          T: Zi
      }, {
          no: 2,
          name: "repository",
          kind: "message",
          T: ts
      }]));
      static fromBinary(e, t) {
          return (new gs).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new gs).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new gs).fromJsonString(e, t)
      }
      static equals(e, t) {
          return proto3.util.equals(gs, e, t)
      }
  }
  class Is extends d {
      indexId = "";
      cciCount = y.zero;
      snippetCount = y.zero;
      embeddingCount = y.zero;
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.index_pb.RemoteIndexStats";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "index_id",
          kind: "scalar",
          T: 9
      }, {
          no: 2,
          name: "cci_count",
          kind: "scalar",
          T: 3
      }, {
          no: 3,
          name: "snippet_count",
          kind: "scalar",
          T: 3
      }, {
          no: 4,
          name: "embedding_count",
          kind: "scalar",
          T: 3
      }]));
      static fromBinary(e, t) {
          return (new Is).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new Is).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new Is).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(Is, e, t)
      }
  }
  class Cs extends (null) {
      indexIds = [];
      constructor(e) {
          super(),
          proto3.util.initPartial(e, this)
      }
      static runtime = null;
      static typeName = null;
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "metadata",
          kind: "message",
          T: rs
      }, {
          no: 2,
          name: "index_ids",
          kind: "scalar",
          T: 9,
          repeated: !0
      }]));
      static fromBinary(e, t) {
          return (new Cs).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new Cs).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new Cs).fromJsonString(e, t)
      }
      static equals(e, t) {
          return proto3.util.equals(Cs, e, t)
      }
  }
  class Os extends (null) {
      indexStats = [];
      constructor(e) {
          super(),
          proto3.util.initPartial(e, this)
      }
      static runtime = null;
      static typeName = null;
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "index_stats",
          kind: "message",
          T: Is,
          repeated: !0
      }]));
      static fromBinary(e, t) {
          return (new Os).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new Os).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new Os).fromJsonString(e, t)
      }
      static equals(e, t) {
          return proto3.util.equals(Os, e, t)
      }
  }
  class ys extends (null) {
      repoName = "";
      constructor(e) {
          super(),
          proto3.util.initPartial(e, this)
      }
      static runtime = null;
      static typeName = null;
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "metadata",
          kind: "message",
          T: rs
      }, {
          no: 2,
          name: "repo_name",
          kind: "scalar",
          T: 9
      }, {
          no: 3,
          name: "version",
          kind: "message",
          T: ns
      }]));
      static fromBinary(e, t) {
          return (new ys).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new ys).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new ys).fromJsonString(e, t)
      }
      static equals(e, t) {
          return proto3.util.equals(ys, e, t)
      }
  }
  class ws extends (null) {
      indexId = "";
      constructor(e) {
          super(),
          proto3.util.initPartial(e, this)
      }
      static runtime = null;
      static typeName = null;
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "index_id",
          kind: "scalar",
          T: 9
      }]));
      static fromBinary(e, t) {
          return (new ws).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new ws).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new ws).fromJsonString(e, t)
      }
      static equals(e, t) {
          return proto3.util.equals(ws, e, t)
      }
  }
  class As extends (null) {
      indexId = "";
      indexIds = [];
      constructor(e) {
          super(),
          proto3.util.initPartial(e, this)
      }
      static runtime = null;
      static typeName = null;
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "metadata",
          kind: "message",
          T: rs
      }, {
          no: 2,
          name: "index_id",
          kind: "scalar",
          T: 9
      }, {
          no: 3,
          name: "index_ids",
          kind: "scalar",
          T: 9,
          repeated: !0
      }]));
      static fromBinary(e, t) {
          return (new As).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new As).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new As).fromJsonString(e, t)
      }
      static equals(e, t) {
          return proto3.util.equals(As, e, t)
      }
  }
  class Ps extends (null) {
      constructor(e) {
          super(),
          proto3.util.initPartial(e, this)
      }
      static runtime = null;
      static typeName = null;
      static fields = Le.util.newFieldList(( () => []));
      static fromBinary(e, t) {
          return (new Ps).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new Ps).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new Ps).fromJsonString(e, t)
      }
      static equals(e, t) {
          return proto3.util.equals(Ps, e, t)
      }
  }
  class Ls extends (null) {
      indexId = "";
      indexIds = [];
      constructor(e) {
          super(),
          proto3.util.initPartial(e, this)
      }
      static runtime = null;
      static typeName = null;
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "metadata",
          kind: "message",
          T: rs
      }, {
          no: 2,
          name: "index_id",
          kind: "scalar",
          T: 9
      }, {
          no: 3,
          name: "index_ids",
          kind: "scalar",
          T: 9,
          repeated: !0
      }]));
      static fromBinary(e, t) {
          return (new Ls).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new Ls).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new Ls).fromJsonString(e, t)
      }
      static equals(e, t) {
          return proto3.util.equals(Ls, e, t)
      }
  }
  class Rs extends (null) {
      constructor(e) {
          super(),
          proto3.util.initPartial(e, this)
      }
      static runtime = null;
      static typeName = null;
      static fields = Le.util.newFieldList(( () => []));
      static fromBinary(e, t) {
          return (new Rs).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new Rs).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new Rs).fromJsonString(e, t)
      }
      static equals(e, t) {
          return proto3.util.equals(Rs, e, t)
      }
  }
  class ks extends (null) {
      indexId = "";
      indexIds = [];
      constructor(e) {
          super(),
          proto3.util.initPartial(e, this)
      }
      static runtime = null;
      static typeName = null;
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "metadata",
          kind: "message",
          T: rs
      }, {
          no: 2,
          name: "index_id",
          kind: "scalar",
          T: 9
      }, {
          no: 3,
          name: "index_ids",
          kind: "scalar",
          T: 9,
          repeated: !0
      }]));
      static fromBinary(e, t) {
          return (new ks).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new ks).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new ks).fromJsonString(e, t)
      }
      static equals(e, t) {
          return proto3.util.equals(ks, e, t)
      }
  }
  class Js extends (null) {
      constructor(e) {
          super(),
          proto3.util.initPartial(e, this)
      }
      static runtime = null;
      static typeName = null;
      static fields = Le.util.newFieldList(( () => []));
      static fromBinary(e, t) {
          return (new Js).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new Js).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new Js).fromJsonString(e, t)
      }
      static equals(e, t) {
          return proto3.util.equals(Js, e, t)
      }
  }
  class Ds extends (null) {
      constructor(e) {
          super(),
          proto3.util.initPartial(e, this)
      }
      static runtime = null;
      static typeName = null;
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "metadata",
          kind: "message",
          T: rs
      }]));
      static fromBinary(e, t) {
          return (new Ds).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new Ds).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new Ds).fromJsonString(e, t)
      }
      static equals(e, t) {
          return proto3.util.equals(Ds, e, t)
      }
  }
  class hs extends (null) {
      constructor(e) {
          super(),
          proto3.util.initPartial(e, this)
      }
      static runtime = null;
      static typeName = null;
      static fields = Le.util.newFieldList(( () => []));
      static fromBinary(e, t) {
          return (new hs).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new hs).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new hs).fromJsonString(e, t)
      }
      static equals(e, t) {
          return proto3.util.equals(hs, e, t)
      }
  }
  class xs extends (null) {
      constructor(e) {
          super(),
          proto3.util.initPartial(e, this)
      }
      static runtime = null;
      static typeName = null;
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "metadata",
          kind: "message",
          T: rs
      }]));
      static fromBinary(e, t) {
          return (new xs).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new xs).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new xs).fromJsonString(e, t)
      }
      static equals(e, t) {
          return proto3.util.equals(xs, e, t)
      }
  }
  class Us extends (null) {
      databaseTotalBytesCount = protoInt64.zero;
      tableTotalBytesCount = protoInt64.zero;
      indexTotalBytesCount = protoInt64.zero;
      estimatePrunableBytes = protoInt64.zero;
      isPruning = !1;
      lastPruneError = "";
      constructor(e) {
          super(),
          proto3.util.initPartial(e, this)
      }
      static runtime = null;
      static typeName = null;
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "database_total_bytes_count",
          kind: "scalar",
          T: 3
      }, {
          no: 2,
          name: "table_total_bytes_count",
          kind: "scalar",
          T: 3
      }, {
          no: 3,
          name: "index_total_bytes_count",
          kind: "scalar",
          T: 3
      }, {
          no: 4,
          name: "estimate_prunable_bytes",
          kind: "scalar",
          T: 3
      }, {
          no: 5,
          name: "is_pruning",
          kind: "scalar",
          T: 8
      }, {
          no: 6,
          name: "last_prune_error",
          kind: "scalar",
          T: 9
      }]));
      static fromBinary(e, t) {
          return (new Us).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new Us).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new Us).fromJsonString(e, t)
      }
      static equals(e, t) {
          return proto3.util.equals(Us, e, t)
      }
  }
  class Ms extends (null) {
      constructor(e) {
          super(),
          proto3.util.initPartial(e, this)
      }
      static runtime = null;
      static typeName = null;
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "metadata",
          kind: "message",
          T: rs
      }, {
          no: 2,
          name: "index_config",
          kind: "message",
          T: ji
      }]));
      static fromBinary(e, t) {
          return (new Ms).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new Ms).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new Ms).fromJsonString(e, t)
      }
      static equals(e, t) {
          return proto3.util.equals(Ms, e, t)
      }
  }
  class Bs extends (null) {
      constructor(e) {
          super(),
          proto3.util.initPartial(e, this)
      }
      static runtime = null;
      static typeName = null;
      static fields = Le.util.newFieldList(( () => []));
      static fromBinary(e, t) {
          return (new Bs).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new Bs).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new Bs).fromJsonString(e, t)
      }
      static equals(e, t) {
          return proto3.util.equals(Bs, e, t)
      }
  }
  class Fs extends (null) {
      constructor(e) {
          super(),
          proto3.util.initPartial(e, this)
      }
      static runtime = null;
      static typeName = null;
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "metadata",
          kind: "message",
          T: rs
      }]));
      static fromBinary(e, t) {
          return (new Fs).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new Fs).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new Fs).fromJsonString(e, t)
      }
      static equals(e, t) {
          return proto3.util.equals(Fs, e, t)
      }
  }
  class bs extends (null) {
      constructor(e) {
          super(),
          proto3.util.initPartial(e, this)
      }
      static runtime = null;
      static typeName = null;
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "index_config",
          kind: "message",
          T: ji
      }]));
      static fromBinary(e, t) {
          return (new bs).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new bs).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new bs).fromJsonString(e, t)
      }
      static equals(e, t) {
          return proto3.util.equals(bs, e, t)
      }
  }
  class qs extends (null) {
      constructor(e) {
          super(),
          proto3.util.initPartial(e, this)
      }
      static runtime = null;
      static typeName = null;
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "metadata",
          kind: "message",
          T: rs
      }]));
      static fromBinary(e, t) {
          return (new qs).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new qs).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new qs).fromJsonString(e, t)
      }
      static equals(e, t) {
          return proto3.util.equals(qs, e, t)
      }
  }
  class Gs extends (null) {
      connectionsMap = {};
      constructor(e) {
          super(),
          proto3.util.initPartial(e, this)
      }
      static runtime = null;
      static typeName = null;
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "connections_map",
          kind: "map",
          K: 9,
          V: {
              kind: "scalar",
              T: 13
          }
      }]));
      static fromBinary(e, t) {
          return (new Gs).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new Gs).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new Gs).fromJsonString(e, t)
      }
      static equals(e, t) {
          return proto3.util.equals(Gs, e, t)
      }
  }
  class vs extends (null) {
      constructor(e) {
          super(),
          proto3.util.initPartial(e, this)
      }
      static runtime = null;
      static typeName = null;
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "metadata",
          kind: "message",
          T: rs
      }]));
      static fromBinary(e, t) {
          return (new vs).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new vs).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new vs).fromJsonString(e, t)
      }
      static equals(e, t) {
          return proto3.util.equals(vs, e, t)
      }
  }
  class Hs extends (null) {
      debugInfo = "";
      constructor(e) {
          super(),
          proto3.util.initPartial(e, this)
      }
      static runtime = null;
      static typeName = null;
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "debug_info",
          kind: "scalar",
          T: 9
      }]));
      static fromBinary(e, t) {
          return (new Hs).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new Hs).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new Hs).fromJsonString(e, t)
      }
      static equals(e, t) {
          return proto3.util.equals(Hs, e, t)
      }
  }
  class Vs extends (null) {
      includeIncomplete = !1;
      groupIdsFilter = [];
      constructor(e) {
          super(),
          proto3.util.initPartial(e, this)
      }
      static runtime = null;
      static typeName = null;
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "metadata",
          kind: "message",
          T: on
      }, {
          no: 2,
          name: "include_incomplete",
          kind: "scalar",
          T: 8
      }, {
          no: 3,
          name: "group_ids_filter",
          kind: "scalar",
          T: 9,
          repeated: !0
      }]));
      static fromBinary(e, t) {
          return (new Vs).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new Vs).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new Vs).fromJsonString(e, t)
      }
      static equals(e, t) {
          return proto3.util.equals(Vs, e, t)
      }
  }
  class Xs extends (null) {
      repositories = [];
      indexes = [];
      constructor(e) {
          super(),
          proto3.util.initPartial(e, this)
      }
      static runtime = null;
      static typeName = null;
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "repositories",
          kind: "message",
          T: Cn,
          repeated: !0
      }, {
          no: 2,
          name: "indexes",
          kind: "message",
          T: Zi,
          repeated: !0
      }]));
      static fromBinary(e, t) {
          return (new Xs).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new Xs).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new Xs).fromJsonString(e, t)
      }
      static equals(e, t) {
          return proto3.util.equals(Xs, e, t)
      }
  }
  class Ys extends d {
      excludedFiles = [];
      filterPaths = [];
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.index_pb.RepositoryFilter";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "repository",
          kind: "message",
          T: Cn
      }, {
          no: 2,
          name: "excluded_files",
          kind: "scalar",
          T: 9,
          repeated: !0
      }, {
          no: 3,
          name: "filter_paths",
          kind: "scalar",
          T: 9,
          repeated: !0
      }]));
      static fromBinary(e, t) {
          return (new Ys).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new Ys).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new Ys).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(Ys, e, t)
      }
  }
  class Ks extends (null) {
      query = "";
      maxItems = 0;
      groupIdsFilter = [];
      constructor(e) {
          super(),
          proto3.util.initPartial(e, this)
      }
      static runtime = null;
      static typeName = null;
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "metadata",
          kind: "message",
          T: on
      }, {
          no: 2,
          name: "repository",
          kind: "message",
          T: Cn
      }, {
          no: 3,
          name: "query",
          kind: "scalar",
          T: 9
      }, {
          no: 4,
          name: "max_items",
          kind: "scalar",
          T: 13
      }, {
          no: 5,
          name: "group_ids_filter",
          kind: "scalar",
          T: 9,
          repeated: !0
      }]));
      static fromBinary(e, t) {
          return (new Ks).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new Ks).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new Ks).fromJsonString(e, t)
      }
      static equals(e, t) {
          return proto3.util.equals(Ks, e, t)
      }
  }
  class Ws extends (null) {
      relativeFilePaths = [];
      constructor(e) {
          super(),
          proto3.util.initPartial(e, this)
      }
      static runtime = null;
      static typeName = null;
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "relative_file_paths",
          kind: "scalar",
          T: 9,
          repeated: !0
      }]));
      static fromBinary(e, t) {
          return (new Ws).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new Ws).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new Ws).fromJsonString(e, t)
      }
      static equals(e, t) {
          return proto3.util.equals(Ws, e, t)
      }
  }
  class zs extends (null) {
      repositoryFilters = [];
      maxResults = protoInt64.zero;
      groupIdsFilter = [];
      constructor(e) {
          super(),
          proto3.util.initPartial(e, this)
      }
      static runtime = null;
      static typeName = null;
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "metadata",
          kind: "message",
          T: on
      }, {
          no: 2,
          name: "embedding",
          kind: "message",
          T: nn
      }, {
          no: 3,
          name: "repository_filters",
          kind: "message",
          T: Ys,
          repeated: !0
      }, {
          no: 4,
          name: "max_results",
          kind: "scalar",
          T: 3
      }, {
          no: 5,
          name: "group_ids_filter",
          kind: "scalar",
          T: 9,
          repeated: !0
      }]));
      static fromBinary(e, t) {
          return (new zs).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new zs).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new zs).fromJsonString(e, t)
      }
      static equals(e, t) {
          return proto3.util.equals(zs, e, t)
      }
  }
  class js extends d {
      score = 0;
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.index_pb.ScoredContextItem";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "code_context_item",
          kind: "message",
          T: On
      }, {
          no: 2,
          name: "score",
          kind: "scalar",
          T: 2
      }]));
      static fromBinary(e, t) {
          return (new js).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new js).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new js).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(js, e, t)
      }
  }
  class $s extends (null) {
      scoredContextItems = [];
      constructor(e) {
          super(),
          proto3.util.initPartial(e, this)
      }
      static runtime = null;
      static typeName = null;
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "scored_context_items",
          kind: "message",
          T: js,
          repeated: !0
      }]));
      static fromBinary(e, t) {
          return (new $s).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new $s).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new $s).fromJsonString(e, t)
      }
      static equals(e, t) {
          return proto3.util.equals($s, e, t)
      }
  }
  class Qs extends (null) {
      codeContextItems = [];
      snippetType = ContextSnippetType.UNSPECIFIED;
      constructor(e) {
          super(),
          proto3.util.initPartial(e, this)
      }
      static runtime = null;
      static typeName = null;
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "metadata",
          kind: "message",
          T: on
      }, {
          no: 2,
          name: "code_context_items",
          kind: "message",
          T: On,
          repeated: !0
      }, {
          no: 3,
          name: "snippet_type",
          kind: "enum",
          T: Le.getEnumType(mt)
      }]));
      static fromBinary(e, t) {
          return (new Qs).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new Qs).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new Qs).fromJsonString(e, t)
      }
      static equals(e, t) {
          return proto3.util.equals(Qs, e, t)
      }
  }
  class Zs extends (null) {
      embeddings = [];
      constructor(e) {
          super(),
          proto3.util.initPartial(e, this)
      }
      static runtime = null;
      static typeName = null;
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "embeddings",
          kind: "message",
          T: nn,
          repeated: !0
      }]));
      static fromBinary(e, t) {
          return (new Zs).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new Zs).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new Zs).fromJsonString(e, t)
      }
      static equals(e, t) {
          return proto3.util.equals(Zs, e, t)
      }
  }
  class eo extends d {
      repositoryName = "";
      fileCount = y.zero;
      codeContextItemCount = y.zero;
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.index_pb.IndexStats";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "repository_name",
          kind: "scalar",
          T: 9
      }, {
          no: 2,
          name: "file_count",
          kind: "scalar",
          T: 3
      }, {
          no: 3,
          name: "code_context_item_count",
          kind: "scalar",
          T: 3
      }]));
      static fromBinary(e, t) {
          return (new eo).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new eo).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new eo).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(eo, e, t)
      }
  }
  class to extends (null) {
      uid = protoInt64.zero;
      eventOneof = {
          case: void 0
      };
      constructor(e) {
          super(),
          proto3.util.initPartial(e, this)
      }
      static runtime = null;
      static typeName = null;
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "uid",
          kind: "scalar",
          T: 4
      }, {
          no: 2,
          name: "deletion",
          kind: "message",
          T: no,
          oneof: "event_oneof"
      }, {
          no: 3,
          name: "untrack",
          kind: "message",
          T: ro,
          oneof: "event_oneof"
      }, {
          no: 4,
          name: "update",
          kind: "message",
          T: ao,
          oneof: "event_oneof"
      }, {
          no: 5,
          name: "add_workspace",
          kind: "message",
          T: so,
          oneof: "event_oneof"
      }, {
          no: 6,
          name: "remove_workspace",
          kind: "message",
          T: oo,
          oneof: "event_oneof"
      }, {
          no: 7,
          name: "ignore_workspace",
          kind: "message",
          T: mo,
          oneof: "event_oneof"
      }, {
          no: 8,
          name: "add_commit",
          kind: "message",
          T: co,
          oneof: "event_oneof"
      }]));
      static fromBinary(e, t) {
          return (new to).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new to).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new to).fromJsonString(e, t)
      }
      static equals(e, t) {
          return proto3.util.equals(to, e, t)
      }
  }
  class no extends d {
      absoluteUri = "";
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.index_pb.IndexerEvent.Deletion";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "absolute_uri",
          kind: "scalar",
          T: 9
      }]));
      static fromBinary(e, t) {
          return (new no).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new no).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new no).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(no, e, t)
      }
  }
  class ro extends d {
      absoluteUri = "";
      paths = [];
      workspaceUri = "";
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.index_pb.IndexerEvent.Untrack";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "absolute_uri",
          kind: "scalar",
          T: 9
      }, {
          no: 2,
          name: "paths",
          kind: "message",
          T: _n,
          repeated: !0
      }, {
          no: 3,
          name: "workspace_uri",
          kind: "scalar",
          T: 9
      }]));
      static fromBinary(e, t) {
          return (new ro).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new ro).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new ro).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(ro, e, t)
      }
  }
  class ao extends d {
      absoluteUri = "";
      paths = [];
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.index_pb.IndexerEvent.Update";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "absolute_uri",
          kind: "scalar",
          T: 9
      }, {
          no: 2,
          name: "paths",
          kind: "message",
          T: _n,
          repeated: !0
      }, {
          no: 3,
          name: "mod_time",
          kind: "message",
          T: Je
      }, {
          no: 4,
          name: "add_workspace_info",
          kind: "message",
          T: io
      }]));
      static fromBinary(e, t) {
          return (new ao).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new ao).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new ao).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(ao, e, t)
      }
  }
  class io extends d {
      addWorkspaceUid = y.zero;
      addWorkspaceQueueUid = y.zero;
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.index_pb.IndexerEvent.Update.AddWorkspaceInfo";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "add_workspace_uid",
          kind: "scalar",
          T: 4
      }, {
          no: 2,
          name: "add_workspace_queue_uid",
          kind: "scalar",
          T: 4
      }]));
      static fromBinary(e, t) {
          return (new io).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new io).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new io).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(io, e, t)
      }
  }
  class so extends d {
      addWorkspaceUid = y.zero;
      addWorkspaceQueueUid = y.zero;
      workspaceUri = "";
      numFiles = y.zero;
      size = y.zero;
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.index_pb.IndexerEvent.AddWorkspace";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "add_workspace_uid",
          kind: "scalar",
          T: 4
      }, {
          no: 2,
          name: "add_workspace_queue_uid",
          kind: "scalar",
          T: 4
      }, {
          no: 3,
          name: "workspace_uri",
          kind: "scalar",
          T: 9
      }, {
          no: 4,
          name: "num_files",
          kind: "scalar",
          T: 3
      }, {
          no: 5,
          name: "size",
          kind: "scalar",
          T: 3
      }]));
      static fromBinary(e, t) {
          return (new so).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new so).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new so).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(so, e, t)
      }
  }
  class oo extends d {
      workspaceUri = "";
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.index_pb.IndexerEvent.RemoveWorkspace";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "workspace_uri",
          kind: "scalar",
          T: 9
      }]));
      static fromBinary(e, t) {
          return (new oo).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new oo).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new oo).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(oo, e, t)
      }
  }
  class mo extends d {
      workspaceUri = "";
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.index_pb.IndexerEvent.IgnoreWorkspace";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "workspace_uri",
          kind: "scalar",
          T: 9
      }]));
      static fromBinary(e, t) {
          return (new mo).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new mo).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new mo).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(mo, e, t)
      }
  }
  class co extends d {
      sha = "";
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.index_pb.IndexerEvent.AddCommit";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "sha",
          kind: "scalar",
          T: 9
      }]));
      static fromBinary(e, t) {
          return (new co).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new co).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new co).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(co, e, t)
      }
  }
  !function(e) {
      e[e.UNSPECIFIED = 0] = "UNSPECIFIED",
      e[e.SAME_COMMIT_OLD = 1] = "SAME_COMMIT_OLD",
      e[e.SAME_COMMIT_NEW = 2] = "SAME_COMMIT_NEW",
      e[e.REF_IN_DELETION = 3] = "REF_IN_DELETION",
      e[e.REF_IN_INSERTION = 4] = "REF_IN_INSERTION",
      e[e.NOT_RELEVANT = 99] = "NOT_RELEVANT"
  }(_a || (_a = {})),
  Le.util.setEnumType(_a, "exa.code_edit.code_edit_pb.RelevanceReason", [{
      no: 0,
      name: "RELEVANCE_REASON_UNSPECIFIED"
  }, {
      no: 1,
      name: "RELEVANCE_REASON_SAME_COMMIT_OLD"
  }, {
      no: 2,
      name: "RELEVANCE_REASON_SAME_COMMIT_NEW"
  }, {
      no: 3,
      name: "RELEVANCE_REASON_REF_IN_DELETION"
  }, {
      no: 4,
      name: "RELEVANCE_REASON_REF_IN_INSERTION"
  }, {
      no: 99,
      name: "RELEVANCE_REASON_NOT_RELEVANT"
  }]),
  function(e) {
      e[e.UNSPECIFIED = 0] = "UNSPECIFIED",
      e[e.EDIT_COMMAND = 1] = "EDIT_COMMAND",
      e[e.INSERTION_COMMAND = 2] = "INSERTION_COMMAND"
  }(da || (da = {})),
  Le.util.setEnumType(da, "exa.code_edit.code_edit_pb.DescriptionType", [{
      no: 0,
      name: "DESCRIPTION_TYPE_UNSPECIFIED"
  }, {
      no: 1,
      name: "DESCRIPTION_TYPE_EDIT_COMMAND"
  }, {
      no: 2,
      name: "DESCRIPTION_TYPE_INSERTION_COMMAND"
  }]),
  function(e) {
      e[e.UNSPECIFIED = 0] = "UNSPECIFIED",
      e[e.COMMIT_GOAL = 1] = "COMMIT_GOAL",
      e[e.DIFF_SEARCH = 2] = "DIFF_SEARCH",
      e[e.CLEAN_COMMIT = 3] = "CLEAN_COMMIT",
      e[e.CCI_SIGNATURE_SEARCH = 4] = "CCI_SIGNATURE_SEARCH",
      e[e.CCI_RAW_SOURCE_SEARCH = 5] = "CCI_RAW_SOURCE_SEARCH"
  }(Ea || (Ea = {})),
  Le.util.setEnumType(Ea, "exa.code_edit.code_edit_pb.IntentType", [{
      no: 0,
      name: "INTENT_TYPE_UNSPECIFIED"
  }, {
      no: 1,
      name: "INTENT_TYPE_COMMIT_GOAL"
  }, {
      no: 2,
      name: "INTENT_TYPE_DIFF_SEARCH"
  }, {
      no: 3,
      name: "INTENT_TYPE_CLEAN_COMMIT"
  }, {
      no: 4,
      name: "INTENT_TYPE_CCI_SIGNATURE_SEARCH"
  }, {
      no: 5,
      name: "INTENT_TYPE_CCI_RAW_SOURCE_SEARCH"
  }]),
  function(e) {
      e[e.UNSPECIFIED = 0] = "UNSPECIFIED",
      e[e.CONTEXT_MODULE_LOCAL = 1] = "CONTEXT_MODULE_LOCAL",
      e[e.CONTEXT_MODULE_SEARCH = 2] = "CONTEXT_MODULE_SEARCH",
      e[e.SEARCH = 3] = "SEARCH",
      e[e.MQUERY_OPENAI = 4] = "MQUERY_OPENAI",
      e[e.MQUERY_CODEIUM = 5] = "MQUERY_CODEIUM",
      e[e.CONTEXT_MODULE_SEARCH_MQUERY_SCORER = 6] = "CONTEXT_MODULE_SEARCH_MQUERY_SCORER",
      e[e.COMMIT_GRAPH = 7] = "COMMIT_GRAPH",
      e[e.MORPH_NORMAL = 8] = "MORPH_NORMAL",
      e[e.MORPH_ADVANCED = 9] = "MORPH_ADVANCED",
      e[e.GRAPH_CLUSTERS = 10] = "GRAPH_CLUSTERS"
  }(Ta || (Ta = {})),
  Le.util.setEnumType(Ta, "exa.code_edit.code_edit_pb.RetrieverType", [{
      no: 0,
      name: "RETRIEVER_TYPE_UNSPECIFIED"
  }, {
      no: 1,
      name: "RETRIEVER_TYPE_CONTEXT_MODULE_LOCAL"
  }, {
      no: 2,
      name: "RETRIEVER_TYPE_CONTEXT_MODULE_SEARCH"
  }, {
      no: 3,
      name: "RETRIEVER_TYPE_SEARCH"
  }, {
      no: 4,
      name: "RETRIEVER_TYPE_MQUERY_OPENAI"
  }, {
      no: 5,
      name: "RETRIEVER_TYPE_MQUERY_CODEIUM"
  }, {
      no: 6,
      name: "RETRIEVER_TYPE_CONTEXT_MODULE_SEARCH_MQUERY_SCORER"
  }, {
      no: 7,
      name: "RETRIEVER_TYPE_COMMIT_GRAPH"
  }, {
      no: 8,
      name: "RETRIEVER_TYPE_MORPH_NORMAL"
  }, {
      no: 9,
      name: "RETRIEVER_TYPE_MORPH_ADVANCED"
  }, {
      no: 10,
      name: "RETRIEVER_TYPE_GRAPH_CLUSTERS"
  }]);
  class uo extends d {
      relevanceReason = _a.UNSPECIFIED;
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.code_edit.code_edit_pb.RelevantCodeContext";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "code_context_item",
          kind: "message",
          T: On
      }, {
          no: 3,
          name: "relevance_reason",
          kind: "enum",
          T: Le.getEnumType(_a)
      }]));
      static fromBinary(e, t) {
          return (new uo).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new uo).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new uo).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(uo, e, t)
      }
  }
  class lo extends d {
      intent = "";
      relevanceScore = 0;
      rationale = "";
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.code_edit.code_edit_pb.IntentRelevance";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "intent",
          kind: "scalar",
          T: 9
      }, {
          no: 2,
          name: "relevance_score",
          kind: "scalar",
          T: 2
      }, {
          no: 3,
          name: "rationale",
          kind: "scalar",
          T: 9
      }]));
      static fromBinary(e, t) {
          return (new lo).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new lo).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new lo).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(lo, e, t)
      }
  }
  class _o extends d {
      relevantCodeContexts = [];
      descriptionByType = {};
      intentRelevance = [];
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.code_edit.code_edit_pb.CodeContextItemChange";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "start_cci",
          kind: "message",
          T: On
      }, {
          no: 2,
          name: "end_cci",
          kind: "message",
          T: On
      }, {
          no: 3,
          name: "relevant_code_contexts",
          kind: "message",
          T: uo,
          repeated: !0
      }, {
          no: 4,
          name: "description_by_type",
          kind: "map",
          K: 9,
          V: {
              kind: "scalar",
              T: 9
          }
      }, {
          no: 5,
          name: "intent_relevance",
          kind: "message",
          T: lo,
          repeated: !0
      }]));
      static fromBinary(e, t) {
          return (new _o).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new _o).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new _o).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(_o, e, t)
      }
  }
  class Eo extends d {
      startFilePathMigrateMeToUri = "";
      startFileUri = "";
      startFileRelPath = "";
      endFilePathMigrateMeToUri = "";
      endFileUri = "";
      endFileRelPath = "";
      oldFileContent = "";
      newFileContent = "";
      codeContextItemChanges = [];
      unchangedCodeContextItems = [];
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.code_edit.code_edit_pb.FileChange";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "start_file_path_migrate_me_to_uri",
          kind: "scalar",
          T: 9
      }, {
          no: 10,
          name: "start_file_uri",
          kind: "scalar",
          T: 9
      }, {
          no: 8,
          name: "start_file_rel_path",
          kind: "scalar",
          T: 9
      }, {
          no: 2,
          name: "end_file_path_migrate_me_to_uri",
          kind: "scalar",
          T: 9
      }, {
          no: 11,
          name: "end_file_uri",
          kind: "scalar",
          T: 9
      }, {
          no: 9,
          name: "end_file_rel_path",
          kind: "scalar",
          T: 9
      }, {
          no: 3,
          name: "old_file_content",
          kind: "scalar",
          T: 9
      }, {
          no: 4,
          name: "new_file_content",
          kind: "scalar",
          T: 9
      }, {
          no: 6,
          name: "code_context_item_changes",
          kind: "message",
          T: _o,
          repeated: !0
      }, {
          no: 7,
          name: "unchanged_code_context_items",
          kind: "message",
          T: On,
          repeated: !0
      }]));
      static fromBinary(e, t) {
          return (new Eo).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new Eo).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new Eo).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(Eo, e, t)
      }
  }
  class To extends d {
      intent = "";
      intentType = Ea.UNSPECIFIED;
      includeTestFiles = !1;
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.code_edit.code_edit_pb.Intent";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "intent",
          kind: "scalar",
          T: 9
      }, {
          no: 2,
          name: "intent_type",
          kind: "enum",
          T: Le.getEnumType(Ea)
      }, {
          no: 3,
          name: "include_test_files",
          kind: "scalar",
          T: 8
      }]));
      static fromBinary(e, t) {
          return (new To).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new To).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new To).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(To, e, t)
      }
  }
  class fo extends d {
      fileChanges = [];
      testFileChanges = [];
      intent = "";
      codeChangeDataSource = {
          case: void 0
      };
      unrelatedCcis = [];
      syntheticIntents = [];
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.code_edit.code_edit_pb.CodeChangeWithContext";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "repository",
          kind: "message",
          T: Cn
      }, {
          no: 2,
          name: "file_changes",
          kind: "message",
          T: Eo,
          repeated: !0
      }, {
          no: 9,
          name: "test_file_changes",
          kind: "message",
          T: Eo,
          repeated: !0
      }, {
          no: 3,
          name: "intent",
          kind: "scalar",
          T: 9
      }, {
          no: 4,
          name: "git_commit",
          kind: "message",
          T: po,
          oneof: "code_change_data_source"
      }, {
          no: 5,
          name: "index_stats",
          kind: "message",
          T: eo
      }, {
          no: 6,
          name: "unrelated_ccis",
          kind: "message",
          T: On,
          repeated: !0
      }, {
          no: 8,
          name: "synthetic_intents",
          kind: "message",
          T: To,
          repeated: !0
      }]));
      static fromBinary(e, t) {
          return (new fo).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new fo).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new fo).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(fo, e, t)
      }
  }
  class po extends d {
      commitHash = "";
      parentCommitHash = "";
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.code_edit.code_edit_pb.GitCommit";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "commit_hash",
          kind: "scalar",
          T: 9
      }, {
          no: 2,
          name: "parent_commit_hash",
          kind: "scalar",
          T: 9
      }]));
      static fromBinary(e, t) {
          return (new po).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new po).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new po).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(po, e, t)
      }
  }
  class So extends (null) {
      repoRoot = "";
      unrelatedCciMultiple = 0;
      dbDir = "";
      constructor(e) {
          super(),
          proto3.util.initPartial(e, this)
      }
      static runtime = null;
      static typeName = null;
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "repo_root",
          kind: "scalar",
          T: 9
      }, {
          no: 2,
          name: "repository",
          kind: "message",
          T: Cn
      }, {
          no: 3,
          name: "unrelated_cci_multiple",
          kind: "scalar",
          T: 5
      }, {
          no: 4,
          name: "db_dir",
          kind: "scalar",
          T: 9
      }]));
      static fromBinary(e, t) {
          return (new So).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new So).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new So).fromJsonString(e, t)
      }
      static equals(e, t) {
          return proto3.util.equals(So, e, t)
      }
  }
  class No extends (null) {
      from = "";
      to = "";
      constructor(e) {
          super(),
          proto3.util.initPartial(e, this)
      }
      static runtime = null;
      static typeName = null;
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "from",
          kind: "scalar",
          T: 9
      }, {
          no: 2,
          name: "to",
          kind: "scalar",
          T: 9
      }]));
      static fromBinary(e, t) {
          return (new No).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new No).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new No).fromJsonString(e, t)
      }
      static equals(e, t) {
          return proto3.util.equals(No, e, t)
      }
  }
  class go extends (null) {
      fileChanges = [];
      parentCommitHash = "";
      unrelatedCcis = [];
      constructor(e) {
          super(),
          proto3.util.initPartial(e, this)
      }
      static runtime = null;
      static typeName = null;
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "file_changes",
          kind: "message",
          T: Eo,
          repeated: !0
      }, {
          no: 2,
          name: "parent_commit_hash",
          kind: "scalar",
          T: 9
      }, {
          no: 3,
          name: "index_stats",
          kind: "message",
          T: eo
      }, {
          no: 4,
          name: "unrelated_ccis",
          kind: "message",
          T: On,
          repeated: !0
      }]));
      static fromBinary(e, t) {
          return (new go).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new go).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new go).fromJsonString(e, t)
      }
      static equals(e, t) {
          return proto3.util.equals(go, e, t)
      }
  }
  class Io extends (null) {
      query = "";
      targetCodeContexts = [];
      subdirectory = "";
      constructor(e) {
          super(),
          proto3.util.initPartial(e, this)
      }
      static runtime = null;
      static typeName = null;
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "repository",
          kind: "message",
          T: Cn
      }, {
          no: 5,
          name: "commit_info",
          kind: "message",
          T: po
      }, {
          no: 2,
          name: "query",
          kind: "scalar",
          T: 9
      }, {
          no: 3,
          name: "target_code_contexts",
          kind: "message",
          T: uo,
          repeated: !0
      }, {
          no: 4,
          name: "subdirectory",
          kind: "scalar",
          T: 9
      }]));
      static fromBinary(e, t) {
          return (new Io).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new Io).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new Io).fromJsonString(e, t)
      }
      static equals(e, t) {
          return proto3.util.equals(Io, e, t)
      }
  }
  class Co extends (null) {
      retrieverName = "";
      codeContextWithMetadatas = [];
      constructor(e) {
          super(),
          proto3.util.initPartial(e, this)
      }
      static runtime = null;
      static typeName = null;
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "repository",
          kind: "message",
          T: Cn
      }, {
          no: 3,
          name: "retriever_name",
          kind: "scalar",
          T: 9
      }, {
          no: 4,
          name: "retriever_info",
          kind: "message",
          T: wo
      }, {
          no: 5,
          name: "code_context_with_metadatas",
          kind: "message",
          T: Bi,
          repeated: !0
      }]));
      static fromBinary(e, t) {
          return (new Co).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new Co).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new Co).fromJsonString(e, t)
      }
      static equals(e, t) {
          return proto3.util.equals(Co, e, t)
      }
  }
  class Oo extends d {
      relevanceScore = 0;
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.code_edit.code_edit_pb.RetrieverClassification";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "relevance_score",
          kind: "scalar",
          T: 2
      }, {
          no: 2,
          name: "retriever_info",
          kind: "message",
          T: wo
      }]));
      static fromBinary(e, t) {
          return (new Oo).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new Oo).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new Oo).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(Oo, e, t)
      }
  }
  class yo extends d {
      relevant = !1;
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.code_edit.code_edit_pb.CodeContextItemWithClassification";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "code_context_item",
          kind: "message",
          T: uo
      }, {
          no: 2,
          name: "relevant",
          kind: "scalar",
          T: 8
      }, {
          no: 3,
          name: "prediction",
          kind: "message",
          T: Oo
      }]));
      static fromBinary(e, t) {
          return (new yo).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new yo).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new yo).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(yo, e, t)
      }
  }
  class wo extends d {
      type = Ta.UNSPECIFIED;
      modelName = "";
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.code_edit.code_edit_pb.RetrieverInfo";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "type",
          kind: "enum",
          T: Le.getEnumType(Ta)
      }, {
          no: 2,
          name: "model_name",
          kind: "scalar",
          T: 9
      }]));
      static fromBinary(e, t) {
          return (new wo).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new wo).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new wo).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(wo, e, t)
      }
  }
  class Ao extends d {
      precisionScore = 0;
      recallScore = 0;
      accuracyScore = 0;
      labelRankingAveragePrecisionScore = 0;
      rocAucScore = 0;
      averagePrecisionScore = 0;
      threshold = 0;
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.code_edit.code_edit_pb.RetrievalMetrics";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "retriever_info",
          kind: "message",
          T: wo
      }, {
          no: 2,
          name: "precision_score",
          kind: "scalar",
          T: 2
      }, {
          no: 3,
          name: "recall_score",
          kind: "scalar",
          T: 2
      }, {
          no: 4,
          name: "accuracy_score",
          kind: "scalar",
          T: 2
      }, {
          no: 5,
          name: "label_ranking_average_precision_score",
          kind: "scalar",
          T: 2
      }, {
          no: 6,
          name: "roc_auc_score",
          kind: "scalar",
          T: 2
      }, {
          no: 7,
          name: "average_precision_score",
          kind: "scalar",
          T: 2
      }, {
          no: 8,
          name: "threshold",
          kind: "scalar",
          T: 2
      }]));
      static fromBinary(e, t) {
          return (new Ao).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new Ao).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new Ao).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(Ao, e, t)
      }
  }
  class Po extends (null) {
      classifiedItems = [];
      constructor(e) {
          super(),
          proto3.util.initPartial(e, this)
      }
      static runtime = null;
      static typeName = null;
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "repository",
          kind: "message",
          T: Cn
      }, {
          no: 2,
          name: "classified_items",
          kind: "message",
          T: yo,
          repeated: !0
      }, {
          no: 3,
          name: "metrics",
          kind: "message",
          T: Ao
      }]));
      static fromBinary(e, t) {
          return (new Po).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new Po).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new Po).fromJsonString(e, t)
      }
      static equals(e, t) {
          return proto3.util.equals(Po, e, t)
      }
  }
  class Lo extends d {
      id = 0;
      file = "";
      function = "";
      instruction = "";
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.code_edit.code_edit_pb.InstructionWithId";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "id",
          kind: "scalar",
          T: 5
      }, {
          no: 2,
          name: "file",
          kind: "scalar",
          T: 9
      }, {
          no: 3,
          name: "function",
          kind: "scalar",
          T: 9
      }, {
          no: 4,
          name: "instruction",
          kind: "scalar",
          T: 9
      }]));
      static fromBinary(e, t) {
          return (new Lo).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new Lo).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new Lo).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(Lo, e, t)
      }
  }
  class Ro extends (null) {
      instructions = [];
      constructor(e) {
          super(),
          proto3.util.initPartial(e, this)
      }
      static runtime = null;
      static typeName = null;
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "instructions",
          kind: "message",
          T: Lo,
          repeated: !0
      }]));
      static fromBinary(e, t) {
          return (new Ro).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new Ro).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new Ro).fromJsonString(e, t)
      }
      static equals(e, t) {
          return proto3.util.equals(Ro, e, t)
      }
  }
  !function(e) {
      e[e.UNSPECIFIED = 0] = "UNSPECIFIED",
      e[e.HYBRID = 1] = "HYBRID",
      e[e.KEYWORD = 2] = "KEYWORD",
      e[e.APPROXIMATE_KNN = 3] = "APPROXIMATE_KNN",
      e[e.BRUTE_FORCE_KNN = 4] = "BRUTE_FORCE_KNN"
  }(fa || (fa = {})),
  Le.util.setEnumType(fa, "exa.opensearch_clients_pb.SearchMode", [{
      no: 0,
      name: "SEARCH_MODE_UNSPECIFIED"
  }, {
      no: 1,
      name: "SEARCH_MODE_HYBRID"
  }, {
      no: 2,
      name: "SEARCH_MODE_KEYWORD"
  }, {
      no: 3,
      name: "SEARCH_MODE_APPROXIMATE_KNN"
  }, {
      no: 4,
      name: "SEARCH_MODE_BRUTE_FORCE_KNN"
  }]),
  function(e) {
      e[e.UNSPECIFIED = 0] = "UNSPECIFIED",
      e[e.GITHUB = 1] = "GITHUB",
      e[e.SLACK = 2] = "SLACK",
      e[e.GOOGLE_DRIVE = 3] = "GOOGLE_DRIVE",
      e[e.JIRA = 4] = "JIRA",
      e[e.CODEIUM = 5] = "CODEIUM",
      e[e.EMAIL = 6] = "EMAIL"
  }(pa || (pa = {})),
  Le.util.setEnumType(pa, "exa.opensearch_clients_pb.ConnectorType", [{
      no: 0,
      name: "CONNECTOR_TYPE_UNSPECIFIED"
  }, {
      no: 1,
      name: "CONNECTOR_TYPE_GITHUB"
  }, {
      no: 2,
      name: "CONNECTOR_TYPE_SLACK"
  }, {
      no: 3,
      name: "CONNECTOR_TYPE_GOOGLE_DRIVE"
  }, {
      no: 4,
      name: "CONNECTOR_TYPE_JIRA"
  }, {
      no: 5,
      name: "CONNECTOR_TYPE_CODEIUM"
  }, {
      no: 6,
      name: "CONNECTOR_TYPE_EMAIL"
  }]),
  function(e) {
      e[e.UNSPECIFIED = 0] = "UNSPECIFIED",
      e[e.QUEUED = 1] = "QUEUED",
      e[e.RUNNING = 2] = "RUNNING",
      e[e.COMPLETED = 3] = "COMPLETED",
      e[e.CANCELLED = 4] = "CANCELLED",
      e[e.CANCELLING = 5] = "CANCELLING",
      e[e.ERRORED = 6] = "ERRORED",
      e[e.RETRYABLE = 7] = "RETRYABLE"
  }(Sa || (Sa = {})),
  Le.util.setEnumType(Sa, "exa.opensearch_clients_pb.JobStatus", [{
      no: 0,
      name: "JOB_STATUS_UNSPECIFIED"
  }, {
      no: 1,
      name: "JOB_STATUS_QUEUED"
  }, {
      no: 2,
      name: "JOB_STATUS_RUNNING"
  }, {
      no: 3,
      name: "JOB_STATUS_COMPLETED"
  }, {
      no: 4,
      name: "JOB_STATUS_CANCELLED"
  }, {
      no: 5,
      name: "JOB_STATUS_CANCELLING"
  }, {
      no: 6,
      name: "JOB_STATUS_ERRORED"
  }, {
      no: 7,
      name: "JOB_STATUS_RETRYABLE"
  }]);
  class ko extends d {
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.opensearch_clients_pb.TimeRange";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "start",
          kind: "message",
          T: Je
      }, {
          no: 2,
          name: "end",
          kind: "message",
          T: Je
      }]));
      static fromBinary(e, t) {
          return (new ko).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new ko).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new ko).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(ko, e, t)
      }
  }
  class Jo extends d {
      authUid = "";
      email = "";
      name = "";
      photoUrl = "";
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.opensearch_clients_pb.UserInfo";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "auth_uid",
          kind: "scalar",
          T: 9
      }, {
          no: 2,
          name: "email",
          kind: "scalar",
          T: 9
      }, {
          no: 3,
          name: "name",
          kind: "scalar",
          T: 9
      }, {
          no: 4,
          name: "photo_url",
          kind: "scalar",
          T: 9
      }]));
      static fromBinary(e, t) {
          return (new Jo).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new Jo).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new Jo).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(Jo, e, t)
      }
  }
  class Do extends (null) {
      users = [];
      constructor(e) {
          super(),
          proto3.util.initPartial(e, this)
      }
      static runtime = null;
      static typeName = null;
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "users",
          kind: "message",
          T: Jo,
          repeated: !0
      }]));
      static fromBinary(e, t) {
          return (new Do).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new Do).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new Do).fromJsonString(e, t)
      }
      static equals(e, t) {
          return proto3.util.equals(Do, e, t)
      }
  }
  class ho extends (null) {
      constructor(e) {
          super(),
          proto3.util.initPartial(e, this)
      }
      static runtime = null;
      static typeName = null;
      static fields = Le.util.newFieldList(( () => []));
      static fromBinary(e, t) {
          return (new ho).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new ho).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new ho).fromJsonString(e, t)
      }
      static equals(e, t) {
          return proto3.util.equals(ho, e, t)
      }
  }
  class xo extends (null) {
      maxResults = protoInt64.zero;
      queries = [];
      aggregateIds = [];
      chatMessagePrompts = [];
      indexChoices = [];
      searchMode = fa.UNSPECIFIED;
      disableReranking = !1;
      disableContextualLookup = !1;
      query = "";
      constructor(e) {
          super(),
          proto3.util.initPartial(e, this)
      }
      static runtime = null;
      static typeName = null;
      static fields = Le.util.newFieldList(( () => [{
          no: 2,
          name: "max_results",
          kind: "scalar",
          T: 3
      }, {
          no: 3,
          name: "queries",
          kind: "scalar",
          T: 9,
          repeated: !0
      }, {
          no: 4,
          name: "metadata",
          kind: "message",
          T: on
      }, {
          no: 5,
          name: "aggregate_ids",
          kind: "scalar",
          T: 9,
          repeated: !0
      }, {
          no: 6,
          name: "chat_message_prompts",
          kind: "message",
          T: Si,
          repeated: !0
      }, {
          no: 7,
          name: "time_range",
          kind: "message",
          T: ko
      }, {
          no: 8,
          name: "index_choices",
          kind: "enum",
          T: Le.getEnumType(Rt),
          repeated: !0
      }, {
          no: 9,
          name: "search_mode",
          kind: "enum",
          T: Le.getEnumType(fa)
      }, {
          no: 10,
          name: "disable_reranking",
          kind: "scalar",
          T: 8
      }, {
          no: 11,
          name: "disable_contextual_lookup",
          kind: "scalar",
          T: 8
      }, {
          no: 1,
          name: "query",
          kind: "scalar",
          T: 9
      }]));
      static fromBinary(e, t) {
          return (new xo).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new xo).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new xo).fromJsonString(e, t)
      }
      static equals(e, t) {
          return proto3.util.equals(xo, e, t)
      }
  }
  class Uo extends (null) {
      knowledgeBaseGroups = [];
      constructor(e) {
          super(),
          proto3.util.initPartial(e, this)
      }
      static runtime = null;
      static typeName = null;
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "knowledge_base_groups",
          kind: "message",
          T: vr,
          repeated: !0
      }]));
      static fromBinary(e, t) {
          return (new Uo).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new Uo).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new Uo).fromJsonString(e, t)
      }
      static equals(e, t) {
          return proto3.util.equals(Uo, e, t)
      }
  }
  class Mo extends (null) {
      query = "";
      indexChoices = [];
      indexNames = [];
      constructor(e) {
          super(),
          proto3.util.initPartial(e, this)
      }
      static runtime = null;
      static typeName = null;
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "query",
          kind: "scalar",
          T: 9
      }, {
          no: 3,
          name: "metadata",
          kind: "message",
          T: on
      }, {
          no: 4,
          name: "index_choices",
          kind: "enum",
          T: Le.getEnumType(Rt),
          repeated: !0
      }, {
          no: 2,
          name: "index_names",
          kind: "scalar",
          T: 9,
          repeated: !0
      }]));
      static fromBinary(e, t) {
          return (new Mo).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new Mo).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new Mo).fromJsonString(e, t)
      }
      static equals(e, t) {
          return proto3.util.equals(Mo, e, t)
      }
  }
  class Bo extends (null) {
      scopeItems = [];
      constructor(e) {
          super(),
          proto3.util.initPartial(e, this)
      }
      static runtime = null;
      static typeName = null;
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "scope_items",
          kind: "message",
          T: Qn,
          repeated: !0
      }]));
      static fromBinary(e, t) {
          return (new Bo).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new Bo).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new Bo).fromJsonString(e, t)
      }
      static equals(e, t) {
          return proto3.util.equals(Bo, e, t)
      }
  }
  class Fo extends (null) {
      scopeItems = [];
      constructor(e) {
          super(),
          proto3.util.initPartial(e, this)
      }
      static runtime = null;
      static typeName = null;
      static fields = Le.util.newFieldList(( () => [{
          no: 2,
          name: "metadata",
          kind: "message",
          T: on
      }, {
          no: 3,
          name: "scope_items",
          kind: "message",
          T: Qn,
          repeated: !0
      }]));
      static fromBinary(e, t) {
          return (new Fo).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new Fo).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new Fo).fromJsonString(e, t)
      }
      static equals(e, t) {
          return proto3.util.equals(Fo, e, t)
      }
  }
  class bo extends (null) {
      knowledgeBaseItemsWithMetadata = [];
      constructor(e) {
          super(),
          proto3.util.initPartial(e, this)
      }
      static runtime = null;
      static typeName = null;
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "knowledge_base_items_with_metadata",
          kind: "message",
          T: Gr,
          repeated: !0
      }]));
      static fromBinary(e, t) {
          return (new bo).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new bo).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new bo).fromJsonString(e, t)
      }
      static equals(e, t) {
          return proto3.util.equals(bo, e, t)
      }
  }
  class qo extends (null) {
      channelIds = [];
      constructor(e) {
          super(),
          proto3.util.initPartial(e, this)
      }
      static runtime = null;
      static typeName = null;
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "metadata",
          kind: "message",
          T: rs
      }, {
          no: 2,
          name: "channel_ids",
          kind: "scalar",
          T: 9,
          repeated: !0
      }]));
      static fromBinary(e, t) {
          return (new qo).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new qo).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new qo).fromJsonString(e, t)
      }
      static equals(e, t) {
          return proto3.util.equals(qo, e, t)
      }
  }
  class Go extends (null) {
      constructor(e) {
          super(),
          proto3.util.initPartial(e, this)
      }
      static runtime = null;
      static typeName = null;
      static fields = Le.util.newFieldList(( () => []));
      static fromBinary(e, t) {
          return (new Go).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new Go).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new Go).fromJsonString(e, t)
      }
      static equals(e, t) {
          return proto3.util.equals(Go, e, t)
      }
  }
  class vo extends (null) {
      organization = "";
      repository = "";
      constructor(e) {
          super(),
          proto3.util.initPartial(e, this)
      }
      static runtime = null;
      static typeName = null;
      static fields = Le.util.newFieldList(( () => [{
          no: 3,
          name: "metadata",
          kind: "message",
          T: rs
      }, {
          no: 1,
          name: "organization",
          kind: "scalar",
          T: 9
      }, {
          no: 2,
          name: "repository",
          kind: "scalar",
          T: 9
      }]));
      static fromBinary(e, t) {
          return (new vo).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new vo).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new vo).fromJsonString(e, t)
      }
      static equals(e, t) {
          return proto3.util.equals(vo, e, t)
      }
  }
  class Ho extends (null) {
      constructor(e) {
          super(),
          proto3.util.initPartial(e, this)
      }
      static runtime = null;
      static typeName = null;
      static fields = Le.util.newFieldList(( () => []));
      static fromBinary(e, t) {
          return (new Ho).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new Ho).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new Ho).fromJsonString(e, t)
      }
      static equals(e, t) {
          return proto3.util.equals(Ho, e, t)
      }
  }
  class Vo extends (null) {
      folderId = "";
      constructor(e) {
          super(),
          proto3.util.initPartial(e, this)
      }
      static runtime = null;
      static typeName = null;
      static fields = Le.util.newFieldList(( () => [{
          no: 2,
          name: "metadata",
          kind: "message",
          T: rs
      }, {
          no: 1,
          name: "folder_id",
          kind: "scalar",
          T: 9
      }]));
      static fromBinary(e, t) {
          return (new Vo).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new Vo).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new Vo).fromJsonString(e, t)
      }
      static equals(e, t) {
          return proto3.util.equals(Vo, e, t)
      }
  }
  class Xo extends (null) {
      constructor(e) {
          super(),
          proto3.util.initPartial(e, this)
      }
      static runtime = null;
      static typeName = null;
      static fields = Le.util.newFieldList(( () => []));
      static fromBinary(e, t) {
          return (new Xo).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new Xo).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new Xo).fromJsonString(e, t)
      }
      static equals(e, t) {
          return proto3.util.equals(Xo, e, t)
      }
  }
  class Yo extends (null) {
      url = "";
      token = "";
      username = "";
      constructor(e) {
          super(),
          proto3.util.initPartial(e, this)
      }
      static runtime = null;
      static typeName = null;
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "url",
          kind: "scalar",
          T: 9
      }, {
          no: 2,
          name: "token",
          kind: "scalar",
          T: 9
      }, {
          no: 3,
          name: "username",
          kind: "scalar",
          T: 9
      }, {
          no: 4,
          name: "metadata",
          kind: "message",
          T: rs
      }]));
      static fromBinary(e, t) {
          return (new Yo).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new Yo).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new Yo).fromJsonString(e, t)
      }
      static equals(e, t) {
          return proto3.util.equals(Yo, e, t)
      }
  }
  class Ko extends (null) {
      constructor(e) {
          super(),
          proto3.util.initPartial(e, this)
      }
      static runtime = null;
      static typeName = null;
      static fields = Le.util.newFieldList(( () => []));
      static fromBinary(e, t) {
          return (new Ko).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new Ko).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new Ko).fromJsonString(e, t)
      }
      static equals(e, t) {
          return proto3.util.equals(Ko, e, t)
      }
  }
  class Wo extends (null) {
      event = "";
      constructor(e) {
          super(),
          proto3.util.initPartial(e, this)
      }
      static runtime = null;
      static typeName = null;
      static fields = Le.util.newFieldList(( () => [{
          no: 3,
          name: "event",
          kind: "scalar",
          T: 9
      }]));
      static fromBinary(e, t) {
          return (new Wo).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new Wo).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new Wo).fromJsonString(e, t)
      }
      static equals(e, t) {
          return proto3.util.equals(Wo, e, t)
      }
  }
  class zo extends (null) {
      constructor(e) {
          super(),
          proto3.util.initPartial(e, this)
      }
      static runtime = null;
      static typeName = null;
      static fields = Le.util.newFieldList(( () => []));
      static fromBinary(e, t) {
          return (new zo).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new zo).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new zo).fromJsonString(e, t)
      }
      static equals(e, t) {
          return proto3.util.equals(zo, e, t)
      }
  }
  class jo extends (null) {
      payload = [];
      constructor(e) {
          super(),
          proto3.util.initPartial(e, this)
      }
      static runtime = null;
      static typeName = null;
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "payload",
          kind: "message",
          T: gm,
          repeated: !0
      }]));
      static fromBinary(e, t) {
          return (new jo).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new jo).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new jo).fromJsonString(e, t)
      }
      static equals(e, t) {
          return proto3.util.equals(jo, e, t)
      }
  }
  class $o extends (null) {
      constructor(e) {
          super(),
          proto3.util.initPartial(e, this)
      }
      static runtime = null;
      static typeName = null;
      static fields = Le.util.newFieldList(( () => []));
      static fromBinary(e, t) {
          return (new $o).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new $o).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new $o).fromJsonString(e, t)
      }
      static equals(e, t) {
          return proto3.util.equals($o, e, t)
      }
  }
  class Qo extends d {
      documentId = "";
      text = "";
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.opensearch_clients_pb.CommonDocument";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "document_id",
          kind: "scalar",
          T: 9
      }, {
          no: 2,
          name: "text",
          kind: "scalar",
          T: 9
      }]));
      static fromBinary(e, t) {
          return (new Qo).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new Qo).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new Qo).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(Qo, e, t)
      }
  }
  class Zo extends d {
      score = 0;
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.opensearch_clients_pb.CommonDocumentWithScore";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "document",
          kind: "message",
          T: Qo
      }, {
          no: 2,
          name: "score",
          kind: "scalar",
          T: 2
      }]));
      static fromBinary(e, t) {
          return (new Zo).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new Zo).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new Zo).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(Zo, e, t)
      }
  }
  class em extends (null) {
      text = "";
      url = "";
      constructor(e) {
          super(),
          proto3.util.initPartial(e, this)
      }
      static runtime = null;
      static typeName = null;
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "text",
          kind: "scalar",
          T: 9
      }, {
          no: 2,
          name: "url",
          kind: "scalar",
          T: 9
      }]));
      static fromBinary(e, t) {
          return (new em).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new em).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new em).fromJsonString(e, t)
      }
      static equals(e, t) {
          return proto3.util.equals(em, e, t)
      }
  }
  class tm extends (null) {
      documentWithScores = [];
      constructor(e) {
          super(),
          proto3.util.initPartial(e, this)
      }
      static runtime = null;
      static typeName = null;
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "document_with_scores",
          kind: "message",
          T: Zo,
          repeated: !0
      }]));
      static fromBinary(e, t) {
          return (new tm).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new tm).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new tm).fromJsonString(e, t)
      }
      static equals(e, t) {
          return proto3.util.equals(tm, e, t)
      }
  }
  class nm extends (null) {
      constructor(e) {
          super(),
          proto3.util.initPartial(e, this)
      }
      static runtime = null;
      static typeName = null;
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "metadata",
          kind: "message",
          T: rs
      }, {
          no: 2,
          name: "config",
          kind: "message",
          T: Wi
      }, {
          no: 3,
          name: "initial_index",
          kind: "message",
          T: ns
      }]));
      static fromBinary(e, t) {
          return (new nm).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new nm).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new nm).fromJsonString(e, t)
      }
      static equals(e, t) {
          return proto3.util.equals(nm, e, t)
      }
  }
  class rm extends (null) {
      repoName = "";
      indexId = "";
      constructor(e) {
          super(),
          proto3.util.initPartial(e, this)
      }
      static runtime = null;
      static typeName = null;
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "repo_name",
          kind: "scalar",
          T: 9
      }, {
          no: 2,
          name: "index_id",
          kind: "scalar",
          T: 9
      }]));
      static fromBinary(e, t) {
          return (new rm).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new rm).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new rm).fromJsonString(e, t)
      }
      static equals(e, t) {
          return proto3.util.equals(rm, e, t)
      }
  }
  class am extends (null) {
      indexId = "";
      constructor(e) {
          super(),
          proto3.util.initPartial(e, this)
      }
      static runtime = null;
      static typeName = null;
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "index_id",
          kind: "scalar",
          T: 9
      }]));
      static fromBinary(e, t) {
          return (new am).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new am).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new am).fromJsonString(e, t)
      }
      static equals(e, t) {
          return proto3.util.equals(am, e, t)
      }
  }
  class im extends (null) {
      status = IndexingStatus.UNSPECIFIED;
      constructor(e) {
          super(),
          proto3.util.initPartial(e, this)
      }
      static runtime = null;
      static typeName = null;
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "status",
          kind: "enum",
          T: Le.getEnumType(la)
      }]));
      static fromBinary(e, t) {
          return (new im).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new im).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new im).fromJsonString(e, t)
      }
      static equals(e, t) {
          return proto3.util.equals(im, e, t)
      }
  }
  class sm extends (null) {
      query = "";
      maxResults = protoInt64.zero;
      constructor(e) {
          super(),
          proto3.util.initPartial(e, this)
      }
      static runtime = null;
      static typeName = null;
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "query",
          kind: "scalar",
          T: 9
      }, {
          no: 2,
          name: "embedding",
          kind: "message",
          T: nn
      }, {
          no: 3,
          name: "max_results",
          kind: "scalar",
          T: 3
      }]));
      static fromBinary(e, t) {
          return (new sm).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new sm).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new sm).fromJsonString(e, t)
      }
      static equals(e, t) {
          return proto3.util.equals(sm, e, t)
      }
  }
  class om extends (null) {
      documentWithScores = [];
      constructor(e) {
          super(),
          proto3.util.initPartial(e, this)
      }
      static runtime = null;
      static typeName = null;
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "document_with_scores",
          kind: "message",
          T: Zo,
          repeated: !0
      }]));
      static fromBinary(e, t) {
          return (new om).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new om).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new om).fromJsonString(e, t)
      }
      static equals(e, t) {
          return proto3.util.equals(om, e, t)
      }
  }
  class mm extends (null) {
      query = "";
      maxResults = protoInt64.zero;
      constructor(e) {
          super(),
          proto3.util.initPartial(e, this)
      }
      static runtime = null;
      static typeName = null;
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "query",
          kind: "scalar",
          T: 9
      }, {
          no: 2,
          name: "embedding",
          kind: "message",
          T: nn
      }, {
          no: 3,
          name: "max_results",
          kind: "scalar",
          T: 3
      }]));
      static fromBinary(e, t) {
          return (new mm).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new mm).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new mm).fromJsonString(e, t)
      }
      static equals(e, t) {
          return proto3.util.equals(mm, e, t)
      }
  }
  class cm extends (null) {
      documentWithScores = [];
      constructor(e) {
          super(),
          proto3.util.initPartial(e, this)
      }
      static runtime = null;
      static typeName = null;
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "document_with_scores",
          kind: "message",
          T: Zo,
          repeated: !0
      }]));
      static fromBinary(e, t) {
          return (new cm).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new cm).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new cm).fromJsonString(e, t)
      }
      static equals(e, t) {
          return proto3.util.equals(cm, e, t)
      }
  }
  class um extends (null) {
      connector = pa.UNSPECIFIED;
      accessToken = "";
      refreshToken = "";
      constructor(e) {
          super(),
          proto3.util.initPartial(e, this)
      }
      static runtime = null;
      static typeName = null;
      static fields = Le.util.newFieldList(( () => [{
          no: 7,
          name: "metadata",
          kind: "message",
          T: rs
      }, {
          no: 2,
          name: "connector",
          kind: "enum",
          T: Le.getEnumType(pa)
      }, {
          no: 3,
          name: "access_token",
          kind: "scalar",
          T: 9
      }, {
          no: 4,
          name: "access_token_expires_at",
          kind: "message",
          T: Je
      }, {
          no: 5,
          name: "refresh_token",
          kind: "scalar",
          T: 9
      }, {
          no: 6,
          name: "refresh_token_expires_at",
          kind: "message",
          T: Je
      }]));
      static fromBinary(e, t) {
          return (new um).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new um).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new um).fromJsonString(e, t)
      }
      static equals(e, t) {
          return proto3.util.equals(um, e, t)
      }
  }
  class lm extends (null) {
      constructor(e) {
          super(),
          proto3.util.initPartial(e, this)
      }
      static runtime = null;
      static typeName = null;
      static fields = Le.util.newFieldList(( () => []));
      static fromBinary(e, t) {
          return (new lm).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new lm).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new lm).fromJsonString(e, t)
      }
      static equals(e, t) {
          return proto3.util.equals(lm, e, t)
      }
  }
  class _m extends (null) {
      jobIds = [];
      constructor(e) {
          super(),
          proto3.util.initPartial(e, this)
      }
      static runtime = null;
      static typeName = null;
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "metadata",
          kind: "message",
          T: rs
      }, {
          no: 2,
          name: "job_ids",
          kind: "scalar",
          T: 3,
          repeated: !0
      }]));
      static fromBinary(e, t) {
          return (new _m).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new _m).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new _m).fromJsonString(e, t)
      }
      static equals(e, t) {
          return proto3.util.equals(_m, e, t)
      }
  }
  class dm extends (null) {
      constructor(e) {
          super(),
          proto3.util.initPartial(e, this)
      }
      static runtime = null;
      static typeName = null;
      static fields = Le.util.newFieldList(( () => []));
      static fromBinary(e, t) {
          return (new dm).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new dm).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new dm).fromJsonString(e, t)
      }
      static equals(e, t) {
          return proto3.util.equals(dm, e, t)
      }
  }
  class Em extends d {
      connector = pa.UNSPECIFIED;
      initialized = !1;
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.opensearch_clients_pb.ConnectorState";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "connector",
          kind: "enum",
          T: Le.getEnumType(pa)
      }, {
          no: 2,
          name: "initialized",
          kind: "scalar",
          T: 8
      }]));
      static fromBinary(e, t) {
          return (new Em).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new Em).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new Em).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(Em, e, t)
      }
  }
  class Tm extends (null) {
      connectorTypes = [];
      constructor(e) {
          super(),
          proto3.util.initPartial(e, this)
      }
      static runtime = null;
      static typeName = null;
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "metadata",
          kind: "message",
          T: rs
      }, {
          no: 2,
          name: "connector_types",
          kind: "enum",
          T: Le.getEnumType(pa),
          repeated: !0
      }]));
      static fromBinary(e, t) {
          return (new Tm).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new Tm).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new Tm).fromJsonString(e, t)
      }
      static equals(e, t) {
          return proto3.util.equals(Tm, e, t)
      }
  }
  class fm extends (null) {
      connectorStates = [];
      constructor(e) {
          super(),
          proto3.util.initPartial(e, this)
      }
      static runtime = null;
      static typeName = null;
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "connector_states",
          kind: "message",
          T: Em,
          repeated: !0
      }]));
      static fromBinary(e, t) {
          return (new fm).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new fm).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new fm).fromJsonString(e, t)
      }
      static equals(e, t) {
          return proto3.util.equals(fm, e, t)
      }
  }
  class pm extends d {
      connector = pa.UNSPECIFIED;
      id = y.zero;
      status = Sa.UNSPECIFIED;
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.opensearch_clients_pb.JobState";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "connector",
          kind: "enum",
          T: Le.getEnumType(pa)
      }, {
          no: 2,
          name: "id",
          kind: "scalar",
          T: 3
      }, {
          no: 3,
          name: "status",
          kind: "enum",
          T: Le.getEnumType(Sa)
      }]));
      static fromBinary(e, t) {
          return (new pm).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new pm).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new pm).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(pm, e, t)
      }
  }
  class Sm extends (null) {
      connectorTypes = [];
      constructor(e) {
          super(),
          proto3.util.initPartial(e, this)
      }
      static runtime = null;
      static typeName = null;
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "metadata",
          kind: "message",
          T: rs
      }, {
          no: 2,
          name: "connector_types",
          kind: "enum",
          T: Le.getEnumType(pa),
          repeated: !0
      }]));
      static fromBinary(e, t) {
          return (new Sm).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new Sm).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new Sm).fromJsonString(e, t)
      }
      static equals(e, t) {
          return proto3.util.equals(Sm, e, t)
      }
  }
  class Nm extends (null) {
      jobStates = [];
      constructor(e) {
          super(),
          proto3.util.initPartial(e, this)
      }
      static runtime = null;
      static typeName = null;
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "job_states",
          kind: "message",
          T: pm,
          repeated: !0
      }]));
      static fromBinary(e, t) {
          return (new Nm).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new Nm).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new Nm).fromJsonString(e, t)
      }
      static equals(e, t) {
          return proto3.util.equals(Nm, e, t)
      }
  }
  class gm extends d {
      datasetId = "";
      previousMessageDatasetId = "";
      type = "";
      channelId = "";
      user = "";
      text = "";
      timestamp = "";
      threadTimestamp = "";
      channelName = "";
      teamName = "";
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.opensearch_clients_pb.SlackPayload";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "dataset_id",
          kind: "scalar",
          T: 9
      }, {
          no: 2,
          name: "previous_message_dataset_id",
          kind: "scalar",
          T: 9
      }, {
          no: 3,
          name: "type",
          kind: "scalar",
          T: 9
      }, {
          no: 4,
          name: "channel_id",
          kind: "scalar",
          T: 9
      }, {
          no: 5,
          name: "user",
          kind: "scalar",
          T: 9
      }, {
          no: 6,
          name: "text",
          kind: "scalar",
          T: 9
      }, {
          no: 7,
          name: "timestamp",
          kind: "scalar",
          T: 9
      }, {
          no: 8,
          name: "thread_timestamp",
          kind: "scalar",
          T: 9
      }, {
          no: 9,
          name: "channel_name",
          kind: "scalar",
          T: 9
      }, {
          no: 10,
          name: "team_name",
          kind: "scalar",
          T: 9
      }]));
      static fromBinary(e, t) {
          return (new gm).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new gm).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new gm).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(gm, e, t)
      }
  }
  !function(e) {
      e[e.UNSPECIFIED = 0] = "UNSPECIFIED",
      e[e.ERROR = 1] = "ERROR",
      e[e.INITIALIZED = 2] = "INITIALIZED",
      e[e.PREPARING = 3] = "PREPARING",
      e[e.PREPARED = 4] = "PREPARED",
      e[e.APPLYING = 5] = "APPLYING",
      e[e.APPLIED = 6] = "APPLIED",
      e[e.REJECTED = 7] = "REJECTED"
  }(Na || (Na = {})),
  Le.util.setEnumType(Na, "exa.cortex_pb.ActionStatus", [{
      no: 0,
      name: "ACTION_STATUS_UNSPECIFIED"
  }, {
      no: 1,
      name: "ACTION_STATUS_ERROR"
  }, {
      no: 2,
      name: "ACTION_STATUS_INITIALIZED"
  }, {
      no: 3,
      name: "ACTION_STATUS_PREPARING"
  }, {
      no: 4,
      name: "ACTION_STATUS_PREPARED"
  }, {
      no: 5,
      name: "ACTION_STATUS_APPLYING"
  }, {
      no: 6,
      name: "ACTION_STATUS_APPLIED"
  }, {
      no: 7,
      name: "ACTION_STATUS_REJECTED"
  }]),
  function(e) {
      e[e.UNSPECIFIED = 0] = "UNSPECIFIED",
      e[e.INITIALIZED = 1] = "INITIALIZED",
      e[e.PLANNING = 2] = "PLANNING",
      e[e.PLANNED = 3] = "PLANNED",
      e[e.ERROR = 4] = "ERROR"
  }(ga || (ga = {})),
  Le.util.setEnumType(ga, "exa.cortex_pb.PlanStatus", [{
      no: 0,
      name: "PLAN_STATUS_UNSPECIFIED"
  }, {
      no: 1,
      name: "PLAN_STATUS_INITIALIZED"
  }, {
      no: 2,
      name: "PLAN_STATUS_PLANNING"
  }, {
      no: 3,
      name: "PLAN_STATUS_PLANNED"
  }, {
      no: 4,
      name: "PLAN_STATUS_ERROR"
  }]),
  function(e) {
      e[e.UNSPECIFIED = 0] = "UNSPECIFIED",
      e[e.CASCADE = 1] = "CASCADE",
      e[e.USER_IMPLICIT = 2] = "USER_IMPLICIT"
  }(Ia || (Ia = {})),
  Le.util.setEnumType(Ia, "exa.cortex_pb.CortexRequestSource", [{
      no: 0,
      name: "CORTEX_REQUEST_SOURCE_UNSPECIFIED"
  }, {
      no: 1,
      name: "CORTEX_REQUEST_SOURCE_CASCADE"
  }, {
      no: 2,
      name: "CORTEX_REQUEST_SOURCE_USER_IMPLICIT"
  }]),
  function(e) {
      e[e.UNSPECIFIED = 0] = "UNSPECIFIED",
      e[e.USER_MAINLINE = 1] = "USER_MAINLINE",
      e[e.USER_GRANULAR = 2] = "USER_GRANULAR",
      e[e.SUPERCOMPLETE = 3] = "SUPERCOMPLETE",
      e[e.CASCADE = 4] = "CASCADE",
      e[e.BACKGROUND_RESEARCH = 5] = "BACKGROUND_RESEARCH"
  }(Ca || (Ca = {})),
  Le.util.setEnumType(Ca, "exa.cortex_pb.CortexTrajectoryType", [{
      no: 0,
      name: "CORTEX_TRAJECTORY_TYPE_UNSPECIFIED"
  }, {
      no: 1,
      name: "CORTEX_TRAJECTORY_TYPE_USER_MAINLINE"
  }, {
      no: 2,
      name: "CORTEX_TRAJECTORY_TYPE_USER_GRANULAR"
  }, {
      no: 3,
      name: "CORTEX_TRAJECTORY_TYPE_SUPERCOMPLETE"
  }, {
      no: 4,
      name: "CORTEX_TRAJECTORY_TYPE_CASCADE"
  }, {
      no: 5,
      name: "CORTEX_TRAJECTORY_TYPE_BACKGROUND_RESEARCH"
  }]),
  function(e) {
      e[e.UNSPECIFIED = 0] = "UNSPECIFIED",
      e[e.MANUAL = 1] = "MANUAL",
      e[e.MODEL = 2] = "MODEL",
      e[e.USER_IMPLICIT = 3] = "USER_IMPLICIT",
      e[e.USER_EXPLICIT = 4] = "USER_EXPLICIT",
      e[e.SYSTEM = 5] = "SYSTEM"
  }(Oa || (Oa = {})),
  Le.util.setEnumType(Oa, "exa.cortex_pb.CortexStepSource", [{
      no: 0,
      name: "CORTEX_STEP_SOURCE_UNSPECIFIED"
  }, {
      no: 1,
      name: "CORTEX_STEP_SOURCE_MANUAL"
  }, {
      no: 2,
      name: "CORTEX_STEP_SOURCE_MODEL"
  }, {
      no: 3,
      name: "CORTEX_STEP_SOURCE_USER_IMPLICIT"
  }, {
      no: 4,
      name: "CORTEX_STEP_SOURCE_USER_EXPLICIT"
  }, {
      no: 5,
      name: "CORTEX_STEP_SOURCE_SYSTEM"
  }]),
  function(e) {
      e[e.UNSPECIFIED = 0] = "UNSPECIFIED",
      e[e.INVOCATION_BLOCKING = 1] = "INVOCATION_BLOCKING",
      e[e.EXECUTOR_BLOCKING = 2] = "EXECUTOR_BLOCKING",
      e[e.FULL_ASYNC = 3] = "FULL_ASYNC"
  }(ya || (ya = {})),
  Le.util.setEnumType(ya, "exa.cortex_pb.ExecutionAsyncLevel", [{
      no: 0,
      name: "EXECUTION_ASYNC_LEVEL_UNSPECIFIED"
  }, {
      no: 1,
      name: "EXECUTION_ASYNC_LEVEL_INVOCATION_BLOCKING"
  }, {
      no: 2,
      name: "EXECUTION_ASYNC_LEVEL_EXECUTOR_BLOCKING"
  }, {
      no: 3,
      name: "EXECUTION_ASYNC_LEVEL_FULL_ASYNC"
  }]),
  function(e) {
      e[e.UNSPECIFIED = 0] = "UNSPECIFIED",
      e[e.GENERATING = 8] = "GENERATING",
      e[e.PENDING = 1] = "PENDING",
      e[e.RUNNING = 2] = "RUNNING",
      e[e.WAITING = 9] = "WAITING",
      e[e.DONE = 3] = "DONE",
      e[e.INVALID = 4] = "INVALID",
      e[e.CLEARED = 5] = "CLEARED",
      e[e.CANCELED = 6] = "CANCELED",
      e[e.ERROR = 7] = "ERROR"
  }(wa || (wa = {})),
  Le.util.setEnumType(wa, "exa.cortex_pb.CortexStepStatus", [{
      no: 0,
      name: "CORTEX_STEP_STATUS_UNSPECIFIED"
  }, {
      no: 8,
      name: "CORTEX_STEP_STATUS_GENERATING"
  }, {
      no: 1,
      name: "CORTEX_STEP_STATUS_PENDING"
  }, {
      no: 2,
      name: "CORTEX_STEP_STATUS_RUNNING"
  }, {
      no: 9,
      name: "CORTEX_STEP_STATUS_WAITING"
  }, {
      no: 3,
      name: "CORTEX_STEP_STATUS_DONE"
  }, {
      no: 4,
      name: "CORTEX_STEP_STATUS_INVALID"
  }, {
      no: 5,
      name: "CORTEX_STEP_STATUS_CLEARED"
  }, {
      no: 6,
      name: "CORTEX_STEP_STATUS_CANCELED"
  }, {
      no: 7,
      name: "CORTEX_STEP_STATUS_ERROR"
  }]),
  function(e) {
      e[e.UNSPECIFIED = 0] = "UNSPECIFIED",
      e[e.IDLE = 1] = "IDLE",
      e[e.RUNNING = 2] = "RUNNING",
      e[e.CANCELING = 3] = "CANCELING",
      e[e.BUSY = 4] = "BUSY"
  }(Aa || (Aa = {})),
  Le.util.setEnumType(Aa, "exa.cortex_pb.CascadeRunStatus", [{
      no: 0,
      name: "CASCADE_RUN_STATUS_UNSPECIFIED"
  }, {
      no: 1,
      name: "CASCADE_RUN_STATUS_IDLE"
  }, {
      no: 2,
      name: "CASCADE_RUN_STATUS_RUNNING"
  }, {
      no: 3,
      name: "CASCADE_RUN_STATUS_CANCELING"
  }, {
      no: 4,
      name: "CASCADE_RUN_STATUS_BUSY"
  }]),
  function(e) {
      e[e.UNSPECIFIED = 0] = "UNSPECIFIED",
      e[e.DUMMY = 1] = "DUMMY",
      e[e.FINISH = 2] = "FINISH",
      e[e.PLAN_INPUT = 3] = "PLAN_INPUT",
      e[e.MQUERY = 4] = "MQUERY",
      e[e.CODE_ACTION = 5] = "CODE_ACTION",
      e[e.GIT_COMMIT = 6] = "GIT_COMMIT",
      e[e.GREP_SEARCH = 7] = "GREP_SEARCH",
      e[e.VIEW_FILE = 8] = "VIEW_FILE",
      e[e.LIST_DIRECTORY = 9] = "LIST_DIRECTORY",
      e[e.COMPILE = 10] = "COMPILE",
      e[e.INFORM = 11] = "INFORM",
      e[e.FILE_BREAKDOWN = 12] = "FILE_BREAKDOWN",
      e[e.VIEW_CODE_ITEM = 13] = "VIEW_CODE_ITEM",
      e[e.USER_INPUT = 14] = "USER_INPUT",
      e[e.PLANNER_RESPONSE = 15] = "PLANNER_RESPONSE",
      e[e.WRITE_TO_FILE = 16] = "WRITE_TO_FILE",
      e[e.ERROR_MESSAGE = 17] = "ERROR_MESSAGE",
      e[e.CLUSTER_QUERY = 18] = "CLUSTER_QUERY",
      e[e.LIST_CLUSTERS = 19] = "LIST_CLUSTERS",
      e[e.INSPECT_CLUSTER = 20] = "INSPECT_CLUSTER",
      e[e.RUN_COMMAND = 21] = "RUN_COMMAND",
      e[e.RELATED_FILES = 22] = "RELATED_FILES",
      e[e.CHECKPOINT = 23] = "CHECKPOINT",
      e[e.PROPOSE_CODE = 24] = "PROPOSE_CODE",
      e[e.FIND = 25] = "FIND",
      e[e.SEARCH_KNOWLEDGE_BASE = 26] = "SEARCH_KNOWLEDGE_BASE",
      e[e.SUGGESTED_RESPONSES = 27] = "SUGGESTED_RESPONSES"
  }(Pa || (Pa = {})),
  Le.util.setEnumType(Pa, "exa.cortex_pb.CortexStepType", [{
      no: 0,
      name: "CORTEX_STEP_TYPE_UNSPECIFIED"
  }, {
      no: 1,
      name: "CORTEX_STEP_TYPE_DUMMY"
  }, {
      no: 2,
      name: "CORTEX_STEP_TYPE_FINISH"
  }, {
      no: 3,
      name: "CORTEX_STEP_TYPE_PLAN_INPUT"
  }, {
      no: 4,
      name: "CORTEX_STEP_TYPE_MQUERY"
  }, {
      no: 5,
      name: "CORTEX_STEP_TYPE_CODE_ACTION"
  }, {
      no: 6,
      name: "CORTEX_STEP_TYPE_GIT_COMMIT"
  }, {
      no: 7,
      name: "CORTEX_STEP_TYPE_GREP_SEARCH"
  }, {
      no: 8,
      name: "CORTEX_STEP_TYPE_VIEW_FILE"
  }, {
      no: 9,
      name: "CORTEX_STEP_TYPE_LIST_DIRECTORY"
  }, {
      no: 10,
      name: "CORTEX_STEP_TYPE_COMPILE"
  }, {
      no: 11,
      name: "CORTEX_STEP_TYPE_INFORM"
  }, {
      no: 12,
      name: "CORTEX_STEP_TYPE_FILE_BREAKDOWN"
  }, {
      no: 13,
      name: "CORTEX_STEP_TYPE_VIEW_CODE_ITEM"
  }, {
      no: 14,
      name: "CORTEX_STEP_TYPE_USER_INPUT"
  }, {
      no: 15,
      name: "CORTEX_STEP_TYPE_PLANNER_RESPONSE"
  }, {
      no: 16,
      name: "CORTEX_STEP_TYPE_WRITE_TO_FILE"
  }, {
      no: 17,
      name: "CORTEX_STEP_TYPE_ERROR_MESSAGE"
  }, {
      no: 18,
      name: "CORTEX_STEP_TYPE_CLUSTER_QUERY"
  }, {
      no: 19,
      name: "CORTEX_STEP_TYPE_LIST_CLUSTERS"
  }, {
      no: 20,
      name: "CORTEX_STEP_TYPE_INSPECT_CLUSTER"
  }, {
      no: 21,
      name: "CORTEX_STEP_TYPE_RUN_COMMAND"
  }, {
      no: 22,
      name: "CORTEX_STEP_TYPE_RELATED_FILES"
  }, {
      no: 23,
      name: "CORTEX_STEP_TYPE_CHECKPOINT"
  }, {
      no: 24,
      name: "CORTEX_STEP_TYPE_PROPOSE_CODE"
  }, {
      no: 25,
      name: "CORTEX_STEP_TYPE_FIND"
  }, {
      no: 26,
      name: "CORTEX_STEP_TYPE_SEARCH_KNOWLEDGE_BASE"
  }, {
      no: 27,
      name: "CORTEX_STEP_TYPE_SUGGESTED_RESPONSES"
  }]),
  function(e) {
      e[e.UNSPECIFIED = 0] = "UNSPECIFIED",
      e[e.ACTIVE_NODE_CHANGE = 1] = "ACTIVE_NODE_CHANGE",
      e[e.COMMIT = 2] = "COMMIT",
      e[e.AUTOCOMPLETE = 3] = "AUTOCOMPLETE",
      e[e.COMMAND_REQUEST = 4] = "COMMAND_REQUEST",
      e[e.COMMAND_ACCEPT = 5] = "COMMAND_ACCEPT",
      e[e.COMMAND_REJECT = 6] = "COMMAND_REJECT",
      e[e.SUPERCOMPLETE = 7] = "SUPERCOMPLETE"
  }(La || (La = {})),
  Le.util.setEnumType(La, "exa.cortex_pb.CodeActionBoundaryType", [{
      no: 0,
      name: "CODE_ACTION_BOUNDARY_TYPE_UNSPECIFIED"
  }, {
      no: 1,
      name: "CODE_ACTION_BOUNDARY_TYPE_ACTIVE_NODE_CHANGE"
  }, {
      no: 2,
      name: "CODE_ACTION_BOUNDARY_TYPE_COMMIT"
  }, {
      no: 3,
      name: "CODE_ACTION_BOUNDARY_TYPE_AUTOCOMPLETE"
  }, {
      no: 4,
      name: "CODE_ACTION_BOUNDARY_TYPE_COMMAND_REQUEST"
  }, {
      no: 5,
      name: "CODE_ACTION_BOUNDARY_TYPE_COMMAND_ACCEPT"
  }, {
      no: 6,
      name: "CODE_ACTION_BOUNDARY_TYPE_COMMAND_REJECT"
  }, {
      no: 7,
      name: "CODE_ACTION_BOUNDARY_TYPE_SUPERCOMPLETE"
  }]),
  function(e) {
      e[e.UNSPECIFIED = 0] = "UNSPECIFIED",
      e[e.ACCEPT = 1] = "ACCEPT",
      e[e.REJECT = 2] = "REJECT"
  }(Ra || (Ra = {})),
  Le.util.setEnumType(Ra, "exa.cortex_pb.AcknowledgementType", [{
      no: 0,
      name: "ACKNOWLEDGEMENT_TYPE_UNSPECIFIED"
  }, {
      no: 1,
      name: "ACKNOWLEDGEMENT_TYPE_ACCEPT"
  }, {
      no: 2,
      name: "ACKNOWLEDGEMENT_TYPE_REJECT"
  }]),
  function(e) {
      e[e.UNSPECIFIED = 0] = "UNSPECIFIED",
      e[e.CCIS = 1] = "CCIS",
      e[e.DIRECTORY_TREE = 2] = "DIRECTORY_TREE",
      e[e.CLUSTERS = 3] = "CLUSTERS"
  }(ka || (ka = {})),
  Le.util.setEnumType(ka, "exa.cortex_pb.InformPlannerMode", [{
      no: 0,
      name: "INFORM_PLANNER_MODE_UNSPECIFIED"
  }, {
      no: 1,
      name: "INFORM_PLANNER_MODE_CCIS"
  }, {
      no: 2,
      name: "INFORM_PLANNER_MODE_DIRECTORY_TREE"
  }, {
      no: 3,
      name: "INFORM_PLANNER_MODE_CLUSTERS"
  }]),
  function(e) {
      e[e.UNSPECIFIED = 0] = "UNSPECIFIED",
      e[e.FILE = 1] = "FILE",
      e[e.DIRECTORY = 2] = "DIRECTORY",
      e[e.ANY = 3] = "ANY"
  }(Ja || (Ja = {})),
  Le.util.setEnumType(Ja, "exa.cortex_pb.FindResultType", [{
      no: 0,
      name: "FIND_RESULT_TYPE_UNSPECIFIED"
  }, {
      no: 1,
      name: "FIND_RESULT_TYPE_FILE"
  }, {
      no: 2,
      name: "FIND_RESULT_TYPE_DIRECTORY"
  }, {
      no: 3,
      name: "FIND_RESULT_TYPE_ANY"
  }]),
  function(e) {
      e[e.UNSPECIFIED = 0] = "UNSPECIFIED",
      e[e.PYLINT = 1] = "PYLINT"
  }(Da || (Da = {})),
  Le.util.setEnumType(Da, "exa.cortex_pb.CortexStepCompileTool", [{
      no: 0,
      name: "CORTEX_STEP_COMPILE_TOOL_UNSPECIFIED"
  }, {
      no: 1,
      name: "CORTEX_STEP_COMPILE_TOOL_PYLINT"
  }]);
  class Im extends d {
      component = {
          case: void 0
      };
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.cortex_pb.CortexPlanSummaryComponent";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "text",
          kind: "scalar",
          T: 9,
          oneof: "component"
      }, {
          no: 2,
          name: "citation",
          kind: "message",
          T: Zn,
          oneof: "component"
      }]));
      static fromBinary(e, t) {
          return (new Im).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new Im).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new Im).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(Im, e, t)
      }
  }
  class Cm extends d {
      planId = "";
      goal = "";
      actionStates = [];
      outlines = [];
      summaryComponents = [];
      postSummaryText = "";
      planFullyGenerated = !1;
      planFinished = !1;
      planSummaryConfirmed = !1;
      planSummaryFullyGenerated = !1;
      cciList = [];
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.cortex_pb.CodingStepState";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "plan_id",
          kind: "scalar",
          T: 9
      }, {
          no: 2,
          name: "goal",
          kind: "scalar",
          T: 9
      }, {
          no: 3,
          name: "action_states",
          kind: "message",
          T: Mm,
          repeated: !0
      }, {
          no: 7,
          name: "outlines",
          kind: "message",
          T: ym,
          repeated: !0
      }, {
          no: 8,
          name: "summary_components",
          kind: "message",
          T: Im,
          repeated: !0
      }, {
          no: 9,
          name: "post_summary_text",
          kind: "scalar",
          T: 9
      }, {
          no: 4,
          name: "plan_fully_generated",
          kind: "scalar",
          T: 8
      }, {
          no: 5,
          name: "plan_finished",
          kind: "scalar",
          T: 8
      }, {
          no: 6,
          name: "debug_info",
          kind: "message",
          T: Hm
      }, {
          no: 10,
          name: "plan_summary_confirmed",
          kind: "scalar",
          T: 8
      }, {
          no: 11,
          name: "plan_summary_fully_generated",
          kind: "scalar",
          T: 8
      }, {
          no: 12,
          name: "cci_list",
          kind: "message",
          T: Mi,
          repeated: !0
      }]));
      static fromBinary(e, t) {
          return (new Cm).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new Cm).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new Cm).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(Cm, e, t)
      }
  }
  class Om extends d {
      steps = [];
      outlines = [];
      currentStepIndex = 0;
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.cortex_pb.CortexPlanState";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "steps",
          kind: "message",
          T: wm,
          repeated: !0
      }, {
          no: 2,
          name: "outlines",
          kind: "message",
          T: ym,
          repeated: !0
      }, {
          no: 3,
          name: "current_step_index",
          kind: "scalar",
          T: 13
      }, {
          no: 4,
          name: "debug_info",
          kind: "message",
          T: Hm
      }]));
      static fromBinary(e, t) {
          return (new Om).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new Om).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new Om).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(Om, e, t)
      }
  }
  class ym extends d {
      stepNumber = 0;
      actionName = "";
      jsonArgs = "";
      parentStepNumbers = [];
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.cortex_pb.CortexStepOutline";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "step_number",
          kind: "scalar",
          T: 13
      }, {
          no: 2,
          name: "action_name",
          kind: "scalar",
          T: 9
      }, {
          no: 3,
          name: "json_args",
          kind: "scalar",
          T: 9
      }, {
          no: 4,
          name: "parent_step_numbers",
          kind: "scalar",
          T: 13,
          repeated: !0
      }]));
      static fromBinary(e, t) {
          return (new ym).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new ym).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new ym).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(ym, e, t)
      }
  }
  class wm extends d {
      step = {
          case: void 0
      };
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.cortex_pb.CortexStepState";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "coding",
          kind: "message",
          T: Cm,
          oneof: "step"
      }]));
      static fromBinary(e, t) {
          return (new wm).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new wm).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new wm).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(wm, e, t)
      }
  }
  class Am extends d {
      totalRetrievedCount = 0;
      topRetrievedItems = [];
      fullCciList = [];
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.cortex_pb.CortexResearchState";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "total_retrieved_count",
          kind: "scalar",
          T: 13
      }, {
          no: 2,
          name: "top_retrieved_items",
          kind: "message",
          T: Xn,
          repeated: !0
      }, {
          no: 3,
          name: "debug_info",
          kind: "message",
          T: Pm
      }, {
          no: 4,
          name: "full_cci_list",
          kind: "message",
          T: Xn,
          repeated: !0
      }]));
      static fromBinary(e, t) {
          return (new Am).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new Am).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new Am).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(Am, e, t)
      }
  }
  class Pm extends d {
      query = "";
      filesScanned = [];
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.cortex_pb.ResearchDebugInfo";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "query",
          kind: "scalar",
          T: 9
      }, {
          no: 2,
          name: "files_scanned",
          kind: "scalar",
          T: 9,
          repeated: !0
      }]));
      static fromBinary(e, t) {
          return (new Pm).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new Pm).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new Pm).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(Pm, e, t)
      }
  }
  class Lm extends d {
      requestSource = Ia.UNSPECIFIED;
      goal = "";
      error = "";
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.cortex_pb.CortexWorkflowState";
      static fields = Le.util.newFieldList(( () => [{
          no: 6,
          name: "request_source",
          kind: "enum",
          T: Le.getEnumType(Ia)
      }, {
          no: 1,
          name: "goal",
          kind: "scalar",
          T: 9
      }, {
          no: 2,
          name: "plan_input",
          kind: "message",
          T: km
      }, {
          no: 3,
          name: "research_state",
          kind: "message",
          T: Am
      }, {
          no: 4,
          name: "plan_state",
          kind: "message",
          T: Om
      }, {
          no: 5,
          name: "error",
          kind: "scalar",
          T: 9
      }]));
      static fromBinary(e, t) {
          return (new Lm).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new Lm).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new Lm).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(Lm, e, t)
      }
  }
  class Rm extends d {
      done = !1;
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.cortex_pb.CortexRunState";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "workflow_state",
          kind: "message",
          T: Lm
      }, {
          no: 2,
          name: "execution_state",
          kind: "message",
          T: nr
      }, {
          no: 3,
          name: "done",
          kind: "scalar",
          T: 8
      }]));
      static fromBinary(e, t) {
          return (new Rm).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new Rm).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new Rm).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(Rm, e, t)
      }
  }
  class km extends d {
      goal = "";
      nextSteps = [];
      targetDirectories = [];
      targetFiles = [];
      scopeItems = [];
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.cortex_pb.PlanInput";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "goal",
          kind: "scalar",
          T: 9
      }, {
          no: 5,
          name: "next_steps",
          kind: "scalar",
          T: 9,
          repeated: !0
      }, {
          no: 2,
          name: "target_directories",
          kind: "scalar",
          T: 9,
          repeated: !0
      }, {
          no: 3,
          name: "target_files",
          kind: "scalar",
          T: 9,
          repeated: !0
      }, {
          no: 4,
          name: "scope_items",
          kind: "message",
          T: Zn,
          repeated: !0
      }]));
      static fromBinary(e, t) {
          return (new km).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new km).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new km).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(km, e, t)
      }
  }
  class Jm extends d {
      spec = {
          case: void 0
      };
      parentStepIndices = [];
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.cortex_pb.ActionSpec";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "command",
          kind: "message",
          T: Um,
          oneof: "spec"
      }, {
          no: 2,
          name: "create_file",
          kind: "message",
          T: Dm,
          oneof: "spec"
      }, {
          no: 4,
          name: "delete_file",
          kind: "message",
          T: hm,
          oneof: "spec"
      }, {
          no: 3,
          name: "parent_step_indices",
          kind: "scalar",
          T: 13,
          repeated: !0
      }]));
      static fromBinary(e, t) {
          return (new Jm).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new Jm).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new Jm).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(Jm, e, t)
      }
  }
  class Dm extends d {
      instruction = "";
      referenceCcis = [];
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.cortex_pb.ActionSpecCreateFile";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "instruction",
          kind: "scalar",
          T: 9
      }, {
          no: 2,
          name: "path",
          kind: "message",
          T: Kn
      }, {
          no: 3,
          name: "reference_ccis",
          kind: "message",
          T: On,
          repeated: !0
      }]));
      static fromBinary(e, t) {
          return (new Dm).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new Dm).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new Dm).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(Dm, e, t)
      }
  }
  class hm extends d {
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.cortex_pb.ActionSpecDeleteFile";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "path",
          kind: "message",
          T: Kn
      }]));
      static fromBinary(e, t) {
          return (new hm).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new hm).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new hm).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(hm, e, t)
      }
  }
  class xm extends d {
      absoluteUri = "";
      startLine = 0;
      endLine = 0;
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.cortex_pb.LineRangeTarget";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "absolute_uri",
          kind: "scalar",
          T: 9
      }, {
          no: 2,
          name: "start_line",
          kind: "scalar",
          T: 13
      }, {
          no: 3,
          name: "end_line",
          kind: "scalar",
          T: 13
      }]));
      static fromBinary(e, t) {
          return (new xm).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new xm).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new xm).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(xm, e, t)
      }
  }
  class Um extends d {
      instruction = "";
      isEdit = !1;
      useFastApply = !1;
      target = {
          case: void 0
      };
      referenceCcis = [];
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.cortex_pb.ActionSpecCommand";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "instruction",
          kind: "scalar",
          T: 9
      }, {
          no: 2,
          name: "is_edit",
          kind: "scalar",
          T: 8
      }, {
          no: 8,
          name: "use_fast_apply",
          kind: "scalar",
          T: 8
      }, {
          no: 3,
          name: "code_context",
          kind: "message",
          T: On,
          oneof: "target"
      }, {
          no: 4,
          name: "file",
          kind: "message",
          T: Kn,
          oneof: "target"
      }, {
          no: 6,
          name: "cci_with_subrange",
          kind: "message",
          T: Xn,
          oneof: "target"
      }, {
          no: 7,
          name: "line_range",
          kind: "message",
          T: xm,
          oneof: "target"
      }, {
          no: 5,
          name: "reference_ccis",
          kind: "message",
          T: On,
          repeated: !0
      }]));
      static fromBinary(e, t) {
          return (new Um).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new Um).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new Um).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(Um, e, t)
      }
  }
  class Mm extends d {
      stepId = "";
      status = Na.UNSPECIFIED;
      error = "";
      stepVersion = 0;
      planVersion = 0;
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.cortex_pb.ActionState";
      static fields = Le.util.newFieldList(( () => [{
          no: 5,
          name: "step_id",
          kind: "scalar",
          T: 9
      }, {
          no: 1,
          name: "status",
          kind: "enum",
          T: Le.getEnumType(Na)
      }, {
          no: 2,
          name: "spec",
          kind: "message",
          T: Jm
      }, {
          no: 3,
          name: "result",
          kind: "message",
          T: Bm
      }, {
          no: 4,
          name: "error",
          kind: "scalar",
          T: 9
      }, {
          no: 6,
          name: "step_version",
          kind: "scalar",
          T: 13
      }, {
          no: 7,
          name: "plan_version",
          kind: "scalar",
          T: 13
      }]));
      static fromBinary(e, t) {
          return (new Mm).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new Mm).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new Mm).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(Mm, e, t)
      }
  }
  class Bm extends d {
      result = {
          case: void 0
      };
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.cortex_pb.ActionResult";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "edit",
          kind: "message",
          T: qm,
          oneof: "result"
      }]));
      static fromBinary(e, t) {
          return (new Bm).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new Bm).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new Bm).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(Bm, e, t)
      }
  }
  class Fm extends d {
      entries = [];
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.cortex_pb.ActionDebugInfo";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "entries",
          kind: "message",
          T: bm,
          repeated: !0
      }]));
      static fromBinary(e, t) {
          return (new Fm).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new Fm).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new Fm).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(Fm, e, t)
      }
  }
  class bm extends d {
      key = "";
      value = "";
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.cortex_pb.ActionDebugInfo.DebugInfoEntry";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "key",
          kind: "scalar",
          T: 9
      }, {
          no: 2,
          name: "value",
          kind: "scalar",
          T: 9
      }]));
      static fromBinary(e, t) {
          return (new bm).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new bm).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new bm).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(bm, e, t)
      }
  }
  class qm extends d {
      absolutePathMigrateMeToUri = "";
      contextPrefix = "";
      contextSuffix = "";
      completionId = "";
      fileContentHash = "";
      absoluteUri = "";
      resultCcis = [];
      originalContent = "";
      createFile = !1;
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.cortex_pb.ActionResultEdit";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "absolute_path_migrate_me_to_uri",
          kind: "scalar",
          T: 9
      }, {
          no: 2,
          name: "diff",
          kind: "message",
          T: Ga
      }, {
          no: 3,
          name: "context_prefix",
          kind: "scalar",
          T: 9
      }, {
          no: 4,
          name: "context_suffix",
          kind: "scalar",
          T: 9
      }, {
          no: 5,
          name: "debug_info",
          kind: "message",
          T: Fm
      }, {
          no: 6,
          name: "completion_id",
          kind: "scalar",
          T: 9
      }, {
          no: 7,
          name: "file_content_hash",
          kind: "scalar",
          T: 9
      }, {
          no: 8,
          name: "absolute_uri",
          kind: "scalar",
          T: 9
      }, {
          no: 9,
          name: "result_ccis",
          kind: "message",
          T: On,
          repeated: !0
      }, {
          no: 10,
          name: "original_content",
          kind: "scalar",
          T: 9
      }, {
          no: 11,
          name: "create_file",
          kind: "scalar",
          T: 8
      }]));
      static fromBinary(e, t) {
          return (new qm).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new qm).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new qm).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(qm, e, t)
      }
  }
  class Gm extends d {
      totalRetrievedCount = 0;
      topRetrievedItems = [];
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.cortex_pb.RetrievalStatus";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "total_retrieved_count",
          kind: "scalar",
          T: 13
      }, {
          no: 2,
          name: "top_retrieved_items",
          kind: "message",
          T: Xn,
          repeated: !0
      }]));
      static fromBinary(e, t) {
          return (new Gm).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new Gm).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new Gm).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(Gm, e, t)
      }
  }
  class vm extends (null) {
      status = ga.UNSPECIFIED;
      planId = "";
      actions = [];
      error = "";
      constructor(e) {
          super(),
          proto3.util.initPartial(e, this)
      }
      static runtime = null;
      static typeName = null;
      static fields = Le.util.newFieldList(( () => [{
          no: 4,
          name: "status",
          kind: "enum",
          T: Le.getEnumType(ga)
      }, {
          no: 1,
          name: "plan_id",
          kind: "scalar",
          T: 9
      }, {
          no: 2,
          name: "plan_input",
          kind: "message",
          T: km
      }, {
          no: 3,
          name: "actions",
          kind: "message",
          T: Mm,
          repeated: !0
      }, {
          no: 6,
          name: "retrieval_status",
          kind: "message",
          T: Gm
      }, {
          no: 5,
          name: "error",
          kind: "scalar",
          T: 9
      }, {
          no: 7,
          name: "debug_info",
          kind: "message",
          T: Hm
      }]));
      static fromBinary(e, t) {
          return (new vm).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new vm).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new vm).fromJsonString(e, t)
      }
      static equals(e, t) {
          return proto3.util.equals(vm, e, t)
      }
  }
  class Hm extends d {
      rawResponse = "";
      planTokens = 0;
      planCost = 0;
      systemPrompt = "";
      messagePrompts = [];
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.cortex_pb.PlanDebugInfo";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "raw_response",
          kind: "scalar",
          T: 9
      }, {
          no: 2,
          name: "plan_tokens",
          kind: "scalar",
          T: 13
      }, {
          no: 3,
          name: "plan_cost",
          kind: "scalar",
          T: 2
      }, {
          no: 4,
          name: "system_prompt",
          kind: "scalar",
          T: 9
      }, {
          no: 5,
          name: "message_prompts",
          kind: "message",
          T: Si,
          repeated: !0
      }]));
      static fromBinary(e, t) {
          return (new Hm).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new Hm).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new Hm).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(Hm, e, t)
      }
  }
  class Vm extends d {
      maxNominalContinuations = 0;
      maxErrorContinuations = 0;
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.cortex_pb.CortexPlanConfig";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "model_config",
          kind: "message",
          T: ir
      }, {
          no: 2,
          name: "max_nominal_continuations",
          kind: "scalar",
          T: 13
      }, {
          no: 3,
          name: "max_error_continuations",
          kind: "scalar",
          T: 13
      }]));
      static fromBinary(e, t) {
          return (new Vm).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new Vm).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new Vm).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(Vm, e, t)
      }
  }
  class Xm extends d {
      recordTelemetry = !1;
      addDistillNode = !1;
      mQueryModelName = "";
      useMacroPlanner = !1;
      autoPrepareApply = !1;
      numPrepareRetries = 0;
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.cortex_pb.CortexConfig";
      static fields = Le.util.newFieldList(( () => [{
          no: 11,
          name: "record_telemetry",
          kind: "scalar",
          T: 8
      }, {
          no: 6,
          name: "add_distill_node",
          kind: "scalar",
          T: 8
      }, {
          no: 10,
          name: "distill_config",
          kind: "message",
          T: ir
      }, {
          no: 8,
          name: "m_query_config",
          kind: "message",
          T: sr
      }, {
          no: 12,
          name: "m_query_model_name",
          kind: "scalar",
          T: 9
      }, {
          no: 1,
          name: "use_macro_planner",
          kind: "scalar",
          T: 8
      }, {
          no: 4,
          name: "macro_plan_config",
          kind: "message",
          T: Vm
      }, {
          no: 9,
          name: "plan_config",
          kind: "message",
          T: Ym
      }, {
          no: 5,
          name: "code_plan_config",
          kind: "message",
          T: Vm
      }, {
          no: 2,
          name: "auto_prepare_apply",
          kind: "scalar",
          T: 8
      }, {
          no: 3,
          name: "num_prepare_retries",
          kind: "scalar",
          T: 13
      }]));
      static fromBinary(e, t) {
          return (new Xm).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new Xm).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new Xm).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(Xm, e, t)
      }
  }
  class Ym extends d {
      planModelName = "";
      maxTokensPerPlan = 0;
      maxTokenFraction = 0;
      chatTemperature = 0;
      chatCompletionMaxTokens = y.zero;
      augmentCommand = !1;
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.cortex_pb.PlanConfig";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "plan_model_name",
          kind: "scalar",
          T: 9
      }, {
          no: 2,
          name: "max_tokens_per_plan",
          kind: "scalar",
          T: 13
      }, {
          no: 3,
          name: "max_token_fraction",
          kind: "scalar",
          T: 2
      }, {
          no: 4,
          name: "chat_temperature",
          kind: "scalar",
          T: 2
      }, {
          no: 5,
          name: "chat_completion_max_tokens",
          kind: "scalar",
          T: 4
      }, {
          no: 9,
          name: "augment_command",
          kind: "scalar",
          T: 8
      }, {
          no: 7,
          name: "experiment_config",
          kind: "message",
          T: Mt
      }, {
          no: 8,
          name: "m_query_config",
          kind: "message",
          T: sr
      }]));
      static fromBinary(e, t) {
          return (new Ym).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new Ym).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new Ym).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(Ym, e, t)
      }
  }
  class Km extends d {
      cortexId = "";
      done = !1;
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.cortex_pb.CortexPlanSummary";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "cortex_id",
          kind: "scalar",
          T: 9
      }, {
          no: 2,
          name: "plan_input",
          kind: "message",
          T: km
      }, {
          no: 3,
          name: "created_at",
          kind: "message",
          T: Je
      }, {
          no: 4,
          name: "done",
          kind: "scalar",
          T: 8
      }]));
      static fromBinary(e, t) {
          return (new Km).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new Km).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new Km).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(Km, e, t)
      }
  }
  class Wm extends (null) {
      maxWaitForPlanInitMs = protoInt64.zero;
      blocking = !1;
      skipHead = !1;
      skipDebounce = !1;
      skipIntentUpdate = !1;
      allowEmptyUpdate = !1;
      parsePendingCommands = !1;
      absolutePathUrisToUpdate = [];
      constructor(e) {
          super(),
          proto3.util.initPartial(e, this)
      }
      static runtime = null;
      static typeName = null;
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "max_wait_for_plan_init_ms",
          kind: "scalar",
          T: 3
      }, {
          no: 2,
          name: "blocking",
          kind: "scalar",
          T: 8
      }, {
          no: 3,
          name: "skip_head",
          kind: "scalar",
          T: 8
      }, {
          no: 4,
          name: "skip_debounce",
          kind: "scalar",
          T: 8
      }, {
          no: 5,
          name: "skip_intent_update",
          kind: "scalar",
          T: 8
      }, {
          no: 6,
          name: "allow_empty_update",
          kind: "scalar",
          T: 8
      }, {
          no: 7,
          name: "parse_pending_commands",
          kind: "scalar",
          T: 8
      }, {
          no: 10,
          name: "absolute_path_uris_to_update",
          kind: "scalar",
          T: 9,
          repeated: !0
      }]));
      static fromBinary(e, t) {
          return (new Wm).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new Wm).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new Wm).fromJsonString(e, t)
      }
      static equals(e, t) {
          return proto3.util.equals(Wm, e, t)
      }
  }
  class zm extends d {
      trajectoryId = "";
      cascadeId = "";
      trajectoryType = Ca.UNSPECIFIED;
      steps = [];
      generatorMetadata = [];
      parentReferences = [];
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.cortex_pb.CortexTrajectory";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "trajectory_id",
          kind: "scalar",
          T: 9
      }, {
          no: 6,
          name: "cascade_id",
          kind: "scalar",
          T: 9
      }, {
          no: 4,
          name: "trajectory_type",
          kind: "enum",
          T: Le.getEnumType(Ca)
      }, {
          no: 2,
          name: "steps",
          kind: "message",
          T: ic,
          repeated: !0
      }, {
          no: 3,
          name: "generator_metadata",
          kind: "message",
          T: Zm,
          repeated: !0
      }, {
          no: 5,
          name: "parent_references",
          kind: "message",
          T: $m,
          repeated: !0
      }]));
      static fromBinary(e, t) {
          return (new zm).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new zm).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new zm).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(zm, e, t)
      }
  }
  class jm extends d {
      summary = "";
      stepCount = 0;
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.cortex_pb.CascadeTrajectorySummary";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "summary",
          kind: "scalar",
          T: 9
      }, {
          no: 2,
          name: "step_count",
          kind: "scalar",
          T: 13
      }, {
          no: 3,
          name: "last_modified_time",
          kind: "message",
          T: Je
      }]));
      static fromBinary(e, t) {
          return (new jm).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new jm).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new jm).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(jm, e, t)
      }
  }
  class $m extends d {
      trajectoryId = "";
      stepIndex = 0;
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.cortex_pb.CortexTrajectoryReference";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "trajectory_id",
          kind: "scalar",
          T: 9
      }, {
          no: 2,
          name: "step_index",
          kind: "scalar",
          T: 5
      }]));
      static fromBinary(e, t) {
          return (new $m).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new $m).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new $m).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals($m, e, t)
      }
  }
  class Qm extends d {
      workspaceUri = "";
      gitRootUri = "";
      branchName = "";
      mainlineStepCountAtLastResearch = 0;
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.cortex_pb.ImplicitTrajectory";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "trajectory",
          kind: "message",
          T: zm
      }, {
          no: 5,
          name: "trajectory_scope",
          kind: "message",
          T: sc
      }, {
          no: 2,
          name: "workspace_uri",
          kind: "scalar",
          T: 9
      }, {
          no: 3,
          name: "git_root_uri",
          kind: "scalar",
          T: 9
      }, {
          no: 4,
          name: "branch_name",
          kind: "scalar",
          T: 9
      }, {
          no: 6,
          name: "background_research",
          kind: "message",
          T: zm
      }, {
          no: 7,
          name: "mainline_step_count_at_last_research",
          kind: "scalar",
          T: 5
      }]));
      static fromBinary(e, t) {
          return (new Qm).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new Qm).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new Qm).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(Qm, e, t)
      }
  }
  class Zm extends d {
      stepIndices = [];
      metadata = {
          case: void 0
      };
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.cortex_pb.CortexStepGeneratorMetadata";
      static fields = Le.util.newFieldList(( () => [{
          no: 2,
          name: "step_indices",
          kind: "scalar",
          T: 13,
          repeated: !0
      }, {
          no: 1,
          name: "chat_model",
          kind: "message",
          T: ec,
          oneof: "metadata"
      }, {
          no: 3,
          name: "planner_config",
          kind: "message",
          T: fc
      }]));
      static fromBinary(e, t) {
          return (new Zm).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new Zm).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new Zm).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(Zm, e, t)
      }
  }
  class ec extends d {
      systemPrompt = "";
      messagePrompts = [];
      model = Fe.MODEL_UNSPECIFIED;
      modelCost = 0;
      lastCacheIndex = 0;
      tools = [];
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.cortex_pb.ChatModelMetadata";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "system_prompt",
          kind: "scalar",
          T: 9
      }, {
          no: 2,
          name: "message_prompts",
          kind: "message",
          T: Si,
          repeated: !0
      }, {
          no: 3,
          name: "model",
          kind: "enum",
          T: Le.getEnumType(Fe)
      }, {
          no: 4,
          name: "usage",
          kind: "message",
          T: Rr
      }, {
          no: 5,
          name: "model_cost",
          kind: "scalar",
          T: 2
      }, {
          no: 6,
          name: "last_cache_index",
          kind: "scalar",
          T: 13
      }, {
          no: 7,
          name: "tool_choice",
          kind: "message",
          T: Ii
      }, {
          no: 8,
          name: "tools",
          kind: "message",
          T: gi,
          repeated: !0
      }, {
          no: 9,
          name: "chat_start_metadata",
          kind: "message",
          T: tc
      }]));
      static fromBinary(e, t) {
          return (new ec).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new ec).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new ec).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(ec, e, t)
      }
  }
  class tc extends d {
      startStepIndex = 0;
      checkpointIndex = 0;
      stepsCoveredByCheckpoint = [];
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.cortex_pb.ChatStartMetadata";
      static fields = Le.util.newFieldList(( () => [{
          no: 4,
          name: "created_at",
          kind: "message",
          T: Je
      }, {
          no: 1,
          name: "start_step_index",
          kind: "scalar",
          T: 13
      }, {
          no: 2,
          name: "checkpoint_index",
          kind: "scalar",
          T: 5
      }, {
          no: 3,
          name: "steps_covered_by_checkpoint",
          kind: "scalar",
          T: 13,
          repeated: !0
      }]));
      static fromBinary(e, t) {
          return (new tc).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new tc).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new tc).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(tc, e, t)
      }
  }
  class nc extends d {
      source = Oa.UNSPECIFIED;
      argumentsOrder = [];
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.cortex_pb.CortexStepMetadata";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "created_at",
          kind: "message",
          T: Je
      }, {
          no: 6,
          name: "viewable_at",
          kind: "message",
          T: Je
      }, {
          no: 7,
          name: "finished_generating_at",
          kind: "message",
          T: Je
      }, {
          no: 8,
          name: "completed_at",
          kind: "message",
          T: Je
      }, {
          no: 3,
          name: "source",
          kind: "enum",
          T: Le.getEnumType(Oa)
      }, {
          no: 4,
          name: "tool_call",
          kind: "message",
          T: cr
      }, {
          no: 5,
          name: "arguments_order",
          kind: "scalar",
          T: 9,
          repeated: !0
      }, {
          no: 9,
          name: "model_usage",
          kind: "message",
          T: Rr
      }]));
      static fromBinary(e, t) {
          return (new nc).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new nc).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new nc).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(nc, e, t)
      }
  }
  class rc extends (null) {
      stepIndex = 0;
      status = wa.UNSPECIFIED;
      constructor(e) {
          super(),
          proto3.util.initPartial(e, this)
      }
      static runtime = null;
      static typeName = null;
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "step_index",
          kind: "scalar",
          T: 13
      }, {
          no: 2,
          name: "step",
          kind: "message",
          T: ic
      }, {
          no: 3,
          name: "status",
          kind: "enum",
          T: Le.getEnumType(wa)
      }]));
      static fromBinary(e, t) {
          return (new rc).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new rc).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new rc).fromJsonString(e, t)
      }
      static equals(e, t) {
          return proto3.util.equals(rc, e, t)
      }
  }
  class ac extends d {
      userErrorMessage = "";
      shortError = "";
      fullError = "";
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.cortex_pb.CortexErrorDetails";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "user_error_message",
          kind: "scalar",
          T: 9
      }, {
          no: 2,
          name: "short_error",
          kind: "scalar",
          T: 9
      }, {
          no: 3,
          name: "full_error",
          kind: "scalar",
          T: 9
      }]));
      static fromBinary(e, t) {
          return (new ac).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new ac).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new ac).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(ac, e, t)
      }
  }
  class ic extends d {
      type = Pa.UNSPECIFIED;
      status = wa.UNSPECIFIED;
      asyncLevelOverride = ya.UNSPECIFIED;
      step = {
          case: void 0
      };
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.cortex_pb.CortexTrajectoryStep";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "type",
          kind: "enum",
          T: Le.getEnumType(Pa)
      }, {
          no: 4,
          name: "status",
          kind: "enum",
          T: Le.getEnumType(wa)
      }, {
          no: 5,
          name: "metadata",
          kind: "message",
          T: nc
      }, {
          no: 31,
          name: "error",
          kind: "message",
          T: ac
      }, {
          no: 33,
          name: "async_level_override",
          kind: "enum",
          T: Le.getEnumType(ya)
      }, {
          no: 7,
          name: "dummy",
          kind: "message",
          T: gc,
          oneof: "step"
      }, {
          no: 12,
          name: "finish",
          kind: "message",
          T: Ic,
          oneof: "step"
      }, {
          no: 8,
          name: "plan_input",
          kind: "message",
          T: Cc,
          oneof: "step"
      }, {
          no: 9,
          name: "mquery",
          kind: "message",
          T: wc,
          oneof: "step"
      }, {
          no: 10,
          name: "code_action",
          kind: "message",
          T: Pc,
          oneof: "step"
      }, {
          no: 11,
          name: "git_commit",
          kind: "message",
          T: Rc,
          oneof: "step"
      }, {
          no: 13,
          name: "grep_search",
          kind: "message",
          T: xc,
          oneof: "step"
      }, {
          no: 14,
          name: "view_file",
          kind: "message",
          T: Bc,
          oneof: "step"
      }, {
          no: 15,
          name: "list_directory",
          kind: "message",
          T: bc,
          oneof: "step"
      }, {
          no: 16,
          name: "compile",
          kind: "message",
          T: Hc,
          oneof: "step"
      }, {
          no: 17,
          name: "inform_planner",
          kind: "message",
          T: Jc,
          oneof: "step"
      }, {
          no: 19,
          name: "user_input",
          kind: "message",
          T: Xc,
          oneof: "step"
      }, {
          no: 20,
          name: "planner_response",
          kind: "message",
          T: Kc,
          oneof: "step"
      }, {
          no: 21,
          name: "file_breakdown",
          kind: "message",
          T: Wc,
          oneof: "step"
      }, {
          no: 22,
          name: "view_code_item",
          kind: "message",
          T: zc,
          oneof: "step"
      }, {
          no: 23,
          name: "write_to_file",
          kind: "message",
          T: jc,
          oneof: "step"
      }, {
          no: 24,
          name: "error_message",
          kind: "message",
          T: Zc,
          oneof: "step"
      }, {
          no: 25,
          name: "cluster_query",
          kind: "message",
          T: Gc,
          oneof: "step"
      }, {
          no: 26,
          name: "list_clusters",
          kind: "message",
          T: vc,
          oneof: "step"
      }, {
          no: 27,
          name: "inspect_cluster",
          kind: "message",
          T: eu,
          oneof: "step"
      }, {
          no: 28,
          name: "run_command",
          kind: "message",
          T: tu,
          oneof: "step"
      }, {
          no: 29,
          name: "related_files",
          kind: "message",
          T: nu,
          oneof: "step"
      }, {
          no: 30,
          name: "checkpoint",
          kind: "message",
          T: Oc,
          oneof: "step"
      }, {
          no: 32,
          name: "propose_code",
          kind: "message",
          T: Lc,
          oneof: "step"
      }, {
          no: 34,
          name: "find",
          kind: "message",
          T: Mc,
          oneof: "step"
      }, {
          no: 35,
          name: "search_knowledge_base",
          kind: "message",
          T: $c,
          oneof: "step"
      }, {
          no: 36,
          name: "suggested_responses",
          kind: "message",
          T: Qc,
          oneof: "step"
      }, {
          no: 6,
          name: "subtrajectory",
          kind: "message",
          T: zm
      }]));
      static fromBinary(e, t) {
          return (new ic).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new ic).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new ic).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(ic, e, t)
      }
  }
  class sc extends d {
      workspaceUri = "";
      gitRootUri = "";
      branchName = "";
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.cortex_pb.TrajectoryScope";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "workspace_uri",
          kind: "scalar",
          T: 9
      }, {
          no: 2,
          name: "git_root_uri",
          kind: "scalar",
          T: 9
      }, {
          no: 3,
          name: "branch_name",
          kind: "scalar",
          T: 9
      }]));
      static fromBinary(e, t) {
          return (new sc).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new sc).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new sc).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(sc, e, t)
      }
  }
  class oc extends d {
      maxGeneratorInvocations = 0;
      terminalStepTypes = [];
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.cortex_pb.CascadeExecutorConfig";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "disable_async",
          kind: "scalar",
          T: 8,
          opt: !0
      }, {
          no: 2,
          name: "max_generator_invocations",
          kind: "scalar",
          T: 5
      }, {
          no: 3,
          name: "terminal_step_types",
          kind: "enum",
          T: Le.getEnumType(Pa),
          repeated: !0
      }, {
          no: 4,
          name: "disable_user_interaction",
          kind: "scalar",
          T: 8,
          opt: !0
      }]));
      static fromBinary(e, t) {
          return (new oc).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new oc).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new oc).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(oc, e, t)
      }
  }
  class mc extends d {
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.cortex_pb.CascadeConfig";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "planner_config",
          kind: "message",
          T: fc
      }, {
          no: 2,
          name: "checkpoint_config",
          kind: "message",
          T: yc
      }, {
          no: 3,
          name: "executor_config",
          kind: "message",
          T: oc
      }]));
      static fromBinary(e, t) {
          return (new mc).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new mc).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new mc).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(mc, e, t)
      }
  }
  class cc extends d {
      clusterPath = "";
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.cortex_pb.CascadeConversationalPlannerConfig";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "read_only",
          kind: "scalar",
          T: 8,
          opt: !0
      }, {
          no: 2,
          name: "use_clusters",
          kind: "scalar",
          T: 8,
          opt: !0
      }, {
          no: 3,
          name: "cluster_path",
          kind: "scalar",
          T: 9
      }]));
      static fromBinary(e, t) {
          return (new cc).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new cc).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new cc).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(cc, e, t)
      }
  }
  class uc extends d {
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.cortex_pb.CascadeAgenticPlannerConfig";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "enable_feedback_loop",
          kind: "scalar",
          T: 8,
          opt: !0
      }]));
      static fromBinary(e, t) {
          return (new uc).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new uc).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new uc).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(uc, e, t)
      }
  }
  class lc extends d {
      clusterPath = "";
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.cortex_pb.CascadeResearchPlannerConfig";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "add_reference_nodes",
          kind: "scalar",
          T: 8,
          opt: !0
      }, {
          no: 2,
          name: "use_clusters",
          kind: "scalar",
          T: 8,
          opt: !0
      }, {
          no: 3,
          name: "cluster_path",
          kind: "scalar",
          T: 9
      }]));
      static fromBinary(e, t) {
          return (new lc).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new lc).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new lc).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(lc, e, t)
      }
  }
  class _c extends d {
      mQueryModel = Fe.MODEL_UNSPECIFIED;
      maxTokensPerMQuery = 0;
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.cortex_pb.MqueryToolConfig";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "m_query_config",
          kind: "message",
          T: sr
      }, {
          no: 2,
          name: "m_query_model",
          kind: "enum",
          T: Le.getEnumType(Fe)
      }, {
          no: 3,
          name: "max_tokens_per_m_query",
          kind: "scalar",
          T: 13
      }]));
      static fromBinary(e, t) {
          return (new _c).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new _c).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new _c).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(_c, e, t)
      }
  }
  class dc extends d {
      disableExtensions = [];
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.cortex_pb.CodeToolConfig";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "disable_extensions",
          kind: "scalar",
          T: 9,
          repeated: !0
      }, {
          no: 2,
          name: "apply_edits",
          kind: "scalar",
          T: 8,
          opt: !0
      }]));
      static fromBinary(e, t) {
          return (new dc).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new dc).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new dc).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(dc, e, t)
      }
  }
  class Ec extends d {
      intentModel = Fe.MODEL_UNSPECIFIED;
      maxContextTokens = 0;
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.cortex_pb.IntentToolConfig";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "intent_model",
          kind: "enum",
          T: Le.getEnumType(Fe)
      }, {
          no: 2,
          name: "max_context_tokens",
          kind: "scalar",
          T: 13
      }]));
      static fromBinary(e, t) {
          return (new Ec).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new Ec).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new Ec).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(Ec, e, t)
      }
  }
  class Tc extends d {
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.cortex_pb.CascadeToolConfig";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "mquery",
          kind: "message",
          T: _c
      }, {
          no: 2,
          name: "code",
          kind: "message",
          T: dc
      }, {
          no: 3,
          name: "intent",
          kind: "message",
          T: Ec
      }]));
      static fromBinary(e, t) {
          return (new Tc).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new Tc).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new Tc).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(Tc, e, t)
      }
  }
  class fc extends d {
      plannerTypeConfig = {
          case: void 0
      };
      planModel = Fe.MODEL_UNSPECIFIED;
      maxIterations = 0;
      maxStepParseRetries = 0;
      maxOutputTokens = 0;
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.cortex_pb.CascadePlannerConfig";
      static fields = Le.util.newFieldList(( () => [{
          no: 2,
          name: "conversational",
          kind: "message",
          T: cc,
          oneof: "planner_type_config"
      }, {
          no: 3,
          name: "agentic",
          kind: "message",
          T: uc,
          oneof: "planner_type_config"
      }, {
          no: 10,
          name: "research",
          kind: "message",
          T: lc,
          oneof: "planner_type_config"
      }, {
          no: 13,
          name: "tool_config",
          kind: "message",
          T: Tc
      }, {
          no: 1,
          name: "plan_model",
          kind: "enum",
          T: Le.getEnumType(Fe)
      }, {
          no: 4,
          name: "max_iterations",
          kind: "scalar",
          T: 13
      }, {
          no: 5,
          name: "max_step_parse_retries",
          kind: "scalar",
          T: 13
      }, {
          no: 6,
          name: "max_output_tokens",
          kind: "scalar",
          T: 13
      }, {
          no: 7,
          name: "no_tool_explanation",
          kind: "scalar",
          T: 8,
          opt: !0
      }, {
          no: 11,
          name: "allow_pending_steps",
          kind: "scalar",
          T: 8,
          opt: !0
      }, {
          no: 12,
          name: "forbid_tool_use_on_last_retry",
          kind: "scalar",
          T: 8,
          opt: !0
      }]));
      static fromBinary(e, t) {
          return (new fc).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new fc).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new fc).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(fc, e, t)
      }
  }
  class pc extends d {
      identifier = {
          case: void 0
      };
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.cortex_pb.BaseTrajectoryIdentifier";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "cascade_id",
          kind: "scalar",
          T: 9,
          oneof: "identifier"
      }, {
          no: 2,
          name: "implicit_trajectory_file_uri",
          kind: "scalar",
          T: 9,
          oneof: "identifier"
      }, {
          no: 3,
          name: "last_active_doc",
          kind: "scalar",
          T: 8,
          oneof: "identifier"
      }]));
      static fromBinary(e, t) {
          return (new pc).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new pc).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new pc).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(pc, e, t)
      }
  }
  class Sc extends d {
      confirm = !1;
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.cortex_pb.CascadeUserBinaryConfirmation";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "confirm",
          kind: "scalar",
          T: 8
      }]));
      static fromBinary(e, t) {
          return (new Sc).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new Sc).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new Sc).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(Sc, e, t)
      }
  }
  class Nc extends d {
      trajectoryId = "";
      stepIndex = 0;
      interaction = {
          case: void 0
      };
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.cortex_pb.CascadeUserInteraction";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "trajectory_id",
          kind: "scalar",
          T: 9
      }, {
          no: 2,
          name: "step_index",
          kind: "scalar",
          T: 13
      }, {
          no: 3,
          name: "binary_confirmation",
          kind: "message",
          T: Sc,
          oneof: "interaction"
      }]));
      static fromBinary(e, t) {
          return (new Nc).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new Nc).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new Nc).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(Nc, e, t)
      }
  }
  class gc extends d {
      input = 0;
      output = 0;
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.cortex_pb.CortexStepDummy";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "input",
          kind: "scalar",
          T: 13
      }, {
          no: 2,
          name: "output",
          kind: "scalar",
          T: 13
      }]));
      static fromBinary(e, t) {
          return (new gc).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new gc).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new gc).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(gc, e, t)
      }
  }
  class Ic extends d {
      output = {};
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.cortex_pb.CortexStepFinish";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "output",
          kind: "map",
          K: 9,
          V: {
              kind: "scalar",
              T: 9
          }
      }]));
      static fromBinary(e, t) {
          return (new Ic).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new Ic).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new Ic).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(Ic, e, t)
      }
  }
  class Cc extends d {
      userProvided = !1;
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.cortex_pb.CortexStepPlanInput";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "plan_input",
          kind: "message",
          T: km
      }, {
          no: 2,
          name: "user_provided",
          kind: "scalar",
          T: 8
      }]));
      static fromBinary(e, t) {
          return (new Cc).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new Cc).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new Cc).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(Cc, e, t)
      }
  }
  class Oc extends d {
      checkpointIndex = 0;
      includedStepIndices = [];
      userIntent = "";
      sessionSummary = "";
      codeChangeSummary = "";
      editedFileMap = {};
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.cortex_pb.CortexStepCheckpoint";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "checkpoint_index",
          kind: "scalar",
          T: 13
      }, {
          no: 3,
          name: "included_step_indices",
          kind: "scalar",
          T: 13,
          repeated: !0
      }, {
          no: 4,
          name: "user_intent",
          kind: "scalar",
          T: 9
      }, {
          no: 5,
          name: "session_summary",
          kind: "scalar",
          T: 9
      }, {
          no: 6,
          name: "code_change_summary",
          kind: "scalar",
          T: 9
      }, {
          no: 7,
          name: "edited_file_map",
          kind: "map",
          K: 9,
          V: {
              kind: "message",
              T: Ka
          }
      }]));
      static fromBinary(e, t) {
          return (new Oc).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new Oc).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new Oc).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(Oc, e, t)
      }
  }
  class yc extends d {
      tokenThreshold = 0;
      maxOverheadRatio = 0;
      movingWindowSize = 0;
      maxTokenLimit = 0;
      checkpointModel = Fe.MODEL_UNSPECIFIED;
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.cortex_pb.CheckpointConfig";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "token_threshold",
          kind: "scalar",
          T: 13
      }, {
          no: 3,
          name: "max_overhead_ratio",
          kind: "scalar",
          T: 2
      }, {
          no: 4,
          name: "moving_window_size",
          kind: "scalar",
          T: 13
      }, {
          no: 5,
          name: "max_token_limit",
          kind: "scalar",
          T: 13
      }, {
          no: 7,
          name: "checkpoint_model",
          kind: "enum",
          T: Le.getEnumType(Fe)
      }, {
          no: 6,
          name: "enabled",
          kind: "scalar",
          T: 8,
          opt: !0
      }]));
      static fromBinary(e, t) {
          return (new yc).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new yc).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new yc).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(yc, e, t)
      }
  }
  class wc extends d {
      ccis = [];
      numTokensProcessed = 0;
      numItemsScored = 0;
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.cortex_pb.CortexStepMquery";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "input",
          kind: "message",
          T: km
      }, {
          no: 2,
          name: "ccis",
          kind: "message",
          T: Mi,
          repeated: !0
      }, {
          no: 3,
          name: "num_tokens_processed",
          kind: "scalar",
          T: 13
      }, {
          no: 4,
          name: "num_items_scored",
          kind: "scalar",
          T: 13
      }]));
      static fromBinary(e, t) {
          return (new wc).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new wc).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new wc).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(wc, e, t)
      }
  }
  class Ac extends d {
      boundaryType = La.UNSPECIFIED;
      completionId = "";
      intent = "";
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.cortex_pb.ImplicitCodeActionMetadata";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "boundary_type",
          kind: "enum",
          T: Le.getEnumType(La)
      }, {
          no: 2,
          name: "completion_id",
          kind: "scalar",
          T: 9
      }, {
          no: 3,
          name: "intent",
          kind: "scalar",
          T: 9
      }]));
      static fromBinary(e, t) {
          return (new Ac).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new Ac).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new Ac).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(Ac, e, t)
      }
  }
  class Pc extends d {
      useFastApply = !1;
      acknowledgementType = Ra.UNSPECIFIED;
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.cortex_pb.CortexStepCodeAction";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "action_spec",
          kind: "message",
          T: Jm
      }, {
          no: 2,
          name: "action_result",
          kind: "message",
          T: Bm
      }, {
          no: 3,
          name: "implicit_metadata",
          kind: "message",
          T: Ac
      }, {
          no: 4,
          name: "use_fast_apply",
          kind: "scalar",
          T: 8
      }, {
          no: 5,
          name: "acknowledgement_type",
          kind: "enum",
          T: Le.getEnumType(Ra)
      }]));
      static fromBinary(e, t) {
          return (new Pc).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new Pc).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new Pc).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(Pc, e, t)
      }
  }
  class Lc extends d {
      codeInstruction = "";
      markdownLanguage = "";
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.cortex_pb.CortexStepProposeCode";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "action_spec",
          kind: "message",
          T: Jm
      }, {
          no: 2,
          name: "action_result",
          kind: "message",
          T: Bm
      }, {
          no: 3,
          name: "code_instruction",
          kind: "scalar",
          T: 9
      }, {
          no: 4,
          name: "markdown_language",
          kind: "scalar",
          T: 9
      }]));
      static fromBinary(e, t) {
          return (new Lc).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new Lc).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new Lc).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(Lc, e, t)
      }
  }
  class Rc extends d {
      commitMessage = "";
      commitHash = "";
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.cortex_pb.CortexStepGitCommit";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "input",
          kind: "message",
          T: km
      }, {
          no: 2,
          name: "commit_message",
          kind: "scalar",
          T: 9
      }, {
          no: 3,
          name: "commit_hash",
          kind: "scalar",
          T: 9
      }]));
      static fromBinary(e, t) {
          return (new Rc).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new Rc).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new Rc).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(Rc, e, t)
      }
  }
  class kc extends d {
      relativePath = "";
      lineNumber = 0;
      content = "";
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.cortex_pb.GrepSearchResult";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "relative_path",
          kind: "scalar",
          T: 9
      }, {
          no: 2,
          name: "line_number",
          kind: "scalar",
          T: 13
      }, {
          no: 3,
          name: "content",
          kind: "scalar",
          T: 9
      }]));
      static fromBinary(e, t) {
          return (new kc).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new kc).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new kc).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(kc, e, t)
      }
  }
  class Jc extends d {
      informCciList = [];
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.cortex_pb.CortexStepInformPlanner";
      static fields = Le.util.newFieldList(( () => [{
          no: 3,
          name: "target_code_change",
          kind: "message",
          T: fo
      }, {
          no: 4,
          name: "inform_cci_list",
          kind: "message",
          T: Mi,
          repeated: !0
      }]));
      static fromBinary(e, t) {
          return (new Jc).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new Jc).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new Jc).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(Jc, e, t)
      }
  }
  class Dc extends (null) {
      cciRatio = 0;
      randomize = !1;
      manualSeed = 0;
      mode = ka.UNSPECIFIED;
      isCertain = !1;
      constructor(e) {
          super(),
          proto3.util.initPartial(e, this)
      }
      static runtime = null;
      static typeName = null;
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "cci_ratio",
          kind: "scalar",
          T: 2
      }, {
          no: 2,
          name: "randomize",
          kind: "scalar",
          T: 8
      }, {
          no: 3,
          name: "manual_seed",
          kind: "scalar",
          T: 13
      }, {
          no: 4,
          name: "mode",
          kind: "enum",
          T: Le.getEnumType(ka)
      }, {
          no: 5,
          name: "is_certain",
          kind: "scalar",
          T: 8
      }]));
      static fromBinary(e, t) {
          return (new Dc).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new Dc).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new Dc).fromJsonString(e, t)
      }
      static equals(e, t) {
          return proto3.util.equals(Dc, e, t)
      }
  }
  class hc extends (null) {
      numSamplesPerCommit = 0;
      constructor(e) {
          super(),
          proto3.util.initPartial(e, this)
      }
      static runtime = null;
      static typeName = null;
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "num_samples_per_commit",
          kind: "scalar",
          T: 13
      }]));
      static fromBinary(e, t) {
          return (new hc).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new hc).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new hc).fromJsonString(e, t)
      }
      static equals(e, t) {
          return proto3.util.equals(hc, e, t)
      }
  }
  class xc extends d {
      searchDirectory = "";
      query = "";
      matchPerLine = !1;
      includes = [];
      caseInsensitive = !1;
      results = [];
      totalResults = 0;
      rawOutput = "";
      grepError = "";
      commandRun = "";
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.cortex_pb.CortexStepGrepSearch";
      static fields = Le.util.newFieldList(( () => [{
          no: 11,
          name: "search_directory",
          kind: "scalar",
          T: 9
      }, {
          no: 1,
          name: "query",
          kind: "scalar",
          T: 9
      }, {
          no: 8,
          name: "match_per_line",
          kind: "scalar",
          T: 8
      }, {
          no: 2,
          name: "includes",
          kind: "scalar",
          T: 9,
          repeated: !0
      }, {
          no: 9,
          name: "case_insensitive",
          kind: "scalar",
          T: 8
      }, {
          no: 4,
          name: "results",
          kind: "message",
          T: kc,
          repeated: !0
      }, {
          no: 7,
          name: "total_results",
          kind: "scalar",
          T: 13
      }, {
          no: 3,
          name: "raw_output",
          kind: "scalar",
          T: 9
      }, {
          no: 5,
          name: "grep_error",
          kind: "scalar",
          T: 9
      }, {
          no: 10,
          name: "command_run",
          kind: "scalar",
          T: 9
      }]));
      static fromBinary(e, t) {
          return (new xc).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new xc).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new xc).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(xc, e, t)
      }
  }
  class Uc extends d {
      relativePath = "";
      absoluteUri = "";
      type = Ja.UNSPECIFIED;
      size = y.zero;
      modifiedTime = y.zero;
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.cortex_pb.FindResult";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "relative_path",
          kind: "scalar",
          T: 9
      }, {
          no: 5,
          name: "absolute_uri",
          kind: "scalar",
          T: 9
      }, {
          no: 2,
          name: "type",
          kind: "enum",
          T: Le.getEnumType(Ja)
      }, {
          no: 3,
          name: "size",
          kind: "scalar",
          T: 4
      }, {
          no: 4,
          name: "modified_time",
          kind: "scalar",
          T: 3
      }]));
      static fromBinary(e, t) {
          return (new Uc).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new Uc).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new Uc).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(Uc, e, t)
      }
  }
  class Mc extends d {
      searchDirectory = "";
      pattern = "";
      includes = [];
      excludes = [];
      type = Ja.UNSPECIFIED;
      maxDepth = 0;
      results = [];
      totalResults = 0;
      rawOutput = "";
      findError = "";
      commandRun = "";
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.cortex_pb.CortexStepFind";
      static fields = Le.util.newFieldList(( () => [{
          no: 10,
          name: "search_directory",
          kind: "scalar",
          T: 9
      }, {
          no: 1,
          name: "pattern",
          kind: "scalar",
          T: 9
      }, {
          no: 2,
          name: "includes",
          kind: "scalar",
          T: 9,
          repeated: !0
      }, {
          no: 3,
          name: "excludes",
          kind: "scalar",
          T: 9,
          repeated: !0
      }, {
          no: 4,
          name: "type",
          kind: "enum",
          T: Le.getEnumType(Ja)
      }, {
          no: 5,
          name: "max_depth",
          kind: "scalar",
          T: 5
      }, {
          no: 6,
          name: "results",
          kind: "message",
          T: Uc,
          repeated: !0
      }, {
          no: 7,
          name: "total_results",
          kind: "scalar",
          T: 13
      }, {
          no: 11,
          name: "raw_output",
          kind: "scalar",
          T: 9
      }, {
          no: 8,
          name: "find_error",
          kind: "scalar",
          T: 9
      }, {
          no: 9,
          name: "command_run",
          kind: "scalar",
          T: 9
      }]));
      static fromBinary(e, t) {
          return (new Mc).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new Mc).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new Mc).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(Mc, e, t)
      }
  }
  class Bc extends d {
      absolutePathUri = "";
      startLine = 0;
      endLine = 0;
      content = "";
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.cortex_pb.CortexStepViewFile";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "absolute_path_uri",
          kind: "scalar",
          T: 9
      }, {
          no: 2,
          name: "start_line",
          kind: "scalar",
          T: 13
      }, {
          no: 3,
          name: "end_line",
          kind: "scalar",
          T: 13
      }, {
          no: 4,
          name: "content",
          kind: "scalar",
          T: 9
      }]));
      static fromBinary(e, t) {
          return (new Bc).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new Bc).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new Bc).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(Bc, e, t)
      }
  }
  class Fc extends d {
      name = "";
      isDir = !1;
      numChildren = 0;
      sizeBytes = y.zero;
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.cortex_pb.ListDirectoryResult";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "name",
          kind: "scalar",
          T: 9
      }, {
          no: 2,
          name: "is_dir",
          kind: "scalar",
          T: 8
      }, {
          no: 3,
          name: "num_children",
          kind: "scalar",
          T: 13
      }, {
          no: 4,
          name: "size_bytes",
          kind: "scalar",
          T: 4
      }]));
      static fromBinary(e, t) {
          return (new Fc).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new Fc).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new Fc).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(Fc, e, t)
      }
  }
  class bc extends d {
      directoryPathUri = "";
      children = [];
      results = [];
      dirNotFound = !1;
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.cortex_pb.CortexStepListDirectory";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "directory_path_uri",
          kind: "scalar",
          T: 9
      }, {
          no: 2,
          name: "children",
          kind: "scalar",
          T: 9,
          repeated: !0
      }, {
          no: 3,
          name: "results",
          kind: "message",
          T: Fc,
          repeated: !0
      }, {
          no: 4,
          name: "dir_not_found",
          kind: "scalar",
          T: 8
      }]));
      static fromBinary(e, t) {
          return (new bc).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new bc).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new bc).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(bc, e, t)
      }
  }
  class qc extends d {
      message = "";
      path = "";
      line = 0;
      column = 0;
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.cortex_pb.CortexStepCompileDiagnostic";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "message",
          kind: "scalar",
          T: 9
      }, {
          no: 2,
          name: "path",
          kind: "scalar",
          T: 9
      }, {
          no: 3,
          name: "line",
          kind: "scalar",
          T: 13
      }, {
          no: 4,
          name: "column",
          kind: "scalar",
          T: 13
      }]));
      static fromBinary(e, t) {
          return (new qc).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new qc).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new qc).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(qc, e, t)
      }
  }
  class Gc extends d {
      query = "";
      inputClusters = [];
      repoName = "";
      scores = [];
      outputClusters = [];
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.cortex_pb.CortexStepClusterQuery";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "query",
          kind: "scalar",
          T: 9
      }, {
          no: 2,
          name: "input_clusters",
          kind: "message",
          T: Br,
          repeated: !0
      }, {
          no: 5,
          name: "repo_name",
          kind: "scalar",
          T: 9
      }, {
          no: 3,
          name: "scores",
          kind: "scalar",
          T: 2,
          repeated: !0
      }, {
          no: 6,
          name: "output_clusters",
          kind: "message",
          T: Br,
          repeated: !0
      }]));
      static fromBinary(e, t) {
          return (new Gc).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new Gc).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new Gc).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(Gc, e, t)
      }
  }
  class vc extends d {
      clusters = [];
      repoName = "";
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.cortex_pb.CortexStepListClusters";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "clusters",
          kind: "message",
          T: Br,
          repeated: !0
      }, {
          no: 2,
          name: "repo_name",
          kind: "scalar",
          T: 9
      }]));
      static fromBinary(e, t) {
          return (new vc).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new vc).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new vc).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(vc, e, t)
      }
  }
  class Hc extends d {
      tool = Da.UNSPECIFIED;
      inputSpec = "";
      options = {};
      target = "";
      artifactPath = "";
      artifactIsExecutable = !1;
      errors = [];
      warnings = [];
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.cortex_pb.CortexStepCompile";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "tool",
          kind: "enum",
          T: Le.getEnumType(Da)
      }, {
          no: 2,
          name: "input_spec",
          kind: "scalar",
          T: 9
      }, {
          no: 3,
          name: "options",
          kind: "map",
          K: 9,
          V: {
              kind: "scalar",
              T: 9
          }
      }, {
          no: 4,
          name: "target",
          kind: "scalar",
          T: 9
      }, {
          no: 5,
          name: "artifact_path",
          kind: "scalar",
          T: 9
      }, {
          no: 6,
          name: "artifact_is_executable",
          kind: "scalar",
          T: 8
      }, {
          no: 7,
          name: "errors",
          kind: "message",
          T: qc,
          repeated: !0
      }, {
          no: 8,
          name: "warnings",
          kind: "message",
          T: qc,
          repeated: !0
      }]));
      static fromBinary(e, t) {
          return (new Hc).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new Hc).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new Hc).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(Hc, e, t)
      }
  }
  class Vc extends (null) {
      promptFraction = 0;
      constructor(e) {
          super(),
          proto3.util.initPartial(e, this)
      }
      static runtime = null;
      static typeName = null;
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "prompt_fraction",
          kind: "scalar",
          T: 2
      }]));
      static fromBinary(e, t) {
          return (new Vc).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new Vc).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new Vc).fromJsonString(e, t)
      }
      static equals(e, t) {
          return proto3.util.equals(Vc, e, t)
      }
  }
  class Xc extends d {
      query = "";
      userResponse = "";
      items = [];
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.cortex_pb.CortexStepUserInput";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "query",
          kind: "scalar",
          T: 9
      }, {
          no: 2,
          name: "user_response",
          kind: "scalar",
          T: 9
      }, {
          no: 3,
          name: "items",
          kind: "message",
          T: Tr,
          repeated: !0
      }, {
          no: 4,
          name: "active_user_state",
          kind: "message",
          T: Vi
      }]));
      static fromBinary(e, t) {
          return (new Xc).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new Xc).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new Xc).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(Xc, e, t)
      }
  }
  class Yc extends (null) {
      openDocuments = [];
      constructor(e) {
          super(),
          proto3.util.initPartial(e, this)
      }
      static runtime = null;
      static typeName = null;
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "active_document",
          kind: "message",
          T: dr
      }, {
          no: 2,
          name: "open_documents",
          kind: "message",
          T: dr,
          repeated: !0
      }, {
          no: 3,
          name: "active_node",
          kind: "message",
          T: On
      }]));
      static fromBinary(e, t) {
          return (new Yc).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new Yc).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new Yc).fromJsonString(e, t)
      }
      static equals(e, t) {
          return proto3.util.equals(Yc, e, t)
      }
  }
  class Kc extends d {
      response = "";
      knowledgeBaseItems = [];
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.cortex_pb.CortexStepPlannerResponse";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "response",
          kind: "scalar",
          T: 9
      }, {
          no: 2,
          name: "knowledge_base_items",
          kind: "message",
          T: Gr,
          repeated: !0
      }]));
      static fromBinary(e, t) {
          return (new Kc).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new Kc).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new Kc).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(Kc, e, t)
      }
  }
  class Wc extends d {
      absolutePath = "";
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.cortex_pb.CortexStepFileBreakdown";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "absolute_path",
          kind: "scalar",
          T: 9
      }, {
          no: 2,
          name: "document_outline",
          kind: "message",
          T: Ur
      }]));
      static fromBinary(e, t) {
          return (new Wc).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new Wc).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new Wc).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(Wc, e, t)
      }
  }
  class zc extends d {
      absoluteUri = "";
      nodeName = "";
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.cortex_pb.CortexStepViewCodeItem";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "absolute_uri",
          kind: "scalar",
          T: 9
      }, {
          no: 2,
          name: "node_name",
          kind: "scalar",
          T: 9
      }, {
          no: 3,
          name: "cci",
          kind: "message",
          T: On
      }]));
      static fromBinary(e, t) {
          return (new zc).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new zc).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new zc).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(zc, e, t)
      }
  }
  class jc extends d {
      targetFileUri = "";
      codeContent = [];
      fileCreated = !1;
      acknowledgementType = Ra.UNSPECIFIED;
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.cortex_pb.CortexStepWriteToFile";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "target_file_uri",
          kind: "scalar",
          T: 9
      }, {
          no: 2,
          name: "code_content",
          kind: "scalar",
          T: 9,
          repeated: !0
      }, {
          no: 3,
          name: "diff",
          kind: "message",
          T: Ga
      }, {
          no: 4,
          name: "file_created",
          kind: "scalar",
          T: 8
      }, {
          no: 5,
          name: "acknowledgement_type",
          kind: "enum",
          T: Le.getEnumType(Ra)
      }]));
      static fromBinary(e, t) {
          return (new jc).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new jc).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new jc).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(jc, e, t)
      }
  }
  class $c extends d {
      queries = [];
      connectorTypes = [];
      knowledgeBaseGroups = [];
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.cortex_pb.CortexStepSearchKnowledgeBase";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "queries",
          kind: "scalar",
          T: 9,
          repeated: !0
      }, {
          no: 3,
          name: "time_range",
          kind: "message",
          T: ko
      }, {
          no: 4,
          name: "connector_types",
          kind: "enum",
          T: Le.getEnumType(pa),
          repeated: !0
      }, {
          no: 2,
          name: "knowledge_base_groups",
          kind: "message",
          T: vr,
          repeated: !0
      }]));
      static fromBinary(e, t) {
          return (new $c).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new $c).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new $c).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals($c, e, t)
      }
  }
  class Qc extends d {
      suggestions = [];
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.cortex_pb.CortexStepSuggestedResponses";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "suggestions",
          kind: "scalar",
          T: 9,
          repeated: !0
      }]));
      static fromBinary(e, t) {
          return (new Qc).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new Qc).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new Qc).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(Qc, e, t)
      }
  }
  class Zc extends d {
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.cortex_pb.CortexStepErrorMessage";
      static fields = Le.util.newFieldList(( () => [{
          no: 3,
          name: "error",
          kind: "message",
          T: ac
      }]));
      static fromBinary(e, t) {
          return (new Zc).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new Zc).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new Zc).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(Zc, e, t)
      }
  }
  class eu extends d {
      clusterId = "";
      query = "";
      ccis = [];
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.cortex_pb.CortexStepInspectCluster";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "cluster_id",
          kind: "scalar",
          T: 9
      }, {
          no: 2,
          name: "query",
          kind: "scalar",
          T: 9
      }, {
          no: 3,
          name: "matched_cluster",
          kind: "message",
          T: Br
      }, {
          no: 4,
          name: "ccis",
          kind: "message",
          T: Mi,
          repeated: !0
      }]));
      static fromBinary(e, t) {
          return (new eu).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new eu).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new eu).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(eu, e, t)
      }
  }
  class tu extends d {
      command = "";
      cwd = "";
      args = [];
      stdout = "";
      stderr = "";
      exitCode = 0;
      stdoutBuffer = "";
      stderrBuffer = "";
      stdoutLinesAbove = 0;
      stderrLinesAbove = 0;
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.cortex_pb.CortexStepRunCommand";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "command",
          kind: "scalar",
          T: 9
      }, {
          no: 2,
          name: "cwd",
          kind: "scalar",
          T: 9
      }, {
          no: 3,
          name: "args",
          kind: "scalar",
          T: 9,
          repeated: !0
      }, {
          no: 4,
          name: "stdout",
          kind: "scalar",
          T: 9
      }, {
          no: 5,
          name: "stderr",
          kind: "scalar",
          T: 9
      }, {
          no: 6,
          name: "exit_code",
          kind: "scalar",
          T: 5
      }, {
          no: 7,
          name: "stdout_buffer",
          kind: "scalar",
          T: 9
      }, {
          no: 8,
          name: "stderr_buffer",
          kind: "scalar",
          T: 9
      }, {
          no: 9,
          name: "stdout_lines_above",
          kind: "scalar",
          T: 13
      }, {
          no: 10,
          name: "stderr_lines_above",
          kind: "scalar",
          T: 13
      }]));
      static fromBinary(e, t) {
          return (new tu).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new tu).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new tu).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(tu, e, t)
      }
  }
  class nu extends d {
      absoluteUri = "";
      relatedFileAbsoluteUris = [];
      scores = [];
      relatedFileError = "";
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.cortex_pb.CortexStepRelatedFiles";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "absolute_uri",
          kind: "scalar",
          T: 9
      }, {
          no: 2,
          name: "related_file_absolute_uris",
          kind: "scalar",
          T: 9,
          repeated: !0
      }, {
          no: 3,
          name: "scores",
          kind: "scalar",
          T: 2,
          repeated: !0
      }, {
          no: 4,
          name: "related_file_error",
          kind: "scalar",
          T: 9
      }]));
      static fromBinary(e, t) {
          return (new nu).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new nu).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new nu).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(nu, e, t)
      }
  }
  class ru extends (null) {
      cascadeId = "";
      status = Aa.UNSPECIFIED;
      constructor(e) {
          super(),
          proto3.util.initPartial(e, this)
      }
      static runtime = null;
      static typeName = null;
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "cascade_id",
          kind: "scalar",
          T: 9
      }, {
          no: 2,
          name: "trajectory",
          kind: "message",
          T: zm
      }, {
          no: 3,
          name: "status",
          kind: "enum",
          T: Le.getEnumType(Aa)
      }]));
      static fromBinary(e, t) {
          return (new ru).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new ru).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new ru).fromJsonString(e, t)
      }
      static equals(e, t) {
          return proto3.util.equals(ru, e, t)
      }
  }
  !function(e) {
      e[e.UNSPECIFIED = 0] = "UNSPECIFIED",
      e[e.USER_APPLIED = 1] = "USER_APPLIED",
      e[e.USER_REJECTED = 2] = "USER_REJECTED"
  }(ha || (ha = {})),
  Le.util.setEnumType(ha, "exa.language_server_pb.ApplyActionType", [{
      no: 0,
      name: "APPLY_ACTION_TYPE_UNSPECIFIED"
  }, {
      no: 1,
      name: "APPLY_ACTION_TYPE_USER_APPLIED"
  }, {
      no: 2,
      name: "APPLY_ACTION_TYPE_USER_REJECTED"
  }]),
  function(e) {
      e[e.UNSPECIFIED = 0] = "UNSPECIFIED",
      e[e.INACTIVE = 1] = "INACTIVE",
      e[e.PROCESSING = 2] = "PROCESSING",
      e[e.SUCCESS = 3] = "SUCCESS",
      e[e.WARNING = 4] = "WARNING",
      e[e.ERROR = 5] = "ERROR"
  }(xa || (xa = {})),
  Le.util.setEnumType(xa, "exa.language_server_pb.CodeiumState", [{
      no: 0,
      name: "CODEIUM_STATE_UNSPECIFIED"
  }, {
      no: 1,
      name: "CODEIUM_STATE_INACTIVE"
  }, {
      no: 2,
      name: "CODEIUM_STATE_PROCESSING"
  }, {
      no: 3,
      name: "CODEIUM_STATE_SUCCESS"
  }, {
      no: 4,
      name: "CODEIUM_STATE_WARNING"
  }, {
      no: 5,
      name: "CODEIUM_STATE_ERROR"
  }]),
  function(e) {
      e[e.UNSPECIFIED = 0] = "UNSPECIFIED",
      e[e.INLINE = 1] = "INLINE",
      e[e.BLOCK = 2] = "BLOCK",
      e[e.INLINE_MASK = 3] = "INLINE_MASK"
  }(Ua || (Ua = {})),
  Le.util.setEnumType(Ua, "exa.language_server_pb.CompletionPartType", [{
      no: 0,
      name: "COMPLETION_PART_TYPE_UNSPECIFIED"
  }, {
      no: 1,
      name: "COMPLETION_PART_TYPE_INLINE"
  }, {
      no: 2,
      name: "COMPLETION_PART_TYPE_BLOCK"
  }, {
      no: 3,
      name: "COMPLETION_PART_TYPE_INLINE_MASK"
  }]),
  function(e) {
      e[e.UNSPECIFIED = 0] = "UNSPECIFIED",
      e[e.COMMIT_HISTORY = 1] = "COMMIT_HISTORY",
      e[e.CURRENT_PLAN = 2] = "CURRENT_PLAN"
  }(Ma || (Ma = {})),
  Le.util.setEnumType(Ma, "exa.language_server_pb.ContextSuggestionSource", [{
      no: 0,
      name: "CONTEXT_SUGGESTION_SOURCE_UNSPECIFIED"
  }, {
      no: 1,
      name: "CONTEXT_SUGGESTION_SOURCE_COMMIT_HISTORY"
  }, {
      no: 2,
      name: "CONTEXT_SUGGESTION_SOURCE_CURRENT_PLAN"
  }]),
  function(e) {
      e[e.UNSPECIFIED = 0] = "UNSPECIFIED",
      e[e.INSERT = 1] = "INSERT",
      e[e.DELETE = 2] = "DELETE",
      e[e.UNCHANGED = 3] = "UNCHANGED"
  }(Ba || (Ba = {})),
  Le.util.setEnumType(Ba, "exa.language_server_pb.UnifiedDiffChangeType", [{
      no: 0,
      name: "UNIFIED_DIFF_CHANGE_TYPE_UNSPECIFIED"
  }, {
      no: 1,
      name: "UNIFIED_DIFF_CHANGE_TYPE_INSERT"
  }, {
      no: 2,
      name: "UNIFIED_DIFF_CHANGE_TYPE_DELETE"
  }, {
      no: 3,
      name: "UNIFIED_DIFF_CHANGE_TYPE_UNCHANGED"
  }]),
  function(e) {
      e[e.UNSPECIFIED = 0] = "UNSPECIFIED",
      e[e.LIGHT = 1] = "LIGHT",
      e[e.DARK = 2] = "DARK",
      e[e.HIGH_CONTRAST = 3] = "HIGH_CONTRAST",
      e[e.HIGH_CONTRAST_LIGHT = 4] = "HIGH_CONTRAST_LIGHT"
  }(Fa || (Fa = {})),
  Le.util.setEnumType(Fa, "exa.language_server_pb.EditorThemeType", [{
      no: 0,
      name: "EDITOR_THEME_TYPE_UNSPECIFIED"
  }, {
      no: 1,
      name: "EDITOR_THEME_TYPE_LIGHT"
  }, {
      no: 2,
      name: "EDITOR_THEME_TYPE_DARK"
  }, {
      no: 3,
      name: "EDITOR_THEME_TYPE_HIGH_CONTRAST"
  }, {
      no: 4,
      name: "EDITOR_THEME_TYPE_HIGH_CONTRAST_LIGHT"
  }]);
  class au extends d {
      planId = "";
      summary = [];
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.language_server_pb.SubmitCodingPlanSummaryRequest";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "plan_id",
          kind: "scalar",
          T: 9
      }, {
          no: 2,
          name: "summary",
          kind: "message",
          T: Im,
          repeated: !0
      }]));
      static fromBinary(e, t) {
          return (new au).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new au).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new au).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(au, e, t)
      }
  }
  class iu extends d {
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.language_server_pb.SubmitCodingPlanSummaryResponse";
      static fields = Le.util.newFieldList(( () => []));
      static fromBinary(e, t) {
          return (new iu).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new iu).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new iu).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(iu, e, t)
      }
  }
  class su extends d {
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.language_server_pb.GetAllCortexPlansRequest";
      static fields = Le.util.newFieldList(( () => []));
      static fromBinary(e, t) {
          return (new su).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new su).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new su).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(su, e, t)
      }
  }
  class ou extends d {
      plans = [];
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.language_server_pb.GetAllCortexPlansResponse";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "plans",
          kind: "message",
          T: Km,
          repeated: !0
      }]));
      static fromBinary(e, t) {
          return (new ou).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new ou).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new ou).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(ou, e, t)
      }
  }
  class mu extends d {
      cortexId = "";
      feedback = "";
      rating = 0;
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.language_server_pb.RecordCortexFeedbackRequest";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "metadata",
          kind: "message",
          T: on
      }, {
          no: 2,
          name: "cortex_id",
          kind: "scalar",
          T: 9
      }, {
          no: 3,
          name: "feedback",
          kind: "scalar",
          T: 9
      }, {
          no: 4,
          name: "rating",
          kind: "scalar",
          T: 5
      }]));
      static fromBinary(e, t) {
          return (new mu).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new mu).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new mu).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(mu, e, t)
      }
  }
  class cu extends d {
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.language_server_pb.RecordCortexFeedbackResponse";
      static fields = Le.util.newFieldList(( () => []));
      static fromBinary(e, t) {
          return (new cu).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new cu).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new cu).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(cu, e, t)
      }
  }
  class uu extends d {
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.language_server_pb.NewCortexPlanRequest";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "metadata",
          kind: "message",
          T: on
      }, {
          no: 2,
          name: "input",
          kind: "message",
          T: km
      }, {
          no: 3,
          name: "config",
          kind: "message",
          T: Xm
      }, {
          no: 4,
          name: "experiment_config",
          kind: "message",
          T: Mt
      }]));
      static fromBinary(e, t) {
          return (new uu).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new uu).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new uu).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(uu, e, t)
      }
  }
  class lu extends d {
      cortexId = "";
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.language_server_pb.NewCortexPlanResponse";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "cortex_id",
          kind: "scalar",
          T: 9
      }]));
      static fromBinary(e, t) {
          return (new lu).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new lu).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new lu).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(lu, e, t)
      }
  }
  class _u extends d {
      cortexId = "";
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.language_server_pb.GetCortexPlanRequest";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "cortex_id",
          kind: "scalar",
          T: 9
      }]));
      static fromBinary(e, t) {
          return (new _u).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new _u).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new _u).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(_u, e, t)
      }
  }
  class du extends d {
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.language_server_pb.GetCortexPlanResponse";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "state",
          kind: "message",
          T: Rm
      }]));
      static fromBinary(e, t) {
          return (new du).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new du).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new du).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(du, e, t)
      }
  }
  class Eu extends d {
      planId = "";
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.language_server_pb.CommitCodingPlanRequest";
      static fields = Le.util.newFieldList(( () => [{
          no: 2,
          name: "metadata",
          kind: "message",
          T: on
      }, {
          no: 1,
          name: "plan_id",
          kind: "scalar",
          T: 9
      }]));
      static fromBinary(e, t) {
          return (new Eu).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new Eu).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new Eu).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(Eu, e, t)
      }
  }
  class Tu extends d {
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.language_server_pb.CommitCodingPlanResponse";
      static fields = Le.util.newFieldList(( () => []));
      static fromBinary(e, t) {
          return (new Tu).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new Tu).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new Tu).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(Tu, e, t)
      }
  }
  class fu extends d {
      planId = "";
      feedback = "";
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.language_server_pb.ReplanCodingPlanRequest";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "plan_id",
          kind: "scalar",
          T: 9
      }, {
          no: 2,
          name: "feedback",
          kind: "scalar",
          T: 9
      }]));
      static fromBinary(e, t) {
          return (new fu).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new fu).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new fu).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(fu, e, t)
      }
  }
  class pu extends d {
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.language_server_pb.ReplanCodingPlanResponse";
      static fields = Le.util.newFieldList(( () => []));
      static fromBinary(e, t) {
          return (new pu).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new pu).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new pu).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(pu, e, t)
      }
  }
  class Su extends d {
      planId = "";
      actionIndex = 0;
      completionId = "";
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.language_server_pb.PrepareActionRequest";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "metadata",
          kind: "message",
          T: on
      }, {
          no: 2,
          name: "plan_id",
          kind: "scalar",
          T: 9
      }, {
          no: 3,
          name: "action_index",
          kind: "scalar",
          T: 13
      }, {
          no: 6,
          name: "completion_id",
          kind: "scalar",
          T: 9
      }, {
          no: 5,
          name: "experiment_config",
          kind: "message",
          T: Mt
      }]));
      static fromBinary(e, t) {
          return (new Su).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new Su).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new Su).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(Su, e, t)
      }
  }
  class Nu extends d {
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.language_server_pb.PrepareActionResponse";
      static fields = Le.util.newFieldList(( () => []));
      static fromBinary(e, t) {
          return (new Nu).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new Nu).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new Nu).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(Nu, e, t)
      }
  }
  class gu extends d {
      planId = "";
      actionIndex = 0;
      completionId = "";
      applyActionType = ha.UNSPECIFIED;
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.language_server_pb.ApplyActionRequest";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "metadata",
          kind: "message",
          T: on
      }, {
          no: 2,
          name: "plan_id",
          kind: "scalar",
          T: 9
      }, {
          no: 3,
          name: "action_index",
          kind: "scalar",
          T: 13
      }, {
          no: 7,
          name: "completion_id",
          kind: "scalar",
          T: 9
      }, {
          no: 5,
          name: "experiment_config",
          kind: "message",
          T: Mt
      }, {
          no: 6,
          name: "apply_action_type",
          kind: "enum",
          T: Le.getEnumType(ha)
      }]));
      static fromBinary(e, t) {
          return (new gu).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new gu).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new gu).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(gu, e, t)
      }
  }
  class Iu extends d {
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.language_server_pb.ApplyActionResponse";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "spec",
          kind: "message",
          T: Jm
      }]));
      static fromBinary(e, t) {
          return (new Iu).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new Iu).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new Iu).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(Iu, e, t)
      }
  }
  class Cu extends d {
      planId = "";
      actionIndex = 0;
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.language_server_pb.EditActionRequest";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "metadata",
          kind: "message",
          T: on
      }, {
          no: 2,
          name: "plan_id",
          kind: "scalar",
          T: 9
      }, {
          no: 3,
          name: "action_index",
          kind: "scalar",
          T: 13
      }, {
          no: 4,
          name: "spec",
          kind: "message",
          T: Jm
      }, {
          no: 6,
          name: "experiment_config",
          kind: "message",
          T: Mt
      }]));
      static fromBinary(e, t) {
          return (new Cu).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new Cu).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new Cu).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(Cu, e, t)
      }
  }
  class Ou extends d {
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.language_server_pb.EditActionResponse";
      static fields = Le.util.newFieldList(( () => []));
      static fromBinary(e, t) {
          return (new Ou).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new Ou).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new Ou).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(Ou, e, t)
      }
  }
  class yu extends d {
      requestedModelId = Fe.MODEL_UNSPECIFIED;
      selectionStartLine = y.zero;
      selectionEndLine = y.zero;
      commandText = "";
      requestSource = Ct.UNSPECIFIED;
      parentCompletionId = "";
      diffType = ra.UNSPECIFIED;
      diagnostics = [];
      supercompleteTriggerCondition = Pt.UNSPECIFIED;
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.language_server_pb.HandleStreamingCommandRequest";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "metadata",
          kind: "message",
          T: on
      }, {
          no: 2,
          name: "document",
          kind: "message",
          T: dr
      }, {
          no: 3,
          name: "editor_options",
          kind: "message",
          T: mn
      }, {
          no: 4,
          name: "requested_model_id",
          kind: "enum",
          T: Le.getEnumType(Fe)
      }, {
          no: 5,
          name: "experiment_config",
          kind: "message",
          T: Mt
      }, {
          no: 6,
          name: "selection_start_line",
          kind: "scalar",
          T: 4
      }, {
          no: 7,
          name: "selection_end_line",
          kind: "scalar",
          T: 4
      }, {
          no: 8,
          name: "command_text",
          kind: "scalar",
          T: 9
      }, {
          no: 9,
          name: "request_source",
          kind: "enum",
          T: Le.getEnumType(Ct)
      }, {
          no: 10,
          name: "mentioned_scope",
          kind: "message",
          T: er
      }, {
          no: 11,
          name: "action_pointer",
          kind: "message",
          T: ht
      }, {
          no: 12,
          name: "parent_completion_id",
          kind: "scalar",
          T: 9
      }, {
          no: 13,
          name: "diff_type",
          kind: "enum",
          T: Le.getEnumType(ra)
      }, {
          no: 14,
          name: "diagnostics",
          kind: "message",
          T: Jr,
          repeated: !0
      }, {
          no: 15,
          name: "supercomplete_trigger_condition",
          kind: "enum",
          T: Le.getEnumType(Pt)
      }]));
      static fromBinary(e, t) {
          return (new yu).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new yu).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new yu).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(yu, e, t)
      }
  }
  class wu extends d {
      completionId = "";
      promptId = "";
      selectionStartLine = y.zero;
      selectionEndLine = y.zero;
      score = 0;
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.language_server_pb.HandleStreamingCommandResponse";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "completion_id",
          kind: "scalar",
          T: 9
      }, {
          no: 2,
          name: "prompt_id",
          kind: "scalar",
          T: 9
      }, {
          no: 3,
          name: "diff",
          kind: "message",
          T: ba
      }, {
          no: 4,
          name: "latency_info",
          kind: "message",
          T: Vl
      }, {
          no: 5,
          name: "selection_start_line",
          kind: "scalar",
          T: 4
      }, {
          no: 6,
          name: "selection_end_line",
          kind: "scalar",
          T: 4
      }, {
          no: 7,
          name: "score",
          kind: "scalar",
          T: 1
      }, {
          no: 8,
          name: "character_diff",
          kind: "message",
          T: Ha
      }, {
          no: 9,
          name: "combo_diff",
          kind: "message",
          T: Xa
      }, {
          no: 10,
          name: "filter_reason",
          kind: "message",
          T: kr
      }]));
      static fromBinary(e, t) {
          return (new wu).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new wu).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new wu).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(wu, e, t)
      }
  }
  class Au extends d {
      threshold = 0;
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.language_server_pb.MultilineConfig";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "threshold",
          kind: "scalar",
          T: 2
      }]));
      static fromBinary(e, t) {
          return (new Au).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new Au).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new Au).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(Au, e, t)
      }
  }
  class Pu extends d {
      otherDocuments = [];
      disableCache = !1;
      oracleItems = [];
      modelName = "";
      requestedModelId = Fe.MODEL_UNSPECIFIED;
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.language_server_pb.GetCompletionsRequest";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "metadata",
          kind: "message",
          T: on
      }, {
          no: 2,
          name: "document",
          kind: "message",
          T: dr
      }, {
          no: 3,
          name: "editor_options",
          kind: "message",
          T: mn
      }, {
          no: 5,
          name: "other_documents",
          kind: "message",
          T: dr,
          repeated: !0
      }, {
          no: 6,
          name: "mock_response_data",
          kind: "message",
          T: En
      }, {
          no: 7,
          name: "experiment_config",
          kind: "message",
          T: Mt
      }, {
          no: 8,
          name: "disable_cache",
          kind: "scalar",
          T: 8
      }, {
          no: 9,
          name: "oracle_items",
          kind: "message",
          T: On,
          repeated: !0
      }, {
          no: 10,
          name: "model_name",
          kind: "scalar",
          T: 9
      }, {
          no: 12,
          name: "requested_model_id",
          kind: "enum",
          T: Le.getEnumType(Fe)
      }, {
          no: 13,
          name: "multiline_config",
          kind: "message",
          T: Au
      }]));
      static fromBinary(e, t) {
          return (new Pu).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new Pu).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new Pu).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(Pu, e, t)
      }
  }
  class Lu extends d {
      completionItems = [];
      filteredCompletionItems = [];
      modelTag = "";
      promptId = "";
      codeRanges = [];
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.language_server_pb.GetCompletionsResponse";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "state",
          kind: "message",
          T: vl
      }, {
          no: 2,
          name: "completion_items",
          kind: "message",
          T: Kl,
          repeated: !0
      }, {
          no: 7,
          name: "filtered_completion_items",
          kind: "message",
          T: Kl,
          repeated: !0
      }, {
          no: 3,
          name: "request_info",
          kind: "message",
          T: Hl
      }, {
          no: 4,
          name: "latency_info",
          kind: "message",
          T: Vl
      }, {
          no: 5,
          name: "model_tag",
          kind: "scalar",
          T: 9
      }, {
          no: 6,
          name: "prompt_id",
          kind: "scalar",
          T: 9
      }, {
          no: 8,
          name: "code_ranges",
          kind: "message",
          T: O_,
          repeated: !0
      }]));
      static fromBinary(e, t) {
          return (new Lu).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new Lu).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new Lu).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(Lu, e, t)
      }
  }
  class Ru extends d {
      completionId = "";
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.language_server_pb.AcceptCompletionRequest";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "metadata",
          kind: "message",
          T: on
      }, {
          no: 2,
          name: "completion_id",
          kind: "scalar",
          T: 9
      }]));
      static fromBinary(e, t) {
          return (new Ru).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new Ru).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new Ru).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(Ru, e, t)
      }
  }
  class ku extends d {
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.language_server_pb.AcceptCompletionResponse";
      static fields = Le.util.newFieldList(( () => []));
      static fromBinary(e, t) {
          return (new ku).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new ku).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new ku).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(ku, e, t)
      }
  }
  class Ju extends d {
      isAccepted = !1;
      feedbackDelayMs = y.zero;
      completionId = "";
      promptId = "";
      source = he.UNSPECIFIED;
      viewColumnsOpen = y.zero;
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.language_server_pb.ProvideCompletionFeedbackRequest";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "metadata",
          kind: "message",
          T: on
      }, {
          no: 9,
          name: "experiment_config",
          kind: "message",
          T: Mt
      }, {
          no: 2,
          name: "is_accepted",
          kind: "scalar",
          T: 8
      }, {
          no: 3,
          name: "feedback_delay_ms",
          kind: "scalar",
          T: 3
      }, {
          no: 4,
          name: "completion_id",
          kind: "scalar",
          T: 9
      }, {
          no: 5,
          name: "prompt_id",
          kind: "scalar",
          T: 9
      }, {
          no: 6,
          name: "latency_info",
          kind: "message",
          T: Vl
      }, {
          no: 7,
          name: "source",
          kind: "enum",
          T: Le.getEnumType(he)
      }, {
          no: 8,
          name: "document",
          kind: "message",
          T: dr
      }, {
          no: 10,
          name: "view_columns_open",
          kind: "scalar",
          T: 4
      }]));
      static fromBinary(e, t) {
          return (new Ju).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new Ju).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new Ju).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(Ju, e, t)
      }
  }
  class Du extends d {
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.language_server_pb.ProvideCompletionFeedbackResponse";
      static fields = Le.util.newFieldList(( () => []));
      static fromBinary(e, t) {
          return (new Du).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new Du).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new Du).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(Du, e, t)
      }
  }
  class hu extends d {
      previousErrorTraces = [];
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.language_server_pb.HeartbeatRequest";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "metadata",
          kind: "message",
          T: on
      }, {
          no: 2,
          name: "previous_error_traces",
          kind: "message",
          T: cn,
          repeated: !0
      }, {
          no: 3,
          name: "experiment_config",
          kind: "message",
          T: Mt
      }]));
      static fromBinary(e, t) {
          return (new hu).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new hu).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new hu).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(hu, e, t)
      }
  }
  class xu extends d {
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.language_server_pb.HeartbeatResponse";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "last_extension_heartbeat",
          kind: "message",
          T: Je
      }]));
      static fromBinary(e, t) {
          return (new xu).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new xu).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new xu).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(xu, e, t)
      }
  }
  class Uu extends d {
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.language_server_pb.GetStatusRequest";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "metadata",
          kind: "message",
          T: on
      }]));
      static fromBinary(e, t) {
          return (new Uu).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new Uu).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new Uu).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(Uu, e, t)
      }
  }
  class Mu extends d {
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.language_server_pb.GetStatusResponse";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "status",
          kind: "message",
          T: ur
      }]));
      static fromBinary(e, t) {
          return (new Mu).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new Mu).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new Mu).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(Mu, e, t)
      }
  }
  class Bu extends d {
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.language_server_pb.GetProcessesRequest";
      static fields = Le.util.newFieldList(( () => []));
      static fromBinary(e, t) {
          return (new Bu).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new Bu).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new Bu).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(Bu, e, t)
      }
  }
  class Fu extends d {
      models = [];
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.language_server_pb.GetExternalModelResponse";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "models",
          kind: "message",
          T: qn,
          repeated: !0
      }]));
      static fromBinary(e, t) {
          return (new Fu).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new Fu).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new Fu).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(Fu, e, t)
      }
  }
  class bu extends d {
      apiKey = "";
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.language_server_pb.GetExternalModelRequest";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "api_key",
          kind: "scalar",
          T: 9
      }]));
      static fromBinary(e, t) {
          return (new bu).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new bu).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new bu).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(bu, e, t)
      }
  }
  class qu extends d {
      lspPort = 0;
      chatWebServerPort = 0;
      chatClientPort = 0;
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.language_server_pb.GetProcessesResponse";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "lsp_port",
          kind: "scalar",
          T: 13
      }, {
          no: 2,
          name: "chat_web_server_port",
          kind: "scalar",
          T: 13
      }, {
          no: 3,
          name: "chat_client_port",
          kind: "scalar",
          T: 13
      }]));
      static fromBinary(e, t) {
          return (new qu).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new qu).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new qu).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(qu, e, t)
      }
  }
  class Gu extends d {
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.language_server_pb.GetAuthTokenRequest";
      static fields = Le.util.newFieldList(( () => []));
      static fromBinary(e, t) {
          return (new Gu).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new Gu).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new Gu).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(Gu, e, t)
      }
  }
  class vu extends d {
      authToken = "";
      uuid = "";
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.language_server_pb.GetAuthTokenResponse";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "auth_token",
          kind: "scalar",
          T: 9
      }, {
          no: 2,
          name: "uuid",
          kind: "scalar",
          T: 9
      }]));
      static fromBinary(e, t) {
          return (new vu).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new vu).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new vu).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(vu, e, t)
      }
  }
  class Hu extends d {
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.language_server_pb.RecordEventRequest";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "metadata",
          kind: "message",
          T: on
      }, {
          no: 2,
          name: "event",
          kind: "message",
          T: un
      }]));
      static fromBinary(e, t) {
          return (new Hu).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new Hu).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new Hu).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(Hu, e, t)
      }
  }
  class Vu extends d {
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.language_server_pb.RecordEventResponse";
      static fields = Le.util.newFieldList(( () => []));
      static fromBinary(e, t) {
          return (new Vu).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new Vu).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new Vu).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(Vu, e, t)
      }
  }
  class Xu extends d {
      requestId = y.zero;
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.language_server_pb.CancelRequestRequest";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "metadata",
          kind: "message",
          T: on
      }, {
          no: 2,
          name: "request_id",
          kind: "scalar",
          T: 4
      }]));
      static fromBinary(e, t) {
          return (new Xu).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new Xu).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new Xu).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(Xu, e, t)
      }
  }
  class Yu extends d {
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.language_server_pb.CancelRequestResponse";
      static fields = Le.util.newFieldList(( () => []));
      static fromBinary(e, t) {
          return (new Yu).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new Yu).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new Yu).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(Yu, e, t)
      }
  }
  class Ku extends d {
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.language_server_pb.EditConfigurationRequest";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "metadata",
          kind: "message",
          T: on
      }, {
          no: 2,
          name: "completion_configuration",
          kind: "message",
          T: Jt
      }]));
      static fromBinary(e, t) {
          return (new Ku).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new Ku).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new Ku).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(Ku, e, t)
      }
  }
  class Wu extends d {
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.language_server_pb.EditConfigurationResponse";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "completion_configuration",
          kind: "message",
          T: Jt
      }]));
      static fromBinary(e, t) {
          return (new Wu).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new Wu).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new Wu).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(Wu, e, t)
      }
  }
  class zu extends d {
      firebaseIdToken = "";
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.language_server_pb.RegisterUserRequest";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "firebase_id_token",
          jsonName: "firebase_id_token",
          kind: "scalar",
          T: 9
      }]));
      static fromBinary(e, t) {
          return (new zu).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new zu).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new zu).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(zu, e, t)
      }
  }
  class ju extends d {
      apiKey = "";
      name = "";
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.language_server_pb.RegisterUserResponse";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "api_key",
          jsonName: "api_key",
          kind: "scalar",
          T: 9
      }, {
          no: 2,
          name: "name",
          kind: "scalar",
          T: 9
      }]));
      static fromBinary(e, t) {
          return (new ju).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new ju).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new ju).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(ju, e, t)
      }
  }
  class $u extends d {
      query = "";
      numResults = 0;
      numClusters = 0;
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.language_server_pb.ClusteredSearchRequest";
      static fields = Le.util.newFieldList(( () => [{
          no: 4,
          name: "metadata",
          kind: "message",
          T: on
      }, {
          no: 1,
          name: "query",
          kind: "scalar",
          T: 9
      }, {
          no: 2,
          name: "num_results",
          kind: "scalar",
          T: 13
      }, {
          no: 3,
          name: "num_clusters",
          kind: "scalar",
          T: 13
      }]));
      static fromBinary(e, t) {
          return (new $u).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new $u).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new $u).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals($u, e, t)
      }
  }
  class Qu extends d {
      clusters = [];
      searchId = "";
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.language_server_pb.ClusteredSearchResponse";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "clusters",
          kind: "message",
          T: zl,
          repeated: !0
      }, {
          no: 2,
          name: "search_id",
          kind: "scalar",
          T: 9
      }]));
      static fromBinary(e, t) {
          return (new Qu).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new Qu).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new Qu).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(Qu, e, t)
      }
  }
  class Zu extends d {
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.language_server_pb.WellSupportedLanguagesRequest";
      static fields = Le.util.newFieldList(( () => []));
      static fromBinary(e, t) {
          return (new Zu).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new Zu).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new Zu).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(Zu, e, t)
      }
  }
  class el extends d {
      languages = [];
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.language_server_pb.WellSupportedLanguagesResponse";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "languages",
          kind: "enum",
          T: Le.getEnumType(Qe),
          repeated: !0
      }]));
      static fromBinary(e, t) {
          return (new el).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new el).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new el).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(el, e, t)
      }
  }
  class tl extends d {
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.language_server_pb.ProgressBarsRequest";
      static fields = Le.util.newFieldList(( () => []));
      static fromBinary(e, t) {
          return (new tl).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new tl).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new tl).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(tl, e, t)
      }
  }
  class nl extends d {
      progressBars = {};
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.language_server_pb.ProgressBarsResponse";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "progress_bars",
          kind: "map",
          K: 9,
          V: {
              kind: "message",
              T: jl
          }
      }]));
      static fromBinary(e, t) {
          return (new nl).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new nl).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new nl).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(nl, e, t)
      }
  }
  class rl extends d {
      resultId = "";
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.language_server_pb.RecordSearchDocOpenRequest";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "metadata",
          kind: "message",
          T: on
      }, {
          no: 2,
          name: "result_id",
          kind: "scalar",
          T: 9
      }]));
      static fromBinary(e, t) {
          return (new rl).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new rl).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new rl).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(rl, e, t)
      }
  }
  class al extends d {
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.language_server_pb.RecordSearchDocOpenResponse";
      static fields = Le.util.newFieldList(( () => []));
      static fromBinary(e, t) {
          return (new al).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new al).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new al).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(al, e, t)
      }
  }
  class il extends d {
      clusterSearchId = "";
      exactSearchId = "";
      searchResultIds = [];
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.language_server_pb.RecordSearchResultsViewRequest";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "metadata",
          kind: "message",
          T: on
      }, {
          no: 2,
          name: "cluster_search_id",
          kind: "scalar",
          T: 9
      }, {
          no: 3,
          name: "exact_search_id",
          kind: "scalar",
          T: 9
      }, {
          no: 4,
          name: "search_result_ids",
          kind: "scalar",
          T: 9,
          repeated: !0
      }]));
      static fromBinary(e, t) {
          return (new il).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new il).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new il).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(il, e, t)
      }
  }
  class sl extends d {
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.language_server_pb.RecordSearchResultsViewResponse";
      static fields = Le.util.newFieldList(( () => []));
      static fromBinary(e, t) {
          return (new sl).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new sl).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new sl).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(sl, e, t)
      }
  }
  class ol extends (null) {
      constructor(e) {
          super(),
          proto3.util.initPartial(e, this)
      }
      static runtime = null;
      static typeName = null;
      static fields = Le.util.newFieldList(( () => []));
      static fromBinary(e, t) {
          return (new ol).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new ol).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new ol).fromJsonString(e, t)
      }
      static equals(e, t) {
          return proto3.util.equals(ol, e, t)
      }
  }
  class ml extends (null) {
      activeWorkspaces = [];
      ignoredWorkspaces = [];
      constructor(e) {
          super(),
          proto3.util.initPartial(e, this)
      }
      static runtime = null;
      static typeName = null;
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "active_workspaces",
          kind: "scalar",
          T: 9,
          repeated: !0
      }, {
          no: 2,
          name: "ignored_workspaces",
          kind: "scalar",
          T: 9,
          repeated: !0
      }]));
      static fromBinary(e, t) {
          return (new ml).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new ml).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new ml).fromJsonString(e, t)
      }
      static equals(e, t) {
          return proto3.util.equals(ml, e, t)
      }
  }
  class cl extends d {
      openDocumentFilepathsMigrateMeToUri = [];
      openDocumentUris = [];
      otherDocuments = [];
      workspacePathsMigrateMeToUri = [];
      workspaceUris = [];
      blocking = !1;
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.language_server_pb.RefreshContextForIdeActionRequest";
      static fields = Le.util.newFieldList(( () => [{
          no: 8,
          name: "metadata",
          kind: "message",
          T: on
      }, {
          no: 9,
          name: "experiment_config",
          kind: "message",
          T: Mt
      }, {
          no: 1,
          name: "active_document",
          kind: "message",
          T: dr
      }, {
          no: 2,
          name: "open_document_filepaths_migrate_me_to_uri",
          kind: "scalar",
          T: 9,
          repeated: !0
      }, {
          no: 6,
          name: "open_document_uris",
          kind: "scalar",
          T: 9,
          repeated: !0
      }, {
          no: 5,
          name: "other_documents",
          kind: "message",
          T: dr,
          repeated: !0
      }, {
          no: 3,
          name: "workspace_paths_migrate_me_to_uri",
          kind: "scalar",
          T: 9,
          repeated: !0
      }, {
          no: 7,
          name: "workspace_uris",
          kind: "scalar",
          T: 9,
          repeated: !0
      }, {
          no: 4,
          name: "blocking",
          kind: "scalar",
          T: 8
      }]));
      static fromBinary(e, t) {
          return (new cl).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new cl).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new cl).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(cl, e, t)
      }
  }
  class ul extends d {
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.language_server_pb.RefreshContextForIdeActionResponse";
      static fields = Le.util.newFieldList(( () => []));
      static fromBinary(e, t) {
          return (new ul).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new ul).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new ul).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(ul, e, t)
      }
  }
  class ll extends d {
      query = "";
      fuzzyMatch = !1;
      allowedTypes = [];
      maxItems = 0;
      caseInsensitive = !1;
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.language_server_pb.GetMatchingCodeContextRequest";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "query",
          kind: "scalar",
          T: 9
      }, {
          no: 2,
          name: "fuzzy_match",
          kind: "scalar",
          T: 8
      }, {
          no: 3,
          name: "allowed_types",
          kind: "enum",
          T: Le.getEnumType(st),
          repeated: !0
      }, {
          no: 4,
          name: "max_items",
          kind: "scalar",
          T: 5
      }, {
          no: 5,
          name: "case_insensitive",
          kind: "scalar",
          T: 8
      }]));
      static fromBinary(e, t) {
          return (new ll).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new ll).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new ll).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(ll, e, t)
      }
  }
  class _l extends d {
      matchedItems = [];
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.language_server_pb.GetMatchingCodeContextResponse";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "matched_items",
          kind: "message",
          T: On,
          repeated: !0
      }]));
      static fromBinary(e, t) {
          return (new _l).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new _l).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new _l).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(_l, e, t)
      }
  }
  class dl extends d {
      query = "";
      fuzzyMatch = !1;
      maxItems = 0;
      caseInsensitive = !1;
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.language_server_pb.GetMatchingIndexedReposRequest";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "metadata",
          kind: "message",
          T: on
      }, {
          no: 2,
          name: "query",
          kind: "scalar",
          T: 9
      }, {
          no: 3,
          name: "fuzzy_match",
          kind: "scalar",
          T: 8
      }, {
          no: 4,
          name: "max_items",
          kind: "scalar",
          T: 5
      }, {
          no: 5,
          name: "case_insensitive",
          kind: "scalar",
          T: 8
      }]));
      static fromBinary(e, t) {
          return (new dl).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new dl).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new dl).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(dl, e, t)
      }
  }
  class El extends d {
      matchedRepositories = [];
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.language_server_pb.GetMatchingIndexedReposResponse";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "matched_repositories",
          kind: "message",
          T: Cn,
          repeated: !0
      }]));
      static fromBinary(e, t) {
          return (new El).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new El).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new El).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(El, e, t)
      }
  }
  class Tl extends d {
      numTokensInIntent = 0;
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.language_server_pb.GetChatMessageResponse";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "chat_message",
          kind: "message",
          T: fi
      }, {
          no: 2,
          name: "num_tokens_in_intent",
          kind: "scalar",
          T: 13
      }]));
      static fromBinary(e, t) {
          return (new Tl).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new Tl).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new Tl).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(Tl, e, t)
      }
  }
  class fl extends d {
      chatMessage = "";
      requestedModelId = Fe.MODEL_UNSPECIFIED;
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.language_server_pb.GetMessageTokenCountRequest";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "chat_message",
          kind: "scalar",
          T: 9
      }, {
          no: 2,
          name: "requested_model_id",
          kind: "enum",
          T: Le.getEnumType(Fe)
      }]));
      static fromBinary(e, t) {
          return (new fl).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new fl).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new fl).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(fl, e, t)
      }
  }
  class pl extends d {
      tokenCount = 0;
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.language_server_pb.GetMessageTokenCountResponse";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "token_count",
          kind: "scalar",
          T: 13
      }]));
      static fromBinary(e, t) {
          return (new pl).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new pl).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new pl).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(pl, e, t)
      }
  }
  class Sl extends d {
      messageId = "";
      feedback = aa.FEEDBACK_TYPE_UNSPECIFIED;
      reason = "";
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.language_server_pb.RecordChatFeedbackRequest";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "metadata",
          kind: "message",
          T: on
      }, {
          no: 2,
          name: "message_id",
          kind: "scalar",
          T: 9
      }, {
          no: 3,
          name: "feedback",
          kind: "enum",
          T: Le.getEnumType(aa)
      }, {
          no: 4,
          name: "reason",
          kind: "scalar",
          T: 9
      }, {
          no: 5,
          name: "timestamp",
          kind: "message",
          T: Je
      }]));
      static fromBinary(e, t) {
          return (new Sl).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new Sl).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new Sl).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(Sl, e, t)
      }
  }
  class Nl extends d {
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.language_server_pb.RecordChatFeedbackResponse";
      static fields = Le.util.newFieldList(( () => []));
      static fromBinary(e, t) {
          return (new Nl).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new Nl).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new Nl).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(Nl, e, t)
      }
  }
  class gl extends d {
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.language_server_pb.RecordChatPanelSessionRequest";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "metadata",
          kind: "message",
          T: on
      }, {
          no: 2,
          name: "start_timestamp",
          kind: "message",
          T: Je
      }, {
          no: 3,
          name: "end_timestamp",
          kind: "message",
          T: Je
      }]));
      static fromBinary(e, t) {
          return (new gl).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new gl).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new gl).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(gl, e, t)
      }
  }
  class Il extends d {
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.language_server_pb.RecordChatPanelSessionResponse";
      static fields = Le.util.newFieldList(( () => []));
      static fromBinary(e, t) {
          return (new Il).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new Il).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new Il).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(Il, e, t)
      }
  }
  class Cl extends d {
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.language_server_pb.GetChatExperimentsRequest";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "metadata",
          kind: "message",
          T: on
      }]));
      static fromBinary(e, t) {
          return (new Cl).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new Cl).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new Cl).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(Cl, e, t)
      }
  }
  class Ol extends d {
      experiments = [];
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.language_server_pb.GetChatExperimentsResponse";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "experiments",
          kind: "message",
          T: wi,
          repeated: !0
      }]));
      static fromBinary(e, t) {
          return (new Ol).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new Ol).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new Ol).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(Ol, e, t)
      }
  }
  class yl extends d {
      timeZone = "";
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.language_server_pb.GetUserAnalyticsSummaryRequest";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "metadata",
          kind: "message",
          T: on
      }, {
          no: 2,
          name: "time_zone",
          kind: "scalar",
          T: 9
      }, {
          no: 3,
          name: "start_timestamp",
          kind: "message",
          T: Je
      }, {
          no: 4,
          name: "end_timestamp",
          kind: "message",
          T: Je
      }]));
      static fromBinary(e, t) {
          return (new yl).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new yl).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new yl).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(yl, e, t)
      }
  }
  class wl extends d {
      completionsByDay = [];
      completionsByLanguage = [];
      chatsByModel = [];
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.language_server_pb.GetUserAnalyticsSummaryResponse";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "completion_statistics",
          kind: "message",
          T: Ln
      }, {
          no: 2,
          name: "completions_by_day",
          kind: "message",
          T: Rn,
          repeated: !0
      }, {
          no: 3,
          name: "completions_by_language",
          kind: "message",
          T: kn,
          repeated: !0
      }, {
          no: 4,
          name: "chats_by_model",
          kind: "message",
          T: hn,
          repeated: !0
      }]));
      static fromBinary(e, t) {
          return (new wl).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new wl).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new wl).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(wl, e, t)
      }
  }
  class Al extends d {
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.language_server_pb.GetUserStatusRequest";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "metadata",
          kind: "message",
          T: on
      }]));
      static fromBinary(e, t) {
          return (new Al).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new Al).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new Al).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(Al, e, t)
      }
  }
  class Pl extends d {
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.language_server_pb.GetUserStatusResponse";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "user_status",
          kind: "message",
          T: In
      }, {
          no: 2,
          name: "plan_info",
          kind: "message",
          T: gn
      }]));
      static fromBinary(e, t) {
          return (new Pl).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new Pl).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new Pl).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(Pl, e, t)
      }
  }
  class Ll extends d {
      apiKey = "";
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.language_server_pb.GetProfileDataRequest";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "api_key",
          kind: "scalar",
          T: 9
      }]));
      static fromBinary(e, t) {
          return (new Ll).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new Ll).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new Ll).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(Ll, e, t)
      }
  }
  class Rl extends d {
      profilePictureUrl = "";
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.language_server_pb.GetProfileDataResponse";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "profile_picture_url",
          kind: "scalar",
          T: 9
      }]));
      static fromBinary(e, t) {
          return (new Rl).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new Rl).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new Rl).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(Rl, e, t)
      }
  }
  class kl extends d {
      promptId = "";
      code = "";
      timeoutSec = y.zero;
      completionText = "";
      providerSource = he.UNSPECIFIED;
      completionId = "";
      diagnosticSeverity = "";
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.language_server_pb.CaptureCodeRequest";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "metadata",
          kind: "message",
          T: on
      }, {
          no: 2,
          name: "prompt_id",
          kind: "scalar",
          T: 9
      }, {
          no: 3,
          name: "code",
          kind: "scalar",
          T: 9
      }, {
          no: 4,
          name: "timeout_sec",
          kind: "scalar",
          T: 4
      }, {
          no: 5,
          name: "completion_text",
          kind: "scalar",
          T: 9
      }, {
          no: 6,
          name: "provider_source",
          kind: "enum",
          T: Le.getEnumType(he)
      }, {
          no: 7,
          name: "completion_id",
          kind: "scalar",
          T: 9
      }, {
          no: 8,
          name: "diagnostic_severity",
          kind: "scalar",
          T: 9
      }]));
      static fromBinary(e, t) {
          return (new kl).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new kl).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new kl).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(kl, e, t)
      }
  }
  class Jl extends d {
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.language_server_pb.CaptureCodeResponse";
      static fields = Le.util.newFieldList(( () => []));
      static fromBinary(e, t) {
          return (new Jl).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new Jl).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new Jl).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(Jl, e, t)
      }
  }
  class Dl extends d {
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.language_server_pb.CaptureFileRequest";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "data",
          kind: "message",
          T: Pn
      }, {
          no: 2,
          name: "experiment_config",
          kind: "message",
          T: Mt
      }]));
      static fromBinary(e, t) {
          return (new Dl).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new Dl).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new Dl).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(Dl, e, t)
      }
  }
  class hl extends d {
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.language_server_pb.CaptureFileResponse";
      static fields = Le.util.newFieldList(( () => []));
      static fromBinary(e, t) {
          return (new hl).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new hl).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new hl).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(hl, e, t)
      }
  }
  class xl extends d {
      version = "";
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.language_server_pb.GetChangelogRequest";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "version",
          kind: "scalar",
          T: 9
      }]));
      static fromBinary(e, t) {
          return (new xl).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new xl).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new xl).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(xl, e, t)
      }
  }
  class Ul extends d {
      path = "";
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.language_server_pb.GetChangelogResponse";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "path",
          kind: "scalar",
          T: 9
      }]));
      static fromBinary(e, t) {
          return (new Ul).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new Ul).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new Ul).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(Ul, e, t)
      }
  }
  class Ml extends d {
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.language_server_pb.GetFunctionsRequest";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "document",
          kind: "message",
          T: dr
      }]));
      static fromBinary(e, t) {
          return (new Ml).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new Ml).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new Ml).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(Ml, e, t)
      }
  }
  class Bl extends d {
      functionCaptures = [];
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.language_server_pb.GetFunctionsResponse";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "function_captures",
          kind: "message",
          T: Sn,
          repeated: !0
      }]));
      static fromBinary(e, t) {
          return (new Bl).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new Bl).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new Bl).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(Bl, e, t)
      }
  }
  class Fl extends d {
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.language_server_pb.GetClassInfosRequest";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "document",
          kind: "message",
          T: dr
      }]));
      static fromBinary(e, t) {
          return (new Fl).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new Fl).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new Fl).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(Fl, e, t)
      }
  }
  class bl extends d {
      classCaptures = [];
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.language_server_pb.GetClassInfosResponse";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "class_captures",
          kind: "message",
          T: Nn,
          repeated: !0
      }]));
      static fromBinary(e, t) {
          return (new bl).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new bl).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new bl).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(bl, e, t)
      }
  }
  class ql extends d {
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.language_server_pb.ExitRequest";
      static fields = Le.util.newFieldList(( () => []));
      static fromBinary(e, t) {
          return (new ql).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new ql).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new ql).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(ql, e, t)
      }
  }
  class Gl extends d {
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.language_server_pb.ExitResponse";
      static fields = Le.util.newFieldList(( () => []));
      static fromBinary(e, t) {
          return (new Gl).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new Gl).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new Gl).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(Gl, e, t)
      }
  }
  class vl extends d {
      state = xa.UNSPECIFIED;
      message = "";
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.language_server_pb.State";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "state",
          kind: "enum",
          T: Le.getEnumType(xa)
      }, {
          no: 2,
          name: "message",
          kind: "scalar",
          T: 9
      }]));
      static fromBinary(e, t) {
          return (new vl).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new vl).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new vl).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(vl, e, t)
      }
  }
  class Hl extends d {
      promptId = "";
      typingAsSuggestedPromptSuffix = "";
      completionType = $e.UNSPECIFIED;
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.language_server_pb.RequestInfo";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "prompt_id",
          kind: "scalar",
          T: 9
      }, {
          no: 4,
          name: "completions_request",
          kind: "message",
          T: kt
      }, {
          no: 5,
          name: "typing_as_suggested_prompt_suffix",
          kind: "scalar",
          T: 9
      }, {
          no: 6,
          name: "completion_type",
          kind: "enum",
          T: Le.getEnumType($e)
      }]));
      static fromBinary(e, t) {
          return (new Hl).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new Hl).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new Hl).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(Hl, e, t)
      }
  }
  class Vl extends d {
      clientLatencyMs = y.zero;
      promptLatencyMs = y.zero;
      promptStageLatencies = [];
      debounceLatencyMs = y.zero;
      rpcLatencyMs = y.zero;
      networkLatencyMs = y.zero;
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.language_server_pb.LatencyInfo";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "client_latency_ms",
          kind: "scalar",
          T: 4
      }, {
          no: 2,
          name: "prompt_latency_ms",
          kind: "scalar",
          T: 4
      }, {
          no: 3,
          name: "prompt_stage_latencies",
          kind: "message",
          T: Vt,
          repeated: !0
      }, {
          no: 4,
          name: "debounce_latency_ms",
          kind: "scalar",
          T: 4
      }, {
          no: 5,
          name: "rpc_latency_ms",
          kind: "scalar",
          T: 4
      }, {
          no: 6,
          name: "network_latency_ms",
          kind: "scalar",
          T: 4
      }]));
      static fromBinary(e, t) {
          return (new Vl).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new Vl).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new Vl).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(Vl, e, t)
      }
  }
  class Xl extends d {
      text = "";
      deltaCursorOffset = y.zero;
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.language_server_pb.Suffix";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "text",
          kind: "scalar",
          T: 9
      }, {
          no: 2,
          name: "delta_cursor_offset",
          kind: "scalar",
          T: 3
      }]));
      static fromBinary(e, t) {
          return (new Xl).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new Xl).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new Xl).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(Xl, e, t)
      }
  }
  class Yl extends d {
      text = "";
      offset = y.zero;
      type = Ua.UNSPECIFIED;
      prefix = "";
      line = y.zero;
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.language_server_pb.CompletionPart";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "text",
          kind: "scalar",
          T: 9
      }, {
          no: 2,
          name: "offset",
          kind: "scalar",
          T: 4
      }, {
          no: 3,
          name: "type",
          kind: "enum",
          T: Le.getEnumType(Ua)
      }, {
          no: 4,
          name: "prefix",
          kind: "scalar",
          T: 9
      }, {
          no: 5,
          name: "line",
          kind: "scalar",
          T: 4
      }]));
      static fromBinary(e, t) {
          return (new Yl).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new Yl).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new Yl).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(Yl, e, t)
      }
  }
  class Kl extends d {
      source = je.UNSPECIFIED;
      completionParts = [];
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.language_server_pb.CompletionItem";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "completion",
          kind: "message",
          T: Yt
      }, {
          no: 5,
          name: "suffix",
          kind: "message",
          T: Xl
      }, {
          no: 2,
          name: "range",
          kind: "message",
          T: _r
      }, {
          no: 3,
          name: "source",
          kind: "enum",
          T: Le.getEnumType(je)
      }, {
          no: 8,
          name: "completion_parts",
          kind: "message",
          T: Yl,
          repeated: !0
      }]));
      static fromBinary(e, t) {
          return (new Kl).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new Kl).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new Kl).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(Kl, e, t)
      }
  }
  class Wl extends d {
      embeddingId = y.zero;
      absolutePathMigrateMeToUri = "";
      absoluteUri = "";
      workspacePaths = [];
      similarityScore = 0;
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.language_server_pb.SearchResult";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "embedding_id",
          kind: "scalar",
          T: 3
      }, {
          no: 2,
          name: "absolute_path_migrate_me_to_uri",
          kind: "scalar",
          T: 9
      }, {
          no: 7,
          name: "absolute_uri",
          kind: "scalar",
          T: 9
      }, {
          no: 3,
          name: "workspace_paths",
          kind: "message",
          T: _n,
          repeated: !0
      }, {
          no: 4,
          name: "embedding_metadata",
          kind: "message",
          T: dn
      }, {
          no: 5,
          name: "similarity_score",
          kind: "scalar",
          T: 2
      }, {
          no: 6,
          name: "code_context_item",
          kind: "message",
          T: On
      }]));
      static fromBinary(e, t) {
          return (new Wl).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new Wl).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new Wl).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(Wl, e, t)
      }
  }
  class zl extends d {
      searchResults = [];
      representativePath = "";
      description = "";
      meanSimilarityScore = 0;
      searchId = "";
      resultId = "";
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.language_server_pb.SearchResultCluster";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "search_results",
          kind: "message",
          T: Wl,
          repeated: !0
      }, {
          no: 2,
          name: "representative_path",
          kind: "scalar",
          T: 9
      }, {
          no: 3,
          name: "description",
          kind: "scalar",
          T: 9
      }, {
          no: 4,
          name: "mean_similarity_score",
          kind: "scalar",
          T: 2
      }, {
          no: 5,
          name: "search_id",
          kind: "scalar",
          T: 9
      }, {
          no: 6,
          name: "result_id",
          kind: "scalar",
          T: 9
      }]));
      static fromBinary(e, t) {
          return (new zl).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new zl).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new zl).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(zl, e, t)
      }
  }
  class jl extends d {
      progress = 0;
      text = "";
      hidden = !1;
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.language_server_pb.ProgressBar";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "progress",
          kind: "scalar",
          T: 2
      }, {
          no: 2,
          name: "text",
          kind: "scalar",
          T: 9
      }, {
          no: 3,
          name: "hidden",
          kind: "scalar",
          T: 8
      }, {
          no: 4,
          name: "remaining_time",
          kind: "message",
          T: De
      }]));
      static fromBinary(e, t) {
          return (new jl).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new jl).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new jl).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(jl, e, t)
      }
  }
  class $l extends (null) {
      pattern = "";
      isMultiline = !1;
      isRegExp = !1;
      isCaseSensitive = !1;
      isWordMatch = !1;
      constructor(e) {
          super(),
          proto3.util.initPartial(e, this)
      }
      static runtime = null;
      static typeName = null;
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "pattern",
          kind: "scalar",
          T: 9
      }, {
          no: 2,
          name: "is_multiline",
          kind: "scalar",
          T: 8
      }, {
          no: 3,
          name: "is_reg_exp",
          kind: "scalar",
          T: 8
      }, {
          no: 4,
          name: "is_case_sensitive",
          kind: "scalar",
          T: 8
      }, {
          no: 5,
          name: "is_word_match",
          kind: "scalar",
          T: 8
      }]));
      static fromBinary(e, t) {
          return (new $l).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new $l).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new $l).fromJsonString(e, t)
      }
      static equals(e, t) {
          return proto3.util.equals($l, e, t)
      }
  }
  class Ql extends (null) {
      folder = "";
      includes = [];
      excludes = [];
      disregardIgnoreFiles = !1;
      followSymlinks = !1;
      disregardGlobalIgnoreFiles = !1;
      disregardParentIgnoreFiles = !1;
      maxFileSize = 0;
      encoding = "";
      beforeContextLines = 0;
      afterContextLines = 0;
      maxResults = 0;
      constructor(e) {
          super(),
          proto3.util.initPartial(e, this)
      }
      static runtime = null;
      static typeName = null;
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "folder",
          kind: "scalar",
          T: 9
      }, {
          no: 2,
          name: "includes",
          kind: "scalar",
          T: 9,
          repeated: !0
      }, {
          no: 3,
          name: "excludes",
          kind: "scalar",
          T: 9,
          repeated: !0
      }, {
          no: 4,
          name: "disregard_ignore_files",
          kind: "scalar",
          T: 8
      }, {
          no: 5,
          name: "follow_symlinks",
          kind: "scalar",
          T: 8
      }, {
          no: 6,
          name: "disregard_global_ignore_files",
          kind: "scalar",
          T: 8
      }, {
          no: 7,
          name: "disregard_parent_ignore_files",
          kind: "scalar",
          T: 8
      }, {
          no: 8,
          name: "max_file_size",
          kind: "scalar",
          T: 13
      }, {
          no: 9,
          name: "encoding",
          kind: "scalar",
          T: 9
      }, {
          no: 10,
          name: "before_context_lines",
          kind: "scalar",
          T: 13
      }, {
          no: 11,
          name: "after_context_lines",
          kind: "scalar",
          T: 13
      }, {
          no: 12,
          name: "max_results",
          kind: "scalar",
          T: 13
      }, {
          no: 13,
          name: "preview_options",
          kind: "message",
          T: Zl
      }]));
      static fromBinary(e, t) {
          return (new Ql).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new Ql).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new Ql).fromJsonString(e, t)
      }
      static equals(e, t) {
          return proto3.util.equals(Ql, e, t)
      }
  }
  class Zl extends d {
      matchLines = 0;
      charsPerLine = 0;
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.language_server_pb.ExactSearchPreviewOptions";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "match_lines",
          kind: "scalar",
          T: 13
      }, {
          no: 2,
          name: "chars_per_line",
          kind: "scalar",
          T: 13
      }]));
      static fromBinary(e, t) {
          return (new Zl).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new Zl).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new Zl).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(Zl, e, t)
      }
  }
  class e_ extends (null) {
      absolutePath = "";
      relativePath = "";
      ranges = [];
      resultId = "";
      constructor(e) {
          super(),
          proto3.util.initPartial(e, this)
      }
      static runtime = null;
      static typeName = null;
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "absolute_path",
          kind: "scalar",
          T: 9
      }, {
          no: 4,
          name: "relative_path",
          kind: "scalar",
          T: 9
      }, {
          no: 2,
          name: "ranges",
          kind: "message",
          T: _r,
          repeated: !0
      }, {
          no: 3,
          name: "preview",
          kind: "message",
          T: t_
      }, {
          no: 5,
          name: "result_id",
          kind: "scalar",
          T: 9
      }]));
      static fromBinary(e, t) {
          return (new e_).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new e_).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new e_).fromJsonString(e, t)
      }
      static equals(e, t) {
          return proto3.util.equals(e_, e, t)
      }
  }
  class t_ extends d {
      text = "";
      ranges = [];
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.language_server_pb.ExactSearchMatchPreview";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "text",
          kind: "scalar",
          T: 9
      }, {
          no: 2,
          name: "ranges",
          kind: "message",
          T: _r,
          repeated: !0
      }]));
      static fromBinary(e, t) {
          return (new t_).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new t_).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new t_).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(t_, e, t)
      }
  }
  class n_ extends d {
      workspace = "";
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.language_server_pb.AddTrackedWorkspaceRequest";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "workspace",
          kind: "scalar",
          T: 9
      }]));
      static fromBinary(e, t) {
          return (new n_).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new n_).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new n_).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(n_, e, t)
      }
  }
  class r_ extends d {
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.language_server_pb.AddTrackedWorkspaceResponse";
      static fields = Le.util.newFieldList(( () => []));
      static fromBinary(e, t) {
          return (new r_).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new r_).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new r_).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(r_, e, t)
      }
  }
  class a_ extends d {
      workspace = "";
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.language_server_pb.RemoveTrackedWorkspaceRequest";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "workspace",
          kind: "scalar",
          T: 9
      }]));
      static fromBinary(e, t) {
          return (new a_).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new a_).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new a_).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(a_, e, t)
      }
  }
  class i_ extends d {
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.language_server_pb.RemoveTrackedWorkspaceResponse";
      static fields = Le.util.newFieldList(( () => []));
      static fromBinary(e, t) {
          return (new i_).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new i_).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new i_).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(i_, e, t)
      }
  }
  class s_ extends d {
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.language_server_pb.GetWorkspaceEditStateRequest";
      static fields = Le.util.newFieldList(( () => []));
      static fromBinary(e, t) {
          return (new s_).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new s_).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new s_).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(s_, e, t)
      }
  }
  class o_ extends d {
      repoRoot = "";
      numAdditions = y.zero;
      numDeletions = y.zero;
      edits = [];
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.language_server_pb.WorkspaceEditState";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "repo_root",
          kind: "scalar",
          T: 9
      }, {
          no: 2,
          name: "num_additions",
          kind: "scalar",
          T: 4
      }, {
          no: 3,
          name: "num_deletions",
          kind: "scalar",
          T: 4
      }, {
          no: 4,
          name: "edits",
          kind: "message",
          T: qm,
          repeated: !0
      }]));
      static fromBinary(e, t) {
          return (new o_).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new o_).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new o_).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(o_, e, t)
      }
  }
  class m_ extends d {
      workspaceEdits = [];
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.language_server_pb.GetWorkspaceEditStateResponse";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "workspace_edits",
          kind: "message",
          T: o_,
          repeated: !0
      }]));
      static fromBinary(e, t) {
          return (new m_).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new m_).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new m_).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(m_, e, t)
      }
  }
  class c_ extends d {
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.language_server_pb.GetWorkspaceInfosRequest";
      static fields = Le.util.newFieldList(( () => []));
      static fromBinary(e, t) {
          return (new c_).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new c_).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new c_).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(c_, e, t)
      }
  }
  class u_ extends d {
      workspaceUri = "";
      gitRootUri = "";
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.language_server_pb.WorkspaceInfo";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "workspace_uri",
          kind: "scalar",
          T: 9
      }, {
          no: 2,
          name: "git_root_uri",
          kind: "scalar",
          T: 9
      }]));
      static fromBinary(e, t) {
          return (new u_).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new u_).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new u_).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(u_, e, t)
      }
  }
  class l_ extends d {
      homeDirPath = "";
      workspaceInfos = [];
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.language_server_pb.GetWorkspaceInfosResponse";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "home_dir_path",
          kind: "scalar",
          T: 9
      }, {
          no: 2,
          name: "workspace_infos",
          kind: "message",
          T: u_,
          repeated: !0
      }]));
      static fromBinary(e, t) {
          return (new l_).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new l_).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new l_).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(l_, e, t)
      }
  }
  class __ extends d {
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.language_server_pb.GenerateCommitMessageRequest";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "metadata",
          kind: "message",
          T: on
      }]));
      static fromBinary(e, t) {
          return (new __).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new __).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new __).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(__, e, t)
      }
  }
  class d_ extends d {
      repoRoot = "";
      commitMessageSummary = "";
      commitMessageDescription = "";
      changedFilesMigrateMeToUri = [];
      changedFileUris = [];
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.language_server_pb.CommitMessageData";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "repo_root",
          kind: "scalar",
          T: 9
      }, {
          no: 2,
          name: "commit_message_summary",
          kind: "scalar",
          T: 9
      }, {
          no: 3,
          name: "commit_message_description",
          kind: "scalar",
          T: 9
      }, {
          no: 4,
          name: "changed_files_migrate_me_to_uri",
          kind: "scalar",
          T: 9,
          repeated: !0
      }, {
          no: 5,
          name: "changed_file_uris",
          kind: "scalar",
          T: 9,
          repeated: !0
      }]));
      static fromBinary(e, t) {
          return (new d_).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new d_).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new d_).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(d_, e, t)
      }
  }
  class E_ extends d {
      commitMessages = [];
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.language_server_pb.GenerateCommitMessageResponse";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "commit_messages",
          kind: "message",
          T: d_,
          repeated: !0
      }]));
      static fromBinary(e, t) {
          return (new E_).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new E_).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new E_).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(E_, e, t)
      }
  }
  class T_ extends d {
      repoRoot = "";
      branchName = "";
      commitHash = "";
      commitMessage = "";
      parentCommitHash = "";
      authorName = "";
      authorEmail = "";
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.language_server_pb.RecordCommitMessageSaveRequest";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "metadata",
          kind: "message",
          T: on
      }, {
          no: 2,
          name: "repo_root",
          kind: "scalar",
          T: 9
      }, {
          no: 3,
          name: "branch_name",
          kind: "scalar",
          T: 9
      }, {
          no: 4,
          name: "commit_hash",
          kind: "scalar",
          T: 9
      }, {
          no: 5,
          name: "commit_message",
          kind: "scalar",
          T: 9
      }, {
          no: 6,
          name: "commit_timestamp",
          kind: "message",
          T: Je
      }, {
          no: 7,
          name: "parent_commit_hash",
          kind: "scalar",
          T: 9
      }, {
          no: 8,
          name: "author_name",
          kind: "scalar",
          T: 9
      }, {
          no: 9,
          name: "author_email",
          kind: "scalar",
          T: 9
      }]));
      static fromBinary(e, t) {
          return (new T_).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new T_).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new T_).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(T_, e, t)
      }
  }
  class f_ extends d {
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.language_server_pb.RecordCommitMessageSaveResponse";
      static fields = Le.util.newFieldList(( () => []));
      static fromBinary(e, t) {
          return (new f_).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new f_).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new f_).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(f_, e, t)
      }
  }
  class p_ extends d {
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.language_server_pb.GetUserSettingsRequest";
      static fields = Le.util.newFieldList(( () => []));
      static fromBinary(e, t) {
          return (new p_).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new p_).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new p_).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(p_, e, t)
      }
  }
  class S_ extends d {
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.language_server_pb.GetUserSettingsResponse";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "user_settings",
          kind: "message",
          T: Fn
      }]));
      static fromBinary(e, t) {
          return (new S_).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new S_).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new S_).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(S_, e, t)
      }
  }
  class N_ extends d {
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.language_server_pb.SetUserSettingsRequest";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "user_settings",
          kind: "message",
          T: Fn
      }]));
      static fromBinary(e, t) {
          return (new N_).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new N_).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new N_).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(N_, e, t)
      }
  }
  class g_ extends d {
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.language_server_pb.SetUserSettingsResponse";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "user_settings",
          kind: "message",
          T: Fn
      }]));
      static fromBinary(e, t) {
          return (new g_).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new g_).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new g_).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(g_, e, t)
      }
  }
  class I_ extends d {
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.language_server_pb.GetDebugDiagnosticsRequest";
      static fields = Le.util.newFieldList(( () => []));
      static fromBinary(e, t) {
          return (new I_).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new I_).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new I_).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(I_, e, t)
      }
  }
  class C_ extends d {
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.language_server_pb.GetDebugDiagnosticsResponse";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "language_server_diagnostics",
          kind: "message",
          T: Cr
      }]));
      static fromBinary(e, t) {
          return (new C_).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new C_).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new C_).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(C_, e, t)
      }
  }
  class O_ extends d {
      source = gt.UNSPECIFIED;
      startOffset = y.zero;
      endOffset = y.zero;
      modified = !1;
      completionId = "";
      completionType = $e.UNSPECIFIED;
      providerSource = he.UNSPECIFIED;
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.language_server_pb.CodeRange";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "source",
          kind: "enum",
          T: Le.getEnumType(gt)
      }, {
          no: 2,
          name: "start_offset",
          kind: "scalar",
          T: 4
      }, {
          no: 3,
          name: "end_offset",
          kind: "scalar",
          T: 4
      }, {
          no: 4,
          name: "modified",
          kind: "scalar",
          T: 8
      }, {
          no: 5,
          name: "completion_id",
          kind: "scalar",
          T: 9
      }, {
          no: 6,
          name: "completion_type",
          kind: "enum",
          T: Le.getEnumType($e)
      }, {
          no: 7,
          name: "provider_source",
          kind: "enum",
          T: Le.getEnumType(he)
      }]));
      static fromBinary(e, t) {
          return (new O_).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new O_).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new O_).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(O_, e, t)
      }
  }
  class y_ extends (null) {
      absolutePathMigrateMeToUri = "";
      absoluteUri = "";
      text = "";
      ranges = [];
      commit = "";
      repoRootMigrateMeToUri = "";
      repoRootUri = "";
      constructor(e) {
          super(),
          proto3.util.initPartial(e, this)
      }
      static runtime = null;
      static typeName = null;
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "absolute_path_migrate_me_to_uri",
          kind: "scalar",
          T: 9
      }, {
          no: 6,
          name: "absolute_uri",
          kind: "scalar",
          T: 9
      }, {
          no: 2,
          name: "text",
          kind: "scalar",
          T: 9
      }, {
          no: 3,
          name: "ranges",
          kind: "message",
          T: O_,
          repeated: !0
      }, {
          no: 4,
          name: "commit",
          kind: "scalar",
          T: 9
      }, {
          no: 5,
          name: "repo_root_migrate_me_to_uri",
          kind: "scalar",
          T: 9
      }, {
          no: 7,
          name: "repo_root_uri",
          kind: "scalar",
          T: 9
      }]));
      static fromBinary(e, t) {
          return (new y_).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new y_).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new y_).fromJsonString(e, t)
      }
      static equals(e, t) {
          return proto3.util.equals(y_, e, t)
      }
  }
  class w_ extends d {
      suggestionSources = [];
      query = "";
      autoExpandFileLimit = y.zero;
      maxItems = y.zero;
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.language_server_pb.GetSuggestedContextScopeItemsRequest";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "metadata",
          kind: "message",
          T: on
      }, {
          no: 2,
          name: "suggestion_sources",
          kind: "enum",
          T: Le.getEnumType(Ma),
          repeated: !0
      }, {
          no: 3,
          name: "query",
          kind: "scalar",
          T: 9
      }, {
          no: 4,
          name: "auto_expand_file_limit",
          kind: "scalar",
          T: 4
      }, {
          no: 5,
          name: "max_items",
          kind: "scalar",
          T: 4
      }]));
      static fromBinary(e, t) {
          return (new w_).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new w_).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new w_).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(w_, e, t)
      }
  }
  class A_ extends d {
      items = [];
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.language_server_pb.GetSuggestedContextScopeItemsResponse";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "items",
          kind: "message",
          T: Zn,
          repeated: !0
      }]));
      static fromBinary(e, t) {
          return (new A_).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new A_).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new A_).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(A_, e, t)
      }
  }
  class P_ extends d {
      allowedTypes = [];
      allowedContextTypes = [];
      query = "";
      fuzzyMatch = !1;
      maxItems = 0;
      caseInsensitive = !1;
      repoFilter = "";
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.language_server_pb.GetMatchingContextScopeItemsRequest";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "metadata",
          kind: "message",
          T: on
      }, {
          no: 2,
          name: "allowed_types",
          kind: "enum",
          T: Le.getEnumType(It),
          repeated: !0
      }, {
          no: 7,
          name: "allowed_context_types",
          kind: "enum",
          T: Le.getEnumType(st),
          repeated: !0
      }, {
          no: 3,
          name: "query",
          kind: "scalar",
          T: 9
      }, {
          no: 4,
          name: "fuzzy_match",
          kind: "scalar",
          T: 8
      }, {
          no: 5,
          name: "max_items",
          kind: "scalar",
          T: 5
      }, {
          no: 6,
          name: "case_insensitive",
          kind: "scalar",
          T: 8
      }, {
          no: 8,
          name: "repo_filter",
          kind: "scalar",
          T: 9
      }]));
      static fromBinary(e, t) {
          return (new P_).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new P_).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new P_).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(P_, e, t)
      }
  }
  class L_ extends d {
      items = [];
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.language_server_pb.GetMatchingContextScopeItemsResponse";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "items",
          kind: "message",
          T: Zn,
          repeated: !0
      }]));
      static fromBinary(e, t) {
          return (new L_).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new L_).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new L_).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(L_, e, t)
      }
  }
  class R_ extends d {
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.language_server_pb.ContextStatus";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "active_document",
          kind: "message",
          T: dr
      }, {
          no: 2,
          name: "last_active_code_context_item",
          kind: "message",
          T: On
      }, {
          no: 3,
          name: "pinned_scope",
          kind: "message",
          T: er
      }, {
          no: 4,
          name: "pinned_guideline",
          kind: "message",
          T: rr
      }, {
          no: 5,
          name: "default_pinned_scope",
          kind: "message",
          T: er
      }]));
      static fromBinary(e, t) {
          return (new R_).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new R_).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new R_).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(R_, e, t)
      }
  }
  class k_ extends d {
      workspaceFolder = "";
      gitRoot = "";
      repoName = "";
      indexProgress = {};
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.language_server_pb.LocalIndexStatus";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "workspace_folder",
          kind: "scalar",
          T: 9
      }, {
          no: 2,
          name: "git_root",
          kind: "scalar",
          T: 9
      }, {
          no: 3,
          name: "repo_name",
          kind: "scalar",
          T: 9
      }, {
          no: 4,
          name: "remote_repo",
          kind: "message",
          T: Cn
      }, {
          no: 5,
          name: "index_stats",
          kind: "message",
          T: eo
      }, {
          no: 7,
          name: "workspace_stats",
          kind: "message",
          T: fn
      }, {
          no: 8,
          name: "partial_index_metadata",
          kind: "message",
          T: pn
      }, {
          no: 6,
          name: "index_progress",
          kind: "map",
          K: 9,
          V: {
              kind: "message",
              T: jl
          }
      }]));
      static fromBinary(e, t) {
          return (new k_).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new k_).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new k_).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(k_, e, t)
      }
  }
  class J_ extends d {
      localIndexes = [];
      ignoredLocalWorkspaces = [];
      localFilesIndexCapacity = 0;
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.language_server_pb.IndexStatus";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "local_indexes",
          kind: "message",
          T: k_,
          repeated: !0
      }, {
          no: 2,
          name: "ignored_local_workspaces",
          kind: "scalar",
          T: 9,
          repeated: !0
      }, {
          no: 3,
          name: "local_files_index_capacity",
          kind: "scalar",
          T: 13
      }]));
      static fromBinary(e, t) {
          return (new J_).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new J_).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new J_).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(J_, e, t)
      }
  }
  class D_ extends d {
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.language_server_pb.BrainStatus";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "context_status",
          kind: "message",
          T: R_
      }, {
          no: 2,
          name: "index_status",
          kind: "message",
          T: J_
      }]));
      static fromBinary(e, t) {
          return (new D_).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new D_).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new D_).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(D_, e, t)
      }
  }
  class h_ extends d {
      forceRefresh = !1;
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.language_server_pb.GetBrainStatusRequest";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "metadata",
          kind: "message",
          T: on
      }, {
          no: 2,
          name: "force_refresh",
          kind: "scalar",
          T: 8
      }]));
      static fromBinary(e, t) {
          return (new h_).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new h_).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new h_).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(h_, e, t)
      }
  }
  class x_ extends d {
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.language_server_pb.GetBrainStatusResponse";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "brain_status",
          kind: "message",
          T: D_
      }]));
      static fromBinary(e, t) {
          return (new x_).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new x_).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new x_).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(x_, e, t)
      }
  }
  class U_ extends d {
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.language_server_pb.SetPinnedGuidelineRequest";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "metadata",
          kind: "message",
          T: on
      }, {
          no: 2,
          name: "pinned_guideline",
          kind: "message",
          T: rr
      }]));
      static fromBinary(e, t) {
          return (new U_).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new U_).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new U_).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(U_, e, t)
      }
  }
  class M_ extends d {
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.language_server_pb.SetPinnedContextRequest";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "metadata",
          kind: "message",
          T: on
      }, {
          no: 2,
          name: "pinned_scope",
          kind: "message",
          T: er
      }]));
      static fromBinary(e, t) {
          return (new M_).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new M_).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new M_).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(M_, e, t)
      }
  }
  class B_ extends d {
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.language_server_pb.SetPinnedGuidelineResponse";
      static fields = Le.util.newFieldList(( () => []));
      static fromBinary(e, t) {
          return (new B_).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new B_).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new B_).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(B_, e, t)
      }
  }
  class F_ extends d {
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.language_server_pb.SetPinnedContextResponse";
      static fields = Le.util.newFieldList(( () => []));
      static fromBinary(e, t) {
          return (new F_).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new F_).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new F_).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(F_, e, t)
      }
  }
  class b_ extends d {
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.language_server_pb.SetupUniversitySandboxRequest";
      static fields = Le.util.newFieldList(( () => []));
      static fromBinary(e, t) {
          return (new b_).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new b_).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new b_).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(b_, e, t)
      }
  }
  class q_ extends d {
      baseDirectory = "";
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.language_server_pb.SetupUniversitySandboxResponse";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "base_directory",
          kind: "scalar",
          T: 9
      }]));
      static fromBinary(e, t) {
          return (new q_).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new q_).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new q_).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(q_, e, t)
      }
  }
  class G_ extends d {
      text = "";
      type = Ba.UNSPECIFIED;
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.language_server_pb.UnifiedDiffChange";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "text",
          kind: "scalar",
          T: 9
      }, {
          no: 2,
          name: "type",
          kind: "enum",
          T: Le.getEnumType(Ba)
      }]));
      static fromBinary(e, t) {
          return (new G_).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new G_).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new G_).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(G_, e, t)
      }
  }
  class v_ extends (null) {
      changes = [];
      constructor(e) {
          super(),
          proto3.util.initPartial(e, this)
      }
      static runtime = null;
      static typeName = null;
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "changes",
          kind: "message",
          T: G_,
          repeated: !0
      }]));
      static fromBinary(e, t) {
          return (new v_).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new v_).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new v_).fromJsonString(e, t)
      }
      static equals(e, t) {
          return proto3.util.equals(v_, e, t)
      }
  }
  class H_ extends d {
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.language_server_pb.RenderInsertionSideHintRequest";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "diff",
          kind: "message",
          T: Ha
      }, {
          no: 2,
          name: "config",
          kind: "message",
          T: X_
      }, {
          no: 3,
          name: "metadata",
          kind: "message",
          T: Y_
      }]));
      static fromBinary(e, t) {
          return (new H_).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new H_).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new H_).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(H_, e, t)
      }
  }
  class V_ extends d {
      data = "";
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.language_server_pb.RenderInsertionSideHintResponse";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "data",
          kind: "scalar",
          T: 9
      }, {
          no: 2,
          name: "display_options",
          kind: "message",
          T: K_
      }]));
      static fromBinary(e, t) {
          return (new V_).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new V_).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new V_).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(V_, e, t)
      }
  }
  class X_ extends d {
      fontFamily = "";
      themeName = "";
      lineHeight = 0;
      themeType = Fa.UNSPECIFIED;
      fontSize = 0;
      shortcut = "";
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.language_server_pb.RenderConfig";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "font_family",
          kind: "scalar",
          T: 9
      }, {
          no: 2,
          name: "theme_name",
          kind: "scalar",
          T: 9
      }, {
          no: 3,
          name: "line_height",
          kind: "scalar",
          T: 2
      }, {
          no: 4,
          name: "theme_type",
          kind: "enum",
          T: Le.getEnumType(Fa)
      }, {
          no: 5,
          name: "font_size",
          kind: "scalar",
          T: 2
      }, {
          no: 6,
          name: "theme",
          kind: "message",
          T: W_
      }, {
          no: 7,
          name: "shortcut",
          kind: "scalar",
          T: 9
      }]));
      static fromBinary(e, t) {
          return (new X_).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new X_).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new X_).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(X_, e, t)
      }
  }
  class Y_ extends d {
      language = "";
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.language_server_pb.RenderRequestMetadata";
      static fields = Le.util.newFieldList(( () => [{
          no: 6,
          name: "language",
          kind: "scalar",
          T: 9
      }]));
      static fromBinary(e, t) {
          return (new Y_).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new Y_).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new Y_).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(Y_, e, t)
      }
  }
  class K_ extends d {
      width = 0;
      height = 0;
      dpmm = 0;
      scale = 0;
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.language_server_pb.RenderedSideHintDisplayOptions";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "width",
          kind: "scalar",
          T: 5
      }, {
          no: 2,
          name: "height",
          kind: "scalar",
          T: 5
      }, {
          no: 3,
          name: "dpmm",
          kind: "scalar",
          T: 2
      }, {
          no: 4,
          name: "scale",
          kind: "scalar",
          T: 2
      }]));
      static fromBinary(e, t) {
          return (new K_).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new K_).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new K_).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(K_, e, t)
      }
  }
  class W_ extends d {
      background = "";
      text = "";
      whitespace = "";
      other = "";
      literal = "";
      literalString = "";
      number = "";
      operator = "";
      punctuation = "";
      generic = "";
      name = "";
      keyword = "";
      comment = "";
      error = "";
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.language_server_pb.CodeTheme";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "background",
          kind: "scalar",
          T: 9
      }, {
          no: 2,
          name: "text",
          kind: "scalar",
          T: 9
      }, {
          no: 3,
          name: "whitespace",
          kind: "scalar",
          T: 9
      }, {
          no: 4,
          name: "other",
          kind: "scalar",
          T: 9
      }, {
          no: 5,
          name: "literal",
          kind: "scalar",
          T: 9
      }, {
          no: 6,
          name: "literal_string",
          kind: "scalar",
          T: 9
      }, {
          no: 7,
          name: "number",
          kind: "scalar",
          T: 9
      }, {
          no: 8,
          name: "operator",
          kind: "scalar",
          T: 9
      }, {
          no: 9,
          name: "punctuation",
          kind: "scalar",
          T: 9
      }, {
          no: 10,
          name: "generic",
          kind: "scalar",
          T: 9
      }, {
          no: 11,
          name: "name",
          kind: "scalar",
          T: 9
      }, {
          no: 12,
          name: "keyword",
          kind: "scalar",
          T: 9
      }, {
          no: 13,
          name: "comment",
          kind: "scalar",
          T: 9
      }, {
          no: 14,
          name: "error",
          kind: "scalar",
          T: 9
      }]));
      static fromBinary(e, t) {
          return (new W_).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new W_).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new W_).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(W_, e, t)
      }
  }
  class z_ extends d {
      actionType = At.UNSPECIFIED;
      completed = !1;
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.language_server_pb.OnboardingItemState";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "action_type",
          kind: "enum",
          T: Le.getEnumType(At)
      }, {
          no: 2,
          name: "completed",
          kind: "scalar",
          T: 8
      }]));
      static fromBinary(e, t) {
          return (new z_).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new z_).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new z_).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(z_, e, t)
      }
  }
  class j_ extends (null) {
      hasSkipped = !1;
      items = [];
      constructor(e) {
          super(),
          proto3.util.initPartial(e, this)
      }
      static runtime = null;
      static typeName = null;
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "has_skipped",
          kind: "scalar",
          T: 8
      }, {
          no: 2,
          name: "items",
          kind: "message",
          T: z_,
          repeated: !0
      }]));
      static fromBinary(e, t) {
          return (new j_).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new j_).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new j_).fromJsonString(e, t)
      }
      static equals(e, t) {
          return proto3.util.equals(j_, e, t)
      }
  }
  class $_ extends d {
      clearHistory = !1;
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.language_server_pb.ResetOnboardingRequest";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "clear_history",
          kind: "scalar",
          T: 8
      }]));
      static fromBinary(e, t) {
          return (new $_).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new $_).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new $_).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals($_, e, t)
      }
  }
  class Q_ extends d {
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.language_server_pb.ResetOnboardingResponse";
      static fields = Le.util.newFieldList(( () => []));
      static fromBinary(e, t) {
          return (new Q_).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new Q_).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new Q_).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(Q_, e, t)
      }
  }
  class Z_ extends d {
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.language_server_pb.SkipOnboardingRequest";
      static fields = Le.util.newFieldList(( () => []));
      static fromBinary(e, t) {
          return (new Z_).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new Z_).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new Z_).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(Z_, e, t)
      }
  }
  class ed extends d {
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.language_server_pb.SkipOnboardingResponse";
      static fields = Le.util.newFieldList(( () => []));
      static fromBinary(e, t) {
          return (new ed).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new ed).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new ed).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(ed, e, t)
      }
  }
  class td extends d {
      includeAllTrajectories = !1;
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.language_server_pb.GetUserTrajectoryDebugRequest";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "include_all_trajectories",
          kind: "scalar",
          T: 8
      }]));
      static fromBinary(e, t) {
          return (new td).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new td).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new td).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(td, e, t)
      }
  }
  class nd extends d {
      mainline = [];
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.language_server_pb.GetUserTrajectoryDebugResponse";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "mainline",
          kind: "message",
          T: Qm,
          repeated: !0
      }, {
          no: 2,
          name: "granular",
          kind: "message",
          T: zm
      }]));
      static fromBinary(e, t) {
          return (new nd).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new nd).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new nd).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(nd, e, t)
      }
  }
  class rd extends d {
      mainlineTrajectoryId = "";
      blocking = !1;
      fullRefresh = !1;
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.language_server_pb.ForceBackgroundResearchRefreshRequest";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "metadata",
          kind: "message",
          T: on
      }, {
          no: 2,
          name: "mainline_trajectory_id",
          kind: "scalar",
          T: 9
      }, {
          no: 3,
          name: "blocking",
          kind: "scalar",
          T: 8
      }, {
          no: 4,
          name: "full_refresh",
          kind: "scalar",
          T: 8
      }]));
      static fromBinary(e, t) {
          return (new rd).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new rd).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new rd).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(rd, e, t)
      }
  }
  class ad extends d {
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.language_server_pb.ForceBackgroundResearchRefreshResponse";
      static fields = Le.util.newFieldList(( () => []));
      static fromBinary(e, t) {
          return (new ad).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new ad).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new ad).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(ad, e, t)
      }
  }
  class id extends d {
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.language_server_pb.StartCascadeRequest";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "metadata",
          kind: "message",
          T: on
      }, {
          no: 2,
          name: "experiment_config",
          kind: "message",
          T: Mt
      }, {
          no: 3,
          name: "base_trajectory_identifier",
          kind: "message",
          T: pc
      }]));
      static fromBinary(e, t) {
          return (new id).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new id).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new id).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(id, e, t)
      }
  }
  class sd extends d {
      cascadeId = "";
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.language_server_pb.StartCascadeResponse";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "cascade_id",
          kind: "scalar",
          T: 9
      }]));
      static fromBinary(e, t) {
          return (new sd).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new sd).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new sd).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(sd, e, t)
      }
  }
  class od extends (null) {
      cascadeId = "";
      constructor(e) {
          super(),
          proto3.util.initPartial(e, this)
      }
      static runtime = null;
      static typeName = null;
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "cascade_id",
          kind: "scalar",
          T: 9
      }]));
      static fromBinary(e, t) {
          return (new od).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new od).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new od).fromJsonString(e, t)
      }
      static equals(e, t) {
          return proto3.util.equals(od, e, t)
      }
  }
  class md extends (null) {
      status = CascadeRunStatus.UNSPECIFIED;
      constructor(e) {
          super(),
          proto3.util.initPartial(e, this)
      }
      static runtime = null;
      static typeName = null;
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "trajectory",
          kind: "message",
          T: zm
      }, {
          no: 2,
          name: "status",
          kind: "enum",
          T: Le.getEnumType(Aa)
      }]));
      static fromBinary(e, t) {
          return (new md).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new md).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new md).fromJsonString(e, t)
      }
      static equals(e, t) {
          return proto3.util.equals(md, e, t)
      }
  }
  class cd extends d {
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.language_server_pb.GetAllCascadeTrajectoriesRequest";
      static fields = Le.util.newFieldList(( () => []));
      static fromBinary(e, t) {
          return (new cd).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new cd).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new cd).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(cd, e, t)
      }
  }
  class ud extends d {
      trajectorySummaries = {};
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.language_server_pb.GetAllCascadeTrajectoriesResponse";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "trajectory_summaries",
          kind: "map",
          K: 9,
          V: {
              kind: "message",
              T: jm
          }
      }]));
      static fromBinary(e, t) {
          return (new ud).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new ud).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new ud).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(ud, e, t)
      }
  }
  class ld extends d {
      cascadeId = "";
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.language_server_pb.CancelCascadeInvocationRequest";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "cascade_id",
          kind: "scalar",
          T: 9
      }]));
      static fromBinary(e, t) {
          return (new ld).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new ld).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new ld).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(ld, e, t)
      }
  }
  class _d extends d {
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.language_server_pb.CancelCascadeInvocationResponse";
      static fields = Le.util.newFieldList(( () => []));
      static fromBinary(e, t) {
          return (new _d).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new _d).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new _d).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(_d, e, t)
      }
  }
  class dd extends d {
      cascadeId = "";
      stepIndices = [];
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.language_server_pb.CancelCascadeStepsRequest";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "cascade_id",
          kind: "scalar",
          T: 9
      }, {
          no: 2,
          name: "step_indices",
          kind: "scalar",
          T: 13,
          repeated: !0
      }]));
      static fromBinary(e, t) {
          return (new dd).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new dd).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new dd).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(dd, e, t)
      }
  }
  class Ed extends d {
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.language_server_pb.CancelCascadeStepsResponse";
      static fields = Le.util.newFieldList(( () => []));
      static fromBinary(e, t) {
          return (new Ed).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new Ed).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new Ed).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(Ed, e, t)
      }
  }
  class Td extends d {
      cascadeId = "";
      items = [];
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.language_server_pb.SendUserCascadeMessageRequest";
      static fields = Le.util.newFieldList(( () => [{
          no: 3,
          name: "metadata",
          kind: "message",
          T: on
      }, {
          no: 4,
          name: "experiment_config",
          kind: "message",
          T: Mt
      }, {
          no: 1,
          name: "cascade_id",
          kind: "scalar",
          T: 9
      }, {
          no: 2,
          name: "items",
          kind: "message",
          T: Tr,
          repeated: !0
      }, {
          no: 5,
          name: "cascade_config",
          kind: "message",
          T: mc
      }]));
      static fromBinary(e, t) {
          return (new Td).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new Td).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new Td).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(Td, e, t)
      }
  }
  class fd extends d {
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.language_server_pb.SendUserCascadeMessageResponse";
      static fields = Le.util.newFieldList(( () => []));
      static fromBinary(e, t) {
          return (new fd).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new fd).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new fd).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(fd, e, t)
      }
  }
  class pd extends d {
      cascadeId = "";
      stepIndex = 0;
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.language_server_pb.RevertToCascadeStepRequest";
      static fields = Le.util.newFieldList(( () => [{
          no: 3,
          name: "metadata",
          kind: "message",
          T: on
      }, {
          no: 4,
          name: "experiment_config",
          kind: "message",
          T: Mt
      }, {
          no: 1,
          name: "cascade_id",
          kind: "scalar",
          T: 9
      }, {
          no: 2,
          name: "step_index",
          kind: "scalar",
          T: 13
      }]));
      static fromBinary(e, t) {
          return (new pd).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new pd).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new pd).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(pd, e, t)
      }
  }
  class Sd extends d {
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.language_server_pb.RevertToCascadeStepResponse";
      static fields = Le.util.newFieldList(( () => []));
      static fromBinary(e, t) {
          return (new Sd).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new Sd).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new Sd).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(Sd, e, t)
      }
  }
  class Nd extends d {
      cascadeId = "";
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.language_server_pb.HandleCascadeUserInteractionRequest";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "cascade_id",
          kind: "scalar",
          T: 9
      }, {
          no: 2,
          name: "interaction",
          kind: "message",
          T: Nc
      }]));
      static fromBinary(e, t) {
          return (new Nd).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new Nd).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new Nd).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(Nd, e, t)
      }
  }
  class gd extends d {
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.language_server_pb.HandleCascadeUserInteractionResponse";
      static fields = Le.util.newFieldList(( () => []));
      static fromBinary(e, t) {
          return (new gd).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new gd).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new gd).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(gd, e, t)
      }
  }
  class Id extends d {
      cascadeId = "";
      absoluteUri = [];
      accept = !1;
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.language_server_pb.AcknowledgeCascadeCodeEditRequest";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "cascade_id",
          kind: "scalar",
          T: 9
      }, {
          no: 2,
          name: "absolute_uri",
          kind: "scalar",
          T: 9,
          repeated: !0
      }, {
          no: 3,
          name: "accept",
          kind: "scalar",
          T: 8
      }]));
      static fromBinary(e, t) {
          return (new Id).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new Id).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new Id).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(Id, e, t)
      }
  }
  class Cd extends d {
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.language_server_pb.AcknowledgeCascadeCodeEditResponse";
      static fields = Le.util.newFieldList(( () => []));
      static fromBinary(e, t) {
          return (new Cd).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new Cd).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new Cd).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(Cd, e, t)
      }
  }
  class Od extends d {
      cascadeId = "";
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.language_server_pb.GetCodeValidationStatesRequest";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "cascade_id",
          kind: "scalar",
          T: 9
      }]));
      static fromBinary(e, t) {
          return (new Od).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new Od).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new Od).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(Od, e, t)
      }
  }
  class yd extends d {
      states = [];
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.language_server_pb.GetCodeValidationStatesResponse";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "states",
          kind: "message",
          T: wd,
          repeated: !0
      }]));
      static fromBinary(e, t) {
          return (new yd).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new yd).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new yd).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(yd, e, t)
      }
  }
  class wd extends d {
      uri = "";
      lastAcknowledgedState = "";
      currentState = "";
      lastStateFileNonexistent = !1;
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.language_server_pb.ValidationState";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "uri",
          kind: "scalar",
          T: 9
      }, {
          no: 2,
          name: "last_acknowledged_state",
          kind: "scalar",
          T: 9
      }, {
          no: 3,
          name: "current_state",
          kind: "scalar",
          T: 9
      }, {
          no: 4,
          name: "last_state_file_nonexistent",
          kind: "scalar",
          T: 8
      }]));
      static fromBinary(e, t) {
          return (new wd).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new wd).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new wd).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(wd, e, t)
      }
  }
  class Ad extends d {
      cascadeId = "";
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.language_server_pb.DeleteCascadeTrajectoryRequest";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "cascade_id",
          kind: "scalar",
          T: 9
      }]));
      static fromBinary(e, t) {
          return (new Ad).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new Ad).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new Ad).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(Ad, e, t)
      }
  }
  class Pd extends d {
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.language_server_pb.DeleteCascadeTrajectoryResponse";
      static fields = Le.util.newFieldList(( () => []));
      static fromBinary(e, t) {
          return (new Pd).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new Pd).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new Pd).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(Pd, e, t)
      }
  }
  class Ld extends d {
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.language_server_pb.TrackTerminalShellCommandRequest";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "command",
          kind: "message",
          T: Hr
      }]));
      static fromBinary(e, t) {
          return (new Ld).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new Ld).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new Ld).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(Ld, e, t)
      }
  }
  class Rd extends d {
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.language_server_pb.TrackTerminalShellCommandResponse";
      static fields = Le.util.newFieldList(( () => []));
      static fromBinary(e, t) {
          return (new Rd).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new Rd).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new Rd).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(Rd, e, t)
      }
  }
  class kd extends d {
      cascadeId = "";
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.language_server_pb.ResolveOutstandingStepsRequest";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "cascade_id",
          kind: "scalar",
          T: 9
      }]));
      static fromBinary(e, t) {
          return (new kd).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new kd).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new kd).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(kd, e, t)
      }
  }
  class Jd extends d {
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.language_server_pb.ResolveOutstandingStepsResponse";
      static fields = Le.util.newFieldList(( () => []));
      static fromBinary(e, t) {
          return (new Jd).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new Jd).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new Jd).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(Jd, e, t)
      }
  }
  var Dd, hd;
  let xd;
  !function(e) {
      e[e.Unary = 0] = "Unary",
      e[e.ServerStreaming = 1] = "ServerStreaming",
      e[e.ClientStreaming = 2] = "ClientStreaming",
      e[e.BiDiStreaming = 3] = "BiDiStreaming"
  }(Dd || (Dd = {})),
  function(e) {
      e[e.NoSideEffects = 1] = "NoSideEffects",
      e[e.Idempotent = 2] = "Idempotent"
  }(hd || (hd = {})),
  function(e) {
      e[e.UNSPECIFIED = 0] = "UNSPECIFIED",
      e[e.ONE = 1] = "ONE",
      e[e.TWO = 2] = "TWO"
  }(xd || (xd = {})),
  Le.util.setEnumType(xd, "exa.reactive_component_pb.TestEnum", [{
      no: 0,
      name: "TEST_ENUM_UNSPECIFIED"
  }, {
      no: 1,
      name: "TEST_ENUM_ONE"
  }, {
      no: 2,
      name: "TEST_ENUM_TWO"
  }]);
  class Ud extends d {
      protocolVersion = 0;
      id = "";
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.reactive_component_pb.StreamReactiveUpdatesRequest";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "protocol_version",
          kind: "scalar",
          T: 13
      }, {
          no: 2,
          name: "id",
          kind: "scalar",
          T: 9
      }]));
      static fromBinary(e, t) {
          return (new Ud).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new Ud).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new Ud).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(Ud, e, t)
      }
  }
  class Md extends d {
      version = y.zero;
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.reactive_component_pb.StreamReactiveUpdatesResponse";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "version",
          kind: "scalar",
          T: 4
      }, {
          no: 2,
          name: "diff",
          kind: "message",
          T: Fd
      }]));
      static fromBinary(e, t) {
          return (new Md).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new Md).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new Md).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(Md, e, t)
      }
  }
  class Bd extends d {
      counter = 0;
      values = [];
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.reactive_component_pb.TestProto";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "counter",
          kind: "scalar",
          T: 5
      }, {
          no: 2,
          name: "values",
          kind: "scalar",
          T: 5,
          repeated: !0
      }]));
      static fromBinary(e, t) {
          return (new Bd).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new Bd).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new Bd).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(Bd, e, t)
      }
  }
  class Fd extends d {
      fieldDiffs = [];
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.reactive_component_pb.MessageDiff";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "field_diffs",
          kind: "message",
          T: bd,
          repeated: !0
      }]));
      static fromBinary(e, t) {
          return (new Fd).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new Fd).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new Fd).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(Fd, e, t)
      }
  }
  class bd extends d {
      fieldNumber = 0;
      diff = {
          case: void 0
      };
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.reactive_component_pb.FieldDiff";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "field_number",
          kind: "scalar",
          T: 13
      }, {
          no: 2,
          name: "update_singular",
          kind: "message",
          T: Hd,
          oneof: "diff"
      }, {
          no: 3,
          name: "update_repeated",
          kind: "message",
          T: qd,
          oneof: "diff"
      }, {
          no: 4,
          name: "update_map",
          kind: "message",
          T: Gd,
          oneof: "diff"
      }, {
          no: 5,
          name: "clear",
          kind: "scalar",
          T: 8,
          oneof: "diff"
      }]));
      static fromBinary(e, t) {
          return (new bd).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new bd).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new bd).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(bd, e, t)
      }
  }
  class qd extends d {
      newLength = 0;
      updateValues = [];
      updateIndices = [];
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.reactive_component_pb.RepeatedDiff";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "new_length",
          kind: "scalar",
          T: 13
      }, {
          no: 2,
          name: "update_values",
          kind: "message",
          T: Hd,
          repeated: !0
      }, {
          no: 3,
          name: "update_indices",
          kind: "scalar",
          T: 13,
          repeated: !0
      }]));
      static fromBinary(e, t) {
          return (new qd).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new qd).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new qd).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(qd, e, t)
      }
  }
  class Gd extends d {
      mapKeyDiffs = [];
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.reactive_component_pb.MapDiff";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "map_key_diffs",
          kind: "message",
          T: vd,
          repeated: !0
      }]));
      static fromBinary(e, t) {
          return (new Gd).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new Gd).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new Gd).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(Gd, e, t)
      }
  }
  class vd extends d {
      diff = {
          case: void 0
      };
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.reactive_component_pb.MapKeyDiff";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "map_key",
          kind: "message",
          T: Hd
      }, {
          no: 2,
          name: "update_singular",
          kind: "message",
          T: Hd,
          oneof: "diff"
      }, {
          no: 3,
          name: "clear",
          kind: "scalar",
          T: 8,
          oneof: "diff"
      }]));
      static fromBinary(e, t) {
          return (new vd).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new vd).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new vd).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(vd, e, t)
      }
  }
  class Hd extends d {
      value = {
          case: void 0
      };
      constructor(e) {
          super(),
          Le.util.initPartial(e, this)
      }
      static runtime = Le;
      static typeName = "exa.reactive_component_pb.SingularValue";
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "double_value",
          kind: "scalar",
          T: 1,
          oneof: "value"
      }, {
          no: 2,
          name: "float_value",
          kind: "scalar",
          T: 2,
          oneof: "value"
      }, {
          no: 3,
          name: "int32_value",
          kind: "scalar",
          T: 5,
          oneof: "value"
      }, {
          no: 4,
          name: "int64_value",
          kind: "scalar",
          T: 3,
          oneof: "value"
      }, {
          no: 5,
          name: "uint32_value",
          kind: "scalar",
          T: 13,
          oneof: "value"
      }, {
          no: 6,
          name: "uint64_value",
          kind: "scalar",
          T: 4,
          oneof: "value"
      }, {
          no: 7,
          name: "sint32_value",
          kind: "scalar",
          T: 17,
          oneof: "value"
      }, {
          no: 8,
          name: "sint64_value",
          kind: "scalar",
          T: 18,
          oneof: "value"
      }, {
          no: 9,
          name: "fixed32_value",
          kind: "scalar",
          T: 7,
          oneof: "value"
      }, {
          no: 10,
          name: "fixed64_value",
          kind: "scalar",
          T: 6,
          oneof: "value"
      }, {
          no: 11,
          name: "sfixed32_value",
          kind: "scalar",
          T: 15,
          oneof: "value"
      }, {
          no: 12,
          name: "sfixed64_value",
          kind: "scalar",
          T: 16,
          oneof: "value"
      }, {
          no: 13,
          name: "bool_value",
          kind: "scalar",
          T: 8,
          oneof: "value"
      }, {
          no: 14,
          name: "enum_value",
          kind: "scalar",
          T: 13,
          oneof: "value"
      }, {
          no: 15,
          name: "string_value",
          kind: "scalar",
          T: 9,
          oneof: "value"
      }, {
          no: 16,
          name: "bytes_value",
          kind: "scalar",
          T: 12,
          oneof: "value"
      }, {
          no: 17,
          name: "message_value",
          kind: "message",
          T: Fd,
          oneof: "value"
      }]));
      static fromBinary(e, t) {
          return (new Hd).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new Hd).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new Hd).fromJsonString(e, t)
      }
      static equals(e, t) {
          return Le.util.equals(Hd, e, t)
      }
  }
  class Vd extends (null) {
      singularScalarValue = 0;
      repeatedScalarValue = [];
      repeatedMessageValue = [];
      mapScalarValue = {};
      mapMessageValue = {};
      oneofTest = {
          case: void 0
      };
      enumValue = xd.UNSPECIFIED;
      constructor(e) {
          super(),
          proto3.util.initPartial(e, this)
      }
      static runtime = null;
      static typeName = null;
      static fields = Le.util.newFieldList(( () => [{
          no: 1,
          name: "singular_scalar_value",
          kind: "scalar",
          T: 1
      }, {
          no: 2,
          name: "singular_message_value",
          kind: "message",
          T: Bd
      }, {
          no: 3,
          name: "repeated_scalar_value",
          kind: "scalar",
          T: 1,
          repeated: !0
      }, {
          no: 4,
          name: "repeated_message_value",
          kind: "message",
          T: Bd,
          repeated: !0
      }, {
          no: 5,
          name: "map_scalar_value",
          kind: "map",
          K: 5,
          V: {
              kind: "scalar",
              T: 1
          }
      }, {
          no: 6,
          name: "map_message_value",
          kind: "map",
          K: 9,
          V: {
              kind: "message",
              T: Bd
          }
      }, {
          no: 7,
          name: "oneof_scalar_value",
          kind: "scalar",
          T: 1,
          oneof: "oneof_test"
      }, {
          no: 8,
          name: "oneof_message_value",
          kind: "message",
          T: Bd,
          oneof: "oneof_test"
      }, {
          no: 9,
          name: "enum_value",
          kind: "enum",
          T: Le.getEnumType(xd)
      }]));
      static fromBinary(e, t) {
          return (new Vd).fromBinary(e, t)
      }
      static fromJson(e, t) {
          return (new Vd).fromJson(e, t)
      }
      static fromJsonString(e, t) {
          return (new Vd).fromJsonString(e, t)
      }
      static equals(e, t) {
          return proto3.util.equals(Vd, e, t)
      }
  }
  Dd.Unary,
  Dd.Unary,
  Dd.Unary,
  Dd.Unary,
  Dd.Unary,
  Dd.Unary,
  Dd.Unary,
  Dd.Unary,
  Dd.Unary,
  Dd.Unary,
  Dd.Unary,
  Dd.Unary,
  Dd.Unary,
  Dd.Unary,
  Dd.Unary,
  Dd.Unary,
  Dd.Unary,
  Dd.ServerStreaming,
  Dd.Unary,
  Dd.Unary,
  Dd.Unary,
  Dd.Unary,
  Dd.Unary,
  Dd.Unary,
  Dd.Unary,
  Dd.Unary,
  Dd.Unary,
  Dd.Unary,
  Dd.ServerStreaming,
  Dd.Unary,
  Dd.Unary,
  Dd.Unary,
  Dd.Unary,
  Dd.Unary,
  Dd.Unary,
  Dd.Unary,
  Dd.Unary,
  Dd.Unary,
  Dd.Unary,
  Dd.Unary,
  Dd.Unary,
  Dd.Unary,
  Dd.Unary,
  Dd.Unary,
  Dd.Unary,
  Dd.Unary,
  Dd.Unary,
  Dd.Unary,
  Dd.Unary,
  Dd.Unary,
  Dd.Unary,
  Dd.Unary,
  Dd.Unary,
  Dd.Unary,
  Dd.Unary,
  Dd.Unary,
  Dd.Unary,
  Dd.Unary,
  Dd.Unary,
  Dd.Unary,
  Dd.Unary,
  Dd.Unary,
  Dd.Unary,
  Dd.Unary,
  Dd.Unary,
  Dd.Unary,
  Dd.Unary,
  Dd.Unary,
  Dd.Unary,
  Dd.Unary,
  Dd.Unary,
  Dd.Unary,
  Dd.Unary,
  Dd.Unary,
  Dd.ServerStreaming,
  Dd.Unary,
  Dd.Unary,
  Dd.Unary;
  class Xd {
      sessionId = ea();
      requestId = 0;
      promiseMap = new Map;
      constructor(e) {
          this.extensionId = e,
          this.port = this.createPort()
      }
      createPort() {
          const e = chrome.runtime.connect(this.extensionId, {
              name: this.sessionId
          });
          return e.onDisconnect.addListener(( () => {
              this.port = this.createPort()
          }
          )),
          e.onMessage.addListener((async e => {
              if ("getCompletions" === e.kind) {
                  let t;
                  void 0 !== e.response && (t = Lu.fromJsonString(e.response)),
                  this.promiseMap.get(e.requestId)?.(t),
                  this.promiseMap.delete(e.requestId)
              }
          }
          )),
          e
      }
      getMetadata(e) {
          return new on({
              ideName: e.ideName,
              ideVersion: e.ideVersion,
              extensionName: "chrome",
              extensionVersion: "1.26.3",
              locale: navigator.language,
              sessionId: this.sessionId,
              requestId: BigInt(++this.requestId),
              userAgent: navigator.userAgent,
              url: window.location.href
          })
      }
      async getCompletions(e) {
          const t = Number(e.metadata?.requestId)
            , n = new Promise((e => {
              this.promiseMap.set(t, e)
          }
          ))
            , r = {
              kind: "getCompletions",
              requestId: t,
              request: e.toJsonString()
          };
          return this.port.postMessage(r),
          n
      }
      acceptedLastCompletion(e, t) {
          const n = {
              kind: "acceptCompletion",
              request: new Ru({
                  metadata: this.getMetadata(e),
                  completionId: t
              }).toJsonString()
          };
          this.port.postMessage(n)
      }
  }
  function Yd(e) {
      return e < 128 ? 1 : e < 2048 ? 2 : e < 65536 ? 3 : 4
  }
  function Kd(e, t) {
      if (0 === t)
          return 0;
      let n = 0
        , r = 0;
      for (const a of e)
          if (r += a.length,
          n += Yd(a.codePointAt(0)),
          void 0 !== t && r >= t)
              break;
      return n
  }
  function Wd(e, t) {
      if (0 === t)
          return 0;
      let n = 0
        , r = 0;
      for (const a of e)
          if (r += Yd(a.codePointAt(0)),
          n += a.length,
          void 0 !== t && r >= t)
              break;
      return n
  }
  const zd = {
      [Qe.PYTHON]: "python",
      [Qe.SQL]: "sql",
      [Qe.R]: "",
      [Qe.MARKDOWN]: "markdown",
      [Qe.SCALA]: ""
  };
  function jd(e) {
      return Object.prototype.hasOwnProperty.call(zd, e)
  }
  function $d(e) {
      const t = e.textModels ?? []
        , n = e.getLanguage(e.currentTextModel, void 0)
        , r = n === Qe.MARKDOWN
        , a = r ? "\n\n" : "\nCELL:\n"
        , i = jd(n)
        , s = [];
      let o = 0
        , m = !1;
      for (const [c,u] of t.entries()) {
          const t = i && e.currentTextModel === u;
          t && (o = s.map((e => Kd(e))).reduce(( (e, t) => e + t), 0) + a.length * (s.length + (e.isNotebook ? 1 : 0)),
          m = !0);
          const l = e.getLanguage(u, c);
          if (i && !r) {
              if (l === Qe.MARKDOWN)
                  continue;
              l === n && (t && void 0 !== e.currentTextModelWithOutput ? s.push(e.getText(e.currentTextModelWithOutput)) : s.push(e.getText(u)))
          } else
              r && (l === Qe.MARKDOWN ? s.push(e.getText(u)) : jd(l) && s.push(`\`\`\`${zd[l]}\n${e.getText(u)}\n\`\`\``))
      }
      const c = e.getText(e.currentTextModelWithOutput ?? e.currentTextModel);
      let u = m ? `${s.join(a)}` : `${c}`;
      return u = e.isNotebook ? `${a}${u}` : u,
      {
          text: u,
          utf8ByteOffset: Kd(c, e.utf16CodeUnitOffset),
          additionalUtf8ByteOffset: o
      }
  }
  class Qd {
      constructor(e, t) {
          this.client = new Xd(e),
          this.ideInfo = t
      }
      documentMatchesCompletion() {
          return this.currentCompletion?.doc.getValue() === this.currentCompletion?.docState
      }
      anyTextMarkerUpdated(e, t, n) {
          return void 0 !== this.currentCompletion?.textMarkers.find((r => function(e, t, n, r) {
              if (n.line != e.pos.line || n.ch != e.pos.ch)
                  return !1;
              if ("Backspace" === t)
                  return "" !== r && (e.spanElement.innerText = r + e.spanElement.innerText,
                  !0);
              if (t.length > 1 || "\n" === t)
                  return !1;
              const a = e.spanElement.innerText;
              return 1 !== a.length && !!a.startsWith(t) && (e.spanElement.innerText = e.spanElement.innerText.substring(1),
              !0)
          }(r, e, t, n)))
      }
      async triggerCompletion(e, t, n, r, a, i, s) {
          const o = n.getCursor()
            , {text: m, utf8ByteOffset: c, additionalUtf8ByteOffset: u} = function(e, t, n, r) {
              return $d({
                  textModels: t,
                  currentTextModel: n,
                  currentTextModelWithOutput: r,
                  isNotebook: e,
                  utf16CodeUnitOffset: n.indexFromPos(n.getCursor()),
                  getText: e => e.getValue(),
                  getLanguage: e => Wr(e, void 0)
              })
          }(e, t, n, r)
            , l = u + c
            , _ = new Pu({
              metadata: this.client.getMetadata(this.ideInfo),
              document: {
                  text: m,
                  editorLanguage: (d = n,
                  Kr(d).name),
                  language: Wr(n, i),
                  cursorOffset: BigInt(l),
                  lineEnding: "\n",
                  absoluteUri: `file:///${i}`
              },
              editorOptions: a
          });
          var d;
          const E = await this.client.getCompletions(_);
          if (void 0 === E)
              return;
          this.clearCompletion("about to replace completions if the cursor hasn't moved and we got completions");
          const T = n.getCursor();
          if (T.ch !== o.ch || T.line !== o.line)
              return;
          if (0 === E.completionItems.length)
              return;
          const f = E.completionItems[0];
          this.renderCompletion(n, f, u, s || ( () => []))
      }
      clearCompletion(e) {
          const t = this.currentCompletion;
          return void 0 !== t && (t.disposables.forEach((e => {
              e.dispose()
          }
          )),
          t.lineWidgets.forEach((e => {
              e.clear()
          }
          )),
          t.textMarkers.forEach((e => {
              e.marker.clear()
          }
          )),
          this.currentCompletion = void 0,
          !0)
      }
      renderCompletion(e, t, n, r) {
          this.clearCompletion("about to render new completions");
          const a = Number(t.range?.startOffset ?? 0) - n
            , i = Number(t.range?.endOffset ?? 0) - n
            , s = {
              completionItem: t,
              lineWidgets: [],
              textMarkers: [],
              disposables: r(),
              doc: e,
              start: e.posFromIndex(Wd(e.getValue(), a)),
              end: e.posFromIndex(Wd(e.getValue(), i)),
              docState: e.getValue()
          }
            , o = e.getCursor();
          let m = !1;
          if (t.completionParts.forEach((t => {
              if (t.type === Ua.INLINE) {
                  const r = document.createElement("span");
                  r.classList.add("codeium-ghost"),
                  r.innerText = t.text;
                  const a = Number(t.offset) - n
                    , i = Wd(e.getValue(), a)
                    , c = e.posFromIndex(i)
                    , u = e.setBookmark(c, {
                      widget: r,
                      insertLeft: !0,
                      handleMouseEvents: !0
                  });
                  s.textMarkers.push({
                      marker: u,
                      pos: c,
                      spanElement: r
                  }),
                  c.line === o.line && c.ch === o.ch && (m = !0)
              } else if (t.type === Ua.BLOCK) {
                  const n = document.createElement("div");
                  n.classList.add("codeium-ghost"),
                  t.text.split("\n").forEach((e => {
                      const t = document.createElement("pre");
                      t.classList.add("CodeMirror-line", "codeium-ghost-line"),
                      "" === e && (e = " "),
                      t.innerText = e,
                      n.appendChild(t)
                  }
                  ));
                  const r = e.addLineWidget(o.line, n, {
                      handleMouseEvents: !0
                  });
                  s.lineWidgets.push(r)
              }
          }
          )),
          !m) {
              const t = document.createElement("span");
              t.classList.add("codeium-ghost"),
              t.innerText = "";
              const n = e.setBookmark(o, {
                  widget: t,
                  insertLeft: !0
              });
              s.textMarkers.push({
                  marker: n,
                  pos: o,
                  spanElement: t
              })
          }
          this.currentCompletion = s
      }
      acceptCompletion() {
          const e = this.currentCompletion;
          if (void 0 === e)
              return !1;
          this.clearCompletion("about to accept completions");
          const t = e.completionItem.completion;
          if (void 0 === t)
              return console.error("Empty completion"),
              !0;
          const n = e.doc;
          if (n.setCursor(e.start),
          n.replaceRange(t.text, e.start, e.end),
          void 0 !== e.completionItem.suffix && e.completionItem.suffix.text.length > 0) {
              n.replaceRange(e.completionItem.suffix.text, n.getCursor());
              const t = n.getCursor()
                , r = n.indexFromPos(t) + Number(e.completionItem.suffix.deltaCursorOffset);
              n.setCursor(n.posFromIndex(r))
          }
          return this.client.acceptedLastCompletion(this.ideInfo, t.completionId),
          !0
      }
      beforeMainKeyHandler(e, t, n, r) {
          let a = !1;
          if (t.ctrlKey && " " === t.key && (a = !0),
          "\"')}]".includes(t.key) && (a = !0),
          t.isComposing)
              return this.clearCompletion("composing"),
              {
                  consumeEvent: !1,
                  forceTriggerCompletion: a
              };
          if (r && t.key.toLowerCase() === r.key.toLowerCase() && !!t.ctrlKey == !!r.ctrl && !!t.altKey == !!r.alt && !!t.shiftKey == !!r.shift && !!t.metaKey == !!r.meta && this.acceptCompletion())
              return {
                  consumeEvent: !0,
                  forceTriggerCompletion: a
              };
          if (!t.metaKey && !t.ctrlKey && !t.altKey && !t.shiftKey && n.escape && "Escape" === t.key && this.clearCompletion("user dismissed"))
              return {
                  consumeEvent: !0,
                  forceTriggerCompletion: a
              };
          if ("Tab" === t.key && t.shiftKey)
              return {
                  consumeEvent: !1,
                  forceTriggerCompletion: a
              };
          switch (t.key) {
          case "Delete":
          case "ArrowDown":
          case "ArrowUp":
          case "ArrowLeft":
          case "ArrowRight":
          case "Home":
          case "End":
          case "PageDown":
          case "PageUp":
              return this.clearCompletion(`key: ${t.key}`),
              {
                  consumeEvent: !1,
                  forceTriggerCompletion: a
              }
          }
          const i = e.getCursor()
            , s = 0 === i.ch ? "" : e.getRange({
              line: i.line,
              ch: i.ch - 1
          }, i);
          return this.anyTextMarkerUpdated(t.key, i, s) || 1 !== t.key.length || this.clearCompletion("didn't update text marker and key is a single character"),
          "Enter" === t.key && this.clearCompletion("enter"),
          {
              consumeEvent: void 0,
              forceTriggerCompletion: a
          }
      }
      clearCompletionInitHook() {
          const e = new WeakSet;
          return t => {
              if (e.has(t))
                  return;
              e.add(t);
              const n = t.getInputField().closest(".CodeMirror");
              if (null === n)
                  return;
              const r = n;
              r.addEventListener("focusout", ( () => {
                  this.clearCompletion("focusout")
              }
              )),
              r.addEventListener("mousedown", ( () => {
                  this.clearCompletion("mousedown")
              }
              )),
              new MutationObserver(( () => {
                  r.classList.contains("cm-fat-cursor") && this.clearCompletion("vim")
              }
              )).observe(r, {
                  attributes: !0,
                  attributeFilter: ["class"]
              });
              const a = document.body.querySelector(".jp-Completer");
              null !== a && new MutationObserver(( () => {
                  a?.classList.contains("lm-mod-hidden") || this.clearCompletion("completer")
              }
              )).observe(a, {
                  attributes: !0,
                  attributeFilter: ["class"]
              })
          }
      }
  }
  class Zd {
      docs = [];
      debounceMs = 0;
      hookedEditors = new WeakSet;
      constructor(e, t, n, r) {
          this.multiplayer = n,
          this.codeMirrorManager = new Qd(e,{
              ideName: "codemirror",
              ideVersion: `${t?.version ?? "unknown"}-${window.location.hostname}`
          }),
          void 0 !== t && t.defineInitHook(this.editorHook()),
          this.debounceMs = r ?? 0
      }
      editorHook() {
          const e = this.codeMirrorManager.clearCompletionInitHook();
          return t => {
              this.hookedEditors.has(t) || (this.hookedEditors.add(t),
              this.addKeydownListener(t, this.multiplayer),
              e(t))
          }
      }
      addKeydownListener(e, t) {
          null !== e.getInputField().closest(".CodeMirror") && (t && e.on("change", ( () => {
              this.codeMirrorManager.documentMatchesCompletion() || this.codeMirrorManager.clearCompletion("document changed")
          }
          )),
          e.on("keydown", ( (e, t) => {
              const {consumeEvent: n, forceTriggerCompletion: r} = this.codeMirrorManager.beforeMainKeyHandler(e.getDoc(), t, {
                  tab: !0,
                  escape: !0
              }, {
                  key: "Tab",
                  ctrl: !1,
                  alt: !1,
                  shift: !1,
                  meta: !1
              });
              if (void 0 !== n)
                  return void (n && t.preventDefault());
              const a = e.getDoc()
                , i = a.getValue();
              setTimeout((async () => {
                  (r || a.getValue() !== i) && await this.codeMirrorManager.triggerCompletion(!1, this.docs, e.getDoc(), void 0, new mn({
                      tabSize: BigInt(e.getOption("tabSize") ?? 4),
                      insertSpaces: !e.getOption("indentWithTabs")
                  }), void 0, void 0)
              }
              ), this.debounceMs)
          }
          )))
      }
  }
  class eE {
      constructor(e, t, n) {
          this.jupyter = t,
          this.codeMirrorManager = new Qd(e,{
              ideName: "jupyter_notebook",
              ideVersion: t.version
          }),
          this.keybindings = n
      }
      patchCellKeyEvent(e) {
          const t = (e, t) => this.codeMirrorManager.beforeMainKeyHandler(e, t, {
              tab: !0,
              escape: !1
          }, this.keybindings.accept)
            , n = n => {
              const r = this.codeMirrorManager;
              return function(a, i) {
                  const {consumeEvent: s, forceTriggerCompletion: o} = t(a.getDoc(), i);
                  if (void 0 !== s)
                      return void (s ? i.preventDefault() : n.call(this, a, i));
                  const m = a.getDoc()
                    , c = m.getValue();
                  setTimeout((async () => {
                      if (!o && m.getValue() === c)
                          return;
                      const e = []
                        , t = [...this.notebook.get_cells()];
                      let n;
                      for (const r of t) {
                          let t = "";
                          if (void 0 !== r.output_area && r.output_area.outputs.length > 0) {
                              const e = r.output_area.outputs[0];
                              "execute_result" === e.output_type && void 0 !== e.data && void 0 !== e.data["text/plain"] ? t = e.data["text/plain"] : "stream" === e.output_type && "stdout" === e.name && void 0 !== e.text && (t = e.text);
                              const n = t.split("\n");
                              n.length > 10 && (n.length = 10,
                              t = n.join("\n")),
                              t.length > 500 && (t = t.slice(0, 500))
                          }
                          if (t = t ? "\nOUTPUT:\n" + t : "",
                          r.code_mirror.getDoc() === m)
                              e.push(m),
                              n = r.code_mirror.getDoc().copy(!1),
                              n.setValue(r.get_text() + t);
                          else {
                              const n = r.code_mirror.getDoc().copy(!1);
                              let a = n.getValue();
                              a += t,
                              n.setValue(a),
                              e.push(n)
                          }
                      }
                      const i = window.location.href
                        , s = new URL(i).pathname
                        , u = s.endsWith(".ipynb") ? s.replace(/^\//, "") : void 0;
                      await r.triggerCompletion(!0, e, this.code_mirror.getDoc(), n, new mn({
                          tabSize: BigInt(a.getOption("tabSize") ?? 4),
                          insertSpaces: !a.getOption("indentWithTabs")
                      }), u ?? "unknown_url", void 0)
                  }
                  ), e ?? 0)
              }
          }
          ;
          this.jupyter.CodeCell.prototype.handle_codemirror_keyevent = n(this.jupyter.CodeCell.prototype.handle_codemirror_keyevent),
          this.jupyter.TextCell.prototype.handle_codemirror_keyevent = n(this.jupyter.TextCell.prototype.handle_codemirror_keyevent)
      }
      patchShortcutManagerHandler() {
          const e = this.jupyter.keyboard.ShortcutManager.prototype.call_handler
            , t = () => this.codeMirrorManager.clearCompletion("shortcut manager");
          this.jupyter.keyboard.ShortcutManager.prototype.call_handler = function(n) {
              "Escape" === n.key && t() ? n.preventDefault() : e.call(this, n)
          }
      }
  }
  function tE(e) {
      const t = [];
      return e.ctrl && t.push("Ctrl"),
      e.alt && t.push("Alt"),
      e.shift && t.push("Shift"),
      e.meta && t.push("Meta"),
      t.push(e.key),
      t.join(" ")
  }
  const nE = "codeium:accept-completion"
    , rE = "codeium:dismiss-completion";
  class aE {
      nonNotebookWidget = new Set;
      constructor(e, t, n, r, a, i) {
          this.extensionId = e,
          this.app = t,
          this.notebookTracker = n,
          this.editorTracker = r,
          this.documentManager = a,
          this.debounceMs = i,
          this.codeMirrorManager = new Qd(e,{
              ideName: "jupyterlab",
              ideVersion: `${t.name.toLowerCase()} ${t.version}`
          }),
          t.commands.addCommand(nE, {
              execute: () => {
                  this.codeMirrorManager.acceptCompletion()
              }
          }),
          t.commands.addCommand(rE, {
              execute: () => {
                  this.codeMirrorManager.clearCompletion("user dismissed")
              }
          });
          const s = this.codeMirrorManager.clearCompletionInitHook()
            , o = this.keydownHandler.bind(this);
          n.activeCellChanged.connect(( (e, t) => {
              this.previousCellHandler?.dispose(),
              this.previousCellHandler = void 0,
              null !== t && (s(t.editor.editor ?? null),
              this.previousCellHandler = t.editor.addKeydownHandler(o))
          }
          ), this),
          r.widgetAdded.connect(( (e, t) => {
              s(t.content.editor.editor),
              t.content.editor.addKeydownHandler(o),
              this.nonNotebookWidget.add(t.id),
              t.disposed.connect(this.removeNonNotebookWidget, this)
          }
          ), this),
          this.keybindings = async function(e) {
              return await new Promise((t => {
                  chrome.runtime.sendMessage(e, {
                      type: "jupyterlab"
                  }, (e => {
                      t(e)
                  }
                  ))
              }
              ))
          }(e)
      }
      removeNonNotebookWidget(e) {
          this.nonNotebookWidget.delete(e.id)
      }
      keydownHandler(e, t) {
          const n = e
            , {consumeEvent: r, forceTriggerCompletion: a} = this.codeMirrorManager.beforeMainKeyHandler(n.doc, t, {
              tab: !1,
              escape: !1
          });
          if (void 0 !== r)
              return r;
          const i = n.doc.getValue();
          return setTimeout((async () => {
              const e = await this.keybindings;
              if (!a && n.doc.getValue() === i)
                  return;
              const t = []
                , r = n === this.notebookTracker.activeCell?.editor
                , s = r ? this.notebookTracker.currentWidget : this.editorTracker.currentWidget;
              let o;
              if (r) {
                  const e = this.notebookTracker.currentWidget?.content.widgets;
                  if (void 0 !== e)
                      for (const n of e) {
                          const e = n.editor.doc
                            , r = n.model.toJSON();
                          if (void 0 !== r.outputs && r.outputs.length > 0) {
                              const a = n === this.notebookTracker.currentWidget?.content.activeCell
                                , i = r.source;
                              let s = "";
                              for (const e of r.outputs) {
                                  if ("execute_result" === e.output_type && void 0 !== e.data) {
                                      const t = e.data;
                                      void 0 !== t["text/plain"] ? s = e.data["text/plain"] : void 0 !== t["text/html"] && (s = e.data["text/html"])
                                  }
                                  "stream" === e.output_type && "stdout" === e.name && void 0 !== e.text && (s = e.text)
                              }
                              s = s.split("\n").slice(0, 10).map((e => e.slice(0, 500))).join("\n"),
                              s = s ? "\nOUTPUT:\n" + s : "";
                              const m = e.copy(!1);
                              m.setValue(i + s),
                              a ? (o = m,
                              t.push(e)) : t.push(m)
                          } else
                              t.push(e)
                      }
              }
              const m = null !== s ? this.documentManager.contextForWidget(s) : void 0
                , c = n.doc;
              await this.codeMirrorManager.triggerCompletion(!0, t, c, o, new mn({
                  tabSize: BigInt(n.getOption("tabSize")),
                  insertSpaces: n.getOption("insertSpaces")
              }), m?.localPath, ( () => {
                  const t = [this.app.commands.addKeyBinding({
                      command: nE,
                      keys: [tE(e.accept)],
                      selector: ".CodeMirror"
                  })];
                  return this.app.hasPlugin("@axlair/jupyterlab_vim") || t.push(this.app.commands.addKeyBinding({
                      command: rE,
                      keys: [tE(e.dismiss)],
                      selector: ".CodeMirror"
                  })),
                  t
              }
              ))
          }
          ), this.debounceMs),
          chrome.runtime.sendMessage(this.extensionId, {
              type: "success"
          }),
          !1
      }
  }
  function iE(e, t, n) {
      return {
          id: "codeium:plugin",
          autoStart: !0,
          activate: (t, r, a, i) => {
              new aE(e,t,r,a,i,n)
          }
          ,
          requires: [t._pluginMap["@jupyterlab/notebook-extension:tracker"].provides, t._pluginMap["@jupyterlab/fileeditor-extension:plugin"].provides, t._pluginMap["@jupyterlab/docmanager-extension:plugin"].provides]
      }
  }
  const sE = new Map([["bazel", Qe.STARLARK], ["c", Qe.C], ["clojure", Qe.CLOJURE], ["coffeescript", Qe.COFFEESCRIPT], ["cpp", Qe.CPP], ["csharp", Qe.CSHARP], ["css", Qe.CSS], ["cuda-cpp", Qe.CUDACPP], ["dockerfile", Qe.DOCKERFILE], ["go", Qe.GO], ["groovy", Qe.GROOVY], ["handlebars", Qe.HANDLEBARS], ["haskell", Qe.HASKELL], ["html", Qe.HTML], ["ini", Qe.INI], ["java", Qe.JAVA], ["javascript", Qe.JAVASCRIPT], ["javascriptreact", Qe.JAVASCRIPT], ["json", Qe.JSON], ["jsonc", Qe.JSON], ["jsx", Qe.JAVASCRIPT], ["julia", Qe.JULIA], ["kotlin", Qe.KOTLIN], ["latex", Qe.LATEX], ["less", Qe.LESS], ["lua", Qe.LUA], ["makefile", Qe.MAKEFILE], ["markdown", Qe.MARKDOWN], ["objective-c", Qe.OBJECTIVEC], ["objective-cpp", Qe.OBJECTIVECPP], ["pbtxt", Qe.PBTXT], ["perl", Qe.PERL], ["pgsql", Qe.SQL], ["php", Qe.PHP], ["plaintext", Qe.PLAINTEXT], ["proto3", Qe.PROTOBUF], ["python", Qe.PYTHON], ["r", Qe.R], ["ruby", Qe.RUBY], ["rust", Qe.RUST], ["sass", Qe.SASS], ["scala", Qe.SCALA], ["scss", Qe.SCSS], ["shellscript", Qe.SHELL], ["sql", Qe.SQL], ["swift", Qe.SWIFT], ["terraform", Qe.HCL], ["typescript", Qe.TYPESCRIPT], ["typescriptreact", Qe.TSX], ["vb", Qe.VISUALBASIC], ["vue-html", Qe.VUE], ["vue", Qe.VUE], ["xml", Qe.XML], ["xsl", Qe.XSL], ["yaml", Qe.YAML], ["notebook-python", Qe.PYTHON], ["notebook-python-lsp", Qe.PYTHON]]);
  function oE(e) {
      return sE.get(e) ?? Qe.UNSPECIFIED
  }
  const mE = {
      UNSPECIFIED: 0,
      COLAB: 1,
      STACKBLITZ: 2,
      DEEPNOTE: 3,
      DATABRICKS: 4,
      QUADRATIC: 5,
      CUSTOM: 6
  };
  function cE(e) {
      return void 0 !== e.getLanguageIdentifier ? e.getLanguageIdentifier().language : e.getLanguageId()
  }
  class uE {
      constructor(e, t) {
          this.startLineNumber = e.lineNumber,
          this.startColumn = e.column,
          this.endLineNumber = t.lineNumber,
          this.endColumn = t.column
      }
  }
  function lE(e, t) {
      const n = "string" == typeof t ? t : t.getValue();
      if (e !== mE.DATABRICKS || !n.startsWith("%"))
          return {
              value: n,
              utf16Offset: 0
          };
      const r = n.indexOf("\n")
        , a = -1 === r ? n.length : r + 1;
      return {
          value: n.substring(a),
          utf16Offset: a
      }
  }
  function _E() {
      const e = window.colab?.global.notebookModel.fileId;
      if (void 0 !== e) {
          if ("drive" === e.source) {
              let t = e.fileId;
              return t = t.replace(/^\//, ""),
              `${t}.ipynb`
          }
          return e.fileId.replace(/^\//, "")
      }
  }
  class dE {
      modelUriToEditor = new Map;
      constructor(e, t, n) {
          this.extensionId = e,
          this.monacoSite = t,
          this.client = new Xd(e),
          this.debounceMs = n
      }
      getIdeInfo() {
          return void 0 !== window.colab ? {
              ideName: "colab",
              ideVersion: window.colabVersionTag ?? "unknown"
          } : {
              ideName: "monaco",
              ideVersion: `unknown-${window.location.hostname}`
          }
      }
      textModels(e) {
          if (this.monacoSite === mE.COLAB)
              return [...window.colab?.global.notebookModel.singleDocument.models ?? []];
          if (this.monacoSite === mE.DEEPNOTE) {
              const t = e.uri.toString().split(":")[0]
                , n = [];
              for (const [e,r] of this.modelUriToEditor)
                  e.toString().split(":")[0] === t && n.push(r);
              return n.sort(( (e, t) => (e.getDomNode()?.getBoundingClientRect().top ?? 0) - (t.getDomNode()?.getBoundingClientRect().top ?? 0))),
              n.map((e => e.getModel())).filter((e => null !== e))
          }
          return []
      }
      relativePath() {
          if (this.monacoSite === mE.COLAB)
              return _E();
          const e = window.location.href;
          return this.monacoSite === mE.DEEPNOTE || this.monacoSite === mE.DATABRICKS ? function(e) {
              const t = e.split("/").pop();
              if (void 0 !== t)
                  return `${t}.ipynb`
          }(e) : void 0
      }
      isNotebook() {
          return mE.COLAB === this.monacoSite || mE.DATABRICKS === this.monacoSite || mE.DEEPNOTE === this.monacoSite
      }
      absolutePath(e) {
          return this.monacoSite === mE.COLAB ? _E() : e.uri.path.replace(/^\//, "")
      }
      computeTextAndOffsets(e, t) {
          if (this.monacoSite === mE.DATABRICKS) {
              const n = (window.notebook?.commandCollection().models ?? []).filter((e => "command" === e.attributes.type));
              if (0 !== n.length) {
                  const r = new Map;
                  for (const e of this.modelUriToEditor.values()) {
                      const t = e.getModel();
                      if (null === t)
                          continue;
                      const n = lE(this.monacoSite, t).value;
                      r.set(n, t)
                  }
                  const a = [...n];
                  a.sort(( (e, t) => e.attributes.position - t.attributes.position));
                  const i = a.map((e => e.attributes.command))
                    , s = e.getValue();
                  let o, m;
                  for (const [e,t] of i.entries())
                      s.startsWith(t) && (void 0 === o || t.length > o.length) && (o = {
                          idx: e,
                          length: t.length
                      }),
                      t.startsWith(s) && (void 0 === m || t.length < m.length) && (m = {
                          idx: e,
                          length: t.length
                      });
                  void 0 !== o ? i[o.idx] = s : void 0 !== m && (i[m.idx] = s);
                  const c = lE(this.monacoSite, e);
                  return $d({
                      isNotebook: this.isNotebook(),
                      textModels: i.map((e => lE(this.monacoSite, e).value)),
                      currentTextModel: c.value,
                      utf16CodeUnitOffset: e.getOffsetAt(t) - c.utf16Offset,
                      getText: e => e,
                      getLanguage: (e, t) => {
                          const n = r.get(e);
                          return void 0 !== n ? oE(cE(n)) : (void 0 !== t && (e = i[t]),
                          e.startsWith("%sql") ? Qe.SQL : e.startsWith("%r") ? Qe.R : e.startsWith("%python") ? Qe.PYTHON : e.startsWith("%md") ? Qe.MARKDOWN : e.startsWith("%scala") ? Qe.SCALA : Qe.UNSPECIFIED)
                      }
                  })
              }
          }
          if (this.monacoSite === mE.COLAB) {
              const n = window.colab?.global.notebookModel.cells
                , r = []
                , a = new Map;
              for (const e of n ?? []) {
                  let t = e.textModel.getValue();
                  if ("code" === e.type) {
                      if (void 0 !== e.outputs.currentOutput && e.outputs.currentOutput.outputItems.length > 0) {
                          const n = e.outputs.currentOutput.outputItems[0].data;
                          void 0 !== n && (void 0 !== n["text/plain"] ? t = t + "\nOUTPUT:\n" + n["text/plain"].join() : void 0 !== n["text/html"] && (t = t + "\nOUTPUT:\n" + n["text/html"].join()))
                      }
                      a.set(t, oE(cE(e.textModel)))
                  }
                  r.push(t)
              }
              const i = lE(this.monacoSite, e);
              return $d({
                  isNotebook: this.isNotebook(),
                  textModels: r.map((e => lE(this.monacoSite, e).value)),
                  currentTextModel: i.value,
                  utf16CodeUnitOffset: e.getOffsetAt(t) - i.utf16Offset,
                  getText: e => e,
                  getLanguage: e => a.get(lE(this.monacoSite, e).value) ?? Qe.UNSPECIFIED
              })
          }
          return $d({
              isNotebook: this.isNotebook(),
              textModels: this.textModels(e),
              currentTextModel: e,
              utf16CodeUnitOffset: e.getOffsetAt(t) - lE(this.monacoSite, e).utf16Offset,
              getText: e => lE(this.monacoSite, e).value,
              getLanguage: e => oE(cE(e))
          })
      }
      async provideInlineCompletions(e, t) {
          const {text: n, utf8ByteOffset: r, additionalUtf8ByteOffset: a} = this.computeTextAndOffsets(e, t)
            , i = a + r
            , s = new Pu({
              metadata: this.client.getMetadata(this.getIdeInfo()),
              document: {
                  text: n,
                  editorLanguage: cE(e),
                  language: oE(cE(e)),
                  cursorOffset: BigInt(i),
                  lineEnding: "\n",
                  absoluteUri: "file:///" + this.absolutePath(e)
              },
              editorOptions: {
                  tabSize: BigInt(e.getOptions().tabSize),
                  insertSpaces: e.getOptions().insertSpaces
              }
          });
          var o;
          await (o = this.debounceMs ?? 0,
          new Promise((e => setTimeout(e, o))));
          const m = await this.client.getCompletions(s);
          if (void 0 === m)
              return;
          const c = m.completionItems.map((t => function(e, t, n, r, a) {
              if (!t.completion || !t.range)
                  return;
              const {value: i, utf16Offset: s} = lE(e, n)
                , o = n.getPositionAt(s + Wd(i, Number(t.range.startOffset) - r))
                , m = n.getPositionAt(s + Wd(i, Number(t.range.endOffset) - r))
                , c = new uE(o,m);
              let u, l = t.completion.text;
              if (a && t.suffix && t.suffix.text.length > 0) {
                  l += t.suffix.text;
                  const e = Number(t.suffix.deltaCursorOffset);
                  u = () => {
                      const t = a.getSelection();
                      if (null === t)
                          return void console.warn("Unexpected, no selection");
                      const r = n.getPositionAt(n.getOffsetAt(t.getPosition()) + e);
                      a.setSelection(new uE(r,r)),
                      a._commandService.executeCommand("editor.action.inlineSuggest.trigger")
                  }
              }
              return {
                  insertText: l,
                  text: l,
                  range: c,
                  command: {
                      id: "codeium.acceptCompletion",
                      title: "Accept Completion",
                      arguments: [t.completion.completionId, u]
                  }
              }
          }(this.monacoSite, t, e, a, this.modelUriToEditor.get(e.uri.toString())))).filter((e => void 0 !== e));
          return chrome.runtime.sendMessage(this.extensionId, {
              type: "success"
          }),
          {
              items: c
          }
      }
      handleItemDidShow() {}
      freeInlineCompletions() {}
      addEditor(e) {
          this.monacoSite !== mE.DATABRICKS && e.updateOptions({
              inlineSuggest: {
                  enabled: !0
              }
          });
          const t = e.getModel()?.uri.toString();
          var n;
          void 0 !== t && this.modelUriToEditor.set(t, e),
          e.onDidChangeModel((t => {
              const n = t.oldModelUrl?.toString();
              void 0 !== n && this.modelUriToEditor.delete(n);
              const r = t.newModelUrl?.toString();
              void 0 !== r && this.modelUriToEditor.set(r, e)
          }
          )),
          this.monacoSite === mE.DEEPNOTE && (e.onKeyDown = (n = e.onKeyDown,
          function(e, t) {
              n.call(this, function(e) {
                  return function(t) {
                      if ("Tab" !== t.browserEvent.key)
                          return e(t)
                  }
              }(e), t)
          }
          ))
      }
      async acceptedLastCompletion(e) {
          await this.client.acceptedLastCompletion(this.getIdeInfo(), e)
      }
  }
  const EE = new URLSearchParams(document.currentScript.src.split("?")[1]).get("id");
  chrome.runtime.sendMessage(EE, {
      type: "success"
  });
  const TE = new Map([[/https:\/\/colab.research\.google\.com\/.*/, mE.COLAB], [/https:\/\/(.*\.)?stackblitz\.com\/.*/, mE.STACKBLITZ], [/https:\/\/(.*\.)?deepnote\.com\/.*/, mE.DEEPNOTE], [/https:\/\/(.*\.)?(databricks\.com|azuredatabricks\.net)\/.*/, mE.DATABRICKS], [/https:\/\/(.*\.)?quadratichq\.com\/.*/, mE.QUADRATIC]])
    , fE = e => Object.defineProperties(window, {
      MonacoEnvironment: {
          get() {
              return void 0 === this._codeium_MonacoEnvironment && (this._codeium_MonacoEnvironment = {
                  globalAPI: !0
              }),
              this._codeium_MonacoEnvironment
          },
          set(e) {
              void 0 !== e && (e.globalAPI = !0),
              this._codeium_MonacoEnvironment = e
          }
      },
      monaco: {
          get() {
              return this._codeium_monaco
          },
          set(t) {
              let n = mE.CUSTOM;
              for (const [e,t] of TE)
                  if (e.test(window.location.href)) {
                      n = t;
                      break
                  }
              this._codeium_monaco = t;
              const r = new dE(EE,n,e);
              t?.languages?.registerInlineCompletionsProvider && setTimeout(( () => {
                  t.languages.registerInlineCompletionsProvider({
                      pattern: "**"
                  }, r),
                  t.editor.registerCommand("codeium.acceptCompletion", ( (e, t, n, a) => {
                      a?.(),
                      r.acceptedLastCompletion(n).catch((e => {
                          console.error(e)
                      }
                      ))
                  }
                  )),
                  t.editor.onDidCreateEditor((e => {
                      r.addEditor(e)
                  }
                  )),
                  console.log("Codeium: Activated Monaco")
              }
              ))
          }
      }
  });
  let pE = !1;
  const SE = (e, t) => {
      const n = JSON.parse(e.innerText);
      n.exposeAppInBrowser = !0,
      e.innerText = JSON.stringify(n),
      pE = !0,
      Object.defineProperty(window, "jupyterapp", {
          get: function() {
              return this._codeium_jupyterapp
          },
          set: function(e) {
              if (e?.version.startsWith("3.")) {
                  const n = iE(EE, e, t);
                  e.registerPlugin(n),
                  e.activatePlugin(n.id).then(( () => {
                      console.log("Codeium: Activated JupyterLab 3.x")
                  }
                  ), (e => {
                      console.error(e)
                  }
                  ))
              } else
                  e?.version.startsWith("4.") ? chrome.runtime.sendMessage(EE, {
                      type: "error",
                      message: "Only JupyterLab 3.x is supported. Use the codeium-jupyter extension for JupyterLab 4"
                  }) : chrome.runtime.sendMessage(EE, {
                      type: "error",
                      message: `Codeium: Unexpected JupyterLab version: ${e?.version ?? "(unknown)"}. Only JupyterLab 3.x is supported`
                  });
              this._codeium_jupyterapp = e
          }
      }),
      Object.defineProperty(window, "jupyterlab", {
          get: function() {
              return this._codeium_jupyterlab
          },
          set: function(e) {
              if (e?.version.startsWith("2.")) {
                  const n = iE(EE, e, t);
                  e.registerPlugin(n),
                  e.activatePlugin(n.id).then(( () => {
                      console.log("Codeium: Activated JupyterLab 2.x")
                  }
                  ), (e => {
                      console.error(e)
                  }
                  ))
              }
              this._codeium_jupyterlab = e
          }
      })
  }
    , NE = [{
      name: "JSFiddle",
      pattern: /https?:\/\/(.*\.)?jsfiddle\.net(\/.*)?/,
      multiplayer: !1
  }, {
      name: "CodePen",
      pattern: /https:\/\/(.*\.)?codepen\.io(\/.*)?/,
      multiplayer: !1
  }, {
      name: "CodeShare",
      pattern: /https:\/\/(.*\.)?codeshare\.io(\/.*)?/,
      multiplayer: !0
  }]
    , gE = (e, t) => Object.defineProperty(window, "CodeMirror", {
      get: function() {
          return this._codeium_CodeMirror
      },
      set: function(n) {
          if (this._codeium_CodeMirror = n,
          !pE)
              if (n?.version?.startsWith("5."))
                  if (Object.prototype.hasOwnProperty.call(this, "Jupyter")) {
                      if (pE = !0,
                      void 0 === e)
                          return void console.warn("Codeium: found no keybindings for Jupyter Notebook");
                      {
                          const r = function(e, t, n, r) {
                              const a = new eE(e,t,n);
                              return a.patchCellKeyEvent(r),
                              a.patchShortcutManagerHandler(),
                              a
                          }(EE, this.Jupyter, e, t);
                          !function(e, t) {
                              e.defineInitHook(t.clearCompletionInitHook())
                          }(n, r.codeMirrorManager),
                          console.log("Codeium: Activating Jupyter Notebook")
                      }
                  } else {
                      let e = !1
                        , r = "";
                      for (const t of NE)
                          if (t.pattern.test(window.location.href)) {
                              r = t.name,
                              pE = !0,
                              e = t.multiplayer;
                              break
                          }
                      pE && (new Zd(EE,n,e,t),
                      console.log(`Codeium: Activating CodeMirror Site: ${r}`))
                  }
              else
                  console.warn("Codeium: Codeium doesn't support CodeMirror 6")
      }
  })
    , IE = [{
      pattern: /https:\/\/console\.paperspace\.com\/.*\/notebook\/.*/,
      notebook: !0
  }, {
      pattern: /https?:\/\/www\.codewars\.com(\/.*)?/,
      notebook: !1
  }, {
      pattern: /https:\/\/(.*\.)?github\.com(\/.*)?/,
      notebook: !1
  }]
    , CE = new Zd(EE,void 0,!1)
    , OE = CE.editorHook()
    , yE = () => {
      const e = setInterval(( () => {
          if (pE)
              return void clearInterval(e);
          let t = !1;
          for (const e of IE)
              if (e.pattern.test(window.location.href)) {
                  t = e.notebook;
                  break
              }
          const n = new Map;
          for (const e of document.getElementsByClassName("CodeMirror")) {
              const r = e;
              if (void 0 === r.CodeMirror)
                  continue;
              const a = r.CodeMirror;
              OE(a),
              t && n.set(a.getDoc(), e.getBoundingClientRect().top)
          }
          if (t) {
              const e = [...n.entries()].sort(( (e, t) => e[1] - t[1])).map(( ([e]) => e));
              CE.docs = e
          }
      }
      ), 500)
  }
  ;
  Promise.all([async function(e) {
      return await new Promise((t => {
          chrome.runtime.sendMessage(e, {
              type: "jupyter_notebook_allowed_and_keybindings"
          }, (e => {
              t(e)
          }
          ))
      }
      ))
  }(EE), async function(e) {
      return await new Promise((t => {
          chrome.runtime.sendMessage(e, {
              type: "debounce_ms"
          }, (e => {
              t(e)
          }
          ))
      }
      ))
  }(EE)]).then(( ([e,t]) => {
      const n = e.allowed
        , r = e.keyBindings
        , a = t.debounceMs
        , i = ["monaco", "codemirror5", "none"]
        , s = document.querySelector('meta[name="codeium:type"]')
        , o = s?.getAttribute("content")?.split(",").map((e => e.toLowerCase().trim())).filter((e => i.includes(e))) ?? [];
      if (o.includes("none"))
          return;
      const m = document.getElementById("jupyter-config-data");
      if (null === m)
          return o.includes("monaco") && fE(a),
          o.includes("codemirror5") && (gE(r, a),
          yE()),
          0 === o.length && n ? (fE(a),
          gE(r, a),
          void yE()) : void 0;
      SE(m, a)
  }
  ), (e => {
      console.error(e)
  }
  ))
}
)();
