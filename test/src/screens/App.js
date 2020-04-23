import React from 'react';
import { SafeAreaView, StyleSheet, ScrollView, View, Text } from 'react-native';
import { Card, CardItem, List, ListItem, Input, Button, Item } from 'native-base';

const API_KEY = "MSjhzbVVX0fuScrd2CFgyP9nGkJojZuBvDXqNGKM";
const Base_Url = "https://api.nasa.gov/neo/rest/v1/neo/";
const Random_Url = Base_Url + "browse?api_key=" + API_KEY;
let url = "";
let AsteroidID = "";
let data = null;

class App extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			Asteroid_ID: null,
			Is_Disabled: true,
			Asteroid_IDs_List: [],
			Asteroid_ID_Data: null
		}
	}

	updateField(itemValue) {
		this.state.Asteroid_ID = itemValue;
		this.state.Is_Disabled = (itemValue == "") ? true : false;
		this.setState({});
	}

	reset() {
		this.state.Asteroid_ID = null;
		this.state.Is_Disabled = true;
		this.setState({});
	}

	getData(itemValue, Selected_Asteroid_ID) {
		if (itemValue == "random") {
			url = Random_Url;
			this.reset();
		} else {
			if (Selected_Asteroid_ID == null) {
				AsteroidID = this.state.Asteroid_ID;
			} else {
				AsteroidID = Selected_Asteroid_ID;
			}
			url = Base_Url + AsteroidID + "?api_key=" + API_KEY;
		}
		fetch(url).then(response => {
			if (response.status == 400) {
				return null;
			} else {
				return response.json();
			}
		}).then(responseJson => {
			if (responseJson != null) {
				if (itemValue == "random") {
					let objects = responseJson.near_earth_objects;
					let ids = [];
					for (let i = 0; i < objects.length; i++) {
						ids.push(<ListItem onPress={() => this.getData("normal", objects[i].id)}><Text style={styles.textCenter}>{objects[i].id}</Text></ListItem>);
					}
					this.setState({
						Asteroid_IDs_List: ids,
						Asteroid_ID_Data: null
					})
				} else {
					data = (
						<View>
							<ListItem><Text>name : <Text style={styles.textBold}>{responseJson.name}</Text></Text></ListItem>
							<ListItem><Text>nasa_jpl_url : <Text style={styles.textBold}>{responseJson.nasa_jpl_url}</Text></Text></ListItem>
							<ListItem><Text>is_potentially_hazardous_asteroid : <Text style={styles.textBold}>{responseJson.is_potentially_hazardous_asteroid.toString()}</Text></Text></ListItem>
						</View>
					);
					this.setState({
						Asteroid_IDs_List: [],
						Asteroid_ID_Data: data
					})
				}
			}
		}).catch(error => {
			console.log(error);
			this.setState({
				Asteroid_IDs_List: [],
				Asteroid_ID_Data: <ListItem><Text style={styles.textCenter}>NO DATA FOUND</Text></ListItem>
			})
		})
	}

	render() {
		return (
			<View style={styles.container}>
				<Card style={{ flexGrow: 0.05 }}>
					<CardItem>
						<Item>
							<Input value={this.state.Asteroid_ID} onChangeText={(value) => this.updateField(value)} placeholder="Enter Asteroid ID" />
						</Item>
					</CardItem>
					<CardItem>
						<Button disabled={this.state.Is_Disabled} onPress={() => this.getData("normal", null)}>
							<Text style={styles.buttonText}>Submit</Text>
						</Button>
					</CardItem>
					<CardItem>
						<Button onPress={() => this.getData("random", null)}>
							<Text style={styles.buttonText}>Random Asteroid</Text>
						</Button>
					</CardItem>
				</Card>
				<Card style={{ flex: 0.95 }}>
					<SafeAreaView>
						<ScrollView>
							<List>
								{(this.state.Asteroid_ID_Data == null) ? this.state.Asteroid_IDs_List : this.state.Asteroid_ID_Data}
							</List>
						</ScrollView>
					</SafeAreaView>
				</Card>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1
	},
	textBold: {
		fontWeight: 'bold'
	},
	textCenter: {
		textAlign: 'center',
		width: '100%'
	},
	buttonText: {
		width: '100%',
		textAlign: 'center',
		color: '#fff'
	}
});

export default App;