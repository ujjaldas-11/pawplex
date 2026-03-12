# emergency/consumers.py

import json
from channels.generic.websocket import AsyncWebsocketConsumer


class SOSConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.alert_id  = self.scope['url_route']['kwargs']['alert_id']
        self.room_name = f'sos_{self.alert_id}'

        await self.channel_layer.group_add(
            self.room_name,
            self.channel_name
        )
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_name,
            self.channel_name
        )

    async def receive(self, text_data):
        data = json.loads(text_data)
        await self.channel_layer.group_send(
            self.room_name,
            {
                'type':    'sos_update',
                'message': data,
            }
        )

    async def sos_update(self, event):
        await self.send(text_data=json.dumps(event['message']))