/* eslint-env vitest */
/**
 * @vitest-environment jsdom
 */

// const assert = require("assert");
import debug from "./dist/index.js";
import { describe, it, assert } from "vitest";

describe("debug", () => {
  it("passes a basic sanity check", () => {
    const log = debug("test");
    log.enabled = true;
    log.log = () => {};

    assert.doesNotThrow(() => log("hello world"));
  });

  it("honors global debug namespace enable calls", () => {
    assert.deepStrictEqual(debug("test:12345").enabled, false);
    assert.deepStrictEqual(debug("test:67890").enabled, false);

    debug.enable("test:12345");
    assert.deepStrictEqual(debug("test:12345").enabled, true);
    assert.deepStrictEqual(debug("test:67890").enabled, false);
  });

  it("uses custom log function", () => {
    const log = debug("test");
    log.enabled = true;

    const messages = [];
    log.log = (...args) => messages.push(args);

    log("using custom log function");
    log("using custom log function again");
    log("%O", 12345);

    assert.deepStrictEqual(messages.length, 3);
  });

  describe("rebuild namespaces string (disable)", () => {
    it("handle names, skips, and wildcards", () => {
      debug.enable("test,abc*,-abc");
      const namespaces = debug.disable();
      assert.deepStrictEqual(namespaces, "test,abc*,-abc");
    });

    it("handles empty", () => {
      debug.enable("");
      const namespaces = debug.disable();
      assert.deepStrictEqual(namespaces, "");
      assert.deepStrictEqual(debug.names, []);
      assert.deepStrictEqual(debug.skips, []);
    });

    it("handles all", () => {
      debug.enable("*");
      const namespaces = debug.disable();
      assert.deepStrictEqual(namespaces, "*");
    });

    it("handles skip all", () => {
      debug.enable("-*");
      const namespaces = debug.disable();
      assert.deepStrictEqual(namespaces, "-*");
    });

    it("names+skips same with new string", () => {
      debug.enable("test,abc*,-abc");
      const oldNames = [...debug.names];
      const oldSkips = [...debug.skips];
      const namespaces = debug.disable();
      assert.deepStrictEqual(namespaces, "test,abc*,-abc");
      debug.enable(namespaces);
      assert.deepStrictEqual(oldNames.map(String), debug.names.map(String));
      assert.deepStrictEqual(oldSkips.map(String), debug.skips.map(String));
    });

    it("handles re-enabling existing instances", () => {
      debug.disable("*");
      const inst = debug("foo");
      const messages = [];
      inst.log = (msg) =>
        messages.push(msg.replace(/^[^@]*@([^@]+)@.*$/, "$1"));

      inst("@test@");
      assert.deepStrictEqual(messages, []);
      debug.enable("foo");
      assert.deepStrictEqual(messages, []);
      inst("@test2@");
      assert.deepStrictEqual(messages, ["test2"]);
      inst("@test3@");
      assert.deepStrictEqual(messages, ["test2", "test3"]);
      debug.disable("*");
      inst("@test4@");
      assert.deepStrictEqual(messages, ["test2", "test3"]);
    });
  });
});
