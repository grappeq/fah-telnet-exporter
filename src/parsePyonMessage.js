const parsePyON = (payload) => {
  return JSON.parse(
      payload.replace(/None/g, 'null').
          replace(/False/g, 'false').
          replace(/True/g, 'true'),
  );
};

// Following pattern described in the docs:
// https://github.com/FoldingAtHome/fah-control/wiki/3rd-party-FAHClient-API#detecting-pyon-messages
const regex = /\nPyON ([0-9]) ([a-z]*)\n(.*)\n---\n/gs;
const parsePyONMessage = (stringToParse) => {
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