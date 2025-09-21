
import {
  Box,
  Paper,
  Typography,
  Avatar
} from '@mui/material'
import {
  SmartToy as BotIcon,
  Person as PersonIcon
} from '@mui/icons-material'
import { format } from 'date-fns'

interface Message {
  id: number
  text: string
  isUser: boolean
  timestamp: Date
  suggestions?: string[]
}

interface MessageBubbleProps {
  message: Message
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const formatTime = (date: Date) => {
    return format(date, 'HH:mm')
  }

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: message.isUser ? 'flex-end' : 'flex-start',
        mb: 2,
        alignItems: 'flex-start',
        gap: 1
      }}
    >
      {!message.isUser && (
        <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
          <BotIcon fontSize="small" />
        </Avatar>
      )}
      
      <Box sx={{ maxWidth: '70%' }}>
        <Paper
          elevation={1}
          sx={{
            p: 2,
            bgcolor: message.isUser ? 'primary.main' : 'grey.100',
            color: message.isUser ? 'white' : 'text.primary',
            borderRadius: message.isUser ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
            position: 'relative'
          }}
        >
          <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
            {message.text}
          </Typography>
          
          <Typography
            variant="caption"
            sx={{
              display: 'block',
              mt: 1,
              opacity: 0.7,
              fontSize: '0.7rem'
            }}
          >
            {formatTime(message.timestamp)}
          </Typography>
        </Paper>
      </Box>
      
      {message.isUser && (
        <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.main' }}>
          <PersonIcon fontSize="small" />
        </Avatar>
      )}
    </Box>
  )
}

export default MessageBubble
