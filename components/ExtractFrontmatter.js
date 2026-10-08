import { Component } from "@noflo/noflo";

/**
 * Extracts Front Matter parts (head, body) from a string.
 * @returns {import("@noflo/noflo").Component} The configured component
 */
export function getComponent() {
  const c = new Component({
    description: "Extract Front Matter parts from a string",
    inPorts: {
      in: {
        datatype: "string",
        description: "Front matter source",
        required: true,
      },
    },
    outPorts: {
      out: {
        datatype: "object",
        description: "Object with head and body parts",
      },
    },
  });

  c.process((input, output) => {
    if (!input.hasData("in")) {
      return;
    }
    const data = input.getData("in");
    const matcher = /[\n]*-{3}([\w\W]*)[\n]-{3}[\n]([\w\W]*)*/;
    const match = matcher.exec(data);
    if (!match) {
      output.sendDone({
        out: {
          head: "",
          body: data,
        },
      });
      return;
    }
    output.sendDone({
      out: {
        head: match[1],
        body: match[2],
      },
    });
  });

  return c;
}
