


class Landing extends Component{
  render() {
    return(
      <div>
        
      
      <div class="overlay"></div>

  


      <div class="right row h-100">
        
      
        <div class="col-md-4 ">
        <div class="masthead">
          <div class="masthead-bg"></div>
          <div class="container h-100">
            <div class="row h-100">
              <div class="col-12 my-auto">
                <div class="masthead-content py-5 py-md-0">
                  <h1 class="mb-3 text-center text-white">Supervisore</h1>
                  <div class="input-group mb-3">
                    <div class="input-group-prepend">
                      <span class="input-group-text" id="basic-addon1">@</span>
                    </div>
                    <input type="text" class="form-control" placeholder="Username" aria-label="Username" aria-describedby="basic-addon1"/>
                  </div>
                  <div class="input-group mb-3">
                    <div class="input-group-prepend">
                      <span class="input-group-text" id="basic-addon1">@</span>
                    </div>
                    <input type="text" class="form-control" placeholder="Password" aria-label="Username" aria-describedby="basic-addon1"/>
                  </div>
                  </div>
                </div>
              </div>
            </div>
          </div>  
        
      </div>
      
      <div class="col-md-8">
       
        <div class="d-flex justify-content-center h-100">
          <div class="masthead text-center">
         
            <div class="container h-100">
              
              <div class="row h-100">
                <div class="col-12 my-auto">
                  <div class="masthead-content py-5 py-md-0">
                    <h1 class="mb-3 text-center">Studente</h1>
                    <div id="my-signin2" class="d-flex justify-content-center"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div> 
      
      
        <div class="social-icons">
          <ul class="list-unstyled text-center mb-0">
            <li>
              <a href="#">
                <i class="fab fa-linkedin"></i>
              </a>
            </li>
          </ul>
        </div>
      </div>
      </div>
      </div>
      </div>
    ) 
  }
}






  <meta charset="utf-8"/>
  <meta className="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no"/>
  <meta className="description" content=""/>
  <meta className="author" content=""/>

  <title>SignFix - Registro elettronico</title>


  <link href="vendor/bootstrap/css/bootstrap.min.css" rel="stylesheet"/>


  <link href="https://fonts.googleapis.com/css?family=Source+Sans+Pro:200,200i,300,300i,400,400i,600,600i,700,700i,900,900i" rel="stylesheet"/>
  <link href="https://fonts.googleapis.com/css?family=Merriweather:300,300i,400,400i,700,700i,900,900i" rel="stylesheet"/>
  <link href="vendor/fontawesome-free/css/all.min.css" rel="stylesheet" type="text/css"/>

  
  <link href="css/coming-soon.css" rel="stylesheet"/>

  <meta name="google-signin-client_id" content="YOUR_CLIENT_ID.apps.googleusercontent.com"/>









function onSuccess(googleUser) {
  console.log('Logged in as: ' + googleUser.getBasicProfile().getName())
}
function onFailure(error) {
  console.log(error)
}
function renderButton() {
  gapi.signin2.render('my-signin2', {
    'scope': 'profile email',
    'width': 240,
    'height': 50,
    'longtitle': true,
    'theme': 'dark',
    'onsuccess': onSuccess,
    'onfailure': onFailure
  })
}


<script src="https://apis.google.com/js/platform.js?onload=renderButton" async defer/>


  <script src="vendor/jquery/jquery.min.js"/>                
  <script src="vendor/bootstrap/js/bootstrap.bundle.min.js"/>


  <script src="js/coming-soon.min.js"/>
