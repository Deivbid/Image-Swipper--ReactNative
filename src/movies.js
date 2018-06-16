import React, { Component } from 'react';
import {
  ScrollView,
  Text,
  View,
  StyleSheet 
} from 'react-native';
//import { movies } from './data';
import MoviePoster from './moviePoster';
import MoviePopup from './moviePopup'; 
import axios from 'axios'
// Hardcode days for the sake of simplicity
const days = [ 'Today', 'Tomorrow'];
// Same for times
const times = [ '9:00 AM', '11:10 AM', '12:00 PM', '1:50 PM', '4:30 PM', '6:00 PM', '7:10 PM', '9:45 PM' ];
//const movies = []
export default class Movies extends Component {

  constructor(props)
  {
    super(props)

    this.state = {
        popupIsOpen: false,
    }
  }


  componentWillMount(){
          axios.get('http://192.168.1.3:3000/getLinks')
/*          .then((response) => {
            console.log(response)
            return response.json()})*/
          .then((responseJson) => {
            console.log("Entre Aqui")
            console.log(responseJson.data[0])
            this.setState({data: responseJson.data})
            
          })

          .catch((error) => {
            console.error(error);
          })
  }

  openMovie = (movie) => {
      this.setState({
        popupIsOpen: true,
        movie,  
      });
    }
/*    fetch("http://127.0.0.1:3000/")
    .then(resp => {
      console.log("it works")
    })
    .catch(err => {
      console.log(err)
    })
  */  

  componentDidMount(){
  }

  closeMovie = () => {
    this.setState({
      popupIsOpen: false,
    });
  }

  render() {
   if(this.state.data)
   {
      console.log(this.state.data)
      movies = [
      {
        title: 'La La Land',
        poster: 'http://192.168.1.3:3000/testing.jpg',
        genre: 'Drama/Romance',
        days,
        times,
      },
      {
        title: 'Paterson',
        poster: this.state.data[0].image,
        genre: 'Drama/Comedy',
        days,
        times,
      },
      {
        title: 'Jackie',
        poster: this.state.data[1].image,
        genre: 'Drama/Biography',
        days,
        times,
      },
      {
        title: 'Lo and Behold Reveries of the Connected World',
        poster: this.state.data[2].image,
        genre: 'Documentary',
        days,
        times,
      },
      {
        title: '10 Cloverfield Lane',
        poster: this.state.data[3].image,
        genre: 'Drama',
        days,
        times,
      },
      {
        title: 'Birth of a Nation',
        poster: this.state.data[4].image,
        genre: 'Fantasy/Myster',
        days,
        times,
      }
    ];
   }
   else
   {
    return <Text> Loading . . . </Text>
   }
    return (
      <View>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
            // Hide all scroll indicators
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
        >
          {movies.map((movie, index) => <MoviePoster
            movie={movie}
            onOpen={this.openMovie}
            key={index}
          />)}

          <MoviePopup
            movie={this.state.movie}
            isOpen={this.state.popupIsOpen}
            onClose={this.closeMovie}
          />
        </ScrollView>
      </View>
    );
  }
}
 
const styles = StyleSheet.create({
  container: {
    paddingTop: 20,         // start below status bar
  },
  scrollContent: {
    flexDirection: 'row',   // arrange posters in rows
    flexWrap: 'wrap',       // allow multiple rows
  },
});