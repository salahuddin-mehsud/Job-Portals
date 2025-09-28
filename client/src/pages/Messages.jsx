// src/pages/Messages.jsx
import React, { useEffect, useState, useRef } from 'react'
import { useAuth } from '../hooks/useAuth.js'
import { chatService } from '../services/chatService.js'
import { userService } from '../services/userService.js'
import { socketService } from '../services/socket.js'
import LoadingSpinner from '../components/common/LoadingSpinner.jsx'
import { Send } from 'lucide-react'

const Messages = () => {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)

  const [chats, setChats] = useState([])            // existing chats from server
  const [connections, setConnections] = useState([]) // accepted connections (people you can message)
  const [activeChat, setActiveChat] = useState(null)
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const messagesEndRef = useRef(null)

  useEffect(() => {
    (async () => {
      setLoading(true)
      await loadChats()
      await loadConnections()
      setLoading(false)
    })()

    // subscribe to new messages (real-time)
    socketService.on('new_message', handleIncomingMessage)
    socketService.on('chat_created', handleChatCreated)

    return () => {
      socketService.off('new_message', handleIncomingMessage)
      socketService.off('chat_created', handleChatCreated)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // scroll when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const loadChats = async () => {
    try {
      const resp = await chatService.getChats()
      const data = resp?.data ?? []
      setChats(data)
    } catch (err) {
      console.error('Failed to load chats:', err)
    }
  }

  const loadConnections = async () => {
    try {
      const resp = await userService.getConnections()
      const payload = resp?.data ?? resp
      let connList = []
      if (Array.isArray(payload)) connList = payload
      else if (payload?.data && Array.isArray(payload.data)) connList = payload.data
      else if (payload?.connections && Array.isArray(payload.connections)) connList = payload.connections
      else connList = []

      // Map to "other participant" shape for easy usage in UI
      const mapped = connList.map(c => {
        const other = (c.requester && c.requester._id === user._id) ? c.recipient : c.requester
        return {
          connectionId: c._id,
          ...other
        }
      })
      setConnections(mapped)
    } catch (err) {
      console.error('Failed to load connections:', err)
      setConnections([])
    }
  }

  const loadMessages = async (chatId) => {
    try {
      const resp = await chatService.getMessages(chatId)
      const msgs = resp?.data ?? []
      setMessages(msgs)
      // join chat room on socket so real-time messages can be received for this chat
      socketService.emit('join_chat', chatId)
    } catch (err) {
      console.error('Failed to load messages:', err)
      setMessages([])
    }
  }

  const openChat = async (chat) => {
    if (!chat) return
    setActiveChat(chat)
    await loadMessages(chat._id)
    // ensure chats array is up-to-date (move active chat to top)
    setChats(prev => {
      const filtered = prev.filter(c => c._id !== chat._id)
      return [chat, ...filtered]
    })
  }

  const openChatWith = async (participant) => {
    try {
      const participantId = participant._id || participant.id
      if (!participantId) return
      const participantModel = (participant.role === 'company' || participant.model === 'Company') ? 'Company' : 'User'

      const resp = await chatService.getOrCreateChat(participantId, participantModel)
      const chat = resp?.data
      if (!chat) return

      // update local chat list
      setChats(prev => {
        const exists = prev.find(c => c._id === chat._id)
        if (exists) return prev
        return [chat, ...prev]
      })

      // join and open
      socketService.emit('join_chat', chat._id)
      setActiveChat(chat)
      await loadMessages(chat._id)
    } catch (err) {
      console.error('Failed to create/open chat:', err)
    }
  }

  const handleSend = async (e) => {
    e?.preventDefault?.()
    if (!newMessage.trim() || !activeChat) return

    try {
      const resp = await chatService.sendMessage(activeChat._id, { content: newMessage })
      const msg = resp?.data
      if (msg) {
        setMessages(prev => [...prev, msg])
        // emit via socket so other participant receives it in real-time
        socketService.emit('send_message', { chatId: activeChat._id, content: newMessage, senderId: user._id, senderName: user.name, senderModel: user.role === 'company' ? 'Company' : 'User' })
      }
      setNewMessage('')
    } catch (err) {
      console.error('Failed to send message:', err)
    }
  }

  // handle incoming real-time messages from socket
  const handleIncomingMessage = (payload) => {
    // payload shape from server: { message, chatId } in chatHandlers (server)
    const { message, chatId } = payload || {}
    if (!message) return

    // If message is for the active chat, append; otherwise bump the chat unread in the list
    if (activeChat && chatId === activeChat._id) {
      setMessages(prev => [...prev, message])
    } else {
      // update chats: increment unreadCount or add chat if not present
      setChats(prev => {
        const idx = prev.findIndex(c => c._id === chatId)
        if (idx === -1) {
          // optionally fetch that chat from server — for now just ignore
          return prev
        }
        const copy = [...prev]
        const target = { ...copy[idx] }
        target.unreadCount = (target.unreadCount || 0) + 1
        copy[idx] = target
        // move chat to top
        copy.splice(idx, 1)
        return [target, ...copy]
      })
    }
  }

  const handleChatCreated = (chat) => {
    if (!chat) return
    setChats(prev => {
      const exists = prev.find(c => c._id === chat._id)
      if (exists) return prev
      return [chat, ...prev]
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading messages..." />
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-semibold mb-6">Messages</h1>
      <div className="grid grid-cols-12 gap-6">
        {/* Left column: chats + connections */}
        <div className="col-span-12 lg:col-span-4 bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-4 border-b">
            <h2 className="font-medium">Chats</h2>
          </div>

          <div className="divide-y">
            {chats.length === 0 && (
              <div className="p-4 text-sm text-gray-500">No chats yet. Start by messaging someone from your connections.</div>
            )}
            {chats.map(chat => {
              // get other participant
              const other = chat.participants?.find(p => (p.entity._id || p.entity) !== user._id)
              const participant = (other && (other.entity.name ? other.entity : other.entity)) || {}
              const name = other?.entity?.name || (participant.name || 'User')
              return (
                <button
                  key={chat._id}
                  onClick={() => openChat(chat)}
                  className={`w-full text-left p-3 flex items-center justify-between hover:bg-gray-50 ${activeChat?._id === chat._id ? 'bg-blue-50' : ''}`}
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                      {name?.charAt(0) || 'U'}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{name}</p>
                      <p className="text-xs text-gray-500 truncate">{chat.lastMessage?.content || 'No messages yet'}</p>
                    </div>
                  </div>
                  {chat.unreadCount > 0 && (
                    <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">{chat.unreadCount}</span>
                  )}
                </button>
              )
            })}
          </div>

          <div className="p-4 border-t">
            <h3 className="text-sm font-medium mb-2">Connections</h3>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {connections.length === 0 && <div className="text-xs text-gray-500">No connections found</div>}
              {connections.map(conn => (
                <button
                  key={conn._id || conn.connectionId}
                  onClick={() => openChatWith(conn)}
                  className="w-full flex items-center justify-between p-2 rounded hover:bg-gray-50"
                >
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-xs text-white">
                      {conn?.name?.charAt(0) || 'U'}
                    </div>
                    <div>
                      <p className="text-sm truncate">{conn.name}</p>
                      <p className="text-xs text-gray-500 truncate">{conn.bio || ''}</p>
                    </div>
                  </div>
                  <div className="text-xs text-gray-400">Message</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right column: active chat */}
        <div className="col-span-12 lg:col-span-8 bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col">
          {activeChat ? (
            <>
              <div className="p-4 border-b flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                  {(activeChat.participants?.find(p => (p.entity._id || p.entity) !== user._id)?.entity?.name || 'U').charAt(0)}
                </div>
                <div>
                  <p className="font-medium">
                    {activeChat.participants?.find(p => (p.entity._id || p.entity) !== user._id)?.entity?.name || 'Chat'}
                  </p>
                  <p className="text-xs text-gray-500">{activeChat.participants?.length} participants</p>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.length === 0 && <div className="text-sm text-gray-500">No messages yet — say hello 👋</div>}
                {messages.map(msg => (
                  <div key={msg._id} className={`flex ${msg.sender._id === user._id ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-xl px-3 py-2 rounded-lg ${msg.sender._id === user._id ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-900'}`}>
                      <div className="text-sm">{msg.content}</div>
                      <div className="text-xs mt-1 text-gray-200">{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              <form onSubmit={handleSend} className="p-4 border-t">
                <div className="flex items-center space-x-2">
                  <input
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={e => setNewMessage(e.target.value)}
                  />
                  <button type="submit" className="px-3 py-2 bg-blue-600 text-white rounded-lg disabled:bg-gray-300" disabled={!newMessage.trim()}>
                    <Send size={16} />
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              Select a chat or a connection to start messaging
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Messages
