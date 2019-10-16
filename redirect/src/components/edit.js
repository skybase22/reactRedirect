import React, { Component } from 'react'
import { firebase } from '../firebase'
import { QRCode } from "react-qr-svg"
export default class Edit extends Component {

    constructor(props) {
        super(props)
        this.state = {
            isFetchLastLog: false,
            lastLog: null,
            data: [],
            error: false,
            keyData: "",
            allData: [],
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
            idMaterial: "",
            urlQR : "",
            oldStatus : "",
            newStatus : "",

        }
    }

    handleInput = (event) => {
        this.setState({ [event.target.name]: event.target.value })
    }

    componentDidMount = async () => {

        if (!(localStorage.getItem('isLogin') === "$2y$12$opGG6Ee4T6RL1LNi/vEB3.Xcihvx.64LHnlA0AxW15WpOl.kGYVPC")) {
            this.props.history.push('/login')
        }
        if (this.props.history.location.search.startsWith('?id=')) {
            let query = this.props.history.location.search.split('?id=')
            this.setState({
                urlQR : "https://psupktmaterial.firebaseapp.com?id=" + query[1]
            })
            await firebase.database().ref("myURL/" + query[1]).once('value', async (snapshot) => {
                if (snapshot.exists()) {
                    // window.location.assign(snapshot.val().fullURL)
                    this.setState({
                        keyData: query[1],
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
            this.setState({
                oldStatus : this.state.materialStatus
            })

        }
        await firebase.database().ref("listLog").once('value', async (snapshot) => {
            if (snapshot.exists()) {
                await this.setState({ lastLog: parseInt(snapshot.val().number) })
            } else {
                await this.setState({ error: true })
            }
        })

        let query = this.props.history.location.search.split('?id=')
        this.setState({
            idMaterial: query[1]
        })
    }


    onUpdate = async (event) => {
        event.preventDefault()
        let newLog = this.state.lastLog + 1
        if (this.props.history.location.search.startsWith('?id=')) {
            let query = this.props.history.location.search.split('?id=')
            this.setState({
                idMaterial: query[1]
            })
            await firebase.database().ref("myURL/" + query[1]).set({
                id: query[1],
                durableCode: this.state.durableCode,
                listMaterial: this.state.listMaterial,
                attribute: this.state.attribute,
                serialNumber: this.state.serialNumber,
                materialStatus: this.state.materialStatus,
                price: this.state.price,
                storageLocation: this.state.storageLocation,
                numberPieces: this.state.numberPieces,
                dateAccept: this.state.dateAccept,
                namePickUp: this.state.namePickUp,
                company: this.state.company
            })

            var firebaseRef2 = firebase.database().ref(`History/${newLog.toLocaleString(undefined, { minimumIntegerDigits: 5 }).replace(',', '')}`);
            let keyLog = newLog.toLocaleString(undefined, { minimumIntegerDigits: 5 }).replace(',', '')
            firebaseRef2.set({
                id: keyLog,
                action: this.state.namePickUp +" เปลี่ยนสถานะของรหัสครุภัณฑ์ " + this.state.durableCode + " จาก" + this.state.oldStatus + "เป็น" + this.state.materialStatus,
                durableCode: this.state.durableCode,
                listMaterial: this.state.listMaterial,
                serialNumber: this.state.serialNumber,
                materialStatus: this.state.materialStatus,
                dateUpdate: new Date().getFullYear() + '/' + (new Date().getMonth()+1) + '/' + new Date().getDate() +' '+ new Date().getHours()+':'+ new Date().getMinutes()+':'+ new Date().getSeconds(),
                name: this.state.namePickUp,
            });
            var firebaseRef4 = firebase.database().ref(`listLog`)
            await firebaseRef4.set({
                number: keyLog
            }).then(() => {
            }
            );
            this.props.history.push('/')
        }
    }

    render() {
        return (

            <div className="container-fluid">

                <div style={{ margin: "20px" }}>
                    <h2 className="text-center">Edit Material</h2>
                </div>
                <div style={{ margin: "20px" }}>
                    <h2 >Material ID : {this.state.keyData}</h2>
                </div>
 
                <div className="row justify-content-center">
                    <div className="">
                        <form >

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
                                <div>

                                    <div className="inputBlock-line">
                                        {/* <div className="freebirdFormviewerViewItemsItemItemTitle" dir="auto" role="heading" aria-level="2" > <span className="spanFont">รหัสครุภัณฑ์</span></div>                                   
                                    <input type="text" className="form-control mb-2 mr-sm-2 inputL"
                                        placeholder="Your Answer" name="durableCode" required onChange={this.handleInput} value={this.state.durableCode} autoComplete="off" /> */}
                                        <div className="freebirdFormviewerViewItemsItemItemTitle" dir="auto" role="heading" aria-level="2" >รหัสครุภัณฑ์</div>
                                        <input type="text" className="form-control mb-2 mr-sm-2"
                                            placeholder="Your Answer" name="durableCode" required defaultValue={this.state.durableCode} autoComplete="off" />
                                    </div>

                                    <div className="inputBlock-line">
                                        <div className="freebirdFormviewerViewItemsItemItemTitle" dir="auto" role="heading" aria-level="2" >รายการ </div>
                                        <input type="text" className="form-control mb-2 mr-sm-2"
                                            placeholder="Your Answer" name="listMaterial" required defaultValue={this.state.listMaterial} autoComplete="off" />
                                    </div>

                                    <div className="inputBlock-line">
                                        <div className="freebirdFormviewerViewItemsItemItemTitle" dir="auto" role="heading" aria-level="2" >ยี่ห้อ/ชนิด/ขนาด/คุณลักษณะ </div>
                                        <input type="text" className="form-control mb-2 mr-sm-2"
                                            placeholder="Your Answer" name="attribute" required defaultValue={this.state.attribute} autoComplete="off" />
                                    </div>

                                    <div className="inputBlock-line">
                                        <div className="freebirdFormviewerViewItemsItemItemTitle" dir="auto" role="heading" aria-level="2" >หมายเลขเครื่อง </div>
                                        <input type="text" className="form-control mb-2 mr-sm-2"
                                            placeholder="Your Answer" name="serialNumber" required defaultValue={this.state.serialNumber} autoComplete="off" />
                                    </div>

                                    <div className="inputBlock-line">
                                        <div className="freebirdFormviewerViewItemsItemItemTitle" dir="auto" role="heading" aria-level="2" >ราคาต่อหน่วย </div>
                                        <input type="text" className="form-control mb-2 mr-sm-2"
                                            placeholder="Your Answer" name="price" required defaultValue={this.state.price} autoComplete="off" />
                                    </div>

                                    <div className="inputBlock-line">
                                        <div className="freebirdFormviewerViewItemsItemItemTitle" dir="auto" role="heading" aria-level="2" >สถานที่เก็บ </div>
                                        <input type="text" className="form-control mb-2 mr-sm-2"
                                            placeholder="Your Answer" name="storageLocation" required defaultValue={this.state.storageLocation} autoComplete="off" />
                                    </div>

                                    <div className="inputBlock-line">
                                        <div className="freebirdFormviewerViewItemsItemItemTitle" dir="auto" role="heading" aria-level="2" >จำนวน </div>
                                        <input type="text" className="form-control mb-2 mr-sm-2"
                                            placeholder="Your Answer" name="numberPieces" required defaultValue={this.state.numberPieces} autoComplete="off" />
                                    </div>

                                    <div className="inputBlock-line">
                                        <div className="freebirdFormviewerViewItemsItemItemTitle" dir="auto" role="heading" aria-level="2" >วันที่ตรวจรับ </div>
                                        <input type="text" className="form-control mb-2 mr-sm-2"
                                            placeholder="Your Answer" name="dateAccept" required defaultValue={this.state.dateAccept} autoComplete="off" />
                                    </div>

                                    <div className="inputBlock-line">
                                        <div className="freebirdFormviewerViewItemsItemItemTitle" dir="auto" role="heading" aria-level="2" >ชื่อผู้เบิกครุภัณฑ์ </div>
                                        <input type="text" className="form-control mb-2 mr-sm-2"
                                            placeholder="Your Answer" name="namePickUp" required defaultValue={this.state.namePickUp} autoComplete="off" />
                                    </div>

                                    <div className="inputBlock-line">
                                        <div className="freebirdFormviewerViewItemsItemItemTitle" dir="auto" role="heading" aria-level="2" >บริษัท/ห้างร้าน/ที่จัดซื้อ </div>
                                        <input type="text" className="form-control mb-2 mr-sm-2"
                                            placeholder="Your Answer" name="company" required defaultValue={this.state.company} autoComplete="off" />
                                    </div>

                                    <div className="inputBlock-line">
                                        <div className="freebirdFormviewerViewItemsItemItemTitle" dir="auto" role="heading" aria-level="2" >สถานะครุภัณฑ์ </div>
                                        <div className="inputBlock-line">
                                            <div className="custom-control custom-radio">
                                                <input type="radio" id="ปกติ" name="materialStatus" checked={this.state.materialStatus === 'ปกติ'} className="custom-control-input" defaultValue="ปกติ" onChange={this.handleInput}></input>
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
                                        <div className="float-right">
                                            <button type="submit" className="btn btn-primary mb-2" style={{ width: "100px", height: "37px" }} onClick={this.onUpdate}>SUBMIT</button>
                                        </div>
                                    </div>
                                    <div className="inputBlock-line">
                                        <div className="freebirdFormviewerViewItemsItemItemTitle" dir="auto" role="heading" aria-level="2" ></div>

                                    </div>

                                </div>
                            </div>
                        </form>
                        <div className="inputBlock-line">
                            <div className="float-right">
                                <button type="button" className="btn btn-danger mb-2" onClick={async (e) => {
                                    e.preventDefault()
                                    if (!(localStorage.getItem('isLogin') === "$2y$12$opGG6Ee4T6RL1LNi/vEB3.Xcihvx.64LHnlA0AxW15WpOl.kGYVPC")) {
                                        this.props.history.push('/login')
                                    } else {
                                        await firebase.database().ref("myURL/" + this.state.idMaterial).remove()
                                    }
                                }}>Remove</button>
                            </div>
                        </div>

                    </div>

                </div>


            </div>
        )
    }
}