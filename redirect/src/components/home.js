import React, { Component } from 'react'
import app from "firebase/app"
import firebase from 'firebase'
import "../App.css"
const config = {
    apiKey: "AIzaSyBL5QaQYXNqfnHqPXKewifQG0gd-VDYqMA",
    authDomain: "ppsu-52213.firebaseapp.com",
    databaseURL: "https://ppsu-52213.firebaseio.com",
    projectId: "ppsu-52213",
    storageBucket: "",
    messagingSenderId: "908680046305",
    appId: "1:908680046305:web:dc736d95933d1df2"
}

export default class Home extends Component {

   constructor(props){
        super(props)
        this.state={
                    isFetchLastNumber:false,
                    lastNumber:null,
                    data:[],
                    error:false,
                    isDataFetched:false,
                    inputURL:"",
                    inputSearch:"",
                    allData:[]
        }
       //app.initializeApp(config)
   }

   componentDidMount = async () => {
    if (!firebase.apps.length) {
        app.initializeApp(config);
    }
    if(this.props.history.location.search.startsWith('?redirect=')){
        let query = this.props.history.location.search.split('?redirect=')
        await firebase.database().ref("myURL/"+query[1]).once('value', async (snapshot) => {
            if (snapshot.exists()) {
                window.location.assign(snapshot.val().fullURL)
                
            } else {
                
            }
        })
    } else if (!localStorage.getItem('isLogin')) {
        this.props.history.push('/login')
    }
    
    else{
        await firebase.database().ref("listNumber").once('value', async (snapshot) => {
            if (snapshot.exists()) {
                await this.setState({lastNumber:parseInt(snapshot.val().number)})
            }else{
                await this.setState({error:true})
            }
        })
        
            let database = firebase.database().ref("myURL");
            database.once('value', async (snapshot) => {
                if (snapshot.exists()) {
                    let arr = []
                    snapshot.forEach( (data) => {
                            arr.push({id:data.val().id,redirectURL:`https://ppsu-52213.firebaseapp.com?redirect=${data.key}`,destinationURL:data.val().fullURL})
                    });
                    let count = 0
                    await this.setState({allData:arr})
                    let arr2 = arr.sort((a,b) => {
                        return parseInt(b.id) - parseInt(a.id)
                    })
                    this.setState({data:arr2.filter((item) => {
                         count += 1
                         if(count <= 10){
                            return true
                         }
                         return false
                    }),isDataFetched:true})
                } else {
                    this.setState({error:true})
                }
            })      
    }
       
    }

    onSubmit1 = async (event) => {
        event.preventDefault()
        
        if(this.state.lastNumber !== null){
            let newNumber = this.state.lastNumber + 1
            var firebaseRef = firebase.database().ref(`myURL/${newNumber.toLocaleString(undefined,{minimumIntegerDigits:5}).replace(',','')}`);
            let key = newNumber.toLocaleString(undefined,{minimumIntegerDigits:5}).replace(',','')
            firebaseRef.set({
                   id:key,
                   fullURL:this.state.inputURL
            });
            var firebaseRef2 = firebase.database().ref(`listNumber`)
            await firebaseRef2.set({
                    number: key
            }).then(() => {
                 let database = firebase.database().ref("myURL");
                 database.once('value', async (snapshot) => {
                if (snapshot.exists()) {
                    let arr = []
                    snapshot.forEach( (data) => {
                            arr.push({id:data.val().id,redirectURL:`https://ppsu-52213.firebaseapp.com?redirect=${data.key}`,destinationURL:data.val().fullURL})
                    });
                    let count = 0
                    await this.setState({allData:arr})
                    let arr2 = arr.sort((a,b) => {
                        return parseInt(b.id) - parseInt(a.id)
                    })
                    this.setState({data:arr2.filter((item) => {
                         count += 1
                         if(count <= 10){
                            return true
                         }
                         return false
                    })})
                } 
            }) 
            }
            );
            await firebaseRef2.once('value', async (snapshot) => {
                if (snapshot.exists()) {
                    await this.setState({lastNumber:parseInt(snapshot.val().number)})
                }
            })
            this.setState({inputURL:""})
           
        }
        
        
    }

