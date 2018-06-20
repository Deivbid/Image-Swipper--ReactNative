import React, { Component } from 'react';
import {
  ScrollView,
  Text,
  View,
  StyleSheet,
  Dimensions,
  Image,
  Animated,
  PanResponder,
  Button
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
const current = {}
const finals = []

const SCREEN_HEIGHT = Dimensions.get('window').height
const SCREEN_WIDTH = Dimensions.get('window').width

export default class Movies extends Component {

  constructor(props)
  {
    super(props)

    this.position = new Animated.ValueXY()
    this.state = {
        currentIndex: 0,
        finals: [],
        current: {}
    }

    this.rotate = this.position.x.interpolate({
      inputRange:[-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
      outputRange: ['-10deg', '0deg', '10deg'],
      extrapolate: 'clamp'
    })

    this.rotateAndTranslate = {
      transform:[{
        rotate: this.rotate
      },
      ...this.position.getTranslateTransform()
      ]
    }

    this.likeOpacity = this.position.x.interpolate({
      inputRange:[-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
      outputRange: [0, 0, 1],
      extrapolate: 'clamp'     
    })

    this.dislikeOpacity = this.position.x.interpolate({
      inputRange:[-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
      outputRange: [1, 0, 0],
      extrapolate: 'clamp'     
    })

    this.nextCardOpacity = this.position.x.interpolate({
      inputRange:[-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
      outputRange: [1, 0, 1],
      extrapolate: 'clamp'
    })

    this.nextCardScale = this.position.x.interpolate({
      inputRange:[-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
      outputRange: [1, 0.8, 1],
      extrapolate: 'clamp'
    })    
  }


  componentWillMount(){
    this.PanResponder = PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onPanResponderMove: (evt, gestureState) => {
        this.position.setValue({x: gestureState.dx, y: gestureState.dy })
      },
      onPanResponderRelease: (evt, gestureState) => {
        if(gestureState.dx > 120)
        {
          finals.push(this.state.data[this.state.currentIndex].url)
          current = {}
          Animated.spring(this.position, {
            toValue: { x: SCREEN_WIDTH + 100, y: gestureState.dy }
          }).start(() => {
            this.setState({ currentIndex: this.state.currentIndex + 1 }, () => {
              this.position.setValue({ x: 0, y: 0 })
            })
          })
        }
        else
        {
          if(gestureState.dx < -120)
          {
            current = {}
            Animated.spring(this.position, {
              toValue: { x: -SCREEN_WIDTH - 100, y: gestureState.dy }
            }).start(() => {
              this.setState({ currentIndex: this.state.currentIndex + 1 }, () => {
                this.position.setValue({ x: 0, y: 0 })
              })
            })
          }
          else
          {
            Animated.spring(this.position, {
              toValue: { x: 0, y: 0 },
              friction: 4
            }).start()            
          }
        }
      }
    })
          axios.get('http://192.168.1.3:3000/getLinks')
          .then((responseJson) => {
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

  onPressLearnMore(){
    let payload = JSON.stringify(finals)
//    axios.post('http://192.168.1.3:3000/test', {payload})
    axios({
      method: 'post',
      headers: {'Content-Type': 'application/json'},
      url: 'http://192.168.1.3:3000/test',
      data: payload
      
    });
   }
  renderImages = () => {
    console.log(finals)
    return this.state.data.map((item, index) => {
      if( index < this.state.currentIndex)
      {
        return null
      }
      else
      {
        if(index == this.state.currentIndex)
        {

            return(
              <Animated.View
                {...this.PanResponder.panHandlers}
                key={index} 
                style={[this.rotateAndTranslate, { height: SCREEN_HEIGHT - 120, width: SCREEN_WIDTH, padding: 10, position: 'absolute' }]}
                >

                  <Animated.View style={{opacity: this.likeOpacity, transform: [{rotate: '-30deg'}], position:'absolute', top:50, left:40, zIndex: 1000}}>
                    <Text style={{borderWidth: 1, borderColor: 'green', color: 'green', fontSize:32, fontWeight: '800', padding: 10}}>
                      ESTE VA
                    </Text>
                  </Animated.View>

                  <Animated.View style={{opacity: this.dislikeOpacity, transform: [{rotate: '30deg'}], position:'absolute', top:50, right:40, zIndex: 1000}}>
                    <Text style={{borderWidth: 1, borderColor: 'red', color: 'red', fontSize:32, fontWeight: '800', padding: 10}}>
                      ESTE NO VA
                    </Text>
                  </Animated.View>

                  <Image style={{flex:1, height: null, width: null, resizeMode: 'cover', borderRadius: 20}} source={{uri:item.image}} />
              </Animated.View>        
            )
        }
        else
        {

          return(
            <Animated.View
              key={index} 
              style={[{opacity: this.nextCardOpacity, transform: [{scale: this.nextCardScale}], height: SCREEN_HEIGHT - 120, width: SCREEN_WIDTH, padding: 10, position: 'absolute' }]}>
                <Image style={{flex:1, height: null, width: null, resizeMode: 'cover', borderRadius: 20}} source={{uri:item.image}} />
            </Animated.View>        
          )
        }
      }
    }).reverse()
  }

  render() {
   if(this.state.data)
   {
      
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
      },
      {
        title: 'Birth of a Nation',
        poster: this.state.data[5].image,
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
      <View style={{flex: 1, backgroundColor: 'black'}}>
        <View style={{height: 60}}>

        </View>

        <View style={{flex:1}}>
          {this.renderImages()}
        </View>

        <View style={{height: 60}}>
        <Button
          onPress={this.onPressLearnMore}
          title="Listo"
          color="#841584"
          accessibilityLabel="Presioname cuando estes listo"
        />
        </View>
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