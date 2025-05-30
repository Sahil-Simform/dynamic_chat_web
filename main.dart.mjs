
// `modulePromise` is a promise to the `WebAssembly.module` object to be
//   instantiated.
// `importObjectPromise` is a promise to an object that contains any additional
//   imports needed by the module that aren't provided by the standard runtime.
//   The fields on this object will be merged into the importObject with which
//   the module will be instantiated.
// This function returns a promise to the instantiated module.
export const instantiate = async (modulePromise, importObjectPromise) => {
    let dartInstance;

    // Prints to the console
    function printToConsole(value) {
      if (typeof dartPrint == "function") {
        dartPrint(value);
        return;
      }
      if (typeof console == "object" && typeof console.log != "undefined") {
        console.log(value);
        return;
      }
      if (typeof print == "function") {
        print(value);
        return;
      }

      throw "Unable to print message: " + js;
    }

    // Converts a Dart List to a JS array. Any Dart objects will be converted, but
    // this will be cheap for JSValues.
    function arrayFromDartList(constructor, list) {
      const exports = dartInstance.exports;
      const read = exports.$listRead;
      const length = exports.$listLength(list);
      const array = new constructor(length);
      for (let i = 0; i < length; i++) {
        array[i] = read(list, i);
      }
      return array;
    }

    // A special symbol attached to functions that wrap Dart functions.
    const jsWrappedDartFunctionSymbol = Symbol("JSWrappedDartFunction");

    function finalizeWrapper(dartFunction, wrapped) {
      wrapped.dartFunction = dartFunction;
      wrapped[jsWrappedDartFunctionSymbol] = true;
      return wrapped;
    }

    // Imports
    const dart2wasm = {

_1: (x0,x1,x2) => x0.set(x1,x2),
_2: (x0,x1,x2) => x0.set(x1,x2),
_6: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._6(f,arguments.length,x0) }),
_7: x0 => new window.FinalizationRegistry(x0),
_8: (x0,x1,x2,x3) => x0.register(x1,x2,x3),
_9: (x0,x1) => x0.unregister(x1),
_10: (x0,x1,x2) => x0.slice(x1,x2),
_11: (x0,x1) => x0.decode(x1),
_12: (x0,x1) => x0.segment(x1),
_13: () => new TextDecoder(),
_14: x0 => x0.buffer,
_15: x0 => x0.wasmMemory,
_16: () => globalThis.window._flutter_skwasmInstance,
_17: x0 => x0.rasterStartMilliseconds,
_18: x0 => x0.rasterEndMilliseconds,
_19: x0 => x0.imageBitmaps,
_167: x0 => x0.select(),
_168: (x0,x1) => x0.append(x1),
_169: x0 => x0.remove(),
_172: x0 => x0.unlock(),
_177: x0 => x0.getReader(),
_189: x0 => new MutationObserver(x0),
_208: (x0,x1,x2) => x0.addEventListener(x1,x2),
_209: (x0,x1,x2) => x0.removeEventListener(x1,x2),
_212: x0 => new ResizeObserver(x0),
_215: (x0,x1) => new Intl.Segmenter(x0,x1),
_216: x0 => x0.next(),
_217: (x0,x1) => new Intl.v8BreakIterator(x0,x1),
_294: x0 => x0.close(),
_295: (x0,x1,x2,x3,x4) => ({type: x0,data: x1,premultiplyAlpha: x2,colorSpaceConversion: x3,preferAnimation: x4}),
_296: x0 => new window.ImageDecoder(x0),
_297: x0 => x0.close(),
_298: x0 => ({frameIndex: x0}),
_299: (x0,x1) => x0.decode(x1),
_302: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._302(f,arguments.length,x0) }),
_303: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._303(f,arguments.length,x0) }),
_304: (x0,x1) => ({addView: x0,removeView: x1}),
_305: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._305(f,arguments.length,x0) }),
_306: f => finalizeWrapper(f, function() { return dartInstance.exports._306(f,arguments.length) }),
_307: (x0,x1) => ({initializeEngine: x0,autoStart: x1}),
_308: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._308(f,arguments.length,x0) }),
_309: x0 => ({runApp: x0}),
_310: x0 => new Uint8Array(x0),
_312: x0 => x0.preventDefault(),
_313: x0 => x0.stopPropagation(),
_314: (x0,x1) => x0.addListener(x1),
_315: (x0,x1) => x0.removeListener(x1),
_316: (x0,x1) => x0.prepend(x1),
_317: x0 => x0.remove(),
_318: x0 => x0.disconnect(),
_319: (x0,x1) => x0.addListener(x1),
_320: (x0,x1) => x0.removeListener(x1),
_322: (x0,x1) => x0.append(x1),
_323: x0 => x0.remove(),
_324: x0 => x0.stopPropagation(),
_328: x0 => x0.preventDefault(),
_329: (x0,x1) => x0.append(x1),
_330: x0 => x0.remove(),
_331: x0 => x0.preventDefault(),
_336: (x0,x1) => x0.appendChild(x1),
_337: (x0,x1,x2) => x0.insertBefore(x1,x2),
_338: (x0,x1) => x0.removeChild(x1),
_339: (x0,x1) => x0.appendChild(x1),
_340: (x0,x1) => x0.transferFromImageBitmap(x1),
_341: (x0,x1) => x0.append(x1),
_342: (x0,x1) => x0.append(x1),
_343: (x0,x1) => x0.append(x1),
_344: x0 => x0.remove(),
_345: x0 => x0.remove(),
_346: x0 => x0.remove(),
_347: (x0,x1) => x0.appendChild(x1),
_348: (x0,x1) => x0.appendChild(x1),
_349: x0 => x0.remove(),
_350: (x0,x1) => x0.append(x1),
_351: (x0,x1) => x0.append(x1),
_352: x0 => x0.remove(),
_353: (x0,x1) => x0.append(x1),
_354: (x0,x1) => x0.append(x1),
_355: (x0,x1,x2) => x0.insertBefore(x1,x2),
_356: (x0,x1) => x0.append(x1),
_357: (x0,x1,x2) => x0.insertBefore(x1,x2),
_358: x0 => x0.remove(),
_359: x0 => x0.remove(),
_360: (x0,x1) => x0.append(x1),
_361: x0 => x0.remove(),
_362: (x0,x1) => x0.append(x1),
_363: x0 => x0.remove(),
_364: x0 => x0.remove(),
_365: x0 => x0.getBoundingClientRect(),
_366: x0 => x0.remove(),
_367: x0 => x0.blur(),
_368: x0 => x0.remove(),
_369: x0 => x0.blur(),
_370: x0 => x0.remove(),
_383: (x0,x1) => x0.append(x1),
_384: x0 => x0.remove(),
_385: (x0,x1) => x0.append(x1),
_386: (x0,x1,x2) => x0.insertBefore(x1,x2),
_387: x0 => x0.preventDefault(),
_388: x0 => x0.preventDefault(),
_389: x0 => x0.preventDefault(),
_390: x0 => x0.preventDefault(),
_391: x0 => x0.remove(),
_392: (x0,x1) => x0.observe(x1),
_393: x0 => x0.disconnect(),
_394: (x0,x1) => x0.appendChild(x1),
_395: (x0,x1) => x0.appendChild(x1),
_396: (x0,x1) => x0.appendChild(x1),
_397: (x0,x1) => x0.append(x1),
_398: x0 => x0.remove(),
_399: (x0,x1) => x0.append(x1),
_400: (x0,x1) => x0.append(x1),
_401: (x0,x1) => x0.appendChild(x1),
_402: (x0,x1) => x0.append(x1),
_403: x0 => x0.remove(),
_404: (x0,x1) => x0.append(x1),
_408: (x0,x1) => x0.appendChild(x1),
_409: x0 => x0.remove(),
_969: () => globalThis.window.flutterConfiguration,
_970: x0 => x0.assetBase,
_975: x0 => x0.debugShowSemanticsNodes,
_976: x0 => x0.hostElement,
_977: x0 => x0.multiViewEnabled,
_978: x0 => x0.nonce,
_980: x0 => x0.fontFallbackBaseUrl,
_981: x0 => x0.useColorEmoji,
_985: x0 => x0.console,
_986: x0 => x0.devicePixelRatio,
_987: x0 => x0.document,
_988: x0 => x0.history,
_989: x0 => x0.innerHeight,
_990: x0 => x0.innerWidth,
_991: x0 => x0.location,
_992: x0 => x0.navigator,
_993: x0 => x0.visualViewport,
_994: x0 => x0.performance,
_995: (x0,x1) => x0.fetch(x1),
_1000: (x0,x1) => x0.dispatchEvent(x1),
_1001: (x0,x1) => x0.matchMedia(x1),
_1002: (x0,x1) => x0.getComputedStyle(x1),
_1004: x0 => x0.screen,
_1005: (x0,x1) => x0.requestAnimationFrame(x1),
_1006: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._1006(f,arguments.length,x0) }),
_1010: (x0,x1) => x0.warn(x1),
_1012: (x0,x1) => x0.debug(x1),
_1013: () => globalThis.window,
_1014: () => globalThis.Intl,
_1015: () => globalThis.Symbol,
_1018: x0 => x0.clipboard,
_1019: x0 => x0.maxTouchPoints,
_1020: x0 => x0.vendor,
_1021: x0 => x0.language,
_1022: x0 => x0.platform,
_1023: x0 => x0.userAgent,
_1024: x0 => x0.languages,
_1025: x0 => x0.documentElement,
_1026: (x0,x1) => x0.querySelector(x1),
_1029: (x0,x1) => x0.createElement(x1),
_1031: (x0,x1) => x0.execCommand(x1),
_1035: (x0,x1) => x0.createTextNode(x1),
_1036: (x0,x1) => x0.createEvent(x1),
_1040: x0 => x0.head,
_1041: x0 => x0.body,
_1042: (x0,x1) => x0.title = x1,
_1045: x0 => x0.activeElement,
_1047: x0 => x0.visibilityState,
_1048: () => globalThis.document,
_1049: (x0,x1,x2) => x0.addEventListener(x1,x2),
_1050: (x0,x1,x2,x3) => x0.addEventListener(x1,x2,x3),
_1051: (x0,x1,x2,x3) => x0.addEventListener(x1,x2,x3),
_1052: (x0,x1,x2) => x0.removeEventListener(x1,x2),
_1055: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._1055(f,arguments.length,x0) }),
_1056: x0 => x0.target,
_1058: x0 => x0.timeStamp,
_1059: x0 => x0.type,
_1061: x0 => x0.preventDefault(),
_1065: (x0,x1,x2,x3) => x0.initEvent(x1,x2,x3),
_1070: x0 => x0.firstChild,
_1076: x0 => x0.parentElement,
_1078: x0 => x0.parentNode,
_1081: (x0,x1) => x0.removeChild(x1),
_1082: (x0,x1) => x0.removeChild(x1),
_1083: x0 => x0.isConnected,
_1084: (x0,x1) => x0.textContent = x1,
_1087: (x0,x1) => x0.contains(x1),
_1092: x0 => x0.firstElementChild,
_1094: x0 => x0.nextElementSibling,
_1095: x0 => x0.clientHeight,
_1096: x0 => x0.clientWidth,
_1097: x0 => x0.offsetHeight,
_1098: x0 => x0.offsetWidth,
_1099: x0 => x0.id,
_1100: (x0,x1) => x0.id = x1,
_1103: (x0,x1) => x0.spellcheck = x1,
_1104: x0 => x0.tagName,
_1105: x0 => x0.style,
_1107: (x0,x1) => x0.append(x1),
_1108: (x0,x1) => x0.getAttribute(x1),
_1109: x0 => x0.getBoundingClientRect(),
_1112: (x0,x1) => x0.closest(x1),
_1114: (x0,x1) => x0.querySelectorAll(x1),
_1115: x0 => x0.remove(),
_1116: (x0,x1,x2) => x0.setAttribute(x1,x2),
_1118: (x0,x1) => x0.removeAttribute(x1),
_1119: (x0,x1) => x0.tabIndex = x1,
_1121: (x0,x1) => x0.focus(x1),
_1122: x0 => x0.scrollTop,
_1123: (x0,x1) => x0.scrollTop = x1,
_1124: x0 => x0.scrollLeft,
_1125: (x0,x1) => x0.scrollLeft = x1,
_1126: x0 => x0.classList,
_1127: (x0,x1) => x0.className = x1,
_1131: (x0,x1) => x0.getElementsByClassName(x1),
_1132: x0 => x0.click(),
_1133: (x0,x1) => x0.hasAttribute(x1),
_1136: (x0,x1) => x0.attachShadow(x1),
_1140: (x0,x1) => x0.getPropertyValue(x1),
_1142: (x0,x1,x2,x3) => x0.setProperty(x1,x2,x3),
_1144: (x0,x1) => x0.removeProperty(x1),
_1146: x0 => x0.offsetLeft,
_1147: x0 => x0.offsetTop,
_1148: x0 => x0.offsetParent,
_1150: (x0,x1) => x0.name = x1,
_1151: x0 => x0.content,
_1152: (x0,x1) => x0.content = x1,
_1165: (x0,x1) => x0.nonce = x1,
_1170: x0 => x0.now(),
_1172: (x0,x1) => x0.width = x1,
_1174: (x0,x1) => x0.height = x1,
_1178: (x0,x1) => x0.getContext(x1),
_1256: x0 => x0.status,
_1257: x0 => x0.headers,
_1258: x0 => x0.body,
_1259: x0 => x0.arrayBuffer(),
_1262: (x0,x1) => x0.get(x1),
_1264: x0 => x0.read(),
_1265: x0 => x0.value,
_1266: x0 => x0.done,
_1268: x0 => x0.name,
_1269: x0 => x0.x,
_1270: x0 => x0.y,
_1273: x0 => x0.top,
_1274: x0 => x0.right,
_1275: x0 => x0.bottom,
_1276: x0 => x0.left,
_1285: x0 => x0.height,
_1286: x0 => x0.width,
_1287: (x0,x1) => x0.value = x1,
_1289: (x0,x1) => x0.placeholder = x1,
_1290: (x0,x1) => x0.name = x1,
_1291: x0 => x0.selectionDirection,
_1292: x0 => x0.selectionStart,
_1293: x0 => x0.selectionEnd,
_1296: x0 => x0.value,
_1298: (x0,x1,x2) => x0.setSelectionRange(x1,x2),
_1303: x0 => x0.readText(),
_1304: (x0,x1) => x0.writeText(x1),
_1305: x0 => x0.altKey,
_1306: x0 => x0.code,
_1307: x0 => x0.ctrlKey,
_1308: x0 => x0.key,
_1309: x0 => x0.keyCode,
_1310: x0 => x0.location,
_1311: x0 => x0.metaKey,
_1312: x0 => x0.repeat,
_1313: x0 => x0.shiftKey,
_1314: x0 => x0.isComposing,
_1315: (x0,x1) => x0.getModifierState(x1),
_1316: x0 => x0.state,
_1319: (x0,x1) => x0.go(x1),
_1320: (x0,x1,x2,x3) => x0.pushState(x1,x2,x3),
_1321: (x0,x1,x2,x3) => x0.replaceState(x1,x2,x3),
_1322: x0 => x0.pathname,
_1323: x0 => x0.search,
_1324: x0 => x0.hash,
_1327: x0 => x0.state,
_1333: f => finalizeWrapper(f, function(x0,x1) { return dartInstance.exports._1333(f,arguments.length,x0,x1) }),
_1335: (x0,x1,x2) => x0.observe(x1,x2),
_1338: x0 => x0.attributeName,
_1339: x0 => x0.type,
_1340: x0 => x0.matches,
_1344: x0 => x0.matches,
_1345: x0 => x0.relatedTarget,
_1346: x0 => x0.clientX,
_1347: x0 => x0.clientY,
_1348: x0 => x0.offsetX,
_1349: x0 => x0.offsetY,
_1352: x0 => x0.button,
_1353: x0 => x0.buttons,
_1354: x0 => x0.ctrlKey,
_1355: (x0,x1) => x0.getModifierState(x1),
_1356: x0 => x0.pointerId,
_1357: x0 => x0.pointerType,
_1358: x0 => x0.pressure,
_1359: x0 => x0.tiltX,
_1360: x0 => x0.tiltY,
_1361: x0 => x0.getCoalescedEvents(),
_1362: x0 => x0.deltaX,
_1363: x0 => x0.deltaY,
_1364: x0 => x0.wheelDeltaX,
_1365: x0 => x0.wheelDeltaY,
_1366: x0 => x0.deltaMode,
_1371: x0 => x0.changedTouches,
_1373: x0 => x0.clientX,
_1374: x0 => x0.clientY,
_1375: x0 => x0.data,
_1376: (x0,x1) => x0.type = x1,
_1377: (x0,x1) => x0.max = x1,
_1378: (x0,x1) => x0.min = x1,
_1379: (x0,x1) => x0.value = x1,
_1380: x0 => x0.value,
_1381: x0 => x0.disabled,
_1382: (x0,x1) => x0.disabled = x1,
_1383: (x0,x1) => x0.placeholder = x1,
_1384: (x0,x1) => x0.name = x1,
_1385: (x0,x1) => x0.autocomplete = x1,
_1386: x0 => x0.selectionDirection,
_1387: x0 => x0.selectionStart,
_1388: x0 => x0.selectionEnd,
_1392: (x0,x1,x2) => x0.setSelectionRange(x1,x2),
_1399: (x0,x1) => x0.add(x1),
_1402: (x0,x1) => x0.noValidate = x1,
_1403: (x0,x1) => x0.method = x1,
_1404: (x0,x1) => x0.action = x1,
_1431: x0 => x0.orientation,
_1432: x0 => x0.width,
_1433: x0 => x0.height,
_1434: (x0,x1) => x0.lock(x1),
_1451: f => finalizeWrapper(f, function(x0,x1) { return dartInstance.exports._1451(f,arguments.length,x0,x1) }),
_1461: x0 => x0.length,
_1462: (x0,x1) => x0.item(x1),
_1463: x0 => x0.length,
_1464: (x0,x1) => x0.item(x1),
_1465: x0 => x0.iterator,
_1466: x0 => x0.Segmenter,
_1467: x0 => x0.v8BreakIterator,
_1470: x0 => x0.done,
_1471: x0 => x0.value,
_1472: x0 => x0.index,
_1476: (x0,x1) => x0.adoptText(x1),
_1478: x0 => x0.first(),
_1479: x0 => x0.next(),
_1480: x0 => x0.current(),
_1493: x0 => x0.hostElement,
_1494: x0 => x0.viewConstraints,
_1496: x0 => x0.maxHeight,
_1497: x0 => x0.maxWidth,
_1498: x0 => x0.minHeight,
_1499: x0 => x0.minWidth,
_1500: x0 => x0.loader,
_1501: () => globalThis._flutter,
_1502: (x0,x1) => x0.didCreateEngineInitializer(x1),
_1503: (x0,x1,x2) => x0.call(x1,x2),
_1504: () => globalThis.Promise,
_1505: f => finalizeWrapper(f, function(x0,x1) { return dartInstance.exports._1505(f,arguments.length,x0,x1) }),
_1508: x0 => x0.length,
_1511: x0 => x0.tracks,
_1515: x0 => x0.image,
_1520: x0 => x0.codedWidth,
_1521: x0 => x0.codedHeight,
_1524: x0 => x0.duration,
_1528: x0 => x0.ready,
_1529: x0 => x0.selectedTrack,
_1530: x0 => x0.repetitionCount,
_1531: x0 => x0.frameCount,
_1579: (x0,x1,x2) => x0.addEventListener(x1,x2),
_1583: () => globalThis.window.navigator.userAgent,
_1584: x0 => x0.createRange(),
_1585: (x0,x1) => x0.selectNode(x1),
_1586: x0 => x0.getSelection(),
_1587: x0 => x0.removeAllRanges(),
_1588: (x0,x1) => x0.addRange(x1),
_1589: (x0,x1) => x0.createElement(x1),
_1590: (x0,x1) => x0.add(x1),
_1591: (x0,x1) => x0.append(x1),
_1592: (x0,x1,x2) => x0.insertRule(x1,x2),
_1593: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._1593(f,arguments.length,x0) }),
_1594: (x0,x1,x2,x3) => x0.addEventListener(x1,x2,x3),
_1604: (x0,x1,x2,x3) => x0.removeEventListener(x1,x2,x3),
_1607: (x0,x1,x2,x3) => x0.open(x1,x2,x3),
_1619: x0 => new Array(x0),
_1653: (decoder, codeUnits) => decoder.decode(codeUnits),
_1654: () => new TextDecoder("utf-8", {fatal: true}),
_1655: () => new TextDecoder("utf-8", {fatal: false}),
_1656: v => v.toString(),
_1657: (d, digits) => d.toFixed(digits),
_1661: x0 => new WeakRef(x0),
_1662: x0 => x0.deref(),
_1668: Date.now,
_1670: s => new Date(s * 1000).getTimezoneOffset() * 60 ,
_1671: s => {
      if (!/^\s*[+-]?(?:Infinity|NaN|(?:\.\d+|\d+(?:\.\d*)?)(?:[eE][+-]?\d+)?)\s*$/.test(s)) {
        return NaN;
      }
      return parseFloat(s);
    },
