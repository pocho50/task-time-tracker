import type { Peer, Message } from 'crossws';

const room = 'taskTimeTracks';
export default defineWebSocketHandler({
  open(peer) {
    peer.subscribe(room);
  },
  close(peer) {
    console.log('closed WS');
  },
  error(peer, error) {
    console.log('error on WS', error);
  },
  message(peer, message) {
    peer.publish(room, message.text());
  },
});
