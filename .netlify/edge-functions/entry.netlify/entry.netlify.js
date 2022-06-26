/**
 * @license
 * @builder.io/qwik
 * Copyright Builder.io, Inc. All Rights Reserved.
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/BuilderIO/qwik/blob/main/LICENSE
 */
const qTest = globalThis.describe !== undefined;

const EMPTY_ARRAY = [];
const EMPTY_OBJ = {};
{
    Object.freeze(EMPTY_ARRAY);
    Object.freeze(EMPTY_OBJ);
    Error.stackTraceLimit = 9999;
}

const QError_stringifyClassOrStyle = 0;
const QError_cannotSerializeNode = 1; // 'Can not serialize a HTML Node that is not an Element'
const QError_runtimeQrlNoElement = 2; // `Q-ERROR: '${qrl}' is runtime but no instance found on element.`
const QError_verifySerializable$1 = 3; // 'Only primitive and object literals can be serialized', value,
const QError_errorWhileRendering = 4; // Crash while rendering
const QError_cannotRenderOverExistingContainer = 5; //'You can render over a existing q:container. Skipping render().'
const QError_setProperty = 6; //'Set property'
const QError_onlyObjectWrapped = 8;
const QError_onlyLiteralWrapped = 9;
const QError_qrlIsNotFunction$1 = 10;
const QError_useMethodOutsideContext = 14;
const QError_immutableProps = 17;
const QError_hostCanOnlyBeAtRoot = 18;
const QError_immutableJsxProps = 19;
const QError_useInvokeContext = 20;
const qError$1 = (code, ...parts) => {
    const text = codeToText$1(code);
    const error = text + parts.join(' ');
    debugger; // eslint-disable-line no-debugger
    return new Error(error);
};
const codeToText$1 = (code) => {
    {
        const MAP = [
            'Error while serializing class attribute',
            'Can not serialize a HTML Node that is not an Element',
            'Rruntime but no instance found on element.',
            'Only primitive and object literals can be serialized',
            'Crash while rendering',
            'You can render over a existing q:container. Skipping render().',
            'Set property',
            "Only function's and 'string's are supported.",
            "Only objects can be wrapped in 'QObject'",
            `Only objects literals can be wrapped in 'QObject'`,
            'QRL is not a function',
            'Dynamic import not found',
            'Unknown type argument',
            'not found state for useContext',
            "Invoking 'use*()' method outside of invocation context.",
            'Cant access renderCtx for existing context',
            'Cant access document for existing context',
            'props are inmutable',
            '<Host> component can only be used at the root of a Qwik component$()',
            'Props are immutable by default.',
            'use- method must be called only at the root level of a component$()',
        ];
        return `Code(${code}): ${MAP[code] ?? ''}`;
    }
};

const STYLE$1 = `background: #564CE0; color: white; padding: 2px 3px; border-radius: 2px; font-size: 0.8em;`
    ;
const logError$1 = (message, ...optionalParams) => {
    const err = message instanceof Error ? message : new Error(message);
    // eslint-disable-next-line no-console
    console.error('%cQWIK ERROR', STYLE$1, err, ...optionalParams);
    return err;
};
const logErrorAndStop$1 = (message, ...optionalParams) => {
    logError$1(message, ...optionalParams);
    // eslint-disable-next-line no-debugger
    debugger;
};
const logWarn$1 = (message, ...optionalParams) => {
    // eslint-disable-next-line no-console
    {
        console.warn('%cQWIK WARN', STYLE$1, message, ...optionalParams);
    }
};
const logDebug = (message, ...optionalParams) => {
    {
        // eslint-disable-next-line no-console
        console.debug('%cQWIK', STYLE$1, message, ...optionalParams);
    }
};

/**
 * @private
 */
const isObject$1 = (v) => {
    return v && typeof v === 'object';
};
const isArray$1 = (v) => {
    return Array.isArray(v);
};
const isString = (v) => {
    return typeof v === 'string';
};
const isFunction$1 = (v) => {
    return typeof v === 'function';
};

const assertDefined$1 = (value, text) => {
    {
        if (value != null)
            return;
        throw logErrorAndStop$1(text || 'Expected defined value');
    }
};
const assertEqual = (value1, value2, text) => {
    {
        if (value1 === value2)
            return;
        throw logErrorAndStop$1(text || `Expected '${value1}' === '${value2}'.`);
    }
};

/**
 * State factory of the component.
 */
/**
 * State factory of the component.
 */
const QHostAttr = 'q:host';
const OnRenderProp = 'q:renderFn';
/**
 * Component Styles.
 */
const ComponentScopedStyles = 'q:sstyle';
/**
 * Component style host prefix
 */
const ComponentStylesPrefixHost = '💎';
/**
 * Component style content prefix
 */
const ComponentStylesPrefixContent = '⭐️';
/**
 * `<some-element q:slot="...">`
 */
const QSlotAttr = 'q:slot';
const QContainerAttr = 'q:container';
const QContainerSelector$1 = '[q\\:container]';
const RenderEvent = 'qRender';
const ELEMENT_ID = 'q:id';
const ELEMENT_ID_PREFIX = '#';

const getDocument$1 = (node) => {
    if (typeof document !== 'undefined') {
        return document;
    }
    if (node.nodeType === 9) {
        return node;
    }
    const doc = node.ownerDocument;
    assertDefined$1(doc);
    return doc;
};

const isNode$1 = (value) => {
    return value && typeof value.nodeType == 'number';
};
const isDocument$1 = (value) => {
    return value && value.nodeType == 9;
};
const isElement$1 = (value) => {
    return isNode$1(value) && value.nodeType === 1;
};

let _context$1;
const CONTAINER$1 = Symbol('container');
const tryGetInvokeContext = () => {
    if (!_context$1) {
        const context = typeof document !== 'undefined' && document && document.__q_context__;
        if (!context) {
            return undefined;
        }
        if (isArray$1(context)) {
            const element = context[0];
            const hostElement = getHostElement(element);
            assertDefined$1(element);
            return (document.__q_context__ = newInvokeContext$1(getDocument$1(element), hostElement, element, context[1], context[2]));
        }
        return context;
    }
    return _context$1;
};
const getInvokeContext = () => {
    const ctx = tryGetInvokeContext();
    if (!ctx) {
        throw qError$1(QError_useMethodOutsideContext);
    }
    return ctx;
};
const useInvokeContext = () => {
    const ctx = getInvokeContext();
    if (ctx.$event$ !== RenderEvent) {
        throw qError$1(QError_useInvokeContext);
    }
    assertDefined$1(ctx.$hostElement$);
    assertDefined$1(ctx.$waitOn$);
    assertDefined$1(ctx.$renderCtx$);
    assertDefined$1(ctx.$doc$);
    assertDefined$1(ctx.$subscriber$);
    return ctx;
};
const useInvoke$1 = (context, fn, ...args) => {
    const previousContext = _context$1;
    let returnValue;
    try {
        _context$1 = context;
        returnValue = fn.apply(null, args);
    }
    finally {
        const currentCtx = _context$1;
        _context$1 = previousContext;
        if (currentCtx.$waitOn$ && currentCtx.$waitOn$.length > 0) {
            // eslint-disable-next-line no-unsafe-finally
            return Promise.all(currentCtx.$waitOn$).then(() => returnValue);
        }
    }
    return returnValue;
};
const newInvokeContext$1 = (doc, hostElement, element, event, url) => {
    return {
        $seq$: 0,
        $doc$: doc,
        $hostElement$: hostElement,
        $element$: element,
        $event$: event,
        $url$: url || null,
        $qrl$: undefined,
    };
};
const getHostElement = (el) => {
    let foundSlot = false;
    let node = el;
    while (node) {
        const isHost = node.hasAttribute(QHostAttr);
        const isSlot = node.tagName === 'Q:SLOT';
        if (isHost) {
            if (!foundSlot) {
                break;
            }
            else {
                foundSlot = false;
            }
        }
        if (isSlot) {
            foundSlot = true;
        }
        node = node.parentElement;
    }
    return node;
};
const getContainer$1 = (el) => {
    let container = el[CONTAINER$1];
    if (!container) {
        container = el.closest(QContainerSelector$1);
        el[CONTAINER$1] = container;
    }
    return container;
};

const isPromise$1 = (value) => {
    return value instanceof Promise;
};
const then$1 = (promise, thenFn, rejectFn) => {
    return isPromise$1(promise) ? promise.then(thenFn, rejectFn) : thenFn(promise);
};
const promiseAll = (promises) => {
    const hasPromise = promises.some(isPromise$1);
    if (hasPromise) {
        return Promise.all(promises);
    }
    return promises;
};
const isNotNullable = (v) => {
    return v != null;
};

// <docs markdown="../readme.md#useStore">
// !!DO NOT EDIT THIS COMMENT DIRECTLY!!!
// (edit ../readme.md#useStore instead)
/**
 * Creates a object that Qwik can track across serializations.
 *
 * Use `useStore` to create state for your application. The return object is a proxy which has a
 * unique ID. The ID of the object is used in the `QRL`s to refer to the store.
 *
 * ## Example
 *
 * Example showing how `useStore` is used in Counter example to keep track of count.
 *
 * ```tsx
 * const Stores = component$(() => {
 *   const counter = useCounter(1);
 *
 *   // Reactivity happens even for nested objects and arrays
 *   const userData = useStore({
 *     name: 'Manu',
 *     address: {
 *       address: '',
 *       city: '',
 *     },
 *     orgs: [],
 *   });
 *
 *   // useStore() can also accept a function to calculate the initial value
 *   const state = useStore(() => {
 *     return {
 *       value: expensiveInitialValue(),
 *     };
 *   });
 *
 *   return (
 *     <Host>
 *       <div>Counter: {counter.value}</div>
 *       <Child userData={userData} state={state} />
 *     </Host>
 *   );
 * });
 *
 * function useCounter(step: number) {
 *   // Multiple stores can be created in custom hooks for convenience and composability
 *   const counterStore = useStore({
 *     value: 0,
 *   });
 *   useClientEffect$(() => {
 *     // Only runs in the client
 *     const timer = setInterval(() => {
 *       counterStore.value += step;
 *     }, 500);
 *     return () => {
 *       clearInterval(timer);
 *     };
 *   });
 *   return counterStore;
 * }
 * ```
 *
 * @public
 */
// </docs>
const useStore = (initialState, opts) => {
    const { get, set, ctx } = useSequentialScope();
    if (get != null) {
        return get;
    }
    const containerState = ctx.$renderCtx$.$containerState$;
    const value = isFunction$1(initialState) ? initialState() : initialState;
    const recursive = opts?.recursive ?? false;
    const flags = recursive ? QObjectRecursive : 0;
    const newStore = createProxy(value, containerState, flags, undefined);
    set(newStore);
    return newStore;
};
/**
 * @alpha
 */
const useSequentialScope = () => {
    const ctx = useInvokeContext();
    const i = ctx.$seq$;
    const hostElement = ctx.$hostElement$;
    const elementCtx = getContext(hostElement);
    ctx.$seq$++;
    const set = (value) => {
        elementCtx.$seq$[i] = value;
    };
    return {
        get: elementCtx.$seq$[i],
        set,
        i,
        ctx,
    };
};

const createPlatform$1 = (doc) => {
    const moduleCache = new Map();
    return {
        isServer: false,
        importSymbol(element, url, symbolName) {
            const urlDoc = toUrl$1(doc, element, url).toString();
            const urlCopy = new URL(urlDoc);
            urlCopy.hash = '';
            urlCopy.search = '';
            const importURL = urlCopy.href;
            const mod = moduleCache.get(importURL);
            if (mod) {
                return mod[symbolName];
            }
            return import(/* @vite-ignore */ importURL).then((mod) => {
                mod = findModule$1(mod);
                moduleCache.set(importURL, mod);
                return mod[symbolName];
            });
        },
        raf: (fn) => {
            return new Promise((resolve) => {
                requestAnimationFrame(() => {
                    resolve(fn());
                });
            });
        },
        nextTick: (fn) => {
            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve(fn());
                });
            });
        },
        chunkForSymbol() {
            return undefined;
        },
    };
};
const findModule$1 = (module) => {
    return Object.values(module).find(isModule$1) || module;
};
const isModule$1 = (module) => {
    return isObject$1(module) && module[Symbol.toStringTag] === 'Module';
};
/**
 * Convert relative base URI and relative URL into a fully qualified URL.
 *
 * @param base -`QRL`s are relative, and therefore they need a base for resolution.
 *    - `Element` use `base.ownerDocument.baseURI`
 *    - `Document` use `base.baseURI`
 *    - `string` use `base` as is
 *    - `QConfig` use `base.baseURI`
 * @param url - relative URL
 * @returns fully qualified URL.
 */
const toUrl$1 = (doc, element, url) => {
    const containerEl = getContainer$1(element);
    const base = new URL(containerEl?.getAttribute('q:base') ?? doc.baseURI, doc.baseURI);
    return new URL(url, base);
};
/**
 * @public
 */
const setPlatform = (doc, plt) => (doc[DocumentPlatform$1] = plt);
/**
 * @public
 */
const getPlatform$1 = (docOrNode) => {
    const doc = getDocument$1(docOrNode);
    return doc[DocumentPlatform$1] || (doc[DocumentPlatform$1] = createPlatform$1(doc));
};
const DocumentPlatform$1 = /*#__PURE__*/ Symbol();

const fromCamelToKebabCase = (text) => {
    return text.replace(/([A-Z])/g, '-$1').toLowerCase();
};

const directSetAttribute = (el, prop, value) => {
    return el.setAttribute(prop, value);
};
const directGetAttribute = (el, prop) => {
    return el.getAttribute(prop);
};

const ON_PROP_REGEX = /^(window:|document:|)on([A-Z]|-.).*(Qrl|\$)$/;
const isOnProp = (prop) => {
    return ON_PROP_REGEX.test(prop);
};
const qPropWriteQRL = (rctx, ctx, prop, value) => {
    if (!value) {
        return;
    }
    if (!ctx.$listeners$) {
        ctx.$listeners$ = getDomListeners(ctx.$element$);
    }
    const kebabProp = fromCamelToKebabCase(prop);
    const existingListeners = ctx.$listeners$.get(kebabProp) || [];
    const newQRLs = isArray$1(value) ? value : [value];
    for (const value of newQRLs) {
        const cp = value.copy();
        cp.setContainer(ctx.$element$);
        const capture = cp.$capture$;
        if (capture == null) {
            // we need to serialize the lexical scope references
            const captureRef = cp.$captureRef$;
            cp.$capture$ =
                captureRef && captureRef.length
                    ? captureRef.map((ref) => String(ctx.$refMap$.$add$(ref)))
                    : EMPTY_ARRAY;
        }
        // Important we modify the array as it is cached.
        for (let i = 0; i < existingListeners.length; i++) {
            const qrl = existingListeners[i];
            if (isSameQRL(qrl, cp)) {
                existingListeners.splice(i, 1);
                i--;
            }
        }
        existingListeners.push(cp);
    }
    ctx.$listeners$.set(kebabProp, existingListeners);
    const newValue = serializeQRLs(existingListeners, ctx);
    if (directGetAttribute(ctx.$element$, kebabProp) !== newValue) {
        setAttribute(rctx, ctx.$element$, kebabProp, newValue);
    }
};
const getDomListeners = (el) => {
    const attributes = el.attributes;
    const listeners = new Map();
    for (let i = 0; i < attributes.length; i++) {
        const attr = attributes.item(i);
        if (attr.name.startsWith('on:') ||
            attr.name.startsWith('on-window:') ||
            attr.name.startsWith('on-document:')) {
            let array = listeners.get(attr.name);
            if (!array) {
                listeners.set(attr.name, (array = []));
            }
            array.push(parseQRL(attr.value, el));
        }
    }
    return listeners;
};
const serializeQRLs = (existingQRLs, ctx) => {
    const opts = {
        $platform$: getPlatform$1(ctx.$element$),
        $element$: ctx.$element$,
    };
    return existingQRLs.map((qrl) => stringifyQRL$1(qrl, opts)).join('\n');
};

const WatchFlagsIsEffect = 1 << 0;
const WatchFlagsIsWatch = 1 << 1;
const WatchFlagsIsDirty = 1 << 2;
const WatchFlagsIsCleanup = 1 << 3;
const runWatch = (watch, containerState) => {
    if (!(watch.f & WatchFlagsIsDirty)) {
        logDebug('Watch is not dirty, skipping run', watch);
        return Promise.resolve(watch);
    }
    watch.f &= ~WatchFlagsIsDirty;
    const promise = new Promise((resolve) => {
        then$1(watch.running, () => {
            cleanupWatch(watch);
            const el = watch.el;
            const doc = getDocument$1(el);
            const invokationContext = newInvokeContext$1(doc, el, el, 'WatchEvent');
            const { $subsManager$: subsManager } = containerState;
            const watchFn = watch.qrl.invokeFn(el, invokationContext, () => {
                subsManager.$clearSub$(watch);
            });
            const track = (obj, prop) => {
                const target = getProxyTarget$1(obj);
                assertDefined$1(target, 'Expected a Proxy object to track');
                const manager = subsManager.$getLocal$(target);
                manager.$addSub$(watch, prop);
                if (prop) {
                    return obj[prop];
                }
                else {
                    return obj;
                }
            };
            return then$1(watchFn(track), (returnValue) => {
                if (isFunction$1(returnValue)) {
                    watch.destroy = noSerialize(returnValue);
                }
                resolve(watch);
            });
        });
    });
    watch.running = noSerialize(promise);
    return promise;
};
const cleanupWatch = (watch) => {
    const destroy = watch.destroy;
    if (destroy) {
        watch.destroy = undefined;
        try {
            destroy();
        }
        catch (err) {
            logError$1(err);
        }
    }
};
const destroyWatch = (watch) => {
    if (watch.f & WatchFlagsIsCleanup) {
        watch.f &= ~WatchFlagsIsCleanup;
        const cleanup = watch.qrl.invokeFn(watch.el);
        cleanup();
    }
    else {
        cleanupWatch(watch);
    }
};

const emitEvent = (el, eventName, detail, bubbles) => {
    if (el && typeof CustomEvent === 'function') {
        el.dispatchEvent(new CustomEvent(eventName, {
            detail,
            bubbles: bubbles,
            composed: bubbles,
        }));
    }
};

const UNDEFINED_PREFIX = '\u0010';
const QRL_PREFIX = '\u0011';
const DOCUMENT_PREFIX = '\u0012';
// <docs markdown="../readme.md#pauseContainer">
// !!DO NOT EDIT THIS COMMENT DIRECTLY!!!
// (edit ../readme.md#pauseContainer instead)
/**
 * Serialize the current state of the application into DOM
 *
 * @alpha
 */
// </docs>
const pauseContainer = (elmOrDoc) => {
    const doc = getDocument$1(elmOrDoc);
    const containerEl = isDocument$1(elmOrDoc) ? elmOrDoc.documentElement : elmOrDoc;
    const parentJSON = isDocument$1(elmOrDoc) ? elmOrDoc.body : containerEl;
    const data = snapshotState(containerEl);
    const script = doc.createElement('script');
    directSetAttribute(script, 'type', 'qwik/json');
    script.textContent = escapeText(JSON.stringify(data.state, undefined, '  ' ));
    parentJSON.appendChild(script);
    directSetAttribute(containerEl, QContainerAttr, 'paused');
    return data;
};
const resumeContainer = (containerEl) => {
    if (!isContainer(containerEl)) {
        logWarn$1('Skipping hydration because parent element is not q:container');
        return;
    }
    const doc = getDocument$1(containerEl);
    const isDocElement = containerEl === doc.documentElement;
    const parentJSON = isDocElement ? doc.body : containerEl;
    const script = getQwikJSON(parentJSON);
    if (!script) {
        logWarn$1('Skipping hydration qwik/json metadata was not found.');
        return;
    }
    script.remove();
    const containerState = getContainerState(containerEl);
    const meta = JSON.parse(unescapeText(script.textContent || '{}'));
    // Collect all elements
    const elements = new Map();
    const getObject = (id) => {
        return getObjectImpl(id, elements, meta.objs, containerState);
    };
    getNodesInScope(containerEl, hasQId).forEach((el) => {
        const id = directGetAttribute(el, ELEMENT_ID);
        elements.set(ELEMENT_ID_PREFIX + id, el);
    });
    // Revive proxies with subscriptions into the proxymap
    reviveValues(meta.objs, meta.subs, getObject, containerState, parentJSON);
    // Rebuild target objects
    for (const obj of meta.objs) {
        reviveNestedObjects(obj, getObject);
    }
    Object.entries(meta.ctx).forEach(([elementID, ctxMeta]) => {
        const el = getObject(elementID);
        assertDefined$1(el);
        const ctx = getContext(el);
        const qobj = ctxMeta.r;
        const seq = ctxMeta.s;
        const host = ctxMeta.h;
        const contexts = ctxMeta.c;
        const watches = ctxMeta.w;
        if (qobj) {
            ctx.$refMap$.$array$.push(...qobj.split(' ').map((part) => getObject(part)));
        }
        if (seq) {
            ctx.$seq$ = seq.split(' ').map((part) => getObject(part));
        }
        if (watches) {
            ctx.$watches$ = watches.split(' ').map((part) => getObject(part));
        }
        if (contexts) {
            contexts.split(' ').map((part) => {
                const [key, value] = part.split('=');
                if (!ctx.$contexts$) {
                    ctx.$contexts$ = new Map();
                }
                ctx.$contexts$.set(key, getObject(value));
            });
        }
        // Restore sequence scoping
        if (host) {
            const [props, renderQrl] = host.split(' ');
            assertDefined$1(props);
            assertDefined$1(renderQrl);
            ctx.$props$ = getObject(props);
            ctx.$renderQrl$ = getObject(renderQrl);
        }
    });
    directSetAttribute(containerEl, QContainerAttr, 'resumed');
    logDebug('Container resumed');
    emitEvent(containerEl, 'qresume', undefined, true);
};
const hasContext = (el) => {
    return !!tryGetContext(el);
};
const snapshotState = (containerEl) => {
    const containerState = getContainerState(containerEl);
    const doc = getDocument$1(containerEl);
    const elementToIndex = new Map();
    const collector = createCollector(doc, containerState);
    // Collect all qObjected around the DOM
    const elements = getNodesInScope(containerEl, hasContext);
    elements.forEach((node) => {
        const ctx = tryGetContext(node);
        collectProps(node, ctx.$props$, collector);
        ctx.$contexts$?.forEach((ctx) => {
            collectValue(ctx, collector);
        });
        ctx.$listeners$?.forEach((listeners) => {
            for (const l of listeners) {
                const captured = l.$captureRef$;
                if (captured) {
                    captured.forEach((obj) => collectValue(obj, collector));
                }
            }
        });
        ctx.$watches$.forEach((watch) => {
            collector.$watches$.push(watch);
        });
    });
    // Convert objSet to array
    const objs = Array.from(collector.$objSet$);
    const objToId = new Map();
    const hasSubscriptions = (a) => {
        const flags = getProxyFlags(containerState.$proxyMap$.get(a));
        if (typeof flags === 'number' && flags > 0) {
            return true;
        }
        const manager = containerState.$subsManager$.$tryGetLocal$(a);
        if (manager) {
            return manager.$subs$.size > 0;
        }
        return false;
    };
    const getElementID = (el) => {
        let id = elementToIndex.get(el);
        if (id === undefined) {
            if (el.isConnected) {
                id = intToStr(elementToIndex.size);
                directSetAttribute(el, ELEMENT_ID, id);
                id = ELEMENT_ID_PREFIX + id;
            }
            else {
                id = null;
            }
            elementToIndex.set(el, id);
        }
        return id;
    };
    const getObjId = (obj) => {
        let suffix = '';
        if (isMutable(obj)) {
            obj = obj.v;
            suffix = '%';
        }
        if (isObject$1(obj)) {
            const target = getProxyTarget$1(obj);
            if (target) {
                suffix += '!';
            }
            const id = objToId.get(normalizeObj(target ?? obj, doc));
            if (id !== undefined) {
                return intToStr(id) + suffix;
            }
            if (!target && isNode$1(obj)) {
                if (obj.nodeType === 1) {
                    return getElementID(obj) + suffix;
                }
                else {
                    logError$1(codeToText$1(QError_cannotSerializeNode), obj);
                    return null;
                }
            }
        }
        else {
            const id = objToId.get(normalizeObj(obj, doc));
            if (id !== undefined) {
                return intToStr(id) + suffix;
            }
        }
        return null;
    };
    const mustGetObjId = (obj) => {
        const id = getObjId(obj);
        assertDefined$1(id);
        return id;
    };
    const serialize = (value) => {
        return getObjId(value) ?? value;
    };
    let count = 0;
    objs.sort((a, b) => {
        const isProxyA = hasSubscriptions(a) ? 0 : 1;
        const isProxyB = hasSubscriptions(b) ? 0 : 1;
        return isProxyA - isProxyB;
    });
    for (const obj of objs) {
        objToId.set(obj, count);
        count++;
    }
    const subs = objs
        .map((obj) => {
        const flags = getProxyFlags(containerState.$proxyMap$.get(obj));
        if (flags === undefined) {
            return null;
        }
        const subs = containerState.$subsManager$.$tryGetLocal$(obj)?.$subs$;
        if ((subs && subs.size > 0) || flags !== 0) {
            const subsObj = {};
            if (flags > 0) {
                subsObj['$'] = flags;
            }
            subs &&
                subs.forEach((set, key) => {
                    const id = getObjId(key);
                    if (id !== null) {
                        subsObj[id] = set ? Array.from(set) : null;
                    }
                });
            return subsObj;
        }
        else {
            return null;
        }
    })
        .filter(isNotNullable);
    const qrlSerializeOptions = {
        $platform$: containerState.$platform$,
        $getObjId$: getObjId,
    };
    const convertedObjs = objs.map((obj) => {
        if (isObject$1(obj)) {
            if (isArray$1(obj)) {
                return obj.map(serialize);
            }
            if (isQrl$1(obj)) {
                return QRL_PREFIX + stringifyQRL$1(obj, qrlSerializeOptions);
            }
            const output = {};
            Object.entries(obj).forEach(([key, value]) => {
                output[key] = serialize(value);
            });
            return output;
        }
        return obj;
    });
    const listeners = [];
    const meta = {};
    // Write back to the dom
    elements.forEach((node) => {
        const ctx = getContext(node);
        assertDefined$1(ctx);
        const ref = ctx.$refMap$;
        const props = ctx.$props$;
        const contexts = ctx.$contexts$;
        const watches = ctx.$watches$;
        const renderQrl = ctx.$renderQrl$;
        const seq = ctx.$seq$;
        const metaValue = {};
        const elementCaptured = collector.$elements$.includes(node);
        let add = false;
        if (ref.$array$.length > 0) {
            const value = ref.$array$.map((obj) => mustGetObjId(obj)).join(' ');
            if (value) {
                metaValue.r = value;
                add = true;
            }
        }
        if (elementCaptured && props) {
            const objs = [props];
            if (renderQrl) {
                objs.push(renderQrl);
            }
            const value = objs.map((obj) => mustGetObjId(obj)).join(' ');
            if (value) {
                metaValue.h = value;
                add = true;
            }
        }
        if (watches.length > 0) {
            const value = watches
                .map((watch) => getObjId(watch))
                .filter(isNotNullable)
                .join(' ');
            if (value) {
                metaValue.w = value;
                add = true;
            }
        }
        if (elementCaptured && seq.length > 0) {
            const value = seq.map((obj) => mustGetObjId(obj)).join(' ');
            if (value) {
                metaValue.s = value;
                add = true;
            }
        }
        if (contexts) {
            const serializedContexts = [];
            contexts.forEach((value, key) => {
                serializedContexts.push(`${key}=${mustGetObjId(value)}`);
            });
            const value = serializedContexts.join(' ');
            if (value) {
                metaValue.c = value;
                add = true;
            }
        }
        if (add) {
            const elementID = getElementID(node);
            assertDefined$1(elementID);
            meta[elementID] = metaValue;
        }
        if (ctx.$listeners$) {
            ctx.$listeners$.forEach((qrls, key) => {
                qrls.forEach((qrl) => {
                    listeners.push({
                        key,
                        qrl,
                    });
                });
            });
        }
    });
    for (const watch of collector.$watches$) {
        destroyWatch(watch);
        {
            if (watch.f & WatchFlagsIsDirty) {
                logWarn$1('Serializing dirty watch. Looks like an internal error.');
            }
            if (!isConnected(watch)) {
                logWarn$1('Serializing disconneted watch. Looks like an internal error.');
            }
        }
    }
    // Sanity check of serialized element
    {
        elementToIndex.forEach((value, el) => {
            if (getDocument$1(el) !== doc) {
                logWarn$1('element from different document', value, el.tagName);
            }
            if (!value) {
                logWarn$1('unconnected element', el.tagName, '\n');
            }
        });
    }
    return {
        state: {
            ctx: meta,
            objs: convertedObjs,
            subs,
        },
        objs,
        listeners,
    };
};
const getQwikJSON = (parentElm) => {
    let child = parentElm.lastElementChild;
    while (child) {
        if (child.tagName === 'SCRIPT' && directGetAttribute(child, 'type') === 'qwik/json') {
            return child;
        }
        child = child.previousElementSibling;
    }
    return undefined;
};
const getNodesInScope = (parent, predicate) => {
    const nodes = [];
    walkNodes(nodes, parent, predicate);
    return nodes;
};
const walkNodes = (nodes, parent, predicate) => {
    let child = parent.firstElementChild;
    while (child) {
        if (!isContainer(child)) {
            if (predicate(child)) {
                nodes.push(child);
            }
            walkNodes(nodes, child, predicate);
        }
        child = child.nextElementSibling;
    }
};
const reviveValues = (objs, subs, getObject, containerState, containerEl) => {
    for (let i = 0; i < objs.length; i++) {
        const value = objs[i];
        if (isString(value)) {
            if (value === UNDEFINED_PREFIX) {
                objs[i] = undefined;
            }
            else if (value === DOCUMENT_PREFIX) {
                objs[i] = getDocument$1(containerEl);
            }
            else if (value.startsWith(QRL_PREFIX)) {
                objs[i] = parseQRL(value.slice(1), containerEl);
            }
        }
        else {
            const sub = subs[i];
            if (sub) {
                const converted = new Map();
                let flags = 0;
                Object.entries(sub).forEach((entry) => {
                    if (entry[0] === '$') {
                        flags = entry[1];
                        return;
                    }
                    const el = getObject(entry[0]);
                    if (!el) {
                        logWarn$1('QWIK can not revive subscriptions because of missing element ID', entry, value);
                        return;
                    }
                    const set = entry[1] === null ? null : new Set(entry[1]);
                    converted.set(el, set);
                });
                createProxy(value, containerState, flags, converted);
            }
        }
    }
};
const reviveNestedObjects = (obj, getObject) => {
    if (obj && typeof obj == 'object') {
        if (isQrl$1(obj)) {
            if (obj.$capture$ && obj.$capture$.length > 0) {
                obj.$captureRef$ = obj.$capture$.map(getObject);
                obj.$capture$ = null;
            }
            return;
        }
        else if (isArray$1(obj)) {
            for (let i = 0; i < obj.length; i++) {
                const value = obj[i];
                if (typeof value == 'string') {
                    obj[i] = getObject(value);
                }
                else {
                    reviveNestedObjects(value, getObject);
                }
            }
        }
        else if (Object.getPrototypeOf(obj) === Object.prototype) {
            for (const key in obj) {
                if (Object.prototype.hasOwnProperty.call(obj, key)) {
                    const value = obj[key];
                    if (typeof value == 'string') {
                        obj[key] = getObject(value);
                    }
                    else {
                        reviveNestedObjects(value, getObject);
                    }
                }
            }
        }
    }
};
const getObjectImpl = (id, elements, objs, containerState) => {
    if (id.startsWith(ELEMENT_ID_PREFIX)) {
        assertEqual(elements.has(id), true);
        return elements.get(id);
    }
    const index = strToInt(id);
    assertEqual(objs.length > index, true);
    let obj = objs[index];
    const needsProxy = id.endsWith('!');
    if (needsProxy && containerState) {
        id = id.slice(0, -1);
        obj = containerState.$proxyMap$.get(obj) ?? getOrCreateProxy(obj, containerState);
    }
    if (id.endsWith('%')) {
        obj = mutable(obj);
    }
    return obj;
};
const normalizeObj = (obj, doc) => {
    if (obj === doc) {
        return DOCUMENT_PREFIX;
    }
    if (obj === undefined || !shouldSerialize$1(obj)) {
        return UNDEFINED_PREFIX;
    }
    return getProxyTarget$1(obj) ?? obj;
};
const collectValue = (obj, collector) => {
    const handled = collectQObjects(obj, collector);
    if (!handled) {
        collector.$objSet$.add(normalizeObj(obj, collector.$doc$));
    }
};
const collectProps = (el, props, collector) => {
    const subs = collector.$containerState$.$subsManager$.$tryGetLocal$(getProxyTarget$1(props))?.$subs$;
    if (subs && subs.has(el)) {
        // The host element read the props
        collectElement(el, collector);
    }
};
const createCollector = (doc, containerState) => {
    return {
        $seen$: new Set(),
        $objSet$: new Set(),
        $elements$: [],
        $watches$: [],
        $containerState$: containerState,
        $doc$: doc,
    };
};
const collectQrl = (obj, collector) => {
    if (collector.$seen$.has(obj)) {
        return true;
    }
    collector.$seen$.add(obj);
    collector.$objSet$.add(normalizeObj(obj, collector.$doc$));
    if (obj.$captureRef$) {
        obj.$captureRef$.forEach((obj) => collectValue(obj, collector));
    }
};
const collectElement = (el, collector) => {
    if (collector.$seen$.has(el)) {
        return;
    }
    collector.$seen$.add(el);
    const ctx = tryGetContext(el);
    if (ctx) {
        collector.$elements$.push(el);
        if (ctx.$props$) {
            collectValue(ctx.$props$, collector);
        }
        if (ctx.$renderQrl$) {
            collectValue(ctx.$renderQrl$, collector);
        }
        ctx.$seq$.forEach((obj) => {
            collectValue(obj, collector);
        });
        ctx.$refMap$.$array$.forEach((obj) => {
            collectValue(obj, collector);
        });
        ctx.$watches$.forEach((watch) => {
            collectValue(watch, collector);
        });
        if (ctx.$contexts$) {
            ctx.$contexts$.forEach((obj) => {
                collectValue(obj, collector);
            });
        }
    }
};
const escapeText = (str) => {
    return str.replace(/<(\/?script)/g, '\\x3C$1');
};
const unescapeText = (str) => {
    return str.replace(/\\x3C(\/?script)/g, '<$1');
};
const collectSubscriptions = (subs, collector) => {
    if (collector.$seen$.has(subs)) {
        return;
    }
    collector.$seen$.add(subs);
    Array.from(subs.keys()).forEach((key) => {
        if (isElement$1(key)) {
            collectElement(key, collector);
        }
        else {
            collectValue(key, collector);
        }
    });
};
const collectQObjects = (obj, collector) => {
    if (obj != null) {
        if (typeof obj === 'object') {
            const target = getProxyTarget$1(obj);
            if (!target && isNode$1(obj)) {
                if (obj.nodeType === 1) {
                    return true;
                }
                return false;
            }
            if (isQrl$1(obj)) {
                collectQrl(obj, collector);
                return true;
            }
            const subs = collector.$containerState$.$subsManager$.$tryGetLocal$(target)?.$subs$;
            if (subs) {
                collectSubscriptions(subs, collector);
            }
            obj = normalizeObj(obj, collector.$doc$);
        }
        if (typeof obj === 'object') {
            if (collector.$seen$.has(obj)) {
                return true;
            }
            collector.$seen$.add(obj);
            collector.$objSet$.add(obj);
            if (isArray$1(obj)) {
                for (let i = 0; i < obj.length; i++) {
                    collectQObjects(obj[i], collector);
                }
            }
            else {
                for (const key in obj) {
                    if (Object.prototype.hasOwnProperty.call(obj, key)) {
                        collectQObjects(obj[key], collector);
                    }
                }
            }
            return true;
        }
        if (isString(obj)) {
            collector.$objSet$.add(obj);
            return true;
        }
    }
    return false;
};
const isContainer = (el) => {
    return el.hasAttribute(QContainerAttr);
};
const hasQId = (el) => {
    return el.hasAttribute(ELEMENT_ID);
};
const intToStr = (nu) => {
    return nu.toString(36);
};
const strToInt = (nu) => {
    return parseInt(nu, 36);
};

const newQObjectMap = () => {
    const array = [];
    return {
        $array$: array,
        $get$(index) {
            return array[index];
        },
        $indexOf$(obj) {
            const index = array.indexOf(obj);
            return index === -1 ? undefined : index;
        },
        $add$(object) {
            const index = array.indexOf(object);
            if (index === -1) {
                array.push(object);
                return array.length - 1;
            }
            return index;
        },
    };
};

const Q_CTX = '__ctx__';
const resumeIfNeeded = (containerEl) => {
    const isResumed = directGetAttribute(containerEl, QContainerAttr);
    if (isResumed === 'paused') {
        resumeContainer(containerEl);
        {
            appendQwikDevTools(containerEl);
        }
    }
};
const appendQwikDevTools = (containerEl) => {
    containerEl['qwik'] = {
        pause: () => pauseContainer(containerEl),
        state: getContainerState(containerEl),
    };
};
const tryGetContext = (element) => {
    return element[Q_CTX];
};
const getContext = (element) => {
    let ctx = tryGetContext(element);
    if (!ctx) {
        const cache = new Map();
        element[Q_CTX] = ctx = {
            $element$: element,
            $cache$: cache,
            $refMap$: newQObjectMap(),
            $dirty$: false,
            $seq$: [],
            $watches$: [],
            $props$: undefined,
            $renderQrl$: undefined,
            $component$: undefined,
        };
    }
    return ctx;
};
const cleanupContext = (ctx, subsManager) => {
    const el = ctx.$element$;
    ctx.$watches$.forEach((watch) => {
        subsManager.$clearSub$(watch);
        destroyWatch(watch);
    });
    if (ctx.$renderQrl$) {
        subsManager.$clearSub$(el);
    }
    ctx.$component$ = undefined;
    ctx.$renderQrl$ = undefined;
    ctx.$seq$.length = 0;
    ctx.$watches$.length = 0;
    ctx.$cache$.clear();
    ctx.$dirty$ = false;
    ctx.$refMap$.$array$.length = 0;
    el[Q_CTX] = undefined;
};
const PREFIXES = ['document:on', 'window:on', 'on'];
const SCOPED = ['on-document', 'on-window', 'on'];
const normalizeOnProp = (prop) => {
    let scope = 'on';
    for (let i = 0; i < PREFIXES.length; i++) {
        const prefix = PREFIXES[i];
        if (prop.startsWith(prefix)) {
            scope = SCOPED[i];
            prop = prop.slice(prefix.length);
        }
    }
    if (prop.startsWith('-')) {
        prop = prop.slice(1);
    }
    else {
        prop = prop.toLowerCase();
    }
    return `${scope}:${prop}`;
};
const setEvent = (rctx, ctx, prop, value) => {
    const dollar = prop.endsWith('$');
    qPropWriteQRL(rctx, ctx, normalizeOnProp(prop.slice(0, dollar ? -1 : -3)), dollar ? $(value) : value);
};
const createProps = (target, containerState) => {
    return createProxy(target, containerState, QObjectImmutable);
};
const getPropsMutator = (ctx, containerState) => {
    let props = ctx.$props$;
    if (!ctx.$props$) {
        ctx.$props$ = props = createProps({}, containerState);
    }
    const target = getProxyTarget$1(props);
    assertDefined$1(target);
    const manager = containerState.$subsManager$.$getLocal$(target);
    return {
        set(prop, value) {
            const didSet = prop in target;
            let oldValue = target[prop];
            let mut = false;
            if (isMutable(oldValue)) {
                oldValue = oldValue.v;
            }
            target[prop] = value;
            if (isMutable(value)) {
                value = value.v;
                mut = true;
            }
            if (oldValue !== value) {
                {
                    if (didSet && !mut && !isQrl$1(value)) {
                        const displayName = ctx.$renderQrl$?.getSymbol() ?? ctx.$element$.localName;
                        logError$1(codeToText$1(QError_immutableJsxProps), `If you need to change a value of a passed in prop, please wrap the prop with "mutable()" <${displayName} ${prop}={mutable(...)}>`, '\n - Component:', displayName, '\n - Prop:', prop, '\n - Old value:', oldValue, '\n - New value:', value);
                    }
                }
                manager.$notifySubs$(prop);
            }
        },
    };
};

/**
 * Place at the root of the component View to allow binding of attributes on the Host element.
 *
 * ```
 * <Host someAttr={someExpr} someAttrStatic="value">
 *   View content implementation.
 * </Host>
 * ```
 *
 * Qwik requires that components have [docs/HOST_ELEMENTS.ts] so that it is possible to have
 * asynchronous loading point. Host element is not owned by the component. At times it is
 * desirable for the component to render additional attributes on the host element. `<Host>`
 * servers that purpose.
 * @public
 */
const Host = { __brand__: 'host' };
/**
 * @public
 */
const SkipRerender = { __brand__: 'skip' };

/**
 * @public
 */
const jsx = (type, props, key) => {
    return new JSXNodeImpl(type, props, key);
};
const HOST_TYPE = ':host';
const SKIP_RENDER_TYPE = ':skipRender';
class JSXNodeImpl {
    constructor(type, props, key = null) {
        this.type = type;
        this.props = props;
        this.key = key;
    }
}
class ProcessedJSXNodeImpl {
    constructor($type$, $props$, $children$, $key$) {
        this.$type$ = $type$;
        this.$props$ = $props$;
        this.$children$ = $children$;
        this.$key$ = $key$;
        this.$elm$ = null;
        this.$text$ = '';
    }
}
const processNode = (node, invocationContext) => {
    const key = node.key != null ? String(node.key) : null;
    let textType = '';
    if (node.type === Host) {
        textType = HOST_TYPE;
    }
    else if (node.type === SkipRerender) {
        textType = SKIP_RENDER_TYPE;
    }
    else if (isFunction$1(node.type)) {
        const res = invocationContext
            ? useInvoke$1(invocationContext, () => node.type(node.props, node.key))
            : node.type(node.props, node.key);
        return processData(res, invocationContext);
    }
    else if (isString(node.type)) {
        textType = node.type;
    }
    let children = EMPTY_ARRAY;
    if (node.props) {
        const mightPromise = processData(node.props.children, invocationContext);
        return then$1(mightPromise, (result) => {
            if (result !== undefined) {
                if (isArray$1(result)) {
                    children = result;
                }
                else {
                    children = [result];
                }
            }
            return new ProcessedJSXNodeImpl(textType, node.props, children, key);
        });
    }
    return new ProcessedJSXNodeImpl(textType, node.props, children, key);
};
const processData = (node, invocationContext) => {
    if (node == null || typeof node === 'boolean') {
        return undefined;
    }
    if (isJSXNode(node)) {
        return processNode(node, invocationContext);
    }
    else if (isPromise$1(node)) {
        return node.then((node) => processData(node, invocationContext));
    }
    else if (isArray$1(node)) {
        const output = promiseAll(node.flatMap((n) => processData(n, invocationContext)));
        return then$1(output, (array) => array.flat(100).filter(isNotNullable));
    }
    else if (isString(node) || typeof node === 'number') {
        const newNode = new ProcessedJSXNodeImpl('#text', null, EMPTY_ARRAY, null);
        newNode.$text$ = String(node);
        return newNode;
    }
    else {
        logWarn$1('Unvalid node, skipping');
        return undefined;
    }
};
const isJSXNode = (n) => {
    {
        if (n instanceof JSXNodeImpl) {
            return true;
        }
        if (isObject$1(n) && n.constructor.name === JSXNodeImpl.name) {
            throw new Error(`Duplicate implementations of "JSXNodeImpl" found`);
        }
        return false;
    }
};

const visitJsxNode = (ctx, elm, jsxNode, isSvg) => {
    if (jsxNode === undefined) {
        return smartUpdateChildren(ctx, elm, [], 'root', isSvg);
    }
    if (isArray$1(jsxNode)) {
        return smartUpdateChildren(ctx, elm, jsxNode.flat(), 'root', isSvg);
    }
    else if (jsxNode.$type$ === HOST_TYPE) {
        updateProperties(ctx, getContext(elm), jsxNode.$props$, isSvg);
        return smartUpdateChildren(ctx, elm, jsxNode.$children$ || [], 'root', isSvg);
    }
    else {
        return smartUpdateChildren(ctx, elm, [jsxNode], 'root', isSvg);
    }
};
/**
 * @public
 */
const styleHost = (styleId) => {
    return ComponentStylesPrefixHost + styleId;
};
/**
 * @public
 */
const styleContent = (styleId) => {
    return ComponentStylesPrefixContent + styleId;
};

const firstRenderComponent = (rctx, ctx) => {
    directSetAttribute(ctx.$element$, QHostAttr, '');
    return renderComponent(rctx, ctx);
};
const renderComponent = (rctx, ctx) => {
    ctx.$dirty$ = false;
    const hostElement = ctx.$element$;
    const onRenderQRL = ctx.$renderQrl$;
    assertDefined$1(onRenderQRL);
    const props = ctx.$props$;
    assertDefined$1(props);
    // Component is not dirty any more
    rctx.$containerState$.$hostsStaging$.delete(hostElement);
    const newCtx = copyRenderContext(rctx);
    // Invoke render hook
    const invocatinContext = newInvokeContext$1(rctx.$doc$, hostElement, hostElement, RenderEvent);
    invocatinContext.$subscriber$ = hostElement;
    invocatinContext.$renderCtx$ = newCtx;
    const waitOn = (invocatinContext.$waitOn$ = []);
    // Clean current subscription before render
    rctx.$containerState$.$subsManager$.$clearSub$(hostElement);
    // Resolve render function
    const onRenderFn = onRenderQRL.invokeFn(rctx.$containerEl$, invocatinContext);
    try {
        // Execution of the render function
        const renderPromise = onRenderFn(props);
        // Wait for results
        return then$1(renderPromise, (jsxNode) => {
            rctx.$hostElements$.add(hostElement);
            const waitOnPromise = promiseAll(waitOn);
            return then$1(waitOnPromise, () => {
                if (isFunction$1(jsxNode)) {
                    ctx.$dirty$ = false;
                    jsxNode = jsxNode();
                }
                else if (ctx.$dirty$) {
                    logDebug('Dropping render. State changed during render.');
                    return renderComponent(rctx, ctx);
                }
                let componentCtx = ctx.$component$;
                if (!componentCtx) {
                    componentCtx = ctx.$component$ = {
                        $hostElement$: hostElement,
                        $slots$: [],
                        $styleHostClass$: undefined,
                        $styleClass$: undefined,
                        $styleId$: undefined,
                    };
                    const scopedStyleId = directGetAttribute(hostElement, ComponentScopedStyles) ?? undefined;
                    if (scopedStyleId) {
                        componentCtx.$styleId$ = scopedStyleId;
                        componentCtx.$styleHostClass$ = styleHost(scopedStyleId);
                        componentCtx.$styleClass$ = styleContent(scopedStyleId);
                        hostElement.classList.add(componentCtx.$styleHostClass$);
                    }
                }
                componentCtx.$slots$ = [];
                newCtx.$contexts$.push(ctx);
                newCtx.$currentComponent$ = componentCtx;
                const invocatinContext = newInvokeContext$1(rctx.$doc$, hostElement, hostElement);
                invocatinContext.$subscriber$ = hostElement;
                invocatinContext.$renderCtx$ = newCtx;
                const processedJSXNode = processData(jsxNode, invocatinContext);
                return then$1(processedJSXNode, (processedJSXNode) => {
                    return visitJsxNode(newCtx, hostElement, processedJSXNode, false);
                });
            });
        }, (err) => {
            logError$1(err);
        });
    }
    catch (err) {
        logError$1(err);
    }
};

const SVG_NS = 'http://www.w3.org/2000/svg';
const smartUpdateChildren = (ctx, elm, ch, mode, isSvg) => {
    if (ch.length === 1 && ch[0].$type$ === SKIP_RENDER_TYPE) {
        if (elm.firstChild !== null) {
            return;
        }
        ch = ch[0].$children$;
    }
    const oldCh = getChildren(elm, mode);
    if (oldCh.length > 0 && ch.length > 0) {
        return updateChildren(ctx, elm, oldCh, ch, isSvg);
    }
    else if (ch.length > 0) {
        return addVnodes(ctx, elm, null, ch, 0, ch.length - 1, isSvg);
    }
    else if (oldCh.length > 0) {
        return removeVnodes(ctx, oldCh, 0, oldCh.length - 1);
    }
};
const updateChildren = (ctx, parentElm, oldCh, newCh, isSvg) => {
    let oldStartIdx = 0;
    let newStartIdx = 0;
    let oldEndIdx = oldCh.length - 1;
    let oldStartVnode = oldCh[0];
    let oldEndVnode = oldCh[oldEndIdx];
    let newEndIdx = newCh.length - 1;
    let newStartVnode = newCh[0];
    let newEndVnode = newCh[newEndIdx];
    let oldKeyToIdx;
    let idxInOld;
    let elmToMove;
    const results = [];
    while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
        if (oldStartVnode == null) {
            oldStartVnode = oldCh[++oldStartIdx]; // Vnode might have been moved left
        }
        else if (oldEndVnode == null) {
            oldEndVnode = oldCh[--oldEndIdx];
        }
        else if (newStartVnode == null) {
            newStartVnode = newCh[++newStartIdx];
        }
        else if (newEndVnode == null) {
            newEndVnode = newCh[--newEndIdx];
        }
        else if (sameVnode(oldStartVnode, newStartVnode)) {
            results.push(patchVnode(ctx, oldStartVnode, newStartVnode, isSvg));
            oldStartVnode = oldCh[++oldStartIdx];
            newStartVnode = newCh[++newStartIdx];
        }
        else if (sameVnode(oldEndVnode, newEndVnode)) {
            results.push(patchVnode(ctx, oldEndVnode, newEndVnode, isSvg));
            oldEndVnode = oldCh[--oldEndIdx];
            newEndVnode = newCh[--newEndIdx];
        }
        else if (sameVnode(oldStartVnode, newEndVnode)) {
            // Vnode moved right
            results.push(patchVnode(ctx, oldStartVnode, newEndVnode, isSvg));
            insertBefore(ctx, parentElm, oldStartVnode, oldEndVnode.nextSibling);
            oldStartVnode = oldCh[++oldStartIdx];
            newEndVnode = newCh[--newEndIdx];
        }
        else if (sameVnode(oldEndVnode, newStartVnode)) {
            // Vnode moved left
            results.push(patchVnode(ctx, oldEndVnode, newStartVnode, isSvg));
            insertBefore(ctx, parentElm, oldEndVnode, oldStartVnode);
            oldEndVnode = oldCh[--oldEndIdx];
            newStartVnode = newCh[++newStartIdx];
        }
        else {
            if (oldKeyToIdx === undefined) {
                oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx);
            }
            idxInOld = oldKeyToIdx[newStartVnode.$key$];
            if (idxInOld === undefined) {
                // New element
                const newElm = createElm(ctx, newStartVnode, isSvg);
                results.push(then$1(newElm, (newElm) => {
                    insertBefore(ctx, parentElm, newElm, oldStartVnode);
                }));
            }
            else {
                elmToMove = oldCh[idxInOld];
                if (!isTagName(elmToMove, newStartVnode.$type$)) {
                    const newElm = createElm(ctx, newStartVnode, isSvg);
                    results.push(then$1(newElm, (newElm) => {
                        insertBefore(ctx, parentElm, newElm, oldStartVnode);
                    }));
                }
                else {
                    results.push(patchVnode(ctx, elmToMove, newStartVnode, isSvg));
                    oldCh[idxInOld] = undefined;
                    insertBefore(ctx, parentElm, elmToMove, oldStartVnode);
                }
            }
            newStartVnode = newCh[++newStartIdx];
        }
    }
    if (newStartIdx <= newEndIdx) {
        const before = newCh[newEndIdx + 1] == null ? null : newCh[newEndIdx + 1].$elm$;
        results.push(addVnodes(ctx, parentElm, before, newCh, newStartIdx, newEndIdx, isSvg));
    }
    let wait = promiseAll(results);
    if (oldStartIdx <= oldEndIdx) {
        const canRemove = parentElm.nodeName !== 'HEAD';
        if (canRemove) {
            wait = then$1(wait, () => {
                removeVnodes(ctx, oldCh, oldStartIdx, oldEndIdx);
            });
        }
    }
    return wait;
};
const isComponentNode = (node) => {
    return node.$props$ && OnRenderProp in node.$props$;
};
const getCh = (elm, filter) => {
    return Array.from(elm.childNodes).filter(filter);
};
const getChildren = (elm, mode) => {
    switch (mode) {
        case 'default':
            return getCh(elm, isNode$2);
        case 'slot':
            return getCh(elm, isChildSlot);
        case 'root':
            return getCh(elm, isChildComponent);
        case 'fallback':
            return getCh(elm, isFallback);
    }
};
const isNode$2 = (elm) => {
    const type = elm.nodeType;
    return type === 1 || type === 3;
};
const isFallback = (node) => {
    return node.nodeName === 'Q:FALLBACK';
};
const isChildSlot = (node) => {
    return isNode$2(node) && node.nodeName !== 'Q:FALLBACK' && node.nodeName !== 'Q:TEMPLATE';
};
const isSlotTemplate = (node) => {
    return node.nodeName === 'Q:TEMPLATE';
};
const isChildComponent = (node) => {
    return isNode$2(node) && node.nodeName !== 'Q:TEMPLATE';
};
const splitBy = (input, condition) => {
    const output = {};
    for (const item of input) {
        const key = condition(item);
        const array = output[key] ?? (output[key] = []);
        array.push(item);
    }
    return output;
};
const patchVnode = (rctx, elm, vnode, isSvg) => {
    vnode.$elm$ = elm;
    const tag = vnode.$type$;
    if (tag === '#text') {
        if (elm.data !== vnode.$text$) {
            setProperty(rctx, elm, 'data', vnode.$text$);
        }
        return;
    }
    if (tag === '#comment') {
        if (elm.data !== vnode.$text$) {
            setProperty(rctx, elm, 'data', vnode.$text$);
        }
        return;
    }
    if (tag === HOST_TYPE) {
        throw qError$1(QError_hostCanOnlyBeAtRoot);
    }
    if (tag === SKIP_RENDER_TYPE) {
        return;
    }
    if (!isSvg) {
        isSvg = tag === 'svg';
    }
    let promise;
    const props = vnode.$props$;
    const ctx = getContext(elm);
    const dirty = updateProperties(rctx, ctx, props, isSvg);
    const isSlot = tag === 'q:slot';
    if (isSvg && vnode.$type$ === 'foreignObject') {
        isSvg = false;
    }
    else if (isSlot) {
        const currentComponent = rctx.$currentComponent$;
        if (currentComponent) {
            currentComponent.$slots$.push(vnode);
        }
    }
    const isComponent = isComponentNode(vnode);
    if (dirty) {
        assertEqual(isComponent, true);
        promise = renderComponent(rctx, ctx);
    }
    const ch = vnode.$children$;
    if (isComponent) {
        return then$1(promise, () => {
            const slotMaps = getSlots(ctx.$component$, elm);
            const splittedChidren = splitBy(ch, getSlotName);
            const promises = [];
            const slotRctx = copyRenderContext(rctx);
            slotRctx.$contexts$.push(ctx);
            // Mark empty slots and remove content
            Object.entries(slotMaps.slots).forEach(([key, slotEl]) => {
                if (slotEl && !splittedChidren[key]) {
                    const oldCh = getChildren(slotEl, 'slot');
                    if (oldCh.length > 0) {
                        removeVnodes(slotRctx, oldCh, 0, oldCh.length - 1);
                    }
                }
            });
            // Mark empty slots and remove content
            Object.entries(slotMaps.templates).forEach(([key, templateEl]) => {
                if (templateEl && !splittedChidren[key]) {
                    removeNode(slotRctx, templateEl);
                    slotMaps.templates[key] = undefined;
                }
            });
            // Render into slots
            Object.entries(splittedChidren).forEach(([key, ch]) => {
                const slotElm = getSlotElement(slotRctx, slotMaps, elm, key);
                promises.push(smartUpdateChildren(slotRctx, slotElm, ch, 'slot', isSvg));
            });
            return then$1(promiseAll(promises), () => {
                removeTemplates(slotRctx, slotMaps);
            });
        });
    }
    const setsInnerHTML = checkInnerHTML(props);
    if (setsInnerHTML) {
        if (ch.length > 0) {
            logWarn$1('Node can not have children when innerHTML is set');
        }
        return;
    }
    return then$1(promise, () => {
        const mode = isSlot ? 'fallback' : 'default';
        return smartUpdateChildren(rctx, elm, ch, mode, isSvg);
    });
};
const addVnodes = (ctx, parentElm, before, vnodes, startIdx, endIdx, isSvg) => {
    const promises = [];
    for (; startIdx <= endIdx; ++startIdx) {
        const ch = vnodes[startIdx];
        assertDefined$1(ch);
        promises.push(createElm(ctx, ch, isSvg));
    }
    return then$1(promiseAll(promises), (children) => {
        for (const child of children) {
            insertBefore(ctx, parentElm, child, before);
        }
    });
};
const removeVnodes = (ctx, nodes, startIdx, endIdx) => {
    for (; startIdx <= endIdx; ++startIdx) {
        const ch = nodes[startIdx];
        if (ch) {
            removeNode(ctx, ch);
        }
    }
};
let refCount = 0;
const RefSymbol = Symbol();
const setSlotRef = (ctx, hostElm, slotEl) => {
    let ref = hostElm[RefSymbol] ?? directGetAttribute(hostElm, 'q:sref');
    if (ref === null) {
        ref = intToStr(refCount++);
        hostElm[RefSymbol] = ref;
        setAttribute(ctx, hostElm, 'q:sref', ref);
    }
    directSetAttribute(slotEl, 'q:sref', ref);
};
const getSlotElement = (ctx, slotMaps, parentEl, slotName) => {
    const slotEl = slotMaps.slots[slotName];
    if (slotEl) {
        return slotEl;
    }
    const templateEl = slotMaps.templates[slotName];
    if (templateEl) {
        return templateEl;
    }
    const template = createTemplate(ctx, slotName);
    prepend(ctx, parentEl, template);
    slotMaps.templates[slotName] = template;
    return template;
};
const createTemplate = (ctx, slotName) => {
    const template = createElement(ctx, 'q:template', false);
    directSetAttribute(template, QSlotAttr, slotName);
    directSetAttribute(template, 'hidden', '');
    directSetAttribute(template, 'aria-hidden', 'true');
    return template;
};
const removeTemplates = (ctx, slotMaps) => {
    Object.keys(slotMaps.templates).forEach((key) => {
        const template = slotMaps.templates[key];
        if (template && slotMaps.slots[key] !== undefined) {
            removeNode(ctx, template);
            slotMaps.templates[key] = undefined;
        }
    });
};
const resolveSlotProjection = (ctx, hostElm, before, after) => {
    Object.entries(before.slots).forEach(([key, slotEl]) => {
        if (slotEl && !after.slots[key]) {
            // Slot removed
            // Move slot to template
            const template = createTemplate(ctx, key);
            const slotChildren = getChildren(slotEl, 'slot');
            template.append(...slotChildren);
            hostElm.insertBefore(template, hostElm.firstChild);
            ctx.$operations$.push({
                $el$: template,
                $operation$: 'slot-to-template',
                $args$: slotChildren,
                $fn$: () => { },
            });
        }
    });
    Object.entries(after.slots).forEach(([key, slotEl]) => {
        if (slotEl && !before.slots[key]) {
            // Slot created
            // Move template to slot
            const template = before.templates[key];
            if (template) {
                slotEl.append(...getChildren(template, 'default'));
                template.remove();
                ctx.$operations$.push({
                    $el$: slotEl,
                    $operation$: 'template-to-slot',
                    $args$: [template],
                    $fn$: () => { },
                });
            }
        }
    });
};
const getSlotName = (node) => {
    return node.$props$?.['q:slot'] ?? '';
};
const createElm = (rctx, vnode, isSvg) => {
    rctx.$perf$.$visited$++;
    const tag = vnode.$type$;
    if (tag === '#text') {
        return (vnode.$elm$ = createTextNode(rctx, vnode.$text$));
    }
    if (tag === HOST_TYPE) {
        throw qError$1(QError_hostCanOnlyBeAtRoot);
    }
    if (!isSvg) {
        isSvg = tag === 'svg';
    }
    const props = vnode.$props$;
    const elm = (vnode.$elm$ = createElement(rctx, tag, isSvg));
    const isComponent = isComponentNode(vnode);
    const ctx = getContext(elm);
    setKey(elm, vnode.$key$);
    updateProperties(rctx, ctx, props, isSvg);
    if (isSvg && tag === 'foreignObject') {
        isSvg = false;
    }
    const currentComponent = rctx.$currentComponent$;
    if (currentComponent) {
        const styleTag = currentComponent.$styleClass$;
        if (styleTag) {
            classlistAdd(rctx, elm, styleTag);
        }
        if (tag === 'q:slot') {
            setSlotRef(rctx, currentComponent.$hostElement$, elm);
            currentComponent.$slots$.push(vnode);
        }
    }
    let wait;
    if (isComponent) {
        // Run mount hook
        const renderQRL = props[OnRenderProp];
        ctx.$renderQrl$ = renderQRL;
        wait = firstRenderComponent(rctx, ctx);
    }
    else {
        const setsInnerHTML = checkInnerHTML(props);
        if (setsInnerHTML) {
            if (vnode.$children$.length > 0) {
                logWarn$1('Node can not have children when innerHTML is set');
            }
            return elm;
        }
    }
    return then$1(wait, () => {
        let children = vnode.$children$;
        if (children.length > 0) {
            if (children.length === 1 && children[0].$type$ === SKIP_RENDER_TYPE) {
                children = children[0].$children$;
            }
            const slotRctx = copyRenderContext(rctx);
            slotRctx.$contexts$.push(ctx);
            const slotMap = isComponent ? getSlots(ctx.$component$, elm) : undefined;
            const promises = children.map((ch) => createElm(slotRctx, ch, isSvg));
            return then$1(promiseAll(promises), () => {
                let parent = elm;
                for (const node of children) {
                    if (slotMap) {
                        parent = getSlotElement(slotRctx, slotMap, elm, getSlotName(node));
                    }
                    parent.appendChild(node.$elm$);
                }
                return elm;
            });
        }
        return elm;
    });
};
const getSlots = (componentCtx, hostElm) => {
    const slots = {};
    const templates = {};
    const slotRef = directGetAttribute(hostElm, 'q:sref');
    const existingSlots = Array.from(hostElm.querySelectorAll(`q\\:slot[q\\:sref="${slotRef}"]`));
    const newSlots = componentCtx?.$slots$ ?? EMPTY_ARRAY;
    const t = Array.from(hostElm.children).filter(isSlotTemplate);
    // Map slots
    for (const elm of existingSlots) {
        slots[directGetAttribute(elm, 'name') ?? ''] = elm;
    }
    // Map virtual slots
    for (const vnode of newSlots) {
        slots[vnode.$props$?.name ?? ''] = vnode.$elm$;
    }
    // Map templates
    for (const elm of t) {
        templates[directGetAttribute(elm, 'q:slot') ?? ''] = elm;
    }
    return { slots, templates };
};
const handleStyle = (ctx, elm, _, newValue) => {
    setAttribute(ctx, elm, 'style', stringifyClassOrStyle(newValue, false));
    return true;
};
const handleClass = (ctx, elm, _, newValue) => {
    setAttribute(ctx, elm, 'class', stringifyClassOrStyle(newValue, true));
    return true;
};
const checkBeforeAssign = (ctx, elm, prop, newValue) => {
    if (prop in elm) {
        if (elm[prop] !== newValue) {
            setProperty(ctx, elm, prop, newValue);
        }
    }
    return true;
};
const dangerouslySetInnerHTML = 'dangerouslySetInnerHTML';
const setInnerHTML = (ctx, elm, _, newValue) => {
    if (dangerouslySetInnerHTML in elm) {
        setProperty(ctx, elm, dangerouslySetInnerHTML, newValue);
    }
    else if ('innerHTML' in elm) {
        setProperty(ctx, elm, 'innerHTML', newValue);
    }
    return true;
};
const PROP_HANDLER_MAP = {
    style: handleStyle,
    class: handleClass,
    className: handleClass,
    value: checkBeforeAssign,
    checked: checkBeforeAssign,
    [dangerouslySetInnerHTML]: setInnerHTML,
};
const ALLOWS_PROPS = ['class', 'className', 'style', 'id', 'q:slot'];
const HOST_PREFIX = 'host:';
const SCOPE_PREFIX = /^(host|window|document|prevent(d|D)efault):/;
const updateProperties = (rctx, ctx, expectProps, isSvg) => {
    if (!expectProps) {
        return false;
    }
    const elm = ctx.$element$;
    const isCmp = OnRenderProp in expectProps;
    const qwikProps = isCmp ? getPropsMutator(ctx, rctx.$containerState$) : undefined;
    for (let key of Object.keys(expectProps)) {
        if (key === 'children' || key === OnRenderProp) {
            continue;
        }
        const newValue = expectProps[key];
        if (key === 'ref') {
            newValue.current = elm;
            continue;
        }
        // Early exit if value didnt change
        const oldValue = ctx.$cache$.get(key);
        if (newValue === oldValue) {
            continue;
        }
        ctx.$cache$.set(key, newValue);
        // Check of data- or aria-
        if (key.startsWith('data-') || key.startsWith('aria-')) {
            setAttribute(rctx, elm, key, newValue);
            continue;
        }
        if (qwikProps) {
            const skipProperty = ALLOWS_PROPS.includes(key);
            const hasPrefix = SCOPE_PREFIX.test(key);
            if (!skipProperty && !hasPrefix) {
                // Qwik props
                qwikProps.set(key, newValue);
                continue;
            }
            const hPrefixed = key.startsWith(HOST_PREFIX);
            if (hPrefixed) {
                key = key.slice(HOST_PREFIX.length);
            }
        }
        else if (key.startsWith(HOST_PREFIX)) {
            logWarn$1(`${HOST_PREFIX} prefix can not be used in non components`);
            continue;
        }
        if (isOnProp(key)) {
            setEvent(rctx, ctx, key, newValue);
            continue;
        }
        // Check if its an exception
        const exception = PROP_HANDLER_MAP[key];
        if (exception) {
            if (exception(rctx, elm, key, newValue, oldValue)) {
                continue;
            }
        }
        // Check if property in prototype
        if (!isSvg && key in elm) {
            setProperty(rctx, elm, key, newValue);
            continue;
        }
        // Fallback to render attribute
        setAttribute(rctx, elm, key, newValue);
    }
    return ctx.$dirty$;
};
const createRenderContext = (doc, containerState, containerEl) => {
    const ctx = {
        $doc$: doc,
        $containerState$: containerState,
        $containerEl$: containerEl,
        $hostElements$: new Set(),
        $operations$: [],
        $roots$: [],
        $contexts$: [],
        $currentComponent$: undefined,
        $perf$: {
            $visited$: 0,
        },
    };
    return ctx;
};
const copyRenderContext = (ctx) => {
    const newCtx = {
        ...ctx,
        $contexts$: [...ctx.$contexts$],
    };
    return newCtx;
};
const setAttribute = (ctx, el, prop, value) => {
    const fn = () => {
        if (value == null || value === false) {
            el.removeAttribute(prop);
        }
        else {
            const str = value === true ? '' : String(value);
            directSetAttribute(el, prop, str);
        }
    };
    ctx.$operations$.push({
        $el$: el,
        $operation$: 'set-attribute',
        $args$: [prop, value],
        $fn$: fn,
    });
};
const classlistAdd = (ctx, el, hostStyleTag) => {
    const fn = () => {
        el.classList.add(hostStyleTag);
    };
    ctx.$operations$.push({
        $el$: el,
        $operation$: 'classlist-add',
        $args$: [hostStyleTag],
        $fn$: fn,
    });
};
const setProperty = (ctx, node, key, value) => {
    const fn = () => {
        try {
            node[key] = value;
        }
        catch (err) {
            logError$1(codeToText$1(QError_setProperty), { node, key, value }, err);
        }
    };
    ctx.$operations$.push({
        $el$: node,
        $operation$: 'set-property',
        $args$: [key, value],
        $fn$: fn,
    });
};
const createElement = (ctx, expectTag, isSvg) => {
    const el = isSvg
        ? ctx.$doc$.createElementNS(SVG_NS, expectTag)
        : ctx.$doc$.createElement(expectTag);
    el[CONTAINER$1] = ctx.$containerEl$;
    ctx.$operations$.push({
        $el$: el,
        $operation$: 'create-element',
        $args$: [expectTag],
        $fn$: () => { },
    });
    return el;
};
const insertBefore = (ctx, parent, newChild, refChild) => {
    const fn = () => {
        parent.insertBefore(newChild, refChild ? refChild : null);
    };
    ctx.$operations$.push({
        $el$: parent,
        $operation$: 'insert-before',
        $args$: [newChild, refChild],
        $fn$: fn,
    });
    return newChild;
};
const prepend = (ctx, parent, newChild) => {
    const fn = () => {
        parent.insertBefore(newChild, parent.firstChild);
    };
    ctx.$operations$.push({
        $el$: parent,
        $operation$: 'prepend',
        $args$: [newChild],
        $fn$: fn,
    });
};
const removeNode = (ctx, el) => {
    const fn = () => {
        const parent = el.parentNode;
        if (parent) {
            if (el.nodeType === 1) {
                cleanupTree(el, ctx.$containerState$.$subsManager$);
            }
            parent.removeChild(el);
        }
        else {
            logWarn$1('Trying to remove component already removed', el);
        }
    };
    ctx.$operations$.push({
        $el$: el,
        $operation$: 'remove',
        $args$: [],
        $fn$: fn,
    });
};
const cleanupTree = (parent, subsManager) => {
    if (parent.nodeName === 'Q:SLOT') {
        return;
    }
    if (parent.hasAttribute(QHostAttr)) {
        cleanupElement(parent, subsManager);
    }
    let child = parent.firstElementChild;
    while (child) {
        cleanupTree(child, subsManager);
        child = child.nextElementSibling;
    }
};
const cleanupElement = (el, subsManager) => {
    const ctx = tryGetContext(el);
    if (ctx) {
        cleanupContext(ctx, subsManager);
    }
};
const createTextNode = (ctx, text) => {
    return ctx.$doc$.createTextNode(text);
};
const executeContextWithSlots = (ctx) => {
    const before = ctx.$roots$.map((elm) => getSlots(undefined, elm));
    executeContext(ctx);
    const after = ctx.$roots$.map((elm) => getSlots(undefined, elm));
    assertEqual(before.length, after.length);
    for (let i = 0; i < before.length; i++) {
        resolveSlotProjection(ctx, ctx.$roots$[i], before[i], after[i]);
    }
};
const executeContext = (ctx) => {
    for (const op of ctx.$operations$) {
        op.$fn$();
    }
};
const printRenderStats = (ctx) => {
    {
        if (typeof window !== 'undefined' && window.document != null) {
            const byOp = {};
            for (const op of ctx.$operations$) {
                byOp[op.$operation$] = (byOp[op.$operation$] ?? 0) + 1;
            }
            const affectedElements = Array.from(new Set(ctx.$operations$.map((a) => a.$el$)));
            const stats = {
                byOp,
                roots: ctx.$roots$,
                hostElements: Array.from(ctx.$hostElements$),
                affectedElements,
                visitedNodes: ctx.$perf$.$visited$,
                operations: ctx.$operations$.map((v) => [v.$operation$, v.$el$, ...v.$args$]),
            };
            const noOps = ctx.$operations$.length === 0;
            logDebug('Render stats.', noOps ? 'No operations' : '', stats);
        }
    }
};
const createKeyToOldIdx = (children, beginIdx, endIdx) => {
    const map = {};
    for (let i = beginIdx; i <= endIdx; ++i) {
        const child = children[i];
        if (child.nodeType === 1) {
            const key = getKey(child);
            if (key != null) {
                map[key] = i;
            }
        }
    }
    return map;
};
const KEY_SYMBOL = Symbol('vnode key');
const getKey = (el) => {
    let key = el[KEY_SYMBOL];
    if (key === undefined) {
        key = el[KEY_SYMBOL] = directGetAttribute(el, 'q:key');
    }
    return key;
};
const setKey = (el, key) => {
    if (isString(key)) {
        directSetAttribute(el, 'q:key', key);
    }
    el[KEY_SYMBOL] = key;
};
const sameVnode = (elm, vnode2) => {
    const isElement = elm.nodeType === 1;
    if (isElement) {
        const isSameSel = elm.localName === vnode2.$type$;
        if (!isSameSel) {
            return false;
        }
        return getKey(elm) === vnode2.$key$;
    }
    return elm.nodeName === vnode2.$type$;
};
const isTagName = (elm, tagName) => {
    if (elm.nodeType === 1) {
        return elm.localName === tagName;
    }
    return elm.nodeName === tagName;
};
const checkInnerHTML = (props) => {
    return props && ('innerHTML' in props || dangerouslySetInnerHTML in props);
};
const stringifyClassOrStyle = (obj, isClass) => {
    if (obj == null)
        return '';
    if (typeof obj == 'object') {
        let text = '';
        let sep = '';
        if (isArray$1(obj)) {
            if (!isClass) {
                throw qError$1(QError_stringifyClassOrStyle, obj, 'style');
            }
            for (let i = 0; i < obj.length; i++) {
                text += sep + obj[i];
                sep = ' ';
            }
        }
        else {
            for (const key in obj) {
                if (Object.prototype.hasOwnProperty.call(obj, key)) {
                    const value = obj[key];
                    if (value) {
                        text += isClass
                            ? value
                                ? sep + key
                                : ''
                            : sep + fromCamelToKebabCase(key) + ':' + value;
                        sep = isClass ? ' ' : ';';
                    }
                }
            }
        }
        return text;
    }
    return String(obj);
};

// <docs markdown="../readme.md#useLexicalScope">
// !!DO NOT EDIT THIS COMMENT DIRECTLY!!!
// (edit ../readme.md#useLexicalScope instead)
/**
 * Used by the Qwik Optimizer to restore the lexical scoped variables.
 *
 * This method should not be present in the application source code.
 *
 * NOTE: `useLexicalScope` method can only be used in the synchronous portion of the callback
 * (before any `await` statements.)
 *
 * @public
 */
// </docs>
const useLexicalScope = () => {
    const context = getInvokeContext();
    const hostElement = context.$hostElement$;
    const qrl = (context.$qrl$ ??
        parseQRL(decodeURIComponent(String(context.$url$)), hostElement));
    if (qrl.$captureRef$ == null) {
        const el = context.$element$;
        assertDefined$1(el);
        assertDefined$1(qrl.$capture$);
        resumeIfNeeded(getContainer$1(el));
        const ctx = getContext(el);
        qrl.$captureRef$ = qrl.$capture$.map((idx) => qInflate(idx, ctx));
    }
    const subscriber = context.$subscriber$;
    if (subscriber) {
        return qrl.$captureRef$;
    }
    return qrl.$captureRef$;
};
const qInflate = (ref, hostCtx) => {
    const int = parseInt(ref, 10);
    const obj = hostCtx.$refMap$.$get$(int);
    assertEqual(hostCtx.$refMap$.$array$.length > int, true);
    return obj;
};

const CONTAINER_STATE = Symbol('ContainerState');
const getContainerState = (containerEl) => {
    let set = containerEl[CONTAINER_STATE];
    if (!set) {
        containerEl[CONTAINER_STATE] = set = {
            $proxyMap$: new WeakMap(),
            $subsManager$: createSubscriptionManager(),
            $platform$: getPlatform$1(containerEl),
            $watchNext$: new Set(),
            $watchStaging$: new Set(),
            $hostsNext$: new Set(),
            $hostsStaging$: new Set(),
            $renderPromise$: undefined,
            $hostsRendering$: undefined,
        };
    }
    return set;
};
const notifyChange = (subscriber) => {
    if (isElement$1(subscriber)) {
        notifyRender(subscriber);
    }
    else {
        notifyWatch(subscriber);
    }
};
/**
 * Mark component for rendering.
 *
 * Use `notifyRender` method to mark a component for rendering at some later point in time.
 * This method uses `getPlatform(doc).queueRender` for scheduling of the rendering. The
 * default implementation of the method is to use `requestAnimationFrame` to do actual rendering.
 *
 * The method is intended to coalesce multiple calls into `notifyRender` into a single call for
 * rendering.
 *
 * @param hostElement - Host-element of the component to re-render.
 * @returns A promise which is resolved when the component has been rendered.
 * @public
 */
const notifyRender = async (hostElement) => {
    assertDefined$1(directGetAttribute(hostElement, QHostAttr));
    const containerEl = getContainer$1(hostElement);
    assertDefined$1(containerEl);
    const state = getContainerState(containerEl);
    if (!qTest &&
        state.$platform$.isServer &&
        directGetAttribute(containerEl, QContainerAttr) === 'paused') {
        logWarn$1('Can not rerender in server platform');
        return undefined;
    }
    resumeIfNeeded(containerEl);
    const ctx = getContext(hostElement);
    assertDefined$1(ctx.$renderQrl$);
    if (ctx.$dirty$) {
        return state.$renderPromise$;
    }
    ctx.$dirty$ = true;
    const activeRendering = state.$hostsRendering$ !== undefined;
    if (activeRendering) {
        state.$hostsStaging$.add(hostElement);
        return state.$renderPromise$.then((ctx) => {
            if (state.$hostsNext$.has(hostElement)) {
                // TODO
                return state.$renderPromise$;
            }
            else {
                return ctx;
            }
        });
    }
    else {
        state.$hostsNext$.add(hostElement);
        return scheduleFrame(containerEl, state);
    }
};
const notifyWatch = (watch) => {
    const containerEl = getContainer$1(watch.el);
    const state = getContainerState(containerEl);
    watch.f |= WatchFlagsIsDirty;
    const activeRendering = state.$hostsRendering$ !== undefined;
    if (activeRendering) {
        state.$watchStaging$.add(watch);
    }
    else {
        state.$watchNext$.add(watch);
        scheduleFrame(containerEl, state);
    }
};
const scheduleFrame = (containerEl, containerState) => {
    if (containerState.$renderPromise$ === undefined) {
        containerState.$renderPromise$ = containerState.$platform$.nextTick(() => renderMarked(containerEl, containerState));
    }
    return containerState.$renderPromise$;
};
const renderMarked = async (containerEl, containerState) => {
    const hostsRendering = (containerState.$hostsRendering$ = new Set(containerState.$hostsNext$));
    containerState.$hostsNext$.clear();
    await executeWatches(containerState, (watch) => {
        return (watch.f & WatchFlagsIsWatch) !== 0;
    });
    containerState.$hostsStaging$.forEach((host) => {
        hostsRendering.add(host);
    });
    containerState.$hostsStaging$.clear();
    const doc = getDocument$1(containerEl);
    const platform = containerState.$platform$;
    const renderingQueue = Array.from(hostsRendering);
    sortNodes(renderingQueue);
    const ctx = createRenderContext(doc, containerState, containerEl);
    for (const el of renderingQueue) {
        if (!ctx.$hostElements$.has(el)) {
            ctx.$roots$.push(el);
            try {
                await renderComponent(ctx, getContext(el));
            }
            catch (e) {
                logError$1(codeToText$1(QError_errorWhileRendering), e);
            }
        }
    }
    // Early exist, no dom operations
    if (ctx.$operations$.length === 0) {
        printRenderStats(ctx);
        postRendering(containerEl, containerState, ctx);
        return ctx;
    }
    return platform.raf(() => {
        executeContextWithSlots(ctx);
        printRenderStats(ctx);
        postRendering(containerEl, containerState, ctx);
        return ctx;
    });
};
const postRendering = async (containerEl, containerState, ctx) => {
    await executeWatches(containerState, (watch, stage) => {
        if ((watch.f & WatchFlagsIsEffect) === 0) {
            return false;
        }
        if (stage) {
            return ctx.$hostElements$.has(watch.el);
        }
        return true;
    });
    // Clear staging
    containerState.$hostsStaging$.forEach((el) => {
        containerState.$hostsNext$.add(el);
    });
    containerState.$hostsStaging$.clear();
    containerState.$hostsRendering$ = undefined;
    containerState.$renderPromise$ = undefined;
    if (containerState.$hostsNext$.size + containerState.$watchNext$.size > 0) {
        scheduleFrame(containerEl, containerState);
    }
};
const executeWatches = async (containerState, watchPred) => {
    const watchPromises = [];
    containerState.$watchNext$.forEach((watch) => {
        if (watchPred(watch, false)) {
            watchPromises.push(then$1(watch.qrl.resolveLazy(watch.el), () => watch));
            containerState.$watchNext$.delete(watch);
        }
    });
    do {
        // Run staging effected
        containerState.$watchStaging$.forEach((watch) => {
            if (watchPred(watch, true)) {
                watchPromises.push(then$1(watch.qrl.resolveLazy(watch.el), () => watch));
            }
            else {
                containerState.$watchNext$.add(watch);
            }
        });
        containerState.$watchStaging$.clear();
        // Wait for all promises
        if (watchPromises.length > 0) {
            const watches = await Promise.all(watchPromises);
            sortWatches(watches);
            await Promise.all(watches.map((watch) => {
                return runWatch(watch, containerState);
            }));
            watchPromises.length = 0;
        }
    } while (containerState.$watchStaging$.size > 0);
};
const sortNodes = (elements) => {
    elements.sort((a, b) => (a.compareDocumentPosition(b) & 2 ? 1 : -1));
};
const sortWatches = (watches) => {
    watches.sort((a, b) => {
        if (a.el === b.el) {
            return a.i < b.i ? -1 : 1;
        }
        return (a.el.compareDocumentPosition(b.el) & 2) !== 0 ? 1 : -1;
    });
};

const QObjectRecursive = 1 << 0;
const QObjectImmutable = 1 << 1;
/**
 * Creates a proxy which notifies of any writes.
 */
const getOrCreateProxy = (target, containerState, flags = 0) => {
    const proxy = containerState.$proxyMap$.get(target);
    if (proxy) {
        return proxy;
    }
    return createProxy(target, containerState, flags, undefined);
};
const createProxy = (target, containerState, flags, subs) => {
    assertEqual(unwrapProxy$1(target), target, 'Unexpected proxy at this location');
    assertEqual(containerState.$proxyMap$.has(target), false, 'Proxy was already created');
    if (!isObject$1(target)) {
        throw qError$1(QError_onlyObjectWrapped, target);
    }
    if (target.constructor !== Object && !isArray$1(target)) {
        throw qError$1(QError_onlyLiteralWrapped, target);
    }
    const manager = containerState.$subsManager$.$getLocal$(target, subs);
    const proxy = new Proxy(target, new ReadWriteProxyHandler(containerState, manager, flags));
    containerState.$proxyMap$.set(target, proxy);
    return proxy;
};
const QOjectTargetSymbol$1 = Symbol();
const QOjectFlagsSymbol = Symbol();
const createSubscriptionManager = () => {
    const objToSubs = new Map();
    const subsToObjs = new Map();
    const clearSub = (sub) => {
        const subs = subsToObjs.get(sub);
        if (subs) {
            subs.forEach((s) => {
                s.delete(sub);
            });
            subsToObjs.delete(sub);
            subs.clear();
        }
    };
    const tryGetLocal = (obj) => {
        assertEqual(getProxyTarget$1(obj), undefined);
        return objToSubs.get(obj);
    };
    const trackSubToObj = (subscriber, map) => {
        let set = subsToObjs.get(subscriber);
        if (!set) {
            subsToObjs.set(subscriber, (set = new Set()));
        }
        set.add(map);
    };
    const getLocal = (obj, initialMap) => {
        let local = tryGetLocal(obj);
        if (local) {
            assertEqual(initialMap, undefined);
        }
        else {
            const map = !initialMap ? new Map() : initialMap;
            map.forEach((_, key) => {
                trackSubToObj(key, map);
            });
            objToSubs.set(obj, (local = {
                $subs$: map,
                $addSub$(subscriber, key) {
                    if (key == null) {
                        map.set(subscriber, null);
                    }
                    else {
                        let sub = map.get(subscriber);
                        if (sub === undefined) {
                            map.set(subscriber, (sub = new Set()));
                        }
                        if (sub) {
                            sub.add(key);
                        }
                    }
                    trackSubToObj(subscriber, map);
                },
                $notifySubs$(key) {
                    map.forEach((value, subscriber) => {
                        if (value === null || !key) {
                            notifyChange(subscriber);
                        }
                        else if (value.has(key)) {
                            notifyChange(subscriber);
                        }
                    });
                },
            }));
        }
        return local;
    };
    return {
        $tryGetLocal$: tryGetLocal,
        $getLocal$: getLocal,
        $clearSub$: clearSub,
    };
};
class ReadWriteProxyHandler {
    constructor($containerState$, $manager$, $flags$) {
        this.$containerState$ = $containerState$;
        this.$manager$ = $manager$;
        this.$flags$ = $flags$;
    }
    get(target, prop) {
        if (typeof prop === 'symbol') {
            if (prop === QOjectTargetSymbol$1)
                return target;
            if (prop === QOjectFlagsSymbol)
                return this.$flags$;
            return target[prop];
        }
        let subscriber;
        const invokeCtx = tryGetInvokeContext();
        const recursive = (this.$flags$ & QObjectRecursive) !== 0;
        const immutable = (this.$flags$ & QObjectImmutable) !== 0;
        if (invokeCtx) {
            subscriber = invokeCtx.$subscriber$;
        }
        let value = target[prop];
        if (isMutable(value)) {
            value = value.v;
        }
        else if (immutable) {
            subscriber = null;
        }
        if (subscriber) {
            const isA = isArray$1(target);
            this.$manager$.$addSub$(subscriber, isA ? undefined : prop);
        }
        return recursive ? wrap(value, this.$containerState$) : value;
    }
    set(target, prop, newValue) {
        if (typeof prop === 'symbol') {
            target[prop] = newValue;
            return true;
        }
        const immutable = (this.$flags$ & QObjectImmutable) !== 0;
        if (immutable) {
            throw qError$1(QError_immutableProps);
        }
        const recursive = (this.$flags$ & QObjectRecursive) !== 0;
        const unwrappedNewValue = recursive ? unwrapProxy$1(newValue) : newValue;
        {
            verifySerializable$1(unwrappedNewValue);
            const invokeCtx = tryGetInvokeContext();
            if (invokeCtx && invokeCtx.$event$ === RenderEvent) {
                logWarn$1('State mutation inside render function. Move mutation to useWatch(), useClientEffect() or useServerMount()', invokeCtx.$hostElement$, prop);
            }
        }
        const isA = isArray$1(target);
        if (isA) {
            target[prop] = unwrappedNewValue;
            this.$manager$.$notifySubs$();
            return true;
        }
        const oldValue = target[prop];
        if (oldValue !== unwrappedNewValue) {
            target[prop] = unwrappedNewValue;
            this.$manager$.$notifySubs$(prop);
        }
        return true;
    }
    has(target, property) {
        if (property === QOjectTargetSymbol$1)
            return true;
        if (property === QOjectFlagsSymbol)
            return true;
        return Object.prototype.hasOwnProperty.call(target, property);
    }
    ownKeys(target) {
        let subscriber = null;
        const invokeCtx = tryGetInvokeContext();
        if (invokeCtx) {
            subscriber = invokeCtx.$subscriber$;
        }
        if (subscriber) {
            this.$manager$.$addSub$(subscriber);
        }
        return Object.getOwnPropertyNames(target);
    }
}
const wrap = (value, containerState) => {
    if (isObject$1(value)) {
        if (isQrl$1(value)) {
            return value;
        }
        if (Object.isFrozen(value)) {
            return value;
        }
        const nakedValue = unwrapProxy$1(value);
        if (nakedValue !== value) {
            // already a proxy return;
            return value;
        }
        if (isNode$1(nakedValue)) {
            return value;
        }
        if (!shouldSerialize$1(nakedValue)) {
            return value;
        }
        {
            verifySerializable$1(value);
        }
        const proxy = containerState.$proxyMap$.get(value);
        return proxy ? proxy : getOrCreateProxy(value, containerState, QObjectRecursive);
    }
    else {
        return value;
    }
};
const verifySerializable$1 = (value) => {
    const unwrapped = unwrapProxy$1(value);
    if (unwrapped == null) {
        return value;
    }
    if (shouldSerialize$1(unwrapped)) {
        switch (typeof unwrapped) {
            case 'object':
                if (isArray$1(unwrapped)) {
                    for (const item of unwrapped) {
                        verifySerializable$1(item);
                    }
                    return value;
                }
                if (Object.getPrototypeOf(unwrapped) === Object.prototype) {
                    for (const item of Object.values(unwrapped)) {
                        verifySerializable$1(item);
                    }
                    return value;
                }
                if (isQrl$1(unwrapped))
                    return value;
                if (isElement$1(unwrapped))
                    return value;
                if (isDocument$1(unwrapped))
                    return value;
                break;
            case 'boolean':
            case 'string':
            case 'number':
                return value;
        }
        throw qError$1(QError_verifySerializable$1, unwrapped);
    }
    return value;
};
const noSerializeSet$1 = /*#__PURE__*/ new WeakSet();
const shouldSerialize$1 = (obj) => {
    if (isObject$1(obj) || isFunction$1(obj)) {
        return !noSerializeSet$1.has(obj);
    }
    return true;
};
// <docs markdown="../readme.md#noSerialize">
// !!DO NOT EDIT THIS COMMENT DIRECTLY!!!
// (edit ../readme.md#noSerialize instead)
/**
 * @alpha
 */
// </docs>
const noSerialize = (input) => {
    noSerializeSet$1.add(input);
    return input;
};
/**
 * @alpha
 */
const mutable = (v) => {
    return {
        [MUTABLE]: true,
        v,
    };
};
const isConnected = (sub) => {
    if (isElement$1(sub)) {
        return !!tryGetContext(sub) || sub.isConnected;
    }
    else {
        return isConnected(sub.el);
    }
};
const MUTABLE = Symbol('mutable');
const isMutable = (v) => {
    return isObject$1(v) && v[MUTABLE] === true;
};
/**
 * @alpha
 */
const unwrapProxy$1 = (proxy) => {
    return getProxyTarget$1(proxy) ?? proxy;
};
const getProxyTarget$1 = (obj) => {
    if (isObject$1(obj)) {
        return obj[QOjectTargetSymbol$1];
    }
    return undefined;
};
const getProxyFlags = (obj) => {
    if (isObject$1(obj)) {
        return obj[QOjectFlagsSymbol];
    }
    return undefined;
};

const isQrl$1 = (value) => {
    return value instanceof QRL$1;
};
class QRL$1 {
    constructor($chunk$, $symbol$, $symbolRef$, $symbolFn$, $capture$, $captureRef$) {
        this.$chunk$ = $chunk$;
        this.$symbol$ = $symbol$;
        this.$symbolRef$ = $symbolRef$;
        this.$symbolFn$ = $symbolFn$;
        this.$capture$ = $capture$;
        this.$captureRef$ = $captureRef$;
        {
            verifySerializable$1($captureRef$);
        }
    }
    setContainer(el) {
        if (!this.$el$) {
            this.$el$ = el;
        }
    }
    getSymbol() {
        return this.$refSymbol$ ?? this.$symbol$;
    }
    getHash() {
        return getSymbolHash$1(this.$refSymbol$ ?? this.$symbol$);
    }
    async resolve(el) {
        if (el) {
            this.setContainer(el);
        }
        return qrlImport$1(this.$el$, this);
    }
    resolveLazy(el) {
        return isFunction$1(this.$symbolRef$) ? this.$symbolRef$ : this.resolve(el);
    }
    invokeFn(el, currentCtx, beforeFn) {
        return ((...args) => {
            const fn = this.resolveLazy(el);
            return then$1(fn, (fn) => {
                if (isFunction$1(fn)) {
                    const baseContext = currentCtx ?? newInvokeContext$1();
                    const context = {
                        ...baseContext,
                        $qrl$: this,
                    };
                    if (beforeFn) {
                        beforeFn();
                    }
                    return useInvoke$1(context, fn, ...args);
                }
                throw qError$1(QError_qrlIsNotFunction$1);
            });
        });
    }
    copy() {
        const copy = new QRL$1(this.$chunk$, this.$symbol$, this.$symbolRef$, this.$symbolFn$, null, this.$captureRef$);
        copy.$refSymbol$ = this.$refSymbol$;
        return copy;
    }
    async invoke(...args) {
        const fn = this.invokeFn();
        const result = await fn(...args);
        return result;
    }
    serialize(options) {
        return stringifyQRL$1(this, options);
    }
}
const getSymbolHash$1 = (symbolName) => {
    const index = symbolName.lastIndexOf('_');
    if (index > -1) {
        return symbolName.slice(index + 1);
    }
    return symbolName;
};
const isSameQRL = (a, b) => {
    return a.getHash() === b.getHash();
};

let runtimeSymbolId = 0;
const RUNTIME_QRL$1 = '/runtimeQRL';
const INLINED_QRL = '/inlinedQRL';
/**
 * Lazy-load a `QRL` symbol and return the lazy-loaded value.
 *
 * @see `QRL`
 *
 * @param element - Location of the URL to resolve against. This is needed to take `q:base` into
 * account.
 * @param qrl - QRL to load.
 * @returns A resolved QRL value as a Promise.
 */
const qrlImport$1 = (element, qrl) => {
    const qrl_ = qrl;
    if (qrl_.$symbolRef$)
        return qrl_.$symbolRef$;
    if (qrl_.$symbolFn$) {
        return (qrl_.$symbolRef$ = qrl_
            .$symbolFn$()
            .then((module) => (qrl_.$symbolRef$ = module[qrl_.$symbol$])));
    }
    else {
        if (!element) {
            throw new Error(`QRL '${qrl_.$chunk$}#${qrl_.$symbol$ || 'default'}' does not have an attached container`);
        }
        const symbol = getPlatform$1(element).importSymbol(element, qrl_.$chunk$, qrl_.$symbol$);
        return (qrl_.$symbolRef$ = then$1(symbol, (ref) => {
            return (qrl_.$symbolRef$ = ref);
        }));
    }
};
const runtimeQrl = (symbol, lexicalScopeCapture = EMPTY_ARRAY) => {
    return new QRL$1(RUNTIME_QRL$1, 's' + runtimeSymbolId++, symbol, null, null, lexicalScopeCapture);
};
/**
 * @alpha
 */
const inlinedQrl = (symbol, symbolName, lexicalScopeCapture = EMPTY_ARRAY) => {
    // Unwrap subscribers
    return new QRL$1(INLINED_QRL, symbolName, symbol, null, null, lexicalScopeCapture);
};
const stringifyQRL$1 = (qrl, opts = {}) => {
    const qrl_ = qrl;
    let symbol = qrl_.$symbol$;
    let chunk = qrl_.$chunk$;
    const refSymbol = qrl_.$refSymbol$ ?? symbol;
    const platform = opts.$platform$;
    const element = opts.$element$;
    if (platform) {
        const result = platform.chunkForSymbol(refSymbol);
        if (result) {
            chunk = result[1];
            if (!qrl_.$refSymbol$) {
                symbol = result[0];
            }
        }
    }
    const parts = [chunk];
    if (symbol && symbol !== 'default') {
        parts.push('#', symbol);
    }
    const capture = qrl_.$capture$;
    const captureRef = qrl_.$captureRef$;
    if (opts.$getObjId$) {
        if (captureRef && captureRef.length) {
            const capture = captureRef.map(opts.$getObjId$);
            parts.push(`[${capture.join(' ')}]`);
        }
    }
    else if (capture && capture.length > 0) {
        parts.push(`[${capture.join(' ')}]`);
    }
    const qrlString = parts.join('');
    if (qrl_.$chunk$ === RUNTIME_QRL$1 && element) {
        const qrls = element.__qrls__ || (element.__qrls__ = new Set());
        qrls.add(qrl);
    }
    return qrlString;
};
/**
 * `./chunk#symbol[captures]
 */
const parseQRL = (qrl, el) => {
    const endIdx = qrl.length;
    const hashIdx = indexOf(qrl, 0, '#');
    const captureIdx = indexOf(qrl, hashIdx, '[');
    const chunkEndIdx = Math.min(hashIdx, captureIdx);
    const chunk = qrl.substring(0, chunkEndIdx);
    const symbolStartIdx = hashIdx == endIdx ? hashIdx : hashIdx + 1;
    const symbolEndIdx = captureIdx;
    const symbol = symbolStartIdx == symbolEndIdx ? 'default' : qrl.substring(symbolStartIdx, symbolEndIdx);
    const captureStartIdx = captureIdx;
    const captureEndIdx = endIdx;
    const capture = captureStartIdx === captureEndIdx
        ? EMPTY_ARRAY
        : qrl.substring(captureStartIdx + 1, captureEndIdx - 1).split(' ');
    if (chunk === RUNTIME_QRL$1) {
        logError$1(codeToText$1(QError_runtimeQrlNoElement), qrl);
    }
    const iQrl = new QRL$1(chunk, symbol, null, null, capture, null);
    if (el) {
        iQrl.setContainer(el);
    }
    return iQrl;
};
const indexOf = (text, startIdx, char) => {
    const endIdx = text.length;
    const charIdx = text.indexOf(char, startIdx == endIdx ? 0 : startIdx);
    return charIdx == -1 ? endIdx : charIdx;
};

// <docs markdown="../readme.md#$">
// !!DO NOT EDIT THIS COMMENT DIRECTLY!!!
// (edit ../readme.md#$ instead)
/**
 * Qwik Optimizer marker function.
 *
 * Use `$(...)` to tell Qwik Optimizer to extract the expression in `$(...)` into a lazy-loadable
 * resource referenced by `QRL`.
 *
 * @see `implicit$FirstArg` for additional `____$(...)` rules.
 *
 * In this example `$(...)` is used to capture the callback function of `onmousemove` into
 * lazy-loadable reference. This allows the code to refer to the function without actually
 * loading the function. In this example, the callback function does not get loaded until
 * `mousemove` event fires.
 *
 * ```tsx
 * useOnDocument(
 *   'mousemove',
 *   $(() => console.log('mousemove'))
 * );
 * ```
 *
 * In this code the Qwik Optimizer detects `$(...)` and transforms the code into:
 *
 * ```tsx
 * // FILE: <current file>
 * useOnDocument('mousemove', qrl('./chunk-abc.js', 'onMousemove'));
 *
 * // FILE: chunk-abc.js
 * export const onMousemove = () => console.log('mousemove');
 * ```
 *
 * ## Special Rules
 *
 * The Qwik Optimizer places special rules on functions that can be lazy-loaded.
 *
 * 1. The expression of the `$(expression)` function must be importable by the system.
 * (expression shows up in `import` or has `export`)
 * 2. If inlined function then all lexically captured values must be:
 *    - importable (vars shows up in `import` or has `export`)
 *    - const (The capturing process differs from JS capturing in that writing to captured
 * variables does not update them, and therefore writes are forbidden. The best practice is that
 * all captured variables are constants.)
 *    - Must be runtime serializable.
 *
 * ```tsx
 * import { importedFn } from './import/example';
 *
 * export const greet = () => console.log('greet');
 * function topLevelFn() {}
 *
 * function myCode() {
 *   const store = useStore({});
 *   function localFn() {}
 *   // Valid Examples
 *   $(greet); // greet is importable
 *   $(importedFn); // importedFn is importable
 *   $(() => greet()); // greet is importable;
 *   $(() => importedFn()); // importedFn is importable
 *   $(() => console.log(store)); // store is serializable.
 *
 *   // Compile time errors
 *   $(topLevelFn); // ERROR: `topLevelFn` not importable
 *   $(() => topLevelFn()); // ERROR: `topLevelFn` not importable
 *
 *   // Runtime errors
 *   $(localFn); // ERROR: `localFn` fails serialization
 *   $(() => localFn()); // ERROR: `localFn` fails serialization
 * }
 *
 * ```
 *
 * @param expression - Expression which should be lazy loaded
 * @public
 */
// </docs>
const $ = (expression) => {
    return runtimeQrl(expression);
};

// <docs markdown="../readme.md#component">
// !!DO NOT EDIT THIS COMMENT DIRECTLY!!!
// (edit ../readme.md#component instead)
/**
 * Declare a Qwik component that can be used to create UI.
 *
 * Use `component$` to declare a Qwik component. A Qwik component is a special kind of component
 * that allows the Qwik framework to lazy load and execute the component independently of other
 * Qwik components as well as lazy load the component's life-cycle hooks and event handlers.
 *
 * Side note: You can also declare regular (standard JSX) components that will have standard
 * synchronous behavior.
 *
 * Qwik component is a facade that describes how the component should be used without forcing the
 * implementation of the component to be eagerly loaded. A minimum Qwik definition consists of:
 *
 * ### Example:
 *
 * An example showing how to create a counter component:
 *
 * ```tsx
 * export interface CounterProps {
 *   initialValue?: number;
 *   step?: number;
 * }
 * export const Counter = component$((props: CounterProps) => {
 *   const state = useStore({ count: props.initialValue || 0 });
 *   return (
 *     <div>
 *       <span>{state.count}</span>
 *       <button onClick$={() => (state.count += props.step || 1)}>+</button>
 *     </div>
 *   );
 * });
 * ```
 *
 * - `component$` is how a component gets declared.
 * - `{ value?: number; step?: number }` declares the public (props) interface of the component.
 * - `{ count: number }` declares the private (state) interface of the component.
 *
 * The above can then be used like so:
 *
 * ```tsx
 * export const OtherComponent = component$(() => {
 *   return <Counter initialValue={100} />;
 * });
 * ```
 *
 * See also: `component`, `useCleanup`, `onResume`, `onPause`, `useOn`, `useOnDocument`,
 * `useOnWindow`, `useStyles`, `useScopedStyles`
 *
 * @public
 */
// </docs>
const componentQrl = (onRenderQrl, options = {}) => {
    const tagName = options.tagName ?? 'div';
    // Return a QComponent Factory function.
    return function QSimpleComponent(props, key) {
        const finalKey = onRenderQrl.getHash() + ':' + (key ? key : '');
        return jsx(tagName, { [OnRenderProp]: onRenderQrl, ...props }, finalKey);
    };
};

/**
 * QWIK_VERSION
 * @public
 */
const version = "0.0.30";

/**
 * Render JSX.
 *
 * Use this method to render JSX. This function does reconciling which means
 * it always tries to reuse what is already in the DOM (rather then destroy and
 * recreate content.)
 *
 * @param parent - Element which will act as a parent to `jsxNode`. When
 *     possible the rendering will try to reuse existing nodes.
 * @param jsxNode - JSX to render
 * @alpha
 */
const render$1 = async (parent, jsxNode) => {
    // If input is not JSX, convert it
    if (!isJSXNode(jsxNode)) {
        jsxNode = jsx(jsxNode, null);
    }
    const doc = getDocument$1(parent);
    const containerEl = getElement$1(parent);
    if (containerEl.hasAttribute(QContainerAttr)) {
        logError$1(codeToText$1(QError_cannotRenderOverExistingContainer));
        return;
    }
    injectQContainer(containerEl);
    const containerState = getContainerState(containerEl);
    const ctx = createRenderContext(doc, containerState, containerEl);
    ctx.$roots$.push(parent);
    const processedNodes = await processData(jsxNode);
    await visitJsxNode(ctx, parent, processedNodes, false);
    executeContext(ctx);
    if (!qTest) {
        injectQwikSlotCSS(parent);
    }
    {
        appendQwikDevTools(containerEl);
        printRenderStats(ctx);
    }
    const promises = [];
    ctx.$hostElements$.forEach((host) => {
        const elCtx = getContext(host);
        elCtx.$watches$.forEach((watch) => {
            if (watch.f & WatchFlagsIsDirty) {
                promises.push(runWatch(watch, containerState));
            }
        });
    });
    await Promise.all(promises);
};
const injectQwikSlotCSS = (docOrElm) => {
    const doc = getDocument$1(docOrElm);
    const element = isDocument$1(docOrElm) ? docOrElm.head : docOrElm;
    const style = doc.createElement('style');
    directSetAttribute(style, 'id', 'qwik/base-styles');
    style.textContent = `q\\:slot{display:contents}q\\:fallback,q\\:template{display:none}q\\:fallback:last-child{display:contents}`;
    element.insertBefore(style, element.firstChild);
};
const getElement$1 = (docOrElm) => {
    return isDocument$1(docOrElm) ? docOrElm.documentElement : docOrElm;
};
const injectQContainer = (containerEl) => {
    directSetAttribute(containerEl, 'q:version', version );
    directSetAttribute(containerEl, QContainerAttr, 'resumed');
};

/**
 * @license
 * @builder.io/qwik/server
 * Copyright Builder.io, Inc. All Rights Reserved.
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/BuilderIO/qwik/blob/main/LICENSE
 */
if (typeof global == 'undefined') {
  const g = 'undefined' != typeof globalThis ? globalThis : 'undefined' != typeof window ? window : 'undefined' != typeof self ? self : {};
  g.global = g;
}

var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined")
    return require.apply(this, arguments);
  throw new Error('Dynamic require of "' + x + '" is not supported');
});

// packages/qwik/src/server/utils.ts
function createTimer() {
  if (typeof performance === "undefined") {
    return () => 0;
  }
  const start = performance.now();
  return () => {
    const end = performance.now();
    const delta = end - start;
    return delta / 1e6;
  };
}
function normalizeUrl(url) {
  if (url != null) {
    if (typeof url === "string") {
      return new URL(url || "/", BASE_URI);
    }
    if (typeof url.href === "string") {
      return new URL(url.href || "/", BASE_URI);
    }
  }
  return new URL(BASE_URI);
}
var BASE_URI = `http://document.qwik.dev/`;
function getBuildBase(opts) {
  let base = opts.base;
  if (typeof base === "string") {
    if (!base.endsWith("/")) {
      base += "/";
    }
    return base;
  }
  return "/build/";
}

// packages/qwik/src/core/util/qdev.ts
var qDev = globalThis.qDev !== false;

// packages/qwik/src/core/error/error.ts
var QError_verifySerializable = 3;
var QError_qrlIsNotFunction = 10;
var qError = (code, ...parts) => {
  const text = codeToText(code);
  const error = text + parts.join(" ");
  debugger;
  return new Error(error);
};
var codeToText = (code) => {
  var _a;
  if (qDev) {
    const MAP = [
      "Error while serializing class attribute",
      "Can not serialize a HTML Node that is not an Element",
      "Rruntime but no instance found on element.",
      "Only primitive and object literals can be serialized",
      "Crash while rendering",
      "You can render over a existing q:container. Skipping render().",
      "Set property",
      "Only function's and 'string's are supported.",
      "Only objects can be wrapped in 'QObject'",
      `Only objects literals can be wrapped in 'QObject'`,
      "QRL is not a function",
      "Dynamic import not found",
      "Unknown type argument",
      "not found state for useContext",
      "Invoking 'use*()' method outside of invocation context.",
      "Cant access renderCtx for existing context",
      "Cant access document for existing context",
      "props are inmutable",
      "<Host> component can only be used at the root of a Qwik component$()",
      "Props are immutable by default.",
      "use- method must be called only at the root level of a component$()"
    ];
    return `Code(${code}): ${(_a = MAP[code]) != null ? _a : ""}`;
  } else {
    return `Code(${code})`;
  }
};

// packages/qwik/src/core/util/log.ts
var STYLE = qDev ? `background: #564CE0; color: white; padding: 2px 3px; border-radius: 2px; font-size: 0.8em;` : "";
var logError = (message, ...optionalParams) => {
  const err = message instanceof Error ? message : new Error(message);
  console.error("%cQWIK ERROR", STYLE, err, ...optionalParams);
  return err;
};
var logErrorAndStop = (message, ...optionalParams) => {
  logError(message, ...optionalParams);
  debugger;
};
var logWarn = (message, ...optionalParams) => {
  if (qDev) {
    console.warn("%cQWIK WARN", STYLE, message, ...optionalParams);
  }
};

// packages/qwik/src/core/util/types.ts
var isObject = (v) => {
  return v && typeof v === "object";
};
var isArray = (v) => {
  return Array.isArray(v);
};
var isFunction = (v) => {
  return typeof v === "function";
};

// packages/qwik/src/core/assert/assert.ts
var assertDefined = (value, text) => {
  if (qDev) {
    if (value != null)
      return;
    throw logErrorAndStop(text || "Expected defined value");
  }
};

// packages/qwik/src/core/util/markers.ts
var QContainerSelector = "[q\\:container]";

// packages/qwik/src/core/util/dom.ts
var getDocument = (node) => {
  if (typeof document !== "undefined") {
    return document;
  }
  if (node.nodeType === 9) {
    return node;
  }
  const doc = node.ownerDocument;
  assertDefined(doc);
  return doc;
};

// packages/qwik/src/core/util/promises.ts
var isPromise = (value) => {
  return value instanceof Promise;
};
var then = (promise, thenFn, rejectFn) => {
  return isPromise(promise) ? promise.then(thenFn, rejectFn) : thenFn(promise);
};

// packages/qwik/src/core/use/use-core.ts
var _context;
var CONTAINER = Symbol("container");
var useInvoke = (context, fn, ...args) => {
  const previousContext = _context;
  let returnValue;
  try {
    _context = context;
    returnValue = fn.apply(null, args);
  } finally {
    const currentCtx = _context;
    _context = previousContext;
    if (currentCtx.$waitOn$ && currentCtx.$waitOn$.length > 0) {
      return Promise.all(currentCtx.$waitOn$).then(() => returnValue);
    }
  }
  return returnValue;
};
var newInvokeContext = (doc, hostElement, element, event, url) => {
  return {
    $seq$: 0,
    $doc$: doc,
    $hostElement$: hostElement,
    $element$: element,
    $event$: event,
    $url$: url || null,
    $qrl$: void 0
  };
};
var getContainer = (el) => {
  let container = el[CONTAINER];
  if (!container) {
    container = el.closest(QContainerSelector);
    el[CONTAINER] = container;
  }
  return container;
};

// packages/qwik/src/core/platform/platform.ts
var createPlatform = (doc) => {
  const moduleCache = /* @__PURE__ */ new Map();
  return {
    isServer: false,
    importSymbol(element, url, symbolName) {
      const urlDoc = toUrl(doc, element, url).toString();
      const urlCopy = new URL(urlDoc);
      urlCopy.hash = "";
      urlCopy.search = "";
      const importURL = urlCopy.href;
      const mod = moduleCache.get(importURL);
      if (mod) {
        return mod[symbolName];
      }
      return import(
        /* @vite-ignore */
        importURL
      ).then((mod2) => {
        mod2 = findModule(mod2);
        moduleCache.set(importURL, mod2);
        return mod2[symbolName];
      });
    },
    raf: (fn) => {
      return new Promise((resolve) => {
        requestAnimationFrame(() => {
          resolve(fn());
        });
      });
    },
    nextTick: (fn) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(fn());
        });
      });
    },
    chunkForSymbol() {
      return void 0;
    }
  };
};
var findModule = (module) => {
  return Object.values(module).find(isModule) || module;
};
var isModule = (module) => {
  return isObject(module) && module[Symbol.toStringTag] === "Module";
};
var toUrl = (doc, element, url) => {
  var _a;
  const containerEl = getContainer(element);
  const base = new URL((_a = containerEl == null ? void 0 : containerEl.getAttribute("q:base")) != null ? _a : doc.baseURI, doc.baseURI);
  return new URL(url, base);
};
var getPlatform = (docOrNode) => {
  const doc = getDocument(docOrNode);
  return doc[DocumentPlatform] || (doc[DocumentPlatform] = createPlatform(doc));
};
var DocumentPlatform = /* @__PURE__ */ Symbol();

// packages/qwik/src/core/import/qrl.ts
var RUNTIME_QRL = "/runtimeQRL";
var qrlImport = (element, qrl) => {
  const qrl_ = qrl;
  if (qrl_.$symbolRef$)
    return qrl_.$symbolRef$;
  if (qrl_.$symbolFn$) {
    return qrl_.$symbolRef$ = qrl_.$symbolFn$().then((module) => qrl_.$symbolRef$ = module[qrl_.$symbol$]);
  } else {
    if (!element) {
      throw new Error(`QRL '${qrl_.$chunk$}#${qrl_.$symbol$ || "default"}' does not have an attached container`);
    }
    const symbol = getPlatform(element).importSymbol(element, qrl_.$chunk$, qrl_.$symbol$);
    return qrl_.$symbolRef$ = then(symbol, (ref) => {
      return qrl_.$symbolRef$ = ref;
    });
  }
};
var stringifyQRL = (qrl, opts = {}) => {
  var _a;
  const qrl_ = qrl;
  let symbol = qrl_.$symbol$;
  let chunk = qrl_.$chunk$;
  const refSymbol = (_a = qrl_.$refSymbol$) != null ? _a : symbol;
  const platform = opts.$platform$;
  const element = opts.$element$;
  if (platform) {
    const result = platform.chunkForSymbol(refSymbol);
    if (result) {
      chunk = result[1];
      if (!qrl_.$refSymbol$) {
        symbol = result[0];
      }
    }
  }
  const parts = [chunk];
  if (symbol && symbol !== "default") {
    parts.push("#", symbol);
  }
  const capture = qrl_.$capture$;
  const captureRef = qrl_.$captureRef$;
  if (opts.$getObjId$) {
    if (captureRef && captureRef.length) {
      const capture2 = captureRef.map(opts.$getObjId$);
      parts.push(`[${capture2.join(" ")}]`);
    }
  } else if (capture && capture.length > 0) {
    parts.push(`[${capture.join(" ")}]`);
  }
  const qrlString = parts.join("");
  if (qrl_.$chunk$ === RUNTIME_QRL && element) {
    const qrls = element.__qrls__ || (element.__qrls__ = /* @__PURE__ */ new Set());
    qrls.add(qrl);
  }
  return qrlString;
};

// packages/qwik/src/core/util/element.ts
var isNode = (value) => {
  return value && typeof value.nodeType == "number";
};
var isDocument = (value) => {
  return value && value.nodeType == 9;
};
var isElement = (value) => {
  return isNode(value) && value.nodeType === 1;
};
var QOjectTargetSymbol = Symbol();
var verifySerializable = (value) => {
  const unwrapped = unwrapProxy(value);
  if (unwrapped == null) {
    return value;
  }
  if (shouldSerialize(unwrapped)) {
    switch (typeof unwrapped) {
      case "object":
        if (isArray(unwrapped)) {
          for (const item of unwrapped) {
            verifySerializable(item);
          }
          return value;
        }
        if (Object.getPrototypeOf(unwrapped) === Object.prototype) {
          for (const item of Object.values(unwrapped)) {
            verifySerializable(item);
          }
          return value;
        }
        if (isQrl(unwrapped))
          return value;
        if (isElement(unwrapped))
          return value;
        if (isDocument(unwrapped))
          return value;
        break;
      case "boolean":
      case "string":
      case "number":
        return value;
    }
    throw qError(QError_verifySerializable, unwrapped);
  }
  return value;
};
var noSerializeSet = /* @__PURE__ */ new WeakSet();
var shouldSerialize = (obj) => {
  if (isObject(obj) || isFunction(obj)) {
    return !noSerializeSet.has(obj);
  }
  return true;
};
var unwrapProxy = (proxy) => {
  var _a;
  return (_a = getProxyTarget(proxy)) != null ? _a : proxy;
};
var getProxyTarget = (obj) => {
  if (isObject(obj)) {
    return obj[QOjectTargetSymbol];
  }
  return void 0;
};

// packages/qwik/src/core/import/qrl-class.ts
var isQrl = (value) => {
  return value instanceof QRL;
};
var QRL = class {
  constructor($chunk$, $symbol$, $symbolRef$, $symbolFn$, $capture$, $captureRef$) {
    this.$chunk$ = $chunk$;
    this.$symbol$ = $symbol$;
    this.$symbolRef$ = $symbolRef$;
    this.$symbolFn$ = $symbolFn$;
    this.$capture$ = $capture$;
    this.$captureRef$ = $captureRef$;
    if (qDev) {
      verifySerializable($captureRef$);
    }
  }
  setContainer(el) {
    if (!this.$el$) {
      this.$el$ = el;
    }
  }
  getSymbol() {
    var _a;
    return (_a = this.$refSymbol$) != null ? _a : this.$symbol$;
  }
  getHash() {
    var _a;
    return getSymbolHash((_a = this.$refSymbol$) != null ? _a : this.$symbol$);
  }
  async resolve(el) {
    if (el) {
      this.setContainer(el);
    }
    return qrlImport(this.$el$, this);
  }
  resolveLazy(el) {
    return isFunction(this.$symbolRef$) ? this.$symbolRef$ : this.resolve(el);
  }
  invokeFn(el, currentCtx, beforeFn) {
    return (...args) => {
      const fn = this.resolveLazy(el);
      return then(fn, (fn2) => {
        if (isFunction(fn2)) {
          const baseContext = currentCtx != null ? currentCtx : newInvokeContext();
          const context = {
            ...baseContext,
            $qrl$: this
          };
          if (beforeFn) {
            beforeFn();
          }
          return useInvoke(context, fn2, ...args);
        }
        throw qError(QError_qrlIsNotFunction);
      });
    };
  }
  copy() {
    const copy = new QRL(this.$chunk$, this.$symbol$, this.$symbolRef$, this.$symbolFn$, null, this.$captureRef$);
    copy.$refSymbol$ = this.$refSymbol$;
    return copy;
  }
  async invoke(...args) {
    const fn = this.invokeFn();
    const result = await fn(...args);
    return result;
  }
  serialize(options) {
    return stringifyQRL(this, options);
  }
};
var getSymbolHash = (symbolName) => {
  const index = symbolName.lastIndexOf("_");
  if (index > -1) {
    return symbolName.slice(index + 1);
  }
  return symbolName;
};

// packages/qwik/src/server/platform.ts
function createPlatform2(document2, opts, mapper) {
  if (!document2 || document2.nodeType !== 9) {
    throw new Error(`Invalid Document implementation`);
  }
  const doc = document2;
  if (opts == null ? void 0 : opts.url) {
    doc.location.href = normalizeUrl(opts.url).href;
  }
  const mapperFn = opts.symbolMapper ? opts.symbolMapper : (symbolName) => {
    if (mapper) {
      const hash = getSymbolHash(symbolName);
      const result = mapper[hash];
      if (!result) {
        logError("Cannot resolved symbol", symbolName, "in", mapper);
      }
      return result;
    }
  };
  const serverPlatform = {
    isServer: true,
    async importSymbol(_element, qrl, symbolName) {
      let [modulePath] = String(qrl).split("#");
      if (!modulePath.endsWith(".js")) {
        modulePath += ".js";
      }
      const module = __require(modulePath);
      const symbol = module[symbolName];
      if (!symbol) {
        throw new Error(`Q-ERROR: missing symbol '${symbolName}' in module '${modulePath}'.`);
      }
      return symbol;
    },
    raf: () => {
      logError("server can not rerender");
      return Promise.resolve();
    },
    nextTick: (fn) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(fn());
        });
      });
    },
    chunkForSymbol(symbolName) {
      return mapperFn(symbolName, mapper);
    }
  };
  return serverPlatform;
}
async function setServerPlatform(document2, opts, mapper) {
  const platform = createPlatform2(document2, opts, mapper);
  setPlatform(document2, platform);
}

// packages/qwik/src/optimizer/src/manifest.ts
[
  "onClick$",
  "onDblClick$",
  "onContextMenu$",
  "onAuxClick$",
  "onPointerDown$",
  "onPointerUp$",
  "onPointerMove$",
  "onPointerOver$",
  "onPointerEnter$",
  "onPointerLeave$",
  "onPointerOut$",
  "onPointerCancel$",
  "onGotPointerCapture$",
  "onLostPointerCapture$",
  "onTouchStart$",
  "onTouchEnd$",
  "onTouchMove$",
  "onTouchCancel$",
  "onMouseDown$",
  "onMouseUp$",
  "onMouseMove$",
  "onMouseEnter$",
  "onMouseLeave$",
  "onMouseOver$",
  "onMouseOut$",
  "onWheel$",
  "onGestureStart$",
  "onGestureChange$",
  "onGestureEnd$",
  "onKeyDown$",
  "onKeyUp$",
  "onKeyPress$",
  "onInput$",
  "onChange$",
  "onSearch$",
  "onInvalid$",
  "onBeforeInput$",
  "onSelect$",
  "onFocusIn$",
  "onFocusOut$",
  "onFocus$",
  "onBlur$",
  "onSubmit$",
  "onReset$",
  "onScroll$"
].map((n) => n.toLowerCase());
[
  "useClientEffect$",
  "useEffect$",
  "component$",
  "useStyles$",
  "useScopedStyles$"
].map((n) => n.toLowerCase());
function getValidManifest(manifest) {
  if (manifest != null && manifest.mapping != null && typeof manifest.mapping === "object" && manifest.symbols != null && typeof manifest.symbols === "object" && manifest.bundles != null && typeof manifest.bundles === "object") {
    return manifest;
  }
  return void 0;
}

// packages/qwik/src/server/serialize.ts
function serializeDocument(docOrEl, opts) {
  if (!isDocument(docOrEl)) {
    return docOrEl.outerHTML;
  }
  const manifest = getValidManifest(opts == null ? void 0 : opts.manifest);
  if (manifest && Array.isArray(manifest.injections)) {
    for (const injection of manifest.injections) {
      const el = docOrEl.createElement(injection.tag);
      if (injection.attributes) {
        Object.entries(injection.attributes).forEach(([attr, value]) => {
          el.setAttribute(attr, value);
        });
      }
      if (injection.children) {
        el.textContent = injection.children;
      }
      const parent = injection.location === "head" ? docOrEl.head : docOrEl.body;
      parent.appendChild(el);
    }
  }
  return "<!DOCTYPE html>" + docOrEl.documentElement.outerHTML;
}

// packages/qwik/src/core/render/render.public.ts
var getElement = (docOrElm) => {
  return isDocument(docOrElm) ? docOrElm.documentElement : docOrElm;
};

// packages/qwik/src/server/scripts.ts
var QWIK_LOADER_DEFAULT_MINIFIED = '(()=>{function e(e){return"object"==typeof e&&e&&"Module"===e[Symbol.toStringTag]}((t,n)=>{const o="__q_context__",r=["on:","on-window:","on-document:"],s=(e,n,o)=>{n=n.replace(/([A-Z])/g,(e=>"-"+e.toLowerCase())),t.querySelectorAll("[on"+e+"\\\\:"+n+"]").forEach((e=>l(e,n,o)))},i=(e,t,n)=>e.dispatchEvent(new CustomEvent(t,{detail:n,bubbles:!0,composed:!0})),a=e=>{throw Error("QWIK "+e)},c=(e,n)=>(e=e.closest("[q\\\\:container]"),new URL(n,new URL(e?e.getAttribute("q:base"):t.baseURI,t.baseURI))),l=async(n,s,l)=>{for(const f of r){const r=n.getAttribute(f+s);if(r){n.hasAttribute("preventdefault:"+s)&&l.preventDefault();for(const s of r.split("\\n")){const r=c(n,s);if(r){const s=u(r),c=(window[r.pathname]||(b=await import(r.href.split("#")[0]),Object.values(b).find(e)||b))[s]||a(r+" does not export "+s),f=t[o];if(n.isConnected)try{t[o]=[n,l,r],c(l,n,r)}finally{t[o]=f,i(n,"qsymbol",s)}}}}}var b},u=e=>e.hash.replace(/^#?([^?[|]*).*$/,"$1")||"default",b=(e,n)=>{if((n=e.target)==t)setTimeout((()=>s("-document",e.type,e)));else for(;n&&n.getAttribute;)l(n,e.type,e),n=e.bubbles?n.parentElement:null},f=e=>{if(e=t.readyState,!n&&("interactive"==e||"complete"==e)&&(n=1,s("","qinit",new CustomEvent("qinit")),"undefined"!=typeof IntersectionObserver)){const e=new IntersectionObserver((t=>{for(const n of t)n.isIntersecting&&(e.unobserve(n.target),l(n.target,"qvisible",new CustomEvent("qvisible",{bubbles:!1,detail:n})))}));t.qO=e,t.querySelectorAll("[on\\\\:qvisible]").forEach((t=>e.observe(t)))}},d=e=>t.addEventListener(e,b,{capture:!0});if(!t.qR){t.qR=1;{const e=t.querySelector("script[events]");if(e)e.getAttribute("events").split(/[\\s,;]+/).forEach(d);else for(const e in t)e.startsWith("on")&&d(e.slice(2))}t.addEventListener("readystatechange",f),f()}})(document)})();';
var QWIK_LOADER_DEFAULT_DEBUG = '(() => {\n    function findModule(module) {\n        return Object.values(module).find(isModule) || module;\n    }\n    function isModule(module) {\n        return "object" == typeof module && module && "Module" === module[Symbol.toStringTag];\n    }\n    ((doc, hasInitialized, prefetchWorker) => {\n        const ON_PREFIXES = [ "on:", "on-window:", "on-document:" ];\n        const broadcast = (infix, type, ev) => {\n            type = type.replace(/([A-Z])/g, (a => "-" + a.toLowerCase()));\n            doc.querySelectorAll("[on" + infix + "\\\\:" + type + "]").forEach((target => dispatch(target, type, ev)));\n        };\n        const emitEvent = (el, eventName, detail) => el.dispatchEvent(new CustomEvent(eventName, {\n            detail: detail,\n            bubbles: !0,\n            composed: !0\n        }));\n        const error = msg => {\n            throw new Error("QWIK " + msg);\n        };\n        const qrlResolver = (element, qrl) => {\n            element = element.closest("[q\\\\:container]");\n            return new URL(qrl, new URL(element ? element.getAttribute("q:base") : doc.baseURI, doc.baseURI));\n        };\n        const dispatch = async (element, eventName, ev) => {\n            for (const onPrefix of ON_PREFIXES) {\n                const attrValue = element.getAttribute(onPrefix + eventName);\n                if (attrValue) {\n                    element.hasAttribute("preventdefault:" + eventName) && ev.preventDefault();\n                    for (const qrl of attrValue.split("\\n")) {\n                        const url = qrlResolver(element, qrl);\n                        if (url) {\n                            const symbolName = getSymbolName(url);\n                            const handler = (window[url.pathname] || findModule(await import(url.href.split("#")[0])))[symbolName] || error(url + " does not export " + symbolName);\n                            const previousCtx = doc.__q_context__;\n                            if (element.isConnected) {\n                                try {\n                                    doc.__q_context__ = [ element, ev, url ];\n                                    handler(ev, element, url);\n                                } finally {\n                                    doc.__q_context__ = previousCtx;\n                                    emitEvent(element, "qsymbol", symbolName);\n                                }\n                            }\n                        }\n                    }\n                }\n            }\n        };\n        const getSymbolName = url => url.hash.replace(/^#?([^?[|]*).*$/, "$1") || "default";\n        const processEvent = (ev, element) => {\n            if ((element = ev.target) == doc) {\n                setTimeout((() => broadcast("-document", ev.type, ev)));\n            } else {\n                while (element && element.getAttribute) {\n                    dispatch(element, ev.type, ev);\n                    element = ev.bubbles ? element.parentElement : null;\n                }\n            }\n        };\n        const processReadyStateChange = readyState => {\n            readyState = doc.readyState;\n            if (!hasInitialized && ("interactive" == readyState || "complete" == readyState)) {\n                hasInitialized = 1;\n                broadcast("", "qinit", new CustomEvent("qinit"));\n                if ("undefined" != typeof IntersectionObserver) {\n                    const observer = new IntersectionObserver((entries => {\n                        for (const entry of entries) {\n                            if (entry.isIntersecting) {\n                                observer.unobserve(entry.target);\n                                dispatch(entry.target, "qvisible", new CustomEvent("qvisible", {\n                                    bubbles: !1,\n                                    detail: entry\n                                }));\n                            }\n                        }\n                    }));\n                    doc.qO = observer;\n                    doc.querySelectorAll("[on\\\\:qvisible]").forEach((el => observer.observe(el)));\n                }\n            }\n        };\n        const addDocEventListener = eventName => doc.addEventListener(eventName, processEvent, {\n            capture: !0\n        });\n        if (!doc.qR) {\n            doc.qR = 1;\n            {\n                const scriptTag = doc.querySelector("script[events]");\n                if (scriptTag) {\n                    scriptTag.getAttribute("events").split(/[\\s,;]+/).forEach(addDocEventListener);\n                } else {\n                    for (const key in doc) {\n                        key.startsWith("on") && addDocEventListener(key.slice(2));\n                    }\n                }\n            }\n            doc.addEventListener("readystatechange", processReadyStateChange);\n            processReadyStateChange();\n        }\n    })(document);\n})();';
var QWIK_LOADER_OPTIMIZE_MINIFIED = '(()=>{function e(e){return"object"==typeof e&&e&&"Module"===e[Symbol.toStringTag]}((t,n)=>{const o="__q_context__",r=["on:","on-window:","on-document:"],s=(e,n,o)=>{n=n.replace(/([A-Z])/g,(e=>"-"+e.toLowerCase())),t.querySelectorAll("[on"+e+"\\\\:"+n+"]").forEach((e=>l(e,n,o)))},i=(e,t,n)=>e.dispatchEvent(new CustomEvent(t,{detail:n,bubbles:!0,composed:!0})),a=e=>{throw Error("QWIK "+e)},c=(e,n)=>(e=e.closest("[q\\\\:container]"),new URL(n,new URL(e?e.getAttribute("q:base"):t.baseURI,t.baseURI))),l=async(n,s,l)=>{for(const f of r){const r=n.getAttribute(f+s);if(r){n.hasAttribute("preventdefault:"+s)&&l.preventDefault();for(const s of r.split("\\n")){const r=c(n,s);if(r){const s=b(r),c=(window[r.pathname]||(u=await import(r.href.split("#")[0]),Object.values(u).find(e)||u))[s]||a(r+" does not export "+s),f=t[o];if(n.isConnected)try{t[o]=[n,l,r],c(l,n,r)}finally{t[o]=f,i(n,"qsymbol",s)}}}}}var u},b=e=>e.hash.replace(/^#?([^?[|]*).*$/,"$1")||"default",u=(e,n)=>{if((n=e.target)==t)setTimeout((()=>s("-document",e.type,e)));else for(;n&&n.getAttribute;)l(n,e.type,e),n=e.bubbles?n.parentElement:null},f=e=>{if(e=t.readyState,!n&&("interactive"==e||"complete"==e)&&(n=1,s("","qinit",new CustomEvent("qinit")),"undefined"!=typeof IntersectionObserver)){const e=new IntersectionObserver((t=>{for(const n of t)n.isIntersecting&&(e.unobserve(n.target),l(n.target,"qvisible",new CustomEvent("qvisible",{bubbles:!1,detail:n})))}));t.qO=e,t.querySelectorAll("[on\\\\:qvisible]").forEach((t=>e.observe(t)))}};t.qR||(t.qR=1,window.qEvents.forEach((e=>t.addEventListener(e,u,{capture:!0}))),t.addEventListener("readystatechange",f),f())})(document)})();';
var QWIK_LOADER_OPTIMIZE_DEBUG = '(() => {\n    function findModule(module) {\n        return Object.values(module).find(isModule) || module;\n    }\n    function isModule(module) {\n        return "object" == typeof module && module && "Module" === module[Symbol.toStringTag];\n    }\n    ((doc, hasInitialized, prefetchWorker) => {\n        const ON_PREFIXES = [ "on:", "on-window:", "on-document:" ];\n        const broadcast = (infix, type, ev) => {\n            type = type.replace(/([A-Z])/g, (a => "-" + a.toLowerCase()));\n            doc.querySelectorAll("[on" + infix + "\\\\:" + type + "]").forEach((target => dispatch(target, type, ev)));\n        };\n        const emitEvent = (el, eventName, detail) => el.dispatchEvent(new CustomEvent(eventName, {\n            detail: detail,\n            bubbles: !0,\n            composed: !0\n        }));\n        const error = msg => {\n            throw new Error("QWIK " + msg);\n        };\n        const qrlResolver = (element, qrl) => {\n            element = element.closest("[q\\\\:container]");\n            return new URL(qrl, new URL(element ? element.getAttribute("q:base") : doc.baseURI, doc.baseURI));\n        };\n        const dispatch = async (element, eventName, ev) => {\n            for (const onPrefix of ON_PREFIXES) {\n                const attrValue = element.getAttribute(onPrefix + eventName);\n                if (attrValue) {\n                    element.hasAttribute("preventdefault:" + eventName) && ev.preventDefault();\n                    for (const qrl of attrValue.split("\\n")) {\n                        const url = qrlResolver(element, qrl);\n                        if (url) {\n                            const symbolName = getSymbolName(url);\n                            const handler = (window[url.pathname] || findModule(await import(url.href.split("#")[0])))[symbolName] || error(url + " does not export " + symbolName);\n                            const previousCtx = doc.__q_context__;\n                            if (element.isConnected) {\n                                try {\n                                    doc.__q_context__ = [ element, ev, url ];\n                                    handler(ev, element, url);\n                                } finally {\n                                    doc.__q_context__ = previousCtx;\n                                    emitEvent(element, "qsymbol", symbolName);\n                                }\n                            }\n                        }\n                    }\n                }\n            }\n        };\n        const getSymbolName = url => url.hash.replace(/^#?([^?[|]*).*$/, "$1") || "default";\n        const processEvent = (ev, element) => {\n            if ((element = ev.target) == doc) {\n                setTimeout((() => broadcast("-document", ev.type, ev)));\n            } else {\n                while (element && element.getAttribute) {\n                    dispatch(element, ev.type, ev);\n                    element = ev.bubbles ? element.parentElement : null;\n                }\n            }\n        };\n        const processReadyStateChange = readyState => {\n            readyState = doc.readyState;\n            if (!hasInitialized && ("interactive" == readyState || "complete" == readyState)) {\n                hasInitialized = 1;\n                broadcast("", "qinit", new CustomEvent("qinit"));\n                if ("undefined" != typeof IntersectionObserver) {\n                    const observer = new IntersectionObserver((entries => {\n                        for (const entry of entries) {\n                            if (entry.isIntersecting) {\n                                observer.unobserve(entry.target);\n                                dispatch(entry.target, "qvisible", new CustomEvent("qvisible", {\n                                    bubbles: !1,\n                                    detail: entry\n                                }));\n                            }\n                        }\n                    }));\n                    doc.qO = observer;\n                    doc.querySelectorAll("[on\\\\:qvisible]").forEach((el => observer.observe(el)));\n                }\n            }\n        };\n        const addDocEventListener = eventName => doc.addEventListener(eventName, processEvent, {\n            capture: !0\n        });\n        if (!doc.qR) {\n            doc.qR = 1;\n            window.qEvents.forEach(addDocEventListener);\n            doc.addEventListener("readystatechange", processReadyStateChange);\n            processReadyStateChange();\n        }\n    })(document);\n})();';
function getQwikLoaderScript(opts = {}) {
  if (Array.isArray(opts.events) && opts.events.length > 0) {
    const loader = opts.debug ? QWIK_LOADER_OPTIMIZE_DEBUG : QWIK_LOADER_OPTIMIZE_MINIFIED;
    return loader.replace("window.qEvents", JSON.stringify(opts.events));
  }
  return opts.debug ? QWIK_LOADER_DEFAULT_DEBUG : QWIK_LOADER_DEFAULT_MINIFIED;
}

// packages/qwik/src/server/prefetch-implementation.ts
function applyPrefetchImplementation(doc, parentElm, opts, prefetchResources) {
  const prefetchStrategy = opts.prefetchStrategy;
  if (prefetchStrategy !== null) {
    const prefetchImpl = (prefetchStrategy == null ? void 0 : prefetchStrategy.implementation) || "link-prefetch";
    if (prefetchImpl === "link-prefetch-html" || prefetchImpl === "link-preload-html" || prefetchImpl === "link-modulepreload-html") {
      linkHtmlImplementation(doc, parentElm, prefetchResources, prefetchImpl);
    } else if (prefetchImpl === "link-prefetch" || prefetchImpl === "link-preload" || prefetchImpl === "link-modulepreload") {
      linkJsImplementation(doc, parentElm, prefetchResources, prefetchImpl);
    } else if (prefetchImpl === "worker-fetch") {
      workerFetchImplementation(doc, parentElm, prefetchResources);
    }
  }
}
function linkHtmlImplementation(doc, parentElm, prefetchResources, prefetchImpl) {
  const urls = flattenPrefetchResources(prefetchResources);
  for (const url of urls) {
    const linkElm = doc.createElement("link");
    linkElm.setAttribute("href", url);
    if (prefetchImpl === "link-modulepreload-html") {
      linkElm.setAttribute("rel", "modulepreload");
    } else if (prefetchImpl === "link-preload-html") {
      linkElm.setAttribute("rel", "preload");
      if (url.endsWith(".js")) {
        linkElm.setAttribute("as", "script");
      }
    } else {
      linkElm.setAttribute("rel", "prefetch");
      if (url.endsWith(".js")) {
        linkElm.setAttribute("as", "script");
      }
    }
    parentElm.appendChild(linkElm);
  }
}
function linkJsImplementation(doc, parentElm, prefetchResources, prefetchImpl) {
  const rel = prefetchImpl === "link-modulepreload" ? "modulepreload" : prefetchImpl === "link-preload" ? "preload" : "prefetch";
  let s = `let supportsLinkRel = true;`;
  s += `const u=${JSON.stringify(flattenPrefetchResources(prefetchResources))};`;
  s += `u.map((u,i)=>{`;
  s += `const l=document.createElement('link');`;
  s += `l.setAttribute("href",u);`;
  s += `l.setAttribute("rel","${rel}");`;
  if (rel === "prefetch" || rel === "preload") {
    s += `l.setAttribute("as","script");`;
  }
  s += `if(i===0){`;
  s += `try{`;
  s += `supportsLinkRel=l.relList.supports("${rel}");`;
  s += `}catch(e){}`;
  s += `}`;
  s += `document.body.appendChild(l);`;
  s += `});`;
  s += `if(!supportsLinkRel){`;
  s += workerFetchScript();
  s += `}`;
  const script = doc.createElement("script");
  script.setAttribute("type", "module");
  script.innerHTML = s;
  parentElm.appendChild(script);
}
function workerFetchScript() {
  const fetch = `Promise.all(e.data.map(u=>fetch(u,{priority:"low"}))).finally(()=>{setTimeout(postMessage({}),999)})`;
  const workerBody = `onmessage=(e)=>{${fetch}}`;
  const blob = `new Blob(['${workerBody}'],{type:"text/javascript"})`;
  const url = `URL.createObjectURL(${blob})`;
  let s = `const w=new Worker(${url});`;
  s += `w.postMessage(u.map(u=>new URL(u,origin)+''));`;
  s += `w.onmessage=()=>{w.terminate()};`;
  return s;
}
function workerFetchImplementation(doc, parentElm, prefetchResources) {
  let s = `const u=${JSON.stringify(flattenPrefetchResources(prefetchResources))};`;
  s += workerFetchScript();
  const script = doc.createElement("script");
  script.setAttribute("type", "module");
  script.innerHTML = s;
  parentElm.appendChild(script);
}
function flattenPrefetchResources(prefetchResources) {
  const urls = [];
  const addPrefetchResource = (prefetchResources2) => {
    if (Array.isArray(prefetchResources2)) {
      for (const prefetchResource of prefetchResources2) {
        if (!urls.includes(prefetchResource.url)) {
          urls.push(prefetchResource.url);
          addPrefetchResource(prefetchResource.imports);
        }
      }
    }
  };
  addPrefetchResource(prefetchResources);
  return urls;
}

// packages/qwik/src/server/prefetch-strategy.ts
function getPrefetchResources(snapshotResult, opts, mapper) {
  const manifest = getValidManifest(opts.manifest);
  if (manifest && mapper) {
    const prefetchStrategy = opts.prefetchStrategy;
    const buildBase = getBuildBase(opts);
    if (prefetchStrategy !== null) {
      if (!prefetchStrategy || !prefetchStrategy.symbolsToPrefetch || prefetchStrategy.symbolsToPrefetch === "auto") {
        return getAutoPrefetch(snapshotResult, manifest, mapper, buildBase);
      }
      if (typeof prefetchStrategy.symbolsToPrefetch === "function") {
        try {
          return prefetchStrategy.symbolsToPrefetch({ manifest });
        } catch (e) {
          console.error("getPrefetchUrls, symbolsToPrefetch()", e);
        }
      }
    }
  }
  return [];
}
function getAutoPrefetch(snapshotResult, manifest, mapper, buildBase) {
  const prefetchResources = [];
  const listeners = snapshotResult == null ? void 0 : snapshotResult.listeners;
  const stateObjs = snapshotResult == null ? void 0 : snapshotResult.objs;
  const urls = /* @__PURE__ */ new Set();
  if (Array.isArray(listeners)) {
    for (const prioritizedSymbolName in mapper) {
      const hasSymbol = listeners.some((l) => {
        return l.qrl.getHash() === prioritizedSymbolName;
      });
      if (hasSymbol) {
        addBundle(manifest, urls, prefetchResources, buildBase, mapper[prioritizedSymbolName][1]);
      }
    }
  }
  if (Array.isArray(stateObjs)) {
    for (const obj of stateObjs) {
      if (isQrl(obj)) {
        const qrlSymbolName = obj.getHash();
        const resolvedSymbol = mapper[qrlSymbolName];
        if (resolvedSymbol) {
          addBundle(manifest, urls, prefetchResources, buildBase, resolvedSymbol[0]);
        }
      }
    }
  }
  return prefetchResources;
}
function addBundle(manifest, urls, prefetchResources, buildBase, bundleFileName) {
  const url = buildBase + bundleFileName;
  if (!urls.has(url)) {
    urls.add(url);
    const bundle = manifest.bundles[bundleFileName];
    if (bundle) {
      const prefetchResource = {
        url,
        imports: []
      };
      prefetchResources.push(prefetchResource);
      if (Array.isArray(bundle.imports)) {
        for (const importedFilename of bundle.imports) {
          addBundle(manifest, urls, prefetchResource.imports, buildBase, importedFilename);
        }
      }
    }
  }
}

// dist-dev/qwikdom.mjs
var O = (e, t) => () => (t || e((t = { exports: {} }).exports, t), t.exports);
var Vt = O((mf, Ai) => {
  Ai.exports = Mt;
  Mt.CAPTURING_PHASE = 1;
  Mt.AT_TARGET = 2;
  Mt.BUBBLING_PHASE = 3;
  function Mt(e, t) {
    if (this.type = "", this.target = null, this.currentTarget = null, this.eventPhase = Mt.AT_TARGET, this.bubbles = false, this.cancelable = false, this.isTrusted = false, this.defaultPrevented = false, this.timeStamp = Date.now(), this._propagationStopped = false, this._immediatePropagationStopped = false, this._initialized = true, this._dispatching = false, e && (this.type = e), t)
      for (var r in t)
        this[r] = t[r];
  }
  Mt.prototype = Object.create(Object.prototype, { constructor: { value: Mt }, stopPropagation: { value: function() {
    this._propagationStopped = true;
  } }, stopImmediatePropagation: { value: function() {
    this._propagationStopped = true, this._immediatePropagationStopped = true;
  } }, preventDefault: { value: function() {
    this.cancelable && (this.defaultPrevented = true);
  } }, initEvent: { value: function(t, r, n) {
    this._initialized = true, !this._dispatching && (this._propagationStopped = false, this._immediatePropagationStopped = false, this.defaultPrevented = false, this.isTrusted = false, this.target = null, this.type = t, this.bubbles = r, this.cancelable = n);
  } } });
});
var Xn = O((gf, Ri) => {
  var Mi = Vt();
  Ri.exports = Kn;
  function Kn() {
    Mi.call(this), this.view = null, this.detail = 0;
  }
  Kn.prototype = Object.create(Mi.prototype, { constructor: { value: Kn }, initUIEvent: { value: function(e, t, r, n, l) {
    this.initEvent(e, t, r), this.view = n, this.detail = l;
  } } });
});
var Zn = O((bf, Ii) => {
  var Di = Xn();
  Ii.exports = Qn;
  function Qn() {
    Di.call(this), this.screenX = this.screenY = this.clientX = this.clientY = 0, this.ctrlKey = this.altKey = this.shiftKey = this.metaKey = false, this.button = 0, this.buttons = 1, this.relatedTarget = null;
  }
  Qn.prototype = Object.create(Di.prototype, { constructor: { value: Qn }, initMouseEvent: { value: function(e, t, r, n, l, f, _, y, w, S, M, ae, ce, g, re) {
    switch (this.initEvent(e, t, r, n, l), this.screenX = f, this.screenY = _, this.clientX = y, this.clientY = w, this.ctrlKey = S, this.altKey = M, this.shiftKey = ae, this.metaKey = ce, this.button = g, g) {
      case 0:
        this.buttons = 1;
        break;
      case 1:
        this.buttons = 4;
        break;
      case 2:
        this.buttons = 2;
        break;
      default:
        this.buttons = 0;
        break;
    }
    this.relatedTarget = re;
  } }, getModifierState: { value: function(e) {
    switch (e) {
      case "Alt":
        return this.altKey;
      case "Control":
        return this.ctrlKey;
      case "Shift":
        return this.shiftKey;
      case "Meta":
        return this.metaKey;
      default:
        return false;
    }
  } } });
});
var Xr = O((_f, qi) => {
  qi.exports = Kr;
  var Ll = 1, Al = 3, Ml = 4, Rl = 5, Dl = 7, Il = 8, Ol = 9, ql = 11, Hl = 12, Pl = 13, Bl = 14, Fl = 15, Ul = 17, Vl = 18, zl = 19, jl = 20, Gl = 21, Wl = 22, Yl = 23, $l = 24, Kl = 25, Xl = [null, "INDEX_SIZE_ERR", null, "HIERARCHY_REQUEST_ERR", "WRONG_DOCUMENT_ERR", "INVALID_CHARACTER_ERR", null, "NO_MODIFICATION_ALLOWED_ERR", "NOT_FOUND_ERR", "NOT_SUPPORTED_ERR", "INUSE_ATTRIBUTE_ERR", "INVALID_STATE_ERR", "SYNTAX_ERR", "INVALID_MODIFICATION_ERR", "NAMESPACE_ERR", "INVALID_ACCESS_ERR", null, "TYPE_MISMATCH_ERR", "SECURITY_ERR", "NETWORK_ERR", "ABORT_ERR", "URL_MISMATCH_ERR", "QUOTA_EXCEEDED_ERR", "TIMEOUT_ERR", "INVALID_NODE_TYPE_ERR", "DATA_CLONE_ERR"], Ql = [null, "INDEX_SIZE_ERR (1): the index is not in the allowed range", null, "HIERARCHY_REQUEST_ERR (3): the operation would yield an incorrect nodes model", "WRONG_DOCUMENT_ERR (4): the object is in the wrong Document, a call to importNode is required", "INVALID_CHARACTER_ERR (5): the string contains invalid characters", null, "NO_MODIFICATION_ALLOWED_ERR (7): the object can not be modified", "NOT_FOUND_ERR (8): the object can not be found here", "NOT_SUPPORTED_ERR (9): this operation is not supported", "INUSE_ATTRIBUTE_ERR (10): setAttributeNode called on owned Attribute", "INVALID_STATE_ERR (11): the object is in an invalid state", "SYNTAX_ERR (12): the string did not match the expected pattern", "INVALID_MODIFICATION_ERR (13): the object can not be modified in this way", "NAMESPACE_ERR (14): the operation is not allowed by Namespaces in XML", "INVALID_ACCESS_ERR (15): the object does not support the operation or argument", null, "TYPE_MISMATCH_ERR (17): the type of the object does not match the expected type", "SECURITY_ERR (18): the operation is insecure", "NETWORK_ERR (19): a network error occurred", "ABORT_ERR (20): the user aborted an operation", "URL_MISMATCH_ERR (21): the given URL does not match another URL", "QUOTA_EXCEEDED_ERR (22): the quota has been exceeded", "TIMEOUT_ERR (23): a timeout occurred", "INVALID_NODE_TYPE_ERR (24): the supplied node is invalid or has an invalid ancestor for this operation", "DATA_CLONE_ERR (25): the object can not be cloned."], Oi = { INDEX_SIZE_ERR: Ll, DOMSTRING_SIZE_ERR: 2, HIERARCHY_REQUEST_ERR: Al, WRONG_DOCUMENT_ERR: Ml, INVALID_CHARACTER_ERR: Rl, NO_DATA_ALLOWED_ERR: 6, NO_MODIFICATION_ALLOWED_ERR: Dl, NOT_FOUND_ERR: Il, NOT_SUPPORTED_ERR: Ol, INUSE_ATTRIBUTE_ERR: 10, INVALID_STATE_ERR: ql, SYNTAX_ERR: Hl, INVALID_MODIFICATION_ERR: Pl, NAMESPACE_ERR: Bl, INVALID_ACCESS_ERR: Fl, VALIDATION_ERR: 16, TYPE_MISMATCH_ERR: Ul, SECURITY_ERR: Vl, NETWORK_ERR: zl, ABORT_ERR: jl, URL_MISMATCH_ERR: Gl, QUOTA_EXCEEDED_ERR: Wl, TIMEOUT_ERR: Yl, INVALID_NODE_TYPE_ERR: $l, DATA_CLONE_ERR: Kl };
  function Kr(e) {
    Error.call(this), Error.captureStackTrace(this, this.constructor), this.code = e, this.message = Ql[e], this.name = Xl[e];
  }
  Kr.prototype.__proto__ = Error.prototype;
  for ($r in Oi)
    Jn = { value: Oi[$r] }, Object.defineProperty(Kr, $r, Jn), Object.defineProperty(Kr.prototype, $r, Jn);
  var Jn, $r;
});
var Qr = O((Hi) => {
  Hi.isApiWritable = !global.__domino_frozen__;
});
var le = O((K) => {
  var he = Xr(), me = he, Zl = Qr().isApiWritable;
  K.NAMESPACE = { HTML: "http://www.w3.org/1999/xhtml", XML: "http://www.w3.org/XML/1998/namespace", XMLNS: "http://www.w3.org/2000/xmlns/", MATHML: "http://www.w3.org/1998/Math/MathML", SVG: "http://www.w3.org/2000/svg", XLINK: "http://www.w3.org/1999/xlink" };
  K.IndexSizeError = function() {
    throw new he(me.INDEX_SIZE_ERR);
  };
  K.HierarchyRequestError = function() {
    throw new he(me.HIERARCHY_REQUEST_ERR);
  };
  K.WrongDocumentError = function() {
    throw new he(me.WRONG_DOCUMENT_ERR);
  };
  K.InvalidCharacterError = function() {
    throw new he(me.INVALID_CHARACTER_ERR);
  };
  K.NoModificationAllowedError = function() {
    throw new he(me.NO_MODIFICATION_ALLOWED_ERR);
  };
  K.NotFoundError = function() {
    throw new he(me.NOT_FOUND_ERR);
  };
  K.NotSupportedError = function() {
    throw new he(me.NOT_SUPPORTED_ERR);
  };
  K.InvalidStateError = function() {
    throw new he(me.INVALID_STATE_ERR);
  };
  K.SyntaxError = function() {
    throw new he(me.SYNTAX_ERR);
  };
  K.InvalidModificationError = function() {
    throw new he(me.INVALID_MODIFICATION_ERR);
  };
  K.NamespaceError = function() {
    throw new he(me.NAMESPACE_ERR);
  };
  K.InvalidAccessError = function() {
    throw new he(me.INVALID_ACCESS_ERR);
  };
  K.TypeMismatchError = function() {
    throw new he(me.TYPE_MISMATCH_ERR);
  };
  K.SecurityError = function() {
    throw new he(me.SECURITY_ERR);
  };
  K.NetworkError = function() {
    throw new he(me.NETWORK_ERR);
  };
  K.AbortError = function() {
    throw new he(me.ABORT_ERR);
  };
  K.UrlMismatchError = function() {
    throw new he(me.URL_MISMATCH_ERR);
  };
  K.QuotaExceededError = function() {
    throw new he(me.QUOTA_EXCEEDED_ERR);
  };
  K.TimeoutError = function() {
    throw new he(me.TIMEOUT_ERR);
  };
  K.InvalidNodeTypeError = function() {
    throw new he(me.INVALID_NODE_TYPE_ERR);
  };
  K.DataCloneError = function() {
    throw new he(me.DATA_CLONE_ERR);
  };
  K.nyi = function() {
    throw new Error("NotYetImplemented");
  };
  K.shouldOverride = function() {
    throw new Error("Abstract function; should be overriding in subclass.");
  };
  K.assert = function(e, t) {
    if (!e)
      throw new Error("Assertion failed: " + (t || "") + `
` + new Error().stack);
  };
  K.expose = function(e, t) {
    for (var r in e)
      Object.defineProperty(t.prototype, r, { value: e[r], writable: Zl });
  };
  K.merge = function(e, t) {
    for (var r in t)
      e[r] = t[r];
  };
  K.escapeText = function(e) {
    return e;
  };
  K.documentOrder = function(e, t) {
    return 3 - (e.compareDocumentPosition(t) & 6);
  };
  K.toASCIILowerCase = function(e) {
    return e.replace(/[A-Z]+/g, function(t) {
      return t.toLowerCase();
    });
  };
  K.toASCIIUpperCase = function(e) {
    return e.replace(/[a-z]+/g, function(t) {
      return t.toUpperCase();
    });
  };
});
var ea = O((yf, Bi) => {
  var Rt = Vt(), Jl = Zn(), eu = le();
  Bi.exports = Pi;
  function Pi() {
  }
  Pi.prototype = { addEventListener: function(t, r, n) {
    if (!!r) {
      n === void 0 && (n = false), this._listeners || (this._listeners = /* @__PURE__ */ Object.create(null)), this._listeners[t] || (this._listeners[t] = []);
      for (var l = this._listeners[t], f = 0, _ = l.length; f < _; f++) {
        var y = l[f];
        if (y.listener === r && y.capture === n)
          return;
      }
      var w = { listener: r, capture: n };
      typeof r == "function" && (w.f = r), l.push(w);
    }
  }, removeEventListener: function(t, r, n) {
    if (n === void 0 && (n = false), this._listeners) {
      var l = this._listeners[t];
      if (l)
        for (var f = 0, _ = l.length; f < _; f++) {
          var y = l[f];
          if (y.listener === r && y.capture === n) {
            l.length === 1 ? this._listeners[t] = void 0 : l.splice(f, 1);
            return;
          }
        }
    }
  }, dispatchEvent: function(t) {
    return this._dispatchEvent(t, false);
  }, _dispatchEvent: function(t, r) {
    typeof r != "boolean" && (r = false);
    function n(S, M) {
      var ae = M.type, ce = M.eventPhase;
      if (M.currentTarget = S, ce !== Rt.CAPTURING_PHASE && S._handlers && S._handlers[ae]) {
        var g = S._handlers[ae], re;
        if (typeof g == "function")
          re = g.call(M.currentTarget, M);
        else {
          var $ = g.handleEvent;
          if (typeof $ != "function")
            throw new TypeError("handleEvent property of event handler object isnot a function.");
          re = $.call(g, M);
        }
        switch (M.type) {
          case "mouseover":
            re === true && M.preventDefault();
            break;
          case "beforeunload":
          default:
            re === false && M.preventDefault();
            break;
        }
      }
      var V = S._listeners && S._listeners[ae];
      if (!!V) {
        V = V.slice();
        for (var ve = 0, U = V.length; ve < U; ve++) {
          if (M._immediatePropagationStopped)
            return;
          var ie = V[ve];
          if (!(ce === Rt.CAPTURING_PHASE && !ie.capture || ce === Rt.BUBBLING_PHASE && ie.capture))
            if (ie.f)
              ie.f.call(M.currentTarget, M);
            else {
              var be = ie.listener.handleEvent;
              if (typeof be != "function")
                throw new TypeError("handleEvent property of event listener object is not a function.");
              be.call(ie.listener, M);
            }
        }
      }
    }
    (!t._initialized || t._dispatching) && eu.InvalidStateError(), t.isTrusted = r, t._dispatching = true, t.target = this;
    for (var l = [], f = this.parentNode; f; f = f.parentNode)
      l.push(f);
    t.eventPhase = Rt.CAPTURING_PHASE;
    for (var _ = l.length - 1; _ >= 0 && (n(l[_], t), !t._propagationStopped); _--)
      ;
    if (t._propagationStopped || (t.eventPhase = Rt.AT_TARGET, n(this, t)), t.bubbles && !t._propagationStopped) {
      t.eventPhase = Rt.BUBBLING_PHASE;
      for (var y = 0, w = l.length; y < w && (n(l[y], t), !t._propagationStopped); y++)
        ;
    }
    if (t._dispatching = false, t.eventPhase = Rt.AT_TARGET, t.currentTarget = null, r && !t.defaultPrevented && t instanceof Jl)
      switch (t.type) {
        case "mousedown":
          this._armed = { x: t.clientX, y: t.clientY, t: t.timeStamp };
          break;
        case "mouseout":
        case "mouseover":
          this._armed = null;
          break;
        case "mouseup":
          this._isClick(t) && this._doClick(t), this._armed = null;
          break;
      }
    return !t.defaultPrevented;
  }, _isClick: function(e) {
    return this._armed !== null && e.type === "mouseup" && e.isTrusted && e.button === 0 && e.timeStamp - this._armed.t < 1e3 && Math.abs(e.clientX - this._armed.x) < 10 && Math.abs(e.clientY - this._armed.Y) < 10;
  }, _doClick: function(e) {
    if (!this._click_in_progress) {
      this._click_in_progress = true;
      for (var t = this; t && !t._post_click_activation_steps; )
        t = t.parentNode;
      t && t._pre_click_activation_steps && t._pre_click_activation_steps();
      var r = this.ownerDocument.createEvent("MouseEvent");
      r.initMouseEvent("click", true, true, this.ownerDocument.defaultView, 1, e.screenX, e.screenY, e.clientX, e.clientY, e.ctrlKey, e.altKey, e.shiftKey, e.metaKey, e.button, null);
      var n = this._dispatchEvent(r, true);
      t && (n ? t._post_click_activation_steps && t._post_click_activation_steps(r) : t._cancelled_activation_steps && t._cancelled_activation_steps());
    }
  }, _setEventHandler: function(t, r) {
    this._handlers || (this._handlers = /* @__PURE__ */ Object.create(null)), this._handlers[t] = r;
  }, _getEventHandler: function(t) {
    return this._handlers && this._handlers[t] || null;
  } };
});
var ta = O((Tf, Fi) => {
  var ot = le(), ze = Fi.exports = { valid: function(e) {
    return ot.assert(e, "list falsy"), ot.assert(e._previousSibling, "previous falsy"), ot.assert(e._nextSibling, "next falsy"), true;
  }, insertBefore: function(e, t) {
    ot.assert(ze.valid(e) && ze.valid(t));
    var r = e, n = e._previousSibling, l = t, f = t._previousSibling;
    r._previousSibling = f, n._nextSibling = l, f._nextSibling = r, l._previousSibling = n, ot.assert(ze.valid(e) && ze.valid(t));
  }, replace: function(e, t) {
    ot.assert(ze.valid(e) && (t === null || ze.valid(t))), t !== null && ze.insertBefore(t, e), ze.remove(e), ot.assert(ze.valid(e) && (t === null || ze.valid(t)));
  }, remove: function(e) {
    ot.assert(ze.valid(e));
    var t = e._previousSibling;
    if (t !== e) {
      var r = e._nextSibling;
      t._nextSibling = r, r._previousSibling = t, e._previousSibling = e._nextSibling = e, ot.assert(ze.valid(e));
    }
  } };
});
var ra = O((wf, Vi) => {
  Vi.exports = { serializeOne: ou };
  var Ui = le(), Dt = Ui.NAMESPACE, tu = { STYLE: true, SCRIPT: true, XMP: true, IFRAME: true, NOEMBED: true, NOFRAMES: true, PLAINTEXT: true }, ru = { area: true, base: true, basefont: true, bgsound: true, br: true, col: true, embed: true, frame: true, hr: true, img: true, input: true, keygen: true, link: true, meta: true, param: true, source: true, track: true, wbr: true }, nu = {};
  function au(e) {
    return e.replace(/[&<>\u00A0]/g, function(t) {
      switch (t) {
        case "&":
          return "&amp;";
        case "<":
          return "&lt;";
        case ">":
          return "&gt;";
        case "\xA0":
          return "&nbsp;";
      }
    });
  }
  function iu(e) {
    var t = /[&"\u00A0]/g;
    return t.test(e) ? e.replace(t, function(r) {
      switch (r) {
        case "&":
          return "&amp;";
        case '"':
          return "&quot;";
        case "\xA0":
          return "&nbsp;";
      }
    }) : e;
  }
  function su(e) {
    var t = e.namespaceURI;
    return t ? t === Dt.XML ? "xml:" + e.localName : t === Dt.XLINK ? "xlink:" + e.localName : t === Dt.XMLNS ? e.localName === "xmlns" ? "xmlns" : "xmlns:" + e.localName : e.name : e.localName;
  }
  function ou(e, t) {
    var r = "";
    switch (e.nodeType) {
      case 1:
        var n = e.namespaceURI, l = n === Dt.HTML, f = l || n === Dt.SVG || n === Dt.MATHML ? e.localName : e.tagName;
        r += "<" + f;
        for (var _ = 0, y = e._numattrs; _ < y; _++) {
          var w = e._attr(_);
          r += " " + su(w), w.value !== void 0 && (r += '="' + iu(w.value) + '"');
        }
        if (r += ">", !(l && ru[f])) {
          var S = e.serialize();
          l && nu[f] && S.charAt(0) === `
` && (r += `
`), r += S, r += "</" + f + ">";
        }
        break;
      case 3:
      case 4:
        var M;
        t.nodeType === 1 && t.namespaceURI === Dt.HTML ? M = t.tagName : M = "", tu[M] || M === "NOSCRIPT" && t.ownerDocument._scripting_enabled ? r += e.data : r += au(e.data);
        break;
      case 8:
        r += "<!--" + e.data + "-->";
        break;
      case 7:
        r += "<?" + e.target + " " + e.data + "?>";
        break;
      case 10:
        r += "<!DOCTYPE " + e.name, r += ">";
        break;
      default:
        Ui.InvalidStateError();
    }
    return r;
  }
});
var Te = O((kf, $i) => {
  $i.exports = xe;
  var Yi = ea(), Zr = ta(), zi = ra(), J = le();
  function xe() {
    Yi.call(this), this.parentNode = null, this._nextSibling = this._previousSibling = this, this._index = void 0;
  }
  var Re = xe.ELEMENT_NODE = 1, na = xe.ATTRIBUTE_NODE = 2, Jr = xe.TEXT_NODE = 3, cu = xe.CDATA_SECTION_NODE = 4, lu = xe.ENTITY_REFERENCE_NODE = 5, aa = xe.ENTITY_NODE = 6, ji = xe.PROCESSING_INSTRUCTION_NODE = 7, Gi = xe.COMMENT_NODE = 8, dr = xe.DOCUMENT_NODE = 9, je = xe.DOCUMENT_TYPE_NODE = 10, vt = xe.DOCUMENT_FRAGMENT_NODE = 11, ia = xe.NOTATION_NODE = 12, sa = xe.DOCUMENT_POSITION_DISCONNECTED = 1, oa = xe.DOCUMENT_POSITION_PRECEDING = 2, ca = xe.DOCUMENT_POSITION_FOLLOWING = 4, Wi = xe.DOCUMENT_POSITION_CONTAINS = 8, la = xe.DOCUMENT_POSITION_CONTAINED_BY = 16, ua = xe.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC = 32;
  xe.prototype = Object.create(Yi.prototype, { baseURI: { get: J.nyi }, parentElement: { get: function() {
    return this.parentNode && this.parentNode.nodeType === Re ? this.parentNode : null;
  } }, hasChildNodes: { value: J.shouldOverride }, firstChild: { get: J.shouldOverride }, lastChild: { get: J.shouldOverride }, previousSibling: { get: function() {
    var e = this.parentNode;
    return !e || this === e.firstChild ? null : this._previousSibling;
  } }, nextSibling: { get: function() {
    var e = this.parentNode, t = this._nextSibling;
    return !e || t === e.firstChild ? null : t;
  } }, textContent: { get: function() {
    return null;
  }, set: function(e) {
  } }, _countChildrenOfType: { value: function(e) {
    for (var t = 0, r = this.firstChild; r !== null; r = r.nextSibling)
      r.nodeType === e && t++;
    return t;
  } }, _ensureInsertValid: { value: function(t, r, n) {
    var l = this, f, _;
    if (!t.nodeType)
      throw new TypeError("not a node");
    switch (l.nodeType) {
      case dr:
      case vt:
      case Re:
        break;
      default:
        J.HierarchyRequestError();
    }
    switch (t.isAncestor(l) && J.HierarchyRequestError(), (r !== null || !n) && r.parentNode !== l && J.NotFoundError(), t.nodeType) {
      case vt:
      case je:
      case Re:
      case Jr:
      case ji:
      case Gi:
        break;
      default:
        J.HierarchyRequestError();
    }
    if (l.nodeType === dr)
      switch (t.nodeType) {
        case Jr:
          J.HierarchyRequestError();
          break;
        case vt:
          switch (t._countChildrenOfType(Jr) > 0 && J.HierarchyRequestError(), t._countChildrenOfType(Re)) {
            case 0:
              break;
            case 1:
              if (r !== null)
                for (n && r.nodeType === je && J.HierarchyRequestError(), _ = r.nextSibling; _ !== null; _ = _.nextSibling)
                  _.nodeType === je && J.HierarchyRequestError();
              f = l._countChildrenOfType(Re), n ? f > 0 && J.HierarchyRequestError() : (f > 1 || f === 1 && r.nodeType !== Re) && J.HierarchyRequestError();
              break;
            default:
              J.HierarchyRequestError();
          }
          break;
        case Re:
          if (r !== null)
            for (n && r.nodeType === je && J.HierarchyRequestError(), _ = r.nextSibling; _ !== null; _ = _.nextSibling)
              _.nodeType === je && J.HierarchyRequestError();
          f = l._countChildrenOfType(Re), n ? f > 0 && J.HierarchyRequestError() : (f > 1 || f === 1 && r.nodeType !== Re) && J.HierarchyRequestError();
          break;
        case je:
          if (r === null)
            l._countChildrenOfType(Re) && J.HierarchyRequestError();
          else
            for (_ = l.firstChild; _ !== null && _ !== r; _ = _.nextSibling)
              _.nodeType === Re && J.HierarchyRequestError();
          f = l._countChildrenOfType(je), n ? f > 0 && J.HierarchyRequestError() : (f > 1 || f === 1 && r.nodeType !== je) && J.HierarchyRequestError();
          break;
      }
    else
      t.nodeType === je && J.HierarchyRequestError();
  } }, insertBefore: { value: function(t, r) {
    var n = this;
    n._ensureInsertValid(t, r, true);
    var l = r;
    return l === t && (l = t.nextSibling), n.doc.adoptNode(t), t._insertOrReplace(n, l, false), t;
  } }, appendChild: { value: function(e) {
    return this.insertBefore(e, null);
  } }, _appendChild: { value: function(e) {
    e._insertOrReplace(this, null, false);
  } }, removeChild: { value: function(t) {
    var r = this;
    if (!t.nodeType)
      throw new TypeError("not a node");
    return t.parentNode !== r && J.NotFoundError(), t.remove(), t;
  } }, replaceChild: { value: function(t, r) {
    var n = this;
    return n._ensureInsertValid(t, r, false), t.doc !== n.doc && n.doc.adoptNode(t), t._insertOrReplace(n, r, true), r;
  } }, contains: { value: function(t) {
    return t === null ? false : this === t ? true : (this.compareDocumentPosition(t) & la) !== 0;
  } }, compareDocumentPosition: { value: function(t) {
    if (this === t)
      return 0;
    if (this.doc !== t.doc || this.rooted !== t.rooted)
      return sa + ua;
    for (var r = [], n = [], l = this; l !== null; l = l.parentNode)
      r.push(l);
    for (l = t; l !== null; l = l.parentNode)
      n.push(l);
    if (r.reverse(), n.reverse(), r[0] !== n[0])
      return sa + ua;
    l = Math.min(r.length, n.length);
    for (var f = 1; f < l; f++)
      if (r[f] !== n[f])
        return r[f].index < n[f].index ? ca : oa;
    return r.length < n.length ? ca + la : oa + Wi;
  } }, isSameNode: { value: function(t) {
    return this === t;
  } }, isEqualNode: { value: function(t) {
    if (!t || t.nodeType !== this.nodeType || !this.isEqual(t))
      return false;
    for (var r = this.firstChild, n = t.firstChild; r && n; r = r.nextSibling, n = n.nextSibling)
      if (!r.isEqualNode(n))
        return false;
    return r === null && n === null;
  } }, cloneNode: { value: function(e) {
    var t = this.clone();
    if (e)
      for (var r = this.firstChild; r !== null; r = r.nextSibling)
        t._appendChild(r.cloneNode(true));
    return t;
  } }, lookupPrefix: { value: function(t) {
    var r;
    if (t === "" || t === null || t === void 0)
      return null;
    switch (this.nodeType) {
      case Re:
        return this._lookupNamespacePrefix(t, this);
      case dr:
        return r = this.documentElement, r ? r.lookupPrefix(t) : null;
      case aa:
      case ia:
      case vt:
      case je:
        return null;
      case na:
        return r = this.ownerElement, r ? r.lookupPrefix(t) : null;
      default:
        return r = this.parentElement, r ? r.lookupPrefix(t) : null;
    }
  } }, lookupNamespaceURI: { value: function(t) {
    (t === "" || t === void 0) && (t = null);
    var r;
    switch (this.nodeType) {
      case Re:
        return J.shouldOverride();
      case dr:
        return r = this.documentElement, r ? r.lookupNamespaceURI(t) : null;
      case aa:
      case ia:
      case je:
      case vt:
        return null;
      case na:
        return r = this.ownerElement, r ? r.lookupNamespaceURI(t) : null;
      default:
        return r = this.parentElement, r ? r.lookupNamespaceURI(t) : null;
    }
  } }, isDefaultNamespace: { value: function(t) {
    (t === "" || t === void 0) && (t = null);
    var r = this.lookupNamespaceURI(null);
    return r === t;
  } }, index: { get: function() {
    var e = this.parentNode;
    if (this === e.firstChild)
      return 0;
    var t = e.childNodes;
    if (this._index === void 0 || t[this._index] !== this) {
      for (var r = 0; r < t.length; r++)
        t[r]._index = r;
      J.assert(t[this._index] === this);
    }
    return this._index;
  } }, isAncestor: { value: function(e) {
    if (this.doc !== e.doc || this.rooted !== e.rooted)
      return false;
    for (var t = e; t; t = t.parentNode)
      if (t === this)
        return true;
    return false;
  } }, ensureSameDoc: { value: function(e) {
    e.ownerDocument === null ? e.ownerDocument = this.doc : e.ownerDocument !== this.doc && J.WrongDocumentError();
  } }, removeChildren: { value: J.shouldOverride }, _insertOrReplace: { value: function(t, r, n) {
    var l = this, f, _;
    if (l.nodeType === vt && l.rooted && J.HierarchyRequestError(), t._childNodes && (f = r === null ? t._childNodes.length : r.index, l.parentNode === t)) {
      var y = l.index;
      y < f && f--;
    }
    n && (r.rooted && r.doc.mutateRemove(r), r.parentNode = null);
    var w = r;
    w === null && (w = t.firstChild);
    var S = l.rooted && t.rooted;
    if (l.nodeType === vt) {
      for (var M = [0, n ? 1 : 0], ae, ce = l.firstChild; ce !== null; ce = ae)
        ae = ce.nextSibling, M.push(ce), ce.parentNode = t;
      var g = M.length;
      if (n ? Zr.replace(w, g > 2 ? M[2] : null) : g > 2 && w !== null && Zr.insertBefore(M[2], w), t._childNodes)
        for (M[0] = r === null ? t._childNodes.length : r._index, t._childNodes.splice.apply(t._childNodes, M), _ = 2; _ < g; _++)
          M[_]._index = M[0] + (_ - 2);
      else
        t._firstChild === r && (g > 2 ? t._firstChild = M[2] : n && (t._firstChild = null));
      if (l._childNodes ? l._childNodes.length = 0 : l._firstChild = null, t.rooted)
        for (t.modify(), _ = 2; _ < g; _++)
          t.doc.mutateInsert(M[_]);
    } else {
      if (r === l)
        return;
      S ? l._remove() : l.parentNode && l.remove(), l.parentNode = t, n ? (Zr.replace(w, l), t._childNodes ? (l._index = f, t._childNodes[f] = l) : t._firstChild === r && (t._firstChild = l)) : (w !== null && Zr.insertBefore(l, w), t._childNodes ? (l._index = f, t._childNodes.splice(f, 0, l)) : t._firstChild === r && (t._firstChild = l)), S ? (t.modify(), t.doc.mutateMove(l)) : t.rooted && (t.modify(), t.doc.mutateInsert(l));
    }
  } }, lastModTime: { get: function() {
    return this._lastModTime || (this._lastModTime = this.doc.modclock), this._lastModTime;
  } }, modify: { value: function() {
    if (this.doc.modclock)
      for (var e = ++this.doc.modclock, t = this; t; t = t.parentElement)
        t._lastModTime && (t._lastModTime = e);
  } }, doc: { get: function() {
    return this.ownerDocument || this;
  } }, rooted: { get: function() {
    return !!this._nid;
  } }, normalize: { value: function() {
    for (var e, t = this.firstChild; t !== null; t = e)
      if (e = t.nextSibling, t.normalize && t.normalize(), t.nodeType === xe.TEXT_NODE) {
        if (t.nodeValue === "") {
          this.removeChild(t);
          continue;
        }
        var r = t.previousSibling;
        r !== null && r.nodeType === xe.TEXT_NODE && (r.appendData(t.nodeValue), this.removeChild(t));
      }
  } }, serialize: { value: function() {
    if (this._innerHTML)
      return this._innerHTML;
    for (var e = "", t = this.firstChild; t !== null; t = t.nextSibling)
      e += zi.serializeOne(t, this);
    return e;
  } }, outerHTML: { get: function() {
    return zi.serializeOne(this, { nodeType: 0 });
  }, set: J.nyi }, ELEMENT_NODE: { value: Re }, ATTRIBUTE_NODE: { value: na }, TEXT_NODE: { value: Jr }, CDATA_SECTION_NODE: { value: cu }, ENTITY_REFERENCE_NODE: { value: lu }, ENTITY_NODE: { value: aa }, PROCESSING_INSTRUCTION_NODE: { value: ji }, COMMENT_NODE: { value: Gi }, DOCUMENT_NODE: { value: dr }, DOCUMENT_TYPE_NODE: { value: je }, DOCUMENT_FRAGMENT_NODE: { value: vt }, NOTATION_NODE: { value: ia }, DOCUMENT_POSITION_DISCONNECTED: { value: sa }, DOCUMENT_POSITION_PRECEDING: { value: oa }, DOCUMENT_POSITION_FOLLOWING: { value: ca }, DOCUMENT_POSITION_CONTAINS: { value: Wi }, DOCUMENT_POSITION_CONTAINED_BY: { value: la }, DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC: { value: ua } });
});
var Xi = O((Nf, Ki) => {
  Ki.exports = class extends Array {
    constructor(t) {
      if (super(t && t.length || 0), t)
        for (var r in t)
          this[r] = t[r];
    }
    item(t) {
      return this[t] || null;
    }
  };
});
var Zi = O((Cf, Qi) => {
  function uu(e) {
    return this[e] || null;
  }
  function fu(e) {
    return e || (e = []), e.item = uu, e;
  }
  Qi.exports = fu;
});
var It = O((Lf, Ji) => {
  var fa;
  try {
    fa = Xi();
  } catch (e) {
    fa = Zi();
  }
  Ji.exports = fa;
});
var en = O((Af, rs) => {
  rs.exports = ts;
  var es = Te(), du = It();
  function ts() {
    es.call(this), this._firstChild = this._childNodes = null;
  }
  ts.prototype = Object.create(es.prototype, { hasChildNodes: { value: function() {
    return this._childNodes ? this._childNodes.length > 0 : this._firstChild !== null;
  } }, childNodes: { get: function() {
    return this._ensureChildNodes(), this._childNodes;
  } }, firstChild: { get: function() {
    return this._childNodes ? this._childNodes.length === 0 ? null : this._childNodes[0] : this._firstChild;
  } }, lastChild: { get: function() {
    var e = this._childNodes, t;
    return e ? e.length === 0 ? null : e[e.length - 1] : (t = this._firstChild, t === null ? null : t._previousSibling);
  } }, _ensureChildNodes: { value: function() {
    if (!this._childNodes) {
      var e = this._firstChild, t = e, r = this._childNodes = new du();
      if (e)
        do
          r.push(t), t = t._nextSibling;
        while (t !== e);
      this._firstChild = null;
    }
  } }, removeChildren: { value: function() {
    for (var t = this.rooted ? this.ownerDocument : null, r = this.firstChild, n; r !== null; )
      n = r, r = n.nextSibling, t && t.mutateRemove(n), n.parentNode = null;
    this._childNodes ? this._childNodes.length = 0 : this._firstChild = null, this.modify();
  } } });
});
var tn = O((xa) => {
  xa.isValidName = _u;
  xa.isValidQName = Eu;
  var hu = /^[_:A-Za-z][-.:\w]+$/, xu = /^([_A-Za-z][-.\w]+|[_A-Za-z][-.\w]+:[_A-Za-z][-.\w]+)$/, hr = "_A-Za-z\xC0-\xD6\xD8-\xF6\xF8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD", xr = "-._A-Za-z0-9\xB7\xC0-\xD6\xD8-\xF6\xF8-\u02FF\u0300-\u037D\u037F-\u1FFF\u200C\u200D\u203F\u2040\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD", Ot = "[" + hr + "][" + xr + "]*", da = hr + ":", ha = xr + ":", pu = new RegExp("^[" + da + "][" + ha + "]*$"), mu = new RegExp("^(" + Ot + "|" + Ot + ":" + Ot + ")$"), ns = /[\uD800-\uDB7F\uDC00-\uDFFF]/, as = /[\uD800-\uDB7F\uDC00-\uDFFF]/g, is = /[\uD800-\uDB7F][\uDC00-\uDFFF]/g;
  hr += "\uD800-\u{EFC00}-\uDFFF";
  xr += "\uD800-\u{EFC00}-\uDFFF";
  Ot = "[" + hr + "][" + xr + "]*";
  da = hr + ":";
  ha = xr + ":";
  var gu = new RegExp("^[" + da + "][" + ha + "]*$"), bu = new RegExp("^(" + Ot + "|" + Ot + ":" + Ot + ")$");
  function _u(e) {
    if (hu.test(e) || pu.test(e))
      return true;
    if (!ns.test(e) || !gu.test(e))
      return false;
    var t = e.match(as), r = e.match(is);
    return r !== null && 2 * r.length === t.length;
  }
  function Eu(e) {
    if (xu.test(e) || mu.test(e))
      return true;
    if (!ns.test(e) || !bu.test(e))
      return false;
    var t = e.match(as), r = e.match(is);
    return r !== null && 2 * r.length === t.length;
  }
});
var ma = O((pa) => {
  var ss = le();
  pa.property = function(e) {
    if (Array.isArray(e.type)) {
      var t = /* @__PURE__ */ Object.create(null);
      e.type.forEach(function(l) {
        t[l.value || l] = l.alias || l;
      });
      var r = e.missing;
      r === void 0 && (r = null);
      var n = e.invalid;
      return n === void 0 && (n = r), { get: function() {
        var l = this._getattr(e.name);
        return l === null ? r : (l = t[l.toLowerCase()], l !== void 0 ? l : n !== null ? n : l);
      }, set: function(l) {
        this._setattr(e.name, l);
      } };
    } else {
      if (e.type === Boolean)
        return { get: function() {
          return this.hasAttribute(e.name);
        }, set: function(l) {
          l ? this._setattr(e.name, "") : this.removeAttribute(e.name);
        } };
      if (e.type === Number || e.type === "long" || e.type === "unsigned long" || e.type === "limited unsigned long with fallback")
        return vu(e);
      if (!e.type || e.type === String)
        return { get: function() {
          return this._getattr(e.name) || "";
        }, set: function(l) {
          e.treatNullAsEmptyString && l === null && (l = ""), this._setattr(e.name, l);
        } };
      if (typeof e.type == "function")
        return e.type(e.name, e);
    }
    throw new Error("Invalid attribute definition");
  };
  function vu(e) {
    var t;
    typeof e.default == "function" ? t = e.default : typeof e.default == "number" ? t = function() {
      return e.default;
    } : t = function() {
      ss.assert(false, typeof e.default);
    };
    var r = e.type === "unsigned long", n = e.type === "long", l = e.type === "limited unsigned long with fallback", f = e.min, _ = e.max, y = e.setmin;
    return f === void 0 && (r && (f = 0), n && (f = -2147483648), l && (f = 1)), _ === void 0 && (r || n || l) && (_ = 2147483647), { get: function() {
      var w = this._getattr(e.name), S = e.float ? parseFloat(w) : parseInt(w, 10);
      if (w === null || !isFinite(S) || f !== void 0 && S < f || _ !== void 0 && S > _)
        return t.call(this);
      if (r || n || l) {
        if (!/^[ \t\n\f\r]*[-+]?[0-9]/.test(w))
          return t.call(this);
        S = S | 0;
      }
      return S;
    }, set: function(w) {
      e.float || (w = Math.floor(w)), y !== void 0 && w < y && ss.IndexSizeError(e.name + " set to " + w), r ? w = w < 0 || w > 2147483647 ? t.call(this) : w | 0 : l ? w = w < 1 || w > 2147483647 ? t.call(this) : w | 0 : n && (w = w < -2147483648 || w > 2147483647 ? t.call(this) : w | 0), this._setattr(e.name, String(w));
    } };
  }
  pa.registerChangeHandler = function(e, t, r) {
    var n = e.prototype;
    Object.prototype.hasOwnProperty.call(n, "_attributeChangeHandlers") || (n._attributeChangeHandlers = Object.create(n._attributeChangeHandlers || null)), n._attributeChangeHandlers[t] = r;
  };
});
var ls = O((Df, cs) => {
  cs.exports = os;
  var yu = Te();
  function os(e, t) {
    this.root = e, this.filter = t, this.lastModTime = e.lastModTime, this.done = false, this.cache = [], this.traverse();
  }
  os.prototype = Object.create(Object.prototype, { length: { get: function() {
    return this.checkcache(), this.done || this.traverse(), this.cache.length;
  } }, item: { value: function(e) {
    return this.checkcache(), !this.done && e >= this.cache.length && this.traverse(), this.cache[e];
  } }, checkcache: { value: function() {
    if (this.lastModTime !== this.root.lastModTime) {
      for (var e = this.cache.length - 1; e >= 0; e--)
        this[e] = void 0;
      this.cache.length = 0, this.done = false, this.lastModTime = this.root.lastModTime;
    }
  } }, traverse: { value: function(e) {
    e !== void 0 && e++;
    for (var t; (t = this.next()) !== null; )
      if (this[this.cache.length] = t, this.cache.push(t), e && this.cache.length === e)
        return;
    this.done = true;
  } }, next: { value: function() {
    var e = this.cache.length === 0 ? this.root : this.cache[this.cache.length - 1], t;
    for (e.nodeType === yu.DOCUMENT_NODE ? t = e.documentElement : t = e.nextElement(this.root); t; ) {
      if (this.filter(t))
        return t;
      t = t.nextElement(this.root);
    }
    return null;
  } } });
});
var ba = O((If, ds) => {
  var ga = le();
  ds.exports = fs;
  function fs(e, t) {
    this._getString = e, this._setString = t, this._length = 0, this._lastStringValue = "", this._update();
  }
  Object.defineProperties(fs.prototype, { length: { get: function() {
    return this._length;
  } }, item: { value: function(e) {
    var t = zt(this);
    return e < 0 || e >= t.length ? null : t[e];
  } }, contains: { value: function(e) {
    e = String(e);
    var t = zt(this);
    return t.indexOf(e) > -1;
  } }, add: { value: function() {
    for (var e = zt(this), t = 0, r = arguments.length; t < r; t++) {
      var n = pr(arguments[t]);
      e.indexOf(n) < 0 && e.push(n);
    }
    this._update(e);
  } }, remove: { value: function() {
    for (var e = zt(this), t = 0, r = arguments.length; t < r; t++) {
      var n = pr(arguments[t]), l = e.indexOf(n);
      l > -1 && e.splice(l, 1);
    }
    this._update(e);
  } }, toggle: { value: function(t, r) {
    return t = pr(t), this.contains(t) ? r === void 0 || r === false ? (this.remove(t), false) : true : r === void 0 || r === true ? (this.add(t), true) : false;
  } }, replace: { value: function(t, r) {
    String(r) === "" && ga.SyntaxError(), t = pr(t), r = pr(r);
    var n = zt(this), l = n.indexOf(t);
    if (l < 0)
      return false;
    var f = n.indexOf(r);
    return f < 0 ? n[l] = r : l < f ? (n[l] = r, n.splice(f, 1)) : n.splice(l, 1), this._update(n), true;
  } }, toString: { value: function() {
    return this._getString();
  } }, value: { get: function() {
    return this._getString();
  }, set: function(e) {
    this._setString(e), this._update();
  } }, _update: { value: function(e) {
    e ? (us(this, e), this._setString(e.join(" ").trim())) : us(this, zt(this)), this._lastStringValue = this._getString();
  } } });
  function us(e, t) {
    var r = e._length, n;
    for (e._length = t.length, n = 0; n < t.length; n++)
      e[n] = t[n];
    for (; n < r; n++)
      e[n] = void 0;
  }
  function pr(e) {
    return e = String(e), e === "" && ga.SyntaxError(), /[ \t\r\n\f]/.test(e) && ga.InvalidCharacterError(), e;
  }
  function Tu(e) {
    for (var t = e._length, r = Array(t), n = 0; n < t; n++)
      r[n] = e[n];
    return r;
  }
  function zt(e) {
    var t = e._getString();
    if (t === e._lastStringValue)
      return Tu(e);
    var r = t.replace(/(^[ \t\r\n\f]+)|([ \t\r\n\f]+$)/g, "");
    if (r === "")
      return [];
    var n = /* @__PURE__ */ Object.create(null);
    return r.split(/[ \t\r\n\f]+/g).filter(function(l) {
      var f = "$" + l;
      return n[f] ? false : (n[f] = true, true);
    });
  }
});
var sn = O((Wt, bs) => {
  var rn = Object.create(null, { location: { get: function() {
    throw new Error("window.location is not supported.");
  } } }), wu = function(e, t) {
    return e.compareDocumentPosition(t);
  }, ku = function(e, t) {
    return wu(e, t) & 2 ? 1 : -1;
  }, an = function(e) {
    for (; (e = e.nextSibling) && e.nodeType !== 1; )
      ;
    return e;
  }, Gt = function(e) {
    for (; (e = e.previousSibling) && e.nodeType !== 1; )
      ;
    return e;
  }, Su = function(e) {
    if (e = e.firstChild)
      for (; e.nodeType !== 1 && (e = e.nextSibling); )
        ;
    return e;
  }, Nu = function(e) {
    if (e = e.lastChild)
      for (; e.nodeType !== 1 && (e = e.previousSibling); )
        ;
    return e;
  }, jt = function(e) {
    if (!e.parentNode)
      return false;
    var t = e.parentNode.nodeType;
    return t === 1 || t === 9;
  }, hs = function(e) {
    if (!e)
      return e;
    var t = e[0];
    return t === '"' || t === "'" ? (e[e.length - 1] === t ? e = e.slice(1, -1) : e = e.slice(1), e.replace(B.str_escape, function(r) {
      var n = /^\\(?:([0-9A-Fa-f]+)|([\r\n\f]+))/.exec(r);
      if (!n)
        return r.slice(1);
      if (n[2])
        return "";
      var l = parseInt(n[1], 16);
      return String.fromCodePoint ? String.fromCodePoint(l) : String.fromCharCode(l);
    })) : B.ident.test(e) ? yt(e) : e;
  }, yt = function(e) {
    return e.replace(B.escape, function(t) {
      var r = /^\\([0-9A-Fa-f]+)/.exec(t);
      if (!r)
        return t[1];
      var n = parseInt(r[1], 16);
      return String.fromCodePoint ? String.fromCodePoint(n) : String.fromCharCode(n);
    });
  }, Cu = function() {
    return Array.prototype.indexOf ? Array.prototype.indexOf : function(e, t) {
      for (var r = this.length; r--; )
        if (this[r] === t)
          return r;
      return -1;
    };
  }(), ps = function(e, t) {
    var r = B.inside.source.replace(/</g, e).replace(/>/g, t);
    return new RegExp(r);
  }, De = function(e, t, r) {
    return e = e.source, e = e.replace(t, r.source || r), new RegExp(e);
  }, xs = function(e, t) {
    return e.replace(/^(?:\w+:\/\/|\/+)/, "").replace(/(?:\/+|\/*#.*?)$/, "").split("/", t).join("/");
  }, Lu = function(e, t) {
    var r = e.replace(/\s+/g, ""), n;
    return r === "even" ? r = "2n+0" : r === "odd" ? r = "2n+1" : r.indexOf("n") === -1 && (r = "0n" + r), n = /^([+-])?(\d+)?n([+-])?(\d+)?$/.exec(r), { group: n[1] === "-" ? -(n[2] || 1) : +(n[2] || 1), offset: n[4] ? n[3] === "-" ? -n[4] : +n[4] : 0 };
  }, _a = function(e, t, r) {
    var n = Lu(e), l = n.group, f = n.offset, _ = r ? Nu : Su, y = r ? Gt : an;
    return function(w) {
      if (!!jt(w))
        for (var S = _(w.parentNode), M = 0; S; ) {
          if (t(S, w) && M++, S === w)
            return M -= f, l && M ? M % l === 0 && M < 0 == l < 0 : !M;
          S = y(S);
        }
    };
  }, _e = { "*": function() {
    return function() {
      return true;
    };
  }(), type: function(e) {
    return e = e.toLowerCase(), function(t) {
      return t.nodeName.toLowerCase() === e;
    };
  }, attr: function(e, t, r, n) {
    return t = ms[t], function(l) {
      var f;
      switch (e) {
        case "for":
          f = l.htmlFor;
          break;
        case "class":
          f = l.className, f === "" && l.getAttribute("class") == null && (f = null);
          break;
        case "href":
        case "src":
          f = l.getAttribute(e, 2);
          break;
        case "title":
          f = l.getAttribute("title") || null;
          break;
        case "id":
        case "lang":
        case "dir":
        case "accessKey":
        case "hidden":
        case "tabIndex":
        case "style":
          if (l.getAttribute) {
            f = l.getAttribute(e);
            break;
          }
        default:
          if (l.hasAttribute && !l.hasAttribute(e))
            break;
          f = l[e] != null ? l[e] : l.getAttribute && l.getAttribute(e);
          break;
      }
      if (f != null)
        return f = f + "", n && (f = f.toLowerCase(), r = r.toLowerCase()), t(f, r);
    };
  }, ":first-child": function(e) {
    return !Gt(e) && jt(e);
  }, ":last-child": function(e) {
    return !an(e) && jt(e);
  }, ":only-child": function(e) {
    return !Gt(e) && !an(e) && jt(e);
  }, ":nth-child": function(e, t) {
    return _a(e, function() {
      return true;
    }, t);
  }, ":nth-last-child": function(e) {
    return _e[":nth-child"](e, true);
  }, ":root": function(e) {
    return e.ownerDocument.documentElement === e;
  }, ":empty": function(e) {
    return !e.firstChild;
  }, ":not": function(e) {
    var t = va(e);
    return function(r) {
      return !t(r);
    };
  }, ":first-of-type": function(e) {
    if (!!jt(e)) {
      for (var t = e.nodeName; e = Gt(e); )
        if (e.nodeName === t)
          return;
      return true;
    }
  }, ":last-of-type": function(e) {
    if (!!jt(e)) {
      for (var t = e.nodeName; e = an(e); )
        if (e.nodeName === t)
          return;
      return true;
    }
  }, ":only-of-type": function(e) {
    return _e[":first-of-type"](e) && _e[":last-of-type"](e);
  }, ":nth-of-type": function(e, t) {
    return _a(e, function(r, n) {
      return r.nodeName === n.nodeName;
    }, t);
  }, ":nth-last-of-type": function(e) {
    return _e[":nth-of-type"](e, true);
  }, ":checked": function(e) {
    return !!(e.checked || e.selected);
  }, ":indeterminate": function(e) {
    return !_e[":checked"](e);
  }, ":enabled": function(e) {
    return !e.disabled && e.type !== "hidden";
  }, ":disabled": function(e) {
    return !!e.disabled;
  }, ":target": function(e) {
    return e.id === rn.location.hash.substring(1);
  }, ":focus": function(e) {
    return e === e.ownerDocument.activeElement;
  }, ":is": function(e) {
    return va(e);
  }, ":matches": function(e) {
    return _e[":is"](e);
  }, ":nth-match": function(e, t) {
    var r = e.split(/\s*,\s*/), n = r.shift(), l = va(r.join(","));
    return _a(n, l, t);
  }, ":nth-last-match": function(e) {
    return _e[":nth-match"](e, true);
  }, ":links-here": function(e) {
    return e + "" == rn.location + "";
  }, ":lang": function(e) {
    return function(t) {
      for (; t; ) {
        if (t.lang)
          return t.lang.indexOf(e) === 0;
        t = t.parentNode;
      }
    };
  }, ":dir": function(e) {
    return function(t) {
      for (; t; ) {
        if (t.dir)
          return t.dir === e;
        t = t.parentNode;
      }
    };
  }, ":scope": function(e, t) {
    var r = t || e.ownerDocument;
    return r.nodeType === 9 ? e === r.documentElement : e === r;
  }, ":any-link": function(e) {
    return typeof e.href == "string";
  }, ":local-link": function(e) {
    if (e.nodeName)
      return e.href && e.host === rn.location.host;
    var t = +e + 1;
    return function(r) {
      if (!!r.href) {
        var n = rn.location + "", l = r + "";
        return xs(n, t) === xs(l, t);
      }
    };
  }, ":default": function(e) {
    return !!e.defaultSelected;
  }, ":valid": function(e) {
    return e.willValidate || e.validity && e.validity.valid;
  }, ":invalid": function(e) {
    return !_e[":valid"](e);
  }, ":in-range": function(e) {
    return e.value > e.min && e.value <= e.max;
  }, ":out-of-range": function(e) {
    return !_e[":in-range"](e);
  }, ":required": function(e) {
    return !!e.required;
  }, ":optional": function(e) {
    return !e.required;
  }, ":read-only": function(e) {
    if (e.readOnly)
      return true;
    var t = e.getAttribute("contenteditable"), r = e.contentEditable, n = e.nodeName.toLowerCase();
    return n = n !== "input" && n !== "textarea", (n || e.disabled) && t == null && r !== "true";
  }, ":read-write": function(e) {
    return !_e[":read-only"](e);
  }, ":hover": function() {
    throw new Error(":hover is not supported.");
  }, ":active": function() {
    throw new Error(":active is not supported.");
  }, ":link": function() {
    throw new Error(":link is not supported.");
  }, ":visited": function() {
    throw new Error(":visited is not supported.");
  }, ":column": function() {
    throw new Error(":column is not supported.");
  }, ":nth-column": function() {
    throw new Error(":nth-column is not supported.");
  }, ":nth-last-column": function() {
    throw new Error(":nth-last-column is not supported.");
  }, ":current": function() {
    throw new Error(":current is not supported.");
  }, ":past": function() {
    throw new Error(":past is not supported.");
  }, ":future": function() {
    throw new Error(":future is not supported.");
  }, ":contains": function(e) {
    return function(t) {
      var r = t.innerText || t.textContent || t.value || "";
      return r.indexOf(e) !== -1;
    };
  }, ":has": function(e) {
    return function(t) {
      return gs(e, t).length > 0;
    };
  } }, ms = { "-": function() {
    return true;
  }, "=": function(e, t) {
    return e === t;
  }, "*=": function(e, t) {
    return e.indexOf(t) !== -1;
  }, "~=": function(e, t) {
    var r, n, l, f;
    for (n = 0; ; n = r + 1) {
      if (r = e.indexOf(t, n), r === -1)
        return false;
      if (l = e[r - 1], f = e[r + t.length], (!l || l === " ") && (!f || f === " "))
        return true;
    }
  }, "|=": function(e, t) {
    var r = e.indexOf(t), n;
    if (r === 0)
      return n = e[r + t.length], n === "-" || !n;
  }, "^=": function(e, t) {
    return e.indexOf(t) === 0;
  }, "$=": function(e, t) {
    var r = e.lastIndexOf(t);
    return r !== -1 && r + t.length === e.length;
  }, "!=": function(e, t) {
    return e !== t;
  } }, mr = { " ": function(e) {
    return function(t) {
      for (; t = t.parentNode; )
        if (e(t))
          return t;
    };
  }, ">": function(e) {
    return function(t) {
      if (t = t.parentNode)
        return e(t) && t;
    };
  }, "+": function(e) {
    return function(t) {
      if (t = Gt(t))
        return e(t) && t;
    };
  }, "~": function(e) {
    return function(t) {
      for (; t = Gt(t); )
        if (e(t))
          return t;
    };
  }, noop: function(e) {
    return function(t) {
      return e(t) && t;
    };
  }, ref: function(e, t) {
    var r;
    function n(l) {
      for (var f = l.ownerDocument, _ = f.getElementsByTagName("*"), y = _.length; y--; )
        if (r = _[y], n.test(l))
          return r = null, true;
      r = null;
    }
    return n.combinator = function(l) {
      if (!(!r || !r.getAttribute)) {
        var f = r.getAttribute(t) || "";
        if (f[0] === "#" && (f = f.substring(1)), f === l.id && e(r))
          return r;
      }
    }, n;
  } }, B = { escape: /\\(?:[^0-9A-Fa-f\r\n]|[0-9A-Fa-f]{1,6}[\r\n\t ]?)/g, str_escape: /(escape)|\\(\n|\r\n?|\f)/g, nonascii: /[\u00A0-\uFFFF]/, cssid: /(?:(?!-?[0-9])(?:escape|nonascii|[-_a-zA-Z0-9])+)/, qname: /^ *(cssid|\*)/, simple: /^(?:([.#]cssid)|pseudo|attr)/, ref: /^ *\/(cssid)\/ */, combinator: /^(?: +([^ \w*.#\\]) +|( )+|([^ \w*.#\\]))(?! *$)/, attr: /^\[(cssid)(?:([^\w]?=)(inside))?\]/, pseudo: /^(:cssid)(?:\((inside)\))?/, inside: /(?:"(?:\\"|[^"])*"|'(?:\\'|[^'])*'|<[^"'>]*>|\\["'>]|[^"'>])*/, ident: /^(cssid)$/ };
  B.cssid = De(B.cssid, "nonascii", B.nonascii);
  B.cssid = De(B.cssid, "escape", B.escape);
  B.qname = De(B.qname, "cssid", B.cssid);
  B.simple = De(B.simple, "cssid", B.cssid);
  B.ref = De(B.ref, "cssid", B.cssid);
  B.attr = De(B.attr, "cssid", B.cssid);
  B.pseudo = De(B.pseudo, "cssid", B.cssid);
  B.inside = De(B.inside, `[^"'>]*`, B.inside);
  B.attr = De(B.attr, "inside", ps("\\[", "\\]"));
  B.pseudo = De(B.pseudo, "inside", ps("\\(", "\\)"));
  B.simple = De(B.simple, "pseudo", B.pseudo);
  B.simple = De(B.simple, "attr", B.attr);
  B.ident = De(B.ident, "cssid", B.cssid);
  B.str_escape = De(B.str_escape, "escape", B.escape);
  var gr = function(e) {
    for (var t = e.replace(/^\s+|\s+$/g, ""), r, n = [], l = [], f, _, y, w, S; t; ) {
      if (y = B.qname.exec(t))
        t = t.substring(y[0].length), _ = yt(y[1]), l.push(nn(_, true));
      else if (y = B.simple.exec(t))
        t = t.substring(y[0].length), _ = "*", l.push(nn(_, true)), l.push(nn(y));
      else
        throw new SyntaxError("Invalid selector.");
      for (; y = B.simple.exec(t); )
        t = t.substring(y[0].length), l.push(nn(y));
      if (t[0] === "!" && (t = t.substring(1), f = Mu(), f.qname = _, l.push(f.simple)), y = B.ref.exec(t)) {
        t = t.substring(y[0].length), S = mr.ref(Ea(l), yt(y[1])), n.push(S.combinator), l = [];
        continue;
      }
      if (y = B.combinator.exec(t)) {
        if (t = t.substring(y[0].length), w = y[1] || y[2] || y[3], w === ",") {
          n.push(mr.noop(Ea(l)));
          break;
        }
      } else
        w = "noop";
      if (!mr[w])
        throw new SyntaxError("Bad combinator.");
      n.push(mr[w](Ea(l))), l = [];
    }
    return r = Au(n), r.qname = _, r.sel = t, f && (f.lname = r.qname, f.test = r, f.qname = f.qname, f.sel = r.sel, r = f), S && (S.test = r, S.qname = r.qname, S.sel = r.sel, r = S), r;
  }, nn = function(e, t) {
    if (t)
      return e === "*" ? _e["*"] : _e.type(e);
    if (e[1])
      return e[1][0] === "." ? _e.attr("class", "~=", yt(e[1].substring(1)), false) : _e.attr("id", "=", yt(e[1].substring(1)), false);
    if (e[2])
      return e[3] ? _e[yt(e[2])](hs(e[3])) : _e[yt(e[2])];
    if (e[4]) {
      var r = e[6], n = /["'\s]\s*I$/i.test(r);
      return n && (r = r.replace(/\s*I$/i, "")), _e.attr(yt(e[4]), e[5] || "-", hs(r), n);
    }
    throw new SyntaxError("Unknown Selector.");
  }, Ea = function(e) {
    var t = e.length, r;
    return t < 2 ? e[0] : function(n) {
      if (!!n) {
        for (r = 0; r < t; r++)
          if (!e[r](n))
            return;
        return true;
      }
    };
  }, Au = function(e) {
    return e.length < 2 ? function(t) {
      return !!e[0](t);
    } : function(t) {
      for (var r = e.length; r--; )
        if (!(t = e[r](t)))
          return;
      return true;
    };
  }, Mu = function() {
    var e;
    function t(r) {
      for (var n = r.ownerDocument, l = n.getElementsByTagName(t.lname), f = l.length; f--; )
        if (t.test(l[f]) && e === r)
          return e = null, true;
      e = null;
    }
    return t.simple = function(r) {
      return e = r, true;
    }, t;
  }, va = function(e) {
    for (var t = gr(e), r = [t]; t.sel; )
      t = gr(t.sel), r.push(t);
    return r.length < 2 ? t : function(n) {
      for (var l = r.length, f = 0; f < l; f++)
        if (r[f](n))
          return true;
    };
  }, gs = function(e, t) {
    for (var r = [], n = gr(e), l = t.getElementsByTagName(n.qname), f = 0, _; _ = l[f++]; )
      n(_) && r.push(_);
    if (n.sel) {
      for (; n.sel; )
        for (n = gr(n.sel), l = t.getElementsByTagName(n.qname), f = 0; _ = l[f++]; )
          n(_) && Cu.call(r, _) === -1 && r.push(_);
      r.sort(ku);
    }
    return r;
  };
  bs.exports = Wt = function(e, t) {
    var r, n;
    if (t.nodeType !== 11 && e.indexOf(" ") === -1) {
      if (e[0] === "#" && t.rooted && /^#[A-Z_][-A-Z0-9_]*$/i.test(e) && t.doc._hasMultipleElementsWithId && (r = e.substring(1), !t.doc._hasMultipleElementsWithId(r)))
        return n = t.doc.getElementById(r), n ? [n] : [];
      if (e[0] === "." && /^\.\w+$/.test(e))
        return t.getElementsByClassName(e.substring(1));
      if (/^\w+$/.test(e))
        return t.getElementsByTagName(e);
    }
    return gs(e, t);
  };
  Wt.selectors = _e;
  Wt.operators = ms;
  Wt.combinators = mr;
  Wt.matches = function(e, t) {
    var r = { sel: t };
    do
      if (r = gr(r.sel), r(e))
        return true;
    while (r.sel);
    return false;
  };
});
var on = O((Of, _s) => {
  var Ru = Te(), Du = ta(), ya = function(e, t) {
    for (var r = e.createDocumentFragment(), n = 0; n < t.length; n++) {
      var l = t[n], f = l instanceof Ru;
      r.appendChild(f ? l : e.createTextNode(String(l)));
    }
    return r;
  }, Iu = { after: { value: function() {
    var t = Array.prototype.slice.call(arguments), r = this.parentNode, n = this.nextSibling;
    if (r !== null) {
      for (; n && t.some(function(f) {
        return f === n;
      }); )
        n = n.nextSibling;
      var l = ya(this.doc, t);
      r.insertBefore(l, n);
    }
  } }, before: { value: function() {
    var t = Array.prototype.slice.call(arguments), r = this.parentNode, n = this.previousSibling;
    if (r !== null) {
      for (; n && t.some(function(_) {
        return _ === n;
      }); )
        n = n.previousSibling;
      var l = ya(this.doc, t), f = n ? n.nextSibling : r.firstChild;
      r.insertBefore(l, f);
    }
  } }, remove: { value: function() {
    this.parentNode !== null && (this.doc && (this.doc._preremoveNodeIterators(this), this.rooted && this.doc.mutateRemove(this)), this._remove(), this.parentNode = null);
  } }, _remove: { value: function() {
    var t = this.parentNode;
    t !== null && (t._childNodes ? t._childNodes.splice(this.index, 1) : t._firstChild === this && (this._nextSibling === this ? t._firstChild = null : t._firstChild = this._nextSibling), Du.remove(this), t.modify());
  } }, replaceWith: { value: function() {
    var t = Array.prototype.slice.call(arguments), r = this.parentNode, n = this.nextSibling;
    if (r !== null) {
      for (; n && t.some(function(f) {
        return f === n;
      }); )
        n = n.nextSibling;
      var l = ya(this.doc, t);
      this.parentNode === r ? r.replaceChild(l, this) : r.insertBefore(l, n);
    }
  } } };
  _s.exports = Iu;
});
var Ta = O((qf, vs) => {
  var Es = Te(), Ou = { nextElementSibling: { get: function() {
    if (this.parentNode) {
      for (var e = this.nextSibling; e !== null; e = e.nextSibling)
        if (e.nodeType === Es.ELEMENT_NODE)
          return e;
    }
    return null;
  } }, previousElementSibling: { get: function() {
    if (this.parentNode) {
      for (var e = this.previousSibling; e !== null; e = e.previousSibling)
        if (e.nodeType === Es.ELEMENT_NODE)
          return e;
    }
    return null;
  } } };
  vs.exports = Ou;
});
var wa = O((Hf, Ts) => {
  Ts.exports = ys;
  var Yt = le();
  function ys(e) {
    this.element = e;
  }
  Object.defineProperties(ys.prototype, { length: { get: Yt.shouldOverride }, item: { value: Yt.shouldOverride }, getNamedItem: { value: function(t) {
    return this.element.getAttributeNode(t);
  } }, getNamedItemNS: { value: function(t, r) {
    return this.element.getAttributeNodeNS(t, r);
  } }, setNamedItem: { value: Yt.nyi }, setNamedItemNS: { value: Yt.nyi }, removeNamedItem: { value: function(t) {
    var r = this.element.getAttributeNode(t);
    if (r)
      return this.element.removeAttribute(t), r;
    Yt.NotFoundError();
  } }, removeNamedItemNS: { value: function(t, r) {
    var n = this.element.getAttributeNodeNS(t, r);
    if (n)
      return this.element.removeAttributeNS(t, r), n;
    Yt.NotFoundError();
  } } });
});
var Kt = O((Pf, Ls) => {
  Ls.exports = Tt;
  var ka = tn(), fe = le(), tt = fe.NAMESPACE, ln = ma(), Ie = Te(), Sa = It(), qu = ra(), cn = ls(), $t = Xr(), Hu = ba(), Na = sn(), ks = en(), Pu = on(), Bu = Ta(), Ss = wa(), ws = /* @__PURE__ */ Object.create(null);
  function Tt(e, t, r, n) {
    ks.call(this), this.nodeType = Ie.ELEMENT_NODE, this.ownerDocument = e, this.localName = t, this.namespaceURI = r, this.prefix = n, this._tagName = void 0, this._attrsByQName = /* @__PURE__ */ Object.create(null), this._attrsByLName = /* @__PURE__ */ Object.create(null), this._attrKeys = [];
  }
  function Ns(e, t) {
    if (e.nodeType === Ie.TEXT_NODE)
      t.push(e._data);
    else
      for (var r = 0, n = e.childNodes.length; r < n; r++)
        Ns(e.childNodes[r], t);
  }
  Tt.prototype = Object.create(ks.prototype, { isHTML: { get: function() {
    return this.namespaceURI === tt.HTML && this.ownerDocument.isHTML;
  } }, tagName: { get: function() {
    if (this._tagName === void 0) {
      var t;
      if (this.prefix === null ? t = this.localName : t = this.prefix + ":" + this.localName, this.isHTML) {
        var r = ws[t];
        r || (ws[t] = r = fe.toASCIIUpperCase(t)), t = r;
      }
      this._tagName = t;
    }
    return this._tagName;
  } }, nodeName: { get: function() {
    return this.tagName;
  } }, nodeValue: { get: function() {
    return null;
  }, set: function() {
  } }, textContent: { get: function() {
    var e = [];
    return Ns(this, e), e.join("");
  }, set: function(e) {
    this.removeChildren(), e != null && e !== "" && this._appendChild(this.ownerDocument.createTextNode(e));
  } }, innerHTML: { get: function() {
    return this.serialize();
  }, set: fe.nyi }, outerHTML: { get: function() {
    return qu.serializeOne(this, { nodeType: 0 });
  }, set: function(e) {
    var t = this.ownerDocument, r = this.parentNode;
    if (r !== null) {
      r.nodeType === Ie.DOCUMENT_NODE && fe.NoModificationAllowedError(), r.nodeType === Ie.DOCUMENT_FRAGMENT_NODE && (r = r.ownerDocument.createElement("body"));
      var n = t.implementation.mozHTMLParser(t._address, r);
      n.parse(e === null ? "" : String(e), true), this.replaceWith(n._asDocumentFragment());
    }
  } }, _insertAdjacent: { value: function(t, r) {
    var n = false;
    switch (t) {
      case "beforebegin":
        n = true;
      case "afterend":
        var l = this.parentNode;
        return l === null ? null : l.insertBefore(r, n ? this : this.nextSibling);
      case "afterbegin":
        n = true;
      case "beforeend":
        return this.insertBefore(r, n ? this.firstChild : null);
      default:
        return fe.SyntaxError();
    }
  } }, insertAdjacentElement: { value: function(t, r) {
    if (r.nodeType !== Ie.ELEMENT_NODE)
      throw new TypeError("not an element");
    return t = fe.toASCIILowerCase(String(t)), this._insertAdjacent(t, r);
  } }, insertAdjacentText: { value: function(t, r) {
    var n = this.ownerDocument.createTextNode(r);
    t = fe.toASCIILowerCase(String(t)), this._insertAdjacent(t, n);
  } }, insertAdjacentHTML: { value: function(t, r) {
    t = fe.toASCIILowerCase(String(t)), r = String(r);
    var n;
    switch (t) {
      case "beforebegin":
      case "afterend":
        n = this.parentNode, (n === null || n.nodeType === Ie.DOCUMENT_NODE) && fe.NoModificationAllowedError();
        break;
      case "afterbegin":
      case "beforeend":
        n = this;
        break;
      default:
        fe.SyntaxError();
    }
    (!(n instanceof Tt) || n.ownerDocument.isHTML && n.localName === "html" && n.namespaceURI === tt.HTML) && (n = n.ownerDocument.createElementNS(tt.HTML, "body"));
    var l = this.ownerDocument.implementation.mozHTMLParser(this.ownerDocument._address, n);
    l.parse(r, true), this._insertAdjacent(t, l._asDocumentFragment());
  } }, children: { get: function() {
    return this._children || (this._children = new Cs(this)), this._children;
  } }, attributes: { get: function() {
    return this._attributes || (this._attributes = new La(this)), this._attributes;
  } }, isConnected: { get: function() {
    let e = this;
    for (; e != null; ) {
      if (e.nodeType === Ie.DOCUMENT_NODE)
        return true;
      e = e.parentNode, e != null && e.nodeType === Ie.DOCUMENT_FRAGMENT_NODE && (e = e.host);
    }
    return false;
  } }, firstElementChild: { get: function() {
    for (var e = this.firstChild; e !== null; e = e.nextSibling)
      if (e.nodeType === Ie.ELEMENT_NODE)
        return e;
    return null;
  } }, lastElementChild: { get: function() {
    for (var e = this.lastChild; e !== null; e = e.previousSibling)
      if (e.nodeType === Ie.ELEMENT_NODE)
        return e;
    return null;
  } }, childElementCount: { get: function() {
    return this.children.length;
  } }, nextElement: { value: function(e) {
    e || (e = this.ownerDocument.documentElement);
    var t = this.firstElementChild;
    if (!t) {
      if (this === e)
        return null;
      t = this.nextElementSibling;
    }
    if (t)
      return t;
    for (var r = this.parentElement; r && r !== e; r = r.parentElement)
      if (t = r.nextElementSibling, t)
        return t;
    return null;
  } }, getElementsByTagName: { value: function(t) {
    var r;
    return t ? (t === "*" ? r = function() {
      return true;
    } : this.isHTML ? r = Fu(t) : r = Ca(t), new cn(this, r)) : new Sa();
  } }, getElementsByTagNameNS: { value: function(t, r) {
    var n;
    return t === "*" && r === "*" ? n = function() {
      return true;
    } : t === "*" ? n = Ca(r) : r === "*" ? n = Uu(t) : n = Vu(t, r), new cn(this, n);
  } }, getElementsByClassName: { value: function(t) {
    if (t = String(t).trim(), t === "") {
      var r = new Sa();
      return r;
    }
    return t = t.split(/[ \t\r\n\f]+/), new cn(this, zu(t));
  } }, getElementsByName: { value: function(t) {
    return new cn(this, ju(String(t)));
  } }, clone: { value: function() {
    var t;
    this.namespaceURI !== tt.HTML || this.prefix || !this.ownerDocument.isHTML ? t = this.ownerDocument.createElementNS(this.namespaceURI, this.prefix !== null ? this.prefix + ":" + this.localName : this.localName) : t = this.ownerDocument.createElement(this.localName);
    for (var r = 0, n = this._attrKeys.length; r < n; r++) {
      var l = this._attrKeys[r], f = this._attrsByLName[l], _ = f.cloneNode();
      _._setOwnerElement(t), t._attrsByLName[l] = _, t._addQName(_);
    }
    return t._attrKeys = this._attrKeys.concat(), t;
  } }, isEqual: { value: function(t) {
    if (this.localName !== t.localName || this.namespaceURI !== t.namespaceURI || this.prefix !== t.prefix || this._numattrs !== t._numattrs)
      return false;
    for (var r = 0, n = this._numattrs; r < n; r++) {
      var l = this._attr(r);
      if (!t.hasAttributeNS(l.namespaceURI, l.localName) || t.getAttributeNS(l.namespaceURI, l.localName) !== l.value)
        return false;
    }
    return true;
  } }, _lookupNamespacePrefix: { value: function(t, r) {
    if (this.namespaceURI && this.namespaceURI === t && this.prefix !== null && r.lookupNamespaceURI(this.prefix) === t)
      return this.prefix;
    for (var n = 0, l = this._numattrs; n < l; n++) {
      var f = this._attr(n);
      if (f.prefix === "xmlns" && f.value === t && r.lookupNamespaceURI(f.localName) === t)
        return f.localName;
    }
    var _ = this.parentElement;
    return _ ? _._lookupNamespacePrefix(t, r) : null;
  } }, lookupNamespaceURI: { value: function(t) {
    if ((t === "" || t === void 0) && (t = null), this.namespaceURI !== null && this.prefix === t)
      return this.namespaceURI;
    for (var r = 0, n = this._numattrs; r < n; r++) {
      var l = this._attr(r);
      if (l.namespaceURI === tt.XMLNS && (l.prefix === "xmlns" && l.localName === t || t === null && l.prefix === null && l.localName === "xmlns"))
        return l.value || null;
    }
    var f = this.parentElement;
    return f ? f.lookupNamespaceURI(t) : null;
  } }, getAttribute: { value: function(t) {
    var r = this.getAttributeNode(t);
    return r ? r.value : null;
  } }, getAttributeNS: { value: function(t, r) {
    var n = this.getAttributeNodeNS(t, r);
    return n ? n.value : null;
  } }, getAttributeNode: { value: function(t) {
    t = String(t), /[A-Z]/.test(t) && this.isHTML && (t = fe.toASCIILowerCase(t));
    var r = this._attrsByQName[t];
    return r ? (Array.isArray(r) && (r = r[0]), r) : null;
  } }, getAttributeNodeNS: { value: function(t, r) {
    t = t == null ? "" : String(t), r = String(r);
    var n = this._attrsByLName[t + "|" + r];
    return n || null;
  } }, hasAttribute: { value: function(t) {
    return t = String(t), /[A-Z]/.test(t) && this.isHTML && (t = fe.toASCIILowerCase(t)), this._attrsByQName[t] !== void 0;
  } }, hasAttributeNS: { value: function(t, r) {
    t = t == null ? "" : String(t), r = String(r);
    var n = t + "|" + r;
    return this._attrsByLName[n] !== void 0;
  } }, hasAttributes: { value: function() {
    return this._numattrs > 0;
  } }, toggleAttribute: { value: function(t, r) {
    t = String(t), ka.isValidName(t) || fe.InvalidCharacterError(), /[A-Z]/.test(t) && this.isHTML && (t = fe.toASCIILowerCase(t));
    var n = this._attrsByQName[t];
    return n === void 0 ? r === void 0 || r === true ? (this._setAttribute(t, ""), true) : false : r === void 0 || r === false ? (this.removeAttribute(t), false) : true;
  } }, _setAttribute: { value: function(t, r) {
    var n = this._attrsByQName[t], l;
    n ? Array.isArray(n) && (n = n[0]) : (n = this._newattr(t), l = true), n.value = r, this._attributes && (this._attributes[t] = n), l && this._newattrhook && this._newattrhook(t, r);
  } }, setAttribute: { value: function(t, r) {
    t = String(t), ka.isValidName(t) || fe.InvalidCharacterError(), /[A-Z]/.test(t) && this.isHTML && (t = fe.toASCIILowerCase(t)), this._setAttribute(t, String(r));
  } }, _setAttributeNS: { value: function(t, r, n) {
    var l = r.indexOf(":"), f, _;
    l < 0 ? (f = null, _ = r) : (f = r.substring(0, l), _ = r.substring(l + 1)), (t === "" || t === void 0) && (t = null);
    var y = (t === null ? "" : t) + "|" + _, w = this._attrsByLName[y], S;
    w || (w = new br(this, _, f, t), S = true, this._attrsByLName[y] = w, this._attributes && (this._attributes[this._attrKeys.length] = w), this._attrKeys.push(y), this._addQName(w)), w.value = n, S && this._newattrhook && this._newattrhook(r, n);
  } }, setAttributeNS: { value: function(t, r, n) {
    t = t == null || t === "" ? null : String(t), r = String(r), ka.isValidQName(r) || fe.InvalidCharacterError();
    var l = r.indexOf(":"), f = l < 0 ? null : r.substring(0, l);
    (f !== null && t === null || f === "xml" && t !== tt.XML || (r === "xmlns" || f === "xmlns") && t !== tt.XMLNS || t === tt.XMLNS && !(r === "xmlns" || f === "xmlns")) && fe.NamespaceError(), this._setAttributeNS(t, r, String(n));
  } }, setAttributeNode: { value: function(t) {
    if (t.ownerElement !== null && t.ownerElement !== this)
      throw new $t($t.INUSE_ATTRIBUTE_ERR);
    var r = null, n = this._attrsByQName[t.name];
    if (n) {
      if (Array.isArray(n) || (n = [n]), n.some(function(l) {
        return l === t;
      }))
        return t;
      if (t.ownerElement !== null)
        throw new $t($t.INUSE_ATTRIBUTE_ERR);
      n.forEach(function(l) {
        this.removeAttributeNode(l);
      }, this), r = n[0];
    }
    return this.setAttributeNodeNS(t), r;
  } }, setAttributeNodeNS: { value: function(t) {
    if (t.ownerElement !== null)
      throw new $t($t.INUSE_ATTRIBUTE_ERR);
    var r = t.namespaceURI, n = (r === null ? "" : r) + "|" + t.localName, l = this._attrsByLName[n];
    return l && this.removeAttributeNode(l), t._setOwnerElement(this), this._attrsByLName[n] = t, this._attributes && (this._attributes[this._attrKeys.length] = t), this._attrKeys.push(n), this._addQName(t), this._newattrhook && this._newattrhook(t.name, t.value), l || null;
  } }, removeAttribute: { value: function(t) {
    t = String(t), /[A-Z]/.test(t) && this.isHTML && (t = fe.toASCIILowerCase(t));
    var r = this._attrsByQName[t];
    if (!!r) {
      Array.isArray(r) ? r.length > 2 ? r = r.shift() : (this._attrsByQName[t] = r[1], r = r[0]) : this._attrsByQName[t] = void 0;
      var n = r.namespaceURI, l = (n === null ? "" : n) + "|" + r.localName;
      this._attrsByLName[l] = void 0;
      var f = this._attrKeys.indexOf(l);
      this._attributes && (Array.prototype.splice.call(this._attributes, f, 1), this._attributes[t] = void 0), this._attrKeys.splice(f, 1);
      var _ = r.onchange;
      r._setOwnerElement(null), _ && _.call(r, this, r.localName, r.value, null), this.rooted && this.ownerDocument.mutateRemoveAttr(r);
    }
  } }, removeAttributeNS: { value: function(t, r) {
    t = t == null ? "" : String(t), r = String(r);
    var n = t + "|" + r, l = this._attrsByLName[n];
    if (!!l) {
      this._attrsByLName[n] = void 0;
      var f = this._attrKeys.indexOf(n);
      this._attributes && Array.prototype.splice.call(this._attributes, f, 1), this._attrKeys.splice(f, 1), this._removeQName(l);
      var _ = l.onchange;
      l._setOwnerElement(null), _ && _.call(l, this, l.localName, l.value, null), this.rooted && this.ownerDocument.mutateRemoveAttr(l);
    }
  } }, removeAttributeNode: { value: function(t) {
    var r = t.namespaceURI, n = (r === null ? "" : r) + "|" + t.localName;
    return this._attrsByLName[n] !== t && fe.NotFoundError(), this.removeAttributeNS(r, t.localName), t;
  } }, getAttributeNames: { value: function() {
    var t = this;
    return this._attrKeys.map(function(r) {
      return t._attrsByLName[r].name;
    });
  } }, _getattr: { value: function(t) {
    var r = this._attrsByQName[t];
    return r ? r.value : null;
  } }, _setattr: { value: function(t, r) {
    var n = this._attrsByQName[t], l;
    n || (n = this._newattr(t), l = true), n.value = String(r), this._attributes && (this._attributes[t] = n), l && this._newattrhook && this._newattrhook(t, r);
  } }, _newattr: { value: function(t) {
    var r = new br(this, t, null, null), n = "|" + t;
    return this._attrsByQName[t] = r, this._attrsByLName[n] = r, this._attributes && (this._attributes[this._attrKeys.length] = r), this._attrKeys.push(n), r;
  } }, _addQName: { value: function(e) {
    var t = e.name, r = this._attrsByQName[t];
    r ? Array.isArray(r) ? r.push(e) : this._attrsByQName[t] = [r, e] : this._attrsByQName[t] = e, this._attributes && (this._attributes[t] = e);
  } }, _removeQName: { value: function(e) {
    var t = e.name, r = this._attrsByQName[t];
    if (Array.isArray(r)) {
      var n = r.indexOf(e);
      fe.assert(n !== -1), r.length === 2 ? (this._attrsByQName[t] = r[1 - n], this._attributes && (this._attributes[t] = this._attrsByQName[t])) : (r.splice(n, 1), this._attributes && this._attributes[t] === e && (this._attributes[t] = r[0]));
    } else
      fe.assert(r === e), this._attrsByQName[t] = void 0, this._attributes && (this._attributes[t] = void 0);
  } }, _numattrs: { get: function() {
    return this._attrKeys.length;
  } }, _attr: { value: function(e) {
    return this._attrsByLName[this._attrKeys[e]];
  } }, id: ln.property({ name: "id" }), className: ln.property({ name: "class" }), classList: { get: function() {
    var e = this;
    if (this._classList)
      return this._classList;
    var t = new Hu(function() {
      return e.className || "";
    }, function(r) {
      e.className = r;
    });
    return this._classList = t, t;
  }, set: function(e) {
    this.className = e;
  } }, matches: { value: function(e) {
    return Na.matches(this, e);
  } }, closest: { value: function(e) {
    var t = this;
    do {
      if (t.matches && t.matches(e))
        return t;
      t = t.parentElement || t.parentNode;
    } while (t !== null && t.nodeType === Ie.ELEMENT_NODE);
    return null;
  } }, querySelector: { value: function(e) {
    return Na(e, this)[0];
  } }, querySelectorAll: { value: function(e) {
    var t = Na(e, this);
    return t.item ? t : new Sa(t);
  } } });
  Object.defineProperties(Tt.prototype, Pu);
  Object.defineProperties(Tt.prototype, Bu);
  ln.registerChangeHandler(Tt, "id", function(e, t, r, n) {
    e.rooted && (r && e.ownerDocument.delId(r, e), n && e.ownerDocument.addId(n, e));
  });
  ln.registerChangeHandler(Tt, "class", function(e, t, r, n) {
    e._classList && e._classList._update();
  });
  function br(e, t, r, n, l) {
    this.localName = t, this.prefix = r === null || r === "" ? null : "" + r, this.namespaceURI = n === null || n === "" ? null : "" + n, this.data = l, this._setOwnerElement(e);
  }
  br.prototype = Object.create(Object.prototype, { ownerElement: { get: function() {
    return this._ownerElement;
  } }, _setOwnerElement: { value: function(t) {
    this._ownerElement = t, this.prefix === null && this.namespaceURI === null && t ? this.onchange = t._attributeChangeHandlers[this.localName] : this.onchange = null;
  } }, name: { get: function() {
    return this.prefix ? this.prefix + ":" + this.localName : this.localName;
  } }, specified: { get: function() {
    return true;
  } }, value: { get: function() {
    return this.data;
  }, set: function(e) {
    var t = this.data;
    e = e === void 0 ? "" : e + "", e !== t && (this.data = e, this.ownerElement && (this.onchange && this.onchange(this.ownerElement, this.localName, t, e), this.ownerElement.rooted && this.ownerElement.ownerDocument.mutateAttr(this, t)));
  } }, cloneNode: { value: function(t) {
    return new br(null, this.localName, this.prefix, this.namespaceURI, this.data);
  } }, nodeType: { get: function() {
    return Ie.ATTRIBUTE_NODE;
  } }, nodeName: { get: function() {
    return this.name;
  } }, nodeValue: { get: function() {
    return this.value;
  }, set: function(e) {
    this.value = e;
  } }, textContent: { get: function() {
    return this.value;
  }, set: function(e) {
    e == null && (e = ""), this.value = e;
  } } });
  Tt._Attr = br;
  function La(e) {
    Ss.call(this, e);
    for (var t in e._attrsByQName)
      this[t] = e._attrsByQName[t];
    for (var r = 0; r < e._attrKeys.length; r++)
      this[r] = e._attrsByLName[e._attrKeys[r]];
  }
  La.prototype = Object.create(Ss.prototype, { length: { get: function() {
    return this.element._attrKeys.length;
  }, set: function() {
  } }, item: { value: function(e) {
    return e = e >>> 0, e >= this.length ? null : this.element._attrsByLName[this.element._attrKeys[e]];
  } } });
  global.Symbol && global.Symbol.iterator && (La.prototype[global.Symbol.iterator] = function() {
    var e = 0, t = this.length, r = this;
    return { next: function() {
      return e < t ? { value: r.item(e++) } : { done: true };
    } };
  });
  function Cs(e) {
    this.element = e, this.updateCache();
  }
  Cs.prototype = Object.create(Object.prototype, { length: { get: function() {
    return this.updateCache(), this.childrenByNumber.length;
  } }, item: { value: function(t) {
    return this.updateCache(), this.childrenByNumber[t] || null;
  } }, namedItem: { value: function(t) {
    return this.updateCache(), this.childrenByName[t] || null;
  } }, namedItems: { get: function() {
    return this.updateCache(), this.childrenByName;
  } }, updateCache: { value: function() {
    var t = /^(a|applet|area|embed|form|frame|frameset|iframe|img|object)$/;
    if (this.lastModTime !== this.element.lastModTime) {
      this.lastModTime = this.element.lastModTime;
      for (var r = this.childrenByNumber && this.childrenByNumber.length || 0, n = 0; n < r; n++)
        this[n] = void 0;
      this.childrenByNumber = [], this.childrenByName = /* @__PURE__ */ Object.create(null);
      for (var l = this.element.firstChild; l !== null; l = l.nextSibling)
        if (l.nodeType === Ie.ELEMENT_NODE) {
          this[this.childrenByNumber.length] = l, this.childrenByNumber.push(l);
          var f = l.getAttribute("id");
          f && !this.childrenByName[f] && (this.childrenByName[f] = l);
          var _ = l.getAttribute("name");
          _ && this.element.namespaceURI === tt.HTML && t.test(this.element.localName) && !this.childrenByName[_] && (this.childrenByName[f] = l);
        }
    }
  } } });
  function Ca(e) {
    return function(t) {
      return t.localName === e;
    };
  }
  function Fu(e) {
    var t = fe.toASCIILowerCase(e);
    return t === e ? Ca(e) : function(r) {
      return r.isHTML ? r.localName === t : r.localName === e;
    };
  }
  function Uu(e) {
    return function(t) {
      return t.namespaceURI === e;
    };
  }
  function Vu(e, t) {
    return function(r) {
      return r.namespaceURI === e && r.localName === t;
    };
  }
  function zu(e) {
    return function(t) {
      return e.every(function(r) {
        return t.classList.contains(r);
      });
    };
  }
  function ju(e) {
    return function(t) {
      return t.namespaceURI !== tt.HTML ? false : t.getAttribute("name") === e;
    };
  }
});
var Aa = O((Bf, Is) => {
  Is.exports = Ds;
  var Ms = Te(), Gu = It(), Rs = le(), As = Rs.HierarchyRequestError, Wu = Rs.NotFoundError;
  function Ds() {
    Ms.call(this);
  }
  Ds.prototype = Object.create(Ms.prototype, { hasChildNodes: { value: function() {
    return false;
  } }, firstChild: { value: null }, lastChild: { value: null }, insertBefore: { value: function(e, t) {
    if (!e.nodeType)
      throw new TypeError("not a node");
    As();
  } }, replaceChild: { value: function(e, t) {
    if (!e.nodeType)
      throw new TypeError("not a node");
    As();
  } }, removeChild: { value: function(e) {
    if (!e.nodeType)
      throw new TypeError("not a node");
    Wu();
  } }, removeChildren: { value: function() {
  } }, childNodes: { get: function() {
    return this._childNodes || (this._childNodes = new Gu()), this._childNodes;
  } } });
});
var _r = O((Ff, Hs) => {
  Hs.exports = un;
  var qs = Aa(), Os = le(), Yu = on(), $u = Ta();
  function un() {
    qs.call(this);
  }
  un.prototype = Object.create(qs.prototype, { substringData: { value: function(t, r) {
    if (arguments.length < 2)
      throw new TypeError("Not enough arguments");
    return t = t >>> 0, r = r >>> 0, (t > this.data.length || t < 0 || r < 0) && Os.IndexSizeError(), this.data.substring(t, t + r);
  } }, appendData: { value: function(t) {
    if (arguments.length < 1)
      throw new TypeError("Not enough arguments");
    this.data += String(t);
  } }, insertData: { value: function(t, r) {
    return this.replaceData(t, 0, r);
  } }, deleteData: { value: function(t, r) {
    return this.replaceData(t, r, "");
  } }, replaceData: { value: function(t, r, n) {
    var l = this.data, f = l.length;
    t = t >>> 0, r = r >>> 0, n = String(n), (t > f || t < 0) && Os.IndexSizeError(), t + r > f && (r = f - t);
    var _ = l.substring(0, t), y = l.substring(t + r);
    this.data = _ + n + y;
  } }, isEqual: { value: function(t) {
    return this._data === t._data;
  } }, length: { get: function() {
    return this.data.length;
  } } });
  Object.defineProperties(un.prototype, Yu);
  Object.defineProperties(un.prototype, $u);
});
var Ra = O((Uf, Fs) => {
  Fs.exports = Ma;
  var dn = le(), Ps = Te(), Bs = _r();
  function Ma(e, t) {
    Bs.call(this), this.nodeType = Ps.TEXT_NODE, this.ownerDocument = e, this._data = dn.escapeText(t), this._index = void 0;
  }
  var fn = { get: function() {
    return this._data;
  }, set: function(e) {
    e == null ? e = "" : e = String(e), e !== this._data && (this._data = dn.escapeText(e), this.rooted && this.ownerDocument.mutateValue(this), this.parentNode && this.parentNode._textchangehook && this.parentNode._textchangehook(this));
  } };
  Ma.prototype = Object.create(Bs.prototype, { nodeName: { value: "#text" }, nodeValue: fn, textContent: fn, data: { get: fn.get, set: function(e) {
    fn.set.call(this, e === null ? "" : String(e));
  } }, splitText: { value: function(t) {
    (t > this._data.length || t < 0) && dn.IndexSizeError();
    var r = this._data.substring(t), n = this.ownerDocument.createTextNode(r);
    this.data = this.data.substring(0, t);
    var l = this.parentNode;
    return l !== null && l.insertBefore(n, this.nextSibling), n;
  } }, wholeText: { get: function() {
    for (var t = this.textContent, r = this.nextSibling; r && r.nodeType === Ps.TEXT_NODE; r = r.nextSibling)
      t += r.textContent;
    return t;
  } }, replaceWholeText: { value: dn.nyi }, clone: { value: function() {
    return new Ma(this.ownerDocument, this._data);
  } } });
});
var Ia = O((Vf, zs) => {
  zs.exports = Da;
  var Ku = Te(), Us = le(), Vs = _r();
  function Da(e, t) {
    Vs.call(this), this.nodeType = Ku.COMMENT_NODE, this.ownerDocument = e, this._data = Us.escapeText(t);
  }
  var hn = { get: function() {
    return this._data;
  }, set: function(e) {
    e == null ? e = "" : e = String(e), this._data = Us.escapeText(e), this.rooted && this.ownerDocument.mutateValue(this);
  } };
  Da.prototype = Object.create(Vs.prototype, { nodeName: { value: "#comment" }, nodeValue: hn, textContent: hn, data: { get: hn.get, set: function(e) {
    hn.set.call(this, e === null ? "" : String(e));
  } }, clone: { value: function() {
    return new Da(this.ownerDocument, this._data);
  } } });
});
var Ha = O((zf, Ws) => {
  Ws.exports = qa;
  var Xu = Te(), Qu = It(), Gs = en(), Oa = Kt(), Zu = sn(), js = le();
  function qa(e) {
    Gs.call(this), this.nodeType = Xu.DOCUMENT_FRAGMENT_NODE, this.ownerDocument = e;
  }
  qa.prototype = Object.create(Gs.prototype, { nodeName: { value: "#document-fragment" }, nodeValue: { get: function() {
    return null;
  }, set: function() {
  } }, textContent: Object.getOwnPropertyDescriptor(Oa.prototype, "textContent"), querySelector: { value: function(e) {
    var t = this.querySelectorAll(e);
    return t.length ? t[0] : null;
  } }, querySelectorAll: { value: function(e) {
    var t = Object.create(this);
    t.isHTML = true, t.getElementsByTagName = Oa.prototype.getElementsByTagName, t.nextElement = Object.getOwnPropertyDescriptor(Oa.prototype, "firstElementChild").get;
    var r = Zu(e, t);
    return r.item ? r : new Qu(r);
  } }, clone: { value: function() {
    return new qa(this.ownerDocument);
  } }, isEqual: { value: function(t) {
    return true;
  } }, innerHTML: { get: function() {
    return this.serialize();
  }, set: js.nyi }, outerHTML: { get: function() {
    return this.serialize();
  }, set: js.nyi } });
});
var Ba = O((jf, $s) => {
  $s.exports = Pa;
  var Ju = Te(), Ys = _r(), e0 = le();
  function Pa(e, t, r) {
    Ys.call(this), this.nodeType = Ju.PROCESSING_INSTRUCTION_NODE, this.ownerDocument = e, this.target = t, this._data = r;
  }
  var xn = { get: function() {
    return this._data;
  }, set: function(e) {
    e == null ? e = "" : e = String(e), this._data = e0.escapeText(e), this.rooted && this.ownerDocument.mutateValue(this);
  } };
  Pa.prototype = Object.create(Ys.prototype, { nodeName: { get: function() {
    return this.target;
  } }, nodeValue: xn, textContent: xn, data: { get: xn.get, set: function(e) {
    xn.set.call(this, e === null ? "" : String(e));
  } }, clone: { value: function() {
    return new Pa(this.ownerDocument, this.target, this._data);
  } }, isEqual: { value: function(t) {
    return this.target === t.target && this._data === t._data;
  } } });
});
var Er = O((Gf, Ks) => {
  var Fa = { FILTER_ACCEPT: 1, FILTER_REJECT: 2, FILTER_SKIP: 3, SHOW_ALL: 4294967295, SHOW_ELEMENT: 1, SHOW_ATTRIBUTE: 2, SHOW_TEXT: 4, SHOW_CDATA_SECTION: 8, SHOW_ENTITY_REFERENCE: 16, SHOW_ENTITY: 32, SHOW_PROCESSING_INSTRUCTION: 64, SHOW_COMMENT: 128, SHOW_DOCUMENT: 256, SHOW_DOCUMENT_TYPE: 512, SHOW_DOCUMENT_FRAGMENT: 1024, SHOW_NOTATION: 2048 };
  Ks.exports = Fa.constructor = Fa.prototype = Fa;
});
var Va = O((Yf, Qs) => {
  Qs.exports = { nextSkippingChildren: t0, nextAncestorSibling: Ua, next: r0, previous: n0, deepLastChild: Xs };
  function t0(e, t) {
    return e === t ? null : e.nextSibling !== null ? e.nextSibling : Ua(e, t);
  }
  function Ua(e, t) {
    for (e = e.parentNode; e !== null; e = e.parentNode) {
      if (e === t)
        return null;
      if (e.nextSibling !== null)
        return e.nextSibling;
    }
    return null;
  }
  function r0(e, t) {
    var r;
    return r = e.firstChild, r !== null ? r : e === t ? null : (r = e.nextSibling, r !== null ? r : Ua(e, t));
  }
  function Xs(e) {
    for (; e.lastChild; )
      e = e.lastChild;
    return e;
  }
  function n0(e, t) {
    var r;
    return r = e.previousSibling, r !== null ? Xs(r) : (r = e.parentNode, r === t ? null : r);
  }
});
var ao = O(($f, no) => {
  no.exports = ro;
  var a0 = Te(), we = Er(), Zs = Va(), to = le(), za = { first: "firstChild", last: "lastChild", next: "firstChild", previous: "lastChild" }, ja = { first: "nextSibling", last: "previousSibling", next: "nextSibling", previous: "previousSibling" };
  function Js(e, t) {
    var r, n, l, f, _;
    for (n = e._currentNode[za[t]]; n !== null; ) {
      if (f = e._internalFilter(n), f === we.FILTER_ACCEPT)
        return e._currentNode = n, n;
      if (f === we.FILTER_SKIP && (r = n[za[t]], r !== null)) {
        n = r;
        continue;
      }
      for (; n !== null; ) {
        if (_ = n[ja[t]], _ !== null) {
          n = _;
          break;
        }
        if (l = n.parentNode, l === null || l === e.root || l === e._currentNode)
          return null;
        n = l;
      }
    }
    return null;
  }
  function eo(e, t) {
    var r, n, l;
    if (r = e._currentNode, r === e.root)
      return null;
    for (; ; ) {
      for (l = r[ja[t]]; l !== null; ) {
        if (r = l, n = e._internalFilter(r), n === we.FILTER_ACCEPT)
          return e._currentNode = r, r;
        l = r[za[t]], (n === we.FILTER_REJECT || l === null) && (l = r[ja[t]]);
      }
      if (r = r.parentNode, r === null || r === e.root || e._internalFilter(r) === we.FILTER_ACCEPT)
        return null;
    }
  }
  function ro(e, t, r) {
    (!e || !e.nodeType) && to.NotSupportedError(), this._root = e, this._whatToShow = Number(t) || 0, this._filter = r || null, this._active = false, this._currentNode = e;
  }
  Object.defineProperties(ro.prototype, { root: { get: function() {
    return this._root;
  } }, whatToShow: { get: function() {
    return this._whatToShow;
  } }, filter: { get: function() {
    return this._filter;
  } }, currentNode: { get: function() {
    return this._currentNode;
  }, set: function(t) {
    if (!(t instanceof a0))
      throw new TypeError("Not a Node");
    this._currentNode = t;
  } }, _internalFilter: { value: function(t) {
    var r, n;
    if (this._active && to.InvalidStateError(), !(1 << t.nodeType - 1 & this._whatToShow))
      return we.FILTER_SKIP;
    if (n = this._filter, n === null)
      r = we.FILTER_ACCEPT;
    else {
      this._active = true;
      try {
        typeof n == "function" ? r = n(t) : r = n.acceptNode(t);
      } finally {
        this._active = false;
      }
    }
    return +r;
  } }, parentNode: { value: function() {
    for (var t = this._currentNode; t !== this.root; ) {
      if (t = t.parentNode, t === null)
        return null;
      if (this._internalFilter(t) === we.FILTER_ACCEPT)
        return this._currentNode = t, t;
    }
    return null;
  } }, firstChild: { value: function() {
    return Js(this, "first");
  } }, lastChild: { value: function() {
    return Js(this, "last");
  } }, previousSibling: { value: function() {
    return eo(this, "previous");
  } }, nextSibling: { value: function() {
    return eo(this, "next");
  } }, previousNode: { value: function() {
    var t, r, n, l;
    for (t = this._currentNode; t !== this._root; ) {
      for (n = t.previousSibling; n; n = t.previousSibling)
        if (t = n, r = this._internalFilter(t), r !== we.FILTER_REJECT) {
          for (l = t.lastChild; l && (t = l, r = this._internalFilter(t), r !== we.FILTER_REJECT); l = t.lastChild)
            ;
          if (r === we.FILTER_ACCEPT)
            return this._currentNode = t, t;
        }
      if (t === this.root || t.parentNode === null)
        return null;
      if (t = t.parentNode, this._internalFilter(t) === we.FILTER_ACCEPT)
        return this._currentNode = t, t;
    }
    return null;
  } }, nextNode: { value: function() {
    var t, r, n, l;
    t = this._currentNode, r = we.FILTER_ACCEPT;
    e:
      for (; ; ) {
        for (n = t.firstChild; n; n = t.firstChild) {
          if (t = n, r = this._internalFilter(t), r === we.FILTER_ACCEPT)
            return this._currentNode = t, t;
          if (r === we.FILTER_REJECT)
            break;
        }
        for (l = Zs.nextSkippingChildren(t, this.root); l; l = Zs.nextSkippingChildren(t, this.root)) {
          if (t = l, r = this._internalFilter(t), r === we.FILTER_ACCEPT)
            return this._currentNode = t, t;
          if (r === we.FILTER_SKIP)
            continue e;
        }
        return null;
      }
  } }, toString: { value: function() {
    return "[object TreeWalker]";
  } } });
});
var uo = O((Kf, lo) => {
  lo.exports = co;
  var Ga = Er(), Wa = Va(), oo = le();
  function i0(e, t, r) {
    return r ? Wa.next(e, t) : e === t ? null : Wa.previous(e, null);
  }
  function io(e, t) {
    for (; t; t = t.parentNode)
      if (e === t)
        return true;
    return false;
  }
  function so(e, t) {
    var r, n;
    for (r = e._referenceNode, n = e._pointerBeforeReferenceNode; ; ) {
      if (n === t)
        n = !n;
      else if (r = i0(r, e._root, t), r === null)
        return null;
      var l = e._internalFilter(r);
      if (l === Ga.FILTER_ACCEPT)
        break;
    }
    return e._referenceNode = r, e._pointerBeforeReferenceNode = n, r;
  }
  function co(e, t, r) {
    (!e || !e.nodeType) && oo.NotSupportedError(), this._root = e, this._referenceNode = e, this._pointerBeforeReferenceNode = true, this._whatToShow = Number(t) || 0, this._filter = r || null, this._active = false, e.doc._attachNodeIterator(this);
  }
  Object.defineProperties(co.prototype, { root: { get: function() {
    return this._root;
  } }, referenceNode: { get: function() {
    return this._referenceNode;
  } }, pointerBeforeReferenceNode: { get: function() {
    return this._pointerBeforeReferenceNode;
  } }, whatToShow: { get: function() {
    return this._whatToShow;
  } }, filter: { get: function() {
    return this._filter;
  } }, _internalFilter: { value: function(t) {
    var r, n;
    if (this._active && oo.InvalidStateError(), !(1 << t.nodeType - 1 & this._whatToShow))
      return Ga.FILTER_SKIP;
    if (n = this._filter, n === null)
      r = Ga.FILTER_ACCEPT;
    else {
      this._active = true;
      try {
        typeof n == "function" ? r = n(t) : r = n.acceptNode(t);
      } finally {
        this._active = false;
      }
    }
    return +r;
  } }, _preremove: { value: function(t) {
    if (!io(t, this._root) && !!io(t, this._referenceNode)) {
      if (this._pointerBeforeReferenceNode) {
        for (var r = t; r.lastChild; )
          r = r.lastChild;
        if (r = Wa.next(r, this.root), r) {
          this._referenceNode = r;
          return;
        }
        this._pointerBeforeReferenceNode = false;
      }
      if (t.previousSibling === null)
        this._referenceNode = t.parentNode;
      else {
        this._referenceNode = t.previousSibling;
        var n;
        for (n = this._referenceNode.lastChild; n; n = this._referenceNode.lastChild)
          this._referenceNode = n;
      }
    }
  } }, nextNode: { value: function() {
    return so(this, true);
  } }, previousNode: { value: function() {
    return so(this, false);
  } }, detach: { value: function() {
  } }, toString: { value: function() {
    return "[object NodeIterator]";
  } } });
});
var pn = O((Xf, fo) => {
  fo.exports = ke;
  function ke(e) {
    if (!e)
      return Object.create(ke.prototype);
    this.url = e.replace(/^[ \t\n\r\f]+|[ \t\n\r\f]+$/g, "");
    var t = ke.pattern.exec(this.url);
    if (t) {
      if (t[2] && (this.scheme = t[2]), t[4]) {
        var r = t[4].match(ke.userinfoPattern);
        if (r && (this.username = r[1], this.password = r[3], t[4] = t[4].substring(r[0].length)), t[4].match(ke.portPattern)) {
          var n = t[4].lastIndexOf(":");
          this.host = t[4].substring(0, n), this.port = t[4].substring(n + 1);
        } else
          this.host = t[4];
      }
      t[5] && (this.path = t[5]), t[6] && (this.query = t[7]), t[8] && (this.fragment = t[9]);
    }
  }
  ke.pattern = /^(([^:\/?#]+):)?(\/\/([^\/?#]*))?([^?#]*)(\?([^#]*))?(#(.*))?$/;
  ke.userinfoPattern = /^([^@:]*)(:([^@]*))?@/;
  ke.portPattern = /:\d+$/;
  ke.authorityPattern = /^[^:\/?#]+:\/\//;
  ke.hierarchyPattern = /^[^:\/?#]+:\//;
  ke.percentEncode = function(t) {
    var r = t.charCodeAt(0);
    if (r < 256)
      return "%" + r.toString(16);
    throw Error("can't percent-encode codepoints > 255 yet");
  };
  ke.prototype = { constructor: ke, isAbsolute: function() {
    return !!this.scheme;
  }, isAuthorityBased: function() {
    return ke.authorityPattern.test(this.url);
  }, isHierarchical: function() {
    return ke.hierarchyPattern.test(this.url);
  }, toString: function() {
    var e = "";
    return this.scheme !== void 0 && (e += this.scheme + ":"), this.isAbsolute() && (e += "//", (this.username || this.password) && (e += this.username || "", this.password && (e += ":" + this.password), e += "@"), this.host && (e += this.host)), this.port !== void 0 && (e += ":" + this.port), this.path !== void 0 && (e += this.path), this.query !== void 0 && (e += "?" + this.query), this.fragment !== void 0 && (e += "#" + this.fragment), e;
  }, resolve: function(e) {
    var t = this, r = new ke(e), n = new ke();
    return r.scheme !== void 0 ? (n.scheme = r.scheme, n.username = r.username, n.password = r.password, n.host = r.host, n.port = r.port, n.path = f(r.path), n.query = r.query) : (n.scheme = t.scheme, r.host !== void 0 ? (n.username = r.username, n.password = r.password, n.host = r.host, n.port = r.port, n.path = f(r.path), n.query = r.query) : (n.username = t.username, n.password = t.password, n.host = t.host, n.port = t.port, r.path ? (r.path.charAt(0) === "/" ? n.path = f(r.path) : (n.path = l(t.path, r.path), n.path = f(n.path)), n.query = r.query) : (n.path = t.path, r.query !== void 0 ? n.query = r.query : n.query = t.query))), n.fragment = r.fragment, n.toString();
    function l(_, y) {
      if (t.host !== void 0 && !t.path)
        return "/" + y;
      var w = _.lastIndexOf("/");
      return w === -1 ? y : _.substring(0, w + 1) + y;
    }
    function f(_) {
      if (!_)
        return _;
      for (var y = ""; _.length > 0; ) {
        if (_ === "." || _ === "..") {
          _ = "";
          break;
        }
        var w = _.substring(0, 2), S = _.substring(0, 3), M = _.substring(0, 4);
        if (S === "../")
          _ = _.substring(3);
        else if (w === "./")
          _ = _.substring(2);
        else if (S === "/./")
          _ = "/" + _.substring(3);
        else if (w === "/." && _.length === 2)
          _ = "/";
        else if (M === "/../" || S === "/.." && _.length === 3)
          _ = "/" + _.substring(4), y = y.replace(/\/?[^\/]*$/, "");
        else {
          var ae = _.match(/(\/?([^\/]*))/)[0];
          y += ae, _ = _.substring(ae.length);
        }
      }
      return y;
    }
  } };
});
var po = O((Qf, xo) => {
  xo.exports = Ya;
  var ho = Vt();
  function Ya(e, t) {
    ho.call(this, e, t);
  }
  Ya.prototype = Object.create(ho.prototype, { constructor: { value: Ya } });
});
var $a = O((Zf, mo) => {
  mo.exports = { Event: Vt(), UIEvent: Xn(), MouseEvent: Zn(), CustomEvent: po() };
});
var bo = O((go) => {
  var ct = /* @__PURE__ */ Object.create(null);
  (function() {
    function e() {
      this._listeners = /* @__PURE__ */ Object.create(null);
    }
    e.prototype = { constructor: e, addListener: function(f, _) {
      this._listeners[f] || (this._listeners[f] = []), this._listeners[f].push(_);
    }, fire: function(f) {
      if (typeof f == "string" && (f = { type: f }), typeof f.target != "undefined" && (f.target = this), typeof f.type == "undefined")
        throw new Error("Event object missing 'type' property.");
      if (this._listeners[f.type])
        for (var _ = this._listeners[f.type].concat(), y = 0, w = _.length; y < w; y++)
          _[y].call(this, f);
    }, removeListener: function(f, _) {
      if (this._listeners[f]) {
        for (var y = this._listeners[f], w = 0, S = y.length; w < S; w++)
          if (y[w] === _) {
            y.splice(w, 1);
            break;
          }
      }
    } };
    function t(f) {
      this._input = f.replace(/(\r|\n){1,2}/g, `
`), this._line = 1, this._col = 1, this._cursor = 0;
    }
    t.prototype = { constructor: t, getCol: function() {
      return this._col;
    }, getLine: function() {
      return this._line;
    }, eof: function() {
      return this._cursor === this._input.length;
    }, peek: function(f) {
      var _ = null;
      return f = typeof f == "undefined" ? 1 : f, this._cursor < this._input.length && (_ = this._input.charAt(this._cursor + f - 1)), _;
    }, read: function() {
      var f = null;
      return this._cursor < this._input.length && (this._input.charAt(this._cursor) === `
` ? (this._line++, this._col = 1) : this._col++, f = this._input.charAt(this._cursor++)), f;
    }, mark: function() {
      this._bookmark = { cursor: this._cursor, line: this._line, col: this._col };
    }, reset: function() {
      this._bookmark && (this._cursor = this._bookmark.cursor, this._line = this._bookmark.line, this._col = this._bookmark.col, delete this._bookmark);
    }, readTo: function(f) {
      for (var _ = "", y; _.length < f.length || _.lastIndexOf(f) !== _.length - f.length; )
        if (y = this.read(), y)
          _ += y;
        else
          throw new Error('Expected "' + f + '" at line ' + this._line + ", col " + this._col + ".");
      return _;
    }, readWhile: function(f) {
      for (var _ = "", y = this.read(); y !== null && f(y); )
        _ += y, y = this.read();
      return _;
    }, readMatch: function(f) {
      var _ = this._input.substring(this._cursor), y = null;
      return typeof f == "string" ? _.indexOf(f) === 0 && (y = this.readCount(f.length)) : f instanceof RegExp && f.test(_) && (y = this.readCount(RegExp.lastMatch.length)), y;
    }, readCount: function(f) {
      for (var _ = ""; f--; )
        _ += this.read();
      return _;
    } };
    function r(f, _, y) {
      Error.call(this), this.name = this.constructor.name, this.col = y, this.line = _, this.message = f;
    }
    r.prototype = Object.create(Error.prototype), r.prototype.constructor = r;
    function n(f, _, y, w) {
      this.col = y, this.line = _, this.text = f, this.type = w;
    }
    n.fromToken = function(f) {
      return new n(f.value, f.startLine, f.startCol);
    }, n.prototype = { constructor: n, valueOf: function() {
      return this.toString();
    }, toString: function() {
      return this.text;
    } };
    function l(f, _) {
      this._reader = f ? new t(f.toString()) : null, this._token = null, this._tokenData = _, this._lt = [], this._ltIndex = 0, this._ltIndexCache = [];
    }
    l.createTokenData = function(f) {
      var _ = [], y = /* @__PURE__ */ Object.create(null), w = f.concat([]), S = 0, M = w.length + 1;
      for (w.UNKNOWN = -1, w.unshift({ name: "EOF" }); S < M; S++)
        _.push(w[S].name), w[w[S].name] = S, w[S].text && (y[w[S].text] = S);
      return w.name = function(ae) {
        return _[ae];
      }, w.type = function(ae) {
        return y[ae];
      }, w;
    }, l.prototype = { constructor: l, match: function(f, _) {
      f instanceof Array || (f = [f]);
      for (var y = this.get(_), w = 0, S = f.length; w < S; )
        if (y === f[w++])
          return true;
      return this.unget(), false;
    }, mustMatch: function(f, _) {
      var y;
      if (f instanceof Array || (f = [f]), !this.match.apply(this, arguments))
        throw y = this.LT(1), new r("Expected " + this._tokenData[f[0]].name + " at line " + y.startLine + ", col " + y.startCol + ".", y.startLine, y.startCol);
    }, advance: function(f, _) {
      for (; this.LA(0) !== 0 && !this.match(f, _); )
        this.get();
      return this.LA(0);
    }, get: function(f) {
      var _ = this._tokenData, y = 0, w, S;
      if (this._lt.length && this._ltIndex >= 0 && this._ltIndex < this._lt.length) {
        for (y++, this._token = this._lt[this._ltIndex++], S = _[this._token.type]; S.channel !== void 0 && f !== S.channel && this._ltIndex < this._lt.length; )
          this._token = this._lt[this._ltIndex++], S = _[this._token.type], y++;
        if ((S.channel === void 0 || f === S.channel) && this._ltIndex <= this._lt.length)
          return this._ltIndexCache.push(y), this._token.type;
      }
      return w = this._getToken(), w.type > -1 && !_[w.type].hide && (w.channel = _[w.type].channel, this._token = w, this._lt.push(w), this._ltIndexCache.push(this._lt.length - this._ltIndex + y), this._lt.length > 5 && this._lt.shift(), this._ltIndexCache.length > 5 && this._ltIndexCache.shift(), this._ltIndex = this._lt.length), S = _[w.type], S && (S.hide || S.channel !== void 0 && f !== S.channel) ? this.get(f) : w.type;
    }, LA: function(f) {
      var _ = f, y;
      if (f > 0) {
        if (f > 5)
          throw new Error("Too much lookahead.");
        for (; _; )
          y = this.get(), _--;
        for (; _ < f; )
          this.unget(), _++;
      } else if (f < 0)
        if (this._lt[this._ltIndex + f])
          y = this._lt[this._ltIndex + f].type;
        else
          throw new Error("Too much lookbehind.");
      else
        y = this._token.type;
      return y;
    }, LT: function(f) {
      return this.LA(f), this._lt[this._ltIndex + f - 1];
    }, peek: function() {
      return this.LA(1);
    }, token: function() {
      return this._token;
    }, tokenName: function(f) {
      return f < 0 || f > this._tokenData.length ? "UNKNOWN_TOKEN" : this._tokenData[f].name;
    }, tokenType: function(f) {
      return this._tokenData[f] || -1;
    }, unget: function() {
      if (this._ltIndexCache.length)
        this._ltIndex -= this._ltIndexCache.pop(), this._token = this._lt[this._ltIndex - 1];
      else
        throw new Error("Too much lookahead.");
    } }, ct.util = { __proto__: null, StringReader: t, SyntaxError: r, SyntaxUnit: n, EventTarget: e, TokenStreamBase: l };
  })();
  (function() {
    var e = ct.util.EventTarget, t = ct.util.TokenStreamBase; ct.util.StringReader; var n = ct.util.SyntaxError, l = ct.util.SyntaxUnit, f = { __proto__: null, aliceblue: "#f0f8ff", antiquewhite: "#faebd7", aqua: "#00ffff", aquamarine: "#7fffd4", azure: "#f0ffff", beige: "#f5f5dc", bisque: "#ffe4c4", black: "#000000", blanchedalmond: "#ffebcd", blue: "#0000ff", blueviolet: "#8a2be2", brown: "#a52a2a", burlywood: "#deb887", cadetblue: "#5f9ea0", chartreuse: "#7fff00", chocolate: "#d2691e", coral: "#ff7f50", cornflowerblue: "#6495ed", cornsilk: "#fff8dc", crimson: "#dc143c", cyan: "#00ffff", darkblue: "#00008b", darkcyan: "#008b8b", darkgoldenrod: "#b8860b", darkgray: "#a9a9a9", darkgrey: "#a9a9a9", darkgreen: "#006400", darkkhaki: "#bdb76b", darkmagenta: "#8b008b", darkolivegreen: "#556b2f", darkorange: "#ff8c00", darkorchid: "#9932cc", darkred: "#8b0000", darksalmon: "#e9967a", darkseagreen: "#8fbc8f", darkslateblue: "#483d8b", darkslategray: "#2f4f4f", darkslategrey: "#2f4f4f", darkturquoise: "#00ced1", darkviolet: "#9400d3", deeppink: "#ff1493", deepskyblue: "#00bfff", dimgray: "#696969", dimgrey: "#696969", dodgerblue: "#1e90ff", firebrick: "#b22222", floralwhite: "#fffaf0", forestgreen: "#228b22", fuchsia: "#ff00ff", gainsboro: "#dcdcdc", ghostwhite: "#f8f8ff", gold: "#ffd700", goldenrod: "#daa520", gray: "#808080", grey: "#808080", green: "#008000", greenyellow: "#adff2f", honeydew: "#f0fff0", hotpink: "#ff69b4", indianred: "#cd5c5c", indigo: "#4b0082", ivory: "#fffff0", khaki: "#f0e68c", lavender: "#e6e6fa", lavenderblush: "#fff0f5", lawngreen: "#7cfc00", lemonchiffon: "#fffacd", lightblue: "#add8e6", lightcoral: "#f08080", lightcyan: "#e0ffff", lightgoldenrodyellow: "#fafad2", lightgray: "#d3d3d3", lightgrey: "#d3d3d3", lightgreen: "#90ee90", lightpink: "#ffb6c1", lightsalmon: "#ffa07a", lightseagreen: "#20b2aa", lightskyblue: "#87cefa", lightslategray: "#778899", lightslategrey: "#778899", lightsteelblue: "#b0c4de", lightyellow: "#ffffe0", lime: "#00ff00", limegreen: "#32cd32", linen: "#faf0e6", magenta: "#ff00ff", maroon: "#800000", mediumaquamarine: "#66cdaa", mediumblue: "#0000cd", mediumorchid: "#ba55d3", mediumpurple: "#9370d8", mediumseagreen: "#3cb371", mediumslateblue: "#7b68ee", mediumspringgreen: "#00fa9a", mediumturquoise: "#48d1cc", mediumvioletred: "#c71585", midnightblue: "#191970", mintcream: "#f5fffa", mistyrose: "#ffe4e1", moccasin: "#ffe4b5", navajowhite: "#ffdead", navy: "#000080", oldlace: "#fdf5e6", olive: "#808000", olivedrab: "#6b8e23", orange: "#ffa500", orangered: "#ff4500", orchid: "#da70d6", palegoldenrod: "#eee8aa", palegreen: "#98fb98", paleturquoise: "#afeeee", palevioletred: "#d87093", papayawhip: "#ffefd5", peachpuff: "#ffdab9", peru: "#cd853f", pink: "#ffc0cb", plum: "#dda0dd", powderblue: "#b0e0e6", purple: "#800080", red: "#ff0000", rosybrown: "#bc8f8f", royalblue: "#4169e1", saddlebrown: "#8b4513", salmon: "#fa8072", sandybrown: "#f4a460", seagreen: "#2e8b57", seashell: "#fff5ee", sienna: "#a0522d", silver: "#c0c0c0", skyblue: "#87ceeb", slateblue: "#6a5acd", slategray: "#708090", slategrey: "#708090", snow: "#fffafa", springgreen: "#00ff7f", steelblue: "#4682b4", tan: "#d2b48c", teal: "#008080", thistle: "#d8bfd8", tomato: "#ff6347", turquoise: "#40e0d0", violet: "#ee82ee", wheat: "#f5deb3", white: "#ffffff", whitesmoke: "#f5f5f5", yellow: "#ffff00", yellowgreen: "#9acd32", currentColor: "The value of the 'color' property.", activeBorder: "Active window border.", activecaption: "Active window caption.", appworkspace: "Background color of multiple document interface.", background: "Desktop background.", buttonface: "The face background color for 3-D elements that appear 3-D due to one layer of surrounding border.", buttonhighlight: "The color of the border facing the light source for 3-D elements that appear 3-D due to one layer of surrounding border.", buttonshadow: "The color of the border away from the light source for 3-D elements that appear 3-D due to one layer of surrounding border.", buttontext: "Text on push buttons.", captiontext: "Text in caption, size box, and scrollbar arrow box.", graytext: "Grayed (disabled) text. This color is set to #000 if the current display driver does not support a solid gray color.", greytext: "Greyed (disabled) text. This color is set to #000 if the current display driver does not support a solid grey color.", highlight: "Item(s) selected in a control.", highlighttext: "Text of item(s) selected in a control.", inactiveborder: "Inactive window border.", inactivecaption: "Inactive window caption.", inactivecaptiontext: "Color of text in an inactive caption.", infobackground: "Background color for tooltip controls.", infotext: "Text color for tooltip controls.", menu: "Menu background.", menutext: "Text in menus.", scrollbar: "Scroll bar gray area.", threeddarkshadow: "The color of the darker (generally outer) of the two borders away from the light source for 3-D elements that appear 3-D due to two concentric layers of surrounding border.", threedface: "The face background color for 3-D elements that appear 3-D due to two concentric layers of surrounding border.", threedhighlight: "The color of the lighter (generally outer) of the two borders facing the light source for 3-D elements that appear 3-D due to two concentric layers of surrounding border.", threedlightshadow: "The color of the darker (generally inner) of the two borders facing the light source for 3-D elements that appear 3-D due to two concentric layers of surrounding border.", threedshadow: "The color of the lighter (generally inner) of the two borders away from the light source for 3-D elements that appear 3-D due to two concentric layers of surrounding border.", window: "Window background.", windowframe: "Window frame.", windowtext: "Text in windows." };
    function _(c, h, m) {
      l.call(this, c, h, m, S.COMBINATOR_TYPE), this.type = "unknown", /^\s+$/.test(c) ? this.type = "descendant" : c === ">" ? this.type = "child" : c === "+" ? this.type = "adjacent-sibling" : c === "~" && (this.type = "sibling");
    }
    _.prototype = new l(), _.prototype.constructor = _;
    function y(c, h) {
      l.call(this, "(" + c + (h !== null ? ":" + h : "") + ")", c.startLine, c.startCol, S.MEDIA_FEATURE_TYPE), this.name = c, this.value = h;
    }
    y.prototype = new l(), y.prototype.constructor = y;
    function w(c, h, m, a, o) {
      l.call(this, (c ? c + " " : "") + (h || "") + (h && m.length > 0 ? " and " : "") + m.join(" and "), a, o, S.MEDIA_QUERY_TYPE), this.modifier = c, this.mediaType = h, this.features = m;
    }
    w.prototype = new l(), w.prototype.constructor = w;
    function S(c) {
      e.call(this), this.options = c || {}, this._tokenStream = null;
    }
    S.DEFAULT_TYPE = 0, S.COMBINATOR_TYPE = 1, S.MEDIA_FEATURE_TYPE = 2, S.MEDIA_QUERY_TYPE = 3, S.PROPERTY_NAME_TYPE = 4, S.PROPERTY_VALUE_TYPE = 5, S.PROPERTY_VALUE_PART_TYPE = 6, S.SELECTOR_TYPE = 7, S.SELECTOR_PART_TYPE = 8, S.SELECTOR_SUB_PART_TYPE = 9, S.prototype = function() {
      var c = new e(), h, m = { __proto__: null, constructor: S, DEFAULT_TYPE: 0, COMBINATOR_TYPE: 1, MEDIA_FEATURE_TYPE: 2, MEDIA_QUERY_TYPE: 3, PROPERTY_NAME_TYPE: 4, PROPERTY_VALUE_TYPE: 5, PROPERTY_VALUE_PART_TYPE: 6, SELECTOR_TYPE: 7, SELECTOR_PART_TYPE: 8, SELECTOR_SUB_PART_TYPE: 9, _stylesheet: function() {
        var a = this._tokenStream, o, u, b;
        for (this.fire("startstylesheet"), this._charset(), this._skipCruft(); a.peek() === d.IMPORT_SYM; )
          this._import(), this._skipCruft();
        for (; a.peek() === d.NAMESPACE_SYM; )
          this._namespace(), this._skipCruft();
        for (b = a.peek(); b > d.EOF; ) {
          try {
            switch (b) {
              case d.MEDIA_SYM:
                this._media(), this._skipCruft();
                break;
              case d.PAGE_SYM:
                this._page(), this._skipCruft();
                break;
              case d.FONT_FACE_SYM:
                this._font_face(), this._skipCruft();
                break;
              case d.KEYFRAMES_SYM:
                this._keyframes(), this._skipCruft();
                break;
              case d.VIEWPORT_SYM:
                this._viewport(), this._skipCruft();
                break;
              case d.DOCUMENT_SYM:
                this._document(), this._skipCruft();
                break;
              case d.UNKNOWN_SYM:
                if (a.get(), this.options.strict)
                  throw new n("Unknown @ rule.", a.LT(0).startLine, a.LT(0).startCol);
                for (this.fire({ type: "error", error: null, message: "Unknown @ rule: " + a.LT(0).value + ".", line: a.LT(0).startLine, col: a.LT(0).startCol }), o = 0; a.advance([d.LBRACE, d.RBRACE]) === d.LBRACE; )
                  o++;
                for (; o; )
                  a.advance([d.RBRACE]), o--;
                break;
              case d.S:
                this._readWhitespace();
                break;
              default:
                if (!this._ruleset())
                  switch (b) {
                    case d.CHARSET_SYM:
                      throw u = a.LT(1), this._charset(false), new n("@charset not allowed here.", u.startLine, u.startCol);
                    case d.IMPORT_SYM:
                      throw u = a.LT(1), this._import(false), new n("@import not allowed here.", u.startLine, u.startCol);
                    case d.NAMESPACE_SYM:
                      throw u = a.LT(1), this._namespace(false), new n("@namespace not allowed here.", u.startLine, u.startCol);
                    default:
                      a.get(), this._unexpectedToken(a.token());
                  }
            }
          } catch (T) {
            if (T instanceof n && !this.options.strict)
              this.fire({ type: "error", error: T, message: T.message, line: T.line, col: T.col });
            else
              throw T;
          }
          b = a.peek();
        }
        b !== d.EOF && this._unexpectedToken(a.token()), this.fire("endstylesheet");
      }, _charset: function(a) {
        var o = this._tokenStream, u, b, T, I;
        o.match(d.CHARSET_SYM) && (T = o.token().startLine, I = o.token().startCol, this._readWhitespace(), o.mustMatch(d.STRING), b = o.token(), u = b.value, this._readWhitespace(), o.mustMatch(d.SEMICOLON), a !== false && this.fire({ type: "charset", charset: u, line: T, col: I }));
      }, _import: function(a) {
        var o = this._tokenStream, u, b, T = [];
        o.mustMatch(d.IMPORT_SYM), b = o.token(), this._readWhitespace(), o.mustMatch([d.STRING, d.URI]), u = o.token().value.replace(/^(?:url\()?["']?([^"']+?)["']?\)?$/, "$1"), this._readWhitespace(), T = this._media_query_list(), o.mustMatch(d.SEMICOLON), this._readWhitespace(), a !== false && this.fire({ type: "import", uri: u, media: T, line: b.startLine, col: b.startCol });
      }, _namespace: function(a) {
        var o = this._tokenStream, u, b, T, I;
        o.mustMatch(d.NAMESPACE_SYM), u = o.token().startLine, b = o.token().startCol, this._readWhitespace(), o.match(d.IDENT) && (T = o.token().value, this._readWhitespace()), o.mustMatch([d.STRING, d.URI]), I = o.token().value.replace(/(?:url\()?["']([^"']+)["']\)?/, "$1"), this._readWhitespace(), o.mustMatch(d.SEMICOLON), this._readWhitespace(), a !== false && this.fire({ type: "namespace", prefix: T, uri: I, line: u, col: b });
      }, _media: function() {
        var a = this._tokenStream, o, u, b;
        for (a.mustMatch(d.MEDIA_SYM), o = a.token().startLine, u = a.token().startCol, this._readWhitespace(), b = this._media_query_list(), a.mustMatch(d.LBRACE), this._readWhitespace(), this.fire({ type: "startmedia", media: b, line: o, col: u }); ; )
          if (a.peek() === d.PAGE_SYM)
            this._page();
          else if (a.peek() === d.FONT_FACE_SYM)
            this._font_face();
          else if (a.peek() === d.VIEWPORT_SYM)
            this._viewport();
          else if (a.peek() === d.DOCUMENT_SYM)
            this._document();
          else if (!this._ruleset())
            break;
        a.mustMatch(d.RBRACE), this._readWhitespace(), this.fire({ type: "endmedia", media: b, line: o, col: u });
      }, _media_query_list: function() {
        var a = this._tokenStream, o = [];
        for (this._readWhitespace(), (a.peek() === d.IDENT || a.peek() === d.LPAREN) && o.push(this._media_query()); a.match(d.COMMA); )
          this._readWhitespace(), o.push(this._media_query());
        return o;
      }, _media_query: function() {
        var a = this._tokenStream, o = null, u = null, b = null, T = [];
        if (a.match(d.IDENT) && (u = a.token().value.toLowerCase(), u !== "only" && u !== "not" ? (a.unget(), u = null) : b = a.token()), this._readWhitespace(), a.peek() === d.IDENT ? (o = this._media_type(), b === null && (b = a.token())) : a.peek() === d.LPAREN && (b === null && (b = a.LT(1)), T.push(this._media_expression())), o === null && T.length === 0)
          return null;
        for (this._readWhitespace(); a.match(d.IDENT); )
          a.token().value.toLowerCase() !== "and" && this._unexpectedToken(a.token()), this._readWhitespace(), T.push(this._media_expression());
        return new w(u, o, T, b.startLine, b.startCol);
      }, _media_type: function() {
        return this._media_feature();
      }, _media_expression: function() {
        var a = this._tokenStream, o = null, u, b = null;
        return a.mustMatch(d.LPAREN), o = this._media_feature(), this._readWhitespace(), a.match(d.COLON) && (this._readWhitespace(), u = a.LT(1), b = this._expression()), a.mustMatch(d.RPAREN), this._readWhitespace(), new y(o, b ? new l(b, u.startLine, u.startCol) : null);
      }, _media_feature: function() {
        var a = this._tokenStream;
        return this._readWhitespace(), a.mustMatch(d.IDENT), l.fromToken(a.token());
      }, _page: function() {
        var a = this._tokenStream, o, u, b = null, T = null;
        a.mustMatch(d.PAGE_SYM), o = a.token().startLine, u = a.token().startCol, this._readWhitespace(), a.match(d.IDENT) && (b = a.token().value, b.toLowerCase() === "auto" && this._unexpectedToken(a.token())), a.peek() === d.COLON && (T = this._pseudo_page()), this._readWhitespace(), this.fire({ type: "startpage", id: b, pseudo: T, line: o, col: u }), this._readDeclarations(true, true), this.fire({ type: "endpage", id: b, pseudo: T, line: o, col: u });
      }, _margin: function() {
        var a = this._tokenStream, o, u, b = this._margin_sym();
        return b ? (o = a.token().startLine, u = a.token().startCol, this.fire({ type: "startpagemargin", margin: b, line: o, col: u }), this._readDeclarations(true), this.fire({ type: "endpagemargin", margin: b, line: o, col: u }), true) : false;
      }, _margin_sym: function() {
        var a = this._tokenStream;
        return a.match([d.TOPLEFTCORNER_SYM, d.TOPLEFT_SYM, d.TOPCENTER_SYM, d.TOPRIGHT_SYM, d.TOPRIGHTCORNER_SYM, d.BOTTOMLEFTCORNER_SYM, d.BOTTOMLEFT_SYM, d.BOTTOMCENTER_SYM, d.BOTTOMRIGHT_SYM, d.BOTTOMRIGHTCORNER_SYM, d.LEFTTOP_SYM, d.LEFTMIDDLE_SYM, d.LEFTBOTTOM_SYM, d.RIGHTTOP_SYM, d.RIGHTMIDDLE_SYM, d.RIGHTBOTTOM_SYM]) ? l.fromToken(a.token()) : null;
      }, _pseudo_page: function() {
        var a = this._tokenStream;
        return a.mustMatch(d.COLON), a.mustMatch(d.IDENT), a.token().value;
      }, _font_face: function() {
        var a = this._tokenStream, o, u;
        a.mustMatch(d.FONT_FACE_SYM), o = a.token().startLine, u = a.token().startCol, this._readWhitespace(), this.fire({ type: "startfontface", line: o, col: u }), this._readDeclarations(true), this.fire({ type: "endfontface", line: o, col: u });
      }, _viewport: function() {
        var a = this._tokenStream, o, u;
        a.mustMatch(d.VIEWPORT_SYM), o = a.token().startLine, u = a.token().startCol, this._readWhitespace(), this.fire({ type: "startviewport", line: o, col: u }), this._readDeclarations(true), this.fire({ type: "endviewport", line: o, col: u });
      }, _document: function() {
        var a = this._tokenStream, o, u = [], b = "";
        for (a.mustMatch(d.DOCUMENT_SYM), o = a.token(), /^@\-([^\-]+)\-/.test(o.value) && (b = RegExp.$1), this._readWhitespace(), u.push(this._document_function()); a.match(d.COMMA); )
          this._readWhitespace(), u.push(this._document_function());
        for (a.mustMatch(d.LBRACE), this._readWhitespace(), this.fire({ type: "startdocument", functions: u, prefix: b, line: o.startLine, col: o.startCol }); ; )
          if (a.peek() === d.PAGE_SYM)
            this._page();
          else if (a.peek() === d.FONT_FACE_SYM)
            this._font_face();
          else if (a.peek() === d.VIEWPORT_SYM)
            this._viewport();
          else if (a.peek() === d.MEDIA_SYM)
            this._media();
          else if (!this._ruleset())
            break;
        a.mustMatch(d.RBRACE), this._readWhitespace(), this.fire({ type: "enddocument", functions: u, prefix: b, line: o.startLine, col: o.startCol });
      }, _document_function: function() {
        var a = this._tokenStream, o;
        return a.match(d.URI) ? (o = a.token().value, this._readWhitespace()) : o = this._function(), o;
      }, _operator: function(a) {
        var o = this._tokenStream, u = null;
        return (o.match([d.SLASH, d.COMMA]) || a && o.match([d.PLUS, d.STAR, d.MINUS])) && (u = o.token(), this._readWhitespace()), u ? re.fromToken(u) : null;
      }, _combinator: function() {
        var a = this._tokenStream, o = null, u;
        return a.match([d.PLUS, d.GREATER, d.TILDE]) && (u = a.token(), o = new _(u.value, u.startLine, u.startCol), this._readWhitespace()), o;
      }, _unary_operator: function() {
        var a = this._tokenStream;
        return a.match([d.MINUS, d.PLUS]) ? a.token().value : null;
      }, _property: function() {
        var a = this._tokenStream, o = null, u = null, b, T, I, A;
        return a.peek() === d.STAR && this.options.starHack && (a.get(), T = a.token(), u = T.value, I = T.startLine, A = T.startCol), a.match(d.IDENT) && (T = a.token(), b = T.value, b.charAt(0) === "_" && this.options.underscoreHack && (u = "_", b = b.substring(1)), o = new ae(b, u, I || T.startLine, A || T.startCol), this._readWhitespace()), o;
      }, _ruleset: function() {
        var a = this._tokenStream, o, u;
        try {
          u = this._selectors_group();
        } catch (b) {
          if (b instanceof n && !this.options.strict) {
            if (this.fire({ type: "error", error: b, message: b.message, line: b.line, col: b.col }), o = a.advance([d.RBRACE]), o !== d.RBRACE)
              throw b;
          } else
            throw b;
          return true;
        }
        return u && (this.fire({ type: "startrule", selectors: u, line: u[0].line, col: u[0].col }), this._readDeclarations(true), this.fire({ type: "endrule", selectors: u, line: u[0].line, col: u[0].col })), u;
      }, _selectors_group: function() {
        var a = this._tokenStream, o = [], u;
        if (u = this._selector(), u !== null)
          for (o.push(u); a.match(d.COMMA); )
            this._readWhitespace(), u = this._selector(), u !== null ? o.push(u) : this._unexpectedToken(a.LT(1));
        return o.length ? o : null;
      }, _selector: function() {
        var a = this._tokenStream, o = [], u = null, b = null, T = null;
        if (u = this._simple_selector_sequence(), u === null)
          return null;
        o.push(u);
        do
          if (b = this._combinator(), b !== null)
            o.push(b), u = this._simple_selector_sequence(), u === null ? this._unexpectedToken(a.LT(1)) : o.push(u);
          else if (this._readWhitespace())
            T = new _(a.token().value, a.token().startLine, a.token().startCol), b = this._combinator(), u = this._simple_selector_sequence(), u === null ? b !== null && this._unexpectedToken(a.LT(1)) : (b !== null ? o.push(b) : o.push(T), o.push(u));
          else
            break;
        while (true);
        return new V(o, o[0].line, o[0].col);
      }, _simple_selector_sequence: function() {
        var a = this._tokenStream, o = null, u = [], b = "", T = [function() {
          return a.match(d.HASH) ? new U(a.token().value, "id", a.token().startLine, a.token().startCol) : null;
        }, this._class, this._attrib, this._pseudo, this._negation], I = 0, A = T.length, oe = null, We, dt;
        for (We = a.LT(1).startLine, dt = a.LT(1).startCol, o = this._type_selector(), o || (o = this._universal()), o !== null && (b += o); a.peek() !== d.S; ) {
          for (; I < A && oe === null; )
            oe = T[I++].call(this);
          if (oe === null) {
            if (b === "")
              return null;
            break;
          } else
            I = 0, u.push(oe), b += oe.toString(), oe = null;
        }
        return b !== "" ? new ve(o, u, b, We, dt) : null;
      }, _type_selector: function() {
        var a = this._tokenStream, o = this._namespace_prefix(), u = this._element_name();
        return u ? (o && (u.text = o + u.text, u.col -= o.length), u) : (o && (a.unget(), o.length > 1 && a.unget()), null);
      }, _class: function() {
        var a = this._tokenStream, o;
        return a.match(d.DOT) ? (a.mustMatch(d.IDENT), o = a.token(), new U("." + o.value, "class", o.startLine, o.startCol - 1)) : null;
      }, _element_name: function() {
        var a = this._tokenStream, o;
        return a.match(d.IDENT) ? (o = a.token(), new U(o.value, "elementName", o.startLine, o.startCol)) : null;
      }, _namespace_prefix: function() {
        var a = this._tokenStream, o = "";
        return (a.LA(1) === d.PIPE || a.LA(2) === d.PIPE) && (a.match([d.IDENT, d.STAR]) && (o += a.token().value), a.mustMatch(d.PIPE), o += "|"), o.length ? o : null;
      }, _universal: function() {
        var a = this._tokenStream, o = "", u;
        return u = this._namespace_prefix(), u && (o += u), a.match(d.STAR) && (o += "*"), o.length ? o : null;
      }, _attrib: function() {
        var a = this._tokenStream, o = null, u, b;
        return a.match(d.LBRACKET) ? (b = a.token(), o = b.value, o += this._readWhitespace(), u = this._namespace_prefix(), u && (o += u), a.mustMatch(d.IDENT), o += a.token().value, o += this._readWhitespace(), a.match([d.PREFIXMATCH, d.SUFFIXMATCH, d.SUBSTRINGMATCH, d.EQUALS, d.INCLUDES, d.DASHMATCH]) && (o += a.token().value, o += this._readWhitespace(), a.mustMatch([d.IDENT, d.STRING]), o += a.token().value, o += this._readWhitespace()), a.mustMatch(d.RBRACKET), new U(o + "]", "attribute", b.startLine, b.startCol)) : null;
      }, _pseudo: function() {
        var a = this._tokenStream, o = null, u = ":", b, T;
        return a.match(d.COLON) && (a.match(d.COLON) && (u += ":"), a.match(d.IDENT) ? (o = a.token().value, b = a.token().startLine, T = a.token().startCol - u.length) : a.peek() === d.FUNCTION && (b = a.LT(1).startLine, T = a.LT(1).startCol - u.length, o = this._functional_pseudo()), o && (o = new U(u + o, "pseudo", b, T))), o;
      }, _functional_pseudo: function() {
        var a = this._tokenStream, o = null;
        return a.match(d.FUNCTION) && (o = a.token().value, o += this._readWhitespace(), o += this._expression(), a.mustMatch(d.RPAREN), o += ")"), o;
      }, _expression: function() {
        for (var a = this._tokenStream, o = ""; a.match([d.PLUS, d.MINUS, d.DIMENSION, d.NUMBER, d.STRING, d.IDENT, d.LENGTH, d.FREQ, d.ANGLE, d.TIME, d.RESOLUTION, d.SLASH]); )
          o += a.token().value, o += this._readWhitespace();
        return o.length ? o : null;
      }, _negation: function() {
        var a = this._tokenStream, o, u, b = "", T, I = null;
        return a.match(d.NOT) && (b = a.token().value, o = a.token().startLine, u = a.token().startCol, b += this._readWhitespace(), T = this._negation_arg(), b += T, b += this._readWhitespace(), a.match(d.RPAREN), b += a.token().value, I = new U(b, "not", o, u), I.args.push(T)), I;
      }, _negation_arg: function() {
        var a = this._tokenStream, o = [this._type_selector, this._universal, function() {
          return a.match(d.HASH) ? new U(a.token().value, "id", a.token().startLine, a.token().startCol) : null;
        }, this._class, this._attrib, this._pseudo], u = null, b = 0, T = o.length, I, A, oe;
        for (I = a.LT(1).startLine, A = a.LT(1).startCol; b < T && u === null; )
          u = o[b].call(this), b++;
        return u === null && this._unexpectedToken(a.LT(1)), u.type === "elementName" ? oe = new ve(u, [], u.toString(), I, A) : oe = new ve(null, [u], u.toString(), I, A), oe;
      }, _declaration: function() {
        var a = this._tokenStream, o = null, u = null, b = null, T = null, I = "";
        if (o = this._property(), o !== null) {
          a.mustMatch(d.COLON), this._readWhitespace(), u = this._expr(), (!u || u.length === 0) && this._unexpectedToken(a.LT(1)), b = this._prio(), I = o.toString(), (this.options.starHack && o.hack === "*" || this.options.underscoreHack && o.hack === "_") && (I = o.text);
          try {
            this._validateProperty(I, u);
          } catch (A) {
            T = A;
          }
          return this.fire({ type: "property", property: o, value: u, important: b, line: o.line, col: o.col, invalid: T }), true;
        } else
          return false;
      }, _prio: function() {
        var a = this._tokenStream, o = a.match(d.IMPORTANT_SYM);
        return this._readWhitespace(), o;
      }, _expr: function(a) {
        var o = [], u = null, b = null;
        if (u = this._term(a), u !== null) {
          o.push(u);
          do {
            if (b = this._operator(a), b && o.push(b), u = this._term(a), u === null)
              break;
            o.push(u);
          } while (true);
        }
        return o.length > 0 ? new ce(o, o[0].line, o[0].col) : null;
      }, _term: function(a) {
        var o = this._tokenStream, u = null, b = null, T = null, I, A, oe;
        return u = this._unary_operator(), u !== null && (A = o.token().startLine, oe = o.token().startCol), o.peek() === d.IE_FUNCTION && this.options.ieFilters ? (b = this._ie_function(), u === null && (A = o.token().startLine, oe = o.token().startCol)) : a && o.match([d.LPAREN, d.LBRACE, d.LBRACKET]) ? (I = o.token(), T = I.endChar, b = I.value + this._expr(a).text, u === null && (A = o.token().startLine, oe = o.token().startCol), o.mustMatch(d.type(T)), b += T, this._readWhitespace()) : o.match([d.NUMBER, d.PERCENTAGE, d.LENGTH, d.ANGLE, d.TIME, d.FREQ, d.STRING, d.IDENT, d.URI, d.UNICODE_RANGE]) ? (b = o.token().value, u === null && (A = o.token().startLine, oe = o.token().startCol), this._readWhitespace()) : (I = this._hexcolor(), I === null ? (u === null && (A = o.LT(1).startLine, oe = o.LT(1).startCol), b === null && (o.LA(3) === d.EQUALS && this.options.ieFilters ? b = this._ie_function() : b = this._function())) : (b = I.value, u === null && (A = I.startLine, oe = I.startCol))), b !== null ? new re(u !== null ? u + b : b, A, oe) : null;
      }, _function: function() {
        var a = this._tokenStream, o = null, u = null, b;
        if (a.match(d.FUNCTION)) {
          if (o = a.token().value, this._readWhitespace(), u = this._expr(true), o += u, this.options.ieFilters && a.peek() === d.EQUALS)
            do
              for (this._readWhitespace() && (o += a.token().value), a.LA(0) === d.COMMA && (o += a.token().value), a.match(d.IDENT), o += a.token().value, a.match(d.EQUALS), o += a.token().value, b = a.peek(); b !== d.COMMA && b !== d.S && b !== d.RPAREN; )
                a.get(), o += a.token().value, b = a.peek();
            while (a.match([d.COMMA, d.S]));
          a.match(d.RPAREN), o += ")", this._readWhitespace();
        }
        return o;
      }, _ie_function: function() {
        var a = this._tokenStream, o = null, u;
        if (a.match([d.IE_FUNCTION, d.FUNCTION])) {
          o = a.token().value;
          do
            for (this._readWhitespace() && (o += a.token().value), a.LA(0) === d.COMMA && (o += a.token().value), a.match(d.IDENT), o += a.token().value, a.match(d.EQUALS), o += a.token().value, u = a.peek(); u !== d.COMMA && u !== d.S && u !== d.RPAREN; )
              a.get(), o += a.token().value, u = a.peek();
          while (a.match([d.COMMA, d.S]));
          a.match(d.RPAREN), o += ")", this._readWhitespace();
        }
        return o;
      }, _hexcolor: function() {
        var a = this._tokenStream, o = null, u;
        if (a.match(d.HASH)) {
          if (o = a.token(), u = o.value, !/#[a-f0-9]{3,6}/i.test(u))
            throw new n("Expected a hex color but found '" + u + "' at line " + o.startLine + ", col " + o.startCol + ".", o.startLine, o.startCol);
          this._readWhitespace();
        }
        return o;
      }, _keyframes: function() {
        var a = this._tokenStream, o, u, b, T = "";
        for (a.mustMatch(d.KEYFRAMES_SYM), o = a.token(), /^@\-([^\-]+)\-/.test(o.value) && (T = RegExp.$1), this._readWhitespace(), b = this._keyframe_name(), this._readWhitespace(), a.mustMatch(d.LBRACE), this.fire({ type: "startkeyframes", name: b, prefix: T, line: o.startLine, col: o.startCol }), this._readWhitespace(), u = a.peek(); u === d.IDENT || u === d.PERCENTAGE; )
          this._keyframe_rule(), this._readWhitespace(), u = a.peek();
        this.fire({ type: "endkeyframes", name: b, prefix: T, line: o.startLine, col: o.startCol }), this._readWhitespace(), a.mustMatch(d.RBRACE);
      }, _keyframe_name: function() {
        var a = this._tokenStream;
        return a.mustMatch([d.IDENT, d.STRING]), l.fromToken(a.token());
      }, _keyframe_rule: function() {
        var a = this._key_list();
        this.fire({ type: "startkeyframerule", keys: a, line: a[0].line, col: a[0].col }), this._readDeclarations(true), this.fire({ type: "endkeyframerule", keys: a, line: a[0].line, col: a[0].col });
      }, _key_list: function() {
        var a = this._tokenStream, o = [];
        for (o.push(this._key()), this._readWhitespace(); a.match(d.COMMA); )
          this._readWhitespace(), o.push(this._key()), this._readWhitespace();
        return o;
      }, _key: function() {
        var a = this._tokenStream, o;
        if (a.match(d.PERCENTAGE))
          return l.fromToken(a.token());
        if (a.match(d.IDENT)) {
          if (o = a.token(), /from|to/i.test(o.value))
            return l.fromToken(o);
          a.unget();
        }
        this._unexpectedToken(a.LT(1));
      }, _skipCruft: function() {
        for (; this._tokenStream.match([d.S, d.CDO, d.CDC]); )
          ;
      }, _readDeclarations: function(a, o) {
        var u = this._tokenStream, b;
        this._readWhitespace(), a && u.mustMatch(d.LBRACE), this._readWhitespace();
        try {
          for (; ; ) {
            if (!(u.match(d.SEMICOLON) || o && this._margin()))
              if (this._declaration()) {
                if (!u.match(d.SEMICOLON))
                  break;
              } else
                break;
            this._readWhitespace();
          }
          u.mustMatch(d.RBRACE), this._readWhitespace();
        } catch (T) {
          if (T instanceof n && !this.options.strict) {
            if (this.fire({ type: "error", error: T, message: T.message, line: T.line, col: T.col }), b = u.advance([d.SEMICOLON, d.RBRACE]), b === d.SEMICOLON)
              this._readDeclarations(false, o);
            else if (b !== d.RBRACE)
              throw T;
          } else
            throw T;
        }
      }, _readWhitespace: function() {
        for (var a = this._tokenStream, o = ""; a.match(d.S); )
          o += a.token().value;
        return o;
      }, _unexpectedToken: function(a) {
        throw new n("Unexpected token '" + a.value + "' at line " + a.startLine + ", col " + a.startCol + ".", a.startLine, a.startCol);
      }, _verifyEnd: function() {
        this._tokenStream.LA(1) !== d.EOF && this._unexpectedToken(this._tokenStream.LT(1));
      }, _validateProperty: function(a, o) {
        Xe.validate(a, o);
      }, parse: function(a) {
        this._tokenStream = new p(a), this._stylesheet();
      }, parseStyleSheet: function(a) {
        return this.parse(a);
      }, parseMediaQuery: function(a) {
        this._tokenStream = new p(a);
        var o = this._media_query();
        return this._verifyEnd(), o;
      }, parsePropertyValue: function(a) {
        this._tokenStream = new p(a), this._readWhitespace();
        var o = this._expr();
        return this._readWhitespace(), this._verifyEnd(), o;
      }, parseRule: function(a) {
        this._tokenStream = new p(a), this._readWhitespace();
        var o = this._ruleset();
        return this._readWhitespace(), this._verifyEnd(), o;
      }, parseSelector: function(a) {
        this._tokenStream = new p(a), this._readWhitespace();
        var o = this._selector();
        return this._readWhitespace(), this._verifyEnd(), o;
      }, parseStyleAttribute: function(a) {
        a += "}", this._tokenStream = new p(a), this._readDeclarations();
      } };
      for (h in m)
        Object.prototype.hasOwnProperty.call(m, h) && (c[h] = m[h]);
      return c;
    }();
    var M = { __proto__: null, "align-items": "flex-start | flex-end | center | baseline | stretch", "align-content": "flex-start | flex-end | center | space-between | space-around | stretch", "align-self": "auto | flex-start | flex-end | center | baseline | stretch", "-webkit-align-items": "flex-start | flex-end | center | baseline | stretch", "-webkit-align-content": "flex-start | flex-end | center | space-between | space-around | stretch", "-webkit-align-self": "auto | flex-start | flex-end | center | baseline | stretch", "alignment-adjust": "auto | baseline | before-edge | text-before-edge | middle | central | after-edge | text-after-edge | ideographic | alphabetic | hanging | mathematical | <percentage> | <length>", "alignment-baseline": "baseline | use-script | before-edge | text-before-edge | after-edge | text-after-edge | central | middle | ideographic | alphabetic | hanging | mathematical", animation: 1, "animation-delay": { multi: "<time>", comma: true }, "animation-direction": { multi: "normal | alternate", comma: true }, "animation-duration": { multi: "<time>", comma: true }, "animation-fill-mode": { multi: "none | forwards | backwards | both", comma: true }, "animation-iteration-count": { multi: "<number> | infinite", comma: true }, "animation-name": { multi: "none | <ident>", comma: true }, "animation-play-state": { multi: "running | paused", comma: true }, "animation-timing-function": 1, "-moz-animation-delay": { multi: "<time>", comma: true }, "-moz-animation-direction": { multi: "normal | alternate", comma: true }, "-moz-animation-duration": { multi: "<time>", comma: true }, "-moz-animation-iteration-count": { multi: "<number> | infinite", comma: true }, "-moz-animation-name": { multi: "none | <ident>", comma: true }, "-moz-animation-play-state": { multi: "running | paused", comma: true }, "-ms-animation-delay": { multi: "<time>", comma: true }, "-ms-animation-direction": { multi: "normal | alternate", comma: true }, "-ms-animation-duration": { multi: "<time>", comma: true }, "-ms-animation-iteration-count": { multi: "<number> | infinite", comma: true }, "-ms-animation-name": { multi: "none | <ident>", comma: true }, "-ms-animation-play-state": { multi: "running | paused", comma: true }, "-webkit-animation-delay": { multi: "<time>", comma: true }, "-webkit-animation-direction": { multi: "normal | alternate", comma: true }, "-webkit-animation-duration": { multi: "<time>", comma: true }, "-webkit-animation-fill-mode": { multi: "none | forwards | backwards | both", comma: true }, "-webkit-animation-iteration-count": { multi: "<number> | infinite", comma: true }, "-webkit-animation-name": { multi: "none | <ident>", comma: true }, "-webkit-animation-play-state": { multi: "running | paused", comma: true }, "-o-animation-delay": { multi: "<time>", comma: true }, "-o-animation-direction": { multi: "normal | alternate", comma: true }, "-o-animation-duration": { multi: "<time>", comma: true }, "-o-animation-iteration-count": { multi: "<number> | infinite", comma: true }, "-o-animation-name": { multi: "none | <ident>", comma: true }, "-o-animation-play-state": { multi: "running | paused", comma: true }, appearance: "icon | window | desktop | workspace | document | tooltip | dialog | button | push-button | hyperlink | radio | radio-button | checkbox | menu-item | tab | menu | menubar | pull-down-menu | pop-up-menu | list-menu | radio-group | checkbox-group | outline-tree | range | field | combo-box | signature | password | normal | none | inherit", azimuth: function(c) {
      var h = "<angle> | leftwards | rightwards | inherit", m = "left-side | far-left | left | center-left | center | center-right | right | far-right | right-side", a = false, o = false, u;
      if (L.isAny(c, h) || (L.isAny(c, "behind") && (a = true, o = true), L.isAny(c, m) && (o = true, a || L.isAny(c, "behind"))), c.hasNext())
        throw u = c.next(), o ? new se("Expected end of value but found '" + u + "'.", u.line, u.col) : new se("Expected (<'azimuth'>) but found '" + u + "'.", u.line, u.col);
    }, "backface-visibility": "visible | hidden", background: 1, "background-attachment": { multi: "<attachment>", comma: true }, "background-clip": { multi: "<box>", comma: true }, "background-color": "<color> | inherit", "background-image": { multi: "<bg-image>", comma: true }, "background-origin": { multi: "<box>", comma: true }, "background-position": { multi: "<bg-position>", comma: true }, "background-repeat": { multi: "<repeat-style>" }, "background-size": { multi: "<bg-size>", comma: true }, "baseline-shift": "baseline | sub | super | <percentage> | <length>", behavior: 1, binding: 1, bleed: "<length>", "bookmark-label": "<content> | <attr> | <string>", "bookmark-level": "none | <integer>", "bookmark-state": "open | closed", "bookmark-target": "none | <uri> | <attr>", border: "<border-width> || <border-style> || <color>", "border-bottom": "<border-width> || <border-style> || <color>", "border-bottom-color": "<color> | inherit", "border-bottom-left-radius": "<x-one-radius>", "border-bottom-right-radius": "<x-one-radius>", "border-bottom-style": "<border-style>", "border-bottom-width": "<border-width>", "border-collapse": "collapse | separate | inherit", "border-color": { multi: "<color> | inherit", max: 4 }, "border-image": 1, "border-image-outset": { multi: "<length> | <number>", max: 4 }, "border-image-repeat": { multi: "stretch | repeat | round", max: 2 }, "border-image-slice": function(c) {
      var h = false, m = "<number> | <percentage>", a = false, o = 0, u = 4, b;
      for (L.isAny(c, "fill") && (a = true, h = true); c.hasNext() && o < u && (h = L.isAny(c, m), !!h); )
        o++;
      if (a ? h = true : L.isAny(c, "fill"), c.hasNext())
        throw b = c.next(), h ? new se("Expected end of value but found '" + b + "'.", b.line, b.col) : new se("Expected ([<number> | <percentage>]{1,4} && fill?) but found '" + b + "'.", b.line, b.col);
    }, "border-image-source": "<image> | none", "border-image-width": { multi: "<length> | <percentage> | <number> | auto", max: 4 }, "border-left": "<border-width> || <border-style> || <color>", "border-left-color": "<color> | inherit", "border-left-style": "<border-style>", "border-left-width": "<border-width>", "border-radius": function(c) {
      for (var h = false, m = "<length> | <percentage> | inherit", a = false, o = 0, u = 8, b; c.hasNext() && o < u; ) {
        if (h = L.isAny(c, m), !h)
          if (String(c.peek()) === "/" && o > 0 && !a)
            a = true, u = o + 5, c.next();
          else
            break;
        o++;
      }
      if (c.hasNext())
        throw b = c.next(), h ? new se("Expected end of value but found '" + b + "'.", b.line, b.col) : new se("Expected (<'border-radius'>) but found '" + b + "'.", b.line, b.col);
    }, "border-right": "<border-width> || <border-style> || <color>", "border-right-color": "<color> | inherit", "border-right-style": "<border-style>", "border-right-width": "<border-width>", "border-spacing": { multi: "<length> | inherit", max: 2 }, "border-style": { multi: "<border-style>", max: 4 }, "border-top": "<border-width> || <border-style> || <color>", "border-top-color": "<color> | inherit", "border-top-left-radius": "<x-one-radius>", "border-top-right-radius": "<x-one-radius>", "border-top-style": "<border-style>", "border-top-width": "<border-width>", "border-width": { multi: "<border-width>", max: 4 }, bottom: "<margin-width> | inherit", "-moz-box-align": "start | end | center | baseline | stretch", "-moz-box-decoration-break": "slice |clone", "-moz-box-direction": "normal | reverse | inherit", "-moz-box-flex": "<number>", "-moz-box-flex-group": "<integer>", "-moz-box-lines": "single | multiple", "-moz-box-ordinal-group": "<integer>", "-moz-box-orient": "horizontal | vertical | inline-axis | block-axis | inherit", "-moz-box-pack": "start | end | center | justify", "-o-box-decoration-break": "slice | clone", "-webkit-box-align": "start | end | center | baseline | stretch", "-webkit-box-decoration-break": "slice |clone", "-webkit-box-direction": "normal | reverse | inherit", "-webkit-box-flex": "<number>", "-webkit-box-flex-group": "<integer>", "-webkit-box-lines": "single | multiple", "-webkit-box-ordinal-group": "<integer>", "-webkit-box-orient": "horizontal | vertical | inline-axis | block-axis | inherit", "-webkit-box-pack": "start | end | center | justify", "box-decoration-break": "slice | clone", "box-shadow": function(c) {
      var h;
      if (!L.isAny(c, "none"))
        Xe.multiProperty("<shadow>", c, true, 1 / 0);
      else if (c.hasNext())
        throw h = c.next(), new se("Expected end of value but found '" + h + "'.", h.line, h.col);
    }, "box-sizing": "content-box | border-box | inherit", "break-after": "auto | always | avoid | left | right | page | column | avoid-page | avoid-column", "break-before": "auto | always | avoid | left | right | page | column | avoid-page | avoid-column", "break-inside": "auto | avoid | avoid-page | avoid-column", "caption-side": "top | bottom | inherit", clear: "none | right | left | both | inherit", clip: 1, color: "<color> | inherit", "color-profile": 1, "column-count": "<integer> | auto", "column-fill": "auto | balance", "column-gap": "<length> | normal", "column-rule": "<border-width> || <border-style> || <color>", "column-rule-color": "<color>", "column-rule-style": "<border-style>", "column-rule-width": "<border-width>", "column-span": "none | all", "column-width": "<length> | auto", columns: 1, content: 1, "counter-increment": 1, "counter-reset": 1, crop: "<shape> | auto", cue: "cue-after | cue-before | inherit", "cue-after": 1, "cue-before": 1, cursor: 1, direction: "ltr | rtl | inherit", display: "inline | block | list-item | inline-block | table | inline-table | table-row-group | table-header-group | table-footer-group | table-row | table-column-group | table-column | table-cell | table-caption | grid | inline-grid | run-in | ruby | ruby-base | ruby-text | ruby-base-container | ruby-text-container | contents | none | inherit | -moz-box | -moz-inline-block | -moz-inline-box | -moz-inline-grid | -moz-inline-stack | -moz-inline-table | -moz-grid | -moz-grid-group | -moz-grid-line | -moz-groupbox | -moz-deck | -moz-popup | -moz-stack | -moz-marker | -webkit-box | -webkit-inline-box | -ms-flexbox | -ms-inline-flexbox | flex | -webkit-flex | inline-flex | -webkit-inline-flex", "dominant-baseline": 1, "drop-initial-after-adjust": "central | middle | after-edge | text-after-edge | ideographic | alphabetic | mathematical | <percentage> | <length>", "drop-initial-after-align": "baseline | use-script | before-edge | text-before-edge | after-edge | text-after-edge | central | middle | ideographic | alphabetic | hanging | mathematical", "drop-initial-before-adjust": "before-edge | text-before-edge | central | middle | hanging | mathematical | <percentage> | <length>", "drop-initial-before-align": "caps-height | baseline | use-script | before-edge | text-before-edge | after-edge | text-after-edge | central | middle | ideographic | alphabetic | hanging | mathematical", "drop-initial-size": "auto | line | <length> | <percentage>", "drop-initial-value": "initial | <integer>", elevation: "<angle> | below | level | above | higher | lower | inherit", "empty-cells": "show | hide | inherit", filter: 1, fit: "fill | hidden | meet | slice", "fit-position": 1, flex: "<flex>", "flex-basis": "<width>", "flex-direction": "row | row-reverse | column | column-reverse", "flex-flow": "<flex-direction> || <flex-wrap>", "flex-grow": "<number>", "flex-shrink": "<number>", "flex-wrap": "nowrap | wrap | wrap-reverse", "-webkit-flex": "<flex>", "-webkit-flex-basis": "<width>", "-webkit-flex-direction": "row | row-reverse | column | column-reverse", "-webkit-flex-flow": "<flex-direction> || <flex-wrap>", "-webkit-flex-grow": "<number>", "-webkit-flex-shrink": "<number>", "-webkit-flex-wrap": "nowrap | wrap | wrap-reverse", "-ms-flex": "<flex>", "-ms-flex-align": "start | end | center | stretch | baseline", "-ms-flex-direction": "row | row-reverse | column | column-reverse | inherit", "-ms-flex-order": "<number>", "-ms-flex-pack": "start | end | center | justify", "-ms-flex-wrap": "nowrap | wrap | wrap-reverse", float: "left | right | none | inherit", "float-offset": 1, font: 1, "font-family": 1, "font-feature-settings": "<feature-tag-value> | normal | inherit", "font-kerning": "auto | normal | none | initial | inherit | unset", "font-size": "<absolute-size> | <relative-size> | <length> | <percentage> | inherit", "font-size-adjust": "<number> | none | inherit", "font-stretch": "normal | ultra-condensed | extra-condensed | condensed | semi-condensed | semi-expanded | expanded | extra-expanded | ultra-expanded | inherit", "font-style": "normal | italic | oblique | inherit", "font-variant": "normal | small-caps | inherit", "font-variant-caps": "normal | small-caps | all-small-caps | petite-caps | all-petite-caps | unicase | titling-caps", "font-variant-position": "normal | sub | super | inherit | initial | unset", "font-weight": "normal | bold | bolder | lighter | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | inherit", grid: 1, "grid-area": 1, "grid-auto-columns": 1, "grid-auto-flow": 1, "grid-auto-position": 1, "grid-auto-rows": 1, "grid-cell-stacking": "columns | rows | layer", "grid-column": 1, "grid-columns": 1, "grid-column-align": "start | end | center | stretch", "grid-column-sizing": 1, "grid-column-start": 1, "grid-column-end": 1, "grid-column-span": "<integer>", "grid-flow": "none | rows | columns", "grid-layer": "<integer>", "grid-row": 1, "grid-rows": 1, "grid-row-align": "start | end | center | stretch", "grid-row-start": 1, "grid-row-end": 1, "grid-row-span": "<integer>", "grid-row-sizing": 1, "grid-template": 1, "grid-template-areas": 1, "grid-template-columns": 1, "grid-template-rows": 1, "hanging-punctuation": 1, height: "<margin-width> | <content-sizing> | inherit", "hyphenate-after": "<integer> | auto", "hyphenate-before": "<integer> | auto", "hyphenate-character": "<string> | auto", "hyphenate-lines": "no-limit | <integer>", "hyphenate-resource": 1, hyphens: "none | manual | auto", icon: 1, "image-orientation": "angle | auto", "image-rendering": 1, "image-resolution": 1, "ime-mode": "auto | normal | active | inactive | disabled | inherit", "inline-box-align": "initial | last | <integer>", "justify-content": "flex-start | flex-end | center | space-between | space-around", "-webkit-justify-content": "flex-start | flex-end | center | space-between | space-around", left: "<margin-width> | inherit", "letter-spacing": "<length> | normal | inherit", "line-height": "<number> | <length> | <percentage> | normal | inherit", "line-break": "auto | loose | normal | strict", "line-stacking": 1, "line-stacking-ruby": "exclude-ruby | include-ruby", "line-stacking-shift": "consider-shifts | disregard-shifts", "line-stacking-strategy": "inline-line-height | block-line-height | max-height | grid-height", "list-style": 1, "list-style-image": "<uri> | none | inherit", "list-style-position": "inside | outside | inherit", "list-style-type": "disc | circle | square | decimal | decimal-leading-zero | lower-roman | upper-roman | lower-greek | lower-latin | upper-latin | armenian | georgian | lower-alpha | upper-alpha | none | inherit", margin: { multi: "<margin-width> | inherit", max: 4 }, "margin-bottom": "<margin-width> | inherit", "margin-left": "<margin-width> | inherit", "margin-right": "<margin-width> | inherit", "margin-top": "<margin-width> | inherit", mark: 1, "mark-after": 1, "mark-before": 1, marks: 1, "marquee-direction": 1, "marquee-play-count": 1, "marquee-speed": 1, "marquee-style": 1, "max-height": "<length> | <percentage> | <content-sizing> | none | inherit", "max-width": "<length> | <percentage> | <content-sizing> | none | inherit", "min-height": "<length> | <percentage> | <content-sizing> | contain-floats | -moz-contain-floats | -webkit-contain-floats | inherit", "min-width": "<length> | <percentage> | <content-sizing> | contain-floats | -moz-contain-floats | -webkit-contain-floats | inherit", "move-to": 1, "nav-down": 1, "nav-index": 1, "nav-left": 1, "nav-right": 1, "nav-up": 1, "object-fit": "fill | contain | cover | none | scale-down", "object-position": "<bg-position>", opacity: "<number> | inherit", order: "<integer>", "-webkit-order": "<integer>", orphans: "<integer> | inherit", outline: 1, "outline-color": "<color> | invert | inherit", "outline-offset": 1, "outline-style": "<border-style> | inherit", "outline-width": "<border-width> | inherit", overflow: "visible | hidden | scroll | auto | inherit", "overflow-style": 1, "overflow-wrap": "normal | break-word", "overflow-x": 1, "overflow-y": 1, padding: { multi: "<padding-width> | inherit", max: 4 }, "padding-bottom": "<padding-width> | inherit", "padding-left": "<padding-width> | inherit", "padding-right": "<padding-width> | inherit", "padding-top": "<padding-width> | inherit", page: 1, "page-break-after": "auto | always | avoid | left | right | inherit", "page-break-before": "auto | always | avoid | left | right | inherit", "page-break-inside": "auto | avoid | inherit", "page-policy": 1, pause: 1, "pause-after": 1, "pause-before": 1, perspective: 1, "perspective-origin": 1, phonemes: 1, pitch: 1, "pitch-range": 1, "play-during": 1, "pointer-events": "auto | none | visiblePainted | visibleFill | visibleStroke | visible | painted | fill | stroke | all | inherit", position: "static | relative | absolute | fixed | inherit", "presentation-level": 1, "punctuation-trim": 1, quotes: 1, "rendering-intent": 1, resize: 1, rest: 1, "rest-after": 1, "rest-before": 1, richness: 1, right: "<margin-width> | inherit", rotation: 1, "rotation-point": 1, "ruby-align": 1, "ruby-overhang": 1, "ruby-position": 1, "ruby-span": 1, size: 1, speak: "normal | none | spell-out | inherit", "speak-header": "once | always | inherit", "speak-numeral": "digits | continuous | inherit", "speak-punctuation": "code | none | inherit", "speech-rate": 1, src: 1, stress: 1, "string-set": 1, "table-layout": "auto | fixed | inherit", "tab-size": "<integer> | <length>", target: 1, "target-name": 1, "target-new": 1, "target-position": 1, "text-align": "left | right | center | justify | match-parent | start | end | inherit", "text-align-last": 1, "text-decoration": 1, "text-emphasis": 1, "text-height": 1, "text-indent": "<length> | <percentage> | inherit", "text-justify": "auto | none | inter-word | inter-ideograph | inter-cluster | distribute | kashida", "text-outline": 1, "text-overflow": 1, "text-rendering": "auto | optimizeSpeed | optimizeLegibility | geometricPrecision | inherit", "text-shadow": 1, "text-transform": "capitalize | uppercase | lowercase | none | inherit", "text-wrap": "normal | none | avoid", top: "<margin-width> | inherit", "-ms-touch-action": "auto | none | pan-x | pan-y | pan-left | pan-right | pan-up | pan-down | manipulation", "touch-action": "auto | none | pan-x | pan-y | pan-left | pan-right | pan-up | pan-down | manipulation", transform: 1, "transform-origin": 1, "transform-style": 1, transition: 1, "transition-delay": 1, "transition-duration": 1, "transition-property": 1, "transition-timing-function": 1, "unicode-bidi": "normal | embed | isolate | bidi-override | isolate-override | plaintext | inherit", "user-modify": "read-only | read-write | write-only | inherit", "user-select": "none | text | toggle | element | elements | all | inherit", "vertical-align": "auto | use-script | baseline | sub | super | top | text-top | central | middle | bottom | text-bottom | <percentage> | <length> | inherit", visibility: "visible | hidden | collapse | inherit", "voice-balance": 1, "voice-duration": 1, "voice-family": 1, "voice-pitch": 1, "voice-pitch-range": 1, "voice-rate": 1, "voice-stress": 1, "voice-volume": 1, volume: 1, "white-space": "normal | pre | nowrap | pre-wrap | pre-line | inherit | -pre-wrap | -o-pre-wrap | -moz-pre-wrap | -hp-pre-wrap", "white-space-collapse": 1, widows: "<integer> | inherit", width: "<length> | <percentage> | <content-sizing> | auto | inherit", "will-change": { multi: "<ident>", comma: true }, "word-break": "normal | keep-all | break-all", "word-spacing": "<length> | normal | inherit", "word-wrap": "normal | break-word", "writing-mode": "horizontal-tb | vertical-rl | vertical-lr | lr-tb | rl-tb | tb-rl | bt-rl | tb-lr | bt-lr | lr-bt | rl-bt | lr | rl | tb | inherit", "z-index": "<integer> | auto | inherit", zoom: "<number> | <percentage> | normal" };
    function ae(c, h, m, a) {
      l.call(this, c, m, a, S.PROPERTY_NAME_TYPE), this.hack = h;
    }
    ae.prototype = new l(), ae.prototype.constructor = ae, ae.prototype.toString = function() {
      return (this.hack ? this.hack : "") + this.text;
    };
    function ce(c, h, m) {
      l.call(this, c.join(" "), h, m, S.PROPERTY_VALUE_TYPE), this.parts = c;
    }
    ce.prototype = new l(), ce.prototype.constructor = ce;
    function g(c) {
      this._i = 0, this._parts = c.parts, this._marks = [], this.value = c;
    }
    g.prototype.count = function() {
      return this._parts.length;
    }, g.prototype.isFirst = function() {
      return this._i === 0;
    }, g.prototype.hasNext = function() {
      return this._i < this._parts.length;
    }, g.prototype.mark = function() {
      this._marks.push(this._i);
    }, g.prototype.peek = function(c) {
      return this.hasNext() ? this._parts[this._i + (c || 0)] : null;
    }, g.prototype.next = function() {
      return this.hasNext() ? this._parts[this._i++] : null;
    }, g.prototype.previous = function() {
      return this._i > 0 ? this._parts[--this._i] : null;
    }, g.prototype.restore = function() {
      this._marks.length && (this._i = this._marks.pop());
    };
    function re(c, h, m) {
      l.call(this, c, h, m, S.PROPERTY_VALUE_PART_TYPE), this.type = "unknown";
      var a;
      if (/^([+\-]?[\d\.]+)([a-z]+)$/i.test(c))
        switch (this.type = "dimension", this.value = +RegExp.$1, this.units = RegExp.$2, this.units.toLowerCase()) {
          case "em":
          case "rem":
          case "ex":
          case "px":
          case "cm":
          case "mm":
          case "in":
          case "pt":
          case "pc":
          case "ch":
          case "vh":
          case "vw":
          case "vmax":
          case "vmin":
            this.type = "length";
            break;
          case "fr":
            this.type = "grid";
            break;
          case "deg":
          case "rad":
          case "grad":
            this.type = "angle";
            break;
          case "ms":
          case "s":
            this.type = "time";
            break;
          case "hz":
          case "khz":
            this.type = "frequency";
            break;
          case "dpi":
          case "dpcm":
            this.type = "resolution";
            break;
        }
      else
        /^([+\-]?[\d\.]+)%$/i.test(c) ? (this.type = "percentage", this.value = +RegExp.$1) : /^([+\-]?\d+)$/i.test(c) ? (this.type = "integer", this.value = +RegExp.$1) : /^([+\-]?[\d\.]+)$/i.test(c) ? (this.type = "number", this.value = +RegExp.$1) : /^#([a-f0-9]{3,6})/i.test(c) ? (this.type = "color", a = RegExp.$1, a.length === 3 ? (this.red = parseInt(a.charAt(0) + a.charAt(0), 16), this.green = parseInt(a.charAt(1) + a.charAt(1), 16), this.blue = parseInt(a.charAt(2) + a.charAt(2), 16)) : (this.red = parseInt(a.substring(0, 2), 16), this.green = parseInt(a.substring(2, 4), 16), this.blue = parseInt(a.substring(4, 6), 16))) : /^rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/i.test(c) ? (this.type = "color", this.red = +RegExp.$1, this.green = +RegExp.$2, this.blue = +RegExp.$3) : /^rgb\(\s*(\d+)%\s*,\s*(\d+)%\s*,\s*(\d+)%\s*\)/i.test(c) ? (this.type = "color", this.red = +RegExp.$1 * 255 / 100, this.green = +RegExp.$2 * 255 / 100, this.blue = +RegExp.$3 * 255 / 100) : /^rgba\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*([\d\.]+)\s*\)/i.test(c) ? (this.type = "color", this.red = +RegExp.$1, this.green = +RegExp.$2, this.blue = +RegExp.$3, this.alpha = +RegExp.$4) : /^rgba\(\s*(\d+)%\s*,\s*(\d+)%\s*,\s*(\d+)%\s*,\s*([\d\.]+)\s*\)/i.test(c) ? (this.type = "color", this.red = +RegExp.$1 * 255 / 100, this.green = +RegExp.$2 * 255 / 100, this.blue = +RegExp.$3 * 255 / 100, this.alpha = +RegExp.$4) : /^hsl\(\s*(\d+)\s*,\s*(\d+)%\s*,\s*(\d+)%\s*\)/i.test(c) ? (this.type = "color", this.hue = +RegExp.$1, this.saturation = +RegExp.$2 / 100, this.lightness = +RegExp.$3 / 100) : /^hsla\(\s*(\d+)\s*,\s*(\d+)%\s*,\s*(\d+)%\s*,\s*([\d\.]+)\s*\)/i.test(c) ? (this.type = "color", this.hue = +RegExp.$1, this.saturation = +RegExp.$2 / 100, this.lightness = +RegExp.$3 / 100, this.alpha = +RegExp.$4) : /^url\(["']?([^\)"']+)["']?\)/i.test(c) ? (this.type = "uri", this.uri = RegExp.$1) : /^([^\(]+)\(/i.test(c) ? (this.type = "function", this.name = RegExp.$1, this.value = c) : /^"([^\n\r\f\\"]|\\\r\n|\\[^\r0-9a-f]|\\[0-9a-f]{1,6}(\r\n|[ \n\r\t\f])?)*"/i.test(c) ? (this.type = "string", this.value = re.parseString(c)) : /^'([^\n\r\f\\']|\\\r\n|\\[^\r0-9a-f]|\\[0-9a-f]{1,6}(\r\n|[ \n\r\t\f])?)*'/i.test(c) ? (this.type = "string", this.value = re.parseString(c)) : f[c.toLowerCase()] ? (this.type = "color", a = f[c.toLowerCase()].substring(1), this.red = parseInt(a.substring(0, 2), 16), this.green = parseInt(a.substring(2, 4), 16), this.blue = parseInt(a.substring(4, 6), 16)) : /^[\,\/]$/.test(c) ? (this.type = "operator", this.value = c) : /^[a-z\-_\u0080-\uFFFF][a-z0-9\-_\u0080-\uFFFF]*$/i.test(c) && (this.type = "identifier", this.value = c);
    }
    re.prototype = new l(), re.prototype.constructor = re, re.parseString = function(c) {
      c = c.slice(1, -1);
      var h = function(m, a) {
        if (/^(\n|\r\n|\r|\f)$/.test(a))
          return "";
        var o = /^[0-9a-f]{1,6}/i.exec(a);
        if (o) {
          var u = parseInt(o[0], 16);
          return String.fromCodePoint ? String.fromCodePoint(u) : String.fromCharCode(u);
        }
        return a;
      };
      return c.replace(/\\(\r\n|[^\r0-9a-f]|[0-9a-f]{1,6}(\r\n|[ \n\r\t\f])?)/gi, h);
    }, re.serializeString = function(c) {
      var h = function(m, a) {
        if (a === '"')
          return "\\" + a;
        var o = String.codePointAt ? String.codePointAt(0) : String.charCodeAt(0);
        return "\\" + o.toString(16) + " ";
      };
      return '"' + c.replace(/["\r\n\f]/g, h) + '"';
    }, re.fromToken = function(c) {
      return new re(c.value, c.startLine, c.startCol);
    };
    var $ = { __proto__: null, ":first-letter": 1, ":first-line": 1, ":before": 1, ":after": 1 };
    $.ELEMENT = 1, $.CLASS = 2, $.isElement = function(c) {
      return c.indexOf("::") === 0 || $[c.toLowerCase()] === $.ELEMENT;
    };
    function V(c, h, m) {
      l.call(this, c.join(" "), h, m, S.SELECTOR_TYPE), this.parts = c, this.specificity = ie.calculate(this);
    }
    V.prototype = new l(), V.prototype.constructor = V;
    function ve(c, h, m, a, o) {
      l.call(this, m, a, o, S.SELECTOR_PART_TYPE), this.elementName = c, this.modifiers = h;
    }
    ve.prototype = new l(), ve.prototype.constructor = ve;
    function U(c, h, m, a) {
      l.call(this, c, m, a, S.SELECTOR_SUB_PART_TYPE), this.type = h, this.args = [];
    }
    U.prototype = new l(), U.prototype.constructor = U;
    function ie(c, h, m, a) {
      this.a = c, this.b = h, this.c = m, this.d = a;
    }
    ie.prototype = { constructor: ie, compare: function(c) {
      var h = ["a", "b", "c", "d"], m, a;
      for (m = 0, a = h.length; m < a; m++) {
        if (this[h[m]] < c[h[m]])
          return -1;
        if (this[h[m]] > c[h[m]])
          return 1;
      }
      return 0;
    }, valueOf: function() {
      return this.a * 1e3 + this.b * 100 + this.c * 10 + this.d;
    }, toString: function() {
      return this.a + "," + this.b + "," + this.c + "," + this.d;
    } }, ie.calculate = function(c) {
      var h, m, a, o = 0, u = 0, b = 0;
      function T(I) {
        var A, oe, We, dt, Be = I.elementName ? I.elementName.text : "", kt;
        for (Be && Be.charAt(Be.length - 1) !== "*" && b++, A = 0, We = I.modifiers.length; A < We; A++)
          switch (kt = I.modifiers[A], kt.type) {
            case "class":
            case "attribute":
              u++;
              break;
            case "id":
              o++;
              break;
            case "pseudo":
              $.isElement(kt.text) ? b++ : u++;
              break;
            case "not":
              for (oe = 0, dt = kt.args.length; oe < dt; oe++)
                T(kt.args[oe]);
          }
      }
      for (h = 0, m = c.parts.length; h < m; h++)
        a = c.parts[h], a instanceof ve && T(a);
      return new ie(0, o, u, b);
    };
    var be = /^[0-9a-fA-F]$/, ne = /\n|\r\n|\r|\f/;
    function qe(c) {
      return c !== null && be.test(c);
    }
    function He(c) {
      return c !== null && /\d/.test(c);
    }
    function Ae(c) {
      return c !== null && /\s/.test(c);
    }
    function Me(c) {
      return c !== null && ne.test(c);
    }
    function ft(c) {
      return c !== null && /[a-z_\u0080-\uFFFF\\]/i.test(c);
    }
    function k(c) {
      return c !== null && (ft(c) || /[0-9\-\\]/.test(c));
    }
    function Pe(c) {
      return c !== null && (ft(c) || /\-\\/.test(c));
    }
    function Ge(c, h) {
      for (var m in h)
        Object.prototype.hasOwnProperty.call(h, m) && (c[m] = h[m]);
      return c;
    }
    function p(c) {
      t.call(this, c, d);
    }
    p.prototype = Ge(new t(), { _getToken: function(c) {
      var h, m = this._reader, a = null, o = m.getLine(), u = m.getCol();
      for (h = m.read(); h; ) {
        switch (h) {
          case "/":
            m.peek() === "*" ? a = this.commentToken(h, o, u) : a = this.charToken(h, o, u);
            break;
          case "|":
          case "~":
          case "^":
          case "$":
          case "*":
            m.peek() === "=" ? a = this.comparisonToken(h, o, u) : a = this.charToken(h, o, u);
            break;
          case '"':
          case "'":
            a = this.stringToken(h, o, u);
            break;
          case "#":
            k(m.peek()) ? a = this.hashToken(h, o, u) : a = this.charToken(h, o, u);
            break;
          case ".":
            He(m.peek()) ? a = this.numberToken(h, o, u) : a = this.charToken(h, o, u);
            break;
          case "-":
            m.peek() === "-" ? a = this.htmlCommentEndToken(h, o, u) : ft(m.peek()) ? a = this.identOrFunctionToken(h, o, u) : a = this.charToken(h, o, u);
            break;
          case "!":
            a = this.importantToken(h, o, u);
            break;
          case "@":
            a = this.atRuleToken(h, o, u);
            break;
          case ":":
            a = this.notToken(h, o, u);
            break;
          case "<":
            a = this.htmlCommentStartToken(h, o, u);
            break;
          case "U":
          case "u":
            if (m.peek() === "+") {
              a = this.unicodeRangeToken(h, o, u);
              break;
            }
          default:
            He(h) ? a = this.numberToken(h, o, u) : Ae(h) ? a = this.whitespaceToken(h, o, u) : Pe(h) ? a = this.identOrFunctionToken(h, o, u) : a = this.charToken(h, o, u);
        }
        break;
      }
      return !a && h === null && (a = this.createToken(d.EOF, null, o, u)), a;
    }, createToken: function(c, h, m, a, o) {
      var u = this._reader;
      return o = o || {}, { value: h, type: c, channel: o.channel, endChar: o.endChar, hide: o.hide || false, startLine: m, startCol: a, endLine: u.getLine(), endCol: u.getCol() };
    }, atRuleToken: function(c, h, m) {
      var a = c, o = this._reader, u = d.CHAR, b;
      return o.mark(), b = this.readName(), a = c + b, u = d.type(a.toLowerCase()), (u === d.CHAR || u === d.UNKNOWN) && (a.length > 1 ? u = d.UNKNOWN_SYM : (u = d.CHAR, a = c, o.reset())), this.createToken(u, a, h, m);
    }, charToken: function(c, h, m) {
      var a = d.type(c), o = {};
      return a === -1 ? a = d.CHAR : o.endChar = d[a].endChar, this.createToken(a, c, h, m, o);
    }, commentToken: function(c, h, m) {
      var a = this.readComment(c);
      return this.createToken(d.COMMENT, a, h, m);
    }, comparisonToken: function(c, h, m) {
      var a = this._reader, o = c + a.read(), u = d.type(o) || d.CHAR;
      return this.createToken(u, o, h, m);
    }, hashToken: function(c, h, m) {
      var a = this.readName(c);
      return this.createToken(d.HASH, a, h, m);
    }, htmlCommentStartToken: function(c, h, m) {
      var a = this._reader, o = c;
      return a.mark(), o += a.readCount(3), o === "<!--" ? this.createToken(d.CDO, o, h, m) : (a.reset(), this.charToken(c, h, m));
    }, htmlCommentEndToken: function(c, h, m) {
      var a = this._reader, o = c;
      return a.mark(), o += a.readCount(2), o === "-->" ? this.createToken(d.CDC, o, h, m) : (a.reset(), this.charToken(c, h, m));
    }, identOrFunctionToken: function(c, h, m) {
      var a = this._reader, o = this.readName(c), u = d.IDENT, b = ["url(", "url-prefix(", "domain("];
      return a.peek() === "(" ? (o += a.read(), b.indexOf(o.toLowerCase()) > -1 ? (u = d.URI, o = this.readURI(o), b.indexOf(o.toLowerCase()) > -1 && (u = d.FUNCTION)) : u = d.FUNCTION) : a.peek() === ":" && o.toLowerCase() === "progid" && (o += a.readTo("("), u = d.IE_FUNCTION), this.createToken(u, o, h, m);
    }, importantToken: function(c, h, m) {
      var a = this._reader, o = c, u = d.CHAR, b, T;
      for (a.mark(), T = a.read(); T; ) {
        if (T === "/") {
          if (a.peek() !== "*")
            break;
          if (b = this.readComment(T), b === "")
            break;
        } else if (Ae(T))
          o += T + this.readWhitespace();
        else if (/i/i.test(T)) {
          b = a.readCount(8), /mportant/i.test(b) && (o += T + b, u = d.IMPORTANT_SYM);
          break;
        } else
          break;
        T = a.read();
      }
      return u === d.CHAR ? (a.reset(), this.charToken(c, h, m)) : this.createToken(u, o, h, m);
    }, notToken: function(c, h, m) {
      var a = this._reader, o = c;
      return a.mark(), o += a.readCount(4), o.toLowerCase() === ":not(" ? this.createToken(d.NOT, o, h, m) : (a.reset(), this.charToken(c, h, m));
    }, numberToken: function(c, h, m) {
      var a = this._reader, o = this.readNumber(c), u, b = d.NUMBER, T = a.peek();
      return Pe(T) ? (u = this.readName(a.read()), o += u, /^em$|^ex$|^px$|^gd$|^rem$|^vw$|^vh$|^vmax$|^vmin$|^ch$|^cm$|^mm$|^in$|^pt$|^pc$/i.test(u) ? b = d.LENGTH : /^deg|^rad$|^grad$/i.test(u) ? b = d.ANGLE : /^ms$|^s$/i.test(u) ? b = d.TIME : /^hz$|^khz$/i.test(u) ? b = d.FREQ : /^dpi$|^dpcm$/i.test(u) ? b = d.RESOLUTION : b = d.DIMENSION) : T === "%" && (o += a.read(), b = d.PERCENTAGE), this.createToken(b, o, h, m);
    }, stringToken: function(c, h, m) {
      for (var a = c, o = c, u = this._reader, b = c, T = d.STRING, I = u.read(); I && (o += I, !(I === a && b !== "\\")); ) {
        if (Me(u.peek()) && I !== "\\") {
          T = d.INVALID;
          break;
        }
        b = I, I = u.read();
      }
      return I === null && (T = d.INVALID), this.createToken(T, o, h, m);
    }, unicodeRangeToken: function(c, h, m) {
      var a = this._reader, o = c, u, b = d.CHAR;
      return a.peek() === "+" && (a.mark(), o += a.read(), o += this.readUnicodeRangePart(true), o.length === 2 ? a.reset() : (b = d.UNICODE_RANGE, o.indexOf("?") === -1 && a.peek() === "-" && (a.mark(), u = a.read(), u += this.readUnicodeRangePart(false), u.length === 1 ? a.reset() : o += u))), this.createToken(b, o, h, m);
    }, whitespaceToken: function(c, h, m) {
      var a = c + this.readWhitespace();
      return this.createToken(d.S, a, h, m);
    }, readUnicodeRangePart: function(c) {
      for (var h = this._reader, m = "", a = h.peek(); qe(a) && m.length < 6; )
        h.read(), m += a, a = h.peek();
      if (c)
        for (; a === "?" && m.length < 6; )
          h.read(), m += a, a = h.peek();
      return m;
    }, readWhitespace: function() {
      for (var c = this._reader, h = "", m = c.peek(); Ae(m); )
        c.read(), h += m, m = c.peek();
      return h;
    }, readNumber: function(c) {
      for (var h = this._reader, m = c, a = c === ".", o = h.peek(); o; ) {
        if (He(o))
          m += h.read();
        else if (o === ".") {
          if (a)
            break;
          a = true, m += h.read();
        } else
          break;
        o = h.peek();
      }
      return m;
    }, readString: function() {
      for (var c = this._reader, h = c.read(), m = h, a = h, o = c.peek(); o && (o = c.read(), m += o, !(o === h && a !== "\\")); ) {
        if (Me(c.peek()) && o !== "\\") {
          m = "";
          break;
        }
        a = o, o = c.peek();
      }
      return o === null && (m = ""), m;
    }, readURI: function(c) {
      var h = this._reader, m = c, a = "", o = h.peek();
      for (h.mark(); o && Ae(o); )
        h.read(), o = h.peek();
      for (o === "'" || o === '"' ? a = this.readString() : a = this.readURL(), o = h.peek(); o && Ae(o); )
        h.read(), o = h.peek();
      return a === "" || o !== ")" ? (m = c, h.reset()) : m += a + h.read(), m;
    }, readURL: function() {
      for (var c = this._reader, h = "", m = c.peek(); /^[!#$%&\\*-~]$/.test(m); )
        h += c.read(), m = c.peek();
      return h;
    }, readName: function(c) {
      for (var h = this._reader, m = c || "", a = h.peek(); ; )
        if (a === "\\")
          m += this.readEscape(h.read()), a = h.peek();
        else if (a && k(a))
          m += h.read(), a = h.peek();
        else
          break;
      return m;
    }, readEscape: function(c) {
      var h = this._reader, m = c || "", a = 0, o = h.peek();
      if (qe(o))
        do
          m += h.read(), o = h.peek();
        while (o && qe(o) && ++a < 6);
      return m.length === 3 && /\s/.test(o) || m.length === 7 || m.length === 1 ? h.read() : o = "", m + o;
    }, readComment: function(c) {
      var h = this._reader, m = c || "", a = h.read();
      if (a === "*") {
        for (; a; ) {
          if (m += a, m.length > 2 && a === "*" && h.peek() === "/") {
            m += h.read();
            break;
          }
          a = h.read();
        }
        return m;
      } else
        return "";
    } });
    var d = [{ name: "CDO" }, { name: "CDC" }, { name: "S", whitespace: true }, { name: "COMMENT", comment: true, hide: true, channel: "comment" }, { name: "INCLUDES", text: "~=" }, { name: "DASHMATCH", text: "|=" }, { name: "PREFIXMATCH", text: "^=" }, { name: "SUFFIXMATCH", text: "$=" }, { name: "SUBSTRINGMATCH", text: "*=" }, { name: "STRING" }, { name: "IDENT" }, { name: "HASH" }, { name: "IMPORT_SYM", text: "@import" }, { name: "PAGE_SYM", text: "@page" }, { name: "MEDIA_SYM", text: "@media" }, { name: "FONT_FACE_SYM", text: "@font-face" }, { name: "CHARSET_SYM", text: "@charset" }, { name: "NAMESPACE_SYM", text: "@namespace" }, { name: "VIEWPORT_SYM", text: ["@viewport", "@-ms-viewport", "@-o-viewport"] }, { name: "DOCUMENT_SYM", text: ["@document", "@-moz-document"] }, { name: "UNKNOWN_SYM" }, { name: "KEYFRAMES_SYM", text: ["@keyframes", "@-webkit-keyframes", "@-moz-keyframes", "@-o-keyframes"] }, { name: "IMPORTANT_SYM" }, { name: "LENGTH" }, { name: "ANGLE" }, { name: "TIME" }, { name: "FREQ" }, { name: "DIMENSION" }, { name: "PERCENTAGE" }, { name: "NUMBER" }, { name: "URI" }, { name: "FUNCTION" }, { name: "UNICODE_RANGE" }, { name: "INVALID" }, { name: "PLUS", text: "+" }, { name: "GREATER", text: ">" }, { name: "COMMA", text: "," }, { name: "TILDE", text: "~" }, { name: "NOT" }, { name: "TOPLEFTCORNER_SYM", text: "@top-left-corner" }, { name: "TOPLEFT_SYM", text: "@top-left" }, { name: "TOPCENTER_SYM", text: "@top-center" }, { name: "TOPRIGHT_SYM", text: "@top-right" }, { name: "TOPRIGHTCORNER_SYM", text: "@top-right-corner" }, { name: "BOTTOMLEFTCORNER_SYM", text: "@bottom-left-corner" }, { name: "BOTTOMLEFT_SYM", text: "@bottom-left" }, { name: "BOTTOMCENTER_SYM", text: "@bottom-center" }, { name: "BOTTOMRIGHT_SYM", text: "@bottom-right" }, { name: "BOTTOMRIGHTCORNER_SYM", text: "@bottom-right-corner" }, { name: "LEFTTOP_SYM", text: "@left-top" }, { name: "LEFTMIDDLE_SYM", text: "@left-middle" }, { name: "LEFTBOTTOM_SYM", text: "@left-bottom" }, { name: "RIGHTTOP_SYM", text: "@right-top" }, { name: "RIGHTMIDDLE_SYM", text: "@right-middle" }, { name: "RIGHTBOTTOM_SYM", text: "@right-bottom" }, { name: "RESOLUTION", state: "media" }, { name: "IE_FUNCTION" }, { name: "CHAR" }, { name: "PIPE", text: "|" }, { name: "SLASH", text: "/" }, { name: "MINUS", text: "-" }, { name: "STAR", text: "*" }, { name: "LBRACE", endChar: "}", text: "{" }, { name: "RBRACE", text: "}" }, { name: "LBRACKET", endChar: "]", text: "[" }, { name: "RBRACKET", text: "]" }, { name: "EQUALS", text: "=" }, { name: "COLON", text: ":" }, { name: "SEMICOLON", text: ";" }, { name: "LPAREN", endChar: ")", text: "(" }, { name: "RPAREN", text: ")" }, { name: "DOT", text: "." }];
    (function() {
      var c = [], h = /* @__PURE__ */ Object.create(null);
      d.UNKNOWN = -1, d.unshift({ name: "EOF" });
      for (var m = 0, a = d.length; m < a; m++)
        if (c.push(d[m].name), d[d[m].name] = m, d[m].text)
          if (d[m].text instanceof Array)
            for (var o = 0; o < d[m].text.length; o++)
              h[d[m].text[o]] = m;
          else
            h[d[m].text] = m;
      d.name = function(u) {
        return c[u];
      }, d.type = function(u) {
        return h[u] || -1;
      };
    })();
    var Xe = { validate: function(c, h) {
      var m = c.toString().toLowerCase(), a = new g(h), o = M[m];
      if (o)
        typeof o != "number" && (typeof o == "string" ? o.indexOf("||") > -1 ? this.groupProperty(o, a) : this.singleProperty(o, a, 1) : o.multi ? this.multiProperty(o.multi, a, o.comma, o.max || 1 / 0) : typeof o == "function" && o(a));
      else if (m.indexOf("-") !== 0)
        throw new se("Unknown property '" + c + "'.", c.line, c.col);
    }, singleProperty: function(c, h, m, a) {
      for (var o = false, u = h.value, b = 0, T; h.hasNext() && b < m && (o = L.isAny(h, c), !!o); )
        b++;
      if (o) {
        if (h.hasNext())
          throw T = h.next(), new se("Expected end of value but found '" + T + "'.", T.line, T.col);
      } else
        throw h.hasNext() && !h.isFirst() ? (T = h.peek(), new se("Expected end of value but found '" + T + "'.", T.line, T.col)) : new se("Expected (" + c + ") but found '" + u + "'.", u.line, u.col);
    }, multiProperty: function(c, h, m, a) {
      for (var o = false, u = h.value, b = 0, T; h.hasNext() && !o && b < a && L.isAny(h, c); )
        if (b++, !h.hasNext())
          o = true;
        else if (m)
          if (String(h.peek()) === ",")
            T = h.next();
          else
            break;
      if (o) {
        if (h.hasNext())
          throw T = h.next(), new se("Expected end of value but found '" + T + "'.", T.line, T.col);
      } else
        throw h.hasNext() && !h.isFirst() ? (T = h.peek(), new se("Expected end of value but found '" + T + "'.", T.line, T.col)) : (T = h.previous(), m && String(T) === "," ? new se("Expected end of value but found '" + T + "'.", T.line, T.col) : new se("Expected (" + c + ") but found '" + u + "'.", u.line, u.col));
    }, groupProperty: function(c, h, m) {
      for (var a = false, o = h.value, u = c.split("||").length, b = { count: 0 }, T = false, I, A; h.hasNext() && !a && (I = L.isAnyOfGroup(h, c), I); ) {
        if (b[I])
          break;
        b[I] = 1, b.count++, T = true, (b.count === u || !h.hasNext()) && (a = true);
      }
      if (a) {
        if (h.hasNext())
          throw A = h.next(), new se("Expected end of value but found '" + A + "'.", A.line, A.col);
      } else
        throw T && h.hasNext() ? (A = h.peek(), new se("Expected end of value but found '" + A + "'.", A.line, A.col)) : new se("Expected (" + c + ") but found '" + o + "'.", o.line, o.col);
    } };
    function se(c, h, m) {
      this.col = m, this.line = h, this.message = c;
    }
    se.prototype = new Error();
    var L = { isLiteral: function(c, h) {
      var m = c.text.toString().toLowerCase(), a = h.split(" | "), o, u, b = false;
      for (o = 0, u = a.length; o < u && !b; o++)
        m === a[o].toLowerCase() && (b = true);
      return b;
    }, isSimple: function(c) {
      return !!this.simple[c];
    }, isComplex: function(c) {
      return !!this.complex[c];
    }, isAny: function(c, h) {
      var m = h.split(" | "), a, o, u = false;
      for (a = 0, o = m.length; a < o && !u && c.hasNext(); a++)
        u = this.isType(c, m[a]);
      return u;
    }, isAnyOfGroup: function(c, h) {
      var m = h.split(" || "), a, o, u = false;
      for (a = 0, o = m.length; a < o && !u; a++)
        u = this.isType(c, m[a]);
      return u ? m[a - 1] : false;
    }, isType: function(c, h) {
      var m = c.peek(), a = false;
      return h.charAt(0) !== "<" ? (a = this.isLiteral(m, h), a && c.next()) : this.simple[h] ? (a = this.simple[h](m), a && c.next()) : a = this.complex[h](c), a;
    }, simple: { __proto__: null, "<absolute-size>": function(c) {
      return L.isLiteral(c, "xx-small | x-small | small | medium | large | x-large | xx-large");
    }, "<attachment>": function(c) {
      return L.isLiteral(c, "scroll | fixed | local");
    }, "<attr>": function(c) {
      return c.type === "function" && c.name === "attr";
    }, "<bg-image>": function(c) {
      return this["<image>"](c) || this["<gradient>"](c) || String(c) === "none";
    }, "<gradient>": function(c) {
      return c.type === "function" && /^(?:\-(?:ms|moz|o|webkit)\-)?(?:repeating\-)?(?:radial\-|linear\-)?gradient/i.test(c);
    }, "<box>": function(c) {
      return L.isLiteral(c, "padding-box | border-box | content-box");
    }, "<content>": function(c) {
      return c.type === "function" && c.name === "content";
    }, "<relative-size>": function(c) {
      return L.isLiteral(c, "smaller | larger");
    }, "<ident>": function(c) {
      return c.type === "identifier";
    }, "<length>": function(c) {
      return c.type === "function" && /^(?:\-(?:ms|moz|o|webkit)\-)?calc/i.test(c) ? true : c.type === "length" || c.type === "number" || c.type === "integer" || String(c) === "0";
    }, "<color>": function(c) {
      return c.type === "color" || String(c) === "transparent" || String(c) === "currentColor";
    }, "<number>": function(c) {
      return c.type === "number" || this["<integer>"](c);
    }, "<integer>": function(c) {
      return c.type === "integer";
    }, "<line>": function(c) {
      return c.type === "integer";
    }, "<angle>": function(c) {
      return c.type === "angle";
    }, "<uri>": function(c) {
      return c.type === "uri";
    }, "<image>": function(c) {
      return this["<uri>"](c);
    }, "<percentage>": function(c) {
      return c.type === "percentage" || String(c) === "0";
    }, "<border-width>": function(c) {
      return this["<length>"](c) || L.isLiteral(c, "thin | medium | thick");
    }, "<border-style>": function(c) {
      return L.isLiteral(c, "none | hidden | dotted | dashed | solid | double | groove | ridge | inset | outset");
    }, "<content-sizing>": function(c) {
      return L.isLiteral(c, "fill-available | -moz-available | -webkit-fill-available | max-content | -moz-max-content | -webkit-max-content | min-content | -moz-min-content | -webkit-min-content | fit-content | -moz-fit-content | -webkit-fit-content");
    }, "<margin-width>": function(c) {
      return this["<length>"](c) || this["<percentage>"](c) || L.isLiteral(c, "auto");
    }, "<padding-width>": function(c) {
      return this["<length>"](c) || this["<percentage>"](c);
    }, "<shape>": function(c) {
      return c.type === "function" && (c.name === "rect" || c.name === "inset-rect");
    }, "<time>": function(c) {
      return c.type === "time";
    }, "<flex-grow>": function(c) {
      return this["<number>"](c);
    }, "<flex-shrink>": function(c) {
      return this["<number>"](c);
    }, "<width>": function(c) {
      return this["<margin-width>"](c);
    }, "<flex-basis>": function(c) {
      return this["<width>"](c);
    }, "<flex-direction>": function(c) {
      return L.isLiteral(c, "row | row-reverse | column | column-reverse");
    }, "<flex-wrap>": function(c) {
      return L.isLiteral(c, "nowrap | wrap | wrap-reverse");
    }, "<feature-tag-value>": function(c) {
      return c.type === "function" && /^[A-Z0-9]{4}$/i.test(c);
    } }, complex: { __proto__: null, "<bg-position>": function(c) {
      for (var h = false, m = "<percentage> | <length>", a = "left | right", o = "top | bottom", u = 0; c.peek(u) && c.peek(u).text !== ","; )
        u++;
      return u < 3 ? L.isAny(c, a + " | center | " + m) ? (h = true, L.isAny(c, o + " | center | " + m)) : L.isAny(c, o) && (h = true, L.isAny(c, a + " | center")) : L.isAny(c, a) ? L.isAny(c, o) ? (h = true, L.isAny(c, m)) : L.isAny(c, m) && (L.isAny(c, o) ? (h = true, L.isAny(c, m)) : L.isAny(c, "center") && (h = true)) : L.isAny(c, o) ? L.isAny(c, a) ? (h = true, L.isAny(c, m)) : L.isAny(c, m) && (L.isAny(c, a) ? (h = true, L.isAny(c, m)) : L.isAny(c, "center") && (h = true)) : L.isAny(c, "center") && L.isAny(c, a + " | " + o) && (h = true, L.isAny(c, m)), h;
    }, "<bg-size>": function(c) {
      var h = false, m = "<percentage> | <length> | auto";
      return L.isAny(c, "cover | contain") ? h = true : L.isAny(c, m) && (h = true, L.isAny(c, m)), h;
    }, "<repeat-style>": function(c) {
      var h = false, m = "repeat | space | round | no-repeat", a;
      return c.hasNext() && (a = c.next(), L.isLiteral(a, "repeat-x | repeat-y") ? h = true : L.isLiteral(a, m) && (h = true, c.hasNext() && L.isLiteral(c.peek(), m) && c.next())), h;
    }, "<shadow>": function(c) {
      var h = false, m = 0, a = false, o = false;
      if (c.hasNext()) {
        for (L.isAny(c, "inset") && (a = true), L.isAny(c, "<color>") && (o = true); L.isAny(c, "<length>") && m < 4; )
          m++;
        c.hasNext() && (o || L.isAny(c, "<color>"), a || L.isAny(c, "inset")), h = m >= 2 && m <= 4;
      }
      return h;
    }, "<x-one-radius>": function(c) {
      var h = false, m = "<length> | <percentage> | inherit";
      return L.isAny(c, m) && (h = true, L.isAny(c, m)), h;
    }, "<flex>": function(c) {
      var h, m = false;
      if (L.isAny(c, "none | inherit") ? m = true : L.isType(c, "<flex-grow>") ? c.peek() ? L.isType(c, "<flex-shrink>") ? c.peek() ? m = L.isType(c, "<flex-basis>") : m = true : L.isType(c, "<flex-basis>") && (m = c.peek() === null) : m = true : L.isType(c, "<flex-basis>") && (m = true), !m)
        throw h = c.peek(), new se("Expected (none | [ <flex-grow> <flex-shrink>? || <flex-basis> ]) but found '" + c.value.text + "'.", h.line, h.col);
      return m;
    } } };
    ct.css = { __proto__: null, Colors: f, Combinator: _, Parser: S, PropertyName: ae, PropertyValue: ce, PropertyValuePart: re, MediaFeature: y, MediaQuery: w, Selector: V, SelectorPart: ve, SelectorSubPart: U, Specificity: ie, TokenStream: p, Tokens: d, ValidationError: se };
  })();
  (function() {
    for (var e in ct)
      go[e] = ct[e];
  })();
});
var mn = O((ed, yo) => {
  var s0 = bo();
  yo.exports = vr;
  function vr(e) {
    this._element = e;
  }
  function _o(e) {
    var t = new s0.css.Parser(), r = { property: /* @__PURE__ */ Object.create(null), priority: /* @__PURE__ */ Object.create(null) };
    return t.addListener("property", function(n) {
      n.invalid || (r.property[n.property.text] = n.value.text, n.important && (r.priority[n.property.text] = "important"));
    }), e = ("" + e).replace(/^;/, ""), t.parseStyleAttribute(e), r;
  }
  var Xt = {};
  vr.prototype = Object.create(Object.prototype, { _parsed: { get: function() {
    if (!this._parsedStyles || this.cssText !== this._lastParsedText) {
      var e = this.cssText;
      this._parsedStyles = _o(e), this._lastParsedText = e, delete this._names;
    }
    return this._parsedStyles;
  } }, _serialize: { value: function() {
    var e = this._parsed, t = "";
    for (var r in e.property)
      t && (t += " "), t += r + ": " + e.property[r], e.priority[r] && (t += " !" + e.priority[r]), t += ";";
    this.cssText = t, this._lastParsedText = t, delete this._names;
  } }, cssText: { get: function() {
    return this._element.getAttribute("style");
  }, set: function(e) {
    this._element.setAttribute("style", e);
  } }, length: { get: function() {
    return this._names || (this._names = Object.getOwnPropertyNames(this._parsed.property)), this._names.length;
  } }, item: { value: function(e) {
    return this._names || (this._names = Object.getOwnPropertyNames(this._parsed.property)), this._names[e];
  } }, getPropertyValue: { value: function(e) {
    return e = e.toLowerCase(), this._parsed.property[e] || "";
  } }, getPropertyPriority: { value: function(e) {
    return e = e.toLowerCase(), this._parsed.priority[e] || "";
  } }, setProperty: { value: function(e, t, r) {
    if (e = e.toLowerCase(), t == null && (t = ""), r == null && (r = ""), t !== Xt && (t = "" + t), t === "") {
      this.removeProperty(e);
      return;
    }
    if (!(r !== "" && r !== Xt && !/^important$/i.test(r))) {
      var n = this._parsed;
      if (t === Xt) {
        if (!n.property[e])
          return;
        r !== "" ? n.priority[e] = "important" : delete n.priority[e];
      } else {
        if (t.indexOf(";") !== -1)
          return;
        var l = _o(e + ":" + t);
        if (Object.getOwnPropertyNames(l.property).length === 0 || Object.getOwnPropertyNames(l.priority).length !== 0)
          return;
        for (var f in l.property)
          n.property[f] = l.property[f], r !== Xt && (r !== "" ? n.priority[f] = "important" : n.priority[f] && delete n.priority[f]);
      }
      this._serialize();
    }
  } }, setPropertyValue: { value: function(e, t) {
    return this.setProperty(e, t, Xt);
  } }, setPropertyPriority: { value: function(e, t) {
    return this.setProperty(e, Xt, t);
  } }, removeProperty: { value: function(e) {
    e = e.toLowerCase();
    var t = this._parsed;
    e in t.property && (delete t.property[e], delete t.priority[e], this._serialize());
  } } });
  var vo = { alignContent: "align-content", alignItems: "align-items", alignmentBaseline: "alignment-baseline", alignSelf: "align-self", animation: "animation", animationDelay: "animation-delay", animationDirection: "animation-direction", animationDuration: "animation-duration", animationFillMode: "animation-fill-mode", animationIterationCount: "animation-iteration-count", animationName: "animation-name", animationPlayState: "animation-play-state", animationTimingFunction: "animation-timing-function", backfaceVisibility: "backface-visibility", background: "background", backgroundAttachment: "background-attachment", backgroundClip: "background-clip", backgroundColor: "background-color", backgroundImage: "background-image", backgroundOrigin: "background-origin", backgroundPosition: "background-position", backgroundPositionX: "background-position-x", backgroundPositionY: "background-position-y", backgroundRepeat: "background-repeat", backgroundSize: "background-size", baselineShift: "baseline-shift", border: "border", borderBottom: "border-bottom", borderBottomColor: "border-bottom-color", borderBottomLeftRadius: "border-bottom-left-radius", borderBottomRightRadius: "border-bottom-right-radius", borderBottomStyle: "border-bottom-style", borderBottomWidth: "border-bottom-width", borderCollapse: "border-collapse", borderColor: "border-color", borderImage: "border-image", borderImageOutset: "border-image-outset", borderImageRepeat: "border-image-repeat", borderImageSlice: "border-image-slice", borderImageSource: "border-image-source", borderImageWidth: "border-image-width", borderLeft: "border-left", borderLeftColor: "border-left-color", borderLeftStyle: "border-left-style", borderLeftWidth: "border-left-width", borderRadius: "border-radius", borderRight: "border-right", borderRightColor: "border-right-color", borderRightStyle: "border-right-style", borderRightWidth: "border-right-width", borderSpacing: "border-spacing", borderStyle: "border-style", borderTop: "border-top", borderTopColor: "border-top-color", borderTopLeftRadius: "border-top-left-radius", borderTopRightRadius: "border-top-right-radius", borderTopStyle: "border-top-style", borderTopWidth: "border-top-width", borderWidth: "border-width", bottom: "bottom", boxShadow: "box-shadow", boxSizing: "box-sizing", breakAfter: "break-after", breakBefore: "break-before", breakInside: "break-inside", captionSide: "caption-side", clear: "clear", clip: "clip", clipPath: "clip-path", clipRule: "clip-rule", color: "color", colorInterpolationFilters: "color-interpolation-filters", columnCount: "column-count", columnFill: "column-fill", columnGap: "column-gap", columnRule: "column-rule", columnRuleColor: "column-rule-color", columnRuleStyle: "column-rule-style", columnRuleWidth: "column-rule-width", columns: "columns", columnSpan: "column-span", columnWidth: "column-width", content: "content", counterIncrement: "counter-increment", counterReset: "counter-reset", cssFloat: "float", cursor: "cursor", direction: "direction", display: "display", dominantBaseline: "dominant-baseline", emptyCells: "empty-cells", enableBackground: "enable-background", fill: "fill", fillOpacity: "fill-opacity", fillRule: "fill-rule", filter: "filter", flex: "flex", flexBasis: "flex-basis", flexDirection: "flex-direction", flexFlow: "flex-flow", flexGrow: "flex-grow", flexShrink: "flex-shrink", flexWrap: "flex-wrap", floodColor: "flood-color", floodOpacity: "flood-opacity", font: "font", fontFamily: "font-family", fontFeatureSettings: "font-feature-settings", fontSize: "font-size", fontSizeAdjust: "font-size-adjust", fontStretch: "font-stretch", fontStyle: "font-style", fontVariant: "font-variant", fontWeight: "font-weight", glyphOrientationHorizontal: "glyph-orientation-horizontal", glyphOrientationVertical: "glyph-orientation-vertical", grid: "grid", gridArea: "grid-area", gridAutoColumns: "grid-auto-columns", gridAutoFlow: "grid-auto-flow", gridAutoRows: "grid-auto-rows", gridColumn: "grid-column", gridColumnEnd: "grid-column-end", gridColumnGap: "grid-column-gap", gridColumnStart: "grid-column-start", gridGap: "grid-gap", gridRow: "grid-row", gridRowEnd: "grid-row-end", gridRowGap: "grid-row-gap", gridRowStart: "grid-row-start", gridTemplate: "grid-template", gridTemplateAreas: "grid-template-areas", gridTemplateColumns: "grid-template-columns", gridTemplateRows: "grid-template-rows", height: "height", imeMode: "ime-mode", justifyContent: "justify-content", kerning: "kerning", layoutGrid: "layout-grid", layoutGridChar: "layout-grid-char", layoutGridLine: "layout-grid-line", layoutGridMode: "layout-grid-mode", layoutGridType: "layout-grid-type", left: "left", letterSpacing: "letter-spacing", lightingColor: "lighting-color", lineBreak: "line-break", lineHeight: "line-height", listStyle: "list-style", listStyleImage: "list-style-image", listStylePosition: "list-style-position", listStyleType: "list-style-type", margin: "margin", marginBottom: "margin-bottom", marginLeft: "margin-left", marginRight: "margin-right", marginTop: "margin-top", marker: "marker", markerEnd: "marker-end", markerMid: "marker-mid", markerStart: "marker-start", mask: "mask", maxHeight: "max-height", maxWidth: "max-width", minHeight: "min-height", minWidth: "min-width", msContentZoomChaining: "-ms-content-zoom-chaining", msContentZooming: "-ms-content-zooming", msContentZoomLimit: "-ms-content-zoom-limit", msContentZoomLimitMax: "-ms-content-zoom-limit-max", msContentZoomLimitMin: "-ms-content-zoom-limit-min", msContentZoomSnap: "-ms-content-zoom-snap", msContentZoomSnapPoints: "-ms-content-zoom-snap-points", msContentZoomSnapType: "-ms-content-zoom-snap-type", msFlowFrom: "-ms-flow-from", msFlowInto: "-ms-flow-into", msFontFeatureSettings: "-ms-font-feature-settings", msGridColumn: "-ms-grid-column", msGridColumnAlign: "-ms-grid-column-align", msGridColumns: "-ms-grid-columns", msGridColumnSpan: "-ms-grid-column-span", msGridRow: "-ms-grid-row", msGridRowAlign: "-ms-grid-row-align", msGridRows: "-ms-grid-rows", msGridRowSpan: "-ms-grid-row-span", msHighContrastAdjust: "-ms-high-contrast-adjust", msHyphenateLimitChars: "-ms-hyphenate-limit-chars", msHyphenateLimitLines: "-ms-hyphenate-limit-lines", msHyphenateLimitZone: "-ms-hyphenate-limit-zone", msHyphens: "-ms-hyphens", msImeAlign: "-ms-ime-align", msOverflowStyle: "-ms-overflow-style", msScrollChaining: "-ms-scroll-chaining", msScrollLimit: "-ms-scroll-limit", msScrollLimitXMax: "-ms-scroll-limit-x-max", msScrollLimitXMin: "-ms-scroll-limit-x-min", msScrollLimitYMax: "-ms-scroll-limit-y-max", msScrollLimitYMin: "-ms-scroll-limit-y-min", msScrollRails: "-ms-scroll-rails", msScrollSnapPointsX: "-ms-scroll-snap-points-x", msScrollSnapPointsY: "-ms-scroll-snap-points-y", msScrollSnapType: "-ms-scroll-snap-type", msScrollSnapX: "-ms-scroll-snap-x", msScrollSnapY: "-ms-scroll-snap-y", msScrollTranslation: "-ms-scroll-translation", msTextCombineHorizontal: "-ms-text-combine-horizontal", msTextSizeAdjust: "-ms-text-size-adjust", msTouchAction: "-ms-touch-action", msTouchSelect: "-ms-touch-select", msUserSelect: "-ms-user-select", msWrapFlow: "-ms-wrap-flow", msWrapMargin: "-ms-wrap-margin", msWrapThrough: "-ms-wrap-through", opacity: "opacity", order: "order", orphans: "orphans", outline: "outline", outlineColor: "outline-color", outlineOffset: "outline-offset", outlineStyle: "outline-style", outlineWidth: "outline-width", overflow: "overflow", overflowX: "overflow-x", overflowY: "overflow-y", padding: "padding", paddingBottom: "padding-bottom", paddingLeft: "padding-left", paddingRight: "padding-right", paddingTop: "padding-top", page: "page", pageBreakAfter: "page-break-after", pageBreakBefore: "page-break-before", pageBreakInside: "page-break-inside", perspective: "perspective", perspectiveOrigin: "perspective-origin", pointerEvents: "pointer-events", position: "position", quotes: "quotes", right: "right", rotate: "rotate", rubyAlign: "ruby-align", rubyOverhang: "ruby-overhang", rubyPosition: "ruby-position", scale: "scale", size: "size", stopColor: "stop-color", stopOpacity: "stop-opacity", stroke: "stroke", strokeDasharray: "stroke-dasharray", strokeDashoffset: "stroke-dashoffset", strokeLinecap: "stroke-linecap", strokeLinejoin: "stroke-linejoin", strokeMiterlimit: "stroke-miterlimit", strokeOpacity: "stroke-opacity", strokeWidth: "stroke-width", tableLayout: "table-layout", textAlign: "text-align", textAlignLast: "text-align-last", textAnchor: "text-anchor", textDecoration: "text-decoration", textIndent: "text-indent", textJustify: "text-justify", textKashida: "text-kashida", textKashidaSpace: "text-kashida-space", textOverflow: "text-overflow", textShadow: "text-shadow", textTransform: "text-transform", textUnderlinePosition: "text-underline-position", top: "top", touchAction: "touch-action", transform: "transform", transformOrigin: "transform-origin", transformStyle: "transform-style", transition: "transition", transitionDelay: "transition-delay", transitionDuration: "transition-duration", transitionProperty: "transition-property", transitionTimingFunction: "transition-timing-function", translate: "translate", unicodeBidi: "unicode-bidi", verticalAlign: "vertical-align", visibility: "visibility", webkitAlignContent: "-webkit-align-content", webkitAlignItems: "-webkit-align-items", webkitAlignSelf: "-webkit-align-self", webkitAnimation: "-webkit-animation", webkitAnimationDelay: "-webkit-animation-delay", webkitAnimationDirection: "-webkit-animation-direction", webkitAnimationDuration: "-webkit-animation-duration", webkitAnimationFillMode: "-webkit-animation-fill-mode", webkitAnimationIterationCount: "-webkit-animation-iteration-count", webkitAnimationName: "-webkit-animation-name", webkitAnimationPlayState: "-webkit-animation-play-state", webkitAnimationTimingFunction: "-webkit-animation-timing-funciton", webkitAppearance: "-webkit-appearance", webkitBackfaceVisibility: "-webkit-backface-visibility", webkitBackgroundClip: "-webkit-background-clip", webkitBackgroundOrigin: "-webkit-background-origin", webkitBackgroundSize: "-webkit-background-size", webkitBorderBottomLeftRadius: "-webkit-border-bottom-left-radius", webkitBorderBottomRightRadius: "-webkit-border-bottom-right-radius", webkitBorderImage: "-webkit-border-image", webkitBorderRadius: "-webkit-border-radius", webkitBorderTopLeftRadius: "-webkit-border-top-left-radius", webkitBorderTopRightRadius: "-webkit-border-top-right-radius", webkitBoxAlign: "-webkit-box-align", webkitBoxDirection: "-webkit-box-direction", webkitBoxFlex: "-webkit-box-flex", webkitBoxOrdinalGroup: "-webkit-box-ordinal-group", webkitBoxOrient: "-webkit-box-orient", webkitBoxPack: "-webkit-box-pack", webkitBoxSizing: "-webkit-box-sizing", webkitColumnBreakAfter: "-webkit-column-break-after", webkitColumnBreakBefore: "-webkit-column-break-before", webkitColumnBreakInside: "-webkit-column-break-inside", webkitColumnCount: "-webkit-column-count", webkitColumnGap: "-webkit-column-gap", webkitColumnRule: "-webkit-column-rule", webkitColumnRuleColor: "-webkit-column-rule-color", webkitColumnRuleStyle: "-webkit-column-rule-style", webkitColumnRuleWidth: "-webkit-column-rule-width", webkitColumns: "-webkit-columns", webkitColumnSpan: "-webkit-column-span", webkitColumnWidth: "-webkit-column-width", webkitFilter: "-webkit-filter", webkitFlex: "-webkit-flex", webkitFlexBasis: "-webkit-flex-basis", webkitFlexDirection: "-webkit-flex-direction", webkitFlexFlow: "-webkit-flex-flow", webkitFlexGrow: "-webkit-flex-grow", webkitFlexShrink: "-webkit-flex-shrink", webkitFlexWrap: "-webkit-flex-wrap", webkitJustifyContent: "-webkit-justify-content", webkitOrder: "-webkit-order", webkitPerspective: "-webkit-perspective-origin", webkitPerspectiveOrigin: "-webkit-perspective-origin", webkitTapHighlightColor: "-webkit-tap-highlight-color", webkitTextFillColor: "-webkit-text-fill-color", webkitTextSizeAdjust: "-webkit-text-size-adjust", webkitTextStroke: "-webkit-text-stroke", webkitTextStrokeColor: "-webkit-text-stroke-color", webkitTextStrokeWidth: "-webkit-text-stroke-width", webkitTransform: "-webkit-transform", webkitTransformOrigin: "-webkit-transform-origin", webkitTransformStyle: "-webkit-transform-style", webkitTransition: "-webkit-transition", webkitTransitionDelay: "-webkit-transition-delay", webkitTransitionDuration: "-webkit-transition-duration", webkitTransitionProperty: "-webkit-transition-property", webkitTransitionTimingFunction: "-webkit-transition-timing-function", webkitUserModify: "-webkit-user-modify", webkitUserSelect: "-webkit-user-select", webkitWritingMode: "-webkit-writing-mode", whiteSpace: "white-space", widows: "widows", width: "width", wordBreak: "word-break", wordSpacing: "word-spacing", wordWrap: "word-wrap", writingMode: "writing-mode", zIndex: "z-index", zoom: "zoom", resize: "resize", userSelect: "user-select" };
  for (Eo in vo)
    o0(Eo);
  var Eo;
  function o0(e) {
    var t = vo[e];
    Object.defineProperty(vr.prototype, e, { get: function() {
      return this.getPropertyValue(t);
    }, set: function(r) {
      this.setProperty(t, r);
    } }), vr.prototype.hasOwnProperty(t) || Object.defineProperty(vr.prototype, t, { get: function() {
      return this.getPropertyValue(t);
    }, set: function(r) {
      this.setProperty(t, r);
    } });
  }
});
var Ka = O((td, To) => {
  var Ee = pn();
  To.exports = yr;
  function yr() {
  }
  yr.prototype = Object.create(Object.prototype, { _url: { get: function() {
    return new Ee(this.href);
  } }, protocol: { get: function() {
    var e = this._url;
    return e && e.scheme ? e.scheme + ":" : ":";
  }, set: function(e) {
    var t = this.href, r = new Ee(t);
    r.isAbsolute() && (e = e.replace(/:+$/, ""), e = e.replace(/[^-+\.a-zA-Z0-9]/g, Ee.percentEncode), e.length > 0 && (r.scheme = e, t = r.toString())), this.href = t;
  } }, host: { get: function() {
    var e = this._url;
    return e.isAbsolute() && e.isAuthorityBased() ? e.host + (e.port ? ":" + e.port : "") : "";
  }, set: function(e) {
    var t = this.href, r = new Ee(t);
    r.isAbsolute() && r.isAuthorityBased() && (e = e.replace(/[^-+\._~!$&'()*,;:=a-zA-Z0-9]/g, Ee.percentEncode), e.length > 0 && (r.host = e, delete r.port, t = r.toString())), this.href = t;
  } }, hostname: { get: function() {
    var e = this._url;
    return e.isAbsolute() && e.isAuthorityBased() ? e.host : "";
  }, set: function(e) {
    var t = this.href, r = new Ee(t);
    r.isAbsolute() && r.isAuthorityBased() && (e = e.replace(/^\/+/, ""), e = e.replace(/[^-+\._~!$&'()*,;:=a-zA-Z0-9]/g, Ee.percentEncode), e.length > 0 && (r.host = e, t = r.toString())), this.href = t;
  } }, port: { get: function() {
    var e = this._url;
    return e.isAbsolute() && e.isAuthorityBased() && e.port !== void 0 ? e.port : "";
  }, set: function(e) {
    var t = this.href, r = new Ee(t);
    r.isAbsolute() && r.isAuthorityBased() && (e = "" + e, e = e.replace(/[^0-9].*$/, ""), e = e.replace(/^0+/, ""), e.length === 0 && (e = "0"), parseInt(e, 10) <= 65535 && (r.port = e, t = r.toString())), this.href = t;
  } }, pathname: { get: function() {
    var e = this._url;
    return e.isAbsolute() && e.isHierarchical() ? e.path : "";
  }, set: function(e) {
    var t = this.href, r = new Ee(t);
    r.isAbsolute() && r.isHierarchical() && (e.charAt(0) !== "/" && (e = "/" + e), e = e.replace(/[^-+\._~!$&'()*,;:=@\/a-zA-Z0-9]/g, Ee.percentEncode), r.path = e, t = r.toString()), this.href = t;
  } }, search: { get: function() {
    var e = this._url;
    return e.isAbsolute() && e.isHierarchical() && e.query !== void 0 ? "?" + e.query : "";
  }, set: function(e) {
    var t = this.href, r = new Ee(t);
    r.isAbsolute() && r.isHierarchical() && (e.charAt(0) === "?" && (e = e.substring(1)), e = e.replace(/[^-+\._~!$&'()*,;:=@\/?a-zA-Z0-9]/g, Ee.percentEncode), r.query = e, t = r.toString()), this.href = t;
  } }, hash: { get: function() {
    var e = this._url;
    return e == null || e.fragment == null || e.fragment === "" ? "" : "#" + e.fragment;
  }, set: function(e) {
    var t = this.href, r = new Ee(t);
    e.charAt(0) === "#" && (e = e.substring(1)), e = e.replace(/[^-+\._~!$&'()*,;:=@\/?a-zA-Z0-9]/g, Ee.percentEncode), r.fragment = e, t = r.toString(), this.href = t;
  } }, username: { get: function() {
    var e = this._url;
    return e.username || "";
  }, set: function(e) {
    var t = this.href, r = new Ee(t);
    r.isAbsolute() && (e = e.replace(/[\x00-\x1F\x7F-\uFFFF "#<>?`\/@\\:]/g, Ee.percentEncode), r.username = e, t = r.toString()), this.href = t;
  } }, password: { get: function() {
    var e = this._url;
    return e.password || "";
  }, set: function(e) {
    var t = this.href, r = new Ee(t);
    r.isAbsolute() && (e === "" ? r.password = null : (e = e.replace(/[\x00-\x1F\x7F-\uFFFF "#<>?`\/@\\]/g, Ee.percentEncode), r.password = e), t = r.toString()), this.href = t;
  } }, origin: { get: function() {
    var e = this._url;
    if (e == null)
      return "";
    var t = function(r) {
      var n = [e.scheme, e.host, +e.port || r];
      return n[0] + "://" + n[1] + (n[2] === r ? "" : ":" + n[2]);
    };
    switch (e.scheme) {
      case "ftp":
        return t(21);
      case "gopher":
        return t(70);
      case "http":
      case "ws":
        return t(80);
      case "https":
      case "wss":
        return t(443);
      default:
        return e.scheme + "://";
    }
  } } });
  yr._inherit = function(e) {
    Object.getOwnPropertyNames(yr.prototype).forEach(function(t) {
      if (!(t === "constructor" || t === "href")) {
        var r = Object.getOwnPropertyDescriptor(yr.prototype, t);
        Object.defineProperty(e, t, r);
      }
    });
  };
});
var Xa = O((rd, So) => {
  var wo = ma(), c0 = Qr().isApiWritable;
  So.exports = function(e, t, r, n) {
    var l = e.ctor;
    if (l) {
      var f = e.props || {};
      if (e.attributes)
        for (var _ in e.attributes) {
          var y = e.attributes[_];
          (typeof y != "object" || Array.isArray(y)) && (y = { type: y }), y.name || (y.name = _.toLowerCase()), f[_] = wo.property(y);
        }
      f.constructor = { value: l, writable: c0 }, l.prototype = Object.create((e.superclass || t).prototype, f), e.events && u0(l, e.events), r[e.name] = l;
    } else
      l = t;
    return (e.tags || e.tag && [e.tag] || []).forEach(function(w) {
      n[w] = l;
    }), l;
  };
  function ko(e, t, r, n) {
    this.body = e, this.document = t, this.form = r, this.element = n;
  }
  ko.prototype.build = function() {
    return () => {
    };
  };
  function l0(e, t, r, n) {
    var l = e.ownerDocument || /* @__PURE__ */ Object.create(null), f = e.form || /* @__PURE__ */ Object.create(null);
    e[t] = new ko(n, l, f, e).build();
  }
  function u0(e, t) {
    var r = e.prototype;
    t.forEach(function(n) {
      Object.defineProperty(r, "on" + n, { get: function() {
        return this._getEventHandler(n);
      }, set: function(l) {
        this._setEventHandler(n, l);
      } }), wo.registerChangeHandler(e, "on" + n, l0);
    });
  }
});
var _n = O((bn) => {
  var Qa = Te(), No = Kt(), f0 = mn(), Oe = le(), Co = Ka(), d0 = Xa(), lt = bn.elements = {}, Tr = /* @__PURE__ */ Object.create(null);
  bn.createElement = function(e, t, r) {
    var n = Tr[t] || x0;
    return new n(e, t, r);
  };
  function C(e) {
    return d0(e, R, lt, Tr);
  }
  function ge(e) {
    return { get: function() {
      var t = this._getattr(e);
      if (t === null)
        return "";
      var r = this.doc._resolve(t);
      return r === null ? t : r;
    }, set: function(t) {
      this._setattr(e, t);
    } };
  }
  function gn(e) {
    return { get: function() {
      var t = this._getattr(e);
      return t === null ? null : t.toLowerCase() === "use-credentials" ? "use-credentials" : "anonymous";
    }, set: function(t) {
      t == null ? this.removeAttribute(e) : this._setattr(e, t);
    } };
  }
  var wr = { type: ["", "no-referrer", "no-referrer-when-downgrade", "same-origin", "origin", "strict-origin", "origin-when-cross-origin", "strict-origin-when-cross-origin", "unsafe-url"], missing: "" }, h0 = { A: true, LINK: true, BUTTON: true, INPUT: true, SELECT: true, TEXTAREA: true, COMMAND: true }, $e = function(e, t, r) {
    R.call(this, e, t, r), this._form = null;
  }, R = bn.HTMLElement = C({ superclass: No, name: "HTMLElement", ctor: function(t, r, n) {
    No.call(this, t, r, Oe.NAMESPACE.HTML, n);
  }, props: { dangerouslySetInnerHTML: { set: function(e) {
    this._innerHTML = e;
  } }, innerHTML: { get: function() {
    return this.serialize();
  }, set: function(e) {
    var t = this.ownerDocument.implementation.mozHTMLParser(this.ownerDocument._address, this);
    t.parse(e === null ? "" : String(e), true);
    for (var r = this instanceof Tr.template ? this.content : this; r.hasChildNodes(); )
      r.removeChild(r.firstChild);
    r.appendChild(t._asDocumentFragment());
  } }, style: { get: function() {
    return this._style || (this._style = new f0(this)), this._style;
  }, set: function(e) {
    e == null && (e = ""), this._setattr("style", String(e));
  } }, blur: { value: function() {
  } }, focus: { value: function() {
  } }, forceSpellCheck: { value: function() {
  } }, click: { value: function() {
    if (!this._click_in_progress) {
      this._click_in_progress = true;
      try {
        this._pre_click_activation_steps && this._pre_click_activation_steps();
        var e = this.ownerDocument.createEvent("MouseEvent");
        e.initMouseEvent("click", true, true, this.ownerDocument.defaultView, 1, 0, 0, 0, 0, false, false, false, false, 0, null);
        var t = this.dispatchEvent(e);
        t ? this._post_click_activation_steps && this._post_click_activation_steps(e) : this._cancelled_activation_steps && this._cancelled_activation_steps();
      } finally {
        this._click_in_progress = false;
      }
    }
  } }, submit: { value: Oe.nyi } }, attributes: { title: String, lang: String, dir: { type: ["ltr", "rtl", "auto"], missing: "" }, accessKey: String, hidden: Boolean, tabIndex: { type: "long", default: function() {
    return this.tagName in h0 || this.contentEditable ? 0 : -1;
  } } }, events: ["abort", "canplay", "canplaythrough", "change", "click", "contextmenu", "cuechange", "dblclick", "drag", "dragend", "dragenter", "dragleave", "dragover", "dragstart", "drop", "durationchange", "emptied", "ended", "input", "invalid", "keydown", "keypress", "keyup", "loadeddata", "loadedmetadata", "loadstart", "mousedown", "mousemove", "mouseout", "mouseover", "mouseup", "mousewheel", "pause", "play", "playing", "progress", "ratechange", "readystatechange", "reset", "seeked", "seeking", "select", "show", "stalled", "submit", "suspend", "timeupdate", "volumechange", "waiting", "blur", "error", "focus", "load", "scroll"] }), x0 = C({ name: "HTMLUnknownElement", ctor: function(t, r, n) {
    R.call(this, t, r, n);
  } }), Ke = { form: { get: function() {
    return this._form;
  } } };
  C({ tag: "a", name: "HTMLAnchorElement", ctor: function(t, r, n) {
    R.call(this, t, r, n);
  }, props: { _post_click_activation_steps: { value: function(e) {
    this.href && (this.ownerDocument.defaultView.location = this.href);
  } } }, attributes: { href: ge, ping: String, download: String, target: String, rel: String, media: String, hreflang: String, type: String, referrerPolicy: wr, coords: String, charset: String, name: String, rev: String, shape: String } });
  Co._inherit(Tr.a.prototype);
  C({ tag: "area", name: "HTMLAreaElement", ctor: function(t, r, n) {
    R.call(this, t, r, n);
  }, attributes: { alt: String, target: String, download: String, rel: String, media: String, href: ge, hreflang: String, type: String, shape: String, coords: String, ping: String, referrerPolicy: wr, noHref: Boolean } });
  Co._inherit(Tr.area.prototype);
  C({ tag: "br", name: "HTMLBRElement", ctor: function(t, r, n) {
    R.call(this, t, r, n);
  }, attributes: { clear: String } });
  C({ tag: "base", name: "HTMLBaseElement", ctor: function(t, r, n) {
    R.call(this, t, r, n);
  }, attributes: { target: String } });
  C({ tag: "body", name: "HTMLBodyElement", ctor: function(t, r, n) {
    R.call(this, t, r, n);
  }, events: ["afterprint", "beforeprint", "beforeunload", "blur", "error", "focus", "hashchange", "load", "message", "offline", "online", "pagehide", "pageshow", "popstate", "resize", "scroll", "storage", "unload"], attributes: { text: { type: String, treatNullAsEmptyString: true }, link: { type: String, treatNullAsEmptyString: true }, vLink: { type: String, treatNullAsEmptyString: true }, aLink: { type: String, treatNullAsEmptyString: true }, bgColor: { type: String, treatNullAsEmptyString: true }, background: String } });
  C({ tag: "button", name: "HTMLButtonElement", ctor: function(t, r, n) {
    $e.call(this, t, r, n);
  }, props: Ke, attributes: { name: String, value: String, disabled: Boolean, autofocus: Boolean, type: { type: ["submit", "reset", "button", "menu"], missing: "submit" }, formTarget: String, formNoValidate: Boolean, formMethod: { type: ["get", "post", "dialog"], invalid: "get", missing: "" }, formEnctype: { type: ["application/x-www-form-urlencoded", "multipart/form-data", "text/plain"], invalid: "application/x-www-form-urlencoded", missing: "" } } });
  C({ tag: "dl", name: "HTMLDListElement", ctor: function(t, r, n) {
    R.call(this, t, r, n);
  }, attributes: { compact: Boolean } });
  C({ tag: "data", name: "HTMLDataElement", ctor: function(t, r, n) {
    R.call(this, t, r, n);
  }, attributes: { value: String } });
  C({ tag: "datalist", name: "HTMLDataListElement", ctor: function(t, r, n) {
    R.call(this, t, r, n);
  } });
  C({ tag: "details", name: "HTMLDetailsElement", ctor: function(t, r, n) {
    R.call(this, t, r, n);
  }, attributes: { open: Boolean } });
  C({ tag: "div", name: "HTMLDivElement", ctor: function(t, r, n) {
    R.call(this, t, r, n);
  }, attributes: { align: String } });
  C({ tag: "embed", name: "HTMLEmbedElement", ctor: function(t, r, n) {
    R.call(this, t, r, n);
  }, attributes: { src: ge, type: String, width: String, height: String, align: String, name: String } });
  C({ tag: "fieldset", name: "HTMLFieldSetElement", ctor: function(t, r, n) {
    $e.call(this, t, r, n);
  }, props: Ke, attributes: { disabled: Boolean, name: String } });
  C({ tag: "form", name: "HTMLFormElement", ctor: function(t, r, n) {
    R.call(this, t, r, n);
  }, attributes: { action: String, autocomplete: { type: ["on", "off"], missing: "on" }, name: String, acceptCharset: { name: "accept-charset" }, target: String, noValidate: Boolean, method: { type: ["get", "post", "dialog"], invalid: "get", missing: "get" }, enctype: { type: ["application/x-www-form-urlencoded", "multipart/form-data", "text/plain"], invalid: "application/x-www-form-urlencoded", missing: "application/x-www-form-urlencoded" }, encoding: { name: "enctype", type: ["application/x-www-form-urlencoded", "multipart/form-data", "text/plain"], invalid: "application/x-www-form-urlencoded", missing: "application/x-www-form-urlencoded" } } });
  C({ tag: "hr", name: "HTMLHRElement", ctor: function(t, r, n) {
    R.call(this, t, r, n);
  }, attributes: { align: String, color: String, noShade: Boolean, size: String, width: String } });
  C({ tag: "head", name: "HTMLHeadElement", ctor: function(t, r, n) {
    R.call(this, t, r, n);
  } });
  C({ tags: ["h1", "h2", "h3", "h4", "h5", "h6"], name: "HTMLHeadingElement", ctor: function(t, r, n) {
    R.call(this, t, r, n);
  }, attributes: { align: String } });
  C({ tag: "html", name: "HTMLHtmlElement", ctor: function(t, r, n) {
    R.call(this, t, r, n);
  }, attributes: { version: String } });
  C({ tag: "iframe", name: "HTMLIFrameElement", ctor: function(t, r, n) {
    R.call(this, t, r, n);
  }, attributes: { src: ge, srcdoc: String, name: String, width: String, height: String, seamless: Boolean, allowFullscreen: Boolean, allowUserMedia: Boolean, allowPaymentRequest: Boolean, referrerPolicy: wr, align: String, scrolling: String, frameBorder: String, longDesc: ge, marginHeight: { type: String, treatNullAsEmptyString: true }, marginWidth: { type: String, treatNullAsEmptyString: true } } });
  C({ tag: "img", name: "HTMLImageElement", ctor: function(t, r, n) {
    R.call(this, t, r, n);
  }, attributes: { alt: String, src: ge, srcset: String, crossOrigin: gn, useMap: String, isMap: Boolean, height: { type: "unsigned long", default: 0 }, width: { type: "unsigned long", default: 0 }, referrerPolicy: wr, name: String, lowsrc: ge, align: String, hspace: { type: "unsigned long", default: 0 }, vspace: { type: "unsigned long", default: 0 }, longDesc: ge, border: { type: String, treatNullAsEmptyString: true } } });
  C({ tag: "input", name: "HTMLInputElement", ctor: function(t, r, n) {
    $e.call(this, t, r, n);
  }, props: { form: Ke.form, _post_click_activation_steps: { value: function(e) {
    if (this.type === "checkbox")
      this.checked = !this.checked;
    else if (this.type === "radio")
      for (var t = this.form.getElementsByName(this.name), r = t.length - 1; r >= 0; r--) {
        var n = t[r];
        n.checked = n === this;
      }
  } } }, attributes: { name: String, disabled: Boolean, autofocus: Boolean, accept: String, alt: String, max: String, min: String, pattern: String, placeholder: String, step: String, dirName: String, defaultValue: { name: "value" }, multiple: Boolean, required: Boolean, readOnly: Boolean, checked: Boolean, value: String, src: ge, defaultChecked: { name: "checked", type: Boolean }, size: { type: "unsigned long", default: 20, min: 1, setmin: 1 }, width: { type: "unsigned long", min: 0, setmin: 0, default: 0 }, height: { type: "unsigned long", min: 0, setmin: 0, default: 0 }, minLength: { type: "unsigned long", min: 0, setmin: 0, default: -1 }, maxLength: { type: "unsigned long", min: 0, setmin: 0, default: -1 }, autocomplete: String, type: { type: ["text", "hidden", "search", "tel", "url", "email", "password", "datetime", "date", "month", "week", "time", "datetime-local", "number", "range", "color", "checkbox", "radio", "file", "submit", "image", "reset", "button"], missing: "text" }, formTarget: String, formNoValidate: Boolean, formMethod: { type: ["get", "post"], invalid: "get", missing: "" }, formEnctype: { type: ["application/x-www-form-urlencoded", "multipart/form-data", "text/plain"], invalid: "application/x-www-form-urlencoded", missing: "" }, inputMode: { type: ["verbatim", "latin", "latin-name", "latin-prose", "full-width-latin", "kana", "kana-name", "katakana", "numeric", "tel", "email", "url"], missing: "" }, align: String, useMap: String } });
  C({ tag: "keygen", name: "HTMLKeygenElement", ctor: function(t, r, n) {
    $e.call(this, t, r, n);
  }, props: Ke, attributes: { name: String, disabled: Boolean, autofocus: Boolean, challenge: String, keytype: { type: ["rsa"], missing: "" } } });
  C({ tag: "li", name: "HTMLLIElement", ctor: function(t, r, n) {
    R.call(this, t, r, n);
  }, attributes: { value: { type: "long", default: 0 }, type: String } });
  C({ tag: "label", name: "HTMLLabelElement", ctor: function(t, r, n) {
    $e.call(this, t, r, n);
  }, props: Ke, attributes: { htmlFor: { name: "for", type: String } } });
  C({ tag: "legend", name: "HTMLLegendElement", ctor: function(t, r, n) {
    R.call(this, t, r, n);
  }, attributes: { align: String } });
  C({ tag: "link", name: "HTMLLinkElement", ctor: function(t, r, n) {
    R.call(this, t, r, n);
  }, attributes: { href: ge, rel: String, media: String, hreflang: String, type: String, crossOrigin: gn, nonce: String, integrity: String, referrerPolicy: wr, charset: String, rev: String, target: String } });
  C({ tag: "map", name: "HTMLMapElement", ctor: function(t, r, n) {
    R.call(this, t, r, n);
  }, attributes: { name: String } });
  C({ tag: "menu", name: "HTMLMenuElement", ctor: function(t, r, n) {
    R.call(this, t, r, n);
  }, attributes: { type: { type: ["context", "popup", "toolbar"], missing: "toolbar" }, label: String, compact: Boolean } });
  C({ tag: "meta", name: "HTMLMetaElement", ctor: function(t, r, n) {
    R.call(this, t, r, n);
  }, attributes: { name: String, content: String, httpEquiv: { name: "http-equiv", type: String }, scheme: String } });
  C({ tag: "meter", name: "HTMLMeterElement", ctor: function(t, r, n) {
    $e.call(this, t, r, n);
  }, props: Ke });
  C({ tags: ["ins", "del"], name: "HTMLModElement", ctor: function(t, r, n) {
    R.call(this, t, r, n);
  }, attributes: { cite: ge, dateTime: String } });
  C({ tag: "ol", name: "HTMLOListElement", ctor: function(t, r, n) {
    R.call(this, t, r, n);
  }, props: { _numitems: { get: function() {
    var e = 0;
    return this.childNodes.forEach(function(t) {
      t.nodeType === Qa.ELEMENT_NODE && t.tagName === "LI" && e++;
    }), e;
  } } }, attributes: { type: String, reversed: Boolean, start: { type: "long", default: function() {
    return this.reversed ? this._numitems : 1;
  } }, compact: Boolean } });
  C({ tag: "object", name: "HTMLObjectElement", ctor: function(t, r, n) {
    $e.call(this, t, r, n);
  }, props: Ke, attributes: { data: ge, type: String, name: String, useMap: String, typeMustMatch: Boolean, width: String, height: String, align: String, archive: String, code: String, declare: Boolean, hspace: { type: "unsigned long", default: 0 }, standby: String, vspace: { type: "unsigned long", default: 0 }, codeBase: ge, codeType: String, border: { type: String, treatNullAsEmptyString: true } } });
  C({ tag: "optgroup", name: "HTMLOptGroupElement", ctor: function(t, r, n) {
    R.call(this, t, r, n);
  }, attributes: { disabled: Boolean, label: String } });
  C({ tag: "option", name: "HTMLOptionElement", ctor: function(t, r, n) {
    R.call(this, t, r, n);
  }, props: { form: { get: function() {
    for (var e = this.parentNode; e && e.nodeType === Qa.ELEMENT_NODE; ) {
      if (e.localName === "select")
        return e.form;
      e = e.parentNode;
    }
  } }, value: { get: function() {
    return this._getattr("value") || this.text;
  }, set: function(e) {
    this._setattr("value", e);
  } }, text: { get: function() {
    return this.textContent.replace(/[ \t\n\f\r]+/g, " ").trim();
  }, set: function(e) {
    this.textContent = e;
  } } }, attributes: { disabled: Boolean, defaultSelected: { name: "selected", type: Boolean }, label: String } });
  C({ tag: "output", name: "HTMLOutputElement", ctor: function(t, r, n) {
    $e.call(this, t, r, n);
  }, props: Ke, attributes: { name: String } });
  C({ tag: "p", name: "HTMLParagraphElement", ctor: function(t, r, n) {
    R.call(this, t, r, n);
  }, attributes: { align: String } });
  C({ tag: "param", name: "HTMLParamElement", ctor: function(t, r, n) {
    R.call(this, t, r, n);
  }, attributes: { name: String, value: String, type: String, valueType: String } });
  C({ tags: ["pre", "listing", "xmp"], name: "HTMLPreElement", ctor: function(t, r, n) {
    R.call(this, t, r, n);
  }, attributes: { width: { type: "long", default: 0 } } });
  C({ tag: "progress", name: "HTMLProgressElement", ctor: function(t, r, n) {
    $e.call(this, t, r, n);
  }, props: Ke, attributes: { max: { type: Number, float: true, default: 1, min: 0 } } });
  C({ tags: ["q", "blockquote"], name: "HTMLQuoteElement", ctor: function(t, r, n) {
    R.call(this, t, r, n);
  }, attributes: { cite: ge } });
  C({ tag: "script", name: "HTMLScriptElement", ctor: function(t, r, n) {
    R.call(this, t, r, n);
  }, props: { text: { get: function() {
    for (var e = "", t = 0, r = this.childNodes.length; t < r; t++) {
      var n = this.childNodes[t];
      n.nodeType === Qa.TEXT_NODE && (e += n._data);
    }
    return e;
  }, set: function(e) {
    this.removeChildren(), e !== null && e !== "" && this.appendChild(this.ownerDocument.createTextNode(e));
  } } }, attributes: { src: ge, type: String, charset: String, defer: Boolean, async: Boolean, crossOrigin: gn, nonce: String, integrity: String } });
  C({ tag: "select", name: "HTMLSelectElement", ctor: function(t, r, n) {
    $e.call(this, t, r, n);
  }, props: { form: Ke.form, options: { get: function() {
    return this.getElementsByTagName("option");
  } } }, attributes: { autocomplete: String, name: String, disabled: Boolean, autofocus: Boolean, multiple: Boolean, required: Boolean, size: { type: "unsigned long", default: 0 } } });
  C({ tag: "source", name: "HTMLSourceElement", ctor: function(t, r, n) {
    R.call(this, t, r, n);
  }, attributes: { src: ge, type: String, media: String } });
  C({ tag: "span", name: "HTMLSpanElement", ctor: function(t, r, n) {
    R.call(this, t, r, n);
  } });
  C({ tag: "style", name: "HTMLStyleElement", ctor: function(t, r, n) {
    R.call(this, t, r, n);
  }, attributes: { media: String, type: String, scoped: Boolean } });
  C({ tag: "caption", name: "HTMLTableCaptionElement", ctor: function(t, r, n) {
    R.call(this, t, r, n);
  }, attributes: { align: String } });
  C({ name: "HTMLTableCellElement", ctor: function(t, r, n) {
    R.call(this, t, r, n);
  }, attributes: { colSpan: { type: "unsigned long", default: 1 }, rowSpan: { type: "unsigned long", default: 1 }, scope: { type: ["row", "col", "rowgroup", "colgroup"], missing: "" }, abbr: String, align: String, axis: String, height: String, width: String, ch: { name: "char", type: String }, chOff: { name: "charoff", type: String }, noWrap: Boolean, vAlign: String, bgColor: { type: String, treatNullAsEmptyString: true } } });
  C({ tags: ["col", "colgroup"], name: "HTMLTableColElement", ctor: function(t, r, n) {
    R.call(this, t, r, n);
  }, attributes: { span: { type: "limited unsigned long with fallback", default: 1, min: 1 }, align: String, ch: { name: "char", type: String }, chOff: { name: "charoff", type: String }, vAlign: String, width: String } });
  C({ tag: "table", name: "HTMLTableElement", ctor: function(t, r, n) {
    R.call(this, t, r, n);
  }, props: { rows: { get: function() {
    return this.getElementsByTagName("tr");
  } } }, attributes: { align: String, border: String, frame: String, rules: String, summary: String, width: String, bgColor: { type: String, treatNullAsEmptyString: true }, cellPadding: { type: String, treatNullAsEmptyString: true }, cellSpacing: { type: String, treatNullAsEmptyString: true } } });
  C({ tag: "template", name: "HTMLTemplateElement", ctor: function(t, r, n) {
    R.call(this, t, r, n), this._contentFragment = t._templateDoc.createDocumentFragment();
  }, props: { content: { get: function() {
    return this._contentFragment;
  } }, serialize: { value: function() {
    return this.content.serialize();
  } } } });
  C({ tag: "tr", name: "HTMLTableRowElement", ctor: function(t, r, n) {
    R.call(this, t, r, n);
  }, props: { cells: { get: function() {
    return this.querySelectorAll("td,th");
  } } }, attributes: { align: String, ch: { name: "char", type: String }, chOff: { name: "charoff", type: String }, vAlign: String, bgColor: { type: String, treatNullAsEmptyString: true } } });
  C({ tags: ["thead", "tfoot", "tbody"], name: "HTMLTableSectionElement", ctor: function(t, r, n) {
    R.call(this, t, r, n);
  }, props: { rows: { get: function() {
    return this.getElementsByTagName("tr");
  } } }, attributes: { align: String, ch: { name: "char", type: String }, chOff: { name: "charoff", type: String }, vAlign: String } });
  C({ tag: "textarea", name: "HTMLTextAreaElement", ctor: function(t, r, n) {
    $e.call(this, t, r, n);
  }, props: { form: Ke.form, type: { get: function() {
    return "textarea";
  } }, defaultValue: { get: function() {
    return this.textContent;
  }, set: function(e) {
    this.textContent = e;
  } }, value: { get: function() {
    return this.defaultValue;
  }, set: function(e) {
    this.defaultValue = e;
  } }, textLength: { get: function() {
    return this.value.length;
  } } }, attributes: { autocomplete: String, name: String, disabled: Boolean, autofocus: Boolean, placeholder: String, wrap: String, dirName: String, required: Boolean, readOnly: Boolean, rows: { type: "limited unsigned long with fallback", default: 2 }, cols: { type: "limited unsigned long with fallback", default: 20 }, maxLength: { type: "unsigned long", min: 0, setmin: 0, default: -1 }, minLength: { type: "unsigned long", min: 0, setmin: 0, default: -1 }, inputMode: { type: ["verbatim", "latin", "latin-name", "latin-prose", "full-width-latin", "kana", "kana-name", "katakana", "numeric", "tel", "email", "url"], missing: "" } } });
  C({ tag: "time", name: "HTMLTimeElement", ctor: function(t, r, n) {
    R.call(this, t, r, n);
  }, attributes: { dateTime: String, pubDate: Boolean } });
  C({ tag: "title", name: "HTMLTitleElement", ctor: function(t, r, n) {
    R.call(this, t, r, n);
  }, props: { text: { get: function() {
    return this.textContent;
  } } } });
  C({ tag: "ul", name: "HTMLUListElement", ctor: function(t, r, n) {
    R.call(this, t, r, n);
  }, attributes: { type: String, compact: Boolean } });
  C({ name: "HTMLMediaElement", ctor: function(t, r, n) {
    R.call(this, t, r, n);
  }, attributes: { src: ge, crossOrigin: gn, preload: { type: ["metadata", "none", "auto", { value: "", alias: "auto" }], missing: "auto" }, loop: Boolean, autoplay: Boolean, mediaGroup: String, controls: Boolean, defaultMuted: { name: "muted", type: Boolean } } });
  C({ tag: "audio", superclass: lt.HTMLMediaElement, name: "HTMLAudioElement", ctor: function(t, r, n) {
    lt.HTMLMediaElement.call(this, t, r, n);
  } });
  C({ tag: "video", superclass: lt.HTMLMediaElement, name: "HTMLVideoElement", ctor: function(t, r, n) {
    lt.HTMLMediaElement.call(this, t, r, n);
  }, attributes: { poster: ge, width: { type: "unsigned long", min: 0, default: 0 }, height: { type: "unsigned long", min: 0, default: 0 } } });
  C({ tag: "td", superclass: lt.HTMLTableCellElement, name: "HTMLTableDataCellElement", ctor: function(t, r, n) {
    lt.HTMLTableCellElement.call(this, t, r, n);
  } });
  C({ tag: "th", superclass: lt.HTMLTableCellElement, name: "HTMLTableHeaderCellElement", ctor: function(t, r, n) {
    lt.HTMLTableCellElement.call(this, t, r, n);
  } });
  C({ tag: "frameset", name: "HTMLFrameSetElement", ctor: function(t, r, n) {
    R.call(this, t, r, n);
  } });
  C({ tag: "frame", name: "HTMLFrameElement", ctor: function(t, r, n) {
    R.call(this, t, r, n);
  } });
  C({ tag: "canvas", name: "HTMLCanvasElement", ctor: function(t, r, n) {
    R.call(this, t, r, n);
  }, props: { getContext: { value: Oe.nyi }, probablySupportsContext: { value: Oe.nyi }, setContext: { value: Oe.nyi }, transferControlToProxy: { value: Oe.nyi }, toDataURL: { value: Oe.nyi }, toBlob: { value: Oe.nyi } }, attributes: { width: { type: "unsigned long", default: 300 }, height: { type: "unsigned long", default: 150 } } });
  C({ tag: "dialog", name: "HTMLDialogElement", ctor: function(t, r, n) {
    R.call(this, t, r, n);
  }, props: { show: { value: Oe.nyi }, showModal: { value: Oe.nyi }, close: { value: Oe.nyi } }, attributes: { open: Boolean, returnValue: String } });
  C({ tag: "menuitem", name: "HTMLMenuItemElement", ctor: function(t, r, n) {
    R.call(this, t, r, n);
  }, props: { _label: { get: function() {
    var e = this._getattr("label");
    return e !== null && e !== "" ? e : (e = this.textContent, e.replace(/[ \t\n\f\r]+/g, " ").trim());
  } }, label: { get: function() {
    var e = this._getattr("label");
    return e !== null ? e : this._label;
  }, set: function(e) {
    this._setattr("label", e);
  } } }, attributes: { type: { type: ["command", "checkbox", "radio"], missing: "command" }, icon: ge, disabled: Boolean, checked: Boolean, radiogroup: String, default: Boolean } });
  C({ tag: "source", name: "HTMLSourceElement", ctor: function(t, r, n) {
    R.call(this, t, r, n);
  }, attributes: { srcset: String, sizes: String, media: String, src: ge, type: String } });
  C({ tag: "track", name: "HTMLTrackElement", ctor: function(t, r, n) {
    R.call(this, t, r, n);
  }, attributes: { src: ge, srclang: String, label: String, default: Boolean, kind: { type: ["subtitles", "captions", "descriptions", "chapters", "metadata"], missing: "subtitles", invalid: "metadata" } }, props: { NONE: { get: function() {
    return 0;
  } }, LOADING: { get: function() {
    return 1;
  } }, LOADED: { get: function() {
    return 2;
  } }, ERROR: { get: function() {
    return 3;
  } }, readyState: { get: Oe.nyi }, track: { get: Oe.nyi } } });
  C({ tag: "font", name: "HTMLFontElement", ctor: function(t, r, n) {
    R.call(this, t, r, n);
  }, attributes: { color: { type: String, treatNullAsEmptyString: true }, face: { type: String }, size: { type: String } } });
  C({ tag: "dir", name: "HTMLDirectoryElement", ctor: function(t, r, n) {
    R.call(this, t, r, n);
  }, attributes: { compact: Boolean } });
  C({ tags: ["abbr", "address", "article", "aside", "b", "bdi", "bdo", "cite", "code", "dd", "dfn", "dt", "em", "figcaption", "figure", "footer", "header", "hgroup", "i", "kbd", "main", "mark", "nav", "noscript", "rb", "rp", "rt", "rtc", "ruby", "s", "samp", "section", "small", "strong", "sub", "summary", "sup", "u", "var", "wbr", "acronym", "basefont", "big", "center", "nobr", "noembed", "noframes", "plaintext", "strike", "tt"] });
});
var ei = O((En) => {
  var Lo = Kt(), p0 = Xa(), m0 = le(), g0 = mn(), b0 = En.elements = {}, Ao = /* @__PURE__ */ Object.create(null);
  En.createElement = function(e, t, r) {
    var n = Ao[t] || Ja;
    return new n(e, t, r);
  };
  function Za(e) {
    return p0(e, Ja, b0, Ao);
  }
  var Ja = Za({ superclass: Lo, name: "SVGElement", ctor: function(t, r, n) {
    Lo.call(this, t, r, m0.NAMESPACE.SVG, n);
  }, props: { style: { get: function() {
    return this._style || (this._style = new g0(this)), this._style;
  } } } });
  Za({ name: "SVGSVGElement", ctor: function(t, r, n) {
    Ja.call(this, t, r, n);
  }, tag: "svg", props: { createSVGRect: { value: function() {
    return En.createElement(this.ownerDocument, "rect", null);
  } } } });
  Za({ tags: ["a", "altGlyph", "altGlyphDef", "altGlyphItem", "animate", "animateColor", "animateMotion", "animateTransform", "circle", "clipPath", "color-profile", "cursor", "defs", "desc", "ellipse", "feBlend", "feColorMatrix", "feComponentTransfer", "feComposite", "feConvolveMatrix", "feDiffuseLighting", "feDisplacementMap", "feDistantLight", "feFlood", "feFuncA", "feFuncB", "feFuncG", "feFuncR", "feGaussianBlur", "feImage", "feMerge", "feMergeNode", "feMorphology", "feOffset", "fePointLight", "feSpecularLighting", "feSpotLight", "feTile", "feTurbulence", "filter", "font", "font-face", "font-face-format", "font-face-name", "font-face-src", "font-face-uri", "foreignObject", "g", "glyph", "glyphRef", "hkern", "image", "line", "linearGradient", "marker", "mask", "metadata", "missing-glyph", "mpath", "path", "pattern", "polygon", "polyline", "radialGradient", "rect", "script", "set", "stop", "style", "switch", "symbol", "text", "textPath", "title", "tref", "tspan", "use", "view", "vkern"] });
});
var Ro = O((id, Mo) => {
  Mo.exports = { VALUE: 1, ATTR: 2, REMOVE_ATTR: 3, REMOVE: 4, MOVE: 5, INSERT: 6 };
});
var yn = O((sd, Vo) => {
  Vo.exports = Sr;
  var Se = Te(), _0 = It(), Po = en(), wt = Kt(), E0 = Ra(), v0 = Ia(), kr = Vt(), y0 = Ha(), T0 = Ba(), w0 = Nr(), k0 = ao(), S0 = uo(), Do = Er(), Io = pn(), Oo = sn(), N0 = $a(), vn = tn(), ti = _n(), C0 = ei(), X = le(), Qt = Ro(), Jt = X.NAMESPACE, ri = Qr().isApiWritable;
  function Sr(e, t) {
    Po.call(this), this.nodeType = Se.DOCUMENT_NODE, this.isHTML = e, this._address = t || "about:blank", this.readyState = "loading", this.implementation = new w0(this), this.ownerDocument = null, this._contentType = e ? "text/html" : "application/xml", this.doctype = null, this.documentElement = null, this._templateDocCache = null, this._nodeIterators = null, this._nid = 1, this._nextnid = 2, this._nodes = [null, this], this.byId = /* @__PURE__ */ Object.create(null), this.modclock = 0;
  }
  var L0 = { event: "Event", customevent: "CustomEvent", uievent: "UIEvent", mouseevent: "MouseEvent" }, A0 = { events: "event", htmlevents: "event", mouseevents: "mouseevent", mutationevents: "mutationevent", uievents: "uievent" }, Zt = function(e, t, r) {
    return { get: function() {
      var n = e.call(this);
      return n ? n[t] : r;
    }, set: function(n) {
      var l = e.call(this);
      l && (l[t] = n);
    } };
  };
  function qo(e, t) {
    var r, n, l;
    return e === "" && (e = null), vn.isValidQName(t) || X.InvalidCharacterError(), r = null, n = t, l = t.indexOf(":"), l >= 0 && (r = t.substring(0, l), n = t.substring(l + 1)), r !== null && e === null && X.NamespaceError(), r === "xml" && e !== Jt.XML && X.NamespaceError(), (r === "xmlns" || t === "xmlns") && e !== Jt.XMLNS && X.NamespaceError(), e === Jt.XMLNS && !(r === "xmlns" || t === "xmlns") && X.NamespaceError(), { namespace: e, prefix: r, localName: n };
  }
  Sr.prototype = Object.create(Po.prototype, { _setMutationHandler: { value: function(e) {
    this.mutationHandler = e;
  } }, _dispatchRendererEvent: { value: function(e, t, r) {
    var n = this._nodes[e];
    !n || n._dispatchEvent(new kr(t, r), true);
  } }, nodeName: { value: "#document" }, nodeValue: { get: function() {
    return null;
  }, set: function() {
  } }, documentURI: { get: function() {
    return this._address;
  }, set: X.nyi }, compatMode: { get: function() {
    return this._quirks ? "BackCompat" : "CSS1Compat";
  } }, createTextNode: { value: function(e) {
    return new E0(this, String(e));
  } }, createComment: { value: function(e) {
    return new v0(this, e);
  } }, createDocumentFragment: { value: function() {
    return new y0(this);
  } }, createProcessingInstruction: { value: function(e, t) {
    return (!vn.isValidName(e) || t.indexOf("?>") !== -1) && X.InvalidCharacterError(), new T0(this, e, t);
  } }, createAttribute: { value: function(e) {
    return e = String(e), vn.isValidName(e) || X.InvalidCharacterError(), this.isHTML && (e = X.toASCIILowerCase(e)), new wt._Attr(null, e, null, null, "");
  } }, createAttributeNS: { value: function(e, t) {
    e = e == null || e === "" ? null : String(e), t = String(t);
    var r = qo(e, t);
    return new wt._Attr(null, r.localName, r.prefix, r.namespace, "");
  } }, createElement: { value: function(e) {
    return e = String(e), vn.isValidName(e) || X.InvalidCharacterError(), this.isHTML ? (/[A-Z]/.test(e) && (e = X.toASCIILowerCase(e)), ti.createElement(this, e, null)) : this.contentType === "application/xhtml+xml" ? ti.createElement(this, e, null) : new wt(this, e, null, null);
  }, writable: ri }, createElementNS: { value: function(e, t) {
    e = e == null || e === "" ? null : String(e), t = String(t);
    var r = qo(e, t);
    return this._createElementNS(r.localName, r.namespace, r.prefix);
  }, writable: ri }, _createElementNS: { value: function(e, t, r) {
    return t === Jt.HTML ? ti.createElement(this, e, r) : t === Jt.SVG ? C0.createElement(this, e, r) : new wt(this, e, t, r);
  } }, createEvent: { value: function(t) {
    t = t.toLowerCase();
    var r = A0[t] || t, n = N0[L0[r]];
    if (n) {
      var l = new n();
      return l._initialized = false, l;
    } else
      X.NotSupportedError();
  } }, createTreeWalker: { value: function(e, t, r) {
    if (!e)
      throw new TypeError("root argument is required");
    if (!(e instanceof Se))
      throw new TypeError("root not a node");
    return t = t === void 0 ? Do.SHOW_ALL : +t, r = r === void 0 ? null : r, new k0(e, t, r);
  } }, createNodeIterator: { value: function(e, t, r) {
    if (!e)
      throw new TypeError("root argument is required");
    if (!(e instanceof Se))
      throw new TypeError("root not a node");
    return t = t === void 0 ? Do.SHOW_ALL : +t, r = r === void 0 ? null : r, new S0(e, t, r);
  } }, _attachNodeIterator: { value: function(e) {
    this._nodeIterators || (this._nodeIterators = []), this._nodeIterators.push(e);
  } }, _detachNodeIterator: { value: function(e) {
    var t = this._nodeIterators.indexOf(e);
    this._nodeIterators.splice(t, 1);
  } }, _preremoveNodeIterators: { value: function(e) {
    this._nodeIterators && this._nodeIterators.forEach(function(t) {
      t._preremove(e);
    });
  } }, _updateDocTypeElement: { value: function() {
    this.doctype = this.documentElement = null;
    for (var t = this.firstChild; t !== null; t = t.nextSibling)
      t.nodeType === Se.DOCUMENT_TYPE_NODE ? this.doctype = t : t.nodeType === Se.ELEMENT_NODE && (this.documentElement = t);
  } }, insertBefore: { value: function(t, r) {
    return Se.prototype.insertBefore.call(this, t, r), this._updateDocTypeElement(), t;
  } }, replaceChild: { value: function(t, r) {
    return Se.prototype.replaceChild.call(this, t, r), this._updateDocTypeElement(), r;
  } }, removeChild: { value: function(t) {
    return Se.prototype.removeChild.call(this, t), this._updateDocTypeElement(), t;
  } }, getElementById: { value: function(e) {
    var t = this.byId[e];
    return t ? t instanceof ut ? t.getFirst() : t : null;
  } }, _hasMultipleElementsWithId: { value: function(e) {
    return this.byId[e] instanceof ut;
  } }, getElementsByName: { value: wt.prototype.getElementsByName }, getElementsByTagName: { value: wt.prototype.getElementsByTagName }, getElementsByTagNameNS: { value: wt.prototype.getElementsByTagNameNS }, getElementsByClassName: { value: wt.prototype.getElementsByClassName }, adoptNode: { value: function(t) {
    return t.nodeType === Se.DOCUMENT_NODE && X.NotSupportedError(), t.nodeType === Se.ATTRIBUTE_NODE || (t.parentNode && t.parentNode.removeChild(t), t.ownerDocument !== this && Uo(t, this)), t;
  } }, importNode: { value: function(t, r) {
    return this.adoptNode(t.cloneNode(r));
  }, writable: ri }, origin: { get: function() {
    return null;
  } }, characterSet: { get: function() {
    return "UTF-8";
  } }, contentType: { get: function() {
    return this._contentType;
  } }, URL: { get: function() {
    return this._address;
  } }, domain: { get: X.nyi, set: X.nyi }, referrer: { get: X.nyi }, cookie: { get: X.nyi, set: X.nyi }, lastModified: { get: X.nyi }, location: { get: function() {
    return this.defaultView ? this.defaultView.location : null;
  }, set: X.nyi }, _titleElement: { get: function() {
    return this.getElementsByTagName("title").item(0) || null;
  } }, title: { get: function() {
    var e = this._titleElement, t = e ? e.textContent : "";
    return t.replace(/[ \t\n\r\f]+/g, " ").replace(/(^ )|( $)/g, "");
  }, set: function(e) {
    var t = this._titleElement, r = this.head;
    !t && !r || (t || (t = this.createElement("title"), r.appendChild(t)), t.textContent = e);
  } }, dir: Zt(function() {
    var e = this.documentElement;
    if (e && e.tagName === "HTML")
      return e;
  }, "dir", ""), fgColor: Zt(function() {
    return this.body;
  }, "text", ""), linkColor: Zt(function() {
    return this.body;
  }, "link", ""), vlinkColor: Zt(function() {
    return this.body;
  }, "vLink", ""), alinkColor: Zt(function() {
    return this.body;
  }, "aLink", ""), bgColor: Zt(function() {
    return this.body;
  }, "bgColor", ""), charset: { get: function() {
    return this.characterSet;
  } }, inputEncoding: { get: function() {
    return this.characterSet;
  } }, scrollingElement: { get: function() {
    return this._quirks ? this.body : this.documentElement;
  } }, body: { get: function() {
    return Ho(this.documentElement, "body");
  }, set: X.nyi }, head: { get: function() {
    return Ho(this.documentElement, "head");
  } }, images: { get: X.nyi }, embeds: { get: X.nyi }, plugins: { get: X.nyi }, links: { get: X.nyi }, forms: { get: X.nyi }, scripts: { get: X.nyi }, applets: { get: function() {
    return [];
  } }, activeElement: { get: function() {
    return null;
  } }, innerHTML: { get: function() {
    return this.serialize();
  }, set: X.nyi }, outerHTML: { get: function() {
    return this.serialize();
  }, set: X.nyi }, write: { value: function(e) {
    if (this.isHTML || X.InvalidStateError(), !!this._parser) {
      this._parser;
      var t = arguments.join("");
      this._parser.parse(t);
    }
  } }, writeln: { value: function(t) {
    this.write(Array.prototype.join.call(arguments, "") + `
`);
  } }, open: { value: function() {
    this.documentElement = null;
  } }, close: { value: function() {
    this.readyState = "interactive", this._dispatchEvent(new kr("readystatechange"), true), this._dispatchEvent(new kr("DOMContentLoaded"), true), this.readyState = "complete", this._dispatchEvent(new kr("readystatechange"), true), this.defaultView && this.defaultView._dispatchEvent(new kr("load"), true);
  } }, clone: { value: function() {
    var t = new Sr(this.isHTML, this._address);
    return t._quirks = this._quirks, t._contentType = this._contentType, t;
  } }, cloneNode: { value: function(t) {
    var r = Se.prototype.cloneNode.call(this, false);
    if (t)
      for (var n = this.firstChild; n !== null; n = n.nextSibling)
        r._appendChild(r.importNode(n, true));
    return r._updateDocTypeElement(), r;
  } }, isEqual: { value: function(t) {
    return true;
  } }, mutateValue: { value: function(e) {
    this.mutationHandler && this.mutationHandler({ type: Qt.VALUE, target: e, data: e.data });
  } }, mutateAttr: { value: function(e, t) {
    this.mutationHandler && this.mutationHandler({ type: Qt.ATTR, target: e.ownerElement, attr: e });
  } }, mutateRemoveAttr: { value: function(e) {
    this.mutationHandler && this.mutationHandler({ type: Qt.REMOVE_ATTR, target: e.ownerElement, attr: e });
  } }, mutateRemove: { value: function(e) {
    this.mutationHandler && this.mutationHandler({ type: Qt.REMOVE, target: e.parentNode, node: e }), Fo(e);
  } }, mutateInsert: { value: function(e) {
    Bo(e), this.mutationHandler && this.mutationHandler({ type: Qt.INSERT, target: e.parentNode, node: e });
  } }, mutateMove: { value: function(e) {
    this.mutationHandler && this.mutationHandler({ type: Qt.MOVE, target: e });
  } }, addId: { value: function(t, r) {
    var n = this.byId[t];
    n ? (n instanceof ut || (n = new ut(n), this.byId[t] = n), n.add(r)) : this.byId[t] = r;
  } }, delId: { value: function(t, r) {
    var n = this.byId[t];
    X.assert(n), n instanceof ut ? (n.del(r), n.length === 1 && (this.byId[t] = n.downgrade())) : this.byId[t] = void 0;
  } }, _resolve: { value: function(e) {
    return new Io(this._documentBaseURL).resolve(e);
  } }, _documentBaseURL: { get: function() {
    var e = this._address;
    e === "about:blank" && (e = "/");
    var t = this.querySelector("base[href]");
    return t ? new Io(e).resolve(t.getAttribute("href")) : e;
  } }, _templateDoc: { get: function() {
    if (!this._templateDocCache) {
      var e = new Sr(this.isHTML, this._address);
      this._templateDocCache = e._templateDocCache = e;
    }
    return this._templateDocCache;
  } }, querySelector: { value: function(e) {
    return Oo(e, this)[0];
  } }, querySelectorAll: { value: function(e) {
    var t = Oo(e, this);
    return t.item ? t : new _0(t);
  } } });
  var M0 = ["abort", "canplay", "canplaythrough", "change", "click", "contextmenu", "cuechange", "dblclick", "drag", "dragend", "dragenter", "dragleave", "dragover", "dragstart", "drop", "durationchange", "emptied", "ended", "input", "invalid", "keydown", "keypress", "keyup", "loadeddata", "loadedmetadata", "loadstart", "mousedown", "mousemove", "mouseout", "mouseover", "mouseup", "mousewheel", "pause", "play", "playing", "progress", "ratechange", "readystatechange", "reset", "seeked", "seeking", "select", "show", "stalled", "submit", "suspend", "timeupdate", "volumechange", "waiting", "blur", "error", "focus", "load", "scroll"];
  M0.forEach(function(e) {
    Object.defineProperty(Sr.prototype, "on" + e, { get: function() {
      return this._getEventHandler(e);
    }, set: function(t) {
      this._setEventHandler(e, t);
    } });
  });
  function Ho(e, t) {
    if (e && e.isHTML) {
      for (var r = e.firstChild; r !== null; r = r.nextSibling)
        if (r.nodeType === Se.ELEMENT_NODE && r.localName === t && r.namespaceURI === Jt.HTML)
          return r;
    }
    return null;
  }
  function R0(e) {
    if (e._nid = e.ownerDocument._nextnid++, e.ownerDocument._nodes[e._nid] = e, e.nodeType === Se.ELEMENT_NODE) {
      var t = e.getAttribute("id");
      t && e.ownerDocument.addId(t, e), e._roothook && e._roothook();
    }
  }
  function D0(e) {
    if (e.nodeType === Se.ELEMENT_NODE) {
      var t = e.getAttribute("id");
      t && e.ownerDocument.delId(t, e);
    }
    e.ownerDocument._nodes[e._nid] = void 0, e._nid = void 0;
  }
  function Bo(e) {
    if (R0(e), e.nodeType === Se.ELEMENT_NODE)
      for (var t = e.firstChild; t !== null; t = t.nextSibling)
        Bo(t);
  }
  function Fo(e) {
    D0(e);
    for (var t = e.firstChild; t !== null; t = t.nextSibling)
      Fo(t);
  }
  function Uo(e, t) {
    e.ownerDocument = t, e._lastModTime = void 0, Object.prototype.hasOwnProperty.call(e, "_tagName") && (e._tagName = void 0);
    for (var r = e.firstChild; r !== null; r = r.nextSibling)
      Uo(r, t);
  }
  function ut(e) {
    this.nodes = /* @__PURE__ */ Object.create(null), this.nodes[e._nid] = e, this.length = 1, this.firstNode = void 0;
  }
  ut.prototype.add = function(e) {
    this.nodes[e._nid] || (this.nodes[e._nid] = e, this.length++, this.firstNode = void 0);
  };
  ut.prototype.del = function(e) {
    this.nodes[e._nid] && (delete this.nodes[e._nid], this.length--, this.firstNode = void 0);
  };
  ut.prototype.getFirst = function() {
    if (!this.firstNode) {
      var e;
      for (e in this.nodes)
        (this.firstNode === void 0 || this.firstNode.compareDocumentPosition(this.nodes[e]) & Se.DOCUMENT_POSITION_PRECEDING) && (this.firstNode = this.nodes[e]);
    }
    return this.firstNode;
  };
  ut.prototype.downgrade = function() {
    if (this.length === 1) {
      var e;
      for (e in this.nodes)
        return this.nodes[e];
    }
    return this;
  };
});
var wn = O((od, jo) => {
  jo.exports = Tn;
  var I0 = Te(), zo = Aa(), O0 = on();
  function Tn(e, t, r, n) {
    zo.call(this), this.nodeType = I0.DOCUMENT_TYPE_NODE, this.ownerDocument = e || null, this.name = t, this.publicId = r || "", this.systemId = n || "";
  }
  Tn.prototype = Object.create(zo.prototype, { nodeName: { get: function() {
    return this.name;
  } }, nodeValue: { get: function() {
    return null;
  }, set: function() {
  } }, clone: { value: function() {
    return new Tn(this.ownerDocument, this.name, this.publicId, this.systemId);
  } }, isEqual: { value: function(t) {
    return this.name === t.name && this.publicId === t.publicId && this.systemId === t.systemId;
  } } });
  Object.defineProperties(Tn.prototype, O0);
});
var Mn = O((cd, hc) => {
  hc.exports = Y;
  var q0 = yn(), H0 = wn(), ni = Te(), q = le().NAMESPACE, ic = _n(), ee = ic.elements, qt = Function.prototype.apply.bind(Array.prototype.push), kn = -1, er = 1, Ne = 2, W = 3, rt = 4, P0 = 5, B0 = [], F0 = /^HTML$|^-\/\/W3O\/\/DTD W3 HTML Strict 3\.0\/\/EN\/\/$|^-\/W3C\/DTD HTML 4\.0 Transitional\/EN$|^\+\/\/Silmaril\/\/dtd html Pro v0r11 19970101\/\/|^-\/\/AdvaSoft Ltd\/\/DTD HTML 3\.0 asWedit \+ extensions\/\/|^-\/\/AS\/\/DTD HTML 3\.0 asWedit \+ extensions\/\/|^-\/\/IETF\/\/DTD HTML 2\.0 Level 1\/\/|^-\/\/IETF\/\/DTD HTML 2\.0 Level 2\/\/|^-\/\/IETF\/\/DTD HTML 2\.0 Strict Level 1\/\/|^-\/\/IETF\/\/DTD HTML 2\.0 Strict Level 2\/\/|^-\/\/IETF\/\/DTD HTML 2\.0 Strict\/\/|^-\/\/IETF\/\/DTD HTML 2\.0\/\/|^-\/\/IETF\/\/DTD HTML 2\.1E\/\/|^-\/\/IETF\/\/DTD HTML 3\.0\/\/|^-\/\/IETF\/\/DTD HTML 3\.2 Final\/\/|^-\/\/IETF\/\/DTD HTML 3\.2\/\/|^-\/\/IETF\/\/DTD HTML 3\/\/|^-\/\/IETF\/\/DTD HTML Level 0\/\/|^-\/\/IETF\/\/DTD HTML Level 1\/\/|^-\/\/IETF\/\/DTD HTML Level 2\/\/|^-\/\/IETF\/\/DTD HTML Level 3\/\/|^-\/\/IETF\/\/DTD HTML Strict Level 0\/\/|^-\/\/IETF\/\/DTD HTML Strict Level 1\/\/|^-\/\/IETF\/\/DTD HTML Strict Level 2\/\/|^-\/\/IETF\/\/DTD HTML Strict Level 3\/\/|^-\/\/IETF\/\/DTD HTML Strict\/\/|^-\/\/IETF\/\/DTD HTML\/\/|^-\/\/Metrius\/\/DTD Metrius Presentational\/\/|^-\/\/Microsoft\/\/DTD Internet Explorer 2\.0 HTML Strict\/\/|^-\/\/Microsoft\/\/DTD Internet Explorer 2\.0 HTML\/\/|^-\/\/Microsoft\/\/DTD Internet Explorer 2\.0 Tables\/\/|^-\/\/Microsoft\/\/DTD Internet Explorer 3\.0 HTML Strict\/\/|^-\/\/Microsoft\/\/DTD Internet Explorer 3\.0 HTML\/\/|^-\/\/Microsoft\/\/DTD Internet Explorer 3\.0 Tables\/\/|^-\/\/Netscape Comm\. Corp\.\/\/DTD HTML\/\/|^-\/\/Netscape Comm\. Corp\.\/\/DTD Strict HTML\/\/|^-\/\/O'Reilly and Associates\/\/DTD HTML 2\.0\/\/|^-\/\/O'Reilly and Associates\/\/DTD HTML Extended 1\.0\/\/|^-\/\/O'Reilly and Associates\/\/DTD HTML Extended Relaxed 1\.0\/\/|^-\/\/SoftQuad Software\/\/DTD HoTMetaL PRO 6\.0::19990601::extensions to HTML 4\.0\/\/|^-\/\/SoftQuad\/\/DTD HoTMetaL PRO 4\.0::19971010::extensions to HTML 4\.0\/\/|^-\/\/Spyglass\/\/DTD HTML 2\.0 Extended\/\/|^-\/\/SQ\/\/DTD HTML 2\.0 HoTMetaL \+ extensions\/\/|^-\/\/Sun Microsystems Corp\.\/\/DTD HotJava HTML\/\/|^-\/\/Sun Microsystems Corp\.\/\/DTD HotJava Strict HTML\/\/|^-\/\/W3C\/\/DTD HTML 3 1995-03-24\/\/|^-\/\/W3C\/\/DTD HTML 3\.2 Draft\/\/|^-\/\/W3C\/\/DTD HTML 3\.2 Final\/\/|^-\/\/W3C\/\/DTD HTML 3\.2\/\/|^-\/\/W3C\/\/DTD HTML 3\.2S Draft\/\/|^-\/\/W3C\/\/DTD HTML 4\.0 Frameset\/\/|^-\/\/W3C\/\/DTD HTML 4\.0 Transitional\/\/|^-\/\/W3C\/\/DTD HTML Experimental 19960712\/\/|^-\/\/W3C\/\/DTD HTML Experimental 970421\/\/|^-\/\/W3C\/\/DTD W3 HTML\/\/|^-\/\/W3O\/\/DTD W3 HTML 3\.0\/\/|^-\/\/WebTechs\/\/DTD Mozilla HTML 2\.0\/\/|^-\/\/WebTechs\/\/DTD Mozilla HTML\/\//i, U0 = "http://www.ibm.com/data/dtd/v11/ibmxhtml1-transitional.dtd", Go = /^-\/\/W3C\/\/DTD HTML 4\.01 Frameset\/\/|^-\/\/W3C\/\/DTD HTML 4\.01 Transitional\/\//i, V0 = /^-\/\/W3C\/\/DTD XHTML 1\.0 Frameset\/\/|^-\/\/W3C\/\/DTD XHTML 1\.0 Transitional\/\//i, Pt = /* @__PURE__ */ Object.create(null);
  Pt[q.HTML] = { __proto__: null, address: true, applet: true, area: true, article: true, aside: true, base: true, basefont: true, bgsound: true, blockquote: true, body: true, br: true, button: true, caption: true, center: true, col: true, colgroup: true, dd: true, details: true, dir: true, div: true, dl: true, dt: true, embed: true, fieldset: true, figcaption: true, figure: true, footer: true, form: true, frame: true, frameset: true, h1: true, h2: true, h3: true, h4: true, h5: true, h6: true, head: true, header: true, hgroup: true, hr: true, html: true, iframe: true, img: true, input: true, li: true, link: true, listing: true, main: true, marquee: true, menu: true, meta: true, nav: true, noembed: true, noframes: true, noscript: true, object: true, ol: true, p: true, param: true, plaintext: true, pre: true, script: true, section: true, select: true, source: true, style: true, summary: true, table: true, tbody: true, td: true, template: true, textarea: true, tfoot: true, th: true, thead: true, title: true, tr: true, track: true, ul: true, wbr: true, xmp: true };
  Pt[q.SVG] = { __proto__: null, foreignObject: true, desc: true, title: true };
  Pt[q.MATHML] = { __proto__: null, mi: true, mo: true, mn: true, ms: true, mtext: true, "annotation-xml": true };
  var si = /* @__PURE__ */ Object.create(null);
  si[q.HTML] = { __proto__: null, address: true, div: true, p: true };
  var sc = /* @__PURE__ */ Object.create(null);
  sc[q.HTML] = { __proto__: null, dd: true, dt: true };
  var tr = /* @__PURE__ */ Object.create(null);
  tr[q.HTML] = { __proto__: null, table: true, thead: true, tbody: true, tfoot: true, tr: true };
  var oc = /* @__PURE__ */ Object.create(null);
  oc[q.HTML] = { __proto__: null, dd: true, dt: true, li: true, menuitem: true, optgroup: true, option: true, p: true, rb: true, rp: true, rt: true, rtc: true };
  var cc = /* @__PURE__ */ Object.create(null);
  cc[q.HTML] = { __proto__: null, caption: true, colgroup: true, dd: true, dt: true, li: true, optgroup: true, option: true, p: true, rb: true, rp: true, rt: true, rtc: true, tbody: true, td: true, tfoot: true, th: true, thead: true, tr: true };
  var Cn = /* @__PURE__ */ Object.create(null);
  Cn[q.HTML] = { __proto__: null, table: true, template: true, html: true };
  var Ln = /* @__PURE__ */ Object.create(null);
  Ln[q.HTML] = { __proto__: null, tbody: true, tfoot: true, thead: true, template: true, html: true };
  var oi = /* @__PURE__ */ Object.create(null);
  oi[q.HTML] = { __proto__: null, tr: true, template: true, html: true };
  var lc = /* @__PURE__ */ Object.create(null);
  lc[q.HTML] = { __proto__: null, button: true, fieldset: true, input: true, keygen: true, object: true, output: true, select: true, textarea: true, img: true };
  var nt = /* @__PURE__ */ Object.create(null);
  nt[q.HTML] = { __proto__: null, applet: true, caption: true, html: true, table: true, td: true, th: true, marquee: true, object: true, template: true };
  nt[q.MATHML] = { __proto__: null, mi: true, mo: true, mn: true, ms: true, mtext: true, "annotation-xml": true };
  nt[q.SVG] = { __proto__: null, foreignObject: true, desc: true, title: true };
  var An = Object.create(nt);
  An[q.HTML] = Object.create(nt[q.HTML]);
  An[q.HTML].ol = true;
  An[q.HTML].ul = true;
  var ci = Object.create(nt);
  ci[q.HTML] = Object.create(nt[q.HTML]);
  ci[q.HTML].button = true;
  var uc = /* @__PURE__ */ Object.create(null);
  uc[q.HTML] = { __proto__: null, html: true, table: true, template: true };
  var z0 = /* @__PURE__ */ Object.create(null);
  z0[q.HTML] = { __proto__: null, optgroup: true, option: true };
  var fc = /* @__PURE__ */ Object.create(null);
  fc[q.MATHML] = { __proto__: null, mi: true, mo: true, mn: true, ms: true, mtext: true };
  var dc = /* @__PURE__ */ Object.create(null);
  dc[q.SVG] = { __proto__: null, foreignObject: true, desc: true, title: true };
  var Wo = { __proto__: null, "xlink:actuate": q.XLINK, "xlink:arcrole": q.XLINK, "xlink:href": q.XLINK, "xlink:role": q.XLINK, "xlink:show": q.XLINK, "xlink:title": q.XLINK, "xlink:type": q.XLINK, "xml:base": q.XML, "xml:lang": q.XML, "xml:space": q.XML, xmlns: q.XMLNS, "xmlns:xlink": q.XMLNS }, Yo = { __proto__: null, attributename: "attributeName", attributetype: "attributeType", basefrequency: "baseFrequency", baseprofile: "baseProfile", calcmode: "calcMode", clippathunits: "clipPathUnits", diffuseconstant: "diffuseConstant", edgemode: "edgeMode", filterunits: "filterUnits", glyphref: "glyphRef", gradienttransform: "gradientTransform", gradientunits: "gradientUnits", kernelmatrix: "kernelMatrix", kernelunitlength: "kernelUnitLength", keypoints: "keyPoints", keysplines: "keySplines", keytimes: "keyTimes", lengthadjust: "lengthAdjust", limitingconeangle: "limitingConeAngle", markerheight: "markerHeight", markerunits: "markerUnits", markerwidth: "markerWidth", maskcontentunits: "maskContentUnits", maskunits: "maskUnits", numoctaves: "numOctaves", pathlength: "pathLength", patterncontentunits: "patternContentUnits", patterntransform: "patternTransform", patternunits: "patternUnits", pointsatx: "pointsAtX", pointsaty: "pointsAtY", pointsatz: "pointsAtZ", preservealpha: "preserveAlpha", preserveaspectratio: "preserveAspectRatio", primitiveunits: "primitiveUnits", refx: "refX", refy: "refY", repeatcount: "repeatCount", repeatdur: "repeatDur", requiredextensions: "requiredExtensions", requiredfeatures: "requiredFeatures", specularconstant: "specularConstant", specularexponent: "specularExponent", spreadmethod: "spreadMethod", startoffset: "startOffset", stddeviation: "stdDeviation", stitchtiles: "stitchTiles", surfacescale: "surfaceScale", systemlanguage: "systemLanguage", tablevalues: "tableValues", targetx: "targetX", targety: "targetY", textlength: "textLength", viewbox: "viewBox", viewtarget: "viewTarget", xchannelselector: "xChannelSelector", ychannelselector: "yChannelSelector", zoomandpan: "zoomAndPan" }, $o = { __proto__: null, altglyph: "altGlyph", altglyphdef: "altGlyphDef", altglyphitem: "altGlyphItem", animatecolor: "animateColor", animatemotion: "animateMotion", animatetransform: "animateTransform", clippath: "clipPath", feblend: "feBlend", fecolormatrix: "feColorMatrix", fecomponenttransfer: "feComponentTransfer", fecomposite: "feComposite", feconvolvematrix: "feConvolveMatrix", fediffuselighting: "feDiffuseLighting", fedisplacementmap: "feDisplacementMap", fedistantlight: "feDistantLight", feflood: "feFlood", fefunca: "feFuncA", fefuncb: "feFuncB", fefuncg: "feFuncG", fefuncr: "feFuncR", fegaussianblur: "feGaussianBlur", feimage: "feImage", femerge: "feMerge", femergenode: "feMergeNode", femorphology: "feMorphology", feoffset: "feOffset", fepointlight: "fePointLight", fespecularlighting: "feSpecularLighting", fespotlight: "feSpotLight", fetile: "feTile", feturbulence: "feTurbulence", foreignobject: "foreignObject", glyphref: "glyphRef", lineargradient: "linearGradient", radialgradient: "radialGradient", textpath: "textPath" }, Ko = { __proto__: null, 0: 65533, 128: 8364, 130: 8218, 131: 402, 132: 8222, 133: 8230, 134: 8224, 135: 8225, 136: 710, 137: 8240, 138: 352, 139: 8249, 140: 338, 142: 381, 145: 8216, 146: 8217, 147: 8220, 148: 8221, 149: 8226, 150: 8211, 151: 8212, 152: 732, 153: 8482, 154: 353, 155: 8250, 156: 339, 158: 382, 159: 376 }, j0 = { __proto__: null, AElig: 198, "AElig;": 198, AMP: 38, "AMP;": 38, Aacute: 193, "Aacute;": 193, "Abreve;": 258, Acirc: 194, "Acirc;": 194, "Acy;": 1040, "Afr;": [55349, 56580], Agrave: 192, "Agrave;": 192, "Alpha;": 913, "Amacr;": 256, "And;": 10835, "Aogon;": 260, "Aopf;": [55349, 56632], "ApplyFunction;": 8289, Aring: 197, "Aring;": 197, "Ascr;": [55349, 56476], "Assign;": 8788, Atilde: 195, "Atilde;": 195, Auml: 196, "Auml;": 196, "Backslash;": 8726, "Barv;": 10983, "Barwed;": 8966, "Bcy;": 1041, "Because;": 8757, "Bernoullis;": 8492, "Beta;": 914, "Bfr;": [55349, 56581], "Bopf;": [55349, 56633], "Breve;": 728, "Bscr;": 8492, "Bumpeq;": 8782, "CHcy;": 1063, COPY: 169, "COPY;": 169, "Cacute;": 262, "Cap;": 8914, "CapitalDifferentialD;": 8517, "Cayleys;": 8493, "Ccaron;": 268, Ccedil: 199, "Ccedil;": 199, "Ccirc;": 264, "Cconint;": 8752, "Cdot;": 266, "Cedilla;": 184, "CenterDot;": 183, "Cfr;": 8493, "Chi;": 935, "CircleDot;": 8857, "CircleMinus;": 8854, "CirclePlus;": 8853, "CircleTimes;": 8855, "ClockwiseContourIntegral;": 8754, "CloseCurlyDoubleQuote;": 8221, "CloseCurlyQuote;": 8217, "Colon;": 8759, "Colone;": 10868, "Congruent;": 8801, "Conint;": 8751, "ContourIntegral;": 8750, "Copf;": 8450, "Coproduct;": 8720, "CounterClockwiseContourIntegral;": 8755, "Cross;": 10799, "Cscr;": [55349, 56478], "Cup;": 8915, "CupCap;": 8781, "DD;": 8517, "DDotrahd;": 10513, "DJcy;": 1026, "DScy;": 1029, "DZcy;": 1039, "Dagger;": 8225, "Darr;": 8609, "Dashv;": 10980, "Dcaron;": 270, "Dcy;": 1044, "Del;": 8711, "Delta;": 916, "Dfr;": [55349, 56583], "DiacriticalAcute;": 180, "DiacriticalDot;": 729, "DiacriticalDoubleAcute;": 733, "DiacriticalGrave;": 96, "DiacriticalTilde;": 732, "Diamond;": 8900, "DifferentialD;": 8518, "Dopf;": [55349, 56635], "Dot;": 168, "DotDot;": 8412, "DotEqual;": 8784, "DoubleContourIntegral;": 8751, "DoubleDot;": 168, "DoubleDownArrow;": 8659, "DoubleLeftArrow;": 8656, "DoubleLeftRightArrow;": 8660, "DoubleLeftTee;": 10980, "DoubleLongLeftArrow;": 10232, "DoubleLongLeftRightArrow;": 10234, "DoubleLongRightArrow;": 10233, "DoubleRightArrow;": 8658, "DoubleRightTee;": 8872, "DoubleUpArrow;": 8657, "DoubleUpDownArrow;": 8661, "DoubleVerticalBar;": 8741, "DownArrow;": 8595, "DownArrowBar;": 10515, "DownArrowUpArrow;": 8693, "DownBreve;": 785, "DownLeftRightVector;": 10576, "DownLeftTeeVector;": 10590, "DownLeftVector;": 8637, "DownLeftVectorBar;": 10582, "DownRightTeeVector;": 10591, "DownRightVector;": 8641, "DownRightVectorBar;": 10583, "DownTee;": 8868, "DownTeeArrow;": 8615, "Downarrow;": 8659, "Dscr;": [55349, 56479], "Dstrok;": 272, "ENG;": 330, ETH: 208, "ETH;": 208, Eacute: 201, "Eacute;": 201, "Ecaron;": 282, Ecirc: 202, "Ecirc;": 202, "Ecy;": 1069, "Edot;": 278, "Efr;": [55349, 56584], Egrave: 200, "Egrave;": 200, "Element;": 8712, "Emacr;": 274, "EmptySmallSquare;": 9723, "EmptyVerySmallSquare;": 9643, "Eogon;": 280, "Eopf;": [55349, 56636], "Epsilon;": 917, "Equal;": 10869, "EqualTilde;": 8770, "Equilibrium;": 8652, "Escr;": 8496, "Esim;": 10867, "Eta;": 919, Euml: 203, "Euml;": 203, "Exists;": 8707, "ExponentialE;": 8519, "Fcy;": 1060, "Ffr;": [55349, 56585], "FilledSmallSquare;": 9724, "FilledVerySmallSquare;": 9642, "Fopf;": [55349, 56637], "ForAll;": 8704, "Fouriertrf;": 8497, "Fscr;": 8497, "GJcy;": 1027, GT: 62, "GT;": 62, "Gamma;": 915, "Gammad;": 988, "Gbreve;": 286, "Gcedil;": 290, "Gcirc;": 284, "Gcy;": 1043, "Gdot;": 288, "Gfr;": [55349, 56586], "Gg;": 8921, "Gopf;": [55349, 56638], "GreaterEqual;": 8805, "GreaterEqualLess;": 8923, "GreaterFullEqual;": 8807, "GreaterGreater;": 10914, "GreaterLess;": 8823, "GreaterSlantEqual;": 10878, "GreaterTilde;": 8819, "Gscr;": [55349, 56482], "Gt;": 8811, "HARDcy;": 1066, "Hacek;": 711, "Hat;": 94, "Hcirc;": 292, "Hfr;": 8460, "HilbertSpace;": 8459, "Hopf;": 8461, "HorizontalLine;": 9472, "Hscr;": 8459, "Hstrok;": 294, "HumpDownHump;": 8782, "HumpEqual;": 8783, "IEcy;": 1045, "IJlig;": 306, "IOcy;": 1025, Iacute: 205, "Iacute;": 205, Icirc: 206, "Icirc;": 206, "Icy;": 1048, "Idot;": 304, "Ifr;": 8465, Igrave: 204, "Igrave;": 204, "Im;": 8465, "Imacr;": 298, "ImaginaryI;": 8520, "Implies;": 8658, "Int;": 8748, "Integral;": 8747, "Intersection;": 8898, "InvisibleComma;": 8291, "InvisibleTimes;": 8290, "Iogon;": 302, "Iopf;": [55349, 56640], "Iota;": 921, "Iscr;": 8464, "Itilde;": 296, "Iukcy;": 1030, Iuml: 207, "Iuml;": 207, "Jcirc;": 308, "Jcy;": 1049, "Jfr;": [55349, 56589], "Jopf;": [55349, 56641], "Jscr;": [55349, 56485], "Jsercy;": 1032, "Jukcy;": 1028, "KHcy;": 1061, "KJcy;": 1036, "Kappa;": 922, "Kcedil;": 310, "Kcy;": 1050, "Kfr;": [55349, 56590], "Kopf;": [55349, 56642], "Kscr;": [55349, 56486], "LJcy;": 1033, LT: 60, "LT;": 60, "Lacute;": 313, "Lambda;": 923, "Lang;": 10218, "Laplacetrf;": 8466, "Larr;": 8606, "Lcaron;": 317, "Lcedil;": 315, "Lcy;": 1051, "LeftAngleBracket;": 10216, "LeftArrow;": 8592, "LeftArrowBar;": 8676, "LeftArrowRightArrow;": 8646, "LeftCeiling;": 8968, "LeftDoubleBracket;": 10214, "LeftDownTeeVector;": 10593, "LeftDownVector;": 8643, "LeftDownVectorBar;": 10585, "LeftFloor;": 8970, "LeftRightArrow;": 8596, "LeftRightVector;": 10574, "LeftTee;": 8867, "LeftTeeArrow;": 8612, "LeftTeeVector;": 10586, "LeftTriangle;": 8882, "LeftTriangleBar;": 10703, "LeftTriangleEqual;": 8884, "LeftUpDownVector;": 10577, "LeftUpTeeVector;": 10592, "LeftUpVector;": 8639, "LeftUpVectorBar;": 10584, "LeftVector;": 8636, "LeftVectorBar;": 10578, "Leftarrow;": 8656, "Leftrightarrow;": 8660, "LessEqualGreater;": 8922, "LessFullEqual;": 8806, "LessGreater;": 8822, "LessLess;": 10913, "LessSlantEqual;": 10877, "LessTilde;": 8818, "Lfr;": [55349, 56591], "Ll;": 8920, "Lleftarrow;": 8666, "Lmidot;": 319, "LongLeftArrow;": 10229, "LongLeftRightArrow;": 10231, "LongRightArrow;": 10230, "Longleftarrow;": 10232, "Longleftrightarrow;": 10234, "Longrightarrow;": 10233, "Lopf;": [55349, 56643], "LowerLeftArrow;": 8601, "LowerRightArrow;": 8600, "Lscr;": 8466, "Lsh;": 8624, "Lstrok;": 321, "Lt;": 8810, "Map;": 10501, "Mcy;": 1052, "MediumSpace;": 8287, "Mellintrf;": 8499, "Mfr;": [55349, 56592], "MinusPlus;": 8723, "Mopf;": [55349, 56644], "Mscr;": 8499, "Mu;": 924, "NJcy;": 1034, "Nacute;": 323, "Ncaron;": 327, "Ncedil;": 325, "Ncy;": 1053, "NegativeMediumSpace;": 8203, "NegativeThickSpace;": 8203, "NegativeThinSpace;": 8203, "NegativeVeryThinSpace;": 8203, "NestedGreaterGreater;": 8811, "NestedLessLess;": 8810, "NewLine;": 10, "Nfr;": [55349, 56593], "NoBreak;": 8288, "NonBreakingSpace;": 160, "Nopf;": 8469, "Not;": 10988, "NotCongruent;": 8802, "NotCupCap;": 8813, "NotDoubleVerticalBar;": 8742, "NotElement;": 8713, "NotEqual;": 8800, "NotEqualTilde;": [8770, 824], "NotExists;": 8708, "NotGreater;": 8815, "NotGreaterEqual;": 8817, "NotGreaterFullEqual;": [8807, 824], "NotGreaterGreater;": [8811, 824], "NotGreaterLess;": 8825, "NotGreaterSlantEqual;": [10878, 824], "NotGreaterTilde;": 8821, "NotHumpDownHump;": [8782, 824], "NotHumpEqual;": [8783, 824], "NotLeftTriangle;": 8938, "NotLeftTriangleBar;": [10703, 824], "NotLeftTriangleEqual;": 8940, "NotLess;": 8814, "NotLessEqual;": 8816, "NotLessGreater;": 8824, "NotLessLess;": [8810, 824], "NotLessSlantEqual;": [10877, 824], "NotLessTilde;": 8820, "NotNestedGreaterGreater;": [10914, 824], "NotNestedLessLess;": [10913, 824], "NotPrecedes;": 8832, "NotPrecedesEqual;": [10927, 824], "NotPrecedesSlantEqual;": 8928, "NotReverseElement;": 8716, "NotRightTriangle;": 8939, "NotRightTriangleBar;": [10704, 824], "NotRightTriangleEqual;": 8941, "NotSquareSubset;": [8847, 824], "NotSquareSubsetEqual;": 8930, "NotSquareSuperset;": [8848, 824], "NotSquareSupersetEqual;": 8931, "NotSubset;": [8834, 8402], "NotSubsetEqual;": 8840, "NotSucceeds;": 8833, "NotSucceedsEqual;": [10928, 824], "NotSucceedsSlantEqual;": 8929, "NotSucceedsTilde;": [8831, 824], "NotSuperset;": [8835, 8402], "NotSupersetEqual;": 8841, "NotTilde;": 8769, "NotTildeEqual;": 8772, "NotTildeFullEqual;": 8775, "NotTildeTilde;": 8777, "NotVerticalBar;": 8740, "Nscr;": [55349, 56489], Ntilde: 209, "Ntilde;": 209, "Nu;": 925, "OElig;": 338, Oacute: 211, "Oacute;": 211, Ocirc: 212, "Ocirc;": 212, "Ocy;": 1054, "Odblac;": 336, "Ofr;": [55349, 56594], Ograve: 210, "Ograve;": 210, "Omacr;": 332, "Omega;": 937, "Omicron;": 927, "Oopf;": [55349, 56646], "OpenCurlyDoubleQuote;": 8220, "OpenCurlyQuote;": 8216, "Or;": 10836, "Oscr;": [55349, 56490], Oslash: 216, "Oslash;": 216, Otilde: 213, "Otilde;": 213, "Otimes;": 10807, Ouml: 214, "Ouml;": 214, "OverBar;": 8254, "OverBrace;": 9182, "OverBracket;": 9140, "OverParenthesis;": 9180, "PartialD;": 8706, "Pcy;": 1055, "Pfr;": [55349, 56595], "Phi;": 934, "Pi;": 928, "PlusMinus;": 177, "Poincareplane;": 8460, "Popf;": 8473, "Pr;": 10939, "Precedes;": 8826, "PrecedesEqual;": 10927, "PrecedesSlantEqual;": 8828, "PrecedesTilde;": 8830, "Prime;": 8243, "Product;": 8719, "Proportion;": 8759, "Proportional;": 8733, "Pscr;": [55349, 56491], "Psi;": 936, QUOT: 34, "QUOT;": 34, "Qfr;": [55349, 56596], "Qopf;": 8474, "Qscr;": [55349, 56492], "RBarr;": 10512, REG: 174, "REG;": 174, "Racute;": 340, "Rang;": 10219, "Rarr;": 8608, "Rarrtl;": 10518, "Rcaron;": 344, "Rcedil;": 342, "Rcy;": 1056, "Re;": 8476, "ReverseElement;": 8715, "ReverseEquilibrium;": 8651, "ReverseUpEquilibrium;": 10607, "Rfr;": 8476, "Rho;": 929, "RightAngleBracket;": 10217, "RightArrow;": 8594, "RightArrowBar;": 8677, "RightArrowLeftArrow;": 8644, "RightCeiling;": 8969, "RightDoubleBracket;": 10215, "RightDownTeeVector;": 10589, "RightDownVector;": 8642, "RightDownVectorBar;": 10581, "RightFloor;": 8971, "RightTee;": 8866, "RightTeeArrow;": 8614, "RightTeeVector;": 10587, "RightTriangle;": 8883, "RightTriangleBar;": 10704, "RightTriangleEqual;": 8885, "RightUpDownVector;": 10575, "RightUpTeeVector;": 10588, "RightUpVector;": 8638, "RightUpVectorBar;": 10580, "RightVector;": 8640, "RightVectorBar;": 10579, "Rightarrow;": 8658, "Ropf;": 8477, "RoundImplies;": 10608, "Rrightarrow;": 8667, "Rscr;": 8475, "Rsh;": 8625, "RuleDelayed;": 10740, "SHCHcy;": 1065, "SHcy;": 1064, "SOFTcy;": 1068, "Sacute;": 346, "Sc;": 10940, "Scaron;": 352, "Scedil;": 350, "Scirc;": 348, "Scy;": 1057, "Sfr;": [55349, 56598], "ShortDownArrow;": 8595, "ShortLeftArrow;": 8592, "ShortRightArrow;": 8594, "ShortUpArrow;": 8593, "Sigma;": 931, "SmallCircle;": 8728, "Sopf;": [55349, 56650], "Sqrt;": 8730, "Square;": 9633, "SquareIntersection;": 8851, "SquareSubset;": 8847, "SquareSubsetEqual;": 8849, "SquareSuperset;": 8848, "SquareSupersetEqual;": 8850, "SquareUnion;": 8852, "Sscr;": [55349, 56494], "Star;": 8902, "Sub;": 8912, "Subset;": 8912, "SubsetEqual;": 8838, "Succeeds;": 8827, "SucceedsEqual;": 10928, "SucceedsSlantEqual;": 8829, "SucceedsTilde;": 8831, "SuchThat;": 8715, "Sum;": 8721, "Sup;": 8913, "Superset;": 8835, "SupersetEqual;": 8839, "Supset;": 8913, THORN: 222, "THORN;": 222, "TRADE;": 8482, "TSHcy;": 1035, "TScy;": 1062, "Tab;": 9, "Tau;": 932, "Tcaron;": 356, "Tcedil;": 354, "Tcy;": 1058, "Tfr;": [55349, 56599], "Therefore;": 8756, "Theta;": 920, "ThickSpace;": [8287, 8202], "ThinSpace;": 8201, "Tilde;": 8764, "TildeEqual;": 8771, "TildeFullEqual;": 8773, "TildeTilde;": 8776, "Topf;": [55349, 56651], "TripleDot;": 8411, "Tscr;": [55349, 56495], "Tstrok;": 358, Uacute: 218, "Uacute;": 218, "Uarr;": 8607, "Uarrocir;": 10569, "Ubrcy;": 1038, "Ubreve;": 364, Ucirc: 219, "Ucirc;": 219, "Ucy;": 1059, "Udblac;": 368, "Ufr;": [55349, 56600], Ugrave: 217, "Ugrave;": 217, "Umacr;": 362, "UnderBar;": 95, "UnderBrace;": 9183, "UnderBracket;": 9141, "UnderParenthesis;": 9181, "Union;": 8899, "UnionPlus;": 8846, "Uogon;": 370, "Uopf;": [55349, 56652], "UpArrow;": 8593, "UpArrowBar;": 10514, "UpArrowDownArrow;": 8645, "UpDownArrow;": 8597, "UpEquilibrium;": 10606, "UpTee;": 8869, "UpTeeArrow;": 8613, "Uparrow;": 8657, "Updownarrow;": 8661, "UpperLeftArrow;": 8598, "UpperRightArrow;": 8599, "Upsi;": 978, "Upsilon;": 933, "Uring;": 366, "Uscr;": [55349, 56496], "Utilde;": 360, Uuml: 220, "Uuml;": 220, "VDash;": 8875, "Vbar;": 10987, "Vcy;": 1042, "Vdash;": 8873, "Vdashl;": 10982, "Vee;": 8897, "Verbar;": 8214, "Vert;": 8214, "VerticalBar;": 8739, "VerticalLine;": 124, "VerticalSeparator;": 10072, "VerticalTilde;": 8768, "VeryThinSpace;": 8202, "Vfr;": [55349, 56601], "Vopf;": [55349, 56653], "Vscr;": [55349, 56497], "Vvdash;": 8874, "Wcirc;": 372, "Wedge;": 8896, "Wfr;": [55349, 56602], "Wopf;": [55349, 56654], "Wscr;": [55349, 56498], "Xfr;": [55349, 56603], "Xi;": 926, "Xopf;": [55349, 56655], "Xscr;": [55349, 56499], "YAcy;": 1071, "YIcy;": 1031, "YUcy;": 1070, Yacute: 221, "Yacute;": 221, "Ycirc;": 374, "Ycy;": 1067, "Yfr;": [55349, 56604], "Yopf;": [55349, 56656], "Yscr;": [55349, 56500], "Yuml;": 376, "ZHcy;": 1046, "Zacute;": 377, "Zcaron;": 381, "Zcy;": 1047, "Zdot;": 379, "ZeroWidthSpace;": 8203, "Zeta;": 918, "Zfr;": 8488, "Zopf;": 8484, "Zscr;": [55349, 56501], aacute: 225, "aacute;": 225, "abreve;": 259, "ac;": 8766, "acE;": [8766, 819], "acd;": 8767, acirc: 226, "acirc;": 226, acute: 180, "acute;": 180, "acy;": 1072, aelig: 230, "aelig;": 230, "af;": 8289, "afr;": [55349, 56606], agrave: 224, "agrave;": 224, "alefsym;": 8501, "aleph;": 8501, "alpha;": 945, "amacr;": 257, "amalg;": 10815, amp: 38, "amp;": 38, "and;": 8743, "andand;": 10837, "andd;": 10844, "andslope;": 10840, "andv;": 10842, "ang;": 8736, "ange;": 10660, "angle;": 8736, "angmsd;": 8737, "angmsdaa;": 10664, "angmsdab;": 10665, "angmsdac;": 10666, "angmsdad;": 10667, "angmsdae;": 10668, "angmsdaf;": 10669, "angmsdag;": 10670, "angmsdah;": 10671, "angrt;": 8735, "angrtvb;": 8894, "angrtvbd;": 10653, "angsph;": 8738, "angst;": 197, "angzarr;": 9084, "aogon;": 261, "aopf;": [55349, 56658], "ap;": 8776, "apE;": 10864, "apacir;": 10863, "ape;": 8778, "apid;": 8779, "apos;": 39, "approx;": 8776, "approxeq;": 8778, aring: 229, "aring;": 229, "ascr;": [55349, 56502], "ast;": 42, "asymp;": 8776, "asympeq;": 8781, atilde: 227, "atilde;": 227, auml: 228, "auml;": 228, "awconint;": 8755, "awint;": 10769, "bNot;": 10989, "backcong;": 8780, "backepsilon;": 1014, "backprime;": 8245, "backsim;": 8765, "backsimeq;": 8909, "barvee;": 8893, "barwed;": 8965, "barwedge;": 8965, "bbrk;": 9141, "bbrktbrk;": 9142, "bcong;": 8780, "bcy;": 1073, "bdquo;": 8222, "becaus;": 8757, "because;": 8757, "bemptyv;": 10672, "bepsi;": 1014, "bernou;": 8492, "beta;": 946, "beth;": 8502, "between;": 8812, "bfr;": [55349, 56607], "bigcap;": 8898, "bigcirc;": 9711, "bigcup;": 8899, "bigodot;": 10752, "bigoplus;": 10753, "bigotimes;": 10754, "bigsqcup;": 10758, "bigstar;": 9733, "bigtriangledown;": 9661, "bigtriangleup;": 9651, "biguplus;": 10756, "bigvee;": 8897, "bigwedge;": 8896, "bkarow;": 10509, "blacklozenge;": 10731, "blacksquare;": 9642, "blacktriangle;": 9652, "blacktriangledown;": 9662, "blacktriangleleft;": 9666, "blacktriangleright;": 9656, "blank;": 9251, "blk12;": 9618, "blk14;": 9617, "blk34;": 9619, "block;": 9608, "bne;": [61, 8421], "bnequiv;": [8801, 8421], "bnot;": 8976, "bopf;": [55349, 56659], "bot;": 8869, "bottom;": 8869, "bowtie;": 8904, "boxDL;": 9559, "boxDR;": 9556, "boxDl;": 9558, "boxDr;": 9555, "boxH;": 9552, "boxHD;": 9574, "boxHU;": 9577, "boxHd;": 9572, "boxHu;": 9575, "boxUL;": 9565, "boxUR;": 9562, "boxUl;": 9564, "boxUr;": 9561, "boxV;": 9553, "boxVH;": 9580, "boxVL;": 9571, "boxVR;": 9568, "boxVh;": 9579, "boxVl;": 9570, "boxVr;": 9567, "boxbox;": 10697, "boxdL;": 9557, "boxdR;": 9554, "boxdl;": 9488, "boxdr;": 9484, "boxh;": 9472, "boxhD;": 9573, "boxhU;": 9576, "boxhd;": 9516, "boxhu;": 9524, "boxminus;": 8863, "boxplus;": 8862, "boxtimes;": 8864, "boxuL;": 9563, "boxuR;": 9560, "boxul;": 9496, "boxur;": 9492, "boxv;": 9474, "boxvH;": 9578, "boxvL;": 9569, "boxvR;": 9566, "boxvh;": 9532, "boxvl;": 9508, "boxvr;": 9500, "bprime;": 8245, "breve;": 728, brvbar: 166, "brvbar;": 166, "bscr;": [55349, 56503], "bsemi;": 8271, "bsim;": 8765, "bsime;": 8909, "bsol;": 92, "bsolb;": 10693, "bsolhsub;": 10184, "bull;": 8226, "bullet;": 8226, "bump;": 8782, "bumpE;": 10926, "bumpe;": 8783, "bumpeq;": 8783, "cacute;": 263, "cap;": 8745, "capand;": 10820, "capbrcup;": 10825, "capcap;": 10827, "capcup;": 10823, "capdot;": 10816, "caps;": [8745, 65024], "caret;": 8257, "caron;": 711, "ccaps;": 10829, "ccaron;": 269, ccedil: 231, "ccedil;": 231, "ccirc;": 265, "ccups;": 10828, "ccupssm;": 10832, "cdot;": 267, cedil: 184, "cedil;": 184, "cemptyv;": 10674, cent: 162, "cent;": 162, "centerdot;": 183, "cfr;": [55349, 56608], "chcy;": 1095, "check;": 10003, "checkmark;": 10003, "chi;": 967, "cir;": 9675, "cirE;": 10691, "circ;": 710, "circeq;": 8791, "circlearrowleft;": 8634, "circlearrowright;": 8635, "circledR;": 174, "circledS;": 9416, "circledast;": 8859, "circledcirc;": 8858, "circleddash;": 8861, "cire;": 8791, "cirfnint;": 10768, "cirmid;": 10991, "cirscir;": 10690, "clubs;": 9827, "clubsuit;": 9827, "colon;": 58, "colone;": 8788, "coloneq;": 8788, "comma;": 44, "commat;": 64, "comp;": 8705, "compfn;": 8728, "complement;": 8705, "complexes;": 8450, "cong;": 8773, "congdot;": 10861, "conint;": 8750, "copf;": [55349, 56660], "coprod;": 8720, copy: 169, "copy;": 169, "copysr;": 8471, "crarr;": 8629, "cross;": 10007, "cscr;": [55349, 56504], "csub;": 10959, "csube;": 10961, "csup;": 10960, "csupe;": 10962, "ctdot;": 8943, "cudarrl;": 10552, "cudarrr;": 10549, "cuepr;": 8926, "cuesc;": 8927, "cularr;": 8630, "cularrp;": 10557, "cup;": 8746, "cupbrcap;": 10824, "cupcap;": 10822, "cupcup;": 10826, "cupdot;": 8845, "cupor;": 10821, "cups;": [8746, 65024], "curarr;": 8631, "curarrm;": 10556, "curlyeqprec;": 8926, "curlyeqsucc;": 8927, "curlyvee;": 8910, "curlywedge;": 8911, curren: 164, "curren;": 164, "curvearrowleft;": 8630, "curvearrowright;": 8631, "cuvee;": 8910, "cuwed;": 8911, "cwconint;": 8754, "cwint;": 8753, "cylcty;": 9005, "dArr;": 8659, "dHar;": 10597, "dagger;": 8224, "daleth;": 8504, "darr;": 8595, "dash;": 8208, "dashv;": 8867, "dbkarow;": 10511, "dblac;": 733, "dcaron;": 271, "dcy;": 1076, "dd;": 8518, "ddagger;": 8225, "ddarr;": 8650, "ddotseq;": 10871, deg: 176, "deg;": 176, "delta;": 948, "demptyv;": 10673, "dfisht;": 10623, "dfr;": [55349, 56609], "dharl;": 8643, "dharr;": 8642, "diam;": 8900, "diamond;": 8900, "diamondsuit;": 9830, "diams;": 9830, "die;": 168, "digamma;": 989, "disin;": 8946, "div;": 247, divide: 247, "divide;": 247, "divideontimes;": 8903, "divonx;": 8903, "djcy;": 1106, "dlcorn;": 8990, "dlcrop;": 8973, "dollar;": 36, "dopf;": [55349, 56661], "dot;": 729, "doteq;": 8784, "doteqdot;": 8785, "dotminus;": 8760, "dotplus;": 8724, "dotsquare;": 8865, "doublebarwedge;": 8966, "downarrow;": 8595, "downdownarrows;": 8650, "downharpoonleft;": 8643, "downharpoonright;": 8642, "drbkarow;": 10512, "drcorn;": 8991, "drcrop;": 8972, "dscr;": [55349, 56505], "dscy;": 1109, "dsol;": 10742, "dstrok;": 273, "dtdot;": 8945, "dtri;": 9663, "dtrif;": 9662, "duarr;": 8693, "duhar;": 10607, "dwangle;": 10662, "dzcy;": 1119, "dzigrarr;": 10239, "eDDot;": 10871, "eDot;": 8785, eacute: 233, "eacute;": 233, "easter;": 10862, "ecaron;": 283, "ecir;": 8790, ecirc: 234, "ecirc;": 234, "ecolon;": 8789, "ecy;": 1101, "edot;": 279, "ee;": 8519, "efDot;": 8786, "efr;": [55349, 56610], "eg;": 10906, egrave: 232, "egrave;": 232, "egs;": 10902, "egsdot;": 10904, "el;": 10905, "elinters;": 9191, "ell;": 8467, "els;": 10901, "elsdot;": 10903, "emacr;": 275, "empty;": 8709, "emptyset;": 8709, "emptyv;": 8709, "emsp13;": 8196, "emsp14;": 8197, "emsp;": 8195, "eng;": 331, "ensp;": 8194, "eogon;": 281, "eopf;": [55349, 56662], "epar;": 8917, "eparsl;": 10723, "eplus;": 10865, "epsi;": 949, "epsilon;": 949, "epsiv;": 1013, "eqcirc;": 8790, "eqcolon;": 8789, "eqsim;": 8770, "eqslantgtr;": 10902, "eqslantless;": 10901, "equals;": 61, "equest;": 8799, "equiv;": 8801, "equivDD;": 10872, "eqvparsl;": 10725, "erDot;": 8787, "erarr;": 10609, "escr;": 8495, "esdot;": 8784, "esim;": 8770, "eta;": 951, eth: 240, "eth;": 240, euml: 235, "euml;": 235, "euro;": 8364, "excl;": 33, "exist;": 8707, "expectation;": 8496, "exponentiale;": 8519, "fallingdotseq;": 8786, "fcy;": 1092, "female;": 9792, "ffilig;": 64259, "fflig;": 64256, "ffllig;": 64260, "ffr;": [55349, 56611], "filig;": 64257, "fjlig;": [102, 106], "flat;": 9837, "fllig;": 64258, "fltns;": 9649, "fnof;": 402, "fopf;": [55349, 56663], "forall;": 8704, "fork;": 8916, "forkv;": 10969, "fpartint;": 10765, frac12: 189, "frac12;": 189, "frac13;": 8531, frac14: 188, "frac14;": 188, "frac15;": 8533, "frac16;": 8537, "frac18;": 8539, "frac23;": 8532, "frac25;": 8534, frac34: 190, "frac34;": 190, "frac35;": 8535, "frac38;": 8540, "frac45;": 8536, "frac56;": 8538, "frac58;": 8541, "frac78;": 8542, "frasl;": 8260, "frown;": 8994, "fscr;": [55349, 56507], "gE;": 8807, "gEl;": 10892, "gacute;": 501, "gamma;": 947, "gammad;": 989, "gap;": 10886, "gbreve;": 287, "gcirc;": 285, "gcy;": 1075, "gdot;": 289, "ge;": 8805, "gel;": 8923, "geq;": 8805, "geqq;": 8807, "geqslant;": 10878, "ges;": 10878, "gescc;": 10921, "gesdot;": 10880, "gesdoto;": 10882, "gesdotol;": 10884, "gesl;": [8923, 65024], "gesles;": 10900, "gfr;": [55349, 56612], "gg;": 8811, "ggg;": 8921, "gimel;": 8503, "gjcy;": 1107, "gl;": 8823, "glE;": 10898, "gla;": 10917, "glj;": 10916, "gnE;": 8809, "gnap;": 10890, "gnapprox;": 10890, "gne;": 10888, "gneq;": 10888, "gneqq;": 8809, "gnsim;": 8935, "gopf;": [55349, 56664], "grave;": 96, "gscr;": 8458, "gsim;": 8819, "gsime;": 10894, "gsiml;": 10896, gt: 62, "gt;": 62, "gtcc;": 10919, "gtcir;": 10874, "gtdot;": 8919, "gtlPar;": 10645, "gtquest;": 10876, "gtrapprox;": 10886, "gtrarr;": 10616, "gtrdot;": 8919, "gtreqless;": 8923, "gtreqqless;": 10892, "gtrless;": 8823, "gtrsim;": 8819, "gvertneqq;": [8809, 65024], "gvnE;": [8809, 65024], "hArr;": 8660, "hairsp;": 8202, "half;": 189, "hamilt;": 8459, "hardcy;": 1098, "harr;": 8596, "harrcir;": 10568, "harrw;": 8621, "hbar;": 8463, "hcirc;": 293, "hearts;": 9829, "heartsuit;": 9829, "hellip;": 8230, "hercon;": 8889, "hfr;": [55349, 56613], "hksearow;": 10533, "hkswarow;": 10534, "hoarr;": 8703, "homtht;": 8763, "hookleftarrow;": 8617, "hookrightarrow;": 8618, "hopf;": [55349, 56665], "horbar;": 8213, "hscr;": [55349, 56509], "hslash;": 8463, "hstrok;": 295, "hybull;": 8259, "hyphen;": 8208, iacute: 237, "iacute;": 237, "ic;": 8291, icirc: 238, "icirc;": 238, "icy;": 1080, "iecy;": 1077, iexcl: 161, "iexcl;": 161, "iff;": 8660, "ifr;": [55349, 56614], igrave: 236, "igrave;": 236, "ii;": 8520, "iiiint;": 10764, "iiint;": 8749, "iinfin;": 10716, "iiota;": 8489, "ijlig;": 307, "imacr;": 299, "image;": 8465, "imagline;": 8464, "imagpart;": 8465, "imath;": 305, "imof;": 8887, "imped;": 437, "in;": 8712, "incare;": 8453, "infin;": 8734, "infintie;": 10717, "inodot;": 305, "int;": 8747, "intcal;": 8890, "integers;": 8484, "intercal;": 8890, "intlarhk;": 10775, "intprod;": 10812, "iocy;": 1105, "iogon;": 303, "iopf;": [55349, 56666], "iota;": 953, "iprod;": 10812, iquest: 191, "iquest;": 191, "iscr;": [55349, 56510], "isin;": 8712, "isinE;": 8953, "isindot;": 8949, "isins;": 8948, "isinsv;": 8947, "isinv;": 8712, "it;": 8290, "itilde;": 297, "iukcy;": 1110, iuml: 239, "iuml;": 239, "jcirc;": 309, "jcy;": 1081, "jfr;": [55349, 56615], "jmath;": 567, "jopf;": [55349, 56667], "jscr;": [55349, 56511], "jsercy;": 1112, "jukcy;": 1108, "kappa;": 954, "kappav;": 1008, "kcedil;": 311, "kcy;": 1082, "kfr;": [55349, 56616], "kgreen;": 312, "khcy;": 1093, "kjcy;": 1116, "kopf;": [55349, 56668], "kscr;": [55349, 56512], "lAarr;": 8666, "lArr;": 8656, "lAtail;": 10523, "lBarr;": 10510, "lE;": 8806, "lEg;": 10891, "lHar;": 10594, "lacute;": 314, "laemptyv;": 10676, "lagran;": 8466, "lambda;": 955, "lang;": 10216, "langd;": 10641, "langle;": 10216, "lap;": 10885, laquo: 171, "laquo;": 171, "larr;": 8592, "larrb;": 8676, "larrbfs;": 10527, "larrfs;": 10525, "larrhk;": 8617, "larrlp;": 8619, "larrpl;": 10553, "larrsim;": 10611, "larrtl;": 8610, "lat;": 10923, "latail;": 10521, "late;": 10925, "lates;": [10925, 65024], "lbarr;": 10508, "lbbrk;": 10098, "lbrace;": 123, "lbrack;": 91, "lbrke;": 10635, "lbrksld;": 10639, "lbrkslu;": 10637, "lcaron;": 318, "lcedil;": 316, "lceil;": 8968, "lcub;": 123, "lcy;": 1083, "ldca;": 10550, "ldquo;": 8220, "ldquor;": 8222, "ldrdhar;": 10599, "ldrushar;": 10571, "ldsh;": 8626, "le;": 8804, "leftarrow;": 8592, "leftarrowtail;": 8610, "leftharpoondown;": 8637, "leftharpoonup;": 8636, "leftleftarrows;": 8647, "leftrightarrow;": 8596, "leftrightarrows;": 8646, "leftrightharpoons;": 8651, "leftrightsquigarrow;": 8621, "leftthreetimes;": 8907, "leg;": 8922, "leq;": 8804, "leqq;": 8806, "leqslant;": 10877, "les;": 10877, "lescc;": 10920, "lesdot;": 10879, "lesdoto;": 10881, "lesdotor;": 10883, "lesg;": [8922, 65024], "lesges;": 10899, "lessapprox;": 10885, "lessdot;": 8918, "lesseqgtr;": 8922, "lesseqqgtr;": 10891, "lessgtr;": 8822, "lesssim;": 8818, "lfisht;": 10620, "lfloor;": 8970, "lfr;": [55349, 56617], "lg;": 8822, "lgE;": 10897, "lhard;": 8637, "lharu;": 8636, "lharul;": 10602, "lhblk;": 9604, "ljcy;": 1113, "ll;": 8810, "llarr;": 8647, "llcorner;": 8990, "llhard;": 10603, "lltri;": 9722, "lmidot;": 320, "lmoust;": 9136, "lmoustache;": 9136, "lnE;": 8808, "lnap;": 10889, "lnapprox;": 10889, "lne;": 10887, "lneq;": 10887, "lneqq;": 8808, "lnsim;": 8934, "loang;": 10220, "loarr;": 8701, "lobrk;": 10214, "longleftarrow;": 10229, "longleftrightarrow;": 10231, "longmapsto;": 10236, "longrightarrow;": 10230, "looparrowleft;": 8619, "looparrowright;": 8620, "lopar;": 10629, "lopf;": [55349, 56669], "loplus;": 10797, "lotimes;": 10804, "lowast;": 8727, "lowbar;": 95, "loz;": 9674, "lozenge;": 9674, "lozf;": 10731, "lpar;": 40, "lparlt;": 10643, "lrarr;": 8646, "lrcorner;": 8991, "lrhar;": 8651, "lrhard;": 10605, "lrm;": 8206, "lrtri;": 8895, "lsaquo;": 8249, "lscr;": [55349, 56513], "lsh;": 8624, "lsim;": 8818, "lsime;": 10893, "lsimg;": 10895, "lsqb;": 91, "lsquo;": 8216, "lsquor;": 8218, "lstrok;": 322, lt: 60, "lt;": 60, "ltcc;": 10918, "ltcir;": 10873, "ltdot;": 8918, "lthree;": 8907, "ltimes;": 8905, "ltlarr;": 10614, "ltquest;": 10875, "ltrPar;": 10646, "ltri;": 9667, "ltrie;": 8884, "ltrif;": 9666, "lurdshar;": 10570, "luruhar;": 10598, "lvertneqq;": [8808, 65024], "lvnE;": [8808, 65024], "mDDot;": 8762, macr: 175, "macr;": 175, "male;": 9794, "malt;": 10016, "maltese;": 10016, "map;": 8614, "mapsto;": 8614, "mapstodown;": 8615, "mapstoleft;": 8612, "mapstoup;": 8613, "marker;": 9646, "mcomma;": 10793, "mcy;": 1084, "mdash;": 8212, "measuredangle;": 8737, "mfr;": [55349, 56618], "mho;": 8487, micro: 181, "micro;": 181, "mid;": 8739, "midast;": 42, "midcir;": 10992, middot: 183, "middot;": 183, "minus;": 8722, "minusb;": 8863, "minusd;": 8760, "minusdu;": 10794, "mlcp;": 10971, "mldr;": 8230, "mnplus;": 8723, "models;": 8871, "mopf;": [55349, 56670], "mp;": 8723, "mscr;": [55349, 56514], "mstpos;": 8766, "mu;": 956, "multimap;": 8888, "mumap;": 8888, "nGg;": [8921, 824], "nGt;": [8811, 8402], "nGtv;": [8811, 824], "nLeftarrow;": 8653, "nLeftrightarrow;": 8654, "nLl;": [8920, 824], "nLt;": [8810, 8402], "nLtv;": [8810, 824], "nRightarrow;": 8655, "nVDash;": 8879, "nVdash;": 8878, "nabla;": 8711, "nacute;": 324, "nang;": [8736, 8402], "nap;": 8777, "napE;": [10864, 824], "napid;": [8779, 824], "napos;": 329, "napprox;": 8777, "natur;": 9838, "natural;": 9838, "naturals;": 8469, nbsp: 160, "nbsp;": 160, "nbump;": [8782, 824], "nbumpe;": [8783, 824], "ncap;": 10819, "ncaron;": 328, "ncedil;": 326, "ncong;": 8775, "ncongdot;": [10861, 824], "ncup;": 10818, "ncy;": 1085, "ndash;": 8211, "ne;": 8800, "neArr;": 8663, "nearhk;": 10532, "nearr;": 8599, "nearrow;": 8599, "nedot;": [8784, 824], "nequiv;": 8802, "nesear;": 10536, "nesim;": [8770, 824], "nexist;": 8708, "nexists;": 8708, "nfr;": [55349, 56619], "ngE;": [8807, 824], "nge;": 8817, "ngeq;": 8817, "ngeqq;": [8807, 824], "ngeqslant;": [10878, 824], "nges;": [10878, 824], "ngsim;": 8821, "ngt;": 8815, "ngtr;": 8815, "nhArr;": 8654, "nharr;": 8622, "nhpar;": 10994, "ni;": 8715, "nis;": 8956, "nisd;": 8954, "niv;": 8715, "njcy;": 1114, "nlArr;": 8653, "nlE;": [8806, 824], "nlarr;": 8602, "nldr;": 8229, "nle;": 8816, "nleftarrow;": 8602, "nleftrightarrow;": 8622, "nleq;": 8816, "nleqq;": [8806, 824], "nleqslant;": [10877, 824], "nles;": [10877, 824], "nless;": 8814, "nlsim;": 8820, "nlt;": 8814, "nltri;": 8938, "nltrie;": 8940, "nmid;": 8740, "nopf;": [55349, 56671], not: 172, "not;": 172, "notin;": 8713, "notinE;": [8953, 824], "notindot;": [8949, 824], "notinva;": 8713, "notinvb;": 8951, "notinvc;": 8950, "notni;": 8716, "notniva;": 8716, "notnivb;": 8958, "notnivc;": 8957, "npar;": 8742, "nparallel;": 8742, "nparsl;": [11005, 8421], "npart;": [8706, 824], "npolint;": 10772, "npr;": 8832, "nprcue;": 8928, "npre;": [10927, 824], "nprec;": 8832, "npreceq;": [10927, 824], "nrArr;": 8655, "nrarr;": 8603, "nrarrc;": [10547, 824], "nrarrw;": [8605, 824], "nrightarrow;": 8603, "nrtri;": 8939, "nrtrie;": 8941, "nsc;": 8833, "nsccue;": 8929, "nsce;": [10928, 824], "nscr;": [55349, 56515], "nshortmid;": 8740, "nshortparallel;": 8742, "nsim;": 8769, "nsime;": 8772, "nsimeq;": 8772, "nsmid;": 8740, "nspar;": 8742, "nsqsube;": 8930, "nsqsupe;": 8931, "nsub;": 8836, "nsubE;": [10949, 824], "nsube;": 8840, "nsubset;": [8834, 8402], "nsubseteq;": 8840, "nsubseteqq;": [10949, 824], "nsucc;": 8833, "nsucceq;": [10928, 824], "nsup;": 8837, "nsupE;": [10950, 824], "nsupe;": 8841, "nsupset;": [8835, 8402], "nsupseteq;": 8841, "nsupseteqq;": [10950, 824], "ntgl;": 8825, ntilde: 241, "ntilde;": 241, "ntlg;": 8824, "ntriangleleft;": 8938, "ntrianglelefteq;": 8940, "ntriangleright;": 8939, "ntrianglerighteq;": 8941, "nu;": 957, "num;": 35, "numero;": 8470, "numsp;": 8199, "nvDash;": 8877, "nvHarr;": 10500, "nvap;": [8781, 8402], "nvdash;": 8876, "nvge;": [8805, 8402], "nvgt;": [62, 8402], "nvinfin;": 10718, "nvlArr;": 10498, "nvle;": [8804, 8402], "nvlt;": [60, 8402], "nvltrie;": [8884, 8402], "nvrArr;": 10499, "nvrtrie;": [8885, 8402], "nvsim;": [8764, 8402], "nwArr;": 8662, "nwarhk;": 10531, "nwarr;": 8598, "nwarrow;": 8598, "nwnear;": 10535, "oS;": 9416, oacute: 243, "oacute;": 243, "oast;": 8859, "ocir;": 8858, ocirc: 244, "ocirc;": 244, "ocy;": 1086, "odash;": 8861, "odblac;": 337, "odiv;": 10808, "odot;": 8857, "odsold;": 10684, "oelig;": 339, "ofcir;": 10687, "ofr;": [55349, 56620], "ogon;": 731, ograve: 242, "ograve;": 242, "ogt;": 10689, "ohbar;": 10677, "ohm;": 937, "oint;": 8750, "olarr;": 8634, "olcir;": 10686, "olcross;": 10683, "oline;": 8254, "olt;": 10688, "omacr;": 333, "omega;": 969, "omicron;": 959, "omid;": 10678, "ominus;": 8854, "oopf;": [55349, 56672], "opar;": 10679, "operp;": 10681, "oplus;": 8853, "or;": 8744, "orarr;": 8635, "ord;": 10845, "order;": 8500, "orderof;": 8500, ordf: 170, "ordf;": 170, ordm: 186, "ordm;": 186, "origof;": 8886, "oror;": 10838, "orslope;": 10839, "orv;": 10843, "oscr;": 8500, oslash: 248, "oslash;": 248, "osol;": 8856, otilde: 245, "otilde;": 245, "otimes;": 8855, "otimesas;": 10806, ouml: 246, "ouml;": 246, "ovbar;": 9021, "par;": 8741, para: 182, "para;": 182, "parallel;": 8741, "parsim;": 10995, "parsl;": 11005, "part;": 8706, "pcy;": 1087, "percnt;": 37, "period;": 46, "permil;": 8240, "perp;": 8869, "pertenk;": 8241, "pfr;": [55349, 56621], "phi;": 966, "phiv;": 981, "phmmat;": 8499, "phone;": 9742, "pi;": 960, "pitchfork;": 8916, "piv;": 982, "planck;": 8463, "planckh;": 8462, "plankv;": 8463, "plus;": 43, "plusacir;": 10787, "plusb;": 8862, "pluscir;": 10786, "plusdo;": 8724, "plusdu;": 10789, "pluse;": 10866, plusmn: 177, "plusmn;": 177, "plussim;": 10790, "plustwo;": 10791, "pm;": 177, "pointint;": 10773, "popf;": [55349, 56673], pound: 163, "pound;": 163, "pr;": 8826, "prE;": 10931, "prap;": 10935, "prcue;": 8828, "pre;": 10927, "prec;": 8826, "precapprox;": 10935, "preccurlyeq;": 8828, "preceq;": 10927, "precnapprox;": 10937, "precneqq;": 10933, "precnsim;": 8936, "precsim;": 8830, "prime;": 8242, "primes;": 8473, "prnE;": 10933, "prnap;": 10937, "prnsim;": 8936, "prod;": 8719, "profalar;": 9006, "profline;": 8978, "profsurf;": 8979, "prop;": 8733, "propto;": 8733, "prsim;": 8830, "prurel;": 8880, "pscr;": [55349, 56517], "psi;": 968, "puncsp;": 8200, "qfr;": [55349, 56622], "qint;": 10764, "qopf;": [55349, 56674], "qprime;": 8279, "qscr;": [55349, 56518], "quaternions;": 8461, "quatint;": 10774, "quest;": 63, "questeq;": 8799, quot: 34, "quot;": 34, "rAarr;": 8667, "rArr;": 8658, "rAtail;": 10524, "rBarr;": 10511, "rHar;": 10596, "race;": [8765, 817], "racute;": 341, "radic;": 8730, "raemptyv;": 10675, "rang;": 10217, "rangd;": 10642, "range;": 10661, "rangle;": 10217, raquo: 187, "raquo;": 187, "rarr;": 8594, "rarrap;": 10613, "rarrb;": 8677, "rarrbfs;": 10528, "rarrc;": 10547, "rarrfs;": 10526, "rarrhk;": 8618, "rarrlp;": 8620, "rarrpl;": 10565, "rarrsim;": 10612, "rarrtl;": 8611, "rarrw;": 8605, "ratail;": 10522, "ratio;": 8758, "rationals;": 8474, "rbarr;": 10509, "rbbrk;": 10099, "rbrace;": 125, "rbrack;": 93, "rbrke;": 10636, "rbrksld;": 10638, "rbrkslu;": 10640, "rcaron;": 345, "rcedil;": 343, "rceil;": 8969, "rcub;": 125, "rcy;": 1088, "rdca;": 10551, "rdldhar;": 10601, "rdquo;": 8221, "rdquor;": 8221, "rdsh;": 8627, "real;": 8476, "realine;": 8475, "realpart;": 8476, "reals;": 8477, "rect;": 9645, reg: 174, "reg;": 174, "rfisht;": 10621, "rfloor;": 8971, "rfr;": [55349, 56623], "rhard;": 8641, "rharu;": 8640, "rharul;": 10604, "rho;": 961, "rhov;": 1009, "rightarrow;": 8594, "rightarrowtail;": 8611, "rightharpoondown;": 8641, "rightharpoonup;": 8640, "rightleftarrows;": 8644, "rightleftharpoons;": 8652, "rightrightarrows;": 8649, "rightsquigarrow;": 8605, "rightthreetimes;": 8908, "ring;": 730, "risingdotseq;": 8787, "rlarr;": 8644, "rlhar;": 8652, "rlm;": 8207, "rmoust;": 9137, "rmoustache;": 9137, "rnmid;": 10990, "roang;": 10221, "roarr;": 8702, "robrk;": 10215, "ropar;": 10630, "ropf;": [55349, 56675], "roplus;": 10798, "rotimes;": 10805, "rpar;": 41, "rpargt;": 10644, "rppolint;": 10770, "rrarr;": 8649, "rsaquo;": 8250, "rscr;": [55349, 56519], "rsh;": 8625, "rsqb;": 93, "rsquo;": 8217, "rsquor;": 8217, "rthree;": 8908, "rtimes;": 8906, "rtri;": 9657, "rtrie;": 8885, "rtrif;": 9656, "rtriltri;": 10702, "ruluhar;": 10600, "rx;": 8478, "sacute;": 347, "sbquo;": 8218, "sc;": 8827, "scE;": 10932, "scap;": 10936, "scaron;": 353, "sccue;": 8829, "sce;": 10928, "scedil;": 351, "scirc;": 349, "scnE;": 10934, "scnap;": 10938, "scnsim;": 8937, "scpolint;": 10771, "scsim;": 8831, "scy;": 1089, "sdot;": 8901, "sdotb;": 8865, "sdote;": 10854, "seArr;": 8664, "searhk;": 10533, "searr;": 8600, "searrow;": 8600, sect: 167, "sect;": 167, "semi;": 59, "seswar;": 10537, "setminus;": 8726, "setmn;": 8726, "sext;": 10038, "sfr;": [55349, 56624], "sfrown;": 8994, "sharp;": 9839, "shchcy;": 1097, "shcy;": 1096, "shortmid;": 8739, "shortparallel;": 8741, shy: 173, "shy;": 173, "sigma;": 963, "sigmaf;": 962, "sigmav;": 962, "sim;": 8764, "simdot;": 10858, "sime;": 8771, "simeq;": 8771, "simg;": 10910, "simgE;": 10912, "siml;": 10909, "simlE;": 10911, "simne;": 8774, "simplus;": 10788, "simrarr;": 10610, "slarr;": 8592, "smallsetminus;": 8726, "smashp;": 10803, "smeparsl;": 10724, "smid;": 8739, "smile;": 8995, "smt;": 10922, "smte;": 10924, "smtes;": [10924, 65024], "softcy;": 1100, "sol;": 47, "solb;": 10692, "solbar;": 9023, "sopf;": [55349, 56676], "spades;": 9824, "spadesuit;": 9824, "spar;": 8741, "sqcap;": 8851, "sqcaps;": [8851, 65024], "sqcup;": 8852, "sqcups;": [8852, 65024], "sqsub;": 8847, "sqsube;": 8849, "sqsubset;": 8847, "sqsubseteq;": 8849, "sqsup;": 8848, "sqsupe;": 8850, "sqsupset;": 8848, "sqsupseteq;": 8850, "squ;": 9633, "square;": 9633, "squarf;": 9642, "squf;": 9642, "srarr;": 8594, "sscr;": [55349, 56520], "ssetmn;": 8726, "ssmile;": 8995, "sstarf;": 8902, "star;": 9734, "starf;": 9733, "straightepsilon;": 1013, "straightphi;": 981, "strns;": 175, "sub;": 8834, "subE;": 10949, "subdot;": 10941, "sube;": 8838, "subedot;": 10947, "submult;": 10945, "subnE;": 10955, "subne;": 8842, "subplus;": 10943, "subrarr;": 10617, "subset;": 8834, "subseteq;": 8838, "subseteqq;": 10949, "subsetneq;": 8842, "subsetneqq;": 10955, "subsim;": 10951, "subsub;": 10965, "subsup;": 10963, "succ;": 8827, "succapprox;": 10936, "succcurlyeq;": 8829, "succeq;": 10928, "succnapprox;": 10938, "succneqq;": 10934, "succnsim;": 8937, "succsim;": 8831, "sum;": 8721, "sung;": 9834, sup1: 185, "sup1;": 185, sup2: 178, "sup2;": 178, sup3: 179, "sup3;": 179, "sup;": 8835, "supE;": 10950, "supdot;": 10942, "supdsub;": 10968, "supe;": 8839, "supedot;": 10948, "suphsol;": 10185, "suphsub;": 10967, "suplarr;": 10619, "supmult;": 10946, "supnE;": 10956, "supne;": 8843, "supplus;": 10944, "supset;": 8835, "supseteq;": 8839, "supseteqq;": 10950, "supsetneq;": 8843, "supsetneqq;": 10956, "supsim;": 10952, "supsub;": 10964, "supsup;": 10966, "swArr;": 8665, "swarhk;": 10534, "swarr;": 8601, "swarrow;": 8601, "swnwar;": 10538, szlig: 223, "szlig;": 223, "target;": 8982, "tau;": 964, "tbrk;": 9140, "tcaron;": 357, "tcedil;": 355, "tcy;": 1090, "tdot;": 8411, "telrec;": 8981, "tfr;": [55349, 56625], "there4;": 8756, "therefore;": 8756, "theta;": 952, "thetasym;": 977, "thetav;": 977, "thickapprox;": 8776, "thicksim;": 8764, "thinsp;": 8201, "thkap;": 8776, "thksim;": 8764, thorn: 254, "thorn;": 254, "tilde;": 732, times: 215, "times;": 215, "timesb;": 8864, "timesbar;": 10801, "timesd;": 10800, "tint;": 8749, "toea;": 10536, "top;": 8868, "topbot;": 9014, "topcir;": 10993, "topf;": [55349, 56677], "topfork;": 10970, "tosa;": 10537, "tprime;": 8244, "trade;": 8482, "triangle;": 9653, "triangledown;": 9663, "triangleleft;": 9667, "trianglelefteq;": 8884, "triangleq;": 8796, "triangleright;": 9657, "trianglerighteq;": 8885, "tridot;": 9708, "trie;": 8796, "triminus;": 10810, "triplus;": 10809, "trisb;": 10701, "tritime;": 10811, "trpezium;": 9186, "tscr;": [55349, 56521], "tscy;": 1094, "tshcy;": 1115, "tstrok;": 359, "twixt;": 8812, "twoheadleftarrow;": 8606, "twoheadrightarrow;": 8608, "uArr;": 8657, "uHar;": 10595, uacute: 250, "uacute;": 250, "uarr;": 8593, "ubrcy;": 1118, "ubreve;": 365, ucirc: 251, "ucirc;": 251, "ucy;": 1091, "udarr;": 8645, "udblac;": 369, "udhar;": 10606, "ufisht;": 10622, "ufr;": [55349, 56626], ugrave: 249, "ugrave;": 249, "uharl;": 8639, "uharr;": 8638, "uhblk;": 9600, "ulcorn;": 8988, "ulcorner;": 8988, "ulcrop;": 8975, "ultri;": 9720, "umacr;": 363, uml: 168, "uml;": 168, "uogon;": 371, "uopf;": [55349, 56678], "uparrow;": 8593, "updownarrow;": 8597, "upharpoonleft;": 8639, "upharpoonright;": 8638, "uplus;": 8846, "upsi;": 965, "upsih;": 978, "upsilon;": 965, "upuparrows;": 8648, "urcorn;": 8989, "urcorner;": 8989, "urcrop;": 8974, "uring;": 367, "urtri;": 9721, "uscr;": [55349, 56522], "utdot;": 8944, "utilde;": 361, "utri;": 9653, "utrif;": 9652, "uuarr;": 8648, uuml: 252, "uuml;": 252, "uwangle;": 10663, "vArr;": 8661, "vBar;": 10984, "vBarv;": 10985, "vDash;": 8872, "vangrt;": 10652, "varepsilon;": 1013, "varkappa;": 1008, "varnothing;": 8709, "varphi;": 981, "varpi;": 982, "varpropto;": 8733, "varr;": 8597, "varrho;": 1009, "varsigma;": 962, "varsubsetneq;": [8842, 65024], "varsubsetneqq;": [10955, 65024], "varsupsetneq;": [8843, 65024], "varsupsetneqq;": [10956, 65024], "vartheta;": 977, "vartriangleleft;": 8882, "vartriangleright;": 8883, "vcy;": 1074, "vdash;": 8866, "vee;": 8744, "veebar;": 8891, "veeeq;": 8794, "vellip;": 8942, "verbar;": 124, "vert;": 124, "vfr;": [55349, 56627], "vltri;": 8882, "vnsub;": [8834, 8402], "vnsup;": [8835, 8402], "vopf;": [55349, 56679], "vprop;": 8733, "vrtri;": 8883, "vscr;": [55349, 56523], "vsubnE;": [10955, 65024], "vsubne;": [8842, 65024], "vsupnE;": [10956, 65024], "vsupne;": [8843, 65024], "vzigzag;": 10650, "wcirc;": 373, "wedbar;": 10847, "wedge;": 8743, "wedgeq;": 8793, "weierp;": 8472, "wfr;": [55349, 56628], "wopf;": [55349, 56680], "wp;": 8472, "wr;": 8768, "wreath;": 8768, "wscr;": [55349, 56524], "xcap;": 8898, "xcirc;": 9711, "xcup;": 8899, "xdtri;": 9661, "xfr;": [55349, 56629], "xhArr;": 10234, "xharr;": 10231, "xi;": 958, "xlArr;": 10232, "xlarr;": 10229, "xmap;": 10236, "xnis;": 8955, "xodot;": 10752, "xopf;": [55349, 56681], "xoplus;": 10753, "xotime;": 10754, "xrArr;": 10233, "xrarr;": 10230, "xscr;": [55349, 56525], "xsqcup;": 10758, "xuplus;": 10756, "xutri;": 9651, "xvee;": 8897, "xwedge;": 8896, yacute: 253, "yacute;": 253, "yacy;": 1103, "ycirc;": 375, "ycy;": 1099, yen: 165, "yen;": 165, "yfr;": [55349, 56630], "yicy;": 1111, "yopf;": [55349, 56682], "yscr;": [55349, 56526], "yucy;": 1102, yuml: 255, "yuml;": 255, "zacute;": 378, "zcaron;": 382, "zcy;": 1079, "zdot;": 380, "zeetrf;": 8488, "zeta;": 950, "zfr;": [55349, 56631], "zhcy;": 1078, "zigrarr;": 8669, "zopf;": [55349, 56683], "zscr;": [55349, 56527], "zwj;": 8205, "zwnj;": 8204 }, Xo = /(A(?:Elig;?|MP;?|acute;?|breve;|c(?:irc;?|y;)|fr;|grave;?|lpha;|macr;|nd;|o(?:gon;|pf;)|pplyFunction;|ring;?|s(?:cr;|sign;)|tilde;?|uml;?)|B(?:a(?:ckslash;|r(?:v;|wed;))|cy;|e(?:cause;|rnoullis;|ta;)|fr;|opf;|reve;|scr;|umpeq;)|C(?:Hcy;|OPY;?|a(?:cute;|p(?:;|italDifferentialD;)|yleys;)|c(?:aron;|edil;?|irc;|onint;)|dot;|e(?:dilla;|nterDot;)|fr;|hi;|ircle(?:Dot;|Minus;|Plus;|Times;)|lo(?:ckwiseContourIntegral;|seCurly(?:DoubleQuote;|Quote;))|o(?:lon(?:;|e;)|n(?:gruent;|int;|tourIntegral;)|p(?:f;|roduct;)|unterClockwiseContourIntegral;)|ross;|scr;|up(?:;|Cap;))|D(?:D(?:;|otrahd;)|Jcy;|Scy;|Zcy;|a(?:gger;|rr;|shv;)|c(?:aron;|y;)|el(?:;|ta;)|fr;|i(?:a(?:critical(?:Acute;|Do(?:t;|ubleAcute;)|Grave;|Tilde;)|mond;)|fferentialD;)|o(?:pf;|t(?:;|Dot;|Equal;)|uble(?:ContourIntegral;|Do(?:t;|wnArrow;)|L(?:eft(?:Arrow;|RightArrow;|Tee;)|ong(?:Left(?:Arrow;|RightArrow;)|RightArrow;))|Right(?:Arrow;|Tee;)|Up(?:Arrow;|DownArrow;)|VerticalBar;)|wn(?:Arrow(?:;|Bar;|UpArrow;)|Breve;|Left(?:RightVector;|TeeVector;|Vector(?:;|Bar;))|Right(?:TeeVector;|Vector(?:;|Bar;))|Tee(?:;|Arrow;)|arrow;))|s(?:cr;|trok;))|E(?:NG;|TH;?|acute;?|c(?:aron;|irc;?|y;)|dot;|fr;|grave;?|lement;|m(?:acr;|pty(?:SmallSquare;|VerySmallSquare;))|o(?:gon;|pf;)|psilon;|qu(?:al(?:;|Tilde;)|ilibrium;)|s(?:cr;|im;)|ta;|uml;?|x(?:ists;|ponentialE;))|F(?:cy;|fr;|illed(?:SmallSquare;|VerySmallSquare;)|o(?:pf;|rAll;|uriertrf;)|scr;)|G(?:Jcy;|T;?|amma(?:;|d;)|breve;|c(?:edil;|irc;|y;)|dot;|fr;|g;|opf;|reater(?:Equal(?:;|Less;)|FullEqual;|Greater;|Less;|SlantEqual;|Tilde;)|scr;|t;)|H(?:ARDcy;|a(?:cek;|t;)|circ;|fr;|ilbertSpace;|o(?:pf;|rizontalLine;)|s(?:cr;|trok;)|ump(?:DownHump;|Equal;))|I(?:Ecy;|Jlig;|Ocy;|acute;?|c(?:irc;?|y;)|dot;|fr;|grave;?|m(?:;|a(?:cr;|ginaryI;)|plies;)|n(?:t(?:;|e(?:gral;|rsection;))|visible(?:Comma;|Times;))|o(?:gon;|pf;|ta;)|scr;|tilde;|u(?:kcy;|ml;?))|J(?:c(?:irc;|y;)|fr;|opf;|s(?:cr;|ercy;)|ukcy;)|K(?:Hcy;|Jcy;|appa;|c(?:edil;|y;)|fr;|opf;|scr;)|L(?:Jcy;|T;?|a(?:cute;|mbda;|ng;|placetrf;|rr;)|c(?:aron;|edil;|y;)|e(?:ft(?:A(?:ngleBracket;|rrow(?:;|Bar;|RightArrow;))|Ceiling;|Do(?:ubleBracket;|wn(?:TeeVector;|Vector(?:;|Bar;)))|Floor;|Right(?:Arrow;|Vector;)|T(?:ee(?:;|Arrow;|Vector;)|riangle(?:;|Bar;|Equal;))|Up(?:DownVector;|TeeVector;|Vector(?:;|Bar;))|Vector(?:;|Bar;)|arrow;|rightarrow;)|ss(?:EqualGreater;|FullEqual;|Greater;|Less;|SlantEqual;|Tilde;))|fr;|l(?:;|eftarrow;)|midot;|o(?:ng(?:Left(?:Arrow;|RightArrow;)|RightArrow;|left(?:arrow;|rightarrow;)|rightarrow;)|pf;|wer(?:LeftArrow;|RightArrow;))|s(?:cr;|h;|trok;)|t;)|M(?:ap;|cy;|e(?:diumSpace;|llintrf;)|fr;|inusPlus;|opf;|scr;|u;)|N(?:Jcy;|acute;|c(?:aron;|edil;|y;)|e(?:gative(?:MediumSpace;|Thi(?:ckSpace;|nSpace;)|VeryThinSpace;)|sted(?:GreaterGreater;|LessLess;)|wLine;)|fr;|o(?:Break;|nBreakingSpace;|pf;|t(?:;|C(?:ongruent;|upCap;)|DoubleVerticalBar;|E(?:lement;|qual(?:;|Tilde;)|xists;)|Greater(?:;|Equal;|FullEqual;|Greater;|Less;|SlantEqual;|Tilde;)|Hump(?:DownHump;|Equal;)|Le(?:ftTriangle(?:;|Bar;|Equal;)|ss(?:;|Equal;|Greater;|Less;|SlantEqual;|Tilde;))|Nested(?:GreaterGreater;|LessLess;)|Precedes(?:;|Equal;|SlantEqual;)|R(?:everseElement;|ightTriangle(?:;|Bar;|Equal;))|S(?:quareSu(?:bset(?:;|Equal;)|perset(?:;|Equal;))|u(?:bset(?:;|Equal;)|cceeds(?:;|Equal;|SlantEqual;|Tilde;)|perset(?:;|Equal;)))|Tilde(?:;|Equal;|FullEqual;|Tilde;)|VerticalBar;))|scr;|tilde;?|u;)|O(?:Elig;|acute;?|c(?:irc;?|y;)|dblac;|fr;|grave;?|m(?:acr;|ega;|icron;)|opf;|penCurly(?:DoubleQuote;|Quote;)|r;|s(?:cr;|lash;?)|ti(?:lde;?|mes;)|uml;?|ver(?:B(?:ar;|rac(?:e;|ket;))|Parenthesis;))|P(?:artialD;|cy;|fr;|hi;|i;|lusMinus;|o(?:incareplane;|pf;)|r(?:;|ecedes(?:;|Equal;|SlantEqual;|Tilde;)|ime;|o(?:duct;|portion(?:;|al;)))|s(?:cr;|i;))|Q(?:UOT;?|fr;|opf;|scr;)|R(?:Barr;|EG;?|a(?:cute;|ng;|rr(?:;|tl;))|c(?:aron;|edil;|y;)|e(?:;|verse(?:E(?:lement;|quilibrium;)|UpEquilibrium;))|fr;|ho;|ight(?:A(?:ngleBracket;|rrow(?:;|Bar;|LeftArrow;))|Ceiling;|Do(?:ubleBracket;|wn(?:TeeVector;|Vector(?:;|Bar;)))|Floor;|T(?:ee(?:;|Arrow;|Vector;)|riangle(?:;|Bar;|Equal;))|Up(?:DownVector;|TeeVector;|Vector(?:;|Bar;))|Vector(?:;|Bar;)|arrow;)|o(?:pf;|undImplies;)|rightarrow;|s(?:cr;|h;)|uleDelayed;)|S(?:H(?:CHcy;|cy;)|OFTcy;|acute;|c(?:;|aron;|edil;|irc;|y;)|fr;|hort(?:DownArrow;|LeftArrow;|RightArrow;|UpArrow;)|igma;|mallCircle;|opf;|q(?:rt;|uare(?:;|Intersection;|Su(?:bset(?:;|Equal;)|perset(?:;|Equal;))|Union;))|scr;|tar;|u(?:b(?:;|set(?:;|Equal;))|c(?:ceeds(?:;|Equal;|SlantEqual;|Tilde;)|hThat;)|m;|p(?:;|erset(?:;|Equal;)|set;)))|T(?:HORN;?|RADE;|S(?:Hcy;|cy;)|a(?:b;|u;)|c(?:aron;|edil;|y;)|fr;|h(?:e(?:refore;|ta;)|i(?:ckSpace;|nSpace;))|ilde(?:;|Equal;|FullEqual;|Tilde;)|opf;|ripleDot;|s(?:cr;|trok;))|U(?:a(?:cute;?|rr(?:;|ocir;))|br(?:cy;|eve;)|c(?:irc;?|y;)|dblac;|fr;|grave;?|macr;|n(?:der(?:B(?:ar;|rac(?:e;|ket;))|Parenthesis;)|ion(?:;|Plus;))|o(?:gon;|pf;)|p(?:Arrow(?:;|Bar;|DownArrow;)|DownArrow;|Equilibrium;|Tee(?:;|Arrow;)|arrow;|downarrow;|per(?:LeftArrow;|RightArrow;)|si(?:;|lon;))|ring;|scr;|tilde;|uml;?)|V(?:Dash;|bar;|cy;|dash(?:;|l;)|e(?:e;|r(?:bar;|t(?:;|ical(?:Bar;|Line;|Separator;|Tilde;))|yThinSpace;))|fr;|opf;|scr;|vdash;)|W(?:circ;|edge;|fr;|opf;|scr;)|X(?:fr;|i;|opf;|scr;)|Y(?:Acy;|Icy;|Ucy;|acute;?|c(?:irc;|y;)|fr;|opf;|scr;|uml;)|Z(?:Hcy;|acute;|c(?:aron;|y;)|dot;|e(?:roWidthSpace;|ta;)|fr;|opf;|scr;)|a(?:acute;?|breve;|c(?:;|E;|d;|irc;?|ute;?|y;)|elig;?|f(?:;|r;)|grave;?|l(?:e(?:fsym;|ph;)|pha;)|m(?:a(?:cr;|lg;)|p;?)|n(?:d(?:;|and;|d;|slope;|v;)|g(?:;|e;|le;|msd(?:;|a(?:a;|b;|c;|d;|e;|f;|g;|h;))|rt(?:;|vb(?:;|d;))|s(?:ph;|t;)|zarr;))|o(?:gon;|pf;)|p(?:;|E;|acir;|e;|id;|os;|prox(?:;|eq;))|ring;?|s(?:cr;|t;|ymp(?:;|eq;))|tilde;?|uml;?|w(?:conint;|int;))|b(?:Not;|a(?:ck(?:cong;|epsilon;|prime;|sim(?:;|eq;))|r(?:vee;|wed(?:;|ge;)))|brk(?:;|tbrk;)|c(?:ong;|y;)|dquo;|e(?:caus(?:;|e;)|mptyv;|psi;|rnou;|t(?:a;|h;|ween;))|fr;|ig(?:c(?:ap;|irc;|up;)|o(?:dot;|plus;|times;)|s(?:qcup;|tar;)|triangle(?:down;|up;)|uplus;|vee;|wedge;)|karow;|l(?:a(?:ck(?:lozenge;|square;|triangle(?:;|down;|left;|right;))|nk;)|k(?:1(?:2;|4;)|34;)|ock;)|n(?:e(?:;|quiv;)|ot;)|o(?:pf;|t(?:;|tom;)|wtie;|x(?:D(?:L;|R;|l;|r;)|H(?:;|D;|U;|d;|u;)|U(?:L;|R;|l;|r;)|V(?:;|H;|L;|R;|h;|l;|r;)|box;|d(?:L;|R;|l;|r;)|h(?:;|D;|U;|d;|u;)|minus;|plus;|times;|u(?:L;|R;|l;|r;)|v(?:;|H;|L;|R;|h;|l;|r;)))|prime;|r(?:eve;|vbar;?)|s(?:cr;|emi;|im(?:;|e;)|ol(?:;|b;|hsub;))|u(?:ll(?:;|et;)|mp(?:;|E;|e(?:;|q;))))|c(?:a(?:cute;|p(?:;|and;|brcup;|c(?:ap;|up;)|dot;|s;)|r(?:et;|on;))|c(?:a(?:ps;|ron;)|edil;?|irc;|ups(?:;|sm;))|dot;|e(?:dil;?|mptyv;|nt(?:;|erdot;|))|fr;|h(?:cy;|eck(?:;|mark;)|i;)|ir(?:;|E;|c(?:;|eq;|le(?:arrow(?:left;|right;)|d(?:R;|S;|ast;|circ;|dash;)))|e;|fnint;|mid;|scir;)|lubs(?:;|uit;)|o(?:lon(?:;|e(?:;|q;))|m(?:ma(?:;|t;)|p(?:;|fn;|le(?:ment;|xes;)))|n(?:g(?:;|dot;)|int;)|p(?:f;|rod;|y(?:;|sr;|)))|r(?:arr;|oss;)|s(?:cr;|u(?:b(?:;|e;)|p(?:;|e;)))|tdot;|u(?:darr(?:l;|r;)|e(?:pr;|sc;)|larr(?:;|p;)|p(?:;|brcap;|c(?:ap;|up;)|dot;|or;|s;)|r(?:arr(?:;|m;)|ly(?:eq(?:prec;|succ;)|vee;|wedge;)|ren;?|vearrow(?:left;|right;))|vee;|wed;)|w(?:conint;|int;)|ylcty;)|d(?:Arr;|Har;|a(?:gger;|leth;|rr;|sh(?:;|v;))|b(?:karow;|lac;)|c(?:aron;|y;)|d(?:;|a(?:gger;|rr;)|otseq;)|e(?:g;?|lta;|mptyv;)|f(?:isht;|r;)|har(?:l;|r;)|i(?:am(?:;|ond(?:;|suit;)|s;)|e;|gamma;|sin;|v(?:;|ide(?:;|ontimes;|)|onx;))|jcy;|lc(?:orn;|rop;)|o(?:llar;|pf;|t(?:;|eq(?:;|dot;)|minus;|plus;|square;)|ublebarwedge;|wn(?:arrow;|downarrows;|harpoon(?:left;|right;)))|r(?:bkarow;|c(?:orn;|rop;))|s(?:c(?:r;|y;)|ol;|trok;)|t(?:dot;|ri(?:;|f;))|u(?:arr;|har;)|wangle;|z(?:cy;|igrarr;))|e(?:D(?:Dot;|ot;)|a(?:cute;?|ster;)|c(?:aron;|ir(?:;|c;?)|olon;|y;)|dot;|e;|f(?:Dot;|r;)|g(?:;|rave;?|s(?:;|dot;))|l(?:;|inters;|l;|s(?:;|dot;))|m(?:acr;|pty(?:;|set;|v;)|sp(?:1(?:3;|4;)|;))|n(?:g;|sp;)|o(?:gon;|pf;)|p(?:ar(?:;|sl;)|lus;|si(?:;|lon;|v;))|q(?:c(?:irc;|olon;)|s(?:im;|lant(?:gtr;|less;))|u(?:als;|est;|iv(?:;|DD;))|vparsl;)|r(?:Dot;|arr;)|s(?:cr;|dot;|im;)|t(?:a;|h;?)|u(?:ml;?|ro;)|x(?:cl;|ist;|p(?:ectation;|onentiale;)))|f(?:allingdotseq;|cy;|emale;|f(?:ilig;|l(?:ig;|lig;)|r;)|ilig;|jlig;|l(?:at;|lig;|tns;)|nof;|o(?:pf;|r(?:all;|k(?:;|v;)))|partint;|r(?:a(?:c(?:1(?:2;?|3;|4;?|5;|6;|8;)|2(?:3;|5;)|3(?:4;?|5;|8;)|45;|5(?:6;|8;)|78;)|sl;)|own;)|scr;)|g(?:E(?:;|l;)|a(?:cute;|mma(?:;|d;)|p;)|breve;|c(?:irc;|y;)|dot;|e(?:;|l;|q(?:;|q;|slant;)|s(?:;|cc;|dot(?:;|o(?:;|l;))|l(?:;|es;)))|fr;|g(?:;|g;)|imel;|jcy;|l(?:;|E;|a;|j;)|n(?:E;|ap(?:;|prox;)|e(?:;|q(?:;|q;))|sim;)|opf;|rave;|s(?:cr;|im(?:;|e;|l;))|t(?:;|c(?:c;|ir;)|dot;|lPar;|quest;|r(?:a(?:pprox;|rr;)|dot;|eq(?:less;|qless;)|less;|sim;)|)|v(?:ertneqq;|nE;))|h(?:Arr;|a(?:irsp;|lf;|milt;|r(?:dcy;|r(?:;|cir;|w;)))|bar;|circ;|e(?:arts(?:;|uit;)|llip;|rcon;)|fr;|ks(?:earow;|warow;)|o(?:arr;|mtht;|ok(?:leftarrow;|rightarrow;)|pf;|rbar;)|s(?:cr;|lash;|trok;)|y(?:bull;|phen;))|i(?:acute;?|c(?:;|irc;?|y;)|e(?:cy;|xcl;?)|f(?:f;|r;)|grave;?|i(?:;|i(?:int;|nt;)|nfin;|ota;)|jlig;|m(?:a(?:cr;|g(?:e;|line;|part;)|th;)|of;|ped;)|n(?:;|care;|fin(?:;|tie;)|odot;|t(?:;|cal;|e(?:gers;|rcal;)|larhk;|prod;))|o(?:cy;|gon;|pf;|ta;)|prod;|quest;?|s(?:cr;|in(?:;|E;|dot;|s(?:;|v;)|v;))|t(?:;|ilde;)|u(?:kcy;|ml;?))|j(?:c(?:irc;|y;)|fr;|math;|opf;|s(?:cr;|ercy;)|ukcy;)|k(?:appa(?:;|v;)|c(?:edil;|y;)|fr;|green;|hcy;|jcy;|opf;|scr;)|l(?:A(?:arr;|rr;|tail;)|Barr;|E(?:;|g;)|Har;|a(?:cute;|emptyv;|gran;|mbda;|ng(?:;|d;|le;)|p;|quo;?|rr(?:;|b(?:;|fs;)|fs;|hk;|lp;|pl;|sim;|tl;)|t(?:;|ail;|e(?:;|s;)))|b(?:arr;|brk;|r(?:ac(?:e;|k;)|k(?:e;|sl(?:d;|u;))))|c(?:aron;|e(?:dil;|il;)|ub;|y;)|d(?:ca;|quo(?:;|r;)|r(?:dhar;|ushar;)|sh;)|e(?:;|ft(?:arrow(?:;|tail;)|harpoon(?:down;|up;)|leftarrows;|right(?:arrow(?:;|s;)|harpoons;|squigarrow;)|threetimes;)|g;|q(?:;|q;|slant;)|s(?:;|cc;|dot(?:;|o(?:;|r;))|g(?:;|es;)|s(?:approx;|dot;|eq(?:gtr;|qgtr;)|gtr;|sim;)))|f(?:isht;|loor;|r;)|g(?:;|E;)|h(?:ar(?:d;|u(?:;|l;))|blk;)|jcy;|l(?:;|arr;|corner;|hard;|tri;)|m(?:idot;|oust(?:;|ache;))|n(?:E;|ap(?:;|prox;)|e(?:;|q(?:;|q;))|sim;)|o(?:a(?:ng;|rr;)|brk;|ng(?:left(?:arrow;|rightarrow;)|mapsto;|rightarrow;)|oparrow(?:left;|right;)|p(?:ar;|f;|lus;)|times;|w(?:ast;|bar;)|z(?:;|enge;|f;))|par(?:;|lt;)|r(?:arr;|corner;|har(?:;|d;)|m;|tri;)|s(?:aquo;|cr;|h;|im(?:;|e;|g;)|q(?:b;|uo(?:;|r;))|trok;)|t(?:;|c(?:c;|ir;)|dot;|hree;|imes;|larr;|quest;|r(?:Par;|i(?:;|e;|f;))|)|ur(?:dshar;|uhar;)|v(?:ertneqq;|nE;))|m(?:DDot;|a(?:cr;?|l(?:e;|t(?:;|ese;))|p(?:;|sto(?:;|down;|left;|up;))|rker;)|c(?:omma;|y;)|dash;|easuredangle;|fr;|ho;|i(?:cro;?|d(?:;|ast;|cir;|dot;?)|nus(?:;|b;|d(?:;|u;)))|l(?:cp;|dr;)|nplus;|o(?:dels;|pf;)|p;|s(?:cr;|tpos;)|u(?:;|ltimap;|map;))|n(?:G(?:g;|t(?:;|v;))|L(?:eft(?:arrow;|rightarrow;)|l;|t(?:;|v;))|Rightarrow;|V(?:Dash;|dash;)|a(?:bla;|cute;|ng;|p(?:;|E;|id;|os;|prox;)|tur(?:;|al(?:;|s;)))|b(?:sp;?|ump(?:;|e;))|c(?:a(?:p;|ron;)|edil;|ong(?:;|dot;)|up;|y;)|dash;|e(?:;|Arr;|ar(?:hk;|r(?:;|ow;))|dot;|quiv;|s(?:ear;|im;)|xist(?:;|s;))|fr;|g(?:E;|e(?:;|q(?:;|q;|slant;)|s;)|sim;|t(?:;|r;))|h(?:Arr;|arr;|par;)|i(?:;|s(?:;|d;)|v;)|jcy;|l(?:Arr;|E;|arr;|dr;|e(?:;|ft(?:arrow;|rightarrow;)|q(?:;|q;|slant;)|s(?:;|s;))|sim;|t(?:;|ri(?:;|e;)))|mid;|o(?:pf;|t(?:;|in(?:;|E;|dot;|v(?:a;|b;|c;))|ni(?:;|v(?:a;|b;|c;))|))|p(?:ar(?:;|allel;|sl;|t;)|olint;|r(?:;|cue;|e(?:;|c(?:;|eq;))))|r(?:Arr;|arr(?:;|c;|w;)|ightarrow;|tri(?:;|e;))|s(?:c(?:;|cue;|e;|r;)|hort(?:mid;|parallel;)|im(?:;|e(?:;|q;))|mid;|par;|qsu(?:be;|pe;)|u(?:b(?:;|E;|e;|set(?:;|eq(?:;|q;)))|cc(?:;|eq;)|p(?:;|E;|e;|set(?:;|eq(?:;|q;)))))|t(?:gl;|ilde;?|lg;|riangle(?:left(?:;|eq;)|right(?:;|eq;)))|u(?:;|m(?:;|ero;|sp;))|v(?:Dash;|Harr;|ap;|dash;|g(?:e;|t;)|infin;|l(?:Arr;|e;|t(?:;|rie;))|r(?:Arr;|trie;)|sim;)|w(?:Arr;|ar(?:hk;|r(?:;|ow;))|near;))|o(?:S;|a(?:cute;?|st;)|c(?:ir(?:;|c;?)|y;)|d(?:ash;|blac;|iv;|ot;|sold;)|elig;|f(?:cir;|r;)|g(?:on;|rave;?|t;)|h(?:bar;|m;)|int;|l(?:arr;|c(?:ir;|ross;)|ine;|t;)|m(?:acr;|ega;|i(?:cron;|d;|nus;))|opf;|p(?:ar;|erp;|lus;)|r(?:;|arr;|d(?:;|er(?:;|of;)|f;?|m;?)|igof;|or;|slope;|v;)|s(?:cr;|lash;?|ol;)|ti(?:lde;?|mes(?:;|as;))|uml;?|vbar;)|p(?:ar(?:;|a(?:;|llel;|)|s(?:im;|l;)|t;)|cy;|er(?:cnt;|iod;|mil;|p;|tenk;)|fr;|h(?:i(?:;|v;)|mmat;|one;)|i(?:;|tchfork;|v;)|l(?:an(?:ck(?:;|h;)|kv;)|us(?:;|acir;|b;|cir;|d(?:o;|u;)|e;|mn;?|sim;|two;))|m;|o(?:intint;|pf;|und;?)|r(?:;|E;|ap;|cue;|e(?:;|c(?:;|approx;|curlyeq;|eq;|n(?:approx;|eqq;|sim;)|sim;))|ime(?:;|s;)|n(?:E;|ap;|sim;)|o(?:d;|f(?:alar;|line;|surf;)|p(?:;|to;))|sim;|urel;)|s(?:cr;|i;)|uncsp;)|q(?:fr;|int;|opf;|prime;|scr;|u(?:at(?:ernions;|int;)|est(?:;|eq;)|ot;?))|r(?:A(?:arr;|rr;|tail;)|Barr;|Har;|a(?:c(?:e;|ute;)|dic;|emptyv;|ng(?:;|d;|e;|le;)|quo;?|rr(?:;|ap;|b(?:;|fs;)|c;|fs;|hk;|lp;|pl;|sim;|tl;|w;)|t(?:ail;|io(?:;|nals;)))|b(?:arr;|brk;|r(?:ac(?:e;|k;)|k(?:e;|sl(?:d;|u;))))|c(?:aron;|e(?:dil;|il;)|ub;|y;)|d(?:ca;|ldhar;|quo(?:;|r;)|sh;)|e(?:al(?:;|ine;|part;|s;)|ct;|g;?)|f(?:isht;|loor;|r;)|h(?:ar(?:d;|u(?:;|l;))|o(?:;|v;))|i(?:ght(?:arrow(?:;|tail;)|harpoon(?:down;|up;)|left(?:arrows;|harpoons;)|rightarrows;|squigarrow;|threetimes;)|ng;|singdotseq;)|l(?:arr;|har;|m;)|moust(?:;|ache;)|nmid;|o(?:a(?:ng;|rr;)|brk;|p(?:ar;|f;|lus;)|times;)|p(?:ar(?:;|gt;)|polint;)|rarr;|s(?:aquo;|cr;|h;|q(?:b;|uo(?:;|r;)))|t(?:hree;|imes;|ri(?:;|e;|f;|ltri;))|uluhar;|x;)|s(?:acute;|bquo;|c(?:;|E;|a(?:p;|ron;)|cue;|e(?:;|dil;)|irc;|n(?:E;|ap;|sim;)|polint;|sim;|y;)|dot(?:;|b;|e;)|e(?:Arr;|ar(?:hk;|r(?:;|ow;))|ct;?|mi;|swar;|tm(?:inus;|n;)|xt;)|fr(?:;|own;)|h(?:arp;|c(?:hcy;|y;)|ort(?:mid;|parallel;)|y;?)|i(?:gma(?:;|f;|v;)|m(?:;|dot;|e(?:;|q;)|g(?:;|E;)|l(?:;|E;)|ne;|plus;|rarr;))|larr;|m(?:a(?:llsetminus;|shp;)|eparsl;|i(?:d;|le;)|t(?:;|e(?:;|s;)))|o(?:ftcy;|l(?:;|b(?:;|ar;))|pf;)|pa(?:des(?:;|uit;)|r;)|q(?:c(?:ap(?:;|s;)|up(?:;|s;))|su(?:b(?:;|e;|set(?:;|eq;))|p(?:;|e;|set(?:;|eq;)))|u(?:;|ar(?:e;|f;)|f;))|rarr;|s(?:cr;|etmn;|mile;|tarf;)|t(?:ar(?:;|f;)|r(?:aight(?:epsilon;|phi;)|ns;))|u(?:b(?:;|E;|dot;|e(?:;|dot;)|mult;|n(?:E;|e;)|plus;|rarr;|s(?:et(?:;|eq(?:;|q;)|neq(?:;|q;))|im;|u(?:b;|p;)))|cc(?:;|approx;|curlyeq;|eq;|n(?:approx;|eqq;|sim;)|sim;)|m;|ng;|p(?:1;?|2;?|3;?|;|E;|d(?:ot;|sub;)|e(?:;|dot;)|hs(?:ol;|ub;)|larr;|mult;|n(?:E;|e;)|plus;|s(?:et(?:;|eq(?:;|q;)|neq(?:;|q;))|im;|u(?:b;|p;))))|w(?:Arr;|ar(?:hk;|r(?:;|ow;))|nwar;)|zlig;?)|t(?:a(?:rget;|u;)|brk;|c(?:aron;|edil;|y;)|dot;|elrec;|fr;|h(?:e(?:re(?:4;|fore;)|ta(?:;|sym;|v;))|i(?:ck(?:approx;|sim;)|nsp;)|k(?:ap;|sim;)|orn;?)|i(?:lde;|mes(?:;|b(?:;|ar;)|d;|)|nt;)|o(?:ea;|p(?:;|bot;|cir;|f(?:;|ork;))|sa;)|prime;|r(?:ade;|i(?:angle(?:;|down;|left(?:;|eq;)|q;|right(?:;|eq;))|dot;|e;|minus;|plus;|sb;|time;)|pezium;)|s(?:c(?:r;|y;)|hcy;|trok;)|w(?:ixt;|ohead(?:leftarrow;|rightarrow;)))|u(?:Arr;|Har;|a(?:cute;?|rr;)|br(?:cy;|eve;)|c(?:irc;?|y;)|d(?:arr;|blac;|har;)|f(?:isht;|r;)|grave;?|h(?:ar(?:l;|r;)|blk;)|l(?:c(?:orn(?:;|er;)|rop;)|tri;)|m(?:acr;|l;?)|o(?:gon;|pf;)|p(?:arrow;|downarrow;|harpoon(?:left;|right;)|lus;|si(?:;|h;|lon;)|uparrows;)|r(?:c(?:orn(?:;|er;)|rop;)|ing;|tri;)|scr;|t(?:dot;|ilde;|ri(?:;|f;))|u(?:arr;|ml;?)|wangle;)|v(?:Arr;|Bar(?:;|v;)|Dash;|a(?:ngrt;|r(?:epsilon;|kappa;|nothing;|p(?:hi;|i;|ropto;)|r(?:;|ho;)|s(?:igma;|u(?:bsetneq(?:;|q;)|psetneq(?:;|q;)))|t(?:heta;|riangle(?:left;|right;))))|cy;|dash;|e(?:e(?:;|bar;|eq;)|llip;|r(?:bar;|t;))|fr;|ltri;|nsu(?:b;|p;)|opf;|prop;|rtri;|s(?:cr;|u(?:bn(?:E;|e;)|pn(?:E;|e;)))|zigzag;)|w(?:circ;|e(?:d(?:bar;|ge(?:;|q;))|ierp;)|fr;|opf;|p;|r(?:;|eath;)|scr;)|x(?:c(?:ap;|irc;|up;)|dtri;|fr;|h(?:Arr;|arr;)|i;|l(?:Arr;|arr;)|map;|nis;|o(?:dot;|p(?:f;|lus;)|time;)|r(?:Arr;|arr;)|s(?:cr;|qcup;)|u(?:plus;|tri;)|vee;|wedge;)|y(?:ac(?:ute;?|y;)|c(?:irc;|y;)|en;?|fr;|icy;|opf;|scr;|u(?:cy;|ml;?))|z(?:acute;|c(?:aron;|y;)|dot;|e(?:etrf;|ta;)|fr;|hcy;|igrarr;|opf;|scr;|w(?:j;|nj;)))|[\s\S]/g, G0 = 32, W0 = /[^\r"&\u0000]+/g, Y0 = /[^\r'&\u0000]+/g, $0 = /[^\r\t\n\f &>\u0000]+/g, K0 = /[^\r\t\n\f \/>A-Z\u0000]+/g, X0 = /[^\r\t\n\f \/=>A-Z\u0000]+/g, Q0 = /[^\]\r\u0000\uffff]*/g, Z0 = /[^&<\r\u0000\uffff]*/g, Qo = /[^<\r\u0000\uffff]*/g, J0 = /[^\r\u0000\uffff]*/g, Zo = /(?:(\/)?([a-z]+)>)|[\s\S]/g, Jo = /(?:([-a-z]+)[ \t\n\f]*=[ \t\n\f]*('[^'&\r\u0000]*'|"[^"&\r\u0000]*"|[^\t\n\r\f "&'\u0000>][^&> \t\n\r\f\u0000]*[ \t\n\f]))|[\s\S]/g, Sn = /[^\x09\x0A\x0C\x0D\x20]/, ai = /[^\x09\x0A\x0C\x0D\x20]/g, ef = /[^\x00\x09\x0A\x0C\x0D\x20]/, Ht = /^[\x09\x0A\x0C\x0D\x20]+/, Nn = /\x00/g;
  function Ce(e) {
    var t = 16384;
    if (e.length < t)
      return String.fromCharCode.apply(String, e);
    for (var r = "", n = 0; n < e.length; n += t)
      r += String.fromCharCode.apply(String, e.slice(n, n + t));
    return r;
  }
  function tf(e) {
    for (var t = [], r = 0; r < e.length; r++)
      t[r] = e.charCodeAt(r);
    return t;
  }
  function te(e, t) {
    if (typeof t == "string")
      return e.namespaceURI === q.HTML && e.localName === t;
    var r = t[e.namespaceURI];
    return r && r[e.localName];
  }
  function ec(e) {
    return te(e, fc);
  }
  function tc(e) {
    if (te(e, dc))
      return true;
    if (e.namespaceURI === q.MATHML && e.localName === "annotation-xml") {
      var t = e.getAttribute("encoding");
      if (t && (t = t.toLowerCase()), t === "text/html" || t === "application/xhtml+xml")
        return true;
    }
    return false;
  }
  function rf(e) {
    return e in $o ? $o[e] : e;
  }
  function rc(e) {
    for (var t = 0, r = e.length; t < r; t++)
      e[t][0] in Yo && (e[t][0] = Yo[e[t][0]]);
  }
  function nc(e) {
    for (var t = 0, r = e.length; t < r; t++)
      if (e[t][0] === "definitionurl") {
        e[t][0] = "definitionURL";
        break;
      }
  }
  function ii(e) {
    for (var t = 0, r = e.length; t < r; t++)
      e[t][0] in Wo && e[t].push(Wo[e[t][0]]);
  }
  function ac(e, t) {
    for (var r = 0, n = e.length; r < n; r++) {
      var l = e[r][0], f = e[r][1];
      t.hasAttribute(l) || t._setAttribute(l, f);
    }
  }
  Y.ElementStack = function() {
    this.elements = [], this.top = null;
  };
  Y.ElementStack.prototype.push = function(e) {
    this.elements.push(e), this.top = e;
  };
  Y.ElementStack.prototype.pop = function(e) {
    this.elements.pop(), this.top = this.elements[this.elements.length - 1];
  };
  Y.ElementStack.prototype.popTag = function(e) {
    for (var t = this.elements.length - 1; t > 0; t--) {
      var r = this.elements[t];
      if (te(r, e))
        break;
    }
    this.elements.length = t, this.top = this.elements[t - 1];
  };
  Y.ElementStack.prototype.popElementType = function(e) {
    for (var t = this.elements.length - 1; t > 0 && !(this.elements[t] instanceof e); t--)
      ;
    this.elements.length = t, this.top = this.elements[t - 1];
  };
  Y.ElementStack.prototype.popElement = function(e) {
    for (var t = this.elements.length - 1; t > 0 && this.elements[t] !== e; t--)
      ;
    this.elements.length = t, this.top = this.elements[t - 1];
  };
  Y.ElementStack.prototype.removeElement = function(e) {
    if (this.top === e)
      this.pop();
    else {
      var t = this.elements.lastIndexOf(e);
      t !== -1 && this.elements.splice(t, 1);
    }
  };
  Y.ElementStack.prototype.clearToContext = function(e) {
    for (var t = this.elements.length - 1; t > 0 && !te(this.elements[t], e); t--)
      ;
    this.elements.length = t + 1, this.top = this.elements[t];
  };
  Y.ElementStack.prototype.contains = function(e) {
    return this.inSpecificScope(e, /* @__PURE__ */ Object.create(null));
  };
  Y.ElementStack.prototype.inSpecificScope = function(e, t) {
    for (var r = this.elements.length - 1; r >= 0; r--) {
      var n = this.elements[r];
      if (te(n, e))
        return true;
      if (te(n, t))
        return false;
    }
    return false;
  };
  Y.ElementStack.prototype.elementInSpecificScope = function(e, t) {
    for (var r = this.elements.length - 1; r >= 0; r--) {
      var n = this.elements[r];
      if (n === e)
        return true;
      if (te(n, t))
        return false;
    }
    return false;
  };
  Y.ElementStack.prototype.elementTypeInSpecificScope = function(e, t) {
    for (var r = this.elements.length - 1; r >= 0; r--) {
      var n = this.elements[r];
      if (n instanceof e)
        return true;
      if (te(n, t))
        return false;
    }
    return false;
  };
  Y.ElementStack.prototype.inScope = function(e) {
    return this.inSpecificScope(e, nt);
  };
  Y.ElementStack.prototype.elementInScope = function(e) {
    return this.elementInSpecificScope(e, nt);
  };
  Y.ElementStack.prototype.elementTypeInScope = function(e) {
    return this.elementTypeInSpecificScope(e, nt);
  };
  Y.ElementStack.prototype.inButtonScope = function(e) {
    return this.inSpecificScope(e, ci);
  };
  Y.ElementStack.prototype.inListItemScope = function(e) {
    return this.inSpecificScope(e, An);
  };
  Y.ElementStack.prototype.inTableScope = function(e) {
    return this.inSpecificScope(e, uc);
  };
  Y.ElementStack.prototype.inSelectScope = function(e) {
    for (var t = this.elements.length - 1; t >= 0; t--) {
      var r = this.elements[t];
      if (r.namespaceURI !== q.HTML)
        return false;
      var n = r.localName;
      if (n === e)
        return true;
      if (n !== "optgroup" && n !== "option")
        return false;
    }
    return false;
  };
  Y.ElementStack.prototype.generateImpliedEndTags = function(e, t) {
    for (var r = t ? cc : oc, n = this.elements.length - 1; n >= 0; n--) {
      var l = this.elements[n];
      if (e && te(l, e) || !te(this.elements[n], r))
        break;
    }
    this.elements.length = n + 1, this.top = this.elements[n];
  };
  Y.ActiveFormattingElements = function() {
    this.list = [], this.attrs = [];
  };
  Y.ActiveFormattingElements.prototype.MARKER = { localName: "|" };
  Y.ActiveFormattingElements.prototype.insertMarker = function() {
    this.list.push(this.MARKER), this.attrs.push(this.MARKER);
  };
  Y.ActiveFormattingElements.prototype.push = function(e, t) {
    for (var r = 0, n = this.list.length - 1; n >= 0 && this.list[n] !== this.MARKER; n--)
      if (_(e, this.list[n], this.attrs[n]) && (r++, r === 3)) {
        this.list.splice(n, 1), this.attrs.splice(n, 1);
        break;
      }
    this.list.push(e);
    for (var l = [], f = 0; f < t.length; f++)
      l[f] = t[f];
    this.attrs.push(l);
    function _(y, w, S) {
      if (y.localName !== w.localName || y._numattrs !== S.length)
        return false;
      for (var M = 0, ae = S.length; M < ae; M++) {
        var ce = S[M][0], g = S[M][1];
        if (!y.hasAttribute(ce) || y.getAttribute(ce) !== g)
          return false;
      }
      return true;
    }
  };
  Y.ActiveFormattingElements.prototype.clearToMarker = function() {
    for (var e = this.list.length - 1; e >= 0 && this.list[e] !== this.MARKER; e--)
      ;
    e < 0 && (e = 0), this.list.length = e, this.attrs.length = e;
  };
  Y.ActiveFormattingElements.prototype.findElementByTag = function(e) {
    for (var t = this.list.length - 1; t >= 0; t--) {
      var r = this.list[t];
      if (r === this.MARKER)
        break;
      if (r.localName === e)
        return r;
    }
    return null;
  };
  Y.ActiveFormattingElements.prototype.indexOf = function(e) {
    return this.list.lastIndexOf(e);
  };
  Y.ActiveFormattingElements.prototype.remove = function(e) {
    var t = this.list.lastIndexOf(e);
    t !== -1 && (this.list.splice(t, 1), this.attrs.splice(t, 1));
  };
  Y.ActiveFormattingElements.prototype.replace = function(e, t, r) {
    var n = this.list.lastIndexOf(e);
    n !== -1 && (this.list[n] = t, this.attrs[n] = r);
  };
  Y.ActiveFormattingElements.prototype.insertAfter = function(e, t) {
    var r = this.list.lastIndexOf(e);
    r !== -1 && (this.list.splice(r, 0, t), this.attrs.splice(r, 0, t));
  };
  function Y(e, t, r) {
    var n = null, l = 0, f = 0, _ = false, y = false, w = 0, S = [], M = "", ae = true, ce = 0, g = j, re, $, V = "", ve = "", U = [], ie = "", be = "", ne = [], qe = [], He = [], Ae = [], Me = [], ft = false, k = Tl, Pe = null, Ge = [], p = new Y.ElementStack(), d = new Y.ActiveFormattingElements(), Xe = t !== void 0, se = null, L = null, c = true;
    t && (c = t.ownerDocument._scripting_enabled), r && r.scripting_enabled === false && (c = false);
    var h = true, m = false, a, o, u = [], b = false, T = false, I = { document: function() {
      return A;
    }, _asDocumentFragment: function() {
      for (var i = A.createDocumentFragment(), s = A.firstChild; s.hasChildNodes(); )
        i.appendChild(s.firstChild);
      return i;
    }, pause: function() {
      ce++;
    }, resume: function() {
      ce--, this.parse("");
    }, parse: function(i, s, x) {
      var E;
      return ce > 0 ? (M += i, true) : (w === 0 ? (M && (i = M + i, M = ""), s && (i += "\uFFFF", _ = true), n = i, l = i.length, f = 0, ae && (ae = false, n.charCodeAt(0) === 65279 && (f = 1)), w++, E = dt(x), M = n.substring(f, l), w--) : (w++, S.push(n, l, f), n = i, l = i.length, f = 0, dt(), E = false, M = n.substring(f, l), f = S.pop(), l = S.pop(), n = S.pop(), M && (n = M + n.substring(f), l = n.length, f = 0, M = ""), w--), E);
    } }, A = new q0(true, e);
    if (A._parser = I, A._scripting_enabled = c, t) {
      if (t.ownerDocument._quirks && (A._quirks = true), t.ownerDocument._limitedQuirks && (A._limitedQuirks = true), t.namespaceURI === q.HTML)
        switch (t.localName) {
          case "title":
          case "textarea":
            g = pt;
            break;
          case "style":
          case "xmp":
          case "iframe":
          case "noembed":
          case "noframes":
          case "script":
          case "plaintext":
            g = Or;
            break;
          case "noscript":
            c && (g = Or);
        }
      var oe = A.createElement("html");
      A._appendChild(oe), p.push(oe), t instanceof ee.HTMLTemplateElement && Ge.push(Yn), sr();
      for (var We = t; We !== null; We = We.parentElement)
        if (We instanceof ee.HTMLFormElement) {
          L = We;
          break;
        }
    }
    function dt(i) {
      for (var s, x, E, v; f < l; ) {
        if (ce > 0 || i && i())
          return true;
        switch (typeof g.lookahead) {
          case "undefined":
            if (s = n.charCodeAt(f++), y && (y = false, s === 10)) {
              f++;
              continue;
            }
            switch (s) {
              case 13:
                f < l ? n.charCodeAt(f) === 10 && f++ : y = true, g(10);
                break;
              case 65535:
                if (_ && f === l) {
                  g(kn);
                  break;
                }
              default:
                g(s);
                break;
            }
            break;
          case "number":
            s = n.charCodeAt(f);
            var N = g.lookahead, P = true;
            if (N < 0 && (P = false, N = -N), N < l - f)
              x = P ? n.substring(f, f + N) : null, v = false;
            else if (_)
              x = P ? n.substring(f, l) : null, v = true, s === 65535 && f === l - 1 && (s = kn);
            else
              return true;
            g(s, x, v);
            break;
          case "string":
            s = n.charCodeAt(f), E = g.lookahead;
            var G = n.indexOf(E, f);
            if (G !== -1)
              x = n.substring(f, G + E.length), v = false;
            else {
              if (!_)
                return true;
              x = n.substring(f, l), s === 65535 && f === l - 1 && (s = kn), v = true;
            }
            g(s, x, v);
            break;
        }
      }
      return false;
    }
    function Be(i, s) {
      for (var x = 0; x < Me.length; x++)
        if (Me[x][0] === i)
          return;
      s !== void 0 ? Me.push([i, s]) : Me.push([i]);
    }
    function kt() {
      Jo.lastIndex = f - 1;
      var i = Jo.exec(n);
      if (!i)
        throw new Error("should never happen");
      var s = i[1];
      if (!s)
        return false;
      var x = i[2], E = x.length;
      switch (x[0]) {
        case '"':
        case "'":
          x = x.substring(1, E - 1), f += i[0].length - 1, g = Un;
          break;
        default:
          g = et, f += i[0].length - 1, x = x.substring(0, E - 1);
          break;
      }
      for (var v = 0; v < Me.length; v++)
        if (Me[v][0] === s)
          return true;
      return Me.push([s, x]), true;
    }
    function Cc() {
      ft = false, V = "", Me.length = 0;
    }
    function rr() {
      ft = true, V = "", Me.length = 0;
    }
    function at() {
      U.length = 0;
    }
    function In() {
      ie = "";
    }
    function On() {
      be = "";
    }
    function hi() {
      ne.length = 0;
    }
    function Bt() {
      qe.length = 0, He = null, Ae = null;
    }
    function Mr() {
      He = [];
    }
    function ht() {
      Ae = [];
    }
    function Q() {
      m = true;
    }
    function Lc() {
      return p.top && p.top.namespaceURI !== "http://www.w3.org/1999/xhtml";
    }
    function Fe(i) {
      return ve === i;
    }
    function Ft() {
      if (u.length > 0) {
        var i = Ce(u);
        if (u.length = 0, T && (T = false, i[0] === `
` && (i = i.substring(1)), i.length === 0))
          return;
        pe(er, i), b = false;
      }
      T = false;
    }
    function nr(i) {
      i.lastIndex = f - 1;
      var s = i.exec(n);
      if (s && s.index === f - 1)
        return s = s[0], f += s.length - 1, _ && f === l && (s = s.slice(0, -1), f--), s;
      throw new Error("should never happen");
    }
    function ar(i) {
      i.lastIndex = f - 1;
      var s = i.exec(n)[0];
      return s ? (Ac(s), f += s.length - 1, true) : false;
    }
    function Ac(i) {
      u.length > 0 && Ft(), !(T && (T = false, i[0] === `
` && (i = i.substring(1)), i.length === 0)) && pe(er, i);
    }
    function it() {
      if (ft)
        pe(W, V);
      else {
        var i = V;
        V = "", ve = i, pe(Ne, i, Me);
      }
    }
    function Mc() {
      if (f === l)
        return false;
      Zo.lastIndex = f;
      var i = Zo.exec(n);
      if (!i)
        throw new Error("should never happen");
      var s = i[2];
      if (!s)
        return false;
      var x = i[1];
      return x ? (f += s.length + 2, pe(W, s)) : (f += s.length + 1, ve = s, pe(Ne, s, B0)), true;
    }
    function Rc() {
      ft ? pe(W, V, null, true) : pe(Ne, V, Me, true);
    }
    function Z() {
      pe(P0, Ce(qe), He ? Ce(He) : void 0, Ae ? Ce(Ae) : void 0);
    }
    function z() {
      Ft(), k(kn), A.modclock = 1;
    }
    var pe = I.insertToken = function(s, x, E, v) {
      Ft();
      var N = p.top;
      !N || N.namespaceURI === q.HTML ? k(s, x, E, v) : s !== Ne && s !== er ? Li(s, x, E, v) : ec(N) && (s === er || s === Ne && x !== "mglyph" && x !== "malignmark") || s === Ne && x === "svg" && N.namespaceURI === q.MATHML && N.localName === "annotation-xml" || tc(N) ? (o = true, k(s, x, E, v), o = false) : Li(s, x, E, v);
    };
    function Qe(i) {
      var s = p.top;
      xt && te(s, tr) ? Dr(function(x) {
        return x.createComment(i);
      }) : (s instanceof ee.HTMLTemplateElement && (s = s.content), s._appendChild(s.ownerDocument.createComment(i)));
    }
    function Ze(i) {
      var s = p.top;
      if (xt && te(s, tr))
        Dr(function(E) {
          return E.createTextNode(i);
        });
      else {
        s instanceof ee.HTMLTemplateElement && (s = s.content);
        var x = s.lastChild;
        x && x.nodeType === ni.TEXT_NODE ? x.appendData(i) : s._appendChild(s.ownerDocument.createTextNode(i));
      }
    }
    function ir(i, s, x) {
      var E = ic.createElement(i, s, null);
      if (x)
        for (var v = 0, N = x.length; v < N; v++)
          E._setAttribute(x[v][0], x[v][1]);
      return E;
    }
    var xt = false;
    function F(i, s) {
      var x = Rr(function(E) {
        return ir(E, i, s);
      });
      return te(x, lc) && (x._form = L), x;
    }
    function Rr(i) {
      var s;
      return xt && te(p.top, tr) ? s = Dr(i) : p.top instanceof ee.HTMLTemplateElement ? (s = i(p.top.content.ownerDocument), p.top.content._appendChild(s)) : (s = i(p.top.ownerDocument), p.top._appendChild(s)), p.push(s), s;
    }
    function qn(i, s, x) {
      return Rr(function(E) {
        var v = E._createElementNS(i, x, null);
        if (s)
          for (var N = 0, P = s.length; N < P; N++) {
            var G = s[N];
            G.length === 2 ? v._setAttribute(G[0], G[1]) : v._setAttributeNS(G[2], G[0], G[1]);
          }
        return v;
      });
    }
    function xi(i) {
      for (var s = p.elements.length - 1; s >= 0; s--)
        if (p.elements[s] instanceof i)
          return s;
      return -1;
    }
    function Dr(i) {
      var s, x, E = -1, v = -1, N;
      if (E = xi(ee.HTMLTableElement), v = xi(ee.HTMLTemplateElement), v >= 0 && (E < 0 || v > E) ? s = p.elements[v] : E >= 0 && (s = p.elements[E].parentNode, s ? x = p.elements[E] : s = p.elements[E - 1]), s || (s = p.elements[0]), s instanceof ee.HTMLTemplateElement && (s = s.content), N = i(s.ownerDocument), N.nodeType === ni.TEXT_NODE) {
        var P;
        if (x ? P = x.previousSibling : P = s.lastChild, P && P.nodeType === ni.TEXT_NODE)
          return P.appendData(N.data), N;
      }
      return x ? s.insertBefore(N, x) : s._appendChild(N), N;
    }
    function sr() {
      for (var i = false, s = p.elements.length - 1; s >= 0; s--) {
        var x = p.elements[s];
        if (s === 0 && (i = true, Xe && (x = t)), x.namespaceURI === q.HTML) {
          var E = x.localName;
          switch (E) {
            case "select":
              for (var v = s; v > 0; ) {
                var N = p.elements[--v];
                if (N instanceof ee.HTMLTemplateElement)
                  break;
                if (N instanceof ee.HTMLTableElement) {
                  k = Yr;
                  return;
                }
              }
              k = st;
              return;
            case "tr":
              k = ur;
              return;
            case "tbody":
            case "tfoot":
            case "thead":
              k = Lt;
              return;
            case "caption":
              k = Wn;
              return;
            case "colgroup":
              k = Wr;
              return;
            case "table":
              k = Ue;
              return;
            case "template":
              k = Ge[Ge.length - 1];
              return;
            case "body":
              k = H;
              return;
            case "frameset":
              k = $n;
              return;
            case "html":
              se === null ? k = jr : k = Gn;
              return;
            default:
              if (!i) {
                if (E === "head") {
                  k = de;
                  return;
                }
                if (E === "td" || E === "th") {
                  k = Ut;
                  return;
                }
              }
          }
        }
        if (i) {
          k = H;
          return;
        }
      }
    }
    function or(i, s) {
      F(i, s), g = cr, Pe = k, k = Gr;
    }
    function Dc(i, s) {
      F(i, s), g = pt, Pe = k, k = Gr;
    }
    function Hn(i, s) {
      return { elt: ir(i, d.list[s].localName, d.attrs[s]), attrs: d.attrs[s] };
    }
    function Le() {
      if (d.list.length !== 0) {
        var i = d.list[d.list.length - 1];
        if (i !== d.MARKER && p.elements.lastIndexOf(i) === -1) {
          for (var s = d.list.length - 2; s >= 0 && (i = d.list[s], !(i === d.MARKER || p.elements.lastIndexOf(i) !== -1)); s--)
            ;
          for (s = s + 1; s < d.list.length; s++) {
            var x = Rr(function(E) {
              return Hn(E, s).elt;
            });
            d.list[s] = x;
          }
        }
      }
    }
    var Ir = { localName: "BM" };
    function Ic(i) {
      if (te(p.top, i) && d.indexOf(p.top) === -1)
        return p.pop(), true;
      for (var s = 0; s < 8; ) {
        s++;
        var x = d.findElementByTag(i);
        if (!x)
          return false;
        var E = p.elements.lastIndexOf(x);
        if (E === -1)
          return d.remove(x), true;
        if (!p.elementInScope(x))
          return true;
        for (var v = null, N, P = E + 1; P < p.elements.length; P++)
          if (te(p.elements[P], Pt)) {
            v = p.elements[P], N = P;
            break;
          }
        if (v) {
          var G = p.elements[E - 1];
          d.insertAfter(x, Ir);
          for (var ue = v, ye = v, Ve = N, Ye, At = 0; At++, ue = p.elements[--Ve], ue !== x; ) {
            if (Ye = d.indexOf(ue), At > 3 && Ye !== -1 && (d.remove(ue), Ye = -1), Ye === -1) {
              p.removeElement(ue);
              continue;
            }
            var Et = Hn(G.ownerDocument, Ye);
            d.replace(ue, Et.elt, Et.attrs), p.elements[Ve] = Et.elt, ue = Et.elt, ye === v && (d.remove(Ir), d.insertAfter(Et.elt, Ir)), ue._appendChild(ye), ye = ue;
          }
          xt && te(G, tr) ? Dr(function() {
            return ye;
          }) : G instanceof ee.HTMLTemplateElement ? G.content._appendChild(ye) : G._appendChild(ye);
          for (var fr = Hn(v.ownerDocument, d.indexOf(x)); v.hasChildNodes(); )
            fr.elt._appendChild(v.firstChild);
          v._appendChild(fr.elt), d.remove(x), d.replace(Ir, fr.elt, fr.attrs), p.removeElement(x);
          var Cl = p.elements.lastIndexOf(v);
          p.elements.splice(Cl + 1, 0, fr.elt);
        } else
          return p.popElement(x), d.remove(x), true;
      }
      return true;
    }
    function Oc() {
      p.pop(), k = Pe;
    }
    function St() {
      delete A._parser, p.elements.length = 0, A.defaultView && A.defaultView.dispatchEvent(new ee.Event("load", {}));
    }
    function D(i, s) {
      g = s, f--;
    }
    function j(i) {
      switch (i) {
        case 38:
          re = j, g = lr;
          break;
        case 60:
          if (Mc())
            break;
          g = qc;
          break;
        case 0:
          u.push(i), b = true;
          break;
        case -1:
          z();
          break;
        default:
          ar(Z0) || u.push(i);
          break;
      }
    }
    function pt(i) {
      switch (i) {
        case 38:
          re = pt, g = lr;
          break;
        case 60:
          g = Pc;
          break;
        case 0:
          u.push(65533), b = true;
          break;
        case -1:
          z();
          break;
        default:
          u.push(i);
          break;
      }
    }
    function cr(i) {
      switch (i) {
        case 60:
          g = Uc;
          break;
        case 0:
          u.push(65533);
          break;
        case -1:
          z();
          break;
        default:
          ar(Qo) || u.push(i);
          break;
      }
    }
    function mt(i) {
      switch (i) {
        case 60:
          g = jc;
          break;
        case 0:
          u.push(65533);
          break;
        case -1:
          z();
          break;
        default:
          ar(Qo) || u.push(i);
          break;
      }
    }
    function Or(i) {
      switch (i) {
        case 0:
          u.push(65533);
          break;
        case -1:
          z();
          break;
        default:
          ar(J0) || u.push(i);
          break;
      }
    }
    function qc(i) {
      switch (i) {
        case 33:
          g = bi;
          break;
        case 47:
          g = Hc;
          break;
        case 65:
        case 66:
        case 67:
        case 68:
        case 69:
        case 70:
        case 71:
        case 72:
        case 73:
        case 74:
        case 75:
        case 76:
        case 77:
        case 78:
        case 79:
        case 80:
        case 81:
        case 82:
        case 83:
        case 84:
        case 85:
        case 86:
        case 87:
        case 88:
        case 89:
        case 90:
        case 97:
        case 98:
        case 99:
        case 100:
        case 101:
        case 102:
        case 103:
        case 104:
        case 105:
        case 106:
        case 107:
        case 108:
        case 109:
        case 110:
        case 111:
        case 112:
        case 113:
        case 114:
        case 115:
        case 116:
        case 117:
        case 118:
        case 119:
        case 120:
        case 121:
        case 122:
          Cc(), D(i, pi);
          break;
        case 63:
          D(i, Br);
          break;
        default:
          u.push(60), D(i, j);
          break;
      }
    }
    function Hc(i) {
      switch (i) {
        case 65:
        case 66:
        case 67:
        case 68:
        case 69:
        case 70:
        case 71:
        case 72:
        case 73:
        case 74:
        case 75:
        case 76:
        case 77:
        case 78:
        case 79:
        case 80:
        case 81:
        case 82:
        case 83:
        case 84:
        case 85:
        case 86:
        case 87:
        case 88:
        case 89:
        case 90:
        case 97:
        case 98:
        case 99:
        case 100:
        case 101:
        case 102:
        case 103:
        case 104:
        case 105:
        case 106:
        case 107:
        case 108:
        case 109:
        case 110:
        case 111:
        case 112:
        case 113:
        case 114:
        case 115:
        case 116:
        case 117:
        case 118:
        case 119:
        case 120:
        case 121:
        case 122:
          rr(), D(i, pi);
          break;
        case 62:
          g = j;
          break;
        case -1:
          u.push(60), u.push(47), z();
          break;
        default:
          D(i, Br);
          break;
      }
    }
    function pi(i) {
      switch (i) {
        case 9:
        case 10:
        case 12:
        case 32:
          g = et;
          break;
        case 47:
          g = bt;
          break;
        case 62:
          g = j, it();
          break;
        case 65:
        case 66:
        case 67:
        case 68:
        case 69:
        case 70:
        case 71:
        case 72:
        case 73:
        case 74:
        case 75:
        case 76:
        case 77:
        case 78:
        case 79:
        case 80:
        case 81:
        case 82:
        case 83:
        case 84:
        case 85:
        case 86:
        case 87:
        case 88:
        case 89:
        case 90:
          V += String.fromCharCode(i + 32);
          break;
        case 0:
          V += String.fromCharCode(65533);
          break;
        case -1:
          z();
          break;
        default:
          V += nr(K0);
          break;
      }
    }
    function Pc(i) {
      i === 47 ? (at(), g = Bc) : (u.push(60), D(i, pt));
    }
    function Bc(i) {
      switch (i) {
        case 65:
        case 66:
        case 67:
        case 68:
        case 69:
        case 70:
        case 71:
        case 72:
        case 73:
        case 74:
        case 75:
        case 76:
        case 77:
        case 78:
        case 79:
        case 80:
        case 81:
        case 82:
        case 83:
        case 84:
        case 85:
        case 86:
        case 87:
        case 88:
        case 89:
        case 90:
        case 97:
        case 98:
        case 99:
        case 100:
        case 101:
        case 102:
        case 103:
        case 104:
        case 105:
        case 106:
        case 107:
        case 108:
        case 109:
        case 110:
        case 111:
        case 112:
        case 113:
        case 114:
        case 115:
        case 116:
        case 117:
        case 118:
        case 119:
        case 120:
        case 121:
        case 122:
          rr(), D(i, Fc);
          break;
        default:
          u.push(60), u.push(47), D(i, pt);
          break;
      }
    }
    function Fc(i) {
      switch (i) {
        case 9:
        case 10:
        case 12:
        case 32:
          if (Fe(V)) {
            g = et;
            return;
          }
          break;
        case 47:
          if (Fe(V)) {
            g = bt;
            return;
          }
          break;
        case 62:
          if (Fe(V)) {
            g = j, it();
            return;
          }
          break;
        case 65:
        case 66:
        case 67:
        case 68:
        case 69:
        case 70:
        case 71:
        case 72:
        case 73:
        case 74:
        case 75:
        case 76:
        case 77:
        case 78:
        case 79:
        case 80:
        case 81:
        case 82:
        case 83:
        case 84:
        case 85:
        case 86:
        case 87:
        case 88:
        case 89:
        case 90:
          V += String.fromCharCode(i + 32), U.push(i);
          return;
        case 97:
        case 98:
        case 99:
        case 100:
        case 101:
        case 102:
        case 103:
        case 104:
        case 105:
        case 106:
        case 107:
        case 108:
        case 109:
        case 110:
        case 111:
        case 112:
        case 113:
        case 114:
        case 115:
        case 116:
        case 117:
        case 118:
        case 119:
        case 120:
        case 121:
        case 122:
          V += String.fromCharCode(i), U.push(i);
          return;
      }
      u.push(60), u.push(47), qt(u, U), D(i, pt);
    }
    function Uc(i) {
      i === 47 ? (at(), g = Vc) : (u.push(60), D(i, cr));
    }
    function Vc(i) {
      switch (i) {
        case 65:
        case 66:
        case 67:
        case 68:
        case 69:
        case 70:
        case 71:
        case 72:
        case 73:
        case 74:
        case 75:
        case 76:
        case 77:
        case 78:
        case 79:
        case 80:
        case 81:
        case 82:
        case 83:
        case 84:
        case 85:
        case 86:
        case 87:
        case 88:
        case 89:
        case 90:
        case 97:
        case 98:
        case 99:
        case 100:
        case 101:
        case 102:
        case 103:
        case 104:
        case 105:
        case 106:
        case 107:
        case 108:
        case 109:
        case 110:
        case 111:
        case 112:
        case 113:
        case 114:
        case 115:
        case 116:
        case 117:
        case 118:
        case 119:
        case 120:
        case 121:
        case 122:
          rr(), D(i, zc);
          break;
        default:
          u.push(60), u.push(47), D(i, cr);
          break;
      }
    }
    function zc(i) {
      switch (i) {
        case 9:
        case 10:
        case 12:
        case 32:
          if (Fe(V)) {
            g = et;
            return;
          }
          break;
        case 47:
          if (Fe(V)) {
            g = bt;
            return;
          }
          break;
        case 62:
          if (Fe(V)) {
            g = j, it();
            return;
          }
          break;
        case 65:
        case 66:
        case 67:
        case 68:
        case 69:
        case 70:
        case 71:
        case 72:
        case 73:
        case 74:
        case 75:
        case 76:
        case 77:
        case 78:
        case 79:
        case 80:
        case 81:
        case 82:
        case 83:
        case 84:
        case 85:
        case 86:
        case 87:
        case 88:
        case 89:
        case 90:
          V += String.fromCharCode(i + 32), U.push(i);
          return;
        case 97:
        case 98:
        case 99:
        case 100:
        case 101:
        case 102:
        case 103:
        case 104:
        case 105:
        case 106:
        case 107:
        case 108:
        case 109:
        case 110:
        case 111:
        case 112:
        case 113:
        case 114:
        case 115:
        case 116:
        case 117:
        case 118:
        case 119:
        case 120:
        case 121:
        case 122:
          V += String.fromCharCode(i), U.push(i);
          return;
      }
      u.push(60), u.push(47), qt(u, U), D(i, cr);
    }
    function jc(i) {
      switch (i) {
        case 47:
          at(), g = Gc;
          break;
        case 33:
          g = Yc, u.push(60), u.push(33);
          break;
        default:
          u.push(60), D(i, mt);
          break;
      }
    }
    function Gc(i) {
      switch (i) {
        case 65:
        case 66:
        case 67:
        case 68:
        case 69:
        case 70:
        case 71:
        case 72:
        case 73:
        case 74:
        case 75:
        case 76:
        case 77:
        case 78:
        case 79:
        case 80:
        case 81:
        case 82:
        case 83:
        case 84:
        case 85:
        case 86:
        case 87:
        case 88:
        case 89:
        case 90:
        case 97:
        case 98:
        case 99:
        case 100:
        case 101:
        case 102:
        case 103:
        case 104:
        case 105:
        case 106:
        case 107:
        case 108:
        case 109:
        case 110:
        case 111:
        case 112:
        case 113:
        case 114:
        case 115:
        case 116:
        case 117:
        case 118:
        case 119:
        case 120:
        case 121:
        case 122:
          rr(), D(i, Wc);
          break;
        default:
          u.push(60), u.push(47), D(i, mt);
          break;
      }
    }
    function Wc(i) {
      switch (i) {
        case 9:
        case 10:
        case 12:
        case 32:
          if (Fe(V)) {
            g = et;
            return;
          }
          break;
        case 47:
          if (Fe(V)) {
            g = bt;
            return;
          }
          break;
        case 62:
          if (Fe(V)) {
            g = j, it();
            return;
          }
          break;
        case 65:
        case 66:
        case 67:
        case 68:
        case 69:
        case 70:
        case 71:
        case 72:
        case 73:
        case 74:
        case 75:
        case 76:
        case 77:
        case 78:
        case 79:
        case 80:
        case 81:
        case 82:
        case 83:
        case 84:
        case 85:
        case 86:
        case 87:
        case 88:
        case 89:
        case 90:
          V += String.fromCharCode(i + 32), U.push(i);
          return;
        case 97:
        case 98:
        case 99:
        case 100:
        case 101:
        case 102:
        case 103:
        case 104:
        case 105:
        case 106:
        case 107:
        case 108:
        case 109:
        case 110:
        case 111:
        case 112:
        case 113:
        case 114:
        case 115:
        case 116:
        case 117:
        case 118:
        case 119:
        case 120:
        case 121:
        case 122:
          V += String.fromCharCode(i), U.push(i);
          return;
      }
      u.push(60), u.push(47), qt(u, U), D(i, mt);
    }
    function Yc(i) {
      i === 45 ? (g = $c, u.push(45)) : D(i, mt);
    }
    function $c(i) {
      i === 45 ? (g = mi, u.push(45)) : D(i, mt);
    }
    function Je(i) {
      switch (i) {
        case 45:
          g = Kc, u.push(45);
          break;
        case 60:
          g = Pn;
          break;
        case 0:
          u.push(65533);
          break;
        case -1:
          z();
          break;
        default:
          u.push(i);
          break;
      }
    }
    function Kc(i) {
      switch (i) {
        case 45:
          g = mi, u.push(45);
          break;
        case 60:
          g = Pn;
          break;
        case 0:
          g = Je, u.push(65533);
          break;
        case -1:
          z();
          break;
        default:
          g = Je, u.push(i);
          break;
      }
    }
    function mi(i) {
      switch (i) {
        case 45:
          u.push(45);
          break;
        case 60:
          g = Pn;
          break;
        case 62:
          g = mt, u.push(62);
          break;
        case 0:
          g = Je, u.push(65533);
          break;
        case -1:
          z();
          break;
        default:
          g = Je, u.push(i);
          break;
      }
    }
    function Pn(i) {
      switch (i) {
        case 47:
          at(), g = Xc;
          break;
        case 65:
        case 66:
        case 67:
        case 68:
        case 69:
        case 70:
        case 71:
        case 72:
        case 73:
        case 74:
        case 75:
        case 76:
        case 77:
        case 78:
        case 79:
        case 80:
        case 81:
        case 82:
        case 83:
        case 84:
        case 85:
        case 86:
        case 87:
        case 88:
        case 89:
        case 90:
        case 97:
        case 98:
        case 99:
        case 100:
        case 101:
        case 102:
        case 103:
        case 104:
        case 105:
        case 106:
        case 107:
        case 108:
        case 109:
        case 110:
        case 111:
        case 112:
        case 113:
        case 114:
        case 115:
        case 116:
        case 117:
        case 118:
        case 119:
        case 120:
        case 121:
        case 122:
          at(), u.push(60), D(i, Zc);
          break;
        default:
          u.push(60), D(i, Je);
          break;
      }
    }
    function Xc(i) {
      switch (i) {
        case 65:
        case 66:
        case 67:
        case 68:
        case 69:
        case 70:
        case 71:
        case 72:
        case 73:
        case 74:
        case 75:
        case 76:
        case 77:
        case 78:
        case 79:
        case 80:
        case 81:
        case 82:
        case 83:
        case 84:
        case 85:
        case 86:
        case 87:
        case 88:
        case 89:
        case 90:
        case 97:
        case 98:
        case 99:
        case 100:
        case 101:
        case 102:
        case 103:
        case 104:
        case 105:
        case 106:
        case 107:
        case 108:
        case 109:
        case 110:
        case 111:
        case 112:
        case 113:
        case 114:
        case 115:
        case 116:
        case 117:
        case 118:
        case 119:
        case 120:
        case 121:
        case 122:
          rr(), D(i, Qc);
          break;
        default:
          u.push(60), u.push(47), D(i, Je);
          break;
      }
    }
    function Qc(i) {
      switch (i) {
        case 9:
        case 10:
        case 12:
        case 32:
          if (Fe(V)) {
            g = et;
            return;
          }
          break;
        case 47:
          if (Fe(V)) {
            g = bt;
            return;
          }
          break;
        case 62:
          if (Fe(V)) {
            g = j, it();
            return;
          }
          break;
        case 65:
        case 66:
        case 67:
        case 68:
        case 69:
        case 70:
        case 71:
        case 72:
        case 73:
        case 74:
        case 75:
        case 76:
        case 77:
        case 78:
        case 79:
        case 80:
        case 81:
        case 82:
        case 83:
        case 84:
        case 85:
        case 86:
        case 87:
        case 88:
        case 89:
        case 90:
          V += String.fromCharCode(i + 32), U.push(i);
          return;
        case 97:
        case 98:
        case 99:
        case 100:
        case 101:
        case 102:
        case 103:
        case 104:
        case 105:
        case 106:
        case 107:
        case 108:
        case 109:
        case 110:
        case 111:
        case 112:
        case 113:
        case 114:
        case 115:
        case 116:
        case 117:
        case 118:
        case 119:
        case 120:
        case 121:
        case 122:
          V += String.fromCharCode(i), U.push(i);
          return;
      }
      u.push(60), u.push(47), qt(u, U), D(i, Je);
    }
    function Zc(i) {
      switch (i) {
        case 9:
        case 10:
        case 12:
        case 32:
        case 47:
        case 62:
          Ce(U) === "script" ? g = gt : g = Je, u.push(i);
          break;
        case 65:
        case 66:
        case 67:
        case 68:
        case 69:
        case 70:
        case 71:
        case 72:
        case 73:
        case 74:
        case 75:
        case 76:
        case 77:
        case 78:
        case 79:
        case 80:
        case 81:
        case 82:
        case 83:
        case 84:
        case 85:
        case 86:
        case 87:
        case 88:
        case 89:
        case 90:
          U.push(i + 32), u.push(i);
          break;
        case 97:
        case 98:
        case 99:
        case 100:
        case 101:
        case 102:
        case 103:
        case 104:
        case 105:
        case 106:
        case 107:
        case 108:
        case 109:
        case 110:
        case 111:
        case 112:
        case 113:
        case 114:
        case 115:
        case 116:
        case 117:
        case 118:
        case 119:
        case 120:
        case 121:
        case 122:
          U.push(i), u.push(i);
          break;
        default:
          D(i, Je);
          break;
      }
    }
    function gt(i) {
      switch (i) {
        case 45:
          g = Jc, u.push(45);
          break;
        case 60:
          g = Bn, u.push(60);
          break;
        case 0:
          u.push(65533);
          break;
        case -1:
          z();
          break;
        default:
          u.push(i);
          break;
      }
    }
    function Jc(i) {
      switch (i) {
        case 45:
          g = el, u.push(45);
          break;
        case 60:
          g = Bn, u.push(60);
          break;
        case 0:
          g = gt, u.push(65533);
          break;
        case -1:
          z();
          break;
        default:
          g = gt, u.push(i);
          break;
      }
    }
    function el(i) {
      switch (i) {
        case 45:
          u.push(45);
          break;
        case 60:
          g = Bn, u.push(60);
          break;
        case 62:
          g = mt, u.push(62);
          break;
        case 0:
          g = gt, u.push(65533);
          break;
        case -1:
          z();
          break;
        default:
          g = gt, u.push(i);
          break;
      }
    }
    function Bn(i) {
      i === 47 ? (at(), g = tl, u.push(47)) : D(i, gt);
    }
    function tl(i) {
      switch (i) {
        case 9:
        case 10:
        case 12:
        case 32:
        case 47:
        case 62:
          Ce(U) === "script" ? g = Je : g = gt, u.push(i);
          break;
        case 65:
        case 66:
        case 67:
        case 68:
        case 69:
        case 70:
        case 71:
        case 72:
        case 73:
        case 74:
        case 75:
        case 76:
        case 77:
        case 78:
        case 79:
        case 80:
        case 81:
        case 82:
        case 83:
        case 84:
        case 85:
        case 86:
        case 87:
        case 88:
        case 89:
        case 90:
          U.push(i + 32), u.push(i);
          break;
        case 97:
        case 98:
        case 99:
        case 100:
        case 101:
        case 102:
        case 103:
        case 104:
        case 105:
        case 106:
        case 107:
        case 108:
        case 109:
        case 110:
        case 111:
        case 112:
        case 113:
        case 114:
        case 115:
        case 116:
        case 117:
        case 118:
        case 119:
        case 120:
        case 121:
        case 122:
          U.push(i), u.push(i);
          break;
        default:
          D(i, gt);
          break;
      }
    }
    function et(i) {
      switch (i) {
        case 9:
        case 10:
        case 12:
        case 32:
          break;
        case 47:
          g = bt;
          break;
        case 62:
          g = j, it();
          break;
        case -1:
          z();
          break;
        case 61:
          In(), ie += String.fromCharCode(i), g = Fn;
          break;
        default:
          if (kt())
            break;
          In(), D(i, Fn);
          break;
      }
    }
    function Fn(i) {
      switch (i) {
        case 9:
        case 10:
        case 12:
        case 32:
        case 47:
        case 62:
        case -1:
          D(i, rl);
          break;
        case 61:
          g = gi;
          break;
        case 65:
        case 66:
        case 67:
        case 68:
        case 69:
        case 70:
        case 71:
        case 72:
        case 73:
        case 74:
        case 75:
        case 76:
        case 77:
        case 78:
        case 79:
        case 80:
        case 81:
        case 82:
        case 83:
        case 84:
        case 85:
        case 86:
        case 87:
        case 88:
        case 89:
        case 90:
          ie += String.fromCharCode(i + 32);
          break;
        case 0:
          ie += String.fromCharCode(65533);
          break;
        case 34:
        case 39:
        case 60:
        default:
          ie += nr(X0);
          break;
      }
    }
    function rl(i) {
      switch (i) {
        case 9:
        case 10:
        case 12:
        case 32:
          break;
        case 47:
          Be(ie), g = bt;
          break;
        case 61:
          g = gi;
          break;
        case 62:
          g = j, Be(ie), it();
          break;
        case -1:
          Be(ie), z();
          break;
        default:
          Be(ie), In(), D(i, Fn);
          break;
      }
    }
    function gi(i) {
      switch (i) {
        case 9:
        case 10:
        case 12:
        case 32:
          break;
        case 34:
          On(), g = qr;
          break;
        case 39:
          On(), g = Hr;
          break;
        case 62:
        default:
          On(), D(i, Pr);
          break;
      }
    }
    function qr(i) {
      switch (i) {
        case 34:
          Be(ie, be), g = Un;
          break;
        case 38:
          re = qr, g = lr;
          break;
        case 0:
          be += String.fromCharCode(65533);
          break;
        case -1:
          z();
          break;
        case 10:
          be += String.fromCharCode(i);
          break;
        default:
          be += nr(W0);
          break;
      }
    }
    function Hr(i) {
      switch (i) {
        case 39:
          Be(ie, be), g = Un;
          break;
        case 38:
          re = Hr, g = lr;
          break;
        case 0:
          be += String.fromCharCode(65533);
          break;
        case -1:
          z();
          break;
        case 10:
          be += String.fromCharCode(i);
          break;
        default:
          be += nr(Y0);
          break;
      }
    }
    function Pr(i) {
      switch (i) {
        case 9:
        case 10:
        case 12:
        case 32:
          Be(ie, be), g = et;
          break;
        case 38:
          re = Pr, g = lr;
          break;
        case 62:
          Be(ie, be), g = j, it();
          break;
        case 0:
          be += String.fromCharCode(65533);
          break;
        case -1:
          f--, g = j;
          break;
        case 34:
        case 39:
        case 60:
        case 61:
        case 96:
        default:
          be += nr($0);
          break;
      }
    }
    function Un(i) {
      switch (i) {
        case 9:
        case 10:
        case 12:
        case 32:
          g = et;
          break;
        case 47:
          g = bt;
          break;
        case 62:
          g = j, it();
          break;
        case -1:
          z();
          break;
        default:
          D(i, et);
          break;
      }
    }
    function bt(i) {
      switch (i) {
        case 62:
          g = j, Rc();
          break;
        case -1:
          z();
          break;
        default:
          D(i, et);
          break;
      }
    }
    function Br(i, s, x) {
      var E = s.length;
      x ? f += E - 1 : f += E;
      var v = s.substring(0, E - 1);
      v = v.replace(/\u0000/g, "\uFFFD"), v = v.replace(/\u000D\u000A/g, `
`), v = v.replace(/\u000D/g, `
`), pe(rt, v), g = j;
    }
    Br.lookahead = ">";
    function bi(i, s, x) {
      if (s[0] === "-" && s[1] === "-") {
        f += 2, hi(), g = nl;
        return;
      }
      s.toUpperCase() === "DOCTYPE" ? (f += 7, g = ul) : s === "[CDATA[" && Lc() ? (f += 7, g = jn) : g = Br;
    }
    bi.lookahead = 7;
    function nl(i) {
      switch (hi(), i) {
        case 45:
          g = al;
          break;
        case 62:
          g = j, pe(rt, Ce(ne));
          break;
        default:
          D(i, Nt);
          break;
      }
    }
    function al(i) {
      switch (i) {
        case 45:
          g = Fr;
          break;
        case 62:
          g = j, pe(rt, Ce(ne));
          break;
        case -1:
          pe(rt, Ce(ne)), z();
          break;
        default:
          ne.push(45), D(i, Nt);
          break;
      }
    }
    function Nt(i) {
      switch (i) {
        case 60:
          ne.push(i), g = il;
          break;
        case 45:
          g = Vn;
          break;
        case 0:
          ne.push(65533);
          break;
        case -1:
          pe(rt, Ce(ne)), z();
          break;
        default:
          ne.push(i);
          break;
      }
    }
    function il(i) {
      switch (i) {
        case 33:
          ne.push(i), g = sl;
          break;
        case 60:
          ne.push(i);
          break;
        default:
          D(i, Nt);
          break;
      }
    }
    function sl(i) {
      switch (i) {
        case 45:
          g = ol;
          break;
        default:
          D(i, Nt);
          break;
      }
    }
    function ol(i) {
      switch (i) {
        case 45:
          g = cl;
          break;
        default:
          D(i, Vn);
          break;
      }
    }
    function cl(i) {
      switch (i) {
        case 62:
        case -1:
          D(i, Fr);
          break;
        default:
          D(i, Fr);
          break;
      }
    }
    function Vn(i) {
      switch (i) {
        case 45:
          g = Fr;
          break;
        case -1:
          pe(rt, Ce(ne)), z();
          break;
        default:
          ne.push(45), D(i, Nt);
          break;
      }
    }
    function Fr(i) {
      switch (i) {
        case 62:
          g = j, pe(rt, Ce(ne));
          break;
        case 33:
          g = ll;
          break;
        case 45:
          ne.push(45);
          break;
        case -1:
          pe(rt, Ce(ne)), z();
          break;
        default:
          ne.push(45), ne.push(45), D(i, Nt);
          break;
      }
    }
    function ll(i) {
      switch (i) {
        case 45:
          ne.push(45), ne.push(45), ne.push(33), g = Vn;
          break;
        case 62:
          g = j, pe(rt, Ce(ne));
          break;
        case -1:
          pe(rt, Ce(ne)), z();
          break;
        default:
          ne.push(45), ne.push(45), ne.push(33), D(i, Nt);
          break;
      }
    }
    function ul(i) {
      switch (i) {
        case 9:
        case 10:
        case 12:
        case 32:
          g = _i;
          break;
        case -1:
          Bt(), Q(), Z(), z();
          break;
        default:
          D(i, _i);
          break;
      }
    }
    function _i(i) {
      switch (i) {
        case 9:
        case 10:
        case 12:
        case 32:
          break;
        case 65:
        case 66:
        case 67:
        case 68:
        case 69:
        case 70:
        case 71:
        case 72:
        case 73:
        case 74:
        case 75:
        case 76:
        case 77:
        case 78:
        case 79:
        case 80:
        case 81:
        case 82:
        case 83:
        case 84:
        case 85:
        case 86:
        case 87:
        case 88:
        case 89:
        case 90:
          Bt(), qe.push(i + 32), g = zn;
          break;
        case 0:
          Bt(), qe.push(65533), g = zn;
          break;
        case 62:
          Bt(), Q(), g = j, Z();
          break;
        case -1:
          Bt(), Q(), Z(), z();
          break;
        default:
          Bt(), qe.push(i), g = zn;
          break;
      }
    }
    function zn(i) {
      switch (i) {
        case 9:
        case 10:
        case 12:
        case 32:
          g = Ei;
          break;
        case 62:
          g = j, Z();
          break;
        case 65:
        case 66:
        case 67:
        case 68:
        case 69:
        case 70:
        case 71:
        case 72:
        case 73:
        case 74:
        case 75:
        case 76:
        case 77:
        case 78:
        case 79:
        case 80:
        case 81:
        case 82:
        case 83:
        case 84:
        case 85:
        case 86:
        case 87:
        case 88:
        case 89:
        case 90:
          qe.push(i + 32);
          break;
        case 0:
          qe.push(65533);
          break;
        case -1:
          Q(), Z(), z();
          break;
        default:
          qe.push(i);
          break;
      }
    }
    function Ei(i, s, x) {
      switch (i) {
        case 9:
        case 10:
        case 12:
        case 32:
          f += 1;
          break;
        case 62:
          g = j, f += 1, Z();
          break;
        case -1:
          Q(), Z(), z();
          break;
        default:
          s = s.toUpperCase(), s === "PUBLIC" ? (f += 6, g = fl) : s === "SYSTEM" ? (f += 6, g = xl) : (Q(), g = _t);
          break;
      }
    }
    Ei.lookahead = 6;
    function fl(i) {
      switch (i) {
        case 9:
        case 10:
        case 12:
        case 32:
          g = dl;
          break;
        case 34:
          Mr(), g = vi;
          break;
        case 39:
          Mr(), g = yi;
          break;
        case 62:
          Q(), g = j, Z();
          break;
        case -1:
          Q(), Z(), z();
          break;
        default:
          Q(), g = _t;
          break;
      }
    }
    function dl(i) {
      switch (i) {
        case 9:
        case 10:
        case 12:
        case 32:
          break;
        case 34:
          Mr(), g = vi;
          break;
        case 39:
          Mr(), g = yi;
          break;
        case 62:
          Q(), g = j, Z();
          break;
        case -1:
          Q(), Z(), z();
          break;
        default:
          Q(), g = _t;
          break;
      }
    }
    function vi(i) {
      switch (i) {
        case 34:
          g = Ti;
          break;
        case 0:
          He.push(65533);
          break;
        case 62:
          Q(), g = j, Z();
          break;
        case -1:
          Q(), Z(), z();
          break;
        default:
          He.push(i);
          break;
      }
    }
    function yi(i) {
      switch (i) {
        case 39:
          g = Ti;
          break;
        case 0:
          He.push(65533);
          break;
        case 62:
          Q(), g = j, Z();
          break;
        case -1:
          Q(), Z(), z();
          break;
        default:
          He.push(i);
          break;
      }
    }
    function Ti(i) {
      switch (i) {
        case 9:
        case 10:
        case 12:
        case 32:
          g = hl;
          break;
        case 62:
          g = j, Z();
          break;
        case 34:
          ht(), g = Ur;
          break;
        case 39:
          ht(), g = Vr;
          break;
        case -1:
          Q(), Z(), z();
          break;
        default:
          Q(), g = _t;
          break;
      }
    }
    function hl(i) {
      switch (i) {
        case 9:
        case 10:
        case 12:
        case 32:
          break;
        case 62:
          g = j, Z();
          break;
        case 34:
          ht(), g = Ur;
          break;
        case 39:
          ht(), g = Vr;
          break;
        case -1:
          Q(), Z(), z();
          break;
        default:
          Q(), g = _t;
          break;
      }
    }
    function xl(i) {
      switch (i) {
        case 9:
        case 10:
        case 12:
        case 32:
          g = pl;
          break;
        case 34:
          ht(), g = Ur;
          break;
        case 39:
          ht(), g = Vr;
          break;
        case 62:
          Q(), g = j, Z();
          break;
        case -1:
          Q(), Z(), z();
          break;
        default:
          Q(), g = _t;
          break;
      }
    }
    function pl(i) {
      switch (i) {
        case 9:
        case 10:
        case 12:
        case 32:
          break;
        case 34:
          ht(), g = Ur;
          break;
        case 39:
          ht(), g = Vr;
          break;
        case 62:
          Q(), g = j, Z();
          break;
        case -1:
          Q(), Z(), z();
          break;
        default:
          Q(), g = _t;
          break;
      }
    }
    function Ur(i) {
      switch (i) {
        case 34:
          g = wi;
          break;
        case 0:
          Ae.push(65533);
          break;
        case 62:
          Q(), g = j, Z();
          break;
        case -1:
          Q(), Z(), z();
          break;
        default:
          Ae.push(i);
          break;
      }
    }
    function Vr(i) {
      switch (i) {
        case 39:
          g = wi;
          break;
        case 0:
          Ae.push(65533);
          break;
        case 62:
          Q(), g = j, Z();
          break;
        case -1:
          Q(), Z(), z();
          break;
        default:
          Ae.push(i);
          break;
      }
    }
    function wi(i) {
      switch (i) {
        case 9:
        case 10:
        case 12:
        case 32:
          break;
        case 62:
          g = j, Z();
          break;
        case -1:
          Q(), Z(), z();
          break;
        default:
          g = _t;
          break;
      }
    }
    function _t(i) {
      switch (i) {
        case 62:
          g = j, Z();
          break;
        case -1:
          Z(), z();
          break;
      }
    }
    function jn(i) {
      switch (i) {
        case 93:
          g = ml;
          break;
        case -1:
          z();
          break;
        case 0:
          b = true;
        default:
          ar(Q0) || u.push(i);
          break;
      }
    }
    function ml(i) {
      switch (i) {
        case 93:
          g = gl;
          break;
        default:
          u.push(93), D(i, jn);
          break;
      }
    }
    function gl(i) {
      switch (i) {
        case 93:
          u.push(93);
          break;
        case 62:
          Ft(), g = j;
          break;
        default:
          u.push(93), u.push(93), D(i, jn);
          break;
      }
    }
    function lr(i) {
      switch (at(), U.push(38), i) {
        case 9:
        case 10:
        case 12:
        case 32:
        case 60:
        case 38:
        case -1:
          D(i, Ct);
          break;
        case 35:
          U.push(i), g = bl;
          break;
        default:
          D(i, ki);
          break;
      }
    }
    function ki(i) {
      Xo.lastIndex = f;
      var s = Xo.exec(n);
      if (!s)
        throw new Error("should never happen");
      var x = s[1];
      if (!x) {
        g = Ct;
        return;
      }
      switch (f += x.length, qt(U, tf(x)), re) {
        case qr:
        case Hr:
        case Pr:
          if (x[x.length - 1] !== ";" && /[=A-Za-z0-9]/.test(n[f])) {
            g = Ct;
            return;
          }
          break;
      }
      at();
      var E = j0[x];
      typeof E == "number" ? U.push(E) : qt(U, E), g = Ct;
    }
    ki.lookahead = -G0;
    function bl(i) {
      switch ($ = 0, i) {
        case 120:
        case 88:
          U.push(i), g = _l;
          break;
        default:
          D(i, El);
          break;
      }
    }
    function _l(i) {
      switch (i) {
        case 48:
        case 49:
        case 50:
        case 51:
        case 52:
        case 53:
        case 54:
        case 55:
        case 56:
        case 57:
        case 65:
        case 66:
        case 67:
        case 68:
        case 69:
        case 70:
        case 97:
        case 98:
        case 99:
        case 100:
        case 101:
        case 102:
          D(i, vl);
          break;
        default:
          D(i, Ct);
          break;
      }
    }
    function El(i) {
      switch (i) {
        case 48:
        case 49:
        case 50:
        case 51:
        case 52:
        case 53:
        case 54:
        case 55:
        case 56:
        case 57:
          D(i, yl);
          break;
        default:
          D(i, Ct);
          break;
      }
    }
    function vl(i) {
      switch (i) {
        case 65:
        case 66:
        case 67:
        case 68:
        case 69:
        case 70:
          $ *= 16, $ += i - 55;
          break;
        case 97:
        case 98:
        case 99:
        case 100:
        case 101:
        case 102:
          $ *= 16, $ += i - 87;
          break;
        case 48:
        case 49:
        case 50:
        case 51:
        case 52:
        case 53:
        case 54:
        case 55:
        case 56:
        case 57:
          $ *= 16, $ += i - 48;
          break;
        case 59:
          g = zr;
          break;
        default:
          D(i, zr);
          break;
      }
    }
    function yl(i) {
      switch (i) {
        case 48:
        case 49:
        case 50:
        case 51:
        case 52:
        case 53:
        case 54:
        case 55:
        case 56:
        case 57:
          $ *= 10, $ += i - 48;
          break;
        case 59:
          g = zr;
          break;
        default:
          D(i, zr);
          break;
      }
    }
    function zr(i) {
      $ in Ko ? $ = Ko[$] : ($ > 1114111 || $ >= 55296 && $ < 57344) && ($ = 65533), at(), $ <= 65535 ? U.push($) : ($ = $ - 65536, U.push(55296 + ($ >> 10)), U.push(56320 + ($ & 1023))), D(i, Ct);
    }
    function Ct(i) {
      switch (re) {
        case qr:
        case Hr:
        case Pr:
          be += Ce(U);
          break;
        default:
          qt(u, U);
          break;
      }
      D(i, re);
    }
    function Tl(i, s, x, E) {
      switch (i) {
        case 1:
          if (s = s.replace(Ht, ""), s.length === 0)
            return;
          break;
        case 4:
          A._appendChild(A.createComment(s));
          return;
        case 5:
          var v = s, N = x, P = E;
          A.appendChild(new H0(A, v, N, P)), m || v.toLowerCase() !== "html" || F0.test(N) || P && P.toLowerCase() === U0 || P === void 0 && Go.test(N) ? A._quirks = true : (V0.test(N) || P !== void 0 && Go.test(N)) && (A._limitedQuirks = true), k = Si;
          return;
      }
      A._quirks = true, k = Si, k(i, s, x, E);
    }
    function Si(i, s, x, E) {
      var v;
      switch (i) {
        case 1:
          if (s = s.replace(Ht, ""), s.length === 0)
            return;
          break;
        case 5:
          return;
        case 4:
          A._appendChild(A.createComment(s));
          return;
        case 2:
          if (s === "html") {
            v = ir(A, s, x), p.push(v), A.appendChild(v), k = jr;
            return;
          }
          break;
        case 3:
          switch (s) {
            case "html":
            case "head":
            case "body":
            case "br":
              break;
            default:
              return;
          }
      }
      v = ir(A, "html", null), p.push(v), A.appendChild(v), k = jr, k(i, s, x, E);
    }
    function jr(i, s, x, E) {
      switch (i) {
        case 1:
          if (s = s.replace(Ht, ""), s.length === 0)
            return;
          break;
        case 5:
          return;
        case 4:
          Qe(s);
          return;
        case 2:
          switch (s) {
            case "html":
              H(i, s, x, E);
              return;
            case "head":
              var v = F(s, x);
              se = v, k = de;
              return;
          }
          break;
        case 3:
          switch (s) {
            case "html":
            case "head":
            case "body":
            case "br":
              break;
            default:
              return;
          }
      }
      jr(Ne, "head", null), k(i, s, x, E);
    }
    function de(i, s, x, E) {
      switch (i) {
        case 1:
          var v = s.match(Ht);
          if (v && (Ze(v[0]), s = s.substring(v[0].length)), s.length === 0)
            return;
          break;
        case 4:
          Qe(s);
          return;
        case 5:
          return;
        case 2:
          switch (s) {
            case "html":
              H(i, s, x, E);
              return;
            case "meta":
            case "base":
            case "basefont":
            case "bgsound":
            case "link":
              F(s, x), p.pop();
              return;
            case "title":
              Dc(s, x);
              return;
            case "noscript":
              if (!c) {
                F(s, x), k = Ni;
                return;
              }
            case "noframes":
            case "style":
              or(s, x);
              return;
            case "script":
              Rr(function(N) {
                var P = ir(N, s, x);
                return P._parser_inserted = true, P._force_async = false, Xe && (P._already_started = true), Ft(), P;
              }), g = mt, Pe = k, k = Gr;
              return;
            case "template":
              F(s, x), d.insertMarker(), h = false, k = Yn, Ge.push(k);
              return;
            case "head":
              return;
          }
          break;
        case 3:
          switch (s) {
            case "head":
              p.pop(), k = Gn;
              return;
            case "body":
            case "html":
            case "br":
              break;
            case "template":
              if (!p.contains("template"))
                return;
              p.generateImpliedEndTags(null, "thorough"), p.popTag("template"), d.clearToMarker(), Ge.pop(), sr();
              return;
            default:
              return;
          }
          break;
      }
      de(W, "head", null), k(i, s, x, E);
    }
    function Ni(i, s, x, E) {
      switch (i) {
        case 5:
          return;
        case 4:
          de(i, s);
          return;
        case 1:
          var v = s.match(Ht);
          if (v && (de(i, v[0]), s = s.substring(v[0].length)), s.length === 0)
            return;
          break;
        case 2:
          switch (s) {
            case "html":
              H(i, s, x, E);
              return;
            case "basefont":
            case "bgsound":
            case "link":
            case "meta":
            case "noframes":
            case "style":
              de(i, s, x);
              return;
            case "head":
            case "noscript":
              return;
          }
          break;
        case 3:
          switch (s) {
            case "noscript":
              p.pop(), k = de;
              return;
            case "br":
              break;
            default:
              return;
          }
          break;
      }
      Ni(W, "noscript", null), k(i, s, x, E);
    }
    function Gn(i, s, x, E) {
      switch (i) {
        case 1:
          var v = s.match(Ht);
          if (v && (Ze(v[0]), s = s.substring(v[0].length)), s.length === 0)
            return;
          break;
        case 4:
          Qe(s);
          return;
        case 5:
          return;
        case 2:
          switch (s) {
            case "html":
              H(i, s, x, E);
              return;
            case "body":
              F(s, x), h = false, k = H;
              return;
            case "frameset":
              F(s, x), k = $n;
              return;
            case "base":
            case "basefont":
            case "bgsound":
            case "link":
            case "meta":
            case "noframes":
            case "script":
            case "style":
            case "template":
            case "title":
              p.push(se), de(Ne, s, x), p.removeElement(se);
              return;
            case "head":
              return;
          }
          break;
        case 3:
          switch (s) {
            case "template":
              return de(i, s, x, E);
            case "body":
            case "html":
            case "br":
              break;
            default:
              return;
          }
          break;
      }
      Gn(Ne, "body", null), h = true, k(i, s, x, E);
    }
    function H(i, s, x, E) {
      var v, N, P, G;
      switch (i) {
        case 1:
          if (b && (s = s.replace(Nn, ""), s.length === 0))
            return;
          h && Sn.test(s) && (h = false), Le(), Ze(s);
          return;
        case 5:
          return;
        case 4:
          Qe(s);
          return;
        case -1:
          if (Ge.length)
            return Yn(i);
          St();
          return;
        case 2:
          switch (s) {
            case "html":
              if (p.contains("template"))
                return;
              ac(x, p.elements[0]);
              return;
            case "base":
            case "basefont":
            case "bgsound":
            case "link":
            case "meta":
            case "noframes":
            case "script":
            case "style":
            case "template":
            case "title":
              de(Ne, s, x);
              return;
            case "body":
              if (v = p.elements[1], !v || !(v instanceof ee.HTMLBodyElement) || p.contains("template"))
                return;
              h = false, ac(x, v);
              return;
            case "frameset":
              if (!h || (v = p.elements[1], !v || !(v instanceof ee.HTMLBodyElement)))
                return;
              for (v.parentNode && v.parentNode.removeChild(v); !(p.top instanceof ee.HTMLHtmlElement); )
                p.pop();
              F(s, x), k = $n;
              return;
            case "address":
            case "article":
            case "aside":
            case "blockquote":
            case "center":
            case "details":
            case "dialog":
            case "dir":
            case "div":
            case "dl":
            case "fieldset":
            case "figcaption":
            case "figure":
            case "footer":
            case "header":
            case "hgroup":
            case "main":
            case "nav":
            case "ol":
            case "p":
            case "section":
            case "summary":
            case "ul":
              p.inButtonScope("p") && H(W, "p"), F(s, x);
              return;
            case "menu":
              p.inButtonScope("p") && H(W, "p"), te(p.top, "menuitem") && p.pop(), F(s, x);
              return;
            case "h1":
            case "h2":
            case "h3":
            case "h4":
            case "h5":
            case "h6":
              p.inButtonScope("p") && H(W, "p"), p.top instanceof ee.HTMLHeadingElement && p.pop(), F(s, x);
              return;
            case "pre":
            case "listing":
              p.inButtonScope("p") && H(W, "p"), F(s, x), T = true, h = false;
              return;
            case "form":
              if (L && !p.contains("template"))
                return;
              p.inButtonScope("p") && H(W, "p"), G = F(s, x), p.contains("template") || (L = G);
              return;
            case "li":
              for (h = false, N = p.elements.length - 1; N >= 0; N--) {
                if (P = p.elements[N], P instanceof ee.HTMLLIElement) {
                  H(W, "li");
                  break;
                }
                if (te(P, Pt) && !te(P, si))
                  break;
              }
              p.inButtonScope("p") && H(W, "p"), F(s, x);
              return;
            case "dd":
            case "dt":
              for (h = false, N = p.elements.length - 1; N >= 0; N--) {
                if (P = p.elements[N], te(P, sc)) {
                  H(W, P.localName);
                  break;
                }
                if (te(P, Pt) && !te(P, si))
                  break;
              }
              p.inButtonScope("p") && H(W, "p"), F(s, x);
              return;
            case "plaintext":
              p.inButtonScope("p") && H(W, "p"), F(s, x), g = Or;
              return;
            case "button":
              p.inScope("button") ? (H(W, "button"), k(i, s, x, E)) : (Le(), F(s, x), h = false);
              return;
            case "a":
              var ue = d.findElementByTag("a");
              ue && (H(W, s), d.remove(ue), p.removeElement(ue));
            case "b":
            case "big":
            case "code":
            case "em":
            case "font":
            case "i":
            case "s":
            case "small":
            case "strike":
            case "strong":
            case "tt":
            case "u":
              Le(), d.push(F(s, x), x);
              return;
            case "nobr":
              Le(), p.inScope(s) && (H(W, s), Le()), d.push(F(s, x), x);
              return;
            case "applet":
            case "marquee":
            case "object":
              Le(), F(s, x), d.insertMarker(), h = false;
              return;
            case "table":
              !A._quirks && p.inButtonScope("p") && H(W, "p"), F(s, x), h = false, k = Ue;
              return;
            case "area":
            case "br":
            case "embed":
            case "img":
            case "keygen":
            case "wbr":
              Le(), F(s, x), p.pop(), h = false;
              return;
            case "input":
              Le(), G = F(s, x), p.pop();
              var ye = G.getAttribute("type");
              (!ye || ye.toLowerCase() !== "hidden") && (h = false);
              return;
            case "param":
            case "source":
            case "track":
              F(s, x), p.pop();
              return;
            case "hr":
              p.inButtonScope("p") && H(W, "p"), te(p.top, "menuitem") && p.pop(), F(s, x), p.pop(), h = false;
              return;
            case "image":
              H(Ne, "img", x, E);
              return;
            case "textarea":
              F(s, x), T = true, h = false, g = pt, Pe = k, k = Gr;
              return;
            case "xmp":
              p.inButtonScope("p") && H(W, "p"), Le(), h = false, or(s, x);
              return;
            case "iframe":
              h = false, or(s, x);
              return;
            case "noembed":
              or(s, x);
              return;
            case "noscript":
              if (c) {
                or(s, x);
                return;
              }
              break;
            case "select":
              Le(), F(s, x), h = false, k === Ue || k === Wn || k === Lt || k === ur || k === Ut ? k = Yr : k = st;
              return;
            case "optgroup":
            case "option":
              p.top instanceof ee.HTMLOptionElement && H(W, "option"), Le(), F(s, x);
              return;
            case "menuitem":
              te(p.top, "menuitem") && p.pop(), Le(), F(s, x);
              return;
            case "rb":
            case "rtc":
              p.inScope("ruby") && p.generateImpliedEndTags(), F(s, x);
              return;
            case "rp":
            case "rt":
              p.inScope("ruby") && p.generateImpliedEndTags("rtc"), F(s, x);
              return;
            case "math":
              Le(), nc(x), ii(x), qn(s, x, q.MATHML), E && p.pop();
              return;
            case "svg":
              Le(), rc(x), ii(x), qn(s, x, q.SVG), E && p.pop();
              return;
            case "caption":
            case "col":
            case "colgroup":
            case "frame":
            case "head":
            case "tbody":
            case "td":
            case "tfoot":
            case "th":
            case "thead":
            case "tr":
              return;
          }
          Le(), F(s, x);
          return;
        case 3:
          switch (s) {
            case "template":
              de(W, s, x);
              return;
            case "body":
              if (!p.inScope("body"))
                return;
              k = Ci;
              return;
            case "html":
              if (!p.inScope("body"))
                return;
              k = Ci, k(i, s, x);
              return;
            case "address":
            case "article":
            case "aside":
            case "blockquote":
            case "button":
            case "center":
            case "details":
            case "dialog":
            case "dir":
            case "div":
            case "dl":
            case "fieldset":
            case "figcaption":
            case "figure":
            case "footer":
            case "header":
            case "hgroup":
            case "listing":
            case "main":
            case "menu":
            case "nav":
            case "ol":
            case "pre":
            case "section":
            case "summary":
            case "ul":
              if (!p.inScope(s))
                return;
              p.generateImpliedEndTags(), p.popTag(s);
              return;
            case "form":
              if (p.contains("template")) {
                if (!p.inScope("form"))
                  return;
                p.generateImpliedEndTags(), p.popTag("form");
              } else {
                var Ve = L;
                if (L = null, !Ve || !p.elementInScope(Ve))
                  return;
                p.generateImpliedEndTags(), p.removeElement(Ve);
              }
              return;
            case "p":
              p.inButtonScope(s) ? (p.generateImpliedEndTags(s), p.popTag(s)) : (H(Ne, s, null), k(i, s, x, E));
              return;
            case "li":
              if (!p.inListItemScope(s))
                return;
              p.generateImpliedEndTags(s), p.popTag(s);
              return;
            case "dd":
            case "dt":
              if (!p.inScope(s))
                return;
              p.generateImpliedEndTags(s), p.popTag(s);
              return;
            case "h1":
            case "h2":
            case "h3":
            case "h4":
            case "h5":
            case "h6":
              if (!p.elementTypeInScope(ee.HTMLHeadingElement))
                return;
              p.generateImpliedEndTags(), p.popElementType(ee.HTMLHeadingElement);
              return;
            case "sarcasm":
              break;
            case "a":
            case "b":
            case "big":
            case "code":
            case "em":
            case "font":
            case "i":
            case "nobr":
            case "s":
            case "small":
            case "strike":
            case "strong":
            case "tt":
            case "u":
              var Ye = Ic(s);
              if (Ye)
                return;
              break;
            case "applet":
            case "marquee":
            case "object":
              if (!p.inScope(s))
                return;
              p.generateImpliedEndTags(), p.popTag(s), d.clearToMarker();
              return;
            case "br":
              H(Ne, s, null);
              return;
          }
          for (N = p.elements.length - 1; N >= 0; N--)
            if (P = p.elements[N], te(P, s)) {
              p.generateImpliedEndTags(s), p.popElement(P);
              break;
            } else if (te(P, Pt))
              return;
          return;
      }
    }
    function Gr(i, s, x, E) {
      switch (i) {
        case 1:
          Ze(s);
          return;
        case -1:
          p.top instanceof ee.HTMLScriptElement && (p.top._already_started = true), p.pop(), k = Pe, k(i);
          return;
        case 3:
          s === "script" ? Oc() : (p.pop(), k = Pe);
          return;
        default:
          return;
      }
    }
    function Ue(i, s, x, E) {
      function v(P) {
        for (var G = 0, ue = P.length; G < ue; G++)
          if (P[G][0] === "type")
            return P[G][1].toLowerCase();
        return null;
      }
      switch (i) {
        case 1:
          if (o) {
            H(i, s, x, E);
            return;
          } else if (te(p.top, tr)) {
            a = [], Pe = k, k = wl, k(i, s, x, E);
            return;
          }
          break;
        case 4:
          Qe(s);
          return;
        case 5:
          return;
        case 2:
          switch (s) {
            case "caption":
              p.clearToContext(Cn), d.insertMarker(), F(s, x), k = Wn;
              return;
            case "colgroup":
              p.clearToContext(Cn), F(s, x), k = Wr;
              return;
            case "col":
              Ue(Ne, "colgroup", null), k(i, s, x, E);
              return;
            case "tbody":
            case "tfoot":
            case "thead":
              p.clearToContext(Cn), F(s, x), k = Lt;
              return;
            case "td":
            case "th":
            case "tr":
              Ue(Ne, "tbody", null), k(i, s, x, E);
              return;
            case "table":
              if (!p.inTableScope(s))
                return;
              Ue(W, s), k(i, s, x, E);
              return;
            case "style":
            case "script":
            case "template":
              de(i, s, x, E);
              return;
            case "input":
              var N = v(x);
              if (N !== "hidden")
                break;
              F(s, x), p.pop();
              return;
            case "form":
              if (L || p.contains("template"))
                return;
              L = F(s, x), p.popElement(L);
              return;
          }
          break;
        case 3:
          switch (s) {
            case "table":
              if (!p.inTableScope(s))
                return;
              p.popTag(s), sr();
              return;
            case "body":
            case "caption":
            case "col":
            case "colgroup":
            case "html":
            case "tbody":
            case "td":
            case "tfoot":
            case "th":
            case "thead":
            case "tr":
              return;
            case "template":
              de(i, s, x, E);
              return;
          }
          break;
        case -1:
          H(i, s, x, E);
          return;
      }
      xt = true, H(i, s, x, E), xt = false;
    }
    function wl(i, s, x, E) {
      if (i === er) {
        if (b && (s = s.replace(Nn, ""), s.length === 0))
          return;
        a.push(s);
      } else {
        var v = a.join("");
        a.length = 0, Sn.test(v) ? (xt = true, H(er, v), xt = false) : Ze(v), k = Pe, k(i, s, x, E);
      }
    }
    function Wn(i, s, x, E) {
      function v() {
        return p.inTableScope("caption") ? (p.generateImpliedEndTags(), p.popTag("caption"), d.clearToMarker(), k = Ue, true) : false;
      }
      switch (i) {
        case 2:
          switch (s) {
            case "caption":
            case "col":
            case "colgroup":
            case "tbody":
            case "td":
            case "tfoot":
            case "th":
            case "thead":
            case "tr":
              v() && k(i, s, x, E);
              return;
          }
          break;
        case 3:
          switch (s) {
            case "caption":
              v();
              return;
            case "table":
              v() && k(i, s, x, E);
              return;
            case "body":
            case "col":
            case "colgroup":
            case "html":
            case "tbody":
            case "td":
            case "tfoot":
            case "th":
            case "thead":
            case "tr":
              return;
          }
          break;
      }
      H(i, s, x, E);
    }
    function Wr(i, s, x, E) {
      switch (i) {
        case 1:
          var v = s.match(Ht);
          if (v && (Ze(v[0]), s = s.substring(v[0].length)), s.length === 0)
            return;
          break;
        case 4:
          Qe(s);
          return;
        case 5:
          return;
        case 2:
          switch (s) {
            case "html":
              H(i, s, x, E);
              return;
            case "col":
              F(s, x), p.pop();
              return;
            case "template":
              de(i, s, x, E);
              return;
          }
          break;
        case 3:
          switch (s) {
            case "colgroup":
              if (!te(p.top, "colgroup"))
                return;
              p.pop(), k = Ue;
              return;
            case "col":
              return;
            case "template":
              de(i, s, x, E);
              return;
          }
          break;
        case -1:
          H(i, s, x, E);
          return;
      }
      !te(p.top, "colgroup") || (Wr(W, "colgroup"), k(i, s, x, E));
    }
    function Lt(i, s, x, E) {
      function v() {
        !p.inTableScope("tbody") && !p.inTableScope("thead") && !p.inTableScope("tfoot") || (p.clearToContext(Ln), Lt(W, p.top.localName, null), k(i, s, x, E));
      }
      switch (i) {
        case 2:
          switch (s) {
            case "tr":
              p.clearToContext(Ln), F(s, x), k = ur;
              return;
            case "th":
            case "td":
              Lt(Ne, "tr", null), k(i, s, x, E);
              return;
            case "caption":
            case "col":
            case "colgroup":
            case "tbody":
            case "tfoot":
            case "thead":
              v();
              return;
          }
          break;
        case 3:
          switch (s) {
            case "table":
              v();
              return;
            case "tbody":
            case "tfoot":
            case "thead":
              p.inTableScope(s) && (p.clearToContext(Ln), p.pop(), k = Ue);
              return;
            case "body":
            case "caption":
            case "col":
            case "colgroup":
            case "html":
            case "td":
            case "th":
            case "tr":
              return;
          }
          break;
      }
      Ue(i, s, x, E);
    }
    function ur(i, s, x, E) {
      function v() {
        return p.inTableScope("tr") ? (p.clearToContext(oi), p.pop(), k = Lt, true) : false;
      }
      switch (i) {
        case 2:
          switch (s) {
            case "th":
            case "td":
              p.clearToContext(oi), F(s, x), k = Ut, d.insertMarker();
              return;
            case "caption":
            case "col":
            case "colgroup":
            case "tbody":
            case "tfoot":
            case "thead":
            case "tr":
              v() && k(i, s, x, E);
              return;
          }
          break;
        case 3:
          switch (s) {
            case "tr":
              v();
              return;
            case "table":
              v() && k(i, s, x, E);
              return;
            case "tbody":
            case "tfoot":
            case "thead":
              p.inTableScope(s) && v() && k(i, s, x, E);
              return;
            case "body":
            case "caption":
            case "col":
            case "colgroup":
            case "html":
            case "td":
            case "th":
              return;
          }
          break;
      }
      Ue(i, s, x, E);
    }
    function Ut(i, s, x, E) {
      switch (i) {
        case 2:
          switch (s) {
            case "caption":
            case "col":
            case "colgroup":
            case "tbody":
            case "td":
            case "tfoot":
            case "th":
            case "thead":
            case "tr":
              p.inTableScope("td") ? (Ut(W, "td"), k(i, s, x, E)) : p.inTableScope("th") && (Ut(W, "th"), k(i, s, x, E));
              return;
          }
          break;
        case 3:
          switch (s) {
            case "td":
            case "th":
              if (!p.inTableScope(s))
                return;
              p.generateImpliedEndTags(), p.popTag(s), d.clearToMarker(), k = ur;
              return;
            case "body":
            case "caption":
            case "col":
            case "colgroup":
            case "html":
              return;
            case "table":
            case "tbody":
            case "tfoot":
            case "thead":
            case "tr":
              if (!p.inTableScope(s))
                return;
              Ut(W, p.inTableScope("td") ? "td" : "th"), k(i, s, x, E);
              return;
          }
          break;
      }
      H(i, s, x, E);
    }
    function st(i, s, x, E) {
      switch (i) {
        case 1:
          if (b && (s = s.replace(Nn, ""), s.length === 0))
            return;
          Ze(s);
          return;
        case 4:
          Qe(s);
          return;
        case 5:
          return;
        case -1:
          H(i, s, x, E);
          return;
        case 2:
          switch (s) {
            case "html":
              H(i, s, x, E);
              return;
            case "option":
              p.top instanceof ee.HTMLOptionElement && st(W, s), F(s, x);
              return;
            case "optgroup":
              p.top instanceof ee.HTMLOptionElement && st(W, "option"), p.top instanceof ee.HTMLOptGroupElement && st(W, s), F(s, x);
              return;
            case "select":
              st(W, s);
              return;
            case "input":
            case "keygen":
            case "textarea":
              if (!p.inSelectScope("select"))
                return;
              st(W, "select"), k(i, s, x, E);
              return;
            case "script":
            case "template":
              de(i, s, x, E);
              return;
          }
          break;
        case 3:
          switch (s) {
            case "optgroup":
              p.top instanceof ee.HTMLOptionElement && p.elements[p.elements.length - 2] instanceof ee.HTMLOptGroupElement && st(W, "option"), p.top instanceof ee.HTMLOptGroupElement && p.pop();
              return;
            case "option":
              p.top instanceof ee.HTMLOptionElement && p.pop();
              return;
            case "select":
              if (!p.inSelectScope(s))
                return;
              p.popTag(s), sr();
              return;
            case "template":
              de(i, s, x, E);
              return;
          }
          break;
      }
    }
    function Yr(i, s, x, E) {
      switch (s) {
        case "caption":
        case "table":
        case "tbody":
        case "tfoot":
        case "thead":
        case "tr":
        case "td":
        case "th":
          switch (i) {
            case 2:
              Yr(W, "select"), k(i, s, x, E);
              return;
            case 3:
              p.inTableScope(s) && (Yr(W, "select"), k(i, s, x, E));
              return;
          }
      }
      st(i, s, x, E);
    }
    function Yn(i, s, x, E) {
      function v(N) {
        k = N, Ge[Ge.length - 1] = k, k(i, s, x, E);
      }
      switch (i) {
        case 1:
        case 4:
        case 5:
          H(i, s, x, E);
          return;
        case -1:
          p.contains("template") ? (p.popTag("template"), d.clearToMarker(), Ge.pop(), sr(), k(i, s, x, E)) : St();
          return;
        case 2:
          switch (s) {
            case "base":
            case "basefont":
            case "bgsound":
            case "link":
            case "meta":
            case "noframes":
            case "script":
            case "style":
            case "template":
            case "title":
              de(i, s, x, E);
              return;
            case "caption":
            case "colgroup":
            case "tbody":
            case "tfoot":
            case "thead":
              v(Ue);
              return;
            case "col":
              v(Wr);
              return;
            case "tr":
              v(Lt);
              return;
            case "td":
            case "th":
              v(ur);
              return;
          }
          v(H);
          return;
        case 3:
          switch (s) {
            case "template":
              de(i, s, x, E);
              return;
            default:
              return;
          }
      }
    }
    function Ci(i, s, x, E) {
      switch (i) {
        case 1:
          if (Sn.test(s))
            break;
          H(i, s);
          return;
        case 4:
          p.elements[0]._appendChild(A.createComment(s));
          return;
        case 5:
          return;
        case -1:
          St();
          return;
        case 2:
          if (s === "html") {
            H(i, s, x, E);
            return;
          }
          break;
        case 3:
          if (s === "html") {
            if (Xe)
              return;
            k = Sl;
            return;
          }
          break;
      }
      k = H, k(i, s, x, E);
    }
    function $n(i, s, x, E) {
      switch (i) {
        case 1:
          s = s.replace(ai, ""), s.length > 0 && Ze(s);
          return;
        case 4:
          Qe(s);
          return;
        case 5:
          return;
        case -1:
          St();
          return;
        case 2:
          switch (s) {
            case "html":
              H(i, s, x, E);
              return;
            case "frameset":
              F(s, x);
              return;
            case "frame":
              F(s, x), p.pop();
              return;
            case "noframes":
              de(i, s, x, E);
              return;
          }
          break;
        case 3:
          if (s === "frameset") {
            if (Xe && p.top instanceof ee.HTMLHtmlElement)
              return;
            p.pop(), !Xe && !(p.top instanceof ee.HTMLFrameSetElement) && (k = kl);
            return;
          }
          break;
      }
    }
    function kl(i, s, x, E) {
      switch (i) {
        case 1:
          s = s.replace(ai, ""), s.length > 0 && Ze(s);
          return;
        case 4:
          Qe(s);
          return;
        case 5:
          return;
        case -1:
          St();
          return;
        case 2:
          switch (s) {
            case "html":
              H(i, s, x, E);
              return;
            case "noframes":
              de(i, s, x, E);
              return;
          }
          break;
        case 3:
          if (s === "html") {
            k = Nl;
            return;
          }
          break;
      }
    }
    function Sl(i, s, x, E) {
      switch (i) {
        case 1:
          if (Sn.test(s))
            break;
          H(i, s, x, E);
          return;
        case 4:
          A._appendChild(A.createComment(s));
          return;
        case 5:
          H(i, s, x, E);
          return;
        case -1:
          St();
          return;
        case 2:
          if (s === "html") {
            H(i, s, x, E);
            return;
          }
          break;
      }
      k = H, k(i, s, x, E);
    }
    function Nl(i, s, x, E) {
      switch (i) {
        case 1:
          s = s.replace(ai, ""), s.length > 0 && H(i, s, x, E);
          return;
        case 4:
          A._appendChild(A.createComment(s));
          return;
        case 5:
          H(i, s, x, E);
          return;
        case -1:
          St();
          return;
        case 2:
          switch (s) {
            case "html":
              H(i, s, x, E);
              return;
            case "noframes":
              de(i, s, x, E);
              return;
          }
          break;
      }
    }
    function Li(i, s, x, E) {
      function v(ue) {
        for (var ye = 0, Ve = ue.length; ye < Ve; ye++)
          switch (ue[ye][0]) {
            case "color":
            case "face":
            case "size":
              return true;
          }
        return false;
      }
      var N;
      switch (i) {
        case 1:
          h && ef.test(s) && (h = false), b && (s = s.replace(Nn, "\uFFFD")), Ze(s);
          return;
        case 4:
          Qe(s);
          return;
        case 5:
          return;
        case 2:
          switch (s) {
            case "font":
              if (!v(x))
                break;
            case "b":
            case "big":
            case "blockquote":
            case "body":
            case "br":
            case "center":
            case "code":
            case "dd":
            case "div":
            case "dl":
            case "dt":
            case "em":
            case "embed":
            case "h1":
            case "h2":
            case "h3":
            case "h4":
            case "h5":
            case "h6":
            case "head":
            case "hr":
            case "i":
            case "img":
            case "li":
            case "listing":
            case "menu":
            case "meta":
            case "nobr":
            case "ol":
            case "p":
            case "pre":
            case "ruby":
            case "s":
            case "small":
            case "span":
            case "strong":
            case "strike":
            case "sub":
            case "sup":
            case "table":
            case "tt":
            case "u":
            case "ul":
            case "var":
              if (Xe)
                break;
              do
                p.pop(), N = p.top;
              while (N.namespaceURI !== q.HTML && !ec(N) && !tc(N));
              pe(i, s, x, E);
              return;
          }
          N = p.elements.length === 1 && Xe ? t : p.top, N.namespaceURI === q.MATHML ? nc(x) : N.namespaceURI === q.SVG && (s = rf(s), rc(x)), ii(x), qn(s, x, N.namespaceURI), E && (s === "script" && (N.namespaceURI, q.SVG), p.pop());
          return;
        case 3:
          if (N = p.top, s === "script" && N.namespaceURI === q.SVG && N.localName === "script")
            p.pop();
          else
            for (var P = p.elements.length - 1, G = p.elements[P]; ; ) {
              if (G.localName.toLowerCase() === s) {
                p.popElement(G);
                break;
              }
              if (G = p.elements[--P], G.namespaceURI === q.HTML) {
                k(i, s, x, E);
                break;
              }
            }
          return;
      }
    }
    return I.testTokenizer = function(i, s, x, E) {
      var v = [];
      switch (s) {
        case "PCDATA state":
          g = j;
          break;
        case "RCDATA state":
          g = pt;
          break;
        case "RAWTEXT state":
          g = cr;
          break;
        case "PLAINTEXT state":
          g = Or;
          break;
      }
      if (x && (ve = x), pe = function(P, G, ue, ye) {
        switch (Ft(), P) {
          case 1:
            v.length > 0 && v[v.length - 1][0] === "Character" ? v[v.length - 1][1] += G : v.push(["Character", G]);
            break;
          case 4:
            v.push(["Comment", G]);
            break;
          case 5:
            v.push(["DOCTYPE", G, ue === void 0 ? null : ue, ye === void 0 ? null : ye, !m]);
            break;
          case 2:
            for (var Ve = /* @__PURE__ */ Object.create(null), Ye = 0; Ye < ue.length; Ye++) {
              var At = ue[Ye];
              At.length === 1 ? Ve[At[0]] = "" : Ve[At[0]] = At[1];
            }
            var Et = ["StartTag", G, Ve];
            ye && Et.push(true), v.push(Et);
            break;
          case 3:
            v.push(["EndTag", G]);
            break;
        }
      }, !E)
        this.parse(i, true);
      else {
        for (var N = 0; N < i.length; N++)
          this.parse(i[N]);
        this.parse("", true);
      }
      return v;
    }, I;
  }
});
var Nr = O((ld, gc) => {
  gc.exports = mc;
  var xc = yn(), pc = wn(), nf = Mn(), Rn = le(), af = tn();
  function mc(e) {
    this.contextObject = e;
  }
  var sf = { xml: { "": true, "1.0": true, "2.0": true }, core: { "": true, "2.0": true }, html: { "": true, "1.0": true, "2.0": true }, xhtml: { "": true, "1.0": true, "2.0": true } };
  mc.prototype = { hasFeature: function(t, r) {
    var n = sf[(t || "").toLowerCase()];
    return n && n[r || ""] || false;
  }, createDocumentType: function(t, r, n) {
    return af.isValidQName(t) || Rn.InvalidCharacterError(), new pc(this.contextObject, t, r, n);
  }, createDocument: function(t, r, n) {
    var l = new xc(false, null), f;
    return r ? f = l.createElementNS(t, r) : f = null, n && l.appendChild(n), f && l.appendChild(f), t === Rn.NAMESPACE.HTML ? l._contentType = "application/xhtml+xml" : t === Rn.NAMESPACE.SVG ? l._contentType = "image/svg+xml" : l._contentType = "application/xml", l;
  }, createHTMLDocument: function(t) {
    var r = new xc(true, null);
    r.appendChild(new pc(r, "html"));
    var n = r.createElement("html");
    r.appendChild(n);
    var l = r.createElement("head");
    if (n.appendChild(l), t !== void 0) {
      var f = r.createElement("title");
      l.appendChild(f), f.appendChild(r.createTextNode(t));
    }
    return n.appendChild(r.createElement("body")), r.modclock = 1, r;
  }, mozSetOutputMutationHandler: function(e, t) {
    e.mutationHandler = t;
  }, mozGetInputMutationHandler: function(e) {
    Rn.nyi();
  }, mozHTMLParser: nf };
});
var _c = O((ud, bc) => {
  var of = pn(), cf = Ka();
  bc.exports = li;
  function li(e, t) {
    this._window = e, this._href = t;
  }
  li.prototype = Object.create(cf.prototype, { constructor: { value: li }, href: { get: function() {
    return this._href;
  }, set: function(e) {
    this.assign(e);
  } }, assign: { value: function(e) {
    var t = new of(this._href), r = t.resolve(e);
    this._href = r;
  } }, replace: { value: function(e) {
    this.assign(e);
  } }, reload: { value: function() {
    this.assign(this.href);
  } }, toString: { value: function() {
    return this.href;
  } } });
});
var vc = O((fd, Ec) => {
  var lf = Object.create(null, { appCodeName: { value: "Mozilla" }, appName: { value: "Netscape" }, appVersion: { value: "4.0" }, platform: { value: "" }, product: { value: "Gecko" }, productSub: { value: "20100101" }, userAgent: { value: "" }, vendor: { value: "" }, vendorSub: { value: "" }, taintEnabled: { value: function() {
    return false;
  } } });
  Ec.exports = lf;
});
var Tc = O((dd, yc) => {
  var uf = { setTimeout, clearTimeout, setInterval, clearInterval };
  yc.exports = uf;
});
var fi = O((Cr, wc) => {
  var ui = le();
  Cr = wc.exports = { CSSStyleDeclaration: mn(), CharacterData: _r(), Comment: Ia(), DOMException: Xr(), DOMImplementation: Nr(), DOMTokenList: ba(), Document: yn(), DocumentFragment: Ha(), DocumentType: wn(), Element: Kt(), HTMLParser: Mn(), NamedNodeMap: wa(), Node: Te(), NodeList: It(), NodeFilter: Er(), ProcessingInstruction: Ba(), Text: Ra(), Window: di() };
  ui.merge(Cr, $a());
  ui.merge(Cr, _n().elements);
  ui.merge(Cr, ei().elements);
});
var di = O((hd, kc) => {
  var ff = Nr(), df = ea(), hf = _c(), Lr = le();
  kc.exports = Dn;
  function Dn(e) {
    this.document = e || new ff(null).createHTMLDocument(""), this.document._scripting_enabled = true, this.document.defaultView = this, this.location = new hf(this, this.document._address || "about:blank");
  }
  Dn.prototype = Object.create(df.prototype, { console: { value: console }, history: { value: { back: Lr.nyi, forward: Lr.nyi, go: Lr.nyi } }, navigator: { value: vc() }, window: { get: function() {
    return this;
  } }, self: { get: function() {
    return this;
  } }, frames: { get: function() {
    return this;
  } }, parent: { get: function() {
    return this;
  } }, top: { get: function() {
    return this;
  } }, length: { value: 0 }, frameElement: { value: null }, opener: { value: null }, onload: { get: function() {
    return this._getEventHandler("load");
  }, set: function(e) {
    this._setEventHandler("load", e);
  } }, getComputedStyle: { value: function(t) {
    return t.style;
  } } });
  Lr.expose(Tc(), Dn);
  Lr.expose(fi(), Dn);
});
var xf = O((Ar) => {
  var Sc = Nr(), Nc = Mn(); di();
  Ar.createDOMImplementation = function() {
    return new Sc(null);
  };
  Ar.createDocument = function(e, t) {
    if (e || t) {
      var r = new Nc();
      return r.parse(e || "", true), r.document();
    }
    return new Sc(null).createHTMLDocument("");
  };
  Ar.createIncrementalHTMLParser = function() {
    var e = new Nc();
    return { write: function(t) {
      t.length > 0 && e.parse(t, false, function() {
        return true;
      });
    }, end: function(t) {
      e.parse(t || "", true, function() {
        return true;
      });
    }, process: function(t) {
      return e.parse("", false, t);
    }, document: function() {
      return e.document();
    } };
  };
  Ar.impl = fi();
});
var qwikdom_default = xf();

// packages/qwik/src/server/document.ts
function _createDocument(opts) {
  opts = opts || {};
  const doc = qwikdom_default.createDocument(opts.html);
  const win = ensureGlobals(doc, opts);
  return win.document;
}
function ensureGlobals(doc, opts) {
  if (!doc[QWIK_DOC]) {
    if (!doc || doc.nodeType !== 9) {
      throw new Error(`Invalid document`);
    }
    doc[QWIK_DOC] = true;
    const loc = normalizeUrl(opts.url);
    Object.defineProperty(doc, "baseURI", {
      get: () => loc.href,
      set: (url) => loc.href = normalizeUrl(url).href
    });
    doc.defaultView = {
      get document() {
        return doc;
      },
      get location() {
        return loc;
      },
      get origin() {
        return loc.origin;
      },
      addEventListener: noop,
      removeEventListener: noop,
      history: {
        pushState: noop,
        replaceState: noop,
        go: noop,
        back: noop,
        forward: noop
      },
      CustomEvent: class CustomEvent {
        constructor(type, details) {
          Object.assign(this, details);
          this.type = type;
        }
      }
    };
  }
  return doc.defaultView;
}
var noop = () => {
};
var QWIK_DOC = Symbol();

// packages/qwik/src/server/render.ts
async function renderToString(rootNode, opts = {}) {
  var _a;
  const createDocTimer = createTimer();
  const doc = _createDocument(opts);
  const createDocTime = createDocTimer();
  const renderDocTimer = createTimer();
  let root = doc;
  if (typeof opts.fragmentTagName === "string") {
    if (opts.qwikLoader) {
      if (opts.qwikLoader.include === void 0) {
        opts.qwikLoader.include = false;
      }
    } else {
      opts.qwikLoader = { include: false };
    }
    root = doc.createElement(opts.fragmentTagName);
    doc.body.appendChild(root);
  }
  if (!opts.manifest) {
    logWarn("Missing client manifest, loading symbols in the client might 404");
  }
  const isFullDocument = isDocument(root);
  const mapper = computeSymbolMapper(opts.manifest);
  await setServerPlatform(doc, opts, mapper);
  await render$1(root, rootNode);
  const renderDocTime = renderDocTimer();
  const buildBase = getBuildBase(opts);
  const containerEl = getElement(root);
  containerEl.setAttribute("q:base", buildBase);
  let snapshotResult = null;
  if (opts.snapshot !== false) {
    snapshotResult = pauseContainer(root);
  }
  const prefetchResources = getPrefetchResources(snapshotResult, opts, mapper);
  const parentElm = isFullDocument ? doc.body : containerEl;
  if (prefetchResources.length > 0) {
    applyPrefetchImplementation(doc, parentElm, opts, prefetchResources);
  }
  const includeLoader = !opts.qwikLoader || opts.qwikLoader.include === void 0 ? "bottom" : opts.qwikLoader.include;
  if (includeLoader) {
    const qwikLoaderScript = getQwikLoaderScript({
      events: (_a = opts.qwikLoader) == null ? void 0 : _a.events,
      debug: opts.debug
    });
    const scriptElm = doc.createElement("script");
    scriptElm.setAttribute("id", "qwikloader");
    scriptElm.textContent = qwikLoaderScript;
    if (includeLoader === "bottom") {
      parentElm.appendChild(scriptElm);
    } else if (isFullDocument) {
      doc.head.appendChild(scriptElm);
    } else {
      parentElm.insertBefore(scriptElm, parentElm.firstChild);
    }
  }
  const docToStringTimer = createTimer();
  const result = {
    prefetchResources,
    snapshotResult,
    html: serializeDocument(root, opts),
    timing: {
      createDocument: createDocTime,
      render: renderDocTime,
      toString: docToStringTimer()
    }
  };
  return result;
}
function computeSymbolMapper(manifest) {
  if (manifest) {
    const mapper = {};
    Object.entries(manifest.mapping).forEach(([key, value]) => {
      mapper[getSymbolHash(key)] = [key, value];
    });
    return mapper;
  }
  return void 0;
}
/*!
Parser-Lib
Copyright (c) 2009-2011 Nicholas C. Zakas. All rights reserved.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

*/

// @qwik-client-manifest
const manifest = {"symbols":{"s_vm9sXn6d9yk":{"origin":"components/App/App.tsx","displayName":"App_component_Host_form_input_onInput","canonicalFilename":"s_vm9sxn6d9yk","hash":"vm9sXn6d9yk","ctxKind":"event","ctxName":"onInput$","captures":true,"parent":"s_aEBWuhFnsHc"},"s_zz2Tp2WNyQ8":{"origin":"components/App/App.tsx","displayName":"App_component_Host_ul_li_input_onChange","canonicalFilename":"s_zz2tp2wnyq8","hash":"zz2Tp2WNyQ8","ctxKind":"event","ctxName":"onChange$","captures":true,"parent":"s_aEBWuhFnsHc"},"s_JLvH8WLXSJA":{"origin":"components/App/App.tsx","displayName":"App_component_Host_form_onSubmit","canonicalFilename":"s_jlvh8wlxsja","hash":"JLvH8WLXSJA","ctxKind":"event","ctxName":"onSubmit$","captures":true,"parent":"s_aEBWuhFnsHc"},"s_aEBWuhFnsHc":{"origin":"components/App/App.tsx","displayName":"App_component","canonicalFilename":"s_aebwuhfnshc","hash":"aEBWuhFnsHc","ctxKind":"function","ctxName":"component$","captures":false,"parent":null}},"mapping":{"s_vm9sXn6d9yk":"q-15da4376.js","s_zz2Tp2WNyQ8":"q-15da4376.js","s_JLvH8WLXSJA":"q-15da4376.js","s_aEBWuhFnsHc":"q-15da4376.js"},"bundles":{"q-01973d26.js":{"size":40,"symbols":[],"imports":["q-e5371762.js"]},"q-15da4376.js":{"size":3470,"symbols":["s_aEBWuhFnsHc","s_JLvH8WLXSJA","s_vm9sXn6d9yk","s_zz2Tp2WNyQ8"],"imports":["q-e5371762.js"]},"q-e5371762.js":{"size":110084,"symbols":[],"dynamicImports":["q-15da4376.js"]}},"injections":[],"version":"1","options":{"target":"client","buildMode":"production","forceFullBuild":true,"entryStrategy":{"type":"smart"}},"platform":{"qwik":"0.0.30","vite":"","rollup":"2.75.7","env":"node","os":"darwin","node":"16.15.1"}};

var App$1 = /* #__PURE__ */ (() => ".App {\n\tpadding: 2rem;\n}\n")();

const data = [
    {
        id: 'todo-001',
        isChecked: false,
        name: 'Apples'
    },
    {
        id: 'todo-002',
        isChecked: true,
        name: 'Bananies'
    },
    {
        id: 'todo-003',
        isChecked: false,
        name: 'Avocåëdos'
    }, 
];
const App = /*#__PURE__*/ componentQrl(inlinedQrl(()=>{
    const state = useStore({
        data: data,
        name: ''
    });
    return /*#__PURE__*/ jsx(Host, {
        class: "App",
        children: [
            /*#__PURE__*/ jsx("h1", {
                children: "Hewwo"
            }),
            /*#__PURE__*/ jsx("form", {
                onSubmitQrl: inlinedQrl(()=>{
                    const [state] = useLexicalScope();
                    state.data.push({
                        id: 'todo-00' + (state.data.length + 1),
                        name: state.name,
                        isChecked: false
                    });
                    state.name = '';
                }, "s_JLvH8WLXSJA", [
                    state
                ]),
                "preventdefault:submit": true,
                children: [
                    /*#__PURE__*/ jsx("label", {
                        htmlFor: "todo-name",
                        children: "Name"
                    }),
                    /*#__PURE__*/ jsx("input", {
                        type: "text",
                        name: "name",
                        id: "todo-name",
                        onInputQrl: inlinedQrl((evt)=>{
                            const [state] = useLexicalScope();
                            state.name = evt.target.value;
                        }, "s_vm9sXn6d9yk", [
                            state
                        ]),
                        value: state.name
                    }),
                    /*#__PURE__*/ jsx("button", {
                        type: "submit",
                        children: "Submit"
                    })
                ]
            }),
            /*#__PURE__*/ jsx("ul", {
                children: state.data.map((d)=>/*#__PURE__*/ jsx("li", {
                        children: [
                            /*#__PURE__*/ jsx("input", {
                                type: "checkbox",
                                id: `checkbox-${d.id}`,
                                checked: d.isChecked,
                                onChangeQrl: inlinedQrl(()=>{
                                    const [d, state] = useLexicalScope();
                                    const updatedItem = state.data.find((el)=>el.id === d.id
                                    );
                                    updatedItem.isChecked = !updatedItem.isChecked;
                                }, "s_zz2Tp2WNyQ8", [
                                    d,
                                    state
                                ])
                            }),
                            /*#__PURE__*/ jsx("label", {
                                htmlFor: `checkbox-${d.id}`,
                                children: d.name
                            })
                        ]
                    }, d.id)
                )
            })
        ]
    });
}, "s_aEBWuhFnsHc"));

var global$1 = /* #__PURE__ */ (() => "*, *::after, *::before {\n\tbox-sizing: border-box;;\n}\n\nhtml {\n\tfont-size: 62.5%;\n}\n\nbody {\n\tfont-family: sans-serif;\n\tfont-size: 1.6rem;\n\tline-height: 1.15;\n}\n")();

const Root = ()=>{
    return /*#__PURE__*/ jsx("html", {
        children: [
            /*#__PURE__*/ jsx("head", {
                children: [
                    /*#__PURE__*/ jsx("meta", {
                        charSet: "utf-8"
                    }),
                    /*#__PURE__*/ jsx("title", {
                        children: "My todo list"
                    })
                ]
            }),
            /*#__PURE__*/ jsx("body", {
                children: /*#__PURE__*/ jsx(App, {})
            })
        ]
    });
};

/**
 * Server-Side Render method to be called by a server.
 */ function render(opts) {
    // Render the Root component to a string
    // Pass in the manifest that was generated from the client build
    return renderToString(/*#__PURE__*/ jsx(Root, {}), {
        manifest,
        ...opts
    });
}

const handler = async (request)=>{
    try {
        // Handle static files
        if (/\.\w+$/.test(request.url)) return;
        const ssrResult = await render({
            url: request.url,
            base: '/build/'
        });
        const response = new Response(ssrResult.html, {
            headers: {
                'Content-Type': 'text/html; charset=utf-8'
            }
        });
        return response;
    } catch (e) {
        // 500 Error
        return new Response(String(e), {
            status: 500
        });
    }
};

export { handler as default };
