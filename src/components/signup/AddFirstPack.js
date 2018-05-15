import React, { Component } from 'react';
import ContactsWrapper from 'react-native-contacts-wrapper';
import { connect, store } from 'react-redux';
import { Card, CardSection, Input, Button, CreateButton } from '../common';
import Spinner from 'react-native-loading-spinner-overlay';
import { Scene, Router, Actions } from 'react-native-router-flux';

import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Image,
    ScrollView,
    AsyncStorage,
    Alert
} from 'react-native';
import { TextField } from 'react-native-material-textfield';
import Icon from 'react-native-vector-icons/SimpleLineIcons';
import AuthorizedHowlComponent from '../AuthorizedHowlComponent';

// Generate required css
import iconFont from 'react-native-vector-icons/Fonts/FontAwesome.ttf';


class AddFirstPack extends AuthorizedHowlComponent {



  constructor(props) {
        super(props);
        this.onButtonPressed = this.onButtonPressed.bind(this);
        this.state = {
          packFirst: '',
          packLast:'',
          packPhone:'',
          packEmail:'',
          packCountry:'',
          packUserID:'',
          isLoading: false,
          mainuserid:'',
          fullname:'',
          firstname:'',
          lastname:'',
          validated:false,
          phonevalidated:false

        };
        this.endLoading = this.endLoading.bind(this);
        this.endAddition = this.endAddition.bind(this);
  }




  componentWillMount () {

    super.componentWillMount();

    console.log(this.state);

    let AHC = this;

    this.setState({
      fullname:'',
      packPhone:'',
      packEmail:''
    })

    console.log(this.state);


    let packEx = this.returnUserID().then(function(result){
      console.log(result);
      AHC.setState({
        mainuserid:result

      });

      });

}


  endLoading(x){
  //  console.log(x.GetUserPackResult);
    //this.setState({ error: '', loading: false});
    let GMP = this;

    console.log(x);


     this.setState({
       isLoading: false
     });
     console.log(this.state);
  }


  onButtonPress() {


  //  if (this.state.validated){
  this.setState({
    isLoading:true
  })


    let str   = this.state.fullname;
    let stringArray = str.split(/(\s+)/);

    let stripPhone = this.state.packPhone;
    let emptyPhone = stripPhone.replace(/[^\d]/g, '');
    console.log(emptyPhone);

    console.log(stringArray);

    this.setState({
      packFirst: stringArray[0],
      packLast: stringArray[2]
    })


    var object = JSON.stringify([{"Email":this.state.packEmail, "FirstName":stringArray[0], "LastName":stringArray[2],"PhoneNumber":emptyPhone,"UserPackID":"0", "PhoneNumberCountryCode": "1"}]);
       console.log(object);


       let userObject = {
         'UserID':this.state.mainuserid,
         'UserToken':this.state.usertoken,
         'PackMemberList':object
       }

         this.authorizedHowlCall("AddUpdateUserPack", userObject, this.endAddition);
//}else{
  //Alert.alert('Invalid','The email you entered is invalid.');
//}

  }

  endAddition(x){
  //  console.log(x.GetUserPackResult);
    //this.setState({ error: '', loading: false});
    this.setState({
      isLoading:false
    })
    let GMP = this;

    console.log(x);



Alert.alert(
  'Pack Member Added',
  'Would you like to add another?',
  [

    {text: 'NO', onPress: () => { Actions.createAddress()}},
    {text: 'YES', onPress: () => { Actions.pop() }},
  ]
)
     this.setState({
       isLoading: false
     });
     console.log(this.state);
  }



  renderButton() {
    if(this.props.loading) {
      return <Spinner size='large' />
    }

    return (
      <CreateButton
        onPress={this.onButtonPress.bind(this)}>
        SAVE
      </CreateButton>
    );
  }


  logPackName () {
    console.log(this.state);
    console.log(this.props);
  }

