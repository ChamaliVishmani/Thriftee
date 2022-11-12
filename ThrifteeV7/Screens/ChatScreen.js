import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Linking,
  Platform,
  Button,
} from 'react-native';
import React, {useState, useEffect, useCallback, useContext} from 'react';
import {Bubble, GiftedChat, Send} from 'react-native-gifted-chat';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import firestore from '@react-native-firebase/firestore';
import MapView from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import RNLocation from 'react-native-location';

RNLocation.configure({
  distanceFilter: null,
});

import {AuthContext} from '../Navigation/AuthProvider';
// import {currentLatitude, currentLongitude} from '../components/GetLocation';

const ChatScreen = ({navigation, route}) => {
  const {user, logout} = useContext(AuthContext);

  const [messages, setMessages] = useState([]);

  const [loading, setLoading] = useState(true);

  const [userData, setUserData] = useState(null);

  const [currentLongitude, setCurrentLongitude] = useState('...');
  const [currentLatitude, setCurrentLatitude] = useState('...');
  const [locationStatus, setLocationStatus] = useState('');

  // console.log(currentLatitude, currentLongitude);

  //const [userData, setUserData] = useState(null);

  // const getUser = async () => {
  //   await firestore()
  //     .collection('users')
  //     .doc(route.params ? route.params.userId : user.uid)
  //     .get()
  //     .then(documentSnapshot => {
  //       if (documentSnapshot.exists) {
  //         console.log('User Data', documentSnapshot.data());
  //         setUserData(documentSnapshot.data());
  //       }
  //     });
  //   //console.log(userData);
  // };
  // const getUser = async () => {
  //   const currentUser = await firestore()
  //     .collection('users')
  //     .doc(user.uid)
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
        .where('userId', '==', route.params ? route.params.userId : user.uid)
        .get()
        .then(querySnapshot => {
          // console.log('Total Posts : ', querySnapshot.size);

          querySnapshot.forEach(doc => {
            //fields to get from firestore
            const {userImg, about, email, fname, status} = doc.data();
            list.push({
              userImg,
              about,
              email,
              fname,
              status,
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
    navigation.addListener('Focus', () => setLoading(!loading));
    setMessages([
      {
        _id: 1,
        //text: route.params.userId,
        location: {
          latitude: 6.9271,
          longitude: 79.8612,
        },
        createdAt: new Date(),
        user: {
          _id: 2,
          name: user.fname,
          avatar: {uri: user.userImg},
        },
      },
      {
        _id: 2,
        //text: user.uid,
        createdAt: new Date(),
        user: {
          _id: 1,
          name: 'React Native',
          avatar: {uri: user.userImg},
        },
      },
    ]);

    // const requestLocationPermission = async () => {
    //   if (Platform.OS === 'ios') {
    //     getOneTimeLocation();
    //     subscribeLocationLocation();
    //   } else {
    //     try {
    //       const granted = await PermissionsAndroid.request(
    //         PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    //         {
    //           title: 'Location Access Required',
    //           message: 'This App needs to Access your location',
    //         },
    //       );
    //       if (granted === PermissionsAndroid.RESULTS.GRANTED) {
    //         //To Check, If Permission is granted
    //         getOneTimeLocation();
    //         subscribeLocationLocation();
    //       } else {
    //         setLocationStatus('Permission Denied');
    //       }
    //     } catch (err) {
    //       console.warn(err);
    //     }
    //   }
    // };
    // requestLocationPermission();
    // return () => {
    //   Geolocation.clearWatch(watchID);
    // };
  }, [navigation, loading]);

  // const getOneTimeLocation = () => {
  //   setLocationStatus('Getting Location ...');
  //   Geolocation.getCurrentPosition(
  //     //Will give you the current location
  //     position => {
  //       setLocationStatus('You are Here');

  //       //getting the Longitude from the location json
  //       const currentLongitude = JSON.stringify(position.coords.longitude);

  //       //getting the Latitude from the location json
  //       const currentLatitude = JSON.stringify(position.coords.latitude);

  //       //Setting Longitude state
  //       setCurrentLongitude(currentLongitude);

  //       //Setting Longitude state
  //       setCurrentLatitude(currentLatitude);
  //     },
  //     error => {
  //       setLocationStatus(error.message);
  //     },
  //     {
  //       enableHighAccuracy: false,
  //       timeout: 30000,
  //       maximumAge: 1000,
  //     },
  //   );
  // };

  // const subscribeLocationLocation = () => {
  //   watchID = Geolocation.watchPosition(
  //     position => {
  //       //Will give you the location on location change

  //       setLocationStatus('You are Here');
  //       console.log(position);

  //       //getting the Longitude from the location json
  //       const currentLongitude = JSON.stringify(position.coords.longitude);

  //       //getting the Latitude from the location json
  //       const currentLatitude = JSON.stringify(position.coords.latitude);

  //       //Setting Longitude state
  //       setCurrentLongitude(currentLongitude);

  //       //Setting Latitude state
  //       setCurrentLatitude(currentLatitude);
  //     },
  //     error => {
  //       setLocationStatus(error.message);
  //     },
  //     {
  //       enableHighAccuracy: false,
  //       maximumAge: 1000,
  //     },
  //   );
  // };

  const sendMessage = async messages => {
    // const imageUrl = await uploadImage();

    //console.log('Image Url: ', imageUrl);
    firestore()
      .collection('chats')
      .add({
        userId: user.uid,
        sentmsg: messages,

        // postIndex: post.split(' '),
        //postImg: imageUrl,
        sentTime: firestore.Timestamp.fromDate(new Date()),
        // likes: null,
        // comments: null,
        //price: price,
        sentToUserId: route.params.userId,
      })
      // .then(() => {
      //   console.log('Item post added');
      //   Alert.alert('Item post published successfully');
      //   setPost(null);
      // })
      .catch(error => {
        console.log('error : could not send message to firebase', error);
      });
  };

  const onSend = useCallback((messages = []) => {
    sendMessage(messages[messages.length - 1].text);
    // console.log('messageee', messages);
    setMessages(previousMessages =>
      GiftedChat.append(previousMessages, messages),
    );
  }, []);

  //change send icon
  const renderSend = props => {
    return (
      <Send {...props}>
        <View>
          <MaterialCommunityIcons
            name="send-circle"
            style={{marginBottom: 5, marginRight: 5}}
            size={32}
            color="#2e64e5"
          />
        </View>
      </Send>
    );
  };

  const renderBubble = props => {
    const {currentMessage} = props;
    // if (currentMessage.location) {
    //   return <LocationView location={currentMessage.location} />;
    // }
    return (
      <Bubble
        {...props}
        wrapperStyle={{right: {backgroundColor: '#2e64e5'}}}
        textStyle={{right: {color: '#fff'}}}
      />
    );
  };

  //customize scroll to bottom button
  const scrollToBottomComponent = () => {
    return <FontAwesome name="angle-double-down" size={22} color="#333" />;
  };

  // creating custom view in react native gifted chat
  const LocationView = ({location}) => {
    const openMaps = () => {
      const url = Platform.select({
        ios: `http://maps.apple.com/?ll=${location.latitude},${location.longitude}`,
        android: `http://maps.google.com/?q=${location.latitude},${location.longitude}`,
      });
      Linking.canOpenURL(url)
        .then(supported => {
          if (supported) {
            return Linking.openURL(url);
          }
        })
        .catch(err => {
          console.error('An error occurred', err);
        });
    };
    return (
      <TouchableOpacity
        onPress={openMaps}
        style={{backgroundColor: 'gray', width: 250, height: 250}}>
        <MapView
          style={{height: 250, width: 250}}
          region={{
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.015,
            longitudeDelta: 0.0121,
          }}
          annotations={[
            {
              latitude: location.latitude,
              longitude: location.longitude,
            },
          ]}
          scrollEnabled={false}
          zoomEnabled={false}
        />
      </TouchableOpacity>
    );
  };

  const permissionHandle = async () => {
    console.log('here');

    let permission = await RNLocation.checkPermission({
      ios: 'whenInUse', // or 'always'
      android: {
        detail: 'coarse', // or 'fine'
      },
    });

    console.log('here2');
    console.log(permission);

    let location;

    if (!permission) {
      permission = await RNLocation.requestPermission({
        ios: 'whenInUse',
        android: {
          detail: 'coarse',
          rationale: {
            title: 'We need to access your location',
            message: 'We use your location to show where you are on the map',
            buttonPositive: 'OK',
            buttonNegative: 'Cancel',
          },
        },
      });
      console.log(permission);
      location = await RNLocation.getLatestLocation({timeout: 100});
      console.log(
        location,
        location.longitude,
        location.latitude,
        location.timestamp,
      );
    } else {
      console.log('Here 7');
      location = await RNLocation.getLatestLocation({timeout: 100});
      console.log(
        location,
        location.longitude,
        location.latitude,
        location.timestamp,
      );
    }
  };

  return (
    <>
      {/* <Button title="Button" onPress={getOneTimeLocation} /> */}
      {/* <Button title="Get Location" onPress={permissionHandle} /> */}
      <GiftedChat
        messages={messages}
        onSend={messages => onSend(messages)}
        user={{
          _id: 1,
        }}
        renderBubble={renderBubble}
        alwaysShowSend
        renderSend={renderSend}
        scrollToBottom
        scrollToBottomComponent={scrollToBottomComponent}
      />
    </>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({});
