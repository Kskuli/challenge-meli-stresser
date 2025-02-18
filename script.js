import http from "k6/http";
import { check, sleep } from "k6";
import { Trend } from "k6/metrics";

// Crear una métrica personalizada para el tiempo de respuesta
let responseTime = new Trend("response_time");

// Parámetros de configuración para las pruebas de estrés
export let options = {
  stages: [
    { duration: "1m", target: 170 },  // 10K RPM
    { duration: "1m", target: 250 },  // 20K RPM
    { duration: "1m", target: 500 },  // 30k RPM
    { duration: "1m", target: 1000 }, // 60K RPM
    { duration: "1m", target: 1666 },  // 100K RPM
  ],
};

export default function () {
  const url = "http://34.122.190.24/api/v1/coupon";

  const headers = {
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.melichallenge.4f6e7b8a9c2d1e3f5g7h",
    "Content-Type": "application/json",
  };

  const payload = JSON.stringify({
    item_ids: [
      "MLA1911250364",
      "MLA810645375",
      "MLA1453153999",
      "MLA1396626045",
      "MLA1456542813",
      "MLA1951483816",
      "MLA1912331022",
      "MLA1435995119",
      "MLA1818499604",
      "MLA1446325217",
      "MLA1940260168",
      "MLA1434558657",
      "MLA1889301150",
      "MLA1455439657",
      "MLA1441246543",
      "MLA1448956981"
    ],
    amount: 1500000,
  });

  // Realizar la solicitud HTTP
  const res = http.post(url, payload, { headers });

  // Comprobar que la respuesta sea correcta (código 200)
  check(res, {
    "is status 200": (r) => r.status === 200,
  });

  if (res.status !== 200) {
    console.log('Error =>', res.status);
  }

  // Registrar el tiempo de respuesta
  responseTime.add(res.timings.duration);

  // Sleep aleatorio entre 1 y 3 segundos para simular usuarios más realistas
  sleep(Math.random() * (3 - 1) + 1);
}
