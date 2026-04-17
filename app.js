import http from 'http';
import axios from 'axios';
import fs from 'fs/promises';
import path from 'path';
import parser from './utils/parser.js';
import {EventEmitter} from 'events';
import 'dotenv/config';

const {PORT} = process.env;

console.log(PORT);

function getDataPath(filename) {
  return path.resolve(process.cwd(), 'data', filename);
}

const file = getDataPath('users.json');

const emitter = new EventEmitter();

emitter.on('register', async (req, res) => {
  try {
    const { email, password } = axios.get(req);
    await fs.writeFile(file, JSON.stringify(email + password));
    console.log(`${email} registered`);
    console.log(password);
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end('Done!');
  } catch (error) {
    console.error(error);
  }
});


const hostname = '127.0.0.1';

const server = http.createServer(async (req, res) => {
  const { method, url } = parser(req);
  res.writeHead(200, 'OK', {'Content-Type': 'application/json'});

  if (url === '/') {
    res.statusCode = 200;
    res.end('Home page');
  }

  if (method === "POST" && url === '/login') {
    emitter.emit('register', req, res);
    res.end('Login page');
  }
});

console.log('KUKU');

server.listen(PORT, hostname, () => {
  console.log(`Server started on port ${PORT}`);
});
