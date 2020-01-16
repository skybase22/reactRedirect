import React, { Component } from 'react'
import { firebase } from '../firebase'
import "../App.css"
import { Spinner } from 'reactstrap'
import ReactExport from "react-export-excel"
// import { Base64 } from 'js-base64';

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

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
            urlQRCode: {},
            pageNow: 1,
            max_per_page: 10,
            counter: 0,
        }
    }

    componentDidMount = () => {

        if (this.props.history.location.search.startsWith('?id=')) {
            let query = this.props.history.location.search.split('?id=')
            this.props.history.push('/detail?id=' + query[1])
        }
        if ((localStorage.getItem('isLogin') === null) || (localStorage.getItem('username') === null) || (localStorage.getItem('name') === null)) {
            localStorage.setItem('from_page', "/")
            localStorage.removeItem("from_id")
            this.props.history.push('/login')
        }else{
            let databaseToken = firebase.database().ref("users/" + localStorage.getItem('username'));
            databaseToken.once('value', async (snapshot) => {
                if (localStorage.getItem('isLogin') !== snapshot.val().token || localStorage.getItem('name') !== snapshot.val().user) {
                    localStorage.setItem('from_page', "/")
                    localStorage.removeItem("from_id")
                    this.props.history.push('/login')
                }
            })
        }
       

        let database = firebase.database().ref("myURL");
        database.once('value', async (snapshot) => {
            if (snapshot.exists()) {
                let arr = []
                snapshot.forEach((data) => {
                    arr.push({
                        id: data.val().id,
                        value: `https://psupktmaterial.firebaseapp.com/detail?id=${data.key}`,
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
                        storageLocation: data.val().storageLocation,
                        department: data.val().department
                    })
                });

                await this.setState({ allData: arr })
                this.setState({
                    counter: this.state.allData.length
                })
                let arr2 = arr.sort((a, b) => {
                    return parseInt(b.id) - parseInt(a.id)
                })
                this.setState({
                    data: arr2, isDataFetched: true
                })
            } else {
                this.setState({ error: true })
            }
        })


    }

    renderFooter = () => {

        if (this.state.counter !== 0) {
            return (
                <div className='d-flex justify-content-end align-items-center'>
                    <div>
                        <nav>
                            <ul className='pagination justify-content-end mb-0'>
                                <li
                                    className={
                                        this.state.pageNow === 1
                                            ? "page-item disabled"
                                            : "page-item"
                                    }
                                    onClick={this.pagePrev}
                                >
                                    <button className='page-link'>
                                        <span aria-hidden="true">&laquo;</span>
                                    </button>
                                </li>
                                {this.renderPrev2Page()}
                                {this.renderPrev1Page()}
                                <li className='page-item active'>
                                    <button className='page-link'>
                                        {this.state.pageNow}
                                    </button>
                                </li>
                                {this.renderNext1Page()}
                                {this.renderNext2Page()}
                                <li
                                    className={
                                        this.state.pageNow ===
                                            Math.ceil(
                                                this.state.counter /
                                                this.state.max_per_page
                                            )
                                            ? "page-item disabled"
                                            : "page-item"
                                    }
                                    onClick={this.pageNext}
                                >
                                    <button type='button' className='page-link'>
                                        <span aria-hidden="true">&raquo;</span>
                                    </button>
                                </li>
                            </ul>
                        </nav>
                    </div>
                </div>
            )
        } else {
            return null
        }
    }

    renderPrev2Page = () => {
        if (
            this.state.pageNow ===
            Math.ceil(this.state.counter / this.state.max_per_page) &&
            Math.ceil(this.state.counter / this.state.max_per_page) >= 3
        ) {
            return (
                <li
                    className='page-item'
                    onClick={() => {
                        this.setState({ pageNow: this.state.pageNow - 2 })
                    }}
                >
                    <button className='page-link'>
                        {this.state.pageNow - 2}
                    </button>
                </li>
            )
        } else {
            return null
        }
    }

    renderPrev1Page = () => {
        if (this.state.pageNow !== 1) {
            return (
                <li
                    className='page-item'
                    onClick={() => {
                        this.setState({ pageNow: this.state.pageNow - 1 })
                    }}
                >
                    <button className='page-link'>
                        {this.state.pageNow - 1}
                    </button>
                </li>
            )
        } else {
            return null
        }
    }

    renderNext1Page = () => {
        if (
            this.state.pageNow !==
            Math.ceil(this.state.counter / this.state.max_per_page)
        ) {
            return (
                <li
                    className='page-item'
                    onClick={() => {
                        this.setState({ pageNow: this.state.pageNow + 1 })
                    }}
                >
                    <button className='page-link'>
                        {this.state.pageNow + 1}
                    </button>
                </li>
            )
        }
    }

    renderNext2Page = () => {
        if (
            this.state.pageNow === 1 &&
            Math.ceil(this.state.counter / this.state.max_per_page) >= 3
        ) {
            return (
                <li
                    className='page-item'
                    onClick={() => {
                        this.setState({ pageNow: this.state.pageNow + 2 })
                    }}
                >
                    <button className='page-link'>
                        {this.state.pageNow + 2}
                    </button>
                </li>
            )
        }
    }
    ///////////////////////////////////////////////////////////////////////////// render footer // END
    pagePrev = () => {
        if (this.state.pageNow > 1) {
            this.setState({ pageNow: this.state.pageNow - 1 })
        }
    }

    pageNext = () => {
        if (
            this.state.pageNow <
            Math.ceil(this.state.counter / this.state.max_per_page)
        ) {
            this.setState({ pageNow: this.state.pageNow + 1 })
        }
    }

    onClickAdd = (event) => {
        var numbers = /^[0-9]+$/;

        if ((localStorage.getItem('isLogin') === null)) {
            localStorage.setItem('from_page', "/add")
            localStorage.removeItem("from_id")
            this.props.history.push('/login')
        } else if (numbers.test(localStorage.getItem('isLogin'))) {
        } else {

        }
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
                <div>

                    <div>
                        <nav className="navbar navbar-expand-lg  navbar-dark bg-primary ">

                            <a className="navbar-brand" href="/">PSU Material</a>
                            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                                <span className="navbar-toggler-icon"></span>
                            </button>
                            <div className="collapse navbar-collapse" id="navbarNav">
                                <ul className="navbar-nav ml-auto">
                                    <li className="nav-item active">
                                        <a className="nav-link" href="/">Home <span className="sr-only">(current)</span></a>
                                    </li>
                                    <li className="nav-item">
                                        <a className="nav-link" href="/printqrcode">QR Code</a>
                                    </li>
                                    <li className="nav-item">
                                        <a className="nav-link" href="/result">Log</a>
                                    </li>
                                    <li className="nav-item">
                                        <a className="nav-link" href="/login" onClick={() => {
                                            localStorage.removeItem('from_page');
                                            localStorage.removeItem('name');
                                            localStorage.removeItem('username');
                                            localStorage.removeItem('isLogin');
                                        }}><i class="fas fa-sign-out-alt"></i></a>
                                    </li>

                                </ul>
                            </div>
                        </nav>


                        <div className="container-fluid">
                            <section>
                                <div className="d-flex justify-content-end align-items-center mt-3 mr-2" >
                                    {/* <div className="col-md-1"  > */}
                                    <ExcelFile element={<button className="btn btn-success mb-2">Download Data</button>}>
                                        <ExcelSheet data={this.state.allData} name="Employees">
                                            <ExcelColumn label="id" value="id" />
                                            <ExcelColumn label="durableCode" value="durableCode" />
                                            <ExcelColumn label="listMaterial" value="listMaterial" />
                                            <ExcelColumn label="department" value="department" />
                                            <ExcelColumn label="attribute" value="attribute" />
                                            <ExcelColumn label="serialNumber" value="serialNumber" />
                                            <ExcelColumn label="price" value="price" />
                                            <ExcelColumn label="numberPieces" value="numberPieces" />
                                            <ExcelColumn label="dateAccept" value="dateAccept" />
                                            <ExcelColumn label="namePickUp" value="namePickUp" />
                                            <ExcelColumn label="company" value="company" />
                                            <ExcelColumn label="storageLocation" value="storageLocation" />
                                            <ExcelColumn label="materialStatus" value="materialStatus" />
                                        </ExcelSheet>

                                    </ExcelFile>
                                    {/* </div> */}
                                </div>
                               

                                    <div className="d-flex justify-content-end align-items-center mr-2">

                                        <div className="row justify-content-center">
                                            <div className="col-auto ">
                                                <button type="submit" className="btn btn-success mb-2" style={{ width: "100px" }} onClick={this.onClickAdd}>Add</button>
                                            </div>
                                        </div>
                                    </div>

                               

                            </section>
                            <section className="block-qrcode">
                                <div className="row justify-content-center" ><h2 > Material</h2>
                                </div>

                            </section>
                            {/* Table URL */}

                            {this.state.error ? (<div style={{ marginTop: "21.56%", marginBottom: "21.56%" }} >
                                <center>ไม่สามารถึงข้อมูลได้เนื่องจากมีข้อผิดพลาดเกิดขึ้น!</center></div>) : this.state.isDataFetched ? this.state.data === [] ? (<div style={{ marginTop: "21.56%", marginBottom: "21.56%" }} ><center>ไม่มีข้อมูล</center></div>) : (<div >


                                    <div className="row justify-content-md-center" >

                                        <div>

                                            <div className="col-md-8 offset-md-2" >

                                                <form className="form-inline justify-content-end mb-3">

                                                    <input autoComplete="off" type="text" className="form-control mb-2 mr-sm-2" style={{ width: "200px" }} id="searchURL"
                                                        placeholder="Search keywords" name="searchURL" value={this.state.inputSearch} onChange={async (e) => {
                                                            await this.setState({ inputSearch: e.target.value })
                                                            let arr = []

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
                                                                data: arr2,
                                                                counter: arr2.length
                                                            })
                                                        }} />

                                                </form>
                                                <table className="table table-bordered shadow p-3 mb-5 bg-white rounded" >
                                                    <thead>
                                                        <tr>
                                                            <th scope="col" style={{ width: "70px", textAlign: "center" }}>ID</th>
                                                            <th scope="col" style={{ maxWidth: "6%", width: "100px", textAlign: "center" }}>รายการ</th>
                                                            <th scope="col" style={{ maxWidth: "auto", width: "100px", textAlign: "center" }}>รหัสครุภัณฑ์</th>
                                                            <th scope="col" style={{ maxWidth: "auto", width: "100px", textAlign: "center" }}>สถานะ</th>
                                                            <th scope="col" style={{ maxWidth: "auto", width: "115px", textAlign: "center" }}>วันที่เบิกครุภัณฑ์</th>
                                                            <th scope="col" style={{ maxWidth: "auto", width: "115px", textAlign: "center" }}>ชื่อผู้เบิกครุภัณฑ์</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody id="myTable">
                                                        {this.state.data.filter((item, index) => {
                                                            return (
                                                                item !== null &&
                                                                this.state.pageNow ===
                                                                Math.ceil((index + 1) / this.state.max_per_page)
                                                            )
                                                        }).map((item, key) => {
                                                            return (
                                                                <tr key={key}>
                                                                    <td><span className="sortable" onClick={
                                                                        async (e) => {
                                                                            e.preventDefault()
                                                                            this.props.history.push('/edit?id=' + item.id)
                                                                        }
                                                                    }>{item.id}</span></td>
                                                                    <td><span className="sortable" onClick={
                                                                        async (e) => {
                                                                            e.preventDefault()
                                                                            this.props.history.push('/edit?id=' + item.id)
                                                                        }
                                                                    }>{item.listMaterial}</span></td>
                                                                    <td><span className="sortable" onClick={
                                                                        async (e) => {
                                                                            e.preventDefault()
                                                                            this.props.history.push('/edit?id=' + item.id)
                                                                        }
                                                                    }>{item.durableCode}</span></td>
                                                                    <td><span className="sortable" onClick={
                                                                        async (e) => {
                                                                            e.preventDefault()
                                                                            this.props.history.push('/edit?id=' + item.id)
                                                                        }
                                                                    }>{item.materialStatus}</span></td>
                                                                    <td><span className="sortable" onClick={
                                                                        async (e) => {
                                                                            e.preventDefault()
                                                                            this.props.history.push('/edit?id=' + item.id)
                                                                        }
                                                                    }>{item.dateAccept}</span></td>
                                                                    <td><span className="sortable" onClick={
                                                                        async (e) => {
                                                                            e.preventDefault()
                                                                            this.props.history.push('/edit?id=' + item.id)
                                                                        }
                                                                    }>{item.namePickUp}</span></td>
                                                                </tr>
                                                            )
                                                        }
                                                        )
                                                        }
                                                    </tbody>

                                                </table>
                                                <div className="mb-5">
                                                {this.renderFooter()}
                                                </div>
                                            </div>

                                        </div>

                                    </div>




                                </div>) : (<div style={{ marginTop: "17.9%", marginBottom: "17.9%" }} > <center><Spinner className="spins" color="dark" /></center></div>)}


                            {/* Search */}
                        </div>
                    </div>
                </div>
            )
    }
} 