
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Group, Member, ChatMessage } from '../types';
import { getChatResponseStream } from '../services/geminiService';
import { Icon } from './common/Icon';
import Spinner from './common/Spinner';
import { useData } from '../contexts/DataContext';

interface ChatProps {
  group: Group;
  initialMember: Member | null;
}

const getChatSuggestions = (group: Group, chatTarget: Member | 'group'): string[] => {
    if (chatTarget === 'group') {
        return [
            `What's everyone's favorite song to perform?`,
            `Who is the messiest in the dorm?`,
            `Tell me a funny story from your trainee days.`,
            `What's your next comeback concept?`,
        ];
    }

    // It's a member
    const member = chatTarget;
    const suggestions: string[] = [
        `What's your favorite thing about being in ${group.name}?`,
        `Tell me more about your ${member.animal} character!`,
        `What do you do on your days off?`,
    ];

    // Add member-specific, fun suggestions
    if (member.id === 'leeknow') suggestions.push('How are your cats Sooni, Doongi, and Dori?');
    if (member.id === 'felix') suggestions.push('Can you bake me some brownies?');
    if (member.id === 'beomgyu') suggestions.push('Have you played any pranks recently?');
    if (member.id === 'sunghoon') suggestions.push('Do you miss figure skating?');
    if (member.id === 'jay') suggestions.push('What does "RAS" stand for again?');
    if (member.id === 'han') suggestions.push('Let\'s talk about cheesecake!');
    if (member.id === 'hueningkai') suggestions.push('Can you play a song on the piano for me?');
    if (member.id === 'sunoo') suggestions.push('Can you teach me how to take the best selfie?');
    
    // Add a generic one if no specific one was added to ensure variety
    if (suggestions.length === 3) {
        suggestions.push(`What's the story behind your iconic line?`);
    }

    // Shuffle and return a few to keep it fresh
    return suggestions.sort(() => 0.5 - Math.random()).slice(0, 4);
};


