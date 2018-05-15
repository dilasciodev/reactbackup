import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  AsyncStorage
 } from 'react-native';
import { Scene, Router, Actions } from 'react-native-router-flux';
import { Card, CardSection, Button, HowlButton, FacebookButton, CreateButton, GoogleButton } from './common';
import HowlComponent from './HowlComponent';
import { connect } from 'react-redux';
import { saveId, saveToken, saveFirstName, saveLastName, saveEmail, saveAddress, saveAddress2, saveCity, saveState, saveZip, saveLatitude, saveLongitude, saveCops, saveCancel, saveSilence, savePhone, saveConfirm } from '../actions';
import * as Keychain from 'react-native-keychain';
import AuthorizedHowlComponent from './AuthorizedHowlComponent';
import FBSDK, { LoginManager, LoginButton, AccessToken, GraphRequestManager, GraphRequest } from 'react-native-fbsdk';



class LandingScreen extends AuthorizedHowlComponent {

  constructor(props) {
     super(props);
     this.state = {
       user: null
     };
   }


   _fbAuth(){
     LoginManager.logInWithReadPermissions(['public_profile', 'email', 'user_friends']).then(
       function (result) {
         if (result.isCancelled) {
           console.log('Login cancelled')
         } else {
           console.log('Login success with permissions: ' + result.grantedPermissions.toString())
         }
       },
       function (error) {
         console.log('Login fail with error: ' + error)
       }
     )
   }

   _fbAuth2 = () => {

     let AHC = this;

     LoginManager.logInWithReadPermissions(['public_profile','email']).then(function(result){
            if(result.isCancelled){
                console.log('loging cancelled')
            }
            else {
                console.log('login success' + result.grantedPermissions)

                const infoRequest = new GraphRequest('/me', {
                    parameters: {
                        'fields': {
                            'string' : 'email,first_name,last_name,picture'
                        }
                    }
                }, (err, res) => {
                    console.log(err, res);

                    console.log(this);

                    let x = AHC.loginFacebook({"FirstName":res.first_name, "LastName":res.last_name, "Email":res.email, "FacebookID":res.id });


                });
                new GraphRequestManager().addRequest(infoRequest).start();

            }
        }, function(error){
            console.log('An error occured: ' + error)
        })
   }








   componentDidMount() {

   }

  render () {

    super.render();
    return (


        <View style={styles.containerStyle}>
        <Image style={styles.treeStyle} source={require('../assets/images/treesfull.png')}>
        <ScrollView>
        <Image style={styles.logoStyle} source={require('../assets/images/howlMain.png')} />

        <View>

    </View>



    <View style={{paddingLeft:0,paddingRight:0}}>
  <CardSection>
    <FacebookButton onPress={() => this._fbAuth2()} >
      LOGIN WITH FACEBOOK
    </FacebookButton>
  </CardSection>
  </View>


  <View style={{paddingLeft:0,paddingRight:0}}>
<CardSection>
   
  </CardSection>
  </View>

    <Text style={{ textAlign:'center', marginTop:10}}>
      OR
    </Text>



            <View style={{paddingLeft:20,paddingRight:20}}>
          <CardSection>
            <CreateButton onPress={() => Actions.createName()} >
              CREATE ACCOUNT
            </CreateButton>
          </CardSection>
          </View>



          <View style={{paddingLeft:20,paddingRight:20}}>
          <CardSection>
            <CreateButton onPress={() => Actions.login()} >
              LOGIN
            </CreateButton>
          </CardSection>
          </View>


          </ScrollView>
        </Image>
        </View>



    );
  }
}

const styles = {
  containerStyle:{

  },
  fbButtonStyle:{
    alignItems:'center',
    justifyContent:'center'
  },

  fbButton:{
    width:360,
    height:50,
    paddingLeft:20,
    paddingRight:20,
    borderRadius: 25,
    paddingTop:10

  },
  logoStyle:{
    width:90,
    height:110,
    alignSelf:'center',
    marginBottom:20,
    marginTop:0,
    paddingTop:0,
    marginBottom:40
  },
  treeStyle:{
    width: '100%',
    height: '100%',
    paddingTop:30
  },
  homeText:{
    color:'#d34836',
    textAlign:'center',
    fontSize:18
  },
  homeButton:{
    marginBottom:30,
    paddingBottom:30
  }
}


const mapStateToProps = ({ user }) => {
  const { userid,
     usertoken,
     userfirstname,
     userlastname,
     useraddress,
     useraddress2,
     usercity,
     userstate,
     userzip,
     userlatitude,
     userlongitude,
     usercops,
     usercancel,
     usersilence,
	   userphone,
	   userconfirm } = user;

  return {
     userid,
     usertoken,
     userfirstname,
     userlastname,
     useraddress,
     useraddress2,
     usercity,
     userstate,
     userzip,
     userlatitude,
     userlongitude,
     usercops,
     usercancel,
     usersilence,
	   userphone,
	   userconfirm
	 };
};

export default connect(mapStateToProps, {
   saveId,
   saveToken,
   saveFirstName,
   saveLastName,
   saveEmail,
   saveAddress,
   saveAddress2,
   saveCity,
   saveState,
   saveZip,
   saveLatitude,
   saveLongitude,
   saveCops,
   saveCancel,
   saveSilence,
	 savePhone,
	 saveConfirm
 })(LandingScreen);
