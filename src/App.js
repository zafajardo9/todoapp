import React, { Component } from 'react';
import './App.css';
import Note from './Note/note';
import NoteForm from './NoteForm/noteform';

import {firebaseConfig} from './Config/config';
import firebase from 'firebase';
import 'firebase/database';

class App extends Component {

  constructor(props){

    super(props);
    this.addNote = this.addNote.bind(this);
    this.removeNote = this.removeNote.bind(this);

    this.app = !firebase.apps.length ? firebase.initializeApp(firebaseConfig):firebase.app();
    this.database = this.app.database().ref().child('notes');

    // We're going to setup the React state of our component
    this.state = {
      notes: [],
    }
  }

  componentWillMount(){
    const previousNotes = this.state.notes;

    // DataSnapshot
    this.database.on('child_added', snap => {
      previousNotes.push({
        id: snap.key,
        noteContent: snap.val().noteContent,
      })

      this.setState({
        notes: previousNotes
      })
    })

    this.database.on('child_removed', snap => {
      for(var i=0; i < previousNotes.length; i++){
        if(previousNotes[i].id === snap.key){
          previousNotes.splice(i, 1);
        }
      }

      this.setState({
        notes: previousNotes
      })
    })
  }

  addNote(note) {
    this.database.push().set({noteContent: note});
  }

  removeNote(noteId){
    console.log("from the parent: " + noteId);
    this.database.child(noteId).remove();
  }


  render() {
    return (
      <div className="notesWrapper">
        <div className="notesHeader">
          <div className="heading">TODO</div>
        </div>
        <div className="notesBody">
          {
            this.state.notes.map((note) => {
              return(
                <Note noteContent={note.noteContent} 
                noteId={note.id} 
                key={note.id} 
                removeNote ={this.removeNote}/>
              )  
            })
          }
        </div>
        <div className="notesFooter">
            <NoteForm addNote={this.addNote}/>
        </div>
      </div>
    );

  }

}

export default App;
