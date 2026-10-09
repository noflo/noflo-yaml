import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { parse } from "@noflo/fbp";
import { createNodeModulesRegistry } from "@noflo/loader-node";
import * as noflo from "@noflo/noflo";

const testDir = path.dirname(fileURLToPath(import.meta.url));
// The package root: discovery, fixtures, and the graph file live there
const baseDir = path.join(testDir, "..");

/** Loads the ParseFrontmatter graph as a started subgraph component. */
const loadGraph = async () => {
  const source = readFileSync(
    path.join(baseDir, "graphs", "ParseFrontmatter.fbp"),
    "utf8",
  );
  const graph = noflo.importFbpJson(parse(source));
  const registry = await createNodeModulesRegistry(baseDir);
  const loader = new noflo.ComponentLoader({ registry });
  loader.registerGraph("yaml", "ParseFrontmatter", graph);
  const component = await loader.load("yaml/ParseFrontmatter");
  // Starting the component starts the internal network and delivers its
  // IIPs; data sent before start would race the implicit start
  await component.start();
  return component;
};

/**
 * @param {import("@noflo/noflo").Component} component
 */
const wire = (component) => {
  const contentSocket = noflo.internalSocket.createSocket();
  const resultsSocket = noflo.internalSocket.createSocket();
  const filenameSocket = noflo.internalSocket.createSocket();
  const errorSocket = noflo.internalSocket.createSocket();
  component.inPorts.content.attach(contentSocket);
  component.outPorts.results.attach(resultsSocket);
  component.outPorts.filename.attach(filenameSocket);
  component.outPorts.error.attach(errorSocket);
  return {
    contentSocket,
    resultsSocket,
    filenameSocket,
    errorSocket,
    results: collect(resultsSocket),
    filename: collect(filenameSocket),
    errors: collect(errorSocket),
  };
};

/**
 * @param {import("@noflo/noflo").internalSocket.InternalSocket} socket
 * @returns {import("@noflo/noflo").IP[]}
 */
const collect = (socket) => {
  /** @type {import("@noflo/noflo").IP[]} */
  const ips = [];
  socket.addEventListener(
    "ip",
    /** @param {CustomEvent} event */ (event) => {
      ips.push(event.detail);
    },
  );
  return ips;
};

/**
 * @param {import("@noflo/noflo").IP[]} ips
 * @returns {string[]}
 */
const render = (ips) =>
  ips.map((ip) => {
    if (ip.type === "openBracket") {
      return `< ${String(ip.data)}`;
    }
    if (ip.type === "closeBracket") {
      return ">";
    }
    return `DATA ${JSON.stringify(ip.data)}`;
  });

describe("ParseFrontmatter graph", () => {
  it("parses a Front Matter file into head and body with groups", async () => {
    const component = await loadGraph();
    const { contentSocket, results, filename, errors } = wire(component);
    const filePath = path.join(
      baseDir,
      "spec",
      "fixtures",
      "complex4.markdown",
    );
    const fixture = readFileSync(filePath, "utf-8");
    contentSocket.post(new noflo.IP("openBracket", "foo"));
    contentSocket.post(new noflo.IP("openBracket", filePath));
    contentSocket.post(new noflo.IP("data", fixture));
    contentSocket.post(new noflo.IP("closeBracket", filePath));
    contentSocket.post(new noflo.IP("closeBracket", "foo"));
    await new Promise((resolve) => setTimeout(resolve, 200));
    // No errors
    assert.deepEqual(
      errors.filter((ip) => ip.type === "data"),
      [],
    );
    // The innermost group (the file path) is reported on the filename port
    assert.deepEqual(
      filename.filter((ip) => ip.type === "data").map((ip) => ip.data),
      [filePath],
    );
    // Results arrive grouped under the outer group with the file-path
    // group preserved (2.x forwarding semantics keep the inner group,
    // where the 1.x graph composition stripped it), with path and body
    const resultData = results.filter((ip) => ip.type === "data");
    assert.equal(resultData.length, 1);
    const result = /** @type {Record<string, unknown>} */ (resultData[0].data);
    assert.equal(result.path, filePath);
    assert.ok(
      String(result.body).includes("Taking this further"),
      "body should contain the markdown content",
    );
    assert.deepEqual(render(results), [
      "< foo",
      `< ${filePath}`,
      `DATA ${JSON.stringify(result)}`,
      ">",
      ">",
    ]);
  });

  it("reports parse errors with groups for pipe-char files", async () => {
    const component = await loadGraph();
    const { contentSocket, results, errors } = wire(component);
    const filePath = path.join(
      baseDir,
      "spec",
      "fixtures",
      "frontmatter_pipe.md",
    );
    const fixture = readFileSync(filePath, "utf-8");
    contentSocket.post(new noflo.IP("openBracket", "baz"));
    contentSocket.post(new noflo.IP("openBracket", filePath));
    contentSocket.post(new noflo.IP("data", fixture));
    contentSocket.post(new noflo.IP("closeBracket", filePath));
    contentSocket.post(new noflo.IP("closeBracket", "baz"));
    await new Promise((resolve) => setTimeout(resolve, 200));
    const errorData = errors.filter((ip) => ip.type === "data");
    assert.equal(errorData.length, 1);
    assert.equal(
      typeof (/** @type {Error} */ (errorData[0].data).message),
      "string",
    );
    assert.deepEqual(render(errors), [
      "< baz",
      `< ${filePath}`,
      `DATA ${JSON.stringify(errorData[0].data)}`,
      ">",
      ">",
    ]);
    void results;
  });
});
