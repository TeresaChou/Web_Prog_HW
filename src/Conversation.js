import React, { Component } from 'react';

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
      this.getData = this.getData.bind(this);
   }
   componentWillMount() {
      this.getData();
   }
   componentDidMount() {
      this.props.setAdd(this.addMess);
      this.props.getData(this.getData);
      this.scroll();
   }
   componentDidUpdate() {
      this.scroll();
   }
   addMess(content, sender) {
      // var load = {
      // "name": sender,
      // "text": content
      // };
      // var data = new FormData();
      // data.append("name", sender);
      // data.append("text", content);
   
      // fetch("http://localhost:3001/" + this.props.from + "/" + this.props.to, {
      // method: "post",
      // mode: "no-cors",
      // headers: {
      // "Accept": "application/json",
      // "Content-Type": "application/x-www-form-urlencoded"
      // },
      // body: "name=" + sender + "&text=" + content
      // })
      // .then(cont => console.log(cont))
      // .catch(error => console.log("Error fo POST: " + error));

      // this.getData();

      this.setState( prevState => { return {
         list: [...prevState.list, {
            name: sender,
            text: content
         }]
      }} );
   }
   scroll() {
      this.end.scrollIntoView(false);
   }
   getData() {
      console.log("fetching", this.props.from, this.props.to);
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

export default Conversation;
