import {Telnet} from 'telnet-client';
import {parsePyONMessage} from './parsePyonMessage.js';

const connection = new Telnet();

// these parameters are just examples and most probably won't work for your use-case.
const connectionParams = {
  host: 'localhost',
  port: 36330,
  timeout: 1500,
  shellPrompt: '> ',
  initialLFCR: true,
};

const execParams = {
  timeout: 1500,
  execTimeout: 1500,
  shellPrompt: '>',
  echoLines: 0,
};

connection.connect(connectionParams).then(() => {
  console.log('Connected to FAH telnet server');
  connection.exec('slot-info', execParams).then(res => {
    console.log(parsePyONMessage(res));
  });
}, error => {
  console.log('promises reject:', error);
}).catch(() => {
  console.error('Failed to connect');
});
