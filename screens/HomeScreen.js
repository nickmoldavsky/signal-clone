import React, { Component, useEffect, useLayoutEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Platform,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { Avatar, Button } from "react-native-elements";
import { AntDesign, SimpleLineIcons } from "@expo/vector-icons";
import CustomListItem from "../components/CustomListItem";
import { Ionicons } from "@expo/vector-icons";
import { auth, db } from "../firebase";

// create a component
const HomeScreen = ({ navigation, route }) => {
  const [chats, setChats] = useState([]);
  console.log("auth:", auth);

  const signOutUser = () => {
    auth.signOut().then(() => {
      navigation.replace("Login");
    });
  };

  useEffect(() => {
    const unsubscribe = db
      .collection("chats")
      .where("chatUsers", "array-contains", auth?.currentUser?.email)
      .onSnapshot((snapshot) =>
        setChats(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            data: doc.data(),
          }))
        )
      );
    return unsubscribe;
  }, [route]);

  console.log("Chats:", chats);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Simple Chat",
      headerStyle: { backgroundColor: "white" },
      headerTitleStyle: { color: "black" },
      headerTintColor: "black",
      headerLeft: () => (
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={signOutUser} activeOpacity={0.5}>
            <Avatar
              rounded
              source={{
                uri:
                  auth?.currentUser?.photoURL ||
                  "https://alpha-tv.net/wp-content/uploads/2021/12/avatar.png",
              }}
            ></Avatar>
          </TouchableOpacity>
          <Text style={{ fontSize: 10 }}>{auth?.currentUser?.displayName}</Text>
        </View>
      ),
      headerRight: () => (
        <View style={styles.headerRight}>
          <TouchableOpacity activeOpacity={0.5}>
            <AntDesign name="camerao" size={24} color="black" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("AddChat");
            }}
            activeOpacity={0.5}
          >
            <AntDesign name="edit" size={24} color="black" />
          </TouchableOpacity>
        </View>
      ),
    });
  }, []);

  const enterChat = (id, chatName, chatUsers) => {
    navigation.navigate("Chat", {
      id: id,
      chatName: chatName,
      chatUsers: chatUsers,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {chats.map(({ id, data: { chatName, chatUsers } }) => (
          <CustomListItem
            key={id}
            id={id}
            chatName={chatName}
            chatUsers={chatUsers}
            enterChat={enterChat}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    height: "100%",
  },
  headerLeft: {
    ...Platform.select({
      ios: {},
      android: {},
      default: {
        // other platforms, web for example
        marginLeft: 20,
      },
    }),
  },
  headerRight: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: 80,
    ...Platform.select({
      ios: {},
      android: {},
      default: {
        marginRight: 20,
      },
    }),
  },
});

//make this component available to the app
export default HomeScreen;