_1672: () => {
          let stackString = new Error().stack.toString();
          let frames = stackString.split('\n');
          let drop = 2;
          if (frames[0] === 'Error') {
              drop += 1;
          }
          return frames.slice(drop).join('\n');
        },
_1673: () => typeof dartUseDateNowForTicks !== "undefined",
_1674: () => 1000 * performance.now(),
_1675: () => Date.now(),
_1676: () => {
      // On browsers return `globalThis.location.href`
      if (globalThis.location != null) {
        return globalThis.location.href;
      }
      return null;
    },
_1677: () => {
        return typeof process != "undefined" &&
               Object.prototype.toString.call(process) == "[object process]" &&
               process.platform == "win32"
      },
_1678: () => new WeakMap(),
_1679: (map, o) => map.get(o),
_1680: (map, o, v) => map.set(o, v),
_1681: () => globalThis.WeakRef,
_1692: s => JSON.stringify(s),
_1693: s => printToConsole(s),
_1694: a => a.join(''),
_1695: (o, a, b) => o.replace(a, b),
_1697: (s, t) => s.split(t),
_1698: s => s.toLowerCase(),
_1699: s => s.toUpperCase(),
_1700: s => s.trim(),
_1701: s => s.trimLeft(),
_1702: s => s.trimRight(),
_1704: (s, p, i) => s.indexOf(p, i),
_1705: (s, p, i) => s.lastIndexOf(p, i),
_1706: (s) => s.replace(/\$/g, "$$$$"),
_1707: Object.is,
_1708: s => s.toUpperCase(),
_1709: s => s.toLowerCase(),
_1710: (a, i) => a.push(i),
_1711: (a, i) => a.splice(i, 1)[0],
_1713: (a, l) => a.length = l,
_1714: a => a.pop(),
_1715: (a, i) => a.splice(i, 1),
_1717: (a, s) => a.join(s),
_1718: (a, s, e) => a.slice(s, e),
_1719: (a, s, e) => a.splice(s, e),
_1720: (a, b) => a == b ? 0 : (a > b ? 1 : -1),
_1721: a => a.length,
_1723: (a, i) => a[i],
_1724: (a, i, v) => a[i] = v,
_1726: (o, offsetInBytes, lengthInBytes) => {
      var dst = new ArrayBuffer(lengthInBytes);
      new Uint8Array(dst).set(new Uint8Array(o, offsetInBytes, lengthInBytes));
      return new DataView(dst);
    },