  onButtonPressed() {
        ContactsWrapper.getContact()
        .then((contact) => {
            const contact2 = contact;

            console.log(contact);
            //console.log(this.props);
            console.log(contact.phone);
            this.setState({fullname: contact.name});
            this.setState({packPhone: contact.phone});
            this.setState({packEmail: contact.email})
            console.log(this.state);
        })
        .catch((error) => {
            console.log("ERROR CODE: ", error.code);
            console.log("ERROR MESSAGE: ", error.message);
        });
  }

  validate = (text) => {
    console.log(text);
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/ ;
    if(reg.test(text) === false)
  {

    console.log("Email is Not Correct");
    this.setState({ validated : false });
    return false;
  }
  else {

    this.setState({ validated : true });
    console.log("Email is Correct");
    //this.props.createEmail(text);
    this.setState({
      packEmail:text
    })
    console.log(this.state.validated);
  }
}

  render() {
    if (this.state.isLoading) {
      return (
        <View style={{flex: 1, paddingTop: 65}}>
          <Spinner overlayColor={"rgba(28, 89, 115, 0.90)"} animation={'fade'} visible={true} textContent={"Loading..."} size={'large'} textStyle={{color: '#FFF'}} />
        </View>
      );
    }
    return (
      <ScrollView style={styles.container}>
      <Text style={styles.text}>ADD A NEW PACK MEMBER</Text>

        <TouchableOpacity onPress = {this.onButtonPressed}>
          <View style = {styles.buttonWrapper}>
            <Text style = {styles.buttonText}>IMPORT FROM CONTACTS</Text>
          </View>
        </TouchableOpacity>



        <View style={styles.loginStyle}>

          <View style={styles.inputStyle}>
          <TextField
            label='FULL NAME'
            onChangeText={(fullname) => this.setState({fullname})}
            value={this.state.fullname}
          />
          <Icon name="user" size={20} color="#999" style={styles.iconStyle}/>
          </View>


          <View>
          <TextField
            label='MOBILE PHONE'
            onChangeText={(packPhone) => this.setState({packPhone})}
            value={this.state.packPhone}
          />
            <Icon name="phone" size={20} color="#999" style={styles.iconStyle}/>
          </View>
          <View>
            <TextField
              label='EMAIL ADDRESS'
              //onChangeText={(packEmail) => this.setState({packEmail})}
              onChangeText={(packEmail) => this.setState({packEmail})}
              value={this.state.packEmail}

            />
            <Icon name="envelope" size={20} color="#999" style={styles.iconStyle}/>
          </View>
        </View>

        <CardSection>
          {this.renderButton()}
        </CardSection>
        <View style={styles.styleSpacer}/>
     </ScrollView>

        );
    }
}

const styles = StyleSheet.create({
  styleSpacer:{
    flex:1,
    height:80
  },
  iconStyle:{
    position:'absolute',
    right:0,
    top:30
  },
  inputStyle:{

  },
  text: {
    color: '#000',
    fontSize: 25,
    fontWeight: 'bold',
    textAlign:'center',
    paddingRight:10,
    paddingLeft:10,
    marginBottom:20
  },
  container: {
    flex: 1,
    paddingLeft:40,
    paddingRight:40,
    paddingTop:65
  },
  buttonWrapper: {
      marginTop: 70,

      flexDirection: 'column',
      borderRadius: 4
  },
  buttonText: {
      justifyContent: 'center',
      alignSelf: 'center',
      marginTop: 10,
      marginBottom: 10,
      marginHorizontal: 20,
      elevation: 1,
      color: '#0091cd',
      textDecorationLine: 'underline'
  },
  errorTextStyle: {
    fontSize: 20,
    alignSelf: 'center',
    color: 'red'
  },
  logoStyle:{
    width:70,
    height:80,
    alignSelf:'center',
    marginBottom:20
  },
  loginStyle:{

    marginTop:20
  },
  textStyle:{
    color:'#999',
    fontSize:14,
    marginTop:10,
    alignSelf:'center'
  },
  importStyle:{
     color:'#0091cd',
     marginTop:10,
     marginBottom:10,
     textAlign:'center'
  }
});



export default AddFirstPack;
