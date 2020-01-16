import React, { Component } from 'react'
import { firebase } from '../firebase'
import { Spinner } from 'reactstrap';
export default class History extends Component {

    constructor(props) {
        super(props)
        this.state = {
            data: [],
            error: false,
            isDataFetched: false,
            inputSearch: "",
            allData: [],
            errorMessage: "",
        }
    }


    componentDidMount = async () => {

        if ((localStorage.getItem('isLogin') === null)) {
            localStorage.setItem('from_page', "/history")
            localStorage.removeItem("from_id")
            this.props.history.push('/login')
        }
        let databaseToken = firebase.database().ref("users/" + localStorage.getItem('username'));
        databaseToken.once('value', async (snapshot) => {
            if (localStorage.getItem('isLogin') !== snapshot.val().token) {
                localStorage.setItem('from_page', "/history")
                localStorage.removeItem("from_id")
                this.props.history.push('/login')
            }
        })
        let database = firebase.database().ref("History");
        database.once('value', async (snapshot) => {
            if (snapshot.exists()) {
                let arr = []
                snapshot.forEach((data) => {
                    arr.push({
                        id: data.val().id,
                        action: data.val().action,
                        listMaterial: data.val().listMaterial,
                        durableCode: data.val().durableCode,
                        materialStatus: data.val().materialStatus,
                        serialNumber: data.val().serialNumber,
                        dateUpdate: data.val().dateUpdate,
                        name: data.val().name,
                    })
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


    render() {

        return (
            <div>
                <nav className="navbar navbar-expand-lg  navbar-dark bg-primary mb-3 ">

                    <a className="navbar-brand" href="/">PSU Material</a>
                    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav ml-auto">
                            <li className="nav-item">
                                <a className="nav-link" href="/">Home </a>
                            </li>
                            <li className="nav-item ">
                                <a className="nav-link" href="/printqrcode">QR Code</a>
                            </li>
                            <li className="nav-item ">
                                <a className="nav-link" href="/result">Result</a>
                            </li>
                            <li className="nav-item active">
                                <a className="nav-link" href="/history">History<span className="sr-only">(current)</span></a>
                            </li>
                        </ul>
                    </div>
                </nav>
                <div className="container-fluid">
                    <section className="block-qrcode">
                        <div className="row justify-content-center" ><h2 > History</h2>
                        </div>

                    </section>
                    <section>
                        {this.state.error ? (<div style={{ marginTop: "21.56%", marginBottom: "21.56%" }} >
                            <center>ไม่สามารถึงข้อมูลได้เนื่องจากมีข้อผิดพลาดเกิดขึ้น!</center></div>) : this.state.isDataFetched ? this.state.data === [] ? (<div style={{ marginTop: "21.56%", marginBottom: "21.56%" }} ><center>ไม่มีข้อมูล</center></div>) : (<div >


                                <div className="row justify-content-md-center" >

                                    <div>
                                        <div className="col-md-6 offset-md-3" >

                                            <table className="table table-bordered shadow p-3 mb-5 bg-white rounded" >
                                                <thead>
                                                    <tr>
                                                        <th scope="col" style={{ maxWidth: "auto", width: "200px", textAlign: "center" }}>ประวัติ</th>
                                                        <th scope="col" style={{ maxWidth: "auto", width: "100px", textAlign: "center" }}>วันที่</th>
                                                    </tr>
                                                </thead>
                                                <tbody id="myTable">
                                                    {this.state.data.map((item, key) => {
                                                        return (
                                                            <tr key={key}>
                                                                <td>{item.action}</td>

                                                                <td>{item.dateUpdate}</td>

                                                            </tr>
                                                        )
                                                    }
                                                    )
                                                    }
                                                </tbody>

                                            </table>
                                        </div>
                                    </div>
                                </div>


                                <div className="row justify-content-center">

                                    <div className="col-md-9-center" >
                                        <form className="form-inline">
                                            <label className="mb-2 mr-sm-2">Search keywords :  </label>
                                            <input type="text" className="form-control mb-2 mr-sm-2" style={{ width: "300px" }} id="searchURL"
                                                placeholder="Enter keywords" name="searchURL" value={this.state.inputSearch} onChange={async (e) => {
                                                    await this.setState({ inputSearch: e.target.value })
                                                    let arr = []
                                                    let count = 0
                                                    arr = this.state.allData.filter((item) => {
                                                        if (item.action.toLowerCase().includes(this.state.inputSearch.toLowerCase())
                                                            || item.dateUpdate.toLowerCase().includes(this.state.inputSearch.toLowerCase())

                                                        ) {
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

                                        </form>
                                    </div>
                                </div>

                            </div>) : (<div style={{ marginTop: "17.9%", marginBottom: "17.9%" }} > <center><Spinner className="spins" color="dark" /></center></div>)}
                    </section>
                </div>
            </div>

        )
    }
}