_1727: (o, start, length) => new Uint8Array(o.buffer, o.byteOffset + start, length),
_1728: (o, start, length) => new Int8Array(o.buffer, o.byteOffset + start, length),
_1729: (o, start, length) => new Uint8ClampedArray(o.buffer, o.byteOffset + start, length),
_1730: (o, start, length) => new Uint16Array(o.buffer, o.byteOffset + start, length),
_1731: (o, start, length) => new Int16Array(o.buffer, o.byteOffset + start, length),
_1732: (o, start, length) => new Uint32Array(o.buffer, o.byteOffset + start, length),
_1733: (o, start, length) => new Int32Array(o.buffer, o.byteOffset + start, length),
_1735: (o, start, length) => new BigInt64Array(o.buffer, o.byteOffset + start, length),
_1736: (o, start, length) => new Float32Array(o.buffer, o.byteOffset + start, length),
_1737: (o, start, length) => new Float64Array(o.buffer, o.byteOffset + start, length),
_1738: (t, s) => t.set(s),
_1740: (o) => new DataView(o.buffer, o.byteOffset, o.byteLength),
_1742: o => o.buffer,
_1743: o => o.byteOffset,
_1744: Function.prototype.call.bind(Object.getOwnPropertyDescriptor(DataView.prototype, 'byteLength').get),
_1745: (b, o) => new DataView(b, o),
_1746: (b, o, l) => new DataView(b, o, l),
_1747: Function.prototype.call.bind(DataView.prototype.getUint8),
_1748: Function.prototype.call.bind(DataView.prototype.setUint8),
_1749: Function.prototype.call.bind(DataView.prototype.getInt8),
_1750: Function.prototype.call.bind(DataView.prototype.setInt8),
_1751: Function.prototype.call.bind(DataView.prototype.getUint16),
_1752: Function.prototype.call.bind(DataView.prototype.setUint16),
_1753: Function.prototype.call.bind(DataView.prototype.getInt16),
_1754: Function.prototype.call.bind(DataView.prototype.setInt16),
_1755: Function.prototype.call.bind(DataView.prototype.getUint32),
_1756: Function.prototype.call.bind(DataView.prototype.setUint32),
_1757: Function.prototype.call.bind(DataView.prototype.getInt32),
_1758: Function.prototype.call.bind(DataView.prototype.setInt32),
_1761: Function.prototype.call.bind(DataView.prototype.getBigInt64),
_1762: Function.prototype.call.bind(DataView.prototype.setBigInt64),
_1763: Function.prototype.call.bind(DataView.prototype.getFloat32),
_1764: Function.prototype.call.bind(DataView.prototype.setFloat32),
_1765: Function.prototype.call.bind(DataView.prototype.getFloat64),
_1766: Function.prototype.call.bind(DataView.prototype.setFloat64),
_1767: (x0,x1) => x0.getRandomValues(x1),
_1768: x0 => new Uint8Array(x0),
_1769: () => globalThis.crypto,
_1780: () => new XMLHttpRequest(),
_1781: (x0,x1,x2) => x0.open(x1,x2),
_1782: (x0,x1,x2) => x0.setRequestHeader(x1,x2),
_1783: (x0,x1,x2) => x0.setRequestHeader(x1,x2),
_1784: x0 => x0.abort(),
_1785: x0 => x0.abort(),
_1786: x0 => x0.abort(),
_1787: x0 => x0.abort(),
_1788: (x0,x1) => x0.send(x1),
_1789: x0 => x0.send(),
_1791: x0 => x0.getAllResponseHeaders(),
_1792: (o, t) => o instanceof t,
_1794: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._1794(f,arguments.length,x0) }),
_1795: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._1795(f,arguments.length,x0) }),
_1796: o => Object.keys(o),
_1797: (ms, c) =>
              setTimeout(() => dartInstance.exports.$invokeCallback(c),ms),
