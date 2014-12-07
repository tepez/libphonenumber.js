var COMPILED = false;
var goog = goog || {};
goog.global = this;
goog.global.CLOSURE_UNCOMPILED_DEFINES;
goog.global.CLOSURE_DEFINES;
goog.isDef = function(val) {
  return val !== void 0;
};
goog.exportPath_ = function(name, opt_object, opt_objectToExportTo) {
  var parts = name.split(".");
  var cur = opt_objectToExportTo || goog.global;
  if (!(parts[0] in cur) && cur.execScript) {
    cur.execScript("var " + parts[0]);
  }
  for (var part;parts.length && (part = parts.shift());) {
    if (!parts.length && goog.isDef(opt_object)) {
      cur[part] = opt_object;
    } else {
      if (cur[part]) {
        cur = cur[part];
      } else {
        cur = cur[part] = {};
      }
    }
  }
};
goog.define = function(name, defaultValue) {
  var value = defaultValue;
  if (!COMPILED) {
    if (goog.global.CLOSURE_UNCOMPILED_DEFINES && Object.prototype.hasOwnProperty.call(goog.global.CLOSURE_UNCOMPILED_DEFINES, name)) {
      value = goog.global.CLOSURE_UNCOMPILED_DEFINES[name];
    } else {
      if (goog.global.CLOSURE_DEFINES && Object.prototype.hasOwnProperty.call(goog.global.CLOSURE_DEFINES, name)) {
        value = goog.global.CLOSURE_DEFINES[name];
      }
    }
  }
  goog.exportPath_(name, value);
};
goog.DEBUG = true;
goog.define("goog.LOCALE", "en");
goog.define("goog.TRUSTED_SITE", true);
goog.define("goog.STRICT_MODE_COMPATIBLE", false);
goog.provide = function(name) {
  if (!COMPILED) {
    if (goog.isProvided_(name)) {
      throw Error('Namespace "' + name + '" already declared.');
    }
  }
  goog.constructNamespace_(name);
};
goog.constructNamespace_ = function(name, opt_obj) {
  if (!COMPILED) {
    delete goog.implicitNamespaces_[name];
    var namespace = name;
    while (namespace = namespace.substring(0, namespace.lastIndexOf("."))) {
      if (goog.getObjectByName(namespace)) {
        break;
      }
      goog.implicitNamespaces_[namespace] = true;
    }
  }
  goog.exportPath_(name, opt_obj);
};
goog.module = function(name) {
  if (!goog.isString(name) || !name) {
    throw Error("Invalid module identifier");
  }
  if (!goog.isInModuleLoader_()) {
    throw Error("Module " + name + " has been loaded incorrectly.");
  }
  if (goog.moduleLoaderState_.moduleName) {
    throw Error("goog.module may only be called once per module.");
  }
  goog.moduleLoaderState_.moduleName = name;
  if (!COMPILED) {
    if (goog.isProvided_(name)) {
      throw Error('Namespace "' + name + '" already declared.');
    }
    delete goog.implicitNamespaces_[name];
  }
};
goog.module.get = function(name) {
  return goog.module.getInternal_(name);
};
goog.module.getInternal_ = function(name) {
  if (!COMPILED) {
    if (goog.isProvided_(name)) {
      return name in goog.loadedModules_ ? goog.loadedModules_[name] : goog.getObjectByName(name);
    } else {
      return null;
    }
  }
};
goog.moduleLoaderState_ = null;
goog.isInModuleLoader_ = function() {
  return goog.moduleLoaderState_ != null;
};
goog.module.declareTestMethods = function() {
  if (!goog.isInModuleLoader_()) {
    throw new Error("goog.module.declareTestMethods must be called from " + "within a goog.module");
  }
  goog.moduleLoaderState_.declareTestMethods = true;
};
goog.module.declareLegacyNamespace = function() {
  if (!COMPILED && !goog.isInModuleLoader_()) {
    throw new Error("goog.module.declareLegacyNamespace must be called from " + "within a goog.module");
  }
  if (!COMPILED && !goog.moduleLoaderState_.moduleName) {
    throw Error("goog.module must be called prior to " + "goog.module.declareLegacyNamespace.");
  }
  goog.moduleLoaderState_.declareLegacyNamespace = true;
};
goog.setTestOnly = function(opt_message) {
  if (COMPILED && !goog.DEBUG) {
    opt_message = opt_message || "";
    throw Error("Importing test-only code into non-debug environment" + (opt_message ? ": " + opt_message : "."));
  }
};
goog.forwardDeclare = function(name) {
};
if (!COMPILED) {
  goog.isProvided_ = function(name) {
    return name in goog.loadedModules_ || !goog.implicitNamespaces_[name] && goog.isDefAndNotNull(goog.getObjectByName(name));
  };
  goog.implicitNamespaces_ = {"goog.module":true};
}
goog.getObjectByName = function(name, opt_obj) {
  var parts = name.split(".");
  var cur = opt_obj || goog.global;
  for (var part;part = parts.shift();) {
    if (goog.isDefAndNotNull(cur[part])) {
      cur = cur[part];
    } else {
      return null;
    }
  }
  return cur;
};
goog.globalize = function(obj, opt_global) {
  var global = opt_global || goog.global;
  for (var x in obj) {
    global[x] = obj[x];
  }
};
goog.addDependency = function(relPath, provides, requires, opt_isModule) {
  if (goog.DEPENDENCIES_ENABLED) {
    var provide, require;
    var path = relPath.replace(/\\/g, "/");
    var deps = goog.dependencies_;
    for (var i = 0;provide = provides[i];i++) {
      deps.nameToPath[provide] = path;
      deps.pathIsModule[path] = !!opt_isModule;
    }
    for (var j = 0;require = requires[j];j++) {
      if (!(path in deps.requires)) {
        deps.requires[path] = {};
      }
      deps.requires[path][require] = true;
    }
  }
};
goog.define("goog.ENABLE_DEBUG_LOADER", true);
goog.logToConsole_ = function(msg) {
  if (goog.global.console) {
    goog.global.console["error"](msg);
  }
};
goog.require = function(name) {
  if (!COMPILED) {
    if (goog.ENABLE_DEBUG_LOADER && goog.IS_OLD_IE_) {
      goog.maybeProcessDeferredDep_(name);
    }
    if (goog.isProvided_(name)) {
      if (goog.isInModuleLoader_()) {
        return goog.module.getInternal_(name);
      } else {
        return null;
      }
    }
    if (goog.ENABLE_DEBUG_LOADER) {
      var path = goog.getPathFromDeps_(name);
      if (path) {
        goog.included_[path] = true;
        goog.writeScripts_();
        return null;
      }
    }
    var errorMessage = "goog.require could not find: " + name;
    goog.logToConsole_(errorMessage);
    throw Error(errorMessage);
  }
};
goog.basePath = "";
goog.global.CLOSURE_BASE_PATH;
goog.global.CLOSURE_NO_DEPS;
goog.global.CLOSURE_IMPORT_SCRIPT;
goog.nullFunction = function() {
};
goog.identityFunction = function(opt_returnValue, var_args) {
  return opt_returnValue;
};
goog.abstractMethod = function() {
  throw Error("unimplemented abstract method");
};
goog.addSingletonGetter = function(ctor) {
  ctor.getInstance = function() {
    if (ctor.instance_) {
      return ctor.instance_;
    }
    if (goog.DEBUG) {
      goog.instantiatedSingletons_[goog.instantiatedSingletons_.length] = ctor;
    }
    return ctor.instance_ = new ctor;
  };
};
goog.instantiatedSingletons_ = [];
goog.define("goog.LOAD_MODULE_USING_EVAL", true);
goog.define("goog.SEAL_MODULE_EXPORTS", goog.DEBUG);
goog.loadedModules_ = {};
goog.DEPENDENCIES_ENABLED = !COMPILED && goog.ENABLE_DEBUG_LOADER;
if (goog.DEPENDENCIES_ENABLED) {
  goog.included_ = {};
  goog.dependencies_ = {pathIsModule:{}, nameToPath:{}, requires:{}, visited:{}, written:{}, deferred:{}};
  goog.inHtmlDocument_ = function() {
    var doc = goog.global.document;
    return typeof doc != "undefined" && "write" in doc;
  };
  goog.findBasePath_ = function() {
    if (goog.global.CLOSURE_BASE_PATH) {
      goog.basePath = goog.global.CLOSURE_BASE_PATH;
      return;
    } else {
      if (!goog.inHtmlDocument_()) {
        return;
      }
    }
    var doc = goog.global.document;
    var scripts = doc.getElementsByTagName("script");
    for (var i = scripts.length - 1;i >= 0;--i) {
      var script = (scripts[i]);
      var src = script.src;
      var qmark = src.lastIndexOf("?");
      var l = qmark == -1 ? src.length : qmark;
      if (src.substr(l - 7, 7) == "base.js") {
        goog.basePath = src.substr(0, l - 7);
        return;
      }
    }
  };
  goog.importScript_ = function(src, opt_sourceText) {
    var importScript = goog.global.CLOSURE_IMPORT_SCRIPT || goog.writeScriptTag_;
    if (importScript(src, opt_sourceText)) {
      goog.dependencies_.written[src] = true;
    }
  };
  goog.IS_OLD_IE_ = goog.global.document && goog.global.document.all && !goog.global.atob;
  goog.importModule_ = function(src) {
    var bootstrap = 'goog.retrieveAndExecModule_("' + src + '");';
    if (goog.importScript_("", bootstrap)) {
      goog.dependencies_.written[src] = true;
    }
  };
  goog.queuedModules_ = [];
  goog.retrieveAndExecModule_ = function(src) {
    var originalPath = src;
    var separator;
    while ((separator = src.indexOf("/./")) != -1) {
      src = src.substr(0, separator) + src.substr(separator + "/.".length);
    }
    while ((separator = src.indexOf("/../")) != -1) {
      var previousComponent = src.lastIndexOf("/", separator - 1);
      src = src.substr(0, previousComponent) + src.substr(separator + "/..".length);
    }
    var importScript = goog.global.CLOSURE_IMPORT_SCRIPT || goog.writeScriptTag_;
    var scriptText = null;
    var xhr = new goog.global["XMLHttpRequest"];
    xhr.onload = function() {
      scriptText = this.responseText;
    };
    xhr.open("get", src, false);
    xhr.send();
    scriptText = xhr.responseText;
    if (scriptText != null) {
      var execModuleScript = goog.wrapModule_(src, scriptText);
      var isOldIE = goog.IS_OLD_IE_;
      if (isOldIE) {
        goog.dependencies_.deferred[originalPath] = execModuleScript;
        goog.queuedModules_.push(originalPath);
      } else {
        importScript(src, execModuleScript);
      }
    } else {
      throw new Error("load of " + src + "failed");
    }
  };
  goog.wrapModule_ = function(srcUrl, scriptText) {
    if (!goog.LOAD_MODULE_USING_EVAL || !goog.isDef(goog.global.JSON)) {
      return "" + "goog.loadModule(function(exports) {" + '"use strict";' + scriptText + "\n" + ";return exports" + "});" + "\n//# sourceURL=" + srcUrl + "\n";
    } else {
      return "" + "goog.loadModule(" + goog.global.JSON.stringify(scriptText + "\n//# sourceURL=" + srcUrl + "\n") + ");";
    }
  };
  goog.loadQueuedModules_ = function() {
    var count = goog.queuedModules_.length;
    if (count > 0) {
      var queue = goog.queuedModules_;
      goog.queuedModules_ = [];
      for (var i = 0;i < count;i++) {
        var path = queue[i];
        goog.maybeProcessDeferredPath_(path);
      }
    }
  };
  goog.maybeProcessDeferredDep_ = function(name) {
    if (goog.isDeferredModule_(name) && goog.allDepsAreAvailable_(name)) {
      var path = goog.getPathFromDeps_(name);
      goog.maybeProcessDeferredPath_(goog.basePath + path);
    }
  };
  goog.isDeferredModule_ = function(name) {
    var path = goog.getPathFromDeps_(name);
    if (path && goog.dependencies_.pathIsModule[path]) {
      var abspath = goog.basePath + path;
      return abspath in goog.dependencies_.deferred;
    }
    return false;
  };
  goog.allDepsAreAvailable_ = function(name) {
    var path = goog.getPathFromDeps_(name);
    if (path && path in goog.dependencies_.requires) {
      for (var requireName in goog.dependencies_.requires[path]) {
        if (!goog.isProvided_(requireName) && !goog.isDeferredModule_(requireName)) {
          return false;
        }
      }
    }
    return true;
  };
  goog.maybeProcessDeferredPath_ = function(abspath) {
    if (abspath in goog.dependencies_.deferred) {
      var src = goog.dependencies_.deferred[abspath];
      delete goog.dependencies_.deferred[abspath];
      goog.globalEval(src);
    }
  };
  goog.loadModule = function(moduleDef) {
    var previousState = goog.moduleLoaderState_;
    try {
      goog.moduleLoaderState_ = {moduleName:undefined, declareTestMethods:false};
      var exports;
      if (goog.isFunction(moduleDef)) {
        exports = moduleDef.call(goog.global, {});
      } else {
        if (goog.isString(moduleDef)) {
          exports = goog.loadModuleFromSource_.call(goog.global, moduleDef);
        } else {
          throw Error("Invalid module definition");
        }
      }
      var moduleName = goog.moduleLoaderState_.moduleName;
      if (!goog.isString(moduleName) || !moduleName) {
        throw Error('Invalid module name "' + moduleName + '"');
      }
      if (goog.moduleLoaderState_.declareLegacyNamespace) {
        goog.constructNamespace_(moduleName, exports);
      } else {
        if (goog.SEAL_MODULE_EXPORTS && Object.seal) {
          Object.seal(exports);
        }
      }
      goog.loadedModules_[moduleName] = exports;
      if (goog.moduleLoaderState_.declareTestMethods) {
        for (var entry in exports) {
          if (entry.indexOf("test", 0) === 0 || entry == "tearDown" || entry == "setUp" || entry == "setUpPage" || entry == "tearDownPage") {
            goog.global[entry] = exports[entry];
          }
        }
      }
    } finally {
      goog.moduleLoaderState_ = previousState;
    }
  };
  goog.loadModuleFromSource_ = function() {
    var exports = {};
    eval(arguments[0]);
    return exports;
  };
  goog.writeScriptTag_ = function(src, opt_sourceText) {
    if (goog.inHtmlDocument_()) {
      var doc = goog.global.document;
      if (doc.readyState == "complete") {
        var isDeps = /\bdeps.js$/.test(src);
        if (isDeps) {
          return false;
        } else {
          throw Error('Cannot write "' + src + '" after document load');
        }
      }
      var isOldIE = goog.IS_OLD_IE_;
      if (opt_sourceText === undefined) {
        if (!isOldIE) {
          doc.write('<script type="text/javascript" src="' + src + '"></' + "script>");
        } else {
          var state = " onreadystatechange='goog.onScriptLoad_(this, " + ++goog.lastNonModuleScriptIndex_ + ")' ";
          doc.write('<script type="text/javascript" src="' + src + '"' + state + "></" + "script>");
        }
      } else {
        doc.write('<script type="text/javascript">' + opt_sourceText + "</" + "script>");
      }
      return true;
    } else {
      return false;
    }
  };
  goog.lastNonModuleScriptIndex_ = 0;
  goog.onScriptLoad_ = function(script, scriptIndex) {
    if (script.readyState == "complete" && goog.lastNonModuleScriptIndex_ == scriptIndex) {
      goog.loadQueuedModules_();
    }
    return true;
  };
  goog.writeScripts_ = function() {
    var scripts = [];
    var seenScript = {};
    var deps = goog.dependencies_;
    function visitNode(path) {
      if (path in deps.written) {
        return;
      }
      if (path in deps.visited) {
        if (!(path in seenScript)) {
          seenScript[path] = true;
          scripts.push(path);
        }
        return;
      }
      deps.visited[path] = true;
      if (path in deps.requires) {
        for (var requireName in deps.requires[path]) {
          if (!goog.isProvided_(requireName)) {
            if (requireName in deps.nameToPath) {
              visitNode(deps.nameToPath[requireName]);
            } else {
              throw Error("Undefined nameToPath for " + requireName);
            }
          }
        }
      }
      if (!(path in seenScript)) {
        seenScript[path] = true;
        scripts.push(path);
      }
    }
    for (var path in goog.included_) {
      if (!deps.written[path]) {
        visitNode(path);
      }
    }
    for (var i = 0;i < scripts.length;i++) {
      var path = scripts[i];
      goog.dependencies_.written[path] = true;
    }
    var moduleState = goog.moduleLoaderState_;
    goog.moduleLoaderState_ = null;
    var loadingModule = false;
    for (var i = 0;i < scripts.length;i++) {
      var path = scripts[i];
      if (path) {
        if (!deps.pathIsModule[path]) {
          goog.importScript_(goog.basePath + path);
        } else {
          loadingModule = true;
          goog.importModule_(goog.basePath + path);
        }
      } else {
        goog.moduleLoaderState_ = moduleState;
        throw Error("Undefined script input");
      }
    }
    goog.moduleLoaderState_ = moduleState;
  };
  goog.getPathFromDeps_ = function(rule) {
    if (rule in goog.dependencies_.nameToPath) {
      return goog.dependencies_.nameToPath[rule];
    } else {
      return null;
    }
  };
  goog.findBasePath_();
  if (!goog.global.CLOSURE_NO_DEPS) {
    goog.importScript_(goog.basePath + "deps.js");
  }
}
goog.typeOf = function(value) {
  var s = typeof value;
  if (s == "object") {
    if (value) {
      if (value instanceof Array) {
        return "array";
      } else {
        if (value instanceof Object) {
          return s;
        }
      }
      var className = Object.prototype.toString.call((value));
      if (className == "[object Window]") {
        return "object";
      }
      if (className == "[object Array]" || typeof value.length == "number" && typeof value.splice != "undefined" && typeof value.propertyIsEnumerable != "undefined" && !value.propertyIsEnumerable("splice")) {
        return "array";
      }
      if (className == "[object Function]" || typeof value.call != "undefined" && typeof value.propertyIsEnumerable != "undefined" && !value.propertyIsEnumerable("call")) {
        return "function";
      }
    } else {
      return "null";
    }
  } else {
    if (s == "function" && typeof value.call == "undefined") {
      return "object";
    }
  }
  return s;
};
goog.isNull = function(val) {
  return val === null;
};
goog.isDefAndNotNull = function(val) {
  return val != null;
};
goog.isArray = function(val) {
  return goog.typeOf(val) == "array";
};
goog.isArrayLike = function(val) {
  var type = goog.typeOf(val);
  return type == "array" || type == "object" && typeof val.length == "number";
};
goog.isDateLike = function(val) {
  return goog.isObject(val) && typeof val.getFullYear == "function";
};
goog.isString = function(val) {
  return typeof val == "string";
};
goog.isBoolean = function(val) {
  return typeof val == "boolean";
};
goog.isNumber = function(val) {
  return typeof val == "number";
};
goog.isFunction = function(val) {
  return goog.typeOf(val) == "function";
};
goog.isObject = function(val) {
  var type = typeof val;
  return type == "object" && val != null || type == "function";
};
goog.getUid = function(obj) {
  return obj[goog.UID_PROPERTY_] || (obj[goog.UID_PROPERTY_] = ++goog.uidCounter_);
};
goog.hasUid = function(obj) {
  return!!obj[goog.UID_PROPERTY_];
};
goog.removeUid = function(obj) {
  if ("removeAttribute" in obj) {
    obj.removeAttribute(goog.UID_PROPERTY_);
  }
  try {
    delete obj[goog.UID_PROPERTY_];
  } catch (ex) {
  }
};
goog.UID_PROPERTY_ = "closure_uid_" + (Math.random() * 1E9 >>> 0);
goog.uidCounter_ = 0;
goog.getHashCode = goog.getUid;
goog.removeHashCode = goog.removeUid;
goog.cloneObject = function(obj) {
  var type = goog.typeOf(obj);
  if (type == "object" || type == "array") {
    if (obj.clone) {
      return obj.clone();
    }
    var clone = type == "array" ? [] : {};
    for (var key in obj) {
      clone[key] = goog.cloneObject(obj[key]);
    }
    return clone;
  }
  return obj;
};
goog.bindNative_ = function(fn, selfObj, var_args) {
  return(fn.call.apply(fn.bind, arguments));
};
goog.bindJs_ = function(fn, selfObj, var_args) {
  if (!fn) {
    throw new Error;
  }
  if (arguments.length > 2) {
    var boundArgs = Array.prototype.slice.call(arguments, 2);
    return function() {
      var newArgs = Array.prototype.slice.call(arguments);
      Array.prototype.unshift.apply(newArgs, boundArgs);
      return fn.apply(selfObj, newArgs);
    };
  } else {
    return function() {
      return fn.apply(selfObj, arguments);
    };
  }
};
goog.bind = function(fn, selfObj, var_args) {
  if (Function.prototype.bind && Function.prototype.bind.toString().indexOf("native code") != -1) {
    goog.bind = goog.bindNative_;
  } else {
    goog.bind = goog.bindJs_;
  }
  return goog.bind.apply(null, arguments);
};
goog.partial = function(fn, var_args) {
  var args = Array.prototype.slice.call(arguments, 1);
  return function() {
    var newArgs = args.slice();
    newArgs.push.apply(newArgs, arguments);
    return fn.apply(this, newArgs);
  };
};
goog.mixin = function(target, source) {
  for (var x in source) {
    target[x] = source[x];
  }
};
goog.now = goog.TRUSTED_SITE && Date.now || function() {
  return+new Date;
};
goog.globalEval = function(script) {
  if (goog.global.execScript) {
    goog.global.execScript(script, "JavaScript");
  } else {
    if (goog.global.eval) {
      if (goog.evalWorksForGlobals_ == null) {
        goog.global.eval("var _et_ = 1;");
        if (typeof goog.global["_et_"] != "undefined") {
          delete goog.global["_et_"];
          goog.evalWorksForGlobals_ = true;
        } else {
          goog.evalWorksForGlobals_ = false;
        }
      }
      if (goog.evalWorksForGlobals_) {
        goog.global.eval(script);
      } else {
        var doc = goog.global.document;
        var scriptElt = doc.createElement("script");
        scriptElt.type = "text/javascript";
        scriptElt.defer = false;
        scriptElt.appendChild(doc.createTextNode(script));
        doc.body.appendChild(scriptElt);
        doc.body.removeChild(scriptElt);
      }
    } else {
      throw Error("goog.globalEval not available");
    }
  }
};
goog.evalWorksForGlobals_ = null;
goog.cssNameMapping_;
goog.cssNameMappingStyle_;
goog.getCssName = function(className, opt_modifier) {
  var getMapping = function(cssName) {
    return goog.cssNameMapping_[cssName] || cssName;
  };
  var renameByParts = function(cssName) {
    var parts = cssName.split("-");
    var mapped = [];
    for (var i = 0;i < parts.length;i++) {
      mapped.push(getMapping(parts[i]));
    }
    return mapped.join("-");
  };
  var rename;
  if (goog.cssNameMapping_) {
    rename = goog.cssNameMappingStyle_ == "BY_WHOLE" ? getMapping : renameByParts;
  } else {
    rename = function(a) {
      return a;
    };
  }
  if (opt_modifier) {
    return className + "-" + rename(opt_modifier);
  } else {
    return rename(className);
  }
};
goog.setCssNameMapping = function(mapping, opt_style) {
  goog.cssNameMapping_ = mapping;
  goog.cssNameMappingStyle_ = opt_style;
};
goog.global.CLOSURE_CSS_NAME_MAPPING;
if (!COMPILED && goog.global.CLOSURE_CSS_NAME_MAPPING) {
  goog.cssNameMapping_ = goog.global.CLOSURE_CSS_NAME_MAPPING;
}
goog.getMsg = function(str, opt_values) {
  if (opt_values) {
    str = str.replace(/\{\$([^}]+)}/g, function(match, key) {
      return key in opt_values ? opt_values[key] : match;
    });
  }
  return str;
};
goog.getMsgWithFallback = function(a, b) {
  return a;
};
goog.exportSymbol = function(publicPath, object, opt_objectToExportTo) {
  goog.exportPath_(publicPath, object, opt_objectToExportTo);
};
goog.exportProperty = function(object, publicName, symbol) {
  object[publicName] = symbol;
};
goog.inherits = function(childCtor, parentCtor) {
  function tempCtor() {
  }
  tempCtor.prototype = parentCtor.prototype;
  childCtor.superClass_ = parentCtor.prototype;
  childCtor.prototype = new tempCtor;
  childCtor.prototype.constructor = childCtor;
  childCtor.base = function(me, methodName, var_args) {
    var args = Array.prototype.slice.call(arguments, 2);
    return parentCtor.prototype[methodName].apply(me, args);
  };
};
goog.base = function(me, opt_methodName, var_args) {
  var caller = arguments.callee.caller;
  if (goog.STRICT_MODE_COMPATIBLE || goog.DEBUG && !caller) {
    throw Error("arguments.caller not defined.  goog.base() cannot be used " + "with strict mode code. See " + "http://www.ecma-international.org/ecma-262/5.1/#sec-C");
  }
  if (caller.superClass_) {
    return caller.superClass_.constructor.apply(me, Array.prototype.slice.call(arguments, 1));
  }
  var args = Array.prototype.slice.call(arguments, 2);
  var foundCaller = false;
  for (var ctor = me.constructor;ctor;ctor = ctor.superClass_ && ctor.superClass_.constructor) {
    if (ctor.prototype[opt_methodName] === caller) {
      foundCaller = true;
    } else {
      if (foundCaller) {
        return ctor.prototype[opt_methodName].apply(me, args);
      }
    }
  }
  if (me[opt_methodName] === caller) {
    return me.constructor.prototype[opt_methodName].apply(me, args);
  } else {
    throw Error("goog.base called from a method of one name " + "to a method of a different name");
  }
};
goog.scope = function(fn) {
  fn.call(goog.global);
};
if (!COMPILED) {
  goog.global["COMPILED"] = COMPILED;
}
goog.defineClass = function(superClass, def) {
  var constructor = def.constructor;
  var statics = def.statics;
  if (!constructor || constructor == Object.prototype.constructor) {
    constructor = function() {
      throw Error("cannot instantiate an interface (no constructor defined).");
    };
  }
  var cls = goog.defineClass.createSealingConstructor_(constructor, superClass);
  if (superClass) {
    goog.inherits(cls, superClass);
  }
  delete def.constructor;
  delete def.statics;
  goog.defineClass.applyProperties_(cls.prototype, def);
  if (statics != null) {
    if (statics instanceof Function) {
      statics(cls);
    } else {
      goog.defineClass.applyProperties_(cls, statics);
    }
  }
  return cls;
};
goog.defineClass.ClassDescriptor;
goog.define("goog.defineClass.SEAL_CLASS_INSTANCES", goog.DEBUG);
goog.defineClass.createSealingConstructor_ = function(ctr, superClass) {
  if (goog.defineClass.SEAL_CLASS_INSTANCES && Object.seal instanceof Function) {
    if (superClass && superClass.prototype && superClass.prototype[goog.UNSEALABLE_CONSTRUCTOR_PROPERTY_]) {
      return ctr;
    }
    var wrappedCtr = function() {
      var instance = ctr.apply(this, arguments) || this;
      instance[goog.UID_PROPERTY_] = instance[goog.UID_PROPERTY_];
      if (this.constructor === wrappedCtr) {
        Object.seal(instance);
      }
      return instance;
    };
    return wrappedCtr;
  }
  return ctr;
};
goog.defineClass.OBJECT_PROTOTYPE_FIELDS_ = ["constructor", "hasOwnProperty", "isPrototypeOf", "propertyIsEnumerable", "toLocaleString", "toString", "valueOf"];
goog.defineClass.applyProperties_ = function(target, source) {
  var key;
  for (key in source) {
    if (Object.prototype.hasOwnProperty.call(source, key)) {
      target[key] = source[key];
    }
  }
  for (var i = 0;i < goog.defineClass.OBJECT_PROTOTYPE_FIELDS_.length;i++) {
    key = goog.defineClass.OBJECT_PROTOTYPE_FIELDS_[i];
    if (Object.prototype.hasOwnProperty.call(source, key)) {
      target[key] = source[key];
    }
  }
};
goog.tagUnsealableClass = function(ctr) {
  if (!COMPILED && goog.defineClass.SEAL_CLASS_INSTANCES) {
    ctr.prototype[goog.UNSEALABLE_CONSTRUCTOR_PROPERTY_] = true;
  }
};
goog.UNSEALABLE_CONSTRUCTOR_PROPERTY_ = "goog_defineClass_legacy_unsealable";
goog.provide("goog.string.StringBuffer");
goog.string.StringBuffer = function(opt_a1, var_args) {
  if (opt_a1 != null) {
    this.append.apply(this, arguments);
  }
};
goog.string.StringBuffer.prototype.buffer_ = "";
goog.string.StringBuffer.prototype.set = function(s) {
  this.buffer_ = "" + s;
};
goog.string.StringBuffer.prototype.append = function(a1, opt_a2, var_args) {
  this.buffer_ += a1;
  if (opt_a2 != null) {
    for (var i = 1;i < arguments.length;i++) {
      this.buffer_ += arguments[i];
    }
  }
  return this;
};
goog.string.StringBuffer.prototype.clear = function() {
  this.buffer_ = "";
};
goog.string.StringBuffer.prototype.getLength = function() {
  return this.buffer_.length;
};
goog.string.StringBuffer.prototype.toString = function() {
  return this.buffer_;
};
goog.provide("goog.debug.Error");
goog.debug.Error = function(opt_msg) {
  if (Error.captureStackTrace) {
    Error.captureStackTrace(this, goog.debug.Error);
  } else {
    var stack = (new Error).stack;
    if (stack) {
      this.stack = stack;
    }
  }
  if (opt_msg) {
    this.message = String(opt_msg);
  }
};
goog.inherits(goog.debug.Error, Error);
goog.debug.Error.prototype.name = "CustomError";
goog.provide("goog.dom.NodeType");
goog.dom.NodeType = {ELEMENT:1, ATTRIBUTE:2, TEXT:3, CDATA_SECTION:4, ENTITY_REFERENCE:5, ENTITY:6, PROCESSING_INSTRUCTION:7, COMMENT:8, DOCUMENT:9, DOCUMENT_TYPE:10, DOCUMENT_FRAGMENT:11, NOTATION:12};
goog.provide("goog.string");
goog.provide("goog.string.Unicode");
goog.define("goog.string.DETECT_DOUBLE_ESCAPING", false);
goog.define("goog.string.FORCE_NON_DOM_HTML_UNESCAPING", false);
goog.string.Unicode = {NBSP:"\u00a0"};
goog.string.startsWith = function(str, prefix) {
  return str.lastIndexOf(prefix, 0) == 0;
};
goog.string.endsWith = function(str, suffix) {
  var l = str.length - suffix.length;
  return l >= 0 && str.indexOf(suffix, l) == l;
};
goog.string.caseInsensitiveStartsWith = function(str, prefix) {
  return goog.string.caseInsensitiveCompare(prefix, str.substr(0, prefix.length)) == 0;
};
goog.string.caseInsensitiveEndsWith = function(str, suffix) {
  return goog.string.caseInsensitiveCompare(suffix, str.substr(str.length - suffix.length, suffix.length)) == 0;
};
goog.string.caseInsensitiveEquals = function(str1, str2) {
  return str1.toLowerCase() == str2.toLowerCase();
};
goog.string.subs = function(str, var_args) {
  var splitParts = str.split("%s");
  var returnString = "";
  var subsArguments = Array.prototype.slice.call(arguments, 1);
  while (subsArguments.length && splitParts.length > 1) {
    returnString += splitParts.shift() + subsArguments.shift();
  }
  return returnString + splitParts.join("%s");
};
goog.string.collapseWhitespace = function(str) {
  return str.replace(/[\s\xa0]+/g, " ").replace(/^\s+|\s+$/g, "");
};
goog.string.isEmptyOrWhitespace = function(str) {
  return/^[\s\xa0]*$/.test(str);
};
goog.string.isEmptyString = function(str) {
  return str.length == 0;
};
goog.string.isEmpty = goog.string.isEmptyOrWhitespace;
goog.string.isEmptyOrWhitespaceSafe = function(str) {
  return goog.string.isEmptyOrWhitespace(goog.string.makeSafe(str));
};
goog.string.isEmptySafe = goog.string.isEmptyOrWhitespaceSafe;
goog.string.isBreakingWhitespace = function(str) {
  return!/[^\t\n\r ]/.test(str);
};
goog.string.isAlpha = function(str) {
  return!/[^a-zA-Z]/.test(str);
};
goog.string.isNumeric = function(str) {
  return!/[^0-9]/.test(str);
};
goog.string.isAlphaNumeric = function(str) {
  return!/[^a-zA-Z0-9]/.test(str);
};
goog.string.isSpace = function(ch) {
  return ch == " ";
};
goog.string.isUnicodeChar = function(ch) {
  return ch.length == 1 && ch >= " " && ch <= "~" || ch >= "\u0080" && ch <= "\ufffd";
};
goog.string.stripNewlines = function(str) {
  return str.replace(/(\r\n|\r|\n)+/g, " ");
};
goog.string.canonicalizeNewlines = function(str) {
  return str.replace(/(\r\n|\r|\n)/g, "\n");
};
goog.string.normalizeWhitespace = function(str) {
  return str.replace(/\xa0|\s/g, " ");
};
goog.string.normalizeSpaces = function(str) {
  return str.replace(/\xa0|[ \t]+/g, " ");
};
goog.string.collapseBreakingSpaces = function(str) {
  return str.replace(/[\t\r\n ]+/g, " ").replace(/^[\t\r\n ]+|[\t\r\n ]+$/g, "");
};
goog.string.trim = goog.TRUSTED_SITE && String.prototype.trim ? function(str) {
  return str.trim();
} : function(str) {
  return str.replace(/^[\s\xa0]+|[\s\xa0]+$/g, "");
};
goog.string.trimLeft = function(str) {
  return str.replace(/^[\s\xa0]+/, "");
};
goog.string.trimRight = function(str) {
  return str.replace(/[\s\xa0]+$/, "");
};
goog.string.caseInsensitiveCompare = function(str1, str2) {
  var test1 = String(str1).toLowerCase();
  var test2 = String(str2).toLowerCase();
  if (test1 < test2) {
    return-1;
  } else {
    if (test1 == test2) {
      return 0;
    } else {
      return 1;
    }
  }
};
goog.string.numerateCompareRegExp_ = /(\.\d+)|(\d+)|(\D+)/g;
goog.string.numerateCompare = function(str1, str2) {
  if (str1 == str2) {
    return 0;
  }
  if (!str1) {
    return-1;
  }
  if (!str2) {
    return 1;
  }
  var tokens1 = str1.toLowerCase().match(goog.string.numerateCompareRegExp_);
  var tokens2 = str2.toLowerCase().match(goog.string.numerateCompareRegExp_);
  var count = Math.min(tokens1.length, tokens2.length);
  for (var i = 0;i < count;i++) {
    var a = tokens1[i];
    var b = tokens2[i];
    if (a != b) {
      var num1 = parseInt(a, 10);
      if (!isNaN(num1)) {
        var num2 = parseInt(b, 10);
        if (!isNaN(num2) && num1 - num2) {
          return num1 - num2;
        }
      }
      return a < b ? -1 : 1;
    }
  }
  if (tokens1.length != tokens2.length) {
    return tokens1.length - tokens2.length;
  }
  return str1 < str2 ? -1 : 1;
};
goog.string.urlEncode = function(str) {
  return encodeURIComponent(String(str));
};
goog.string.urlDecode = function(str) {
  return decodeURIComponent(str.replace(/\+/g, " "));
};
goog.string.newLineToBr = function(str, opt_xml) {
  return str.replace(/(\r\n|\r|\n)/g, opt_xml ? "<br />" : "<br>");
};
goog.string.htmlEscape = function(str, opt_isLikelyToContainHtmlChars) {
  if (opt_isLikelyToContainHtmlChars) {
    str = str.replace(goog.string.AMP_RE_, "&amp;").replace(goog.string.LT_RE_, "&lt;").replace(goog.string.GT_RE_, "&gt;").replace(goog.string.QUOT_RE_, "&quot;").replace(goog.string.SINGLE_QUOTE_RE_, "&#39;").replace(goog.string.NULL_RE_, "&#0;");
    if (goog.string.DETECT_DOUBLE_ESCAPING) {
      str = str.replace(goog.string.E_RE_, "&#101;");
    }
    return str;
  } else {
    if (!goog.string.ALL_RE_.test(str)) {
      return str;
    }
    if (str.indexOf("&") != -1) {
      str = str.replace(goog.string.AMP_RE_, "&amp;");
    }
    if (str.indexOf("<") != -1) {
      str = str.replace(goog.string.LT_RE_, "&lt;");
    }
    if (str.indexOf(">") != -1) {
      str = str.replace(goog.string.GT_RE_, "&gt;");
    }
    if (str.indexOf('"') != -1) {
      str = str.replace(goog.string.QUOT_RE_, "&quot;");
    }
    if (str.indexOf("'") != -1) {
      str = str.replace(goog.string.SINGLE_QUOTE_RE_, "&#39;");
    }
    if (str.indexOf("\x00") != -1) {
      str = str.replace(goog.string.NULL_RE_, "&#0;");
    }
    if (goog.string.DETECT_DOUBLE_ESCAPING && str.indexOf("e") != -1) {
      str = str.replace(goog.string.E_RE_, "&#101;");
    }
    return str;
  }
};
goog.string.AMP_RE_ = /&/g;
goog.string.LT_RE_ = /</g;
goog.string.GT_RE_ = />/g;
goog.string.QUOT_RE_ = /"/g;
goog.string.SINGLE_QUOTE_RE_ = /'/g;
goog.string.NULL_RE_ = /\x00/g;
goog.string.E_RE_ = /e/g;
goog.string.ALL_RE_ = goog.string.DETECT_DOUBLE_ESCAPING ? /[\x00&<>"'e]/ : /[\x00&<>"']/;
goog.string.unescapeEntities = function(str) {
  if (goog.string.contains(str, "&")) {
    if (!goog.string.FORCE_NON_DOM_HTML_UNESCAPING && "document" in goog.global) {
      return goog.string.unescapeEntitiesUsingDom_(str);
    } else {
      return goog.string.unescapePureXmlEntities_(str);
    }
  }
  return str;
};
goog.string.unescapeEntitiesWithDocument = function(str, document) {
  if (goog.string.contains(str, "&")) {
    return goog.string.unescapeEntitiesUsingDom_(str, document);
  }
  return str;
};
goog.string.unescapeEntitiesUsingDom_ = function(str, opt_document) {
  var seen = {"&amp;":"&", "&lt;":"<", "&gt;":">", "&quot;":'"'};
  var div;
  if (opt_document) {
    div = opt_document.createElement("div");
  } else {
    div = goog.global.document.createElement("div");
  }
  return str.replace(goog.string.HTML_ENTITY_PATTERN_, function(s, entity) {
    var value = seen[s];
    if (value) {
      return value;
    }
    if (entity.charAt(0) == "#") {
      var n = Number("0" + entity.substr(1));
      if (!isNaN(n)) {
        value = String.fromCharCode(n);
      }
    }
    if (!value) {
      div.innerHTML = s + " ";
      value = div.firstChild.nodeValue.slice(0, -1);
    }
    return seen[s] = value;
  });
};
goog.string.unescapePureXmlEntities_ = function(str) {
  return str.replace(/&([^;]+);/g, function(s, entity) {
    switch(entity) {
      case "amp":
        return "&";
      case "lt":
        return "<";
      case "gt":
        return ">";
      case "quot":
        return'"';
      default:
        if (entity.charAt(0) == "#") {
          var n = Number("0" + entity.substr(1));
          if (!isNaN(n)) {
            return String.fromCharCode(n);
          }
        }
        return s;
    }
  });
};
goog.string.HTML_ENTITY_PATTERN_ = /&([^;\s<&]+);?/g;
goog.string.whitespaceEscape = function(str, opt_xml) {
  return goog.string.newLineToBr(str.replace(/  /g, " &#160;"), opt_xml);
};
goog.string.preserveSpaces = function(str) {
  return str.replace(/(^|[\n ]) /g, "$1" + goog.string.Unicode.NBSP);
};
goog.string.stripQuotes = function(str, quoteChars) {
  var length = quoteChars.length;
  for (var i = 0;i < length;i++) {
    var quoteChar = length == 1 ? quoteChars : quoteChars.charAt(i);
    if (str.charAt(0) == quoteChar && str.charAt(str.length - 1) == quoteChar) {
      return str.substring(1, str.length - 1);
    }
  }
  return str;
};
goog.string.truncate = function(str, chars, opt_protectEscapedCharacters) {
  if (opt_protectEscapedCharacters) {
    str = goog.string.unescapeEntities(str);
  }
  if (str.length > chars) {
    str = str.substring(0, chars - 3) + "...";
  }
  if (opt_protectEscapedCharacters) {
    str = goog.string.htmlEscape(str);
  }
  return str;
};
goog.string.truncateMiddle = function(str, chars, opt_protectEscapedCharacters, opt_trailingChars) {
  if (opt_protectEscapedCharacters) {
    str = goog.string.unescapeEntities(str);
  }
  if (opt_trailingChars && str.length > chars) {
    if (opt_trailingChars > chars) {
      opt_trailingChars = chars;
    }
    var endPoint = str.length - opt_trailingChars;
    var startPoint = chars - opt_trailingChars;
    str = str.substring(0, startPoint) + "..." + str.substring(endPoint);
  } else {
    if (str.length > chars) {
      var half = Math.floor(chars / 2);
      var endPos = str.length - half;
      half += chars % 2;
      str = str.substring(0, half) + "..." + str.substring(endPos);
    }
  }
  if (opt_protectEscapedCharacters) {
    str = goog.string.htmlEscape(str);
  }
  return str;
};
goog.string.specialEscapeChars_ = {"\x00":"\\0", "\b":"\\b", "\f":"\\f", "\n":"\\n", "\r":"\\r", "\t":"\\t", "\x0B":"\\x0B", '"':'\\"', "\\":"\\\\"};
goog.string.jsEscapeCache_ = {"'":"\\'"};
goog.string.quote = function(s) {
  s = String(s);
  if (s.quote) {
    return s.quote();
  } else {
    var sb = ['"'];
    for (var i = 0;i < s.length;i++) {
      var ch = s.charAt(i);
      var cc = ch.charCodeAt(0);
      sb[i + 1] = goog.string.specialEscapeChars_[ch] || (cc > 31 && cc < 127 ? ch : goog.string.escapeChar(ch));
    }
    sb.push('"');
    return sb.join("");
  }
};
goog.string.escapeString = function(str) {
  var sb = [];
  for (var i = 0;i < str.length;i++) {
    sb[i] = goog.string.escapeChar(str.charAt(i));
  }
  return sb.join("");
};
goog.string.escapeChar = function(c) {
  if (c in goog.string.jsEscapeCache_) {
    return goog.string.jsEscapeCache_[c];
  }
  if (c in goog.string.specialEscapeChars_) {
    return goog.string.jsEscapeCache_[c] = goog.string.specialEscapeChars_[c];
  }
  var rv = c;
  var cc = c.charCodeAt(0);
  if (cc > 31 && cc < 127) {
    rv = c;
  } else {
    if (cc < 256) {
      rv = "\\x";
      if (cc < 16 || cc > 256) {
        rv += "0";
      }
    } else {
      rv = "\\u";
      if (cc < 4096) {
        rv += "0";
      }
    }
    rv += cc.toString(16).toUpperCase();
  }
  return goog.string.jsEscapeCache_[c] = rv;
};
goog.string.contains = function(str, subString) {
  return str.indexOf(subString) != -1;
};
goog.string.caseInsensitiveContains = function(str, subString) {
  return goog.string.contains(str.toLowerCase(), subString.toLowerCase());
};
goog.string.countOf = function(s, ss) {
  return s && ss ? s.split(ss).length - 1 : 0;
};
goog.string.removeAt = function(s, index, stringLength) {
  var resultStr = s;
  if (index >= 0 && index < s.length && stringLength > 0) {
    resultStr = s.substr(0, index) + s.substr(index + stringLength, s.length - index - stringLength);
  }
  return resultStr;
};
goog.string.remove = function(s, ss) {
  var re = new RegExp(goog.string.regExpEscape(ss), "");
  return s.replace(re, "");
};
goog.string.removeAll = function(s, ss) {
  var re = new RegExp(goog.string.regExpEscape(ss), "g");
  return s.replace(re, "");
};
goog.string.regExpEscape = function(s) {
  return String(s).replace(/([-()\[\]{}+?*.$\^|,:#<!\\])/g, "\\$1").replace(/\x08/g, "\\x08");
};
goog.string.repeat = function(string, length) {
  return(new Array(length + 1)).join(string);
};
goog.string.padNumber = function(num, length, opt_precision) {
  var s = goog.isDef(opt_precision) ? num.toFixed(opt_precision) : String(num);
  var index = s.indexOf(".");
  if (index == -1) {
    index = s.length;
  }
  return goog.string.repeat("0", Math.max(0, length - index)) + s;
};
goog.string.makeSafe = function(obj) {
  return obj == null ? "" : String(obj);
};
goog.string.buildString = function(var_args) {
  return Array.prototype.join.call(arguments, "");
};
goog.string.getRandomString = function() {
  var x = 2147483648;
  return Math.floor(Math.random() * x).toString(36) + Math.abs(Math.floor(Math.random() * x) ^ goog.now()).toString(36);
};
goog.string.compareVersions = function(version1, version2) {
  var order = 0;
  var v1Subs = goog.string.trim(String(version1)).split(".");
  var v2Subs = goog.string.trim(String(version2)).split(".");
  var subCount = Math.max(v1Subs.length, v2Subs.length);
  for (var subIdx = 0;order == 0 && subIdx < subCount;subIdx++) {
    var v1Sub = v1Subs[subIdx] || "";
    var v2Sub = v2Subs[subIdx] || "";
    var v1CompParser = new RegExp("(\\d*)(\\D*)", "g");
    var v2CompParser = new RegExp("(\\d*)(\\D*)", "g");
    do {
      var v1Comp = v1CompParser.exec(v1Sub) || ["", "", ""];
      var v2Comp = v2CompParser.exec(v2Sub) || ["", "", ""];
      if (v1Comp[0].length == 0 && v2Comp[0].length == 0) {
        break;
      }
      var v1CompNum = v1Comp[1].length == 0 ? 0 : parseInt(v1Comp[1], 10);
      var v2CompNum = v2Comp[1].length == 0 ? 0 : parseInt(v2Comp[1], 10);
      order = goog.string.compareElements_(v1CompNum, v2CompNum) || goog.string.compareElements_(v1Comp[2].length == 0, v2Comp[2].length == 0) || goog.string.compareElements_(v1Comp[2], v2Comp[2]);
    } while (order == 0);
  }
  return order;
};
goog.string.compareElements_ = function(left, right) {
  if (left < right) {
    return-1;
  } else {
    if (left > right) {
      return 1;
    }
  }
  return 0;
};
goog.string.HASHCODE_MAX_ = 4294967296;
goog.string.hashCode = function(str) {
  var result = 0;
  for (var i = 0;i < str.length;++i) {
    result = 31 * result + str.charCodeAt(i);
    result %= goog.string.HASHCODE_MAX_;
  }
  return result;
};
goog.string.uniqueStringCounter_ = Math.random() * 2147483648 | 0;
goog.string.createUniqueString = function() {
  return "goog_" + goog.string.uniqueStringCounter_++;
};
goog.string.toNumber = function(str) {
  var num = Number(str);
  if (num == 0 && goog.string.isEmpty(str)) {
    return NaN;
  }
  return num;
};
goog.string.isLowerCamelCase = function(str) {
  return/^[a-z]+([A-Z][a-z]*)*$/.test(str);
};
goog.string.isUpperCamelCase = function(str) {
  return/^([A-Z][a-z]*)+$/.test(str);
};
goog.string.toCamelCase = function(str) {
  return String(str).replace(/\-([a-z])/g, function(all, match) {
    return match.toUpperCase();
  });
};
goog.string.toSelectorCase = function(str) {
  return String(str).replace(/([A-Z])/g, "-$1").toLowerCase();
};
goog.string.toTitleCase = function(str, opt_delimiters) {
  var delimiters = goog.isString(opt_delimiters) ? goog.string.regExpEscape(opt_delimiters) : "\\s";
  delimiters = delimiters ? "|[" + delimiters + "]+" : "";
  var regexp = new RegExp("(^" + delimiters + ")([a-z])", "g");
  return str.replace(regexp, function(all, p1, p2) {
    return p1 + p2.toUpperCase();
  });
};
goog.string.capitalize = function(str) {
  return String(str.charAt(0)).toUpperCase() + String(str.substr(1)).toLowerCase();
};
goog.string.parseInt = function(value) {
  if (isFinite(value)) {
    value = String(value);
  }
  if (goog.isString(value)) {
    return/^\s*-?0x/i.test(value) ? parseInt(value, 16) : parseInt(value, 10);
  }
  return NaN;
};
goog.string.splitLimit = function(str, separator, limit) {
  var parts = str.split(separator);
  var returnVal = [];
  while (limit > 0 && parts.length) {
    returnVal.push(parts.shift());
    limit--;
  }
  if (parts.length) {
    returnVal.push(parts.join(separator));
  }
  return returnVal;
};
goog.string.editDistance = function(a, b) {
  var v0 = [];
  var v1 = [];
  if (a == b) {
    return 0;
  }
  if (!a.length || !b.length) {
    return Math.max(a.length, b.length);
  }
  for (var i = 0;i < b.length + 1;i++) {
    v0[i] = i;
  }
  for (var i = 0;i < a.length;i++) {
    v1[0] = i + 1;
    for (var j = 0;j < b.length;j++) {
      var cost = a[i] != b[j];
      v1[j + 1] = Math.min(v1[j] + 1, v0[j + 1] + 1, v0[j] + cost);
    }
    for (var j = 0;j < v0.length;j++) {
      v0[j] = v1[j];
    }
  }
  return v1[b.length];
};
goog.provide("goog.asserts");
goog.provide("goog.asserts.AssertionError");
goog.require("goog.debug.Error");
goog.require("goog.dom.NodeType");
goog.require("goog.string");
goog.define("goog.asserts.ENABLE_ASSERTS", goog.DEBUG);
goog.asserts.AssertionError = function(messagePattern, messageArgs) {
  messageArgs.unshift(messagePattern);
  goog.debug.Error.call(this, goog.string.subs.apply(null, messageArgs));
  messageArgs.shift();
  this.messagePattern = messagePattern;
};
goog.inherits(goog.asserts.AssertionError, goog.debug.Error);
goog.asserts.AssertionError.prototype.name = "AssertionError";
goog.asserts.DEFAULT_ERROR_HANDLER = function(e) {
  throw e;
};
goog.asserts.errorHandler_ = goog.asserts.DEFAULT_ERROR_HANDLER;
goog.asserts.doAssertFailure_ = function(defaultMessage, defaultArgs, givenMessage, givenArgs) {
  var message = "Assertion failed";
  if (givenMessage) {
    message += ": " + givenMessage;
    var args = givenArgs;
  } else {
    if (defaultMessage) {
      message += ": " + defaultMessage;
      args = defaultArgs;
    }
  }
  var e = new goog.asserts.AssertionError("" + message, args || []);
  goog.asserts.errorHandler_(e);
};
goog.asserts.setErrorHandler = function(errorHandler) {
  if (goog.asserts.ENABLE_ASSERTS) {
    goog.asserts.errorHandler_ = errorHandler;
  }
};
goog.asserts.assert = function(condition, opt_message, var_args) {
  if (goog.asserts.ENABLE_ASSERTS && !condition) {
    goog.asserts.doAssertFailure_("", null, opt_message, Array.prototype.slice.call(arguments, 2));
  }
  return condition;
};
goog.asserts.fail = function(opt_message, var_args) {
  if (goog.asserts.ENABLE_ASSERTS) {
    goog.asserts.errorHandler_(new goog.asserts.AssertionError("Failure" + (opt_message ? ": " + opt_message : ""), Array.prototype.slice.call(arguments, 1)));
  }
};
goog.asserts.assertNumber = function(value, opt_message, var_args) {
  if (goog.asserts.ENABLE_ASSERTS && !goog.isNumber(value)) {
    goog.asserts.doAssertFailure_("Expected number but got %s: %s.", [goog.typeOf(value), value], opt_message, Array.prototype.slice.call(arguments, 2));
  }
  return(value);
};
goog.asserts.assertString = function(value, opt_message, var_args) {
  if (goog.asserts.ENABLE_ASSERTS && !goog.isString(value)) {
    goog.asserts.doAssertFailure_("Expected string but got %s: %s.", [goog.typeOf(value), value], opt_message, Array.prototype.slice.call(arguments, 2));
  }
  return(value);
};
goog.asserts.assertFunction = function(value, opt_message, var_args) {
  if (goog.asserts.ENABLE_ASSERTS && !goog.isFunction(value)) {
    goog.asserts.doAssertFailure_("Expected function but got %s: %s.", [goog.typeOf(value), value], opt_message, Array.prototype.slice.call(arguments, 2));
  }
  return(value);
};
goog.asserts.assertObject = function(value, opt_message, var_args) {
  if (goog.asserts.ENABLE_ASSERTS && !goog.isObject(value)) {
    goog.asserts.doAssertFailure_("Expected object but got %s: %s.", [goog.typeOf(value), value], opt_message, Array.prototype.slice.call(arguments, 2));
  }
  return(value);
};
goog.asserts.assertArray = function(value, opt_message, var_args) {
  if (goog.asserts.ENABLE_ASSERTS && !goog.isArray(value)) {
    goog.asserts.doAssertFailure_("Expected array but got %s: %s.", [goog.typeOf(value), value], opt_message, Array.prototype.slice.call(arguments, 2));
  }
  return(value);
};
goog.asserts.assertBoolean = function(value, opt_message, var_args) {
  if (goog.asserts.ENABLE_ASSERTS && !goog.isBoolean(value)) {
    goog.asserts.doAssertFailure_("Expected boolean but got %s: %s.", [goog.typeOf(value), value], opt_message, Array.prototype.slice.call(arguments, 2));
  }
  return(value);
};
goog.asserts.assertElement = function(value, opt_message, var_args) {
  if (goog.asserts.ENABLE_ASSERTS && (!goog.isObject(value) || value.nodeType != goog.dom.NodeType.ELEMENT)) {
    goog.asserts.doAssertFailure_("Expected Element but got %s: %s.", [goog.typeOf(value), value], opt_message, Array.prototype.slice.call(arguments, 2));
  }
  return(value);
};
goog.asserts.assertInstanceof = function(value, type, opt_message, var_args) {
  if (goog.asserts.ENABLE_ASSERTS && !(value instanceof type)) {
    goog.asserts.doAssertFailure_("Expected instanceof %s but got %s.", [goog.asserts.getType_(type), goog.asserts.getType_(value)], opt_message, Array.prototype.slice.call(arguments, 3));
  }
  return value;
};
goog.asserts.assertObjectPrototypeIsIntact = function() {
  for (var key in Object.prototype) {
    goog.asserts.fail(key + " should not be enumerable in Object.prototype.");
  }
};
goog.asserts.getType_ = function(value) {
  if (value instanceof Function) {
    return value["displayName"] || value.name || "unknown type name";
  } else {
    if (value instanceof Object) {
      return value.constructor["displayName"] || value.constructor.name || Object.prototype.toString.call(value);
    } else {
      return value === null ? "null" : typeof value;
    }
  }
};
goog.provide("goog.array");
goog.provide("goog.array.ArrayLike");
goog.require("goog.asserts");
goog.define("goog.NATIVE_ARRAY_PROTOTYPES", goog.TRUSTED_SITE);
goog.define("goog.array.ASSUME_NATIVE_FUNCTIONS", false);
goog.array.ArrayLike;
goog.array.peek = function(array) {
  return array[array.length - 1];
};
goog.array.last = goog.array.peek;
goog.array.ARRAY_PROTOTYPE_ = Array.prototype;
goog.array.indexOf = goog.NATIVE_ARRAY_PROTOTYPES && (goog.array.ASSUME_NATIVE_FUNCTIONS || goog.array.ARRAY_PROTOTYPE_.indexOf) ? function(arr, obj, opt_fromIndex) {
  goog.asserts.assert(arr.length != null);
  return goog.array.ARRAY_PROTOTYPE_.indexOf.call(arr, obj, opt_fromIndex);
} : function(arr, obj, opt_fromIndex) {
  var fromIndex = opt_fromIndex == null ? 0 : opt_fromIndex < 0 ? Math.max(0, arr.length + opt_fromIndex) : opt_fromIndex;
  if (goog.isString(arr)) {
    if (!goog.isString(obj) || obj.length != 1) {
      return-1;
    }
    return arr.indexOf(obj, fromIndex);
  }
  for (var i = fromIndex;i < arr.length;i++) {
    if (i in arr && arr[i] === obj) {
      return i;
    }
  }
  return-1;
};
goog.array.lastIndexOf = goog.NATIVE_ARRAY_PROTOTYPES && (goog.array.ASSUME_NATIVE_FUNCTIONS || goog.array.ARRAY_PROTOTYPE_.lastIndexOf) ? function(arr, obj, opt_fromIndex) {
  goog.asserts.assert(arr.length != null);
  var fromIndex = opt_fromIndex == null ? arr.length - 1 : opt_fromIndex;
  return goog.array.ARRAY_PROTOTYPE_.lastIndexOf.call(arr, obj, fromIndex);
} : function(arr, obj, opt_fromIndex) {
  var fromIndex = opt_fromIndex == null ? arr.length - 1 : opt_fromIndex;
  if (fromIndex < 0) {
    fromIndex = Math.max(0, arr.length + fromIndex);
  }
  if (goog.isString(arr)) {
    if (!goog.isString(obj) || obj.length != 1) {
      return-1;
    }
    return arr.lastIndexOf(obj, fromIndex);
  }
  for (var i = fromIndex;i >= 0;i--) {
    if (i in arr && arr[i] === obj) {
      return i;
    }
  }
  return-1;
};
goog.array.forEach = goog.NATIVE_ARRAY_PROTOTYPES && (goog.array.ASSUME_NATIVE_FUNCTIONS || goog.array.ARRAY_PROTOTYPE_.forEach) ? function(arr, f, opt_obj) {
  goog.asserts.assert(arr.length != null);
  goog.array.ARRAY_PROTOTYPE_.forEach.call(arr, f, opt_obj);
} : function(arr, f, opt_obj) {
  var l = arr.length;
  var arr2 = goog.isString(arr) ? arr.split("") : arr;
  for (var i = 0;i < l;i++) {
    if (i in arr2) {
      f.call(opt_obj, arr2[i], i, arr);
    }
  }
};
goog.array.forEachRight = function(arr, f, opt_obj) {
  var l = arr.length;
  var arr2 = goog.isString(arr) ? arr.split("") : arr;
  for (var i = l - 1;i >= 0;--i) {
    if (i in arr2) {
      f.call(opt_obj, arr2[i], i, arr);
    }
  }
};
goog.array.filter = goog.NATIVE_ARRAY_PROTOTYPES && (goog.array.ASSUME_NATIVE_FUNCTIONS || goog.array.ARRAY_PROTOTYPE_.filter) ? function(arr, f, opt_obj) {
  goog.asserts.assert(arr.length != null);
  return goog.array.ARRAY_PROTOTYPE_.filter.call(arr, f, opt_obj);
} : function(arr, f, opt_obj) {
  var l = arr.length;
  var res = [];
  var resLength = 0;
  var arr2 = goog.isString(arr) ? arr.split("") : arr;
  for (var i = 0;i < l;i++) {
    if (i in arr2) {
      var val = arr2[i];
      if (f.call(opt_obj, val, i, arr)) {
        res[resLength++] = val;
      }
    }
  }
  return res;
};
goog.array.map = goog.NATIVE_ARRAY_PROTOTYPES && (goog.array.ASSUME_NATIVE_FUNCTIONS || goog.array.ARRAY_PROTOTYPE_.map) ? function(arr, f, opt_obj) {
  goog.asserts.assert(arr.length != null);
  return goog.array.ARRAY_PROTOTYPE_.map.call(arr, f, opt_obj);
} : function(arr, f, opt_obj) {
  var l = arr.length;
  var res = new Array(l);
  var arr2 = goog.isString(arr) ? arr.split("") : arr;
  for (var i = 0;i < l;i++) {
    if (i in arr2) {
      res[i] = f.call(opt_obj, arr2[i], i, arr);
    }
  }
  return res;
};
goog.array.reduce = goog.NATIVE_ARRAY_PROTOTYPES && (goog.array.ASSUME_NATIVE_FUNCTIONS || goog.array.ARRAY_PROTOTYPE_.reduce) ? function(arr, f, val, opt_obj) {
  goog.asserts.assert(arr.length != null);
  if (opt_obj) {
    f = goog.bind(f, opt_obj);
  }
  return goog.array.ARRAY_PROTOTYPE_.reduce.call(arr, f, val);
} : function(arr, f, val, opt_obj) {
  var rval = val;
  goog.array.forEach(arr, function(val, index) {
    rval = f.call(opt_obj, rval, val, index, arr);
  });
  return rval;
};
goog.array.reduceRight = goog.NATIVE_ARRAY_PROTOTYPES && (goog.array.ASSUME_NATIVE_FUNCTIONS || goog.array.ARRAY_PROTOTYPE_.reduceRight) ? function(arr, f, val, opt_obj) {
  goog.asserts.assert(arr.length != null);
  if (opt_obj) {
    f = goog.bind(f, opt_obj);
  }
  return goog.array.ARRAY_PROTOTYPE_.reduceRight.call(arr, f, val);
} : function(arr, f, val, opt_obj) {
  var rval = val;
  goog.array.forEachRight(arr, function(val, index) {
    rval = f.call(opt_obj, rval, val, index, arr);
  });
  return rval;
};
goog.array.some = goog.NATIVE_ARRAY_PROTOTYPES && (goog.array.ASSUME_NATIVE_FUNCTIONS || goog.array.ARRAY_PROTOTYPE_.some) ? function(arr, f, opt_obj) {
  goog.asserts.assert(arr.length != null);
  return goog.array.ARRAY_PROTOTYPE_.some.call(arr, f, opt_obj);
} : function(arr, f, opt_obj) {
  var l = arr.length;
  var arr2 = goog.isString(arr) ? arr.split("") : arr;
  for (var i = 0;i < l;i++) {
    if (i in arr2 && f.call(opt_obj, arr2[i], i, arr)) {
      return true;
    }
  }
  return false;
};
goog.array.every = goog.NATIVE_ARRAY_PROTOTYPES && (goog.array.ASSUME_NATIVE_FUNCTIONS || goog.array.ARRAY_PROTOTYPE_.every) ? function(arr, f, opt_obj) {
  goog.asserts.assert(arr.length != null);
  return goog.array.ARRAY_PROTOTYPE_.every.call(arr, f, opt_obj);
} : function(arr, f, opt_obj) {
  var l = arr.length;
  var arr2 = goog.isString(arr) ? arr.split("") : arr;
  for (var i = 0;i < l;i++) {
    if (i in arr2 && !f.call(opt_obj, arr2[i], i, arr)) {
      return false;
    }
  }
  return true;
};
goog.array.count = function(arr, f, opt_obj) {
  var count = 0;
  goog.array.forEach(arr, function(element, index, arr) {
    if (f.call(opt_obj, element, index, arr)) {
      ++count;
    }
  }, opt_obj);
  return count;
};
goog.array.find = function(arr, f, opt_obj) {
  var i = goog.array.findIndex(arr, f, opt_obj);
  return i < 0 ? null : goog.isString(arr) ? arr.charAt(i) : arr[i];
};
goog.array.findIndex = function(arr, f, opt_obj) {
  var l = arr.length;
  var arr2 = goog.isString(arr) ? arr.split("") : arr;
  for (var i = 0;i < l;i++) {
    if (i in arr2 && f.call(opt_obj, arr2[i], i, arr)) {
      return i;
    }
  }
  return-1;
};
goog.array.findRight = function(arr, f, opt_obj) {
  var i = goog.array.findIndexRight(arr, f, opt_obj);
  return i < 0 ? null : goog.isString(arr) ? arr.charAt(i) : arr[i];
};
goog.array.findIndexRight = function(arr, f, opt_obj) {
  var l = arr.length;
  var arr2 = goog.isString(arr) ? arr.split("") : arr;
  for (var i = l - 1;i >= 0;i--) {
    if (i in arr2 && f.call(opt_obj, arr2[i], i, arr)) {
      return i;
    }
  }
  return-1;
};
goog.array.contains = function(arr, obj) {
  return goog.array.indexOf(arr, obj) >= 0;
};
goog.array.isEmpty = function(arr) {
  return arr.length == 0;
};
goog.array.clear = function(arr) {
  if (!goog.isArray(arr)) {
    for (var i = arr.length - 1;i >= 0;i--) {
      delete arr[i];
    }
  }
  arr.length = 0;
};
goog.array.insert = function(arr, obj) {
  if (!goog.array.contains(arr, obj)) {
    arr.push(obj);
  }
};
goog.array.insertAt = function(arr, obj, opt_i) {
  goog.array.splice(arr, opt_i, 0, obj);
};
goog.array.insertArrayAt = function(arr, elementsToAdd, opt_i) {
  goog.partial(goog.array.splice, arr, opt_i, 0).apply(null, elementsToAdd);
};
goog.array.insertBefore = function(arr, obj, opt_obj2) {
  var i;
  if (arguments.length == 2 || (i = goog.array.indexOf(arr, opt_obj2)) < 0) {
    arr.push(obj);
  } else {
    goog.array.insertAt(arr, obj, i);
  }
};
goog.array.remove = function(arr, obj) {
  var i = goog.array.indexOf(arr, obj);
  var rv;
  if (rv = i >= 0) {
    goog.array.removeAt(arr, i);
  }
  return rv;
};
goog.array.removeAt = function(arr, i) {
  goog.asserts.assert(arr.length != null);
  return goog.array.ARRAY_PROTOTYPE_.splice.call(arr, i, 1).length == 1;
};
goog.array.removeIf = function(arr, f, opt_obj) {
  var i = goog.array.findIndex(arr, f, opt_obj);
  if (i >= 0) {
    goog.array.removeAt(arr, i);
    return true;
  }
  return false;
};
goog.array.removeAllIf = function(arr, f, opt_obj) {
  var removedCount = 0;
  goog.array.forEachRight(arr, function(val, index) {
    if (f.call(opt_obj, val, index, arr)) {
      if (goog.array.removeAt(arr, index)) {
        removedCount++;
      }
    }
  });
  return removedCount;
};
goog.array.concat = function(var_args) {
  return goog.array.ARRAY_PROTOTYPE_.concat.apply(goog.array.ARRAY_PROTOTYPE_, arguments);
};
goog.array.join = function(var_args) {
  return goog.array.ARRAY_PROTOTYPE_.concat.apply(goog.array.ARRAY_PROTOTYPE_, arguments);
};
goog.array.toArray = function(object) {
  var length = object.length;
  if (length > 0) {
    var rv = new Array(length);
    for (var i = 0;i < length;i++) {
      rv[i] = object[i];
    }
    return rv;
  }
  return[];
};
goog.array.clone = goog.array.toArray;
goog.array.extend = function(arr1, var_args) {
  for (var i = 1;i < arguments.length;i++) {
    var arr2 = arguments[i];
    if (goog.isArrayLike(arr2)) {
      var len1 = arr1.length || 0;
      var len2 = arr2.length || 0;
      arr1.length = len1 + len2;
      for (var j = 0;j < len2;j++) {
        arr1[len1 + j] = arr2[j];
      }
    } else {
      arr1.push(arr2);
    }
  }
};
goog.array.splice = function(arr, index, howMany, var_args) {
  goog.asserts.assert(arr.length != null);
  return goog.array.ARRAY_PROTOTYPE_.splice.apply(arr, goog.array.slice(arguments, 1));
};
goog.array.slice = function(arr, start, opt_end) {
  goog.asserts.assert(arr.length != null);
  if (arguments.length <= 2) {
    return goog.array.ARRAY_PROTOTYPE_.slice.call(arr, start);
  } else {
    return goog.array.ARRAY_PROTOTYPE_.slice.call(arr, start, opt_end);
  }
};
goog.array.removeDuplicates = function(arr, opt_rv, opt_hashFn) {
  var returnArray = opt_rv || arr;
  var defaultHashFn = function(item) {
    return goog.isObject(current) ? "o" + goog.getUid(current) : (typeof current).charAt(0) + current;
  };
  var hashFn = opt_hashFn || defaultHashFn;
  var seen = {}, cursorInsert = 0, cursorRead = 0;
  while (cursorRead < arr.length) {
    var current = arr[cursorRead++];
    var key = hashFn(current);
    if (!Object.prototype.hasOwnProperty.call(seen, key)) {
      seen[key] = true;
      returnArray[cursorInsert++] = current;
    }
  }
  returnArray.length = cursorInsert;
};
goog.array.binarySearch = function(arr, target, opt_compareFn) {
  return goog.array.binarySearch_(arr, opt_compareFn || goog.array.defaultCompare, false, target);
};
goog.array.binarySelect = function(arr, evaluator, opt_obj) {
  return goog.array.binarySearch_(arr, evaluator, true, undefined, opt_obj);
};
goog.array.binarySearch_ = function(arr, compareFn, isEvaluator, opt_target, opt_selfObj) {
  var left = 0;
  var right = arr.length;
  var found;
  while (left < right) {
    var middle = left + right >> 1;
    var compareResult;
    if (isEvaluator) {
      compareResult = compareFn.call(opt_selfObj, arr[middle], middle, arr);
    } else {
      compareResult = compareFn(opt_target, arr[middle]);
    }
    if (compareResult > 0) {
      left = middle + 1;
    } else {
      right = middle;
      found = !compareResult;
    }
  }
  return found ? left : ~left;
};
goog.array.sort = function(arr, opt_compareFn) {
  arr.sort(opt_compareFn || goog.array.defaultCompare);
};
goog.array.stableSort = function(arr, opt_compareFn) {
  for (var i = 0;i < arr.length;i++) {
    arr[i] = {index:i, value:arr[i]};
  }
  var valueCompareFn = opt_compareFn || goog.array.defaultCompare;
  function stableCompareFn(obj1, obj2) {
    return valueCompareFn(obj1.value, obj2.value) || obj1.index - obj2.index;
  }
  goog.array.sort(arr, stableCompareFn);
  for (var i = 0;i < arr.length;i++) {
    arr[i] = arr[i].value;
  }
};
goog.array.sortByKey = function(arr, keyFn, opt_compareFn) {
  var keyCompareFn = opt_compareFn || goog.array.defaultCompare;
  goog.array.sort(arr, function(a, b) {
    return keyCompareFn(keyFn(a), keyFn(b));
  });
};
goog.array.sortObjectsByKey = function(arr, key, opt_compareFn) {
  goog.array.sortByKey(arr, function(obj) {
    return obj[key];
  }, opt_compareFn);
};
goog.array.isSorted = function(arr, opt_compareFn, opt_strict) {
  var compare = opt_compareFn || goog.array.defaultCompare;
  for (var i = 1;i < arr.length;i++) {
    var compareResult = compare(arr[i - 1], arr[i]);
    if (compareResult > 0 || compareResult == 0 && opt_strict) {
      return false;
    }
  }
  return true;
};
goog.array.equals = function(arr1, arr2, opt_equalsFn) {
  if (!goog.isArrayLike(arr1) || !goog.isArrayLike(arr2) || arr1.length != arr2.length) {
    return false;
  }
  var l = arr1.length;
  var equalsFn = opt_equalsFn || goog.array.defaultCompareEquality;
  for (var i = 0;i < l;i++) {
    if (!equalsFn(arr1[i], arr2[i])) {
      return false;
    }
  }
  return true;
};
goog.array.compare3 = function(arr1, arr2, opt_compareFn) {
  var compare = opt_compareFn || goog.array.defaultCompare;
  var l = Math.min(arr1.length, arr2.length);
  for (var i = 0;i < l;i++) {
    var result = compare(arr1[i], arr2[i]);
    if (result != 0) {
      return result;
    }
  }
  return goog.array.defaultCompare(arr1.length, arr2.length);
};
goog.array.defaultCompare = function(a, b) {
  return a > b ? 1 : a < b ? -1 : 0;
};
goog.array.defaultCompareEquality = function(a, b) {
  return a === b;
};
goog.array.binaryInsert = function(array, value, opt_compareFn) {
  var index = goog.array.binarySearch(array, value, opt_compareFn);
  if (index < 0) {
    goog.array.insertAt(array, value, -(index + 1));
    return true;
  }
  return false;
};
goog.array.binaryRemove = function(array, value, opt_compareFn) {
  var index = goog.array.binarySearch(array, value, opt_compareFn);
  return index >= 0 ? goog.array.removeAt(array, index) : false;
};
goog.array.bucket = function(array, sorter, opt_obj) {
  var buckets = {};
  for (var i = 0;i < array.length;i++) {
    var value = array[i];
    var key = sorter.call(opt_obj, value, i, array);
    if (goog.isDef(key)) {
      var bucket = buckets[key] || (buckets[key] = []);
      bucket.push(value);
    }
  }
  return buckets;
};
goog.array.toObject = function(arr, keyFunc, opt_obj) {
  var ret = {};
  goog.array.forEach(arr, function(element, index) {
    ret[keyFunc.call(opt_obj, element, index, arr)] = element;
  });
  return ret;
};
goog.array.range = function(startOrEnd, opt_end, opt_step) {
  var array = [];
  var start = 0;
  var end = startOrEnd;
  var step = opt_step || 1;
  if (opt_end !== undefined) {
    start = startOrEnd;
    end = opt_end;
  }
  if (step * (end - start) < 0) {
    return[];
  }
  if (step > 0) {
    for (var i = start;i < end;i += step) {
      array.push(i);
    }
  } else {
    for (var i = start;i > end;i += step) {
      array.push(i);
    }
  }
  return array;
};
goog.array.repeat = function(value, n) {
  var array = [];
  for (var i = 0;i < n;i++) {
    array[i] = value;
  }
  return array;
};
goog.array.flatten = function(var_args) {
  var CHUNK_SIZE = 8192;
  var result = [];
  for (var i = 0;i < arguments.length;i++) {
    var element = arguments[i];
    if (goog.isArray(element)) {
      for (var c = 0;c < element.length;c += CHUNK_SIZE) {
        var chunk = goog.array.slice(element, c, c + CHUNK_SIZE);
        var recurseResult = goog.array.flatten.apply(null, chunk);
        for (var r = 0;r < recurseResult.length;r++) {
          result.push(recurseResult[r]);
        }
      }
    } else {
      result.push(element);
    }
  }
  return result;
};
goog.array.rotate = function(array, n) {
  goog.asserts.assert(array.length != null);
  if (array.length) {
    n %= array.length;
    if (n > 0) {
      goog.array.ARRAY_PROTOTYPE_.unshift.apply(array, array.splice(-n, n));
    } else {
      if (n < 0) {
        goog.array.ARRAY_PROTOTYPE_.push.apply(array, array.splice(0, -n));
      }
    }
  }
  return array;
};
goog.array.moveItem = function(arr, fromIndex, toIndex) {
  goog.asserts.assert(fromIndex >= 0 && fromIndex < arr.length);
  goog.asserts.assert(toIndex >= 0 && toIndex < arr.length);
  var removedItems = goog.array.ARRAY_PROTOTYPE_.splice.call(arr, fromIndex, 1);
  goog.array.ARRAY_PROTOTYPE_.splice.call(arr, toIndex, 0, removedItems[0]);
};
goog.array.zip = function(var_args) {
  if (!arguments.length) {
    return[];
  }
  var result = [];
  for (var i = 0;true;i++) {
    var value = [];
    for (var j = 0;j < arguments.length;j++) {
      var arr = arguments[j];
      if (i >= arr.length) {
        return result;
      }
      value.push(arr[i]);
    }
    result.push(value);
  }
};
goog.array.shuffle = function(arr, opt_randFn) {
  var randFn = opt_randFn || Math.random;
  for (var i = arr.length - 1;i > 0;i--) {
    var j = Math.floor(randFn() * (i + 1));
    var tmp = arr[i];
    arr[i] = arr[j];
    arr[j] = tmp;
  }
};
goog.provide("goog.proto2.FieldDescriptor");
goog.require("goog.asserts");
goog.require("goog.string");
goog.proto2.FieldDescriptor = function(messageType, tag, metadata) {
  this.parent_ = messageType;
  goog.asserts.assert(goog.string.isNumeric(tag));
  this.tag_ = (tag);
  this.name_ = metadata.name;
  metadata.fieldType;
  metadata.repeated;
  metadata.required;
  metadata.packed;
  this.isPacked_ = !!metadata.packed;
  this.isRepeated_ = !!metadata.repeated;
  this.isRequired_ = !!metadata.required;
  this.fieldType_ = metadata.fieldType;
  this.nativeType_ = metadata.type;
  this.deserializationConversionPermitted_ = false;
  switch(this.fieldType_) {
    case goog.proto2.FieldDescriptor.FieldType.INT64:
    ;
    case goog.proto2.FieldDescriptor.FieldType.UINT64:
    ;
    case goog.proto2.FieldDescriptor.FieldType.FIXED64:
    ;
    case goog.proto2.FieldDescriptor.FieldType.SFIXED64:
    ;
    case goog.proto2.FieldDescriptor.FieldType.SINT64:
    ;
    case goog.proto2.FieldDescriptor.FieldType.FLOAT:
    ;
    case goog.proto2.FieldDescriptor.FieldType.DOUBLE:
      this.deserializationConversionPermitted_ = true;
      break;
  }
  this.defaultValue_ = metadata.defaultValue;
};
goog.proto2.FieldDescriptor.FieldType = {DOUBLE:1, FLOAT:2, INT64:3, UINT64:4, INT32:5, FIXED64:6, FIXED32:7, BOOL:8, STRING:9, GROUP:10, MESSAGE:11, BYTES:12, UINT32:13, ENUM:14, SFIXED32:15, SFIXED64:16, SINT32:17, SINT64:18};
goog.proto2.FieldDescriptor.prototype.getTag = function() {
  return this.tag_;
};
goog.proto2.FieldDescriptor.prototype.getContainingType = function() {
  return this.parent_.getDescriptor();
};
goog.proto2.FieldDescriptor.prototype.getName = function() {
  return this.name_;
};
goog.proto2.FieldDescriptor.prototype.getDefaultValue = function() {
  if (this.defaultValue_ === undefined) {
    var nativeType = this.nativeType_;
    if (nativeType === Boolean) {
      this.defaultValue_ = false;
    } else {
      if (nativeType === Number) {
        this.defaultValue_ = 0;
      } else {
        if (nativeType === String) {
          if (this.deserializationConversionPermitted_) {
            this.defaultValue_ = "0";
          } else {
            this.defaultValue_ = "";
          }
        } else {
          return new nativeType;
        }
      }
    }
  }
  return this.defaultValue_;
};
goog.proto2.FieldDescriptor.prototype.getFieldType = function() {
  return this.fieldType_;
};
goog.proto2.FieldDescriptor.prototype.getNativeType = function() {
  return this.nativeType_;
};
goog.proto2.FieldDescriptor.prototype.deserializationConversionPermitted = function() {
  return this.deserializationConversionPermitted_;
};
goog.proto2.FieldDescriptor.prototype.getFieldMessageType = function() {
  return this.nativeType_.getDescriptor();
};
goog.proto2.FieldDescriptor.prototype.isCompositeType = function() {
  return this.fieldType_ == goog.proto2.FieldDescriptor.FieldType.MESSAGE || this.fieldType_ == goog.proto2.FieldDescriptor.FieldType.GROUP;
};
goog.proto2.FieldDescriptor.prototype.isPacked = function() {
  return this.isPacked_;
};
goog.proto2.FieldDescriptor.prototype.isRepeated = function() {
  return this.isRepeated_;
};
goog.proto2.FieldDescriptor.prototype.isRequired = function() {
  return this.isRequired_;
};
goog.proto2.FieldDescriptor.prototype.isOptional = function() {
  return!this.isRepeated_ && !this.isRequired_;
};
goog.provide("goog.object");
goog.object.forEach = function(obj, f, opt_obj) {
  for (var key in obj) {
    f.call(opt_obj, obj[key], key, obj);
  }
};
goog.object.filter = function(obj, f, opt_obj) {
  var res = {};
  for (var key in obj) {
    if (f.call(opt_obj, obj[key], key, obj)) {
      res[key] = obj[key];
    }
  }
  return res;
};
goog.object.map = function(obj, f, opt_obj) {
  var res = {};
  for (var key in obj) {
    res[key] = f.call(opt_obj, obj[key], key, obj);
  }
  return res;
};
goog.object.some = function(obj, f, opt_obj) {
  for (var key in obj) {
    if (f.call(opt_obj, obj[key], key, obj)) {
      return true;
    }
  }
  return false;
};
goog.object.every = function(obj, f, opt_obj) {
  for (var key in obj) {
    if (!f.call(opt_obj, obj[key], key, obj)) {
      return false;
    }
  }
  return true;
};
goog.object.getCount = function(obj) {
  var rv = 0;
  for (var key in obj) {
    rv++;
  }
  return rv;
};
goog.object.getAnyKey = function(obj) {
  for (var key in obj) {
    return key;
  }
};
goog.object.getAnyValue = function(obj) {
  for (var key in obj) {
    return obj[key];
  }
};
goog.object.contains = function(obj, val) {
  return goog.object.containsValue(obj, val);
};
goog.object.getValues = function(obj) {
  var res = [];
  var i = 0;
  for (var key in obj) {
    res[i++] = obj[key];
  }
  return res;
};
goog.object.getKeys = function(obj) {
  var res = [];
  var i = 0;
  for (var key in obj) {
    res[i++] = key;
  }
  return res;
};
goog.object.getValueByKeys = function(obj, var_args) {
  var isArrayLike = goog.isArrayLike(var_args);
  var keys = isArrayLike ? var_args : arguments;
  for (var i = isArrayLike ? 0 : 1;i < keys.length;i++) {
    obj = obj[keys[i]];
    if (!goog.isDef(obj)) {
      break;
    }
  }
  return obj;
};
goog.object.containsKey = function(obj, key) {
  return key in obj;
};
goog.object.containsValue = function(obj, val) {
  for (var key in obj) {
    if (obj[key] == val) {
      return true;
    }
  }
  return false;
};
goog.object.findKey = function(obj, f, opt_this) {
  for (var key in obj) {
    if (f.call(opt_this, obj[key], key, obj)) {
      return key;
    }
  }
  return undefined;
};
goog.object.findValue = function(obj, f, opt_this) {
  var key = goog.object.findKey(obj, f, opt_this);
  return key && obj[key];
};
goog.object.isEmpty = function(obj) {
  for (var key in obj) {
    return false;
  }
  return true;
};
goog.object.clear = function(obj) {
  for (var i in obj) {
    delete obj[i];
  }
};
goog.object.remove = function(obj, key) {
  var rv;
  if (rv = key in obj) {
    delete obj[key];
  }
  return rv;
};
goog.object.add = function(obj, key, val) {
  if (key in obj) {
    throw Error('The object already contains the key "' + key + '"');
  }
  goog.object.set(obj, key, val);
};
goog.object.get = function(obj, key, opt_val) {
  if (key in obj) {
    return obj[key];
  }
  return opt_val;
};
goog.object.set = function(obj, key, value) {
  obj[key] = value;
};
goog.object.setIfUndefined = function(obj, key, value) {
  return key in obj ? obj[key] : obj[key] = value;
};
goog.object.equals = function(a, b) {
  for (var k in a) {
    if (!(k in b) || a[k] !== b[k]) {
      return false;
    }
  }
  for (var k in b) {
    if (!(k in a)) {
      return false;
    }
  }
  return true;
};
goog.object.clone = function(obj) {
  var res = {};
  for (var key in obj) {
    res[key] = obj[key];
  }
  return res;
};
goog.object.unsafeClone = function(obj) {
  var type = goog.typeOf(obj);
  if (type == "object" || type == "array") {
    if (obj.clone) {
      return obj.clone();
    }
    var clone = type == "array" ? [] : {};
    for (var key in obj) {
      clone[key] = goog.object.unsafeClone(obj[key]);
    }
    return clone;
  }
  return obj;
};
goog.object.transpose = function(obj) {
  var transposed = {};
  for (var key in obj) {
    transposed[obj[key]] = key;
  }
  return transposed;
};
goog.object.PROTOTYPE_FIELDS_ = ["constructor", "hasOwnProperty", "isPrototypeOf", "propertyIsEnumerable", "toLocaleString", "toString", "valueOf"];
goog.object.extend = function(target, var_args) {
  var key, source;
  for (var i = 1;i < arguments.length;i++) {
    source = arguments[i];
    for (key in source) {
      target[key] = source[key];
    }
    for (var j = 0;j < goog.object.PROTOTYPE_FIELDS_.length;j++) {
      key = goog.object.PROTOTYPE_FIELDS_[j];
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }
};
goog.object.create = function(var_args) {
  var argLength = arguments.length;
  if (argLength == 1 && goog.isArray(arguments[0])) {
    return goog.object.create.apply(null, arguments[0]);
  }
  if (argLength % 2) {
    throw Error("Uneven number of arguments");
  }
  var rv = {};
  for (var i = 0;i < argLength;i += 2) {
    rv[arguments[i]] = arguments[i + 1];
  }
  return rv;
};
goog.object.createSet = function(var_args) {
  var argLength = arguments.length;
  if (argLength == 1 && goog.isArray(arguments[0])) {
    return goog.object.createSet.apply(null, arguments[0]);
  }
  var rv = {};
  for (var i = 0;i < argLength;i++) {
    rv[arguments[i]] = true;
  }
  return rv;
};
goog.object.createImmutableView = function(obj) {
  var result = obj;
  if (Object.isFrozen && !Object.isFrozen(obj)) {
    result = Object.create(obj);
    Object.freeze(result);
  }
  return result;
};
goog.object.isImmutableView = function(obj) {
  return!!Object.isFrozen && Object.isFrozen(obj);
};
goog.provide("goog.proto2.Descriptor");
goog.provide("goog.proto2.Metadata");
goog.require("goog.array");
goog.require("goog.asserts");
goog.require("goog.object");
goog.require("goog.string");
goog.proto2.Metadata;
goog.proto2.Descriptor = function(messageType, metadata, fields) {
  this.messageType_ = messageType;
  this.name_ = metadata.name || null;
  this.fullName_ = metadata.fullName || null;
  this.containingType_ = metadata.containingType;
  this.fields_ = {};
  for (var i = 0;i < fields.length;i++) {
    var field = fields[i];
    this.fields_[field.getTag()] = field;
  }
};
goog.proto2.Descriptor.prototype.getName = function() {
  return this.name_;
};
goog.proto2.Descriptor.prototype.getFullName = function() {
  return this.fullName_;
};
goog.proto2.Descriptor.prototype.getContainingType = function() {
  if (!this.containingType_) {
    return null;
  }
  return this.containingType_.getDescriptor();
};
goog.proto2.Descriptor.prototype.getFields = function() {
  function tagComparator(fieldA, fieldB) {
    return fieldA.getTag() - fieldB.getTag();
  }
  var fields = goog.object.getValues(this.fields_);
  goog.array.sort(fields, tagComparator);
  return fields;
};
goog.proto2.Descriptor.prototype.getFieldsMap = function() {
  return this.fields_;
};
goog.proto2.Descriptor.prototype.findFieldByName = function(name) {
  var valueFound = goog.object.findValue(this.fields_, function(field, key, obj) {
    return field.getName() == name;
  });
  return(valueFound) || null;
};
goog.proto2.Descriptor.prototype.findFieldByTag = function(tag) {
  goog.asserts.assert(goog.string.isNumeric(tag));
  return this.fields_[parseInt(tag, 10)] || null;
};
goog.proto2.Descriptor.prototype.createMessageInstance = function() {
  return new this.messageType_;
};
goog.provide("goog.proto2.Message");
goog.require("goog.asserts");
goog.require("goog.proto2.Descriptor");
goog.require("goog.proto2.FieldDescriptor");
goog.proto2.Message = function() {
  this.values_ = {};
  this.fields_ = this.getDescriptor().getFieldsMap();
  this.lazyDeserializer_ = null;
  this.deserializedFields_ = null;
};
goog.proto2.Message.FieldType = {DOUBLE:1, FLOAT:2, INT64:3, UINT64:4, INT32:5, FIXED64:6, FIXED32:7, BOOL:8, STRING:9, GROUP:10, MESSAGE:11, BYTES:12, UINT32:13, ENUM:14, SFIXED32:15, SFIXED64:16, SINT32:17, SINT64:18};
goog.proto2.Message.descriptorObj_;
goog.proto2.Message.descriptor_;
goog.proto2.Message.prototype.initializeForLazyDeserializer = function(deserializer, data) {
  this.lazyDeserializer_ = deserializer;
  this.values_ = data;
  this.deserializedFields_ = {};
};
goog.proto2.Message.prototype.setUnknown = function(tag, value) {
  goog.asserts.assert(!this.fields_[tag], "Field is not unknown in this message");
  goog.asserts.assert(tag >= 1, "Tag is not valid");
  goog.asserts.assert(value !== null, "Value cannot be null");
  this.values_[tag] = value;
  if (this.deserializedFields_) {
    delete this.deserializedFields_[tag];
  }
};
goog.proto2.Message.prototype.forEachUnknown = function(callback, opt_scope) {
  var scope = opt_scope || this;
  for (var key in this.values_) {
    var keyNum = Number(key);
    if (!this.fields_[keyNum]) {
      callback.call(scope, keyNum, this.values_[key]);
    }
  }
};
goog.proto2.Message.prototype.getDescriptor = function() {
  var Ctor = this.constructor;
  return Ctor.descriptor_ || (Ctor.descriptor_ = goog.proto2.Message.createDescriptor(Ctor, Ctor.descriptorObj_));
};
goog.proto2.Message.prototype.has = function(field) {
  goog.asserts.assert(field.getContainingType() == this.getDescriptor(), "The current message does not contain the given field");
  return this.has$Value(field.getTag());
};
goog.proto2.Message.prototype.arrayOf = function(field) {
  goog.asserts.assert(field.getContainingType() == this.getDescriptor(), "The current message does not contain the given field");
  return this.array$Values(field.getTag());
};
goog.proto2.Message.prototype.countOf = function(field) {
  goog.asserts.assert(field.getContainingType() == this.getDescriptor(), "The current message does not contain the given field");
  return this.count$Values(field.getTag());
};
goog.proto2.Message.prototype.get = function(field, opt_index) {
  goog.asserts.assert(field.getContainingType() == this.getDescriptor(), "The current message does not contain the given field");
  return this.get$Value(field.getTag(), opt_index);
};
goog.proto2.Message.prototype.getOrDefault = function(field, opt_index) {
  goog.asserts.assert(field.getContainingType() == this.getDescriptor(), "The current message does not contain the given field");
  return this.get$ValueOrDefault(field.getTag(), opt_index);
};
goog.proto2.Message.prototype.set = function(field, value) {
  goog.asserts.assert(field.getContainingType() == this.getDescriptor(), "The current message does not contain the given field");
  this.set$Value(field.getTag(), value);
};
goog.proto2.Message.prototype.add = function(field, value) {
  goog.asserts.assert(field.getContainingType() == this.getDescriptor(), "The current message does not contain the given field");
  this.add$Value(field.getTag(), value);
};
goog.proto2.Message.prototype.clear = function(field) {
  goog.asserts.assert(field.getContainingType() == this.getDescriptor(), "The current message does not contain the given field");
  this.clear$Field(field.getTag());
};
goog.proto2.Message.prototype.equals = function(other) {
  if (!other || this.constructor != other.constructor) {
    return false;
  }
  var fields = this.getDescriptor().getFields();
  for (var i = 0;i < fields.length;i++) {
    var field = fields[i];
    var tag = field.getTag();
    if (this.has$Value(tag) != other.has$Value(tag)) {
      return false;
    }
    if (this.has$Value(tag)) {
      var isComposite = field.isCompositeType();
      var fieldsEqual = function(value1, value2) {
        return isComposite ? value1.equals(value2) : value1 == value2;
      };
      var thisValue = this.getValueForTag_(tag);
      var otherValue = other.getValueForTag_(tag);
      if (field.isRepeated()) {
        if (thisValue.length != otherValue.length) {
          return false;
        }
        for (var j = 0;j < thisValue.length;j++) {
          if (!fieldsEqual(thisValue[j], otherValue[j])) {
            return false;
          }
        }
      } else {
        if (!fieldsEqual(thisValue, otherValue)) {
          return false;
        }
      }
    }
  }
  return true;
};
goog.proto2.Message.prototype.copyFrom = function(message) {
  goog.asserts.assert(this.constructor == message.constructor, "The source message must have the same type.");
  if (this != message) {
    this.values_ = {};
    if (this.deserializedFields_) {
      this.deserializedFields_ = {};
    }
    this.mergeFrom(message);
  }
};
goog.proto2.Message.prototype.mergeFrom = function(message) {
  goog.asserts.assert(this.constructor == message.constructor, "The source message must have the same type.");
  var fields = this.getDescriptor().getFields();
  for (var i = 0;i < fields.length;i++) {
    var field = fields[i];
    var tag = field.getTag();
    if (message.has$Value(tag)) {
      if (this.deserializedFields_) {
        delete this.deserializedFields_[field.getTag()];
      }
      var isComposite = field.isCompositeType();
      if (field.isRepeated()) {
        var values = message.array$Values(tag);
        for (var j = 0;j < values.length;j++) {
          this.add$Value(tag, isComposite ? values[j].clone() : values[j]);
        }
      } else {
        var value = message.getValueForTag_(tag);
        if (isComposite) {
          var child = this.getValueForTag_(tag);
          if (child) {
            child.mergeFrom(value);
          } else {
            this.set$Value(tag, value.clone());
          }
        } else {
          this.set$Value(tag, value);
        }
      }
    }
  }
};
goog.proto2.Message.prototype.clone = function() {
  var clone = new this.constructor;
  clone.copyFrom(this);
  return clone;
};
goog.proto2.Message.prototype.initDefaults = function(simpleFieldsToo) {
  var fields = this.getDescriptor().getFields();
  for (var i = 0;i < fields.length;i++) {
    var field = fields[i];
    var tag = field.getTag();
    var isComposite = field.isCompositeType();
    if (!this.has$Value(tag) && !field.isRepeated()) {
      if (isComposite) {
        this.values_[tag] = new ((field.getNativeType()));
      } else {
        if (simpleFieldsToo) {
          this.values_[tag] = field.getDefaultValue();
        }
      }
    }
    if (isComposite) {
      if (field.isRepeated()) {
        var values = this.array$Values(tag);
        for (var j = 0;j < values.length;j++) {
          values[j].initDefaults(simpleFieldsToo);
        }
      } else {
        this.get$Value(tag).initDefaults(simpleFieldsToo);
      }
    }
  }
};
goog.proto2.Message.prototype.has$Value = function(tag) {
  return this.values_[tag] != null;
};
goog.proto2.Message.prototype.getValueForTag_ = function(tag) {
  var value = this.values_[tag];
  if (!goog.isDefAndNotNull(value)) {
    return null;
  }
  if (this.lazyDeserializer_) {
    if (!(tag in this.deserializedFields_)) {
      var deserializedValue = this.lazyDeserializer_.deserializeField(this, this.fields_[tag], value);
      this.deserializedFields_[tag] = deserializedValue;
      return deserializedValue;
    }
    return this.deserializedFields_[tag];
  }
  return value;
};
goog.proto2.Message.prototype.get$Value = function(tag, opt_index) {
  var value = this.getValueForTag_(tag);
  if (this.fields_[tag].isRepeated()) {
    var index = opt_index || 0;
    goog.asserts.assert(index >= 0 && index < value.length, "Given index %s is out of bounds.  Repeated field length: %s", index, value.length);
    return value[index];
  }
  return value;
};
goog.proto2.Message.prototype.get$ValueOrDefault = function(tag, opt_index) {
  if (!this.has$Value(tag)) {
    var field = this.fields_[tag];
    return field.getDefaultValue();
  }
  return this.get$Value(tag, opt_index);
};
goog.proto2.Message.prototype.array$Values = function(tag) {
  var value = this.getValueForTag_(tag);
  return(value) || [];
};
goog.proto2.Message.prototype.count$Values = function(tag) {
  var field = this.fields_[tag];
  if (field.isRepeated()) {
    return this.has$Value(tag) ? this.values_[tag].length : 0;
  } else {
    return this.has$Value(tag) ? 1 : 0;
  }
};
goog.proto2.Message.prototype.set$Value = function(tag, value) {
  if (goog.asserts.ENABLE_ASSERTS) {
    var field = this.fields_[tag];
    this.checkFieldType_(field, value);
  }
  this.values_[tag] = value;
  if (this.deserializedFields_) {
    this.deserializedFields_[tag] = value;
  }
};
goog.proto2.Message.prototype.add$Value = function(tag, value) {
  if (goog.asserts.ENABLE_ASSERTS) {
    var field = this.fields_[tag];
    this.checkFieldType_(field, value);
  }
  if (!this.values_[tag]) {
    this.values_[tag] = [];
  }
  this.values_[tag].push(value);
  if (this.deserializedFields_) {
    delete this.deserializedFields_[tag];
  }
};
goog.proto2.Message.prototype.checkFieldType_ = function(field, value) {
  if (field.getFieldType() == goog.proto2.FieldDescriptor.FieldType.ENUM) {
    goog.asserts.assertNumber(value);
  } else {
    goog.asserts.assert(value.constructor == field.getNativeType());
  }
};
goog.proto2.Message.prototype.clear$Field = function(tag) {
  delete this.values_[tag];
  if (this.deserializedFields_) {
    delete this.deserializedFields_[tag];
  }
};
goog.proto2.Message.createDescriptor = function(messageType, metadataObj) {
  var fields = [];
  var descriptorInfo = metadataObj[0];
  for (var key in metadataObj) {
    if (key != 0) {
      fields.push(new goog.proto2.FieldDescriptor(messageType, key, metadataObj[key]));
    }
  }
  return new goog.proto2.Descriptor(messageType, descriptorInfo, fields);
};
goog.proto2.Message.set$Metadata = function(messageType, metadataObj) {
  messageType.descriptorObj_ = metadataObj;
  messageType.getDescriptor = function() {
    return messageType.descriptor_ || (new messageType).getDescriptor();
  };
};
goog.provide("goog.proto2.Serializer");
goog.require("goog.asserts");
goog.require("goog.proto2.FieldDescriptor");
goog.require("goog.proto2.Message");
goog.proto2.Serializer = function() {
};
goog.define("goog.proto2.Serializer.DECODE_SYMBOLIC_ENUMS", false);
goog.proto2.Serializer.prototype.serialize = goog.abstractMethod;
goog.proto2.Serializer.prototype.getSerializedValue = function(field, value) {
  if (field.isCompositeType()) {
    return this.serialize((value));
  } else {
    if (goog.isNumber(value) && !isFinite(value)) {
      return value.toString();
    } else {
      return value;
    }
  }
};
goog.proto2.Serializer.prototype.deserialize = function(descriptor, data) {
  var message = descriptor.createMessageInstance();
  this.deserializeTo(message, data);
  goog.asserts.assert(message instanceof goog.proto2.Message);
  return message;
};
goog.proto2.Serializer.prototype.deserializeTo = goog.abstractMethod;
goog.proto2.Serializer.prototype.getDeserializedValue = function(field, value) {
  if (field.isCompositeType()) {
    if (value instanceof goog.proto2.Message) {
      return value;
    }
    return this.deserialize(field.getFieldMessageType(), value);
  }
  if (field.getFieldType() == goog.proto2.FieldDescriptor.FieldType.ENUM) {
    if (goog.proto2.Serializer.DECODE_SYMBOLIC_ENUMS && goog.isString(value)) {
      var enumType = field.getNativeType();
      if (enumType.hasOwnProperty(value)) {
        return enumType[value];
      }
    }
    return value;
  }
  if (!field.deserializationConversionPermitted()) {
    return value;
  }
  var nativeType = field.getNativeType();
  if (nativeType === String) {
    if (goog.isNumber(value)) {
      return String(value);
    }
  } else {
    if (nativeType === Number) {
      if (goog.isString(value)) {
        if (value === "Infinity" || value === "-Infinity" || value === "NaN") {
          return Number(value);
        }
        if (/^-?[0-9]+$/.test(value)) {
          return Number(value);
        }
      }
    }
  }
  return value;
};
goog.provide("goog.proto2.LazyDeserializer");
goog.require("goog.asserts");
goog.require("goog.proto2.Message");
goog.require("goog.proto2.Serializer");
goog.proto2.LazyDeserializer = function() {
};
goog.inherits(goog.proto2.LazyDeserializer, goog.proto2.Serializer);
goog.proto2.LazyDeserializer.prototype.deserialize = function(descriptor, data) {
  var message = descriptor.createMessageInstance();
  message.initializeForLazyDeserializer(this, data);
  goog.asserts.assert(message instanceof goog.proto2.Message);
  return message;
};
goog.proto2.LazyDeserializer.prototype.deserializeTo = function(message, data) {
  throw new Error("Unimplemented");
};
goog.proto2.LazyDeserializer.prototype.deserializeField = goog.abstractMethod;
goog.provide("goog.proto2.PbLiteSerializer");
goog.require("goog.asserts");
goog.require("goog.proto2.FieldDescriptor");
goog.require("goog.proto2.LazyDeserializer");
goog.require("goog.proto2.Serializer");
goog.proto2.PbLiteSerializer = function() {
};
goog.inherits(goog.proto2.PbLiteSerializer, goog.proto2.LazyDeserializer);
goog.proto2.PbLiteSerializer.prototype.zeroIndexing_ = false;
goog.proto2.PbLiteSerializer.prototype.setZeroIndexed = function(zeroIndexing) {
  this.zeroIndexing_ = zeroIndexing;
};
goog.proto2.PbLiteSerializer.prototype.serialize = function(message) {
  var descriptor = message.getDescriptor();
  var fields = descriptor.getFields();
  var serialized = [];
  var zeroIndexing = this.zeroIndexing_;
  for (var i = 0;i < fields.length;i++) {
    var field = fields[i];
    if (!message.has(field)) {
      continue;
    }
    var tag = field.getTag();
    var index = zeroIndexing ? tag - 1 : tag;
    if (field.isRepeated()) {
      serialized[index] = [];
      for (var j = 0;j < message.countOf(field);j++) {
        serialized[index][j] = this.getSerializedValue(field, message.get(field, j));
      }
    } else {
      serialized[index] = this.getSerializedValue(field, message.get(field));
    }
  }
  message.forEachUnknown(function(tag, value) {
    var index = zeroIndexing ? tag - 1 : tag;
    serialized[index] = value;
  });
  return serialized;
};
goog.proto2.PbLiteSerializer.prototype.deserializeField = function(message, field, value) {
  if (value == null) {
    return value;
  }
  if (field.isRepeated()) {
    var data = [];
    goog.asserts.assert(goog.isArray(value), "Value must be array: %s", value);
    for (var i = 0;i < value.length;i++) {
      data[i] = this.getDeserializedValue(field, value[i]);
    }
    return data;
  } else {
    return this.getDeserializedValue(field, value);
  }
};
goog.proto2.PbLiteSerializer.prototype.getSerializedValue = function(field, value) {
  if (field.getFieldType() == goog.proto2.FieldDescriptor.FieldType.BOOL) {
    return value ? 1 : 0;
  }
  return goog.proto2.Serializer.prototype.getSerializedValue.apply(this, arguments);
};
goog.proto2.PbLiteSerializer.prototype.getDeserializedValue = function(field, value) {
  if (field.getFieldType() == goog.proto2.FieldDescriptor.FieldType.BOOL) {
    goog.asserts.assert(goog.isNumber(value) || goog.isBoolean(value), "Value is expected to be a number or boolean");
    return!!value;
  }
  return goog.proto2.Serializer.prototype.getDeserializedValue.apply(this, arguments);
};
goog.proto2.PbLiteSerializer.prototype.deserialize = function(descriptor, data) {
  var toConvert = data;
  if (this.zeroIndexing_) {
    toConvert = [];
    for (var key in data) {
      toConvert[parseInt(key, 10) + 1] = data[key];
    }
  }
  return goog.proto2.PbLiteSerializer.base(this, "deserialize", descriptor, toConvert);
};
goog.provide("goog.labs.userAgent.util");
goog.require("goog.string");
goog.labs.userAgent.util.getNativeUserAgentString_ = function() {
  var navigator = goog.labs.userAgent.util.getNavigator_();
  if (navigator) {
    var userAgent = navigator.userAgent;
    if (userAgent) {
      return userAgent;
    }
  }
  return "";
};
goog.labs.userAgent.util.getNavigator_ = function() {
  return goog.global.navigator;
};
goog.labs.userAgent.util.userAgent_ = goog.labs.userAgent.util.getNativeUserAgentString_();
goog.labs.userAgent.util.setUserAgent = function(opt_userAgent) {
  goog.labs.userAgent.util.userAgent_ = opt_userAgent || goog.labs.userAgent.util.getNativeUserAgentString_();
};
goog.labs.userAgent.util.getUserAgent = function() {
  return goog.labs.userAgent.util.userAgent_;
};
goog.labs.userAgent.util.matchUserAgent = function(str) {
  var userAgent = goog.labs.userAgent.util.getUserAgent();
  return goog.string.contains(userAgent, str);
};
goog.labs.userAgent.util.matchUserAgentIgnoreCase = function(str) {
  var userAgent = goog.labs.userAgent.util.getUserAgent();
  return goog.string.caseInsensitiveContains(userAgent, str);
};
goog.labs.userAgent.util.extractVersionTuples = function(userAgent) {
  var versionRegExp = new RegExp("(\\w[\\w ]+)" + "/" + "([^\\s]+)" + "\\s*" + "(?:\\((.*?)\\))?", "g");
  var data = [];
  var match;
  while (match = versionRegExp.exec(userAgent)) {
    data.push([match[1], match[2], match[3] || undefined]);
  }
  return data;
};
goog.provide("goog.labs.userAgent.browser");
goog.require("goog.array");
goog.require("goog.labs.userAgent.util");
goog.require("goog.object");
goog.require("goog.string");
goog.labs.userAgent.browser.matchOpera_ = function() {
  return goog.labs.userAgent.util.matchUserAgent("Opera") || goog.labs.userAgent.util.matchUserAgent("OPR");
};
goog.labs.userAgent.browser.matchIE_ = function() {
  return goog.labs.userAgent.util.matchUserAgent("Trident") || goog.labs.userAgent.util.matchUserAgent("MSIE");
};
goog.labs.userAgent.browser.matchFirefox_ = function() {
  return goog.labs.userAgent.util.matchUserAgent("Firefox");
};
goog.labs.userAgent.browser.matchSafari_ = function() {
  return goog.labs.userAgent.util.matchUserAgent("Safari") && !goog.labs.userAgent.util.matchUserAgent("Chrome") && !goog.labs.userAgent.util.matchUserAgent("CriOS") && !goog.labs.userAgent.util.matchUserAgent("Android");
};
goog.labs.userAgent.browser.matchCoast_ = function() {
  return goog.labs.userAgent.util.matchUserAgent("Coast");
};
goog.labs.userAgent.browser.matchIosWebview_ = function() {
  return(goog.labs.userAgent.util.matchUserAgent("iPad") || goog.labs.userAgent.util.matchUserAgent("iPhone")) && !goog.labs.userAgent.browser.matchSafari_() && !goog.labs.userAgent.browser.matchChrome_() && !goog.labs.userAgent.browser.matchCoast_() && goog.labs.userAgent.util.matchUserAgent("AppleWebKit");
};
goog.labs.userAgent.browser.matchChrome_ = function() {
  return goog.labs.userAgent.util.matchUserAgent("Chrome") || goog.labs.userAgent.util.matchUserAgent("CriOS");
};
goog.labs.userAgent.browser.matchAndroidBrowser_ = function() {
  return!goog.labs.userAgent.browser.isChrome() && goog.labs.userAgent.util.matchUserAgent("Android");
};
goog.labs.userAgent.browser.isOpera = goog.labs.userAgent.browser.matchOpera_;
goog.labs.userAgent.browser.isIE = goog.labs.userAgent.browser.matchIE_;
goog.labs.userAgent.browser.isFirefox = goog.labs.userAgent.browser.matchFirefox_;
goog.labs.userAgent.browser.isSafari = goog.labs.userAgent.browser.matchSafari_;
goog.labs.userAgent.browser.isCoast = goog.labs.userAgent.browser.matchCoast_;
goog.labs.userAgent.browser.isIosWebview = goog.labs.userAgent.browser.matchIosWebview_;
goog.labs.userAgent.browser.isChrome = goog.labs.userAgent.browser.matchChrome_;
goog.labs.userAgent.browser.isAndroidBrowser = goog.labs.userAgent.browser.matchAndroidBrowser_;
goog.labs.userAgent.browser.isSilk = function() {
  return goog.labs.userAgent.util.matchUserAgent("Silk");
};
goog.labs.userAgent.browser.getVersion = function() {
  var userAgentString = goog.labs.userAgent.util.getUserAgent();
  if (goog.labs.userAgent.browser.isIE()) {
    return goog.labs.userAgent.browser.getIEVersion_(userAgentString);
  }
  var versionTuples = goog.labs.userAgent.util.extractVersionTuples(userAgentString);
  var versionMap = {};
  goog.array.forEach(versionTuples, function(tuple) {
    var key = tuple[0];
    var value = tuple[1];
    versionMap[key] = value;
  });
  var versionMapHasKey = goog.partial(goog.object.containsKey, versionMap);
  function lookUpValueWithKeys(keys) {
    var key = goog.array.find(keys, versionMapHasKey);
    return versionMap[key] || "";
  }
  if (goog.labs.userAgent.browser.isOpera()) {
    return lookUpValueWithKeys(["Version", "Opera", "OPR"]);
  }
  if (goog.labs.userAgent.browser.isChrome()) {
    return lookUpValueWithKeys(["Chrome", "CriOS"]);
  }
  var tuple = versionTuples[2];
  return tuple && tuple[1] || "";
};
goog.labs.userAgent.browser.isVersionOrHigher = function(version) {
  return goog.string.compareVersions(goog.labs.userAgent.browser.getVersion(), version) >= 0;
};
goog.labs.userAgent.browser.getIEVersion_ = function(userAgent) {
  var rv = /rv: *([\d\.]*)/.exec(userAgent);
  if (rv && rv[1]) {
    return rv[1];
  }
  var version = "";
  var msie = /MSIE +([\d\.]+)/.exec(userAgent);
  if (msie && msie[1]) {
    var tridentVersion = /Trident\/(\d.\d)/.exec(userAgent);
    if (msie[1] == "7.0") {
      if (tridentVersion && tridentVersion[1]) {
        switch(tridentVersion[1]) {
          case "4.0":
            version = "8.0";
            break;
          case "5.0":
            version = "9.0";
            break;
          case "6.0":
            version = "10.0";
            break;
          case "7.0":
            version = "11.0";
            break;
        }
      } else {
        version = "7.0";
      }
    } else {
      version = msie[1];
    }
  }
  return version;
};
goog.provide("goog.labs.userAgent.engine");
goog.require("goog.array");
goog.require("goog.labs.userAgent.util");
goog.require("goog.string");
goog.labs.userAgent.engine.isPresto = function() {
  return goog.labs.userAgent.util.matchUserAgent("Presto");
};
goog.labs.userAgent.engine.isTrident = function() {
  return goog.labs.userAgent.util.matchUserAgent("Trident") || goog.labs.userAgent.util.matchUserAgent("MSIE");
};
goog.labs.userAgent.engine.isWebKit = function() {
  return goog.labs.userAgent.util.matchUserAgentIgnoreCase("WebKit");
};
goog.labs.userAgent.engine.isGecko = function() {
  return goog.labs.userAgent.util.matchUserAgent("Gecko") && !goog.labs.userAgent.engine.isWebKit() && !goog.labs.userAgent.engine.isTrident();
};
goog.labs.userAgent.engine.getVersion = function() {
  var userAgentString = goog.labs.userAgent.util.getUserAgent();
  if (userAgentString) {
    var tuples = goog.labs.userAgent.util.extractVersionTuples(userAgentString);
    var engineTuple = tuples[1];
    if (engineTuple) {
      if (engineTuple[0] == "Gecko") {
        return goog.labs.userAgent.engine.getVersionForKey_(tuples, "Firefox");
      }
      return engineTuple[1];
    }
    var browserTuple = tuples[0];
    var info;
    if (browserTuple && (info = browserTuple[2])) {
      var match = /Trident\/([^\s;]+)/.exec(info);
      if (match) {
        return match[1];
      }
    }
  }
  return "";
};
goog.labs.userAgent.engine.isVersionOrHigher = function(version) {
  return goog.string.compareVersions(goog.labs.userAgent.engine.getVersion(), version) >= 0;
};
goog.labs.userAgent.engine.getVersionForKey_ = function(tuples, key) {
  var pair = goog.array.find(tuples, function(pair) {
    return key == pair[0];
  });
  return pair && pair[1] || "";
};
goog.provide("goog.labs.userAgent.platform");
goog.require("goog.labs.userAgent.util");
goog.require("goog.string");
goog.labs.userAgent.platform.isAndroid = function() {
  return goog.labs.userAgent.util.matchUserAgent("Android");
};
goog.labs.userAgent.platform.isIpod = function() {
  return goog.labs.userAgent.util.matchUserAgent("iPod");
};
goog.labs.userAgent.platform.isIphone = function() {
  return goog.labs.userAgent.util.matchUserAgent("iPhone") && !goog.labs.userAgent.util.matchUserAgent("iPod") && !goog.labs.userAgent.util.matchUserAgent("iPad");
};
goog.labs.userAgent.platform.isIpad = function() {
  return goog.labs.userAgent.util.matchUserAgent("iPad");
};
goog.labs.userAgent.platform.isIos = function() {
  return goog.labs.userAgent.platform.isIphone() || goog.labs.userAgent.platform.isIpad() || goog.labs.userAgent.platform.isIpod();
};
goog.labs.userAgent.platform.isMacintosh = function() {
  return goog.labs.userAgent.util.matchUserAgent("Macintosh");
};
goog.labs.userAgent.platform.isLinux = function() {
  return goog.labs.userAgent.util.matchUserAgent("Linux");
};
goog.labs.userAgent.platform.isWindows = function() {
  return goog.labs.userAgent.util.matchUserAgent("Windows");
};
goog.labs.userAgent.platform.isChromeOS = function() {
  return goog.labs.userAgent.util.matchUserAgent("CrOS");
};
goog.labs.userAgent.platform.getVersion = function() {
  var userAgentString = goog.labs.userAgent.util.getUserAgent();
  var version = "", re;
  if (goog.labs.userAgent.platform.isWindows()) {
    re = /Windows (?:NT|Phone) ([0-9.]+)/;
    var match = re.exec(userAgentString);
    if (match) {
      version = match[1];
    } else {
      version = "0.0";
    }
  } else {
    if (goog.labs.userAgent.platform.isIos()) {
      re = /(?:iPhone|iPod|iPad|CPU)\s+OS\s+(\S+)/;
      var match = re.exec(userAgentString);
      version = match && match[1].replace(/_/g, ".");
    } else {
      if (goog.labs.userAgent.platform.isMacintosh()) {
        re = /Mac OS X ([0-9_.]+)/;
        var match = re.exec(userAgentString);
        version = match ? match[1].replace(/_/g, ".") : "10";
      } else {
        if (goog.labs.userAgent.platform.isAndroid()) {
          re = /Android\s+([^\);]+)(\)|;)/;
          var match = re.exec(userAgentString);
          version = match && match[1];
        } else {
          if (goog.labs.userAgent.platform.isChromeOS()) {
            re = /(?:CrOS\s+(?:i686|x86_64)\s+([0-9.]+))/;
            var match = re.exec(userAgentString);
            version = match && match[1];
          }
        }
      }
    }
  }
  return version || "";
};
goog.labs.userAgent.platform.isVersionOrHigher = function(version) {
  return goog.string.compareVersions(goog.labs.userAgent.platform.getVersion(), version) >= 0;
};
goog.provide("goog.userAgent");
goog.require("goog.labs.userAgent.browser");
goog.require("goog.labs.userAgent.engine");
goog.require("goog.labs.userAgent.platform");
goog.require("goog.labs.userAgent.util");
goog.require("goog.string");
goog.define("goog.userAgent.ASSUME_IE", false);
goog.define("goog.userAgent.ASSUME_GECKO", false);
goog.define("goog.userAgent.ASSUME_WEBKIT", false);
goog.define("goog.userAgent.ASSUME_MOBILE_WEBKIT", false);
goog.define("goog.userAgent.ASSUME_OPERA", false);
goog.define("goog.userAgent.ASSUME_ANY_VERSION", false);
goog.userAgent.BROWSER_KNOWN_ = goog.userAgent.ASSUME_IE || goog.userAgent.ASSUME_GECKO || goog.userAgent.ASSUME_MOBILE_WEBKIT || goog.userAgent.ASSUME_WEBKIT || goog.userAgent.ASSUME_OPERA;
goog.userAgent.getUserAgentString = function() {
  return goog.labs.userAgent.util.getUserAgent();
};
goog.userAgent.getNavigator = function() {
  return goog.global["navigator"] || null;
};
goog.userAgent.OPERA = goog.userAgent.BROWSER_KNOWN_ ? goog.userAgent.ASSUME_OPERA : goog.labs.userAgent.browser.isOpera();
goog.userAgent.IE = goog.userAgent.BROWSER_KNOWN_ ? goog.userAgent.ASSUME_IE : goog.labs.userAgent.browser.isIE();
goog.userAgent.GECKO = goog.userAgent.BROWSER_KNOWN_ ? goog.userAgent.ASSUME_GECKO : goog.labs.userAgent.engine.isGecko();
goog.userAgent.WEBKIT = goog.userAgent.BROWSER_KNOWN_ ? goog.userAgent.ASSUME_WEBKIT || goog.userAgent.ASSUME_MOBILE_WEBKIT : goog.labs.userAgent.engine.isWebKit();
goog.userAgent.isMobile_ = function() {
  return goog.userAgent.WEBKIT && goog.labs.userAgent.util.matchUserAgent("Mobile");
};
goog.userAgent.MOBILE = goog.userAgent.ASSUME_MOBILE_WEBKIT || goog.userAgent.isMobile_();
goog.userAgent.SAFARI = goog.userAgent.WEBKIT;
goog.userAgent.determinePlatform_ = function() {
  var navigator = goog.userAgent.getNavigator();
  return navigator && navigator.platform || "";
};
goog.userAgent.PLATFORM = goog.userAgent.determinePlatform_();
goog.define("goog.userAgent.ASSUME_MAC", false);
goog.define("goog.userAgent.ASSUME_WINDOWS", false);
goog.define("goog.userAgent.ASSUME_LINUX", false);
goog.define("goog.userAgent.ASSUME_X11", false);
goog.define("goog.userAgent.ASSUME_ANDROID", false);
goog.define("goog.userAgent.ASSUME_IPHONE", false);
goog.define("goog.userAgent.ASSUME_IPAD", false);
goog.userAgent.PLATFORM_KNOWN_ = goog.userAgent.ASSUME_MAC || goog.userAgent.ASSUME_WINDOWS || goog.userAgent.ASSUME_LINUX || goog.userAgent.ASSUME_X11 || goog.userAgent.ASSUME_ANDROID || goog.userAgent.ASSUME_IPHONE || goog.userAgent.ASSUME_IPAD;
goog.userAgent.MAC = goog.userAgent.PLATFORM_KNOWN_ ? goog.userAgent.ASSUME_MAC : goog.labs.userAgent.platform.isMacintosh();
goog.userAgent.WINDOWS = goog.userAgent.PLATFORM_KNOWN_ ? goog.userAgent.ASSUME_WINDOWS : goog.labs.userAgent.platform.isWindows();
goog.userAgent.LINUX = goog.userAgent.PLATFORM_KNOWN_ ? goog.userAgent.ASSUME_LINUX : goog.labs.userAgent.platform.isLinux();
goog.userAgent.isX11_ = function() {
  var navigator = goog.userAgent.getNavigator();
  return!!navigator && goog.string.contains(navigator["appVersion"] || "", "X11");
};
goog.userAgent.X11 = goog.userAgent.PLATFORM_KNOWN_ ? goog.userAgent.ASSUME_X11 : goog.userAgent.isX11_();
goog.userAgent.ANDROID = goog.userAgent.PLATFORM_KNOWN_ ? goog.userAgent.ASSUME_ANDROID : goog.labs.userAgent.platform.isAndroid();
goog.userAgent.IPHONE = goog.userAgent.PLATFORM_KNOWN_ ? goog.userAgent.ASSUME_IPHONE : goog.labs.userAgent.platform.isIphone();
goog.userAgent.IPAD = goog.userAgent.PLATFORM_KNOWN_ ? goog.userAgent.ASSUME_IPAD : goog.labs.userAgent.platform.isIpad();
goog.userAgent.determineVersion_ = function() {
  var version = "", re;
  if (goog.userAgent.OPERA && goog.global["opera"]) {
    var operaVersion = goog.global["opera"].version;
    return goog.isFunction(operaVersion) ? operaVersion() : operaVersion;
  }
  if (goog.userAgent.GECKO) {
    re = /rv\:([^\);]+)(\)|;)/;
  } else {
    if (goog.userAgent.IE) {
      re = /\b(?:MSIE|rv)[: ]([^\);]+)(\)|;)/;
    } else {
      if (goog.userAgent.WEBKIT) {
        re = /WebKit\/(\S+)/;
      }
    }
  }
  if (re) {
    var arr = re.exec(goog.userAgent.getUserAgentString());
    version = arr ? arr[1] : "";
  }
  if (goog.userAgent.IE) {
    var docMode = goog.userAgent.getDocumentMode_();
    if (docMode > parseFloat(version)) {
      return String(docMode);
    }
  }
  return version;
};
goog.userAgent.getDocumentMode_ = function() {
  var doc = goog.global["document"];
  return doc ? doc["documentMode"] : undefined;
};
goog.userAgent.VERSION = goog.userAgent.determineVersion_();
goog.userAgent.compare = function(v1, v2) {
  return goog.string.compareVersions(v1, v2);
};
goog.userAgent.isVersionOrHigherCache_ = {};
goog.userAgent.isVersionOrHigher = function(version) {
  return goog.userAgent.ASSUME_ANY_VERSION || goog.userAgent.isVersionOrHigherCache_[version] || (goog.userAgent.isVersionOrHigherCache_[version] = goog.string.compareVersions(goog.userAgent.VERSION, version) >= 0);
};
goog.userAgent.isVersion = goog.userAgent.isVersionOrHigher;
goog.userAgent.isDocumentModeOrHigher = function(documentMode) {
  return goog.userAgent.IE && goog.userAgent.DOCUMENT_MODE >= documentMode;
};
goog.userAgent.isDocumentMode = goog.userAgent.isDocumentModeOrHigher;
goog.userAgent.DOCUMENT_MODE = function() {
  var doc = goog.global["document"];
  if (!doc || !goog.userAgent.IE) {
    return undefined;
  }
  var mode = goog.userAgent.getDocumentMode_();
  return mode || (doc["compatMode"] == "CSS1Compat" ? parseInt(goog.userAgent.VERSION, 10) : 5);
}();
goog.provide("goog.dom.BrowserFeature");
goog.require("goog.userAgent");
goog.dom.BrowserFeature = {CAN_ADD_NAME_OR_TYPE_ATTRIBUTES:!goog.userAgent.IE || goog.userAgent.isDocumentModeOrHigher(9), CAN_USE_CHILDREN_ATTRIBUTE:!goog.userAgent.GECKO && !goog.userAgent.IE || goog.userAgent.IE && goog.userAgent.isDocumentModeOrHigher(9) || goog.userAgent.GECKO && goog.userAgent.isVersionOrHigher("1.9.1"), CAN_USE_INNER_TEXT:goog.userAgent.IE && !goog.userAgent.isVersionOrHigher("9"), CAN_USE_PARENT_ELEMENT_PROPERTY:goog.userAgent.IE || goog.userAgent.OPERA || goog.userAgent.WEBKIT, 
INNER_HTML_NEEDS_SCOPED_ELEMENT:goog.userAgent.IE, LEGACY_IE_RANGES:goog.userAgent.IE && !goog.userAgent.isDocumentModeOrHigher(9)};
goog.provide("goog.dom.TagName");
goog.dom.TagName = {A:"A", ABBR:"ABBR", ACRONYM:"ACRONYM", ADDRESS:"ADDRESS", APPLET:"APPLET", AREA:"AREA", ARTICLE:"ARTICLE", ASIDE:"ASIDE", AUDIO:"AUDIO", B:"B", BASE:"BASE", BASEFONT:"BASEFONT", BDI:"BDI", BDO:"BDO", BIG:"BIG", BLOCKQUOTE:"BLOCKQUOTE", BODY:"BODY", BR:"BR", BUTTON:"BUTTON", CANVAS:"CANVAS", CAPTION:"CAPTION", CENTER:"CENTER", CITE:"CITE", CODE:"CODE", COL:"COL", COLGROUP:"COLGROUP", COMMAND:"COMMAND", DATA:"DATA", DATALIST:"DATALIST", DD:"DD", DEL:"DEL", DETAILS:"DETAILS", DFN:"DFN", 
DIALOG:"DIALOG", DIR:"DIR", DIV:"DIV", DL:"DL", DT:"DT", EM:"EM", EMBED:"EMBED", FIELDSET:"FIELDSET", FIGCAPTION:"FIGCAPTION", FIGURE:"FIGURE", FONT:"FONT", FOOTER:"FOOTER", FORM:"FORM", FRAME:"FRAME", FRAMESET:"FRAMESET", H1:"H1", H2:"H2", H3:"H3", H4:"H4", H5:"H5", H6:"H6", HEAD:"HEAD", HEADER:"HEADER", HGROUP:"HGROUP", HR:"HR", HTML:"HTML", I:"I", IFRAME:"IFRAME", IMG:"IMG", INPUT:"INPUT", INS:"INS", ISINDEX:"ISINDEX", KBD:"KBD", KEYGEN:"KEYGEN", LABEL:"LABEL", LEGEND:"LEGEND", LI:"LI", LINK:"LINK", 
MAP:"MAP", MARK:"MARK", MATH:"MATH", MENU:"MENU", META:"META", METER:"METER", NAV:"NAV", NOFRAMES:"NOFRAMES", NOSCRIPT:"NOSCRIPT", OBJECT:"OBJECT", OL:"OL", OPTGROUP:"OPTGROUP", OPTION:"OPTION", OUTPUT:"OUTPUT", P:"P", PARAM:"PARAM", PRE:"PRE", PROGRESS:"PROGRESS", Q:"Q", RP:"RP", RT:"RT", RUBY:"RUBY", S:"S", SAMP:"SAMP", SCRIPT:"SCRIPT", SECTION:"SECTION", SELECT:"SELECT", SMALL:"SMALL", SOURCE:"SOURCE", SPAN:"SPAN", STRIKE:"STRIKE", STRONG:"STRONG", STYLE:"STYLE", SUB:"SUB", SUMMARY:"SUMMARY", 
SUP:"SUP", SVG:"SVG", TABLE:"TABLE", TBODY:"TBODY", TD:"TD", TEXTAREA:"TEXTAREA", TFOOT:"TFOOT", TH:"TH", THEAD:"THEAD", TIME:"TIME", TITLE:"TITLE", TR:"TR", TRACK:"TRACK", TT:"TT", U:"U", UL:"UL", VAR:"VAR", VIDEO:"VIDEO", WBR:"WBR"};
goog.provide("goog.math");
goog.require("goog.array");
goog.require("goog.asserts");
goog.math.randomInt = function(a) {
  return Math.floor(Math.random() * a);
};
goog.math.uniformRandom = function(a, b) {
  return a + Math.random() * (b - a);
};
goog.math.clamp = function(value, min, max) {
  return Math.min(Math.max(value, min), max);
};
goog.math.modulo = function(a, b) {
  var r = a % b;
  return r * b < 0 ? r + b : r;
};
goog.math.lerp = function(a, b, x) {
  return a + x * (b - a);
};
goog.math.nearlyEquals = function(a, b, opt_tolerance) {
  return Math.abs(a - b) <= (opt_tolerance || 1E-6);
};
goog.math.standardAngle = function(angle) {
  return goog.math.modulo(angle, 360);
};
goog.math.standardAngleInRadians = function(angle) {
  return goog.math.modulo(angle, 2 * Math.PI);
};
goog.math.toRadians = function(angleDegrees) {
  return angleDegrees * Math.PI / 180;
};
goog.math.toDegrees = function(angleRadians) {
  return angleRadians * 180 / Math.PI;
};
goog.math.angleDx = function(degrees, radius) {
  return radius * Math.cos(goog.math.toRadians(degrees));
};
goog.math.angleDy = function(degrees, radius) {
  return radius * Math.sin(goog.math.toRadians(degrees));
};
goog.math.angle = function(x1, y1, x2, y2) {
  return goog.math.standardAngle(goog.math.toDegrees(Math.atan2(y2 - y1, x2 - x1)));
};
goog.math.angleDifference = function(startAngle, endAngle) {
  var d = goog.math.standardAngle(endAngle) - goog.math.standardAngle(startAngle);
  if (d > 180) {
    d = d - 360;
  } else {
    if (d <= -180) {
      d = 360 + d;
    }
  }
  return d;
};
goog.math.sign = function(x) {
  return x == 0 ? 0 : x < 0 ? -1 : 1;
};
goog.math.longestCommonSubsequence = function(array1, array2, opt_compareFn, opt_collectorFn) {
  var compare = opt_compareFn || function(a, b) {
    return a == b;
  };
  var collect = opt_collectorFn || function(i1, i2) {
    return array1[i1];
  };
  var length1 = array1.length;
  var length2 = array2.length;
  var arr = [];
  for (var i = 0;i < length1 + 1;i++) {
    arr[i] = [];
    arr[i][0] = 0;
  }
  for (var j = 0;j < length2 + 1;j++) {
    arr[0][j] = 0;
  }
  for (i = 1;i <= length1;i++) {
    for (j = 1;j <= length2;j++) {
      if (compare(array1[i - 1], array2[j - 1])) {
        arr[i][j] = arr[i - 1][j - 1] + 1;
      } else {
        arr[i][j] = Math.max(arr[i - 1][j], arr[i][j - 1]);
      }
    }
  }
  var result = [];
  var i = length1, j = length2;
  while (i > 0 && j > 0) {
    if (compare(array1[i - 1], array2[j - 1])) {
      result.unshift(collect(i - 1, j - 1));
      i--;
      j--;
    } else {
      if (arr[i - 1][j] > arr[i][j - 1]) {
        i--;
      } else {
        j--;
      }
    }
  }
  return result;
};
goog.math.sum = function(var_args) {
  return(goog.array.reduce(arguments, function(sum, value) {
    return sum + value;
  }, 0));
};
goog.math.average = function(var_args) {
  return goog.math.sum.apply(null, arguments) / arguments.length;
};
goog.math.sampleVariance = function(var_args) {
  var sampleSize = arguments.length;
  if (sampleSize < 2) {
    return 0;
  }
  var mean = goog.math.average.apply(null, arguments);
  var variance = goog.math.sum.apply(null, goog.array.map(arguments, function(val) {
    return Math.pow(val - mean, 2);
  })) / (sampleSize - 1);
  return variance;
};
goog.math.standardDeviation = function(var_args) {
  return Math.sqrt(goog.math.sampleVariance.apply(null, arguments));
};
goog.math.isInt = function(num) {
  return isFinite(num) && num % 1 == 0;
};
goog.math.isFiniteNumber = function(num) {
  return isFinite(num) && !isNaN(num);
};
goog.math.log10Floor = function(num) {
  if (num > 0) {
    var x = Math.round(Math.log(num) * Math.LOG10E);
    return x - (parseFloat("1e" + x) > num);
  }
  return num == 0 ? -Infinity : NaN;
};
goog.math.safeFloor = function(num, opt_epsilon) {
  goog.asserts.assert(!goog.isDef(opt_epsilon) || opt_epsilon > 0);
  return Math.floor(num + (opt_epsilon || 2E-15));
};
goog.math.safeCeil = function(num, opt_epsilon) {
  goog.asserts.assert(!goog.isDef(opt_epsilon) || opt_epsilon > 0);
  return Math.ceil(num - (opt_epsilon || 2E-15));
};
goog.provide("goog.math.Coordinate");
goog.require("goog.math");
goog.math.Coordinate = function(opt_x, opt_y) {
  this.x = goog.isDef(opt_x) ? opt_x : 0;
  this.y = goog.isDef(opt_y) ? opt_y : 0;
};
goog.math.Coordinate.prototype.clone = function() {
  return new goog.math.Coordinate(this.x, this.y);
};
if (goog.DEBUG) {
  goog.math.Coordinate.prototype.toString = function() {
    return "(" + this.x + ", " + this.y + ")";
  };
}
goog.math.Coordinate.equals = function(a, b) {
  if (a == b) {
    return true;
  }
  if (!a || !b) {
    return false;
  }
  return a.x == b.x && a.y == b.y;
};
goog.math.Coordinate.distance = function(a, b) {
  var dx = a.x - b.x;
  var dy = a.y - b.y;
  return Math.sqrt(dx * dx + dy * dy);
};
goog.math.Coordinate.magnitude = function(a) {
  return Math.sqrt(a.x * a.x + a.y * a.y);
};
goog.math.Coordinate.azimuth = function(a) {
  return goog.math.angle(0, 0, a.x, a.y);
};
goog.math.Coordinate.squaredDistance = function(a, b) {
  var dx = a.x - b.x;
  var dy = a.y - b.y;
  return dx * dx + dy * dy;
};
goog.math.Coordinate.difference = function(a, b) {
  return new goog.math.Coordinate(a.x - b.x, a.y - b.y);
};
goog.math.Coordinate.sum = function(a, b) {
  return new goog.math.Coordinate(a.x + b.x, a.y + b.y);
};
goog.math.Coordinate.prototype.ceil = function() {
  this.x = Math.ceil(this.x);
  this.y = Math.ceil(this.y);
  return this;
};
goog.math.Coordinate.prototype.floor = function() {
  this.x = Math.floor(this.x);
  this.y = Math.floor(this.y);
  return this;
};
goog.math.Coordinate.prototype.round = function() {
  this.x = Math.round(this.x);
  this.y = Math.round(this.y);
  return this;
};
goog.math.Coordinate.prototype.translate = function(tx, opt_ty) {
  if (tx instanceof goog.math.Coordinate) {
    this.x += tx.x;
    this.y += tx.y;
  } else {
    this.x += tx;
    if (goog.isNumber(opt_ty)) {
      this.y += opt_ty;
    }
  }
  return this;
};
goog.math.Coordinate.prototype.scale = function(sx, opt_sy) {
  var sy = goog.isNumber(opt_sy) ? opt_sy : sx;
  this.x *= sx;
  this.y *= sy;
  return this;
};
goog.math.Coordinate.prototype.rotateRadians = function(radians, opt_center) {
  var center = opt_center || new goog.math.Coordinate(0, 0);
  var x = this.x;
  var y = this.y;
  var cos = Math.cos(radians);
  var sin = Math.sin(radians);
  this.x = (x - center.x) * cos - (y - center.y) * sin + center.x;
  this.y = (x - center.x) * sin + (y - center.y) * cos + center.y;
};
goog.math.Coordinate.prototype.rotateDegrees = function(degrees, opt_center) {
  this.rotateRadians(goog.math.toRadians(degrees), opt_center);
};
goog.provide("goog.math.Size");
goog.math.Size = function(width, height) {
  this.width = width;
  this.height = height;
};
goog.math.Size.equals = function(a, b) {
  if (a == b) {
    return true;
  }
  if (!a || !b) {
    return false;
  }
  return a.width == b.width && a.height == b.height;
};
goog.math.Size.prototype.clone = function() {
  return new goog.math.Size(this.width, this.height);
};
if (goog.DEBUG) {
  goog.math.Size.prototype.toString = function() {
    return "(" + this.width + " x " + this.height + ")";
  };
}
goog.math.Size.prototype.getLongest = function() {
  return Math.max(this.width, this.height);
};
goog.math.Size.prototype.getShortest = function() {
  return Math.min(this.width, this.height);
};
goog.math.Size.prototype.area = function() {
  return this.width * this.height;
};
goog.math.Size.prototype.perimeter = function() {
  return(this.width + this.height) * 2;
};
goog.math.Size.prototype.aspectRatio = function() {
  return this.width / this.height;
};
goog.math.Size.prototype.isEmpty = function() {
  return!this.area();
};
goog.math.Size.prototype.ceil = function() {
  this.width = Math.ceil(this.width);
  this.height = Math.ceil(this.height);
  return this;
};
goog.math.Size.prototype.fitsInside = function(target) {
  return this.width <= target.width && this.height <= target.height;
};
goog.math.Size.prototype.floor = function() {
  this.width = Math.floor(this.width);
  this.height = Math.floor(this.height);
  return this;
};
goog.math.Size.prototype.round = function() {
  this.width = Math.round(this.width);
  this.height = Math.round(this.height);
  return this;
};
goog.math.Size.prototype.scale = function(sx, opt_sy) {
  var sy = goog.isNumber(opt_sy) ? opt_sy : sx;
  this.width *= sx;
  this.height *= sy;
  return this;
};
goog.math.Size.prototype.scaleToFit = function(target) {
  var s = this.aspectRatio() > target.aspectRatio() ? target.width / this.width : target.height / this.height;
  return this.scale(s);
};
goog.provide("goog.dom");
goog.provide("goog.dom.Appendable");
goog.provide("goog.dom.DomHelper");
goog.require("goog.array");
goog.require("goog.asserts");
goog.require("goog.dom.BrowserFeature");
goog.require("goog.dom.NodeType");
goog.require("goog.dom.TagName");
goog.require("goog.math.Coordinate");
goog.require("goog.math.Size");
goog.require("goog.object");
goog.require("goog.string");
goog.require("goog.userAgent");
goog.define("goog.dom.ASSUME_QUIRKS_MODE", false);
goog.define("goog.dom.ASSUME_STANDARDS_MODE", false);
goog.dom.COMPAT_MODE_KNOWN_ = goog.dom.ASSUME_QUIRKS_MODE || goog.dom.ASSUME_STANDARDS_MODE;
goog.dom.getDomHelper = function(opt_element) {
  return opt_element ? new goog.dom.DomHelper(goog.dom.getOwnerDocument(opt_element)) : goog.dom.defaultDomHelper_ || (goog.dom.defaultDomHelper_ = new goog.dom.DomHelper);
};
goog.dom.defaultDomHelper_;
goog.dom.getDocument = function() {
  return document;
};
goog.dom.getElement = function(element) {
  return goog.dom.getElementHelper_(document, element);
};
goog.dom.getElementHelper_ = function(doc, element) {
  return goog.isString(element) ? doc.getElementById(element) : element;
};
goog.dom.getRequiredElement = function(id) {
  return goog.dom.getRequiredElementHelper_(document, id);
};
goog.dom.getRequiredElementHelper_ = function(doc, id) {
  goog.asserts.assertString(id);
  var element = goog.dom.getElementHelper_(doc, id);
  element = goog.asserts.assertElement(element, "No element found with id: " + id);
  return element;
};
goog.dom.$ = goog.dom.getElement;
goog.dom.getElementsByTagNameAndClass = function(opt_tag, opt_class, opt_el) {
  return goog.dom.getElementsByTagNameAndClass_(document, opt_tag, opt_class, opt_el);
};
goog.dom.getElementsByClass = function(className, opt_el) {
  var parent = opt_el || document;
  if (goog.dom.canUseQuerySelector_(parent)) {
    return parent.querySelectorAll("." + className);
  }
  return goog.dom.getElementsByTagNameAndClass_(document, "*", className, opt_el);
};
goog.dom.getElementByClass = function(className, opt_el) {
  var parent = opt_el || document;
  var retVal = null;
  if (goog.dom.canUseQuerySelector_(parent)) {
    retVal = parent.querySelector("." + className);
  } else {
    retVal = goog.dom.getElementsByTagNameAndClass_(document, "*", className, opt_el)[0];
  }
  return retVal || null;
};
goog.dom.getRequiredElementByClass = function(className, opt_root) {
  var retValue = goog.dom.getElementByClass(className, opt_root);
  return goog.asserts.assert(retValue, "No element found with className: " + className);
};
goog.dom.canUseQuerySelector_ = function(parent) {
  return!!(parent.querySelectorAll && parent.querySelector);
};
goog.dom.getElementsByTagNameAndClass_ = function(doc, opt_tag, opt_class, opt_el) {
  var parent = opt_el || doc;
  var tagName = opt_tag && opt_tag != "*" ? opt_tag.toUpperCase() : "";
  if (goog.dom.canUseQuerySelector_(parent) && (tagName || opt_class)) {
    var query = tagName + (opt_class ? "." + opt_class : "");
    return parent.querySelectorAll(query);
  }
  if (opt_class && parent.getElementsByClassName) {
    var els = parent.getElementsByClassName(opt_class);
    if (tagName) {
      var arrayLike = {};
      var len = 0;
      for (var i = 0, el;el = els[i];i++) {
        if (tagName == el.nodeName) {
          arrayLike[len++] = el;
        }
      }
      arrayLike.length = len;
      return arrayLike;
    } else {
      return els;
    }
  }
  var els = parent.getElementsByTagName(tagName || "*");
  if (opt_class) {
    var arrayLike = {};
    var len = 0;
    for (var i = 0, el;el = els[i];i++) {
      var className = el.className;
      if (typeof className.split == "function" && goog.array.contains(className.split(/\s+/), opt_class)) {
        arrayLike[len++] = el;
      }
    }
    arrayLike.length = len;
    return arrayLike;
  } else {
    return els;
  }
};
goog.dom.$$ = goog.dom.getElementsByTagNameAndClass;
goog.dom.setProperties = function(element, properties) {
  goog.object.forEach(properties, function(val, key) {
    if (key == "style") {
      element.style.cssText = val;
    } else {
      if (key == "class") {
        element.className = val;
      } else {
        if (key == "for") {
          element.htmlFor = val;
        } else {
          if (key in goog.dom.DIRECT_ATTRIBUTE_MAP_) {
            element.setAttribute(goog.dom.DIRECT_ATTRIBUTE_MAP_[key], val);
          } else {
            if (goog.string.startsWith(key, "aria-") || goog.string.startsWith(key, "data-")) {
              element.setAttribute(key, val);
            } else {
              element[key] = val;
            }
          }
        }
      }
    }
  });
};
goog.dom.DIRECT_ATTRIBUTE_MAP_ = {"cellpadding":"cellPadding", "cellspacing":"cellSpacing", "colspan":"colSpan", "frameborder":"frameBorder", "height":"height", "maxlength":"maxLength", "role":"role", "rowspan":"rowSpan", "type":"type", "usemap":"useMap", "valign":"vAlign", "width":"width"};
goog.dom.getViewportSize = function(opt_window) {
  return goog.dom.getViewportSize_(opt_window || window);
};
goog.dom.getViewportSize_ = function(win) {
  var doc = win.document;
  var el = goog.dom.isCss1CompatMode_(doc) ? doc.documentElement : doc.body;
  return new goog.math.Size(el.clientWidth, el.clientHeight);
};
goog.dom.getDocumentHeight = function() {
  return goog.dom.getDocumentHeight_(window);
};
goog.dom.getDocumentHeight_ = function(win) {
  var doc = win.document;
  var height = 0;
  if (doc) {
    var body = doc.body;
    var docEl = doc.documentElement;
    if (!(docEl && body)) {
      return 0;
    }
    var vh = goog.dom.getViewportSize_(win).height;
    if (goog.dom.isCss1CompatMode_(doc) && docEl.scrollHeight) {
      height = docEl.scrollHeight != vh ? docEl.scrollHeight : docEl.offsetHeight;
    } else {
      var sh = docEl.scrollHeight;
      var oh = docEl.offsetHeight;
      if (docEl.clientHeight != oh) {
        sh = body.scrollHeight;
        oh = body.offsetHeight;
      }
      if (sh > vh) {
        height = sh > oh ? sh : oh;
      } else {
        height = sh < oh ? sh : oh;
      }
    }
  }
  return height;
};
goog.dom.getPageScroll = function(opt_window) {
  var win = opt_window || goog.global || window;
  return goog.dom.getDomHelper(win.document).getDocumentScroll();
};
goog.dom.getDocumentScroll = function() {
  return goog.dom.getDocumentScroll_(document);
};
goog.dom.getDocumentScroll_ = function(doc) {
  var el = goog.dom.getDocumentScrollElement_(doc);
  var win = goog.dom.getWindow_(doc);
  if (goog.userAgent.IE && goog.userAgent.isVersionOrHigher("10") && win.pageYOffset != el.scrollTop) {
    return new goog.math.Coordinate(el.scrollLeft, el.scrollTop);
  }
  return new goog.math.Coordinate(win.pageXOffset || el.scrollLeft, win.pageYOffset || el.scrollTop);
};
goog.dom.getDocumentScrollElement = function() {
  return goog.dom.getDocumentScrollElement_(document);
};
goog.dom.getDocumentScrollElement_ = function(doc) {
  if (!goog.userAgent.WEBKIT && goog.dom.isCss1CompatMode_(doc)) {
    return doc.documentElement;
  }
  return doc.body || doc.documentElement;
};
goog.dom.getWindow = function(opt_doc) {
  return opt_doc ? goog.dom.getWindow_(opt_doc) : window;
};
goog.dom.getWindow_ = function(doc) {
  return doc.parentWindow || doc.defaultView;
};
goog.dom.createDom = function(tagName, opt_attributes, var_args) {
  return goog.dom.createDom_(document, arguments);
};
goog.dom.createDom_ = function(doc, args) {
  var tagName = args[0];
  var attributes = args[1];
  if (!goog.dom.BrowserFeature.CAN_ADD_NAME_OR_TYPE_ATTRIBUTES && attributes && (attributes.name || attributes.type)) {
    var tagNameArr = ["<", tagName];
    if (attributes.name) {
      tagNameArr.push(' name="', goog.string.htmlEscape(attributes.name), '"');
    }
    if (attributes.type) {
      tagNameArr.push(' type="', goog.string.htmlEscape(attributes.type), '"');
      var clone = {};
      goog.object.extend(clone, attributes);
      delete clone["type"];
      attributes = clone;
    }
    tagNameArr.push(">");
    tagName = tagNameArr.join("");
  }
  var element = doc.createElement(tagName);
  if (attributes) {
    if (goog.isString(attributes)) {
      element.className = attributes;
    } else {
      if (goog.isArray(attributes)) {
        element.className = attributes.join(" ");
      } else {
        goog.dom.setProperties(element, attributes);
      }
    }
  }
  if (args.length > 2) {
    goog.dom.append_(doc, element, args, 2);
  }
  return element;
};
goog.dom.append_ = function(doc, parent, args, startIndex) {
  function childHandler(child) {
    if (child) {
      parent.appendChild(goog.isString(child) ? doc.createTextNode(child) : child);
    }
  }
  for (var i = startIndex;i < args.length;i++) {
    var arg = args[i];
    if (goog.isArrayLike(arg) && !goog.dom.isNodeLike(arg)) {
      goog.array.forEach(goog.dom.isNodeList(arg) ? goog.array.toArray(arg) : arg, childHandler);
    } else {
      childHandler(arg);
    }
  }
};
goog.dom.$dom = goog.dom.createDom;
goog.dom.createElement = function(name) {
  return document.createElement(name);
};
goog.dom.createTextNode = function(content) {
  return document.createTextNode(String(content));
};
goog.dom.createTable = function(rows, columns, opt_fillWithNbsp) {
  return goog.dom.createTable_(document, rows, columns, !!opt_fillWithNbsp);
};
goog.dom.createTable_ = function(doc, rows, columns, fillWithNbsp) {
  var rowHtml = ["<tr>"];
  for (var i = 0;i < columns;i++) {
    rowHtml.push(fillWithNbsp ? "<td>&nbsp;</td>" : "<td></td>");
  }
  rowHtml.push("</tr>");
  rowHtml = rowHtml.join("");
  var totalHtml = ["<table>"];
  for (i = 0;i < rows;i++) {
    totalHtml.push(rowHtml);
  }
  totalHtml.push("</table>");
  var elem = doc.createElement(goog.dom.TagName.DIV);
  elem.innerHTML = totalHtml.join("");
  return(elem.removeChild(elem.firstChild));
};
goog.dom.htmlToDocumentFragment = function(htmlString) {
  return goog.dom.htmlToDocumentFragment_(document, htmlString);
};
goog.dom.htmlToDocumentFragment_ = function(doc, htmlString) {
  var tempDiv = doc.createElement("div");
  if (goog.dom.BrowserFeature.INNER_HTML_NEEDS_SCOPED_ELEMENT) {
    tempDiv.innerHTML = "<br>" + htmlString;
    tempDiv.removeChild(tempDiv.firstChild);
  } else {
    tempDiv.innerHTML = htmlString;
  }
  if (tempDiv.childNodes.length == 1) {
    return(tempDiv.removeChild(tempDiv.firstChild));
  } else {
    var fragment = doc.createDocumentFragment();
    while (tempDiv.firstChild) {
      fragment.appendChild(tempDiv.firstChild);
    }
    return fragment;
  }
};
goog.dom.isCss1CompatMode = function() {
  return goog.dom.isCss1CompatMode_(document);
};
goog.dom.isCss1CompatMode_ = function(doc) {
  if (goog.dom.COMPAT_MODE_KNOWN_) {
    return goog.dom.ASSUME_STANDARDS_MODE;
  }
  return doc.compatMode == "CSS1Compat";
};
goog.dom.canHaveChildren = function(node) {
  if (node.nodeType != goog.dom.NodeType.ELEMENT) {
    return false;
  }
  switch(node.tagName) {
    case goog.dom.TagName.APPLET:
    ;
    case goog.dom.TagName.AREA:
    ;
    case goog.dom.TagName.BASE:
    ;
    case goog.dom.TagName.BR:
    ;
    case goog.dom.TagName.COL:
    ;
    case goog.dom.TagName.COMMAND:
    ;
    case goog.dom.TagName.EMBED:
    ;
    case goog.dom.TagName.FRAME:
    ;
    case goog.dom.TagName.HR:
    ;
    case goog.dom.TagName.IMG:
    ;
    case goog.dom.TagName.INPUT:
    ;
    case goog.dom.TagName.IFRAME:
    ;
    case goog.dom.TagName.ISINDEX:
    ;
    case goog.dom.TagName.KEYGEN:
    ;
    case goog.dom.TagName.LINK:
    ;
    case goog.dom.TagName.NOFRAMES:
    ;
    case goog.dom.TagName.NOSCRIPT:
    ;
    case goog.dom.TagName.META:
    ;
    case goog.dom.TagName.OBJECT:
    ;
    case goog.dom.TagName.PARAM:
    ;
    case goog.dom.TagName.SCRIPT:
    ;
    case goog.dom.TagName.SOURCE:
    ;
    case goog.dom.TagName.STYLE:
    ;
    case goog.dom.TagName.TRACK:
    ;
    case goog.dom.TagName.WBR:
      return false;
  }
  return true;
};
goog.dom.appendChild = function(parent, child) {
  parent.appendChild(child);
};
goog.dom.append = function(parent, var_args) {
  goog.dom.append_(goog.dom.getOwnerDocument(parent), parent, arguments, 1);
};
goog.dom.removeChildren = function(node) {
  var child;
  while (child = node.firstChild) {
    node.removeChild(child);
  }
};
goog.dom.insertSiblingBefore = function(newNode, refNode) {
  if (refNode.parentNode) {
    refNode.parentNode.insertBefore(newNode, refNode);
  }
};
goog.dom.insertSiblingAfter = function(newNode, refNode) {
  if (refNode.parentNode) {
    refNode.parentNode.insertBefore(newNode, refNode.nextSibling);
  }
};
goog.dom.insertChildAt = function(parent, child, index) {
  parent.insertBefore(child, parent.childNodes[index] || null);
};
goog.dom.removeNode = function(node) {
  return node && node.parentNode ? node.parentNode.removeChild(node) : null;
};
goog.dom.replaceNode = function(newNode, oldNode) {
  var parent = oldNode.parentNode;
  if (parent) {
    parent.replaceChild(newNode, oldNode);
  }
};
goog.dom.flattenElement = function(element) {
  var child, parent = element.parentNode;
  if (parent && parent.nodeType != goog.dom.NodeType.DOCUMENT_FRAGMENT) {
    if (element.removeNode) {
      return(element.removeNode(false));
    } else {
      while (child = element.firstChild) {
        parent.insertBefore(child, element);
      }
      return(goog.dom.removeNode(element));
    }
  }
};
goog.dom.getChildren = function(element) {
  if (goog.dom.BrowserFeature.CAN_USE_CHILDREN_ATTRIBUTE && element.children != undefined) {
    return element.children;
  }
  return goog.array.filter(element.childNodes, function(node) {
    return node.nodeType == goog.dom.NodeType.ELEMENT;
  });
};
goog.dom.getFirstElementChild = function(node) {
  if (node.firstElementChild != undefined) {
    return(node).firstElementChild;
  }
  return goog.dom.getNextElementNode_(node.firstChild, true);
};
goog.dom.getLastElementChild = function(node) {
  if (node.lastElementChild != undefined) {
    return(node).lastElementChild;
  }
  return goog.dom.getNextElementNode_(node.lastChild, false);
};
goog.dom.getNextElementSibling = function(node) {
  if (node.nextElementSibling != undefined) {
    return(node).nextElementSibling;
  }
  return goog.dom.getNextElementNode_(node.nextSibling, true);
};
goog.dom.getPreviousElementSibling = function(node) {
  if (node.previousElementSibling != undefined) {
    return(node).previousElementSibling;
  }
  return goog.dom.getNextElementNode_(node.previousSibling, false);
};
goog.dom.getNextElementNode_ = function(node, forward) {
  while (node && node.nodeType != goog.dom.NodeType.ELEMENT) {
    node = forward ? node.nextSibling : node.previousSibling;
  }
  return(node);
};
goog.dom.getNextNode = function(node) {
  if (!node) {
    return null;
  }
  if (node.firstChild) {
    return node.firstChild;
  }
  while (node && !node.nextSibling) {
    node = node.parentNode;
  }
  return node ? node.nextSibling : null;
};
goog.dom.getPreviousNode = function(node) {
  if (!node) {
    return null;
  }
  if (!node.previousSibling) {
    return node.parentNode;
  }
  node = node.previousSibling;
  while (node && node.lastChild) {
    node = node.lastChild;
  }
  return node;
};
goog.dom.isNodeLike = function(obj) {
  return goog.isObject(obj) && obj.nodeType > 0;
};
goog.dom.isElement = function(obj) {
  return goog.isObject(obj) && obj.nodeType == goog.dom.NodeType.ELEMENT;
};
goog.dom.isWindow = function(obj) {
  return goog.isObject(obj) && obj["window"] == obj;
};
goog.dom.getParentElement = function(element) {
  var parent;
  if (goog.dom.BrowserFeature.CAN_USE_PARENT_ELEMENT_PROPERTY) {
    var isIe9 = goog.userAgent.IE && goog.userAgent.isVersionOrHigher("9") && !goog.userAgent.isVersionOrHigher("10");
    if (!(isIe9 && goog.global["SVGElement"] && element instanceof goog.global["SVGElement"])) {
      parent = element.parentElement;
      if (parent) {
        return parent;
      }
    }
  }
  parent = element.parentNode;
  return goog.dom.isElement(parent) ? (parent) : null;
};
goog.dom.contains = function(parent, descendant) {
  if (parent.contains && descendant.nodeType == goog.dom.NodeType.ELEMENT) {
    return parent == descendant || parent.contains(descendant);
  }
  if (typeof parent.compareDocumentPosition != "undefined") {
    return parent == descendant || Boolean(parent.compareDocumentPosition(descendant) & 16);
  }
  while (descendant && parent != descendant) {
    descendant = descendant.parentNode;
  }
  return descendant == parent;
};
goog.dom.compareNodeOrder = function(node1, node2) {
  if (node1 == node2) {
    return 0;
  }
  if (node1.compareDocumentPosition) {
    return node1.compareDocumentPosition(node2) & 2 ? 1 : -1;
  }
  if (goog.userAgent.IE && !goog.userAgent.isDocumentModeOrHigher(9)) {
    if (node1.nodeType == goog.dom.NodeType.DOCUMENT) {
      return-1;
    }
    if (node2.nodeType == goog.dom.NodeType.DOCUMENT) {
      return 1;
    }
  }
  if ("sourceIndex" in node1 || node1.parentNode && "sourceIndex" in node1.parentNode) {
    var isElement1 = node1.nodeType == goog.dom.NodeType.ELEMENT;
    var isElement2 = node2.nodeType == goog.dom.NodeType.ELEMENT;
    if (isElement1 && isElement2) {
      return node1.sourceIndex - node2.sourceIndex;
    } else {
      var parent1 = node1.parentNode;
      var parent2 = node2.parentNode;
      if (parent1 == parent2) {
        return goog.dom.compareSiblingOrder_(node1, node2);
      }
      if (!isElement1 && goog.dom.contains(parent1, node2)) {
        return-1 * goog.dom.compareParentsDescendantNodeIe_(node1, node2);
      }
      if (!isElement2 && goog.dom.contains(parent2, node1)) {
        return goog.dom.compareParentsDescendantNodeIe_(node2, node1);
      }
      return(isElement1 ? node1.sourceIndex : parent1.sourceIndex) - (isElement2 ? node2.sourceIndex : parent2.sourceIndex);
    }
  }
  var doc = goog.dom.getOwnerDocument(node1);
  var range1, range2;
  range1 = doc.createRange();
  range1.selectNode(node1);
  range1.collapse(true);
  range2 = doc.createRange();
  range2.selectNode(node2);
  range2.collapse(true);
  return range1.compareBoundaryPoints(goog.global["Range"].START_TO_END, range2);
};
goog.dom.compareParentsDescendantNodeIe_ = function(textNode, node) {
  var parent = textNode.parentNode;
  if (parent == node) {
    return-1;
  }
  var sibling = node;
  while (sibling.parentNode != parent) {
    sibling = sibling.parentNode;
  }
  return goog.dom.compareSiblingOrder_(sibling, textNode);
};
goog.dom.compareSiblingOrder_ = function(node1, node2) {
  var s = node2;
  while (s = s.previousSibling) {
    if (s == node1) {
      return-1;
    }
  }
  return 1;
};
goog.dom.findCommonAncestor = function(var_args) {
  var i, count = arguments.length;
  if (!count) {
    return null;
  } else {
    if (count == 1) {
      return arguments[0];
    }
  }
  var paths = [];
  var minLength = Infinity;
  for (i = 0;i < count;i++) {
    var ancestors = [];
    var node = arguments[i];
    while (node) {
      ancestors.unshift(node);
      node = node.parentNode;
    }
    paths.push(ancestors);
    minLength = Math.min(minLength, ancestors.length);
  }
  var output = null;
  for (i = 0;i < minLength;i++) {
    var first = paths[0][i];
    for (var j = 1;j < count;j++) {
      if (first != paths[j][i]) {
        return output;
      }
    }
    output = first;
  }
  return output;
};
goog.dom.getOwnerDocument = function(node) {
  goog.asserts.assert(node, "Node cannot be null or undefined.");
  return(node.nodeType == goog.dom.NodeType.DOCUMENT ? node : node.ownerDocument || node.document);
};
goog.dom.getFrameContentDocument = function(frame) {
  var doc = frame.contentDocument || frame.contentWindow.document;
  return doc;
};
goog.dom.getFrameContentWindow = function(frame) {
  return frame.contentWindow || goog.dom.getWindow(goog.dom.getFrameContentDocument(frame));
};
goog.dom.setTextContent = function(node, text) {
  goog.asserts.assert(node != null, "goog.dom.setTextContent expects a non-null value for node");
  if ("textContent" in node) {
    node.textContent = text;
  } else {
    if (node.nodeType == goog.dom.NodeType.TEXT) {
      node.data = text;
    } else {
      if (node.firstChild && node.firstChild.nodeType == goog.dom.NodeType.TEXT) {
        while (node.lastChild != node.firstChild) {
          node.removeChild(node.lastChild);
        }
        node.firstChild.data = text;
      } else {
        goog.dom.removeChildren(node);
        var doc = goog.dom.getOwnerDocument(node);
        node.appendChild(doc.createTextNode(String(text)));
      }
    }
  }
};
goog.dom.getOuterHtml = function(element) {
  if ("outerHTML" in element) {
    return element.outerHTML;
  } else {
    var doc = goog.dom.getOwnerDocument(element);
    var div = doc.createElement("div");
    div.appendChild(element.cloneNode(true));
    return div.innerHTML;
  }
};
goog.dom.findNode = function(root, p) {
  var rv = [];
  var found = goog.dom.findNodes_(root, p, rv, true);
  return found ? rv[0] : undefined;
};
goog.dom.findNodes = function(root, p) {
  var rv = [];
  goog.dom.findNodes_(root, p, rv, false);
  return rv;
};
goog.dom.findNodes_ = function(root, p, rv, findOne) {
  if (root != null) {
    var child = root.firstChild;
    while (child) {
      if (p(child)) {
        rv.push(child);
        if (findOne) {
          return true;
        }
      }
      if (goog.dom.findNodes_(child, p, rv, findOne)) {
        return true;
      }
      child = child.nextSibling;
    }
  }
  return false;
};
goog.dom.TAGS_TO_IGNORE_ = {"SCRIPT":1, "STYLE":1, "HEAD":1, "IFRAME":1, "OBJECT":1};
goog.dom.PREDEFINED_TAG_VALUES_ = {"IMG":" ", "BR":"\n"};
goog.dom.isFocusableTabIndex = function(element) {
  return goog.dom.hasSpecifiedTabIndex_(element) && goog.dom.isTabIndexFocusable_(element);
};
goog.dom.setFocusableTabIndex = function(element, enable) {
  if (enable) {
    element.tabIndex = 0;
  } else {
    element.tabIndex = -1;
    element.removeAttribute("tabIndex");
  }
};
goog.dom.isFocusable = function(element) {
  var focusable;
  if (goog.dom.nativelySupportsFocus_(element)) {
    focusable = !element.disabled && (!goog.dom.hasSpecifiedTabIndex_(element) || goog.dom.isTabIndexFocusable_(element));
  } else {
    focusable = goog.dom.isFocusableTabIndex(element);
  }
  return focusable && goog.userAgent.IE ? goog.dom.hasNonZeroBoundingRect_(element) : focusable;
};
goog.dom.hasSpecifiedTabIndex_ = function(element) {
  var attrNode = element.getAttributeNode("tabindex");
  return goog.isDefAndNotNull(attrNode) && attrNode.specified;
};
goog.dom.isTabIndexFocusable_ = function(element) {
  var index = element.tabIndex;
  return goog.isNumber(index) && index >= 0 && index < 32768;
};
goog.dom.nativelySupportsFocus_ = function(element) {
  return element.tagName == goog.dom.TagName.A || element.tagName == goog.dom.TagName.INPUT || element.tagName == goog.dom.TagName.TEXTAREA || element.tagName == goog.dom.TagName.SELECT || element.tagName == goog.dom.TagName.BUTTON;
};
goog.dom.hasNonZeroBoundingRect_ = function(element) {
  var rect = goog.isFunction(element["getBoundingClientRect"]) ? element.getBoundingClientRect() : {"height":element.offsetHeight, "width":element.offsetWidth};
  return goog.isDefAndNotNull(rect) && rect.height > 0 && rect.width > 0;
};
goog.dom.getTextContent = function(node) {
  var textContent;
  if (goog.dom.BrowserFeature.CAN_USE_INNER_TEXT && "innerText" in node) {
    textContent = goog.string.canonicalizeNewlines(node.innerText);
  } else {
    var buf = [];
    goog.dom.getTextContent_(node, buf, true);
    textContent = buf.join("");
  }
  textContent = textContent.replace(/ \xAD /g, " ").replace(/\xAD/g, "");
  textContent = textContent.replace(/\u200B/g, "");
  if (!goog.dom.BrowserFeature.CAN_USE_INNER_TEXT) {
    textContent = textContent.replace(/ +/g, " ");
  }
  if (textContent != " ") {
    textContent = textContent.replace(/^\s*/, "");
  }
  return textContent;
};
goog.dom.getRawTextContent = function(node) {
  var buf = [];
  goog.dom.getTextContent_(node, buf, false);
  return buf.join("");
};
goog.dom.getTextContent_ = function(node, buf, normalizeWhitespace) {
  if (node.nodeName in goog.dom.TAGS_TO_IGNORE_) {
  } else {
    if (node.nodeType == goog.dom.NodeType.TEXT) {
      if (normalizeWhitespace) {
        buf.push(String(node.nodeValue).replace(/(\r\n|\r|\n)/g, ""));
      } else {
        buf.push(node.nodeValue);
      }
    } else {
      if (node.nodeName in goog.dom.PREDEFINED_TAG_VALUES_) {
        buf.push(goog.dom.PREDEFINED_TAG_VALUES_[node.nodeName]);
      } else {
        var child = node.firstChild;
        while (child) {
          goog.dom.getTextContent_(child, buf, normalizeWhitespace);
          child = child.nextSibling;
        }
      }
    }
  }
};
goog.dom.getNodeTextLength = function(node) {
  return goog.dom.getTextContent(node).length;
};
goog.dom.getNodeTextOffset = function(node, opt_offsetParent) {
  var root = opt_offsetParent || goog.dom.getOwnerDocument(node).body;
  var buf = [];
  while (node && node != root) {
    var cur = node;
    while (cur = cur.previousSibling) {
      buf.unshift(goog.dom.getTextContent(cur));
    }
    node = node.parentNode;
  }
  return goog.string.trimLeft(buf.join("")).replace(/ +/g, " ").length;
};
goog.dom.getNodeAtOffset = function(parent, offset, opt_result) {
  var stack = [parent], pos = 0, cur = null;
  while (stack.length > 0 && pos < offset) {
    cur = stack.pop();
    if (cur.nodeName in goog.dom.TAGS_TO_IGNORE_) {
    } else {
      if (cur.nodeType == goog.dom.NodeType.TEXT) {
        var text = cur.nodeValue.replace(/(\r\n|\r|\n)/g, "").replace(/ +/g, " ");
        pos += text.length;
      } else {
        if (cur.nodeName in goog.dom.PREDEFINED_TAG_VALUES_) {
          pos += goog.dom.PREDEFINED_TAG_VALUES_[cur.nodeName].length;
        } else {
          for (var i = cur.childNodes.length - 1;i >= 0;i--) {
            stack.push(cur.childNodes[i]);
          }
        }
      }
    }
  }
  if (goog.isObject(opt_result)) {
    opt_result.remainder = cur ? cur.nodeValue.length + offset - pos - 1 : 0;
    opt_result.node = cur;
  }
  return cur;
};
goog.dom.isNodeList = function(val) {
  if (val && typeof val.length == "number") {
    if (goog.isObject(val)) {
      return typeof val.item == "function" || typeof val.item == "string";
    } else {
      if (goog.isFunction(val)) {
        return typeof val.item == "function";
      }
    }
  }
  return false;
};
goog.dom.getAncestorByTagNameAndClass = function(element, opt_tag, opt_class, opt_maxSearchSteps) {
  if (!opt_tag && !opt_class) {
    return null;
  }
  var tagName = opt_tag ? opt_tag.toUpperCase() : null;
  return(goog.dom.getAncestor(element, function(node) {
    return(!tagName || node.nodeName == tagName) && (!opt_class || goog.isString(node.className) && goog.array.contains(node.className.split(/\s+/), opt_class));
  }, true, opt_maxSearchSteps));
};
goog.dom.getAncestorByClass = function(element, className, opt_maxSearchSteps) {
  return goog.dom.getAncestorByTagNameAndClass(element, null, className, opt_maxSearchSteps);
};
goog.dom.getAncestor = function(element, matcher, opt_includeNode, opt_maxSearchSteps) {
  if (!opt_includeNode) {
    element = element.parentNode;
  }
  var ignoreSearchSteps = opt_maxSearchSteps == null;
  var steps = 0;
  while (element && (ignoreSearchSteps || steps <= opt_maxSearchSteps)) {
    if (matcher(element)) {
      return element;
    }
    element = element.parentNode;
    steps++;
  }
  return null;
};
goog.dom.getActiveElement = function(doc) {
  try {
    return doc && doc.activeElement;
  } catch (e) {
  }
  return null;
};
goog.dom.getPixelRatio = function() {
  var win = goog.dom.getWindow();
  var isFirefoxMobile = goog.userAgent.GECKO && goog.userAgent.MOBILE;
  if (goog.isDef(win.devicePixelRatio) && !isFirefoxMobile) {
    return win.devicePixelRatio;
  } else {
    if (win.matchMedia) {
      return goog.dom.matchesPixelRatio_(.75) || goog.dom.matchesPixelRatio_(1.5) || goog.dom.matchesPixelRatio_(2) || goog.dom.matchesPixelRatio_(3) || 1;
    }
  }
  return 1;
};
goog.dom.matchesPixelRatio_ = function(pixelRatio) {
  var win = goog.dom.getWindow();
  var query = "(-webkit-min-device-pixel-ratio: " + pixelRatio + ")," + "(min--moz-device-pixel-ratio: " + pixelRatio + ")," + "(min-resolution: " + pixelRatio + "dppx)";
  return win.matchMedia(query).matches ? pixelRatio : 0;
};
goog.dom.DomHelper = function(opt_document) {
  this.document_ = opt_document || goog.global.document || document;
};
goog.dom.DomHelper.prototype.getDomHelper = goog.dom.getDomHelper;
goog.dom.DomHelper.prototype.setDocument = function(document) {
  this.document_ = document;
};
goog.dom.DomHelper.prototype.getDocument = function() {
  return this.document_;
};
goog.dom.DomHelper.prototype.getElement = function(element) {
  return goog.dom.getElementHelper_(this.document_, element);
};
goog.dom.DomHelper.prototype.getRequiredElement = function(id) {
  return goog.dom.getRequiredElementHelper_(this.document_, id);
};
goog.dom.DomHelper.prototype.$ = goog.dom.DomHelper.prototype.getElement;
goog.dom.DomHelper.prototype.getElementsByTagNameAndClass = function(opt_tag, opt_class, opt_el) {
  return goog.dom.getElementsByTagNameAndClass_(this.document_, opt_tag, opt_class, opt_el);
};
goog.dom.DomHelper.prototype.getElementsByClass = function(className, opt_el) {
  var doc = opt_el || this.document_;
  return goog.dom.getElementsByClass(className, doc);
};
goog.dom.DomHelper.prototype.getElementByClass = function(className, opt_el) {
  var doc = opt_el || this.document_;
  return goog.dom.getElementByClass(className, doc);
};
goog.dom.DomHelper.prototype.getRequiredElementByClass = function(className, opt_root) {
  var root = opt_root || this.document_;
  return goog.dom.getRequiredElementByClass(className, root);
};
goog.dom.DomHelper.prototype.$$ = goog.dom.DomHelper.prototype.getElementsByTagNameAndClass;
goog.dom.DomHelper.prototype.setProperties = goog.dom.setProperties;
goog.dom.DomHelper.prototype.getViewportSize = function(opt_window) {
  return goog.dom.getViewportSize(opt_window || this.getWindow());
};
goog.dom.DomHelper.prototype.getDocumentHeight = function() {
  return goog.dom.getDocumentHeight_(this.getWindow());
};
goog.dom.Appendable;
goog.dom.DomHelper.prototype.createDom = function(tagName, opt_attributes, var_args) {
  return goog.dom.createDom_(this.document_, arguments);
};
goog.dom.DomHelper.prototype.$dom = goog.dom.DomHelper.prototype.createDom;
goog.dom.DomHelper.prototype.createElement = function(name) {
  return this.document_.createElement(name);
};
goog.dom.DomHelper.prototype.createTextNode = function(content) {
  return this.document_.createTextNode(String(content));
};
goog.dom.DomHelper.prototype.createTable = function(rows, columns, opt_fillWithNbsp) {
  return goog.dom.createTable_(this.document_, rows, columns, !!opt_fillWithNbsp);
};
goog.dom.DomHelper.prototype.htmlToDocumentFragment = function(htmlString) {
  return goog.dom.htmlToDocumentFragment_(this.document_, htmlString);
};
goog.dom.DomHelper.prototype.isCss1CompatMode = function() {
  return goog.dom.isCss1CompatMode_(this.document_);
};
goog.dom.DomHelper.prototype.getWindow = function() {
  return goog.dom.getWindow_(this.document_);
};
goog.dom.DomHelper.prototype.getDocumentScrollElement = function() {
  return goog.dom.getDocumentScrollElement_(this.document_);
};
goog.dom.DomHelper.prototype.getDocumentScroll = function() {
  return goog.dom.getDocumentScroll_(this.document_);
};
goog.dom.DomHelper.prototype.getActiveElement = function(opt_doc) {
  return goog.dom.getActiveElement(opt_doc || this.document_);
};
goog.dom.DomHelper.prototype.appendChild = goog.dom.appendChild;
goog.dom.DomHelper.prototype.append = goog.dom.append;
goog.dom.DomHelper.prototype.canHaveChildren = goog.dom.canHaveChildren;
goog.dom.DomHelper.prototype.removeChildren = goog.dom.removeChildren;
goog.dom.DomHelper.prototype.insertSiblingBefore = goog.dom.insertSiblingBefore;
goog.dom.DomHelper.prototype.insertSiblingAfter = goog.dom.insertSiblingAfter;
goog.dom.DomHelper.prototype.insertChildAt = goog.dom.insertChildAt;
goog.dom.DomHelper.prototype.removeNode = goog.dom.removeNode;
goog.dom.DomHelper.prototype.replaceNode = goog.dom.replaceNode;
goog.dom.DomHelper.prototype.flattenElement = goog.dom.flattenElement;
goog.dom.DomHelper.prototype.getChildren = goog.dom.getChildren;
goog.dom.DomHelper.prototype.getFirstElementChild = goog.dom.getFirstElementChild;
goog.dom.DomHelper.prototype.getLastElementChild = goog.dom.getLastElementChild;
goog.dom.DomHelper.prototype.getNextElementSibling = goog.dom.getNextElementSibling;
goog.dom.DomHelper.prototype.getPreviousElementSibling = goog.dom.getPreviousElementSibling;
goog.dom.DomHelper.prototype.getNextNode = goog.dom.getNextNode;
goog.dom.DomHelper.prototype.getPreviousNode = goog.dom.getPreviousNode;
goog.dom.DomHelper.prototype.isNodeLike = goog.dom.isNodeLike;
goog.dom.DomHelper.prototype.isElement = goog.dom.isElement;
goog.dom.DomHelper.prototype.isWindow = goog.dom.isWindow;
goog.dom.DomHelper.prototype.getParentElement = goog.dom.getParentElement;
goog.dom.DomHelper.prototype.contains = goog.dom.contains;
goog.dom.DomHelper.prototype.compareNodeOrder = goog.dom.compareNodeOrder;
goog.dom.DomHelper.prototype.findCommonAncestor = goog.dom.findCommonAncestor;
goog.dom.DomHelper.prototype.getOwnerDocument = goog.dom.getOwnerDocument;
goog.dom.DomHelper.prototype.getFrameContentDocument = goog.dom.getFrameContentDocument;
goog.dom.DomHelper.prototype.getFrameContentWindow = goog.dom.getFrameContentWindow;
goog.dom.DomHelper.prototype.setTextContent = goog.dom.setTextContent;
goog.dom.DomHelper.prototype.getOuterHtml = goog.dom.getOuterHtml;
goog.dom.DomHelper.prototype.findNode = goog.dom.findNode;
goog.dom.DomHelper.prototype.findNodes = goog.dom.findNodes;
goog.dom.DomHelper.prototype.isFocusableTabIndex = goog.dom.isFocusableTabIndex;
goog.dom.DomHelper.prototype.setFocusableTabIndex = goog.dom.setFocusableTabIndex;
goog.dom.DomHelper.prototype.isFocusable = goog.dom.isFocusable;
goog.dom.DomHelper.prototype.getTextContent = goog.dom.getTextContent;
goog.dom.DomHelper.prototype.getNodeTextLength = goog.dom.getNodeTextLength;
goog.dom.DomHelper.prototype.getNodeTextOffset = goog.dom.getNodeTextOffset;
goog.dom.DomHelper.prototype.getNodeAtOffset = goog.dom.getNodeAtOffset;
goog.dom.DomHelper.prototype.isNodeList = goog.dom.isNodeList;
goog.dom.DomHelper.prototype.getAncestorByTagNameAndClass = goog.dom.getAncestorByTagNameAndClass;
goog.dom.DomHelper.prototype.getAncestorByClass = goog.dom.getAncestorByClass;
goog.dom.DomHelper.prototype.getAncestor = goog.dom.getAncestor;
goog.provide("goog.json");
goog.provide("goog.json.Replacer");
goog.provide("goog.json.Reviver");
goog.provide("goog.json.Serializer");
goog.define("goog.json.USE_NATIVE_JSON", false);
goog.json.isValid = function(s) {
  if (/^\s*$/.test(s)) {
    return false;
  }
  var backslashesRe = /\\["\\\/bfnrtu]/g;
  var simpleValuesRe = /"[^"\\\n\r\u2028\u2029\x00-\x08\x0a-\x1f]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g;
  var openBracketsRe = /(?:^|:|,)(?:[\s\u2028\u2029]*\[)+/g;
  var remainderRe = /^[\],:{}\s\u2028\u2029]*$/;
  return remainderRe.test(s.replace(backslashesRe, "@").replace(simpleValuesRe, "]").replace(openBracketsRe, ""));
};
goog.json.parse = goog.json.USE_NATIVE_JSON ? (goog.global["JSON"]["parse"]) : function(s) {
  var o = String(s);
  if (goog.json.isValid(o)) {
    try {
      return(eval("(" + o + ")"));
    } catch (ex) {
    }
  }
  throw Error("Invalid JSON string: " + o);
};
goog.json.unsafeParse = goog.json.USE_NATIVE_JSON ? (goog.global["JSON"]["parse"]) : function(s) {
  return(eval("(" + s + ")"));
};
goog.json.Replacer;
goog.json.Reviver;
goog.json.serialize = goog.json.USE_NATIVE_JSON ? (goog.global["JSON"]["stringify"]) : function(object, opt_replacer) {
  return(new goog.json.Serializer(opt_replacer)).serialize(object);
};
goog.json.Serializer = function(opt_replacer) {
  this.replacer_ = opt_replacer;
};
goog.json.Serializer.prototype.serialize = function(object) {
  var sb = [];
  this.serializeInternal(object, sb);
  return sb.join("");
};
goog.json.Serializer.prototype.serializeInternal = function(object, sb) {
  switch(typeof object) {
    case "string":
      this.serializeString_((object), sb);
      break;
    case "number":
      this.serializeNumber_((object), sb);
      break;
    case "boolean":
      sb.push(object);
      break;
    case "undefined":
      sb.push("null");
      break;
    case "object":
      if (object == null) {
        sb.push("null");
        break;
      }
      if (goog.isArray(object)) {
        this.serializeArray((object), sb);
        break;
      }
      this.serializeObject_((object), sb);
      break;
    case "function":
      break;
    default:
      throw Error("Unknown type: " + typeof object);;
  }
};
goog.json.Serializer.charToJsonCharCache_ = {'"':'\\"', "\\":"\\\\", "/":"\\/", "\b":"\\b", "\f":"\\f", "\n":"\\n", "\r":"\\r", "\t":"\\t", "\x0B":"\\u000b"};
goog.json.Serializer.charsToReplace_ = /\uffff/.test("\uffff") ? /[\\\"\x00-\x1f\x7f-\uffff]/g : /[\\\"\x00-\x1f\x7f-\xff]/g;
goog.json.Serializer.prototype.serializeString_ = function(s, sb) {
  sb.push('"', s.replace(goog.json.Serializer.charsToReplace_, function(c) {
    if (c in goog.json.Serializer.charToJsonCharCache_) {
      return goog.json.Serializer.charToJsonCharCache_[c];
    }
    var cc = c.charCodeAt(0);
    var rv = "\\u";
    if (cc < 16) {
      rv += "000";
    } else {
      if (cc < 256) {
        rv += "00";
      } else {
        if (cc < 4096) {
          rv += "0";
        }
      }
    }
    return goog.json.Serializer.charToJsonCharCache_[c] = rv + cc.toString(16);
  }), '"');
};
goog.json.Serializer.prototype.serializeNumber_ = function(n, sb) {
  sb.push(isFinite(n) && !isNaN(n) ? n : "null");
};
goog.json.Serializer.prototype.serializeArray = function(arr, sb) {
  var l = arr.length;
  sb.push("[");
  var sep = "";
  for (var i = 0;i < l;i++) {
    sb.push(sep);
    var value = arr[i];
    this.serializeInternal(this.replacer_ ? this.replacer_.call(arr, String(i), value) : value, sb);
    sep = ",";
  }
  sb.push("]");
};
goog.json.Serializer.prototype.serializeObject_ = function(obj, sb) {
  sb.push("{");
  var sep = "";
  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      var value = obj[key];
      if (typeof value != "function") {
        sb.push(sep);
        this.serializeString_(key, sb);
        sb.push(":");
        this.serializeInternal(this.replacer_ ? this.replacer_.call(obj, key, value) : value, sb);
        sep = ",";
      }
    }
  }
  sb.push("}");
};
goog.provide("goog.proto2.ObjectSerializer");
goog.require("goog.asserts");
goog.require("goog.proto2.FieldDescriptor");
goog.require("goog.proto2.Serializer");
goog.require("goog.string");
goog.proto2.ObjectSerializer = function(opt_keyOption) {
  this.keyOption_ = opt_keyOption;
};
goog.inherits(goog.proto2.ObjectSerializer, goog.proto2.Serializer);
goog.proto2.ObjectSerializer.KeyOption = {TAG:0, NAME:1};
goog.proto2.ObjectSerializer.prototype.serialize = function(message) {
  var descriptor = message.getDescriptor();
  var fields = descriptor.getFields();
  var objectValue = {};
  for (var i = 0;i < fields.length;i++) {
    var field = fields[i];
    var key = this.keyOption_ == goog.proto2.ObjectSerializer.KeyOption.NAME ? field.getName() : field.getTag();
    if (message.has(field)) {
      if (field.isRepeated()) {
        var array = [];
        objectValue[key] = array;
        for (var j = 0;j < message.countOf(field);j++) {
          array.push(this.getSerializedValue(field, message.get(field, j)));
        }
      } else {
        objectValue[key] = this.getSerializedValue(field, message.get(field));
      }
    }
  }
  message.forEachUnknown(function(tag, value) {
    objectValue[tag] = value;
  });
  return objectValue;
};
goog.proto2.ObjectSerializer.prototype.getDeserializedValue = function(field, value) {
  if (field.getFieldType() == goog.proto2.FieldDescriptor.FieldType.BOOL && goog.isNumber(value)) {
    return Boolean(value);
  }
  return goog.proto2.ObjectSerializer.base(this, "getDeserializedValue", field, value);
};
goog.proto2.ObjectSerializer.prototype.deserializeTo = function(message, data) {
  var descriptor = message.getDescriptor();
  for (var key in data) {
    var field;
    var value = data[key];
    var isNumeric = goog.string.isNumeric(key);
    if (isNumeric) {
      field = descriptor.findFieldByTag(key);
    } else {
      goog.asserts.assert(this.keyOption_ == goog.proto2.ObjectSerializer.KeyOption.NAME);
      field = descriptor.findFieldByName(key);
    }
    if (field) {
      if (field.isRepeated()) {
        goog.asserts.assert(goog.isArray(value));
        for (var j = 0;j < value.length;j++) {
          message.add(field, this.getDeserializedValue(field, value[j]));
        }
      } else {
        goog.asserts.assert(!goog.isArray(value));
        message.set(field, this.getDeserializedValue(field, value));
      }
    } else {
      if (isNumeric) {
        message.setUnknown(Number(key), value);
      } else {
        goog.asserts.assert(field);
      }
    }
  }
};
goog.addDependency("../../third_party/closure/goog/caja/string/html/htmlparser.js", ["goog.string.html.HtmlParser", "goog.string.html.HtmlParser.EFlags", "goog.string.html.HtmlParser.Elements", "goog.string.html.HtmlParser.Entities", "goog.string.html.HtmlSaxHandler"], [], false);
goog.addDependency("../../third_party/closure/goog/caja/string/html/htmlsanitizer.js", ["goog.string.html.HtmlSanitizer", "goog.string.html.HtmlSanitizer.AttributeType", "goog.string.html.HtmlSanitizer.Attributes", "goog.string.html.htmlSanitize"], ["goog.string.StringBuffer", "goog.string.html.HtmlParser", "goog.string.html.HtmlParser.EFlags", "goog.string.html.HtmlParser.Elements", "goog.string.html.HtmlSaxHandler"], false);
goog.addDependency("../../third_party/closure/goog/dojo/dom/query.js", ["goog.dom.query"], ["goog.array", "goog.dom", "goog.functions", "goog.string", "goog.userAgent"], false);
goog.addDependency("../../third_party/closure/goog/jpeg_encoder/jpeg_encoder_basic.js", ["goog.crypt.JpegEncoder"], ["goog.crypt.base64"], false);
goog.addDependency("../../third_party/closure/goog/loremipsum/text/loremipsum.js", ["goog.text.LoremIpsum"], ["goog.array", "goog.math", "goog.string", "goog.structs.Map", "goog.structs.Set"], false);
goog.addDependency("../../third_party/closure/goog/mochikit/async/deferred.js", ["goog.async.Deferred", "goog.async.Deferred.AlreadyCalledError", "goog.async.Deferred.CanceledError"], ["goog.Promise", "goog.Thenable", "goog.array", "goog.asserts", "goog.debug.Error"], false);
goog.addDependency("../../third_party/closure/goog/mochikit/async/deferredlist.js", ["goog.async.DeferredList"], ["goog.async.Deferred"], false);
goog.addDependency("../../third_party/closure/goog/osapi/osapi.js", ["goog.osapi"], [], false);
goog.addDependency("../../third_party/closure/goog/svgpan/svgpan.js", ["svgpan.SvgPan"], ["goog.Disposable", "goog.events", "goog.events.EventType", "goog.events.MouseWheelHandler"], false);
goog.addDependency("a11y/aria/announcer.js", ["goog.a11y.aria.Announcer"], ["goog.Disposable", "goog.a11y.aria", "goog.a11y.aria.LivePriority", "goog.a11y.aria.State", "goog.dom", "goog.object"], false);
goog.addDependency("a11y/aria/announcer_test.js", ["goog.a11y.aria.AnnouncerTest"], ["goog.a11y.aria", "goog.a11y.aria.Announcer", "goog.a11y.aria.LivePriority", "goog.a11y.aria.State", "goog.array", "goog.dom", "goog.dom.iframe", "goog.testing.jsunit"], false);
goog.addDependency("a11y/aria/aria.js", ["goog.a11y.aria"], ["goog.a11y.aria.Role", "goog.a11y.aria.State", "goog.a11y.aria.datatables", "goog.array", "goog.asserts", "goog.dom", "goog.dom.TagName", "goog.object", "goog.string"], false);
goog.addDependency("a11y/aria/aria_test.js", ["goog.a11y.ariaTest"], ["goog.a11y.aria", "goog.a11y.aria.Role", "goog.a11y.aria.State", "goog.dom", "goog.dom.TagName", "goog.testing.jsunit"], false);
goog.addDependency("a11y/aria/attributes.js", ["goog.a11y.aria.AutoCompleteValues", "goog.a11y.aria.CheckedValues", "goog.a11y.aria.DropEffectValues", "goog.a11y.aria.ExpandedValues", "goog.a11y.aria.GrabbedValues", "goog.a11y.aria.InvalidValues", "goog.a11y.aria.LivePriority", "goog.a11y.aria.OrientationValues", "goog.a11y.aria.PressedValues", "goog.a11y.aria.RelevantValues", "goog.a11y.aria.SelectedValues", "goog.a11y.aria.SortValues", "goog.a11y.aria.State"], [], false);
goog.addDependency("a11y/aria/datatables.js", ["goog.a11y.aria.datatables"], ["goog.a11y.aria.State", "goog.object"], false);
goog.addDependency("a11y/aria/roles.js", ["goog.a11y.aria.Role"], [], false);
goog.addDependency("array/array.js", ["goog.array", "goog.array.ArrayLike"], ["goog.asserts"], false);
goog.addDependency("array/array_test.js", ["goog.arrayTest"], ["goog.array", "goog.dom", "goog.testing.PropertyReplacer", "goog.testing.jsunit", "goog.testing.recordFunction"], false);
goog.addDependency("asserts/asserts.js", ["goog.asserts", "goog.asserts.AssertionError"], ["goog.debug.Error", "goog.dom.NodeType", "goog.string"], false);
goog.addDependency("asserts/asserts_test.js", ["goog.assertsTest"], ["goog.asserts", "goog.asserts.AssertionError", "goog.dom", "goog.string", "goog.testing.jsunit", "goog.userAgent"], false);
goog.addDependency("async/animationdelay.js", ["goog.async.AnimationDelay"], ["goog.Disposable", "goog.events", "goog.functions"], false);
goog.addDependency("async/animationdelay_test.js", ["goog.async.AnimationDelayTest"], ["goog.async.AnimationDelay", "goog.testing.AsyncTestCase", "goog.testing.PropertyReplacer", "goog.testing.jsunit", "goog.testing.recordFunction"], false);
goog.addDependency("async/conditionaldelay.js", ["goog.async.ConditionalDelay"], ["goog.Disposable", "goog.async.Delay"], false);
goog.addDependency("async/conditionaldelay_test.js", ["goog.async.ConditionalDelayTest"], ["goog.async.ConditionalDelay", "goog.testing.MockClock", "goog.testing.jsunit"], false);
goog.addDependency("async/delay.js", ["goog.Delay", "goog.async.Delay"], ["goog.Disposable", "goog.Timer"], false);
goog.addDependency("async/delay_test.js", ["goog.async.DelayTest"], ["goog.async.Delay", "goog.testing.MockClock", "goog.testing.jsunit"], false);
goog.addDependency("async/nexttick.js", ["goog.async.nextTick", "goog.async.throwException"], ["goog.debug.entryPointRegistry", "goog.functions", "goog.labs.userAgent.browser"], false);
goog.addDependency("async/nexttick_test.js", ["goog.async.nextTickTest"], ["goog.async.nextTick", "goog.debug.ErrorHandler", "goog.debug.entryPointRegistry", "goog.dom", "goog.labs.userAgent.browser", "goog.testing.AsyncTestCase", "goog.testing.MockClock", "goog.testing.PropertyReplacer", "goog.testing.jsunit"], false);
goog.addDependency("async/run.js", ["goog.async.run"], ["goog.async.nextTick", "goog.async.throwException", "goog.testing.watchers"], false);
goog.addDependency("async/run_test.js", ["goog.async.runTest"], ["goog.async.run", "goog.testing.MockClock", "goog.testing.jsunit", "goog.testing.recordFunction"], false);
goog.addDependency("async/throttle.js", ["goog.Throttle", "goog.async.Throttle"], ["goog.Disposable", "goog.Timer"], false);
goog.addDependency("async/throttle_test.js", ["goog.async.ThrottleTest"], ["goog.async.Throttle", "goog.testing.MockClock", "goog.testing.jsunit"], false);
goog.addDependency("base.js", ["goog"], [], false);
goog.addDependency("base_module_test.js", ["goog.baseModuleTest"], ["goog.Timer", "goog.test_module", "goog.testing.PropertyReplacer", "goog.testing.jsunit"], true);
goog.addDependency("base_test.js", ["an.existing.path", "dup.base", "far.out", "goog.baseTest", "goog.explicit", "goog.implicit.explicit", "goog.test", "goog.test.name", "goog.test.name.space", "goog.xy", "goog.xy.z", "ns", "testDep.bar"], ["goog.Timer", "goog.functions", "goog.test_module", "goog.testing.PropertyReplacer", "goog.testing.jsunit", "goog.testing.recordFunction", "goog.userAgent"], false);
goog.addDependency("color/alpha.js", ["goog.color.alpha"], ["goog.color"], false);
goog.addDependency("color/alpha_test.js", ["goog.color.alphaTest"], ["goog.array", "goog.color", "goog.color.alpha", "goog.testing.jsunit"], false);
goog.addDependency("color/color.js", ["goog.color", "goog.color.Hsl", "goog.color.Hsv", "goog.color.Rgb"], ["goog.color.names", "goog.math"], false);
goog.addDependency("color/color_test.js", ["goog.colorTest"], ["goog.array", "goog.color", "goog.color.names", "goog.testing.jsunit"], false);
goog.addDependency("color/names.js", ["goog.color.names"], [], false);
goog.addDependency("crypt/aes.js", ["goog.crypt.Aes"], ["goog.asserts", "goog.crypt.BlockCipher"], false);
goog.addDependency("crypt/aes_test.js", ["goog.crypt.AesTest"], ["goog.crypt", "goog.crypt.Aes", "goog.testing.jsunit"], false);
goog.addDependency("crypt/arc4.js", ["goog.crypt.Arc4"], ["goog.asserts"], false);
goog.addDependency("crypt/arc4_test.js", ["goog.crypt.Arc4Test"], ["goog.array", "goog.crypt.Arc4", "goog.testing.jsunit"], false);
goog.addDependency("crypt/base64.js", ["goog.crypt.base64"], ["goog.crypt", "goog.userAgent"], false);
goog.addDependency("crypt/base64_test.js", ["goog.crypt.base64Test"], ["goog.crypt", "goog.crypt.base64", "goog.testing.jsunit"], false);
goog.addDependency("crypt/basen.js", ["goog.crypt.baseN"], [], false);
goog.addDependency("crypt/basen_test.js", ["goog.crypt.baseNTest"], ["goog.crypt.baseN", "goog.testing.jsunit"], false);
goog.addDependency("crypt/blobhasher.js", ["goog.crypt.BlobHasher", "goog.crypt.BlobHasher.EventType"], ["goog.asserts", "goog.events.EventTarget", "goog.fs", "goog.log"], false);
goog.addDependency("crypt/blobhasher_test.js", ["goog.crypt.BlobHasherTest"], ["goog.crypt", "goog.crypt.BlobHasher", "goog.crypt.Md5", "goog.events", "goog.testing.PropertyReplacer", "goog.testing.jsunit"], false);
goog.addDependency("crypt/blockcipher.js", ["goog.crypt.BlockCipher"], [], false);
goog.addDependency("crypt/bytestring_perf.js", ["goog.crypt.byteArrayToStringPerf"], ["goog.array", "goog.dom", "goog.testing.PerformanceTable"], false);
goog.addDependency("crypt/cbc.js", ["goog.crypt.Cbc"], ["goog.array", "goog.asserts", "goog.crypt"], false);
goog.addDependency("crypt/cbc_test.js", ["goog.crypt.CbcTest"], ["goog.crypt", "goog.crypt.Aes", "goog.crypt.Cbc", "goog.testing.jsunit"], false);
goog.addDependency("crypt/crypt.js", ["goog.crypt"], ["goog.array", "goog.asserts"], false);
goog.addDependency("crypt/crypt_test.js", ["goog.cryptTest"], ["goog.crypt", "goog.string", "goog.testing.jsunit"], false);
goog.addDependency("crypt/hash.js", ["goog.crypt.Hash"], [], false);
goog.addDependency("crypt/hash32.js", ["goog.crypt.hash32"], ["goog.crypt"], false);
goog.addDependency("crypt/hash32_test.js", ["goog.crypt.hash32Test"], ["goog.crypt.hash32", "goog.testing.TestCase", "goog.testing.jsunit"], false);
goog.addDependency("crypt/hashtester.js", ["goog.crypt.hashTester"], ["goog.array", "goog.crypt", "goog.dom", "goog.testing.PerformanceTable", "goog.testing.PseudoRandom", "goog.testing.asserts"], false);
goog.addDependency("crypt/hmac.js", ["goog.crypt.Hmac"], ["goog.crypt.Hash"], false);
goog.addDependency("crypt/hmac_test.js", ["goog.crypt.HmacTest"], ["goog.crypt.Hmac", "goog.crypt.Sha1", "goog.crypt.hashTester", "goog.testing.jsunit"], false);
goog.addDependency("crypt/md5.js", ["goog.crypt.Md5"], ["goog.crypt.Hash"], false);
goog.addDependency("crypt/md5_test.js", ["goog.crypt.Md5Test"], ["goog.crypt", "goog.crypt.Md5", "goog.crypt.hashTester", "goog.testing.jsunit"], false);
goog.addDependency("crypt/pbkdf2.js", ["goog.crypt.pbkdf2"], ["goog.array", "goog.asserts", "goog.crypt", "goog.crypt.Hmac", "goog.crypt.Sha1"], false);
goog.addDependency("crypt/pbkdf2_test.js", ["goog.crypt.pbkdf2Test"], ["goog.crypt", "goog.crypt.pbkdf2", "goog.testing.jsunit", "goog.userAgent"], false);
goog.addDependency("crypt/sha1.js", ["goog.crypt.Sha1"], ["goog.crypt.Hash"], false);
goog.addDependency("crypt/sha1_test.js", ["goog.crypt.Sha1Test"], ["goog.crypt", "goog.crypt.Sha1", "goog.crypt.hashTester", "goog.testing.jsunit", "goog.userAgent"], false);
goog.addDependency("crypt/sha2.js", ["goog.crypt.Sha2"], ["goog.array", "goog.asserts", "goog.crypt.Hash"], false);
goog.addDependency("crypt/sha224.js", ["goog.crypt.Sha224"], ["goog.crypt.Sha2"], false);
goog.addDependency("crypt/sha224_test.js", ["goog.crypt.Sha224Test"], ["goog.crypt", "goog.crypt.Sha224", "goog.crypt.hashTester", "goog.testing.jsunit"], false);
goog.addDependency("crypt/sha256.js", ["goog.crypt.Sha256"], ["goog.crypt.Sha2"], false);
goog.addDependency("crypt/sha256_test.js", ["goog.crypt.Sha256Test"], ["goog.crypt", "goog.crypt.Sha256", "goog.crypt.hashTester", "goog.testing.jsunit"], false);
goog.addDependency("crypt/sha2_64bit.js", ["goog.crypt.Sha2_64bit"], ["goog.array", "goog.asserts", "goog.crypt.Hash", "goog.math.Long"], false);
goog.addDependency("crypt/sha2_64bit_test.js", ["goog.crypt.Sha2_64bit_test"], ["goog.array", "goog.crypt", "goog.crypt.Sha384", "goog.crypt.Sha512", "goog.crypt.Sha512_256", "goog.crypt.hashTester", "goog.testing.jsunit", "goog.userAgent"], false);
goog.addDependency("crypt/sha384.js", ["goog.crypt.Sha384"], ["goog.crypt.Sha2_64bit"], false);
goog.addDependency("crypt/sha512.js", ["goog.crypt.Sha512"], ["goog.crypt.Sha2_64bit"], false);
goog.addDependency("crypt/sha512_256.js", ["goog.crypt.Sha512_256"], ["goog.crypt.Sha2_64bit"], false);
goog.addDependency("cssom/cssom.js", ["goog.cssom", "goog.cssom.CssRuleType"], ["goog.array", "goog.dom"], false);
goog.addDependency("cssom/cssom_test.js", ["goog.cssomTest"], ["goog.array", "goog.cssom", "goog.cssom.CssRuleType", "goog.testing.jsunit", "goog.userAgent"], false);
goog.addDependency("cssom/iframe/style.js", ["goog.cssom.iframe.style"], ["goog.asserts", "goog.cssom", "goog.dom", "goog.dom.NodeType", "goog.dom.TagName", "goog.dom.classlist", "goog.string", "goog.style", "goog.userAgent"], false);
goog.addDependency("cssom/iframe/style_test.js", ["goog.cssom.iframe.styleTest"], ["goog.cssom", "goog.cssom.iframe.style", "goog.dom", "goog.dom.DomHelper", "goog.testing.jsunit", "goog.userAgent"], false);
goog.addDependency("datasource/datamanager.js", ["goog.ds.DataManager"], ["goog.ds.BasicNodeList", "goog.ds.DataNode", "goog.ds.Expr", "goog.object", "goog.string", "goog.structs", "goog.structs.Map"], false);
goog.addDependency("datasource/datasource.js", ["goog.ds.BaseDataNode", "goog.ds.BasicNodeList", "goog.ds.DataNode", "goog.ds.DataNodeList", "goog.ds.EmptyNodeList", "goog.ds.LoadState", "goog.ds.SortedNodeList", "goog.ds.Util", "goog.ds.logger"], ["goog.array", "goog.log"], false);
goog.addDependency("datasource/datasource_test.js", ["goog.ds.JsDataSourceTest"], ["goog.dom.xml", "goog.ds.DataManager", "goog.ds.JsDataSource", "goog.ds.SortedNodeList", "goog.ds.XmlDataSource", "goog.testing.jsunit"], false);
goog.addDependency("datasource/expr.js", ["goog.ds.Expr"], ["goog.ds.BasicNodeList", "goog.ds.EmptyNodeList", "goog.string"], false);
goog.addDependency("datasource/expr_test.js", ["goog.ds.ExprTest"], ["goog.ds.DataManager", "goog.ds.Expr", "goog.ds.JsDataSource", "goog.testing.jsunit"], false);
goog.addDependency("datasource/fastdatanode.js", ["goog.ds.AbstractFastDataNode", "goog.ds.FastDataNode", "goog.ds.FastListNode", "goog.ds.PrimitiveFastDataNode"], ["goog.ds.DataManager", "goog.ds.EmptyNodeList", "goog.string"], false);
goog.addDependency("datasource/fastdatanode_test.js", ["goog.ds.FastDataNodeTest"], ["goog.array", "goog.ds.DataManager", "goog.ds.Expr", "goog.ds.FastDataNode", "goog.testing.jsunit"], false);
goog.addDependency("datasource/jsdatasource.js", ["goog.ds.JsDataSource", "goog.ds.JsPropertyDataSource"], ["goog.ds.BaseDataNode", "goog.ds.BasicNodeList", "goog.ds.DataManager", "goog.ds.EmptyNodeList", "goog.ds.LoadState"], false);
goog.addDependency("datasource/jsondatasource.js", ["goog.ds.JsonDataSource"], ["goog.Uri", "goog.dom", "goog.ds.DataManager", "goog.ds.JsDataSource", "goog.ds.LoadState", "goog.ds.logger"], false);
goog.addDependency("datasource/jsxmlhttpdatasource.js", ["goog.ds.JsXmlHttpDataSource"], ["goog.Uri", "goog.ds.DataManager", "goog.ds.FastDataNode", "goog.ds.LoadState", "goog.ds.logger", "goog.events", "goog.log", "goog.net.EventType", "goog.net.XhrIo"], false);
goog.addDependency("datasource/jsxmlhttpdatasource_test.js", ["goog.ds.JsXmlHttpDataSourceTest"], ["goog.ds.JsXmlHttpDataSource", "goog.testing.TestQueue", "goog.testing.jsunit", "goog.testing.net.XhrIo"], false);
goog.addDependency("datasource/xmldatasource.js", ["goog.ds.XmlDataSource", "goog.ds.XmlHttpDataSource"], ["goog.Uri", "goog.dom.NodeType", "goog.dom.xml", "goog.ds.BasicNodeList", "goog.ds.DataManager", "goog.ds.LoadState", "goog.ds.logger", "goog.net.XhrIo", "goog.string"], false);
goog.addDependency("date/date.js", ["goog.date", "goog.date.Date", "goog.date.DateTime", "goog.date.Interval", "goog.date.month", "goog.date.weekDay"], ["goog.asserts", "goog.date.DateLike", "goog.i18n.DateTimeSymbols", "goog.string"], false);
goog.addDependency("date/date_test.js", ["goog.dateTest"], ["goog.array", "goog.date", "goog.date.Date", "goog.date.DateTime", "goog.date.Interval", "goog.date.month", "goog.date.weekDay", "goog.i18n.DateTimeSymbols", "goog.testing.ExpectedFailures", "goog.testing.jsunit", "goog.userAgent", "goog.userAgent.platform", "goog.userAgent.product", "goog.userAgent.product.isVersion"], false);
goog.addDependency("date/datelike.js", ["goog.date.DateLike"], [], false);
goog.addDependency("date/daterange.js", ["goog.date.DateRange", "goog.date.DateRange.Iterator", "goog.date.DateRange.StandardDateRangeKeys"], ["goog.date.Date", "goog.date.Interval", "goog.iter.Iterator", "goog.iter.StopIteration"], false);
goog.addDependency("date/daterange_test.js", ["goog.date.DateRangeTest"], ["goog.date.Date", "goog.date.DateRange", "goog.date.Interval", "goog.i18n.DateTimeSymbols", "goog.testing.jsunit"], false);
goog.addDependency("date/duration.js", ["goog.date.duration"], ["goog.i18n.DateTimeFormat", "goog.i18n.MessageFormat"], false);
goog.addDependency("date/duration_test.js", ["goog.date.durationTest"], ["goog.date.duration", "goog.i18n.DateTimeFormat", "goog.i18n.DateTimeSymbols", "goog.i18n.DateTimeSymbols_bn", "goog.i18n.DateTimeSymbols_en", "goog.i18n.DateTimeSymbols_fa", "goog.testing.jsunit"], false);
goog.addDependency("date/relative.js", ["goog.date.relative", "goog.date.relative.TimeDeltaFormatter", "goog.date.relative.Unit"], ["goog.i18n.DateTimeFormat"], false);
goog.addDependency("date/relative_test.js", ["goog.date.relativeTest"], ["goog.date.DateTime", "goog.date.relative", "goog.i18n.DateTimeFormat", "goog.testing.jsunit"], false);
goog.addDependency("date/relativewithplurals.js", ["goog.date.relativeWithPlurals"], ["goog.date.relative", "goog.date.relative.Unit", "goog.i18n.MessageFormat"], false);
goog.addDependency("date/relativewithplurals_test.js", ["goog.date.relativeWithPluralsTest"], ["goog.date.relative", "goog.date.relativeTest", "goog.date.relativeWithPlurals", "goog.i18n.DateTimeFormat", "goog.i18n.DateTimeSymbols", "goog.i18n.DateTimeSymbols_bn", "goog.i18n.DateTimeSymbols_en", "goog.i18n.DateTimeSymbols_fa", "goog.i18n.NumberFormatSymbols", "goog.i18n.NumberFormatSymbols_bn", "goog.i18n.NumberFormatSymbols_en", "goog.i18n.NumberFormatSymbols_fa"], false);
goog.addDependency("date/utcdatetime.js", ["goog.date.UtcDateTime"], ["goog.date", "goog.date.Date", "goog.date.DateTime", "goog.date.Interval"], false);
goog.addDependency("date/utcdatetime_test.js", ["goog.date.UtcDateTimeTest"], ["goog.date.Interval", "goog.date.UtcDateTime", "goog.date.month", "goog.date.weekDay", "goog.testing.jsunit"], false);
goog.addDependency("db/cursor.js", ["goog.db.Cursor"], ["goog.async.Deferred", "goog.db.Error", "goog.debug", "goog.events.EventTarget"], false);
goog.addDependency("db/db.js", ["goog.db", "goog.db.BlockedCallback", "goog.db.UpgradeNeededCallback"], ["goog.asserts", "goog.async.Deferred", "goog.db.Error", "goog.db.IndexedDb", "goog.db.Transaction"], false);
goog.addDependency("db/db_test.js", ["goog.dbTest"], ["goog.Disposable", "goog.array", "goog.async.Deferred", "goog.async.DeferredList", "goog.db", "goog.db.Cursor", "goog.db.Error", "goog.db.IndexedDb", "goog.db.KeyRange", "goog.db.Transaction", "goog.events", "goog.object", "goog.testing.AsyncTestCase", "goog.testing.PropertyReplacer", "goog.testing.asserts", "goog.testing.jsunit", "goog.userAgent.product", "goog.userAgent.product.isVersion"], false);
goog.addDependency("db/error.js", ["goog.db.Error", "goog.db.Error.ErrorCode", "goog.db.Error.ErrorName", "goog.db.Error.VersionChangeBlockedError"], ["goog.debug.Error"], false);
goog.addDependency("db/index.js", ["goog.db.Index"], ["goog.async.Deferred", "goog.db.Cursor", "goog.db.Error", "goog.debug"], false);
goog.addDependency("db/indexeddb.js", ["goog.db.IndexedDb"], ["goog.async.Deferred", "goog.db.Error", "goog.db.ObjectStore", "goog.db.Transaction", "goog.events.Event", "goog.events.EventHandler", "goog.events.EventTarget"], false);
goog.addDependency("db/keyrange.js", ["goog.db.KeyRange"], [], false);
goog.addDependency("db/objectstore.js", ["goog.db.ObjectStore"], ["goog.async.Deferred", "goog.db.Cursor", "goog.db.Error", "goog.db.Index", "goog.debug", "goog.events"], false);
goog.addDependency("db/old_db_test.js", ["goog.oldDbTest"], ["goog.async.Deferred", "goog.db", "goog.db.Cursor", "goog.db.Error", "goog.db.IndexedDb", "goog.db.KeyRange", "goog.db.Transaction", "goog.events", "goog.testing.AsyncTestCase", "goog.testing.asserts", "goog.testing.jsunit", "goog.userAgent.product", "goog.userAgent.product.isVersion"], false);
goog.addDependency("db/transaction.js", ["goog.db.Transaction", "goog.db.Transaction.TransactionMode"], ["goog.async.Deferred", "goog.db.Error", "goog.db.ObjectStore", "goog.events", "goog.events.EventHandler", "goog.events.EventTarget"], false);
goog.addDependency("debug/console.js", ["goog.debug.Console"], ["goog.debug.LogManager", "goog.debug.Logger", "goog.debug.TextFormatter"], false);
goog.addDependency("debug/console_test.js", ["goog.debug.ConsoleTest"], ["goog.debug.Console", "goog.debug.LogRecord", "goog.debug.Logger", "goog.testing.jsunit", "goog.testing.recordFunction"], false);
goog.addDependency("debug/debug.js", ["goog.debug"], ["goog.array", "goog.string", "goog.structs.Set", "goog.userAgent"], false);
goog.addDependency("debug/debug_test.js", ["goog.debugTest"], ["goog.debug", "goog.structs.Set", "goog.testing.jsunit"], false);
goog.addDependency("debug/debugwindow.js", ["goog.debug.DebugWindow"], ["goog.debug.HtmlFormatter", "goog.debug.LogManager", "goog.debug.Logger", "goog.structs.CircularBuffer", "goog.userAgent"], false);
goog.addDependency("debug/debugwindow_test.js", ["goog.debug.DebugWindowTest"], ["goog.debug.DebugWindow", "goog.testing.jsunit"], false);
goog.addDependency("debug/devcss/devcss.js", ["goog.debug.DevCss", "goog.debug.DevCss.UserAgent"], ["goog.asserts", "goog.cssom", "goog.dom.classlist", "goog.events", "goog.events.EventType", "goog.string", "goog.userAgent"], false);
goog.addDependency("debug/devcss/devcss_test.js", ["goog.debug.DevCssTest"], ["goog.debug.DevCss", "goog.style", "goog.testing.jsunit"], false);
goog.addDependency("debug/devcss/devcssrunner.js", ["goog.debug.devCssRunner"], ["goog.debug.DevCss"], false);
goog.addDependency("debug/divconsole.js", ["goog.debug.DivConsole"], ["goog.debug.HtmlFormatter", "goog.debug.LogManager", "goog.dom.safe", "goog.html.SafeHtml", "goog.style"], false);
goog.addDependency("debug/enhanceerror_test.js", ["goog.debugEnhanceErrorTest"], ["goog.debug", "goog.testing.jsunit"], false);
goog.addDependency("debug/entrypointregistry.js", ["goog.debug.EntryPointMonitor", "goog.debug.entryPointRegistry"], ["goog.asserts"], false);
goog.addDependency("debug/entrypointregistry_test.js", ["goog.debug.entryPointRegistryTest"], ["goog.debug.ErrorHandler", "goog.debug.entryPointRegistry", "goog.testing.jsunit"], false);
goog.addDependency("debug/error.js", ["goog.debug.Error"], [], false);
goog.addDependency("debug/error_test.js", ["goog.debug.ErrorTest"], ["goog.debug.Error", "goog.testing.ExpectedFailures", "goog.testing.jsunit", "goog.userAgent", "goog.userAgent.product"], false);
goog.addDependency("debug/errorhandler.js", ["goog.debug.ErrorHandler", "goog.debug.ErrorHandler.ProtectedFunctionError"], ["goog.Disposable", "goog.asserts", "goog.debug", "goog.debug.EntryPointMonitor", "goog.debug.Error", "goog.debug.Trace"], false);
goog.addDependency("debug/errorhandler_async_test.js", ["goog.debug.ErrorHandlerAsyncTest"], ["goog.debug.ErrorHandler", "goog.testing.AsyncTestCase", "goog.testing.jsunit", "goog.userAgent"], false);
goog.addDependency("debug/errorhandler_test.js", ["goog.debug.ErrorHandlerTest"], ["goog.debug.ErrorHandler", "goog.testing.MockControl", "goog.testing.jsunit"], false);
goog.addDependency("debug/errorhandlerweakdep.js", ["goog.debug.errorHandlerWeakDep"], [], false);
goog.addDependency("debug/errorreporter.js", ["goog.debug.ErrorReporter", "goog.debug.ErrorReporter.ExceptionEvent"], ["goog.asserts", "goog.debug", "goog.debug.ErrorHandler", "goog.debug.entryPointRegistry", "goog.events", "goog.events.Event", "goog.events.EventTarget", "goog.log", "goog.net.XhrIo", "goog.object", "goog.string", "goog.uri.utils", "goog.userAgent"], false);
goog.addDependency("debug/errorreporter_test.js", ["goog.debug.ErrorReporterTest"], ["goog.debug.ErrorReporter", "goog.events", "goog.functions", "goog.testing.PropertyReplacer", "goog.testing.jsunit", "goog.userAgent"], false);
goog.addDependency("debug/fancywindow.js", ["goog.debug.FancyWindow"], ["goog.array", "goog.debug.DebugWindow", "goog.debug.LogManager", "goog.debug.Logger", "goog.dom.DomHelper", "goog.dom.safe", "goog.html.SafeHtml", "goog.object", "goog.string", "goog.userAgent"], false);
goog.addDependency("debug/formatter.js", ["goog.debug.Formatter", "goog.debug.HtmlFormatter", "goog.debug.TextFormatter"], ["goog.debug.Logger", "goog.debug.RelativeTimeProvider", "goog.html.SafeHtml"], false);
goog.addDependency("debug/formatter_test.js", ["goog.debug.FormatterTest"], ["goog.debug.HtmlFormatter", "goog.debug.LogRecord", "goog.debug.Logger", "goog.html.SafeHtml", "goog.testing.jsunit"], false);
goog.addDependency("debug/fpsdisplay.js", ["goog.debug.FpsDisplay"], ["goog.asserts", "goog.async.AnimationDelay", "goog.ui.Component"], false);
goog.addDependency("debug/fpsdisplay_test.js", ["goog.debug.FpsDisplayTest"], ["goog.debug.FpsDisplay", "goog.testing.AsyncTestCase", "goog.testing.jsunit"], false);
goog.addDependency("debug/gcdiagnostics.js", ["goog.debug.GcDiagnostics"], ["goog.debug.Trace", "goog.log", "goog.userAgent"], false);
goog.addDependency("debug/logbuffer.js", ["goog.debug.LogBuffer"], ["goog.asserts", "goog.debug.LogRecord"], false);
goog.addDependency("debug/logbuffer_test.js", ["goog.debug.LogBufferTest"], ["goog.debug.LogBuffer", "goog.debug.Logger", "goog.testing.jsunit"], false);
goog.addDependency("debug/logger.js", ["goog.debug.LogManager", "goog.debug.Loggable", "goog.debug.Logger", "goog.debug.Logger.Level"], ["goog.array", "goog.asserts", "goog.debug", "goog.debug.LogBuffer", "goog.debug.LogRecord"], false);
goog.addDependency("debug/logger_test.js", ["goog.debug.LoggerTest"], ["goog.debug.LogManager", "goog.debug.Logger", "goog.testing.jsunit"], false);
goog.addDependency("debug/logrecord.js", ["goog.debug.LogRecord"], [], false);
goog.addDependency("debug/logrecordserializer.js", ["goog.debug.logRecordSerializer"], ["goog.debug.LogRecord", "goog.debug.Logger", "goog.json", "goog.object"], false);
goog.addDependency("debug/logrecordserializer_test.js", ["goog.debug.logRecordSerializerTest"], ["goog.debug.LogRecord", "goog.debug.Logger", "goog.debug.logRecordSerializer", "goog.testing.jsunit"], false);
goog.addDependency("debug/relativetimeprovider.js", ["goog.debug.RelativeTimeProvider"], [], false);
goog.addDependency("debug/tracer.js", ["goog.debug.Trace"], ["goog.array", "goog.debug.Logger", "goog.iter", "goog.log", "goog.structs.Map", "goog.structs.SimplePool"], false);
goog.addDependency("debug/tracer_test.js", ["goog.debug.TraceTest"], ["goog.debug.Trace", "goog.testing.jsunit"], false);
goog.addDependency("defineclass_test.js", ["goog.defineClassTest"], ["goog.testing.jsunit"], false);
goog.addDependency("disposable/disposable.js", ["goog.Disposable", "goog.dispose", "goog.disposeAll"], ["goog.disposable.IDisposable"], false);
goog.addDependency("disposable/disposable_test.js", ["goog.DisposableTest"], ["goog.Disposable", "goog.testing.jsunit", "goog.testing.recordFunction"], false);
goog.addDependency("disposable/idisposable.js", ["goog.disposable.IDisposable"], [], false);
goog.addDependency("dom/abstractmultirange.js", ["goog.dom.AbstractMultiRange"], ["goog.array", "goog.dom", "goog.dom.AbstractRange"], false);
goog.addDependency("dom/abstractrange.js", ["goog.dom.AbstractRange", "goog.dom.RangeIterator", "goog.dom.RangeType"], ["goog.dom", "goog.dom.NodeType", "goog.dom.SavedCaretRange", "goog.dom.TagIterator", "goog.userAgent"], false);
goog.addDependency("dom/abstractrange_test.js", ["goog.dom.AbstractRangeTest"], ["goog.dom", "goog.dom.AbstractRange", "goog.dom.Range", "goog.testing.jsunit"], false);
goog.addDependency("dom/animationframe/animationframe.js", ["goog.dom.animationFrame", "goog.dom.animationFrame.Spec", "goog.dom.animationFrame.State"], ["goog.dom.animationFrame.polyfill"], false);
goog.addDependency("dom/animationframe/polyfill.js", ["goog.dom.animationFrame.polyfill"], [], false);
goog.addDependency("dom/annotate.js", ["goog.dom.annotate", "goog.dom.annotate.AnnotateFn"], ["goog.array", "goog.asserts", "goog.dom", "goog.dom.NodeType", "goog.dom.safe", "goog.html.SafeHtml"], false);
goog.addDependency("dom/annotate_test.js", ["goog.dom.annotateTest"], ["goog.dom", "goog.dom.annotate", "goog.html.SafeHtml", "goog.testing.jsunit"], false);
goog.addDependency("dom/browserfeature.js", ["goog.dom.BrowserFeature"], ["goog.userAgent"], false);
goog.addDependency("dom/browserrange/abstractrange.js", ["goog.dom.browserrange.AbstractRange"], ["goog.array", "goog.asserts", "goog.dom", "goog.dom.NodeType", "goog.dom.RangeEndpoint", "goog.dom.TagName", "goog.dom.TextRangeIterator", "goog.iter", "goog.math.Coordinate", "goog.string", "goog.string.StringBuffer", "goog.userAgent"], false);
goog.addDependency("dom/browserrange/browserrange.js", ["goog.dom.browserrange", "goog.dom.browserrange.Error"], ["goog.dom", "goog.dom.BrowserFeature", "goog.dom.NodeType", "goog.dom.browserrange.GeckoRange", "goog.dom.browserrange.IeRange", "goog.dom.browserrange.OperaRange", "goog.dom.browserrange.W3cRange", "goog.dom.browserrange.WebKitRange", "goog.userAgent"], false);
goog.addDependency("dom/browserrange/browserrange_test.js", ["goog.dom.browserrangeTest"], ["goog.dom", "goog.dom.NodeType", "goog.dom.Range", "goog.dom.RangeEndpoint", "goog.dom.TagName", "goog.dom.browserrange", "goog.testing.dom", "goog.testing.jsunit", "goog.userAgent"], false);
goog.addDependency("dom/browserrange/geckorange.js", ["goog.dom.browserrange.GeckoRange"], ["goog.dom.browserrange.W3cRange"], false);
goog.addDependency("dom/browserrange/ierange.js", ["goog.dom.browserrange.IeRange"], ["goog.array", "goog.dom", "goog.dom.NodeType", "goog.dom.RangeEndpoint", "goog.dom.TagName", "goog.dom.browserrange.AbstractRange", "goog.log", "goog.string"], false);
goog.addDependency("dom/browserrange/operarange.js", ["goog.dom.browserrange.OperaRange"], ["goog.dom.browserrange.W3cRange"], false);
goog.addDependency("dom/browserrange/w3crange.js", ["goog.dom.browserrange.W3cRange"], ["goog.array", "goog.dom", "goog.dom.NodeType", "goog.dom.RangeEndpoint", "goog.dom.browserrange.AbstractRange", "goog.string", "goog.userAgent"], false);
goog.addDependency("dom/browserrange/webkitrange.js", ["goog.dom.browserrange.WebKitRange"], ["goog.dom.RangeEndpoint", "goog.dom.browserrange.W3cRange", "goog.userAgent"], false);
goog.addDependency("dom/bufferedviewportsizemonitor.js", ["goog.dom.BufferedViewportSizeMonitor"], ["goog.asserts", "goog.async.Delay", "goog.events", "goog.events.EventTarget", "goog.events.EventType"], false);
goog.addDependency("dom/bufferedviewportsizemonitor_test.js", ["goog.dom.BufferedViewportSizeMonitorTest"], ["goog.dom.BufferedViewportSizeMonitor", "goog.dom.ViewportSizeMonitor", "goog.events", "goog.events.EventType", "goog.math.Size", "goog.testing.MockClock", "goog.testing.events", "goog.testing.events.Event", "goog.testing.jsunit"], false);
goog.addDependency("dom/classes.js", ["goog.dom.classes"], ["goog.array"], false);
goog.addDependency("dom/classes_test.js", ["goog.dom.classes_test"], ["goog.dom", "goog.dom.classes", "goog.testing.jsunit"], false);
goog.addDependency("dom/classlist.js", ["goog.dom.classlist"], ["goog.array"], false);
goog.addDependency("dom/classlist_test.js", ["goog.dom.classlist_test"], ["goog.dom", "goog.dom.classlist", "goog.testing.ExpectedFailures", "goog.testing.jsunit"], false);
goog.addDependency("dom/controlrange.js", ["goog.dom.ControlRange", "goog.dom.ControlRangeIterator"], ["goog.array", "goog.dom", "goog.dom.AbstractMultiRange", "goog.dom.AbstractRange", "goog.dom.RangeIterator", "goog.dom.RangeType", "goog.dom.SavedRange", "goog.dom.TagWalkType", "goog.dom.TextRange", "goog.iter.StopIteration", "goog.userAgent"], false);
goog.addDependency("dom/controlrange_test.js", ["goog.dom.ControlRangeTest"], ["goog.dom", "goog.dom.ControlRange", "goog.dom.RangeType", "goog.dom.TagName", "goog.dom.TextRange", "goog.testing.dom", "goog.testing.jsunit", "goog.userAgent"], false);
goog.addDependency("dom/dataset.js", ["goog.dom.dataset"], ["goog.string"], false);
goog.addDependency("dom/dataset_test.js", ["goog.dom.datasetTest"], ["goog.dom", "goog.dom.dataset", "goog.testing.jsunit"], false);
goog.addDependency("dom/dom.js", ["goog.dom", "goog.dom.Appendable", "goog.dom.DomHelper"], ["goog.array", "goog.asserts", "goog.dom.BrowserFeature", "goog.dom.NodeType", "goog.dom.TagName", "goog.math.Coordinate", "goog.math.Size", "goog.object", "goog.string", "goog.userAgent"], false);
goog.addDependency("dom/dom_test.js", ["goog.dom.dom_test"], ["goog.dom", "goog.dom.BrowserFeature", "goog.dom.DomHelper", "goog.dom.NodeType", "goog.dom.TagName", "goog.functions", "goog.object", "goog.string.Unicode", "goog.testing.PropertyReplacer", "goog.testing.asserts", "goog.userAgent", "goog.userAgent.product", "goog.userAgent.product.isVersion"], false);
goog.addDependency("dom/fontsizemonitor.js", ["goog.dom.FontSizeMonitor", "goog.dom.FontSizeMonitor.EventType"], ["goog.dom", "goog.events", "goog.events.EventTarget", "goog.events.EventType", "goog.userAgent"], false);
goog.addDependency("dom/fontsizemonitor_test.js", ["goog.dom.FontSizeMonitorTest"], ["goog.dom", "goog.dom.FontSizeMonitor", "goog.events", "goog.events.Event", "goog.testing.PropertyReplacer", "goog.testing.events", "goog.testing.jsunit", "goog.userAgent"], false);
goog.addDependency("dom/forms.js", ["goog.dom.forms"], ["goog.structs.Map"], false);
goog.addDependency("dom/forms_test.js", ["goog.dom.formsTest"], ["goog.dom", "goog.dom.forms", "goog.testing.jsunit"], false);
goog.addDependency("dom/fullscreen.js", ["goog.dom.fullscreen", "goog.dom.fullscreen.EventType"], ["goog.dom", "goog.userAgent"], false);
goog.addDependency("dom/iframe.js", ["goog.dom.iframe"], ["goog.dom", "goog.userAgent"], false);
goog.addDependency("dom/iframe_test.js", ["goog.dom.iframeTest"], ["goog.dom", "goog.dom.iframe", "goog.testing.jsunit"], false);
goog.addDependency("dom/iter.js", ["goog.dom.iter.AncestorIterator", "goog.dom.iter.ChildIterator", "goog.dom.iter.SiblingIterator"], ["goog.iter.Iterator", "goog.iter.StopIteration"], false);
goog.addDependency("dom/iter_test.js", ["goog.dom.iterTest"], ["goog.dom", "goog.dom.NodeType", "goog.dom.iter.AncestorIterator", "goog.dom.iter.ChildIterator", "goog.dom.iter.SiblingIterator", "goog.testing.dom", "goog.testing.jsunit"], false);
goog.addDependency("dom/multirange.js", ["goog.dom.MultiRange", "goog.dom.MultiRangeIterator"], ["goog.array", "goog.dom.AbstractMultiRange", "goog.dom.AbstractRange", "goog.dom.RangeIterator", "goog.dom.RangeType", "goog.dom.SavedRange", "goog.dom.TextRange", "goog.iter.StopIteration", "goog.log"], false);
goog.addDependency("dom/multirange_test.js", ["goog.dom.MultiRangeTest"], ["goog.dom", "goog.dom.MultiRange", "goog.dom.Range", "goog.iter", "goog.testing.jsunit"], false);
goog.addDependency("dom/nodeiterator.js", ["goog.dom.NodeIterator"], ["goog.dom.TagIterator"], false);
goog.addDependency("dom/nodeiterator_test.js", ["goog.dom.NodeIteratorTest"], ["goog.dom", "goog.dom.NodeIterator", "goog.testing.dom", "goog.testing.jsunit"], false);
goog.addDependency("dom/nodeoffset.js", ["goog.dom.NodeOffset"], ["goog.Disposable", "goog.dom.TagName"], false);
goog.addDependency("dom/nodeoffset_test.js", ["goog.dom.NodeOffsetTest"], ["goog.dom", "goog.dom.NodeOffset", "goog.dom.NodeType", "goog.dom.TagName", "goog.testing.jsunit"], false);
goog.addDependency("dom/nodetype.js", ["goog.dom.NodeType"], [], false);
goog.addDependency("dom/pattern/abstractpattern.js", ["goog.dom.pattern.AbstractPattern"], ["goog.dom.pattern.MatchType"], false);
goog.addDependency("dom/pattern/allchildren.js", ["goog.dom.pattern.AllChildren"], ["goog.dom.pattern.AbstractPattern", "goog.dom.pattern.MatchType"], false);
goog.addDependency("dom/pattern/callback/callback.js", ["goog.dom.pattern.callback"], ["goog.dom", "goog.dom.TagWalkType", "goog.iter"], false);
goog.addDependency("dom/pattern/callback/counter.js", ["goog.dom.pattern.callback.Counter"], [], false);
goog.addDependency("dom/pattern/callback/test.js", ["goog.dom.pattern.callback.Test"], ["goog.iter.StopIteration"], false);
goog.addDependency("dom/pattern/childmatches.js", ["goog.dom.pattern.ChildMatches"], ["goog.dom.pattern.AllChildren", "goog.dom.pattern.MatchType"], false);
goog.addDependency("dom/pattern/endtag.js", ["goog.dom.pattern.EndTag"], ["goog.dom.TagWalkType", "goog.dom.pattern.Tag"], false);
goog.addDependency("dom/pattern/fulltag.js", ["goog.dom.pattern.FullTag"], ["goog.dom.pattern.MatchType", "goog.dom.pattern.StartTag", "goog.dom.pattern.Tag"], false);
goog.addDependency("dom/pattern/matcher.js", ["goog.dom.pattern.Matcher"], ["goog.dom.TagIterator", "goog.dom.pattern.MatchType", "goog.iter"], false);
goog.addDependency("dom/pattern/matcher_test.js", ["goog.dom.pattern.matcherTest"], ["goog.dom", "goog.dom.pattern.EndTag", "goog.dom.pattern.FullTag", "goog.dom.pattern.Matcher", "goog.dom.pattern.Repeat", "goog.dom.pattern.Sequence", "goog.dom.pattern.StartTag", "goog.dom.pattern.callback.Counter", "goog.dom.pattern.callback.Test", "goog.iter.StopIteration", "goog.testing.jsunit"], false);
goog.addDependency("dom/pattern/nodetype.js", ["goog.dom.pattern.NodeType"], ["goog.dom.pattern.AbstractPattern", "goog.dom.pattern.MatchType"], false);
goog.addDependency("dom/pattern/pattern.js", ["goog.dom.pattern", "goog.dom.pattern.MatchType"], [], false);
goog.addDependency("dom/pattern/pattern_test.js", ["goog.dom.patternTest"], ["goog.dom", "goog.dom.NodeType", "goog.dom.TagWalkType", "goog.dom.pattern.AllChildren", "goog.dom.pattern.ChildMatches", "goog.dom.pattern.EndTag", "goog.dom.pattern.FullTag", "goog.dom.pattern.MatchType", "goog.dom.pattern.NodeType", "goog.dom.pattern.Repeat", "goog.dom.pattern.Sequence", "goog.dom.pattern.StartTag", "goog.dom.pattern.Text", "goog.testing.jsunit"], false);
goog.addDependency("dom/pattern/repeat.js", ["goog.dom.pattern.Repeat"], ["goog.dom.NodeType", "goog.dom.pattern.AbstractPattern", "goog.dom.pattern.MatchType"], false);
goog.addDependency("dom/pattern/sequence.js", ["goog.dom.pattern.Sequence"], ["goog.dom.NodeType", "goog.dom.pattern", "goog.dom.pattern.AbstractPattern", "goog.dom.pattern.MatchType"], false);
goog.addDependency("dom/pattern/starttag.js", ["goog.dom.pattern.StartTag"], ["goog.dom.TagWalkType", "goog.dom.pattern.Tag"], false);
goog.addDependency("dom/pattern/tag.js", ["goog.dom.pattern.Tag"], ["goog.dom.pattern", "goog.dom.pattern.AbstractPattern", "goog.dom.pattern.MatchType", "goog.object"], false);
goog.addDependency("dom/pattern/text.js", ["goog.dom.pattern.Text"], ["goog.dom.NodeType", "goog.dom.pattern", "goog.dom.pattern.AbstractPattern", "goog.dom.pattern.MatchType"], false);
goog.addDependency("dom/range.js", ["goog.dom.Range"], ["goog.dom", "goog.dom.AbstractRange", "goog.dom.BrowserFeature", "goog.dom.ControlRange", "goog.dom.MultiRange", "goog.dom.NodeType", "goog.dom.TextRange", "goog.userAgent"], false);
goog.addDependency("dom/range_test.js", ["goog.dom.RangeTest"], ["goog.dom", "goog.dom.NodeType", "goog.dom.Range", "goog.dom.RangeType", "goog.dom.TagName", "goog.dom.TextRange", "goog.dom.browserrange", "goog.testing.dom", "goog.testing.jsunit", "goog.userAgent"], false);
goog.addDependency("dom/rangeendpoint.js", ["goog.dom.RangeEndpoint"], [], false);
goog.addDependency("dom/safe.js", ["goog.dom.safe"], ["goog.html.SafeHtml", "goog.html.SafeUrl"], false);
goog.addDependency("dom/safe_test.js", ["goog.dom.safeTest"], ["goog.dom.safe", "goog.html.SafeUrl", "goog.html.testing", "goog.string.Const", "goog.testing.jsunit"], false);
goog.addDependency("dom/savedcaretrange.js", ["goog.dom.SavedCaretRange"], ["goog.array", "goog.dom", "goog.dom.SavedRange", "goog.dom.TagName", "goog.string"], false);
goog.addDependency("dom/savedcaretrange_test.js", ["goog.dom.SavedCaretRangeTest"], ["goog.dom", "goog.dom.Range", "goog.dom.SavedCaretRange", "goog.testing.dom", "goog.testing.jsunit", "goog.userAgent"], false);
goog.addDependency("dom/savedrange.js", ["goog.dom.SavedRange"], ["goog.Disposable", "goog.log"], false);
goog.addDependency("dom/savedrange_test.js", ["goog.dom.SavedRangeTest"], ["goog.dom", "goog.dom.Range", "goog.testing.jsunit", "goog.userAgent"], false);
goog.addDependency("dom/selection.js", ["goog.dom.selection"], ["goog.string", "goog.userAgent"], false);
goog.addDependency("dom/selection_test.js", ["goog.dom.selectionTest"], ["goog.dom", "goog.dom.selection", "goog.testing.jsunit", "goog.userAgent"], false);
goog.addDependency("dom/tagiterator.js", ["goog.dom.TagIterator", "goog.dom.TagWalkType"], ["goog.dom", "goog.dom.NodeType", "goog.iter.Iterator", "goog.iter.StopIteration"], false);
goog.addDependency("dom/tagiterator_test.js", ["goog.dom.TagIteratorTest"], ["goog.dom", "goog.dom.TagIterator", "goog.dom.TagWalkType", "goog.iter", "goog.iter.StopIteration", "goog.testing.dom", "goog.testing.jsunit"], false);
goog.addDependency("dom/tagname.js", ["goog.dom.TagName"], [], false);
goog.addDependency("dom/tagname_test.js", ["goog.dom.TagNameTest"], ["goog.dom.TagName", "goog.object", "goog.testing.jsunit"], false);
goog.addDependency("dom/tags.js", ["goog.dom.tags"], ["goog.object"], false);
goog.addDependency("dom/tags_test.js", ["goog.dom.tagsTest"], ["goog.dom.tags", "goog.testing.jsunit"], false);
goog.addDependency("dom/textrange.js", ["goog.dom.TextRange"], ["goog.array", "goog.dom", "goog.dom.AbstractRange", "goog.dom.RangeType", "goog.dom.SavedRange", "goog.dom.TagName", "goog.dom.TextRangeIterator", "goog.dom.browserrange", "goog.string", "goog.userAgent"], false);
goog.addDependency("dom/textrange_test.js", ["goog.dom.TextRangeTest"], ["goog.dom", "goog.dom.ControlRange", "goog.dom.Range", "goog.dom.TextRange", "goog.math.Coordinate", "goog.style", "goog.testing.ExpectedFailures", "goog.testing.jsunit", "goog.userAgent"], false);
goog.addDependency("dom/textrangeiterator.js", ["goog.dom.TextRangeIterator"], ["goog.array", "goog.dom", "goog.dom.NodeType", "goog.dom.RangeIterator", "goog.dom.TagName", "goog.iter.StopIteration"], false);
goog.addDependency("dom/textrangeiterator_test.js", ["goog.dom.TextRangeIteratorTest"], ["goog.dom", "goog.dom.TagName", "goog.dom.TextRangeIterator", "goog.iter.StopIteration", "goog.testing.dom", "goog.testing.jsunit"], false);
goog.addDependency("dom/vendor.js", ["goog.dom.vendor"], ["goog.string", "goog.userAgent"], false);
goog.addDependency("dom/vendor_test.js", ["goog.dom.vendorTest"], ["goog.array", "goog.dom.vendor", "goog.labs.userAgent.util", "goog.testing.MockUserAgent", "goog.testing.PropertyReplacer", "goog.testing.jsunit", "goog.userAgent", "goog.userAgentTestUtil"], false);
goog.addDependency("dom/viewportsizemonitor.js", ["goog.dom.ViewportSizeMonitor"], ["goog.dom", "goog.events", "goog.events.EventTarget", "goog.events.EventType", "goog.math.Size"], false);
goog.addDependency("dom/viewportsizemonitor_test.js", ["goog.dom.ViewportSizeMonitorTest"], ["goog.dom.ViewportSizeMonitor", "goog.events", "goog.events.Event", "goog.events.EventTarget", "goog.events.EventType", "goog.math.Size", "goog.testing.MockClock", "goog.testing.PropertyReplacer", "goog.testing.jsunit"], false);
goog.addDependency("dom/xml.js", ["goog.dom.xml"], ["goog.dom", "goog.dom.NodeType"], false);
goog.addDependency("dom/xml_test.js", ["goog.dom.xmlTest"], ["goog.dom.xml", "goog.testing.jsunit", "goog.userAgent"], false);
goog.addDependency("editor/browserfeature.js", ["goog.editor.BrowserFeature"], ["goog.editor.defines", "goog.userAgent", "goog.userAgent.product", "goog.userAgent.product.isVersion"], false);
goog.addDependency("editor/browserfeature_test.js", ["goog.editor.BrowserFeatureTest"], ["goog.dom", "goog.dom.Range", "goog.editor.BrowserFeature", "goog.testing.ExpectedFailures", "goog.testing.jsunit"], false);
goog.addDependency("editor/clicktoeditwrapper.js", ["goog.editor.ClickToEditWrapper"], ["goog.Disposable", "goog.dom", "goog.dom.Range", "goog.dom.TagName", "goog.editor.BrowserFeature", "goog.editor.Command", "goog.editor.Field", "goog.editor.range", "goog.events.BrowserEvent", "goog.events.EventHandler", "goog.events.EventType", "goog.log"], false);
goog.addDependency("editor/clicktoeditwrapper_test.js", ["goog.editor.ClickToEditWrapperTest"], ["goog.dom", "goog.dom.Range", "goog.editor.ClickToEditWrapper", "goog.editor.SeamlessField", "goog.testing.MockClock", "goog.testing.events", "goog.testing.jsunit", "goog.userAgent", "goog.userAgent.product"], false);
goog.addDependency("editor/command.js", ["goog.editor.Command"], [], false);
goog.addDependency("editor/contenteditablefield.js", ["goog.editor.ContentEditableField"], ["goog.asserts", "goog.editor.Field", "goog.log"], false);
goog.addDependency("editor/contenteditablefield_test.js", ["goog.editor.ContentEditableFieldTest"], ["goog.dom", "goog.editor.ContentEditableField", "goog.editor.field_test", "goog.testing.jsunit"], false);
goog.addDependency("editor/defines.js", ["goog.editor.defines"], [], false);
goog.addDependency("editor/field.js", ["goog.editor.Field", "goog.editor.Field.EventType"], ["goog.a11y.aria", "goog.a11y.aria.Role", "goog.array", "goog.asserts", "goog.async.Delay", "goog.dom", "goog.dom.Range", "goog.dom.TagName", "goog.editor.BrowserFeature", "goog.editor.Command", "goog.editor.Plugin", "goog.editor.icontent", "goog.editor.icontent.FieldFormatInfo", "goog.editor.icontent.FieldStyleInfo", "goog.editor.node", "goog.editor.range", "goog.events", "goog.events.EventHandler", "goog.events.EventTarget", 
"goog.events.EventType", "goog.events.KeyCodes", "goog.functions", "goog.log", "goog.log.Level", "goog.string", "goog.string.Unicode", "goog.style", "goog.userAgent", "goog.userAgent.product"], false);
goog.addDependency("editor/field_test.js", ["goog.editor.field_test"], ["goog.dom", "goog.dom.Range", "goog.editor.BrowserFeature", "goog.editor.Field", "goog.editor.Plugin", "goog.editor.range", "goog.events", "goog.events.BrowserEvent", "goog.events.EventType", "goog.events.KeyCodes", "goog.functions", "goog.testing.LooseMock", "goog.testing.MockClock", "goog.testing.dom", "goog.testing.events", "goog.testing.events.Event", "goog.testing.recordFunction", "goog.userAgent"], false);
goog.addDependency("editor/focus.js", ["goog.editor.focus"], ["goog.dom.selection"], false);
goog.addDependency("editor/focus_test.js", ["goog.editor.focusTest"], ["goog.dom.selection", "goog.editor.BrowserFeature", "goog.editor.focus", "goog.testing.jsunit"], false);
goog.addDependency("editor/icontent.js", ["goog.editor.icontent", "goog.editor.icontent.FieldFormatInfo", "goog.editor.icontent.FieldStyleInfo"], ["goog.dom", "goog.editor.BrowserFeature", "goog.style", "goog.userAgent"], false);
goog.addDependency("editor/icontent_test.js", ["goog.editor.icontentTest"], ["goog.dom", "goog.editor.BrowserFeature", "goog.editor.icontent", "goog.editor.icontent.FieldFormatInfo", "goog.editor.icontent.FieldStyleInfo", "goog.testing.PropertyReplacer", "goog.testing.jsunit", "goog.userAgent"], false);
goog.addDependency("editor/link.js", ["goog.editor.Link"], ["goog.array", "goog.dom", "goog.dom.NodeType", "goog.dom.Range", "goog.dom.TagName", "goog.editor.BrowserFeature", "goog.editor.Command", "goog.editor.node", "goog.editor.range", "goog.string", "goog.string.Unicode", "goog.uri.utils", "goog.uri.utils.ComponentIndex"], false);
goog.addDependency("editor/link_test.js", ["goog.editor.LinkTest"], ["goog.dom", "goog.dom.NodeType", "goog.dom.Range", "goog.dom.TagName", "goog.editor.Link", "goog.testing.jsunit", "goog.userAgent"], false);
goog.addDependency("editor/node.js", ["goog.editor.node"], ["goog.dom", "goog.dom.NodeType", "goog.dom.TagName", "goog.dom.iter.ChildIterator", "goog.dom.iter.SiblingIterator", "goog.iter", "goog.object", "goog.string", "goog.string.Unicode", "goog.userAgent"], false);
goog.addDependency("editor/node_test.js", ["goog.editor.nodeTest"], ["goog.array", "goog.dom", "goog.dom.NodeType", "goog.dom.TagName", "goog.editor.node", "goog.style", "goog.testing.ExpectedFailures", "goog.testing.dom", "goog.testing.jsunit", "goog.userAgent"], false);
goog.addDependency("editor/plugin.js", ["goog.editor.Plugin"], ["goog.events.EventTarget", "goog.functions", "goog.log", "goog.object", "goog.reflect", "goog.userAgent"], false);
goog.addDependency("editor/plugin_test.js", ["goog.editor.PluginTest"], ["goog.editor.Field", "goog.editor.Plugin", "goog.functions", "goog.testing.StrictMock", "goog.testing.jsunit", "goog.userAgent"], false);
goog.addDependency("editor/plugins/abstractbubbleplugin.js", ["goog.editor.plugins.AbstractBubblePlugin"], ["goog.array", "goog.dom", "goog.dom.NodeType", "goog.dom.Range", "goog.dom.TagName", "goog.dom.classlist", "goog.editor.Plugin", "goog.editor.style", "goog.events", "goog.events.EventHandler", "goog.events.EventType", "goog.events.KeyCodes", "goog.events.actionEventWrapper", "goog.functions", "goog.string.Unicode", "goog.ui.Component", "goog.ui.editor.Bubble", "goog.userAgent"], false);
goog.addDependency("editor/plugins/abstractbubbleplugin_test.js", ["goog.editor.plugins.AbstractBubblePluginTest"], ["goog.dom", "goog.editor.plugins.AbstractBubblePlugin", "goog.events.BrowserEvent", "goog.events.EventType", "goog.events.KeyCodes", "goog.functions", "goog.style", "goog.testing.editor.FieldMock", "goog.testing.editor.TestHelper", "goog.testing.events", "goog.testing.events.Event", "goog.testing.jsunit", "goog.ui.editor.Bubble", "goog.userAgent"], false);
goog.addDependency("editor/plugins/abstractdialogplugin.js", ["goog.editor.plugins.AbstractDialogPlugin", "goog.editor.plugins.AbstractDialogPlugin.EventType"], ["goog.dom", "goog.dom.Range", "goog.editor.Field", "goog.editor.Plugin", "goog.editor.range", "goog.events", "goog.ui.editor.AbstractDialog"], false);
goog.addDependency("editor/plugins/abstractdialogplugin_test.js", ["goog.editor.plugins.AbstractDialogPluginTest"], ["goog.dom.SavedRange", "goog.editor.Field", "goog.editor.plugins.AbstractDialogPlugin", "goog.events.Event", "goog.events.EventHandler", "goog.functions", "goog.testing.MockClock", "goog.testing.MockControl", "goog.testing.PropertyReplacer", "goog.testing.editor.FieldMock", "goog.testing.editor.TestHelper", "goog.testing.events", "goog.testing.jsunit", "goog.testing.mockmatchers.ArgumentMatcher", 
"goog.ui.editor.AbstractDialog", "goog.userAgent"], false);
goog.addDependency("editor/plugins/abstracttabhandler.js", ["goog.editor.plugins.AbstractTabHandler"], ["goog.editor.Plugin", "goog.events.KeyCodes", "goog.userAgent"], false);
goog.addDependency("editor/plugins/abstracttabhandler_test.js", ["goog.editor.plugins.AbstractTabHandlerTest"], ["goog.editor.Field", "goog.editor.plugins.AbstractTabHandler", "goog.events.BrowserEvent", "goog.events.KeyCodes", "goog.testing.StrictMock", "goog.testing.editor.FieldMock", "goog.testing.jsunit", "goog.userAgent"], false);
goog.addDependency("editor/plugins/basictextformatter.js", ["goog.editor.plugins.BasicTextFormatter", "goog.editor.plugins.BasicTextFormatter.COMMAND"], ["goog.array", "goog.dom", "goog.dom.NodeType", "goog.dom.Range", "goog.dom.TagName", "goog.editor.BrowserFeature", "goog.editor.Command", "goog.editor.Link", "goog.editor.Plugin", "goog.editor.node", "goog.editor.range", "goog.editor.style", "goog.iter", "goog.iter.StopIteration", "goog.log", "goog.object", "goog.string", "goog.string.Unicode", 
"goog.style", "goog.ui.editor.messages", "goog.userAgent"], false);
goog.addDependency("editor/plugins/basictextformatter_test.js", ["goog.editor.plugins.BasicTextFormatterTest"], ["goog.dom", "goog.dom.Range", "goog.dom.TagName", "goog.editor.BrowserFeature", "goog.editor.Command", "goog.editor.Field", "goog.editor.Plugin", "goog.editor.plugins.BasicTextFormatter", "goog.object", "goog.style", "goog.testing.ExpectedFailures", "goog.testing.LooseMock", "goog.testing.PropertyReplacer", "goog.testing.editor.FieldMock", "goog.testing.editor.TestHelper", "goog.testing.jsunit", 
"goog.testing.mockmatchers", "goog.userAgent"], false);
goog.addDependency("editor/plugins/blockquote.js", ["goog.editor.plugins.Blockquote"], ["goog.dom", "goog.dom.NodeType", "goog.dom.TagName", "goog.dom.classlist", "goog.editor.BrowserFeature", "goog.editor.Command", "goog.editor.Plugin", "goog.editor.node", "goog.functions", "goog.log"], false);
goog.addDependency("editor/plugins/blockquote_test.js", ["goog.editor.plugins.BlockquoteTest"], ["goog.dom", "goog.dom.Range", "goog.dom.TagName", "goog.editor.BrowserFeature", "goog.editor.plugins.Blockquote", "goog.testing.editor.FieldMock", "goog.testing.editor.TestHelper", "goog.testing.jsunit"], false);
goog.addDependency("editor/plugins/emoticons.js", ["goog.editor.plugins.Emoticons"], ["goog.dom.TagName", "goog.editor.Plugin", "goog.editor.range", "goog.functions", "goog.ui.emoji.Emoji", "goog.userAgent"], false);
goog.addDependency("editor/plugins/emoticons_test.js", ["goog.editor.plugins.EmoticonsTest"], ["goog.Uri", "goog.array", "goog.dom", "goog.dom.TagName", "goog.editor.Field", "goog.editor.plugins.Emoticons", "goog.testing.jsunit", "goog.ui.emoji.Emoji", "goog.userAgent"], false);
goog.addDependency("editor/plugins/enterhandler.js", ["goog.editor.plugins.EnterHandler"], ["goog.dom", "goog.dom.NodeOffset", "goog.dom.NodeType", "goog.dom.Range", "goog.dom.TagName", "goog.editor.BrowserFeature", "goog.editor.Plugin", "goog.editor.node", "goog.editor.plugins.Blockquote", "goog.editor.range", "goog.editor.style", "goog.events.KeyCodes", "goog.functions", "goog.object", "goog.string", "goog.userAgent"], false);
goog.addDependency("editor/plugins/enterhandler_test.js", ["goog.editor.plugins.EnterHandlerTest"], ["goog.dom", "goog.dom.NodeType", "goog.dom.Range", "goog.dom.TagName", "goog.editor.BrowserFeature", "goog.editor.Field", "goog.editor.Plugin", "goog.editor.plugins.Blockquote", "goog.editor.plugins.EnterHandler", "goog.editor.range", "goog.events", "goog.events.KeyCodes", "goog.testing.ExpectedFailures", "goog.testing.MockClock", "goog.testing.dom", "goog.testing.editor.TestHelper", "goog.testing.events", 
"goog.testing.jsunit", "goog.userAgent"], false);
goog.addDependency("editor/plugins/firststrong.js", ["goog.editor.plugins.FirstStrong"], ["goog.dom.NodeType", "goog.dom.TagIterator", "goog.dom.TagName", "goog.editor.Command", "goog.editor.Plugin", "goog.editor.node", "goog.editor.range", "goog.i18n.bidi", "goog.i18n.uChar", "goog.iter", "goog.userAgent"], false);
goog.addDependency("editor/plugins/firststrong_test.js", ["goog.editor.plugins.FirstStrongTest"], ["goog.dom.Range", "goog.editor.Command", "goog.editor.Field", "goog.editor.plugins.FirstStrong", "goog.editor.range", "goog.events.KeyCodes", "goog.testing.editor.TestHelper", "goog.testing.events", "goog.testing.jsunit", "goog.userAgent"], false);
goog.addDependency("editor/plugins/headerformatter.js", ["goog.editor.plugins.HeaderFormatter"], ["goog.editor.Command", "goog.editor.Plugin", "goog.userAgent"], false);
goog.addDependency("editor/plugins/headerformatter_test.js", ["goog.editor.plugins.HeaderFormatterTest"], ["goog.dom", "goog.editor.Command", "goog.editor.plugins.BasicTextFormatter", "goog.editor.plugins.HeaderFormatter", "goog.events.BrowserEvent", "goog.testing.LooseMock", "goog.testing.editor.FieldMock", "goog.testing.editor.TestHelper", "goog.testing.jsunit", "goog.userAgent"], false);
goog.addDependency("editor/plugins/linkbubble.js", ["goog.editor.plugins.LinkBubble", "goog.editor.plugins.LinkBubble.Action"], ["goog.array", "goog.dom", "goog.dom.TagName", "goog.editor.Command", "goog.editor.Link", "goog.editor.plugins.AbstractBubblePlugin", "goog.editor.range", "goog.functions", "goog.string", "goog.style", "goog.ui.editor.messages", "goog.uri.utils", "goog.window"], false);
goog.addDependency("editor/plugins/linkbubble_test.js", ["goog.editor.plugins.LinkBubbleTest"], ["goog.dom", "goog.dom.Range", "goog.dom.TagName", "goog.editor.Command", "goog.editor.Link", "goog.editor.plugins.LinkBubble", "goog.events.BrowserEvent", "goog.events.Event", "goog.events.EventType", "goog.string", "goog.style", "goog.testing.FunctionMock", "goog.testing.PropertyReplacer", "goog.testing.editor.FieldMock", "goog.testing.editor.TestHelper", "goog.testing.events", "goog.testing.jsunit", 
"goog.userAgent"], false);
goog.addDependency("editor/plugins/linkdialogplugin.js", ["goog.editor.plugins.LinkDialogPlugin"], ["goog.array", "goog.dom", "goog.editor.Command", "goog.editor.plugins.AbstractDialogPlugin", "goog.events.EventHandler", "goog.functions", "goog.ui.editor.AbstractDialog", "goog.ui.editor.LinkDialog", "goog.uri.utils"], false);
goog.addDependency("editor/plugins/linkdialogplugin_test.js", ["goog.ui.editor.plugins.LinkDialogTest"], ["goog.dom", "goog.dom.DomHelper", "goog.dom.NodeType", "goog.dom.TagName", "goog.editor.BrowserFeature", "goog.editor.Command", "goog.editor.Field", "goog.editor.Link", "goog.editor.plugins.LinkDialogPlugin", "goog.string", "goog.string.Unicode", "goog.testing.MockControl", "goog.testing.editor.FieldMock", "goog.testing.editor.TestHelper", "goog.testing.editor.dom", "goog.testing.events", "goog.testing.jsunit", 
"goog.testing.mockmatchers", "goog.ui.editor.AbstractDialog", "goog.ui.editor.LinkDialog", "goog.userAgent"], false);
goog.addDependency("editor/plugins/linkshortcutplugin.js", ["goog.editor.plugins.LinkShortcutPlugin"], ["goog.editor.Command", "goog.editor.Plugin"], false);
goog.addDependency("editor/plugins/linkshortcutplugin_test.js", ["goog.editor.plugins.LinkShortcutPluginTest"], ["goog.dom", "goog.editor.Field", "goog.editor.plugins.BasicTextFormatter", "goog.editor.plugins.LinkBubble", "goog.editor.plugins.LinkShortcutPlugin", "goog.events.KeyCodes", "goog.testing.PropertyReplacer", "goog.testing.dom", "goog.testing.events", "goog.testing.jsunit"], false);
goog.addDependency("editor/plugins/listtabhandler.js", ["goog.editor.plugins.ListTabHandler"], ["goog.dom", "goog.dom.TagName", "goog.editor.Command", "goog.editor.plugins.AbstractTabHandler", "goog.iter"], false);
goog.addDependency("editor/plugins/listtabhandler_test.js", ["goog.editor.plugins.ListTabHandlerTest"], ["goog.dom", "goog.editor.Command", "goog.editor.plugins.ListTabHandler", "goog.events.BrowserEvent", "goog.events.KeyCodes", "goog.functions", "goog.testing.StrictMock", "goog.testing.editor.FieldMock", "goog.testing.editor.TestHelper", "goog.testing.jsunit"], false);
goog.addDependency("editor/plugins/loremipsum.js", ["goog.editor.plugins.LoremIpsum"], ["goog.asserts", "goog.dom", "goog.editor.Command", "goog.editor.Field", "goog.editor.Plugin", "goog.editor.node", "goog.functions", "goog.userAgent"], false);
goog.addDependency("editor/plugins/loremipsum_test.js", ["goog.editor.plugins.LoremIpsumTest"], ["goog.dom", "goog.editor.Command", "goog.editor.Field", "goog.editor.plugins.LoremIpsum", "goog.string.Unicode", "goog.testing.jsunit", "goog.userAgent"], false);
goog.addDependency("editor/plugins/removeformatting.js", ["goog.editor.plugins.RemoveFormatting"], ["goog.dom", "goog.dom.NodeType", "goog.dom.Range", "goog.dom.TagName", "goog.editor.BrowserFeature", "goog.editor.Plugin", "goog.editor.node", "goog.editor.range", "goog.string", "goog.userAgent"], false);
goog.addDependency("editor/plugins/removeformatting_test.js", ["goog.editor.plugins.RemoveFormattingTest"], ["goog.dom", "goog.dom.Range", "goog.dom.TagName", "goog.editor.BrowserFeature", "goog.editor.plugins.RemoveFormatting", "goog.string", "goog.testing.ExpectedFailures", "goog.testing.dom", "goog.testing.editor.FieldMock", "goog.testing.editor.TestHelper", "goog.testing.jsunit", "goog.userAgent"], false);
goog.addDependency("editor/plugins/spacestabhandler.js", ["goog.editor.plugins.SpacesTabHandler"], ["goog.dom.TagName", "goog.editor.plugins.AbstractTabHandler", "goog.editor.range"], false);
goog.addDependency("editor/plugins/spacestabhandler_test.js", ["goog.editor.plugins.SpacesTabHandlerTest"], ["goog.dom", "goog.dom.Range", "goog.editor.plugins.SpacesTabHandler", "goog.events.BrowserEvent", "goog.events.KeyCodes", "goog.functions", "goog.testing.StrictMock", "goog.testing.editor.FieldMock", "goog.testing.editor.TestHelper", "goog.testing.jsunit"], false);
goog.addDependency("editor/plugins/tableeditor.js", ["goog.editor.plugins.TableEditor"], ["goog.array", "goog.dom", "goog.dom.Range", "goog.dom.TagName", "goog.editor.Plugin", "goog.editor.Table", "goog.editor.node", "goog.editor.range", "goog.object", "goog.userAgent"], false);
goog.addDependency("editor/plugins/tableeditor_test.js", ["goog.editor.plugins.TableEditorTest"], ["goog.dom", "goog.dom.Range", "goog.editor.plugins.TableEditor", "goog.object", "goog.string", "goog.testing.ExpectedFailures", "goog.testing.JsUnitException", "goog.testing.editor.FieldMock", "goog.testing.editor.TestHelper", "goog.testing.jsunit", "goog.userAgent"], false);
goog.addDependency("editor/plugins/tagonenterhandler.js", ["goog.editor.plugins.TagOnEnterHandler"], ["goog.dom", "goog.dom.NodeType", "goog.dom.Range", "goog.dom.TagName", "goog.editor.Command", "goog.editor.node", "goog.editor.plugins.EnterHandler", "goog.editor.range", "goog.editor.style", "goog.events.KeyCodes", "goog.functions", "goog.string.Unicode", "goog.style", "goog.userAgent"], false);
goog.addDependency("editor/plugins/tagonenterhandler_test.js", ["goog.editor.plugins.TagOnEnterHandlerTest"], ["goog.dom", "goog.dom.NodeType", "goog.dom.Range", "goog.dom.TagName", "goog.editor.BrowserFeature", "goog.editor.Field", "goog.editor.Plugin", "goog.editor.plugins.TagOnEnterHandler", "goog.events.KeyCodes", "goog.string.Unicode", "goog.testing.dom", "goog.testing.editor.TestHelper", "goog.testing.events", "goog.testing.jsunit", "goog.userAgent"], false);
goog.addDependency("editor/plugins/undoredo.js", ["goog.editor.plugins.UndoRedo"], ["goog.dom", "goog.dom.NodeOffset", "goog.dom.Range", "goog.editor.BrowserFeature", "goog.editor.Command", "goog.editor.Field", "goog.editor.Plugin", "goog.editor.node", "goog.editor.plugins.UndoRedoManager", "goog.editor.plugins.UndoRedoState", "goog.events", "goog.events.EventHandler", "goog.log", "goog.object"], false);
goog.addDependency("editor/plugins/undoredo_test.js", ["goog.editor.plugins.UndoRedoTest"], ["goog.array", "goog.dom", "goog.dom.browserrange", "goog.editor.Field", "goog.editor.plugins.LoremIpsum", "goog.editor.plugins.UndoRedo", "goog.events", "goog.functions", "goog.testing.MockClock", "goog.testing.PropertyReplacer", "goog.testing.StrictMock", "goog.testing.jsunit"], false);
goog.addDependency("editor/plugins/undoredomanager.js", ["goog.editor.plugins.UndoRedoManager", "goog.editor.plugins.UndoRedoManager.EventType"], ["goog.editor.plugins.UndoRedoState", "goog.events", "goog.events.EventTarget"], false);
goog.addDependency("editor/plugins/undoredomanager_test.js", ["goog.editor.plugins.UndoRedoManagerTest"], ["goog.editor.plugins.UndoRedoManager", "goog.editor.plugins.UndoRedoState", "goog.events", "goog.testing.StrictMock", "goog.testing.jsunit"], false);
goog.addDependency("editor/plugins/undoredostate.js", ["goog.editor.plugins.UndoRedoState"], ["goog.events.EventTarget"], false);
goog.addDependency("editor/plugins/undoredostate_test.js", ["goog.editor.plugins.UndoRedoStateTest"], ["goog.editor.plugins.UndoRedoState", "goog.testing.jsunit"], false);
goog.addDependency("editor/range.js", ["goog.editor.range", "goog.editor.range.Point"], ["goog.array", "goog.dom", "goog.dom.NodeType", "goog.dom.Range", "goog.dom.RangeEndpoint", "goog.dom.SavedCaretRange", "goog.editor.node", "goog.editor.style", "goog.iter", "goog.userAgent"], false);
goog.addDependency("editor/range_test.js", ["goog.editor.rangeTest"], ["goog.dom", "goog.dom.Range", "goog.dom.TagName", "goog.editor.range", "goog.editor.range.Point", "goog.string", "goog.testing.dom", "goog.testing.jsunit", "goog.userAgent"], false);
goog.addDependency("editor/seamlessfield.js", ["goog.editor.SeamlessField"], ["goog.cssom.iframe.style", "goog.dom", "goog.dom.Range", "goog.dom.TagName", "goog.editor.BrowserFeature", "goog.editor.Field", "goog.editor.icontent", "goog.editor.icontent.FieldFormatInfo", "goog.editor.icontent.FieldStyleInfo", "goog.editor.node", "goog.events", "goog.events.EventType", "goog.log", "goog.style"], false);
goog.addDependency("editor/seamlessfield_test.js", ["goog.editor.seamlessfield_test"], ["goog.dom", "goog.dom.DomHelper", "goog.dom.Range", "goog.editor.BrowserFeature", "goog.editor.Field", "goog.editor.SeamlessField", "goog.events", "goog.functions", "goog.style", "goog.testing.MockClock", "goog.testing.MockRange", "goog.testing.jsunit"], false);
goog.addDependency("editor/style.js", ["goog.editor.style"], ["goog.array", "goog.dom", "goog.dom.NodeType", "goog.dom.TagName", "goog.editor.BrowserFeature", "goog.events.EventType", "goog.object", "goog.style", "goog.userAgent"], false);
goog.addDependency("editor/style_test.js", ["goog.editor.styleTest"], ["goog.dom", "goog.dom.TagName", "goog.editor.BrowserFeature", "goog.editor.style", "goog.events.EventHandler", "goog.events.EventType", "goog.style", "goog.testing.LooseMock", "goog.testing.jsunit", "goog.testing.mockmatchers"], false);
goog.addDependency("editor/table.js", ["goog.editor.Table", "goog.editor.TableCell", "goog.editor.TableRow"], ["goog.dom", "goog.dom.DomHelper", "goog.dom.NodeType", "goog.dom.TagName", "goog.log", "goog.string.Unicode", "goog.style"], false);
goog.addDependency("editor/table_test.js", ["goog.editor.TableTest"], ["goog.dom", "goog.editor.Table", "goog.testing.jsunit", "goog.userAgent"], false);
goog.addDependency("events/actioneventwrapper.js", ["goog.events.actionEventWrapper"], ["goog.a11y.aria", "goog.a11y.aria.Role", "goog.dom", "goog.events", "goog.events.EventHandler", "goog.events.EventType", "goog.events.EventWrapper", "goog.events.KeyCodes", "goog.userAgent"], false);
goog.addDependency("events/actioneventwrapper_test.js", ["goog.events.actionEventWrapperTest"], ["goog.a11y.aria", "goog.a11y.aria.Role", "goog.events", "goog.events.EventHandler", "goog.events.KeyCodes", "goog.events.actionEventWrapper", "goog.testing.events", "goog.testing.jsunit"], false);
goog.addDependency("events/actionhandler.js", ["goog.events.ActionEvent", "goog.events.ActionHandler", "goog.events.ActionHandler.EventType", "goog.events.BeforeActionEvent"], ["goog.events", "goog.events.BrowserEvent", "goog.events.EventTarget", "goog.events.EventType", "goog.events.KeyCodes", "goog.userAgent"], false);
goog.addDependency("events/actionhandler_test.js", ["goog.events.ActionHandlerTest"], ["goog.dom", "goog.events", "goog.events.ActionHandler", "goog.testing.events", "goog.testing.jsunit"], false);
goog.addDependency("events/browserevent.js", ["goog.events.BrowserEvent", "goog.events.BrowserEvent.MouseButton"], ["goog.events.BrowserFeature", "goog.events.Event", "goog.events.EventType", "goog.reflect", "goog.userAgent"], false);
goog.addDependency("events/browserevent_test.js", ["goog.events.BrowserEventTest"], ["goog.events.BrowserEvent", "goog.events.BrowserFeature", "goog.testing.PropertyReplacer", "goog.testing.jsunit", "goog.userAgent"], false);
goog.addDependency("events/browserfeature.js", ["goog.events.BrowserFeature"], ["goog.userAgent"], false);
goog.addDependency("events/event.js", ["goog.events.Event", "goog.events.EventLike"], ["goog.Disposable", "goog.events.EventId"], false);
goog.addDependency("events/event_test.js", ["goog.events.EventTest"], ["goog.events.Event", "goog.events.EventId", "goog.events.EventTarget", "goog.testing.jsunit"], false);
goog.addDependency("events/eventhandler.js", ["goog.events.EventHandler"], ["goog.Disposable", "goog.events", "goog.object"], false);
goog.addDependency("events/eventhandler_test.js", ["goog.events.EventHandlerTest"], ["goog.events", "goog.events.EventHandler", "goog.events.EventTarget", "goog.testing.jsunit", "goog.testing.recordFunction"], false);
goog.addDependency("events/eventid.js", ["goog.events.EventId"], [], false);
goog.addDependency("events/events.js", ["goog.events", "goog.events.CaptureSimulationMode", "goog.events.Key", "goog.events.ListenableType"], ["goog.asserts", "goog.debug.entryPointRegistry", "goog.events.BrowserEvent", "goog.events.BrowserFeature", "goog.events.Listenable", "goog.events.ListenerMap"], false);
goog.addDependency("events/events_test.js", ["goog.eventsTest"], ["goog.asserts.AssertionError", "goog.debug.EntryPointMonitor", "goog.debug.ErrorHandler", "goog.debug.entryPointRegistry", "goog.dom", "goog.events", "goog.events.BrowserFeature", "goog.events.CaptureSimulationMode", "goog.events.Event", "goog.events.EventTarget", "goog.events.EventType", "goog.events.Listener", "goog.functions", "goog.testing.PropertyReplacer", "goog.testing.jsunit", "goog.testing.recordFunction"], false);
goog.addDependency("events/eventtarget.js", ["goog.events.EventTarget"], ["goog.Disposable", "goog.asserts", "goog.events", "goog.events.Event", "goog.events.Listenable", "goog.events.ListenerMap", "goog.object"], false);
goog.addDependency("events/eventtarget_test.js", ["goog.events.EventTargetTest"], ["goog.events.EventTarget", "goog.events.Listenable", "goog.events.eventTargetTester", "goog.events.eventTargetTester.KeyType", "goog.events.eventTargetTester.UnlistenReturnType", "goog.testing.jsunit"], false);
goog.addDependency("events/eventtarget_via_googevents_test.js", ["goog.events.EventTargetGoogEventsTest"], ["goog.events", "goog.events.EventTarget", "goog.events.eventTargetTester", "goog.events.eventTargetTester.KeyType", "goog.events.eventTargetTester.UnlistenReturnType", "goog.testing", "goog.testing.jsunit"], false);
goog.addDependency("events/eventtarget_via_w3cinterface_test.js", ["goog.events.EventTargetW3CTest"], ["goog.events.EventTarget", "goog.events.eventTargetTester", "goog.events.eventTargetTester.KeyType", "goog.events.eventTargetTester.UnlistenReturnType", "goog.testing.jsunit"], false);
goog.addDependency("events/eventtargettester.js", ["goog.events.eventTargetTester", "goog.events.eventTargetTester.KeyType", "goog.events.eventTargetTester.UnlistenReturnType"], ["goog.array", "goog.events", "goog.events.Event", "goog.events.EventTarget", "goog.testing.asserts", "goog.testing.recordFunction"], false);
goog.addDependency("events/eventtype.js", ["goog.events.EventType"], ["goog.userAgent"], false);
goog.addDependency("events/eventwrapper.js", ["goog.events.EventWrapper"], [], false);
goog.addDependency("events/filedrophandler.js", ["goog.events.FileDropHandler", "goog.events.FileDropHandler.EventType"], ["goog.array", "goog.dom", "goog.events.BrowserEvent", "goog.events.EventHandler", "goog.events.EventTarget", "goog.events.EventType", "goog.log", "goog.log.Level"], false);
goog.addDependency("events/filedrophandler_test.js", ["goog.events.FileDropHandlerTest"], ["goog.events", "goog.events.BrowserEvent", "goog.events.EventTarget", "goog.events.EventType", "goog.events.FileDropHandler", "goog.testing.jsunit"], false);
goog.addDependency("events/focushandler.js", ["goog.events.FocusHandler", "goog.events.FocusHandler.EventType"], ["goog.events", "goog.events.BrowserEvent", "goog.events.EventTarget", "goog.userAgent"], false);
goog.addDependency("events/imehandler.js", ["goog.events.ImeHandler", "goog.events.ImeHandler.Event", "goog.events.ImeHandler.EventType"], ["goog.events.Event", "goog.events.EventHandler", "goog.events.EventTarget", "goog.events.EventType", "goog.events.KeyCodes", "goog.userAgent"], false);
goog.addDependency("events/imehandler_test.js", ["goog.events.ImeHandlerTest"], ["goog.array", "goog.dom", "goog.events", "goog.events.ImeHandler", "goog.events.KeyCodes", "goog.object", "goog.string", "goog.testing.PropertyReplacer", "goog.testing.events", "goog.testing.events.Event", "goog.testing.jsunit", "goog.userAgent"], false);
goog.addDependency("events/inputhandler.js", ["goog.events.InputHandler", "goog.events.InputHandler.EventType"], ["goog.Timer", "goog.dom", "goog.events.BrowserEvent", "goog.events.EventHandler", "goog.events.EventTarget", "goog.events.KeyCodes", "goog.userAgent"], false);
goog.addDependency("events/inputhandler_test.js", ["goog.events.InputHandlerTest"], ["goog.dom", "goog.events.EventHandler", "goog.events.EventType", "goog.events.InputHandler", "goog.events.KeyCodes", "goog.testing.events", "goog.testing.events.Event", "goog.testing.jsunit", "goog.testing.recordFunction", "goog.userAgent"], false);
goog.addDependency("events/keycodes.js", ["goog.events.KeyCodes"], ["goog.userAgent"], false);
goog.addDependency("events/keycodes_test.js", ["goog.events.KeyCodesTest"], ["goog.events.BrowserEvent", "goog.events.KeyCodes", "goog.object", "goog.testing.PropertyReplacer", "goog.testing.jsunit", "goog.userAgent"], false);
goog.addDependency("events/keyhandler.js", ["goog.events.KeyEvent", "goog.events.KeyHandler", "goog.events.KeyHandler.EventType"], ["goog.events", "goog.events.BrowserEvent", "goog.events.EventTarget", "goog.events.EventType", "goog.events.KeyCodes", "goog.userAgent"], false);
goog.addDependency("events/keyhandler_test.js", ["goog.events.KeyEventTest"], ["goog.dom", "goog.events", "goog.events.BrowserEvent", "goog.events.EventType", "goog.events.KeyCodes", "goog.events.KeyHandler", "goog.testing.events", "goog.testing.jsunit", "goog.userAgent"], false);
goog.addDependency("events/keynames.js", ["goog.events.KeyNames"], [], false);
goog.addDependency("events/listenable.js", ["goog.events.Listenable", "goog.events.ListenableKey"], ["goog.events.EventId"], false);
goog.addDependency("events/listenable_test.js", ["goog.events.ListenableTest"], ["goog.events.Listenable", "goog.testing.jsunit"], false);
goog.addDependency("events/listener.js", ["goog.events.Listener"], ["goog.events.ListenableKey"], false);
goog.addDependency("events/listenermap.js", ["goog.events.ListenerMap"], ["goog.array", "goog.events.Listener", "goog.object"], false);
goog.addDependency("events/listenermap_test.js", ["goog.events.ListenerMapTest"], ["goog.dispose", "goog.events", "goog.events.EventId", "goog.events.EventTarget", "goog.events.ListenerMap", "goog.testing.jsunit"], false);
goog.addDependency("events/mousewheelhandler.js", ["goog.events.MouseWheelEvent", "goog.events.MouseWheelHandler", "goog.events.MouseWheelHandler.EventType"], ["goog.dom", "goog.events", "goog.events.BrowserEvent", "goog.events.EventTarget", "goog.math", "goog.style", "goog.userAgent"], false);
goog.addDependency("events/mousewheelhandler_test.js", ["goog.events.MouseWheelHandlerTest"], ["goog.dom", "goog.events", "goog.events.BrowserEvent", "goog.events.MouseWheelEvent", "goog.events.MouseWheelHandler", "goog.functions", "goog.string", "goog.testing.PropertyReplacer", "goog.testing.events", "goog.testing.jsunit", "goog.userAgent"], false);
goog.addDependency("events/onlinehandler.js", ["goog.events.OnlineHandler", "goog.events.OnlineHandler.EventType"], ["goog.Timer", "goog.events.BrowserFeature", "goog.events.EventHandler", "goog.events.EventTarget", "goog.events.EventType", "goog.net.NetworkStatusMonitor"], false);
goog.addDependency("events/onlinelistener_test.js", ["goog.events.OnlineHandlerTest"], ["goog.events", "goog.events.BrowserFeature", "goog.events.Event", "goog.events.EventHandler", "goog.events.OnlineHandler", "goog.net.NetworkStatusMonitor", "goog.testing.MockClock", "goog.testing.PropertyReplacer", "goog.testing.jsunit", "goog.testing.recordFunction"], false);
goog.addDependency("events/pastehandler.js", ["goog.events.PasteHandler", "goog.events.PasteHandler.EventType", "goog.events.PasteHandler.State"], ["goog.Timer", "goog.async.ConditionalDelay", "goog.events.BrowserEvent", "goog.events.EventHandler", "goog.events.EventTarget", "goog.events.EventType", "goog.events.KeyCodes", "goog.log", "goog.userAgent"], false);
goog.addDependency("events/pastehandler_test.js", ["goog.events.PasteHandlerTest"], ["goog.dom", "goog.events", "goog.events.BrowserEvent", "goog.events.EventTarget", "goog.events.EventType", "goog.events.KeyCodes", "goog.events.PasteHandler", "goog.testing.MockClock", "goog.testing.MockUserAgent", "goog.testing.jsunit", "goog.userAgent"], false);
goog.addDependency("events/wheelevent.js", ["goog.events.WheelEvent"], ["goog.asserts", "goog.events.BrowserEvent"], false);
goog.addDependency("events/wheelhandler.js", ["goog.events.WheelHandler"], ["goog.dom", "goog.events", "goog.events.EventTarget", "goog.events.WheelEvent", "goog.style", "goog.userAgent", "goog.userAgent.product", "goog.userAgent.product.isVersion"], false);
goog.addDependency("events/wheelhandler_test.js", ["goog.events.WheelHandlerTest"], ["goog.dom", "goog.events", "goog.events.BrowserEvent", "goog.events.WheelEvent", "goog.events.WheelHandler", "goog.string", "goog.testing.PropertyReplacer", "goog.testing.events", "goog.testing.jsunit", "goog.userAgent", "goog.userAgent.product"], false);
goog.addDependency("format/emailaddress.js", ["goog.format.EmailAddress"], ["goog.string"], false);
goog.addDependency("format/emailaddress_test.js", ["goog.format.EmailAddressTest"], ["goog.array", "goog.format.EmailAddress", "goog.testing.jsunit"], false);
goog.addDependency("format/format.js", ["goog.format"], ["goog.i18n.GraphemeBreak", "goog.string", "goog.userAgent"], false);
goog.addDependency("format/format_test.js", ["goog.formatTest"], ["goog.dom", "goog.format", "goog.string", "goog.testing.PropertyReplacer", "goog.testing.jsunit"], false);
goog.addDependency("format/htmlprettyprinter.js", ["goog.format.HtmlPrettyPrinter", "goog.format.HtmlPrettyPrinter.Buffer"], ["goog.object", "goog.string.StringBuffer"], false);
goog.addDependency("format/htmlprettyprinter_test.js", ["goog.format.HtmlPrettyPrinterTest"], ["goog.format.HtmlPrettyPrinter", "goog.testing.MockClock", "goog.testing.jsunit"], false);
goog.addDependency("format/internationalizedemailaddress.js", ["goog.format.InternationalizedEmailAddress"], ["goog.format.EmailAddress", "goog.string"], false);
goog.addDependency("format/internationalizedemailaddress_test.js", ["goog.format.InternationalizedEmailAddressTest"], ["goog.array", "goog.format.InternationalizedEmailAddress", "goog.testing.jsunit"], false);
goog.addDependency("format/jsonprettyprinter.js", ["goog.format.JsonPrettyPrinter", "goog.format.JsonPrettyPrinter.HtmlDelimiters", "goog.format.JsonPrettyPrinter.TextDelimiters"], ["goog.json", "goog.json.Serializer", "goog.string", "goog.string.StringBuffer", "goog.string.format"], false);
goog.addDependency("format/jsonprettyprinter_test.js", ["goog.format.JsonPrettyPrinterTest"], ["goog.format.JsonPrettyPrinter", "goog.testing.jsunit"], false);
goog.addDependency("fs/entry.js", ["goog.fs.DirectoryEntry", "goog.fs.DirectoryEntry.Behavior", "goog.fs.Entry", "goog.fs.FileEntry"], [], false);
goog.addDependency("fs/entryimpl.js", ["goog.fs.DirectoryEntryImpl", "goog.fs.EntryImpl", "goog.fs.FileEntryImpl"], ["goog.array", "goog.async.Deferred", "goog.fs.DirectoryEntry", "goog.fs.Entry", "goog.fs.Error", "goog.fs.FileEntry", "goog.fs.FileWriter", "goog.functions", "goog.string"], false);
goog.addDependency("fs/error.js", ["goog.fs.Error", "goog.fs.Error.ErrorCode"], ["goog.debug.Error", "goog.object", "goog.string"], false);
goog.addDependency("fs/filereader.js", ["goog.fs.FileReader", "goog.fs.FileReader.EventType", "goog.fs.FileReader.ReadyState"], ["goog.async.Deferred", "goog.events.EventTarget", "goog.fs.Error", "goog.fs.ProgressEvent"], false);
goog.addDependency("fs/filesaver.js", ["goog.fs.FileSaver", "goog.fs.FileSaver.EventType", "goog.fs.FileSaver.ProgressEvent", "goog.fs.FileSaver.ReadyState"], ["goog.events.EventTarget", "goog.fs.Error", "goog.fs.ProgressEvent"], false);
goog.addDependency("fs/filesystem.js", ["goog.fs.FileSystem"], [], false);
goog.addDependency("fs/filesystemimpl.js", ["goog.fs.FileSystemImpl"], ["goog.fs.DirectoryEntryImpl", "goog.fs.FileSystem"], false);
goog.addDependency("fs/filewriter.js", ["goog.fs.FileWriter"], ["goog.fs.Error", "goog.fs.FileSaver"], false);
goog.addDependency("fs/fs.js", ["goog.fs"], ["goog.array", "goog.async.Deferred", "goog.fs.Error", "goog.fs.FileReader", "goog.fs.FileSystemImpl", "goog.userAgent"], false);
goog.addDependency("fs/fs_test.js", ["goog.fsTest"], ["goog.array", "goog.async.Deferred", "goog.async.DeferredList", "goog.dom", "goog.events", "goog.fs", "goog.fs.DirectoryEntry", "goog.fs.Error", "goog.fs.FileReader", "goog.fs.FileSaver", "goog.string", "goog.testing.AsyncTestCase", "goog.testing.PropertyReplacer", "goog.testing.jsunit"], false);
goog.addDependency("fs/progressevent.js", ["goog.fs.ProgressEvent"], ["goog.events.Event"], false);
goog.addDependency("functions/functions.js", ["goog.functions"], [], false);
goog.addDependency("functions/functions_test.js", ["goog.functionsTest"], ["goog.functions", "goog.testing.PropertyReplacer", "goog.testing.jsunit", "goog.testing.recordFunction"], false);
goog.addDependency("fx/abstractdragdrop.js", ["goog.fx.AbstractDragDrop", "goog.fx.AbstractDragDrop.EventType", "goog.fx.DragDropEvent", "goog.fx.DragDropItem"], ["goog.asserts", "goog.dom", "goog.dom.classlist", "goog.events", "goog.events.Event", "goog.events.EventHandler", "goog.events.EventTarget", "goog.events.EventType", "goog.fx.Dragger", "goog.math.Box", "goog.math.Coordinate", "goog.style"], false);
goog.addDependency("fx/abstractdragdrop_test.js", ["goog.fx.AbstractDragDropTest"], ["goog.array", "goog.events.EventType", "goog.functions", "goog.fx.AbstractDragDrop", "goog.fx.DragDropItem", "goog.math.Box", "goog.math.Coordinate", "goog.style", "goog.testing.events", "goog.testing.jsunit"], false);
goog.addDependency("fx/anim/anim.js", ["goog.fx.anim", "goog.fx.anim.Animated"], ["goog.async.AnimationDelay", "goog.async.Delay", "goog.object"], false);
goog.addDependency("fx/anim/anim_test.js", ["goog.fx.animTest"], ["goog.async.AnimationDelay", "goog.async.Delay", "goog.events", "goog.functions", "goog.fx.Animation", "goog.fx.anim", "goog.object", "goog.testing.MockClock", "goog.testing.PropertyReplacer", "goog.testing.jsunit", "goog.testing.recordFunction", "goog.userAgent"], false);
goog.addDependency("fx/animation.js", ["goog.fx.Animation", "goog.fx.Animation.EventType", "goog.fx.Animation.State", "goog.fx.AnimationEvent"], ["goog.array", "goog.events.Event", "goog.fx.Transition", "goog.fx.TransitionBase", "goog.fx.anim", "goog.fx.anim.Animated"], false);
goog.addDependency("fx/animation_test.js", ["goog.fx.AnimationTest"], ["goog.events", "goog.fx.Animation", "goog.testing.MockClock", "goog.testing.jsunit"], false);
goog.addDependency("fx/animationqueue.js", ["goog.fx.AnimationParallelQueue", "goog.fx.AnimationQueue", "goog.fx.AnimationSerialQueue"], ["goog.array", "goog.asserts", "goog.events", "goog.fx.Transition", "goog.fx.TransitionBase"], false);
goog.addDependency("fx/animationqueue_test.js", ["goog.fx.AnimationQueueTest"], ["goog.events", "goog.fx.Animation", "goog.fx.AnimationParallelQueue", "goog.fx.AnimationSerialQueue", "goog.fx.Transition", "goog.fx.anim", "goog.testing.MockClock", "goog.testing.jsunit"], false);
goog.addDependency("fx/css3/fx.js", ["goog.fx.css3"], ["goog.fx.css3.Transition"], false);
goog.addDependency("fx/css3/transition.js", ["goog.fx.css3.Transition"], ["goog.Timer", "goog.asserts", "goog.fx.TransitionBase", "goog.style", "goog.style.transition"], false);
goog.addDependency("fx/css3/transition_test.js", ["goog.fx.css3.TransitionTest"], ["goog.dispose", "goog.dom", "goog.events", "goog.fx.Transition", "goog.fx.css3.Transition", "goog.style.transition", "goog.testing.MockClock", "goog.testing.jsunit", "goog.testing.recordFunction"], false);
goog.addDependency("fx/cssspriteanimation.js", ["goog.fx.CssSpriteAnimation"], ["goog.fx.Animation"], false);
goog.addDependency("fx/cssspriteanimation_test.js", ["goog.fx.CssSpriteAnimationTest"], ["goog.fx.CssSpriteAnimation", "goog.math.Box", "goog.math.Size", "goog.testing.MockClock", "goog.testing.jsunit"], false);
goog.addDependency("fx/dom.js", ["goog.fx.dom", "goog.fx.dom.BgColorTransform", "goog.fx.dom.ColorTransform", "goog.fx.dom.Fade", "goog.fx.dom.FadeIn", "goog.fx.dom.FadeInAndShow", "goog.fx.dom.FadeOut", "goog.fx.dom.FadeOutAndHide", "goog.fx.dom.PredefinedEffect", "goog.fx.dom.Resize", "goog.fx.dom.ResizeHeight", "goog.fx.dom.ResizeWidth", "goog.fx.dom.Scroll", "goog.fx.dom.Slide", "goog.fx.dom.SlideFrom", "goog.fx.dom.Swipe"], ["goog.color", "goog.events", "goog.fx.Animation", "goog.fx.Transition", 
"goog.style", "goog.style.bidi"], false);
goog.addDependency("fx/dragdrop.js", ["goog.fx.DragDrop"], ["goog.fx.AbstractDragDrop", "goog.fx.DragDropItem"], false);
goog.addDependency("fx/dragdropgroup.js", ["goog.fx.DragDropGroup"], ["goog.dom", "goog.fx.AbstractDragDrop", "goog.fx.DragDropItem"], false);
goog.addDependency("fx/dragdropgroup_test.js", ["goog.fx.DragDropGroupTest"], ["goog.events", "goog.fx.DragDropGroup", "goog.testing.jsunit"], false);
goog.addDependency("fx/dragger.js", ["goog.fx.DragEvent", "goog.fx.Dragger", "goog.fx.Dragger.EventType"], ["goog.dom", "goog.events", "goog.events.Event", "goog.events.EventHandler", "goog.events.EventTarget", "goog.events.EventType", "goog.math.Coordinate", "goog.math.Rect", "goog.style", "goog.style.bidi", "goog.userAgent"], false);
goog.addDependency("fx/dragger_test.js", ["goog.fx.DraggerTest"], ["goog.dom", "goog.events", "goog.events.BrowserEvent", "goog.events.Event", "goog.events.EventType", "goog.fx.Dragger", "goog.math.Rect", "goog.style.bidi", "goog.testing.StrictMock", "goog.testing.events", "goog.testing.jsunit", "goog.userAgent"], false);
goog.addDependency("fx/draglistgroup.js", ["goog.fx.DragListDirection", "goog.fx.DragListGroup", "goog.fx.DragListGroup.EventType", "goog.fx.DragListGroupEvent"], ["goog.array", "goog.asserts", "goog.dom", "goog.dom.classlist", "goog.events", "goog.events.Event", "goog.events.EventHandler", "goog.events.EventTarget", "goog.events.EventType", "goog.fx.Dragger", "goog.math.Coordinate", "goog.string", "goog.style"], false);
goog.addDependency("fx/draglistgroup_test.js", ["goog.fx.DragListGroupTest"], ["goog.array", "goog.dom", "goog.dom.classlist", "goog.events", "goog.events.BrowserEvent", "goog.events.BrowserFeature", "goog.events.Event", "goog.events.EventType", "goog.fx.DragEvent", "goog.fx.DragListDirection", "goog.fx.DragListGroup", "goog.fx.Dragger", "goog.math.Coordinate", "goog.object", "goog.testing.events", "goog.testing.jsunit"], false);
goog.addDependency("fx/dragscrollsupport.js", ["goog.fx.DragScrollSupport"], ["goog.Disposable", "goog.Timer", "goog.dom", "goog.events.EventHandler", "goog.events.EventType", "goog.math.Coordinate", "goog.style"], false);
goog.addDependency("fx/dragscrollsupport_test.js", ["goog.fx.DragScrollSupportTest"], ["goog.fx.DragScrollSupport", "goog.math.Coordinate", "goog.testing.MockClock", "goog.testing.events", "goog.testing.jsunit"], false);
goog.addDependency("fx/easing.js", ["goog.fx.easing"], [], false);
goog.addDependency("fx/easing_test.js", ["goog.fx.easingTest"], ["goog.fx.easing", "goog.testing.jsunit"], false);
goog.addDependency("fx/fx.js", ["goog.fx"], ["goog.asserts", "goog.fx.Animation", "goog.fx.Animation.EventType", "goog.fx.Animation.State", "goog.fx.AnimationEvent", "goog.fx.Transition.EventType", "goog.fx.easing"], false);
goog.addDependency("fx/fx_test.js", ["goog.fxTest"], ["goog.fx.Animation", "goog.object", "goog.testing.MockClock", "goog.testing.PropertyReplacer", "goog.testing.jsunit"], false);
goog.addDependency("fx/transition.js", ["goog.fx.Transition", "goog.fx.Transition.EventType"], [], false);
goog.addDependency("fx/transitionbase.js", ["goog.fx.TransitionBase", "goog.fx.TransitionBase.State"], ["goog.events.EventTarget", "goog.fx.Transition"], false);
goog.addDependency("graphics/abstractgraphics.js", ["goog.graphics.AbstractGraphics"], ["goog.dom", "goog.graphics.Path", "goog.math.Coordinate", "goog.math.Size", "goog.style", "goog.ui.Component"], false);
goog.addDependency("graphics/affinetransform.js", ["goog.graphics.AffineTransform"], ["goog.math"], false);
goog.addDependency("graphics/canvaselement.js", ["goog.graphics.CanvasEllipseElement", "goog.graphics.CanvasGroupElement", "goog.graphics.CanvasImageElement", "goog.graphics.CanvasPathElement", "goog.graphics.CanvasRectElement", "goog.graphics.CanvasTextElement"], ["goog.array", "goog.dom", "goog.dom.TagName", "goog.graphics.EllipseElement", "goog.graphics.GroupElement", "goog.graphics.ImageElement", "goog.graphics.Path", "goog.graphics.PathElement", "goog.graphics.RectElement", "goog.graphics.TextElement", 
"goog.math", "goog.string"], false);
goog.addDependency("graphics/canvasgraphics.js", ["goog.graphics.CanvasGraphics"], ["goog.events.EventType", "goog.graphics.AbstractGraphics", "goog.graphics.CanvasEllipseElement", "goog.graphics.CanvasGroupElement", "goog.graphics.CanvasImageElement", "goog.graphics.CanvasPathElement", "goog.graphics.CanvasRectElement", "goog.graphics.CanvasTextElement", "goog.graphics.SolidFill", "goog.math.Size", "goog.style"], false);
goog.addDependency("graphics/element.js", ["goog.graphics.Element"], ["goog.asserts", "goog.events", "goog.events.EventTarget", "goog.events.Listenable", "goog.graphics.AffineTransform", "goog.math"], false);
goog.addDependency("graphics/ellipseelement.js", ["goog.graphics.EllipseElement"], ["goog.graphics.StrokeAndFillElement"], false);
goog.addDependency("graphics/ext/coordinates.js", ["goog.graphics.ext.coordinates"], ["goog.string"], false);
goog.addDependency("graphics/ext/element.js", ["goog.graphics.ext.Element"], ["goog.events.EventTarget", "goog.functions", "goog.graphics.ext.coordinates"], false);
goog.addDependency("graphics/ext/ellipse.js", ["goog.graphics.ext.Ellipse"], ["goog.graphics.ext.StrokeAndFillElement"], false);
goog.addDependency("graphics/ext/ext.js", ["goog.graphics.ext"], ["goog.graphics.ext.Ellipse", "goog.graphics.ext.Graphics", "goog.graphics.ext.Group", "goog.graphics.ext.Image", "goog.graphics.ext.Rectangle", "goog.graphics.ext.Shape", "goog.graphics.ext.coordinates"], false);
goog.addDependency("graphics/ext/graphics.js", ["goog.graphics.ext.Graphics"], ["goog.events", "goog.events.EventType", "goog.graphics", "goog.graphics.ext.Group"], false);
goog.addDependency("graphics/ext/group.js", ["goog.graphics.ext.Group"], ["goog.array", "goog.graphics.ext.Element"], false);
goog.addDependency("graphics/ext/image.js", ["goog.graphics.ext.Image"], ["goog.graphics.ext.Element"], false);
goog.addDependency("graphics/ext/path.js", ["goog.graphics.ext.Path"], ["goog.graphics.AffineTransform", "goog.graphics.Path", "goog.math.Rect"], false);
goog.addDependency("graphics/ext/rectangle.js", ["goog.graphics.ext.Rectangle"], ["goog.graphics.ext.StrokeAndFillElement"], false);
goog.addDependency("graphics/ext/shape.js", ["goog.graphics.ext.Shape"], ["goog.graphics.ext.StrokeAndFillElement"], false);
goog.addDependency("graphics/ext/strokeandfillelement.js", ["goog.graphics.ext.StrokeAndFillElement"], ["goog.graphics.ext.Element"], false);
goog.addDependency("graphics/fill.js", ["goog.graphics.Fill"], [], false);
goog.addDependency("graphics/font.js", ["goog.graphics.Font"], [], false);
goog.addDependency("graphics/graphics.js", ["goog.graphics"], ["goog.dom", "goog.graphics.CanvasGraphics", "goog.graphics.SvgGraphics", "goog.graphics.VmlGraphics", "goog.userAgent"], false);
goog.addDependency("graphics/groupelement.js", ["goog.graphics.GroupElement"], ["goog.graphics.Element"], false);
goog.addDependency("graphics/imageelement.js", ["goog.graphics.ImageElement"], ["goog.graphics.Element"], false);
goog.addDependency("graphics/lineargradient.js", ["goog.graphics.LinearGradient"], ["goog.asserts", "goog.graphics.Fill"], false);
goog.addDependency("graphics/path.js", ["goog.graphics.Path", "goog.graphics.Path.Segment"], ["goog.array", "goog.math"], false);
goog.addDependency("graphics/pathelement.js", ["goog.graphics.PathElement"], ["goog.graphics.StrokeAndFillElement"], false);
goog.addDependency("graphics/paths.js", ["goog.graphics.paths"], ["goog.graphics.Path", "goog.math.Coordinate"], false);
goog.addDependency("graphics/rectelement.js", ["goog.graphics.RectElement"], ["goog.graphics.StrokeAndFillElement"], false);
goog.addDependency("graphics/solidfill.js", ["goog.graphics.SolidFill"], ["goog.graphics.Fill"], false);
goog.addDependency("graphics/stroke.js", ["goog.graphics.Stroke"], [], false);
goog.addDependency("graphics/strokeandfillelement.js", ["goog.graphics.StrokeAndFillElement"], ["goog.graphics.Element"], false);
goog.addDependency("graphics/svgelement.js", ["goog.graphics.SvgEllipseElement", "goog.graphics.SvgGroupElement", "goog.graphics.SvgImageElement", "goog.graphics.SvgPathElement", "goog.graphics.SvgRectElement", "goog.graphics.SvgTextElement"], ["goog.dom", "goog.graphics.EllipseElement", "goog.graphics.GroupElement", "goog.graphics.ImageElement", "goog.graphics.PathElement", "goog.graphics.RectElement", "goog.graphics.TextElement"], false);
goog.addDependency("graphics/svggraphics.js", ["goog.graphics.SvgGraphics"], ["goog.Timer", "goog.dom", "goog.events.EventHandler", "goog.events.EventType", "goog.graphics.AbstractGraphics", "goog.graphics.LinearGradient", "goog.graphics.Path", "goog.graphics.SolidFill", "goog.graphics.Stroke", "goog.graphics.SvgEllipseElement", "goog.graphics.SvgGroupElement", "goog.graphics.SvgImageElement", "goog.graphics.SvgPathElement", "goog.graphics.SvgRectElement", "goog.graphics.SvgTextElement", "goog.math", 
"goog.math.Size", "goog.style", "goog.userAgent"], false);
goog.addDependency("graphics/textelement.js", ["goog.graphics.TextElement"], ["goog.graphics.StrokeAndFillElement"], false);
goog.addDependency("graphics/vmlelement.js", ["goog.graphics.VmlEllipseElement", "goog.graphics.VmlGroupElement", "goog.graphics.VmlImageElement", "goog.graphics.VmlPathElement", "goog.graphics.VmlRectElement", "goog.graphics.VmlTextElement"], ["goog.dom", "goog.graphics.EllipseElement", "goog.graphics.GroupElement", "goog.graphics.ImageElement", "goog.graphics.PathElement", "goog.graphics.RectElement", "goog.graphics.TextElement"], false);
goog.addDependency("graphics/vmlgraphics.js", ["goog.graphics.VmlGraphics"], ["goog.array", "goog.events", "goog.events.EventHandler", "goog.events.EventType", "goog.graphics.AbstractGraphics", "goog.graphics.LinearGradient", "goog.graphics.Path", "goog.graphics.SolidFill", "goog.graphics.VmlEllipseElement", "goog.graphics.VmlGroupElement", "goog.graphics.VmlImageElement", "goog.graphics.VmlPathElement", "goog.graphics.VmlRectElement", "goog.graphics.VmlTextElement", "goog.math", "goog.math.Size", 
"goog.string", "goog.style"], false);
goog.addDependency("history/event.js", ["goog.history.Event"], ["goog.events.Event", "goog.history.EventType"], false);
goog.addDependency("history/eventtype.js", ["goog.history.EventType"], [], false);
goog.addDependency("history/history.js", ["goog.History", "goog.History.Event", "goog.History.EventType"], ["goog.Timer", "goog.dom", "goog.events.EventHandler", "goog.events.EventTarget", "goog.events.EventType", "goog.history.Event", "goog.history.EventType", "goog.labs.userAgent.device", "goog.memoize", "goog.string", "goog.userAgent"], false);
goog.addDependency("history/history_test.js", ["goog.HistoryTest"], ["goog.History", "goog.dispose", "goog.dom", "goog.testing.jsunit", "goog.userAgent"], false);
goog.addDependency("history/html5history.js", ["goog.history.Html5History", "goog.history.Html5History.TokenTransformer"], ["goog.asserts", "goog.events", "goog.events.EventTarget", "goog.events.EventType", "goog.history.Event"], false);
goog.addDependency("history/html5history_test.js", ["goog.history.Html5HistoryTest"], ["goog.history.Html5History", "goog.testing.MockControl", "goog.testing.jsunit", "goog.testing.mockmatchers"], false);
goog.addDependency("html/legacyconversions.js", ["goog.html.legacyconversions"], ["goog.html.SafeHtml", "goog.html.SafeUrl", "goog.html.TrustedResourceUrl"], false);
goog.addDependency("html/legacyconversions_test.js", ["goog.html.legacyconversionsTest"], ["goog.html.SafeHtml", "goog.html.SafeUrl", "goog.html.TrustedResourceUrl", "goog.html.legacyconversions", "goog.testing.PropertyReplacer", "goog.testing.jsunit"], false);
goog.addDependency("html/safehtml.js", ["goog.html.SafeHtml"], ["goog.array", "goog.asserts", "goog.dom.tags", "goog.html.SafeStyle", "goog.html.SafeUrl", "goog.html.TrustedResourceUrl", "goog.i18n.bidi.Dir", "goog.i18n.bidi.DirectionalString", "goog.object", "goog.string", "goog.string.Const", "goog.string.TypedString"], false);
goog.addDependency("html/safehtml_test.js", ["goog.html.safeHtmlTest"], ["goog.html.SafeHtml", "goog.html.SafeStyle", "goog.html.SafeUrl", "goog.html.TrustedResourceUrl", "goog.html.testing", "goog.i18n.bidi.Dir", "goog.string.Const", "goog.testing.jsunit"], false);
goog.addDependency("html/safescript.js", ["goog.html.SafeScript"], ["goog.asserts", "goog.string.Const", "goog.string.TypedString"], false);
goog.addDependency("html/safescript_test.js", ["goog.html.safeScriptTest"], ["goog.html.SafeScript", "goog.string.Const", "goog.testing.jsunit"], false);
goog.addDependency("html/safestyle.js", ["goog.html.SafeStyle"], ["goog.array", "goog.asserts", "goog.string", "goog.string.Const", "goog.string.TypedString"], false);
goog.addDependency("html/safestyle_test.js", ["goog.html.safeStyleTest"], ["goog.html.SafeStyle", "goog.string.Const", "goog.testing.jsunit"], false);
goog.addDependency("html/safestylesheet.js", ["goog.html.SafeStyleSheet"], ["goog.asserts", "goog.string", "goog.string.Const", "goog.string.TypedString"], false);
goog.addDependency("html/safestylesheet_test.js", ["goog.html.safeStyleSheetTest"], ["goog.html.SafeStyleSheet", "goog.string", "goog.string.Const", "goog.testing.jsunit"], false);
goog.addDependency("html/safeurl.js", ["goog.html.SafeUrl"], ["goog.asserts", "goog.i18n.bidi.Dir", "goog.i18n.bidi.DirectionalString", "goog.string.Const", "goog.string.TypedString"], false);
goog.addDependency("html/safeurl_test.js", ["goog.html.safeUrlTest"], ["goog.html.SafeUrl", "goog.i18n.bidi.Dir", "goog.string.Const", "goog.testing.jsunit"], false);
goog.addDependency("html/testing.js", ["goog.html.testing"], ["goog.html.SafeHtml", "goog.html.SafeScript", "goog.html.SafeStyle", "goog.html.SafeStyleSheet", "goog.html.SafeUrl", "goog.html.TrustedResourceUrl"], false);
goog.addDependency("html/trustedresourceurl.js", ["goog.html.TrustedResourceUrl"], ["goog.asserts", "goog.i18n.bidi.Dir", "goog.i18n.bidi.DirectionalString", "goog.string.Const", "goog.string.TypedString"], false);
goog.addDependency("html/trustedresourceurl_test.js", ["goog.html.trustedResourceUrlTest"], ["goog.html.TrustedResourceUrl", "goog.i18n.bidi.Dir", "goog.string.Const", "goog.testing.jsunit"], false);
goog.addDependency("html/uncheckedconversions.js", ["goog.html.uncheckedconversions"], ["goog.asserts", "goog.html.SafeHtml", "goog.html.SafeScript", "goog.html.SafeStyle", "goog.html.SafeStyleSheet", "goog.html.SafeUrl", "goog.html.TrustedResourceUrl", "goog.string", "goog.string.Const"], false);
goog.addDependency("html/uncheckedconversions_test.js", ["goog.html.uncheckedconversionsTest"], ["goog.html.SafeHtml", "goog.html.SafeScript", "goog.html.SafeStyle", "goog.html.SafeStyleSheet", "goog.html.SafeUrl", "goog.html.TrustedResourceUrl", "goog.html.uncheckedconversions", "goog.i18n.bidi.Dir", "goog.string.Const", "goog.testing.jsunit"], false);
goog.addDependency("html/utils.js", ["goog.html.utils"], ["goog.string"], false);
goog.addDependency("html/utils_test.js", ["goog.html.UtilsTest"], ["goog.array", "goog.dom.TagName", "goog.html.utils", "goog.object", "goog.testing.jsunit"], false);
goog.addDependency("i18n/bidi.js", ["goog.i18n.bidi", "goog.i18n.bidi.Dir", "goog.i18n.bidi.DirectionalString", "goog.i18n.bidi.Format"], [], false);
goog.addDependency("i18n/bidi_test.js", ["goog.i18n.bidiTest"], ["goog.i18n.bidi", "goog.i18n.bidi.Dir", "goog.testing.jsunit"], false);
goog.addDependency("i18n/bidiformatter.js", ["goog.i18n.BidiFormatter"], ["goog.html.SafeHtml", "goog.html.legacyconversions", "goog.i18n.bidi", "goog.i18n.bidi.Dir", "goog.i18n.bidi.Format"], false);
goog.addDependency("i18n/bidiformatter_test.js", ["goog.i18n.BidiFormatterTest"], ["goog.html.SafeHtml", "goog.i18n.BidiFormatter", "goog.i18n.bidi.Dir", "goog.i18n.bidi.Format", "goog.testing.jsunit"], false);
goog.addDependency("i18n/charlistdecompressor.js", ["goog.i18n.CharListDecompressor"], ["goog.array", "goog.i18n.uChar"], false);
goog.addDependency("i18n/charlistdecompressor_test.js", ["goog.i18n.CharListDecompressorTest"], ["goog.i18n.CharListDecompressor", "goog.testing.jsunit"], false);
goog.addDependency("i18n/charpickerdata.js", ["goog.i18n.CharPickerData"], [], false);
goog.addDependency("i18n/collation.js", ["goog.i18n.collation"], [], false);
goog.addDependency("i18n/collation_test.js", ["goog.i18n.collationTest"], ["goog.i18n.collation", "goog.testing.ExpectedFailures", "goog.testing.jsunit", "goog.userAgent"], false);
goog.addDependency("i18n/compactnumberformatsymbols.js", ["goog.i18n.CompactNumberFormatSymbols", "goog.i18n.CompactNumberFormatSymbols_af", "goog.i18n.CompactNumberFormatSymbols_af_ZA", "goog.i18n.CompactNumberFormatSymbols_am", "goog.i18n.CompactNumberFormatSymbols_am_ET", "goog.i18n.CompactNumberFormatSymbols_ar", "goog.i18n.CompactNumberFormatSymbols_ar_001", "goog.i18n.CompactNumberFormatSymbols_az", "goog.i18n.CompactNumberFormatSymbols_az_Latn_AZ", "goog.i18n.CompactNumberFormatSymbols_bg", 
"goog.i18n.CompactNumberFormatSymbols_bg_BG", "goog.i18n.CompactNumberFormatSymbols_bn", "goog.i18n.CompactNumberFormatSymbols_bn_BD", "goog.i18n.CompactNumberFormatSymbols_br", "goog.i18n.CompactNumberFormatSymbols_br_FR", "goog.i18n.CompactNumberFormatSymbols_ca", "goog.i18n.CompactNumberFormatSymbols_ca_AD", "goog.i18n.CompactNumberFormatSymbols_ca_ES", "goog.i18n.CompactNumberFormatSymbols_ca_ES_VALENCIA", "goog.i18n.CompactNumberFormatSymbols_ca_FR", "goog.i18n.CompactNumberFormatSymbols_ca_IT", 
"goog.i18n.CompactNumberFormatSymbols_chr", "goog.i18n.CompactNumberFormatSymbols_chr_US", "goog.i18n.CompactNumberFormatSymbols_cs", "goog.i18n.CompactNumberFormatSymbols_cs_CZ", "goog.i18n.CompactNumberFormatSymbols_cy", "goog.i18n.CompactNumberFormatSymbols_cy_GB", "goog.i18n.CompactNumberFormatSymbols_da", "goog.i18n.CompactNumberFormatSymbols_da_DK", "goog.i18n.CompactNumberFormatSymbols_da_GL", "goog.i18n.CompactNumberFormatSymbols_de", "goog.i18n.CompactNumberFormatSymbols_de_AT", "goog.i18n.CompactNumberFormatSymbols_de_BE", 
"goog.i18n.CompactNumberFormatSymbols_de_CH", "goog.i18n.CompactNumberFormatSymbols_de_DE", "goog.i18n.CompactNumberFormatSymbols_de_LU", "goog.i18n.CompactNumberFormatSymbols_el", "goog.i18n.CompactNumberFormatSymbols_el_GR", "goog.i18n.CompactNumberFormatSymbols_en", "goog.i18n.CompactNumberFormatSymbols_en_001", "goog.i18n.CompactNumberFormatSymbols_en_AS", "goog.i18n.CompactNumberFormatSymbols_en_AU", "goog.i18n.CompactNumberFormatSymbols_en_DG", "goog.i18n.CompactNumberFormatSymbols_en_FM", 
"goog.i18n.CompactNumberFormatSymbols_en_GB", "goog.i18n.CompactNumberFormatSymbols_en_GU", "goog.i18n.CompactNumberFormatSymbols_en_IE", "goog.i18n.CompactNumberFormatSymbols_en_IN", "goog.i18n.CompactNumberFormatSymbols_en_IO", "goog.i18n.CompactNumberFormatSymbols_en_MH", "goog.i18n.CompactNumberFormatSymbols_en_MP", "goog.i18n.CompactNumberFormatSymbols_en_PR", "goog.i18n.CompactNumberFormatSymbols_en_PW", "goog.i18n.CompactNumberFormatSymbols_en_SG", "goog.i18n.CompactNumberFormatSymbols_en_TC", 
"goog.i18n.CompactNumberFormatSymbols_en_UM", "goog.i18n.CompactNumberFormatSymbols_en_US", "goog.i18n.CompactNumberFormatSymbols_en_VG", "goog.i18n.CompactNumberFormatSymbols_en_VI", "goog.i18n.CompactNumberFormatSymbols_en_ZA", "goog.i18n.CompactNumberFormatSymbols_en_ZW", "goog.i18n.CompactNumberFormatSymbols_es", "goog.i18n.CompactNumberFormatSymbols_es_419", "goog.i18n.CompactNumberFormatSymbols_es_EA", "goog.i18n.CompactNumberFormatSymbols_es_ES", "goog.i18n.CompactNumberFormatSymbols_es_IC", 
"goog.i18n.CompactNumberFormatSymbols_et", "goog.i18n.CompactNumberFormatSymbols_et_EE", "goog.i18n.CompactNumberFormatSymbols_eu", "goog.i18n.CompactNumberFormatSymbols_eu_ES", "goog.i18n.CompactNumberFormatSymbols_fa", "goog.i18n.CompactNumberFormatSymbols_fa_IR", "goog.i18n.CompactNumberFormatSymbols_fi", "goog.i18n.CompactNumberFormatSymbols_fi_FI", "goog.i18n.CompactNumberFormatSymbols_fil", "goog.i18n.CompactNumberFormatSymbols_fil_PH", "goog.i18n.CompactNumberFormatSymbols_fr", "goog.i18n.CompactNumberFormatSymbols_fr_BL", 
"goog.i18n.CompactNumberFormatSymbols_fr_CA", "goog.i18n.CompactNumberFormatSymbols_fr_FR", "goog.i18n.CompactNumberFormatSymbols_fr_GF", "goog.i18n.CompactNumberFormatSymbols_fr_GP", "goog.i18n.CompactNumberFormatSymbols_fr_MC", "goog.i18n.CompactNumberFormatSymbols_fr_MF", "goog.i18n.CompactNumberFormatSymbols_fr_MQ", "goog.i18n.CompactNumberFormatSymbols_fr_PM", "goog.i18n.CompactNumberFormatSymbols_fr_RE", "goog.i18n.CompactNumberFormatSymbols_fr_YT", "goog.i18n.CompactNumberFormatSymbols_ga", 
"goog.i18n.CompactNumberFormatSymbols_ga_IE", "goog.i18n.CompactNumberFormatSymbols_gl", "goog.i18n.CompactNumberFormatSymbols_gl_ES", "goog.i18n.CompactNumberFormatSymbols_gsw", "goog.i18n.CompactNumberFormatSymbols_gsw_CH", "goog.i18n.CompactNumberFormatSymbols_gsw_LI", "goog.i18n.CompactNumberFormatSymbols_gu", "goog.i18n.CompactNumberFormatSymbols_gu_IN", "goog.i18n.CompactNumberFormatSymbols_haw", "goog.i18n.CompactNumberFormatSymbols_haw_US", "goog.i18n.CompactNumberFormatSymbols_he", "goog.i18n.CompactNumberFormatSymbols_he_IL", 
"goog.i18n.CompactNumberFormatSymbols_hi", "goog.i18n.CompactNumberFormatSymbols_hi_IN", "goog.i18n.CompactNumberFormatSymbols_hr", "goog.i18n.CompactNumberFormatSymbols_hr_HR", "goog.i18n.CompactNumberFormatSymbols_hu", "goog.i18n.CompactNumberFormatSymbols_hu_HU", "goog.i18n.CompactNumberFormatSymbols_hy", "goog.i18n.CompactNumberFormatSymbols_hy_AM", "goog.i18n.CompactNumberFormatSymbols_id", "goog.i18n.CompactNumberFormatSymbols_id_ID", "goog.i18n.CompactNumberFormatSymbols_in", "goog.i18n.CompactNumberFormatSymbols_is", 
"goog.i18n.CompactNumberFormatSymbols_is_IS", "goog.i18n.CompactNumberFormatSymbols_it", "goog.i18n.CompactNumberFormatSymbols_it_IT", "goog.i18n.CompactNumberFormatSymbols_it_SM", "goog.i18n.CompactNumberFormatSymbols_iw", "goog.i18n.CompactNumberFormatSymbols_ja", "goog.i18n.CompactNumberFormatSymbols_ja_JP", "goog.i18n.CompactNumberFormatSymbols_ka", "goog.i18n.CompactNumberFormatSymbols_ka_GE", "goog.i18n.CompactNumberFormatSymbols_kk", "goog.i18n.CompactNumberFormatSymbols_kk_Cyrl_KZ", "goog.i18n.CompactNumberFormatSymbols_km", 
"goog.i18n.CompactNumberFormatSymbols_km_KH", "goog.i18n.CompactNumberFormatSymbols_kn", "goog.i18n.CompactNumberFormatSymbols_kn_IN", "goog.i18n.CompactNumberFormatSymbols_ko", "goog.i18n.CompactNumberFormatSymbols_ko_KR", "goog.i18n.CompactNumberFormatSymbols_ky", "goog.i18n.CompactNumberFormatSymbols_ky_Cyrl_KG", "goog.i18n.CompactNumberFormatSymbols_ln", "goog.i18n.CompactNumberFormatSymbols_ln_CD", "goog.i18n.CompactNumberFormatSymbols_lo", "goog.i18n.CompactNumberFormatSymbols_lo_LA", "goog.i18n.CompactNumberFormatSymbols_lt", 
"goog.i18n.CompactNumberFormatSymbols_lt_LT", "goog.i18n.CompactNumberFormatSymbols_lv", "goog.i18n.CompactNumberFormatSymbols_lv_LV", "goog.i18n.CompactNumberFormatSymbols_mk", "goog.i18n.CompactNumberFormatSymbols_mk_MK", "goog.i18n.CompactNumberFormatSymbols_ml", "goog.i18n.CompactNumberFormatSymbols_ml_IN", "goog.i18n.CompactNumberFormatSymbols_mn", "goog.i18n.CompactNumberFormatSymbols_mn_Cyrl_MN", "goog.i18n.CompactNumberFormatSymbols_mr", "goog.i18n.CompactNumberFormatSymbols_mr_IN", "goog.i18n.CompactNumberFormatSymbols_ms", 
"goog.i18n.CompactNumberFormatSymbols_ms_Latn_MY", "goog.i18n.CompactNumberFormatSymbols_mt", "goog.i18n.CompactNumberFormatSymbols_mt_MT", "goog.i18n.CompactNumberFormatSymbols_my", "goog.i18n.CompactNumberFormatSymbols_my_MM", "goog.i18n.CompactNumberFormatSymbols_nb", "goog.i18n.CompactNumberFormatSymbols_nb_NO", "goog.i18n.CompactNumberFormatSymbols_nb_SJ", "goog.i18n.CompactNumberFormatSymbols_ne", "goog.i18n.CompactNumberFormatSymbols_ne_NP", "goog.i18n.CompactNumberFormatSymbols_nl", "goog.i18n.CompactNumberFormatSymbols_nl_NL", 
"goog.i18n.CompactNumberFormatSymbols_no", "goog.i18n.CompactNumberFormatSymbols_no_NO", "goog.i18n.CompactNumberFormatSymbols_or", "goog.i18n.CompactNumberFormatSymbols_or_IN", "goog.i18n.CompactNumberFormatSymbols_pa", "goog.i18n.CompactNumberFormatSymbols_pa_Guru_IN", "goog.i18n.CompactNumberFormatSymbols_pl", "goog.i18n.CompactNumberFormatSymbols_pl_PL", "goog.i18n.CompactNumberFormatSymbols_pt", "goog.i18n.CompactNumberFormatSymbols_pt_BR", "goog.i18n.CompactNumberFormatSymbols_pt_PT", "goog.i18n.CompactNumberFormatSymbols_ro", 
"goog.i18n.CompactNumberFormatSymbols_ro_RO", "goog.i18n.CompactNumberFormatSymbols_ru", "goog.i18n.CompactNumberFormatSymbols_ru_RU", "goog.i18n.CompactNumberFormatSymbols_si", "goog.i18n.CompactNumberFormatSymbols_si_LK", "goog.i18n.CompactNumberFormatSymbols_sk", "goog.i18n.CompactNumberFormatSymbols_sk_SK", "goog.i18n.CompactNumberFormatSymbols_sl", "goog.i18n.CompactNumberFormatSymbols_sl_SI", "goog.i18n.CompactNumberFormatSymbols_sq", "goog.i18n.CompactNumberFormatSymbols_sq_AL", "goog.i18n.CompactNumberFormatSymbols_sr", 
"goog.i18n.CompactNumberFormatSymbols_sr_Cyrl_RS", "goog.i18n.CompactNumberFormatSymbols_sv", "goog.i18n.CompactNumberFormatSymbols_sv_SE", "goog.i18n.CompactNumberFormatSymbols_sw", "goog.i18n.CompactNumberFormatSymbols_sw_TZ", "goog.i18n.CompactNumberFormatSymbols_ta", "goog.i18n.CompactNumberFormatSymbols_ta_IN", "goog.i18n.CompactNumberFormatSymbols_te", "goog.i18n.CompactNumberFormatSymbols_te_IN", "goog.i18n.CompactNumberFormatSymbols_th", "goog.i18n.CompactNumberFormatSymbols_th_TH", "goog.i18n.CompactNumberFormatSymbols_tl", 
"goog.i18n.CompactNumberFormatSymbols_tr", "goog.i18n.CompactNumberFormatSymbols_tr_TR", "goog.i18n.CompactNumberFormatSymbols_uk", "goog.i18n.CompactNumberFormatSymbols_uk_UA", "goog.i18n.CompactNumberFormatSymbols_ur", "goog.i18n.CompactNumberFormatSymbols_ur_PK", "goog.i18n.CompactNumberFormatSymbols_uz", "goog.i18n.CompactNumberFormatSymbols_uz_Latn_UZ", "goog.i18n.CompactNumberFormatSymbols_vi", "goog.i18n.CompactNumberFormatSymbols_vi_VN", "goog.i18n.CompactNumberFormatSymbols_zh", "goog.i18n.CompactNumberFormatSymbols_zh_CN", 
"goog.i18n.CompactNumberFormatSymbols_zh_HK", "goog.i18n.CompactNumberFormatSymbols_zh_Hans_CN", "goog.i18n.CompactNumberFormatSymbols_zh_TW", "goog.i18n.CompactNumberFormatSymbols_zu", "goog.i18n.CompactNumberFormatSymbols_zu_ZA"], [], false);
goog.addDependency("i18n/compactnumberformatsymbols_ext.js", ["goog.i18n.CompactNumberFormatSymbolsExt", "goog.i18n.CompactNumberFormatSymbols_aa", "goog.i18n.CompactNumberFormatSymbols_aa_DJ", "goog.i18n.CompactNumberFormatSymbols_aa_ER", "goog.i18n.CompactNumberFormatSymbols_aa_ET", "goog.i18n.CompactNumberFormatSymbols_af_NA", "goog.i18n.CompactNumberFormatSymbols_agq", "goog.i18n.CompactNumberFormatSymbols_agq_CM", "goog.i18n.CompactNumberFormatSymbols_ak", "goog.i18n.CompactNumberFormatSymbols_ak_GH", 
"goog.i18n.CompactNumberFormatSymbols_ar_AE", "goog.i18n.CompactNumberFormatSymbols_ar_BH", "goog.i18n.CompactNumberFormatSymbols_ar_DJ", "goog.i18n.CompactNumberFormatSymbols_ar_DZ", "goog.i18n.CompactNumberFormatSymbols_ar_EG", "goog.i18n.CompactNumberFormatSymbols_ar_EH", "goog.i18n.CompactNumberFormatSymbols_ar_ER", "goog.i18n.CompactNumberFormatSymbols_ar_IL", "goog.i18n.CompactNumberFormatSymbols_ar_IQ", "goog.i18n.CompactNumberFormatSymbols_ar_JO", "goog.i18n.CompactNumberFormatSymbols_ar_KM", 
"goog.i18n.CompactNumberFormatSymbols_ar_KW", "goog.i18n.CompactNumberFormatSymbols_ar_LB", "goog.i18n.CompactNumberFormatSymbols_ar_LY", "goog.i18n.CompactNumberFormatSymbols_ar_MA", "goog.i18n.CompactNumberFormatSymbols_ar_MR", "goog.i18n.CompactNumberFormatSymbols_ar_OM", "goog.i18n.CompactNumberFormatSymbols_ar_PS", "goog.i18n.CompactNumberFormatSymbols_ar_QA", "goog.i18n.CompactNumberFormatSymbols_ar_SA", "goog.i18n.CompactNumberFormatSymbols_ar_SD", "goog.i18n.CompactNumberFormatSymbols_ar_SO", 
"goog.i18n.CompactNumberFormatSymbols_ar_SS", "goog.i18n.CompactNumberFormatSymbols_ar_SY", "goog.i18n.CompactNumberFormatSymbols_ar_TD", "goog.i18n.CompactNumberFormatSymbols_ar_TN", "goog.i18n.CompactNumberFormatSymbols_ar_YE", "goog.i18n.CompactNumberFormatSymbols_as", "goog.i18n.CompactNumberFormatSymbols_as_IN", "goog.i18n.CompactNumberFormatSymbols_asa", "goog.i18n.CompactNumberFormatSymbols_asa_TZ", "goog.i18n.CompactNumberFormatSymbols_ast", "goog.i18n.CompactNumberFormatSymbols_ast_ES", 
"goog.i18n.CompactNumberFormatSymbols_az_Cyrl", "goog.i18n.CompactNumberFormatSymbols_az_Cyrl_AZ", "goog.i18n.CompactNumberFormatSymbols_az_Latn", "goog.i18n.CompactNumberFormatSymbols_bas", "goog.i18n.CompactNumberFormatSymbols_bas_CM", "goog.i18n.CompactNumberFormatSymbols_be", "goog.i18n.CompactNumberFormatSymbols_be_BY", "goog.i18n.CompactNumberFormatSymbols_bem", "goog.i18n.CompactNumberFormatSymbols_bem_ZM", "goog.i18n.CompactNumberFormatSymbols_bez", "goog.i18n.CompactNumberFormatSymbols_bez_TZ", 
"goog.i18n.CompactNumberFormatSymbols_bm", "goog.i18n.CompactNumberFormatSymbols_bm_Latn", "goog.i18n.CompactNumberFormatSymbols_bm_Latn_ML", "goog.i18n.CompactNumberFormatSymbols_bn_IN", "goog.i18n.CompactNumberFormatSymbols_bo", "goog.i18n.CompactNumberFormatSymbols_bo_CN", "goog.i18n.CompactNumberFormatSymbols_bo_IN", "goog.i18n.CompactNumberFormatSymbols_brx", "goog.i18n.CompactNumberFormatSymbols_brx_IN", "goog.i18n.CompactNumberFormatSymbols_bs", "goog.i18n.CompactNumberFormatSymbols_bs_Cyrl", 
"goog.i18n.CompactNumberFormatSymbols_bs_Cyrl_BA", "goog.i18n.CompactNumberFormatSymbols_bs_Latn", "goog.i18n.CompactNumberFormatSymbols_bs_Latn_BA", "goog.i18n.CompactNumberFormatSymbols_cgg", "goog.i18n.CompactNumberFormatSymbols_cgg_UG", "goog.i18n.CompactNumberFormatSymbols_ckb", "goog.i18n.CompactNumberFormatSymbols_ckb_Arab", "goog.i18n.CompactNumberFormatSymbols_ckb_Arab_IQ", "goog.i18n.CompactNumberFormatSymbols_ckb_Arab_IR", "goog.i18n.CompactNumberFormatSymbols_ckb_IQ", "goog.i18n.CompactNumberFormatSymbols_ckb_IR", 
"goog.i18n.CompactNumberFormatSymbols_ckb_Latn", "goog.i18n.CompactNumberFormatSymbols_ckb_Latn_IQ", "goog.i18n.CompactNumberFormatSymbols_dav", "goog.i18n.CompactNumberFormatSymbols_dav_KE", "goog.i18n.CompactNumberFormatSymbols_de_LI", "goog.i18n.CompactNumberFormatSymbols_dje", "goog.i18n.CompactNumberFormatSymbols_dje_NE", "goog.i18n.CompactNumberFormatSymbols_dsb", "goog.i18n.CompactNumberFormatSymbols_dsb_DE", "goog.i18n.CompactNumberFormatSymbols_dua", "goog.i18n.CompactNumberFormatSymbols_dua_CM", 
"goog.i18n.CompactNumberFormatSymbols_dyo", "goog.i18n.CompactNumberFormatSymbols_dyo_SN", "goog.i18n.CompactNumberFormatSymbols_dz", "goog.i18n.CompactNumberFormatSymbols_dz_BT", "goog.i18n.CompactNumberFormatSymbols_ebu", "goog.i18n.CompactNumberFormatSymbols_ebu_KE", "goog.i18n.CompactNumberFormatSymbols_ee", "goog.i18n.CompactNumberFormatSymbols_ee_GH", "goog.i18n.CompactNumberFormatSymbols_ee_TG", "goog.i18n.CompactNumberFormatSymbols_el_CY", "goog.i18n.CompactNumberFormatSymbols_en_150", "goog.i18n.CompactNumberFormatSymbols_en_AG", 
"goog.i18n.CompactNumberFormatSymbols_en_AI", "goog.i18n.CompactNumberFormatSymbols_en_BB", "goog.i18n.CompactNumberFormatSymbols_en_BE", "goog.i18n.CompactNumberFormatSymbols_en_BM", "goog.i18n.CompactNumberFormatSymbols_en_BS", "goog.i18n.CompactNumberFormatSymbols_en_BW", "goog.i18n.CompactNumberFormatSymbols_en_BZ", "goog.i18n.CompactNumberFormatSymbols_en_CA", "goog.i18n.CompactNumberFormatSymbols_en_CC", "goog.i18n.CompactNumberFormatSymbols_en_CK", "goog.i18n.CompactNumberFormatSymbols_en_CM", 
"goog.i18n.CompactNumberFormatSymbols_en_CX", "goog.i18n.CompactNumberFormatSymbols_en_DM", "goog.i18n.CompactNumberFormatSymbols_en_ER", "goog.i18n.CompactNumberFormatSymbols_en_FJ", "goog.i18n.CompactNumberFormatSymbols_en_FK", "goog.i18n.CompactNumberFormatSymbols_en_GD", "goog.i18n.CompactNumberFormatSymbols_en_GG", "goog.i18n.CompactNumberFormatSymbols_en_GH", "goog.i18n.CompactNumberFormatSymbols_en_GI", "goog.i18n.CompactNumberFormatSymbols_en_GM", "goog.i18n.CompactNumberFormatSymbols_en_GY", 
"goog.i18n.CompactNumberFormatSymbols_en_HK", "goog.i18n.CompactNumberFormatSymbols_en_IM", "goog.i18n.CompactNumberFormatSymbols_en_JE", "goog.i18n.CompactNumberFormatSymbols_en_JM", "goog.i18n.CompactNumberFormatSymbols_en_KE", "goog.i18n.CompactNumberFormatSymbols_en_KI", "goog.i18n.CompactNumberFormatSymbols_en_KN", "goog.i18n.CompactNumberFormatSymbols_en_KY", "goog.i18n.CompactNumberFormatSymbols_en_LC", "goog.i18n.CompactNumberFormatSymbols_en_LR", "goog.i18n.CompactNumberFormatSymbols_en_LS", 
"goog.i18n.CompactNumberFormatSymbols_en_MG", "goog.i18n.CompactNumberFormatSymbols_en_MO", "goog.i18n.CompactNumberFormatSymbols_en_MS", "goog.i18n.CompactNumberFormatSymbols_en_MT", "goog.i18n.CompactNumberFormatSymbols_en_MU", "goog.i18n.CompactNumberFormatSymbols_en_MW", "goog.i18n.CompactNumberFormatSymbols_en_MY", "goog.i18n.CompactNumberFormatSymbols_en_NA", "goog.i18n.CompactNumberFormatSymbols_en_NF", "goog.i18n.CompactNumberFormatSymbols_en_NG", "goog.i18n.CompactNumberFormatSymbols_en_NR", 
"goog.i18n.CompactNumberFormatSymbols_en_NU", "goog.i18n.CompactNumberFormatSymbols_en_NZ", "goog.i18n.CompactNumberFormatSymbols_en_PG", "goog.i18n.CompactNumberFormatSymbols_en_PH", "goog.i18n.CompactNumberFormatSymbols_en_PK", "goog.i18n.CompactNumberFormatSymbols_en_PN", "goog.i18n.CompactNumberFormatSymbols_en_RW", "goog.i18n.CompactNumberFormatSymbols_en_SB", "goog.i18n.CompactNumberFormatSymbols_en_SC", "goog.i18n.CompactNumberFormatSymbols_en_SD", "goog.i18n.CompactNumberFormatSymbols_en_SH", 
"goog.i18n.CompactNumberFormatSymbols_en_SL", "goog.i18n.CompactNumberFormatSymbols_en_SS", "goog.i18n.CompactNumberFormatSymbols_en_SX", "goog.i18n.CompactNumberFormatSymbols_en_SZ", "goog.i18n.CompactNumberFormatSymbols_en_TK", "goog.i18n.CompactNumberFormatSymbols_en_TO", "goog.i18n.CompactNumberFormatSymbols_en_TT", "goog.i18n.CompactNumberFormatSymbols_en_TV", "goog.i18n.CompactNumberFormatSymbols_en_TZ", "goog.i18n.CompactNumberFormatSymbols_en_UG", "goog.i18n.CompactNumberFormatSymbols_en_VC", 
"goog.i18n.CompactNumberFormatSymbols_en_VU", "goog.i18n.CompactNumberFormatSymbols_en_WS", "goog.i18n.CompactNumberFormatSymbols_en_ZM", "goog.i18n.CompactNumberFormatSymbols_eo", "goog.i18n.CompactNumberFormatSymbols_eo_001", "goog.i18n.CompactNumberFormatSymbols_es_AR", "goog.i18n.CompactNumberFormatSymbols_es_BO", "goog.i18n.CompactNumberFormatSymbols_es_CL", "goog.i18n.CompactNumberFormatSymbols_es_CO", "goog.i18n.CompactNumberFormatSymbols_es_CR", "goog.i18n.CompactNumberFormatSymbols_es_CU", 
"goog.i18n.CompactNumberFormatSymbols_es_DO", "goog.i18n.CompactNumberFormatSymbols_es_EC", "goog.i18n.CompactNumberFormatSymbols_es_GQ", "goog.i18n.CompactNumberFormatSymbols_es_GT", "goog.i18n.CompactNumberFormatSymbols_es_HN", "goog.i18n.CompactNumberFormatSymbols_es_MX", "goog.i18n.CompactNumberFormatSymbols_es_NI", "goog.i18n.CompactNumberFormatSymbols_es_PA", "goog.i18n.CompactNumberFormatSymbols_es_PE", "goog.i18n.CompactNumberFormatSymbols_es_PH", "goog.i18n.CompactNumberFormatSymbols_es_PR", 
"goog.i18n.CompactNumberFormatSymbols_es_PY", "goog.i18n.CompactNumberFormatSymbols_es_SV", "goog.i18n.CompactNumberFormatSymbols_es_US", "goog.i18n.CompactNumberFormatSymbols_es_UY", "goog.i18n.CompactNumberFormatSymbols_es_VE", "goog.i18n.CompactNumberFormatSymbols_ewo", "goog.i18n.CompactNumberFormatSymbols_ewo_CM", "goog.i18n.CompactNumberFormatSymbols_fa_AF", "goog.i18n.CompactNumberFormatSymbols_ff", "goog.i18n.CompactNumberFormatSymbols_ff_CM", "goog.i18n.CompactNumberFormatSymbols_ff_GN", 
"goog.i18n.CompactNumberFormatSymbols_ff_MR", "goog.i18n.CompactNumberFormatSymbols_ff_SN", "goog.i18n.CompactNumberFormatSymbols_fo", "goog.i18n.CompactNumberFormatSymbols_fo_FO", "goog.i18n.CompactNumberFormatSymbols_fr_BE", "goog.i18n.CompactNumberFormatSymbols_fr_BF", "goog.i18n.CompactNumberFormatSymbols_fr_BI", "goog.i18n.CompactNumberFormatSymbols_fr_BJ", "goog.i18n.CompactNumberFormatSymbols_fr_CD", "goog.i18n.CompactNumberFormatSymbols_fr_CF", "goog.i18n.CompactNumberFormatSymbols_fr_CG", 
"goog.i18n.CompactNumberFormatSymbols_fr_CH", "goog.i18n.CompactNumberFormatSymbols_fr_CI", "goog.i18n.CompactNumberFormatSymbols_fr_CM", "goog.i18n.CompactNumberFormatSymbols_fr_DJ", "goog.i18n.CompactNumberFormatSymbols_fr_DZ", "goog.i18n.CompactNumberFormatSymbols_fr_GA", "goog.i18n.CompactNumberFormatSymbols_fr_GN", "goog.i18n.CompactNumberFormatSymbols_fr_GQ", "goog.i18n.CompactNumberFormatSymbols_fr_HT", "goog.i18n.CompactNumberFormatSymbols_fr_KM", "goog.i18n.CompactNumberFormatSymbols_fr_LU", 
"goog.i18n.CompactNumberFormatSymbols_fr_MA", "goog.i18n.CompactNumberFormatSymbols_fr_MG", "goog.i18n.CompactNumberFormatSymbols_fr_ML", "goog.i18n.CompactNumberFormatSymbols_fr_MR", "goog.i18n.CompactNumberFormatSymbols_fr_MU", "goog.i18n.CompactNumberFormatSymbols_fr_NC", "goog.i18n.CompactNumberFormatSymbols_fr_NE", "goog.i18n.CompactNumberFormatSymbols_fr_PF", "goog.i18n.CompactNumberFormatSymbols_fr_RW", "goog.i18n.CompactNumberFormatSymbols_fr_SC", "goog.i18n.CompactNumberFormatSymbols_fr_SN", 
"goog.i18n.CompactNumberFormatSymbols_fr_SY", "goog.i18n.CompactNumberFormatSymbols_fr_TD", "goog.i18n.CompactNumberFormatSymbols_fr_TG", "goog.i18n.CompactNumberFormatSymbols_fr_TN", "goog.i18n.CompactNumberFormatSymbols_fr_VU", "goog.i18n.CompactNumberFormatSymbols_fr_WF", "goog.i18n.CompactNumberFormatSymbols_fur", "goog.i18n.CompactNumberFormatSymbols_fur_IT", "goog.i18n.CompactNumberFormatSymbols_fy", "goog.i18n.CompactNumberFormatSymbols_fy_NL", "goog.i18n.CompactNumberFormatSymbols_gd", "goog.i18n.CompactNumberFormatSymbols_gd_GB", 
"goog.i18n.CompactNumberFormatSymbols_gsw_FR", "goog.i18n.CompactNumberFormatSymbols_guz", "goog.i18n.CompactNumberFormatSymbols_guz_KE", "goog.i18n.CompactNumberFormatSymbols_gv", "goog.i18n.CompactNumberFormatSymbols_gv_IM", "goog.i18n.CompactNumberFormatSymbols_ha", "goog.i18n.CompactNumberFormatSymbols_ha_Latn", "goog.i18n.CompactNumberFormatSymbols_ha_Latn_GH", "goog.i18n.CompactNumberFormatSymbols_ha_Latn_NE", "goog.i18n.CompactNumberFormatSymbols_ha_Latn_NG", "goog.i18n.CompactNumberFormatSymbols_hr_BA", 
"goog.i18n.CompactNumberFormatSymbols_hsb", "goog.i18n.CompactNumberFormatSymbols_hsb_DE", "goog.i18n.CompactNumberFormatSymbols_ia", "goog.i18n.CompactNumberFormatSymbols_ia_FR", "goog.i18n.CompactNumberFormatSymbols_ig", "goog.i18n.CompactNumberFormatSymbols_ig_NG", "goog.i18n.CompactNumberFormatSymbols_ii", "goog.i18n.CompactNumberFormatSymbols_ii_CN", "goog.i18n.CompactNumberFormatSymbols_it_CH", "goog.i18n.CompactNumberFormatSymbols_jgo", "goog.i18n.CompactNumberFormatSymbols_jgo_CM", "goog.i18n.CompactNumberFormatSymbols_jmc", 
"goog.i18n.CompactNumberFormatSymbols_jmc_TZ", "goog.i18n.CompactNumberFormatSymbols_kab", "goog.i18n.CompactNumberFormatSymbols_kab_DZ", "goog.i18n.CompactNumberFormatSymbols_kam", "goog.i18n.CompactNumberFormatSymbols_kam_KE", "goog.i18n.CompactNumberFormatSymbols_kde", "goog.i18n.CompactNumberFormatSymbols_kde_TZ", "goog.i18n.CompactNumberFormatSymbols_kea", "goog.i18n.CompactNumberFormatSymbols_kea_CV", "goog.i18n.CompactNumberFormatSymbols_khq", "goog.i18n.CompactNumberFormatSymbols_khq_ML", 
"goog.i18n.CompactNumberFormatSymbols_ki", "goog.i18n.CompactNumberFormatSymbols_ki_KE", "goog.i18n.CompactNumberFormatSymbols_kk_Cyrl", "goog.i18n.CompactNumberFormatSymbols_kkj", "goog.i18n.CompactNumberFormatSymbols_kkj_CM", "goog.i18n.CompactNumberFormatSymbols_kl", "goog.i18n.CompactNumberFormatSymbols_kl_GL", "goog.i18n.CompactNumberFormatSymbols_kln", "goog.i18n.CompactNumberFormatSymbols_kln_KE", "goog.i18n.CompactNumberFormatSymbols_ko_KP", "goog.i18n.CompactNumberFormatSymbols_kok", "goog.i18n.CompactNumberFormatSymbols_kok_IN", 
"goog.i18n.CompactNumberFormatSymbols_ks", "goog.i18n.CompactNumberFormatSymbols_ks_Arab", "goog.i18n.CompactNumberFormatSymbols_ks_Arab_IN", "goog.i18n.CompactNumberFormatSymbols_ksb", "goog.i18n.CompactNumberFormatSymbols_ksb_TZ", "goog.i18n.CompactNumberFormatSymbols_ksf", "goog.i18n.CompactNumberFormatSymbols_ksf_CM", "goog.i18n.CompactNumberFormatSymbols_ksh", "goog.i18n.CompactNumberFormatSymbols_ksh_DE", "goog.i18n.CompactNumberFormatSymbols_kw", "goog.i18n.CompactNumberFormatSymbols_kw_GB", 
"goog.i18n.CompactNumberFormatSymbols_ky_Cyrl", "goog.i18n.CompactNumberFormatSymbols_lag", "goog.i18n.CompactNumberFormatSymbols_lag_TZ", "goog.i18n.CompactNumberFormatSymbols_lb", "goog.i18n.CompactNumberFormatSymbols_lb_LU", "goog.i18n.CompactNumberFormatSymbols_lg", "goog.i18n.CompactNumberFormatSymbols_lg_UG", "goog.i18n.CompactNumberFormatSymbols_lkt", "goog.i18n.CompactNumberFormatSymbols_lkt_US", "goog.i18n.CompactNumberFormatSymbols_ln_AO", "goog.i18n.CompactNumberFormatSymbols_ln_CF", "goog.i18n.CompactNumberFormatSymbols_ln_CG", 
"goog.i18n.CompactNumberFormatSymbols_lu", "goog.i18n.CompactNumberFormatSymbols_lu_CD", "goog.i18n.CompactNumberFormatSymbols_luo", "goog.i18n.CompactNumberFormatSymbols_luo_KE", "goog.i18n.CompactNumberFormatSymbols_luy", "goog.i18n.CompactNumberFormatSymbols_luy_KE", "goog.i18n.CompactNumberFormatSymbols_mas", "goog.i18n.CompactNumberFormatSymbols_mas_KE", "goog.i18n.CompactNumberFormatSymbols_mas_TZ", "goog.i18n.CompactNumberFormatSymbols_mer", "goog.i18n.CompactNumberFormatSymbols_mer_KE", "goog.i18n.CompactNumberFormatSymbols_mfe", 
"goog.i18n.CompactNumberFormatSymbols_mfe_MU", "goog.i18n.CompactNumberFormatSymbols_mg", "goog.i18n.CompactNumberFormatSymbols_mg_MG", "goog.i18n.CompactNumberFormatSymbols_mgh", "goog.i18n.CompactNumberFormatSymbols_mgh_MZ", "goog.i18n.CompactNumberFormatSymbols_mgo", "goog.i18n.CompactNumberFormatSymbols_mgo_CM", "goog.i18n.CompactNumberFormatSymbols_mn_Cyrl", "goog.i18n.CompactNumberFormatSymbols_ms_Latn", "goog.i18n.CompactNumberFormatSymbols_ms_Latn_BN", "goog.i18n.CompactNumberFormatSymbols_ms_Latn_SG", 
"goog.i18n.CompactNumberFormatSymbols_mua", "goog.i18n.CompactNumberFormatSymbols_mua_CM", "goog.i18n.CompactNumberFormatSymbols_naq", "goog.i18n.CompactNumberFormatSymbols_naq_NA", "goog.i18n.CompactNumberFormatSymbols_nd", "goog.i18n.CompactNumberFormatSymbols_nd_ZW", "goog.i18n.CompactNumberFormatSymbols_ne_IN", "goog.i18n.CompactNumberFormatSymbols_nl_AW", "goog.i18n.CompactNumberFormatSymbols_nl_BE", "goog.i18n.CompactNumberFormatSymbols_nl_BQ", "goog.i18n.CompactNumberFormatSymbols_nl_CW", 
"goog.i18n.CompactNumberFormatSymbols_nl_SR", "goog.i18n.CompactNumberFormatSymbols_nl_SX", "goog.i18n.CompactNumberFormatSymbols_nmg", "goog.i18n.CompactNumberFormatSymbols_nmg_CM", "goog.i18n.CompactNumberFormatSymbols_nn", "goog.i18n.CompactNumberFormatSymbols_nn_NO", "goog.i18n.CompactNumberFormatSymbols_nnh", "goog.i18n.CompactNumberFormatSymbols_nnh_CM", "goog.i18n.CompactNumberFormatSymbols_nr", "goog.i18n.CompactNumberFormatSymbols_nr_ZA", "goog.i18n.CompactNumberFormatSymbols_nso", "goog.i18n.CompactNumberFormatSymbols_nso_ZA", 
"goog.i18n.CompactNumberFormatSymbols_nus", "goog.i18n.CompactNumberFormatSymbols_nus_SD", "goog.i18n.CompactNumberFormatSymbols_nyn", "goog.i18n.CompactNumberFormatSymbols_nyn_UG", "goog.i18n.CompactNumberFormatSymbols_om", "goog.i18n.CompactNumberFormatSymbols_om_ET", "goog.i18n.CompactNumberFormatSymbols_om_KE", "goog.i18n.CompactNumberFormatSymbols_os", "goog.i18n.CompactNumberFormatSymbols_os_GE", "goog.i18n.CompactNumberFormatSymbols_os_RU", "goog.i18n.CompactNumberFormatSymbols_pa_Arab", "goog.i18n.CompactNumberFormatSymbols_pa_Arab_PK", 
"goog.i18n.CompactNumberFormatSymbols_pa_Guru", "goog.i18n.CompactNumberFormatSymbols_ps", "goog.i18n.CompactNumberFormatSymbols_ps_AF", "goog.i18n.CompactNumberFormatSymbols_pt_AO", "goog.i18n.CompactNumberFormatSymbols_pt_CV", "goog.i18n.CompactNumberFormatSymbols_pt_GW", "goog.i18n.CompactNumberFormatSymbols_pt_MO", "goog.i18n.CompactNumberFormatSymbols_pt_MZ", "goog.i18n.CompactNumberFormatSymbols_pt_ST", "goog.i18n.CompactNumberFormatSymbols_pt_TL", "goog.i18n.CompactNumberFormatSymbols_qu", 
"goog.i18n.CompactNumberFormatSymbols_qu_BO", "goog.i18n.CompactNumberFormatSymbols_qu_EC", "goog.i18n.CompactNumberFormatSymbols_qu_PE", "goog.i18n.CompactNumberFormatSymbols_rm", "goog.i18n.CompactNumberFormatSymbols_rm_CH", "goog.i18n.CompactNumberFormatSymbols_rn", "goog.i18n.CompactNumberFormatSymbols_rn_BI", "goog.i18n.CompactNumberFormatSymbols_ro_MD", "goog.i18n.CompactNumberFormatSymbols_rof", "goog.i18n.CompactNumberFormatSymbols_rof_TZ", "goog.i18n.CompactNumberFormatSymbols_ru_BY", "goog.i18n.CompactNumberFormatSymbols_ru_KG", 
"goog.i18n.CompactNumberFormatSymbols_ru_KZ", "goog.i18n.CompactNumberFormatSymbols_ru_MD", "goog.i18n.CompactNumberFormatSymbols_ru_UA", "goog.i18n.CompactNumberFormatSymbols_rw", "goog.i18n.CompactNumberFormatSymbols_rw_RW", "goog.i18n.CompactNumberFormatSymbols_rwk", "goog.i18n.CompactNumberFormatSymbols_rwk_TZ", "goog.i18n.CompactNumberFormatSymbols_sah", "goog.i18n.CompactNumberFormatSymbols_sah_RU", "goog.i18n.CompactNumberFormatSymbols_saq", "goog.i18n.CompactNumberFormatSymbols_saq_KE", "goog.i18n.CompactNumberFormatSymbols_sbp", 
"goog.i18n.CompactNumberFormatSymbols_sbp_TZ", "goog.i18n.CompactNumberFormatSymbols_se", "goog.i18n.CompactNumberFormatSymbols_se_FI", "goog.i18n.CompactNumberFormatSymbols_se_NO", "goog.i18n.CompactNumberFormatSymbols_se_SE", "goog.i18n.CompactNumberFormatSymbols_seh", "goog.i18n.CompactNumberFormatSymbols_seh_MZ", "goog.i18n.CompactNumberFormatSymbols_ses", "goog.i18n.CompactNumberFormatSymbols_ses_ML", "goog.i18n.CompactNumberFormatSymbols_sg", "goog.i18n.CompactNumberFormatSymbols_sg_CF", "goog.i18n.CompactNumberFormatSymbols_shi", 
"goog.i18n.CompactNumberFormatSymbols_shi_Latn", "goog.i18n.CompactNumberFormatSymbols_shi_Latn_MA", "goog.i18n.CompactNumberFormatSymbols_shi_Tfng", "goog.i18n.CompactNumberFormatSymbols_shi_Tfng_MA", "goog.i18n.CompactNumberFormatSymbols_smn", "goog.i18n.CompactNumberFormatSymbols_smn_FI", "goog.i18n.CompactNumberFormatSymbols_sn", "goog.i18n.CompactNumberFormatSymbols_sn_ZW", "goog.i18n.CompactNumberFormatSymbols_so", "goog.i18n.CompactNumberFormatSymbols_so_DJ", "goog.i18n.CompactNumberFormatSymbols_so_ET", 
"goog.i18n.CompactNumberFormatSymbols_so_KE", "goog.i18n.CompactNumberFormatSymbols_so_SO", "goog.i18n.CompactNumberFormatSymbols_sq_MK", "goog.i18n.CompactNumberFormatSymbols_sq_XK", "goog.i18n.CompactNumberFormatSymbols_sr_Cyrl", "goog.i18n.CompactNumberFormatSymbols_sr_Cyrl_BA", "goog.i18n.CompactNumberFormatSymbols_sr_Cyrl_ME", "goog.i18n.CompactNumberFormatSymbols_sr_Cyrl_XK", "goog.i18n.CompactNumberFormatSymbols_sr_Latn", "goog.i18n.CompactNumberFormatSymbols_sr_Latn_BA", "goog.i18n.CompactNumberFormatSymbols_sr_Latn_ME", 
"goog.i18n.CompactNumberFormatSymbols_sr_Latn_RS", "goog.i18n.CompactNumberFormatSymbols_sr_Latn_XK", "goog.i18n.CompactNumberFormatSymbols_ss", "goog.i18n.CompactNumberFormatSymbols_ss_SZ", "goog.i18n.CompactNumberFormatSymbols_ss_ZA", "goog.i18n.CompactNumberFormatSymbols_ssy", "goog.i18n.CompactNumberFormatSymbols_ssy_ER", "goog.i18n.CompactNumberFormatSymbols_sv_AX", "goog.i18n.CompactNumberFormatSymbols_sv_FI", "goog.i18n.CompactNumberFormatSymbols_sw_KE", "goog.i18n.CompactNumberFormatSymbols_sw_UG", 
"goog.i18n.CompactNumberFormatSymbols_swc", "goog.i18n.CompactNumberFormatSymbols_swc_CD", "goog.i18n.CompactNumberFormatSymbols_ta_LK", "goog.i18n.CompactNumberFormatSymbols_ta_MY", "goog.i18n.CompactNumberFormatSymbols_ta_SG", "goog.i18n.CompactNumberFormatSymbols_teo", "goog.i18n.CompactNumberFormatSymbols_teo_KE", "goog.i18n.CompactNumberFormatSymbols_teo_UG", "goog.i18n.CompactNumberFormatSymbols_ti", "goog.i18n.CompactNumberFormatSymbols_ti_ER", "goog.i18n.CompactNumberFormatSymbols_ti_ET", 
"goog.i18n.CompactNumberFormatSymbols_tn", "goog.i18n.CompactNumberFormatSymbols_tn_BW", "goog.i18n.CompactNumberFormatSymbols_tn_ZA", "goog.i18n.CompactNumberFormatSymbols_to", "goog.i18n.CompactNumberFormatSymbols_to_TO", "goog.i18n.CompactNumberFormatSymbols_tr_CY", "goog.i18n.CompactNumberFormatSymbols_ts", "goog.i18n.CompactNumberFormatSymbols_ts_ZA", "goog.i18n.CompactNumberFormatSymbols_twq", "goog.i18n.CompactNumberFormatSymbols_twq_NE", "goog.i18n.CompactNumberFormatSymbols_tzm", "goog.i18n.CompactNumberFormatSymbols_tzm_Latn", 
"goog.i18n.CompactNumberFormatSymbols_tzm_Latn_MA", "goog.i18n.CompactNumberFormatSymbols_ug", "goog.i18n.CompactNumberFormatSymbols_ug_Arab", "goog.i18n.CompactNumberFormatSymbols_ug_Arab_CN", "goog.i18n.CompactNumberFormatSymbols_ur_IN", "goog.i18n.CompactNumberFormatSymbols_uz_Arab", "goog.i18n.CompactNumberFormatSymbols_uz_Arab_AF", "goog.i18n.CompactNumberFormatSymbols_uz_Cyrl", "goog.i18n.CompactNumberFormatSymbols_uz_Cyrl_UZ", "goog.i18n.CompactNumberFormatSymbols_uz_Latn", "goog.i18n.CompactNumberFormatSymbols_vai", 
"goog.i18n.CompactNumberFormatSymbols_vai_Latn", "goog.i18n.CompactNumberFormatSymbols_vai_Latn_LR", "goog.i18n.CompactNumberFormatSymbols_vai_Vaii", "goog.i18n.CompactNumberFormatSymbols_vai_Vaii_LR", "goog.i18n.CompactNumberFormatSymbols_ve", "goog.i18n.CompactNumberFormatSymbols_ve_ZA", "goog.i18n.CompactNumberFormatSymbols_vo", "goog.i18n.CompactNumberFormatSymbols_vo_001", "goog.i18n.CompactNumberFormatSymbols_vun", "goog.i18n.CompactNumberFormatSymbols_vun_TZ", "goog.i18n.CompactNumberFormatSymbols_wae", 
"goog.i18n.CompactNumberFormatSymbols_wae_CH", "goog.i18n.CompactNumberFormatSymbols_xog", "goog.i18n.CompactNumberFormatSymbols_xog_UG", "goog.i18n.CompactNumberFormatSymbols_yav", "goog.i18n.CompactNumberFormatSymbols_yav_CM", "goog.i18n.CompactNumberFormatSymbols_yi", "goog.i18n.CompactNumberFormatSymbols_yi_001", "goog.i18n.CompactNumberFormatSymbols_yo", "goog.i18n.CompactNumberFormatSymbols_yo_BJ", "goog.i18n.CompactNumberFormatSymbols_yo_NG", "goog.i18n.CompactNumberFormatSymbols_zgh", "goog.i18n.CompactNumberFormatSymbols_zgh_MA", 
"goog.i18n.CompactNumberFormatSymbols_zh_Hans", "goog.i18n.CompactNumberFormatSymbols_zh_Hans_HK", "goog.i18n.CompactNumberFormatSymbols_zh_Hans_MO", "goog.i18n.CompactNumberFormatSymbols_zh_Hans_SG", "goog.i18n.CompactNumberFormatSymbols_zh_Hant", "goog.i18n.CompactNumberFormatSymbols_zh_Hant_HK", "goog.i18n.CompactNumberFormatSymbols_zh_Hant_MO", "goog.i18n.CompactNumberFormatSymbols_zh_Hant_TW"], [], false);
goog.addDependency("i18n/currency.js", ["goog.i18n.currency", "goog.i18n.currency.CurrencyInfo", "goog.i18n.currency.CurrencyInfoTier2"], [], false);
goog.addDependency("i18n/currency_test.js", ["goog.i18n.currencyTest"], ["goog.i18n.NumberFormat", "goog.i18n.currency", "goog.i18n.currency.CurrencyInfo", "goog.object", "goog.testing.PropertyReplacer", "goog.testing.jsunit"], false);
goog.addDependency("i18n/currencycodemap.js", ["goog.i18n.currencyCodeMap", "goog.i18n.currencyCodeMapTier2"], [], false);
goog.addDependency("i18n/datetimeformat.js", ["goog.i18n.DateTimeFormat", "goog.i18n.DateTimeFormat.Format"], ["goog.asserts", "goog.date", "goog.i18n.DateTimeSymbols", "goog.i18n.TimeZone", "goog.string"], false);
goog.addDependency("i18n/datetimeformat_test.js", ["goog.i18n.DateTimeFormatTest"], ["goog.date.Date", "goog.date.DateTime", "goog.i18n.DateTimeFormat", "goog.i18n.DateTimePatterns", "goog.i18n.DateTimePatterns_de", "goog.i18n.DateTimePatterns_en", "goog.i18n.DateTimePatterns_fa", "goog.i18n.DateTimePatterns_fr", "goog.i18n.DateTimePatterns_ja", "goog.i18n.DateTimePatterns_sv", "goog.i18n.DateTimeSymbols", "goog.i18n.DateTimeSymbols_ar_AE", "goog.i18n.DateTimeSymbols_ar_SA", "goog.i18n.DateTimeSymbols_bn_BD", 
"goog.i18n.DateTimeSymbols_de", "goog.i18n.DateTimeSymbols_en", "goog.i18n.DateTimeSymbols_en_GB", "goog.i18n.DateTimeSymbols_en_IE", "goog.i18n.DateTimeSymbols_en_IN", "goog.i18n.DateTimeSymbols_en_US", "goog.i18n.DateTimeSymbols_fa", "goog.i18n.DateTimeSymbols_fr", "goog.i18n.DateTimeSymbols_fr_DJ", "goog.i18n.DateTimeSymbols_he_IL", "goog.i18n.DateTimeSymbols_ja", "goog.i18n.DateTimeSymbols_ro_RO", "goog.i18n.DateTimeSymbols_sv", "goog.i18n.TimeZone", "goog.testing.jsunit"], false);
goog.addDependency("i18n/datetimeparse.js", ["goog.i18n.DateTimeParse"], ["goog.date", "goog.i18n.DateTimeFormat", "goog.i18n.DateTimeSymbols"], false);
goog.addDependency("i18n/datetimeparse_test.js", ["goog.i18n.DateTimeParseTest"], ["goog.date.Date", "goog.i18n.DateTimeFormat", "goog.i18n.DateTimeParse", "goog.i18n.DateTimeSymbols", "goog.i18n.DateTimeSymbols_en", "goog.i18n.DateTimeSymbols_fa", "goog.i18n.DateTimeSymbols_fr", "goog.i18n.DateTimeSymbols_pl", "goog.i18n.DateTimeSymbols_zh", "goog.testing.ExpectedFailures", "goog.testing.jsunit", "goog.userAgent"], false);
goog.addDependency("i18n/datetimepatterns.js", ["goog.i18n.DateTimePatterns", "goog.i18n.DateTimePatterns_af", "goog.i18n.DateTimePatterns_am", "goog.i18n.DateTimePatterns_ar", "goog.i18n.DateTimePatterns_az", "goog.i18n.DateTimePatterns_bg", "goog.i18n.DateTimePatterns_bn", "goog.i18n.DateTimePatterns_br", "goog.i18n.DateTimePatterns_ca", "goog.i18n.DateTimePatterns_chr", "goog.i18n.DateTimePatterns_cs", "goog.i18n.DateTimePatterns_cy", "goog.i18n.DateTimePatterns_da", "goog.i18n.DateTimePatterns_de", 
"goog.i18n.DateTimePatterns_de_AT", "goog.i18n.DateTimePatterns_de_CH", "goog.i18n.DateTimePatterns_el", "goog.i18n.DateTimePatterns_en", "goog.i18n.DateTimePatterns_en_AU", "goog.i18n.DateTimePatterns_en_GB", "goog.i18n.DateTimePatterns_en_IE", "goog.i18n.DateTimePatterns_en_IN", "goog.i18n.DateTimePatterns_en_SG", "goog.i18n.DateTimePatterns_en_US", "goog.i18n.DateTimePatterns_en_ZA", "goog.i18n.DateTimePatterns_es", "goog.i18n.DateTimePatterns_es_419", "goog.i18n.DateTimePatterns_es_ES", "goog.i18n.DateTimePatterns_et", 
"goog.i18n.DateTimePatterns_eu", "goog.i18n.DateTimePatterns_fa", "goog.i18n.DateTimePatterns_fi", "goog.i18n.DateTimePatterns_fil", "goog.i18n.DateTimePatterns_fr", "goog.i18n.DateTimePatterns_fr_CA", "goog.i18n.DateTimePatterns_ga", "goog.i18n.DateTimePatterns_gl", "goog.i18n.DateTimePatterns_gsw", "goog.i18n.DateTimePatterns_gu", "goog.i18n.DateTimePatterns_haw", "goog.i18n.DateTimePatterns_he", "goog.i18n.DateTimePatterns_hi", "goog.i18n.DateTimePatterns_hr", "goog.i18n.DateTimePatterns_hu", 
"goog.i18n.DateTimePatterns_hy", "goog.i18n.DateTimePatterns_id", "goog.i18n.DateTimePatterns_in", "goog.i18n.DateTimePatterns_is", "goog.i18n.DateTimePatterns_it", "goog.i18n.DateTimePatterns_iw", "goog.i18n.DateTimePatterns_ja", "goog.i18n.DateTimePatterns_ka", "goog.i18n.DateTimePatterns_kk", "goog.i18n.DateTimePatterns_km", "goog.i18n.DateTimePatterns_kn", "goog.i18n.DateTimePatterns_ko", "goog.i18n.DateTimePatterns_ky", "goog.i18n.DateTimePatterns_ln", "goog.i18n.DateTimePatterns_lo", "goog.i18n.DateTimePatterns_lt", 
"goog.i18n.DateTimePatterns_lv", "goog.i18n.DateTimePatterns_mk", "goog.i18n.DateTimePatterns_ml", "goog.i18n.DateTimePatterns_mn", "goog.i18n.DateTimePatterns_mo", "goog.i18n.DateTimePatterns_mr", "goog.i18n.DateTimePatterns_ms", "goog.i18n.DateTimePatterns_mt", "goog.i18n.DateTimePatterns_my", "goog.i18n.DateTimePatterns_nb", "goog.i18n.DateTimePatterns_ne", "goog.i18n.DateTimePatterns_nl", "goog.i18n.DateTimePatterns_no", "goog.i18n.DateTimePatterns_no_NO", "goog.i18n.DateTimePatterns_or", "goog.i18n.DateTimePatterns_pa", 
"goog.i18n.DateTimePatterns_pl", "goog.i18n.DateTimePatterns_pt", "goog.i18n.DateTimePatterns_pt_BR", "goog.i18n.DateTimePatterns_pt_PT", "goog.i18n.DateTimePatterns_ro", "goog.i18n.DateTimePatterns_ru", "goog.i18n.DateTimePatterns_sh", "goog.i18n.DateTimePatterns_si", "goog.i18n.DateTimePatterns_sk", "goog.i18n.DateTimePatterns_sl", "goog.i18n.DateTimePatterns_sq", "goog.i18n.DateTimePatterns_sr", "goog.i18n.DateTimePatterns_sv", "goog.i18n.DateTimePatterns_sw", "goog.i18n.DateTimePatterns_ta", 
"goog.i18n.DateTimePatterns_te", "goog.i18n.DateTimePatterns_th", "goog.i18n.DateTimePatterns_tl", "goog.i18n.DateTimePatterns_tr", "goog.i18n.DateTimePatterns_uk", "goog.i18n.DateTimePatterns_ur", "goog.i18n.DateTimePatterns_uz", "goog.i18n.DateTimePatterns_vi", "goog.i18n.DateTimePatterns_zh", "goog.i18n.DateTimePatterns_zh_CN", "goog.i18n.DateTimePatterns_zh_HK", "goog.i18n.DateTimePatterns_zh_TW", "goog.i18n.DateTimePatterns_zu"], [], false);
goog.addDependency("i18n/datetimepatternsext.js", ["goog.i18n.DateTimePatternsExt", "goog.i18n.DateTimePatterns_af_NA", "goog.i18n.DateTimePatterns_af_ZA", "goog.i18n.DateTimePatterns_agq", "goog.i18n.DateTimePatterns_agq_CM", "goog.i18n.DateTimePatterns_ak", "goog.i18n.DateTimePatterns_ak_GH", "goog.i18n.DateTimePatterns_am_ET", "goog.i18n.DateTimePatterns_ar_001", "goog.i18n.DateTimePatterns_ar_AE", "goog.i18n.DateTimePatterns_ar_BH", "goog.i18n.DateTimePatterns_ar_DJ", "goog.i18n.DateTimePatterns_ar_DZ", 
"goog.i18n.DateTimePatterns_ar_EG", "goog.i18n.DateTimePatterns_ar_EH", "goog.i18n.DateTimePatterns_ar_ER", "goog.i18n.DateTimePatterns_ar_IL", "goog.i18n.DateTimePatterns_ar_IQ", "goog.i18n.DateTimePatterns_ar_JO", "goog.i18n.DateTimePatterns_ar_KM", "goog.i18n.DateTimePatterns_ar_KW", "goog.i18n.DateTimePatterns_ar_LB", "goog.i18n.DateTimePatterns_ar_LY", "goog.i18n.DateTimePatterns_ar_MA", "goog.i18n.DateTimePatterns_ar_MR", "goog.i18n.DateTimePatterns_ar_OM", "goog.i18n.DateTimePatterns_ar_PS", 
"goog.i18n.DateTimePatterns_ar_QA", "goog.i18n.DateTimePatterns_ar_SA", "goog.i18n.DateTimePatterns_ar_SD", "goog.i18n.DateTimePatterns_ar_SO", "goog.i18n.DateTimePatterns_ar_SS", "goog.i18n.DateTimePatterns_ar_SY", "goog.i18n.DateTimePatterns_ar_TD", "goog.i18n.DateTimePatterns_ar_TN", "goog.i18n.DateTimePatterns_ar_YE", "goog.i18n.DateTimePatterns_as", "goog.i18n.DateTimePatterns_as_IN", "goog.i18n.DateTimePatterns_asa", "goog.i18n.DateTimePatterns_asa_TZ", "goog.i18n.DateTimePatterns_az_Cyrl", 
"goog.i18n.DateTimePatterns_az_Cyrl_AZ", "goog.i18n.DateTimePatterns_az_Latn", "goog.i18n.DateTimePatterns_az_Latn_AZ", "goog.i18n.DateTimePatterns_bas", "goog.i18n.DateTimePatterns_bas_CM", "goog.i18n.DateTimePatterns_be", "goog.i18n.DateTimePatterns_be_BY", "goog.i18n.DateTimePatterns_bem", "goog.i18n.DateTimePatterns_bem_ZM", "goog.i18n.DateTimePatterns_bez", "goog.i18n.DateTimePatterns_bez_TZ", "goog.i18n.DateTimePatterns_bg_BG", "goog.i18n.DateTimePatterns_bm", "goog.i18n.DateTimePatterns_bm_Latn", 
"goog.i18n.DateTimePatterns_bm_Latn_ML", "goog.i18n.DateTimePatterns_bn_BD", "goog.i18n.DateTimePatterns_bn_IN", "goog.i18n.DateTimePatterns_bo", "goog.i18n.DateTimePatterns_bo_CN", "goog.i18n.DateTimePatterns_bo_IN", "goog.i18n.DateTimePatterns_br_FR", "goog.i18n.DateTimePatterns_brx", "goog.i18n.DateTimePatterns_brx_IN", "goog.i18n.DateTimePatterns_bs", "goog.i18n.DateTimePatterns_bs_Cyrl", "goog.i18n.DateTimePatterns_bs_Cyrl_BA", "goog.i18n.DateTimePatterns_bs_Latn", "goog.i18n.DateTimePatterns_bs_Latn_BA", 
"goog.i18n.DateTimePatterns_ca_AD", "goog.i18n.DateTimePatterns_ca_ES", "goog.i18n.DateTimePatterns_ca_FR", "goog.i18n.DateTimePatterns_ca_IT", "goog.i18n.DateTimePatterns_cgg", "goog.i18n.DateTimePatterns_cgg_UG", "goog.i18n.DateTimePatterns_chr_US", "goog.i18n.DateTimePatterns_cs_CZ", "goog.i18n.DateTimePatterns_cy_GB", "goog.i18n.DateTimePatterns_da_DK", "goog.i18n.DateTimePatterns_da_GL", "goog.i18n.DateTimePatterns_dav", "goog.i18n.DateTimePatterns_dav_KE", "goog.i18n.DateTimePatterns_de_BE", 
"goog.i18n.DateTimePatterns_de_DE", "goog.i18n.DateTimePatterns_de_LI", "goog.i18n.DateTimePatterns_de_LU", "goog.i18n.DateTimePatterns_dje", "goog.i18n.DateTimePatterns_dje_NE", "goog.i18n.DateTimePatterns_dsb", "goog.i18n.DateTimePatterns_dsb_DE", "goog.i18n.DateTimePatterns_dua", "goog.i18n.DateTimePatterns_dua_CM", "goog.i18n.DateTimePatterns_dyo", "goog.i18n.DateTimePatterns_dyo_SN", "goog.i18n.DateTimePatterns_dz", "goog.i18n.DateTimePatterns_dz_BT", "goog.i18n.DateTimePatterns_ebu", "goog.i18n.DateTimePatterns_ebu_KE", 
"goog.i18n.DateTimePatterns_ee", "goog.i18n.DateTimePatterns_ee_GH", "goog.i18n.DateTimePatterns_ee_TG", "goog.i18n.DateTimePatterns_el_CY", "goog.i18n.DateTimePatterns_el_GR", "goog.i18n.DateTimePatterns_en_001", "goog.i18n.DateTimePatterns_en_150", "goog.i18n.DateTimePatterns_en_AG", "goog.i18n.DateTimePatterns_en_AI", "goog.i18n.DateTimePatterns_en_AS", "goog.i18n.DateTimePatterns_en_BB", "goog.i18n.DateTimePatterns_en_BE", "goog.i18n.DateTimePatterns_en_BM", "goog.i18n.DateTimePatterns_en_BS", 
"goog.i18n.DateTimePatterns_en_BW", "goog.i18n.DateTimePatterns_en_BZ", "goog.i18n.DateTimePatterns_en_CA", "goog.i18n.DateTimePatterns_en_CC", "goog.i18n.DateTimePatterns_en_CK", "goog.i18n.DateTimePatterns_en_CM", "goog.i18n.DateTimePatterns_en_CX", "goog.i18n.DateTimePatterns_en_DG", "goog.i18n.DateTimePatterns_en_DM", "goog.i18n.DateTimePatterns_en_ER", "goog.i18n.DateTimePatterns_en_FJ", "goog.i18n.DateTimePatterns_en_FK", "goog.i18n.DateTimePatterns_en_FM", "goog.i18n.DateTimePatterns_en_GD", 
"goog.i18n.DateTimePatterns_en_GG", "goog.i18n.DateTimePatterns_en_GH", "goog.i18n.DateTimePatterns_en_GI", "goog.i18n.DateTimePatterns_en_GM", "goog.i18n.DateTimePatterns_en_GU", "goog.i18n.DateTimePatterns_en_GY", "goog.i18n.DateTimePatterns_en_HK", "goog.i18n.DateTimePatterns_en_IM", "goog.i18n.DateTimePatterns_en_IO", "goog.i18n.DateTimePatterns_en_JE", "goog.i18n.DateTimePatterns_en_JM", "goog.i18n.DateTimePatterns_en_KE", "goog.i18n.DateTimePatterns_en_KI", "goog.i18n.DateTimePatterns_en_KN", 
"goog.i18n.DateTimePatterns_en_KY", "goog.i18n.DateTimePatterns_en_LC", "goog.i18n.DateTimePatterns_en_LR", "goog.i18n.DateTimePatterns_en_LS", "goog.i18n.DateTimePatterns_en_MG", "goog.i18n.DateTimePatterns_en_MH", "goog.i18n.DateTimePatterns_en_MO", "goog.i18n.DateTimePatterns_en_MP", "goog.i18n.DateTimePatterns_en_MS", "goog.i18n.DateTimePatterns_en_MT", "goog.i18n.DateTimePatterns_en_MU", "goog.i18n.DateTimePatterns_en_MW", "goog.i18n.DateTimePatterns_en_MY", "goog.i18n.DateTimePatterns_en_NA", 
"goog.i18n.DateTimePatterns_en_NF", "goog.i18n.DateTimePatterns_en_NG", "goog.i18n.DateTimePatterns_en_NR", "goog.i18n.DateTimePatterns_en_NU", "goog.i18n.DateTimePatterns_en_NZ", "goog.i18n.DateTimePatterns_en_PG", "goog.i18n.DateTimePatterns_en_PH", "goog.i18n.DateTimePatterns_en_PK", "goog.i18n.DateTimePatterns_en_PN", "goog.i18n.DateTimePatterns_en_PR", "goog.i18n.DateTimePatterns_en_PW", "goog.i18n.DateTimePatterns_en_RW", "goog.i18n.DateTimePatterns_en_SB", "goog.i18n.DateTimePatterns_en_SC", 
"goog.i18n.DateTimePatterns_en_SD", "goog.i18n.DateTimePatterns_en_SH", "goog.i18n.DateTimePatterns_en_SL", "goog.i18n.DateTimePatterns_en_SS", "goog.i18n.DateTimePatterns_en_SX", "goog.i18n.DateTimePatterns_en_SZ", "goog.i18n.DateTimePatterns_en_TC", "goog.i18n.DateTimePatterns_en_TK", "goog.i18n.DateTimePatterns_en_TO", "goog.i18n.DateTimePatterns_en_TT", "goog.i18n.DateTimePatterns_en_TV", "goog.i18n.DateTimePatterns_en_TZ", "goog.i18n.DateTimePatterns_en_UG", "goog.i18n.DateTimePatterns_en_UM", 
"goog.i18n.DateTimePatterns_en_US_POSIX", "goog.i18n.DateTimePatterns_en_VC", "goog.i18n.DateTimePatterns_en_VG", "goog.i18n.DateTimePatterns_en_VI", "goog.i18n.DateTimePatterns_en_VU", "goog.i18n.DateTimePatterns_en_WS", "goog.i18n.DateTimePatterns_en_ZM", "goog.i18n.DateTimePatterns_en_ZW", "goog.i18n.DateTimePatterns_eo", "goog.i18n.DateTimePatterns_es_AR", "goog.i18n.DateTimePatterns_es_BO", "goog.i18n.DateTimePatterns_es_CL", "goog.i18n.DateTimePatterns_es_CO", "goog.i18n.DateTimePatterns_es_CR", 
"goog.i18n.DateTimePatterns_es_CU", "goog.i18n.DateTimePatterns_es_DO", "goog.i18n.DateTimePatterns_es_EA", "goog.i18n.DateTimePatterns_es_EC", "goog.i18n.DateTimePatterns_es_GQ", "goog.i18n.DateTimePatterns_es_GT", "goog.i18n.DateTimePatterns_es_HN", "goog.i18n.DateTimePatterns_es_IC", "goog.i18n.DateTimePatterns_es_MX", "goog.i18n.DateTimePatterns_es_NI", "goog.i18n.DateTimePatterns_es_PA", "goog.i18n.DateTimePatterns_es_PE", "goog.i18n.DateTimePatterns_es_PH", "goog.i18n.DateTimePatterns_es_PR", 
"goog.i18n.DateTimePatterns_es_PY", "goog.i18n.DateTimePatterns_es_SV", "goog.i18n.DateTimePatterns_es_US", "goog.i18n.DateTimePatterns_es_UY", "goog.i18n.DateTimePatterns_es_VE", "goog.i18n.DateTimePatterns_et_EE", "goog.i18n.DateTimePatterns_eu_ES", "goog.i18n.DateTimePatterns_ewo", "goog.i18n.DateTimePatterns_ewo_CM", "goog.i18n.DateTimePatterns_fa_AF", "goog.i18n.DateTimePatterns_fa_IR", "goog.i18n.DateTimePatterns_ff", "goog.i18n.DateTimePatterns_ff_CM", "goog.i18n.DateTimePatterns_ff_GN", "goog.i18n.DateTimePatterns_ff_MR", 
"goog.i18n.DateTimePatterns_ff_SN", "goog.i18n.DateTimePatterns_fi_FI", "goog.i18n.DateTimePatterns_fil_PH", "goog.i18n.DateTimePatterns_fo", "goog.i18n.DateTimePatterns_fo_FO", "goog.i18n.DateTimePatterns_fr_BE", "goog.i18n.DateTimePatterns_fr_BF", "goog.i18n.DateTimePatterns_fr_BI", "goog.i18n.DateTimePatterns_fr_BJ", "goog.i18n.DateTimePatterns_fr_BL", "goog.i18n.DateTimePatterns_fr_CD", "goog.i18n.DateTimePatterns_fr_CF", "goog.i18n.DateTimePatterns_fr_CG", "goog.i18n.DateTimePatterns_fr_CH", 
"goog.i18n.DateTimePatterns_fr_CI", "goog.i18n.DateTimePatterns_fr_CM", "goog.i18n.DateTimePatterns_fr_DJ", "goog.i18n.DateTimePatterns_fr_DZ", "goog.i18n.DateTimePatterns_fr_FR", "goog.i18n.DateTimePatterns_fr_GA", "goog.i18n.DateTimePatterns_fr_GF", "goog.i18n.DateTimePatterns_fr_GN", "goog.i18n.DateTimePatterns_fr_GP", "goog.i18n.DateTimePatterns_fr_GQ", "goog.i18n.DateTimePatterns_fr_HT", "goog.i18n.DateTimePatterns_fr_KM", "goog.i18n.DateTimePatterns_fr_LU", "goog.i18n.DateTimePatterns_fr_MA", 
"goog.i18n.DateTimePatterns_fr_MC", "goog.i18n.DateTimePatterns_fr_MF", "goog.i18n.DateTimePatterns_fr_MG", "goog.i18n.DateTimePatterns_fr_ML", "goog.i18n.DateTimePatterns_fr_MQ", "goog.i18n.DateTimePatterns_fr_MR", "goog.i18n.DateTimePatterns_fr_MU", "goog.i18n.DateTimePatterns_fr_NC", "goog.i18n.DateTimePatterns_fr_NE", "goog.i18n.DateTimePatterns_fr_PF", "goog.i18n.DateTimePatterns_fr_PM", "goog.i18n.DateTimePatterns_fr_RE", "goog.i18n.DateTimePatterns_fr_RW", "goog.i18n.DateTimePatterns_fr_SC", 
"goog.i18n.DateTimePatterns_fr_SN", "goog.i18n.DateTimePatterns_fr_SY", "goog.i18n.DateTimePatterns_fr_TD", "goog.i18n.DateTimePatterns_fr_TG", "goog.i18n.DateTimePatterns_fr_TN", "goog.i18n.DateTimePatterns_fr_VU", "goog.i18n.DateTimePatterns_fr_WF", "goog.i18n.DateTimePatterns_fr_YT", "goog.i18n.DateTimePatterns_fur", "goog.i18n.DateTimePatterns_fur_IT", "goog.i18n.DateTimePatterns_fy", "goog.i18n.DateTimePatterns_fy_NL", "goog.i18n.DateTimePatterns_ga_IE", "goog.i18n.DateTimePatterns_gd", "goog.i18n.DateTimePatterns_gd_GB", 
"goog.i18n.DateTimePatterns_gl_ES", "goog.i18n.DateTimePatterns_gsw_CH", "goog.i18n.DateTimePatterns_gsw_FR", "goog.i18n.DateTimePatterns_gsw_LI", "goog.i18n.DateTimePatterns_gu_IN", "goog.i18n.DateTimePatterns_guz", "goog.i18n.DateTimePatterns_guz_KE", "goog.i18n.DateTimePatterns_gv", "goog.i18n.DateTimePatterns_gv_IM", "goog.i18n.DateTimePatterns_ha", "goog.i18n.DateTimePatterns_ha_Latn", "goog.i18n.DateTimePatterns_ha_Latn_GH", "goog.i18n.DateTimePatterns_ha_Latn_NE", "goog.i18n.DateTimePatterns_ha_Latn_NG", 
"goog.i18n.DateTimePatterns_haw_US", "goog.i18n.DateTimePatterns_he_IL", "goog.i18n.DateTimePatterns_hi_IN", "goog.i18n.DateTimePatterns_hr_BA", "goog.i18n.DateTimePatterns_hr_HR", "goog.i18n.DateTimePatterns_hsb", "goog.i18n.DateTimePatterns_hsb_DE", "goog.i18n.DateTimePatterns_hu_HU", "goog.i18n.DateTimePatterns_hy_AM", "goog.i18n.DateTimePatterns_id_ID", "goog.i18n.DateTimePatterns_ig", "goog.i18n.DateTimePatterns_ig_NG", "goog.i18n.DateTimePatterns_ii", "goog.i18n.DateTimePatterns_ii_CN", "goog.i18n.DateTimePatterns_is_IS", 
"goog.i18n.DateTimePatterns_it_CH", "goog.i18n.DateTimePatterns_it_IT", "goog.i18n.DateTimePatterns_it_SM", "goog.i18n.DateTimePatterns_ja_JP", "goog.i18n.DateTimePatterns_jgo", "goog.i18n.DateTimePatterns_jgo_CM", "goog.i18n.DateTimePatterns_jmc", "goog.i18n.DateTimePatterns_jmc_TZ", "goog.i18n.DateTimePatterns_ka_GE", "goog.i18n.DateTimePatterns_kab", "goog.i18n.DateTimePatterns_kab_DZ", "goog.i18n.DateTimePatterns_kam", "goog.i18n.DateTimePatterns_kam_KE", "goog.i18n.DateTimePatterns_kde", "goog.i18n.DateTimePatterns_kde_TZ", 
"goog.i18n.DateTimePatterns_kea", "goog.i18n.DateTimePatterns_kea_CV", "goog.i18n.DateTimePatterns_khq", "goog.i18n.DateTimePatterns_khq_ML", "goog.i18n.DateTimePatterns_ki", "goog.i18n.DateTimePatterns_ki_KE", "goog.i18n.DateTimePatterns_kk_Cyrl", "goog.i18n.DateTimePatterns_kk_Cyrl_KZ", "goog.i18n.DateTimePatterns_kkj", "goog.i18n.DateTimePatterns_kkj_CM", "goog.i18n.DateTimePatterns_kl", "goog.i18n.DateTimePatterns_kl_GL", "goog.i18n.DateTimePatterns_kln", "goog.i18n.DateTimePatterns_kln_KE", 
"goog.i18n.DateTimePatterns_km_KH", "goog.i18n.DateTimePatterns_kn_IN", "goog.i18n.DateTimePatterns_ko_KP", "goog.i18n.DateTimePatterns_ko_KR", "goog.i18n.DateTimePatterns_kok", "goog.i18n.DateTimePatterns_kok_IN", "goog.i18n.DateTimePatterns_ks", "goog.i18n.DateTimePatterns_ks_Arab", "goog.i18n.DateTimePatterns_ks_Arab_IN", "goog.i18n.DateTimePatterns_ksb", "goog.i18n.DateTimePatterns_ksb_TZ", "goog.i18n.DateTimePatterns_ksf", "goog.i18n.DateTimePatterns_ksf_CM", "goog.i18n.DateTimePatterns_ksh", 
"goog.i18n.DateTimePatterns_ksh_DE", "goog.i18n.DateTimePatterns_kw", "goog.i18n.DateTimePatterns_kw_GB", "goog.i18n.DateTimePatterns_ky_Cyrl", "goog.i18n.DateTimePatterns_ky_Cyrl_KG", "goog.i18n.DateTimePatterns_lag", "goog.i18n.DateTimePatterns_lag_TZ", "goog.i18n.DateTimePatterns_lb", "goog.i18n.DateTimePatterns_lb_LU", "goog.i18n.DateTimePatterns_lg", "goog.i18n.DateTimePatterns_lg_UG", "goog.i18n.DateTimePatterns_lkt", "goog.i18n.DateTimePatterns_lkt_US", "goog.i18n.DateTimePatterns_ln_AO", 
"goog.i18n.DateTimePatterns_ln_CD", "goog.i18n.DateTimePatterns_ln_CF", "goog.i18n.DateTimePatterns_ln_CG", "goog.i18n.DateTimePatterns_lo_LA", "goog.i18n.DateTimePatterns_lt_LT", "goog.i18n.DateTimePatterns_lu", "goog.i18n.DateTimePatterns_lu_CD", "goog.i18n.DateTimePatterns_luo", "goog.i18n.DateTimePatterns_luo_KE", "goog.i18n.DateTimePatterns_luy", "goog.i18n.DateTimePatterns_luy_KE", "goog.i18n.DateTimePatterns_lv_LV", "goog.i18n.DateTimePatterns_mas", "goog.i18n.DateTimePatterns_mas_KE", "goog.i18n.DateTimePatterns_mas_TZ", 
"goog.i18n.DateTimePatterns_mer", "goog.i18n.DateTimePatterns_mer_KE", "goog.i18n.DateTimePatterns_mfe", "goog.i18n.DateTimePatterns_mfe_MU", "goog.i18n.DateTimePatterns_mg", "goog.i18n.DateTimePatterns_mg_MG", "goog.i18n.DateTimePatterns_mgh", "goog.i18n.DateTimePatterns_mgh_MZ", "goog.i18n.DateTimePatterns_mgo", "goog.i18n.DateTimePatterns_mgo_CM", "goog.i18n.DateTimePatterns_mk_MK", "goog.i18n.DateTimePatterns_ml_IN", "goog.i18n.DateTimePatterns_mn_Cyrl", "goog.i18n.DateTimePatterns_mn_Cyrl_MN", 
"goog.i18n.DateTimePatterns_mr_IN", "goog.i18n.DateTimePatterns_ms_Latn", "goog.i18n.DateTimePatterns_ms_Latn_BN", "goog.i18n.DateTimePatterns_ms_Latn_MY", "goog.i18n.DateTimePatterns_ms_Latn_SG", "goog.i18n.DateTimePatterns_mt_MT", "goog.i18n.DateTimePatterns_mua", "goog.i18n.DateTimePatterns_mua_CM", "goog.i18n.DateTimePatterns_my_MM", "goog.i18n.DateTimePatterns_naq", "goog.i18n.DateTimePatterns_naq_NA", "goog.i18n.DateTimePatterns_nb_NO", "goog.i18n.DateTimePatterns_nb_SJ", "goog.i18n.DateTimePatterns_nd", 
"goog.i18n.DateTimePatterns_nd_ZW", "goog.i18n.DateTimePatterns_ne_IN", "goog.i18n.DateTimePatterns_ne_NP", "goog.i18n.DateTimePatterns_nl_AW", "goog.i18n.DateTimePatterns_nl_BE", "goog.i18n.DateTimePatterns_nl_BQ", "goog.i18n.DateTimePatterns_nl_CW", "goog.i18n.DateTimePatterns_nl_NL", "goog.i18n.DateTimePatterns_nl_SR", "goog.i18n.DateTimePatterns_nl_SX", "goog.i18n.DateTimePatterns_nmg", "goog.i18n.DateTimePatterns_nmg_CM", "goog.i18n.DateTimePatterns_nn", "goog.i18n.DateTimePatterns_nn_NO", "goog.i18n.DateTimePatterns_nnh", 
"goog.i18n.DateTimePatterns_nnh_CM", "goog.i18n.DateTimePatterns_nus", "goog.i18n.DateTimePatterns_nus_SD", "goog.i18n.DateTimePatterns_nyn", "goog.i18n.DateTimePatterns_nyn_UG", "goog.i18n.DateTimePatterns_om", "goog.i18n.DateTimePatterns_om_ET", "goog.i18n.DateTimePatterns_om_KE", "goog.i18n.DateTimePatterns_or_IN", "goog.i18n.DateTimePatterns_os", "goog.i18n.DateTimePatterns_os_GE", "goog.i18n.DateTimePatterns_os_RU", "goog.i18n.DateTimePatterns_pa_Arab", "goog.i18n.DateTimePatterns_pa_Arab_PK", 
"goog.i18n.DateTimePatterns_pa_Guru", "goog.i18n.DateTimePatterns_pa_Guru_IN", "goog.i18n.DateTimePatterns_pl_PL", "goog.i18n.DateTimePatterns_ps", "goog.i18n.DateTimePatterns_ps_AF", "goog.i18n.DateTimePatterns_pt_AO", "goog.i18n.DateTimePatterns_pt_CV", "goog.i18n.DateTimePatterns_pt_GW", "goog.i18n.DateTimePatterns_pt_MO", "goog.i18n.DateTimePatterns_pt_MZ", "goog.i18n.DateTimePatterns_pt_ST", "goog.i18n.DateTimePatterns_pt_TL", "goog.i18n.DateTimePatterns_qu", "goog.i18n.DateTimePatterns_qu_BO", 
"goog.i18n.DateTimePatterns_qu_EC", "goog.i18n.DateTimePatterns_qu_PE", "goog.i18n.DateTimePatterns_rm", "goog.i18n.DateTimePatterns_rm_CH", "goog.i18n.DateTimePatterns_rn", "goog.i18n.DateTimePatterns_rn_BI", "goog.i18n.DateTimePatterns_ro_MD", "goog.i18n.DateTimePatterns_ro_RO", "goog.i18n.DateTimePatterns_rof", "goog.i18n.DateTimePatterns_rof_TZ", "goog.i18n.DateTimePatterns_ru_BY", "goog.i18n.DateTimePatterns_ru_KG", "goog.i18n.DateTimePatterns_ru_KZ", "goog.i18n.DateTimePatterns_ru_MD", "goog.i18n.DateTimePatterns_ru_RU", 
"goog.i18n.DateTimePatterns_ru_UA", "goog.i18n.DateTimePatterns_rw", "goog.i18n.DateTimePatterns_rw_RW", "goog.i18n.DateTimePatterns_rwk", "goog.i18n.DateTimePatterns_rwk_TZ", "goog.i18n.DateTimePatterns_sah", "goog.i18n.DateTimePatterns_sah_RU", "goog.i18n.DateTimePatterns_saq", "goog.i18n.DateTimePatterns_saq_KE", "goog.i18n.DateTimePatterns_sbp", "goog.i18n.DateTimePatterns_sbp_TZ", "goog.i18n.DateTimePatterns_se", "goog.i18n.DateTimePatterns_se_FI", "goog.i18n.DateTimePatterns_se_NO", "goog.i18n.DateTimePatterns_se_SE", 
"goog.i18n.DateTimePatterns_seh", "goog.i18n.DateTimePatterns_seh_MZ", "goog.i18n.DateTimePatterns_ses", "goog.i18n.DateTimePatterns_ses_ML", "goog.i18n.DateTimePatterns_sg", "goog.i18n.DateTimePatterns_sg_CF", "goog.i18n.DateTimePatterns_shi", "goog.i18n.DateTimePatterns_shi_Latn", "goog.i18n.DateTimePatterns_shi_Latn_MA", "goog.i18n.DateTimePatterns_shi_Tfng", "goog.i18n.DateTimePatterns_shi_Tfng_MA", "goog.i18n.DateTimePatterns_si_LK", "goog.i18n.DateTimePatterns_sk_SK", "goog.i18n.DateTimePatterns_sl_SI", 
"goog.i18n.DateTimePatterns_smn", "goog.i18n.DateTimePatterns_smn_FI", "goog.i18n.DateTimePatterns_sn", "goog.i18n.DateTimePatterns_sn_ZW", "goog.i18n.DateTimePatterns_so", "goog.i18n.DateTimePatterns_so_DJ", "goog.i18n.DateTimePatterns_so_ET", "goog.i18n.DateTimePatterns_so_KE", "goog.i18n.DateTimePatterns_so_SO", "goog.i18n.DateTimePatterns_sq_AL", "goog.i18n.DateTimePatterns_sq_MK", "goog.i18n.DateTimePatterns_sq_XK", "goog.i18n.DateTimePatterns_sr_Cyrl", "goog.i18n.DateTimePatterns_sr_Cyrl_BA", 
"goog.i18n.DateTimePatterns_sr_Cyrl_ME", "goog.i18n.DateTimePatterns_sr_Cyrl_RS", "goog.i18n.DateTimePatterns_sr_Cyrl_XK", "goog.i18n.DateTimePatterns_sr_Latn", "goog.i18n.DateTimePatterns_sr_Latn_BA", "goog.i18n.DateTimePatterns_sr_Latn_ME", "goog.i18n.DateTimePatterns_sr_Latn_RS", "goog.i18n.DateTimePatterns_sr_Latn_XK", "goog.i18n.DateTimePatterns_sv_AX", "goog.i18n.DateTimePatterns_sv_FI", "goog.i18n.DateTimePatterns_sv_SE", "goog.i18n.DateTimePatterns_sw_KE", "goog.i18n.DateTimePatterns_sw_TZ", 
"goog.i18n.DateTimePatterns_sw_UG", "goog.i18n.DateTimePatterns_swc", "goog.i18n.DateTimePatterns_swc_CD", "goog.i18n.DateTimePatterns_ta_IN", "goog.i18n.DateTimePatterns_ta_LK", "goog.i18n.DateTimePatterns_ta_MY", "goog.i18n.DateTimePatterns_ta_SG", "goog.i18n.DateTimePatterns_te_IN", "goog.i18n.DateTimePatterns_teo", "goog.i18n.DateTimePatterns_teo_KE", "goog.i18n.DateTimePatterns_teo_UG", "goog.i18n.DateTimePatterns_th_TH", "goog.i18n.DateTimePatterns_ti", "goog.i18n.DateTimePatterns_ti_ER", "goog.i18n.DateTimePatterns_ti_ET", 
"goog.i18n.DateTimePatterns_to", "goog.i18n.DateTimePatterns_to_TO", "goog.i18n.DateTimePatterns_tr_CY", "goog.i18n.DateTimePatterns_tr_TR", "goog.i18n.DateTimePatterns_twq", "goog.i18n.DateTimePatterns_twq_NE", "goog.i18n.DateTimePatterns_tzm", "goog.i18n.DateTimePatterns_tzm_Latn", "goog.i18n.DateTimePatterns_tzm_Latn_MA", "goog.i18n.DateTimePatterns_ug", "goog.i18n.DateTimePatterns_ug_Arab", "goog.i18n.DateTimePatterns_ug_Arab_CN", "goog.i18n.DateTimePatterns_uk_UA", "goog.i18n.DateTimePatterns_ur_IN", 
"goog.i18n.DateTimePatterns_ur_PK", "goog.i18n.DateTimePatterns_uz_Arab", "goog.i18n.DateTimePatterns_uz_Arab_AF", "goog.i18n.DateTimePatterns_uz_Cyrl", "goog.i18n.DateTimePatterns_uz_Cyrl_UZ", "goog.i18n.DateTimePatterns_uz_Latn", "goog.i18n.DateTimePatterns_uz_Latn_UZ", "goog.i18n.DateTimePatterns_vai", "goog.i18n.DateTimePatterns_vai_Latn", "goog.i18n.DateTimePatterns_vai_Latn_LR", "goog.i18n.DateTimePatterns_vai_Vaii", "goog.i18n.DateTimePatterns_vai_Vaii_LR", "goog.i18n.DateTimePatterns_vi_VN", 
"goog.i18n.DateTimePatterns_vun", "goog.i18n.DateTimePatterns_vun_TZ", "goog.i18n.DateTimePatterns_wae", "goog.i18n.DateTimePatterns_wae_CH", "goog.i18n.DateTimePatterns_xog", "goog.i18n.DateTimePatterns_xog_UG", "goog.i18n.DateTimePatterns_yav", "goog.i18n.DateTimePatterns_yav_CM", "goog.i18n.DateTimePatterns_yi", "goog.i18n.DateTimePatterns_yi_001", "goog.i18n.DateTimePatterns_yo", "goog.i18n.DateTimePatterns_yo_BJ", "goog.i18n.DateTimePatterns_yo_NG", "goog.i18n.DateTimePatterns_zgh", "goog.i18n.DateTimePatterns_zgh_MA", 
"goog.i18n.DateTimePatterns_zh_Hans", "goog.i18n.DateTimePatterns_zh_Hans_CN", "goog.i18n.DateTimePatterns_zh_Hans_HK", "goog.i18n.DateTimePatterns_zh_Hans_MO", "goog.i18n.DateTimePatterns_zh_Hans_SG", "goog.i18n.DateTimePatterns_zh_Hant", "goog.i18n.DateTimePatterns_zh_Hant_HK", "goog.i18n.DateTimePatterns_zh_Hant_MO", "goog.i18n.DateTimePatterns_zh_Hant_TW", "goog.i18n.DateTimePatterns_zu_ZA"], ["goog.i18n.DateTimePatterns"], false);
goog.addDependency("i18n/datetimesymbols.js", ["goog.i18n.DateTimeSymbols", "goog.i18n.DateTimeSymbols_af", "goog.i18n.DateTimeSymbols_am", "goog.i18n.DateTimeSymbols_ar", "goog.i18n.DateTimeSymbols_az", "goog.i18n.DateTimeSymbols_bg", "goog.i18n.DateTimeSymbols_bn", "goog.i18n.DateTimeSymbols_br", "goog.i18n.DateTimeSymbols_ca", "goog.i18n.DateTimeSymbols_chr", "goog.i18n.DateTimeSymbols_cs", "goog.i18n.DateTimeSymbols_cy", "goog.i18n.DateTimeSymbols_da", "goog.i18n.DateTimeSymbols_de", "goog.i18n.DateTimeSymbols_de_AT", 
"goog.i18n.DateTimeSymbols_de_CH", "goog.i18n.DateTimeSymbols_el", "goog.i18n.DateTimeSymbols_en", "goog.i18n.DateTimeSymbols_en_AU", "goog.i18n.DateTimeSymbols_en_GB", "goog.i18n.DateTimeSymbols_en_IE", "goog.i18n.DateTimeSymbols_en_IN", "goog.i18n.DateTimeSymbols_en_ISO", "goog.i18n.DateTimeSymbols_en_SG", "goog.i18n.DateTimeSymbols_en_US", "goog.i18n.DateTimeSymbols_en_ZA", "goog.i18n.DateTimeSymbols_es", "goog.i18n.DateTimeSymbols_es_419", "goog.i18n.DateTimeSymbols_es_ES", "goog.i18n.DateTimeSymbols_et", 
"goog.i18n.DateTimeSymbols_eu", "goog.i18n.DateTimeSymbols_fa", "goog.i18n.DateTimeSymbols_fi", "goog.i18n.DateTimeSymbols_fil", "goog.i18n.DateTimeSymbols_fr", "goog.i18n.DateTimeSymbols_fr_CA", "goog.i18n.DateTimeSymbols_ga", "goog.i18n.DateTimeSymbols_gl", "goog.i18n.DateTimeSymbols_gsw", "goog.i18n.DateTimeSymbols_gu", "goog.i18n.DateTimeSymbols_haw", "goog.i18n.DateTimeSymbols_he", "goog.i18n.DateTimeSymbols_hi", "goog.i18n.DateTimeSymbols_hr", "goog.i18n.DateTimeSymbols_hu", "goog.i18n.DateTimeSymbols_hy", 
"goog.i18n.DateTimeSymbols_id", "goog.i18n.DateTimeSymbols_in", "goog.i18n.DateTimeSymbols_is", "goog.i18n.DateTimeSymbols_it", "goog.i18n.DateTimeSymbols_iw", "goog.i18n.DateTimeSymbols_ja", "goog.i18n.DateTimeSymbols_ka", "goog.i18n.DateTimeSymbols_kk", "goog.i18n.DateTimeSymbols_km", "goog.i18n.DateTimeSymbols_kn", "goog.i18n.DateTimeSymbols_ko", "goog.i18n.DateTimeSymbols_ky", "goog.i18n.DateTimeSymbols_ln", "goog.i18n.DateTimeSymbols_lo", "goog.i18n.DateTimeSymbols_lt", "goog.i18n.DateTimeSymbols_lv", 
"goog.i18n.DateTimeSymbols_mk", "goog.i18n.DateTimeSymbols_ml", "goog.i18n.DateTimeSymbols_mn", "goog.i18n.DateTimeSymbols_mr", "goog.i18n.DateTimeSymbols_ms", "goog.i18n.DateTimeSymbols_mt", "goog.i18n.DateTimeSymbols_my", "goog.i18n.DateTimeSymbols_nb", "goog.i18n.DateTimeSymbols_ne", "goog.i18n.DateTimeSymbols_nl", "goog.i18n.DateTimeSymbols_no", "goog.i18n.DateTimeSymbols_no_NO", "goog.i18n.DateTimeSymbols_or", "goog.i18n.DateTimeSymbols_pa", "goog.i18n.DateTimeSymbols_pl", "goog.i18n.DateTimeSymbols_pt", 
"goog.i18n.DateTimeSymbols_pt_BR", "goog.i18n.DateTimeSymbols_pt_PT", "goog.i18n.DateTimeSymbols_ro", "goog.i18n.DateTimeSymbols_ru", "goog.i18n.DateTimeSymbols_si", "goog.i18n.DateTimeSymbols_sk", "goog.i18n.DateTimeSymbols_sl", "goog.i18n.DateTimeSymbols_sq", "goog.i18n.DateTimeSymbols_sr", "goog.i18n.DateTimeSymbols_sv", "goog.i18n.DateTimeSymbols_sw", "goog.i18n.DateTimeSymbols_ta", "goog.i18n.DateTimeSymbols_te", "goog.i18n.DateTimeSymbols_th", "goog.i18n.DateTimeSymbols_tl", "goog.i18n.DateTimeSymbols_tr", 
"goog.i18n.DateTimeSymbols_uk", "goog.i18n.DateTimeSymbols_ur", "goog.i18n.DateTimeSymbols_uz", "goog.i18n.DateTimeSymbols_vi", "goog.i18n.DateTimeSymbols_zh", "goog.i18n.DateTimeSymbols_zh_CN", "goog.i18n.DateTimeSymbols_zh_HK", "goog.i18n.DateTimeSymbols_zh_TW", "goog.i18n.DateTimeSymbols_zu"], [], false);
goog.addDependency("i18n/datetimesymbolsext.js", ["goog.i18n.DateTimeSymbolsExt", "goog.i18n.DateTimeSymbols_aa", "goog.i18n.DateTimeSymbols_aa_DJ", "goog.i18n.DateTimeSymbols_aa_ER", "goog.i18n.DateTimeSymbols_aa_ET", "goog.i18n.DateTimeSymbols_af_NA", "goog.i18n.DateTimeSymbols_af_ZA", "goog.i18n.DateTimeSymbols_agq", "goog.i18n.DateTimeSymbols_agq_CM", "goog.i18n.DateTimeSymbols_ak", "goog.i18n.DateTimeSymbols_ak_GH", "goog.i18n.DateTimeSymbols_am_ET", "goog.i18n.DateTimeSymbols_ar_001", "goog.i18n.DateTimeSymbols_ar_AE", 
"goog.i18n.DateTimeSymbols_ar_BH", "goog.i18n.DateTimeSymbols_ar_DJ", "goog.i18n.DateTimeSymbols_ar_DZ", "goog.i18n.DateTimeSymbols_ar_EG", "goog.i18n.DateTimeSymbols_ar_EH", "goog.i18n.DateTimeSymbols_ar_ER", "goog.i18n.DateTimeSymbols_ar_IL", "goog.i18n.DateTimeSymbols_ar_IQ", "goog.i18n.DateTimeSymbols_ar_JO", "goog.i18n.DateTimeSymbols_ar_KM", "goog.i18n.DateTimeSymbols_ar_KW", "goog.i18n.DateTimeSymbols_ar_LB", "goog.i18n.DateTimeSymbols_ar_LY", "goog.i18n.DateTimeSymbols_ar_MA", "goog.i18n.DateTimeSymbols_ar_MR", 
"goog.i18n.DateTimeSymbols_ar_OM", "goog.i18n.DateTimeSymbols_ar_PS", "goog.i18n.DateTimeSymbols_ar_QA", "goog.i18n.DateTimeSymbols_ar_SA", "goog.i18n.DateTimeSymbols_ar_SD", "goog.i18n.DateTimeSymbols_ar_SO", "goog.i18n.DateTimeSymbols_ar_SS", "goog.i18n.DateTimeSymbols_ar_SY", "goog.i18n.DateTimeSymbols_ar_TD", "goog.i18n.DateTimeSymbols_ar_TN", "goog.i18n.DateTimeSymbols_ar_YE", "goog.i18n.DateTimeSymbols_as", "goog.i18n.DateTimeSymbols_as_IN", "goog.i18n.DateTimeSymbols_asa", "goog.i18n.DateTimeSymbols_asa_TZ", 
"goog.i18n.DateTimeSymbols_ast", "goog.i18n.DateTimeSymbols_ast_ES", "goog.i18n.DateTimeSymbols_az_Cyrl", "goog.i18n.DateTimeSymbols_az_Cyrl_AZ", "goog.i18n.DateTimeSymbols_az_Latn", "goog.i18n.DateTimeSymbols_az_Latn_AZ", "goog.i18n.DateTimeSymbols_bas", "goog.i18n.DateTimeSymbols_bas_CM", "goog.i18n.DateTimeSymbols_be", "goog.i18n.DateTimeSymbols_be_BY", "goog.i18n.DateTimeSymbols_bem", "goog.i18n.DateTimeSymbols_bem_ZM", "goog.i18n.DateTimeSymbols_bez", "goog.i18n.DateTimeSymbols_bez_TZ", "goog.i18n.DateTimeSymbols_bg_BG", 
"goog.i18n.DateTimeSymbols_bm", "goog.i18n.DateTimeSymbols_bm_Latn", "goog.i18n.DateTimeSymbols_bm_Latn_ML", "goog.i18n.DateTimeSymbols_bn_BD", "goog.i18n.DateTimeSymbols_bn_IN", "goog.i18n.DateTimeSymbols_bo", "goog.i18n.DateTimeSymbols_bo_CN", "goog.i18n.DateTimeSymbols_bo_IN", "goog.i18n.DateTimeSymbols_br_FR", "goog.i18n.DateTimeSymbols_brx", "goog.i18n.DateTimeSymbols_brx_IN", "goog.i18n.DateTimeSymbols_bs", "goog.i18n.DateTimeSymbols_bs_Cyrl", "goog.i18n.DateTimeSymbols_bs_Cyrl_BA", "goog.i18n.DateTimeSymbols_bs_Latn", 
"goog.i18n.DateTimeSymbols_bs_Latn_BA", "goog.i18n.DateTimeSymbols_ca_AD", "goog.i18n.DateTimeSymbols_ca_ES", "goog.i18n.DateTimeSymbols_ca_ES_VALENCIA", "goog.i18n.DateTimeSymbols_ca_FR", "goog.i18n.DateTimeSymbols_ca_IT", "goog.i18n.DateTimeSymbols_cgg", "goog.i18n.DateTimeSymbols_cgg_UG", "goog.i18n.DateTimeSymbols_chr_US", "goog.i18n.DateTimeSymbols_ckb", "goog.i18n.DateTimeSymbols_ckb_Arab", "goog.i18n.DateTimeSymbols_ckb_Arab_IQ", "goog.i18n.DateTimeSymbols_ckb_Arab_IR", "goog.i18n.DateTimeSymbols_ckb_IQ", 
"goog.i18n.DateTimeSymbols_ckb_IR", "goog.i18n.DateTimeSymbols_ckb_Latn", "goog.i18n.DateTimeSymbols_ckb_Latn_IQ", "goog.i18n.DateTimeSymbols_cs_CZ", "goog.i18n.DateTimeSymbols_cy_GB", "goog.i18n.DateTimeSymbols_da_DK", "goog.i18n.DateTimeSymbols_da_GL", "goog.i18n.DateTimeSymbols_dav", "goog.i18n.DateTimeSymbols_dav_KE", "goog.i18n.DateTimeSymbols_de_BE", "goog.i18n.DateTimeSymbols_de_DE", "goog.i18n.DateTimeSymbols_de_LI", "goog.i18n.DateTimeSymbols_de_LU", "goog.i18n.DateTimeSymbols_dje", "goog.i18n.DateTimeSymbols_dje_NE", 
"goog.i18n.DateTimeSymbols_dsb", "goog.i18n.DateTimeSymbols_dsb_DE", "goog.i18n.DateTimeSymbols_dua", "goog.i18n.DateTimeSymbols_dua_CM", "goog.i18n.DateTimeSymbols_dyo", "goog.i18n.DateTimeSymbols_dyo_SN", "goog.i18n.DateTimeSymbols_dz", "goog.i18n.DateTimeSymbols_dz_BT", "goog.i18n.DateTimeSymbols_ebu", "goog.i18n.DateTimeSymbols_ebu_KE", "goog.i18n.DateTimeSymbols_ee", "goog.i18n.DateTimeSymbols_ee_GH", "goog.i18n.DateTimeSymbols_ee_TG", "goog.i18n.DateTimeSymbols_el_CY", "goog.i18n.DateTimeSymbols_el_GR", 
"goog.i18n.DateTimeSymbols_en_001", "goog.i18n.DateTimeSymbols_en_150", "goog.i18n.DateTimeSymbols_en_AG", "goog.i18n.DateTimeSymbols_en_AI", "goog.i18n.DateTimeSymbols_en_AS", "goog.i18n.DateTimeSymbols_en_BB", "goog.i18n.DateTimeSymbols_en_BE", "goog.i18n.DateTimeSymbols_en_BM", "goog.i18n.DateTimeSymbols_en_BS", "goog.i18n.DateTimeSymbols_en_BW", "goog.i18n.DateTimeSymbols_en_BZ", "goog.i18n.DateTimeSymbols_en_CA", "goog.i18n.DateTimeSymbols_en_CC", "goog.i18n.DateTimeSymbols_en_CK", "goog.i18n.DateTimeSymbols_en_CM", 
"goog.i18n.DateTimeSymbols_en_CX", "goog.i18n.DateTimeSymbols_en_DG", "goog.i18n.DateTimeSymbols_en_DM", "goog.i18n.DateTimeSymbols_en_ER", "goog.i18n.DateTimeSymbols_en_FJ", "goog.i18n.DateTimeSymbols_en_FK", "goog.i18n.DateTimeSymbols_en_FM", "goog.i18n.DateTimeSymbols_en_GD", "goog.i18n.DateTimeSymbols_en_GG", "goog.i18n.DateTimeSymbols_en_GH", "goog.i18n.DateTimeSymbols_en_GI", "goog.i18n.DateTimeSymbols_en_GM", "goog.i18n.DateTimeSymbols_en_GU", "goog.i18n.DateTimeSymbols_en_GY", "goog.i18n.DateTimeSymbols_en_HK", 
"goog.i18n.DateTimeSymbols_en_IM", "goog.i18n.DateTimeSymbols_en_IO", "goog.i18n.DateTimeSymbols_en_JE", "goog.i18n.DateTimeSymbols_en_JM", "goog.i18n.DateTimeSymbols_en_KE", "goog.i18n.DateTimeSymbols_en_KI", "goog.i18n.DateTimeSymbols_en_KN", "goog.i18n.DateTimeSymbols_en_KY", "goog.i18n.DateTimeSymbols_en_LC", "goog.i18n.DateTimeSymbols_en_LR", "goog.i18n.DateTimeSymbols_en_LS", "goog.i18n.DateTimeSymbols_en_MG", "goog.i18n.DateTimeSymbols_en_MH", "goog.i18n.DateTimeSymbols_en_MO", "goog.i18n.DateTimeSymbols_en_MP", 
"goog.i18n.DateTimeSymbols_en_MS", "goog.i18n.DateTimeSymbols_en_MT", "goog.i18n.DateTimeSymbols_en_MU", "goog.i18n.DateTimeSymbols_en_MW", "goog.i18n.DateTimeSymbols_en_MY", "goog.i18n.DateTimeSymbols_en_NA", "goog.i18n.DateTimeSymbols_en_NF", "goog.i18n.DateTimeSymbols_en_NG", "goog.i18n.DateTimeSymbols_en_NR", "goog.i18n.DateTimeSymbols_en_NU", "goog.i18n.DateTimeSymbols_en_NZ", "goog.i18n.DateTimeSymbols_en_PG", "goog.i18n.DateTimeSymbols_en_PH", "goog.i18n.DateTimeSymbols_en_PK", "goog.i18n.DateTimeSymbols_en_PN", 
"goog.i18n.DateTimeSymbols_en_PR", "goog.i18n.DateTimeSymbols_en_PW", "goog.i18n.DateTimeSymbols_en_RW", "goog.i18n.DateTimeSymbols_en_SB", "goog.i18n.DateTimeSymbols_en_SC", "goog.i18n.DateTimeSymbols_en_SD", "goog.i18n.DateTimeSymbols_en_SH", "goog.i18n.DateTimeSymbols_en_SL", "goog.i18n.DateTimeSymbols_en_SS", "goog.i18n.DateTimeSymbols_en_SX", "goog.i18n.DateTimeSymbols_en_SZ", "goog.i18n.DateTimeSymbols_en_TC", "goog.i18n.DateTimeSymbols_en_TK", "goog.i18n.DateTimeSymbols_en_TO", "goog.i18n.DateTimeSymbols_en_TT", 
"goog.i18n.DateTimeSymbols_en_TV", "goog.i18n.DateTimeSymbols_en_TZ", "goog.i18n.DateTimeSymbols_en_UG", "goog.i18n.DateTimeSymbols_en_UM", "goog.i18n.DateTimeSymbols_en_VC", "goog.i18n.DateTimeSymbols_en_VG", "goog.i18n.DateTimeSymbols_en_VI", "goog.i18n.DateTimeSymbols_en_VU", "goog.i18n.DateTimeSymbols_en_WS", "goog.i18n.DateTimeSymbols_en_ZM", "goog.i18n.DateTimeSymbols_en_ZW", "goog.i18n.DateTimeSymbols_eo", "goog.i18n.DateTimeSymbols_eo_001", "goog.i18n.DateTimeSymbols_es_AR", "goog.i18n.DateTimeSymbols_es_BO", 
"goog.i18n.DateTimeSymbols_es_CL", "goog.i18n.DateTimeSymbols_es_CO", "goog.i18n.DateTimeSymbols_es_CR", "goog.i18n.DateTimeSymbols_es_CU", "goog.i18n.DateTimeSymbols_es_DO", "goog.i18n.DateTimeSymbols_es_EA", "goog.i18n.DateTimeSymbols_es_EC", "goog.i18n.DateTimeSymbols_es_GQ", "goog.i18n.DateTimeSymbols_es_GT", "goog.i18n.DateTimeSymbols_es_HN", "goog.i18n.DateTimeSymbols_es_IC", "goog.i18n.DateTimeSymbols_es_MX", "goog.i18n.DateTimeSymbols_es_NI", "goog.i18n.DateTimeSymbols_es_PA", "goog.i18n.DateTimeSymbols_es_PE", 
"goog.i18n.DateTimeSymbols_es_PH", "goog.i18n.DateTimeSymbols_es_PR", "goog.i18n.DateTimeSymbols_es_PY", "goog.i18n.DateTimeSymbols_es_SV", "goog.i18n.DateTimeSymbols_es_US", "goog.i18n.DateTimeSymbols_es_UY", "goog.i18n.DateTimeSymbols_es_VE", "goog.i18n.DateTimeSymbols_et_EE", "goog.i18n.DateTimeSymbols_eu_ES", "goog.i18n.DateTimeSymbols_ewo", "goog.i18n.DateTimeSymbols_ewo_CM", "goog.i18n.DateTimeSymbols_fa_AF", "goog.i18n.DateTimeSymbols_fa_IR", "goog.i18n.DateTimeSymbols_ff", "goog.i18n.DateTimeSymbols_ff_CM", 
"goog.i18n.DateTimeSymbols_ff_GN", "goog.i18n.DateTimeSymbols_ff_MR", "goog.i18n.DateTimeSymbols_ff_SN", "goog.i18n.DateTimeSymbols_fi_FI", "goog.i18n.DateTimeSymbols_fil_PH", "goog.i18n.DateTimeSymbols_fo", "goog.i18n.DateTimeSymbols_fo_FO", "goog.i18n.DateTimeSymbols_fr_BE", "goog.i18n.DateTimeSymbols_fr_BF", "goog.i18n.DateTimeSymbols_fr_BI", "goog.i18n.DateTimeSymbols_fr_BJ", "goog.i18n.DateTimeSymbols_fr_BL", "goog.i18n.DateTimeSymbols_fr_CD", "goog.i18n.DateTimeSymbols_fr_CF", "goog.i18n.DateTimeSymbols_fr_CG", 
"goog.i18n.DateTimeSymbols_fr_CH", "goog.i18n.DateTimeSymbols_fr_CI", "goog.i18n.DateTimeSymbols_fr_CM", "goog.i18n.DateTimeSymbols_fr_DJ", "goog.i18n.DateTimeSymbols_fr_DZ", "goog.i18n.DateTimeSymbols_fr_FR", "goog.i18n.DateTimeSymbols_fr_GA", "goog.i18n.DateTimeSymbols_fr_GF", "goog.i18n.DateTimeSymbols_fr_GN", "goog.i18n.DateTimeSymbols_fr_GP", "goog.i18n.DateTimeSymbols_fr_GQ", "goog.i18n.DateTimeSymbols_fr_HT", "goog.i18n.DateTimeSymbols_fr_KM", "goog.i18n.DateTimeSymbols_fr_LU", "goog.i18n.DateTimeSymbols_fr_MA", 
"goog.i18n.DateTimeSymbols_fr_MC", "goog.i18n.DateTimeSymbols_fr_MF", "goog.i18n.DateTimeSymbols_fr_MG", "goog.i18n.DateTimeSymbols_fr_ML", "goog.i18n.DateTimeSymbols_fr_MQ", "goog.i18n.DateTimeSymbols_fr_MR", "goog.i18n.DateTimeSymbols_fr_MU", "goog.i18n.DateTimeSymbols_fr_NC", "goog.i18n.DateTimeSymbols_fr_NE", "goog.i18n.DateTimeSymbols_fr_PF", "goog.i18n.DateTimeSymbols_fr_PM", "goog.i18n.DateTimeSymbols_fr_RE", "goog.i18n.DateTimeSymbols_fr_RW", "goog.i18n.DateTimeSymbols_fr_SC", "goog.i18n.DateTimeSymbols_fr_SN", 
"goog.i18n.DateTimeSymbols_fr_SY", "goog.i18n.DateTimeSymbols_fr_TD", "goog.i18n.DateTimeSymbols_fr_TG", "goog.i18n.DateTimeSymbols_fr_TN", "goog.i18n.DateTimeSymbols_fr_VU", "goog.i18n.DateTimeSymbols_fr_WF", "goog.i18n.DateTimeSymbols_fr_YT", "goog.i18n.DateTimeSymbols_fur", "goog.i18n.DateTimeSymbols_fur_IT", "goog.i18n.DateTimeSymbols_fy", "goog.i18n.DateTimeSymbols_fy_NL", "goog.i18n.DateTimeSymbols_ga_IE", "goog.i18n.DateTimeSymbols_gd", "goog.i18n.DateTimeSymbols_gd_GB", "goog.i18n.DateTimeSymbols_gl_ES", 
"goog.i18n.DateTimeSymbols_gsw_CH", "goog.i18n.DateTimeSymbols_gsw_FR", "goog.i18n.DateTimeSymbols_gsw_LI", "goog.i18n.DateTimeSymbols_gu_IN", "goog.i18n.DateTimeSymbols_guz", "goog.i18n.DateTimeSymbols_guz_KE", "goog.i18n.DateTimeSymbols_gv", "goog.i18n.DateTimeSymbols_gv_IM", "goog.i18n.DateTimeSymbols_ha", "goog.i18n.DateTimeSymbols_ha_Latn", "goog.i18n.DateTimeSymbols_ha_Latn_GH", "goog.i18n.DateTimeSymbols_ha_Latn_NE", "goog.i18n.DateTimeSymbols_ha_Latn_NG", "goog.i18n.DateTimeSymbols_haw_US", 
"goog.i18n.DateTimeSymbols_he_IL", "goog.i18n.DateTimeSymbols_hi_IN", "goog.i18n.DateTimeSymbols_hr_BA", "goog.i18n.DateTimeSymbols_hr_HR", "goog.i18n.DateTimeSymbols_hsb", "goog.i18n.DateTimeSymbols_hsb_DE", "goog.i18n.DateTimeSymbols_hu_HU", "goog.i18n.DateTimeSymbols_hy_AM", "goog.i18n.DateTimeSymbols_ia", "goog.i18n.DateTimeSymbols_ia_FR", "goog.i18n.DateTimeSymbols_id_ID", "goog.i18n.DateTimeSymbols_ig", "goog.i18n.DateTimeSymbols_ig_NG", "goog.i18n.DateTimeSymbols_ii", "goog.i18n.DateTimeSymbols_ii_CN", 
"goog.i18n.DateTimeSymbols_is_IS", "goog.i18n.DateTimeSymbols_it_CH", "goog.i18n.DateTimeSymbols_it_IT", "goog.i18n.DateTimeSymbols_it_SM", "goog.i18n.DateTimeSymbols_ja_JP", "goog.i18n.DateTimeSymbols_jgo", "goog.i18n.DateTimeSymbols_jgo_CM", "goog.i18n.DateTimeSymbols_jmc", "goog.i18n.DateTimeSymbols_jmc_TZ", "goog.i18n.DateTimeSymbols_ka_GE", "goog.i18n.DateTimeSymbols_kab", "goog.i18n.DateTimeSymbols_kab_DZ", "goog.i18n.DateTimeSymbols_kam", "goog.i18n.DateTimeSymbols_kam_KE", "goog.i18n.DateTimeSymbols_kde", 
"goog.i18n.DateTimeSymbols_kde_TZ", "goog.i18n.DateTimeSymbols_kea", "goog.i18n.DateTimeSymbols_kea_CV", "goog.i18n.DateTimeSymbols_khq", "goog.i18n.DateTimeSymbols_khq_ML", "goog.i18n.DateTimeSymbols_ki", "goog.i18n.DateTimeSymbols_ki_KE", "goog.i18n.DateTimeSymbols_kk_Cyrl", "goog.i18n.DateTimeSymbols_kk_Cyrl_KZ", "goog.i18n.DateTimeSymbols_kkj", "goog.i18n.DateTimeSymbols_kkj_CM", "goog.i18n.DateTimeSymbols_kl", "goog.i18n.DateTimeSymbols_kl_GL", "goog.i18n.DateTimeSymbols_kln", "goog.i18n.DateTimeSymbols_kln_KE", 
"goog.i18n.DateTimeSymbols_km_KH", "goog.i18n.DateTimeSymbols_kn_IN", "goog.i18n.DateTimeSymbols_ko_KP", "goog.i18n.DateTimeSymbols_ko_KR", "goog.i18n.DateTimeSymbols_kok", "goog.i18n.DateTimeSymbols_kok_IN", "goog.i18n.DateTimeSymbols_ks", "goog.i18n.DateTimeSymbols_ks_Arab", "goog.i18n.DateTimeSymbols_ks_Arab_IN", "goog.i18n.DateTimeSymbols_ksb", "goog.i18n.DateTimeSymbols_ksb_TZ", "goog.i18n.DateTimeSymbols_ksf", "goog.i18n.DateTimeSymbols_ksf_CM", "goog.i18n.DateTimeSymbols_ksh", "goog.i18n.DateTimeSymbols_ksh_DE", 
"goog.i18n.DateTimeSymbols_kw", "goog.i18n.DateTimeSymbols_kw_GB", "goog.i18n.DateTimeSymbols_ky_Cyrl", "goog.i18n.DateTimeSymbols_ky_Cyrl_KG", "goog.i18n.DateTimeSymbols_lag", "goog.i18n.DateTimeSymbols_lag_TZ", "goog.i18n.DateTimeSymbols_lb", "goog.i18n.DateTimeSymbols_lb_LU", "goog.i18n.DateTimeSymbols_lg", "goog.i18n.DateTimeSymbols_lg_UG", "goog.i18n.DateTimeSymbols_lkt", "goog.i18n.DateTimeSymbols_lkt_US", "goog.i18n.DateTimeSymbols_ln_AO", "goog.i18n.DateTimeSymbols_ln_CD", "goog.i18n.DateTimeSymbols_ln_CF", 
"goog.i18n.DateTimeSymbols_ln_CG", "goog.i18n.DateTimeSymbols_lo_LA", "goog.i18n.DateTimeSymbols_lt_LT", "goog.i18n.DateTimeSymbols_lu", "goog.i18n.DateTimeSymbols_lu_CD", "goog.i18n.DateTimeSymbols_luo", "goog.i18n.DateTimeSymbols_luo_KE", "goog.i18n.DateTimeSymbols_luy", "goog.i18n.DateTimeSymbols_luy_KE", "goog.i18n.DateTimeSymbols_lv_LV", "goog.i18n.DateTimeSymbols_mas", "goog.i18n.DateTimeSymbols_mas_KE", "goog.i18n.DateTimeSymbols_mas_TZ", "goog.i18n.DateTimeSymbols_mer", "goog.i18n.DateTimeSymbols_mer_KE", 
"goog.i18n.DateTimeSymbols_mfe", "goog.i18n.DateTimeSymbols_mfe_MU", "goog.i18n.DateTimeSymbols_mg", "goog.i18n.DateTimeSymbols_mg_MG", "goog.i18n.DateTimeSymbols_mgh", "goog.i18n.DateTimeSymbols_mgh_MZ", "goog.i18n.DateTimeSymbols_mgo", "goog.i18n.DateTimeSymbols_mgo_CM", "goog.i18n.DateTimeSymbols_mk_MK", "goog.i18n.DateTimeSymbols_ml_IN", "goog.i18n.DateTimeSymbols_mn_Cyrl", "goog.i18n.DateTimeSymbols_mn_Cyrl_MN", "goog.i18n.DateTimeSymbols_mr_IN", "goog.i18n.DateTimeSymbols_ms_Latn", "goog.i18n.DateTimeSymbols_ms_Latn_BN", 
"goog.i18n.DateTimeSymbols_ms_Latn_MY", "goog.i18n.DateTimeSymbols_ms_Latn_SG", "goog.i18n.DateTimeSymbols_mt_MT", "goog.i18n.DateTimeSymbols_mua", "goog.i18n.DateTimeSymbols_mua_CM", "goog.i18n.DateTimeSymbols_my_MM", "goog.i18n.DateTimeSymbols_naq", "goog.i18n.DateTimeSymbols_naq_NA", "goog.i18n.DateTimeSymbols_nb_NO", "goog.i18n.DateTimeSymbols_nb_SJ", "goog.i18n.DateTimeSymbols_nd", "goog.i18n.DateTimeSymbols_nd_ZW", "goog.i18n.DateTimeSymbols_ne_IN", "goog.i18n.DateTimeSymbols_ne_NP", "goog.i18n.DateTimeSymbols_nl_AW", 
"goog.i18n.DateTimeSymbols_nl_BE", "goog.i18n.DateTimeSymbols_nl_BQ", "goog.i18n.DateTimeSymbols_nl_CW", "goog.i18n.DateTimeSymbols_nl_NL", "goog.i18n.DateTimeSymbols_nl_SR", "goog.i18n.DateTimeSymbols_nl_SX", "goog.i18n.DateTimeSymbols_nmg", "goog.i18n.DateTimeSymbols_nmg_CM", "goog.i18n.DateTimeSymbols_nn", "goog.i18n.DateTimeSymbols_nn_NO", "goog.i18n.DateTimeSymbols_nnh", "goog.i18n.DateTimeSymbols_nnh_CM", "goog.i18n.DateTimeSymbols_nr", "goog.i18n.DateTimeSymbols_nr_ZA", "goog.i18n.DateTimeSymbols_nso", 
"goog.i18n.DateTimeSymbols_nso_ZA", "goog.i18n.DateTimeSymbols_nus", "goog.i18n.DateTimeSymbols_nus_SD", "goog.i18n.DateTimeSymbols_nyn", "goog.i18n.DateTimeSymbols_nyn_UG", "goog.i18n.DateTimeSymbols_om", "goog.i18n.DateTimeSymbols_om_ET", "goog.i18n.DateTimeSymbols_om_KE", "goog.i18n.DateTimeSymbols_or_IN", "goog.i18n.DateTimeSymbols_os", "goog.i18n.DateTimeSymbols_os_GE", "goog.i18n.DateTimeSymbols_os_RU", "goog.i18n.DateTimeSymbols_pa_Arab", "goog.i18n.DateTimeSymbols_pa_Arab_PK", "goog.i18n.DateTimeSymbols_pa_Guru", 
"goog.i18n.DateTimeSymbols_pa_Guru_IN", "goog.i18n.DateTimeSymbols_pl_PL", "goog.i18n.DateTimeSymbols_ps", "goog.i18n.DateTimeSymbols_ps_AF", "goog.i18n.DateTimeSymbols_pt_AO", "goog.i18n.DateTimeSymbols_pt_CV", "goog.i18n.DateTimeSymbols_pt_GW", "goog.i18n.DateTimeSymbols_pt_MO", "goog.i18n.DateTimeSymbols_pt_MZ", "goog.i18n.DateTimeSymbols_pt_ST", "goog.i18n.DateTimeSymbols_pt_TL", "goog.i18n.DateTimeSymbols_qu", "goog.i18n.DateTimeSymbols_qu_BO", "goog.i18n.DateTimeSymbols_qu_EC", "goog.i18n.DateTimeSymbols_qu_PE", 
"goog.i18n.DateTimeSymbols_rm", "goog.i18n.DateTimeSymbols_rm_CH", "goog.i18n.DateTimeSymbols_rn", "goog.i18n.DateTimeSymbols_rn_BI", "goog.i18n.DateTimeSymbols_ro_MD", "goog.i18n.DateTimeSymbols_ro_RO", "goog.i18n.DateTimeSymbols_rof", "goog.i18n.DateTimeSymbols_rof_TZ", "goog.i18n.DateTimeSymbols_ru_BY", "goog.i18n.DateTimeSymbols_ru_KG", "goog.i18n.DateTimeSymbols_ru_KZ", "goog.i18n.DateTimeSymbols_ru_MD", "goog.i18n.DateTimeSymbols_ru_RU", "goog.i18n.DateTimeSymbols_ru_UA", "goog.i18n.DateTimeSymbols_rw", 
"goog.i18n.DateTimeSymbols_rw_RW", "goog.i18n.DateTimeSymbols_rwk", "goog.i18n.DateTimeSymbols_rwk_TZ", "goog.i18n.DateTimeSymbols_sah", "goog.i18n.DateTimeSymbols_sah_RU", "goog.i18n.DateTimeSymbols_saq", "goog.i18n.DateTimeSymbols_saq_KE", "goog.i18n.DateTimeSymbols_sbp", "goog.i18n.DateTimeSymbols_sbp_TZ", "goog.i18n.DateTimeSymbols_se", "goog.i18n.DateTimeSymbols_se_FI", "goog.i18n.DateTimeSymbols_se_NO", "goog.i18n.DateTimeSymbols_se_SE", "goog.i18n.DateTimeSymbols_seh", "goog.i18n.DateTimeSymbols_seh_MZ", 
"goog.i18n.DateTimeSymbols_ses", "goog.i18n.DateTimeSymbols_ses_ML", "goog.i18n.DateTimeSymbols_sg", "goog.i18n.DateTimeSymbols_sg_CF", "goog.i18n.DateTimeSymbols_shi", "goog.i18n.DateTimeSymbols_shi_Latn", "goog.i18n.DateTimeSymbols_shi_Latn_MA", "goog.i18n.DateTimeSymbols_shi_Tfng", "goog.i18n.DateTimeSymbols_shi_Tfng_MA", "goog.i18n.DateTimeSymbols_si_LK", "goog.i18n.DateTimeSymbols_sk_SK", "goog.i18n.DateTimeSymbols_sl_SI", "goog.i18n.DateTimeSymbols_smn", "goog.i18n.DateTimeSymbols_smn_FI", 
"goog.i18n.DateTimeSymbols_sn", "goog.i18n.DateTimeSymbols_sn_ZW", "goog.i18n.DateTimeSymbols_so", "goog.i18n.DateTimeSymbols_so_DJ", "goog.i18n.DateTimeSymbols_so_ET", "goog.i18n.DateTimeSymbols_so_KE", "goog.i18n.DateTimeSymbols_so_SO", "goog.i18n.DateTimeSymbols_sq_AL", "goog.i18n.DateTimeSymbols_sq_MK", "goog.i18n.DateTimeSymbols_sq_XK", "goog.i18n.DateTimeSymbols_sr_Cyrl", "goog.i18n.DateTimeSymbols_sr_Cyrl_BA", "goog.i18n.DateTimeSymbols_sr_Cyrl_ME", "goog.i18n.DateTimeSymbols_sr_Cyrl_RS", 
"goog.i18n.DateTimeSymbols_sr_Cyrl_XK", "goog.i18n.DateTimeSymbols_sr_Latn", "goog.i18n.DateTimeSymbols_sr_Latn_BA", "goog.i18n.DateTimeSymbols_sr_Latn_ME", "goog.i18n.DateTimeSymbols_sr_Latn_RS", "goog.i18n.DateTimeSymbols_sr_Latn_XK", "goog.i18n.DateTimeSymbols_ss", "goog.i18n.DateTimeSymbols_ss_SZ", "goog.i18n.DateTimeSymbols_ss_ZA", "goog.i18n.DateTimeSymbols_ssy", "goog.i18n.DateTimeSymbols_ssy_ER", "goog.i18n.DateTimeSymbols_sv_AX", "goog.i18n.DateTimeSymbols_sv_FI", "goog.i18n.DateTimeSymbols_sv_SE", 
"goog.i18n.DateTimeSymbols_sw_KE", "goog.i18n.DateTimeSymbols_sw_TZ", "goog.i18n.DateTimeSymbols_sw_UG", "goog.i18n.DateTimeSymbols_swc", "goog.i18n.DateTimeSymbols_swc_CD", "goog.i18n.DateTimeSymbols_ta_IN", "goog.i18n.DateTimeSymbols_ta_LK", "goog.i18n.DateTimeSymbols_ta_MY", "goog.i18n.DateTimeSymbols_ta_SG", "goog.i18n.DateTimeSymbols_te_IN", "goog.i18n.DateTimeSymbols_teo", "goog.i18n.DateTimeSymbols_teo_KE", "goog.i18n.DateTimeSymbols_teo_UG", "goog.i18n.DateTimeSymbols_th_TH", "goog.i18n.DateTimeSymbols_ti", 
"goog.i18n.DateTimeSymbols_ti_ER", "goog.i18n.DateTimeSymbols_ti_ET", "goog.i18n.DateTimeSymbols_tn", "goog.i18n.DateTimeSymbols_tn_BW", "goog.i18n.DateTimeSymbols_tn_ZA", "goog.i18n.DateTimeSymbols_to", "goog.i18n.DateTimeSymbols_to_TO", "goog.i18n.DateTimeSymbols_tr_CY", "goog.i18n.DateTimeSymbols_tr_TR", "goog.i18n.DateTimeSymbols_ts", "goog.i18n.DateTimeSymbols_ts_ZA", "goog.i18n.DateTimeSymbols_twq", "goog.i18n.DateTimeSymbols_twq_NE", "goog.i18n.DateTimeSymbols_tzm", "goog.i18n.DateTimeSymbols_tzm_Latn", 
"goog.i18n.DateTimeSymbols_tzm_Latn_MA", "goog.i18n.DateTimeSymbols_ug", "goog.i18n.DateTimeSymbols_ug_Arab", "goog.i18n.DateTimeSymbols_ug_Arab_CN", "goog.i18n.DateTimeSymbols_uk_UA", "goog.i18n.DateTimeSymbols_ur_IN", "goog.i18n.DateTimeSymbols_ur_PK", "goog.i18n.DateTimeSymbols_uz_Arab", "goog.i18n.DateTimeSymbols_uz_Arab_AF", "goog.i18n.DateTimeSymbols_uz_Cyrl", "goog.i18n.DateTimeSymbols_uz_Cyrl_UZ", "goog.i18n.DateTimeSymbols_uz_Latn", "goog.i18n.DateTimeSymbols_uz_Latn_UZ", "goog.i18n.DateTimeSymbols_vai", 
"goog.i18n.DateTimeSymbols_vai_Latn", "goog.i18n.DateTimeSymbols_vai_Latn_LR", "goog.i18n.DateTimeSymbols_vai_Vaii", "goog.i18n.DateTimeSymbols_vai_Vaii_LR", "goog.i18n.DateTimeSymbols_ve", "goog.i18n.DateTimeSymbols_ve_ZA", "goog.i18n.DateTimeSymbols_vi_VN", "goog.i18n.DateTimeSymbols_vo", "goog.i18n.DateTimeSymbols_vo_001", "goog.i18n.DateTimeSymbols_vun", "goog.i18n.DateTimeSymbols_vun_TZ", "goog.i18n.DateTimeSymbols_wae", "goog.i18n.DateTimeSymbols_wae_CH", "goog.i18n.DateTimeSymbols_xog", "goog.i18n.DateTimeSymbols_xog_UG", 
"goog.i18n.DateTimeSymbols_yav", "goog.i18n.DateTimeSymbols_yav_CM", "goog.i18n.DateTimeSymbols_yi", "goog.i18n.DateTimeSymbols_yi_001", "goog.i18n.DateTimeSymbols_yo", "goog.i18n.DateTimeSymbols_yo_BJ", "goog.i18n.DateTimeSymbols_yo_NG", "goog.i18n.DateTimeSymbols_zgh", "goog.i18n.DateTimeSymbols_zgh_MA", "goog.i18n.DateTimeSymbols_zh_Hans", "goog.i18n.DateTimeSymbols_zh_Hans_CN", "goog.i18n.DateTimeSymbols_zh_Hans_HK", "goog.i18n.DateTimeSymbols_zh_Hans_MO", "goog.i18n.DateTimeSymbols_zh_Hans_SG", 
"goog.i18n.DateTimeSymbols_zh_Hant", "goog.i18n.DateTimeSymbols_zh_Hant_HK", "goog.i18n.DateTimeSymbols_zh_Hant_MO", "goog.i18n.DateTimeSymbols_zh_Hant_TW", "goog.i18n.DateTimeSymbols_zu_ZA"], ["goog.i18n.DateTimeSymbols"], false);
goog.addDependency("i18n/graphemebreak.js", ["goog.i18n.GraphemeBreak"], ["goog.structs.InversionMap"], false);
goog.addDependency("i18n/graphemebreak_test.js", ["goog.i18n.GraphemeBreakTest"], ["goog.i18n.GraphemeBreak", "goog.testing.jsunit"], false);
goog.addDependency("i18n/messageformat.js", ["goog.i18n.MessageFormat"], ["goog.asserts", "goog.i18n.NumberFormat", "goog.i18n.ordinalRules", "goog.i18n.pluralRules"], false);
goog.addDependency("i18n/messageformat_test.js", ["goog.i18n.MessageFormatTest"], ["goog.i18n.MessageFormat", "goog.i18n.NumberFormatSymbols_hr", "goog.i18n.pluralRules", "goog.testing.PropertyReplacer", "goog.testing.jsunit"], false);
goog.addDependency("i18n/mime.js", ["goog.i18n.mime", "goog.i18n.mime.encode"], ["goog.array"], false);
goog.addDependency("i18n/mime_test.js", ["goog.i18n.mime.encodeTest"], ["goog.i18n.mime.encode", "goog.testing.jsunit"], false);
goog.addDependency("i18n/numberformat.js", ["goog.i18n.NumberFormat", "goog.i18n.NumberFormat.CurrencyStyle", "goog.i18n.NumberFormat.Format"], ["goog.asserts", "goog.i18n.CompactNumberFormatSymbols", "goog.i18n.NumberFormatSymbols", "goog.i18n.currency", "goog.math"], false);
goog.addDependency("i18n/numberformat_test.js", ["goog.i18n.NumberFormatTest"], ["goog.i18n.CompactNumberFormatSymbols", "goog.i18n.CompactNumberFormatSymbols_de", "goog.i18n.CompactNumberFormatSymbols_en", "goog.i18n.CompactNumberFormatSymbols_fr", "goog.i18n.NumberFormat", "goog.i18n.NumberFormatSymbols", "goog.i18n.NumberFormatSymbols_de", "goog.i18n.NumberFormatSymbols_en", "goog.i18n.NumberFormatSymbols_fr", "goog.i18n.NumberFormatSymbols_pl", "goog.i18n.NumberFormatSymbols_ro", "goog.testing.ExpectedFailures", 
"goog.testing.PropertyReplacer", "goog.testing.jsunit", "goog.userAgent", "goog.userAgent.product", "goog.userAgent.product.isVersion"], false);
goog.addDependency("i18n/numberformatsymbols.js", ["goog.i18n.NumberFormatSymbols", "goog.i18n.NumberFormatSymbols_af", "goog.i18n.NumberFormatSymbols_af_ZA", "goog.i18n.NumberFormatSymbols_am", "goog.i18n.NumberFormatSymbols_am_ET", "goog.i18n.NumberFormatSymbols_ar", "goog.i18n.NumberFormatSymbols_ar_001", "goog.i18n.NumberFormatSymbols_az", "goog.i18n.NumberFormatSymbols_az_Latn_AZ", "goog.i18n.NumberFormatSymbols_bg", "goog.i18n.NumberFormatSymbols_bg_BG", "goog.i18n.NumberFormatSymbols_bn", 
"goog.i18n.NumberFormatSymbols_bn_BD", "goog.i18n.NumberFormatSymbols_br", "goog.i18n.NumberFormatSymbols_br_FR", "goog.i18n.NumberFormatSymbols_ca", "goog.i18n.NumberFormatSymbols_ca_AD", "goog.i18n.NumberFormatSymbols_ca_ES", "goog.i18n.NumberFormatSymbols_ca_ES_VALENCIA", "goog.i18n.NumberFormatSymbols_ca_FR", "goog.i18n.NumberFormatSymbols_ca_IT", "goog.i18n.NumberFormatSymbols_chr", "goog.i18n.NumberFormatSymbols_chr_US", "goog.i18n.NumberFormatSymbols_cs", "goog.i18n.NumberFormatSymbols_cs_CZ", 
"goog.i18n.NumberFormatSymbols_cy", "goog.i18n.NumberFormatSymbols_cy_GB", "goog.i18n.NumberFormatSymbols_da", "goog.i18n.NumberFormatSymbols_da_DK", "goog.i18n.NumberFormatSymbols_da_GL", "goog.i18n.NumberFormatSymbols_de", "goog.i18n.NumberFormatSymbols_de_AT", "goog.i18n.NumberFormatSymbols_de_BE", "goog.i18n.NumberFormatSymbols_de_CH", "goog.i18n.NumberFormatSymbols_de_DE", "goog.i18n.NumberFormatSymbols_de_LU", "goog.i18n.NumberFormatSymbols_el", "goog.i18n.NumberFormatSymbols_el_GR", "goog.i18n.NumberFormatSymbols_en", 
"goog.i18n.NumberFormatSymbols_en_001", "goog.i18n.NumberFormatSymbols_en_AS", "goog.i18n.NumberFormatSymbols_en_AU", "goog.i18n.NumberFormatSymbols_en_DG", "goog.i18n.NumberFormatSymbols_en_FM", "goog.i18n.NumberFormatSymbols_en_GB", "goog.i18n.NumberFormatSymbols_en_GU", "goog.i18n.NumberFormatSymbols_en_IE", "goog.i18n.NumberFormatSymbols_en_IN", "goog.i18n.NumberFormatSymbols_en_IO", "goog.i18n.NumberFormatSymbols_en_MH", "goog.i18n.NumberFormatSymbols_en_MP", "goog.i18n.NumberFormatSymbols_en_PR", 
"goog.i18n.NumberFormatSymbols_en_PW", "goog.i18n.NumberFormatSymbols_en_SG", "goog.i18n.NumberFormatSymbols_en_TC", "goog.i18n.NumberFormatSymbols_en_UM", "goog.i18n.NumberFormatSymbols_en_US", "goog.i18n.NumberFormatSymbols_en_VG", "goog.i18n.NumberFormatSymbols_en_VI", "goog.i18n.NumberFormatSymbols_en_ZA", "goog.i18n.NumberFormatSymbols_en_ZW", "goog.i18n.NumberFormatSymbols_es", "goog.i18n.NumberFormatSymbols_es_419", "goog.i18n.NumberFormatSymbols_es_EA", "goog.i18n.NumberFormatSymbols_es_ES", 
"goog.i18n.NumberFormatSymbols_es_IC", "goog.i18n.NumberFormatSymbols_et", "goog.i18n.NumberFormatSymbols_et_EE", "goog.i18n.NumberFormatSymbols_eu", "goog.i18n.NumberFormatSymbols_eu_ES", "goog.i18n.NumberFormatSymbols_fa", "goog.i18n.NumberFormatSymbols_fa_IR", "goog.i18n.NumberFormatSymbols_fi", "goog.i18n.NumberFormatSymbols_fi_FI", "goog.i18n.NumberFormatSymbols_fil", "goog.i18n.NumberFormatSymbols_fil_PH", "goog.i18n.NumberFormatSymbols_fr", "goog.i18n.NumberFormatSymbols_fr_BL", "goog.i18n.NumberFormatSymbols_fr_CA", 
"goog.i18n.NumberFormatSymbols_fr_FR", "goog.i18n.NumberFormatSymbols_fr_GF", "goog.i18n.NumberFormatSymbols_fr_GP", "goog.i18n.NumberFormatSymbols_fr_MC", "goog.i18n.NumberFormatSymbols_fr_MF", "goog.i18n.NumberFormatSymbols_fr_MQ", "goog.i18n.NumberFormatSymbols_fr_PM", "goog.i18n.NumberFormatSymbols_fr_RE", "goog.i18n.NumberFormatSymbols_fr_YT", "goog.i18n.NumberFormatSymbols_ga", "goog.i18n.NumberFormatSymbols_ga_IE", "goog.i18n.NumberFormatSymbols_gl", "goog.i18n.NumberFormatSymbols_gl_ES", 
"goog.i18n.NumberFormatSymbols_gsw", "goog.i18n.NumberFormatSymbols_gsw_CH", "goog.i18n.NumberFormatSymbols_gsw_LI", "goog.i18n.NumberFormatSymbols_gu", "goog.i18n.NumberFormatSymbols_gu_IN", "goog.i18n.NumberFormatSymbols_haw", "goog.i18n.NumberFormatSymbols_haw_US", "goog.i18n.NumberFormatSymbols_he", "goog.i18n.NumberFormatSymbols_he_IL", "goog.i18n.NumberFormatSymbols_hi", "goog.i18n.NumberFormatSymbols_hi_IN", "goog.i18n.NumberFormatSymbols_hr", "goog.i18n.NumberFormatSymbols_hr_HR", "goog.i18n.NumberFormatSymbols_hu", 
"goog.i18n.NumberFormatSymbols_hu_HU", "goog.i18n.NumberFormatSymbols_hy", "goog.i18n.NumberFormatSymbols_hy_AM", "goog.i18n.NumberFormatSymbols_id", "goog.i18n.NumberFormatSymbols_id_ID", "goog.i18n.NumberFormatSymbols_in", "goog.i18n.NumberFormatSymbols_is", "goog.i18n.NumberFormatSymbols_is_IS", "goog.i18n.NumberFormatSymbols_it", "goog.i18n.NumberFormatSymbols_it_IT", "goog.i18n.NumberFormatSymbols_it_SM", "goog.i18n.NumberFormatSymbols_iw", "goog.i18n.NumberFormatSymbols_ja", "goog.i18n.NumberFormatSymbols_ja_JP", 
"goog.i18n.NumberFormatSymbols_ka", "goog.i18n.NumberFormatSymbols_ka_GE", "goog.i18n.NumberFormatSymbols_kk", "goog.i18n.NumberFormatSymbols_kk_Cyrl_KZ", "goog.i18n.NumberFormatSymbols_km", "goog.i18n.NumberFormatSymbols_km_KH", "goog.i18n.NumberFormatSymbols_kn", "goog.i18n.NumberFormatSymbols_kn_IN", "goog.i18n.NumberFormatSymbols_ko", "goog.i18n.NumberFormatSymbols_ko_KR", "goog.i18n.NumberFormatSymbols_ky", "goog.i18n.NumberFormatSymbols_ky_Cyrl_KG", "goog.i18n.NumberFormatSymbols_ln", "goog.i18n.NumberFormatSymbols_ln_CD", 
"goog.i18n.NumberFormatSymbols_lo", "goog.i18n.NumberFormatSymbols_lo_LA", "goog.i18n.NumberFormatSymbols_lt", "goog.i18n.NumberFormatSymbols_lt_LT", "goog.i18n.NumberFormatSymbols_lv", "goog.i18n.NumberFormatSymbols_lv_LV", "goog.i18n.NumberFormatSymbols_mk", "goog.i18n.NumberFormatSymbols_mk_MK", "goog.i18n.NumberFormatSymbols_ml", "goog.i18n.NumberFormatSymbols_ml_IN", "goog.i18n.NumberFormatSymbols_mn", "goog.i18n.NumberFormatSymbols_mn_Cyrl_MN", "goog.i18n.NumberFormatSymbols_mr", "goog.i18n.NumberFormatSymbols_mr_IN", 
"goog.i18n.NumberFormatSymbols_ms", "goog.i18n.NumberFormatSymbols_ms_Latn_MY", "goog.i18n.NumberFormatSymbols_mt", "goog.i18n.NumberFormatSymbols_mt_MT", "goog.i18n.NumberFormatSymbols_my", "goog.i18n.NumberFormatSymbols_my_MM", "goog.i18n.NumberFormatSymbols_nb", "goog.i18n.NumberFormatSymbols_nb_NO", "goog.i18n.NumberFormatSymbols_nb_SJ", "goog.i18n.NumberFormatSymbols_ne", "goog.i18n.NumberFormatSymbols_ne_NP", "goog.i18n.NumberFormatSymbols_nl", "goog.i18n.NumberFormatSymbols_nl_NL", "goog.i18n.NumberFormatSymbols_no", 
"goog.i18n.NumberFormatSymbols_no_NO", "goog.i18n.NumberFormatSymbols_or", "goog.i18n.NumberFormatSymbols_or_IN", "goog.i18n.NumberFormatSymbols_pa", "goog.i18n.NumberFormatSymbols_pa_Guru_IN", "goog.i18n.NumberFormatSymbols_pl", "goog.i18n.NumberFormatSymbols_pl_PL", "goog.i18n.NumberFormatSymbols_pt", "goog.i18n.NumberFormatSymbols_pt_BR", "goog.i18n.NumberFormatSymbols_pt_PT", "goog.i18n.NumberFormatSymbols_ro", "goog.i18n.NumberFormatSymbols_ro_RO", "goog.i18n.NumberFormatSymbols_ru", "goog.i18n.NumberFormatSymbols_ru_RU", 
"goog.i18n.NumberFormatSymbols_si", "goog.i18n.NumberFormatSymbols_si_LK", "goog.i18n.NumberFormatSymbols_sk", "goog.i18n.NumberFormatSymbols_sk_SK", "goog.i18n.NumberFormatSymbols_sl", "goog.i18n.NumberFormatSymbols_sl_SI", "goog.i18n.NumberFormatSymbols_sq", "goog.i18n.NumberFormatSymbols_sq_AL", "goog.i18n.NumberFormatSymbols_sr", "goog.i18n.NumberFormatSymbols_sr_Cyrl_RS", "goog.i18n.NumberFormatSymbols_sv", "goog.i18n.NumberFormatSymbols_sv_SE", "goog.i18n.NumberFormatSymbols_sw", "goog.i18n.NumberFormatSymbols_sw_TZ", 
"goog.i18n.NumberFormatSymbols_ta", "goog.i18n.NumberFormatSymbols_ta_IN", "goog.i18n.NumberFormatSymbols_te", "goog.i18n.NumberFormatSymbols_te_IN", "goog.i18n.NumberFormatSymbols_th", "goog.i18n.NumberFormatSymbols_th_TH", "goog.i18n.NumberFormatSymbols_tl", "goog.i18n.NumberFormatSymbols_tr", "goog.i18n.NumberFormatSymbols_tr_TR", "goog.i18n.NumberFormatSymbols_uk", "goog.i18n.NumberFormatSymbols_uk_UA", "goog.i18n.NumberFormatSymbols_ur", "goog.i18n.NumberFormatSymbols_ur_PK", "goog.i18n.NumberFormatSymbols_uz", 
"goog.i18n.NumberFormatSymbols_uz_Latn_UZ", "goog.i18n.NumberFormatSymbols_vi", "goog.i18n.NumberFormatSymbols_vi_VN", "goog.i18n.NumberFormatSymbols_zh", "goog.i18n.NumberFormatSymbols_zh_CN", "goog.i18n.NumberFormatSymbols_zh_HK", "goog.i18n.NumberFormatSymbols_zh_Hans_CN", "goog.i18n.NumberFormatSymbols_zh_TW", "goog.i18n.NumberFormatSymbols_zu", "goog.i18n.NumberFormatSymbols_zu_ZA"], [], false);
goog.addDependency("i18n/numberformatsymbolsext.js", ["goog.i18n.NumberFormatSymbolsExt", "goog.i18n.NumberFormatSymbols_aa", "goog.i18n.NumberFormatSymbols_aa_DJ", "goog.i18n.NumberFormatSymbols_aa_ER", "goog.i18n.NumberFormatSymbols_aa_ET", "goog.i18n.NumberFormatSymbols_af_NA", "goog.i18n.NumberFormatSymbols_agq", "goog.i18n.NumberFormatSymbols_agq_CM", "goog.i18n.NumberFormatSymbols_ak", "goog.i18n.NumberFormatSymbols_ak_GH", "goog.i18n.NumberFormatSymbols_ar_AE", "goog.i18n.NumberFormatSymbols_ar_BH", 
"goog.i18n.NumberFormatSymbols_ar_DJ", "goog.i18n.NumberFormatSymbols_ar_DZ", "goog.i18n.NumberFormatSymbols_ar_EG", "goog.i18n.NumberFormatSymbols_ar_EH", "goog.i18n.NumberFormatSymbols_ar_ER", "goog.i18n.NumberFormatSymbols_ar_IL", "goog.i18n.NumberFormatSymbols_ar_IQ", "goog.i18n.NumberFormatSymbols_ar_JO", "goog.i18n.NumberFormatSymbols_ar_KM", "goog.i18n.NumberFormatSymbols_ar_KW", "goog.i18n.NumberFormatSymbols_ar_LB", "goog.i18n.NumberFormatSymbols_ar_LY", "goog.i18n.NumberFormatSymbols_ar_MA", 
"goog.i18n.NumberFormatSymbols_ar_MR", "goog.i18n.NumberFormatSymbols_ar_OM", "goog.i18n.NumberFormatSymbols_ar_PS", "goog.i18n.NumberFormatSymbols_ar_QA", "goog.i18n.NumberFormatSymbols_ar_SA", "goog.i18n.NumberFormatSymbols_ar_SD", "goog.i18n.NumberFormatSymbols_ar_SO", "goog.i18n.NumberFormatSymbols_ar_SS", "goog.i18n.NumberFormatSymbols_ar_SY", "goog.i18n.NumberFormatSymbols_ar_TD", "goog.i18n.NumberFormatSymbols_ar_TN", "goog.i18n.NumberFormatSymbols_ar_YE", "goog.i18n.NumberFormatSymbols_as", 
"goog.i18n.NumberFormatSymbols_as_IN", "goog.i18n.NumberFormatSymbols_asa", "goog.i18n.NumberFormatSymbols_asa_TZ", "goog.i18n.NumberFormatSymbols_ast", "goog.i18n.NumberFormatSymbols_ast_ES", "goog.i18n.NumberFormatSymbols_az_Cyrl", "goog.i18n.NumberFormatSymbols_az_Cyrl_AZ", "goog.i18n.NumberFormatSymbols_az_Latn", "goog.i18n.NumberFormatSymbols_bas", "goog.i18n.NumberFormatSymbols_bas_CM", "goog.i18n.NumberFormatSymbols_be", "goog.i18n.NumberFormatSymbols_be_BY", "goog.i18n.NumberFormatSymbols_bem", 
"goog.i18n.NumberFormatSymbols_bem_ZM", "goog.i18n.NumberFormatSymbols_bez", "goog.i18n.NumberFormatSymbols_bez_TZ", "goog.i18n.NumberFormatSymbols_bm", "goog.i18n.NumberFormatSymbols_bm_Latn", "goog.i18n.NumberFormatSymbols_bm_Latn_ML", "goog.i18n.NumberFormatSymbols_bn_IN", "goog.i18n.NumberFormatSymbols_bo", "goog.i18n.NumberFormatSymbols_bo_CN", "goog.i18n.NumberFormatSymbols_bo_IN", "goog.i18n.NumberFormatSymbols_brx", "goog.i18n.NumberFormatSymbols_brx_IN", "goog.i18n.NumberFormatSymbols_bs", 
"goog.i18n.NumberFormatSymbols_bs_Cyrl", "goog.i18n.NumberFormatSymbols_bs_Cyrl_BA", "goog.i18n.NumberFormatSymbols_bs_Latn", "goog.i18n.NumberFormatSymbols_bs_Latn_BA", "goog.i18n.NumberFormatSymbols_cgg", "goog.i18n.NumberFormatSymbols_cgg_UG", "goog.i18n.NumberFormatSymbols_ckb", "goog.i18n.NumberFormatSymbols_ckb_Arab", "goog.i18n.NumberFormatSymbols_ckb_Arab_IQ", "goog.i18n.NumberFormatSymbols_ckb_Arab_IR", "goog.i18n.NumberFormatSymbols_ckb_IQ", "goog.i18n.NumberFormatSymbols_ckb_IR", "goog.i18n.NumberFormatSymbols_ckb_Latn", 
"goog.i18n.NumberFormatSymbols_ckb_Latn_IQ", "goog.i18n.NumberFormatSymbols_dav", "goog.i18n.NumberFormatSymbols_dav_KE", "goog.i18n.NumberFormatSymbols_de_LI", "goog.i18n.NumberFormatSymbols_dje", "goog.i18n.NumberFormatSymbols_dje_NE", "goog.i18n.NumberFormatSymbols_dsb", "goog.i18n.NumberFormatSymbols_dsb_DE", "goog.i18n.NumberFormatSymbols_dua", "goog.i18n.NumberFormatSymbols_dua_CM", "goog.i18n.NumberFormatSymbols_dyo", "goog.i18n.NumberFormatSymbols_dyo_SN", "goog.i18n.NumberFormatSymbols_dz", 
"goog.i18n.NumberFormatSymbols_dz_BT", "goog.i18n.NumberFormatSymbols_ebu", "goog.i18n.NumberFormatSymbols_ebu_KE", "goog.i18n.NumberFormatSymbols_ee", "goog.i18n.NumberFormatSymbols_ee_GH", "goog.i18n.NumberFormatSymbols_ee_TG", "goog.i18n.NumberFormatSymbols_el_CY", "goog.i18n.NumberFormatSymbols_en_150", "goog.i18n.NumberFormatSymbols_en_AG", "goog.i18n.NumberFormatSymbols_en_AI", "goog.i18n.NumberFormatSymbols_en_BB", "goog.i18n.NumberFormatSymbols_en_BE", "goog.i18n.NumberFormatSymbols_en_BM", 
"goog.i18n.NumberFormatSymbols_en_BS", "goog.i18n.NumberFormatSymbols_en_BW", "goog.i18n.NumberFormatSymbols_en_BZ", "goog.i18n.NumberFormatSymbols_en_CA", "goog.i18n.NumberFormatSymbols_en_CC", "goog.i18n.NumberFormatSymbols_en_CK", "goog.i18n.NumberFormatSymbols_en_CM", "goog.i18n.NumberFormatSymbols_en_CX", "goog.i18n.NumberFormatSymbols_en_DM", "goog.i18n.NumberFormatSymbols_en_ER", "goog.i18n.NumberFormatSymbols_en_FJ", "goog.i18n.NumberFormatSymbols_en_FK", "goog.i18n.NumberFormatSymbols_en_GD", 
"goog.i18n.NumberFormatSymbols_en_GG", "goog.i18n.NumberFormatSymbols_en_GH", "goog.i18n.NumberFormatSymbols_en_GI", "goog.i18n.NumberFormatSymbols_en_GM", "goog.i18n.NumberFormatSymbols_en_GY", "goog.i18n.NumberFormatSymbols_en_HK", "goog.i18n.NumberFormatSymbols_en_IM", "goog.i18n.NumberFormatSymbols_en_JE", "goog.i18n.NumberFormatSymbols_en_JM", "goog.i18n.NumberFormatSymbols_en_KE", "goog.i18n.NumberFormatSymbols_en_KI", "goog.i18n.NumberFormatSymbols_en_KN", "goog.i18n.NumberFormatSymbols_en_KY", 
"goog.i18n.NumberFormatSymbols_en_LC", "goog.i18n.NumberFormatSymbols_en_LR", "goog.i18n.NumberFormatSymbols_en_LS", "goog.i18n.NumberFormatSymbols_en_MG", "goog.i18n.NumberFormatSymbols_en_MO", "goog.i18n.NumberFormatSymbols_en_MS", "goog.i18n.NumberFormatSymbols_en_MT", "goog.i18n.NumberFormatSymbols_en_MU", "goog.i18n.NumberFormatSymbols_en_MW", "goog.i18n.NumberFormatSymbols_en_MY", "goog.i18n.NumberFormatSymbols_en_NA", "goog.i18n.NumberFormatSymbols_en_NF", "goog.i18n.NumberFormatSymbols_en_NG", 
"goog.i18n.NumberFormatSymbols_en_NR", "goog.i18n.NumberFormatSymbols_en_NU", "goog.i18n.NumberFormatSymbols_en_NZ", "goog.i18n.NumberFormatSymbols_en_PG", "goog.i18n.NumberFormatSymbols_en_PH", "goog.i18n.NumberFormatSymbols_en_PK", "goog.i18n.NumberFormatSymbols_en_PN", "goog.i18n.NumberFormatSymbols_en_RW", "goog.i18n.NumberFormatSymbols_en_SB", "goog.i18n.NumberFormatSymbols_en_SC", "goog.i18n.NumberFormatSymbols_en_SD", "goog.i18n.NumberFormatSymbols_en_SH", "goog.i18n.NumberFormatSymbols_en_SL", 
"goog.i18n.NumberFormatSymbols_en_SS", "goog.i18n.NumberFormatSymbols_en_SX", "goog.i18n.NumberFormatSymbols_en_SZ", "goog.i18n.NumberFormatSymbols_en_TK", "goog.i18n.NumberFormatSymbols_en_TO", "goog.i18n.NumberFormatSymbols_en_TT", "goog.i18n.NumberFormatSymbols_en_TV", "goog.i18n.NumberFormatSymbols_en_TZ", "goog.i18n.NumberFormatSymbols_en_UG", "goog.i18n.NumberFormatSymbols_en_VC", "goog.i18n.NumberFormatSymbols_en_VU", "goog.i18n.NumberFormatSymbols_en_WS", "goog.i18n.NumberFormatSymbols_en_ZM", 
"goog.i18n.NumberFormatSymbols_eo", "goog.i18n.NumberFormatSymbols_eo_001", "goog.i18n.NumberFormatSymbols_es_AR", "goog.i18n.NumberFormatSymbols_es_BO", "goog.i18n.NumberFormatSymbols_es_CL", "goog.i18n.NumberFormatSymbols_es_CO", "goog.i18n.NumberFormatSymbols_es_CR", "goog.i18n.NumberFormatSymbols_es_CU", "goog.i18n.NumberFormatSymbols_es_DO", "goog.i18n.NumberFormatSymbols_es_EC", "goog.i18n.NumberFormatSymbols_es_GQ", "goog.i18n.NumberFormatSymbols_es_GT", "goog.i18n.NumberFormatSymbols_es_HN", 
"goog.i18n.NumberFormatSymbols_es_MX", "goog.i18n.NumberFormatSymbols_es_NI", "goog.i18n.NumberFormatSymbols_es_PA", "goog.i18n.NumberFormatSymbols_es_PE", "goog.i18n.NumberFormatSymbols_es_PH", "goog.i18n.NumberFormatSymbols_es_PR", "goog.i18n.NumberFormatSymbols_es_PY", "goog.i18n.NumberFormatSymbols_es_SV", "goog.i18n.NumberFormatSymbols_es_US", "goog.i18n.NumberFormatSymbols_es_UY", "goog.i18n.NumberFormatSymbols_es_VE", "goog.i18n.NumberFormatSymbols_ewo", "goog.i18n.NumberFormatSymbols_ewo_CM", 
"goog.i18n.NumberFormatSymbols_fa_AF", "goog.i18n.NumberFormatSymbols_ff", "goog.i18n.NumberFormatSymbols_ff_CM", "goog.i18n.NumberFormatSymbols_ff_GN", "goog.i18n.NumberFormatSymbols_ff_MR", "goog.i18n.NumberFormatSymbols_ff_SN", "goog.i18n.NumberFormatSymbols_fo", "goog.i18n.NumberFormatSymbols_fo_FO", "goog.i18n.NumberFormatSymbols_fr_BE", "goog.i18n.NumberFormatSymbols_fr_BF", "goog.i18n.NumberFormatSymbols_fr_BI", "goog.i18n.NumberFormatSymbols_fr_BJ", "goog.i18n.NumberFormatSymbols_fr_CD", 
"goog.i18n.NumberFormatSymbols_fr_CF", "goog.i18n.NumberFormatSymbols_fr_CG", "goog.i18n.NumberFormatSymbols_fr_CH", "goog.i18n.NumberFormatSymbols_fr_CI", "goog.i18n.NumberFormatSymbols_fr_CM", "goog.i18n.NumberFormatSymbols_fr_DJ", "goog.i18n.NumberFormatSymbols_fr_DZ", "goog.i18n.NumberFormatSymbols_fr_GA", "goog.i18n.NumberFormatSymbols_fr_GN", "goog.i18n.NumberFormatSymbols_fr_GQ", "goog.i18n.NumberFormatSymbols_fr_HT", "goog.i18n.NumberFormatSymbols_fr_KM", "goog.i18n.NumberFormatSymbols_fr_LU", 
"goog.i18n.NumberFormatSymbols_fr_MA", "goog.i18n.NumberFormatSymbols_fr_MG", "goog.i18n.NumberFormatSymbols_fr_ML", "goog.i18n.NumberFormatSymbols_fr_MR", "goog.i18n.NumberFormatSymbols_fr_MU", "goog.i18n.NumberFormatSymbols_fr_NC", "goog.i18n.NumberFormatSymbols_fr_NE", "goog.i18n.NumberFormatSymbols_fr_PF", "goog.i18n.NumberFormatSymbols_fr_RW", "goog.i18n.NumberFormatSymbols_fr_SC", "goog.i18n.NumberFormatSymbols_fr_SN", "goog.i18n.NumberFormatSymbols_fr_SY", "goog.i18n.NumberFormatSymbols_fr_TD", 
"goog.i18n.NumberFormatSymbols_fr_TG", "goog.i18n.NumberFormatSymbols_fr_TN", "goog.i18n.NumberFormatSymbols_fr_VU", "goog.i18n.NumberFormatSymbols_fr_WF", "goog.i18n.NumberFormatSymbols_fur", "goog.i18n.NumberFormatSymbols_fur_IT", "goog.i18n.NumberFormatSymbols_fy", "goog.i18n.NumberFormatSymbols_fy_NL", "goog.i18n.NumberFormatSymbols_gd", "goog.i18n.NumberFormatSymbols_gd_GB", "goog.i18n.NumberFormatSymbols_gsw_FR", "goog.i18n.NumberFormatSymbols_guz", "goog.i18n.NumberFormatSymbols_guz_KE", "goog.i18n.NumberFormatSymbols_gv", 
"goog.i18n.NumberFormatSymbols_gv_IM", "goog.i18n.NumberFormatSymbols_ha", "goog.i18n.NumberFormatSymbols_ha_Latn", "goog.i18n.NumberFormatSymbols_ha_Latn_GH", "goog.i18n.NumberFormatSymbols_ha_Latn_NE", "goog.i18n.NumberFormatSymbols_ha_Latn_NG", "goog.i18n.NumberFormatSymbols_hr_BA", "goog.i18n.NumberFormatSymbols_hsb", "goog.i18n.NumberFormatSymbols_hsb_DE", "goog.i18n.NumberFormatSymbols_ia", "goog.i18n.NumberFormatSymbols_ia_FR", "goog.i18n.NumberFormatSymbols_ig", "goog.i18n.NumberFormatSymbols_ig_NG", 
"goog.i18n.NumberFormatSymbols_ii", "goog.i18n.NumberFormatSymbols_ii_CN", "goog.i18n.NumberFormatSymbols_it_CH", "goog.i18n.NumberFormatSymbols_jgo", "goog.i18n.NumberFormatSymbols_jgo_CM", "goog.i18n.NumberFormatSymbols_jmc", "goog.i18n.NumberFormatSymbols_jmc_TZ", "goog.i18n.NumberFormatSymbols_kab", "goog.i18n.NumberFormatSymbols_kab_DZ", "goog.i18n.NumberFormatSymbols_kam", "goog.i18n.NumberFormatSymbols_kam_KE", "goog.i18n.NumberFormatSymbols_kde", "goog.i18n.NumberFormatSymbols_kde_TZ", "goog.i18n.NumberFormatSymbols_kea", 
"goog.i18n.NumberFormatSymbols_kea_CV", "goog.i18n.NumberFormatSymbols_khq", "goog.i18n.NumberFormatSymbols_khq_ML", "goog.i18n.NumberFormatSymbols_ki", "goog.i18n.NumberFormatSymbols_ki_KE", "goog.i18n.NumberFormatSymbols_kk_Cyrl", "goog.i18n.NumberFormatSymbols_kkj", "goog.i18n.NumberFormatSymbols_kkj_CM", "goog.i18n.NumberFormatSymbols_kl", "goog.i18n.NumberFormatSymbols_kl_GL", "goog.i18n.NumberFormatSymbols_kln", "goog.i18n.NumberFormatSymbols_kln_KE", "goog.i18n.NumberFormatSymbols_ko_KP", 
"goog.i18n.NumberFormatSymbols_kok", "goog.i18n.NumberFormatSymbols_kok_IN", "goog.i18n.NumberFormatSymbols_ks", "goog.i18n.NumberFormatSymbols_ks_Arab", "goog.i18n.NumberFormatSymbols_ks_Arab_IN", "goog.i18n.NumberFormatSymbols_ksb", "goog.i18n.NumberFormatSymbols_ksb_TZ", "goog.i18n.NumberFormatSymbols_ksf", "goog.i18n.NumberFormatSymbols_ksf_CM", "goog.i18n.NumberFormatSymbols_ksh", "goog.i18n.NumberFormatSymbols_ksh_DE", "goog.i18n.NumberFormatSymbols_kw", "goog.i18n.NumberFormatSymbols_kw_GB", 
"goog.i18n.NumberFormatSymbols_ky_Cyrl", "goog.i18n.NumberFormatSymbols_lag", "goog.i18n.NumberFormatSymbols_lag_TZ", "goog.i18n.NumberFormatSymbols_lb", "goog.i18n.NumberFormatSymbols_lb_LU", "goog.i18n.NumberFormatSymbols_lg", "goog.i18n.NumberFormatSymbols_lg_UG", "goog.i18n.NumberFormatSymbols_lkt", "goog.i18n.NumberFormatSymbols_lkt_US", "goog.i18n.NumberFormatSymbols_ln_AO", "goog.i18n.NumberFormatSymbols_ln_CF", "goog.i18n.NumberFormatSymbols_ln_CG", "goog.i18n.NumberFormatSymbols_lu", "goog.i18n.NumberFormatSymbols_lu_CD", 
"goog.i18n.NumberFormatSymbols_luo", "goog.i18n.NumberFormatSymbols_luo_KE", "goog.i18n.NumberFormatSymbols_luy", "goog.i18n.NumberFormatSymbols_luy_KE", "goog.i18n.NumberFormatSymbols_mas", "goog.i18n.NumberFormatSymbols_mas_KE", "goog.i18n.NumberFormatSymbols_mas_TZ", "goog.i18n.NumberFormatSymbols_mer", "goog.i18n.NumberFormatSymbols_mer_KE", "goog.i18n.NumberFormatSymbols_mfe", "goog.i18n.NumberFormatSymbols_mfe_MU", "goog.i18n.NumberFormatSymbols_mg", "goog.i18n.NumberFormatSymbols_mg_MG", "goog.i18n.NumberFormatSymbols_mgh", 
"goog.i18n.NumberFormatSymbols_mgh_MZ", "goog.i18n.NumberFormatSymbols_mgo", "goog.i18n.NumberFormatSymbols_mgo_CM", "goog.i18n.NumberFormatSymbols_mn_Cyrl", "goog.i18n.NumberFormatSymbols_ms_Latn", "goog.i18n.NumberFormatSymbols_ms_Latn_BN", "goog.i18n.NumberFormatSymbols_ms_Latn_SG", "goog.i18n.NumberFormatSymbols_mua", "goog.i18n.NumberFormatSymbols_mua_CM", "goog.i18n.NumberFormatSymbols_naq", "goog.i18n.NumberFormatSymbols_naq_NA", "goog.i18n.NumberFormatSymbols_nd", "goog.i18n.NumberFormatSymbols_nd_ZW", 
"goog.i18n.NumberFormatSymbols_ne_IN", "goog.i18n.NumberFormatSymbols_nl_AW", "goog.i18n.NumberFormatSymbols_nl_BE", "goog.i18n.NumberFormatSymbols_nl_BQ", "goog.i18n.NumberFormatSymbols_nl_CW", "goog.i18n.NumberFormatSymbols_nl_SR", "goog.i18n.NumberFormatSymbols_nl_SX", "goog.i18n.NumberFormatSymbols_nmg", "goog.i18n.NumberFormatSymbols_nmg_CM", "goog.i18n.NumberFormatSymbols_nn", "goog.i18n.NumberFormatSymbols_nn_NO", "goog.i18n.NumberFormatSymbols_nnh", "goog.i18n.NumberFormatSymbols_nnh_CM", 
"goog.i18n.NumberFormatSymbols_nr", "goog.i18n.NumberFormatSymbols_nr_ZA", "goog.i18n.NumberFormatSymbols_nso", "goog.i18n.NumberFormatSymbols_nso_ZA", "goog.i18n.NumberFormatSymbols_nus", "goog.i18n.NumberFormatSymbols_nus_SD", "goog.i18n.NumberFormatSymbols_nyn", "goog.i18n.NumberFormatSymbols_nyn_UG", "goog.i18n.NumberFormatSymbols_om", "goog.i18n.NumberFormatSymbols_om_ET", "goog.i18n.NumberFormatSymbols_om_KE", "goog.i18n.NumberFormatSymbols_os", "goog.i18n.NumberFormatSymbols_os_GE", "goog.i18n.NumberFormatSymbols_os_RU", 
"goog.i18n.NumberFormatSymbols_pa_Arab", "goog.i18n.NumberFormatSymbols_pa_Arab_PK", "goog.i18n.NumberFormatSymbols_pa_Guru", "goog.i18n.NumberFormatSymbols_ps", "goog.i18n.NumberFormatSymbols_ps_AF", "goog.i18n.NumberFormatSymbols_pt_AO", "goog.i18n.NumberFormatSymbols_pt_CV", "goog.i18n.NumberFormatSymbols_pt_GW", "goog.i18n.NumberFormatSymbols_pt_MO", "goog.i18n.NumberFormatSymbols_pt_MZ", "goog.i18n.NumberFormatSymbols_pt_ST", "goog.i18n.NumberFormatSymbols_pt_TL", "goog.i18n.NumberFormatSymbols_qu", 
"goog.i18n.NumberFormatSymbols_qu_BO", "goog.i18n.NumberFormatSymbols_qu_EC", "goog.i18n.NumberFormatSymbols_qu_PE", "goog.i18n.NumberFormatSymbols_rm", "goog.i18n.NumberFormatSymbols_rm_CH", "goog.i18n.NumberFormatSymbols_rn", "goog.i18n.NumberFormatSymbols_rn_BI", "goog.i18n.NumberFormatSymbols_ro_MD", "goog.i18n.NumberFormatSymbols_rof", "goog.i18n.NumberFormatSymbols_rof_TZ", "goog.i18n.NumberFormatSymbols_ru_BY", "goog.i18n.NumberFormatSymbols_ru_KG", "goog.i18n.NumberFormatSymbols_ru_KZ", "goog.i18n.NumberFormatSymbols_ru_MD", 
"goog.i18n.NumberFormatSymbols_ru_UA", "goog.i18n.NumberFormatSymbols_rw", "goog.i18n.NumberFormatSymbols_rw_RW", "goog.i18n.NumberFormatSymbols_rwk", "goog.i18n.NumberFormatSymbols_rwk_TZ", "goog.i18n.NumberFormatSymbols_sah", "goog.i18n.NumberFormatSymbols_sah_RU", "goog.i18n.NumberFormatSymbols_saq", "goog.i18n.NumberFormatSymbols_saq_KE", "goog.i18n.NumberFormatSymbols_sbp", "goog.i18n.NumberFormatSymbols_sbp_TZ", "goog.i18n.NumberFormatSymbols_se", "goog.i18n.NumberFormatSymbols_se_FI", "goog.i18n.NumberFormatSymbols_se_NO", 
"goog.i18n.NumberFormatSymbols_se_SE", "goog.i18n.NumberFormatSymbols_seh", "goog.i18n.NumberFormatSymbols_seh_MZ", "goog.i18n.NumberFormatSymbols_ses", "goog.i18n.NumberFormatSymbols_ses_ML", "goog.i18n.NumberFormatSymbols_sg", "goog.i18n.NumberFormatSymbols_sg_CF", "goog.i18n.NumberFormatSymbols_shi", "goog.i18n.NumberFormatSymbols_shi_Latn", "goog.i18n.NumberFormatSymbols_shi_Latn_MA", "goog.i18n.NumberFormatSymbols_shi_Tfng", "goog.i18n.NumberFormatSymbols_shi_Tfng_MA", "goog.i18n.NumberFormatSymbols_smn", 
"goog.i18n.NumberFormatSymbols_smn_FI", "goog.i18n.NumberFormatSymbols_sn", "goog.i18n.NumberFormatSymbols_sn_ZW", "goog.i18n.NumberFormatSymbols_so", "goog.i18n.NumberFormatSymbols_so_DJ", "goog.i18n.NumberFormatSymbols_so_ET", "goog.i18n.NumberFormatSymbols_so_KE", "goog.i18n.NumberFormatSymbols_so_SO", "goog.i18n.NumberFormatSymbols_sq_MK", "goog.i18n.NumberFormatSymbols_sq_XK", "goog.i18n.NumberFormatSymbols_sr_Cyrl", "goog.i18n.NumberFormatSymbols_sr_Cyrl_BA", "goog.i18n.NumberFormatSymbols_sr_Cyrl_ME", 
"goog.i18n.NumberFormatSymbols_sr_Cyrl_XK", "goog.i18n.NumberFormatSymbols_sr_Latn", "goog.i18n.NumberFormatSymbols_sr_Latn_BA", "goog.i18n.NumberFormatSymbols_sr_Latn_ME", "goog.i18n.NumberFormatSymbols_sr_Latn_RS", "goog.i18n.NumberFormatSymbols_sr_Latn_XK", "goog.i18n.NumberFormatSymbols_ss", "goog.i18n.NumberFormatSymbols_ss_SZ", "goog.i18n.NumberFormatSymbols_ss_ZA", "goog.i18n.NumberFormatSymbols_ssy", "goog.i18n.NumberFormatSymbols_ssy_ER", "goog.i18n.NumberFormatSymbols_sv_AX", "goog.i18n.NumberFormatSymbols_sv_FI", 
"goog.i18n.NumberFormatSymbols_sw_KE", "goog.i18n.NumberFormatSymbols_sw_UG", "goog.i18n.NumberFormatSymbols_swc", "goog.i18n.NumberFormatSymbols_swc_CD", "goog.i18n.NumberFormatSymbols_ta_LK", "goog.i18n.NumberFormatSymbols_ta_MY", "goog.i18n.NumberFormatSymbols_ta_SG", "goog.i18n.NumberFormatSymbols_teo", "goog.i18n.NumberFormatSymbols_teo_KE", "goog.i18n.NumberFormatSymbols_teo_UG", "goog.i18n.NumberFormatSymbols_ti", "goog.i18n.NumberFormatSymbols_ti_ER", "goog.i18n.NumberFormatSymbols_ti_ET", 
"goog.i18n.NumberFormatSymbols_tn", "goog.i18n.NumberFormatSymbols_tn_BW", "goog.i18n.NumberFormatSymbols_tn_ZA", "goog.i18n.NumberFormatSymbols_to", "goog.i18n.NumberFormatSymbols_to_TO", "goog.i18n.NumberFormatSymbols_tr_CY", "goog.i18n.NumberFormatSymbols_ts", "goog.i18n.NumberFormatSymbols_ts_ZA", "goog.i18n.NumberFormatSymbols_twq", "goog.i18n.NumberFormatSymbols_twq_NE", "goog.i18n.NumberFormatSymbols_tzm", "goog.i18n.NumberFormatSymbols_tzm_Latn", "goog.i18n.NumberFormatSymbols_tzm_Latn_MA", 
"goog.i18n.NumberFormatSymbols_ug", "goog.i18n.NumberFormatSymbols_ug_Arab", "goog.i18n.NumberFormatSymbols_ug_Arab_CN", "goog.i18n.NumberFormatSymbols_ur_IN", "goog.i18n.NumberFormatSymbols_uz_Arab", "goog.i18n.NumberFormatSymbols_uz_Arab_AF", "goog.i18n.NumberFormatSymbols_uz_Cyrl", "goog.i18n.NumberFormatSymbols_uz_Cyrl_UZ", "goog.i18n.NumberFormatSymbols_uz_Latn", "goog.i18n.NumberFormatSymbols_vai", "goog.i18n.NumberFormatSymbols_vai_Latn", "goog.i18n.NumberFormatSymbols_vai_Latn_LR", "goog.i18n.NumberFormatSymbols_vai_Vaii", 
"goog.i18n.NumberFormatSymbols_vai_Vaii_LR", "goog.i18n.NumberFormatSymbols_ve", "goog.i18n.NumberFormatSymbols_ve_ZA", "goog.i18n.NumberFormatSymbols_vo", "goog.i18n.NumberFormatSymbols_vo_001", "goog.i18n.NumberFormatSymbols_vun", "goog.i18n.NumberFormatSymbols_vun_TZ", "goog.i18n.NumberFormatSymbols_wae", "goog.i18n.NumberFormatSymbols_wae_CH", "goog.i18n.NumberFormatSymbols_xog", "goog.i18n.NumberFormatSymbols_xog_UG", "goog.i18n.NumberFormatSymbols_yav", "goog.i18n.NumberFormatSymbols_yav_CM", 
"goog.i18n.NumberFormatSymbols_yi", "goog.i18n.NumberFormatSymbols_yi_001", "goog.i18n.NumberFormatSymbols_yo", "goog.i18n.NumberFormatSymbols_yo_BJ", "goog.i18n.NumberFormatSymbols_yo_NG", "goog.i18n.NumberFormatSymbols_zgh", "goog.i18n.NumberFormatSymbols_zgh_MA", "goog.i18n.NumberFormatSymbols_zh_Hans", "goog.i18n.NumberFormatSymbols_zh_Hans_HK", "goog.i18n.NumberFormatSymbols_zh_Hans_MO", "goog.i18n.NumberFormatSymbols_zh_Hans_SG", "goog.i18n.NumberFormatSymbols_zh_Hant", "goog.i18n.NumberFormatSymbols_zh_Hant_HK", 
"goog.i18n.NumberFormatSymbols_zh_Hant_MO", "goog.i18n.NumberFormatSymbols_zh_Hant_TW"], ["goog.i18n.NumberFormatSymbols"], false);
goog.addDependency("i18n/ordinalrules.js", ["goog.i18n.ordinalRules"], [], false);
goog.addDependency("i18n/pluralrules.js", ["goog.i18n.pluralRules"], [], false);
goog.addDependency("i18n/pluralrules_test.js", ["goog.i18n.pluralRulesTest"], ["goog.i18n.pluralRules", "goog.testing.jsunit"], false);
goog.addDependency("i18n/timezone.js", ["goog.i18n.TimeZone"], ["goog.array", "goog.date.DateLike", "goog.string"], false);
goog.addDependency("i18n/timezone_test.js", ["goog.i18n.TimeZoneTest"], ["goog.i18n.TimeZone", "goog.testing.jsunit"], false);
goog.addDependency("i18n/uchar.js", ["goog.i18n.uChar"], [], false);
goog.addDependency("i18n/uchar/localnamefetcher.js", ["goog.i18n.uChar.LocalNameFetcher"], ["goog.i18n.uChar", "goog.i18n.uChar.NameFetcher", "goog.log"], false);
goog.addDependency("i18n/uchar/localnamefetcher_test.js", ["goog.i18n.uChar.LocalNameFetcherTest"], ["goog.i18n.uChar.LocalNameFetcher", "goog.testing.jsunit", "goog.testing.recordFunction"], false);
goog.addDependency("i18n/uchar/namefetcher.js", ["goog.i18n.uChar.NameFetcher"], [], false);
goog.addDependency("i18n/uchar/remotenamefetcher.js", ["goog.i18n.uChar.RemoteNameFetcher"], ["goog.Disposable", "goog.Uri", "goog.i18n.uChar", "goog.i18n.uChar.NameFetcher", "goog.log", "goog.net.XhrIo", "goog.structs.Map"], false);
goog.addDependency("i18n/uchar/remotenamefetcher_test.js", ["goog.i18n.uChar.RemoteNameFetcherTest"], ["goog.i18n.uChar.RemoteNameFetcher", "goog.net.XhrIo", "goog.testing.jsunit", "goog.testing.net.XhrIo", "goog.testing.recordFunction"], false);
goog.addDependency("i18n/uchar_test.js", ["goog.i18n.uCharTest"], ["goog.i18n.uChar", "goog.testing.jsunit"], false);
goog.addDependency("iter/iter.js", ["goog.iter", "goog.iter.Iterable", "goog.iter.Iterator", "goog.iter.StopIteration"], ["goog.array", "goog.asserts", "goog.functions", "goog.math"], false);
goog.addDependency("iter/iter_test.js", ["goog.iterTest"], ["goog.iter", "goog.iter.Iterator", "goog.iter.StopIteration", "goog.testing.jsunit"], false);
goog.addDependency("json/evaljsonprocessor.js", ["goog.json.EvalJsonProcessor"], ["goog.json", "goog.json.Processor", "goog.json.Serializer"], false);
goog.addDependency("json/hybrid.js", ["goog.json.hybrid"], ["goog.asserts", "goog.json"], false);
goog.addDependency("json/hybrid_test.js", ["goog.json.hybridTest"], ["goog.json", "goog.json.hybrid", "goog.testing.PropertyReplacer", "goog.testing.jsunit", "goog.testing.recordFunction", "goog.userAgent"], false);
goog.addDependency("json/hybridjsonprocessor.js", ["goog.json.HybridJsonProcessor"], ["goog.json.Processor", "goog.json.hybrid"], false);
goog.addDependency("json/hybridjsonprocessor_test.js", ["goog.json.HybridJsonProcessorTest"], ["goog.json.HybridJsonProcessor", "goog.json.hybrid", "goog.testing.jsunit"], false);
goog.addDependency("json/json.js", ["goog.json", "goog.json.Replacer", "goog.json.Reviver", "goog.json.Serializer"], [], false);
goog.addDependency("json/json_perf.js", ["goog.jsonPerf"], ["goog.dom", "goog.json", "goog.math", "goog.string", "goog.testing.PerformanceTable", "goog.testing.PropertyReplacer", "goog.testing.jsunit"], false);
goog.addDependency("json/json_test.js", ["goog.jsonTest"], ["goog.functions", "goog.json", "goog.testing.jsunit", "goog.userAgent"], false);
goog.addDependency("json/nativejsonprocessor.js", ["goog.json.NativeJsonProcessor"], ["goog.asserts", "goog.json.Processor"], false);
goog.addDependency("json/processor.js", ["goog.json.Processor"], ["goog.string.Parser", "goog.string.Stringifier"], false);
goog.addDependency("json/processor_test.js", ["goog.json.processorTest"], ["goog.json.EvalJsonProcessor", "goog.json.NativeJsonProcessor", "goog.testing.jsunit", "goog.userAgent"], false);
goog.addDependency("labs/dom/pagevisibilitymonitor.js", ["goog.labs.dom.PageVisibilityEvent", "goog.labs.dom.PageVisibilityMonitor", "goog.labs.dom.PageVisibilityState"], ["goog.dom", "goog.dom.vendor", "goog.events", "goog.events.Event", "goog.events.EventTarget", "goog.events.EventType", "goog.memoize"], false);
goog.addDependency("labs/dom/pagevisibilitymonitor_test.js", ["goog.labs.dom.PageVisibilityMonitorTest"], ["goog.events", "goog.functions", "goog.labs.dom.PageVisibilityMonitor", "goog.testing.PropertyReplacer", "goog.testing.events", "goog.testing.events.Event", "goog.testing.jsunit", "goog.testing.recordFunction"], false);
goog.addDependency("labs/events/nondisposableeventtarget.js", ["goog.labs.events.NonDisposableEventTarget"], ["goog.array", "goog.asserts", "goog.events.Event", "goog.events.Listenable", "goog.events.ListenerMap", "goog.object"], false);
goog.addDependency("labs/events/nondisposableeventtarget_test.js", ["goog.labs.events.NonDisposableEventTargetTest"], ["goog.events.Listenable", "goog.events.eventTargetTester", "goog.events.eventTargetTester.KeyType", "goog.events.eventTargetTester.UnlistenReturnType", "goog.labs.events.NonDisposableEventTarget", "goog.testing.jsunit"], false);
goog.addDependency("labs/events/nondisposableeventtarget_via_googevents_test.js", ["goog.labs.events.NonDisposableEventTargetGoogEventsTest"], ["goog.events", "goog.events.eventTargetTester", "goog.events.eventTargetTester.KeyType", "goog.events.eventTargetTester.UnlistenReturnType", "goog.labs.events.NonDisposableEventTarget", "goog.testing", "goog.testing.jsunit"], false);
goog.addDependency("labs/events/touch.js", ["goog.labs.events.touch", "goog.labs.events.touch.TouchData"], ["goog.array", "goog.asserts", "goog.events.EventType", "goog.string"], false);
goog.addDependency("labs/events/touch_test.js", ["goog.labs.events.touchTest"], ["goog.labs.events.touch", "goog.testing.jsunit"], false);
goog.addDependency("labs/format/csv.js", ["goog.labs.format.csv", "goog.labs.format.csv.ParseError", "goog.labs.format.csv.Token"], ["goog.array", "goog.asserts", "goog.debug.Error", "goog.object", "goog.string", "goog.string.newlines"], false);
goog.addDependency("labs/format/csv_test.js", ["goog.labs.format.csvTest"], ["goog.labs.format.csv", "goog.labs.format.csv.ParseError", "goog.object", "goog.testing.asserts", "goog.testing.jsunit"], false);
goog.addDependency("labs/html/attribute_rewriter.js", ["goog.labs.html.AttributeRewriter", "goog.labs.html.AttributeValue", "goog.labs.html.attributeRewriterPresubmitWorkaround"], [], false);
goog.addDependency("labs/html/sanitizer.js", ["goog.labs.html.Sanitizer"], ["goog.asserts", "goog.html.SafeUrl", "goog.labs.html.attributeRewriterPresubmitWorkaround", "goog.labs.html.scrubber", "goog.object", "goog.string"], false);
goog.addDependency("labs/html/sanitizer_test.js", ["goog.labs.html.SanitizerTest"], ["goog.html.SafeUrl", "goog.labs.html.Sanitizer", "goog.string", "goog.string.Const", "goog.testing.jsunit"], false);
goog.addDependency("labs/html/scrubber.js", ["goog.labs.html.scrubber"], ["goog.array", "goog.dom.tags", "goog.labs.html.attributeRewriterPresubmitWorkaround", "goog.string"], false);
goog.addDependency("labs/html/scrubber_test.js", ["goog.html.ScrubberTest"], ["goog.labs.html.scrubber", "goog.object", "goog.string", "goog.testing.jsunit"], false);
goog.addDependency("labs/i18n/listformat.js", ["goog.labs.i18n.GenderInfo", "goog.labs.i18n.GenderInfo.Gender", "goog.labs.i18n.ListFormat"], ["goog.asserts", "goog.labs.i18n.ListFormatSymbols"], false);
goog.addDependency("labs/i18n/listformat_test.js", ["goog.labs.i18n.ListFormatTest"], ["goog.labs.i18n.GenderInfo", "goog.labs.i18n.ListFormat", "goog.labs.i18n.ListFormatSymbols", "goog.labs.i18n.ListFormatSymbols_el", "goog.labs.i18n.ListFormatSymbols_en", "goog.labs.i18n.ListFormatSymbols_fr", "goog.labs.i18n.ListFormatSymbols_ml", "goog.labs.i18n.ListFormatSymbols_zu", "goog.testing.jsunit"], false);
goog.addDependency("labs/i18n/listsymbols.js", ["goog.labs.i18n.ListFormatSymbols", "goog.labs.i18n.ListFormatSymbols_af", "goog.labs.i18n.ListFormatSymbols_am", "goog.labs.i18n.ListFormatSymbols_ar", "goog.labs.i18n.ListFormatSymbols_az", "goog.labs.i18n.ListFormatSymbols_bg", "goog.labs.i18n.ListFormatSymbols_bn", "goog.labs.i18n.ListFormatSymbols_br", "goog.labs.i18n.ListFormatSymbols_ca", "goog.labs.i18n.ListFormatSymbols_chr", "goog.labs.i18n.ListFormatSymbols_cs", "goog.labs.i18n.ListFormatSymbols_cy", 
"goog.labs.i18n.ListFormatSymbols_da", "goog.labs.i18n.ListFormatSymbols_de", "goog.labs.i18n.ListFormatSymbols_de_AT", "goog.labs.i18n.ListFormatSymbols_de_CH", "goog.labs.i18n.ListFormatSymbols_el", "goog.labs.i18n.ListFormatSymbols_en", "goog.labs.i18n.ListFormatSymbols_en_AU", "goog.labs.i18n.ListFormatSymbols_en_GB", "goog.labs.i18n.ListFormatSymbols_en_IE", "goog.labs.i18n.ListFormatSymbols_en_IN", "goog.labs.i18n.ListFormatSymbols_en_SG", "goog.labs.i18n.ListFormatSymbols_en_US", "goog.labs.i18n.ListFormatSymbols_en_ZA", 
"goog.labs.i18n.ListFormatSymbols_es", "goog.labs.i18n.ListFormatSymbols_es_419", "goog.labs.i18n.ListFormatSymbols_es_ES", "goog.labs.i18n.ListFormatSymbols_et", "goog.labs.i18n.ListFormatSymbols_eu", "goog.labs.i18n.ListFormatSymbols_fa", "goog.labs.i18n.ListFormatSymbols_fi", "goog.labs.i18n.ListFormatSymbols_fil", "goog.labs.i18n.ListFormatSymbols_fr", "goog.labs.i18n.ListFormatSymbols_fr_CA", "goog.labs.i18n.ListFormatSymbols_ga", "goog.labs.i18n.ListFormatSymbols_gl", "goog.labs.i18n.ListFormatSymbols_gsw", 
"goog.labs.i18n.ListFormatSymbols_gu", "goog.labs.i18n.ListFormatSymbols_haw", "goog.labs.i18n.ListFormatSymbols_he", "goog.labs.i18n.ListFormatSymbols_hi", "goog.labs.i18n.ListFormatSymbols_hr", "goog.labs.i18n.ListFormatSymbols_hu", "goog.labs.i18n.ListFormatSymbols_hy", "goog.labs.i18n.ListFormatSymbols_id", "goog.labs.i18n.ListFormatSymbols_in", "goog.labs.i18n.ListFormatSymbols_is", "goog.labs.i18n.ListFormatSymbols_it", "goog.labs.i18n.ListFormatSymbols_iw", "goog.labs.i18n.ListFormatSymbols_ja", 
"goog.labs.i18n.ListFormatSymbols_ka", "goog.labs.i18n.ListFormatSymbols_kk", "goog.labs.i18n.ListFormatSymbols_km", "goog.labs.i18n.ListFormatSymbols_kn", "goog.labs.i18n.ListFormatSymbols_ko", "goog.labs.i18n.ListFormatSymbols_ky", "goog.labs.i18n.ListFormatSymbols_ln", "goog.labs.i18n.ListFormatSymbols_lo", "goog.labs.i18n.ListFormatSymbols_lt", "goog.labs.i18n.ListFormatSymbols_lv", "goog.labs.i18n.ListFormatSymbols_mk", "goog.labs.i18n.ListFormatSymbols_ml", "goog.labs.i18n.ListFormatSymbols_mn", 
"goog.labs.i18n.ListFormatSymbols_mo", "goog.labs.i18n.ListFormatSymbols_mr", "goog.labs.i18n.ListFormatSymbols_ms", "goog.labs.i18n.ListFormatSymbols_mt", "goog.labs.i18n.ListFormatSymbols_my", "goog.labs.i18n.ListFormatSymbols_nb", "goog.labs.i18n.ListFormatSymbols_ne", "goog.labs.i18n.ListFormatSymbols_nl", "goog.labs.i18n.ListFormatSymbols_no", "goog.labs.i18n.ListFormatSymbols_no_NO", "goog.labs.i18n.ListFormatSymbols_or", "goog.labs.i18n.ListFormatSymbols_pa", "goog.labs.i18n.ListFormatSymbols_pl", 
"goog.labs.i18n.ListFormatSymbols_pt", "goog.labs.i18n.ListFormatSymbols_pt_BR", "goog.labs.i18n.ListFormatSymbols_pt_PT", "goog.labs.i18n.ListFormatSymbols_ro", "goog.labs.i18n.ListFormatSymbols_ru", "goog.labs.i18n.ListFormatSymbols_sh", "goog.labs.i18n.ListFormatSymbols_si", "goog.labs.i18n.ListFormatSymbols_sk", "goog.labs.i18n.ListFormatSymbols_sl", "goog.labs.i18n.ListFormatSymbols_sq", "goog.labs.i18n.ListFormatSymbols_sr", "goog.labs.i18n.ListFormatSymbols_sv", "goog.labs.i18n.ListFormatSymbols_sw", 
"goog.labs.i18n.ListFormatSymbols_ta", "goog.labs.i18n.ListFormatSymbols_te", "goog.labs.i18n.ListFormatSymbols_th", "goog.labs.i18n.ListFormatSymbols_tl", "goog.labs.i18n.ListFormatSymbols_tr", "goog.labs.i18n.ListFormatSymbols_uk", "goog.labs.i18n.ListFormatSymbols_ur", "goog.labs.i18n.ListFormatSymbols_uz", "goog.labs.i18n.ListFormatSymbols_vi", "goog.labs.i18n.ListFormatSymbols_zh", "goog.labs.i18n.ListFormatSymbols_zh_CN", "goog.labs.i18n.ListFormatSymbols_zh_HK", "goog.labs.i18n.ListFormatSymbols_zh_TW", 
"goog.labs.i18n.ListFormatSymbols_zu"], [], false);
goog.addDependency("labs/i18n/listsymbolsext.js", ["goog.labs.i18n.ListFormatSymbolsExt", "goog.labs.i18n.ListFormatSymbols_af_NA", "goog.labs.i18n.ListFormatSymbols_af_ZA", "goog.labs.i18n.ListFormatSymbols_agq", "goog.labs.i18n.ListFormatSymbols_agq_CM", "goog.labs.i18n.ListFormatSymbols_ak", "goog.labs.i18n.ListFormatSymbols_ak_GH", "goog.labs.i18n.ListFormatSymbols_am_ET", "goog.labs.i18n.ListFormatSymbols_ar_001", "goog.labs.i18n.ListFormatSymbols_ar_AE", "goog.labs.i18n.ListFormatSymbols_ar_BH", 
"goog.labs.i18n.ListFormatSymbols_ar_DJ", "goog.labs.i18n.ListFormatSymbols_ar_DZ", "goog.labs.i18n.ListFormatSymbols_ar_EG", "goog.labs.i18n.ListFormatSymbols_ar_EH", "goog.labs.i18n.ListFormatSymbols_ar_ER", "goog.labs.i18n.ListFormatSymbols_ar_IL", "goog.labs.i18n.ListFormatSymbols_ar_IQ", "goog.labs.i18n.ListFormatSymbols_ar_JO", "goog.labs.i18n.ListFormatSymbols_ar_KM", "goog.labs.i18n.ListFormatSymbols_ar_KW", "goog.labs.i18n.ListFormatSymbols_ar_LB", "goog.labs.i18n.ListFormatSymbols_ar_LY", 
"goog.labs.i18n.ListFormatSymbols_ar_MA", "goog.labs.i18n.ListFormatSymbols_ar_MR", "goog.labs.i18n.ListFormatSymbols_ar_OM", "goog.labs.i18n.ListFormatSymbols_ar_PS", "goog.labs.i18n.ListFormatSymbols_ar_QA", "goog.labs.i18n.ListFormatSymbols_ar_SA", "goog.labs.i18n.ListFormatSymbols_ar_SD", "goog.labs.i18n.ListFormatSymbols_ar_SO", "goog.labs.i18n.ListFormatSymbols_ar_SS", "goog.labs.i18n.ListFormatSymbols_ar_SY", "goog.labs.i18n.ListFormatSymbols_ar_TD", "goog.labs.i18n.ListFormatSymbols_ar_TN", 
"goog.labs.i18n.ListFormatSymbols_ar_YE", "goog.labs.i18n.ListFormatSymbols_as", "goog.labs.i18n.ListFormatSymbols_as_IN", "goog.labs.i18n.ListFormatSymbols_asa", "goog.labs.i18n.ListFormatSymbols_asa_TZ", "goog.labs.i18n.ListFormatSymbols_az_Cyrl", "goog.labs.i18n.ListFormatSymbols_az_Cyrl_AZ", "goog.labs.i18n.ListFormatSymbols_az_Latn", "goog.labs.i18n.ListFormatSymbols_az_Latn_AZ", "goog.labs.i18n.ListFormatSymbols_bas", "goog.labs.i18n.ListFormatSymbols_bas_CM", "goog.labs.i18n.ListFormatSymbols_be", 
"goog.labs.i18n.ListFormatSymbols_be_BY", "goog.labs.i18n.ListFormatSymbols_bem", "goog.labs.i18n.ListFormatSymbols_bem_ZM", "goog.labs.i18n.ListFormatSymbols_bez", "goog.labs.i18n.ListFormatSymbols_bez_TZ", "goog.labs.i18n.ListFormatSymbols_bg_BG", "goog.labs.i18n.ListFormatSymbols_bm", "goog.labs.i18n.ListFormatSymbols_bm_Latn", "goog.labs.i18n.ListFormatSymbols_bm_Latn_ML", "goog.labs.i18n.ListFormatSymbols_bn_BD", "goog.labs.i18n.ListFormatSymbols_bn_IN", "goog.labs.i18n.ListFormatSymbols_bo", 
"goog.labs.i18n.ListFormatSymbols_bo_CN", "goog.labs.i18n.ListFormatSymbols_bo_IN", "goog.labs.i18n.ListFormatSymbols_br_FR", "goog.labs.i18n.ListFormatSymbols_brx", "goog.labs.i18n.ListFormatSymbols_brx_IN", "goog.labs.i18n.ListFormatSymbols_bs", "goog.labs.i18n.ListFormatSymbols_bs_Cyrl", "goog.labs.i18n.ListFormatSymbols_bs_Cyrl_BA", "goog.labs.i18n.ListFormatSymbols_bs_Latn", "goog.labs.i18n.ListFormatSymbols_bs_Latn_BA", "goog.labs.i18n.ListFormatSymbols_ca_AD", "goog.labs.i18n.ListFormatSymbols_ca_ES", 
"goog.labs.i18n.ListFormatSymbols_ca_FR", "goog.labs.i18n.ListFormatSymbols_ca_IT", "goog.labs.i18n.ListFormatSymbols_cgg", "goog.labs.i18n.ListFormatSymbols_cgg_UG", "goog.labs.i18n.ListFormatSymbols_chr_US", "goog.labs.i18n.ListFormatSymbols_cs_CZ", "goog.labs.i18n.ListFormatSymbols_cy_GB", "goog.labs.i18n.ListFormatSymbols_da_DK", "goog.labs.i18n.ListFormatSymbols_da_GL", "goog.labs.i18n.ListFormatSymbols_dav", "goog.labs.i18n.ListFormatSymbols_dav_KE", "goog.labs.i18n.ListFormatSymbols_de_BE", 
"goog.labs.i18n.ListFormatSymbols_de_DE", "goog.labs.i18n.ListFormatSymbols_de_LI", "goog.labs.i18n.ListFormatSymbols_de_LU", "goog.labs.i18n.ListFormatSymbols_dje", "goog.labs.i18n.ListFormatSymbols_dje_NE", "goog.labs.i18n.ListFormatSymbols_dsb", "goog.labs.i18n.ListFormatSymbols_dsb_DE", "goog.labs.i18n.ListFormatSymbols_dua", "goog.labs.i18n.ListFormatSymbols_dua_CM", "goog.labs.i18n.ListFormatSymbols_dyo", "goog.labs.i18n.ListFormatSymbols_dyo_SN", "goog.labs.i18n.ListFormatSymbols_dz", "goog.labs.i18n.ListFormatSymbols_dz_BT", 
"goog.labs.i18n.ListFormatSymbols_ebu", "goog.labs.i18n.ListFormatSymbols_ebu_KE", "goog.labs.i18n.ListFormatSymbols_ee", "goog.labs.i18n.ListFormatSymbols_ee_GH", "goog.labs.i18n.ListFormatSymbols_ee_TG", "goog.labs.i18n.ListFormatSymbols_el_CY", "goog.labs.i18n.ListFormatSymbols_el_GR", "goog.labs.i18n.ListFormatSymbols_en_001", "goog.labs.i18n.ListFormatSymbols_en_150", "goog.labs.i18n.ListFormatSymbols_en_AG", "goog.labs.i18n.ListFormatSymbols_en_AI", "goog.labs.i18n.ListFormatSymbols_en_AS", 
"goog.labs.i18n.ListFormatSymbols_en_BB", "goog.labs.i18n.ListFormatSymbols_en_BE", "goog.labs.i18n.ListFormatSymbols_en_BM", "goog.labs.i18n.ListFormatSymbols_en_BS", "goog.labs.i18n.ListFormatSymbols_en_BW", "goog.labs.i18n.ListFormatSymbols_en_BZ", "goog.labs.i18n.ListFormatSymbols_en_CA", "goog.labs.i18n.ListFormatSymbols_en_CC", "goog.labs.i18n.ListFormatSymbols_en_CK", "goog.labs.i18n.ListFormatSymbols_en_CM", "goog.labs.i18n.ListFormatSymbols_en_CX", "goog.labs.i18n.ListFormatSymbols_en_DG", 
"goog.labs.i18n.ListFormatSymbols_en_DM", "goog.labs.i18n.ListFormatSymbols_en_ER", "goog.labs.i18n.ListFormatSymbols_en_FJ", "goog.labs.i18n.ListFormatSymbols_en_FK", "goog.labs.i18n.ListFormatSymbols_en_FM", "goog.labs.i18n.ListFormatSymbols_en_GD", "goog.labs.i18n.ListFormatSymbols_en_GG", "goog.labs.i18n.ListFormatSymbols_en_GH", "goog.labs.i18n.ListFormatSymbols_en_GI", "goog.labs.i18n.ListFormatSymbols_en_GM", "goog.labs.i18n.ListFormatSymbols_en_GU", "goog.labs.i18n.ListFormatSymbols_en_GY", 
"goog.labs.i18n.ListFormatSymbols_en_HK", "goog.labs.i18n.ListFormatSymbols_en_IM", "goog.labs.i18n.ListFormatSymbols_en_IO", "goog.labs.i18n.ListFormatSymbols_en_JE", "goog.labs.i18n.ListFormatSymbols_en_JM", "goog.labs.i18n.ListFormatSymbols_en_KE", "goog.labs.i18n.ListFormatSymbols_en_KI", "goog.labs.i18n.ListFormatSymbols_en_KN", "goog.labs.i18n.ListFormatSymbols_en_KY", "goog.labs.i18n.ListFormatSymbols_en_LC", "goog.labs.i18n.ListFormatSymbols_en_LR", "goog.labs.i18n.ListFormatSymbols_en_LS", 
"goog.labs.i18n.ListFormatSymbols_en_MG", "goog.labs.i18n.ListFormatSymbols_en_MH", "goog.labs.i18n.ListFormatSymbols_en_MO", "goog.labs.i18n.ListFormatSymbols_en_MP", "goog.labs.i18n.ListFormatSymbols_en_MS", "goog.labs.i18n.ListFormatSymbols_en_MT", "goog.labs.i18n.ListFormatSymbols_en_MU", "goog.labs.i18n.ListFormatSymbols_en_MW", "goog.labs.i18n.ListFormatSymbols_en_MY", "goog.labs.i18n.ListFormatSymbols_en_NA", "goog.labs.i18n.ListFormatSymbols_en_NF", "goog.labs.i18n.ListFormatSymbols_en_NG", 
"goog.labs.i18n.ListFormatSymbols_en_NR", "goog.labs.i18n.ListFormatSymbols_en_NU", "goog.labs.i18n.ListFormatSymbols_en_NZ", "goog.labs.i18n.ListFormatSymbols_en_PG", "goog.labs.i18n.ListFormatSymbols_en_PH", "goog.labs.i18n.ListFormatSymbols_en_PK", "goog.labs.i18n.ListFormatSymbols_en_PN", "goog.labs.i18n.ListFormatSymbols_en_PR", "goog.labs.i18n.ListFormatSymbols_en_PW", "goog.labs.i18n.ListFormatSymbols_en_RW", "goog.labs.i18n.ListFormatSymbols_en_SB", "goog.labs.i18n.ListFormatSymbols_en_SC", 
"goog.labs.i18n.ListFormatSymbols_en_SD", "goog.labs.i18n.ListFormatSymbols_en_SH", "goog.labs.i18n.ListFormatSymbols_en_SL", "goog.labs.i18n.ListFormatSymbols_en_SS", "goog.labs.i18n.ListFormatSymbols_en_SX", "goog.labs.i18n.ListFormatSymbols_en_SZ", "goog.labs.i18n.ListFormatSymbols_en_TC", "goog.labs.i18n.ListFormatSymbols_en_TK", "goog.labs.i18n.ListFormatSymbols_en_TO", "goog.labs.i18n.ListFormatSymbols_en_TT", "goog.labs.i18n.ListFormatSymbols_en_TV", "goog.labs.i18n.ListFormatSymbols_en_TZ", 
"goog.labs.i18n.ListFormatSymbols_en_UG", "goog.labs.i18n.ListFormatSymbols_en_UM", "goog.labs.i18n.ListFormatSymbols_en_US_POSIX", "goog.labs.i18n.ListFormatSymbols_en_VC", "goog.labs.i18n.ListFormatSymbols_en_VG", "goog.labs.i18n.ListFormatSymbols_en_VI", "goog.labs.i18n.ListFormatSymbols_en_VU", "goog.labs.i18n.ListFormatSymbols_en_WS", "goog.labs.i18n.ListFormatSymbols_en_ZM", "goog.labs.i18n.ListFormatSymbols_en_ZW", "goog.labs.i18n.ListFormatSymbols_eo", "goog.labs.i18n.ListFormatSymbols_es_AR", 
"goog.labs.i18n.ListFormatSymbols_es_BO", "goog.labs.i18n.ListFormatSymbols_es_CL", "goog.labs.i18n.ListFormatSymbols_es_CO", "goog.labs.i18n.ListFormatSymbols_es_CR", "goog.labs.i18n.ListFormatSymbols_es_CU", "goog.labs.i18n.ListFormatSymbols_es_DO", "goog.labs.i18n.ListFormatSymbols_es_EA", "goog.labs.i18n.ListFormatSymbols_es_EC", "goog.labs.i18n.ListFormatSymbols_es_GQ", "goog.labs.i18n.ListFormatSymbols_es_GT", "goog.labs.i18n.ListFormatSymbols_es_HN", "goog.labs.i18n.ListFormatSymbols_es_IC", 
"goog.labs.i18n.ListFormatSymbols_es_MX", "goog.labs.i18n.ListFormatSymbols_es_NI", "goog.labs.i18n.ListFormatSymbols_es_PA", "goog.labs.i18n.ListFormatSymbols_es_PE", "goog.labs.i18n.ListFormatSymbols_es_PH", "goog.labs.i18n.ListFormatSymbols_es_PR", "goog.labs.i18n.ListFormatSymbols_es_PY", "goog.labs.i18n.ListFormatSymbols_es_SV", "goog.labs.i18n.ListFormatSymbols_es_US", "goog.labs.i18n.ListFormatSymbols_es_UY", "goog.labs.i18n.ListFormatSymbols_es_VE", "goog.labs.i18n.ListFormatSymbols_et_EE", 
"goog.labs.i18n.ListFormatSymbols_eu_ES", "goog.labs.i18n.ListFormatSymbols_ewo", "goog.labs.i18n.ListFormatSymbols_ewo_CM", "goog.labs.i18n.ListFormatSymbols_fa_AF", "goog.labs.i18n.ListFormatSymbols_fa_IR", "goog.labs.i18n.ListFormatSymbols_ff", "goog.labs.i18n.ListFormatSymbols_ff_CM", "goog.labs.i18n.ListFormatSymbols_ff_GN", "goog.labs.i18n.ListFormatSymbols_ff_MR", "goog.labs.i18n.ListFormatSymbols_ff_SN", "goog.labs.i18n.ListFormatSymbols_fi_FI", "goog.labs.i18n.ListFormatSymbols_fil_PH", 
"goog.labs.i18n.ListFormatSymbols_fo", "goog.labs.i18n.ListFormatSymbols_fo_FO", "goog.labs.i18n.ListFormatSymbols_fr_BE", "goog.labs.i18n.ListFormatSymbols_fr_BF", "goog.labs.i18n.ListFormatSymbols_fr_BI", "goog.labs.i18n.ListFormatSymbols_fr_BJ", "goog.labs.i18n.ListFormatSymbols_fr_BL", "goog.labs.i18n.ListFormatSymbols_fr_CD", "goog.labs.i18n.ListFormatSymbols_fr_CF", "goog.labs.i18n.ListFormatSymbols_fr_CG", "goog.labs.i18n.ListFormatSymbols_fr_CH", "goog.labs.i18n.ListFormatSymbols_fr_CI", 
"goog.labs.i18n.ListFormatSymbols_fr_CM", "goog.labs.i18n.ListFormatSymbols_fr_DJ", "goog.labs.i18n.ListFormatSymbols_fr_DZ", "goog.labs.i18n.ListFormatSymbols_fr_FR", "goog.labs.i18n.ListFormatSymbols_fr_GA", "goog.labs.i18n.ListFormatSymbols_fr_GF", "goog.labs.i18n.ListFormatSymbols_fr_GN", "goog.labs.i18n.ListFormatSymbols_fr_GP", "goog.labs.i18n.ListFormatSymbols_fr_GQ", "goog.labs.i18n.ListFormatSymbols_fr_HT", "goog.labs.i18n.ListFormatSymbols_fr_KM", "goog.labs.i18n.ListFormatSymbols_fr_LU", 
"goog.labs.i18n.ListFormatSymbols_fr_MA", "goog.labs.i18n.ListFormatSymbols_fr_MC", "goog.labs.i18n.ListFormatSymbols_fr_MF", "goog.labs.i18n.ListFormatSymbols_fr_MG", "goog.labs.i18n.ListFormatSymbols_fr_ML", "goog.labs.i18n.ListFormatSymbols_fr_MQ", "goog.labs.i18n.ListFormatSymbols_fr_MR", "goog.labs.i18n.ListFormatSymbols_fr_MU", "goog.labs.i18n.ListFormatSymbols_fr_NC", "goog.labs.i18n.ListFormatSymbols_fr_NE", "goog.labs.i18n.ListFormatSymbols_fr_PF", "goog.labs.i18n.ListFormatSymbols_fr_PM", 
"goog.labs.i18n.ListFormatSymbols_fr_RE", "goog.labs.i18n.ListFormatSymbols_fr_RW", "goog.labs.i18n.ListFormatSymbols_fr_SC", "goog.labs.i18n.ListFormatSymbols_fr_SN", "goog.labs.i18n.ListFormatSymbols_fr_SY", "goog.labs.i18n.ListFormatSymbols_fr_TD", "goog.labs.i18n.ListFormatSymbols_fr_TG", "goog.labs.i18n.ListFormatSymbols_fr_TN", "goog.labs.i18n.ListFormatSymbols_fr_VU", "goog.labs.i18n.ListFormatSymbols_fr_WF", "goog.labs.i18n.ListFormatSymbols_fr_YT", "goog.labs.i18n.ListFormatSymbols_fur", 
"goog.labs.i18n.ListFormatSymbols_fur_IT", "goog.labs.i18n.ListFormatSymbols_fy", "goog.labs.i18n.ListFormatSymbols_fy_NL", "goog.labs.i18n.ListFormatSymbols_ga_IE", "goog.labs.i18n.ListFormatSymbols_gd", "goog.labs.i18n.ListFormatSymbols_gd_GB", "goog.labs.i18n.ListFormatSymbols_gl_ES", "goog.labs.i18n.ListFormatSymbols_gsw_CH", "goog.labs.i18n.ListFormatSymbols_gsw_FR", "goog.labs.i18n.ListFormatSymbols_gsw_LI", "goog.labs.i18n.ListFormatSymbols_gu_IN", "goog.labs.i18n.ListFormatSymbols_guz", "goog.labs.i18n.ListFormatSymbols_guz_KE", 
"goog.labs.i18n.ListFormatSymbols_gv", "goog.labs.i18n.ListFormatSymbols_gv_IM", "goog.labs.i18n.ListFormatSymbols_ha", "goog.labs.i18n.ListFormatSymbols_ha_Latn", "goog.labs.i18n.ListFormatSymbols_ha_Latn_GH", "goog.labs.i18n.ListFormatSymbols_ha_Latn_NE", "goog.labs.i18n.ListFormatSymbols_ha_Latn_NG", "goog.labs.i18n.ListFormatSymbols_haw_US", "goog.labs.i18n.ListFormatSymbols_he_IL", "goog.labs.i18n.ListFormatSymbols_hi_IN", "goog.labs.i18n.ListFormatSymbols_hr_BA", "goog.labs.i18n.ListFormatSymbols_hr_HR", 
"goog.labs.i18n.ListFormatSymbols_hsb", "goog.labs.i18n.ListFormatSymbols_hsb_DE", "goog.labs.i18n.ListFormatSymbols_hu_HU", "goog.labs.i18n.ListFormatSymbols_hy_AM", "goog.labs.i18n.ListFormatSymbols_id_ID", "goog.labs.i18n.ListFormatSymbols_ig", "goog.labs.i18n.ListFormatSymbols_ig_NG", "goog.labs.i18n.ListFormatSymbols_ii", "goog.labs.i18n.ListFormatSymbols_ii_CN", "goog.labs.i18n.ListFormatSymbols_is_IS", "goog.labs.i18n.ListFormatSymbols_it_CH", "goog.labs.i18n.ListFormatSymbols_it_IT", "goog.labs.i18n.ListFormatSymbols_it_SM", 
"goog.labs.i18n.ListFormatSymbols_ja_JP", "goog.labs.i18n.ListFormatSymbols_jgo", "goog.labs.i18n.ListFormatSymbols_jgo_CM", "goog.labs.i18n.ListFormatSymbols_jmc", "goog.labs.i18n.ListFormatSymbols_jmc_TZ", "goog.labs.i18n.ListFormatSymbols_ka_GE", "goog.labs.i18n.ListFormatSymbols_kab", "goog.labs.i18n.ListFormatSymbols_kab_DZ", "goog.labs.i18n.ListFormatSymbols_kam", "goog.labs.i18n.ListFormatSymbols_kam_KE", "goog.labs.i18n.ListFormatSymbols_kde", "goog.labs.i18n.ListFormatSymbols_kde_TZ", "goog.labs.i18n.ListFormatSymbols_kea", 
"goog.labs.i18n.ListFormatSymbols_kea_CV", "goog.labs.i18n.ListFormatSymbols_khq", "goog.labs.i18n.ListFormatSymbols_khq_ML", "goog.labs.i18n.ListFormatSymbols_ki", "goog.labs.i18n.ListFormatSymbols_ki_KE", "goog.labs.i18n.ListFormatSymbols_kk_Cyrl", "goog.labs.i18n.ListFormatSymbols_kk_Cyrl_KZ", "goog.labs.i18n.ListFormatSymbols_kkj", "goog.labs.i18n.ListFormatSymbols_kkj_CM", "goog.labs.i18n.ListFormatSymbols_kl", "goog.labs.i18n.ListFormatSymbols_kl_GL", "goog.labs.i18n.ListFormatSymbols_kln", 
"goog.labs.i18n.ListFormatSymbols_kln_KE", "goog.labs.i18n.ListFormatSymbols_km_KH", "goog.labs.i18n.ListFormatSymbols_kn_IN", "goog.labs.i18n.ListFormatSymbols_ko_KP", "goog.labs.i18n.ListFormatSymbols_ko_KR", "goog.labs.i18n.ListFormatSymbols_kok", "goog.labs.i18n.ListFormatSymbols_kok_IN", "goog.labs.i18n.ListFormatSymbols_ks", "goog.labs.i18n.ListFormatSymbols_ks_Arab", "goog.labs.i18n.ListFormatSymbols_ks_Arab_IN", "goog.labs.i18n.ListFormatSymbols_ksb", "goog.labs.i18n.ListFormatSymbols_ksb_TZ", 
"goog.labs.i18n.ListFormatSymbols_ksf", "goog.labs.i18n.ListFormatSymbols_ksf_CM", "goog.labs.i18n.ListFormatSymbols_ksh", "goog.labs.i18n.ListFormatSymbols_ksh_DE", "goog.labs.i18n.ListFormatSymbols_kw", "goog.labs.i18n.ListFormatSymbols_kw_GB", "goog.labs.i18n.ListFormatSymbols_ky_Cyrl", "goog.labs.i18n.ListFormatSymbols_ky_Cyrl_KG", "goog.labs.i18n.ListFormatSymbols_lag", "goog.labs.i18n.ListFormatSymbols_lag_TZ", "goog.labs.i18n.ListFormatSymbols_lb", "goog.labs.i18n.ListFormatSymbols_lb_LU", 
"goog.labs.i18n.ListFormatSymbols_lg", "goog.labs.i18n.ListFormatSymbols_lg_UG", "goog.labs.i18n.ListFormatSymbols_lkt", "goog.labs.i18n.ListFormatSymbols_lkt_US", "goog.labs.i18n.ListFormatSymbols_ln_AO", "goog.labs.i18n.ListFormatSymbols_ln_CD", "goog.labs.i18n.ListFormatSymbols_ln_CF", "goog.labs.i18n.ListFormatSymbols_ln_CG", "goog.labs.i18n.ListFormatSymbols_lo_LA", "goog.labs.i18n.ListFormatSymbols_lt_LT", "goog.labs.i18n.ListFormatSymbols_lu", "goog.labs.i18n.ListFormatSymbols_lu_CD", "goog.labs.i18n.ListFormatSymbols_luo", 
"goog.labs.i18n.ListFormatSymbols_luo_KE", "goog.labs.i18n.ListFormatSymbols_luy", "goog.labs.i18n.ListFormatSymbols_luy_KE", "goog.labs.i18n.ListFormatSymbols_lv_LV", "goog.labs.i18n.ListFormatSymbols_mas", "goog.labs.i18n.ListFormatSymbols_mas_KE", "goog.labs.i18n.ListFormatSymbols_mas_TZ", "goog.labs.i18n.ListFormatSymbols_mer", "goog.labs.i18n.ListFormatSymbols_mer_KE", "goog.labs.i18n.ListFormatSymbols_mfe", "goog.labs.i18n.ListFormatSymbols_mfe_MU", "goog.labs.i18n.ListFormatSymbols_mg", "goog.labs.i18n.ListFormatSymbols_mg_MG", 
"goog.labs.i18n.ListFormatSymbols_mgh", "goog.labs.i18n.ListFormatSymbols_mgh_MZ", "goog.labs.i18n.ListFormatSymbols_mgo", "goog.labs.i18n.ListFormatSymbols_mgo_CM", "goog.labs.i18n.ListFormatSymbols_mk_MK", "goog.labs.i18n.ListFormatSymbols_ml_IN", "goog.labs.i18n.ListFormatSymbols_mn_Cyrl", "goog.labs.i18n.ListFormatSymbols_mn_Cyrl_MN", "goog.labs.i18n.ListFormatSymbols_mr_IN", "goog.labs.i18n.ListFormatSymbols_ms_Latn", "goog.labs.i18n.ListFormatSymbols_ms_Latn_BN", "goog.labs.i18n.ListFormatSymbols_ms_Latn_MY", 
"goog.labs.i18n.ListFormatSymbols_ms_Latn_SG", "goog.labs.i18n.ListFormatSymbols_mt_MT", "goog.labs.i18n.ListFormatSymbols_mua", "goog.labs.i18n.ListFormatSymbols_mua_CM", "goog.labs.i18n.ListFormatSymbols_my_MM", "goog.labs.i18n.ListFormatSymbols_naq", "goog.labs.i18n.ListFormatSymbols_naq_NA", "goog.labs.i18n.ListFormatSymbols_nb_NO", "goog.labs.i18n.ListFormatSymbols_nb_SJ", "goog.labs.i18n.ListFormatSymbols_nd", "goog.labs.i18n.ListFormatSymbols_nd_ZW", "goog.labs.i18n.ListFormatSymbols_ne_IN", 
"goog.labs.i18n.ListFormatSymbols_ne_NP", "goog.labs.i18n.ListFormatSymbols_nl_AW", "goog.labs.i18n.ListFormatSymbols_nl_BE", "goog.labs.i18n.ListFormatSymbols_nl_BQ", "goog.labs.i18n.ListFormatSymbols_nl_CW", "goog.labs.i18n.ListFormatSymbols_nl_NL", "goog.labs.i18n.ListFormatSymbols_nl_SR", "goog.labs.i18n.ListFormatSymbols_nl_SX", "goog.labs.i18n.ListFormatSymbols_nmg", "goog.labs.i18n.ListFormatSymbols_nmg_CM", "goog.labs.i18n.ListFormatSymbols_nn", "goog.labs.i18n.ListFormatSymbols_nn_NO", "goog.labs.i18n.ListFormatSymbols_nnh", 
"goog.labs.i18n.ListFormatSymbols_nnh_CM", "goog.labs.i18n.ListFormatSymbols_nus", "goog.labs.i18n.ListFormatSymbols_nus_SD", "goog.labs.i18n.ListFormatSymbols_nyn", "goog.labs.i18n.ListFormatSymbols_nyn_UG", "goog.labs.i18n.ListFormatSymbols_om", "goog.labs.i18n.ListFormatSymbols_om_ET", "goog.labs.i18n.ListFormatSymbols_om_KE", "goog.labs.i18n.ListFormatSymbols_or_IN", "goog.labs.i18n.ListFormatSymbols_os", "goog.labs.i18n.ListFormatSymbols_os_GE", "goog.labs.i18n.ListFormatSymbols_os_RU", "goog.labs.i18n.ListFormatSymbols_pa_Arab", 
"goog.labs.i18n.ListFormatSymbols_pa_Arab_PK", "goog.labs.i18n.ListFormatSymbols_pa_Guru", "goog.labs.i18n.ListFormatSymbols_pa_Guru_IN", "goog.labs.i18n.ListFormatSymbols_pl_PL", "goog.labs.i18n.ListFormatSymbols_ps", "goog.labs.i18n.ListFormatSymbols_ps_AF", "goog.labs.i18n.ListFormatSymbols_pt_AO", "goog.labs.i18n.ListFormatSymbols_pt_CV", "goog.labs.i18n.ListFormatSymbols_pt_GW", "goog.labs.i18n.ListFormatSymbols_pt_MO", "goog.labs.i18n.ListFormatSymbols_pt_MZ", "goog.labs.i18n.ListFormatSymbols_pt_ST", 
"goog.labs.i18n.ListFormatSymbols_pt_TL", "goog.labs.i18n.ListFormatSymbols_qu", "goog.labs.i18n.ListFormatSymbols_qu_BO", "goog.labs.i18n.ListFormatSymbols_qu_EC", "goog.labs.i18n.ListFormatSymbols_qu_PE", "goog.labs.i18n.ListFormatSymbols_rm", "goog.labs.i18n.ListFormatSymbols_rm_CH", "goog.labs.i18n.ListFormatSymbols_rn", "goog.labs.i18n.ListFormatSymbols_rn_BI", "goog.labs.i18n.ListFormatSymbols_ro_MD", "goog.labs.i18n.ListFormatSymbols_ro_RO", "goog.labs.i18n.ListFormatSymbols_rof", "goog.labs.i18n.ListFormatSymbols_rof_TZ", 
"goog.labs.i18n.ListFormatSymbols_ru_BY", "goog.labs.i18n.ListFormatSymbols_ru_KG", "goog.labs.i18n.ListFormatSymbols_ru_KZ", "goog.labs.i18n.ListFormatSymbols_ru_MD", "goog.labs.i18n.ListFormatSymbols_ru_RU", "goog.labs.i18n.ListFormatSymbols_ru_UA", "goog.labs.i18n.ListFormatSymbols_rw", "goog.labs.i18n.ListFormatSymbols_rw_RW", "goog.labs.i18n.ListFormatSymbols_rwk", "goog.labs.i18n.ListFormatSymbols_rwk_TZ", "goog.labs.i18n.ListFormatSymbols_sah", "goog.labs.i18n.ListFormatSymbols_sah_RU", "goog.labs.i18n.ListFormatSymbols_saq", 
"goog.labs.i18n.ListFormatSymbols_saq_KE", "goog.labs.i18n.ListFormatSymbols_sbp", "goog.labs.i18n.ListFormatSymbols_sbp_TZ", "goog.labs.i18n.ListFormatSymbols_se", "goog.labs.i18n.ListFormatSymbols_se_FI", "goog.labs.i18n.ListFormatSymbols_se_NO", "goog.labs.i18n.ListFormatSymbols_se_SE", "goog.labs.i18n.ListFormatSymbols_seh", "goog.labs.i18n.ListFormatSymbols_seh_MZ", "goog.labs.i18n.ListFormatSymbols_ses", "goog.labs.i18n.ListFormatSymbols_ses_ML", "goog.labs.i18n.ListFormatSymbols_sg", "goog.labs.i18n.ListFormatSymbols_sg_CF", 
"goog.labs.i18n.ListFormatSymbols_shi", "goog.labs.i18n.ListFormatSymbols_shi_Latn", "goog.labs.i18n.ListFormatSymbols_shi_Latn_MA", "goog.labs.i18n.ListFormatSymbols_shi_Tfng", "goog.labs.i18n.ListFormatSymbols_shi_Tfng_MA", "goog.labs.i18n.ListFormatSymbols_si_LK", "goog.labs.i18n.ListFormatSymbols_sk_SK", "goog.labs.i18n.ListFormatSymbols_sl_SI", "goog.labs.i18n.ListFormatSymbols_smn", "goog.labs.i18n.ListFormatSymbols_smn_FI", "goog.labs.i18n.ListFormatSymbols_sn", "goog.labs.i18n.ListFormatSymbols_sn_ZW", 
"goog.labs.i18n.ListFormatSymbols_so", "goog.labs.i18n.ListFormatSymbols_so_DJ", "goog.labs.i18n.ListFormatSymbols_so_ET", "goog.labs.i18n.ListFormatSymbols_so_KE", "goog.labs.i18n.ListFormatSymbols_so_SO", "goog.labs.i18n.ListFormatSymbols_sq_AL", "goog.labs.i18n.ListFormatSymbols_sq_MK", "goog.labs.i18n.ListFormatSymbols_sq_XK", "goog.labs.i18n.ListFormatSymbols_sr_Cyrl", "goog.labs.i18n.ListFormatSymbols_sr_Cyrl_BA", "goog.labs.i18n.ListFormatSymbols_sr_Cyrl_ME", "goog.labs.i18n.ListFormatSymbols_sr_Cyrl_RS", 
"goog.labs.i18n.ListFormatSymbols_sr_Cyrl_XK", "goog.labs.i18n.ListFormatSymbols_sr_Latn", "goog.labs.i18n.ListFormatSymbols_sr_Latn_BA", "goog.labs.i18n.ListFormatSymbols_sr_Latn_ME", "goog.labs.i18n.ListFormatSymbols_sr_Latn_RS", "goog.labs.i18n.ListFormatSymbols_sr_Latn_XK", "goog.labs.i18n.ListFormatSymbols_sv_AX", "goog.labs.i18n.ListFormatSymbols_sv_FI", "goog.labs.i18n.ListFormatSymbols_sv_SE", "goog.labs.i18n.ListFormatSymbols_sw_KE", "goog.labs.i18n.ListFormatSymbols_sw_TZ", "goog.labs.i18n.ListFormatSymbols_sw_UG", 
"goog.labs.i18n.ListFormatSymbols_swc", "goog.labs.i18n.ListFormatSymbols_swc_CD", "goog.labs.i18n.ListFormatSymbols_ta_IN", "goog.labs.i18n.ListFormatSymbols_ta_LK", "goog.labs.i18n.ListFormatSymbols_ta_MY", "goog.labs.i18n.ListFormatSymbols_ta_SG", "goog.labs.i18n.ListFormatSymbols_te_IN", "goog.labs.i18n.ListFormatSymbols_teo", "goog.labs.i18n.ListFormatSymbols_teo_KE", "goog.labs.i18n.ListFormatSymbols_teo_UG", "goog.labs.i18n.ListFormatSymbols_th_TH", "goog.labs.i18n.ListFormatSymbols_ti", "goog.labs.i18n.ListFormatSymbols_ti_ER", 
"goog.labs.i18n.ListFormatSymbols_ti_ET", "goog.labs.i18n.ListFormatSymbols_to", "goog.labs.i18n.ListFormatSymbols_to_TO", "goog.labs.i18n.ListFormatSymbols_tr_CY", "goog.labs.i18n.ListFormatSymbols_tr_TR", "goog.labs.i18n.ListFormatSymbols_twq", "goog.labs.i18n.ListFormatSymbols_twq_NE", "goog.labs.i18n.ListFormatSymbols_tzm", "goog.labs.i18n.ListFormatSymbols_tzm_Latn", "goog.labs.i18n.ListFormatSymbols_tzm_Latn_MA", "goog.labs.i18n.ListFormatSymbols_ug", "goog.labs.i18n.ListFormatSymbols_ug_Arab", 
"goog.labs.i18n.ListFormatSymbols_ug_Arab_CN", "goog.labs.i18n.ListFormatSymbols_uk_UA", "goog.labs.i18n.ListFormatSymbols_ur_IN", "goog.labs.i18n.ListFormatSymbols_ur_PK", "goog.labs.i18n.ListFormatSymbols_uz_Arab", "goog.labs.i18n.ListFormatSymbols_uz_Arab_AF", "goog.labs.i18n.ListFormatSymbols_uz_Cyrl", "goog.labs.i18n.ListFormatSymbols_uz_Cyrl_UZ", "goog.labs.i18n.ListFormatSymbols_uz_Latn", "goog.labs.i18n.ListFormatSymbols_uz_Latn_UZ", "goog.labs.i18n.ListFormatSymbols_vai", "goog.labs.i18n.ListFormatSymbols_vai_Latn", 
"goog.labs.i18n.ListFormatSymbols_vai_Latn_LR", "goog.labs.i18n.ListFormatSymbols_vai_Vaii", "goog.labs.i18n.ListFormatSymbols_vai_Vaii_LR", "goog.labs.i18n.ListFormatSymbols_vi_VN", "goog.labs.i18n.ListFormatSymbols_vun", "goog.labs.i18n.ListFormatSymbols_vun_TZ", "goog.labs.i18n.ListFormatSymbols_wae", "goog.labs.i18n.ListFormatSymbols_wae_CH", "goog.labs.i18n.ListFormatSymbols_xog", "goog.labs.i18n.ListFormatSymbols_xog_UG", "goog.labs.i18n.ListFormatSymbols_yav", "goog.labs.i18n.ListFormatSymbols_yav_CM", 
"goog.labs.i18n.ListFormatSymbols_yi", "goog.labs.i18n.ListFormatSymbols_yi_001", "goog.labs.i18n.ListFormatSymbols_yo", "goog.labs.i18n.ListFormatSymbols_yo_BJ", "goog.labs.i18n.ListFormatSymbols_yo_NG", "goog.labs.i18n.ListFormatSymbols_zgh", "goog.labs.i18n.ListFormatSymbols_zgh_MA", "goog.labs.i18n.ListFormatSymbols_zh_Hans", "goog.labs.i18n.ListFormatSymbols_zh_Hans_CN", "goog.labs.i18n.ListFormatSymbols_zh_Hans_HK", "goog.labs.i18n.ListFormatSymbols_zh_Hans_MO", "goog.labs.i18n.ListFormatSymbols_zh_Hans_SG", 
"goog.labs.i18n.ListFormatSymbols_zh_Hant", "goog.labs.i18n.ListFormatSymbols_zh_Hant_HK", "goog.labs.i18n.ListFormatSymbols_zh_Hant_MO", "goog.labs.i18n.ListFormatSymbols_zh_Hant_TW", "goog.labs.i18n.ListFormatSymbols_zu_ZA"], ["goog.labs.i18n.ListFormatSymbols"], false);
goog.addDependency("labs/mock/mock.js", ["goog.labs.mock", "goog.labs.mock.VerificationError"], ["goog.array", "goog.asserts", "goog.debug", "goog.debug.Error", "goog.functions", "goog.object"], false);
goog.addDependency("labs/mock/mock_test.js", ["goog.labs.mockTest"], ["goog.array", "goog.labs.mock", "goog.labs.mock.VerificationError", "goog.labs.testing.AnythingMatcher", "goog.labs.testing.GreaterThanMatcher", "goog.string", "goog.testing.jsunit"], false);
goog.addDependency("labs/net/image.js", ["goog.labs.net.image"], ["goog.Promise", "goog.events.EventHandler", "goog.events.EventType", "goog.net.EventType", "goog.userAgent"], false);
goog.addDependency("labs/net/image_test.js", ["goog.labs.net.imageTest"], ["goog.labs.net.image", "goog.string", "goog.testing.AsyncTestCase", "goog.testing.jsunit", "goog.testing.recordFunction"], false);
goog.addDependency("labs/net/webchannel.js", ["goog.net.WebChannel"], ["goog.events", "goog.events.Event"], false);
goog.addDependency("labs/net/webchannel/basetestchannel.js", ["goog.labs.net.webChannel.BaseTestChannel"], ["goog.labs.net.webChannel.Channel", "goog.labs.net.webChannel.ChannelRequest", "goog.labs.net.webChannel.requestStats", "goog.labs.net.webChannel.requestStats.Stat"], false);
goog.addDependency("labs/net/webchannel/channel.js", ["goog.labs.net.webChannel.Channel"], [], false);
goog.addDependency("labs/net/webchannel/channelrequest.js", ["goog.labs.net.webChannel.ChannelRequest"], ["goog.Timer", "goog.async.Throttle", "goog.events.EventHandler", "goog.labs.net.webChannel.requestStats", "goog.labs.net.webChannel.requestStats.ServerReachability", "goog.labs.net.webChannel.requestStats.Stat", "goog.net.ErrorCode", "goog.net.EventType", "goog.net.XmlHttp", "goog.object", "goog.uri.utils.StandardQueryParam", "goog.userAgent"], false);
goog.addDependency("labs/net/webchannel/channelrequest_test.js", ["goog.labs.net.webChannel.channelRequestTest"], ["goog.Uri", "goog.functions", "goog.labs.net.webChannel.ChannelRequest", "goog.labs.net.webChannel.WebChannelDebug", "goog.labs.net.webChannel.requestStats", "goog.labs.net.webChannel.requestStats.ServerReachability", "goog.testing.MockClock", "goog.testing.PropertyReplacer", "goog.testing.jsunit", "goog.testing.net.XhrIo", "goog.testing.recordFunction"], false);
goog.addDependency("labs/net/webchannel/connectionstate.js", ["goog.labs.net.webChannel.ConnectionState"], [], false);
goog.addDependency("labs/net/webchannel/forwardchannelrequestpool.js", ["goog.labs.net.webChannel.ForwardChannelRequestPool"], ["goog.array", "goog.string", "goog.structs.Set"], false);
goog.addDependency("labs/net/webchannel/forwardchannelrequestpool_test.js", ["goog.labs.net.webChannel.forwardChannelRequestPoolTest"], ["goog.labs.net.webChannel.ChannelRequest", "goog.labs.net.webChannel.ForwardChannelRequestPool", "goog.testing.PropertyReplacer", "goog.testing.asserts", "goog.testing.jsunit"], false);
goog.addDependency("labs/net/webchannel/netutils.js", ["goog.labs.net.webChannel.netUtils"], ["goog.Uri", "goog.labs.net.webChannel.WebChannelDebug"], false);
goog.addDependency("labs/net/webchannel/requeststats.js", ["goog.labs.net.webChannel.requestStats", "goog.labs.net.webChannel.requestStats.Event", "goog.labs.net.webChannel.requestStats.ServerReachability", "goog.labs.net.webChannel.requestStats.ServerReachabilityEvent", "goog.labs.net.webChannel.requestStats.Stat", "goog.labs.net.webChannel.requestStats.StatEvent", "goog.labs.net.webChannel.requestStats.TimingEvent"], ["goog.events.Event", "goog.events.EventTarget"], false);
goog.addDependency("labs/net/webchannel/webchannelbase.js", ["goog.labs.net.webChannel.WebChannelBase"], ["goog.Uri", "goog.array", "goog.asserts", "goog.debug.TextFormatter", "goog.json", "goog.labs.net.webChannel.BaseTestChannel", "goog.labs.net.webChannel.Channel", "goog.labs.net.webChannel.ChannelRequest", "goog.labs.net.webChannel.ConnectionState", "goog.labs.net.webChannel.ForwardChannelRequestPool", "goog.labs.net.webChannel.WebChannelDebug", "goog.labs.net.webChannel.Wire", "goog.labs.net.webChannel.WireV8", 
"goog.labs.net.webChannel.netUtils", "goog.labs.net.webChannel.requestStats", "goog.labs.net.webChannel.requestStats.Stat", "goog.log", "goog.net.XhrIo", "goog.object", "goog.string", "goog.structs", "goog.structs.CircularBuffer"], false);
goog.addDependency("labs/net/webchannel/webchannelbase_test.js", ["goog.labs.net.webChannel.webChannelBaseTest"], ["goog.Timer", "goog.array", "goog.dom", "goog.functions", "goog.json", "goog.labs.net.webChannel.ChannelRequest", "goog.labs.net.webChannel.ForwardChannelRequestPool", "goog.labs.net.webChannel.WebChannelBase", "goog.labs.net.webChannel.WebChannelBaseTransport", "goog.labs.net.webChannel.WebChannelDebug", "goog.labs.net.webChannel.Wire", "goog.labs.net.webChannel.netUtils", "goog.labs.net.webChannel.requestStats", 
"goog.labs.net.webChannel.requestStats.Stat", "goog.structs.Map", "goog.testing.MockClock", "goog.testing.PropertyReplacer", "goog.testing.asserts", "goog.testing.jsunit"], false);
goog.addDependency("labs/net/webchannel/webchannelbasetransport.js", ["goog.labs.net.webChannel.WebChannelBaseTransport"], ["goog.asserts", "goog.events.EventTarget", "goog.labs.net.webChannel.WebChannelBase", "goog.log", "goog.net.WebChannel", "goog.net.WebChannelTransport", "goog.object", "goog.string.path"], false);
goog.addDependency("labs/net/webchannel/webchannelbasetransport_test.js", ["goog.labs.net.webChannel.webChannelBaseTransportTest"], ["goog.events", "goog.labs.net.webChannel.WebChannelBaseTransport", "goog.net.WebChannel", "goog.testing.jsunit"], false);
goog.addDependency("labs/net/webchannel/webchanneldebug.js", ["goog.labs.net.webChannel.WebChannelDebug"], ["goog.json", "goog.log"], false);
goog.addDependency("labs/net/webchannel/wire.js", ["goog.labs.net.webChannel.Wire"], [], false);
goog.addDependency("labs/net/webchannel/wirev8.js", ["goog.labs.net.webChannel.WireV8"], ["goog.asserts", "goog.json", "goog.json.NativeJsonProcessor", "goog.structs"], false);
goog.addDependency("labs/net/webchannel/wirev8_test.js", ["goog.labs.net.webChannel.WireV8Test"], ["goog.labs.net.webChannel.WireV8", "goog.testing.jsunit"], false);
goog.addDependency("labs/net/webchanneltransport.js", ["goog.net.WebChannelTransport"], [], false);
goog.addDependency("labs/net/webchanneltransportfactory.js", ["goog.net.createWebChannelTransport"], ["goog.functions", "goog.labs.net.webChannel.WebChannelBaseTransport"], false);
goog.addDependency("labs/net/xhr.js", ["goog.labs.net.xhr", "goog.labs.net.xhr.Error", "goog.labs.net.xhr.HttpError", "goog.labs.net.xhr.Options", "goog.labs.net.xhr.PostData", "goog.labs.net.xhr.ResponseType", "goog.labs.net.xhr.TimeoutError"], ["goog.Promise", "goog.debug.Error", "goog.json", "goog.net.HttpStatus", "goog.net.XmlHttp", "goog.string", "goog.uri.utils", "goog.userAgent"], false);
goog.addDependency("labs/net/xhr_test.js", ["goog.labs.net.xhrTest"], ["goog.Promise", "goog.labs.net.xhr", "goog.net.XmlHttp", "goog.testing.AsyncTestCase", "goog.testing.MockClock", "goog.testing.jsunit", "goog.userAgent"], false);
goog.addDependency("labs/object/object.js", ["goog.labs.object"], [], false);
goog.addDependency("labs/object/object_test.js", ["goog.labs.objectTest"], ["goog.labs.object", "goog.testing.jsunit"], false);
goog.addDependency("labs/pubsub/broadcastpubsub.js", ["goog.labs.pubsub.BroadcastPubSub"], ["goog.Disposable", "goog.Timer", "goog.array", "goog.async.run", "goog.events.EventHandler", "goog.events.EventType", "goog.json", "goog.log", "goog.math", "goog.pubsub.PubSub", "goog.storage.Storage", "goog.storage.mechanism.HTML5LocalStorage", "goog.string", "goog.userAgent"], false);
goog.addDependency("labs/pubsub/broadcastpubsub_test.js", ["goog.labs.pubsub.BroadcastPubSubTest"], ["goog.array", "goog.debug.Logger", "goog.json", "goog.labs.pubsub.BroadcastPubSub", "goog.storage.Storage", "goog.structs.Map", "goog.testing.MockClock", "goog.testing.MockControl", "goog.testing.events", "goog.testing.events.Event", "goog.testing.jsunit", "goog.testing.mockmatchers", "goog.testing.mockmatchers.ArgumentMatcher", "goog.testing.recordFunction", "goog.userAgent"], false);
goog.addDependency("labs/storage/boundedcollectablestorage.js", ["goog.labs.storage.BoundedCollectableStorage"], ["goog.array", "goog.asserts", "goog.iter", "goog.storage.CollectableStorage", "goog.storage.ErrorCode", "goog.storage.ExpiringStorage"], false);
goog.addDependency("labs/storage/boundedcollectablestorage_test.js", ["goog.labs.storage.BoundedCollectableStorageTest"], ["goog.labs.storage.BoundedCollectableStorage", "goog.storage.collectableStorageTester", "goog.storage.storage_test", "goog.testing.MockClock", "goog.testing.jsunit", "goog.testing.storage.FakeMechanism"], false);
goog.addDependency("labs/structs/map.js", ["goog.labs.structs.Map"], ["goog.array", "goog.asserts", "goog.labs.object", "goog.object"], false);
goog.addDependency("labs/structs/map_perf.js", ["goog.labs.structs.mapPerf"], ["goog.dom", "goog.labs.structs.Map", "goog.structs.Map", "goog.testing.PerformanceTable", "goog.testing.jsunit"], false);
goog.addDependency("labs/structs/map_test.js", ["goog.labs.structs.MapTest"], ["goog.labs.structs.Map", "goog.testing.PropertyReplacer", "goog.testing.jsunit"], false);
goog.addDependency("labs/structs/multimap.js", ["goog.labs.structs.Multimap"], ["goog.array", "goog.labs.object", "goog.labs.structs.Map"], false);
goog.addDependency("labs/structs/multimap_test.js", ["goog.labs.structs.MultimapTest"], ["goog.labs.structs.Map", "goog.labs.structs.Multimap", "goog.testing.jsunit"], false);
goog.addDependency("labs/style/pixeldensitymonitor.js", ["goog.labs.style.PixelDensityMonitor", "goog.labs.style.PixelDensityMonitor.Density", "goog.labs.style.PixelDensityMonitor.EventType"], ["goog.events", "goog.events.EventTarget"], false);
goog.addDependency("labs/style/pixeldensitymonitor_test.js", ["goog.labs.style.PixelDensityMonitorTest"], ["goog.array", "goog.dom.DomHelper", "goog.events", "goog.labs.style.PixelDensityMonitor", "goog.testing.MockControl", "goog.testing.jsunit", "goog.testing.recordFunction"], false);
goog.addDependency("labs/testing/assertthat.js", ["goog.labs.testing.MatcherError", "goog.labs.testing.assertThat"], ["goog.debug.Error"], false);
goog.addDependency("labs/testing/assertthat_test.js", ["goog.labs.testing.assertThatTest"], ["goog.labs.testing.MatcherError", "goog.labs.testing.assertThat", "goog.testing.jsunit", "goog.testing.recordFunction"], false);
goog.addDependency("labs/testing/decoratormatcher.js", ["goog.labs.testing.AnythingMatcher"], ["goog.labs.testing.Matcher"], false);
goog.addDependency("labs/testing/decoratormatcher_test.js", ["goog.labs.testing.decoratorMatcherTest"], ["goog.labs.testing.AnythingMatcher", "goog.labs.testing.GreaterThanMatcher", "goog.labs.testing.MatcherError", "goog.labs.testing.assertThat", "goog.testing.jsunit"], false);
goog.addDependency("labs/testing/dictionarymatcher.js", ["goog.labs.testing.HasEntriesMatcher", "goog.labs.testing.HasEntryMatcher", "goog.labs.testing.HasKeyMatcher", "goog.labs.testing.HasValueMatcher"], ["goog.asserts", "goog.labs.testing.Matcher", "goog.object"], false);
goog.addDependency("labs/testing/dictionarymatcher_test.js", ["goog.labs.testing.dictionaryMatcherTest"], ["goog.labs.testing.HasEntryMatcher", "goog.labs.testing.MatcherError", "goog.labs.testing.assertThat", "goog.testing.jsunit"], false);
goog.addDependency("labs/testing/environment.js", ["goog.labs.testing.Environment"], ["goog.array", "goog.debug.Console", "goog.testing.MockClock", "goog.testing.MockControl", "goog.testing.TestCase", "goog.testing.jsunit"], false);
goog.addDependency("labs/testing/environment_test.js", ["goog.labs.testing.environmentTest"], ["goog.labs.testing.Environment", "goog.testing.MockControl", "goog.testing.TestCase", "goog.testing.jsunit"], false);
goog.addDependency("labs/testing/environment_usage_test.js", ["goog.labs.testing.environmentUsageTest"], ["goog.labs.testing.Environment"], false);
goog.addDependency("labs/testing/logicmatcher.js", ["goog.labs.testing.AllOfMatcher", "goog.labs.testing.AnyOfMatcher", "goog.labs.testing.IsNotMatcher"], ["goog.array", "goog.labs.testing.Matcher"], false);
goog.addDependency("labs/testing/logicmatcher_test.js", ["goog.labs.testing.logicMatcherTest"], ["goog.labs.testing.AllOfMatcher", "goog.labs.testing.GreaterThanMatcher", "goog.labs.testing.MatcherError", "goog.labs.testing.assertThat", "goog.testing.jsunit"], false);
goog.addDependency("labs/testing/matcher.js", ["goog.labs.testing.Matcher"], [], false);
goog.addDependency("labs/testing/numbermatcher.js", ["goog.labs.testing.CloseToMatcher", "goog.labs.testing.EqualToMatcher", "goog.labs.testing.GreaterThanEqualToMatcher", "goog.labs.testing.GreaterThanMatcher", "goog.labs.testing.LessThanEqualToMatcher", "goog.labs.testing.LessThanMatcher"], ["goog.asserts", "goog.labs.testing.Matcher"], false);
goog.addDependency("labs/testing/numbermatcher_test.js", ["goog.labs.testing.numberMatcherTest"], ["goog.labs.testing.LessThanMatcher", "goog.labs.testing.MatcherError", "goog.labs.testing.assertThat", "goog.testing.jsunit"], false);
goog.addDependency("labs/testing/objectmatcher.js", ["goog.labs.testing.HasPropertyMatcher", "goog.labs.testing.InstanceOfMatcher", "goog.labs.testing.IsNullMatcher", "goog.labs.testing.IsNullOrUndefinedMatcher", "goog.labs.testing.IsUndefinedMatcher", "goog.labs.testing.ObjectEqualsMatcher"], ["goog.labs.testing.Matcher"], false);
goog.addDependency("labs/testing/objectmatcher_test.js", ["goog.labs.testing.objectMatcherTest"], ["goog.labs.testing.MatcherError", "goog.labs.testing.ObjectEqualsMatcher", "goog.labs.testing.assertThat", "goog.testing.jsunit"], false);
goog.addDependency("labs/testing/stringmatcher.js", ["goog.labs.testing.ContainsStringMatcher", "goog.labs.testing.EndsWithMatcher", "goog.labs.testing.EqualToIgnoringWhitespaceMatcher", "goog.labs.testing.EqualsMatcher", "goog.labs.testing.RegexMatcher", "goog.labs.testing.StartsWithMatcher", "goog.labs.testing.StringContainsInOrderMatcher"], ["goog.asserts", "goog.labs.testing.Matcher", "goog.string"], false);
goog.addDependency("labs/testing/stringmatcher_test.js", ["goog.labs.testing.stringMatcherTest"], ["goog.labs.testing.MatcherError", "goog.labs.testing.StringContainsInOrderMatcher", "goog.labs.testing.assertThat", "goog.testing.jsunit"], false);
goog.addDependency("labs/useragent/browser.js", ["goog.labs.userAgent.browser"], ["goog.array", "goog.labs.userAgent.util", "goog.object", "goog.string"], false);
goog.addDependency("labs/useragent/browser_test.js", ["goog.labs.userAgent.browserTest"], ["goog.labs.userAgent.browser", "goog.labs.userAgent.testAgents", "goog.labs.userAgent.util", "goog.testing.jsunit"], false);
goog.addDependency("labs/useragent/device.js", ["goog.labs.userAgent.device"], ["goog.labs.userAgent.util"], false);
goog.addDependency("labs/useragent/device_test.js", ["goog.labs.userAgent.deviceTest"], ["goog.labs.userAgent.device", "goog.labs.userAgent.testAgents", "goog.labs.userAgent.util", "goog.testing.jsunit"], false);
goog.addDependency("labs/useragent/engine.js", ["goog.labs.userAgent.engine"], ["goog.array", "goog.labs.userAgent.util", "goog.string"], false);
goog.addDependency("labs/useragent/engine_test.js", ["goog.labs.userAgent.engineTest"], ["goog.labs.userAgent.engine", "goog.labs.userAgent.testAgents", "goog.labs.userAgent.util", "goog.testing.jsunit"], false);
goog.addDependency("labs/useragent/platform.js", ["goog.labs.userAgent.platform"], ["goog.labs.userAgent.util", "goog.string"], false);
goog.addDependency("labs/useragent/platform_test.js", ["goog.labs.userAgent.platformTest"], ["goog.labs.userAgent.platform", "goog.labs.userAgent.testAgents", "goog.labs.userAgent.util", "goog.testing.jsunit"], false);
goog.addDependency("labs/useragent/test_agents.js", ["goog.labs.userAgent.testAgents"], [], false);
goog.addDependency("labs/useragent/util.js", ["goog.labs.userAgent.util"], ["goog.string"], false);
goog.addDependency("labs/useragent/util_test.js", ["goog.labs.userAgent.utilTest"], ["goog.functions", "goog.labs.userAgent.testAgents", "goog.labs.userAgent.util", "goog.testing.PropertyReplacer", "goog.testing.jsunit"], false);
goog.addDependency("locale/countries.js", ["goog.locale.countries"], [], false);
goog.addDependency("locale/countrylanguagenames_test.js", ["goog.locale.countryLanguageNamesTest"], ["goog.locale", "goog.testing.jsunit"], false);
goog.addDependency("locale/defaultlocalenameconstants.js", ["goog.locale.defaultLocaleNameConstants"], [], false);
goog.addDependency("locale/genericfontnames.js", ["goog.locale.genericFontNames"], [], false);
goog.addDependency("locale/genericfontnames_test.js", ["goog.locale.genericFontNamesTest"], ["goog.locale.genericFontNames", "goog.testing.jsunit"], false);
goog.addDependency("locale/genericfontnamesdata.js", ["goog.locale.genericFontNamesData"], [], false);
goog.addDependency("locale/locale.js", ["goog.locale"], ["goog.locale.nativeNameConstants"], false);
goog.addDependency("locale/nativenameconstants.js", ["goog.locale.nativeNameConstants"], [], false);
goog.addDependency("locale/scriptToLanguages.js", ["goog.locale.scriptToLanguages"], ["goog.locale"], false);
goog.addDependency("locale/timezonedetection.js", ["goog.locale.timeZoneDetection"], ["goog.locale.TimeZoneFingerprint"], false);
goog.addDependency("locale/timezonedetection_test.js", ["goog.locale.timeZoneDetectionTest"], ["goog.locale.timeZoneDetection", "goog.testing.jsunit"], false);
goog.addDependency("locale/timezonefingerprint.js", ["goog.locale.TimeZoneFingerprint"], [], false);
goog.addDependency("locale/timezonelist.js", ["goog.locale.TimeZoneList"], ["goog.locale"], false);
goog.addDependency("locale/timezonelist_test.js", ["goog.locale.TimeZoneListTest"], ["goog.locale", "goog.locale.TimeZoneList", "goog.testing.jsunit"], false);
goog.addDependency("log/log.js", ["goog.log", "goog.log.Level", "goog.log.LogRecord", "goog.log.Logger"], ["goog.debug", "goog.debug.LogManager", "goog.debug.LogRecord", "goog.debug.Logger"], false);
goog.addDependency("log/log_test.js", ["goog.logTest"], ["goog.debug.LogManager", "goog.log", "goog.log.Level", "goog.testing.jsunit"], false);
goog.addDependency("math/affinetransform.js", ["goog.math.AffineTransform"], ["goog.math"], false);
goog.addDependency("math/affinetransform_test.js", ["goog.math.AffineTransformTest"], ["goog.array", "goog.math", "goog.math.AffineTransform", "goog.testing.jsunit"], false);
goog.addDependency("math/bezier.js", ["goog.math.Bezier"], ["goog.math", "goog.math.Coordinate"], false);
goog.addDependency("math/bezier_test.js", ["goog.math.BezierTest"], ["goog.math", "goog.math.Bezier", "goog.math.Coordinate", "goog.testing.jsunit"], false);
goog.addDependency("math/box.js", ["goog.math.Box"], ["goog.math.Coordinate"], false);
goog.addDependency("math/box_test.js", ["goog.math.BoxTest"], ["goog.math.Box", "goog.math.Coordinate", "goog.testing.jsunit"], false);
goog.addDependency("math/coordinate.js", ["goog.math.Coordinate"], ["goog.math"], false);
goog.addDependency("math/coordinate3.js", ["goog.math.Coordinate3"], [], false);
goog.addDependency("math/coordinate3_test.js", ["goog.math.Coordinate3Test"], ["goog.math.Coordinate3", "goog.testing.jsunit"], false);
goog.addDependency("math/coordinate_test.js", ["goog.math.CoordinateTest"], ["goog.math.Coordinate", "goog.testing.jsunit"], false);
goog.addDependency("math/exponentialbackoff.js", ["goog.math.ExponentialBackoff"], ["goog.asserts"], false);
goog.addDependency("math/exponentialbackoff_test.js", ["goog.math.ExponentialBackoffTest"], ["goog.math.ExponentialBackoff", "goog.testing.jsunit"], false);
goog.addDependency("math/integer.js", ["goog.math.Integer"], [], false);
goog.addDependency("math/integer_test.js", ["goog.math.IntegerTest"], ["goog.math.Integer", "goog.testing.jsunit"], false);
goog.addDependency("math/interpolator/interpolator1.js", ["goog.math.interpolator.Interpolator1"], [], false);
goog.addDependency("math/interpolator/linear1.js", ["goog.math.interpolator.Linear1"], ["goog.array", "goog.asserts", "goog.math", "goog.math.interpolator.Interpolator1"], false);
goog.addDependency("math/interpolator/linear1_test.js", ["goog.math.interpolator.Linear1Test"], ["goog.math.interpolator.Linear1", "goog.testing.jsunit"], false);
goog.addDependency("math/interpolator/pchip1.js", ["goog.math.interpolator.Pchip1"], ["goog.math", "goog.math.interpolator.Spline1"], false);
goog.addDependency("math/interpolator/pchip1_test.js", ["goog.math.interpolator.Pchip1Test"], ["goog.math.interpolator.Pchip1", "goog.testing.jsunit"], false);
goog.addDependency("math/interpolator/spline1.js", ["goog.math.interpolator.Spline1"], ["goog.array", "goog.asserts", "goog.math", "goog.math.interpolator.Interpolator1", "goog.math.tdma"], false);
goog.addDependency("math/interpolator/spline1_test.js", ["goog.math.interpolator.Spline1Test"], ["goog.math.interpolator.Spline1", "goog.testing.jsunit"], false);
goog.addDependency("math/line.js", ["goog.math.Line"], ["goog.math", "goog.math.Coordinate"], false);
goog.addDependency("math/line_test.js", ["goog.math.LineTest"], ["goog.math.Coordinate", "goog.math.Line", "goog.testing.jsunit"], false);
goog.addDependency("math/long.js", ["goog.math.Long"], [], false);
goog.addDependency("math/long_test.js", ["goog.math.LongTest"], ["goog.math.Long", "goog.testing.jsunit"], false);
goog.addDependency("math/math.js", ["goog.math"], ["goog.array", "goog.asserts"], false);
goog.addDependency("math/math_test.js", ["goog.mathTest"], ["goog.math", "goog.testing.jsunit"], false);
goog.addDependency("math/matrix.js", ["goog.math.Matrix"], ["goog.array", "goog.math", "goog.math.Size", "goog.string"], false);
goog.addDependency("math/matrix_test.js", ["goog.math.MatrixTest"], ["goog.math.Matrix", "goog.testing.jsunit"], false);
goog.addDependency("math/path.js", ["goog.math.Path", "goog.math.Path.Segment"], ["goog.array", "goog.math"], false);
goog.addDependency("math/path_test.js", ["goog.math.PathTest"], ["goog.array", "goog.math.AffineTransform", "goog.math.Path", "goog.testing.jsunit"], false);
goog.addDependency("math/paths.js", ["goog.math.paths"], ["goog.math.Coordinate", "goog.math.Path"], false);
goog.addDependency("math/paths_test.js", ["goog.math.pathsTest"], ["goog.math.Coordinate", "goog.math.paths", "goog.testing.jsunit"], false);
goog.addDependency("math/range.js", ["goog.math.Range"], ["goog.asserts"], false);
goog.addDependency("math/range_test.js", ["goog.math.RangeTest"], ["goog.math.Range", "goog.testing.jsunit"], false);
goog.addDependency("math/rangeset.js", ["goog.math.RangeSet"], ["goog.array", "goog.iter.Iterator", "goog.iter.StopIteration", "goog.math.Range"], false);
goog.addDependency("math/rangeset_test.js", ["goog.math.RangeSetTest"], ["goog.iter", "goog.math.Range", "goog.math.RangeSet", "goog.testing.jsunit"], false);
goog.addDependency("math/rect.js", ["goog.math.Rect"], ["goog.math.Box", "goog.math.Coordinate", "goog.math.Size"], false);
goog.addDependency("math/rect_test.js", ["goog.math.RectTest"], ["goog.math.Box", "goog.math.Coordinate", "goog.math.Rect", "goog.math.Size", "goog.testing.jsunit"], false);
goog.addDependency("math/size.js", ["goog.math.Size"], [], false);
goog.addDependency("math/size_test.js", ["goog.math.SizeTest"], ["goog.math.Size", "goog.testing.jsunit"], false);
goog.addDependency("math/tdma.js", ["goog.math.tdma"], [], false);
goog.addDependency("math/tdma_test.js", ["goog.math.tdmaTest"], ["goog.math.tdma", "goog.testing.jsunit"], false);
goog.addDependency("math/vec2.js", ["goog.math.Vec2"], ["goog.math", "goog.math.Coordinate"], false);
goog.addDependency("math/vec2_test.js", ["goog.math.Vec2Test"], ["goog.math.Vec2", "goog.testing.jsunit"], false);
goog.addDependency("math/vec3.js", ["goog.math.Vec3"], ["goog.math", "goog.math.Coordinate3"], false);
goog.addDependency("math/vec3_test.js", ["goog.math.Vec3Test"], ["goog.math.Coordinate3", "goog.math.Vec3", "goog.testing.jsunit"], false);
goog.addDependency("memoize/memoize.js", ["goog.memoize"], [], false);
goog.addDependency("memoize/memoize_test.js", ["goog.memoizeTest"], ["goog.memoize", "goog.testing.jsunit"], false);
goog.addDependency("messaging/abstractchannel.js", ["goog.messaging.AbstractChannel"], ["goog.Disposable", "goog.json", "goog.log", "goog.messaging.MessageChannel"], false);
goog.addDependency("messaging/abstractchannel_test.js", ["goog.messaging.AbstractChannelTest"], ["goog.messaging.AbstractChannel", "goog.testing.MockControl", "goog.testing.async.MockControl", "goog.testing.jsunit"], false);
goog.addDependency("messaging/bufferedchannel.js", ["goog.messaging.BufferedChannel"], ["goog.Disposable", "goog.Timer", "goog.events", "goog.log", "goog.messaging.MessageChannel", "goog.messaging.MultiChannel"], false);
goog.addDependency("messaging/bufferedchannel_test.js", ["goog.messaging.BufferedChannelTest"], ["goog.debug.Console", "goog.dom", "goog.log", "goog.log.Level", "goog.messaging.BufferedChannel", "goog.testing.MockClock", "goog.testing.MockControl", "goog.testing.async.MockControl", "goog.testing.jsunit", "goog.testing.messaging.MockMessageChannel"], false);
goog.addDependency("messaging/deferredchannel.js", ["goog.messaging.DeferredChannel"], ["goog.Disposable", "goog.messaging.MessageChannel"], false);
goog.addDependency("messaging/deferredchannel_test.js", ["goog.messaging.DeferredChannelTest"], ["goog.async.Deferred", "goog.messaging.DeferredChannel", "goog.testing.MockControl", "goog.testing.async.MockControl", "goog.testing.jsunit", "goog.testing.messaging.MockMessageChannel"], false);
goog.addDependency("messaging/loggerclient.js", ["goog.messaging.LoggerClient"], ["goog.Disposable", "goog.debug", "goog.debug.LogManager", "goog.debug.Logger"], false);
goog.addDependency("messaging/loggerclient_test.js", ["goog.messaging.LoggerClientTest"], ["goog.debug", "goog.debug.Logger", "goog.messaging.LoggerClient", "goog.testing.MockControl", "goog.testing.jsunit", "goog.testing.messaging.MockMessageChannel"], false);
goog.addDependency("messaging/loggerserver.js", ["goog.messaging.LoggerServer"], ["goog.Disposable", "goog.log", "goog.log.Level"], false);
goog.addDependency("messaging/loggerserver_test.js", ["goog.messaging.LoggerServerTest"], ["goog.debug.LogManager", "goog.debug.Logger", "goog.log", "goog.log.Level", "goog.messaging.LoggerServer", "goog.testing.MockControl", "goog.testing.PropertyReplacer", "goog.testing.jsunit", "goog.testing.messaging.MockMessageChannel"], false);
goog.addDependency("messaging/messagechannel.js", ["goog.messaging.MessageChannel"], [], false);
goog.addDependency("messaging/messaging.js", ["goog.messaging"], [], false);
goog.addDependency("messaging/messaging_test.js", ["goog.testing.messaging.MockMessageChannelTest"], ["goog.messaging", "goog.testing.MockControl", "goog.testing.jsunit", "goog.testing.messaging.MockMessageChannel"], false);
goog.addDependency("messaging/multichannel.js", ["goog.messaging.MultiChannel", "goog.messaging.MultiChannel.VirtualChannel"], ["goog.Disposable", "goog.log", "goog.messaging.MessageChannel", "goog.object"], false);
goog.addDependency("messaging/multichannel_test.js", ["goog.messaging.MultiChannelTest"], ["goog.messaging.MultiChannel", "goog.testing.MockControl", "goog.testing.jsunit", "goog.testing.messaging.MockMessageChannel", "goog.testing.mockmatchers.IgnoreArgument"], false);
goog.addDependency("messaging/portcaller.js", ["goog.messaging.PortCaller"], ["goog.Disposable", "goog.async.Deferred", "goog.messaging.DeferredChannel", "goog.messaging.PortChannel", "goog.messaging.PortNetwork", "goog.object"], false);
goog.addDependency("messaging/portcaller_test.js", ["goog.messaging.PortCallerTest"], ["goog.events.EventTarget", "goog.messaging.PortCaller", "goog.messaging.PortNetwork", "goog.testing.MockControl", "goog.testing.jsunit", "goog.testing.messaging.MockMessageChannel"], false);
goog.addDependency("messaging/portchannel.js", ["goog.messaging.PortChannel"], ["goog.Timer", "goog.array", "goog.async.Deferred", "goog.debug", "goog.events", "goog.events.EventType", "goog.json", "goog.log", "goog.messaging.AbstractChannel", "goog.messaging.DeferredChannel", "goog.object", "goog.string", "goog.userAgent"], false);
goog.addDependency("messaging/portnetwork.js", ["goog.messaging.PortNetwork"], [], false);
goog.addDependency("messaging/portoperator.js", ["goog.messaging.PortOperator"], ["goog.Disposable", "goog.asserts", "goog.log", "goog.messaging.PortChannel", "goog.messaging.PortNetwork", "goog.object"], false);
goog.addDependency("messaging/portoperator_test.js", ["goog.messaging.PortOperatorTest"], ["goog.messaging.PortNetwork", "goog.messaging.PortOperator", "goog.testing.MockControl", "goog.testing.PropertyReplacer", "goog.testing.jsunit", "goog.testing.messaging.MockMessageChannel", "goog.testing.messaging.MockMessagePort"], false);
goog.addDependency("messaging/respondingchannel.js", ["goog.messaging.RespondingChannel"], ["goog.Disposable", "goog.log", "goog.messaging.MultiChannel"], false);
goog.addDependency("messaging/respondingchannel_test.js", ["goog.messaging.RespondingChannelTest"], ["goog.messaging.RespondingChannel", "goog.testing.MockControl", "goog.testing.jsunit", "goog.testing.messaging.MockMessageChannel"], false);
goog.addDependency("messaging/testdata/portchannel_worker.js", ["goog.messaging.testdata.portchannel_worker"], ["goog.messaging.PortChannel"], false);
goog.addDependency("messaging/testdata/portnetwork_worker1.js", ["goog.messaging.testdata.portnetwork_worker1"], ["goog.messaging.PortCaller", "goog.messaging.PortChannel"], false);
goog.addDependency("messaging/testdata/portnetwork_worker2.js", ["goog.messaging.testdata.portnetwork_worker2"], ["goog.messaging.PortCaller", "goog.messaging.PortChannel"], false);
goog.addDependency("module/abstractmoduleloader.js", ["goog.module.AbstractModuleLoader"], ["goog.module"], false);
goog.addDependency("module/basemodule.js", ["goog.module.BaseModule"], ["goog.Disposable", "goog.module"], false);
goog.addDependency("module/loader.js", ["goog.module.Loader"], ["goog.Timer", "goog.array", "goog.dom", "goog.module", "goog.object"], false);
goog.addDependency("module/module.js", ["goog.module"], [], false);
goog.addDependency("module/moduleinfo.js", ["goog.module.ModuleInfo"], ["goog.Disposable", "goog.functions", "goog.module", "goog.module.BaseModule", "goog.module.ModuleLoadCallback"], false);
goog.addDependency("module/moduleinfo_test.js", ["goog.module.ModuleInfoTest"], ["goog.module.BaseModule", "goog.module.ModuleInfo", "goog.testing.jsunit"], false);
goog.addDependency("module/moduleloadcallback.js", ["goog.module.ModuleLoadCallback"], ["goog.debug.entryPointRegistry", "goog.debug.errorHandlerWeakDep", "goog.module"], false);
goog.addDependency("module/moduleloadcallback_test.js", ["goog.module.ModuleLoadCallbackTest"], ["goog.debug.ErrorHandler", "goog.debug.entryPointRegistry", "goog.functions", "goog.module.ModuleLoadCallback", "goog.testing.jsunit", "goog.testing.recordFunction"], false);
goog.addDependency("module/moduleloader.js", ["goog.module.ModuleLoader"], ["goog.Timer", "goog.array", "goog.events", "goog.events.Event", "goog.events.EventHandler", "goog.events.EventTarget", "goog.log", "goog.module.AbstractModuleLoader", "goog.net.BulkLoader", "goog.net.EventType", "goog.net.jsloader", "goog.userAgent", "goog.userAgent.product"], false);
goog.addDependency("module/moduleloader_test.js", ["goog.module.ModuleLoaderTest"], ["goog.array", "goog.dom", "goog.events", "goog.functions", "goog.module.ModuleLoader", "goog.module.ModuleManager", "goog.net.BulkLoader", "goog.net.XmlHttp", "goog.object", "goog.testing.AsyncTestCase", "goog.testing.PropertyReplacer", "goog.testing.events.EventObserver", "goog.testing.jsunit", "goog.userAgent"], false);
goog.addDependency("module/modulemanager.js", ["goog.module.ModuleManager", "goog.module.ModuleManager.CallbackType", "goog.module.ModuleManager.FailureType"], ["goog.Disposable", "goog.array", "goog.asserts", "goog.async.Deferred", "goog.debug.Trace", "goog.dispose", "goog.log", "goog.module", "goog.module.ModuleInfo", "goog.module.ModuleLoadCallback", "goog.object"], false);
goog.addDependency("module/modulemanager_test.js", ["goog.module.ModuleManagerTest"], ["goog.array", "goog.functions", "goog.module.BaseModule", "goog.module.ModuleManager", "goog.testing", "goog.testing.MockClock", "goog.testing.jsunit", "goog.testing.recordFunction", "goog.userAgent"], false);
goog.addDependency("module/testdata/modA_1.js", ["goog.module.testdata.modA_1"], [], false);
goog.addDependency("module/testdata/modA_2.js", ["goog.module.testdata.modA_2"], ["goog.module.ModuleManager"], false);
goog.addDependency("module/testdata/modB_1.js", ["goog.module.testdata.modB_1"], ["goog.module.ModuleManager"], false);
goog.addDependency("net/browserchannel.js", ["goog.net.BrowserChannel", "goog.net.BrowserChannel.Error", "goog.net.BrowserChannel.Event", "goog.net.BrowserChannel.Handler", "goog.net.BrowserChannel.LogSaver", "goog.net.BrowserChannel.QueuedMap", "goog.net.BrowserChannel.ServerReachability", "goog.net.BrowserChannel.ServerReachabilityEvent", "goog.net.BrowserChannel.Stat", "goog.net.BrowserChannel.StatEvent", "goog.net.BrowserChannel.State", "goog.net.BrowserChannel.TimingEvent"], ["goog.Uri", "goog.array", 
"goog.asserts", "goog.debug.TextFormatter", "goog.events.Event", "goog.events.EventTarget", "goog.json", "goog.json.EvalJsonProcessor", "goog.log", "goog.net.BrowserTestChannel", "goog.net.ChannelDebug", "goog.net.ChannelRequest", "goog.net.XhrIo", "goog.net.tmpnetwork", "goog.object", "goog.string", "goog.structs", "goog.structs.CircularBuffer"], false);
goog.addDependency("net/browserchannel_test.js", ["goog.net.BrowserChannelTest"], ["goog.Timer", "goog.array", "goog.dom", "goog.functions", "goog.json", "goog.net.BrowserChannel", "goog.net.ChannelDebug", "goog.net.ChannelRequest", "goog.net.tmpnetwork", "goog.structs.Map", "goog.testing.MockClock", "goog.testing.PropertyReplacer", "goog.testing.asserts", "goog.testing.jsunit", "goog.testing.recordFunction"], false);
goog.addDependency("net/browsertestchannel.js", ["goog.net.BrowserTestChannel"], ["goog.json.EvalJsonProcessor", "goog.net.ChannelRequest", "goog.net.ChannelRequest.Error", "goog.net.tmpnetwork", "goog.string.Parser", "goog.userAgent"], false);
goog.addDependency("net/bulkloader.js", ["goog.net.BulkLoader"], ["goog.events.EventHandler", "goog.events.EventTarget", "goog.log", "goog.net.BulkLoaderHelper", "goog.net.EventType", "goog.net.XhrIo"], false);
goog.addDependency("net/bulkloader_test.js", ["goog.net.BulkLoaderTest"], ["goog.events.Event", "goog.events.EventHandler", "goog.net.BulkLoader", "goog.net.EventType", "goog.testing.MockClock", "goog.testing.jsunit"], false);
goog.addDependency("net/bulkloaderhelper.js", ["goog.net.BulkLoaderHelper"], ["goog.Disposable", "goog.log"], false);
goog.addDependency("net/channeldebug.js", ["goog.net.ChannelDebug"], ["goog.json", "goog.log"], false);
goog.addDependency("net/channelrequest.js", ["goog.net.ChannelRequest", "goog.net.ChannelRequest.Error"], ["goog.Timer", "goog.async.Throttle", "goog.events.EventHandler", "goog.net.ErrorCode", "goog.net.EventType", "goog.net.XmlHttp", "goog.object", "goog.userAgent"], false);
goog.addDependency("net/channelrequest_test.js", ["goog.net.ChannelRequestTest"], ["goog.Uri", "goog.functions", "goog.net.BrowserChannel", "goog.net.ChannelDebug", "goog.net.ChannelRequest", "goog.testing.MockClock", "goog.testing.PropertyReplacer", "goog.testing.jsunit", "goog.testing.net.XhrIo", "goog.testing.recordFunction"], false);
goog.addDependency("net/cookies.js", ["goog.net.Cookies", "goog.net.cookies"], [], false);
goog.addDependency("net/cookies_test.js", ["goog.net.cookiesTest"], ["goog.array", "goog.net.cookies", "goog.testing.PropertyReplacer", "goog.testing.jsunit"], false);
goog.addDependency("net/corsxmlhttpfactory.js", ["goog.net.CorsXmlHttpFactory", "goog.net.IeCorsXhrAdapter"], ["goog.net.HttpStatus", "goog.net.XhrLike", "goog.net.XmlHttp", "goog.net.XmlHttpFactory"], false);
goog.addDependency("net/corsxmlhttpfactory_test.js", ["goog.net.CorsXmlHttpFactoryTest"], ["goog.net.CorsXmlHttpFactory", "goog.net.IeCorsXhrAdapter", "goog.testing.jsunit", "goog.userAgent"], false);
goog.addDependency("net/crossdomainrpc.js", ["goog.net.CrossDomainRpc"], ["goog.Uri", "goog.dom", "goog.events", "goog.events.EventTarget", "goog.events.EventType", "goog.json", "goog.log", "goog.net.EventType", "goog.net.HttpStatus", "goog.string", "goog.userAgent"], false);
goog.addDependency("net/crossdomainrpc_test.js", ["goog.net.CrossDomainRpcTest"], ["goog.log", "goog.log.Level", "goog.net.CrossDomainRpc", "goog.testing.AsyncTestCase", "goog.testing.jsunit", "goog.userAgent"], false);
goog.addDependency("net/errorcode.js", ["goog.net.ErrorCode"], [], false);
goog.addDependency("net/eventtype.js", ["goog.net.EventType"], [], false);
goog.addDependency("net/filedownloader.js", ["goog.net.FileDownloader", "goog.net.FileDownloader.Error"], ["goog.Disposable", "goog.asserts", "goog.async.Deferred", "goog.crypt.hash32", "goog.debug.Error", "goog.events", "goog.events.EventHandler", "goog.fs", "goog.fs.DirectoryEntry", "goog.fs.Error", "goog.fs.FileSaver", "goog.net.EventType", "goog.net.XhrIo", "goog.net.XhrIoPool", "goog.object"], false);
goog.addDependency("net/filedownloader_test.js", ["goog.net.FileDownloaderTest"], ["goog.fs.Error", "goog.net.ErrorCode", "goog.net.FileDownloader", "goog.net.XhrIo", "goog.testing.AsyncTestCase", "goog.testing.PropertyReplacer", "goog.testing.fs", "goog.testing.fs.FileSystem", "goog.testing.jsunit", "goog.testing.net.XhrIoPool"], false);
goog.addDependency("net/httpstatus.js", ["goog.net.HttpStatus"], [], false);
goog.addDependency("net/iframe_xhr_test.js", ["goog.net.iframeXhrTest"], ["goog.Timer", "goog.debug.Console", "goog.debug.LogManager", "goog.debug.Logger", "goog.events", "goog.net.IframeIo", "goog.net.XhrIo", "goog.testing.AsyncTestCase", "goog.testing.jsunit", "goog.userAgent"], false);
goog.addDependency("net/iframeio.js", ["goog.net.IframeIo", "goog.net.IframeIo.IncrementalDataEvent"], ["goog.Timer", "goog.Uri", "goog.asserts", "goog.debug", "goog.dom", "goog.events", "goog.events.Event", "goog.events.EventTarget", "goog.events.EventType", "goog.json", "goog.log", "goog.log.Level", "goog.net.ErrorCode", "goog.net.EventType", "goog.reflect", "goog.string", "goog.structs", "goog.userAgent"], false);
goog.addDependency("net/iframeio_different_base_test.js", ["goog.net.iframeIoDifferentBaseTest"], ["goog.events", "goog.net.EventType", "goog.net.IframeIo", "goog.testing.AsyncTestCase", "goog.testing.jsunit"], false);
goog.addDependency("net/iframeio_test.js", ["goog.net.IframeIoTest"], ["goog.debug", "goog.debug.DivConsole", "goog.debug.LogManager", "goog.dom", "goog.events", "goog.events.EventType", "goog.log", "goog.log.Level", "goog.net.IframeIo", "goog.testing.events", "goog.testing.events.Event", "goog.testing.jsunit", "goog.userAgent"], false);
goog.addDependency("net/iframeloadmonitor.js", ["goog.net.IframeLoadMonitor"], ["goog.dom", "goog.events", "goog.events.EventTarget", "goog.events.EventType", "goog.userAgent"], false);
goog.addDependency("net/iframeloadmonitor_test.js", ["goog.net.IframeLoadMonitorTest"], ["goog.dom", "goog.events", "goog.net.IframeLoadMonitor", "goog.testing.AsyncTestCase", "goog.testing.jsunit"], false);
goog.addDependency("net/imageloader.js", ["goog.net.ImageLoader"], ["goog.array", "goog.dom", "goog.events.EventHandler", "goog.events.EventTarget", "goog.events.EventType", "goog.net.EventType", "goog.object", "goog.userAgent"], false);
goog.addDependency("net/imageloader_test.js", ["goog.net.ImageLoaderTest"], ["goog.Timer", "goog.array", "goog.dispose", "goog.events", "goog.events.Event", "goog.events.EventType", "goog.net.EventType", "goog.net.ImageLoader", "goog.object", "goog.string", "goog.testing.AsyncTestCase", "goog.testing.jsunit", "goog.testing.recordFunction"], false);
goog.addDependency("net/ipaddress.js", ["goog.net.IpAddress", "goog.net.Ipv4Address", "goog.net.Ipv6Address"], ["goog.array", "goog.math.Integer", "goog.object", "goog.string"], false);
goog.addDependency("net/ipaddress_test.js", ["goog.net.IpAddressTest"], ["goog.math.Integer", "goog.net.IpAddress", "goog.net.Ipv4Address", "goog.net.Ipv6Address", "goog.testing.jsunit"], false);
goog.addDependency("net/jsloader.js", ["goog.net.jsloader", "goog.net.jsloader.Error", "goog.net.jsloader.ErrorCode", "goog.net.jsloader.Options"], ["goog.array", "goog.async.Deferred", "goog.debug.Error", "goog.dom", "goog.dom.TagName"], false);
goog.addDependency("net/jsloader_test.js", ["goog.net.jsloaderTest"], ["goog.array", "goog.dom", "goog.net.jsloader", "goog.net.jsloader.ErrorCode", "goog.testing.AsyncTestCase", "goog.testing.jsunit"], false);
goog.addDependency("net/jsonp.js", ["goog.net.Jsonp"], ["goog.Uri", "goog.net.jsloader"], false);
goog.addDependency("net/jsonp_test.js", ["goog.net.JsonpTest"], ["goog.net.Jsonp", "goog.testing.PropertyReplacer", "goog.testing.jsunit", "goog.testing.recordFunction", "goog.userAgent"], false);
goog.addDependency("net/mockiframeio.js", ["goog.net.MockIFrameIo"], ["goog.events.EventTarget", "goog.json", "goog.net.ErrorCode", "goog.net.EventType", "goog.net.IframeIo"], false);
goog.addDependency("net/multiiframeloadmonitor.js", ["goog.net.MultiIframeLoadMonitor"], ["goog.events", "goog.net.IframeLoadMonitor"], false);
goog.addDependency("net/multiiframeloadmonitor_test.js", ["goog.net.MultiIframeLoadMonitorTest"], ["goog.dom", "goog.net.IframeLoadMonitor", "goog.net.MultiIframeLoadMonitor", "goog.testing.AsyncTestCase", "goog.testing.jsunit"], false);
goog.addDependency("net/networkstatusmonitor.js", ["goog.net.NetworkStatusMonitor"], ["goog.events.Listenable"], false);
goog.addDependency("net/networktester.js", ["goog.net.NetworkTester"], ["goog.Timer", "goog.Uri", "goog.log"], false);
goog.addDependency("net/networktester_test.js", ["goog.net.NetworkTesterTest"], ["goog.Uri", "goog.net.NetworkTester", "goog.testing.MockClock", "goog.testing.jsunit"], false);
goog.addDependency("net/testdata/jsloader_test1.js", ["goog.net.testdata.jsloader_test1"], [], false);
goog.addDependency("net/testdata/jsloader_test2.js", ["goog.net.testdata.jsloader_test2"], [], false);
goog.addDependency("net/testdata/jsloader_test3.js", ["goog.net.testdata.jsloader_test3"], [], false);
goog.addDependency("net/testdata/jsloader_test4.js", ["goog.net.testdata.jsloader_test4"], [], false);
goog.addDependency("net/tmpnetwork.js", ["goog.net.tmpnetwork"], ["goog.Uri", "goog.net.ChannelDebug"], false);
goog.addDependency("net/websocket.js", ["goog.net.WebSocket", "goog.net.WebSocket.ErrorEvent", "goog.net.WebSocket.EventType", "goog.net.WebSocket.MessageEvent"], ["goog.Timer", "goog.asserts", "goog.debug.entryPointRegistry", "goog.events", "goog.events.Event", "goog.events.EventTarget", "goog.log"], false);
goog.addDependency("net/websocket_test.js", ["goog.net.WebSocketTest"], ["goog.debug.EntryPointMonitor", "goog.debug.ErrorHandler", "goog.debug.entryPointRegistry", "goog.events", "goog.functions", "goog.net.WebSocket", "goog.testing.MockClock", "goog.testing.PropertyReplacer", "goog.testing.jsunit", "goog.testing.recordFunction"], false);
goog.addDependency("net/wrapperxmlhttpfactory.js", ["goog.net.WrapperXmlHttpFactory"], ["goog.net.XhrLike", "goog.net.XmlHttpFactory"], false);
goog.addDependency("net/xhrio.js", ["goog.net.XhrIo", "goog.net.XhrIo.ResponseType"], ["goog.Timer", "goog.array", "goog.debug.entryPointRegistry", "goog.events.EventTarget", "goog.json", "goog.log", "goog.net.ErrorCode", "goog.net.EventType", "goog.net.HttpStatus", "goog.net.XmlHttp", "goog.object", "goog.string", "goog.structs", "goog.structs.Map", "goog.uri.utils", "goog.userAgent"], false);
goog.addDependency("net/xhrio_test.js", ["goog.net.XhrIoTest"], ["goog.Uri", "goog.debug.EntryPointMonitor", "goog.debug.ErrorHandler", "goog.debug.entryPointRegistry", "goog.events", "goog.functions", "goog.net.EventType", "goog.net.WrapperXmlHttpFactory", "goog.net.XhrIo", "goog.net.XmlHttp", "goog.object", "goog.string", "goog.testing.MockClock", "goog.testing.PropertyReplacer", "goog.testing.jsunit", "goog.testing.net.XhrIo", "goog.testing.recordFunction"], false);
goog.addDependency("net/xhriopool.js", ["goog.net.XhrIoPool"], ["goog.net.XhrIo", "goog.structs.PriorityPool"], false);
goog.addDependency("net/xhrlike.js", ["goog.net.XhrLike"], [], false);
goog.addDependency("net/xhrmanager.js", ["goog.net.XhrManager", "goog.net.XhrManager.Event", "goog.net.XhrManager.Request"], ["goog.events", "goog.events.Event", "goog.events.EventHandler", "goog.events.EventTarget", "goog.net.ErrorCode", "goog.net.EventType", "goog.net.XhrIo", "goog.net.XhrIoPool", "goog.structs.Map"], false);
goog.addDependency("net/xhrmanager_test.js", ["goog.net.XhrManagerTest"], ["goog.events", "goog.net.EventType", "goog.net.XhrIo", "goog.net.XhrManager", "goog.testing.jsunit", "goog.testing.net.XhrIoPool", "goog.testing.recordFunction"], false);
goog.addDependency("net/xmlhttp.js", ["goog.net.DefaultXmlHttpFactory", "goog.net.XmlHttp", "goog.net.XmlHttp.OptionType", "goog.net.XmlHttp.ReadyState", "goog.net.XmlHttpDefines"], ["goog.asserts", "goog.net.WrapperXmlHttpFactory", "goog.net.XmlHttpFactory"], false);
goog.addDependency("net/xmlhttpfactory.js", ["goog.net.XmlHttpFactory"], ["goog.net.XhrLike"], false);
goog.addDependency("net/xpc/crosspagechannel.js", ["goog.net.xpc.CrossPageChannel"], ["goog.Uri", "goog.async.Deferred", "goog.async.Delay", "goog.dispose", "goog.dom", "goog.events", "goog.events.EventHandler", "goog.events.EventType", "goog.json", "goog.log", "goog.messaging.AbstractChannel", "goog.net.xpc", "goog.net.xpc.CfgFields", "goog.net.xpc.ChannelStates", "goog.net.xpc.CrossPageChannelRole", "goog.net.xpc.DirectTransport", "goog.net.xpc.FrameElementMethodTransport", "goog.net.xpc.IframePollingTransport", 
"goog.net.xpc.IframeRelayTransport", "goog.net.xpc.NativeMessagingTransport", "goog.net.xpc.NixTransport", "goog.net.xpc.TransportTypes", "goog.net.xpc.UriCfgFields", "goog.string", "goog.uri.utils", "goog.userAgent"], false);
goog.addDependency("net/xpc/crosspagechannel_test.js", ["goog.net.xpc.CrossPageChannelTest"], ["goog.Disposable", "goog.Uri", "goog.async.Deferred", "goog.dom", "goog.log", "goog.log.Level", "goog.net.xpc", "goog.net.xpc.CfgFields", "goog.net.xpc.CrossPageChannel", "goog.net.xpc.CrossPageChannelRole", "goog.net.xpc.TransportTypes", "goog.object", "goog.testing.AsyncTestCase", "goog.testing.PropertyReplacer", "goog.testing.jsunit"], false);
goog.addDependency("net/xpc/crosspagechannelrole.js", ["goog.net.xpc.CrossPageChannelRole"], [], false);
goog.addDependency("net/xpc/directtransport.js", ["goog.net.xpc.DirectTransport"], ["goog.Timer", "goog.async.Deferred", "goog.events.EventHandler", "goog.log", "goog.net.xpc", "goog.net.xpc.CfgFields", "goog.net.xpc.CrossPageChannelRole", "goog.net.xpc.Transport", "goog.net.xpc.TransportTypes", "goog.object"], false);
goog.addDependency("net/xpc/directtransport_test.js", ["goog.net.xpc.DirectTransportTest"], ["goog.dom", "goog.log", "goog.log.Level", "goog.net.xpc", "goog.net.xpc.CfgFields", "goog.net.xpc.CrossPageChannel", "goog.net.xpc.CrossPageChannelRole", "goog.net.xpc.TransportTypes", "goog.testing.AsyncTestCase", "goog.testing.jsunit"], false);
goog.addDependency("net/xpc/frameelementmethodtransport.js", ["goog.net.xpc.FrameElementMethodTransport"], ["goog.log", "goog.net.xpc", "goog.net.xpc.CrossPageChannelRole", "goog.net.xpc.Transport", "goog.net.xpc.TransportTypes"], false);
goog.addDependency("net/xpc/iframepollingtransport.js", ["goog.net.xpc.IframePollingTransport", "goog.net.xpc.IframePollingTransport.Receiver", "goog.net.xpc.IframePollingTransport.Sender"], ["goog.array", "goog.dom", "goog.log", "goog.log.Level", "goog.net.xpc", "goog.net.xpc.CfgFields", "goog.net.xpc.CrossPageChannelRole", "goog.net.xpc.Transport", "goog.net.xpc.TransportTypes", "goog.userAgent"], false);
goog.addDependency("net/xpc/iframepollingtransport_test.js", ["goog.net.xpc.IframePollingTransportTest"], ["goog.Timer", "goog.dom", "goog.dom.TagName", "goog.functions", "goog.net.xpc.CfgFields", "goog.net.xpc.CrossPageChannel", "goog.net.xpc.CrossPageChannelRole", "goog.net.xpc.TransportTypes", "goog.object", "goog.testing.MockClock", "goog.testing.jsunit", "goog.testing.recordFunction"], false);
goog.addDependency("net/xpc/iframerelaytransport.js", ["goog.net.xpc.IframeRelayTransport"], ["goog.dom", "goog.dom.safe", "goog.events", "goog.html.SafeHtml", "goog.log", "goog.log.Level", "goog.net.xpc", "goog.net.xpc.CfgFields", "goog.net.xpc.Transport", "goog.net.xpc.TransportTypes", "goog.string", "goog.string.Const", "goog.userAgent"], false);
goog.addDependency("net/xpc/nativemessagingtransport.js", ["goog.net.xpc.NativeMessagingTransport"], ["goog.Timer", "goog.asserts", "goog.async.Deferred", "goog.events", "goog.events.EventHandler", "goog.log", "goog.net.xpc", "goog.net.xpc.CrossPageChannelRole", "goog.net.xpc.Transport", "goog.net.xpc.TransportTypes"], false);
goog.addDependency("net/xpc/nativemessagingtransport_test.js", ["goog.net.xpc.NativeMessagingTransportTest"], ["goog.dom", "goog.events", "goog.net.xpc", "goog.net.xpc.CfgFields", "goog.net.xpc.CrossPageChannel", "goog.net.xpc.CrossPageChannelRole", "goog.net.xpc.NativeMessagingTransport", "goog.testing.jsunit"], false);
goog.addDependency("net/xpc/nixtransport.js", ["goog.net.xpc.NixTransport"], ["goog.log", "goog.net.xpc", "goog.net.xpc.CfgFields", "goog.net.xpc.CrossPageChannelRole", "goog.net.xpc.Transport", "goog.net.xpc.TransportTypes", "goog.reflect"], false);
goog.addDependency("net/xpc/relay.js", ["goog.net.xpc.relay"], [], false);
goog.addDependency("net/xpc/transport.js", ["goog.net.xpc.Transport"], ["goog.Disposable", "goog.dom", "goog.net.xpc.TransportNames"], false);
goog.addDependency("net/xpc/xpc.js", ["goog.net.xpc", "goog.net.xpc.CfgFields", "goog.net.xpc.ChannelStates", "goog.net.xpc.TransportNames", "goog.net.xpc.TransportTypes", "goog.net.xpc.UriCfgFields"], ["goog.log"], false);
goog.addDependency("object/object.js", ["goog.object"], [], false);
goog.addDependency("object/object_test.js", ["goog.objectTest"], ["goog.functions", "goog.object", "goog.testing.jsunit"], false);
goog.addDependency("positioning/absoluteposition.js", ["goog.positioning.AbsolutePosition"], ["goog.math.Coordinate", "goog.positioning", "goog.positioning.AbstractPosition"], false);
goog.addDependency("positioning/abstractposition.js", ["goog.positioning.AbstractPosition"], [], false);
goog.addDependency("positioning/anchoredposition.js", ["goog.positioning.AnchoredPosition"], ["goog.positioning", "goog.positioning.AbstractPosition"], false);
goog.addDependency("positioning/anchoredposition_test.js", ["goog.positioning.AnchoredPositionTest"], ["goog.dom", "goog.positioning.AnchoredPosition", "goog.positioning.Corner", "goog.positioning.Overflow", "goog.style", "goog.testing.jsunit"], false);
goog.addDependency("positioning/anchoredviewportposition.js", ["goog.positioning.AnchoredViewportPosition"], ["goog.positioning", "goog.positioning.AnchoredPosition", "goog.positioning.Overflow", "goog.positioning.OverflowStatus"], false);
goog.addDependency("positioning/anchoredviewportposition_test.js", ["goog.positioning.AnchoredViewportPositionTest"], ["goog.dom", "goog.math.Box", "goog.positioning.AnchoredViewportPosition", "goog.positioning.Corner", "goog.positioning.OverflowStatus", "goog.style", "goog.testing.jsunit"], false);
goog.addDependency("positioning/clientposition.js", ["goog.positioning.ClientPosition"], ["goog.asserts", "goog.dom", "goog.math.Coordinate", "goog.positioning", "goog.positioning.AbstractPosition", "goog.style"], false);
goog.addDependency("positioning/clientposition_test.js", ["goog.positioning.clientPositionTest"], ["goog.dom", "goog.positioning.ClientPosition", "goog.positioning.Corner", "goog.style", "goog.testing.jsunit"], false);
goog.addDependency("positioning/menuanchoredposition.js", ["goog.positioning.MenuAnchoredPosition"], ["goog.positioning.AnchoredViewportPosition", "goog.positioning.Overflow"], false);
goog.addDependency("positioning/menuanchoredposition_test.js", ["goog.positioning.MenuAnchoredPositionTest"], ["goog.dom", "goog.positioning.Corner", "goog.positioning.MenuAnchoredPosition", "goog.testing.jsunit"], false);
goog.addDependency("positioning/positioning.js", ["goog.positioning", "goog.positioning.Corner", "goog.positioning.CornerBit", "goog.positioning.Overflow", "goog.positioning.OverflowStatus"], ["goog.asserts", "goog.dom", "goog.dom.TagName", "goog.math.Coordinate", "goog.math.Rect", "goog.math.Size", "goog.style", "goog.style.bidi"], false);
goog.addDependency("positioning/positioning_test.js", ["goog.positioningTest"], ["goog.dom", "goog.dom.DomHelper", "goog.math.Box", "goog.math.Coordinate", "goog.math.Size", "goog.positioning", "goog.positioning.Corner", "goog.positioning.Overflow", "goog.positioning.OverflowStatus", "goog.style", "goog.testing.ExpectedFailures", "goog.testing.jsunit", "goog.userAgent", "goog.userAgent.product"], false);
goog.addDependency("positioning/viewportclientposition.js", ["goog.positioning.ViewportClientPosition"], ["goog.dom", "goog.math.Coordinate", "goog.positioning", "goog.positioning.ClientPosition", "goog.positioning.Overflow", "goog.positioning.OverflowStatus", "goog.style"], false);
goog.addDependency("positioning/viewportclientposition_test.js", ["goog.positioning.ViewportClientPositionTest"], ["goog.dom", "goog.positioning.Corner", "goog.positioning.Overflow", "goog.positioning.ViewportClientPosition", "goog.style", "goog.testing.jsunit", "goog.userAgent"], false);
goog.addDependency("positioning/viewportposition.js", ["goog.positioning.ViewportPosition"], ["goog.math.Coordinate", "goog.positioning", "goog.positioning.AbstractPosition", "goog.positioning.Corner", "goog.style"], false);
goog.addDependency("promise/promise.js", ["goog.Promise"], ["goog.Thenable", "goog.asserts", "goog.async.run", "goog.async.throwException", "goog.debug.Error", "goog.promise.Resolver"], false);
goog.addDependency("promise/promise_test.js", ["goog.PromiseTest"], ["goog.Promise", "goog.Thenable", "goog.functions", "goog.testing.AsyncTestCase", "goog.testing.MockClock", "goog.testing.PropertyReplacer", "goog.testing.jsunit", "goog.testing.recordFunction"], false);
goog.addDependency("promise/resolver.js", ["goog.promise.Resolver"], [], false);
goog.addDependency("promise/testsuiteadapter.js", ["goog.promise.testSuiteAdapter"], ["goog.Promise"], false);
goog.addDependency("promise/thenable.js", ["goog.Thenable"], [], false);
goog.addDependency("proto/proto.js", ["goog.proto"], ["goog.proto.Serializer"], false);
goog.addDependency("proto/serializer.js", ["goog.proto.Serializer"], ["goog.json.Serializer", "goog.string"], false);
goog.addDependency("proto/serializer_test.js", ["goog.protoTest"], ["goog.proto", "goog.testing.jsunit"], false);
goog.addDependency("proto2/descriptor.js", ["goog.proto2.Descriptor", "goog.proto2.Metadata"], ["goog.array", "goog.asserts", "goog.object", "goog.string"], false);
goog.addDependency("proto2/descriptor_test.js", ["goog.proto2.DescriptorTest"], ["goog.proto2.Descriptor", "goog.proto2.Message", "goog.testing.jsunit"], false);
goog.addDependency("proto2/fielddescriptor.js", ["goog.proto2.FieldDescriptor"], ["goog.asserts", "goog.string"], false);
goog.addDependency("proto2/fielddescriptor_test.js", ["goog.proto2.FieldDescriptorTest"], ["goog.proto2.FieldDescriptor", "goog.proto2.Message", "goog.testing.jsunit"], false);
goog.addDependency("proto2/lazydeserializer.js", ["goog.proto2.LazyDeserializer"], ["goog.asserts", "goog.proto2.Message", "goog.proto2.Serializer"], false);
goog.addDependency("proto2/message.js", ["goog.proto2.Message"], ["goog.asserts", "goog.proto2.Descriptor", "goog.proto2.FieldDescriptor"], false);
goog.addDependency("proto2/message_test.js", ["goog.proto2.MessageTest"], ["goog.testing.jsunit", "proto2.TestAllTypes", "proto2.TestAllTypes.NestedEnum", "proto2.TestAllTypes.NestedMessage", "proto2.TestAllTypes.OptionalGroup", "proto2.TestAllTypes.RepeatedGroup"], false);
goog.addDependency("proto2/objectserializer.js", ["goog.proto2.ObjectSerializer"], ["goog.asserts", "goog.proto2.FieldDescriptor", "goog.proto2.Serializer", "goog.string"], false);
goog.addDependency("proto2/objectserializer_test.js", ["goog.proto2.ObjectSerializerTest"], ["goog.proto2.ObjectSerializer", "goog.proto2.Serializer", "goog.testing.PropertyReplacer", "goog.testing.jsunit", "proto2.TestAllTypes"], false);
goog.addDependency("proto2/package_test.pb.js", ["someprotopackage.TestPackageTypes"], ["goog.proto2.Message", "proto2.TestAllTypes"], false);
goog.addDependency("proto2/pbliteserializer.js", ["goog.proto2.PbLiteSerializer"], ["goog.asserts", "goog.proto2.FieldDescriptor", "goog.proto2.LazyDeserializer", "goog.proto2.Serializer"], false);
goog.addDependency("proto2/pbliteserializer_test.js", ["goog.proto2.PbLiteSerializerTest"], ["goog.proto2.PbLiteSerializer", "goog.testing.jsunit", "proto2.TestAllTypes"], false);
goog.addDependency("proto2/proto_test.js", ["goog.proto2.messageTest"], ["goog.proto2.FieldDescriptor", "goog.testing.jsunit", "proto2.TestAllTypes", "someprotopackage.TestPackageTypes"], false);
goog.addDependency("proto2/serializer.js", ["goog.proto2.Serializer"], ["goog.asserts", "goog.proto2.FieldDescriptor", "goog.proto2.Message"], false);
goog.addDependency("proto2/test.pb.js", ["proto2.TestAllTypes", "proto2.TestAllTypes.NestedEnum", "proto2.TestAllTypes.NestedMessage", "proto2.TestAllTypes.OptionalGroup", "proto2.TestAllTypes.RepeatedGroup", "proto2.TestDefaultChild", "proto2.TestDefaultParent"], ["goog.proto2.Message"], false);
goog.addDependency("proto2/textformatserializer.js", ["goog.proto2.TextFormatSerializer"], ["goog.array", "goog.asserts", "goog.json", "goog.math", "goog.object", "goog.proto2.FieldDescriptor", "goog.proto2.Message", "goog.proto2.Serializer", "goog.string"], false);
goog.addDependency("proto2/textformatserializer_test.js", ["goog.proto2.TextFormatSerializerTest"], ["goog.proto2.ObjectSerializer", "goog.proto2.TextFormatSerializer", "goog.testing.jsunit", "proto2.TestAllTypes"], false);
goog.addDependency("proto2/util.js", ["goog.proto2.Util"], ["goog.asserts"], false);
goog.addDependency("pubsub/pubsub.js", ["goog.pubsub.PubSub"], ["goog.Disposable", "goog.array"], false);
goog.addDependency("pubsub/pubsub_test.js", ["goog.pubsub.PubSubTest"], ["goog.array", "goog.pubsub.PubSub", "goog.testing.jsunit"], false);
goog.addDependency("pubsub/topicid.js", ["goog.pubsub.TopicId"], [], false);
goog.addDependency("pubsub/typedpubsub.js", ["goog.pubsub.TypedPubSub"], ["goog.Disposable", "goog.pubsub.PubSub"], false);
goog.addDependency("pubsub/typedpubsub_test.js", ["goog.pubsub.TypedPubSubTest"], ["goog.array", "goog.pubsub.TopicId", "goog.pubsub.TypedPubSub", "goog.testing.jsunit"], false);
goog.addDependency("reflect/reflect.js", ["goog.reflect"], [], false);
goog.addDependency("result/deferredadaptor.js", ["goog.result.DeferredAdaptor"], ["goog.async.Deferred", "goog.result", "goog.result.Result"], false);
goog.addDependency("result/dependentresult.js", ["goog.result.DependentResult"], ["goog.result.Result"], false);
goog.addDependency("result/result_interface.js", ["goog.result.Result"], ["goog.Thenable"], false);
goog.addDependency("result/resultutil.js", ["goog.result"], ["goog.array", "goog.result.DependentResult", "goog.result.Result", "goog.result.SimpleResult"], false);
goog.addDependency("result/simpleresult.js", ["goog.result.SimpleResult", "goog.result.SimpleResult.StateError"], ["goog.Promise", "goog.Thenable", "goog.debug.Error", "goog.result.Result"], false);
goog.addDependency("soy/data.js", ["goog.soy.data.SanitizedContent", "goog.soy.data.SanitizedContentKind"], ["goog.html.SafeHtml", "goog.html.uncheckedconversions", "goog.string.Const"], false);
goog.addDependency("soy/data_test.js", ["goog.soy.dataTest"], ["goog.html.SafeHtml", "goog.soy.testHelper", "goog.testing.jsunit"], false);
goog.addDependency("soy/renderer.js", ["goog.soy.InjectedDataSupplier", "goog.soy.Renderer"], ["goog.asserts", "goog.dom", "goog.soy", "goog.soy.data.SanitizedContent", "goog.soy.data.SanitizedContentKind"], false);
goog.addDependency("soy/renderer_test.js", ["goog.soy.RendererTest"], ["goog.dom", "goog.dom.NodeType", "goog.dom.TagName", "goog.html.SafeHtml", "goog.i18n.bidi.Dir", "goog.soy.Renderer", "goog.soy.data.SanitizedContentKind", "goog.soy.testHelper", "goog.testing.jsunit", "goog.testing.recordFunction"], false);
goog.addDependency("soy/soy.js", ["goog.soy"], ["goog.asserts", "goog.dom", "goog.dom.NodeType", "goog.dom.TagName", "goog.soy.data.SanitizedContent", "goog.soy.data.SanitizedContentKind", "goog.string"], false);
goog.addDependency("soy/soy_test.js", ["goog.soyTest"], ["goog.dom", "goog.dom.NodeType", "goog.dom.TagName", "goog.functions", "goog.soy", "goog.soy.testHelper", "goog.testing.PropertyReplacer", "goog.testing.jsunit"], false);
goog.addDependency("soy/soy_testhelper.js", ["goog.soy.testHelper"], ["goog.dom", "goog.dom.TagName", "goog.i18n.bidi.Dir", "goog.soy.data.SanitizedContent", "goog.soy.data.SanitizedContentKind", "goog.string", "goog.userAgent"], false);
goog.addDependency("spell/spellcheck.js", ["goog.spell.SpellCheck", "goog.spell.SpellCheck.WordChangedEvent"], ["goog.Timer", "goog.events.Event", "goog.events.EventTarget", "goog.structs.Set"], false);
goog.addDependency("spell/spellcheck_test.js", ["goog.spell.SpellCheckTest"], ["goog.spell.SpellCheck", "goog.testing.jsunit"], false);
goog.addDependency("stats/basicstat.js", ["goog.stats.BasicStat"], ["goog.asserts", "goog.log", "goog.string.format", "goog.structs.CircularBuffer"], false);
goog.addDependency("stats/basicstat_test.js", ["goog.stats.BasicStatTest"], ["goog.array", "goog.stats.BasicStat", "goog.string.format", "goog.testing.PseudoRandom", "goog.testing.jsunit", "goog.userAgent"], false);
goog.addDependency("storage/collectablestorage.js", ["goog.storage.CollectableStorage"], ["goog.array", "goog.iter", "goog.storage.ErrorCode", "goog.storage.ExpiringStorage", "goog.storage.RichStorage"], false);
goog.addDependency("storage/collectablestorage_test.js", ["goog.storage.CollectableStorageTest"], ["goog.storage.CollectableStorage", "goog.storage.collectableStorageTester", "goog.storage.storage_test", "goog.testing.MockClock", "goog.testing.jsunit", "goog.testing.storage.FakeMechanism"], false);
goog.addDependency("storage/collectablestoragetester.js", ["goog.storage.collectableStorageTester"], ["goog.testing.asserts"], false);
goog.addDependency("storage/encryptedstorage.js", ["goog.storage.EncryptedStorage"], ["goog.crypt", "goog.crypt.Arc4", "goog.crypt.Sha1", "goog.crypt.base64", "goog.json", "goog.json.Serializer", "goog.storage.CollectableStorage", "goog.storage.ErrorCode", "goog.storage.RichStorage"], false);
goog.addDependency("storage/encryptedstorage_test.js", ["goog.storage.EncryptedStorageTest"], ["goog.json", "goog.storage.EncryptedStorage", "goog.storage.ErrorCode", "goog.storage.RichStorage", "goog.storage.collectableStorageTester", "goog.storage.storage_test", "goog.testing.MockClock", "goog.testing.PseudoRandom", "goog.testing.jsunit", "goog.testing.storage.FakeMechanism"], false);
goog.addDependency("storage/errorcode.js", ["goog.storage.ErrorCode"], [], false);
goog.addDependency("storage/expiringstorage.js", ["goog.storage.ExpiringStorage"], ["goog.storage.RichStorage"], false);
goog.addDependency("storage/expiringstorage_test.js", ["goog.storage.ExpiringStorageTest"], ["goog.storage.ExpiringStorage", "goog.storage.storage_test", "goog.testing.MockClock", "goog.testing.jsunit", "goog.testing.storage.FakeMechanism"], false);
goog.addDependency("storage/mechanism/errorcode.js", ["goog.storage.mechanism.ErrorCode"], [], false);
goog.addDependency("storage/mechanism/errorhandlingmechanism.js", ["goog.storage.mechanism.ErrorHandlingMechanism"], ["goog.storage.mechanism.Mechanism"], false);
goog.addDependency("storage/mechanism/errorhandlingmechanism_test.js", ["goog.storage.mechanism.ErrorHandlingMechanismTest"], ["goog.storage.mechanism.ErrorHandlingMechanism", "goog.testing.jsunit", "goog.testing.recordFunction"], false);
goog.addDependency("storage/mechanism/html5localstorage.js", ["goog.storage.mechanism.HTML5LocalStorage"], ["goog.storage.mechanism.HTML5WebStorage"], false);
goog.addDependency("storage/mechanism/html5localstorage_test.js", ["goog.storage.mechanism.HTML5LocalStorageTest"], ["goog.storage.mechanism.HTML5LocalStorage", "goog.storage.mechanism.mechanismSeparationTester", "goog.storage.mechanism.mechanismSharingTester", "goog.testing.jsunit", "goog.userAgent"], false);
goog.addDependency("storage/mechanism/html5sessionstorage.js", ["goog.storage.mechanism.HTML5SessionStorage"], ["goog.storage.mechanism.HTML5WebStorage"], false);
goog.addDependency("storage/mechanism/html5sessionstorage_test.js", ["goog.storage.mechanism.HTML5SessionStorageTest"], ["goog.storage.mechanism.HTML5SessionStorage", "goog.storage.mechanism.mechanismSeparationTester", "goog.storage.mechanism.mechanismSharingTester", "goog.testing.jsunit", "goog.userAgent"], false);
goog.addDependency("storage/mechanism/html5webstorage.js", ["goog.storage.mechanism.HTML5WebStorage"], ["goog.asserts", "goog.iter.Iterator", "goog.iter.StopIteration", "goog.storage.mechanism.ErrorCode", "goog.storage.mechanism.IterableMechanism"], false);
goog.addDependency("storage/mechanism/html5webstorage_test.js", ["goog.storage.mechanism.HTML5MockStorage", "goog.storage.mechanism.HTML5WebStorageTest", "goog.storage.mechanism.MockThrowableStorage"], ["goog.storage.mechanism.ErrorCode", "goog.storage.mechanism.HTML5WebStorage", "goog.testing.jsunit"], false);
goog.addDependency("storage/mechanism/ieuserdata.js", ["goog.storage.mechanism.IEUserData"], ["goog.asserts", "goog.iter.Iterator", "goog.iter.StopIteration", "goog.storage.mechanism.ErrorCode", "goog.storage.mechanism.IterableMechanism", "goog.structs.Map", "goog.userAgent"], false);
goog.addDependency("storage/mechanism/ieuserdata_test.js", ["goog.storage.mechanism.IEUserDataTest"], ["goog.storage.mechanism.IEUserData", "goog.storage.mechanism.mechanismSeparationTester", "goog.storage.mechanism.mechanismSharingTester", "goog.testing.jsunit", "goog.userAgent"], false);
goog.addDependency("storage/mechanism/iterablemechanism.js", ["goog.storage.mechanism.IterableMechanism"], ["goog.array", "goog.asserts", "goog.iter", "goog.storage.mechanism.Mechanism"], false);
goog.addDependency("storage/mechanism/iterablemechanismtester.js", ["goog.storage.mechanism.iterableMechanismTester"], ["goog.iter.Iterator", "goog.storage.mechanism.IterableMechanism", "goog.testing.asserts"], false);
goog.addDependency("storage/mechanism/mechanism.js", ["goog.storage.mechanism.Mechanism"], [], false);
goog.addDependency("storage/mechanism/mechanismfactory.js", ["goog.storage.mechanism.mechanismfactory"], ["goog.storage.mechanism.HTML5LocalStorage", "goog.storage.mechanism.HTML5SessionStorage", "goog.storage.mechanism.IEUserData", "goog.storage.mechanism.PrefixedMechanism"], false);
goog.addDependency("storage/mechanism/mechanismfactory_test.js", ["goog.storage.mechanism.mechanismfactoryTest"], ["goog.storage.mechanism.mechanismfactory", "goog.testing.jsunit"], false);
goog.addDependency("storage/mechanism/mechanismseparationtester.js", ["goog.storage.mechanism.mechanismSeparationTester"], ["goog.iter.StopIteration", "goog.testing.asserts"], false);
goog.addDependency("storage/mechanism/mechanismsharingtester.js", ["goog.storage.mechanism.mechanismSharingTester"], ["goog.iter.StopIteration", "goog.testing.asserts"], false);
goog.addDependency("storage/mechanism/mechanismtester.js", ["goog.storage.mechanism.mechanismTester"], ["goog.storage.mechanism.ErrorCode", "goog.testing.asserts", "goog.userAgent", "goog.userAgent.product", "goog.userAgent.product.isVersion"], false);
goog.addDependency("storage/mechanism/prefixedmechanism.js", ["goog.storage.mechanism.PrefixedMechanism"], ["goog.iter.Iterator", "goog.storage.mechanism.IterableMechanism"], false);
goog.addDependency("storage/mechanism/prefixedmechanism_test.js", ["goog.storage.mechanism.PrefixedMechanismTest"], ["goog.storage.mechanism.HTML5LocalStorage", "goog.storage.mechanism.PrefixedMechanism", "goog.storage.mechanism.mechanismSeparationTester", "goog.storage.mechanism.mechanismSharingTester", "goog.testing.jsunit"], false);
goog.addDependency("storage/richstorage.js", ["goog.storage.RichStorage", "goog.storage.RichStorage.Wrapper"], ["goog.storage.ErrorCode", "goog.storage.Storage"], false);
goog.addDependency("storage/richstorage_test.js", ["goog.storage.RichStorageTest"], ["goog.storage.ErrorCode", "goog.storage.RichStorage", "goog.storage.storage_test", "goog.testing.jsunit", "goog.testing.storage.FakeMechanism"], false);
goog.addDependency("storage/storage.js", ["goog.storage.Storage"], ["goog.json", "goog.storage.ErrorCode"], false);
goog.addDependency("storage/storage_test.js", ["goog.storage.storage_test"], ["goog.structs.Map", "goog.testing.asserts"], false);
goog.addDependency("string/const.js", ["goog.string.Const"], ["goog.asserts", "goog.string.TypedString"], false);
goog.addDependency("string/const_test.js", ["goog.string.constTest"], ["goog.string.Const", "goog.testing.jsunit"], false);
goog.addDependency("string/linkify.js", ["goog.string.linkify"], ["goog.string"], false);
goog.addDependency("string/linkify_test.js", ["goog.string.linkifyTest"], ["goog.string", "goog.string.linkify", "goog.testing.dom", "goog.testing.jsunit"], false);
goog.addDependency("string/newlines.js", ["goog.string.newlines", "goog.string.newlines.Line"], ["goog.array"], false);
goog.addDependency("string/newlines_test.js", ["goog.string.newlinesTest"], ["goog.string.newlines", "goog.testing.jsunit"], false);
goog.addDependency("string/parser.js", ["goog.string.Parser"], [], false);
goog.addDependency("string/path.js", ["goog.string.path"], ["goog.array", "goog.string"], false);
goog.addDependency("string/path_test.js", ["goog.string.pathTest"], ["goog.string.path", "goog.testing.jsunit"], false);
goog.addDependency("string/string.js", ["goog.string", "goog.string.Unicode"], [], false);
goog.addDependency("string/string_test.js", ["goog.stringTest"], ["goog.functions", "goog.object", "goog.string", "goog.string.Unicode", "goog.testing.MockControl", "goog.testing.PropertyReplacer", "goog.testing.jsunit"], false);
goog.addDependency("string/stringbuffer.js", ["goog.string.StringBuffer"], [], false);
goog.addDependency("string/stringbuffer_test.js", ["goog.string.StringBufferTest"], ["goog.string.StringBuffer", "goog.testing.jsunit"], false);
goog.addDependency("string/stringformat.js", ["goog.string.format"], ["goog.string"], false);
goog.addDependency("string/stringformat_test.js", ["goog.string.formatTest"], ["goog.string.format", "goog.testing.jsunit"], false);
goog.addDependency("string/stringifier.js", ["goog.string.Stringifier"], [], false);
goog.addDependency("string/typedstring.js", ["goog.string.TypedString"], [], false);
goog.addDependency("structs/avltree.js", ["goog.structs.AvlTree", "goog.structs.AvlTree.Node"], ["goog.structs.Collection"], false);
goog.addDependency("structs/avltree_test.js", ["goog.structs.AvlTreeTest"], ["goog.array", "goog.structs.AvlTree", "goog.testing.jsunit"], false);
goog.addDependency("structs/circularbuffer.js", ["goog.structs.CircularBuffer"], [], false);
goog.addDependency("structs/circularbuffer_test.js", ["goog.structs.CircularBufferTest"], ["goog.structs.CircularBuffer", "goog.testing.jsunit"], false);
goog.addDependency("structs/collection.js", ["goog.structs.Collection"], [], false);
goog.addDependency("structs/collection_test.js", ["goog.structs.CollectionTest"], ["goog.structs.AvlTree", "goog.structs.Set", "goog.testing.jsunit"], false);
goog.addDependency("structs/heap.js", ["goog.structs.Heap"], ["goog.array", "goog.object", "goog.structs.Node"], false);
goog.addDependency("structs/heap_test.js", ["goog.structs.HeapTest"], ["goog.structs", "goog.structs.Heap", "goog.testing.jsunit"], false);
goog.addDependency("structs/inversionmap.js", ["goog.structs.InversionMap"], ["goog.array"], false);
goog.addDependency("structs/inversionmap_test.js", ["goog.structs.InversionMapTest"], ["goog.structs.InversionMap", "goog.testing.jsunit"], false);
goog.addDependency("structs/linkedmap.js", ["goog.structs.LinkedMap"], ["goog.structs.Map"], false);
goog.addDependency("structs/linkedmap_test.js", ["goog.structs.LinkedMapTest"], ["goog.structs.LinkedMap", "goog.testing.jsunit", "goog.testing.recordFunction"], false);
goog.addDependency("structs/map.js", ["goog.structs.Map"], ["goog.iter.Iterator", "goog.iter.StopIteration", "goog.object"], false);
goog.addDependency("structs/map_test.js", ["goog.structs.MapTest"], ["goog.iter", "goog.structs", "goog.structs.Map", "goog.testing.jsunit"], false);
goog.addDependency("structs/node.js", ["goog.structs.Node"], [], false);
goog.addDependency("structs/pool.js", ["goog.structs.Pool"], ["goog.Disposable", "goog.structs.Queue", "goog.structs.Set"], false);
goog.addDependency("structs/pool_test.js", ["goog.structs.PoolTest"], ["goog.structs.Pool", "goog.testing.MockClock", "goog.testing.jsunit"], false);
goog.addDependency("structs/prioritypool.js", ["goog.structs.PriorityPool"], ["goog.structs.Pool", "goog.structs.PriorityQueue"], false);
goog.addDependency("structs/prioritypool_test.js", ["goog.structs.PriorityPoolTest"], ["goog.structs.PriorityPool", "goog.testing.MockClock", "goog.testing.jsunit"], false);
goog.addDependency("structs/priorityqueue.js", ["goog.structs.PriorityQueue"], ["goog.structs.Heap"], false);
goog.addDependency("structs/priorityqueue_test.js", ["goog.structs.PriorityQueueTest"], ["goog.structs", "goog.structs.PriorityQueue", "goog.testing.jsunit"], false);
goog.addDependency("structs/quadtree.js", ["goog.structs.QuadTree", "goog.structs.QuadTree.Node", "goog.structs.QuadTree.Point"], ["goog.math.Coordinate"], false);
goog.addDependency("structs/quadtree_test.js", ["goog.structs.QuadTreeTest"], ["goog.structs", "goog.structs.QuadTree", "goog.testing.jsunit"], false);
goog.addDependency("structs/queue.js", ["goog.structs.Queue"], ["goog.array"], false);
goog.addDependency("structs/queue_test.js", ["goog.structs.QueueTest"], ["goog.structs.Queue", "goog.testing.jsunit"], false);
goog.addDependency("structs/set.js", ["goog.structs.Set"], ["goog.structs", "goog.structs.Collection", "goog.structs.Map"], false);
goog.addDependency("structs/set_test.js", ["goog.structs.SetTest"], ["goog.iter", "goog.structs", "goog.structs.Set", "goog.testing.jsunit"], false);
goog.addDependency("structs/simplepool.js", ["goog.structs.SimplePool"], ["goog.Disposable"], false);
goog.addDependency("structs/stringset.js", ["goog.structs.StringSet"], ["goog.asserts", "goog.iter"], false);
goog.addDependency("structs/stringset_test.js", ["goog.structs.StringSetTest"], ["goog.array", "goog.iter", "goog.structs.StringSet", "goog.testing.asserts", "goog.testing.jsunit"], false);
goog.addDependency("structs/structs.js", ["goog.structs"], ["goog.array", "goog.object"], false);
goog.addDependency("structs/structs_test.js", ["goog.structsTest"], ["goog.array", "goog.structs", "goog.structs.Map", "goog.structs.Set", "goog.testing.jsunit"], false);
goog.addDependency("structs/treenode.js", ["goog.structs.TreeNode"], ["goog.array", "goog.asserts", "goog.structs.Node"], false);
goog.addDependency("structs/treenode_test.js", ["goog.structs.TreeNodeTest"], ["goog.structs.TreeNode", "goog.testing.jsunit"], false);
goog.addDependency("structs/trie.js", ["goog.structs.Trie"], ["goog.object", "goog.structs"], false);
goog.addDependency("structs/trie_test.js", ["goog.structs.TrieTest"], ["goog.object", "goog.structs", "goog.structs.Trie", "goog.testing.jsunit"], false);
goog.addDependency("structs/weak/weak.js", ["goog.structs.weak"], ["goog.userAgent"], false);
goog.addDependency("structs/weak/weak_test.js", ["goog.structs.weakTest"], ["goog.array", "goog.structs.weak", "goog.testing.jsunit"], false);
goog.addDependency("style/bidi.js", ["goog.style.bidi"], ["goog.dom", "goog.style", "goog.userAgent"], false);
goog.addDependency("style/bidi_test.js", ["goog.style.bidiTest"], ["goog.dom", "goog.style", "goog.style.bidi", "goog.testing.jsunit", "goog.userAgent"], false);
goog.addDependency("style/cursor.js", ["goog.style.cursor"], ["goog.userAgent"], false);
goog.addDependency("style/cursor_test.js", ["goog.style.cursorTest"], ["goog.style.cursor", "goog.testing.jsunit", "goog.userAgent"], false);
goog.addDependency("style/style.js", ["goog.style"], ["goog.array", "goog.asserts", "goog.dom", "goog.dom.NodeType", "goog.dom.vendor", "goog.math.Box", "goog.math.Coordinate", "goog.math.Rect", "goog.math.Size", "goog.object", "goog.string", "goog.userAgent"], false);
goog.addDependency("style/style_test.js", ["goog.style_test"], ["goog.array", "goog.color", "goog.dom", "goog.events.BrowserEvent", "goog.labs.userAgent.util", "goog.math.Box", "goog.math.Coordinate", "goog.math.Rect", "goog.math.Size", "goog.object", "goog.string", "goog.style", "goog.testing.ExpectedFailures", "goog.testing.MockUserAgent", "goog.testing.asserts", "goog.testing.jsunit", "goog.userAgent", "goog.userAgent.product", "goog.userAgentTestUtil", "goog.userAgentTestUtil.UserAgents"], false);
goog.addDependency("style/style_webkit_scrollbars_test.js", ["goog.style.webkitScrollbarsTest"], ["goog.asserts", "goog.style", "goog.styleScrollbarTester", "goog.testing.ExpectedFailures", "goog.testing.jsunit", "goog.userAgent"], false);
goog.addDependency("style/stylescrollbartester.js", ["goog.styleScrollbarTester"], ["goog.dom", "goog.style", "goog.testing.asserts"], false);
goog.addDependency("style/transform.js", ["goog.style.transform"], ["goog.functions", "goog.math.Coordinate", "goog.math.Coordinate3", "goog.style", "goog.userAgent", "goog.userAgent.product.isVersion"], false);
goog.addDependency("style/transform_test.js", ["goog.style.transformTest"], ["goog.dom", "goog.style.transform", "goog.testing.jsunit", "goog.userAgent", "goog.userAgent.product.isVersion"], false);
goog.addDependency("style/transition.js", ["goog.style.transition", "goog.style.transition.Css3Property"], ["goog.array", "goog.asserts", "goog.dom.safe", "goog.dom.vendor", "goog.functions", "goog.html.SafeHtml", "goog.style", "goog.userAgent"], false);
goog.addDependency("style/transition_test.js", ["goog.style.transitionTest"], ["goog.style", "goog.style.transition", "goog.testing.jsunit", "goog.userAgent"], false);
goog.addDependency("test_module.js", ["goog.test_module"], ["goog.test_module_dep"], true);
goog.addDependency("test_module_dep.js", ["goog.test_module_dep"], [], true);
goog.addDependency("testing/asserts.js", ["goog.testing.JsUnitException", "goog.testing.asserts", "goog.testing.asserts.ArrayLike"], ["goog.testing.stacktrace"], false);
goog.addDependency("testing/asserts_test.js", ["goog.testing.assertsTest"], ["goog.array", "goog.dom", "goog.iter.Iterator", "goog.iter.StopIteration", "goog.labs.userAgent.browser", "goog.string", "goog.structs.Map", "goog.structs.Set", "goog.testing.asserts", "goog.testing.jsunit", "goog.userAgent"], false);
goog.addDependency("testing/async/mockcontrol.js", ["goog.testing.async.MockControl"], ["goog.asserts", "goog.async.Deferred", "goog.debug", "goog.testing.asserts", "goog.testing.mockmatchers.IgnoreArgument"], false);
goog.addDependency("testing/async/mockcontrol_test.js", ["goog.testing.async.MockControlTest"], ["goog.async.Deferred", "goog.testing.MockControl", "goog.testing.asserts", "goog.testing.async.MockControl", "goog.testing.jsunit"], false);
goog.addDependency("testing/asynctestcase.js", ["goog.testing.AsyncTestCase", "goog.testing.AsyncTestCase.ControlBreakingException"], ["goog.testing.TestCase", "goog.testing.asserts"], false);
goog.addDependency("testing/asynctestcase_async_test.js", ["goog.testing.AsyncTestCaseAsyncTest"], ["goog.testing.AsyncTestCase", "goog.testing.jsunit"], false);
goog.addDependency("testing/asynctestcase_noasync_test.js", ["goog.testing.AsyncTestCaseSyncTest"], ["goog.testing.AsyncTestCase", "goog.testing.jsunit"], false);
goog.addDependency("testing/asynctestcase_test.js", ["goog.testing.AsyncTestCaseTest"], ["goog.debug.Error", "goog.testing.AsyncTestCase", "goog.testing.asserts", "goog.testing.jsunit"], false);
goog.addDependency("testing/benchmark.js", ["goog.testing.benchmark"], ["goog.dom", "goog.dom.TagName", "goog.testing.PerformanceTable", "goog.testing.PerformanceTimer", "goog.testing.TestCase"], false);
goog.addDependency("testing/continuationtestcase.js", ["goog.testing.ContinuationTestCase", "goog.testing.ContinuationTestCase.Step", "goog.testing.ContinuationTestCase.Test"], ["goog.array", "goog.events.EventHandler", "goog.testing.TestCase", "goog.testing.asserts"], false);
goog.addDependency("testing/continuationtestcase_test.js", ["goog.testing.ContinuationTestCaseTest"], ["goog.events", "goog.events.EventTarget", "goog.testing.ContinuationTestCase", "goog.testing.MockClock", "goog.testing.PropertyReplacer", "goog.testing.TestCase", "goog.testing.jsunit"], false);
goog.addDependency("testing/deferredtestcase.js", ["goog.testing.DeferredTestCase"], ["goog.testing.AsyncTestCase", "goog.testing.TestCase"], false);
goog.addDependency("testing/deferredtestcase_test.js", ["goog.testing.DeferredTestCaseTest"], ["goog.async.Deferred", "goog.testing.DeferredTestCase", "goog.testing.TestCase", "goog.testing.TestRunner", "goog.testing.jsunit", "goog.testing.recordFunction"], false);
goog.addDependency("testing/dom.js", ["goog.testing.dom"], ["goog.array", "goog.asserts", "goog.dom", "goog.dom.NodeIterator", "goog.dom.NodeType", "goog.dom.TagIterator", "goog.dom.TagName", "goog.dom.classlist", "goog.iter", "goog.object", "goog.string", "goog.style", "goog.testing.asserts", "goog.userAgent"], false);
goog.addDependency("testing/dom_test.js", ["goog.testing.domTest"], ["goog.dom", "goog.dom.TagName", "goog.testing.dom", "goog.testing.jsunit", "goog.userAgent"], false);
goog.addDependency("testing/editor/dom.js", ["goog.testing.editor.dom"], ["goog.dom.NodeType", "goog.dom.TagIterator", "goog.dom.TagWalkType", "goog.iter", "goog.string", "goog.testing.asserts"], false);
goog.addDependency("testing/editor/dom_test.js", ["goog.testing.editor.domTest"], ["goog.dom", "goog.dom.TagName", "goog.functions", "goog.testing.editor.dom", "goog.testing.jsunit"], false);
goog.addDependency("testing/editor/fieldmock.js", ["goog.testing.editor.FieldMock"], ["goog.dom", "goog.dom.Range", "goog.editor.Field", "goog.testing.LooseMock", "goog.testing.mockmatchers"], false);
goog.addDependency("testing/editor/testhelper.js", ["goog.testing.editor.TestHelper"], ["goog.Disposable", "goog.dom", "goog.dom.Range", "goog.editor.BrowserFeature", "goog.editor.node", "goog.editor.plugins.AbstractBubblePlugin", "goog.testing.dom"], false);
goog.addDependency("testing/editor/testhelper_test.js", ["goog.testing.editor.TestHelperTest"], ["goog.dom", "goog.dom.TagName", "goog.editor.node", "goog.testing.editor.TestHelper", "goog.testing.jsunit", "goog.userAgent"], false);
goog.addDependency("testing/events/eventobserver.js", ["goog.testing.events.EventObserver"], ["goog.array"], false);
goog.addDependency("testing/events/eventobserver_test.js", ["goog.testing.events.EventObserverTest"], ["goog.array", "goog.events", "goog.events.Event", "goog.events.EventTarget", "goog.testing.events.EventObserver", "goog.testing.jsunit"], false);
goog.addDependency("testing/events/events.js", ["goog.testing.events", "goog.testing.events.Event"], ["goog.Disposable", "goog.asserts", "goog.dom.NodeType", "goog.events", "goog.events.BrowserEvent", "goog.events.BrowserFeature", "goog.events.EventTarget", "goog.events.EventType", "goog.events.KeyCodes", "goog.object", "goog.style", "goog.userAgent"], false);
goog.addDependency("testing/events/events_test.js", ["goog.testing.eventsTest"], ["goog.array", "goog.dom", "goog.events", "goog.events.EventType", "goog.events.KeyCodes", "goog.math.Coordinate", "goog.string", "goog.style", "goog.testing.PropertyReplacer", "goog.testing.events", "goog.testing.jsunit", "goog.testing.recordFunction", "goog.userAgent"], false);
goog.addDependency("testing/events/matchers.js", ["goog.testing.events.EventMatcher"], ["goog.events.Event", "goog.testing.mockmatchers.ArgumentMatcher"], false);
goog.addDependency("testing/events/matchers_test.js", ["goog.testing.events.EventMatcherTest"], ["goog.events.Event", "goog.testing.events.EventMatcher", "goog.testing.jsunit"], false);
goog.addDependency("testing/events/onlinehandler.js", ["goog.testing.events.OnlineHandler"], ["goog.events.EventTarget", "goog.net.NetworkStatusMonitor"], false);
goog.addDependency("testing/events/onlinehandler_test.js", ["goog.testing.events.OnlineHandlerTest"], ["goog.events", "goog.net.NetworkStatusMonitor", "goog.testing.events.EventObserver", "goog.testing.events.OnlineHandler", "goog.testing.jsunit"], false);
goog.addDependency("testing/expectedfailures.js", ["goog.testing.ExpectedFailures"], ["goog.debug.DivConsole", "goog.dom", "goog.dom.TagName", "goog.events", "goog.events.EventType", "goog.log", "goog.style", "goog.testing.JsUnitException", "goog.testing.TestCase", "goog.testing.asserts"], false);
goog.addDependency("testing/expectedfailures_test.js", ["goog.testing.ExpectedFailuresTest"], ["goog.debug.Logger", "goog.testing.ExpectedFailures", "goog.testing.JsUnitException", "goog.testing.jsunit"], false);
goog.addDependency("testing/fs/blob.js", ["goog.testing.fs.Blob"], ["goog.crypt.base64"], false);
goog.addDependency("testing/fs/blob_test.js", ["goog.testing.fs.BlobTest"], ["goog.testing.fs.Blob", "goog.testing.jsunit"], false);
goog.addDependency("testing/fs/directoryentry_test.js", ["goog.testing.fs.DirectoryEntryTest"], ["goog.array", "goog.fs.DirectoryEntry", "goog.fs.Error", "goog.testing.AsyncTestCase", "goog.testing.MockClock", "goog.testing.fs.FileSystem", "goog.testing.jsunit"], false);
goog.addDependency("testing/fs/entry.js", ["goog.testing.fs.DirectoryEntry", "goog.testing.fs.Entry", "goog.testing.fs.FileEntry"], ["goog.Timer", "goog.array", "goog.asserts", "goog.async.Deferred", "goog.fs.DirectoryEntry", "goog.fs.DirectoryEntryImpl", "goog.fs.Entry", "goog.fs.Error", "goog.fs.FileEntry", "goog.functions", "goog.object", "goog.string", "goog.testing.fs.File", "goog.testing.fs.FileWriter"], false);
goog.addDependency("testing/fs/entry_test.js", ["goog.testing.fs.EntryTest"], ["goog.fs.DirectoryEntry", "goog.fs.Error", "goog.testing.AsyncTestCase", "goog.testing.MockClock", "goog.testing.fs.FileSystem", "goog.testing.jsunit"], false);
goog.addDependency("testing/fs/file.js", ["goog.testing.fs.File"], ["goog.testing.fs.Blob"], false);
goog.addDependency("testing/fs/fileentry_test.js", ["goog.testing.fs.FileEntryTest"], ["goog.testing.AsyncTestCase", "goog.testing.MockClock", "goog.testing.fs.FileEntry", "goog.testing.fs.FileSystem", "goog.testing.jsunit"], false);
goog.addDependency("testing/fs/filereader.js", ["goog.testing.fs.FileReader"], ["goog.Timer", "goog.events.EventTarget", "goog.fs.Error", "goog.fs.FileReader", "goog.testing.fs.ProgressEvent"], false);
goog.addDependency("testing/fs/filereader_test.js", ["goog.testing.fs.FileReaderTest"], ["goog.Timer", "goog.async.Deferred", "goog.events", "goog.fs.Error", "goog.fs.FileReader", "goog.fs.FileSaver", "goog.testing.AsyncTestCase", "goog.testing.fs.FileReader", "goog.testing.fs.FileSystem", "goog.testing.jsunit"], false);
goog.addDependency("testing/fs/filesystem.js", ["goog.testing.fs.FileSystem"], ["goog.fs.FileSystem", "goog.testing.fs.DirectoryEntry"], false);
goog.addDependency("testing/fs/filewriter.js", ["goog.testing.fs.FileWriter"], ["goog.Timer", "goog.events.EventTarget", "goog.fs.Error", "goog.fs.FileSaver", "goog.string", "goog.testing.fs.ProgressEvent"], false);
goog.addDependency("testing/fs/filewriter_test.js", ["goog.testing.fs.FileWriterTest"], ["goog.async.Deferred", "goog.events", "goog.fs.Error", "goog.fs.FileSaver", "goog.testing.AsyncTestCase", "goog.testing.MockClock", "goog.testing.fs.Blob", "goog.testing.fs.FileSystem", "goog.testing.jsunit"], false);
goog.addDependency("testing/fs/fs.js", ["goog.testing.fs"], ["goog.Timer", "goog.array", "goog.async.Deferred", "goog.fs", "goog.testing.fs.Blob", "goog.testing.fs.FileSystem"], false);
goog.addDependency("testing/fs/fs_test.js", ["goog.testing.fsTest"], ["goog.testing.AsyncTestCase", "goog.testing.fs", "goog.testing.fs.Blob", "goog.testing.jsunit"], false);
goog.addDependency("testing/fs/integration_test.js", ["goog.testing.fs.integrationTest"], ["goog.async.Deferred", "goog.async.DeferredList", "goog.events", "goog.fs", "goog.fs.DirectoryEntry", "goog.fs.Error", "goog.fs.FileSaver", "goog.testing.AsyncTestCase", "goog.testing.PropertyReplacer", "goog.testing.fs", "goog.testing.jsunit"], false);
goog.addDependency("testing/fs/progressevent.js", ["goog.testing.fs.ProgressEvent"], ["goog.events.Event"], false);
goog.addDependency("testing/functionmock.js", ["goog.testing", "goog.testing.FunctionMock", "goog.testing.GlobalFunctionMock", "goog.testing.MethodMock"], ["goog.object", "goog.testing.LooseMock", "goog.testing.Mock", "goog.testing.PropertyReplacer", "goog.testing.StrictMock"], false);
goog.addDependency("testing/functionmock_test.js", ["goog.testing.FunctionMockTest"], ["goog.array", "goog.string", "goog.testing", "goog.testing.FunctionMock", "goog.testing.Mock", "goog.testing.StrictMock", "goog.testing.asserts", "goog.testing.jsunit", "goog.testing.mockmatchers"], false);
goog.addDependency("testing/graphics.js", ["goog.testing.graphics"], ["goog.graphics.Path", "goog.testing.asserts"], false);
goog.addDependency("testing/i18n/asserts.js", ["goog.testing.i18n.asserts"], ["goog.testing.jsunit"], false);
goog.addDependency("testing/i18n/asserts_test.js", ["goog.testing.i18n.assertsTest"], ["goog.testing.ExpectedFailures", "goog.testing.i18n.asserts"], false);
goog.addDependency("testing/jsunit.js", ["goog.testing.jsunit"], ["goog.testing.TestCase", "goog.testing.TestRunner"], false);
goog.addDependency("testing/loosemock.js", ["goog.testing.LooseExpectationCollection", "goog.testing.LooseMock"], ["goog.array", "goog.structs.Map", "goog.testing.Mock"], false);
goog.addDependency("testing/loosemock_test.js", ["goog.testing.LooseMockTest"], ["goog.testing.LooseMock", "goog.testing.PropertyReplacer", "goog.testing.jsunit", "goog.testing.mockmatchers"], false);
goog.addDependency("testing/messaging/mockmessagechannel.js", ["goog.testing.messaging.MockMessageChannel"], ["goog.messaging.AbstractChannel", "goog.testing.asserts"], false);
goog.addDependency("testing/messaging/mockmessageevent.js", ["goog.testing.messaging.MockMessageEvent"], ["goog.events.BrowserEvent", "goog.events.EventType", "goog.testing.events.Event"], false);
goog.addDependency("testing/messaging/mockmessageport.js", ["goog.testing.messaging.MockMessagePort"], ["goog.events.EventTarget"], false);
goog.addDependency("testing/messaging/mockportnetwork.js", ["goog.testing.messaging.MockPortNetwork"], ["goog.messaging.PortNetwork", "goog.testing.messaging.MockMessageChannel"], false);
goog.addDependency("testing/mock.js", ["goog.testing.Mock", "goog.testing.MockExpectation"], ["goog.array", "goog.object", "goog.testing.JsUnitException", "goog.testing.MockInterface", "goog.testing.mockmatchers"], false);
goog.addDependency("testing/mock_test.js", ["goog.testing.MockTest"], ["goog.array", "goog.testing", "goog.testing.Mock", "goog.testing.MockControl", "goog.testing.MockExpectation", "goog.testing.jsunit"], false);
goog.addDependency("testing/mockclassfactory.js", ["goog.testing.MockClassFactory", "goog.testing.MockClassRecord"], ["goog.array", "goog.object", "goog.testing.LooseMock", "goog.testing.StrictMock", "goog.testing.TestCase", "goog.testing.mockmatchers"], false);
goog.addDependency("testing/mockclassfactory_test.js", ["fake.BaseClass", "fake.ChildClass", "goog.testing.MockClassFactoryTest"], ["goog.testing", "goog.testing.MockClassFactory", "goog.testing.jsunit"], false);
goog.addDependency("testing/mockclock.js", ["goog.testing.MockClock"], ["goog.Disposable", "goog.async.run", "goog.testing.PropertyReplacer", "goog.testing.events", "goog.testing.events.Event", "goog.testing.watchers"], false);
goog.addDependency("testing/mockclock_test.js", ["goog.testing.MockClockTest"], ["goog.Promise", "goog.Timer", "goog.events", "goog.functions", "goog.testing.MockClock", "goog.testing.PropertyReplacer", "goog.testing.jsunit", "goog.testing.recordFunction"], false);
goog.addDependency("testing/mockcontrol.js", ["goog.testing.MockControl"], ["goog.array", "goog.testing", "goog.testing.LooseMock", "goog.testing.StrictMock"], false);
goog.addDependency("testing/mockcontrol_test.js", ["goog.testing.MockControlTest"], ["goog.testing.Mock", "goog.testing.MockControl", "goog.testing.jsunit"], false);
goog.addDependency("testing/mockinterface.js", ["goog.testing.MockInterface"], [], false);
goog.addDependency("testing/mockmatchers.js", ["goog.testing.mockmatchers", "goog.testing.mockmatchers.ArgumentMatcher", "goog.testing.mockmatchers.IgnoreArgument", "goog.testing.mockmatchers.InstanceOf", "goog.testing.mockmatchers.ObjectEquals", "goog.testing.mockmatchers.RegexpMatch", "goog.testing.mockmatchers.SaveArgument", "goog.testing.mockmatchers.TypeOf"], ["goog.array", "goog.dom", "goog.testing.asserts"], false);
goog.addDependency("testing/mockmatchers_test.js", ["goog.testing.mockmatchersTest"], ["goog.dom", "goog.testing.jsunit", "goog.testing.mockmatchers", "goog.testing.mockmatchers.ArgumentMatcher"], false);
goog.addDependency("testing/mockrandom.js", ["goog.testing.MockRandom"], ["goog.Disposable"], false);
goog.addDependency("testing/mockrandom_test.js", ["goog.testing.MockRandomTest"], ["goog.testing.MockRandom", "goog.testing.jsunit"], false);
goog.addDependency("testing/mockrange.js", ["goog.testing.MockRange"], ["goog.dom.AbstractRange", "goog.testing.LooseMock"], false);
goog.addDependency("testing/mockrange_test.js", ["goog.testing.MockRangeTest"], ["goog.testing.MockRange", "goog.testing.jsunit"], false);
goog.addDependency("testing/mockstorage.js", ["goog.testing.MockStorage"], ["goog.structs.Map"], false);
goog.addDependency("testing/mockstorage_test.js", ["goog.testing.MockStorageTest"], ["goog.testing.MockStorage", "goog.testing.jsunit"], false);
goog.addDependency("testing/mockuseragent.js", ["goog.testing.MockUserAgent"], ["goog.Disposable", "goog.labs.userAgent.util", "goog.testing.PropertyReplacer", "goog.userAgent"], false);
goog.addDependency("testing/mockuseragent_test.js", ["goog.testing.MockUserAgentTest"], ["goog.dispose", "goog.testing.MockUserAgent", "goog.testing.jsunit", "goog.userAgent"], false);
goog.addDependency("testing/multitestrunner.js", ["goog.testing.MultiTestRunner", "goog.testing.MultiTestRunner.TestFrame"], ["goog.Timer", "goog.array", "goog.asserts", "goog.dom", "goog.dom.classlist", "goog.events.EventHandler", "goog.functions", "goog.string", "goog.ui.Component", "goog.ui.ServerChart", "goog.ui.TableSorter"], false);
goog.addDependency("testing/net/xhrio.js", ["goog.testing.net.XhrIo"], ["goog.array", "goog.dom.xml", "goog.events", "goog.events.EventTarget", "goog.json", "goog.net.ErrorCode", "goog.net.EventType", "goog.net.HttpStatus", "goog.net.XhrIo", "goog.net.XmlHttp", "goog.object", "goog.structs.Map"], false);
goog.addDependency("testing/net/xhrio_test.js", ["goog.testing.net.XhrIoTest"], ["goog.dom.xml", "goog.events", "goog.events.Event", "goog.net.ErrorCode", "goog.net.EventType", "goog.net.XmlHttp", "goog.object", "goog.testing.MockControl", "goog.testing.asserts", "goog.testing.jsunit", "goog.testing.mockmatchers.InstanceOf", "goog.testing.net.XhrIo"], false);
goog.addDependency("testing/net/xhriopool.js", ["goog.testing.net.XhrIoPool"], ["goog.net.XhrIoPool", "goog.testing.net.XhrIo"], false);
goog.addDependency("testing/objectpropertystring.js", ["goog.testing.ObjectPropertyString"], [], false);
goog.addDependency("testing/performancetable.js", ["goog.testing.PerformanceTable"], ["goog.dom", "goog.dom.TagName", "goog.testing.PerformanceTimer"], false);
goog.addDependency("testing/performancetimer.js", ["goog.testing.PerformanceTimer", "goog.testing.PerformanceTimer.Task"], ["goog.array", "goog.async.Deferred", "goog.math"], false);
goog.addDependency("testing/performancetimer_test.js", ["goog.testing.PerformanceTimerTest"], ["goog.async.Deferred", "goog.dom", "goog.math", "goog.testing.MockClock", "goog.testing.PerformanceTimer", "goog.testing.jsunit"], false);
goog.addDependency("testing/propertyreplacer.js", ["goog.testing.PropertyReplacer"], ["goog.testing.ObjectPropertyString", "goog.userAgent"], false);
goog.addDependency("testing/propertyreplacer_test.js", ["goog.testing.PropertyReplacerTest"], ["goog.testing.PropertyReplacer", "goog.testing.asserts", "goog.testing.jsunit"], false);
goog.addDependency("testing/proto2/proto2.js", ["goog.testing.proto2"], ["goog.proto2.Message", "goog.proto2.ObjectSerializer", "goog.testing.asserts"], false);
goog.addDependency("testing/proto2/proto2_test.js", ["goog.testing.proto2Test"], ["goog.testing.jsunit", "goog.testing.proto2", "proto2.TestAllTypes"], false);
goog.addDependency("testing/pseudorandom.js", ["goog.testing.PseudoRandom"], ["goog.Disposable"], false);
goog.addDependency("testing/pseudorandom_test.js", ["goog.testing.PseudoRandomTest"], ["goog.testing.PseudoRandom", "goog.testing.jsunit"], false);
goog.addDependency("testing/recordfunction.js", ["goog.testing.FunctionCall", "goog.testing.recordConstructor", "goog.testing.recordFunction"], ["goog.testing.asserts"], false);
goog.addDependency("testing/recordfunction_test.js", ["goog.testing.recordFunctionTest"], ["goog.functions", "goog.testing.PropertyReplacer", "goog.testing.jsunit", "goog.testing.recordConstructor", "goog.testing.recordFunction"], false);
goog.addDependency("testing/shardingtestcase.js", ["goog.testing.ShardingTestCase"], ["goog.asserts", "goog.testing.TestCase"], false);
goog.addDependency("testing/shardingtestcase_test.js", ["goog.testing.ShardingTestCaseTest"], ["goog.testing.ShardingTestCase", "goog.testing.TestCase", "goog.testing.asserts", "goog.testing.jsunit"], false);
goog.addDependency("testing/singleton.js", ["goog.testing.singleton"], [], false);
goog.addDependency("testing/singleton_test.js", ["goog.testing.singletonTest"], ["goog.testing.asserts", "goog.testing.jsunit", "goog.testing.singleton"], false);
goog.addDependency("testing/stacktrace.js", ["goog.testing.stacktrace", "goog.testing.stacktrace.Frame"], [], false);
goog.addDependency("testing/stacktrace_test.js", ["goog.testing.stacktraceTest"], ["goog.functions", "goog.string", "goog.testing.ExpectedFailures", "goog.testing.PropertyReplacer", "goog.testing.StrictMock", "goog.testing.asserts", "goog.testing.jsunit", "goog.testing.stacktrace", "goog.testing.stacktrace.Frame", "goog.userAgent"], false);
goog.addDependency("testing/storage/fakemechanism.js", ["goog.testing.storage.FakeMechanism"], ["goog.storage.mechanism.IterableMechanism", "goog.structs.Map"], false);
goog.addDependency("testing/strictmock.js", ["goog.testing.StrictMock"], ["goog.array", "goog.testing.Mock"], false);
goog.addDependency("testing/strictmock_test.js", ["goog.testing.StrictMockTest"], ["goog.testing.StrictMock", "goog.testing.jsunit"], false);
goog.addDependency("testing/style/layoutasserts.js", ["goog.testing.style.layoutasserts"], ["goog.style", "goog.testing.asserts", "goog.testing.style"], false);
goog.addDependency("testing/style/layoutasserts_test.js", ["goog.testing.style.layoutassertsTest"], ["goog.dom", "goog.style", "goog.testing.jsunit", "goog.testing.style.layoutasserts"], false);
goog.addDependency("testing/style/style.js", ["goog.testing.style"], ["goog.dom", "goog.math.Rect", "goog.style"], false);
goog.addDependency("testing/style/style_test.js", ["goog.testing.styleTest"], ["goog.dom", "goog.style", "goog.testing.jsunit", "goog.testing.style"], false);
goog.addDependency("testing/testcase.js", ["goog.testing.TestCase", "goog.testing.TestCase.Error", "goog.testing.TestCase.Order", "goog.testing.TestCase.Result", "goog.testing.TestCase.Test"], ["goog.object", "goog.testing.asserts", "goog.testing.stacktrace"], false);
goog.addDependency("testing/testcase_test.js", ["goog.testing.TestCaseTest"], ["goog.testing.TestCase", "goog.testing.jsunit"], false);
goog.addDependency("testing/testqueue.js", ["goog.testing.TestQueue"], [], false);
goog.addDependency("testing/testrunner.js", ["goog.testing.TestRunner"], ["goog.testing.TestCase"], false);
goog.addDependency("testing/ui/rendererasserts.js", ["goog.testing.ui.rendererasserts"], ["goog.testing.asserts"], false);
goog.addDependency("testing/ui/rendererasserts_test.js", ["goog.testing.ui.rendererassertsTest"], ["goog.testing.asserts", "goog.testing.jsunit", "goog.testing.ui.rendererasserts", "goog.ui.ControlRenderer"], false);
goog.addDependency("testing/ui/rendererharness.js", ["goog.testing.ui.RendererHarness"], ["goog.Disposable", "goog.dom.NodeType", "goog.testing.asserts", "goog.testing.dom"], false);
goog.addDependency("testing/ui/style.js", ["goog.testing.ui.style"], ["goog.array", "goog.asserts", "goog.dom", "goog.dom.classlist", "goog.testing.asserts"], false);
goog.addDependency("testing/ui/style_test.js", ["goog.testing.ui.styleTest"], ["goog.dom", "goog.testing.jsunit", "goog.testing.ui.style"], false);
goog.addDependency("testing/watchers.js", ["goog.testing.watchers"], [], false);
goog.addDependency("timer/timer.js", ["goog.Timer"], ["goog.Promise", "goog.events.EventTarget"], false);
goog.addDependency("timer/timer_test.js", ["goog.TimerTest"], ["goog.Promise", "goog.Timer", "goog.events", "goog.testing.MockClock", "goog.testing.jsunit"], false);
goog.addDependency("tweak/entries.js", ["goog.tweak.BaseEntry", "goog.tweak.BasePrimitiveSetting", "goog.tweak.BaseSetting", "goog.tweak.BooleanGroup", "goog.tweak.BooleanInGroupSetting", "goog.tweak.BooleanSetting", "goog.tweak.ButtonAction", "goog.tweak.NumericSetting", "goog.tweak.StringSetting"], ["goog.array", "goog.asserts", "goog.log", "goog.object"], false);
goog.addDependency("tweak/entries_test.js", ["goog.tweak.BaseEntryTest"], ["goog.testing.MockControl", "goog.testing.jsunit", "goog.tweak.testhelpers"], false);
goog.addDependency("tweak/registry.js", ["goog.tweak.Registry"], ["goog.array", "goog.asserts", "goog.log", "goog.string", "goog.tweak.BasePrimitiveSetting", "goog.tweak.BaseSetting", "goog.tweak.BooleanSetting", "goog.tweak.NumericSetting", "goog.tweak.StringSetting", "goog.uri.utils"], false);
goog.addDependency("tweak/registry_test.js", ["goog.tweak.RegistryTest"], ["goog.asserts.AssertionError", "goog.testing.jsunit", "goog.tweak", "goog.tweak.testhelpers"], false);
goog.addDependency("tweak/testhelpers.js", ["goog.tweak.testhelpers"], ["goog.tweak", "goog.tweak.BooleanGroup", "goog.tweak.BooleanInGroupSetting", "goog.tweak.BooleanSetting", "goog.tweak.ButtonAction", "goog.tweak.NumericSetting", "goog.tweak.Registry", "goog.tweak.StringSetting"], false);
goog.addDependency("tweak/tweak.js", ["goog.tweak", "goog.tweak.ConfigParams"], ["goog.asserts", "goog.tweak.BaseSetting", "goog.tweak.BooleanGroup", "goog.tweak.BooleanInGroupSetting", "goog.tweak.BooleanSetting", "goog.tweak.ButtonAction", "goog.tweak.NumericSetting", "goog.tweak.Registry", "goog.tweak.StringSetting"], false);
goog.addDependency("tweak/tweakui.js", ["goog.tweak.EntriesPanel", "goog.tweak.TweakUi"], ["goog.array", "goog.asserts", "goog.dom", "goog.object", "goog.style", "goog.tweak", "goog.tweak.BaseEntry", "goog.tweak.BooleanGroup", "goog.tweak.BooleanInGroupSetting", "goog.tweak.BooleanSetting", "goog.tweak.ButtonAction", "goog.tweak.NumericSetting", "goog.tweak.StringSetting", "goog.ui.Zippy", "goog.userAgent"], false);
goog.addDependency("tweak/tweakui_test.js", ["goog.tweak.TweakUiTest"], ["goog.dom", "goog.string", "goog.testing.jsunit", "goog.tweak", "goog.tweak.TweakUi", "goog.tweak.testhelpers"], false);
goog.addDependency("ui/abstractspellchecker.js", ["goog.ui.AbstractSpellChecker", "goog.ui.AbstractSpellChecker.AsyncResult"], ["goog.a11y.aria", "goog.array", "goog.asserts", "goog.dom", "goog.dom.NodeType", "goog.dom.classlist", "goog.dom.selection", "goog.events", "goog.events.Event", "goog.events.EventType", "goog.math.Coordinate", "goog.spell.SpellCheck", "goog.structs.Set", "goog.style", "goog.ui.Component", "goog.ui.MenuItem", "goog.ui.MenuSeparator", "goog.ui.PopupMenu"], false);
goog.addDependency("ui/ac/ac.js", ["goog.ui.ac"], ["goog.ui.ac.ArrayMatcher", "goog.ui.ac.AutoComplete", "goog.ui.ac.InputHandler", "goog.ui.ac.Renderer"], false);
goog.addDependency("ui/ac/ac_test.js", ["goog.ui.acTest"], ["goog.array", "goog.asserts", "goog.dom", "goog.dom.NodeType", "goog.dom.classlist", "goog.dom.selection", "goog.events", "goog.events.BrowserEvent", "goog.events.Event", "goog.events.EventType", "goog.events.KeyCodes", "goog.style", "goog.testing.MockClock", "goog.testing.jsunit", "goog.ui.ac", "goog.userAgent"], false);
goog.addDependency("ui/ac/arraymatcher.js", ["goog.ui.ac.ArrayMatcher"], ["goog.string"], false);
goog.addDependency("ui/ac/arraymatcher_test.js", ["goog.ui.ac.ArrayMatcherTest"], ["goog.testing.jsunit", "goog.ui.ac.ArrayMatcher"], false);
goog.addDependency("ui/ac/autocomplete.js", ["goog.ui.ac.AutoComplete", "goog.ui.ac.AutoComplete.EventType"], ["goog.array", "goog.asserts", "goog.events", "goog.events.EventTarget", "goog.object"], false);
goog.addDependency("ui/ac/autocomplete_test.js", ["goog.ui.ac.AutoCompleteTest"], ["goog.a11y.aria", "goog.a11y.aria.Role", "goog.dom", "goog.events.EventHandler", "goog.events.EventTarget", "goog.string", "goog.testing.MockControl", "goog.testing.events", "goog.testing.jsunit", "goog.testing.mockmatchers", "goog.ui.ac.AutoComplete", "goog.ui.ac.InputHandler", "goog.ui.ac.RenderOptions", "goog.ui.ac.Renderer"], false);
goog.addDependency("ui/ac/cachingmatcher.js", ["goog.ui.ac.CachingMatcher"], ["goog.array", "goog.async.Throttle", "goog.ui.ac.ArrayMatcher", "goog.ui.ac.RenderOptions"], false);
goog.addDependency("ui/ac/cachingmatcher_test.js", ["goog.ui.ac.CachingMatcherTest"], ["goog.testing.MockControl", "goog.testing.jsunit", "goog.testing.mockmatchers", "goog.ui.ac.CachingMatcher"], false);
goog.addDependency("ui/ac/inputhandler.js", ["goog.ui.ac.InputHandler"], ["goog.Disposable", "goog.Timer", "goog.a11y.aria", "goog.dom", "goog.dom.selection", "goog.events.EventHandler", "goog.events.EventType", "goog.events.KeyCodes", "goog.events.KeyHandler", "goog.string", "goog.userAgent", "goog.userAgent.product"], false);
goog.addDependency("ui/ac/inputhandler_test.js", ["goog.ui.ac.InputHandlerTest"], ["goog.dom.selection", "goog.events.BrowserEvent", "goog.events.Event", "goog.events.EventTarget", "goog.events.KeyCodes", "goog.functions", "goog.object", "goog.testing.MockClock", "goog.testing.jsunit", "goog.ui.ac.InputHandler", "goog.userAgent"], false);
goog.addDependency("ui/ac/remote.js", ["goog.ui.ac.Remote"], ["goog.ui.ac.AutoComplete", "goog.ui.ac.InputHandler", "goog.ui.ac.RemoteArrayMatcher", "goog.ui.ac.Renderer"], false);
goog.addDependency("ui/ac/remotearraymatcher.js", ["goog.ui.ac.RemoteArrayMatcher"], ["goog.Disposable", "goog.Uri", "goog.events", "goog.json", "goog.net.EventType", "goog.net.XhrIo"], false);
goog.addDependency("ui/ac/remotearraymatcher_test.js", ["goog.ui.ac.RemoteArrayMatcherTest"], ["goog.json", "goog.net.XhrIo", "goog.testing.MockControl", "goog.testing.jsunit", "goog.testing.net.XhrIo", "goog.ui.ac.RemoteArrayMatcher"], false);
goog.addDependency("ui/ac/renderer.js", ["goog.ui.ac.Renderer", "goog.ui.ac.Renderer.CustomRenderer"], ["goog.a11y.aria", "goog.a11y.aria.Role", "goog.a11y.aria.State", "goog.array", "goog.asserts", "goog.dispose", "goog.dom", "goog.dom.NodeType", "goog.dom.classlist", "goog.events", "goog.events.EventTarget", "goog.events.EventType", "goog.fx.dom.FadeInAndShow", "goog.fx.dom.FadeOutAndHide", "goog.positioning", "goog.positioning.Corner", "goog.positioning.Overflow", "goog.string", "goog.style", 
"goog.ui.IdGenerator", "goog.ui.ac.AutoComplete"], false);
goog.addDependency("ui/ac/renderer_test.js", ["goog.ui.ac.RendererTest"], ["goog.a11y.aria", "goog.a11y.aria.Role", "goog.a11y.aria.State", "goog.dom", "goog.dom.classlist", "goog.events", "goog.fx.dom.FadeInAndShow", "goog.fx.dom.FadeOutAndHide", "goog.string", "goog.style", "goog.testing.PropertyReplacer", "goog.testing.jsunit", "goog.ui.ac.AutoComplete", "goog.ui.ac.Renderer"], false);
goog.addDependency("ui/ac/renderoptions.js", ["goog.ui.ac.RenderOptions"], [], false);
goog.addDependency("ui/ac/richinputhandler.js", ["goog.ui.ac.RichInputHandler"], ["goog.ui.ac.InputHandler"], false);
goog.addDependency("ui/ac/richremote.js", ["goog.ui.ac.RichRemote"], ["goog.ui.ac.AutoComplete", "goog.ui.ac.Remote", "goog.ui.ac.Renderer", "goog.ui.ac.RichInputHandler", "goog.ui.ac.RichRemoteArrayMatcher"], false);
goog.addDependency("ui/ac/richremotearraymatcher.js", ["goog.ui.ac.RichRemoteArrayMatcher"], ["goog.json", "goog.ui.ac.RemoteArrayMatcher"], false);
goog.addDependency("ui/activitymonitor.js", ["goog.ui.ActivityMonitor"], ["goog.array", "goog.asserts", "goog.dom", "goog.events.EventHandler", "goog.events.EventTarget", "goog.events.EventType"], false);
goog.addDependency("ui/activitymonitor_test.js", ["goog.ui.ActivityMonitorTest"], ["goog.dom", "goog.events", "goog.events.Event", "goog.events.EventType", "goog.testing.MockClock", "goog.testing.PropertyReplacer", "goog.testing.events", "goog.testing.jsunit", "goog.testing.recordFunction", "goog.ui.ActivityMonitor"], false);
goog.addDependency("ui/advancedtooltip.js", ["goog.ui.AdvancedTooltip"], ["goog.events", "goog.events.EventType", "goog.math.Box", "goog.math.Coordinate", "goog.style", "goog.ui.Tooltip", "goog.userAgent"], false);
goog.addDependency("ui/advancedtooltip_test.js", ["goog.ui.AdvancedTooltipTest"], ["goog.dom", "goog.events.Event", "goog.events.EventType", "goog.math.Box", "goog.math.Coordinate", "goog.style", "goog.testing.MockClock", "goog.testing.events", "goog.testing.jsunit", "goog.ui.AdvancedTooltip", "goog.ui.Tooltip", "goog.userAgent"], false);
goog.addDependency("ui/animatedzippy.js", ["goog.ui.AnimatedZippy"], ["goog.dom", "goog.events", "goog.fx.Animation", "goog.fx.Transition", "goog.fx.easing", "goog.ui.Zippy", "goog.ui.ZippyEvent"], false);
goog.addDependency("ui/animatedzippy_test.js", ["goog.ui.AnimatedZippyTest"], ["goog.a11y.aria", "goog.a11y.aria.State", "goog.asserts", "goog.dom", "goog.events", "goog.functions", "goog.fx.Animation", "goog.fx.Transition", "goog.testing.PropertyReplacer", "goog.testing.asserts", "goog.testing.jsunit", "goog.ui.AnimatedZippy", "goog.ui.Zippy"], false);
goog.addDependency("ui/attachablemenu.js", ["goog.ui.AttachableMenu"], ["goog.a11y.aria", "goog.a11y.aria.State", "goog.array", "goog.asserts", "goog.dom", "goog.dom.classlist", "goog.events.Event", "goog.events.KeyCodes", "goog.string", "goog.style", "goog.ui.ItemEvent", "goog.ui.MenuBase", "goog.ui.PopupBase", "goog.userAgent"], false);
goog.addDependency("ui/bidiinput.js", ["goog.ui.BidiInput"], ["goog.dom", "goog.events", "goog.events.InputHandler", "goog.i18n.bidi", "goog.i18n.bidi.Dir", "goog.ui.Component"], false);
goog.addDependency("ui/bidiinput_test.js", ["goog.ui.BidiInputTest"], ["goog.dom", "goog.testing.jsunit", "goog.ui.BidiInput"], false);
goog.addDependency("ui/bubble.js", ["goog.ui.Bubble"], ["goog.Timer", "goog.events", "goog.events.EventType", "goog.math.Box", "goog.positioning", "goog.positioning.AbsolutePosition", "goog.positioning.AnchoredPosition", "goog.positioning.Corner", "goog.positioning.CornerBit", "goog.style", "goog.ui.Component", "goog.ui.Popup"], false);
goog.addDependency("ui/button.js", ["goog.ui.Button", "goog.ui.Button.Side"], ["goog.events.EventType", "goog.events.KeyCodes", "goog.events.KeyHandler", "goog.ui.ButtonRenderer", "goog.ui.ButtonSide", "goog.ui.Component", "goog.ui.Control", "goog.ui.NativeButtonRenderer", "goog.ui.registry"], false);
goog.addDependency("ui/button_test.js", ["goog.ui.ButtonTest"], ["goog.dom", "goog.dom.classlist", "goog.events", "goog.events.Event", "goog.events.EventType", "goog.events.KeyCodes", "goog.events.KeyHandler", "goog.testing.events", "goog.testing.jsunit", "goog.ui.Button", "goog.ui.ButtonRenderer", "goog.ui.ButtonSide", "goog.ui.Component", "goog.ui.NativeButtonRenderer"], false);
goog.addDependency("ui/buttonrenderer.js", ["goog.ui.ButtonRenderer"], ["goog.a11y.aria", "goog.a11y.aria.Role", "goog.a11y.aria.State", "goog.asserts", "goog.ui.ButtonSide", "goog.ui.Component", "goog.ui.ControlRenderer"], false);
goog.addDependency("ui/buttonrenderer_test.js", ["goog.ui.ButtonRendererTest"], ["goog.a11y.aria", "goog.a11y.aria.Role", "goog.a11y.aria.State", "goog.dom", "goog.dom.classlist", "goog.testing.ExpectedFailures", "goog.testing.jsunit", "goog.testing.ui.rendererasserts", "goog.ui.Button", "goog.ui.ButtonRenderer", "goog.ui.ButtonSide", "goog.ui.Component"], false);
goog.addDependency("ui/buttonside.js", ["goog.ui.ButtonSide"], [], false);
goog.addDependency("ui/charcounter.js", ["goog.ui.CharCounter", "goog.ui.CharCounter.Display"], ["goog.dom", "goog.events", "goog.events.EventTarget", "goog.events.InputHandler"], false);
goog.addDependency("ui/charcounter_test.js", ["goog.ui.CharCounterTest"], ["goog.dom", "goog.testing.asserts", "goog.testing.jsunit", "goog.ui.CharCounter", "goog.userAgent"], false);
goog.addDependency("ui/charpicker.js", ["goog.ui.CharPicker"], ["goog.a11y.aria", "goog.a11y.aria.State", "goog.array", "goog.asserts", "goog.dom", "goog.dom.classlist", "goog.events", "goog.events.Event", "goog.events.EventHandler", "goog.events.EventType", "goog.events.InputHandler", "goog.events.KeyCodes", "goog.events.KeyHandler", "goog.i18n.CharListDecompressor", "goog.i18n.uChar", "goog.structs.Set", "goog.style", "goog.ui.Button", "goog.ui.Component", "goog.ui.ContainerScroller", "goog.ui.FlatButtonRenderer", 
"goog.ui.HoverCard", "goog.ui.LabelInput", "goog.ui.Menu", "goog.ui.MenuButton", "goog.ui.MenuItem", "goog.ui.Tooltip"], false);
goog.addDependency("ui/charpicker_test.js", ["goog.ui.CharPickerTest"], ["goog.a11y.aria", "goog.a11y.aria.State", "goog.dispose", "goog.dom", "goog.events.Event", "goog.events.EventType", "goog.i18n.CharPickerData", "goog.i18n.uChar.NameFetcher", "goog.testing.MockControl", "goog.testing.events", "goog.testing.jsunit", "goog.testing.mockmatchers", "goog.ui.CharPicker", "goog.ui.FlatButtonRenderer"], false);
goog.addDependency("ui/checkbox.js", ["goog.ui.Checkbox", "goog.ui.Checkbox.State"], ["goog.a11y.aria", "goog.a11y.aria.State", "goog.events.EventType", "goog.events.KeyCodes", "goog.string", "goog.ui.CheckboxRenderer", "goog.ui.Component", "goog.ui.Control", "goog.ui.registry"], false);
goog.addDependency("ui/checkbox_test.js", ["goog.ui.CheckboxTest"], ["goog.a11y.aria", "goog.a11y.aria.Role", "goog.a11y.aria.State", "goog.dom", "goog.dom.classlist", "goog.events", "goog.events.KeyCodes", "goog.testing.events", "goog.testing.jsunit", "goog.ui.Checkbox", "goog.ui.CheckboxRenderer", "goog.ui.Component", "goog.ui.ControlRenderer", "goog.ui.decorate"], false);
goog.addDependency("ui/checkboxmenuitem.js", ["goog.ui.CheckBoxMenuItem"], ["goog.ui.MenuItem", "goog.ui.registry"], false);
goog.addDependency("ui/checkboxrenderer.js", ["goog.ui.CheckboxRenderer"], ["goog.a11y.aria", "goog.a11y.aria.Role", "goog.a11y.aria.State", "goog.array", "goog.asserts", "goog.dom.classlist", "goog.object", "goog.ui.ControlRenderer"], false);
goog.addDependency("ui/colorbutton.js", ["goog.ui.ColorButton"], ["goog.ui.Button", "goog.ui.ColorButtonRenderer", "goog.ui.registry"], false);
goog.addDependency("ui/colorbutton_test.js", ["goog.ui.ColorButtonTest"], ["goog.array", "goog.asserts", "goog.dom", "goog.dom.classlist", "goog.testing.jsunit", "goog.ui.ColorButton", "goog.ui.decorate"], false);
goog.addDependency("ui/colorbuttonrenderer.js", ["goog.ui.ColorButtonRenderer"], ["goog.asserts", "goog.dom.classlist", "goog.functions", "goog.ui.ColorMenuButtonRenderer"], false);
goog.addDependency("ui/colormenubutton.js", ["goog.ui.ColorMenuButton"], ["goog.array", "goog.object", "goog.ui.ColorMenuButtonRenderer", "goog.ui.ColorPalette", "goog.ui.Component", "goog.ui.Menu", "goog.ui.MenuButton", "goog.ui.registry"], false);
goog.addDependency("ui/colormenubuttonrenderer.js", ["goog.ui.ColorMenuButtonRenderer"], ["goog.asserts", "goog.color", "goog.dom.classlist", "goog.ui.MenuButtonRenderer", "goog.userAgent"], false);
goog.addDependency("ui/colormenubuttonrenderer_test.js", ["goog.ui.ColorMenuButtonTest"], ["goog.dom", "goog.testing.jsunit", "goog.testing.ui.RendererHarness", "goog.testing.ui.rendererasserts", "goog.ui.ColorMenuButton", "goog.ui.ColorMenuButtonRenderer", "goog.userAgent"], false);
goog.addDependency("ui/colorpalette.js", ["goog.ui.ColorPalette"], ["goog.array", "goog.color", "goog.style", "goog.ui.Palette", "goog.ui.PaletteRenderer"], false);
goog.addDependency("ui/colorpalette_test.js", ["goog.ui.ColorPaletteTest"], ["goog.color", "goog.testing.jsunit", "goog.ui.ColorPalette"], false);
goog.addDependency("ui/colorpicker.js", ["goog.ui.ColorPicker", "goog.ui.ColorPicker.EventType"], ["goog.ui.ColorPalette", "goog.ui.Component"], false);
goog.addDependency("ui/colorsplitbehavior.js", ["goog.ui.ColorSplitBehavior"], ["goog.ui.ColorMenuButton", "goog.ui.SplitBehavior"], false);
goog.addDependency("ui/combobox.js", ["goog.ui.ComboBox", "goog.ui.ComboBoxItem"], ["goog.Timer", "goog.asserts", "goog.dom", "goog.dom.classlist", "goog.events.EventType", "goog.events.InputHandler", "goog.events.KeyCodes", "goog.events.KeyHandler", "goog.log", "goog.positioning.Corner", "goog.positioning.MenuAnchoredPosition", "goog.string", "goog.style", "goog.ui.Component", "goog.ui.ItemEvent", "goog.ui.LabelInput", "goog.ui.Menu", "goog.ui.MenuItem", "goog.ui.MenuSeparator", "goog.ui.registry", 
"goog.userAgent"], false);
goog.addDependency("ui/combobox_test.js", ["goog.ui.ComboBoxTest"], ["goog.dom", "goog.dom.TagName", "goog.dom.classlist", "goog.events.KeyCodes", "goog.testing.MockClock", "goog.testing.events", "goog.testing.jsunit", "goog.ui.ComboBox", "goog.ui.ComboBoxItem", "goog.ui.Component", "goog.ui.ControlRenderer", "goog.ui.LabelInput", "goog.ui.Menu", "goog.ui.MenuItem"], false);
goog.addDependency("ui/component.js", ["goog.ui.Component", "goog.ui.Component.Error", "goog.ui.Component.EventType", "goog.ui.Component.State"], ["goog.array", "goog.asserts", "goog.dom", "goog.dom.NodeType", "goog.events.EventHandler", "goog.events.EventTarget", "goog.object", "goog.style", "goog.ui.IdGenerator"], false);
goog.addDependency("ui/component_test.js", ["goog.ui.ComponentTest"], ["goog.dom", "goog.dom.DomHelper", "goog.dom.NodeType", "goog.dom.TagName", "goog.events.EventTarget", "goog.testing.PropertyReplacer", "goog.testing.jsunit", "goog.ui.Component"], false);
goog.addDependency("ui/container.js", ["goog.ui.Container", "goog.ui.Container.EventType", "goog.ui.Container.Orientation"], ["goog.a11y.aria", "goog.a11y.aria.State", "goog.asserts", "goog.dom", "goog.events.EventType", "goog.events.KeyCodes", "goog.events.KeyHandler", "goog.object", "goog.style", "goog.ui.Component", "goog.ui.ContainerRenderer", "goog.ui.Control"], false);
goog.addDependency("ui/container_test.js", ["goog.ui.ContainerTest"], ["goog.a11y.aria", "goog.dom", "goog.dom.classlist", "goog.events", "goog.events.Event", "goog.events.KeyCodes", "goog.events.KeyEvent", "goog.testing.events", "goog.testing.jsunit", "goog.ui.Component", "goog.ui.Container", "goog.ui.Control"], false);
goog.addDependency("ui/containerrenderer.js", ["goog.ui.ContainerRenderer"], ["goog.a11y.aria", "goog.array", "goog.asserts", "goog.dom.NodeType", "goog.dom.classlist", "goog.string", "goog.style", "goog.ui.registry", "goog.userAgent"], false);
goog.addDependency("ui/containerrenderer_test.js", ["goog.ui.ContainerRendererTest"], ["goog.dom", "goog.style", "goog.testing.ExpectedFailures", "goog.testing.PropertyReplacer", "goog.testing.jsunit", "goog.testing.ui.rendererasserts", "goog.ui.Container", "goog.ui.ContainerRenderer", "goog.userAgent"], false);
goog.addDependency("ui/containerscroller.js", ["goog.ui.ContainerScroller"], ["goog.Disposable", "goog.Timer", "goog.events.EventHandler", "goog.style", "goog.ui.Component", "goog.ui.Container"], false);
goog.addDependency("ui/containerscroller_test.js", ["goog.ui.ContainerScrollerTest"], ["goog.dom", "goog.testing.MockClock", "goog.testing.events", "goog.testing.jsunit", "goog.ui.Container", "goog.ui.ContainerScroller"], false);
goog.addDependency("ui/control.js", ["goog.ui.Control"], ["goog.array", "goog.dom", "goog.events.Event", "goog.events.EventType", "goog.events.KeyCodes", "goog.events.KeyHandler", "goog.string", "goog.ui.Component", "goog.ui.ControlContent", "goog.ui.ControlRenderer", "goog.ui.decorate", "goog.ui.registry", "goog.userAgent"], false);
goog.addDependency("ui/control_test.js", ["goog.ui.ControlTest"], ["goog.a11y.aria", "goog.a11y.aria.State", "goog.array", "goog.dom", "goog.dom.classlist", "goog.events", "goog.events.BrowserEvent", "goog.events.KeyCodes", "goog.object", "goog.string", "goog.style", "goog.testing.ExpectedFailures", "goog.testing.events", "goog.testing.events.Event", "goog.testing.jsunit", "goog.ui.Component", "goog.ui.Control", "goog.ui.ControlRenderer", "goog.ui.registry", "goog.userAgent"], false);
goog.addDependency("ui/controlcontent.js", ["goog.ui.ControlContent"], [], false);
goog.addDependency("ui/controlrenderer.js", ["goog.ui.ControlRenderer"], ["goog.a11y.aria", "goog.a11y.aria.Role", "goog.a11y.aria.State", "goog.array", "goog.asserts", "goog.dom", "goog.dom.classlist", "goog.object", "goog.string", "goog.style", "goog.ui.Component", "goog.userAgent"], false);
goog.addDependency("ui/controlrenderer_test.js", ["goog.ui.ControlRendererTest"], ["goog.a11y.aria", "goog.a11y.aria.Role", "goog.a11y.aria.State", "goog.dom", "goog.dom.NodeType", "goog.dom.classlist", "goog.object", "goog.style", "goog.testing.ExpectedFailures", "goog.testing.PropertyReplacer", "goog.testing.jsunit", "goog.ui.Component", "goog.ui.Control", "goog.ui.ControlRenderer", "goog.userAgent"], false);
goog.addDependency("ui/cookieeditor.js", ["goog.ui.CookieEditor"], ["goog.asserts", "goog.dom", "goog.dom.TagName", "goog.events.EventType", "goog.net.cookies", "goog.string", "goog.style", "goog.ui.Component"], false);
goog.addDependency("ui/cookieeditor_test.js", ["goog.ui.CookieEditorTest"], ["goog.dom", "goog.events.Event", "goog.events.EventType", "goog.net.cookies", "goog.testing.events", "goog.testing.jsunit", "goog.ui.CookieEditor"], false);
goog.addDependency("ui/css3buttonrenderer.js", ["goog.ui.Css3ButtonRenderer"], ["goog.asserts", "goog.dom.TagName", "goog.dom.classlist", "goog.ui.Button", "goog.ui.ButtonRenderer", "goog.ui.Component", "goog.ui.INLINE_BLOCK_CLASSNAME", "goog.ui.registry"], false);
goog.addDependency("ui/css3menubuttonrenderer.js", ["goog.ui.Css3MenuButtonRenderer"], ["goog.dom", "goog.dom.TagName", "goog.ui.INLINE_BLOCK_CLASSNAME", "goog.ui.MenuButton", "goog.ui.MenuButtonRenderer", "goog.ui.registry"], false);
goog.addDependency("ui/cssnames.js", ["goog.ui.INLINE_BLOCK_CLASSNAME"], [], false);
goog.addDependency("ui/custombutton.js", ["goog.ui.CustomButton"], ["goog.ui.Button", "goog.ui.CustomButtonRenderer", "goog.ui.registry"], false);
goog.addDependency("ui/custombuttonrenderer.js", ["goog.ui.CustomButtonRenderer"], ["goog.a11y.aria.Role", "goog.asserts", "goog.dom.NodeType", "goog.dom.classlist", "goog.string", "goog.ui.ButtonRenderer", "goog.ui.INLINE_BLOCK_CLASSNAME"], false);
goog.addDependency("ui/customcolorpalette.js", ["goog.ui.CustomColorPalette"], ["goog.color", "goog.dom", "goog.dom.classlist", "goog.ui.ColorPalette", "goog.ui.Component"], false);
goog.addDependency("ui/customcolorpalette_test.js", ["goog.ui.CustomColorPaletteTest"], ["goog.dom.TagName", "goog.dom.classlist", "goog.testing.jsunit", "goog.ui.CustomColorPalette"], false);
goog.addDependency("ui/datepicker.js", ["goog.ui.DatePicker", "goog.ui.DatePicker.Events", "goog.ui.DatePickerEvent"], ["goog.a11y.aria", "goog.asserts", "goog.date.Date", "goog.date.DateRange", "goog.date.Interval", "goog.dom", "goog.dom.NodeType", "goog.dom.classlist", "goog.events.Event", "goog.events.EventType", "goog.events.KeyHandler", "goog.i18n.DateTimeFormat", "goog.i18n.DateTimePatterns", "goog.i18n.DateTimeSymbols", "goog.style", "goog.ui.Component", "goog.ui.DefaultDatePickerRenderer", 
"goog.ui.IdGenerator"], false);
goog.addDependency("ui/datepicker_test.js", ["goog.ui.DatePickerTest"], ["goog.a11y.aria", "goog.a11y.aria.Role", "goog.date.Date", "goog.date.DateRange", "goog.dom", "goog.dom.classlist", "goog.events", "goog.i18n.DateTimeSymbols", "goog.i18n.DateTimeSymbols_en_US", "goog.i18n.DateTimeSymbols_zh_HK", "goog.style", "goog.testing.jsunit", "goog.ui.DatePicker"], false);
goog.addDependency("ui/datepickerrenderer.js", ["goog.ui.DatePickerRenderer"], [], false);
goog.addDependency("ui/decorate.js", ["goog.ui.decorate"], ["goog.ui.registry"], false);
goog.addDependency("ui/decorate_test.js", ["goog.ui.decorateTest"], ["goog.testing.jsunit", "goog.ui.decorate", "goog.ui.registry"], false);
goog.addDependency("ui/defaultdatepickerrenderer.js", ["goog.ui.DefaultDatePickerRenderer"], ["goog.dom", "goog.dom.TagName", "goog.ui.DatePickerRenderer"], false);
goog.addDependency("ui/dialog.js", ["goog.ui.Dialog", "goog.ui.Dialog.ButtonSet", "goog.ui.Dialog.ButtonSet.DefaultButtons", "goog.ui.Dialog.DefaultButtonCaptions", "goog.ui.Dialog.DefaultButtonKeys", "goog.ui.Dialog.Event", "goog.ui.Dialog.EventType"], ["goog.a11y.aria", "goog.a11y.aria.Role", "goog.a11y.aria.State", "goog.asserts", "goog.dom", "goog.dom.NodeType", "goog.dom.TagName", "goog.dom.classlist", "goog.dom.safe", "goog.events", "goog.events.Event", "goog.events.EventType", "goog.events.KeyCodes", 
"goog.fx.Dragger", "goog.html.SafeHtml", "goog.html.legacyconversions", "goog.math.Rect", "goog.string", "goog.structs.Map", "goog.style", "goog.ui.ModalPopup"], false);
goog.addDependency("ui/dialog_test.js", ["goog.ui.DialogTest"], ["goog.a11y.aria", "goog.a11y.aria.Role", "goog.a11y.aria.State", "goog.dom", "goog.dom.TagName", "goog.dom.classlist", "goog.events", "goog.events.EventType", "goog.events.KeyCodes", "goog.fx.css3", "goog.html.SafeHtml", "goog.html.testing", "goog.style", "goog.testing.MockClock", "goog.testing.PropertyReplacer", "goog.testing.events", "goog.testing.jsunit", "goog.testing.recordFunction", "goog.ui.Dialog", "goog.userAgent"], false);
goog.addDependency("ui/dimensionpicker.js", ["goog.ui.DimensionPicker"], ["goog.events.EventType", "goog.events.KeyCodes", "goog.math.Size", "goog.ui.Component", "goog.ui.Control", "goog.ui.DimensionPickerRenderer", "goog.ui.registry"], false);
goog.addDependency("ui/dimensionpicker_test.js", ["goog.ui.DimensionPickerTest"], ["goog.dom", "goog.dom.TagName", "goog.events.KeyCodes", "goog.math.Size", "goog.testing.jsunit", "goog.testing.ui.rendererasserts", "goog.ui.DimensionPicker", "goog.ui.DimensionPickerRenderer"], false);
goog.addDependency("ui/dimensionpickerrenderer.js", ["goog.ui.DimensionPickerRenderer"], ["goog.a11y.aria.Announcer", "goog.a11y.aria.LivePriority", "goog.dom", "goog.dom.TagName", "goog.i18n.bidi", "goog.style", "goog.ui.ControlRenderer", "goog.userAgent"], false);
goog.addDependency("ui/dimensionpickerrenderer_test.js", ["goog.ui.DimensionPickerRendererTest"], ["goog.a11y.aria.LivePriority", "goog.array", "goog.testing.jsunit", "goog.testing.recordFunction", "goog.ui.DimensionPicker", "goog.ui.DimensionPickerRenderer"], false);
goog.addDependency("ui/dragdropdetector.js", ["goog.ui.DragDropDetector", "goog.ui.DragDropDetector.EventType", "goog.ui.DragDropDetector.ImageDropEvent", "goog.ui.DragDropDetector.LinkDropEvent"], ["goog.dom", "goog.dom.TagName", "goog.events.Event", "goog.events.EventHandler", "goog.events.EventTarget", "goog.events.EventType", "goog.math.Coordinate", "goog.string", "goog.style", "goog.userAgent"], false);
goog.addDependency("ui/drilldownrow.js", ["goog.ui.DrilldownRow"], ["goog.asserts", "goog.dom", "goog.dom.classlist", "goog.ui.Component"], false);
goog.addDependency("ui/drilldownrow_test.js", ["goog.ui.DrilldownRowTest"], ["goog.dom", "goog.testing.jsunit", "goog.ui.DrilldownRow"], false);
goog.addDependency("ui/editor/abstractdialog.js", ["goog.ui.editor.AbstractDialog", "goog.ui.editor.AbstractDialog.Builder", "goog.ui.editor.AbstractDialog.EventType"], ["goog.asserts", "goog.dom", "goog.dom.classlist", "goog.events.EventTarget", "goog.string", "goog.ui.Dialog", "goog.ui.PopupBase"], false);
goog.addDependency("ui/editor/abstractdialog_test.js", ["goog.ui.editor.AbstractDialogTest"], ["goog.dom", "goog.dom.DomHelper", "goog.dom.classlist", "goog.events.Event", "goog.events.EventHandler", "goog.events.KeyCodes", "goog.testing.MockControl", "goog.testing.events", "goog.testing.jsunit", "goog.testing.mockmatchers.ArgumentMatcher", "goog.ui.editor.AbstractDialog", "goog.userAgent"], false);
goog.addDependency("ui/editor/bubble.js", ["goog.ui.editor.Bubble"], ["goog.asserts", "goog.dom", "goog.dom.TagName", "goog.dom.ViewportSizeMonitor", "goog.dom.classlist", "goog.editor.style", "goog.events.EventHandler", "goog.events.EventTarget", "goog.events.EventType", "goog.functions", "goog.log", "goog.math.Box", "goog.object", "goog.positioning", "goog.positioning.Corner", "goog.positioning.Overflow", "goog.positioning.OverflowStatus", "goog.string", "goog.style", "goog.ui.Component", "goog.ui.PopupBase", 
"goog.userAgent"], false);
goog.addDependency("ui/editor/bubble_test.js", ["goog.ui.editor.BubbleTest"], ["goog.dom", "goog.dom.TagName", "goog.events", "goog.events.EventType", "goog.positioning.Corner", "goog.positioning.OverflowStatus", "goog.string", "goog.style", "goog.testing.editor.TestHelper", "goog.testing.events", "goog.testing.jsunit", "goog.ui.Component", "goog.ui.editor.Bubble"], false);
goog.addDependency("ui/editor/defaulttoolbar.js", ["goog.ui.editor.ButtonDescriptor", "goog.ui.editor.DefaultToolbar"], ["goog.asserts", "goog.dom", "goog.dom.TagName", "goog.dom.classlist", "goog.editor.Command", "goog.style", "goog.ui.editor.ToolbarFactory", "goog.ui.editor.messages", "goog.userAgent"], false);
goog.addDependency("ui/editor/linkdialog.js", ["goog.ui.editor.LinkDialog", "goog.ui.editor.LinkDialog.BeforeTestLinkEvent", "goog.ui.editor.LinkDialog.EventType", "goog.ui.editor.LinkDialog.OkEvent"], ["goog.dom", "goog.dom.TagName", "goog.dom.safe", "goog.editor.BrowserFeature", "goog.editor.Link", "goog.editor.focus", "goog.editor.node", "goog.events.Event", "goog.events.EventHandler", "goog.events.EventType", "goog.events.InputHandler", "goog.html.SafeHtml", "goog.string", "goog.string.Unicode", 
"goog.style", "goog.ui.Button", "goog.ui.Component", "goog.ui.LinkButtonRenderer", "goog.ui.editor.AbstractDialog", "goog.ui.editor.TabPane", "goog.ui.editor.messages", "goog.userAgent", "goog.window"], false);
goog.addDependency("ui/editor/linkdialog_test.js", ["goog.ui.editor.LinkDialogTest"], ["goog.dom", "goog.dom.DomHelper", "goog.dom.TagName", "goog.editor.BrowserFeature", "goog.editor.Link", "goog.events", "goog.events.Event", "goog.events.EventHandler", "goog.events.InputHandler", "goog.style", "goog.testing.MockControl", "goog.testing.PropertyReplacer", "goog.testing.dom", "goog.testing.events", "goog.testing.jsunit", "goog.testing.mockmatchers", "goog.testing.mockmatchers.ArgumentMatcher", "goog.ui.editor.AbstractDialog", 
"goog.ui.editor.LinkDialog", "goog.ui.editor.messages", "goog.userAgent"], false);
goog.addDependency("ui/editor/messages.js", ["goog.ui.editor.messages"], ["goog.html.uncheckedconversions", "goog.string.Const"], false);
goog.addDependency("ui/editor/tabpane.js", ["goog.ui.editor.TabPane"], ["goog.asserts", "goog.dom.TagName", "goog.dom.classlist", "goog.events.EventHandler", "goog.events.EventType", "goog.style", "goog.ui.Component", "goog.ui.Control", "goog.ui.Tab", "goog.ui.TabBar"], false);
goog.addDependency("ui/editor/toolbarcontroller.js", ["goog.ui.editor.ToolbarController"], ["goog.editor.Field", "goog.events.EventHandler", "goog.events.EventTarget", "goog.ui.Component"], false);
goog.addDependency("ui/editor/toolbarfactory.js", ["goog.ui.editor.ToolbarFactory"], ["goog.array", "goog.dom", "goog.dom.TagName", "goog.string", "goog.string.Unicode", "goog.style", "goog.ui.Component", "goog.ui.Container", "goog.ui.Option", "goog.ui.Toolbar", "goog.ui.ToolbarButton", "goog.ui.ToolbarColorMenuButton", "goog.ui.ToolbarMenuButton", "goog.ui.ToolbarRenderer", "goog.ui.ToolbarSelect", "goog.userAgent"], false);
goog.addDependency("ui/editor/toolbarfactory_test.js", ["goog.ui.editor.ToolbarFactoryTest"], ["goog.dom", "goog.testing.ExpectedFailures", "goog.testing.editor.TestHelper", "goog.testing.jsunit", "goog.ui.editor.ToolbarFactory", "goog.userAgent"], false);
goog.addDependency("ui/emoji/emoji.js", ["goog.ui.emoji.Emoji"], [], false);
goog.addDependency("ui/emoji/emojipalette.js", ["goog.ui.emoji.EmojiPalette"], ["goog.events.EventType", "goog.net.ImageLoader", "goog.ui.Palette", "goog.ui.emoji.Emoji", "goog.ui.emoji.EmojiPaletteRenderer"], false);
goog.addDependency("ui/emoji/emojipaletterenderer.js", ["goog.ui.emoji.EmojiPaletteRenderer"], ["goog.a11y.aria", "goog.asserts", "goog.dom.NodeType", "goog.dom.classlist", "goog.style", "goog.ui.PaletteRenderer", "goog.ui.emoji.Emoji"], false);
goog.addDependency("ui/emoji/emojipicker.js", ["goog.ui.emoji.EmojiPicker"], ["goog.log", "goog.style", "goog.ui.Component", "goog.ui.TabPane", "goog.ui.emoji.Emoji", "goog.ui.emoji.EmojiPalette", "goog.ui.emoji.EmojiPaletteRenderer", "goog.ui.emoji.ProgressiveEmojiPaletteRenderer"], false);
goog.addDependency("ui/emoji/emojipicker_test.js", ["goog.ui.emoji.EmojiPickerTest"], ["goog.dom.classlist", "goog.events.EventHandler", "goog.style", "goog.testing.events", "goog.testing.jsunit", "goog.ui.Component", "goog.ui.emoji.Emoji", "goog.ui.emoji.EmojiPicker", "goog.ui.emoji.SpriteInfo"], false);
goog.addDependency("ui/emoji/fast_nonprogressive_emojipicker_test.js", ["goog.ui.emoji.FastNonProgressiveEmojiPickerTest"], ["goog.dom.classlist", "goog.events", "goog.events.EventType", "goog.net.EventType", "goog.style", "goog.testing.AsyncTestCase", "goog.testing.jsunit", "goog.ui.emoji.Emoji", "goog.ui.emoji.EmojiPicker", "goog.ui.emoji.SpriteInfo", "goog.userAgent"], false);
goog.addDependency("ui/emoji/fast_progressive_emojipicker_test.js", ["goog.ui.emoji.FastProgressiveEmojiPickerTest"], ["goog.dom.classlist", "goog.events", "goog.events.EventType", "goog.net.EventType", "goog.style", "goog.testing.AsyncTestCase", "goog.testing.jsunit", "goog.ui.emoji.Emoji", "goog.ui.emoji.EmojiPicker", "goog.ui.emoji.SpriteInfo"], false);
goog.addDependency("ui/emoji/popupemojipicker.js", ["goog.ui.emoji.PopupEmojiPicker"], ["goog.events.EventType", "goog.positioning.AnchoredPosition", "goog.positioning.Corner", "goog.ui.Component", "goog.ui.Popup", "goog.ui.emoji.EmojiPicker"], false);
goog.addDependency("ui/emoji/popupemojipicker_test.js", ["goog.ui.emoji.PopupEmojiPickerTest"], ["goog.dom", "goog.testing.jsunit", "goog.ui.emoji.PopupEmojiPicker"], false);
goog.addDependency("ui/emoji/progressiveemojipaletterenderer.js", ["goog.ui.emoji.ProgressiveEmojiPaletteRenderer"], ["goog.style", "goog.ui.emoji.EmojiPaletteRenderer"], false);
goog.addDependency("ui/emoji/spriteinfo.js", ["goog.ui.emoji.SpriteInfo"], [], false);
goog.addDependency("ui/emoji/spriteinfo_test.js", ["goog.ui.emoji.SpriteInfoTest"], ["goog.testing.jsunit", "goog.ui.emoji.SpriteInfo"], false);
goog.addDependency("ui/filteredmenu.js", ["goog.ui.FilteredMenu"], ["goog.a11y.aria", "goog.a11y.aria.AutoCompleteValues", "goog.a11y.aria.State", "goog.dom", "goog.events", "goog.events.EventType", "goog.events.InputHandler", "goog.events.KeyCodes", "goog.object", "goog.string", "goog.style", "goog.ui.Component", "goog.ui.FilterObservingMenuItem", "goog.ui.Menu", "goog.ui.MenuItem", "goog.userAgent"], false);
goog.addDependency("ui/filteredmenu_test.js", ["goog.ui.FilteredMenuTest"], ["goog.a11y.aria", "goog.a11y.aria.AutoCompleteValues", "goog.a11y.aria.State", "goog.dom", "goog.events", "goog.events.EventType", "goog.events.KeyCodes", "goog.math.Rect", "goog.style", "goog.testing.events", "goog.testing.jsunit", "goog.ui.FilteredMenu", "goog.ui.MenuItem"], false);
goog.addDependency("ui/filterobservingmenuitem.js", ["goog.ui.FilterObservingMenuItem"], ["goog.ui.FilterObservingMenuItemRenderer", "goog.ui.MenuItem", "goog.ui.registry"], false);
goog.addDependency("ui/filterobservingmenuitemrenderer.js", ["goog.ui.FilterObservingMenuItemRenderer"], ["goog.ui.MenuItemRenderer"], false);
goog.addDependency("ui/flatbuttonrenderer.js", ["goog.ui.FlatButtonRenderer"], ["goog.a11y.aria.Role", "goog.asserts", "goog.dom.classlist", "goog.ui.Button", "goog.ui.ButtonRenderer", "goog.ui.INLINE_BLOCK_CLASSNAME", "goog.ui.registry"], false);
goog.addDependency("ui/flatmenubuttonrenderer.js", ["goog.ui.FlatMenuButtonRenderer"], ["goog.dom", "goog.style", "goog.ui.FlatButtonRenderer", "goog.ui.INLINE_BLOCK_CLASSNAME", "goog.ui.Menu", "goog.ui.MenuButton", "goog.ui.MenuRenderer", "goog.ui.registry"], false);
goog.addDependency("ui/formpost.js", ["goog.ui.FormPost"], ["goog.array", "goog.dom.TagName", "goog.dom.safe", "goog.html.SafeHtml", "goog.ui.Component"], false);
goog.addDependency("ui/formpost_test.js", ["goog.ui.FormPostTest"], ["goog.array", "goog.dom", "goog.dom.TagName", "goog.object", "goog.testing.jsunit", "goog.ui.FormPost", "goog.userAgent.product", "goog.userAgent.product.isVersion"], false);
goog.addDependency("ui/gauge.js", ["goog.ui.Gauge", "goog.ui.GaugeColoredRange"], ["goog.a11y.aria", "goog.asserts", "goog.events", "goog.fx.Animation", "goog.fx.Transition", "goog.fx.easing", "goog.graphics", "goog.graphics.Font", "goog.graphics.Path", "goog.graphics.SolidFill", "goog.math", "goog.ui.Component", "goog.ui.GaugeTheme"], false);
goog.addDependency("ui/gaugetheme.js", ["goog.ui.GaugeTheme"], ["goog.graphics.LinearGradient", "goog.graphics.SolidFill", "goog.graphics.Stroke"], false);
goog.addDependency("ui/hovercard.js", ["goog.ui.HoverCard", "goog.ui.HoverCard.EventType", "goog.ui.HoverCard.TriggerEvent"], ["goog.array", "goog.dom", "goog.events", "goog.events.Event", "goog.events.EventType", "goog.ui.AdvancedTooltip", "goog.ui.PopupBase", "goog.ui.Tooltip"], false);
goog.addDependency("ui/hovercard_test.js", ["goog.ui.HoverCardTest"], ["goog.dom", "goog.events", "goog.math.Coordinate", "goog.style", "goog.testing.MockClock", "goog.testing.events", "goog.testing.events.Event", "goog.testing.jsunit", "goog.ui.HoverCard"], false);
goog.addDependency("ui/hsvapalette.js", ["goog.ui.HsvaPalette"], ["goog.array", "goog.color.alpha", "goog.dom.TagName", "goog.events", "goog.events.EventType", "goog.style", "goog.ui.Component", "goog.ui.HsvPalette"], false);
goog.addDependency("ui/hsvapalette_test.js", ["goog.ui.HsvaPaletteTest"], ["goog.color.alpha", "goog.dom.TagName", "goog.dom.classlist", "goog.events.Event", "goog.math.Coordinate", "goog.style", "goog.testing.PropertyReplacer", "goog.testing.jsunit", "goog.ui.HsvaPalette", "goog.userAgent"], false);
goog.addDependency("ui/hsvpalette.js", ["goog.ui.HsvPalette"], ["goog.color", "goog.dom.TagName", "goog.events", "goog.events.EventType", "goog.events.InputHandler", "goog.style", "goog.style.bidi", "goog.ui.Component", "goog.userAgent"], false);
goog.addDependency("ui/hsvpalette_test.js", ["goog.ui.HsvPaletteTest"], ["goog.color", "goog.dom.TagName", "goog.dom.classlist", "goog.events", "goog.events.Event", "goog.math.Coordinate", "goog.style", "goog.testing.PropertyReplacer", "goog.testing.jsunit", "goog.ui.Component", "goog.ui.HsvPalette", "goog.userAgent"], false);
goog.addDependency("ui/idgenerator.js", ["goog.ui.IdGenerator"], [], false);
goog.addDependency("ui/idletimer.js", ["goog.ui.IdleTimer"], ["goog.Timer", "goog.events", "goog.events.EventTarget", "goog.structs.Set", "goog.ui.ActivityMonitor"], false);
goog.addDependency("ui/idletimer_test.js", ["goog.ui.IdleTimerTest"], ["goog.events", "goog.testing.MockClock", "goog.testing.jsunit", "goog.ui.IdleTimer", "goog.ui.MockActivityMonitor"], false);
goog.addDependency("ui/iframemask.js", ["goog.ui.IframeMask"], ["goog.Disposable", "goog.Timer", "goog.dom", "goog.dom.iframe", "goog.events.EventHandler", "goog.style"], false);
goog.addDependency("ui/iframemask_test.js", ["goog.ui.IframeMaskTest"], ["goog.dom", "goog.dom.TagName", "goog.dom.iframe", "goog.structs.Pool", "goog.style", "goog.testing.MockClock", "goog.testing.StrictMock", "goog.testing.jsunit", "goog.ui.IframeMask", "goog.ui.Popup", "goog.ui.PopupBase", "goog.userAgent"], false);
goog.addDependency("ui/imagelessbuttonrenderer.js", ["goog.ui.ImagelessButtonRenderer"], ["goog.dom.classlist", "goog.ui.Button", "goog.ui.Component", "goog.ui.CustomButtonRenderer", "goog.ui.INLINE_BLOCK_CLASSNAME", "goog.ui.registry"], false);
goog.addDependency("ui/imagelessmenubuttonrenderer.js", ["goog.ui.ImagelessMenuButtonRenderer"], ["goog.dom", "goog.dom.TagName", "goog.dom.classlist", "goog.ui.INLINE_BLOCK_CLASSNAME", "goog.ui.MenuButton", "goog.ui.MenuButtonRenderer", "goog.ui.registry"], false);
goog.addDependency("ui/inputdatepicker.js", ["goog.ui.InputDatePicker"], ["goog.date.DateTime", "goog.dom", "goog.string", "goog.ui.Component", "goog.ui.DatePicker", "goog.ui.PopupBase", "goog.ui.PopupDatePicker"], false);
goog.addDependency("ui/inputdatepicker_test.js", ["goog.ui.InputDatePickerTest"], ["goog.dom", "goog.i18n.DateTimeFormat", "goog.i18n.DateTimeParse", "goog.testing.jsunit", "goog.ui.InputDatePicker"], false);
goog.addDependency("ui/itemevent.js", ["goog.ui.ItemEvent"], ["goog.events.Event"], false);
goog.addDependency("ui/keyboardshortcuthandler.js", ["goog.ui.KeyboardShortcutEvent", "goog.ui.KeyboardShortcutHandler", "goog.ui.KeyboardShortcutHandler.EventType"], ["goog.Timer", "goog.array", "goog.asserts", "goog.events", "goog.events.Event", "goog.events.EventTarget", "goog.events.EventType", "goog.events.KeyCodes", "goog.events.KeyNames", "goog.object", "goog.userAgent"], false);
goog.addDependency("ui/keyboardshortcuthandler_test.js", ["goog.ui.KeyboardShortcutHandlerTest"], ["goog.dom", "goog.events", "goog.events.BrowserEvent", "goog.events.KeyCodes", "goog.testing.MockClock", "goog.testing.PropertyReplacer", "goog.testing.StrictMock", "goog.testing.events", "goog.testing.jsunit", "goog.ui.KeyboardShortcutHandler", "goog.userAgent"], false);
goog.addDependency("ui/labelinput.js", ["goog.ui.LabelInput"], ["goog.Timer", "goog.a11y.aria", "goog.a11y.aria.State", "goog.asserts", "goog.dom", "goog.dom.classlist", "goog.events.EventHandler", "goog.events.EventType", "goog.ui.Component", "goog.userAgent"], false);
goog.addDependency("ui/labelinput_test.js", ["goog.ui.LabelInputTest"], ["goog.a11y.aria", "goog.a11y.aria.State", "goog.dom", "goog.dom.classlist", "goog.events.EventType", "goog.testing.MockClock", "goog.testing.events", "goog.testing.events.Event", "goog.testing.jsunit", "goog.ui.LabelInput", "goog.userAgent"], false);
goog.addDependency("ui/linkbuttonrenderer.js", ["goog.ui.LinkButtonRenderer"], ["goog.ui.Button", "goog.ui.FlatButtonRenderer", "goog.ui.registry"], false);
goog.addDependency("ui/media/flashobject.js", ["goog.ui.media.FlashObject", "goog.ui.media.FlashObject.ScriptAccessLevel", "goog.ui.media.FlashObject.Wmodes"], ["goog.asserts", "goog.events.Event", "goog.events.EventHandler", "goog.events.EventType", "goog.log", "goog.object", "goog.string", "goog.structs.Map", "goog.style", "goog.ui.Component", "goog.userAgent", "goog.userAgent.flash"], false);
goog.addDependency("ui/media/flashobject_test.js", ["goog.ui.media.FlashObjectTest"], ["goog.dom", "goog.dom.DomHelper", "goog.events", "goog.events.Event", "goog.events.EventType", "goog.testing.MockControl", "goog.testing.events", "goog.testing.jsunit", "goog.ui.media.FlashObject"], false);
goog.addDependency("ui/media/flickr.js", ["goog.ui.media.FlickrSet", "goog.ui.media.FlickrSetModel"], ["goog.ui.media.FlashObject", "goog.ui.media.Media", "goog.ui.media.MediaModel", "goog.ui.media.MediaRenderer"], false);
goog.addDependency("ui/media/flickr_test.js", ["goog.ui.media.FlickrSetTest"], ["goog.dom", "goog.testing.jsunit", "goog.ui.media.FlashObject", "goog.ui.media.FlickrSet", "goog.ui.media.FlickrSetModel", "goog.ui.media.Media"], false);
goog.addDependency("ui/media/googlevideo.js", ["goog.ui.media.GoogleVideo", "goog.ui.media.GoogleVideoModel"], ["goog.string", "goog.ui.media.FlashObject", "goog.ui.media.Media", "goog.ui.media.MediaModel", "goog.ui.media.MediaRenderer"], false);
goog.addDependency("ui/media/googlevideo_test.js", ["goog.ui.media.GoogleVideoTest"], ["goog.dom", "goog.testing.jsunit", "goog.ui.media.FlashObject", "goog.ui.media.GoogleVideo", "goog.ui.media.GoogleVideoModel", "goog.ui.media.Media"], false);
goog.addDependency("ui/media/media.js", ["goog.ui.media.Media", "goog.ui.media.MediaRenderer"], ["goog.asserts", "goog.style", "goog.ui.Component", "goog.ui.Control", "goog.ui.ControlRenderer"], false);
goog.addDependency("ui/media/media_test.js", ["goog.ui.media.MediaTest"], ["goog.dom", "goog.math.Size", "goog.testing.jsunit", "goog.ui.ControlRenderer", "goog.ui.media.Media", "goog.ui.media.MediaModel", "goog.ui.media.MediaRenderer"], false);
goog.addDependency("ui/media/mediamodel.js", ["goog.ui.media.MediaModel", "goog.ui.media.MediaModel.Category", "goog.ui.media.MediaModel.Credit", "goog.ui.media.MediaModel.Credit.Role", "goog.ui.media.MediaModel.Credit.Scheme", "goog.ui.media.MediaModel.Medium", "goog.ui.media.MediaModel.MimeType", "goog.ui.media.MediaModel.Player", "goog.ui.media.MediaModel.SubTitle", "goog.ui.media.MediaModel.Thumbnail"], ["goog.array"], false);
goog.addDependency("ui/media/mediamodel_test.js", ["goog.ui.media.MediaModelTest"], ["goog.testing.jsunit", "goog.ui.media.MediaModel"], false);
goog.addDependency("ui/media/mp3.js", ["goog.ui.media.Mp3"], ["goog.string", "goog.ui.media.FlashObject", "goog.ui.media.Media", "goog.ui.media.MediaRenderer"], false);
goog.addDependency("ui/media/mp3_test.js", ["goog.ui.media.Mp3Test"], ["goog.dom", "goog.testing.jsunit", "goog.ui.media.FlashObject", "goog.ui.media.Media", "goog.ui.media.MediaModel", "goog.ui.media.Mp3"], false);
goog.addDependency("ui/media/photo.js", ["goog.ui.media.Photo"], ["goog.ui.media.Media", "goog.ui.media.MediaRenderer"], false);
goog.addDependency("ui/media/photo_test.js", ["goog.ui.media.PhotoTest"], ["goog.dom", "goog.testing.jsunit", "goog.ui.media.MediaModel", "goog.ui.media.Photo"], false);
goog.addDependency("ui/media/picasa.js", ["goog.ui.media.PicasaAlbum", "goog.ui.media.PicasaAlbumModel"], ["goog.ui.media.FlashObject", "goog.ui.media.Media", "goog.ui.media.MediaModel", "goog.ui.media.MediaRenderer"], false);
goog.addDependency("ui/media/picasa_test.js", ["goog.ui.media.PicasaTest"], ["goog.dom", "goog.testing.jsunit", "goog.ui.media.FlashObject", "goog.ui.media.Media", "goog.ui.media.PicasaAlbum", "goog.ui.media.PicasaAlbumModel"], false);
goog.addDependency("ui/media/vimeo.js", ["goog.ui.media.Vimeo", "goog.ui.media.VimeoModel"], ["goog.string", "goog.ui.media.FlashObject", "goog.ui.media.Media", "goog.ui.media.MediaModel", "goog.ui.media.MediaRenderer"], false);
goog.addDependency("ui/media/vimeo_test.js", ["goog.ui.media.VimeoTest"], ["goog.dom", "goog.testing.jsunit", "goog.ui.media.FlashObject", "goog.ui.media.Media", "goog.ui.media.Vimeo", "goog.ui.media.VimeoModel"], false);
goog.addDependency("ui/media/youtube.js", ["goog.ui.media.Youtube", "goog.ui.media.YoutubeModel"], ["goog.string", "goog.ui.Component", "goog.ui.media.FlashObject", "goog.ui.media.Media", "goog.ui.media.MediaModel", "goog.ui.media.MediaRenderer"], false);
goog.addDependency("ui/media/youtube_test.js", ["goog.ui.media.YoutubeTest"], ["goog.dom", "goog.testing.jsunit", "goog.ui.media.FlashObject", "goog.ui.media.Youtube", "goog.ui.media.YoutubeModel"], false);
goog.addDependency("ui/menu.js", ["goog.ui.Menu", "goog.ui.Menu.EventType"], ["goog.math.Coordinate", "goog.string", "goog.style", "goog.ui.Component.EventType", "goog.ui.Component.State", "goog.ui.Container", "goog.ui.Container.Orientation", "goog.ui.MenuHeader", "goog.ui.MenuItem", "goog.ui.MenuRenderer", "goog.ui.MenuSeparator"], false);
goog.addDependency("ui/menu_test.js", ["goog.ui.MenuTest"], ["goog.dom", "goog.events", "goog.math.Coordinate", "goog.testing.events", "goog.testing.jsunit", "goog.ui.Component", "goog.ui.Menu"], false);
goog.addDependency("ui/menubar.js", ["goog.ui.menuBar"], ["goog.ui.Container", "goog.ui.MenuBarRenderer"], false);
goog.addDependency("ui/menubardecorator.js", ["goog.ui.menuBarDecorator"], ["goog.ui.MenuBarRenderer", "goog.ui.menuBar", "goog.ui.registry"], false);
goog.addDependency("ui/menubarrenderer.js", ["goog.ui.MenuBarRenderer"], ["goog.a11y.aria.Role", "goog.ui.Container", "goog.ui.ContainerRenderer"], false);
goog.addDependency("ui/menubase.js", ["goog.ui.MenuBase"], ["goog.events.EventHandler", "goog.events.EventType", "goog.events.KeyHandler", "goog.ui.Popup"], false);
goog.addDependency("ui/menubutton.js", ["goog.ui.MenuButton"], ["goog.Timer", "goog.a11y.aria", "goog.a11y.aria.State", "goog.asserts", "goog.dom", "goog.events.EventType", "goog.events.KeyCodes", "goog.events.KeyHandler", "goog.math.Box", "goog.math.Rect", "goog.positioning", "goog.positioning.Corner", "goog.positioning.MenuAnchoredPosition", "goog.positioning.Overflow", "goog.style", "goog.ui.Button", "goog.ui.Component", "goog.ui.IdGenerator", "goog.ui.Menu", "goog.ui.MenuButtonRenderer", "goog.ui.MenuItem", 
"goog.ui.MenuRenderer", "goog.ui.registry", "goog.userAgent", "goog.userAgent.product"], false);
goog.addDependency("ui/menubutton_test.js", ["goog.ui.MenuButtonTest"], ["goog.Timer", "goog.a11y.aria", "goog.a11y.aria.State", "goog.dom", "goog.events", "goog.events.Event", "goog.events.EventType", "goog.events.KeyCodes", "goog.events.KeyHandler", "goog.positioning", "goog.positioning.Corner", "goog.positioning.MenuAnchoredPosition", "goog.positioning.Overflow", "goog.style", "goog.testing.ExpectedFailures", "goog.testing.PropertyReplacer", "goog.testing.events", "goog.testing.jsunit", "goog.testing.recordFunction", 
"goog.ui.Component", "goog.ui.Menu", "goog.ui.MenuButton", "goog.ui.MenuItem", "goog.ui.SubMenu", "goog.userAgent", "goog.userAgent.product", "goog.userAgent.product.isVersion"], false);
goog.addDependency("ui/menubuttonrenderer.js", ["goog.ui.MenuButtonRenderer"], ["goog.dom", "goog.style", "goog.ui.CustomButtonRenderer", "goog.ui.INLINE_BLOCK_CLASSNAME", "goog.ui.Menu", "goog.ui.MenuRenderer"], false);
goog.addDependency("ui/menubuttonrenderer_test.js", ["goog.ui.MenuButtonRendererTest"], ["goog.a11y.aria", "goog.a11y.aria.State", "goog.dom", "goog.dom.classlist", "goog.testing.jsunit", "goog.testing.ui.rendererasserts", "goog.ui.MenuButton", "goog.ui.MenuButtonRenderer", "goog.userAgent"], false);
goog.addDependency("ui/menuheader.js", ["goog.ui.MenuHeader"], ["goog.ui.Component", "goog.ui.Control", "goog.ui.MenuHeaderRenderer", "goog.ui.registry"], false);
goog.addDependency("ui/menuheaderrenderer.js", ["goog.ui.MenuHeaderRenderer"], ["goog.ui.ControlRenderer"], false);
goog.addDependency("ui/menuitem.js", ["goog.ui.MenuItem"], ["goog.a11y.aria.Role", "goog.array", "goog.dom", "goog.dom.classlist", "goog.math.Coordinate", "goog.string", "goog.ui.Component", "goog.ui.Control", "goog.ui.MenuItemRenderer", "goog.ui.registry"], false);
goog.addDependency("ui/menuitem_test.js", ["goog.ui.MenuItemTest"], ["goog.a11y.aria", "goog.a11y.aria.Role", "goog.array", "goog.dom", "goog.dom.NodeType", "goog.dom.classlist", "goog.events.KeyCodes", "goog.math.Coordinate", "goog.testing.events", "goog.testing.jsunit", "goog.testing.recordFunction", "goog.ui.Component", "goog.ui.MenuItem", "goog.ui.MenuItemRenderer"], false);
goog.addDependency("ui/menuitemrenderer.js", ["goog.ui.MenuItemRenderer"], ["goog.a11y.aria.Role", "goog.asserts", "goog.dom", "goog.dom.classlist", "goog.ui.Component", "goog.ui.ControlRenderer"], false);
goog.addDependency("ui/menuitemrenderer_test.js", ["goog.ui.MenuItemRendererTest"], ["goog.a11y.aria", "goog.a11y.aria.Role", "goog.a11y.aria.State", "goog.dom", "goog.dom.classlist", "goog.testing.jsunit", "goog.testing.ui.rendererasserts", "goog.ui.Component", "goog.ui.MenuItem", "goog.ui.MenuItemRenderer"], false);
goog.addDependency("ui/menurenderer.js", ["goog.ui.MenuRenderer"], ["goog.a11y.aria", "goog.a11y.aria.Role", "goog.a11y.aria.State", "goog.asserts", "goog.dom", "goog.ui.ContainerRenderer", "goog.ui.Separator"], false);
goog.addDependency("ui/menuseparator.js", ["goog.ui.MenuSeparator"], ["goog.ui.MenuSeparatorRenderer", "goog.ui.Separator", "goog.ui.registry"], false);
goog.addDependency("ui/menuseparatorrenderer.js", ["goog.ui.MenuSeparatorRenderer"], ["goog.dom", "goog.dom.classlist", "goog.ui.ControlRenderer"], false);
goog.addDependency("ui/menuseparatorrenderer_test.js", ["goog.ui.MenuSeparatorRendererTest"], ["goog.dom", "goog.testing.jsunit", "goog.ui.MenuSeparator", "goog.ui.MenuSeparatorRenderer"], false);
goog.addDependency("ui/mockactivitymonitor.js", ["goog.ui.MockActivityMonitor"], ["goog.events.EventType", "goog.ui.ActivityMonitor"], false);
goog.addDependency("ui/mockactivitymonitor_test.js", ["goog.ui.MockActivityMonitorTest"], ["goog.events", "goog.functions", "goog.testing.jsunit", "goog.testing.recordFunction", "goog.ui.ActivityMonitor", "goog.ui.MockActivityMonitor"], false);
goog.addDependency("ui/modalpopup.js", ["goog.ui.ModalPopup"], ["goog.Timer", "goog.a11y.aria", "goog.a11y.aria.State", "goog.asserts", "goog.dom", "goog.dom.TagName", "goog.dom.classlist", "goog.dom.iframe", "goog.events", "goog.events.EventType", "goog.events.FocusHandler", "goog.fx.Transition", "goog.string", "goog.style", "goog.ui.Component", "goog.ui.PopupBase", "goog.userAgent"], false);
goog.addDependency("ui/modalpopup_test.js", ["goog.ui.ModalPopupTest"], ["goog.a11y.aria", "goog.a11y.aria.State", "goog.dispose", "goog.dom", "goog.events", "goog.events.EventTarget", "goog.fx.Transition", "goog.fx.css3", "goog.string", "goog.style", "goog.testing.MockClock", "goog.testing.jsunit", "goog.ui.ModalPopup", "goog.ui.PopupBase"], false);
goog.addDependency("ui/nativebuttonrenderer.js", ["goog.ui.NativeButtonRenderer"], ["goog.asserts", "goog.dom.classlist", "goog.events.EventType", "goog.ui.ButtonRenderer", "goog.ui.Component"], false);
goog.addDependency("ui/nativebuttonrenderer_test.js", ["goog.ui.NativeButtonRendererTest"], ["goog.dom", "goog.dom.classlist", "goog.events", "goog.testing.ExpectedFailures", "goog.testing.events", "goog.testing.jsunit", "goog.testing.ui.rendererasserts", "goog.ui.Button", "goog.ui.Component", "goog.ui.NativeButtonRenderer", "goog.userAgent"], false);
goog.addDependency("ui/option.js", ["goog.ui.Option"], ["goog.ui.Component", "goog.ui.MenuItem", "goog.ui.registry"], false);
goog.addDependency("ui/palette.js", ["goog.ui.Palette"], ["goog.array", "goog.dom", "goog.events", "goog.events.EventType", "goog.events.KeyCodes", "goog.math.Size", "goog.ui.Component", "goog.ui.Control", "goog.ui.PaletteRenderer", "goog.ui.SelectionModel"], false);
goog.addDependency("ui/palette_test.js", ["goog.ui.PaletteTest"], ["goog.a11y.aria", "goog.dom", "goog.events", "goog.events.EventType", "goog.events.KeyCodes", "goog.events.KeyEvent", "goog.testing.events.Event", "goog.testing.jsunit", "goog.testing.recordFunction", "goog.ui.Component", "goog.ui.Container", "goog.ui.Palette"], false);
goog.addDependency("ui/paletterenderer.js", ["goog.ui.PaletteRenderer"], ["goog.a11y.aria", "goog.a11y.aria.Role", "goog.a11y.aria.State", "goog.array", "goog.asserts", "goog.dom", "goog.dom.NodeIterator", "goog.dom.NodeType", "goog.dom.TagName", "goog.dom.classlist", "goog.iter", "goog.style", "goog.ui.ControlRenderer", "goog.userAgent"], false);
goog.addDependency("ui/paletterenderer_test.js", ["goog.ui.PaletteRendererTest"], ["goog.a11y.aria", "goog.a11y.aria.Role", "goog.a11y.aria.State", "goog.array", "goog.dom", "goog.testing.jsunit", "goog.ui.Palette", "goog.ui.PaletteRenderer"], false);
goog.addDependency("ui/plaintextspellchecker.js", ["goog.ui.PlainTextSpellChecker"], ["goog.Timer", "goog.a11y.aria", "goog.asserts", "goog.dom", "goog.events.EventHandler", "goog.events.EventType", "goog.events.KeyCodes", "goog.events.KeyHandler", "goog.spell.SpellCheck", "goog.style", "goog.ui.AbstractSpellChecker", "goog.ui.Component", "goog.userAgent"], false);
goog.addDependency("ui/plaintextspellchecker_test.js", ["goog.ui.PlainTextSpellCheckerTest"], ["goog.Timer", "goog.dom", "goog.events.KeyCodes", "goog.spell.SpellCheck", "goog.testing.events", "goog.testing.jsunit", "goog.ui.PlainTextSpellChecker"], false);
goog.addDependency("ui/popup.js", ["goog.ui.Popup", "goog.ui.Popup.AbsolutePosition", "goog.ui.Popup.AnchoredPosition", "goog.ui.Popup.AnchoredViewPortPosition", "goog.ui.Popup.ClientPosition", "goog.ui.Popup.Overflow", "goog.ui.Popup.ViewPortClientPosition", "goog.ui.Popup.ViewPortPosition"], ["goog.math.Box", "goog.positioning.AbsolutePosition", "goog.positioning.AnchoredPosition", "goog.positioning.AnchoredViewportPosition", "goog.positioning.ClientPosition", "goog.positioning.Corner", "goog.positioning.Overflow", 
"goog.positioning.ViewportClientPosition", "goog.positioning.ViewportPosition", "goog.style", "goog.ui.PopupBase"], false);
goog.addDependency("ui/popup_test.js", ["goog.ui.PopupTest"], ["goog.positioning.AnchoredPosition", "goog.positioning.Corner", "goog.style", "goog.testing.jsunit", "goog.ui.Popup", "goog.userAgent"], false);
goog.addDependency("ui/popupbase.js", ["goog.ui.PopupBase", "goog.ui.PopupBase.EventType", "goog.ui.PopupBase.Type"], ["goog.Timer", "goog.array", "goog.dom", "goog.events", "goog.events.EventHandler", "goog.events.EventTarget", "goog.events.EventType", "goog.events.KeyCodes", "goog.fx.Transition", "goog.style", "goog.userAgent"], false);
goog.addDependency("ui/popupbase_test.js", ["goog.ui.PopupBaseTest"], ["goog.dom", "goog.events", "goog.events.EventTarget", "goog.events.EventType", "goog.events.KeyCodes", "goog.fx.Transition", "goog.fx.css3", "goog.testing.MockClock", "goog.testing.events", "goog.testing.events.Event", "goog.testing.jsunit", "goog.ui.PopupBase"], false);
goog.addDependency("ui/popupcolorpicker.js", ["goog.ui.PopupColorPicker"], ["goog.asserts", "goog.dom.classlist", "goog.events.EventType", "goog.positioning.AnchoredPosition", "goog.positioning.Corner", "goog.ui.ColorPicker", "goog.ui.Component", "goog.ui.Popup"], false);
goog.addDependency("ui/popupcolorpicker_test.js", ["goog.ui.PopupColorPickerTest"], ["goog.dom", "goog.events", "goog.testing.events", "goog.testing.jsunit", "goog.ui.ColorPicker", "goog.ui.PopupColorPicker"], false);
goog.addDependency("ui/popupdatepicker.js", ["goog.ui.PopupDatePicker"], ["goog.events.EventType", "goog.positioning.AnchoredPosition", "goog.positioning.Corner", "goog.positioning.Overflow", "goog.style", "goog.ui.Component", "goog.ui.DatePicker", "goog.ui.Popup", "goog.ui.PopupBase"], false);
goog.addDependency("ui/popupdatepicker_test.js", ["goog.ui.PopupDatePickerTest"], ["goog.events", "goog.testing.jsunit", "goog.testing.recordFunction", "goog.ui.PopupBase", "goog.ui.PopupDatePicker"], false);
goog.addDependency("ui/popupmenu.js", ["goog.ui.PopupMenu"], ["goog.events.EventType", "goog.positioning.AnchoredViewportPosition", "goog.positioning.Corner", "goog.positioning.MenuAnchoredPosition", "goog.positioning.Overflow", "goog.positioning.ViewportClientPosition", "goog.structs.Map", "goog.style", "goog.ui.Component", "goog.ui.Menu", "goog.ui.PopupBase", "goog.userAgent"], false);
goog.addDependency("ui/popupmenu_test.js", ["goog.ui.PopupMenuTest"], ["goog.dom", "goog.events.EventHandler", "goog.events.EventType", "goog.math.Box", "goog.math.Coordinate", "goog.positioning.Corner", "goog.style", "goog.testing.jsunit", "goog.ui.Menu", "goog.ui.MenuItem", "goog.ui.PopupMenu"], false);
goog.addDependency("ui/progressbar.js", ["goog.ui.ProgressBar", "goog.ui.ProgressBar.Orientation"], ["goog.a11y.aria", "goog.asserts", "goog.dom", "goog.dom.classlist", "goog.events", "goog.events.EventType", "goog.ui.Component", "goog.ui.RangeModel", "goog.userAgent"], false);
goog.addDependency("ui/prompt.js", ["goog.ui.Prompt"], ["goog.Timer", "goog.dom", "goog.events", "goog.events.EventType", "goog.functions", "goog.html.SafeHtml", "goog.html.legacyconversions", "goog.ui.Component", "goog.ui.Dialog", "goog.userAgent"], false);
goog.addDependency("ui/prompt_test.js", ["goog.ui.PromptTest"], ["goog.dom.selection", "goog.events.InputHandler", "goog.events.KeyCodes", "goog.functions", "goog.string", "goog.testing.events", "goog.testing.jsunit", "goog.ui.BidiInput", "goog.ui.Dialog", "goog.ui.Prompt", "goog.userAgent", "goog.userAgent.product"], false);
goog.addDependency("ui/rangemodel.js", ["goog.ui.RangeModel"], ["goog.events.EventTarget", "goog.ui.Component"], false);
goog.addDependency("ui/rangemodel_test.js", ["goog.ui.RangeModelTest"], ["goog.testing.jsunit", "goog.ui.RangeModel"], false);
goog.addDependency("ui/ratings.js", ["goog.ui.Ratings", "goog.ui.Ratings.EventType"], ["goog.a11y.aria", "goog.a11y.aria.Role", "goog.a11y.aria.State", "goog.asserts", "goog.dom.classlist", "goog.events.EventType", "goog.ui.Component"], false);
goog.addDependency("ui/registry.js", ["goog.ui.registry"], ["goog.asserts", "goog.dom.classlist"], false);
goog.addDependency("ui/registry_test.js", ["goog.ui.registryTest"], ["goog.object", "goog.testing.jsunit", "goog.ui.registry"], false);
goog.addDependency("ui/richtextspellchecker.js", ["goog.ui.RichTextSpellChecker"], ["goog.Timer", "goog.asserts", "goog.dom", "goog.dom.NodeType", "goog.dom.Range", "goog.events.EventHandler", "goog.events.EventType", "goog.events.KeyCodes", "goog.events.KeyHandler", "goog.math.Coordinate", "goog.spell.SpellCheck", "goog.string.StringBuffer", "goog.style", "goog.ui.AbstractSpellChecker", "goog.ui.Component", "goog.ui.PopupMenu"], false);
goog.addDependency("ui/richtextspellchecker_test.js", ["goog.ui.RichTextSpellCheckerTest"], ["goog.dom.Range", "goog.dom.classlist", "goog.events.KeyCodes", "goog.object", "goog.spell.SpellCheck", "goog.testing.MockClock", "goog.testing.events", "goog.testing.jsunit", "goog.ui.RichTextSpellChecker"], false);
goog.addDependency("ui/roundedpanel.js", ["goog.ui.BaseRoundedPanel", "goog.ui.CssRoundedPanel", "goog.ui.GraphicsRoundedPanel", "goog.ui.RoundedPanel", "goog.ui.RoundedPanel.Corner"], ["goog.asserts", "goog.dom", "goog.dom.classlist", "goog.graphics", "goog.graphics.Path", "goog.graphics.SolidFill", "goog.graphics.Stroke", "goog.math", "goog.math.Coordinate", "goog.style", "goog.ui.Component", "goog.userAgent"], false);
goog.addDependency("ui/roundedpanel_test.js", ["goog.ui.RoundedPanelTest"], ["goog.testing.jsunit", "goog.ui.CssRoundedPanel", "goog.ui.GraphicsRoundedPanel", "goog.ui.RoundedPanel", "goog.userAgent"], false);
goog.addDependency("ui/roundedtabrenderer.js", ["goog.ui.RoundedTabRenderer"], ["goog.dom", "goog.ui.Tab", "goog.ui.TabBar", "goog.ui.TabRenderer", "goog.ui.registry"], false);
goog.addDependency("ui/scrollfloater.js", ["goog.ui.ScrollFloater", "goog.ui.ScrollFloater.EventType"], ["goog.array", "goog.asserts", "goog.dom", "goog.dom.classlist", "goog.events.EventType", "goog.style", "goog.ui.Component", "goog.userAgent"], false);
goog.addDependency("ui/scrollfloater_test.js", ["goog.ui.ScrollFloaterTest"], ["goog.dom", "goog.events", "goog.style", "goog.testing.jsunit", "goog.ui.ScrollFloater"], false);
goog.addDependency("ui/select.js", ["goog.ui.Select"], ["goog.a11y.aria", "goog.a11y.aria.Role", "goog.a11y.aria.State", "goog.array", "goog.events.EventType", "goog.ui.Component", "goog.ui.IdGenerator", "goog.ui.MenuButton", "goog.ui.MenuItem", "goog.ui.MenuRenderer", "goog.ui.SelectionModel", "goog.ui.registry"], false);
goog.addDependency("ui/select_test.js", ["goog.ui.SelectTest"], ["goog.a11y.aria", "goog.a11y.aria.Role", "goog.a11y.aria.State", "goog.dom", "goog.events", "goog.testing.jsunit", "goog.testing.recordFunction", "goog.ui.Component", "goog.ui.CustomButtonRenderer", "goog.ui.Menu", "goog.ui.MenuItem", "goog.ui.Select", "goog.ui.Separator"], false);
goog.addDependency("ui/selectionmenubutton.js", ["goog.ui.SelectionMenuButton", "goog.ui.SelectionMenuButton.SelectionState"], ["goog.events.EventType", "goog.style", "goog.ui.Component", "goog.ui.MenuButton", "goog.ui.MenuItem", "goog.ui.registry"], false);
goog.addDependency("ui/selectionmenubutton_test.js", ["goog.ui.SelectionMenuButtonTest"], ["goog.dom", "goog.events", "goog.testing.events", "goog.testing.jsunit", "goog.ui.Component", "goog.ui.SelectionMenuButton"], false);
goog.addDependency("ui/selectionmodel.js", ["goog.ui.SelectionModel"], ["goog.array", "goog.events.EventTarget", "goog.events.EventType"], false);
goog.addDependency("ui/selectionmodel_test.js", ["goog.ui.SelectionModelTest"], ["goog.array", "goog.testing.jsunit", "goog.testing.recordFunction", "goog.ui.SelectionModel"], false);
goog.addDependency("ui/separator.js", ["goog.ui.Separator"], ["goog.a11y.aria", "goog.asserts", "goog.ui.Component", "goog.ui.Control", "goog.ui.MenuSeparatorRenderer", "goog.ui.registry"], false);
goog.addDependency("ui/serverchart.js", ["goog.ui.ServerChart", "goog.ui.ServerChart.AxisDisplayType", "goog.ui.ServerChart.ChartType", "goog.ui.ServerChart.EncodingType", "goog.ui.ServerChart.Event", "goog.ui.ServerChart.LegendPosition", "goog.ui.ServerChart.MaximumValue", "goog.ui.ServerChart.MultiAxisAlignment", "goog.ui.ServerChart.MultiAxisType", "goog.ui.ServerChart.UriParam", "goog.ui.ServerChart.UriTooLongEvent"], ["goog.Uri", "goog.array", "goog.asserts", "goog.events.Event", "goog.string", 
"goog.ui.Component"], false);
goog.addDependency("ui/serverchart_test.js", ["goog.ui.ServerChartTest"], ["goog.Uri", "goog.events", "goog.testing.jsunit", "goog.ui.ServerChart"], false);
goog.addDependency("ui/slider.js", ["goog.ui.Slider", "goog.ui.Slider.Orientation"], ["goog.a11y.aria", "goog.a11y.aria.Role", "goog.dom", "goog.ui.SliderBase"], false);
goog.addDependency("ui/sliderbase.js", ["goog.ui.SliderBase", "goog.ui.SliderBase.AnimationFactory", "goog.ui.SliderBase.Orientation"], ["goog.Timer", "goog.a11y.aria", "goog.a11y.aria.Role", "goog.a11y.aria.State", "goog.array", "goog.asserts", "goog.dom", "goog.dom.classlist", "goog.events", "goog.events.EventType", "goog.events.KeyCodes", "goog.events.KeyHandler", "goog.events.MouseWheelHandler", "goog.functions", "goog.fx.AnimationParallelQueue", "goog.fx.Dragger", "goog.fx.Transition", "goog.fx.dom.ResizeHeight", 
"goog.fx.dom.ResizeWidth", "goog.fx.dom.Slide", "goog.math", "goog.math.Coordinate", "goog.style", "goog.style.bidi", "goog.ui.Component", "goog.ui.RangeModel"], false);
goog.addDependency("ui/sliderbase_test.js", ["goog.ui.SliderBaseTest"], ["goog.a11y.aria", "goog.a11y.aria.State", "goog.dom", "goog.dom.classlist", "goog.events", "goog.events.EventType", "goog.events.KeyCodes", "goog.fx.Animation", "goog.math.Coordinate", "goog.style", "goog.style.bidi", "goog.testing.MockClock", "goog.testing.MockControl", "goog.testing.events", "goog.testing.jsunit", "goog.testing.mockmatchers", "goog.testing.recordFunction", "goog.ui.Component", "goog.ui.SliderBase", "goog.userAgent"], 
false);
goog.addDependency("ui/splitbehavior.js", ["goog.ui.SplitBehavior", "goog.ui.SplitBehavior.DefaultHandlers"], ["goog.Disposable", "goog.asserts", "goog.dispose", "goog.dom", "goog.dom.NodeType", "goog.dom.classlist", "goog.events.EventHandler", "goog.ui.ButtonSide", "goog.ui.Component", "goog.ui.decorate", "goog.ui.registry"], false);
goog.addDependency("ui/splitbehavior_test.js", ["goog.ui.SplitBehaviorTest"], ["goog.array", "goog.dom", "goog.events", "goog.events.Event", "goog.testing.jsunit", "goog.ui.Component", "goog.ui.CustomButton", "goog.ui.Menu", "goog.ui.MenuButton", "goog.ui.MenuItem", "goog.ui.SplitBehavior", "goog.ui.decorate"], false);
goog.addDependency("ui/splitpane.js", ["goog.ui.SplitPane", "goog.ui.SplitPane.Orientation"], ["goog.asserts", "goog.dom", "goog.dom.classlist", "goog.events.EventType", "goog.fx.Dragger", "goog.math.Rect", "goog.math.Size", "goog.style", "goog.ui.Component", "goog.userAgent"], false);
goog.addDependency("ui/splitpane_test.js", ["goog.ui.SplitPaneTest"], ["goog.dom", "goog.dom.classlist", "goog.events", "goog.math.Size", "goog.style", "goog.testing.events", "goog.testing.jsunit", "goog.testing.recordFunction", "goog.ui.Component", "goog.ui.SplitPane"], false);
goog.addDependency("ui/style/app/buttonrenderer.js", ["goog.ui.style.app.ButtonRenderer"], ["goog.dom.classlist", "goog.ui.Button", "goog.ui.CustomButtonRenderer", "goog.ui.INLINE_BLOCK_CLASSNAME", "goog.ui.registry"], false);
goog.addDependency("ui/style/app/buttonrenderer_test.js", ["goog.ui.style.app.ButtonRendererTest"], ["goog.dom", "goog.testing.jsunit", "goog.testing.ui.style", "goog.ui.Button", "goog.ui.Component", "goog.ui.style.app.ButtonRenderer", "goog.userAgent"], false);
goog.addDependency("ui/style/app/menubuttonrenderer.js", ["goog.ui.style.app.MenuButtonRenderer"], ["goog.a11y.aria.Role", "goog.array", "goog.dom", "goog.style", "goog.ui.Menu", "goog.ui.MenuRenderer", "goog.ui.style.app.ButtonRenderer"], false);
goog.addDependency("ui/style/app/menubuttonrenderer_test.js", ["goog.ui.style.app.MenuButtonRendererTest"], ["goog.dom", "goog.testing.jsunit", "goog.testing.ui.style", "goog.ui.Component", "goog.ui.MenuButton", "goog.ui.style.app.MenuButtonRenderer"], false);
goog.addDependency("ui/style/app/primaryactionbuttonrenderer.js", ["goog.ui.style.app.PrimaryActionButtonRenderer"], ["goog.ui.Button", "goog.ui.registry", "goog.ui.style.app.ButtonRenderer"], false);
goog.addDependency("ui/style/app/primaryactionbuttonrenderer_test.js", ["goog.ui.style.app.PrimaryActionButtonRendererTest"], ["goog.dom", "goog.testing.jsunit", "goog.testing.ui.style", "goog.ui.Button", "goog.ui.Component", "goog.ui.style.app.PrimaryActionButtonRenderer"], false);
goog.addDependency("ui/submenu.js", ["goog.ui.SubMenu"], ["goog.Timer", "goog.asserts", "goog.dom", "goog.dom.classlist", "goog.events.KeyCodes", "goog.positioning.AnchoredViewportPosition", "goog.positioning.Corner", "goog.style", "goog.ui.Component", "goog.ui.Menu", "goog.ui.MenuItem", "goog.ui.SubMenuRenderer", "goog.ui.registry"], false);
goog.addDependency("ui/submenu_test.js", ["goog.ui.SubMenuTest"], ["goog.dom", "goog.dom.classlist", "goog.events", "goog.events.Event", "goog.events.KeyCodes", "goog.functions", "goog.positioning", "goog.positioning.Overflow", "goog.style", "goog.testing.MockClock", "goog.testing.events", "goog.testing.jsunit", "goog.ui.Component", "goog.ui.Menu", "goog.ui.MenuItem", "goog.ui.SubMenu", "goog.ui.SubMenuRenderer"], false);
goog.addDependency("ui/submenurenderer.js", ["goog.ui.SubMenuRenderer"], ["goog.a11y.aria", "goog.a11y.aria.State", "goog.asserts", "goog.dom", "goog.dom.classlist", "goog.style", "goog.ui.Menu", "goog.ui.MenuItemRenderer"], false);
goog.addDependency("ui/tab.js", ["goog.ui.Tab"], ["goog.ui.Component", "goog.ui.Control", "goog.ui.TabRenderer", "goog.ui.registry"], false);
goog.addDependency("ui/tab_test.js", ["goog.ui.TabTest"], ["goog.dom", "goog.testing.jsunit", "goog.ui.Component", "goog.ui.Tab", "goog.ui.TabRenderer"], false);
goog.addDependency("ui/tabbar.js", ["goog.ui.TabBar", "goog.ui.TabBar.Location"], ["goog.ui.Component.EventType", "goog.ui.Container", "goog.ui.Container.Orientation", "goog.ui.Tab", "goog.ui.TabBarRenderer", "goog.ui.registry"], false);
goog.addDependency("ui/tabbar_test.js", ["goog.ui.TabBarTest"], ["goog.dom", "goog.events", "goog.events.Event", "goog.events.EventType", "goog.events.KeyCodes", "goog.testing.jsunit", "goog.ui.Component", "goog.ui.Container", "goog.ui.Tab", "goog.ui.TabBar", "goog.ui.TabBarRenderer"], false);
goog.addDependency("ui/tabbarrenderer.js", ["goog.ui.TabBarRenderer"], ["goog.a11y.aria.Role", "goog.object", "goog.ui.ContainerRenderer"], false);
goog.addDependency("ui/tabbarrenderer_test.js", ["goog.ui.TabBarRendererTest"], ["goog.a11y.aria.Role", "goog.dom", "goog.dom.classlist", "goog.testing.jsunit", "goog.testing.ui.rendererasserts", "goog.ui.Container", "goog.ui.TabBar", "goog.ui.TabBarRenderer"], false);
goog.addDependency("ui/tablesorter.js", ["goog.ui.TableSorter", "goog.ui.TableSorter.EventType"], ["goog.array", "goog.dom", "goog.dom.TagName", "goog.dom.classlist", "goog.events.EventType", "goog.functions", "goog.ui.Component"], false);
goog.addDependency("ui/tablesorter_test.js", ["goog.ui.TableSorterTest"], ["goog.array", "goog.dom", "goog.dom.classlist", "goog.testing.events", "goog.testing.jsunit", "goog.ui.TableSorter"], false);
goog.addDependency("ui/tabpane.js", ["goog.ui.TabPane", "goog.ui.TabPane.Events", "goog.ui.TabPane.TabLocation", "goog.ui.TabPane.TabPage", "goog.ui.TabPaneEvent"], ["goog.asserts", "goog.dom", "goog.dom.classlist", "goog.events", "goog.events.Event", "goog.events.EventTarget", "goog.events.EventType", "goog.events.KeyCodes", "goog.style"], false);
goog.addDependency("ui/tabpane_test.js", ["goog.ui.TabPaneTest"], ["goog.dom", "goog.testing.jsunit", "goog.ui.TabPane"], false);
goog.addDependency("ui/tabrenderer.js", ["goog.ui.TabRenderer"], ["goog.a11y.aria.Role", "goog.ui.Component", "goog.ui.ControlRenderer"], false);
goog.addDependency("ui/tabrenderer_test.js", ["goog.ui.TabRendererTest"], ["goog.a11y.aria.Role", "goog.dom", "goog.dom.classlist", "goog.testing.dom", "goog.testing.jsunit", "goog.testing.ui.rendererasserts", "goog.ui.Tab", "goog.ui.TabRenderer"], false);
goog.addDependency("ui/textarea.js", ["goog.ui.Textarea", "goog.ui.Textarea.EventType"], ["goog.asserts", "goog.dom", "goog.dom.classlist", "goog.events.EventType", "goog.style", "goog.ui.Control", "goog.ui.TextareaRenderer", "goog.userAgent"], false);
goog.addDependency("ui/textarea_test.js", ["goog.ui.TextareaTest"], ["goog.dom", "goog.dom.classlist", "goog.events", "goog.style", "goog.testing.ExpectedFailures", "goog.testing.events.EventObserver", "goog.testing.jsunit", "goog.ui.Textarea", "goog.ui.TextareaRenderer", "goog.userAgent", "goog.userAgent.product"], false);
goog.addDependency("ui/textarearenderer.js", ["goog.ui.TextareaRenderer"], ["goog.dom.TagName", "goog.ui.Component", "goog.ui.ControlRenderer"], false);
goog.addDependency("ui/togglebutton.js", ["goog.ui.ToggleButton"], ["goog.ui.Button", "goog.ui.Component", "goog.ui.CustomButtonRenderer", "goog.ui.registry"], false);
goog.addDependency("ui/toolbar.js", ["goog.ui.Toolbar"], ["goog.ui.Container", "goog.ui.ToolbarRenderer"], false);
goog.addDependency("ui/toolbar_test.js", ["goog.ui.ToolbarTest"], ["goog.a11y.aria", "goog.dom", "goog.events.EventType", "goog.testing.events", "goog.testing.events.Event", "goog.testing.jsunit", "goog.ui.Toolbar", "goog.ui.ToolbarMenuButton"], false);
goog.addDependency("ui/toolbarbutton.js", ["goog.ui.ToolbarButton"], ["goog.ui.Button", "goog.ui.ToolbarButtonRenderer", "goog.ui.registry"], false);
goog.addDependency("ui/toolbarbuttonrenderer.js", ["goog.ui.ToolbarButtonRenderer"], ["goog.ui.CustomButtonRenderer"], false);
goog.addDependency("ui/toolbarcolormenubutton.js", ["goog.ui.ToolbarColorMenuButton"], ["goog.ui.ColorMenuButton", "goog.ui.ToolbarColorMenuButtonRenderer", "goog.ui.registry"], false);
goog.addDependency("ui/toolbarcolormenubuttonrenderer.js", ["goog.ui.ToolbarColorMenuButtonRenderer"], ["goog.asserts", "goog.dom.classlist", "goog.ui.ColorMenuButtonRenderer", "goog.ui.MenuButtonRenderer", "goog.ui.ToolbarMenuButtonRenderer"], false);
goog.addDependency("ui/toolbarcolormenubuttonrenderer_test.js", ["goog.ui.ToolbarColorMenuButtonRendererTest"], ["goog.dom", "goog.testing.jsunit", "goog.testing.ui.RendererHarness", "goog.testing.ui.rendererasserts", "goog.ui.ToolbarColorMenuButton", "goog.ui.ToolbarColorMenuButtonRenderer"], false);
goog.addDependency("ui/toolbarmenubutton.js", ["goog.ui.ToolbarMenuButton"], ["goog.ui.MenuButton", "goog.ui.ToolbarMenuButtonRenderer", "goog.ui.registry"], false);
goog.addDependency("ui/toolbarmenubuttonrenderer.js", ["goog.ui.ToolbarMenuButtonRenderer"], ["goog.ui.MenuButtonRenderer"], false);
goog.addDependency("ui/toolbarrenderer.js", ["goog.ui.ToolbarRenderer"], ["goog.a11y.aria.Role", "goog.ui.Container", "goog.ui.ContainerRenderer", "goog.ui.Separator", "goog.ui.ToolbarSeparatorRenderer"], false);
goog.addDependency("ui/toolbarselect.js", ["goog.ui.ToolbarSelect"], ["goog.ui.Select", "goog.ui.ToolbarMenuButtonRenderer", "goog.ui.registry"], false);
goog.addDependency("ui/toolbarseparator.js", ["goog.ui.ToolbarSeparator"], ["goog.ui.Separator", "goog.ui.ToolbarSeparatorRenderer", "goog.ui.registry"], false);
goog.addDependency("ui/toolbarseparatorrenderer.js", ["goog.ui.ToolbarSeparatorRenderer"], ["goog.asserts", "goog.dom.classlist", "goog.ui.INLINE_BLOCK_CLASSNAME", "goog.ui.MenuSeparatorRenderer"], false);
goog.addDependency("ui/toolbarseparatorrenderer_test.js", ["goog.ui.ToolbarSeparatorRendererTest"], ["goog.dom", "goog.dom.classlist", "goog.testing.jsunit", "goog.ui.Component", "goog.ui.INLINE_BLOCK_CLASSNAME", "goog.ui.ToolbarSeparator", "goog.ui.ToolbarSeparatorRenderer"], false);
goog.addDependency("ui/toolbartogglebutton.js", ["goog.ui.ToolbarToggleButton"], ["goog.ui.ToggleButton", "goog.ui.ToolbarButtonRenderer", "goog.ui.registry"], false);
goog.addDependency("ui/tooltip.js", ["goog.ui.Tooltip", "goog.ui.Tooltip.CursorTooltipPosition", "goog.ui.Tooltip.ElementTooltipPosition", "goog.ui.Tooltip.State"], ["goog.Timer", "goog.array", "goog.dom", "goog.dom.safe", "goog.events", "goog.events.EventType", "goog.html.legacyconversions", "goog.math.Box", "goog.math.Coordinate", "goog.positioning", "goog.positioning.AnchoredPosition", "goog.positioning.Corner", "goog.positioning.Overflow", "goog.positioning.OverflowStatus", "goog.positioning.ViewportPosition", 
"goog.structs.Set", "goog.style", "goog.ui.Popup", "goog.ui.PopupBase"], false);
goog.addDependency("ui/tooltip_test.js", ["goog.ui.TooltipTest"], ["goog.dom", "goog.events.Event", "goog.events.EventHandler", "goog.events.EventType", "goog.html.testing", "goog.math.Coordinate", "goog.positioning.AbsolutePosition", "goog.style", "goog.testing.MockClock", "goog.testing.PropertyReplacer", "goog.testing.TestQueue", "goog.testing.events", "goog.testing.jsunit", "goog.ui.PopupBase", "goog.ui.Tooltip", "goog.userAgent"], false);
goog.addDependency("ui/tree/basenode.js", ["goog.ui.tree.BaseNode", "goog.ui.tree.BaseNode.EventType"], ["goog.Timer", "goog.a11y.aria", "goog.asserts", "goog.dom.safe", "goog.events.Event", "goog.events.KeyCodes", "goog.html.SafeHtml", "goog.html.SafeStyle", "goog.html.legacyconversions", "goog.string", "goog.string.StringBuffer", "goog.style", "goog.ui.Component"], false);
goog.addDependency("ui/tree/basenode_test.js", ["goog.ui.tree.BaseNodeTest"], ["goog.dom", "goog.dom.classlist", "goog.html.legacyconversions", "goog.html.testing", "goog.testing.PropertyReplacer", "goog.testing.jsunit", "goog.ui.Component", "goog.ui.tree.BaseNode", "goog.ui.tree.TreeControl", "goog.ui.tree.TreeNode"], false);
goog.addDependency("ui/tree/treecontrol.js", ["goog.ui.tree.TreeControl"], ["goog.a11y.aria", "goog.asserts", "goog.dom.classlist", "goog.events.EventType", "goog.events.FocusHandler", "goog.events.KeyHandler", "goog.html.SafeHtml", "goog.log", "goog.ui.tree.BaseNode", "goog.ui.tree.TreeNode", "goog.ui.tree.TypeAhead", "goog.userAgent"], false);
goog.addDependency("ui/tree/treecontrol_test.js", ["goog.ui.tree.TreeControlTest"], ["goog.dom", "goog.testing.jsunit", "goog.ui.tree.TreeControl"], false);
goog.addDependency("ui/tree/treenode.js", ["goog.ui.tree.TreeNode"], ["goog.ui.tree.BaseNode"], false);
goog.addDependency("ui/tree/typeahead.js", ["goog.ui.tree.TypeAhead", "goog.ui.tree.TypeAhead.Offset"], ["goog.array", "goog.events.KeyCodes", "goog.string", "goog.structs.Trie"], false);
goog.addDependency("ui/tree/typeahead_test.js", ["goog.ui.tree.TypeAheadTest"], ["goog.dom", "goog.events.KeyCodes", "goog.testing.jsunit", "goog.ui.tree.TreeControl", "goog.ui.tree.TypeAhead"], false);
goog.addDependency("ui/tristatemenuitem.js", ["goog.ui.TriStateMenuItem", "goog.ui.TriStateMenuItem.State"], ["goog.dom.classlist", "goog.ui.Component", "goog.ui.MenuItem", "goog.ui.TriStateMenuItemRenderer", "goog.ui.registry"], false);
goog.addDependency("ui/tristatemenuitemrenderer.js", ["goog.ui.TriStateMenuItemRenderer"], ["goog.asserts", "goog.dom.classlist", "goog.ui.MenuItemRenderer"], false);
goog.addDependency("ui/twothumbslider.js", ["goog.ui.TwoThumbSlider"], ["goog.a11y.aria", "goog.a11y.aria.Role", "goog.dom", "goog.ui.SliderBase"], false);
goog.addDependency("ui/twothumbslider_test.js", ["goog.ui.TwoThumbSliderTest"], ["goog.testing.jsunit", "goog.ui.SliderBase", "goog.ui.TwoThumbSlider"], false);
goog.addDependency("ui/zippy.js", ["goog.ui.Zippy", "goog.ui.Zippy.Events", "goog.ui.ZippyEvent"], ["goog.a11y.aria", "goog.a11y.aria.Role", "goog.a11y.aria.State", "goog.dom", "goog.dom.classlist", "goog.events.Event", "goog.events.EventHandler", "goog.events.EventTarget", "goog.events.EventType", "goog.events.KeyCodes", "goog.style"], false);
goog.addDependency("ui/zippy_test.js", ["goog.ui.ZippyTest"], ["goog.a11y.aria", "goog.dom", "goog.dom.classlist", "goog.events", "goog.object", "goog.testing.events", "goog.testing.jsunit", "goog.ui.Zippy"], false);
goog.addDependency("uri/uri.js", ["goog.Uri", "goog.Uri.QueryData"], ["goog.array", "goog.string", "goog.structs", "goog.structs.Map", "goog.uri.utils", "goog.uri.utils.ComponentIndex", "goog.uri.utils.StandardQueryParam"], false);
goog.addDependency("uri/uri_test.js", ["goog.UriTest"], ["goog.Uri", "goog.testing.jsunit"], false);
goog.addDependency("uri/utils.js", ["goog.uri.utils", "goog.uri.utils.ComponentIndex", "goog.uri.utils.QueryArray", "goog.uri.utils.QueryValue", "goog.uri.utils.StandardQueryParam"], ["goog.asserts", "goog.string", "goog.userAgent"], false);
goog.addDependency("uri/utils_test.js", ["goog.uri.utilsTest"], ["goog.functions", "goog.string", "goog.testing.PropertyReplacer", "goog.testing.jsunit", "goog.uri.utils"], false);
goog.addDependency("useragent/adobereader.js", ["goog.userAgent.adobeReader"], ["goog.string", "goog.userAgent"], false);
goog.addDependency("useragent/adobereader_test.js", ["goog.userAgent.adobeReaderTest"], ["goog.testing.jsunit", "goog.userAgent.adobeReader"], false);
goog.addDependency("useragent/flash.js", ["goog.userAgent.flash"], ["goog.string"], false);
goog.addDependency("useragent/flash_test.js", ["goog.userAgent.flashTest"], ["goog.testing.jsunit", "goog.userAgent.flash"], false);
goog.addDependency("useragent/iphoto.js", ["goog.userAgent.iphoto"], ["goog.string", "goog.userAgent"], false);
goog.addDependency("useragent/jscript.js", ["goog.userAgent.jscript"], ["goog.string"], false);
goog.addDependency("useragent/jscript_test.js", ["goog.userAgent.jscriptTest"], ["goog.testing.jsunit", "goog.userAgent.jscript"], false);
goog.addDependency("useragent/keyboard.js", ["goog.userAgent.keyboard"], ["goog.userAgent", "goog.userAgent.product"], false);
goog.addDependency("useragent/keyboard_test.js", ["goog.userAgent.keyboardTest"], ["goog.labs.userAgent.testAgents", "goog.labs.userAgent.util", "goog.testing.MockUserAgent", "goog.testing.jsunit", "goog.userAgent.keyboard", "goog.userAgentTestUtil"], false);
goog.addDependency("useragent/picasa.js", ["goog.userAgent.picasa"], ["goog.string", "goog.userAgent"], false);
goog.addDependency("useragent/platform.js", ["goog.userAgent.platform"], ["goog.string", "goog.userAgent"], false);
goog.addDependency("useragent/platform_test.js", ["goog.userAgent.platformTest"], ["goog.testing.MockUserAgent", "goog.testing.jsunit", "goog.userAgent", "goog.userAgent.platform", "goog.userAgentTestUtil"], false);
goog.addDependency("useragent/product.js", ["goog.userAgent.product"], ["goog.userAgent"], false);
goog.addDependency("useragent/product_isversion.js", ["goog.userAgent.product.isVersion"], ["goog.string", "goog.userAgent", "goog.userAgent.product"], false);
goog.addDependency("useragent/product_test.js", ["goog.userAgent.productTest"], ["goog.array", "goog.labs.userAgent.util", "goog.testing.MockUserAgent", "goog.testing.PropertyReplacer", "goog.testing.jsunit", "goog.userAgent", "goog.userAgent.product", "goog.userAgent.product.isVersion", "goog.userAgentTestUtil"], false);
goog.addDependency("useragent/useragent.js", ["goog.userAgent"], ["goog.labs.userAgent.browser", "goog.labs.userAgent.engine", "goog.labs.userAgent.platform", "goog.labs.userAgent.util", "goog.string"], false);
goog.addDependency("useragent/useragent_quirks_test.js", ["goog.userAgentQuirksTest"], ["goog.testing.jsunit", "goog.userAgent"], false);
goog.addDependency("useragent/useragent_test.js", ["goog.userAgentTest"], ["goog.array", "goog.labs.userAgent.testAgents", "goog.labs.userAgent.util", "goog.testing.PropertyReplacer", "goog.testing.jsunit", "goog.userAgent", "goog.userAgentTestUtil"], false);
goog.addDependency("useragent/useragenttestutil.js", ["goog.userAgentTestUtil", "goog.userAgentTestUtil.UserAgents"], ["goog.labs.userAgent.browser", "goog.labs.userAgent.engine", "goog.labs.userAgent.platform", "goog.userAgent", "goog.userAgent.keyboard", "goog.userAgent.platform", "goog.userAgent.product", "goog.userAgent.product.isVersion"], false);
goog.addDependency("vec/float32array.js", ["goog.vec.Float32Array"], [], false);
goog.addDependency("vec/float64array.js", ["goog.vec.Float64Array"], [], false);
goog.addDependency("vec/mat3.js", ["goog.vec.Mat3"], ["goog.vec"], false);
goog.addDependency("vec/mat3d.js", ["goog.vec.mat3d", "goog.vec.mat3d.Type"], ["goog.vec"], false);
goog.addDependency("vec/mat3f.js", ["goog.vec.mat3f", "goog.vec.mat3f.Type"], ["goog.vec"], false);
goog.addDependency("vec/mat4.js", ["goog.vec.Mat4"], ["goog.vec", "goog.vec.Vec3", "goog.vec.Vec4"], false);
goog.addDependency("vec/mat4d.js", ["goog.vec.mat4d", "goog.vec.mat4d.Type"], ["goog.vec", "goog.vec.vec3d", "goog.vec.vec4d"], false);
goog.addDependency("vec/mat4f.js", ["goog.vec.mat4f", "goog.vec.mat4f.Type"], ["goog.vec", "goog.vec.vec3f", "goog.vec.vec4f"], false);
goog.addDependency("vec/matrix3.js", ["goog.vec.Matrix3"], [], false);
goog.addDependency("vec/matrix4.js", ["goog.vec.Matrix4"], ["goog.vec", "goog.vec.Vec3", "goog.vec.Vec4"], false);
goog.addDependency("vec/quaternion.js", ["goog.vec.Quaternion"], ["goog.vec", "goog.vec.Vec3", "goog.vec.Vec4"], false);
goog.addDependency("vec/ray.js", ["goog.vec.Ray"], ["goog.vec.Vec3"], false);
goog.addDependency("vec/vec.js", ["goog.vec", "goog.vec.AnyType", "goog.vec.ArrayType", "goog.vec.Float32", "goog.vec.Float64", "goog.vec.Number"], ["goog.vec.Float32Array", "goog.vec.Float64Array"], false);
goog.addDependency("vec/vec2.js", ["goog.vec.Vec2"], ["goog.vec"], false);
goog.addDependency("vec/vec2d.js", ["goog.vec.vec2d", "goog.vec.vec2d.Type"], ["goog.vec"], false);
goog.addDependency("vec/vec2f.js", ["goog.vec.vec2f", "goog.vec.vec2f.Type"], ["goog.vec"], false);
goog.addDependency("vec/vec3.js", ["goog.vec.Vec3"], ["goog.vec"], false);
goog.addDependency("vec/vec3d.js", ["goog.vec.vec3d", "goog.vec.vec3d.Type"], ["goog.vec"], false);
goog.addDependency("vec/vec3f.js", ["goog.vec.vec3f", "goog.vec.vec3f.Type"], ["goog.vec"], false);
goog.addDependency("vec/vec4.js", ["goog.vec.Vec4"], ["goog.vec"], false);
goog.addDependency("vec/vec4d.js", ["goog.vec.vec4d", "goog.vec.vec4d.Type"], ["goog.vec"], false);
goog.addDependency("vec/vec4f.js", ["goog.vec.vec4f", "goog.vec.vec4f.Type"], ["goog.vec"], false);
goog.addDependency("webgl/webgl.js", ["goog.webgl"], [], false);
goog.addDependency("window/window.js", ["goog.window"], ["goog.string", "goog.userAgent"], false);
goog.addDependency("window/window_test.js", ["goog.windowTest"], ["goog.dom", "goog.events", "goog.string", "goog.testing.AsyncTestCase", "goog.testing.jsunit", "goog.window"], false);
/*

 Copyright (C) 2010 The Libphonenumber Authors.

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
*/
goog.provide("i18n.phonenumbers.AsYouTypeFormatter");
goog.require("goog.string.StringBuffer");
goog.require("i18n.phonenumbers.NumberFormat");
goog.require("i18n.phonenumbers.PhoneMetadata");
goog.require("i18n.phonenumbers.PhoneMetadataCollection");
goog.require("i18n.phonenumbers.PhoneNumber");
goog.require("i18n.phonenumbers.PhoneNumber.CountryCodeSource");
goog.require("i18n.phonenumbers.PhoneNumberDesc");
goog.require("i18n.phonenumbers.PhoneNumberUtil");
goog.require("i18n.phonenumbers.metadata");
i18n.phonenumbers.AsYouTypeFormatter = function(regionCode) {
  this.DIGIT_PLACEHOLDER_ = "\u2008";
  this.DIGIT_PATTERN_ = new RegExp(this.DIGIT_PLACEHOLDER_);
  this.currentOutput_ = "";
  this.formattingTemplate_ = new goog.string.StringBuffer;
  this.currentFormattingPattern_ = "";
  this.accruedInput_ = new goog.string.StringBuffer;
  this.accruedInputWithoutFormatting_ = new goog.string.StringBuffer;
  this.ableToFormat_ = true;
  this.inputHasFormatting_ = false;
  this.isCompleteNumber_ = false;
  this.isExpectingCountryCallingCode_ = false;
  this.phoneUtil_ = i18n.phonenumbers.PhoneNumberUtil.getInstance();
  this.lastMatchPosition_ = 0;
  this.originalPosition_ = 0;
  this.positionToRemember_ = 0;
  this.prefixBeforeNationalNumber_ = new goog.string.StringBuffer;
  this.shouldAddSpaceAfterNationalPrefix_ = false;
  this.extractedNationalPrefix_ = "";
  this.nationalNumber_ = new goog.string.StringBuffer;
  this.possibleFormats_ = [];
  this.defaultCountry_ = regionCode;
  this.currentMetadata_ = this.getMetadataForRegion_(this.defaultCountry_);
  this.defaultMetadata_ = this.currentMetadata_;
};
i18n.phonenumbers.AsYouTypeFormatter.SEPARATOR_BEFORE_NATIONAL_NUMBER_ = " ";
i18n.phonenumbers.AsYouTypeFormatter.EMPTY_METADATA_ = new i18n.phonenumbers.PhoneMetadata;
i18n.phonenumbers.AsYouTypeFormatter.EMPTY_METADATA_.setInternationalPrefix("NA");
i18n.phonenumbers.AsYouTypeFormatter.CHARACTER_CLASS_PATTERN_ = /\[([^\[\]])*\]/g;
i18n.phonenumbers.AsYouTypeFormatter.STANDALONE_DIGIT_PATTERN_ = /\d(?=[^,}][^,}])/g;
i18n.phonenumbers.AsYouTypeFormatter.ELIGIBLE_FORMAT_PATTERN_ = new RegExp("^[" + i18n.phonenumbers.PhoneNumberUtil.VALID_PUNCTUATION + "]*" + "(\\$\\d[" + i18n.phonenumbers.PhoneNumberUtil.VALID_PUNCTUATION + "]*)+$");
i18n.phonenumbers.AsYouTypeFormatter.NATIONAL_PREFIX_SEPARATORS_PATTERN_ = /[- ]/;
i18n.phonenumbers.AsYouTypeFormatter.MIN_LEADING_DIGITS_LENGTH_ = 3;
i18n.phonenumbers.AsYouTypeFormatter.prototype.getMetadataForRegion_ = function(regionCode) {
  var countryCallingCode = this.phoneUtil_.getCountryCodeForRegion(regionCode);
  var mainCountry = this.phoneUtil_.getRegionCodeForCountryCode(countryCallingCode);
  var metadata = this.phoneUtil_.getMetadataForRegion(mainCountry);
  if (metadata != null) {
    return metadata;
  }
  return i18n.phonenumbers.AsYouTypeFormatter.EMPTY_METADATA_;
};
i18n.phonenumbers.AsYouTypeFormatter.prototype.maybeCreateNewTemplate_ = function() {
  var possibleFormatsLength = this.possibleFormats_.length;
  for (var i = 0;i < possibleFormatsLength;++i) {
    var numberFormat = this.possibleFormats_[i];
    var pattern = numberFormat.getPatternOrDefault();
    if (this.currentFormattingPattern_ == pattern) {
      return false;
    }
    if (this.createFormattingTemplate_(numberFormat)) {
      this.currentFormattingPattern_ = pattern;
      this.shouldAddSpaceAfterNationalPrefix_ = i18n.phonenumbers.AsYouTypeFormatter.NATIONAL_PREFIX_SEPARATORS_PATTERN_.test(numberFormat.getNationalPrefixFormattingRule());
      this.lastMatchPosition_ = 0;
      return true;
    }
  }
  this.ableToFormat_ = false;
  return false;
};
i18n.phonenumbers.AsYouTypeFormatter.prototype.getAvailableFormats_ = function(leadingDigits) {
  var formatList = this.isCompleteNumber_ && this.currentMetadata_.intlNumberFormatCount() > 0 ? this.currentMetadata_.intlNumberFormatArray() : this.currentMetadata_.numberFormatArray();
  var formatListLength = formatList.length;
  for (var i = 0;i < formatListLength;++i) {
    var format = formatList[i];
    var nationalPrefixIsUsedByCountry = this.currentMetadata_.hasNationalPrefix();
    if (!nationalPrefixIsUsedByCountry || this.isCompleteNumber_ || format.getNationalPrefixOptionalWhenFormatting() || this.phoneUtil_.formattingRuleHasFirstGroupOnly(format.getNationalPrefixFormattingRuleOrDefault())) {
      if (this.isFormatEligible_(format.getFormatOrDefault())) {
        this.possibleFormats_.push(format);
      }
    }
  }
  this.narrowDownPossibleFormats_(leadingDigits);
};
i18n.phonenumbers.AsYouTypeFormatter.prototype.isFormatEligible_ = function(format) {
  return i18n.phonenumbers.AsYouTypeFormatter.ELIGIBLE_FORMAT_PATTERN_.test(format);
};
i18n.phonenumbers.AsYouTypeFormatter.prototype.narrowDownPossibleFormats_ = function(leadingDigits) {
  var possibleFormats = [];
  var indexOfLeadingDigitsPattern = leadingDigits.length - i18n.phonenumbers.AsYouTypeFormatter.MIN_LEADING_DIGITS_LENGTH_;
  var possibleFormatsLength = this.possibleFormats_.length;
  for (var i = 0;i < possibleFormatsLength;++i) {
    var format = this.possibleFormats_[i];
    if (format.leadingDigitsPatternCount() == 0) {
      possibleFormats.push(this.possibleFormats_[i]);
      continue;
    }
    var lastLeadingDigitsPattern = Math.min(indexOfLeadingDigitsPattern, format.leadingDigitsPatternCount() - 1);
    var leadingDigitsPattern = (format.getLeadingDigitsPattern(lastLeadingDigitsPattern));
    if (leadingDigits.search(leadingDigitsPattern) == 0) {
      possibleFormats.push(this.possibleFormats_[i]);
    }
  }
  this.possibleFormats_ = possibleFormats;
};
i18n.phonenumbers.AsYouTypeFormatter.prototype.createFormattingTemplate_ = function(format) {
  var numberPattern = format.getPatternOrDefault();
  if (numberPattern.indexOf("|") != -1) {
    return false;
  }
  numberPattern = numberPattern.replace(i18n.phonenumbers.AsYouTypeFormatter.CHARACTER_CLASS_PATTERN_, "\\d");
  numberPattern = numberPattern.replace(i18n.phonenumbers.AsYouTypeFormatter.STANDALONE_DIGIT_PATTERN_, "\\d");
  this.formattingTemplate_.clear();
  var tempTemplate = this.getFormattingTemplate_(numberPattern, format.getFormatOrDefault());
  if (tempTemplate.length > 0) {
    this.formattingTemplate_.append(tempTemplate);
    return true;
  }
  return false;
};
i18n.phonenumbers.AsYouTypeFormatter.prototype.getFormattingTemplate_ = function(numberPattern, numberFormat) {
  var longestPhoneNumber = "999999999999999";
  var m = longestPhoneNumber.match(numberPattern);
  var aPhoneNumber = m[0];
  if (aPhoneNumber.length < this.nationalNumber_.getLength()) {
    return "";
  }
  var template = aPhoneNumber.replace(new RegExp(numberPattern, "g"), numberFormat);
  template = template.replace(new RegExp("9", "g"), this.DIGIT_PLACEHOLDER_);
  return template;
};
i18n.phonenumbers.AsYouTypeFormatter.prototype.clear = function() {
  this.currentOutput_ = "";
  this.accruedInput_.clear();
  this.accruedInputWithoutFormatting_.clear();
  this.formattingTemplate_.clear();
  this.lastMatchPosition_ = 0;
  this.currentFormattingPattern_ = "";
  this.prefixBeforeNationalNumber_.clear();
  this.extractedNationalPrefix_ = "";
  this.nationalNumber_.clear();
  this.ableToFormat_ = true;
  this.inputHasFormatting_ = false;
  this.positionToRemember_ = 0;
  this.originalPosition_ = 0;
  this.isCompleteNumber_ = false;
  this.isExpectingCountryCallingCode_ = false;
  this.possibleFormats_ = [];
  this.shouldAddSpaceAfterNationalPrefix_ = false;
  if (this.currentMetadata_ != this.defaultMetadata_) {
    this.currentMetadata_ = this.getMetadataForRegion_(this.defaultCountry_);
  }
};
i18n.phonenumbers.AsYouTypeFormatter.prototype.inputDigit = function(nextChar) {
  this.currentOutput_ = this.inputDigitWithOptionToRememberPosition_(nextChar, false);
  return this.currentOutput_;
};
i18n.phonenumbers.AsYouTypeFormatter.prototype.inputDigitAndRememberPosition = function(nextChar) {
  this.currentOutput_ = this.inputDigitWithOptionToRememberPosition_(nextChar, true);
  return this.currentOutput_;
};
i18n.phonenumbers.AsYouTypeFormatter.prototype.inputDigitWithOptionToRememberPosition_ = function(nextChar, rememberPosition) {
  this.accruedInput_.append(nextChar);
  if (rememberPosition) {
    this.originalPosition_ = this.accruedInput_.getLength();
  }
  if (!this.isDigitOrLeadingPlusSign_(nextChar)) {
    this.ableToFormat_ = false;
    this.inputHasFormatting_ = true;
  } else {
    nextChar = this.normalizeAndAccrueDigitsAndPlusSign_(nextChar, rememberPosition);
  }
  if (!this.ableToFormat_) {
    if (this.inputHasFormatting_) {
      return this.accruedInput_.toString();
    } else {
      if (this.attemptToExtractIdd_()) {
        if (this.attemptToExtractCountryCallingCode_()) {
          return this.attemptToChoosePatternWithPrefixExtracted_();
        }
      } else {
        if (this.ableToExtractLongerNdd_()) {
          this.prefixBeforeNationalNumber_.append(i18n.phonenumbers.AsYouTypeFormatter.SEPARATOR_BEFORE_NATIONAL_NUMBER_);
          return this.attemptToChoosePatternWithPrefixExtracted_();
        }
      }
    }
    return this.accruedInput_.toString();
  }
  switch(this.accruedInputWithoutFormatting_.getLength()) {
    case 0:
    ;
    case 1:
    ;
    case 2:
      return this.accruedInput_.toString();
    case 3:
      if (this.attemptToExtractIdd_()) {
        this.isExpectingCountryCallingCode_ = true;
      } else {
        this.extractedNationalPrefix_ = this.removeNationalPrefixFromNationalNumber_();
        return this.attemptToChooseFormattingPattern_();
      }
    ;
    default:
      if (this.isExpectingCountryCallingCode_) {
        if (this.attemptToExtractCountryCallingCode_()) {
          this.isExpectingCountryCallingCode_ = false;
        }
        return this.prefixBeforeNationalNumber_.toString() + this.nationalNumber_.toString();
      }
      if (this.possibleFormats_.length > 0) {
        var tempNationalNumber = this.inputDigitHelper_(nextChar);
        var formattedNumber = this.attemptToFormatAccruedDigits_();
        if (formattedNumber.length > 0) {
          return formattedNumber;
        }
        this.narrowDownPossibleFormats_(this.nationalNumber_.toString());
        if (this.maybeCreateNewTemplate_()) {
          return this.inputAccruedNationalNumber_();
        }
        return this.ableToFormat_ ? this.appendNationalNumber_(tempNationalNumber) : this.accruedInput_.toString();
      } else {
        return this.attemptToChooseFormattingPattern_();
      }
    ;
  }
};
i18n.phonenumbers.AsYouTypeFormatter.prototype.attemptToChoosePatternWithPrefixExtracted_ = function() {
  this.ableToFormat_ = true;
  this.isExpectingCountryCallingCode_ = false;
  this.possibleFormats_ = [];
  return this.attemptToChooseFormattingPattern_();
};
i18n.phonenumbers.AsYouTypeFormatter.prototype.getExtractedNationalPrefix_ = function() {
  return this.extractedNationalPrefix_;
};
i18n.phonenumbers.AsYouTypeFormatter.prototype.ableToExtractLongerNdd_ = function() {
  if (this.extractedNationalPrefix_.length > 0) {
    var nationalNumberStr = this.nationalNumber_.toString();
    this.nationalNumber_.clear();
    this.nationalNumber_.append(this.extractedNationalPrefix_);
    this.nationalNumber_.append(nationalNumberStr);
    var prefixBeforeNationalNumberStr = this.prefixBeforeNationalNumber_.toString();
    var indexOfPreviousNdd = prefixBeforeNationalNumberStr.lastIndexOf(this.extractedNationalPrefix_);
    this.prefixBeforeNationalNumber_.clear();
    this.prefixBeforeNationalNumber_.append(prefixBeforeNationalNumberStr.substring(0, indexOfPreviousNdd));
  }
  return this.extractedNationalPrefix_ != this.removeNationalPrefixFromNationalNumber_();
};
i18n.phonenumbers.AsYouTypeFormatter.prototype.isDigitOrLeadingPlusSign_ = function(nextChar) {
  return i18n.phonenumbers.PhoneNumberUtil.CAPTURING_DIGIT_PATTERN.test(nextChar) || this.accruedInput_.getLength() == 1 && i18n.phonenumbers.PhoneNumberUtil.PLUS_CHARS_PATTERN.test(nextChar);
};
i18n.phonenumbers.AsYouTypeFormatter.prototype.attemptToFormatAccruedDigits_ = function() {
  var nationalNumber = this.nationalNumber_.toString();
  var possibleFormatsLength = this.possibleFormats_.length;
  for (var i = 0;i < possibleFormatsLength;++i) {
    var numberFormat = this.possibleFormats_[i];
    var pattern = numberFormat.getPatternOrDefault();
    var patternRegExp = new RegExp("^(?:" + pattern + ")$");
    if (patternRegExp.test(nationalNumber)) {
      this.shouldAddSpaceAfterNationalPrefix_ = i18n.phonenumbers.AsYouTypeFormatter.NATIONAL_PREFIX_SEPARATORS_PATTERN_.test(numberFormat.getNationalPrefixFormattingRule());
      var formattedNumber = nationalNumber.replace(new RegExp(pattern, "g"), numberFormat.getFormat());
      return this.appendNationalNumber_(formattedNumber);
    }
  }
  return "";
};
i18n.phonenumbers.AsYouTypeFormatter.prototype.appendNationalNumber_ = function(nationalNumber) {
  var prefixBeforeNationalNumberLength = this.prefixBeforeNationalNumber_.getLength();
  if (this.shouldAddSpaceAfterNationalPrefix_ && prefixBeforeNationalNumberLength > 0 && this.prefixBeforeNationalNumber_.toString().charAt(prefixBeforeNationalNumberLength - 1) != i18n.phonenumbers.AsYouTypeFormatter.SEPARATOR_BEFORE_NATIONAL_NUMBER_) {
    return this.prefixBeforeNationalNumber_ + i18n.phonenumbers.AsYouTypeFormatter.SEPARATOR_BEFORE_NATIONAL_NUMBER_ + nationalNumber;
  } else {
    return this.prefixBeforeNationalNumber_ + nationalNumber;
  }
};
i18n.phonenumbers.AsYouTypeFormatter.prototype.getRememberedPosition = function() {
  if (!this.ableToFormat_) {
    return this.originalPosition_;
  }
  var accruedInputIndex = 0;
  var currentOutputIndex = 0;
  var accruedInputWithoutFormatting = this.accruedInputWithoutFormatting_.toString();
  var currentOutput = this.currentOutput_.toString();
  while (accruedInputIndex < this.positionToRemember_ && currentOutputIndex < currentOutput.length) {
    if (accruedInputWithoutFormatting.charAt(accruedInputIndex) == currentOutput.charAt(currentOutputIndex)) {
      accruedInputIndex++;
    }
    currentOutputIndex++;
  }
  return currentOutputIndex;
};
i18n.phonenumbers.AsYouTypeFormatter.prototype.attemptToChooseFormattingPattern_ = function() {
  var nationalNumber = this.nationalNumber_.toString();
  if (nationalNumber.length >= i18n.phonenumbers.AsYouTypeFormatter.MIN_LEADING_DIGITS_LENGTH_) {
    this.getAvailableFormats_(nationalNumber);
    var formattedNumber = this.attemptToFormatAccruedDigits_();
    if (formattedNumber.length > 0) {
      return formattedNumber;
    }
    return this.maybeCreateNewTemplate_() ? this.inputAccruedNationalNumber_() : this.accruedInput_.toString();
  } else {
    return this.appendNationalNumber_(nationalNumber);
  }
};
i18n.phonenumbers.AsYouTypeFormatter.prototype.inputAccruedNationalNumber_ = function() {
  var nationalNumber = this.nationalNumber_.toString();
  var lengthOfNationalNumber = nationalNumber.length;
  if (lengthOfNationalNumber > 0) {
    var tempNationalNumber = "";
    for (var i = 0;i < lengthOfNationalNumber;i++) {
      tempNationalNumber = this.inputDigitHelper_(nationalNumber.charAt(i));
    }
    return this.ableToFormat_ ? this.appendNationalNumber_(tempNationalNumber) : this.accruedInput_.toString();
  } else {
    return this.prefixBeforeNationalNumber_.toString();
  }
};
i18n.phonenumbers.AsYouTypeFormatter.prototype.isNanpaNumberWithNationalPrefix_ = function() {
  if (this.currentMetadata_.getCountryCode() != 1) {
    return false;
  }
  var nationalNumber = this.nationalNumber_.toString();
  return nationalNumber.charAt(0) == "1" && nationalNumber.charAt(1) != "0" && nationalNumber.charAt(1) != "1";
};
i18n.phonenumbers.AsYouTypeFormatter.prototype.removeNationalPrefixFromNationalNumber_ = function() {
  var nationalNumber = this.nationalNumber_.toString();
  var startOfNationalNumber = 0;
  if (this.isNanpaNumberWithNationalPrefix_()) {
    startOfNationalNumber = 1;
    this.prefixBeforeNationalNumber_.append("1").append(i18n.phonenumbers.AsYouTypeFormatter.SEPARATOR_BEFORE_NATIONAL_NUMBER_);
    this.isCompleteNumber_ = true;
  } else {
    if (this.currentMetadata_.hasNationalPrefixForParsing()) {
      var nationalPrefixForParsing = new RegExp("^(?:" + this.currentMetadata_.getNationalPrefixForParsing() + ")");
      var m = nationalNumber.match(nationalPrefixForParsing);
      if (m != null && m[0] != null && m[0].length > 0) {
        this.isCompleteNumber_ = true;
        startOfNationalNumber = m[0].length;
        this.prefixBeforeNationalNumber_.append(nationalNumber.substring(0, startOfNationalNumber));
      }
    }
  }
  this.nationalNumber_.clear();
  this.nationalNumber_.append(nationalNumber.substring(startOfNationalNumber));
  return nationalNumber.substring(0, startOfNationalNumber);
};
i18n.phonenumbers.AsYouTypeFormatter.prototype.attemptToExtractIdd_ = function() {
  var accruedInputWithoutFormatting = this.accruedInputWithoutFormatting_.toString();
  var internationalPrefix = new RegExp("^(?:" + "\\" + i18n.phonenumbers.PhoneNumberUtil.PLUS_SIGN + "|" + this.currentMetadata_.getInternationalPrefix() + ")");
  var m = accruedInputWithoutFormatting.match(internationalPrefix);
  if (m != null && m[0] != null && m[0].length > 0) {
    this.isCompleteNumber_ = true;
    var startOfCountryCallingCode = m[0].length;
    this.nationalNumber_.clear();
    this.nationalNumber_.append(accruedInputWithoutFormatting.substring(startOfCountryCallingCode));
    this.prefixBeforeNationalNumber_.clear();
    this.prefixBeforeNationalNumber_.append(accruedInputWithoutFormatting.substring(0, startOfCountryCallingCode));
    if (accruedInputWithoutFormatting.charAt(0) != i18n.phonenumbers.PhoneNumberUtil.PLUS_SIGN) {
      this.prefixBeforeNationalNumber_.append(i18n.phonenumbers.AsYouTypeFormatter.SEPARATOR_BEFORE_NATIONAL_NUMBER_);
    }
    return true;
  }
  return false;
};
i18n.phonenumbers.AsYouTypeFormatter.prototype.attemptToExtractCountryCallingCode_ = function() {
  if (this.nationalNumber_.getLength() == 0) {
    return false;
  }
  var numberWithoutCountryCallingCode = new goog.string.StringBuffer;
  var countryCode = this.phoneUtil_.extractCountryCode(this.nationalNumber_, numberWithoutCountryCallingCode);
  if (countryCode == 0) {
    return false;
  }
  this.nationalNumber_.clear();
  this.nationalNumber_.append(numberWithoutCountryCallingCode.toString());
  var newRegionCode = this.phoneUtil_.getRegionCodeForCountryCode(countryCode);
  if (i18n.phonenumbers.PhoneNumberUtil.REGION_CODE_FOR_NON_GEO_ENTITY == newRegionCode) {
    this.currentMetadata_ = this.phoneUtil_.getMetadataForNonGeographicalRegion(countryCode);
  } else {
    if (newRegionCode != this.defaultCountry_) {
      this.currentMetadata_ = this.getMetadataForRegion_(newRegionCode);
    }
  }
  var countryCodeString = "" + countryCode;
  this.prefixBeforeNationalNumber_.append(countryCodeString).append(i18n.phonenumbers.AsYouTypeFormatter.SEPARATOR_BEFORE_NATIONAL_NUMBER_);
  this.extractedNationalPrefix_ = "";
  return true;
};
i18n.phonenumbers.AsYouTypeFormatter.prototype.normalizeAndAccrueDigitsAndPlusSign_ = function(nextChar, rememberPosition) {
  var normalizedChar;
  if (nextChar == i18n.phonenumbers.PhoneNumberUtil.PLUS_SIGN) {
    normalizedChar = nextChar;
    this.accruedInputWithoutFormatting_.append(nextChar);
  } else {
    normalizedChar = i18n.phonenumbers.PhoneNumberUtil.DIGIT_MAPPINGS[nextChar];
    this.accruedInputWithoutFormatting_.append(normalizedChar);
    this.nationalNumber_.append(normalizedChar);
  }
  if (rememberPosition) {
    this.positionToRemember_ = this.accruedInputWithoutFormatting_.getLength();
  }
  return normalizedChar;
};
i18n.phonenumbers.AsYouTypeFormatter.prototype.inputDigitHelper_ = function(nextChar) {
  var formattingTemplate = this.formattingTemplate_.toString();
  if (formattingTemplate.substring(this.lastMatchPosition_).search(this.DIGIT_PATTERN_) >= 0) {
    var digitPatternStart = formattingTemplate.search(this.DIGIT_PATTERN_);
    var tempTemplate = formattingTemplate.replace(this.DIGIT_PATTERN_, nextChar);
    this.formattingTemplate_.clear();
    this.formattingTemplate_.append(tempTemplate);
    this.lastMatchPosition_ = digitPatternStart;
    return tempTemplate.substring(0, this.lastMatchPosition_ + 1);
  } else {
    if (this.possibleFormats_.length == 1) {
      this.ableToFormat_ = false;
    }
    this.currentFormattingPattern_ = "";
    return this.accruedInput_.toString();
  }
};
/*

 Copyright (C) 2010 The Libphonenumber Authors.

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
*/
goog.provide("i18n.phonenumbers.Error");
goog.provide("i18n.phonenumbers.PhoneNumberFormat");
goog.provide("i18n.phonenumbers.PhoneNumberType");
goog.provide("i18n.phonenumbers.PhoneNumberUtil");
goog.provide("i18n.phonenumbers.PhoneNumberUtil.MatchType");
goog.provide("i18n.phonenumbers.PhoneNumberUtil.ValidationResult");
goog.require("goog.array");
goog.require("goog.proto2.PbLiteSerializer");
goog.require("goog.string");
goog.require("goog.string.StringBuffer");
goog.require("i18n.phonenumbers.NumberFormat");
goog.require("i18n.phonenumbers.PhoneMetadata");
goog.require("i18n.phonenumbers.PhoneMetadataCollection");
goog.require("i18n.phonenumbers.PhoneNumber");
goog.require("i18n.phonenumbers.PhoneNumber.CountryCodeSource");
goog.require("i18n.phonenumbers.PhoneNumberDesc");
goog.require("i18n.phonenumbers.metadata");
i18n.phonenumbers.PhoneNumberUtil = function() {
  this.regionToMetadataMap = {};
};
goog.addSingletonGetter(i18n.phonenumbers.PhoneNumberUtil);
i18n.phonenumbers.Error = {INVALID_COUNTRY_CODE:"Invalid country calling code", NOT_A_NUMBER:"The string supplied did not seem to be a phone number", TOO_SHORT_AFTER_IDD:"Phone number too short after IDD", TOO_SHORT_NSN:"The string supplied is too short to be a phone number", TOO_LONG:"The string supplied is too long to be a phone number"};
i18n.phonenumbers.PhoneNumberUtil.NANPA_COUNTRY_CODE_ = 1;
i18n.phonenumbers.PhoneNumberUtil.MIN_LENGTH_FOR_NSN_ = 2;
i18n.phonenumbers.PhoneNumberUtil.MAX_LENGTH_FOR_NSN_ = 17;
i18n.phonenumbers.PhoneNumberUtil.MAX_LENGTH_COUNTRY_CODE_ = 3;
i18n.phonenumbers.PhoneNumberUtil.MAX_INPUT_STRING_LENGTH_ = 250;
i18n.phonenumbers.PhoneNumberUtil.UNKNOWN_REGION_ = "ZZ";
i18n.phonenumbers.PhoneNumberUtil.COLOMBIA_MOBILE_TO_FIXED_LINE_PREFIX_ = "3";
i18n.phonenumbers.PhoneNumberUtil.MOBILE_TOKEN_MAPPINGS_ = {52:"1", 54:"9"};
i18n.phonenumbers.PhoneNumberUtil.PLUS_SIGN = "+";
i18n.phonenumbers.PhoneNumberUtil.STAR_SIGN_ = "*";
i18n.phonenumbers.PhoneNumberUtil.RFC3966_EXTN_PREFIX_ = ";ext=";
i18n.phonenumbers.PhoneNumberUtil.RFC3966_PREFIX_ = "tel:";
i18n.phonenumbers.PhoneNumberUtil.RFC3966_PHONE_CONTEXT_ = ";phone-context=";
i18n.phonenumbers.PhoneNumberUtil.RFC3966_ISDN_SUBADDRESS_ = ";isub=";
i18n.phonenumbers.PhoneNumberUtil.DIGIT_MAPPINGS = {0:"0", 1:"1", 2:"2", 3:"3", 4:"4", 5:"5", 6:"6", 7:"7", 8:"8", 9:"9", "\uff10":"0", "\uff11":"1", "\uff12":"2", "\uff13":"3", "\uff14":"4", "\uff15":"5", "\uff16":"6", "\uff17":"7", "\uff18":"8", "\uff19":"9", "\u0660":"0", "\u0661":"1", "\u0662":"2", "\u0663":"3", "\u0664":"4", "\u0665":"5", "\u0666":"6", "\u0667":"7", "\u0668":"8", "\u0669":"9", "\u06f0":"0", "\u06f1":"1", "\u06f2":"2", "\u06f3":"3", "\u06f4":"4", "\u06f5":"5", "\u06f6":"6", "\u06f7":"7", 
"\u06f8":"8", "\u06f9":"9"};
i18n.phonenumbers.PhoneNumberUtil.DIALLABLE_CHAR_MAPPINGS_ = {0:"0", 1:"1", 2:"2", 3:"3", 4:"4", 5:"5", 6:"6", 7:"7", 8:"8", 9:"9", "+":i18n.phonenumbers.PhoneNumberUtil.PLUS_SIGN, "*":"*"};
i18n.phonenumbers.PhoneNumberUtil.ALPHA_MAPPINGS_ = {"A":"2", "B":"2", "C":"2", "D":"3", "E":"3", "F":"3", "G":"4", "H":"4", "I":"4", "J":"5", "K":"5", "L":"5", "M":"6", "N":"6", "O":"6", "P":"7", "Q":"7", "R":"7", "S":"7", "T":"8", "U":"8", "V":"8", "W":"9", "X":"9", "Y":"9", "Z":"9"};
i18n.phonenumbers.PhoneNumberUtil.ALL_NORMALIZATION_MAPPINGS_ = {0:"0", 1:"1", 2:"2", 3:"3", 4:"4", 5:"5", 6:"6", 7:"7", 8:"8", 9:"9", "\uff10":"0", "\uff11":"1", "\uff12":"2", "\uff13":"3", "\uff14":"4", "\uff15":"5", "\uff16":"6", "\uff17":"7", "\uff18":"8", "\uff19":"9", "\u0660":"0", "\u0661":"1", "\u0662":"2", "\u0663":"3", "\u0664":"4", "\u0665":"5", "\u0666":"6", "\u0667":"7", "\u0668":"8", "\u0669":"9", "\u06f0":"0", "\u06f1":"1", "\u06f2":"2", "\u06f3":"3", "\u06f4":"4", "\u06f5":"5", "\u06f6":"6", 
"\u06f7":"7", "\u06f8":"8", "\u06f9":"9", "A":"2", "B":"2", "C":"2", "D":"3", "E":"3", "F":"3", "G":"4", "H":"4", "I":"4", "J":"5", "K":"5", "L":"5", "M":"6", "N":"6", "O":"6", "P":"7", "Q":"7", "R":"7", "S":"7", "T":"8", "U":"8", "V":"8", "W":"9", "X":"9", "Y":"9", "Z":"9"};
i18n.phonenumbers.PhoneNumberUtil.ALL_PLUS_NUMBER_GROUPING_SYMBOLS_ = {0:"0", 1:"1", 2:"2", 3:"3", 4:"4", 5:"5", 6:"6", 7:"7", 8:"8", 9:"9", "A":"A", "B":"B", "C":"C", "D":"D", "E":"E", "F":"F", "G":"G", "H":"H", "I":"I", "J":"J", "K":"K", "L":"L", "M":"M", "N":"N", "O":"O", "P":"P", "Q":"Q", "R":"R", "S":"S", "T":"T", "U":"U", "V":"V", "W":"W", "X":"X", "Y":"Y", "Z":"Z", "a":"A", "b":"B", "c":"C", "d":"D", "e":"E", "f":"F", "g":"G", "h":"H", "i":"I", "j":"J", "k":"K", "l":"L", "m":"M", "n":"N", 
"o":"O", "p":"P", "q":"Q", "r":"R", "s":"S", "t":"T", "u":"U", "v":"V", "w":"W", "x":"X", "y":"Y", "z":"Z", "-":"-", "\uff0d":"-", "\u2010":"-", "\u2011":"-", "\u2012":"-", "\u2013":"-", "\u2014":"-", "\u2015":"-", "\u2212":"-", "/":"/", "\uff0f":"/", " ":" ", "\u3000":" ", "\u2060":" ", ".":".", "\uff0e":"."};
i18n.phonenumbers.PhoneNumberUtil.UNIQUE_INTERNATIONAL_PREFIX_ = /[\d]+(?:[~\u2053\u223C\uFF5E][\d]+)?/;
i18n.phonenumbers.PhoneNumberUtil.VALID_PUNCTUATION = "-x\u2010-\u2015\u2212\u30fc\uff0d-\uff0f \u00a0\u00ad\u200b\u2060\u3000" + "()\uff08\uff09\uff3b\uff3d.\\[\\]/~\u2053\u223c\uff5e";
i18n.phonenumbers.PhoneNumberUtil.VALID_DIGITS_ = "0-9\uff10-\uff19\u0660-\u0669\u06f0-\u06f9";
i18n.phonenumbers.PhoneNumberUtil.VALID_ALPHA_ = "A-Za-z";
i18n.phonenumbers.PhoneNumberUtil.PLUS_CHARS_ = "+\uff0b";
i18n.phonenumbers.PhoneNumberUtil.PLUS_CHARS_PATTERN = new RegExp("[" + i18n.phonenumbers.PhoneNumberUtil.PLUS_CHARS_ + "]+");
i18n.phonenumbers.PhoneNumberUtil.LEADING_PLUS_CHARS_PATTERN_ = new RegExp("^[" + i18n.phonenumbers.PhoneNumberUtil.PLUS_CHARS_ + "]+");
i18n.phonenumbers.PhoneNumberUtil.SEPARATOR_PATTERN_ = "[" + i18n.phonenumbers.PhoneNumberUtil.VALID_PUNCTUATION + "]+";
i18n.phonenumbers.PhoneNumberUtil.CAPTURING_DIGIT_PATTERN = new RegExp("([" + i18n.phonenumbers.PhoneNumberUtil.VALID_DIGITS_ + "])");
i18n.phonenumbers.PhoneNumberUtil.VALID_START_CHAR_PATTERN_ = new RegExp("[" + i18n.phonenumbers.PhoneNumberUtil.PLUS_CHARS_ + i18n.phonenumbers.PhoneNumberUtil.VALID_DIGITS_ + "]");
i18n.phonenumbers.PhoneNumberUtil.SECOND_NUMBER_START_PATTERN_ = /[\\\/] *x/;
i18n.phonenumbers.PhoneNumberUtil.UNWANTED_END_CHAR_PATTERN_ = new RegExp("[^" + i18n.phonenumbers.PhoneNumberUtil.VALID_DIGITS_ + i18n.phonenumbers.PhoneNumberUtil.VALID_ALPHA_ + "#]+$");
i18n.phonenumbers.PhoneNumberUtil.VALID_ALPHA_PHONE_PATTERN_ = /(?:.*?[A-Za-z]){3}.*/;
i18n.phonenumbers.PhoneNumberUtil.MIN_LENGTH_PHONE_NUMBER_PATTERN_ = "[" + i18n.phonenumbers.PhoneNumberUtil.VALID_DIGITS_ + "]{" + i18n.phonenumbers.PhoneNumberUtil.MIN_LENGTH_FOR_NSN_ + "}";
i18n.phonenumbers.PhoneNumberUtil.VALID_PHONE_NUMBER_ = "[" + i18n.phonenumbers.PhoneNumberUtil.PLUS_CHARS_ + "]*(?:[" + i18n.phonenumbers.PhoneNumberUtil.VALID_PUNCTUATION + i18n.phonenumbers.PhoneNumberUtil.STAR_SIGN_ + "]*[" + i18n.phonenumbers.PhoneNumberUtil.VALID_DIGITS_ + "]){3,}[" + i18n.phonenumbers.PhoneNumberUtil.VALID_PUNCTUATION + i18n.phonenumbers.PhoneNumberUtil.STAR_SIGN_ + i18n.phonenumbers.PhoneNumberUtil.VALID_ALPHA_ + i18n.phonenumbers.PhoneNumberUtil.VALID_DIGITS_ + "]*";
i18n.phonenumbers.PhoneNumberUtil.DEFAULT_EXTN_PREFIX_ = " ext. ";
i18n.phonenumbers.PhoneNumberUtil.CAPTURING_EXTN_DIGITS_ = "([" + i18n.phonenumbers.PhoneNumberUtil.VALID_DIGITS_ + "]{1,7})";
i18n.phonenumbers.PhoneNumberUtil.EXTN_PATTERNS_FOR_PARSING_ = i18n.phonenumbers.PhoneNumberUtil.RFC3966_EXTN_PREFIX_ + i18n.phonenumbers.PhoneNumberUtil.CAPTURING_EXTN_DIGITS_ + "|" + "[ \u00a0\\t,]*" + "(?:e?xt(?:ensi(?:o\u0301?|\u00f3))?n?|\uff45?\uff58\uff54\uff4e?|" + "[,x\uff58#\uff03~\uff5e]|int|anexo|\uff49\uff4e\uff54)" + "[:\\.\uff0e]?[ \u00a0\\t,-]*" + i18n.phonenumbers.PhoneNumberUtil.CAPTURING_EXTN_DIGITS_ + "#?|" + "[- ]+([" + i18n.phonenumbers.PhoneNumberUtil.VALID_DIGITS_ + "]{1,5})#";
i18n.phonenumbers.PhoneNumberUtil.EXTN_PATTERN_ = new RegExp("(?:" + i18n.phonenumbers.PhoneNumberUtil.EXTN_PATTERNS_FOR_PARSING_ + ")$", "i");
i18n.phonenumbers.PhoneNumberUtil.VALID_PHONE_NUMBER_PATTERN_ = new RegExp("^" + i18n.phonenumbers.PhoneNumberUtil.MIN_LENGTH_PHONE_NUMBER_PATTERN_ + "$|" + "^" + i18n.phonenumbers.PhoneNumberUtil.VALID_PHONE_NUMBER_ + "(?:" + i18n.phonenumbers.PhoneNumberUtil.EXTN_PATTERNS_FOR_PARSING_ + ")?" + "$", "i");
i18n.phonenumbers.PhoneNumberUtil.NON_DIGITS_PATTERN_ = /\D+/;
i18n.phonenumbers.PhoneNumberUtil.FIRST_GROUP_PATTERN_ = /(\$\d)/;
i18n.phonenumbers.PhoneNumberUtil.NP_PATTERN_ = /\$NP/;
i18n.phonenumbers.PhoneNumberUtil.FG_PATTERN_ = /\$FG/;
i18n.phonenumbers.PhoneNumberUtil.CC_PATTERN_ = /\$CC/;
i18n.phonenumbers.PhoneNumberUtil.FIRST_GROUP_ONLY_PREFIX_PATTERN_ = /^\(?\$1\)?$/;
i18n.phonenumbers.PhoneNumberUtil.REGION_CODE_FOR_NON_GEO_ENTITY = "001";
i18n.phonenumbers.PhoneNumberFormat = {E164:0, INTERNATIONAL:1, NATIONAL:2, RFC3966:3};
i18n.phonenumbers.PhoneNumberType = {FIXED_LINE:0, MOBILE:1, FIXED_LINE_OR_MOBILE:2, TOLL_FREE:3, PREMIUM_RATE:4, SHARED_COST:5, VOIP:6, PERSONAL_NUMBER:7, PAGER:8, UAN:9, VOICEMAIL:10, UNKNOWN:-1};
i18n.phonenumbers.PhoneNumberUtil.MatchType = {NOT_A_NUMBER:0, NO_MATCH:1, SHORT_NSN_MATCH:2, NSN_MATCH:3, EXACT_MATCH:4};
i18n.phonenumbers.PhoneNumberUtil.ValidationResult = {IS_POSSIBLE:0, INVALID_COUNTRY_CODE:1, TOO_SHORT:2, TOO_LONG:3};
i18n.phonenumbers.PhoneNumberUtil.extractPossibleNumber = function(number) {
  var possibleNumber;
  var start = number.search(i18n.phonenumbers.PhoneNumberUtil.VALID_START_CHAR_PATTERN_);
  if (start >= 0) {
    possibleNumber = number.substring(start);
    possibleNumber = possibleNumber.replace(i18n.phonenumbers.PhoneNumberUtil.UNWANTED_END_CHAR_PATTERN_, "");
    var secondNumberStart = possibleNumber.search(i18n.phonenumbers.PhoneNumberUtil.SECOND_NUMBER_START_PATTERN_);
    if (secondNumberStart >= 0) {
      possibleNumber = possibleNumber.substring(0, secondNumberStart);
    }
  } else {
    possibleNumber = "";
  }
  return possibleNumber;
};
i18n.phonenumbers.PhoneNumberUtil.isViablePhoneNumber = function(number) {
  if (number.length < i18n.phonenumbers.PhoneNumberUtil.MIN_LENGTH_FOR_NSN_) {
    return false;
  }
  return i18n.phonenumbers.PhoneNumberUtil.matchesEntirely_(i18n.phonenumbers.PhoneNumberUtil.VALID_PHONE_NUMBER_PATTERN_, number);
};
i18n.phonenumbers.PhoneNumberUtil.normalize = function(number) {
  if (i18n.phonenumbers.PhoneNumberUtil.matchesEntirely_(i18n.phonenumbers.PhoneNumberUtil.VALID_ALPHA_PHONE_PATTERN_, number)) {
    return i18n.phonenumbers.PhoneNumberUtil.normalizeHelper_(number, i18n.phonenumbers.PhoneNumberUtil.ALL_NORMALIZATION_MAPPINGS_, true);
  } else {
    return i18n.phonenumbers.PhoneNumberUtil.normalizeDigitsOnly(number);
  }
};
i18n.phonenumbers.PhoneNumberUtil.normalizeSB_ = function(number) {
  var normalizedNumber = i18n.phonenumbers.PhoneNumberUtil.normalize(number.toString());
  number.clear();
  number.append(normalizedNumber);
};
i18n.phonenumbers.PhoneNumberUtil.normalizeDigitsOnly = function(number) {
  return i18n.phonenumbers.PhoneNumberUtil.normalizeHelper_(number, i18n.phonenumbers.PhoneNumberUtil.DIGIT_MAPPINGS, true);
};
i18n.phonenumbers.PhoneNumberUtil.convertAlphaCharactersInNumber = function(number) {
  return i18n.phonenumbers.PhoneNumberUtil.normalizeHelper_(number, i18n.phonenumbers.PhoneNumberUtil.ALL_NORMALIZATION_MAPPINGS_, false);
};
i18n.phonenumbers.PhoneNumberUtil.prototype.getLengthOfGeographicalAreaCode = function(number) {
  var metadata = this.getMetadataForRegion(this.getRegionCodeForNumber(number));
  if (metadata == null) {
    return 0;
  }
  if (!metadata.hasNationalPrefix() && !number.hasItalianLeadingZero()) {
    return 0;
  }
  if (!this.isNumberGeographical(number)) {
    return 0;
  }
  return this.getLengthOfNationalDestinationCode(number);
};
i18n.phonenumbers.PhoneNumberUtil.prototype.getLengthOfNationalDestinationCode = function(number) {
  var copiedProto;
  if (number.hasExtension()) {
    copiedProto = number.clone();
    copiedProto.clearExtension();
  } else {
    copiedProto = number;
  }
  var nationalSignificantNumber = this.format(copiedProto, i18n.phonenumbers.PhoneNumberFormat.INTERNATIONAL);
  var numberGroups = nationalSignificantNumber.split(i18n.phonenumbers.PhoneNumberUtil.NON_DIGITS_PATTERN_);
  if (numberGroups[0].length == 0) {
    numberGroups.shift();
  }
  if (numberGroups.length <= 2) {
    return 0;
  }
  if (this.getNumberType(number) == i18n.phonenumbers.PhoneNumberType.MOBILE) {
    var mobileToken = i18n.phonenumbers.PhoneNumberUtil.getCountryMobileToken(number.getCountryCodeOrDefault());
    if (mobileToken != "") {
      return numberGroups[2].length + mobileToken.length;
    }
  }
  return numberGroups[1].length;
};
i18n.phonenumbers.PhoneNumberUtil.getCountryMobileToken = function(countryCallingCode) {
  return i18n.phonenumbers.PhoneNumberUtil.MOBILE_TOKEN_MAPPINGS_[countryCallingCode] || "";
};
i18n.phonenumbers.PhoneNumberUtil.prototype.getSupportedRegions = function() {
  return goog.array.filter(Object.keys(i18n.phonenumbers.metadata.countryToMetadata), function(regionCode) {
    return isNaN(regionCode);
  });
};
i18n.phonenumbers.PhoneNumberUtil.prototype.getSupportedGlobalNetworkCallingCodes = function() {
  var callingCodesAsStrings = goog.array.filter(Object.keys(i18n.phonenumbers.metadata.countryToMetadata), function(regionCode) {
    return!isNaN(regionCode);
  });
  return goog.array.map(callingCodesAsStrings, function(callingCode) {
    return parseInt(callingCode, 10);
  });
};
i18n.phonenumbers.PhoneNumberUtil.normalizeHelper_ = function(number, normalizationReplacements, removeNonMatches) {
  var normalizedNumber = new goog.string.StringBuffer;
  var character;
  var newDigit;
  var numberLength = number.length;
  for (var i = 0;i < numberLength;++i) {
    character = number.charAt(i);
    newDigit = normalizationReplacements[character.toUpperCase()];
    if (newDigit != null) {
      normalizedNumber.append(newDigit);
    } else {
      if (!removeNonMatches) {
        normalizedNumber.append(character);
      }
    }
  }
  return normalizedNumber.toString();
};
i18n.phonenumbers.PhoneNumberUtil.prototype.formattingRuleHasFirstGroupOnly = function(nationalPrefixFormattingRule) {
  return nationalPrefixFormattingRule.length == 0 || i18n.phonenumbers.PhoneNumberUtil.FIRST_GROUP_ONLY_PREFIX_PATTERN_.test(nationalPrefixFormattingRule);
};
i18n.phonenumbers.PhoneNumberUtil.prototype.isNumberGeographical = function(phoneNumber) {
  var numberType = this.getNumberType(phoneNumber);
  return numberType == i18n.phonenumbers.PhoneNumberType.FIXED_LINE || numberType == i18n.phonenumbers.PhoneNumberType.FIXED_LINE_OR_MOBILE;
};
i18n.phonenumbers.PhoneNumberUtil.prototype.isValidRegionCode_ = function(regionCode) {
  return regionCode != null && isNaN(regionCode) && regionCode.toUpperCase() in i18n.phonenumbers.metadata.countryToMetadata;
};
i18n.phonenumbers.PhoneNumberUtil.prototype.hasValidCountryCallingCode_ = function(countryCallingCode) {
  return countryCallingCode in i18n.phonenumbers.metadata.countryCodeToRegionCodeMap;
};
i18n.phonenumbers.PhoneNumberUtil.prototype.format = function(number, numberFormat) {
  if (number.getNationalNumber() == 0 && number.hasRawInput()) {
    var rawInput = number.getRawInputOrDefault();
    if (rawInput.length > 0) {
      return rawInput;
    }
  }
  var countryCallingCode = number.getCountryCodeOrDefault();
  var nationalSignificantNumber = this.getNationalSignificantNumber(number);
  if (numberFormat == i18n.phonenumbers.PhoneNumberFormat.E164) {
    return this.prefixNumberWithCountryCallingCode_(countryCallingCode, i18n.phonenumbers.PhoneNumberFormat.E164, nationalSignificantNumber, "");
  }
  if (!this.hasValidCountryCallingCode_(countryCallingCode)) {
    return nationalSignificantNumber;
  }
  var regionCode = this.getRegionCodeForCountryCode(countryCallingCode);
  var metadata = this.getMetadataForRegionOrCallingCode_(countryCallingCode, regionCode);
  var formattedExtension = this.maybeGetFormattedExtension_(number, metadata, numberFormat);
  var formattedNationalNumber = this.formatNsn_(nationalSignificantNumber, metadata, numberFormat);
  return this.prefixNumberWithCountryCallingCode_(countryCallingCode, numberFormat, formattedNationalNumber, formattedExtension);
};
i18n.phonenumbers.PhoneNumberUtil.prototype.formatByPattern = function(number, numberFormat, userDefinedFormats) {
  var countryCallingCode = number.getCountryCodeOrDefault();
  var nationalSignificantNumber = this.getNationalSignificantNumber(number);
  if (!this.hasValidCountryCallingCode_(countryCallingCode)) {
    return nationalSignificantNumber;
  }
  var regionCode = this.getRegionCodeForCountryCode(countryCallingCode);
  var metadata = this.getMetadataForRegionOrCallingCode_(countryCallingCode, regionCode);
  var formattedNumber = "";
  var formattingPattern = this.chooseFormattingPatternForNumber_(userDefinedFormats, nationalSignificantNumber);
  if (formattingPattern == null) {
    formattedNumber = nationalSignificantNumber;
  } else {
    var numFormatCopy = formattingPattern.clone();
    var nationalPrefixFormattingRule = formattingPattern.getNationalPrefixFormattingRuleOrDefault();
    if (nationalPrefixFormattingRule.length > 0) {
      var nationalPrefix = metadata.getNationalPrefixOrDefault();
      if (nationalPrefix.length > 0) {
        nationalPrefixFormattingRule = nationalPrefixFormattingRule.replace(i18n.phonenumbers.PhoneNumberUtil.NP_PATTERN_, nationalPrefix).replace(i18n.phonenumbers.PhoneNumberUtil.FG_PATTERN_, "$1");
        numFormatCopy.setNationalPrefixFormattingRule(nationalPrefixFormattingRule);
      } else {
        numFormatCopy.clearNationalPrefixFormattingRule();
      }
    }
    formattedNumber = this.formatNsnUsingPattern_(nationalSignificantNumber, numFormatCopy, numberFormat);
  }
  var formattedExtension = this.maybeGetFormattedExtension_(number, metadata, numberFormat);
  return this.prefixNumberWithCountryCallingCode_(countryCallingCode, numberFormat, formattedNumber, formattedExtension);
};
i18n.phonenumbers.PhoneNumberUtil.prototype.formatNationalNumberWithCarrierCode = function(number, carrierCode) {
  var countryCallingCode = number.getCountryCodeOrDefault();
  var nationalSignificantNumber = this.getNationalSignificantNumber(number);
  if (!this.hasValidCountryCallingCode_(countryCallingCode)) {
    return nationalSignificantNumber;
  }
  var regionCode = this.getRegionCodeForCountryCode(countryCallingCode);
  var metadata = this.getMetadataForRegionOrCallingCode_(countryCallingCode, regionCode);
  var formattedExtension = this.maybeGetFormattedExtension_(number, metadata, i18n.phonenumbers.PhoneNumberFormat.NATIONAL);
  var formattedNationalNumber = this.formatNsn_(nationalSignificantNumber, metadata, i18n.phonenumbers.PhoneNumberFormat.NATIONAL, carrierCode);
  return this.prefixNumberWithCountryCallingCode_(countryCallingCode, i18n.phonenumbers.PhoneNumberFormat.NATIONAL, formattedNationalNumber, formattedExtension);
};
i18n.phonenumbers.PhoneNumberUtil.prototype.getMetadataForRegionOrCallingCode_ = function(countryCallingCode, regionCode) {
  return i18n.phonenumbers.PhoneNumberUtil.REGION_CODE_FOR_NON_GEO_ENTITY == regionCode ? this.getMetadataForNonGeographicalRegion(countryCallingCode) : this.getMetadataForRegion(regionCode);
};
i18n.phonenumbers.PhoneNumberUtil.prototype.formatNationalNumberWithPreferredCarrierCode = function(number, fallbackCarrierCode) {
  return this.formatNationalNumberWithCarrierCode(number, number.hasPreferredDomesticCarrierCode() ? number.getPreferredDomesticCarrierCodeOrDefault() : fallbackCarrierCode);
};
i18n.phonenumbers.PhoneNumberUtil.prototype.formatNumberForMobileDialing = function(number, regionCallingFrom, withFormatting) {
  var countryCallingCode = number.getCountryCodeOrDefault();
  if (!this.hasValidCountryCallingCode_(countryCallingCode)) {
    return number.hasRawInput() ? number.getRawInputOrDefault() : "";
  }
  var formattedNumber = "";
  var numberNoExt = number.clone();
  numberNoExt.clearExtension();
  var regionCode = this.getRegionCodeForCountryCode(countryCallingCode);
  var numberType = this.getNumberType(numberNoExt);
  var isValidNumber = numberType != i18n.phonenumbers.PhoneNumberType.UNKNOWN;
  if (regionCallingFrom == regionCode) {
    var isFixedLineOrMobile = numberType == i18n.phonenumbers.PhoneNumberType.FIXED_LINE || numberType == i18n.phonenumbers.PhoneNumberType.MOBILE || numberType == i18n.phonenumbers.PhoneNumberType.FIXED_LINE_OR_MOBILE;
    if (regionCode == "CO" && numberType == i18n.phonenumbers.PhoneNumberType.FIXED_LINE) {
      formattedNumber = this.formatNationalNumberWithCarrierCode(numberNoExt, i18n.phonenumbers.PhoneNumberUtil.COLOMBIA_MOBILE_TO_FIXED_LINE_PREFIX_);
    } else {
      if (regionCode == "BR" && isFixedLineOrMobile) {
        formattedNumber = numberNoExt.hasPreferredDomesticCarrierCode() ? this.formatNationalNumberWithPreferredCarrierCode(numberNoExt, "") : "";
      } else {
        if (isValidNumber && regionCode == "HU") {
          formattedNumber = this.getNddPrefixForRegion(regionCode, true) + " " + this.format(numberNoExt, i18n.phonenumbers.PhoneNumberFormat.NATIONAL);
        } else {
          if (countryCallingCode == i18n.phonenumbers.PhoneNumberUtil.NANPA_COUNTRY_CODE_) {
            var regionMetadata = this.getMetadataForRegion(regionCallingFrom);
            if (this.canBeInternationallyDialled(numberNoExt) && !this.isShorterThanPossibleNormalNumber_(regionMetadata, this.getNationalSignificantNumber(numberNoExt))) {
              formattedNumber = this.format(numberNoExt, i18n.phonenumbers.PhoneNumberFormat.INTERNATIONAL);
            } else {
              formattedNumber = this.format(numberNoExt, i18n.phonenumbers.PhoneNumberFormat.NATIONAL);
            }
          } else {
            if ((regionCode == i18n.phonenumbers.PhoneNumberUtil.REGION_CODE_FOR_NON_GEO_ENTITY || (regionCode == "MX" || regionCode == "CL") && isFixedLineOrMobile) && this.canBeInternationallyDialled(numberNoExt)) {
              formattedNumber = this.format(numberNoExt, i18n.phonenumbers.PhoneNumberFormat.INTERNATIONAL);
            } else {
              formattedNumber = this.format(numberNoExt, i18n.phonenumbers.PhoneNumberFormat.NATIONAL);
            }
          }
        }
      }
    }
  } else {
    if (isValidNumber && this.canBeInternationallyDialled(numberNoExt)) {
      return withFormatting ? this.format(numberNoExt, i18n.phonenumbers.PhoneNumberFormat.INTERNATIONAL) : this.format(numberNoExt, i18n.phonenumbers.PhoneNumberFormat.E164);
    }
  }
  return withFormatting ? formattedNumber : i18n.phonenumbers.PhoneNumberUtil.normalizeHelper_(formattedNumber, i18n.phonenumbers.PhoneNumberUtil.DIALLABLE_CHAR_MAPPINGS_, true);
};
i18n.phonenumbers.PhoneNumberUtil.prototype.formatOutOfCountryCallingNumber = function(number, regionCallingFrom) {
  if (!this.isValidRegionCode_(regionCallingFrom)) {
    return this.format(number, i18n.phonenumbers.PhoneNumberFormat.INTERNATIONAL);
  }
  var countryCallingCode = number.getCountryCodeOrDefault();
  var nationalSignificantNumber = this.getNationalSignificantNumber(number);
  if (!this.hasValidCountryCallingCode_(countryCallingCode)) {
    return nationalSignificantNumber;
  }
  if (countryCallingCode == i18n.phonenumbers.PhoneNumberUtil.NANPA_COUNTRY_CODE_) {
    if (this.isNANPACountry(regionCallingFrom)) {
      return countryCallingCode + " " + this.format(number, i18n.phonenumbers.PhoneNumberFormat.NATIONAL);
    }
  } else {
    if (countryCallingCode == this.getCountryCodeForValidRegion_(regionCallingFrom)) {
      return this.format(number, i18n.phonenumbers.PhoneNumberFormat.NATIONAL);
    }
  }
  var metadataForRegionCallingFrom = this.getMetadataForRegion(regionCallingFrom);
  var internationalPrefix = metadataForRegionCallingFrom.getInternationalPrefixOrDefault();
  var internationalPrefixForFormatting = "";
  if (i18n.phonenumbers.PhoneNumberUtil.matchesEntirely_(i18n.phonenumbers.PhoneNumberUtil.UNIQUE_INTERNATIONAL_PREFIX_, internationalPrefix)) {
    internationalPrefixForFormatting = internationalPrefix;
  } else {
    if (metadataForRegionCallingFrom.hasPreferredInternationalPrefix()) {
      internationalPrefixForFormatting = metadataForRegionCallingFrom.getPreferredInternationalPrefixOrDefault();
    }
  }
  var regionCode = this.getRegionCodeForCountryCode(countryCallingCode);
  var metadataForRegion = this.getMetadataForRegionOrCallingCode_(countryCallingCode, regionCode);
  var formattedNationalNumber = this.formatNsn_(nationalSignificantNumber, metadataForRegion, i18n.phonenumbers.PhoneNumberFormat.INTERNATIONAL);
  var formattedExtension = this.maybeGetFormattedExtension_(number, metadataForRegion, i18n.phonenumbers.PhoneNumberFormat.INTERNATIONAL);
  return internationalPrefixForFormatting.length > 0 ? internationalPrefixForFormatting + " " + countryCallingCode + " " + formattedNationalNumber + formattedExtension : this.prefixNumberWithCountryCallingCode_(countryCallingCode, i18n.phonenumbers.PhoneNumberFormat.INTERNATIONAL, formattedNationalNumber, formattedExtension);
};
i18n.phonenumbers.PhoneNumberUtil.prototype.formatInOriginalFormat = function(number, regionCallingFrom) {
  if (number.hasRawInput() && (this.hasUnexpectedItalianLeadingZero_(number) || !this.hasFormattingPatternForNumber_(number))) {
    return number.getRawInputOrDefault();
  }
  if (!number.hasCountryCodeSource()) {
    return this.format(number, i18n.phonenumbers.PhoneNumberFormat.NATIONAL);
  }
  var formattedNumber;
  switch(number.getCountryCodeSource()) {
    case i18n.phonenumbers.PhoneNumber.CountryCodeSource.FROM_NUMBER_WITH_PLUS_SIGN:
      formattedNumber = this.format(number, i18n.phonenumbers.PhoneNumberFormat.INTERNATIONAL);
      break;
    case i18n.phonenumbers.PhoneNumber.CountryCodeSource.FROM_NUMBER_WITH_IDD:
      formattedNumber = this.formatOutOfCountryCallingNumber(number, regionCallingFrom);
      break;
    case i18n.phonenumbers.PhoneNumber.CountryCodeSource.FROM_NUMBER_WITHOUT_PLUS_SIGN:
      formattedNumber = this.format(number, i18n.phonenumbers.PhoneNumberFormat.INTERNATIONAL).substring(1);
      break;
    case i18n.phonenumbers.PhoneNumber.CountryCodeSource.FROM_DEFAULT_COUNTRY:
    ;
    default:
      var regionCode = this.getRegionCodeForCountryCode(number.getCountryCodeOrDefault());
      var nationalPrefix = this.getNddPrefixForRegion(regionCode, true);
      var nationalFormat = this.format(number, i18n.phonenumbers.PhoneNumberFormat.NATIONAL);
      if (nationalPrefix == null || nationalPrefix.length == 0) {
        formattedNumber = nationalFormat;
        break;
      }
      if (this.rawInputContainsNationalPrefix_(number.getRawInputOrDefault(), nationalPrefix, regionCode)) {
        formattedNumber = nationalFormat;
        break;
      }
      var metadata = this.getMetadataForRegion(regionCode);
      var nationalNumber = this.getNationalSignificantNumber(number);
      var formatRule = this.chooseFormattingPatternForNumber_(metadata.numberFormatArray(), nationalNumber);
      if (formatRule == null) {
        formattedNumber = nationalFormat;
        break;
      }
      var candidateNationalPrefixRule = formatRule.getNationalPrefixFormattingRuleOrDefault();
      var indexOfFirstGroup = candidateNationalPrefixRule.indexOf("$1");
      if (indexOfFirstGroup <= 0) {
        formattedNumber = nationalFormat;
        break;
      }
      candidateNationalPrefixRule = candidateNationalPrefixRule.substring(0, indexOfFirstGroup);
      candidateNationalPrefixRule = i18n.phonenumbers.PhoneNumberUtil.normalizeDigitsOnly(candidateNationalPrefixRule);
      if (candidateNationalPrefixRule.length == 0) {
        formattedNumber = nationalFormat;
        break;
      }
      var numFormatCopy = formatRule.clone();
      numFormatCopy.clearNationalPrefixFormattingRule();
      formattedNumber = this.formatByPattern(number, i18n.phonenumbers.PhoneNumberFormat.NATIONAL, [numFormatCopy]);
      break;
  }
  var rawInput = number.getRawInputOrDefault();
  if (formattedNumber != null && rawInput.length > 0) {
    var normalizedFormattedNumber = i18n.phonenumbers.PhoneNumberUtil.normalizeHelper_(formattedNumber, i18n.phonenumbers.PhoneNumberUtil.DIALLABLE_CHAR_MAPPINGS_, true);
    var normalizedRawInput = i18n.phonenumbers.PhoneNumberUtil.normalizeHelper_(rawInput, i18n.phonenumbers.PhoneNumberUtil.DIALLABLE_CHAR_MAPPINGS_, true);
    if (normalizedFormattedNumber != normalizedRawInput) {
      formattedNumber = rawInput;
    }
  }
  return formattedNumber;
};
i18n.phonenumbers.PhoneNumberUtil.prototype.rawInputContainsNationalPrefix_ = function(rawInput, nationalPrefix, regionCode) {
  var normalizedNationalNumber = i18n.phonenumbers.PhoneNumberUtil.normalizeDigitsOnly(rawInput);
  if (goog.string.startsWith(normalizedNationalNumber, nationalPrefix)) {
    try {
      return this.isValidNumber(this.parse(normalizedNationalNumber.substring(nationalPrefix.length), regionCode));
    } catch (e) {
      return false;
    }
  }
  return false;
};
i18n.phonenumbers.PhoneNumberUtil.prototype.hasUnexpectedItalianLeadingZero_ = function(number) {
  return number.hasItalianLeadingZero() && !this.isLeadingZeroPossible(number.getCountryCodeOrDefault());
};
i18n.phonenumbers.PhoneNumberUtil.prototype.hasFormattingPatternForNumber_ = function(number) {
  var countryCallingCode = number.getCountryCodeOrDefault();
  var phoneNumberRegion = this.getRegionCodeForCountryCode(countryCallingCode);
  var metadata = this.getMetadataForRegionOrCallingCode_(countryCallingCode, phoneNumberRegion);
  if (metadata == null) {
    return false;
  }
  var nationalNumber = this.getNationalSignificantNumber(number);
  var formatRule = this.chooseFormattingPatternForNumber_(metadata.numberFormatArray(), nationalNumber);
  return formatRule != null;
};
i18n.phonenumbers.PhoneNumberUtil.prototype.formatOutOfCountryKeepingAlphaChars = function(number, regionCallingFrom) {
  var rawInput = number.getRawInputOrDefault();
  if (rawInput.length == 0) {
    return this.formatOutOfCountryCallingNumber(number, regionCallingFrom);
  }
  var countryCode = number.getCountryCodeOrDefault();
  if (!this.hasValidCountryCallingCode_(countryCode)) {
    return rawInput;
  }
  rawInput = i18n.phonenumbers.PhoneNumberUtil.normalizeHelper_(rawInput, i18n.phonenumbers.PhoneNumberUtil.ALL_PLUS_NUMBER_GROUPING_SYMBOLS_, true);
  var nationalNumber = this.getNationalSignificantNumber(number);
  if (nationalNumber.length > 3) {
    var firstNationalNumberDigit = rawInput.indexOf(nationalNumber.substring(0, 3));
    if (firstNationalNumberDigit != -1) {
      rawInput = rawInput.substring(firstNationalNumberDigit);
    }
  }
  var metadataForRegionCallingFrom = this.getMetadataForRegion(regionCallingFrom);
  if (countryCode == i18n.phonenumbers.PhoneNumberUtil.NANPA_COUNTRY_CODE_) {
    if (this.isNANPACountry(regionCallingFrom)) {
      return countryCode + " " + rawInput;
    }
  } else {
    if (metadataForRegionCallingFrom != null && countryCode == this.getCountryCodeForValidRegion_(regionCallingFrom)) {
      var formattingPattern = this.chooseFormattingPatternForNumber_(metadataForRegionCallingFrom.numberFormatArray(), nationalNumber);
      if (formattingPattern == null) {
        return rawInput;
      }
      var newFormat = formattingPattern.clone();
      newFormat.setPattern("(\\d+)(.*)");
      newFormat.setFormat("$1$2");
      return this.formatNsnUsingPattern_(rawInput, newFormat, i18n.phonenumbers.PhoneNumberFormat.NATIONAL);
    }
  }
  var internationalPrefixForFormatting = "";
  if (metadataForRegionCallingFrom != null) {
    var internationalPrefix = metadataForRegionCallingFrom.getInternationalPrefixOrDefault();
    internationalPrefixForFormatting = i18n.phonenumbers.PhoneNumberUtil.matchesEntirely_(i18n.phonenumbers.PhoneNumberUtil.UNIQUE_INTERNATIONAL_PREFIX_, internationalPrefix) ? internationalPrefix : metadataForRegionCallingFrom.getPreferredInternationalPrefixOrDefault();
  }
  var regionCode = this.getRegionCodeForCountryCode(countryCode);
  var metadataForRegion = this.getMetadataForRegionOrCallingCode_(countryCode, regionCode);
  var formattedExtension = this.maybeGetFormattedExtension_(number, metadataForRegion, i18n.phonenumbers.PhoneNumberFormat.INTERNATIONAL);
  if (internationalPrefixForFormatting.length > 0) {
    return internationalPrefixForFormatting + " " + countryCode + " " + rawInput + formattedExtension;
  } else {
    return this.prefixNumberWithCountryCallingCode_(countryCode, i18n.phonenumbers.PhoneNumberFormat.INTERNATIONAL, rawInput, formattedExtension);
  }
};
i18n.phonenumbers.PhoneNumberUtil.prototype.getNationalSignificantNumber = function(number) {
  var nationalNumber = "" + number.getNationalNumber();
  if (number.hasItalianLeadingZero() && number.getItalianLeadingZero()) {
    return Array(number.getNumberOfLeadingZerosOrDefault() + 1).join("0") + nationalNumber;
  }
  return nationalNumber;
};
i18n.phonenumbers.PhoneNumberUtil.prototype.prefixNumberWithCountryCallingCode_ = function(countryCallingCode, numberFormat, formattedNationalNumber, formattedExtension) {
  switch(numberFormat) {
    case i18n.phonenumbers.PhoneNumberFormat.E164:
      return i18n.phonenumbers.PhoneNumberUtil.PLUS_SIGN + countryCallingCode + formattedNationalNumber + formattedExtension;
    case i18n.phonenumbers.PhoneNumberFormat.INTERNATIONAL:
      return i18n.phonenumbers.PhoneNumberUtil.PLUS_SIGN + countryCallingCode + " " + formattedNationalNumber + formattedExtension;
    case i18n.phonenumbers.PhoneNumberFormat.RFC3966:
      return i18n.phonenumbers.PhoneNumberUtil.RFC3966_PREFIX_ + i18n.phonenumbers.PhoneNumberUtil.PLUS_SIGN + countryCallingCode + "-" + formattedNationalNumber + formattedExtension;
    case i18n.phonenumbers.PhoneNumberFormat.NATIONAL:
    ;
    default:
      return formattedNationalNumber + formattedExtension;
  }
};
i18n.phonenumbers.PhoneNumberUtil.prototype.formatNsn_ = function(number, metadata, numberFormat, opt_carrierCode) {
  var intlNumberFormats = metadata.intlNumberFormatArray();
  var availableFormats = intlNumberFormats.length == 0 || numberFormat == i18n.phonenumbers.PhoneNumberFormat.NATIONAL ? metadata.numberFormatArray() : metadata.intlNumberFormatArray();
  var formattingPattern = this.chooseFormattingPatternForNumber_(availableFormats, number);
  return formattingPattern == null ? number : this.formatNsnUsingPattern_(number, formattingPattern, numberFormat, opt_carrierCode);
};
i18n.phonenumbers.PhoneNumberUtil.prototype.chooseFormattingPatternForNumber_ = function(availableFormats, nationalNumber) {
  var numFormat;
  var l = availableFormats.length;
  for (var i = 0;i < l;++i) {
    numFormat = availableFormats[i];
    var size = numFormat.leadingDigitsPatternCount();
    if (size == 0 || nationalNumber.search(numFormat.getLeadingDigitsPattern(size - 1)) == 0) {
      var patternToMatch = new RegExp(numFormat.getPattern());
      if (i18n.phonenumbers.PhoneNumberUtil.matchesEntirely_(patternToMatch, nationalNumber)) {
        return numFormat;
      }
    }
  }
  return null;
};
i18n.phonenumbers.PhoneNumberUtil.prototype.formatNsnUsingPattern_ = function(nationalNumber, formattingPattern, numberFormat, opt_carrierCode) {
  var numberFormatRule = formattingPattern.getFormatOrDefault();
  var patternToMatch = new RegExp(formattingPattern.getPattern());
  var domesticCarrierCodeFormattingRule = formattingPattern.getDomesticCarrierCodeFormattingRuleOrDefault();
  var formattedNationalNumber = "";
  if (numberFormat == i18n.phonenumbers.PhoneNumberFormat.NATIONAL && opt_carrierCode != null && opt_carrierCode.length > 0 && domesticCarrierCodeFormattingRule.length > 0) {
    var carrierCodeFormattingRule = domesticCarrierCodeFormattingRule.replace(i18n.phonenumbers.PhoneNumberUtil.CC_PATTERN_, opt_carrierCode);
    numberFormatRule = numberFormatRule.replace(i18n.phonenumbers.PhoneNumberUtil.FIRST_GROUP_PATTERN_, carrierCodeFormattingRule);
    formattedNationalNumber = nationalNumber.replace(patternToMatch, numberFormatRule);
  } else {
    var nationalPrefixFormattingRule = formattingPattern.getNationalPrefixFormattingRuleOrDefault();
    if (numberFormat == i18n.phonenumbers.PhoneNumberFormat.NATIONAL && nationalPrefixFormattingRule != null && nationalPrefixFormattingRule.length > 0) {
      formattedNationalNumber = nationalNumber.replace(patternToMatch, numberFormatRule.replace(i18n.phonenumbers.PhoneNumberUtil.FIRST_GROUP_PATTERN_, nationalPrefixFormattingRule));
    } else {
      formattedNationalNumber = nationalNumber.replace(patternToMatch, numberFormatRule);
    }
  }
  if (numberFormat == i18n.phonenumbers.PhoneNumberFormat.RFC3966) {
    formattedNationalNumber = formattedNationalNumber.replace(new RegExp("^" + i18n.phonenumbers.PhoneNumberUtil.SEPARATOR_PATTERN_), "");
    formattedNationalNumber = formattedNationalNumber.replace(new RegExp(i18n.phonenumbers.PhoneNumberUtil.SEPARATOR_PATTERN_, "g"), "-");
  }
  return formattedNationalNumber;
};
i18n.phonenumbers.PhoneNumberUtil.prototype.getExampleNumber = function(regionCode) {
  return this.getExampleNumberForType(regionCode, i18n.phonenumbers.PhoneNumberType.FIXED_LINE);
};
i18n.phonenumbers.PhoneNumberUtil.prototype.getExampleNumberForType = function(regionCode, type) {
  if (!this.isValidRegionCode_(regionCode)) {
    return null;
  }
  var desc = this.getNumberDescByType_(this.getMetadataForRegion(regionCode), type);
  try {
    if (desc.hasExampleNumber()) {
      return this.parse(desc.getExampleNumberOrDefault(), regionCode);
    }
  } catch (e) {
  }
  return null;
};
i18n.phonenumbers.PhoneNumberUtil.prototype.getExampleNumberForNonGeoEntity = function(countryCallingCode) {
  var metadata = this.getMetadataForNonGeographicalRegion(countryCallingCode);
  if (metadata != null) {
    var desc = metadata.getGeneralDesc();
    try {
      if (desc.hasExampleNumber()) {
        return this.parse("+" + countryCallingCode + desc.getExampleNumber(), "ZZ");
      }
    } catch (e) {
    }
  }
  return null;
};
i18n.phonenumbers.PhoneNumberUtil.prototype.maybeGetFormattedExtension_ = function(number, metadata, numberFormat) {
  if (!number.hasExtension() || number.getExtension().length == 0) {
    return "";
  } else {
    if (numberFormat == i18n.phonenumbers.PhoneNumberFormat.RFC3966) {
      return i18n.phonenumbers.PhoneNumberUtil.RFC3966_EXTN_PREFIX_ + number.getExtension();
    } else {
      if (metadata.hasPreferredExtnPrefix()) {
        return metadata.getPreferredExtnPrefix() + number.getExtensionOrDefault();
      } else {
        return i18n.phonenumbers.PhoneNumberUtil.DEFAULT_EXTN_PREFIX_ + number.getExtensionOrDefault();
      }
    }
  }
};
i18n.phonenumbers.PhoneNumberUtil.prototype.getNumberDescByType_ = function(metadata, type) {
  switch(type) {
    case i18n.phonenumbers.PhoneNumberType.PREMIUM_RATE:
      return metadata.getPremiumRate();
    case i18n.phonenumbers.PhoneNumberType.TOLL_FREE:
      return metadata.getTollFree();
    case i18n.phonenumbers.PhoneNumberType.MOBILE:
      return metadata.getMobile();
    case i18n.phonenumbers.PhoneNumberType.FIXED_LINE:
    ;
    case i18n.phonenumbers.PhoneNumberType.FIXED_LINE_OR_MOBILE:
      return metadata.getFixedLine();
    case i18n.phonenumbers.PhoneNumberType.SHARED_COST:
      return metadata.getSharedCost();
    case i18n.phonenumbers.PhoneNumberType.VOIP:
      return metadata.getVoip();
    case i18n.phonenumbers.PhoneNumberType.PERSONAL_NUMBER:
      return metadata.getPersonalNumber();
    case i18n.phonenumbers.PhoneNumberType.PAGER:
      return metadata.getPager();
    case i18n.phonenumbers.PhoneNumberType.UAN:
      return metadata.getUan();
    case i18n.phonenumbers.PhoneNumberType.VOICEMAIL:
      return metadata.getVoicemail();
    default:
      return metadata.getGeneralDesc();
  }
};
i18n.phonenumbers.PhoneNumberUtil.prototype.getNumberType = function(number) {
  var regionCode = this.getRegionCodeForNumber(number);
  var metadata = this.getMetadataForRegionOrCallingCode_(number.getCountryCodeOrDefault(), regionCode);
  if (metadata == null) {
    return i18n.phonenumbers.PhoneNumberType.UNKNOWN;
  }
  var nationalSignificantNumber = this.getNationalSignificantNumber(number);
  return this.getNumberTypeHelper_(nationalSignificantNumber, metadata);
};
i18n.phonenumbers.PhoneNumberUtil.prototype.getNumberTypeHelper_ = function(nationalNumber, metadata) {
  if (!this.isNumberMatchingDesc_(nationalNumber, metadata.getGeneralDesc())) {
    return i18n.phonenumbers.PhoneNumberType.UNKNOWN;
  }
  if (this.isNumberMatchingDesc_(nationalNumber, metadata.getPremiumRate())) {
    return i18n.phonenumbers.PhoneNumberType.PREMIUM_RATE;
  }
  if (this.isNumberMatchingDesc_(nationalNumber, metadata.getTollFree())) {
    return i18n.phonenumbers.PhoneNumberType.TOLL_FREE;
  }
  if (this.isNumberMatchingDesc_(nationalNumber, metadata.getSharedCost())) {
    return i18n.phonenumbers.PhoneNumberType.SHARED_COST;
  }
  if (this.isNumberMatchingDesc_(nationalNumber, metadata.getVoip())) {
    return i18n.phonenumbers.PhoneNumberType.VOIP;
  }
  if (this.isNumberMatchingDesc_(nationalNumber, metadata.getPersonalNumber())) {
    return i18n.phonenumbers.PhoneNumberType.PERSONAL_NUMBER;
  }
  if (this.isNumberMatchingDesc_(nationalNumber, metadata.getPager())) {
    return i18n.phonenumbers.PhoneNumberType.PAGER;
  }
  if (this.isNumberMatchingDesc_(nationalNumber, metadata.getUan())) {
    return i18n.phonenumbers.PhoneNumberType.UAN;
  }
  if (this.isNumberMatchingDesc_(nationalNumber, metadata.getVoicemail())) {
    return i18n.phonenumbers.PhoneNumberType.VOICEMAIL;
  }
  var isFixedLine = this.isNumberMatchingDesc_(nationalNumber, metadata.getFixedLine());
  if (isFixedLine) {
    if (metadata.getSameMobileAndFixedLinePattern()) {
      return i18n.phonenumbers.PhoneNumberType.FIXED_LINE_OR_MOBILE;
    } else {
      if (this.isNumberMatchingDesc_(nationalNumber, metadata.getMobile())) {
        return i18n.phonenumbers.PhoneNumberType.FIXED_LINE_OR_MOBILE;
      }
    }
    return i18n.phonenumbers.PhoneNumberType.FIXED_LINE;
  }
  if (!metadata.getSameMobileAndFixedLinePattern() && this.isNumberMatchingDesc_(nationalNumber, metadata.getMobile())) {
    return i18n.phonenumbers.PhoneNumberType.MOBILE;
  }
  return i18n.phonenumbers.PhoneNumberType.UNKNOWN;
};
i18n.phonenumbers.PhoneNumberUtil.prototype.getMetadataForRegion = function(regionCode) {
  if (regionCode == null) {
    return null;
  }
  regionCode = regionCode.toUpperCase();
  var metadata = this.regionToMetadataMap[regionCode];
  if (metadata == null) {
    var serializer = new goog.proto2.PbLiteSerializer;
    var metadataSerialized = i18n.phonenumbers.metadata.countryToMetadata[regionCode];
    if (metadataSerialized == null) {
      return null;
    }
    metadata = (serializer.deserialize(i18n.phonenumbers.PhoneMetadata.getDescriptor(), metadataSerialized));
    this.regionToMetadataMap[regionCode] = metadata;
  }
  return metadata;
};
i18n.phonenumbers.PhoneNumberUtil.prototype.getMetadataForNonGeographicalRegion = function(countryCallingCode) {
  return this.getMetadataForRegion("" + countryCallingCode);
};
i18n.phonenumbers.PhoneNumberUtil.prototype.isNumberMatchingDesc_ = function(nationalNumber, numberDesc) {
  return i18n.phonenumbers.PhoneNumberUtil.matchesEntirely_(numberDesc.getPossibleNumberPatternOrDefault(), nationalNumber) && i18n.phonenumbers.PhoneNumberUtil.matchesEntirely_(numberDesc.getNationalNumberPatternOrDefault(), nationalNumber);
};
i18n.phonenumbers.PhoneNumberUtil.prototype.isValidNumber = function(number) {
  var regionCode = this.getRegionCodeForNumber(number);
  return this.isValidNumberForRegion(number, regionCode);
};
i18n.phonenumbers.PhoneNumberUtil.prototype.isValidNumberForRegion = function(number, regionCode) {
  var countryCode = number.getCountryCodeOrDefault();
  var metadata = this.getMetadataForRegionOrCallingCode_(countryCode, regionCode);
  if (metadata == null || i18n.phonenumbers.PhoneNumberUtil.REGION_CODE_FOR_NON_GEO_ENTITY != regionCode && countryCode != this.getCountryCodeForValidRegion_(regionCode)) {
    return false;
  }
  var nationalSignificantNumber = this.getNationalSignificantNumber(number);
  return this.getNumberTypeHelper_(nationalSignificantNumber, metadata) != i18n.phonenumbers.PhoneNumberType.UNKNOWN;
};
i18n.phonenumbers.PhoneNumberUtil.prototype.getRegionCodeForNumber = function(number) {
  if (number == null) {
    return null;
  }
  var countryCode = number.getCountryCodeOrDefault();
  var regions = i18n.phonenumbers.metadata.countryCodeToRegionCodeMap[countryCode];
  if (regions == null) {
    return null;
  }
  if (regions.length == 1) {
    return regions[0];
  } else {
    return this.getRegionCodeForNumberFromRegionList_(number, regions);
  }
};
i18n.phonenumbers.PhoneNumberUtil.prototype.getRegionCodeForNumberFromRegionList_ = function(number, regionCodes) {
  var nationalNumber = this.getNationalSignificantNumber(number);
  var regionCode;
  var regionCodesLength = regionCodes.length;
  for (var i = 0;i < regionCodesLength;i++) {
    regionCode = regionCodes[i];
    var metadata = this.getMetadataForRegion(regionCode);
    if (metadata.hasLeadingDigits()) {
      if (nationalNumber.search(metadata.getLeadingDigits()) == 0) {
        return regionCode;
      }
    } else {
      if (this.getNumberTypeHelper_(nationalNumber, metadata) != i18n.phonenumbers.PhoneNumberType.UNKNOWN) {
        return regionCode;
      }
    }
  }
  return null;
};
i18n.phonenumbers.PhoneNumberUtil.prototype.getRegionCodeForCountryCode = function(countryCallingCode) {
  var regionCodes = i18n.phonenumbers.metadata.countryCodeToRegionCodeMap[countryCallingCode];
  return regionCodes == null ? i18n.phonenumbers.PhoneNumberUtil.UNKNOWN_REGION_ : regionCodes[0];
};
i18n.phonenumbers.PhoneNumberUtil.prototype.getRegionCodesForCountryCode = function(countryCallingCode) {
  var regionCodes = i18n.phonenumbers.metadata.countryCodeToRegionCodeMap[countryCallingCode];
  return regionCodes == null ? [] : regionCodes;
};
i18n.phonenumbers.PhoneNumberUtil.prototype.getCountryCodeForRegion = function(regionCode) {
  if (!this.isValidRegionCode_(regionCode)) {
    return 0;
  }
  return this.getCountryCodeForValidRegion_(regionCode);
};
i18n.phonenumbers.PhoneNumberUtil.prototype.getCountryCodeForValidRegion_ = function(regionCode) {
  var metadata = this.getMetadataForRegion(regionCode);
  if (metadata == null) {
    throw "Invalid region code: " + regionCode;
  }
  return metadata.getCountryCodeOrDefault();
};
i18n.phonenumbers.PhoneNumberUtil.prototype.getNddPrefixForRegion = function(regionCode, stripNonDigits) {
  var metadata = this.getMetadataForRegion(regionCode);
  if (metadata == null) {
    return null;
  }
  var nationalPrefix = metadata.getNationalPrefixOrDefault();
  if (nationalPrefix.length == 0) {
    return null;
  }
  if (stripNonDigits) {
    nationalPrefix = nationalPrefix.replace("~", "");
  }
  return nationalPrefix;
};
i18n.phonenumbers.PhoneNumberUtil.prototype.isNANPACountry = function(regionCode) {
  return regionCode != null && goog.array.contains(i18n.phonenumbers.metadata.countryCodeToRegionCodeMap[i18n.phonenumbers.PhoneNumberUtil.NANPA_COUNTRY_CODE_], regionCode.toUpperCase());
};
i18n.phonenumbers.PhoneNumberUtil.prototype.isLeadingZeroPossible = function(countryCallingCode) {
  var mainMetadataForCallingCode = this.getMetadataForRegionOrCallingCode_(countryCallingCode, this.getRegionCodeForCountryCode(countryCallingCode));
  return mainMetadataForCallingCode != null && mainMetadataForCallingCode.getLeadingZeroPossibleOrDefault();
};
i18n.phonenumbers.PhoneNumberUtil.prototype.isAlphaNumber = function(number) {
  if (!i18n.phonenumbers.PhoneNumberUtil.isViablePhoneNumber(number)) {
    return false;
  }
  var strippedNumber = new goog.string.StringBuffer(number);
  this.maybeStripExtension(strippedNumber);
  return i18n.phonenumbers.PhoneNumberUtil.matchesEntirely_(i18n.phonenumbers.PhoneNumberUtil.VALID_ALPHA_PHONE_PATTERN_, strippedNumber.toString());
};
i18n.phonenumbers.PhoneNumberUtil.prototype.isPossibleNumber = function(number) {
  return this.isPossibleNumberWithReason(number) == i18n.phonenumbers.PhoneNumberUtil.ValidationResult.IS_POSSIBLE;
};
i18n.phonenumbers.PhoneNumberUtil.prototype.testNumberLengthAgainstPattern_ = function(numberPattern, number) {
  if (i18n.phonenumbers.PhoneNumberUtil.matchesEntirely_(numberPattern, number)) {
    return i18n.phonenumbers.PhoneNumberUtil.ValidationResult.IS_POSSIBLE;
  }
  if (number.search(numberPattern) == 0) {
    return i18n.phonenumbers.PhoneNumberUtil.ValidationResult.TOO_LONG;
  } else {
    return i18n.phonenumbers.PhoneNumberUtil.ValidationResult.TOO_SHORT;
  }
};
i18n.phonenumbers.PhoneNumberUtil.prototype.isShorterThanPossibleNormalNumber_ = function(regionMetadata, number) {
  var possibleNumberPattern = regionMetadata.getGeneralDesc().getPossibleNumberPatternOrDefault();
  return this.testNumberLengthAgainstPattern_(possibleNumberPattern, number) == i18n.phonenumbers.PhoneNumberUtil.ValidationResult.TOO_SHORT;
};
i18n.phonenumbers.PhoneNumberUtil.prototype.isPossibleNumberWithReason = function(number) {
  var nationalNumber = this.getNationalSignificantNumber(number);
  var countryCode = number.getCountryCodeOrDefault();
  if (!this.hasValidCountryCallingCode_(countryCode)) {
    return i18n.phonenumbers.PhoneNumberUtil.ValidationResult.INVALID_COUNTRY_CODE;
  }
  var regionCode = this.getRegionCodeForCountryCode(countryCode);
  var metadata = this.getMetadataForRegionOrCallingCode_(countryCode, regionCode);
  var possibleNumberPattern = metadata.getGeneralDesc().getPossibleNumberPatternOrDefault();
  return this.testNumberLengthAgainstPattern_(possibleNumberPattern, nationalNumber);
};
i18n.phonenumbers.PhoneNumberUtil.prototype.isPossibleNumberString = function(number, regionDialingFrom) {
  try {
    return this.isPossibleNumber(this.parse(number, regionDialingFrom));
  } catch (e) {
    return false;
  }
};
i18n.phonenumbers.PhoneNumberUtil.prototype.truncateTooLongNumber = function(number) {
  if (this.isValidNumber(number)) {
    return true;
  }
  var numberCopy = number.clone();
  var nationalNumber = number.getNationalNumberOrDefault();
  do {
    nationalNumber = Math.floor(nationalNumber / 10);
    numberCopy.setNationalNumber(nationalNumber);
    if (nationalNumber == 0 || this.isPossibleNumberWithReason(numberCopy) == i18n.phonenumbers.PhoneNumberUtil.ValidationResult.TOO_SHORT) {
      return false;
    }
  } while (!this.isValidNumber(numberCopy));
  number.setNationalNumber(nationalNumber);
  return true;
};
i18n.phonenumbers.PhoneNumberUtil.prototype.extractCountryCode = function(fullNumber, nationalNumber) {
  var fullNumberStr = fullNumber.toString();
  if (fullNumberStr.length == 0 || fullNumberStr.charAt(0) == "0") {
    return 0;
  }
  var potentialCountryCode;
  var numberLength = fullNumberStr.length;
  for (var i = 1;i <= i18n.phonenumbers.PhoneNumberUtil.MAX_LENGTH_COUNTRY_CODE_ && i <= numberLength;++i) {
    potentialCountryCode = parseInt(fullNumberStr.substring(0, i), 10);
    if (potentialCountryCode in i18n.phonenumbers.metadata.countryCodeToRegionCodeMap) {
      nationalNumber.append(fullNumberStr.substring(i));
      return potentialCountryCode;
    }
  }
  return 0;
};
i18n.phonenumbers.PhoneNumberUtil.prototype.maybeExtractCountryCode = function(number, defaultRegionMetadata, nationalNumber, keepRawInput, phoneNumber) {
  if (number.length == 0) {
    return 0;
  }
  var fullNumber = new goog.string.StringBuffer(number);
  var possibleCountryIddPrefix;
  if (defaultRegionMetadata != null) {
    possibleCountryIddPrefix = defaultRegionMetadata.getInternationalPrefix();
  }
  if (possibleCountryIddPrefix == null) {
    possibleCountryIddPrefix = "NonMatch";
  }
  var countryCodeSource = this.maybeStripInternationalPrefixAndNormalize(fullNumber, possibleCountryIddPrefix);
  if (keepRawInput) {
    phoneNumber.setCountryCodeSource(countryCodeSource);
  }
  if (countryCodeSource != i18n.phonenumbers.PhoneNumber.CountryCodeSource.FROM_DEFAULT_COUNTRY) {
    if (fullNumber.getLength() <= i18n.phonenumbers.PhoneNumberUtil.MIN_LENGTH_FOR_NSN_) {
      throw i18n.phonenumbers.Error.TOO_SHORT_AFTER_IDD;
    }
    var potentialCountryCode = this.extractCountryCode(fullNumber, nationalNumber);
    if (potentialCountryCode != 0) {
      phoneNumber.setCountryCode(potentialCountryCode);
      return potentialCountryCode;
    }
    throw i18n.phonenumbers.Error.INVALID_COUNTRY_CODE;
  } else {
    if (defaultRegionMetadata != null) {
      var defaultCountryCode = defaultRegionMetadata.getCountryCodeOrDefault();
      var defaultCountryCodeString = "" + defaultCountryCode;
      var normalizedNumber = fullNumber.toString();
      if (goog.string.startsWith(normalizedNumber, defaultCountryCodeString)) {
        var potentialNationalNumber = new goog.string.StringBuffer(normalizedNumber.substring(defaultCountryCodeString.length));
        var generalDesc = defaultRegionMetadata.getGeneralDesc();
        var validNumberPattern = new RegExp(generalDesc.getNationalNumberPatternOrDefault());
        this.maybeStripNationalPrefixAndCarrierCode(potentialNationalNumber, defaultRegionMetadata, null);
        var potentialNationalNumberStr = potentialNationalNumber.toString();
        var possibleNumberPattern = generalDesc.getPossibleNumberPatternOrDefault();
        if (!i18n.phonenumbers.PhoneNumberUtil.matchesEntirely_(validNumberPattern, fullNumber.toString()) && i18n.phonenumbers.PhoneNumberUtil.matchesEntirely_(validNumberPattern, potentialNationalNumberStr) || this.testNumberLengthAgainstPattern_(possibleNumberPattern, fullNumber.toString()) == i18n.phonenumbers.PhoneNumberUtil.ValidationResult.TOO_LONG) {
          nationalNumber.append(potentialNationalNumberStr);
          if (keepRawInput) {
            phoneNumber.setCountryCodeSource(i18n.phonenumbers.PhoneNumber.CountryCodeSource.FROM_NUMBER_WITHOUT_PLUS_SIGN);
          }
          phoneNumber.setCountryCode(defaultCountryCode);
          return defaultCountryCode;
        }
      }
    }
  }
  phoneNumber.setCountryCode(0);
  return 0;
};
i18n.phonenumbers.PhoneNumberUtil.prototype.parsePrefixAsIdd_ = function(iddPattern, number) {
  var numberStr = number.toString();
  if (numberStr.search(iddPattern) == 0) {
    var matchEnd = numberStr.match(iddPattern)[0].length;
    var matchedGroups = numberStr.substring(matchEnd).match(i18n.phonenumbers.PhoneNumberUtil.CAPTURING_DIGIT_PATTERN);
    if (matchedGroups && matchedGroups[1] != null && matchedGroups[1].length > 0) {
      var normalizedGroup = i18n.phonenumbers.PhoneNumberUtil.normalizeDigitsOnly(matchedGroups[1]);
      if (normalizedGroup == "0") {
        return false;
      }
    }
    number.clear();
    number.append(numberStr.substring(matchEnd));
    return true;
  }
  return false;
};
i18n.phonenumbers.PhoneNumberUtil.prototype.maybeStripInternationalPrefixAndNormalize = function(number, possibleIddPrefix) {
  var numberStr = number.toString();
  if (numberStr.length == 0) {
    return i18n.phonenumbers.PhoneNumber.CountryCodeSource.FROM_DEFAULT_COUNTRY;
  }
  if (i18n.phonenumbers.PhoneNumberUtil.LEADING_PLUS_CHARS_PATTERN_.test(numberStr)) {
    numberStr = numberStr.replace(i18n.phonenumbers.PhoneNumberUtil.LEADING_PLUS_CHARS_PATTERN_, "");
    number.clear();
    number.append(i18n.phonenumbers.PhoneNumberUtil.normalize(numberStr));
    return i18n.phonenumbers.PhoneNumber.CountryCodeSource.FROM_NUMBER_WITH_PLUS_SIGN;
  }
  var iddPattern = new RegExp(possibleIddPrefix);
  i18n.phonenumbers.PhoneNumberUtil.normalizeSB_(number);
  return this.parsePrefixAsIdd_(iddPattern, number) ? i18n.phonenumbers.PhoneNumber.CountryCodeSource.FROM_NUMBER_WITH_IDD : i18n.phonenumbers.PhoneNumber.CountryCodeSource.FROM_DEFAULT_COUNTRY;
};
i18n.phonenumbers.PhoneNumberUtil.prototype.maybeStripNationalPrefixAndCarrierCode = function(number, metadata, carrierCode) {
  var numberStr = number.toString();
  var numberLength = numberStr.length;
  var possibleNationalPrefix = metadata.getNationalPrefixForParsing();
  if (numberLength == 0 || possibleNationalPrefix == null || possibleNationalPrefix.length == 0) {
    return false;
  }
  var prefixPattern = new RegExp("^(?:" + possibleNationalPrefix + ")");
  var prefixMatcher = prefixPattern.exec(numberStr);
  if (prefixMatcher) {
    var nationalNumberRule = new RegExp(metadata.getGeneralDesc().getNationalNumberPatternOrDefault());
    var isViableOriginalNumber = i18n.phonenumbers.PhoneNumberUtil.matchesEntirely_(nationalNumberRule, numberStr);
    var numOfGroups = prefixMatcher.length - 1;
    var transformRule = metadata.getNationalPrefixTransformRule();
    var noTransform = transformRule == null || transformRule.length == 0 || prefixMatcher[numOfGroups] == null || prefixMatcher[numOfGroups].length == 0;
    if (noTransform) {
      if (isViableOriginalNumber && !i18n.phonenumbers.PhoneNumberUtil.matchesEntirely_(nationalNumberRule, numberStr.substring(prefixMatcher[0].length))) {
        return false;
      }
      if (carrierCode != null && numOfGroups > 0 && prefixMatcher[numOfGroups] != null) {
        carrierCode.append(prefixMatcher[1]);
      }
      number.set(numberStr.substring(prefixMatcher[0].length));
      return true;
    } else {
      var transformedNumber;
      transformedNumber = numberStr.replace(prefixPattern, transformRule);
      if (isViableOriginalNumber && !i18n.phonenumbers.PhoneNumberUtil.matchesEntirely_(nationalNumberRule, transformedNumber)) {
        return false;
      }
      if (carrierCode != null && numOfGroups > 0) {
        carrierCode.append(prefixMatcher[1]);
      }
      number.set(transformedNumber);
      return true;
    }
  }
  return false;
};
i18n.phonenumbers.PhoneNumberUtil.prototype.maybeStripExtension = function(number) {
  var numberStr = number.toString();
  var mStart = numberStr.search(i18n.phonenumbers.PhoneNumberUtil.EXTN_PATTERN_);
  if (mStart >= 0 && i18n.phonenumbers.PhoneNumberUtil.isViablePhoneNumber(numberStr.substring(0, mStart))) {
    var matchedGroups = numberStr.match(i18n.phonenumbers.PhoneNumberUtil.EXTN_PATTERN_);
    var matchedGroupsLength = matchedGroups.length;
    for (var i = 1;i < matchedGroupsLength;++i) {
      if (matchedGroups[i] != null && matchedGroups[i].length > 0) {
        number.clear();
        number.append(numberStr.substring(0, mStart));
        return matchedGroups[i];
      }
    }
  }
  return "";
};
i18n.phonenumbers.PhoneNumberUtil.prototype.checkRegionForParsing_ = function(numberToParse, defaultRegion) {
  return this.isValidRegionCode_(defaultRegion) || numberToParse != null && numberToParse.length > 0 && i18n.phonenumbers.PhoneNumberUtil.LEADING_PLUS_CHARS_PATTERN_.test(numberToParse);
};
i18n.phonenumbers.PhoneNumberUtil.prototype.parse = function(numberToParse, defaultRegion) {
  return this.parseHelper_(numberToParse, defaultRegion, false, true);
};
i18n.phonenumbers.PhoneNumberUtil.prototype.parseAndKeepRawInput = function(numberToParse, defaultRegion) {
  if (!this.isValidRegionCode_(defaultRegion)) {
    if (numberToParse.length > 0 && numberToParse.charAt(0) != i18n.phonenumbers.PhoneNumberUtil.PLUS_SIGN) {
      throw i18n.phonenumbers.Error.INVALID_COUNTRY_CODE;
    }
  }
  return this.parseHelper_(numberToParse, defaultRegion, true, true);
};
i18n.phonenumbers.PhoneNumberUtil.prototype.setItalianLeadingZerosForPhoneNumber_ = function(nationalNumber, phoneNumber) {
  if (nationalNumber.length > 1 && nationalNumber.charAt(0) == "0") {
    phoneNumber.setItalianLeadingZero(true);
    var numberOfLeadingZeros = 1;
    while (numberOfLeadingZeros < nationalNumber.length - 1 && nationalNumber.charAt(numberOfLeadingZeros) == "0") {
      numberOfLeadingZeros++;
    }
    if (numberOfLeadingZeros != 1) {
      phoneNumber.setNumberOfLeadingZeros(numberOfLeadingZeros);
    }
  }
};
i18n.phonenumbers.PhoneNumberUtil.prototype.parseHelper_ = function(numberToParse, defaultRegion, keepRawInput, checkRegion) {
  if (numberToParse == null) {
    throw i18n.phonenumbers.Error.NOT_A_NUMBER;
  } else {
    if (numberToParse.length > i18n.phonenumbers.PhoneNumberUtil.MAX_INPUT_STRING_LENGTH_) {
      throw i18n.phonenumbers.Error.TOO_LONG;
    }
  }
  var nationalNumber = new goog.string.StringBuffer;
  this.buildNationalNumberForParsing_(numberToParse, nationalNumber);
  if (!i18n.phonenumbers.PhoneNumberUtil.isViablePhoneNumber(nationalNumber.toString())) {
    throw i18n.phonenumbers.Error.NOT_A_NUMBER;
  }
  if (checkRegion && !this.checkRegionForParsing_(nationalNumber.toString(), defaultRegion)) {
    throw i18n.phonenumbers.Error.INVALID_COUNTRY_CODE;
  }
  var phoneNumber = new i18n.phonenumbers.PhoneNumber;
  if (keepRawInput) {
    phoneNumber.setRawInput(numberToParse);
  }
  var extension = this.maybeStripExtension(nationalNumber);
  if (extension.length > 0) {
    phoneNumber.setExtension(extension);
  }
  var regionMetadata = this.getMetadataForRegion(defaultRegion);
  var normalizedNationalNumber = new goog.string.StringBuffer;
  var countryCode = 0;
  var nationalNumberStr = nationalNumber.toString();
  try {
    countryCode = this.maybeExtractCountryCode(nationalNumberStr, regionMetadata, normalizedNationalNumber, keepRawInput, phoneNumber);
  } catch (e) {
    if (e == i18n.phonenumbers.Error.INVALID_COUNTRY_CODE && i18n.phonenumbers.PhoneNumberUtil.LEADING_PLUS_CHARS_PATTERN_.test(nationalNumberStr)) {
      nationalNumberStr = nationalNumberStr.replace(i18n.phonenumbers.PhoneNumberUtil.LEADING_PLUS_CHARS_PATTERN_, "");
      countryCode = this.maybeExtractCountryCode(nationalNumberStr, regionMetadata, normalizedNationalNumber, keepRawInput, phoneNumber);
      if (countryCode == 0) {
        throw e;
      }
    } else {
      throw e;
    }
  }
  if (countryCode != 0) {
    var phoneNumberRegion = this.getRegionCodeForCountryCode(countryCode);
    if (phoneNumberRegion != defaultRegion) {
      regionMetadata = this.getMetadataForRegionOrCallingCode_(countryCode, phoneNumberRegion);
    }
  } else {
    i18n.phonenumbers.PhoneNumberUtil.normalizeSB_(nationalNumber);
    normalizedNationalNumber.append(nationalNumber.toString());
    if (defaultRegion != null) {
      countryCode = regionMetadata.getCountryCodeOrDefault();
      phoneNumber.setCountryCode(countryCode);
    } else {
      if (keepRawInput) {
        phoneNumber.clearCountryCodeSource();
      }
    }
  }
  if (normalizedNationalNumber.getLength() < i18n.phonenumbers.PhoneNumberUtil.MIN_LENGTH_FOR_NSN_) {
    throw i18n.phonenumbers.Error.TOO_SHORT_NSN;
  }
  if (regionMetadata != null) {
    var carrierCode = new goog.string.StringBuffer;
    var potentialNationalNumber = new goog.string.StringBuffer(normalizedNationalNumber.toString());
    this.maybeStripNationalPrefixAndCarrierCode(potentialNationalNumber, regionMetadata, carrierCode);
    if (!this.isShorterThanPossibleNormalNumber_(regionMetadata, potentialNationalNumber.toString())) {
      normalizedNationalNumber = potentialNationalNumber;
      if (keepRawInput) {
        phoneNumber.setPreferredDomesticCarrierCode(carrierCode.toString());
      }
    }
  }
  var normalizedNationalNumberStr = normalizedNationalNumber.toString();
  var lengthOfNationalNumber = normalizedNationalNumberStr.length;
  if (lengthOfNationalNumber < i18n.phonenumbers.PhoneNumberUtil.MIN_LENGTH_FOR_NSN_) {
    throw i18n.phonenumbers.Error.TOO_SHORT_NSN;
  }
  if (lengthOfNationalNumber > i18n.phonenumbers.PhoneNumberUtil.MAX_LENGTH_FOR_NSN_) {
    throw i18n.phonenumbers.Error.TOO_LONG;
  }
  this.setItalianLeadingZerosForPhoneNumber_(normalizedNationalNumberStr, phoneNumber);
  phoneNumber.setNationalNumber(parseInt(normalizedNationalNumberStr, 10));
  return phoneNumber;
};
i18n.phonenumbers.PhoneNumberUtil.prototype.buildNationalNumberForParsing_ = function(numberToParse, nationalNumber) {
  var indexOfPhoneContext = numberToParse.indexOf(i18n.phonenumbers.PhoneNumberUtil.RFC3966_PHONE_CONTEXT_);
  if (indexOfPhoneContext > 0) {
    var phoneContextStart = indexOfPhoneContext + i18n.phonenumbers.PhoneNumberUtil.RFC3966_PHONE_CONTEXT_.length;
    if (numberToParse.charAt(phoneContextStart) == i18n.phonenumbers.PhoneNumberUtil.PLUS_SIGN) {
      var phoneContextEnd = numberToParse.indexOf(";", phoneContextStart);
      if (phoneContextEnd > 0) {
        nationalNumber.append(numberToParse.substring(phoneContextStart, phoneContextEnd));
      } else {
        nationalNumber.append(numberToParse.substring(phoneContextStart));
      }
    }
    var indexOfRfc3966Prefix = numberToParse.indexOf(i18n.phonenumbers.PhoneNumberUtil.RFC3966_PREFIX_);
    var indexOfNationalNumber = indexOfRfc3966Prefix >= 0 ? indexOfRfc3966Prefix + i18n.phonenumbers.PhoneNumberUtil.RFC3966_PREFIX_.length : 0;
    nationalNumber.append(numberToParse.substring(indexOfNationalNumber, indexOfPhoneContext));
  } else {
    nationalNumber.append(i18n.phonenumbers.PhoneNumberUtil.extractPossibleNumber(numberToParse));
  }
  var nationalNumberStr = nationalNumber.toString();
  var indexOfIsdn = nationalNumberStr.indexOf(i18n.phonenumbers.PhoneNumberUtil.RFC3966_ISDN_SUBADDRESS_);
  if (indexOfIsdn > 0) {
    nationalNumber.clear();
    nationalNumber.append(nationalNumberStr.substring(0, indexOfIsdn));
  }
};
i18n.phonenumbers.PhoneNumberUtil.prototype.isNumberMatch = function(firstNumberIn, secondNumberIn) {
  var firstNumber;
  var secondNumber;
  if (typeof firstNumberIn == "string") {
    try {
      firstNumber = this.parse(firstNumberIn, i18n.phonenumbers.PhoneNumberUtil.UNKNOWN_REGION_);
    } catch (e) {
      if (e != i18n.phonenumbers.Error.INVALID_COUNTRY_CODE) {
        return i18n.phonenumbers.PhoneNumberUtil.MatchType.NOT_A_NUMBER;
      }
      if (typeof secondNumberIn != "string") {
        var secondNumberRegion = this.getRegionCodeForCountryCode(secondNumberIn.getCountryCodeOrDefault());
        if (secondNumberRegion != i18n.phonenumbers.PhoneNumberUtil.UNKNOWN_REGION_) {
          try {
            firstNumber = this.parse(firstNumberIn, secondNumberRegion);
          } catch (e2) {
            return i18n.phonenumbers.PhoneNumberUtil.MatchType.NOT_A_NUMBER;
          }
          var match = this.isNumberMatch(firstNumber, secondNumberIn);
          if (match == i18n.phonenumbers.PhoneNumberUtil.MatchType.EXACT_MATCH) {
            return i18n.phonenumbers.PhoneNumberUtil.MatchType.NSN_MATCH;
          }
          return match;
        }
      }
      try {
        firstNumber = this.parseHelper_(firstNumberIn, null, false, false);
      } catch (e2) {
        return i18n.phonenumbers.PhoneNumberUtil.MatchType.NOT_A_NUMBER;
      }
    }
  } else {
    firstNumber = firstNumberIn.clone();
  }
  if (typeof secondNumberIn == "string") {
    try {
      secondNumber = this.parse(secondNumberIn, i18n.phonenumbers.PhoneNumberUtil.UNKNOWN_REGION_);
      return this.isNumberMatch(firstNumberIn, secondNumber);
    } catch (e) {
      if (e != i18n.phonenumbers.Error.INVALID_COUNTRY_CODE) {
        return i18n.phonenumbers.PhoneNumberUtil.MatchType.NOT_A_NUMBER;
      }
      return this.isNumberMatch(secondNumberIn, firstNumber);
    }
  } else {
    secondNumber = secondNumberIn.clone();
  }
  firstNumber.clearRawInput();
  firstNumber.clearCountryCodeSource();
  firstNumber.clearPreferredDomesticCarrierCode();
  secondNumber.clearRawInput();
  secondNumber.clearCountryCodeSource();
  secondNumber.clearPreferredDomesticCarrierCode();
  if (firstNumber.hasExtension() && firstNumber.getExtension().length == 0) {
    firstNumber.clearExtension();
  }
  if (secondNumber.hasExtension() && secondNumber.getExtension().length == 0) {
    secondNumber.clearExtension();
  }
  if (firstNumber.hasExtension() && secondNumber.hasExtension() && firstNumber.getExtension() != secondNumber.getExtension()) {
    return i18n.phonenumbers.PhoneNumberUtil.MatchType.NO_MATCH;
  }
  var firstNumberCountryCode = firstNumber.getCountryCodeOrDefault();
  var secondNumberCountryCode = secondNumber.getCountryCodeOrDefault();
  if (firstNumberCountryCode != 0 && secondNumberCountryCode != 0) {
    if (firstNumber.equals(secondNumber)) {
      return i18n.phonenumbers.PhoneNumberUtil.MatchType.EXACT_MATCH;
    } else {
      if (firstNumberCountryCode == secondNumberCountryCode && this.isNationalNumberSuffixOfTheOther_(firstNumber, secondNumber)) {
        return i18n.phonenumbers.PhoneNumberUtil.MatchType.SHORT_NSN_MATCH;
      }
    }
    return i18n.phonenumbers.PhoneNumberUtil.MatchType.NO_MATCH;
  }
  firstNumber.setCountryCode(0);
  secondNumber.setCountryCode(0);
  if (firstNumber.equals(secondNumber)) {
    return i18n.phonenumbers.PhoneNumberUtil.MatchType.NSN_MATCH;
  }
  if (this.isNationalNumberSuffixOfTheOther_(firstNumber, secondNumber)) {
    return i18n.phonenumbers.PhoneNumberUtil.MatchType.SHORT_NSN_MATCH;
  }
  return i18n.phonenumbers.PhoneNumberUtil.MatchType.NO_MATCH;
};
i18n.phonenumbers.PhoneNumberUtil.prototype.isNationalNumberSuffixOfTheOther_ = function(firstNumber, secondNumber) {
  var firstNumberNationalNumber = "" + firstNumber.getNationalNumber();
  var secondNumberNationalNumber = "" + secondNumber.getNationalNumber();
  return goog.string.endsWith(firstNumberNationalNumber, secondNumberNationalNumber) || goog.string.endsWith(secondNumberNationalNumber, firstNumberNationalNumber);
};
i18n.phonenumbers.PhoneNumberUtil.prototype.canBeInternationallyDialled = function(number) {
  var metadata = this.getMetadataForRegion(this.getRegionCodeForNumber(number));
  if (metadata == null) {
    return true;
  }
  var nationalSignificantNumber = this.getNationalSignificantNumber(number);
  return!this.isNumberMatchingDesc_(nationalSignificantNumber, metadata.getNoInternationalDialling());
};
i18n.phonenumbers.PhoneNumberUtil.matchesEntirely_ = function(regex, str) {
  var matchedGroups = typeof regex == "string" ? str.match("^(?:" + regex + ")$") : str.match(regex);
  if (matchedGroups && matchedGroups[0].length == str.length) {
    return true;
  }
  return false;
};
/*

 Copyright (C) 2011 The Libphonenumber Authors.

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
*/
goog.provide("i18n.phonenumbers.RegionCode");
i18n.phonenumbers.RegionCode = {UN001:"001", AD:"AD", AE:"AE", AO:"AO", AQ:"AQ", AR:"AR", AU:"AU", BB:"BB", BR:"BR", BS:"BS", BY:"BY", CA:"CA", CH:"CH", CN:"CN", CS:"CS", CX:"CX", DE:"DE", GB:"GB", HU:"HU", IT:"IT", JP:"JP", KR:"KR", MX:"MX", NZ:"NZ", PL:"PL", RE:"RE", SE:"SE", SG:"SG", US:"US", YT:"YT", ZW:"ZW", ZZ:"ZZ"};
/*

 Protocol Buffer 2 Copyright 2008 Google Inc.
 All other code copyright its respective owners.
 Copyright (C) 2010 The Libphonenumber Authors

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
*/
goog.provide("i18n.phonenumbers.NumberFormat");
goog.provide("i18n.phonenumbers.PhoneMetadata");
goog.provide("i18n.phonenumbers.PhoneMetadataCollection");
goog.provide("i18n.phonenumbers.PhoneNumberDesc");
goog.require("goog.proto2.Message");
i18n.phonenumbers.NumberFormat = function() {
  goog.proto2.Message.apply(this);
};
goog.inherits(i18n.phonenumbers.NumberFormat, goog.proto2.Message);
i18n.phonenumbers.NumberFormat.prototype.clone;
i18n.phonenumbers.NumberFormat.prototype.getPattern = function() {
  return(this.get$Value(1));
};
i18n.phonenumbers.NumberFormat.prototype.getPatternOrDefault = function() {
  return(this.get$ValueOrDefault(1));
};
i18n.phonenumbers.NumberFormat.prototype.setPattern = function(value) {
  this.set$Value(1, value);
};
i18n.phonenumbers.NumberFormat.prototype.hasPattern = function() {
  return this.has$Value(1);
};
i18n.phonenumbers.NumberFormat.prototype.patternCount = function() {
  return this.count$Values(1);
};
i18n.phonenumbers.NumberFormat.prototype.clearPattern = function() {
  this.clear$Field(1);
};
i18n.phonenumbers.NumberFormat.prototype.getFormat = function() {
  return(this.get$Value(2));
};
i18n.phonenumbers.NumberFormat.prototype.getFormatOrDefault = function() {
  return(this.get$ValueOrDefault(2));
};
i18n.phonenumbers.NumberFormat.prototype.setFormat = function(value) {
  this.set$Value(2, value);
};
i18n.phonenumbers.NumberFormat.prototype.hasFormat = function() {
  return this.has$Value(2);
};
i18n.phonenumbers.NumberFormat.prototype.formatCount = function() {
  return this.count$Values(2);
};
i18n.phonenumbers.NumberFormat.prototype.clearFormat = function() {
  this.clear$Field(2);
};
i18n.phonenumbers.NumberFormat.prototype.getLeadingDigitsPattern = function(index) {
  return(this.get$Value(3, index));
};
i18n.phonenumbers.NumberFormat.prototype.getLeadingDigitsPatternOrDefault = function(index) {
  return(this.get$ValueOrDefault(3, index));
};
i18n.phonenumbers.NumberFormat.prototype.addLeadingDigitsPattern = function(value) {
  this.add$Value(3, value);
};
i18n.phonenumbers.NumberFormat.prototype.leadingDigitsPatternArray = function() {
  return(this.array$Values(3));
};
i18n.phonenumbers.NumberFormat.prototype.hasLeadingDigitsPattern = function() {
  return this.has$Value(3);
};
i18n.phonenumbers.NumberFormat.prototype.leadingDigitsPatternCount = function() {
  return this.count$Values(3);
};
i18n.phonenumbers.NumberFormat.prototype.clearLeadingDigitsPattern = function() {
  this.clear$Field(3);
};
i18n.phonenumbers.NumberFormat.prototype.getNationalPrefixFormattingRule = function() {
  return(this.get$Value(4));
};
i18n.phonenumbers.NumberFormat.prototype.getNationalPrefixFormattingRuleOrDefault = function() {
  return(this.get$ValueOrDefault(4));
};
i18n.phonenumbers.NumberFormat.prototype.setNationalPrefixFormattingRule = function(value) {
  this.set$Value(4, value);
};
i18n.phonenumbers.NumberFormat.prototype.hasNationalPrefixFormattingRule = function() {
  return this.has$Value(4);
};
i18n.phonenumbers.NumberFormat.prototype.nationalPrefixFormattingRuleCount = function() {
  return this.count$Values(4);
};
i18n.phonenumbers.NumberFormat.prototype.clearNationalPrefixFormattingRule = function() {
  this.clear$Field(4);
};
i18n.phonenumbers.NumberFormat.prototype.getNationalPrefixOptionalWhenFormatting = function() {
  return(this.get$Value(6));
};
i18n.phonenumbers.NumberFormat.prototype.getNationalPrefixOptionalWhenFormattingOrDefault = function() {
  return(this.get$ValueOrDefault(6));
};
i18n.phonenumbers.NumberFormat.prototype.setNationalPrefixOptionalWhenFormatting = function(value) {
  this.set$Value(6, value);
};
i18n.phonenumbers.NumberFormat.prototype.hasNationalPrefixOptionalWhenFormatting = function() {
  return this.has$Value(6);
};
i18n.phonenumbers.NumberFormat.prototype.nationalPrefixOptionalWhenFormattingCount = function() {
  return this.count$Values(6);
};
i18n.phonenumbers.NumberFormat.prototype.clearNationalPrefixOptionalWhenFormatting = function() {
  this.clear$Field(6);
};
i18n.phonenumbers.NumberFormat.prototype.getDomesticCarrierCodeFormattingRule = function() {
  return(this.get$Value(5));
};
i18n.phonenumbers.NumberFormat.prototype.getDomesticCarrierCodeFormattingRuleOrDefault = function() {
  return(this.get$ValueOrDefault(5));
};
i18n.phonenumbers.NumberFormat.prototype.setDomesticCarrierCodeFormattingRule = function(value) {
  this.set$Value(5, value);
};
i18n.phonenumbers.NumberFormat.prototype.hasDomesticCarrierCodeFormattingRule = function() {
  return this.has$Value(5);
};
i18n.phonenumbers.NumberFormat.prototype.domesticCarrierCodeFormattingRuleCount = function() {
  return this.count$Values(5);
};
i18n.phonenumbers.NumberFormat.prototype.clearDomesticCarrierCodeFormattingRule = function() {
  this.clear$Field(5);
};
i18n.phonenumbers.PhoneNumberDesc = function() {
  goog.proto2.Message.apply(this);
};
goog.inherits(i18n.phonenumbers.PhoneNumberDesc, goog.proto2.Message);
i18n.phonenumbers.PhoneNumberDesc.prototype.clone;
i18n.phonenumbers.PhoneNumberDesc.prototype.getNationalNumberPattern = function() {
  return(this.get$Value(2));
};
i18n.phonenumbers.PhoneNumberDesc.prototype.getNationalNumberPatternOrDefault = function() {
  return(this.get$ValueOrDefault(2));
};
i18n.phonenumbers.PhoneNumberDesc.prototype.setNationalNumberPattern = function(value) {
  this.set$Value(2, value);
};
i18n.phonenumbers.PhoneNumberDesc.prototype.hasNationalNumberPattern = function() {
  return this.has$Value(2);
};
i18n.phonenumbers.PhoneNumberDesc.prototype.nationalNumberPatternCount = function() {
  return this.count$Values(2);
};
i18n.phonenumbers.PhoneNumberDesc.prototype.clearNationalNumberPattern = function() {
  this.clear$Field(2);
};
i18n.phonenumbers.PhoneNumberDesc.prototype.getPossibleNumberPattern = function() {
  return(this.get$Value(3));
};
i18n.phonenumbers.PhoneNumberDesc.prototype.getPossibleNumberPatternOrDefault = function() {
  return(this.get$ValueOrDefault(3));
};
i18n.phonenumbers.PhoneNumberDesc.prototype.setPossibleNumberPattern = function(value) {
  this.set$Value(3, value);
};
i18n.phonenumbers.PhoneNumberDesc.prototype.hasPossibleNumberPattern = function() {
  return this.has$Value(3);
};
i18n.phonenumbers.PhoneNumberDesc.prototype.possibleNumberPatternCount = function() {
  return this.count$Values(3);
};
i18n.phonenumbers.PhoneNumberDesc.prototype.clearPossibleNumberPattern = function() {
  this.clear$Field(3);
};
i18n.phonenumbers.PhoneNumberDesc.prototype.getExampleNumber = function() {
  return(this.get$Value(6));
};
i18n.phonenumbers.PhoneNumberDesc.prototype.getExampleNumberOrDefault = function() {
  return(this.get$ValueOrDefault(6));
};
i18n.phonenumbers.PhoneNumberDesc.prototype.setExampleNumber = function(value) {
  this.set$Value(6, value);
};
i18n.phonenumbers.PhoneNumberDesc.prototype.hasExampleNumber = function() {
  return this.has$Value(6);
};
i18n.phonenumbers.PhoneNumberDesc.prototype.exampleNumberCount = function() {
  return this.count$Values(6);
};
i18n.phonenumbers.PhoneNumberDesc.prototype.clearExampleNumber = function() {
  this.clear$Field(6);
};
i18n.phonenumbers.PhoneMetadata = function() {
  goog.proto2.Message.apply(this);
};
goog.inherits(i18n.phonenumbers.PhoneMetadata, goog.proto2.Message);
i18n.phonenumbers.PhoneMetadata.prototype.clone;
i18n.phonenumbers.PhoneMetadata.prototype.getGeneralDesc = function() {
  return(this.get$Value(1));
};
i18n.phonenumbers.PhoneMetadata.prototype.getGeneralDescOrDefault = function() {
  return(this.get$ValueOrDefault(1));
};
i18n.phonenumbers.PhoneMetadata.prototype.setGeneralDesc = function(value) {
  this.set$Value(1, value);
};
i18n.phonenumbers.PhoneMetadata.prototype.hasGeneralDesc = function() {
  return this.has$Value(1);
};
i18n.phonenumbers.PhoneMetadata.prototype.generalDescCount = function() {
  return this.count$Values(1);
};
i18n.phonenumbers.PhoneMetadata.prototype.clearGeneralDesc = function() {
  this.clear$Field(1);
};
i18n.phonenumbers.PhoneMetadata.prototype.getFixedLine = function() {
  return(this.get$Value(2));
};
i18n.phonenumbers.PhoneMetadata.prototype.getFixedLineOrDefault = function() {
  return(this.get$ValueOrDefault(2));
};
i18n.phonenumbers.PhoneMetadata.prototype.setFixedLine = function(value) {
  this.set$Value(2, value);
};
i18n.phonenumbers.PhoneMetadata.prototype.hasFixedLine = function() {
  return this.has$Value(2);
};
i18n.phonenumbers.PhoneMetadata.prototype.fixedLineCount = function() {
  return this.count$Values(2);
};
i18n.phonenumbers.PhoneMetadata.prototype.clearFixedLine = function() {
  this.clear$Field(2);
};
i18n.phonenumbers.PhoneMetadata.prototype.getMobile = function() {
  return(this.get$Value(3));
};
i18n.phonenumbers.PhoneMetadata.prototype.getMobileOrDefault = function() {
  return(this.get$ValueOrDefault(3));
};
i18n.phonenumbers.PhoneMetadata.prototype.setMobile = function(value) {
  this.set$Value(3, value);
};
i18n.phonenumbers.PhoneMetadata.prototype.hasMobile = function() {
  return this.has$Value(3);
};
i18n.phonenumbers.PhoneMetadata.prototype.mobileCount = function() {
  return this.count$Values(3);
};
i18n.phonenumbers.PhoneMetadata.prototype.clearMobile = function() {
  this.clear$Field(3);
};
i18n.phonenumbers.PhoneMetadata.prototype.getTollFree = function() {
  return(this.get$Value(4));
};
i18n.phonenumbers.PhoneMetadata.prototype.getTollFreeOrDefault = function() {
  return(this.get$ValueOrDefault(4));
};
i18n.phonenumbers.PhoneMetadata.prototype.setTollFree = function(value) {
  this.set$Value(4, value);
};
i18n.phonenumbers.PhoneMetadata.prototype.hasTollFree = function() {
  return this.has$Value(4);
};
i18n.phonenumbers.PhoneMetadata.prototype.tollFreeCount = function() {
  return this.count$Values(4);
};
i18n.phonenumbers.PhoneMetadata.prototype.clearTollFree = function() {
  this.clear$Field(4);
};
i18n.phonenumbers.PhoneMetadata.prototype.getPremiumRate = function() {
  return(this.get$Value(5));
};
i18n.phonenumbers.PhoneMetadata.prototype.getPremiumRateOrDefault = function() {
  return(this.get$ValueOrDefault(5));
};
i18n.phonenumbers.PhoneMetadata.prototype.setPremiumRate = function(value) {
  this.set$Value(5, value);
};
i18n.phonenumbers.PhoneMetadata.prototype.hasPremiumRate = function() {
  return this.has$Value(5);
};
i18n.phonenumbers.PhoneMetadata.prototype.premiumRateCount = function() {
  return this.count$Values(5);
};
i18n.phonenumbers.PhoneMetadata.prototype.clearPremiumRate = function() {
  this.clear$Field(5);
};
i18n.phonenumbers.PhoneMetadata.prototype.getSharedCost = function() {
  return(this.get$Value(6));
};
i18n.phonenumbers.PhoneMetadata.prototype.getSharedCostOrDefault = function() {
  return(this.get$ValueOrDefault(6));
};
i18n.phonenumbers.PhoneMetadata.prototype.setSharedCost = function(value) {
  this.set$Value(6, value);
};
i18n.phonenumbers.PhoneMetadata.prototype.hasSharedCost = function() {
  return this.has$Value(6);
};
i18n.phonenumbers.PhoneMetadata.prototype.sharedCostCount = function() {
  return this.count$Values(6);
};
i18n.phonenumbers.PhoneMetadata.prototype.clearSharedCost = function() {
  this.clear$Field(6);
};
i18n.phonenumbers.PhoneMetadata.prototype.getPersonalNumber = function() {
  return(this.get$Value(7));
};
i18n.phonenumbers.PhoneMetadata.prototype.getPersonalNumberOrDefault = function() {
  return(this.get$ValueOrDefault(7));
};
i18n.phonenumbers.PhoneMetadata.prototype.setPersonalNumber = function(value) {
  this.set$Value(7, value);
};
i18n.phonenumbers.PhoneMetadata.prototype.hasPersonalNumber = function() {
  return this.has$Value(7);
};
i18n.phonenumbers.PhoneMetadata.prototype.personalNumberCount = function() {
  return this.count$Values(7);
};
i18n.phonenumbers.PhoneMetadata.prototype.clearPersonalNumber = function() {
  this.clear$Field(7);
};
i18n.phonenumbers.PhoneMetadata.prototype.getVoip = function() {
  return(this.get$Value(8));
};
i18n.phonenumbers.PhoneMetadata.prototype.getVoipOrDefault = function() {
  return(this.get$ValueOrDefault(8));
};
i18n.phonenumbers.PhoneMetadata.prototype.setVoip = function(value) {
  this.set$Value(8, value);
};
i18n.phonenumbers.PhoneMetadata.prototype.hasVoip = function() {
  return this.has$Value(8);
};
i18n.phonenumbers.PhoneMetadata.prototype.voipCount = function() {
  return this.count$Values(8);
};
i18n.phonenumbers.PhoneMetadata.prototype.clearVoip = function() {
  this.clear$Field(8);
};
i18n.phonenumbers.PhoneMetadata.prototype.getPager = function() {
  return(this.get$Value(21));
};
i18n.phonenumbers.PhoneMetadata.prototype.getPagerOrDefault = function() {
  return(this.get$ValueOrDefault(21));
};
i18n.phonenumbers.PhoneMetadata.prototype.setPager = function(value) {
  this.set$Value(21, value);
};
i18n.phonenumbers.PhoneMetadata.prototype.hasPager = function() {
  return this.has$Value(21);
};
i18n.phonenumbers.PhoneMetadata.prototype.pagerCount = function() {
  return this.count$Values(21);
};
i18n.phonenumbers.PhoneMetadata.prototype.clearPager = function() {
  this.clear$Field(21);
};
i18n.phonenumbers.PhoneMetadata.prototype.getUan = function() {
  return(this.get$Value(25));
};
i18n.phonenumbers.PhoneMetadata.prototype.getUanOrDefault = function() {
  return(this.get$ValueOrDefault(25));
};
i18n.phonenumbers.PhoneMetadata.prototype.setUan = function(value) {
  this.set$Value(25, value);
};
i18n.phonenumbers.PhoneMetadata.prototype.hasUan = function() {
  return this.has$Value(25);
};
i18n.phonenumbers.PhoneMetadata.prototype.uanCount = function() {
  return this.count$Values(25);
};
i18n.phonenumbers.PhoneMetadata.prototype.clearUan = function() {
  this.clear$Field(25);
};
i18n.phonenumbers.PhoneMetadata.prototype.getEmergency = function() {
  return(this.get$Value(27));
};
i18n.phonenumbers.PhoneMetadata.prototype.getEmergencyOrDefault = function() {
  return(this.get$ValueOrDefault(27));
};
i18n.phonenumbers.PhoneMetadata.prototype.setEmergency = function(value) {
  this.set$Value(27, value);
};
i18n.phonenumbers.PhoneMetadata.prototype.hasEmergency = function() {
  return this.has$Value(27);
};
i18n.phonenumbers.PhoneMetadata.prototype.emergencyCount = function() {
  return this.count$Values(27);
};
i18n.phonenumbers.PhoneMetadata.prototype.clearEmergency = function() {
  this.clear$Field(27);
};
i18n.phonenumbers.PhoneMetadata.prototype.getVoicemail = function() {
  return(this.get$Value(28));
};
i18n.phonenumbers.PhoneMetadata.prototype.getVoicemailOrDefault = function() {
  return(this.get$ValueOrDefault(28));
};
i18n.phonenumbers.PhoneMetadata.prototype.setVoicemail = function(value) {
  this.set$Value(28, value);
};
i18n.phonenumbers.PhoneMetadata.prototype.hasVoicemail = function() {
  return this.has$Value(28);
};
i18n.phonenumbers.PhoneMetadata.prototype.voicemailCount = function() {
  return this.count$Values(28);
};
i18n.phonenumbers.PhoneMetadata.prototype.clearVoicemail = function() {
  this.clear$Field(28);
};
i18n.phonenumbers.PhoneMetadata.prototype.getNoInternationalDialling = function() {
  return(this.get$Value(24));
};
i18n.phonenumbers.PhoneMetadata.prototype.getNoInternationalDiallingOrDefault = function() {
  return(this.get$ValueOrDefault(24));
};
i18n.phonenumbers.PhoneMetadata.prototype.setNoInternationalDialling = function(value) {
  this.set$Value(24, value);
};
i18n.phonenumbers.PhoneMetadata.prototype.hasNoInternationalDialling = function() {
  return this.has$Value(24);
};
i18n.phonenumbers.PhoneMetadata.prototype.noInternationalDiallingCount = function() {
  return this.count$Values(24);
};
i18n.phonenumbers.PhoneMetadata.prototype.clearNoInternationalDialling = function() {
  this.clear$Field(24);
};
i18n.phonenumbers.PhoneMetadata.prototype.getId = function() {
  return(this.get$Value(9));
};
i18n.phonenumbers.PhoneMetadata.prototype.getIdOrDefault = function() {
  return(this.get$ValueOrDefault(9));
};
i18n.phonenumbers.PhoneMetadata.prototype.setId = function(value) {
  this.set$Value(9, value);
};
i18n.phonenumbers.PhoneMetadata.prototype.hasId = function() {
  return this.has$Value(9);
};
i18n.phonenumbers.PhoneMetadata.prototype.idCount = function() {
  return this.count$Values(9);
};
i18n.phonenumbers.PhoneMetadata.prototype.clearId = function() {
  this.clear$Field(9);
};
i18n.phonenumbers.PhoneMetadata.prototype.getCountryCode = function() {
  return(this.get$Value(10));
};
i18n.phonenumbers.PhoneMetadata.prototype.getCountryCodeOrDefault = function() {
  return(this.get$ValueOrDefault(10));
};
i18n.phonenumbers.PhoneMetadata.prototype.setCountryCode = function(value) {
  this.set$Value(10, value);
};
i18n.phonenumbers.PhoneMetadata.prototype.hasCountryCode = function() {
  return this.has$Value(10);
};
i18n.phonenumbers.PhoneMetadata.prototype.countryCodeCount = function() {
  return this.count$Values(10);
};
i18n.phonenumbers.PhoneMetadata.prototype.clearCountryCode = function() {
  this.clear$Field(10);
};
i18n.phonenumbers.PhoneMetadata.prototype.getInternationalPrefix = function() {
  return(this.get$Value(11));
};
i18n.phonenumbers.PhoneMetadata.prototype.getInternationalPrefixOrDefault = function() {
  return(this.get$ValueOrDefault(11));
};
i18n.phonenumbers.PhoneMetadata.prototype.setInternationalPrefix = function(value) {
  this.set$Value(11, value);
};
i18n.phonenumbers.PhoneMetadata.prototype.hasInternationalPrefix = function() {
  return this.has$Value(11);
};
i18n.phonenumbers.PhoneMetadata.prototype.internationalPrefixCount = function() {
  return this.count$Values(11);
};
i18n.phonenumbers.PhoneMetadata.prototype.clearInternationalPrefix = function() {
  this.clear$Field(11);
};
i18n.phonenumbers.PhoneMetadata.prototype.getPreferredInternationalPrefix = function() {
  return(this.get$Value(17));
};
i18n.phonenumbers.PhoneMetadata.prototype.getPreferredInternationalPrefixOrDefault = function() {
  return(this.get$ValueOrDefault(17));
};
i18n.phonenumbers.PhoneMetadata.prototype.setPreferredInternationalPrefix = function(value) {
  this.set$Value(17, value);
};
i18n.phonenumbers.PhoneMetadata.prototype.hasPreferredInternationalPrefix = function() {
  return this.has$Value(17);
};
i18n.phonenumbers.PhoneMetadata.prototype.preferredInternationalPrefixCount = function() {
  return this.count$Values(17);
};
i18n.phonenumbers.PhoneMetadata.prototype.clearPreferredInternationalPrefix = function() {
  this.clear$Field(17);
};
i18n.phonenumbers.PhoneMetadata.prototype.getNationalPrefix = function() {
  return(this.get$Value(12));
};
i18n.phonenumbers.PhoneMetadata.prototype.getNationalPrefixOrDefault = function() {
  return(this.get$ValueOrDefault(12));
};
i18n.phonenumbers.PhoneMetadata.prototype.setNationalPrefix = function(value) {
  this.set$Value(12, value);
};
i18n.phonenumbers.PhoneMetadata.prototype.hasNationalPrefix = function() {
  return this.has$Value(12);
};
i18n.phonenumbers.PhoneMetadata.prototype.nationalPrefixCount = function() {
  return this.count$Values(12);
};
i18n.phonenumbers.PhoneMetadata.prototype.clearNationalPrefix = function() {
  this.clear$Field(12);
};
i18n.phonenumbers.PhoneMetadata.prototype.getPreferredExtnPrefix = function() {
  return(this.get$Value(13));
};
i18n.phonenumbers.PhoneMetadata.prototype.getPreferredExtnPrefixOrDefault = function() {
  return(this.get$ValueOrDefault(13));
};
i18n.phonenumbers.PhoneMetadata.prototype.setPreferredExtnPrefix = function(value) {
  this.set$Value(13, value);
};
i18n.phonenumbers.PhoneMetadata.prototype.hasPreferredExtnPrefix = function() {
  return this.has$Value(13);
};
i18n.phonenumbers.PhoneMetadata.prototype.preferredExtnPrefixCount = function() {
  return this.count$Values(13);
};
i18n.phonenumbers.PhoneMetadata.prototype.clearPreferredExtnPrefix = function() {
  this.clear$Field(13);
};
i18n.phonenumbers.PhoneMetadata.prototype.getNationalPrefixForParsing = function() {
  return(this.get$Value(15));
};
i18n.phonenumbers.PhoneMetadata.prototype.getNationalPrefixForParsingOrDefault = function() {
  return(this.get$ValueOrDefault(15));
};
i18n.phonenumbers.PhoneMetadata.prototype.setNationalPrefixForParsing = function(value) {
  this.set$Value(15, value);
};
i18n.phonenumbers.PhoneMetadata.prototype.hasNationalPrefixForParsing = function() {
  return this.has$Value(15);
};
i18n.phonenumbers.PhoneMetadata.prototype.nationalPrefixForParsingCount = function() {
  return this.count$Values(15);
};
i18n.phonenumbers.PhoneMetadata.prototype.clearNationalPrefixForParsing = function() {
  this.clear$Field(15);
};
i18n.phonenumbers.PhoneMetadata.prototype.getNationalPrefixTransformRule = function() {
  return(this.get$Value(16));
};
i18n.phonenumbers.PhoneMetadata.prototype.getNationalPrefixTransformRuleOrDefault = function() {
  return(this.get$ValueOrDefault(16));
};
i18n.phonenumbers.PhoneMetadata.prototype.setNationalPrefixTransformRule = function(value) {
  this.set$Value(16, value);
};
i18n.phonenumbers.PhoneMetadata.prototype.hasNationalPrefixTransformRule = function() {
  return this.has$Value(16);
};
i18n.phonenumbers.PhoneMetadata.prototype.nationalPrefixTransformRuleCount = function() {
  return this.count$Values(16);
};
i18n.phonenumbers.PhoneMetadata.prototype.clearNationalPrefixTransformRule = function() {
  this.clear$Field(16);
};
i18n.phonenumbers.PhoneMetadata.prototype.getSameMobileAndFixedLinePattern = function() {
  return(this.get$Value(18));
};
i18n.phonenumbers.PhoneMetadata.prototype.getSameMobileAndFixedLinePatternOrDefault = function() {
  return(this.get$ValueOrDefault(18));
};
i18n.phonenumbers.PhoneMetadata.prototype.setSameMobileAndFixedLinePattern = function(value) {
  this.set$Value(18, value);
};
i18n.phonenumbers.PhoneMetadata.prototype.hasSameMobileAndFixedLinePattern = function() {
  return this.has$Value(18);
};
i18n.phonenumbers.PhoneMetadata.prototype.sameMobileAndFixedLinePatternCount = function() {
  return this.count$Values(18);
};
i18n.phonenumbers.PhoneMetadata.prototype.clearSameMobileAndFixedLinePattern = function() {
  this.clear$Field(18);
};
i18n.phonenumbers.PhoneMetadata.prototype.getNumberFormat = function(index) {
  return(this.get$Value(19, index));
};
i18n.phonenumbers.PhoneMetadata.prototype.getNumberFormatOrDefault = function(index) {
  return(this.get$ValueOrDefault(19, index));
};
i18n.phonenumbers.PhoneMetadata.prototype.addNumberFormat = function(value) {
  this.add$Value(19, value);
};
i18n.phonenumbers.PhoneMetadata.prototype.numberFormatArray = function() {
  return(this.array$Values(19));
};
i18n.phonenumbers.PhoneMetadata.prototype.hasNumberFormat = function() {
  return this.has$Value(19);
};
i18n.phonenumbers.PhoneMetadata.prototype.numberFormatCount = function() {
  return this.count$Values(19);
};
i18n.phonenumbers.PhoneMetadata.prototype.clearNumberFormat = function() {
  this.clear$Field(19);
};
i18n.phonenumbers.PhoneMetadata.prototype.getIntlNumberFormat = function(index) {
  return(this.get$Value(20, index));
};
i18n.phonenumbers.PhoneMetadata.prototype.getIntlNumberFormatOrDefault = function(index) {
  return(this.get$ValueOrDefault(20, index));
};
i18n.phonenumbers.PhoneMetadata.prototype.addIntlNumberFormat = function(value) {
  this.add$Value(20, value);
};
i18n.phonenumbers.PhoneMetadata.prototype.intlNumberFormatArray = function() {
  return(this.array$Values(20));
};
i18n.phonenumbers.PhoneMetadata.prototype.hasIntlNumberFormat = function() {
  return this.has$Value(20);
};
i18n.phonenumbers.PhoneMetadata.prototype.intlNumberFormatCount = function() {
  return this.count$Values(20);
};
i18n.phonenumbers.PhoneMetadata.prototype.clearIntlNumberFormat = function() {
  this.clear$Field(20);
};
i18n.phonenumbers.PhoneMetadata.prototype.getMainCountryForCode = function() {
  return(this.get$Value(22));
};
i18n.phonenumbers.PhoneMetadata.prototype.getMainCountryForCodeOrDefault = function() {
  return(this.get$ValueOrDefault(22));
};
i18n.phonenumbers.PhoneMetadata.prototype.setMainCountryForCode = function(value) {
  this.set$Value(22, value);
};
i18n.phonenumbers.PhoneMetadata.prototype.hasMainCountryForCode = function() {
  return this.has$Value(22);
};
i18n.phonenumbers.PhoneMetadata.prototype.mainCountryForCodeCount = function() {
  return this.count$Values(22);
};
i18n.phonenumbers.PhoneMetadata.prototype.clearMainCountryForCode = function() {
  this.clear$Field(22);
};
i18n.phonenumbers.PhoneMetadata.prototype.getLeadingDigits = function() {
  return(this.get$Value(23));
};
i18n.phonenumbers.PhoneMetadata.prototype.getLeadingDigitsOrDefault = function() {
  return(this.get$ValueOrDefault(23));
};
i18n.phonenumbers.PhoneMetadata.prototype.setLeadingDigits = function(value) {
  this.set$Value(23, value);
};
i18n.phonenumbers.PhoneMetadata.prototype.hasLeadingDigits = function() {
  return this.has$Value(23);
};
i18n.phonenumbers.PhoneMetadata.prototype.leadingDigitsCount = function() {
  return this.count$Values(23);
};
i18n.phonenumbers.PhoneMetadata.prototype.clearLeadingDigits = function() {
  this.clear$Field(23);
};
i18n.phonenumbers.PhoneMetadata.prototype.getLeadingZeroPossible = function() {
  return(this.get$Value(26));
};
i18n.phonenumbers.PhoneMetadata.prototype.getLeadingZeroPossibleOrDefault = function() {
  return(this.get$ValueOrDefault(26));
};
i18n.phonenumbers.PhoneMetadata.prototype.setLeadingZeroPossible = function(value) {
  this.set$Value(26, value);
};
i18n.phonenumbers.PhoneMetadata.prototype.hasLeadingZeroPossible = function() {
  return this.has$Value(26);
};
i18n.phonenumbers.PhoneMetadata.prototype.leadingZeroPossibleCount = function() {
  return this.count$Values(26);
};
i18n.phonenumbers.PhoneMetadata.prototype.clearLeadingZeroPossible = function() {
  this.clear$Field(26);
};
i18n.phonenumbers.PhoneMetadataCollection = function() {
  goog.proto2.Message.apply(this);
};
goog.inherits(i18n.phonenumbers.PhoneMetadataCollection, goog.proto2.Message);
i18n.phonenumbers.PhoneMetadataCollection.prototype.clone;
i18n.phonenumbers.PhoneMetadataCollection.prototype.getMetadata = function(index) {
  return(this.get$Value(1, index));
};
i18n.phonenumbers.PhoneMetadataCollection.prototype.getMetadataOrDefault = function(index) {
  return(this.get$ValueOrDefault(1, index));
};
i18n.phonenumbers.PhoneMetadataCollection.prototype.addMetadata = function(value) {
  this.add$Value(1, value);
};
i18n.phonenumbers.PhoneMetadataCollection.prototype.metadataArray = function() {
  return(this.array$Values(1));
};
i18n.phonenumbers.PhoneMetadataCollection.prototype.hasMetadata = function() {
  return this.has$Value(1);
};
i18n.phonenumbers.PhoneMetadataCollection.prototype.metadataCount = function() {
  return this.count$Values(1);
};
i18n.phonenumbers.PhoneMetadataCollection.prototype.clearMetadata = function() {
  this.clear$Field(1);
};
goog.proto2.Message.set$Metadata(i18n.phonenumbers.NumberFormat, {0:{name:"NumberFormat", fullName:"i18n.phonenumbers.NumberFormat"}, 1:{name:"pattern", required:true, fieldType:goog.proto2.Message.FieldType.STRING, type:String}, 2:{name:"format", required:true, fieldType:goog.proto2.Message.FieldType.STRING, type:String}, 3:{name:"leading_digits_pattern", repeated:true, fieldType:goog.proto2.Message.FieldType.STRING, type:String}, 4:{name:"national_prefix_formatting_rule", fieldType:goog.proto2.Message.FieldType.STRING, 
type:String}, 6:{name:"national_prefix_optional_when_formatting", fieldType:goog.proto2.Message.FieldType.BOOL, type:Boolean}, 5:{name:"domestic_carrier_code_formatting_rule", fieldType:goog.proto2.Message.FieldType.STRING, type:String}});
goog.proto2.Message.set$Metadata(i18n.phonenumbers.PhoneNumberDesc, {0:{name:"PhoneNumberDesc", fullName:"i18n.phonenumbers.PhoneNumberDesc"}, 2:{name:"national_number_pattern", fieldType:goog.proto2.Message.FieldType.STRING, type:String}, 3:{name:"possible_number_pattern", fieldType:goog.proto2.Message.FieldType.STRING, type:String}, 6:{name:"example_number", fieldType:goog.proto2.Message.FieldType.STRING, type:String}});
goog.proto2.Message.set$Metadata(i18n.phonenumbers.PhoneMetadata, {0:{name:"PhoneMetadata", fullName:"i18n.phonenumbers.PhoneMetadata"}, 1:{name:"general_desc", required:true, fieldType:goog.proto2.Message.FieldType.MESSAGE, type:i18n.phonenumbers.PhoneNumberDesc}, 2:{name:"fixed_line", required:true, fieldType:goog.proto2.Message.FieldType.MESSAGE, type:i18n.phonenumbers.PhoneNumberDesc}, 3:{name:"mobile", required:true, fieldType:goog.proto2.Message.FieldType.MESSAGE, type:i18n.phonenumbers.PhoneNumberDesc}, 
4:{name:"toll_free", required:true, fieldType:goog.proto2.Message.FieldType.MESSAGE, type:i18n.phonenumbers.PhoneNumberDesc}, 5:{name:"premium_rate", required:true, fieldType:goog.proto2.Message.FieldType.MESSAGE, type:i18n.phonenumbers.PhoneNumberDesc}, 6:{name:"shared_cost", required:true, fieldType:goog.proto2.Message.FieldType.MESSAGE, type:i18n.phonenumbers.PhoneNumberDesc}, 7:{name:"personal_number", required:true, fieldType:goog.proto2.Message.FieldType.MESSAGE, type:i18n.phonenumbers.PhoneNumberDesc}, 
8:{name:"voip", required:true, fieldType:goog.proto2.Message.FieldType.MESSAGE, type:i18n.phonenumbers.PhoneNumberDesc}, 21:{name:"pager", required:true, fieldType:goog.proto2.Message.FieldType.MESSAGE, type:i18n.phonenumbers.PhoneNumberDesc}, 25:{name:"uan", required:true, fieldType:goog.proto2.Message.FieldType.MESSAGE, type:i18n.phonenumbers.PhoneNumberDesc}, 27:{name:"emergency", required:true, fieldType:goog.proto2.Message.FieldType.MESSAGE, type:i18n.phonenumbers.PhoneNumberDesc}, 28:{name:"voicemail", 
required:true, fieldType:goog.proto2.Message.FieldType.MESSAGE, type:i18n.phonenumbers.PhoneNumberDesc}, 24:{name:"no_international_dialling", required:true, fieldType:goog.proto2.Message.FieldType.MESSAGE, type:i18n.phonenumbers.PhoneNumberDesc}, 9:{name:"id", required:true, fieldType:goog.proto2.Message.FieldType.STRING, type:String}, 10:{name:"country_code", required:true, fieldType:goog.proto2.Message.FieldType.INT32, type:Number}, 11:{name:"international_prefix", required:true, fieldType:goog.proto2.Message.FieldType.STRING, 
type:String}, 17:{name:"preferred_international_prefix", fieldType:goog.proto2.Message.FieldType.STRING, type:String}, 12:{name:"national_prefix", fieldType:goog.proto2.Message.FieldType.STRING, type:String}, 13:{name:"preferred_extn_prefix", fieldType:goog.proto2.Message.FieldType.STRING, type:String}, 15:{name:"national_prefix_for_parsing", fieldType:goog.proto2.Message.FieldType.STRING, type:String}, 16:{name:"national_prefix_transform_rule", fieldType:goog.proto2.Message.FieldType.STRING, type:String}, 
18:{name:"same_mobile_and_fixed_line_pattern", fieldType:goog.proto2.Message.FieldType.BOOL, defaultValue:false, type:Boolean}, 19:{name:"number_format", repeated:true, fieldType:goog.proto2.Message.FieldType.MESSAGE, type:i18n.phonenumbers.NumberFormat}, 20:{name:"intl_number_format", repeated:true, fieldType:goog.proto2.Message.FieldType.MESSAGE, type:i18n.phonenumbers.NumberFormat}, 22:{name:"main_country_for_code", fieldType:goog.proto2.Message.FieldType.BOOL, defaultValue:false, type:Boolean}, 
23:{name:"leading_digits", fieldType:goog.proto2.Message.FieldType.STRING, type:String}, 26:{name:"leading_zero_possible", fieldType:goog.proto2.Message.FieldType.BOOL, defaultValue:false, type:Boolean}});
goog.proto2.Message.set$Metadata(i18n.phonenumbers.PhoneMetadataCollection, {0:{name:"PhoneMetadataCollection", fullName:"i18n.phonenumbers.PhoneMetadataCollection"}, 1:{name:"metadata", repeated:true, fieldType:goog.proto2.Message.FieldType.MESSAGE, type:i18n.phonenumbers.PhoneMetadata}});
/*

 Copyright (C) 2010 The Libphonenumber Authors

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
*/
goog.provide("i18n.phonenumbers.metadata");
i18n.phonenumbers.metadata.countryCodeToRegionCodeMap = {1:["US", "AG", "AI", "AS", "BB", "BM", "BS", "CA", "DM", "DO", "GD", "GU", "JM", "KN", "KY", "LC", "MP", "MS", "PR", "SX", "TC", "TT", "VC", "VG", "VI"], 7:["RU", "KZ"], 20:["EG"], 27:["ZA"], 30:["GR"], 31:["NL"], 32:["BE"], 33:["FR"], 34:["ES"], 36:["HU"], 39:["IT"], 40:["RO"], 41:["CH"], 43:["AT"], 44:["GB", "GG", "IM", "JE"], 45:["DK"], 46:["SE"], 47:["NO", "SJ"], 48:["PL"], 49:["DE"], 51:["PE"], 52:["MX"], 53:["CU"], 54:["AR"], 55:["BR"], 
56:["CL"], 57:["CO"], 58:["VE"], 60:["MY"], 61:["AU", "CC", "CX"], 62:["ID"], 63:["PH"], 64:["NZ"], 65:["SG"], 66:["TH"], 81:["JP"], 82:["KR"], 84:["VN"], 86:["CN"], 90:["TR"], 91:["IN"], 92:["PK"], 93:["AF"], 94:["LK"], 95:["MM"], 98:["IR"], 211:["SS"], 212:["MA", "EH"], 213:["DZ"], 216:["TN"], 218:["LY"], 220:["GM"], 221:["SN"], 222:["MR"], 223:["ML"], 224:["GN"], 225:["CI"], 226:["BF"], 227:["NE"], 228:["TG"], 229:["BJ"], 230:["MU"], 231:["LR"], 232:["SL"], 233:["GH"], 234:["NG"], 235:["TD"], 
236:["CF"], 237:["CM"], 238:["CV"], 239:["ST"], 240:["GQ"], 241:["GA"], 242:["CG"], 243:["CD"], 244:["AO"], 245:["GW"], 246:["IO"], 247:["AC"], 248:["SC"], 249:["SD"], 250:["RW"], 251:["ET"], 252:["SO"], 253:["DJ"], 254:["KE"], 255:["TZ"], 256:["UG"], 257:["BI"], 258:["MZ"], 260:["ZM"], 261:["MG"], 262:["RE", "YT"], 263:["ZW"], 264:["NA"], 265:["MW"], 266:["LS"], 267:["BW"], 268:["SZ"], 269:["KM"], 290:["SH", "TA"], 291:["ER"], 297:["AW"], 298:["FO"], 299:["GL"], 350:["GI"], 351:["PT"], 352:["LU"], 
353:["IE"], 354:["IS"], 355:["AL"], 356:["MT"], 357:["CY"], 358:["FI", "AX"], 359:["BG"], 370:["LT"], 371:["LV"], 372:["EE"], 373:["MD"], 374:["AM"], 375:["BY"], 376:["AD"], 377:["MC"], 378:["SM"], 379:["VA"], 380:["UA"], 381:["RS"], 382:["ME"], 385:["HR"], 386:["SI"], 387:["BA"], 389:["MK"], 420:["CZ"], 421:["SK"], 423:["LI"], 500:["FK"], 501:["BZ"], 502:["GT"], 503:["SV"], 504:["HN"], 505:["NI"], 506:["CR"], 507:["PA"], 508:["PM"], 509:["HT"], 590:["GP", "BL", "MF"], 591:["BO"], 592:["GY"], 593:["EC"], 
594:["GF"], 595:["PY"], 596:["MQ"], 597:["SR"], 598:["UY"], 599:["CW", "BQ"], 670:["TL"], 672:["NF"], 673:["BN"], 674:["NR"], 675:["PG"], 676:["TO"], 677:["SB"], 678:["VU"], 679:["FJ"], 680:["PW"], 681:["WF"], 682:["CK"], 683:["NU"], 685:["WS"], 686:["KI"], 687:["NC"], 688:["TV"], 689:["PF"], 690:["TK"], 691:["FM"], 692:["MH"], 800:["001"], 808:["001"], 850:["KP"], 852:["HK"], 853:["MO"], 855:["KH"], 856:["LA"], 870:["001"], 878:["001"], 880:["BD"], 881:["001"], 882:["001"], 883:["001"], 886:["TW"], 
888:["001"], 960:["MV"], 961:["LB"], 962:["JO"], 963:["SY"], 964:["IQ"], 965:["KW"], 966:["SA"], 967:["YE"], 968:["OM"], 970:["PS"], 971:["AE"], 972:["IL"], 973:["BH"], 974:["QA"], 975:["BT"], 976:["MN"], 977:["NP"], 979:["001"], 992:["TJ"], 993:["TM"], 994:["AZ"], 995:["GE"], 996:["KG"], 998:["UZ"]};
i18n.phonenumbers.metadata.countryToMetadata = {"AC":[, [, , "[2-7]\\d{3,5}", "\\d{4,6}"], [, , "(?:[267]\\d|3[0-5]|4[4-69])\\d{2}", "\\d{4}", , , "6889"], [, , "5\\d{5}", "\\d{6}", , , "501234"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], "AC", 247, "00", , , , , , , , , , [, , "NA", "NA"], , , [, , "NA", "NA"], [, , "NA", "NA"], , , [, , "NA", "NA"]], "AD":[, [, , "(?:[346-9]|180)\\d{5}", "\\d{6,8}"], [, , "[78]\\d{5}", "\\d{6}", , , "712345"], [, 
, "[346]\\d{5}", "\\d{6}", , , "312345"], [, , "180[02]\\d{4}", "\\d{8}", , , "18001234"], [, , "9\\d{5}", "\\d{6}", , , "912345"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], "AD", 376, "00", , , , , , , , [[, "(\\d{3})(\\d{3})", "$1 $2", ["[346-9]"], "", "", 0], [, "(180[02])(\\d{4})", "$1 $2", ["1"], "", "", 0]], , [, , "NA", "NA"], , , [, , "NA", "NA"], [, , "NA", "NA"], , , [, , "NA", "NA"]], "AE":[, [, , "[2-79]\\d{7,8}|800\\d{2,9}", "\\d{5,12}"], [, , "[2-4679][2-8]\\d{6}", "\\d{7,8}", 
, , "22345678"], [, , "5[0256]\\d{7}", "\\d{9}", , , "501234567"], [, , "400\\d{6}|800\\d{2,9}", "\\d{5,12}", , , "800123456"], [, , "900[02]\\d{5}", "\\d{9}", , , "900234567"], [, , "700[05]\\d{5}", "\\d{9}", , , "700012345"], [, , "NA", "NA"], [, , "NA", "NA"], "AE", 971, "00", "0", , , "0", , , , [[, "([2-4679])(\\d{3})(\\d{4})", "$1 $2 $3", ["[2-4679][2-8]"], "0$1", "", 0], [, "(5[0256])(\\d{3})(\\d{4})", "$1 $2 $3", ["5"], "0$1", "", 0], [, "([479]00)(\\d)(\\d{5})", "$1 $2 $3", ["[479]0"], "$1", 
"", 0], [, "([68]00)(\\d{2,9})", "$1 $2", ["60|8"], "$1", "", 0]], , [, , "NA", "NA"], , , [, , "NA", "NA"], [, , "600[25]\\d{5}", "\\d{9}", , , "600212345"], , , [, , "NA", "NA"]], "AF":[, [, , "[2-7]\\d{8}", "\\d{7,9}"], [, , "(?:[25][0-8]|[34][0-4]|6[0-5])[2-9]\\d{6}", "\\d{7,9}", , , "234567890"], [, , "7(?:[05-9]\\d{7}|29\\d{6})", "\\d{9}", , , "701234567"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], "AF", 93, "00", "0", , , "0", , , , [[, "([2-7]\\d)(\\d{3})(\\d{4})", 
"$1 $2 $3", ["[2-6]|7[013-9]"], "0$1", "", 0], [, "(729)(\\d{3})(\\d{3})", "$1 $2 $3", ["729"], "0$1", "", 0]], , [, , "NA", "NA"], , , [, , "NA", "NA"], [, , "NA", "NA"], , , [, , "NA", "NA"]], "AG":[, [, , "[2589]\\d{9}", "\\d{7}(?:\\d{3})?"], [, , "268(?:4(?:6[0-38]|84)|56[0-2])\\d{4}", "\\d{7}(?:\\d{3})?", , , "2684601234"], [, , "268(?:464|7(?:2[0-9]|64|7[0-689]|8[02-68]))\\d{4}", "\\d{10}", , , "2684641234"], [, , "8(?:00|44|55|66|77|88)[2-9]\\d{6}", "\\d{10}", , , "8002123456"], [, , "900[2-9]\\d{6}", 
"\\d{10}", , , "9002123456"], [, , "NA", "NA"], [, , "5(?:00|33|44|66|77)[2-9]\\d{6}", "\\d{10}", , , "5002345678"], [, , "26848[01]\\d{4}", "\\d{10}", , , "2684801234"], "AG", 1, "011", "1", , , "1", , , , , , [, , "26840[69]\\d{4}", "\\d{10}", , , "2684061234"], , "268", [, , "NA", "NA"], [, , "NA", "NA"], , , [, , "NA", "NA"]], "AI":[, [, , "[2589]\\d{9}", "\\d{7}(?:\\d{3})?"], [, , "2644(?:6[12]|9[78])\\d{4}", "\\d{7}(?:\\d{3})?", , , "2644612345"], [, , "264(?:235|476|5(?:3[6-9]|8[1-4])|7(?:29|72))\\d{4}", 
"\\d{10}", , , "2642351234"], [, , "8(?:00|44|55|66|77|88)[2-9]\\d{6}", "\\d{10}", , , "8002123456"], [, , "900[2-9]\\d{6}", "\\d{10}", , , "9002123456"], [, , "NA", "NA"], [, , "5(?:00|33|44|66|77)[2-9]\\d{6}", "\\d{10}", , , "5002345678"], [, , "NA", "NA"], "AI", 1, "011", "1", , , "1", , , , , , [, , "NA", "NA"], , "264", [, , "NA", "NA"], [, , "NA", "NA"], , , [, , "NA", "NA"]], "AL":[, [, , "[2-57]\\d{7}|6\\d{8}|8\\d{5,7}|9\\d{5}", "\\d{5,9}"], [, , "(?:2(?:[168][1-9]|[247]\\d|9[1-7])|3(?:1[1-3]|[2-6]\\d|[79][1-8]|8[1-9])|4\\d{2}|5(?:1[1-4]|[2-578]\\d|6[1-5]|9[1-7])|8(?:[19][1-5]|[2-6]\\d|[78][1-7]))\\d{5}", 
"\\d{5,8}", , , "22345678"], [, , "6[6-9]\\d{7}", "\\d{9}", , , "661234567"], [, , "800\\d{4}", "\\d{7}", , , "8001234"], [, , "900\\d{3}", "\\d{6}", , , "900123"], [, , "808\\d{3}", "\\d{6}", , , "808123"], [, , "700\\d{5}", "\\d{8}", , , "70012345"], [, , "NA", "NA"], "AL", 355, "00", "0", , , "0", , , , [[, "(4)(\\d{3})(\\d{4})", "$1 $2 $3", ["4[0-6]"], "0$1", "", 0], [, "(6[6-9])(\\d{3})(\\d{4})", "$1 $2 $3", ["6"], "0$1", "", 0], [, "(\\d{2})(\\d{3})(\\d{3})", "$1 $2 $3", ["[2358][2-5]|4[7-9]"], 
"0$1", "", 0], [, "(\\d{3})(\\d{3,5})", "$1 $2", ["[235][16-9]|8[016-9]|[79]"], "0$1", "", 0]], , [, , "NA", "NA"], , , [, , "NA", "NA"], [, , "NA", "NA"], , , [, , "NA", "NA"]], "AM":[, [, , "[1-9]\\d{7}", "\\d{5,8}"], [, , "(?:1[01]\\d|2(?:2[2-46]|3[1-8]|4[2-69]|5[2-7]|6[1-9]|8[1-7])|3[12]2|47\\d)\\d{5}", "\\d{5,8}", , , "10123456"], [, , "(?:4[139]|55|77|9[1-9])\\d{6}", "\\d{8}", , , "77123456"], [, , "800\\d{5}", "\\d{8}", , , "80012345"], [, , "90[016]\\d{5}", "\\d{8}", , , "90012345"], [, , 
"80[1-4]\\d{5}", "\\d{8}", , , "80112345"], [, , "NA", "NA"], [, , "60[2-6]\\d{5}", "\\d{8}", , , "60271234"], "AM", 374, "00", "0", , , "0", , , , [[, "(\\d{2})(\\d{6})", "$1 $2", ["1|47"], "(0$1)", "", 0], [, "(\\d{2})(\\d{6})", "$1 $2", ["4[139]|[5-7]|9[1-9]"], "0$1", "", 0], [, "(\\d{3})(\\d{5})", "$1 $2", ["[23]"], "(0$1)", "", 0], [, "(\\d{3})(\\d{2})(\\d{3})", "$1 $2 $3", ["8|90"], "0 $1", "", 0]], , [, , "NA", "NA"], , , [, , "NA", "NA"], [, , "NA", "NA"], , , [, , "NA", "NA"]], "AO":[, [, 
, "[29]\\d{8}", "\\d{9}"], [, , "2\\d(?:[26-9]\\d|\\d[26-9])\\d{5}", "\\d{9}", , , "222123456"], [, , "9[1-49]\\d{7}", "\\d{9}", , , "923123456"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], "AO", 244, "00", , , , , , , , [[, "(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", , "", "", 0]], , [, , "NA", "NA"], , , [, , "NA", "NA"], [, , "NA", "NA"], , , [, , "NA", "NA"]], "AR":[, [, , "11\\d{8}|[2368]\\d{9}|9\\d{10}", "\\d{6,11}"], [, , "11\\d{8}|(?:2(?:2(?:[013]\\d|2[13-79]|4[1-6]|5[2457]|6[124-8]|7[1-4]|8[13-6]|9[1267])|3(?:1[467]|2[03-6]|3[13-8]|[49][2-6]|5[2-8]|[067]\\d)|4(?:7[3-8]|9\\d)|6(?:[01346]\\d|2[24-6]|5[15-8])|80\\d|9(?:[0124789]\\d|3[1-6]|5[234]|6[2-46]))|3(?:3(?:2[79]|6\\d|8[2578])|4(?:[78]\\d|0[0124-9]|[1-35]\\d|4[24-7]|6[02-9]|9[123678])|5(?:[138]\\d|2[1245]|4[1-9]|6[2-4]|7[1-6])|6[24]\\d|7(?:[0469]\\d|1[1568]|2[013-9]|3[145]|5[14-8]|7[2-57]|8[0-24-9])|8(?:[013578]\\d|2[15-7]|4[13-6]|6[1-357-9]|9[124]))|670\\d)\\d{6}", 
"\\d{6,10}", , , "1123456789"], [, , "675\\d{7}|9(?:11[2-9]\\d{7}|(?:2(?:2[013]|3[067]|49|6[01346]|80|9[147-9])|3(?:36|4[12358]|5[138]|6[24]|7[069]|8[013578]))[2-9]\\d{6}|\\d{4}[2-9]\\d{5})", "\\d{6,11}", , , "91123456789"], [, , "800\\d{7}", "\\d{10}", , , "8001234567"], [, , "60[04579]\\d{7}", "\\d{10}", , , "6001234567"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], "AR", 54, "00", "0", , , "0?(?:(11|2(?:2(?:02?|[13]|2[13-79]|4[1-6]|5[2457]|6[124-8]|7[1-4]|8[13-6]|9[1267])|3(?:02?|1[467]|2[03-6]|3[13-8]|[49][2-6]|5[2-8]|[67])|4(?:7[3-578]|9)|6(?:[0136]|2[24-6]|4[6-8]?|5[15-8])|80|9(?:0[1-3]|[19]|2\\d|3[1-6]|4[02568]?|5[2-4]|6[2-46]|72?|8[23]?))|3(?:3(?:2[79]|6|8[2578])|4(?:0[124-9]|[12]|3[5-8]?|4[24-7]|5[4-68]?|6[02-9]|7[126]|8[2379]?|9[1-36-8])|5(?:1|2[1245]|3[237]?|4[1-46-9]|6[2-4]|7[1-6]|8[2-5]?)|6[24]|7(?:1[1568]|2[15]|3[145]|4[13]|5[14-8]|[069]|7[2-57]|8[126])|8(?:[01]|2[15-7]|3[2578]?|4[13-6]|5[4-8]?|6[1-357-9]|7[36-8]?|8[5-8]?|9[124])))?15)?", 
"9$1", , , [[, "([68]\\d{2})(\\d{3})(\\d{4})", "$1-$2-$3", ["[68]"], "0$1", "", 0], [, "(\\d{2})(\\d{4})", "$1-$2", ["[2-9]"], "$1", "", 0], [, "(\\d{3})(\\d{4})", "$1-$2", ["[2-9]"], "$1", "", 0], [, "(\\d{4})(\\d{4})", "$1-$2", ["[2-9]"], "$1", "", 0], [, "(9)(11)(\\d{4})(\\d{4})", "$2 15-$3-$4", ["911"], "0$1", "", 0], [, "(9)(\\d{3})(\\d{3})(\\d{4})", "$2 15-$3-$4", ["9(?:2[234689]|3[3-8])", "9(?:2(?:2[013]|3[067]|49|6[01346]|80|9[147-9])|3(?:36|4[12358]|5[138]|6[24]|7[069]|8[013578]))", "9(?:2(?:2[013]|3[067]|49|6[01346]|80|9(?:[179]|4[13479]|8[014-9]))|3(?:36|4[12358]|5(?:[18]|3[014-689])|6[24]|7[069]|8(?:[01]|3[013469]|5[0-39]|7[0-2459]|8[0-49])))"], 
"0$1", "", 0], [, "(9)(\\d{4})(\\d{2})(\\d{4})", "$2 15-$3-$4", ["9[23]"], "0$1", "", 0], [, "(11)(\\d{4})(\\d{4})", "$1 $2-$3", ["1"], "0$1", "", 1], [, "(\\d{3})(\\d{3})(\\d{4})", "$1 $2-$3", ["2(?:2[013]|3[067]|49|6[01346]|80|9[147-9])|3(?:36|4[12358]|5[138]|6[24]|7[069]|8[013578])", "2(?:2[013]|3[067]|49|6[01346]|80|9(?:[179]|4[13479]|8[014-9]))|3(?:36|4[12358]|5(?:[18]|3[0-689])|6[24]|7[069]|8(?:[01]|3[013469]|5[0-39]|7[0-2459]|8[0-49]))"], "0$1", "", 1], [, "(\\d{4})(\\d{2})(\\d{4})", "$1 $2-$3", 
["[23]"], "0$1", "", 1], [, "(\\d{3})", "$1", ["1[012]|911"], "$1", "", 0]], [[, "([68]\\d{2})(\\d{3})(\\d{4})", "$1-$2-$3", ["[68]"], "0$1", "", 0], [, "(9)(11)(\\d{4})(\\d{4})", "$1 $2 $3-$4", ["911"]], [, "(9)(\\d{3})(\\d{3})(\\d{4})", "$1 $2 $3-$4", ["9(?:2[234689]|3[3-8])", "9(?:2(?:2[013]|3[067]|49|6[01346]|80|9[147-9])|3(?:36|4[12358]|5[138]|6[24]|7[069]|8[013578]))", "9(?:2(?:2[013]|3[067]|49|6[01346]|80|9(?:[179]|4[13479]|8[014-9]))|3(?:36|4[12358]|5(?:[18]|3[014-689])|6[24]|7[069]|8(?:[01]|3[013469]|5[0-39]|7[0-2459]|8[0-49])))"]], 
[, "(9)(\\d{4})(\\d{2})(\\d{4})", "$1 $2 $3-$4", ["9[23]"]], [, "(11)(\\d{4})(\\d{4})", "$1 $2-$3", ["1"], "0$1", "", 1], [, "(\\d{3})(\\d{3})(\\d{4})", "$1 $2-$3", ["2(?:2[013]|3[067]|49|6[01346]|80|9[147-9])|3(?:36|4[12358]|5[138]|6[24]|7[069]|8[013578])", "2(?:2[013]|3[067]|49|6[01346]|80|9(?:[179]|4[13479]|8[014-9]))|3(?:36|4[12358]|5(?:[18]|3[0-689])|6[24]|7[069]|8(?:[01]|3[013469]|5[0-39]|7[0-2459]|8[0-49]))"], "0$1", "", 1], [, "(\\d{4})(\\d{2})(\\d{4})", "$1 $2-$3", ["[23]"], "0$1", "", 1]], 
[, , "NA", "NA"], , , [, , "810\\d{7}", "\\d{10}", , , "8101234567"], [, , "810\\d{7}", "\\d{10}", , , "8101234567"], , , [, , "NA", "NA"]], "AS":[, [, , "[5689]\\d{9}", "\\d{7}(?:\\d{3})?"], [, , "6846(?:22|33|44|55|77|88|9[19])\\d{4}", "\\d{7}(?:\\d{3})?", , , "6846221234"], [, , "684(?:25[2468]|7(?:3[13]|70))\\d{4}", "\\d{10}", , , "6847331234"], [, , "8(?:00|44|55|66|77|88)[2-9]\\d{6}", "\\d{10}", , , "8002123456"], [, , "900[2-9]\\d{6}", "\\d{10}", , , "9002123456"], [, , "NA", "NA"], [, , "5(?:00|33|44|66|77)[2-9]\\d{6}", 
"\\d{10}", , , "5002345678"], [, , "NA", "NA"], "AS", 1, "011", "1", , , "1", , , , , , [, , "NA", "NA"], , "684", [, , "NA", "NA"], [, , "NA", "NA"], , , [, , "NA", "NA"]], "AT":[, [, , "[1-9]\\d{3,12}", "\\d{3,13}"], [, , "1\\d{3,12}|(?:2(?:1[467]|2[13-8]|5[2357]|6[1-46-8]|7[1-8]|8[124-7]|9[1458])|3(?:1[1-8]|3[23568]|4[5-7]|5[1378]|6[1-38]|8[3-68])|4(?:2[1-8]|35|63|7[1368]|8[2457])|5(?:12|2[1-8]|3[357]|4[147]|5[12578]|6[37])|6(?:13|2[1-47]|4[1-35-8]|5[468]|62)|7(?:2[1-8]|3[25]|4[13478]|5[68]|6[16-8]|7[1-6]|9[45]))\\d{3,10}", 
"\\d{3,13}", , , "1234567890"], [, , "6(?:44|5[0-3579]|6[013-9]|[7-9]\\d)\\d{4,10}", "\\d{7,13}", , , "644123456"], [, , "80[02]\\d{6,10}", "\\d{9,13}", , , "800123456"], [, , "(?:711|9(?:0[01]|3[019]))\\d{6,10}", "\\d{9,13}", , , "900123456"], [, , "8(?:10|2[018])\\d{6,10}", "\\d{9,13}", , , "810123456"], [, , "NA", "NA"], [, , "780\\d{6,10}", "\\d{9,13}", , , "780123456"], "AT", 43, "00", "0", , , "0", , , , [[, "(1)(\\d{3,12})", "$1 $2", ["1"], "0$1", "", 0], [, "(5\\d)(\\d{3,5})", "$1 $2", ["5[079]"], 
"0$1", "", 0], [, "(5\\d)(\\d{3})(\\d{3,4})", "$1 $2 $3", ["5[079]"], "0$1", "", 0], [, "(5\\d)(\\d{4})(\\d{4,7})", "$1 $2 $3", ["5[079]"], "0$1", "", 0], [, "(\\d{3})(\\d{3,10})", "$1 $2", ["316|46|51|732|6(?:44|5[0-3579]|[6-9])|7(?:1|[28]0)|[89]"], "0$1", "", 0], [, "(\\d{4})(\\d{3,9})", "$1 $2", ["2|3(?:1[1-578]|[3-8])|4[2378]|5[2-6]|6(?:[12]|4[1-35-9]|5[468])|7(?:2[1-8]|35|4[1-8]|[5-79])"], "0$1", "", 0]], , [, , "NA", "NA"], , , [, , "NA", "NA"], [, , "5(?:(?:0[1-9]|17)\\d{2,10}|[79]\\d{3,11})|720\\d{6,10}", 
"\\d{5,13}", , , "50123"], , , [, , "NA", "NA"]], "AU":[, [, , "[1-578]\\d{5,9}", "\\d{6,10}"], [, , "[237]\\d{8}|8(?:[68]\\d{3}|7[0-69]\\d{2}|9(?:[02-9]\\d{2}|1(?:[0-57-9]\\d|6[0135-9])))\\d{4}", "\\d{8,9}", , , "212345678"], [, , "14(?:5\\d|71)\\d{5}|4(?:[0-2]\\d|3[0-57-9]|4[47-9]|5[0-25-9]|6[6-9]|7[03-9]|8[17-9]|9[017-9])\\d{6}", "\\d{9}", , , "412345678"], [, , "180(?:0\\d{3}|2)\\d{3}", "\\d{7,10}", , , "1800123456"], [, , "190[0126]\\d{6}", "\\d{10}", , , "1900123456"], [, , "13(?:00\\d{2})?\\d{4}", 
"\\d{6,10}", , , "1300123456"], [, , "500\\d{6}", "\\d{9}", , , "500123456"], [, , "550\\d{6}", "\\d{9}", , , "550123456"], "AU", 61, "(?:14(?:1[14]|34|4[17]|[56]6|7[47]|88))?001[14-689]", "0", , , "0", , "0011", , [[, "([2378])(\\d{4})(\\d{4})", "$1 $2 $3", ["[2378]"], "(0$1)", "", 0], [, "(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", ["[45]|14"], "0$1", "", 0], [, "(16)(\\d{3})(\\d{2,4})", "$1 $2 $3", ["16"], "0$1", "", 0], [, "(1[389]\\d{2})(\\d{3})(\\d{3})", "$1 $2 $3", ["1(?:[38]0|90)", "1(?:[38]00|90)"], 
"$1", "", 0], [, "(180)(2\\d{3})", "$1 $2", ["180", "1802"], "$1", "", 0], [, "(19\\d)(\\d{3})", "$1 $2", ["19[13]"], "$1", "", 0], [, "(19\\d{2})(\\d{4})", "$1 $2", ["19[67]"], "$1", "", 0], [, "(13)(\\d{2})(\\d{2})", "$1 $2 $3", ["13[1-9]"], "$1", "", 0]], , [, , "16\\d{3,7}", "\\d{5,9}", , , "1612345"], 1, , [, , "1(?:3(?:\\d{4}|00\\d{6})|80(?:0\\d{6}|2\\d{3}))", "\\d{6,10}", , , "1300123456"], [, , "NA", "NA"], , , [, , "NA", "NA"]], "AW":[, [, , "[25-9]\\d{6}", "\\d{7}"], [, , "5(?:2\\d|8[1-9])\\d{4}", 
"\\d{7}", , , "5212345"], [, , "(?:5(?:6\\d|9[2-478])|6(?:[039]0|22|4[01]|6[0-2])|7[34]\\d|9(?:6[45]|9[4-8]))\\d{4}", "\\d{7}", , , "5601234"], [, , "800\\d{4}", "\\d{7}", , , "8001234"], [, , "900\\d{4}", "\\d{7}", , , "9001234"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "28\\d{5}|501\\d{4}", "\\d{7}", , , "5011234"], "AW", 297, "00", , , , , , , , [[, "(\\d{3})(\\d{4})", "$1 $2", , "", "", 0]], , [, , "NA", "NA"], , , [, , "NA", "NA"], [, , "NA", "NA"], , , [, , "NA", "NA"]], "AX":[, [, , "[135]\\d{5,9}|[27]\\d{4,9}|4\\d{5,10}|6\\d{7,8}|8\\d{6,9}", 
"\\d{5,12}"], [, , "18[1-8]\\d{3,9}", "\\d{6,12}", , , "1812345678"], [, , "4\\d{5,10}|50\\d{4,8}", "\\d{6,11}", , , "412345678"], [, , "800\\d{4,7}", "\\d{7,10}", , , "8001234567"], [, , "[67]00\\d{5,6}", "\\d{8,9}", , , "600123456"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], "AX", 358, "00|99[049]", "0", , , "0", , , , , , [, , "NA", "NA"], , , [, , "[13]00\\d{3,7}|2(?:0(?:0\\d{3,7}|2[023]\\d{1,6}|9[89]\\d{1,6}))|60(?:[12]\\d{5,6}|6\\d{7})|7(?:1\\d{7}|3\\d{8}|5[03-9]\\d{2,7})", "\\d{5,10}", 
, , "100123"], [, , "[13]0\\d{4,8}|2(?:0(?:[016-8]\\d{3,7}|[2-59]\\d{2,7})|9\\d{4,8})|60(?:[12]\\d{5,6}|6\\d{7})|7(?:1\\d{7}|3\\d{8}|5[03-9]\\d{2,7})", "\\d{5,10}", , , "10112345"], , , [, , "NA", "NA"]], "AZ":[, [, , "[1-9]\\d{8}", "\\d{7,9}"], [, , "(?:1[28]\\d|2(?:02|1[24]|2[2-4]|33|[45]2|6[23])|365)\\d{6}", "\\d{7,9}", , , "123123456"], [, , "(?:4[04]|5[015]|60|7[07])\\d{7}", "\\d{9}", , , "401234567"], [, , "88\\d{7}", "\\d{9}", , , "881234567"], [, , "900200\\d{3}", "\\d{9}", , , "900200123"], 
[, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], "AZ", 994, "00", "0", , , "0", , , , [[, "(\\d{2})(\\d{3})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["(?:1[28]|2(?:[45]2|[0-36])|365)"], "(0$1)", "", 0], [, "(\\d{2})(\\d{3})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["[4-8]"], "0$1", "", 0], [, "(\\d{3})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["9"], "0$1", "", 0]], , [, , "NA", "NA"], , , [, , "NA", "NA"], [, , "NA", "NA"], , , [, , "NA", "NA"]], "BA":[, [, , "[3-9]\\d{7,8}", "\\d{6,9}"], [, , "(?:[35]\\d|49)\\d{6}", 
"\\d{6,8}", , , "30123456"], [, , "6(?:03|44|71|[1-356])\\d{6}", "\\d{8,9}", , , "61123456"], [, , "8[08]\\d{6}", "\\d{8}", , , "80123456"], [, , "9[0246]\\d{6}", "\\d{8}", , , "90123456"], [, , "8[12]\\d{6}", "\\d{8}", , , "82123456"], [, , "NA", "NA"], [, , "NA", "NA"], "BA", 387, "00", "0", , , "0", , , , [[, "(\\d{2})(\\d{3})(\\d{3})", "$1 $2-$3", ["[3-5]"], "0$1", "", 0], [, "(\\d{2})(\\d{3})(\\d{3})", "$1 $2 $3", ["6[1-356]|[7-9]"], "0$1", "", 0], [, "(\\d{2})(\\d{2})(\\d{2})(\\d{3})", "$1 $2 $3 $4", 
["6[047]"], "0$1", "", 0]], , [, , "NA", "NA"], , , [, , "NA", "NA"], [, , "70[23]\\d{5}", "\\d{8}", , , "70223456"], , , [, , "NA", "NA"]], "BB":[, [, , "[2589]\\d{9}", "\\d{7}(?:\\d{3})?"], [, , "246[2-9]\\d{6}", "\\d{7}(?:\\d{3})?", , , "2462345678"], [, , "246(?:(?:2[346]|45|82)\\d|25[0-4])\\d{4}", "\\d{10}", , , "2462501234"], [, , "8(?:00|44|55|66|77|88)[2-9]\\d{6}", "\\d{10}", , , "8002123456"], [, , "900[2-9]\\d{6}", "\\d{10}", , , "9002123456"], [, , "NA", "NA"], [, , "5(?:00|33|44|66|77)[2-9]\\d{6}", 
"\\d{10}", , , "5002345678"], [, , "NA", "NA"], "BB", 1, "011", "1", , , "1", , , , , , [, , "NA", "NA"], , "246", [, , "NA", "NA"], [, , "NA", "NA"], , , [, , "NA", "NA"]], "BD":[, [, , "[2-79]\\d{5,9}|1\\d{9}|8[0-7]\\d{4,8}", "\\d{6,10}"], [, , "2(?:7(?:1[0-267]|2[0-289]|3[0-29]|[46][01]|5[1-3]|7[017]|91)|8(?:0[125]|[139][1-6]|2[0157-9]|6[1-35]|7[1-5]|8[1-8])|9(?:0[0-2]|1[1-4]|2[568]|3[3-6]|5[5-7]|6[0167]|7[15]|8[016-8]))\\d{4}|3(?:12?[5-7]\\d{2}|0(?:2(?:[025-79]\\d|[348]\\d{1,2})|3(?:[2-4]\\d|[56]\\d?))|2(?:1\\d{2}|2(?:[12]\\d|[35]\\d{1,2}|4\\d?))|3(?:1\\d{2}|2(?:[2356]\\d|4\\d{1,2}))|4(?:1\\d{2}|2(?:2\\d{1,2}|[47]|5\\d{2}))|5(?:1\\d{2}|29)|[67]1\\d{2}|8(?:1\\d{2}|2(?:2\\d{2}|3|4\\d)))\\d{3}|4(?:0(?:2(?:[09]\\d|7)|33\\d{2})|1\\d{3}|2(?:1\\d{2}|2(?:[25]\\d?|[348]\\d|[67]\\d{1,2}))|3(?:1\\d{2}(?:\\d{2})?|2(?:[045]\\d|[236-9]\\d{1,2})|32\\d{2})|4(?:[18]\\d{2}|2(?:[2-46]\\d{2}|3)|5[25]\\d{2})|5(?:1\\d{2}|2(?:3\\d|5))|6(?:[18]\\d{2}|2(?:3(?:\\d{2})?|[46]\\d{1,2}|5\\d{2}|7\\d)|5(?:3\\d?|4\\d|[57]\\d{1,2}|6\\d{2}|8))|71\\d{2}|8(?:[18]\\d{2}|23\\d{2}|54\\d{2})|9(?:[18]\\d{2}|2[2-5]\\d{2}|53\\d{1,2}))\\d{3}|5(?:02[03489]\\d{2}|1\\d{2}|2(?:1\\d{2}|2(?:2(?:\\d{2})?|[457]\\d{2}))|3(?:1\\d{2}|2(?:[37](?:\\d{2})?|[569]\\d{2}))|4(?:1\\d{2}|2[46]\\d{2})|5(?:1\\d{2}|26\\d{1,2})|6(?:[18]\\d{2}|2|53\\d{2})|7(?:1|24)\\d{2}|8(?:1|26)\\d{2}|91\\d{2})\\d{3}|6(?:0(?:1\\d{2}|2(?:3\\d{2}|4\\d{1,2}))|2(?:2[2-5]\\d{2}|5(?:[3-5]\\d{2}|7)|8\\d{2})|3(?:1|2[3478])\\d{2}|4(?:1|2[34])\\d{2}|5(?:1|2[47])\\d{2}|6(?:[18]\\d{2}|6(?:2(?:2\\d|[34]\\d{2})|5(?:[24]\\d{2}|3\\d|5\\d{1,2})))|72[2-5]\\d{2}|8(?:1\\d{2}|2[2-5]\\d{2})|9(?:1\\d{2}|2[2-6]\\d{2}))\\d{3}|7(?:(?:02|[3-589]1|6[12]|72[24])\\d{2}|21\\d{3}|32)\\d{3}|8(?:(?:4[12]|[5-7]2|1\\d?)|(?:0|3[12]|[5-7]1|217)\\d)\\d{4}|9(?:[35]1|(?:[024]2|81)\\d|(?:1|[24]1)\\d{2})\\d{3}", 
"\\d{6,9}", , , "27111234"], [, , "(?:1[13-9]\\d|(?:3[78]|44)[02-9]|6(?:44|6[02-9]))\\d{7}", "\\d{10}", , , "1812345678"], [, , "80[03]\\d{7}", "\\d{10}", , , "8001234567"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "96(?:0[49]|1[0-4]|6[69])\\d{6}", "\\d{10}", , , "9604123456"], "BD", 880, "00[12]?", "0", , , "0", , "00", , [[, "(2)(\\d{7})", "$1-$2", ["2"], "0$1", "", 0], [, "(\\d{2})(\\d{4,6})", "$1-$2", ["[3-79]1"], "0$1", "", 0], [, "(\\d{4})(\\d{3,6})", "$1-$2", ["1|3(?:0|[2-58]2)|4(?:0|[25]2|3[23]|[4689][25])|5(?:[02-578]2|6[25])|6(?:[0347-9]2|[26][25])|7[02-9]2|8(?:[023][23]|[4-7]2)|9(?:[02][23]|[458]2|6[016])"], 
"0$1", "", 0], [, "(\\d{3})(\\d{3,7})", "$1-$2", ["[3-79][2-9]|8"], "0$1", "", 0]], , [, , "NA", "NA"], , , [, , "NA", "NA"], [, , "NA", "NA"], , , [, , "NA", "NA"]], "BE":[, [, , "[1-9]\\d{7,8}", "\\d{8,9}"], [, , "(?:1[0-69]|[49][23]|5\\d|6[013-57-9]|71|8[0-79])[1-9]\\d{5}|[23][2-8]\\d{6}", "\\d{8}", , , "12345678"], [, , "4(?:[679]\\d|8[03-9])\\d{6}", "\\d{9}", , , "470123456"], [, , "800\\d{5}", "\\d{8}", , , "80012345"], [, , "(?:70[2-7]|90\\d)\\d{5}", "\\d{8}", , , "90123456"], [, , "NA", "NA"], 
[, , "NA", "NA"], [, , "NA", "NA"], "BE", 32, "00", "0", , , "0", , , , [[, "(4[6-9]\\d)(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["4[6-9]"], "0$1", "", 0], [, "([2-49])(\\d{3})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["[23]|[49][23]"], "0$1", "", 0], [, "([15-8]\\d)(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["[156]|7[018]|8(?:0[1-9]|[1-79])"], "0$1", "", 0], [, "([89]\\d{2})(\\d{2})(\\d{3})", "$1 $2 $3", ["(?:80|9)0"], "0$1", "", 0]], , [, , "NA", "NA"], , , [, , "NA", "NA"], [, , "78\\d{6}", "\\d{8}", 
, , "78123456"], , , [, , "NA", "NA"]], "BF":[, [, , "[24-7]\\d{7}", "\\d{8}"], [, , "(?:20(?:49|5[23]|9[016-9])|40(?:4[569]|5[4-6]|7[0179])|50(?:[34]\\d|50))\\d{4}", "\\d{8}", , , "20491234"], [, , "6(?:[0-689]\\d|7[0-5])\\d{5}|7\\d{7}", "\\d{8}", , , "70123456"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], "BF", 226, "00", , , , , , , , [[, "(\\d{2})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", , "", "", 0]], , [, , "NA", "NA"], , , [, , "NA", "NA"], [, 
, "NA", "NA"], , , [, , "NA", "NA"]], "BG":[, [, , "[23567]\\d{5,7}|[489]\\d{6,8}", "\\d{5,9}"], [, , "2(?:[0-8]\\d{5,6}|9\\d{4,6})|(?:[36]\\d|5[1-9]|8[1-6]|9[1-7])\\d{5,6}|(?:4(?:[124-7]\\d|3[1-6])|7(?:0[1-9]|[1-9]\\d))\\d{4,5}", "\\d{5,8}", , , "2123456"], [, , "(?:8[7-9]|98)\\d{7}|4(?:3[0789]|8\\d)\\d{5}", "\\d{8,9}", , , "48123456"], [, , "800\\d{5}", "\\d{8}", , , "80012345"], [, , "90\\d{6}", "\\d{8}", , , "90123456"], [, , "NA", "NA"], [, , "700\\d{5}", "\\d{5,9}", , , "70012345"], [, , "NA", 
"NA"], "BG", 359, "00", "0", , , "0", , , , [[, "(2)(\\d{5})", "$1 $2", ["29"], "0$1", "", 0], [, "(2)(\\d{3})(\\d{3,4})", "$1 $2 $3", ["2"], "0$1", "", 0], [, "(\\d{3})(\\d{4})", "$1 $2", ["43[124-7]|70[1-9]"], "0$1", "", 0], [, "(\\d{3})(\\d{3})(\\d{2})", "$1 $2 $3", ["43[124-7]|70[1-9]"], "0$1", "", 0], [, "(\\d{3})(\\d{2})(\\d{3})", "$1 $2 $3", ["[78]00"], "0$1", "", 0], [, "(\\d{2})(\\d{3})(\\d{2,3})", "$1 $2 $3", ["[356]|4[124-7]|7[1-9]|8[1-6]|9[1-7]"], "0$1", "", 0], [, "(\\d{2})(\\d{3})(\\d{3,4})", 
"$1 $2 $3", ["48|8[7-9]|9[08]"], "0$1", "", 0]], , [, , "NA", "NA"], , , [, , "NA", "NA"], [, , "NA", "NA"], , , [, , "NA", "NA"]], "BH":[, [, , "[136-9]\\d{7}", "\\d{8}"], [, , "(?:1(?:3[13-6]|6[0156]|7\\d)\\d|6(?:1[16]\\d|500|6(?:0\\d|3[12]|44|88)|9[69][69])|7(?:7\\d{2}|178))\\d{4}", "\\d{8}", , , "17001234"], [, , "(?:3(?:[1-4679]\\d|5[0135]|8[0-48])\\d|6(?:3(?:00|33|6[16])|6(?:[69]\\d|3[03-9])))\\d{4}", "\\d{8}", , , "36001234"], [, , "80\\d{6}", "\\d{8}", , , "80123456"], [, , "(?:87|9[014578])\\d{6}", 
"\\d{8}", , , "90123456"], [, , "84\\d{6}", "\\d{8}", , , "84123456"], [, , "NA", "NA"], [, , "NA", "NA"], "BH", 973, "00", , , , , , , , [[, "(\\d{4})(\\d{4})", "$1 $2", , "", "", 0]], , [, , "NA", "NA"], , , [, , "NA", "NA"], [, , "NA", "NA"], , , [, , "NA", "NA"]], "BI":[, [, , "[267]\\d{7}", "\\d{8}"], [, , "22(?:2[0-7]|[3-5]0)\\d{4}", "\\d{8}", , , "22201234"], [, , "(?:[26]9|7[14-9])\\d{6}", "\\d{8}", , , "79561234"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], [, 
, "NA", "NA"], "BI", 257, "00", , , , , , , , [[, "(\\d{2})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", , "", "", 0]], , [, , "NA", "NA"], , , [, , "NA", "NA"], [, , "NA", "NA"], , , [, , "NA", "NA"]], "BJ":[, [, , "[2689]\\d{7}|7\\d{3}", "\\d{4,8}"], [, , "2(?:02|1[037]|2[45]|3[68])\\d{5}", "\\d{8}", , , "20211234"], [, , "(?:6[146-8]|9[03-9])\\d{6}", "\\d{8}", , , "90011234"], [, , "7[3-5]\\d{2}", "\\d{4}", , , "7312"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "857[58]\\d{4}", "\\d{8}", 
, , "85751234"], "BJ", 229, "00", , , , , , , , [[, "(\\d{2})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", , "", "", 0]], , [, , "NA", "NA"], , , [, , "NA", "NA"], [, , "81\\d{6}", "\\d{8}", , , "81123456"], , , [, , "NA", "NA"]], "BL":[, [, , "[56]\\d{8}", "\\d{9}"], [, , "590(?:2[7-9]|5[12]|87)\\d{4}", "\\d{9}", , , "590271234"], [, , "690(?:0[0-7]|[1-9]\\d)\\d{4}", "\\d{9}", , , "690301234"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], "BL", 590, "00", 
"0", , , "0", , , , , , [, , "NA", "NA"], , , [, , "NA", "NA"], [, , "NA", "NA"], , , [, , "NA", "NA"]], "BM":[, [, , "[4589]\\d{9}", "\\d{7}(?:\\d{3})?"], [, , "441(?:2(?:02|23|61|[3479]\\d)|[46]\\d{2}|5(?:4\\d|60|89)|824)\\d{4}", "\\d{7}(?:\\d{3})?", , , "4412345678"], [, , "441(?:[37]\\d|5[0-39])\\d{5}", "\\d{10}", , , "4413701234"], [, , "8(?:00|44|55|66|77|88)[2-9]\\d{6}", "\\d{10}", , , "8002123456"], [, , "900[2-9]\\d{6}", "\\d{10}", , , "9002123456"], [, , "NA", "NA"], [, , "5(?:00|33|44|66|77)[2-9]\\d{6}", 
"\\d{10}", , , "5002345678"], [, , "NA", "NA"], "BM", 1, "011", "1", , , "1", , , , , , [, , "NA", "NA"], , "441", [, , "NA", "NA"], [, , "NA", "NA"], , , [, , "NA", "NA"]], "BN":[, [, , "[2-578]\\d{6}", "\\d{7}"], [, , "2(?:[013-9]\\d|2[0-7])\\d{4}|[3-5]\\d{6}", "\\d{7}", , , "2345678"], [, , "22[89]\\d{4}|[78]\\d{6}", "\\d{7}", , , "7123456"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], "BN", 673, "00", , , , , , , , [[, "([2-578]\\d{2})(\\d{4})", "$1 $2", 
, "", "", 0]], , [, , "NA", "NA"], , , [, , "NA", "NA"], [, , "NA", "NA"], , , [, , "NA", "NA"]], "BO":[, [, , "[23467]\\d{7}", "\\d{7,8}"], [, , "(?:2(?:2\\d{2}|5(?:11|[258]\\d|9[67])|6(?:12|2\\d|9[34])|8(?:2[34]|39|62))|3(?:3\\d{2}|4(?:6\\d|8[24])|8(?:25|42|5[257]|86|9[25])|9(?:2\\d|3[234]|4[248]|5[24]|6[2-6]|7\\d))|4(?:4\\d{2}|6(?:11|[24689]\\d|72)))\\d{4}", "\\d{7,8}", , , "22123456"], [, , "[67]\\d{7}", "\\d{8}", , , "71234567"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", 
"NA"], [, , "NA", "NA"], "BO", 591, "00(1\\d)?", "0", , , "0(1\\d)?", , , , [[, "([234])(\\d{7})", "$1 $2", ["[234]"], "", "0$CC $1", 0], [, "([67]\\d{7})", "$1", ["[67]"], "", "0$CC $1", 0]], , [, , "NA", "NA"], , , [, , "NA", "NA"], [, , "NA", "NA"], , , [, , "NA", "NA"]], "BQ":[, [, , "[347]\\d{6}", "\\d{7}"], [, , "(?:318[023]|416[023]|7(?:1[578]|50)\\d)\\d{3}", "\\d{7}", , , "7151234"], [, , "(?:318[14-68]|416[15-9]|7(?:0[01]|7[07]|[89]\\d)\\d)\\d{3}", "\\d{7}", , , "3181234"], [, , "NA", "NA"], 
[, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], "BQ", 599, "00", , , , , , , , , , [, , "NA", "NA"], , , [, , "NA", "NA"], [, , "NA", "NA"], , , [, , "NA", "NA"]], "BR":[, [, , "[1-46-9]\\d{7,10}|5\\d{8,9}", "\\d{8,11}"], [, , "1[1-9][2-5]\\d{7}|(?:[4689][1-9]|2[12478]|3[1-578]|5[13-5]|7[13-579])[2-5]\\d{7}", "\\d{8,11}", , , "1123456789"], [, , "1[1-9](?:7|9\\d)\\d{7}|(?:2[12478]|9[1-9])9?[6-9]\\d{7}|(?:3[1-578]|[468][1-9]|5[13-5]|7[13-579])[6-9]\\d{7}", "\\d{10,11}", , , 
"11961234567"], [, , "800\\d{6,7}", "\\d{8,11}", , , "800123456"], [, , "[359]00\\d{6,7}", "\\d{8,11}", , , "300123456"], [, , "[34]00\\d{5}", "\\d{8}", , , "40041234"], [, , "NA", "NA"], [, , "NA", "NA"], "BR", 55, "00(?:1[45]|2[135]|31|4[13])", "0", , , "0(?:(1[245]|2[135]|31|4[13])(\\d{10,11}))?", "$2", , , [[, "(\\d{4})(\\d{4})", "$1-$2", ["[2-9](?:[1-9]|0[1-9])"], "$1", "", 0], [, "(\\d{5})(\\d{4})", "$1-$2", ["9(?:[1-9]|0[1-9])"], "$1", "", 0], [, "(\\d{3,5})", "$1", ["1[125689]"], "$1", "", 
0], [, "(\\d{2})(\\d{5})(\\d{4})", "$1 $2-$3", ["(?:1[1-9]|2[12478]|9[1-9])9"], "($1)", "0 $CC ($1)", 0], [, "(\\d{2})(\\d{4})(\\d{4})", "$1 $2-$3", ["[1-9][1-9]"], "($1)", "0 $CC ($1)", 0], [, "([34]00\\d)(\\d{4})", "$1-$2", ["[34]00"], "", "", 0], [, "([3589]00)(\\d{2,3})(\\d{4})", "$1 $2 $3", ["[3589]00"], "0$1", "", 0]], [[, "(\\d{2})(\\d{5})(\\d{4})", "$1 $2-$3", ["(?:1[1-9]|2[12478]|9[1-9])9"], "($1)", "0 $CC ($1)", 0], [, "(\\d{2})(\\d{4})(\\d{4})", "$1 $2-$3", ["[1-9][1-9]"], "($1)", "0 $CC ($1)", 
0], [, "([34]00\\d)(\\d{4})", "$1-$2", ["[34]00"], "", "", 0], [, "([3589]00)(\\d{2,3})(\\d{4})", "$1 $2 $3", ["[3589]00"], "0$1", "", 0]], [, , "NA", "NA"], , , [, , "[34]00\\d{5}", "\\d{8}", , , "40041234"], [, , "NA", "NA"], , , [, , "NA", "NA"]], "BS":[, [, , "[2589]\\d{9}", "\\d{7}(?:\\d{3})?"], [, , "242(?:3(?:02|[236][1-9]|4[0-24-9]|5[0-68]|7[3467]|8[0-4]|9[2-467])|461|502|6(?:0[12]|12|7[67]|8[78]|9[89])|702)\\d{4}", "\\d{7}(?:\\d{3})?", , , "2423456789"], [, , "242(?:3(?:5[79]|[79]5)|4(?:[2-4][1-9]|5[1-8]|6[2-8]|7\\d|81)|5(?:2[45]|3[35]|44|5[1-9]|65|77)|6[34]6|727)\\d{4}", 
"\\d{10}", , , "2423591234"], [, , "242300\\d{4}|8(?:00|44|55|66|77|88)[2-9]\\d{6}", "\\d{10}", , , "8002123456"], [, , "900[2-9]\\d{6}", "\\d{10}", , , "9002123456"], [, , "NA", "NA"], [, , "5(?:00|33|44|66|77)[2-9]\\d{6}", "\\d{10}", , , "5002345678"], [, , "NA", "NA"], "BS", 1, "011", "1", , , "1", , , , , , [, , "NA", "NA"], , "242", [, , "NA", "NA"], [, , "NA", "NA"], , , [, , "NA", "NA"]], "BT":[, [, , "[1-8]\\d{6,7}", "\\d{6,8}"], [, , "(?:2[3-6]|[34][5-7]|5[236]|6[2-46]|7[246]|8[2-4])\\d{5}", 
"\\d{6,7}", , , "2345678"], [, , "[17]7\\d{6}", "\\d{8}", , , "17123456"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], "BT", 975, "00", , , , , , , , [[, "([17]7)(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["1|77"], "", "", 0], [, "([2-8])(\\d{3})(\\d{3})", "$1 $2 $3", ["[2-68]|7[246]"], "", "", 0]], , [, , "NA", "NA"], , , [, , "NA", "NA"], [, , "NA", "NA"], , , [, , "NA", "NA"]], "BW":[, [, , "[2-79]\\d{6,7}", "\\d{7,8}"], [, , "(?:2(?:4[0-48]|6[0-24]|9[0578])|3(?:1[0235-9]|55|6\\d|7[01]|9[0-57])|4(?:6[03]|7[1267]|9[0-5])|5(?:3[0389]|4[0489]|7[1-47]|88|9[0-49])|6(?:2[1-35]|5[149]|8[067]))\\d{4}", 
"\\d{7}", , , "2401234"], [, , "7(?:[1-356]\\d|4[0-7]|7[014-7])\\d{5}", "\\d{8}", , , "71123456"], [, , "NA", "NA"], [, , "90\\d{5}", "\\d{7}", , , "9012345"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "79[12][01]\\d{4}", "\\d{8}", , , "79101234"], "BW", 267, "00", , , , , , , , [[, "(\\d{3})(\\d{4})", "$1 $2", ["[2-6]"], "", "", 0], [, "(7\\d)(\\d{3})(\\d{3})", "$1 $2 $3", ["7"], "", "", 0], [, "(90)(\\d{5})", "$1 $2", ["9"], "", "", 0]], , [, , "NA", "NA"], , , [, , "NA", "NA"], [, , "NA", "NA"], 
, , [, , "NA", "NA"]], "BY":[, [, , "[1-4]\\d{8}|[89]\\d{9,10}", "\\d{7,11}"], [, , "(?:1(?:5(?:1[1-5]|[24]\\d|6[2-4]|9[1-7])|6(?:[235]\\d|4[1-7])|7\\d{2})|2(?:1(?:[246]\\d|3[0-35-9]|5[1-9])|2(?:[235]\\d|4[0-8])|3(?:[26]\\d|3[02-79]|4[024-7]|5[03-7])))\\d{5}", "\\d{7,9}", , , "152450911"], [, , "(?:2(?:5[5679]|9[1-9])|33\\d|44\\d)\\d{6}", "\\d{9}", , , "294911911"], [, , "8(?:0[13]|20\\d)\\d{7}", "\\d{10,11}", , , "8011234567"], [, , "(?:810|902)\\d{7}", "\\d{10}", , , "9021234567"], [, , "NA", "NA"], 
[, , "NA", "NA"], [, , "NA", "NA"], "BY", 375, "810", "8", , , "8?0?", , "8~10", , [[, "(\\d{2})(\\d{3})(\\d{2})(\\d{2})", "$1 $2-$3-$4", ["17[0-3589]|2[4-9]|[34]", "17(?:[02358]|1[0-2]|9[0189])|2[4-9]|[34]"], "8 0$1", "", 0], [, "(\\d{3})(\\d{2})(\\d{2})(\\d{2})", "$1 $2-$3-$4", ["1(?:5[24]|6[235]|7[467])|2(?:1[246]|2[25]|3[26])", "1(?:5[24]|6(?:2|3[04-9]|5[0346-9])|7(?:[46]|7[37-9]))|2(?:1[246]|2[25]|3[26])"], "8 0$1", "", 0], [, "(\\d{4})(\\d{2})(\\d{3})", "$1 $2-$3", ["1(?:5[169]|6[3-5]|7[179])|2(?:1[35]|2[34]|3[3-5])", 
"1(?:5[169]|6(?:3[1-3]|4|5[125])|7(?:1[3-9]|7[0-24-6]|9[2-7]))|2(?:1[35]|2[34]|3[3-5])"], "8 0$1", "", 0], [, "([89]\\d{2})(\\d{3})(\\d{4})", "$1 $2 $3", ["8[01]|9"], "8 $1", "", 0], [, "(8\\d{2})(\\d{4})(\\d{4})", "$1 $2 $3", ["82"], "8 $1", "", 0]], , [, , "NA", "NA"], , , [, , "8(?:[013]|[12]0)\\d{8}|902\\d{7}", "\\d{10,11}", , , "82012345678"], [, , "NA", "NA"], , , [, , "NA", "NA"]], "BZ":[, [, , "[2-8]\\d{6}|0\\d{10}", "\\d{7}(?:\\d{4})?"], [, , "[234578][02]\\d{5}", "\\d{7}", , , "2221234"], 
[, , "6[0-367]\\d{5}", "\\d{7}", , , "6221234"], [, , "0800\\d{7}", "\\d{11}", , , "08001234123"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], "BZ", 501, "00", , , , , , , , [[, "(\\d{3})(\\d{4})", "$1-$2", ["[2-8]"], "", "", 0], [, "(0)(800)(\\d{4})(\\d{3})", "$1-$2-$3-$4", ["0"], "", "", 0]], , [, , "NA", "NA"], , , [, , "NA", "NA"], [, , "NA", "NA"], 1, , [, , "NA", "NA"]], "CA":[, [, , "[2-9]\\d{9}|3\\d{6}", "\\d{7}(?:\\d{3})?"], [, , "(?:2(?:04|[23]6|[48]9|50)|3(?:06|43|65)|4(?:03|1[68]|3[178]|50)|5(?:06|1[49]|79|8[17])|6(?:0[04]|13|39|47)|7(?:0[59]|78|8[02])|8(?:[06]7|19|73)|90[25])[2-9]\\d{6}|310\\d{4}", 
"\\d{7}(?:\\d{3})?", , , "2042345678"], [, , "(?:2(?:04|[23]6|[48]9|50)|3(?:06|43|65)|4(?:03|1[68]|3[178]|50)|5(?:06|1[49]|79|8[17])|6(?:0[04]|13|39|47)|7(?:0[59]|78|8[02])|8(?:[06]7|19|73)|90[25])[2-9]\\d{6}", "\\d{7}(?:\\d{3})?", , , "2042345678"], [, , "8(?:00|44|55|66|77|88)[2-9]\\d{6}|310\\d{4}", "\\d{7}(?:\\d{3})?", , , "8002123456"], [, , "900[2-9]\\d{6}", "\\d{10}", , , "9002123456"], [, , "NA", "NA"], [, , "5(?:00|33|44|66|77)[2-9]\\d{6}", "\\d{10}", , , "5002345678"], [, , "NA", "NA"], 
"CA", 1, "011", "1", , , "1", , , , , , [, , "NA", "NA"], , , [, , "NA", "NA"], [, , "NA", "NA"], , , [, , "NA", "NA"]], "CC":[, [, , "[1458]\\d{5,9}", "\\d{6,10}"], [, , "89162\\d{4}", "\\d{8,9}", , , "891621234"], [, , "14(?:5\\d|71)\\d{5}|4(?:[0-2]\\d|3[0-57-9]|4[47-9]|5[0-25-9]|6[6-9]|7[03-9]|8[17-9]|9[017-9])\\d{6}", "\\d{9}", , , "412345678"], [, , "1(?:80(?:0\\d{2})?|3(?:00\\d{2})?)\\d{4}", "\\d{6,10}", , , "1800123456"], [, , "190[0126]\\d{6}", "\\d{10}", , , "1900123456"], [, , "NA", "NA"], 
[, , "500\\d{6}", "\\d{9}", , , "500123456"], [, , "550\\d{6}", "\\d{9}", , , "550123456"], "CC", 61, "(?:14(?:1[14]|34|4[17]|[56]6|7[47]|88))?001[14-689]", "0", , , "0", , "0011", , , , [, , "NA", "NA"], , , [, , "NA", "NA"], [, , "NA", "NA"], , , [, , "NA", "NA"]], "CD":[, [, , "[2-6]\\d{6}|[18]\\d{6,8}|9\\d{8}", "\\d{7,9}"], [, , "1(?:2\\d{7}|\\d{6})|[2-6]\\d{6}", "\\d{7,9}", , , "1234567"], [, , "8(?:[0-2459]\\d{2}|8)\\d{5}|9[7-9]\\d{7}", "\\d{7,9}", , , "991234567"], [, , "NA", "NA"], [, , "NA", 
"NA"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], "CD", 243, "00", "0", , , "0", , , , [[, "(\\d{2})(\\d{3})(\\d{4})", "$1 $2 $3", ["12"], "0$1", "", 0], [, "([89]\\d{2})(\\d{3})(\\d{3})", "$1 $2 $3", ["8[0-2459]|9"], "0$1", "", 0], [, "(\\d{2})(\\d{2})(\\d{3})", "$1 $2 $3", ["88"], "0$1", "", 0], [, "(\\d{2})(\\d{5})", "$1 $2", ["[1-6]"], "0$1", "", 0]], , [, , "NA", "NA"], , , [, , "NA", "NA"], [, , "NA", "NA"], , , [, , "NA", "NA"]], "CF":[, [, , "[278]\\d{7}", "\\d{8}"], [, , "2[12]\\d{6}", 
"\\d{8}", , , "21612345"], [, , "7[0257]\\d{6}", "\\d{8}", , , "70012345"], [, , "NA", "NA"], [, , "8776\\d{4}", "\\d{8}", , , "87761234"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], "CF", 236, "00", , , , , , , , [[, "(\\d{2})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", , "", "", 0]], , [, , "NA", "NA"], , , [, , "NA", "NA"], [, , "NA", "NA"], , , [, , "NA", "NA"]], "CG":[, [, , "[028]\\d{8}", "\\d{9}"], [, , "222[1-589]\\d{5}", "\\d{9}", , , "222123456"], [, , "0[14-6]\\d{7}", "\\d{9}", 
, , "061234567"], [, , "800\\d{6}", "\\d{9}", , , "800123456"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], "CG", 242, "00", , , , , , , , [[, "(\\d{2})(\\d{3})(\\d{4})", "$1 $2 $3", ["[02]"], "", "", 0], [, "(\\d)(\\d{4})(\\d{4})", "$1 $2 $3", ["8"], "", "", 0]], , [, , "NA", "NA"], , , [, , "NA", "NA"], [, , "NA", "NA"], 1, , [, , "NA", "NA"]], "CH":[, [, , "[2-9]\\d{8}|860\\d{9}", "\\d{9}(?:\\d{3})?"], [, , "(?:2[12467]|3[1-4]|4[134]|5[256]|6[12]|[7-9]1)\\d{7}", "\\d{9}", 
, , "212345678"], [, , "7[5-9]\\d{7}", "\\d{9}", , , "781234567"], [, , "800\\d{6}", "\\d{9}", , , "800123456"], [, , "90[016]\\d{6}", "\\d{9}", , , "900123456"], [, , "84[0248]\\d{6}", "\\d{9}", , , "840123456"], [, , "878\\d{6}", "\\d{9}", , , "878123456"], [, , "NA", "NA"], "CH", 41, "00", "0", , , "0", , , , [[, "([2-9]\\d)(\\d{3})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["[2-7]|[89]1"], "0$1", "", 0], [, "([89]\\d{2})(\\d{3})(\\d{3})", "$1 $2 $3", ["8[047]|90"], "0$1", "", 0], [, "(\\d{3})(\\d{2})(\\d{3})(\\d{2})(\\d{2})", 
"$1 $2 $3 $4 $5", ["860"], "0$1", "", 0]], , [, , "74[0248]\\d{6}", "\\d{9}", , , "740123456"], , , [, , "NA", "NA"], [, , "5[18]\\d{7}", "\\d{9}", , , "581234567"], , , [, , "860\\d{9}", "\\d{12}", , , "860123456789"]], "CI":[, [, , "[02-7]\\d{7}", "\\d{8}"], [, , "(?:2(?:0[023]|1[02357]|[23][045]|4[03-5])|3(?:0[06]|1[069]|[2-4][07]|5[09]|6[08]))\\d{5}", "\\d{8}", , , "21234567"], [, , "(?:0[1-9]|4[0-24-9]|5[4-9]|6[015-79]|7[57])\\d{6}", "\\d{8}", , , "01234567"], [, , "NA", "NA"], [, , "NA", "NA"], 
[, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], "CI", 225, "00", , , , , , , , [[, "(\\d{2})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", , "", "", 0]], , [, , "NA", "NA"], , , [, , "NA", "NA"], [, , "NA", "NA"], 1, , [, , "NA", "NA"]], "CK":[, [, , "[2-57]\\d{4}", "\\d{5}"], [, , "(?:2\\d|3[13-7]|4[1-5])\\d{3}", "\\d{5}", , , "21234"], [, , "(?:5[0-68]|7\\d)\\d{3}", "\\d{5}", , , "71234"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], "CK", 682, "00", 
, , , , , , , [[, "(\\d{2})(\\d{3})", "$1 $2", , "", "", 0]], , [, , "NA", "NA"], , , [, , "NA", "NA"], [, , "NA", "NA"], , , [, , "NA", "NA"]], "CL":[, [, , "(?:[2-9]|600|123)\\d{7,8}", "\\d{7,11}"], [, , "2(?:2\\d{7}|1962\\d{4})|(?:3[2-5]|[47][1-35]|5[1-3578]|6[13-57])\\d{7}", "\\d{7,9}", , , "221234567"], [, , "9[4-9]\\d{7}", "\\d{8,9}", , , "961234567"], [, , "800\\d{6}|1230\\d{7}", "\\d{9,11}", , , "800123456"], [, , "NA", "NA"], [, , "600\\d{7,8}", "\\d{10,11}", , , "6001234567"], [, , "NA", 
"NA"], [, , "44\\d{7}", "\\d{9}", , , "441234567"], "CL", 56, "(?:0|1(?:1[0-69]|2[0-57]|5[13-58]|69|7[0167]|8[018]))0", "0", , , "0|(1(?:1[0-69]|2[0-57]|5[13-58]|69|7[0167]|8[018]))", , , , [[, "(\\d)(\\d{4})(\\d{4})", "$1 $2 $3", ["22"], "($1)", "$CC ($1)", 0], [, "(\\d{2})(\\d{3})(\\d{4})", "$1 $2 $3", ["[357]|4[1-35]|6[13-57]"], "($1)", "$CC ($1)", 0], [, "(9)(\\d{4})(\\d{4})", "$1 $2 $3", ["9"], "0$1", "", 0], [, "(44)(\\d{3})(\\d{4})", "$1 $2 $3", ["44"], "0$1", "", 0], [, "([68]00)(\\d{3})(\\d{3,4})", 
"$1 $2 $3", ["60|8"], "$1", "", 0], [, "(600)(\\d{3})(\\d{2})(\\d{3})", "$1 $2 $3 $4", ["60"], "$1", "", 0], [, "(1230)(\\d{3})(\\d{4})", "$1 $2 $3", ["1"], "$1", "", 0], [, "(\\d{5})(\\d{4})", "$1 $2", ["219"], "($1)", "$CC ($1)", 0], [, "(\\d{4,5})", "$1", ["[1-9]"], "$1", "", 0]], [[, "(\\d)(\\d{4})(\\d{4})", "$1 $2 $3", ["22"], "($1)", "$CC ($1)", 0], [, "(\\d{2})(\\d{3})(\\d{4})", "$1 $2 $3", ["[357]|4[1-35]|6[13-57]"], "($1)", "$CC ($1)", 0], [, "(9)(\\d{4})(\\d{4})", "$1 $2 $3", ["9"], "0$1", 
"", 0], [, "(44)(\\d{3})(\\d{4})", "$1 $2 $3", ["44"], "0$1", "", 0], [, "([68]00)(\\d{3})(\\d{3,4})", "$1 $2 $3", ["60|8"], "$1", "", 0], [, "(600)(\\d{3})(\\d{2})(\\d{3})", "$1 $2 $3 $4", ["60"], "$1", "", 0], [, "(1230)(\\d{3})(\\d{4})", "$1 $2 $3", ["1"], "$1", "", 0], [, "(\\d{5})(\\d{4})", "$1 $2", ["219"], "($1)", "$CC ($1)", 0]], [, , "NA", "NA"], , , [, , "600\\d{7,8}", "\\d{10,11}", , , "6001234567"], [, , "NA", "NA"], , , [, , "NA", "NA"]], "CM":[, [, , "[235-9]\\d{7,8}", "\\d{8,9}"], 
[, , "2(?:22|33|4[23])\\d{6}|(?:22|33)\\d{6}", "\\d{8,9}", , , "222123456"], [, , "6[5-79]\\d{7}|[579]\\d{7}", "\\d{8,9}", , , "671234567"], [, , "800\\d{5}", "\\d{8}", , , "80012345"], [, , "88\\d{6}", "\\d{8}", , , "88012345"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], "CM", 237, "00", , , , , , , , [[, "([26])(\\d{2})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4 $5", ["[26]"], "", "", 0], [, "([2357-9]\\d)(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["[23579]|88"], "", "", 0], [, "(800)(\\d{2})(\\d{3})", 
"$1 $2 $3", ["80"], "", "", 0]], , [, , "NA", "NA"], , , [, , "NA", "NA"], [, , "NA", "NA"], , , [, , "NA", "NA"]], "CN":[, [, , "[1-7]\\d{6,11}|8[0-357-9]\\d{6,9}|9\\d{7,9}", "\\d{4,12}"], [, , "21(?:100\\d{2}|95\\d{3,4}|\\d{8,10})|(?:10|2[02-57-9]|3(?:11|7[179])|4(?:[15]1|3[12])|5(?:1\\d|2[37]|3[12]|51|7[13-79]|9[15])|7(?:31|5[457]|6[09]|91)|8(?:71|98))(?:100\\d{2}|95\\d{3,4}|\\d{8})|(?:3(?:1[02-9]|35|49|5\\d|7[02-68]|9[1-68])|4(?:1[02-9]|2[179]|3[3-9]|5[2-9]|6[4789]|7\\d|8[23])|5(?:3[03-9]|4[36]|5[02-9]|6[1-46]|7[028]|80|9[2-46-9])|6(?:3[1-5]|6[0238]|9[12])|7(?:01|[17]\\d|2[248]|3[04-9]|4[3-6]|5[0-3689]|6[2368]|9[02-9])|8(?:1[236-8]|2[5-7]|3\\d|5[1-9]|7[02-9]|8[3678]|9[1-7])|9(?:0[1-3689]|1[1-79]|[379]\\d|4[13]|5[1-5]))(?:100\\d{2}|95\\d{3,4}|\\d{7})|80(?:29|6[03578]|7[018]|81)\\d{4}", 
"\\d{4,12}", , , "1012345678"], [, , "1(?:[38]\\d|4[57]|5[0-35-9]|7[06-8])\\d{8}", "\\d{11}", , , "13123456789"], [, , "(?:10)?800\\d{7}", "\\d{10,12}", , , "8001234567"], [, , "16[08]\\d{5}", "\\d{8}", , , "16812345"], [, , "400\\d{7}|(?:10|2[0-57-9]|3(?:[157]\\d|35|49|9[1-68])|4(?:[17]\\d|2[179]|[35][1-9]|6[4789]|8[23])|5(?:[1357]\\d|2[37]|4[36]|6[1-46]|80|9[1-9])|6(?:3[1-5]|6[0238]|9[12])|7(?:01|[1579]\\d|2[248]|3[014-9]|4[3-6]|6[023689])|8(?:1[236-8]|2[5-7]|[37]\\d|5[1-9]|8[3678]|9[1-8])|9(?:0[1-3689]|1[1-79]|[379]\\d|4[13]|5[1-5]))96\\d{3,4}", 
"\\d{7,10}", , , "4001234567"], [, , "NA", "NA"], [, , "NA", "NA"], "CN", 86, "(1[1279]\\d{3})?00", "0", , , "(1[1279]\\d{3})|0", , "00", , [[, "(80\\d{2})(\\d{4})", "$1 $2", ["80[2678]"], "0$1", "$CC $1", 1], [, "([48]00)(\\d{3})(\\d{4})", "$1 $2 $3", ["[48]00"], "", "", 0], [, "(\\d{5,6})", "$1", ["100|95"], "", "", 0], [, "(\\d{2})(\\d{5,6})", "$1 $2", ["(?:10|2\\d)[19]", "(?:10|2\\d)(?:10|9[56])", "(?:10|2\\d)(?:100|9[56])"], "0$1", "$CC $1", 0], [, "(\\d{3})(\\d{5,6})", "$1 $2", ["[3-9]", "[3-9]\\d{2}[19]", 
"[3-9]\\d{2}(?:10|9[56])"], "0$1", "$CC $1", 0], [, "(\\d{3,4})(\\d{4})", "$1 $2", ["[2-9]"], "", "", 0], [, "(21)(\\d{4})(\\d{4,6})", "$1 $2 $3", ["21"], "0$1", "$CC $1", 1], [, "([12]\\d)(\\d{4})(\\d{4})", "$1 $2 $3", ["10[1-9]|2[02-9]", "10[1-9]|2[02-9]", "10(?:[1-79]|8(?:[1-9]|0[1-9]))|2[02-9]"], "0$1", "$CC $1", 1], [, "(\\d{3})(\\d{4})(\\d{4})", "$1 $2 $3", ["3(?:11|7[179])|4(?:[15]1|3[12])|5(?:1|2[37]|3[12]|51|7[13-79]|9[15])|7(?:31|5[457]|6[09]|91)|8(?:71|98)"], "0$1", "$CC $1", 1], [, "(\\d{3})(\\d{3})(\\d{4})", 
"$1 $2 $3", ["3(?:1[02-9]|35|49|5|7[02-68]|9[1-68])|4(?:1[02-9]|2[179]|[35][2-9]|6[4789]|7\\d|8[23])|5(?:3[03-9]|4[36]|5[02-9]|6[1-46]|7[028]|80|9[2-46-9])|6(?:3[1-5]|6[0238]|9[12])|7(?:01|[1579]|2[248]|3[04-9]|4[3-6]|6[2368])|8(?:1[236-8]|2[5-7]|3|5[1-9]|7[02-9]|8[3678]|9[1-7])|9(?:0[1-3689]|1[1-79]|[379]|4[13]|5[1-5])"], "0$1", "$CC $1", 1], [, "(\\d{3})(\\d{4})(\\d{4})", "$1 $2 $3", ["1[3-578]"], "", "$CC $1", 0], [, "(10800)(\\d{3})(\\d{4})", "$1 $2 $3", ["108", "1080", "10800"], "", "", 0]], 
[[, "(80\\d{2})(\\d{4})", "$1 $2", ["80[2678]"], "0$1", "$CC $1", 1], [, "([48]00)(\\d{3})(\\d{4})", "$1 $2 $3", ["[48]00"], "", "", 0], [, "(\\d{2})(\\d{5,6})", "$1 $2", ["(?:10|2\\d)[19]", "(?:10|2\\d)(?:10|9[56])", "(?:10|2\\d)(?:100|9[56])"], "0$1", "$CC $1", 0], [, "(\\d{3})(\\d{5,6})", "$1 $2", ["[3-9]", "[3-9]\\d{2}[19]", "[3-9]\\d{2}(?:10|9[56])"], "0$1", "$CC $1", 0], [, "(21)(\\d{4})(\\d{4,6})", "$1 $2 $3", ["21"], "0$1", "$CC $1", 1], [, "([12]\\d)(\\d{4})(\\d{4})", "$1 $2 $3", ["10[1-9]|2[02-9]", 
"10[1-9]|2[02-9]", "10(?:[1-79]|8(?:[1-9]|0[1-9]))|2[02-9]"], "0$1", "$CC $1", 1], [, "(\\d{3})(\\d{4})(\\d{4})", "$1 $2 $3", ["3(?:11|7[179])|4(?:[15]1|3[12])|5(?:1|2[37]|3[12]|51|7[13-79]|9[15])|7(?:31|5[457]|6[09]|91)|8(?:71|98)"], "0$1", "$CC $1", 1], [, "(\\d{3})(\\d{3})(\\d{4})", "$1 $2 $3", ["3(?:1[02-9]|35|49|5|7[02-68]|9[1-68])|4(?:1[02-9]|2[179]|[35][2-9]|6[4789]|7\\d|8[23])|5(?:3[03-9]|4[36]|5[02-9]|6[1-46]|7[028]|80|9[2-46-9])|6(?:3[1-5]|6[0238]|9[12])|7(?:01|[1579]|2[248]|3[04-9]|4[3-6]|6[2368])|8(?:1[236-8]|2[5-7]|3|5[1-9]|7[02-9]|8[3678]|9[1-7])|9(?:0[1-3689]|1[1-79]|[379]|4[13]|5[1-5])"], 
"0$1", "$CC $1", 1], [, "(\\d{3})(\\d{4})(\\d{4})", "$1 $2 $3", ["1[3-578]"], "", "$CC $1", 0], [, "(10800)(\\d{3})(\\d{4})", "$1 $2 $3", ["108", "1080", "10800"], "", "", 0]], [, , "NA", "NA"], , , [, , "(?:4|(?:10)?8)00\\d{7}", "\\d{10,12}", , , "4001234567"], [, , "NA", "NA"], , , [, , "NA", "NA"]], "CO":[, [, , "(?:[13]\\d{0,3}|[24-8])\\d{7}", "\\d{7,11}"], [, , "[124-8][2-9]\\d{6}", "\\d{8}", , , "12345678"], [, , "3(?:0[0-5]|1\\d|2[0-2]|5[01])\\d{7}", "\\d{10}", , , "3211234567"], [, , "1800\\d{7}", 
"\\d{11}", , , "18001234567"], [, , "19(?:0[01]|4[78])\\d{7}", "\\d{11}", , , "19001234567"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], "CO", 57, "00(?:4(?:[14]4|56)|[579])", "0", , , "0([3579]|4(?:44|56))?", , , , [[, "(\\d)(\\d{7})", "$1 $2", ["1(?:8[2-9]|9[0-3]|[2-7])|[24-8]", "1(?:8[2-9]|9(?:09|[1-3])|[2-7])|[24-8]"], "($1)", "0$CC $1", 0], [, "(\\d{3})(\\d{7})", "$1 $2", ["3"], "", "0$CC $1", 0], [, "(1)(\\d{3})(\\d{7})", "$1-$2-$3", ["1(?:80|9[04])", "1(?:800|9(?:0[01]|4[78]))"], 
"0$1", "", 0]], [[, "(\\d)(\\d{7})", "$1 $2", ["1(?:8[2-9]|9[0-3]|[2-7])|[24-8]", "1(?:8[2-9]|9(?:09|[1-3])|[2-7])|[24-8]"], "($1)", "0$CC $1", 0], [, "(\\d{3})(\\d{7})", "$1 $2", ["3"], "", "0$CC $1", 0], [, "(1)(\\d{3})(\\d{7})", "$1 $2 $3", ["1(?:80|9[04])", "1(?:800|9(?:0[01]|4[78]))"]]], [, , "NA", "NA"], , , [, , "NA", "NA"], [, , "NA", "NA"], , , [, , "NA", "NA"]], "CR":[, [, , "[24-9]\\d{7,9}", "\\d{8,10}"], [, , "2[24-7]\\d{6}", "\\d{8}", , , "22123456"], [, , "5(?:0[01]|7[0-3])\\d{5}|6(?:[0-2]\\d|30)\\d{5}|7[0-3]\\d{6}|8[3-9]\\d{6}", 
"\\d{8}", , , "83123456"], [, , "800\\d{7}", "\\d{10}", , , "8001234567"], [, , "90[059]\\d{7}", "\\d{10}", , , "9001234567"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "210[0-6]\\d{4}|4(?:0(?:0[01]\\d{4}|10[0-3]\\d{3}|2(?:00\\d{3}|900\\d{2})|3[01]\\d{4}|40\\d{4}|5\\d{5}|60\\d{4}|70[01]\\d{3}|8[0-2]\\d{4})|1[01]\\d{5}|20[0-3]\\d{4}|400\\d{4}|70[0-2]\\d{4})|5100\\d{4}", "\\d{8}", , , "40001234"], "CR", 506, "00", , , , "(19(?:0[012468]|1[09]|20|66|77|99))", , , , [[, "(\\d{4})(\\d{4})", "$1 $2", ["[24-7]|8[3-9]"], 
"", "$CC $1", 0], [, "(\\d{3})(\\d{3})(\\d{4})", "$1-$2-$3", ["[89]0"], "", "$CC $1", 0]], , [, , "NA", "NA"], , , [, , "NA", "NA"], [, , "NA", "NA"], , , [, , "NA", "NA"]], "CU":[, [, , "[2-57]\\d{5,7}", "\\d{4,8}"], [, , "2[1-4]\\d{5,6}|3(?:1\\d{6}|[23]\\d{4,6})|4(?:[125]\\d{5,6}|[36]\\d{6}|[78]\\d{4,6})|7\\d{6,7}", "\\d{4,8}", , , "71234567"], [, , "5\\d{7}", "\\d{8}", , , "51234567"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], "CU", 53, "119", "0", 
, , "0", , , , [[, "(\\d)(\\d{6,7})", "$1 $2", ["7"], "(0$1)", "", 0], [, "(\\d{2})(\\d{4,6})", "$1 $2", ["[2-4]"], "(0$1)", "", 0], [, "(\\d)(\\d{7})", "$1 $2", ["5"], "0$1", "", 0]], , [, , "NA", "NA"], , , [, , "NA", "NA"], [, , "NA", "NA"], , , [, , "NA", "NA"]], "CV":[, [, , "[259]\\d{6}", "\\d{7}"], [, , "2(?:2[1-7]|3[0-8]|4[12]|5[1256]|6\\d|7[1-3]|8[1-5])\\d{4}", "\\d{7}", , , "2211234"], [, , "(?:9\\d|59)\\d{5}", "\\d{7}", , , "9911234"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], 
[, , "NA", "NA"], [, , "NA", "NA"], "CV", 238, "0", , , , , , , , [[, "(\\d{3})(\\d{2})(\\d{2})", "$1 $2 $3", , "", "", 0]], , [, , "NA", "NA"], , , [, , "NA", "NA"], [, , "NA", "NA"], , , [, , "NA", "NA"]], "CW":[, [, , "[169]\\d{6,7}", "\\d{7,8}"], [, , "9(?:[48]\\d{2}|50\\d|7(?:2[0-24]|[34]\\d|6[35-7]|77|8[7-9]))\\d{4}", "\\d{7,8}", , , "94151234"], [, , "9(?:5(?:[1246]\\d|3[01])|6(?:[16-9]\\d|3[01]))\\d{4}", "\\d{7,8}", , , "95181234"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "(?:10|69)\\d{5}", 
"\\d{7}", , , "1011234"], [, , "NA", "NA"], [, , "NA", "NA"], "CW", 599, "00", , , , , , , , [[, "(\\d{3})(\\d{4})", "$1 $2", ["[13-7]"], "", "", 0], [, "(9)(\\d{3})(\\d{4})", "$1 $2 $3", ["9"], "", "", 0]], , [, , "955\\d{5}", "\\d{7,8}", , , "95581234"], 1, , [, , "NA", "NA"], [, , "NA", "NA"], , , [, , "NA", "NA"]], "CX":[, [, , "[1458]\\d{5,9}", "\\d{6,10}"], [, , "89164\\d{4}", "\\d{8,9}", , , "891641234"], [, , "14(?:5\\d|71)\\d{5}|4(?:[0-2]\\d|3[0-57-9]|4[47-9]|5[0-25-9]|6[6-9]|7[03-9]|8[17-9]|9[017-9])\\d{6}", 
"\\d{9}", , , "412345678"], [, , "1(?:80(?:0\\d{2})?|3(?:00\\d{2})?)\\d{4}", "\\d{6,10}", , , "1800123456"], [, , "190[0126]\\d{6}", "\\d{10}", , , "1900123456"], [, , "NA", "NA"], [, , "500\\d{6}", "\\d{9}", , , "500123456"], [, , "550\\d{6}", "\\d{9}", , , "550123456"], "CX", 61, "(?:14(?:1[14]|34|4[17]|[56]6|7[47]|88))?001[14-689]", "0", , , "0", , "0011", , , , [, , "NA", "NA"], , , [, , "NA", "NA"], [, , "NA", "NA"], , , [, , "NA", "NA"]], "CY":[, [, , "[257-9]\\d{7}", "\\d{8}"], [, , "2[2-6]\\d{6}", 
"\\d{8}", , , "22345678"], [, , "9[5-79]\\d{6}", "\\d{8}", , , "96123456"], [, , "800\\d{5}", "\\d{8}", , , "80001234"], [, , "90[09]\\d{5}", "\\d{8}", , , "90012345"], [, , "80[1-9]\\d{5}", "\\d{8}", , , "80112345"], [, , "700\\d{5}", "\\d{8}", , , "70012345"], [, , "NA", "NA"], "CY", 357, "00", , , , , , , , [[, "(\\d{2})(\\d{6})", "$1 $2", , "", "", 0]], , [, , "NA", "NA"], , , [, , "NA", "NA"], [, , "(?:50|77)\\d{6}", "\\d{8}", , , "77123456"], , , [, , "NA", "NA"]], "CZ":[, [, , "[2-8]\\d{8}|9\\d{8,11}", 
"\\d{9,12}"], [, , "2\\d{8}|(?:3[1257-9]|4[16-9]|5[13-9])\\d{7}", "\\d{9,12}", , , "212345678"], [, , "(?:60[1-8]|7(?:0[2-5]|[2379]\\d))\\d{6}", "\\d{9,12}", , , "601123456"], [, , "800\\d{6}", "\\d{9,12}", , , "800123456"], [, , "9(?:0[05689]|76)\\d{6}", "\\d{9,12}", , , "900123456"], [, , "8[134]\\d{7}", "\\d{9,12}", , , "811234567"], [, , "70[01]\\d{6}", "\\d{9,12}", , , "700123456"], [, , "9[17]0\\d{6}", "\\d{9,12}", , , "910123456"], "CZ", 420, "00", , , , , , , , [[, "([2-9]\\d{2})(\\d{3})(\\d{3})", 
"$1 $2 $3", ["[2-8]|9[015-7]"], "", "", 0], [, "(96\\d)(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3 $4", ["96"], "", "", 0], [, "(9\\d)(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3 $4", ["9[36]"], "", "", 0]], , [, , "NA", "NA"], , , [, , "NA", "NA"], [, , "9(?:5\\d|7[234])\\d{6}", "\\d{9,12}", , , "972123456"], , , [, , "9(?:3\\d{9}|6\\d{7,10})", "\\d{9,12}", , , "93123456789"]], "DE":[, [, , "[1-35-9]\\d{3,14}|4(?:[0-8]\\d{4,12}|9(?:[0-37]\\d|4(?:[1-35-8]|4\\d?)|5\\d{1,2}|6[1-8]\\d?)\\d{2,8})", "\\d{2,15}"], [, 
, "[246]\\d{5,13}|3(?:0\\d{3,13}|2\\d{9}|[3-9]\\d{4,13})|5(?:0[2-8]|[1256]\\d|[38][0-8]|4\\d{0,2}|[79][0-7])\\d{3,11}|7(?:0[2-8]|[1-9]\\d)\\d{3,10}|8(?:0[2-9]|[1-9]\\d)\\d{3,10}|9(?:0[6-9]\\d{3,10}|1\\d{4,12}|[2-9]\\d{4,11})", "\\d{2,15}", , , "30123456"], [, , "1(?:5[0-2579]\\d{8}|6[023]\\d{7,8}|7(?:[0-57-9]\\d?|6\\d)\\d{7})", "\\d{10,11}", , , "15123456789"], [, , "800\\d{7,12}", "\\d{10,15}", , , "8001234567890"], [, , "137[7-9]\\d{6}|900(?:[135]\\d{6}|9\\d{7})", "\\d{10,11}", , , "9001234567"], 
[, , "1(?:3(?:7[1-6]\\d{6}|8\\d{4})|80\\d{5,11})", "\\d{7,14}", , , "18012345"], [, , "700\\d{8}", "\\d{11}", , , "70012345678"], [, , "NA", "NA"], "DE", 49, "00", "0", , , "0", , , , [[, "(1\\d{2})(\\d{7,8})", "$1 $2", ["1[67]"], "0$1", "", 0], [, "(1\\d{3})(\\d{7})", "$1 $2", ["15"], "0$1", "", 0], [, "(\\d{2})(\\d{3,11})", "$1 $2", ["3[02]|40|[68]9"], "0$1", "", 0], [, "(\\d{3})(\\d{3,11})", "$1 $2", ["2(?:\\d1|0[2389]|1[24]|28|34)|3(?:[3-9][15]|40)|[4-8][1-9]1|9(?:06|[1-9]1)"], "0$1", "", 0], 
[, "(\\d{4})(\\d{2,11})", "$1 $2", ["[24-6]|[7-9](?:\\d[1-9]|[1-9]\\d)|3(?:[3569][02-46-9]|4[2-4679]|7[2-467]|8[2-46-8])", "[24-6]|[7-9](?:\\d[1-9]|[1-9]\\d)|3(?:3(?:0[1-467]|2[127-9]|3[124578]|[46][1246]|7[1257-9]|8[1256]|9[145])|4(?:2[135]|3[1357]|4[13578]|6[1246]|7[1356]|9[1346])|5(?:0[14]|2[1-3589]|3[1357]|4[1246]|6[1-4]|7[1346]|8[13568]|9[1246])|6(?:0[356]|2[1-489]|3[124-6]|4[1347]|6[13]|7[12579]|8[1-356]|9[135])|7(?:2[1-7]|3[1357]|4[145]|6[1-5]|7[1-4])|8(?:21|3[1468]|4[1347]|6[0135-9]|7[1467]|8[136])|9(?:0[12479]|2[1358]|3[1357]|4[134679]|6[1-9]|7[136]|8[147]|9[1468]))"], 
"0$1", "", 0], [, "(3\\d{4})(\\d{1,10})", "$1 $2", ["3"], "0$1", "", 0], [, "(800)(\\d{7,12})", "$1 $2", ["800"], "0$1", "", 0], [, "(177)(99)(\\d{7,8})", "$1 $2 $3", ["177", "1779", "17799"], "0$1", "", 0], [, "(\\d{3})(\\d)(\\d{4,10})", "$1 $2 $3", ["(?:18|90)0|137", "1(?:37|80)|900[1359]"], "0$1", "", 0], [, "(1\\d{2})(\\d{5,11})", "$1 $2", ["181"], "0$1", "", 0], [, "(18\\d{3})(\\d{6})", "$1 $2", ["185", "1850", "18500"], "0$1", "", 0], [, "(18\\d{2})(\\d{7})", "$1 $2", ["18[68]"], "0$1", "", 
0], [, "(18\\d)(\\d{8})", "$1 $2", ["18[2-579]"], "0$1", "", 0], [, "(700)(\\d{4})(\\d{4})", "$1 $2 $3", ["700"], "0$1", "", 0], [, "(138)(\\d{4})", "$1 $2", ["138"], "0$1", "", 0]], , [, , "16(?:4\\d{1,10}|[89]\\d{1,11})", "\\d{4,14}", , , "16412345"], , , [, , "NA", "NA"], [, , "18(?:1\\d{5,11}|[2-9]\\d{8})", "\\d{8,14}", , , "18500123456"], , , [, , "17799\\d{7,8}", "\\d{12,13}", , , "177991234567"]], "DJ":[, [, , "[27]\\d{7}", "\\d{8}"], [, , "2(?:1[2-5]|7[45])\\d{5}", "\\d{8}", , , "21360003"], 
[, , "77[6-8]\\d{5}", "\\d{8}", , , "77831001"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], "DJ", 253, "00", , , , , , , , [[, "(\\d{2})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", , "", "", 0]], , [, , "NA", "NA"], , , [, , "NA", "NA"], [, , "NA", "NA"], , , [, , "NA", "NA"]], "DK":[, [, , "[2-9]\\d{7}", "\\d{8}"], [, , "(?:[2-7]\\d|8[126-9]|9[1-36-9])\\d{6}", "\\d{8}", , , "32123456"], [, , "(?:[2-7]\\d|8[126-9]|9[1-36-9])\\d{6}", "\\d{8}", , , "20123456"], 
[, , "80\\d{6}", "\\d{8}", , , "80123456"], [, , "90\\d{6}", "\\d{8}", , , "90123456"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], "DK", 45, "00", , , , , , , 1, [[, "(\\d{2})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", , "", "", 0]], , [, , "NA", "NA"], , , [, , "NA", "NA"], [, , "NA", "NA"], , , [, , "NA", "NA"]], "DM":[, [, , "[57-9]\\d{9}", "\\d{7}(?:\\d{3})?"], [, , "767(?:2(?:55|66)|4(?:2[01]|4[0-25-9])|50[0-4]|70[1-3])\\d{4}", "\\d{7}(?:\\d{3})?", , , "7674201234"], [, , "767(?:2(?:[234689]5|7[5-7])|31[5-7]|61[2-7])\\d{4}", 
"\\d{10}", , , "7672251234"], [, , "8(?:00|44|55|66|77|88)[2-9]\\d{6}", "\\d{10}", , , "8002123456"], [, , "900[2-9]\\d{6}", "\\d{10}", , , "9002123456"], [, , "NA", "NA"], [, , "5(?:00|33|44|66|77)[2-9]\\d{6}", "\\d{10}", , , "5002345678"], [, , "NA", "NA"], "DM", 1, "011", "1", , , "1", , , , , , [, , "NA", "NA"], , "767", [, , "NA", "NA"], [, , "NA", "NA"], , , [, , "NA", "NA"]], "DO":[, [, , "[589]\\d{9}", "\\d{7}(?:\\d{3})?"], [, , "8(?:[04]9[2-9]\\d{6}|29(?:2(?:[0-59]\\d|6[04-9]|7[0-27]|8[0237-9])|3(?:[0-35-9]\\d|4[7-9])|[45]\\d{2}|6(?:[0-27-9]\\d|[3-5][1-9]|6[0135-8])|7(?:0[013-9]|[1-37]\\d|4[1-35689]|5[1-4689]|6[1-57-9]|8[1-79]|9[1-8])|8(?:0[146-9]|1[0-48]|[248]\\d|3[1-79]|5[01589]|6[013-68]|7[124-8]|9[0-8])|9(?:[0-24]\\d|3[02-46-9]|5[0-79]|60|7[0169]|8[57-9]|9[02-9]))\\d{4})", 
"\\d{7}(?:\\d{3})?", , , "8092345678"], [, , "8[024]9[2-9]\\d{6}", "\\d{7}(?:\\d{3})?", , , "8092345678"], [, , "8(?:00|44|55|66|77|88)[2-9]\\d{6}", "\\d{10}", , , "8002123456"], [, , "900[2-9]\\d{6}", "\\d{10}", , , "9002123456"], [, , "NA", "NA"], [, , "5(?:00|33|44|66|77)[2-9]\\d{6}", "\\d{10}", , , "5002345678"], [, , "NA", "NA"], "DO", 1, "011", "1", , , "1", , , , , , [, , "NA", "NA"], , "8[024]9", [, , "NA", "NA"], [, , "NA", "NA"], , , [, , "NA", "NA"]], "DZ":[, [, , "(?:[1-4]|[5-9]\\d)\\d{7}", 
"\\d{8,9}"], [, , "(?:1\\d|2[014-79]|3[0-8]|4[0135689])\\d{6}|9619\\d{5}", "\\d{8,9}", , , "12345678"], [, , "(?:5[4-6]|7[7-9])\\d{7}|6(?:[569]\\d|7[0-4])\\d{6}", "\\d{9}", , , "551234567"], [, , "800\\d{6}", "\\d{9}", , , "800123456"], [, , "80[3-689]1\\d{5}", "\\d{9}", , , "808123456"], [, , "80[12]1\\d{5}", "\\d{9}", , , "801123456"], [, , "NA", "NA"], [, , "98[23]\\d{6}", "\\d{9}", , , "983123456"], "DZ", 213, "00", "0", , , "0", , , , [[, "([1-4]\\d)(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", 
["[1-4]"], "0$1", "", 0], [, "([5-8]\\d{2})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["[5-8]"], "0$1", "", 0], [, "(9\\d)(\\d{3})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["9"], "0$1", "", 0]], , [, , "NA", "NA"], , , [, , "NA", "NA"], [, , "NA", "NA"], , , [, , "NA", "NA"]], "EC":[, [, , "1\\d{9,10}|[2-8]\\d{7}|9\\d{8}", "\\d{7,11}"], [, , "[2-7][2-7]\\d{6}", "\\d{7,8}", , , "22123456"], [, , "9(?:39|[45][89]|[67][7-9]|[89]\\d)\\d{6}", "\\d{9}", , , "991234567"], [, , "1800\\d{6,7}", "\\d{10,11}", , , "18001234567"], 
[, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "[2-7]890\\d{4}", "\\d{8}", , , "28901234"], "EC", 593, "00", "0", , , "0", , , , [[, "(\\d)(\\d{3})(\\d{4})", "$1 $2-$3", ["[247]|[356][2-8]"], "(0$1)", "", 0], [, "(\\d{2})(\\d{3})(\\d{4})", "$1 $2 $3", ["9"], "0$1", "", 0], [, "(1800)(\\d{3})(\\d{3,4})", "$1 $2 $3", ["1"], "$1", "", 0]], [[, "(\\d)(\\d{3})(\\d{4})", "$1-$2-$3", ["[247]|[356][2-8]"]], [, "(\\d{2})(\\d{3})(\\d{4})", "$1 $2 $3", ["9"], "0$1", "", 0], [, "(1800)(\\d{3})(\\d{3,4})", 
"$1 $2 $3", ["1"], "$1", "", 0]], [, , "NA", "NA"], , , [, , "NA", "NA"], [, , "NA", "NA"], , , [, , "NA", "NA"]], "EE":[, [, , "1\\d{3,4}|[3-9]\\d{6,7}|800\\d{6,7}", "\\d{4,10}"], [, , "(?:3[23589]|4[3-8]|6\\d|7[1-9]|88)\\d{5}", "\\d{7}", , , "3212345"], [, , "(?:5\\d|8[1-5])\\d{6}|5(?:[02]\\d{2}|1(?:[0-8]\\d|95)|5[0-478]\\d|64[0-4]|65[1-589])\\d{3}", "\\d{7,8}", , , "51234567"], [, , "800(?:0\\d{3}|1\\d|[2-9])\\d{3}", "\\d{7,10}", , , "80012345"], [, , "(?:40\\d{2}|900)\\d{4}", "\\d{7,8}", , , 
"9001234"], [, , "NA", "NA"], [, , "70[0-2]\\d{5}", "\\d{8}", , , "70012345"], [, , "NA", "NA"], "EE", 372, "00", , , , , , , , [[, "([3-79]\\d{2})(\\d{4})", "$1 $2", ["[369]|4[3-8]|5(?:[0-2]|5[0-478]|6[45])|7[1-9]", "[369]|4[3-8]|5(?:[02]|1(?:[0-8]|95)|5[0-478]|6(?:4[0-4]|5[1-589]))|7[1-9]"], "", "", 0], [, "(70)(\\d{2})(\\d{4})", "$1 $2 $3", ["70"], "", "", 0], [, "(8000)(\\d{3})(\\d{3})", "$1 $2 $3", ["800", "8000"], "", "", 0], [, "([458]\\d{3})(\\d{3,4})", "$1 $2", ["40|5|8(?:00|[1-5])", "40|5|8(?:00[1-9]|[1-5])"], 
"", "", 0]], , [, , "NA", "NA"], , , [, , "1\\d{3,4}|800[2-9]\\d{3}", "\\d{4,7}", , , "8002123"], [, , "1(?:2[01245]|3[0-6]|4[1-489]|5[0-59]|6[1-46-9]|7[0-27-9]|8[189]|9[012])\\d{1,2}", "\\d{4,5}", , , "12123"], , , [, , "NA", "NA"]], "EG":[, [, , "1\\d{4,9}|[2456]\\d{8}|3\\d{7}|[89]\\d{8,9}", "\\d{5,10}"], [, , "(?:1(?:3[23]\\d|5(?:[23]|9\\d))|2[2-4]\\d{2}|3\\d{2}|4(?:0[2-5]|[578][23]|64)\\d|5(?:0[2-7]|[57][23])\\d|6[24-689]3\\d|8(?:2[2-57]|4[26]|6[237]|8[2-4])\\d|9(?:2[27]|3[24]|52|6[2356]|7[2-4])\\d)\\d{5}|1[69]\\d{3}", 
"\\d{5,9}", , , "234567890"], [, , "1(?:0[0-269]|1[0-245]|2[0-278])\\d{7}", "\\d{10}", , , "1001234567"], [, , "800\\d{7}", "\\d{10}", , , "8001234567"], [, , "900\\d{7}", "\\d{10}", , , "9001234567"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], "EG", 20, "00", "0", , , "0", , , , [[, "(\\d)(\\d{7,8})", "$1 $2", ["[23]"], "0$1", "", 0], [, "(\\d{3})(\\d{3})(\\d{4})", "$1 $2 $3", ["1[012]|[89]00"], "0$1", "", 0], [, "(\\d{2})(\\d{6,7})", "$1 $2", ["1[35]|[4-6]|[89][2-9]"], "0$1", "", 0]], 
, [, , "NA", "NA"], , , [, , "NA", "NA"], [, , "NA", "NA"], , , [, , "NA", "NA"]], "EH":[, [, , "[5689]\\d{8}", "\\d{9}"], [, , "528[89]\\d{5}", "\\d{9}", , , "528812345"], [, , "6(?:0[0-8]|[12-7]\\d|8[01]|9[2457-9])\\d{6}", "\\d{9}", , , "650123456"], [, , "80\\d{7}", "\\d{9}", , , "801234567"], [, , "89\\d{7}", "\\d{9}", , , "891234567"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], "EH", 212, "00", "0", , , "0", , , , , , [, , "NA", "NA"], , "528[89]", [, , "NA", "NA"], [, , "NA", "NA"], 
, , [, , "NA", "NA"]], "ER":[, [, , "[178]\\d{6}", "\\d{6,7}"], [, , "1(?:1[12568]|20|40|55|6[146])\\d{4}|8\\d{6}", "\\d{6,7}", , , "8370362"], [, , "17[1-3]\\d{4}|7\\d{6}", "\\d{7}", , , "7123456"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], "ER", 291, "00", "0", , , "0", , , , [[, "(\\d)(\\d{3})(\\d{3})", "$1 $2 $3", , "0$1", "", 0]], , [, , "NA", "NA"], , , [, , "NA", "NA"], [, , "NA", "NA"], , , [, , "NA", "NA"]], "ES":[, [, , "[5-9]\\d{8}", "\\d{9}"], 
[, , "8(?:[13]0|[28][0-8]|[47][1-9]|5[01346-9]|6[0457-9])\\d{6}|9(?:[1238][0-8]\\d{6}|4[1-9]\\d{6}|5\\d{7}|6(?:[0-8]\\d{6}|9(?:0(?:[0-57-9]\\d{4}|6(?:0[0-8]|1[1-9]|[2-9]\\d)\\d{2})|[1-9]\\d{5}))|7(?:[124-9]\\d{2}|3(?:[0-8]\\d|9[1-9]))\\d{4})", "\\d{9}", , , "810123456"], [, , "(?:6\\d{6}|7[1-4]\\d{5}|9(?:6906(?:09|10)|7390\\d{2}))\\d{2}", "\\d{9}", , , "612345678"], [, , "[89]00\\d{6}", "\\d{9}", , , "800123456"], [, , "80[367]\\d{6}", "\\d{9}", , , "803123456"], [, , "90[12]\\d{6}", "\\d{9}", , 
, "901123456"], [, , "70\\d{7}", "\\d{9}", , , "701234567"], [, , "NA", "NA"], "ES", 34, "00", , , , , , , , [[, "([5-9]\\d{2})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["[568]|[79][0-8]"], "", "", 0]], , [, , "NA", "NA"], , , [, , "NA", "NA"], [, , "51\\d{7}", "\\d{9}", , , "511234567"], , , [, , "NA", "NA"]], "ET":[, [, , "[1-59]\\d{8}", "\\d{7,9}"], [, , "(?:11(?:1(?:1[124]|2[2-57]|3[1-5]|5[5-8]|8[6-8])|2(?:13|3[6-8]|5[89]|7[05-9]|8[2-6])|3(?:2[01]|3[0-289]|4[1289]|7[1-4]|87)|4(?:1[69]|3[2-49]|4[0-3]|6[5-8])|5(?:1[57]|44|5[0-4])|6(?:18|2[69]|4[5-7]|5[1-5]|6[0-59]|8[015-8]))|2(?:2(?:11[1-9]|22[0-7]|33\\d|44[1467]|66[1-68])|5(?:11[124-6]|33[2-8]|44[1467]|55[14]|66[1-3679]|77[124-79]|880))|3(?:3(?:11[0-46-8]|22[0-6]|33[0134689]|44[04]|55[0-6]|66[01467])|4(?:44[0-8]|55[0-69]|66[0-3]|77[1-5]))|4(?:6(?:22[0-24-7]|33[1-5]|44[13-69]|55[14-689]|660|88[1-4])|7(?:11[1-9]|22[1-9]|33[13-7]|44[13-6]|55[1-689]))|5(?:7(?:227|55[05]|(?:66|77)[14-8])|8(?:11[149]|22[013-79]|33[0-68]|44[013-8]|550|66[1-5]|77\\d)))\\d{4}", 
"\\d{7,9}", , , "111112345"], [, , "9(?:[1-3]\\d|5[89])\\d{6}", "\\d{9}", , , "911234567"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], "ET", 251, "00", "0", , , "0", , , , [[, "([1-59]\\d)(\\d{3})(\\d{4})", "$1 $2 $3", , "0$1", "", 0]], , [, , "NA", "NA"], , , [, , "NA", "NA"], [, , "NA", "NA"], , , [, , "NA", "NA"]], "FI":[, [, , "1\\d{4,11}|[2-9]\\d{4,10}", "\\d{5,12}"], [, , "1(?:[3569][1-8]\\d{3,9}|[47]\\d{5,10})|2[1-8]\\d{3,9}|3(?:[1-8]\\d{3,9}|9\\d{4,8})|[5689][1-8]\\d{3,9}", 
"\\d{5,12}", , , "1312345678"], [, , "4\\d{5,10}|50\\d{4,8}", "\\d{6,11}", , , "412345678"], [, , "800\\d{4,7}", "\\d{7,10}", , , "8001234567"], [, , "[67]00\\d{5,6}", "\\d{8,9}", , , "600123456"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], "FI", 358, "00|99[049]", "0", , , "0", , , , [[, "(\\d{3})(\\d{3,7})", "$1 $2", ["(?:[1-3]00|[6-8]0)"], "0$1", "", 0], [, "(\\d{2})(\\d{4,10})", "$1 $2", ["[14]|2[09]|50|7[135]"], "0$1", "", 0], [, "(\\d)(\\d{4,11})", "$1 $2", ["[25689][1-8]|3"], "0$1", 
"", 0]], , [, , "NA", "NA"], 1, , [, , "[13]00\\d{3,7}|2(?:0(?:0\\d{3,7}|2[023]\\d{1,6}|9[89]\\d{1,6}))|60(?:[12]\\d{5,6}|6\\d{7})|7(?:1\\d{7}|3\\d{8}|5[03-9]\\d{2,7})", "\\d{5,10}", , , "100123"], [, , "[13]0\\d{4,8}|2(?:0(?:[016-8]\\d{3,7}|[2-59]\\d{2,7})|9\\d{4,8})|60(?:[12]\\d{5,6}|6\\d{7})|7(?:1\\d{7}|3\\d{8}|5[03-9]\\d{2,7})", "\\d{5,10}", , , "10112345"], , , [, , "NA", "NA"]], "FJ":[, [, , "[36-9]\\d{6}|0\\d{10}", "\\d{7}(?:\\d{4})?"], [, , "(?:3[0-5]|6[25-7]|8[58])\\d{5}", "\\d{7}", , , 
"3212345"], [, , "(?:7[0-8]|8[034679]|9\\d)\\d{5}", "\\d{7}", , , "7012345"], [, , "0800\\d{7}", "\\d{11}", , , "08001234567"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], "FJ", 679, "0(?:0|52)", , , , , , "00", , [[, "(\\d{3})(\\d{4})", "$1 $2", ["[36-9]"], "", "", 0], [, "(\\d{4})(\\d{3})(\\d{4})", "$1 $2 $3", ["0"], "", "", 0]], , [, , "NA", "NA"], , , [, , "NA", "NA"], [, , "NA", "NA"], 1, , [, , "NA", "NA"]], "FK":[, [, , "[2-7]\\d{4}", "\\d{5}"], [, , "[2-47]\\d{4}", 
"\\d{5}", , , "31234"], [, , "[56]\\d{4}", "\\d{5}", , , "51234"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], "FK", 500, "00", , , , , , , , , , [, , "NA", "NA"], , , [, , "NA", "NA"], [, , "NA", "NA"], , , [, , "NA", "NA"]], "FM":[, [, , "[39]\\d{6}", "\\d{7}"], [, , "3[2357]0[1-9]\\d{3}|9[2-6]\\d{5}", "\\d{7}", , , "3201234"], [, , "3[2357]0[1-9]\\d{3}|9[2-7]\\d{5}", "\\d{7}", , , "3501234"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], [, 
, "NA", "NA"], [, , "NA", "NA"], "FM", 691, "00", , , , , , , , [[, "(\\d{3})(\\d{4})", "$1 $2", , "", "", 0]], , [, , "NA", "NA"], , , [, , "NA", "NA"], [, , "NA", "NA"], , , [, , "NA", "NA"]], "FO":[, [, , "[2-9]\\d{5}", "\\d{6}"], [, , "(?:20|[3-4]\\d|8[19])\\d{4}", "\\d{6}", , , "201234"], [, , "(?:2[1-9]|5\\d|7[1-79])\\d{4}", "\\d{6}", , , "211234"], [, , "80[257-9]\\d{3}", "\\d{6}", , , "802123"], [, , "90(?:[1345][15-7]|2[125-7]|99)\\d{2}", "\\d{6}", , , "901123"], [, , "NA", "NA"], [, , "NA", 
"NA"], [, , "(?:6[0-36]|88)\\d{4}", "\\d{6}", , , "601234"], "FO", 298, "00", , , , "(10(?:01|[12]0|88))", , , , [[, "(\\d{6})", "$1", , "", "$CC $1", 0]], , [, , "NA", "NA"], , , [, , "NA", "NA"], [, , "NA", "NA"], , , [, , "NA", "NA"]], "FR":[, [, , "[1-9]\\d{8}", "\\d{9}"], [, , "[1-5]\\d{8}", "\\d{9}", , , "123456789"], [, , "6\\d{8}|7[5-9]\\d{7}", "\\d{9}", , , "612345678"], [, , "80\\d{7}", "\\d{9}", , , "801234567"], [, , "89[1-37-9]\\d{6}", "\\d{9}", , , "891123456"], [, , "8(?:1[019]|2[0156]|84|90)\\d{6}", 
"\\d{9}", , , "810123456"], [, , "NA", "NA"], [, , "9\\d{8}", "\\d{9}", , , "912345678"], "FR", 33, "00", "0", , , "0", , , , [[, "([1-79])(\\d{2})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4 $5", ["[1-79]"], "0$1", "", 0], [, "(1\\d{2})(\\d{3})", "$1 $2", ["11"], "$1", "", 0], [, "(8\\d{2})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["8"], "0 $1", "", 0]], [[, "([1-79])(\\d{2})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4 $5", ["[1-79]"], "0$1", "", 0], [, "(8\\d{2})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", 
["8"], "0 $1", "", 0]], [, , "NA", "NA"], , , [, , "NA", "NA"], [, , "NA", "NA"], , , [, , "NA", "NA"]], "GA":[, [, , "0?\\d{7}", "\\d{7,8}"], [, , "01\\d{6}", "\\d{8}", , , "01441234"], [, , "0?[2-7]\\d{6}", "\\d{7,8}", , , "06031234"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], "GA", 241, "00", , , , , , , , [[, "(\\d)(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["[2-7]"], "0$1", "", 0], [, "(\\d{2})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["0"], "", 
"", 0]], , [, , "NA", "NA"], , , [, , "NA", "NA"], [, , "NA", "NA"], 1, , [, , "NA", "NA"]], "GB":[, [, , "\\d{7,10}", "\\d{4,10}"], [, , "2(?:0[01378]|3[0189]|4[017]|8[0-46-9]|9[012])\\d{7}|1(?:(?:1(?:3[0-48]|[46][0-4]|5[012789]|7[0-49]|8[01349])|21[0-7]|31[0-8]|[459]1\\d|61[0-46-9]))\\d{6}|1(?:2(?:0[024-9]|2[3-9]|3[3-79]|4[1-689]|[58][02-9]|6[0-4789]|7[013-9]|9\\d)|3(?:0\\d|[25][02-9]|3[02-579]|[468][0-46-9]|7[1235679]|9[24578])|4(?:0[03-9]|[28][02-5789]|[37]\\d|4[02-69]|5[0-8]|[69][0-79])|5(?:0[1235-9]|2[024-9]|3[015689]|4[02-9]|5[03-9]|6\\d|7[0-35-9]|8[0-468]|9[0-5789])|6(?:0[034689]|2[0-35689]|[38][013-9]|4[1-467]|5[0-69]|6[13-9]|7[0-8]|9[0124578])|7(?:0[0246-9]|2\\d|3[023678]|4[03-9]|5[0-46-9]|6[013-9]|7[0-35-9]|8[024-9]|9[02-9])|8(?:0[35-9]|2[1-5789]|3[02-578]|4[0-578]|5[124-9]|6[2-69]|7\\d|8[02-9]|9[02569])|9(?:0[02-589]|2[02-689]|3[1-5789]|4[2-9]|5[0-579]|6[234789]|7[0124578]|8\\d|9[2-57]))\\d{6}|1(?:2(?:0(?:46[1-4]|87[2-9])|545[1-79]|76(?:2\\d|3[1-8]|6[1-6])|9(?:7(?:2[0-4]|3[2-5])|8(?:2[2-8]|7[0-4789]|8[345])))|3(?:638[2-5]|647[23]|8(?:47[04-9]|64[015789]))|4(?:044[1-7]|20(?:2[23]|8\\d)|6(?:0(?:30|5[2-57]|6[1-8]|7[2-8])|140)|8(?:052|87[123]))|5(?:24(?:3[2-79]|6\\d)|276\\d|6(?:26[06-9]|686))|6(?:06(?:4\\d|7[4-79])|295[567]|35[34]\\d|47(?:24|61)|59(?:5[08]|6[67]|74)|955[0-4])|7(?:26(?:6[13-9]|7[0-7])|442\\d|50(?:2[0-3]|[3-68]2|76))|8(?:27[56]\\d|37(?:5[2-5]|8[239])|84(?:3[2-58]))|9(?:0(?:0(?:6[1-8]|85)|52\\d)|3583|4(?:66[1-8]|9(?:2[01]|81))|63(?:23|3[1-4])|9561))\\d{3}|176888[234678]\\d{2}|16977[23]\\d{3}", 
"\\d{4,10}", , , "1212345678"], [, , "7(?:[1-4]\\d\\d|5(?:0[0-8]|[13-9]\\d|2[0-35-9])|7(?:0[1-9]|[1-7]\\d|8[02-9]|9[0-689])|8(?:[014-9]\\d|[23][0-8])|9(?:[04-9]\\d|1[02-9]|2[0-35-9]|3[0-689]))\\d{6}", "\\d{10}", , , "7400123456"], [, , "80(?:0(?:1111|\\d{6,7})|8\\d{7})|500\\d{6}", "\\d{7}(?:\\d{2,3})?", , , "8001234567"], [, , "(?:87[123]|9(?:[01]\\d|8[2349]))\\d{7}", "\\d{10}", , , "9012345678"], [, , "8(?:4(?:5464\\d|[2-5]\\d{7})|70\\d{7})", "\\d{7}(?:\\d{3})?", , , "8431234567"], [, , "70\\d{8}", 
"\\d{10}", , , "7012345678"], [, , "56\\d{8}", "\\d{10}", , , "5612345678"], "GB", 44, "00", "0", " x", , "0", , , , [[, "(\\d{2})(\\d{4})(\\d{4})", "$1 $2 $3", ["2|5[56]|7(?:0|6[013-9])", "2|5[56]|7(?:0|6(?:[013-9]|2[0-35-9]))"], "0$1", "", 0], [, "(\\d{3})(\\d{3})(\\d{4})", "$1 $2 $3", ["1(?:1|\\d1)|3|9[018]"], "0$1", "", 0], [, "(\\d{5})(\\d{4,5})", "$1 $2", ["1(?:38|5[23]|69|76|94)", "1(?:387|5(?:24|39)|697|768|946)", "1(?:3873|5(?:242|39[456])|697[347]|768[347]|9467)"], "0$1", "", 0], [, "(1\\d{3})(\\d{5,6})", 
"$1 $2", ["1"], "0$1", "", 0], [, "(7\\d{3})(\\d{6})", "$1 $2", ["7(?:[1-5789]|62)", "7(?:[1-5789]|624)"], "0$1", "", 0], [, "(800)(\\d{4})", "$1 $2", ["800", "8001", "80011", "800111", "8001111"], "0$1", "", 0], [, "(845)(46)(4\\d)", "$1 $2 $3", ["845", "8454", "84546", "845464"], "0$1", "", 0], [, "(8\\d{2})(\\d{3})(\\d{4})", "$1 $2 $3", ["8(?:4[2-5]|7[0-3])"], "0$1", "", 0], [, "(80\\d)(\\d{3})(\\d{4})", "$1 $2 $3", ["80"], "0$1", "", 0], [, "([58]00)(\\d{6})", "$1 $2", ["[58]00"], "0$1", "", 
0]], , [, , "76(?:0[012]|2[356]|4[0134]|5[49]|6[0-369]|77|81|9[39])\\d{6}", "\\d{10}", , , "7640123456"], 1, , [, , "NA", "NA"], [, , "(?:3[0347]|55)\\d{8}", "\\d{10}", , , "5512345678"], , , [, , "NA", "NA"]], "GD":[, [, , "[4589]\\d{9}", "\\d{7}(?:\\d{3})?"], [, , "473(?:2(?:3[0-2]|69)|3(?:2[89]|86)|4(?:[06]8|3[5-9]|4[0-49]|5[5-79]|68|73|90)|63[68]|7(?:58|84)|800|938)\\d{4}", "\\d{7}(?:\\d{3})?", , , "4732691234"], [, , "473(?:4(?:0[2-79]|1[04-9]|20|58)|5(?:2[01]|3[3-8])|901)\\d{4}", "\\d{10}", 
, , "4734031234"], [, , "8(?:00|44|55|66|77|88)[2-9]\\d{6}", "\\d{10}", , , "8002123456"], [, , "900[2-9]\\d{6}", "\\d{10}", , , "9002123456"], [, , "NA", "NA"], [, , "5(?:00|33|44|66|77)[2-9]\\d{6}", "\\d{10}", , , "5002345678"], [, , "NA", "NA"], "GD", 1, "011", "1", , , "1", , , , , , [, , "NA", "NA"], , "473", [, , "NA", "NA"], [, , "NA", "NA"], , , [, , "NA", "NA"]], "GE":[, [, , "[34578]\\d{8}", "\\d{6,9}"], [, , "(?:3(?:[256]\\d|4[124-9]|7[0-4])|4(?:1\\d|2[2-7]|3[1-79]|4[2-8]|7[239]|9[1-7]))\\d{6}", 
"\\d{6,9}", , , "322123456"], [, , "5(?:14|5[01578]|68|7[0147-9]|9[0-35-9])\\d{6}", "\\d{9}", , , "555123456"], [, , "800\\d{6}", "\\d{9}", , , "800123456"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "706\\d{6}", "\\d{9}", , , "706123456"], "GE", 995, "00", "0", , , "0", , , , [[, "(\\d{3})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["[348]"], "0$1", "", 0], [, "(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", ["7"], "0$1", "", 0], [, "(\\d{3})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["5"], 
"$1", "", 0]], , [, , "NA", "NA"], , , [, , "706\\d{6}", "\\d{9}", , , "706123456"], [, , "NA", "NA"], , , [, , "NA", "NA"]], "GF":[, [, , "[56]\\d{8}", "\\d{9}"], [, , "594(?:10|2[012457-9]|3[0-57-9]|4[3-9]|5[7-9]|6[0-3]|9[014])\\d{4}", "\\d{9}", , , "594101234"], [, , "694(?:[04][0-7]|1[0-5]|3[018]|[29]\\d)\\d{4}", "\\d{9}", , , "694201234"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], "GF", 594, "00", "0", , , "0", , , , [[, "(\\d{3})(\\d{2})(\\d{2})(\\d{2})", 
"$1 $2 $3 $4", , "0$1", "", 0]], , [, , "NA", "NA"], , , [, , "NA", "NA"], [, , "NA", "NA"], , , [, , "NA", "NA"]], "GG":[, [, , "[135789]\\d{6,9}", "\\d{6,10}"], [, , "1481\\d{6}", "\\d{6,10}", , , "1481456789"], [, , "7(?:781|839|911)\\d{6}", "\\d{10}", , , "7781123456"], [, , "80(?:0(?:1111|\\d{6,7})|8\\d{7})|500\\d{6}", "\\d{7}(?:\\d{2,3})?", , , "8001234567"], [, , "(?:87[123]|9(?:[01]\\d|8[0-3]))\\d{7}", "\\d{10}", , , "9012345678"], [, , "8(?:4(?:5464\\d|[2-5]\\d{7})|70\\d{7})", "\\d{7}(?:\\d{3})?", 
, , "8431234567"], [, , "70\\d{8}", "\\d{10}", , , "7012345678"], [, , "56\\d{8}", "\\d{10}", , , "5612345678"], "GG", 44, "00", "0", " x", , "0", , , , , , [, , "76(?:0[012]|2[356]|4[0134]|5[49]|6[0-369]|77|81|9[39])\\d{6}", "\\d{10}", , , "7640123456"], , , [, , "NA", "NA"], [, , "(?:3[0347]|55)\\d{8}", "\\d{10}", , , "5512345678"], , , [, , "NA", "NA"]], "GH":[, [, , "[235]\\d{8}|8\\d{7}", "\\d{7,9}"], [, , "3(?:0[237]\\d|[167](?:2[0-6]|7\\d)|2(?:2[0-5]|7\\d)|3(?:2[0-3]|7\\d)|4(?:2[013-9]|3[01]|7\\d)|5(?:2[0-7]|7\\d)|8(?:2[0-2]|7\\d)|9(?:20|7\\d))\\d{5}", 
"\\d{7,9}", , , "302345678"], [, , "(?:2[034678]\\d|5(?:[047]\\d|54))\\d{6}", "\\d{9}", , , "231234567"], [, , "800\\d{5}", "\\d{8}", , , "80012345"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], "GH", 233, "00", "0", , , "0", , , , [[, "(\\d{2})(\\d{3})(\\d{4})", "$1 $2 $3", ["[235]"], "0$1", "", 0], [, "(\\d{3})(\\d{5})", "$1 $2", ["8"], "0$1", "", 0]], , [, , "NA", "NA"], , , [, , "800\\d{5}", "\\d{8}", , , "80012345"], [, , "NA", "NA"], , , [, , "NA", "NA"]], "GI":[, 
[, , "[2568]\\d{7}", "\\d{8}"], [, , "2(?:00\\d|1(?:6[24-7]|9\\d)|2(?:00|2[2457]))\\d{4}", "\\d{8}", , , "20012345"], [, , "(?:5[46-8]|62)\\d{6}", "\\d{8}", , , "57123456"], [, , "80\\d{6}", "\\d{8}", , , "80123456"], [, , "8[1-689]\\d{6}", "\\d{8}", , , "88123456"], [, , "87\\d{6}", "\\d{8}", , , "87123456"], [, , "NA", "NA"], [, , "NA", "NA"], "GI", 350, "00", , , , , , , , [[, "(\\d{3})(\\d{5})", "$1 $2", ["2"], "", "", 0]], , [, , "NA", "NA"], , , [, , "NA", "NA"], [, , "NA", "NA"], , , [, , 
"NA", "NA"]], "GL":[, [, , "[1-689]\\d{5}", "\\d{6}"], [, , "(?:19|3[1-6]|6[14689]|8[14-79]|9\\d)\\d{4}", "\\d{6}", , , "321000"], [, , "[245][2-9]\\d{4}", "\\d{6}", , , "221234"], [, , "80\\d{4}", "\\d{6}", , , "801234"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "3[89]\\d{4}", "\\d{6}", , , "381234"], "GL", 299, "00", , , , , , , , [[, "(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3", , "", "", 0]], , [, , "NA", "NA"], , , [, , "NA", "NA"], [, , "NA", "NA"], , , [, , "NA", "NA"]], "GM":[, 
[, , "[2-9]\\d{6}", "\\d{7}"], [, , "(?:4(?:[23]\\d{2}|4(?:1[024679]|[6-9]\\d))|5(?:54[0-7]|6(?:[67]\\d)|7(?:1[04]|2[035]|3[58]|48))|8\\d{3})\\d{3}", "\\d{7}", , , "5661234"], [, , "(?:2[0-6]|[3679]\\d)\\d{5}", "\\d{7}", , , "3012345"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], "GM", 220, "00", , , , , , , , [[, "(\\d{3})(\\d{4})", "$1 $2", , "", "", 0]], , [, , "NA", "NA"], , , [, , "NA", "NA"], [, , "NA", "NA"], , , [, , "NA", "NA"]], "GN":[, [, , 
"[367]\\d{7,8}", "\\d{8,9}"], [, , "30(?:24|3[12]|4[1-35-7]|5[13]|6[189]|[78]1|9[1478])\\d{4}", "\\d{8}", , , "30241234"], [, , "6[02356]\\d{7}", "\\d{9}", , , "601123456"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "722\\d{6}", "\\d{9}", , , "722123456"], "GN", 224, "00", , , , , , , , [[, "(\\d{2})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["3"], "", "", 0], [, "(\\d{3})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["[67]"], "", "", 0]], , [, , "NA", "NA"], , , [, 
, "NA", "NA"], [, , "NA", "NA"], , , [, , "NA", "NA"]], "GP":[, [, , "[56]\\d{8}", "\\d{9}"], [, , "590(?:0[13468]|1[012]|2[0-68]|3[28]|4[0-8]|5[579]|6[0189]|70|8[0-689]|9\\d)\\d{4}", "\\d{9}", , , "590201234"], [, , "690(?:0[0-7]|[1-9]\\d)\\d{4}", "\\d{9}", , , "690301234"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], "GP", 590, "00", "0", , , "0", , , , [[, "([56]90)(\\d{2})(\\d{4})", "$1 $2-$3", , "0$1", "", 0]], , [, , "NA", "NA"], 1, , [, , "NA", 
"NA"], [, , "NA", "NA"], , , [, , "NA", "NA"]], "GQ":[, [, , "[23589]\\d{8}", "\\d{9}"], [, , "3(?:3(?:3\\d[7-9]|[0-24-9]\\d[46])|5\\d{2}[7-9])\\d{4}", "\\d{9}", , , "333091234"], [, , "(?:222|551)\\d{6}", "\\d{9}", , , "222123456"], [, , "80\\d[1-9]\\d{5}", "\\d{9}", , , "800123456"], [, , "90\\d[1-9]\\d{5}", "\\d{9}", , , "900123456"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], "GQ", 240, "00", , , , , , , , [[, "(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", ["[235]"], "", "", 0], [, "(\\d{3})(\\d{6})", 
"$1 $2", ["[89]"], "", "", 0]], , [, , "NA", "NA"], , , [, , "NA", "NA"], [, , "NA", "NA"], , , [, , "NA", "NA"]], "GR":[, [, , "[26-9]\\d{9}", "\\d{10}"], [, , "2(?:1\\d{2}|2(?:2[1-46-9]|3[1-8]|4[1-7]|5[1-4]|6[1-8]|7[1-5]|[89][1-9])|3(?:1\\d|2[1-57]|[35][1-3]|4[13]|7[1-7]|8[124-6]|9[1-79])|4(?:1\\d|2[1-8]|3[1-4]|4[13-5]|6[1-578]|9[1-5])|5(?:1\\d|[29][1-4]|3[1-5]|4[124]|5[1-6])|6(?:1\\d|3[1245]|4[1-7]|5[13-9]|[269][1-6]|7[14]|8[1-5])|7(?:1\\d|2[1-5]|3[1-6]|4[1-7]|5[1-57]|6[135]|9[125-7])|8(?:1\\d|2[1-5]|[34][1-4]|9[1-57]))\\d{6}", 
"\\d{10}", , , "2123456789"], [, , "69\\d{8}", "\\d{10}", , , "6912345678"], [, , "800\\d{7}", "\\d{10}", , , "8001234567"], [, , "90[19]\\d{7}", "\\d{10}", , , "9091234567"], [, , "8(?:0[16]|12|25)\\d{7}", "\\d{10}", , , "8011234567"], [, , "70\\d{8}", "\\d{10}", , , "7012345678"], [, , "NA", "NA"], "GR", 30, "00", , , , , , , , [[, "([27]\\d)(\\d{4})(\\d{4})", "$1 $2 $3", ["21|7"], "", "", 0], [, "(\\d{3})(\\d{3})(\\d{4})", "$1 $2 $3", ["2[2-9]1|[689]"], "", "", 0], [, "(2\\d{3})(\\d{6})", "$1 $2", 
["2[2-9][02-9]"], "", "", 0]], , [, , "NA", "NA"], , , [, , "NA", "NA"], [, , "NA", "NA"], , , [, , "NA", "NA"]], "GT":[, [, , "[2-7]\\d{7}|1[89]\\d{9}", "\\d{8}(?:\\d{3})?"], [, , "[267][2-9]\\d{6}", "\\d{8}", , , "22456789"], [, , "[345]\\d{7}", "\\d{8}", , , "51234567"], [, , "18[01]\\d{8}", "\\d{11}", , , "18001112222"], [, , "19\\d{9}", "\\d{11}", , , "19001112222"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], "GT", 502, "00", , , , , , , , [[, "(\\d{4})(\\d{4})", "$1 $2", ["[2-7]"], 
"", "", 0], [, "(\\d{4})(\\d{3})(\\d{4})", "$1 $2 $3", ["1"], "", "", 0]], , [, , "NA", "NA"], , , [, , "NA", "NA"], [, , "NA", "NA"], , , [, , "NA", "NA"]], "GU":[, [, , "[5689]\\d{9}", "\\d{7}(?:\\d{3})?"], [, , "671(?:3(?:00|3[39]|4[349]|55|6[26])|4(?:56|7[1-9]|8[236-9])|5(?:55|6[2-5]|88)|6(?:3[2-578]|4[24-9]|5[34]|78|8[5-9])|7(?:[079]7|2[0167]|3[45]|8[789])|8(?:[2-5789]8|6[48])|9(?:2[29]|6[79]|7[179]|8[789]|9[78]))\\d{4}", "\\d{7}(?:\\d{3})?", , , "6713001234"], [, , "671(?:3(?:00|3[39]|4[349]|55|6[26])|4(?:56|7[1-9]|8[236-9])|5(?:55|6[2-5]|88)|6(?:3[2-578]|4[24-9]|5[34]|78|8[5-9])|7(?:[079]7|2[0167]|3[45]|8[789])|8(?:[2-5789]8|6[48])|9(?:2[29]|6[79]|7[179]|8[789]|9[78]))\\d{4}", 
"\\d{7}(?:\\d{3})?", , , "6713001234"], [, , "8(?:00|44|55|66|77|88)[2-9]\\d{6}", "\\d{10}", , , "8002123456"], [, , "900[2-9]\\d{6}", "\\d{10}", , , "9002123456"], [, , "NA", "NA"], [, , "5(?:00|33|44|66|77)[2-9]\\d{6}", "\\d{10}", , , "5002345678"], [, , "NA", "NA"], "GU", 1, "011", "1", , , "1", , , 1, , , [, , "NA", "NA"], , "671", [, , "NA", "NA"], [, , "NA", "NA"], , , [, , "NA", "NA"]], "GW":[, [, , "[3-79]\\d{6}", "\\d{7}"], [, , "3(?:2[0125]|3[1245]|4[12]|5[1-4]|70|9[1-467])\\d{4}", "\\d{7}", 
, , "3201234"], [, , "(?:[5-7]\\d|9[012])\\d{5}", "\\d{7}", , , "5012345"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "40\\d{5}", "\\d{7}", , , "4012345"], "GW", 245, "00", , , , , , , , [[, "(\\d{3})(\\d{4})", "$1 $2", , "", "", 0]], , [, , "NA", "NA"], , , [, , "NA", "NA"], [, , "NA", "NA"], , , [, , "NA", "NA"]], "GY":[, [, , "[2-4679]\\d{6}", "\\d{7}"], [, , "(?:2(?:1[6-9]|2[0-35-9]|3[1-4]|5[3-9]|6\\d|7[0-24-79])|3(?:2[25-9]|3\\d)|4(?:4[0-24]|5[56])|77[1-57])\\d{4}", 
"\\d{7}", , , "2201234"], [, , "6\\d{6}", "\\d{7}", , , "6091234"], [, , "(?:289|862)\\d{4}", "\\d{7}", , , "2891234"], [, , "9008\\d{3}", "\\d{7}", , , "9008123"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], "GY", 592, "001", , , , , , , , [[, "(\\d{3})(\\d{4})", "$1 $2", , "", "", 0]], , [, , "NA", "NA"], , , [, , "NA", "NA"], [, , "NA", "NA"], , , [, , "NA", "NA"]], "HK":[, [, , "[235-7]\\d{7}|8\\d{7,8}|9\\d{4,10}", "\\d{5,11}"], [, , "(?:[23]\\d|5[78])\\d{6}", "\\d{8}", , , "21234567"], 
[, , "(?:5[1-69]\\d|6\\d{2}|9(?:0[1-9]|[1-8]\\d))\\d{5}", "\\d{8}", , , "51234567"], [, , "800\\d{6}", "\\d{9}", , , "800123456"], [, , "900(?:[0-24-9]\\d{7}|3\\d{1,4})", "\\d{5,11}", , , "90012345678"], [, , "NA", "NA"], [, , "8[1-3]\\d{6}", "\\d{8}", , , "81123456"], [, , "NA", "NA"], "HK", 852, "00", , , , , , , , [[, "(\\d{4})(\\d{4})", "$1 $2", ["[235-7]|[89](?:0[1-9]|[1-9])"], "", "", 0], [, "(800)(\\d{3})(\\d{3})", "$1 $2 $3", ["800"], "", "", 0], [, "(900)(\\d{2})(\\d{3})(\\d{3})", "$1 $2 $3 $4", 
["900"], "", "", 0], [, "(900)(\\d{2,5})", "$1 $2", ["900"], "", "", 0]], , [, , "7\\d{7}", "\\d{8}", , , "71234567"], , , [, , "NA", "NA"], [, , "NA", "NA"], , , [, , "NA", "NA"]], "HN":[, [, , "[237-9]\\d{7}", "\\d{8}"], [, , "2(?:2(?:0[019]|1[1-36]|[23]\\d|4[056]|5[57]|7[01389]|8[0146-9]|9[012])|4(?:2[3-59]|3[13-689]|4[0-68]|5[1-35])|5(?:4[3-5]|5\\d|6[56]|74)|6(?:[056]\\d|4[0-378]|[78][0-8]|9[01])|7(?:6[46-9]|7[02-9]|8[34])|8(?:79|8[0-35789]|9[1-57-9]))\\d{4}", "\\d{8}", , , "22123456"], [, , 
"[37-9]\\d{7}", "\\d{8}", , , "91234567"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], "HN", 504, "00", , , , , , , , [[, "(\\d{4})(\\d{4})", "$1-$2", , "", "", 0]], , [, , "NA", "NA"], , , [, , "NA", "NA"], [, , "NA", "NA"], , , [, , "NA", "NA"]], "HR":[, [, , "[1-7]\\d{5,8}|[89]\\d{6,11}", "\\d{6,12}"], [, , "1\\d{7}|(?:2[0-3]|3[1-5]|4[02-47-9]|5[1-3])\\d{6}", "\\d{6,8}", , , "12345678"], [, , "9[1257-9]\\d{6,10}", "\\d{8,12}", , , "912345678"], [, 
, "80[01]\\d{4,7}", "\\d{7,10}", , , "8001234567"], [, , "6(?:[09]\\d{7}|[145]\\d{4,7})", "\\d{6,9}", , , "611234"], [, , "NA", "NA"], [, , "7[45]\\d{4,7}", "\\d{6,9}", , , "741234567"], [, , "NA", "NA"], "HR", 385, "00", "0", , , "0", , , , [[, "(1)(\\d{4})(\\d{3})", "$1 $2 $3", ["1"], "0$1", "", 0], [, "(6[09])(\\d{4})(\\d{3})", "$1 $2 $3", ["6[09]"], "0$1", "", 0], [, "(62)(\\d{3})(\\d{3,4})", "$1 $2 $3", ["62"], "0$1", "", 0], [, "([2-5]\\d)(\\d{3})(\\d{3})", "$1 $2 $3", ["[2-5]"], "0$1", "", 
0], [, "(9\\d)(\\d{3})(\\d{3,4})", "$1 $2 $3", ["9"], "0$1", "", 0], [, "(9\\d)(\\d{4})(\\d{4})", "$1 $2 $3", ["9"], "0$1", "", 0], [, "(9\\d)(\\d{3,4})(\\d{3})(\\d{3})", "$1 $2 $3 $4", ["9"], "0$1", "", 0], [, "(\\d{2})(\\d{2})(\\d{2,3})", "$1 $2 $3", ["6[145]|7"], "0$1", "", 0], [, "(\\d{2})(\\d{3,4})(\\d{3})", "$1 $2 $3", ["6[145]|7"], "0$1", "", 0], [, "(80[01])(\\d{2})(\\d{2,3})", "$1 $2 $3", ["8"], "0$1", "", 0], [, "(80[01])(\\d{3,4})(\\d{3})", "$1 $2 $3", ["8"], "0$1", "", 0]], , [, , "NA", 
"NA"], , , [, , "NA", "NA"], [, , "62\\d{6,7}", "\\d{8,9}", , , "62123456"], , , [, , "NA", "NA"]], "HT":[, [, , "[2-489]\\d{7}", "\\d{8}"], [, , "2(?:[24]\\d|5[1-5]|94)\\d{5}", "\\d{8}", , , "22453300"], [, , "(?:3[1-9]|4\\d)\\d{6}", "\\d{8}", , , "34101234"], [, , "8\\d{7}", "\\d{8}", , , "80012345"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "98[89]\\d{5}", "\\d{8}", , , "98901234"], "HT", 509, "00", , , , , , , , [[, "(\\d{2})(\\d{2})(\\d{4})", "$1 $2 $3", , "", "", 0]], , [, 
, "NA", "NA"], , , [, , "NA", "NA"], [, , "NA", "NA"], , , [, , "NA", "NA"]], "HU":[, [, , "[1-9]\\d{7,8}", "\\d{6,9}"], [, , "(?:1\\d|2(?:1\\d|[2-9])|3[2-7]|4[24-9]|5[2-79]|6[23689]|7(?:1\\d|[2-9])|8[2-57-9]|9[2-69])\\d{6}", "\\d{6,9}", , , "12345678"], [, , "(?:[27]0|3[01])\\d{7}", "\\d{9}", , , "201234567"], [, , "80\\d{6}", "\\d{8}", , , "80123456"], [, , "9[01]\\d{6}", "\\d{8}", , , "90123456"], [, , "40\\d{6}", "\\d{8}", , , "40123456"], [, , "NA", "NA"], [, , "NA", "NA"], "HU", 36, "00", "06", 
, , "06", , , , [[, "(1)(\\d{3})(\\d{4})", "$1 $2 $3", ["1"], "($1)", "", 0], [, "(\\d{2})(\\d{3})(\\d{3,4})", "$1 $2 $3", ["[2-9]"], "($1)", "", 0]], , [, , "NA", "NA"], , , [, , "[48]0\\d{6}", "\\d{8}", , , "80123456"], [, , "NA", "NA"], , , [, , "NA", "NA"]], "ID":[, [, , "[1-9]\\d{6,10}", "\\d{5,11}"], [, , "2(?:1(?:14\\d{3}|[0-8]\\d{6,7}|500\\d{3}|9\\d{6})|2\\d{6,8}|4\\d{7,8})|(?:2(?:[35][1-4]|6[0-8]|7[1-6]|8\\d|9[1-8])|3(?:1|2[1-578]|3[1-68]|4[1-3]|5[1-8]|6[1-3568]|7[0-46]|8\\d)|4(?:0[1-589]|1[01347-9]|2[0-36-8]|3[0-24-68]|5[1-378]|6[1-5]|7[134]|8[1245])|5(?:1[1-35-9]|2[25-8]|3[1246-9]|4[1-3589]|5[1-46]|6[1-8])|6(?:19?|[25]\\d|3[1-469]|4[1-6])|7(?:1[1-9]|2[14-9]|[36]\\d|4[1-8]|5[1-9]|7[0-36-9])|9(?:0[12]|1[013-8]|2[0-479]|5[125-8]|6[23679]|7[159]|8[01346]))\\d{5,8}", 
"\\d{5,11}", , , "612345678"], [, , "(?:2(?:1(?:3[145]|4[01]|5[1-469]|60|8[0359]|9\\d)|2(?:88|9[1256])|3[1-4]9|4(?:36|91)|5(?:1[349]|[2-4]9)|6[0-7]9|7(?:[1-36]9|4[39])|8[1-5]9|9[1-48]9)|3(?:19[1-3]|2[12]9|3[13]9|4(?:1[69]|39)|5[14]9|6(?:1[69]|2[89])|709)|4[13]19|5(?:1(?:19|8[39])|4[129]9|6[12]9)|6(?:19[12]|2(?:[23]9|77))|7(?:1[13]9|2[15]9|419|5(?:1[89]|29)|6[15]9|7[178]9))\\d{5,6}|8[1-35-9]\\d{7,9}", "\\d{9,11}", , , "812345678"], [, , "177\\d{6,8}|800\\d{5,7}", "\\d{8,11}", , , "8001234567"], [, 
, "809\\d{7}", "\\d{10}", , , "8091234567"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], "ID", 62, "0(?:0[1789]|10(?:00|1[67]))", "0", , , "0", , , , [[, "(\\d{2})(\\d{5,8})", "$1 $2", ["2[124]|[36]1"], "(0$1)", "", 0], [, "(\\d{3})(\\d{5,8})", "$1 $2", ["[4579]|2[035-9]|[36][02-9]"], "(0$1)", "", 0], [, "(8\\d{2})(\\d{3,4})(\\d{3,4})", "$1-$2-$3", ["8[1-35-9]"], "0$1", "", 0], [, "(177)(\\d{6,8})", "$1 $2", ["1"], "0$1", "", 0], [, "(800)(\\d{5,7})", "$1 $2", ["800"], "0$1", "", 0], [, 
"(80\\d)(\\d)(\\d{3})(\\d{3})", "$1 $2 $3 $4", ["80[79]"], "0$1", "", 0]], , [, , "NA", "NA"], , , [, , "8071\\d{6}", "\\d{10}", , , "8071123456"], [, , "8071\\d{6}", "\\d{10}", , , "8071123456"], , , [, , "NA", "NA"]], "IE":[, [, , "[124-9]\\d{6,9}", "\\d{5,10}"], [, , "1\\d{7,8}|2(?:1\\d{6,7}|3\\d{7}|[24-9]\\d{5})|4(?:0[24]\\d{5}|[1-469]\\d{7}|5\\d{6}|7\\d{5}|8[0-46-9]\\d{7})|5(?:0[45]\\d{5}|1\\d{6}|[23679]\\d{7}|8\\d{5})|6(?:1\\d{6}|[237-9]\\d{5}|[4-6]\\d{7})|7[14]\\d{7}|9(?:1\\d{6}|[04]\\d{7}|[35-9]\\d{5})", 
"\\d{5,10}", , , "2212345"], [, , "8(?:22\\d{6}|[35-9]\\d{7})", "\\d{9}", , , "850123456"], [, , "1800\\d{6}", "\\d{10}", , , "1800123456"], [, , "15(?:1[2-8]|[2-8]0|9[089])\\d{6}", "\\d{10}", , , "1520123456"], [, , "18[59]0\\d{6}", "\\d{10}", , , "1850123456"], [, , "700\\d{6}", "\\d{9}", , , "700123456"], [, , "76\\d{7}", "\\d{9}", , , "761234567"], "IE", 353, "00", "0", , , "0", , , , [[, "(1)(\\d{3,4})(\\d{4})", "$1 $2 $3", ["1"], "(0$1)", "", 0], [, "(\\d{2})(\\d{5})", "$1 $2", ["2[24-9]|47|58|6[237-9]|9[35-9]"], 
"(0$1)", "", 0], [, "(\\d{3})(\\d{5})", "$1 $2", ["40[24]|50[45]"], "(0$1)", "", 0], [, "(48)(\\d{4})(\\d{4})", "$1 $2 $3", ["48"], "(0$1)", "", 0], [, "(818)(\\d{3})(\\d{3})", "$1 $2 $3", ["81"], "(0$1)", "", 0], [, "(\\d{2})(\\d{3})(\\d{3,4})", "$1 $2 $3", ["[24-69]|7[14]"], "(0$1)", "", 0], [, "([78]\\d)(\\d{3,4})(\\d{4})", "$1 $2 $3", ["76|8[35-9]"], "0$1", "", 0], [, "(700)(\\d{3})(\\d{3})", "$1 $2 $3", ["70"], "0$1", "", 0], [, "(\\d{4})(\\d{3})(\\d{3})", "$1 $2 $3", ["1(?:8[059]|5)", "1(?:8[059]0|5)"], 
"$1", "", 0]], , [, , "NA", "NA"], , , [, , "18[59]0\\d{6}", "\\d{10}", , , "1850123456"], [, , "818\\d{6}", "\\d{9}", , , "818123456"], , , [, , "8[35-9]\\d{8}", "\\d{10}", , , "8501234567"]], "IL":[, [, , "[17]\\d{6,9}|[2-589]\\d{3}(?:\\d{3,6})?|6\\d{3}", "\\d{4,10}"], [, , "[2-489]\\d{7}", "\\d{7,8}", , , "21234567"], [, , "5(?:[02347-9]\\d{2}|5(?:01|2[23]|3[34]|4[45]|5[5689]|6[67]|7[78]|8[89]|9[7-9])|6[2-9]\\d)\\d{5}", "\\d{9}", , , "501234567"], [, , "1(?:80[019]\\d{3}|255)\\d{3}", "\\d{7,10}", 
, , "1800123456"], [, , "1(?:212|(?:9(?:0[01]|19)|200)\\d{2})\\d{4}", "\\d{8,10}", , , "1919123456"], [, , "1700\\d{6}", "\\d{10}", , , "1700123456"], [, , "NA", "NA"], [, , "7(?:2[23]\\d|3[237]\\d|47\\d|6(?:5\\d|8[068])|7\\d{2}|8(?:33|55|77|81))\\d{5}", "\\d{9}", , , "771234567"], "IL", 972, "0(?:0|1[2-9])", "0", , , "0", , , , [[, "([2-489])(\\d{3})(\\d{4})", "$1-$2-$3", ["[2-489]"], "0$1", "", 0], [, "([57]\\d)(\\d{3})(\\d{4})", "$1-$2-$3", ["[57]"], "0$1", "", 0], [, "(1)([7-9]\\d{2})(\\d{3})(\\d{3})", 
"$1-$2-$3-$4", ["1[7-9]"], "$1", "", 0], [, "(1255)(\\d{3})", "$1-$2", ["125"], "$1", "", 0], [, "(1200)(\\d{3})(\\d{3})", "$1-$2-$3", ["120"], "$1", "", 0], [, "(1212)(\\d{2})(\\d{2})", "$1-$2-$3", ["121"], "$1", "", 0], [, "(1599)(\\d{6})", "$1-$2", ["15"], "$1", "", 0], [, "(\\d{4})", "*$1", ["[2-689]"], "$1", "", 0]], , [, , "NA", "NA"], , , [, , "1700\\d{6}|[2-689]\\d{3}", "\\d{4,10}", , , "1700123456"], [, , "[2-689]\\d{3}|1599\\d{6}", "\\d{4}(?:\\d{6})?", , , "1599123456"], , , [, , "NA", 
"NA"]], "IM":[, [, , "[135789]\\d{6,9}", "\\d{6,10}"], [, , "1624\\d{6}", "\\d{6,10}", , , "1624456789"], [, , "7[569]24\\d{6}", "\\d{10}", , , "7924123456"], [, , "808162\\d{4}", "\\d{10}", , , "8081624567"], [, , "(?:872299|90[0167]624)\\d{4}", "\\d{10}", , , "9016247890"], [, , "8(?:4(?:40[49]06|5624\\d)|70624\\d)\\d{3}", "\\d{10}", , , "8456247890"], [, , "70\\d{8}", "\\d{10}", , , "7012345678"], [, , "56\\d{8}", "\\d{10}", , , "5612345678"], "IM", 44, "00", "0", " x", , "0", , , , , , [, , "NA", 
"NA"], , , [, , "NA", "NA"], [, , "3(?:08162\\d|3\\d{5}|4(?:40[49]06|5624\\d)|7(?:0624\\d|2299\\d))\\d{3}|55\\d{8}", "\\d{10}", , , "5512345678"], , , [, , "NA", "NA"]], "IN":[, [, , "1\\d{7,12}|[2-9]\\d{9,10}", "\\d{6,13}"], [, , "(?:11|2[02]|33|4[04]|79)[2-7]\\d{7}|80[2-467]\\d{7}|(?:1(?:2[0-249]|3[0-25]|4[145]|[59][14]|6[014]|7[1257]|8[01346])|2(?:1[257]|3[013]|4[01]|5[0137]|6[0158]|78|8[1568]|9[14])|3(?:26|4[1-3]|5[34]|6[01489]|7[02-46]|8[159])|4(?:1[36]|2[1-47]|3[15]|5[12]|6[126-9]|7[0-24-9]|8[013-57]|9[014-7])|5(?:[136][25]|22|4[28]|5[12]|[78]1|9[15])|6(?:12|[2345]1|57|6[13]|7[14]|80)|7(?:12|2[14]|3[134]|4[47]|5[15]|[67]1|88)|8(?:16|2[014]|3[126]|6[136]|7[078]|8[34]|91))[2-7]\\d{6}|(?:(?:1(?:2[35-8]|3[346-9]|4[236-9]|[59][0235-9]|6[235-9]|7[34689]|8[257-9])|2(?:1[134689]|3[24-8]|4[2-8]|5[25689]|6[2-4679]|7[13-79]|8[2-479]|9[235-9])|3(?:01|1[79]|2[1-5]|4[25-8]|5[125689]|6[235-7]|7[157-9]|8[2-467])|4(?:1[14578]|2[5689]|3[2-467]|5[4-7]|6[35]|73|8[2689]|9[2389])|5(?:[16][146-9]|2[14-8]|3[1346]|4[14-69]|5[46]|7[2-4]|8[2-8]|9[246])|6(?:1[1358]|2[2457]|3[2-4]|4[235-7]|[57][2-689]|6[24-578]|8[1-6])|8(?:1[1357-9]|2[235-8]|3[03-57-9]|4[0-24-9]|5\\d|6[2457-9]|7[1-6]|8[1256]|9[2-4]))\\d|7(?:(?:1[013-9]|2[0235-9]|3[2679]|4[1-35689]|5[2-46-9]|[67][02-9]|9\\d)\\d|8(?:2[0-6]|[013-8]\\d)))[2-7]\\d{5}", 
"\\d{6,10}", , , "1123456789"], [, , "(?:7(?:0(?:2[2-9]|[3-8]\\d|9[0-4])|2(?:0[04-9]|5[09]|7[5-8]|9[389])|3(?:0[1-9]|[58]\\d|7[3679]|9[689])|4(?:0[1-9]|1[15-9]|[29][89]|39|8[389])|5(?:[034678]\\d|2[03-9]|5[017-9]|9[7-9])|6(?:0[0127]|1[0-257-9]|2[0-4]|3[19]|5[4589]|[6-9]\\d)|7(?:0[2-9]|[1-79]\\d|8[1-9])|8(?:[0-7]\\d|9[013-9]))|8(?:0(?:[01589]\\d|6[67])|1(?:[02-589]\\d|1[0135-9]|7[0-79])|2(?:[236-9]\\d|5[1-9])|3(?:[0357-9]\\d|4[1-9])|[45]\\d{2}|6[02457-9]\\d|7[1-69]\\d|8(?:[0-26-9]\\d|44|5[2-9])|9(?:[035-9]\\d|2[2-9]|4[0-8]))|9\\d{3})\\d{6}", 
"\\d{10}", , , "9123456789"], [, , "1(?:600\\d{6}|80(?:0\\d{4,8}|3\\d{9}))", "\\d{8,13}", , , "1800123456"], [, , "186[12]\\d{9}", "\\d{13}", , , "1861123456789"], [, , "1860\\d{7}", "\\d{11}", , , "18603451234"], [, , "NA", "NA"], [, , "NA", "NA"], "IN", 91, "00", "0", , , "0", , , , [[, "(\\d{5})(\\d{5})", "$1 $2", ["7(?:0[2-9]|2[0579]|3[057-9]|4[0-389]|6[0-35-9]|[57]|8[0-79])|8(?:0[015689]|1[0-57-9]|2[2356-9]|3[0-57-9]|[45]|6[02457-9]|7[1-69]|8[0124-9]|9[02-9])|9", "7(?:0(?:2[2-9]|[3-8]|9[0-4])|2(?:0[04-9]|5[09]|7[5-8]|9[389])|3(?:0[1-9]|[58]|7[3679]|9[689])|4(?:0[1-9]|1[15-9]|[29][89]|39|8[389])|5(?:[034678]|2[03-9]|5[017-9]|9[7-9])|6(?:0[0-27]|1[0-257-9]|2[0-4]|3[19]|5[4589]|[6-9])|7(?:0[2-9]|[1-79]|8[1-9])|8(?:[0-7]|9[013-9]))|8(?:0(?:[01589]|6[67])|1(?:[02-589]|1[0135-9]|7[0-79])|2(?:[236-9]|5[1-9])|3(?:[0357-9]|4[1-9])|[45]|6[02457-9]|7[1-69]|8(?:[0-26-9]|44|5[2-9])|9(?:[035-9]|2[2-9]|4[0-8]))|9"], 
"0$1", "", 1], [, "(\\d{2})(\\d{4})(\\d{4})", "$1 $2 $3", ["11|2[02]|33|4[04]|79|80[2-46]"], "0$1", "", 1], [, "(\\d{3})(\\d{3})(\\d{4})", "$1 $2 $3", ["1(?:2[0-249]|3[0-25]|4[145]|[569][14]|7[1257]|8[1346]|[68][1-9])|2(?:1[257]|3[013]|4[01]|5[0137]|6[0158]|78|8[1568]|9[14])|3(?:26|4[1-3]|5[34]|6[01489]|7[02-46]|8[159])|4(?:1[36]|2[1-47]|3[15]|5[12]|6[126-9]|7[0-24-9]|8[013-57]|9[014-7])|5(?:[136][25]|22|4[28]|5[12]|[78]1|9[15])|6(?:12|[2345]1|57|6[13]|7[14]|80)"], "0$1", "", 1], [, "(\\d{3})(\\d{3})(\\d{4})", 
"$1 $2 $3", ["7(?:12|2[14]|3[134]|4[47]|5[15]|[67]1|88)", "7(?:12|2[14]|3[134]|4[47]|5(?:1|5[2-6])|[67]1|88)"], "0$1", "", 1], [, "(\\d{3})(\\d{3})(\\d{4})", "$1 $2 $3", ["8(?:16|2[014]|3[126]|6[136]|7[078]|8[34]|91)"], "0$1", "", 1], [, "(\\d{4})(\\d{3})(\\d{3})", "$1 $2 $3", ["1(?:[23579]|[468][1-9])|[2-8]"], "0$1", "", 1], [, "(1600)(\\d{2})(\\d{4})", "$1 $2 $3", ["160", "1600"], "$1", "", 1], [, "(1800)(\\d{4,5})", "$1 $2", ["180", "1800"], "$1", "", 1], [, "(18[06]0)(\\d{2,4})(\\d{4})", "$1 $2 $3", 
["18[06]", "18[06]0"], "$1", "", 1], [, "(140)(\\d{3})(\\d{4})", "$1 $2 $3", ["140"], "$1", "", 1], [, "(\\d{4})(\\d{3})(\\d{4})(\\d{2})", "$1 $2 $3 $4", ["18[06]", "18(?:03|6[12])"], "$1", "", 1]], , [, , "NA", "NA"], , , [, , "1(?:600\\d{6}|8(?:0(?:0\\d{4,8}|3\\d{9})|6(?:0\\d{7}|[12]\\d{9})))", "\\d{8,13}", , , "1800123456"], [, , "140\\d{7}", "\\d{10}", , , "1409305260"], , , [, , "NA", "NA"]], "IO":[, [, , "3\\d{6}", "\\d{7}"], [, , "37\\d{5}", "\\d{7}", , , "3709100"], [, , "38\\d{5}", "\\d{7}", 
, , "3801234"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], "IO", 246, "00", , , , , , , , [[, "(\\d{3})(\\d{4})", "$1 $2", , "", "", 0]], , [, , "NA", "NA"], , , [, , "NA", "NA"], [, , "NA", "NA"], , , [, , "NA", "NA"]], "IQ":[, [, , "[1-7]\\d{7,9}", "\\d{6,10}"], [, , "1\\d{7}|(?:2[13-5]|3[02367]|4[023]|5[03]|6[026])\\d{6,7}", "\\d{6,9}", , , "12345678"], [, , "7[3-9]\\d{8}", "\\d{10}", , , "7912345678"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", 
"NA"], [, , "NA", "NA"], [, , "NA", "NA"], "IQ", 964, "00", "0", , , "0", , , , [[, "(1)(\\d{3})(\\d{4})", "$1 $2 $3", ["1"], "0$1", "", 0], [, "([2-6]\\d)(\\d{3})(\\d{3,4})", "$1 $2 $3", ["[2-6]"], "0$1", "", 0], [, "(7\\d{2})(\\d{3})(\\d{4})", "$1 $2 $3", ["7"], "0$1", "", 0]], , [, , "NA", "NA"], , , [, , "NA", "NA"], [, , "NA", "NA"], , , [, , "NA", "NA"]], "IR":[, [, , "[1-8]\\d{9}|9(?:[0-4]\\d{8}|9\\d{2,8})", "\\d{4,10}"], [, , "(?:1[137]|2[13-68]|3[1458]|4[145]|5[146-8]|6[146]|7[1467]|8[13467])\\d{8}", 
"\\d{10}", , , "2123456789"], [, , "9(?:0[12]|[1-3]\\d)\\d{7}", "\\d{10}", , , "9123456789"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "(?:[2-6]0\\d|993)\\d{7}", "\\d{10}", , , "9932123456"], "IR", 98, "00", "0", , , "0", , , , [[, "(21)(\\d{3,5})", "$1 $2", ["21"], "0$1", "", 0], [, "(\\d{2})(\\d{4})(\\d{4})", "$1 $2 $3", ["[1-8]"], "0$1", "", 0], [, "(\\d{3})(\\d{3})(\\d{3,4})", "$1 $2 $3", ["9"], "0$1", "", 0], [, "(\\d{3})(\\d{2})(\\d{2,3})", "$1 $2 $3", ["9"], 
"0$1", "", 0], [, "(\\d{3})(\\d{3})", "$1 $2", ["9"], "0$1", "", 0]], , [, , "943\\d{7}", "\\d{10}", , , "9432123456"], , , [, , "NA", "NA"], [, , "9990\\d{0,6}", "\\d{4,10}", , , "9990123456"], , , [, , "NA", "NA"]], "IS":[, [, , "[4-9]\\d{6}|38\\d{7}", "\\d{7,9}"], [, , "(?:4(?:1[0-24-6]|2[0-7]|[37][0-8]|4[0-245]|5[0-3568]|6\\d|8[0-36-8])|5(?:05|[156]\\d|2[02578]|3[013-7]|4[03-7]|7[0-2578]|8[0-35-9]|9[013-689])|87[23])\\d{4}", "\\d{7}", , , "4101234"], [, , "38[589]\\d{6}|(?:6(?:1[1-8]|3[089]|4[0167]|5[019]|[67][0-69]|9\\d)|7(?:5[057]|7\\d|8[0-36-8])|8(?:2[0-5]|3[0-4]|[469]\\d|5[1-9]))\\d{4}", 
"\\d{7,9}", , , "6111234"], [, , "800\\d{4}", "\\d{7}", , , "8001234"], [, , "90\\d{5}", "\\d{7}", , , "9011234"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "49\\d{5}", "\\d{7}", , , "4921234"], "IS", 354, "00", , , , , , , , [[, "(\\d{3})(\\d{4})", "$1 $2", ["[4-9]"], "", "", 0], [, "(3\\d{2})(\\d{3})(\\d{3})", "$1 $2 $3", ["3"], "", "", 0]], , [, , "NA", "NA"], , , [, , "NA", "NA"], [, , "NA", "NA"], , , [, , "(?:6(?:2[0-8]|49|8\\d)|87[0189]|95[48])\\d{4}", "\\d{7}", , , "6201234"]], "IT":[, [, 
, "[01589]\\d{5,10}|3(?:[12457-9]\\d{8}|[36]\\d{7,9})", "\\d{6,11}"], [, , "0(?:[26]\\d{4,9}|(?:1(?:[0159]\\d|[27][1-5]|31|4[1-4]|6[1356]|8[2-57])|3(?:[0159]\\d|2[1-4]|3[12]|[48][1-6]|6[2-59]|7[1-7])|4(?:[0159]\\d|[23][1-9]|4[245]|6[1-5]|7[1-4]|81)|5(?:[0159]\\d|2[1-5]|3[2-6]|4[1-79]|6[4-6]|7[1-578]|8[3-8])|7(?:[0159]\\d|2[12]|3[1-7]|4[2346]|6[13569]|7[13-6]|8[1-59])|8(?:[0159]\\d|2[34578]|3[1-356]|[6-8][1-5])|9(?:[0159]\\d|[238][1-5]|4[12]|6[1-8]|7[1-6]))\\d{2,7})", "\\d{6,11}", , , "0212345678"], 
[, , "3(?:[12457-9]\\d{8}|6\\d{7,8}|3\\d{7,9})", "\\d{9,11}", , , "3123456789"], [, , "80(?:0\\d{6}|3\\d{3})", "\\d{6,9}", , , "800123456"], [, , "0878\\d{5}|1(?:44|6[346])\\d{6}|89(?:2\\d{3}|4(?:[0-4]\\d{2}|[5-9]\\d{4})|5(?:[0-4]\\d{2}|[5-9]\\d{6})|9\\d{6})", "\\d{6,10}", , , "899123456"], [, , "84(?:[08]\\d{6}|[17]\\d{3})", "\\d{6,9}", , , "848123456"], [, , "1(?:78\\d|99)\\d{6}", "\\d{9,10}", , , "1781234567"], [, , "55\\d{8}", "\\d{10}", , , "5512345678"], "IT", 39, "00", , , , , , , , [[, "(\\d{2})(\\d{3,4})(\\d{4})", 
"$1 $2 $3", ["0[26]|55"], "", "", 0], [, "(0[26])(\\d{4})(\\d{5})", "$1 $2 $3", ["0[26]"], "", "", 0], [, "(0[26])(\\d{4,6})", "$1 $2", ["0[26]"], "", "", 0], [, "(0\\d{2})(\\d{3,4})(\\d{4})", "$1 $2 $3", ["0[13-57-9][0159]"], "", "", 0], [, "(\\d{3})(\\d{3,6})", "$1 $2", ["0[13-57-9][0159]|8(?:03|4[17]|9[245])", "0[13-57-9][0159]|8(?:03|4[17]|9(?:2|[45][0-4]))"], "", "", 0], [, "(0\\d{3})(\\d{3})(\\d{4})", "$1 $2 $3", ["0[13-57-9][2-46-8]"], "", "", 0], [, "(0\\d{3})(\\d{2,6})", "$1 $2", ["0[13-57-9][2-46-8]"], 
"", "", 0], [, "(\\d{3})(\\d{3})(\\d{3,4})", "$1 $2 $3", ["[13]|8(?:00|4[08]|9[59])", "[13]|8(?:00|4[08]|9(?:5[5-9]|9))"], "", "", 0], [, "(\\d{4})(\\d{4})", "$1 $2", ["894", "894[5-9]"], "", "", 0], [, "(\\d{3})(\\d{4})(\\d{4})", "$1 $2 $3", ["3"], "", "", 0]], , [, , "NA", "NA"], , , [, , "848\\d{6}", "\\d{9}", , , "848123456"], [, , "NA", "NA"], 1, , [, , "NA", "NA"]], "JE":[, [, , "[135789]\\d{6,9}", "\\d{6,10}"], [, , "1534\\d{6}", "\\d{6,10}", , , "1534456789"], [, , "7(?:509|7(?:00|97)|829|937)\\d{6}", 
"\\d{10}", , , "7797123456"], [, , "80(?:07(?:35|81)|8901)\\d{4}", "\\d{10}", , , "8007354567"], [, , "(?:871206|90(?:066[59]|1810|71(?:07|55)))\\d{4}", "\\d{10}", , , "9018105678"], [, , "8(?:4(?:4(?:4(?:05|42|69)|703)|5(?:041|800))|70002)\\d{4}", "\\d{10}", , , "8447034567"], [, , "701511\\d{4}", "\\d{10}", , , "7015115678"], [, , "56\\d{8}", "\\d{10}", , , "5612345678"], "JE", 44, "00", "0", " x", , "0", , , , , , [, , "76(?:0[012]|2[356]|4[0134]|5[49]|6[0-369]|77|81|9[39])\\d{6}", "\\d{10}", 
, , "7640123456"], , , [, , "NA", "NA"], [, , "3(?:0(?:07(?:35|81)|8901)|3\\d{4}|4(?:4(?:4(?:05|42|69)|703)|5(?:041|800))|7(?:0002|1206))\\d{4}|55\\d{8}", "\\d{10}", , , "5512345678"], , , [, , "NA", "NA"]], "JM":[, [, , "[589]\\d{9}", "\\d{7}(?:\\d{3})?"], [, , "876(?:5(?:0[12]|1[0-468]|2[35]|63)|6(?:0[1-3579]|1[027-9]|[23]\\d|40|5[06]|6[2-589]|7[05]|8[04]|9[4-9])|7(?:0[2-689]|[1-6]\\d|8[056]|9[45])|9(?:0[1-8]|1[02378]|[2-8]\\d|9[2-468]))\\d{4}", "\\d{7}(?:\\d{3})?", , , "8765123456"], [, , "876(?:2[1789]\\d|[348]\\d{2}|5(?:08|27|6[0-24-9]|[3-578]\\d)|7(?:0[07]|7\\d|8[1-47-9]|9[0-36-9])|9(?:[01]9|9[0579]))\\d{4}", 
"\\d{10}", , , "8762101234"], [, , "8(?:00|44|55|66|77|88)[2-9]\\d{6}", "\\d{10}", , , "8002123456"], [, , "900[2-9]\\d{6}", "\\d{10}", , , "9002123456"], [, , "NA", "NA"], [, , "5(?:00|33|44|66|77)[2-9]\\d{6}", "\\d{10}", , , "5002345678"], [, , "NA", "NA"], "JM", 1, "011", "1", , , "1", , , , , , [, , "NA", "NA"], , "876", [, , "NA", "NA"], [, , "NA", "NA"], , , [, , "NA", "NA"]], "JO":[, [, , "[235-9]\\d{7,8}", "\\d{7,9}"], [, , "(?:2(?:6(?:2[0-35-9]|3[0-57-8]|4[24-7]|5[0-24-8]|[6-8][02]|9[0-2])|7(?:0[1-79]|10|2[014-7]|3[0-689]|4[019]|5[0-3578]))|32(?:0[1-69]|1[1-35-7]|2[024-7]|3\\d|4[0-2]|[57][02]|60)|53(?:0[0-2]|[13][02]|2[0-59]|49|5[0-35-9]|6[15]|7[45]|8[1-6]|9[0-36-9])|6(?:2[50]0|300|4(?:0[0125]|1[2-7]|2[0569]|[38][07-9]|4[025689]|6[0-589]|7\\d|9[0-2])|5(?:[01][056]|2[034]|3[0-57-9]|4[17-8]|5[0-69]|6[0-35-9]|7[1-379]|8[0-68]|9[02-39]))|87(?:[02]0|7[08]|9[09]))\\d{4}", 
"\\d{7,8}", , , "62001234"], [, , "7(?:55|7[25-9]|8[05-9]|9[015-9])\\d{6}", "\\d{9}", , , "790123456"], [, , "80\\d{6}", "\\d{8}", , , "80012345"], [, , "900\\d{5}", "\\d{8}", , , "90012345"], [, , "85\\d{6}", "\\d{8}", , , "85012345"], [, , "70\\d{7}", "\\d{9}", , , "700123456"], [, , "NA", "NA"], "JO", 962, "00", "0", , , "0", , , , [[, "(\\d)(\\d{3})(\\d{4})", "$1 $2 $3", ["[2356]|87"], "(0$1)", "", 0], [, "(7)(\\d{4})(\\d{4})", "$1 $2 $3", ["7[457-9]"], "0$1", "", 0], [, "(\\d{3})(\\d{5,6})", 
"$1 $2", ["70|8[0158]|9"], "0$1", "", 0]], , [, , "74(?:66|77)\\d{5}", "\\d{9}", , , "746612345"], , , [, , "NA", "NA"], [, , "8(?:10|8\\d)\\d{5}", "\\d{8}", , , "88101234"], , , [, , "NA", "NA"]], "JP":[, [, , "[1-9]\\d{8,9}|00(?:[36]\\d{7,14}|7\\d{5,7}|8\\d{7})", "\\d{8,17}"], [, , "(?:1(?:1[235-8]|2[3-6]|3[3-9]|4[2-6]|[58][2-8]|6[2-7]|7[2-9]|9[1-9])|2[2-9]\\d|[36][1-9]\\d|4(?:6[02-8]|[2-578]\\d|9[2-59])|5(?:6[1-9]|7[2-8]|[2-589]\\d)|7(?:3[4-9]|4[02-9]|[25-9]\\d)|8(?:3[2-9]|4[5-9]|5[1-9]|8[03-9]|[2679]\\d)|9(?:[679][1-9]|[2-58]\\d))\\d{6}", 
"\\d{9}", , , "312345678"], [, , "[7-9]0[1-9]\\d{7}", "\\d{10}", , , "7012345678"], [, , "120\\d{6}|800\\d{7}|00(?:37\\d{6,13}|66\\d{6,13}|777(?:[01]\\d{2}|5\\d{3}|8\\d{4})|882[1245]\\d{4})", "\\d{8,17}", , , "120123456"], [, , "990\\d{6}", "\\d{9}", , , "990123456"], [, , "NA", "NA"], [, , "60\\d{7}", "\\d{9}", , , "601234567"], [, , "50[1-9]\\d{7}", "\\d{10}", , , "5012345678"], "JP", 81, "010", "0", , , "0", , , , [[, "(\\d{3})(\\d{3})(\\d{3})", "$1-$2-$3", ["(?:12|57|99)0"], "0$1", "", 0], [, 
"(\\d{3})(\\d{3})(\\d{4})", "$1-$2-$3", ["800"], "0$1", "", 0], [, "(\\d{4})(\\d{4})", "$1-$2", ["0077"], "$1", "", 0], [, "(\\d{4})(\\d{2})(\\d{3,4})", "$1-$2-$3", ["0077"], "$1", "", 0], [, "(\\d{4})(\\d{2})(\\d{4})", "$1-$2-$3", ["0088"], "$1", "", 0], [, "(\\d{4})(\\d{3})(\\d{3,4})", "$1-$2-$3", ["00(?:37|66)"], "$1", "", 0], [, "(\\d{4})(\\d{4})(\\d{4,5})", "$1-$2-$3", ["00(?:37|66)"], "$1", "", 0], [, "(\\d{4})(\\d{5})(\\d{5,6})", "$1-$2-$3", ["00(?:37|66)"], "$1", "", 0], [, "(\\d{4})(\\d{6})(\\d{6,7})", 
"$1-$2-$3", ["00(?:37|66)"], "$1", "", 0], [, "(\\d{2})(\\d{4})(\\d{4})", "$1-$2-$3", ["[2579]0|80[1-9]"], "0$1", "", 0], [, "(\\d{4})(\\d)(\\d{4})", "$1-$2-$3", ["1(?:26|3[79]|4[56]|5[4-68]|6[3-5])|5(?:76|97)|499|746|8(?:3[89]|63|47|51)|9(?:49|80|9[16])", "1(?:267|3(?:7[247]|9[278])|4(?:5[67]|66)|5(?:47|58|64|8[67])|6(?:3[245]|48|5[4-68]))|5(?:76|97)9|499[2468]|7468|8(?:3(?:8[78]|96)|636|477|51[24])|9(?:496|802|9(?:1[23]|69))", "1(?:267|3(?:7[247]|9[278])|4(?:5[67]|66)|5(?:47|58|64|8[67])|6(?:3[245]|48|5[4-68]))|5(?:769|979[2-69])|499[2468]|7468|8(?:3(?:8[78]|96[2457-9])|636[2-57-9]|477|51[24])|9(?:496|802|9(?:1[23]|69))"], 
"0$1", "", 0], [, "(\\d{3})(\\d{2})(\\d{4})", "$1-$2-$3", ["1(?:2[3-6]|3[3-9]|4[2-6]|5[2-8]|[68][2-7]|7[2-689]|9[1-578])|2(?:2[03-689]|3[3-58]|4[0-468]|5[04-8]|6[013-8]|7[06-9]|8[02-57-9]|9[13])|4(?:2[28]|3[689]|6[035-7]|7[05689]|80|9[3-5])|5(?:3[1-36-9]|4[4578]|5[013-8]|6[1-9]|7[2-8]|8[14-7]|9[4-9])|7(?:2[15]|3[5-9]|4[02-9]|6[135-8]|7[0-4689]|9[014-9])|8(?:2[49]|3[3-8]|4[5-8]|5[2-9]|6[35-9]|7[579]|8[03-579]|9[2-8])|9(?:[23]0|4[02-46-9]|5[024-79]|6[4-9]|7[2-47-9]|8[02-7]|9[3-7])", "1(?:2[3-6]|3[3-9]|4[2-6]|5(?:[236-8]|[45][2-69])|[68][2-7]|7[2-689]|9[1-578])|2(?:2(?:[04-689]|3[23])|3[3-58]|4[0-468]|5(?:5[78]|7[2-4]|[0468][2-9])|6(?:[0135-8]|4[2-5])|7(?:[0679]|8[2-7])|8(?:[024578]|3[25-9]|9[6-9])|9(?:11|3[2-4]))|4(?:2(?:2[2-9]|8[237-9])|3[689]|6[035-7]|7(?:[059][2-8]|[68])|80|9[3-5])|5(?:3[1-36-9]|4[4578]|5[013-8]|6[1-9]|7[2-8]|8[14-7]|9(?:[89][2-8]|[4-7]))|7(?:2[15]|3[5-9]|4[02-9]|6[135-8]|7[0-4689]|9(?:[017-9]|4[6-8]|5[2-478]|6[2-589]))|8(?:2(?:4[4-8]|9[2-8])|3(?:7[2-6]|[3-6][2-9]|8[2-5])|4[5-8]|5[2-9]|6(?:[37]|5[4-7]|6[2-9]|8[2-8]|9[236-9])|7[579]|8[03-579]|9[2-8])|9(?:[23]0|4[02-46-9]|5[024-79]|6[4-9]|7[2-47-9]|8[02-7]|9(?:3[34]|[4-7]))", 
"1(?:2[3-6]|3[3-9]|4[2-6]|5(?:[236-8]|[45][2-69])|[68][2-7]|7[2-689]|9[1-578])|2(?:2(?:[04-689]|3[23])|3[3-58]|4[0-468]|5(?:5[78]|7[2-4]|[0468][2-9])|6(?:[0135-8]|4[2-5])|7(?:[0679]|8[2-7])|8(?:[024578]|3[25-9]|9[6-9])|9(?:11|3[2-4]))|4(?:2(?:2[2-9]|8[237-9])|3[689]|6[035-7]|7(?:[059][2-8]|[68])|80|9[3-5])|5(?:3[1-36-9]|4[4578]|5[013-8]|6[1-9]|7[2-8]|8[14-7]|9(?:[89][2-8]|[4-7]))|7(?:2[15]|3[5-9]|4[02-9]|6[135-8]|7[0-4689]|9(?:[017-9]|4[6-8]|5[2-478]|6[2-589]))|8(?:2(?:4[4-8]|9(?:[3578]|20|4[04-9]|6[56]))|3(?:7(?:[2-5]|6[0-59])|[3-6][2-9]|8[2-5])|4[5-8]|5[2-9]|6(?:[37]|5(?:[467]|5[014-9])|6(?:[2-8]|9[02-69])|8[2-8]|9(?:[236-8]|9[23]))|7[579]|8[03-579]|9[2-8])|9(?:[23]0|4[02-46-9]|5[024-79]|6[4-9]|7[2-47-9]|8[02-7]|9(?:3(?:3[02-9]|4[0-24689])|4[2-69]|[5-7]))", 
"1(?:2[3-6]|3[3-9]|4[2-6]|5(?:[236-8]|[45][2-69])|[68][2-7]|7[2-689]|9[1-578])|2(?:2(?:[04-689]|3[23])|3[3-58]|4[0-468]|5(?:5[78]|7[2-4]|[0468][2-9])|6(?:[0135-8]|4[2-5])|7(?:[0679]|8[2-7])|8(?:[024578]|3[25-9]|9[6-9])|9(?:11|3[2-4]))|4(?:2(?:2[2-9]|8[237-9])|3[689]|6[035-7]|7(?:[059][2-8]|[68])|80|9[3-5])|5(?:3[1-36-9]|4[4578]|5[013-8]|6[1-9]|7[2-8]|8[14-7]|9(?:[89][2-8]|[4-7]))|7(?:2[15]|3[5-9]|4[02-9]|6[135-8]|7[0-4689]|9(?:[017-9]|4[6-8]|5[2-478]|6[2-589]))|8(?:2(?:4[4-8]|9(?:[3578]|20|4[04-9]|6(?:5[25]|60)))|3(?:7(?:[2-5]|6[0-59])|[3-6][2-9]|8[2-5])|4[5-8]|5[2-9]|6(?:[37]|5(?:[467]|5[014-9])|6(?:[2-8]|9[02-69])|8[2-8]|9(?:[236-8]|9[23]))|7[579]|8[03-579]|9[2-8])|9(?:[23]0|4[02-46-9]|5[024-79]|6[4-9]|7[2-47-9]|8[02-7]|9(?:3(?:3[02-9]|4[0-24689])|4[2-69]|[5-7]))"], 
"0$1", "", 0], [, "(\\d{2})(\\d{3})(\\d{4})", "$1-$2-$3", ["1|2(?:2[37]|5[5-9]|64|78|8[39]|91)|4(?:2[2689]|64|7[347])|5(?:[2-589]|39)|60|8(?:[46-9]|3[279]|2[124589])|9(?:[235-8]|93)", "1|2(?:2[37]|5(?:[57]|[68]0|9[19])|64|78|8[39]|917)|4(?:2(?:[68]|20|9[178])|64|7[347])|5(?:[2-589]|39[67])|60|8(?:[46-9]|3[279]|2[124589])|9(?:[235-8]|93[34])", "1|2(?:2[37]|5(?:[57]|[68]0|9(?:17|99))|64|78|8[39]|917)|4(?:2(?:[68]|20|9[178])|64|7[347])|5(?:[2-589]|39[67])|60|8(?:[46-9]|3[279]|2[124589])|9(?:[235-8]|93(?:31|4))"], 
"0$1", "", 0], [, "(\\d{3})(\\d{2})(\\d{4})", "$1-$2-$3", ["2(?:9[14-79]|74|[34]7|[56]9)|82|993"], "0$1", "", 0], [, "(\\d)(\\d{4})(\\d{4})", "$1-$2-$3", ["3|4(?:2[09]|7[01])|6[1-9]"], "0$1", "", 0], [, "(\\d{2})(\\d{3})(\\d{4})", "$1-$2-$3", ["[2479][1-9]"], "0$1", "", 0]], [[, "(\\d{3})(\\d{3})(\\d{3})", "$1-$2-$3", ["(?:12|57|99)0"], "0$1", "", 0], [, "(\\d{3})(\\d{3})(\\d{4})", "$1-$2-$3", ["800"], "0$1", "", 0], [, "(\\d{2})(\\d{4})(\\d{4})", "$1-$2-$3", ["[2579]0|80[1-9]"], "0$1", "", 0], [, 
"(\\d{4})(\\d)(\\d{4})", "$1-$2-$3", ["1(?:26|3[79]|4[56]|5[4-68]|6[3-5])|5(?:76|97)|499|746|8(?:3[89]|63|47|51)|9(?:49|80|9[16])", "1(?:267|3(?:7[247]|9[278])|4(?:5[67]|66)|5(?:47|58|64|8[67])|6(?:3[245]|48|5[4-68]))|5(?:76|97)9|499[2468]|7468|8(?:3(?:8[78]|96)|636|477|51[24])|9(?:496|802|9(?:1[23]|69))", "1(?:267|3(?:7[247]|9[278])|4(?:5[67]|66)|5(?:47|58|64|8[67])|6(?:3[245]|48|5[4-68]))|5(?:769|979[2-69])|499[2468]|7468|8(?:3(?:8[78]|96[2457-9])|636[2-57-9]|477|51[24])|9(?:496|802|9(?:1[23]|69))"], 
"0$1", "", 0], [, "(\\d{3})(\\d{2})(\\d{4})", "$1-$2-$3", ["1(?:2[3-6]|3[3-9]|4[2-6]|5[2-8]|[68][2-7]|7[2-689]|9[1-578])|2(?:2[03-689]|3[3-58]|4[0-468]|5[04-8]|6[013-8]|7[06-9]|8[02-57-9]|9[13])|4(?:2[28]|3[689]|6[035-7]|7[05689]|80|9[3-5])|5(?:3[1-36-9]|4[4578]|5[013-8]|6[1-9]|7[2-8]|8[14-7]|9[4-9])|7(?:2[15]|3[5-9]|4[02-9]|6[135-8]|7[0-4689]|9[014-9])|8(?:2[49]|3[3-8]|4[5-8]|5[2-9]|6[35-9]|7[579]|8[03-579]|9[2-8])|9(?:[23]0|4[02-46-9]|5[024-79]|6[4-9]|7[2-47-9]|8[02-7]|9[3-7])", "1(?:2[3-6]|3[3-9]|4[2-6]|5(?:[236-8]|[45][2-69])|[68][2-7]|7[2-689]|9[1-578])|2(?:2(?:[04-689]|3[23])|3[3-58]|4[0-468]|5(?:5[78]|7[2-4]|[0468][2-9])|6(?:[0135-8]|4[2-5])|7(?:[0679]|8[2-7])|8(?:[024578]|3[25-9]|9[6-9])|9(?:11|3[2-4]))|4(?:2(?:2[2-9]|8[237-9])|3[689]|6[035-7]|7(?:[059][2-8]|[68])|80|9[3-5])|5(?:3[1-36-9]|4[4578]|5[013-8]|6[1-9]|7[2-8]|8[14-7]|9(?:[89][2-8]|[4-7]))|7(?:2[15]|3[5-9]|4[02-9]|6[135-8]|7[0-4689]|9(?:[017-9]|4[6-8]|5[2-478]|6[2-589]))|8(?:2(?:4[4-8]|9[2-8])|3(?:7[2-6]|[3-6][2-9]|8[2-5])|4[5-8]|5[2-9]|6(?:[37]|5[4-7]|6[2-9]|8[2-8]|9[236-9])|7[579]|8[03-579]|9[2-8])|9(?:[23]0|4[02-46-9]|5[024-79]|6[4-9]|7[2-47-9]|8[02-7]|9(?:3[34]|[4-7]))", 
"1(?:2[3-6]|3[3-9]|4[2-6]|5(?:[236-8]|[45][2-69])|[68][2-7]|7[2-689]|9[1-578])|2(?:2(?:[04-689]|3[23])|3[3-58]|4[0-468]|5(?:5[78]|7[2-4]|[0468][2-9])|6(?:[0135-8]|4[2-5])|7(?:[0679]|8[2-7])|8(?:[024578]|3[25-9]|9[6-9])|9(?:11|3[2-4]))|4(?:2(?:2[2-9]|8[237-9])|3[689]|6[035-7]|7(?:[059][2-8]|[68])|80|9[3-5])|5(?:3[1-36-9]|4[4578]|5[013-8]|6[1-9]|7[2-8]|8[14-7]|9(?:[89][2-8]|[4-7]))|7(?:2[15]|3[5-9]|4[02-9]|6[135-8]|7[0-4689]|9(?:[017-9]|4[6-8]|5[2-478]|6[2-589]))|8(?:2(?:4[4-8]|9(?:[3578]|20|4[04-9]|6[56]))|3(?:7(?:[2-5]|6[0-59])|[3-6][2-9]|8[2-5])|4[5-8]|5[2-9]|6(?:[37]|5(?:[467]|5[014-9])|6(?:[2-8]|9[02-69])|8[2-8]|9(?:[236-8]|9[23]))|7[579]|8[03-579]|9[2-8])|9(?:[23]0|4[02-46-9]|5[024-79]|6[4-9]|7[2-47-9]|8[02-7]|9(?:3(?:3[02-9]|4[0-24689])|4[2-69]|[5-7]))", 
"1(?:2[3-6]|3[3-9]|4[2-6]|5(?:[236-8]|[45][2-69])|[68][2-7]|7[2-689]|9[1-578])|2(?:2(?:[04-689]|3[23])|3[3-58]|4[0-468]|5(?:5[78]|7[2-4]|[0468][2-9])|6(?:[0135-8]|4[2-5])|7(?:[0679]|8[2-7])|8(?:[024578]|3[25-9]|9[6-9])|9(?:11|3[2-4]))|4(?:2(?:2[2-9]|8[237-9])|3[689]|6[035-7]|7(?:[059][2-8]|[68])|80|9[3-5])|5(?:3[1-36-9]|4[4578]|5[013-8]|6[1-9]|7[2-8]|8[14-7]|9(?:[89][2-8]|[4-7]))|7(?:2[15]|3[5-9]|4[02-9]|6[135-8]|7[0-4689]|9(?:[017-9]|4[6-8]|5[2-478]|6[2-589]))|8(?:2(?:4[4-8]|9(?:[3578]|20|4[04-9]|6(?:5[25]|60)))|3(?:7(?:[2-5]|6[0-59])|[3-6][2-9]|8[2-5])|4[5-8]|5[2-9]|6(?:[37]|5(?:[467]|5[014-9])|6(?:[2-8]|9[02-69])|8[2-8]|9(?:[236-8]|9[23]))|7[579]|8[03-579]|9[2-8])|9(?:[23]0|4[02-46-9]|5[024-79]|6[4-9]|7[2-47-9]|8[02-7]|9(?:3(?:3[02-9]|4[0-24689])|4[2-69]|[5-7]))"], 
"0$1", "", 0], [, "(\\d{2})(\\d{3})(\\d{4})", "$1-$2-$3", ["1|2(?:2[37]|5[5-9]|64|78|8[39]|91)|4(?:2[2689]|64|7[347])|5(?:[2-589]|39)|60|8(?:[46-9]|3[279]|2[124589])|9(?:[235-8]|93)", "1|2(?:2[37]|5(?:[57]|[68]0|9[19])|64|78|8[39]|917)|4(?:2(?:[68]|20|9[178])|64|7[347])|5(?:[2-589]|39[67])|60|8(?:[46-9]|3[279]|2[124589])|9(?:[235-8]|93[34])", "1|2(?:2[37]|5(?:[57]|[68]0|9(?:17|99))|64|78|8[39]|917)|4(?:2(?:[68]|20|9[178])|64|7[347])|5(?:[2-589]|39[67])|60|8(?:[46-9]|3[279]|2[124589])|9(?:[235-8]|93(?:31|4))"], 
"0$1", "", 0], [, "(\\d{3})(\\d{2})(\\d{4})", "$1-$2-$3", ["2(?:9[14-79]|74|[34]7|[56]9)|82|993"], "0$1", "", 0], [, "(\\d)(\\d{4})(\\d{4})", "$1-$2-$3", ["3|4(?:2[09]|7[01])|6[1-9]"], "0$1", "", 0], [, "(\\d{2})(\\d{3})(\\d{4})", "$1-$2-$3", ["[2479][1-9]"], "0$1", "", 0]], [, , "20\\d{8}", "\\d{10}", , , "2012345678"], , , [, , "00(?:37\\d{6,13}|66\\d{6,13}|777(?:[01]\\d{2}|5\\d{3}|8\\d{4})|882[1245]\\d{4})", "\\d{8,17}", , , "00777012"], [, , "570\\d{6}", "\\d{9}", , , "570123456"], 1, , [, , 
"NA", "NA"]], "KE":[, [, , "20\\d{6,7}|[4-9]\\d{6,9}", "\\d{7,10}"], [, , "20\\d{6,7}|4(?:[0136]\\d{7}|[245]\\d{5,7})|5(?:[08]\\d{7}|[1-79]\\d{5,7})|6(?:[01457-9]\\d{5,7}|[26]\\d{7})", "\\d{7,9}", , , "202012345"], [, , "7(?:[0-36]\\d|5[0-6]|7[0-5]|8[0-25-9])\\d{6}", "\\d{9}", , , "712123456"], [, , "800[24-8]\\d{5,6}", "\\d{9,10}", , , "800223456"], [, , "900[02-9]\\d{5}", "\\d{9}", , , "900223456"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], "KE", 254, "000", "0", , , "0", , , , [[, 
"(\\d{2})(\\d{5,7})", "$1 $2", ["[24-6]"], "0$1", "", 0], [, "(\\d{3})(\\d{6,7})", "$1 $2", ["7"], "0$1", "", 0], [, "(\\d{3})(\\d{3})(\\d{3,4})", "$1 $2 $3", ["[89]"], "0$1", "", 0]], , [, , "NA", "NA"], , , [, , "NA", "NA"], [, , "NA", "NA"], , , [, , "NA", "NA"]], "KG":[, [, , "[235-8]\\d{8,9}", "\\d{5,10}"], [, , "(?:3(?:1(?:[256]\\d|3[1-9]|47)|2(?:22|3[0-479]|6[0-7])|4(?:22|5[6-9]|6\\d)|5(?:22|3[4-7]|59|6\\d)|6(?:22|5[35-7]|6\\d)|7(?:22|3[468]|4[1-9]|59|[67]\\d)|9(?:22|4[1-8]|6\\d))|6(?:09|12|2[2-4])\\d)\\d{5}", 
"\\d{5,10}", , , "312123456"], [, , "(?:20[0-35]|5[124-7]\\d|7[07]\\d)\\d{6}", "\\d{9}", , , "700123456"], [, , "800\\d{6,7}", "\\d{9,10}", , , "800123456"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], "KG", 996, "00", "0", , , "0", , , , [[, "(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", ["[25-7]|31[25]"], "0$1", "", 0], [, "(\\d{4})(\\d{5})", "$1 $2", ["3(?:1[36]|[2-9])"], "0$1", "", 0], [, "(\\d{3})(\\d{3})(\\d)(\\d{3})", "$1 $2 $3 $4", ["8"], "0$1", "", 0]], , [, , "NA", 
"NA"], , , [, , "NA", "NA"], [, , "NA", "NA"], , , [, , "NA", "NA"]], "KH":[, [, , "[1-9]\\d{7,9}", "\\d{6,10}"], [, , "(?:2[3-6]|3[2-6]|4[2-4]|[5-7][2-5])(?:[237-9]|4[56]|5\\d|6\\d?)\\d{5}|23(?:4[234]|8\\d{2})\\d{4}", "\\d{6,9}", , , "23756789"], [, , "(?:1(?:[013-9]|2\\d?)|3[18]\\d|6[016-9]|7(?:[07-9]|6\\d)|8(?:[013-79]|8\\d)|9(?:6\\d|7\\d?|[0-589]))\\d{6}", "\\d{8,9}", , , "91234567"], [, , "1800(?:1\\d|2[019])\\d{4}", "\\d{10}", , , "1800123456"], [, , "1900(?:1\\d|2[09])\\d{4}", "\\d{10}", , 
, "1900123456"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], "KH", 855, "00[14-9]", "0", , , "0", , , , [[, "(\\d{2})(\\d{3})(\\d{3,4})", "$1 $2 $3", ["1\\d[1-9]|[2-9]"], "0$1", "", 0], [, "(1[89]00)(\\d{3})(\\d{3})", "$1 $2 $3", ["1[89]0"], "", "", 0]], , [, , "NA", "NA"], , , [, , "NA", "NA"], [, , "NA", "NA"], , , [, , "NA", "NA"]], "KI":[, [, , "[2458]\\d{4}|3\\d{4,7}|7\\d{7}", "\\d{5,8}"], [, , "(?:[24]\\d|3[1-9]|50|8[0-5])\\d{3}", "\\d{5}", , , "31234"], [, , "7(?:[24]\\d|3[1-9]|8[0-5])\\d{5}", 
"\\d{8}", , , "72012345"], [, , "NA", "NA"], [, , "3001\\d{4}", "\\d{5,8}", , , "30010000"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], "KI", 686, "00", , , , "0", , , , , , [, , "NA", "NA"], , , [, , "NA", "NA"], [, , "NA", "NA"], , , [, , "NA", "NA"]], "KM":[, [, , "[379]\\d{6}", "\\d{7}"], [, , "7(?:6[0-37-9]|7[0-57-9])\\d{4}", "\\d{7}", , , "7712345"], [, , "3[234]\\d{5}", "\\d{7}", , , "3212345"], [, , "NA", "NA"], [, , "(?:39[01]|9[01]0)\\d{4}", "\\d{7}", , , "9001234"], [, , "NA", 
"NA"], [, , "NA", "NA"], [, , "NA", "NA"], "KM", 269, "00", , , , , , , , [[, "(\\d{3})(\\d{2})(\\d{2})", "$1 $2 $3", , "", "", 0]], , [, , "NA", "NA"], , , [, , "NA", "NA"], [, , "NA", "NA"], , , [, , "NA", "NA"]], "KN":[, [, , "[589]\\d{9}", "\\d{7}(?:\\d{3})?"], [, , "869(?:2(?:29|36)|302|4(?:6[015-9]|70))\\d{4}", "\\d{7}(?:\\d{3})?", , , "8692361234"], [, , "869(?:5(?:5[6-8]|6[5-7])|66\\d|76[02-6])\\d{4}", "\\d{10}", , , "8697652917"], [, , "8(?:00|44|55|66|77|88)[2-9]\\d{6}", "\\d{10}", , , 
"8002123456"], [, , "900[2-9]\\d{6}", "\\d{10}", , , "9002123456"], [, , "NA", "NA"], [, , "5(?:00|33|44|66|77)[2-9]\\d{6}", "\\d{10}", , , "5002345678"], [, , "NA", "NA"], "KN", 1, "011", "1", , , "1", , , , , , [, , "NA", "NA"], , "869", [, , "NA", "NA"], [, , "NA", "NA"], , , [, , "NA", "NA"]], "KP":[, [, , "1\\d{9}|[28]\\d{7}", "\\d{6,8}|\\d{10}"], [, , "2\\d{7}|85\\d{6}", "\\d{6,8}", , , "21234567"], [, , "19[123]\\d{7}", "\\d{10}", , , "1921234567"], [, , "NA", "NA"], [, , "NA", "NA"], [, , 
"NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], "KP", 850, "00|99", "0", , , "0", , , , [[, "(\\d{3})(\\d{3})(\\d{4})", "$1 $2 $3", ["1"], "0$1", "", 0], [, "(\\d)(\\d{3})(\\d{4})", "$1 $2 $3", ["2"], "0$1", "", 0], [, "(\\d{2})(\\d{3})(\\d{3})", "$1 $2 $3", ["8"], "0$1", "", 0]], , [, , "NA", "NA"], , , [, , "2(?:[0-24-9]\\d{2}|3(?:[0-79]\\d|8[02-9]))\\d{4}", "\\d{8}", , , "23821234"], [, , "NA", "NA"], , , [, , "NA", "NA"]], "KR":[, [, , "[1-7]\\d{3,9}|8\\d{8}", "\\d{4,10}"], [, , "(?:2|3[1-3]|[46][1-4]|5[1-5])(?:1\\d{2,3}|[1-9]\\d{6,7})", 
"\\d{4,10}", , , "22123456"], [, , "1[0-26-9]\\d{7,8}", "\\d{9,10}", , , "1023456789"], [, , "80\\d{7}", "\\d{9}", , , "801234567"], [, , "60[2-9]\\d{6}", "\\d{9}", , , "602345678"], [, , "NA", "NA"], [, , "50\\d{8}", "\\d{10}", , , "5012345678"], [, , "70\\d{8}", "\\d{10}", , , "7012345678"], "KR", 82, "00(?:[124-68]|[37]\\d{2})", "0", , , "0(8[1-46-8]|85\\d{2})?", , , , [[, "(\\d{2})(\\d{4})(\\d{4})", "$1-$2-$3", ["1(?:0|1[19]|[69]9|5[458])|[57]0", "1(?:0|1[19]|[69]9|5(?:44|59|8))|[57]0"], "0$1", 
"0$CC-$1", 0], [, "(\\d{2})(\\d{3,4})(\\d{4})", "$1-$2-$3", ["1(?:[169][2-8]|[78]|5[1-4])|[68]0|[3-6][1-9][1-9]", "1(?:[169][2-8]|[78]|5(?:[1-3]|4[56]))|[68]0|[3-6][1-9][1-9]"], "0$1", "0$CC-$1", 0], [, "(\\d{3})(\\d)(\\d{4})", "$1-$2-$3", ["131", "1312"], "0$1", "0$CC-$1", 0], [, "(\\d{3})(\\d{2})(\\d{4})", "$1-$2-$3", ["131", "131[13-9]"], "0$1", "0$CC-$1", 0], [, "(\\d{3})(\\d{3})(\\d{4})", "$1-$2-$3", ["13[2-9]"], "0$1", "0$CC-$1", 0], [, "(\\d{2})(\\d{2})(\\d{3})(\\d{4})", "$1-$2-$3-$4", ["30"], 
"0$1", "0$CC-$1", 0], [, "(\\d)(\\d{3,4})(\\d{4})", "$1-$2-$3", ["2[1-9]"], "0$1", "0$CC-$1", 0], [, "(\\d)(\\d{3,4})", "$1-$2", ["21[0-46-9]"], "0$1", "0$CC-$1", 0], [, "(\\d{2})(\\d{3,4})", "$1-$2", ["[3-6][1-9]1", "[3-6][1-9]1(?:[0-46-9])"], "0$1", "0$CC-$1", 0], [, "(\\d{4})(\\d{4})", "$1-$2", ["1(?:5[46-9]|6[04678]|8[0579])", "1(?:5(?:44|66|77|88|99)|6(?:00|44|6[16]|70|88)|8(?:00|55|77|99))"], "$1", "0$CC-$1", 0]], , [, , "15\\d{7,8}", "\\d{9,10}", , , "1523456789"], , , [, , "NA", "NA"], [, 
, "1(?:5(?:44|66|77|88|99)|6(?:00|44|6[16]|70|88)|8(?:00|55|77|99))\\d{4}", "\\d{8}", , , "15441234"], , , [, , "NA", "NA"]], "KW":[, [, , "[12569]\\d{6,7}", "\\d{7,8}"], [, , "(?:18\\d|2(?:[23]\\d{2}|4(?:[1-35-9]\\d|44)|5(?:0[034]|[2-46]\\d|5[1-3]|7[1-7])))\\d{4}", "\\d{7,8}", , , "22345678"], [, , "(?:5(?:[05]\\d|1[0-6])|6(?:0[034679]|5[015-9]|6\\d|7[067]|9[0369])|9(?:0[09]|4[049]|55|6[069]|[79]\\d|8[089]))\\d{5}", "\\d{8}", , , "50012345"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], 
[, , "NA", "NA"], [, , "NA", "NA"], "KW", 965, "00", , , , , , , , [[, "(\\d{4})(\\d{3,4})", "$1 $2", ["[1269]"], "", "", 0], [, "(5[015]\\d)(\\d{5})", "$1 $2", ["5"], "", "", 0]], , [, , "NA", "NA"], , , [, , "NA", "NA"], [, , "NA", "NA"], , , [, , "NA", "NA"]], "KY":[, [, , "[3589]\\d{9}", "\\d{7}(?:\\d{3})?"], [, , "345(?:2(?:22|44)|444|6(?:23|38|40)|7(?:4[35-79]|6[6-9]|77)|8(?:00|1[45]|25|[48]8)|9(?:14|4[035-9]))\\d{4}", "\\d{7}(?:\\d{3})?", , , "3452221234"], [, , "345(?:32[1-9]|5(?:1[67]|2[5-7]|4[6-8]|76)|9(?:1[67]|2[3-9]|3[689]))\\d{4}", 
"\\d{10}", , , "3453231234"], [, , "8(?:00|44|55|66|77|88)[2-9]\\d{6}", "\\d{10}", , , "8002345678"], [, , "900[2-9]\\d{6}|345976\\d{4}", "\\d{10}", , , "9002345678"], [, , "NA", "NA"], [, , "5(?:00|33|44|66|77)[2-9]\\d{6}", "\\d{10}", , , "5002345678"], [, , "NA", "NA"], "KY", 1, "011", "1", , , "1", , , , , , [, , "345849\\d{4}", "\\d{10}", , , "3458491234"], , "345", [, , "NA", "NA"], [, , "NA", "NA"], , , [, , "NA", "NA"]], "KZ":[, [, , "(?:33\\d|7\\d{2}|80[09])\\d{7}", "\\d{10}"], [, , "33622\\d{5}|7(?:1(?:0(?:[23]\\d|4[023]|59|63)|1(?:[23]\\d|4[0-79]|59)|2(?:[23]\\d|59)|3(?:2\\d|3[1-79]|4[0-35-9]|59)|4(?:2\\d|3[013-79]|4[0-8]|5[1-79])|5(?:2\\d|3[1-8]|4[1-7]|59)|6(?:[234]\\d|5[19]|61)|72\\d|8(?:[27]\\d|3[1-46-9]|4[0-5]))|2(?:1(?:[23]\\d|4[46-9]|5[3469])|2(?:2\\d|3[0679]|46|5[12679])|3(?:[234]\\d|5[139])|4(?:2\\d|3[1235-9]|59)|5(?:[23]\\d|4[01246-8]|59|61)|6(?:2\\d|3[1-9]|4[0-4]|59)|7(?:[237]\\d|40|5[279])|8(?:[23]\\d|4[0-3]|59)|9(?:2\\d|3[124578]|59)))\\d{5}", 
"\\d{10}", , , "7123456789"], [, , "7(?:0[012578]|47|6[02-4]|7[15-8]|85)\\d{7}", "\\d{10}", , , "7710009998"], [, , "800\\d{7}", "\\d{10}", , , "8001234567"], [, , "809\\d{7}", "\\d{10}", , , "8091234567"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "751\\d{7}", "\\d{10}", , , "7511234567"], "KZ", 7, "810", "8", , , "8", , "8~10", , , , [, , "NA", "NA"], , , [, , "751\\d{7}", "\\d{10}", , , "7511234567"], [, , "NA", "NA"], , , [, , "NA", "NA"]], "LA":[, [, , "[2-8]\\d{7,9}", "\\d{6,10}"], [, , "(?:2[13]|3(?:0\\d|[14])|[5-7][14]|41|8[1468])\\d{6}", 
"\\d{6,9}", , , "21212862"], [, , "20(?:2[2389]|5[4-689]|7[6-8]|9[15-9])\\d{6}", "\\d{10}", , , "2023123456"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], "LA", 856, "00", "0", , , "0", , , , [[, "(20)(\\d{2})(\\d{3})(\\d{3})", "$1 $2 $3 $4", ["20"], "0$1", "", 0], [, "([2-8]\\d)(\\d{3})(\\d{3})", "$1 $2 $3", ["2[13]|3[14]|[4-8]"], "0$1", "", 0], [, "(30)(\\d{2})(\\d{2})(\\d{3})", "$1 $2 $3 $4", ["30"], "0$1", "", 0]], , [, , "NA", "NA"], , , [, , "NA", 
"NA"], [, , "NA", "NA"], , , [, , "NA", "NA"]], "LB":[, [, , "[13-9]\\d{6,7}", "\\d{7,8}"], [, , "(?:[14-6]\\d{2}|7(?:[2-579]\\d|62|8[0-7])|[89][2-9]\\d)\\d{4}", "\\d{7}", , , "1123456"], [, , "(?:3\\d|7(?:[019]\\d|6[013-9]|8[89]))\\d{5}", "\\d{7,8}", , , "71123456"], [, , "NA", "NA"], [, , "9[01]\\d{6}", "\\d{8}", , , "90123456"], [, , "8[01]\\d{6}", "\\d{8}", , , "80123456"], [, , "NA", "NA"], [, , "NA", "NA"], "LB", 961, "00", "0", , , "0", , , , [[, "(\\d)(\\d{3})(\\d{3})", "$1 $2 $3", ["[13-6]|7(?:[2-579]|62|8[0-7])|[89][2-9]"], 
"0$1", "", 0], [, "([7-9]\\d)(\\d{3})(\\d{3})", "$1 $2 $3", ["[89][01]|7(?:[019]|6[013-9]|8[89])"], "", "", 0]], , [, , "NA", "NA"], , , [, , "NA", "NA"], [, , "NA", "NA"], , , [, , "NA", "NA"]], "LC":[, [, , "[5789]\\d{9}", "\\d{7}(?:\\d{3})?"], [, , "758(?:4(?:30|5[0-9]|6[2-9]|8[0-2])|57[0-2]|638)\\d{4}", "\\d{7}(?:\\d{3})?", , , "7584305678"], [, , "758(?:28[4-7]|384|4(?:6[01]|8[4-9])|5(?:1[89]|20|84)|7(?:1[2-9]|2[0-8]))\\d{4}", "\\d{10}", , , "7582845678"], [, , "8(?:00|44|55|66|77|88)[2-9]\\d{6}", 
"\\d{10}", , , "8002123456"], [, , "900[2-9]\\d{6}", "\\d{10}", , , "9002123456"], [, , "NA", "NA"], [, , "5(?:00|33|44|66|77)[2-9]\\d{6}", "\\d{10}", , , "5002345678"], [, , "NA", "NA"], "LC", 1, "011", "1", , , "1", , , , , , [, , "NA", "NA"], , "758", [, , "NA", "NA"], [, , "NA", "NA"], , , [, , "NA", "NA"]], "LI":[, [, , "6\\d{8}|[23789]\\d{6}", "\\d{7,9}"], [, , "(?:2(?:01|1[27]|3\\d|6[02-578]|96)|3(?:7[0135-7]|8[048]|9[0269]))\\d{4}", "\\d{7}", , , "2345678"], [, , "6(?:51[01]|6(?:[01][0-4]|2[016-9]|88)|710)\\d{5}|7(?:36|4[25]|56|[7-9]\\d)\\d{4}", 
"\\d{7,9}", , , "661234567"], [, , "80(?:0(?:2[238]|79)|9\\d{2})\\d{2}", "\\d{7}", , , "8002222"], [, , "90(?:0(?:2[278]|79)|1(?:23|3[012])|6(?:4\\d|6[0126]))\\d{2}", "\\d{7}", , , "9002222"], [, , "NA", "NA"], [, , "701\\d{4}", "\\d{7}", , , "7011234"], [, , "NA", "NA"], "LI", 423, "00", "0", , , "0", , , , [[, "(\\d{3})(\\d{2})(\\d{2})", "$1 $2 $3", ["[23]|7[3-57-9]|87"], "", "", 0], [, "(6\\d)(\\d{3})(\\d{3})", "$1 $2 $3", ["6"], "", "", 0], [, "(6[567]\\d)(\\d{3})(\\d{3})", "$1 $2 $3", ["6[567]"], 
"", "", 0], [, "(69)(7\\d{2})(\\d{4})", "$1 $2 $3", ["697"], "", "", 0], [, "([7-9]0\\d)(\\d{2})(\\d{2})", "$1 $2 $3", ["[7-9]0"], "", "", 0], [, "([89]0\\d)(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["[89]0"], "0$1", "", 0]], , [, , "NA", "NA"], , , [, , "NA", "NA"], [, , "87(?:0[128]|7[0-4])\\d{3}", "\\d{7}", , , "8770123"], , , [, , "697(?:[35]6|4[25]|[7-9]\\d)\\d{4}", "\\d{9}", , , "697361234"]], "LK":[, [, , "[1-9]\\d{8}", "\\d{7,9}"], [, , "(?:[189]1|2[13-7]|3[1-8]|4[157]|5[12457]|6[35-7])[2-57]\\d{6}", 
"\\d{7,9}", , , "112345678"], [, , "7[125-8]\\d{7}", "\\d{9}", , , "712345678"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], "LK", 94, "00", "0", , , "0", , , , [[, "(\\d{2})(\\d{1})(\\d{6})", "$1 $2 $3", ["[1-689]"], "0$1", "", 0], [, "(\\d{2})(\\d{3})(\\d{4})", "$1 $2 $3", ["7"], "0$1", "", 0]], , [, , "NA", "NA"], , , [, , "NA", "NA"], [, , "NA", "NA"], , , [, , "NA", "NA"]], "LR":[, [, , "2\\d{7}|[37-9]\\d{8}|[45]\\d{6}", "\\d{7,9}"], [, , "2\\d{7}", 
"\\d{8}", , , "21234567"], [, , "(?:330\\d|4[67]|5\\d|77\\d{2}|88\\d{2}|994\\d)\\d{5}", "\\d{7,9}", , , "770123456"], [, , "NA", "NA"], [, , "90[03]\\d{6}", "\\d{9}", , , "900123456"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "332(?:0[02]|5\\d)\\d{4}", "\\d{9}", , , "332001234"], "LR", 231, "00", "0", , , "0", , , , [[, "(2\\d)(\\d{3})(\\d{3})", "$1 $2 $3", ["2"], "0$1", "", 0], [, "([79]\\d{2})(\\d{3})(\\d{3})", "$1 $2 $3", ["[79]"], "0$1", "", 0], [, "([4-6])(\\d{3})(\\d{3})", "$1 $2 $3", ["[4-6]"], 
"0$1", "", 0], [, "(\\d{2})(\\d{3})(\\d{4})", "$1 $2 $3", ["[38]"], "0$1", "", 0]], , [, , "NA", "NA"], , , [, , "NA", "NA"], [, , "NA", "NA"], , , [, , "NA", "NA"]], "LS":[, [, , "[2568]\\d{7}", "\\d{8}"], [, , "2\\d{7}", "\\d{8}", , , "22123456"], [, , "[56]\\d{7}", "\\d{8}", , , "50123456"], [, , "800[256]\\d{4}", "\\d{8}", , , "80021234"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], "LS", 266, "00", , , , , , , , [[, "(\\d{4})(\\d{4})", "$1 $2", , "", "", 0]], , [, 
, "NA", "NA"], , , [, , "NA", "NA"], [, , "NA", "NA"], , , [, , "NA", "NA"]], "LT":[, [, , "[3-9]\\d{7}", "\\d{8}"], [, , "(?:3[1478]|4[124-6]|52)\\d{6}", "\\d{8}", , , "31234567"], [, , "6\\d{7}", "\\d{8}", , , "61234567"], [, , "800\\d{5}", "\\d{8}", , , "80012345"], [, , "9(?:0[0239]|10)\\d{5}", "\\d{8}", , , "90012345"], [, , "808\\d{5}", "\\d{8}", , , "80812345"], [, , "700\\d{5}", "\\d{8}", , , "70012345"], [, , "NA", "NA"], "LT", 370, "00", "8", , , "[08]", , , , [[, "([34]\\d)(\\d{6})", "$1 $2", 
["37|4(?:1|5[45]|6[2-4])"], "(8-$1)", "", 1], [, "([3-6]\\d{2})(\\d{5})", "$1 $2", ["3[148]|4(?:[24]|6[09])|528|6"], "(8-$1)", "", 1], [, "([7-9]\\d{2})(\\d{2})(\\d{3})", "$1 $2 $3", ["[7-9]"], "8 $1", "", 1], [, "(5)(2\\d{2})(\\d{4})", "$1 $2 $3", ["52[0-79]"], "(8-$1)", "", 1]], , [, , "NA", "NA"], , , [, , "NA", "NA"], [, , "70[67]\\d{5}", "\\d{8}", , , "70712345"], , , [, , "NA", "NA"]], "LU":[, [, , "[24-9]\\d{3,10}|3(?:[0-46-9]\\d{2,9}|5[013-9]\\d{1,8})", "\\d{4,11}"], [, , "(?:2(?:2\\d{1,2}|3[2-9]|[67]\\d|4[1-8]\\d?|5[1-5]\\d?|9[0-24-9]\\d?)|3(?:[059][05-9]|[13]\\d|[26][015-9]|4[0-26-9]|7[0-389]|8[08])\\d?|4\\d{2,3}|5(?:[01458]\\d|[27][0-69]|3[0-3]|[69][0-7])\\d?|7(?:1[019]|2[05-9]|3[05]|[45][07-9]|[679][089]|8[06-9])\\d?|8(?:0[2-9]|1[0-36-9]|3[3-9]|[469]9|[58][7-9]|7[89])\\d?|9(?:0[89]|2[0-49]|37|49|5[0-27-9]|7[7-9]|9[0-478])\\d?)\\d{1,7}", 
"\\d{4,11}", , , "27123456"], [, , "6(?:[269][18]|71)\\d{6}", "\\d{9}", , , "628123456"], [, , "800\\d{5}", "\\d{8}", , , "80012345"], [, , "90[01]\\d{5}", "\\d{8}", , , "90012345"], [, , "801\\d{5}", "\\d{8}", , , "80112345"], [, , "70\\d{6}", "\\d{8}", , , "70123456"], [, , "20(?:1\\d{5}|[2-689]\\d{1,7})", "\\d{4,10}", , , "20201234"], "LU", 352, "00", , , , "(15(?:0[06]|1[12]|35|4[04]|55|6[26]|77|88|99)\\d)", , , , [[, "(\\d{2})(\\d{3})", "$1 $2", ["[2-5]|7[1-9]|[89](?:[1-9]|0[2-9])"], "", "$CC $1", 
0], [, "(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3", ["[2-5]|7[1-9]|[89](?:[1-9]|0[2-9])"], "", "$CC $1", 0], [, "(\\d{2})(\\d{2})(\\d{3})", "$1 $2 $3", ["20"], "", "$CC $1", 0], [, "(\\d{2})(\\d{2})(\\d{2})(\\d{1,2})", "$1 $2 $3 $4", ["2(?:[0367]|4[3-8])"], "", "$CC $1", 0], [, "(\\d{2})(\\d{2})(\\d{2})(\\d{3})", "$1 $2 $3 $4", ["20"], "", "$CC $1", 0], [, "(\\d{2})(\\d{2})(\\d{2})(\\d{2})(\\d{1,2})", "$1 $2 $3 $4 $5", ["2(?:[0367]|4[3-8])"], "", "$CC $1", 0], [, "(\\d{2})(\\d{2})(\\d{2})(\\d{1,4})", 
"$1 $2 $3 $4", ["2(?:[12589]|4[12])|[3-5]|7[1-9]|[89](?:[1-9]|0[2-9])"], "", "$CC $1", 0], [, "(\\d{3})(\\d{2})(\\d{3})", "$1 $2 $3", ["[89]0[01]|70"], "", "$CC $1", 0], [, "(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", ["6"], "", "$CC $1", 0]], , [, , "NA", "NA"], , , [, , "NA", "NA"], [, , "NA", "NA"], , , [, , "NA", "NA"]], "LV":[, [, , "[2689]\\d{7}", "\\d{8}"], [, , "6[3-8]\\d{6}", "\\d{8}", , , "63123456"], [, , "2\\d{7}", "\\d{8}", , , "21234567"], [, , "80\\d{6}", "\\d{8}", , , "80123456"], [, , 
"90\\d{6}", "\\d{8}", , , "90123456"], [, , "81\\d{6}", "\\d{8}", , , "81123456"], [, , "NA", "NA"], [, , "NA", "NA"], "LV", 371, "00", , , , , , , , [[, "([2689]\\d)(\\d{3})(\\d{3})", "$1 $2 $3", , "", "", 0]], , [, , "NA", "NA"], , , [, , "NA", "NA"], [, , "NA", "NA"], , , [, , "NA", "NA"]], "LY":[, [, , "[25679]\\d{8}", "\\d{7,9}"], [, , "(?:2[1345]|5[1347]|6[123479]|71)\\d{7}", "\\d{7,9}", , , "212345678"], [, , "9[1-6]\\d{7}", "\\d{9}", , , "912345678"], [, , "NA", "NA"], [, , "NA", "NA"], [, 
, "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], "LY", 218, "00", "0", , , "0", , , , [[, "([25679]\\d)(\\d{7})", "$1-$2", , "0$1", "", 0]], , [, , "NA", "NA"], , , [, , "NA", "NA"], [, , "NA", "NA"], , , [, , "NA", "NA"]], "MA":[, [, , "[5689]\\d{8}", "\\d{9}"], [, , "5(?:2(?:(?:[015-7]\\d|2[2-9]|3[2-57]|4[2-8]|8[235-7])\\d|9(?:0\\d|[89]0))|3(?:(?:[0-4]\\d|[57][2-9]|6[235-8]|9[3-9])\\d|8(?:0\\d|[89]0)))\\d{4}", "\\d{9}", , , "520123456"], [, , "6(?:0[0-8]|[12-7]\\d|8[01]|9[2457-9])\\d{6}", "\\d{9}", 
, , "650123456"], [, , "80\\d{7}", "\\d{9}", , , "801234567"], [, , "89\\d{7}", "\\d{9}", , , "891234567"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], "MA", 212, "00", "0", , , "0", , , , [[, "([56]\\d{2})(\\d{6})", "$1-$2", ["5(?:2[015-7]|3[0-4])|6"], "0$1", "", 0], [, "([58]\\d{3})(\\d{5})", "$1-$2", ["5(?:2[2-489]|3[5-9])|892", "5(?:2(?:[2-48]|90)|3(?:[5-79]|80))|892"], "0$1", "", 0], [, "(5\\d{4})(\\d{4})", "$1-$2", ["5(?:29|38)", "5(?:29|38)[89]"], "0$1", "", 0], [, "(8[09])(\\d{7})", 
"$1-$2", ["8(?:0|9[013-9])"], "0$1", "", 0]], , [, , "NA", "NA"], 1, , [, , "NA", "NA"], [, , "NA", "NA"], , , [, , "NA", "NA"]], "MC":[, [, , "[4689]\\d{7,8}", "\\d{8,9}"], [, , "870\\d{5}|9[2-47-9]\\d{6}", "\\d{8}", , , "99123456"], [, , "6\\d{8}|4(?:4\\d|5[2-9])\\d{5}", "\\d{8,9}", , , "612345678"], [, , "90\\d{6}", "\\d{8}", , , "90123456"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], "MC", 377, "00", "0", , , "0", , , , [[, "(\\d{2})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", 
["9"], "$1", "", 0], [, "(\\d{2})(\\d{3})(\\d{3})", "$1 $2 $3", ["4"], "0$1", "", 0], [, "(6)(\\d{2})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4 $5", ["6"], "0$1", "", 0], [, "(\\d{3})(\\d{3})(\\d{2})", "$1 $2 $3", ["8"], "$1", "", 0]], , [, , "NA", "NA"], , , [, , "8\\d{7}", "\\d{8}"], [, , "NA", "NA"], , , [, , "NA", "NA"]], "MD":[, [, , "[235-9]\\d{7}", "\\d{8}"], [, , "(?:2(?:1[0569]|2\\d|3[015-7]|4[1-46-9]|5[0-24689]|6[2-589]|7[1-37]|9[1347-9])|5(?:33|5[257]))\\d{5}", "\\d{8}", , , "22212345"], 
[, , "(?:562\\d|6(?:[089]\\d{2}|1[01]\\d|21\\d|50\\d|7(?:[1-6]\\d|7[0-4]))|7(?:6[07]|7[457-9]|[89]\\d)\\d)\\d{4}", "\\d{8}", , , "65012345"], [, , "800\\d{5}", "\\d{8}", , , "80012345"], [, , "90[056]\\d{5}", "\\d{8}", , , "90012345"], [, , "808\\d{5}", "\\d{8}", , , "80812345"], [, , "NA", "NA"], [, , "3[08]\\d{6}", "\\d{8}", , , "30123456"], "MD", 373, "00", "0", , , "0", , , , [[, "(\\d{2})(\\d{3})(\\d{3})", "$1 $2 $3", ["22|3"], "0$1", "", 0], [, "([25-7]\\d{2})(\\d{2})(\\d{3})", "$1 $2 $3", 
["2[13-79]|[5-7]"], "0$1", "", 0], [, "([89]\\d{2})(\\d{5})", "$1 $2", ["[89]"], "0$1", "", 0]], , [, , "NA", "NA"], , , [, , "NA", "NA"], [, , "8(?:03|14)\\d{5}", "\\d{8}", , , "80312345"], , , [, , "NA", "NA"]], "ME":[, [, , "[2-9]\\d{7,8}", "\\d{6,9}"], [, , "(?:20[2-8]|3(?:0[2-7]|1[35-7]|2[3567]|3[4-7])|4(?:0[237]|1[27])|5(?:0[47]|1[27]|2[378]))\\d{5}", "\\d{6,8}", , , "30234567"], [, , "6(?:32\\d|[89]\\d{2}|7(?:[0-8]\\d|9(?:[3-9]|[0-2]\\d)))\\d{4}", "\\d{8,9}", , , "67622901"], [, , "800[28]\\d{4}", 
"\\d{8}", , , "80080002"], [, , "(?:88\\d|9(?:4[13-8]|5[16-8]))\\d{5}", "\\d{8}", , , "94515151"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "78[1-9]\\d{5}", "\\d{8}", , , "78108780"], "ME", 382, "00", "0", , , "0", , , , [[, "(\\d{2})(\\d{3})(\\d{3})", "$1 $2 $3", ["[2-57-9]|6[3789]", "[2-57-9]|6(?:[389]|7(?:[0-8]|9[3-9]))"], "0$1", "", 0], [, "(67)(9)(\\d{3})(\\d{3})", "$1 $2 $3 $4", ["679", "679[0-2]"], "0$1", "", 0]], , [, , "NA", "NA"], , , [, , "NA", "NA"], [, , "77\\d{6}", "\\d{8}", , , "77273012"], 
, , [, , "NA", "NA"]], "MF":[, [, , "[56]\\d{8}", "\\d{9}"], [, , "590(?:[02][79]|13|5[0-268]|[78]7)\\d{4}", "\\d{9}", , , "590271234"], [, , "690(?:0[0-7]|[1-9]\\d)\\d{4}", "\\d{9}", , , "690301234"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], "MF", 590, "00", "0", , , "0", , , , , , [, , "NA", "NA"], , , [, , "NA", "NA"], [, , "NA", "NA"], , , [, , "NA", "NA"]], "MG":[, [, , "[23]\\d{8}", "\\d{7,9}"], [, , "20(?:2\\d{2}|4[47]\\d|5[3467]\\d|6[279]\\d|7(?:2[29]|[35]\\d)|8[268]\\d|9[245]\\d)\\d{4}", 
"\\d{7,9}", , , "202123456"], [, , "3[2-49]\\d{7}", "\\d{9}", , , "321234567"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "22\\d{7}", "\\d{9}", , , "221234567"], "MG", 261, "00", "0", , , "0", , , , [[, "([23]\\d)(\\d{2})(\\d{3})(\\d{2})", "$1 $2 $3 $4", , "0$1", "", 0]], , [, , "NA", "NA"], , , [, , "NA", "NA"], [, , "NA", "NA"], , , [, , "NA", "NA"]], "MH":[, [, , "[2-6]\\d{6}", "\\d{7}"], [, , "(?:247|528|625)\\d{4}", "\\d{7}", , , "2471234"], [, , "(?:235|329|45[56]|545)\\d{4}", 
"\\d{7}", , , "2351234"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "635\\d{4}", "\\d{7}", , , "6351234"], "MH", 692, "011", "1", , , "1", , , , [[, "(\\d{3})(\\d{4})", "$1-$2", , "", "", 0]], , [, , "NA", "NA"], , , [, , "NA", "NA"], [, , "NA", "NA"], , , [, , "NA", "NA"]], "MK":[, [, , "[2-578]\\d{7}", "\\d{8}"], [, , "(?:2(?:[23]\\d|5[124578]|6[01])|3(?:1[3-6]|[23][2-6]|4[2356])|4(?:[23][2-6]|4[3-6]|5[256]|6[25-8]|7[24-6]|8[4-6]))\\d{5}", "\\d{6,8}", , , "22212345"], 
[, , "7(?:[0-25-8]\\d{2}|32\\d|421)\\d{4}", "\\d{8}", , , "72345678"], [, , "800\\d{5}", "\\d{8}", , , "80012345"], [, , "5[02-9]\\d{6}", "\\d{8}", , , "50012345"], [, , "8(?:0[1-9]|[1-9]\\d)\\d{5}", "\\d{8}", , , "80123456"], [, , "NA", "NA"], [, , "NA", "NA"], "MK", 389, "00", "0", , , "0", , , , [[, "(2)(\\d{3})(\\d{4})", "$1 $2 $3", ["2"], "0$1", "", 0], [, "([347]\\d)(\\d{3})(\\d{3})", "$1 $2 $3", ["[347]"], "0$1", "", 0], [, "([58]\\d{2})(\\d)(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["[58]"], "0$1", 
"", 0]], , [, , "NA", "NA"], , , [, , "NA", "NA"], [, , "NA", "NA"], , , [, , "NA", "NA"]], "ML":[, [, , "[246-9]\\d{7}", "\\d{8}"], [, , "(?:2(?:0(?:2[0-589]|7\\d)|1(?:2[5-7]|[3-689]\\d|7[2-4689]))|44[239]\\d)\\d{4}", "\\d{8}", , , "20212345"], [, , "[67]\\d{7}|9[0-25-9]\\d{6}", "\\d{8}", , , "65012345"], [, , "800\\d{5}", "\\d{8}", , , "80012345"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], "ML", 223, "00", , , , , , , , [[, "(\\d{2})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", 
["[246-9]"], "", "", 0], [, "(\\d{4})", "$1", ["67|74"], "", "", 0]], [[, "(\\d{2})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["[246-9]"], "", "", 0]], [, , "NA", "NA"], , , [, , "NA", "NA"], [, , "NA", "NA"], , , [, , "NA", "NA"]], "MM":[, [, , "[14578]\\d{5,7}|[26]\\d{5,8}|9(?:2\\d{0,2}|[58]|3\\d|4\\d{1,2}|6\\d?|[79]\\d{0,2})\\d{6}", "\\d{5,10}"], [, , "1(?:2\\d{1,2}|[3-5]\\d|6\\d?|[89][0-6]\\d)\\d{4}|2(?:[236-9]\\d{4}|4(?:0\\d{5}|\\d{4})|5(?:1\\d{3,6}|[02-9]\\d{3,5}))|4(?:2[245-8]|[346][2-6]|5[3-5])\\d{4}|5(?:2(?:20?|[3-8])|3[2-68]|4(?:21?|[4-8])|5[23]|6[2-4]|7[2-8]|8[24-7]|9[2-7])\\d{4}|6(?:0[23]|1[2356]|[24][2-6]|3[24-6]|5[2-4]|6[2-8]|7(?:[2367]|4\\d|5\\d?|8[145]\\d)|8[245]|9[24])\\d{4}|7(?:[04][24-8]|[15][2-7]|22|3[2-4])\\d{4}|8(?:1(?:2\\d?|[3-689])|2[2-8]|3[24]|4[24-7]|5[245]|6[23])\\d{4}", 
"\\d{5,9}", , , "1234567"], [, , "17[01]\\d{4}|9(?:2(?:[0-4]|5\\d{2})|3[136]\\d|4(?:0[0-4]\\d|[1379]\\d|[24][0-589]\\d|5\\d{2}|88)|5[0-6]|61?\\d|7(?:3\\d|9\\d{2})|8\\d|9(?:1\\d|7\\d{2}|[089]))\\d{5}", "\\d{7,10}", , , "92123456"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "1333\\d{4}", "\\d{8}", , , "13331234"], "MM", 95, "00", "0", , , "0", , , , [[, "(\\d)(\\d{3})(\\d{3,4})", "$1 $2 $3", ["1|2[45]"], "0$1", "", 0], [, "(2)(\\d{4})(\\d{4})", "$1 $2 $3", ["251"], 
"0$1", "", 0], [, "(\\d)(\\d{2})(\\d{3})", "$1 $2 $3", ["16|2"], "0$1", "", 0], [, "(\\d{2})(\\d{3})(\\d{3,4})", "$1 $2 $3", ["67|81"], "0$1", "", 0], [, "(\\d{2})(\\d{2})(\\d{3,4})", "$1 $2 $3", ["[4-8]"], "0$1", "", 0], [, "(9)(\\d{3})(\\d{4,6})", "$1 $2 $3", ["9(?:2[0-4]|[35-9]|4[13789])"], "0$1", "", 0], [, "(9)(4\\d{4})(\\d{4})", "$1 $2 $3", ["94[0245]"], "0$1", "", 0], [, "(9)(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3 $4", ["925"], "0$1", "", 0]], , [, , "NA", "NA"], , , [, , "NA", "NA"], [, , "NA", 
"NA"], , , [, , "NA", "NA"]], "MN":[, [, , "[12]\\d{7,9}|[57-9]\\d{7}", "\\d{6,10}"], [, , "[12](?:1\\d|2(?:[1-3]\\d?|7\\d)|3[2-8]\\d{1,2}|4[2-68]\\d{1,2}|5[1-4689]\\d{1,2})\\d{5}|5[0568]\\d{6}", "\\d{6,10}", , , "50123456"], [, , "(?:8[689]|9[013-9])\\d{6}", "\\d{8}", , , "88123456"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "7[05-8]\\d{6}", "\\d{8}", , , "75123456"], "MN", 976, "001", "0", , , "0", , , , [[, "([12]\\d)(\\d{2})(\\d{4})", "$1 $2 $3", ["[12]1"], 
"0$1", "", 0], [, "([12]2\\d)(\\d{5,6})", "$1 $2", ["[12]2[1-3]"], "0$1", "", 0], [, "([12]\\d{3})(\\d{5})", "$1 $2", ["[12](?:27|[3-5])", "[12](?:27|[3-5]\\d)2"], "0$1", "", 0], [, "(\\d{4})(\\d{4})", "$1 $2", ["[57-9]"], "$1", "", 0], [, "([12]\\d{4})(\\d{4,5})", "$1 $2", ["[12](?:27|[3-5])", "[12](?:27|[3-5]\\d)[4-9]"], "0$1", "", 0]], , [, , "NA", "NA"], , , [, , "NA", "NA"], [, , "NA", "NA"], , , [, , "NA", "NA"]], "MO":[, [, , "[268]\\d{7}", "\\d{8}"], [, , "(?:28[2-57-9]|8[2-57-9]\\d)\\d{5}", 
"\\d{8}", , , "28212345"], [, , "6[236]\\d{6}", "\\d{8}", , , "66123456"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], "MO", 853, "00", , , , , , , , [[, "([268]\\d{3})(\\d{4})", "$1 $2", , "", "", 0]], , [, , "NA", "NA"], , , [, , "NA", "NA"], [, , "NA", "NA"], , , [, , "NA", "NA"]], "MP":[, [, , "[5689]\\d{9}", "\\d{7}(?:\\d{3})?"], [, , "670(?:2(?:3[3-7]|56|8[5-8])|32[1238]|4(?:33|8[348])|5(?:32|55|88)|6(?:64|70|82)|78[589]|8[3-9]8|989)\\d{4}", "\\d{7}(?:\\d{3})?", 
, , "6702345678"], [, , "670(?:2(?:3[3-7]|56|8[5-8])|32[1238]|4(?:33|8[348])|5(?:32|55|88)|6(?:64|70|82)|78[589]|8[3-9]8|989)\\d{4}", "\\d{7}(?:\\d{3})?", , , "6702345678"], [, , "8(?:00|44|55|66|77|88)[2-9]\\d{6}", "\\d{10}", , , "8002123456"], [, , "900[2-9]\\d{6}", "\\d{10}", , , "9002123456"], [, , "NA", "NA"], [, , "5(?:00|33|44|66|77)[2-9]\\d{6}", "\\d{10}", , , "5002345678"], [, , "NA", "NA"], "MP", 1, "011", "1", , , "1", , , 1, , , [, , "NA", "NA"], , "670", [, , "NA", "NA"], [, , "NA", 
"NA"], , , [, , "NA", "NA"]], "MQ":[, [, , "[56]\\d{8}", "\\d{9}"], [, , "596(?:0[2-5]|[12]0|3[05-9]|4[024-8]|[5-7]\\d|89|9[4-8])\\d{4}", "\\d{9}", , , "596301234"], [, , "696(?:[0-479]\\d|5[01]|8[0-689])\\d{4}", "\\d{9}", , , "696201234"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], "MQ", 596, "00", "0", , , "0", , , , [[, "(\\d{3})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", , "0$1", "", 0]], , [, , "NA", "NA"], , , [, , "NA", "NA"], [, , "NA", "NA"], 
, , [, , "NA", "NA"]], "MR":[, [, , "[2-48]\\d{7}", "\\d{8}"], [, , "25[08]\\d{5}|35\\d{6}|45[1-7]\\d{5}", "\\d{8}", , , "35123456"], [, , "(?:2(?:2\\d|70)|3(?:3\\d|6[1-36]|7[1-3])|4(?:[49]\\d|6[0457-9]|7[4-9]|8[01346-8]))\\d{5}", "\\d{8}", , , "22123456"], [, , "800\\d{5}", "\\d{8}", , , "80012345"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], "MR", 222, "00", , , , , , , , [[, "([2-48]\\d)(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", , "", "", 0]], , [, , "NA", "NA"], , 
, [, , "NA", "NA"], [, , "NA", "NA"], , , [, , "NA", "NA"]], "MS":[, [, , "[5689]\\d{9}", "\\d{7}(?:\\d{3})?"], [, , "664491\\d{4}", "\\d{7}(?:\\d{3})?", , , "6644912345"], [, , "66449[2-6]\\d{4}", "\\d{10}", , , "6644923456"], [, , "8(?:00|44|55|66|77|88)[2-9]\\d{6}", "\\d{10}", , , "8002123456"], [, , "900[2-9]\\d{6}", "\\d{10}", , , "9002123456"], [, , "NA", "NA"], [, , "5(?:00|33|44|66|77)[2-9]\\d{6}", "\\d{10}", , , "5002345678"], [, , "NA", "NA"], "MS", 1, "011", "1", , , "1", , , , , , [, 
, "NA", "NA"], , "664", [, , "NA", "NA"], [, , "NA", "NA"], , , [, , "NA", "NA"]], "MT":[, [, , "[2357-9]\\d{7}", "\\d{8}"], [, , "2(?:0(?:1[0-6]|3[1-4]|[69]\\d)|[1-357]\\d{2})\\d{4}", "\\d{8}", , , "21001234"], [, , "(?:7(?:210|[79]\\d{2})|9(?:2(?:1[01]|31)|696|8(?:1[1-3]|89|97)|9\\d{2}))\\d{4}", "\\d{8}", , , "96961234"], [, , "800[3467]\\d{4}", "\\d{8}", , , "80071234"], [, , "5(?:0(?:0(?:37|43)|6\\d{2}|70\\d|9[0168])|[12]\\d0[1-5])\\d{3}", "\\d{8}", , , "50037123"], [, , "NA", "NA"], [, , "NA", 
"NA"], [, , "3550\\d{4}", "\\d{8}", , , "35501234"], "MT", 356, "00", , , , , , , , [[, "(\\d{4})(\\d{4})", "$1 $2", , "", "", 0]], , [, , "7117\\d{4}", "\\d{8}", , , "71171234"], , , [, , "NA", "NA"], [, , "501\\d{5}", "\\d{8}", , , "50112345"], , , [, , "NA", "NA"]], "MU":[, [, , "[2-9]\\d{6,7}", "\\d{7,8}"], [, , "(?:2(?:[03478]\\d|1[0-7]|6[1-69])|4(?:[013568]\\d|2[4-7])|5(?:44\\d|471)|6\\d{2}|8(?:14|3[129]))\\d{4}", "\\d{7,8}", , , "2012345"], [, , "5(?:2[59]\\d|4(?:2[1-389]|4\\d|7[1-9]|9\\d)|7\\d{2}|8(?:[256]\\d|7[15-8])|9[0-8]\\d)\\d{4}", 
"\\d{8}", , , "52512345"], [, , "80[012]\\d{4}", "\\d{7}", , , "8001234"], [, , "30\\d{5}", "\\d{7}", , , "3012345"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "3(?:20|9\\d)\\d{4}", "\\d{7}", , , "3201234"], "MU", 230, "0(?:0|[2-7]0|33)", , , , , , "020", , [[, "([2-46-9]\\d{2})(\\d{4})", "$1 $2", ["[2-46-9]"], "", "", 0], [, "(5\\d{3})(\\d{4})", "$1 $2", ["5"], "", "", 0]], , [, , "NA", "NA"], , , [, , "NA", "NA"], [, , "NA", "NA"], , , [, , "NA", "NA"]], "MV":[, [, , "[3467]\\d{6}|9(?:00\\d{7}|\\d{6})", 
"\\d{7,10}"], [, , "(?:3(?:0[01]|3[0-59])|6(?:[567][02468]|8[024689]|90))\\d{4}", "\\d{7}", , , "6701234"], [, , "(?:46[46]|7[3-9]\\d|9[16-9]\\d)\\d{4}", "\\d{7}", , , "7712345"], [, , "NA", "NA"], [, , "900\\d{7}", "\\d{10}", , , "9001234567"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], "MV", 960, "0(?:0|19)", , , , , , "00", , [[, "(\\d{3})(\\d{4})", "$1-$2", ["[3467]|9(?:[1-9]|0[1-9])"], "", "", 0], [, "(\\d{3})(\\d{3})(\\d{4})", "$1 $2 $3", ["900"], "", "", 0]], , [, , "781\\d{4}", 
"\\d{7}", , , "7812345"], , , [, , "NA", "NA"], [, , "NA", "NA"], , , [, , "NA", "NA"]], "MW":[, [, , "(?:1(?:\\d{2})?|[2789]\\d{2})\\d{6}", "\\d{7,9}"], [, , "(?:1[2-9]|21\\d{2})\\d{5}", "\\d{7,9}", , , "1234567"], [, , "(?:111|77\\d|88\\d|99\\d)\\d{6}", "\\d{9}", , , "991234567"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], "MW", 265, "00", "0", , , "0", , , , [[, "(\\d)(\\d{3})(\\d{3})", "$1 $2 $3", ["1"], "0$1", "", 0], [, "(2\\d{2})(\\d{3})(\\d{3})", 
"$1 $2 $3", ["2"], "0$1", "", 0], [, "(\\d{3})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["[1789]"], "0$1", "", 0]], , [, , "NA", "NA"], , , [, , "NA", "NA"], [, , "NA", "NA"], , , [, , "NA", "NA"]], "MX":[, [, , "[1-9]\\d{9,10}", "\\d{7,11}"], [, , "(?:33|55|81)\\d{8}|(?:2(?:2[2-9]|3[1-35-8]|4[13-9]|7[1-689]|8[1-578]|9[467])|3(?:1[1-79]|[2458][1-9]|7[1-8]|9[1-5])|4(?:1[1-57-9]|[24-6][1-9]|[37][1-8]|8[1-35-9]|9[2-689])|5(?:88|9[1-79])|6(?:1[2-68]|[234][1-9]|5[1-3689]|6[12457-9]|7[1-7]|8[67]|9[4-8])|7(?:[13467][1-9]|2[1-8]|5[13-9]|8[1-69]|9[17])|8(?:2[13-689]|3[1-6]|4[124-6]|6[1246-9]|7[1-378]|9[12479])|9(?:1[346-9]|2[1-4]|3[2-46-8]|5[1348]|[69][1-9]|7[12]|8[1-8]))\\d{7}", 
"\\d{7,10}", , , "2221234567"], [, , "1(?:(?:33|55|81)\\d{8}|(?:2(?:2[2-9]|3[1-35-8]|4[13-9]|7[1-689]|8[1-578]|9[467])|3(?:1[1-79]|[2458][1-9]|7[1-8]|9[1-5])|4(?:1[1-57-9]|[24-6][1-9]|[37][1-8]|8[1-35-9]|9[2-689])|5(?:88|9[1-79])|6(?:1[2-68]|[2-4][1-9]|5[1-3689]|6[12457-9]|7[1-7]|8[67]|9[4-8])|7(?:[13467][1-9]|2[1-8]|5[13-9]|8[1-69]|9[17])|8(?:2[13-689]|3[1-6]|4[124-6]|6[1246-9]|7[1-378]|9[12479])|9(?:1[346-9]|2[1-4]|3[2-46-8]|5[1348]|[69][1-9]|7[12]|8[1-8]))\\d{7})", "\\d{11}", , , "12221234567"], 
[, , "800\\d{7}", "\\d{10}", , , "8001234567"], [, , "900\\d{7}", "\\d{10}", , , "9001234567"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], "MX", 52, "0[09]", "01", , , "0[12]|04[45](\\d{10})", "1$1", , , [[, "([358]\\d)(\\d{4})(\\d{4})", "$1 $2 $3", ["33|55|81"], "01 $1", "", 1], [, "(\\d{3})(\\d{3})(\\d{4})", "$1 $2 $3", ["[2467]|3[12457-9]|5[89]|8[02-9]|9[0-35-9]"], "01 $1", "", 1], [, "(1)([358]\\d)(\\d{4})(\\d{4})", "044 $2 $3 $4", ["1(?:33|55|81)"], "$1", "", 1], [, "(1)(\\d{3})(\\d{3})(\\d{4})", 
"044 $2 $3 $4", ["1(?:[2467]|3[12457-9]|5[89]|8[2-9]|9[1-35-9])"], "$1", "", 1]], [[, "([358]\\d)(\\d{4})(\\d{4})", "$1 $2 $3", ["33|55|81"], "01 $1", "", 1], [, "(\\d{3})(\\d{3})(\\d{4})", "$1 $2 $3", ["[2467]|3[12457-9]|5[89]|8[02-9]|9[0-35-9]"], "01 $1", "", 1], [, "(1)([358]\\d)(\\d{4})(\\d{4})", "$1 $2 $3 $4", ["1(?:33|55|81)"]], [, "(1)(\\d{3})(\\d{3})(\\d{4})", "$1 $2 $3 $4", ["1(?:[2467]|3[12457-9]|5[89]|8[2-9]|9[1-35-9])"]]], [, , "NA", "NA"], , , [, , "NA", "NA"], [, , "NA", "NA"], 1, , 
[, , "NA", "NA"]], "MY":[, [, , "[13-9]\\d{7,9}", "\\d{6,10}"], [, , "(?:3[2-9]\\d|[4-9][2-9])\\d{6}", "\\d{6,9}", , , "323456789"], [, , "1(?:1[1-3]\\d{2}|[02-4679][2-9]\\d|59\\d{2}|8(?:1[23]|[2-9]\\d))\\d{5}", "\\d{9,10}", , , "123456789"], [, , "1[378]00\\d{6}", "\\d{10}", , , "1300123456"], [, , "1600\\d{6}", "\\d{10}", , , "1600123456"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "154\\d{7}", "\\d{10}", , , "1541234567"], "MY", 60, "00", "0", , , "0", , , , [[, "([4-79])(\\d{3})(\\d{4})", "$1-$2 $3", 
["[4-79]"], "0$1", "", 0], [, "(3)(\\d{4})(\\d{4})", "$1-$2 $3", ["3"], "0$1", "", 0], [, "([18]\\d)(\\d{3})(\\d{3,4})", "$1-$2 $3", ["1[02-46-9][1-9]|8"], "0$1", "", 0], [, "(1)([36-8]00)(\\d{2})(\\d{4})", "$1-$2-$3-$4", ["1[36-8]0"], "", "", 0], [, "(11)(\\d{4})(\\d{4})", "$1-$2 $3", ["11"], "0$1", "", 0], [, "(15[49])(\\d{3})(\\d{4})", "$1-$2 $3", ["15"], "0$1", "", 0]], , [, , "NA", "NA"], , , [, , "NA", "NA"], [, , "NA", "NA"], , , [, , "NA", "NA"]], "MZ":[, [, , "[28]\\d{7,8}", "\\d{8,9}"], 
[, , "2(?:[1346]\\d|5[0-2]|[78][12]|93)\\d{5}", "\\d{8}", , , "21123456"], [, , "8[23467]\\d{7}", "\\d{9}", , , "821234567"], [, , "800\\d{6}", "\\d{9}", , , "800123456"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], "MZ", 258, "00", , , , , , , , [[, "([28]\\d)(\\d{3})(\\d{3,4})", "$1 $2 $3", ["2|8[2-7]"], "", "", 0], [, "(80\\d)(\\d{3})(\\d{3})", "$1 $2 $3", ["80"], "", "", 0]], , [, , "NA", "NA"], , , [, , "NA", "NA"], [, , "NA", "NA"], , , [, , "NA", "NA"]], "NA":[, 
[, , "[68]\\d{7,8}", "\\d{8,9}"], [, , "6(?:1(?:17|2(?:[0189]\\d|[2-6]|7\\d?)|3(?:[01378]|2\\d)|4[01]|69|7[014])|2(?:17|5(?:[0-36-8]|4\\d?)|69|70)|3(?:17|2(?:[0237]\\d?|[14-689])|34|6[29]|7[01]|81)|4(?:17|2(?:[012]|7?)|4(?:[06]|1\\d)|5(?:[01357]|[25]\\d?)|69|7[01])|5(?:17|2(?:[0459]|[23678]\\d?)|69|7[01])|6(?:17|2(?:5|6\\d?)|38|42|69|7[01])|7(?:17|2(?:[569]|[234]\\d?)|3(?:0\\d?|[13])|69|7[01]))\\d{4}", "\\d{8,9}", , , "61221234"], [, , "(?:60|8[125])\\d{7}", "\\d{9}", , , "811234567"], [, , "NA", 
"NA"], [, , "8701\\d{5}", "\\d{9}", , , "870123456"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "8(?:3\\d{2}|86)\\d{5}", "\\d{8,9}", , , "88612345"], "NA", 264, "00", "0", , , "0", , , , [[, "(8\\d)(\\d{3})(\\d{4})", "$1 $2 $3", ["8[1235]"], "0$1", "", 0], [, "(6\\d)(\\d{2,3})(\\d{4})", "$1 $2 $3", ["6"], "0$1", "", 0], [, "(88)(\\d{3})(\\d{3})", "$1 $2 $3", ["88"], "0$1", "", 0], [, "(870)(\\d{3})(\\d{3})", "$1 $2 $3", ["870"], "0$1", "", 0]], , [, , "NA", "NA"], , , [, , "NA", "NA"], [, , "NA", 
"NA"], , , [, , "NA", "NA"]], "NC":[, [, , "[2-57-9]\\d{5}", "\\d{6}"], [, , "(?:2[03-9]|3[0-5]|4[1-7]|88)\\d{4}", "\\d{6}", , , "201234"], [, , "(?:5[0-4]|[79]\\d|8[0-79])\\d{4}", "\\d{6}", , , "751234"], [, , "NA", "NA"], [, , "36\\d{4}", "\\d{6}", , , "366711"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], "NC", 687, "00", , , , , , , , [[, "(\\d{2})(\\d{2})(\\d{2})", "$1.$2.$3", ["[2-46-9]|5[0-4]"], "", "", 0]], , [, , "NA", "NA"], , , [, , "NA", "NA"], [, , "NA", "NA"], , , [, , "NA", 
"NA"]], "NE":[, [, , "[0289]\\d{7}", "\\d{8}"], [, , "2(?:0(?:20|3[1-7]|4[134]|5[14]|6[14578]|7[1-578])|1(?:4[145]|5[14]|6[14-68]|7[169]|88))\\d{4}", "\\d{8}", , , "20201234"], [, , "(?:89|9\\d)\\d{6}", "\\d{8}", , , "93123456"], [, , "08\\d{6}", "\\d{8}", , , "08123456"], [, , "09\\d{6}", "\\d{8}", , , "09123456"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], "NE", 227, "00", , , , , , , , [[, "(\\d{2})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["[289]|09"], "", "", 0], [, "(08)(\\d{3})(\\d{3})", 
"$1 $2 $3", ["08"], "", "", 0]], , [, , "NA", "NA"], , , [, , "NA", "NA"], [, , "NA", "NA"], 1, , [, , "NA", "NA"]], "NF":[, [, , "[13]\\d{5}", "\\d{5,6}"], [, , "(?:1(?:06|17|28|39)|3[012]\\d)\\d{3}", "\\d{5,6}", , , "106609"], [, , "38\\d{4}", "\\d{5,6}", , , "381234"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], "NF", 672, "00", , , , , , , , [[, "(\\d{2})(\\d{4})", "$1 $2", ["1"], "", "", 0], [, "(\\d)(\\d{5})", "$1 $2", ["3"], "", "", 0]], , [, , 
"NA", "NA"], , , [, , "NA", "NA"], [, , "NA", "NA"], , , [, , "NA", "NA"]], "NG":[, [, , "[1-6]\\d{5,8}|9\\d{5,9}|[78]\\d{5,13}", "\\d{5,14}"], [, , "[12]\\d{6,7}|9(?:0[3-9]|[1-9]\\d)\\d{5}|(?:3\\d|4[023568]|5[02368]|6[02-469]|7[4-69]|8[2-9])\\d{6}|(?:4[47]|5[14579]|6[1578]|7[0-357])\\d{5,6}|(?:78|41)\\d{5}", "\\d{5,9}", , , "12345678"], [, , "(?:1(?:7[34]\\d|8(?:04|[124579]\\d|8[0-3])|95\\d)|287[0-7]|3(?:18[1-8]|88[0-7]|9(?:8[5-9]|6[1-5]))|4(?:28[0-2]|6(?:7[1-9]|8[02-47])|88[0-2])|5(?:2(?:7[7-9]|8\\d)|38[1-79]|48[0-7]|68[4-7])|6(?:2(?:7[7-9]|8\\d)|4(?:3[7-9]|[68][129]|7[04-69]|9[1-8])|58[0-2]|98[7-9])|7(?:38[0-7]|69[1-8]|78[2-4])|8(?:28[3-9]|38[0-2]|4(?:2[12]|3[147-9]|5[346]|7[4-9]|8[014-689]|90)|58[1-8]|78[2-9]|88[5-7])|98[07]\\d)\\d{4}|(?:70(?:[13-9]\\d|2[1-9])|8(?:0[2-9]|1\\d)\\d|90[239]\\d)\\d{6}", 
"\\d{8,10}", , , "8021234567"], [, , "800\\d{7,11}", "\\d{10,14}", , , "80017591759"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], "NG", 234, "009", "0", , , "0", , , , [[, "([129])(\\d{3})(\\d{3,4})", "$1 $2 $3", ["[129]"], "0$1", "", 0], [, "(\\d{2})(\\d{3})(\\d{2,3})", "$1 $2 $3", ["[3-6]|7(?:[1-79]|0[1-9])|8[2-9]"], "0$1", "", 0], [, "(\\d{3})(\\d{3})(\\d{3,4})", "$1 $2 $3", ["70|8[01]|90[239]"], "0$1", "", 0], [, "([78]00)(\\d{4})(\\d{4,5})", "$1 $2 $3", ["[78]00"], 
"0$1", "", 0], [, "([78]00)(\\d{5})(\\d{5,6})", "$1 $2 $3", ["[78]00"], "0$1", "", 0], [, "(78)(\\d{2})(\\d{3})", "$1 $2 $3", ["78"], "0$1", "", 0]], , [, , "NA", "NA"], , , [, , "NA", "NA"], [, , "700\\d{7,11}", "\\d{10,14}", , , "7001234567"], , , [, , "NA", "NA"]], "NI":[, [, , "[12578]\\d{7}", "\\d{8}"], [, , "2\\d{7}", "\\d{8}", , , "21234567"], [, , "5(?:5[0-7]\\d{5}|[78]\\d{6})|7[5-8]\\d{6}|8\\d{7}", "\\d{8}", , , "81234567"], [, , "1800\\d{4}", "\\d{8}", , , "18001234"], [, , "NA", "NA"], 
[, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], "NI", 505, "00", , , , , , , , [[, "(\\d{4})(\\d{4})", "$1 $2", , "", "", 0]], , [, , "NA", "NA"], , , [, , "NA", "NA"], [, , "NA", "NA"], , , [, , "NA", "NA"]], "NL":[, [, , "1\\d{4,8}|[2-7]\\d{8}|[89]\\d{6,9}", "\\d{5,10}"], [, , "(?:1[0135-8]|2[02-69]|3[0-68]|4[0135-9]|[57]\\d|8[478])\\d{7}", "\\d{9}", , , "101234567"], [, , "6[1-58]\\d{7}", "\\d{9}", , , "612345678"], [, , "800\\d{4,7}", "\\d{7,10}", , , "8001234"], [, , "90[069]\\d{4,7}", 
"\\d{7,10}", , , "9061234"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "85\\d{7}", "\\d{9}", , , "851234567"], "NL", 31, "00", "0", , , "0", , , , [[, "([1-578]\\d)(\\d{3})(\\d{4})", "$1 $2 $3", ["1[035]|2[0346]|3[03568]|4[0356]|5[0358]|7|8[4578]"], "0$1", "", 0], [, "([1-5]\\d{2})(\\d{3})(\\d{3})", "$1 $2 $3", ["1[16-8]|2[259]|3[124]|4[17-9]|5[124679]"], "0$1", "", 0], [, "(6)(\\d{8})", "$1 $2", ["6[0-57-9]"], "0$1", "", 0], [, "(66)(\\d{7})", "$1 $2", ["66"], "0$1", "", 0], [, "(14)(\\d{3,4})", 
"$1 $2", ["14"], "$1", "", 0], [, "([89]0\\d)(\\d{4,7})", "$1 $2", ["80|9"], "0$1", "", 0]], , [, , "66\\d{7}", "\\d{9}", , , "662345678"], , , [, , "14\\d{3,4}", "\\d{5,6}"], [, , "140(?:1(?:[035]|[16-8]\\d)|2(?:[0346]|[259]\\d)|3(?:[03568]|[124]\\d)|4(?:[0356]|[17-9]\\d)|5(?:[0358]|[124679]\\d)|7\\d|8[458])", "\\d{5,6}", , , "14020"], , , [, , "NA", "NA"]], "NO":[, [, , "0\\d{4}|[2-9]\\d{7}", "\\d{5}(?:\\d{3})?"], [, , "(?:2[1-4]|3[1-3578]|5[1-35-7]|6[1-4679]|7[0-8])\\d{6}", "\\d{8}", , , "21234567"], 
[, , "(?:4[015-8]|5[89]|9\\d)\\d{6}", "\\d{8}", , , "40612345"], [, , "80[01]\\d{5}", "\\d{8}", , , "80012345"], [, , "82[09]\\d{5}", "\\d{8}", , , "82012345"], [, , "810(?:0[0-6]|[2-8]\\d)\\d{3}", "\\d{8}", , , "81021234"], [, , "880\\d{5}", "\\d{8}", , , "88012345"], [, , "85[0-5]\\d{5}", "\\d{8}", , , "85012345"], "NO", 47, "00", , , , , , , , [[, "([489]\\d{2})(\\d{2})(\\d{3})", "$1 $2 $3", ["[489]"], "", "", 0], [, "([235-7]\\d)(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["[235-7]"], "", "", 0]], 
, [, , "NA", "NA"], 1, , [, , "NA", "NA"], [, , "0\\d{4}|81(?:0(?:0[7-9]|1\\d)|5\\d{2})\\d{3}", "\\d{5}(?:\\d{3})?", , , "01234"], 1, , [, , "81[23]\\d{5}", "\\d{8}", , , "81212345"]], "NP":[, [, , "[1-8]\\d{7}|9(?:[1-69]\\d{6,8}|7[2-6]\\d{5,7}|8\\d{8})", "\\d{6,10}"], [, , "(?:1[0-6]\\d|2[13-79][2-6]|3[135-8][2-6]|4[146-9][2-6]|5[135-7][2-6]|6[13-9][2-6]|7[15-9][2-6]|8[1-46-9][2-6]|9[1-79][2-6])\\d{5}", "\\d{6,8}", , , "14567890"], [, , "9(?:6[013]|7[245]|8[01456])\\d{7}", "\\d{10}", , , "9841234567"], 
[, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], "NP", 977, "00", "0", , , "0", , , , [[, "(1)(\\d{7})", "$1-$2", ["1[2-6]"], "0$1", "", 0], [, "(\\d{2})(\\d{6})", "$1-$2", ["1[01]|[2-8]|9(?:[1-69]|7[15-9])"], "0$1", "", 0], [, "(9\\d{2})(\\d{7})", "$1-$2", ["9(?:6[013]|7[245]|8)"], "0$1", "", 0]], , [, , "NA", "NA"], , , [, , "NA", "NA"], [, , "NA", "NA"], , , [, , "NA", "NA"]], "NR":[, [, , "[458]\\d{6}", "\\d{7}"], [, , "(?:444|888)\\d{4}", "\\d{7}", , 
, "4441234"], [, , "55[5-9]\\d{4}", "\\d{7}", , , "5551234"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], "NR", 674, "00", , , , , , , , [[, "(\\d{3})(\\d{4})", "$1 $2", , "", "", 0]], , [, , "NA", "NA"], , , [, , "NA", "NA"], [, , "NA", "NA"], , , [, , "NA", "NA"]], "NU":[, [, , "[1-5]\\d{3}", "\\d{4}"], [, , "[34]\\d{3}", "\\d{4}", , , "4002"], [, , "[125]\\d{3}", "\\d{4}", , , "1234"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", 
"NA"], [, , "NA", "NA"], "NU", 683, "00", , , , , , , , , , [, , "NA", "NA"], , , [, , "NA", "NA"], [, , "NA", "NA"], , , [, , "NA", "NA"]], "NZ":[, [, , "6[235-9]\\d{6}|[2-57-9]\\d{7,10}", "\\d{7,11}"], [, , "(?:3[2-79]|[49][2-689]|6[235-9]|7[2-5789])\\d{6}|24099\\d{3}", "\\d{7,8}", , , "32345678"], [, , "2(?:[028]\\d{7,8}|1(?:[03]\\d{5,7}|[12457]\\d{5,6}|[689]\\d{5})|[79]\\d{7})", "\\d{8,10}", , , "211234567"], [, , "508\\d{6,7}|80\\d{6,8}", "\\d{8,10}", , , "800123456"], [, , "90\\d{7,9}", "\\d{9,11}", 
, , "900123456"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], "NZ", 64, "0(?:0|161)", "0", , , "0", , "00", , [[, "([34679])(\\d{3})(\\d{4})", "$1-$2 $3", ["[3467]|9[1-9]"], "0$1", "", 0], [, "(24099)(\\d{3})", "$1 $2", ["240", "2409", "24099"], "0$1", "", 0], [, "(\\d{2})(\\d{3})(\\d{3})", "$1 $2 $3", ["21"], "0$1", "", 0], [, "(\\d{2})(\\d{3})(\\d{3,5})", "$1 $2 $3", ["2(?:1[1-9]|[69]|7[0-35-9])|86"], "0$1", "", 0], [, "(2\\d)(\\d{3,4})(\\d{4})", "$1 $2 $3", ["2[028]"], "0$1", "", 0], 
[, "(\\d{3})(\\d{3})(\\d{3,4})", "$1 $2 $3", ["2(?:10|74)|5|[89]0"], "0$1", "", 0]], , [, , "[28]6\\d{6,7}", "\\d{8,9}", , , "26123456"], , , [, , "NA", "NA"], [, , "NA", "NA"], , , [, , "NA", "NA"]], "OM":[, [, , "(?:2[2-6]|5|9[1-9])\\d{6}|800\\d{5,6}", "\\d{7,9}"], [, , "2[2-6]\\d{6}", "\\d{8}", , , "23123456"], [, , "9[1-9]\\d{6}", "\\d{8}", , , "92123456"], [, , "8007\\d{4,5}|500\\d{4}", "\\d{7,9}", , , "80071234"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], "OM", 
968, "00", , , , , , , , [[, "(2\\d)(\\d{6})", "$1 $2", ["2"], "", "", 0], [, "(9\\d{3})(\\d{4})", "$1 $2", ["9"], "", "", 0], [, "([58]00)(\\d{4,6})", "$1 $2", ["[58]"], "", "", 0]], , [, , "NA", "NA"], , , [, , "NA", "NA"], [, , "NA", "NA"], , , [, , "NA", "NA"]], "PA":[, [, , "[1-9]\\d{6,7}", "\\d{7,8}"], [, , "(?:1(?:0[02-579]|19|2[37]|3[03]|4[479]|57|65|7[016-8]|8[58]|9[1349])|2(?:[0235679]\\d|1[0-7]|4[04-9]|8[028])|3(?:[09]\\d|1[14-7]|2[0-3]|3[03]|4[0457]|5[56]|6[068]|7[06-8]|8[089])|4(?:3[013-69]|4\\d|7[0-689])|5(?:[01]\\d|2[0-7]|[56]0|79)|7(?:0[09]|2[0-267]|3[06]|[49]0|5[06-9]|7[0-24-7]|8[89])|8(?:[34]\\d|5[0-4]|8[02])|9(?:0[6-8]|1[016-8]|2[036-8]|3[3679]|40|5[0489]|6[06-9]|7[046-9]|8[36-8]|9[1-9]))\\d{4}", 
"\\d{7}", , , "2001234"], [, , "(?:1[16]1|21[89]|8(?:1[01]|7[23]))\\d{4}|6(?:[024-9]\\d|1[0-5]|3[0-24-9])\\d{5}", "\\d{7,8}", , , "60012345"], [, , "80[09]\\d{4}", "\\d{7}", , , "8001234"], [, , "(?:779|8(?:2[235]|55|60|7[578]|86|95)|9(?:0[0-2]|81))\\d{4}", "\\d{7}", , , "8601234"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], "PA", 507, "00", , , , , , , , [[, "(\\d{3})(\\d{4})", "$1-$2", ["[1-57-9]"], "", "", 0], [, "(\\d{4})(\\d{4})", "$1-$2", ["6"], "", "", 0]], , [, , "NA", "NA"], , 
, [, , "NA", "NA"], [, , "NA", "NA"], , , [, , "NA", "NA"]], "PE":[, [, , "[14-9]\\d{7,8}", "\\d{6,9}"], [, , "(?:1\\d|4[1-4]|5[1-46]|6[1-7]|7[2-46]|8[2-4])\\d{6}", "\\d{6,8}", , , "11234567"], [, , "9\\d{8}", "\\d{9}", , , "912345678"], [, , "800\\d{5}", "\\d{8}", , , "80012345"], [, , "805\\d{5}", "\\d{8}", , , "80512345"], [, , "801\\d{5}", "\\d{8}", , , "80112345"], [, , "80[24]\\d{5}", "\\d{8}", , , "80212345"], [, , "NA", "NA"], "PE", 51, "19(?:1[124]|77|90)00", "0", " Anexo ", , "0", , , , 
[[, "(1)(\\d{7})", "$1 $2", ["1"], "(0$1)", "", 0], [, "([4-8]\\d)(\\d{6})", "$1 $2", ["[4-7]|8[2-4]"], "(0$1)", "", 0], [, "(\\d{3})(\\d{5})", "$1 $2", ["80"], "(0$1)", "", 0], [, "(9\\d{2})(\\d{3})(\\d{3})", "$1 $2 $3", ["9"], "$1", "", 0]], , [, , "NA", "NA"], , , [, , "NA", "NA"], [, , "NA", "NA"], , , [, , "NA", "NA"]], "PF":[, [, , "4\\d{5,7}|8\\d{7}", "\\d{6}(?:\\d{2})?"], [, , "4(?:[09][45689]\\d|4)\\d{4}", "\\d{6}(?:\\d{2})?", , , "40412345"], [, , "8[79]\\d{6}", "\\d{8}", , , "87123456"], 
[, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], "PF", 689, "00", , , , , , , , [[, "(\\d{2})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["4[09]|8[79]"], "", "", 0], [, "(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3", ["44"], "", "", 0]], , [, , "NA", "NA"], , , [, , "44\\d{4}", "\\d{6}", , , "441234"], [, , "NA", "NA"], , , [, , "NA", "NA"]], "PG":[, [, , "[1-9]\\d{6,7}", "\\d{7,8}"], [, , "(?:3[0-2]\\d|4[25]\\d|5[34]\\d|64[1-9]|77(?:[0-24]\\d|30)|85[02-46-9]|9[78]\\d)\\d{4}", 
"\\d{7}", , , "3123456"], [, , "(?:20150|68\\d{2}|7(?:[0-369]\\d|75)\\d{2})\\d{3}", "\\d{7,8}", , , "6812345"], [, , "180\\d{4}", "\\d{7}", , , "1801234"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "275\\d{4}", "\\d{7}", , , "2751234"], "PG", 675, "00", , , , , , , , [[, "(\\d{3})(\\d{4})", "$1 $2", ["[13-689]|27"], "", "", 0], [, "(\\d{4})(\\d{4})", "$1 $2", ["20|7"], "", "", 0]], , [, , "NA", "NA"], , , [, , "NA", "NA"], [, , "NA", "NA"], , , [, , "NA", "NA"]], "PH":[, [, , "2\\d{5,7}|[3-9]\\d{7,9}|1800\\d{7,9}", 
"\\d{5,13}"], [, , "2\\d{5}(?:\\d{2})?|(?:3[2-68]|4[2-9]|5[2-6]|6[2-58]|7[24578]|8[2-8])\\d{7}|88(?:22\\d{6}|42\\d{4})", "\\d{5,10}", , , "21234567"], [, , "(?:81[37]|9(?:0[5-9]|1[024-9]|2[0-35-9]|3[02-9]|4[236-9]|7[34-79]|89|9[4-9]))\\d{7}", "\\d{10}", , , "9051234567"], [, , "1800\\d{7,9}", "\\d{11,13}", , , "180012345678"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], "PH", 63, "00", "0", , , "0", , , , [[, "(2)(\\d{3})(\\d{4})", "$1 $2 $3", ["2"], "(0$1)", "", 0], [, 
"(2)(\\d{5})", "$1 $2", ["2"], "(0$1)", "", 0], [, "(\\d{4})(\\d{4,6})", "$1 $2", ["3(?:23|39|46)|4(?:2[3-6]|[35]9|4[26]|76)|5(?:22|44)|642|8(?:62|8[245])", "3(?:230|397|461)|4(?:2(?:35|[46]4|51)|396|4(?:22|63)|59[347]|76[15])|5(?:221|446)|642[23]|8(?:622|8(?:[24]2|5[13]))"], "(0$1)", "", 0], [, "(\\d{5})(\\d{4})", "$1 $2", ["346|4(?:27|9[35])|883", "3469|4(?:279|9(?:30|56))|8834"], "(0$1)", "", 0], [, "([3-8]\\d)(\\d{3})(\\d{4})", "$1 $2 $3", ["[3-8]"], "(0$1)", "", 0], [, "(\\d{3})(\\d{3})(\\d{4})", 
"$1 $2 $3", ["81|9"], "0$1", "", 0], [, "(1800)(\\d{3})(\\d{4})", "$1 $2 $3", ["1"], "", "", 0], [, "(1800)(\\d{1,2})(\\d{3})(\\d{4})", "$1 $2 $3 $4", ["1"], "", "", 0]], , [, , "NA", "NA"], , , [, , "NA", "NA"], [, , "NA", "NA"], , , [, , "NA", "NA"]], "PK":[, [, , "1\\d{8}|[2-8]\\d{5,11}|9(?:[013-9]\\d{4,9}|2\\d(?:111\\d{6}|\\d{3,7}))", "\\d{6,12}"], [, , "(?:21|42)[2-9]\\d{7}|(?:2[25]|4[0146-9]|5[1-35-7]|6[1-8]|7[14]|8[16]|91)[2-9]\\d{6}|(?:2(?:3[2358]|4[2-4]|9[2-8])|45[3479]|54[2-467]|60[468]|72[236]|8(?:2[2-689]|3[23578]|4[3478]|5[2356])|9(?:1|2[2-8]|3[27-9]|4[2-6]|6[3569]|9[25-8]))[2-9]\\d{5,6}|58[126]\\d{7}", 
"\\d{6,10}", , , "2123456789"], [, , "3(?:0\\d|[12][0-5]|3[1-7]|4[0-7]|55|64)\\d{7}", "\\d{10}", , , "3012345678"], [, , "800\\d{5}", "\\d{8}", , , "80012345"], [, , "900\\d{5}", "\\d{8}", , , "90012345"], [, , "NA", "NA"], [, , "122\\d{6}", "\\d{9}", , , "122044444"], [, , "NA", "NA"], "PK", 92, "00", "0", , , "0", , , , [[, "(\\d{2})(111)(\\d{3})(\\d{3})", "$1 $2 $3 $4", ["(?:2[125]|4[0-246-9]|5[1-35-7]|6[1-8]|7[14]|8[16]|91)1", "(?:2[125]|4[0-246-9]|5[1-35-7]|6[1-8]|7[14]|8[16]|91)11", "(?:2[125]|4[0-246-9]|5[1-35-7]|6[1-8]|7[14]|8[16]|91)111"], 
"(0$1)", "", 0], [, "(\\d{3})(111)(\\d{3})(\\d{3})", "$1 $2 $3 $4", ["2[349]|45|54|60|72|8[2-5]|9[2-9]", "(?:2[349]|45|54|60|72|8[2-5]|9[2-9])\\d1", "(?:2[349]|45|54|60|72|8[2-5]|9[2-9])\\d11", "(?:2[349]|45|54|60|72|8[2-5]|9[2-9])\\d111"], "(0$1)", "", 0], [, "(\\d{2})(\\d{7,8})", "$1 $2", ["(?:2[125]|4[0-246-9]|5[1-35-7]|6[1-8]|7[14]|8[16]|91)[2-9]"], "(0$1)", "", 0], [, "(\\d{3})(\\d{6,7})", "$1 $2", ["2[349]|45|54|60|72|8[2-5]|9[2-9]", "(?:2[349]|45|54|60|72|8[2-5]|9[2-9])\\d[2-9]"], "(0$1)", 
"", 0], [, "(3\\d{2})(\\d{7})", "$1 $2", ["3"], "0$1", "", 0], [, "([15]\\d{3})(\\d{5,6})", "$1 $2", ["58[12]|1"], "(0$1)", "", 0], [, "(586\\d{2})(\\d{5})", "$1 $2", ["586"], "(0$1)", "", 0], [, "([89]00)(\\d{3})(\\d{2})", "$1 $2 $3", ["[89]00"], "0$1", "", 0]], , [, , "NA", "NA"], , , [, , "NA", "NA"], [, , "(?:2(?:[125]|3[2358]|4[2-4]|9[2-8])|4(?:[0-246-9]|5[3479])|5(?:[1-35-7]|4[2-467])|6(?:[1-8]|0[468])|7(?:[14]|2[236])|8(?:[16]|2[2-689]|3[23578]|4[3478]|5[2356])|9(?:1|22|3[27-9]|4[2-6]|6[3569]|9[2-7]))111\\d{6}", 
"\\d{11,12}", , , "21111825888"], , , [, , "NA", "NA"]], "PL":[, [, , "[12]\\d{6,8}|[3-57-9]\\d{8}|6\\d{5,8}", "\\d{6,9}"], [, , "(?:1[2-8]|2[2-59]|3[2-4]|4[1-468]|5[24-689]|6[1-3578]|7[14-7]|8[1-79]|9[145])\\d{7}|[12]2\\d{5}", "\\d{6,9}", , , "123456789"], [, , "(?:5[0137]|6[069]|7[2389]|88)\\d{7}", "\\d{9}", , , "512345678"], [, , "800\\d{6}", "\\d{9}", , , "800123456"], [, , "70\\d{7}", "\\d{9}", , , "701234567"], [, , "801\\d{6}", "\\d{9}", , , "801234567"], [, , "NA", "NA"], [, , "39\\d{7}", 
"\\d{9}", , , "391234567"], "PL", 48, "00", , , , , , , , [[, "(\\d{2})(\\d{3})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["[124]|3[2-4]|5[24-689]|6[1-3578]|7[14-7]|8[1-79]|9[145]"], "", "", 0], [, "(\\d{2})(\\d{1})(\\d{4})", "$1 $2 $3", ["[12]2"], "", "", 0], [, "(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", ["39|5[0137]|6[0469]|7[02389]|8[08]"], "", "", 0], [, "(\\d{3})(\\d{2})(\\d{2,3})", "$1 $2 $3", ["64"], "", "", 0], [, "(\\d{3})(\\d{3})", "$1 $2", ["64"], "", "", 0]], , [, , "64\\d{4,7}", "\\d{6,9}", , , 
"641234567"], , , [, , "NA", "NA"], [, , "NA", "NA"], , , [, , "NA", "NA"]], "PM":[, [, , "[45]\\d{5}", "\\d{6}"], [, , "41\\d{4}", "\\d{6}", , , "411234"], [, , "55\\d{4}", "\\d{6}", , , "551234"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], "PM", 508, "00", "0", , , "0", , , , [[, "([45]\\d)(\\d{2})(\\d{2})", "$1 $2 $3", , "0$1", "", 0]], , [, , "NA", "NA"], , , [, , "NA", "NA"], [, , "NA", "NA"], , , [, , "NA", "NA"]], "PR":[, [, , "[5789]\\d{9}", 
"\\d{7}(?:\\d{3})?"], [, , "(?:787|939)[2-9]\\d{6}", "\\d{7}(?:\\d{3})?", , , "7872345678"], [, , "(?:787|939)[2-9]\\d{6}", "\\d{7}(?:\\d{3})?", , , "7872345678"], [, , "8(?:00|44|55|66|77|88)[2-9]\\d{6}", "\\d{10}", , , "8002345678"], [, , "900[2-9]\\d{6}", "\\d{10}", , , "9002345678"], [, , "NA", "NA"], [, , "5(?:00|33|44|66|77)[2-9]\\d{6}", "\\d{10}", , , "5002345678"], [, , "NA", "NA"], "PR", 1, "011", "1", , , "1", , , 1, , , [, , "NA", "NA"], , "787|939", [, , "NA", "NA"], [, , "NA", "NA"], 
, , [, , "NA", "NA"]], "PS":[, [, , "[24589]\\d{7,8}|1(?:[78]\\d{8}|[49]\\d{2,3})", "\\d{4,10}"], [, , "(?:22[234789]|42[45]|82[01458]|92[369])\\d{5}", "\\d{7,8}", , , "22234567"], [, , "5[69]\\d{7}", "\\d{9}", , , "599123456"], [, , "1800\\d{6}", "\\d{10}", , , "1800123456"], [, , "1(?:4|9\\d)\\d{2}", "\\d{4,5}", , , "19123"], [, , "1700\\d{6}", "\\d{10}", , , "1700123456"], [, , "NA", "NA"], [, , "NA", "NA"], "PS", 970, "00", "0", , , "0", , , , [[, "([2489])(2\\d{2})(\\d{4})", "$1 $2 $3", ["[2489]"], 
"0$1", "", 0], [, "(5[69]\\d)(\\d{3})(\\d{3})", "$1 $2 $3", ["5"], "0$1", "", 0], [, "(1[78]00)(\\d{3})(\\d{3})", "$1 $2 $3", ["1[78]"], "$1", "", 0]], , [, , "NA", "NA"], , , [, , "NA", "NA"], [, , "NA", "NA"], , , [, , "NA", "NA"]], "PT":[, [, , "[2-46-9]\\d{8}", "\\d{9}"], [, , "2(?:[12]\\d|[35][1-689]|4[1-59]|6[1-35689]|7[1-9]|8[1-69]|9[1256])\\d{6}", "\\d{9}", , , "212345678"], [, , "9(?:[136]\\d{2}|2[0-79]\\d|480)\\d{5}", "\\d{9}", , , "912345678"], [, , "80[02]\\d{6}", "\\d{9}", , , "800123456"], 
[, , "76(?:0[1-57]|1[2-47]|2[237])\\d{5}", "\\d{9}", , , "760123456"], [, , "80(?:8\\d|9[1579])\\d{5}", "\\d{9}", , , "808123456"], [, , "884[128]\\d{5}", "\\d{9}", , , "884123456"], [, , "30\\d{7}", "\\d{9}", , , "301234567"], "PT", 351, "00", , , , , , , , [[, "(2\\d)(\\d{3})(\\d{4})", "$1 $2 $3", ["2[12]"], "", "", 0], [, "([2-46-9]\\d{2})(\\d{3})(\\d{3})", "$1 $2 $3", ["2[3-9]|[346-9]"], "", "", 0]], , [, , "NA", "NA"], , , [, , "NA", "NA"], [, , "70(?:7\\d|8[17])\\d{5}", "\\d{9}", , , "707123456"], 
, , [, , "NA", "NA"]], "PW":[, [, , "[2-8]\\d{6}", "\\d{7}"], [, , "2552255|(?:277|345|488|5(?:35|44|87)|6(?:22|54|79)|7(?:33|47)|8(?:24|55|76))\\d{4}", "\\d{7}", , , "2771234"], [, , "(?:6[234689]0|77[45789])\\d{4}", "\\d{7}", , , "6201234"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], "PW", 680, "01[12]", , , , , , , , [[, "(\\d{3})(\\d{4})", "$1 $2", , "", "", 0]], , [, , "NA", "NA"], , , [, , "NA", "NA"], [, , "NA", "NA"], , , [, , "NA", "NA"]], "PY":[, 
[, , "5[0-5]\\d{4,7}|[2-46-9]\\d{5,8}", "\\d{5,9}"], [, , "(?:[26]1|3[289]|4[124678]|7[123]|8[1236])\\d{5,7}|(?:2(?:2[4568]|7[15]|9[1-5])|3(?:18|3[167]|4[2357]|51)|4(?:18|2[45]|3[12]|5[13]|64|71|9[1-47])|5(?:[1-4]\\d|5[0234])|6(?:3[1-3]|44|7[1-4678])|7(?:17|4[0-4]|6[1-578]|75|8[0-8])|858)\\d{5,6}", "\\d{5,9}", , , "212345678"], [, , "9(?:6[12]|[78][1-6]|9[1-5])\\d{6}", "\\d{9}", , , "961456789"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "8700[0-4]\\d{4}", "\\d{9}", 
, , "870012345"], "PY", 595, "00", "0", , , "0", , , , [[, "(\\d{2})(\\d{5,7})", "$1 $2", ["(?:[26]1|3[289]|4[124678]|7[123]|8[1236])"], "($1)", "", 0], [, "(\\d{3})(\\d{3,6})", "$1 $2", ["[2-9]0"], "0$1", "", 0], [, "(\\d{3})(\\d{6})", "$1 $2", ["9[1-9]"], "0$1", "", 0], [, "(\\d{2})(\\d{3})(\\d{4})", "$1 $2 $3", ["8700"], "", "", 0], [, "(\\d{3})(\\d{4,6})", "$1 $2", ["[2-8][1-9]"], "($1)", "", 0]], , [, , "NA", "NA"], , , [, , "NA", "NA"], [, , "[2-9]0\\d{4,7}", "\\d{6,9}", , , "201234567"], , 
, [, , "NA", "NA"]], "QA":[, [, , "[2-8]\\d{6,7}", "\\d{7,8}"], [, , "4[04]\\d{6}", "\\d{7,8}", , , "44123456"], [, , "[3567]\\d{7}", "\\d{7,8}", , , "33123456"], [, , "800\\d{4}", "\\d{7,8}", , , "8001234"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], "QA", 974, "00", , , , , , , , [[, "([28]\\d{2})(\\d{4})", "$1 $2", ["[28]"], "", "", 0], [, "([3-7]\\d{3})(\\d{4})", "$1 $2", ["[3-7]"], "", "", 0]], , [, , "2(?:[12]\\d|61)\\d{4}", "\\d{7}", , , "2123456"], , , [, , "NA", 
"NA"], [, , "NA", "NA"], , , [, , "NA", "NA"]], "RE":[, [, , "[268]\\d{8}", "\\d{9}"], [, , "262\\d{6}", "\\d{9}", , , "262161234"], [, , "6(?:9[23]|47)\\d{6}", "\\d{9}", , , "692123456"], [, , "80\\d{7}", "\\d{9}", , , "801234567"], [, , "89[1-37-9]\\d{6}", "\\d{9}", , , "891123456"], [, , "8(?:1[019]|2[0156]|84|90)\\d{6}", "\\d{9}", , , "810123456"], [, , "NA", "NA"], [, , "NA", "NA"], "RE", 262, "00", "0", , , "0", , , , [[, "([268]\\d{2})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", , "0$1", "", 
0]], , [, , "NA", "NA"], 1, "262|6[49]|8", [, , "NA", "NA"], [, , "NA", "NA"], , , [, , "NA", "NA"]], "RO":[, [, , "2\\d{5,8}|[37-9]\\d{8}", "\\d{6,9}"], [, , "2(?:1(?:\\d{7}|9\\d{3})|[3-6](?:\\d{7}|\\d9\\d{2}))|3[13-6]\\d{7}", "\\d{6,9}", , , "211234567"], [, , "7(?:000|[1-8]\\d{2}|99\\d)\\d{5}", "\\d{9}", , , "712345678"], [, , "800\\d{6}", "\\d{9}", , , "800123456"], [, , "90[036]\\d{6}", "\\d{9}", , , "900123456"], [, , "801\\d{6}", "\\d{9}", , , "801123456"], [, , "802\\d{6}", "\\d{9}", , , 
"802123456"], [, , "NA", "NA"], "RO", 40, "00", "0", " int ", , "0", , , , [[, "([237]\\d)(\\d{3})(\\d{4})", "$1 $2 $3", ["[23]1"], "0$1", "", 0], [, "(21)(\\d{4})", "$1 $2", ["21"], "0$1", "", 0], [, "(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", ["[23][3-7]|[7-9]"], "0$1", "", 0], [, "(2\\d{2})(\\d{3})", "$1 $2", ["2[3-6]"], "0$1", "", 0]], , [, , "NA", "NA"], , , [, , "NA", "NA"], [, , "37\\d{7}", "\\d{9}", , , "372123456"], , , [, , "NA", "NA"]], "RS":[, [, , "[126-9]\\d{4,11}|3(?:[0-79]\\d{3,10}|8[2-9]\\d{2,9})", 
"\\d{5,12}"], [, , "(?:1(?:[02-9][2-9]|1[1-9])\\d|2(?:[0-24-7][2-9]\\d|[389](?:0[2-9]|[2-9]\\d))|3(?:[0-8][2-9]\\d|9(?:[2-9]\\d|0[2-9])))\\d{3,8}", "\\d{5,12}", , , "10234567"], [, , "6(?:[0-689]|7\\d)\\d{6,7}", "\\d{8,10}", , , "601234567"], [, , "800\\d{3,9}", "\\d{6,12}", , , "80012345"], [, , "(?:90[0169]|78\\d)\\d{3,7}", "\\d{6,12}", , , "90012345"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], "RS", 381, "00", "0", , , "0", , , , [[, "([23]\\d{2})(\\d{4,9})", "$1 $2", ["(?:2[389]|39)0"], 
"0$1", "", 0], [, "([1-3]\\d)(\\d{5,10})", "$1 $2", ["1|2(?:[0-24-7]|[389][1-9])|3(?:[0-8]|9[1-9])"], "0$1", "", 0], [, "(6\\d)(\\d{6,8})", "$1 $2", ["6"], "0$1", "", 0], [, "([89]\\d{2})(\\d{3,9})", "$1 $2", ["[89]"], "0$1", "", 0], [, "(7[26])(\\d{4,9})", "$1 $2", ["7[26]"], "0$1", "", 0], [, "(7[08]\\d)(\\d{4,9})", "$1 $2", ["7[08]"], "0$1", "", 0]], , [, , "NA", "NA"], , , [, , "NA", "NA"], [, , "7[06]\\d{4,10}", "\\d{6,12}", , , "700123456"], , , [, , "NA", "NA"]], "RU":[, [, , "[3489]\\d{9}", 
"\\d{10}"], [, , "(?:3(?:0[12]|4[1-35-79]|5[1-3]|8[1-58]|9[0145])|4(?:01|1[1356]|2[13467]|7[1-5]|8[1-7]|9[1-689])|8(?:1[1-8]|2[01]|3[13-6]|4[0-8]|5[15]|6[1-35-7]|7[1-37-9]))\\d{7}", "\\d{10}", , , "3011234567"], [, , "9\\d{9}", "\\d{10}", , , "9123456789"], [, , "80[04]\\d{7}", "\\d{10}", , , "8001234567"], [, , "80[39]\\d{7}", "\\d{10}", , , "8091234567"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], "RU", 7, "810", "8", , , "8", , "8~10", , [[, "(\\d{3})(\\d{2})(\\d{2})", "$1-$2-$3", ["[1-79]"], 
"$1", "", 1], [, "([3489]\\d{2})(\\d{3})(\\d{2})(\\d{2})", "$1 $2-$3-$4", ["[34689]"], "8 ($1)", "", 1], [, "(7\\d{2})(\\d{3})(\\d{4})", "$1 $2 $3", ["7"], "8 ($1)", "", 1]], [[, "([3489]\\d{2})(\\d{3})(\\d{2})(\\d{2})", "$1 $2-$3-$4", ["[34689]"], "8 ($1)", "", 1], [, "(7\\d{2})(\\d{3})(\\d{4})", "$1 $2 $3", ["7"], "8 ($1)", "", 1]], [, , "NA", "NA"], 1, , [, , "NA", "NA"], [, , "NA", "NA"], , , [, , "NA", "NA"]], "RW":[, [, , "[027-9]\\d{7,8}", "\\d{8,9}"], [, , "2[258]\\d{7}|06\\d{6}", "\\d{8,9}", 
, , "250123456"], [, , "7[238]\\d{7}", "\\d{9}", , , "720123456"], [, , "800\\d{6}", "\\d{9}", , , "800123456"], [, , "900\\d{6}", "\\d{9}", , , "900123456"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], "RW", 250, "00", "0", , , "0", , , , [[, "(2\\d{2})(\\d{3})(\\d{3})", "$1 $2 $3", ["2"], "$1", "", 0], [, "([7-9]\\d{2})(\\d{3})(\\d{3})", "$1 $2 $3", ["[7-9]"], "0$1", "", 0], [, "(0\\d)(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["0"], "", "", 0]], , [, , "NA", "NA"], , , [, , "NA", "NA"], 
[, , "NA", "NA"], 1, , [, , "NA", "NA"]], "SA":[, [, , "1\\d{7,8}|(?:[2-467]|92)\\d{7}|5\\d{8}|8\\d{9}", "\\d{7,10}"], [, , "11\\d{7}|1?(?:2[24-8]|3[35-8]|4[3-68]|6[2-5]|7[235-7])\\d{6}", "\\d{7,9}", , , "112345678"], [, , "(?:5(?:[013-689]\\d|7[0-26-8])|811\\d)\\d{6}", "\\d{9,10}", , , "512345678"], [, , "800\\d{7}", "\\d{10}", , , "8001234567"], [, , "NA", "NA"], [, , "92[05]\\d{6}", "\\d{9}", , , "920012345"], [, , "NA", "NA"], [, , "NA", "NA"], "SA", 966, "00", "0", , , "0", , , , [[, "([1-467])(\\d{3})(\\d{4})", 
"$1 $2 $3", ["[1-467]"], "0$1", "", 0], [, "(1\\d)(\\d{3})(\\d{4})", "$1 $2 $3", ["1[1-467]"], "0$1", "", 0], [, "(5\\d)(\\d{3})(\\d{4})", "$1 $2 $3", ["5"], "0$1", "", 0], [, "(92\\d{2})(\\d{5})", "$1 $2", ["92"], "$1", "", 0], [, "(800)(\\d{3})(\\d{4})", "$1 $2 $3", ["80"], "$1", "", 0], [, "(811)(\\d{3})(\\d{3,4})", "$1 $2 $3", ["81"], "0$1", "", 0]], , [, , "NA", "NA"], , , [, , "NA", "NA"], [, , "NA", "NA"], , , [, , "NA", "NA"]], "SB":[, [, , "[1-9]\\d{4,6}", "\\d{5,7}"], [, , "(?:1[4-79]|[23]\\d|4[01]|5[03]|6[0-37])\\d{3}", 
"\\d{5}", , , "40123"], [, , "48\\d{3}|7(?:[0146-8]\\d|5[025-9]|9[0124])\\d{4}|8[4-8]\\d{5}|9(?:[46]\\d|5[0-46-9]|7[0-689]|8[0-79]|9[0-8])\\d{4}", "\\d{5,7}", , , "7421234"], [, , "1[38]\\d{3}", "\\d{5}", , , "18123"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "5[12]\\d{3}", "\\d{5}", , , "51123"], "SB", 677, "0[01]", , , , , , , , [[, "(\\d{2})(\\d{5})", "$1 $2", ["[7-9]"], "", "", 0]], , [, , "NA", "NA"], , , [, , "NA", "NA"], [, , "NA", "NA"], , , [, , "NA", "NA"]], "SC":[, [, 
, "[24689]\\d{5,6}", "\\d{6,7}"], [, , "4[2-46]\\d{5}", "\\d{7}", , , "4217123"], [, , "2[5-8]\\d{5}", "\\d{7}", , , "2510123"], [, , "8000\\d{2}", "\\d{6}", , , "800000"], [, , "98\\d{4}", "\\d{6}", , , "981234"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "64\\d{5}", "\\d{7}", , , "6412345"], "SC", 248, "0[0-2]", , , , , , "00", , [[, "(\\d{3})(\\d{3})", "$1 $2", ["[89]"], "", "", 0], [, "(\\d)(\\d{3})(\\d{3})", "$1 $2 $3", ["[246]"], "", "", 0]], , [, , "NA", "NA"], , , [, , "NA", "NA"], [, , "NA", 
"NA"], , , [, , "NA", "NA"]], "SD":[, [, , "[19]\\d{8}", "\\d{9}"], [, , "1(?:[125]\\d|8[3567])\\d{6}", "\\d{9}", , , "121231234"], [, , "9[012569]\\d{7}", "\\d{9}", , , "911231234"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], "SD", 249, "00", "0", , , "0", , , , [[, "(\\d{2})(\\d{3})(\\d{4})", "$1 $2 $3", , "0$1", "", 0]], , [, , "NA", "NA"], , , [, , "NA", "NA"], [, , "NA", "NA"], , , [, , "NA", "NA"]], "SE":[, [, , "[1-9]\\d{5,9}", "\\d{5,10}"], [, 
, "1(?:0[1-8]\\d{6}|[136]\\d{5,7}|(?:2[0-35]|4[0-4]|5[0-25-9]|7[13-6]|[89]\\d)\\d{5,6})|2(?:[136]\\d{5,7}|(?:2[0-7]|4[0136-8]|5[0138]|7[018]|8[01]|9[0-57])\\d{5,6})|3(?:[356]\\d{5,7}|(?:0[0-4]|1\\d|2[0-25]|4[056]|7[0-2]|8[0-3]|9[023])\\d{5,6})|4(?:0[1-9]\\d{4,6}|[246]\\d{5,7}|(?:1[013-8]|3[0135]|5[14-79]|7[0-246-9]|8[0156]|9[0-689])\\d{5,6})|5(?:0[0-6]|[15][0-5]|2[0-68]|3[0-4]|4\\d|6[03-5]|7[013]|8[0-79]|9[01])\\d{5,6}|6(?:0[1-9]\\d{4,6}|3\\d{5,7}|(?:1[1-3]|2[0-4]|4[02-57]|5[0-37]|6[0-3]|7[0-2]|8[0247]|9[0-356])\\d{5,6})|8[1-9]\\d{5,7}|9(?:0[1-9]\\d{4,6}|(?:1[0-68]|2\\d|3[02-5]|4[0-3]|5[0-4]|[68][01]|7[0135-8])\\d{5,6})", 
"\\d{5,9}", , , "8123456"], [, , "7[0236]\\d{7}", "\\d{9}", , , "701234567"], [, , "20(?:0(?:0\\d{2}|[1-9](?:0\\d{1,4}|[1-9]\\d{4}))|1(?:0\\d{4}|[1-9]\\d{4,5})|[2-9]\\d{5})", "\\d{6,9}", , , "20123456"], [, , "9(?:00|39|44)(?:1(?:[0-26]\\d{5}|[3-57-9]\\d{2})|2(?:[0-2]\\d{5}|[3-9]\\d{2})|3(?:[0139]\\d{5}|[24-8]\\d{2})|4(?:[045]\\d{5}|[1-36-9]\\d{2})|5(?:5\\d{5}|[0-46-9]\\d{2})|6(?:[679]\\d{5}|[0-58]\\d{2})|7(?:[078]\\d{5}|[1-69]\\d{2})|8(?:[578]\\d{5}|[0-469]\\d{2}))", "\\d{7}(?:\\d{3})?", , , "9001234567"], 
[, , "77(?:0(?:0\\d{2}|[1-9](?:0\\d|[1-9]\\d{4}))|[1-6][1-9]\\d{5})", "\\d{6}(?:\\d{3})?", , , "771234567"], [, , "75[1-8]\\d{6}", "\\d{9}", , , "751234567"], [, , "NA", "NA"], "SE", 46, "00", "0", , , "0", , , , [[, "(8)(\\d{2,3})(\\d{2,3})(\\d{2})", "$1-$2 $3 $4", ["8"], "0$1", "", 0], [, "([1-69]\\d)(\\d{2,3})(\\d{2})(\\d{2})", "$1-$2 $3 $4", ["1[013689]|2[0136]|3[1356]|4[0246]|54|6[03]|90"], "0$1", "", 0], [, "([1-69]\\d)(\\d{3})(\\d{2})", "$1-$2 $3", ["1[13689]|2[136]|3[1356]|4[0246]|54|6[03]|90"], 
"0$1", "", 0], [, "(\\d{3})(\\d{2})(\\d{2})(\\d{2})", "$1-$2 $3 $4", ["1[2457]|2[2457-9]|3[0247-9]|4[1357-9]|5[0-35-9]|6[124-9]|9(?:[125-8]|3[0-5]|4[0-3])"], "0$1", "", 0], [, "(\\d{3})(\\d{2,3})(\\d{2})", "$1-$2 $3", ["1[2457]|2[2457-9]|3[0247-9]|4[1357-9]|5[0-35-9]|6[124-9]|9(?:[125-8]|3[0-5]|4[0-3])"], "0$1", "", 0], [, "(7\\d)(\\d{3})(\\d{2})(\\d{2})", "$1-$2 $3 $4", ["7"], "0$1", "", 0], [, "(77)(\\d{2})(\\d{2})", "$1-$2$3", ["7"], "0$1", "", 0], [, "(20)(\\d{2,3})(\\d{2})", "$1-$2 $3", ["20"], 
"0$1", "", 0], [, "(9[034]\\d)(\\d{2})(\\d{2})(\\d{3})", "$1-$2 $3 $4", ["9[034]"], "0$1", "", 0], [, "(9[034]\\d)(\\d{4})", "$1-$2", ["9[034]"], "0$1", "", 0]], [[, "(8)(\\d{2,3})(\\d{2,3})(\\d{2})", "$1 $2 $3 $4", ["8"]], [, "([1-69]\\d)(\\d{2,3})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["1[013689]|2[0136]|3[1356]|4[0246]|54|6[03]|90"]], [, "([1-69]\\d)(\\d{3})(\\d{2})", "$1 $2 $3", ["1[13689]|2[136]|3[1356]|4[0246]|54|6[03]|90"]], [, "(\\d{3})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["1[2457]|2[2457-9]|3[0247-9]|4[1357-9]|5[0-35-9]|6[124-9]|9(?:[125-8]|3[0-5]|4[0-3])"]], 
[, "(\\d{3})(\\d{2,3})(\\d{2})", "$1 $2 $3", ["1[2457]|2[2457-9]|3[0247-9]|4[1357-9]|5[0-35-9]|6[124-9]|9(?:[125-8]|3[0-5]|4[0-3])"]], [, "(7\\d)(\\d{3})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["7"]], [, "(77)(\\d{2})(\\d{2})", "$1 $2 $3", ["7"]], [, "(20)(\\d{2,3})(\\d{2})", "$1 $2 $3", ["20"]], [, "(9[034]\\d)(\\d{2})(\\d{2})(\\d{3})", "$1 $2 $3 $4", ["9[034]"]], [, "(9[034]\\d)(\\d{4})", "$1 $2", ["9[034]"]]], [, , "74[02-9]\\d{6}", "\\d{9}", , , "740123456"], , , [, , "NA", "NA"], [, , "NA", "NA"], 
, , [, , "NA", "NA"]], "SG":[, [, , "[36]\\d{7}|[17-9]\\d{7,10}", "\\d{8,11}"], [, , "6[1-9]\\d{6}", "\\d{8}", , , "61234567"], [, , "(?:8[1-7]|9[0-8])\\d{6}", "\\d{8}", , , "81234567"], [, , "1?800\\d{7}", "\\d{10,11}", , , "18001234567"], [, , "1900\\d{7}", "\\d{11}", , , "19001234567"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "3[12]\\d{6}", "\\d{8}", , , "31234567"], "SG", 65, "0[0-3]\\d", , , , , , , , [[, "([3689]\\d{3})(\\d{4})", "$1 $2", ["[369]|8[1-9]"], "", "", 0], [, "(1[89]00)(\\d{3})(\\d{4})", 
"$1 $2 $3", ["1[89]"], "", "", 0], [, "(7000)(\\d{4})(\\d{3})", "$1 $2 $3", ["70"], "", "", 0], [, "(800)(\\d{3})(\\d{4})", "$1 $2 $3", ["80"], "", "", 0]], , [, , "NA", "NA"], , , [, , "NA", "NA"], [, , "7000\\d{7}", "\\d{11}", , , "70001234567"], , , [, , "NA", "NA"]], "SH":[, [, , "[2-79]\\d{3,4}", "\\d{4,5}"], [, , "2(?:[0-57-9]\\d|6[4-9])\\d{2}|(?:[2-46]\\d|7[01])\\d{2}", "\\d{4,5}", , , "2158"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "(?:[59]\\d|7[2-9])\\d{2}", "\\d{4,5}", , , "5012"], [, 
, "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], "SH", 290, "00", , , , , , , , , , [, , "NA", "NA"], 1, , [, , "NA", "NA"], [, , "NA", "NA"], , , [, , "NA", "NA"]], "SI":[, [, , "[1-7]\\d{6,7}|[89]\\d{4,7}", "\\d{5,8}"], [, , "(?:1\\d|[25][2-8]|3[4-8]|4[24-8]|7[3-8])\\d{6}", "\\d{7,8}", , , "11234567"], [, , "(?:[37][01]|4[0139]|51|6[48])\\d{6}", "\\d{8}", , , "31234567"], [, , "80\\d{4,6}", "\\d{6,8}", , , "80123456"], [, , "90\\d{4,6}|89[1-3]\\d{2,5}", "\\d{5,8}", , , "90123456"], [, , "NA", 
"NA"], [, , "NA", "NA"], [, , "(?:59|8[1-3])\\d{6}", "\\d{8}", , , "59012345"], "SI", 386, "00", "0", , , "0", , , , [[, "(\\d)(\\d{3})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["[12]|3[4-8]|4[24-8]|5[2-8]|7[3-8]"], "(0$1)", "", 0], [, "([3-7]\\d)(\\d{3})(\\d{3})", "$1 $2 $3", ["[37][01]|4[0139]|51|6"], "0$1", "", 0], [, "([89][09])(\\d{3,6})", "$1 $2", ["[89][09]"], "0$1", "", 0], [, "([58]\\d{2})(\\d{5})", "$1 $2", ["59|8[1-3]"], "0$1", "", 0]], , [, , "NA", "NA"], , , [, , "NA", "NA"], [, , "NA", "NA"], 
, , [, , "NA", "NA"]], "SJ":[, [, , "0\\d{4}|[4789]\\d{7}", "\\d{5}(?:\\d{3})?"], [, , "79\\d{6}", "\\d{8}", , , "79123456"], [, , "(?:4[015-8]|5[89]|9\\d)\\d{6}", "\\d{8}", , , "41234567"], [, , "80[01]\\d{5}", "\\d{8}", , , "80012345"], [, , "82[09]\\d{5}", "\\d{8}", , , "82012345"], [, , "810(?:0[0-6]|[2-8]\\d)\\d{3}", "\\d{8}", , , "81021234"], [, , "880\\d{5}", "\\d{8}", , , "88012345"], [, , "85[0-5]\\d{5}", "\\d{8}", , , "85012345"], "SJ", 47, "00", , , , , , , , , , [, , "NA", "NA"], , , 
[, , "NA", "NA"], [, , "0\\d{4}|81(?:0(?:0[7-9]|1\\d)|5\\d{2})\\d{3}", "\\d{5}(?:\\d{3})?", , , "01234"], 1, , [, , "81[23]\\d{5}", "\\d{8}", , , "81212345"]], "SK":[, [, , "[2-689]\\d{8}", "\\d{9}"], [, , "[2-5]\\d{8}", "\\d{9}", , , "212345678"], [, , "9(?:0[1-8]|1[0-24-9]|4[0489])\\d{6}", "\\d{9}", , , "912123456"], [, , "800\\d{6}", "\\d{9}", , , "800123456"], [, , "9(?:[78]\\d{7}|00\\d{6})", "\\d{9}", , , "900123456"], [, , "8[5-9]\\d{7}", "\\d{9}", , , "850123456"], [, , "NA", "NA"], [, , "6(?:5[0-4]|9[0-6])\\d{6}", 
"\\d{9}", , , "690123456"], "SK", 421, "00", "0", , , "0", , , , [[, "(2)(\\d{3})(\\d{3})(\\d{2})", "$1/$2 $3 $4", ["2"], "0$1", "", 0], [, "([3-5]\\d)(\\d{3})(\\d{2})(\\d{2})", "$1/$2 $3 $4", ["[3-5]"], "0$1", "", 0], [, "([689]\\d{2})(\\d{3})(\\d{3})", "$1 $2 $3", ["[689]"], "0$1", "", 0]], , [, , "NA", "NA"], , , [, , "(?:8(?:00|[5-9]\\d)|9(?:00|[78]\\d))\\d{6}", "\\d{9}", , , "800123456"], [, , "96\\d{7}", "\\d{9}", , , "961234567"], , , [, , "NA", "NA"]], "SL":[, [, , "[2-578]\\d{7}", "\\d{6,8}"], 
[, , "[235]2[2-4][2-9]\\d{4}", "\\d{6,8}", , , "22221234"], [, , "(?:2[15]|3[034]|4[04]|5[05]|7[6-9]|88)\\d{6}", "\\d{6,8}", , , "25123456"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], "SL", 232, "00", "0", , , "0", , , , [[, "(\\d{2})(\\d{6})", "$1 $2", , "(0$1)", "", 0]], , [, , "NA", "NA"], , , [, , "NA", "NA"], [, , "NA", "NA"], , , [, , "NA", "NA"]], "SM":[, [, , "[05-7]\\d{7,9}", "\\d{6,10}"], [, , "0549(?:8[0157-9]|9\\d)\\d{4}", "\\d{6,10}", , 
, "0549886377"], [, , "6[16]\\d{6}", "\\d{8}", , , "66661212"], [, , "NA", "NA"], [, , "7[178]\\d{6}", "\\d{8}", , , "71123456"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "5[158]\\d{6}", "\\d{8}", , , "58001110"], "SM", 378, "00", , , , "(?:0549)?([89]\\d{5})", "0549$1", , , [[, "(\\d{2})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["[5-7]"], "", "", 0], [, "(0549)(\\d{6})", "$1 $2", ["0"], "", "", 0], [, "(\\d{6})", "0549 $1", ["[89]"], "", "", 0]], [[, "(\\d{2})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", 
["[5-7]"], "", "", 0], [, "(0549)(\\d{6})", "($1) $2", ["0"]], [, "(\\d{6})", "(0549) $1", ["[89]"]]], [, , "NA", "NA"], , , [, , "NA", "NA"], [, , "NA", "NA"], 1, , [, , "NA", "NA"]], "SN":[, [, , "[3789]\\d{8}", "\\d{9}"], [, , "3(?:0(?:1[0-2]|80)|282|3(?:8[1-9]|9[3-9])|611|90[1-5])\\d{5}", "\\d{9}", , , "301012345"], [, , "7(?:[067]\\d|21|8[0-26]|90)\\d{6}", "\\d{9}", , , "701234567"], [, , "800\\d{6}", "\\d{9}", , , "800123456"], [, , "88[4689]\\d{6}", "\\d{9}", , , "884123456"], [, , "81[02468]\\d{6}", 
"\\d{9}", , , "810123456"], [, , "NA", "NA"], [, , "3392\\d{5}|93330\\d{4}", "\\d{9}", , , "933301234"], "SN", 221, "00", , , , , , , , [[, "(\\d{2})(\\d{3})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["[379]"], "", "", 0], [, "(\\d{3})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["8"], "", "", 0]], , [, , "NA", "NA"], , , [, , "NA", "NA"], [, , "NA", "NA"], , , [, , "NA", "NA"]], "SO":[, [, , "[1-79]\\d{6,8}", "\\d{7,9}"], [, , "(?:1\\d|2[0-79]|3[0-46-8]|4[0-7]|59)\\d{5}", "\\d{7}", , , "4012345"], [, , "(?:15\\d|2(?:4\\d|8)|6[137-9]?\\d{2}|7[1-9]\\d|907\\d)\\d{5}", 
"\\d{7,9}", , , "71123456"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], "SO", 252, "00", "0", , , "0", , , , [[, "(\\d)(\\d{6})", "$1 $2", ["2[0-79]|[13-5]"], "", "", 0], [, "(\\d)(\\d{7})", "$1 $2", ["24|[67]"], "", "", 0], [, "(\\d{2})(\\d{5,7})", "$1 $2", ["15|28|6[1378]"], "", "", 0], [, "(69\\d)(\\d{6})", "$1 $2", ["69"], "", "", 0], [, "(90\\d)(\\d{3})(\\d{3})", "$1 $2 $3", ["90"], "", "", 0]], , [, , "NA", "NA"], , , [, , "NA", "NA"], [, , "NA", 
"NA"], , , [, , "NA", "NA"]], "SR":[, [, , "[2-8]\\d{5,6}", "\\d{6,7}"], [, , "(?:2[1-3]|3[0-7]|4\\d|5[2-58]|68\\d)\\d{4}", "\\d{6,7}", , , "211234"], [, , "(?:7[124-7]|8[1-9])\\d{5}", "\\d{7}", , , "7412345"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "5(?:6\\d{4}|90[0-4]\\d{3})", "\\d{6,7}", , , "561234"], "SR", 597, "00", , , , , , , , [[, "(\\d{3})(\\d{3})", "$1-$2", ["[2-4]|5[2-58]"], "", "", 0], [, "(\\d{2})(\\d{2})(\\d{2})", "$1-$2-$3", ["56"], "", "", 0], 
[, "(\\d{3})(\\d{4})", "$1-$2", ["59|[6-8]"], "", "", 0]], , [, , "NA", "NA"], , , [, , "NA", "NA"], [, , "NA", "NA"], , , [, , "NA", "NA"]], "SS":[, [, , "[19]\\d{8}", "\\d{9}"], [, , "18\\d{7}", "\\d{9}", , , "181234567"], [, , "(?:12|9[1257])\\d{7}", "\\d{9}", , , "977123456"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], "SS", 211, "00", "0", , , "0", , , , [[, "(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", , "0$1", "", 0]], , [, , "NA", "NA"], , , [, , "NA", 
"NA"], [, , "NA", "NA"], , , [, , "NA", "NA"]], "ST":[, [, , "[29]\\d{6}", "\\d{7}"], [, , "22\\d{5}", "\\d{7}", , , "2221234"], [, , "9[89]\\d{5}", "\\d{7}", , , "9812345"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], "ST", 239, "00", , , , , , , , [[, "(\\d{3})(\\d{4})", "$1 $2", , "", "", 0]], , [, , "NA", "NA"], , , [, , "NA", "NA"], [, , "NA", "NA"], , , [, , "NA", "NA"]], "SV":[, [, , "[267]\\d{7}|[89]\\d{6}(?:\\d{4})?", "\\d{7,8}|\\d{11}"], [, 
, "2[1-6]\\d{6}", "\\d{8}", , , "21234567"], [, , "[67]\\d{7}", "\\d{8}", , , "70123456"], [, , "800\\d{4}(?:\\d{4})?", "\\d{7}(?:\\d{4})?", , , "8001234"], [, , "900\\d{4}(?:\\d{4})?", "\\d{7}(?:\\d{4})?", , , "9001234"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], "SV", 503, "00", , , , , , , , [[, "(\\d{4})(\\d{4})", "$1 $2", ["[267]"], "", "", 0], [, "(\\d{3})(\\d{4})", "$1 $2", ["[89]"], "", "", 0], [, "(\\d{3})(\\d{4})(\\d{4})", "$1 $2 $3", ["[89]"], "", "", 0]], , [, , "NA", "NA"], 
, , [, , "NA", "NA"], [, , "NA", "NA"], , , [, , "NA", "NA"]], "SX":[, [, , "[5789]\\d{9}", "\\d{7}(?:\\d{3})?"], [, , "7215(?:4[2-8]|8[239]|9[056])\\d{4}", "\\d{7}(?:\\d{3})?", , , "7215425678"], [, , "7215(?:1[02]|2\\d|5[034679]|8[014-8])\\d{4}", "\\d{10}", , , "7215205678"], [, , "8(?:00|44|55|66|77|88)[2-9]\\d{6}", "\\d{10}", , , "8002123456"], [, , "900[2-9]\\d{6}", "\\d{10}", , , "9002123456"], [, , "NA", "NA"], [, , "5(?:00|33|44|66|77)[2-9]\\d{6}", "\\d{10}", , , "5002345678"], [, , "NA", 
"NA"], "SX", 1, "011", "1", , , "1", , , , , , [, , "NA", "NA"], , "721", [, , "NA", "NA"], [, , "NA", "NA"], , , [, , "NA", "NA"]], "SY":[, [, , "[1-59]\\d{7,8}", "\\d{6,9}"], [, , "(?:1(?:1\\d?|4\\d|[2356])|2(?:1\\d?|[235])|3(?:[13]\\d|4)|4[13]|5[1-3])\\d{6}", "\\d{6,9}", , , "112345678"], [, , "9(?:22|[35][0-8]|4\\d|6[024-9]|88|9[0-489])\\d{6}", "\\d{9}", , , "944567890"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], "SY", 963, "00", "0", , , "0", , 
, , [[, "(\\d{2})(\\d{3})(\\d{3,4})", "$1 $2 $3", ["[1-5]"], "0$1", "", 1], [, "(9\\d{2})(\\d{3})(\\d{3})", "$1 $2 $3", ["9"], "0$1", "", 1]], , [, , "NA", "NA"], , , [, , "NA", "NA"], [, , "NA", "NA"], , , [, , "NA", "NA"]], "SZ":[, [, , "[027]\\d{7}", "\\d{8}"], [, , "2(?:2(?:0[07]|[13]7|2[57])|3(?:0[34]|[1278]3|3[23]|[46][34])|(?:40[4-69]|67)|5(?:0[5-7]|1[6-9]|[23][78]|48|5[01]))\\d{4}", "\\d{8}", , , "22171234"], [, , "7[6-8]\\d{6}", "\\d{8}", , , "76123456"], [, , "0800\\d{4}", "\\d{8}", , , 
"08001234"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], "SZ", 268, "00", , , , , , , , [[, "(\\d{4})(\\d{4})", "$1 $2", ["[027]"], "", "", 0]], , [, , "NA", "NA"], , , [, , "0800\\d{4}", "\\d{8}", , , "08001234"], [, , "NA", "NA"], 1, , [, , "NA", "NA"]], "TA":[, [, , "8\\d{3}", "\\d{4}"], [, , "8\\d{3}", "\\d{4}", , , "8999"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], "TA", 290, "00", , , , , , , , , , 
[, , "NA", "NA"], , , [, , "NA", "NA"], [, , "NA", "NA"], , , [, , "NA", "NA"]], "TC":[, [, , "[5689]\\d{9}", "\\d{7}(?:\\d{3})?"], [, , "649(?:712|9(?:4\\d|50))\\d{4}", "\\d{7}(?:\\d{3})?", , , "6497121234"], [, , "649(?:2(?:3[129]|4[1-7])|3(?:3[1-389]|4[1-7])|4[34][1-3])\\d{4}", "\\d{10}", , , "6492311234"], [, , "8(?:00|44|55|66|77|88)[2-9]\\d{6}", "\\d{10}", , , "8002345678"], [, , "900[2-9]\\d{6}", "\\d{10}", , , "9002345678"], [, , "NA", "NA"], [, , "5(?:00|33|44|66|77)[2-9]\\d{6}", "\\d{10}", 
, , "5002345678"], [, , "64971[01]\\d{4}", "\\d{10}", , , "6497101234"], "TC", 1, "011", "1", , , "1", , , , , , [, , "NA", "NA"], , "649", [, , "NA", "NA"], [, , "NA", "NA"], , , [, , "NA", "NA"]], "TD":[, [, , "[2679]\\d{7}", "\\d{8}"], [, , "22(?:[3789]0|5[0-5]|6[89])\\d{4}", "\\d{8}", , , "22501234"], [, , "(?:6[02368]\\d|77\\d|9(?:5[0-4]|9\\d))\\d{5}", "\\d{8}", , , "63012345"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], "TD", 235, "00|16", , , 
, , , "00", , [[, "(\\d{2})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", , "", "", 0]], , [, , "NA", "NA"], , , [, , "NA", "NA"], [, , "NA", "NA"], , , [, , "NA", "NA"]], "TG":[, [, , "[29]\\d{7}", "\\d{8}"], [, , "2(?:2[2-7]|3[23]|44|55|66|77)\\d{5}", "\\d{8}", , , "22212345"], [, , "9[0-389]\\d{6}", "\\d{8}", , , "90112345"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], "TG", 228, "00", , , , , , , , [[, "(\\d{2})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", 
, "", "", 0]], , [, , "NA", "NA"], , , [, , "NA", "NA"], [, , "NA", "NA"], , , [, , "NA", "NA"]], "TH":[, [, , "[2-9]\\d{7,8}|1\\d{3}(?:\\d{5,6})?", "\\d{4}|\\d{8,10}"], [, , "(?:2\\d|3[2-9]|4[2-5]|5[2-6]|7[3-7])\\d{6}", "\\d{8}", , , "21234567"], [, , "(?:14|6[1-3]|[89]\\d)\\d{7}", "\\d{9}", , , "812345678"], [, , "1800\\d{6}", "\\d{10}", , , "1800123456"], [, , "1900\\d{6}", "\\d{10}", , , "1900123456"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "6[08]\\d{7}", "\\d{9}", , , "601234567"], "TH", 66, 
"00", "0", , , "0", , , , [[, "(2)(\\d{3})(\\d{4})", "$1 $2 $3", ["2"], "0$1", "", 0], [, "([13-9]\\d)(\\d{3})(\\d{3,4})", "$1 $2 $3", ["14|[3-9]"], "0$1", "", 0], [, "(1[89]00)(\\d{3})(\\d{3})", "$1 $2 $3", ["1"], "$1", "", 0]], , [, , "NA", "NA"], , , [, , "1\\d{3}", "\\d{4}", , , "1100"], [, , "1\\d{3}", "\\d{4}", , , "1100"], , , [, , "NA", "NA"]], "TJ":[, [, , "[3-59]\\d{8}", "\\d{3,9}"], [, , "(?:3(?:1[3-5]|2[245]|3[12]|4[24-7]|5[25]|72)|4(?:46|74|87))\\d{6}", "\\d{3,9}", , , "372123456"], 
[, , "(?:50[125]|9[0-35-9]\\d)\\d{6}", "\\d{9}", , , "917123456"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], "TJ", 992, "810", "8", , , "8", , "8~10", , [[, "([349]\\d{2})(\\d{2})(\\d{4})", "$1 $2 $3", ["[34]7|91[78]"], "(8) $1", "", 1], [, "([459]\\d)(\\d{3})(\\d{4})", "$1 $2 $3", ["4[48]|5|9(?:1[59]|[0235-9])"], "(8) $1", "", 1], [, "(331700)(\\d)(\\d{2})", "$1 $2 $3", ["331", "3317", "33170", "331700"], "(8) $1", "", 1], [, "(\\d{4})(\\d)(\\d{4})", 
"$1 $2 $3", ["3[1-5]", "3(?:[1245]|3(?:[02-9]|1[0-589]))"], "(8) $1", "", 1]], , [, , "NA", "NA"], , , [, , "NA", "NA"], [, , "NA", "NA"], , , [, , "NA", "NA"]], "TK":[, [, , "[2-9]\\d{3}", "\\d{4}"], [, , "[2-4]\\d{3}", "\\d{4}", , , "3010"], [, , "[5-9]\\d{3}", "\\d{4}", , , "5190"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], "TK", 690, "00", , , , , , , , , , [, , "NA", "NA"], , , [, , "NA", "NA"], [, , "NA", "NA"], , , [, , "NA", "NA"]], "TL":[, 
[, , "[2-489]\\d{6}|7\\d{6,7}", "\\d{7,8}"], [, , "(?:2[1-5]|3[1-9]|4[1-4])\\d{5}", "\\d{7}", , , "2112345"], [, , "7[3-8]\\d{6}", "\\d{8}", , , "77212345"], [, , "80\\d{5}", "\\d{7}", , , "8012345"], [, , "90\\d{5}", "\\d{7}", , , "9012345"], [, , "NA", "NA"], [, , "70\\d{5}", "\\d{7}", , , "7012345"], [, , "NA", "NA"], "TL", 670, "00", , , , , , , , [[, "(\\d{3})(\\d{4})", "$1 $2", ["[2-489]"], "", "", 0], [, "(\\d{4})(\\d{4})", "$1 $2", ["7"], "", "", 0]], , [, , "NA", "NA"], , , [, , "NA", "NA"], 
[, , "NA", "NA"], , , [, , "NA", "NA"]], "TM":[, [, , "[1-6]\\d{7}", "\\d{8}"], [, , "(?:1(?:2\\d|3[1-9])|2(?:22|4[0-35-8])|3(?:22|4[03-9])|4(?:22|3[128]|4\\d|6[15])|5(?:22|5[7-9]|6[014-689]))\\d{5}", "\\d{8}", , , "12345678"], [, , "6[2-8]\\d{6}", "\\d{8}", , , "66123456"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], "TM", 993, "810", "8", , , "8", , "8~10", , [[, "(\\d{2})(\\d{2})(\\d{2})(\\d{2})", "$1 $2-$3-$4", ["12"], "(8 $1)", "", 0], [, "(\\d{2})(\\d{6})", 
"$1 $2", ["6"], "8 $1", "", 0], [, "(\\d{3})(\\d)(\\d{2})(\\d{2})", "$1 $2-$3-$4", ["13|[2-5]"], "(8 $1)", "", 0]], , [, , "NA", "NA"], , , [, , "NA", "NA"], [, , "NA", "NA"], , , [, , "NA", "NA"]], "TN":[, [, , "[2-57-9]\\d{7}", "\\d{8}"], [, , "3[012]\\d{6}|7\\d{7}|81200\\d{3}", "\\d{8}", , , "71234567"], [, , "(?:[259]\\d|4[0-24])\\d{6}", "\\d{8}", , , "20123456"], [, , "8010\\d{4}", "\\d{8}", , , "80101234"], [, , "88\\d{6}", "\\d{8}", , , "88123456"], [, , "8[12]10\\d{4}", "\\d{8}", , , "81101234"], 
[, , "NA", "NA"], [, , "NA", "NA"], "TN", 216, "00", , , , , , , , [[, "(\\d{2})(\\d{3})(\\d{3})", "$1 $2 $3", , "", "", 0]], , [, , "NA", "NA"], , , [, , "NA", "NA"], [, , "NA", "NA"], , , [, , "NA", "NA"]], "TO":[, [, , "[02-8]\\d{4,6}", "\\d{5,7}"], [, , "(?:2\\d|3[1-8]|4[1-4]|[56]0|7[0149]|8[05])\\d{3}", "\\d{5}", , , "20123"], [, , "(?:7[578]|8[47-9])\\d{5}", "\\d{7}", , , "7715123"], [, , "0800\\d{3}", "\\d{7}", , , "0800222"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", 
"NA"], "TO", 676, "00", , , , , , , , [[, "(\\d{2})(\\d{3})", "$1-$2", ["[1-6]|7[0-4]|8[05]"], "", "", 0], [, "(\\d{3})(\\d{4})", "$1 $2", ["7[5-9]|8[47-9]"], "", "", 0], [, "(\\d{4})(\\d{3})", "$1 $2", ["0"], "", "", 0]], , [, , "NA", "NA"], , , [, , "NA", "NA"], [, , "NA", "NA"], 1, , [, , "NA", "NA"]], "TR":[, [, , "[2-589]\\d{9}|444\\d{4}", "\\d{7,10}"], [, , "(?:2(?:[13][26]|[28][2468]|[45][268]|[67][246])|3(?:[13][28]|[24-6][2468]|[78][02468]|92)|4(?:[16][246]|[23578][2468]|4[26]))\\d{7}", 
"\\d{10}", , , "2123456789"], [, , "5(?:0[1-7]|22|[34]\\d|5[1-59]|9[246])\\d{7}", "\\d{10}", , , "5012345678"], [, , "800\\d{7}", "\\d{10}", , , "8001234567"], [, , "900\\d{7}", "\\d{10}", , , "9001234567"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], "TR", 90, "00", "0", , , "0", , , , [[, "(\\d{3})(\\d{3})(\\d{4})", "$1 $2 $3", ["[23]|4(?:[0-35-9]|4[0-35-9])"], "(0$1)", "", 1], [, "(\\d{3})(\\d{3})(\\d{4})", "$1 $2 $3", ["[589]"], "0$1", "", 1], [, "(444)(\\d{1})(\\d{3})", "$1 $2 $3", 
["444"], "", "", 0]], , [, , "512\\d{7}", "\\d{10}", , , "5123456789"], , , [, , "444\\d{4}", "\\d{7}", , , "4441444"], [, , "444\\d{4}|850\\d{7}", "\\d{7,10}", , , "4441444"], , , [, , "NA", "NA"]], "TT":[, [, , "[589]\\d{9}", "\\d{7}(?:\\d{3})?"], [, , "868(?:2(?:01|2[1-5])|6(?:0[79]|1[02-9]|2[1-9]|[3-69]\\d|7[0-79])|82[124])\\d{4}", "\\d{7}(?:\\d{3})?", , , "8682211234"], [, , "868(?:2(?:[89]\\d)|3(?:0[1-9]|1[02-9]|[2-9]\\d)|4[6-9]\\d|6(?:20|78|8\\d)|7(?:0[1-9]|1[02-9]|[2-9]\\d))\\d{4}", "\\d{10}", 
, , "8682911234"], [, , "8(?:00|44|55|66|77|88)[2-9]\\d{6}", "\\d{10}", , , "8002345678"], [, , "900[2-9]\\d{6}", "\\d{10}", , , "9002345678"], [, , "NA", "NA"], [, , "5(?:00|33|44|66|77)[2-9]\\d{6}", "\\d{10}", , , "5002345678"], [, , "NA", "NA"], "TT", 1, "011", "1", , , "1", , , , , , [, , "NA", "NA"], , "868", [, , "NA", "NA"], [, , "NA", "NA"], , , [, , "NA", "NA"]], "TV":[, [, , "[29]\\d{4,5}", "\\d{5,6}"], [, , "2[02-9]\\d{3}", "\\d{5}", , , "20123"], [, , "90\\d{4}", "\\d{6}", , , "901234"], 
[, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], "TV", 688, "00", , , , , , , , , , [, , "NA", "NA"], , , [, , "NA", "NA"], [, , "NA", "NA"], , , [, , "NA", "NA"]], "TW":[, [, , "[2-689]\\d{7,8}|7\\d{7,9}", "\\d{8,10}"], [, , "[2-8]\\d{7,8}", "\\d{8,9}", , , "21234567"], [, , "9\\d{8}", "\\d{9}", , , "912345678"], [, , "800\\d{6}", "\\d{9}", , , "800123456"], [, , "900\\d{6}", "\\d{9}", , , "900123456"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "70\\d{8}", 
"\\d{10}", , , "7012345678"], "TW", 886, "0(?:0[25679]|19)", "0", "#", , "0", , , , [[, "([2-8])(\\d{3,4})(\\d{4})", "$1 $2 $3", ["[2-6]|[78][1-9]"], "0$1", "", 0], [, "([89]\\d{2})(\\d{3})(\\d{3})", "$1 $2 $3", ["80|9"], "0$1", "", 0], [, "(70)(\\d{4})(\\d{4})", "$1 $2 $3", ["70"], "0$1", "", 0]], , [, , "NA", "NA"], , , [, , "NA", "NA"], [, , "NA", "NA"], , , [, , "NA", "NA"]], "TZ":[, [, , "\\d{9}", "\\d{7,9}"], [, , "2[2-8]\\d{7}", "\\d{7,9}", , , "222345678"], [, , "(?:6[158]|7[1-9])\\d{7}", 
"\\d{9}", , , "612345678"], [, , "80[08]\\d{6}", "\\d{9}", , , "800123456"], [, , "90\\d{7}", "\\d{9}", , , "900123456"], [, , "8(?:40|6[01])\\d{6}", "\\d{9}", , , "840123456"], [, , "NA", "NA"], [, , "41\\d{7}", "\\d{9}", , , "412345678"], "TZ", 255, "00[056]", "0", , , "0", , , , [[, "([24]\\d)(\\d{3})(\\d{4})", "$1 $2 $3", ["[24]"], "0$1", "", 0], [, "([67]\\d{2})(\\d{3})(\\d{3})", "$1 $2 $3", ["[67]"], "0$1", "", 0], [, "([89]\\d{2})(\\d{2})(\\d{4})", "$1 $2 $3", ["[89]"], "0$1", "", 0]], , [, 
, "NA", "NA"], , , [, , "NA", "NA"], [, , "NA", "NA"], , , [, , "NA", "NA"]], "UA":[, [, , "[3-689]\\d{8}", "\\d{5,9}"], [, , "(?:3[1-8]|4[13-8]|5[1-7]|6[12459])\\d{7}", "\\d{5,9}", , , "311234567"], [, , "(?:39|50|6[36-8]|9[1-9])\\d{7}", "\\d{9}", , , "391234567"], [, , "800\\d{6}", "\\d{9}", , , "800123456"], [, , "900\\d{6}", "\\d{9}", , , "900123456"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "89\\d{7}", "\\d{9}", , , "891234567"], "UA", 380, "00", "0", , , "0", , "0~0", , [[, "([3-689]\\d)(\\d{3})(\\d{4})", 
"$1 $2 $3", ["[38]9|4(?:[45][0-5]|87)|5(?:0|6[37]|7[37])|6[36-8]|9[1-9]", "[38]9|4(?:[45][0-5]|87)|5(?:0|6(?:3[14-7]|7)|7[37])|6[36-8]|9[1-9]"], "0$1", "", 0], [, "([3-689]\\d{2})(\\d{3})(\\d{3})", "$1 $2 $3", ["3[1-8]2|4[13678]2|5(?:[12457]2|6[24])|6(?:[49]2|[12][29]|5[24])|8[0-8]|90", "3(?:[1-46-8]2[013-9]|52)|4(?:[1378]2|62[013-9])|5(?:[12457]2|6[24])|6(?:[49]2|[12][29]|5[24])|8[0-8]|90"], "0$1", "", 0], [, "([3-6]\\d{3})(\\d{5})", "$1 $2", ["3(?:5[013-9]|[1-46-8])|4(?:[137][013-9]|6|[45][6-9]|8[4-6])|5(?:[1245][013-9]|6[0135-9]|3|7[4-6])|6(?:[49][013-9]|5[0135-9]|[12][13-8])", 
"3(?:5[013-9]|[1-46-8](?:22|[013-9]))|4(?:[137][013-9]|6(?:[013-9]|22)|[45][6-9]|8[4-6])|5(?:[1245][013-9]|6(?:3[02389]|[015689])|3|7[4-6])|6(?:[49][013-9]|5[0135-9]|[12][13-8])"], "0$1", "", 0]], , [, , "NA", "NA"], , , [, , "NA", "NA"], [, , "NA", "NA"], , , [, , "NA", "NA"]], "UG":[, [, , "\\d{9}", "\\d{5,9}"], [, , "20(?:[0147]\\d{2}|2(?:40|[5-9]\\d)|3[23]\\d|5[0-4]\\d|6[03]\\d|8[0-2]\\d)\\d{4}|[34]\\d{8}", "\\d{5,9}", , , "312345678"], [, , "2030\\d{5}|7(?:0[0-7]|[15789]\\d|2[03]|30|[46][0-4])\\d{6}", 
"\\d{9}", , , "712345678"], [, , "800[123]\\d{5}", "\\d{9}", , , "800123456"], [, , "90[123]\\d{6}", "\\d{9}", , , "901123456"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], "UG", 256, "00[057]", "0", , , "0", , , , [[, "(\\d{3})(\\d{6})", "$1 $2", ["[7-9]|20(?:[013-8]|2[5-9])|4(?:6[45]|[7-9])"], "0$1", "", 0], [, "(\\d{2})(\\d{7})", "$1 $2", ["3|4(?:[1-5]|6[0-36-9])"], "0$1", "", 0], [, "(2024)(\\d{5})", "$1 $2", ["2024"], "0$1", "", 0]], , [, , "NA", "NA"], , , [, , "NA", "NA"], [, , "NA", 
"NA"], , , [, , "NA", "NA"]], "US":[, [, , "[2-9]\\d{9}", "\\d{7}(?:\\d{3})?"], [, , "(?:2(?:0[1-35-9]|1[02-9]|2[4589]|3[149]|4[08]|5[1-46]|6[0279]|7[026]|8[13])|3(?:0[1-57-9]|1[02-9]|2[0135]|3[014679]|4[67]|5[12]|6[014]|8[56])|4(?:0[124-9]|1[02-579]|2[3-5]|3[0245]|4[0235]|58|69|7[0589]|8[04])|5(?:0[1-57-9]|1[0235-8]|20|3[0149]|4[01]|5[19]|6[1-37]|7[013-5]|8[056])|6(?:0[1-35-9]|1[024-9]|2[036]|3[016]|4[16]|5[017]|6[0-279]|78|8[12])|7(?:0[1-46-8]|1[02-9]|2[0457]|3[1247]|4[07]|5[47]|6[02359]|7[02-59]|8[156])|8(?:0[1-68]|1[02-8]|28|3[0-25]|4[3578]|5[06-9]|6[02-5]|7[028])|9(?:0[1346-9]|1[02-9]|2[0589]|3[01678]|4[0179]|5[12469]|7[0-3589]|8[0459]))[2-9]\\d{6}", 
"\\d{7}(?:\\d{3})?", , , "2015555555"], [, , "(?:2(?:0[1-35-9]|1[02-9]|2[4589]|3[149]|4[08]|5[1-46]|6[0279]|7[026]|8[13])|3(?:0[1-57-9]|1[02-9]|2[0135]|3[014679]|4[67]|5[12]|6[014]|8[56])|4(?:0[124-9]|1[02-579]|2[3-5]|3[0245]|4[0235]|58|69|7[0589]|8[04])|5(?:0[1-57-9]|1[0235-8]|20|3[0149]|4[01]|5[19]|6[1-37]|7[013-5]|8[056])|6(?:0[1-35-9]|1[024-9]|2[036]|3[016]|4[16]|5[017]|6[0-279]|78|8[12])|7(?:0[1-46-8]|1[02-9]|2[0457]|3[1247]|4[07]|5[47]|6[02359]|7[02-59]|8[156])|8(?:0[1-68]|1[02-8]|28|3[0-25]|4[3578]|5[06-9]|6[02-5]|7[028])|9(?:0[1346-9]|1[02-9]|2[0589]|3[01678]|4[0179]|5[12469]|7[0-3589]|8[0459]))[2-9]\\d{6}", 
"\\d{7}(?:\\d{3})?", , , "2015555555"], [, , "8(?:00|44|55|66|77|88)[2-9]\\d{6}", "\\d{10}", , , "8002345678"], [, , "900[2-9]\\d{6}", "\\d{10}", , , "9002345678"], [, , "NA", "NA"], [, , "5(?:00|33|44|66|77)[2-9]\\d{6}", "\\d{10}", , , "5002345678"], [, , "NA", "NA"], "US", 1, "011", "1", , , "1", , , 1, [[, "(\\d{3})(\\d{4})", "$1-$2", , "", "", 1], [, "(\\d{3})(\\d{3})(\\d{4})", "($1) $2-$3", , "", "", 1]], [[, "(\\d{3})(\\d{3})(\\d{4})", "$1-$2-$3"]], [, , "NA", "NA"], 1, , [, , "NA", "NA"], 
[, , "NA", "NA"], , , [, , "NA", "NA"]], "UY":[, [, , "[2489]\\d{6,7}", "\\d{7,8}"], [, , "2\\d{7}|4[2-7]\\d{6}", "\\d{7,8}", , , "21231234"], [, , "9[1-9]\\d{6}", "\\d{8}", , , "94231234"], [, , "80[05]\\d{4}", "\\d{7}", , , "8001234"], [, , "90[0-8]\\d{4}", "\\d{7}", , , "9001234"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], "UY", 598, "0(?:1[3-9]\\d|0)", "0", " int. ", , "0", , "00", , [[, "(\\d{4})(\\d{4})", "$1 $2", ["[24]"], "", "", 0], [, "(\\d{2})(\\d{3})(\\d{3})", "$1 $2 $3", 
["9[1-9]"], "0$1", "", 0], [, "(\\d{3})(\\d{4})", "$1 $2", ["[89]0"], "0$1", "", 0]], , [, , "NA", "NA"], , , [, , "NA", "NA"], [, , "NA", "NA"], , , [, , "NA", "NA"]], "UZ":[, [, , "[679]\\d{8}", "\\d{7,9}"], [, , "(?:6(?:1(?:22|3[124]|4[1-4]|5[123578]|64)|2(?:22|3[0-57-9]|41)|5(?:22|3[3-7]|5[024-8])|6\\d{2}|7(?:[23]\\d|7[69])|9(?:22|4[1-8]|6[135]))|7(?:0(?:5[4-9]|6[0146]|7[12456]|9[135-8])|1[12]\\d|2(?:22|3[1345789]|4[123579]|5[14])|3(?:2\\d|3[1578]|4[1-35-7]|5[1-57]|61)|4(?:2\\d|3[1-579]|7[1-79])|5(?:22|5[1-9]|6[1457])|6(?:22|3[12457]|4[13-8])|9(?:22|5[1-9])))\\d{5}", 
"\\d{7,9}", , , "662345678"], [, , "6(?:1(?:2(?:98|2[01])|35[0-4]|50\\d|61[23]|7(?:[01][017]|4\\d|55|9[5-9]))|2(?:11\\d|2(?:[12]1|9[01379])|5(?:[126]\\d|3[0-4])|7\\d{2})|5(?:19[01]|2(?:27|9[26])|30\\d|59\\d|7\\d{2})|6(?:2(?:1[5-9]|2[0367]|38|41|52|60)|3[79]\\d|4(?:56|83)|7(?:[07]\\d|1[017]|3[07]|4[047]|5[057]|67|8[0178]|9[79])|9[0-3]\\d)|7(?:2(?:24|3[237]|4[5-9]|7[15-8])|5(?:7[12]|8[0589])|7(?:0\\d|[39][07])|9(?:0\\d|7[079]))|9(?:2(?:1[1267]|5\\d|3[01]|7[0-4])|5[67]\\d|6(?:2[0-26]|8\\d)|7\\d{2}))\\d{4}|7(?:0\\d{3}|1(?:13[01]|6(?:0[47]|1[67]|66)|71[3-69]|98\\d)|2(?:2(?:2[79]|95)|3(?:2[5-9]|6[0-6])|57\\d|7(?:0\\d|1[17]|2[27]|3[37]|44|5[057]|66|88))|3(?:2(?:1[0-6]|21|3[469]|7[159])|33\\d|5(?:0[0-4]|5[579]|9\\d)|7(?:[0-3579]\\d|4[0467]|6[67]|8[078])|9[4-6]\\d)|4(?:2(?:29|5[0257]|6[0-7]|7[1-57])|5(?:1[0-4]|8\\d|9[5-9])|7(?:0\\d|1[024589]|2[0127]|3[0137]|[46][07]|5[01]|7[5-9]|9[079])|9(?:7[015-9]|[89]\\d))|5(?:112|2(?:0\\d|2[29]|[49]4)|3[1568]\\d|52[6-9]|7(?:0[01578]|1[017]|[23]7|4[047]|[5-7]\\d|8[78]|9[079]))|6(?:2(?:2[1245]|4[2-4])|39\\d|41[179]|5(?:[349]\\d|5[0-2])|7(?:0[017]|[13]\\d|22|44|55|67|88))|9(?:22[128]|3(?:2[0-4]|7\\d)|57[05629]|7(?:2[05-9]|3[37]|4\\d|60|7[2579]|87|9[07])))\\d{4}|9[0-57-9]\\d{7}", 
"\\d{7,9}", , , "912345678"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], "UZ", 998, "810", "8", , , "8", , "8~10", , [[, "([679]\\d)(\\d{3})(\\d{2})(\\d{2})", "$1 $2 $3 $4", , "8 $1", "", 0]], , [, , "NA", "NA"], , , [, , "NA", "NA"], [, , "NA", "NA"], , , [, , "NA", "NA"]], "VA":[, [, , "06\\d{8}", "\\d{10}"], [, , "06698\\d{5}", "\\d{10}", , , "0669812345"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], [, 
, "NA", "NA"], "VA", 379, "00", , , , , , , , [[, "(06)(\\d{4})(\\d{4})", "$1 $2 $3", , "", "", 0]], , [, , "NA", "NA"], , , [, , "NA", "NA"], [, , "NA", "NA"], 1, , [, , "NA", "NA"]], "VC":[, [, , "[5789]\\d{9}", "\\d{7}(?:\\d{3})?"], [, , "784(?:266|3(?:6[6-9]|7\\d|8[0-24-6])|4(?:38|5[0-36-8]|8[0-8])|5(?:55|7[0-2]|93)|638|784)\\d{4}", "\\d{7}(?:\\d{3})?", , , "7842661234"], [, , "784(?:4(?:3[0-4]|5[45]|89|9[0-5])|5(?:2[6-9]|3[0-4]))\\d{4}", "\\d{10}", , , "7844301234"], [, , "8(?:00|44|55|66|77|88)[2-9]\\d{6}", 
"\\d{10}", , , "8002345678"], [, , "900[2-9]\\d{6}", "\\d{10}", , , "9002345678"], [, , "NA", "NA"], [, , "5(?:00|33|44|66|77)[2-9]\\d{6}", "\\d{10}", , , "5002345678"], [, , "NA", "NA"], "VC", 1, "011", "1", , , "1", , , , , , [, , "NA", "NA"], , "784", [, , "NA", "NA"], [, , "NA", "NA"], , , [, , "NA", "NA"]], "VE":[, [, , "[24589]\\d{9}", "\\d{7,10}"], [, , "(?:2(?:12|3[457-9]|[58][1-9]|[467]\\d|9[1-6])|50[01])\\d{7}", "\\d{7,10}", , , "2121234567"], [, , "4(?:1[24-8]|2[46])\\d{7}", "\\d{10}", 
, , "4121234567"], [, , "800\\d{7}", "\\d{10}", , , "8001234567"], [, , "900\\d{7}", "\\d{10}", , , "9001234567"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], "VE", 58, "00", "0", , , "0", , , , [[, "(\\d{3})(\\d{7})", "$1-$2", , "0$1", "$CC $1", 0]], , [, , "NA", "NA"], , , [, , "NA", "NA"], [, , "NA", "NA"], , , [, , "NA", "NA"]], "VG":[, [, , "[2589]\\d{9}", "\\d{7}(?:\\d{3})?"], [, , "284(?:(?:229|4(?:22|9[45])|774|8(?:52|6[459]))\\d{4}|496[0-5]\\d{3})", "\\d{7}(?:\\d{3})?", , , "2842291234"], 
[, , "284(?:(?:3(?:0[0-3]|4[0-367])|4(?:4[0-6]|68|99)|54[0-57])\\d{4}|496[6-9]\\d{3})", "\\d{10}", , , "2843001234"], [, , "8(?:00|44|55|66|77|88)[2-9]\\d{6}", "\\d{10}", , , "8002345678"], [, , "900[2-9]\\d{6}", "\\d{10}", , , "9002345678"], [, , "NA", "NA"], [, , "5(?:00|33|44|66|77)[2-9]\\d{6}", "\\d{10}", , , "5002345678"], [, , "NA", "NA"], "VG", 1, "011", "1", , , "1", , , , , , [, , "NA", "NA"], , "284", [, , "NA", "NA"], [, , "NA", "NA"], , , [, , "NA", "NA"]], "VI":[, [, , "[3589]\\d{9}", 
"\\d{7}(?:\\d{3})?"], [, , "340(?:2(?:01|2[0678]|44|77)|3(?:32|44)|4(?:22|7[34])|5(?:1[34]|55)|6(?:26|4[23]|77|9[023])|7(?:1[2-589]|27|7\\d)|884|998)\\d{4}", "\\d{7}(?:\\d{3})?", , , "3406421234"], [, , "340(?:2(?:01|2[0678]|44|77)|3(?:32|44)|4(?:22|7[34])|5(?:1[34]|55)|6(?:26|4[23]|77|9[023])|7(?:1[2-589]|27|7\\d)|884|998)\\d{4}", "\\d{7}(?:\\d{3})?", , , "3406421234"], [, , "8(?:00|44|55|66|77|88)[2-9]\\d{6}", "\\d{10}", , , "8002345678"], [, , "900[2-9]\\d{6}", "\\d{10}", , , "9002345678"], [, 
, "NA", "NA"], [, , "5(?:00|33|44|66|77)[2-9]\\d{6}", "\\d{10}", , , "5002345678"], [, , "NA", "NA"], "VI", 1, "011", "1", , , "1", , , 1, , , [, , "NA", "NA"], , "340", [, , "NA", "NA"], [, , "NA", "NA"], , , [, , "NA", "NA"]], "VN":[, [, , "[17]\\d{6,9}|[2-69]\\d{7,9}|8\\d{6,8}", "\\d{7,10}"], [, , "(?:2(?:[025-79]|1[0189]|[348][01])|3(?:[0136-9]|[25][01])|4\\d|5(?:[01][01]|[2-9])|6(?:[0-46-8]|5[01])|7(?:[02-79]|[18][01])|8[1-9])\\d{7}", "\\d{9,10}", , , "2101234567"], [, , "(?:9\\d|1(?:2\\d|6[2-9]|8[68]|99))\\d{7}", 
"\\d{9,10}", , , "912345678"], [, , "1800\\d{4,6}", "\\d{8,10}", , , "1800123456"], [, , "1900\\d{4,6}", "\\d{8,10}", , , "1900123456"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], "VN", 84, "00", "0", , , "0", , , , [[, "([17]99)(\\d{4})", "$1 $2", ["[17]99"], "0$1", "", 1], [, "([48])(\\d{4})(\\d{4})", "$1 $2 $3", ["[48]"], "0$1", "", 1], [, "([235-7]\\d)(\\d{4})(\\d{3})", "$1 $2 $3", ["2[025-79]|3[0136-9]|5[2-9]|6[0-46-8]|7[02-79]"], "0$1", "", 1], [, "(80)(\\d{5})", "$1 $2", ["80"], 
"0$1", "", 1], [, "(69\\d)(\\d{4,5})", "$1 $2", ["69"], "0$1", "", 1], [, "([235-7]\\d{2})(\\d{4})(\\d{3})", "$1 $2 $3", ["2[1348]|3[25]|5[01]|65|7[18]"], "0$1", "", 1], [, "(9\\d)(\\d{3})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["9"], "0$1", "", 1], [, "(1[2689]\\d)(\\d{3})(\\d{4})", "$1 $2 $3", ["1(?:[26]|8[68]|99)"], "0$1", "", 1], [, "(1[89]00)(\\d{4,6})", "$1 $2", ["1[89]0"], "$1", "", 1]], , [, , "NA", "NA"], , , [, , "[17]99\\d{4}|69\\d{5,6}", "\\d{7,8}", , , "1992000"], [, , "[17]99\\d{4}|69\\d{5,6}|80\\d{5}", 
"\\d{7,8}", , , "1992000"], , , [, , "NA", "NA"]], "VU":[, [, , "[2-57-9]\\d{4,6}", "\\d{5,7}"], [, , "(?:2[02-9]\\d|3(?:[5-7]\\d|8[0-8])|48[4-9]|88\\d)\\d{2}", "\\d{5}", , , "22123"], [, , "(?:5(?:7[2-5]|[3-69]\\d)|7[013-7]\\d)\\d{4}", "\\d{7}", , , "5912345"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], "VU", 678, "00", , , , , , , , [[, "(\\d{3})(\\d{4})", "$1 $2", ["[579]"], "", "", 0]], , [, , "NA", "NA"], , , [, , "NA", "NA"], [, , "3[03]\\d{3}|900\\d{4}", 
"\\d{5,7}", , , "30123"], , , [, , "NA", "NA"]], "WF":[, [, , "[5-7]\\d{5}", "\\d{6}"], [, , "(?:50|68|72)\\d{4}", "\\d{6}", , , "501234"], [, , "(?:50|68|72)\\d{4}", "\\d{6}", , , "501234"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], "WF", 681, "00", , , , , , , 1, [[, "(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3", , "", "", 0]], , [, , "NA", "NA"], , , [, , "NA", "NA"], [, , "NA", "NA"], , , [, , "NA", "NA"]], "WS":[, [, , "[2-8]\\d{4,6}", "\\d{5,7}"], [, 
, "(?:[2-5]\\d|6[1-9]|84\\d{2})\\d{3}", "\\d{5,7}", , , "22123"], [, , "(?:60|7[25-7]\\d)\\d{4}", "\\d{6,7}", , , "601234"], [, , "800\\d{3}", "\\d{6}", , , "800123"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], "WS", 685, "0", , , , , , , , [[, "(8\\d{2})(\\d{3,4})", "$1 $2", ["8"], "", "", 0], [, "(7\\d)(\\d{5})", "$1 $2", ["7"], "", "", 0]], , [, , "NA", "NA"], , , [, , "NA", "NA"], [, , "NA", "NA"], , , [, , "NA", "NA"]], "YE":[, [, , "[1-7]\\d{6,8}", "\\d{6,9}"], 
[, , "(?:1(?:7\\d|[2-68])|2[2-68]|3[2358]|4[2-58]|5[2-6]|6[3-58]|7[24-68])\\d{5}", "\\d{6,8}", , , "1234567"], [, , "7[0137]\\d{7}", "\\d{9}", , , "712345678"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], "YE", 967, "00", "0", , , "0", , , , [[, "([1-7])(\\d{3})(\\d{3,4})", "$1 $2 $3", ["[1-6]|7[24-68]"], "0$1", "", 0], [, "(7\\d{2})(\\d{3})(\\d{3})", "$1 $2 $3", ["7[0137]"], "0$1", "", 0]], , [, , "NA", "NA"], , , [, , "NA", "NA"], [, , "NA", "NA"], 
, , [, , "NA", "NA"]], "YT":[, [, , "[268]\\d{8}", "\\d{9}"], [, , "2696[0-4]\\d{4}", "\\d{9}", , , "269601234"], [, , "639\\d{6}", "\\d{9}", , , "639123456"], [, , "80\\d{7}", "\\d{9}", , , "801234567"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], "YT", 262, "00", "0", , , "0", , , , , , [, , "NA", "NA"], , "269|63", [, , "NA", "NA"], [, , "NA", "NA"], , , [, , "NA", "NA"]], "ZA":[, [, , "[1-79]\\d{8}|8(?:[067]\\d{7}|[1-4]\\d{3,7})", "\\d{5,9}"], [, , "(?:1[0-8]|2[0-378]|3[1-69]|4\\d|5[1346-8])\\d{7}", 
"\\d{9}", , , "101234567"], [, , "(?:6[0-5]|7[0-46-9])\\d{7}|8[1-4]\\d{3,7}", "\\d{5,9}", , , "711234567"], [, , "80\\d{7}", "\\d{9}", , , "801234567"], [, , "86[2-9]\\d{6}|90\\d{7}", "\\d{9}", , , "862345678"], [, , "860\\d{6}", "\\d{9}", , , "860123456"], [, , "NA", "NA"], [, , "87\\d{7}", "\\d{9}", , , "871234567"], "ZA", 27, "00", "0", , , "0", , , , [[, "(860)(\\d{3})(\\d{3})", "$1 $2 $3", ["860"], "0$1", "", 0], [, "(\\d{2})(\\d{3})(\\d{4})", "$1 $2 $3", ["[1-79]|8(?:[0-47]|6[1-9])"], "0$1", 
"", 0], [, "(\\d{2})(\\d{3,4})", "$1 $2", ["8[1-4]"], "0$1", "", 0], [, "(\\d{2})(\\d{3})(\\d{2,3})", "$1 $2 $3", ["8[1-4]"], "0$1", "", 0]], , [, , "NA", "NA"], , , [, , "NA", "NA"], [, , "861\\d{6}", "\\d{9}", , , "861123456"], , , [, , "NA", "NA"]], "ZM":[, [, , "[289]\\d{8}", "\\d{9}"], [, , "21[1-8]\\d{6}", "\\d{9}", , , "211234567"], [, , "9(?:5[05]|6\\d|7[1-9])\\d{6}", "\\d{9}", , , "955123456"], [, , "800\\d{6}", "\\d{9}", , , "800123456"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], 
[, , "NA", "NA"], "ZM", 260, "00", "0", , , "0", , , , [[, "([29]\\d)(\\d{7})", "$1 $2", ["[29]"], "0$1", "", 0], [, "(800)(\\d{3})(\\d{3})", "$1 $2 $3", ["8"], "0$1", "", 0]], , [, , "NA", "NA"], , , [, , "NA", "NA"], [, , "NA", "NA"], , , [, , "NA", "NA"]], "ZW":[, [, , "2(?:[012457-9]\\d{3,8}|6\\d{3,6})|[13-79]\\d{4,8}|8[06]\\d{8}", "\\d{3,10}"], [, , "(?:1[3-9]|2(?:0[45]|[16]|2[28]|[49]8?|58[23]|7[246]|8[1346-9])|3(?:08?|17?|3[78]|[2456]|7[1569]|8[379])|5(?:[07-9]|1[78]|483|5(?:7?|8))|6(?:0|28|37?|[45][68][78]|98?)|848)\\d{3,6}|(?:2(?:27|5|7[135789]|8[25])|3[39]|5[1-46]|6[126-8])\\d{4,6}|2(?:(?:0|70)\\d{5,6}|2[05]\\d{7})|(?:4\\d|9[2-8])\\d{4,7}", 
"\\d{3,10}", , , "1312345"], [, , "7[1378]\\d{7}|86(?:22|44)\\d{6}", "\\d{9,10}", , , "711234567"], [, , "800\\d{7}", "\\d{10}", , , "8001234567"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "86(?:1[12]|30|55|77|8[367]|99)\\d{6}", "\\d{10}", , , "8686123456"], "ZW", 263, "00", "0", , , "0", , , , [[, "([49])(\\d{3})(\\d{2,5})", "$1 $2 $3", ["4|9[2-9]"], "0$1", "", 0], [, "([179]\\d)(\\d{3})(\\d{3,4})", "$1 $2 $3", ["[19]1|7"], "0$1", "", 0], [, "(86\\d{2})(\\d{3})(\\d{3})", "$1 $2 $3", 
["86[24]"], "0$1", "", 0], [, "([2356]\\d{2})(\\d{3,5})", "$1 $2", ["2(?:[278]|0[45]|[49]8)|3(?:08|17|3[78]|[78])|5[15][78]|6(?:[29]8|37|[68][78])"], "0$1", "", 0], [, "(\\d{3})(\\d{3})(\\d{3,4})", "$1 $2 $3", ["2(?:[278]|0[45]|48)|3(?:08|17|3[78]|[78])|5[15][78]|6(?:[29]8|37|[68][78])|80"], "0$1", "", 0], [, "([1-356]\\d)(\\d{3,5})", "$1 $2", ["1[3-9]|2(?:[1-469]|0[0-35-9]|[45][0-79])|3(?:0[0-79]|1[0-689]|[24-69]|3[0-69])|5(?:[02-46-9]|[15][0-69])|6(?:[0145]|[29][0-79]|3[0-689]|[68][0-69])"], "0$1", 
"", 0], [, "([1-356]\\d)(\\d{3})(\\d{3})", "$1 $2 $3", ["1[3-9]|2(?:[1-469]|0[0-35-9]|[45][0-79])|3(?:0[0-79]|1[0-689]|[24-69]|3[0-69])|5(?:[02-46-9]|[15][0-69])|6(?:[0145]|[29][0-79]|3[0-689]|[68][0-69])"], "0$1", "", 0], [, "([25]\\d{3})(\\d{3,5})", "$1 $2", ["(?:25|54)8", "258[23]|5483"], "0$1", "", 0], [, "([25]\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", ["(?:25|54)8", "258[23]|5483"], "0$1", "", 0], [, "(8\\d{3})(\\d{6})", "$1 $2", ["86"], "0$1", "", 0]], , [, , "NA", "NA"], , , [, , "NA", "NA"], 
[, , "NA", "NA"], , , [, , "NA", "NA"]], 800:[, [, , "\\d{8}", "\\d{8}", , , "12345678"], [, , "NA", "NA", , , "12345678"], [, , "NA", "NA", , , "12345678"], [, , "\\d{8}", "\\d{8}", , , "12345678"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], "001", 800, "", , , , , , , 1, [[, "(\\d{4})(\\d{4})", "$1 $2", , "", "", 0]], , [, , "NA", "NA"], , , [, , "NA", "NA"], [, , "NA", "NA"], 1, , [, , "NA", "NA"]], 808:[, [, , "\\d{8}", "\\d{8}", , , "12345678"], [, , "NA", "NA", 
, , "12345678"], [, , "NA", "NA", , , "12345678"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "\\d{8}", "\\d{8}", , , "12345678"], [, , "NA", "NA"], [, , "NA", "NA"], "001", 808, "", , , , , , , 1, [[, "(\\d{4})(\\d{4})", "$1 $2", , "", "", 0]], , [, , "NA", "NA"], , , [, , "NA", "NA"], [, , "NA", "NA"], 1, , [, , "NA", "NA"]], 870:[, [, , "[35-7]\\d{8}", "\\d{9}", , , "301234567"], [, , "NA", "NA", , , "301234567"], [, , "(?:[356]\\d|7[6-8])\\d{7}", "\\d{9}", , , "301234567"], [, , "NA", "NA"], [, 
, "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], "001", 870, "", , , , , , , , [[, "(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", , "", "", 0]], , [, , "NA", "NA"], , , [, , "NA", "NA"], [, , "NA", "NA"], , , [, , "NA", "NA"]], 878:[, [, , "1\\d{11}", "\\d{12}", , , "101234567890"], [, , "NA", "NA", , , "101234567890"], [, , "NA", "NA", , , "101234567890"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "10\\d{10}", "\\d{12}", , , "101234567890"], "001", 
878, "", , , , , , , 1, [[, "(\\d{2})(\\d{5})(\\d{5})", "$1 $2 $3", , "", "", 0]], , [, , "NA", "NA"], , , [, , "NA", "NA"], [, , "NA", "NA"], , , [, , "NA", "NA"]], 881:[, [, , "[67]\\d{8}", "\\d{9}", , , "612345678"], [, , "NA", "NA", , , "612345678"], [, , "[67]\\d{8}", "\\d{9}", , , "612345678"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], "001", 881, "", , , , , , , , [[, "(\\d)(\\d{3})(\\d{5})", "$1 $2 $3", ["[67]"], "", "", 0]], , [, , "NA", "NA"], 
, , [, , "NA", "NA"], [, , "NA", "NA"], , , [, , "NA", "NA"]], 882:[, [, , "[13]\\d{6,11}", "\\d{7,12}", , , "3451234567"], [, , "NA", "NA", , , "3451234567"], [, , "3(?:2\\d{3}|37\\d{2}|4(?:2|7\\d{3}))\\d{4}", "\\d{7,10}", , , "3451234567"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "1(?:3(?:0[0347]|[13][0139]|2[035]|4[013568]|6[0459]|7[06]|8[15678]|9[0689])\\d{4}|6\\d{5,10})|345\\d{7}", "\\d{7,12}", , , "3451234567"], "001", 882, "", , , , , , , , [[, "(\\d{2})(\\d{4})(\\d{3})", 
"$1 $2 $3", ["3[23]"], "", "", 0], [, "(\\d{2})(\\d{5})", "$1 $2", ["16|342"], "", "", 0], [, "(\\d{2})(\\d{4})(\\d{4})", "$1 $2 $3", ["34[57]"], "", "", 0], [, "(\\d{3})(\\d{4})(\\d{4})", "$1 $2 $3", ["348"], "", "", 0], [, "(\\d{2})(\\d{2})(\\d{4})", "$1 $2 $3", ["1"], "", "", 0], [, "(\\d{2})(\\d{3,4})(\\d{4})", "$1 $2 $3", ["16"], "", "", 0], [, "(\\d{2})(\\d{4,5})(\\d{5})", "$1 $2 $3", ["16"], "", "", 0]], , [, , "NA", "NA"], , , [, , "NA", "NA"], [, , "NA", "NA"], , , [, , "348[57]\\d{7}", 
"\\d{11}", , , "3451234567"]], 883:[, [, , "51\\d{7}(?:\\d{3})?", "\\d{9}(?:\\d{3})?", , , "510012345"], [, , "NA", "NA", , , "510012345"], [, , "NA", "NA", , , "510012345"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "51(?:00\\d{5}(?:\\d{3})?|[13]0\\d{8})", "\\d{9}(?:\\d{3})?", , , "510012345"], "001", 883, "", , , , , , , 1, [[, "(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", ["510"], "", "", 0], [, "(\\d{3})(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3 $4", ["510"], "", "", 0], 
[, "(\\d{4})(\\d{4})(\\d{4})", "$1 $2 $3", ["51[13]"], "", "", 0]], , [, , "NA", "NA"], , , [, , "NA", "NA"], [, , "NA", "NA"], , , [, , "NA", "NA"]], 888:[, [, , "\\d{11}", "\\d{11}", , , "12345678901"], [, , "NA", "NA", , , "12345678901"], [, , "NA", "NA", , , "12345678901"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], "001", 888, "", , , , , , , 1, [[, "(\\d{3})(\\d{3})(\\d{5})", "$1 $2 $3", , "", "", 0]], , [, , "NA", "NA"], , , [, , "NA", "NA"], 
[, , "\\d{11}", "\\d{11}", , , "12345678901"], 1, , [, , "NA", "NA"]], 979:[, [, , "\\d{9}", "\\d{9}", , , "123456789"], [, , "NA", "NA", , , "123456789"], [, , "NA", "NA", , , "123456789"], [, , "NA", "NA"], [, , "\\d{9}", "\\d{9}", , , "123456789"], [, , "NA", "NA"], [, , "NA", "NA"], [, , "NA", "NA"], "001", 979, "", , , , , , , 1, [[, "(\\d)(\\d{4})(\\d{4})", "$1 $2 $3", , "", "", 0]], , [, , "NA", "NA"], , , [, , "NA", "NA"], [, , "NA", "NA"], 1, , [, , "NA", "NA"]]};
/*

 Protocol Buffer 2 Copyright 2008 Google Inc.
 All other code copyright its respective owners.
 Copyright (C) 2010 The Libphonenumber Authors

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
*/
goog.provide("i18n.phonenumbers.PhoneNumber");
goog.provide("i18n.phonenumbers.PhoneNumber.CountryCodeSource");
goog.require("goog.proto2.Message");
i18n.phonenumbers.PhoneNumber = function() {
  goog.proto2.Message.apply(this);
};
goog.inherits(i18n.phonenumbers.PhoneNumber, goog.proto2.Message);
i18n.phonenumbers.PhoneNumber.prototype.clone;
i18n.phonenumbers.PhoneNumber.prototype.getCountryCode = function() {
  return(this.get$Value(1));
};
i18n.phonenumbers.PhoneNumber.prototype.getCountryCodeOrDefault = function() {
  return(this.get$ValueOrDefault(1));
};
i18n.phonenumbers.PhoneNumber.prototype.setCountryCode = function(value) {
  this.set$Value(1, value);
};
i18n.phonenumbers.PhoneNumber.prototype.hasCountryCode = function() {
  return this.has$Value(1);
};
i18n.phonenumbers.PhoneNumber.prototype.countryCodeCount = function() {
  return this.count$Values(1);
};
i18n.phonenumbers.PhoneNumber.prototype.clearCountryCode = function() {
  this.clear$Field(1);
};
i18n.phonenumbers.PhoneNumber.prototype.getNationalNumber = function() {
  return(this.get$Value(2));
};
i18n.phonenumbers.PhoneNumber.prototype.getNationalNumberOrDefault = function() {
  return(this.get$ValueOrDefault(2));
};
i18n.phonenumbers.PhoneNumber.prototype.setNationalNumber = function(value) {
  this.set$Value(2, value);
};
i18n.phonenumbers.PhoneNumber.prototype.hasNationalNumber = function() {
  return this.has$Value(2);
};
i18n.phonenumbers.PhoneNumber.prototype.nationalNumberCount = function() {
  return this.count$Values(2);
};
i18n.phonenumbers.PhoneNumber.prototype.clearNationalNumber = function() {
  this.clear$Field(2);
};
i18n.phonenumbers.PhoneNumber.prototype.getExtension = function() {
  return(this.get$Value(3));
};
i18n.phonenumbers.PhoneNumber.prototype.getExtensionOrDefault = function() {
  return(this.get$ValueOrDefault(3));
};
i18n.phonenumbers.PhoneNumber.prototype.setExtension = function(value) {
  this.set$Value(3, value);
};
i18n.phonenumbers.PhoneNumber.prototype.hasExtension = function() {
  return this.has$Value(3);
};
i18n.phonenumbers.PhoneNumber.prototype.extensionCount = function() {
  return this.count$Values(3);
};
i18n.phonenumbers.PhoneNumber.prototype.clearExtension = function() {
  this.clear$Field(3);
};
i18n.phonenumbers.PhoneNumber.prototype.getItalianLeadingZero = function() {
  return(this.get$Value(4));
};
i18n.phonenumbers.PhoneNumber.prototype.getItalianLeadingZeroOrDefault = function() {
  return(this.get$ValueOrDefault(4));
};
i18n.phonenumbers.PhoneNumber.prototype.setItalianLeadingZero = function(value) {
  this.set$Value(4, value);
};
i18n.phonenumbers.PhoneNumber.prototype.hasItalianLeadingZero = function() {
  return this.has$Value(4);
};
i18n.phonenumbers.PhoneNumber.prototype.italianLeadingZeroCount = function() {
  return this.count$Values(4);
};
i18n.phonenumbers.PhoneNumber.prototype.clearItalianLeadingZero = function() {
  this.clear$Field(4);
};
i18n.phonenumbers.PhoneNumber.prototype.getNumberOfLeadingZeros = function() {
  return(this.get$Value(8));
};
i18n.phonenumbers.PhoneNumber.prototype.getNumberOfLeadingZerosOrDefault = function() {
  return(this.get$ValueOrDefault(8));
};
i18n.phonenumbers.PhoneNumber.prototype.setNumberOfLeadingZeros = function(value) {
  this.set$Value(8, value);
};
i18n.phonenumbers.PhoneNumber.prototype.hasNumberOfLeadingZeros = function() {
  return this.has$Value(8);
};
i18n.phonenumbers.PhoneNumber.prototype.numberOfLeadingZerosCount = function() {
  return this.count$Values(8);
};
i18n.phonenumbers.PhoneNumber.prototype.clearNumberOfLeadingZeros = function() {
  this.clear$Field(8);
};
i18n.phonenumbers.PhoneNumber.prototype.getRawInput = function() {
  return(this.get$Value(5));
};
i18n.phonenumbers.PhoneNumber.prototype.getRawInputOrDefault = function() {
  return(this.get$ValueOrDefault(5));
};
i18n.phonenumbers.PhoneNumber.prototype.setRawInput = function(value) {
  this.set$Value(5, value);
};
i18n.phonenumbers.PhoneNumber.prototype.hasRawInput = function() {
  return this.has$Value(5);
};
i18n.phonenumbers.PhoneNumber.prototype.rawInputCount = function() {
  return this.count$Values(5);
};
i18n.phonenumbers.PhoneNumber.prototype.clearRawInput = function() {
  this.clear$Field(5);
};
i18n.phonenumbers.PhoneNumber.prototype.getCountryCodeSource = function() {
  return(this.get$Value(6));
};
i18n.phonenumbers.PhoneNumber.prototype.getCountryCodeSourceOrDefault = function() {
  return(this.get$ValueOrDefault(6));
};
i18n.phonenumbers.PhoneNumber.prototype.setCountryCodeSource = function(value) {
  this.set$Value(6, value);
};
i18n.phonenumbers.PhoneNumber.prototype.hasCountryCodeSource = function() {
  return this.has$Value(6);
};
i18n.phonenumbers.PhoneNumber.prototype.countryCodeSourceCount = function() {
  return this.count$Values(6);
};
i18n.phonenumbers.PhoneNumber.prototype.clearCountryCodeSource = function() {
  this.clear$Field(6);
};
i18n.phonenumbers.PhoneNumber.prototype.getPreferredDomesticCarrierCode = function() {
  return(this.get$Value(7));
};
i18n.phonenumbers.PhoneNumber.prototype.getPreferredDomesticCarrierCodeOrDefault = function() {
  return(this.get$ValueOrDefault(7));
};
i18n.phonenumbers.PhoneNumber.prototype.setPreferredDomesticCarrierCode = function(value) {
  this.set$Value(7, value);
};
i18n.phonenumbers.PhoneNumber.prototype.hasPreferredDomesticCarrierCode = function() {
  return this.has$Value(7);
};
i18n.phonenumbers.PhoneNumber.prototype.preferredDomesticCarrierCodeCount = function() {
  return this.count$Values(7);
};
i18n.phonenumbers.PhoneNumber.prototype.clearPreferredDomesticCarrierCode = function() {
  this.clear$Field(7);
};
i18n.phonenumbers.PhoneNumber.CountryCodeSource = {FROM_NUMBER_WITH_PLUS_SIGN:1, FROM_NUMBER_WITH_IDD:5, FROM_NUMBER_WITHOUT_PLUS_SIGN:10, FROM_DEFAULT_COUNTRY:20};
goog.proto2.Message.set$Metadata(i18n.phonenumbers.PhoneNumber, {0:{name:"PhoneNumber", fullName:"i18n.phonenumbers.PhoneNumber"}, 1:{name:"country_code", required:true, fieldType:goog.proto2.Message.FieldType.INT32, type:Number}, 2:{name:"national_number", required:true, fieldType:goog.proto2.Message.FieldType.UINT64, type:Number}, 3:{name:"extension", fieldType:goog.proto2.Message.FieldType.STRING, type:String}, 4:{name:"italian_leading_zero", fieldType:goog.proto2.Message.FieldType.BOOL, type:Boolean}, 
8:{name:"number_of_leading_zeros", fieldType:goog.proto2.Message.FieldType.INT32, defaultValue:1, type:Number}, 5:{name:"raw_input", fieldType:goog.proto2.Message.FieldType.STRING, type:String}, 6:{name:"country_code_source", fieldType:goog.proto2.Message.FieldType.ENUM, defaultValue:i18n.phonenumbers.PhoneNumber.CountryCodeSource.FROM_NUMBER_WITH_PLUS_SIGN, type:i18n.phonenumbers.PhoneNumber.CountryCodeSource}, 7:{name:"preferred_domestic_carrier_code", fieldType:goog.proto2.Message.FieldType.STRING, 
type:String}});
goog.require("goog.dom");
goog.require("goog.json");
goog.require("goog.proto2.ObjectSerializer");
goog.require("goog.string.StringBuffer");
goog.require("i18n.phonenumbers.AsYouTypeFormatter");
goog.require("i18n.phonenumbers.PhoneNumberFormat");
goog.require("i18n.phonenumbers.PhoneNumberType");
goog.require("i18n.phonenumbers.PhoneNumberUtil");
goog.require("i18n.phonenumbers.PhoneNumberUtil.ValidationResult");
