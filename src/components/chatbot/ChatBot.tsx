import React, { useState, useRef, useEffect } from 'react'
import {
  Card,
  CardContent,
  Typography,
  Box,
  TextField,
  IconButton,
  Chip,
  List,
  ListItem,
  ListItemButton,
  Divider,
  Avatar,
  Paper,
  Fade,
  CircularProgress
} from '@mui/material'
import {
  Send as SendIcon,
  SmartToy as BotIcon,
  Person as PersonIcon,
  Lightbulb as LightbulbIcon
} from '@mui/icons-material'
import { useTranslation } from 'react-i18next'
import MessageBubble from './MessageBubble'
import { chatSuggestions, chatbotResponses } from '../../utils/mockData'

interface Message {
  id: number
  text: string
  isUser: boolean
  timestamp: Date
  suggestions?: string[]
}

const ChatBot: React.FC = () => {
  const { t } = useTranslation()
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: t('chatbot.greeting'),
      isUser: false,
      timestamp: new Date(),
      suggestions: chatSuggestions
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const getBotResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase()
    
    if (message.includes('yield') || message.includes('production')) {
      return t('chatbot.responses.yield')
    } else if (message.includes('water') || message.includes('irrigation')) {
      return t('chatbot.responses.irrigation')
    } else if (message.includes('fertilizer') || message.includes('fertilization')) {
      return t('chatbot.responses.fertilizer')
    } else if (message.includes('pest') || message.includes('insect') || message.includes('disease')) {
      return t('chatbot.responses.pest')
    } else if (message.includes('weather') || message.includes('rain') || message.includes('temperature')) {
      return t('chatbot.responses.weather')
    } else if (message.includes('harvest') || message.includes('harvesting')) {
      return t('chatbot.responses.harvest')
    } else {
      return "I understand you're asking about farming. Could you be more specific? I can help with yield predictions, irrigation, fertilization, pest control, weather, and harvesting advice."
    }
  }

  const handleSendMessage = () => {
    if (!inputValue.trim()) return

    const userMessage: Message = {
      id: Date.now(),
      text: inputValue,
      isUser: true,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsTyping(true)

    // Simulate bot thinking time
    setTimeout(() => {
      const botResponse: Message = {
        id: Date.now() + 1,
        text: getBotResponse(inputValue),
        isUser: false,
        timestamp: new Date()
      }

      setMessages(prev => [...prev, botResponse])
      setIsTyping(false)
    }, 1500)
  }

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion)
    inputRef.current?.focus()
  }

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <Card sx={{ height: '80vh', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', p: 0 }}>
        {/* Header */}
        <Box sx={{ p: 3, borderBottom: '1px solid', borderColor: 'divider' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ bgcolor: 'primary.main' }}>
              <BotIcon />
            </Avatar>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {t('chatbot.title')}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                AI-powered farming assistant
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Messages */}
        <Box sx={{ flexGrow: 1, overflow: 'auto', p: 2, minHeight: 0 }}>
          {messages.map((message) => (
            <Fade key={message.id} in={true} timeout={300}>
              <Box>
                <MessageBubble message={message} />
                {message.suggestions && (
                  <Box sx={{ mt: 1, mb: 2 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                      Quick suggestions:
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {message.suggestions.map((suggestion, index) => (
                        <Chip
                          key={index}
                          label={suggestion}
                          size="small"
                          variant="outlined"
                          onClick={() => handleSuggestionClick(suggestion)}
                          sx={{ cursor: 'pointer' }}
                        />
                      ))}
                    </Box>
                  </Box>
                )}
              </Box>
            </Fade>
          ))}
          
          {isTyping && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2 }}>
              <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                <BotIcon fontSize="small" />
              </Avatar>
              <Paper sx={{ p: 2, bgcolor: 'grey.100' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CircularProgress size={16} />
                  <Typography variant="body2" color="text.secondary">
                    AI is thinking...
                  </Typography>
                </Box>
              </Paper>
            </Box>
          )}
          
          <div ref={messagesEndRef} />
        </Box>

        <Divider />

        {/* Input */}
        <Box sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField
              ref={inputRef}
              fullWidth
              placeholder={t('chatbot.placeholder')}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isTyping}
              multiline
              maxRows={3}
              variant="outlined"
              size="small"
            />
            <IconButton
              color="primary"
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isTyping}
              sx={{ alignSelf: 'flex-end' }}
            >
              <SendIcon />
            </IconButton>
          </Box>
          
          {/* Quick Actions */}
          <Box sx={{ mt: 2 }}>
            <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
              <LightbulbIcon fontSize="small" sx={{ mr: 0.5, verticalAlign: 'middle' }} />
              Quick Questions:
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {chatSuggestions.slice(0, 4).map((suggestion, index) => (
                <Chip
                  key={index}
                  label={suggestion}
                  size="small"
                  variant="outlined"
                  onClick={() => handleSuggestionClick(suggestion)}
                  sx={{ cursor: 'pointer', fontSize: '0.75rem' }}
                />
              ))}
            </Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  )
}

export default ChatBot
