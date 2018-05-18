import React, { Component } from 'react';
// import logo from './img/logo.svg';
import './App.css';

class Contact extends Component {

   constructor(props) {
      super(props);
      this.state = {
         select: this.props.select
      };
   }
   render() {
      return (
         <div className="contact" id={this.state.select}>
            <img src={ require("./img/" + this.props.name + ".jpg")} alt="" className="photo" />
            <h4>{this.props.name}</h4>
         </div>
      );
   }
}

class ContactSec extends Component {

   render() {
      return (
         <div className="contactSec">
            {this.props.list.map(
               name => <Contact name={name} select={name === this.props.name? "select": "" }/> )}
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

class Message extends Component {

   render() {
      return (
         <div className="message" id={this.props.id}>
            <p>{ this.props.text }</p>
         </div>
      );
   }
}

class Conversation extends Component {

   constructor(props) {
      super(props);
      this.state = {
         list: []
      };
      this.end = React.createRef();
      this.addMess = this.addMess.bind(this);
   }
   componentWillMount() {
      this.getData();
   }
   componentDidMount() {
      this.props.setAdd(this.addMess);
      this.scroll();
   }
   componentDidUpdate() {
      this.scroll();
   }
   addMess(content, sender) {
      var load = {
            "name": sender,
            "text": content
      };
      var data = new FormData();
      data.append("name", sender);
      data.append("text", content);
   
      fetch("http://localhost:3001/" + this.props.from + "/" + this.props.to, {
         method: "post",
         mode: "no-cors",
         headers: {
            "Accept": "application/json",
            "Content-Type": "application/x-www-form-urlencoded"
         },
         body: "name=" + sender + "&text=" + content
      })
      // .then(res => res.json())
         .then(cont => console.log(cont))
         .catch(error => console.log("Error fo POST: " + error));

      this.getData();

      //  this.setState( prevState => { return {
      //     list: [...prevState.list, {
      //        text: content,
      //        id: sender
      //     }]
      //  }} );
   }
   scroll() {
      this.end.scrollIntoView(false);
   }
   getData() {
      fetch("/" + this.props.from + "/" + this.props.to)
         .then(res => res.json())
         .then(conv =>  { 
            this.setState({ list: conv.content });
            console.log(conv);
         })
         .catch(error => console.log("Error for GET: " + error));
   }

   render() {
      return (
         <div className="conversation">
            { this.state.list.map( mess => <Message text={mess.text}
            id={mess.name === this.props.from? "from": "to"} /> ) }
            <div style={{float:"left", clear:"both", height:"0px"}}
               ref={ end => { this.end = end; } } />
         </div>
      );
   }
}

class App extends Component {

   constructor(props) {
      super(props);
      this.state = {
         from: "Snoopy",
         to: "Lucy",
         addMessToConv: function() {},
         contacts: ["Charlie Brown", "Snoopy", "Petty", "Schroeder", "Lucy"]
      };
      this.addFromMess = this.addFromMess.bind(this);
      this.switchContact = this.switchContact.bind(this);
   }
   addFromMess(text) {
      this.state.addMessToConv(text, this.state.from);
   }
   switchContact(name) {
      this.setState({
         to: name
      });
   }
  render() {
    return (
      <div className="App">
         <ContactSec name={this.state.to}
            list={this.state.contacts.filter(name => this.state.from !== name)} />
         <h3 className="titleName">{ this.state.to }</h3>
         <Conversation from={this.state.from} to={this.state.to}
            setAdd={ add => {this.setState({
               addMessToConv: add });
         }}/>
         <Input addInput={ this.addFromMess }/>
      </div>
    );
  }
}

export default App;
