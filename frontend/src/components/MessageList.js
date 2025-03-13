import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import axios from 'axios';

const ChatWindow = styled.div`
    font-size: 1.1rem;
    width: 700px;
    height: 500px;
    border: 3px solid ${(props) => (props.color)};
    border-radius: 15px;
    margin: 0 auto;
    position: relative;
    background: white;
    box-sizing: border-box;
    padding: 10px 0;
`

const ConversationWindow = styled.div`
    overflow-y: auto;
    padding: 10px;
    height: 75%;
    /* width: 98%; */
    padding: 10px;
    box-sizing: border-box;
`

const UserForm =  styled.p`
    background: ${(props) => (props.color)};
    border-radius: 10px;
    padding: 5px 10px;
    width: max-content;
    // height: 20%;
    max-width: 80%;
    margin-left: auto;
    margin-bottom: 5px;
    word-wrap: break-word;
    // font-size: 14px;
    // display: inline-block;
`

const ReplyForm =  styled.p`
    background: #d3d3d3;
    border-radius: 10px;
    padding: 5px 10px;
    width: max-content;
    max-width: 60%;
    margin-right: auto;
    margin-bottom: 5px;
    word-wrap: break-word;
    // font-size: 14px;
    // display: inline-block;
`

const MessageForm = styled.form`
    width: 97.5%;
    height: 25%;
    border-top: 3px solid ${(props) => props.color};
    position: absolute; 
    bottom: 0px;
    display: flex;
    align-items: center;
    padding: 0 10px;
    justify-content: space-evenly;
`;

const InputBox = styled.textarea`
    font-size: 1.1rem;
    outline: none;
    // margin: 1%;
    width: 90%;
    height: 80%;
    border-width: 0;
    resize: none;
    overflow-y: auto;
`;

const SendButton = styled.button`
    width: 15%;
    height: 40%;
    border: none;
    border-radius: 5px;
    // background-color: ${(props) => props.color || '#ccc'};
    color: white;
    font-size: 1rem;
    // cursor: pointer;
    background-color: ${(props) => (props.disabled ? '#d3d3d3' : props.color)};
    cursor: ${(props) => (props.disabled ? '' : 'pointer')};
    
    &:hover {
        opacity: ${(props) => (props.disabled ? '' : '0.8')};
    }
`

function MessageList({selectedEmotion, selectedEmotionColor, resetChat}){
    const[message, setMessage] = useState('');
    const[conversations, setConversations] = useState([]);
    const [isComposing, setIsComposing] = useState(false); // IME 상태 관리

    const handleReset = () => {
        setMessage(''); // user 채팅 기록 초기화
        setConversations([]);  // 답변 기록 초기화
    };

    // resetChat 함수가 호출되면 채팅 리셋
    useEffect(() => {
        handleReset();
    }, [resetChat]);
    
    const goToEndMessage = useRef(null);

    useEffect(() => {
        goToEndMessage.current?.scrollIntoView({ behavior: 'smooth' });
    }, [conversations]);
    

    if (selectedEmotion === 'none') {
        return (
            <div>
                <ChatWindow color='black' style={{ textAlign: 'center' }}>
                    <h2>감정을 선택해주세요!</h2>
                    <p>선택된 감정이 없습니다. 원하는 감정을 선택하면 대화를 시작할 수 있습니다.</p>
                </ChatWindow>
            </div>
        );
    }
    
    const chatSend = async () => {
        if(!message) return;
        try {
            const response = await axios.post('http://localhost:8007/chat', {msg : message, emotion : selectedEmotion});
            // setReplies(replies => [...replies, response.data.reply.content]);
            
            const newConversation = { userMsg : message, answer : response.data.reply.content };
            setConversations (conversations => [...conversations, newConversation]);
            setMessage('');
        } catch (error) {
            console.error ('Error during the chat request:', error);
            // setReplies(replies => [...replies, 'An error occurred while receiving the response']);
            const newConversation = { userMsg : message, answer: 'An error occurred while receiving the response'};
            setConversations (conversations => [...conversations, newConversation]);
            setMessage('');
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (message.trim()) {
            chatSend();
            setMessage('');
        }
    };
    
    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey && !isComposing) {
            e.preventDefault();
            handleSubmit(e);
        }
    };

    return(
        <div>
            <ChatWindow color={selectedEmotionColor}>
                <ConversationWindow>
                    {conversations.map((msg, index) => (
                        <div key={index}>
                            <UserForm color={selectedEmotionColor}>{msg.userMsg}</UserForm>
                            <ReplyForm>{msg.answer}</ReplyForm>
                        </div>))}
                    <div ref={goToEndMessage} />
                </ConversationWindow>
                <MessageForm color={selectedEmotionColor} onSubmit={handleSubmit}>
                    <InputBox
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={handleKeyDown}
                        onCompositionStart={() => setIsComposing(true)} 
                        onCompositionEnd={() => setIsComposing(false)}
                        placeholder="메시지를 입력하세요."
                    />
                    <SendButton 
                        type='submit'
                        color={selectedEmotionColor} 
                        disabled={!message.trim()}
                    >전송</SendButton>
                </MessageForm>
            </ChatWindow>
        </div>
    );
}

export default MessageList;