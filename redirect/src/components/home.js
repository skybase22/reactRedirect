import React, { Component } from 'react'
import { firebase } from '../firebase'
import "../App.css"
import { Spinner } from 'reactstrap';

export default class Home extends Component {

    constructor(props) {
        super(props)
        this.state = {
            data: [],
            error: false,
            isDataFetched: false,
            inputSearch: "",
            allData: [],
            errorMessage: ""
        }
    }

    componentDidMount = async () => {
        if (this.props.history.location.search.startsWith('?id=')) {
            let query = this.props.history.location.search.split('?id=')
            // await firebase.database().ref("myURL/" + query[1]).once('value', async (snapshot) => {
            //     if (snapshot.exists()) {
            // window.location.assign(snapshot.val().fullURL)
            this.props.history.push('/edit?' + query[1])
            //     } else {
            //     }
            // })
        } else if (!localStorage.getItem('isLogin')) {
            this.props.history.push('/login')
        }
        else {

            let database = firebase.database().ref("myURL");
            database.once('value', async (snapshot) => {
                if (snapshot.exists()) {
                    let arr = []
                    snapshot.forEach((data) => {
                        arr.push({ id: data.val().id, redirectURL: `https://psupktmaterial.firebaseapp.com?id=${data.key}`, destinationURL: data.val().fullURL })
                    });
                    let count = 0
                    await this.setState({ allData: arr })
                    let arr2 = arr.sort((a, b) => {
                        return parseInt(b.id) - parseInt(a.id)
                    })
                    this.setState({
                        data: arr2.filter((item) => {
                            count += 1
                            if (count <= 10) {
                                return true
                            }
                            return false
                        }), isDataFetched: true
                    })
                } else {
                    this.setState({ error: true })
                }
            })
        }

    }

    onClickAdd = (event) => {
        this.props.history.push('/add')
    }

    render() {
        if (this.props.history.location.search.startsWith('?id=')) {
            return (<div>
                <div>
                    <center><Spinner className="spins" color="dark" /></center>
                </div>
            </div>)
        }
        else
            return (
                <div className="container-fluid">

                    {/* Table URL */}
                    <div className="row justify-content-center align-items-center">
                        {this.state.error ? (<div style={{ marginTop: "21.56%", marginBottom: "21.56%" }} ><center>ไม่สามารถึงข้อมูลได้เนื่องจากมีข้อผิดพลาดเกิดขึ้น!</center></div>) : this.state.isDataFetched ? this.state.data === [] ? (<div style={{ marginTop: "21.56%", marginBottom: "21.56%" }} ><center>ไม่มีข้อมูล</center></div>) : (<div >

                            <table className="table table-bordered" >
                                <thead>
                                    <tr>
                                        <th style={{ width: "45%", textAlign: "center" }}>Redirect URL</th>
                                        <th style={{ width: "45%", textAlign: "center" }}>Destination URL</th>
                                        <th style={{ width: "10%", textAlign: "center" }}>Remove</th>
                                    </tr>
                                </thead>
                                <tbody id="myTable">
                                    {this.state.data.map((item, key) => {
                                        return (
                                            <tr key={key}>
                                                <td>{item.redirectURL} <button type="submit" className="btn btn-success" style={{ width: "100px" }} onClick={async (e) => {
                                                    e.preventDefault()
                                                    this.props.history.push('/edit?id=' + item.id)
                                                }}>Edit</button> </td>
                                                <td><a href={item.destinationURL}>{item.destinationURL}</a></td>
                                                <td style={{ textAlign: "center" }}><button type="button" className="btn btn-danger" onClick={async (e) => {
                                                    e.preventDefault()
                                                    await firebase.database().ref("myURL/" + item.id).remove()
                                                    let database = firebase.database().ref("myURL");
                                                    database.once('value', async (snapshot) => {
                                                        if (snapshot.exists()) {
                                                            let arr = []
                                                            snapshot.forEach((data) => {
                                                                arr.push({ id: data.val().id, redirectURL: `https://psupktmaterial.firebaseapp.com?id=${data.key}`, destinationURL: data.val().fullURL })
                                                            });
                                                            let count = 0
                                                            await this.setState({ allData: arr })
                                                            let arr2 = arr.sort((a, b) => {
                                                                return parseInt(b.id) - parseInt(a.id)
                                                            })
                                                            this.setState({
                                                                data: arr2.filter((item) => {
                                                                    count += 1
                                                                    if (count <= 10) {
                                                                        return true
                                                                    }
                                                                    return false
                                                                })
                                                            })
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
                        </div>) : (<div style={{ marginTop: "17.9%", marginBottom: "17.9%" }} ><center>กำลังดึงข้อมูล</center></div>)}
                    </div>

                    {/* Search */}
                    <div style={{ margin: "30px" }}>
                        <div className="container-fluid">
                            <div className="row justify-content-around">
                                <div className="col-4">
                                    <form className="form-inline">
                                        <label className="mb-2 mr-sm-2">Search from destination URL :&nbsp;</label>
                                        <input type="text" className="form-control mb-2 mr-sm-2" style={{ width: "500px" }} id="searchURL"
                                            placeholder="Enter keywords" name="searchURL" value={this.state.inputSearch} onChange={async (e) => {
                                                await this.setState({ inputSearch: e.target.value })
                                                let arr = []
                                                let count = 0
                                                arr = this.state.allData.filter((item) => {
                                                    console.log(typeof item.destinationURL)
                                                    if (typeof item.destinationURL === "string" && item.destinationURL.toLowerCase().includes(this.state.inputSearch.toLowerCase())) {
                                                        return true
                                                    }
                                                    return false
                                                })
                                                let arr2 = arr.sort((a, b) => {
                                                    return parseInt(b.id) - parseInt(a.id)
                                                })
                                                this.setState({
                                                    data: arr2.filter((item) => {
                                                        count += 1
                                                        if (count <= 10) {
                                                            return true
                                                        }
                                                        return false
                                                    })
                                                })
                                            }} />
                                        <button type="submit" className="btn btn-primary mb-2" style={{ width: "100px" }}
                                        >SEARCH</button>

                                        <button type="submit" className="btn btn-primary mb-2" style={{ width: "100px" }} onClick={this.onClickAdd}>Add</button>

                                    </form>
                                </div>
                                <div className="col-4">

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )
    }
} 