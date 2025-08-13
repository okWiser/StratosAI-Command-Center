import { io, Socket } from 'socket.io-client'

export const useWebSocket = () => {
  const socket = ref<Socket | null>(null)
  const isConnected = ref(false)

  const connect = () => {
    const config = useRuntimeConfig()
    socket.value = io(config.public.apiBase)
    
    socket.value.on('connect', () => {
      isConnected.value = true
    })
    
    socket.value.on('disconnect', () => {
      isConnected.value = false
    })
  }

  const disconnect = () => {
    socket.value?.disconnect()
    socket.value = null
    isConnected.value = false
  }

  const emit = (event: string, data: any) => {
    socket.value?.emit(event, data)
  }

  const on = (event: string, callback: Function) => {
    socket.value?.on(event, callback)
  }

  return {
    socket: readonly(socket),
    isConnected: readonly(isConnected),
    connect,
    disconnect,
    emit,
    on
  }
}