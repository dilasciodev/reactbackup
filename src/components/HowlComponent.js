import React, { Component } from 'react';
import { Scene, Router, Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import * as Keychain from 'react-native-keychain';
import { AsyncStorage, Alert, Text, View } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';



class HowlComponent extends React.Component{


	constructor(props) {
		super(props);
		//this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

		this.state = {
			valid:false

			//listViewData: Array(20).fill('').map((_,i) => ({key: `${i}`, text: `item #${i}`})),
		 };

	}
	//static url = "http://sandbox.howlalarm.com/HOWL_WCF_Sandbox/Service1.svc/";
	async loginUser(credentials){

		let bodyPkg = {
			"Email": credentials.username,
			"Password": credentials.password,
		};

    console.log('logging in');
		let x = await this.loginBase(bodyPkg, "Login");

		Keychain
			.setGenericPassword(bodyPkg.Email, bodyPkg.Password)
			.then( this.genericCheck(x) );

	}
	async loginFacebook(credentials){

		let thing = this;

    console.log(credentials);
		console.log('facebook login');

		this.loginBase(credentials, "LoginWithFacebook").then(function(x){
			console.log('login facebook')
			console.log(x);
			Keychain
				.setInternetCredentials("https://facebook.com", credentials.Email, credentials.FacebookID)
				.then( thing.genericCheck(x) );
			//thing.genericCheck(x);
		});


		//Keychain
			//setInternetCredentials("https://facebook.com", credentials.Email, credentials.FacebookID)
			//.then( this.genericCheck(x) );

		//return this.loginBase(credentials,"LoginWithFacebook");

	}
	async loginGoogle(credentials){
		//finish
		return this.loginBase("","");
	}
	async callHowl(svc, bodyPkg){
		 //const response = await fetch("https://service.howlalarm.com/HOWL_WCF_Production/Service1.svc/"+svc, {
		 const response = await fetch("http://sandbox.howlalarm.com/HOWL_WCF/Service1.svc/"+svc, {

			method: "POST",
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(bodyPkg),
		});
		const json = await response.json();
		return json
	}
	async loginBase(bodyPkg, svc){

    console.log('loginbase');

		const response = await this.callHowl(svc, bodyPkg);

  //  console.log(response);

		let thing = Object.keys(response)[0];


		console.log(thing);

		console.log(response[thing]);

		let myResponse = response[thing];

		console.log('HEY FUCK FACE');

		if(myResponse.ResultStatus.Status == "0" ){

			Alert.alert(
				'Alert',
				'Incorrect Username and/or Password. Please try to login again.',
				[
					{text: 'OK', onPress: () => { Actions.pop() }},
				]
			)

			await AsyncStorage.setItem('HOWL_INVALID', myResponse.ResultStatus.Status);
			this.logout();
			return myResponse.ResultStatus.Status.StatusMessage;



		}


		let my_token = myResponse.GetUser.UserToken;
		let my_id = myResponse.GetUser.ID;
		let my_phone = myResponse.GetUser.MobilePhoneNumber;
		let my_confirm = myResponse.GetUser.MobilePhoneConfirmationCode;
		let my_cancel = myResponse.GetUser.CancellationCode;
		let my_silence = myResponse.GetUser.SilenceCode;
		let my_cops = myResponse.GetUser.COPSMonitoringAccountID;
		let my_firstname = myResponse.GetUser.FirstName;
		let my_lastname = myResponse.GetUser.LastName;
		let my_email = myResponse.GetUser.Email;
		let my_address = myResponse.GetUserHomeAddress.Address1;
		let my_address2 = myResponse.GetUserHomeAddress.Address2;
		let my_city = myResponse.GetUserHomeAddress.City;
		let my_state = myResponse.GetUserHomeAddress.State;
		let my_latitude = myResponse.GetUserHomeAddress.Latitude;
		let my_longitude = myResponse.GetUserHomeAddress.Longitude;
		let my_zip = myResponse.GetUserHomeAddress.Zip;
		let has_confirmed = myResponse.GetUser.HasConfirmedMobilePhone;




		try {

				AsyncStorage.removeItem("HOWL_PHONE");
				AsyncStorage.removeItem("HOWL_CANCEL_CODE");
				AsyncStorage.removeItem("HOWL_SILENCE_CODE");
				AsyncStorage.removeItem("HOWL_COPS");

				//console.log(response);

				await AsyncStorage.setItem('HOWL_WCF_JWT', my_token);
				await AsyncStorage.setItem("HOWL_ID", my_id);
				if(my_phone==null){}else{await AsyncStorage.setItem("HOWL_PHONE", my_phone);}
				if(my_confirm==null){}else{await AsyncStorage.setItem("HOWL_CONFIRMATION", my_confirm);}
				if(my_cancel==null){}else{await AsyncStorage.setItem("HOWL_CANCEL_CODE", my_cancel);}
				if(my_silence==null){}else{await AsyncStorage.setItem("HOWL_SILENCE_CODE", my_silence);}
				if(my_cops==null){}else{await AsyncStorage.setItem("HOWL_COPS", my_cops);}

				/*Address*/
				if(my_firstname==null){}else{await AsyncStorage.setItem("HOWL_FIRST_NAME", my_firstname);}
				if(my_lastname==null){}else{await AsyncStorage.setItem("HOWL_LAST_NAME", my_lastname);}
				if(my_email==null){}else{await AsyncStorage.setItem("HOWL_EMAIL", my_email);}
				if(my_address==null){}else{await AsyncStorage.setItem("HOWL_ADDRESS", my_address);}
				if(my_address2==null){}else{await AsyncStorage.setItem("HOWL_ADDRESS_2", my_address2);}
				if(my_city==null){}else{await AsyncStorage.setItem("HOWL_CITY", my_city);}
				if(my_state==null){}else{await AsyncStorage.setItem("HOWL_STATE", my_state);}
				if(my_latitude==null){}else{await AsyncStorage.setItem("HOWL_LATITUDE", my_latitude);}
				if(my_longitude==null){}else{await AsyncStorage.setItem("HOWL_LONGITUDE", my_longitude);}
				if(my_zip==null){}else{await AsyncStorage.setItem("HOWL_ZIP", my_zip);}


		} catch (error) {
				// Error saving data
		}

		console.log('fuck you');
		console.log(myResponse);
		return myResponse;

			//Keychain
				//.setGenericPassword(bodyPkg.Email, bodyPkg.Password)
				//.then( this.genericCheck(my_phone, has_confirmed, my_address, my_cancel, my_silence) );

	}

	async genericCheck(x){


		//console.log(x.GetUser.HasConfirmedMobilePhone);

		console.log("Mobile number = "+ x.GetUser.MobilePhoneNumber);
		console.log("Has Confirmed = "+ x.GetUser.HasConfirmedMobilePhone);
		console.log("Cancellation Code = "+ x.GetUser.CancellationCode);
		console.log("Silence Code = "+ x.GetUser.SilenceCode);



				if(x.GetUser.MobilePhoneNumber == null){
					console.log('mobile ');
					Actions.confirmPhone();
				}else if(x.GetUser.HasConfirmedMobilePhone == "False"){
					console.log('confi statrt');
					Actions.confirmPhoneTwo();
					console.log('conf end');
				}else if(x.GetUserHomeAddress.Address1 == null){
					console.log('address');
					Actions.createAddress();
				}else if(x.GetUser.CancellationCode == null){
					console.log('cancel');
					Actions.createCode();
				}else if(x.GetUser.SilenceCode == null){
					Actions.createFakeCode();
				}else{
					Actions.drawer();
					//Actions.voiceWarning();
				}

	}

	async returnTokenFromLogin(){
			return this.returnAsync('HOWL_WCF_JWT');
	}

	async returnUserID(){
			return this.returnAsync('HOWL_ID');

	}
	async logout(){

		Keychain
			.resetGenericPassword()
			.then(function() {
				console.log('Credentials successfully deleted');
				//Actions.auth({type: 'reset'});
				//Actions.landingScreen();
			});

			Keychain
				.resetInternetCredentials("https://facebook.com")
				.then(function() {
					console.log('Facebook successfully deleted');
					//Actions.auth({type: 'reset'});
					//Actions.landingScreen();
				});

				Keychain
					.resetInternetCredentials("https://google.com")
					.then(function() {
						console.log('Google successfully deleted');
						Actions.auth({type: 'reset'});
						Actions.landingScreen();
					});
		//AsyncStorage.removeItem("HOWL_WCF_JWT");
		//AsyncStorage.removeItem("HOWL_ID");
		AsyncStorage.clear();

	}
	async logoutask(){
		Alert.alert(
  'Logout',
  'Are you sure you would like to Log out?',
  [

    {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
    {text: 'OK', onPress: () => this.logout()},
  ],
  { cancelable: true }
)
	}

	async returnAsync(name){
		try {
			const value = await AsyncStorage.getItem(name);
			if (value !== null){
				//console.log(value);
				return value;
			}
		} catch (error) {
		  // Error retrieving data
		  console.log(error);
		}
	}
}
export default HowlComponent;
