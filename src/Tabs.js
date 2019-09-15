import React, {Component} from 'react';
// import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import "react-tabs/style/react-tabs.css";
import axios from 'axios';
import CoolTabs from 'react-cool-tabs';
import DateTimePicker from 'react-date-picker';

import firestore from "./Firestore"

class Content1 extends Component {
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
          console.log(doc.id, '=>', doc.data()["location"]);
          this.setState({
            non_profit_array : this.state.non_profit_array.concat(doc.data())
          })
        });
      })
      .catch((err) => {
        console.log('Error getting documents', err);
      });

  }

  render() {
    console.log(this.state.non_profit_array.length)
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
class Content2 extends Component {
  state = {
    date: new Date(),
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
                <label htmlFor="exampleInputEmail1" style={{color: 'white'}}>Description</label>
                <br></br>
                <textarea className="form-control" rows="6" id="message"></textarea>
            </div>
            <br></br>
            <div className="form-group">
                <label htmlFor="message" style={{color: 'white'}}>Date & Time</label>
                <br></br>
                <DateTimePicker onChange={this.onChange} value={this.state.date} />
            </div>
            <br></br>
              <button type="submit" className="btn btn-primary">Submit</button>
          </form>
        </div>
      )
  }
}

class TabsComp extends Component {
render() {
   return (
     <div>
	     <CoolTabs
	       tabKey={'1'}
	       style={{ width: 1440, height: 782, background:  'white' }}
	       activeTabStyle={{ background:  'red', color:  'white' }}
	       unActiveTabStyle={{ background:  'green', color:  'black' }}
	       activeLeftTabBorderBottomStyle={{ background:  'blue', height:  4 }}
	       activeRightTabBorderBottomStyle={{ background:  'blue', height:  4 }}
	       tabsBorderBottomStyle={{ background:  'orange', height:  4 }}
	       leftContentStyle={{ background:  'lightgreen' }}
	       rightContentStyle={{ background:  'lightblue' }}
	       leftTabTitle={'Non Profit Organizations'}
	       rightTabTitle={'Events'}
	       leftContent={<Content1/>}
	       rightContent={<Content2/>}
	       contentTransitionStyle={'transform 0.6s ease-in'}
	       borderTransitionStyle={'all 0.6s ease-in'}/>
     </div>
    );
  }
}

export default TabsComp;
