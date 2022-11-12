import React from 'react';
import {Text, View, StyleSheet, Image, TouchableOpacity} from 'react-native';
import Onboarding from 'react-native-onboarding-swiper';

import colors from '../config/colors';

const Done = ({...props}) => {
  return (
    <TouchableOpacity style={{marginHorizontal: 20}} {...props}>
      <Text style={{fontSize: 16, color: '#fff'}}>Done</Text>
    </TouchableOpacity>
  );
};

const Dots = ({selected}) => {
  let backgroundColor;

  //determine which onboard page we are in
  backgroundColor = selected ? 'rgba(0,0,0,0.8)' : 'rgba(0,0,0,0.3)';

  return (
    <View style={{width: 5, height: 5, marginHorizontal: 3, backgroundColor}} />
  );
};
const OnboardingScreen = ({navigation}) => {
  return (
    <Onboarding
      DoneButtonComponent={Done}
      DotComponent={Dots}
      onSkip={() => navigation.replace('Login')}
      onDone={() => navigation.navigate('Login')}
      pages={[
        {
          backgroundColor: '#b0c4de',
          image: (
            <Image style={styles.logo} source={require('../assets/icon.jpg')} />
          ),
          title: 'Thriftee',
          subtitle:
            'A MARKETPLACE FOR SECOND HAND GOODS AND SMALL-SCALE BUSINESSES',
        },
        {
          backgroundColor: colors.secondary,
          image: <Image source={require('../assets/onboarding-img3.png')} />,
          title: 'Welcome',
          subtitle: 'SALE AND GIVE AWAY YOUR GOODS',
        },
      ]}
    />
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, alignItems: 'center', justifyContent: 'center'},
  logo: {
    height: 150,
    width: 150,
    resizeMode: 'cover',
  },
});
export default OnboardingScreen;
