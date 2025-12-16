type WsTasksCallback = () => void | Promise<void>;

const useSharedWsTasks = createSharedComposable(() => {
  const lastUpdate = ref<string | null>(null);

  if (!import.meta.client) {
    return {
      lastUpdate,
      send: (_message: string) => false,
      wsData: ref<string | null>(null),
      wsStatus: ref('CLOSED'),
    };
  }

  const url = useRequestURL();
  const wsProtocol = url.protocol === 'https:' ? 'wss' : 'ws';
  const wsUrl = `${wsProtocol}://${url.host}/api/tasks/ws/tasks`;

  const { status: wsStatus, data: wsData, send } = useWebSocket(wsUrl);

  return {
    lastUpdate,
    send,
    wsData,
    wsStatus,
  };
});

export function useWsTasks(callback?: WsTasksCallback) {
  const { lastUpdate, send, wsData, wsStatus } = useSharedWsTasks();

  watch(wsData, async (newVal) => {
    if (!newVal) return;

    if (newVal !== lastUpdate.value) {
      lastUpdate.value = newVal;
      if (callback) {
        await callback();
      }
    }
  });

  function sendData(message: string) {
    lastUpdate.value = message;
    send(message);
  }

  return {
    sendData,
    lastUpdate,
    wsStatus,
  };
}
