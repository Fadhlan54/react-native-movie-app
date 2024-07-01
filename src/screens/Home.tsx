import React from 'react'
import { View, Text, Button, StyleSheet } from 'react-native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { useNavigation } from '@react-navigation/native'

type RootStackParamList = {
  Home: undefined
  MovieDetail: undefined
}

type HomeScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Home'
>

export default function Home(): JSX.Element {
  const navigation = useNavigation<HomeScreenNavigationProp>()
  return (
    <View style={styles.container}>
      <Text>Movie Page</Text>
      <Button
        title="Pergi ke Movie Detail"
        onPress={() => navigation.navigate('MovieDetail')}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
})
