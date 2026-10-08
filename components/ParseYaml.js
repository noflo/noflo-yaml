import { Component } from "@noflo/noflo";
import { load } from "js-yaml";

/**
 * Parses YAML into a JavaScript object.
 * @returns {import("@noflo/noflo").Component} The configured component
 */
export function getComponent() {
  const c = new Component({
    description: "Parse YAML to an object",
    inPorts: {
      in: {
        datatype: "string",
        description: "YAML source",
        required: true,
      },
    },
    outPorts: {
      out: {
        datatype: "object",
        description: "Parsed YAML document",
      },
      error: {
        datatype: "object",
        description: "YAML parse errors",
      },
    },
  });

  c.process((input, output) => {
    if (!input.hasData("in")) {
      return;
    }
    const data = input.getData("in");
    // Empty and whitespace-only input is not a YAML document; it has
    // always produced an empty object here (js-yaml 4 returned undefined
    // for it, js-yaml 5 throws), so keep that contract explicitly
    if (!data.trim()) {
      output.sendDone({ out: {} });
      return;
    }
    let result;
    try {
      result = load(data);
    } catch (err) {
      output.done(err instanceof Error ? err : new Error(String(err)));
      return;
    }
    output.sendDone({ out: result || {} });
  });

  return c;
}
