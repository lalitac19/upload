import React from 'react';
import axios from "axios";

class App extends React.Component {
  constructor () {
  super();
  this.state = {
    file: null
  };

}

submitFile = (event) => {
   const formData = new FormData();
   formData.append('file', this.state.file, this.state.file.name);
   axios.post(`http://practice-upload-boots.s3-website-eu-west-1.amazonaws.com`, formData)
   .then(response => {
     // handle your response;
     console.log(response);
   }).catch(error => {
     // handle your error
     console.log('ERRORRRRR');
   });
 }

 handleFileUpload = (event) => {
   this.setState({file: event.target.files[0]});
 }

 render () {
   return (
     <div name = "upload">
     <form onSubmit={this.submitFile}>
       <input label='upload file' type='file' onChange={this.handleFileUpload.bind(this)} />
    <p>   <button type='submit' onClick ={this.submitFile}>Find Product</button></p>
     </form>
     </div>
   );
 }


}

export default App;
