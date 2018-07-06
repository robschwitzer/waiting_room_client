import React from "react"
import { StyleSheet, SafeAreaView } from "react-native"
import Map from "./components/Map"
import { Location, Permissions } from "expo"
import YelpService from "./yelp"
import Navbar from "./components/Navbar"
import NavButtons from "./components/NavButtons"
import ListEntry from "./components/ListEntry"
import Navmenu from "./components/Navmenu"

const region = {
  latitude: 49.246292,
  longitude: -123.116226,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421
}

const deltas = {
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421
};

export default class App extends React.Component {
  state = {
    region: null,
    mapView: true,
    menuView: false,
    clinics: [],
    modalVisible: false
  }

  componentWillMount() {
    this.getLocationAsync();
  }

  toggleView = () => {
    this.setState(previousState => {
      return { mapView: !previousState.mapView }
    })
  }

  getClinics = async () => {
    const { latitude, longitude } = this.state.region;
    const userLocation = { latitude, longitude };
    const clinics = await YelpService.getClinics(userLocation);
    this.setState({ clinics });
  };

  getLocationAsync = async () => {

    let {status} = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      this.setState({
        errorMessage: 'Permission to access location was denied'
      });
    }

    let location = await Location.getCurrentPositionAsync({});
    const region = {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      ...deltas
    };
    await this.setState({region});
    await this.getClinics();
  }

  render() {
    const { region, clinics, mapView } = this.state;
/*show a preloader*/
    
    return (
      <SafeAreaView style={styles.container}>
        <Navbar />
        <Navmenu />
        <NavButtons toggleView={this.toggleView}/>
        { mapView ? <Map region={region} places={clinics} /> : <ListEntry places={clinics} />  }
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#eee",
    alignItems: "center",
    justifyContent: "center",
  },
  map: {
    left: 0,
    right:0,
    top: 0,
    bottom: 0,
    position: 'absolute'
  }
})