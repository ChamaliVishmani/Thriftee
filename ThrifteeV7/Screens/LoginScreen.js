import React, {useContext, useState} from 'react';
// import {Platform} from 'react-native';
import {
  Image,
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Button,
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';

import colors from '../config/colors';
import FormInput from '../components/forms/FormInput';
import FormButton from '../components/forms/FormButton';
import SocialButton from '../components/SocialButton';
import {AuthContext} from '../Navigation/AuthProvider';

const LoginScreen = ({navigation}) => {
  //text input states
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();

  const {login, googleLogin} = useContext(AuthContext);

  return (
    <View style={styles.container}>
      <Image source={require('../assets/logo.png')} style={styles.logo} />
      <Text style={styles.text}>Thriftee</Text>

      <FormInput
        labelValue={email}
        onChangeText={userEmail => setEmail(userEmail)}
        placeholderText="Email"
        iconType="user"
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
      />

      <FormInput
        labelValue={password}
        onChangeText={userPassword => setPassword(userPassword)}
        placeholderText="Password"
        iconType="lock"
        secureTextEntry
      />

      <FormButton
        buttonTitle="Sign In"
        onPress={() => login(email, password)}
      />

      {/* <TouchableOpacity style={styles.forgotButton} onPress={() => {}}>
        <Text style={styles.navButtonText}>Forgot Password?</Text>
      </TouchableOpacity> */}

      <TouchableOpacity
        style={styles.forgotButton}
        onPress={() => navigation.navigate('Signup')}>
        <Text style={styles.navButtonText}>
          Don't have an account? Click here.
        </Text>
      </TouchableOpacity>

      {Platform.OS === 'android' ? (
        <View>
          {/* remove */}
          {/* <SocialButton
            buttonTitle="Sign In with Facebook"
            btnType="facebook"
            color="#4867aa"
            backgroundColor="#e6eaf4"
            onPress={() => {}}
          /> */}

          <SocialButton
            buttonTitle="Sign In with Google"
            btnType="google"
            color="#de4d41"
            backgroundColor="#f5e7ea"
            onPress={() => googleLogin()}
          />
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    paddingTop: 50,
  },
  logo: {
    height: 150,
    width: 150,
    resizeMode: 'cover',
  },
  text: {
    // fontFamily: "Kufam-SemiBoldItalic",
    fontSize: 28,
    marginBottom: 10,
    color: '#051d5f',
  },
  navButton: {
    marginTop: 15,
  },
  forgotButton: {
    marginVertical: 35,
  },
  navButtonText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#2e64e5',
    // fontFamily: "Lato-Regular",
  },
  //return <Text>LoginScreen</Text>;
});
export default LoginScreen;
