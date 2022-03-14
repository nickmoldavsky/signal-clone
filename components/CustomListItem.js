import React, { Component, useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Avatar, ListItem } from "react-native-elements";
import { FontAwesome } from "@expo/vector-icons";
import { db } from "../firebase";

// create a component
const CustomListItem = ({ id, chatName, chatUsers, enterChat }) => {
  const [chatMessages, setChatMessages] = useState([]);
  const [newMessage, setNewMessage] = useState(false);

  //const alertNewMessage = () => {
   // alert('new message!');
  //}

  useEffect(() => {
    const unsubscribe = db
      .collection("chats")
      .doc(id)
      .collection("messages")
      .orderBy("timestamp", "desc")
      .onSnapshot((snapshot) =>
        setChatMessages(snapshot.docs.map((doc) => doc.data())),
        //alertNewMessage()
      );

    return unsubscribe;
    //unsubscribe();
  }, []);

  return (
    <ListItem
      style={styles.listItem}
      key={id}
      onPress={() => enterChat(id, chatName, chatUsers)}
      key={id}
      bottomDivider
    >
      <Avatar
        rounded
        source={
          chatMessages?.[0]?.photoURL
            ? { uri: chatMessages?.[0]?.photoURL }
            : require("../assets/avatar.png")
        }
      ></Avatar>
      <ListItem.Content>
        <ListItem.Title style={{ fontWeight: "800" }}>
          {chatName}
        </ListItem.Title>
        <ListItem.Subtitle numberOfLines={1} ellipsizeMode="tail">
          <Text style={{ opacity: 0.5, marginRight: 5 }}>
            {chatMessages?.[0]?.displayName}{" "}
          </Text>
          {chatMessages?.[0]?.message}
        </ListItem.Subtitle>
      </ListItem.Content>
    </ListItem>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {},
  listItem: {},
});

//make this component available to the app
export default CustomListItem;
