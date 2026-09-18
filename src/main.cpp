#include <Arduino.h>
#include <WiFi.h>
#include <FirebaseESP32.h>

// Credenciais da sua rede Wi-Fi
#define WIFI_SSID "nc"
#define WIFI_PASSWORD "12344321"

// Credenciais do seu banco de dados Firebase
#define FIREBASE_HOST "esp32-e736f-default-rtdb.firebaseio.com"
#define FIREBASE_AUTH "g6j7u6aoVXmR0fpZC37jVBVs1AqvRz0zv13YGVwH"

// Pino do LED (GPIO 2 é o LED embutido da maioria das placas ESP32)
const int ledPin = 2;

// Objetos do Firebase
FirebaseData firebaseData;
FirebaseAuth auth;
FirebaseConfig config;

// Callback chamada automaticamente quando o valor no Firebase muda
void streamCallback(StreamData data) {
  if (data.dataType() == "int") {
    int statusLed = data.intData();

    if (statusLed == 1) {
      digitalWrite(ledPin, HIGH);
      Serial.println("Comando recebido: LED LIGADO");
    } else {
      digitalWrite(ledPin, LOW);
      Serial.println("Comando recebido: LED DESLIGADO");
    }
  }
}

// Callback para avisar se a conexão do Stream expirar
void streamTimeoutCallback(bool timeout) {
  if (timeout) {
    Serial.println("Stream do Firebase expirou, reconectando...");
  }
}

void setup() {
  Serial.begin(115200);
  pinMode(ledPin, OUTPUT);
  digitalWrite(ledPin, LOW);

  // Conexão Wi-Fi
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print("Conectando ao Wi-Fi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nConectado com sucesso!");
  Serial.print("IP: ");
  Serial.println(WiFi.localIP());

  // Configuração do Firebase
  config.host = FIREBASE_HOST;
  config.signer.tokens.legacy_token = FIREBASE_AUTH;

  Firebase.begin(&config, &auth);
  Firebase.reconnectWiFi(true);

  // Inicia o streaming no nó "led/status"
  if (!Firebase.beginStream(firebaseData, "/led/status")) {
    Serial.println("Erro ao iniciar Stream no Firebase:");
    Serial.println(firebaseData.errorReason());
  }

  // Vincula as funções callback ao stream
  Firebase.setStreamCallback(firebaseData, streamCallback, streamTimeoutCallback);
}

void loop() {
  // O loop fica livre. A biblioteca gerencia as respostas em segundo plano.
}