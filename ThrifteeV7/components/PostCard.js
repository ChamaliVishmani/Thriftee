import React, {useContext, useEffect, useState} from 'react';
import {Text, View, StyleSheet, Image, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import moment from 'moment';
import firestore from '@react-native-firebase/firestore';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import {AuthContext} from '../Navigation/AuthProvider';
import {windowWidth} from '../utility/Dimensions';
import ProgressiveImage from './ProgressiveImage';

const PostCard = ({
  item,
  onDelete,
  onPress,
  onMessage,
  onChatHistory,
  onLocation,
}) => {
  const {user, logout} = useContext(AuthContext);

  const [userData, setUserData] = useState(null);

  // if (item.comments == 1) {
  //   commentText = '1 message';
  // } else if (item.comments > 1) {
  //   commentText = item.comments + ' messages';
  // } else {
  //   commentText = 'message';
  // }

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
        <Image
          style={styles.UserImg}
          source={{
            uri: userData
              ? userData.userImg
              : 'https://lh5.googleusercontent.com/-b0PKyNuQv5s/AAAAAAAAAAI/AAAAAAAAAAA/AMZuuclxAM4M1SCBGAO7Rp-QP6zgBEUkOQ/s96-c/photo.jpg',
          }}
        />
        <View style={styles.UserInfoText}>
          <TouchableOpacity onPress={onPress}>
            <Text style={styles.UserName}>
              {' '}
              {userData ? userData.fname || 'Test ' : 'Test '}{' '}
              {userData ? userData.lname || 'User' : 'User'}
            </Text>
          </TouchableOpacity>

          <Text style={styles.PostTime}>
            {moment(item.postTime.toDate()).fromNow()}
          </Text>
        </View>
      </View>

      {item.saleOrGiveaway != '1' ? (
        <View style={{flexDirection: 'row', marginLeft: 10}}>
          <FontAwesome name="gift" size={25} />
          <Text style={styles.Price}>Rs.{item.price}</Text>
        </View>
      ) : (
        <View style={{flexDirection: 'row', marginLeft: 10}}>
          <FontAwesome name="dollar" size={25} />
          <Text style={styles.Price}>Rs.{item.price}</Text>
        </View>
      )}

      <Text style={styles.PostText}>{item.post}</Text>
      {/* {item.postImg != null ? (
        <Image style={styles.PostImg} source={{uri: item.postImg}} />
      ) : (
        <View style={styles.Divider} />
      )} */}

      {item.postImg != null ? (
        <ProgressiveImage
          defaultImageSource={require('../assets/default-img.jpg')}
          source={{uri: item.postImg}}
          style={styles.PostImg}
          resizeMode="cover"
        />
      ) : (
        <View style={styles.Divider} />
      )}

      {/* <Image
          style={styles.PostImg}
          source={require('../assets/posts/post-img-2.jpg')}
        /> */}
      {/* <View style={styles.Divider} /> */}
      <View style={styles.InteractionWrapper}>
        {/* <Icon name="heart-outline" size={25} />
        <TouchableOpacity style={styles.Interaction}>
          <Text>like</Text>
        </TouchableOpacity> */}

        {/* can be deleted only by the logged in user */}
        {user.uid == item.userId ? (
          <TouchableOpacity
            style={styles.Interaction}
            onPress={() => onDelete(item.id)}>
            <Icon name="md-trash-bin" size={25} />
          </TouchableOpacity>
        ) : (
          <>
            <TouchableOpacity
              style={styles.Interaction}
              onPress={() => onMessage(item.id)}>
              <Icon name="md-chatbubble-outline" size={25} />
              <Text>Chat</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.Interaction}
              onPress={() => onChatHistory(item.id)}>
              <Icon name="md-chatbubble-outline" size={25} />
              <Text>Chat History</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.Interaction}
              onPress={() =>
                onLocation(item.id, item.latittude, item.longitude)
              }>
              <Icon name="location-outline" size={25} />
              <Text>Location</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
};

export default PostCard;

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
  PostText: {
    fontSize: 14,
    paddingLeft: 15,
    paddingRight: 15,
    marginBottom: 15,
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
});
