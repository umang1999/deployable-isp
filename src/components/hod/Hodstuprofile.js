import React ,{useEffect,useState} from 'react'
import './Hod.css'
import Container from '@material-ui/core/Container'
import Label from '@material-ui/core/InputLabel'
import Modal from 'react-modal'
import {Link} from 'react-router-dom'
export default function StudentProfile(props) {
    const [modalIsOpen,setModalIsOpen] =useState(false)
    const [user , setUser] = useState({})
    const[notesheet , setNotesheet] = useState(null);
    const [rejectModal , setRejectModal] = useState(false);
    const [message , setMessage] = useState('');
    useEffect(() => {
        
        const id = props.match.params.id;
        const address = 'https://iitp-isa-portal-backend.herokuapp.com/backend/applicant/profile/'+id;
        fetch(address , {
            method : "get"
        })
        .then(res => {
            if(res.ok)
            return res.json();
            else throw Error("Something went wrong , please try again later")
        })
        .then(data => {
            console.log(data.applicantDetails)
            setUser(data.applicantDetails);
            console.log(user);
        })
        .catch(err => console.log(err))

     
    },[])

   const handleReject = () => {
    const address = 'https://iitp-isa-portal-backend.herokuapp.com/backend/department/rejectApplication/'+props.match.params.hid;
    fetch(address, {
        headers : {
            "Content-Type":"application/json"
        },
        method:'PATCH',
        body : JSON.stringify({
            applicantId : user._id
        })
    })
    .then(res => {
        if(res.ok)
        return res.json()
        else throw new Error("Something went wrong, please try again later")
    })
    .then(data => {
        console.log(data)
        if(data.status==="Application rejected")
        alert("The Application is rejected");
    })
    .catch(err=>{
        console.log(err)
    })
   }
   const handleAccept = () => {
       console.log(notesheet);
       const formdata = new FormData();
       formdata.append(
        "noteSheet",
        notesheet,
        "notesheet+"+user._id+".pdf"
      );
    const address = 'https://iitp-isa-portal-backend.herokuapp.com/backend/department/noteSheetsUpload/'+user._id;
    fetch(address, {
        method:'PATCH',
        body : formdata
    })
    .then(res => {
        if(res.ok)
        return res.json();
        else throw new Error("Something went wrong")
    })
    .then(data => {
        console.log(data)
        // if(data.message==="Notesheet Uploaded")
        const address = "https://iitp-isa-portal-backend.herokuapp.com/backend/department/acceptApplication/"+props.match.params.hid;
        console.log(user._id);
        fetch(address,{
            headers : {
                "Content-Type":"application/json"
            },
            method : 'PATCH',
            body : JSON.stringify({
                applicantId : user._id
            })
        })
        .then(res => {
            // console.log(res.json().body)
            if(res.ok)
            return res.json()
            else 
            throw new Error("Something went Wrong")
        })
        .then(data => {
            console.log(data)
            setModalIsOpen(false)
            if(data.message === "NoteSheet Uploaded and Mailed to Pic and Acad Section")
            alert("The application was accepted successfully")
            else alert("Something went wrong, please try again")
        })
        .catch(err => {
            console.log(err)
        })

    })
    .catch(err=>{
        console.log(err)
    })
   }

    return (
        <div>
             <div style={{float:"left",marginTop:"20px",marginLeft:"35px"}} >
                <button className="pic_btn" onClick={()=>{window.location.href="https://iitp-isa.netlify.app/hodwindow/"+props.match.params.hid}}>Home</button>
            </div>
            { user.applicationStatus === "Forwarded" ? (
            <div className="row" style={{float:"right",marginTop:"20px",marginRight:"10px"}}>
                
                <button className="pic_btn" onClick={()=>setRejectModal(true)}>Reject</button>
                <button className="pic_btn" onClick={()=>setModalIsOpen(true)}>Accept</button>
            </div>) : null}
            <Modal toggle={()=>{setModalIsOpen(false)}} isOpen={modalIsOpen} className="modal_stu">
            <p className="modal_para"><strong className="mt-5 modal_text">Upload Notesheet</strong></p>
            <input onChange={(e)=>{
                setNotesheet(e.target.files[0])
            }} type="file" className="modal_textarea" placeholder="Upload Notesheet" />
            <div className="row text-center py-5 button_div">
            
                 <button onClick={handleAccept}  className="pic_btn">Submit</button>
            
            
                <Link> <button  className="pic_btn" onClick={()=>setModalIsOpen(false)}>No</button></Link>
            
            </div>
            </Modal> 
            <Modal toggle={()=>{setRejectModal(false)}} isOpen={rejectModal} className="modal_stu">
            <p className="modal_para"><strong className="mt-5 modal_text">Reject Messaage</strong></p>
            <input value={message} onChange={(e)=>{
                setMessage(e.target.value)
            }} type="textarea" className="modal_textarea" placeholder="Rejection Message" />
            <div className="row text-center py-5 button_div">
            
                <Link to="/"> <button onClick={handleReject}  className="pic_btn">Reject</button></Link>
            
            
                <Link> <button  className="pic_btn" onClick={()=>setRejectModal(false)}>No</button></Link>
            
            </div>
            </Modal>

            <div className="row">
               
               
                   <div className="p-5 si_div">
                       <h1 className="text-center si_subhead">Student Information</h1>
                       <div className="row">
                           <div className="col-sm-6 text-center">
                               <Label>Name of the Applicant:</Label>
                               <p className="textfield para_profile" name="name"  >{user.name}</p>
                           </div>
                           <div className="col-sm-6 text-center">
                           <Label>Date of Birth: </Label>
                               <p className="textfield para_profile" name="dob">{user.dob}</p>
                           </div>
                           
                       </div>
                       <div className="row mt-5">
                       <div className="col-sm-6 text-center">
                           <Label>Nationality:</Label>
                               <p className="textfield para_profile" name="nationality"  >{user.nationality}</p>
                           </div>
                           <div className="col-sm-6 text-center">
                           <Label>Gender:</Label>
                               <p className="textfield para_profile" select name="gender"  >{user.gender}</p>
                           </div>
                       </div>
                       <div className="row mt-5">
                           
                           <div className="col-sm-6 text-center">
                           <Label>Program (M-Tech/Ph.D.):</Label>
                               <p className="textfield para_profile" name="program"   >{user.program}</p>
                           </div>
                           <div className="col-sm-6 text-center">
                           <Label>Category:(Self spons./Govt. Fellowship)</Label>
                               <p className="textfield para_profile" name="category"   >{user.category}</p>
                           </div>
                           <div className="col-sm-6 text-center">
                           <Label>Department</Label>
                               <p className="textfield para_profile" name="category"   >{user.department}</p>
                           </div>
                       </div>
                   </div>
               
                     
                  
               
           </div>
       <div>
         
          
       { user.contactDetails!=undefined ?  (<div className="p-5 si_div">
                <h1 className="text-center si_subhead">Contact Details</h1>
                <div className="row">
                            <div className="col-sm-6 text-center">
                                <Label>Present address</Label>
                                <p className="textfield para_profile" name="presentadress">{user.contactDetails.presentAddress}</p>
                            </div>
                            <div className="col-sm-6 text-center">
                                <Label>Permanent Address</Label>
                                <p className="textfield para_profile" name="permanentAdress" >{user.contactDetails.permanentAddress}</p>
                            </div>
                        </div>
                        <div className="row">
                        <div className="col-sm-6 text-center">
                            <Label>Phone number</Label>
                                <p className="textfield para_profile" name="phonenum" >{user.contactDetails.mobileNumber}</p>
                            </div>
                            <div className="col-sm-6 text-center">
                            <Label>Email Id</Label>
                                <p className="textfield para_profile" type="email" name="email" >{user.contactDetails.email}</p>
                            </div>
                        </div>
                        <div className="row mt-5">
                            
                            <div className="col-sm-6 text-center">
                                <Label>Passport No.</Label>
                                <p className="textfield para_profile" name="pasno" >{user.contactDetails.passportNo}</p>
                            </div>
                           
                        </div>
            </div>) : null
             }
    </div>
    <div>
         
    { user.greScore!=undefined ? 
            (<div className="p-5 si_div">
                <h1 className="text-center si_subhead">Gre</h1>
                
                <div className="row">
                            <div className="col-sm-6 text-center">
                                <Label>Registeration No.</Label>
                                <p className="textfield para_profile" name="registerno">{user.greScore.registrationNo}</p>
                            </div>
                            <div className="col-sm-6 text-center">
                                <Label>Year</Label>
                                <p className="textfield para_profile" name="year" >{user.greScore.year}</p>
                            </div>
                            
                </div>
                <div className="row">
                <div className="col-sm-6 text-center">
                                <Label>Name of Institute</Label>
                                <p className="textfield para_profile" name="nameofinst">{user.greScore.institute}</p>
                            </div>
                            <div className="col-sm-6 text-center">
                                <Label>General Test Score </Label>
                                <p className="textfield para_profile" name="gts">{user.greScore.genTestScore}</p>
                            </div>

                </div>
                        <div className="row mt-5">
                            
                            <div className="col-sm-6 text-center">
                                <Label>Subject Test Score</Label>
                                <p className="textfield para_profile" name="sts">{user.greScore.subTestScore}</p>
                            </div>
                           
                </div>
            </div>) :  null
            }
         </div>
         <div>
         {user.toeflScore != undefined ? (
            <div className="p-5 si_div">
                <h1 className="text-center si_subhead">Tofel</h1>
                <div className="row">
                            <div className="col-sm-6 text-center">
                                <Label>REGISTERATION NO</Label>
                                <p className="textfield para_profile" name="registerno">{user.toeflScore.registrationNo}</p>
                            </div>
                            <div className="col-sm-6 text-center">
                            <Label>YEAR</Label> 
                                <p className="textfield para_profile" name="year" va>{user.toeflScore.year}</p>
                            </div>
                            
                </div>
                <div className="row">
                <div className="col-sm-6 text-center">
                            <Label>NAME OF INSTITUTE</Label>
                                <p className="textfield para_profile" name="nameofinst">{user.toeflScore.institute}</p>
                            </div>
                            <div className="col-sm-6 text-center">
                            <Label>LISTENING SCORE</Label>
                                <p className="textfield para_profile" name="ls" >{user.toeflScore.listeningScore}</p>
                            </div>
                </div>
                <div className="row">
                            
                            <div className="col-sm-6 text-center">
                            <Label>READING SCORE</Label>
                                <p className="textfield para_profile" name="rs" >{user.toeflScore.readingScore}</p>
                            </div>
                            <div className="col-sm-6 text-center">
                            <Label>SPEAKING SCORE</Label>
                                <p className="textfield para_profile" name="ss" >{user.toeflScore.speakingScore}</p>
                            </div>
                </div>
                <div className="row">
                            <div className="col-sm-6 text-center">
                            <Label>Writing Score</Label>
                                <p className="textfield para_profile" name="ws" >{user.toeflScore.writingScore}</p>
                            </div>
                            <div className="col-sm-6 text-center">
                            <Label>Test Score</Label>
                                <p className="textfield para_profile" name="ts" >{user.toeflScore.totalScore}</p>
                            </div>
                            
                </div>
            </div>
            
             )
            :null}
        
         
         </div>
         {
             user.academicQualification!=undefined ? (
                <Container>
                <h1 className="my-5">Academic Qualifications</h1>
             {user.academicQualification.map(quals => {

                return (
                    <>
                    <form>
                       
                            <div>
                                <Label>Degree Specialization</Label>
                                <p className="para_profile">{quals.degree}</p>
                                <Label>School/College</Label>
                                <p className="para_profile">{quals.schoolOrCollege}</p>
                                <Label>University/Board</Label>
                                <p className="para_profile">{quals.boardOrUniversity} </p>
                                <Label>year</Label>
                                <p className="para_profile">{quals.year}</p>
                                <Label>Percentage/CGPA/CPI</Label>
                                <p className="para_profile">{quals.percentageOrCgpa}</p><br/>
                             </div>
                        </form>
                        <hr width="75%"/>
                    </>
                
                )
             })}
             </Container>
            ):null}
    {user.professionalExperience!=undefined ? (
        <Container>
            <h1 className="my-5">Professional Experience</h1>

            {
                user.professionalExperience.map(experience => {
                    return( <form>
                
                        <div>
                        
                             <Label>Organization</Label>
                             <p className="para_profile" ame="organization" >{experience.organization}</p>
                             <Label>Position Held</Label><p className="para_profile" name="positionHeld">{experience.positionHeld}</p>
                             <Label>Period (From/to)</Label>
                             <p className="para_profile" name="period" >{experience.period}</p>
                            <br/>
                            
                        </div>
                   
                </form>)
               
            })
                }
            
        </Container>) : null }
        {user.refereeDetails!=undefined ? (
        <Container>
            <h1 className="my-5">Refree Details</h1>
            {
                user.refereeDetails.map(refree=> (<form>
                
                    <div>
                        <Label>Name</Label>
                        <p className="para_profile">{refree.name}</p>
                        <Label>Position</Label>
                        <p className="para_profile" name="position">{refree.position}</p>
                        <Label>organization</Label>
                        <p className="para_profile"
                        name="organization">{refree.organization}</p>
                        <Label>Email Id</Label>
                        <p className="para_profile" name="email">{refree.email}</p>
                        <Label>Contact</Label>
                        <p className="para_profile" name="contact">{refree.phoneNo}</p>
                        <br/>
                    </div>
                </form>))
            
            }    
        </Container>) : null}
        <Container>
            <h1>Uploaded Documents</h1>
            <div className="row">
            <div className="col-md-4 p-5">
            <div className="row text-center">
                <div className="form-group upload_form ">
                    <label>Mark Sheets/certificates(from class X to Highest degree obtained/appeared)(both sides)</label>
                    <h3 name="uploadMarksheets">uploaded file</h3>
                    <a target="blank" href={user.markSheets}><i className="fa fa-download"></i></a>
                </div>
            </div>
            </div>
            <div className="col-md-4 p-5">
            <div className="row text-center">
                <div className="form-group upload_form">
                    <label>GRE & TOEFL(if any)</label>
                    <h3 name="uploadGreToefl">uploaded file</h3>
                    <a target="blank" href={user.otherExamCertificates}><i className="fa fa-download"></i></a>
                </div>
            </div>
            </div>
            <div className="col-md-4 p-5">
            <div className="row m-3 text-center">
                <div className="form-group upload_form">
                    <label>Certificate related to any fellowship (both sides)</label>
                    <h3 name="uploadFellowshipDocuments">uploaded file</h3>
                    <a target="blank" href={user.fellowshipCertificates}><i className="fa fa-download"></i></a>
                </div>
            </div>
            </div>
            </div>


            <div className="row">
            <div className="col-md-4 p-5">
            <div className="row text-center">
                <div className="form-group upload_form ">
                    <label>Professional experience certificate (if any)(both sides)</label>
                    <h3 name="uploadProfessionalExperience">uploaded file</h3>
                    <a target="blank" href={user.profExperienceCertificates}><i className="fa fa-download"></i></a>
                </div>
            </div>
            </div>
            <div className="col-md-4 p-5">
            <div className="row text-center">
                <div className="form-group upload_form">
                    <label>Passport (1 st and last page)</label>
                    
                    <h3 name="uploadPassport">uploaded file</h3>
                    <a target="blank" href={user.passportImages}><i className="fa fa-download"></i></a>
                </div>
            </div>
            </div>
            
            </div>
            
            
        </Container>
        </div>
    )
}
