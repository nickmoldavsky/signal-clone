import React, { Component, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  ActivityIndicator,
} from "react-native";
import { Button, Input, Image } from "react-native-elements";
import { StatusBar } from "expo-status-bar";
import { auth } from "../firebase";

// create a component
const LoginScreen = ({ navigation, route }) => {
  console.log("login screen route:", route);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        navigation.replace("Home");
      }
    });
    return unsubscribe;
  }, []);

  const signIn = () => {
    setAnimating(true);
    auth
      .signInWithEmailAndPassword(email, password)
      .then((promise) => {
        setAnimating(false);
        console.log("signIn promise", promise);
      })
      .catch((error) => {
        setAnimating(false);
        alert(error);
      });
  };

  return (
    <>
    <ActivityIndicator
          animating={animating}
          color="blue"
          size="large"
          style={styles.activityIndicator}
        />
    <KeyboardAvoidingView behavior="padding" style={styles.container}>
      <StatusBar style="light" />
      <Image
        source={require("../assets/logo.png")}
        style={{ width: 200, height: 200, marginBottom: 30 }}
      />
      <View style={styles.inputContainer}>
        <Input
          type="email"
          value={email}
          onChangeText={(val) => setEmail(val)}
          placeholder="Email"
          autoFocus
        />
        <Input
          type="password"
          value={password}
          onChangeText={(val) => setPassword(val)}
          placeholder="Password"
          secureTextEntry
          onSubmitEditing={signIn}
        />
      </View>
      <View style={styles.button}>
        <Button onPress={signIn} title="Login" />
      </View>
      <View style={styles.button}>
        <Button
          style={styles.button}
          onPress={() => navigation.navigate("Register")}
          title="Register"
          type="outline"
        />
      </View>
      <View style={{ height: 100 }} />
    </KeyboardAvoidingView>
    </>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 10,
  },
  inputContainer: {
    width: 300,
  },
  button: {
    width: 200,
    marginTop: 10,
  },
  activityIndicator: {
   
    
  }
});

//make this component available to the app
export default LoginScreen;
