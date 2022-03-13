import React, { Component, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Avatar, ListItem } from "react-native-elements";

import { FontAwesome } from "@expo/vector-icons";
import { auth, db } from "../firebase";
import firebase from "firebase/app";

// create a component
const JoinChatScreen = ({ route }) => {
  console.log("JoinChatScreen route: ", route);

  const [chatUsers, setChatUsers] = useState([]);
  console.log("chatUsers:", chatUsers);

  useEffect(() => {
    const unsubscribe = db
      .collection("users")
      .where("userEmail", "!=", auth?.currentUser?.email)
      .onSnapshot((snapshot) =>
        setChatUsers(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            data: doc.data(),
          }))
        )
      );
    return unsubscribe;
  }, [route]);

  const inviteUser = (userId, userEmail) => {
    const inviteUrl =
      "https://signal-clone-71a42.web.app/join/" +
      route.params.id +
      "/" +
      userId;
    console.log("inviteUrl:", inviteUrl);

    const addNewChatUser = db.collection("chats").doc(route.params.id);
    return addNewChatUser
      .update({
        chatUsers: firebase.firestore.FieldValue.arrayUnion(userEmail),
      })
      .then(() => {
        console.log("Document successfully updated!");
        alert("User successfully invited!");
      })
      .catch((error) => {
        // The document probably doesn't exist.
        console.error("Error updating document: ", error);
      });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {chatUsers
          //.filter((user) => {return !route.params.chatUsers.includes(user.data.userEmail)}  )
          .map((user, index) => (
            <ListItem style={styles.listItem} key={index} bottomDivider>
              <Avatar
                rounded
                source={
                  user?.data?.userImageURL
                    ? { uri: user?.data?.userImageURL }
                    : require("../assets/avatar.png")
                }
              ></Avatar>
              <ListItem.Content>
                <ListItem.Title style={{ fontWeight: "800" }}>
                  {user.data.userName}
                </ListItem.Title>
                <ListItem.Subtitle numberOfLines={1} ellipsizeMode="tail">
                  {user.data.userEmail}
                </ListItem.Subtitle>
              </ListItem.Content>
              {route.params.chatUsers.includes(user.data.userEmail) ? (
                <FontAwesome
                  name="users"
                  size={24}
                  color="#2B68E6"
                  style={{ opacity: 0.3 }}
                />
              ) : (
                <TouchableOpacity
                  onPress={() => inviteUser(user.data.uid, user.data.userEmail)}
                >
                  <FontAwesome name="user-plus" size={24} color="#2B68E6" />
                </TouchableOpacity>
              )}
            </ListItem>
          ))}
      </ScrollView>
    </SafeAreaView>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    //flex: 1,
    //justifyContent: "center",
    //alignItems: "center",
    //backgroundColor: "#2c3e50",
  },
  button: {
    width: 40,
    backgroundColor: "#2C6BED",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 50,
  },
});

//make this component available to the app
export default JoinChatScreen;
