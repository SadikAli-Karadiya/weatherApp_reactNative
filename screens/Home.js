import React, {useState, useEffect} from 'react';
import {View, Text, FlatList, Image} from 'react-native';
import {TextInput, Button, Card, Title} from 'react-native-paper';
import Header from './Header';
import AsyncStorage from '@react-native-community/async-storage';

function Home(props) {
  const [weatherInfo, setWeatherInfo] = useState({
    cityName: 'loading',
    temp: 'loading',
    humidity: 'loading',
    desc: 'loading',
    icon: 'loading',
  });

  useEffect(() => {
    getWeather();
  }, []);
  const getWeather = async () => {
    let myCity = await AsyncStorage.getItem('city');
    if (!myCity) {
      const {city} = props.route.params;
      myCity = city;
    }
    fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${
        myCity ? myCity : 'london'
      }&appid=20c8b4962f83bf1387c5b7e41bcbf0a9&units=metric`,
    )
      .then(data => data.json())
      .then(weatherData => {
        setWeatherInfo({
          cityName: weatherData.name,
          temp: weatherData.main.temp,
          humidity: weatherData.main.humidity,
          desc: weatherData.weather[0].description,
          icon: weatherData.weather[0].icon,
        });
      })
      .catch(err => console.error(err));
  };
  return (
    <View style={{flex: 1}}>
      <Header name="Weather App" />
      <View style={{justifyContent: 'center', alignItems: 'center', marginTop:60}}>
        <Title style={{fontSize:25, fontWeight: 'bold', letterSpacing:1}}>{weatherInfo.cityName}</Title>
        <Image
          source={{
            uri: `https://openweathermap.org/img/w/${weatherInfo.icon}.png`,
          }}
          style={{width: 200, height: 200, marginTop: 10}}
        />
      </View>
      <View
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          justifyContent: 'space-around',
          padding: 25,
        }}>
        <View
          style={{
            height: 130,
            width: 200,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'white',
            padding: 10,
          }}>
          <Text style={{fontSize: 25, fontWeight: 'bold'}}>
            {weatherInfo.temp} {'\u00b0'}C
          </Text>
          <View style={{marginLeft:25}}>
            <Text style={{fontSize:18}}>{weatherInfo.desc}</Text>
          </View>
        </View>
        <View
          style={{
            height: 130,
            width: 130,
            alignItems:'center',
            justifyContent: 'center',
            backgroundColor: 'white',
            padding: 10,
          }}>
          <Text style={{fontSize:20, fontWeight: 'bold'}}>Humidity</Text>
          <Text style={{fontSize:18}}>{weatherInfo.humidity}</Text>
        </View>
      </View>
    </View>
  );
}

export default Home;
