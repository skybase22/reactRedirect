import React, { Component } from 'react'
import { firebase } from '../firebase'
import "../App.css"
import { Spinner } from 'reactstrap';
import { QRGenerator } from 'dynamic-qr-code-generator';
export default class Home extends Component {

    constructor(props) {
        super(props)
        this.state = {
            data: [],
            error: false,
            isDataFetched: false,
            inputSearch: "",
            allData: [],
            errorMessage: "",
            urlQRCode: {}
        }
    }

    componentDidMount = async () => {
        if (this.props.history.location.search.startsWith('?id=')) {
            let query = this.props.history.location.search.split('?id=')
            this.props.history.push('/detail?id=' + query[1])
        }
        else {
            let database = firebase.database().ref("myURL");
            database.once('value', async (snapshot) => {
                if (snapshot.exists()) {
                    let arr = []
                    snapshot.forEach((data) => {
                        arr.push({
                            id: data.val().id,
                            value: `https://psupktmaterial.firebaseapp.com?id=${data.key}`,
                            listMaterial: data.val().listMaterial,
                            attribute: data.val().attribute,
                            company: data.val().company,
                            dateAccept: data.val().dateAccept,
                            durableCode: data.val().durableCode,
                            materialStatus: data.val().materialStatus,
                            namePickUp: data.val().namePickUp,
                            price: data.val().price,
                            numberPieces: data.val().numberPieces,
                            serialNumber: data.val().serialNumber,
                            storageLocation: data.val().storageLocation
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

    }

    onClickAdd = (event) => {
        if (!(localStorage.getItem('isLogin') === "$2y$12$opGG6Ee4T6RL1LNi/vEB3.Xcihvx.64LHnlA0AxW15WpOl.kGYVPC")) {
            this.props.history.push('/login')
        } else {
            this.props.history.push('/add')
        }

    }

    genQR = (pro) => {

        QRGenerator(pro)

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
                    <div className="row justify-content-center" style={{ margin: "3%" }}><h2 > Material</h2>
                    </div>
                    {/* Table URL */}

                    {this.state.error ? (<div style={{ marginTop: "21.56%", marginBottom: "21.56%" }} >
                        <center>ไม่สามารถึงข้อมูลได้เนื่องจากมีข้อผิดพลาดเกิดขึ้น!</center></div>) : this.state.isDataFetched ? this.state.data === [] ? (<div style={{ marginTop: "21.56%", marginBottom: "21.56%" }} ><center>ไม่มีข้อมูล</center></div>) : (<div >


                            <div className="row justify-content-md-center" >

                                <div>
                                    <div className="col-md-6 offset-md-3" >

                                        <table className="table table-bordered shadow p-3 mb-5 bg-white rounded" >
                                            <thead>
                                                <tr>
                                                    <th scope="col" style={{ width: "70px", textAlign: "center" }}>ID</th>
                                                    <th scope="col" style={{ maxWidth: "6%", width: "100px", textAlign: "center" }}>รายการ</th>
                                                    <th scope="col" style={{ maxWidth: "auto", width: "100px", textAlign: "center" }}>สถานะ</th>
                                                    <th scope="col" style={{ maxWidth: "auto", width: "115px", textAlign: "center" }}>วันที่เบิกครุภัณฑ์</th>
                                                    <th scope="col" style={{ maxWidth: "auto", width: "115px", textAlign: "center" }}>ชื่อผู้เบิกครุภัณฑ์</th>
                                                </tr>
                                            </thead>
                                            <tbody id="myTable">
                                                {this.state.data.map((item, key) => {
                                                    return (
                                                        <tr key={key}>
                                                            <td>{item.id}</td>
                                                            <td><span className="sortable" onClick={
                                                                async (e) => {
                                                                    e.preventDefault()
                                                                    this.props.history.push('/detail?id=' + item.id)
                                                                }
                                                            }>{item.listMaterial}</span></td>
                                                            <td>{item.materialStatus}
                                                            </td>
                                                            <td>{item.dateAccept}

                                                            </td>
                                                            <td>{item.namePickUp}</td>
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
                                                    if (item.listMaterial.toLowerCase().includes(this.state.inputSearch.toLowerCase())
                                                        || item.durableCode.toLowerCase().includes(this.state.inputSearch.toLowerCase())
                                                        || item.serialNumber.toLowerCase().includes(this.state.inputSearch.toLowerCase())
                                                        || item.storageLocation.toLowerCase().includes(this.state.inputSearch.toLowerCase())
                                                        || item.namePickUp.toLowerCase().includes(this.state.inputSearch.toLowerCase())
                                                        || item.materialStatus.toLowerCase().includes(this.state.inputSearch.toLowerCase())
                                                        || item.attribute.toLowerCase().includes(this.state.inputSearch.toLowerCase())
                                                        || item.company.toLowerCase().includes(this.state.inputSearch.toLowerCase())
                                                        || item.dateAccept.toLowerCase().includes(this.state.inputSearch.toLowerCase())
                                                        || item.id.toLowerCase().includes(this.state.inputSearch.toLowerCase())
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
                                    <div className="row justify-content-center">
                                        <div className="col-auto ">
                                            <button type="submit" className="btn btn-success mb-2" style={{ width: "100px" }} onClick={this.onClickAdd}>Add</button>
                                        </div>
                                    </div>
                                </div>





                            </div>


                        </div>) : (<div style={{ marginTop: "17.9%", marginBottom: "17.9%" }} > <center><Spinner className="spins" color="dark" /></center></div>)}


                    {/* Search */}
                  
                </div>

            )
    }
} 