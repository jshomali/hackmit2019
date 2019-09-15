import React, {Component} from 'react';
import "react-tabs/style/react-tabs.css";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import "react-tabs/style/react-tabs.css";
import firestore from './Firestore';
import { provider, auth } from './Firestore';

let loggedIn = false;
let fbuser = null;

class Npos extends Component {
  constructor(props) {
    super(props);
    this.state = { non_profit_array: [], category: "" };

    this.handleCategorySelection = this.handleCategorySelection.bind(this);
    this.handleCategorySubmit = this.handleCategorySubmit.bind(this);
    this.fetchNonProfits = this.fetchNonProfits.bind(this);
  }

  componentDidMount() {
    if (this.state.non_profit_array.length === 0) {
      this.fetchNonProfits("all")
    }
  }

  fetchNonProfits(filter) {

    let db = firestore.firestore();

    if (filter === "all") {
      db.collection('non-profits').get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          let dict = doc.data();
          dict["id"] = doc.id;
          this.setState({
            non_profit_array : this.state.non_profit_array.concat(dict)
          })
        });
      })
      .catch((err) => {
        console.log('Error getting documents', err);
      });
    } else {
      // Fetch non-profits
      db.collection('non-profits').where('category', '==', filter).get()
      .then((snapshot) => {
        console.log("IN SNAPSHOT " + filter);
        snapshot.forEach((doc) => {
          let dict = doc.data();
          dict["id"] = doc.id;
          this.setState({
            non_profit_array : this.state.non_profit_array.concat(dict)
          })
        });
      })
      .catch((err) => {
        console.log('Error getting documents', err);
      });
    }

  }

  handleCategorySelection(event) {
    console.log("selection " + event.target.value);
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
        {/* <form onSubmit={this.handleCategorySubmit}>
          <label>Select a category to filter non-profits:
            <select value={this.state.category} onChange={this.handleCategorySelection}>
              <option value="all">All</option>
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
          </label>
        </form> */}

        <p hidden={!noElements}>Loading...</p>

        {this.state.non_profit_array.map(npo => (
          <div key={npo.id}>
            <a href="https://projects.propublica.org/nonprofits/" target="_blank"><h3 style={{paddingLeft: 10, paddingBottom: 20}}>{npo.title} - <span>{npo.location}</span></h3></a>
          </div>
        ))}
      </div>
    );
  }
}
class Events extends Component {
  constructor(props) {
    super(props);
    this.state = { title: null, message: null, date: null, users: [], events_array: [] };

    this.handleTitle = this.handleTitle.bind(this);
    this.handleMessage = this.handleMessage.bind(this);
    this.handleDate = this.handleDate.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    // this.handleAttend = this.handleAttend.bind(this);
    this.resetForm = this.resetForm.bind(this);

  }

  componentDidMount() {
    this.fetchEvents();
  }

  fetchEvents() {
    this.setState({events_array: []})
    console.log();

    let db = firestore.firestore();

    // Fetch Events
    db.collection('events').get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
            console.log(doc.data()["title"])
            this.setState({
              events_array : this.state.events_array.concat(doc.data())
            })
        });
      })
      .catch((err) => {
        console.log('Error getting documents', err);
      });

  }




  handleTitle(event) {
    this.setState({title: event.target.value});
  }

  handleMessage(event) {
    this.setState({message: event.target.value});
  }

  handleDate(event) {
    this.setState({date: event.target.value});
  }
  handleUsers(event) {
    this.setState({users: event.target.value});
  }

  handleSubmit(event){
    let db = firestore.firestore();
    db.collection('events').add({
      title: this.state.title,
      message: this.state.message,
      date: this.state.date
    })
    this.fetchEvents();
    this.resetForm();
    event.preventDefault();
  }

  resetForm(){
      document.getElementById('contact-form').reset();
  }

  render(){
    let eventForm;

    if (loggedIn) {
      eventForm = <div className="col-sm-4 offset-sm-4 form">
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
                      <div className="form-group">
                          <label htmlFor="date" style={{color: 'red'}}>Date & Time</label>
                          <br></br>
                          <input type="text" className="form-control" id="date" value={this.state.date} onChange={this.handleDate} />
                      </div>
                      <br></br>
                        <button type="submit" value="Submit" className="btn btn-primary">Submit</button>
                    </form>
                  </div>
    } else {
      eventForm = <h3>Please log in to create events</h3>
    }
      return(
        <div>
        {eventForm}
        {this.state.events_array.map(events => (
          <div key={events.title}>
            <h3 style={{paddingLeft: 10, paddingBottom: 20}}>{events.title} - <span>{events.message} </span> Starts on {events.date}</h3>
            
          </div>
        ))}
        </div>
      )
  }
}

class Attend extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: this.props.title
    };

    this.hAttend = this.hAttend.bind(this);

  }

  hAttend(event) {
    let db = firestore.firestore();
    // this.setState({users: this.props.users.concat(fbuser)})
    db.collection('events').doc("users").set({
      users: this.props.users
    })

    event.preventDefault();
  }

  render() {
    return (
      <button onClick={this.hAttend} className="fblog">Attend</button>
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
        this.setState({ user})
        fbuser = user;
      })
      loggedIn = true;
  }

  logout = () => {
    auth().signOut().then(() => {
      this.setState({user: null})
      fbuser = null;
    })
    loggedIn = false;
  }

  render() {
    const { user } = this.state;


    let logButton = 4;

    if (loggedIn) {
      logButton = <button onClick={this.logout} className="fblog">Logout</button>
    } else {
      logButton = <button onClick={this.login} className="fblog">Login with Facebook</button>
    }

     return (
       <div style={{textAlign: "center"}}>
        <p>
        <h1 classname="welcome">{user ? `Hi, ${user.displayName}! You can now create events!` : 'Please log in here!'}</h1>
        </p>

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
        <Tab>Login</Tab>
        <Tab>NPOs</Tab>
        <Tab>Events</Tab>

       </TabList>

       <TabPanel>
        <FacebookLogin/>
       </TabPanel>

       <TabPanel>
        <Npos/>
       </TabPanel>

       <TabPanel>
        <Events/>
       </TabPanel>


     </Tabs>
     </div>
    );
  }
}

export default TabsComp;
