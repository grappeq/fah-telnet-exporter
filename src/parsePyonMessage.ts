const parsePyON = (payload: string) => {
  return JSON.parse(
      // This is super shitty but should work most of the time
      // and proper implementation would be complex
      payload.replace(/None/g, 'null').
          replace(/False/g, 'false').
          replace(/True/g, 'true'),
  );
};

export interface ParsedFahMessage<Type> {
  content: Type;
  messageName: string;
  version: string;
}

// Following pattern described in the docs:
// https://github.com/FoldingAtHome/fah-control/wiki/3rd-party-FAHClient-API#detecting-pyon-messages
const regex = /\nPyON ([0-9]*) ([a-zA-Z0-9\-_]*)\n(.*)\n---\n/gs;
const parsePyONMessage = (stringToParse: string) : ParsedFahMessage<object> => {
  const matches = Array.from(stringToParse.matchAll(regex));
  if (matches.length === 1) {
    const [, version, messageName, content] = matches[0];
    return {
      version,
      messageName,
      content: parsePyON(content),
    };
  } else {
    throw new Error('Failed to parse PyON');
  }
};

export default parsePyONMessage;