_1798: (handle) => clearTimeout(handle),
_1799: (ms, c) =>
          setInterval(() => dartInstance.exports.$invokeCallback(c), ms),
_1800: (handle) => clearInterval(handle),
_1801: (c) =>
              queueMicrotask(() => dartInstance.exports.$invokeCallback(c)),
_1802: () => Date.now(),
_1803: () => new XMLHttpRequest(),
_1804: (x0,x1,x2,x3) => x0.open(x1,x2,x3),
_1805: (x0,x1,x2) => x0.setRequestHeader(x1,x2),
_1807: x0 => x0.getAllResponseHeaders(),
_1813: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._1813(f,arguments.length,x0) }),
_1814: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._1814(f,arguments.length,x0) }),
_1836: (s, m) => {
          try {
            return new RegExp(s, m);
          } catch (e) {
            return String(e);
          }
        },
_1837: (x0,x1) => x0.exec(x1),
_1838: (x0,x1) => x0.test(x1),
_1839: (x0,x1) => x0.exec(x1),
_1840: (x0,x1) => x0.exec(x1),
_1841: x0 => x0.pop(),
_1845: (x0,x1,x2) => x0[x1] = x2,
_1847: o => o === undefined,
_1848: o => typeof o === 'boolean',
_1849: o => typeof o === 'number',
_1851: o => typeof o === 'string',
_1854: o => o instanceof Int8Array,
_1855: o => o instanceof Uint8Array,
_1856: o => o instanceof Uint8ClampedArray,
_1857: o => o instanceof Int16Array,
_1858: o => o instanceof Uint16Array,
_1859: o => o instanceof Int32Array,
_1860: o => o instanceof Uint32Array,
_1861: o => o instanceof Float32Array,
_1862: o => o instanceof Float64Array,
_1863: o => o instanceof ArrayBuffer,
_1864: o => o instanceof DataView,
_1865: o => o instanceof Array,
_1866: o => typeof o === 'function' && o[jsWrappedDartFunctionSymbol] === true,
_1868: o => {
            const proto = Object.getPrototypeOf(o);
            return proto === Object.prototype || proto === null;
          },
