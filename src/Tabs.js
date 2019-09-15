import React, {Component} from 'react';
// import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import "react-tabs/style/react-tabs.css";
import axios from 'axios';
import CoolTabs from 'react-cool-tabs';
import DatePicker from 'react-date-picker';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import "react-tabs/style/react-tabs.css";
import firestore from './Firestore';
import { provider, auth } from './Firestore';

class Npos extends Component {
  constructor(props) {
    super(props);
    this.state = { non_profit_array: [] };
  }

  componentDidMount() {
    this.fetchNonProfits()
  }

  fetchNonProfits() {

    let db = firestore.firestore();

    // Fetch non-profits
    db.collection('non-profits').get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          this.setState({
            non_profit_array : this.state.non_profit_array.concat(doc.data)
          })
        });
      })
      .catch((err) => {
        console.log('Error getting documents', err);
      });

  }

  render() {
    return (
      <div key={1}>
        {this.state.non_profit_array.map(npo => (
          <div key={npo.title}>
            <h3 style={{paddingLeft: 10}}>{npo.title}</h3>
            <h4 style={{paddingLeft: 20}}>{npo.location}</h4>
          </div>
        ))}
      </div>
    )
  }
}
class Events extends Component {
  constructor(props) {
    super(props);
    this.state = { title: null, message: null };

    this.handleTitle = this.handleTitle.bind(this);
    this.handleMessage = this.handleMessage.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleTitle(event) {
    this.setState({title: event.target.value});
  }

  handleMessage(event) {
    this.setState({message: event.target.value});
  }

  handleSubmit(event){
    let db = firestore.firestore();
    db.collection('events').add({
      title: this.state.title,
      message: this.state.message
    })
    event.preventDefault();
  }

  resetForm(){
      document.getElementById('contact-form').reset();
  }

  render(){
      return(
        <div className="col-sm-4 offset-sm-4 form">
          <span id="pro-header-2">Create an event.</span>
          <br></br>
          <br></br>
          <form id="contact-form" onSubmit={this.handleSubmit}>
            <div className="form-group">
                <label htmlFor="title" style={{color: 'red'}}>Event Title</label>
                <br></br>
                <input type="text" className="form-control" id="title" value={this.state.title} onChange={this.handleTitle} />
            </div>
            <br></br>
            <div className="form-group">
                <label htmlFor="message" style={{color: 'red'}}>Description</label>
                <br></br>
                <textarea className="form-control" rows="6" id="message" value={this.state.message} onChange={this.handleMessage}></textarea>
            </div>
            <br></br>
            <br></br>
              <button type="submit" value="Submit" className="btn btn-primary">Submit</button>
          </form>
        </div>
      )
  }
}

class FacebookLogin extends Component {
  state = {
    user: null,
    loggedIn: false
  }

  login = () => {
    auth().signInWithPopup(provider)
      .then(({ user }) => {
        this.setState({ user, loggedIn: true })
      })
  }

  logout = () => {
    auth().signOut().then(() => {
      this.setState({user: null, loggedIn: false})
    })
  }

  render() {
    const { user } = this.state;

    let logButton = 4;

    if (this.state.loggedIn) {
      logButton = <button onClick={this.logout}>Logout</button>
    } else {
      logButton = <button onClick={this.login}>Login with Facebook</button>
    }

     return (
       <div className='app'>
        <p>
        {user ? `Hi, ${user.displayName}!` : 'Hi!'}
        </p>

        {logButton}

      </div>
      );
    }
}

class Login extends Component {
  state = {
    user: null,
    loggedIn: false
  }

  login = () => {
    auth().signInWithPopup(provider)
      .then(({ user }) => {
        this.setState({ user, loggedIn: true })
      })
  }

  logout = () => {
    auth().signOut().then(() => {
      this.setState({user: null, loggedIn: false})
    })
  }

  render() {
    const { user } = this.state;

    let logButton = 4;

    if (this.state.loggedIn) {
      logButton = <button onClick={this.logout}>Logout</button>
    } else {
      logButton = <button onClick={this.login}>Login with Facebook</button>
    }

     return (
       <div className='app'>
        <p>{user ? `Hi, ${user.displayName}!` : 'Hi!'}</p>

        {logButton}

      </div>
      );
    }
}

class TabsComp extends Component {
render() {
   return (
     <div>
     <Tabs>
       <TabList>
         <Tab>NPOs</Tab>
         <Tab>Events</Tab>
         <Tab>Login</Tab>
       </TabList>

       <TabPanel>
        <Npos/>
       </TabPanel>

       <TabPanel>
        <Events/>
       </TabPanel>

       <TabPanel>
        <FacebookLogin/>
       </TabPanel>
     </Tabs>
     </div>
    );
  }
}

export default TabsComp;
