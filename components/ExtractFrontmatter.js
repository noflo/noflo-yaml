import { Component } from "@noflo/noflo";

/**
 * Extracts Front Matter parts (head, body) from a string.
 *
 * The head keeps the newline that preceded the closing fence (the
 * established contract), and the body is everything after the closing
 * fence. A document whose head is empty (`---` and `---` on consecutive
 * lines) yields an empty head; a document with front matter and no body
 * yields an empty body; CRLF line endings parse the same as LF. A file
 * not starting with the opening fence has no front matter: the whole
 * content passes through as the body (Jekyll requires the fences at the
 * file start — a leading newline is not front matter).
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
    // Jekyll front-matter semantics: the fences anchor at the file start,
    // CR is tolerated, the head may be empty, and a document with front
    // matter and no body (no trailing newline after the closing fence)
    // still parses — the 1.x matcher required a newline before and after
    // the closing fence and matched nothing on CRLF input
    const matcher = /^---\r?\n([\s\S]*?)\r?\n?---\r?\n?([\s\S]*)$/;
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
