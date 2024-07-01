import React from 'react'
import { View, Text, Button, StyleSheet } from 'react-native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { useNavigation } from '@react-navigation/native'

type RootStackParamList = {
  Home: undefined
  MovieDetail: undefined
}

type MovieDetailScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'MovieDetail'
>

const MovieDetail = (): JSX.Element => {
  const navigation = useNavigation<MovieDetailScreenNavigationProp>()
  return (
    <View style={styles.container}>
      <Text>Movie Detail Screen</Text>
      <Button title="Kembali" onPress={() => navigation.navigate('Home')} />
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

export default MovieDetail