_1869: o => o instanceof RegExp,
_1870: (l, r) => l === r,
_1871: o => o,
_1872: o => o,
_1873: o => o,
_1874: b => !!b,
_1875: o => o.length,
_1878: (o, i) => o[i],
_1879: f => f.dartFunction,
_1880: l => arrayFromDartList(Int8Array, l),
_1881: (data, length) => {
          const jsBytes = new Uint8Array(length);
          const getByte = dartInstance.exports.$uint8ListGet;
          for (let i = 0; i < length; i++) {
            jsBytes[i] = getByte(data, i);
          }
          return jsBytes;
        },
_1882: l => arrayFromDartList(Uint8ClampedArray, l),
_1883: l => arrayFromDartList(Int16Array, l),
_1884: l => arrayFromDartList(Uint16Array, l),
_1885: l => arrayFromDartList(Int32Array, l),
_1886: l => arrayFromDartList(Uint32Array, l),
_1887: l => arrayFromDartList(Float32Array, l),
_1888: l => arrayFromDartList(Float64Array, l),
_1889: (data, length) => {
          const read = dartInstance.exports.$byteDataGetUint8;
          const view = new DataView(new ArrayBuffer(length));
          for (let i = 0; i < length; i++) {
              view.setUint8(i, read(data, i));
          }
          return view;
        },
