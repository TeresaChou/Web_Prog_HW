import React, { Component } from 'react';
// import logo from './img/logo.svg';
import './App.css';
import Conversation from "./Conversation";
import { DropdownButton } from "react-bootstrap";
import { MenuItem } from "react-bootstrap";
import { Image } from "react-bootstrap";
import socketIOClient from "socket.io-client";

class Contact extends Component {
   constructor(props) {
      super(props);
      this.select = this.select.bind(this);
   }
   select() {
      this.props.switch(this.props.name);
   }
   render() {
      return (
         <div className="contact" id={this.props.select} 
            onClick={this.select} >
            <Image src={ require("./img/" + this.props.name + ".jpg")} alt=""
               circle className="photo" />
            <h4>{this.props.name}</h4>
            {  this.props.unread?
                  <Image src={ require("./img/bell.png")} alt=""
                     id="bell" />: ""}
         </div>
      );
   }
}

class ContactSec extends Component {
   constructor(props) {
      super(props);
      this.state = {};
      for(let name of this.props.list) 
         this.state[name] = false;
      this.switch = this.switch.bind(this);
      this.read = this.read.bind(this);
      this.unread = this.unread.bind(this);
   }
   componentDidMount() {
      this.props.setUnread(this.unread);
   }
   switch(name) {
      this.read(name);
      this.props.switch(name);
   }
   read(name) {
      let s = this.state;
      s[name] = false;
      this.setState(s);
   }
   unread(name) {
      let s = this.state;
      s[name] = true;
      this.setState(s);
      console.log("an unread messge from", name);
   }
   render() {
      return (
         <div className="contactSec">
            {this.props.list.map(
               name => <Contact name={name} switch={this.switch} unread={this.state[name]}
                  select={name === this.props.to? "select": "" }/> )}
               <DropdownButton title={"user: " + this.props.from} 
                  bsStyle="primary" id={`dropdown-basic-2`} >
               { this.props.allList.map( 
                  name => <MenuItem eventKey={ this.props.allList.indexOf(name)}
                     active={ name === this.props.from } 
                     onSelect={ () => this.props.switchUser(name) }>
                     { name }</MenuItem> )}
            </DropdownButton>
         </div>
      );
   }
}

class Input extends Component {

   constructor(props) {
      super(props);
      this.state = {
         value: ""
      };
   }
   send() {
      if(this.state.value !== "") {
         this.props.addInput(this.state.value, "from");
         this.setState({
            value: ""
         });
      }
   }
   render() {
      return (
         <div className="input">
            <input type="text" value={this.state.value} 
               onChange={ (e) => { this.setState({value: e.target.value}); } }
               onKeyPress={ (e) => {
                  let key = e.which || e.keyCode;
                  if(key === 13) this.send();
               } } />
            <img src={ require("./img/send.png") } alt="send" id="send"
               onClick={ () => this.send() } />
         </div>
      );
   }
}


class App extends Component {

   constructor(props) {
      super(props);
      this.state = {
         socket: socketIOClient("http://localhost:3001"),
         from: "Snoopy",
         to: "Lucy",
         addMessToConv: function() {},
         updateConv: function() {},
         unread: function() {},
         contacts: ["Charlie Brown", "Snoopy", "Petty", "Schroeder", "Lucy"]
      };
      this.sendMess = this.sendMess.bind(this);
      this.switchContact = this.switchContact.bind(this);
      this.switchUser = this.switchUser.bind(this);
   }
   componentDidMount() {
      this.state.socket.on("addMessage", (from, to, text) => {
         if( (from === this.state.from && to === this.state.to) ||
            (from === this.state.to && to === this.state.from) ) {
            this.state.addMessToConv(text, from);
            console.log("a message added to the conversation");
         }
         else if (to === this.state.from) {
            this.state.unread(from);
         }
      });
   }
   sendMess(text) {
      this.state.socket.emit("addMessage", this.state.from, this.state.to, text);
      console.log("a message sent to the server");
   }
   async switchContact(name) {
      if(name !== this.state.to) {
         await this.setState({ to: name });
         this.state.updateConv();
      }
   }
   async switchUser(name) {
      if(name !== this.state.from) {
         await this.setState({ from: name });
         this.state.updateConv();
      }
   }

   render() {
      return (
         <div className="App">
            <ContactSec from={this.state.from} to={this.state.to} switch={this.switchContact}
               list={this.state.contacts.filter(name => this.state.from !== name)} 
               setUnread={ set => this.setState({ unread: set })}
               allList={this.state.contacts} switchUser={this.switchUser} />
            <h3 className="titleName">{ this.state.to }</h3>
            <Conversation from={this.state.from} to={this.state.to}
               setAdd={ add => this.setState({addMessToConv: add })}
               getData={ get => this.setState( {updateConv: get} )} />
            <Input addInput={ this.sendMess }/>
         </div>
      );
  }
}

export default App;
