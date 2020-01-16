import React, { Component } from 'react'
import { firebase } from '../firebase'
import { Spinner } from 'reactstrap';

export default class Result extends Component {


    constructor(props) {
        super(props)
        this.state = {
            data: [],
            error: false,
            isDataFetched: false,
            inputSearch: "",
            allData: [],
            errorMessage: "",
            sortAction: "แสดงทั้งหมด",
            pageNow: 1,
            max_per_page: 10,
            counter: 0,
        }

    }


    componentDidMount = () => {

        if ((localStorage.getItem('isLogin') === null) || (localStorage.getItem('username') === null) || (localStorage.getItem('name') === null)) {
            localStorage.setItem('from_page', "/result")
            localStorage.removeItem("from_id")
            this.props.history.push('/login')
        }
        if (localStorage.getItem('isLogin') !== null) {
            let databaseToken = firebase.database().ref("users/" + localStorage.getItem('username'));
            databaseToken.once('value', async (snapshot) => {
                if (localStorage.getItem('isLogin') !== snapshot.val().token || localStorage.getItem('name') !== snapshot.val().user) {
                    localStorage.setItem('from_page', "/result")
                    localStorage.removeItem("from_id")
                    this.props.history.push('/login')
                }
            })
        }

        let database = firebase.database().ref("Result");
        database.once('value', async (snapshot) => {
            if (snapshot.exists()) {
                let arr = []
                snapshot.forEach((data) => {
                    arr.push({
                        id: data.val().id,
                        idMaterial: data.val().idMaterial,
                        result: data.val().result,
                        listMaterial: data.val().listMaterial,
                        durableCode: data.val().durableCode,
                        materialStatus: data.val().materialStatus,
                        department: data.val().department,
                        dateUpdate: data.val().dateUpdate,
                        name: data.val().name,
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

    handleSelect = async (event) => {
        var counterPage = 0
        await this.setState({ sortAction: event.target.value });
        this.state.data.filter((item) => {
            if (this.state.sortAction === "ผลการตรวจ") {
                if (item.result !== "เพิ่มครุภัณฑ์") {
                    counterPage = counterPage + 1
                    return true
                } else {

                    return false
                }
            } else if (this.state.sortAction === "เพิ่มครุภัณฑ์") {
                if (item.result === "เพิ่มครุภัณฑ์") {
                    counterPage = counterPage + 1
                    return true
                } else {

                    return false
                }
            } else if (this.state.sortAction === "แสดงทั้งหมด") {
                counterPage = counterPage + 1
                return true
            }
            return false
        })
        await this.setState({
            counter: counterPage,
            pageNow: 1
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

    render() {

        return (
            <div>
                <nav className="navbar navbar-expand-lg navbar-dark bg-primary mb-3 ">

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
                            <li className="nav-item active">
                                <a className="nav-link" href="/result">Log<span className="sr-only">(current)</span></a>
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
                    <section className="block-qrcode">
                        <div className="row justify-content-center" ><h2 > รายงานผลการตรวจ</h2>
                        </div>

                    </section>

                    <section>
                        <div className="row justify-content-end mb-4 mr-2 ">
                            <div className="">
                                <select id="inputState" className="form-control" onChange={this.handleSelect}>

                                    <option value="แสดงทั้งหมด">แสดงทั้งหมด</option>
                                    <option value="ผลการตรวจ">ผลการตรวจ</option>
                                    <option value="เพิ่มครุภัณฑ์">เพิ่มครุภัณฑ์</option>
                                </select>
                            </div>
                        </div>
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
                                                            let count = 0
                                                            arr = this.state.allData.filter((item) => {
                                                                if (item.dateUpdate.toLowerCase().includes(this.state.inputSearch.toLowerCase())
                                                                    || item.department.toLowerCase().includes(this.state.inputSearch.toLowerCase())
                                                                    || item.durableCode.toLowerCase().includes(this.state.inputSearch.toLowerCase())
                                                                    || item.id.toLowerCase().includes(this.state.inputSearch.toLowerCase())
                                                                    || item.materialStatus.toLowerCase().includes(this.state.inputSearch.toLowerCase())
                                                                    || item.name.toLowerCase().includes(this.state.inputSearch.toLowerCase())
                                                                    || item.result.toLowerCase().includes(this.state.inputSearch.toLowerCase())
                                                                    || item.listMaterial.toLowerCase().includes(this.state.inputSearch.toLowerCase())
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
                                                            this.setState({
                                                                counter: arr2.length
                                                            })
                                                        }} />

                                                </form>
                                                <table className="table table-bordered shadow p-3 mb-5 bg-white rounded" >
                                                    <thead>
                                                        <tr>
                                                            <th scope="col" style={{ maxWidth: "auto", width: "100px", textAlign: "center" }}>คณะ/หน่วยงาน</th>
                                                            <th scope="col" style={{ maxWidth: "auto", width: "100px", textAlign: "center" }}>รายการ</th>
                                                            <th scope="col" style={{ maxWidth: "auto", width: "100px", textAlign: "center" }}>รหัสครุภัณฑ์</th>
                                                            <th scope="col" style={{ maxWidth: "auto", width: "100px", textAlign: "center" }}>ผลการตรวจ</th>
                                                            <th scope="col" style={{ maxWidth: "auto", width: "100px", textAlign: "center" }}>วันที่ตรวจ</th>
                                                            <th scope="col" style={{ maxWidth: "auto", width: "100px", textAlign: "center" }}>ผู้ตรวจ</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody id="myTable">
                                                        {this.state.data.filter((item) => {
                                                            if (this.state.sortAction === "ผลการตรวจ") {
                                                                if (item.result !== "เพิ่มครุภัณฑ์") {

                                                                    return true
                                                                } else {

                                                                    return false
                                                                }
                                                            } else if (this.state.sortAction === "เพิ่มครุภัณฑ์") {
                                                                if (item.result === "เพิ่มครุภัณฑ์") {

                                                                    return true
                                                                } else {

                                                                    return false
                                                                }
                                                            } else {

                                                                return true
                                                            }

                                                        })
                                                            .filter((item, index) => {

                                                                return (
                                                                    item !== null &&
                                                                    this.state.pageNow ===
                                                                    Math.ceil((index + 1) / this.state.max_per_page)
                                                                )
                                                            })
                                                            .map((item, key) => {

                                                                return (
                                                                    <tr key={key}>
                                                                        <td><span className="sortable" onClick={
                                                                            async (e) => {
                                                                                e.preventDefault()
                                                                                this.props.history.push('/edit?id=' + item.idMaterial)
                                                                            }
                                                                        }>{item.department}</span></td>
                                                                        <td><span className="sortable" onClick={
                                                                            async (e) => {
                                                                                e.preventDefault()
                                                                                this.props.history.push('/edit?id=' + item.idMaterial)
                                                                            }
                                                                        }>{item.listMaterial}</span></td>
                                                                        <td><span className="sortable" onClick={
                                                                            async (e) => {
                                                                                e.preventDefault()
                                                                                this.props.history.push('/edit?id=' + item.idMaterial)
                                                                            }
                                                                        }>{item.durableCode}</span></td>
                                                                        <td><span className="sortable" onClick={
                                                                            async (e) => {
                                                                                e.preventDefault()
                                                                                this.props.history.push('/edit?id=' + item.idMaterial)
                                                                            }
                                                                        }>{item.result}</span></td>
                                                                        <td><span className="sortable" onClick={
                                                                            async (e) => {
                                                                                e.preventDefault()
                                                                                this.props.history.push('/edit?id=' + item.idMaterial)
                                                                            }
                                                                        }>{item.dateUpdate}</span></td>
                                                                        <td><span className="sortable" onClick={
                                                                            async (e) => {
                                                                                e.preventDefault()
                                                                                this.props.history.push('/edit?id=' + item.idMaterial)
                                                                            }
                                                                        }>{item.name}</span></td>
                                                                    </tr>
                                                                )
                                                            }
                                                            )
                                                        }
                                                    </tbody>

                                                </table>
                                                {this.renderFooter()}
                                            </div>
                                        </div>
                                    </div>

                                <div className="row justify-content-center mt-3">
                                </div>

                            </div>) : (<div style={{ marginTop: "17.9%", marginBottom: "17.9%" }} > <center><Spinner className="spins" color="dark" /></center></div>)}
                    </section>
                </div>
            </div>

        )
    }
}
