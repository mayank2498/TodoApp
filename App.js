import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  TextInput,
  ListView
} from 'react-native';


import * as firebase from "firebase";

export default class TodoApp extends Component {

  constructor(props) {
    super(props);
    
    firebase.initializeApp({
        apiKey: "AIzaSyCS_tRhRo_sLsK_YPxVq8cCHFgGeGRbUMg",
        authDomain: "todoapp-d1b65.firebaseapp.com",
        databaseURL: "https://todoapp-d1b65.firebaseio.com",
        
    });

    var myFirebaseRef = firebase.database().ref();
    this.itemsRef = myFirebaseRef.child('items');

    this.state = {
      newTodo: '',
      todoSource: new ListView.DataSource({rowHasChanged:(row1,row2) => row1 !== row2})
    };

    this.items = ["hello"];

    function componentDidMount(){
      this.itemsRef.on('child_added', (dataSnapshot) => {
        this.items.push({id: dataSnapshot.key(), text: dataSnapshot.val()});
        this.setState({
          todoSource: this.state.todoSource.cloneWithRows(this.items)
        });
      });
     
      // When a todo is removed
      this.itemsRef.on('child_removed', (dataSnapshot) => {
          this.items = this.items.filter((x) => x.id !== dataSnapshot.key());
          this.setState({
            todoSource: this.state.todoSource.cloneWithRows(this.items)
          });
      });
    }

    function addTodo() {
      if (this.state.newTodo !== '') {
        this.itemsRef.push({
          todo: this.state.newTodo
        });
        this.setState({
          newTodo : ''
        });
      }
    }

    function removeTodo(rowData) {
      this.itemsRef.child(rowData.id).remove();
    }

  }

  render() {

  function renderRow(rowData) {
    if (rowData == null) {   
      return(<Text>asd</Text>);
    }
      return (
        <TouchableHighlight
          underlayColor='#dddddd'
          onPress={() => this.removeTodo()}>
          <View>
            <View style={styles.row}>
              <Text style={styles.todoText}>{rowData.text.todo}</Text>
            </View>
            <View style={styles.separator} />
          </View>
        </TouchableHighlight>
          );
  }  

  return (
    <View style={styles.appContainer}>
      <View style={styles.titleView}>
        <Text style={styles.titleText}>
          My Todos
        </Text>
      </View>
      <View style={styles.inputcontainer}>
        <TextInput style={styles.input} onChangeText={(text) => this.setState({newTodo: text})} value={this.state.newTodo}/>
        <TouchableHighlight
          style={styles.button}
          onPress={() => this.addTodo()}
          underlayColor='#dddddd'>
          <Text style={styles.btnText}>Add!</Text>
        </TouchableHighlight>
      </View>
      <ListView
        dataSource={this.state.todoSource}
        renderRow={this.renderRow.bind(this)} />
      </View>
    );
  }
}
 


