import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Movie } from '../types/app'
import MovieItem from '../components/movies/MovieItem'
import { useNavigation } from '@react-navigation/native'

const coverImageSize = {
  backdrop: {
    width: 280,
    height: 160,
  },
  poster: {
    width: 100,
    height: 160,
  },
}

export default function Favorite(): JSX.Element {
  const [favMovieList, setFavMovieList] = React.useState<Movie[]>([])
  const navigation = useNavigation()

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getFavoriteMovies()
    })

    return unsubscribe
  }, [navigation])

  const getFavoriteMovies = async (): Promise<void> => {
    try {
      const initialData: string | null =
        await AsyncStorage.getItem('@FavoriteList')
      if (initialData !== null) {
        const favMovieList: Movie[] = JSON.parse(initialData)
        setFavMovieList(favMovieList)
      } else {
        setFavMovieList([])
      }
    } catch (error) {
      console.log(error)
    }
  }

  const navigateToMovieDetail = (movie: Movie): void => {
    navigation.navigate('MovieDetail', { id: movie.id })
  }

  return (
    <View style={styles.container}>
      {favMovieList.length === 0 ? (
        <Text style={{ textAlign: 'center' }}>Tidak ada film favorit</Text>
      ) : (
        <View style={styles.list}>
          {favMovieList.map((movie) => (
            <TouchableOpacity
              key={movie.id}
              onPress={() => navigateToMovieDetail(movie)} // Menavigasi saat item dipilih
            >
              <MovieItem
                movie={movie}
                size={coverImageSize['poster']}
                coverType={'poster'}
              />
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 14,
  },
  list: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
})
