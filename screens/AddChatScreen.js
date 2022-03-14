import React, { Component, useLayoutEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Button, Icon, Input } from "react-native-elements";
import { auth, db } from "../firebase";

// create a component
const AddChatScreen = ({ navigation }) => {
  const [input, setInput] = useState("");

  useLayoutEffect(() => {
    navigation.setOptions(
      {
        title: "Add New Chat",
        headerBackTitle: "Chats",
      },
      [navigation]
    );
  });

  const createChat = async () => {
    await db
      .collection("chats")
      .add({
        chatName: input,
        chatOwner: auth.currentUser.email,
        chatUsers: [auth.currentUser.email],
      })
      .then(() => navigation.goBack())
      .catch((error) => alert(error));
  };

  return (
    <View style={styles.container}>
      <View>
        <Input
          value={input}
          placeholder="Enter New Chat Name"
          onChangeText={(val) => setInput(val)}
          onSubmitEditing={createChat}
          leftIcon={<Icon name="chat" size={24} color="black" />}
        />
        <Button
          onPress={createChat}
          title="Create New Chat"
          disabled={!input}
        />
      </View>
    </View>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    //flex: 1,
    //justifyContent: "center",
    //alignItems: "center",
    backgroundColor: "white",
    padding: 30,
    height: "100%",
  },
});

//make this component available to the app
export default AddChatScreen;
