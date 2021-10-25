import React, {useEffect,useState,createRef } from 'react'

import { CssBaseline, Grid, useMediaQuery } from '@material-ui/core'

import {getPlacesData, getWeatherData} from './api/index'


import Header from './components/Header/Header'
import List from './components/List/List'
import Map from './components/Map/Map'



export default function App() {

    const ref=createRef();
    console.log({ref});

    const [places, setPlaces] = useState([]);
    const [coordinates, setCoordinates] = useState({})
    const [bounds, setBounds] = useState({});

    const [childClicked, setChildClicked] = useState(null);

    const [isLoading, setIsLoading] = useState(false)

    const [type, setType] = useState('restaurants');
    const [rating, setRating] = useState('');

    const [filteredPlaces, setFilteredPlaces] = useState([])

    const [weatherData, setWeatherData] = useState([])

    // for starting location
    useEffect(()=>{
        navigator.geolocation.getCurrentPosition(({coords:{latitude,longitude}})=>{
            setCoordinates({lat: latitude , lng:longitude})
        })
    },[])

    useEffect(() => {
        const filteredPlacess=places?.filter((place)=> place.rating>rating)
        setFilteredPlaces(filteredPlacess)
    }, [rating])

    useEffect(()=>{
        if(bounds.sw && bounds.ne){

            setIsLoading(true);

            getWeatherData(coordinates.lat, coordinates.lng)
                .then((data)=>{
                    setWeatherData(data);
                })
                
            getPlacesData(type, bounds.sw, bounds.ne)
            .then((data)=>{
                // console.log(data);
                setPlaces(data?.filter((place)=>place.name && place.num_reviews>0));
                setFilteredPlaces([])
                setIsLoading(false);
            })
        }
    },[type, bounds])

    return (
        <>
            <CssBaseline/>
            <Header setCoordinates={setCoordinates} />
            <Grid container spacing={3} styles={{width:'100%'}}>
                <Grid item xs={12} md={4}>
                    <List 
                        places={filteredPlaces?.length>0 ? filteredPlaces : places}
                        childClicked={childClicked}
                        isLoading={isLoading}
                        type={type}
                        setType={setType}
                        rating={rating}
                        setRating={setRating}
                    />
                </Grid>
                <Grid item xs={12} md={8}>
                    <Map 
                        setCoordinates={setCoordinates} 
                        setBounds={setBounds} 
                        coordinates={coordinates}  
                        places={filteredPlaces?.length>0 ? filteredPlaces : places}
                        setChildClicked={setChildClicked}
                        weatherData={weatherData}
                    />
                </Grid>
            </Grid>
            
        </>
    )
}