_1890: l => arrayFromDartList(Array, l),
_1891:       (s, length) => {
        if (length == 0) return '';

        const read = dartInstance.exports.$stringRead1;
        let result = '';
        let index = 0;
        const chunkLength = Math.min(length - index, 500);
        let array = new Array(chunkLength);
        while (index < length) {
          const newChunkLength = Math.min(length - index, 500);
          for (let i = 0; i < newChunkLength; i++) {
            array[i] = read(s, index++);
          }
          if (newChunkLength < chunkLength) {
            array = array.slice(0, newChunkLength);
          }
          result += String.fromCharCode(...array);
        }
        return result;
      }
      ,
_1892:     (s, length) => {
      if (length == 0) return '';

      const read = dartInstance.exports.$stringRead2;
      let result = '';
      let index = 0;
      const chunkLength = Math.min(length - index, 500);
      let array = new Array(chunkLength);
      while (index < length) {
        const newChunkLength = Math.min(length - index, 500);
        for (let i = 0; i < newChunkLength; i++) {
          array[i] = read(s, index++);
        }
        if (newChunkLength < chunkLength) {
          array = array.slice(0, newChunkLength);
        }
        result += String.fromCharCode(...array);
      }
      return result;
    }
    ,
_1893:     (s) => {
      let length = s.length;
      let range = 0;
      for (let i = 0; i < length; i++) {
        range |= s.codePointAt(i);
      }
      const exports = dartInstance.exports;
      if (range < 256) {
        if (length <= 10) {
          if (length == 1) {
            return exports.$stringAllocate1_1(s.codePointAt(0));
          }
          if (length == 2) {
            return exports.$stringAllocate1_2(s.codePointAt(0), s.codePointAt(1));
          }
          if (length == 3) {
            return exports.$stringAllocate1_3(s.codePointAt(0), s.codePointAt(1), s.codePointAt(2));
          }
          if (length == 4) {
            return exports.$stringAllocate1_4(s.codePointAt(0), s.codePointAt(1), s.codePointAt(2), s.codePointAt(3));
          }
          if (length == 5) {
            return exports.$stringAllocate1_5(s.codePointAt(0), s.codePointAt(1), s.codePointAt(2), s.codePointAt(3), s.codePointAt(4));
          }
          if (length == 6) {
            return exports.$stringAllocate1_6(s.codePointAt(0), s.codePointAt(1), s.codePointAt(2), s.codePointAt(3), s.codePointAt(4), s.codePointAt(5));
          }
          if (length == 7) {
            return exports.$stringAllocate1_7(s.codePointAt(0), s.codePointAt(1), s.codePointAt(2), s.codePointAt(3), s.codePointAt(4), s.codePointAt(5), s.codePointAt(6));
          }
          if (length == 8) {
            return exports.$stringAllocate1_8(s.codePointAt(0), s.codePointAt(1), s.codePointAt(2), s.codePointAt(3), s.codePointAt(4), s.codePointAt(5), s.codePointAt(6), s.codePointAt(7));
          }
          if (length == 9) {
            return exports.$stringAllocate1_9(s.codePointAt(0), s.codePointAt(1), s.codePointAt(2), s.codePointAt(3), s.codePointAt(4), s.codePointAt(5), s.codePointAt(6), s.codePointAt(7), s.codePointAt(8));
          }
          if (length == 10) {
            return exports.$stringAllocate1_10(s.codePointAt(0), s.codePointAt(1), s.codePointAt(2), s.codePointAt(3), s.codePointAt(4), s.codePointAt(5), s.codePointAt(6), s.codePointAt(7), s.codePointAt(8), s.codePointAt(9));
          }
        }
        const dartString = exports.$stringAllocate1(length);
        const write = exports.$stringWrite1;
        for (let i = 0; i < length; i++) {
          write(dartString, i, s.codePointAt(i));
        }
        return dartString;
      } else {
        const dartString = exports.$stringAllocate2(length);
        const write = exports.$stringWrite2;
        for (let i = 0; i < length; i++) {
          write(dartString, i, s.charCodeAt(i));
        }
        return dartString;
      }
    }
    ,
