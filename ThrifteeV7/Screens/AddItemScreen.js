import {
  ActivityIndicator,
  Alert,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState, useContext} from 'react';
import {FloatingAction} from 'react-native-floating-action';
import ImagePicker from 'react-native-image-crop-picker';
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
import SelectList from 'react-native-dropdown-select-list';

import {AuthContext} from '../Navigation/AuthProvider';

const AddItemScreen = () => {
  const {user, logout} = useContext(AuthContext);

  //01- make a state
  //02 - save to state using setPost etc.
  //o3 - upload using post etc

  const [image, setImage] = useState(null);

  const [uploading, setUploading] = useState(false);
  const [transferred, setTransferred] = useState(0);

  //for post description
  const [post, setPost] = useState(null);

  const [price, setPrice] = useState(0);
  const [saleGiveAway, setSaleGiveAway] = useState('');
  const [cateogary, setCateogary] = useState('');

  const choosePhotoFromLibrary = () => {
    ImagePicker.openPicker({
      width: 1200,
      height: 780,
      cropping: true,
    }).then(image => {
      console.log(image);
      const imageUri = Platform.OS === 'ios' ? image.sourceURL : image.path;
      setImage(imageUri);
    });
  };

  const submitPost = async () => {
    const imageUrl = await uploadImage();

    console.log('Image Url: ', imageUrl);

    firestore()
      .collection('posts')
      .add({
        userId: user.uid,
        post: post,
        postIndex: post.split(' '),
        postImg: imageUrl,
        postTime: firestore.Timestamp.fromDate(new Date()),
        price: Number(price),
        saleOrGiveaway: saleGiveAway,
        cateogary,
      })
      .then(() => {
        console.log('Item post added');
        Alert.alert('Item post published successfully');
        setPost(null);
      })
      .catch(error => {
        console.log('error : could not add post to firepost', error);
      });
  };

  const uploadImage = async () => {
    if (image == null) {
      return null;
    }
    const uploadUri = image;
    let filename = uploadUri.substring(uploadUri.lastIndexOf('/') + 1);

    // Add timestamp to File Name
    const extension = filename.split('.').pop();
    const name = filename.split('.').slice(0, -1).join('.');
    filename = name + Date.now() + '.' + extension;

    setUploading(true);
    setTransferred(0);

    const storageRef = storage().ref(`photos/${filename}`);
    const task = storageRef.putFile(uploadUri);

    //set transferred state
    task.on('state_changed', taskSnapshot => {
      console.log(
        `${taskSnapshot.bytesTransferred} transferred out of ${taskSnapshot.totalBytes}`,
      );

      setTransferred(
        Math.round(taskSnapshot.bytesTransferred / taskSnapshot.totalBytes) *
          100,
      );
    });

    try {
      await task;

      const url = await storageRef.getDownloadURL();

      setUploading(false);
      setImage(null);

      Alert.alert(
        'image uploaded',
        'Your image has been uploaded to firebase cloud storage successfully',
      );

      return url;
    } catch (e) {
      console.log(e);
      return null;
    }

    setImage(null);
  };

  const saleGiveaway = [
    {key: '1', value: 'Sale'},
    {key: '2', value: 'Give Away'},
  ];

  const cateogaryList = [
    {key: '1', value: 'Electronics'},
    {key: '2', value: 'Books'},
    {key: '3', value: 'Clothing'},
    {key: '4', value: 'Sports'},
    {key: '5', value: 'Cosmetics'},
    {key: '6', value: 'Entertainment'},
    {key: '7', value: 'Acessories'},
    {key: '8', value: 'Other'},
  ];

  return (
    <View style={styles.container}>
      <View style={styles.InputWrapper}>
        {image != null ? (
          <Image style={styles.AddImage} source={{uri: image}} />
        ) : null}
        <TextInput
          style={styles.InputField}
          placeholder="Add your item description here"
          multiline
          numberOfLines={2}
          value={post}
          onChangeText={content => setPost(content)}
        />

        <TextInput
          style={styles.PriceBtnText}
          placeholder="Price(sale)"
          value={price}
          onChangeText={content => setPrice(content)}
        />

        <SelectList
          setSelected={setSaleGiveAway}
          data={saleGiveaway}
          // onSelect={() => alert(saleGiveAway)}
          placeholder="Sale/Give Away"
        />

        <View style={{marginBottom: 10}}></View>

        <SelectList
          setSelected={setCateogary}
          data={cateogaryList}
          // onSelect={() => alert(saleGiveAway)}
          placeholder="Cateogary"
        />

        <TouchableOpacity
          style={styles.photoBtn}
          onPress={choosePhotoFromLibrary}>
          <Text style={styles.PhotoBtnText}>Choose Photo</Text>
        </TouchableOpacity>

        {uploading ? (
          <View style={styles.StatusWrapper}>
            <Text>{transferred} % Completed!</Text>
            <ActivityIndicator size="large" color="#0000ff" />
          </View>
        ) : (
          <TouchableOpacity style={styles.SubmitBtn} onPress={submitPost}>
            <Text style={styles.SubmitBtnText}>Post</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default AddItemScreen;

const styles = StyleSheet.create({
  container: {flex: 1, alignItems: 'center', justifyContent: 'center'},
  InputWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    backgroundColor: '#2e64e515',
  },
  InputField: {
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 24,
    textAlign: 'center',
    width: '90%',
    marginBottom: 15,
  },
  AddImage: {
    width: '100%',
    height: 250,
    marginBottom: 15,
  },
  photoBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    // backgroundColor: ' #2e64e515',
    borderRadius: 5,
    padding: 10,
  },
  PhotoBtnText: {
    fontSize: 16,
    fontWeight: 'bold',
    // color: '#2e64e5',
  },
  PriceBtnText: {
    fontSize: 16,
    // fontWeight: 'bold',
    // color: '#2e64e5',
  },
  StatusWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  SubmitBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: ' #2e64e515',
    borderRadius: 5,
    padding: 10,
  },
  SubmitBtnText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2e64e5',
  },
});
