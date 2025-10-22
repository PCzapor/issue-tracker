import json
import pika
import threading
import time
from typing import Optional

class PikaPublisher:
    def __init__(self, amqp_url:str, exchange: str):
        self.amqp_url = amqp_url
        self.exchange = exchange
        self._conn : Optional[pika.BlockingConnection] = None
        self._ch : Optional[pika.adapters.blocking_connection.BlokingChannel] = None
        self._lock = threading.Lock()
    
    def connect(self):
        params = pika.URLParameters(self.amqp_url)
        params.heartbeat = 30
        params.blocked_connection_timeout = 30
        self._conn = pika.BlockingConnection(params)
        self._ch = self._conn.channel()
        self._ch.exchange_declare(exchange=self.exchange, exchange_type="topic", durable=True)
        self._ch.confirm_delivery()

    def close(self):
        try:
            if self._ch and self._ch.is_open:
                self._ch.close()
            if self._conn and self._conn.is_open:
                self._conn.close()
        except Exception:
            pass

    def _ensure(self):
        if not self._conn or self._conn.is_closed or not self._ch or self._ch.is_closed:
            self.connect()

    def publish(self, routing_key: str, payload: dict, retry: int = 3):
        body = json.dumps(payload, default=str).encode("utf-8")
        for attempt in range(retry):
            try:
                with self._lock:
                    self._ensure()
                    self._ch.basic_publish(
                        exchange=self.exchange,
                        routing_key=routing_key,
                        body=body,
                        properties=pika.BasicProperties(
                            content_type="application/json",
                            delivery_mode=2,
                        ),
                    )
                return True
            except Exception:
                time.sleep(0.3 * (attempt + 1))
                self.close()
        return False