_1894: () => ({}),
_1895: () => [],
_1896: l => new Array(l),
_1897: () => globalThis,
_1898: (constructor, args) => {
      const factoryFunction = constructor.bind.apply(
          constructor, [null, ...args]);
      return new factoryFunction();
    },
_1899: (o, p) => p in o,
_1900: (o, p) => o[p],
_1901: (o, p, v) => o[p] = v,
_1902: (o, m, a) => o[m].apply(o, a),
_1904: o => String(o),
_1905: (p, s, f) => p.then(s, f),
_1906: s => {
      if (/[[\]{}()*+?.\\^$|]/.test(s)) {
          s = s.replace(/[[\]{}()*+?.\\^$|]/g, '\\$&');
      }
      return s;
    },
_1908: x0 => x0.input,
_1909: x0 => x0.index,
_1910: x0 => x0.groups,
_1911: x0 => x0.length,
_1913: (x0,x1) => x0[x1],
_1914: (x0,x1) => x0.exec(x1),
_1916: x0 => x0.flags,
_1917: x0 => x0.multiline,
_1918: x0 => x0.ignoreCase,
_1919: x0 => x0.unicode,
_1920: x0 => x0.dotAll,
_1921: (x0,x1) => x0.lastIndex = x1,
_1923: (o, p) => o[p],
_1926: () => globalThis.document,
_1927: () => globalThis.window,
_1932: (x0,x1) => x0.height = x1,
_1934: (x0,x1) => x0.width = x1,
_1938: x0 => x0.head,
_1940: x0 => x0.classList,
_1945: (x0,x1) => x0.innerText = x1,
_1946: x0 => x0.style,
_1947: x0 => x0.sheet,
_1949: x0 => x0.offsetX,
_1950: x0 => x0.offsetY,
_1951: x0 => x0.button,
_2015: x0 => x0.readyState,
_2017: (x0,x1) => x0.timeout = x1,
_2019: (x0,x1) => x0.withCredentials = x1,
_2020: x0 => x0.upload,
_2021: x0 => x0.responseURL,
_2022: x0 => x0.status,
_2023: x0 => x0.statusText,
_2025: (x0,x1) => x0.responseType = x1,
_2026: x0 => x0.response,
_2040: x0 => x0.loaded,
_2041: x0 => x0.total,
_3838: () => globalThis.window,
_3903: x0 => x0.navigator,
_4294: x0 => x0.userAgent
    };

    const baseImports = {
        dart2wasm: dart2wasm,


        Math: Math,
        Date: Date,
        Object: Object,
        Array: Array,
        Reflect: Reflect,
    };

    const jsStringPolyfill = {
        "charCodeAt": (s, i) => s.charCodeAt(i),
        "compare": (s1, s2) => {
            if (s1 < s2) return -1;
            if (s1 > s2) return 1;
            return 0;
        },
        "concat": (s1, s2) => s1 + s2,
        "equals": (s1, s2) => s1 === s2,
        "fromCharCode": (i) => String.fromCharCode(i),
        "length": (s) => s.length,
        "substring": (s, a, b) => s.substring(a, b),
    };

    dartInstance = await WebAssembly.instantiate(await modulePromise, {
        ...baseImports,
        ...(await importObjectPromise),
        "wasm:js-string": jsStringPolyfill,
    });

    return dartInstance;
}

// Call the main function for the instantiated module
// `moduleInstance` is the instantiated dart2wasm module
// `args` are any arguments that should be passed into the main function.
export const invoke = (moduleInstance, ...args) => {
  moduleInstance.exports.$invokeMain(args);
}

