
import React, { useState } from 'react';
import { View, TextInput, Button, Text, FlatList, StyleSheet } from 'react-native';
import axios from 'axios';

export default function App () {

  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  
  const handleSendMessage1 = () => {
    setMessages([...messages, { text: inputMessage, isUser: true }])
    handleSendMessage2()
  }
  const handleSendMessage2 = async () => {
    if (inputMessage.trim() === '') return;
    try {
      const apiKey = ''; // Replace with your actual API key
      const url = 'https://api.openai.com/v1/chat/completions';
      const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      };
      const data = {
        model: 'gpt-3.5-turbo',
        temperature: 0.5,    
        messages: [
          { role: 'system', content: 'You are a helpful assistant.' },
          { role: 'user', content: inputMessage },
        ],
      };

      const response = await axios.post(url, data, { headers });
      const botReply = response.data.choices[0].message.content.trim();
      setMessages([...messages, { text: inputMessage, isUser: true } , { text: botReply, isUser: false }]);

      console.log(messages)
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const renderMessage = ({ item }) => (
    <View style={item.isUser ? styles.userMessageContainer : styles.aiMessageContainer}>
      <Text style={item.isUser ? styles.userMessage : styles.aiMessage}>
        {item.text}
      </Text>
    </View>
  ); 

  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 16 }}>
      <FlatList
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item, index) => index.toString()}
        style={{flex: 1,marginTop: 30}}
        //inverted
      />
      <TextInput
        style={{ borderWidth: 1, borderColor: '#ccc', padding: 8, marginBottom: 10 }}
        value={inputMessage}
        onChangeText={setInputMessage}
        placeholder="Type a message..."
      />
      <Button title="Send" onPress={handleSendMessage1} />
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'flex-end',
  },
  chatArea: {
    flex: 1,
    marginBottom: 10,
  },
  userMessageContainer: {
    alignItems: 'flex-end',
    marginBottom: 10,
    borderRadius: 200
  },
  aiMessageContainer: {
    alignItems: 'flex-start',
    marginBottom: 10,
    borderRadius: 200,
  },
  userMessage: {
    backgroundColor: '#007BFF',
    color: '#fff',
    padding: 10,
    borderRadius: 15
  },
  aiMessage: {
    backgroundColor: '#D3D3D3',
    color: '#333',
    padding: 10,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  sendButton: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
