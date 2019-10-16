import React, { Component } from 'react'
import { firebase } from '../firebase'
import { QRCode } from "react-qr-svg";

export default class Printqrcode extends Component {

    constructor(props) {
        super(props)
        this.state = {
            allData: []
        }
    }


    componentDidMount = async () => {
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


    render() {
        return (
            <div>
                <nav className="navbar navbar-expand-lg navbar-light bg-light mb-3 ">

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
                                <a className="nav-link" href="/history">History</a>
                            </li>
                        </ul>
                    </div>
                </nav>
                <div className="container-fluid">


                    <section className="block-qrcode">
                        <div className="box d-flex justify-content-center w-100">
                            <div className="row justify-content-start qrcode-item">

                                {this.state.allData.map((item, key) => {
                                    return (
                                        <div key={key} >
                                            <div className="col" >
                                                <QRCode
                                                    bgColor="#FFFFFF"
                                                    fgColor="#000000"
                                                    level="Q"
                                                    style={{ width: 100 }}
                                                    value={item.value}
                                                />
                                                <p>{item.id}</p>
                                            </div>
                                        </div>
                                    )
                                }
                                )
                                }

                            </div>
                        </div>
                        
                    </section>

                    <div className="inputBlock-line">
                        <div className="float-right">
                            <button className="btn btn-success mb-2" onClick={() => window.print()}>PRINT</button>
                        </div>
                    </div>

                </div>
            </div>

        )
    }
}
