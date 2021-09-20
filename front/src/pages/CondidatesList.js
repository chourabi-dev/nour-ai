
 
import React from 'react';
import { Link } from 'react-router-dom';
import SideNav from '../components/SideNav';


class CondidaturesPage extends React.Component{
  constructor(props){
    super(props);
    this.state = {
        user: null,
        condiates:[],
        errMsg:''
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

      this.getList();
  }


  getList(){
    
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", localStorage.getItem('token'));
    
 
    var requestOptions = {
      method: 'GET',
      headers: myHeaders, 
      redirect: 'follow'
    };
    
    fetch("http://localhost:8080/api/condidate/list", requestOptions)
      .then(response => response.json())
      .then(result => { this.setState({condiates:result.data}) })
      .catch(error => console.log('error', error));
  }



  copieLink(link)
  {
     
 
  navigator.clipboard.writeText(link);
  
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
                        <h1 class="h3 mb-0 text-gray-800">Mes condidature(s)</h1>
                        <Link to="/condidatures/add"   class="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm"><i class="fas fa-plus fa-sm text-white-50"></i> Ajouter un condidat</Link>
                    </div>

                    <div class="card shadow mb-4">
                        <div class="card-header py-3">
                            <h6 class="m-0 font-weight-bold text-primary">List</h6>
                        </div>


                        <div class="card-body">
                            <div class="table-responsive">
                                
                                {
                                    this.state.errMsg !== '' ?
                                    <div className="alert alert-danger">
                                        { this.state.errMsg }
                                    </div>
                                    :
                                    <div></div>

                                }
                                <table class="table table-bordered" id="dataTable" width="100%" cellspacing="0">
                                    <thead>
                                    
                                        <tr>
                                            <th>Nom & prénom</th> 
                                            <th>Email</th> 
                                            <th>Note</th> 
                                            <th>Lien meet:</th> 
                                            
                                            
                                            
                                            <th>Actions</th> 

                                        </tr>
                                    </thead>
                                 
                                    <tbody> 


                                        {
                                             this.state.condiates.map((c)=>{
                                                return (
                                                    <tr> 
                                                        <td> {c.fullname} </td>
                                                        <td> {c.email} </td>
                                                        <td> {c.note} </td>
                                                        <td> <span className="badge bg-warning text-dark" onClick={ ()=>{this.copieLink('http://localhost:3000/meet/'+c._id) } } >copier lien</span>  </td>
                                                        

                                                        {
                                                            /**
                                                             * <ul>
                                                                                {
                                                                                    this.state.result.map((e) => {
                                                                                        return (
                                                                                            <li>
                                                                                                <label> <strong>{e.expression} : {((e.result / this.state.savedFaceStates.length) * 100)} %</strong> </label>
                                                                                                <div class="progress">
                                                                                                    <div class="progress-bar" role="progressbar" style={{ width: ((e.result / this.state.savedFaceStates.length) * 100) + '%' }} aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
                                                                                                </div>
                                                                                            </li>

                                                                                        );
                                                                                    })
                                                                                }
                                                                            </ul>
                                                             */
                                                        }
                                                        
                                                         
                                                             
                                                        <td>
                                                            {
                                                                c.didPassMeet === false ?
                                                                <button className="btn btn-primary btn-sm" onClick={ ()=>{} }>Envoyer meet mail</button>
                                                                : 
                                                                <Link className="btn btn-success btn-sm" to={ '/condidatures/meet-result/'+c._id } >Voir resultat</Link>
                                                                
                                                            }
                                                        </td>
                                                        
                                                    </tr>
                                                );
                                            })
                                        }
                                        
                                    </tbody>
                                </table>
                            </div>
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

export default CondidaturesPage;
