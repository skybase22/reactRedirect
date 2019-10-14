import React, { Component } from 'react'
import { firebase } from '../firebase'
import { QRGenerator } from 'dynamic-qr-code-generator';
import { QRCode } from "react-qr-svg";
export default class Edit extends Component {

    constructor(props) {
        super(props)
        this.state = {
            isFetchLastNumber: false,
            lastNumber: null,
            error: false,
            keyData: "",
            errorMessage: "",
            durableCode: "",
            listMaterial: "",
            attribute: "",
            serialNumber: "",
            image: null,
            materialStatus: "",
            price: "",
            storageLocation: "",
            numberPieces: "",
            dateAccept: "",
            namePickUp: "",
            company: "",
            urlQR: ""
        }
    }

    handleInput = (event) => {
        // this.setState({ [event.target.name]: event.target.value })
    }

    genQR = () => {
        var pr = { value: `https://psupktmaterial.firebaseapp.com?id=${this.state.keyData}` };

        QRGenerator(pr)

    }

    componentDidMount = async () => {

        if (this.props.history.location.search.startsWith('?id=')) {
            let query = this.props.history.location.search.split('?id=')
            this.setState({
                urlQR : "https://psupktmaterial.firebaseapp.com?id=" + query[1]
            })
            await firebase.database().ref("myURL/" + query[1]).once('value', async (snapshot) => {
                if (snapshot.exists()) {
                    // window.location.assign(snapshot.val().fullURL)
                    this.setState({ keyData: query[1] })
                    this.setState({
                        listMaterial: snapshot.val().listMaterial,
                        durableCode: snapshot.val().durableCode,
                        attribute: snapshot.val().attribute,
                        serialNumber: snapshot.val().serialNumber,
                        materialStatus: snapshot.val().materialStatus,
                        price: snapshot.val().price,
                        storageLocation: snapshot.val().storageLocation,
                        numberPieces: snapshot.val().numberPieces,
                        dateAccept: snapshot.val().dateAccept,
                        namePickUp: snapshot.val().namePickUp,
                        company: snapshot.val().company
                    })
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
    goEdit = async (event) => {
        event.preventDefault()
        if (this.props.history.location.search.startsWith('?id=')) {
            let query = this.props.history.location.search.split('?id=')

            this.props.history.push('/edit?id=' + query[1])
        }
    }

    render() {
        return (

            <div className="container-fluid">

                <div style={{ margin: "20px" }}>
                    <h2 className="text-center">Detail Material</h2>
                </div>
                <div style={{ margin: "20px" }}>
                    <h2 >Material ID : {this.state.keyData}</h2>
                </div>

                <div className="row justify-content-center">

                    <div className="col-auto">

                        <form onSubmit={this.onUpdate}>

                            <div className="shadow p-3 mb-5 bg-white rounded">
                                <div className="inputBlock-line">
                                    <div className="freebirdFormviewerViewItemsItemItemTitle" dir="auto" role="heading" aria-level="2" >QR Code</div>
                                    <QRCode
                                        bgColor="#FFFFFF"
                                        fgColor="#000000"
                                        level="Q"
                                        style={{ width: 256 }}
                                        value= {this.state.urlQR}
                                    />
                                </div>

                                <div className="inputBlock-line">
                                    {/* <div className="freebirdFormviewerViewItemsItemItemTitle" dir="auto" role="heading" aria-level="2" > <span className="spanFont">รหัสครุภัณฑ์</span></div>                                   
                                    <input type="text" className="form-control mb-2 mr-sm-2 inputL"
                                        placeholder="Your Answer" name="durableCode" required onChange={this.handleInput} value={this.state.durableCode} autoComplete="off" /> */}
                                    <div className="freebirdFormviewerViewItemsItemItemTitle" dir="auto" role="heading" aria-level="2" >รหัสครุภัณฑ์</div>
                                    <input type="text" className="form-control mb-2 mr-sm-2"
                                        placeholder="Your Answer" name="durableCode" required onChange={this.handleInput} value={this.state.durableCode} autoComplete="off" />
                                </div>

                                <div className="inputBlock-line">
                                    <div className="freebirdFormviewerViewItemsItemItemTitle" dir="auto" role="heading" aria-level="2" >รายการ </div>
                                    <input type="text" className="form-control mb-2 mr-sm-2"
                                        placeholder="Your Answer" name="listMaterial" required onChange={this.handleInput} value={this.state.listMaterial} autoComplete="off" />
                                </div>

                                <div className="inputBlock-line">
                                    <div className="freebirdFormviewerViewItemsItemItemTitle" dir="auto" role="heading" aria-level="2" >ยี่ห้อ/ชนิด/ขนาด/คุณลักษณะ </div>
                                    <input type="text" className="form-control mb-2 mr-sm-2"
                                        placeholder="Your Answer" name="attribute" required onChange={this.handleInput} value={this.state.attribute} autoComplete="off" />
                                </div>

                                <div className="inputBlock-line">
                                    <div className="freebirdFormviewerViewItemsItemItemTitle" dir="auto" role="heading" aria-level="2" >หมายเลขเครื่อง </div>
                                    <input type="text" className="form-control mb-2 mr-sm-2"
                                        placeholder="Your Answer" name="serialNumber" required onChange={this.handleInput} value={this.state.serialNumber} autoComplete="off" />
                                </div>

                                <div className="inputBlock-line">
                                    <div className="freebirdFormviewerViewItemsItemItemTitle" dir="auto" role="heading" aria-level="2" >ราคาต่อหน่วย </div>
                                    <input type="text" className="form-control mb-2 mr-sm-2"
                                        placeholder="Your Answer" name="price" required onChange={this.handleInput} value={this.state.price} autoComplete="off" />
                                </div>

                                <div className="inputBlock-line">
                                    <div className="freebirdFormviewerViewItemsItemItemTitle" dir="auto" role="heading" aria-level="2" >สถานที่เก็บ </div>
                                    <input type="text" className="form-control mb-2 mr-sm-2"
                                        placeholder="Your Answer" name="storageLocation" required onChange={this.handleInput} value={this.state.storageLocation} autoComplete="off" />
                                </div>

                                <div className="inputBlock-line">
                                    <div className="freebirdFormviewerViewItemsItemItemTitle" dir="auto" role="heading" aria-level="2" >จำนวน </div>
                                    <input type="text" className="form-control mb-2 mr-sm-2"
                                        placeholder="Your Answer" name="numberPieces" required onChange={this.handleInput} value={this.state.numberPieces} autoComplete="off" />
                                </div>

                                <div className="inputBlock-line">
                                    <div className="freebirdFormviewerViewItemsItemItemTitle" dir="auto" role="heading" aria-level="2" >วันที่ตรวจรับ </div>
                                    <input type="text" className="form-control mb-2 mr-sm-2"
                                        placeholder="Your Answer" name="dateAccept" required onChange={this.handleInput} value={this.state.dateAccept} autoComplete="off" />
                                </div>

                                <div className="inputBlock-line">
                                    <div className="freebirdFormviewerViewItemsItemItemTitle" dir="auto" role="heading" aria-level="2" >ชื่อผู้เบิกครุภัณฑ์ </div>
                                    <input type="text" className="form-control mb-2 mr-sm-2"
                                        placeholder="Your Answer" name="namePickUp" required onChange={this.handleInput} value={this.state.namePickUp} autoComplete="off" />
                                </div>

                                <div className="inputBlock-line">
                                    <div className="freebirdFormviewerViewItemsItemItemTitle" dir="auto" role="heading" aria-level="2" >บริษัท/ห้างร้าน/ที่จัดซื้อ </div>
                                    <input type="text" className="form-control mb-2 mr-sm-2"
                                        placeholder="Your Answer" name="company" required onChange={this.handleInput} value={this.state.company} autoComplete="off" />
                                </div>

                                <div className="inputBlock-line">
                                    <div className="freebirdFormviewerViewItemsItemItemTitle" dir="auto" role="heading" aria-level="2" >สถานะครุภัณฑ์ </div>
                                    <div className="inputBlock-line">
                                        <div className="custom-control custom-radio">
                                            <input type="radio" id="ปกติ" name="materialStatus" checked={this.state.materialStatus === 'ปกติ'} className="custom-control-input" value="ปกติ" onChange={this.handleInput}></input>
                                            <label className="custom-control-label" htmlFor="ปกติ">ปกติ</label>
                                        </div>
                                    </div>
                                    <div className="inputBlock-line">
                                        <div className="custom-control custom-radio">
                                            <input type="radio" id="ชำรุด" name="materialStatus" checked={this.state.materialStatus === 'ชำรุด'} className="custom-control-input" value="ชำรุด" onChange={this.handleInput}></input>
                                            <label className="custom-control-label" htmlFor="ชำรุด">ชำรุด</label>
                                        </div>
                                    </div>
                                    <div className="inputBlock-line">
                                        <div className="custom-control custom-radio">
                                            <input type="radio" id="รอจำหน่าย" name="materialStatus" checked={this.state.materialStatus === 'รอจำหน่าย'} className="custom-control-input" value="รอจำหน่าย" onChange={this.handleInput}></input>
                                            <label className="custom-control-label" htmlFor="รอจำหน่าย">รอจำหน่าย</label>
                                        </div>
                                    </div>
                                    <div className="inputBlock-line">
                                        <div className="custom-control custom-radio">
                                            <input type="radio" id="โอนย้าย" name="materialStatus" checked={this.state.materialStatus === 'โอนย้าย'} className="custom-control-input" value="โอนย้าย" onChange={this.handleInput}></input>
                                            <label className="custom-control-label" htmlFor="โอนย้าย">โอนย้าย</label>
                                        </div>
                                    </div>

                                </div>



                                <div className="inputBlock-line">
                                    <div className="freebirdFormviewerViewItemsItemItemTitle" dir="auto" role="heading" aria-level="2" ></div>
                                    <div className="inputBlock-line float-right">

                                        <button type="submit" className="btn btn-primary mb-2" style={{ width: "100px", height: "37px" }} onClick={this.goEdit}>EDIT</button>

                                    </div>
                                </div>
                                <div className="inputBlock-line">
                                    <div className="freebirdFormviewerViewItemsItemItemTitle" dir="auto" role="heading" aria-level="2" ></div>

                                </div>


                            </div>
                        </form>
                    </div>

                </div>


            </div>
        )
    }
}