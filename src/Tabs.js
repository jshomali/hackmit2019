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
    return <div>
      {this.state.non_profit_array.map(npo => (
        <div key={npo.title}>
          <h3 style={{paddingLeft: 10}}>{npo.title}</h3>
          <h4 style={{paddingLeft: 20}}>{npo.location}</h4>
        </div>
      ))}
    </div>
  }
}
class Events extends Component {
  state = {
    date: new Date(),
    user: null
  }

  login = () => {
    auth().signInWithPopup(provider)
      .then(({ user }) => {
        this.setState({ user })
      })
  }
  logout = () => {
    auth().signOut().then(() => {
      this.setState({user: null})
    })
  }

  handleSubmit(e){
      e.preventDefault();
      const name = document.getElementById('name').value;
      // const date = document.getElementById('date').value;
      const message = document.getElementById('message').value;
      axios({
          method: "POST",
          url:"http://localhost:3002/send",
          data: {
              name: name,

              message: message
          }
      }).then((response)=>{
          if (response.data.msg === 'success'){
              alert("Event has been created.");
              this.console("GG");
              this.resetForm()
          }else if(response.data.msg === 'fail'){
              alert("Message failed to send.")
              this.console("RIP")
          }
      })
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
          <form id="contact-form" onSubmit={this.handleSubmit.bind(this)} method="POST">
            <div className="form-group">
                <label for="name" style={{color: 'white'}}>Event Title</label>
                <br></br>
                <input type="text" className="form-control" id="name" />
            </div>
            <br></br>
            <div className="form-group">
                <label for="message" style={{color: 'white'}}>Description</label>
                <br></br>
                <textarea className="form-control" rows="6" id="message"></textarea>
            </div>
            <br></br>
            <div className="form-group">

            </div>
            <br></br>
              <button type="submit" className="btn btn-primary">Submit</button>
          </form>
        </div>
      )
  }
}

class Login extends Component {
  state = {
    user: null
  }

  login = () => {
    auth().signInWithPopup(provider)
      .then(({ user }) => {
        this.setState({ user })
      })
  }
  logout = () => {
    auth().signOut().then(() => {
      this.setState({user: null})
    })
  }
  render() {
    const { user } = this.state
     return (
       <div className='app'>
        <p>{user ? `Hi, ${user.displayName}!` : 'Hi!'}</p>
        <button onClick={this.login}>
          Login with Facebook
        </button>
        <button onClick={this.logout}>
          Logout
        </button>
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
        <Login/>
       </TabPanel>
     </Tabs>
     </div>
    );
  }
}

export default TabsComp;
