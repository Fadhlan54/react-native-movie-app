import React from 'react'
import {
  ImageBackground,
  StyleSheet,
  Text,
  View,
  FlatList,
  ScrollView,
} from 'react-native'
import { Movie } from '../types/app'
import { API_ACCESS_TOKEN } from '@env'
import MovieItem from '../components/movies/MovieItem'
import { FontAwesome } from '@expo/vector-icons'
import AsyncStorage from '@react-native-async-storage/async-storage'

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

const MovieDetail = ({ route }: any): JSX.Element => {
  const { id } = route.params

  const [movieDetail, setMovieDetail] = React.useState<Movie | undefined>(
    undefined,
  )

  const [movieRecommendation, setMovieRecommendation] = React.useState<Movie[]>(
    [],
  )

  const [isFavorite, setIsFavorite] = React.useState(false)

  React.useEffect(() => {
    getMovieDetail()
    getMovieRecommendation()
    checkIfFavorite()
  }, [])

  const getMovieDetail = (): void => {
    const url = `https://api.themoviedb.org/3/movie/${id}`
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${API_ACCESS_TOKEN}`,
      },
    }

    fetch(url, options)
      .then(async (response) => await response.json())
      .then((response) => {
        setMovieDetail(response)
      })
      .catch((errorResponse) => {
        console.log(errorResponse)
      })
  }

  const getMovieRecommendation = (): void => {
    const url = `https://api.themoviedb.org/3/movie/${id}/recommendations`
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${API_ACCESS_TOKEN}`,
      },
    }

    fetch(url, options)
      .then(async (response) => await response.json())
      .then((response) => {
        setMovieRecommendation(response.results)
      })
      .catch((errorResponse) => {
        console.log(errorResponse)
      })
  }

  const checkIfFavorite = async (): Promise<void> => {
    try {
      const initialData: string | null =
        await AsyncStorage.getItem('@FavoriteList')
      if (initialData !== null) {
        const favMovieList: Movie[] = JSON.parse(initialData)
        const isFav = favMovieList.some((movie) => movie.id === id)
        setIsFavorite(isFav)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const toggleFavorite = async (): Promise<void> => {
    try {
      const initialData: string | null =
        await AsyncStorage.getItem('@FavoriteList')
      let favMovieList: Movie[] = initialData ? JSON.parse(initialData) : []

      if (isFavorite) {
        favMovieList = favMovieList.filter((movie) => movie.id !== id)
      } else {
        if (movieDetail) {
          favMovieList.push(movieDetail)
        }
      }

      await AsyncStorage.setItem('@FavoriteList', JSON.stringify(favMovieList))
      setIsFavorite(!isFavorite)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <ScrollView style={styles.container}>
      {movieDetail && (
        <ImageBackground
          resizeMode="cover"
          source={{
            uri: 'https://image.tmdb.org/t/p/w500' + movieDetail.backdrop_path,
          }}
          style={styles.imageBackground}
        >
          <View style={styles.overlay}>
            <View>
              <Text style={styles.title}>{movieDetail.title}</Text>
              <Text style={styles.rating}>
                <FontAwesome name="star" size={16} color="yellow" />{' '}
                {movieDetail.vote_average.toFixed(1)}
              </Text>
            </View>

            <FontAwesome
              name={isFavorite ? 'heart' : 'heart-o'}
              size={24}
              color="pink"
              style={styles.favoriteIcon}
              onPress={toggleFavorite}
            />
          </View>
        </ImageBackground>
      )}

      {movieDetail && (
        <View style={styles.detailsContainer}>
          <Text style={styles.overview}>{movieDetail.overview}</Text>
          <View style={styles.infoRow}>
            <View style={styles.infoColumn}>
              <Text style={styles.infoLabel}>Original Language:</Text>
              <Text style={styles.infoText}>
                {movieDetail.original_language}
              </Text>
              <Text style={styles.infoLabel}>Release Date:</Text>
              <Text style={styles.infoText}>
                {movieDetail.release_date.toString()}
              </Text>
            </View>
            <View style={styles.infoColumn}>
              <Text style={styles.infoLabel}>Popularity:</Text>
              <Text style={styles.infoText}>{movieDetail.popularity}</Text>
              <Text style={styles.infoLabel}>Vote Count:</Text>
              <Text style={styles.infoText}>{movieDetail.vote_count}</Text>
            </View>
          </View>
        </View>
      )}

      <View style={styles.header}>
        <View style={styles.purpleLabel}></View>
        <Text style={styles.recommendationsTitle}>Recommendations</Text>
      </View>

      <FlatList
        style={{
          ...styles.movieList,
          maxHeight: coverImageSize['poster'].height,
        }}
        showsHorizontalScrollIndicator={false}
        horizontal
        data={movieRecommendation}
        renderItem={({ item }) => (
          <MovieItem
            movie={item}
            size={coverImageSize['poster']}
            coverType={'poster'}
          />
        )}
        keyExtractor={(item) => item.id.toString()}
      />
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageBackground: {
    width: '100%',
    height: 240,
    justifyContent: 'flex-end',
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  title: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  rating: {
    color: 'yellow',
    fontSize: 14,
  },
  detailsContainer: {
    padding: 10,
  },
  overview: {
    fontSize: 16,
    marginBottom: 10,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  infoColumn: {
    flex: 1,
  },
  infoLabel: {
    fontWeight: 'bold',
  },
  infoText: {
    marginBottom: 5,
  },
  header: {
    marginLeft: 6,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  purpleLabel: {
    width: 20,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#8978A4',
  },
  recommendationsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    margin: 10,
  },
  recommendationItem: {
    marginRight: 10,
    width: 120,
  },
  recommendationImage: {
    width: '100%',
    height: 180,
  },
  recommendationTitle: {
    fontSize: 14,
    textAlign: 'center',
  },
  movieList: {
    paddingLeft: 4,
    marginTop: 8,
  },
  favoriteIcon: {
    marginLeft: 'auto',
  },
})

export default MovieDetail
