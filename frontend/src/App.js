import './App.css';
import React, { useState, useEffect } from 'react';
import EmotionSelector from './components/EmotionSelector';
import MessageList from './components/MessageList';
import styled from 'styled-components';

const Background = styled.div`
  padding: 30px;
  width: 100vw;
  height: 100vh;
  min-width: 800px;
  // min-height: 900px;
  background: linear-gradient(to bottom, #f0f0f0, ${(props) => (props.color)}); 
`;

function App() {
  const [selectedEmotionColor, setEmotionColor] = useState('black');

  const emotionColor = (color) => {
    setEmotionColor(color);
  };

  const [selectedEmotion, setSelectedEmotion] = useState('none');
    // const [selectedEmotionColor, setEmotionColor] = useState('black');

  const emotionSelect = (emotion) => {
    setSelectedEmotion(emotion);
  };

  const resetChat = () => {
    // setTimeout(() => {
    //   window.scrollTo(0, 0);
    // }, 200);
  };

  useEffect(() => {
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 50);
  }, [selectedEmotion]);


  return (
    <div className='app'>
      <Background color={selectedEmotionColor}>
        <h1>Talk to your Inside</h1>
        <EmotionSelector selectedEmotion={selectedEmotion} emotionSelect={emotionSelect} emotionColor={emotionColor} resetChat={resetChat}/>
        <MessageList selectedEmotion={selectedEmotion} selectedEmotionColor={selectedEmotionColor} resetChat={resetChat}/>
      </Background>
    </div>
  );
}

export default App;
