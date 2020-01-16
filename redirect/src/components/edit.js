import React, { Component } from 'react'
import { firebase } from '../firebase'
import { QRCode } from "react-qr-svg"
export default class Edit extends Component {

    constructor(props) {
        super(props)
        this.state = {
            isFetchLastLog: false,
            lastLog: null,
            lastResult: null,
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
            urlQR: "",
            oldStatus: "",
            newStatus: "",
            department: "",
            other: "",
            result: "",

        }
    }

    handleInput = (event) => {
        this.setState({ [event.target.name]: event.target.value })
    }

    handleInputNon = (event) => {

    }

    handleInputOther = (event) => {
        this.setState({ [event.target.name]: event.target.value })
        this.setState({ materialStatus: "อื่น ๆ" })
    }

    componentDidMount = async () => {

        if ((localStorage.getItem('isLogin') === null) || (localStorage.getItem('username') === null) || (localStorage.getItem('name') === null)) {
            localStorage.setItem('from_page', "/edit")
            if (this.props.history.location.search.startsWith('?id=')) {
                let query = this.props.history.location.search.split('?id=')
                localStorage.setItem('from_id', query[1])

            }
            this.props.history.push('/login')
        }
        let databaseToken = firebase.database().ref("users/" + localStorage.getItem('username'));
        databaseToken.once('value', async (snapshot) => {
            if (localStorage.getItem('isLogin') !== snapshot.val().token || localStorage.getItem('name') !== snapshot.val().user) {
                localStorage.setItem('from_page', "/edit")
                if (this.props.history.location.search.startsWith('?id=')) {
                    let query = this.props.history.location.search.split('?id=')
                    localStorage.setItem('from_id', query[1])
                }
                this.props.history.push('/login')
            }
        })
        if (this.props.history.location.search.startsWith('?id=')) {
            let query = this.props.history.location.search.split('?id=')
            this.setState({
                idMaterial: query[1]
            })

            this.setState({
                urlQR: "https://psupktmaterial.firebaseapp.com/detail?id=" + query[1]
            })
            await firebase.database().ref("myURL/" + query[1]).once('value', async (snapshot) => {
                if (snapshot.exists()) {
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
                        company: snapshot.val().company,
                        department: snapshot.val().department,
                        other: snapshot.val().other,
                    })
                } else {
                }
            })
            this.setState({
                oldStatus: this.state.materialStatus
            })

        }

        await firebase.database().ref("listResult").once('value', async (snapshot) => {
            if (snapshot.exists()) {
                await this.setState({ lastResult: parseInt(snapshot.val().number) })
            } else {
                await this.setState({ error: true })
            }
        })

    }


    onUpdate = async (event) => {
        event.preventDefault()
        let newResult = this.state.lastResult + 1
        if (this.props.history.location.search.startsWith('?id=')) {
            let query = this.props.history.location.search.split('?id=')
            this.setState({
                idMaterial: query[1]
            })
            // if(this.state.other !== ""){
            //     this.setState({
            //         materialStatus : this.state.other
            //     })
            // }
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
                company: this.state.company,
                department: this.state.department,
                other: this.state.other,
            })

            var firebaseRef5 = firebase.database().ref(`Result/${newResult.toLocaleString(undefined, { minimumIntegerDigits: 5 }).replace(',', '')}`);
            let keyResult = newResult.toLocaleString(undefined, { minimumIntegerDigits: 5 }).replace(',', '')
            if (this.state.other === "") {
                this.setState({
                    result: this.state.materialStatus
                })
            } else {
                this.setState({
                    result: this.state.other
                })
            }
            firebaseRef5.set({
                id: keyResult,
                idMaterial : query[1],
                result: this.state.result,
                durableCode: this.state.durableCode,
                listMaterial: this.state.listMaterial,
                department: this.state.department,
                materialStatus: this.state.materialStatus,
                dateUpdate: new Date().getFullYear() + '/' + (new Date().getMonth() + 1) + '/' + new Date().getDate() + ' ' + new Date().getHours() + ':' + new Date().getMinutes() + ':' + new Date().getSeconds(),
                name: localStorage.getItem("name"),
            });
            var firebaseRef6 = firebase.database().ref(`listResult`)
            await firebaseRef6.set({
                number: keyResult
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
                                        value={this.state.urlQR}
                                    />
                                </div>
                                <div>
                                    {localStorage.getItem('username') === "admin" ? (
                                        <div>
                                            <div className="inputBlock-line">
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
                                                <div className="freebirdFormviewerViewItemsItemItemTitle" dir="auto" role="heading" aria-level="2" >คณะ/หน่วยงาน </div>
                                                <input type="text" className="form-control mb-2 mr-sm-2"
                                                    placeholder="Your Answer" name="department" required onChange={this.handleInput} value={this.state.department} autoComplete="off" />
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
                                                <div className="freebirdFormviewerViewItemsItemItemTitle" dir="auto" role="heading" aria-level="2" >จำนวน </div>
                                                <input type="text" className="form-control mb-2 mr-sm-2"
                                                    placeholder="Your Answer" name="numberPieces" required onChange={this.handleInput} value={this.state.numberPieces} autoComplete="off" />
                                            </div>

                                            <div className="inputBlock-line">
                                                <div className="freebirdFormviewerViewItemsItemItemTitle" dir="auto" role="heading" aria-level="2" >วันที่ตรวจรับ </div>
                                                <input type="date" className="form-control mb-2 mr-sm-2"
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

                                        </div>
                                    ) : (<div>
                                        <div className="inputBlock-line">
                                            <div className="freebirdFormviewerViewItemsItemItemTitle" dir="auto" role="heading" aria-level="2" >รหัสครุภัณฑ์</div>
                                            - {this.state.durableCode}

                                        </div>

                                        <div className="inputBlock-line">
                                            <div className="freebirdFormviewerViewItemsItemItemTitle" dir="auto" role="heading" aria-level="2" >รายการ </div>
                                            - {this.state.listMaterial}
                                        </div>

                                        <div className="inputBlock-line">
                                            <div className="freebirdFormviewerViewItemsItemItemTitle" dir="auto" role="heading" aria-level="2" >คณะ/หน่วยงาน </div>
                                            - {this.state.department}
                                        </div>

                                        <div className="inputBlock-line">
                                            <div className="freebirdFormviewerViewItemsItemItemTitle" dir="auto" role="heading" aria-level="2" >ยี่ห้อ/ชนิด/ขนาด/คุณลักษณะ </div>
                                            - {this.state.attribute}
                                        </div>

                                        <div className="inputBlock-line">
                                            <div className="freebirdFormviewerViewItemsItemItemTitle" dir="auto" role="heading" aria-level="2" >หมายเลขเครื่อง </div>
                                            - {this.state.serialNumber}
                                        </div>

                                        <div className="inputBlock-line">
                                            <div className="freebirdFormviewerViewItemsItemItemTitle" dir="auto" role="heading" aria-level="2" >ราคาต่อหน่วย </div>
                                            - {this.state.price}
                                        </div>

                                        <div className="inputBlock-line">
                                            <div className="freebirdFormviewerViewItemsItemItemTitle" dir="auto" role="heading" aria-level="2" >จำนวน </div>
                                            - {this.state.numberPieces}
                                        </div>

                                        <div className="inputBlock-line">
                                            <div className="freebirdFormviewerViewItemsItemItemTitle" dir="auto" role="heading" aria-level="2" >วันที่ตรวจรับ </div>
                                            - {this.state.dateAccept}
                                        </div>

                                        <div className="inputBlock-line">
                                            <div className="freebirdFormviewerViewItemsItemItemTitle" dir="auto" role="heading" aria-level="2" >ชื่อผู้เบิกครุภัณฑ์ </div>
                                            - {this.state.namePickUp}
                                        </div>

                                        <div className="inputBlock-line">
                                            <div className="freebirdFormviewerViewItemsItemItemTitle" dir="auto" role="heading" aria-level="2" >บริษัท/ห้างร้าน/ที่จัดซื้อ </div>
                                            - {this.state.company}

                                        </div>

                                    </div>)}


                                    <div className="inputBlock-line">
                                        <div className="freebirdFormviewerViewItemsItemItemTitle" dir="auto" role="heading" aria-level="2" >สถานที่เก็บ </div>
                                        <input type="text" className="form-control mb-2 mr-sm-2"
                                            placeholder="Your Answer" name="storageLocation" required onChange={this.handleInput} value={this.state.storageLocation} autoComplete="off" />
                                    </div>

                                    <div className="inputBlock-line">
                                        <div className="freebirdFormviewerViewItemsItemItemTitle" dir="auto" role="heading" aria-level="2" >สถานะครุภัณฑ์ </div>
                                        <div className="inputBlock-line">
                                            <div className="custom-control custom-radio">
                                                <input type="radio" id="ปกติ" name="materialStatus" checked={this.state.materialStatus === 'ปกติ' && this.state.other === ""} className="custom-control-input" defaultValue="ปกติ" onChange={this.handleInput}></input>
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

                                                <input type="radio" id="อื่น ๆ" name="materialStatus" checked={this.state.other !== ''} className="custom-control-input" value="อื่น ๆ" onChange={this.handleInput}></input>
                                                <label className="custom-control-label" htmlFor="อื่น ๆ">อื่น ๆ</label>
                                                <input type="text" className="form-control"
                                                    name="other" onChange={this.handleInputOther} value={this.state.other} autoComplete="off" />

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
                        {localStorage.getItem('username') === "admin" ? <div className="inputBlock-line">
                            <div className="float-right">
                                <button type="button" className="btn btn-danger mb-2" onClick={async (e) => {
                                    e.preventDefault()

                                    await firebase.database().ref("myURL/" + this.state.idMaterial).remove()
                                    this.props.history.push('/')
                                }}>Remove</button>
                            </div>
                        </div> : (<div></div>)}

                    </div>

                </div>


            </div>
        )
    }
}