const Chat: React.FC<ChatProps> = ({ group, initialMember }) => {
  const { data, updateChatHistory } = useData();

  // State to manage the current chat target, which can be the whole group or a specific member.
  // This is the core of the solo/group chat functionality.
  const [chatTarget, setChatTarget] = useState<Member | 'group'>(() => {
    // Load the last-used chat target for this group from localStorage to maintain session continuity.
    const savedTargetId = localStorage.getItem(`chat-target-${group.id}`);
    if (savedTargetId) {
        if (savedTargetId === 'group') return 'group';
        const member = group.members.find(m => m.id === savedTargetId);
        return member || 'group';
    }
    // If nothing is saved, use the member passed from the profile page, or default to the group chat.
    return initialMember || 'group';
  });
  
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // A unique key for each chat session (e.g., 'skz-bangchan' or 'skz-group') to store separate histories.
  const chatKey = chatTarget === 'group' ? `${group.id}-group` : `${group.id}-${chatTarget.id}`;
  
  // If the user navigates from a profile, switch the chat target to that member.
  useEffect(() => {
    if (initialMember) {
        setChatTarget(initialMember);
    }
  }, [initialMember]);

  // Save the current chat target to localStorage whenever it changes.
  useEffect(() => {
    const targetId = chatTarget === 'group' ? 'group' : chatTarget.id;
    localStorage.setItem(`chat-target-${group.id}`, targetId);
  }, [chatTarget, group.id]);

  useEffect(() => {
    const savedMessages = data.chatHistory[chatKey] || [];
    setMessages(savedMessages);
  }, [chatKey, data.chatHistory]);

  const chatTargetName = chatTarget === 'group' ? `${group.name} Group Chat` : chatTarget.name;
  const chatTargetAvatar = chatTarget === 'group' ? `https://i.pravatar.cc/150?u=${group.id}` : chatTarget.avatarUrl;
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = useCallback(async (e: React.FormEvent | string) => {
    if (typeof e !== 'string') {
        e.preventDefault();
    }
    const currentInput = (typeof e === 'string' ? e : input).trim();
    if (!currentInput || isLoading) return;

    const userMessage: ChatMessage = { id: Date.now().toString(), sender: 'user', text: currentInput };
    const newMessagesWithUser = [...messages, userMessage];
    setMessages(newMessagesWithUser);
    updateChatHistory(chatKey, newMessagesWithUser);
    
    setInput('');
    setIsLoading(true);

    try {
        // Pass the conversation history and the specific chat target (member or undefined for group) to the AI service.
        // This is where the magic happens for switching between solo and group chats.
        const stream = await getChatResponseStream(newMessagesWithUser, group, chatTarget === 'group' ? undefined : chatTarget);
        
        const aiMessage: ChatMessage = { id: (Date.now() + 1).toString(), sender: 'ai', text: '', senderName: chatTargetName };
        setMessages(prev => {
            const newMessages = [...prev, aiMessage];
            updateChatHistory(chatKey, newMessages);
            return newMessages;
        });

        let accumulatedText = '';
        for await (const chunk of stream) {
            const chunkText = chunk.text;
            accumulatedText += chunkText;
            setMessages(prev => {
                const updatedMessages = prev.map(msg => 
                    msg.id === aiMessage.id ? { ...msg, text: accumulatedText } : msg
                );
                updateChatHistory(chatKey, updatedMessages);
                return updatedMessages;
            });
        }

    } catch (error) {
        console.error('Error fetching AI response:', error);
        const errorMessage: ChatMessage = {
            id: (Date.now() + 1).toString(),
            sender: 'ai',
            text: "Sorry, I'm having trouble connecting right now. Please try again later.",
            senderName: chatTargetName,
        };
        setMessages(prev => {
            const newMessages = [...prev, errorMessage];
            updateChatHistory(chatKey, newMessages);
            return newMessages;
        });
    } finally {
        setIsLoading(false);
    }
  }, [input, isLoading, messages, group, chatTarget, chatTargetName, updateChatHistory, chatKey]);

  const suggestions = getChatSuggestions(group, chatTarget);

  return (
    <div className="flex flex-col h-[70vh]">
      <div className="flex items-center p-2 border-b border-white/20 mb-4">
        <img src={chatTargetAvatar} alt={chatTargetName} className="w-10 h-10 rounded-full mr-3 object-cover" />
        <h3 className="font-bold text-lg">{chatTargetName}</h3>
        <div className="ml-auto relative group">
          <button className="p-2 rounded-full hover:bg-white/10" title="Switch Chat">
            <Icon icon="users" className="w-6 h-6"/>
          </button>
          {/* This dropdown allows switching between the group chat and individual member chats. */}
          <div className="absolute right-0 top-full mt-2 w-48 bg-black/70 border border-white/20 rounded-lg shadow-lg p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none group-hover:pointer-events-auto z-10">
            <button onClick={() => setChatTarget('group')} className="w-full text-left px-3 py-2 rounded hover:bg-white/10">Group Chat</button>
            {group.members.map(member => (
              <button key={member.id} onClick={() => setChatTarget(member)} className="w-full text-left px-3 py-2 rounded hover:bg-white/10">{member.name}</button>
            ))}
          </div>
        </div>
      </div>
      <div className="flex-grow overflow-y-auto pr-2 space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex items-end gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.sender === 'ai' && <img src={chatTargetAvatar} alt={chatTargetName} className="w-8 h-8 rounded-full object-cover"/>}
            <div className={`max-w-xs md:max-w-md p-3 rounded-2xl ${msg.sender === 'user' ? 'bg-[var(--accent-color)] text-black' : 'bg-white/20'}`}>
              <p className="whitespace-pre-wrap">{msg.text}</p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex items-end gap-2 justify-start">
             <img src={chatTargetAvatar} alt={chatTargetName} className="w-8 h-8 rounded-full object-cover"/>
             <div className="max-w-xs md:max-w-md p-3 rounded-2xl bg-white/20">
                <Spinner/>
             </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

       <div className="mt-4">
        {!isLoading && messages.length === 0 && (
           <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-2 no-scrollbar">
                {suggestions.map((suggestion) => (
                    <button 
                        key={suggestion} 
                        onClick={() => handleSendMessage(suggestion)} 
                        className="flex-shrink-0 px-3 py-1.5 text-sm bg-white/10 border border-white/20 rounded-full hover:bg-white/20 transition-colors"
                    >
                        {suggestion}
                    </button>
                ))}
            </div>
        )}

        <form onSubmit={handleSendMessage} className="flex items-center gap-2">
            <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Message ${chatTargetName}...`}
            className="flex-grow bg-white/10 border border-white/20 rounded-full py-3 px-5 focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)] transition-all"
            disabled={isLoading}
            />
            <button type="submit" disabled={isLoading || !input.trim()} className="bg-[var(--accent-color)] rounded-full p-3 text-black disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity">
            <Icon icon="send" className="w-6 h-6"/>
            </button>
        </form>
       </div>
    </div>
  );
};

export default Chat;