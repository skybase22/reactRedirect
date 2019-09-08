import React, { Component } from 'react'
import { firebase } from '../firebase'
export default class Edit extends Component {

    constructor(props) {
        super(props)
        this.state = {
            isFetchLastNumber: false,
            lastNumber: null,
            data: [],
            error: false,
            inputURL: "",
            inputURL2: "",
            allData: [],
            errorMessage: "",
            url1: "",
            url2: "",
            testf: "h"
        }
    }

    handleInput = (event) => {
        this.setState({[event.target.name]:event.target.value})
    }

    componentDidMount = async () => {
        //this.nameInput.focus();
        // const valueTarget = event.target.value
        // const usernameTarget = event.target.username
        if (this.props.history.location.search.startsWith('?id=')) {
            let query = this.props.history.location.search.split('?id=')
            await firebase.database().ref("myURL/" + query[1]).once('value', async (snapshot) => {
                if (snapshot.exists()) {
                    // window.location.assign(snapshot.val().fullURL)
                    this.setState({inputURL : snapshot.val().fullURL})
                    this.setState({inputURL2 : snapshot.val().fullURL2})
                } else {
                }
            })
           
        }
        await firebase.database().ref("listNumber").once('value', async (snapshot) => {
            if (snapshot.exists()) {
                await this.setState({ lastNumber: parseInt(snapshot.val().number) })
            } else {
                await this.setState({ error: true })
            }
        })
    }
    onUpdate = async (event) => {
        event.preventDefault()
        if (this.props.history.location.search.startsWith('?id=')) {
            let query = this.props.history.location.search.split('?id=')
            await firebase.database().ref("myURL/" + query[1]).set({
                id: query[1],
                fullURL: this.state.inputURL,
                fullURL2: this.state.inputURL2
            })
            this.props.history.push('/')
        }
        // if (this.state.lastNumber !== null && this.state.errorMessage === "") {
        //     let newNumber = this.state.lastNumber + 1
        //     var firebaseRef = firebase.database().ref(`myURL/${newNumber.toLocaleString(undefined, { minimumIntegerDigits: 5 }).replace(',', '')}`);
        //     let key = newNumber.toLocaleString(undefined, { minimumIntegerDigits: 5 }).replace(',', '')
        //     firebaseRef.set({
        //         id: key,
        //         fullURL: this.state.inputURL,
        //         fullURL2: this.state.inputURL2
        //     });
        //     var firebaseRef2 = firebase.database().ref(`listNumber`)
        //     await firebaseRef2.set({
        //         number: key
        //     }).then(() => {
        //         // let database = firebase.database().ref("myURL");
        //         // database.once('value', async (snapshot) => {
        //         //     if (snapshot.exists()) {
        //         //         let arr = []
        //         //         snapshot.forEach((data) => {
        //         //             arr.push({ id: data.val().id, redirectURL: `https://psupktmaterial.firebaseapp.com?id=${data.key}`, destinationURL: data.val().fullURL })
        //         //         });
        //         //         let count = 0
        //         //         await this.setState({ allData: arr })
        //         //         let arr2 = arr.sort((a, b) => {
        //         //             return parseInt(b.id) - parseInt(a.id)
        //         //         })
        //         //         this.setState({
        //         //             data: arr2.filter((item) => {
        //         //                 count += 1
        //         //                 if (count <= 10) {
        //         //                     return true
        //         //                 }
        //         //                 return false
        //         //             })
        //         //         })
        //         //     }
        //         // })
        //     }
        //     );
        //     await firebaseRef2.once('value', async (snapshot) => {
        //         if (snapshot.exists()) {
        //             await this.setState({ lastNumber: parseInt(snapshot.val().number) })
        //         }
        //     })
        //     this.setState({ inputURL: "" })
        //     this.setState({ inputURL2: "" })
        //     this.props.history.push('/')
        // }
    }

    render() {
        return (

            <div className="container-fluid">

                <div style={{ margin: "20px" }}>
                    <h2 className="text-center">Update Material</h2>
                </div>
                <div className="row justify-content-center">
                    <div style={{ margin: "30px" }}>
                        <div className="col-md-auto">
                            <form className="form-inline" onSubmit={this.onUpdate}>

                                <label className="mb-2 mr-sm-2">URL :</label>
                                <input type="text" className="form-control mb-2 mr-sm-2" style={{ width: "500px" }} 
                                    placeholder="URL" name="inputURL" required onChange={this.handleInput} defaultValue={this.state.inputURL} autoComplete="off" />

                                <label className="mb-2 mr-sm-2">URL2 :</label>
                                <input type="text" className="form-control mb-2 mr-sm-2" style={{ width: "500px" }} 
                                    placeholder="URL" name="inputURL2" required onChange={this.handleInput} defaultValue={this.state.inputURL2} />

                                <button type="submit" className="btn btn-primary mb-2" style={{ width: "100px" }}>SUBMIT</button>
                            </form>
                            <small style={{ color: "red", textAlign: "center" }} className="text-center">{this.state.errorMessage !== "" ? this.state.errorMessage : ""}</small>
                        </div>
                    </div>
                </div>


            </div>
        )
    }
}