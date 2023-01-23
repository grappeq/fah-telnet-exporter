import parsePyONMessage from '../parsePyonMessage';
import {describe, it} from 'mocha';
import {expect} from 'chai';

describe('parsePyonMessage', function() {
  it('should properly identify message parts', async () => {
    const message = '\nPyON 1 messagename\n{"some":"json object"}\n---\n ';
    expect(parsePyONMessage(message)).to.deep.equal({
      'version': '1',
      'messageName': 'messagename',
      'content': {'some': 'json object'},
    });
  });
  it('should parse message names with dashes', async () => {
    const message = '\nPyON 1 message-name\n{"some":"json object"}\n---\n ';
    expect(parsePyONMessage(message)).to.include({
      'messageName': 'message-name',
    });
  });
  it('should parse version with multiple digits', async () => {
    const message = '\nPyON 2137 messagename\n{"some":"json object"}\n---\n ';
    expect(parsePyONMessage(message)).to.include({
      'version': '2137',
    });
  });
  it('should replace Python keywords with JSON', async () => {
    const message = '\nPyON 1 messagename\n{"a": False, "b": True, "c": None}\n---\n ';
    expect(parsePyONMessage(message)).to.deep.equal({
      'version': '1',
      'messageName': 'messagename',
      'content': {a: false, b: true, c: null},
    });
  });
  it('should parse sample slot-info response', async () => {
    const message = '\nPyON 1 slots\n[\n  {\n    "id": "00",\n    "status": "PAUSED",\n    "description": "cpu:6",\n    "options": {"paused": True},\n    "reason": "by user",\n    "idle": False\n  },\n  {\n    "id": "01",\n    "status": "PAUSED",\n    "description": "gpu:10:0 TU106 [Geforce RTX 2060]",\n    "options": {"pci-bus": "10", "pci-slot": "0"},\n    "reason": "waiting for idle",\n    "idle": False\n  }\n]\n---\n ';
    expect(parsePyONMessage(message)).to.deep.equal({
      'version': '1',
      'messageName': 'slots',
      'content': [
        {
          'id': '00',
          'status': 'PAUSED',
          'description': 'cpu:6',
          'options': {
            'paused': true,
          },
          'reason': 'by user',
          'idle': false,
        },
        {
          'id': '01',
          'status': 'PAUSED',
          'description': 'gpu:10:0 TU106 [Geforce RTX 2060]',
          'options': {
            'pci-bus': '10',
            'pci-slot': '0',
          },
          'reason': 'waiting for idle',
          'idle': false,
        },
      ],
    });
  });
});
