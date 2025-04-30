import { config } from "../config/config";
import fetch from 'node-fetch';

setInterval(async () => {
  try {
    const response = await fetch(`http://${config.app.appHost}:${config.app.appExposedPort}/`);
    const data = await response.text();
    console.log(`Resposta do job: ${data}`);
  } catch (err) {
    console.error('Erro ao chamar Health Check:', err);
  }
}, config.app.healthCheckDelay);
