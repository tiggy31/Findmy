import React,{useEffect,useState} from 'react'
import Header from './components/Header/Header'
import Map from './components/Map/Map'
import List from './components/List/List'
import PlaceDetails from './components/PlaceDetails/PlaceDetails'
import {CssBaseline,Grid,Button} from '@material-ui/core'
import {getPlaceData,getWeatherData,getVideo} from './API/index'

const App = () => {

const [places,setPlaces] = useState([])
const [weatherData,setWeatherData] = useState([])
const [coordinates,setCoordinates] = useState({})
const [bounds,setBounds] = useState([])
const [loading,setIsloading] = useState(false)
const [type,setType] = useState('restaurants')
const [rating,setRating] = useState('')
const [filteredPlaces,setFilteredPlaces] = useState([])
const [childClicked,setchildClicked] = useState([null])

useEffect(() => {
  navigator.geolocation.getCurrentPosition(({coords: {latitude,longitude}}) => {
        setCoordinates({lat: latitude, lng: longitude})
  })
},[])


  useEffect(() => {
    setIsloading(true)
    getWeatherData(coordinates.latitude,coordinates.longitude)
     .then((data) =>{
console.log(data)
      setWeatherData(data)
     } )
     getPlaceData(type,bounds?.sw,bounds?.ne)
     .then((data) => {
      setPlaces(data?.filter((place) => place.name && place.num_reviews >0 ))
      setFilteredPlaces([])
      setIsloading(false)
     })
  },[type,bounds])

useEffect(() => {
    const filteredPlaces = places.filter((place) => Number(place.rating) > rating)
   setFilteredPlaces(filteredPlaces)
},[rating])


    return (
        <>
        <CssBaseline />
        <Header 
         setCoordinates={setCoordinates}
        />
        <Grid container spacing={3} style={{width: '100%'}}>
          <Grid item xs={12} md={4}>
            <List  
              places={filteredPlaces.length ? filteredPlaces : places}
              childClicked={childClicked}
              loading={loading}
              type={type}
              setType={setType}
              rating={rating}
              setRating={setRating}
              />
          </Grid>
          <Grid item xs={12} md={8}>
            <Map 

            coordinates={coordinates}
            setCoordinates={setCoordinates}
            setBounds={setBounds}
            places={filteredPlaces.length ? filteredPlaces : places}
            setchildClicked={setchildClicked}
              weatherData={weatherData}
            />
          </Grid>
        </Grid>
        </>
    )
}

export default App