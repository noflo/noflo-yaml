import { Component } from "@noflo/noflo";
import { dump } from "js-yaml";

/**
 * Converts a JavaScript object to YAML.
 * @returns {import("@noflo/noflo").Component} The configured component
 */
export function getComponent() {
  const c = new Component({
    description: "Convert an object to YAML",
    inPorts: {
      in: {
        datatype: "object",
        description: "Object to YAMLify",
        required: true,
      },
    },
    outPorts: {
      out: {
        datatype: "string",
        description: "YAML representation of the object",
      },
      error: {
        datatype: "object",
        description: "Objects that cannot be serialized to YAML",
      },
    },
  });

  c.process((input, output) => {
    if (!input.hasData("in")) {
      return;
    }
    const data = input.getData("in");
    let yaml;
    try {
      yaml = `---\n${dump(data)}`;
    } catch (err) {
      output.done(err instanceof Error ? err : new Error(String(err)));
      return;
    }
    output.sendDone({ out: yaml });
  });

  return c;
}
