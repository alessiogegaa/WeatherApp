import { StatusBar } from "expo-status-bar";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import tw from "twrnc";
import {
  Fontisto,
  FontAwesome,
  Feather,
  Ionicons,
  AntDesign,
} from "@expo/vector-icons";
import { useCallback, useEffect, useState } from "react";
import { fetchLocations, fetchweatherForecast } from "../api/weather";
import { debounce } from "lodash";
import { weatherImages } from "../constants/constants";
import * as Progress from "react-native-progress";
import { getData, storeData } from "../utils/asyncStorage";
export default function HomeScreen() {
  const [showSearch, toggleSearch] = useState(false);
  const [locations, setLocations] = useState([1, 2, 3]);
  const [showLogo, setShowLogo] = useState(true);
  const [loading, setLoading] = useState(true);
  const [weather, setWeather] = useState({});
  useEffect(() => {
    fetchMyWeatherData();
  }, []);
  const fetchMyWeatherData = async () => {
    let myCity = await getData("city");
    let cityName = "Elbasan";
    if (myCity) cityName = myCity;
    fetchweatherForecast({
      cityName,
      days: "7",
    }).then((data) => {
      setWeather(data);
      setLoading(false);
    });
  };
  const handleLocation = (loc) => {
    setLocations([]);
    setLoading(true);
    fetchweatherForecast({
      cityName: loc.name,
      days: "7",
    }).then((data) => {
      setWeather(data);
      setLoading(false);
      storeData("city", loc.name);
    });
  };
  const handleSearch = (value) => {
    if (value.length > 2) {
      fetchLocations({ cityName: value }).then((data) => {
        setLocations(data);
      });
    }
  };
  const handleTextDebounce = useCallback(debounce(handleSearch, 600), []);
  const { current, location } = weather;
  return (
    <View style={tw`flex-1 relative`}>
      <StatusBar style="light" />
      <Image
        blurRadius={60}
        source={require("../assets/bg.jpeg")}
        style={tw`absolute h-full w-full`}
      />
      {loading ? (
        <View style={tw`flex-1 flex-row justify-center items-center`}>
          <Progress.CircleSnail thickness={10} size={140} color="#00b3b2" />
        </View>
      ) : (
        <SafeAreaView style={tw`flex flex-1 pt-5 `}>
          <View
            style={tw`mx-4 relative z-50 flex-row justify-end items-center rounded-full ${
              showSearch ? "bg-white bg-opacity-20" : "bg-opacity-0"
            }`}
          >
            {showSearch ? (
              <TextInput
                onChangeText={handleTextDebounce}
                placeholder="Search city"
                placeholderTextColor={"lightgray"}
                style={tw`pl-6 h-10 flex-1 text-base text-white`}
              />
            ) : null}

            <TouchableOpacity
              style={tw`bg-opacity-30 bg-white rounded-full p-3 m-1`}
              onPress={() => {
                toggleSearch(!showSearch);
              }}
            >
              {showLogo ? (
                <Fontisto name="search" size={24} color="white" />
              ) : null}
            </TouchableOpacity>
            {locations.length > 0 && showSearch ? (
              <View style={tw`absolute w-full bg-gray-300 top-16 rounded-3xl`}>
                {locations.map((loc, index) => {
                  let showBorder = index + 1 != locations.length;
                  let borderStyle = showBorder
                    ? "border-b-2 border-b-gray-400"
                    : "";
                  return (
                    <TouchableOpacity
                      onPress={() => handleLocation(loc)}
                      key={index}
                      style={tw`flex-row items-center border-0 p-3 px-4 mb-1 + ${borderStyle}`}
                    >
                      <FontAwesome name="map-marker" size={24} color="gray" />
                      <Text style={tw`text-black text-lg ml-2`}>
                        {loc?.name}, {loc?.country}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            ) : null}
          </View>
          {/*Forecasting*/}
          <View style={tw`mx-4 flex justify-around flex-1 mb-2 pt-4`}>
            <Text style={tw`text-white text-center text-2xl font-bold`}>
              {location?.name},
              <Text style={tw`text-lg font-semibold text-gray-300`}>
                {" " + location?.country}
              </Text>
            </Text>
            {/*Weather image*/}
            <View style={tw`flex-row justify-center pt-7 h-90 w-90`}>
              <Image
                source={weatherImages[current?.condition?.text]}
                style={tw`w-full h-full `}
              />
            </View>
            {/*Degree Celsius*/}
            <View style={tw`space-y-2 mt-4 pt-5`}>
              <Text style={tw`text-center font-bold text-white text-6xl ml-5`}>
                {current?.temp_c}&#176;
              </Text>
              <Text style={tw`text-center text-white text-xl tracking-widest`}>
                {current?.condition?.text}
              </Text>
            </View>
            {/*Other Stats*/}
            <View style={tw`flex-row justify-between mx-4 mt-4`}>
              <View style={tw`flex-row space-x-2 items-center`}>
                <Feather name="wind" size={32} color="gray" style={{ marginRight: 3 }}/>
                <Text style={tw`text-white font-semibold text-base`}>
                  {current?.wind_kph}km
                </Text>
              </View>
              <View style={tw`flex-row items-center`}>
                <Ionicons name="water" size={32} color="gray" />
                <Text style={tw`text-white font-semibold text-base`}>
                  {current?.humidity}%
                </Text>
              </View>
              <View style={tw`flex-row items-center`}>
                <Feather
                  name="sun"
                  size={32}
                  color="gray"
                  style={{ marginRight: 6 }}
                />
                <Text style={tw`text-white font-semibold text-base`}>
                  {weather?.forecast?.forecastday[0]?.astro?.sunrise}
                </Text>
              </View>
            </View>
            {/*forecast for the next days*/}
            <View style={tw`mb-2 space-y-3`}>
              <View style={tw`flex-row items-center mx-5 space-x-4 mt-5`}>
                <AntDesign name="calendar" size={22} color="white" />
                <Text style={tw`text-white text-base`}>Daily Forecast</Text>
              </View>
            </View>
            <ScrollView
              horizontal
              contentContainerStyle={{ paddingHorizontal: 15 }}
              showsHorizontalScrollIndicator={false}
            >
              {weather?.forecast?.forecastday?.map((item, index) => {
                return (
                  <View
                    key={index}
                    style={tw`flex justify-center items-center w-24 h-24 rounded-3xl py-3 mr-4 bg-white bg-opacity-40`}
                  >
                    <Image
                      source={weatherImages[item?.day?.condition?.text]}
                      style={tw`h-11 w-11`}
                    />
                    <Text style={tw`text-white`}>
                      {
                        new Date(item.date)
                          .toLocaleDateString("en-US", { weekday: "long" })
                          .split(",")[0]
                      }
                    </Text>
                    <Text style={tw`text-white text-xl font-semibold`}>
                      {item?.day?.avgtemp_c}&#176;
                    </Text>
                  </View>
                );
              })}
            </ScrollView>
          </View>
        </SafeAreaView>
      )}
    </View>
  );
}
