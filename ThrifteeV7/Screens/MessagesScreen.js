import {
  Button,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState, useEffect, useContext} from 'react';
import firestore from '@react-native-firebase/firestore';

import {AuthContext} from '../Navigation/AuthProvider';

const Messages = [
  {
    id: '1',
    userName: 'Jenny Doe',
    userImg: require('../assets/users/user-3.jpg'),
    messageTime: '4 mins ago',
    messageText:
      'Hey there, this is my test for a post of my social app in React Native.',
  },
  {
    id: '2',
    userName: 'John Doe',
    userImg: require('../assets/users/user-1.jpg'),
    messageTime: '2 hours ago',
    messageText:
      'Hey there, this is my test for a post of my social app in React Native.',
  },
  {
    id: '3',
    userName: 'Ken William',
    userImg: require('../assets/users/user-4.jpg'),
    messageTime: '1 hours ago',
    messageText:
      'Hey there, this is my test for a post of my social app in React Native.',
  },
  {
    id: '4',
    userName: 'Selina Paul',
    userImg: require('../assets/users/user-6.jpg'),
    messageTime: '1 day ago',
    messageText:
      'Hey there, this is my test for a post of my social app in React Native.',
  },
  {
    id: '5',
    userName: 'Christy Alex',
    userImg: require('../assets/users/user-7.jpg'),
    messageTime: '2 days ago',
    messageText:
      'Hey there, this is my test for a post of my social app in React Native.',
  },
];

const MessagesScreen = ({navigation}) => {
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const {user, logout} = useContext(AuthContext);

  // const getUser = async () => {
  //   await firestore()
  //     .collection('users')
  //     // .doc(route.params ? route.params.userId : user.uid)
  //     .get()
  //     .then(documentSnapshot => {
  //       if (documentSnapshot.exists) {
  //         console.log('User Data', documentSnapshot.data());
  //         setUserData(documentSnapshot.data());
  //       }
  //     });
  // };

  const fetchUsers = async () => {
    try {
      const list = [];

      await firestore()
        .collection('users')
        // .orderBy('postTime', 'desc')
        .get()
        .then(querySnapshot => {
          // console.log('Total Posts : ', querySnapshot.size);

          querySnapshot.forEach(doc => {
            //fields to get from firestore
            const {about, email, fname, status, lname, userImg} = doc.data();
            list.push({
              userImg: userImg,
              about,
              email,
              fname,
              status,
              id: doc.id,
              lname,
            });
          });
        });

      setUserData(list);

      if (loading) {
        setLoading(false);
      }

      //console.log('Posts: ', posts);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchUsers();
    //fetchPosts();
    navigation.addListener('Focus', () => setLoading(!loading));
  }, [navigation, loading]);

  return (
    <View style={styles.Container}>
      <FlatList
        data={userData}
        keyExtractor={item => item.uid}
        renderItem={({item}) =>
          item.id != user.uid ? (
            <TouchableOpacity
              style={styles.Card}
              onPress={() =>
                navigation.navigate('HomeProfile', {userId: item.id})
              }>
              <View style={styles.UserInfo}>
                <View style={styles.UserImgWrapper}>
                  <Image style={styles.UserImg} source={{uri: item.userImg}} />
                </View>
                <View style={styles.TextSection}>
                  <View style={styles.UserInfoText}>
                    <Text style={styles.UserName}>
                      {item.fname} {item.lname}
                    </Text>
                    {/* <Text style={styles.PostTime}>{item.status}</Text> */}
                  </View>
                  <Text style={styles.MessageText}>{item.about}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ) : null
        }
      />
    </View>
  );
};

export default MessagesScreen;

const styles = StyleSheet.create({
  Container: {
    flex: 1,
    paddingLeft: 20,
    paddingRight: 20,
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  Card: {width: '100%'},
  UserInfo: {flexDirection: 'row', justifyContent: 'space-between'},
  UserImgWrapper: {paddingTop: 15, paddingBottom: 15},
  UserImg: {width: 50, height: 50, borderRadius: 25},
  TextSection: {
    flexDirection: 'column',
    justifyContent: 'center',
    padding: 15,
    paddingLeft: 0,
    marginLeft: 10,
    width: 300,
    borderBottomWidth: 1,
    borderBottomColor: ' #cccccc',
  },
  UserInfoText: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  UserName: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  PostTime: {fontSize: 12, color: '#666'},
  MessageText: {fontSize: 14, color: '#333333'},
});
