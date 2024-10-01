import express from "express";

import { RoomServiceClient, Room } from "livekit-server-sdk";
import { AccessToken } from "livekit-server-sdk";

const app = express();
const port = 3000;

const roomName =Math.random().toString();
const participantName = `user-${Math.random().toString()}`;
const livekitHost = "wss://live-test-app-n449qcjk.livekit.cloud";

//const roomService = new RoomServiceClient(livekitHost, process.env.LIVEKIT_API_KEY, process.env.LIVEKIT_API_SECRET);

//console.log("room service", roomService);

const createToken = async () => {
  const at = new AccessToken(
    process.env.LIVEKIT_API_KEY,
    process.env.LIVEKIT_API_SECRET,
    { identity: participantName,
      ttl: "10m",
     });
    //try to run with this api config... should work... 
    at.addGrant({ room: roomName, roomJoin:true,canPublish:true, canSubscribe:true });
    return  await at.toJwt();
   
};



app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/token", async (req, res) => {
  
  res.send(await createToken());
});

app.get("/create", async (req, res) => {
  const room = await roomService.createRoom({
    name: roomName,
    maxParticipants: 20,
  });
  res.send(room);
});

app.get("/list", async (req, res) => {
  const rooms = await roomService.listRooms();
  console.log("existing rooms",rooms);
  res.send(rooms.name);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});


app.post("/join", async (req, res) => {
  const room = await roomService.getRoomByName(roomName);
  const token = await createToken();
  const participant = await room.join(token);
  res.send(participant);
});

app.post("/leave", async (req, res) => {
  const room = await roomService.getRoomByName(roomName);
  const token = await createToken();
  const participant = await room.leave(token);
  res.send(participant);
});

app.post("/publish", async (req, res) => {
  const room = await roomService.getRoomByName(roomName);
  const token = await createToken();
  const participant = await room.publish(token);
  res.send(participant);
});

app.post("/subscribe", async (req, res) => {
  const room = await roomService.getRoomByName(roomName);
  const token = await createToken();
  const participant = await room.subscribe(token);
  res.send(participant);
}); 

app.post("/unsubscribe", async (req, res) => {
  const room = await roomService.getRoomByName(roomName);
  const token = await createToken();
  const participant = await room.unsubscribe(token);
  res.send(participant);
});


app.post("/delete", async (req, res) => {
  const room = await roomService.deleteRoom(roomName);
  console.log("room deleted", room);
  res.send("Room deleted");
});