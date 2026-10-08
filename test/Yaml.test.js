import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { describe, it } from "node:test";
import * as noflo from "@noflo/noflo";
import { getComponent as getExtract } from "../components/ExtractFrontmatter.js";
import { getComponent } from "../components/ToFrontmatter.js";

/**
 * Waits for the next IP on a socket matching the predicate.
 * @param {import("@noflo/noflo").internalSocket.InternalSocket} socket
 * @param {(ip: import("@noflo/noflo").IP) => boolean} predicate
 * @returns {Promise<import("@noflo/noflo").IP>}
 */
const waitUntil = (socket, predicate) =>
  new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      cleanup();
      reject(new Error("Timed out waiting for IP"));
    }, 2000);
    /** @param {CustomEvent} event */
    const listener = (event) => {
      const ip = event.detail;
      if (predicate(ip)) {
        cleanup();
        resolve(ip);
      }
    };
    const cleanup = () => {
      clearTimeout(timer);
      socket.removeEventListener("ip", listener);
    };
    socket.addEventListener("ip", listener);
  });

// Attach the returned promise before sending any IPs: the activation can
// complete synchronously inside the post that completes its preconditions
describe("ToFrontmatter component", () => {
  it("forwards the body grouping to out", async () => {
    const c = getComponent();
    const head = noflo.internalSocket.createSocket();
    const body = noflo.internalSocket.createSocket();
    const out = noflo.internalSocket.createSocket();
    c.inPorts.head.attach(head);
    c.inPorts.body.attach(body);
    c.outPorts.out.attach(out);
    /** @type {import("@noflo/noflo").IP[]} */
    const outIps = [];
    out.addEventListener(
      "ip",
      /** @param {CustomEvent} event */ (event) => {
        outIps.push(event.detail);
      },
    );

    try {
      const done = waitUntil(out, (ip) => ip.type === "closeBracket");
      head.post(new noflo.IP("openBracket", 1));
      head.post(new noflo.IP("data", "Hello"));
      head.post(new noflo.IP("closeBracket", 1));
      body.post(new noflo.IP("openBracket", 1));
      body.post(new noflo.IP("data", "World"));
      body.post(new noflo.IP("closeBracket", 1));
      await done;

      assert.deepEqual(
        outIps.map((ip) => [ip.type, ip.data]),
        [
          ["openBracket", 1],
          ["data", "Hello\n---\nWorld"],
          ["closeBracket", 1],
        ],
      );
    } finally {
      await c.shutdown();
    }
  });
});

describe("ExtractFrontmatter component with fixture corpus", () => {
  /**
   * @param {string} fixture
   * @returns {Promise<{ head: string, body: string }>}
   */
  const extract = async (fixture) => {
    const c = getExtract();
    const inSocket = noflo.internalSocket.createSocket();
    const outSocket = noflo.internalSocket.createSocket();
    c.inPorts.in.attach(inSocket);
    c.outPorts.out.attach(outSocket);
    const outIp = waitUntil(outSocket, (ip) => ip.type === "data");
    try {
      inSocket.post(new noflo.IP("data", fixture));
      const ip = await outIp;
      return ip.data;
    } finally {
      await c.shutdown();
    }
  };

  it("extracts head and body from a complex document", async () => {
    const result = await extract(
      await readFile(
        new URL("../spec/fixtures/complex.md", import.meta.url),
        "utf-8",
      ),
    );
    assert.match(result.head, /location: Berlin, Germany/);
    assert.match(result.body, /This makes sense/);
  });

  it("extracts head and body from a messy HTML document", async () => {
    const result = await extract(
      await readFile(
        new URL("../spec/fixtures/complex2.html", import.meta.url),
        "utf-8",
      ),
    );
    assert.match(result.head, /layout: "post"/);
    assert.match(result.body, /The Authoring Interface System/);
  });

  it("extracts head and body from Markdown with subheadlines", async () => {
    const result = await extract(
      await readFile(
        new URL("../spec/fixtures/complex3.markdown", import.meta.url),
        "utf-8",
      ),
    );
    assert.match(result.head, /layout: "post"/);
    assert.match(result.body, /Welcome/);
  });

  it("extracts head and body from Markdown with inline HTML", async () => {
    const result = await extract(
      await readFile(
        new URL("../spec/fixtures/complex4.markdown", import.meta.url),
        "utf-8",
      ),
    );
    assert.match(result.head, /layout: post/);
    assert.match(result.body, /Full-Stack/);
  });
});