    render() {
        if(this.props.history.location.search.startsWith('?redirect=') ){
            return (<div>
                loading
            </div>)
        }
        else
        return (

            <div className="container-fluid">
                <div style={{ margin: "30px" }}>
                    <h2 className="text-center">Generate redirect URL</h2>
                </div>
                <div className="row justify-content-center">
                    <div className="col-8">
                        <form className="form-inline" onSubmit={this.onSubmit1}>
                            <br />
                            <label className="mb-2 mr-sm-2">URL :&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</label>
                            <input type="text" className="form-control mb-2 mr-sm-2" style={{ width: "500px" }} id="redirectURL"
                                placeholder="URL" name="redirectURL" required value={this.state.inputURL} onChange={
                                    (e) => {
                                        this.setState({inputURL:e.target.value})
                                    }
                                }/>
                            <button type="submit" className="btn btn-primary mb-2" style={{ width: "100px" }}>SUBMIT</button>
                        </form>
                    </div>
                </div>
                
                {this.state.error ? "ไม่สามารถดึงข้อมูลได้เนื่องจากมีข้อผิดพลาดเกิดขึ้น" : this.state.isDataFetched ? this.state.data === [] ? "ไม่มีข้อมูล" : (<div className="container-fluid" >
                        <div className="col-md-8 offset-md-2" >
                            <table style={{ width: "100%" }} className="table table-bordered" >
                            <thead>
                                <tr>
                                    
                                        <th style={{ width: "45%", textAlign: "center" }}>Redirect URL</th>
                                        <th style={{ width: "45%", textAlign: "center" }}>Destination URL</th>
                                        <th style={{ width: "10%", textAlign: "center" }}>Remove</th>

                                    

                                </tr></thead>
                                <tbody id="myTable">
                                    
                                        {this.state.data.map((item,key) => {
                                                    return (
                                                        <tr key={key}>
                                                            <td>{item.redirectURL}</td>
                                                            <td>{item.destinationURL}</td>
                                                            <td style={{textAlign:"center"}}><button type="button" className="btn btn-danger" onClick={ async (e) => {
                                                                e.preventDefault()
                                                                await firebase.database().ref("myURL/" + item.id).remove()
                                                                let database = firebase.database().ref("myURL");
                 database.once('value', async (snapshot) => {
                if (snapshot.exists()) {
                    let arr = []
                    snapshot.forEach( (data) => {
                            arr.push({id:data.val().id,redirectURL:`https://ppsu-52213.firebaseapp.com?redirect=${data.key}`,destinationURL:data.val().fullURL})
                    });
                    let count = 0
                    await this.setState({allData:arr})
                    let arr2 = arr.sort((a,b) => {
                        return parseInt(b.id) - parseInt(a.id)
                    })
                    this.setState({data:arr2.filter((item) => {
                         count += 1
                         if(count <= 10){
                            return true
                         }
                         return false
                    })})
                } 
            }) 
                                                            }}>Remove</button></td>
                                                        </tr>    
                                                    )
                                            }
                                            )
                                        }
                                        
                                   
                                </tbody>
                            </table>
                        </div>
                        <div className="col-md-4 offset-md-4">
                        </div>

                    </div>) : "กำลังดึงข้อมูล"}

                    
                <div style={{ margin: "30px" }}>
                    <div className="container-fluid">
                        <div className="row justify-content-center">
                            <div className="col-8">
                                <form className="form-inline">
                                    <label className="mb-2 mr-sm-2">Search from destination URL :&nbsp;</label>
                                    <input type="text" className="form-control mb-2 mr-sm-2" style={{ width: "500px" }} id="searchURL"
                                        placeholder="Enter keywords" name="searchURL" value={this.state.inputSearch} onChange={async (e) => {
                                            await this.setState({inputSearch:e.target.value})
                                            let arr = []
                                            let count = 0
                                            arr = this.state.allData.filter((item) => {
                                                console.log(typeof item.destinationURL)
                                                if(typeof item.destinationURL === "string" && item.destinationURL.toLowerCase().includes(this.state.inputSearch.toLowerCase())){
                                                    return true
                                                }
                                                return false
                                            })
                                            let arr2 = arr.sort((a,b) => {
                                                return parseInt(b.id) - parseInt(a.id)
                                            })
                                            this.setState({data:arr2.filter((item) => {
                                                 count += 1
                                                 if(count <= 10){
                                                    return true
                                                 }
                                                 return false
                                            })})

                                        }}/>
                                    <button type="submit" className="btn btn-primary mb-2" style={{ width: "100px" }}
                                        >SEARCH</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>





                
                        <button onClick={() => console.log(this.props.history)}>click me</button>
                    

                
                


            </div>


        )
    }
}