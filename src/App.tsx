import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles } from 'lucide-react';
import { mastraClient } from './mastraClient';
import './App.css'

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

// Get a reference to your local agent
const agent = mastraClient.getAgent("dev-agent-id");

// Generate responses
const response = async () => {
  await agent.generate({
    messages: [
      {
        role: "user",
        content: "Hello, I'm testing the local development setup!",
      },
    ],
  });
}

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: '你好！我是AI助手，很高兴为你服务。有什么我可以帮助你的吗？',
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const simulateAIResponse = (userMessage: string): string => {
    const responses = [
      '这是一个很有趣的问题！让我来为你详细解答...',
      '我理解你的意思。根据我的分析，我建议...',
      '这个话题很有深度。从多个角度来看...',
      '好的，我来帮你分析一下这个情况...',
      '非常好的问题！让我为你提供一些见解...'
    ];
    return responses[Math.floor(Math.random() * responses.length)] + `（回复：${userMessage}）`;
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // 模拟AI响应延迟
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: simulateAIResponse(inputMessage),
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-indigo-900 flex flex-col">
      {/* 头部标题 */}
      <div className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700/50 p-4">
        <div className="flex items-center justify-center space-x-3">
          <div className="relative">
            <Sparkles className="w-8 h-8 text-cyan-400 animate-pulse" />
            <div className="absolute inset-0 w-8 h-8 bg-cyan-400/20 rounded-full blur-md animate-pulse"></div>
          </div>
          <h1 className="text-2xl font-bold text-white bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            一个获取以太坊当前 gas 的 Agent
          </h1>
        </div>
      </div>

      {/* 消息区域 */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex items-start space-x-3 ${message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
              }`}
          >
            {/* 头像 */}
            <div className={`relative flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${message.sender === 'user'
              ? 'bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg shadow-purple-500/30'
              : 'bg-gradient-to-r from-cyan-500 to-blue-500 shadow-lg shadow-cyan-500/30'
              }`}>
              {message.sender === 'user' ? (
                <User className="w-5 h-5 text-white" />
              ) : (
                <Bot className="w-5 h-5 text-white" />
              )}
              <div className={`absolute inset-0 rounded-full blur-md ${message.sender === 'user' ? 'bg-purple-500/20' : 'bg-cyan-500/20'
                }`}></div>
            </div>

            {/* 消息气泡 */}
            <div className={`relative max-w-[70%] px-4 py-3 rounded-2xl backdrop-blur-sm ${message.sender === 'user'
              ? 'bg-gradient-to-r from-purple-600/80 to-pink-600/80 text-white ml-auto border border-purple-500/30 shadow-lg shadow-purple-500/20'
              : 'bg-gray-800/80 text-gray-100 border border-gray-600/30 shadow-lg shadow-gray-800/20'
              }`}>
              <p className="text-sm leading-relaxed">{message.content}</p>
              <div className={`absolute inset-0 rounded-2xl blur-sm -z-10 ${message.sender === 'user' ? 'bg-purple-500/10' : 'bg-gray-600/10'
                }`}></div>
            </div>
          </div>
        ))}

        {/* AI正在输入指示器 */}
        {isTyping && (
          <div className="flex items-start space-x-3">
            <div className="relative flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center bg-gradient-to-r from-cyan-500 to-blue-500 shadow-lg shadow-cyan-500/30">
              <Bot className="w-5 h-5 text-white" />
              <div className="absolute inset-0 rounded-full bg-cyan-500/20 blur-md"></div>
            </div>
            <div className="relative bg-gray-800/80 px-4 py-3 rounded-2xl border border-gray-600/30 shadow-lg shadow-gray-800/20">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
              <div className="absolute inset-0 rounded-2xl bg-gray-600/10 blur-sm -z-10"></div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* 输入区域 */}
      <div className="p-4 bg-gray-800/50 backdrop-blur-sm border-t border-gray-700/50">
        <div className="max-w-4xl mx-auto">
          <div className="relative flex items-center space-x-3">
            <div className="relative flex-1">
              <input
                ref={inputRef}
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="输入你的消息..."
                className="w-full px-4 py-3 bg-gray-900/80 text-white placeholder-gray-400 rounded-xl border border-gray-600/50 focus:border-cyan-400/70 focus:outline-none focus:ring-2 focus:ring-cyan-400/20 transition-all duration-200 backdrop-blur-sm shadow-lg"
                disabled={isTyping}
              />
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-500/5 to-purple-500/5 blur-sm -z-10"></div>
            </div>

            <button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isTyping}
              className="relative group p-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl hover:from-cyan-600 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed transition-all duration-200 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
            >
              <Send className="w-5 h-5 group-hover:translate-x-0.5 transition-transform duration-200" />
              <div className="absolute inset-0 rounded-xl bg-cyan-400/20 blur-md group-hover:bg-cyan-400/30 transition-all duration-200 -z-10"></div>
            </button>
          </div>

          <p className="text-xs text-gray-400 mt-2 text-center">
            按 Enter 发送消息，Shift + Enter 换行
          </p>
        </div>
      </div>
    </div>
  );
};

export default App
