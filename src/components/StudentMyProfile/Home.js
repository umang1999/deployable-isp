import React from 'react'
import logo from '../Login/logo.png'
import './StudentMyProfile.css';
import {Button} from 'react-bootstrap';
export default function Home(props) {
    console.log(props);
    return (
        <div>
            <div className="home">
                <div className="profile">
                    <div className="profile_inner">
                        <div className="profile_img">
                            <img src={logo} alt=""/>
                        </div>
                        <div className="name">
                            <h1>Welcome , {!props.data?null:props.data.name} </h1>
                            
                        </div>
                    </div>
                </div>
                <div className="details">
                    <div className="status">
                        <h4>Current Status</h4>
                        <div className="status_details">
                            <div className="det">
                                <h4 style={{padding:"20px"}}>{!props.data?null:props.data.applicationStatus}</h4>
                                { props.data && props.data.applicationStatus==="Returned"  ? <h4 style={{padding:"20px"}}>{props.data.statusComment}</h4> : null }
                            </div>
                            <div>
                                
                                {!props.data?null:props.data.applicationStatus==='Not Submitted' || props.data.applicationStatus==='Returned'  ? <Button onClick ={()=>{window.location.href = "https://iitp-isa.netlify.app/stuinfo/"+props.data._id}} >Submit Application</Button> : null }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
