import React, {useContext, useEffect, useState} from 'react';
import {Text, View, StyleSheet, Image, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import moment from 'moment';
import firestore from '@react-native-firebase/firestore';

import {AuthContext} from '../Navigation/AuthProvider';
import {windowWidth} from '../utility/Dimensions';
import ProgressiveImage from './ProgressiveImage';

const ChatCard = ({item}) => {
  const {user, logout} = useContext(AuthContext);

  const [userData, setUserData] = useState(null);

  const getUser = async () => {
    await firestore()
      .collection('users')
      .doc(item.userId)
      .get()
      .then(documentSnapshot => {
        if (documentSnapshot.exists) {
          console.log('User Data', documentSnapshot.data());
          setUserData(documentSnapshot.data());
        }
      });
  };

  useEffect(() => {
    getUser();
  }, []);

  return (
    <View style={styles.card} key={item.id}>
      <View style={styles.UserInfo}>
        <View style={styles.UserInfoText}>
          <Text style={styles.PostTime}>
            {moment(item.sentTime.toDate()).fromNow()}
          </Text>
        </View>
      </View>
      <Text style={styles.sentText}>
        {item.userId == user.uid ? 'sent' : 'received'}
      </Text>
      <Text style={styles.ChatText}>{item.sentmsg}</Text>
      <View style={styles.Divider} />
    </View>
  );
};

export default ChatCard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  card: {
    width: windowWidth,
    justifyContent: 'center',
    backgroundColor: '#f8f8f8',
    flex: 1,
    marginBottom: 20,
    borderRadius: 10,
  },
  UserInfo: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    padding: 15,
  },
  UserImg: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  UserInfoText: {
    flexDirection: 'column',
    justifyContent: 'center',
    marginLeft: 10,
  },
  UserName: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  PostTime: {
    fontSize: 12,
    color: '#666',
  },
  ChatText: {
    fontSize: 20,
    paddingLeft: 15,
    paddingRight: 15,
    marginBottom: 15,
    color: 'black',
  },
  Price: {
    fontSize: 14,
    paddingLeft: 15,
    paddingRight: 15,
    marginBottom: 15,
    fontWeight: 'bold',
  },
  PostImg: {
    flex: 1,
    width: '100%',
    height: 250,
  },
  Divider: {
    borderBottomColor: '#dddddd',
    borderBottomWidth: 1,
    width: '92%',
    alignSelf: 'center',
    marginTop: 15,
  },
  InteractionWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 15,
  },
  Interaction: {
    flexDirection: 'row',
    justifyContent: 'center',
    borderRadius: 5,
    padding: 2,
    backgroundColor: '#2e64e515',
  },
  InteractionText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#2e64e5',
    marginTop: 5,
    marginLeft: 5,
  },
  sentText: {
    fontSize: 15,
    paddingLeft: 15,
    paddingRight: 15,
  },
});
