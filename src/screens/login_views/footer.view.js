import React from "react";
import { StyleSheet, Text, View } from "react-native";

import * as Facebook from "expo-facebook";
import * as Google from "expo-google-app-auth";
import * as firebase from "firebase";

import GoogleIcon from "../../components/icons/google";
import FacebookIcon from "../../components/icons/facebook";
import { Colors } from "../../consts/colors";
import SocialButton from "../../components/social_button";

import {
  FACEBOOK_ID,
  ANDROID_CLIENT_ID,
  IOS_CLIENT_ID,
} from "../../consts/firebase.config";

export default function Footer({ text }) {
  console.log(
    firebase.auth().currentUser
      ? "Login yapılı as " + JSON.stringify(firebase.auth().currentUser)
      : "Login değil"
  );

  async function loginWithFacebook() {
    await Facebook.initializeAsync(FACEBOOK_ID);

    const { type, token } = await Facebook.logInWithReadPermissionsAsync({
      permissions: ["public_profile"],
    });

    if (type === "success") {
      // Build Firebase credential with the Facebook access token.
      const credential = firebase.auth.FacebookAuthProvider.credential(token);

      // Sign in with credential from the Facebook user.
      firebase
        .auth()
        .signInWithCredential(credential)
        .then((user) => console.log("logged as " + JSON.stringify(user)))
        .catch((error) => {
          // Handle Errors here.
        });
    }
  }

  async function signInWithGoogleAsync() {
    try {
      const result = await Google.logInAsync({
        androidClientId: ANDROID_CLIENT_ID,
        iosClientId: IOS_CLIENT_ID,
        scopes: ["profile", "email"],
      });

      if (result.type === "success") {
        const credential = firebase.auth.GoogleAuthProvider.credential(
          result.idToken,
          result.accessToken
        );
        firebase
          .auth()
          .signInWithCredential(credential)
          .then((user) => console.log("logged as " + user))
          .catch((error) => {
            // Handle Errors here.
          });
        return result.accessToken;
      } else {
        return { cancelled: true };
      }
    } catch (e) {
      return { error: true };
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{text.toUpperCase()}</Text>
      <View style={styles.iconContainer}>
        <SocialButton text="Google" onPress={signInWithGoogleAsync}>
          <GoogleIcon width={30} height={30} fill={Colors.darkPurple} />
        </SocialButton>
        <SocialButton text="Facebook" onPress={loginWithFacebook}>
          <FacebookIcon width={30} height={30} fill={Colors.darkPurple} />
        </SocialButton>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "white",
    marginTop: 0,
    marginBottom: 80,
    width: "100%",
    alignItems: "center",
  },
  text: {
    color: Colors.grey,
    letterSpacing: 0.7,
    fontSize: 12,
    marginBottom: 20,
  },
  iconContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
});
