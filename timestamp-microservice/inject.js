(() => {
class DOMSerializer {
  /**
  Create a serializer. `nodes` should map node names to functions
  that take a node and return a description of the corresponding
  DOM. `marks` does the same for mark names, but also gets an
  argument that tells it whether the mark's content is block or
  inline content (for typical use, it'll always be inline). A mark
  serializer may be `null` to indicate that marks of that type
  should not be serialized.
  */
  constructor(nodes, marks) {
    this.nodes = nodes;
    this.marks = marks;
  }
  /**
  Serialize the content of this fragment to a DOM fragment. When
  not in the browser, the `document` option, containing a DOM
  document, should be passed so that the serializer can create
  nodes.
  */
  serializeFragment(fragment, options = {}, target) {
    if (!target)
      target = doc(options).createDocumentFragment();
    let top = target, active2 = [];
    fragment.forEach((node) => {
      if (active2.length || node.marks.length) {
        let keep = 0, rendered = 0;
        while (keep < active2.length && rendered < node.marks.length) {
          let next = node.marks[rendered];
          if (!this.marks[next.type.name]) {
            rendered++;
            continue;
          }
          if (!next.eq(active2[keep][0]) || next.type.spec.spanning === false)
            break;
          keep++;
          rendered++;
        }
        while (keep < active2.length)
          top = active2.pop()[1];
        while (rendered < node.marks.length) {
          let add = node.marks[rendered++];
          let markDOM = this.serializeMark(add, node.isInline, options);
          if (markDOM) {
            active2.push([add, top]);
            top.appendChild(markDOM.dom);
            top = markDOM.contentDOM || markDOM.dom;
          }
        }
      }
      top.appendChild(this.serializeNodeInner(node, options));
    });
    return target;
  }
  /**
  @internal
  */
  serializeNodeInner(node, options) {
    let { dom, contentDOM } = DOMSerializer.renderSpec(doc(options), this.nodes[node.type.name](node));
    if (contentDOM) {
      if (node.isLeaf)
        throw new RangeError("Content hole not allowed in a leaf node spec");
      this.serializeFragment(node.content, options, contentDOM);
    }
    return dom;
  }
  /**
  Serialize this node to a DOM node. This can be useful when you
  need to serialize a part of a document, as opposed to the whole
  document. To serialize a whole document, use
  [`serializeFragment`](https://prosemirror.net/docs/ref/#model.DOMSerializer.serializeFragment) on
  its [content](https://prosemirror.net/docs/ref/#model.Node.content).
  */
  serializeNode(node, options = {}) {
    let dom = this.serializeNodeInner(node, options);
    for (let i = node.marks.length - 1; i >= 0; i--) {
      let wrap = this.serializeMark(node.marks[i], node.isInline, options);
      if (wrap) {
        (wrap.contentDOM || wrap.dom).appendChild(dom);
        dom = wrap.dom;
      }
    }
    return dom;
  }
  /**
  @internal
  */
  serializeMark(mark, inline, options = {}) {
    let toDOM = this.marks[mark.type.name];
    return toDOM && DOMSerializer.renderSpec(doc(options), toDOM(mark, inline));
  }
  /**
  Render an [output spec](https://prosemirror.net/docs/ref/#model.DOMOutputSpec) to a DOM node. If
  the spec has a hole (zero) in it, `contentDOM` will point at the
  node with the hole.
  */
  static renderSpec(doc2, structure, xmlNS = null) {
    if (typeof structure == "string")
      return { dom: doc2.createTextNode(structure) };
    if (structure.nodeType != null)
      return { dom: structure };
    if (structure.dom && structure.dom.nodeType != null)
      return structure;
    let tagName = structure[0], space2 = tagName.indexOf(" ");
    if (space2 > 0) {
      xmlNS = tagName.slice(0, space2);
      tagName = tagName.slice(space2 + 1);
    }
    let contentDOM;
    let dom = xmlNS ? doc2.createElementNS(xmlNS, tagName) : doc2.createElement(tagName);
    let attrs = structure[1], start = 1;
    if (attrs && typeof attrs == "object" && attrs.nodeType == null && !Array.isArray(attrs)) {
      start = 2;
      for (let name in attrs)
        if (attrs[name] != null) {
          let space3 = name.indexOf(" ");
          if (space3 > 0)
            dom.setAttributeNS(name.slice(0, space3), name.slice(space3 + 1), attrs[name]);
          else
            dom.setAttribute(name, attrs[name]);
        }
    }
    for (let i = start; i < structure.length; i++) {
      let child = structure[i];
      if (child === 0) {
        if (i < structure.length - 1 || i > start)
          throw new RangeError("Content hole must be the only child of its parent node");
        return { dom, contentDOM: dom };
      } else {
        let { dom: inner, contentDOM: innerContent } = DOMSerializer.renderSpec(doc2, child, xmlNS);
        dom.appendChild(inner);
        if (innerContent) {
          if (contentDOM)
            throw new RangeError("Multiple content holes");
          contentDOM = innerContent;
        }
      }
    }
    return { dom, contentDOM };
  }
  /**
  Build a serializer using the [`toDOM`](https://prosemirror.net/docs/ref/#model.NodeSpec.toDOM)
  properties in a schema's node and mark specs.
  */
  static fromSchema(schema) {
    return schema.cached.domSerializer || (schema.cached.domSerializer = new DOMSerializer(this.nodesFromSchema(schema), this.marksFromSchema(schema)));
  }
  /**
  Gather the serializers in a schema's node specs into an object.
  This can be useful as a base to build a custom serializer from.
  */
  static nodesFromSchema(schema) {
    let result = gatherToDOM(schema.nodes);
    if (!result.text)
      result.text = (node) => node.text;
    return result;
  }
  /**
  Gather the serializers in a schema's mark specs into an object.
  */
  static marksFromSchema(schema) {
    return gatherToDOM(schema.marks);
  }
}
function gatherToDOM(obj) {
  let result = {};
  for (let name in obj) {
    let toDOM = obj[name].spec.toDOM;
    if (toDOM)
      result[name] = toDOM;
  }
  return result;
}
function doc(options) {
  return options.document || window.document;
}
function style_html(html_source, options) {
  var multi_parser, indent_size, indent_character, max_char, brace_style, unformatted;
  options = options || {};
  indent_size = options.indent_size || 4;
  indent_character = options.indent_char || " ";
  brace_style = options.brace_style || "collapse";
  max_char = options.max_char == 0 ? Infinity : options.max_char || 70;
  unformatted = options.unformatted || ["a", "span", "bdo", "em", "strong", "dfn", "code", "samp", "kbd", "var", "cite", "abbr", "acronym", "q", "sub", "sup", "tt", "i", "b", "big", "small", "u", "s", "strike", "font", "ins", "del", "pre", "address", "dt", "h1", "h2", "h3", "h4", "h5", "h6"];
  function Parser() {
    this.pos = 0;
    this.token = "";
    this.current_mode = "CONTENT";
    this.tags = {
      //An object to hold tags, their position, and their parent-tags, initiated with default values
      parent: "parent1",
      parentcount: 1,
      parent1: ""
    };
    this.tag_type = "";
    this.token_text = this.last_token = this.last_text = this.token_type = "";
    this.Utils = {
      //Uilities made available to the various functions
      whitespace: "\n\r	 ".split(""),
      single_token: "br,input,link,meta,!doctype,basefont,base,area,hr,wbr,param,img,isindex,?xml,embed,?php,?,?=".split(","),
      //all the single tags for HTML
      extra_liners: "head,body,/html".split(","),
      //for tags that need a line of whitespace before them
      in_array: function(what, arr) {
        for (var i = 0; i < arr.length; i++) {
          if (what === arr[i]) {
            return true;
          }
        }
        return false;
      }
    };
    this.get_content = function() {
      var input_char = "", content = [], space2 = false;
      while (this.input.charAt(this.pos) !== "<") {
        if (this.pos >= this.input.length) {
          return content.length ? content.join("") : ["", "TK_EOF"];
        }
        input_char = this.input.charAt(this.pos);
        this.pos++;
        this.line_char_count++;
        if (this.Utils.in_array(input_char, this.Utils.whitespace)) {
          if (content.length) {
            space2 = true;
          }
          this.line_char_count--;
          continue;
        } else if (space2) {
          if (this.line_char_count >= this.max_char) {
            content.push("\n");
            for (var i = 0; i < this.indent_level; i++) {
              content.push(this.indent_string);
            }
            this.line_char_count = 0;
          } else {
            content.push(" ");
            this.line_char_count++;
          }
          space2 = false;
        }
        content.push(input_char);
      }
      return content.length ? content.join("") : "";
    };
    this.get_contents_to = function(name) {
      if (this.pos == this.input.length) {
        return ["", "TK_EOF"];
      }
      var content = "";
      var reg_match = new RegExp("</" + name + "\\s*>", "igm");
      reg_match.lastIndex = this.pos;
      var reg_array = reg_match.exec(this.input);
      var end_script = reg_array ? reg_array.index : this.input.length;
      if (this.pos < end_script) {
        content = this.input.substring(this.pos, end_script);
        this.pos = end_script;
      }
      return content;
    };
    this.record_tag = function(tag) {
      if (this.tags[tag + "count"]) {
        this.tags[tag + "count"]++;
        this.tags[tag + this.tags[tag + "count"]] = this.indent_level;
      } else {
        this.tags[tag + "count"] = 1;
        this.tags[tag + this.tags[tag + "count"]] = this.indent_level;
      }
      this.tags[tag + this.tags[tag + "count"] + "parent"] = this.tags.parent;
      this.tags.parent = tag + this.tags[tag + "count"];
    };
    this.retrieve_tag = function(tag) {
      if (this.tags[tag + "count"]) {
        var temp_parent = this.tags.parent;
        while (temp_parent) {
          if (tag + this.tags[tag + "count"] === temp_parent) {
            break;
          }
          temp_parent = this.tags[temp_parent + "parent"];
        }
        if (temp_parent) {
          this.indent_level = this.tags[tag + this.tags[tag + "count"]];
          this.tags.parent = this.tags[temp_parent + "parent"];
        }
        delete this.tags[tag + this.tags[tag + "count"] + "parent"];
        delete this.tags[tag + this.tags[tag + "count"]];
        if (this.tags[tag + "count"] == 1) {
          delete this.tags[tag + "count"];
        } else {
          this.tags[tag + "count"]--;
        }
      }
    };
    this.get_tag = function() {
      var input_char = "", content = [], space2 = false, tag_start, tag_end;
      do {
        if (this.pos >= this.input.length) {
          return content.length ? content.join("") : ["", "TK_EOF"];
        }
        input_char = this.input.charAt(this.pos);
        this.pos++;
        this.line_char_count++;
        if (this.Utils.in_array(input_char, this.Utils.whitespace)) {
          space2 = true;
          this.line_char_count--;
          continue;
        }
        if (input_char === "'" || input_char === '"') {
          if (!content[1] || content[1] !== "!") {
            input_char += this.get_unformatted(input_char);
            space2 = true;
          }
        }
        if (input_char === "=") {
          space2 = false;
        }
        if (content.length && content[content.length - 1] !== "=" && input_char !== ">" && space2) {
          if (this.line_char_count >= this.max_char) {
            this.print_newline(false, content);
            this.line_char_count = 0;
          } else {
            content.push(" ");
            this.line_char_count++;
          }
          space2 = false;
        }
        if (input_char === "<") {
          tag_start = this.pos - 1;
        }
        content.push(input_char);
      } while (input_char !== ">");
      var tag_complete = content.join("");
      var tag_index;
      if (tag_complete.indexOf(" ") != -1) {
        tag_index = tag_complete.indexOf(" ");
      } else {
        tag_index = tag_complete.indexOf(">");
      }
      var tag_check2 = tag_complete.substring(1, tag_index).toLowerCase();
      if (tag_complete.charAt(tag_complete.length - 2) === "/" || this.Utils.in_array(tag_check2, this.Utils.single_token)) {
        this.tag_type = "SINGLE";
      } else if (tag_check2 === "script") {
        this.record_tag(tag_check2);
        this.tag_type = "SCRIPT";
      } else if (tag_check2 === "style") {
        this.record_tag(tag_check2);
        this.tag_type = "STYLE";
      } else if (this.Utils.in_array(tag_check2, unformatted)) {
        var comment = this.get_unformatted("</" + tag_check2 + ">", tag_complete);
        content.push(comment);
        if (tag_start > 0 && this.Utils.in_array(this.input.charAt(tag_start - 1), this.Utils.whitespace)) {
          content.splice(0, 0, this.input.charAt(tag_start - 1));
        }
        tag_end = this.pos - 1;
        if (this.Utils.in_array(this.input.charAt(tag_end + 1), this.Utils.whitespace)) {
          content.push(this.input.charAt(tag_end + 1));
        }
        this.tag_type = "SINGLE";
      } else if (tag_check2.charAt(0) === "!") {
        if (tag_check2.indexOf("[if") != -1) {
          if (tag_complete.indexOf("!IE") != -1) {
            var comment = this.get_unformatted("-->", tag_complete);
            content.push(comment);
          }
          this.tag_type = "START";
        } else if (tag_check2.indexOf("[endif") != -1) {
          this.tag_type = "END";
          this.unindent();
        } else if (tag_check2.indexOf("[cdata[") != -1) {
          var comment = this.get_unformatted("]]>", tag_complete);
          content.push(comment);
          this.tag_type = "SINGLE";
        } else {
          var comment = this.get_unformatted("-->", tag_complete);
          content.push(comment);
          this.tag_type = "SINGLE";
        }
      } else {
        if (tag_check2.charAt(0) === "/") {
          this.retrieve_tag(tag_check2.substring(1));
          this.tag_type = "END";
        } else {
          this.record_tag(tag_check2);
          this.tag_type = "START";
        }
        if (this.Utils.in_array(tag_check2, this.Utils.extra_liners)) {
          this.print_newline(true, this.output);
        }
      }
      return content.join("");
    };
    this.get_unformatted = function(delimiter, orig_tag) {
      if (orig_tag && orig_tag.toLowerCase().indexOf(delimiter) != -1) {
        return "";
      }
      var input_char = "";
      var content = "";
      var space2 = true;
      do {
        if (this.pos >= this.input.length) {
          return content;
        }
        input_char = this.input.charAt(this.pos);
        this.pos++;
        if (this.Utils.in_array(input_char, this.Utils.whitespace)) {
          if (!space2) {
            this.line_char_count--;
            continue;
          }
          if (input_char === "\n" || input_char === "\r") {
            content += "\n";
            this.line_char_count = 0;
            continue;
          }
        }
        content += input_char;
        this.line_char_count++;
        space2 = true;
      } while (content.toLowerCase().indexOf(delimiter) == -1);
      return content;
    };
    this.get_token = function() {
      var token;
      if (this.last_token === "TK_TAG_SCRIPT" || this.last_token === "TK_TAG_STYLE") {
        var type = this.last_token.substr(7);
        token = this.get_contents_to(type);
        if (typeof token !== "string") {
          return token;
        }
        return [token, "TK_" + type];
      }
      if (this.current_mode === "CONTENT") {
        token = this.get_content();
        if (typeof token !== "string") {
          return token;
        } else {
          return [token, "TK_CONTENT"];
        }
      }
      if (this.current_mode === "TAG") {
        token = this.get_tag();
        if (typeof token !== "string") {
          return token;
        } else {
          var tag_name_type = "TK_TAG_" + this.tag_type;
          return [token, tag_name_type];
        }
      }
    };
    this.get_full_indent = function(level) {
      level = this.indent_level + level || 0;
      if (level < 1)
        return "";
      return Array(level + 1).join(this.indent_string);
    };
    this.printer = function(js_source, indent_character2, indent_size2, max_char2, brace_style2) {
      this.input = js_source || "";
      this.output = [];
      this.indent_character = indent_character2;
      this.indent_string = "";
      this.indent_size = indent_size2;
      this.brace_style = brace_style2;
      this.indent_level = 0;
      this.max_char = max_char2;
      this.line_char_count = 0;
      for (var i = 0; i < this.indent_size; i++) {
        this.indent_string += this.indent_character;
      }
      this.print_newline = function(ignore, arr) {
        this.line_char_count = 0;
        if (!arr || !arr.length) {
          return;
        }
        if (!ignore) {
          while (this.Utils.in_array(arr[arr.length - 1], this.Utils.whitespace)) {
            arr.pop();
          }
        }
        arr.push("\n");
        for (var i2 = 0; i2 < this.indent_level; i2++) {
          arr.push(this.indent_string);
        }
      };
      this.print_token = function(text3) {
        this.output.push(text3);
      };
      this.indent = function() {
        this.indent_level++;
      };
      this.unindent = function() {
        if (this.indent_level > 0) {
          this.indent_level--;
        }
      };
    };
    return this;
  }
  multi_parser = new Parser();
  multi_parser.printer(html_source, indent_character, indent_size, max_char, brace_style);
  while (true) {
    var t = multi_parser.get_token();
    multi_parser.token_text = t[0];
    multi_parser.token_type = t[1];
    if (multi_parser.token_type === "TK_EOF") {
      break;
    }
    switch (multi_parser.token_type) {
      case "TK_TAG_START":
        multi_parser.print_newline(false, multi_parser.output);
        multi_parser.print_token(multi_parser.token_text);
        multi_parser.indent();
        multi_parser.current_mode = "CONTENT";
        break;
      case "TK_TAG_STYLE":
      case "TK_TAG_SCRIPT":
        multi_parser.print_newline(false, multi_parser.output);
        multi_parser.print_token(multi_parser.token_text);
        multi_parser.current_mode = "CONTENT";
        break;
      case "TK_TAG_END":
        if (multi_parser.last_token === "TK_CONTENT" && multi_parser.last_text === "") {
          var tag_name = multi_parser.token_text.match(/\w+/)[0];
          var tag_extracted_from_last_output = multi_parser.output[multi_parser.output.length - 1].match(/<\s*(\w+)/);
          if (tag_extracted_from_last_output === null || tag_extracted_from_last_output[1] !== tag_name)
            multi_parser.print_newline(true, multi_parser.output);
        }
        multi_parser.print_token(multi_parser.token_text);
        multi_parser.current_mode = "CONTENT";
        break;
      case "TK_TAG_SINGLE":
        var tag_check = multi_parser.token_text.match(/^\s*<([a-z]+)/i);
        if (!tag_check || !multi_parser.Utils.in_array(tag_check[1], unformatted)) {
          multi_parser.print_newline(false, multi_parser.output);
        }
        multi_parser.print_token(multi_parser.token_text);
        multi_parser.current_mode = "CONTENT";
        break;
      case "TK_CONTENT":
        if (multi_parser.token_text !== "") {
          multi_parser.print_token(multi_parser.token_text);
        }
        multi_parser.current_mode = "TAG";
        break;
      case "TK_STYLE":
      case "TK_SCRIPT":
        if (multi_parser.token_text !== "") {
          multi_parser.output.push("\n");
          var text2 = multi_parser.token_text;
          if (multi_parser.token_type == "TK_SCRIPT") {
            var _beautifier = typeof js_beautify == "function" && js_beautify;
          } else if (multi_parser.token_type == "TK_STYLE") {
            var _beautifier = typeof css_beautify == "function" && css_beautify;
          }
          if (options.indent_scripts == "keep") {
            var script_indent_level = 0;
          } else if (options.indent_scripts == "separate") {
            var script_indent_level = -multi_parser.indent_level;
          } else {
            var script_indent_level = 1;
          }
          var indentation = multi_parser.get_full_indent(script_indent_level);
          if (_beautifier) {
            text2 = _beautifier(text2.replace(/^\s*/, indentation), options);
          } else {
            var white = text2.match(/^\s*/)[0];
            var _level = white.match(/[^\n\r]*$/)[0].split(multi_parser.indent_string).length - 1;
            var reindent = multi_parser.get_full_indent(script_indent_level - _level);
            text2 = text2.replace(/^\s*/, indentation).replace(/\r\n|\r|\n/g, "\n" + reindent).replace(/\s*$/, "");
          }
          if (text2) {
            multi_parser.print_token(text2);
            multi_parser.print_newline(true, multi_parser.output);
          }
        }
        multi_parser.current_mode = "TAG";
        break;
    }
    multi_parser.last_token = multi_parser.token_type;
    multi_parser.last_text = multi_parser.token_text;
  }
  return multi_parser.output.join("");
}
var html = {
  prettyPrint: style_html
};
function __rest(s, e) {
  var t = {};
  for (var p in s)
    if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
      t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function")
    for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
      if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
        t[p[i]] = s[p[i]];
    }
  return t;
}
typeof SuppressedError === "function" ? SuppressedError : function(error, suppressed, message) {
  var e = new Error(message);
  return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};
function noop() {
}
function assign(tar, src) {
  for (const k in src)
    tar[k] = src[k];
  return (
    /** @type {T & S} */
    tar
  );
}
function run(fn) {
  return fn();
}
function blank_object() {
  return /* @__PURE__ */ Object.create(null);
}
function run_all(fns) {
  fns.forEach(run);
}
function is_function(thing) {
  return typeof thing === "function";
}
function safe_not_equal(a, b) {
  return a != a ? b == b : a !== b || a && typeof a === "object" || typeof a === "function";
}
function is_empty(obj) {
  return Object.keys(obj).length === 0;
}
function subscribe(store) {
  for (var _len = arguments.length, callbacks = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    callbacks[_key - 1] = arguments[_key];
  }
  if (store == null) {
    for (const callback of callbacks) {
      callback(void 0);
    }
    return noop;
  }
  const unsub = store.subscribe(...callbacks);
  return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
}
function get_store_value(store) {
  let value;
  subscribe(store, (_) => value = _)();
  return value;
}
function component_subscribe(component, store, callback) {
  component.$$.on_destroy.push(subscribe(store, callback));
}
function create_slot(definition, ctx, $$scope, fn) {
  if (definition) {
    const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
    return definition[0](slot_ctx);
  }
}
function get_slot_context(definition, ctx, $$scope, fn) {
  return definition[1] && fn ? assign($$scope.ctx.slice(), definition[1](fn(ctx))) : $$scope.ctx;
}
function get_slot_changes(definition, $$scope, dirty, fn) {
  if (definition[2] && fn) {
    const lets = definition[2](fn(dirty));
    if ($$scope.dirty === void 0) {
      return lets;
    }
    if (typeof lets === "object") {
      const merged = [];
      const len = Math.max($$scope.dirty.length, lets.length);
      for (let i = 0; i < len; i += 1) {
        merged[i] = $$scope.dirty[i] | lets[i];
      }
      return merged;
    }
    return $$scope.dirty | lets;
  }
  return $$scope.dirty;
}
function update_slot_base(slot, slot_definition, ctx, $$scope, slot_changes, get_slot_context_fn) {
  if (slot_changes) {
    const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
    slot.p(slot_context, slot_changes);
  }
}
function get_all_dirty_from_scope($$scope) {
  if ($$scope.ctx.length > 32) {
    const dirty = [];
    const length = $$scope.ctx.length / 32;
    for (let i = 0; i < length; i++) {
      dirty[i] = -1;
    }
    return dirty;
  }
  return -1;
}
function exclude_internal_props(props) {
  const result = {};
  for (const k in props)
    if (k[0] !== "$")
      result[k] = props[k];
  return result;
}
function null_to_empty(value) {
  return value == null ? "" : value;
}
function action_destroyer(action_result) {
  return action_result && is_function(action_result.destroy) ? action_result.destroy : noop;
}
function append(target, node) {
  target.appendChild(node);
}
function append_styles(target, style_sheet_id, styles) {
  const append_styles_to = get_root_for_style(target);
  if (!append_styles_to.getElementById(style_sheet_id)) {
    const style = element("style");
    style.id = style_sheet_id;
    style.textContent = styles;
    append_stylesheet(append_styles_to, style);
  }
}
function get_root_for_style(node) {
  if (!node)
    return document;
  const root = node.getRootNode ? node.getRootNode() : node.ownerDocument;
  if (root && /** @type {ShadowRoot} */
  root.host) {
    return (
      /** @type {ShadowRoot} */
      root
    );
  }
  return node.ownerDocument;
}
function append_stylesheet(node, style) {
  append(
    /** @type {Document} */
    node.head || node,
    style
  );
  return style.sheet;
}
function insert(target, node, anchor) {
  target.insertBefore(node, anchor || null);
}
function detach(node) {
  if (node.parentNode) {
    node.parentNode.removeChild(node);
  }
}
function destroy_each(iterations, detaching) {
  for (let i = 0; i < iterations.length; i += 1) {
    if (iterations[i])
      iterations[i].d(detaching);
  }
}
function element(name) {
  return document.createElement(name);
}
function svg_element(name) {
  return document.createElementNS("http://www.w3.org/2000/svg", name);
}
function text(data) {
  return document.createTextNode(data);
}
function space() {
  return text(" ");
}
function empty() {
  return text("");
}
function listen(node, event, handler, options) {
  node.addEventListener(event, handler, options);
  return () => node.removeEventListener(event, handler, options);
}
function prevent_default(fn) {
  return function(event) {
    event.preventDefault();
    return fn.call(this, event);
  };
}
function attr(node, attribute, value) {
  if (value == null)
    node.removeAttribute(attribute);
  else if (node.getAttribute(attribute) !== value)
    node.setAttribute(attribute, value);
}
function xlink_attr(node, attribute, value) {
  node.setAttributeNS("http://www.w3.org/1999/xlink", attribute, value);
}
function children(element2) {
  return Array.from(element2.childNodes);
}
function set_data(text2, data) {
  data = "" + data;
  if (text2.data === data)
    return;
  text2.data = /** @type {string} */
  data;
}
function set_input_value(input, value) {
  input.value = value == null ? "" : value;
}
function set_style(node, key, value, important) {
  {
    node.style.setProperty(key, value, "");
  }
}
function toggle_class(element2, name, toggle) {
  element2.classList.toggle(name, !!toggle);
}
function custom_event(type, detail) {
  let {
    bubbles = false,
    cancelable = false
  } = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
  return new CustomEvent(type, {
    detail,
    bubbles,
    cancelable
  });
}
function construct_svelte_component(component, props) {
  return new component(props);
}
let current_component;
function set_current_component(component) {
  current_component = component;
}
function get_current_component() {
  if (!current_component)
    throw new Error("Function called outside component initialization");
  return current_component;
}
function onMount(fn) {
  get_current_component().$$.on_mount.push(fn);
}
function onDestroy(fn) {
  get_current_component().$$.on_destroy.push(fn);
}
function createEventDispatcher() {
  const component = get_current_component();
  return function(type, detail) {
    let {
      cancelable = false
    } = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
    const callbacks = component.$$.callbacks[type];
    if (callbacks) {
      const event = custom_event(
        /** @type {string} */
        type,
        detail,
        {
          cancelable
        }
      );
      callbacks.slice().forEach((fn) => {
        fn.call(component, event);
      });
      return !event.defaultPrevented;
    }
    return true;
  };
}
function setContext$1(key, context) {
  get_current_component().$$.context.set(key, context);
  return context;
}
function getContext$1(key) {
  return get_current_component().$$.context.get(key);
}
function bubble(component, event) {
  const callbacks = component.$$.callbacks[event.type];
  if (callbacks) {
    callbacks.slice().forEach((fn) => fn.call(this, event));
  }
}
const dirty_components = [];
const binding_callbacks = [];
let render_callbacks = [];
const flush_callbacks = [];
const resolved_promise = /* @__PURE__ */ Promise.resolve();
let update_scheduled = false;
function schedule_update() {
  if (!update_scheduled) {
    update_scheduled = true;
    resolved_promise.then(flush);
  }
}
function add_render_callback(fn) {
  render_callbacks.push(fn);
}
const seen_callbacks = /* @__PURE__ */ new Set();
let flushidx = 0;
function flush() {
  if (flushidx !== 0) {
    return;
  }
  const saved_component = current_component;
  do {
    try {
      while (flushidx < dirty_components.length) {
        const component = dirty_components[flushidx];
        flushidx++;
        set_current_component(component);
        update(component.$$);
      }
    } catch (e) {
      dirty_components.length = 0;
      flushidx = 0;
      throw e;
    }
    set_current_component(null);
    dirty_components.length = 0;
    flushidx = 0;
    while (binding_callbacks.length)
      binding_callbacks.pop()();
    for (let i = 0; i < render_callbacks.length; i += 1) {
      const callback = render_callbacks[i];
      if (!seen_callbacks.has(callback)) {
        seen_callbacks.add(callback);
        callback();
      }
    }
    render_callbacks.length = 0;
  } while (dirty_components.length);
  while (flush_callbacks.length) {
    flush_callbacks.pop()();
  }
  update_scheduled = false;
  seen_callbacks.clear();
  set_current_component(saved_component);
}
function update($$) {
  if ($$.fragment !== null) {
    $$.update();
    run_all($$.before_update);
    const dirty = $$.dirty;
    $$.dirty = [-1];
    $$.fragment && $$.fragment.p($$.ctx, dirty);
    $$.after_update.forEach(add_render_callback);
  }
}
function flush_render_callbacks(fns) {
  const filtered = [];
  const targets = [];
  render_callbacks.forEach((c) => fns.indexOf(c) === -1 ? filtered.push(c) : targets.push(c));
  targets.forEach((c) => c());
  render_callbacks = filtered;
}
const outroing = /* @__PURE__ */ new Set();
let outros;
function group_outros() {
  outros = {
    r: 0,
    c: [],
    p: outros
    // parent group
  };
}
function check_outros() {
  if (!outros.r) {
    run_all(outros.c);
  }
  outros = outros.p;
}
function transition_in(block, local) {
  if (block && block.i) {
    outroing.delete(block);
    block.i(local);
  }
}
function transition_out(block, local, detach2, callback) {
  if (block && block.o) {
    if (outroing.has(block))
      return;
    outroing.add(block);
    outros.c.push(() => {
      outroing.delete(block);
      if (callback) {
        if (detach2)
          block.d(1);
        callback();
      }
    });
    block.o(local);
  } else if (callback) {
    callback();
  }
}
function ensure_array_like(array_like_or_iterator) {
  return (array_like_or_iterator === null || array_like_or_iterator === void 0 ? void 0 : array_like_or_iterator.length) !== void 0 ? array_like_or_iterator : Array.from(array_like_or_iterator);
}
function destroy_block(block, lookup) {
  block.d(1);
  lookup.delete(block.key);
}
function update_keyed_each(old_blocks, dirty, get_key, dynamic, ctx, list, lookup, node, destroy, create_each_block2, next, get_context) {
  let o = old_blocks.length;
  let n = list.length;
  let i = o;
  const old_indexes = {};
  while (i--)
    old_indexes[old_blocks[i].key] = i;
  const new_blocks = [];
  const new_lookup = /* @__PURE__ */ new Map();
  const deltas = /* @__PURE__ */ new Map();
  const updates = [];
  i = n;
  while (i--) {
    const child_ctx = get_context(ctx, list, i);
    const key = get_key(child_ctx);
    let block = lookup.get(key);
    if (!block) {
      block = create_each_block2(key, child_ctx);
      block.c();
    } else {
      updates.push(() => block.p(child_ctx, dirty));
    }
    new_lookup.set(key, new_blocks[i] = block);
    if (key in old_indexes)
      deltas.set(key, Math.abs(i - old_indexes[key]));
  }
  const will_move = /* @__PURE__ */ new Set();
  const did_move = /* @__PURE__ */ new Set();
  function insert2(block) {
    transition_in(block, 1);
    block.m(node, next);
    lookup.set(block.key, block);
    next = block.first;
    n--;
  }
  while (o && n) {
    const new_block = new_blocks[n - 1];
    const old_block = old_blocks[o - 1];
    const new_key = new_block.key;
    const old_key = old_block.key;
    if (new_block === old_block) {
      next = new_block.first;
      o--;
      n--;
    } else if (!new_lookup.has(old_key)) {
      destroy(old_block, lookup);
      o--;
    } else if (!lookup.has(new_key) || will_move.has(new_key)) {
      insert2(new_block);
    } else if (did_move.has(old_key)) {
      o--;
    } else if (deltas.get(new_key) > deltas.get(old_key)) {
      did_move.add(new_key);
      insert2(new_block);
    } else {
      will_move.add(old_key);
      o--;
    }
  }
  while (o--) {
    const old_block = old_blocks[o];
    if (!new_lookup.has(old_block.key))
      destroy(old_block, lookup);
  }
  while (n)
    insert2(new_blocks[n - 1]);
  run_all(updates);
  return new_blocks;
}
function create_component(block) {
  block && block.c();
}
function mount_component(component, target, anchor) {
  const {
    fragment,
    after_update
  } = component.$$;
  fragment && fragment.m(target, anchor);
  add_render_callback(() => {
    const new_on_destroy = component.$$.on_mount.map(run).filter(is_function);
    if (component.$$.on_destroy) {
      component.$$.on_destroy.push(...new_on_destroy);
    } else {
      run_all(new_on_destroy);
    }
    component.$$.on_mount = [];
  });
  after_update.forEach(add_render_callback);
}
function destroy_component(component, detaching) {
  const $$ = component.$$;
  if ($$.fragment !== null) {
    flush_render_callbacks($$.after_update);
    run_all($$.on_destroy);
    $$.fragment && $$.fragment.d(detaching);
    $$.on_destroy = $$.fragment = null;
    $$.ctx = [];
  }
}
function make_dirty(component, i) {
  if (component.$$.dirty[0] === -1) {
    dirty_components.push(component);
    schedule_update();
    component.$$.dirty.fill(0);
  }
  component.$$.dirty[i / 31 | 0] |= 1 << i % 31;
}
function init(component, options, instance2, create_fragment2, not_equal, props) {
  let append_styles2 = arguments.length > 6 && arguments[6] !== void 0 ? arguments[6] : null;
  let dirty = arguments.length > 7 && arguments[7] !== void 0 ? arguments[7] : [-1];
  const parent_component = current_component;
  set_current_component(component);
  const $$ = component.$$ = {
    fragment: null,
    ctx: [],
    // state
    props,
    update: noop,
    not_equal,
    bound: blank_object(),
    // lifecycle
    on_mount: [],
    on_destroy: [],
    on_disconnect: [],
    before_update: [],
    after_update: [],
    context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
    // everything else
    callbacks: blank_object(),
    dirty,
    skip_bound: false,
    root: options.target || parent_component.$$.root
  };
  append_styles2 && append_styles2($$.root);
  let ready = false;
  $$.ctx = instance2 ? instance2(component, options.props || {}, function(i, ret) {
    const value = (arguments.length <= 2 ? 0 : arguments.length - 2) ? arguments.length <= 2 ? void 0 : arguments[2] : ret;
    if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
      if (!$$.skip_bound && $$.bound[i])
        $$.bound[i](value);
      if (ready)
        make_dirty(component, i);
    }
    return ret;
  }) : [];
  $$.update();
  ready = true;
  run_all($$.before_update);
  $$.fragment = create_fragment2 ? create_fragment2($$.ctx) : false;
  if (options.target) {
    if (options.hydrate) {
      const nodes = children(options.target);
      $$.fragment && $$.fragment.l(nodes);
      nodes.forEach(detach);
    } else {
      $$.fragment && $$.fragment.c();
    }
    if (options.intro)
      transition_in(component.$$.fragment);
    mount_component(component, options.target, options.anchor);
    flush();
  }
  set_current_component(parent_component);
}
class SvelteComponent {
  constructor() {
    this.$$ = void 0;
    this.$$set = void 0;
  }
  /** @returns {void} */
  $destroy() {
    destroy_component(this, 1);
    this.$destroy = noop;
  }
  /**
   * @template {Extract<keyof Events, string>} K
   * @param {K} type
   * @param {((e: Events[K]) => void) | null | undefined} callback
   * @returns {() => void}
   */
  $on(type, callback) {
    if (!is_function(callback)) {
      return noop;
    }
    const callbacks = this.$$.callbacks[type] || (this.$$.callbacks[type] = []);
    callbacks.push(callback);
    return () => {
      const index = callbacks.indexOf(callback);
      if (index !== -1)
        callbacks.splice(index, 1);
    };
  }
  /**
   * @param {Partial<Props>} props
   * @returns {void}
   */
  $set(props) {
    if (this.$$set && !is_empty(props)) {
      this.$$.skip_bound = true;
      this.$$set(props);
      this.$$.skip_bound = false;
    }
  }
}
const PUBLIC_VERSION = "4";
if (typeof window !== "undefined")
  (window.__svelte || (window.__svelte = {
    v: /* @__PURE__ */ new Set()
  })).v.add(PUBLIC_VERSION);
const setContext = (ctx, val) => setContext$1(ctx, val);
const getContext = (ctx) => getContext$1(ctx);
function add_css$k(target) {
  append_styles(target, "svelte-1lt2k10", ".floating-btn.svelte-1lt2k10.svelte-1lt2k10{background:#363755;border:0;border-radius:50%;box-shadow:0 0 30px rgba(34, 34, 34, 0.3);cursor:pointer;position:fixed;padding:6px;transition:opacity 0.3s;-webkit-transition:opacity 0.3s;z-index:99999}.floating-btn.bottom-right.svelte-1lt2k10.svelte-1lt2k10{bottom:16px;right:16px}.floating-btn.bottom-left.svelte-1lt2k10.svelte-1lt2k10{bottom:16px;left:16px}.floating-btn.top-right.svelte-1lt2k10.svelte-1lt2k10{top:16px;right:16px}.floating-btn.top-left.svelte-1lt2k10.svelte-1lt2k10{top:16px;left:16px}.floating-btn.svelte-1lt2k10.svelte-1lt2k10:hover{opacity:0.7}.floating-btn.svelte-1lt2k10>svg.svelte-1lt2k10{display:block;width:34px;height:34px;position:relative}");
}
function create_fragment$k(ctx) {
  let button;
  let svg;
  let title;
  let t0;
  let desc;
  let t1;
  let use0;
  let use1;
  let use2;
  let use3;
  let use4;
  let use5;
  let use6;
  let defs;
  let path0;
  let path1;
  let path2;
  let path3;
  let path4;
  let path5;
  let path6;
  let button_class_value;
  let mounted2;
  let dispose;
  return {
    c() {
      button = element("button");
      svg = svg_element("svg");
      title = svg_element("title");
      t0 = text("prosemirror");
      desc = svg_element("desc");
      t1 = text("Created using Figma");
      use0 = svg_element("use");
      use1 = svg_element("use");
      use2 = svg_element("use");
      use3 = svg_element("use");
      use4 = svg_element("use");
      use5 = svg_element("use");
      use6 = svg_element("use");
      defs = svg_element("defs");
      path0 = svg_element("path");
      path1 = svg_element("path");
      path2 = svg_element("path");
      path3 = svg_element("path");
      path4 = svg_element("path");
      path5 = svg_element("path");
      path6 = svg_element("path");
      xlink_attr(use0, "xlink:href", "#a");
      attr(use0, "transform", "matrix(2 0 0 2 118 116)");
      attr(use0, "fill", "#FFF");
      xlink_attr(use1, "xlink:href", "#b");
      attr(use1, "transform", "rotate(16 59.054 420.192) scale(2)");
      attr(use1, "fill", "#FFF");
      xlink_attr(use2, "xlink:href", "#c");
      attr(use2, "transform", "matrix(2 0 0 2 154.024 141.58)");
      attr(use2, "fill", "#363755");
      xlink_attr(use3, "xlink:href", "#d");
      attr(use3, "transform", "matrix(2 0 0 2 220 334.8)");
      attr(use3, "fill", "#FFF");
      xlink_attr(use4, "xlink:href", "#e");
      attr(use4, "transform", "matrix(2 0 0 2 218.826 262.052)");
      attr(use4, "fill", "#363755");
      xlink_attr(use5, "xlink:href", "#f");
      attr(use5, "transform", "matrix(2 0 0 2 197.108 184.998)");
      attr(use5, "fill", "#FFF");
      xlink_attr(use6, "xlink:href", "#g");
      attr(use6, "transform", "matrix(2 0 0 2 221.8 216)");
      attr(use6, "fill", "#363755");
      attr(path0, "id", "a");
      attr(path0, "d", "M73.5 0C32.859 0 0 32.859 0 73.5S32.859 147 73.5 147 147 114.141 147 73.5 114.069 0 73.5\n        0z");
      attr(path1, "id", "b");
      attr(path1, "d", "M193.601 107.116c0-13.376 8.238-23.91\n        20.619-31.153-2.244-7.447-5.19-14.6-8.824-21.32-13.886\n        3.633-25.12-1.799-34.568-11.26-9.449-9.437-12.344-20.672-8.709-34.571A111.362 111.362 0 0 0\n        140.799 0c-7.243 12.37-20.339 20.594-33.689 20.594-13.363\n        0-26.446-8.225-33.701-20.594A110.888 110.888 0 0 0 52.1 8.812c3.634 13.9.753 25.134-8.721\n        34.57-9.436 9.462-20.67 14.894-34.569 11.26A112.178 112.178 0 0 0 0 75.963c12.369 7.243\n        20.593 17.777 20.593 31.153 0 13.352-8.224 26.448-20.593 33.704a113.338 113.338 0 0 0 8.811\n        21.321c13.899-3.634 25.133-.752 34.569 8.697 9.448 9.462 12.355 20.696 8.721 34.57a112.653\n        112.653 0 0 0 21.32 8.837c7.243-12.407 20.338-20.619 33.702-20.619 13.35 0 26.446 8.225\n        33.701 20.619a114.22 114.22 0 0 0 21.32-8.837c-3.634-13.874-.752-25.108 8.709-34.57\n        9.449-9.437 20.683-14.869 34.569-11.26a112.343 112.343 0 0 0\n        8.823-21.321c-12.406-7.256-20.644-17.789-20.644-31.141zm-86.491 46.57c-25.732\n        0-46.58-20.849-46.58-46.57 0-25.733 20.86-46.595 46.58-46.595 25.732 0 46.567 20.875 46.567\n        46.595 0 25.734-20.835 46.57-46.567 46.57z");
      attr(path2, "id", "c");
      attr(path2, "d", "M98.088 49.91c-6.9 83.9 10.8 103.401 10.8 103.401s-55.1\n        5.499-82.7-13.401c-30.5-20.9-26-67.5-25.9-94.6.1-28.4 25.6-45.8 49.9-45.3 29.1.5 50.2 21.6\n        47.9 49.9z");
      attr(path3, "id", "d");
      attr(path3, "d", "M.1.1c12.2 33.3 22.5 42.7 40 55.2 25.3 18 36.6 17.5 76.3 41C78.1 60.3 30.8 45.7 0 0l.1.1z");
      attr(path4, "id", "e");
      attr(path4, "d", "M.687 36.474c3 13.3 17.9 29.9 30.4 41.6 24.8 23.2 42 22.4 86\n        54.7-18.2-51.8-18.8-62-43.5-106.1-24.7-44-67.6-20.3-67.6-20.3s-8.4 16.6-5.3 29.9v.2z");
      attr(path5, "id", "f");
      attr(path5, "d", "M38.346 11.5s-4-11.6-18-11.5c-30 .2-28.8 52.1 16.9 52 39.6-.1 39.2-49.4\n        16.1-49.6-10.2-.2-15 9.1-15 9.1z");
      attr(path6, "id", "g");
      attr(path6, "d", "M26.5 15c10.8 0 2 14.9-.6 20.9-1.8-8.4-10.2-20.9.6-20.9zM10.2.1C4.6.1 0 4.6 0 10.3c0 5.6\n        4.5 10.2 10.2 10.2 5.6 0 10.2-4.5 10.2-10.2C20.4 4.7 15.9.1 10.2.1zM40.7 0c-4.8 0-8.8\n        4.5-8.8 10.2 0 5.6 3.9 10.2 8.8 10.2 4.8 0 8.8-4.5 8.8-10.2C49.5 4.6 45.6 0 40.7 0z");
      attr(svg, "width", "530");
      attr(svg, "height", "530");
      attr(svg, "viewBox", "0 0 530 530");
      attr(svg, "xmlns", "http://www.w3.org/2000/svg");
      attr(svg, "xmlns:xlink", "http://www.w3.org/1999/xlink");
      attr(svg, "class", "svelte-1lt2k10");
      attr(button, "class", button_class_value = null_to_empty("floating-btn ".concat(
        /*buttonPosition*/
        ctx[0]
      )) + " svelte-1lt2k10");
    },
    m(target, anchor) {
      insert(target, button, anchor);
      append(button, svg);
      append(svg, title);
      append(title, t0);
      append(svg, desc);
      append(desc, t1);
      append(svg, use0);
      append(svg, use1);
      append(svg, use2);
      append(svg, use3);
      append(svg, use4);
      append(svg, use5);
      append(svg, use6);
      append(svg, defs);
      append(defs, path0);
      append(defs, path1);
      append(defs, path2);
      append(defs, path3);
      append(defs, path4);
      append(defs, path5);
      append(defs, path6);
      if (!mounted2) {
        dispose = listen(
          button,
          "click",
          /*click_handler*/
          ctx[1]
        );
        mounted2 = true;
      }
    },
    p(ctx2, _ref) {
      let [dirty] = _ref;
      if (dirty & /*buttonPosition*/
      1 && button_class_value !== (button_class_value = null_to_empty("floating-btn ".concat(
        /*buttonPosition*/
        ctx2[0]
      )) + " svelte-1lt2k10")) {
        attr(button, "class", button_class_value);
      }
    },
    i: noop,
    o: noop,
    d(detaching) {
      if (detaching) {
        detach(button);
      }
      mounted2 = false;
      dispose();
    }
  };
}
function instance$k($$self, $$props, $$invalidate) {
  let {
    buttonPosition
  } = $$props;
  function click_handler(event) {
    bubble.call(this, $$self, event);
  }
  $$self.$$set = ($$props2) => {
    if ("buttonPosition" in $$props2)
      $$invalidate(0, buttonPosition = $$props2.buttonPosition);
  };
  return [buttonPosition, click_handler];
}
class FloatingBtn extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$k, create_fragment$k, safe_not_equal, {
      buttonPosition: 0
    }, add_css$k);
  }
}
const subscriber_queue = [];
function readable(value, start) {
  return {
    subscribe: writable(value, start).subscribe
  };
}
function writable(value) {
  let start = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : noop;
  let stop;
  const subscribers = /* @__PURE__ */ new Set();
  function set(new_value) {
    if (safe_not_equal(value, new_value)) {
      value = new_value;
      if (stop) {
        const run_queue = !subscriber_queue.length;
        for (const subscriber of subscribers) {
          subscriber[1]();
          subscriber_queue.push(subscriber, value);
        }
        if (run_queue) {
          for (let i = 0; i < subscriber_queue.length; i += 2) {
            subscriber_queue[i][0](subscriber_queue[i + 1]);
          }
          subscriber_queue.length = 0;
        }
      }
    }
  }
  function update2(fn) {
    set(fn(value));
  }
  function subscribe2(run2) {
    let invalidate = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : noop;
    const subscriber = [run2, invalidate];
    subscribers.add(subscriber);
    if (subscribers.size === 1) {
      stop = start(set, update2) || noop;
    }
    run2(value);
    return () => {
      subscribers.delete(subscriber);
      if (subscribers.size === 0 && stop) {
        stop();
        stop = null;
      }
    };
  }
  return {
    set,
    update: update2,
    subscribe: subscribe2
  };
}
function derived(stores, fn, initial_value) {
  const single = !Array.isArray(stores);
  const stores_array = single ? [stores] : stores;
  if (!stores_array.every(Boolean)) {
    throw new Error("derived() expects stores as input, got a falsy value");
  }
  const auto = fn.length < 2;
  return readable(initial_value, (set, update2) => {
    let started = false;
    const values = [];
    let pending = 0;
    let cleanup = noop;
    const sync = () => {
      if (pending) {
        return;
      }
      cleanup();
      const result = fn(single ? values[0] : values, set, update2);
      if (auto) {
        set(result);
      } else {
        cleanup = is_function(result) ? result : noop;
      }
    };
    const unsubscribers = stores_array.map((store, i) => subscribe(store, (value) => {
      values[i] = value;
      pending &= ~(1 << i);
      if (started) {
        sync();
      }
    }, () => {
      pending |= 1 << i;
    }));
    started = true;
    sync();
    return function stop() {
      run_all(unsubscribers);
      cleanup();
      started = false;
    };
  });
}
const SNAPSHOTS_KEY = "__prosemirror-dev-toolkit__snapshots";
const snapshots = writable([]);
const selectedSnapshot = writable();
const previousEditorState = writable();
let canAccessLocalStorage = true;
function hydrate() {
  let persisted = null;
  try {
    persisted = localStorage.getItem(SNAPSHOTS_KEY);
  } catch (err) {
    canAccessLocalStorage = false;
  }
  if (persisted && persisted.length > 0) {
    try {
      const parsed = JSON.parse(persisted);
      snapshots.set(parsed);
    } catch (err) {
      console.error("Corrupted snapshots values in localStorage", err);
    }
  }
}
hydrate();
snapshots.subscribe((val) => {
  if (canAccessLocalStorage) {
    localStorage.setItem(SNAPSHOTS_KEY, JSON.stringify(val));
  }
});
function setEditorDoc(view, doc2) {
  const node = view.state.schema.nodeFromJSON(doc2);
  const tr = view.state.tr;
  tr.replaceWith(0, view.state.doc.nodeSize - 2, node.content);
  view.dispatch(tr);
}
function saveSnapshot(snapshotName, doc2) {
  const snap = {
    name: snapshotName,
    timestamp: Date.now(),
    doc: doc2
  };
  snapshots.update((val) => [snap, ...val]);
  return snap;
}
function importSnapshot(snapshotName, json, schema) {
  const doc2 = schema.nodeFromJSON(json);
  const snap = {
    name: snapshotName,
    timestamp: Date.now(),
    doc: doc2.toJSON()
  };
  snapshots.update((val) => [snap, ...val]);
  return snap;
}
function updateSnapshot(snapshot) {
  snapshots.update((val) => val.map((s) => {
    if (s.timestamp === snapshot.timestamp) {
      return snapshot;
    }
    return s;
  }));
}
function toggleViewSnapshot(view, snap) {
  if (snap) {
    const prevState = get_store_value(previousEditorState);
    if (!prevState)
      previousEditorState.set(view.state);
    setEditorDoc(view, snap.doc);
  } else {
    const prevState = get_store_value(previousEditorState);
    if (!prevState) {
      console.error("No previous state to restore!");
    } else {
      view.updateState(prevState);
    }
    previousEditorState.set(void 0);
  }
  selectedSnapshot.set(snap);
}
function restoreSnapshot(view, snap) {
  setEditorDoc(view, snap.doc);
  previousEditorState.set(void 0);
  selectedSnapshot.set(void 0);
}
function exportSnapshot(snapshot) {
  const a = document.createElement("a");
  const file = new Blob([JSON.stringify(snapshot.doc)], { type: "application/json" });
  a.href = URL.createObjectURL(file);
  a.download = `${snapshot.name}.json`;
  a.click();
}
function deleteSnapshot(snapshot) {
  snapshots.update((val) => val.filter((s) => s.timestamp !== snapshot.timestamp));
  const selected = get_store_value(selectedSnapshot);
  if ((selected === null || selected === void 0 ? void 0 : selected.timestamp) === snapshot.timestamp) {
    selectedSnapshot.set(void 0);
  }
}
function clickOutside(el, onClickOutside) {
  const onClick = (event) => {
    el && !event.composedPath().includes(el) && !event.defaultPrevented && onClickOutside();
  };
  document.addEventListener("click", onClick, true);
  return {
    destroy() {
      document.removeEventListener("click", onClick, true);
    }
  };
}
function add_css$j(target) {
  append_styles(target, "svelte-19h7j7n", ".paste-modal.svelte-19h7j7n.svelte-19h7j7n{font-size:15px;height:100%;left:0;position:fixed;top:0;width:100%;z-index:1000}.paste-modal.svelte-19h7j7n>form.svelte-19h7j7n{display:flex;height:100%;justify-content:center;padding:64px}.modal-bg.svelte-19h7j7n.svelte-19h7j7n{background:#000;height:100%;left:0;opacity:0.8;position:absolute;top:0;width:100%;z-index:-1}fieldset.svelte-19h7j7n.svelte-19h7j7n{border-color:transparent;width:100%;max-width:800px}.submit-container.svelte-19h7j7n.svelte-19h7j7n{position:relative;width:100%}button.svelte-19h7j7n.svelte-19h7j7n{cursor:pointer;padding:4px 8px;position:absolute;right:-6px;top:-32px}legend.svelte-19h7j7n.svelte-19h7j7n{color:white}textarea.svelte-19h7j7n.svelte-19h7j7n{background:#fefcfc;height:calc(100vh - 128px);width:100%}");
}
function create_fragment$j(ctx) {
  let div2;
  let div0;
  let t0;
  let form;
  let fieldset;
  let div1;
  let t2;
  let legend;
  let t4;
  let textarea;
  let mounted2;
  let dispose;
  return {
    c() {
      div2 = element("div");
      div0 = element("div");
      t0 = space();
      form = element("form");
      fieldset = element("fieldset");
      div1 = element("div");
      div1.innerHTML = '<button class="svelte-19h7j7n">Submit</button>';
      t2 = space();
      legend = element("legend");
      legend.textContent = "Doc";
      t4 = space();
      textarea = element("textarea");
      attr(div0, "class", "modal-bg svelte-19h7j7n");
      attr(div1, "class", "submit-container svelte-19h7j7n");
      attr(legend, "class", "svelte-19h7j7n");
      attr(textarea, "class", "svelte-19h7j7n");
      attr(fieldset, "class", "svelte-19h7j7n");
      attr(form, "class", "paste-content svelte-19h7j7n");
      attr(div2, "class", "paste-modal svelte-19h7j7n");
      toggle_class(div2, "hidden", !/*isOpen*/
      ctx[0]);
    },
    m(target, anchor) {
      insert(target, div2, anchor);
      append(div2, div0);
      append(div2, t0);
      append(div2, form);
      append(form, fieldset);
      append(fieldset, div1);
      append(fieldset, t2);
      append(fieldset, legend);
      append(fieldset, t4);
      append(fieldset, textarea);
      set_input_value(
        textarea,
        /*doc*/
        ctx[1]
      );
      if (!mounted2) {
        dispose = [listen(
          textarea,
          "input",
          /*textarea_input_handler*/
          ctx[4]
        ), action_destroyer(clickOutside.call(
          null,
          fieldset,
          /*handleClickOutside*/
          ctx[2]
        )), listen(form, "submit", prevent_default(
          /*handleSubmit*/
          ctx[3]
        ))];
        mounted2 = true;
      }
    },
    p(ctx2, _ref) {
      let [dirty] = _ref;
      if (dirty & /*doc*/
      2) {
        set_input_value(
          textarea,
          /*doc*/
          ctx2[1]
        );
      }
      if (dirty & /*isOpen*/
      1) {
        toggle_class(div2, "hidden", !/*isOpen*/
        ctx2[0]);
      }
    },
    i: noop,
    o: noop,
    d(detaching) {
      if (detaching) {
        detach(div2);
      }
      mounted2 = false;
      run_all(dispose);
    }
  };
}
function instance$j($$self, $$props, $$invalidate) {
  let {
    isOpen
  } = $$props;
  let doc2;
  const dispatch = createEventDispatcher();
  function handleClickOutside() {
    dispatch("close");
  }
  function handleSubmit() {
    try {
      dispatch("submit", {
        doc: JSON.parse(doc2)
      });
    } catch (err) {
    }
  }
  function textarea_input_handler() {
    doc2 = this.value;
    $$invalidate(1, doc2);
  }
  $$self.$$set = ($$props2) => {
    if ("isOpen" in $$props2)
      $$invalidate(0, isOpen = $$props2.isOpen);
  };
  return [isOpen, doc2, handleClickOutside, handleSubmit, textarea_input_handler];
}
class PasteModal extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$j, create_fragment$j, safe_not_equal, {
      isOpen: 0
    }, add_css$j);
  }
}
function add_css$i(target) {
  append_styles(target, "svelte-10notzq", "ul.svelte-10notzq{display:flex;list-style:none;margin:0;overflow-x:scroll;padding:0}button.svelte-10notzq{background:transparent;border:0;border-bottom:2px solid transparent;color:#fff;cursor:pointer;height:100%;font-size:var(--font-medium);font-weight:400;padding:1em}button.svelte-10notzq:hover{background:rgba(255, 255, 255, 0.05)}button.active.svelte-10notzq{border-bottom:2px solid rgb(255, 162, 177)}");
}
function create_fragment$i(ctx) {
  let ul;
  let li0;
  let button0;
  let t1;
  let li1;
  let button1;
  let t3;
  let li2;
  let button2;
  let t5;
  let li3;
  let button3;
  let t7;
  let li4;
  let button4;
  let t9;
  let li5;
  let button5;
  let mounted2;
  let dispose;
  return {
    c() {
      ul = element("ul");
      li0 = element("li");
      button0 = element("button");
      button0.textContent = "STATE";
      t1 = space();
      li1 = element("li");
      button1 = element("button");
      button1.textContent = "HISTORY";
      t3 = space();
      li2 = element("li");
      button2 = element("button");
      button2.textContent = "PLUGINS";
      t5 = space();
      li3 = element("li");
      button3 = element("button");
      button3.textContent = "SCHEMA";
      t7 = space();
      li4 = element("li");
      button4 = element("button");
      button4.textContent = "STRUCTURE";
      t9 = space();
      li5 = element("li");
      button5 = element("button");
      button5.textContent = "SNAPSHOTS";
      attr(button0, "class", "svelte-10notzq");
      toggle_class(
        button0,
        "active",
        /*active*/
        ctx[0] === "state"
      );
      attr(button1, "class", "svelte-10notzq");
      toggle_class(
        button1,
        "active",
        /*active*/
        ctx[0] === "history"
      );
      attr(button2, "class", "svelte-10notzq");
      toggle_class(
        button2,
        "active",
        /*active*/
        ctx[0] === "plugins"
      );
      attr(button3, "class", "svelte-10notzq");
      toggle_class(
        button3,
        "active",
        /*active*/
        ctx[0] === "schema"
      );
      attr(button4, "class", "svelte-10notzq");
      toggle_class(
        button4,
        "active",
        /*active*/
        ctx[0] === "structure"
      );
      attr(button5, "class", "svelte-10notzq");
      toggle_class(
        button5,
        "active",
        /*active*/
        ctx[0] === "snapshots"
      );
      attr(ul, "class", "tabs-menu svelte-10notzq");
    },
    m(target, anchor) {
      insert(target, ul, anchor);
      append(ul, li0);
      append(li0, button0);
      append(ul, t1);
      append(ul, li1);
      append(li1, button1);
      append(ul, t3);
      append(ul, li2);
      append(li2, button2);
      append(ul, t5);
      append(ul, li3);
      append(li3, button3);
      append(ul, t7);
      append(ul, li4);
      append(li4, button4);
      append(ul, t9);
      append(ul, li5);
      append(li5, button5);
      if (!mounted2) {
        dispose = [listen(
          button0,
          "click",
          /*click_handler*/
          ctx[2]
        ), listen(
          button1,
          "click",
          /*click_handler_1*/
          ctx[3]
        ), listen(
          button2,
          "click",
          /*click_handler_2*/
          ctx[4]
        ), listen(
          button3,
          "click",
          /*click_handler_3*/
          ctx[5]
        ), listen(
          button4,
          "click",
          /*click_handler_4*/
          ctx[6]
        ), listen(
          button5,
          "click",
          /*click_handler_5*/
          ctx[7]
        )];
        mounted2 = true;
      }
    },
    p(ctx2, _ref) {
      let [dirty] = _ref;
      if (dirty & /*active*/
      1) {
        toggle_class(
          button0,
          "active",
          /*active*/
          ctx2[0] === "state"
        );
      }
      if (dirty & /*active*/
      1) {
        toggle_class(
          button1,
          "active",
          /*active*/
          ctx2[0] === "history"
        );
      }
      if (dirty & /*active*/
      1) {
        toggle_class(
          button2,
          "active",
          /*active*/
          ctx2[0] === "plugins"
        );
      }
      if (dirty & /*active*/
      1) {
        toggle_class(
          button3,
          "active",
          /*active*/
          ctx2[0] === "schema"
        );
      }
      if (dirty & /*active*/
      1) {
        toggle_class(
          button4,
          "active",
          /*active*/
          ctx2[0] === "structure"
        );
      }
      if (dirty & /*active*/
      1) {
        toggle_class(
          button5,
          "active",
          /*active*/
          ctx2[0] === "snapshots"
        );
      }
    },
    i: noop,
    o: noop,
    d(detaching) {
      if (detaching) {
        detach(ul);
      }
      mounted2 = false;
      run_all(dispose);
    }
  };
}
function instance$i($$self, $$props, $$invalidate) {
  let {
    active: active2,
    onClickTab
  } = $$props;
  const click_handler = () => onClickTab("state");
  const click_handler_1 = () => onClickTab("history");
  const click_handler_2 = () => onClickTab("plugins");
  const click_handler_3 = () => onClickTab("schema");
  const click_handler_4 = () => onClickTab("structure");
  const click_handler_5 = () => onClickTab("snapshots");
  $$self.$$set = ($$props2) => {
    if ("active" in $$props2)
      $$invalidate(0, active2 = $$props2.active);
    if ("onClickTab" in $$props2)
      $$invalidate(1, onClickTab = $$props2.onClickTab);
  };
  return [active2, onClickTab, click_handler, click_handler_1, click_handler_2, click_handler_3, click_handler_4, click_handler_5];
}
class TabsMenu extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$i, create_fragment$i, safe_not_equal, {
      active: 0,
      onClickTab: 1
    }, add_css$i);
  }
}
function getDefaultExportFromCjs(x) {
  return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, "default") ? x["default"] : x;
}
var diffMatchPatch = { exports: {} };
(function(module) {
  var diff_match_patch2 = function() {
    this.Diff_Timeout = 1;
    this.Diff_EditCost = 4;
    this.Match_Threshold = 0.5;
    this.Match_Distance = 1e3;
    this.Patch_DeleteThreshold = 0.5;
    this.Patch_Margin = 4;
    this.Match_MaxBits = 32;
  };
  var DIFF_DELETE = -1;
  var DIFF_INSERT = 1;
  var DIFF_EQUAL = 0;
  diff_match_patch2.Diff = function(op, text2) {
    return [op, text2];
  };
  diff_match_patch2.prototype.diff_main = function(text1, text2, opt_checklines, opt_deadline) {
    if (typeof opt_deadline == "undefined") {
      if (this.Diff_Timeout <= 0) {
        opt_deadline = Number.MAX_VALUE;
      } else {
        opt_deadline = (/* @__PURE__ */ new Date()).getTime() + this.Diff_Timeout * 1e3;
      }
    }
    var deadline = opt_deadline;
    if (text1 == null || text2 == null) {
      throw new Error("Null input. (diff_main)");
    }
    if (text1 == text2) {
      if (text1) {
        return [new diff_match_patch2.Diff(DIFF_EQUAL, text1)];
      }
      return [];
    }
    if (typeof opt_checklines == "undefined") {
      opt_checklines = true;
    }
    var checklines = opt_checklines;
    var commonlength = this.diff_commonPrefix(text1, text2);
    var commonprefix = text1.substring(0, commonlength);
    text1 = text1.substring(commonlength);
    text2 = text2.substring(commonlength);
    commonlength = this.diff_commonSuffix(text1, text2);
    var commonsuffix = text1.substring(text1.length - commonlength);
    text1 = text1.substring(0, text1.length - commonlength);
    text2 = text2.substring(0, text2.length - commonlength);
    var diffs = this.diff_compute_(text1, text2, checklines, deadline);
    if (commonprefix) {
      diffs.unshift(new diff_match_patch2.Diff(DIFF_EQUAL, commonprefix));
    }
    if (commonsuffix) {
      diffs.push(new diff_match_patch2.Diff(DIFF_EQUAL, commonsuffix));
    }
    this.diff_cleanupMerge(diffs);
    return diffs;
  };
  diff_match_patch2.prototype.diff_compute_ = function(text1, text2, checklines, deadline) {
    var diffs;
    if (!text1) {
      return [new diff_match_patch2.Diff(DIFF_INSERT, text2)];
    }
    if (!text2) {
      return [new diff_match_patch2.Diff(DIFF_DELETE, text1)];
    }
    var longtext = text1.length > text2.length ? text1 : text2;
    var shorttext = text1.length > text2.length ? text2 : text1;
    var i = longtext.indexOf(shorttext);
    if (i != -1) {
      diffs = [new diff_match_patch2.Diff(DIFF_INSERT, longtext.substring(0, i)), new diff_match_patch2.Diff(DIFF_EQUAL, shorttext), new diff_match_patch2.Diff(DIFF_INSERT, longtext.substring(i + shorttext.length))];
      if (text1.length > text2.length) {
        diffs[0][0] = diffs[2][0] = DIFF_DELETE;
      }
      return diffs;
    }
    if (shorttext.length == 1) {
      return [new diff_match_patch2.Diff(DIFF_DELETE, text1), new diff_match_patch2.Diff(DIFF_INSERT, text2)];
    }
    var hm = this.diff_halfMatch_(text1, text2);
    if (hm) {
      var text1_a = hm[0];
      var text1_b = hm[1];
      var text2_a = hm[2];
      var text2_b = hm[3];
      var mid_common = hm[4];
      var diffs_a = this.diff_main(text1_a, text2_a, checklines, deadline);
      var diffs_b = this.diff_main(text1_b, text2_b, checklines, deadline);
      return diffs_a.concat([new diff_match_patch2.Diff(DIFF_EQUAL, mid_common)], diffs_b);
    }
    if (checklines && text1.length > 100 && text2.length > 100) {
      return this.diff_lineMode_(text1, text2, deadline);
    }
    return this.diff_bisect_(text1, text2, deadline);
  };
  diff_match_patch2.prototype.diff_lineMode_ = function(text1, text2, deadline) {
    var a = this.diff_linesToChars_(text1, text2);
    text1 = a.chars1;
    text2 = a.chars2;
    var linearray = a.lineArray;
    var diffs = this.diff_main(text1, text2, false, deadline);
    this.diff_charsToLines_(diffs, linearray);
    this.diff_cleanupSemantic(diffs);
    diffs.push(new diff_match_patch2.Diff(DIFF_EQUAL, ""));
    var pointer = 0;
    var count_delete = 0;
    var count_insert = 0;
    var text_delete = "";
    var text_insert = "";
    while (pointer < diffs.length) {
      switch (diffs[pointer][0]) {
        case DIFF_INSERT:
          count_insert++;
          text_insert += diffs[pointer][1];
          break;
        case DIFF_DELETE:
          count_delete++;
          text_delete += diffs[pointer][1];
          break;
        case DIFF_EQUAL:
          if (count_delete >= 1 && count_insert >= 1) {
            diffs.splice(pointer - count_delete - count_insert, count_delete + count_insert);
            pointer = pointer - count_delete - count_insert;
            var subDiff = this.diff_main(text_delete, text_insert, false, deadline);
            for (var j = subDiff.length - 1; j >= 0; j--) {
              diffs.splice(pointer, 0, subDiff[j]);
            }
            pointer = pointer + subDiff.length;
          }
          count_insert = 0;
          count_delete = 0;
          text_delete = "";
          text_insert = "";
          break;
      }
      pointer++;
    }
    diffs.pop();
    return diffs;
  };
  diff_match_patch2.prototype.diff_bisect_ = function(text1, text2, deadline) {
    var text1_length = text1.length;
    var text2_length = text2.length;
    var max_d = Math.ceil((text1_length + text2_length) / 2);
    var v_offset = max_d;
    var v_length = 2 * max_d;
    var v1 = new Array(v_length);
    var v2 = new Array(v_length);
    for (var x = 0; x < v_length; x++) {
      v1[x] = -1;
      v2[x] = -1;
    }
    v1[v_offset + 1] = 0;
    v2[v_offset + 1] = 0;
    var delta = text1_length - text2_length;
    var front = delta % 2 != 0;
    var k1start = 0;
    var k1end = 0;
    var k2start = 0;
    var k2end = 0;
    for (var d = 0; d < max_d; d++) {
      if ((/* @__PURE__ */ new Date()).getTime() > deadline) {
        break;
      }
      for (var k1 = -d + k1start; k1 <= d - k1end; k1 += 2) {
        var k1_offset = v_offset + k1;
        var x1;
        if (k1 == -d || k1 != d && v1[k1_offset - 1] < v1[k1_offset + 1]) {
          x1 = v1[k1_offset + 1];
        } else {
          x1 = v1[k1_offset - 1] + 1;
        }
        var y1 = x1 - k1;
        while (x1 < text1_length && y1 < text2_length && text1.charAt(x1) == text2.charAt(y1)) {
          x1++;
          y1++;
        }
        v1[k1_offset] = x1;
        if (x1 > text1_length) {
          k1end += 2;
        } else if (y1 > text2_length) {
          k1start += 2;
        } else if (front) {
          var k2_offset = v_offset + delta - k1;
          if (k2_offset >= 0 && k2_offset < v_length && v2[k2_offset] != -1) {
            var x2 = text1_length - v2[k2_offset];
            if (x1 >= x2) {
              return this.diff_bisectSplit_(text1, text2, x1, y1, deadline);
            }
          }
        }
      }
      for (var k2 = -d + k2start; k2 <= d - k2end; k2 += 2) {
        var k2_offset = v_offset + k2;
        var x2;
        if (k2 == -d || k2 != d && v2[k2_offset - 1] < v2[k2_offset + 1]) {
          x2 = v2[k2_offset + 1];
        } else {
          x2 = v2[k2_offset - 1] + 1;
        }
        var y2 = x2 - k2;
        while (x2 < text1_length && y2 < text2_length && text1.charAt(text1_length - x2 - 1) == text2.charAt(text2_length - y2 - 1)) {
          x2++;
          y2++;
        }
        v2[k2_offset] = x2;
        if (x2 > text1_length) {
          k2end += 2;
        } else if (y2 > text2_length) {
          k2start += 2;
        } else if (!front) {
          var k1_offset = v_offset + delta - k2;
          if (k1_offset >= 0 && k1_offset < v_length && v1[k1_offset] != -1) {
            var x1 = v1[k1_offset];
            var y1 = v_offset + x1 - k1_offset;
            x2 = text1_length - x2;
            if (x1 >= x2) {
              return this.diff_bisectSplit_(text1, text2, x1, y1, deadline);
            }
          }
        }
      }
    }
    return [new diff_match_patch2.Diff(DIFF_DELETE, text1), new diff_match_patch2.Diff(DIFF_INSERT, text2)];
  };
  diff_match_patch2.prototype.diff_bisectSplit_ = function(text1, text2, x, y, deadline) {
    var text1a = text1.substring(0, x);
    var text2a = text2.substring(0, y);
    var text1b = text1.substring(x);
    var text2b = text2.substring(y);
    var diffs = this.diff_main(text1a, text2a, false, deadline);
    var diffsb = this.diff_main(text1b, text2b, false, deadline);
    return diffs.concat(diffsb);
  };
  diff_match_patch2.prototype.diff_linesToChars_ = function(text1, text2) {
    var lineArray = [];
    var lineHash = {};
    lineArray[0] = "";
    function diff_linesToCharsMunge_(text3) {
      var chars = "";
      var lineStart = 0;
      var lineEnd = -1;
      var lineArrayLength = lineArray.length;
      while (lineEnd < text3.length - 1) {
        lineEnd = text3.indexOf("\n", lineStart);
        if (lineEnd == -1) {
          lineEnd = text3.length - 1;
        }
        var line = text3.substring(lineStart, lineEnd + 1);
        if (lineHash.hasOwnProperty ? lineHash.hasOwnProperty(line) : lineHash[line] !== void 0) {
          chars += String.fromCharCode(lineHash[line]);
        } else {
          if (lineArrayLength == maxLines) {
            line = text3.substring(lineStart);
            lineEnd = text3.length;
          }
          chars += String.fromCharCode(lineArrayLength);
          lineHash[line] = lineArrayLength;
          lineArray[lineArrayLength++] = line;
        }
        lineStart = lineEnd + 1;
      }
      return chars;
    }
    var maxLines = 4e4;
    var chars1 = diff_linesToCharsMunge_(text1);
    maxLines = 65535;
    var chars2 = diff_linesToCharsMunge_(text2);
    return {
      chars1,
      chars2,
      lineArray
    };
  };
  diff_match_patch2.prototype.diff_charsToLines_ = function(diffs, lineArray) {
    for (var i = 0; i < diffs.length; i++) {
      var chars = diffs[i][1];
      var text2 = [];
      for (var j = 0; j < chars.length; j++) {
        text2[j] = lineArray[chars.charCodeAt(j)];
      }
      diffs[i][1] = text2.join("");
    }
  };
  diff_match_patch2.prototype.diff_commonPrefix = function(text1, text2) {
    if (!text1 || !text2 || text1.charAt(0) != text2.charAt(0)) {
      return 0;
    }
    var pointermin = 0;
    var pointermax = Math.min(text1.length, text2.length);
    var pointermid = pointermax;
    var pointerstart = 0;
    while (pointermin < pointermid) {
      if (text1.substring(pointerstart, pointermid) == text2.substring(pointerstart, pointermid)) {
        pointermin = pointermid;
        pointerstart = pointermin;
      } else {
        pointermax = pointermid;
      }
      pointermid = Math.floor((pointermax - pointermin) / 2 + pointermin);
    }
    return pointermid;
  };
  diff_match_patch2.prototype.diff_commonSuffix = function(text1, text2) {
    if (!text1 || !text2 || text1.charAt(text1.length - 1) != text2.charAt(text2.length - 1)) {
      return 0;
    }
    var pointermin = 0;
    var pointermax = Math.min(text1.length, text2.length);
    var pointermid = pointermax;
    var pointerend = 0;
    while (pointermin < pointermid) {
      if (text1.substring(text1.length - pointermid, text1.length - pointerend) == text2.substring(text2.length - pointermid, text2.length - pointerend)) {
        pointermin = pointermid;
        pointerend = pointermin;
      } else {
        pointermax = pointermid;
      }
      pointermid = Math.floor((pointermax - pointermin) / 2 + pointermin);
    }
    return pointermid;
  };
  diff_match_patch2.prototype.diff_commonOverlap_ = function(text1, text2) {
    var text1_length = text1.length;
    var text2_length = text2.length;
    if (text1_length == 0 || text2_length == 0) {
      return 0;
    }
    if (text1_length > text2_length) {
      text1 = text1.substring(text1_length - text2_length);
    } else if (text1_length < text2_length) {
      text2 = text2.substring(0, text1_length);
    }
    var text_length = Math.min(text1_length, text2_length);
    if (text1 == text2) {
      return text_length;
    }
    var best = 0;
    var length = 1;
    while (true) {
      var pattern = text1.substring(text_length - length);
      var found = text2.indexOf(pattern);
      if (found == -1) {
        return best;
      }
      length += found;
      if (found == 0 || text1.substring(text_length - length) == text2.substring(0, length)) {
        best = length;
        length++;
      }
    }
  };
  diff_match_patch2.prototype.diff_halfMatch_ = function(text1, text2) {
    if (this.Diff_Timeout <= 0) {
      return null;
    }
    var longtext = text1.length > text2.length ? text1 : text2;
    var shorttext = text1.length > text2.length ? text2 : text1;
    if (longtext.length < 4 || shorttext.length * 2 < longtext.length) {
      return null;
    }
    var dmp2 = this;
    function diff_halfMatchI_(longtext2, shorttext2, i) {
      var seed = longtext2.substring(i, i + Math.floor(longtext2.length / 4));
      var j = -1;
      var best_common = "";
      var best_longtext_a, best_longtext_b, best_shorttext_a, best_shorttext_b;
      while ((j = shorttext2.indexOf(seed, j + 1)) != -1) {
        var prefixLength = dmp2.diff_commonPrefix(longtext2.substring(i), shorttext2.substring(j));
        var suffixLength = dmp2.diff_commonSuffix(longtext2.substring(0, i), shorttext2.substring(0, j));
        if (best_common.length < suffixLength + prefixLength) {
          best_common = shorttext2.substring(j - suffixLength, j) + shorttext2.substring(j, j + prefixLength);
          best_longtext_a = longtext2.substring(0, i - suffixLength);
          best_longtext_b = longtext2.substring(i + prefixLength);
          best_shorttext_a = shorttext2.substring(0, j - suffixLength);
          best_shorttext_b = shorttext2.substring(j + prefixLength);
        }
      }
      if (best_common.length * 2 >= longtext2.length) {
        return [best_longtext_a, best_longtext_b, best_shorttext_a, best_shorttext_b, best_common];
      } else {
        return null;
      }
    }
    var hm1 = diff_halfMatchI_(longtext, shorttext, Math.ceil(longtext.length / 4));
    var hm2 = diff_halfMatchI_(longtext, shorttext, Math.ceil(longtext.length / 2));
    var hm;
    if (!hm1 && !hm2) {
      return null;
    } else if (!hm2) {
      hm = hm1;
    } else if (!hm1) {
      hm = hm2;
    } else {
      hm = hm1[4].length > hm2[4].length ? hm1 : hm2;
    }
    var text1_a, text1_b, text2_a, text2_b;
    if (text1.length > text2.length) {
      text1_a = hm[0];
      text1_b = hm[1];
      text2_a = hm[2];
      text2_b = hm[3];
    } else {
      text2_a = hm[0];
      text2_b = hm[1];
      text1_a = hm[2];
      text1_b = hm[3];
    }
    var mid_common = hm[4];
    return [text1_a, text1_b, text2_a, text2_b, mid_common];
  };
  diff_match_patch2.prototype.diff_cleanupSemantic = function(diffs) {
    var changes = false;
    var equalities = [];
    var equalitiesLength = 0;
    var lastEquality = null;
    var pointer = 0;
    var length_insertions1 = 0;
    var length_deletions1 = 0;
    var length_insertions2 = 0;
    var length_deletions2 = 0;
    while (pointer < diffs.length) {
      if (diffs[pointer][0] == DIFF_EQUAL) {
        equalities[equalitiesLength++] = pointer;
        length_insertions1 = length_insertions2;
        length_deletions1 = length_deletions2;
        length_insertions2 = 0;
        length_deletions2 = 0;
        lastEquality = diffs[pointer][1];
      } else {
        if (diffs[pointer][0] == DIFF_INSERT) {
          length_insertions2 += diffs[pointer][1].length;
        } else {
          length_deletions2 += diffs[pointer][1].length;
        }
        if (lastEquality && lastEquality.length <= Math.max(length_insertions1, length_deletions1) && lastEquality.length <= Math.max(length_insertions2, length_deletions2)) {
          diffs.splice(equalities[equalitiesLength - 1], 0, new diff_match_patch2.Diff(DIFF_DELETE, lastEquality));
          diffs[equalities[equalitiesLength - 1] + 1][0] = DIFF_INSERT;
          equalitiesLength--;
          equalitiesLength--;
          pointer = equalitiesLength > 0 ? equalities[equalitiesLength - 1] : -1;
          length_insertions1 = 0;
          length_deletions1 = 0;
          length_insertions2 = 0;
          length_deletions2 = 0;
          lastEquality = null;
          changes = true;
        }
      }
      pointer++;
    }
    if (changes) {
      this.diff_cleanupMerge(diffs);
    }
    this.diff_cleanupSemanticLossless(diffs);
    pointer = 1;
    while (pointer < diffs.length) {
      if (diffs[pointer - 1][0] == DIFF_DELETE && diffs[pointer][0] == DIFF_INSERT) {
        var deletion = diffs[pointer - 1][1];
        var insertion = diffs[pointer][1];
        var overlap_length1 = this.diff_commonOverlap_(deletion, insertion);
        var overlap_length2 = this.diff_commonOverlap_(insertion, deletion);
        if (overlap_length1 >= overlap_length2) {
          if (overlap_length1 >= deletion.length / 2 || overlap_length1 >= insertion.length / 2) {
            diffs.splice(pointer, 0, new diff_match_patch2.Diff(DIFF_EQUAL, insertion.substring(0, overlap_length1)));
            diffs[pointer - 1][1] = deletion.substring(0, deletion.length - overlap_length1);
            diffs[pointer + 1][1] = insertion.substring(overlap_length1);
            pointer++;
          }
        } else {
          if (overlap_length2 >= deletion.length / 2 || overlap_length2 >= insertion.length / 2) {
            diffs.splice(pointer, 0, new diff_match_patch2.Diff(DIFF_EQUAL, deletion.substring(0, overlap_length2)));
            diffs[pointer - 1][0] = DIFF_INSERT;
            diffs[pointer - 1][1] = insertion.substring(0, insertion.length - overlap_length2);
            diffs[pointer + 1][0] = DIFF_DELETE;
            diffs[pointer + 1][1] = deletion.substring(overlap_length2);
            pointer++;
          }
        }
        pointer++;
      }
      pointer++;
    }
  };
  diff_match_patch2.prototype.diff_cleanupSemanticLossless = function(diffs) {
    function diff_cleanupSemanticScore_(one, two) {
      if (!one || !two) {
        return 6;
      }
      var char1 = one.charAt(one.length - 1);
      var char2 = two.charAt(0);
      var nonAlphaNumeric1 = char1.match(diff_match_patch2.nonAlphaNumericRegex_);
      var nonAlphaNumeric2 = char2.match(diff_match_patch2.nonAlphaNumericRegex_);
      var whitespace1 = nonAlphaNumeric1 && char1.match(diff_match_patch2.whitespaceRegex_);
      var whitespace2 = nonAlphaNumeric2 && char2.match(diff_match_patch2.whitespaceRegex_);
      var lineBreak1 = whitespace1 && char1.match(diff_match_patch2.linebreakRegex_);
      var lineBreak2 = whitespace2 && char2.match(diff_match_patch2.linebreakRegex_);
      var blankLine1 = lineBreak1 && one.match(diff_match_patch2.blanklineEndRegex_);
      var blankLine2 = lineBreak2 && two.match(diff_match_patch2.blanklineStartRegex_);
      if (blankLine1 || blankLine2) {
        return 5;
      } else if (lineBreak1 || lineBreak2) {
        return 4;
      } else if (nonAlphaNumeric1 && !whitespace1 && whitespace2) {
        return 3;
      } else if (whitespace1 || whitespace2) {
        return 2;
      } else if (nonAlphaNumeric1 || nonAlphaNumeric2) {
        return 1;
      }
      return 0;
    }
    var pointer = 1;
    while (pointer < diffs.length - 1) {
      if (diffs[pointer - 1][0] == DIFF_EQUAL && diffs[pointer + 1][0] == DIFF_EQUAL) {
        var equality1 = diffs[pointer - 1][1];
        var edit = diffs[pointer][1];
        var equality2 = diffs[pointer + 1][1];
        var commonOffset = this.diff_commonSuffix(equality1, edit);
        if (commonOffset) {
          var commonString = edit.substring(edit.length - commonOffset);
          equality1 = equality1.substring(0, equality1.length - commonOffset);
          edit = commonString + edit.substring(0, edit.length - commonOffset);
          equality2 = commonString + equality2;
        }
        var bestEquality1 = equality1;
        var bestEdit = edit;
        var bestEquality2 = equality2;
        var bestScore = diff_cleanupSemanticScore_(equality1, edit) + diff_cleanupSemanticScore_(edit, equality2);
        while (edit.charAt(0) === equality2.charAt(0)) {
          equality1 += edit.charAt(0);
          edit = edit.substring(1) + equality2.charAt(0);
          equality2 = equality2.substring(1);
          var score = diff_cleanupSemanticScore_(equality1, edit) + diff_cleanupSemanticScore_(edit, equality2);
          if (score >= bestScore) {
            bestScore = score;
            bestEquality1 = equality1;
            bestEdit = edit;
            bestEquality2 = equality2;
          }
        }
        if (diffs[pointer - 1][1] != bestEquality1) {
          if (bestEquality1) {
            diffs[pointer - 1][1] = bestEquality1;
          } else {
            diffs.splice(pointer - 1, 1);
            pointer--;
          }
          diffs[pointer][1] = bestEdit;
          if (bestEquality2) {
            diffs[pointer + 1][1] = bestEquality2;
          } else {
            diffs.splice(pointer + 1, 1);
            pointer--;
          }
        }
      }
      pointer++;
    }
  };
  diff_match_patch2.nonAlphaNumericRegex_ = /[^a-zA-Z0-9]/;
  diff_match_patch2.whitespaceRegex_ = /\s/;
  diff_match_patch2.linebreakRegex_ = /[\r\n]/;
  diff_match_patch2.blanklineEndRegex_ = /\n\r?\n$/;
  diff_match_patch2.blanklineStartRegex_ = /^\r?\n\r?\n/;
  diff_match_patch2.prototype.diff_cleanupEfficiency = function(diffs) {
    var changes = false;
    var equalities = [];
    var equalitiesLength = 0;
    var lastEquality = null;
    var pointer = 0;
    var pre_ins = false;
    var pre_del = false;
    var post_ins = false;
    var post_del = false;
    while (pointer < diffs.length) {
      if (diffs[pointer][0] == DIFF_EQUAL) {
        if (diffs[pointer][1].length < this.Diff_EditCost && (post_ins || post_del)) {
          equalities[equalitiesLength++] = pointer;
          pre_ins = post_ins;
          pre_del = post_del;
          lastEquality = diffs[pointer][1];
        } else {
          equalitiesLength = 0;
          lastEquality = null;
        }
        post_ins = post_del = false;
      } else {
        if (diffs[pointer][0] == DIFF_DELETE) {
          post_del = true;
        } else {
          post_ins = true;
        }
        if (lastEquality && (pre_ins && pre_del && post_ins && post_del || lastEquality.length < this.Diff_EditCost / 2 && pre_ins + pre_del + post_ins + post_del == 3)) {
          diffs.splice(equalities[equalitiesLength - 1], 0, new diff_match_patch2.Diff(DIFF_DELETE, lastEquality));
          diffs[equalities[equalitiesLength - 1] + 1][0] = DIFF_INSERT;
          equalitiesLength--;
          lastEquality = null;
          if (pre_ins && pre_del) {
            post_ins = post_del = true;
            equalitiesLength = 0;
          } else {
            equalitiesLength--;
            pointer = equalitiesLength > 0 ? equalities[equalitiesLength - 1] : -1;
            post_ins = post_del = false;
          }
          changes = true;
        }
      }
      pointer++;
    }
    if (changes) {
      this.diff_cleanupMerge(diffs);
    }
  };
  diff_match_patch2.prototype.diff_cleanupMerge = function(diffs) {
    diffs.push(new diff_match_patch2.Diff(DIFF_EQUAL, ""));
    var pointer = 0;
    var count_delete = 0;
    var count_insert = 0;
    var text_delete = "";
    var text_insert = "";
    var commonlength;
    while (pointer < diffs.length) {
      switch (diffs[pointer][0]) {
        case DIFF_INSERT:
          count_insert++;
          text_insert += diffs[pointer][1];
          pointer++;
          break;
        case DIFF_DELETE:
          count_delete++;
          text_delete += diffs[pointer][1];
          pointer++;
          break;
        case DIFF_EQUAL:
          if (count_delete + count_insert > 1) {
            if (count_delete !== 0 && count_insert !== 0) {
              commonlength = this.diff_commonPrefix(text_insert, text_delete);
              if (commonlength !== 0) {
                if (pointer - count_delete - count_insert > 0 && diffs[pointer - count_delete - count_insert - 1][0] == DIFF_EQUAL) {
                  diffs[pointer - count_delete - count_insert - 1][1] += text_insert.substring(0, commonlength);
                } else {
                  diffs.splice(0, 0, new diff_match_patch2.Diff(DIFF_EQUAL, text_insert.substring(0, commonlength)));
                  pointer++;
                }
                text_insert = text_insert.substring(commonlength);
                text_delete = text_delete.substring(commonlength);
              }
              commonlength = this.diff_commonSuffix(text_insert, text_delete);
              if (commonlength !== 0) {
                diffs[pointer][1] = text_insert.substring(text_insert.length - commonlength) + diffs[pointer][1];
                text_insert = text_insert.substring(0, text_insert.length - commonlength);
                text_delete = text_delete.substring(0, text_delete.length - commonlength);
              }
            }
            pointer -= count_delete + count_insert;
            diffs.splice(pointer, count_delete + count_insert);
            if (text_delete.length) {
              diffs.splice(pointer, 0, new diff_match_patch2.Diff(DIFF_DELETE, text_delete));
              pointer++;
            }
            if (text_insert.length) {
              diffs.splice(pointer, 0, new diff_match_patch2.Diff(DIFF_INSERT, text_insert));
              pointer++;
            }
            pointer++;
          } else if (pointer !== 0 && diffs[pointer - 1][0] == DIFF_EQUAL) {
            diffs[pointer - 1][1] += diffs[pointer][1];
            diffs.splice(pointer, 1);
          } else {
            pointer++;
          }
          count_insert = 0;
          count_delete = 0;
          text_delete = "";
          text_insert = "";
          break;
      }
    }
    if (diffs[diffs.length - 1][1] === "") {
      diffs.pop();
    }
    var changes = false;
    pointer = 1;
    while (pointer < diffs.length - 1) {
      if (diffs[pointer - 1][0] == DIFF_EQUAL && diffs[pointer + 1][0] == DIFF_EQUAL) {
        if (diffs[pointer][1].substring(diffs[pointer][1].length - diffs[pointer - 1][1].length) == diffs[pointer - 1][1]) {
          diffs[pointer][1] = diffs[pointer - 1][1] + diffs[pointer][1].substring(0, diffs[pointer][1].length - diffs[pointer - 1][1].length);
          diffs[pointer + 1][1] = diffs[pointer - 1][1] + diffs[pointer + 1][1];
          diffs.splice(pointer - 1, 1);
          changes = true;
        } else if (diffs[pointer][1].substring(0, diffs[pointer + 1][1].length) == diffs[pointer + 1][1]) {
          diffs[pointer - 1][1] += diffs[pointer + 1][1];
          diffs[pointer][1] = diffs[pointer][1].substring(diffs[pointer + 1][1].length) + diffs[pointer + 1][1];
          diffs.splice(pointer + 1, 1);
          changes = true;
        }
      }
      pointer++;
    }
    if (changes) {
      this.diff_cleanupMerge(diffs);
    }
  };
  diff_match_patch2.prototype.diff_xIndex = function(diffs, loc) {
    var chars1 = 0;
    var chars2 = 0;
    var last_chars1 = 0;
    var last_chars2 = 0;
    var x;
    for (x = 0; x < diffs.length; x++) {
      if (diffs[x][0] !== DIFF_INSERT) {
        chars1 += diffs[x][1].length;
      }
      if (diffs[x][0] !== DIFF_DELETE) {
        chars2 += diffs[x][1].length;
      }
      if (chars1 > loc) {
        break;
      }
      last_chars1 = chars1;
      last_chars2 = chars2;
    }
    if (diffs.length != x && diffs[x][0] === DIFF_DELETE) {
      return last_chars2;
    }
    return last_chars2 + (loc - last_chars1);
  };
  diff_match_patch2.prototype.diff_prettyHtml = function(diffs) {
    var html2 = [];
    var pattern_amp = /&/g;
    var pattern_lt = /</g;
    var pattern_gt = />/g;
    var pattern_para = /\n/g;
    for (var x = 0; x < diffs.length; x++) {
      var op = diffs[x][0];
      var data = diffs[x][1];
      var text2 = data.replace(pattern_amp, "&amp;").replace(pattern_lt, "&lt;").replace(pattern_gt, "&gt;").replace(pattern_para, "&para;<br>");
      switch (op) {
        case DIFF_INSERT:
          html2[x] = '<ins style="background:#e6ffe6;">' + text2 + "</ins>";
          break;
        case DIFF_DELETE:
          html2[x] = '<del style="background:#ffe6e6;">' + text2 + "</del>";
          break;
        case DIFF_EQUAL:
          html2[x] = "<span>" + text2 + "</span>";
          break;
      }
    }
    return html2.join("");
  };
  diff_match_patch2.prototype.diff_text1 = function(diffs) {
    var text2 = [];
    for (var x = 0; x < diffs.length; x++) {
      if (diffs[x][0] !== DIFF_INSERT) {
        text2[x] = diffs[x][1];
      }
    }
    return text2.join("");
  };
  diff_match_patch2.prototype.diff_text2 = function(diffs) {
    var text2 = [];
    for (var x = 0; x < diffs.length; x++) {
      if (diffs[x][0] !== DIFF_DELETE) {
        text2[x] = diffs[x][1];
      }
    }
    return text2.join("");
  };
  diff_match_patch2.prototype.diff_levenshtein = function(diffs) {
    var levenshtein = 0;
    var insertions = 0;
    var deletions = 0;
    for (var x = 0; x < diffs.length; x++) {
      var op = diffs[x][0];
      var data = diffs[x][1];
      switch (op) {
        case DIFF_INSERT:
          insertions += data.length;
          break;
        case DIFF_DELETE:
          deletions += data.length;
          break;
        case DIFF_EQUAL:
          levenshtein += Math.max(insertions, deletions);
          insertions = 0;
          deletions = 0;
          break;
      }
    }
    levenshtein += Math.max(insertions, deletions);
    return levenshtein;
  };
  diff_match_patch2.prototype.diff_toDelta = function(diffs) {
    var text2 = [];
    for (var x = 0; x < diffs.length; x++) {
      switch (diffs[x][0]) {
        case DIFF_INSERT:
          text2[x] = "+" + encodeURI(diffs[x][1]);
          break;
        case DIFF_DELETE:
          text2[x] = "-" + diffs[x][1].length;
          break;
        case DIFF_EQUAL:
          text2[x] = "=" + diffs[x][1].length;
          break;
      }
    }
    return text2.join("	").replace(/%20/g, " ");
  };
  diff_match_patch2.prototype.diff_fromDelta = function(text1, delta) {
    var diffs = [];
    var diffsLength = 0;
    var pointer = 0;
    var tokens = delta.split(/\t/g);
    for (var x = 0; x < tokens.length; x++) {
      var param = tokens[x].substring(1);
      switch (tokens[x].charAt(0)) {
        case "+":
          try {
            diffs[diffsLength++] = new diff_match_patch2.Diff(DIFF_INSERT, decodeURI(param));
          } catch (ex) {
            throw new Error("Illegal escape in diff_fromDelta: " + param);
          }
          break;
        case "-":
        case "=":
          var n = parseInt(param, 10);
          if (isNaN(n) || n < 0) {
            throw new Error("Invalid number in diff_fromDelta: " + param);
          }
          var text2 = text1.substring(pointer, pointer += n);
          if (tokens[x].charAt(0) == "=") {
            diffs[diffsLength++] = new diff_match_patch2.Diff(DIFF_EQUAL, text2);
          } else {
            diffs[diffsLength++] = new diff_match_patch2.Diff(DIFF_DELETE, text2);
          }
          break;
        default:
          if (tokens[x]) {
            throw new Error("Invalid diff operation in diff_fromDelta: " + tokens[x]);
          }
      }
    }
    if (pointer != text1.length) {
      throw new Error("Delta length (" + pointer + ") does not equal source text length (" + text1.length + ").");
    }
    return diffs;
  };
  diff_match_patch2.prototype.match_main = function(text2, pattern, loc) {
    if (text2 == null || pattern == null || loc == null) {
      throw new Error("Null input. (match_main)");
    }
    loc = Math.max(0, Math.min(loc, text2.length));
    if (text2 == pattern) {
      return 0;
    } else if (!text2.length) {
      return -1;
    } else if (text2.substring(loc, loc + pattern.length) == pattern) {
      return loc;
    } else {
      return this.match_bitap_(text2, pattern, loc);
    }
  };
  diff_match_patch2.prototype.match_bitap_ = function(text2, pattern, loc) {
    if (pattern.length > this.Match_MaxBits) {
      throw new Error("Pattern too long for this browser.");
    }
    var s = this.match_alphabet_(pattern);
    var dmp2 = this;
    function match_bitapScore_(e, x) {
      var accuracy = e / pattern.length;
      var proximity = Math.abs(loc - x);
      if (!dmp2.Match_Distance) {
        return proximity ? 1 : accuracy;
      }
      return accuracy + proximity / dmp2.Match_Distance;
    }
    var score_threshold = this.Match_Threshold;
    var best_loc = text2.indexOf(pattern, loc);
    if (best_loc != -1) {
      score_threshold = Math.min(match_bitapScore_(0, best_loc), score_threshold);
      best_loc = text2.lastIndexOf(pattern, loc + pattern.length);
      if (best_loc != -1) {
        score_threshold = Math.min(match_bitapScore_(0, best_loc), score_threshold);
      }
    }
    var matchmask = 1 << pattern.length - 1;
    best_loc = -1;
    var bin_min, bin_mid;
    var bin_max = pattern.length + text2.length;
    var last_rd;
    for (var d = 0; d < pattern.length; d++) {
      bin_min = 0;
      bin_mid = bin_max;
      while (bin_min < bin_mid) {
        if (match_bitapScore_(d, loc + bin_mid) <= score_threshold) {
          bin_min = bin_mid;
        } else {
          bin_max = bin_mid;
        }
        bin_mid = Math.floor((bin_max - bin_min) / 2 + bin_min);
      }
      bin_max = bin_mid;
      var start = Math.max(1, loc - bin_mid + 1);
      var finish = Math.min(loc + bin_mid, text2.length) + pattern.length;
      var rd = Array(finish + 2);
      rd[finish + 1] = (1 << d) - 1;
      for (var j = finish; j >= start; j--) {
        var charMatch = s[text2.charAt(j - 1)];
        if (d === 0) {
          rd[j] = (rd[j + 1] << 1 | 1) & charMatch;
        } else {
          rd[j] = (rd[j + 1] << 1 | 1) & charMatch | ((last_rd[j + 1] | last_rd[j]) << 1 | 1) | last_rd[j + 1];
        }
        if (rd[j] & matchmask) {
          var score = match_bitapScore_(d, j - 1);
          if (score <= score_threshold) {
            score_threshold = score;
            best_loc = j - 1;
            if (best_loc > loc) {
              start = Math.max(1, 2 * loc - best_loc);
            } else {
              break;
            }
          }
        }
      }
      if (match_bitapScore_(d + 1, loc) > score_threshold) {
        break;
      }
      last_rd = rd;
    }
    return best_loc;
  };
  diff_match_patch2.prototype.match_alphabet_ = function(pattern) {
    var s = {};
    for (var i = 0; i < pattern.length; i++) {
      s[pattern.charAt(i)] = 0;
    }
    for (var i = 0; i < pattern.length; i++) {
      s[pattern.charAt(i)] |= 1 << pattern.length - i - 1;
    }
    return s;
  };
  diff_match_patch2.prototype.patch_addContext_ = function(patch, text2) {
    if (text2.length == 0) {
      return;
    }
    if (patch.start2 === null) {
      throw Error("patch not initialized");
    }
    var pattern = text2.substring(patch.start2, patch.start2 + patch.length1);
    var padding = 0;
    while (text2.indexOf(pattern) != text2.lastIndexOf(pattern) && pattern.length < this.Match_MaxBits - this.Patch_Margin - this.Patch_Margin) {
      padding += this.Patch_Margin;
      pattern = text2.substring(patch.start2 - padding, patch.start2 + patch.length1 + padding);
    }
    padding += this.Patch_Margin;
    var prefix = text2.substring(patch.start2 - padding, patch.start2);
    if (prefix) {
      patch.diffs.unshift(new diff_match_patch2.Diff(DIFF_EQUAL, prefix));
    }
    var suffix = text2.substring(patch.start2 + patch.length1, patch.start2 + patch.length1 + padding);
    if (suffix) {
      patch.diffs.push(new diff_match_patch2.Diff(DIFF_EQUAL, suffix));
    }
    patch.start1 -= prefix.length;
    patch.start2 -= prefix.length;
    patch.length1 += prefix.length + suffix.length;
    patch.length2 += prefix.length + suffix.length;
  };
  diff_match_patch2.prototype.patch_make = function(a, opt_b, opt_c) {
    var text1, diffs;
    if (typeof a == "string" && typeof opt_b == "string" && typeof opt_c == "undefined") {
      text1 = /** @type {string} */
      a;
      diffs = this.diff_main(
        text1,
        /** @type {string} */
        opt_b,
        true
      );
      if (diffs.length > 2) {
        this.diff_cleanupSemantic(diffs);
        this.diff_cleanupEfficiency(diffs);
      }
    } else if (a && typeof a == "object" && typeof opt_b == "undefined" && typeof opt_c == "undefined") {
      diffs = /** @type {!Array.<!diff_match_patch.Diff>} */
      a;
      text1 = this.diff_text1(diffs);
    } else if (typeof a == "string" && opt_b && typeof opt_b == "object" && typeof opt_c == "undefined") {
      text1 = /** @type {string} */
      a;
      diffs = /** @type {!Array.<!diff_match_patch.Diff>} */
      opt_b;
    } else if (typeof a == "string" && typeof opt_b == "string" && opt_c && typeof opt_c == "object") {
      text1 = /** @type {string} */
      a;
      diffs = /** @type {!Array.<!diff_match_patch.Diff>} */
      opt_c;
    } else {
      throw new Error("Unknown call format to patch_make.");
    }
    if (diffs.length === 0) {
      return [];
    }
    var patches = [];
    var patch = new diff_match_patch2.patch_obj();
    var patchDiffLength = 0;
    var char_count1 = 0;
    var char_count2 = 0;
    var prepatch_text = text1;
    var postpatch_text = text1;
    for (var x = 0; x < diffs.length; x++) {
      var diff_type = diffs[x][0];
      var diff_text = diffs[x][1];
      if (!patchDiffLength && diff_type !== DIFF_EQUAL) {
        patch.start1 = char_count1;
        patch.start2 = char_count2;
      }
      switch (diff_type) {
        case DIFF_INSERT:
          patch.diffs[patchDiffLength++] = diffs[x];
          patch.length2 += diff_text.length;
          postpatch_text = postpatch_text.substring(0, char_count2) + diff_text + postpatch_text.substring(char_count2);
          break;
        case DIFF_DELETE:
          patch.length1 += diff_text.length;
          patch.diffs[patchDiffLength++] = diffs[x];
          postpatch_text = postpatch_text.substring(0, char_count2) + postpatch_text.substring(char_count2 + diff_text.length);
          break;
        case DIFF_EQUAL:
          if (diff_text.length <= 2 * this.Patch_Margin && patchDiffLength && diffs.length != x + 1) {
            patch.diffs[patchDiffLength++] = diffs[x];
            patch.length1 += diff_text.length;
            patch.length2 += diff_text.length;
          } else if (diff_text.length >= 2 * this.Patch_Margin) {
            if (patchDiffLength) {
              this.patch_addContext_(patch, prepatch_text);
              patches.push(patch);
              patch = new diff_match_patch2.patch_obj();
              patchDiffLength = 0;
              prepatch_text = postpatch_text;
              char_count1 = char_count2;
            }
          }
          break;
      }
      if (diff_type !== DIFF_INSERT) {
        char_count1 += diff_text.length;
      }
      if (diff_type !== DIFF_DELETE) {
        char_count2 += diff_text.length;
      }
    }
    if (patchDiffLength) {
      this.patch_addContext_(patch, prepatch_text);
      patches.push(patch);
    }
    return patches;
  };
  diff_match_patch2.prototype.patch_deepCopy = function(patches) {
    var patchesCopy = [];
    for (var x = 0; x < patches.length; x++) {
      var patch = patches[x];
      var patchCopy = new diff_match_patch2.patch_obj();
      patchCopy.diffs = [];
      for (var y = 0; y < patch.diffs.length; y++) {
        patchCopy.diffs[y] = new diff_match_patch2.Diff(patch.diffs[y][0], patch.diffs[y][1]);
      }
      patchCopy.start1 = patch.start1;
      patchCopy.start2 = patch.start2;
      patchCopy.length1 = patch.length1;
      patchCopy.length2 = patch.length2;
      patchesCopy[x] = patchCopy;
    }
    return patchesCopy;
  };
  diff_match_patch2.prototype.patch_apply = function(patches, text2) {
    if (patches.length == 0) {
      return [text2, []];
    }
    patches = this.patch_deepCopy(patches);
    var nullPadding = this.patch_addPadding(patches);
    text2 = nullPadding + text2 + nullPadding;
    this.patch_splitMax(patches);
    var delta = 0;
    var results = [];
    for (var x = 0; x < patches.length; x++) {
      var expected_loc = patches[x].start2 + delta;
      var text1 = this.diff_text1(patches[x].diffs);
      var start_loc;
      var end_loc = -1;
      if (text1.length > this.Match_MaxBits) {
        start_loc = this.match_main(text2, text1.substring(0, this.Match_MaxBits), expected_loc);
        if (start_loc != -1) {
          end_loc = this.match_main(text2, text1.substring(text1.length - this.Match_MaxBits), expected_loc + text1.length - this.Match_MaxBits);
          if (end_loc == -1 || start_loc >= end_loc) {
            start_loc = -1;
          }
        }
      } else {
        start_loc = this.match_main(text2, text1, expected_loc);
      }
      if (start_loc == -1) {
        results[x] = false;
        delta -= patches[x].length2 - patches[x].length1;
      } else {
        results[x] = true;
        delta = start_loc - expected_loc;
        var text22;
        if (end_loc == -1) {
          text22 = text2.substring(start_loc, start_loc + text1.length);
        } else {
          text22 = text2.substring(start_loc, end_loc + this.Match_MaxBits);
        }
        if (text1 == text22) {
          text2 = text2.substring(0, start_loc) + this.diff_text2(patches[x].diffs) + text2.substring(start_loc + text1.length);
        } else {
          var diffs = this.diff_main(text1, text22, false);
          if (text1.length > this.Match_MaxBits && this.diff_levenshtein(diffs) / text1.length > this.Patch_DeleteThreshold) {
            results[x] = false;
          } else {
            this.diff_cleanupSemanticLossless(diffs);
            var index1 = 0;
            var index2;
            for (var y = 0; y < patches[x].diffs.length; y++) {
              var mod = patches[x].diffs[y];
              if (mod[0] !== DIFF_EQUAL) {
                index2 = this.diff_xIndex(diffs, index1);
              }
              if (mod[0] === DIFF_INSERT) {
                text2 = text2.substring(0, start_loc + index2) + mod[1] + text2.substring(start_loc + index2);
              } else if (mod[0] === DIFF_DELETE) {
                text2 = text2.substring(0, start_loc + index2) + text2.substring(start_loc + this.diff_xIndex(diffs, index1 + mod[1].length));
              }
              if (mod[0] !== DIFF_DELETE) {
                index1 += mod[1].length;
              }
            }
          }
        }
      }
    }
    text2 = text2.substring(nullPadding.length, text2.length - nullPadding.length);
    return [text2, results];
  };
  diff_match_patch2.prototype.patch_addPadding = function(patches) {
    var paddingLength = this.Patch_Margin;
    var nullPadding = "";
    for (var x = 1; x <= paddingLength; x++) {
      nullPadding += String.fromCharCode(x);
    }
    for (var x = 0; x < patches.length; x++) {
      patches[x].start1 += paddingLength;
      patches[x].start2 += paddingLength;
    }
    var patch = patches[0];
    var diffs = patch.diffs;
    if (diffs.length == 0 || diffs[0][0] != DIFF_EQUAL) {
      diffs.unshift(new diff_match_patch2.Diff(DIFF_EQUAL, nullPadding));
      patch.start1 -= paddingLength;
      patch.start2 -= paddingLength;
      patch.length1 += paddingLength;
      patch.length2 += paddingLength;
    } else if (paddingLength > diffs[0][1].length) {
      var extraLength = paddingLength - diffs[0][1].length;
      diffs[0][1] = nullPadding.substring(diffs[0][1].length) + diffs[0][1];
      patch.start1 -= extraLength;
      patch.start2 -= extraLength;
      patch.length1 += extraLength;
      patch.length2 += extraLength;
    }
    patch = patches[patches.length - 1];
    diffs = patch.diffs;
    if (diffs.length == 0 || diffs[diffs.length - 1][0] != DIFF_EQUAL) {
      diffs.push(new diff_match_patch2.Diff(DIFF_EQUAL, nullPadding));
      patch.length1 += paddingLength;
      patch.length2 += paddingLength;
    } else if (paddingLength > diffs[diffs.length - 1][1].length) {
      var extraLength = paddingLength - diffs[diffs.length - 1][1].length;
      diffs[diffs.length - 1][1] += nullPadding.substring(0, extraLength);
      patch.length1 += extraLength;
      patch.length2 += extraLength;
    }
    return nullPadding;
  };
  diff_match_patch2.prototype.patch_splitMax = function(patches) {
    var patch_size = this.Match_MaxBits;
    for (var x = 0; x < patches.length; x++) {
      if (patches[x].length1 <= patch_size) {
        continue;
      }
      var bigpatch = patches[x];
      patches.splice(x--, 1);
      var start1 = bigpatch.start1;
      var start2 = bigpatch.start2;
      var precontext = "";
      while (bigpatch.diffs.length !== 0) {
        var patch = new diff_match_patch2.patch_obj();
        var empty2 = true;
        patch.start1 = start1 - precontext.length;
        patch.start2 = start2 - precontext.length;
        if (precontext !== "") {
          patch.length1 = patch.length2 = precontext.length;
          patch.diffs.push(new diff_match_patch2.Diff(DIFF_EQUAL, precontext));
        }
        while (bigpatch.diffs.length !== 0 && patch.length1 < patch_size - this.Patch_Margin) {
          var diff_type = bigpatch.diffs[0][0];
          var diff_text = bigpatch.diffs[0][1];
          if (diff_type === DIFF_INSERT) {
            patch.length2 += diff_text.length;
            start2 += diff_text.length;
            patch.diffs.push(bigpatch.diffs.shift());
            empty2 = false;
          } else if (diff_type === DIFF_DELETE && patch.diffs.length == 1 && patch.diffs[0][0] == DIFF_EQUAL && diff_text.length > 2 * patch_size) {
            patch.length1 += diff_text.length;
            start1 += diff_text.length;
            empty2 = false;
            patch.diffs.push(new diff_match_patch2.Diff(diff_type, diff_text));
            bigpatch.diffs.shift();
          } else {
            diff_text = diff_text.substring(0, patch_size - patch.length1 - this.Patch_Margin);
            patch.length1 += diff_text.length;
            start1 += diff_text.length;
            if (diff_type === DIFF_EQUAL) {
              patch.length2 += diff_text.length;
              start2 += diff_text.length;
            } else {
              empty2 = false;
            }
            patch.diffs.push(new diff_match_patch2.Diff(diff_type, diff_text));
            if (diff_text == bigpatch.diffs[0][1]) {
              bigpatch.diffs.shift();
            } else {
              bigpatch.diffs[0][1] = bigpatch.diffs[0][1].substring(diff_text.length);
            }
          }
        }
        precontext = this.diff_text2(patch.diffs);
        precontext = precontext.substring(precontext.length - this.Patch_Margin);
        var postcontext = this.diff_text1(bigpatch.diffs).substring(0, this.Patch_Margin);
        if (postcontext !== "") {
          patch.length1 += postcontext.length;
          patch.length2 += postcontext.length;
          if (patch.diffs.length !== 0 && patch.diffs[patch.diffs.length - 1][0] === DIFF_EQUAL) {
            patch.diffs[patch.diffs.length - 1][1] += postcontext;
          } else {
            patch.diffs.push(new diff_match_patch2.Diff(DIFF_EQUAL, postcontext));
          }
        }
        if (!empty2) {
          patches.splice(++x, 0, patch);
        }
      }
    }
  };
  diff_match_patch2.prototype.patch_toText = function(patches) {
    var text2 = [];
    for (var x = 0; x < patches.length; x++) {
      text2[x] = patches[x];
    }
    return text2.join("");
  };
  diff_match_patch2.prototype.patch_fromText = function(textline) {
    var patches = [];
    if (!textline) {
      return patches;
    }
    var text2 = textline.split("\n");
    var textPointer = 0;
    var patchHeader = /^@@ -(\d+),?(\d*) \+(\d+),?(\d*) @@$/;
    while (textPointer < text2.length) {
      var m = text2[textPointer].match(patchHeader);
      if (!m) {
        throw new Error("Invalid patch string: " + text2[textPointer]);
      }
      var patch = new diff_match_patch2.patch_obj();
      patches.push(patch);
      patch.start1 = parseInt(m[1], 10);
      if (m[2] === "") {
        patch.start1--;
        patch.length1 = 1;
      } else if (m[2] == "0") {
        patch.length1 = 0;
      } else {
        patch.start1--;
        patch.length1 = parseInt(m[2], 10);
      }
      patch.start2 = parseInt(m[3], 10);
      if (m[4] === "") {
        patch.start2--;
        patch.length2 = 1;
      } else if (m[4] == "0") {
        patch.length2 = 0;
      } else {
        patch.start2--;
        patch.length2 = parseInt(m[4], 10);
      }
      textPointer++;
      while (textPointer < text2.length) {
        var sign = text2[textPointer].charAt(0);
        try {
          var line = decodeURI(text2[textPointer].substring(1));
        } catch (ex) {
          throw new Error("Illegal escape in patch_fromText: " + line);
        }
        if (sign == "-") {
          patch.diffs.push(new diff_match_patch2.Diff(DIFF_DELETE, line));
        } else if (sign == "+") {
          patch.diffs.push(new diff_match_patch2.Diff(DIFF_INSERT, line));
        } else if (sign == " ") {
          patch.diffs.push(new diff_match_patch2.Diff(DIFF_EQUAL, line));
        } else if (sign == "@") {
          break;
        } else if (sign === "")
          ;
        else {
          throw new Error('Invalid patch mode "' + sign + '" in: ' + line);
        }
        textPointer++;
      }
    }
    return patches;
  };
  diff_match_patch2.patch_obj = function() {
    this.diffs = [];
    this.start1 = null;
    this.start2 = null;
    this.length1 = 0;
    this.length2 = 0;
  };
  diff_match_patch2.patch_obj.prototype.toString = function() {
    var coords1, coords2;
    if (this.length1 === 0) {
      coords1 = this.start1 + ",0";
    } else if (this.length1 == 1) {
      coords1 = this.start1 + 1;
    } else {
      coords1 = this.start1 + 1 + "," + this.length1;
    }
    if (this.length2 === 0) {
      coords2 = this.start2 + ",0";
    } else if (this.length2 == 1) {
      coords2 = this.start2 + 1;
    } else {
      coords2 = this.start2 + 1 + "," + this.length2;
    }
    var text2 = ["@@ -" + coords1 + " +" + coords2 + " @@\n"];
    var op;
    for (var x = 0; x < this.diffs.length; x++) {
      switch (this.diffs[x][0]) {
        case DIFF_INSERT:
          op = "+";
          break;
        case DIFF_DELETE:
          op = "-";
          break;
        case DIFF_EQUAL:
          op = " ";
          break;
      }
      text2[x + 1] = op + encodeURI(this.diffs[x][1]) + "\n";
    }
    return text2.join("").replace(/%20/g, " ");
  };
  module.exports = diff_match_patch2;
  module.exports["diff_match_patch"] = diff_match_patch2;
  module.exports["DIFF_DELETE"] = DIFF_DELETE;
  module.exports["DIFF_INSERT"] = DIFF_INSERT;
  module.exports["DIFF_EQUAL"] = DIFF_EQUAL;
})(diffMatchPatch);
var diffMatchPatchExports = diffMatchPatch.exports;
var dmp = /* @__PURE__ */ getDefaultExportFromCjs(diffMatchPatchExports);
var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function(obj) {
  return typeof obj;
} : function(obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};
var classCallCheck = function(instance2, Constructor) {
  if (!(instance2 instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};
var createClass = /* @__PURE__ */ function() {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor)
        descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }
  return function(Constructor, protoProps, staticProps) {
    if (protoProps)
      defineProperties(Constructor.prototype, protoProps);
    if (staticProps)
      defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();
var get = function get2(object, property, receiver) {
  if (object === null)
    object = Function.prototype;
  var desc = Object.getOwnPropertyDescriptor(object, property);
  if (desc === void 0) {
    var parent = Object.getPrototypeOf(object);
    if (parent === null) {
      return void 0;
    } else {
      return get2(parent, property, receiver);
    }
  } else if ("value" in desc) {
    return desc.value;
  } else {
    var getter = desc.get;
    if (getter === void 0) {
      return void 0;
    }
    return getter.call(receiver);
  }
};
var inherits = function(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }
  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass)
    Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};
var possibleConstructorReturn = function(self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }
  return call && (typeof call === "object" || typeof call === "function") ? call : self;
};
var Processor = function() {
  function Processor2(options) {
    classCallCheck(this, Processor2);
    this.selfOptions = options || {};
    this.pipes = {};
  }
  createClass(Processor2, [{
    key: "options",
    value: function options(_options) {
      if (_options) {
        this.selfOptions = _options;
      }
      return this.selfOptions;
    }
  }, {
    key: "pipe",
    value: function pipe(name, pipeArg) {
      var pipe2 = pipeArg;
      if (typeof name === "string") {
        if (typeof pipe2 === "undefined") {
          return this.pipes[name];
        } else {
          this.pipes[name] = pipe2;
        }
      }
      if (name && name.name) {
        pipe2 = name;
        if (pipe2.processor === this) {
          return pipe2;
        }
        this.pipes[pipe2.name] = pipe2;
      }
      pipe2.processor = this;
      return pipe2;
    }
  }, {
    key: "process",
    value: function process(input, pipe) {
      var context = input;
      context.options = this.options();
      var nextPipe = pipe || input.pipe || "default";
      var lastPipe = void 0;
      var lastContext = void 0;
      while (nextPipe) {
        if (typeof context.nextAfterChildren !== "undefined") {
          context.next = context.nextAfterChildren;
          context.nextAfterChildren = null;
        }
        if (typeof nextPipe === "string") {
          nextPipe = this.pipe(nextPipe);
        }
        nextPipe.process(context);
        lastContext = context;
        lastPipe = nextPipe;
        nextPipe = null;
        if (context) {
          if (context.next) {
            context = context.next;
            nextPipe = lastContext.nextPipe || context.pipe || lastPipe;
          }
        }
      }
      return context.hasResult ? context.result : void 0;
    }
  }]);
  return Processor2;
}();
var Pipe = function() {
  function Pipe2(name) {
    classCallCheck(this, Pipe2);
    this.name = name;
    this.filters = [];
  }
  createClass(Pipe2, [{
    key: "process",
    value: function process(input) {
      if (!this.processor) {
        throw new Error("add this pipe to a processor before using it");
      }
      var debug = this.debug;
      var length = this.filters.length;
      var context = input;
      for (var index = 0; index < length; index++) {
        var filter = this.filters[index];
        if (debug) {
          this.log("filter: " + filter.filterName);
        }
        filter(context);
        if ((typeof context === "undefined" ? "undefined" : _typeof(context)) === "object" && context.exiting) {
          context.exiting = false;
          break;
        }
      }
      if (!context.next && this.resultCheck) {
        this.resultCheck(context);
      }
    }
  }, {
    key: "log",
    value: function log(msg) {
      console.log("[jsondiffpatch] " + this.name + " pipe, " + msg);
    }
  }, {
    key: "append",
    value: function append2() {
      var _filters;
      (_filters = this.filters).push.apply(_filters, arguments);
      return this;
    }
  }, {
    key: "prepend",
    value: function prepend() {
      var _filters2;
      (_filters2 = this.filters).unshift.apply(_filters2, arguments);
      return this;
    }
  }, {
    key: "indexOf",
    value: function indexOf(filterName) {
      if (!filterName) {
        throw new Error("a filter name is required");
      }
      for (var index = 0; index < this.filters.length; index++) {
        var filter = this.filters[index];
        if (filter.filterName === filterName) {
          return index;
        }
      }
      throw new Error("filter not found: " + filterName);
    }
  }, {
    key: "list",
    value: function list() {
      return this.filters.map(function(f) {
        return f.filterName;
      });
    }
  }, {
    key: "after",
    value: function after(filterName) {
      var index = this.indexOf(filterName);
      var params = Array.prototype.slice.call(arguments, 1);
      if (!params.length) {
        throw new Error("a filter is required");
      }
      params.unshift(index + 1, 0);
      Array.prototype.splice.apply(this.filters, params);
      return this;
    }
  }, {
    key: "before",
    value: function before(filterName) {
      var index = this.indexOf(filterName);
      var params = Array.prototype.slice.call(arguments, 1);
      if (!params.length) {
        throw new Error("a filter is required");
      }
      params.unshift(index, 0);
      Array.prototype.splice.apply(this.filters, params);
      return this;
    }
  }, {
    key: "replace",
    value: function replace(filterName) {
      var index = this.indexOf(filterName);
      var params = Array.prototype.slice.call(arguments, 1);
      if (!params.length) {
        throw new Error("a filter is required");
      }
      params.unshift(index, 1);
      Array.prototype.splice.apply(this.filters, params);
      return this;
    }
  }, {
    key: "remove",
    value: function remove(filterName) {
      var index = this.indexOf(filterName);
      this.filters.splice(index, 1);
      return this;
    }
  }, {
    key: "clear",
    value: function clear() {
      this.filters.length = 0;
      return this;
    }
  }, {
    key: "shouldHaveResult",
    value: function shouldHaveResult(should) {
      if (should === false) {
        this.resultCheck = null;
        return;
      }
      if (this.resultCheck) {
        return;
      }
      var pipe = this;
      this.resultCheck = function(context) {
        if (!context.hasResult) {
          console.log(context);
          var error = new Error(pipe.name + " failed");
          error.noResult = true;
          throw error;
        }
      };
      return this;
    }
  }]);
  return Pipe2;
}();
var Context = function() {
  function Context2() {
    classCallCheck(this, Context2);
  }
  createClass(Context2, [{
    key: "setResult",
    value: function setResult(result) {
      this.result = result;
      this.hasResult = true;
      return this;
    }
  }, {
    key: "exit",
    value: function exit() {
      this.exiting = true;
      return this;
    }
  }, {
    key: "switchTo",
    value: function switchTo(next, pipe) {
      if (typeof next === "string" || next instanceof Pipe) {
        this.nextPipe = next;
      } else {
        this.next = next;
        if (pipe) {
          this.nextPipe = pipe;
        }
      }
      return this;
    }
  }, {
    key: "push",
    value: function push(child, name) {
      child.parent = this;
      if (typeof name !== "undefined") {
        child.childName = name;
      }
      child.root = this.root || this;
      child.options = child.options || this.options;
      if (!this.children) {
        this.children = [child];
        this.nextAfterChildren = this.next || null;
        this.next = child;
      } else {
        this.children[this.children.length - 1].next = child;
        this.children.push(child);
      }
      child.next = this;
      return this;
    }
  }]);
  return Context2;
}();
var isArray = typeof Array.isArray === "function" ? Array.isArray : function(a) {
  return a instanceof Array;
};
function cloneRegExp(re) {
  var regexMatch = /^\/(.*)\/([gimyu]*)$/.exec(re.toString());
  return new RegExp(regexMatch[1], regexMatch[2]);
}
function clone(arg) {
  if ((typeof arg === "undefined" ? "undefined" : _typeof(arg)) !== "object") {
    return arg;
  }
  if (arg === null) {
    return null;
  }
  if (isArray(arg)) {
    return arg.map(clone);
  }
  if (arg instanceof Date) {
    return new Date(arg.getTime());
  }
  if (arg instanceof RegExp) {
    return cloneRegExp(arg);
  }
  var cloned = {};
  for (var name in arg) {
    if (Object.prototype.hasOwnProperty.call(arg, name)) {
      cloned[name] = clone(arg[name]);
    }
  }
  return cloned;
}
var DiffContext = function(_Context) {
  inherits(DiffContext2, _Context);
  function DiffContext2(left, right) {
    classCallCheck(this, DiffContext2);
    var _this = possibleConstructorReturn(this, (DiffContext2.__proto__ || Object.getPrototypeOf(DiffContext2)).call(this));
    _this.left = left;
    _this.right = right;
    _this.pipe = "diff";
    return _this;
  }
  createClass(DiffContext2, [{
    key: "setResult",
    value: function setResult(result) {
      if (this.options.cloneDiffValues && (typeof result === "undefined" ? "undefined" : _typeof(result)) === "object") {
        var clone$$1 = typeof this.options.cloneDiffValues === "function" ? this.options.cloneDiffValues : clone;
        if (_typeof(result[0]) === "object") {
          result[0] = clone$$1(result[0]);
        }
        if (_typeof(result[1]) === "object") {
          result[1] = clone$$1(result[1]);
        }
      }
      return Context.prototype.setResult.apply(this, arguments);
    }
  }]);
  return DiffContext2;
}(Context);
var PatchContext = function(_Context) {
  inherits(PatchContext2, _Context);
  function PatchContext2(left, delta) {
    classCallCheck(this, PatchContext2);
    var _this = possibleConstructorReturn(this, (PatchContext2.__proto__ || Object.getPrototypeOf(PatchContext2)).call(this));
    _this.left = left;
    _this.delta = delta;
    _this.pipe = "patch";
    return _this;
  }
  return PatchContext2;
}(Context);
var ReverseContext = function(_Context) {
  inherits(ReverseContext2, _Context);
  function ReverseContext2(delta) {
    classCallCheck(this, ReverseContext2);
    var _this = possibleConstructorReturn(this, (ReverseContext2.__proto__ || Object.getPrototypeOf(ReverseContext2)).call(this));
    _this.delta = delta;
    _this.pipe = "reverse";
    return _this;
  }
  return ReverseContext2;
}(Context);
var isArray$1 = typeof Array.isArray === "function" ? Array.isArray : function(a) {
  return a instanceof Array;
};
var diffFilter = function trivialMatchesDiffFilter(context) {
  if (context.left === context.right) {
    context.setResult(void 0).exit();
    return;
  }
  if (typeof context.left === "undefined") {
    if (typeof context.right === "function") {
      throw new Error("functions are not supported");
    }
    context.setResult([context.right]).exit();
    return;
  }
  if (typeof context.right === "undefined") {
    context.setResult([context.left, 0, 0]).exit();
    return;
  }
  if (typeof context.left === "function" || typeof context.right === "function") {
    throw new Error("functions are not supported");
  }
  context.leftType = context.left === null ? "null" : _typeof(context.left);
  context.rightType = context.right === null ? "null" : _typeof(context.right);
  if (context.leftType !== context.rightType) {
    context.setResult([context.left, context.right]).exit();
    return;
  }
  if (context.leftType === "boolean" || context.leftType === "number") {
    context.setResult([context.left, context.right]).exit();
    return;
  }
  if (context.leftType === "object") {
    context.leftIsArray = isArray$1(context.left);
  }
  if (context.rightType === "object") {
    context.rightIsArray = isArray$1(context.right);
  }
  if (context.leftIsArray !== context.rightIsArray) {
    context.setResult([context.left, context.right]).exit();
    return;
  }
  if (context.left instanceof RegExp) {
    if (context.right instanceof RegExp) {
      context.setResult([context.left.toString(), context.right.toString()]).exit();
    } else {
      context.setResult([context.left, context.right]).exit();
    }
  }
};
diffFilter.filterName = "trivial";
var patchFilter = function trivialMatchesPatchFilter(context) {
  if (typeof context.delta === "undefined") {
    context.setResult(context.left).exit();
    return;
  }
  context.nested = !isArray$1(context.delta);
  if (context.nested) {
    return;
  }
  if (context.delta.length === 1) {
    context.setResult(context.delta[0]).exit();
    return;
  }
  if (context.delta.length === 2) {
    if (context.left instanceof RegExp) {
      var regexArgs = /^\/(.*)\/([gimyu]+)$/.exec(context.delta[1]);
      if (regexArgs) {
        context.setResult(new RegExp(regexArgs[1], regexArgs[2])).exit();
        return;
      }
    }
    context.setResult(context.delta[1]).exit();
    return;
  }
  if (context.delta.length === 3 && context.delta[2] === 0) {
    context.setResult(void 0).exit();
  }
};
patchFilter.filterName = "trivial";
var reverseFilter = function trivialReferseFilter(context) {
  if (typeof context.delta === "undefined") {
    context.setResult(context.delta).exit();
    return;
  }
  context.nested = !isArray$1(context.delta);
  if (context.nested) {
    return;
  }
  if (context.delta.length === 1) {
    context.setResult([context.delta[0], 0, 0]).exit();
    return;
  }
  if (context.delta.length === 2) {
    context.setResult([context.delta[1], context.delta[0]]).exit();
    return;
  }
  if (context.delta.length === 3 && context.delta[2] === 0) {
    context.setResult([context.delta[0]]).exit();
  }
};
reverseFilter.filterName = "trivial";
function collectChildrenDiffFilter(context) {
  if (!context || !context.children) {
    return;
  }
  var length = context.children.length;
  var child = void 0;
  var result = context.result;
  for (var index = 0; index < length; index++) {
    child = context.children[index];
    if (typeof child.result === "undefined") {
      continue;
    }
    result = result || {};
    result[child.childName] = child.result;
  }
  if (result && context.leftIsArray) {
    result._t = "a";
  }
  context.setResult(result).exit();
}
collectChildrenDiffFilter.filterName = "collectChildren";
function objectsDiffFilter(context) {
  if (context.leftIsArray || context.leftType !== "object") {
    return;
  }
  var name = void 0;
  var child = void 0;
  var propertyFilter = context.options.propertyFilter;
  for (name in context.left) {
    if (!Object.prototype.hasOwnProperty.call(context.left, name)) {
      continue;
    }
    if (propertyFilter && !propertyFilter(name, context)) {
      continue;
    }
    child = new DiffContext(context.left[name], context.right[name]);
    context.push(child, name);
  }
  for (name in context.right) {
    if (!Object.prototype.hasOwnProperty.call(context.right, name)) {
      continue;
    }
    if (propertyFilter && !propertyFilter(name, context)) {
      continue;
    }
    if (typeof context.left[name] === "undefined") {
      child = new DiffContext(void 0, context.right[name]);
      context.push(child, name);
    }
  }
  if (!context.children || context.children.length === 0) {
    context.setResult(void 0).exit();
    return;
  }
  context.exit();
}
objectsDiffFilter.filterName = "objects";
var patchFilter$1 = function nestedPatchFilter(context) {
  if (!context.nested) {
    return;
  }
  if (context.delta._t) {
    return;
  }
  var name = void 0;
  var child = void 0;
  for (name in context.delta) {
    child = new PatchContext(context.left[name], context.delta[name]);
    context.push(child, name);
  }
  context.exit();
};
patchFilter$1.filterName = "objects";
var collectChildrenPatchFilter = function collectChildrenPatchFilter2(context) {
  if (!context || !context.children) {
    return;
  }
  if (context.delta._t) {
    return;
  }
  var length = context.children.length;
  var child = void 0;
  for (var index = 0; index < length; index++) {
    child = context.children[index];
    if (Object.prototype.hasOwnProperty.call(context.left, child.childName) && child.result === void 0) {
      delete context.left[child.childName];
    } else if (context.left[child.childName] !== child.result) {
      context.left[child.childName] = child.result;
    }
  }
  context.setResult(context.left).exit();
};
collectChildrenPatchFilter.filterName = "collectChildren";
var reverseFilter$1 = function nestedReverseFilter(context) {
  if (!context.nested) {
    return;
  }
  if (context.delta._t) {
    return;
  }
  var name = void 0;
  var child = void 0;
  for (name in context.delta) {
    child = new ReverseContext(context.delta[name]);
    context.push(child, name);
  }
  context.exit();
};
reverseFilter$1.filterName = "objects";
function collectChildrenReverseFilter(context) {
  if (!context || !context.children) {
    return;
  }
  if (context.delta._t) {
    return;
  }
  var length = context.children.length;
  var child = void 0;
  var delta = {};
  for (var index = 0; index < length; index++) {
    child = context.children[index];
    if (delta[child.childName] !== child.result) {
      delta[child.childName] = child.result;
    }
  }
  context.setResult(delta).exit();
}
collectChildrenReverseFilter.filterName = "collectChildren";
var defaultMatch = function defaultMatch2(array1, array2, index1, index2) {
  return array1[index1] === array2[index2];
};
var lengthMatrix = function lengthMatrix2(array1, array2, match, context) {
  var len1 = array1.length;
  var len2 = array2.length;
  var x = void 0, y = void 0;
  var matrix = [len1 + 1];
  for (x = 0; x < len1 + 1; x++) {
    matrix[x] = [len2 + 1];
    for (y = 0; y < len2 + 1; y++) {
      matrix[x][y] = 0;
    }
  }
  matrix.match = match;
  for (x = 1; x < len1 + 1; x++) {
    for (y = 1; y < len2 + 1; y++) {
      if (match(array1, array2, x - 1, y - 1, context)) {
        matrix[x][y] = matrix[x - 1][y - 1] + 1;
      } else {
        matrix[x][y] = Math.max(matrix[x - 1][y], matrix[x][y - 1]);
      }
    }
  }
  return matrix;
};
var backtrack = function backtrack2(matrix, array1, array2, context) {
  var index1 = array1.length;
  var index2 = array2.length;
  var subsequence = {
    sequence: [],
    indices1: [],
    indices2: []
  };
  while (index1 !== 0 && index2 !== 0) {
    var sameLetter = matrix.match(array1, array2, index1 - 1, index2 - 1, context);
    if (sameLetter) {
      subsequence.sequence.unshift(array1[index1 - 1]);
      subsequence.indices1.unshift(index1 - 1);
      subsequence.indices2.unshift(index2 - 1);
      --index1;
      --index2;
    } else {
      var valueAtMatrixAbove = matrix[index1][index2 - 1];
      var valueAtMatrixLeft = matrix[index1 - 1][index2];
      if (valueAtMatrixAbove > valueAtMatrixLeft) {
        --index2;
      } else {
        --index1;
      }
    }
  }
  return subsequence;
};
var get$1 = function get3(array1, array2, match, context) {
  var innerContext = context || {};
  var matrix = lengthMatrix(array1, array2, match || defaultMatch, innerContext);
  var result = backtrack(matrix, array1, array2, innerContext);
  if (typeof array1 === "string" && typeof array2 === "string") {
    result.sequence = result.sequence.join("");
  }
  return result;
};
var lcs = {
  get: get$1
};
var ARRAY_MOVE = 3;
var isArray$2 = typeof Array.isArray === "function" ? Array.isArray : function(a) {
  return a instanceof Array;
};
var arrayIndexOf = typeof Array.prototype.indexOf === "function" ? function(array, item) {
  return array.indexOf(item);
} : function(array, item) {
  var length = array.length;
  for (var i = 0; i < length; i++) {
    if (array[i] === item) {
      return i;
    }
  }
  return -1;
};
function arraysHaveMatchByRef(array1, array2, len1, len2) {
  for (var index1 = 0; index1 < len1; index1++) {
    var val1 = array1[index1];
    for (var index2 = 0; index2 < len2; index2++) {
      var val2 = array2[index2];
      if (index1 !== index2 && val1 === val2) {
        return true;
      }
    }
  }
}
function matchItems(array1, array2, index1, index2, context) {
  var value1 = array1[index1];
  var value2 = array2[index2];
  if (value1 === value2) {
    return true;
  }
  if ((typeof value1 === "undefined" ? "undefined" : _typeof(value1)) !== "object" || (typeof value2 === "undefined" ? "undefined" : _typeof(value2)) !== "object") {
    return false;
  }
  var objectHash = context.objectHash;
  if (!objectHash) {
    return context.matchByPosition && index1 === index2;
  }
  var hash1 = void 0;
  var hash2 = void 0;
  if (typeof index1 === "number") {
    context.hashCache1 = context.hashCache1 || [];
    hash1 = context.hashCache1[index1];
    if (typeof hash1 === "undefined") {
      context.hashCache1[index1] = hash1 = objectHash(value1, index1);
    }
  } else {
    hash1 = objectHash(value1);
  }
  if (typeof hash1 === "undefined") {
    return false;
  }
  if (typeof index2 === "number") {
    context.hashCache2 = context.hashCache2 || [];
    hash2 = context.hashCache2[index2];
    if (typeof hash2 === "undefined") {
      context.hashCache2[index2] = hash2 = objectHash(value2, index2);
    }
  } else {
    hash2 = objectHash(value2);
  }
  if (typeof hash2 === "undefined") {
    return false;
  }
  return hash1 === hash2;
}
var diffFilter$1 = function arraysDiffFilter(context) {
  if (!context.leftIsArray) {
    return;
  }
  var matchContext = {
    objectHash: context.options && context.options.objectHash,
    matchByPosition: context.options && context.options.matchByPosition
  };
  var commonHead = 0;
  var commonTail = 0;
  var index = void 0;
  var index1 = void 0;
  var index2 = void 0;
  var array1 = context.left;
  var array2 = context.right;
  var len1 = array1.length;
  var len2 = array2.length;
  var child = void 0;
  if (len1 > 0 && len2 > 0 && !matchContext.objectHash && typeof matchContext.matchByPosition !== "boolean") {
    matchContext.matchByPosition = !arraysHaveMatchByRef(array1, array2, len1, len2);
  }
  while (commonHead < len1 && commonHead < len2 && matchItems(array1, array2, commonHead, commonHead, matchContext)) {
    index = commonHead;
    child = new DiffContext(context.left[index], context.right[index]);
    context.push(child, index);
    commonHead++;
  }
  while (commonTail + commonHead < len1 && commonTail + commonHead < len2 && matchItems(array1, array2, len1 - 1 - commonTail, len2 - 1 - commonTail, matchContext)) {
    index1 = len1 - 1 - commonTail;
    index2 = len2 - 1 - commonTail;
    child = new DiffContext(context.left[index1], context.right[index2]);
    context.push(child, index2);
    commonTail++;
  }
  var result = void 0;
  if (commonHead + commonTail === len1) {
    if (len1 === len2) {
      context.setResult(void 0).exit();
      return;
    }
    result = result || {
      _t: "a"
    };
    for (index = commonHead; index < len2 - commonTail; index++) {
      result[index] = [array2[index]];
    }
    context.setResult(result).exit();
    return;
  }
  if (commonHead + commonTail === len2) {
    result = result || {
      _t: "a"
    };
    for (index = commonHead; index < len1 - commonTail; index++) {
      result["_" + index] = [array1[index], 0, 0];
    }
    context.setResult(result).exit();
    return;
  }
  delete matchContext.hashCache1;
  delete matchContext.hashCache2;
  var trimmed1 = array1.slice(commonHead, len1 - commonTail);
  var trimmed2 = array2.slice(commonHead, len2 - commonTail);
  var seq = lcs.get(trimmed1, trimmed2, matchItems, matchContext);
  var removedItems = [];
  result = result || {
    _t: "a"
  };
  for (index = commonHead; index < len1 - commonTail; index++) {
    if (arrayIndexOf(seq.indices1, index - commonHead) < 0) {
      result["_" + index] = [array1[index], 0, 0];
      removedItems.push(index);
    }
  }
  var detectMove = true;
  if (context.options && context.options.arrays && context.options.arrays.detectMove === false) {
    detectMove = false;
  }
  var includeValueOnMove = false;
  if (context.options && context.options.arrays && context.options.arrays.includeValueOnMove) {
    includeValueOnMove = true;
  }
  var removedItemsLength = removedItems.length;
  for (index = commonHead; index < len2 - commonTail; index++) {
    var indexOnArray2 = arrayIndexOf(seq.indices2, index - commonHead);
    if (indexOnArray2 < 0) {
      var isMove = false;
      if (detectMove && removedItemsLength > 0) {
        for (var removeItemIndex1 = 0; removeItemIndex1 < removedItemsLength; removeItemIndex1++) {
          index1 = removedItems[removeItemIndex1];
          if (matchItems(trimmed1, trimmed2, index1 - commonHead, index - commonHead, matchContext)) {
            result["_" + index1].splice(1, 2, index, ARRAY_MOVE);
            if (!includeValueOnMove) {
              result["_" + index1][0] = "";
            }
            index2 = index;
            child = new DiffContext(context.left[index1], context.right[index2]);
            context.push(child, index2);
            removedItems.splice(removeItemIndex1, 1);
            isMove = true;
            break;
          }
        }
      }
      if (!isMove) {
        result[index] = [array2[index]];
      }
    } else {
      index1 = seq.indices1[indexOnArray2] + commonHead;
      index2 = seq.indices2[indexOnArray2] + commonHead;
      child = new DiffContext(context.left[index1], context.right[index2]);
      context.push(child, index2);
    }
  }
  context.setResult(result).exit();
};
diffFilter$1.filterName = "arrays";
var compare = {
  numerically: function numerically(a, b) {
    return a - b;
  },
  numericallyBy: function numericallyBy(name) {
    return function(a, b) {
      return a[name] - b[name];
    };
  }
};
var patchFilter$2 = function nestedPatchFilter2(context) {
  if (!context.nested) {
    return;
  }
  if (context.delta._t !== "a") {
    return;
  }
  var index = void 0;
  var index1 = void 0;
  var delta = context.delta;
  var array = context.left;
  var toRemove = [];
  var toInsert = [];
  var toModify = [];
  for (index in delta) {
    if (index !== "_t") {
      if (index[0] === "_") {
        if (delta[index][2] === 0 || delta[index][2] === ARRAY_MOVE) {
          toRemove.push(parseInt(index.slice(1), 10));
        } else {
          throw new Error("only removal or move can be applied at original array indices," + (" invalid diff type: " + delta[index][2]));
        }
      } else {
        if (delta[index].length === 1) {
          toInsert.push({
            index: parseInt(index, 10),
            value: delta[index][0]
          });
        } else {
          toModify.push({
            index: parseInt(index, 10),
            delta: delta[index]
          });
        }
      }
    }
  }
  toRemove = toRemove.sort(compare.numerically);
  for (index = toRemove.length - 1; index >= 0; index--) {
    index1 = toRemove[index];
    var indexDiff = delta["_" + index1];
    var removedValue = array.splice(index1, 1)[0];
    if (indexDiff[2] === ARRAY_MOVE) {
      toInsert.push({
        index: indexDiff[1],
        value: removedValue
      });
    }
  }
  toInsert = toInsert.sort(compare.numericallyBy("index"));
  var toInsertLength = toInsert.length;
  for (index = 0; index < toInsertLength; index++) {
    var insertion = toInsert[index];
    array.splice(insertion.index, 0, insertion.value);
  }
  var toModifyLength = toModify.length;
  var child = void 0;
  if (toModifyLength > 0) {
    for (index = 0; index < toModifyLength; index++) {
      var modification = toModify[index];
      child = new PatchContext(context.left[modification.index], modification.delta);
      context.push(child, modification.index);
    }
  }
  if (!context.children) {
    context.setResult(context.left).exit();
    return;
  }
  context.exit();
};
patchFilter$2.filterName = "arrays";
var collectChildrenPatchFilter$1 = function collectChildrenPatchFilter3(context) {
  if (!context || !context.children) {
    return;
  }
  if (context.delta._t !== "a") {
    return;
  }
  var length = context.children.length;
  var child = void 0;
  for (var index = 0; index < length; index++) {
    child = context.children[index];
    context.left[child.childName] = child.result;
  }
  context.setResult(context.left).exit();
};
collectChildrenPatchFilter$1.filterName = "arraysCollectChildren";
var reverseFilter$2 = function arraysReverseFilter(context) {
  if (!context.nested) {
    if (context.delta[2] === ARRAY_MOVE) {
      context.newName = "_" + context.delta[1];
      context.setResult([context.delta[0], parseInt(context.childName.substr(1), 10), ARRAY_MOVE]).exit();
    }
    return;
  }
  if (context.delta._t !== "a") {
    return;
  }
  var name = void 0;
  var child = void 0;
  for (name in context.delta) {
    if (name === "_t") {
      continue;
    }
    child = new ReverseContext(context.delta[name]);
    context.push(child, name);
  }
  context.exit();
};
reverseFilter$2.filterName = "arrays";
var reverseArrayDeltaIndex = function reverseArrayDeltaIndex2(delta, index, itemDelta) {
  if (typeof index === "string" && index[0] === "_") {
    return parseInt(index.substr(1), 10);
  } else if (isArray$2(itemDelta) && itemDelta[2] === 0) {
    return "_" + index;
  }
  var reverseIndex = +index;
  for (var deltaIndex in delta) {
    var deltaItem = delta[deltaIndex];
    if (isArray$2(deltaItem)) {
      if (deltaItem[2] === ARRAY_MOVE) {
        var moveFromIndex = parseInt(deltaIndex.substr(1), 10);
        var moveToIndex = deltaItem[1];
        if (moveToIndex === +index) {
          return moveFromIndex;
        }
        if (moveFromIndex <= reverseIndex && moveToIndex > reverseIndex) {
          reverseIndex++;
        } else if (moveFromIndex >= reverseIndex && moveToIndex < reverseIndex) {
          reverseIndex--;
        }
      } else if (deltaItem[2] === 0) {
        var deleteIndex = parseInt(deltaIndex.substr(1), 10);
        if (deleteIndex <= reverseIndex) {
          reverseIndex++;
        }
      } else if (deltaItem.length === 1 && deltaIndex <= reverseIndex) {
        reverseIndex--;
      }
    }
  }
  return reverseIndex;
};
function collectChildrenReverseFilter$1(context) {
  if (!context || !context.children) {
    return;
  }
  if (context.delta._t !== "a") {
    return;
  }
  var length = context.children.length;
  var child = void 0;
  var delta = {
    _t: "a"
  };
  for (var index = 0; index < length; index++) {
    child = context.children[index];
    var name = child.newName;
    if (typeof name === "undefined") {
      name = reverseArrayDeltaIndex(context.delta, child.childName, child.result);
    }
    if (delta[name] !== child.result) {
      delta[name] = child.result;
    }
  }
  context.setResult(delta).exit();
}
collectChildrenReverseFilter$1.filterName = "arraysCollectChildren";
var diffFilter$2 = function datesDiffFilter(context) {
  if (context.left instanceof Date) {
    if (context.right instanceof Date) {
      if (context.left.getTime() !== context.right.getTime()) {
        context.setResult([context.left, context.right]);
      } else {
        context.setResult(void 0);
      }
    } else {
      context.setResult([context.left, context.right]);
    }
    context.exit();
  } else if (context.right instanceof Date) {
    context.setResult([context.left, context.right]).exit();
  }
};
diffFilter$2.filterName = "dates";
var TEXT_DIFF = 2;
var DEFAULT_MIN_LENGTH = 60;
var cachedDiffPatch = null;
var getDiffMatchPatch = function getDiffMatchPatch2(required) {
  if (!cachedDiffPatch) {
    var instance2 = void 0;
    if (typeof diff_match_patch !== "undefined") {
      instance2 = typeof diff_match_patch === "function" ? new diff_match_patch() : new diff_match_patch.diff_match_patch();
    } else if (dmp) {
      try {
        instance2 = dmp && new dmp();
      } catch (err) {
        instance2 = null;
      }
    }
    if (!instance2) {
      if (!required) {
        return null;
      }
      var error = new Error("text diff_match_patch library not found");
      error.diff_match_patch_not_found = true;
      throw error;
    }
    cachedDiffPatch = {
      diff: function diff2(txt1, txt2) {
        return instance2.patch_toText(instance2.patch_make(txt1, txt2));
      },
      patch: function patch(txt1, _patch) {
        var results = instance2.patch_apply(instance2.patch_fromText(_patch), txt1);
        for (var i = 0; i < results[1].length; i++) {
          if (!results[1][i]) {
            var _error = new Error("text patch failed");
            _error.textPatchFailed = true;
          }
        }
        return results[0];
      }
    };
  }
  return cachedDiffPatch;
};
var diffFilter$3 = function textsDiffFilter(context) {
  if (context.leftType !== "string") {
    return;
  }
  var minLength = context.options && context.options.textDiff && context.options.textDiff.minLength || DEFAULT_MIN_LENGTH;
  if (context.left.length < minLength || context.right.length < minLength) {
    context.setResult([context.left, context.right]).exit();
    return;
  }
  var diffMatchPatch2 = getDiffMatchPatch();
  if (!diffMatchPatch2) {
    context.setResult([context.left, context.right]).exit();
    return;
  }
  var diff2 = diffMatchPatch2.diff;
  context.setResult([diff2(context.left, context.right), 0, TEXT_DIFF]).exit();
};
diffFilter$3.filterName = "texts";
var patchFilter$3 = function textsPatchFilter(context) {
  if (context.nested) {
    return;
  }
  if (context.delta[2] !== TEXT_DIFF) {
    return;
  }
  var patch = getDiffMatchPatch(true).patch;
  context.setResult(patch(context.left, context.delta[0])).exit();
};
patchFilter$3.filterName = "texts";
var textDeltaReverse = function textDeltaReverse2(delta) {
  var i = void 0;
  var l = void 0;
  var lines = void 0;
  var line = void 0;
  var lineTmp = void 0;
  var header = null;
  var headerRegex = /^@@ +-(\d+),(\d+) +\+(\d+),(\d+) +@@$/;
  var lineHeader = void 0;
  lines = delta.split("\n");
  for (i = 0, l = lines.length; i < l; i++) {
    line = lines[i];
    var lineStart = line.slice(0, 1);
    if (lineStart === "@") {
      header = headerRegex.exec(line);
      lineHeader = i;
      lines[lineHeader] = "@@ -" + header[3] + "," + header[4] + " +" + header[1] + "," + header[2] + " @@";
    } else if (lineStart === "+") {
      lines[i] = "-" + lines[i].slice(1);
      if (lines[i - 1].slice(0, 1) === "+") {
        lineTmp = lines[i];
        lines[i] = lines[i - 1];
        lines[i - 1] = lineTmp;
      }
    } else if (lineStart === "-") {
      lines[i] = "+" + lines[i].slice(1);
    }
  }
  return lines.join("\n");
};
var reverseFilter$3 = function textsReverseFilter(context) {
  if (context.nested) {
    return;
  }
  if (context.delta[2] !== TEXT_DIFF) {
    return;
  }
  context.setResult([textDeltaReverse(context.delta[0]), 0, TEXT_DIFF]).exit();
};
reverseFilter$3.filterName = "texts";
var DiffPatcher = function() {
  function DiffPatcher2(options) {
    classCallCheck(this, DiffPatcher2);
    this.processor = new Processor(options);
    this.processor.pipe(new Pipe("diff").append(collectChildrenDiffFilter, diffFilter, diffFilter$2, diffFilter$3, objectsDiffFilter, diffFilter$1).shouldHaveResult());
    this.processor.pipe(new Pipe("patch").append(collectChildrenPatchFilter, collectChildrenPatchFilter$1, patchFilter, patchFilter$3, patchFilter$1, patchFilter$2).shouldHaveResult());
    this.processor.pipe(new Pipe("reverse").append(collectChildrenReverseFilter, collectChildrenReverseFilter$1, reverseFilter, reverseFilter$3, reverseFilter$1, reverseFilter$2).shouldHaveResult());
  }
  createClass(DiffPatcher2, [{
    key: "options",
    value: function options() {
      var _processor;
      return (_processor = this.processor).options.apply(_processor, arguments);
    }
  }, {
    key: "diff",
    value: function diff2(left, right) {
      return this.processor.process(new DiffContext(left, right));
    }
  }, {
    key: "patch",
    value: function patch(left, delta) {
      return this.processor.process(new PatchContext(left, delta));
    }
  }, {
    key: "reverse",
    value: function reverse(delta) {
      return this.processor.process(new ReverseContext(delta));
    }
  }, {
    key: "unpatch",
    value: function unpatch(right, delta) {
      return this.patch(right, this.reverse(delta));
    }
  }, {
    key: "clone",
    value: function clone$$1(value) {
      return clone(value);
    }
  }]);
  return DiffPatcher2;
}();
var isArray$3 = typeof Array.isArray === "function" ? Array.isArray : function(a) {
  return a instanceof Array;
};
var getObjectKeys = typeof Object.keys === "function" ? function(obj) {
  return Object.keys(obj);
} : function(obj) {
  var names = [];
  for (var property in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, property)) {
      names.push(property);
    }
  }
  return names;
};
var trimUnderscore = function trimUnderscore2(str) {
  if (str.substr(0, 1) === "_") {
    return str.slice(1);
  }
  return str;
};
var arrayKeyToSortNumber = function arrayKeyToSortNumber2(key) {
  if (key === "_t") {
    return -1;
  } else {
    if (key.substr(0, 1) === "_") {
      return parseInt(key.slice(1), 10);
    } else {
      return parseInt(key, 10) + 0.1;
    }
  }
};
var arrayKeyComparer = function arrayKeyComparer2(key1, key2) {
  return arrayKeyToSortNumber(key1) - arrayKeyToSortNumber(key2);
};
var BaseFormatter = function() {
  function BaseFormatter2() {
    classCallCheck(this, BaseFormatter2);
  }
  createClass(BaseFormatter2, [{
    key: "format",
    value: function format(delta, left) {
      var context = {};
      this.prepareContext(context);
      this.recurse(context, delta, left);
      return this.finalize(context);
    }
  }, {
    key: "prepareContext",
    value: function prepareContext(context) {
      context.buffer = [];
      context.out = function() {
        var _buffer;
        (_buffer = this.buffer).push.apply(_buffer, arguments);
      };
    }
  }, {
    key: "typeFormattterNotFound",
    value: function typeFormattterNotFound(context, deltaType) {
      throw new Error("cannot format delta type: " + deltaType);
    }
  }, {
    key: "typeFormattterErrorFormatter",
    value: function typeFormattterErrorFormatter(context, err) {
      return err.toString();
    }
  }, {
    key: "finalize",
    value: function finalize(_ref) {
      var buffer = _ref.buffer;
      if (isArray$3(buffer)) {
        return buffer.join("");
      }
    }
  }, {
    key: "recurse",
    value: function recurse(context, delta, left, key, leftKey, movedFrom, isLast) {
      var useMoveOriginHere = delta && movedFrom;
      var leftValue = useMoveOriginHere ? movedFrom.value : left;
      if (typeof delta === "undefined" && typeof key === "undefined") {
        return void 0;
      }
      var type = this.getDeltaType(delta, movedFrom);
      var nodeType = type === "node" ? delta._t === "a" ? "array" : "object" : "";
      if (typeof key !== "undefined") {
        this.nodeBegin(context, key, leftKey, type, nodeType, isLast);
      } else {
        this.rootBegin(context, type, nodeType);
      }
      var typeFormattter = void 0;
      try {
        typeFormattter = this["format_" + type] || this.typeFormattterNotFound(context, type);
        typeFormattter.call(this, context, delta, leftValue, key, leftKey, movedFrom);
      } catch (err) {
        this.typeFormattterErrorFormatter(context, err, delta, leftValue, key, leftKey, movedFrom);
        if (typeof console !== "undefined" && console.error) {
          console.error(err.stack);
        }
      }
      if (typeof key !== "undefined") {
        this.nodeEnd(context, key, leftKey, type, nodeType, isLast);
      } else {
        this.rootEnd(context, type, nodeType);
      }
    }
  }, {
    key: "formatDeltaChildren",
    value: function formatDeltaChildren(context, delta, left) {
      var self = this;
      this.forEachDeltaKey(delta, left, function(key, leftKey, movedFrom, isLast) {
        self.recurse(context, delta[key], left ? left[leftKey] : void 0, key, leftKey, movedFrom, isLast);
      });
    }
  }, {
    key: "forEachDeltaKey",
    value: function forEachDeltaKey(delta, left, fn) {
      var keys = getObjectKeys(delta);
      var arrayKeys = delta._t === "a";
      var moveDestinations = {};
      var name = void 0;
      if (typeof left !== "undefined") {
        for (name in left) {
          if (Object.prototype.hasOwnProperty.call(left, name)) {
            if (typeof delta[name] === "undefined" && (!arrayKeys || typeof delta["_" + name] === "undefined")) {
              keys.push(name);
            }
          }
        }
      }
      for (name in delta) {
        if (Object.prototype.hasOwnProperty.call(delta, name)) {
          var value = delta[name];
          if (isArray$3(value) && value[2] === 3) {
            moveDestinations[value[1].toString()] = {
              key: name,
              value: left && left[parseInt(name.substr(1))]
            };
            if (this.includeMoveDestinations !== false) {
              if (typeof left === "undefined" && typeof delta[value[1]] === "undefined") {
                keys.push(value[1].toString());
              }
            }
          }
        }
      }
      if (arrayKeys) {
        keys.sort(arrayKeyComparer);
      } else {
        keys.sort();
      }
      for (var index = 0, length = keys.length; index < length; index++) {
        var key = keys[index];
        if (arrayKeys && key === "_t") {
          continue;
        }
        var leftKey = arrayKeys ? typeof key === "number" ? key : parseInt(trimUnderscore(key), 10) : key;
        var isLast = index === length - 1;
        fn(key, leftKey, moveDestinations[leftKey], isLast);
      }
    }
  }, {
    key: "getDeltaType",
    value: function getDeltaType(delta, movedFrom) {
      if (typeof delta === "undefined") {
        if (typeof movedFrom !== "undefined") {
          return "movedestination";
        }
        return "unchanged";
      }
      if (isArray$3(delta)) {
        if (delta.length === 1) {
          return "added";
        }
        if (delta.length === 2) {
          return "modified";
        }
        if (delta.length === 3 && delta[2] === 0) {
          return "deleted";
        }
        if (delta.length === 3 && delta[2] === 2) {
          return "textdiff";
        }
        if (delta.length === 3 && delta[2] === 3) {
          return "moved";
        }
      } else if ((typeof delta === "undefined" ? "undefined" : _typeof(delta)) === "object") {
        return "node";
      }
      return "unknown";
    }
  }, {
    key: "parseTextDiff",
    value: function parseTextDiff2(value) {
      var output = [];
      var lines = value.split("\n@@ ");
      for (var i = 0, l = lines.length; i < l; i++) {
        var line = lines[i];
        var lineOutput = {
          pieces: []
        };
        var location = /^(?:@@ )?[-+]?(\d+),(\d+)/.exec(line).slice(1);
        lineOutput.location = {
          line: location[0],
          chr: location[1]
        };
        var pieces = line.split("\n").slice(1);
        for (var pieceIndex = 0, piecesLength = pieces.length; pieceIndex < piecesLength; pieceIndex++) {
          var piece = pieces[pieceIndex];
          if (!piece.length) {
            continue;
          }
          var pieceOutput = {
            type: "context"
          };
          if (piece.substr(0, 1) === "+") {
            pieceOutput.type = "added";
          } else if (piece.substr(0, 1) === "-") {
            pieceOutput.type = "deleted";
          }
          pieceOutput.text = piece.slice(1);
          lineOutput.pieces.push(pieceOutput);
        }
        output.push(lineOutput);
      }
      return output;
    }
  }]);
  return BaseFormatter2;
}();
(function(_BaseFormatter) {
  inherits(HtmlFormatter, _BaseFormatter);
  function HtmlFormatter() {
    classCallCheck(this, HtmlFormatter);
    return possibleConstructorReturn(this, (HtmlFormatter.__proto__ || Object.getPrototypeOf(HtmlFormatter)).apply(this, arguments));
  }
  createClass(HtmlFormatter, [{
    key: "typeFormattterErrorFormatter",
    value: function typeFormattterErrorFormatter(context, err) {
      context.out('<pre class="jsondiffpatch-error">' + err + "</pre>");
    }
  }, {
    key: "formatValue",
    value: function formatValue(context, value) {
      context.out("<pre>" + htmlEscape(JSON.stringify(value, null, 2)) + "</pre>");
    }
  }, {
    key: "formatTextDiffString",
    value: function formatTextDiffString(context, value) {
      var lines = this.parseTextDiff(value);
      context.out('<ul class="jsondiffpatch-textdiff">');
      for (var i = 0, l = lines.length; i < l; i++) {
        var line = lines[i];
        context.out('<li><div class="jsondiffpatch-textdiff-location">' + ('<span class="jsondiffpatch-textdiff-line-number">' + line.location.line + '</span><span class="jsondiffpatch-textdiff-char">' + line.location.chr + '</span></div><div class="jsondiffpatch-textdiff-line">'));
        var pieces = line.pieces;
        for (var pieceIndex = 0, piecesLength = pieces.length; pieceIndex < piecesLength; pieceIndex++) {
          var piece = pieces[pieceIndex];
          context.out('<span class="jsondiffpatch-textdiff-' + piece.type + '">' + htmlEscape(decodeURI(piece.text)) + "</span>");
        }
        context.out("</div></li>");
      }
      context.out("</ul>");
    }
  }, {
    key: "rootBegin",
    value: function rootBegin(context, type, nodeType) {
      var nodeClass = "jsondiffpatch-" + type + (nodeType ? " jsondiffpatch-child-node-type-" + nodeType : "");
      context.out('<div class="jsondiffpatch-delta ' + nodeClass + '">');
    }
  }, {
    key: "rootEnd",
    value: function rootEnd(context) {
      context.out("</div>" + (context.hasArrows ? '<script type="text/javascript">setTimeout(' + (adjustArrows.toString() + ",10);<\/script>") : ""));
    }
  }, {
    key: "nodeBegin",
    value: function nodeBegin(context, key, leftKey, type, nodeType) {
      var nodeClass = "jsondiffpatch-" + type + (nodeType ? " jsondiffpatch-child-node-type-" + nodeType : "");
      context.out('<li class="' + nodeClass + '" data-key="' + leftKey + '">' + ('<div class="jsondiffpatch-property-name">' + leftKey + "</div>"));
    }
  }, {
    key: "nodeEnd",
    value: function nodeEnd(context) {
      context.out("</li>");
    }
    /* jshint camelcase: false */
    /* eslint-disable camelcase */
  }, {
    key: "format_unchanged",
    value: function format_unchanged(context, delta, left) {
      if (typeof left === "undefined") {
        return;
      }
      context.out('<div class="jsondiffpatch-value">');
      this.formatValue(context, left);
      context.out("</div>");
    }
  }, {
    key: "format_movedestination",
    value: function format_movedestination(context, delta, left) {
      if (typeof left === "undefined") {
        return;
      }
      context.out('<div class="jsondiffpatch-value">');
      this.formatValue(context, left);
      context.out("</div>");
    }
  }, {
    key: "format_node",
    value: function format_node(context, delta, left) {
      var nodeType = delta._t === "a" ? "array" : "object";
      context.out('<ul class="jsondiffpatch-node jsondiffpatch-node-type-' + nodeType + '">');
      this.formatDeltaChildren(context, delta, left);
      context.out("</ul>");
    }
  }, {
    key: "format_added",
    value: function format_added(context, delta) {
      context.out('<div class="jsondiffpatch-value">');
      this.formatValue(context, delta[0]);
      context.out("</div>");
    }
  }, {
    key: "format_modified",
    value: function format_modified(context, delta) {
      context.out('<div class="jsondiffpatch-value jsondiffpatch-left-value">');
      this.formatValue(context, delta[0]);
      context.out('</div><div class="jsondiffpatch-value jsondiffpatch-right-value">');
      this.formatValue(context, delta[1]);
      context.out("</div>");
    }
  }, {
    key: "format_deleted",
    value: function format_deleted(context, delta) {
      context.out('<div class="jsondiffpatch-value">');
      this.formatValue(context, delta[0]);
      context.out("</div>");
    }
  }, {
    key: "format_moved",
    value: function format_moved(context, delta) {
      context.out('<div class="jsondiffpatch-value">');
      this.formatValue(context, delta[0]);
      context.out('</div><div class="jsondiffpatch-moved-destination">' + delta[1] + "</div>");
      context.out(
        /* jshint multistr: true */
        '<div class="jsondiffpatch-arrow" style="position: relative; left: -34px;">\n          <svg width="30" height="60" style="position: absolute; display: none;">\n          <defs>\n              <marker id="markerArrow" markerWidth="8" markerHeight="8"\n                 refx="2" refy="4"\n                     orient="auto" markerUnits="userSpaceOnUse">\n                  <path d="M1,1 L1,7 L7,4 L1,1" style="fill: #339;" />\n              </marker>\n          </defs>\n          <path d="M30,0 Q-10,25 26,50"\n            style="stroke: #88f; stroke-width: 2px; fill: none; stroke-opacity: 0.5; marker-end: url(#markerArrow);"\n          ></path>\n          </svg>\n      </div>'
      );
      context.hasArrows = true;
    }
  }, {
    key: "format_textdiff",
    value: function format_textdiff(context, delta) {
      context.out('<div class="jsondiffpatch-value">');
      this.formatTextDiffString(context, delta[0]);
      context.out("</div>");
    }
  }]);
  return HtmlFormatter;
})(BaseFormatter);
function htmlEscape(text2) {
  var html2 = text2;
  var replacements = [[/&/g, "&amp;"], [/</g, "&lt;"], [/>/g, "&gt;"], [/'/g, "&apos;"], [/"/g, "&quot;"]];
  for (var i = 0; i < replacements.length; i++) {
    html2 = html2.replace(replacements[i][0], replacements[i][1]);
  }
  return html2;
}
var adjustArrows = function jsondiffpatchHtmlFormatterAdjustArrows(nodeArg) {
  var node = nodeArg || document;
  var getElementText = function getElementText2(_ref) {
    var textContent = _ref.textContent, innerText = _ref.innerText;
    return textContent || innerText;
  };
  var eachByQuery = function eachByQuery2(el, query, fn) {
    var elems = el.querySelectorAll(query);
    for (var i = 0, l = elems.length; i < l; i++) {
      fn(elems[i]);
    }
  };
  var eachChildren = function eachChildren2(_ref2, fn) {
    var children2 = _ref2.children;
    for (var i = 0, l = children2.length; i < l; i++) {
      fn(children2[i], i);
    }
  };
  eachByQuery(node, ".jsondiffpatch-arrow", function(_ref3) {
    var parentNode = _ref3.parentNode, children2 = _ref3.children, style = _ref3.style;
    var arrowParent = parentNode;
    var svg = children2[0];
    var path = svg.children[1];
    svg.style.display = "none";
    var destination = getElementText(arrowParent.querySelector(".jsondiffpatch-moved-destination"));
    var container = arrowParent.parentNode;
    var destinationElem = void 0;
    eachChildren(container, function(child) {
      if (child.getAttribute("data-key") === destination) {
        destinationElem = child;
      }
    });
    if (!destinationElem) {
      return;
    }
    try {
      var distance = destinationElem.offsetTop - arrowParent.offsetTop;
      svg.setAttribute("height", Math.abs(distance) + 6);
      style.top = -8 + (distance > 0 ? 0 : distance) + "px";
      var curve = distance > 0 ? "M30,0 Q-10," + Math.round(distance / 2) + " 26," + (distance - 4) : "M30," + -distance + " Q-10," + Math.round(-distance / 2) + " 26,4";
      path.setAttribute("d", curve);
      svg.style.display = "";
    } catch (err) {
    }
  });
};
var AnnotatedFormatter = function(_BaseFormatter) {
  inherits(AnnotatedFormatter2, _BaseFormatter);
  function AnnotatedFormatter2() {
    classCallCheck(this, AnnotatedFormatter2);
    var _this = possibleConstructorReturn(this, (AnnotatedFormatter2.__proto__ || Object.getPrototypeOf(AnnotatedFormatter2)).call(this));
    _this.includeMoveDestinations = false;
    return _this;
  }
  createClass(AnnotatedFormatter2, [{
    key: "prepareContext",
    value: function prepareContext(context) {
      get(AnnotatedFormatter2.prototype.__proto__ || Object.getPrototypeOf(AnnotatedFormatter2.prototype), "prepareContext", this).call(this, context);
      context.indent = function(levels) {
        this.indentLevel = (this.indentLevel || 0) + (typeof levels === "undefined" ? 1 : levels);
        this.indentPad = new Array(this.indentLevel + 1).join("&nbsp;&nbsp;");
      };
      context.row = function(json, htmlNote) {
        context.out('<tr><td style="white-space: nowrap;"><pre class="jsondiffpatch-annotated-indent" style="display: inline-block">');
        context.out(context.indentPad);
        context.out('</pre><pre style="display: inline-block">');
        context.out(json);
        context.out('</pre></td><td class="jsondiffpatch-delta-note"><div>');
        context.out(htmlNote);
        context.out("</div></td></tr>");
      };
    }
  }, {
    key: "typeFormattterErrorFormatter",
    value: function typeFormattterErrorFormatter(context, err) {
      context.row("", '<pre class="jsondiffpatch-error">' + err + "</pre>");
    }
  }, {
    key: "formatTextDiffString",
    value: function formatTextDiffString(context, value) {
      var lines = this.parseTextDiff(value);
      context.out('<ul class="jsondiffpatch-textdiff">');
      for (var i = 0, l = lines.length; i < l; i++) {
        var line = lines[i];
        context.out('<li><div class="jsondiffpatch-textdiff-location">' + ('<span class="jsondiffpatch-textdiff-line-number">' + line.location.line + '</span><span class="jsondiffpatch-textdiff-char">' + line.location.chr + '</span></div><div class="jsondiffpatch-textdiff-line">'));
        var pieces = line.pieces;
        for (var pieceIndex = 0, piecesLength = pieces.length; pieceIndex < piecesLength; pieceIndex++) {
          var piece = pieces[pieceIndex];
          context.out('<span class="jsondiffpatch-textdiff-' + piece.type + '">' + piece.text + "</span>");
        }
        context.out("</div></li>");
      }
      context.out("</ul>");
    }
  }, {
    key: "rootBegin",
    value: function rootBegin(context, type, nodeType) {
      context.out('<table class="jsondiffpatch-annotated-delta">');
      if (type === "node") {
        context.row("{");
        context.indent();
      }
      if (nodeType === "array") {
        context.row('"_t": "a",', "Array delta (member names indicate array indices)");
      }
    }
  }, {
    key: "rootEnd",
    value: function rootEnd(context, type) {
      if (type === "node") {
        context.indent(-1);
        context.row("}");
      }
      context.out("</table>");
    }
  }, {
    key: "nodeBegin",
    value: function nodeBegin(context, key, leftKey, type, nodeType) {
      context.row("&quot;" + key + "&quot;: {");
      if (type === "node") {
        context.indent();
      }
      if (nodeType === "array") {
        context.row('"_t": "a",', "Array delta (member names indicate array indices)");
      }
    }
  }, {
    key: "nodeEnd",
    value: function nodeEnd(context, key, leftKey, type, nodeType, isLast) {
      if (type === "node") {
        context.indent(-1);
      }
      context.row("}" + (isLast ? "" : ","));
    }
    /* jshint camelcase: false */
    /* eslint-disable camelcase */
  }, {
    key: "format_unchanged",
    value: function format_unchanged() {
    }
  }, {
    key: "format_movedestination",
    value: function format_movedestination() {
    }
  }, {
    key: "format_node",
    value: function format_node(context, delta, left) {
      this.formatDeltaChildren(context, delta, left);
    }
  }]);
  return AnnotatedFormatter2;
}(BaseFormatter);
var wrapPropertyName = function wrapPropertyName2(name) {
  return '<pre style="display:inline-block">&quot;' + name + "&quot;</pre>";
};
var deltaAnnotations = {
  added: function added(delta, left, key, leftKey) {
    var formatLegend = " <pre>([newValue])</pre>";
    if (typeof leftKey === "undefined") {
      return "new value" + formatLegend;
    }
    if (typeof leftKey === "number") {
      return "insert at index " + leftKey + formatLegend;
    }
    return "add property " + wrapPropertyName(leftKey) + formatLegend;
  },
  modified: function modified(delta, left, key, leftKey) {
    var formatLegend = " <pre>([previousValue, newValue])</pre>";
    if (typeof leftKey === "undefined") {
      return "modify value" + formatLegend;
    }
    if (typeof leftKey === "number") {
      return "modify at index " + leftKey + formatLegend;
    }
    return "modify property " + wrapPropertyName(leftKey) + formatLegend;
  },
  deleted: function deleted(delta, left, key, leftKey) {
    var formatLegend = " <pre>([previousValue, 0, 0])</pre>";
    if (typeof leftKey === "undefined") {
      return "delete value" + formatLegend;
    }
    if (typeof leftKey === "number") {
      return "remove index " + leftKey + formatLegend;
    }
    return "delete property " + wrapPropertyName(leftKey) + formatLegend;
  },
  moved: function moved(delta, left, key, leftKey) {
    return 'move from <span title="(position to remove at original state)">' + ("index " + leftKey + '</span> to <span title="(position to insert at final') + (' state)">index ' + delta[1] + "</span>");
  },
  textdiff: function textdiff(delta, left, key, leftKey) {
    var location = typeof leftKey === "undefined" ? "" : typeof leftKey === "number" ? " at index " + leftKey : " at property " + wrapPropertyName(leftKey);
    return "text diff" + location + ', format is <a href="https://code.google.com/p/google-diff-match-patch/wiki/Unidiff">a variation of Unidiff</a>';
  }
};
var formatAnyChange = function formatAnyChange2(context, delta) {
  var deltaType = this.getDeltaType(delta);
  var annotator = deltaAnnotations[deltaType];
  var htmlNote = annotator && annotator.apply(annotator, Array.prototype.slice.call(arguments, 1));
  var json = JSON.stringify(delta, null, 2);
  if (deltaType === "textdiff") {
    json = json.split("\\n").join('\\n"+\n   "');
  }
  context.indent();
  context.row(json, htmlNote);
  context.indent(-1);
};
AnnotatedFormatter.prototype.format_added = formatAnyChange;
AnnotatedFormatter.prototype.format_modified = formatAnyChange;
AnnotatedFormatter.prototype.format_deleted = formatAnyChange;
AnnotatedFormatter.prototype.format_moved = formatAnyChange;
AnnotatedFormatter.prototype.format_textdiff = formatAnyChange;
var OPERATIONS = {
  add: "add",
  remove: "remove",
  replace: "replace",
  move: "move"
};
(function(_BaseFormatter) {
  inherits(JSONFormatter, _BaseFormatter);
  function JSONFormatter() {
    classCallCheck(this, JSONFormatter);
    var _this = possibleConstructorReturn(this, (JSONFormatter.__proto__ || Object.getPrototypeOf(JSONFormatter)).call(this));
    _this.includeMoveDestinations = true;
    return _this;
  }
  createClass(JSONFormatter, [{
    key: "prepareContext",
    value: function prepareContext(context) {
      get(JSONFormatter.prototype.__proto__ || Object.getPrototypeOf(JSONFormatter.prototype), "prepareContext", this).call(this, context);
      context.result = [];
      context.path = [];
      context.pushCurrentOp = function(obj) {
        var op = obj.op, value = obj.value;
        var val = {
          op,
          path: this.currentPath()
        };
        if (typeof value !== "undefined") {
          val.value = value;
        }
        this.result.push(val);
      };
      context.pushMoveOp = function(to) {
        var from = this.currentPath();
        this.result.push({
          op: OPERATIONS.move,
          from,
          path: this.toPath(to)
        });
      };
      context.currentPath = function() {
        return "/" + this.path.join("/");
      };
      context.toPath = function(toPath) {
        var to = this.path.slice();
        to[to.length - 1] = toPath;
        return "/" + to.join("/");
      };
    }
  }, {
    key: "typeFormattterErrorFormatter",
    value: function typeFormattterErrorFormatter(context, err) {
      context.out("[ERROR] " + err);
    }
  }, {
    key: "rootBegin",
    value: function rootBegin() {
    }
  }, {
    key: "rootEnd",
    value: function rootEnd() {
    }
  }, {
    key: "nodeBegin",
    value: function nodeBegin(_ref, key, leftKey) {
      var path = _ref.path;
      path.push(leftKey);
    }
  }, {
    key: "nodeEnd",
    value: function nodeEnd(_ref2) {
      var path = _ref2.path;
      path.pop();
    }
    /* jshint camelcase: false */
    /* eslint-disable camelcase */
  }, {
    key: "format_unchanged",
    value: function format_unchanged() {
    }
  }, {
    key: "format_movedestination",
    value: function format_movedestination() {
    }
  }, {
    key: "format_node",
    value: function format_node(context, delta, left) {
      this.formatDeltaChildren(context, delta, left);
    }
  }, {
    key: "format_added",
    value: function format_added(context, delta) {
      context.pushCurrentOp({
        op: OPERATIONS.add,
        value: delta[0]
      });
    }
  }, {
    key: "format_modified",
    value: function format_modified(context, delta) {
      context.pushCurrentOp({
        op: OPERATIONS.replace,
        value: delta[1]
      });
    }
  }, {
    key: "format_deleted",
    value: function format_deleted(context) {
      context.pushCurrentOp({
        op: OPERATIONS.remove
      });
    }
  }, {
    key: "format_moved",
    value: function format_moved(context, delta) {
      var to = delta[1];
      context.pushMoveOp(to);
    }
  }, {
    key: "format_textdiff",
    value: function format_textdiff() {
      throw new Error("Not implemented");
    }
  }, {
    key: "format",
    value: function format(delta, left) {
      var context = {};
      this.prepareContext(context);
      this.recurse(context, delta, left);
      return context.result;
    }
  }]);
  return JSONFormatter;
})(BaseFormatter);
function chalkColor(name) {
  return function() {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    return args;
  };
}
var colors = {
  added: chalkColor(),
  deleted: chalkColor(),
  movedestination: chalkColor(),
  moved: chalkColor(),
  unchanged: chalkColor(),
  error: chalkColor(),
  textDiffLine: chalkColor()
};
(function(_BaseFormatter) {
  inherits(ConsoleFormatter, _BaseFormatter);
  function ConsoleFormatter() {
    classCallCheck(this, ConsoleFormatter);
    var _this = possibleConstructorReturn(this, (ConsoleFormatter.__proto__ || Object.getPrototypeOf(ConsoleFormatter)).call(this));
    _this.includeMoveDestinations = false;
    return _this;
  }
  createClass(ConsoleFormatter, [{
    key: "prepareContext",
    value: function prepareContext(context) {
      get(ConsoleFormatter.prototype.__proto__ || Object.getPrototypeOf(ConsoleFormatter.prototype), "prepareContext", this).call(this, context);
      context.indent = function(levels) {
        this.indentLevel = (this.indentLevel || 0) + (typeof levels === "undefined" ? 1 : levels);
        this.indentPad = new Array(this.indentLevel + 1).join("  ");
        this.outLine();
      };
      context.outLine = function() {
        this.buffer.push("\n" + (this.indentPad || ""));
      };
      context.out = function() {
        for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
          args[_key2] = arguments[_key2];
        }
        for (var i = 0, l = args.length; i < l; i++) {
          var lines = args[i].split("\n");
          var text2 = lines.join("\n" + (this.indentPad || ""));
          if (this.color && this.color[0]) {
            text2 = this.color[0](text2);
          }
          this.buffer.push(text2);
        }
      };
      context.pushColor = function(color) {
        this.color = this.color || [];
        this.color.unshift(color);
      };
      context.popColor = function() {
        this.color = this.color || [];
        this.color.shift();
      };
    }
  }, {
    key: "typeFormattterErrorFormatter",
    value: function typeFormattterErrorFormatter(context, err) {
      context.pushColor(colors.error);
      context.out("[ERROR]" + err);
      context.popColor();
    }
  }, {
    key: "formatValue",
    value: function formatValue(context, value) {
      context.out(JSON.stringify(value, null, 2));
    }
  }, {
    key: "formatTextDiffString",
    value: function formatTextDiffString(context, value) {
      var lines = this.parseTextDiff(value);
      context.indent();
      for (var i = 0, l = lines.length; i < l; i++) {
        var line = lines[i];
        context.pushColor(colors.textDiffLine);
        context.out(line.location.line + "," + line.location.chr + " ");
        context.popColor();
        var pieces = line.pieces;
        for (var pieceIndex = 0, piecesLength = pieces.length; pieceIndex < piecesLength; pieceIndex++) {
          var piece = pieces[pieceIndex];
          context.pushColor(colors[piece.type]);
          context.out(piece.text);
          context.popColor();
        }
        if (i < l - 1) {
          context.outLine();
        }
      }
      context.indent(-1);
    }
  }, {
    key: "rootBegin",
    value: function rootBegin(context, type, nodeType) {
      context.pushColor(colors[type]);
      if (type === "node") {
        context.out(nodeType === "array" ? "[" : "{");
        context.indent();
      }
    }
  }, {
    key: "rootEnd",
    value: function rootEnd(context, type, nodeType) {
      if (type === "node") {
        context.indent(-1);
        context.out(nodeType === "array" ? "]" : "}");
      }
      context.popColor();
    }
  }, {
    key: "nodeBegin",
    value: function nodeBegin(context, key, leftKey, type, nodeType) {
      context.pushColor(colors[type]);
      context.out(leftKey + ": ");
      if (type === "node") {
        context.out(nodeType === "array" ? "[" : "{");
        context.indent();
      }
    }
  }, {
    key: "nodeEnd",
    value: function nodeEnd(context, key, leftKey, type, nodeType, isLast) {
      if (type === "node") {
        context.indent(-1);
        context.out(nodeType === "array" ? "]" : "}" + (isLast ? "" : ","));
      }
      if (!isLast) {
        context.outLine();
      }
      context.popColor();
    }
    /* jshint camelcase: false */
    /* eslint-disable camelcase */
  }, {
    key: "format_unchanged",
    value: function format_unchanged(context, delta, left) {
      if (typeof left === "undefined") {
        return;
      }
      this.formatValue(context, left);
    }
  }, {
    key: "format_movedestination",
    value: function format_movedestination(context, delta, left) {
      if (typeof left === "undefined") {
        return;
      }
      this.formatValue(context, left);
    }
  }, {
    key: "format_node",
    value: function format_node(context, delta, left) {
      this.formatDeltaChildren(context, delta, left);
    }
  }, {
    key: "format_added",
    value: function format_added(context, delta) {
      this.formatValue(context, delta[0]);
    }
  }, {
    key: "format_modified",
    value: function format_modified(context, delta) {
      context.pushColor(colors.deleted);
      this.formatValue(context, delta[0]);
      context.popColor();
      context.out(" => ");
      context.pushColor(colors.added);
      this.formatValue(context, delta[1]);
      context.popColor();
    }
  }, {
    key: "format_deleted",
    value: function format_deleted(context, delta) {
      this.formatValue(context, delta[0]);
    }
  }, {
    key: "format_moved",
    value: function format_moved(context, delta) {
      context.out("==> " + delta[1]);
    }
  }, {
    key: "format_textdiff",
    value: function format_textdiff(context, delta) {
      this.formatTextDiffString(context, delta[0]);
    }
  }]);
  return ConsoleFormatter;
})(BaseFormatter);
const diffPatcher = new DiffPatcher({
  arrays: { detectMove: false, includeValueOnMove: false },
  textDiff: { minLength: 1 }
});
function diff(inputA, inputB) {
  return diffPatcher.diff(inputA, inputB);
}
const addedProperties = [
  "docChanged",
  "isGeneric",
  "scrolledIntoView",
  "selectionSet",
  "storedMarksSet"
];
function addPropertiesToTransaction(tr) {
  return Object.keys(tr).concat(addedProperties).reduce((acc, key) => {
    acc[key] = tr[key];
    return acc;
  }, {});
}
function buildSelection(selection) {
  return {
    // @ts-ignore
    type: selection.type,
    empty: selection.empty,
    anchor: selection.anchor,
    head: selection.head,
    from: selection.from,
    to: selection.to
  };
}
function pad(num) {
  return ("00" + num).slice(-2);
}
function pad3(num) {
  return ("000" + num).slice(-3);
}
const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp);
  return [
    pad(date.getHours()),
    pad(date.getMinutes()),
    pad(date.getSeconds()),
    pad3(date.getMilliseconds())
  ].join(":");
};
const regexp = /(&lt;\/?[\w\d\s="']+&gt;)/gim;
const highlightHtmlString = (html2) => html2.replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(regexp, "<span style='color: cadetblue;'>$&</span>");
function createHistoryEntry(trs, state2, stateBeforeDispatch, oldEntry) {
  const serializer = DOMSerializer.fromSchema(state2.schema);
  const selection = state2.selection;
  const domFragment = serializer.serializeFragment(selection.content().content);
  const selectedElementsAsHtml = [];
  if (domFragment) {
    let child = domFragment.firstChild;
    while (child) {
      selectedElementsAsHtml.push(child.outerHTML);
      child = child.nextSibling;
    }
  }
  const prevState = oldEntry ? oldEntry.state : stateBeforeDispatch;
  const contentDiff = diff(prevState.doc.toJSON(), state2.doc.toJSON());
  const selectionDiff = diff(buildSelection(prevState.selection), buildSelection(state2.selection));
  return {
    id: Math.random().toString() + Math.random().toString(),
    state: state2,
    trs: trs.map((tr) => addPropertiesToTransaction(tr)),
    timestamp: trs[0].time,
    timeStr: formatTimestamp(trs[0].time),
    contentDiff,
    selectionDiff,
    selectionHtml: highlightHtmlString(html.prettyPrint(selectedElementsAsHtml.join("\n"), {
      max_char: 60,
      indent_size: 2
    }))
  };
}
const stateHistory = writable(/* @__PURE__ */ new Map());
const shownHistoryGroups = writable([]);
const latestEntry = writable(void 0);
const nextId = writable(0);
function appendNewHistoryEntry(trs, state2, stateBeforeDispatch) {
  const entryMap = get_store_value(stateHistory);
  const prevGroup = get_store_value(shownHistoryGroups)[0];
  const oldEntry = entryMap.get((prevGroup === null || prevGroup === void 0 ? void 0 : prevGroup.topEntryId) || "");
  const newEntry = createHistoryEntry(trs, state2, stateBeforeDispatch, oldEntry);
  stateHistory.update((val) => new Map(val.set(newEntry.id, newEntry)));
  latestEntry.set(newEntry);
  const isGroup = !newEntry.contentDiff;
  if ((prevGroup === null || prevGroup === void 0 ? void 0 : prevGroup.isGroup) && isGroup) {
    const newGroup = {
      id: prevGroup.id,
      isGroup,
      entryIds: [newEntry.id, ...prevGroup.entryIds],
      topEntryId: newEntry.id,
      expanded: prevGroup.expanded
    };
    shownHistoryGroups.update((val) => [newGroup, ...val.slice(1)]);
  } else {
    const id = get_store_value(nextId) + 1;
    const newGroup = {
      id,
      isGroup,
      entryIds: [newEntry.id],
      topEntryId: newEntry.id,
      expanded: false
    };
    shownHistoryGroups.update((val) => [newGroup, ...val]);
    nextId.set(id);
  }
}
function resetHistory() {
  stateHistory.set(/* @__PURE__ */ new Map());
  shownHistoryGroups.set([]);
  latestEntry.set(void 0);
}
function getActiveMarks(state2) {
  if (state2.selection.empty) {
    const $from = state2.selection.$from;
    const storedMarks = state2.storedMarks;
    if (storedMarks) {
      return storedMarks.map((mark) => mark.type.name);
    } else {
      return $from.marks().map((mark) => mark.type.name);
    }
  } else {
    const $head = state2.selection.$head;
    const $anchor = state2.selection.$anchor;
    const activeMarks = /* @__PURE__ */ new Set();
    $head.marks().forEach((mark) => activeMarks.add(mark.type.name));
    $anchor.marks().forEach((mark) => activeMarks.add(mark.type.name));
    return Array.from(activeMarks);
  }
}
const defaultProperties = ["jsonID", "empty", "anchor", "from", "head", "to"];
const resolvedPosProperties = ["$anchor", "$head", "$cursor", "$to", "$from"];
const resolvedPosSubProperties = ["nodeAfter", "nodeBefore", "textOffset"];
function createSelection(selection) {
  return defaultProperties.reduce((acc, key) => {
    acc[key] = selection[key];
    return acc;
  }, {});
}
function createFullSelection(selection) {
  return defaultProperties.concat(resolvedPosProperties).reduce((acc, key) => {
    let val = selection[key];
    if (val && resolvedPosProperties.includes(key)) {
      const additionalProperties = {};
      resolvedPosSubProperties.forEach((subKey) => {
        additionalProperties[subKey] = val[subKey];
      });
      val = Object.assign(Object.assign({}, val), additionalProperties);
    }
    acc[key] = val;
    return acc;
  }, {});
}
function createNode(index, key, value, depth, parent) {
  const path = parent ? [...parent.path, index] : [];
  return {
    id: "[".concat(path.join(","), "]"),
    index,
    key,
    value,
    depth,
    collapsed: true,
    type: getValueType(value),
    path,
    parentId: parent ? parent.id : null,
    circularOfId: null,
    children: []
  };
}
function getValueType(value) {
  if (Array.isArray(value)) {
    return "array";
  } else if (value instanceof Map) {
    return "map";
  } else if (value instanceof Set) {
    return "set";
  } else if (value instanceof Date) {
    return "date";
  } else if (value === null) {
    return "null";
  } else {
    return typeof value;
  }
}
function getChildren(value, type) {
  switch (type) {
    case "array":
      return value.map((v, i) => [i.toString(), v]);
    case "map":
      const entries = Array.from(value.entries());
      return entries.map((_ref, i) => {
        let [key, value2] = _ref;
        return ["[map entry ".concat(i, "]"), {
          "[key]": key,
          "[value]": value2
        }];
      });
    case "set":
      return Array.from(value.values()).map((v, i) => ["[set entry ".concat(i, "]"), v]);
    case "object":
      return Object.entries(value);
    default:
      return [];
  }
}
function shouldRecurseChildren(node, parent, iteratedValues, opts) {
  if (!parent) {
    return true;
  } else if (node.collapsed && (parent === null || parent === void 0 ? void 0 : parent.collapsed)) {
    return false;
  } else if (!opts.stopCircularRecursion) {
    return true;
  } else if (opts.isCircularNode) {
    return opts.isCircularNode(node, iteratedValues);
  } else if (node.type === "object" || node.type === "array") {
    const existingNodeWithValue = iteratedValues.get(node.value);
    if (existingNodeWithValue && node.id !== existingNodeWithValue.id) {
      node.circularOfId = existingNodeWithValue.id;
      return false;
    }
    iteratedValues.set(node.value, node);
  }
  return true;
}
function recurseObjectProperties(index, key, value, depth, ensureNotCollapsed, parent, treeMap, oldTreeMap, iteratedValues, recomputeExpandNode, opts) {
  var _a;
  if (((_a = opts.omitKeys) === null || _a === void 0 ? void 0 : _a.includes(key)) || opts.maxDepth && depth > opts.maxDepth) {
    return null;
  }
  const node = createNode(index, key, value, depth, parent);
  const oldNode = oldTreeMap.get(node.id);
  if (ensureNotCollapsed) {
    node.collapsed = false;
  } else if (oldNode && !recomputeExpandNode) {
    node.collapsed = oldNode.collapsed;
  } else if (opts.shouldExpandNode) {
    node.collapsed = !opts.shouldExpandNode(node);
  }
  treeMap.set(node.id, node);
  if (shouldRecurseChildren(node, parent, iteratedValues, opts)) {
    const mappedChildren = opts.mapChildren && opts.mapChildren(value, getValueType(value), node);
    const children2 = mappedChildren !== null && mappedChildren !== void 0 ? mappedChildren : getChildren(value, getValueType(value));
    node.children = children2.map((_ref2, idx) => {
      let [key2, val] = _ref2;
      return recurseObjectProperties(idx, key2, val, depth + 1, false, node, treeMap, oldTreeMap, iteratedValues, recomputeExpandNode, opts);
    }).filter((n) => n !== null);
  }
  return node;
}
function recomputeTree(data, oldTreeMap, recursionOpts, recomputeExpandNode) {
  const treeMap = /* @__PURE__ */ new Map();
  const iteratedValues = /* @__PURE__ */ new Map();
  const newTree = recurseObjectProperties(-1, "root", data, 0, true, null, treeMap, oldTreeMap, iteratedValues, recomputeExpandNode, recursionOpts);
  return {
    treeMap,
    tree: newTree,
    iteratedValues
  };
}
const createPropsStore = (initialProps) => {
  const props = writable(initialProps);
  const recursionOpts = derived(props, (p) => p.recursionOpts);
  return {
    props,
    recursionOpts,
    setProps(newProps) {
      props.set(newProps);
    },
    formatValue(val, node) {
      const {
        valueFormatter
      } = get_store_value(props);
      const customFormat = valueFormatter ? valueFormatter(val, node) : void 0;
      if (customFormat) {
        return customFormat;
      }
      switch (node.type) {
        case "array":
          return "".concat(node.circularOfId ? "circular" : "", " [] ").concat(val.length, " items");
        case "object":
          return "".concat(node.circularOfId ? "circular" : "", " {} ").concat(Object.keys(val).length, " keys");
        case "map":
        case "set":
          return "".concat(node.circularOfId ? "circular" : "", " () ").concat(val.size, " entries");
        case "date":
          return "".concat(val.toISOString());
        case "string":
          return '"'.concat(val, '"');
        case "boolean":
          return val ? "true" : "false";
        case "symbol":
          return String(val);
        default:
          return val;
      }
    }
  };
};
const createRootElementStore = () => {
  const rootElementStore = writable(null);
  return {
    set: rootElementStore.set,
    subscribe: rootElementStore.subscribe
  };
};
const createTreeStore = (propsStore) => {
  const defaultRootNode = createNode(0, "root", [], 0, null);
  const tree = writable(defaultRootNode);
  const treeMap = writable(/* @__PURE__ */ new Map());
  const iteratedValues = writable(/* @__PURE__ */ new Map());
  return {
    tree,
    treeMap,
    defaultRootNode,
    init(newTree, newTreeMap, iterated) {
      if (newTree) {
        tree.set(newTree);
      } else {
        tree.set(defaultRootNode);
      }
      treeMap.set(newTreeMap);
      iteratedValues.set(iterated);
    },
    getNode(id) {
      return get_store_value(treeMap).get(id);
    },
    toggleCollapse(id) {
      const node = get_store_value(treeMap).get(id);
      if (!node) {
        console.warn("Attempted to collapse non-existent node: ".concat(id));
        return;
      }
      const updatedNode = Object.assign(Object.assign({}, node), {
        collapsed: !node.collapsed
      });
      treeMap.update((m) => new Map(m.set(node.id, updatedNode)));
      const recursionOpts = get_store_value(propsStore.recursionOpts);
      if (recursionOpts) {
        this.expandNodeChildren(updatedNode, recursionOpts);
      }
    },
    expandNodeChildren(node, recursionOpts) {
      const parent = this.getNode((node === null || node === void 0 ? void 0 : node.parentId) || "") || null;
      if (!parent) {
        throw Error("No parent in expandNodeChildren for node: " + node);
      }
      const newTreeMap = new Map(get_store_value(treeMap));
      const oldTreeMap = get_store_value(treeMap);
      const previouslyIterated = get_store_value(iteratedValues);
      const nodeWithUpdatedChildren = recurseObjectProperties(
        node.index,
        node.key,
        node.value,
        node.depth,
        !node.collapsed,
        // Ensure that when uncollapsed the node's children are always recursed
        parent,
        newTreeMap,
        oldTreeMap,
        previouslyIterated,
        false,
        // Never recompute shouldExpandNode since it may override the collapsing of this node
        recursionOpts
      );
      if (!nodeWithUpdatedChildren)
        return;
      parent.children = parent.children.map((c) => c.id === nodeWithUpdatedChildren.id ? nodeWithUpdatedChildren : c);
      newTreeMap.set(nodeWithUpdatedChildren.id, nodeWithUpdatedChildren);
      newTreeMap.set(parent.id, parent);
      treeMap.set(newTreeMap);
      iteratedValues.set(previouslyIterated);
    },
    expandAllNodesToNode(id) {
      function recurseNodeUpwards(updated2, node) {
        if (!node)
          return;
        updated2.set(node.id, Object.assign(Object.assign({}, node), {
          collapsed: false
        }));
        if (node.parentId) {
          recurseNodeUpwards(updated2, updated2.get(node.parentId));
        }
      }
      const updated = new Map(get_store_value(treeMap));
      recurseNodeUpwards(updated, updated.get(id));
      treeMap.set(updated);
    }
  };
};
function add_css$h(target) {
  append_styles(target, "svelte-ngcjq5", "ul.svelte-ngcjq5.svelte-ngcjq5{display:flex;flex-direction:column;height:max-content;list-style:none;padding:0;padding-left:var(--tree-view-left-indent);margin:0;width:100%}li.svelte-ngcjq5.svelte-ngcjq5{align-items:baseline;display:flex;height:max-content;line-height:var(--tree-view-line-height);list-style:none;width:100%}li.svelte-ngcjq5+li.svelte-ngcjq5{margin-top:0.25em}.empty-block.svelte-ngcjq5.svelte-ngcjq5{visibility:hidden}.node-key.svelte-ngcjq5.svelte-ngcjq5{color:var(--tree-view-base0D);margin-right:var(--tree-view-key-margin-right)}.node-key.has-children.svelte-ngcjq5.svelte-ngcjq5{cursor:pointer}.node-key.p-left.svelte-ngcjq5.svelte-ngcjq5{padding-left:1.1em}.node-value.svelte-ngcjq5.svelte-ngcjq5{color:var(--tree-view-base0B);margin-right:0.5em;word-break:break-all}.node-value[data-type=number].svelte-ngcjq5.svelte-ngcjq5,.node-value[data-type=boolean].svelte-ngcjq5.svelte-ngcjq5{color:var(--tree-view-base09)}.node-value[data-type=null].svelte-ngcjq5.svelte-ngcjq5,.node-value[data-type=undefined].svelte-ngcjq5.svelte-ngcjq5{color:var(--tree-view-base08)}.node-value.expanded.svelte-ngcjq5.svelte-ngcjq5{color:var(--tree-view-base03)}.node-value.has-children.svelte-ngcjq5.svelte-ngcjq5{cursor:pointer}.arrow-btn.svelte-ngcjq5.svelte-ngcjq5{background:transparent;border:0;color:var(--tree-view-base0D);cursor:pointer;margin-right:0.7em;padding:0;transition:all 150ms ease 0s;transform:rotateZ(90deg);transform-origin:47% 43%;position:relative;line-height:1.1em;font-size:0.75em}.arrow-btn.collapsed.svelte-ngcjq5.svelte-ngcjq5{transform:rotateZ(0deg)}.buttons.svelte-ngcjq5.svelte-ngcjq5{display:flex;flex-wrap:wrap}.log-copy-button.svelte-ngcjq5.svelte-ngcjq5{background:transparent;border:0;color:var(--tree-view-base0D);cursor:pointer;margin:0;padding:0 0.5em}.log-copy-button.svelte-ngcjq5.svelte-ngcjq5:hover{background:rgba(255, 162, 177, 0.4);border-radius:2px;color:var(--tree-view-base07)}");
}
function get_each_context$7(ctx, list, i) {
  const child_ctx = ctx.slice();
  child_ctx[14] = list[i];
  return child_ctx;
}
function create_if_block_4$3(ctx) {
  let button;
  let t;
  let button_class_value;
  let mounted2;
  let dispose;
  return {
    c() {
      button = element("button");
      t = text("▶");
      attr(button, "class", button_class_value = null_to_empty("arrow-btn ".concat(
        /*node*/
        ctx[0].collapsed ? "collapsed" : ""
      )) + " svelte-ngcjq5");
    },
    m(target, anchor) {
      insert(target, button, anchor);
      append(button, t);
      if (!mounted2) {
        dispose = listen(
          button,
          "click",
          /*handleToggleCollapse*/
          ctx[9]
        );
        mounted2 = true;
      }
    },
    p(ctx2, dirty) {
      if (dirty & /*node*/
      1 && button_class_value !== (button_class_value = null_to_empty("arrow-btn ".concat(
        /*node*/
        ctx2[0].collapsed ? "collapsed" : ""
      )) + " svelte-ngcjq5")) {
        attr(button, "class", button_class_value);
      }
    },
    d(detaching) {
      if (detaching) {
        detach(button);
      }
      mounted2 = false;
      dispose();
    }
  };
}
function create_else_block$8(ctx) {
  let t_value = (
    /*propsStore*/
    ctx[5].formatValue(
      /*node*/
      ctx[0].value,
      /*node*/
      ctx[0]
    ) + ""
  );
  let t;
  return {
    c() {
      t = text(t_value);
    },
    m(target, anchor) {
      insert(target, t, anchor);
    },
    p(ctx2, dirty) {
      if (dirty & /*node*/
      1 && t_value !== (t_value = /*propsStore*/
      ctx2[5].formatValue(
        /*node*/
        ctx2[0].value,
        /*node*/
        ctx2[0]
      ) + ""))
        set_data(t, t_value);
    },
    i: noop,
    o: noop,
    d(detaching) {
      if (detaching) {
        detach(t);
      }
    }
  };
}
function create_if_block_3$4(ctx) {
  let switch_instance;
  let switch_instance_anchor;
  let current;
  var switch_value = (
    /*valueComponent*/
    ctx[3]
  );
  function switch_props(ctx2, dirty) {
    return {
      props: {
        value: (
          /*node*/
          ctx2[0].value
        ),
        node: (
          /*node*/
          ctx2[0]
        ),
        defaultFormatter: (
          /*valueComponentDefaultFormatter*/
          ctx2[10]
        )
      }
    };
  }
  if (switch_value) {
    switch_instance = construct_svelte_component(switch_value, switch_props(ctx));
  }
  return {
    c() {
      if (switch_instance)
        create_component(switch_instance.$$.fragment);
      switch_instance_anchor = empty();
    },
    m(target, anchor) {
      if (switch_instance)
        mount_component(switch_instance, target, anchor);
      insert(target, switch_instance_anchor, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      if (dirty & /*valueComponent*/
      8 && switch_value !== (switch_value = /*valueComponent*/
      ctx2[3])) {
        if (switch_instance) {
          group_outros();
          const old_component = switch_instance;
          transition_out(old_component.$$.fragment, 1, 0, () => {
            destroy_component(old_component, 1);
          });
          check_outros();
        }
        if (switch_value) {
          switch_instance = construct_svelte_component(switch_value, switch_props(ctx2));
          create_component(switch_instance.$$.fragment);
          transition_in(switch_instance.$$.fragment, 1);
          mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
        } else {
          switch_instance = null;
        }
      } else if (switch_value) {
        const switch_instance_changes = {};
        if (dirty & /*node*/
        1)
          switch_instance_changes.value = /*node*/
          ctx2[0].value;
        if (dirty & /*node*/
        1)
          switch_instance_changes.node = /*node*/
          ctx2[0];
        switch_instance.$set(switch_instance_changes);
      }
    },
    i(local) {
      if (current)
        return;
      if (switch_instance)
        transition_in(switch_instance.$$.fragment, local);
      current = true;
    },
    o(local) {
      if (switch_instance)
        transition_out(switch_instance.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(switch_instance_anchor);
      }
      if (switch_instance)
        destroy_component(switch_instance, detaching);
    }
  };
}
function create_if_block_2$5(ctx) {
  let button;
  let mounted2;
  let dispose;
  return {
    c() {
      button = element("button");
      button.textContent = "log";
      attr(button, "class", "log-copy-button svelte-ngcjq5");
    },
    m(target, anchor) {
      insert(target, button, anchor);
      if (!mounted2) {
        dispose = listen(
          button,
          "click",
          /*handleLogNode*/
          ctx[7]
        );
        mounted2 = true;
      }
    },
    p: noop,
    d(detaching) {
      if (detaching) {
        detach(button);
      }
      mounted2 = false;
      dispose();
    }
  };
}
function create_if_block_1$6(ctx) {
  let button;
  let mounted2;
  let dispose;
  return {
    c() {
      button = element("button");
      button.textContent = "copy";
      attr(button, "class", "log-copy-button svelte-ngcjq5");
    },
    m(target, anchor) {
      insert(target, button, anchor);
      if (!mounted2) {
        dispose = listen(
          button,
          "click",
          /*handleCopyNodeToClipboard*/
          ctx[8]
        );
        mounted2 = true;
      }
    },
    p: noop,
    d(detaching) {
      if (detaching) {
        detach(button);
      }
      mounted2 = false;
      dispose();
    }
  };
}
function create_if_block$9(ctx) {
  let li;
  let ul;
  let current;
  let each_value = ensure_array_like(
    /*node*/
    ctx[0].children
  );
  let each_blocks = [];
  for (let i = 0; i < each_value.length; i += 1) {
    each_blocks[i] = create_each_block$7(get_each_context$7(ctx, each_value, i));
  }
  const out = (i) => transition_out(each_blocks[i], 1, 1, () => {
    each_blocks[i] = null;
  });
  return {
    c() {
      li = element("li");
      ul = element("ul");
      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].c();
      }
      attr(ul, "class", "svelte-ngcjq5");
      attr(li, "class", "row svelte-ngcjq5");
    },
    m(target, anchor) {
      insert(target, li, anchor);
      append(li, ul);
      for (let i = 0; i < each_blocks.length; i += 1) {
        if (each_blocks[i]) {
          each_blocks[i].m(ul, null);
        }
      }
      current = true;
    },
    p(ctx2, dirty) {
      if (dirty & /*node*/
      1) {
        each_value = ensure_array_like(
          /*node*/
          ctx2[0].children
        );
        let i;
        for (i = 0; i < each_value.length; i += 1) {
          const child_ctx = get_each_context$7(ctx2, each_value, i);
          if (each_blocks[i]) {
            each_blocks[i].p(child_ctx, dirty);
            transition_in(each_blocks[i], 1);
          } else {
            each_blocks[i] = create_each_block$7(child_ctx);
            each_blocks[i].c();
            transition_in(each_blocks[i], 1);
            each_blocks[i].m(ul, null);
          }
        }
        group_outros();
        for (i = each_value.length; i < each_blocks.length; i += 1) {
          out(i);
        }
        check_outros();
      }
    },
    i(local) {
      if (current)
        return;
      for (let i = 0; i < each_value.length; i += 1) {
        transition_in(each_blocks[i]);
      }
      current = true;
    },
    o(local) {
      each_blocks = each_blocks.filter(Boolean);
      for (let i = 0; i < each_blocks.length; i += 1) {
        transition_out(each_blocks[i]);
      }
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(li);
      }
      destroy_each(each_blocks, detaching);
    }
  };
}
function create_each_block$7(ctx) {
  let treeviewnode;
  let current;
  treeviewnode = new TreeViewNode({
    props: {
      id: (
        /*child*/
        ctx[14].id
      )
    }
  });
  return {
    c() {
      create_component(treeviewnode.$$.fragment);
    },
    m(target, anchor) {
      mount_component(treeviewnode, target, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      const treeviewnode_changes = {};
      if (dirty & /*node*/
      1)
        treeviewnode_changes.id = /*child*/
        ctx2[14].id;
      treeviewnode.$set(treeviewnode_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(treeviewnode.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(treeviewnode.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(treeviewnode, detaching);
    }
  };
}
function create_fragment$h(ctx) {
  let li;
  let t0;
  let div0;
  let t1_value = (
    /*node*/
    ctx[0].key + ""
  );
  let t1;
  let t2;
  let t3;
  let div1;
  let current_block_type_index;
  let if_block1;
  let div1_data_type_value;
  let t4;
  let div2;
  let t5;
  let li_data_tree_id_value;
  let t6;
  let if_block4_anchor;
  let current;
  let mounted2;
  let dispose;
  let if_block0 = (
    /*hasChildren*/
    ctx[2] && create_if_block_4$3(ctx)
  );
  const if_block_creators = [create_if_block_3$4, create_else_block$8];
  const if_blocks = [];
  function select_block_type(ctx2, dirty) {
    if (
      /*valueComponent*/
      ctx2[3]
    )
      return 0;
    return 1;
  }
  current_block_type_index = select_block_type(ctx);
  if_block1 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
  let if_block2 = (
    /*$props*/
    ctx[1].showLogButton && create_if_block_2$5(ctx)
  );
  let if_block3 = (
    /*$props*/
    ctx[1].showCopyButton && create_if_block_1$6(ctx)
  );
  let if_block4 = !/*node*/
  ctx[0].collapsed && /*hasChildren*/
  ctx[2] && create_if_block$9(ctx);
  return {
    c() {
      li = element("li");
      if (if_block0)
        if_block0.c();
      t0 = space();
      div0 = element("div");
      t1 = text(t1_value);
      t2 = text(":");
      t3 = space();
      div1 = element("div");
      if_block1.c();
      t4 = space();
      div2 = element("div");
      if (if_block2)
        if_block2.c();
      t5 = space();
      if (if_block3)
        if_block3.c();
      t6 = space();
      if (if_block4)
        if_block4.c();
      if_block4_anchor = empty();
      attr(div0, "class", "node-key svelte-ngcjq5");
      attr(div0, "role", "presentation");
      toggle_class(
        div0,
        "has-children",
        /*hasChildren*/
        ctx[2]
      );
      toggle_class(div0, "p-left", !/*hasChildren*/
      ctx[2]);
      attr(div1, "class", "node-value svelte-ngcjq5");
      attr(div1, "data-type", div1_data_type_value = /*node*/
      ctx[0].type);
      attr(div1, "role", "presentation");
      toggle_class(div1, "expanded", !/*node*/
      ctx[0].collapsed && /*hasChildren*/
      ctx[2]);
      toggle_class(
        div1,
        "has-children",
        /*hasChildren*/
        ctx[2]
      );
      attr(div2, "class", "buttons svelte-ngcjq5");
      attr(li, "class", "row svelte-ngcjq5");
      attr(li, "data-tree-id", li_data_tree_id_value = /*node*/
      ctx[0].id);
      toggle_class(
        li,
        "collapsed",
        /*node*/
        ctx[0].collapsed && /*hasChildren*/
        ctx[2]
      );
    },
    m(target, anchor) {
      insert(target, li, anchor);
      if (if_block0)
        if_block0.m(li, null);
      append(li, t0);
      append(li, div0);
      append(div0, t1);
      append(div0, t2);
      append(li, t3);
      append(li, div1);
      if_blocks[current_block_type_index].m(div1, null);
      append(li, t4);
      append(li, div2);
      if (if_block2)
        if_block2.m(div2, null);
      append(div2, t5);
      if (if_block3)
        if_block3.m(div2, null);
      insert(target, t6, anchor);
      if (if_block4)
        if_block4.m(target, anchor);
      insert(target, if_block4_anchor, anchor);
      current = true;
      if (!mounted2) {
        dispose = [listen(
          div0,
          "click",
          /*handleToggleCollapse*/
          ctx[9]
        ), listen(
          div1,
          "click",
          /*handleToggleCollapse*/
          ctx[9]
        )];
        mounted2 = true;
      }
    },
    p(ctx2, _ref) {
      let [dirty] = _ref;
      if (
        /*hasChildren*/
        ctx2[2]
      ) {
        if (if_block0) {
          if_block0.p(ctx2, dirty);
        } else {
          if_block0 = create_if_block_4$3(ctx2);
          if_block0.c();
          if_block0.m(li, t0);
        }
      } else if (if_block0) {
        if_block0.d(1);
        if_block0 = null;
      }
      if ((!current || dirty & /*node*/
      1) && t1_value !== (t1_value = /*node*/
      ctx2[0].key + ""))
        set_data(t1, t1_value);
      if (!current || dirty & /*hasChildren*/
      4) {
        toggle_class(
          div0,
          "has-children",
          /*hasChildren*/
          ctx2[2]
        );
      }
      if (!current || dirty & /*hasChildren*/
      4) {
        toggle_class(div0, "p-left", !/*hasChildren*/
        ctx2[2]);
      }
      let previous_block_index = current_block_type_index;
      current_block_type_index = select_block_type(ctx2);
      if (current_block_type_index === previous_block_index) {
        if_blocks[current_block_type_index].p(ctx2, dirty);
      } else {
        group_outros();
        transition_out(if_blocks[previous_block_index], 1, 1, () => {
          if_blocks[previous_block_index] = null;
        });
        check_outros();
        if_block1 = if_blocks[current_block_type_index];
        if (!if_block1) {
          if_block1 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx2);
          if_block1.c();
        } else {
          if_block1.p(ctx2, dirty);
        }
        transition_in(if_block1, 1);
        if_block1.m(div1, null);
      }
      if (!current || dirty & /*node*/
      1 && div1_data_type_value !== (div1_data_type_value = /*node*/
      ctx2[0].type)) {
        attr(div1, "data-type", div1_data_type_value);
      }
      if (!current || dirty & /*node, hasChildren*/
      5) {
        toggle_class(div1, "expanded", !/*node*/
        ctx2[0].collapsed && /*hasChildren*/
        ctx2[2]);
      }
      if (!current || dirty & /*hasChildren*/
      4) {
        toggle_class(
          div1,
          "has-children",
          /*hasChildren*/
          ctx2[2]
        );
      }
      if (
        /*$props*/
        ctx2[1].showLogButton
      ) {
        if (if_block2) {
          if_block2.p(ctx2, dirty);
        } else {
          if_block2 = create_if_block_2$5(ctx2);
          if_block2.c();
          if_block2.m(div2, t5);
        }
      } else if (if_block2) {
        if_block2.d(1);
        if_block2 = null;
      }
      if (
        /*$props*/
        ctx2[1].showCopyButton
      ) {
        if (if_block3) {
          if_block3.p(ctx2, dirty);
        } else {
          if_block3 = create_if_block_1$6(ctx2);
          if_block3.c();
          if_block3.m(div2, null);
        }
      } else if (if_block3) {
        if_block3.d(1);
        if_block3 = null;
      }
      if (!current || dirty & /*node*/
      1 && li_data_tree_id_value !== (li_data_tree_id_value = /*node*/
      ctx2[0].id)) {
        attr(li, "data-tree-id", li_data_tree_id_value);
      }
      if (!current || dirty & /*node, hasChildren*/
      5) {
        toggle_class(
          li,
          "collapsed",
          /*node*/
          ctx2[0].collapsed && /*hasChildren*/
          ctx2[2]
        );
      }
      if (!/*node*/
      ctx2[0].collapsed && /*hasChildren*/
      ctx2[2]) {
        if (if_block4) {
          if_block4.p(ctx2, dirty);
          if (dirty & /*node, hasChildren*/
          5) {
            transition_in(if_block4, 1);
          }
        } else {
          if_block4 = create_if_block$9(ctx2);
          if_block4.c();
          transition_in(if_block4, 1);
          if_block4.m(if_block4_anchor.parentNode, if_block4_anchor);
        }
      } else if (if_block4) {
        group_outros();
        transition_out(if_block4, 1, 1, () => {
          if_block4 = null;
        });
        check_outros();
      }
    },
    i(local) {
      if (current)
        return;
      transition_in(if_block1);
      transition_in(if_block4);
      current = true;
    },
    o(local) {
      transition_out(if_block1);
      transition_out(if_block4);
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(li);
        detach(t6);
        detach(if_block4_anchor);
      }
      if (if_block0)
        if_block0.d();
      if_blocks[current_block_type_index].d();
      if (if_block2)
        if_block2.d();
      if (if_block3)
        if_block3.d();
      if (if_block4)
        if_block4.d(detaching);
      mounted2 = false;
      run_all(dispose);
    }
  };
}
function instance$h($$self, $$props, $$invalidate) {
  let hasChildren;
  let props;
  let valueComponent;
  let $rootElementStore;
  let $props, $$unsubscribe_props = noop, $$subscribe_props = () => ($$unsubscribe_props(), $$unsubscribe_props = subscribe(props, ($$value) => $$invalidate(1, $props = $$value)), props);
  $$self.$$.on_destroy.push(() => $$unsubscribe_props());
  let {
    id
  } = $$props;
  const {
    treeStore,
    propsStore,
    rootElementStore
  } = getContext$1("svelte-tree-view");
  component_subscribe($$self, rootElementStore, (value) => $$invalidate(12, $rootElementStore = value));
  let node;
  treeStore.treeMap.subscribe((value) => {
    const n = value.get(id);
    if (n && node !== n) {
      $$invalidate(0, node = n);
    }
  });
  function handleLogNode() {
    console.info("%c [svelte-tree-view]: Property added to window._node", "color: #b8e248");
    console.log(node.value);
    try {
      if (typeof window !== "undefined")
        window._node = node.value;
    } catch (err) {
      console.error("Failed to set _node, window was undefined");
    }
  }
  function handleCopyNodeToClipboard() {
    try {
      navigator.clipboard.writeText(JSON.stringify(node.value));
    } catch (err) {
      console.error("Copying node to clipboard failed: ", err);
    }
  }
  function handleToggleCollapse() {
    var _a;
    if (hasChildren) {
      treeStore.toggleCollapse(node.id);
    } else if (node.circularOfId) {
      treeStore.expandAllNodesToNode(node.circularOfId);
      (_a = $rootElementStore === null || $rootElementStore === void 0 ? void 0 : $rootElementStore.querySelector('li[data-tree-id="'.concat(node.circularOfId, '"]'))) === null || _a === void 0 ? void 0 : _a.scrollIntoView();
    }
  }
  function valueComponentDefaultFormatter(val) {
    return propsStore.formatValue(val, node);
  }
  $$self.$$set = ($$props2) => {
    if ("id" in $$props2)
      $$invalidate(11, id = $$props2.id);
  };
  $$self.$$.update = () => {
    if ($$self.$$.dirty & /*id*/
    2048) {
      {
        let found = treeStore.getNode(id);
        if (!found) {
          throw Error("[svelte-tree-view] TreeViewNode.svelte received undefined node from treeMapStore whereas it should be already unmounted!");
        }
        $$invalidate(0, node = found);
      }
    }
    if ($$self.$$.dirty & /*node*/
    1) {
      $$invalidate(2, hasChildren = node && node.children.length > 0);
    }
    if ($$self.$$.dirty & /*$props*/
    2) {
      $$invalidate(3, valueComponent = $props.valueComponent);
    }
  };
  $$subscribe_props($$invalidate(4, props = propsStore.props));
  return [node, $props, hasChildren, valueComponent, props, propsStore, rootElementStore, handleLogNode, handleCopyNodeToClipboard, handleToggleCollapse, valueComponentDefaultFormatter, id];
}
class TreeViewNode extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$h, create_fragment$h, safe_not_equal, {
      id: 11
    }, add_css$h);
  }
}
function add_css$g(target) {
  append_styles(target, "svelte-167awo5", ":root{--tree-view-font-family:'Helvetica Neue', 'Calibri Light', Roboto, sans-serif;--tree-view-font-size:13px;--tree-view-left-indent:0.875em;--tree-view-line-height:1.1;--tree-view-key-margin-right:0.5em}ul.svelte-167awo5{background:var(--tree-view-base00);font-family:var(--tree-view-font-family);font-size:var(--tree-view-font-size);height:max-content;list-style:none;margin:0;padding:0;width:max-content}");
}
function get_each_context$6(ctx, list, i) {
  const child_ctx = ctx.slice();
  child_ctx[18] = list[i];
  return child_ctx;
}
function create_each_block$6(ctx) {
  let treeviewnode;
  let current;
  treeviewnode = new TreeViewNode({
    props: {
      id: (
        /*child*/
        ctx[18].id
      )
    }
  });
  return {
    c() {
      create_component(treeviewnode.$$.fragment);
    },
    m(target, anchor) {
      mount_component(treeviewnode, target, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      const treeviewnode_changes = {};
      if (dirty & /*$rootNode*/
      4)
        treeviewnode_changes.id = /*child*/
        ctx2[18].id;
      treeviewnode.$set(treeviewnode_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(treeviewnode.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(treeviewnode.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(treeviewnode, detaching);
    }
  };
}
function create_fragment$g(ctx) {
  let ul;
  let ul_class_value;
  let current;
  let each_value = ensure_array_like(
    /*$rootNode*/
    ctx[2].children
  );
  let each_blocks = [];
  for (let i = 0; i < each_value.length; i += 1) {
    each_blocks[i] = create_each_block$6(get_each_context$6(ctx, each_value, i));
  }
  const out = (i) => transition_out(each_blocks[i], 1, 1, () => {
    each_blocks[i] = null;
  });
  return {
    c() {
      ul = element("ul");
      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].c();
      }
      attr(ul, "class", ul_class_value = null_to_empty("".concat(
        /*$$props*/
        ctx[3].class || "",
        " svelte-tree-view"
      )) + " svelte-167awo5");
    },
    m(target, anchor) {
      insert(target, ul, anchor);
      for (let i = 0; i < each_blocks.length; i += 1) {
        if (each_blocks[i]) {
          each_blocks[i].m(ul, null);
        }
      }
      ctx[13](ul);
      current = true;
    },
    p(ctx2, _ref) {
      let [dirty] = _ref;
      if (dirty & /*$rootNode*/
      4) {
        each_value = ensure_array_like(
          /*$rootNode*/
          ctx2[2].children
        );
        let i;
        for (i = 0; i < each_value.length; i += 1) {
          const child_ctx = get_each_context$6(ctx2, each_value, i);
          if (each_blocks[i]) {
            each_blocks[i].p(child_ctx, dirty);
            transition_in(each_blocks[i], 1);
          } else {
            each_blocks[i] = create_each_block$6(child_ctx);
            each_blocks[i].c();
            transition_in(each_blocks[i], 1);
            each_blocks[i].m(ul, null);
          }
        }
        group_outros();
        for (i = each_value.length; i < each_blocks.length; i += 1) {
          out(i);
        }
        check_outros();
      }
      if (!current || dirty & /*$$props*/
      8 && ul_class_value !== (ul_class_value = null_to_empty("".concat(
        /*$$props*/
        ctx2[3].class || "",
        " svelte-tree-view"
      )) + " svelte-167awo5")) {
        attr(ul, "class", ul_class_value);
      }
    },
    i(local) {
      if (current)
        return;
      for (let i = 0; i < each_value.length; i += 1) {
        transition_in(each_blocks[i]);
      }
      current = true;
    },
    o(local) {
      each_blocks = each_blocks.filter(Boolean);
      for (let i = 0; i < each_blocks.length; i += 1) {
        transition_out(each_blocks[i]);
      }
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(ul);
      }
      destroy_each(each_blocks, detaching);
      ctx[13](null);
    }
  };
}
function instance$g($$self, $$props, $$invalidate) {
  let rootNode;
  let $rootNode, $$unsubscribe_rootNode = noop, $$subscribe_rootNode = () => ($$unsubscribe_rootNode(), $$unsubscribe_rootNode = subscribe(rootNode, ($$value) => $$invalidate(2, $rootNode = $$value)), rootNode);
  $$self.$$.on_destroy.push(() => $$unsubscribe_rootNode());
  var _a;
  let {
    data,
    theme = void 0,
    showLogButton = false,
    showCopyButton = false,
    valueComponent = void 0,
    recursionOpts = {},
    valueFormatter = void 0
  } = $$props;
  let rootElement = null;
  const defaultRecursionOpts = {
    maxDepth: 16,
    omitKeys: [],
    stopCircularRecursion: false,
    shouldExpandNode: () => false
  };
  let props = {
    showLogButton,
    showCopyButton,
    valueComponent,
    recursionOpts: {
      ...defaultRecursionOpts,
      ...recursionOpts
    },
    valueFormatter
  };
  const propsStore = createPropsStore(props);
  const rootElementStore = createRootElementStore();
  const treeStore = createTreeStore(propsStore);
  setContext$1("svelte-tree-view", {
    propsStore,
    rootElementStore,
    treeStore
  });
  onMount(() => {
    rootElementStore.set(rootElement);
  });
  function ul_binding($$value) {
    binding_callbacks[$$value ? "unshift" : "push"](() => {
      rootElement = $$value;
      $$invalidate(0, rootElement);
    });
  }
  $$self.$$set = ($$new_props) => {
    $$invalidate(3, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    if ("data" in $$new_props)
      $$invalidate(4, data = $$new_props.data);
    if ("theme" in $$new_props)
      $$invalidate(5, theme = $$new_props.theme);
    if ("showLogButton" in $$new_props)
      $$invalidate(6, showLogButton = $$new_props.showLogButton);
    if ("showCopyButton" in $$new_props)
      $$invalidate(7, showCopyButton = $$new_props.showCopyButton);
    if ("valueComponent" in $$new_props)
      $$invalidate(8, valueComponent = $$new_props.valueComponent);
    if ("recursionOpts" in $$new_props)
      $$invalidate(9, recursionOpts = $$new_props.recursionOpts);
    if ("valueFormatter" in $$new_props)
      $$invalidate(10, valueFormatter = $$new_props.valueFormatter);
  };
  $$self.$$.update = () => {
    if ($$self.$$.dirty & /*showLogButton, showCopyButton, valueComponent, valueFormatter, props*/
    5568) {
      {
        $$invalidate(12, props = {
          showLogButton,
          showCopyButton,
          valueComponent,
          valueFormatter,
          recursionOpts: props.recursionOpts
        });
      }
    }
    if ($$self.$$.dirty & /*recursionOpts, props, _a, data*/
    6672) {
      {
        const newRecursionOpts = {
          ...defaultRecursionOpts,
          ...recursionOpts
        };
        const recomputeExpandNode = ($$invalidate(11, _a = props === null || props === void 0 ? void 0 : props.recursionOpts) === null || _a === void 0 ? void 0 : _a.shouldExpandNode) !== newRecursionOpts.shouldExpandNode;
        const oldTreeMap = get_store_value(treeStore.treeMap);
        const {
          treeMap,
          tree,
          iteratedValues
        } = recomputeTree(data, oldTreeMap, newRecursionOpts, recomputeExpandNode);
        treeStore.init(tree, treeMap, iteratedValues);
        $$invalidate(12, props.recursionOpts = newRecursionOpts, props);
        propsStore.setProps(props);
      }
    }
    if ($$self.$$.dirty & /*theme, rootElement*/
    33) {
      {
        if (theme && rootElement) {
          let key;
          for (key in theme) {
            const value = theme[key];
            if (rootElement && key.includes("base") && value) {
              rootElement.style.setProperty("--tree-view-".concat(key), value);
            }
          }
        }
      }
    }
  };
  $$subscribe_rootNode($$invalidate(1, rootNode = treeStore.tree));
  $$props = exclude_internal_props($$props);
  return [rootElement, rootNode, $rootNode, $$props, data, theme, showLogButton, showCopyButton, valueComponent, recursionOpts, valueFormatter, _a, props, ul_binding];
}
class TreeView extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$g, create_fragment$g, safe_not_equal, {
      data: 4,
      theme: 5,
      showLogButton: 6,
      showCopyButton: 7,
      valueComponent: 8,
      recursionOpts: 9,
      valueFormatter: 10
    }, add_css$g);
  }
}
function add_css$f(target) {
  append_styles(target, "svelte-fdudio", ".split-view.svelte-fdudio{border-top:1px solid rgba(255, 162, 177, 0.2);color:#fff;display:flex;height:calc(100% - var(--height-tabs-menu));width:100%}.split-view h2{color:rgb(187, 145, 163);font-family:var(--font-sans);font-size:var(--font-medium);font-weight:400;letter-spacing:1px;margin:0;text-transform:uppercase}.split-view > .left-panel{display:flex;flex-direction:column;flex-grow:1;overflow:scroll;padding:1em}.split-view > .right-panel{border-left:1px solid rgba(255, 162, 177, 0.2);display:flex;flex-direction:column;flex-grow:1;overflow:scroll;padding:1em}.split-view .hidden{visibility:hidden}");
}
const get_right_slot_changes = (dirty) => ({});
const get_right_slot_context = (ctx) => ({
  class: "right-panel"
});
const get_left_slot_changes = (dirty) => ({});
const get_left_slot_context = (ctx) => ({
  class: "left-panel"
});
function create_fragment$f(ctx) {
  let section;
  let t;
  let current;
  const left_slot_template = (
    /*#slots*/
    ctx[1].left
  );
  const left_slot = create_slot(
    left_slot_template,
    ctx,
    /*$$scope*/
    ctx[0],
    get_left_slot_context
  );
  const right_slot_template = (
    /*#slots*/
    ctx[1].right
  );
  const right_slot = create_slot(
    right_slot_template,
    ctx,
    /*$$scope*/
    ctx[0],
    get_right_slot_context
  );
  return {
    c() {
      section = element("section");
      if (left_slot)
        left_slot.c();
      t = space();
      if (right_slot)
        right_slot.c();
      attr(section, "class", "split-view svelte-fdudio");
    },
    m(target, anchor) {
      insert(target, section, anchor);
      if (left_slot) {
        left_slot.m(section, null);
      }
      append(section, t);
      if (right_slot) {
        right_slot.m(section, null);
      }
      current = true;
    },
    p(ctx2, _ref) {
      let [dirty] = _ref;
      if (left_slot) {
        if (left_slot.p && (!current || dirty & /*$$scope*/
        1)) {
          update_slot_base(
            left_slot,
            left_slot_template,
            ctx2,
            /*$$scope*/
            ctx2[0],
            !current ? get_all_dirty_from_scope(
              /*$$scope*/
              ctx2[0]
            ) : get_slot_changes(
              left_slot_template,
              /*$$scope*/
              ctx2[0],
              dirty,
              get_left_slot_changes
            ),
            get_left_slot_context
          );
        }
      }
      if (right_slot) {
        if (right_slot.p && (!current || dirty & /*$$scope*/
        1)) {
          update_slot_base(
            right_slot,
            right_slot_template,
            ctx2,
            /*$$scope*/
            ctx2[0],
            !current ? get_all_dirty_from_scope(
              /*$$scope*/
              ctx2[0]
            ) : get_slot_changes(
              right_slot_template,
              /*$$scope*/
              ctx2[0],
              dirty,
              get_right_slot_changes
            ),
            get_right_slot_context
          );
        }
      }
    },
    i(local) {
      if (current)
        return;
      transition_in(left_slot, local);
      transition_in(right_slot, local);
      current = true;
    },
    o(local) {
      transition_out(left_slot, local);
      transition_out(right_slot, local);
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(section);
      }
      if (left_slot)
        left_slot.d(detaching);
      if (right_slot)
        right_slot.d(detaching);
    }
  };
}
function instance$f($$self, $$props, $$invalidate) {
  let {
    $$slots: slots = {},
    $$scope
  } = $$props;
  $$self.$$set = ($$props2) => {
    if ("$$scope" in $$props2)
      $$invalidate(0, $$scope = $$props2.$$scope);
  };
  return [$$scope, slots];
}
class SplitView extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$f, create_fragment$f, safe_not_equal, {}, add_css$f);
  }
}
function add_css$e(target) {
  append_styles(target, "svelte-it3v6s", "button.svelte-it3v6s{background:transparent;border:0;border-radius:2px;color:#d3d3d9;cursor:pointer;font-family:var(--font-family);font-size:var(--font-small);font-weight:400;padding:6px 10px;text-transform:uppercase}button.svelte-it3v6s:hover{background:rgba(255, 162, 177, 0.4);color:#fff}button.selected.svelte-it3v6s{background:rgba(255, 162, 177, 0.4)}");
}
function create_fragment$e(ctx) {
  let button;
  let button_class_value;
  let current;
  let mounted2;
  let dispose;
  const default_slot_template = (
    /*#slots*/
    ctx[3].default
  );
  const default_slot = create_slot(
    default_slot_template,
    ctx,
    /*$$scope*/
    ctx[2],
    null
  );
  return {
    c() {
      button = element("button");
      if (default_slot)
        default_slot.c();
      attr(button, "class", button_class_value = null_to_empty("".concat(
        /*$$props*/
        ctx[1].class || ""
      )) + " svelte-it3v6s");
      toggle_class(
        button,
        "selected",
        /*selected*/
        ctx[0]
      );
    },
    m(target, anchor) {
      insert(target, button, anchor);
      if (default_slot) {
        default_slot.m(button, null);
      }
      current = true;
      if (!mounted2) {
        dispose = [listen(
          button,
          "click",
          /*click_handler*/
          ctx[4]
        ), listen(
          button,
          "mouseover",
          /*mouseover_handler*/
          ctx[5]
        ), listen(
          button,
          "mouseenter",
          /*mouseenter_handler*/
          ctx[6]
        ), listen(
          button,
          "mouseleave",
          /*mouseleave_handler*/
          ctx[7]
        ), listen(
          button,
          "focus",
          /*focus_handler*/
          ctx[8]
        )];
        mounted2 = true;
      }
    },
    p(ctx2, _ref) {
      let [dirty] = _ref;
      if (default_slot) {
        if (default_slot.p && (!current || dirty & /*$$scope*/
        4)) {
          update_slot_base(
            default_slot,
            default_slot_template,
            ctx2,
            /*$$scope*/
            ctx2[2],
            !current ? get_all_dirty_from_scope(
              /*$$scope*/
              ctx2[2]
            ) : get_slot_changes(
              default_slot_template,
              /*$$scope*/
              ctx2[2],
              dirty,
              null
            ),
            null
          );
        }
      }
      if (!current || dirty & /*$$props*/
      2 && button_class_value !== (button_class_value = null_to_empty("".concat(
        /*$$props*/
        ctx2[1].class || ""
      )) + " svelte-it3v6s")) {
        attr(button, "class", button_class_value);
      }
      if (!current || dirty & /*$$props, selected*/
      3) {
        toggle_class(
          button,
          "selected",
          /*selected*/
          ctx2[0]
        );
      }
    },
    i(local) {
      if (current)
        return;
      transition_in(default_slot, local);
      current = true;
    },
    o(local) {
      transition_out(default_slot, local);
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(button);
      }
      if (default_slot)
        default_slot.d(detaching);
      mounted2 = false;
      run_all(dispose);
    }
  };
}
function instance$e($$self, $$props, $$invalidate) {
  let {
    $$slots: slots = {},
    $$scope
  } = $$props;
  let {
    selected = false
  } = $$props;
  function click_handler(event) {
    bubble.call(this, $$self, event);
  }
  function mouseover_handler(event) {
    bubble.call(this, $$self, event);
  }
  function mouseenter_handler(event) {
    bubble.call(this, $$self, event);
  }
  function mouseleave_handler(event) {
    bubble.call(this, $$self, event);
  }
  function focus_handler(event) {
    bubble.call(this, $$self, event);
  }
  $$self.$$set = ($$new_props) => {
    $$invalidate(1, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    if ("selected" in $$new_props)
      $$invalidate(0, selected = $$new_props.selected);
    if ("$$scope" in $$new_props)
      $$invalidate(2, $$scope = $$new_props.$$scope);
  };
  $$props = exclude_internal_props($$props);
  return [selected, $$props, $$scope, slots, click_handler, mouseover_handler, mouseenter_handler, mouseleave_handler, focus_handler];
}
class Button extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$e, create_fragment$e, safe_not_equal, {
      selected: 0
    }, add_css$e);
  }
}
function add_css$d(target) {
  append_styles(target, "svelte-8c7oqn", '@charset "UTF-8";.top-row.svelte-8c7oqn{align-items:center;display:flex;justify-content:space-between}.left-panel[slot=left].svelte-8c7oqn{overflow:scroll}.right-panel[slot=right].svelte-8c7oqn{border-left:1px solid rgba(255, 162, 177, 0.2);flex-grow:0;min-width:200px;width:200px}.split-view .selection-btn{height:24px;width:35px}.caret-icon.svelte-8c7oqn::before{content:"▶"}.caret-icon.expanded.svelte-8c7oqn::before{content:"▼"}.no-marks.svelte-8c7oqn{color:#85d9ef;margin:0.5em 0 1.25em 1em}.split-view .tree-view{margin:0.5em 0 1.25em 0}');
}
function create_default_slot_1$4(ctx) {
  let t;
  return {
    c() {
      t = text("log");
    },
    m(target, anchor) {
      insert(target, t, anchor);
    },
    d(detaching) {
      if (detaching) {
        detach(t);
      }
    }
  };
}
function create_left_slot$4(ctx) {
  let div1;
  let div0;
  let h2;
  let t1;
  let button;
  let t2;
  let treeview;
  let current;
  button = new Button({
    props: {
      $$slots: {
        default: [create_default_slot_1$4]
      },
      $$scope: {
        ctx
      }
    }
  });
  button.$on(
    "click",
    /*handleClickLogDoc*/
    ctx[6]
  );
  treeview = new TreeView({
    props: {
      class: "tree-view",
      data: (
        /*doc*/
        ctx[0]
      ),
      showLogButton: true,
      showCopyButton: true,
      valueFormatter: formatDocNodeValue
    }
  });
  return {
    c() {
      div1 = element("div");
      div0 = element("div");
      h2 = element("h2");
      h2.textContent = "Current doc";
      t1 = space();
      create_component(button.$$.fragment);
      t2 = space();
      create_component(treeview.$$.fragment);
      attr(div0, "class", "top-row svelte-8c7oqn");
      attr(div1, "slot", "left");
      attr(div1, "class", "left-panel svelte-8c7oqn");
    },
    m(target, anchor) {
      insert(target, div1, anchor);
      append(div1, div0);
      append(div0, h2);
      append(div0, t1);
      mount_component(button, div0, null);
      append(div1, t2);
      mount_component(treeview, div1, null);
      current = true;
    },
    p(ctx2, dirty) {
      const button_changes = {};
      if (dirty & /*$$scope*/
      1024) {
        button_changes.$$scope = {
          dirty,
          ctx: ctx2
        };
      }
      button.$set(button_changes);
      const treeview_changes = {};
      if (dirty & /*doc*/
      1)
        treeview_changes.data = /*doc*/
        ctx2[0];
      treeview.$set(treeview_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(button.$$.fragment, local);
      transition_in(treeview.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(button.$$.fragment, local);
      transition_out(treeview.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(div1);
      }
      destroy_component(button);
      destroy_component(treeview);
    }
  };
}
function create_default_slot$4(ctx) {
  let span;
  return {
    c() {
      span = element("span");
      attr(span, "class", "caret-icon svelte-8c7oqn");
      toggle_class(
        span,
        "expanded",
        /*expandedSelection*/
        ctx[5]
      );
    },
    m(target, anchor) {
      insert(target, span, anchor);
    },
    p(ctx2, dirty) {
      if (dirty & /*expandedSelection*/
      32) {
        toggle_class(
          span,
          "expanded",
          /*expandedSelection*/
          ctx2[5]
        );
      }
    },
    d(detaching) {
      if (detaching) {
        detach(span);
      }
    }
  };
}
function create_else_block$7(ctx) {
  let treeview;
  let current;
  treeview = new TreeView({
    props: {
      class: "tree-view",
      data: (
        /*activeMarks*/
        ctx[2]
      )
    }
  });
  return {
    c() {
      create_component(treeview.$$.fragment);
    },
    m(target, anchor) {
      mount_component(treeview, target, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      const treeview_changes = {};
      if (dirty & /*activeMarks*/
      4)
        treeview_changes.data = /*activeMarks*/
        ctx2[2];
      treeview.$set(treeview_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(treeview.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(treeview.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(treeview, detaching);
    }
  };
}
function create_if_block$8(ctx) {
  let div;
  return {
    c() {
      div = element("div");
      div.textContent = "No active marks";
      attr(div, "class", "no-marks svelte-8c7oqn");
    },
    m(target, anchor) {
      insert(target, div, anchor);
    },
    p: noop,
    i: noop,
    o: noop,
    d(detaching) {
      if (detaching) {
        detach(div);
      }
    }
  };
}
function create_right_slot$5(ctx) {
  let div3;
  let div0;
  let h20;
  let t1;
  let button;
  let t2;
  let treeview0;
  let t3;
  let div1;
  let h21;
  let t5;
  let current_block_type_index;
  let if_block;
  let t6;
  let div2;
  let h22;
  let t8;
  let treeview1;
  let current;
  button = new Button({
    props: {
      class: "selection-btn",
      $$slots: {
        default: [create_default_slot$4]
      },
      $$scope: {
        ctx
      }
    }
  });
  button.$on(
    "click",
    /*handleExpandSelection*/
    ctx[7]
  );
  treeview0 = new TreeView({
    props: {
      class: "tree-view",
      data: (
        /*selection*/
        ctx[1]
      )
    }
  });
  const if_block_creators = [create_if_block$8, create_else_block$7];
  const if_blocks = [];
  function select_block_type(ctx2, dirty) {
    if (
      /*activeMarks*/
      ctx2[2].length === 0
    )
      return 0;
    return 1;
  }
  current_block_type_index = select_block_type(ctx);
  if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
  treeview1 = new TreeView({
    props: {
      class: "tree-view",
      data: {
        nodeSize: (
          /*nodeSize*/
          ctx[3]
        ),
        childCount: (
          /*childCount*/
          ctx[4]
        )
      }
    }
  });
  return {
    c() {
      div3 = element("div");
      div0 = element("div");
      h20 = element("h2");
      h20.textContent = "Selection";
      t1 = space();
      create_component(button.$$.fragment);
      t2 = space();
      create_component(treeview0.$$.fragment);
      t3 = space();
      div1 = element("div");
      h21 = element("h2");
      h21.textContent = "Active marks";
      t5 = space();
      if_block.c();
      t6 = space();
      div2 = element("div");
      h22 = element("h2");
      h22.textContent = "Document stats";
      t8 = space();
      create_component(treeview1.$$.fragment);
      attr(div0, "class", "top-row svelte-8c7oqn");
      attr(div3, "slot", "right");
      attr(div3, "class", "right-panel svelte-8c7oqn");
    },
    m(target, anchor) {
      insert(target, div3, anchor);
      append(div3, div0);
      append(div0, h20);
      append(div0, t1);
      mount_component(button, div0, null);
      append(div3, t2);
      mount_component(treeview0, div3, null);
      append(div3, t3);
      append(div3, div1);
      append(div1, h21);
      append(div1, t5);
      if_blocks[current_block_type_index].m(div1, null);
      append(div3, t6);
      append(div3, div2);
      append(div2, h22);
      append(div2, t8);
      mount_component(treeview1, div2, null);
      current = true;
    },
    p(ctx2, dirty) {
      const button_changes = {};
      if (dirty & /*$$scope, expandedSelection*/
      1056) {
        button_changes.$$scope = {
          dirty,
          ctx: ctx2
        };
      }
      button.$set(button_changes);
      const treeview0_changes = {};
      if (dirty & /*selection*/
      2)
        treeview0_changes.data = /*selection*/
        ctx2[1];
      treeview0.$set(treeview0_changes);
      let previous_block_index = current_block_type_index;
      current_block_type_index = select_block_type(ctx2);
      if (current_block_type_index === previous_block_index) {
        if_blocks[current_block_type_index].p(ctx2, dirty);
      } else {
        group_outros();
        transition_out(if_blocks[previous_block_index], 1, 1, () => {
          if_blocks[previous_block_index] = null;
        });
        check_outros();
        if_block = if_blocks[current_block_type_index];
        if (!if_block) {
          if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx2);
          if_block.c();
        } else {
          if_block.p(ctx2, dirty);
        }
        transition_in(if_block, 1);
        if_block.m(div1, null);
      }
      const treeview1_changes = {};
      if (dirty & /*nodeSize, childCount*/
      24)
        treeview1_changes.data = {
          nodeSize: (
            /*nodeSize*/
            ctx2[3]
          ),
          childCount: (
            /*childCount*/
            ctx2[4]
          )
        };
      treeview1.$set(treeview1_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(button.$$.fragment, local);
      transition_in(treeview0.$$.fragment, local);
      transition_in(if_block);
      transition_in(treeview1.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(button.$$.fragment, local);
      transition_out(treeview0.$$.fragment, local);
      transition_out(if_block);
      transition_out(treeview1.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(div3);
      }
      destroy_component(button);
      destroy_component(treeview0);
      if_blocks[current_block_type_index].d();
      destroy_component(treeview1);
    }
  };
}
function create_fragment$d(ctx) {
  let splitview;
  let current;
  splitview = new SplitView({
    props: {
      $$slots: {
        right: [create_right_slot$5],
        left: [create_left_slot$4]
      },
      $$scope: {
        ctx
      }
    }
  });
  return {
    c() {
      create_component(splitview.$$.fragment);
    },
    m(target, anchor) {
      mount_component(splitview, target, anchor);
      current = true;
    },
    p(ctx2, _ref) {
      let [dirty] = _ref;
      const splitview_changes = {};
      if (dirty & /*$$scope, nodeSize, childCount, activeMarks, selection, expandedSelection, doc*/
      1087) {
        splitview_changes.$$scope = {
          dirty,
          ctx: ctx2
        };
      }
      splitview.$set(splitview_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(splitview.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(splitview.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(splitview, detaching);
    }
  };
}
function formatDocNodeValue(val, n) {
  if (n.type === "object" && val.type) {
    return "{} ".concat(val.type);
  }
}
function instance$d($$self, $$props, $$invalidate) {
  const {
    view
  } = getContext("editor-view");
  let doc2 = view.state.doc.toJSON();
  let selection = createSelection(view.state.selection);
  let currentState = view.state;
  let activeMarks = [];
  let nodeSize = view.state.doc.nodeSize;
  let childCount = view.state.doc.childCount;
  let expandedSelection = false;
  latestEntry.subscribe((e) => {
    if (!e)
      return;
    const {
      state: state2
    } = e;
    currentState = state2;
    $$invalidate(0, doc2 = state2.doc.toJSON());
    $$invalidate(1, selection = expandedSelection ? createFullSelection(state2.selection) : createSelection(state2.selection));
    $$invalidate(2, activeMarks = getActiveMarks(state2));
    $$invalidate(3, nodeSize = state2.doc.nodeSize);
    $$invalidate(4, childCount = state2.doc.childCount);
  });
  function handleClickLogDoc() {
    console.log(doc2);
    window._doc = doc2;
  }
  function handleExpandSelection() {
    $$invalidate(5, expandedSelection = !expandedSelection);
    if (expandedSelection) {
      $$invalidate(1, selection = createFullSelection(currentState.selection));
    } else {
      $$invalidate(1, selection = createSelection(currentState.selection));
    }
  }
  return [doc2, selection, activeMarks, nodeSize, childCount, expandedSelection, handleClickLogDoc, handleExpandSelection];
}
class StateTab extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$d, create_fragment$d, safe_not_equal, {}, add_css$d);
  }
}
function mapSelectionDeltaChildren(_val, type, _parent) {
  if (type !== "array")
    return;
  return [];
}
function mapDocDeltaChildren(delta, type) {
  if (type === "array" && delta[1] === 0 && delta[2] === 0) {
    return [];
  } else if (type === "array" && typeof delta[0] === "string" && delta[1] === 0 && delta[2] === 2) {
    return [];
  } else if (type === "array" && delta.length === 1 && typeof delta[0] === "object") {
    return [];
  }
  if (type !== "object" || delta._t !== "a")
    return;
  const transformed = [];
  for (const key in delta) {
    if (key === "_t")
      continue;
    if (key.charAt(0) === "_") {
      transformed.push([key.substr(1), delta[key]]);
    } else {
      transformed.push([key, delta[key]]);
    }
  }
  return transformed;
}
function add_css$c(target) {
  append_styles(target, "svelte-vbjxb8", '@charset "UTF-8";ul.svelte-vbjxb8.svelte-vbjxb8{color:#fff;list-style:none;margin:0;padding:0;height:100%;width:100%}li.svelte-vbjxb8.svelte-vbjxb8{transition:background 0.7s ease}li.svelte-vbjxb8.svelte-vbjxb8:hover{background:rgba(255, 162, 177, 0.4);color:#fff}li.selected.svelte-vbjxb8.svelte-vbjxb8{background:rgba(255, 162, 177, 0.4)}li.svelte-vbjxb8+li.svelte-vbjxb8{border-top:1px solid rgb(96, 76, 104)}button.svelte-vbjxb8.svelte-vbjxb8{background:transparent;border:0;color:#d3d3d9;cursor:pointer;display:flex;font-family:monospace;font-size:var(--font-medium);justify-content:space-between;padding:6px 18px;text-transform:uppercase;width:100%}button.p-left.svelte-vbjxb8.svelte-vbjxb8{margin-left:1em}.caret-icon.svelte-vbjxb8.svelte-vbjxb8::before{content:"▶"}.caret-icon.expanded.svelte-vbjxb8.svelte-vbjxb8::before{content:"▼"}');
}
function get_each_context$5(ctx, list, i) {
  const child_ctx = ctx.slice();
  child_ctx[6] = list[i];
  child_ctx[8] = i;
  return child_ctx;
}
function get_each_context_1(ctx, list, i) {
  const child_ctx = ctx.slice();
  child_ctx[9] = list[i];
  return child_ctx;
}
function create_if_block_3$3(ctx) {
  let t0;
  let t1_value = (
    /*group*/
    ctx[6].entries.length + ""
  );
  let t1;
  let t2;
  return {
    c() {
      t0 = text("[");
      t1 = text(t1_value);
      t2 = text("]");
    },
    m(target, anchor) {
      insert(target, t0, anchor);
      insert(target, t1, anchor);
      insert(target, t2, anchor);
    },
    p(ctx2, dirty) {
      if (dirty & /*listItems*/
      1 && t1_value !== (t1_value = /*group*/
      ctx2[6].entries.length + ""))
        set_data(t1, t1_value);
    },
    d(detaching) {
      if (detaching) {
        detach(t0);
        detach(t1);
        detach(t2);
      }
    }
  };
}
function create_if_block_2$4(ctx) {
  let t0;
  let t1_value = (
    /*group*/
    ctx[6].topEntry.trs.length - 1 + ""
  );
  let t1;
  return {
    c() {
      t0 = text("+");
      t1 = text(t1_value);
    },
    m(target, anchor) {
      insert(target, t0, anchor);
      insert(target, t1, anchor);
    },
    p(ctx2, dirty) {
      if (dirty & /*listItems*/
      1 && t1_value !== (t1_value = /*group*/
      ctx2[6].topEntry.trs.length - 1 + ""))
        set_data(t1, t1_value);
    },
    d(detaching) {
      if (detaching) {
        detach(t0);
        detach(t1);
      }
    }
  };
}
function create_if_block_1$5(ctx) {
  let span;
  return {
    c() {
      span = element("span");
      attr(span, "class", "caret-icon svelte-vbjxb8");
      toggle_class(
        span,
        "expanded",
        /*group*/
        ctx[6].expanded
      );
    },
    m(target, anchor) {
      insert(target, span, anchor);
    },
    p(ctx2, dirty) {
      if (dirty & /*listItems*/
      1) {
        toggle_class(
          span,
          "expanded",
          /*group*/
          ctx2[6].expanded
        );
      }
    },
    d(detaching) {
      if (detaching) {
        detach(span);
      }
    }
  };
}
function create_if_block$7(ctx) {
  let each_blocks = [];
  let each_1_lookup = /* @__PURE__ */ new Map();
  let each_1_anchor;
  let each_value_1 = ensure_array_like(
    /*group*/
    ctx[6].entries
  );
  const get_key = (ctx2) => {
    var _ctx$;
    return (
      /*subEntry*/
      (_ctx$ = ctx2[9]) === null || _ctx$ === void 0 ? void 0 : _ctx$.id
    );
  };
  for (let i = 0; i < each_value_1.length; i += 1) {
    let child_ctx = get_each_context_1(ctx, each_value_1, i);
    let key = get_key(child_ctx);
    each_1_lookup.set(key, each_blocks[i] = create_each_block_1(key, child_ctx));
  }
  return {
    c() {
      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].c();
      }
      each_1_anchor = empty();
    },
    m(target, anchor) {
      for (let i = 0; i < each_blocks.length; i += 1) {
        if (each_blocks[i]) {
          each_blocks[i].m(target, anchor);
        }
      }
      insert(target, each_1_anchor, anchor);
    },
    p(ctx2, dirty) {
      if (dirty & /*selectedId, listItems, dispatchEvent*/
      7) {
        each_value_1 = ensure_array_like(
          /*group*/
          ctx2[6].entries
        );
        each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx2, each_value_1, each_1_lookup, each_1_anchor.parentNode, destroy_block, create_each_block_1, each_1_anchor, get_each_context_1);
      }
    },
    d(detaching) {
      if (detaching) {
        detach(each_1_anchor);
      }
      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].d(detaching);
      }
    }
  };
}
function create_each_block_1(key_1, ctx) {
  var _ctx$2;
  let li;
  let button;
  let t0_value = (
    /*subEntry*/
    ((_ctx$2 = ctx[9]) === null || _ctx$2 === void 0 ? void 0 : _ctx$2.timeStr) + ""
  );
  let t0;
  let t1;
  let mounted2;
  let dispose;
  function click_handler_1() {
    return (
      /*click_handler_1*/
      ctx[5](
        /*subEntry*/
        ctx[9],
        /*groupIdx*/
        ctx[8]
      )
    );
  }
  return {
    key: key_1,
    first: null,
    c() {
      var _ctx$3;
      li = element("li");
      button = element("button");
      t0 = text(t0_value);
      t1 = space();
      attr(button, "class", "p-left svelte-vbjxb8");
      attr(li, "class", "svelte-vbjxb8");
      toggle_class(
        li,
        "selected",
        /*selectedId*/
        ctx[1] === /*subEntry*/
        ((_ctx$3 = ctx[9]) === null || _ctx$3 === void 0 ? void 0 : _ctx$3.id)
      );
      this.first = li;
    },
    m(target, anchor) {
      insert(target, li, anchor);
      append(li, button);
      append(button, t0);
      append(li, t1);
      if (!mounted2) {
        dispose = listen(button, "click", click_handler_1);
        mounted2 = true;
      }
    },
    p(new_ctx, dirty) {
      var _ctx$4;
      ctx = new_ctx;
      if (dirty & /*listItems*/
      1 && t0_value !== (t0_value = /*subEntry*/
      ((_ctx$4 = ctx[9]) === null || _ctx$4 === void 0 ? void 0 : _ctx$4.timeStr) + ""))
        set_data(t0, t0_value);
      if (dirty & /*selectedId, listItems*/
      3) {
        var _ctx$5;
        toggle_class(
          li,
          "selected",
          /*selectedId*/
          ctx[1] === /*subEntry*/
          ((_ctx$5 = ctx[9]) === null || _ctx$5 === void 0 ? void 0 : _ctx$5.id)
        );
      }
    },
    d(detaching) {
      if (detaching) {
        detach(li);
      }
      mounted2 = false;
      dispose();
    }
  };
}
function create_each_block$5(key_1, ctx) {
  var _ctx$6;
  let li;
  let button;
  let span;
  let t0_value = (
    /*group*/
    ((_ctx$6 = ctx[6]) === null || _ctx$6 === void 0 || (_ctx$6 = _ctx$6.topEntry) === null || _ctx$6 === void 0 ? void 0 : _ctx$6.timeStr) + ""
  );
  let t0;
  let t1;
  let t2;
  let t3;
  let t4;
  let if_block3_anchor;
  let mounted2;
  let dispose;
  let if_block0 = (
    /*group*/
    ctx[6].isGroup && create_if_block_3$3(ctx)
  );
  let if_block1 = (
    /*group*/
    ctx[6].topEntry && /*group*/
    ctx[6].topEntry.trs.length > 1 && create_if_block_2$4(ctx)
  );
  let if_block2 = (
    /*group*/
    ctx[6].isGroup && /*group*/
    ctx[6].entries.length > 1 && create_if_block_1$5(ctx)
  );
  function click_handler() {
    return (
      /*click_handler*/
      ctx[3](
        /*group*/
        ctx[6],
        /*groupIdx*/
        ctx[8]
      )
    );
  }
  function dblclick_handler() {
    return (
      /*dblclick_handler*/
      ctx[4](
        /*group*/
        ctx[6]
      )
    );
  }
  let if_block3 = (
    /*group*/
    ctx[6].isGroup && /*group*/
    ctx[6].expanded && create_if_block$7(ctx)
  );
  return {
    key: key_1,
    first: null,
    c() {
      var _ctx$7;
      li = element("li");
      button = element("button");
      span = element("span");
      t0 = text(t0_value);
      t1 = space();
      if (if_block0)
        if_block0.c();
      t2 = space();
      if (if_block1)
        if_block1.c();
      t3 = space();
      if (if_block2)
        if_block2.c();
      t4 = space();
      if (if_block3)
        if_block3.c();
      if_block3_anchor = empty();
      attr(button, "class", "svelte-vbjxb8");
      toggle_class(
        button,
        "is-group",
        /*group*/
        ctx[6].isGroup
      );
      attr(li, "class", "svelte-vbjxb8");
      toggle_class(li, "selected", !/*group*/
      ctx[6].expanded && /*selectedId*/
      ctx[1] === /*group*/
      ((_ctx$7 = ctx[6]) === null || _ctx$7 === void 0 || (_ctx$7 = _ctx$7.topEntry) === null || _ctx$7 === void 0 ? void 0 : _ctx$7.id));
      this.first = li;
    },
    m(target, anchor) {
      insert(target, li, anchor);
      append(li, button);
      append(button, span);
      append(span, t0);
      append(span, t1);
      if (if_block0)
        if_block0.m(span, null);
      append(span, t2);
      if (if_block1)
        if_block1.m(span, null);
      append(button, t3);
      if (if_block2)
        if_block2.m(button, null);
      insert(target, t4, anchor);
      if (if_block3)
        if_block3.m(target, anchor);
      insert(target, if_block3_anchor, anchor);
      if (!mounted2) {
        dispose = [listen(button, "click", click_handler), listen(button, "dblclick", dblclick_handler)];
        mounted2 = true;
      }
    },
    p(new_ctx, dirty) {
      var _ctx$8;
      ctx = new_ctx;
      if (dirty & /*listItems*/
      1 && t0_value !== (t0_value = /*group*/
      ((_ctx$8 = ctx[6]) === null || _ctx$8 === void 0 || (_ctx$8 = _ctx$8.topEntry) === null || _ctx$8 === void 0 ? void 0 : _ctx$8.timeStr) + ""))
        set_data(t0, t0_value);
      if (
        /*group*/
        ctx[6].isGroup
      ) {
        if (if_block0) {
          if_block0.p(ctx, dirty);
        } else {
          if_block0 = create_if_block_3$3(ctx);
          if_block0.c();
          if_block0.m(span, t2);
        }
      } else if (if_block0) {
        if_block0.d(1);
        if_block0 = null;
      }
      if (
        /*group*/
        ctx[6].topEntry && /*group*/
        ctx[6].topEntry.trs.length > 1
      ) {
        if (if_block1) {
          if_block1.p(ctx, dirty);
        } else {
          if_block1 = create_if_block_2$4(ctx);
          if_block1.c();
          if_block1.m(span, null);
        }
      } else if (if_block1) {
        if_block1.d(1);
        if_block1 = null;
      }
      if (
        /*group*/
        ctx[6].isGroup && /*group*/
        ctx[6].entries.length > 1
      ) {
        if (if_block2) {
          if_block2.p(ctx, dirty);
        } else {
          if_block2 = create_if_block_1$5(ctx);
          if_block2.c();
          if_block2.m(button, null);
        }
      } else if (if_block2) {
        if_block2.d(1);
        if_block2 = null;
      }
      if (dirty & /*listItems*/
      1) {
        toggle_class(
          button,
          "is-group",
          /*group*/
          ctx[6].isGroup
        );
      }
      if (dirty & /*listItems, selectedId*/
      3) {
        var _ctx$9;
        toggle_class(li, "selected", !/*group*/
        ctx[6].expanded && /*selectedId*/
        ctx[1] === /*group*/
        ((_ctx$9 = ctx[6]) === null || _ctx$9 === void 0 || (_ctx$9 = _ctx$9.topEntry) === null || _ctx$9 === void 0 ? void 0 : _ctx$9.id));
      }
      if (
        /*group*/
        ctx[6].isGroup && /*group*/
        ctx[6].expanded
      ) {
        if (if_block3) {
          if_block3.p(ctx, dirty);
        } else {
          if_block3 = create_if_block$7(ctx);
          if_block3.c();
          if_block3.m(if_block3_anchor.parentNode, if_block3_anchor);
        }
      } else if (if_block3) {
        if_block3.d(1);
        if_block3 = null;
      }
    },
    d(detaching) {
      if (detaching) {
        detach(li);
        detach(t4);
        detach(if_block3_anchor);
      }
      if (if_block0)
        if_block0.d();
      if (if_block1)
        if_block1.d();
      if (if_block2)
        if_block2.d();
      if (if_block3)
        if_block3.d(detaching);
      mounted2 = false;
      run_all(dispose);
    }
  };
}
function create_fragment$c(ctx) {
  let ul;
  let each_blocks = [];
  let each_1_lookup = /* @__PURE__ */ new Map();
  let each_value = ensure_array_like(
    /*listItems*/
    ctx[0]
  );
  const get_key = (ctx2) => (
    /*group*/
    ctx2[6].id
  );
  for (let i = 0; i < each_value.length; i += 1) {
    let child_ctx = get_each_context$5(ctx, each_value, i);
    let key = get_key(child_ctx);
    each_1_lookup.set(key, each_blocks[i] = create_each_block$5(key, child_ctx));
  }
  return {
    c() {
      ul = element("ul");
      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].c();
      }
      attr(ul, "class", "svelte-vbjxb8");
    },
    m(target, anchor) {
      insert(target, ul, anchor);
      for (let i = 0; i < each_blocks.length; i += 1) {
        if (each_blocks[i]) {
          each_blocks[i].m(ul, null);
        }
      }
    },
    p(ctx2, _ref) {
      let [dirty] = _ref;
      if (dirty & /*listItems, selectedId, dispatchEvent*/
      7) {
        each_value = ensure_array_like(
          /*listItems*/
          ctx2[0]
        );
        each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx2, each_value, each_1_lookup, ul, destroy_block, create_each_block$5, null, get_each_context$5);
      }
    },
    i: noop,
    o: noop,
    d(detaching) {
      if (detaching) {
        detach(ul);
      }
      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].d();
      }
    }
  };
}
function instance$c($$self, $$props, $$invalidate) {
  let {
    listItems = [],
    selectedId
  } = $$props;
  const dispatchEvent = createEventDispatcher();
  const click_handler = (group, groupIdx) => {
    var _group$topEntry;
    return dispatchEvent("click-item", {
      id: group === null || group === void 0 || (_group$topEntry = group.topEntry) === null || _group$topEntry === void 0 ? void 0 : _group$topEntry.id,
      groupIdx,
      wasTopNode: true
    });
  };
  const dblclick_handler = (group) => {
    var _group$topEntry2;
    return dispatchEvent("dblclick-item", {
      id: group === null || group === void 0 || (_group$topEntry2 = group.topEntry) === null || _group$topEntry2 === void 0 ? void 0 : _group$topEntry2.id
    });
  };
  const click_handler_1 = (subEntry, groupIdx) => dispatchEvent("click-item", {
    id: subEntry === null || subEntry === void 0 ? void 0 : subEntry.id,
    groupIdx,
    wasTopNode: false
  });
  $$self.$$set = ($$props2) => {
    if ("listItems" in $$props2)
      $$invalidate(0, listItems = $$props2.listItems);
    if ("selectedId" in $$props2)
      $$invalidate(1, selectedId = $$props2.selectedId);
  };
  return [listItems, selectedId, dispatchEvent, click_handler, dblclick_handler, click_handler_1];
}
class HistoryList extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$c, create_fragment$c, safe_not_equal, {
      listItems: 0,
      selectedId: 1
    }, add_css$c);
  }
}
function add_css$b(target) {
  append_styles(target, "svelte-1a1oqej", ".added.svelte-1a1oqej.svelte-1a1oqej{display:inline-block;background:#87cc86;border-radius:1px;color:green;padding:1px 2px;text-indent:0;min-height:1ex}.deleted.svelte-1a1oqej.svelte-1a1oqej{display:inline-block;background:#d66363;border-radius:1px;color:#222;padding:1px 2px;text-decoration:line-through;text-indent:0;min-height:1ex}.updated.svelte-1a1oqej.svelte-1a1oqej{word-break:break-all}.updated.svelte-1a1oqej .added.svelte-1a1oqej{background:#eaea37}.arrow.svelte-1a1oqej.svelte-1a1oqej{color:#87cc86}");
}
function get_each_context$4(ctx, list, i) {
  const child_ctx = ctx.slice();
  child_ctx[3] = list[i];
  return child_ctx;
}
function create_else_block_1$1(ctx) {
  let t_value = (
    /*defaultFormatter*/
    ctx[0](
      /*value*/
      ctx[1]
    ) + ""
  );
  let t;
  return {
    c() {
      t = text(t_value);
    },
    m(target, anchor) {
      insert(target, t, anchor);
    },
    p(ctx2, dirty) {
      if (dirty & /*defaultFormatter, value*/
      3 && t_value !== (t_value = /*defaultFormatter*/
      ctx2[0](
        /*value*/
        ctx2[1]
      ) + ""))
        set_data(t, t_value);
    },
    d(detaching) {
      if (detaching) {
        detach(t);
      }
    }
  };
}
function create_if_block$6(ctx) {
  let if_block_anchor;
  function select_block_type_1(ctx2, dirty) {
    if (
      /*value*/
      ctx2[1].length === 1
    )
      return create_if_block_1$4;
    if (
      /*value*/
      ctx2[1].length === 2
    )
      return create_if_block_2$3;
    if (
      /*value*/
      ctx2[1].length === 3 && /*value*/
      ctx2[1][1] === 0 && /*value*/
      ctx2[1][2] === 0
    )
      return create_if_block_3$2;
    if (
      /*value*/
      ctx2[1].length === 3 && /*value*/
      ctx2[1][2] === 2
    )
      return create_if_block_4$2;
  }
  let current_block_type = select_block_type_1(ctx);
  let if_block = current_block_type && current_block_type(ctx);
  return {
    c() {
      if (if_block)
        if_block.c();
      if_block_anchor = empty();
    },
    m(target, anchor) {
      if (if_block)
        if_block.m(target, anchor);
      insert(target, if_block_anchor, anchor);
    },
    p(ctx2, dirty) {
      if (current_block_type === (current_block_type = select_block_type_1(ctx2)) && if_block) {
        if_block.p(ctx2, dirty);
      } else {
        if (if_block)
          if_block.d(1);
        if_block = current_block_type && current_block_type(ctx2);
        if (if_block) {
          if_block.c();
          if_block.m(if_block_anchor.parentNode, if_block_anchor);
        }
      }
    },
    d(detaching) {
      if (detaching) {
        detach(if_block_anchor);
      }
      if (if_block) {
        if_block.d(detaching);
      }
    }
  };
}
function create_if_block_4$2(ctx) {
  let span;
  let each_value = ensure_array_like(parseTextDiff(
    /*value*/
    ctx[1][0]
  ));
  let each_blocks = [];
  for (let i = 0; i < each_value.length; i += 1) {
    each_blocks[i] = create_each_block$4(get_each_context$4(ctx, each_value, i));
  }
  return {
    c() {
      span = element("span");
      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].c();
      }
      attr(span, "class", "updated svelte-1a1oqej");
    },
    m(target, anchor) {
      insert(target, span, anchor);
      for (let i = 0; i < each_blocks.length; i += 1) {
        if (each_blocks[i]) {
          each_blocks[i].m(span, null);
        }
      }
    },
    p(ctx2, dirty) {
      if (dirty & /*parseTextDiff, value*/
      2) {
        each_value = ensure_array_like(parseTextDiff(
          /*value*/
          ctx2[1][0]
        ));
        let i;
        for (i = 0; i < each_value.length; i += 1) {
          const child_ctx = get_each_context$4(ctx2, each_value, i);
          if (each_blocks[i]) {
            each_blocks[i].p(child_ctx, dirty);
          } else {
            each_blocks[i] = create_each_block$4(child_ctx);
            each_blocks[i].c();
            each_blocks[i].m(span, null);
          }
        }
        for (; i < each_blocks.length; i += 1) {
          each_blocks[i].d(1);
        }
        each_blocks.length = each_value.length;
      }
    },
    d(detaching) {
      if (detaching) {
        detach(span);
      }
      destroy_each(each_blocks, detaching);
    }
  };
}
function create_if_block_3$2(ctx) {
  let span;
  let t_value = getValueString(
    /*value*/
    ctx[1][0]
  ) + "";
  let t;
  return {
    c() {
      span = element("span");
      t = text(t_value);
      attr(span, "class", "deleted svelte-1a1oqej");
    },
    m(target, anchor) {
      insert(target, span, anchor);
      append(span, t);
    },
    p(ctx2, dirty) {
      if (dirty & /*value*/
      2 && t_value !== (t_value = getValueString(
        /*value*/
        ctx2[1][0]
      ) + ""))
        set_data(t, t_value);
    },
    d(detaching) {
      if (detaching) {
        detach(span);
      }
    }
  };
}
function create_if_block_2$3(ctx) {
  let span3;
  let span0;
  let t0_value = getValueString(
    /*value*/
    ctx[1][0]
  ) + "";
  let t0;
  let t1;
  let span1;
  let t3;
  let span2;
  let t4_value = getValueString(
    /*value*/
    ctx[1][1]
  ) + "";
  let t4;
  return {
    c() {
      span3 = element("span");
      span0 = element("span");
      t0 = text(t0_value);
      t1 = space();
      span1 = element("span");
      span1.textContent = "=>";
      t3 = space();
      span2 = element("span");
      t4 = text(t4_value);
      attr(span0, "class", "deleted svelte-1a1oqej");
      attr(span1, "class", "arrow svelte-1a1oqej");
      attr(span2, "class", "added svelte-1a1oqej");
      attr(span3, "class", "updated svelte-1a1oqej");
    },
    m(target, anchor) {
      insert(target, span3, anchor);
      append(span3, span0);
      append(span0, t0);
      append(span3, t1);
      append(span3, span1);
      append(span3, t3);
      append(span3, span2);
      append(span2, t4);
    },
    p(ctx2, dirty) {
      if (dirty & /*value*/
      2 && t0_value !== (t0_value = getValueString(
        /*value*/
        ctx2[1][0]
      ) + ""))
        set_data(t0, t0_value);
      if (dirty & /*value*/
      2 && t4_value !== (t4_value = getValueString(
        /*value*/
        ctx2[1][1]
      ) + ""))
        set_data(t4, t4_value);
    },
    d(detaching) {
      if (detaching) {
        detach(span3);
      }
    }
  };
}
function create_if_block_1$4(ctx) {
  let span;
  let t_value = getValueString(
    /*value*/
    ctx[1][0]
  ) + "";
  let t;
  return {
    c() {
      span = element("span");
      t = text(t_value);
      attr(span, "class", "added svelte-1a1oqej");
    },
    m(target, anchor) {
      insert(target, span, anchor);
      append(span, t);
    },
    p(ctx2, dirty) {
      if (dirty & /*value*/
      2 && t_value !== (t_value = getValueString(
        /*value*/
        ctx2[1][0]
      ) + ""))
        set_data(t, t_value);
    },
    d(detaching) {
      if (detaching) {
        detach(span);
      }
    }
  };
}
function create_else_block$6(ctx) {
  let span;
  let t_value = (
    /*item*/
    ctx[3].raw + ""
  );
  let t;
  return {
    c() {
      span = element("span");
      t = text(t_value);
    },
    m(target, anchor) {
      insert(target, span, anchor);
      append(span, t);
    },
    p(ctx2, dirty) {
      if (dirty & /*value*/
      2 && t_value !== (t_value = /*item*/
      ctx2[3].raw + ""))
        set_data(t, t_value);
    },
    d(detaching) {
      if (detaching) {
        detach(span);
      }
    }
  };
}
function create_if_block_6(ctx) {
  let span;
  let t_value = (
    /*item*/
    ctx[3].add + ""
  );
  let t;
  return {
    c() {
      span = element("span");
      t = text(t_value);
      attr(span, "class", "added svelte-1a1oqej");
    },
    m(target, anchor) {
      insert(target, span, anchor);
      append(span, t);
    },
    p(ctx2, dirty) {
      if (dirty & /*value*/
      2 && t_value !== (t_value = /*item*/
      ctx2[3].add + ""))
        set_data(t, t_value);
    },
    d(detaching) {
      if (detaching) {
        detach(span);
      }
    }
  };
}
function create_if_block_5$2(ctx) {
  let span;
  let t_value = (
    /*item*/
    ctx[3].delete + ""
  );
  let t;
  return {
    c() {
      span = element("span");
      t = text(t_value);
      attr(span, "class", "deleted svelte-1a1oqej");
    },
    m(target, anchor) {
      insert(target, span, anchor);
      append(span, t);
    },
    p(ctx2, dirty) {
      if (dirty & /*value*/
      2 && t_value !== (t_value = /*item*/
      ctx2[3].delete + ""))
        set_data(t, t_value);
    },
    d(detaching) {
      if (detaching) {
        detach(span);
      }
    }
  };
}
function create_each_block$4(ctx) {
  let if_block_anchor;
  function select_block_type_2(ctx2, dirty) {
    if (
      /*item*/
      ctx2[3].delete
    )
      return create_if_block_5$2;
    if (
      /*item*/
      ctx2[3].add
    )
      return create_if_block_6;
    return create_else_block$6;
  }
  let current_block_type = select_block_type_2(ctx);
  let if_block = current_block_type(ctx);
  return {
    c() {
      if_block.c();
      if_block_anchor = empty();
    },
    m(target, anchor) {
      if_block.m(target, anchor);
      insert(target, if_block_anchor, anchor);
    },
    p(ctx2, dirty) {
      if (current_block_type === (current_block_type = select_block_type_2(ctx2)) && if_block) {
        if_block.p(ctx2, dirty);
      } else {
        if_block.d(1);
        if_block = current_block_type(ctx2);
        if (if_block) {
          if_block.c();
          if_block.m(if_block_anchor.parentNode, if_block_anchor);
        }
      }
    },
    d(detaching) {
      if (detaching) {
        detach(if_block_anchor);
      }
      if_block.d(detaching);
    }
  };
}
function create_fragment$b(ctx) {
  let show_if;
  let if_block_anchor;
  function select_block_type(ctx2, dirty) {
    if (dirty & /*value*/
    2)
      show_if = null;
    if (show_if == null)
      show_if = !!Array.isArray(
        /*value*/
        ctx2[1]
      );
    if (show_if)
      return create_if_block$6;
    return create_else_block_1$1;
  }
  let current_block_type = select_block_type(ctx, -1);
  let if_block = current_block_type(ctx);
  return {
    c() {
      if_block.c();
      if_block_anchor = empty();
    },
    m(target, anchor) {
      if_block.m(target, anchor);
      insert(target, if_block_anchor, anchor);
    },
    p(ctx2, _ref) {
      let [dirty] = _ref;
      if (current_block_type === (current_block_type = select_block_type(ctx2, dirty)) && if_block) {
        if_block.p(ctx2, dirty);
      } else {
        if_block.d(1);
        if_block = current_block_type(ctx2);
        if (if_block) {
          if_block.c();
          if_block.m(if_block_anchor.parentNode, if_block_anchor);
        }
      }
    },
    i: noop,
    o: noop,
    d(detaching) {
      if (detaching) {
        detach(if_block_anchor);
      }
      if_block.d(detaching);
    }
  };
}
function replaceSpacesWithNonBreakingSpace(str) {
  return str.replace(/\s/gm, " ");
}
function parseTextDiff(textDiff) {
  const diffByLines = textDiff.split(/\n/gm).slice(1);
  return diffByLines.map((line) => {
    const type = line.startsWith("-") ? "delete" : line.startsWith("+") ? "add" : "raw";
    return {
      [type]: replaceSpacesWithNonBreakingSpace(line.slice(1))
    };
  });
}
function stringifyAndShrink(v) {
  if (v === null) {
    return "null";
  }
  const str = JSON.stringify(v);
  if (typeof str === "undefined") {
    return "undefined";
  }
  return str.length > 22 ? "".concat(str.slice(0, 15), "…").concat(str.slice(-5)) : str;
}
function getValueString(raw) {
  if (typeof raw === "string") {
    return raw;
  }
  return stringifyAndShrink(raw);
}
function instance$b($$self, $$props, $$invalidate) {
  let value;
  let {
    node,
    defaultFormatter
  } = $$props;
  $$self.$$set = ($$props2) => {
    if ("node" in $$props2)
      $$invalidate(2, node = $$props2.node);
    if ("defaultFormatter" in $$props2)
      $$invalidate(0, defaultFormatter = $$props2.defaultFormatter);
  };
  $$self.$$.update = () => {
    if ($$self.$$.dirty & /*node*/
    4) {
      $$invalidate(1, value = node.value);
    }
  };
  return [defaultFormatter, value, node];
}
class DiffValue extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$b, create_fragment$b, safe_not_equal, {
      node: 2,
      defaultFormatter: 0
    }, add_css$b);
  }
}
function add_css$a(target) {
  append_styles(target, "svelte-r7zw98", ".left-panel.svelte-r7zw98.svelte-r7zw98{flex-grow:0;padding:0;min-width:190px;width:190px}.title-container.svelte-r7zw98.svelte-r7zw98{align-items:center;display:flex}.transaction-buttons.svelte-r7zw98.svelte-r7zw98{margin-left:2rem}.entry-row.svelte-r7zw98+.entry-row.svelte-r7zw98{margin-top:1em}.selection-html.svelte-r7zw98.svelte-r7zw98{font-weight:100;margin:0.5em 0 0 0;padding:0}.equal-diff.svelte-r7zw98.svelte-r7zw98{align-items:center;color:rgb(255, 162, 177);display:flex;font-size:14px;height:100%;justify-content:center;width:100%}");
}
function get_each_context$3(ctx, list, i) {
  const child_ctx = ctx.slice();
  child_ctx[13] = list[i];
  return child_ctx;
}
function create_left_slot$3(ctx) {
  var _ctx$;
  let div;
  let historylist;
  let current;
  historylist = new HistoryList({
    props: {
      listItems: (
        /*listItems*/
        ctx[4]
      ),
      selectedId: (
        /*selectedEntry*/
        ((_ctx$ = ctx[0]) === null || _ctx$ === void 0 ? void 0 : _ctx$.id) || ""
      )
    }
  });
  historylist.$on(
    "click-item",
    /*handleEntrySelect*/
    ctx[7]
  );
  historylist.$on(
    "dblclick-item",
    /*handleEntryDblClick*/
    ctx[8]
  );
  return {
    c() {
      div = element("div");
      create_component(historylist.$$.fragment);
      attr(div, "slot", "left");
      attr(div, "class", "left-panel svelte-r7zw98");
    },
    m(target, anchor) {
      insert(target, div, anchor);
      mount_component(historylist, div, null);
      current = true;
    },
    p(ctx2, dirty) {
      var _ctx$2;
      const historylist_changes = {};
      if (dirty & /*listItems*/
      16)
        historylist_changes.listItems = /*listItems*/
        ctx2[4];
      if (dirty & /*selectedEntry*/
      1)
        historylist_changes.selectedId = /*selectedEntry*/
        ((_ctx$2 = ctx2[0]) === null || _ctx$2 === void 0 ? void 0 : _ctx$2.id) || "";
      historylist.$set(historylist_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(historylist.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(historylist.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(div);
      }
      destroy_component(historylist);
    }
  };
}
function create_else_block$5(ctx) {
  let div;
  return {
    c() {
      div = element("div");
      div.textContent = "Docs are equal.";
      attr(div, "class", "equal-diff svelte-r7zw98");
    },
    m(target, anchor) {
      insert(target, div, anchor);
    },
    p: noop,
    i: noop,
    o: noop,
    d(detaching) {
      if (detaching) {
        detach(div);
      }
    }
  };
}
function create_if_block$5(ctx) {
  let div3;
  let t0;
  let t1;
  let t2;
  let div2;
  let div1;
  let h2;
  let t4;
  let div0;
  let t5;
  let button;
  let t6;
  let current;
  let if_block0 = (
    /*selectedEntry*/
    ctx[0].contentDiff && create_if_block_5$1(ctx)
  );
  let if_block1 = (
    /*selectedEntry*/
    ctx[0].selectionDiff && create_if_block_4$1(ctx)
  );
  let if_block2 = (
    /*selectedEntry*/
    ctx[0].selectionHtml.length > 0 && create_if_block_3$1(ctx)
  );
  let if_block3 = (
    /*showTr*/
    ctx[1] && create_if_block_2$2(ctx)
  );
  button = new Button({
    props: {
      $$slots: {
        default: [create_default_slot$3]
      },
      $$scope: {
        ctx
      }
    }
  });
  button.$on(
    "click",
    /*toggleShowTr*/
    ctx[5]
  );
  let if_block4 = (
    /*showTr*/
    ctx[1] && create_if_block_1$3(ctx)
  );
  return {
    c() {
      div3 = element("div");
      if (if_block0)
        if_block0.c();
      t0 = space();
      if (if_block1)
        if_block1.c();
      t1 = space();
      if (if_block2)
        if_block2.c();
      t2 = space();
      div2 = element("div");
      div1 = element("div");
      h2 = element("h2");
      h2.textContent = "Transactions";
      t4 = space();
      div0 = element("div");
      if (if_block3)
        if_block3.c();
      t5 = space();
      create_component(button.$$.fragment);
      t6 = space();
      if (if_block4)
        if_block4.c();
      attr(div0, "class", "transaction-buttons svelte-r7zw98");
      attr(div1, "class", "title-container svelte-r7zw98");
      attr(div2, "class", "entry-row svelte-r7zw98");
    },
    m(target, anchor) {
      insert(target, div3, anchor);
      if (if_block0)
        if_block0.m(div3, null);
      append(div3, t0);
      if (if_block1)
        if_block1.m(div3, null);
      append(div3, t1);
      if (if_block2)
        if_block2.m(div3, null);
      append(div3, t2);
      append(div3, div2);
      append(div2, div1);
      append(div1, h2);
      append(div1, t4);
      append(div1, div0);
      if (if_block3)
        if_block3.m(div0, null);
      append(div0, t5);
      mount_component(button, div0, null);
      append(div2, t6);
      if (if_block4)
        if_block4.m(div2, null);
      current = true;
    },
    p(ctx2, dirty) {
      if (
        /*selectedEntry*/
        ctx2[0].contentDiff
      ) {
        if (if_block0) {
          if_block0.p(ctx2, dirty);
          if (dirty & /*selectedEntry*/
          1) {
            transition_in(if_block0, 1);
          }
        } else {
          if_block0 = create_if_block_5$1(ctx2);
          if_block0.c();
          transition_in(if_block0, 1);
          if_block0.m(div3, t0);
        }
      } else if (if_block0) {
        group_outros();
        transition_out(if_block0, 1, 1, () => {
          if_block0 = null;
        });
        check_outros();
      }
      if (
        /*selectedEntry*/
        ctx2[0].selectionDiff
      ) {
        if (if_block1) {
          if_block1.p(ctx2, dirty);
          if (dirty & /*selectedEntry*/
          1) {
            transition_in(if_block1, 1);
          }
        } else {
          if_block1 = create_if_block_4$1(ctx2);
          if_block1.c();
          transition_in(if_block1, 1);
          if_block1.m(div3, t1);
        }
      } else if (if_block1) {
        group_outros();
        transition_out(if_block1, 1, 1, () => {
          if_block1 = null;
        });
        check_outros();
      }
      if (
        /*selectedEntry*/
        ctx2[0].selectionHtml.length > 0
      ) {
        if (if_block2) {
          if_block2.p(ctx2, dirty);
          if (dirty & /*selectedEntry*/
          1) {
            transition_in(if_block2, 1);
          }
        } else {
          if_block2 = create_if_block_3$1(ctx2);
          if_block2.c();
          transition_in(if_block2, 1);
          if_block2.m(div3, t2);
        }
      } else if (if_block2) {
        group_outros();
        transition_out(if_block2, 1, 1, () => {
          if_block2 = null;
        });
        check_outros();
      }
      if (
        /*showTr*/
        ctx2[1]
      ) {
        if (if_block3) {
          if_block3.p(ctx2, dirty);
          if (dirty & /*showTr*/
          2) {
            transition_in(if_block3, 1);
          }
        } else {
          if_block3 = create_if_block_2$2(ctx2);
          if_block3.c();
          transition_in(if_block3, 1);
          if_block3.m(div0, t5);
        }
      } else if (if_block3) {
        group_outros();
        transition_out(if_block3, 1, 1, () => {
          if_block3 = null;
        });
        check_outros();
      }
      const button_changes = {};
      if (dirty & /*$$scope, showTr*/
      65538) {
        button_changes.$$scope = {
          dirty,
          ctx: ctx2
        };
      }
      button.$set(button_changes);
      if (
        /*showTr*/
        ctx2[1]
      ) {
        if (if_block4) {
          if_block4.p(ctx2, dirty);
          if (dirty & /*showTr*/
          2) {
            transition_in(if_block4, 1);
          }
        } else {
          if_block4 = create_if_block_1$3(ctx2);
          if_block4.c();
          transition_in(if_block4, 1);
          if_block4.m(div2, null);
        }
      } else if (if_block4) {
        group_outros();
        transition_out(if_block4, 1, 1, () => {
          if_block4 = null;
        });
        check_outros();
      }
    },
    i(local) {
      if (current)
        return;
      transition_in(if_block0);
      transition_in(if_block1);
      transition_in(if_block2);
      transition_in(if_block3);
      transition_in(button.$$.fragment, local);
      transition_in(if_block4);
      current = true;
    },
    o(local) {
      transition_out(if_block0);
      transition_out(if_block1);
      transition_out(if_block2);
      transition_out(if_block3);
      transition_out(button.$$.fragment, local);
      transition_out(if_block4);
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(div3);
      }
      if (if_block0)
        if_block0.d();
      if (if_block1)
        if_block1.d();
      if (if_block2)
        if_block2.d();
      if (if_block3)
        if_block3.d();
      destroy_component(button);
      if (if_block4)
        if_block4.d();
    }
  };
}
function create_if_block_5$1(ctx) {
  let div1;
  let div0;
  let h2;
  let t1;
  let button;
  let t2;
  let treeview;
  let current;
  button = new Button({
    props: {
      class: "hidden",
      $$slots: {
        default: [create_default_slot_5]
      },
      $$scope: {
        ctx
      }
    }
  });
  treeview = new TreeView({
    props: {
      class: "tree-view",
      data: (
        /*selectedEntry*/
        ctx[0].contentDiff
      ),
      showLogButton: true,
      showCopyButton: true,
      valueComponent: DiffValue,
      recursionOpts: {
        maxDepth: 12,
        mapChildren: mapDocDeltaChildren,
        shouldExpandNode: func$1
      }
    }
  });
  return {
    c() {
      div1 = element("div");
      div0 = element("div");
      h2 = element("h2");
      h2.textContent = "Doc diff";
      t1 = space();
      create_component(button.$$.fragment);
      t2 = space();
      create_component(treeview.$$.fragment);
      attr(div0, "class", "title-container svelte-r7zw98");
      attr(div1, "class", "entry-row svelte-r7zw98");
    },
    m(target, anchor) {
      insert(target, div1, anchor);
      append(div1, div0);
      append(div0, h2);
      append(div0, t1);
      mount_component(button, div0, null);
      append(div1, t2);
      mount_component(treeview, div1, null);
      current = true;
    },
    p(ctx2, dirty) {
      const button_changes = {};
      if (dirty & /*$$scope*/
      65536) {
        button_changes.$$scope = {
          dirty,
          ctx: ctx2
        };
      }
      button.$set(button_changes);
      const treeview_changes = {};
      if (dirty & /*selectedEntry*/
      1)
        treeview_changes.data = /*selectedEntry*/
        ctx2[0].contentDiff;
      treeview.$set(treeview_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(button.$$.fragment, local);
      transition_in(treeview.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(button.$$.fragment, local);
      transition_out(treeview.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(div1);
      }
      destroy_component(button);
      destroy_component(treeview);
    }
  };
}
function create_default_slot_5(ctx) {
  let t;
  return {
    c() {
      t = text("log");
    },
    m(target, anchor) {
      insert(target, t, anchor);
    },
    d(detaching) {
      if (detaching) {
        detach(t);
      }
    }
  };
}
function create_if_block_4$1(ctx) {
  let div1;
  let div0;
  let h2;
  let t1;
  let button;
  let t2;
  let treeview;
  let current;
  button = new Button({
    props: {
      class: "hidden",
      $$slots: {
        default: [create_default_slot_4]
      },
      $$scope: {
        ctx
      }
    }
  });
  treeview = new TreeView({
    props: {
      class: "tree-view",
      data: (
        /*selectedEntry*/
        ctx[0].selectionDiff
      ),
      valueComponent: DiffValue,
      recursionOpts: {
        mapChildren: mapSelectionDeltaChildren,
        shouldExpandNode: func_1
      }
    }
  });
  return {
    c() {
      div1 = element("div");
      div0 = element("div");
      h2 = element("h2");
      h2.textContent = "Selection diff";
      t1 = space();
      create_component(button.$$.fragment);
      t2 = space();
      create_component(treeview.$$.fragment);
      attr(div0, "class", "title-container svelte-r7zw98");
      attr(div1, "class", "entry-row svelte-r7zw98");
    },
    m(target, anchor) {
      insert(target, div1, anchor);
      append(div1, div0);
      append(div0, h2);
      append(div0, t1);
      mount_component(button, div0, null);
      append(div1, t2);
      mount_component(treeview, div1, null);
      current = true;
    },
    p(ctx2, dirty) {
      const button_changes = {};
      if (dirty & /*$$scope*/
      65536) {
        button_changes.$$scope = {
          dirty,
          ctx: ctx2
        };
      }
      button.$set(button_changes);
      const treeview_changes = {};
      if (dirty & /*selectedEntry*/
      1)
        treeview_changes.data = /*selectedEntry*/
        ctx2[0].selectionDiff;
      treeview.$set(treeview_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(button.$$.fragment, local);
      transition_in(treeview.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(button.$$.fragment, local);
      transition_out(treeview.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(div1);
      }
      destroy_component(button);
      destroy_component(treeview);
    }
  };
}
function create_default_slot_4(ctx) {
  let t;
  return {
    c() {
      t = text("log");
    },
    m(target, anchor) {
      insert(target, t, anchor);
    },
    d(detaching) {
      if (detaching) {
        detach(t);
      }
    }
  };
}
function create_if_block_3$1(ctx) {
  let div1;
  let div0;
  let h2;
  let t1;
  let button;
  let t2;
  let pre;
  let code;
  let raw_value = (
    /*selectedEntry*/
    ctx[0].selectionHtml + ""
  );
  let current;
  button = new Button({
    props: {
      class: "hidden",
      $$slots: {
        default: [create_default_slot_3]
      },
      $$scope: {
        ctx
      }
    }
  });
  return {
    c() {
      div1 = element("div");
      div0 = element("div");
      h2 = element("h2");
      h2.textContent = "Selection content";
      t1 = space();
      create_component(button.$$.fragment);
      t2 = space();
      pre = element("pre");
      code = element("code");
      attr(div0, "class", "title-container svelte-r7zw98");
      attr(pre, "class", "selection-html svelte-r7zw98");
      attr(div1, "class", "entry-row svelte-r7zw98");
    },
    m(target, anchor) {
      insert(target, div1, anchor);
      append(div1, div0);
      append(div0, h2);
      append(div0, t1);
      mount_component(button, div0, null);
      append(div1, t2);
      append(div1, pre);
      append(pre, code);
      code.innerHTML = raw_value;
      current = true;
    },
    p(ctx2, dirty) {
      const button_changes = {};
      if (dirty & /*$$scope*/
      65536) {
        button_changes.$$scope = {
          dirty,
          ctx: ctx2
        };
      }
      button.$set(button_changes);
      if ((!current || dirty & /*selectedEntry*/
      1) && raw_value !== (raw_value = /*selectedEntry*/
      ctx2[0].selectionHtml + ""))
        code.innerHTML = raw_value;
    },
    i(local) {
      if (current)
        return;
      transition_in(button.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(button.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(div1);
      }
      destroy_component(button);
    }
  };
}
function create_default_slot_3(ctx) {
  let t;
  return {
    c() {
      t = text("log");
    },
    m(target, anchor) {
      insert(target, t, anchor);
    },
    d(detaching) {
      if (detaching) {
        detach(t);
      }
    }
  };
}
function create_if_block_2$2(ctx) {
  let button0;
  let t;
  let button1;
  let current;
  button0 = new Button({
    props: {
      $$slots: {
        default: [create_default_slot_2]
      },
      $$scope: {
        ctx
      }
    }
  });
  button0.$on(
    "click",
    /*handleToggleExpandTrTreeView*/
    ctx[9]
  );
  button1 = new Button({
    props: {
      $$slots: {
        default: [create_default_slot_1$3]
      },
      $$scope: {
        ctx
      }
    }
  });
  button1.$on(
    "click",
    /*handleLogTr*/
    ctx[6]
  );
  return {
    c() {
      create_component(button0.$$.fragment);
      t = space();
      create_component(button1.$$.fragment);
    },
    m(target, anchor) {
      mount_component(button0, target, anchor);
      insert(target, t, anchor);
      mount_component(button1, target, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      const button0_changes = {};
      if (dirty & /*$$scope, expandTrTreeView*/
      65540) {
        button0_changes.$$scope = {
          dirty,
          ctx: ctx2
        };
      }
      button0.$set(button0_changes);
      const button1_changes = {};
      if (dirty & /*$$scope*/
      65536) {
        button1_changes.$$scope = {
          dirty,
          ctx: ctx2
        };
      }
      button1.$set(button1_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(button0.$$.fragment, local);
      transition_in(button1.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(button0.$$.fragment, local);
      transition_out(button1.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(t);
      }
      destroy_component(button0, detaching);
      destroy_component(button1, detaching);
    }
  };
}
function create_default_slot_2(ctx) {
  let t_value = (
    /*expandTrTreeView*/
    ctx[2] ? "collapse" : "expand"
  );
  let t;
  return {
    c() {
      t = text(t_value);
    },
    m(target, anchor) {
      insert(target, t, anchor);
    },
    p(ctx2, dirty) {
      if (dirty & /*expandTrTreeView*/
      4 && t_value !== (t_value = /*expandTrTreeView*/
      ctx2[2] ? "collapse" : "expand"))
        set_data(t, t_value);
    },
    d(detaching) {
      if (detaching) {
        detach(t);
      }
    }
  };
}
function create_default_slot_1$3(ctx) {
  let t;
  return {
    c() {
      t = text("log");
    },
    m(target, anchor) {
      insert(target, t, anchor);
    },
    d(detaching) {
      if (detaching) {
        detach(t);
      }
    }
  };
}
function create_default_slot$3(ctx) {
  let t_value = (
    /*showTr*/
    ctx[1] ? "hide" : "show"
  );
  let t;
  return {
    c() {
      t = text(t_value);
    },
    m(target, anchor) {
      insert(target, t, anchor);
    },
    p(ctx2, dirty) {
      if (dirty & /*showTr*/
      2 && t_value !== (t_value = /*showTr*/
      ctx2[1] ? "hide" : "show"))
        set_data(t, t_value);
    },
    d(detaching) {
      if (detaching) {
        detach(t);
      }
    }
  };
}
function create_if_block_1$3(ctx) {
  let each_1_anchor;
  let current;
  let each_value = ensure_array_like(
    /*selectedEntry*/
    ctx[0].trs
  );
  let each_blocks = [];
  for (let i = 0; i < each_value.length; i += 1) {
    each_blocks[i] = create_each_block$3(get_each_context$3(ctx, each_value, i));
  }
  const out = (i) => transition_out(each_blocks[i], 1, 1, () => {
    each_blocks[i] = null;
  });
  return {
    c() {
      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].c();
      }
      each_1_anchor = empty();
    },
    m(target, anchor) {
      for (let i = 0; i < each_blocks.length; i += 1) {
        if (each_blocks[i]) {
          each_blocks[i].m(target, anchor);
        }
      }
      insert(target, each_1_anchor, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      if (dirty & /*selectedEntry, transactionRecursionOpts*/
      9) {
        each_value = ensure_array_like(
          /*selectedEntry*/
          ctx2[0].trs
        );
        let i;
        for (i = 0; i < each_value.length; i += 1) {
          const child_ctx = get_each_context$3(ctx2, each_value, i);
          if (each_blocks[i]) {
            each_blocks[i].p(child_ctx, dirty);
            transition_in(each_blocks[i], 1);
          } else {
            each_blocks[i] = create_each_block$3(child_ctx);
            each_blocks[i].c();
            transition_in(each_blocks[i], 1);
            each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
          }
        }
        group_outros();
        for (i = each_value.length; i < each_blocks.length; i += 1) {
          out(i);
        }
        check_outros();
      }
    },
    i(local) {
      if (current)
        return;
      for (let i = 0; i < each_value.length; i += 1) {
        transition_in(each_blocks[i]);
      }
      current = true;
    },
    o(local) {
      each_blocks = each_blocks.filter(Boolean);
      for (let i = 0; i < each_blocks.length; i += 1) {
        transition_out(each_blocks[i]);
      }
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(each_1_anchor);
      }
      destroy_each(each_blocks, detaching);
    }
  };
}
function create_each_block$3(ctx) {
  let treeview;
  let current;
  treeview = new TreeView({
    props: {
      class: "tree-view",
      data: (
        /*tr*/
        ctx[13]
      ),
      showLogButton: true,
      showCopyButton: true,
      recursionOpts: (
        /*transactionRecursionOpts*/
        ctx[3]
      )
    }
  });
  return {
    c() {
      create_component(treeview.$$.fragment);
    },
    m(target, anchor) {
      mount_component(treeview, target, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      const treeview_changes = {};
      if (dirty & /*selectedEntry*/
      1)
        treeview_changes.data = /*tr*/
        ctx2[13];
      if (dirty & /*transactionRecursionOpts*/
      8)
        treeview_changes.recursionOpts = /*transactionRecursionOpts*/
        ctx2[3];
      treeview.$set(treeview_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(treeview.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(treeview.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(treeview, detaching);
    }
  };
}
function create_right_slot$4(ctx) {
  let div;
  let current_block_type_index;
  let if_block;
  let current;
  const if_block_creators = [create_if_block$5, create_else_block$5];
  const if_blocks = [];
  function select_block_type(ctx2, dirty) {
    if (
      /*selectedEntry*/
      ctx2[0]
    )
      return 0;
    return 1;
  }
  current_block_type_index = select_block_type(ctx);
  if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
  return {
    c() {
      div = element("div");
      if_block.c();
      attr(div, "slot", "right");
      attr(div, "class", "right-panel");
    },
    m(target, anchor) {
      insert(target, div, anchor);
      if_blocks[current_block_type_index].m(div, null);
      current = true;
    },
    p(ctx2, dirty) {
      let previous_block_index = current_block_type_index;
      current_block_type_index = select_block_type(ctx2);
      if (current_block_type_index === previous_block_index) {
        if_blocks[current_block_type_index].p(ctx2, dirty);
      } else {
        group_outros();
        transition_out(if_blocks[previous_block_index], 1, 1, () => {
          if_blocks[previous_block_index] = null;
        });
        check_outros();
        if_block = if_blocks[current_block_type_index];
        if (!if_block) {
          if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx2);
          if_block.c();
        } else {
          if_block.p(ctx2, dirty);
        }
        transition_in(if_block, 1);
        if_block.m(div, null);
      }
    },
    i(local) {
      if (current)
        return;
      transition_in(if_block);
      current = true;
    },
    o(local) {
      transition_out(if_block);
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(div);
      }
      if_blocks[current_block_type_index].d();
    }
  };
}
function create_fragment$a(ctx) {
  let splitview;
  let current;
  splitview = new SplitView({
    props: {
      $$slots: {
        right: [create_right_slot$4],
        left: [create_left_slot$3]
      },
      $$scope: {
        ctx
      }
    }
  });
  return {
    c() {
      create_component(splitview.$$.fragment);
    },
    m(target, anchor) {
      mount_component(splitview, target, anchor);
      current = true;
    },
    p(ctx2, _ref) {
      let [dirty] = _ref;
      const splitview_changes = {};
      if (dirty & /*$$scope, selectedEntry, transactionRecursionOpts, showTr, expandTrTreeView, listItems*/
      65567) {
        splitview_changes.$$scope = {
          dirty,
          ctx: ctx2
        };
      }
      splitview.$set(splitview_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(splitview.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(splitview.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(splitview, detaching);
    }
  };
}
const func$1 = () => true;
const func_1 = () => true;
function instance$a($$self, $$props, $$invalidate) {
  let listItems;
  let $stateHistory;
  let $shownHistoryGroups;
  component_subscribe($$self, stateHistory, ($$value) => $$invalidate(10, $stateHistory = $$value));
  component_subscribe($$self, shownHistoryGroups, ($$value) => $$invalidate(11, $shownHistoryGroups = $$value));
  let selectedEntry = void 0, showTr = false;
  const {
    replaceEditorContent
  } = getContext("editor-view");
  let expandTrTreeView = false;
  let transactionRecursionOpts = {
    maxDepth: 24,
    stopCircularRecursion: true,
    omitKeys: ["schema"],
    shouldExpandNode: () => expandTrTreeView
  };
  latestEntry.subscribe((v) => {
    if (v)
      $$invalidate(0, selectedEntry = v);
  });
  function toggleShowTr() {
    $$invalidate(1, showTr = !showTr);
  }
  function handleLogTr() {
    console.info("%c [prosemirror-dev-toolkit]: Property added to window._trs", "color: #b8e248");
    console.log(selectedEntry === null || selectedEntry === void 0 ? void 0 : selectedEntry.trs);
    window._trs = selectedEntry === null || selectedEntry === void 0 ? void 0 : selectedEntry.trs;
  }
  function handleEntrySelect(e) {
    const {
      id = "",
      groupIdx,
      wasTopNode
    } = e.detail;
    $$invalidate(0, selectedEntry = $stateHistory.get(id));
    if (!selectedEntry)
      return;
    const group = listItems[groupIdx];
    if (group.isGroup && group.entries.length > 1 && wasTopNode) {
      shownHistoryGroups.update((val) => val.map((g, idx) => idx !== groupIdx ? g : Object.assign(Object.assign({}, g), {
        expanded: !g.expanded
      })));
    }
  }
  function handleEntryDblClick(e) {
    $$invalidate(0, selectedEntry = $stateHistory.get(e.detail.id || ""));
    selectedEntry && replaceEditorContent(selectedEntry.state);
  }
  function handleToggleExpandTrTreeView() {
    $$invalidate(2, expandTrTreeView = !expandTrTreeView);
    $$invalidate(3, transactionRecursionOpts = Object.assign(Object.assign({}, transactionRecursionOpts), {
      shouldExpandNode: () => expandTrTreeView
    }));
  }
  $$self.$$.update = () => {
    if ($$self.$$.dirty & /*$shownHistoryGroups, $stateHistory*/
    3072) {
      $$invalidate(4, listItems = $shownHistoryGroups.map((g) => ({
        id: g.id,
        isGroup: g.isGroup,
        topEntry: $stateHistory.get(g.topEntryId),
        entries: g.entryIds.map((id) => $stateHistory.get(id)),
        expanded: g.expanded
      })));
    }
  };
  return [selectedEntry, showTr, expandTrTreeView, transactionRecursionOpts, listItems, toggleShowTr, handleLogTr, handleEntrySelect, handleEntryDblClick, handleToggleExpandTrTreeView, $stateHistory, $shownHistoryGroups];
}
class HistoryTab extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$a, create_fragment$a, safe_not_equal, {}, add_css$a);
  }
}
function add_css$9(target) {
  append_styles(target, "svelte-1fq2hhi", "ul.svelte-1fq2hhi.svelte-1fq2hhi{color:#fff;list-style:none;margin:0;padding:0;height:100%;width:100%}li.svelte-1fq2hhi+li.svelte-1fq2hhi{border-top:1px solid rgb(96, 76, 104)}button.svelte-1fq2hhi.svelte-1fq2hhi{background:transparent;border:0;color:#d3d3d9;cursor:pointer;display:flex;font-family:monospace;font-size:var(--font-medium);font-weight:100;padding:6px 18px;text-transform:uppercase;width:100%}button.svelte-1fq2hhi.svelte-1fq2hhi:hover{background:rgba(255, 162, 177, 0.4);color:#fff}button:hover.empty.svelte-1fq2hhi.svelte-1fq2hhi{background:rgb(80, 68, 93)}button.selected.svelte-1fq2hhi.svelte-1fq2hhi{background:rgba(255, 162, 177, 0.4)}button.selected.empty.svelte-1fq2hhi.svelte-1fq2hhi{background:rgb(80, 68, 93)}button.empty.svelte-1fq2hhi.svelte-1fq2hhi{color:#727288}");
}
function get_each_context$2(ctx, list, i) {
  const child_ctx = ctx.slice();
  child_ctx[4] = list[i];
  return child_ctx;
}
function create_each_block$2(ctx) {
  let li;
  let button;
  let t0_value = (
    /*item*/
    ctx[4].value + ""
  );
  let t0;
  let t1;
  let mounted2;
  let dispose;
  function click_handler() {
    return (
      /*click_handler*/
      ctx[3](
        /*item*/
        ctx[4]
      )
    );
  }
  return {
    c() {
      li = element("li");
      button = element("button");
      t0 = text(t0_value);
      t1 = space();
      attr(button, "class", "svelte-1fq2hhi");
      toggle_class(
        button,
        "selected",
        /*selectedKey*/
        ctx[1] === /*item*/
        ctx[4].key
      );
      toggle_class(
        button,
        "empty",
        /*item*/
        ctx[4].empty
      );
      attr(li, "class", "svelte-1fq2hhi");
    },
    m(target, anchor) {
      insert(target, li, anchor);
      append(li, button);
      append(button, t0);
      append(li, t1);
      if (!mounted2) {
        dispose = listen(button, "click", click_handler);
        mounted2 = true;
      }
    },
    p(new_ctx, dirty) {
      ctx = new_ctx;
      if (dirty & /*listItems*/
      1 && t0_value !== (t0_value = /*item*/
      ctx[4].value + ""))
        set_data(t0, t0_value);
      if (dirty & /*selectedKey, listItems*/
      3) {
        toggle_class(
          button,
          "selected",
          /*selectedKey*/
          ctx[1] === /*item*/
          ctx[4].key
        );
      }
      if (dirty & /*listItems*/
      1) {
        toggle_class(
          button,
          "empty",
          /*item*/
          ctx[4].empty
        );
      }
    },
    d(detaching) {
      if (detaching) {
        detach(li);
      }
      mounted2 = false;
      dispose();
    }
  };
}
function create_fragment$9(ctx) {
  let ul;
  let each_value = ensure_array_like(
    /*listItems*/
    ctx[0]
  );
  let each_blocks = [];
  for (let i = 0; i < each_value.length; i += 1) {
    each_blocks[i] = create_each_block$2(get_each_context$2(ctx, each_value, i));
  }
  return {
    c() {
      ul = element("ul");
      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].c();
      }
      attr(ul, "class", "svelte-1fq2hhi");
    },
    m(target, anchor) {
      insert(target, ul, anchor);
      for (let i = 0; i < each_blocks.length; i += 1) {
        if (each_blocks[i]) {
          each_blocks[i].m(ul, null);
        }
      }
    },
    p(ctx2, _ref) {
      let [dirty] = _ref;
      if (dirty & /*selectedKey, listItems, onSelect*/
      7) {
        each_value = ensure_array_like(
          /*listItems*/
          ctx2[0]
        );
        let i;
        for (i = 0; i < each_value.length; i += 1) {
          const child_ctx = get_each_context$2(ctx2, each_value, i);
          if (each_blocks[i]) {
            each_blocks[i].p(child_ctx, dirty);
          } else {
            each_blocks[i] = create_each_block$2(child_ctx);
            each_blocks[i].c();
            each_blocks[i].m(ul, null);
          }
        }
        for (; i < each_blocks.length; i += 1) {
          each_blocks[i].d(1);
        }
        each_blocks.length = each_value.length;
      }
    },
    i: noop,
    o: noop,
    d(detaching) {
      if (detaching) {
        detach(ul);
      }
      destroy_each(each_blocks, detaching);
    }
  };
}
function instance$9($$self, $$props, $$invalidate) {
  let {
    listItems = [],
    selectedKey,
    onSelect
  } = $$props;
  const click_handler = (item) => onSelect(item);
  $$self.$$set = ($$props2) => {
    if ("listItems" in $$props2)
      $$invalidate(0, listItems = $$props2.listItems);
    if ("selectedKey" in $$props2)
      $$invalidate(1, selectedKey = $$props2.selectedKey);
    if ("onSelect" in $$props2)
      $$invalidate(2, onSelect = $$props2.onSelect);
  };
  return [listItems, selectedKey, onSelect, click_handler];
}
class List extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$9, create_fragment$9, safe_not_equal, {
      listItems: 0,
      selectedKey: 1,
      onSelect: 2
    }, add_css$9);
  }
}
function add_css$8(target) {
  append_styles(target, "svelte-9l897d", ".top-row.svelte-9l897d{align-items:center;display:flex;justify-content:space-between;margin-bottom:0.5em}.left-panel[slot=left].svelte-9l897d{flex-grow:0;overflow:scroll;padding:0;min-width:190px;width:190px}.right-panel[slot=right].svelte-9l897d{border-left:1px solid rgba(255, 162, 177, 0.2)}.empty-state.svelte-9l897d{align-items:center;color:rgb(255, 162, 177);display:flex;font-size:14px;height:100%;justify-content:center;width:100%}");
}
function create_left_slot$2(ctx) {
  var _ctx$;
  let div;
  let list;
  let current;
  list = new List({
    props: {
      listItems: (
        /*listItems*/
        ctx[4]
      ),
      selectedKey: (
        /*selectedPlugin*/
        (_ctx$ = ctx[0]) === null || _ctx$ === void 0 ? void 0 : _ctx$.key
      ),
      onSelect: (
        /*handlePluginSelect*/
        ctx[5]
      )
    }
  });
  return {
    c() {
      div = element("div");
      create_component(list.$$.fragment);
      attr(div, "slot", "left");
      attr(div, "class", "left-panel svelte-9l897d");
    },
    m(target, anchor) {
      insert(target, div, anchor);
      mount_component(list, div, null);
      current = true;
    },
    p(ctx2, dirty) {
      var _ctx$2;
      const list_changes = {};
      if (dirty & /*listItems*/
      16)
        list_changes.listItems = /*listItems*/
        ctx2[4];
      if (dirty & /*selectedPlugin*/
      1)
        list_changes.selectedKey = /*selectedPlugin*/
        (_ctx$2 = ctx2[0]) === null || _ctx$2 === void 0 ? void 0 : _ctx$2.key;
      list.$set(list_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(list.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(list.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(div);
      }
      destroy_component(list);
    }
  };
}
function create_if_block_1$2(ctx) {
  let div1;
  let h2;
  let t1;
  let div0;
  let button0;
  let t2;
  let button1;
  let current;
  button0 = new Button({
    props: {
      $$slots: {
        default: [create_default_slot_1$2]
      },
      $$scope: {
        ctx
      }
    }
  });
  button0.$on(
    "click",
    /*handleToggleExpand*/
    ctx[6]
  );
  button1 = new Button({
    props: {
      $$slots: {
        default: [create_default_slot$2]
      },
      $$scope: {
        ctx
      }
    }
  });
  button1.$on(
    "click",
    /*handleLogState*/
    ctx[7]
  );
  return {
    c() {
      div1 = element("div");
      h2 = element("h2");
      h2.textContent = "Plugin state";
      t1 = space();
      div0 = element("div");
      create_component(button0.$$.fragment);
      t2 = space();
      create_component(button1.$$.fragment);
      attr(div1, "class", "top-row svelte-9l897d");
    },
    m(target, anchor) {
      insert(target, div1, anchor);
      append(div1, h2);
      append(div1, t1);
      append(div1, div0);
      mount_component(button0, div0, null);
      append(div0, t2);
      mount_component(button1, div0, null);
      current = true;
    },
    p(ctx2, dirty) {
      const button0_changes = {};
      if (dirty & /*$$scope, expandPluginState*/
      2050) {
        button0_changes.$$scope = {
          dirty,
          ctx: ctx2
        };
      }
      button0.$set(button0_changes);
      const button1_changes = {};
      if (dirty & /*$$scope*/
      2048) {
        button1_changes.$$scope = {
          dirty,
          ctx: ctx2
        };
      }
      button1.$set(button1_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(button0.$$.fragment, local);
      transition_in(button1.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(button0.$$.fragment, local);
      transition_out(button1.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(div1);
      }
      destroy_component(button0);
      destroy_component(button1);
    }
  };
}
function create_default_slot_1$2(ctx) {
  let t_value = (
    /*expandPluginState*/
    ctx[1] ? "collapse" : "expand"
  );
  let t;
  return {
    c() {
      t = text(t_value);
    },
    m(target, anchor) {
      insert(target, t, anchor);
    },
    p(ctx2, dirty) {
      if (dirty & /*expandPluginState*/
      2 && t_value !== (t_value = /*expandPluginState*/
      ctx2[1] ? "collapse" : "expand"))
        set_data(t, t_value);
    },
    d(detaching) {
      if (detaching) {
        detach(t);
      }
    }
  };
}
function create_default_slot$2(ctx) {
  let t;
  return {
    c() {
      t = text("log");
    },
    m(target, anchor) {
      insert(target, t, anchor);
    },
    d(detaching) {
      if (detaching) {
        detach(t);
      }
    }
  };
}
function create_else_block$4(ctx) {
  let div;
  return {
    c() {
      div = element("div");
      div.textContent = "Plugin has no state";
      attr(div, "class", "empty-state svelte-9l897d");
    },
    m(target, anchor) {
      insert(target, div, anchor);
    },
    p: noop,
    i: noop,
    o: noop,
    d(detaching) {
      if (detaching) {
        detach(div);
      }
    }
  };
}
function create_if_block$4(ctx) {
  let treeview;
  let current;
  treeview = new TreeView({
    props: {
      data: (
        /*pluginState*/
        ctx[3]
      ),
      showLogButton: true,
      showCopyButton: true,
      recursionOpts: (
        /*recursionOpts*/
        ctx[2]
      )
    }
  });
  return {
    c() {
      create_component(treeview.$$.fragment);
    },
    m(target, anchor) {
      mount_component(treeview, target, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      const treeview_changes = {};
      if (dirty & /*pluginState*/
      8)
        treeview_changes.data = /*pluginState*/
        ctx2[3];
      if (dirty & /*recursionOpts*/
      4)
        treeview_changes.recursionOpts = /*recursionOpts*/
        ctx2[2];
      treeview.$set(treeview_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(treeview.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(treeview.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(treeview, detaching);
    }
  };
}
function create_right_slot$3(ctx) {
  let div;
  let t;
  let current_block_type_index;
  let if_block1;
  let current;
  let if_block0 = (
    /*pluginState*/
    ctx[3] && create_if_block_1$2(ctx)
  );
  const if_block_creators = [create_if_block$4, create_else_block$4];
  const if_blocks = [];
  function select_block_type(ctx2, dirty) {
    if (
      /*pluginState*/
      ctx2[3]
    )
      return 0;
    return 1;
  }
  current_block_type_index = select_block_type(ctx);
  if_block1 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
  return {
    c() {
      div = element("div");
      if (if_block0)
        if_block0.c();
      t = space();
      if_block1.c();
      attr(div, "slot", "right");
      attr(div, "class", "right-panel svelte-9l897d");
    },
    m(target, anchor) {
      insert(target, div, anchor);
      if (if_block0)
        if_block0.m(div, null);
      append(div, t);
      if_blocks[current_block_type_index].m(div, null);
      current = true;
    },
    p(ctx2, dirty) {
      if (
        /*pluginState*/
        ctx2[3]
      ) {
        if (if_block0) {
          if_block0.p(ctx2, dirty);
          if (dirty & /*pluginState*/
          8) {
            transition_in(if_block0, 1);
          }
        } else {
          if_block0 = create_if_block_1$2(ctx2);
          if_block0.c();
          transition_in(if_block0, 1);
          if_block0.m(div, t);
        }
      } else if (if_block0) {
        group_outros();
        transition_out(if_block0, 1, 1, () => {
          if_block0 = null;
        });
        check_outros();
      }
      let previous_block_index = current_block_type_index;
      current_block_type_index = select_block_type(ctx2);
      if (current_block_type_index === previous_block_index) {
        if_blocks[current_block_type_index].p(ctx2, dirty);
      } else {
        group_outros();
        transition_out(if_blocks[previous_block_index], 1, 1, () => {
          if_blocks[previous_block_index] = null;
        });
        check_outros();
        if_block1 = if_blocks[current_block_type_index];
        if (!if_block1) {
          if_block1 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx2);
          if_block1.c();
        } else {
          if_block1.p(ctx2, dirty);
        }
        transition_in(if_block1, 1);
        if_block1.m(div, null);
      }
    },
    i(local) {
      if (current)
        return;
      transition_in(if_block0);
      transition_in(if_block1);
      current = true;
    },
    o(local) {
      transition_out(if_block0);
      transition_out(if_block1);
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(div);
      }
      if (if_block0)
        if_block0.d();
      if_blocks[current_block_type_index].d();
    }
  };
}
function create_fragment$8(ctx) {
  let splitview;
  let current;
  splitview = new SplitView({
    props: {
      $$slots: {
        right: [create_right_slot$3],
        left: [create_left_slot$2]
      },
      $$scope: {
        ctx
      }
    }
  });
  return {
    c() {
      create_component(splitview.$$.fragment);
    },
    m(target, anchor) {
      mount_component(splitview, target, anchor);
      current = true;
    },
    p(ctx2, _ref) {
      let [dirty] = _ref;
      const splitview_changes = {};
      if (dirty & /*$$scope, pluginState, recursionOpts, expandPluginState, listItems, selectedPlugin*/
      2079) {
        splitview_changes.$$scope = {
          dirty,
          ctx: ctx2
        };
      }
      splitview.$set(splitview_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(splitview.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(splitview.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(splitview, detaching);
    }
  };
}
function instance$8($$self, $$props, $$invalidate) {
  let pluginState;
  let listItems;
  const {
    view
  } = getContext("editor-view");
  let expandPluginState = false;
  let recursionOpts = {
    maxDepth: 10,
    stopCircularRecursion: true,
    shouldExpandNode: () => expandPluginState
  };
  let editorState = view.state;
  let plugins = editorState.plugins;
  let selectedPlugin = plugins[0];
  latestEntry.subscribe((e) => {
    if (!e)
      return;
    $$invalidate(8, editorState = e.state);
    $$invalidate(9, plugins = editorState.plugins);
    $$invalidate(0, selectedPlugin = plugins.find((p) => p.key === (selectedPlugin === null || selectedPlugin === void 0 ? void 0 : selectedPlugin.key)));
  });
  function handlePluginSelect(item) {
    $$invalidate(0, selectedPlugin = plugins.find((p) => p.key === item.key));
  }
  function handleToggleExpand() {
    $$invalidate(1, expandPluginState = !expandPluginState);
    $$invalidate(2, recursionOpts = Object.assign(Object.assign({}, recursionOpts), {
      shouldExpandNode: () => expandPluginState
    }));
  }
  function handleLogState() {
    window._plugin = [selectedPlugin, pluginState];
    console.info("%c [prosemirror-dev-toolkit]: Property added to window._plugin", "color: #b8e248");
    console.log(selectedPlugin);
    console.log(pluginState);
  }
  $$self.$$.update = () => {
    if ($$self.$$.dirty & /*selectedPlugin, editorState*/
    257) {
      $$invalidate(3, pluginState = (selectedPlugin === null || selectedPlugin === void 0 ? void 0 : selectedPlugin.getState) ? selectedPlugin.getState(editorState) : void 0);
    }
    if ($$self.$$.dirty & /*plugins, editorState*/
    768) {
      $$invalidate(4, listItems = plugins.map((p) => ({
        key: p.key,
        value: p.key.toUpperCase(),
        empty: !(p.getState && p.getState(editorState))
      })));
    }
  };
  return [selectedPlugin, expandPluginState, recursionOpts, pluginState, listItems, handlePluginSelect, handleToggleExpand, handleLogState, editorState, plugins];
}
class PluginsTab extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$8, create_fragment$8, safe_not_equal, {}, add_css$8);
  }
}
function add_css$7(target) {
  append_styles(target, "svelte-1u2reu1", ".top-row.svelte-1u2reu1{align-items:center;display:flex;justify-content:space-between}.left-panel[slot=left].svelte-1u2reu1{overflow:scroll;padding:1em}.right-panel[slot=right].svelte-1u2reu1{border-left:1px solid rgba(255, 162, 177, 0.2);overflow:scroll;padding:1em}");
}
function create_default_slot_1$1(ctx) {
  let t;
  return {
    c() {
      t = text("log");
    },
    m(target, anchor) {
      insert(target, t, anchor);
    },
    d(detaching) {
      if (detaching) {
        detach(t);
      }
    }
  };
}
function create_left_slot$1(ctx) {
  let div1;
  let div0;
  let h2;
  let t1;
  let button;
  let t2;
  let treeview;
  let current;
  button = new Button({
    props: {
      class: "hidden",
      $$slots: {
        default: [create_default_slot_1$1]
      },
      $$scope: {
        ctx
      }
    }
  });
  treeview = new TreeView({
    props: {
      class: "tree-view",
      data: (
        /*nodes*/
        ctx[0]
      ),
      showLogButton: true,
      showCopyButton: true,
      recursionOpts: {
        stopCircularRecursion: true
      }
    }
  });
  return {
    c() {
      div1 = element("div");
      div0 = element("div");
      h2 = element("h2");
      h2.textContent = "Nodes";
      t1 = space();
      create_component(button.$$.fragment);
      t2 = space();
      create_component(treeview.$$.fragment);
      attr(div0, "class", "top-row svelte-1u2reu1");
      attr(div1, "slot", "left");
      attr(div1, "class", "left-panel svelte-1u2reu1");
    },
    m(target, anchor) {
      insert(target, div1, anchor);
      append(div1, div0);
      append(div0, h2);
      append(div0, t1);
      mount_component(button, div0, null);
      append(div1, t2);
      mount_component(treeview, div1, null);
      current = true;
    },
    p(ctx2, dirty) {
      const button_changes = {};
      if (dirty & /*$$scope*/
      8) {
        button_changes.$$scope = {
          dirty,
          ctx: ctx2
        };
      }
      button.$set(button_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(button.$$.fragment, local);
      transition_in(treeview.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(button.$$.fragment, local);
      transition_out(treeview.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(div1);
      }
      destroy_component(button);
      destroy_component(treeview);
    }
  };
}
function create_default_slot$1(ctx) {
  let t;
  return {
    c() {
      t = text("log");
    },
    m(target, anchor) {
      insert(target, t, anchor);
    },
    d(detaching) {
      if (detaching) {
        detach(t);
      }
    }
  };
}
function create_right_slot$2(ctx) {
  let div1;
  let div0;
  let h2;
  let t1;
  let button;
  let t2;
  let treeview;
  let current;
  button = new Button({
    props: {
      class: "hidden",
      $$slots: {
        default: [create_default_slot$1]
      },
      $$scope: {
        ctx
      }
    }
  });
  treeview = new TreeView({
    props: {
      class: "tree-view",
      data: (
        /*marks*/
        ctx[1]
      ),
      showLogButton: true,
      showCopyButton: true,
      recursionOpts: {
        stopCircularRecursion: true
      }
    }
  });
  return {
    c() {
      div1 = element("div");
      div0 = element("div");
      h2 = element("h2");
      h2.textContent = "Marks";
      t1 = space();
      create_component(button.$$.fragment);
      t2 = space();
      create_component(treeview.$$.fragment);
      attr(div0, "class", "top-row svelte-1u2reu1");
      attr(div1, "slot", "right");
      attr(div1, "class", "right-panel svelte-1u2reu1");
    },
    m(target, anchor) {
      insert(target, div1, anchor);
      append(div1, div0);
      append(div0, h2);
      append(div0, t1);
      mount_component(button, div0, null);
      append(div1, t2);
      mount_component(treeview, div1, null);
      current = true;
    },
    p(ctx2, dirty) {
      const button_changes = {};
      if (dirty & /*$$scope*/
      8) {
        button_changes.$$scope = {
          dirty,
          ctx: ctx2
        };
      }
      button.$set(button_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(button.$$.fragment, local);
      transition_in(treeview.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(button.$$.fragment, local);
      transition_out(treeview.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(div1);
      }
      destroy_component(button);
      destroy_component(treeview);
    }
  };
}
function create_fragment$7(ctx) {
  let splitview;
  let current;
  splitview = new SplitView({
    props: {
      $$slots: {
        right: [create_right_slot$2],
        left: [create_left_slot$1]
      },
      $$scope: {
        ctx
      }
    }
  });
  return {
    c() {
      create_component(splitview.$$.fragment);
    },
    m(target, anchor) {
      mount_component(splitview, target, anchor);
      current = true;
    },
    p(ctx2, _ref) {
      let [dirty] = _ref;
      const splitview_changes = {};
      if (dirty & /*$$scope*/
      8) {
        splitview_changes.$$scope = {
          dirty,
          ctx: ctx2
        };
      }
      splitview.$set(splitview_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(splitview.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(splitview.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(splitview, detaching);
    }
  };
}
function instance$7($$self) {
  const {
    view
  } = getContext("editor-view");
  let nodes = view.state.schema.nodes;
  let marks = view.state.schema.marks;
  return [nodes, marks];
}
class SchemaTab extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$7, create_fragment$7, safe_not_equal, {}, add_css$7);
  }
}
function add_css$6(target) {
  append_styles(target, "svelte-1un819s", ".doc-node.svelte-1un819s{border-left:1px solid #363755;border-right:1px solid #363755;display:flex;flex-direction:column;padding:0 12px}.doc-node.root.svelte-1un819s{border:0;padding:0}.doc-node-body.svelte-1un819s{background:#363755;color:#222;display:flex;font-size:13px;margin-top:3px}.number-box.svelte-1un819s{padding:3px 6px;background:rgba(255, 255, 255, 0.3)}.node-name.svelte-1un819s{width:100%}button.svelte-1un819s{align-items:center;background:transparent;border:0;color:#222;cursor:pointer;display:flex;height:100%;white-space:pre;width:100%}button.svelte-1un819s:hover{background:rgba(255, 162, 177, 0.4);color:#fff}button.selected.svelte-1un819s{background:rgba(255, 162, 177, 0.4)}ul.svelte-1un819s{list-style:none;margin:0;padding:0}ul.show-borders.svelte-1un819s{border-left:1px solid rgb(96, 76, 104);border-right:1px solid rgb(96, 76, 104)}.inline-children.svelte-1un819s{border-left:1px solid rgb(96, 76, 104);border-right:1px solid rgb(96, 76, 104);display:flex;flex-wrap:wrap;padding:0 12px}.inline-children.svelte-1un819s>.doc-node{flex-grow:1;padding:0}");
}
function get_each_context$1(ctx, list, i) {
  const child_ctx = ctx.slice();
  child_ctx[15] = list[i];
  child_ctx[17] = i;
  return child_ctx;
}
function create_each_block$1(ctx) {
  let docnode;
  let current;
  docnode = new DocNode({
    props: {
      node: (
        /*child*/
        ctx[15]
      ),
      startPos: (
        /*startPositions*/
        ctx[5][
          /*i*/
          ctx[17]
        ]
      ),
      depth: (
        /*depth*/
        ctx[1] + 1
      )
    }
  });
  return {
    c() {
      create_component(docnode.$$.fragment);
    },
    m(target, anchor) {
      mount_component(docnode, target, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      const docnode_changes = {};
      if (dirty & /*fragment*/
      4)
        docnode_changes.node = /*child*/
        ctx2[15];
      if (dirty & /*startPositions*/
      32)
        docnode_changes.startPos = /*startPositions*/
        ctx2[5][
          /*i*/
          ctx2[17]
        ];
      if (dirty & /*depth*/
      2)
        docnode_changes.depth = /*depth*/
        ctx2[1] + 1;
      docnode.$set(docnode_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(docnode.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(docnode.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(docnode, detaching);
    }
  };
}
function create_fragment$6(ctx) {
  let li;
  let div3;
  let div0;
  let t0;
  let t1;
  let div1;
  let button;
  let t2;
  let t3;
  let div2;
  let t4;
  let div3_style_value;
  let t5;
  let ul;
  let li_class_value;
  let current;
  let mounted2;
  let dispose;
  let each_value = ensure_array_like(
    /*fragment*/
    ctx[2].content
  );
  let each_blocks = [];
  for (let i = 0; i < each_value.length; i += 1) {
    each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
  }
  const out = (i) => transition_out(each_blocks[i], 1, 1, () => {
    each_blocks[i] = null;
  });
  return {
    c() {
      li = element("li");
      div3 = element("div");
      div0 = element("div");
      t0 = text(
        /*startPos*/
        ctx[0]
      );
      t1 = space();
      div1 = element("div");
      button = element("button");
      t2 = text(
        /*name*/
        ctx[6]
      );
      t3 = space();
      div2 = element("div");
      t4 = text(
        /*endPos*/
        ctx[4]
      );
      t5 = space();
      ul = element("ul");
      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].c();
      }
      attr(div0, "class", "number-box svelte-1un819s");
      attr(button, "aria-label", "Show node info button");
      attr(button, "class", "svelte-1un819s");
      toggle_class(button, "selected", false);
      attr(div1, "class", "node-name svelte-1un819s");
      attr(div2, "class", "number-box svelte-1un819s");
      attr(div3, "class", "doc-node-body svelte-1un819s");
      attr(div3, "style", div3_style_value = "background: ".concat(
        /*color*/
        ctx[7]
      ));
      attr(ul, "class", "svelte-1un819s");
      toggle_class(
        ul,
        "inline-children",
        /*inlineChildren*/
        ctx[3]
      );
      toggle_class(
        ul,
        "show-borders",
        /*depth*/
        ctx[1] >= 1
      );
      attr(li, "class", li_class_value = null_to_empty("".concat(
        /*$$props*/
        ctx[11].class || "",
        " doc-node"
      )) + " svelte-1un819s");
      toggle_class(
        li,
        "root",
        /*isRoot*/
        ctx[8]
      );
    },
    m(target, anchor) {
      insert(target, li, anchor);
      append(li, div3);
      append(div3, div0);
      append(div0, t0);
      append(div3, t1);
      append(div3, div1);
      append(div1, button);
      append(button, t2);
      append(div3, t3);
      append(div3, div2);
      append(div2, t4);
      append(li, t5);
      append(li, ul);
      for (let i = 0; i < each_blocks.length; i += 1) {
        if (each_blocks[i]) {
          each_blocks[i].m(ul, null);
        }
      }
      current = true;
      if (!mounted2) {
        dispose = [listen(
          button,
          "click",
          /*handleNameClick*/
          ctx[9]
        ), listen(
          button,
          "dblclick",
          /*handleNameDblClick*/
          ctx[10]
        )];
        mounted2 = true;
      }
    },
    p(ctx2, _ref) {
      let [dirty] = _ref;
      if (!current || dirty & /*startPos*/
      1)
        set_data(
          t0,
          /*startPos*/
          ctx2[0]
        );
      if (!current || dirty & /*name*/
      64)
        set_data(
          t2,
          /*name*/
          ctx2[6]
        );
      if (!current || dirty & /*endPos*/
      16)
        set_data(
          t4,
          /*endPos*/
          ctx2[4]
        );
      if (!current || dirty & /*color*/
      128 && div3_style_value !== (div3_style_value = "background: ".concat(
        /*color*/
        ctx2[7]
      ))) {
        attr(div3, "style", div3_style_value);
      }
      if (dirty & /*fragment, startPositions, depth*/
      38) {
        each_value = ensure_array_like(
          /*fragment*/
          ctx2[2].content
        );
        let i;
        for (i = 0; i < each_value.length; i += 1) {
          const child_ctx = get_each_context$1(ctx2, each_value, i);
          if (each_blocks[i]) {
            each_blocks[i].p(child_ctx, dirty);
            transition_in(each_blocks[i], 1);
          } else {
            each_blocks[i] = create_each_block$1(child_ctx);
            each_blocks[i].c();
            transition_in(each_blocks[i], 1);
            each_blocks[i].m(ul, null);
          }
        }
        group_outros();
        for (i = each_value.length; i < each_blocks.length; i += 1) {
          out(i);
        }
        check_outros();
      }
      if (!current || dirty & /*inlineChildren*/
      8) {
        toggle_class(
          ul,
          "inline-children",
          /*inlineChildren*/
          ctx2[3]
        );
      }
      if (!current || dirty & /*depth*/
      2) {
        toggle_class(
          ul,
          "show-borders",
          /*depth*/
          ctx2[1] >= 1
        );
      }
      if (!current || dirty & /*$$props*/
      2048 && li_class_value !== (li_class_value = null_to_empty("".concat(
        /*$$props*/
        ctx2[11].class || "",
        " doc-node"
      )) + " svelte-1un819s")) {
        attr(li, "class", li_class_value);
      }
      if (!current || dirty & /*$$props, isRoot*/
      2304) {
        toggle_class(
          li,
          "root",
          /*isRoot*/
          ctx2[8]
        );
      }
    },
    i(local) {
      if (current)
        return;
      for (let i = 0; i < each_value.length; i += 1) {
        transition_in(each_blocks[i]);
      }
      current = true;
    },
    o(local) {
      each_blocks = each_blocks.filter(Boolean);
      for (let i = 0; i < each_blocks.length; i += 1) {
        transition_out(each_blocks[i]);
      }
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(li);
      }
      destroy_each(each_blocks, detaching);
      mounted2 = false;
      run_all(dispose);
    }
  };
}
function instance$6($$self, $$props, $$invalidate) {
  let fragment;
  let color;
  let name;
  let startPositions;
  let endPos;
  let inlineChildren;
  const {
    colors: colors2,
    handleNodeClick
  } = getContext("doc-view");
  let {
    node,
    startPos,
    depth
  } = $$props;
  const isRoot = depth === 0;
  function handleNameClick() {
    handleNodeClick(node, startPos);
  }
  function handleNameDblClick() {
    handleNodeClick(node, startPos, true);
  }
  $$self.$$set = ($$new_props) => {
    $$invalidate(11, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    if ("node" in $$new_props)
      $$invalidate(12, node = $$new_props.node);
    if ("startPos" in $$new_props)
      $$invalidate(0, startPos = $$new_props.startPos);
    if ("depth" in $$new_props)
      $$invalidate(1, depth = $$new_props.depth);
  };
  $$self.$$.update = () => {
    if ($$self.$$.dirty & /*node*/
    4096) {
      $$invalidate(2, fragment = node.content);
    }
    if ($$self.$$.dirty & /*node*/
    4096) {
      $$invalidate(7, color = colors2[node.type.name]);
    }
    if ($$self.$$.dirty & /*node*/
    4096) {
      $$invalidate(6, name = node.isText && node.marks.length > 0 ? "".concat(node.type.name, " - [").concat(node.marks.map((m) => m.type.name).join(", "), "]") : node.type.name);
    }
    if ($$self.$$.dirty & /*node, startPos*/
    4097) {
      $$invalidate(5, startPositions = Array(node.childCount).fill(void 0).reduce((acc, _, idx) => {
        if (idx === 0) {
          return [isRoot ? 0 : startPos + 1];
        }
        let prev = acc[idx - 1];
        let cur = node.child(idx - 1);
        return [...acc, prev + cur.nodeSize];
      }, []));
    }
    if ($$self.$$.dirty & /*startPos, node*/
    4097) {
      $$invalidate(4, endPos = startPos + node.nodeSize);
    }
    if ($$self.$$.dirty & /*fragment*/
    4) {
      $$invalidate(3, inlineChildren = fragment.content.every((n) => n.isInline));
    }
  };
  $$props = exclude_internal_props($$props);
  return [startPos, depth, fragment, inlineChildren, endPos, startPositions, name, color, isRoot, handleNameClick, handleNameDblClick, $$props, node];
}
class DocNode extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$6, create_fragment$6, safe_not_equal, {
      node: 12,
      startPos: 0,
      depth: 1
    }, add_css$6);
  }
}
const nodeColors = [
  "#EA7C7F",
  // red
  "#67B0C6",
  // cyan 400
  "#94BB7F",
  // green
  "#CA9EDB",
  // deep purple
  "#DCDC5D",
  // lime
  "#B9CC7C",
  // light green
  "#DD97D8",
  // purple
  "#FFB761",
  // orange
  "#4D8FD1",
  // light blue
  "#F36E98",
  // pink
  "#E45F44",
  // deep orange
  "#A6A4AE",
  // blue grey
  "#FCC047",
  // yellow
  "#FFC129",
  // amber
  "#D3929C",
  // can can
  "#4CBCD4",
  // cyan
  "#8D7BC0"
  // indigo
];
function calculateSafeIndex(index, total) {
  const quotient = index / total;
  return Math.round(total * (quotient - Math.floor(quotient)));
}
function buildColors(schema) {
  return Object.keys(schema.nodes).reduce((acc, node, index) => {
    const safeIndex = index >= nodeColors.length ? calculateSafeIndex(index, nodeColors.length) : index;
    acc[node] = nodeColors[safeIndex];
    return acc;
  }, {});
}
function add_css$5(target) {
  append_styles(target, "svelte-is7zuw", "ul.svelte-is7zuw{list-style:none;margin:0;padding:0}");
}
function create_fragment$5(ctx) {
  let ul;
  let docnode;
  let current;
  docnode = new DocNode({
    props: {
      class: (
        /*$$props*/
        ctx[1].class
      ),
      node: (
        /*doc*/
        ctx[0]
      ),
      startPos: 0,
      depth: 0
    }
  });
  return {
    c() {
      ul = element("ul");
      create_component(docnode.$$.fragment);
      attr(ul, "class", "svelte-is7zuw");
    },
    m(target, anchor) {
      insert(target, ul, anchor);
      mount_component(docnode, ul, null);
      current = true;
    },
    p(ctx2, _ref) {
      let [dirty] = _ref;
      const docnode_changes = {};
      if (dirty & /*$$props*/
      2)
        docnode_changes.class = /*$$props*/
        ctx2[1].class;
      if (dirty & /*doc*/
      1)
        docnode_changes.node = /*doc*/
        ctx2[0];
      docnode.$set(docnode_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(docnode.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(docnode.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(ul);
      }
      destroy_component(docnode);
    }
  };
}
function instance$5($$self, $$props, $$invalidate) {
  let {
    doc: doc2,
    schema,
    selected = {
      type: "",
      start: 0,
      end: 0
    },
    handleNodeSelect
  } = $$props;
  setContext("doc-view", {
    selected,
    colors: buildColors(schema),
    handleNodeClick: handleNodeSelect
  });
  $$self.$$set = ($$new_props) => {
    $$invalidate(1, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    if ("doc" in $$new_props)
      $$invalidate(0, doc2 = $$new_props.doc);
    if ("schema" in $$new_props)
      $$invalidate(2, schema = $$new_props.schema);
    if ("selected" in $$new_props)
      $$invalidate(3, selected = $$new_props.selected);
    if ("handleNodeSelect" in $$new_props)
      $$invalidate(4, handleNodeSelect = $$new_props.handleNodeSelect);
  };
  $$props = exclude_internal_props($$props);
  return [doc2, $$props, schema, selected, handleNodeSelect];
}
class DocView extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$5, create_fragment$5, safe_not_equal, {
      doc: 0,
      schema: 2,
      selected: 3,
      handleNodeSelect: 4
    }, add_css$5);
  }
}
function add_css$4(target) {
  append_styles(target, "svelte-15i66m0", ".top-row.svelte-15i66m0{align-items:center;display:flex;justify-content:space-between}.right-panel[slot=right].svelte-15i66m0{border-left:1px solid rgba(255, 162, 177, 0.2);flex-grow:0;min-width:220px;width:220px}.split-view .m-top{margin-top:0.75em}");
}
function create_default_slot_1(ctx) {
  let t;
  return {
    c() {
      t = text("log");
    },
    m(target, anchor) {
      insert(target, t, anchor);
    },
    d(detaching) {
      if (detaching) {
        detach(t);
      }
    }
  };
}
function create_left_slot(ctx) {
  let div1;
  let div0;
  let h2;
  let t1;
  let button;
  let t2;
  let docview;
  let current;
  button = new Button({
    props: {
      class: "hidden",
      $$slots: {
        default: [create_default_slot_1]
      },
      $$scope: {
        ctx
      }
    }
  });
  docview = new DocView({
    props: {
      class: "m-top",
      doc: (
        /*doc*/
        ctx[0]
      ),
      schema: (
        /*schema*/
        ctx[2]
      ),
      handleNodeSelect: (
        /*handleNodeSelect*/
        ctx[3]
      )
    }
  });
  return {
    c() {
      div1 = element("div");
      div0 = element("div");
      h2 = element("h2");
      h2.textContent = "Current doc";
      t1 = space();
      create_component(button.$$.fragment);
      t2 = space();
      create_component(docview.$$.fragment);
      attr(div0, "class", "top-row svelte-15i66m0");
      attr(div1, "slot", "left");
      attr(div1, "class", "left-panel");
    },
    m(target, anchor) {
      insert(target, div1, anchor);
      append(div1, div0);
      append(div0, h2);
      append(div0, t1);
      mount_component(button, div0, null);
      append(div1, t2);
      mount_component(docview, div1, null);
      current = true;
    },
    p(ctx2, dirty) {
      const button_changes = {};
      if (dirty & /*$$scope*/
      256) {
        button_changes.$$scope = {
          dirty,
          ctx: ctx2
        };
      }
      button.$set(button_changes);
      const docview_changes = {};
      if (dirty & /*doc*/
      1)
        docview_changes.doc = /*doc*/
        ctx2[0];
      docview.$set(docview_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(button.$$.fragment, local);
      transition_in(docview.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(button.$$.fragment, local);
      transition_out(docview.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(div1);
      }
      destroy_component(button);
      destroy_component(docview);
    }
  };
}
function create_default_slot(ctx) {
  let t;
  return {
    c() {
      t = text("log");
    },
    m(target, anchor) {
      insert(target, t, anchor);
    },
    d(detaching) {
      if (detaching) {
        detach(t);
      }
    }
  };
}
function create_right_slot$1(ctx) {
  let div1;
  let div0;
  let h2;
  let t1;
  let button;
  let t2;
  let treeview;
  let current;
  button = new Button({
    props: {
      $$slots: {
        default: [create_default_slot]
      },
      $$scope: {
        ctx
      }
    }
  });
  button.$on(
    "click",
    /*handleClickLogNode*/
    ctx[4]
  );
  treeview = new TreeView({
    props: {
      class: "m-top",
      data: (
        /*jsonNode*/
        ctx[1]
      ),
      recursionOpts: {
        shouldExpandNode: func
      }
    }
  });
  return {
    c() {
      div1 = element("div");
      div0 = element("div");
      h2 = element("h2");
      h2.textContent = "Node info";
      t1 = space();
      create_component(button.$$.fragment);
      t2 = space();
      create_component(treeview.$$.fragment);
      attr(div0, "class", "top-row svelte-15i66m0");
      attr(div1, "slot", "right");
      attr(div1, "class", "right-panel svelte-15i66m0");
    },
    m(target, anchor) {
      insert(target, div1, anchor);
      append(div1, div0);
      append(div0, h2);
      append(div0, t1);
      mount_component(button, div0, null);
      append(div1, t2);
      mount_component(treeview, div1, null);
      current = true;
    },
    p(ctx2, dirty) {
      const button_changes = {};
      if (dirty & /*$$scope*/
      256) {
        button_changes.$$scope = {
          dirty,
          ctx: ctx2
        };
      }
      button.$set(button_changes);
      const treeview_changes = {};
      if (dirty & /*jsonNode*/
      2)
        treeview_changes.data = /*jsonNode*/
        ctx2[1];
      treeview.$set(treeview_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(button.$$.fragment, local);
      transition_in(treeview.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(button.$$.fragment, local);
      transition_out(treeview.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(div1);
      }
      destroy_component(button);
      destroy_component(treeview);
    }
  };
}
function create_fragment$4(ctx) {
  let splitview;
  let current;
  splitview = new SplitView({
    props: {
      $$slots: {
        right: [create_right_slot$1],
        left: [create_left_slot]
      },
      $$scope: {
        ctx
      }
    }
  });
  return {
    c() {
      create_component(splitview.$$.fragment);
    },
    m(target, anchor) {
      mount_component(splitview, target, anchor);
      current = true;
    },
    p(ctx2, _ref) {
      let [dirty] = _ref;
      const splitview_changes = {};
      if (dirty & /*$$scope, jsonNode, doc*/
      259) {
        splitview_changes.$$scope = {
          dirty,
          ctx: ctx2
        };
      }
      splitview.$set(splitview_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(splitview.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(splitview.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(splitview, detaching);
    }
  };
}
function getScrollableParent(el) {
  if (!el || el === document.body)
    return void 0;
  else if (el.scrollHeight !== el.clientHeight)
    return el;
  return getScrollableParent(el.parentElement);
}
const func = (n) => n.type !== "array" || n.value.length <= 50;
function instance$4($$self, $$props, $$invalidate) {
  let jsonNode;
  const {
    view
  } = getContext("editor-view");
  let doc2 = view.state.doc;
  let selected = {
    node: view.state.doc,
    pos: 0
  };
  let schema = view.state.schema;
  let timer;
  latestEntry.subscribe((e) => {
    if (!e)
      return;
    e.trs.forEach((tr) => {
      $$invalidate(5, selected.pos = tr.mapping.map(selected.pos), selected);
    });
    clearTimeout(timer);
    timer = setTimeout(() => {
      $$invalidate(0, doc2 = e.state.doc);
      const pos = selected.pos;
      try {
        const node = doc2.nodeAt(pos);
        $$invalidate(5, selected = {
          node: node || doc2,
          pos: node ? pos : 0
        });
      } catch (err) {
      }
    }, 100);
  });
  function handleNodeSelect(node, startPos) {
    let scroll = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : false;
    var _a;
    $$invalidate(5, selected = {
      node,
      pos: startPos
    });
    if (!scroll)
      return;
    let nodeDom = view.nodeDOM(startPos);
    while (nodeDom && !(nodeDom instanceof HTMLElement)) {
      nodeDom = nodeDom.parentElement;
    }
    if (!nodeDom || getComputedStyle(nodeDom).display === "none")
      return;
    const parentWithScrollbar = getScrollableParent(view.dom);
    if (parentWithScrollbar) {
      const alreadyScrolled = parentWithScrollbar.scrollTop;
      const parentOffset = parentWithScrollbar.offsetTop - window.scrollY;
      const parentTop = parentWithScrollbar.getBoundingClientRect().top - parentOffset;
      const nodeTop2 = nodeDom.getBoundingClientRect().top - parentOffset;
      const halfwayParent = parentWithScrollbar.clientHeight / 2;
      parentWithScrollbar.scroll(0, alreadyScrolled + parentTop + nodeTop2 - halfwayParent);
    }
    const nodeTop = view.coordsAtPos(startPos).top;
    const dockHeight = ((_a = document.querySelector(".floating-dock")) === null || _a === void 0 ? void 0 : _a.clientHeight) || 0;
    window.scroll(0, nodeTop - dockHeight + nodeDom.clientHeight + window.scrollY);
  }
  function handleClickLogNode() {
    console.log(selected);
    window._node = selected;
    console.info("%c [prosemirror-dev-toolkit]: Property added to window._node", "color: #b8e248");
  }
  $$self.$$.update = () => {
    if ($$self.$$.dirty & /*selected*/
    32) {
      $$invalidate(1, jsonNode = selected.node.toJSON());
    }
  };
  return [doc2, jsonNode, schema, handleNodeSelect, handleClickLogNode, selected];
}
class StructureTab extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$4, create_fragment$4, safe_not_equal, {}, add_css$4);
  }
}
function add_css$3(target) {
  append_styles(target, "svelte-969ox4", "ul.svelte-969ox4.svelte-969ox4{color:#fff;list-style:none;margin:0;padding:0;height:100%;width:100%}li.svelte-969ox4+li.svelte-969ox4{border-top:1px solid rgb(96, 76, 104)}li.svelte-969ox4.svelte-969ox4{align-items:center;display:flex;font-family:monospace;padding:6px 18px}input.svelte-969ox4.svelte-969ox4{background:transparent;border:0;color:#fff;height:100%;margin:0;padding:2px;width:100%}.unstyled-btn.svelte-969ox4.svelte-969ox4{background:transparent;border:0;color:#fff;cursor:pointer;display:block;font-family:monospace;margin:0;padding:0;text-align:start;width:100%}.snapshot-btn.svelte-969ox4.svelte-969ox4{background:transparent;border:0;border-radius:3px;color:#d3d3d9;cursor:pointer;display:flex;font-size:11px;padding:6px 18px;text-transform:uppercase}.snapshot-btn.svelte-969ox4.svelte-969ox4:hover{background:rgba(255, 162, 177, 0.4);color:#fff}.ml-2.svelte-969ox4.svelte-969ox4{margin-left:1rem}");
}
function get_each_context(ctx, list, i) {
  const child_ctx = ctx.slice();
  child_ctx[23] = list[i];
  return child_ctx;
}
function create_else_block_2(ctx) {
  let button;
  let t_value = (
    /*snap*/
    ctx[23].name + ""
  );
  let t;
  let mounted2;
  let dispose;
  function dblclick_handler() {
    return (
      /*dblclick_handler*/
      ctx[16](
        /*snap*/
        ctx[23]
      )
    );
  }
  return {
    c() {
      button = element("button");
      t = text(t_value);
      attr(button, "class", "unstyled-btn svelte-969ox4");
      attr(button, "aria-label", "Edit snapshot name button");
    },
    m(target, anchor) {
      insert(target, button, anchor);
      append(button, t);
      if (!mounted2) {
        dispose = listen(button, "dblclick", dblclick_handler);
        mounted2 = true;
      }
    },
    p(new_ctx, dirty) {
      ctx = new_ctx;
      if (dirty & /*snapshots*/
      1 && t_value !== (t_value = /*snap*/
      ctx[23].name + ""))
        set_data(t, t_value);
    },
    d(detaching) {
      if (detaching) {
        detach(button);
      }
      mounted2 = false;
      dispose();
    }
  };
}
function create_if_block_2$1(ctx) {
  let input;
  let input_value_value;
  let mounted2;
  let dispose;
  return {
    c() {
      input = element("input");
      input.value = input_value_value = /*editedSnap*/
      ctx[2].name;
      attr(input, "class", "svelte-969ox4");
    },
    m(target, anchor) {
      insert(target, input, anchor);
      if (!mounted2) {
        dispose = [listen(
          input,
          "input",
          /*handleNameChange*/
          ctx[5]
        ), listen(
          input,
          "keypress",
          /*handleNameKeyPress*/
          ctx[6]
        )];
        mounted2 = true;
      }
    },
    p(ctx2, dirty) {
      if (dirty & /*editedSnap*/
      4 && input_value_value !== (input_value_value = /*editedSnap*/
      ctx2[2].name) && input.value !== input_value_value) {
        input.value = input_value_value;
      }
    },
    d(detaching) {
      if (detaching) {
        detach(input);
      }
      mounted2 = false;
      run_all(dispose);
    }
  };
}
function create_else_block_1(ctx) {
  let t;
  return {
    c() {
      t = text("Show");
    },
    m(target, anchor) {
      insert(target, t, anchor);
    },
    d(detaching) {
      if (detaching) {
        detach(t);
      }
    }
  };
}
function create_if_block_1$1(ctx) {
  let t;
  return {
    c() {
      t = text("Hide");
    },
    m(target, anchor) {
      insert(target, t, anchor);
    },
    d(detaching) {
      if (detaching) {
        detach(t);
      }
    }
  };
}
function create_else_block$3(ctx) {
  let t;
  return {
    c() {
      t = text("Delete");
    },
    m(target, anchor) {
      insert(target, t, anchor);
    },
    d(detaching) {
      if (detaching) {
        detach(t);
      }
    }
  };
}
function create_if_block$3(ctx) {
  let t;
  return {
    c() {
      t = text("Confirm Delete");
    },
    m(target, anchor) {
      insert(target, t, anchor);
    },
    d(detaching) {
      if (detaching) {
        detach(t);
      }
    }
  };
}
function create_each_block(ctx) {
  let li;
  let t0;
  let button0;
  let t1;
  let button1;
  let t3;
  let button2;
  let t5;
  let button3;
  let t6;
  let mounted2;
  let dispose;
  function select_block_type(ctx2, dirty) {
    if (
      /*editedSnap*/
      ctx2[2] && /*editedSnap*/
      ctx2[2].timestamp === /*snap*/
      ctx2[23].timestamp
    )
      return create_if_block_2$1;
    return create_else_block_2;
  }
  let current_block_type = select_block_type(ctx);
  let if_block0 = current_block_type(ctx);
  function select_block_type_1(ctx2, dirty) {
    var _ctx$;
    if (
      /*selectedSnapshot*/
      ((_ctx$ = ctx2[1]) === null || _ctx$ === void 0 ? void 0 : _ctx$.timestamp) === /*snap*/
      ctx2[23].timestamp
    )
      return create_if_block_1$1;
    return create_else_block_1;
  }
  let current_block_type_1 = select_block_type_1(ctx);
  let if_block1 = current_block_type_1(ctx);
  function click_handler() {
    return (
      /*click_handler*/
      ctx[17](
        /*snap*/
        ctx[23]
      )
    );
  }
  function click_handler_1() {
    return (
      /*click_handler_1*/
      ctx[18](
        /*snap*/
        ctx[23]
      )
    );
  }
  function click_handler_2() {
    return (
      /*click_handler_2*/
      ctx[19](
        /*snap*/
        ctx[23]
      )
    );
  }
  function select_block_type_2(ctx2, dirty) {
    var _ctx$2;
    if (
      /*deleteSnap*/
      ((_ctx$2 = ctx2[3]) === null || _ctx$2 === void 0 ? void 0 : _ctx$2.timestamp) === /*snap*/
      ctx2[23].timestamp
    )
      return create_if_block$3;
    return create_else_block$3;
  }
  let current_block_type_2 = select_block_type_2(ctx);
  let if_block2 = current_block_type_2(ctx);
  function click_handler_3() {
    return (
      /*click_handler_3*/
      ctx[20](
        /*snap*/
        ctx[23]
      )
    );
  }
  return {
    c() {
      li = element("li");
      if_block0.c();
      t0 = space();
      button0 = element("button");
      if_block1.c();
      t1 = space();
      button1 = element("button");
      button1.textContent = "Restore";
      t3 = space();
      button2 = element("button");
      button2.textContent = "Export";
      t5 = space();
      button3 = element("button");
      if_block2.c();
      t6 = space();
      attr(button0, "class", "snapshot-btn ml-2 svelte-969ox4");
      attr(button1, "class", "snapshot-btn svelte-969ox4");
      attr(button2, "class", "snapshot-btn svelte-969ox4");
      attr(button3, "class", "snapshot-btn svelte-969ox4");
      attr(li, "class", "svelte-969ox4");
    },
    m(target, anchor) {
      insert(target, li, anchor);
      if_block0.m(li, null);
      append(li, t0);
      append(li, button0);
      if_block1.m(button0, null);
      append(li, t1);
      append(li, button1);
      append(li, t3);
      append(li, button2);
      append(li, t5);
      append(li, button3);
      if_block2.m(button3, null);
      append(li, t6);
      if (!mounted2) {
        dispose = [listen(button0, "click", click_handler), listen(button1, "click", click_handler_1), listen(button2, "click", click_handler_2), listen(button3, "click", click_handler_3)];
        mounted2 = true;
      }
    },
    p(new_ctx, dirty) {
      ctx = new_ctx;
      if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block0) {
        if_block0.p(ctx, dirty);
      } else {
        if_block0.d(1);
        if_block0 = current_block_type(ctx);
        if (if_block0) {
          if_block0.c();
          if_block0.m(li, t0);
        }
      }
      if (current_block_type_1 !== (current_block_type_1 = select_block_type_1(ctx))) {
        if_block1.d(1);
        if_block1 = current_block_type_1(ctx);
        if (if_block1) {
          if_block1.c();
          if_block1.m(button0, null);
        }
      }
      if (current_block_type_2 !== (current_block_type_2 = select_block_type_2(ctx))) {
        if_block2.d(1);
        if_block2 = current_block_type_2(ctx);
        if (if_block2) {
          if_block2.c();
          if_block2.m(button3, null);
        }
      }
    },
    d(detaching) {
      if (detaching) {
        detach(li);
      }
      if_block0.d();
      if_block1.d();
      if_block2.d();
      mounted2 = false;
      run_all(dispose);
    }
  };
}
function create_fragment$3(ctx) {
  let ul;
  let each_value = ensure_array_like(
    /*snapshots*/
    ctx[0]
  );
  let each_blocks = [];
  for (let i = 0; i < each_value.length; i += 1) {
    each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
  }
  return {
    c() {
      ul = element("ul");
      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].c();
      }
      attr(ul, "class", "svelte-969ox4");
    },
    m(target, anchor) {
      insert(target, ul, anchor);
      for (let i = 0; i < each_blocks.length; i += 1) {
        if (each_blocks[i]) {
          each_blocks[i].m(ul, null);
        }
      }
    },
    p(ctx2, _ref) {
      let [dirty] = _ref;
      if (dirty & /*handleClickDelete, snapshots, deleteSnap, handleExportClick, handleRestoreClick, handleClickView, selectedSnapshot, editedSnap, handleNameChange, handleNameKeyPress, handleSnapDoubleclick*/
      2047) {
        each_value = ensure_array_like(
          /*snapshots*/
          ctx2[0]
        );
        let i;
        for (i = 0; i < each_value.length; i += 1) {
          const child_ctx = get_each_context(ctx2, each_value, i);
          if (each_blocks[i]) {
            each_blocks[i].p(child_ctx, dirty);
          } else {
            each_blocks[i] = create_each_block(child_ctx);
            each_blocks[i].c();
            each_blocks[i].m(ul, null);
          }
        }
        for (; i < each_blocks.length; i += 1) {
          each_blocks[i].d(1);
        }
        each_blocks.length = each_value.length;
      }
    },
    i: noop,
    o: noop,
    d(detaching) {
      if (detaching) {
        detach(ul);
      }
      destroy_each(each_blocks, detaching);
    }
  };
}
function instance$3($$self, $$props, $$invalidate) {
  let {
    snapshots: snapshots2 = [],
    selectedSnapshot: selectedSnapshot2 = void 0,
    onUpdate,
    onView,
    onRestore,
    onExport,
    onDelete
  } = $$props;
  let editedSnap;
  let deleteSnap;
  let timer;
  const debounceUpdate = () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      onUpdate(editedSnap);
    }, 150);
  };
  function handleSnapDoubleclick(snap) {
    $$invalidate(2, editedSnap = snap);
    $$invalidate(3, deleteSnap = void 0);
  }
  function handleNameChange(evt) {
    if (editedSnap) {
      $$invalidate(2, editedSnap.name = evt.currentTarget.value, editedSnap);
      debounceUpdate();
    }
  }
  function handleNameKeyPress(evt) {
    if (evt.key === "Enter" && editedSnap) {
      onUpdate(editedSnap);
      clearTimeout(timer);
      $$invalidate(2, editedSnap = void 0);
      $$invalidate(3, deleteSnap = void 0);
    }
  }
  function handleClickView(snap) {
    if ((selectedSnapshot2 === null || selectedSnapshot2 === void 0 ? void 0 : selectedSnapshot2.timestamp) === snap.timestamp) {
      onView();
    } else {
      onView(snap);
    }
    $$invalidate(3, deleteSnap = void 0);
  }
  function handleRestoreClick(snap) {
    onRestore(snap);
    $$invalidate(3, deleteSnap = void 0);
  }
  function handleExportClick(snap) {
    onExport(snap);
    $$invalidate(3, deleteSnap = void 0);
  }
  function handleClickDelete(snap) {
    if (!deleteSnap || deleteSnap.timestamp !== snap.timestamp) {
      $$invalidate(3, deleteSnap = snap);
    } else {
      onDelete(snap);
      $$invalidate(3, deleteSnap = void 0);
    }
  }
  const dblclick_handler = (snap) => handleSnapDoubleclick(snap);
  const click_handler = (snap) => handleClickView(snap);
  const click_handler_1 = (snap) => handleRestoreClick(snap);
  const click_handler_2 = (snap) => handleExportClick(snap);
  const click_handler_3 = (snap) => handleClickDelete(snap);
  $$self.$$set = ($$props2) => {
    if ("snapshots" in $$props2)
      $$invalidate(0, snapshots2 = $$props2.snapshots);
    if ("selectedSnapshot" in $$props2)
      $$invalidate(1, selectedSnapshot2 = $$props2.selectedSnapshot);
    if ("onUpdate" in $$props2)
      $$invalidate(11, onUpdate = $$props2.onUpdate);
    if ("onView" in $$props2)
      $$invalidate(12, onView = $$props2.onView);
    if ("onRestore" in $$props2)
      $$invalidate(13, onRestore = $$props2.onRestore);
    if ("onExport" in $$props2)
      $$invalidate(14, onExport = $$props2.onExport);
    if ("onDelete" in $$props2)
      $$invalidate(15, onDelete = $$props2.onDelete);
  };
  return [snapshots2, selectedSnapshot2, editedSnap, deleteSnap, handleSnapDoubleclick, handleNameChange, handleNameKeyPress, handleClickView, handleRestoreClick, handleExportClick, handleClickDelete, onUpdate, onView, onRestore, onExport, onDelete, dblclick_handler, click_handler, click_handler_1, click_handler_2, click_handler_3];
}
class SnapshotsList extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$3, create_fragment$3, safe_not_equal, {
      snapshots: 0,
      selectedSnapshot: 1,
      onUpdate: 11,
      onView: 12,
      onRestore: 13,
      onExport: 14,
      onDelete: 15
    }, add_css$3);
  }
}
function add_css$2(target) {
  append_styles(target, "svelte-3jdj5c", ".right-panel[slot=right].svelte-3jdj5c{padding:0}.no-snapshots.svelte-3jdj5c{align-items:center;color:rgb(255, 162, 177);display:flex;font-size:14px;height:100%;justify-content:center;width:100%}");
}
function create_else_block$2(ctx) {
  let snapshotslist;
  let current;
  snapshotslist = new SnapshotsList({
    props: {
      snapshots: (
        /*$snapshots*/
        ctx[0]
      ),
      selectedSnapshot: (
        /*$selectedSnapshot*/
        ctx[1]
      ),
      onUpdate: updateSnapshot,
      onView: (
        /*func*/
        ctx[4]
      ),
      onRestore: (
        /*handleRestoreSnapshot*/
        ctx[3]
      ),
      onExport: exportSnapshot,
      onDelete: deleteSnapshot
    }
  });
  return {
    c() {
      create_component(snapshotslist.$$.fragment);
    },
    m(target, anchor) {
      mount_component(snapshotslist, target, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      const snapshotslist_changes = {};
      if (dirty & /*$snapshots*/
      1)
        snapshotslist_changes.snapshots = /*$snapshots*/
        ctx2[0];
      if (dirty & /*$selectedSnapshot*/
      2)
        snapshotslist_changes.selectedSnapshot = /*$selectedSnapshot*/
        ctx2[1];
      snapshotslist.$set(snapshotslist_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(snapshotslist.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(snapshotslist.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(snapshotslist, detaching);
    }
  };
}
function create_if_block$2(ctx) {
  let div;
  return {
    c() {
      div = element("div");
      div.textContent = 'Save snapshots by clicking "Save" button.';
      attr(div, "class", "no-snapshots svelte-3jdj5c");
    },
    m(target, anchor) {
      insert(target, div, anchor);
    },
    p: noop,
    i: noop,
    o: noop,
    d(detaching) {
      if (detaching) {
        detach(div);
      }
    }
  };
}
function create_right_slot(ctx) {
  let div;
  let current_block_type_index;
  let if_block;
  let current;
  const if_block_creators = [create_if_block$2, create_else_block$2];
  const if_blocks = [];
  function select_block_type(ctx2, dirty) {
    if (
      /*$snapshots*/
      ctx2[0].length === 0
    )
      return 0;
    return 1;
  }
  current_block_type_index = select_block_type(ctx);
  if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
  return {
    c() {
      div = element("div");
      if_block.c();
      attr(div, "slot", "right");
      attr(div, "class", "right-panel svelte-3jdj5c");
    },
    m(target, anchor) {
      insert(target, div, anchor);
      if_blocks[current_block_type_index].m(div, null);
      current = true;
    },
    p(ctx2, dirty) {
      let previous_block_index = current_block_type_index;
      current_block_type_index = select_block_type(ctx2);
      if (current_block_type_index === previous_block_index) {
        if_blocks[current_block_type_index].p(ctx2, dirty);
      } else {
        group_outros();
        transition_out(if_blocks[previous_block_index], 1, 1, () => {
          if_blocks[previous_block_index] = null;
        });
        check_outros();
        if_block = if_blocks[current_block_type_index];
        if (!if_block) {
          if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx2);
          if_block.c();
        } else {
          if_block.p(ctx2, dirty);
        }
        transition_in(if_block, 1);
        if_block.m(div, null);
      }
    },
    i(local) {
      if (current)
        return;
      transition_in(if_block);
      current = true;
    },
    o(local) {
      transition_out(if_block);
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(div);
      }
      if_blocks[current_block_type_index].d();
    }
  };
}
function create_fragment$2(ctx) {
  let splitview;
  let current;
  splitview = new SplitView({
    props: {
      $$slots: {
        right: [create_right_slot]
      },
      $$scope: {
        ctx
      }
    }
  });
  return {
    c() {
      create_component(splitview.$$.fragment);
    },
    m(target, anchor) {
      mount_component(splitview, target, anchor);
      current = true;
    },
    p(ctx2, _ref) {
      let [dirty] = _ref;
      const splitview_changes = {};
      if (dirty & /*$$scope, $snapshots, $selectedSnapshot*/
      35) {
        splitview_changes.$$scope = {
          dirty,
          ctx: ctx2
        };
      }
      splitview.$set(splitview_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(splitview.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(splitview.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(splitview, detaching);
    }
  };
}
function instance$2($$self, $$props, $$invalidate) {
  let $snapshots;
  let $selectedSnapshot;
  component_subscribe($$self, snapshots, ($$value) => $$invalidate(0, $snapshots = $$value));
  component_subscribe($$self, selectedSnapshot, ($$value) => $$invalidate(1, $selectedSnapshot = $$value));
  const {
    view
  } = getContext("editor-view");
  function handleRestoreSnapshot(snapshot) {
    restoreSnapshot(view, snapshot);
    resetHistory();
  }
  const func2 = (snap) => toggleViewSnapshot(view, snap);
  return [$snapshots, $selectedSnapshot, view, handleRestoreSnapshot, func2];
}
class SnapshotsTab extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$2, create_fragment$2, safe_not_equal, {}, add_css$2);
  }
}
function add_css$1(target) {
  append_styles(target, "svelte-1quf800", ".floating-dock-wrapper.svelte-1quf800{position:fixed;width:0px;height:0px;top:0px;left:0px;z-index:99999999}.floating-dock.svelte-1quf800{background-color:#363755;position:fixed;z-index:1;box-shadow:rgba(34, 34, 34, 0.3) 0px 0px 4px 0px;left:0px;top:50%;width:100%;height:50%}.resizing-div.svelte-1quf800{position:absolute;z-index:2;opacity:0;top:-5px;height:10px;left:0px;width:100%;cursor:row-resize}.floating-dock-body.svelte-1quf800{height:100%}button.svelte-1quf800{background:rgba(255, 162, 177, 0.6);border:0;border-radius:3px;color:#fff;cursor:pointer;font-size:12px;height:24px;line-height:25px;padding:0 6px;position:absolute}button.svelte-1quf800:hover{background:rgba(255, 162, 177, 0.8)}.copy-btn.svelte-1quf800{right:173px;top:-28px}.save-btn.svelte-1quf800{right:129px;top:-28px}.import-btn.svelte-1quf800{right:79px;top:-28px}.paste-btn.svelte-1quf800{right:32px;top:-28px}.close-btn.svelte-1quf800{font-size:var(--font-medium);right:4px;top:-28px;width:24px}");
}
function create_else_block$1(ctx) {
  let p;
  return {
    c() {
      p = element("p");
      p.textContent = "nuting here";
    },
    m(target, anchor) {
      insert(target, p, anchor);
    },
    i: noop,
    o: noop,
    d(detaching) {
      if (detaching) {
        detach(p);
      }
    }
  };
}
function create_if_block_5(ctx) {
  let snapshotstab;
  let current;
  snapshotstab = new SnapshotsTab({});
  return {
    c() {
      create_component(snapshotstab.$$.fragment);
    },
    m(target, anchor) {
      mount_component(snapshotstab, target, anchor);
      current = true;
    },
    i(local) {
      if (current)
        return;
      transition_in(snapshotstab.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(snapshotstab.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(snapshotstab, detaching);
    }
  };
}
function create_if_block_4(ctx) {
  let structuretab;
  let current;
  structuretab = new StructureTab({});
  return {
    c() {
      create_component(structuretab.$$.fragment);
    },
    m(target, anchor) {
      mount_component(structuretab, target, anchor);
      current = true;
    },
    i(local) {
      if (current)
        return;
      transition_in(structuretab.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(structuretab.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(structuretab, detaching);
    }
  };
}
function create_if_block_3(ctx) {
  let schematab;
  let current;
  schematab = new SchemaTab({});
  return {
    c() {
      create_component(schematab.$$.fragment);
    },
    m(target, anchor) {
      mount_component(schematab, target, anchor);
      current = true;
    },
    i(local) {
      if (current)
        return;
      transition_in(schematab.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(schematab.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(schematab, detaching);
    }
  };
}
function create_if_block_2(ctx) {
  let pluginstab;
  let current;
  pluginstab = new PluginsTab({});
  return {
    c() {
      create_component(pluginstab.$$.fragment);
    },
    m(target, anchor) {
      mount_component(pluginstab, target, anchor);
      current = true;
    },
    i(local) {
      if (current)
        return;
      transition_in(pluginstab.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(pluginstab.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(pluginstab, detaching);
    }
  };
}
function create_if_block_1(ctx) {
  let historytab;
  let current;
  historytab = new HistoryTab({});
  return {
    c() {
      create_component(historytab.$$.fragment);
    },
    m(target, anchor) {
      mount_component(historytab, target, anchor);
      current = true;
    },
    i(local) {
      if (current)
        return;
      transition_in(historytab.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(historytab.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(historytab, detaching);
    }
  };
}
function create_if_block$1(ctx) {
  let statetab;
  let current;
  statetab = new StateTab({});
  return {
    c() {
      create_component(statetab.$$.fragment);
    },
    m(target, anchor) {
      mount_component(statetab, target, anchor);
      current = true;
    },
    i(local) {
      if (current)
        return;
      transition_in(statetab.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(statetab.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(statetab, detaching);
    }
  };
}
function create_fragment$1(ctx) {
  let div4;
  let pastemodal;
  let t0;
  let div3;
  let div0;
  let t1;
  let div2;
  let div1;
  let button0;
  let t3;
  let button1;
  let t5;
  let button2;
  let t7;
  let button3;
  let t9;
  let button4;
  let t11;
  let input;
  let t12;
  let tabsmenu;
  let t13;
  let current_block_type_index;
  let if_block;
  let div3_style_value;
  let current;
  let mounted2;
  let dispose;
  pastemodal = new PasteModal({
    props: {
      isOpen: (
        /*modalOpen*/
        ctx[5]
      )
    }
  });
  pastemodal.$on(
    "submit",
    /*handlePasteSubmit*/
    ctx[12]
  );
  pastemodal.$on(
    "close",
    /*handleCloseModal*/
    ctx[11]
  );
  tabsmenu = new TabsMenu({
    props: {
      onClickTab: (
        /*handleClickTab*/
        ctx[14]
      ),
      active: (
        /*openTab*/
        ctx[1]
      )
    }
  });
  const if_block_creators = [create_if_block$1, create_if_block_1, create_if_block_2, create_if_block_3, create_if_block_4, create_if_block_5, create_else_block$1];
  const if_blocks = [];
  function select_block_type(ctx2, dirty) {
    if (
      /*openTab*/
      ctx2[1] === "state"
    )
      return 0;
    if (
      /*openTab*/
      ctx2[1] === "history"
    )
      return 1;
    if (
      /*openTab*/
      ctx2[1] === "plugins"
    )
      return 2;
    if (
      /*openTab*/
      ctx2[1] === "schema"
    )
      return 3;
    if (
      /*openTab*/
      ctx2[1] === "structure"
    )
      return 4;
    if (
      /*openTab*/
      ctx2[1] === "snapshots"
    )
      return 5;
    return 6;
  }
  current_block_type_index = select_block_type(ctx);
  if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
  return {
    c() {
      div4 = element("div");
      create_component(pastemodal.$$.fragment);
      t0 = space();
      div3 = element("div");
      div0 = element("div");
      t1 = space();
      div2 = element("div");
      div1 = element("div");
      button0 = element("button");
      button0.textContent = "Copy";
      t3 = space();
      button1 = element("button");
      button1.textContent = "Save";
      t5 = space();
      button2 = element("button");
      button2.textContent = "Import";
      t7 = space();
      button3 = element("button");
      button3.textContent = "Paste";
      t9 = space();
      button4 = element("button");
      button4.textContent = "X";
      t11 = space();
      input = element("input");
      t12 = space();
      create_component(tabsmenu.$$.fragment);
      t13 = space();
      if_block.c();
      attr(div0, "class", "resizing-div svelte-1quf800");
      attr(div0, "role", "button");
      attr(div0, "tabindex", "-1");
      attr(button0, "class", "copy-btn svelte-1quf800");
      attr(button1, "class", "save-btn svelte-1quf800");
      attr(button2, "class", "import-btn svelte-1quf800");
      attr(button3, "class", "paste-btn svelte-1quf800");
      attr(button4, "class", "close-btn svelte-1quf800");
      attr(button4, "aria-label", "Close dev-toolkit");
      set_style(input, "display", "none");
      attr(input, "type", "file");
      attr(input, "accept", ".json");
      input.multiple = true;
      attr(div2, "class", "floating-dock-body svelte-1quf800");
      attr(div3, "class", "floating-dock svelte-1quf800");
      attr(div3, "style", div3_style_value = "top: ".concat(
        /*dockTop*/
        ctx[2],
        "%; height: "
      ).concat(
        /*dockHeight*/
        ctx[3],
        "%;"
      ));
class attribute of an HTML element with the id "div4" to a value that includes a comma and the
characters "
      attr(div4, "class ","
        },
    m(target, anchor) {
      insert(target, div4, anchor);
      mount_component(pastemodal, div4, null);
      append(div4, t0);
      append(div4, div3);
      append(div3, div0);
      append(div3, t1);
      append(div3, div2);
      append(div2, div1);
      append(div1, button0);
      append(div1, t3);
      append(div1, button1);
      append(div1, t5);
      append(div1, button2);
      append(div1, t7);
      append(div1, button3);
      append(div1, t9);
      append(div1, button4);
      append(div2, t11);
      append(div2, input);
      ctx[15](input);
      append(div2, t12);
      mount_component(tabsmenu, div2, null);
      append(div2, t13);
      if_blocks[current_block_type_index].m(div2, null);
      current = true;
      if (!mounted2) {
        dispose = [listen(
          div0,
          "mousedown",
          /*handleResizeMouseDown*/
          ctx[6]
        ), listen(
          button0,
          "click",
          /*handleCopyDoc*/
          ctx[7]
        ), listen(
          button1,
          "click",
          /*handleSaveSnapshot*/
          ctx[8]
        ), listen(
          button2,
          "click",
          /*handleImportSnapshot*/
          ctx[9]
        ), listen(
          button3,
          "click",
          /*handlePasteSnapshot*/
          ctx[10]
        ), listen(button4, "click", function() {
          if (is_function(
            /*onClose*/
            ctx[0]
          ))
            ctx[0].apply(this, arguments);
        }), listen(
          input,
          "change",
          /*handleFileSelected*/
          ctx[13]
        )];
        mounted2 = true;
      }
    },
    p(new_ctx, _ref) {
      let [dirty] = _ref;
      ctx = new_ctx;
      const pastemodal_changes = {};
      if (dirty & /*modalOpen*/
      32)
        pastemodal_changes.isOpen = /*modalOpen*/
        ctx[5];
      pastemodal.$set(pastemodal_changes);
      const tabsmenu_changes = {};
      if (dirty & /*openTab*/
      2)
        tabsmenu_changes.active = /*openTab*/
        ctx[1];
      tabsmenu.$set(tabsmenu_changes);
      let previous_block_index = current_block_type_index;
      current_block_type_index = select_block_type(ctx);
      if (current_block_type_index !== previous_block_index) {
        group_outros();
        transition_out(if_blocks[previous_block_index], 1, 1, () => {
          if_blocks[previous_block_index] = null;
        });
        check_outros();
        if_block = if_blocks[current_block_type_index];
        if (!if_block) {
          if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
          if_block.c();
        }
        transition_in(if_block, 1);
        if_block.m(div2, null);
      }
      if (!current || dirty & /*dockTop, dockHeight*/
      12 && div3_style_value !== (div3_style_value = "top: ".concat(
        /*dockTop*/
        ctx[2],
        "%; height: "
      ).concat(
        /*dockHeight*/
        ctx[3],
        "%;"
      ))) {
        attr(div3, "style", div3_style_value);
      }
    },
    i(local) {
      if (current)
        return;
      transition_in(pastemodal.$$.fragment, local);
      transition_in(tabsmenu.$$.fragment, local);
      transition_in(if_block);
      current = true;
    },
    o(local) {
      transition_out(pastemodal.$$.fragment, local);
      transition_out(tabsmenu.$$.fragment, local);
      transition_out(if_block);
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(div4);
      }
      destroy_component(pastemodal);
      ctx[15](null);
      destroy_component(tabsmenu);
      if_blocks[current_block_type_index].d();
      mounted2 = false;
      run_all(dispose);
    }
  };
}
function instance$1($$self, $$props, $$invalidate) {
  let {
    onClose
  } = $$props;
  const {
    view
  } = getContext("editor-view");
  let openTab = "state", dockTop = 50, dockHeight = 50, fileinput, modalOpen = false;
  onDestroy(() => {
    document.removeEventListener("mousemove", dragMove);
    document.removeEventListener("mouseup", dragEnd);
  });
  function handleResizeMouseDown() {
    document.addEventListener("mousemove", dragMove);
    document.addEventListener("mouseup", dragEnd);
  }
  function dragMove(evt) {
    evt.preventDefault();
    $$invalidate(2, dockTop = 100 * evt.clientY / window.innerHeight);
    $$invalidate(3, dockHeight = 100 * (1 - evt.clientY / window.innerHeight));
  }
  function dragEnd(evt) {
    evt.preventDefault();
    document.removeEventListener("mousemove", dragMove);
    document.removeEventListener("mouseup", dragEnd);
  }
  function handleCopyDoc() {
    navigator.clipboard.writeText(JSON.stringify(view.state.doc.toJSON()));
  }
  function handleSaveSnapshot() {
    const defaultName = (/* @__PURE__ */ new Date()).toLocaleString("sv");
    const snapshotName = prompt("Enter snapshot name", defaultName);
    if (snapshotName) {
      saveSnapshot(snapshotName, view.state.doc.toJSON());
    }
  }
  function handleImportSnapshot() {
    fileinput.click();
  }
  function handlePasteSnapshot() {
    $$invalidate(5, modalOpen = !modalOpen);
  }
  function handleCloseModal() {
    $$invalidate(5, modalOpen = false);
  }
  function handlePasteSubmit(e) {
    const snap = saveSnapshot((/* @__PURE__ */ new Date()).toLocaleString("sv"), e.detail.doc);
    restoreSnapshot(view, snap);
    $$invalidate(5, modalOpen = false);
  }
  function handleFileSelected(e) {
    Array.from(e.currentTarget.files || []).forEach((file) => {
      const reader = new FileReader();
      reader.readAsText(file);
      reader.onload = (e2) => {
        var _a, _b;
        const data = typeof ((_a = e2.target) === null || _a === void 0 ? void 0 : _a.result) === "string" ? (_b = e2.target) === null || _b === void 0 ? void 0 : _b.result : "";
        try {
          const json = JSON.parse(data);
          if (!json || typeof json !== "object") {
            throw Error("Imported snapshot was not a JSON object" + json);
          }
          const name = file.name.slice(0, file.name.lastIndexOf("."));
          importSnapshot(name, json, view.state.schema);
        } catch (err) {
          console.error("Failed to import snapshot: " + err);
        }
      };
    });
  }
  function handleClickTab(tab) {
    $$invalidate(1, openTab = tab);
  }
  function input_binding($$value) {
    binding_callbacks[$$value ? "unshift" : "push"](() => {
      fileinput = $$value;
      $$invalidate(4, fileinput);
    });
  }
  $$self.$$set = ($$props2) => {
    if ("onClose" in $$props2)
      $$invalidate(0, onClose = $$props2.onClose);
  };
  return [onClose, openTab, dockTop, dockHeight, fileinput, modalOpen, handleResizeMouseDown, handleCopyDoc, handleSaveSnapshot, handleImportSnapshot, handlePasteSnapshot, handleCloseModal, handlePasteSubmit, handleFileSelected, handleClickTab, input_binding];
}
class FloatingDock extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$1, create_fragment$1, safe_not_equal, {
      onClose: 0
    }, add_css$1);
  }
}
function add_css(target) {
  append_styles(target, "svelte-pr6kw9", '.dev-tools.svelte-pr6kw9{font-family:var(--font-sans);font-size:var(--font-medium);font-weight:400;--font-sans:Helvetica Neue, Calibri Light, Roboto, sans-serif;--font-small:11px;--font-medium:13px;--font-large:16px;--height-tabs-menu:48px;--tree-view-font-family:"Helvetica Neue", "Calibri Light", Roboto, sans-serif;--tree-view-font-size:13px;--tree-view-left-indent:0.875em;--tree-view-line-height:1.1;--tree-view-key-margin-right:0.5em;--tree-view-base00:#363755;--tree-view-base01:#604d49;--tree-view-base02:#6d5a55;--tree-view-base03:#d1929b;--tree-view-base04:#b79f8d;--tree-view-base05:#f9f8f2;--tree-view-base06:#f7f4f1;--tree-view-base07:#faf8f5;--tree-view-base08:#fa3e7e;--tree-view-base09:#fd993c;--tree-view-base0A:#f6bf81;--tree-view-base0B:#b8e248;--tree-view-base0C:#b4efe4;--tree-view-base0D:#85d9ef;--tree-view-base0E:#be87ff;--tree-view-base0F:#d6724c}.dev-tools.svelte-pr6kw9 .svelte-tree-view *{box-sizing:border-box}.dev-tools.svelte-pr6kw9 .hidden{opacity:0;visibility:hidden}');
}
function create_else_block(ctx) {
  let floatingbtn;
  let current;
  floatingbtn = new FloatingBtn({
    props: {
      buttonPosition: (
        /*buttonPosition*/
        ctx[1]
      )
    }
  });
  floatingbtn.$on(
    "click",
    /*handleFloatingBtnClick*/
    ctx[2]
  );
  return {
    c() {
      create_component(floatingbtn.$$.fragment);
    },
    m(target, anchor) {
      mount_component(floatingbtn, target, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      const floatingbtn_changes = {};
      if (dirty & /*buttonPosition*/
      2)
        floatingbtn_changes.buttonPosition = /*buttonPosition*/
        ctx2[1];
      floatingbtn.$set(floatingbtn_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(floatingbtn.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(floatingbtn.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(floatingbtn, detaching);
    }
  };
}
function create_if_block(ctx) {
  let floatingdock;
  let current;
  floatingdock = new FloatingDock({
    props: {
      onClose: (
        /*handleFloatingDockClose*/
        ctx[3]
      )
    }
  });
  return {
    c() {
      create_component(floatingdock.$$.fragment);
    },
    m(target, anchor) {
      mount_component(floatingdock, target, anchor);
      current = true;
    },
    p: noop,
    i(local) {
      if (current)
        return;
      transition_in(floatingdock.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(floatingdock.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(floatingdock, detaching);
    }
  };
}
function create_fragment(ctx) {
  let section;
  let current_block_type_index;
  let if_block;
  let current;
  const if_block_creators = [create_if_block, create_else_block];
  const if_blocks = [];
  function select_block_type(ctx2, dirty) {
    if (
      /*devToolsExpanded*/
      ctx2[0]
    )
      return 0;
    return 1;
  }
  current_block_type_index = select_block_type(ctx);
  if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
  return {
    c() {
      section = element("section");
      if_block.c();
      attr(section, "class", "dev-tools svelte-pr6kw9");
    },
    m(target, anchor) {
      insert(target, section, anchor);
      if_blocks[current_block_type_index].m(section, null);
      current = true;
    },
    p(ctx2, _ref) {
      let [dirty] = _ref;
      let previous_block_index = current_block_type_index;
      current_block_type_index = select_block_type(ctx2);
      if (current_block_type_index === previous_block_index) {
        if_blocks[current_block_type_index].p(ctx2, dirty);
      } else {
        group_outros();
        transition_out(if_blocks[previous_block_index], 1, 1, () => {
          if_blocks[previous_block_index] = null;
        });
        check_outros();
        if_block = if_blocks[current_block_type_index];
        if (!if_block) {
          if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx2);
          if_block.c();
        } else {
          if_block.p(ctx2, dirty);
        }
        transition_in(if_block, 1);
        if_block.m(section, null);
      }
    },
    i(local) {
      if (current)
        return;
      transition_in(if_block);
      current = true;
    },
    o(local) {
      transition_out(if_block);
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(section);
      }
      if_blocks[current_block_type_index].d();
    }
  };
}
function instance($$self, $$props, $$invalidate) {
  let {
    view,
    devToolsExpanded = false,
    buttonPosition = "bottom-right"
  } = $$props;
  setContext("editor-view", {
    view,
    execCmd(cmd) {
      cmd(view.state, view.dispatch);
    },
    replaceEditorContent(state2) {
      const tr = view.state.tr;
      tr.replaceWith(0, view.state.doc.nodeSize - 2, state2.doc.content);
      view.dispatch(tr);
    }
  });
  onMount(() => {
    const html2 = document && document.querySelector("html");
    if (devToolsExpanded && html2) {
      html2.style.paddingBottom = "341px";
    }
  });
  function handleFloatingBtnClick() {
    $$invalidate(0, devToolsExpanded = true);
    const html2 = document && document.querySelector("html");
    if (html2) {
      html2.style.paddingBottom = "341px";
    }
  }
  function handleFloatingDockClose() {
    $$invalidate(0, devToolsExpanded = false);
    const html2 = document && document.querySelector("html");
    if (html2) {
      html2.style.paddingBottom = "";
    }
  }
  $$self.$$set = ($$props2) => {
    if ("view" in $$props2)
      $$invalidate(4, view = $$props2.view);
    if ("devToolsExpanded" in $$props2)
      $$invalidate(0, devToolsExpanded = $$props2.devToolsExpanded);
    if ("buttonPosition" in $$props2)
      $$invalidate(1, buttonPosition = $$props2.buttonPosition);
  };
  return [devToolsExpanded, buttonPosition, handleFloatingBtnClick, handleFloatingDockClose, view];
}
class DevTools extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance, create_fragment, safe_not_equal, {
      view: 4,
      devToolsExpanded: 0,
      buttonPosition: 1
    }, add_css);
  }
}
let active = false, resetDispatch = void 0;
const handleDispatch = (view, oldDispatchFn) => (tr) => {
  const stateBeforeDispatch = view.state;
  const applied = view.state.applyTransaction(tr);
  if (oldDispatchFn) {
    const oldFn = view.state.applyTransaction.bind(view.state);
    view.state.applyTransaction = function(trr) {
      if (trr !== tr) {
        view.state.applyTransaction = oldFn;
        return Reflect.apply(oldFn, view.state, arguments);
      }
      return applied;
    };
    oldDispatchFn(tr);
  } else {
    view.updateState(applied.state);
  }
  if (active && applied.transactions.length > 0) {
    appendNewHistoryEntry(applied.transactions, view.state, stateBeforeDispatch);
  }
};
function subscribeToDispatchTransaction(view) {
  var _a;
  active = true;
  const oldDispatchFn = (_a = (view.props || view._props).dispatchTransaction) === null || _a === void 0 ? void 0 : _a.bind(view);
  view.setProps({
    dispatchTransaction: handleDispatch(view, oldDispatchFn)
  });
  resetDispatch = () => view.setProps({ dispatchTransaction: oldDispatchFn });
}
function unsubscribeDispatchTransaction() {
  active = false;
  resetDispatch && resetDispatch();
  resetDispatch = void 0;
}
const DEVTOOLS_CSS_CLASS = "__prosemirror-dev-toolkit__";
function createOrFindPlace() {
  let place = document.querySelector(`.${DEVTOOLS_CSS_CLASS}`);
  if (!place) {
    place = document.createElement("div");
    place.className = DEVTOOLS_CSS_CLASS;
    document.body.appendChild(place);
  }
  return place;
}
class ProseMirrorDevToolkit extends HTMLElement {
  constructor() {
    super();
    const shadowRoot = this.attachShadow({ mode: "open" });
    this.addEventListener("init-dev-toolkit", (event) => {
      const { detail: { view, opts } } = event;
      this.component = new DevTools({
        target: shadowRoot,
        props: Object.assign({ view }, opts)
      });
    });
  }
  disconnectedCallback() {
    var _a;
    (_a = this.component) === null || _a === void 0 ? void 0 : _a.$destroy();
  }
}
if (!customElements.get("prosemirror-dev-toolkit")) {
  customElements.define("prosemirror-dev-toolkit", ProseMirrorDevToolkit);
}
if (typeof window !== "undefined")
  window.applyDevTools = applyDevTools;
let removeCallback;
function applyDevTools(view, opts = {}) {
  const place = createOrFindPlace();
  removeDevTools();
  if (view.isDestroyed)
    return;
  let comp;
  const { disableWebComponent } = opts, filteredOpts = __rest(opts, ["disableWebComponent"]);
  if (disableWebComponent) {
    comp = new DevTools({
      target: place,
      props: Object.assign({ view }, filteredOpts)
    });
  } else {
    const newTools = document.createElement("prosemirror-dev-toolkit");
    newTools.dispatchEvent(new CustomEvent("init-dev-toolkit", {
      detail: { view, opts: filteredOpts }
    }));
    place.appendChild(newTools);
  }
  if (typeof window !== "undefined") {
    window.editorView = view;
    window.pmCmd = (cmd) => {
      const state2 = view.state;
      return cmd(state2, view.dispatch, view);
    };
  }
  const oldDestroyFn = view.destroy.bind(view);
  view.destroy = () => {
    removeDevTools();
    oldDestroyFn();
  };
  subscribeToDispatchTransaction(view);
  removeCallback = () => {
    resetHistory();
    unsubscribeDispatchTransaction();
    comp === null || comp === void 0 ? void 0 : comp.$destroy();
    const el = place.firstChild;
    el && place.removeChild(el);
  };
}
function removeDevTools() {
  removeCallback && removeCallback();
  removeCallback = void 0;
}
const DEFAULT_INJECT_DATA = {
  instance: 0,
  selector: ".ProseMirror",
  status: "finding",
  instances: []
};
const DEFAULT_STATE = {
  disabled: false,
  devToolsOpts: {
    devToolsExpanded: false,
    buttonPosition: "bottom-right"
  }
};
const DEFAULT_INJECT_STATE = {
  ...DEFAULT_STATE,
  inject: DEFAULT_INJECT_DATA
};
function recurseElementsIntoHackPromises(el, opts) {
  var _a;
  for (const child of el.children) {
    if (child instanceof HTMLElement && ((_a = child.pmViewDesc) == null ? void 0 : _a.selectNode)) {
      if (opts.promises.length < opts.max && child.pmViewDesc && // Skip custom NodeViews since they seem to bug out with the hack
      child.pmViewDesc.constructor.name !== "CustomNodeViewDesc") {
        opts.promises.push(runPmViewDescHack(el, child, opts));
        recurseElementsIntoHackPromises(child, opts);
      }
    }
  }
}
async function runPmViewDescHack(parent, child, opts) {
  var _a;
  if (opts.controller.signal.aborted) {
    return { err: "Finding aborted", code: 400 };
  }
  let oldFn = (_a = parent.pmViewDesc) == null ? void 0 : _a.updateChildren;
  const alreadyPatched = opts.oldFns.has(parent);
  if (!alreadyPatched && oldFn) {
    opts.oldFns.set(parent, oldFn);
  } else {
    oldFn = opts.oldFns.get(parent);
  }
  const reset = () => {
    if (!alreadyPatched && parent.pmViewDesc && oldFn) {
      parent.pmViewDesc.updateChildren = oldFn;
    }
  };
  setTimeout(
    () => {
      var _a2, _b;
      if (child) {
        (_a2 = child.pmViewDesc) == null ? void 0 : _a2.selectNode();
        (_b = child.pmViewDesc) == null ? void 0 : _b.deselectNode();
      }
    },
    Math.floor(Math.random() * 100)
  );
  return new Promise((res) => {
    setTimeout(() => {
      reset();
      res({ err: "Unable to trigger child.pmViewDesc.selectNode", code: 400 });
    }, 1e3);
    opts.controller.signal.addEventListener("abort", () => {
      reset();
      res({ err: "Finding aborted", code: 400 });
    });
    if (!alreadyPatched) {
      parent.pmViewDesc.updateChildren = (view, pos) => {
        reset();
        res({ data: view });
        return Function.prototype.bind.apply(oldFn, view, pos);
      };
    }
  });
}
async function getEditorView(el) {
  const opts = {
    promises: [],
    oldFns: /* @__PURE__ */ new Map(),
    max: 50,
    controller: new AbortController()
  };
  recurseElementsIntoHackPromises(el, opts);
  const found = await Promise.any(opts.promises);
  if ("data" in found) {
    opts.controller.abort();
    return found.data;
  }
  return void 0;
}
function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, ms);
  });
}
function send(type, data) {
  window.postMessage({ source: "pm-dev-tools", origin: "inject", type, data });
}
async function tryQueryIframe(iframe, selector) {
  try {
    const doc2 = iframe.contentDocument;
    if (!doc2)
      return [];
    let tries = 0;
    while ((doc2 == null ? void 0 : doc2.readyState) === "loading" || tries < 5) {
      await sleep(500);
      tries += 1;
    }
    return Array.from(doc2.querySelectorAll(selector) || []);
  } catch (err) {
    return [];
  }
}
function shouldRerun(oldState, newState) {
  return !newState.disabled && (oldState.devToolsOpts.devToolsExpanded !== newState.devToolsOpts.devToolsExpanded || oldState.devToolsOpts.buttonPosition !== newState.devToolsOpts.buttonPosition || oldState.inject.instance !== newState.inject.instance || oldState.inject.selector !== newState.inject.selector);
}
const MAX_ATTEMPTS = 10;
async function findEditorViews(state2, attempts = 0) {
  await sleep(1e3 * attempts);
  try {
    const {
      disabled,
      inject: { selector }
    } = state2;
    if (disabled) {
      return [];
    }
    const views = await Promise.all(
      Array.from(document.querySelectorAll(selector)).map(
        (el) => getEditorView(el).catch((err) => {
          return void 0;
        })
      )
    );
    const iframes = (await Promise.all(
      Array.from(document.querySelectorAll("iframe")).map(
        (iframe) => tryQueryIframe(iframe, selector)
      )
    )).flat();
    const iframeViews = await Promise.all(
      iframes.map(
        (el) => getEditorView(el).catch((err) => {
          return void 0;
        })
      )
    );
    const filtered = views.concat(iframeViews).filter((v) => v !== void 0);
    if (filtered.length === 0 && attempts < MAX_ATTEMPTS) {
      return findEditorViews(state2, attempts + 1);
    }
    return filtered;
  } catch (err) {
    console.error(err);
    return void 0;
  }
}
let mounted = false;
let state = DEFAULT_INJECT_STATE;
const injectActions = {
  setMounted(val) {
    mounted = val;
  },
  setState(val) {
    state = val;
  },
  updateStatus(status) {
    state.inject.status = status;
    send("inject-status", status);
  },
  async findInstances() {
    this.updateStatus("finding");
    const views = await findEditorViews(state);
    if (!views) {
      this.updateStatus("error");
    } else if (views.length > 0) {
      let applied = false;
      const instances = views.map((v, idx) => {
        if (idx === state.inject.instance || !applied && idx === views.length - 1) {
          try {
            applyDevTools(v, state.devToolsOpts);
            applied = true;
          } catch (err) {
            console.error(err);
          }
        }
        return {
          size: v.dom.innerHTML.length,
          element: v.dom.innerHTML.slice(0, 100)
        };
      });
      send("inject-found-instances", { instances });
    }
    this.updateStatus("finished");
  }
};
async function handleMessages(event) {
  if (typeof event.data !== "object" || !("source" in event.data) || event.data.source !== "pm-dev-tools") {
    return;
  }
  if (event.data.origin !== "sw") {
    return;
  }
  const msg = event.data;
  switch (msg.type) {
    case "inject-state":
      const rerun = shouldRerun(state, msg.data);
      injectActions.setState(msg.data);
      if (!mounted && !msg.data.disabled || rerun) {
        injectActions.findInstances();
        injectActions.setMounted(true);
      } else if (msg.data.disabled) {
        removeDevTools();
        injectActions.setMounted(false);
      }
      break;
    case "rerun-inject":
      removeDevTools();
      injectActions.setMounted(false);
      injectActions.findInstances();
      break;
  }
}
window.addEventListener("message", handleMessages);
})()