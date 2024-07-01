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

  React.useEffect(() => {
    getMovieDetail()
    getMovieRecommendation()
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
            <Text style={styles.title}>{movieDetail.title}</Text>
            <Text style={styles.rating}>
              Rating: {movieDetail.vote_average}
            </Text>
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
  container: {
    flex: 1,
  },
  imageBackground: {
    width: '100%',
    height: 300,
    justifyContent: 'flex-end',
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 10,
  },
  title: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  rating: {
    color: '#fff',
    fontSize: 18,
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
})

export default MovieDetail
