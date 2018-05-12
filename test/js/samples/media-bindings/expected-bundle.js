function noop() {}

function assign(tar, src) {
	for (var k in src) tar[k] = src[k];
	return tar;
}

function insertNode(node, target, anchor) {
	target.insertBefore(node, anchor);
}

function detachNode(node) {
	node.parentNode.removeChild(node);
}

function createElement(name) {
	return document.createElement(name);
}

function addListener(node, event, handler) {
	node.addEventListener(event, handler, false);
}

function removeListener(node, event, handler) {
	node.removeEventListener(event, handler, false);
}

function timeRangesToArray(ranges) {
	var array = [];
	for (var i = 0; i < ranges.length; i += 1) {
		array.push({ start: ranges.start(i), end: ranges.end(i) });
	}
	return array;
}

function blankObject() {
	return Object.create(null);
}

function destroy(detach) {
	this.destroy = noop;
	this.fire('destroy');
	this.set = noop;

	this._fragment.d(detach !== false);
	this._fragment = null;
	this._state = {};
}

function _differs(a, b) {
	return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
}

function fire(eventName, data) {
	var handlers =
		eventName in this._handlers && this._handlers[eventName].slice();
	if (!handlers) return;

	for (var i = 0; i < handlers.length; i += 1) {
		var handler = handlers[i];

		if (!handler.__calling) {
			handler.__calling = true;
			handler.call(this, data);
			handler.__calling = false;
		}
	}
}

function get() {
	return this._state;
}

function init(component, options) {
	component._handlers = blankObject();
	component._bind = options._bind;

	component.options = options;
	component.root = options.root || component;
	component.store = component.root.store || options.store;
}

function on(eventName, handler) {
	var handlers = this._handlers[eventName] || (this._handlers[eventName] = []);
	handlers.push(handler);

	return {
		cancel: function() {
			var index = handlers.indexOf(handler);
			if (~index) handlers.splice(index, 1);
		}
	};
}

function outro() {
	this.destroy();
	return Promise.resolve();
}

function set(newState) {
	this._set(assign({}, newState));
	if (this.root._lock) return;
	this.root._lock = true;
	callAll(this.root._beforecreate);
	callAll(this.root._oncreate);
	callAll(this.root._aftercreate);
	this.root._lock = false;
}

function _set(newState) {
	var oldState = this._state,
		changed = {},
		dirty = false;

	for (var key in newState) {
		if (this._differs(newState[key], oldState[key])) changed[key] = dirty = true;
	}
	if (!dirty) return;

	this._state = assign(assign({}, oldState), newState);
	this._recompute(changed, this._state);
	if (this._bind) this._bind(changed, this._state);

	if (this._fragment) {
		this.fire("state", { changed: changed, current: this._state, previous: oldState });
		this._fragment.p(changed, this._state);
		this.fire("update", { changed: changed, current: this._state, previous: oldState });
	}
}

function callAll(fns) {
	while (fns && fns.length) fns.shift()();
}

function _mount(target, anchor, intro) {
	this._fragment[intro && this._fragment.i ? 'i' : 'm'](target, anchor || null);
}

var proto = {
	destroy,
	get,
	fire,
	on,
	outro,
	set,
	_recompute: noop,
	_set,
	_mount,
	_differs
};

/* generated by Svelte vX.Y.Z */

function create_main_fragment(component, ctx) {
	var audio, audio_is_paused = true, audio_updating = false, audio_animationframe;

	function audio_timeupdate_handler() {
		cancelAnimationFrame(audio_animationframe);
		if (!audio.paused) audio_animationframe = requestAnimationFrame(audio_timeupdate_handler);
		audio_updating = true;
		component.set({ played: timeRangesToArray(audio.played), currentTime: audio.currentTime });
		audio_updating = false;
	}

	function audio_durationchange_handler() {
		component.set({ duration: audio.duration });
	}

	function audio_play_pause_handler() {
		audio_updating = true;
		component.set({ paused: audio.paused });
		audio_updating = false;
	}

	function audio_progress_handler() {
		component.set({ buffered: timeRangesToArray(audio.buffered) });
	}

	function audio_loadedmetadata_handler() {
		component.set({ buffered: timeRangesToArray(audio.buffered), seekable: timeRangesToArray(audio.seekable) });
	}

	function audio_volumechange_handler() {
		audio_updating = true;
		component.set({ volume: audio.volume });
		audio_updating = false;
	}

	return {
		c() {
			audio = createElement("audio");
			addListener(audio, "timeupdate", audio_timeupdate_handler);
			if (!('played' in ctx && 'currentTime' in ctx)) component.root._beforecreate.push(audio_timeupdate_handler);
			addListener(audio, "durationchange", audio_durationchange_handler);
			if (!('duration' in ctx)) component.root._beforecreate.push(audio_durationchange_handler);
			addListener(audio, "play", audio_play_pause_handler);
			addListener(audio, "pause", audio_play_pause_handler);
			addListener(audio, "progress", audio_progress_handler);
			if (!('buffered' in ctx)) component.root._beforecreate.push(audio_progress_handler);
			addListener(audio, "loadedmetadata", audio_loadedmetadata_handler);
			if (!('buffered' in ctx && 'seekable' in ctx)) component.root._beforecreate.push(audio_loadedmetadata_handler);
			addListener(audio, "volumechange", audio_volumechange_handler);
		},

		m(target, anchor) {
			insertNode(audio, target, anchor);

			audio.volume = ctx.volume;
		},

		p(changed, ctx) {
			if (!audio_updating && !isNaN(ctx.currentTime )) audio.currentTime = ctx.currentTime ;
			if (!audio_updating && audio_is_paused !== (audio_is_paused = ctx.paused )) audio[audio_is_paused ? "pause" : "play"]();
			if (!audio_updating && !isNaN(ctx.volume)) audio.volume = ctx.volume;
		},

		d(detach) {
			if (detach) {
				detachNode(audio);
			}

			removeListener(audio, "timeupdate", audio_timeupdate_handler);
			removeListener(audio, "durationchange", audio_durationchange_handler);
			removeListener(audio, "play", audio_play_pause_handler);
			removeListener(audio, "pause", audio_play_pause_handler);
			removeListener(audio, "progress", audio_progress_handler);
			removeListener(audio, "loadedmetadata", audio_loadedmetadata_handler);
			removeListener(audio, "volumechange", audio_volumechange_handler);
		}
	};
}

function SvelteComponent(options) {
	init(this, options);
	this._state = assign({}, options.data);

	if (!options.root) {
		this._oncreate = [];
		this._beforecreate = [];
	}

	this._fragment = create_main_fragment(this, this._state);

	if (options.target) {
		this._fragment.c();
		this._mount(options.target, options.anchor, true);

		callAll(this._beforecreate);
	}
}

assign(SvelteComponent.prototype, proto);

export default SvelteComponent;
