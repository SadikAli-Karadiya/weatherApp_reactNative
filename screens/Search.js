import React, {useState} from 'react';
import {View, Text, FlatList} from 'react-native';
import {TextInput, Button, Card} from 'react-native-paper';
import Header from './Header';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-community/async-storage';

const Search = () => {
  const [userInput, setUserInput] = useState();
  const [cities, setCities] = useState([]);

  const navigation = useNavigation();

  const fetchCities = text => {
    setUserInput(text);

    fetch(
      `http://dataservice.accuweather.com/locations/v1/cities/autocomplete?apikey=ivc74mFMRPGxgkfXZDCuygGdgaIHcGJE&q=${text}`,
    )
      .then(item => item.json())
      .then(cityData => {
        setCities(cityData);
      })
      .catch(err => console.error(err));
  };
  const saveChanges = async () => {
    await AsyncStorage.setItem("city", userInput);
    navigation.navigate('Home', {city: userInput});
  };
  return (
    <View style={{flex: 1}}>
      <Header name="Search City" />
      <TextInput
        label="Enter city"
        value={userInput}
        onChangeText={text => fetchCities(text)}
      />
      <Button
        icon="content-save"
        mode="contained"
        theme={{colors: {primary: '#4287f5'}}}
        onPress={() => saveChanges()}
        style={{margin: 20}}>
        Save Changes
      </Button>

      {/* {cities !== ' ' &&
        cities.map((item, index) => {
          return (
            <Card style={{marginTop: 4, padding: 12}} key={item.Key}>
              <Text>
                {item.LocalizedName}, {item.AdministrativeArea.LocalizedName},{' '}
                {item.Country.LocalizedName}
              </Text>
            </Card>
          );
        })} */}
      <FlatList
        data={cities}
        renderItem={({item}) => {
          return (
            <Card
              style={{marginTop: 4, padding: 12}}
              onPress={async() => {
                setUserInput(item.LocalizedName);
                await AsyncStorage.setItem('city', item.LocalizedName);
                navigation.navigate('Home', {city: item.LocalizedName});
              }}>
              <Text>
                {item.LocalizedName}, {item.AdministrativeArea.LocalizedName},{' '}
                {item.Country.LocalizedName}
              </Text>
            </Card>
          );
        }}
        keyExtractor={item => item.Key}
      />
    </View>
  );
};

export default Search;
