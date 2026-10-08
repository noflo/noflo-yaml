import { Component } from "@noflo/noflo";

/**
 * Joins head and body into a Front Matter string.
 * @returns {import("@noflo/noflo").Component} The configured component
 */
export function getComponent() {
  const c = new Component({
    description: "Join head and body to a Front Matter string",
    inPorts: {
      head: {
        datatype: "string",
        description: "Header data in YAML format",
        required: true,
      },
      body: {
        datatype: "string",
        description: "Body, typically in Markdown",
        required: true,
      },
    },
    outPorts: {
      out: {
        datatype: "string",
        description: "Document with Front Matter head and body",
      },
    },
  });

  c.forwardBrackets = { body: ["out"] };

  c.process((input, output) => {
    if (!input.hasData("head", "body")) {
      return;
    }
    const head = input.getData("head");
    const body = input.getData("body");
    output.sendDone({ out: `${head}\n---\n${body}` });
  });

  return c;
}
