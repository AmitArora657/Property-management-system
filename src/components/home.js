import React from 'react';
import './home.css';
import Modal from 'react-modal';

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};

class Home extends React.Component {
     state = {
        property:[],showModal:false
     }

    defaultProperty = [
        {Id:"1",name:'Property1',description:'4bhk',size:'144sq ft'},
        {Id:"2",name:'Property2',description:'2bhk',size:'84sq ft'},
        {Id:"3",name:'Property3',description:'3bhk',size:'104sq ft'},
        {Id:"4",name:'Property4',description:'1bhk',size:'54sq ft'}
    ]

    addProperty=(e)=>{
        this.setState({showModal:true})
    }

    delProperty=(e)=>{
        let newProp = this.state.property.filter(prop=>{
            if(prop.Id !==e.Id) {
                return prop;
            }
        })
        this.setState({property:newProp})
    }

    closeModal=(e)=>{
        this.setState({showModal:false})
    }

    handleChange = (e,val) => {
       if(val==='name') {
        this.setState({'name':e.target.value})
       } else if(val==='size'){
        this.setState({'size':e.target.value})
        } else if(val==='desc'){
        this.setState({'desc':e.target.value})
       }
      };

      submitProperty=async (e)=>{
        let prop = {Size:this.state.size,Name:this.state.name,Description:this.state.desc}
        let property = this.state.property;
        property.push(prop);
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' , Authorization: 'Bearer keyHE1dNZxcS1l5qs'},
           
            body: JSON.stringify({"records": [
                {
                  "fields": prop
                }
              ]})
        };
        const response = await fetch('https://api.airtable.com/v0/appxkJyVje1FMVHwj/Properties', requestOptions);
        const data = await response.json();
        await this.setData();
      }

    async setData(){
        let data = await fetch('https://api.airtable.com/v0/appxkJyVje1FMVHwj/Properties?api_key=keyHE1dNZxcS1l5qs')
        let json_data = await data.json();
        let dataArr = json_data.records.map(obj=>{
            return obj.fields;
        })
        dataArr.sort();
        this.setState({property:dataArr,showModal:false,name:null,size:null,desc:null})
    }

async componentDidMount(){
   await this.setData()
} 

render() {
    return <>
    {this.state.showModal && <Modal
        isOpen={this.state.showModal}
        onRequestClose={this.closeModal}
        style={customStyles}
      >
        <h2>Add Property</h2>
        
        NAME: <input type="text"  onChange={(e)=>this.handleChange(e,'name')} value={this.state.name} />
        DESCRIPTION: <input type="text" onChange={(e)=>this.handleChange(e,'desc')} value={this.state.desc} />
        SIZE: <input type="text"  onChange={(e)=>this.handleChange(e,'size')} value={this.state.size}/>
        <button className='normal-button' onClick={this.submitProperty}> Add</button>
        <button className='normal-button' onClick={this.closeModal}> cancel</button>
        
      </Modal>}
    <button className='add-button' onClick={this.addProperty}> Add a New Property</button>
       {this.state.property.length && this.state.property.map((prop,i)=>{
       return  <div key={i} className='Property-block'>
        <div><h3>Property Name :</h3><p>{prop.Name}</p></div>
        <div><h3>Description :</h3><p>{prop.Description}</p> </div>
        <div><h3>Size :</h3><p>{prop.Size}</p> </div>
        <button id= {prop.Id} className='del-button'  onClick={() => this.delProperty(prop)}> Delete</button>
        </div>
       }) }
    </>
  
  }
}

export default Home;