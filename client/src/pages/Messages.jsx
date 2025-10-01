import React, { useEffect, useState, useRef, useCallback } from 'react'
import { useAuth } from '../hooks/useAuth.js'
import { chatService } from '../services/chatService.js'
import { userService } from '../services/userService.js'
import { socketService } from '../services/socket.js'
import { useSocket } from '../context/SocketContext.jsx'
import LoadingSpinner from '../components/common/LoadingSpinner.jsx'
import { Send } from 'lucide-react'

const Messages = () => {
  const { user } = useAuth()
  const { onlineUsers, isConnected } = useSocket()
  const [loading, setLoading] = useState(true)
  const [chats, setChats] = useState([])
  const [connections, setConnections] = useState([])
  const [activeChat, setActiveChat] = useState(null)
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const messagesEndRef = useRef(null)

  // Debug component
  const SocketDebug = () => {
    const { onlineUsers, isConnected } = useSocket()
    
    return (
      <div style={{ 
        position: 'fixed', 
        top: 10, 
        right: 10, 
        background: 'white', 
        padding: 10, 
        border: '1px solid #ccc', 
        zIndex: 1000,
        fontSize: '12px',
        maxWidth: '300px'
      }}>
        <div><strong>Socket Debug</strong></div>
        <div>Connected: {isConnected ? '✅' : '❌'}</div>
        <div>My ID: {user?._id}</div>
        <div>Online Users: {Array.from(onlineUsers).join(', ') || 'None'}</div>
      </div>
    )
  }

  // Handle socket reconnection
  useEffect(() => {
    if (!isConnected && user) {
      console.log('Socket not connected, attempting to reconnect...')
      const token = localStorage.getItem('token')
      if (token) {
        setTimeout(() => {
          socketService.connect(token)
        }, 2000)
      }
    }
  }, [isConnected, user])

  // Memoized function to get other participant from chat
  const getOtherParticipant = useCallback((chat) => {
    if (!chat?.participants || !user) return null
    
    const other = chat.participants.find(p => {
      const participantId = p.entity?._id || p.entity
      return participantId !== user._id
    })
    
    return other
  }, [user])

  useEffect(() => {
    const initializeChats = async () => {
      setLoading(true)
      await loadChats()
      await loadConnections()
      setLoading(false)
    }

    initializeChats()

    return () => {
      // Cleanup socket listeners when component unmounts
      socketService.off('new_message')
      socketService.off('chat_created')
    }
  }, [])

  // Set up socket listeners
  useEffect(() => {
    const handleIncomingMessage = (payload) => {
      console.log('📨 Received new message:', payload)
      const { message, chatId } = payload || {}
      if (!message) return

      // Update the chat list with the new message
      setChats(prev => prev.map(chat => {
        if (chat._id === chatId) {
          return {
            ...chat,
            lastMessage: message,
            lastActivity: new Date(),
            unreadCount: (activeChat && activeChat._id === chatId) ? 0 : (chat.unreadCount || 0) + 1
          }
        }
        return chat
      }))

      // If this message is for the active chat, add it to messages
      if (activeChat && activeChat._id === chatId) {
        setMessages(prev => {
          // Check if message already exists to prevent duplicates
          const exists = prev.find(m => m._id === message._id)
          if (exists) return prev
          return [...prev, message]
        })
      } else {
        // If not active chat, update unread count and move chat to top
        setChats(prev => {
          const chatIndex = prev.findIndex(c => c._id === chatId)
          if (chatIndex === -1) return prev
          
          const updatedChats = [...prev]
          const updatedChat = { 
            ...updatedChats[chatIndex], 
            unreadCount: (updatedChats[chatIndex].unreadCount || 0) + 1,
            lastMessage: message,
            lastActivity: new Date()
          }
          
          // Remove from current position and add to top
          updatedChats.splice(chatIndex, 1)
          return [updatedChat, ...updatedChats]
        })
      }
    }

    const handleChatCreated = (chat) => {
      console.log('💬 Chat created:', chat)
      if (!chat) return
      setChats(prev => {
        const exists = prev.find(c => c._id === chat._id)
        if (exists) return prev
        return [chat, ...prev]
      })
    }

    // Remove any existing listeners first
    socketService.off('new_message', handleIncomingMessage)
    socketService.off('chat_created', handleChatCreated)

    // Add new listeners
    socketService.on('new_message', handleIncomingMessage)
    socketService.on('chat_created', handleChatCreated)

    return () => {
      socketService.off('new_message', handleIncomingMessage)
      socketService.off('chat_created', handleChatCreated)
    }
  }, [activeChat])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Join chat room when active chat changes
  useEffect(() => {
    if (activeChat && isConnected) {
      console.log('🚪 Joining chat:', activeChat._id)
      socketService.emit('join_chat', activeChat._id)
      
      // Mark messages as read when opening chat
      markMessagesAsRead(activeChat._id)
    }
  }, [activeChat, isConnected])

  const markMessagesAsRead = async (chatId) => {
    try {
      // Reset unread count for this chat
      setChats(prev => prev.map(chat => 
        chat._id === chatId ? { ...chat, unreadCount: 0 } : chat
      ))
      
      // Emit socket event to mark messages as read on server
      if (isConnected) {
        socketService.emit('mark_messages_read', { chatId, userId: user._id })
      }
    } catch (err) {
      console.error('Error marking messages as read:', err)
    }
  }

  const loadChats = async () => {
    try {
      const resp = await chatService.getChats()
      const data = resp?.data ?? []
      
      const uniqueChats = data.filter(chat => 
        chat && chat._id && chat.participants && chat.participants.length === 2
      ).reduce((acc, chat) => {
        if (!acc.find(c => c._id === chat._id)) {
          acc.push(chat)
        }
        return acc
      }, [])
      
      setChats(uniqueChats)
    } catch (err) {
      console.error('Failed to load chats:', err)
      setChats([])
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

      const mapped = connList
        .filter(c => {
          const other = (c.requester && c.requester._id === user._id) ? c.recipient : c.requester
          return other && other._id !== user._id
        })
        .map(c => {
          const other = (c.requester && c.requester._id === user._id) ? c.recipient : c.requester
          return {
            connectionId: c._id,
            ...other
          }
        })
        .filter(conn => conn._id && conn._id !== user._id)

      const uniqueConnections = mapped.reduce((acc, conn) => {
        if (!acc.find(c => c._id === conn._id)) {
          acc.push(conn)
        }
        return acc
      }, [])

      setConnections(uniqueConnections)
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
    } catch (err) {
      console.error('Failed to load messages:', err)
      setMessages([])
    }
  }

  const openChat = async (chat) => {
    if (!chat) return
    setActiveChat(chat)
    await loadMessages(chat._id)
    
    // Update chat list - move to top and reset unread count
    setChats(prev => {
      const filtered = prev.filter(c => c._id !== chat._id)
      const updatedChat = { ...chat, unreadCount: 0 }
      return [updatedChat, ...filtered]
    })
  }

  const openChatWith = async (participant) => {
    try {
      const participantId = participant._id || participant.id
      if (!participantId || participantId === user._id) return
      
      const participantModel = (participant.role === 'company' || participant.model === 'Company') ? 'Company' : 'User'

      // Check if chat already exists with this participant
      const existingChat = chats.find(chat => {
        const otherParticipant = getOtherParticipant(chat)
        return otherParticipant && (otherParticipant.entity?._id === participantId || otherParticipant.entity === participantId)
      })

      if (existingChat) {
        await openChat(existingChat)
        return
      }

      // Create new chat if doesn't exist
      const resp = await chatService.getOrCreateChat(participantId, participantModel)
      const chat = resp?.data
      if (!chat) return

      // Emit socket event for chat creation
      if (isConnected) {
        socketService.emit('create_chat', { participantId, participantModel })
      }

      // Add to chats list
      setChats(prev => {
        const exists = prev.find(c => c._id === chat._id)
        if (exists) return prev
        return [chat, ...prev]
      })

      // Join and open the chat
      if (isConnected) {
        socketService.emit('join_chat', chat._id)
      }
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
    // Send to server
    const resp = await chatService.sendMessage(activeChat._id, { content: newMessage })
    
    // Emit socket event
    if (isConnected) {
      socketService.emit('send_message', { 
        chatId: activeChat._id, 
        content: newMessage,
        messageType: 'text'
      })
    }

    // Don't update state here — wait for socket
    setNewMessage('')
  } catch (err) {
    console.error('Failed to send message:', err)
  }
}


  // Helper function to check if a user is online
  const isUserOnline = (userId) => {
    if (!isConnected) return false
    return onlineUsers.has(userId)
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
      <SocketDebug />
      
      <h1 className="text-2xl font-semibold mb-6">Messages</h1>
      <div className="grid grid-cols-12 gap-6">
        {/* Left column: chats + connections */}
        <div className="col-span-12 lg:col-span-4 bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-4 border-b">
            <h2 className="font-medium">Chats</h2>
          </div>

          <div className="divide-y max-h-96 overflow-y-auto">
            {chats.length === 0 && (
              <div className="p-4 text-sm text-gray-500">No chats yet. Start by messaging someone from your connections.</div>
            )}
            {chats.map(chat => {
              const otherParticipant = getOtherParticipant(chat)
              const participant = otherParticipant?.entity || {}
              const participantId = participant._id || otherParticipant?.entity
              const name = participant?.name || 'User'
              const lastMessage = chat.lastMessage?.content || 'No messages yet'
              const isOnline = isUserOnline(participantId)
              
              return (
                <button
                  key={chat._id}
                  onClick={() => openChat(chat)}
                  className={`w-full text-left p-3 flex items-center justify-between hover:bg-gray-50 ${
                    activeChat?._id === chat._id ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="flex items-center space-x-3 min-w-0 flex-1">
                    <div className="relative flex-shrink-0">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                        {name?.charAt(0)?.toUpperCase() || 'U'}
                      </div>
                      {/* Online status indicator */}
                      <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                        isOnline ? 'bg-green-500' : 'bg-gray-400'
                      }`}></div>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center space-x-2">
                        <p className="text-sm font-medium truncate">{name}</p>
                        {isOnline && (
                          <span className="text-xs text-green-600 font-medium">Online</span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 truncate">{lastMessage}</p>
                    </div>
                  </div>
                  {chat.unreadCount > 0 && (
                    <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full flex-shrink-0 ml-2">
                      {chat.unreadCount}
                    </span>
                  )}
                </button>
              )
            })}
          </div>

          <div className="p-4 border-t">
            <h3 className="text-sm font-medium mb-2">Connections</h3>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {connections.length === 0 && (
                <div className="text-xs text-gray-500">No connections found</div>
              )}
              {connections.map(conn => {
                const isOnline = isUserOnline(conn._id)
                return (
                  <button
                    key={conn._id || conn.connectionId}
                    onClick={() => openChatWith(conn)}
                    className="w-full flex items-center justify-between p-2 rounded hover:bg-gray-50"
                  >
                    <div className="flex items-center space-x-2 min-w-0 flex-1">
                      <div className="relative flex-shrink-0">
                        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-xs text-gray-600">
                          {conn?.name?.charAt(0)?.toUpperCase() || 'U'}
                        </div>
                        {/* Online status indicator */}
                        <div className={`absolute bottom-0 right-0 w-2 h-2 rounded-full border border-white ${
                          isOnline ? 'bg-green-500' : 'bg-gray-400'
                        }`}></div>
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center space-x-2">
                          <p className="text-sm font-medium truncate">{conn.name}</p>
                          {isOnline && (
                            <span className="text-xs text-green-600">Online</span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 truncate">{conn.bio || conn.headline || ''}</p>
                      </div>
                    </div>
                    <div className="text-xs text-blue-600 flex-shrink-0">Message</div>
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Right column: active chat */}
        <div className="col-span-12 lg:col-span-8 bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col min-h-[600px]">
          {activeChat ? (
            <>
              <div className="p-4 border-b flex items-center space-x-3">
                {(() => {
                  const otherParticipant = getOtherParticipant(activeChat)
                  const participant = otherParticipant?.entity || {}
                  const participantId = participant._id || otherParticipant?.entity
                  const name = participant?.name || 'Chat'
                  const isOnline = isUserOnline(participantId)
                  
                  return (
                    <>
                      <div className="relative">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                          {name.charAt(0).toUpperCase()}
                        </div>
                        {/* Online status indicator in active chat header */}
                        <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                          isOnline ? 'bg-green-500' : 'bg-gray-400'
                        }`}></div>
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <p className="font-medium">{name}</p>
                          {isOnline ? (
                            <span className="text-xs text-green-600 font-medium">Online</span>
                          ) : (
                            <span className="text-xs text-gray-500">Offline</span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500">
                          {isOnline ? 'Active now' : 'Last seen recently'}
                        </p>
                      </div>
                    </>
                  )
                })()}
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.length === 0 && (
                  <div className="text-sm text-gray-500 text-center py-8">
                    No messages yet — say hello 👋
                  </div>
                )}
                {messages.map(msg => (
                  <div 
                    key={msg._id} 
                    className={`flex ${msg.sender?._id === user._id ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-xl px-3 py-2 rounded-lg ${
                      msg.sender?._id === user._id 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-100 text-gray-900'
                    }`}>
                      <div className="text-sm">{msg.content}</div>
                      <div className={`text-xs mt-1 ${
                        msg.sender?._id === user._id ? 'text-blue-200' : 'text-gray-500'
                      }`}>
                        {new Date(msg.createdAt).toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </div>
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
                  <button 
                    type="submit" 
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                    disabled={!newMessage.trim()}
                  >
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