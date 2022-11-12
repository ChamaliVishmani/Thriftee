import React, {useContext, useEffect, useState} from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  Alert,
  ScrollView,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {Searchbar} from 'react-native-paper';

import {AuthContext} from '../Navigation/AuthProvider';
import PostCard from '../components/PostCard';

const SearchScreen = () => {
  const [posts, setPosts] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleted, setDeleted] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');

  const onChangeSearch = query => setSearchQuery(query);

  const fetchPosts = async () => {
    try {
      const list = [];

      await firestore()
        .collection('posts')
        .where('postIndex', 'array-contains', searchQuery)
        .orderBy('postTime', 'desc')
        .get()
        .then(querySnapshot => {
          // console.log('Total Posts : ', querySnapshot.size);

          querySnapshot.forEach(doc => {
            //fields to get from firestore
            const {
              userId,
              post,
              postImg,
              postTime,
              cateogary,
              price,
              saleOrGiveaway,
            } = doc.data();
            list.push({
              id: doc.id,
              userId,
              userName: 'Test name',
              userImg: postImg,
              postTime: postTime,
              post,
              postImg,
              price,
              cateogary,
              saleOrGiveaway,
            });
          });
        });

      setPosts(list);

      if (loading) {
        setLoading(false);
      }

      console.log('Posts: ', posts);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [searchQuery]);

  useEffect(() => {
    fetchPosts();
    setDeleted(false);
  }, [deleted]);

  //show conformation when post deleted
  const handleDelete = postId => {
    Alert.alert(
      'Delete post',
      'Are you sure?',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel pressed'),
          style: 'cancel',
        },
        {
          text: 'COnfirm',
          onPress: () => deletePost(postId),
        },
      ],
      {cancelable: false},
    );
  };

  const deletePost = postId => {
    console.log('current post id: ', postId);

    //check if post image is available
    firestore()
      .collection('posts')
      .doc(postId)
      .get()
      .then(documentSnapshot => {
        if (documentSnapshot.exists) {
          const {postImg} = documentSnapshot.data();

          if (postImg != null) {
            const storageRef = storage().refFromURL(postImg);
            const imageRef = storage().ref(storageRef.fullPath);

            imageRef
              .delete()
              .then(() => {
                console.log(`${postImg} has been deleted successfully.`);
                deleteFirestoreData(postId);
                setDeleted(true);
              })
              .catch(e => {
                console.log('error while deleting the image ', e);
              });
          } else {
            //if item image not available
            deleteFirestoreData(postId);
          }
        }
      });
  };

  const deleteFirestoreData = postId => {
    firestore()
      .collection('posts')
      .doc(postId)
      .delete()
      .then(() => {
        Alert.alert('post deleted', 'post deleted sucessfully');
      })
      .catch(e => console.log('error deleting the post', e));
  };

  const ListHeader = () => {
    return null;
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <Searchbar
        placeholder="Search"
        onChangeText={onChangeSearch}
        value={searchQuery}
      />
      {/* <TouchableOpacity>
          <Text>Search</Text>
        </TouchableOpacity> */}
      {loading ? (
        <ScrollView
          style={{flex: 1}}
          contentContainerStyle={{alignItems: 'center'}}>
          <SkeletonPlaceholder>
            {/* make skeleton of the post to add shimmer effect */}
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <View style={{width: 60, height: 60, borderRadius: 50}} />
              <View style={{marginLeft: 20}}>
                <View style={{width: 120, height: 20, borderRadius: 4}} />
                <View
                  style={{marginTop: 6, width: 80, height: 20, borderRadius: 4}}
                />
              </View>
            </View>
            <View style={{marginTop: 10, marginBottom: 30}}>
              <View style={{width: 300, height: 20, borderRadius: 4}} />
              <View
                style={{marginTop: 6, width: 250, height: 20, borderRadius: 4}}
              />
              <View
                style={{marginTop: 6, width: 350, height: 200, borderRadius: 4}}
              />
            </View>
          </SkeletonPlaceholder>
          <SkeletonPlaceholder>
            {/* make skeleton of the post to add shimmer effect */}
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <View style={{width: 60, height: 60, borderRadius: 50}} />
              <View style={{marginLeft: 20}}>
                <View style={{width: 120, height: 20, borderRadius: 4}} />
                <View
                  style={{marginTop: 6, width: 80, height: 20, borderRadius: 4}}
                />
              </View>
            </View>
            <View style={{marginTop: 10, marginBottom: 30}}>
              <View style={{width: 300, height: 20, borderRadius: 4}} />
              <View
                style={{marginTop: 6, width: 250, height: 20, borderRadius: 4}}
              />
              <View
                style={{marginTop: 6, width: 350, height: 200, borderRadius: 4}}
              />
            </View>
          </SkeletonPlaceholder>
        </ScrollView>
      ) : (
        <View style={styles.container}>
          <FlatList
            data={posts}
            renderItem={({item}) => (
              <PostCard
                item={item}
                onDelete={handleDelete}
                onPress={() =>
                  navigation.navigate('HomeProfile', {userId: item.userId})
                }
                onMessage={() =>
                  navigation.navigate(
                    'Messages',
                    {screen: 'Chat', params: {userId: item.userId}},
                    {userId: item.userId},
                  )
                }
                onChatHistory={() =>
                  navigation.navigate(
                    'Messages',
                    {screen: 'ChatHistory', params: {userId: item.userId}},
                    {userId: item.userId},
                  )
                }
              />
            )}
            keyExtractor={item => item.id}
            ListHeaderComponent={ListHeader}
            ListFooterComponent={ListHeader}
            showsVerticalScrollIndicator={false}
          />
        </View>
      )}
    </SafeAreaView>
  );
};

export default SearchScreen;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  card: {
    backgroundColor: '#f8f8f8',
    width: '100%',
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
  PostImg: {
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
// firestore().collection("posts").where("postIndex", "array-contains", "dog")
