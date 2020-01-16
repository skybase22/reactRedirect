import React, { Component } from 'react'
import { firebase } from '../firebase'
import { QRCode } from "react-qr-svg";
export default class Printqrcode extends Component {

    constructor(props) {
        super(props)
        this.state = {
            allData: [],
            dateBefore: "",
            dateAfter: "",
            dataAfterCompare: [],
            pageNow: 1,
            max_per_page: 10,
            counter: 0,
            sortAction: "10",
        }
    }


    componentDidMount = () => {

        if ((localStorage.getItem('isLogin') === null) || (localStorage.getItem('username') === null) || (localStorage.getItem('name') === null)) {
            localStorage.setItem('from_page', "/printqrcode")
            localStorage.removeItem("from_id")
            this.props.history.push('/login')
        }
        let databaseToken = firebase.database().ref("users/" + localStorage.getItem('username'));
        databaseToken.once('value', async (snapshot) => {
            if (localStorage.getItem('isLogin') !== snapshot.val().token || localStorage.getItem('name') !== snapshot.val().user) {
                localStorage.setItem('from_page', "/printqrcode")
                localStorage.removeItem("from_id")
                this.props.history.push('/login')
            }
        })
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
                        storageLocation: data.val().storageLocation
                    })
                });

                this.setState({
                    allData: arr.sort((a, b) => {
                        return parseInt(b.id) - parseInt(a.id)
                    }),
                    dataAfterCompare: arr.sort((a, b) => {
                        return parseInt(b.id) - parseInt(a.id)
                    })
                })
                this.setState({
                    counter: this.state.allData.length
                })
            } else {
                this.setState({ error: true })
            }
        })
    }

    handleSelectBefore = async (event) => {
        var counterPage = 0
        await this.setState({ [event.target.name]: event.target.value });
        this.setState({
            dataAfterCompare: this.state.allData.sort((a, b) => {
                return parseInt(b.id) - parseInt(a.id)
            })
                .filter((day) => {
                    if (this.state.dateAfter !== "") {
                        if ((day.dateAccept >= this.state.dateBefore) && (day.dateAccept <= this.state.dateAfter)) {
                            counterPage = counterPage + 1
                            return true
                        } else {
                            return false
                        }
                    } else {
                        if (day.dateAccept >= this.state.dateBefore) {
                            counterPage = counterPage + 1
                            return true
                        } else {
                            return false
                        }
                    }
                })
        })
        await this.setState({
            counter: counterPage,
            pageNow: 1
        })
    }

    handleSelectAfter = async (event) => {
        var counterPage = 0
        await this.setState({ [event.target.name]: event.target.value });
        this.setState({
            dataAfterCompare: this.state.allData.sort((a, b) => {
                return parseInt(b.id) - parseInt(a.id)
            })
                .filter((day) => {
                    if (this.state.dateBefore !== "") {
                        if ((day.dateAccept >= this.state.dateBefore) && (day.dateAccept <= this.state.dateAfter)) {
                            counterPage = counterPage + 1
                            return true
                        } else {
                            return false
                        }
                    } else {
                        if (day.dateAccept <= this.state.dateAfter) {
                            counterPage = counterPage + 1
                            return true
                        } else {
                            return false
                        }
                    }
                })
        })
        await this.setState({
            counter: counterPage,
            pageNow: 1
        })
    }

    renderFooter = () => {

        if (this.state.counter !== 0) {
            return (
                <div className='d-flex justify-content-end align-items-center mr-4'>
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

    handleSelectNumOfQR = async (event) => {
        await this.setState({ sortAction: event.target.value });
        if(this.state.sortAction === "10"){
            this.setState({
                max_per_page : 10
            })
        }else if(this.state.sortAction === "20"){
            this.setState({
                max_per_page : 20
            })
        }else if(this.state.sortAction === "30"){
            this.setState({
                max_per_page : 30
            })
        }
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
                            <li className="nav-item active">
                                <a className="nav-link" href="/printqrcode">QR Code<span className="sr-only">(current)</span></a>
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
                        <div className="row justify-content-end mb-4 mr-2 ">
                            <div className="col col-lg-2">
                                <input type="date" className="form-control" onChange={this.handleSelectBefore}
                                    placeholder=""
                                    name="dateBefore" value={this.state.dateBefore}
                                >

                                </input>

                            </div>

                            <i class="fas fa-arrow-alt-circle-right mt-2"></i>
                            <div className="col col-lg-2">
                                <input type="date" className="form-control" onChange={this.handleSelectAfter}
                                    placeholder=""
                                    name="dateAfter" value={this.state.dateAfter}
                                >
                                </input>

                            </div>
                        </div>
                    </section>
                    <section>
                    <div className="row justify-content-end mb-4 mr-4 ">
                            <div className="">
                                <select id="inputState" className="form-control" onChange={this.handleSelectNumOfQR}>

                                    <option value="10">10</option>
                                    <option value="20">20</option>
                                    <option value="30">30</option>
                                </select>
                            </div>
                        </div>
                    </section>

                    <section className="block-qrcode">
                        <div className="box d-flex justify-content-center w-100">
                            <div className="row justify-content-start qrcode-item">

                                {this.state.dataAfterCompare
                                    .filter((item, index) => {

                                        return (
                                            item !== null &&
                                            this.state.pageNow ===
                                            Math.ceil((index + 1) / this.state.max_per_page)
                                        )
                                    })
                                    .map((item, key) => {
                                        return (
                                            <div className="font-qr-code" key={key} >
                                                <div className="col" >
                                                    <QRCode
                                                        bgColor="#FFFFFF"
                                                        fgColor="#000000"
                                                        level="Q"
                                                        style={{ width: 100 }}
                                                        value={item.value}
                                                    />
                                                    <p>{item.durableCode}</p>
                                                </div>
                                            </div>
                                        )
                                    }
                                    )
                                }

                            </div>

                        </div>

                    </section>
                    {this.renderFooter()}
                    <div className="inputBlock-line mr-2">
                        <div className="float-right">
                            <button className="btn btn-success mb-2" onClick={() => window.print()}>PRINT</button>
                        </div>
                    </div>

                </div>
            </div>

        )
    }
}
