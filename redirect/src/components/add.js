import React, { Component } from 'react'
import { firebase } from '../firebase'

// import DatePicker from "react-datepicker";
export default class Add extends Component {

    constructor(props) {
        super(props)
        this.state = {
            isFetchLastNumber: false,
            lastNumber: null,
            error: false,
            durableCode: "",
            listMaterial: "",
            attribute: "",
            serialNumber: "",
            errorMessage: "",
            materialStatus: "",
            price: "",
            storageLocation: "",
            numberPieces: "",
            dateAccept: "",
            namePickUp: "",
            company: "",

        }
    }



    handleInput = (event) => {
        this.setState({ [event.target.name]: event.target.value })
    }

    componentDidMount = async () => {
        await firebase.database().ref("listNumber").once('value', async (snapshot) => {
            if (snapshot.exists()) {
                await this.setState({ lastNumber: parseInt(snapshot.val().number) })
            } else {
                await this.setState({ error: true })
            }
        })
    }
    onUpdate = async (event) => {
        event.preventDefault()
        if (this.state.lastNumber !== null && this.state.errorMessage === "") {
            let newNumber = this.state.lastNumber + 1
            var firebaseRef = firebase.database().ref(`myURL/${newNumber.toLocaleString(undefined, { minimumIntegerDigits: 5 }).replace(',', '')}`);
            let key = newNumber.toLocaleString(undefined, { minimumIntegerDigits: 5 }).replace(',', '')
            firebaseRef.set({
                id: key,
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
            });
            var firebaseRef2 = firebase.database().ref(`listNumber`)
            await firebaseRef2.set({
                number: key
            }).then(() => {
            }
            );
            await firebaseRef2.once('value', async (snapshot) => {
                if (snapshot.exists()) {
                    await this.setState({ lastNumber: parseInt(snapshot.val().number) })
                }
            })
            this.setState({
                listMaterial: "",
                durableCode: "",
                attribute: "",
                serialNumber: "",
                materialStatus: "",
                price: "",
                storageLocation: "",
                numberPieces: "",
                dateAccept: "",
                namePickUp: "",
                company: ""
            })

            this.props.history.push('/')
        }
    }

    // selectImage = async (e) => {
    //     if (e.target.files[0]) {
    //         const image = e.target.files[0]
    //         this.setState(() => ({ image }))
    //     }
    // }

    render() {

        return (

            <div className="container-fluid">

                <div style={{ margin: "20px" }}>
                    <h2 className="text-center">Add Material</h2>
                </div>

                <div className="row justify-content-center">

                    <div className="col-auto" >


                        <form className="inputBlock" onSubmit={this.onUpdate}>
                            <div style={{}} className="shadow p-3 mb-5 bg-white rounded">
                                <div className="inputBlock-line">
                                    <div className="freebirdFormviewerViewItemsItemItemTitle" dir="auto" role="heading" aria-level="2" >รหัสครุภัณฑ์ </div>
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
                                    <input type="date" className="form-control mb-2 mr-sm-2"
                                        placeholder={new Date().getDate() + "/" + (new Date().getMonth() + 1) + "/" + new Date().getFullYear()} name="dateAccept" required onChange={this.handleInput} value={this.state.dateAccept} autoComplete="off" />
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
                                            <input type="radio" id="materialStatus1" required name="materialStatus" className="custom-control-input" value="ปกติ" onChange={this.handleInput}></input>
                                            <label className="custom-control-label" htmlFor="materialStatus1">ปกติ</label>
                                        </div>
                                    </div>
                                    <div className="inputBlock-line">
                                        <div className="custom-control custom-radio">
                                            <input type="radio" id="materialStatus2" required name="materialStatus" className="custom-control-input" value="ชำรุด" onChange={this.handleInput}></input>
                                            <label className="custom-control-label" htmlFor="materialStatus2">ชำรุด</label>
                                        </div>
                                    </div>
                                    <div className="inputBlock-line">
                                        <div className="custom-control custom-radio">
                                            <input type="radio" id="materialStatus3" required name="materialStatus" className="custom-control-input" value="รอจำหน่าย" onChange={this.handleInput}></input>
                                            <label className="custom-control-label" htmlFor="materialStatus3">รอจำหน่าย</label>
                                        </div>
                                    </div>
                                    <div className="inputBlock-line">
                                        <div className="custom-control custom-radio">
                                            <input type="radio" id="materialStatus4" required name="materialStatus" className="custom-control-input" value="โอนย้าย" onChange={this.handleInput}></input>
                                            <label className="custom-control-label" htmlFor="materialStatus4">โอนย้าย</label>

                                        </div>
                                    </div>
                                </div>

                                <div className="inputBlock-line">

                                    <div className="row justify-content-center">

                                        <div className="col-center">
                                            <button type="submit" className="btn btn-primary mb-2" style={{ width: "100px" }}>SUBMIT</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </form>



                    </div>

                </div>
            </div>
        )
    }
}