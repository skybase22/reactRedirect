import React, { Component } from 'react'
// import { firebase } from '../firebase'
import axios from 'axios'
export default class Login extends Component {

    state = {
        username: "",
        password: "",
        hashPassword: "",
        isLogin: false,
        dataSoap: {},
        waitLogin: true
    }

    handleInput = (event) => {
        this.setState({ [event.target.name]: event.target.value })
    }

    onSubmit = async (event) => {
        event.preventDefault()

        this.setState({
            waitLogin: false
        })

        await axios({
            method: 'post',
            url: 'https://psum.herokuapp.com/api',
            headers: {},
            data: {
                "username": this.state.username,
                "password": this.state.password
            }
        }).then(res => {
            var numbers = /^[0-9]+$/;
            const data = res.data
            if (data === "wrong user or password") {
                this.setState({
                    waitLogin: true
                })
                alert("Your username or password are wrong!")
            }
            else if (!(numbers.test(this.state.username))) {
                var userSplit = this.state.username.split(".", 1)
                this.setState({ dataSoap: data });
                localStorage.setItem('username', userSplit)
                localStorage.setItem('isLogin', this.state.dataSoap.token)
                localStorage.setItem('name', this.state.dataSoap.username)
                var toPage = localStorage.getItem("from_page")
                var toId = localStorage.getItem("from_id")
                if (toPage !== null) {
                    if (toId !== null) {
                        this.props.history.push(toPage + "?id=" + toId)
                    } else {
                        this.props.history.push(toPage)
                    }
                }else {
                    this.props.history.push("/")
                }
            } else {
                this.setState({
                    waitLogin: true
                })
                alert("You don't have permission!")
            }

        }).catch(error => {
            this.setState({
                waitLogin: true
            })
            console.log((error));
            alert("Password wrong")
        });
        console.log("this ", this.state.dataSoap)
        // let database = firebase.database().ref("Addmin");
        //     database.once('value', async (snapshot) => {
        //                 if(this.state.username === snapshot.val().username && this.state.password === snapshot.val().password){
        //                     localStorage.setItem('isLogin', snapshot.val().hashpassword); 
        //                     this.props.history.push('/')            
        //                 }        
        //     })
    }

    render() {
        return (

            <div className="bodyLogin" style={{ height: "100vh !important" }}>
                <div className="container-fluid">
                    <div>
                        <img width="189" height="71"
                            src="https://www.phuket.psu.ac.th/wp-content/uploads/2019/03/cropped-PSU_PHUKET-EN.png"
                            data-src="https://www.phuket.psu.ac.th/wp-content/uploads/2019/03/cropped-PSU_PHUKET-EN.png"
                            className="custom-logo lazyloaded" alt="PSU Phuket" itemProp="logo"
                            data-srcset="https://www.phuket.psu.ac.th/wp-content/uploads/2019/03/cropped-PSU_PHUKET-EN.png 1895w, https://www.phuket.psu.ac.th/wp-content/uploads/2019/03/cropped-PSU_PHUKET-EN-300x113.png 300w, https://www.phuket.psu.ac.th/wp-content/uploads/2019/03/cropped-PSU_PHUKET-EN-768x289.png 768w, https://www.phuket.psu.ac.th/wp-content/uploads/2019/03/cropped-PSU_PHUKET-EN-1024x385.png 1024w, https://www.phuket.psu.ac.th/wp-content/uploads/2019/03/cropped-PSU_PHUKET-EN-350x132.png 350w"
                            data-sizes="(max-width: 1895px) 100vw, 1895px" sizes="(max-width: 1895px) 100vw, 1895px"
                            srcSet="https://www.phuket.psu.ac.th/wp-content/uploads/2019/03/cropped-PSU_PHUKET-EN.png 1895w, https://www.phuket.psu.ac.th/wp-content/uploads/2019/03/cropped-PSU_PHUKET-EN-300x113.png 300w, https://www.phuket.psu.ac.th/wp-content/uploads/2019/03/cropped-PSU_PHUKET-EN-768x289.png 768w, https://www.phuket.psu.ac.th/wp-content/uploads/2019/03/cropped-PSU_PHUKET-EN-1024x385.png 1024w, https://www.phuket.psu.ac.th/wp-content/uploads/2019/03/cropped-PSU_PHUKET-EN-350x132.png 350w" />
                        <div className="login-page">
                            <div className="form">
                                <form className="login-form" onSubmit={this.onSubmit}>
                                    <input type="text" placeholder="username" autoFocus="autoFocus" autoComplete="username" value={this.state.username} onChange={
                                        (e) => {
                                            this.setState({ username: e.target.value })
                                        }
                                    } />
                                    <input type="password" placeholder="password" value={this.state.password} name="password" autoComplete="password" onChange={this.handleInput} />
                                    {this.state.waitLogin ? (<button type="buuton" className="btn">login</button>)
                                        : <div className="spinner-border" role="status">
                                            <span className="sr-only">.</span>
                                        </div>}

                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}