import React, {useState, useEffect, useContext} from 'react';
import {View, StyleSheet, FlatList, Text} from 'react-native';
import firestore from '@react-native-firebase/firestore';

import {AuthContext} from '../Navigation/AuthProvider';
import ChatCard from '../components/ChatCard';

const ChatHistoryScreen = ({navigation, route}) => {
  const [sentChats, setSentChats] = useState(null);
  const [receivedChats, setReceivedChats] = useState(null);
  const [loading, setLoading] = useState(true);
  const {user, logout} = useContext(AuthContext);

  const fetchSentChats = async () => {
    try {
      const list = [];

      await firestore()
        .collection('chats')
        .where('userId', '==', user.uid)
        .where('sentToUserId', '==', route.params.userId)
        .orderBy('sentTime', 'desc')
        .get()
        .then(querySnapshot => {
          // console.log('Total Posts : ', querySnapshot.size);

          querySnapshot.forEach(doc => {
            //fields to get from firestore
            const {sentTime, sentToUserId, sentmsg, userId} = doc.data();
            list.push({
              sentTime,
              sentToUserId,
              sentmsg,
              userId,
            });
          });
        });

      setSentChats(list);

      if (loading) {
        setLoading(false);
      }

      console.log('Chats: ', sentChats);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchReceivedChats = async () => {
    try {
      const list = [];

      await firestore()
        .collection('chats')
        .where('userId', '==', route.params.userId)
        .where('sentToUserId', '==', user.uid)
        .orderBy('sentTime', 'desc')
        .get()
        .then(querySnapshot => {
          // console.log('Total Posts : ', querySnapshot.size);

          querySnapshot.forEach(doc => {
            //fields to get from firestore
            const {sentTime, sentToUserId, sentmsg, userId} = doc.data();
            list.push({
              sentTime,
              sentToUserId,
              sentmsg,
              userId,
            });
          });
        });

      setReceivedChats(list);

      if (loading) {
        setLoading(false);
      }

      console.log('Chats: ', receivedChats);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchSentChats();
    fetchReceivedChats();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Sent Messages</Text>
      <FlatList
        data={sentChats}
        renderItem={({item}) => <ChatCard item={item} />}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
      />
      <View style={styles.Divider} />
      <Text style={styles.text}>Received Messages</Text>
      <FlatList
        data={receivedChats}
        renderItem={({item}) => <ChatCard item={item} />}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  Divider: {
    borderEndColor: 'black',
    borderTopWidth: 1,
    width: '92%',
    alignSelf: 'center',
    marginTop: 15,
  },
  text: {
    marginTop: 10,
    fontSize: 14,
    color: 'black',
  },
});
export default ChatHistoryScreen;
