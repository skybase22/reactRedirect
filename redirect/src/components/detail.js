import React, { Component } from 'react'
import { firebase } from '../firebase'
import { QRCode } from "react-qr-svg"
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
            urlQR: "",
            department: "",
            other: "",
        }
    }

    handleInput = (event) => {
        // this.setState({ [event.target.name]: event.target.value })
    }

    componentDidMount = async () => {
        if ((localStorage.getItem('isLogin') !== null) && (localStorage.getItem('username') !== null) && (localStorage.getItem('name') !== null)) {
            let databaseToken = firebase.database().ref("users/" + localStorage.getItem('username'));
            databaseToken.once('value', async (snapshot) => {
                if (localStorage.getItem('isLogin') === snapshot.val().token && localStorage.getItem('name') === snapshot.val().user) {
                    if (this.props.history.location.search.startsWith('?id=')) {
                        let query = this.props.history.location.search.split('?id=')
                        this.props.history.push('/edit?id=' + query[1])
                    }
                }
            })
        }

        if (this.props.history.location.search.startsWith('?id=')) {
            let query = this.props.history.location.search.split('?id=')
            this.setState({
                urlQR: "https://psupktmaterial.firebaseapp.com/detail?id=" + query[1]
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
                        company: snapshot.val().company,
                        department: snapshot.val().department,
                        other: snapshot.val().other,
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
                                        value={this.state.urlQR}
                                    />
                                </div>

                                <div className="inputBlock-line">

                                    <div className="freebirdFormviewerViewItemsItemItemTitle" dir="auto" role="heading" aria-level="2" >รหัสครุภัณฑ์</div>
                                    - {this.state.durableCode}
                                    {/* <input type="text" className="form-control mb-2 mr-sm-2"
                                        placeholder="Your Answer" name="durableCode" required onChange={this.handleInput} value={this.state.durableCode} autoComplete="off" /> */}
                                </div>

                                <div className="inputBlock-line">
                                    <div className="freebirdFormviewerViewItemsItemItemTitle" dir="auto" role="heading" aria-level="2" >รายการ </div>
                                    - {this.state.listMaterial}
                                    {/* <input type="text" className="form-control mb-2 mr-sm-2"
                                        placeholder="Your Answer" name="listMaterial" required onChange={this.handleInput} value={this.state.listMaterial} autoComplete="off" /> */}
                                </div>

                                <div className="inputBlock-line">
                                    <div className="freebirdFormviewerViewItemsItemItemTitle" dir="auto" role="heading" aria-level="2" >คณะ/หน่วยงาน </div>
                                    - {this.state.department}
                                    {/* <input type="text" className="form-control mb-2 mr-sm-2"
                                        placeholder="Your Answer" name="department" required onChange={this.handleInput} value={this.state.department} autoComplete="off" /> */}
                                </div>

                                <div className="inputBlock-line">
                                    <div className="freebirdFormviewerViewItemsItemItemTitle" dir="auto" role="heading" aria-level="2" >ยี่ห้อ/ชนิด/ขนาด/คุณลักษณะ </div>
                                    - {this.state.attribute}
                                    {/* <input type="text" className="form-control mb-2 mr-sm-2"
                                        placeholder="Your Answer" name="attribute" required onChange={this.handleInput} value={this.state.attribute} autoComplete="off" /> */}
                                </div>

                                <div className="inputBlock-line">
                                    <div className="freebirdFormviewerViewItemsItemItemTitle" dir="auto" role="heading" aria-level="2" >หมายเลขเครื่อง </div>
                                    - {this.state.serialNumber}
                                    {/* <input type="text" className="form-control mb-2 mr-sm-2"
                                        placeholder="Your Answer" name="serialNumber" required onChange={this.handleInput} value={this.state.serialNumber} autoComplete="off" /> */}
                                </div>

                                <div className="inputBlock-line">
                                    <div className="freebirdFormviewerViewItemsItemItemTitle" dir="auto" role="heading" aria-level="2" >ราคาต่อหน่วย </div>
                                    - {this.state.price}
                                    {/* <input type="text" className="form-control mb-2 mr-sm-2"
                                        placeholder="Your Answer" name="price" required onChange={this.handleInput} value={this.state.price} autoComplete="off" /> */}
                                </div>

                                <div className="inputBlock-line">
                                    <div className="freebirdFormviewerViewItemsItemItemTitle" dir="auto" role="heading" aria-level="2" >จำนวน </div>
                                    - {this.state.numberPieces}
                                    {/* <input type="text" className="form-control mb-2 mr-sm-2"
                                        placeholder="Your Answer" name="numberPieces" required onChange={this.handleInput} value={this.state.numberPieces} autoComplete="off" /> */}
                                </div>

                                <div className="inputBlock-line">
                                    <div className="freebirdFormviewerViewItemsItemItemTitle" dir="auto" role="heading" aria-level="2" >วันที่ตรวจรับ </div>
                                    - {this.state.dateAccept}
                                    {/* <input type="text" className="form-control mb-2 mr-sm-2"
                                        placeholder="Your Answer" name="dateAccept" required onChange={this.handleInput} value={this.state.dateAccept} autoComplete="off" /> */}
                                </div>

                                <div className="inputBlock-line">
                                    <div className="freebirdFormviewerViewItemsItemItemTitle" dir="auto" role="heading" aria-level="2" >ชื่อผู้เบิกครุภัณฑ์ </div>
                                    - {this.state.namePickUp}
                                    {/* <input type="text" className="form-control mb-2 mr-sm-2"
                                        placeholder="Your Answer" name="namePickUp" required onChange={this.handleInput} value={this.state.namePickUp} autoComplete="off" /> */}
                                </div>

                                <div className="inputBlock-line">
                                    <div className="freebirdFormviewerViewItemsItemItemTitle" dir="auto" role="heading" aria-level="2" >บริษัท/ห้างร้าน/ที่จัดซื้อ </div>
                                    - {this.state.company}
                                    {/* <input type="text" className="form-control mb-2 mr-sm-2"
                                        placeholder="Your Answer" name="company" required onChange={this.handleInput} value={this.state.company} autoComplete="off" /> */}
                                </div>

                                <div className="inputBlock-line">
                                    <div className="freebirdFormviewerViewItemsItemItemTitle" dir="auto" role="heading" aria-level="2" >สถานที่เก็บ </div>
                                    - {this.state.storageLocation}
                                    {/* <input type="text" className="form-control mb-2 mr-sm-2"
                                        placeholder="Your Answer" name="storageLocation" required onChange={this.handleInput} value={this.state.storageLocation} autoComplete="off" /> */}
                                </div>

                                <div className="inputBlock-line">
                                    - {this.state.materialStatus}
                                    <div className="freebirdFormviewerViewItemsItemItemTitle" dir="auto" role="heading" aria-level="2" >สถานะครุภัณฑ์ </div>
                                    <div className="inputBlock-line">
                                        <div className="custom-control custom-radio">
                                            <input type="radio" id="ปกติ" name="materialStatus" checked={this.state.materialStatus === 'ปกติ' && this.state.other === ""} className="custom-control-input" value="ปกติ" onChange={this.handleInput}></input>
                                            <label className="custom-control-label" htmlFor="ปกติ">ปกติ</label>
                                        </div>
                                    </div>
                                    <div className="inputBlock-line">
                                        <div className="custom-control custom-radio">
                                            <input type="radio" id="ชำรุด" name="materialStatus" checked={this.state.materialStatus === 'ชำรุด' && this.state.other === ""} className="custom-control-input" value="ชำรุด" onChange={this.handleInput}></input>
                                            <label className="custom-control-label" htmlFor="ชำรุด">ชำรุด</label>
                                        </div>
                                    </div>
                                    <div className="inputBlock-line">
                                        <div className="custom-control custom-radio">
                                            <input type="radio" id="รอจำหน่าย" name="materialStatus" checked={this.state.materialStatus === 'รอจำหน่าย' && this.state.other === ""} className="custom-control-input" value="รอจำหน่าย" onChange={this.handleInput}></input>
                                            <label className="custom-control-label" htmlFor="รอจำหน่าย">รอจำหน่าย</label>
                                        </div>
                                    </div>
                                    <div className="inputBlock-line">
                                        <div className="custom-control custom-radio">
                                            <input type="radio" id="โอนย้าย" name="materialStatus" checked={this.state.materialStatus === 'โอนย้าย' && this.state.other === ""} className="custom-control-input" value="โอนย้าย" onChange={this.handleInput}></input>
                                            <label className="custom-control-label" htmlFor="โอนย้าย">โอนย้าย</label>
                                        </div>
                                    </div>

                                    <div className="inputBlock-line ">
                                        <div className="custom-control custom-radio d-block">

                                            <input type="radio" id="อื่น ๆ" name="materialStatus" checked={this.state.other !== '' && this.state.materialStatus === 'อื่น ๆ'} className="custom-control-input" value="อื่น ๆ" onChange={this.handleInput}></input>
                                            <label className="custom-control-label" htmlFor="อื่น ๆ">อื่น ๆ</label>
                                            <input type="text" className="form-control" style={{ width: "" }}
                                                name="other" onChange={this.handleInput} value={this.state.other} autoComplete="off" />

                                        </div>
                                    </div>
                                </div>



                                <div className="inputBlock-line">
                                    <div className="freebirdFormviewerViewItemsItemItemTitle" dir="auto" role="heading" aria-level="2" ></div>
                                    <div className="inputBlock-line float-right">

                                        <button type="submit" className="btn btn-primary mb-2" style={{ width: "100px", height: "37px" }} onClick={this.goEdit}>CHECK</button>

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