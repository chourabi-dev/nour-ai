 
import React from 'react';
import { Link } from 'react-router-dom'; 
import SideNav from '../components/SideNav';

class AddCondidate extends React.Component{
  constructor(props){
    super(props);
    this.state = {
        user: null, 


        messageRes:'',


        fullname:'',
        email:'',
        note:'',
        
        
        description:'',
        id: props.match.params.id
        
    }
  }



  getConnectedUserData(){
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", localStorage.getItem('token'));
    
 
    var requestOptions = {
      method: 'GET',
      headers: myHeaders, 
      redirect: 'follow'
    };
    
    fetch("http://localhost:8080/api/user/connected", requestOptions)
      .then(response => response.json())
      .then(result => { this.setState({user:result}) })
      .catch(error => console.log('error', error));
  }


  componentDidMount(){
      this.getConnectedUserData(); 
  }


  addCondidate(){
      const intervention = { 
        fullname:this.state.fullname,
        email:this.state.email,
        add_date: new Date(),
        note:this.state.note,
        didPassMeet: false
      }

      let url = 'http://localhost:8080/api/condidate/add';

      var myHeaders = new Headers();

      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("Authorization", localStorage.getItem('token'));
  
      var raw = JSON.stringify(intervention);

      var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
      };

      fetch(url, requestOptions)
      .then(response => response.json())
      .then(result =>{
          console.log(result)

          if (result.success === true) {
            this.setState({
                isInserted: true,
                messageRes:result.message
            })
        }
           
      })
      .catch(error => console.log('error', error));

  }

 


  render(){
    return (
        <div id="wrapper">

        <SideNav />

        <div id="content-wrapper" class="d-flex flex-column">
 
            <div id="content">

                
                <nav class="navbar navbar-expand navbar-light bg-white topbar mb-4 static-top shadow">

                     
                    <button id="sidebarToggleTop" class="btn btn-link d-md-none rounded-circle mr-3">
                        <i class="fa fa-bars"></i>
                    </button>

                     
                     
                    <ul class="navbar-nav ml-auto">

                         

                         

                         

                        <div class="topbar-divider d-none d-sm-block"></div>

                         
                        <li class="nav-item dropdown no-arrow">
                            <a class="nav-link dropdown-toggle" href="#" id="userDropdown" role="button"
                                data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                <span class="mr-2 d-none d-lg-inline text-gray-600 small">
                                    {
                                        this.state.user === null ?
                                        'chargement...':
                                        this.state.user.fullname
                                    }
                                </span>
                                
                            </a>
                           
                             
                        </li>

                    </ul>

                </nav>
                 
                <div class="container-fluid">

                    
                    <div class="d-sm-flex align-items-center justify-content-between mb-4">
                        <h1 class="h3 mb-0 text-gray-800">Intervention</h1>
                        <Link to="/condidatures"   class="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm"><i class="fas fa-arrow-left fa-sm text-white-50"></i> Retour</Link>
                    </div>



                    <div class="card shadow mb-4">
                        <div class="card-header py-3">
                            <h6 class="m-0 font-weight-bold text-primary">Ajout d'une intervention</h6>
                        </div>
                        <div class="card-body">
                             <form onSubmit={ (e)=>{
                                 e.preventDefault();
                                 this.addCondidate()
                             } } >
                                
                                <div className="mb-3">
                                    <label>Nom & prénom</label>
                                    <input type="text" className="form-control" value={ this.state.fullname } onChange={ (e)=>{ this.setState({fullname:e.target.value}) } } />
                                    <p className="text-danger">{this.state.errMsgMarque}</p>
                                 </div>
                                 <div className="mb-3">
                                    <label>Email</label>
                                    <input type="email" className="form-control" value={ this.state.email } onChange={ (e)=>{ this.setState({email:e.target.value}) } } />
                                    <p className="text-danger">{this.state.errMsgMarque}</p>
                                 </div>
                                 


                                 <div className="mb-3">
                                    <label>Note</label>
                                    <textarea type="text" className="form-control" value={ this.state.note } onChange={ (e)=>{ this.setState({note:e.target.value}) } } ></textarea>
                                    <p className="text-danger">{this.state.errMsgMarque}</p>
                                 </div>


                                 <div className="mb-3">
                                     <button className="btn btn-primary" type="submit">Ajouter</button>
                                 </div>

                                 
                                
                                 {
                                     this.state.messageRes != '' ?
                                        <div className="alert alert-success">
                                            { this.state.messageRes }
                                        </div>
                                      :<div></div>  
                                 }
                                 
                                 
                             </form>
                        </div>
                    </div>



                </div> 

            </div> 
            <footer class="sticky-footer bg-white">
                <div class="container my-auto">
                    <div class="copyright text-center my-auto">
                        <span>Copyright &copy; Your Website 2020</span>
                    </div>
                </div>
            </footer> 

        </div> 

    </div>
    );
  }
}

export default AddCondidate;
