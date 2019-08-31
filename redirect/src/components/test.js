import React, {Component} from 'react'

export default class Test extends Component{

    state={
        username:"",
        password:""
    }

    handleInput = (event) => {
        this.setState({[event.target.name]:event.target.value})
    }

    onSubmit = (event) => {
        event.preventDefault()
        this.props.history.push('/')
    }

    render(){
        return(
        <div className="bodyLogin">
        <div className="container-fluid">
            <div style={{margin: "10px"}}>
            {/* <img width="189" height="71"
                src="https://www.phuket.psu.ac.th/wp-content/uploads/2019/03/cropped-PSU_PHUKET-EN.png"
                data-src="https://www.phuket.psu.ac.th/wp-content/uploads/2019/03/cropped-PSU_PHUKET-EN.png"
                className="custom-logo lazyloaded" alt="PSU Phuket" itemProp="logo"
                data-srcSet="https://www.phuket.psu.ac.th/wp-content/uploads/2019/03/cropped-PSU_PHUKET-EN.png 1895w, https://www.phuket.psu.ac.th/wp-content/uploads/2019/03/cropped-PSU_PHUKET-EN-300x113.png 300w, https://www.phuket.psu.ac.th/wp-content/uploads/2019/03/cropped-PSU_PHUKET-EN-768x289.png 768w, https://www.phuket.psu.ac.th/wp-content/uploads/2019/03/cropped-PSU_PHUKET-EN-1024x385.png 1024w, https://www.phuket.psu.ac.th/wp-content/uploads/2019/03/cropped-PSU_PHUKET-EN-350x132.png 350w"
                data-sizes="(max-width: 1895px) 100vw, 1895px" sizes="(max-width: 1895px) 100vw, 1895px"
                srcSet="https://www.phuket.psu.ac.th/wp-content/uploads/2019/03/cropped-PSU_PHUKET-EN.png 1895w, https://www.phuket.psu.ac.th/wp-content/uploads/2019/03/cropped-PSU_PHUKET-EN-300x113.png 300w, https://www.phuket.psu.ac.th/wp-content/uploads/2019/03/cropped-PSU_PHUKET-EN-768x289.png 768w, https://www.phuket.psu.ac.th/wp-content/uploads/2019/03/cropped-PSU_PHUKET-EN-1024x385.png 1024w, https://www.phuket.psu.ac.th/wp-content/uploads/2019/03/cropped-PSU_PHUKET-EN-350x132.png 350w"/> */}
            <div className="login-page">
                <div className="form">
                    <form className="login-form" onSubmit={this.onSubmit}>
                        <input type="text" placeholder="username" autoFocus="autoFocus" value={this.state.username} onChange={
                            (e) => {
                                this.setState({username:e.target.value})
                            }
                        }/>
                        <input type="password" placeholder="password" value={this.state.password} name="password" onChange={this.handleInput}/>
                        <button type="submit" className="btn">login</button>
                    </form>
                </div>
            </div>
        </div>
      </div>
      </div>)
    }
}