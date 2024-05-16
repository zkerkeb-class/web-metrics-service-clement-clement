import express from 'express';
import dotenv from 'dotenv';
import axios from 'axios';
import os from 'os';
import { Gauge, register } from 'prom-client';
dotenv.config();

const app = express();
const port = process.env.PORT;

const serviceGauge = new Gauge({
  name: 'service_status',
  help: 'Service status',
  labelNames: ['service_url'],
});

const cpuGauge = new Gauge({ name: 'cpu_usage', help: 'CPU usage' });
const diskGauge = new Gauge({ name: 'disk_usage', help: 'Disk usage' });
const loadGauge = new Gauge({ name: 'load_avg', help: 'Load average' });

const jwtSecret = process.env.JWT_SECRET;

if (!jwtSecret) {
  console.error("La clé secrète JWT n'est pas définie dans le fichier .env");
  process.exit(1);
}

app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});

// Nouvelle route pour afficher les métriques de chaque serveur
app.get('/services/metrics', async (req, res) => {
  const services = ['http://localhost:3000', 'http://localhost:3005/api/pay']; // Remplacez ceci par vos services
  const metrics = [];

  for (const service of services) {
    try {
      const response = await axios.get(service);
      metrics.push({
        service: service,
        status: response.status === 200 ? 'OK' : 'Error',
        cpuUsage: os.loadavg()[0] / os.cpus().length,
        diskUsage: 1 - os.freemem() / os.totalmem(),
        loadAvg: os.loadavg()[0],
      });
    } catch (error) {
      console.error(`Une erreur s'est produite lors de l'accès à ${service}:`, error);
      metrics.push({
        service: service,
        status: 'Error',
        cpuUsage: null,
        diskUsage: null,
        loadAvg: null,
      });
    }
  }

  res.json(metrics);
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

setInterval(async () => {
  const services = ['http://localhost:3000', 'http://localhost:3005/api/pay']; // Remplacez ceci par vos services

  for (const service of services) {
    try {
      const response = await axios.get(service);
      serviceGauge.labels(service).set(response.status === 200 ? 1 : 0);
    } catch (error) {
      serviceGauge.labels(service).set(0);
    }
  }

  // CPU usage
  const cpuUsage = os.loadavg()[0] / os.cpus().length;
  cpuGauge.set(cpuUsage);

  // Disk usage
  const diskUsage = 1 - os.freemem() / os.totalmem();
  diskGauge.set(diskUsage);

  // Load average
  const loadAvg = os.loadavg()[0];
  loadGauge.set(loadAvg);
}, 5000);
