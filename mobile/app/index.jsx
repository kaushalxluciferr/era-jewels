import { Image, Text, TouchableOpacity, View, StyleSheet } from "react-native";
import { hp, wp } from "@/helper/responsiveSize";
import Animated, { FadeInDown, FadeInLeft } from 'react-native-reanimated'
import { useRouter } from "expo-router";
import { useEffect } from "react";
export default function Index() {

  const token = true
  const router = useRouter()


  const handleclick = () => {
    router.push('/login')
  }
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.logoWrapper}>
        <Image
          source={require("@/assets/images/welcome.png")}
          style={styles.logo}
          resizeMode="contain"
        />
      </TouchableOpacity>

      <Animated.View entering={FadeInLeft.delay(600).springify()} style={styles.textContainer}>
        <Text style={styles.title}>Welcome</Text>
        <Text style={styles.subtitle}>To</Text>
        <Text style={styles.brand}>Era Jewels</Text>
      </Animated.View>

      <TouchableOpacity style={styles.button}
        onPress={handleclick}
      >
        <Animated.Text entering={FadeInDown.delay(700).springify()} style={styles.buttonText}>Get Started</Animated.Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: wp(5),
  },
  logoWrapper: {
    marginBottom: hp(5),
    height: hp(15),
    width: wp(50),
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    height: hp(20),
    width: wp(40),
  },
  textContainer: {
    alignItems: "center",
    marginBottom: hp(4),
  },
  title: {
    fontSize: hp(6),
    fontWeight: "600",
    color: "#000000",
  },
  subtitle: {
    fontSize: hp(3.5),
    fontWeight: "400",
    color: "#333333",
  },
  brand: {
    fontSize: hp(7),
    fontWeight: "700",
    color: "#19B5FE",
  },
  button: {
    backgroundColor: "#000000",
    paddingVertical: hp(2),
    paddingHorizontal: wp(20),
    borderRadius: hp(1.5),
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 2 },
  },
  buttonText: {
    fontSize: hp(2.5),
    color: "#FFFACD",
    fontWeight: "600",
  },
});
