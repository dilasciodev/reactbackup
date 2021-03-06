import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  Image,
  View,
  Alert,
  TextInput,
  KeyboardAvoidingView,
  Dimensions,
  ScrollView
} from 'react-native';
import { Scene, Router, Actions } from 'react-native-router-flux';
import { Button, BlueButtonNext, Input } from '../common';
import { TextField } from 'react-native-material-textfield';
import Icon from 'react-native-vector-icons/SimpleLineIcons';
import CodePin from 'react-native-pin-code';
import { connect } from 'react-redux';
import { createCode } from '../../actions';
import CodeInput from 'react-native-code-input';
import { Form, TextValidator } from 'react-native-validator-form';



const {height, width} = Dimensions.get('window');


class CreateCode extends Component {


  constructor(props) {
    super(props)
      this.state = {
        code: '',
        name : "My name",
        email: "titi@gmail.com",
        number:"56",
        date: "2017-03-01"
      }
    }




    _onFulfill1 = (code) => {

      console.log(this.state);


      //const isValid = code === '1111'
      const isValid = code;

      console.log(code);




        //  this.props.createCode(code);

          // Alert.alert("It's gotta be 4 digits dude!!!");


    //  if(!isValid) this.refs.codeInputRef1.clear()
    //  this._alert(isValid ? 'Successful!' : 'Code mismatch!')
    }

  onCodeChange(text){
    this.props.createCode(text);
  }




  render () {

    return (

                <ScrollView>
                  <View style={styles.container}>
                  <Image style={styles.imageStyle} source={require('../../assets/images/cancelcode.png')} />
                  <Text style={styles.text}>CREATE CANCELLATION CODE</Text>
                  <Text style={styles.smallText}>Speak your Cancellation Code to your smart hub (or type it into your app) to cancel your HOWL alert and stop the alerm. "Be sure to mae this a code you will remember"</Text>
                  <View>
                  <View>

                  <KeyboardAvoidingView behavior={'position'} keyboardVerticalOffset={-30} contentContainerStyle={styles.avoidingView}>

                  <CodeInput
                    ref='codeInputRef1'
                    borderType='underline'
                    codeLength={4}
                    space={35}

                    inputPosition='center'
                    activeColor='#0091cd'

                    onChangeText={this.onCodeChange.bind(this)}
                    inactiveColor='#999'
                    autoFocus={false}
                    codeInputStyle={{ fontWeight: '800', fontSize:30 }}
                    onFulfill={this._onFulfill1}
         />

                  </KeyboardAvoidingView>

                </View>

                    </View>
                  <BlueButtonNext onPress={this.checkText}/>
                  </View>



                </ScrollView>

            );
          }
        }

const styles = {

  iconStyle:{
    position:'absolute',
    right:0,
    top:30
  },
  mainContainer:{

  },
  smallText:{
    textAlign:'center'
  },

  imageStyle:{
    width:200,
    height:200,
    marginBottom:20,
    alignSelf:'center'
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

  buttonStyle:{
    paddingVertical: 140
  },

   container: {
     flex            : 1,
  justifyContent  : 'center',
  backgroundColor : '#F5FCFF',
  paddingLeft:30,
  paddingRight:30,
  backgroundColor:'#fff',
  paddingTop:65,
  paddingBottom:30
  },
  blur: {
    position        : 'absolute',
    justifyContent  : 'center',
    alignItems      : 'center',
    top             : 0,
    left            : 0,
    width           : width,
    height          : height
  },
  avoidingView: {

  },

  success: {
    fontSize    : 20,
    color       : 'green',
    textAlign   : 'center'
  }
}


const mapStateToProps = ({ signup }) => {
  const { createcode } = signup;

  return { createcode };
};

export default connect(mapStateToProps, {
   createCode
 })(CreateCode);
