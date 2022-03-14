import React, { Component, useLayoutEffect, useEffect, useState } from "react";
import { View, StyleSheet, KeyboardAvoidingView } from "react-native";
import { StatusBar } from "expo-status-bar";
import { Button, Input, Text } from "react-native-elements";
import { auth, db } from "../firebase";
//
import * as Notifications from "expo-notifications";
import * as Permissions from "expo-permissions";
//

// create a component
const RegisterScreen = ({ navigation }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [imageURL, setImageUrl] = useState("");
  //
  const [userPushToken, setUserPushToken] = useState(null);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerBackTitle: "Back to Login",
    });
  }, [navigation]);

  useEffect(() => {
    // get pushToken
    getPushToken();
  }, []);

  //
  const getPushToken = async () => {
    let pushToken;
    let statusObject = await Permissions.getAsync(Permissions.NOTIFICATIONS);
    if (statusObject.status !== "granted") {
      console.log('permission status:', statusObject.status);
      statusObject = await Permissions.askAsync(Permissions.NOTIFICATIONS);
    }
    if (statusObject.status !== "granted") {
      pushToken = null;
      console.error('permission not granted!');
    } else {
      pushToken = (await Notifications.getExpoPushTokenAsync()).data;
      //set user push token
      console.log("pushToken", pushToken);
      setUserPushToken(pushToken);
    }
  };
  //

  const createUser = async (authUser) => {
    await db
      .collection("users")
      .doc(authUser.uid)
      .set({
        userName: name,
        userEmail: authUser.email,
        uid: authUser.uid,
        userPushToken: userPushToken,
        userImageURL:
          imageURL ||
          "https://alpha-tv.net/wp-content/uploads/2021/12/avatar.png",
      })
      .then(() => console.log("created new db user"))
      .catch((error) => alert(error));
  };

  const register = () => {
    console.log("name", name);
    console.log("imageURL", imageURL);

    auth
      .createUserWithEmailAndPassword(email, password)
      .then((authUser) => {
        console.log("authUser:", authUser);
        authUser.user.updateProfile({
          displayName: name,
          photoURL:
            imageURL ||
            "https://alpha-tv.net/wp-content/uploads/2021/12/avatar.png",
        });
        // create user
        createUser(authUser.user);
      })
      .catch((error) => alert(error.message));
  };

  return (
    <KeyboardAvoidingView behavior="padding" style={styles.container}>
      <StatusBar style="light" />
      <Text h3 style={styles.title}>
        Create Account
      </Text>
      <View style={styles.inputContainer}>
        <Input
          type="text"
          value={name}
          autoFocus
          placeholder="Full Name"
          onChangeText={(val) => setName(val)}
        />
        <Input
          type="text"
          value={email}
          placeholder="Email"
          onChangeText={(val) => setEmail(val)}
        />
        <Input
          type="text"
          value={password}
          placeholder="Password"
          secureTextEntry
          onChangeText={(val) => setPassword(val)}
        />
        <Input
          type="text"
          value={imageURL}
          placeholder="Profile Image Url (Optional)"
          onChangeText={(val) => setImageUrl(val)}
        />
      </View>
      <View style={styles.button}>
        <Button title="Register" onPress={register} />
      </View>
      <View style={{ height: 100 }} />
    </KeyboardAvoidingView>
  );
};

// define your styles
const styles = StyleSheet.create({
  title: {
    marginBottom: 20,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  inputContainer: {
    width: 300,
  },
  button: {
    width: 200,
    marginTop: 10,
  },
});

//make this component available to the app
export default RegisterScreen;
