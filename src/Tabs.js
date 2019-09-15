import React, {Component} from 'react';
// import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import "react-tabs/style/react-tabs.css";
import axios from 'axios';
// import CoolTabs from 'react-cool-tabs';
// import DatePicker from 'react-date-picker';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import "react-tabs/style/react-tabs.css";
import firestore from './Firestore';
import { provider, auth } from './Firestore';

class Npos extends Component {
  constructor(props) {
    super(props);
    this.state = { non_profit_array: [], category: '' };

    this.handleCategorySelection = this.handleCategorySelection.bind(this);
    this.handleCategorySubmit = this.handleCategorySubmit.bind(this);
    this.fetchNonProfits = this.fetchNonProfits.bind(this);
  }

  fetchNonProfits(category) {

    console.log(category);

    let db = firestore.firestore();

    // Fetch non-profits
    db.collection('non-profits').where('category', '==' , category).get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          if (doc.data()["title"].includes('[email protected]') === false) { // FIXME
            console.log(doc.data()["title"])
            this.setState({
              non_profit_array : this.state.non_profit_array.concat(doc.data())
            })
          }
        });
      })
      .catch((err) => {
        console.log('Error getting documents', err);
      });

  }

  handleCategorySelection(event) {
    console.log(event.target.value);
    this.setState({ category: event.target.value });
  }

  handleCategorySubmit(event) {
    console.log("hello there");
    this.fetchNonProfits(event.target.value);
    event.preventDefault();
  }

  render() {
    let noElements = false;

    if (this.state.non_profit_array.length === 0) {
      noElements = true;
    }

    return (
      <div>
        <form onSubmit={this.handleCategorySubmit}>
          <select value={this.state.category} onChange={this.handleCategorySelection}>
            <option value="nothing">-- SELECT A CATEGORY TO FILTER --</option>
            <option value="Arts, Culture &amp; Humanities">Arts, Culture &amp; Humanities</option>
            <option value="Education">Education</option>
            <option value="Environment and Animals">Environment and Animals</option>
            <option value="Health">Health</option>
            <option value="Human Services">Human Services</option>
            <option value="International, Foreign Affairs">International, Foreign Affairs</option>
            <option value="Public, Societal Benefit">Public, Societal Benefit</option>
            <option value="Religion Related">Religion Related</option>
            <option value="Mutual/Membership Benefit">Mutual/Membership Benefit</option>
            <option value="Unknown, Unclassified">Unknown, Unclassified</option>
          </select>
          <input type="submit" value="Submit" />
        </form>

        <p hidden={!noElements}>Please select a category from the drop down menu to display non-profits.</p>

        {this.state.non_profit_array.map(npo => (
          <div key={npo.title}>
            <h3 style={{paddingLeft: 10, paddingBottom: 20}}>{npo.title} - <span>{npo.location}</span></h3>
          </div>
        ))}
      </div>
    );
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
                <label htmlFor="name" style={{color: 'white'}}>Event Title</label>
                <br></br>
                <input type="text" className="form-control" id="name" />
            </div>
            <br></br>
            <div className="form-group">
                <label htmlFor="message" style={{color: 'white'}}>Description</label>
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

class FacebookLogin extends Component {
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
