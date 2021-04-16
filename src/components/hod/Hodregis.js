import React, { Component } from 'react'


import {Link} from 'react-router-dom';

export default class Registered extends Component {
    constructor(props){
        super();
        this.state={
            registered : []
        }
        this.clicking=this.clicking.bind(this)
    }
    
    clicking=files=>{
        console.log(files)
        this.props.history.push("/hodstuprofile")
    }
    componentDidMount() {
        const address = "http://localhost:5000/backend/department/forwarded/" + this.props.hid;
        fetch(address , {
            method:'get',
        })
        .then(res=>{
            if(res.ok)
                return res.json();
            else throw new Error ("Something went wrong, please try again later");    
        })
        .then(data=>{
            console.log(data)
            this.setState({registered : data.ForwardedApplicants.forwardedApplicants})
        })

        console.log(this.props);
    }
    render() {
        {console.log(this.state.registered)}
        const RenderApplicants = () => {
            console.log("helloooo")
            const applicants = this.state.registered.map((applicant)=>{
                const link = '/hodstuprofile/'+this.props.hid+"/"+applicant._id;
                console.log(link);
                return(
                    
                    <tr>
                            <td>{applicant.name}</td>
                            <td>{applicant.department}</td>
                            <td>{applicant.userName}</td>
                            <td><i className="fa fa-download"></i></td>
                            <td><Link to={`${link}`}><i className="fa fa-user"> view profile</i></Link></td>
                    </tr>
                    
                )
            })
            return applicants;
        }

        return (
            <div>
                <div className="container margintop">
                    
                    <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>Applicant Name</th>
                            <th>Department</th>
                            <th>Email</th>
                           
                        </tr>
                    </thead>
                        <tbody>
                        <RenderApplicants />
                        </tbody>
                    </table>
                    </div>
                </div> 
            
        )
    }
}
